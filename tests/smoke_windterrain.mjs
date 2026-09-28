/* 風の流れ（実験・WebGL）の段階1：地形に沿った高さの風（v4.121.0）。見ること:
 *   ①格子点ごとに**その地点の標高**で WindVertical.auto を引き直す（谷底は地上10m風寄り、尾根は上空寄り）
 *   ②引き直すのは実験の層の格子だけ。**場・矢印・ポップアップは升目の基準標高のまま**（判定の経路には触らない）
 *   ③AUTO だけ。手動の層には掛けない。「高さ:升目」に戻せば元の格子と同じ
 *   ④標高タイルが無い（海・404）所は升目の風のまま（無い所を作らない）
 * 偽の標高タイル：左半分 900m（モデル地形 1,000m より下＝谷底）、右半分 1,880m（800hPa の高さ＝尾根）。
 * 基準標高はどこも 1,640m（850/800 の半分）なので、升目の風は約12 m/s、谷底は 10m風 2 m/s、尾根は 800hPa 14 m/s
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

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
let DEM_PNG = null;
const routeAll = route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('/data/terrain_ref.json')) return route.fulfill({ contentType: 'application/json', body: terrainJson() });
  if (url.includes('/xyz/dem_png/')) { demReqs.push(url); return route.fulfill({ contentType: 'image/png', body: DEM_PNG, headers: { 'access-control-allow-origin': '*' } }); }
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
{
  const mk = await browser.newPage();
  const b64 = await mk.evaluate(() => {
    const cv = document.createElement('canvas'); cv.width = cv.height = 256;
    const c = cv.getContext('2d');
    const rgb = h => { const x = Math.round(h * 100); return `rgb(${x >> 16 & 255},${x >> 8 & 255},${x & 255})`; };
    c.fillStyle = rgb(900); c.fillRect(0, 0, 128, 256);
    c.fillStyle = rgb(1880); c.fillRect(128, 0, 128, 256);
    return cv.toDataURL('image/png').split(',')[1];
  });
  DEM_PNG = Buffer.from(b64, 'base64');
  await mk.close();
}
await page.route('**/*', routeAll);
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);




