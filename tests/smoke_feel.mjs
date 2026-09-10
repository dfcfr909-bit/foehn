/* 体感温度の帯（気温パネルの下端）。
 *
 * なぜ要るか:
 *   下の赤黄緑の帯を消すには、判定の4要因が**グラフの上だけで読める**必要がある。
 *   風は塗り分け、降水は縁取りで示したが、**体感温度は画面のどこにも無かった**——
 *   判定に効いているのは気温ではなく体感温度なのに。
 *
 * ⚠⚠ いちばん危ないのは2つ。
 *   ① **Aだけの日にも枠が付く**こと（狼少年になる）。
 *   ② **目盛りを日ごとに伸縮させる**こと。穏やかな日の帯まで真っ赤・真っ青になり、
 *      危なさを誤って伝える。どの日に開いても「この色ならこのくらい」が同じであること。
 *
 * ⚠ 帯の色の暑い端（38℃ 付近）は GRADE_COL.C とほぼ同じ赤になる。
 *   枠の画素を数える検査では**暑い日を使わない**（塗りと枠が見分けられなくなる）。
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

/* --- 原文を読む静的検査 --- */
const fa = HTML.indexOf('function drawFeelBand');
const fb = HTML.indexOf('function drawTempOverlay');
ok(fa > 0 && fb > fa, '節が見つかる（検査が空振りしていない）', { fa, fb });
const section = HTML.slice(fa, fb).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
ok(/judgeBreakdown\(/.test(section), '判定の結果を読んでいる');
for (const banned of ['abcScoreInv', 'THRESH', 'apparentA', 'apparentB']) {
  ok(!section.includes(banned),
    `★★判定を自前で計算しない（${banned} を使わない）`,
    (section.match(new RegExp('.*' + banned + '.*')) || [])[0]);
}
/* ⚠ 帯の高さは「uPlot の padding」と「drawAxisGutter の skyBottom」の**2か所と対**。
   片方だけ直すと気温の線が帯に潜る／軸の目盛りがずれる。両方が名前で参照していること。 */
ok(/padding: \[SKY_TOP_PAD, PADDING_R, TIME_AXIS_H \+ FEEL_BAND_H, PADDING_L\]/.test(HTML),
  '★★uPlot の下余白が帯のぶんを空けている');
ok(/skyBottom = CHART_H_SKY - TIME_AXIS_H - FEEL_BAND_H/.test(HTML),
  '★★左ガターの目盛りも帯のぶんを引いている');

const pad = n => String(n).padStart(2, '0');
// apparentA=-3 / apparentB=-15 → 5:A / -8:B / -20:C（abcScoreInv は低いほど悪い）
function fakeWeather(apparents) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [],
    weathercode: [], cloudcover: [],
  };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(8); h.apparent_temperature.push(apparents[i % apparents.length]);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(1); h.winddirection_10m.push(270);
    h.windgusts_10m.push(2); h.weathercode.push(1); h.cloudcover.push(20);
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

async function probe(apparents) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(apparents)) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last',
    JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1300);
  const r = await page.evaluate(() => {
    const cv = document.querySelector('#chart-sky canvas');
    const ctx = cv.getContext('2d');
    const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
    const px = (x, y) => { const i = (y * cv.width + x) * 4; return [img[i], img[i + 1], img[i + 2], img[i + 3]]; };
    const hit = ([r, g, b, a], [R, G, B]) => a > 200 && Math.abs(r - R) < 22 && Math.abs(g - G) < 22 && Math.abs(b - B) < 22;
    const COL_B = [232, 160, 32], COL_C = [208, 48, 48];

    const pr = cv.width / cv.clientWidth;
    const bandTop = Math.round(cv.height - (TIME_AXIS_H + FEEL_BAND_H) * pr);
    const bandBot = Math.round(cv.height - TIME_AXIS_H * pr);
    const plotBot = skyChart.bbox.top + skyChart.bbox.height;

    // 帯の中身（枠を避けて中央の行）を左から右まで読む
    const midY = Math.round((bandTop + bandBot) / 2);
    const x0 = Math.round(skyChart.bbox.left), x1 = Math.round(skyChart.bbox.left + skyChart.bbox.width);
    let sr = 0, sg = 0, sb = 0, n = 0, satMax = 0;
    for (let x = x0 + 4; x < x1 - 4; x++) {
      const [r, g, b, a] = px(x, midY);
      if (a < 200) continue;
      sr += r; sg += g; sb += b; n++;
      satMax = Math.max(satMax, Math.max(r, g, b) - Math.min(r, g, b));
    }

    // 枠の画素（帯の中だけ数える。パネル上部の日付バッジ等を巻き込まないため）
    let B = 0, C = 0;
    for (let y = bandTop; y < bandBot; y++) {
      for (let x = 0; x < cv.width; x++) {
        const p = px(x, y);
        if (hit(p, COL_B)) B++; else if (hit(p, COL_C)) C++;
      }
    }
    /* ⚠ **連続した時間がひとまとめに囲まれているか。**
       帯は途切れない1本なので、1時間ごとに囲むと櫛の歯になり、
       どこからどこまでが危ないのか読めない。
       枠の中央の行を横に走査し、枠色の「かたまり」の数を数える。
       ひとまとめなら 1区間あたり2本（左右）、1時間ごとなら時間数×2本になる。 */
    let runsSeen = 0, inRun = false;
    for (let x = 0; x < cv.width; x++) {
      const p = px(x, midY);
      const isEdge = hit(p, COL_B) || hit(p, COL_C);
      if (isEdge && !inRun) runsSeen++;
      inRun = isEdge;
    }
    return {
      bandTop, bandBot, plotBot, pr,
      mean: n ? [Math.round(sr / n), Math.round(sg / n), Math.round(sb / n)] : null,
      satMax, B, C, runsSeen,
      grades: state.allData.slice(0, 8).map(d => judgeBreakdown(d).apparent),
    };
  });
  await page.close();
  return r;
}

