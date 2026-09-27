/* 風の流れ（実験）の段階2：地形の構造の抽出（v4.122.0）。見ること:
 *   ①鞍部を**鞍部として**見つける（位置・稜線の向き・複数の縮尺で安定して見つかるか・地形明瞭度）
 *   ②横断角：稜線と風の角度（西風なら稜線に沿う＝小さい、南風なら稜線を真横に越える＝90°近く）
 *   ③谷・尾根の線を出す。計測表示に縮尺ごとの時間・鞍部の数
 *   ④⚠ **風は一切変えない**（地形解析を入れても切っても、流している格子・場・矢印は同じ）
 *   ⑤z15 付近でも格子を画面＋余白に絞る（数十万点にしない）
 * 偽の地形：東西 3km に高さ 800m の峰が2つ、間が鞍部（稜線は東西・抜ける向きは南北）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import zlib from 'node:zlib';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const NM = path.join(ROOT, 'tests/node_modules');
const UPLOT_JS = fs.readFileSync(NM + '/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(NM + '/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(NM + '/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(NM + '/leaflet/dist/leaflet.css', 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };
const pad = n => String(n).padStart(2, '0');
const hourKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    h.time.push(hourKey(new Date(start.getTime() + i * 3600e3)));
    h.temperature_2m.push(15); h.apparent_temperature.push(15); h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3); h.winddirection_10m.push(180);
    h.windgusts_10m.push(5); h.weathercode.push(1); h.cloudcover.push(30);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:30`); daily.sunset.push(`${ds}T17:40`);
  }
  return { hourly: h, daily, elevation: 500 };
}
/* 風の場の応答。気圧面の高さは**固定表と違う値**にしてある（冬の低い高度を想定）。
   固定表（850hPa=1,460m）で決めていたら当たらない値で答え合わせする */
const GH = { 925: 700, 900: 930, 850: 1400, 800: 1880, 700: 2950 };
const SPD = { '10m': 2, 925: 6, 900: 7, 850: 10, 800: 14, 700: 20 };
const DIR = { '10m': 180, 925: 250, 900: 260, 850: 270, 800: 280, 700: 290 };
let gsmFrom = Infinity;   // この時刻以降は 900/800 が null（GSM の期間）
function windResp(n, span) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (span === 'full' ? 3 : 1));
  const len = span === 'full' ? 264 : 96;
  const time = Array.from({ length: len }, (_, i) => hourKey(new Date(start.getTime() + i * 3600e3)));
  return Array.from({ length: n }, () => {
    const h = { time, wind_speed_10m: time.map(() => SPD['10m']), wind_direction_10m: time.map(() => DIR['10m']) };
    for (const p of [925, 900, 850, 800, 700]) {
      const gone = k => (p === 900 || p === 800) && new Date(time[k]).getTime() >= gsmFrom;
      h[`wind_speed_${p}hPa`] = time.map((_, k) => gone(k) ? null : SPD[p]);
      h[`wind_direction_${p}hPa`] = time.map((_, k) => gone(k) ? null : DIR[p]);
      h[`geopotential_height_${p}hPa`] = time.map((_, k) => gone(k) ? null : GH[p]);
    }
    return { elevation: 1000, hourly: h };   // モデル地形 1,000m
  });
}
// 地形表：基準標高はすべて 1,640m（850=1,400 と 800=1,880 のちょうど半分）
function terrainJson(zref = 1640) {
  const cells = {};
  for (let i = 100; i < 200; i++) for (let j = 100; j < 200; j++) cells[`${i},${j}`] = [zref, zref, zref + 300, zref - 300, 5000];
  return JSON.stringify({ version: 1, fields: ['p90s', 'p90', 'max', 'mean', 'n'], cells });
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => errors.push(e.message));
const windReqs = [];
const demReqs = [];
/* 偽の地形：中心（36.57, 137.65）の東西 3km に高さ 800m の峰（ガウス・幅 1.5km）が2つ。間が鞍部（約1,216m）。
   稜線は東西、鞍部を抜ける向きは南北。基盤は 1,000m */
