/* 気圧配置（#26）— 高気圧=青 / 低気圧=赤 と等圧線。
 *
 * ⚠ **いちばん危ないのは「画面の端を高気圧の中心と呼ぶ」こと。**
 *   格子の縁は「そこで見るのをやめた場所」であって極値ではない。
 *   #13 で探索範囲の最高点を山頂と取り違えかけたのとまったく同じ罠で、
 *   通すと**地図を動かすたびに H が縁を滑る**という嘘の絵になる。
 *
 * ⚠ **表示だけの機能。ABC評価に一切関与させない**（judgePoint / abcScore / THRESH）。
 *   ここも検査する。
 *
 * 純粋な計算（極値・等圧線）を実物の関数で直接叩く。通信はしない。
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

/* --- 場面0: ABC評価に触れていないこと（原文を読む静的検査） ---
   ⚠ **これは「表示だけの機能」。** 判定に触れると、画面上は普通に見えるのに
     判定が静かに変わる（ADR-0005 / ADR-0006 と同じ事故の形）。 */
const start = HTML.indexOf('/* ------ 気圧配置（高気圧=青 / 低気圧=赤・等圧線） ------');
const end = HTML.indexOf('/* ------ 山域・百名山レイヤー');
ok(start > 0 && end > start, '気圧配置の節が見つかる（検査が空振りしていない）', { start, end });
const raw = HTML.slice(start, end);
/* ⚠ **注記を落としてから見ること。** ここに「judgePoint を参照しないこと」と
     書いた注意書きそのものを違反として拾ってしまう。
     **注意書きを厚くするほどテストが落ちる**という逆立ちで、
     2026-08-20 に3度踏んだ（ワークフローのYAMLで2回、ここで1回）
     → docs/decisions.md */
const section = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
for (const banned of ['judgePoint', 'abcScoreInv', 'abcScore', 'THRESH']) {
  ok(!section.includes(banned), `★★★ABC評価に触れない（${banned} を参照しない）`,
    (section.match(new RegExp('.*' + banned + '.*')) || [])[0]);
}
// 注記を落とした結果が空になっていない（=検査が空振りしていない）
ok(/loadPressureGrid/.test(section) && /pressureExtremes/.test(section),
  '★注記を落としても中身が残っている（空文字を検査していない）', section.length);
// ズームの上限を持っていること（拡大しすぎると画面内が一様で線が出ない）
ok(/PRESS_MAX_ZOOM/.test(section) && /PRESS_MIN_ZOOM/.test(section),
  '★広すぎ・細かすぎの両方に案内を出す作りになっている');

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
  return route.abort();       // 気圧の検査に通信は要らない
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(600);

// 格子を組み立てるヘルパ（緯度経度は等間隔。値は行 i（南→北）× 列 j（西→東））
const mkGrid = rows => ({
  key: 't', n: rows.length,
  lats: rows.map((_, i) => 30 + i),
  lons: rows[0].map((_, j) => 130 + j),
  vals: rows.flat(),
});

const call = (fn, ...args) => page.evaluate(
  ([f, a]) => window[f](...a), [fn, args]);

ok(await page.evaluate(() => typeof pressureExtremes === 'function'),
  '関数が定義されている（前提）');

/* --- 場面1: 中央の高気圧を拾う --- */
const hi = mkGrid([
  [1000, 1000, 1000, 1000, 1000],
  [1000, 1004, 1006, 1004, 1000],
  [1000, 1006, 1012, 1006, 1000],
  [1000, 1004, 1006, 1004, 1000],
  [1000, 1000, 1000, 1000, 1000],
]);
const e1 = await call('pressureExtremes', hi);
ok(e1.length === 1 && e1[0].type === 'H', '★中央の高気圧を1つ拾う', e1);
ok(e1.length && Math.abs(e1[0].hPa - 1012) < 0.01 && e1[0].lat === 32 && e1[0].lon === 132,
  '★位置と気圧が格子の極大点と一致する', e1[0]);

/* 低気圧も同じ形で拾えること（符号を取り違えていない） */
const lo = mkGrid([
  [1020, 1020, 1020, 1020, 1020],
  [1020, 1016, 1014, 1016, 1020],
  [1020, 1014, 1008, 1014, 1020],
  [1020, 1016, 1014, 1016, 1020],
  [1020, 1020, 1020, 1020, 1020],
]);
const e2 = await call('pressureExtremes', lo);
ok(e2.length === 1 && e2[0].type === 'L' && Math.abs(e2[0].hPa - 1008) < 0.01,
  '★低気圧も拾う（HとLを取り違えていない）', e2);

/* --- 場面2: 縁を極値と呼ばないこと（本丸） ---
   ⚠ 北東へ単調に上がる場。**いちばん高いのは格子の角**だが、そこは
     「見るのをやめた場所」であって高気圧の中心ではない。 */
const ramp = mkGrid([
  [1000, 1002, 1004, 1006, 1008],
  [1002, 1004, 1006, 1008, 1010],
  [1004, 1006, 1008, 1010, 1012],
  [1006, 1008, 1010, 1012, 1014],
  [1008, 1010, 1012, 1014, 1016],
]);
const e3 = await call('pressureExtremes', ramp);
ok(e3.length === 0, '★★★単調に上がるだけの場では極値を出さない（縁を中心と呼ばない）', e3);
/* ⚠ **この検査は「振る舞い」を見ている。** 実装側では縁の除外が二重に効いていて
     （ループの範囲／近傍8点の条件）、**片方だけ壊してもここは落ちない**。
     わざとの重複なので、片方を消して「通るから要らない」と判断しないこと。 */

