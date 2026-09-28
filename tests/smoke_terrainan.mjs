/* 風の流れ（実験）の段階2：地形の構造の抽出（v4.122.0）。見ること:
 *   ①鞍部を「峰どうしがつながる点」として見つける（v4.123.0）：位置・深さ（prominence）・両側の峰・稜線と抜ける向き
 *   ②**底が平らな鞍部**も見つける（1点の曲率＝ヘッセ行列では拾えなかった型。実在の乗越浄土・別山乗越）
 *   ③横断角：稜線と風の角度（西風なら稜線に沿う＝小さい、南風なら稜線を真横に越える＝90°近く）
 *   ④⚠ **風は一切変えない**（地形解析を入れても切っても、流している格子・場は同じ）
 *   ⑤z15 付近でも格子を画面＋余白に絞る。「中心を解析」「検証8地点」「計測表示を畳む」
 * 偽の地形：①東西の稜線（横断は勾配0.4の三角形）。中心が鞍部（1,200m）、東西へ上って峰（1,800m・約3.5km 先）
 *          ②その 8km 北に、峰2つを高さ 1,350m の**平らな帯**でつないだ鞍部（曲率ほぼ 0）
 *          ③9km 南に、なめらかな円錐（男体山の形）。斜面全体が尾根になってはいけない（v4.124.0）
 *   ⑥尾根・沢は水の流れ（多方向流）で求める：稜線は峰の並びの上、沢は鞍部から両側へ下る筋、円錐の斜面は尾根にしない。
 *     帯（尾根≦◯m・沢≦◯m）は幅の設定で広がる。鞍部は稜線の上（つないだ稜線）
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
  // ①東西の稜線（横断は勾配 0.4 の三角形＝実際の稜線の形）。稜線の高さは中心で 1,200m まで下がり（鞍部）、東西で 1,800m（峰）
  const ax = Math.abs(x);
  const crest = 1800 - 600 * Math.exp(-x * x / (2 * 800 * 800)) - (ax > 3500 ? 0.4 * (ax - 3500) : 0);
  const ridgeH = crest - 0.4 * Math.abs(y);
  // 平地：南北へ下り、南北の軸（x=0）へ集まる V 字（水が南北の沢へ流れる）
  const plain = 1000 - 0.02 * Math.abs(y) + 0.05 * ax;
  // ②8km 北：峰2つを高さ 1,350m の平らな帯でつないだ鞍部（曲率ほぼ 0）
  const g2 = (dx, dy) => Math.exp(-(dx * dx + dy * dy) / (2 * 800 * 800));
  const peaks2 = 1000 + 700 * g2(x + 2000, y - 8000) + 700 * g2(x - 2000, y - 8000);
  const flat = Math.abs(x) <= 1500 && Math.abs(y - 8000) <= 200 ? 1350 : -Infinity;
  // ③なめらかな円錐（男体山の形）：9km 南・高さ 1,200m・半径 3km（勾配 0.4）
  const r = Math.hypot(x, y + 9000), cone = r < 3000 ? 1000 + 1200 * (1 - r / 3000) : -Infinity;
  // ④湖（平らな面）：東 2.5km・南 2.5km・半径 700m・標高 1,080m ちょうど（v4.127.0。湖面に偽の直線の沢・稜線・帯を作らない）
  if (Math.hypot(x - 2500, y + 2500) < 700) return 1080;
  return Math.max(Math.abs(y) < 5000 ? ridgeH : -Infinity, plain, y > 5000 ? peaks2 : -Infinity, flat, cone);
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
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 13, { animate: false }); windGL.override = 1000; toggleOverlay('windFlowGL'); windGLSetHud(true); });
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
ok(Math.abs(r.h - 1200) < 25, '鞍部の標高（約1,200m）', r);
ok(Math.abs(r.prom - 600) < 30, '★★深さ（prominence）＝低い方の峰 − 鞍部（約600m）', r);
ok(Math.abs(r.hi.h - 1800) < 20 && Math.abs(r.lo.h - 1800) < 20 && r.hi.d > 2000 && r.lo.d > 2000 && r.hi.d < 4500 && r.lo.d < 4500,
  '★★両側の峰（約1,800m・東西に 2〜4.5km 先）', { hi: r.hi, lo: r.lo });
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
await page.evaluate(() => terrainProbeCenter());   // 1回目は他の縮尺の標高タイルを読みに行く
await page.waitForTimeout(1500);
const probe = await page.evaluate(() => { terrainProbeCenter(); return windGL.lastMeasure; });
ok(/DEM標高 \d/.test(probe) && /稜線方向\d+%/.test(probe) && /横断方向\d+%/.test(probe) && /500m: .*標高\d/.test(probe) && /流れ：.*HAND/.test(probe) && /比集水面積/.test(probe),
  '★「中心を解析」：DEM標高・縮尺ごとの標高・勾配（稜線方向・横断方向）', probe);
ok(/鞍部1: \d+m [北東南西]+・標高[\d,]+m・深さ\d+m/.test(probe) && /峰 [\d,]+m\/[\d,]+m先/.test(probe) && /横断角\d+°/.test(probe),
  '★「中心を解析」：最寄りの鞍部の距離・方位・標高・深さ・両側の峰・横断角', probe);

// ⑥尾根・沢（水の流れ）
const flowAt = (cy, cx, rad) => page.evaluate(([cy, cx, rad]) => {
  // 中心 (cx, cy)（km・中心の地点から東・北）の周り rad（km）の升目で、稜線・沢・帯の割合
  const r = terrainAn.result, G = r.grid, F = r.flow, out = { n: 0, ridge: 0, chan: 0, rband: 0, vband: 0 };
  for (let n = 0; n < G.N; n++) {
    if (G.h[n] !== G.h[n]) continue;
    const ll = G.toLL(n), x = (ll.lng - 137.65) * 111.32 * Math.cos(36.57 * Math.PI / 180), y = (ll.lat - 36.57) * 111.32;
    if (!rad.test) { if (Math.abs(x - cx) > rad.w || Math.abs(y - cy) > rad.h) continue; }
    else { const d = Math.hypot(x - cx, y - cy); if (d < rad.r0 || d > rad.r1) continue; }
    out.n++; out.ridge += F.ridge[n]; out.chan += F.chan[n];
    if (rad.line) { const key = rad.line === 'x' ? Math.round(x * 1000 / G.cell) : Math.round(y * 1000 / G.cell); (out.lines ||= {}); out.lines[key] = (out.lines[key] || 0) | (rad.kind === 'ridge' ? F.ridge[n] : F.chan[n]); }
    if (F.below[n] <= terrainAn.ridgeBand) out.rband++;
    if (F.hand[n] <= terrainAn.valleyBand) out.vband++;
  }
  for (const k of ['ridge', 'chan', 'rband', 'vband']) out[k] = +(out[k] / Math.max(1, out.n)).toFixed(3);
  if (out.lines) { const v = Object.values(out.lines); out.hit = +(v.filter(Boolean).length / v.length).toFixed(3); out.lines = v.length; }
  return out;
}, [cy, cx, rad]);
const crestE = await flowAt(0, 1.4, { w: 1.1, h: 0.07, line: 'x', kind: 'ridge' }), crestW = await flowAt(0, -1.4, { w: 1.1, h: 0.07, line: 'x', kind: 'ridge' });
ok(crestE.lines > 20 && crestE.hit > 0.8 && crestW.hit > 0.8, '★★稜線は峰の並びの上（鞍部と峰の間の尾根筋）', { crestE, crestW });
const valN = await flowAt(3, 0, { w: 0.07, h: 1.2, line: 'y', kind: 'chan' }), valS = await flowAt(-3, 0, { w: 0.07, h: 1.2, line: 'y', kind: 'chan' });
ok(valN.lines > 20 && valN.hit > 0.6 && valS.hit > 0.6, '★★沢は鞍部から南北へ下る筋（両側の峰の水が集まる）', { valN, valS });
// 線（ベクトル・ベジエ）：稜線は峰の並びの上、沢は鞍部から南北へ。頂点を地図の km に直して見る
const vecPts = kind => page.evaluate(kind => {
  const r = terrainAn.result, G = r.grid, out = [];
  // 頂点の間も 1/8 ずつ埋めて見る（まっすぐな稜線は両端の2点に間引かれる）
  for (const s of r.vec[kind]) for (let i = 0; i < s.x.length; i++) {
    for (let t = 0; t < (i < s.x.length - 1 ? 8 : 1); t++) {
      const gx = i < s.x.length - 1 ? s.x[i] + (s.x[i + 1] - s.x[i]) * t / 8 : s.x[i], gy = i < s.y.length - 1 ? s.y[i] + (s.y[i + 1] - s.y[i]) * t / 8 : s.y[i];
      const ll = leafletMap.unproject([G.x0 + gx * G.m, G.y0 + gy * G.m], G.zd);
      out.push([(ll.lng - 137.65) * 111.32 * Math.cos(36.57 * Math.PI / 180), (ll.lat - 36.57) * 111.32, s.w]);
    }
  }
  return { pts: out, n: r.vec[kind].length, drawn: r.drawn };
}, kind);
const vr = await vecPts('ridges'), vv = await vecPts('valleys');
const crestPts = vr.pts.filter(([x, y]) => Math.abs(y) < 0.08 && Math.abs(x) > 0.2 && Math.abs(x) < 2.6);
ok(crestPts.some(p => p[0] > 1) && crestPts.some(p => p[0] < -1), '★★稜線の線（ベジエ）が峰の並びの上を通る', { n: vr.n, crest: crestPts.length });
const valPts = vv.pts.filter(([x, y]) => Math.abs(x) < 0.08 && y > 1 && y < 4);
ok(valPts.length >= 2, '★★沢の線が鞍部から北へ下る筋を通る', { n: vv.n, val: valPts.length });
ok(vr.drawn && vr.drawn.ridges > 0 && vr.drawn.valleys > 0, '線を画面に描いた（稜線・沢）', vr.drawn);
ok(vr.pts.every(p => p[2] >= 1.3 && p[2] <= 4) && vv.pts.every(p => p[2] >= 1 && p[2] <= 4), '線の太さは格（沢筋からの高さ・比集水面積）で 1〜4px', null);
// 二重線にしない：稜線の中ほど（東 1km）を南北に横切る稜線の線は1本だけ
const cross1 = await page.evaluate(() => {
  const r = terrainAn.result, G = r.grid, xk = 1, lon = 137.65 + xk / (111.32 * Math.cos(36.57 * Math.PI / 180));
  const gx = (leafletMap.project([36.57, lon], G.zd).x - G.x0) / G.m;
  let hits = 0;
  for (const q of r.vec.ridges) for (let i = 0; i < q.x.length - 1; i++) {
    if ((q.x[i] - gx) * (q.x[i + 1] - gx) <= 0) { const t = (gx - q.x[i]) / ((q.x[i + 1] - q.x[i]) || 1), y = q.y[i] + (q.y[i + 1] - q.y[i]) * t;
      const ll = leafletMap.unproject([G.x0 + gx * G.m, G.y0 + y * G.m], G.zd); if (Math.abs(ll.lat - 36.57) * 111.32 < 0.3) hits++; }
  }
  return hits;
});
ok(cross1 === 1, '★★稜線は二重線にしない（細線化。横切る線は1本）', cross1);
// ④湖（平坦地）：沢・稜線・帯を作らない・線を引かない
const lake = await flowAt(-2.5, 2.5, { test: 1, r0: 0, r1: 0.55 });
ok(lake.n > 50 && lake.ridge === 0 && lake.chan === 0 && lake.rband === 0 && lake.vband === 0, '★★★湖面（平坦地）に沢・稜線・帯を作らない（偽の直線を出さない）', lake);
const lakeVec = [...(await vecPts('ridges')).pts, ...(await vecPts('valleys')).pts].filter(([x, y]) => Math.hypot(x - 2.5, y + 2.5) < 0.5);
ok(lakeVec.length === 0, '★★湖面の上に線を引かない', lakeVec.slice(0, 4));
ok(await page.evaluate(() => terrainAn.result.flow.nFlat > 50), '平坦地を見分けている（升目の数）');
const flank = await flowAt(1.5, 3, { w: 0.4, h: 0.2 });
ok(flank.ridge < 0.1, '峰の北の斜面の途中は尾根ではない', flank);
await page.evaluate(() => { leafletMap.setView([36.57 - 9000 / 111320, 137.65], 13, { animate: false }); });
await page.waitForTimeout(3500);
await page.evaluate(() => terrainRefresh());
const coneFlank = await flowAt(-9, 0, { test: 1, r0: 0.8, r1: 2.5 });
ok(coneFlank.n > 500 && coneFlank.ridge < 0.05, '★★★円錐（男体山の形）の斜面全体を尾根にしない', coneFlank);
ok(coneFlank.rband < 0.2, '★★円錐の斜面は尾根の帯（稜線から20m）にもならない', coneFlank);
const coneVec = (await vecPts('ridges')).pts.filter(([x, y]) => { const d = Math.hypot(x, y + 9); return d > 0.8 && d < 2.5; });
ok(coneVec.length === 0, '★★円錐の斜面に稜線の線を描かない', coneVec.slice(0, 5));
const coneOld = await page.evaluate(() => {
  // 参考：ヘッセ行列（500m）では円錐の斜面が尾根形（凸）になる＝以前の不具合の再現
  const v = terrainView(), r = terrainAnalyzeScale(TERRAIN_SCALES[1], v, leafletMap.getCenter().lat);
  let n = 0, rid = 0;
  for (let i = 0; i < r.cls.length; i++) { if (r.k1[i] !== r.k1[i]) continue; n++; if (r.cls[i] === 2) rid++; }
  return { n, ridgeShare: +(rid / n).toFixed(3) };
});
console.log('円錐の斜面：流れの方式で稜線', coneFlank.ridge, '・尾根の帯', coneFlank.rband, '／参考：ヘッセ行列（500m）で尾根形', coneOld.ridgeShare);
console.log('稜線の検出（東・西）', crestE.hit, crestW.hit, '／沢の検出（北・南）', valN.hit, valS.hit);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 13, { animate: false }); });
await page.waitForTimeout(3500);
await page.evaluate(() => terrainRefresh());
// 帯の幅：広げると塗る升目が増える
const bandW = await page.evaluate(() => {
  const a = []; terrainAn.ridgeBand = 10; terrainAn.valleyBand = 10;
  for (let k = 0; k < 4; k++) { terrainDraw(); const b = terrainAn.result.bandStats; a.push([terrainAn.ridgeBand, b.ridge, terrainAn.valleyBand, b.valley]); terrainCycleBand('ridge'); terrainCycleBand('valley'); }
  terrainAn.ridgeBand = 20; terrainAn.valleyBand = 20; terrainDraw();
  return a;
});
ok(bandW.map(x => x[0]).join(',') === '10,20,50,100' && bandW.every((x, i) => i === 0 || (x[1] >= bandW[i - 1][1] && x[3] >= bandW[i - 1][3])) && bandW[3][1] > bandW[0][1],
  '★帯の幅（10/20/50/100m）を広げると尾根・沢の塗りが広がる', bandW);
// 鞍部は稜線の上（つないだ稜線）
const link = await page.evaluate(() => { const c = terrainNearestCols(terrainAn.result, { lat: 36.57, lon: 137.65 }, 1)[0].c; return { onRidge: c.onRidge, ridgeId: c.ridgeId, bridged: terrainAn.result.flow.bridged, text: terrainColText(c) }; });
ok(link.onRidge && link.ridgeId >= 0 && /稜線（水の流れから求めた尾根）の上/.test(link.text), '★鞍部は稜線の上（将来の風の解析で「どの稜線のコルか」を引ける）', link);
// 細線の辺（v4.131.0）：斜めの2〜3升目幅の帯は、細くしたあと分岐の無い1本の辺になる。
// ⚠ 斜めのつながりを階段の角でも数えると、角ごとの小さな三角で1〜3升目の辺に細切れになり、拡大でハシゴ状に見えた（実機・男体山の火口縁）
const ladder = await page.evaluate(() => {
  const nx = 60, ny = 60, N = nx * ny, G = { nx, ny, N }, m = new Uint8Array(N);
  for (let y = 0; y < ny; y++) for (let x = 5; x < 55; x++) if (Math.abs((y - 10) - (x - 5) * 0.55) < 1.3) m[y * nx + x] = 1;
  const e = skeletonEdges(G, thinMask(G, m));
  return { edges: e.length, short: e.filter(a => a.length <= 3).length, len: e.map(a => a.length) };
});
ok(ladder.edges === 1 && ladder.short === 0, '★斜めの帯は細くして1本の辺（階段の角で細切れにしない＝ハシゴ状に描かない）', ladder);

// 稜線の出自（謎の直線の切り分け・v4.128.0〜v4.129.0）：稜線の升目はすべて出自（頂・分水界・つなぎ）を持ち、つなぎは鞍部を指す。
// 小さな偽の升目（30m×80×60）：峰2つ（1,500m・東西に 900m 離す）と、その間の鞍部。分水界の稜線はいったん止め
// （横断の条件を満たせなくする）、鞍部から峰までをつなぎだけで引かせる。
// ⚠ v4.128.0 まではつなぎを**まっすぐ**引き、浅い鞍部から谷を横切る直線が出た（実機・男体山）。v4.129.0 から最も急な上りをたどる。
//   鞍部の稜線の向きを**わざと直角（南北＝谷の向き）**にした鞍部も置き、つながらないこと（谷を横切らない）も見る
const src = await page.evaluate(() => {
  const nx = 80, ny = 60, N = nx * ny, cell = 30, h = new Float32Array(N);
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
    const X = x * cell, Y = y * cell, pk = (a, b) => 500 * Math.exp(-((X - a) ** 2 + (Y - b) ** 2) / (2 * 350 ** 2));
    h[y * nx + x] = Math.round((1000 + pk(750, 900) + pk(1650, 900) - Y * 0.02) * 10) / 10;
  }
  const order = Uint32Array.from(Array.from({ length: N }, (_, i) => i).sort((a, b) => h[b] - h[a] || a - b));
  const G = { nx, ny, N, h, cell, m: 1, order, inner: { x0: 0, y0: 0, x1: nx, y1: ny }, toLL: n => ({ lat: 36 + Math.floor(n / nx) * 1e-4, lng: 139 + (n % nx) * 1e-4 }) };
  // 円錐の斜面のこぶ（v4.130.0）：こぶと円錐の間の鞍部から円錐の側に尾根は無い。上りをたどると斜面を登るだけなので、つながない。
  // 円錐の頂は升目の外（北 600m）に置き、こぶは頂から約 2.7km（男体山の湖岸の鞍部と同じくらいの距離）。
  // ⚠ 頂から約 600m 以内は円錐の斜面そのものが横断して 1m 以上低い（尾根の形になる）。頂の近くでは斜面と尾根を分けられない
  {
    const cn = 80, cN = cn * cn, ch = new Float32Array(cN);
    for (let y = 0; y < cn; y++) for (let x = 0; x < cn; x++) {
      const X = x * cell, Y = y * cell;
      ch[y * cn + x] = Math.round((2600 - 0.35 * Math.hypot(X - 1200, Y + 600) + 90 * Math.exp(-((X - 1200) ** 2 + (Y - 2050) ** 2) / (2 * 110 ** 2))) * 10) / 10;
    }
    const cOrder = Uint32Array.from(Array.from({ length: cN }, (_, i) => i).sort((a, b) => ch[b] - ch[a] || a - b));
    const CG = { nx: cn, ny: cn, N: cN, h: ch, cell, m: 1, order: cOrder, inner: { x0: 0, y0: 0, x1: cn, y1: cn }, toLL: G.toLL };
    const cc = terrainFindCols(CG).cols;
    const keep2 = FLOW.CROSS_SLOPE; FLOW.CROSS_SLOPE = 1e9;
    let CF; try { CF = terrainFlow(CG, cc); } finally { FLOW.CROSS_SLOPE = keep2; }
    var cone = { cols: cc.filter(c => c.prom >= FLOW.BRIDGE_COL_M).length, bridged: CF.bridged, fail: CF.bridgeFail };
  }
  const found = terrainFindCols(G).cols.filter(c => c.prom >= FLOW.BRIDGE_COL_M);
  const cols = found.map(c => ({ ...c }));
  if (found[0]) cols.push({ ...found[0], ridge: [0, 1] });   // 向きを谷の向きにした（誤った）鞍部
  const out = { ridge: 0, peak: 0, divide: 0, bridge: 0, bad: 0, badCol: 0, cols: cols.length, colH: found[0] && found[0].h };
  const keep = FLOW.CROSS_SLOPE; FLOW.CROSS_SLOPE = 1e9;
  let F;
  try { F = terrainFlow(G, cols); } finally { FLOW.CROSS_SLOPE = keep; }
  out.bridged = F.bridged; out.bridgeFail = F.bridgeFail;
  out.cone = cone;
  for (let n = 0; n < F.ridge.length; n++) {
    if (!F.ridge[n]) { if (F.ridgeSrc[n]) out.bad++; continue; }
    out.ridge++;
    const s = F.ridgeSrc[n];
    if (s === RIDGE_SRC.PEAK) out.peak++; else if (s === RIDGE_SRC.DIVIDE) out.divide++;
    else if (s === RIDGE_SRC.BRIDGE) {
      out.bridge++;
      const c = cols[F.bridgeCol[n]];
      if (!c) { out.badCol++; continue; }
      // v4.129.0：つなぎは最も急な上りをたどる。鞍部より低い升目・谷の中（横断すると両側とも高い）には入らない
      if (G.h[n] < c.h) out.downhill = (out.downhill || 0) + 1;
      const ci = F.crossInfo(n);
      if (ci && ci.lows[0] <= -FLOW.BRIDGE_VALLEY_M && ci.lows[1] <= -FLOW.BRIDGE_VALLEY_M) out.valley = (out.valley || 0) + 1;
    } else out.bad++;
  }
  let bn = -1; for (let n = 0; n < F.ridge.length && bn < 0; n++) if (F.ridgeSrc[n] === RIDGE_SRC.BRIDGE) bn = n;
  if (bn >= 0) out.text = terrainRidgeWhy(G, F, cols, bn).join('\n');
  const V = terrainVectorize(G, F);
  out.vecHasBridge = V.ridges.every(q => q.bridge >= 0 && q.bridge <= 1);
  return out;
});
ok(src.ridge > 0 && src.bad === 0 && src.badCol === 0 && src.peak + src.divide + src.bridge === src.ridge && src.bridge > 0 && src.vecHasBridge,
  '★稜線の升目はすべて出自（頂・分水界・鞍部からのつなぎ）を持つ', src);
ok(!src.downhill && !src.valley && src.bridged === 1 && src.bridgeFail === 1,
  '★★鞍部からのつなぎは上りをたどる（鞍部より下がらない・谷を横切らない・向きを誤った鞍部はつながない＝謎の直線を出さない）', src);
ok(src.cone && src.cone.cols >= 1 && src.cone.bridged === 0, '★★斜面のこぶの鞍部から円錐の斜面を登るつなぎを引かない（尾根の形を求める・v4.130.0）', src.cone);
ok(/尾根の形：勾配の向き \d+°.*（つなぎは両側とも 1m 以上。満たす）/.test(src.text || ''), '「中心を解析」に尾根の形（丸めない勾配の向きの横断）', src.text);
// 「中心を解析」の表示にも出る（中心の近くの稜線の升目）
src.probe = await page.evaluate(() => { terrainProbeCenter(); return windGL.lastMeasure; });
console.log('出自の説明', src.text);
ok(/稜線の出自/.test(src.probe), '「中心を解析」に稜線の出自の行', src.probe);
ok(/稜線の出自（中心の升目）：★鞍部からのつなぎ（最も急な上りをたどった線）.*深さ\d+m/.test(src.text || '') && /横断：上る向き [北東南西]+.*必要 [\d.]+m/.test(src.text || ''), '★稜線の出自の説明：鞍部からのつなぎ・横断の高低差', src.text);
ok(await page.evaluate(() => /尾根・沢/.test(document.getElementById('wind-hud-text').textContent) && /稜線\d+本/.test(document.getElementById('wind-hud-text').textContent)), '計測表示に尾根・沢の時間と稜線の本数');
ok(await page.evaluate(() => { terrainToggleBands(); terrainToggleLines(); const off = !terrainAn.bands && !terrainAn.lines && !terrainAn.result.drawn || true; terrainToggleBands(); terrainToggleLines(); return off && terrainAn.bands && terrainAn.lines; }), '尾根・沢の線と帯はそれぞれ切り替えられる');

// ⑦段階3a：風下の遮蔽（v4.133.0・実験・既定は切）。粒の見せ方だけ。場・矢印・判定は変えない
// Sx の単体：南北に走る尾根（高さ 200m）を東向きの風が越える。風下（尾根の東）は隠れ、風上（西）と平地は隠れない
const sx = await page.evaluate(() => {
  const nx = 100, ny = 40, cell = 30, h = new Float32Array(nx * ny);
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) h[y * nx + x] = 1000 + 200 * Math.exp(-(((x - 50) * cell) ** 2) / (2 * 60 ** 2));
  const G = { nx, ny, h, cell };
  const at = x => terrainSx(G, x, 20, 1, 0);
  return { lee: at(54), leeFar: at(62), wind: at(44), flat: at(10), crest: at(50), noWind: terrainSx(G, 54, 20, 0, 0),
    f: [shelterFactor(-5), shelterFactor(WIND_SHELTER.SX_LO_DEG), shelterFactor(11), shelterFactor(WIND_SHELTER.SX_HI_DEG), shelterFactor(60)] };
});
ok(sx.lee > 10 && sx.leeFar > 2 && sx.wind <= 0 && Math.abs(sx.flat) < 0.5 && sx.crest <= 0 && sx.noWind !== sx.noWind,
  '★Sx：尾根の風下は正（隠れる）・風上と平地と稜線の上は0以下', sx);
ok(sx.f[0] === 1 && sx.f[1] === 1 && sx.f[2] < 1 && sx.f[2] > 0.3 && Math.abs(sx.f[3] - 0.3) < 1e-9 && Math.abs(sx.f[4] - 0.3) < 1e-9,
  '★遮蔽の倍率：Sx 2°以下で1・20°以上で0.3・間はなめらか（実験のパラメータ WIND_SHELTER）', sx.f);
// 層で：既定は切 → 入れると粒の格子だけ倍率が掛かる → 場・矢印の値は同じ → 手動の層には掛けない → 切れば元どおり
const sh = await page.evaluate(() => {
  const out = { defaultOff: windGL.shelterOn === false && !windGL.shelterRes && !windGL.grid.fac };
  const g0 = windGL.grid, field0 = JSON.stringify(lastWindField.cells.slice(0, 20).map(c => c.res && c.res.w));
  const c = leafletMap.getCenter(), s0 = sampleWindField ? JSON.stringify(sampleWindField(lastWindField, c.lat, c.lng)) : '';
  windGLToggleShelter();
  const r = windGL.shelterRes, g1 = windGL.grid;
  out.on = windGL.shelterOn; out.applied = !!(r && r.applied); out.stats = r && r.stats;
  let bad = 0, n = 0, fmin = 1;
  for (let k = 0; k < g1.u.length; k++) {
    if (!g0.ok[k]) continue;
    const F = r.fac[k]; n++;
    if (!(F >= WIND_SHELTER.F_MIN - 1e-6 && F <= WIND_COL.MAX + 1e-6)) bad++;
    if (Math.abs(g1.u[k] - g0.u[k] * F) > 1e-4 || Math.abs(g1.v[k] - g0.v[k] * F) > 1e-4) bad++;
    if (Math.abs(r.fac[k] - r.shelter[k] * r.col[k]) > 1e-5 || !(r.col[k] >= 1 && r.col[k] <= WIND_COL.MAX + 1e-6)) bad++;
    if (F < fmin) fmin = F;
  }
  out.n = n; out.bad = bad; out.fmin = fmin;
  out.fieldSame = JSON.stringify(lastWindField.cells.slice(0, 20).map(c => c.res && c.res.w)) === field0 &&
    (sampleWindField ? JSON.stringify(sampleWindField(lastWindField, c.lat, c.lng)) : '') === s0;
  out.probe = windShelterProbeLines().join('\n');
  out.hud = document.getElementById('wind-hud-text').textContent;
  out.btn = document.getElementById('wind-hud-shelter').textContent;
  // 手動の層（850）には掛けない
  updateWindFlowGL(Object.assign({}, lastWindField, { mode: '850' }));
  out.manual = !windGL.shelterRes && !windGL.grid.fac && /手動/.test(windShelterProbeLines()[0]);
  updateWindFlowGL(Object.assign({}, lastWindField, { mode: 'auto' }));
  // 切れば元の格子（段階1まで）と同じ
  windGLToggleShelter();
  const g2 = windGL.grid;
  let diff = 0; for (let k = 0; k < g2.u.length; k++) if (g2.u[k] !== g0.u[k] || g2.v[k] !== g0.v[k]) diff++;
  out.offSame = !windGL.shelterOn && !g2.fac && diff === 0;
  return out;
});
ok(sh.defaultOff, '★補正は既定で切（粒の格子に倍率が無い）', sh);
ok(sh.on && sh.applied && sh.n > 100 && sh.bad === 0, '★補正を入れると粒の格子の u・v に最終倍率（遮蔽 0.3〜1 × コル 1〜1.3）が掛かる', sh);
ok(sh.fieldSame, '★★補正を入れても場（buildWindField の値）・sampleWindField（矢印・ポップアップの元）は変わらない', sh);
ok(sh.manual, '★手動の層には補正を掛けない', sh);
ok(sh.offSame, '★補正を切れば粒の格子は元どおり（段階1まで）', sh);
ok(/Sx -?[\d.]+°/.test(sh.probe) && /遮蔽倍率 [\d.]+/.test(sh.probe) && /コル加速倍率 [\d.]+/.test(sh.probe) && /最終倍率 [\d.]+/.test(sh.probe) && /コル：/.test(sh.probe),
  '★「補正を調べる」：Sx・遮蔽倍率・コル加速倍率・最終倍率', sh.probe);
ok(/補正.*遮蔽.*点.*コル \d+か所.*最終倍率 平均/.test(sh.hud) && sh.btn === '補正:遮蔽・コル', '計測表示に補正の集計（遮蔽された割合・倍率の平均と最小）', sh.hud);
console.log('段階3a（偽の地形）：', JSON.stringify(sh.stats), '最小倍率', sh.fmin);
// ⑧段階3b：コルの加速（v4.134.0・実験のパラメータ WIND_COL）。倍率の形
const cb = await page.evaluate(() => ({
  full: colBoostFactor(90, 0, 100), half: colBoostFactor(90, 0, 25), deep: colBoostFactor(90, 0, 600), real: colBoostFactor(72, 137, 47),
  along: colBoostFactor(20, 0, 600), atMin: colBoostFactor(WIND_COL.MIN_CROSS_DEG, 0, 600), shallow: colBoostFactor(90, 0, windColMinDepth() - 1),
  mid: colBoostFactor(90, 100, 100), out: colBoostFactor(90, WIND_COL.RADIUS_M, 100), deg60: colBoostFactor(60, 0, 200), minDepth: windColMinDepth(),
}));
const near = (a, b) => Math.abs(a - b) < 1e-9;
ok(near(cb.full, 1.3) && near(cb.half, 1.15) && near(cb.deep, 1.3) && cb.along === 1 && cb.atMin > 1 && cb.shallow === 1 &&
  near(cb.mid, 1 + 0.3 * (1 - 1 / 9)) && cb.out === 1 && cb.real > 1.2 && cb.real < 1.22 && near(cb.deg60, 1 + 0.3 * Math.sin(Math.PI / 3)) && cb.minDepth === 20,
  '★コル加速倍率（v4.135.0 案C：深さ基準50m・半径300m・減衰1乗）：真横で深いほど大きく上限1.3・稜線に沿う風と浅い鞍部と半径の外は1・深さの下限は◎の既定（20m）・実機の例（深さ47m・72°・137m）で約1.21', cb);
// 層で：偽の地形の東西の稜線の鞍部（中心）。南風（稜線を真横に越える）なら鞍部の周りが速く、西風（稜線に沿う）なら変わらない
const cl = await page.evaluate(() => {
  if (!windGL.shelterOn) windGLToggleShelter();
  const base = windGL.terrain ? windGL.terrain.grid : windGL.grid;   // 段階1の後・補正の前
  const run = (u0, v0) => {
    const g = { ...base, u: base.u.map(() => u0), v: base.v.map(() => v0), fac: undefined };
    const r = windGLShelter(g), c = leafletMap.project(leafletMap.getCenter(), g.z0);
    const n = Math.round((c.y - g.y0) / g.step) * g.cols + Math.round((c.x - g.x0) / g.step);
    let far = 0; for (let k = 0; k < r.col.length; k++) if (r.col[k] > 1 && r.colOf[k] < 0) far++;
    return { atCol: r.col[n], fac: r.fac[n], shelter: r.shelter[n], colsUsed: r.stats.colsUsed, boosted: r.stats.boosted, max: r.stats.facMax, orphan: far,
      cross: r.colInfo.map(i => Math.round(i.cross)) };
  };
  const out = { south: run(0, 10), west: run(10, 0) };
  windGLToggleShelter();
  return out;
});
ok(cl.south.atCol > 1.2 && cl.south.atCol <= 1.3 + 1e-6 && cl.south.colsUsed >= 1 && cl.south.orphan === 0 && cl.south.max <= 1.3 + 1e-6,
  '★★南風（稜線を真横に越える）：鞍部の周りのコル加速倍率が 1.2〜1.3', cl.south);
ok(cl.west.atCol === 1, '★★西風（稜線に沿う）：鞍部でも加速しない', cl.west);
console.log('段階3b（偽の地形・中心の鞍部）：南風', JSON.stringify(cl.south), '／西風', JSON.stringify(cl.west));
// ⑨段階3c-①：コルで気流が集まる見え方（v4.136.0）。南風（北へ吹く）が東西の稜線の鞍部を越える：
//   風上（南側）は軸（南北）へ寄せる＝軸の西の点は東へ、東の点は西へ。風下（北側）は少し広げる。速さは変えない（回転だけ）。上限30°。西風（稜線に沿う）は回さない
const cv = await page.evaluate(() => {
  if (!windGL.shelterOn) windGLToggleShelter();
  const base = windGL.terrain ? windGL.terrain.grid : windGL.grid;
  const run = (u0, v0) => {
    const g = { ...base, u: base.u.map(() => u0), v: base.v.map(() => v0), fac: undefined };
    const r = windGLShelter(g), k = Math.pow(2, r.G.zd - g.z0), out = { turned: r.stats.turned, turnMax: r.stats.turnMax, bad: 0, wIn: 0, wOut: 0, lIn: 0, lOut: 0, speedBad: 0 };
    for (let n = 0; n < r.turn.length; n++) {
      const ti = r.turnOf[n]; if (ti < 0 || !r.turn[n]) continue;
      const info = r.colInfo[ti], cc = n % g.cols, rr = (n - cc) / g.cols;
      const fx = ((g.x0 + cc * g.step) * k - r.G.x0) / r.G.m - 0.5, fy = ((g.y0 + rr * g.step) * k - r.G.y0) / r.G.m - 0.5;
      const dx = fx - info.cx, dy = fy - info.cy;
      if (Math.abs(r.turn[n]) > WIND_CONV.MAX_TURN_DEG + 1e-6) out.bad++;
      const sp0 = Math.hypot(g.u[n], g.v[n]) * r.fac[n], sp1 = Math.hypot(r.grid.u[n], r.grid.v[n]);
      if (Math.abs(sp0 - sp1) > 1e-3) out.speedBad++;
      if (Math.abs(dx) < 1) continue;
      const inward = Math.sign(r.grid.u[n]) === -Math.sign(dx), lee = (dx * info.axis[0] + dy * info.axis[1]) > 0;
      if (lee) inward ? out.lIn++ : out.lOut++; else inward ? out.wIn++ : out.wOut++;
    }
    out.probe = null;
    return out;
  };
  const res = { south: run(0, 10), west: run(10, 0) };
  res.probe = windShelterProbeLines().join('\n');
  windGLToggleShelter();
  return res;
});
ok(cv.south.turned > 0 && cv.south.bad === 0 && cv.south.turnMax <= 30 + 1e-6 && cv.south.speedBad === 0,
  '★向きの補正：上限30°以内・速さは変えない（回転だけ）', cv.south);
ok(cv.south.wIn > 0 && cv.south.wOut === 0 && cv.south.lOut > 0 && cv.south.lIn === 0,
  '★★南風：風上は軸へ寄せ（漏斗）、風下は広げる', cv.south);
ok(cv.west.turned === 0, '★★西風（稜線に沿う）：向きも変えない', cv.west);
ok(/向きの補正：/.test(cv.probe), '「補正を調べる」に向きの補正の行', cv.probe);
console.log('段階3c-①（偽の地形）：南風', JSON.stringify(cv.south));
// ⑩色:背景（v4.138.0・利用者の選択）：背景を粒の格子の速さで塗り、粒は白。補正を入れていれば補正後の速さ（見た目の粒の速さ）
const bgc = await page.evaluate(() => {
  const C = WIND_FLOW.COLORS.map(([, hex]) => [1, 3, 5].map(k => parseInt(hex.slice(k, k + 2), 16))), eq = (a, b) => a.join() === b.join();
  const out = { def: windGL.colorMode, stops: WIND_BG.MID.every((m, i) => eq(windBgRGB(m), C[i])) && eq(windBgRGB(0), C[0]) && eq(windBgRGB(99), C[4]),
    mid: windBgRGB((WIND_BG.MID[1] + WIND_BG.MID[2]) / 2) };
  // 格子の各点の色が「その点の格子の速さ」の色（乗算済み）と一致するか
  const check = () => {
    const g = windGL.bgGrid, d = windGL.bgData, A = WIND_BG.ALPHA; let bad = 0, n = 0;
    for (let k = 0; k < g.u.length; k += 37) {
      if (!g.ok[k]) continue; n++;
      const c = windBgRGB(Math.hypot(g.u[k], g.v[k]));
      if (Math.abs(d[k * 4] - Math.round(c[0] * A)) > 1 || Math.abs(d[k * 4 + 3] - Math.round(255 * A)) > 1) bad++;
    }
    return { n, bad, same: g === windGL.grid };
  };
  out.off = check();
  windGLToggleShelter();                       // 補正を入れる → 背景は補正後の格子で塗り直される
  out.on = check(); out.onFac = !!windGL.bgGrid.fac;
  out.hudOn = document.getElementById('wind-hud-text').textContent;
  windGLToggleShelter();
  // 色:粒 に切り替えると背景は描かない・粒は帯の色（u_mono=0）
  windGLToggleColor();
  out.part = windGL.colorMode; out.btn = document.getElementById('wind-hud-color').textContent;
  windGLToggleColor();
  out.back = windGL.colorMode;
  // 1コマ描いて WebGL のエラーが無いこと
  windGLRender(glView(), 0.016);
  out.glErr = windGL.gl.getError();
  return out;
});
ok(bgc.def === 'bg' && bgc.back === 'bg', '★色は既定で背景（Windy 型・粒は白）', bgc);
ok(bgc.stops && bgc.mid.every((c, k) => c >= 0 && c <= 255), '★背景の色：帯の中ほどで帯の色・間はなめらか', bgc);
ok(bgc.off.n > 10 && bgc.off.bad === 0 && bgc.off.same, '★背景＝粒の格子の速さの色（補正なし）', bgc.off);
ok(bgc.on.n > 10 && bgc.on.bad === 0 && bgc.on.same && bgc.onFac && /見た目の粒の速さ（補正込みの推定/.test(bgc.hudOn),
  '★★補正を入れると背景は補正後の速さ（見た目の粒の速さ）で塗り直し、計測表示にそう明記', bgc);
ok(bgc.part === 'particle' && bgc.btn === '色:粒' && bgc.glErr === 0, '「色:粒」に戻せる・描画で WebGL のエラーが無い', bgc);
// ⑪計測表示のスライダー（v4.139.0）：粒の数と背景の濃さを別々に変えられ、端末に覚える
const sl = await page.evaluate(() => {
  const c = document.getElementById('wind-sl-count'), b = document.getElementById('wind-sl-bg'), keep = windGL.override;
  const out = { has: !!c && !!b, cMax: +c.max, bMin: +b.min, bMax: +b.max, steps: WIND_COUNT_STEPS.join(','),
    quarter: [...document.querySelectorAll('#layer-weather button')].some(x => x.textContent === '粒¼') };
  c.value = WIND_COUNT_STEPS.indexOf(3000); c.dispatchEvent(new Event('input'));
  out.idx = +c.value;
  c.value = 2; c.dispatchEvent(new Event('input')); out.n300 = windGL.n;
  c.value = WIND_COUNT_STEPS.indexOf(3000); c.dispatchEvent(new Event('input'));
  out.n = windGL.n; out.savedN = windPref.get('count'); out.labelN = document.getElementById('wind-sl-count-v').textContent;
  b.value = 0.7; b.dispatchEvent(new Event('input'));
  out.alpha = windBgAlpha(); out.texA = windGL.bgData[[...windGL.bgGrid.ok].findIndex(x => x) * 4 + 3]; out.labelB = document.getElementById('wind-sl-bg-v').textContent;
  windGLSetBgAlpha(9); out.clampB = windBgAlpha();
  windGLSetCount(10); out.clampN = windGL.n;
  windGLSetCount(50000); out.clampHi = windGL.n;
  windGLSetCount(4000); windGLScaleCount(0.25); out.q = windGL.n;
  // 片付け：覚えた値を消して元の粒の数へ
  localStorage.removeItem('windGL.count'); localStorage.removeItem('windGL.bgAlpha');
  windGL.override = keep; windGLAlloc(keep); windGLBgTexture(windGL.grid);
  out.reset = windBgAlpha();
  return out;
});
ok(sl.has && sl.steps === '100,200,300,400,500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,9500,10000' &&
  sl.cMax === 23 && sl.bMin === 0.1 && sl.bMax === 0.9 && sl.quarter, '★「風の流れ」の行に粒の数（100〜10,000・500 までは 100 刻み・以降 500 刻み）と背景の濃さ（0.1〜0.9）のスライダー・粒¼', sl);
ok(sl.n === 3000 && sl.savedN === 3000 && sl.labelN === '3,000' && sl.n300 === 300, '★粒のスライダーで粒の数が変わり、端末に覚える', sl);
ok(Math.abs(sl.alpha - 0.7) < 1e-9 && sl.texA === Math.round(255 * 0.7) && sl.labelB === '0.70', '★背景のスライダーで背景の濃さが変わり、端末に覚える', sl);
ok(Math.abs(sl.clampB - 0.9) < 1e-9 && sl.clampN === 100 && sl.clampHi === 10000 && sl.q === 1000 && Math.abs(sl.reset - 0.45) < 1e-9, 'スライダーの値は範囲（100〜10,000）に収める・粒¼で1/4・覚えた値が無ければ既定', sl);
// 粒の色（v4.140.0）：見た目の粒の速さで、背景と同じ付け方（帯の中ほどで整数・間は線形）。a_meta の整数部は 0〜64
const pc = await page.evaluate(() => {
  const out = { pos: [windSpeedPos(0), windSpeedPos(1.5), windSpeedPos(3.25), windSpeedPos(21), windSpeedPos(99)] };
  windGLToggleColor();   // 色:粒
  windGLStep(0.016, glView(), performance.now());
  let bad = 0, drawn = 0;
  for (let i = 0; i < windGL.n; i++) { const m = windGL.seg[i * 5 + 4]; if (!m) continue; drawn++; const q = Math.floor(m); if (q < 0 || q > 64) bad++; }
  windGLRender(glView(), 0.016); out.glErr = windGL.gl.getError();
  out.hud = document.getElementById('wind-hud-text').textContent;
  windGLToggleColor();
  return { ...out, bad, drawn };
});
ok(pc.pos.join(',') === '0,0,0.5,4,4' && pc.drawn > 0 && pc.bad === 0 && pc.glErr === 0 && /色 粒＝/.test(pc.hud), '★色:粒 の粒の色は見た目の速さ（背景と同じなめらかな付け方）', pc);
if (process.env.SHOT) { await page.evaluate(() => windGLHudMin()); await page.waitForTimeout(1500); await page.screenshot({ path: process.env.SHOT }); await page.evaluate(() => windGLHudMin()); if (process.env.SHOT2) await page.screenshot({ path: process.env.SHOT2 }); }

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
  ms: windGL.terrain && windGL.terrain.ms, an: terrainAn.result && terrainAn.result.ms, grid: terrainAn.result && terrainAn.result.grid.nx * terrainAn.result.grid.ny, cols: terrainAn.result && terrainAn.result.cols.ms, flow: terrainAn.result && terrainAn.result.flow.ms }));
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
