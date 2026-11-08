/* レイヤーセット（#205 段階2・v4.174.0）。
 *
 * ⚠⚠ 呼び出しは組み合わせを丸ごと置き換える（セットに無いレイヤーは OFF）。重ね順（overlays の配列順）もセットのまま。
 * ⚠⚠ 重ね方は実効値で保存し、呼び出しでセットのレイヤーは必ず書き直す（既定の組が既定に戻らない不具合を防ぐ）。
 * ⚠ 下地の透過率は1つの数で保存し、呼び出しで必ず書き直す。分からない下地なら下地も透過率も変えない。
 * ⚠ 知らない id・pending・予備の層・形の悪い id・重複・壊れた保存値は黙って捨てる。名前の HTML は要素にしない。
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

/* ============ 1. 保存値の検査（純関数） ============ */
{
  const { page, errors } = await newPage();
  const r = await page.evaluate(() => {
    const good = { id: 'abc1', name: '  雨の日  ', base: 'pale', baseOpacity: 0.5,
      overlays: [{ id: 'slope', opacity: 0.3 }, { id: 'radar', opacity: 'x' }, { id: 'nope', opacity: 1 }, { id: 'windFlow', opacity: 0.7 }, { id: 'slope', opacity: 1 }],
      blend: { slope: 'screen', radar: 'bogus', nope: 'multiply' }, windMode: 'auto', satBand: 'B13', amedasElement: 'wind' };
    return {
      bad: [sanitizeLayerSets(null), sanitizeLayerSets('x'), sanitizeLayerSets({})].map(a => a.length),
      one: sanitizeLayerSets([good])[0],
      emoji: cutLayerSetName('😀'.repeat(25)),
      ids: sanitizeLayerSets([
        Object.assign({}, good, { id: 'abc1' }), Object.assign({}, good, { id: 'abc1', name: '重複' }),
        Object.assign({}, good, { id: 'A"><b>' }), Object.assign({}, good, { id: 'x'.repeat(17) }),
        Object.assign({}, good, { id: 'ok2', name: '   ' }), Object.assign({}, good, { id: 'ok3', name: 'あ'.repeat(30) }),
      ]).map(s => [s.id, s.name.length]),
      unknownBase: sanitizeLayerSets([Object.assign({}, good, { base: 'gone', windMode: 'zz', satBand: 9, amedasElement: null })])[0],
      rrim: sanitizeLayerSets([Object.assign({}, good, { overlays: [{ id: 'hillshade', opacity: 1 }, { id: 'rrimLike', opacity: 0.8 }, { id: 'slope', opacity: 1 }] })])[0].overlays.map(o => o.id),
      many: sanitizeLayerSets(Array.from({ length: 12 }, (_, i) => Object.assign({}, good, { id: 'n' + i }))).length,
      radarDef: findOverlay('radar').opacity,
    };
  });
  ok(r.bad.every(n => n === 0), '★壊れた保存値はセットなし', r.bad);
  ok(r.one && r.one.name === '雨の日' && r.one.base === 'pale' && r.one.baseOpacity === 0.5, '名前の前後の空白を落とし、下地と透過率を残す', r.one);
  ok(r.one && JSON.stringify(r.one.overlays) === JSON.stringify([{ id: 'slope', opacity: 0.3 }, { id: 'radar', opacity: r.radarDef }, { id: 'windFlowGL', opacity: 0.7 }]),
    '★知らない id・重複を捨て、Canvas 版の風の流れは WebGL 版へ寄せ、透過率の不正値は定義の既定', r.one && r.one.overlays);
  ok(r.one && JSON.stringify(r.one.blend) === JSON.stringify({ slope: 'screen' }), '重ね方は重ねられるレイヤーの既知の値だけ', r.one && r.one.blend);
  ok(JSON.stringify(r.ids) === JSON.stringify([['abc1', 3], ['ok3', 20]]), '★形の悪い id・重複 id・空の名前を捨て、名前は20字まで', r.ids);
  ok(r.unknownBase && r.unknownBase.base === null && r.unknownBase.baseOpacity === null && r.unknownBase.windMode === null && r.unknownBase.satBand === null && r.unknownBase.amedasElement === null,
    '分からない下地・風の層・バンド・要素は null（呼び出しで変えない）', r.unknownBase);
  ok(JSON.stringify(r.rrim) === '["rrimLike"]', '★赤色立体図風と陰影・傾斜が両方あれば赤色立体図風を残す（読み込み）', r.rrim);
  ok(r.many === 8, '上限8件', r.many);
  ok(r.emoji === '😀'.repeat(20), '名前は文字で数えて切る（絵文字を割らない）', r.emoji);
  ok(errors.length === 0, '例外なし（純関数）', errors);
  await page.context().close();
}

