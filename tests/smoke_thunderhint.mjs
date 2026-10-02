/* 雷雨の目安（段階3・#138）。
 *
 * 要件: docs/requirements_snow_thunder_hint.md。
 * 風の矢印と同じ格子点に、ショワルター安定指数（SSI）が不安定側（≦0）の点だけ記号を置く。
 *
 * ⚠⚠ 見るのは「記号が出るか」より**「嘘をつかないか」**:
 *   ・SSI の計算が**別の道具（MetPy）の値**と合う（tests/refs/ssi_metpy_ref.json）
 *   ・SSI の境（0／−3／−6／−9）で区分が変わる
 *   ・850hPa 面が地中の升目は**計算しない**（理由を言う）。入力が欠けたら「分からない」（安定とは言わない）
 *   ・降雪の目安とは取得が別。429 の待ちだけ共有。m/s の指定を付け忘れない（ADR-0005）
 *   ・ABC評価（THRESH）には触れない
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
const isoH = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    h.time.push(isoH(new Date(start.getTime() + i * 3600e3)));
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


const refs = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/refs/ssi_metpy_ref.json'), 'utf8')).cases;

/* 雷雨の目安の応答。⚠ 時刻は「3日前から11日分」。値は呼び出し側が決める（TH）。null を入れると「その値が無い」 */
let TH = { t850: 25, td850: 22, t500: -3, gh850: 1500 };   // SSI ≒ −7.5（激しい雷雨の可能性）
let ZMODEL = 900;
function thResp(n) {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  const time = [];
  for (let i = 0; i < 264; i++) time.push(isoH(new Date(start.getTime() + i * 3600e3)));
  return Array.from({ length: n }, () => {
    const h = { time,
      temperature_850hPa: time.map(() => TH.t850), dew_point_850hPa: time.map(() => TH.td850),
      temperature_500hPa: time.map(() => TH.t500), geopotential_height_850hPa: time.map(() => TH.gh850),
      wind_speed_900hPa: time.map(() => 6), wind_speed_800hPa: time.map(() => 7) };
    return { elevation: ZMODEL, hourly: h };
  });
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => errors.push(e.message));
const thReqs = [], thUrls = [], snowReqs = [], windReqs = [];
let mode = 'ok';              // 'ok' | '429' | '500'
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) {
    const u = new URL(url);
    const hourly = u.searchParams.get('hourly') || '';
    const n = (u.searchParams.get('latitude') || '').split(',').length;
    if (hourly.startsWith('temperature_850hPa')) {                 // 雷雨の目安
      thReqs.push(n); thUrls.push(url);
      if (mode === '429') return route.fulfill({ status: 429, body: '{"reason":"Too many"}', headers: { 'access-control-allow-origin': '*' } });
      if (mode === '500') return route.fulfill({ status: 500, body: 'x', headers: { 'access-control-allow-origin': '*' } });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(thResp(n)),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (hourly.startsWith('temperature_2m,precipitation')) { snowReqs.push(n); return route.fulfill({ status: 404, body: '' }); }
    if (hourly.includes('wind_speed_10m')) { windReqs.push(n); return route.fulfill({ status: 404, body: '' }); }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  }
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);
await page.evaluate(() => openMap());
await page.waitForTimeout(600);

const shown = () => page.evaluate(() => [...document.querySelectorAll('.th-box')]
  .filter(b => b.closest('.thunder-hint')).map(b => ({ cls: b.className, text: b.textContent })));
const status = () => page.evaluate(() => (document.querySelector('.layer-status[data-id="thunderHint"]') || {}).textContent || '');
const reload = async () => {
  await page.evaluate(() => { thunderCols.clear(); refreshWeatherPoints(); });
  await page.waitForTimeout(1500);
};