/* --- 場面3: 小さな揺れを極値と呼ばないこと ---
   ⚠ 起伏0.2hPaの出っ張り。モデルの数値の揺れでしかない。
     拾うと H と L が画面中に乱立して読めなくなる。 */
const noise = mkGrid([
  [1000, 1000, 1000, 1000, 1000],
  [1000, 1000, 1000, 1000, 1000],
  [1000, 1000, 1000.2, 1000, 1000],
  [1000, 1000, 1000, 1000, 1000],
  [1000, 1000, 1000, 1000, 1000],
]);
ok((await call('pressureExtremes', noise)).length === 0,
  '★★起伏の小さい揺れを極値にしない', await call('pressureExtremes', noise));

/* --- 場面4: 等圧線は4hPaごと（天気図の慣習） --- */
const levels = await call('isobarLevels', hi);
ok(levels.length > 0 && levels.every(v => v % 4 === 0), '★等圧線は4hPaごと', levels);
ok(levels[0] >= 1000 && levels[levels.length - 1] <= 1012,
  '画面内の気圧の幅に収まる値だけを引く', levels);

/* --- 場面5: 等圧線が本当にその値の所を通ること ---
   ⚠ 線形補間の向きを間違えると、線は出るが**値と場所が対応しない**。
     「線が引けた」で満足せず、端点の気圧を格子から復元して確かめる。 */
const segs = await call('isobarSegments', hi, 1004);
ok(segs.length > 0, '★等圧線の線分が出る', segs.length);
const bad = segs.flat().filter(([la, lo2]) => !isFinite(la) || !isFinite(lo2));
ok(bad.length === 0, '★★NaN の座標を出さない', bad);
// 双一次補間で端点の気圧を復元し、指定した値に一致するか見る
const err = await page.evaluate(([g, ss]) => {
  const at = (i, j) => g.vals[i * g.n + j];
  let worst = 0;
  for (const seg of ss) for (const [la, lo2] of seg) {
    const fi = la - g.lats[0], fj = lo2 - g.lons[0];
    const i0 = Math.min(Math.floor(fi), g.n - 2), j0 = Math.min(Math.floor(fj), g.n - 2);
    const ti = fi - i0, tj = fj - j0;
    const v = at(i0, j0) * (1 - ti) * (1 - tj) + at(i0, j0 + 1) * (1 - ti) * tj
            + at(i0 + 1, j0) * ti * (1 - tj) + at(i0 + 1, j0 + 1) * ti * tj;
    worst = Math.max(worst, Math.abs(v - 1004));
  }
  return worst;
}, [hi, segs]);
ok(err < 0.5, '★★線分の端点が本当に1004hPaの所にある（補間の向きが正しい）', err);

/* --- 場面6: 鞍部で線を交差させないこと ---
   ⚠ 対角だけが高い形（ケース5/10）は2通りに引ける。決めずに固定すると
     等圧線が×印に交差した図になり、天気図として読めなくなる。 */
const saddle = {
  key: 't', n: 2, lats: [30, 31], lons: [130, 131],
  /* ⚠ 並びは vals[i*n + j]（i=緯度の行・南から、j=経度の列・西から）。
       鞍部にするには**対角**を高くする: bl(0,0) と tr(1,1) が高く、br(0,1) と tl(1,0) が低い。
       最初 [1010,1000,1010,1000] と書いてしまい、これは「左の列が高い」だけの
       ただの縦割りで鞍部になっていなかった（線分が1本しか出ず気づいた）。 */
  vals: [1010, 1000, 1000, 1010],
};
const sSegs = await call('isobarSegments', saddle, 1005);
ok(sSegs.length === 2, '★鞍部では線分が2本出る', sSegs);
// 2本が交差していないこと（線分交差判定）
const crossed = sSegs.length !== 2 ? false : await page.evaluate(ss => {
  const [[a, b], [c, d]] = ss;
  const cr = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const s1 = cr(a, b, c), s2 = cr(a, b, d), s3 = cr(c, d, a), s4 = cr(c, d, b);
  return ((s1 > 0) !== (s2 > 0)) && ((s3 > 0) !== (s4 > 0));
}, sSegs);
ok(!crossed, '★★★鞍部で等圧線を交差させない', sSegs);

/* --- 場面7: 欠測を含む升を飛ばすこと --- */
const holed = mkGrid([
  [1000, 1000, 1000, 1000, 1000],
  [1000, 1004, 1006, 1004, 1000],
  [1000, 1006, null, 1006, 1000],
  [1000, 1004, 1006, 1004, 1000],
  [1000, 1000, 1000, 1000, 1000],
]);
const hSegs = await call('isobarSegments', holed, 1004);
ok(hSegs.flat().every(([la, lo2]) => isFinite(la) && isFinite(lo2)),
  '★欠測のある升を飛ばす（NaN を線にしない）', hSegs.slice(0, 3));
ok((await call('pressureExtremes', holed)).length === 0,
  '★欠測が近傍にある点は極値と判定しない');

ok(errors.length === 0, 'ページ内で例外が出ていない', errors);
await browser.close();

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('PRESSURE SMOKE FAILED');
  process.exit(1);
}
console.log('PRESSURE SMOKE PASSED');
