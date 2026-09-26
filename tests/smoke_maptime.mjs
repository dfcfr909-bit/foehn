/* 地図のタイムスライダー（v4.119.0・利用者の要望「グラフと地図を行き来するのが面倒」）。見ること:
 *   ①風の層が入っているときだけ出す（時刻で変わるのは風だけ。雨雲・雷・衛星・アメダスは実況）
 *   ②グラフと**同じ選択時刻**（state.sliderIndex）を動かす。地図で選んだ時刻はグラフでも同じ
 *   ③動かしている間は表示だけ、離したら風をその時刻で描き直す。控えがあれば取り直さない
 *   ④◀▶は1時間ずつ・端で止まる。「今」で現在時刻へ
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
await page.evaluate(() => leafletMap.setView([36.57, 137.65], 10, { animate: false }));
await page.waitForTimeout(400);
const vis = () => page.evaluate(() => !document.getElementById('map-time').classList.contains('hidden'));

// ① 風の層が無い間は出さない
ok(!(await vis()), '★風の層が入っていないときは出さない');
await page.evaluate(() => toggleOverlay('windArrows'));
await page.waitForTimeout(2200);
ok(await vis(), '★★風の層を入れたら地図にタイムスライダーが出る');

// ② 動かしている間は表示だけ → 離したら選択時刻と風の時刻が変わる
const before = await page.evaluate(() => ({ idx: state.sliderIndex, key: lastWindField && lastWindField.timeKey, reqs: 0 }));
const nReq = windReqs.length;
const drag = await page.evaluate(() => {
  const r = document.getElementById('map-time-range');
  r.value = String(state.sliderIndex + 30);
  r.dispatchEvent(new Event('input'));
  return { idx: state.sliderIndex, key: lastWindField.timeKey, label: document.getElementById('map-time-label').textContent };
});
ok(drag.idx === before.idx && drag.key === before.key, '★動かしている間は選択時刻も風も変えない（表示だけ）', drag);
const commit = await page.evaluate(async () => {
  const r = document.getElementById('map-time-range');
  r.dispatchEvent(new Event('change'));
  await new Promise(res => setTimeout(res, 300));
  const t = state.allData[state.sliderIndex].time;
  return { idx: state.sliderIndex, key: lastWindField.timeKey, want: isoHour(t),
    label: document.getElementById('map-time-label').textContent, rangeVal: +r.value, badge: document.getElementById('date-time').textContent };
});
ok(commit.idx === before.idx + 30, '★★離したらグラフと同じ選択時刻（state.sliderIndex）が動く', commit);
ok(commit.key === commit.want, '★★風はその時刻で描き直される', commit);
ok(commit.label === drag.label && commit.rangeVal === commit.idx, '表示とつまみが選択時刻と一致', { commit, drag });
ok(commit.badge.startsWith(commit.want.slice(11, 13)), 'グラフ側の日時の札も同じ時刻', commit);
await page.waitForTimeout(700);
ok(windReqs.length === nReq, '★控えの範囲内なら時刻を変えても取り直さない', windReqs.length - nReq);

// ④ ◀▶・今・端
const steps = await page.evaluate(async () => {
  const a = state.sliderIndex;
  document.getElementById('map-time-next').click();
  const b = state.sliderIndex;
  document.getElementById('map-time-prev').click();
  document.getElementById('map-time-prev').click();
  const c = state.sliderIndex;
  document.getElementById('map-time-now').click();
  const now = Math.round(nowIndexFrac());
  const d = state.sliderIndex, nowDisabled = document.getElementById('map-time-now').disabled;
  setMapTime(0);
  const prevDisabled = document.getElementById('map-time-prev').disabled;
  document.getElementById('map-time-prev').click();
  const e = state.sliderIndex;
  return { a, b, c, d, now, nowDisabled, prevDisabled, e, label: document.getElementById('map-time-label').textContent };
});
ok(steps.b === steps.a + 1 && steps.c === steps.a - 1, '★◀▶は1時間ずつ', steps);
ok(steps.d === steps.now && steps.nowDisabled, '★「今」で現在時刻へ（いまなら押せない）', steps);
ok(steps.prevDisabled && steps.e === 0, '先頭では◀が押せず、それより前へ行かない', steps);
ok(/過去/.test(steps.label), '過去の時刻は「過去（解析値）」と断る', steps.label);

// ① 風の層を切ったら消す・流れだけでも出る
ok(await page.evaluate(() => { toggleOverlay('windArrows'); return document.getElementById('map-time').classList.contains('hidden'); }),
  '★風の層を切ったら消す');
await page.evaluate(() => toggleOverlay('windFlow'));
await page.waitForTimeout(600);
ok(await vis(), '風の流れだけでも出る');

// 390px 幅で地点名の行・円柱と重ならない
const lay = await page.evaluate(() => {
  const r = id => document.getElementById(id).getBoundingClientRect();
  const t = r('map-time'), f = r('map-foot');
  return { tBottom: t.bottom, fTop: f.top, tLeft: t.left, tRight: t.right, w: innerWidth };
});
ok(lay.tBottom <= lay.fTop + 0.5 && lay.tLeft >= 0 && lay.tRight <= lay.w, '★地点名の行と重ならず、画面からはみ出さない', lay);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MAPTIME SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ commit, steps, lay }));
console.log('MAPTIME SMOKE PASSED');