/* ============ 2. 保存→変える→呼び出し ============ */
{
  const { page, errors } = await newPage();
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => toggleLayerPanel());
  await page.waitForTimeout(200);
  const empty = await page.evaluate(() => ({
    chips: document.querySelectorAll('#layer-sets .layer-set-chip').length,
    add: !!document.querySelector('#layer-sets .layer-set-add'),
  }));
  ok(empty.chips === 1 && empty.add, '★セットが無ければ「＋いまを保存」だけ', empty);

  // 組み合わせ A：淡色 40%・赤色立体図風（既定の乗算）→傾斜は排他なので陰影なし、雨雲、風は 10m
  const a = await page.evaluate(() => {
    setMapBase('pale'); setBaseOpacity(1);
    toggleOverlay('rrimLike'); toggleOverlay('radar');
    setOverlayOpacity('radar', 0.55);
    window.prompt = () => '<img src=x onerror=window.__xss=1>山';
    saveCurrentLayerSet();
    return { sets: loadLayerSets(), ls: localStorage.getItem('sotoki.map.layerSets') };
  });
  const sA = a.sets[0];
  ok(a.sets.length === 1 && sA.base === 'pale' && sA.baseOpacity === 1 &&
     JSON.stringify(sA.overlays.map(o => o.id)) === '["rrimLike","radar"]' && sA.overlays[1].opacity === 0.55,
    '★いまの組み合わせを写す（下地・透過率・重ね順・透過率）', sA);
  ok(sA && sA.blend.rrimLike === 'multiply' && sA.blend.radar === 'normal', '★重ね方は既定のものも実効値で保存する', sA && sA.blend);
  ok(a.ls && JSON.parse(a.ls).length === 1, '端末に保存する', a.ls);

  // 変える：下地を航空写真 30%、赤色立体図風をスクリーンに、雨雲を外して傾斜量図、雨雲の透過率も変える
  const b = await page.evaluate(() => {
    setMapBase('photo'); setBaseOpacity(0.3);
    setMapBase('pale'); setBaseOpacity(0.2); setMapBase('photo');
    setOverlayBlend('rrimLike', 'screen');
    toggleOverlay('radar'); toggleOverlay('slope');
    const chip = document.querySelector('#layer-sets .layer-set-chip:not(.layer-set-add)');
    return { active: chip.classList.contains('active'), html: chip.innerHTML, xss: !!window.__xss, ov: mapPrefs.overlays.map(o => o.id) };
  });
  ok(!b.active, '組み合わせが違えばチップは選択中にしない', b);
  ok(!b.xss && !/<img/.test(b.html) && /&lt;img/.test(b.html), '★名前の HTML は要素にしない', b.html);
  ok(JSON.stringify(b.ov) === '["slope"]', '（前提）傾斜量図を入れると赤色立体図風が外れる', b.ov);

  const c = await page.evaluate(() => {
    applyLayerSet(loadLayerSets()[0].id);
    const chip = document.querySelector('#layer-sets .layer-set-chip:not(.layer-set-add)');
    return {
      base: mapPrefs.base, baseOp: baseOpacity('pale'), photoOp: baseOpacity('photo'),
      ov: mapPrefs.overlays.map(o => [o.id, o.opacity]),
      rrimBlend: blendOf('rrimLike'), rawBlend: Object.assign({}, mapPrefs.blend),
      pane: leafletMap.getPane('rrimSlope').style.mixBlendMode,
      tile: baseTileLayer && baseTileLayer.options.opacity,
      active: chip.classList.contains('active'),
      saved: JSON.parse(localStorage.getItem('sotoki.map.overlays')).map(o => o.id),
    };
  });
  ok(c.base === 'pale' && c.baseOp === 1 && c.tile === 1, '★下地と透過率を戻す（後で下げた 20% を 100% に書き直す）', c);
  ok(c.photoOp === 0.3, 'ほかの下地の透過率には触らない', c.photoOp);
  ok(JSON.stringify(c.ov) === JSON.stringify([['rrimLike', sA.overlays[0].opacity], ['radar', 0.55]]),
    '★セットに無いレイヤー（傾斜量図）は OFF、重ね順と透過率はセットのまま', c.ov);
  ok(c.rrimBlend === 'multiply' && !('rrimLike' in c.rawBlend) && c.pane === 'multiply', '★スクリーンにした赤色立体図風が既定の乗算に戻る（地図の箱にも）', c);
  ok(c.active, '呼び出した直後はそのチップが選択中', c.active);
  ok(JSON.stringify(c.saved) === '["rrimLike","radar"]', '呼び出した組み合わせを端末に覚える', c.saved);

  // 呼び出しの側でも赤色立体図風の排他を守る／分からない下地なら下地を変えない
  const d = await page.evaluate(() => {
    localStorage.setItem('sotoki.map.layerSets', JSON.stringify([{ id: 'zz9', name: '古い', base: 'gone', baseOpacity: 0.1,
      overlays: [{ id: 'slope', opacity: 1 }, { id: 'rrimLike', opacity: 0.5 }], blend: {} }]));
    layerSetsCache = null;
    setMapBase('osm');
    applyLayerSet('zz9');
    return { base: mapPrefs.base, osmOp: baseOpacity('osm'), ov: mapPrefs.overlays.map(o => o.id) };
  });
  ok(d.base === 'osm' && d.osmOp === 1, '★分からない下地なら下地も透過率も変えない', d);
  ok(JSON.stringify(d.ov) === '["rrimLike"]', '★呼び出しでも赤色立体図風と傾斜量図を両方 ON にしない', d.ov);
  ok(errors.length === 0, '例外なし（保存と呼び出し）', errors);
  await page.context().close();
}

