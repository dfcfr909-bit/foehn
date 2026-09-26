/* 風の矢印の問い合わせ回数（v4.108.0）。
 *
 * ⚠⚠ 実機の地図に「風向風速：取得できません（HTTP 429）」が出た。429 は相手（Open-Meteo）の
 *   「問い合わせが多すぎる」。以前は「画面の範囲＋選択時刻」を鍵にして 25地点を取り直していたので、
 *   **地図を少し動かすたび・時刻を変えるたびに** 25地点ぶん問い合わせていた。
 *   Open-Meteo は地点の数だけ回数を数える（無料枠は1分600回など）。
 * ここでは**問い合わせの回数と地点の数**を数えて、また増えていないかを見る。
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
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };
const pad = n => String(n).padStart(2, '0');
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
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
/* 風の場の応答（v4.113.0）。全部の層を1回で返す。時刻は「昨日0時から4日分」（near）か
   「3日前から11日分」（full）。⚠ 高度別の風の場は AUTO と手動で取り方を分けない */
function windResp(n, drop = 0, span = 'near') {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (span === 'full' ? 3 : 1));
  const time = [];
  for (let i = 0; i < (span === 'full' ? 264 : 96); i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
  }
  // drop>0 なら末尾の点を欠かす（返事が欠けたときに取り直しが止まらなくならないか）
  const lv = { 925: 780, 900: 1000, 850: 1460, 800: 1950, 700: 3010 };
  return Array.from({ length: n - drop }, (_, i) => {
    const h = { time, wind_speed_10m: time.map((_, k) => 3 + (k % 5)), wind_direction_10m: time.map(() => 270) };
    for (const [p, z] of Object.entries(lv)) {
      h[`wind_speed_${p}hPa`] = time.map(() => 8); h[`wind_direction_${p}hPa`] = time.map(() => 280);
      h[`geopotential_height_${p}hPa`] = time.map(() => z);
    }
    return { elevation: 900, hourly: h };
  });
}
// 地形表（AUTO の基準標高）。どの升目も 1,500m にしておく
function terrainJson() {
  const cells = {};
  for (let i = 100; i < 200; i++) for (let j = 100; j < 200; j++) cells[`${i},${j}`] = [1500, 1500, 1800, 1200, 5000];
  return JSON.stringify({ version: 1, fields: ['p90s', 'p90', 'max', 'mean', 'n'], cells });
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => errors.push(e.message));
const windReqs = [];          // 地点の数
let mode = 'ok';              // 'ok' | '429' | 'drop'
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) {
    if (url.includes('wind_speed_10m')) {
      const n = new URL(url).searchParams.get('latitude').split(',').length;
      windReqs.push(n);
      if (mode === '429') return route.fulfill({ status: 429, body: '{"reason":"Too many"}', headers: { 'access-control-allow-origin': '*' } });
      const span = new URL(url).searchParams.get('forecast_days') === '8' ? 'full' : 'near';
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(windResp(n, mode === 'drop' ? 3 : 0, span)),
        headers: { 'access-control-allow-origin': '*' } });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  }
  if (url.endsWith('/data/terrain_ref.json')) return route.fulfill({ contentType: 'application/json', body: terrainJson() });
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);
await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 9, { animate: false }); toggleOverlay('windArrows'); });
await page.waitForTimeout(1500);

const arrows = () => page.evaluate(() => document.querySelectorAll('.wind-box').length);
const status = () => page.evaluate(() => (document.querySelector('.layer-status[data-id="windArrows"]') || {}).textContent || '');

/* --- 1. 最初は1回で、画面の格子点ぶん --- */
ok(windReqs.length === 1, '★最初の表示で問い合わせは1回', windReqs);
ok(windReqs[0] >= 12 && windReqs[0] <= 40, '地点の数は以前（25）と同じくらい', windReqs);
ok(await arrows() > 0, '矢印が出る');

/* --- 2. 時刻を変えても取り直さない（2日分を持っている） --- */
windReqs.length = 0;
await page.evaluate(() => { state.sliderIndex = Math.min(state.allData.length - 1, state.sliderIndex + 5); refreshWeatherPoints(); });
await page.waitForTimeout(1000);
ok(windReqs.length === 0, '★★★時刻を変えても問い合わせない', windReqs);
ok(await arrows() > 0, '時刻を変えても矢印は出たまま');

/* --- 3. 少し動かして戻す：新しく見えた点だけ取る／戻したら取らない --- */
const first = await page.evaluate(() => windFieldLattice(leafletMap.getBounds(), leafletMap.getZoom()).pts.length);
windReqs.length = 0;
await page.evaluate(() => leafletMap.panBy([60, 0], { animate: false }));
await page.waitForTimeout(1200);
const afterPan = windReqs.slice();
ok(afterPan.length <= 1 && (afterPan[0] || 0) < first, '★★★少し動かしたら、新しく見えた点だけ取る（全点を取り直さない）', { afterPan, first });
windReqs.length = 0;
await page.evaluate(() => leafletMap.panBy([-60, 0], { animate: false }));
await page.waitForTimeout(1200);
ok(windReqs.length === 0, '★★★元の位置に戻したら問い合わせない（控えを使う）', windReqs);

/* --- 4. 続けて何度も動かしても、止まってから1回だけ --- */
windReqs.length = 0;
for (let k = 0; k < 6; k++) {
  await page.evaluate(() => leafletMap.panBy([0, 90], { animate: false }));
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1500);
ok(windReqs.length === 1, '★★続けて動かしている間は取らず、止まってから1回', windReqs);

/* --- 5. 429 を受けたら1分待つ（その間は取りに行かない）・理由を言う --- */
mode = '429';
windReqs.length = 0;
await page.evaluate(() => leafletMap.setZoom(10, { animate: false }));
await page.waitForTimeout(1300);
ok(windReqs.length === 1, '前提: 429 を1回受ける', windReqs);
const st = await status();
ok(/429/.test(st) && /秒/.test(st), '★★429 を受けたら「断られた・何秒で取り直す」と言う', st);
for (let k = 0; k < 3; k++) {
  await page.evaluate(() => leafletMap.panBy([80, 0], { animate: false }));
  await page.waitForTimeout(700);
}
ok(windReqs.length === 1, '★★★429 のあとは待つ間に取りに行かない（重ねて叩かない）', windReqs);
await page.evaluate(() => { windBackoffUntil = 0; });

/* --- 6. 返事が欠けても取り直しが止まらなくならない --- */
mode = 'drop';
windReqs.length = 0;
await page.evaluate(() => leafletMap.setZoom(11, { animate: false }));
await page.waitForTimeout(2500);
ok(windReqs.length === 1, '★★返事に欠けた点があっても、取り直しを繰り返さない', windReqs);

/* --- 7. Open-Meteo は m/s を指定している（⚠ ADR-0005） --- */
ok(/wind_speed_unit:\s*'ms'/.test(HTML.slice(HTML.indexOf('async function fetchWindColumns'), HTML.indexOf('function windColumnAt'))),
  '★★★風の取得で wind_speed_unit=ms を指定している（ADR-0005）');

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WINDRATE SMOKE FAILED');
  process.exit(1);
}
console.log('WINDRATE SMOKE PASSED');