const C_LAT = 36.57, C_LON = 137.65;
const TERRAIN = (lat, lon) => {
  const x = (lon - C_LON) * 111320 * Math.cos(C_LAT * Math.PI / 180), y = (lat - C_LAT) * 111320;
  const g = (dx, dy) => Math.exp(-(dx * dx + dy * dy) / (2 * 1500 * 1500));
  return 1000 + 800 * g(x + 3000, y) + 800 * g(x - 3000, y);
};
const CRC = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc32 = buf => { let c = -1; for (const b of buf) c = CRC[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]), crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const tileCache = new Map();
function demTile(z, tx, ty) {
  const key = `${z}/${tx}/${ty}`;
  if (tileCache.has(key)) return tileCache.get(key);
  const raw = Buffer.alloc(256 * (1 + 256 * 3));
  const n = Math.pow(2, z) * 256;
  for (let py = 0; py < 256; py++) {
    raw[py * 769] = 0;
    const my = (ty * 256 + py + 0.5) / n, lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * my))) * 180 / Math.PI;
    for (let px = 0; px < 256; px++) {
      const lon = (tx * 256 + px + 0.5) / n * 360 - 180, v = Math.round(TERRAIN(lat, lon) * 100), o = py * 769 + 1 + px * 3;
      raw[o] = v >> 16 & 255; raw[o + 1] = v >> 8 & 255; raw[o + 2] = v & 255;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(256, 0); ihdr.writeUInt32BE(256, 4); ihdr[8] = 8; ihdr[9] = 2;
  const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
  tileCache.set(key, png);
  return png;
}
const routeAll = route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('/data/terrain_ref.json')) return route.fulfill({ contentType: 'application/json', body: terrainJson() });
  if (url.includes('/xyz/dem_png/')) {
    demReqs.push(url);
    const [z, x, y] = url.match(/dem_png\/(\d+)\/(\d+)\/(\d+)/).slice(1).map(Number);
    return route.fulfill({ contentType: 'image/png', body: demTile(z, x, y), headers: { 'access-control-allow-origin': '*' } });
  }
  if (url.includes('api.open-meteo.com')) {
    const u = new URL(url);
    if (u.searchParams.get('hourly').includes('geopotential_height_850hPa') && u.searchParams.get('cell_selection')) {
      windReqs.push(url);
      const n = u.searchParams.get('latitude').split(',').length;
      const span = u.searchParams.get('forecast_days') === '8' ? 'full' : 'near';
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(windResp(n, span)),
        headers: { 'access-control-allow-origin': '*' } });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  }
  return route.fulfill({ status: 404, body: '' });
};
await page.route('**/*', routeAll);
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);





await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 13, { animate: false }); windGL.override = 1000; toggleOverlay('windFlowGL'); });
await page.waitForTimeout(2500);
const gridSig = () => page.evaluate(() => { const g = windGL.grid; let s = 0; for (let n = 0; n < g.u.length; n += 7) s += g.u[n] * 3 + g.v[n]; return s.toFixed(4) + ':' + g.cols + 'x' + g.rows; });
const fieldSig = () => page.evaluate(() => Array.from(lastWindField.u).join(',') + '|' + Array.from(lastWindField.v).join(','));
const g0 = await gridSig(), f0 = await fieldSig();
await page.evaluate(() => terrainToggle());
await page.waitForTimeout(2500);
await page.evaluate(() => terrainRefresh());
const r = await page.evaluate(() => {
  const res = terrainAn.result;
  const dist = g => Math.hypot((g.rep.lat - 36.57) * 111320, (g.rep.lon - 137.65) * 111320 * Math.cos(36.57 * Math.PI / 180));
  const near = res.groups.slice().sort((a, b) => dist(a) - dist(b))[0];
  return { ms: res.ms, loading: res.loading, scales: res.scales.map(s => s.sc.label), skipped: res.skipped,
    groups: res.groups.length, markers: terrainAn.markers.length,
    near: near && { d: dist(near), scales: near.scales, cons: near.scaleConsistency, clarity: near.clarity, score: near.saddleScore,
      prom: near.prominence, ridgeBear: Math.round(bearingOf(near.rep.ridge[0], near.rep.ridge[1]) % 180), cross: near.cross, h: near.rep.h },
    draw: terrainAn.drawStats, hud: document.getElementById('wind-hud-text').textContent };
});
ok(!r.loading && r.scales.length >= 3, '（前提）複数の縮尺で解析した', r);
ok(r.near && r.near.d < 400, '★★★鞍部を鞍部として見つける（中心から400m以内）', r.near);
ok(r.near && Math.abs(r.near.ridgeBear - 90) < 15, '★★稜線の向きは東西（方位90°・峰の並び）', r.near);
ok(r.near && r.near.scales.length >= 2 && r.near.cons >= 0.5, '★複数の縮尺で同じ鞍部が見つかる（scaleConsistency）', r.near);
ok(r.near && r.near.prom > 100 && r.near.score > 10, '★prominence・saddleScore が鞍部らしい大きさ', r.near);
ok(r.near && ['高', '中', '低'].includes(r.near.clarity), '地形明瞭度は高・中・低（％にしない）', r.near);
ok(r.markers > 0, '鞍部の◎を出す', r);
ok(r.near && r.near.cross != null && r.near.cross < 20, '★★西風は稜線に沿う（横断角が小さい）', r.near);
ok(/地形解析/.test(r.hud) && /ms/.test(r.hud), '計測表示に地形解析の時間と鞍部の数', r.hud);
const pop = await page.evaluate(() => { const g = terrainAn.result.groups[0]; return terrainSaddleText(g); });
ok(/地形明瞭度/.test(pop) && /横断角/.test(pop) && /補正していない/.test(pop) && !/%|％/.test(pop), '★鞍部の説明：明瞭度・横断角・補正していないと書く・％を出さない', pop);

