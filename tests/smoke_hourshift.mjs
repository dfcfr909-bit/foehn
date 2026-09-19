/* 積算値（雨・雪・突風）を「先の1時間」に揃える。
 *
 * なぜ要るか:
 *   Open-Meteo の precipitation / snowfall は**直前1時間の合計**、
 *   wind_gusts_10m は**直前1時間の最大**。いっぽう気温や気圧は瞬間値。
 *   そのまま同じ行に詰めると、行の意味が2種類混ざる。
 *   実機で「20:34 に見たら 20:00 が 3.7mm、でも降っていない」が出た
 *   （＝19〜20時に降ったことになっている量を"いまの雨"として見せていた）。
 *
 * ⚠ 本丸は「ずれているか」ではなく **「どの時間の雨がどの行に入るか」**。
 *   だから配列の**並び全体**で突き合わせる（1点だけ見ると偶然通る）。
 *
 * ⚠⚠ **補助リクエスト（突風）も同じ分だけずらすこと。** ここを素の時刻で引くと、
 *   補助が通った端末だけ後から1時間ずれた値で上書きされる。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');
const LEAFLET_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.js'), 'utf8');
const LEAFLET_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.css'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };

const pad = n => String(n).padStart(2, '0');
const LEVELS = [925, 900, 850, 800, 700, 600];
const N = 288;
const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
const TIME = Array.from({ length: N }, (_, i) => {
  const d = new Date(start.getTime() + i * 3600e3);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
});
/* 並びを突き合わせるための、1時間ごとに違う値。
   ⚠ 小さい刻みにするのは、判定や描画の都合で潰れないようにするため。 */
const PRECIP = TIME.map((_, i) => Math.round(i * 0.01 * 100) / 100);
const SNOW   = TIME.map((_, i) => Math.round(i * 0.02 * 100) / 100);
const GUST   = TIME.map((_, i) => i * 0.1);            // メイン側（JMAは実際にはnullを返す）
const GUST2  = TIME.map((_, i) => 100 + i);            // 補助リクエスト側。メインと必ず違う値

