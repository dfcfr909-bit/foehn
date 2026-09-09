/* 地点の標高（雲パネルの茶色い破線）と、その端に出す標高の札。
 *
 * なぜ要るか:
 *   「破線の端に標高も表示して欲しい」という指摘。実は札は**前から描いてあった**が、
 *   ⚠ **チャート本体の左端**に描いていた。チャートは全時間ぶんの幅（実測3301px）を持ち
 *   transform で流れるので、**範囲の先頭までスクロールしないと画面に入らない**
 *   （通常のスクロール量は800px超）。つまり事実上ずっと見えていなかった。
 *   固定の左ガターへ移した。
 *
 * ⚠⚠ **この検査の本丸は「スクロールしても札が消えないこと」。**
 *   前の実装でも「札を描くコードはある」ので、コードの有無を見る検査では通ってしまう。
 *   **実際に動かして、なぞった先でも見えるか**を画素で見る。
 *
 * ⚠ 破線と札は別々の場所（チャート本体と左ガター）で描く。**高さがずれてはいけない。**
 *   高度→位置の式は `altFrac` 1か所に寄せてあるが、寄せ忘れても気づけるよう
 *   「破線の高さ」と「札の高さ」を突き合わせる。
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

// ⚠ 日本の最高峰＝富士山 3776m。**札がいちばん広くなる場面**で測る
const ELEV = 3776;

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
    h.temperature_2m.push(10); h.apparent_temperature.push(8);
    h.precipitation.push(2); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3); h.winddirection_10m.push(270);
    h.windgusts_10m.push(6); h.weathercode.push(61); h.cloudcover.push(60);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: ELEV };
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
  JSON.stringify({ lat: 35.3606, lon: 138.7274, name: 'テスト峰' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1300);

/* 茶色（破線と札の色 #8a5a2b）の画素を探す。
   ⚠ 完全一致では拾えない（アンチエイリアス・白抜き文字が混ざる）ので幅を持たせる。 */
const scanBrown = async (sel, w) => page.evaluate(([s, wantW]) => {
  const cv = document.querySelector(s);
  const ctx = cv.getContext('2d');
  const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
  const ratio = cv.width / cv.clientWidth;      // 端末の画素比
  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity, n = 0;
  for (let y = 0; y < cv.height; y++) {
    for (let x = 0; x < cv.width; x++) {
      const i = (y * cv.width + x) * 4;
      const r = img[i], g = img[i + 1], b = img[i + 2], a = img[i + 3];
      if (a > 200 && Math.abs(r - 138) < 26 && Math.abs(g - 90) < 26 && Math.abs(b - 43) < 26) {
        n++;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
      }
    }
  }
  if (!n) return { n: 0 };
  return {
    n,
    // CSS px に直して返す（画素比に依らない値で比べる）
    top: minY / ratio, bottom: maxY / ratio, centerY: (minY + maxY) / 2 / ratio,
    left: minX / ratio, right: maxX / ratio, width: (maxX - minX + 1) / ratio,
    canvasW: cv.clientWidth,
  };
}, [sel, w]);

/* ============ 1. なぞった先でも札が見えている ============
   ⚠ **ここが本丸。** 前の実装は「範囲の先頭」でしか見えなかった。 */
const scrolled = await page.evaluate(() => {
  setSelectedIndex(140, true);            // 真ん中あたりへ飛ぶ
  return new Promise(r => setTimeout(() => r({
    offset: Math.round(chartOffset),
    total: Math.round(chartTotalW()),
    view: document.getElementById('charts-outer').clientWidth,
  }), 500));
});
ok(scrolled.offset > scrolled.view,
  '前提: 画面1つぶんより先までスクロールしている（前の実装なら札は画面外）', scrolled);

const chip = await scanBrown('#axis-gutter');
ok(chip.n > 0, '★★★スクロールした先でも標高の札が見えている（固定ガターに出す）', { chip, scrolled });

/* ============ 2. 札がガターに収まる ============
   ⚠ 溢れると切れて読めない。**4桁（富士山3776m）で測る**のが肝。 */
const geo = await page.evaluate(() => ({ padL: PADDING_L, skyH: CHART_H_SKY }));
ok(chip.width <= geo.padL - 2,
  `札がガター（${geo.padL}px）に収まる`, { 札の幅: chip.width, ...geo });
/* ⚠⚠ **幅だけ見ても溢れは捕まえられない。** キャンバスが 36px で切れるので、
   はみ出した札も「幅36px」としか測れない（実際にこれで検査が空振りした）。
   **左端に貼り付いていたら切れている**、で見る。収まっていれば必ず余白ができる。 */
ok(chip.left >= 1,
  '★★★札が左で切れていない（切れると桁が読めなくなる）',
  { 札の左端: chip.left, 札の幅: chip.width, ...geo });

/* ============ 3. 破線と札の高さが一致する ============
   ⚠ 破線はチャート本体、札は左ガターと**別々の場所で描く**。
     高度→位置の式を写し違えると静かにずれる。 */
const line = await scanBrown('#chart-cloud canvas');
ok(line.n > 0, '前提: 雲パネルに標高の破線が描かれている', line);
// ガターはチャート全体をおおう1枚。雲パネルは気温パネルのぶんだけ下にある
const lineYInGutter = geo.skyH + line.centerY;
ok(Math.abs(chip.centerY - lineYInGutter) <= 2,
  '★★★破線の高さと札の高さが一致する（高度の式が3か所でずれていない）',
  { 札のy: Math.round(chip.centerY), 破線のy: Math.round(lineYInGutter) });

/* ============ 4. 標高が変われば札も動く ============
   ⚠ 「たまたま何か茶色いものが写った」だけでは通らないようにする。 */
const moved = await page.evaluate(() => {
  // 低い地点に差し替えて引き直す（札は下へ動くはず）
  state.summitElev = 200; state.demElevation = 200;
  buildCharts();
  return new Promise(r => setTimeout(() => r(true), 300));
});
const chipLow = await scanBrown('#axis-gutter');
ok(moved && chipLow.n > 0, '低い地点でも札が出る', chipLow);
ok(chipLow.centerY > chip.centerY + 20,
  '★★標高が低くなれば札も下がる（標高に連動している）',
  { 高い地点: Math.round(chip.centerY), 低い地点: Math.round(chipLow.centerY) });

await browser.close();
if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('ELEV SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ scrolled, geo, chip, line, chipLow }, null, 2));
console.log('ELEV SMOKE PASSED');