/* ============ 3. 編集モード：並べ替え・名前・上書き・削除・上限 ============ */
{
  const { page, errors } = await newPage(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
    const s = (id, name) => ({ id, name, base: 'std', baseOpacity: 1, overlays: [], blend: {}, windMode: 'auto', satBand: 'B13', amedasElement: 'temp' });
    localStorage.setItem('sotoki.map.layerSets', JSON.stringify(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8'].map((id, i) => s(id, '組' + (i + 1)))));
  });
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => toggleLayerPanel());
  await page.waitForTimeout(200);
  const full = await page.evaluate(() => ({
    chips: document.querySelectorAll('#layer-sets .layer-set-chip:not(.layer-set-add)').length,
    addDisabled: document.querySelector('#layer-sets .layer-set-add').disabled,
  }));
  ok(full.chips === 8 && full.addDisabled, '★上限8件では保存できない', full);

  const e = await page.evaluate(() => {
    toggleLayerEdit();
    const rows = document.querySelectorAll('#layer-sets .layer-set-row').length;
    moveLayerSet('a2', -1);
    window.prompt = () => '  新しい名前  ';
    renameLayerSet('a3');
    window.confirm = () => false;
    deleteLayerSet('a4');
    const kept = loadLayerSets().length;
    window.confirm = () => true;
    deleteLayerSet('a4');
    setMapBase('pale');
    overwriteLayerSet('a5');
    const sets = loadLayerSets();
    return { rows, kept, order: sets.map(s => s.id), name: sets.find(s => s.id === 'a3').name,
      a5: sets.find(s => s.id === 'a5'), chipsInEdit: document.querySelectorAll('#layer-sets .layer-set-chip').length,
      saved: JSON.parse(localStorage.getItem('sotoki.map.layerSets')).length };
  });
  ok(e.rows === 8 && e.chipsInEdit === 0, '★編集モードではセットを行で出す（押して呼び出すチップは出さない）', e);
  ok(e.order.slice(0, 2).join() === 'a2,a1', '▲で1つ上へ', e.order);
  ok(e.name === '新しい名前', '名前を変える（前後の空白は落とす）', e.name);
  ok(e.kept === 8 && e.order.length === 7 && !e.order.includes('a4') && e.saved === 7, '★削除は確かめてから（キャンセルなら残す）', e);
  ok(e.a5 && e.a5.name === '組5' && e.a5.base === 'pale', '上書きは名前を残して中身だけ替える', e.a5);
  ok(errors.length === 0, '例外なし（編集モード）', errors);
  await page.context().close();
}

await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
