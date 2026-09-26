/* 座標の表記の窓（v4.109.0）。検索の履歴の座標を押すと、DD・DMS・DDM・度分秒をまとめて出し、
 * それぞれコピーできる。
 * ⚠ 繰り上がりの検査が本丸。秒を丸めて60になったら分へ、分が60なら度へ送ること
 *   （36°59'59.96" を 36°59'60.0" と出さない）。
 * ⚠ 座標を押してもその地点へは移らない（行を押したことにしない）。
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

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: 'https://sotoki.test' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
  localStorage.setItem('sotoki_search_hist', JSON.stringify([
    { name: '燧ヶ岳', lat: 36.953, lon: 139.2873, elev: 2280, t: 1 }]));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(900);

/* ============ 1. 表記の計算 ============ */
const f = await page.evaluate(() => ({
  hiuchi: coordFormats(36.953, 139.2873),
  carry: coordFormats(36.99999999, 139.999999),        // 秒・分の繰り上がり
  south: coordFormats(-33.8568, -151.2153),            // 南緯・西経
  small: coordFormats(35.0000139, 139.0001),           // 小さい分・秒の桁埋め
}));
const get = (arr, k) => (arr.find(x => x.k === k) || {}).v;
const DD = '十進度（DD）', DDM = '度・十進分（DDM）', DMS = '度分秒（DMS）', JP = '度分秒（北緯・東経）';
ok(get(f.hiuchi, DD) === '36.95300, 139.28730', '★DD は小数5桁', f.hiuchi);
ok(get(f.hiuchi, DMS) === `36°57'10.8"N 139°17'14.3"E`, '★★DMS（度°分\'秒"＋N/E）', f.hiuchi);
ok(get(f.hiuchi, DDM) === `36°57.180'N 139°17.238'E`, '★★DDM（度°分.分\'＋N/E）', f.hiuchi);
ok(get(f.hiuchi, JP) === '北緯36度57分10.8秒 東経139度17分14.3秒', '★★度分秒（北緯・東経）', f.hiuchi);
ok(get(f.carry, DMS) === `37°00'00.0"N 140°00'00.0"E`, '★★★丸めで60秒・60分にしない（繰り上げる）', f.carry);
ok(get(f.carry, DDM) === `37°00.000'N 140°00.000'E`, '★★★DDM も60分にしない', f.carry);
ok(get(f.south, DMS) === `33°51'24.5"S 151°12'55.1"W`, '★南緯・西経は S/W', f.south);
ok(get(f.south, JP) === '南緯33度51分24.5秒 西経151度12分55.1秒', '★南緯・西経の漢字', f.south);
ok(get(f.small, DMS) === `35°00'00.1"N 139°00'00.4"E`, '分・秒の桁を埋める（00）', f.small);
ok(f.hiuchi.map(x => x.k).join('/') === '十進度（DD）/度・十進分（DDM）/度分秒（DMS）/度分秒（北緯・東経）/UTM座標/MGRS',
  '★★見出しは「UIでのおすすめ表記」（利用者の指定）で、この順', f.hiuchi.map(x => x.k));

/* ============ 1b. UTM・MGRS ============
   ⚠ 答えは pyproj（EPSG:326xx/327xx）と mgrs ライブラリ（Python）で作った値。
     ここを書き換えるときは、同じ道具で作り直すこと（手で直さない）。
   ⚠ 1m 単位は切り捨て（MGRS の決まり。UTM もそろえる） */
const REF = [
  ['燧ヶ岳', 36.953, 139.2873, 54, 347510.591, 4091028.881, '54SUF4751091028'],
  ['岩手山', 39.8501, 141.0021, 54, 500179.647, 4411120.003, '54SWK0017911120'],
  ['富士山', 35.3606, 138.7274, 54, 293517.347, 3915404.017, '54STE9351715404'],
  ['那須岳', 37.1249, 139.9629, 54, 407872.695, 4109231.349, '54SVG0787209231'],
  ['南', -33.8568, 151.2153, 56, 334900.57, 6252288.753, '56HLH3490052288'],
  ['西', 40.7128, -74.006, 18, 583959.372, 4507350.998, '18TWL8395907350'],
  ['南西', -22.9068, -43.1729, 23, 687394.593, 7465634.128, '23KPQ8739465634'],
  ['帯の境目（138°は54帯）', 36.0, 138.0, 54, 229578.63, 3988111.962, '54STE2957888111'],
  ['赤道のすぐ北', 0.0001, 139.5, 54, 333068.357, 11.057, '54NUF3306800011'],
  ['赤道のすぐ南', -0.0001, 139.5, 54, 333068.357, 9999988.943, '54MUE3306899988'],
  ['ノルウェーの例外（32V）', 60.0, 5.5, 32, 304838.827, 6656575.859, '32VLM0483856575'],
  ['スバールバルの例外（33X）', 78.0, 15.0, 33, 500000.0, 8658369.586, '33XWG0000058369'],
  ['北限の近く', 83.9, 20.0, 33, 559245.722, 9319502.269, '33XWP5924519502'],
  ['X帯（12°幅）', 75.0, -40.0, 24, 471110.825, 8323850.335, '24XVJ7111023850'],
];
const got = await page.evaluate(ref => ref.map(([n, la, lo]) => {
  const u = toUTM(la, lo);
  return { n, zone: u && u.zone, e: u && u.e, nn: u && u.n, utm: fmtUTM(u), mgrs: fmtMGRS(u) };
}), REF);
REF.forEach(([n, la, lo, zone, e, nn, mg], i) => {
  const g = got[i];
  ok(g.zone === zone, `★★UTM の帯: ${n}`, { want: zone, got: g.zone });
  ok(Math.abs(g.e - e) < 0.01 && Math.abs(g.nn - nn) < 0.01, `★★★UTM の値が pyproj と1cm以内で一致: ${n}`, { want: [e, nn], got: [g.e, g.nn] });
  // 答えは空白なしの15桁（例 54SUF4751091028）。帯＋緯度帯・100km 四方・東・北に分けて比べる
  const mgWant = `${mg.slice(0, -12)} ${mg.slice(-12, -10)} ${mg.slice(-10, -5)} ${mg.slice(-5)}`;
  ok(g.mgrs === mgWant, `★★★MGRS が mgrs ライブラリと一致: ${n}`, { want: mgWant, got: g.mgrs });
});
const utmRow = await page.evaluate(() => coordFormats(36.953, 139.2873).find(x => x.k === 'UTM座標').v);
ok(utmRow === '54S 347510 4091028', '★★UTM座標の書き方（帯＋緯度帯・東距・北距、1m 切り捨て）', utmRow);
const polar = await page.evaluate(() => coordFormats(85, 10).filter(x => x.none).map(x => x.k));
ok(polar.join('/') === 'UTM座標/MGRS', '★極地（北緯84°以上）は UTM・MGRS を「範囲外」と言う（黙って消さない）', polar);

