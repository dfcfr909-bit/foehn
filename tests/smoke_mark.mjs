/* 判定に効いている時間をグラフの上で示す印（降水のバーの縁取り）。
 *
 * なぜ要るか:
 *   「下の赤黄緑の帯を無くしたい。判定の元になっている項目のグラフを
 *   赤と黄色で塗ればいいのでは」という提案から。**なぜCなのかが窓を開かなくても分かる**。
 *
 *   ⚠ 4要因のうち、風は**既に閾値でバーを塗り分けている**（二重に印を付けない）。
 *     気圧も色は付いているが**判定とは別の閾値**（|ΔP|≧3 から色が付くが、判定のBは6）。
 *     体感温度は画面に描かれていない。ここで足すのは**降水だけ**。
 *
 * ⚠⚠ **いちばん危ないのは「Aにも印が付く」こと。** どの時間にも赤い縁が出れば
 *   狼少年になり、本当に危ない時間の印が効かなくなる。**付かないこと**を必ず見る。
 *
 * ⚠ ABC評価ロジックは変更禁止。ここは `judgeBreakdown()` の結果を読むだけで、
 *   自前で閾値と比べないこと（原文でも確かめる）。
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

/* --- 原文を読む静的検査: 自前で閾値と比べていないこと --- */
const a = HTML.indexOf('// 地表帯（茶）＋降水バー');
const b = HTML.indexOf('// 日付区切り（0時）');
ok(a > 0 && b > a, '節が見つかる（検査が空振りしていない）', { a, b });
const section = HTML.slice(a, b).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
ok(/judgeBreakdown\(/.test(section), '判定の結果を読んでいる');
for (const banned of ['abcScore', 'THRESH', 'rainA', 'rainB', 'snowA', 'snowB']) {
  ok(!section.includes(banned),
    `★★判定を自前で計算しない（${banned} を使わない）`,
    (section.match(new RegExp('.*' + banned + '.*')) || [])[0]);
}

const pad = n => String(n).padStart(2, '0');
// rainA=1 / rainB=3 なので 0.2→A, 2→B, 5→C
function fakeWeather(pattern) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [],
    weathercode: [], cloudcover: [],
  };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(12); h.apparent_temperature.push(12);
    h.precipitation.push(pattern[i % pattern.length]); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(1); h.winddirection_10m.push(270);
    h.windgusts_10m.push(2); h.weathercode.push(61); h.cloudcover.push(50);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const bs = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${bs.getFullYear()}-${pad(bs.getMonth() + 1)}-${pad(bs.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 800 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];

async function countMarks(pattern) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(pattern)) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last',
    JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1300);
  const r = await page.evaluate(() => {
    const cv = document.querySelector('#chart-cloud canvas');
    const img = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data;
    // 判定の色そのもの（GRADE_COL）を数える
    const hit = (r, g, b, R, G, B) => Math.abs(r - R) < 22 && Math.abs(g - G) < 22 && Math.abs(b - B) < 22;
    let B = 0, C = 0, rain = 0, snow = 0;
    for (let i = 0; i < img.length; i += 4) {
      const [r, g, b, al] = [img[i], img[i + 1], img[i + 2], img[i + 3]];
      if (al < 200) continue;
      if (hit(r, g, b, 232, 160, 32)) B++;        // GRADE_COL.B #e8a020
      else if (hit(r, g, b, 208, 48, 48)) C++;    // GRADE_COL.C #d03030
      else if (hit(r, g, b, 26, 190, 190)) rain++;  // 雨の塗り #1abebe
      else if (hit(r, g, b, 60, 120, 220)) snow++;  // 雪の塗り #3c78dc
    }
    /* ⚠ **下の辺が引かれていないこと**を見る。バーの足元には地表帯があり、
       そこに横線が乗ると印ではなく「地面の一部」に見える（実機で指摘された）。
       印の色の画素を行ごとに数え、**いちばん下の行が横一列に埋まっていないか**を確かめる。
       閉じた四角なら下の行はバーの幅ぶん埋まる。コの字なら縦線2本ぶんしか無い。 */
    let bottomRun = 0, sideRun = 0;
    const rowCount = y => {
      let n = 0;
      for (let x = 0; x < cv.width; x++) {
        const i = (y * cv.width + x) * 4;
        if (img[i + 3] > 200 &&
            (hit(img[i], img[i + 1], img[i + 2], 208, 48, 48) ||
             hit(img[i], img[i + 1], img[i + 2], 232, 160, 32))) n++;
      }
      return n;
    };
    /* ⚠ **同じバーの集合を横切る行どうしで比べる。**
       最初「最下行 vs 真ん中の行」で比べたが、真ん中の行は**背の高いバーしか
       横切らない**ので数が減るのは当たり前で、検査になっていなかった。
       最下行と、その 8px 上（どのバーもまだ立っている高さ）を比べる。 */
    const rows = [];
    for (let y = 0; y < cv.height; y++) { const n = rowCount(y); if (n > 0) rows.push({ y, n }); }
    if (rows.length) {
      const yb = rows[rows.length - 1].y;
      bottomRun = rowCount(yb);
      sideRun = rowCount(yb - 8);
    }
    return { B, C, rain, snow, bottomRun, sideRun,
      grades: state.allData.slice(0, 6).map(d => judgeBreakdown(d).precip) };
  });
  await page.close();
  return r;
}

/* ============ 1. B と C の時間に縁が付く ============ */
const mixed = await countMarks([0.2, 2, 5]);
ok(mixed.grades.includes(0) && mixed.grades.includes(1) && mixed.grades.includes(2),
  '前提: A・B・Cの時間がそろっている', mixed.grades);
ok(mixed.B > 100, '★★Bの時間に橙の縁が付く', mixed);
ok(mixed.C > 100, '★★Cの時間に赤の縁が付く', mixed);
ok(mixed.rain > 500, '★塗りは雨の青のまま（縁で上書きしていない）', mixed);
/* ⚠ **コの字であること。** 閉じた四角だと最下行がバーの幅ぶん埋まり、
   真ん中の行（縦線2本だけ）より桁違いに多くなる。 */
ok(mixed.sideRun > 0, '前提: 縦線が引かれている', mixed);
ok(mixed.bottomRun <= mixed.sideRun * 1.3,
  '★★★下の辺を引かない（地表帯の上に横線が乗ると地面の一部に見える）',
  { 最下行: mixed.bottomRun, '8px上': mixed.sideRun });

/* ============ 2. ⚠ Aだけの日には印が付かない ============
   **ここが本丸。** どの時間にも出ると狼少年になり、印そのものが効かなくなる。 */
const allA = await countMarks([0.2, 0.4, 0.6]);
ok(allA.grades.every(g => g === 0), '前提: 全部Aの日', allA.grades);
ok(allA.B + allA.C === 0,
  '★★★Aしかない日には縁が1画素も付かない（狼少年にしない）', allA);
ok(allA.rain > 500, '前提: 降水のバー自体は描かれている（空振りでない）', allA);

await browser.close();
if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MARK SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ mixed, allA }, null, 2));
console.log('MARK SMOKE PASSED');
