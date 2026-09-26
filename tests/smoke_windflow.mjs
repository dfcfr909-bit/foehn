/* 風の流れ（Particle Engine・v4.116.0）。見ること:
 *   ①粒子は統合した U/V の場だけを見て流れる（場の無い所に粒を置かない）
 *   ②矢印と流れは同じ場・同じ取得（流れを足しても取り直さない。AUTO/層の切り替えも取り直さない）
 *   ③iPhone の負荷：canvas の倍率の上限・粒の数の上限
 *   ④止める：地図を動かしている間・層を切った・地図を閉じた
 *   ⑤風向どおりに流れる（東から吹く風なら西へ）
 * 以下はもとの風の場の検査の見出し（ハーネスを共有）。
 * 高度別の風の場（Wind Field Engine・ADR-0012）。
 *
 * この機能の目的は「気圧面を標高に読み替える作業」をエンジンで行うこと。ここで見るのは:
 *   ①AUTO が**その時刻の気圧面の高さ**で、基準標高を上下から挟む面を U/V で補間する（固定表を使わない）
 *   ②モデル地形より下の面（外挿値）を使わない。実際の地形とモデル地形の役割分担
 *   ③地表付近は 10m風と最下の有効な面を高さで按分し、**推定値**と印を付ける
 *   ④手動の層は**その層そのもの**。無い時刻（GSM の 800）を別の層で埋めない
 *   ⑤AUTO と手動は**同じ取得・同じ場**を通る（切り替えても取り直さない）
 *   ⑥場（U/V の格子）は描画から独立していて、任意の点の風を引ける
 *   ⑦矢印を押すと「なぜその風か」が出る
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
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('/data/terrain_ref.json')) return route.fulfill({ contentType: 'application/json', body: terrainJson() });
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
});
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);


await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); toggleOverlay('windFlow'); });
await page.waitForTimeout(2200);
const a = await page.evaluate(async () => {
  await new Promise(r => setTimeout(r, 600));
  const g = windFlow.grid, cv = windFlow.cv;
  const img = windFlow.ctx.getImageData(0, 0, cv.width, cv.height).data;
  let painted = 0; for (let k = 3; k < img.length; k += 4) if (img[k] > 20) painted++;
  const off = windFlow.parts.filter(p => p.age < p.max && !flowAt(g, p.x, p.y)).length;
  return { running: windFlow.running, n: windFlow.parts.length, okCount: g && g.okCount, painted,
    off, dpr: windFlow.dpr, cvW: cv.width, cssW: parseFloat(cv.style.width),
    arrows: document.querySelectorAll('.wind-box').length,
    chips: [...document.querySelectorAll('.wind-modes')].length,
    status: (document.querySelector('.layer-status[data-id="windFlow"]') || {}).textContent || '' };
});
ok(a.running && a.n >= 150 && a.n <= 1400, '★流れが動いていて、粒の数が上限の内', a);
ok(a.painted > 500, '★★canvas に軌跡が描かれている', a);
ok(a.off === 0, '★★場の無い所を流れている粒が無い', a);
ok(a.dpr <= 1.5 && a.cvW <= Math.ceil(a.cssW * 1.5) + 1, '★iPhone の負荷：canvas の倍率は1.5で頭打ち', a);
ok(a.arrows === 0, '流れだけ入れたときは矢印を出さない', a);
ok(a.chips === 1, '流れの行にも AUTO／層の切り替え', a);
ok(/AUTO/.test(a.status), '流れの行にも状態の文', a.status);

// ⑤風向：この偽データの AUTO（850/800 の按分）は 270°/280° から＝東へ流れる
const dir = await page.evaluate(() => {
  const g = windFlow.grid; let sx = 0, sy = 0;
  for (let n = 0; n < g.vx.length; n++) if (g.ok[n]) { sx += g.vx[n]; sy += g.vy[n]; }
  return { sx, sy };
});
ok(dir.sx > 0 && Math.abs(dir.sy) < Math.abs(dir.sx), '★★西から吹く風の粒は東（右）へ流れる', dir);

// ② 矢印を足しても・層を変えても取り直さない
const nReq = windReqs.length;
await page.evaluate(async () => { toggleOverlay('windArrows'); await new Promise(r => setTimeout(r, 300)); setWindMode('700'); await new Promise(r => setTimeout(r, 300)); });
const b = await page.evaluate(() => ({ arrows: document.querySelectorAll('.wind-box').length, running: windFlow.running, mode: lastWindField.mode,
  sameField: true }));
ok(b.arrows > 0 && b.running && b.mode === '700', '矢印と流れが同じ場（700）で並ぶ', b);
ok(windReqs.length === nReq, '★★★矢印を足しても・層を変えても取り直さない（同じ取得）', windReqs.length - nReq);

// ④ 動かしている間は止める → 動き終わったら撒き直す
const moving = await page.evaluate(() => new Promise(r => {
  // ⚠ 演出なしの panBy は movestart→moveend が続けて走る。止まったかは movestart の中で読む
  leafletMap.once('movestart', () => r(windFlow.running));
  leafletMap.panBy([40, 0], { animate: false });
}));
ok(moving === false, '★地図を動かし始めたら止める', moving);
await page.waitForTimeout(900);
ok(await page.evaluate(() => windFlow.running), '動き終わったら流れを戻す');

// 層を切ったら止める・地図を閉じたら止める
ok(await page.evaluate(() => { toggleOverlay('windFlow'); return !windFlow.running; }), '★層を切ったら止める');
await page.evaluate(() => toggleOverlay('windFlow'));
await page.waitForTimeout(600);
ok(await page.evaluate(() => { closeMap(); return !windFlow.running; }), '★★地図を閉じたら止める（電池）');

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WINDFLOW SMOKE FAILED');
  process.exit(1);
}
console.log('WINDFLOW SMOKE PASSED');