/* ============ 2. 履歴の座標を押すと窓が開き、地点は移らない ============ */
await page.evaluate(() => { document.getElementById('loading-overlay').style.display = 'none'; openMap(); });
await page.waitForTimeout(600);
await page.focus('#map-search-input');
await page.waitForTimeout(200);
const before = await page.evaluate(() => state.locationName);
await page.click('#map-results .map-hist-coord');
await page.waitForTimeout(200);
const sheet = await page.evaluate(() => {
  const el = document.getElementById('coord-sheet');
  const r = el.getBoundingClientRect();
  const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return {
    open: !el.hidden && getComputedStyle(el).display !== 'none',
    onTop: !!(hit && hit.closest('#coord-sheet')),
    title: document.getElementById('coord-sheet-title').textContent,
    rows: [...document.querySelectorAll('.coord-row')].map(x => ({
      k: x.querySelector('.coord-k').textContent, v: x.querySelector('.coord-v').textContent })),
    name: state.locationName,
    kbd: document.activeElement && document.activeElement.id,
  };
});
ok(sheet.open && sheet.onTop, '★★★座標を押すと窓が地図の上に開く', sheet);
ok(sheet.rows.map(r => r.k).join('/') === '十進度（DD）/度・十進分（DDM）/度分秒（DMS）/度分秒（北緯・東経）/UTM座標/MGRS',
  '★★6つの表記がまとめて出る', sheet.rows);
ok(sheet.title.includes('燧ヶ岳'), '窓の見出しに地点名', sheet);
ok(sheet.name === before, '★★★座標を押してもその地点へは移らない', { before, now: sheet.name });
ok(sheet.kbd !== 'map-search-input', 'キーボード（検索窓のフォーカス）を畳む', sheet);

/* ============ 3. コピー ============ */
await page.click('.coord-row:nth-child(3) .coord-copy');
await page.waitForTimeout(200);
const c1 = await page.evaluate(() => navigator.clipboard.readText());
ok(c1 === `36°57'10.8"N 139°17'14.3"E`, '★★★行のコピーでその表記がクリップボードに入る', c1);
await page.click('.coord-row:nth-child(6) .coord-copy');
await page.waitForTimeout(200);
const cm = await page.evaluate(() => navigator.clipboard.readText());
ok(cm === '54S UF 47510 91028', '★★MGRS もコピーできる', cm);
const label = await page.evaluate(() => document.querySelector('.coord-row:nth-child(6) .coord-copy').textContent);
ok(label === 'コピーしました', 'コピーしたと分かる', label);
await page.click('#coord-copy-all');
await page.waitForTimeout(200);
const c2 = await page.evaluate(() => navigator.clipboard.readText());
ok(c2.startsWith('燧ヶ岳\n') && c2.includes('十進度（DD）: 36.95300, 139.28730') && c2.includes('度分秒（北緯・東経）: 北緯36度57分10.8秒')
  && c2.includes('UTM座標: 54S 347510 4091028') && c2.includes('MGRS: 54S UF 47510 91028'),
  '★★まとめてコピーで全部入る（地点名つき）', c2);

/* ============ 4. 閉じる ============ */
await page.mouse.click(10, 10);           // 窓の外（暗いところ）
await page.waitForTimeout(100);
ok(await page.evaluate(() => document.getElementById('coord-sheet').hidden), '窓の外を押すと閉じる');
await page.evaluate(() => openCoordSheet(36, 138, 'x'));
await page.click('#coord-sheet-close');
ok(await page.evaluate(() => document.getElementById('coord-sheet').hidden), '✕で閉じる');

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const x of fails) console.log('  ✗ ' + x);
  console.log('COORD SMOKE FAILED');
  process.exit(1);
}
console.log('COORD SMOKE PASSED');