await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); windGL.override = 2000; toggleOverlay('windFlowGL'); windGLSetHud(true); });
await page.waitForTimeout(3000);
// 格子点を標高で分けて速さを見る
const nodes = () => page.evaluate(() => {
  const g = windGL.grid, t = windGL.terrain, f = lastWindField;
  const dz = t && t.stats ? t.stats.dz : 8, k = Math.pow(2, dz - g.z0);
  const out = { v: [], r: [], other: 0 };
  for (let r = 0; r < g.rows; r++) for (let c = 0; c < g.cols; c++) {
    const n = r * g.cols + c; if (!g.ok[n]) continue;
    const h = windDemAt((g.x0 + c * g.step) * k, (g.y0 + r * g.step) * k, dz);
    const s = Math.hypot(g.u[n], g.v[n]);
    if (h === 900) out.v.push(s); else if (h === 1880) out.r.push(s); else out.other++;
  }
  const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  const mx = a => a.length ? Math.max(...a) : null, mn = a => a.length ? Math.min(...a) : null;
  return { nv: out.v.length, nr: out.r.length, v: avg(out.v), vmax: mx(out.v), r: avg(out.r), rmin: mn(out.r), other: out.other,
    applied: !!(t && t.applied), terrain: !!g.terrain, ms: t && t.ms, stats: t && t.stats, mode: f.mode, demReqs: 0 };
});
const a = await nodes();
ok(a.applied && a.terrain, '★地形の高さで引き直した（AUTO・標高タイルが読めた）', a);
ok(a.nv > 20 && a.nr > 20, '（前提）谷底と尾根の格子点がどちらもある', a);
ok(Math.abs(a.v - 2) < 0.05 && a.vmax < 2.05, '★★谷底（モデル地形より下）は地上10m風（2 m/s）', a);
ok(Math.abs(a.r - 14) < 0.3 && a.rmin > 13.5, '★★尾根（800hPa の高さ）は 800hPa の風（14 m/s）', a);
ok(a.stats && a.stats.valley.n > 0 && a.stats.valley.s0 > 11 && a.stats.valley.s1 < 2.1, '★比べの集計：谷底は 升目 約12 → 2 m/s', a.stats);
ok(a.stats && a.stats.ridge.n > 0 && a.stats.ridge.s1 > 13.5, '比べの集計：尾根は 約12 → 14 m/s', a.stats);
ok(await page.evaluate(() => /谷底/.test(document.getElementById('wind-hud-text').textContent)), '計測表示に谷底・尾根の比べ');
ok(demReqs.length > 0 && demReqs.every(u => /dem_png\/\d+\//.test(u)), '標高タイルは地理院の dem_png（地点の標高と同じ取得先）', demReqs.slice(0, 2));

// ②場・矢印・ポップアップは升目のまま（引き直しは実験の層の格子だけ）
const probe = () => page.evaluate(() => {
  const f = lastWindField;
  return { u: Array.from(f.u).map(x => x.toFixed(4)).join(','), v: Array.from(f.v).map(x => x.toFixed(4)).join(','),
    text: f.cells.map(c => windTraceText(c.res)).join('|') };
});
await page.evaluate(() => toggleOverlay('windArrows'));
await page.waitForTimeout(800);
const arrowsOn = () => page.evaluate(() => [...document.querySelectorAll('.wind-box')].map(e => e.outerHTML).join(''));
const p1 = await probe(), ar1 = await arrowsOn();
await page.evaluate(() => windGLToggleTerrain());   // 升目へ
await page.waitForTimeout(500);
const b = await nodes();
const p2 = await probe(), ar2 = await arrowsOn();
ok(!b.terrain && Math.abs(b.v - 11.96) < 0.3 && Math.abs(b.r - 11.96) < 0.3, '★★「高さ:升目」に戻せば谷底も尾根も升目の風（約12 m/s）', b);
ok(p1.u === p2.u && p1.v === p2.v, '★★★場（buildWindField）の値は変わらない');
ok(p1.text === p2.text && p1.text.length > 50, '★★★ポップアップ（根拠の文）は変わらない');
ok(ar1 === ar2 && ar1.length > 50, '★★★矢印（数値）は変わらない');
await page.evaluate(() => windGLToggleTerrain());   // 地形へ戻す
await page.waitForTimeout(500);
ok((await nodes()).terrain, '「高さ:地形」へ戻せる');

// ③手動の層には掛けない
await page.evaluate(() => setWindMode('850'));
await page.waitForTimeout(800);
const m = await nodes();
ok(m.mode === '850' && !m.terrain && Math.abs(m.v - 10) < 0.05 && Math.abs(m.r - 10) < 0.05, '★手動の層（850）には掛けない（その層そのもの）', m);
ok(await page.evaluate(() => /手動/.test(windGLTerrainText())), '手動のときは掛けていないと言う');
await page.evaluate(() => setWindMode('auto'));
await page.waitForTimeout(800);

// 標高タイルの控えは上限まで（iOS のメモリ）
ok(await page.evaluate(() => windDem.tiles.size <= WIND_TERRAIN.TILE_MAX), '標高タイルの控えは上限の内');
ok(!errors.length, 'ページ内で例外が出ていない', errors);

// ④標高タイルが無い（海・404）→ 升目の風のまま
DEM_PNG = null;
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 800 } });
const p4 = await ctx2.newPage();
p4.on('pageerror', e => errors.push(e.message));
await p4.route('**/*', route => route.request().url().includes('/xyz/dem_png/') ? route.fulfill({ status: 404, body: '' }) : routeAll(route));
await p4.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await p4.goto('https://sotoki.test/');
await p4.waitForTimeout(1200);
await p4.evaluate(() => openMap());
await p4.waitForTimeout(600);
await p4.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); windGL.override = 1000; toggleOverlay('windFlowGL'); windGLSetHud(true); });
await p4.waitForTimeout(3000);
const sea = await p4.evaluate(() => ({ applied: !!(windGL.terrain && windGL.terrain.applied), running: windGL.running,
  text: windGLTerrainText() }));
ok(!sea.applied && sea.running && /升目の風のまま/.test(sea.text), '★標高タイルが無ければ升目の風のまま流す（無い所を作らない）', sea);
await ctx2.close();
ok(!errors.length, '（別の端末）ページ内で例外が出ていない', errors);

await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WINDTERRAIN SMOKE FAILED');
  process.exit(1);
}
console.log('WINDTERRAIN SMOKE PASSED');
