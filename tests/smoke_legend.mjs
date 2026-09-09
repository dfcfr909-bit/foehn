/* 凡例に出す選択時刻の値。
 *
 * なぜ要るか:
 *   「スライダーで操作した際、この窓でグラフの表示が見えない部分が多い」という指摘。
 *   ポップアップは**指の近く**に出るので、なぞるほど読みたいパネルを覆う。
 *   そこで、指が絶対に来ない場所（グラフの下の凡例）に値を置いた。
 *
 * ⚠⚠ **この検査の本丸は「数字が出るか」ではなく「凡例が揺れないか」。**
 *   桁数が変わるたびに項目の位置がずれると、なぞっている間じゅう凡例全体が
 *   横に踊り、**元の窓より読みにくくなる**。値を出した意味が消える。
 *
 * ⚠ **折り返しも見る。** 幅が足りずに2行になると、そのぶんグラフが縦に潰れる。
 *   狭い端末（320px）でも1行に収まること。
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

/* ---- 気象データの作り物 ----
   ⚠ **桁数がばらつく値を必ず混ぜる。** 全部1桁だと、揺れの検査が
   一度も試されないまま緑になる（＝空振り）。下でそれ自体も確かめる。 */
const pad = n => String(n).padStart(2, '0');
function fakeWeather() {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [],
    weathercode: [], cloudcover: [],
  };
  const levels = [925, 900, 850, 800, 700, 600];
  for (const p of levels) { h[`wind_speed_${p}hPa`] = []; h[`wind_direction_${p}hPa`] = []; }
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  // 桁数が1〜4文字にわたるように仕込む（-12° / 0 / 12.5 / 120 など）
  const temps = [-12, -8, 0, 5, 24, 35];
  const precs = [0, 0.4, 1.5, 12.5, 120];
  const snows = [0, 0.5, 8, 25];
  const winds = [0, 1, 7, 25];
  const gusts = [0, 3, 14, 38];
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(temps[i % temps.length]);
    h.apparent_temperature.push(temps[i % temps.length] - 3);
    h.precipitation.push(precs[i % precs.length]);
    h.snowfall.push(snows[i % snows.length]);
    h.surface_pressure.push(1013);
    h.windspeed_10m.push(winds[i % winds.length]);
    h.winddirection_10m.push(270);
    h.windgusts_10m.push(gusts[i % gusts.length]);
    h.weathercode.push(2); h.cloudcover.push(40);
    for (const p of levels) { h[`wind_speed_${p}hPa`].push(4); h[`wind_direction_${p}hPa`].push(300); }
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const base = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 120 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];

async function openAt(width) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
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
    JSON.stringify({ lat: 36.9034, lon: 139.1732, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1200);
  return page;
}

/* なぞった全時刻ぶんの「凡例の見え方」を集める。
   ⚠ 位置は **offsetLeft**（項目の左端）で見る。文字幅ではなく実際の配置がずれるかを見たい。
   ⚠ 折り返しは **offsetTop の一致では見ない。** 高さの違う項目が中央揃えされると
     1pxずれる（実際にそれで誤検知した）。「縦の範囲が全項目で重なっているか」で見る。
     折り返していれば2行目の上端が1行目の下端より下に来るので、重なりが消える。 */
const sweep = page => page.evaluate(() => {
  const ids = ['lg-temp', 'lg-prec', 'lg-snow', 'lg-wind', 'lg-gust'];
  const seen = [];
  for (let i = 0; i < HOURS; i++) {
    setSelectedIndex(i);
    // 隠してある項目（狭い端末の雲量）は幅も高さも0なので数えない
    const items = [...document.querySelectorAll('#legend .legend-item')]
      .filter(el => el.offsetWidth > 0);
    const boxes = items.map(el => ({ top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight }));
    seen.push({
      i,
      text: ids.map(id => document.getElementById(id).textContent),
      lefts: items.map(el => el.offsetLeft),
      // 全項目が縦に重なっていれば1行
      oneRow: Math.max(...boxes.map(b => b.top)) < Math.min(...boxes.map(b => b.bottom)),
      boxes,
      h: document.getElementById('legend').offsetHeight,
    });
  }
  return seen;
});

