/* 降雪の目安（段階2・#131）。
 *
 * 要件: docs/requirements_snow_thunder_hint.md。
 * 風の矢印と同じ格子点に、選択時刻の「雨／みぞれ／雪」の記号を置く（降水がある点だけ）。
 *
 * ⚠⚠ 見るのは「記号が出るか」より**「嘘をつかないか」**:
 *   ・標高補正した気温で分ける（モデル標高のままの気温で分けない）
 *   ・降水は**先の1時間**（直前1時間ではない）。降水が**無い**と**読めない**を区別する
 *   ・閾値の境（0.5℃・2.0℃）で種類が変わる
 *   ・取得に失敗したら理由を言う（黙って消さない）。429 のあとは待つ（風と共有）
 *   ・風の取得に相乗りしない（変数が別）。m/s の指定を付け忘れない（ADR-0005）
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

/* 降雪の目安の応答。⚠ 時刻は「3日前から11日分」（full）。
   温度 T2M・降水 PR は呼び出し側が決める（降水は時刻ごとの配列：先の1時間で読まれるので 1時間ずらして確かめる） */
let T2M = 1.0;                 // モデル標高での気温（℃）
let PR = 2.0;                  // 降水（mm/h）
let ZMODEL = 900;              // モデル標高（m）
let PR_AT = null;              // 降水を特定の時刻（ISO）の添字だけにしたいとき { iso: 値 }
function snowResp(n, url) {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  const time = [];
  for (let i = 0; i < 264; i++) time.push(isoH(new Date(start.getTime() + i * 3600e3)));
  return Array.from({ length: n }, () => {
    const h = { time, temperature_2m: time.map(() => T2M),
      precipitation: time.map(t => (PR_AT ? (PR_AT[t] ?? 0) : PR)) };
    // MSM だけの風の層（モデルの判別用）。全時刻にある＝全部 MSM
    h.wind_speed_900hPa = time.map(() => 6); h.wind_speed_800hPa = time.map(() => 7);
    return { elevation: ZMODEL, hourly: h };
  });
}
// 地形表（基準標高）。どの升目も 1,500m にしておく（z_ref ＞ モデル標高 900m）
let ZREF = 1500;
function terrainJson() {
  const cells = {};
  for (let i = 100; i < 200; i++) for (let j = 100; j < 200; j++) cells[`${i},${j}`] = [ZREF, ZREF, ZREF + 300, ZREF - 300, 5000];
  return JSON.stringify({ version: 1, fields: ['p90s', 'p90', 'max', 'mean', 'n'], cells });
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => errors.push(e.message));
const snowReqs = [];          // 降雪の目安の問い合わせ（地点の数）
const snowUrls = [];
const windReqs = [];
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
    if (hourly.startsWith('temperature_2m,precipitation')) {       // 降雪の目安
      snowReqs.push(n); snowUrls.push(url);
      if (mode === '429') return route.fulfill({ status: 429, body: '{"reason":"Too many"}', headers: { 'access-control-allow-origin': '*' } });
      if (mode === '500') return route.fulfill({ status: 500, body: 'x', headers: { 'access-control-allow-origin': '*' } });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(snowResp(n, url)),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (hourly.includes('wind_speed_10m')) { windReqs.push(n); return route.fulfill({ status: 404, body: '' }); }
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

const shown = () => page.evaluate(() => [...document.querySelectorAll('.sh-box')]
  .filter(b => b.closest('.snow-hint')).map(b => ({ cls: b.className, text: b.textContent })));
const status = () => page.evaluate(() => (document.querySelector('.layer-status[data-id="snowHint"]') || {}).textContent || '');
const open = async () => {
  await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 9, { animate: false }); toggleOverlay('snowHint'); });
  await page.waitForTimeout(1500);
};

/* --- 純関数：標高補正と閾値の境 --- */
const pure = await page.evaluate(() => ({
  c: SNOW_HINT,
  t1: snowTempAt(1.0, 900, 1500),            // 600m 上で 3.9℃ 下がる
  edges: [-3, 0.5, 0.51, 2.0, 2.01, 10].map(t => snowTypeOf(t)),
}));
ok(Math.abs(pure.t1 - (1.0 - 0.0065 * 600)) < 1e-9, '★標高補正：T = T2m + 0.0065 × (モデル標高 − z_ref)', pure.t1);
ok(JSON.stringify(pure.edges) === JSON.stringify(['snow', 'snow', 'sleet', 'sleet', 'rain', 'rain']),
  '★閾値の境：0.5℃以下は雪・2.0℃以下はみぞれ・それ超は雨', pure.edges);