// ④風は一切変えない
ok(await gridSig() === g0, '★★★地形解析を入れても流している格子は同じ（風を補正しない）');
ok(await fieldSig() === f0, '★★★場（buildWindField）も同じ');

// ②南風（地上10m・180°から）→ 稜線を真横に越える
await page.evaluate(() => setWindMode('10m'));
await page.waitForTimeout(1500);
const cross10 = await page.evaluate(() => {
  const dist = g => Math.hypot((g.rep.lat - 36.57) * 111320, (g.rep.lon - 137.65) * 111320 * Math.cos(36.57 * Math.PI / 180));
  const near = terrainAn.result.groups.slice().sort((a, b) => dist(a) - dist(b))[0];
  return near && near.cross;
});
ok(cross10 != null && cross10 > 75, '★★南風は稜線を真横に越える（横断角が90°近く）', cross10);
await page.evaluate(() => setWindMode('auto'));
await page.waitForTimeout(1200);

// 中心を解析（丸を付けた地点の検証に使う）
const probe = await page.evaluate(() => { terrainProbeCenter(); return windGL.lastMeasure; });
ok(/鞍部/.test(probe) && /saddleScore/.test(probe) && /scaleConsistency/.test(probe) && /横断角/.test(probe), '★「中心を解析」で縮尺ごとの分類・saddleScore・scaleConsistency・横断角', probe);
ok(/500m: 鞍部|1km: 鞍部|150m: 鞍部/.test(probe), '中心（鞍部）はどこかの縮尺で「鞍部」と出る', probe);

// 縮尺の切り替え
const sc = await page.evaluate(() => { const a = []; for (let k = 0; k < 5; k++) { terrainCycleScale(); a.push(terrainAn.scaleSel); } return a; });
ok(sc.join(',') === 's150,s500,s1k,s2500,auto', '縮尺を順に切り替えられる', sc);

// 切れば消える・風も元のまま
await page.evaluate(() => terrainToggle());
ok(await page.evaluate(() => terrainAn.markers.length === 0 && (!terrainAn.cv || terrainAn.cv.style.display === 'none')), '地形解析を切れば◎と線が消える');
ok(await gridSig() === g0, '切った後も流している格子は同じ');

// ⑤z15：格子を画面＋余白に絞る
await page.evaluate(() => { terrainToggle(); leafletMap.setZoom(15, { animate: false }); });
await page.waitForTimeout(3000);
const z15 = await page.evaluate(() => ({ nodes: windGL.grid.cols * windGL.grid.rows, step: windGL.grid.step,
  ms: windGL.terrain && windGL.terrain.ms, an: terrainAn.result && terrainAn.result.ms, scales: terrainAn.result && terrainAn.result.scales.map(s => s.sc.label + ':' + s.nx * s.ny) }));
ok(z15.nodes < 40000 && z15.step === 8, '★★z15 でも格子は画面＋余白だけ（8px のまま・数十万点にしない）', z15);
console.log('参考（ヘッドレス・PC）', JSON.stringify(z15), '/ z13 の解析', r.ms.toFixed(0) + 'ms');
ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('TERRAINAN SMOKE FAILED');
  process.exit(1);
}
console.log('TERRAINAN SMOKE PASSED');
