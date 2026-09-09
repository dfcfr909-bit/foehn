/* 選択情報の窓（ポップアップ）の大きさと中身。
 *
 * なぜ要るか:
 *   「スライダーで操作した際、この窓でグラフの表示が見えない部分が多い」
 *   「窓に表示するものを削れない？」という指摘。窓は**なぞる指の近くに出る**ので、
 *   大きいぶんだけ読みたいグラフを覆う。
 *
 * ⚠⚠ **この検査の本丸は「窓がまた太らないこと」。**
 *   行や語を足すのは簡単で、太ったことは画面を見るまで分からない。
 *   チャート領域に対する割合で上限を決め、超えたら落とす。
 *   （直す前は 239x174px ＝ 幅がチャートの61%。いまは 133x168px ＝ 34%）
 *
 * ⚠ **削ってはいけないものがある。** 判定に使った風の高度（`#pop-windsrc`）は
 *   ADR-0006 / ADR-0011 の要。黙って地上風に戻るのがいちばん危ない失敗の仕方なので、
 *   窓を小さくする過程で落としていないかを見る。
 *
 * あわせて iOS の虫眼鏡（テキスト選択のルーペ）を止めてあることも見る。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

/* --- 原文を読む静的検査 ---
   ⚠ `-webkit-touch-callout` は Chromium に無いので getComputedStyle が空を返す。
     原文で確かめるしかない（smoke_pin で踏んだのと同じ）。 */
ok(/#charts-outer,\s*#scrubber\s*\{[^}]*-webkit-touch-callout:\s*none/.test(HTML),
  '★なぞる領域で iOS の長押しメニューを止める（原文で確認）');
/* ⚠ **全画面に一括指定していないこと。** 地図の緯度経度は逆にコピーさせたい（#13） */
ok(!/\bbody\s*\{[^}]*user-select:\s*none/.test(HTML),
  '★★user-select:none を body へ一括指定しない（コピーさせたい場所がある）');

const pad = n => String(n).padStart(2, '0');
function fakeWeather() {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [],
    weathercode: [], cloudcover: [],
  };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    // ⚠ 語が長くなる側の値を入れる（「ほぼ無風」より「ゴーゴー」の方が広い）
    h.temperature_2m.push(-12); h.apparent_temperature.push(-18);
    h.precipitation.push(12.5); h.snowfall.push(8);
    h.surface_pressure.push(1013 - i * 0.9);
    h.windspeed_10m.push(18); h.winddirection_10m.push(315); h.windgusts_10m.push(28);
    h.weathercode.push(71); h.cloudcover.push(90);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 194 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  return route.abort();
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 35.9, lon: 139.6, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1300);

/* ============ 1. 窓の大きさ ============
   ⚠ px の絶対値で決めない。端末や字体で変わる。**チャート領域に対する割合**で見る。 */
const size = await page.evaluate(() => {
  // 判定の根拠が全部出ている時刻を選ぶ（語も色分けも載った状態でいちばん広くなる）
  setSelectedIndex(Math.min(HOURS - 1, state.sliderIndex + 40));
  const pop = document.getElementById('scrub-popup').getBoundingClientRect();
  const area = document.getElementById('charts-outer').getBoundingClientRect();
  return {
    w: Math.round(pop.width), h: Math.round(pop.height),
    aw: Math.round(area.width), ah: Math.round(area.height),
    wRatio: pop.width / area.width, hRatio: pop.height / area.height,
    rows: document.querySelectorAll('#pop-rows .pop-row').length,
  };
});
/* 上限。直す前は幅がチャートの **61%**、いまはいちばん広い語（ゴウゴウ・体感-18°）で
   **38%**。45% を上限にすると、⚠ **昔の姿は確実に落ち、字体差では落ちない**。
   ⚠ 40%だと余裕が2%しか無く、CIの字体が変わるだけで落ちる（それは検査ではなく事故）。 */
ok(size.wRatio < 0.45, '★★★窓の幅がチャートの45%未満（昔の姿=61%は落ちる）', size);
ok(size.hRatio < 0.35, '★★窓の高さがチャートの35%未満', size);
ok(size.rows <= 5, '★行数を増やさない（行数がそのまま覆う量になる）', size);

/* ============ 2. 見出しは1文字 ============
   ⚠ 「気温」「降水」「風速」へ戻すと窓が横に伸びる。戻したら落とす。 */
const keys = await page.evaluate(() =>
  [...document.querySelectorAll('#pop-rows .pop-k')].map(el => el.textContent));
ok(keys.length > 0, '見出しが取れている（検査が空振りしていない）', keys);
ok(keys.every(k => k.length === 1), '★★見出しは1文字（温・雨・風・圧）', keys);

/* ============ 3. 削ってはいけないもの ============ */
const kept = await page.evaluate(() => {
  const d = state.allData[state.sliderIndex];
  return {
    windsrc: document.getElementById('pop-windsrc').textContent,
    gustShown: getComputedStyle(document.getElementById('pop-gust-row')).display !== 'none',
    gust: document.getElementById('pop-gust').textContent,
    windw: document.getElementById('pop-windw').textContent,
    rain: document.getElementById('pop-rain').textContent,
    app: document.getElementById('pop-app').textContent,
    dp: document.getElementById('pop-dp').textContent,
    grade: document.getElementById('pop-grade').textContent,
    hasGustData: d.gust != null,
  };
});
/* ⚠⚠ ADR-0006 / ADR-0011。黙って地上風に戻るのがいちばん危ない失敗の仕方なので、
   窓を小さくする過程でここを落としていないかを見る。 */
ok(/@/.test(kept.windsrc),
  '★★★判定に使った風の高度を消していない（ADR-0006 / ADR-0011）', kept);
ok(kept.gustShown && kept.gust !== '--', '★突風は残す（風の行に畳んである）', kept);
ok(kept.windw && kept.windw !== '—', '★風の言葉を残す（ゴーゴー等）', kept);
ok(kept.app.includes('体感'), '★体感温度を残す（判定に使うのは気温ではなく体感）', kept);
ok(kept.dp !== '--', '★気圧の変化を残す（判定に使う）', kept);
ok(['A', 'B', 'C'].includes(kept.grade), 'ABC判定が出ている', kept);

/* ============ 4. 虫眼鏡（テキスト選択）を出さない ============ */
const sel = await page.evaluate(() => {
  const g = id => getComputedStyle(document.getElementById(id)).webkitUserSelect
    || getComputedStyle(document.getElementById(id)).userSelect;
  // 緯度経度は :empty で消えているので中身を入れてから見る
  const ll = document.getElementById('map-latlon');
  ll.textContent = '35.9000, 139.6000';
  return { charts: g('charts-outer'), scrubber: g('scrubber'), latlon: g('map-latlon') };
});
ok(sel.charts === 'none', '★★なぞる領域は選択できない（虫眼鏡が出ない）', sel);
ok(sel.scrubber === 'none', '★★帯も選択できない', sel);
/* ⚠ **巻き添えにしない。** 緯度経度はタップでコピーさせたい（#13で入れたもの） */
ok(sel.latlon === 'all', '★★★地図の緯度経度はコピーできるまま（巻き添えにしない）', sel);

await browser.close();
if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('POPUP SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ size, keys, kept, sel }, null, 2));
console.log('POPUP SMOKE PASSED');
