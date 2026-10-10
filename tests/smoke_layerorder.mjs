/* レイヤー一覧の並べ替え・隠す（#205 段階1・v4.169.0）。
 *
 * ⚠⚠ 一覧の並びは見た目だけ。重ね順（mapPrefs.overlays の配列順）は変えない。
 * ⚠⚠ 隠しても ON/OFF はそのまま（ON のまま一覧から消えるだけ）。区分の末尾に件数を出す。
 * ⚠ 選択中の下地は隠せない（排他選択なので、隠すと選択中の印が一覧から消える）。
 * ⚠ 並べ替えは編集モードの中だけ。編集モードの ▲▼👁 は行全体のボタンの中に入れない。
 * ⚠ 知らない id・壊れた保存値でも起動できる。版で足したレイヤーは末尾に出る。
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

async function newPage(init) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, timezoneId: 'Asia/Tokyo' });
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
  await page.addInitScript(init || (() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
  }));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(900);
  return { page, errors };
}

/* ============ 1. 純関数 ============ */
{
  const { page, errors } = await newPage();
  const r = await page.evaluate(() => {
    const defs = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
    const ids = l => l.map(d => d.id).join('');
    return {
      none: ids(orderLayers(defs)),
      junk: ids(orderLayers(defs, 'x')),
      saved: ids(orderLayers(defs, ['c', 'a'])),
      unknown: ids(orderLayers(defs, ['zz', 'd', 'd', 3, null, 'b'])),
      sanOrder: sanitizeLayerOrder({ bases: ['esri', 'nope', 'std', 'esri'], weather: ['windFlow', 'radar'], overlays: 'x', foo: ['a'] }),
      sanBad: [sanitizeLayerOrder(null), sanitizeLayerOrder([1]), sanitizeLayerOrder('x')],
      sanHid: sanitizeLayerHiddenIds(['radar', 'radar', 'nope', 7, 'csmap', 'windFlow', 'std']),
      sanHidBad: sanitizeLayerHiddenIds({ a: 1 }),
    };
  });
  ok(r.none === 'abcd' && r.junk === 'abcd', '★保存が無い・壊れていれば定義表の順', r);
  ok(r.saved === 'cabd', '★保存した順に並べ、保存に無い項目（版で足したもの）は定義表の順で末尾', r.saved);
  ok(r.unknown === 'dbac', '知らない id・重複・文字列でないものは捨てる', r.unknown);
  ok(JSON.stringify(r.sanOrder) === JSON.stringify({ bases: ['esri', 'std'], weather: ['radar'] }),
    '★保存値の掃除（知らない id・予備の層・重複・知らない区分を捨てる）', r.sanOrder);
  ok(r.sanBad.every(o => JSON.stringify(o) === '{}'), '壊れた保存値は空の並び', r.sanBad);
  ok(JSON.stringify(r.sanHid) === JSON.stringify(['radar', 'std']),
    '★隠した項目の掃除（pending・予備の層・知らない id・重複を捨てる）', r.sanHid);
  ok(Array.isArray(r.sanHidBad) && r.sanHidBad.length === 0, '隠した項目が配列でなければ空', r.sanHidBad);
  ok(errors.length === 0, '例外なし（純関数）', errors);
  await page.context().close();
}