/* --- 0. SSI の計算：別の道具（MetPy）の値と合う --- */
const calc = await page.evaluate(refs => refs.map(([a, b, c, r]) => [r, showalterIndex(a, b, c)]), refs);
const maxd = Math.max(...calc.map(([r, v]) => Math.abs(v - r)));
ok(refs.length >= 10 && calc.every(([, v]) => Number.isFinite(v)), '前提: 参照値が読めて、全件が数で返る', calc.length);
ok(maxd < 0.1, '★★★SSI が MetPy の showalter_index と 0.1℃ 以内で合う', { maxd, calc });
const edge = await page.evaluate(() => ({
  nan: showalterIndex(NaN, 10, -5), nul: showalterIndex(null, 10, -5), und: showalterIndex(10, undefined, -5),
  dewOver: showalterIndex(10, 15, -10), dewEq: showalterIndex(10, 10, -10),
  lv: [1, 0, -0.1, -3, -3.1, -6, -6.1, -9, -9.1].map(x => thunderLevelOf(x)),
}));
ok(edge.nan === null && edge.nul === null && edge.und === null, '★入力が欠けていたら null（0 や安定にしない）', edge);
ok(edge.dewOver === edge.dewEq, '露点が気温を超えても気温に抑える', edge);
ok(JSON.stringify(edge.lv) === JSON.stringify([null, 'unstable', 'unstable', 'possible', 'possible', 'severe', 'severe', 'severeHigh', 'severeHigh']),
  '★SSI の境：＞0 安定（記号なし）／≦0 不安定／≦−3 可能性／≦−6 激しい／≦−9 激しい・大', edge.lv);

/* --- 1. 出る：SSI ≒ −7.5 --- */
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 9, { animate: false }); toggleOverlay('thunderHint'); });
await page.waitForTimeout(1500);
const s1 = await shown();
ok(s1.length > 0, 'SSI が不安定側なら記号が出る', s1);
ok(s1.length > 0 && s1.every(x => /severe/.test(x.cls) && !/severeHigh/.test(x.cls) && /SSI/.test(x.text) && /-7\.\d/.test(x.text)),
  '★SSI の値と区分（≦−6）が出る', s1.slice(0, 2));
ok(thReqs.length >= 1 && thReqs.every(n => n <= 40), '前提: 取得に行った・1回は40地点まで', thReqs);
ok(snowReqs.length === 0 && windReqs.length === 0, '★★降雪の目安・風の取得に相乗りしない（入れていなければ取らない）', { snowReqs, windReqs });
const u0 = new URL(thUrls[0]);
ok(u0.searchParams.get('hourly') === 'temperature_850hPa,dew_point_850hPa,temperature_500hPa,geopotential_height_850hPa,wind_speed_900hPa,wind_speed_800hPa',
  '取る変数は 850hPa の気温・露点・高度、500hPa の気温（＋モデル判別の風の層）', u0.searchParams.get('hourly'));
ok(u0.searchParams.get('wind_speed_unit') === 'ms', '★★★m/s を指定している（ADR-0005）', u0.searchParams.get('wind_speed_unit'));
ok(u0.searchParams.get('models') === 'jma_seamless' && u0.searchParams.get('cell_selection') === 'nearest', 'models・cell_selection');

const popup = await page.evaluate(async () => {
  const m = weatherMarkers.find(x => x.getPopup && x.getPopup());
  if (!m) return null;
  m.openPopup();
  await new Promise(r => setTimeout(r, 100));
  const el = document.querySelector('.leaflet-popup-content');
  return el ? el.textContent : null;
});
ok(popup && /観測ではありません/.test(popup) && /雷ナウキャスト/.test(popup), '★根拠の札に「観測ではない」「雷ナウキャストで確認」', popup);
ok(popup && /25\.0℃/.test(popup) && /22\.0℃/.test(popup) && /-3\.0℃/.test(popup) && /SSI -7\.\d/.test(popup),
  '根拠の札に 850hPa の気温・露点・500hPa の気温・SSI が出る', popup);
ok(popup && /MSM/.test(popup), '根拠の札にモデル名が出る', popup);
const legend = await page.evaluate(() => { const el = document.querySelector('.sh-legend'); return el ? el.textContent : null; });
ok(legend && /SSI/.test(legend) && /観測ではありません/.test(legend) && /雷ナウキャスト/.test(legend) && /-3/.test(legend) && /-6/.test(legend) && /-9/.test(legend),
  '★凡例：SSI の境・「観測ではない」・「雷ナウキャストで確認」', legend);

/* --- 2. 区分：入力を変えると色の区分が変わる --- */
const lv = async t => { TH = { ...TH, ...t }; await reload(); return shown(); };
const stable = await lv({ t850: 15, td850: 10, t500: -5 });                    // SSI ≒ +6.8
ok(stable.length === 0, '★安定（SSI ＞ 0）は記号を出さない', stable);
ok(/不安定.*ありません/.test(await status()), '★記号が1つも無いときは理由を言う（安定）', await status());
const weak = await lv({ t850: 12, td850: 12, t500: -10 });                     // SSI ≒ +1.6
ok(weak.length === 0, 'SSI +1.6 も出さない', weak);
const high = await lv({ t850: 25, td850: 22, t500: -3 });
ok(high.length > 0 && high.every(x => /severe/.test(x.cls)), '前提: 元の入力に戻すと出る');
const hi = await lv({ t850: 3, td850: 3, t500: -30 });                         // SSI ≒ −4.5（可能性）
ok(hi.length > 0 && hi.every(x => /possible/.test(x.cls)), '★SSI ≒ −4.5 は「雷雨の可能性」', hi.slice(0, 2));
TH = { t850: 25, td850: 22, t500: -3, gh850: 1500 };