function body(withGusts) {
  const f = v => TIME.map(() => v);
  const h = { time: TIME, temperature_2m: f(5), apparent_temperature: f(2),
    precipitation: PRECIP, snowfall: SNOW, surface_pressure: f(1013),
    windspeed_10m: f(4), winddirection_10m: f(270),
    windgusts_10m: withGusts ? GUST : f(null),
    weathercode: f(1), cloudcover: f(20),
    cloud_cover_low: f(10), cloud_cover_mid: f(10), cloud_cover_high: f(10) };
  for (const p of LEVELS) { h[`wind_speed_${p}hPa`] = f(6); h[`wind_direction_${p}hPa`] = f(300); }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let d = 0; d < 13; d++) {
    const b = new Date(start.getTime() + d * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:00`); daily.sunset.push(`${ds}T18:00`);
  }
  return { hourly: h, daily, elevation: 800 };
}
// 補助リクエスト（models未指定）の返り。突風だけ別の値で返す
function supplementalBody() {
  const h = { time: TIME, wind_gusts_10m: GUST2 };
  for (const [hPa] of [[925],[900],[850],[800],[700],[600]]) h[`cloud_cover_${hPa}hPa`] = TIME.map(() => 30);
  return { hourly: h };
}
const TILE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64');

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => d.dismiss().catch(() => {}));

let supplementalHits = 0;
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.includes('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.includes('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
  if (url.includes('api.open-meteo.com')) {
    // models指定があるのが本体、無いのが補助リクエスト
    if (url.includes('models=')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body(true)) });
    supplementalHits++;
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(supplementalBody()) });
  }
  if (/\.(png|jpg)/.test(url)) return route.fulfill({ contentType: 'image/png', body: TILE });
  return route.abort();
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(2200);

// ⚠ window.state は常に undefined（const は window に載らない）。素の state を読むこと
const rows = await page.evaluate(() => {
  if (typeof state === 'undefined' || !state.fullData) return null;
  return state.fullData.map(d => ({
    t: `${d.time.getFullYear()}-${String(d.time.getMonth()+1).padStart(2,'0')}-${String(d.time.getDate()).padStart(2,'0')}T${String(d.time.getHours()).padStart(2,'0')}:00`,
    precip: d.precip, snow: d.snow, gust: d.gust, temp: d.temp,
  }));
});
ok(rows && rows.length === 288, '★前提: fullData が288行そろっている（window.state ではなく state を読む）',
  rows ? rows.length : rows);

if (rows) {
  /* ============ 1. ★★★ 並び全体で「先の1時間」になっているか ============ */
  {
    const bad = [];
    for (let i = 0; i < rows.length - 1; i++) {
      if (rows[i].t !== TIME[i]) { bad.push(['時刻がずれた', i, rows[i].t, TIME[i]]); break; }
      if (rows[i].precip !== PRECIP[i + 1]) bad.push(['雨', i, rows[i].precip, PRECIP[i + 1]]);
      if (rows[i].snow   !== SNOW[i + 1])   bad.push(['雪', i, rows[i].snow,   SNOW[i + 1]]);
      if (bad.length > 3) break;
    }
    ok(bad.length === 0,
      '★★★雨と雪は「その時刻から1時間」の値（＝APIの1つ先）を持つ', bad);
  }

  /* ============ 2. ★★★ 実機の報告そのもの ============
     「降っていないのに 3.7mm」の正体は、直前1時間の雨を"いまの雨"として
     出していたこと。ずらした後は、前の時間の雨が現在の行に**残っていない**。 */
  {
    const i = 100;
    ok(rows[i].precip !== PRECIP[i],
      '★★★前の1時間に降った量を、その時刻の雨として出さない（実機の「降っていないのに雨」）',
      { 行: rows[i].t, いまの値: rows[i].precip, 直前1時間の値: PRECIP[i] });
  }

  /* ============ 3. ★★ 瞬間値は動かさない ============
     ずらすのは積算だけ。気温まで一緒に動かすと、別の嘘が増える。 */
  {
    ok(rows.every(r => r.temp === 5), '★★気温（瞬間値）はずらさない');
  }

  /* ============ 4. ★★★ 最後の行は null（勝手に0を置かない） ============
     先が無いものを「0mm」と書くのは、分からないことを断言すること。 */
  {
    const last = rows[rows.length - 1];
    ok(last.precip === null && last.snow === null,
      '★★★先が無い最後の行は null にする（0mmと断言しない）', last);
  }

  /* ============ 5. ⚠⚠ 補助リクエストの突風も同じだけずらす ============
     ここを素の時刻で引くと、補助が通った端末だけ1時間ずれた値で上書きされる。 */
  {
    ok(supplementalHits > 0, '★前提: 補助リクエストが実際に飛んでいる', supplementalHits);
    const i = 120;
    ok(rows[i].gust === GUST2[i + 1],
      '★★★補助リクエストの突風も「先の1時間」で突き合わせる',
      { 行: rows[i].t, 入った値: rows[i].gust, 先の1時間: GUST2[i + 1], 直前1時間: GUST2[i] });
  }

  /* ============ 6. ★★ ABC判定が同じ値を見ている ============
     判定の関数は触っていない。入力がずれた値になっていないことだけ見る。 */
  {
    const chk = await page.evaluate(() => {
      const d = state.fullData[150];
      return { precip: d.precip, breakdown: judgeBreakdown(d).precip,
               直接: judgeBreakdown({ ...d }).precip };
    });
    ok(chk.precip === PRECIP[151],
      '★★判定に渡る行の雨も「先の1時間」（グラフと判定が同じ値を見る）', chk);
  }
}

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);

await browser.close();

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_hourshift PASS');