/* ============ 1. 値が出て、選択時刻と一致する ============ */
const page = await openAt(390);
const spot = await page.evaluate(() => {
  setSelectedIndex(30);
  const d = state.allData[state.sliderIndex];
  return {
    d: { temp: d.temp, precip: d.precip, snow: d.snow, wind: d.wind, gust: d.gust },
    lg: {
      temp: document.getElementById('lg-temp').textContent,
      prec: document.getElementById('lg-prec').textContent,
      snow: document.getElementById('lg-snow').textContent,
      wind: document.getElementById('lg-wind').textContent,
      gust: document.getElementById('lg-gust').textContent,
    },
    pop: document.getElementById('pop-temp').textContent,
  };
});
ok(spot.lg.temp === Math.round(spot.d.temp) + '°', '★凡例の気温が選択時刻の値', spot);
ok(spot.lg.wind === String(Math.round(spot.d.wind)), '★凡例の風速が選択時刻の値', spot);
ok(spot.lg.gust === String(Math.round(spot.d.gust)), '凡例の突風が選択時刻の値', spot);
/* ⚠ **窓と丸め方をそろえる。** 同じ時刻に違う数字が2か所へ出ると、どちらが本当か分からない */
ok(spot.lg.temp === spot.pop, '★★ポップアップと同じ数字（丸め方をそろえる）', spot);

/* ============ 2. なぞっても凡例が揺れない ============ */
const seen = await sweep(page);
// ⚠ まずこの検査が**試されている**ことを確かめる（桁数が変わっていなければ空振り）
const lens = new Set(seen.flatMap(s => s.text.map(t => t.length)));
ok(lens.size >= 3, '★桁数のばらつきを実際に通した（検査が空振りしていない）', [...lens]);

const base = seen[0].lefts;
const moved = seen.filter(s => s.lefts.some((v, k) => v !== base[k]));
ok(moved.length === 0,
  '★★★桁数が変わっても項目の位置が動かない（なぞる間ずっと凡例が踊らない）',
  moved.slice(0, 3).map(s => ({ i: s.i, text: s.text, lefts: s.lefts })));

/* ============ 3. 折り返さない（1行に収まる） ============ */
const wrapped = seen.filter(s => !s.oneRow);
ok(wrapped.length === 0, '★★390pxで折り返さない',
  wrapped.slice(0, 2).map(s => ({ i: s.i, text: s.text, boxes: s.boxes })));
await page.close();

/* ============ 3b. 狭い端末でも折り返さない ============
   ⚠ 320pxでは雲量の目盛りを畳んで幅を作っている。畳む対象が消えたり、
     値が1文字でも増えたりすると、ここから落ちる。 */
const narrow = await openAt(320);
const seenN = await sweep(narrow);
const wrappedN = seenN.filter(s => !s.oneRow);
ok(wrappedN.length === 0, '★★★320pxでも折り返さない（グラフを縦に潰さない）',
  wrappedN.slice(0, 2).map(s => ({ i: s.i, text: s.text, boxes: s.boxes })));
const movedN = seenN.filter(s => s.lefts.some((v, k) => v !== seenN[0].lefts[k]));
ok(movedN.length === 0, '★320pxでも項目の位置が動かない', movedN.slice(0, 2));
const cloudHidden = await narrow.evaluate(() => document.getElementById('legend-cloud').offsetWidth === 0);
ok(cloudHidden, '320pxでは雲量の目盛りを畳む（前提の確認）');
await narrow.close();

/* ============ 4. データが無ければ前の値を残さない ============
   ⚠ 残ると、**読み込み中の別の山の数字**を見ていることになる。
   窓は消えるのに凡例だけ古い数字を出し続ける、というのがいちばん危ない。 */
const page4 = await openAt(390);
const cleared = await page4.evaluate(() => {
  setSelectedIndex(30);
  const before = document.getElementById('lg-temp').textContent;
  state.allData = [];
  updatePopup();
  return { before, after: document.getElementById('lg-temp').textContent };
});
ok(cleared.before !== '--', '前提: 値が入っていた', cleared);
ok(cleared.after === '--', '★★データが無くなったら凡例も消える（古い値を残さない）', cleared);
await page4.close();

await browser.close();
if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('LEGEND SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ spot, lens: [...lens], rows: seen.length }, null, 2));
console.log('LEGEND SMOKE PASSED');