ok(pure.c.SNOW_MAX_C === 0.5 && pure.c.SLEET_MAX_C === 2.0, '閾値の初期値は 0.5℃・2.0℃（要件の決定事項）', pure.c);

/* --- 1. 出る：モデル標高 1.0℃ → 基準標高（+600m）で −2.9℃ ＝ 雪 --- */
await open();
let s1 = await shown();
ok(s1.length > 0, '降水があれば記号が出る', s1);
ok(s1.length > 0 && s1.every(x => /snow/.test(x.cls) && /雪/.test(x.text)),
  '★標高補正すると雪（モデル標高の気温 1.0℃ のままならみぞれになる）', s1.slice(0, 3));
ok(s1.length > 0 && /2\.0/.test(s1[0].text), '降水量（mm）を添える', s1[0]);
ok(snowReqs.length >= 1, '前提: 降雪の目安の取得に行った', snowReqs);
ok(snowReqs.every(n => n <= 40), '★1回の問い合わせは40地点まで', snowReqs);
ok(windReqs.length === 0, '★★風の取得に相乗りしない（風の矢印を入れていなければ風を取らない）', windReqs);
const u0 = new URL(snowUrls[0]);
ok(u0.searchParams.get('hourly') === 'temperature_2m,precipitation,wind_speed_900hPa,wind_speed_800hPa',
  '取る変数は気温・降水（＋モデル判別の風の層）だけ', u0.searchParams.get('hourly'));
ok(u0.searchParams.get('wind_speed_unit') === 'ms', '★★★m/s を指定している（ADR-0005）', u0.searchParams.get('wind_speed_unit'));
ok(u0.searchParams.get('models') === 'jma_seamless', 'モデルは jma_seamless');
ok(/^nan(,nan)*$/.test(u0.searchParams.get('elevation') || ''), '★モデル標高の気温を取る（elevation=nan。補正は自前）', u0.searchParams.get('elevation'));
ok(u0.searchParams.get('cell_selection') === 'nearest', 'cell_selection=nearest');

/* 記号は押すと根拠が出る（気温の補正前後・基準標高・閾値・モデル・「観測ではない」） */
const popup = await page.evaluate(async () => {
  const m = weatherMarkers.find(x => x.getPopup && x.getPopup());
  if (!m) return null;
  m.openPopup();
  await new Promise(r => setTimeout(r, 100));
  const el = document.querySelector('.leaflet-popup-content');
  return el ? el.textContent : null;
});
ok(popup && /観測ではありません/.test(popup), '★根拠の札に「観測ではない」と出る', popup);
ok(popup && /1\.0℃/.test(popup) && /-2\.9℃/.test(popup), '根拠の札に補正前（1.0℃）と補正後（-2.9℃）の気温が出る', popup);
ok(popup && /1,500m/.test(popup) && /900m/.test(popup), '根拠の札に基準標高とモデル標高が出る', popup);
ok(popup && /仮置き/.test(popup), '根拠の札に閾値が仮置きと出る', popup);
ok(popup && /MSM/.test(popup), '根拠の札にモデル名が出る', popup);

/* 凡例 */
const legend = await page.evaluate(() => { const el = document.querySelector('.sh-legend'); return el ? el.textContent : null; });
ok(legend && /0\.5℃/.test(legend) && /2℃/.test(legend) && /観測ではありません/.test(legend) && /降雨レーダー/.test(legend),
  '★凡例：気温の境・「観測ではない」・「降雨レーダーで確認」', legend);

/* --- 2. 境の気温でみぞれ・雨になる（補正後の気温で分ける） --- */
const kinds = async (t2m, zref = 1500) => {
  T2M = t2m; ZREF = zref;
  // ⚠ 地形表は一度読んだらページが持っている。モックを変えても読み直さないので、持っている表を書き換える
  await page.evaluate(z => { for (const k of Object.keys(terrainRef.cells)) terrainRef.cells[k][0] = z; snowCols.clear(); refreshWeatherPoints(); }, zref);
  await page.waitForTimeout(1500);
  return shown();
};
// 補正は 0.0065×(900−z_ref)。z_ref=900 なら補正なし（気温そのまま）
const sleet = await kinds(1.5, 900);
ok(sleet.length > 0 && sleet.every(x => /sleet/.test(x.cls)), '★1.5℃（補正なし）はみぞれ', sleet.slice(0, 2));
const rain = await kinds(5, 900);
ok(rain.length > 0 && rain.every(x => /rain/.test(x.cls) && /雨/.test(x.text)), '★5℃（補正なし）は雨', rain.slice(0, 2));
// 同じ気温 5℃でも、基準標高が 700m 上（z_ref=1600→補正 −4.55℃）なら 0.45℃ で雪
const high = await kinds(5, 1600);
ok(high.length > 0 && high.every(x => /snow/.test(x.cls)), '★★同じ 5℃ でも稜線が高ければ雪（標高補正が効いている）', high.slice(0, 2));
T2M = 1.0; ZREF = 1500;
await page.evaluate(z => { for (const k of Object.keys(terrainRef.cells)) terrainRef.cells[k][0] = z; snowCols.clear(); }, 1500);