/* ============ 2. 既定の一覧は今までと同じ ============ */
{
  const { page, errors } = await newPage();
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => toggleLayerPanel());
  await page.waitForTimeout(200);
  const d = await page.evaluate(() => ({
    bases: Array.from(document.querySelectorAll('#layer-bases .layer-base-name')).map(e => e.textContent),
    defBases: MAP_BASES.map(b => b.name),
    ov: Array.from(document.querySelectorAll('#layer-overlays .layer-ov')).length,
    defOv: usableOverlays().length,
    wx: Array.from(document.querySelectorAll('#layer-weather .layer-ov')).length,
    defWx: usableWeather().filter(o => !o.hidden).length,
    sum: document.querySelectorAll('.layer-hidden-sum').length,
    btn: document.getElementById('btn-layer-edit').textContent,
  }));
  ok(JSON.stringify(d.bases) === JSON.stringify(d.defBases) && d.ov === d.defOv && d.wx === d.defWx,
    '★★既定（保存なし）の一覧は定義表の順・全件（今までと同じ）', d);
  ok(d.sum === 0 && d.btn === '並べ替え', '隠していなければ件数の行は出ない・見出しに「並べ替え」', d);

  /* ============ 3. 編集モード：並べ替え・隠す ============ */
  await page.evaluate(() => {
    toggleOverlay('hillshade');        // 地形図を2つ ON（重ね順 = hillshade → relief）
    toggleOverlay('relief');
    toggleLayerEdit();
  });
  await page.waitForTimeout(100);
  const e1 = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#layer-overlays .layer-edit-row'));
    const first = rows[0], last = rows[rows.length - 1];
    return {
      rows: rows.length, toggles: document.querySelectorAll('#layer-panel .layer-ov-toggle').length,
      ranges: document.querySelectorAll('#layer-panel input[type=range]').length,
      nested: document.querySelectorAll('button button').length,
      firstUp: first.querySelectorAll('.layer-edit-btn')[0].disabled,
      lastDown: last.querySelectorAll('.layer-edit-btn')[1].disabled,
      btn: document.getElementById('btn-layer-edit').textContent,
      editing: document.getElementById('layer-panel').classList.contains('editing'),
      baseEyeLocked: document.querySelector(`#layer-bases .layer-edit-row[data-id="${mapPrefs.base}"] .layer-edit-eye`).disabled,
      labels: Array.from(document.querySelectorAll('.layer-edit-btn')).every(b => b.getAttribute('aria-label')),
    };
  });
  ok(e1.rows === d.defOv && e1.toggles === 0 && e1.ranges === 0,
    '★編集モードは「名前＋▲▼👁」だけ（ON/OFF・透過率を出さない）', e1);
  ok(e1.nested === 0 && e1.labels, '★ボタンを入れ子にしない・▲▼👁 に aria-label', e1);
  ok(e1.firstUp && e1.lastDown, '端の行の ▲／▼ は押せない', e1);
  ok(e1.btn === '完了' && e1.editing, '見出しは「完了」に変わる', e1);
  ok(e1.baseEyeLocked, '★★選択中の下地は隠せない', e1);

  // relief を先頭へ（何回か ▲）、hillshade を隠す
  const before = await page.evaluate(() => JSON.stringify(mapPrefs.overlays));
  await page.evaluate(() => {
    for (let i = 0; i < 20; i++) moveLayer('overlays', 'relief', -1);
    toggleLayerHidden('hillshade');
    moveLayer('bases', 'esri', -1);
  });
  const e2 = await page.evaluate(() => ({
    firstRow: document.querySelector('#layer-overlays .layer-edit-row').dataset.id,
    hiddenRow: document.querySelector('#layer-overlays .layer-edit-row[data-id="hillshade"]').classList.contains('is-hidden'),
    overlays: JSON.stringify(mapPrefs.overlays),
    savedOrder: JSON.parse(localStorage.getItem('sotoki.map.layerOrder')),
    savedHid: JSON.parse(localStorage.getItem('sotoki.map.layerHiddenIds')),
    hillOn: isOverlayOn('hillshade'),
  }));
  ok(e2.firstRow === 'relief', '★▲で区分の先頭へ', e2.firstRow);
  ok(e2.hiddenRow, '編集モードでは隠した行も薄く出す', e2);
  ok(e2.overlays === before, '★★★並べ替え・隠しても重ね順（mapPrefs.overlays）は変わらない', { before, after: e2.overlays });
  ok(e2.hillOn, '★★ON のまま隠した項目は ON のまま', e2);
  ok(e2.savedOrder && e2.savedOrder.overlays[0] === 'relief' && e2.savedOrder.bases.indexOf('esri') === 3,
    '並びを保存する', e2.savedOrder);
  ok(JSON.stringify(e2.savedHid) === '["hillshade"]', '隠した項目を保存する', e2.savedHid);

  /* ============ 4. 完了 → 通常の一覧 ============ */
  await page.evaluate(() => toggleLayerEdit());
  const n1 = await page.evaluate(() => ({
    ov: Array.from(document.querySelectorAll('#layer-overlays .layer-ov-name')).map(e => e.firstChild.textContent.trim()),
    hasHill: !!document.querySelector('#layer-overlays [data-id="hillshade"]'),
    sum: (document.querySelector('#layer-overlays .layer-hidden-sum') || {}).textContent || '',
  }));
  ok(n1.ov[0] === '色別標高図' && !n1.hasHill, '★通常の一覧は保存した順で、隠した項目は出さない', n1);
  ok(n1.sum.includes('隠している項目 1件') && n1.sum.includes('うちON 1件'), '★区分の末尾に隠している件数（ON の件数も）', n1.sum);

  // 隠した行が先頭のときも、▲▼ は編集一覧（隠した行を含む）の端で決める
  await page.evaluate(() => { toggleLayerEdit(); for (let i = 0; i < 20; i++) moveLayer('overlays', 'hillshade', -1); });
  const e3 = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('#layer-overlays .layer-edit-row'));
    return { first: rows[0].dataset.id, secondUp: rows[1].querySelectorAll('.layer-edit-btn')[0].disabled };
  });
  ok(e3.first === 'hillshade' && e3.secondUp === false, '隠した行が先頭でも、2行目の ▲ は押せる', e3);

  // 初期の並びに戻す：並びだけ戻し、隠しは残す
  await page.evaluate(() => resetLayerOrder('overlays'));
  const e4 = await page.evaluate(() => ({
    first: document.querySelector('#layer-overlays .layer-edit-row').dataset.id,
    defFirst: usableOverlays()[0].id,
    hid: mapPrefs.layerHiddenIds.slice(),
    basesKept: !!(mapPrefs.layerOrder.bases),
  }));
  ok(e4.first === e4.defFirst && e4.hid.includes('hillshade') && e4.basesKept,
    '★「初期の並びに戻す」は区分の並びだけ戻し、隠した項目と他の区分は残す', e4);

  // パネルを閉じたら編集モードは解除
  await page.evaluate(() => { closeLayerPanel(); toggleLayerPanel(); });
  const e5 = await page.evaluate(() => ({ editing: document.getElementById('layer-panel').classList.contains('editing'),
    rows: document.querySelectorAll('.layer-edit-row').length }));
  ok(!e5.editing && e5.rows === 0, 'パネルを閉じたら編集モードは覚えない', e5);
  ok(errors.length === 0, '例外なし（操作）', errors);
  await page.context().close();
}

/* ============ 5. 壊れた保存値でも起動できる・選択中の下地は隠れない ============ */
{
  const { page, errors } = await newPage(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
    localStorage.setItem('sotoki.map.layerOrder', '{broken');
    localStorage.setItem('sotoki.map.layerHiddenIds', JSON.stringify(['pale', 'radar']));
    localStorage.setItem('sotoki.map.baseLayer', 'pale');
  });
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => toggleLayerPanel());
  await page.waitForTimeout(200);
  const b = await page.evaluate(() => ({
    open: isMapOpen(),
    hid: mapPrefs.layerHiddenIds.slice(),
    paleShown: Array.from(document.querySelectorAll('#layer-bases .layer-base-name')).some(e => e.textContent === '淡色地図'),
    radarShown: !!document.querySelector('#layer-weather .layer-status[data-id="radar"]'),
  }));
  ok(b.open && b.paleShown, '★壊れた保存値でも地図は開き、選択中の下地は一覧に残る', b);
  ok(JSON.stringify(b.hid) === '["radar"]' && !b.radarShown, '隠した気象レイヤーは一覧に出ない', b);
  ok(errors.length === 0, '例外なし（壊れた保存値）', errors);
  await page.context().close();
}

await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