/* --- 3. 850hPa 面が地中：計算しない（黙って消さず理由を言う） --- */
ZMODEL = 1480;               // 850hPa の高度 1500m − 余裕50m = 1450m より高い
await reload();
ok((await shown()).length === 0, '★★850hPa 面が地中の升目は計算しない（記号を出さない）', await shown());
ok(/850hPa面が地面より下/.test(await status()), '★その理由を言う', await status());
ZMODEL = 900;

/* --- 4. 入力が欠けたら「分からない」。安定とは言わない --- */
TH = { ...TH, t500: null };
await reload();
ok((await shown()).length === 0, '入力が欠けたら記号を出さない');
ok(/取得できていません/.test(await status()) && !/ありません（?安定/.test(await status()), '★★欠けは「分からない」（安定・ゼロと言わない）', await status());
TH = { t850: 25, td850: 22, t500: -3, gh850: 1500 };
TH = { ...TH, gh850: null };
await reload();
ok(/取得できていません/.test(await status()), '★850hPa の高度が無くても分からないと言う（地中判定ができない）', await status());
TH = { t850: 25, td850: 22, t500: -3, gh850: 1500 };

/* --- 5. 時刻を変えても取り直さない・失敗は理由 --- */
await reload();
thReqs.length = 0;
await page.evaluate(() => { state.sliderIndex = Math.min(state.allData.length - 1, state.sliderIndex + 5); refreshWeatherPoints(); });
await page.waitForTimeout(900);
ok(thReqs.length === 0, '★★時刻を変えても問い合わせない', thReqs);
ok((await shown()).length > 0, '時刻を変えても記号は出たまま');
ok(await page.evaluate(() => !document.getElementById('map-time').classList.contains('hidden')), '★雷雨の目安だけを入れていても、地図のタイムスライダーが出る');
mode = '500';
await reload();
ok(/取得できません/.test(await status()), '★取得に失敗したら理由を言う', await status());
mode = 'ok';

/* --- 6. 429：待つ（重ねて叩かない）・風と待ちを共有する --- */
mode = '429';
thReqs.length = 0;
await page.evaluate(() => { windBackoffUntil = 0; thunderCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
ok(thReqs.length === 1, '前提: 429 を1回受ける', thReqs);
ok(/429/.test(await status()) && /秒/.test(await status()), '★429 を受けたら「断られた・何秒で取り直す」と言う', await status());
for (let k = 0; k < 3; k++) {
  await page.evaluate(() => leafletMap.panBy([80, 0], { animate: false }));
  await page.waitForTimeout(700);
}
ok(thReqs.length === 1, '★★★429 のあとは待つ間に取りに行かない', thReqs);
ok(await page.evaluate(() => windBackoffUntil > Date.now()), '★429 の待ちは風と共有する（windBackoffUntil）');
await page.evaluate(() => { windBackoffUntil = 0; });
mode = 'ok';

/* --- 7. 拡大が足りない間／切ったら消える／ABC評価に触れない --- */
await page.evaluate(() => { leafletMap.setZoom(5, { animate: false }); });
await page.waitForTimeout(800);
ok((await shown()).length === 0 && /拡大すると/.test(await status()), '★拡大が足りない間は出さず、理由を言う', await status());
await page.evaluate(() => { leafletMap.setZoom(9, { animate: false }); });
await page.waitForTimeout(1500);
await page.evaluate(() => toggleOverlay('thunderHint'));
await page.waitForTimeout(600);
ok((await shown()).length === 0, '層を切ったら記号も消える');
const src = HTML.slice(HTML.indexOf('const THUNDER_HINT = {'), HTML.indexOf('   風の流れ（Particle Engine）'));
const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
ok(!/THRESH/.test(code) && !/abcScore|judgePoint/.test(code), '★★ABC評価（THRESH・abcScore・judgePoint）に触れていない');

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('THUNDERHINT SMOKE FAILED');
  process.exit(1);
}
console.log('THUNDERHINT SMOKE PASSED');