/* --- 3. 降水は「先の1時間」。降水が無い時刻には記号を出さず、理由を言う --- */
PR = 2.0;
const nowKey = await page.evaluate(() => isoHour(state.allData[state.sliderIndex].time));
const nextKey = await page.evaluate(() => { const t = state.allData[state.sliderIndex].time; return isoHour(new Date(t.getTime() + 3600e3)); });
// 選択時刻の次の行だけ降水がある（先の1時間）。選択時刻の行だけにあるなら出ない
PR_AT = { [nextKey]: 2.0 };
await page.evaluate(() => { snowCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
ok((await shown()).length > 0, '★降水は先の1時間：選択時刻の次の行に降水があれば出る', { nowKey, nextKey });
PR_AT = { [nowKey]: 2.0 };
await page.evaluate(() => { snowCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
ok((await shown()).length === 0, '★★選択時刻の行だけに降水があっても出さない（直前の1時間を「いま」にしない）', await shown());
ok(/降水の予報はありません/.test(await status()), '★記号が1つも無いときは理由を言う（降水が無い）', await status());
PR_AT = null;

/* --- 4. 時刻を変えても取り直さない（全期間を持っている） --- */
await page.evaluate(() => { snowCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
snowReqs.length = 0;
await page.evaluate(() => { state.sliderIndex = Math.min(state.allData.length - 1, state.sliderIndex + 5); refreshWeatherPoints(); });
await page.waitForTimeout(900);
ok(snowReqs.length === 0, '★★時刻を変えても問い合わせない', snowReqs);
ok((await shown()).length > 0, '時刻を変えても記号は出たまま');
const mapTime = await page.evaluate(() => !document.getElementById('map-time').classList.contains('hidden'));
ok(mapTime, '★降雪の目安だけを入れていても、地図のタイムスライダーが出る');

/* --- 5. 失敗は理由を言う（黙って消さない） --- */
mode = '500';
await page.evaluate(() => { snowCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
ok(/取得できません/.test(await status()), '★取得に失敗したら理由を言う', await status());
mode = 'ok';

/* --- 6. 429：待つ（重ねて叩かない）・風と待ちを共有する --- */
mode = '429';
snowReqs.length = 0;
await page.evaluate(() => { windBackoffUntil = 0; snowCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(1500);
ok(snowReqs.length === 1, '前提: 429 を1回受ける', snowReqs);
ok(/429/.test(await status()) && /秒/.test(await status()), '★429 を受けたら「断られた・何秒で取り直す」と言う', await status());
for (let k = 0; k < 3; k++) {
  await page.evaluate(() => leafletMap.panBy([80, 0], { animate: false }));
  await page.waitForTimeout(700);
}
ok(snowReqs.length === 1, '★★★429 のあとは待つ間に取りに行かない', snowReqs);
const shared = await page.evaluate(() => windBackoffUntil > Date.now());
ok(shared, '★429 の待ちは風と共有する（windBackoffUntil）');
await page.evaluate(() => { windBackoffUntil = 0; });
mode = 'ok';

/* --- 7. 拡大が足りない間は出さず理由を言う --- */
await page.evaluate(() => { leafletMap.setZoom(5, { animate: false }); });
await page.waitForTimeout(800);
ok((await shown()).length === 0 && /拡大すると/.test(await status()), '★拡大が足りない間は出さず、理由を言う', await status());

/* --- 8. 切ったら記号が消える。ABC評価の閾値に触れていない --- */
await page.evaluate(() => { leafletMap.setZoom(9, { animate: false }); });
await page.waitForTimeout(1500);
await page.evaluate(() => toggleOverlay('snowHint'));
await page.waitForTimeout(600);
ok((await shown()).length === 0, '層を切ったら記号も消える');
const src = HTML.slice(HTML.indexOf('const SNOW_HINT = {'), HTML.indexOf('   風の流れ（Particle Engine）'));
ok(!/THRESH/.test(src.replace(/`THRESH`[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')),
  '★★ABC評価の閾値（THRESH）を参照していない（降雪の目安は判定とは別）');
ok(!/abcScore|judgePoint/.test(src.replace(/\/\*[\s\S]*?\*\//g, '')), '★★ABC評価の関数を呼んでいない');

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SNOWHINT SMOKE FAILED');
  process.exit(1);
}
console.log('SNOWHINT SMOKE PASSED');
