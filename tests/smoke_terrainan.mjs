/* 風の流れ（実験）の段階2：地形の構造の抽出（v4.122.0）。見ること:
 *   ①鞍部を「峰どうしがつながる点」として見つける（v4.123.0）：位置・深さ（prominence）・両側の峰・稜線と抜ける向き
 *   ②**底が平らな鞍部**も見つける（1点の曲率＝ヘッセ行列では拾えなかった型。実在の乗越浄土・別山乗越）
 *   ③横断角：稜線と風の角度（西風なら稜線に沿う＝小さい、南風なら稜線を真横に越える＝90°近く）
 *   ④⚠ **風は一切変えない**（地形解析を入れても切っても、流している格子・場は同じ）
 *   ⑤z15 付近でも格子を画面＋余白に絞る。「中心を解析」「検証8地点」「計測表示を畳む」
 * 偽の地形：①東西 3km に高さ 800m の峰が2つ（間が鞍部・稜線は東西・抜ける向きは南北）
 *          ②その 8km 北に、峰2つを高さ 1,350m の**平らな帯**でつないだ鞍部（曲率ほぼ 0）
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
  const g2 = (dx, dy) => Math.exp(-(dx * dx + dy * dy) / (2 * 800 * 800));
  const base = 1000 + 800 * g(x + 3000, y) + 800 * g(x - 3000, y) + 700 * g2(x + 2000, y - 8000) + 700 * g2(x - 2000, y - 8000);
  // 平らな帯（東西 3km・南北 400m・高さ 1,350m）＝底が平らな鞍部
  const flat = Math.abs(x) <= 1500 && Math.abs(y - 8000) <= 200 ? 1350 : -Infinity;
  return Math.max(base, flat);
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
const TERRAIN_VERIFY_COLS_NAMES = ['峰の茶屋跡', '常念乗越', '夏沢峠', '八本歯ノコル', '白出のコル', '乗越浄土', '別山乗越', '那須の丸地点'];
await page.evaluate(n => { window.TERRAIN_VERIFY_COLS_NAMES = n; }, TERRAIN_VERIFY_COLS_NAMES);
const colAt = (lat, lon) => page.evaluate(([lat, lon]) => {
  const res = terrainAn.result, near = terrainNearestCols(res, { lat, lon }, 3)[0];
  if (!near) return { none: true, n: res.cols.cols.length };
  const c = near.c;
  return { d: near.d, h: c.h, prom: c.prom, hi: c.peakHi, lo: c.peakLo, edge: c.edge,
    ridgeBear: Math.round(bearingOf(c.ridge[0], c.ridge[1]) % 180), passBear: Math.round(bearingOf(c.pass[0], c.pass[1]) % 180),
    cross: (w => w ? terrainCrossAngle(c.ridge, w) : null)(terrainWindAt(c.lat, c.lon)),
    n: res.cols.cols.length, ms: res.ms, loading: res.loading, cell: res.cols.cell,
    markers: terrainAn.markers.length, hud: document.getElementById('wind-hud-text').textContent };
}, [lat, lon]);
const r = await colAt(36.57, 137.65);
ok(!r.none && !r.loading, '（前提）鞍部を解析した', r);
ok(r.d < 150, '★★★鞍部を「峰どうしがつながる点」として見つける（中心から150m以内）', r);
ok(Math.abs(r.h - 1216) < 25, '鞍部の標高（約1,216m）', r);
ok(Math.abs(r.prom - 584) < 30, '★★深さ（prominence）＝低い方の峰 − 鞍部（約584m）', r);
ok(Math.abs(r.hi.h - 1800) < 20 && Math.abs(r.lo.h - 1800) < 20 && Math.abs(r.hi.d - 3000) < 250 && Math.abs(r.lo.d - 3000) < 250,
  '★★両側の峰（約1,800m・約3km 先）', { hi: r.hi, lo: r.lo });
ok(!r.edge, '低い方の峰は解析範囲の中（端ではない）', r);
ok(Math.abs(r.ridgeBear - 90) <= 10, '★稜線の向きは東西（90°）', r);
ok(r.passBear <= 10 || r.passBear >= 170, '★抜ける向きは南北（0°）', r);
ok(r.cross != null && r.cross < 20, '★★西風は稜線に沿う（横断角が小さい）', r);
ok(r.markers > 0, '鞍部の◎を出す', r);
ok(/鞍部/.test(r.hud) && /≧20m/.test(r.hud), '計測表示に鞍部の数（深さ別）', r.hud);
const pop = await page.evaluate(() => terrainColText(terrainAn.result.cols.cols[0]));
ok(/深さ（prominence）/.test(pop) && /高い側の峰/.test(pop) && /低い側の峰/.test(pop) && /横断角/.test(pop) && /補正していない/.test(pop) && !/%|％/.test(pop),
  '★◎の説明：深さ・両側の峰・横断角・補正していない（％を出さない）', pop);
// 深さの閾値は固定しない：記録は床（3m）以上、画面は切り替え
const th = await page.evaluate(() => { const a = []; for (let k = 0; k < COL.SHOW_STEPS.length; k++) { terrainCycleShowMin(); a.push(terrainAn.showMin); } return { a, floor: COL.FLOOR_M }; });
ok(th.a.length === 7 && th.a.includes(0) && th.a.includes(100) && th.floor <= 5, '★深さの閾値は固定しない（画面で切り替え・記録は雑音の床から）', th);

// ④風は一切変えない
ok(await gridSig() === g0, '★★★地形解析を入れても流している格子は同じ（風を補正しない）');
ok(await fieldSig() === f0, '★★★場（buildWindField）も同じ');

// ②南風（地上10m・180°から）→ 稜線を真横に越える
await page.evaluate(() => setWindMode('10m'));
await page.waitForTimeout(1500);
const cross10 = (await colAt(36.57, 137.65)).cross;
ok(cross10 != null && cross10 > 75, '★★南風は稜線を真横に越える（横断角が90°近く）', cross10);
await page.evaluate(() => setWindMode('auto'));
await page.waitForTimeout(1200);

// 中心を解析（丸を付けた地点の検証に使う）
const probe = await page.evaluate(() => { terrainProbeCenter(); return windGL.lastMeasure; });
ok(/DEM標高 \d/.test(probe) && /稜線方向\d+%/.test(probe) && /横断方向\d+%/.test(probe) && /500m: .*標高\d/.test(probe),
  '★「中心を解析」：DEM標高・縮尺ごとの標高・勾配（稜線方向・横断方向）', probe);
ok(/鞍部1: \d+m [北東南西]+・標高[\d,]+m・深さ\d+m/.test(probe) && /峰 [\d,]+m\/[\d,]+m先/.test(probe) && /横断角\d+°/.test(probe),
  '★「中心を解析」：最寄りの鞍部の距離・方位・標高・深さ・両側の峰・横断角', probe);

// 縮尺の切り替え
const sc = await page.evaluate(() => { const a = []; for (let k = 0; k < 5; k++) { terrainCycleScale(); a.push(terrainAn.scaleSel); } return a; });
ok(sc.join(',') === 's150,s500,s1k,s2500,auto', '縮尺を順に切り替えられる', sc);

// 切れば消える・風も元のまま
await page.evaluate(() => terrainToggle());
ok(await page.evaluate(() => terrainAn.markers.length === 0 && (!terrainAn.cv || terrainAn.cv.style.display === 'none')), '地形解析を切れば◎と線が消える');
ok(await gridSig() === g0, '切った後も流している格子は同じ');
await page.evaluate(() => terrainToggle());

// ②底が平らな鞍部（曲率ほぼ 0）も見つける
await page.evaluate(() => leafletMap.setView([36.57 + 8000 / 111320, 137.65], 14, { animate: false }));
await page.waitForTimeout(3500);
await page.evaluate(() => terrainRefresh());
const flat = await colAt(36.57 + 8000 / 111320, 137.65);
ok(!flat.none && flat.d < 1500 && Math.abs(flat.h - 1350) < 15, '★★★底が平らな鞍部も見つける（平らな帯の上・標高1,350m）', flat);
ok(Math.abs(flat.prom - 350) < 30 && Math.abs(flat.ridgeBear - 90) <= 15, '★平らな鞍部の深さ（約350m）と稜線の向き（東西）', flat);
await page.evaluate(() => terrainToggle());

// ⑤z15：格子を画面＋余白に絞る
await page.evaluate(() => { terrainToggle(); leafletMap.setZoom(15, { animate: false }); });
await page.waitForTimeout(3000);
const z15 = await page.evaluate(() => ({ nodes: windGL.grid.cols * windGL.grid.rows, step: windGL.grid.step,
  ms: windGL.terrain && windGL.terrain.ms, an: terrainAn.result && terrainAn.result.ms, scales: terrainAn.result && terrainAn.result.scales.map(s => s.sc.label + ':' + s.nx * s.ny) }));
ok(z15.nodes < 40000 && z15.step === 8, '★★z15 でも格子は画面＋余白だけ（8px のまま・数十万点にしない）', z15);
console.log('参考（ヘッドレス・PC）', JSON.stringify(z15), '/ z13 の解析', r.ms.toFixed(0) + 'ms');
// 検証8地点：順に回って表にする（偽の地形なので鞍部は無い所が多い。表の形と回り切ることを見る）
const ver = await page.evaluate(() => terrainVerifyCols());
const vrows = ver.split('\n');
ok(vrows.length === 10 && /^地点\t最寄り距離m/.test(vrows[0]) && vrows.slice(1, 9).every((l, i) => l.startsWith(TERRAIN_VERIFY_COLS_NAMES[i])),
  '★「検証8地点」：8地点を順に回ってタブ区切りの表（コピー可）', vrows.slice(0, 3));
ok(await page.evaluate(() => windGL.lastMeasure.includes('八本歯ノコル') && windGL.lastMeasure.includes('乗越浄土')), '表は「コピー」で貼り出せる（lastMeasure）');
// 計測表示を畳む（地図の中心が隠れる。利用者の要望）
const minv = await page.evaluate(() => { windGLHudMin(); const el = document.getElementById('wind-hud'); const r = { min: el.classList.contains('min'), textHidden: getComputedStyle(document.getElementById('wind-hud-text')).display === 'none', h: el.getBoundingClientRect().height }; windGLHudMin(); return r; });
ok(minv.min && minv.textHidden && minv.h < 40, '★計測表示を畳める（ボタン1つだけ残す）', minv);
ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('TERRAINAN SMOKE FAILED');
  process.exit(1);
}
console.log('TERRAINAN SMOKE PASSED');
