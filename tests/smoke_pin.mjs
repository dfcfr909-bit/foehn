/* 地点のピンがタップを受けないこと。
 *
 * ⚠ **iOSで実際に起きた不具合。** Leaflet の既定のピンは `<img>` なので、
 *   長押しすると**画像として**「共有／"写真"に保存」のメニューが出てしまう。
 *   地図のピンとしてはタップを受ける必要が無く、**触ったら下の地図に抜ける**のが正しい。
 *
 * ⚠ **他のマーカーまで殺さないこと。** 百名山の△はタップで地点を選ぶ。
 *   一括で `pointer-events: none` にすると、その機能が黙って死ぬ。
 *
 * ⚠ **これは実機確認の代わりにはならない。** iOS の長押しメニューが本当に出なくなるかは
 *   Chromium では確かめられない。ここで見るのは「触れない作りになっているか」まで。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');
const LEAFLET_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.js'), 'utf8');
const LEAFLET_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.css'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

/* --- 原文を読む静的検査：一括指定していないこと ---
   ⚠ `.leaflet-marker-icon` に一括で pointer-events: none を掛けると、
     百名山の△のタップが黙って死ぬ。 */
ok(!/\.leaflet-marker-icon[^{]*\{[^}]*pointer-events\s*:\s*none/.test(HTML),
  '★★他のマーカーまで一括でタップ不可にしない（百名山の△が死ぬ）');
ok(/\.pick-pin/.test(HTML), 'ピン専用の指定がある');

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
  if (url.includes('leaflet.js') || url.includes('leaflet.min.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet.css') || url.includes('leaflet.min.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('areas.json')) return route.fulfill({ contentType: 'application/json',
    body: fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8') });
  return route.fulfill({ status: 204, body: '' });   // タイル等は空で返す
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(400);
await page.evaluate(() => { openMap(); });
await page.waitForTimeout(900);

const pin = await page.evaluate(() => {
  const el = leafletMarker && leafletMarker.getElement();
  if (!el) return { found: false };
  const st = getComputedStyle(el);
  return {
    found: true,
    tag: el.tagName,
    cls: el.className,
    pointerEvents: st.pointerEvents,
    callout: st.webkitTouchCallout || st.getPropertyValue('-webkit-touch-callout'),
    userSelect: st.userSelect || st.webkitUserSelect,
    interactive: el.classList.contains('leaflet-interactive'),
  };
});
ok(pin.found, 'ピンが出ている（前提）', pin);
ok(pin.pointerEvents === 'none', '★★★ピンはタップを受けない（下の地図に抜ける）', pin);
ok(!pin.interactive, '★Leaflet の対話対象になっていない', pin);
/* ⚠ `-webkit-touch-callout` は **Chromium に無い**ので実行時には確かめられない
     （`getComputedStyle` が空を返す）。**原文で見る**しかない。
     ⚠ 実際に長押しメニューが出なくなるかは**iOS実機でしか確かめられない**。 */
const pickRule = (HTML.match(/\.pick-pin[^{]*\{[^}]*\}/) || [''])[0];
ok(/-webkit-touch-callout\s*:\s*none/.test(pickRule),
  '★★iOSの長押しメニューを止める指定がある（原文で確認）', pickRule.slice(0, 200));
ok(/-webkit-user-drag\s*:\s*none/.test(pickRule),
  '★画像としてドラッグもできないようにする', pickRule.slice(0, 200));
ok(/none/.test(String(pin.userSelect)), '★選択もできないようにする', pin.userSelect);

/* --- ピンの上を触っても地図に届くこと（本丸） ---
   ⚠ 「タップを受けない」だけでは足りない。**下の地図に抜けている**ことまで見る。 */
const hit = await page.evaluate(() => {
  const el = leafletMarker.getElement();
  const r = el.getBoundingClientRect();
  const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  return { top: top ? (top.className || top.tagName) : null,
    isPin: !!(top && top.classList && top.classList.contains('pick-pin')) };
});
ok(!hit.isPin, '★★★ピンの真上を触ると、ピンではなく下の要素が拾う', hit);

/* --- 百名山の△は今もタップできること（巻き添えにしていない） --- */
const hyaku = await page.evaluate(async () => {
  if (!areasData) await loadAreas();
  leafletMap.setView([36.6584, 137.7526], 11);
  if (!isOverlayOn('areas')) toggleOverlay('areas');
  await new Promise(r => setTimeout(r, 700));
  const tri = weatherMarkers.map(m => m.getElement && m.getElement())
    .filter(e => e && e.classList && e.classList.contains('peak-tri'));
  if (!tri.length) return { found: false };
  return { found: true, pointerEvents: getComputedStyle(tri[0]).pointerEvents };
});
if (hyaku.found) {
  ok(hyaku.pointerEvents !== 'none',
    '★★百名山の△は今もタップできる（巻き添えにしていない）', hyaku);
} else {
  console.log('（百名山の△が見つからなかったので、その検査は飛ばした）');
}

ok(errors.length === 0, 'ページ内で例外が出ていない', errors);
await browser.close();

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('PIN SMOKE FAILED');
  process.exit(1);
}
console.log('PIN SMOKE PASSED');