/* ============ 1. 帯があり、気温の線と場所を奪い合っていない ============ */
const mild = await probe([12, 14, 16, 14, 10, 8, 10, 12]);
ok(mild.mean != null, '★帯が塗られている（透明でない）', mild);
ok(mild.plotBot <= mild.bandTop + 1,
  '★★★気温のプロットは帯より上で終わっている（線が帯に潜らない）',
  { プロット下端: mild.plotBot, 帯の上端: mild.bandTop });
ok(mild.bandBot - mild.bandTop >= 8 * mild.pr,
  '前提: 帯に読める高さがある', mild);

/* ============ 2. ⚠ 目盛りは固定（日ごとに伸縮させない） ============
   8〜16℃ の穏やかな日。伸縮させると同じ日が青から赤まで振り切れる（彩度 150超）。
   固定なら 10℃ 前後の淡い色に収まる（実測 71）。 */
ok(mild.grades.every(g => g === 0), '前提: 穏やかな日は全部A', mild.grades);
ok(mild.satMax < 100,
  '★★★穏やかな日の帯は淡いまま（目盛りを日ごとに伸縮させない）',
  { 彩度の最大: mild.satMax, 平均色: mild.mean });

/* ============ 3. ⚠ Aだけの日には枠が1画素も付かない ============
   **本丸。** どの時間にも出れば狼少年になり、印そのものが効かなくなる。 */
ok(mild.B + mild.C === 0, '★★★Aしかない日には枠が1画素も付かない（狼少年にしない）', mild);

/* ============ 4. 寒い／暑いで色が変わる ============ */
const cold = await probe([-20]);
const warm = await probe([26]);
ok(cold.mean[2] > cold.mean[0] + 30, '★寒い日は青寄り', cold.mean);
ok(warm.mean[0] > warm.mean[2] + 30, '★暑い日は赤寄り', warm.mean);

/* ============ 5. B と C の時間に枠が付く ============ */
const mixed = await probe([5, -8, -20]);
ok(mixed.grades.includes(0) && mixed.grades.includes(1) && mixed.grades.includes(2),
  '前提: A・B・Cがそろっている', mixed.grades);
ok(mixed.B > 40, '★★Bの時間に橙の枠', mixed);
ok(mixed.C > 40, '★★Cの時間に赤の枠', mixed);

/* ============ 6. ⚠ 連続した時間はひとまとめに囲む ============
   6時間つづけてC → 枠は左右2本。1時間ごとに囲むと12本になる。 */
const run6 = await probe([-20, -20, -20, -20, -20, -20, 5, 5, 5, 5, 5, 5]);
ok(run6.C > 40, '前提: Cの枠が出ている', run6);
const per1 = await probe([-20, 5, -20, 5, -20, 5, -20, 5, -20, 5, -20, 5]);
ok(per1.C > 40, '前提: 飛び飛びでもCの枠が出ている', per1);
ok(run6.runsSeen * 2 < per1.runsSeen,
  '★★★連続した時間はひとまとめに囲む（櫛の歯にしない）',
  { '6時間つづけて': run6.runsSeen, '1時間おき': per1.runsSeen });

/* ============ 7. ⚠ 赤が橙に負けない ============
   隣り合う区間の縦線は**同じ位置に重なる**。1周で描くと後の時刻が勝つので、
   Cの隣がBだと赤の上に橙が乗る（降水のバーで実機から指摘された）。
   画素を狙い撃ちせず、**赤の総量が減らないこと**で見る。 */
const cAlone = await probe([-20, -20, -20, 5, 5, 5]);   // Cの隣はA（枠なし）
const cNextB = await probe([-20, -20, -20, -8, -8, -8]); // Cの隣はB（橙）
ok(cAlone.C > 40 && cNextB.C > 40, '前提: どちらもCの枠が出ている', { cAlone: cAlone.C, cNextB: cNextB.C });
ok(cNextB.B > 40, '前提: 隣にBの枠も出ている', cNextB);
ok(cNextB.C >= cAlone.C * 0.95,
  '★★★隣が橙でも赤が削られない（重なったところは赤が勝つ）',
  { 隣がA: cAlone.C, 隣がB: cNextB.C });

await browser.close();
if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('FEEL SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ mild, cold: cold.mean, warm: warm.mean, mixed, run6: run6.runsSeen, per1: per1.runsSeen }, null, 2));
console.log('FEEL SMOKE PASSED');
