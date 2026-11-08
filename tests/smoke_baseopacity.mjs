/* 下地（ベースマップ）の透過率（#211・v4.172.0）。
 *
 * ⚠⚠ 既定は 100%（いまと同じ見た目）。0%（下地なし）も許す。下地ごとに覚える。
 * ⚠⚠ 保存値は数（0〜1）だけ通す。Number() で読むと null・"" が 0 になり、黙って下地が消える。
 * ⚠ 薄くしたときの地は白（#map.base-faded）。100% に戻したら外す。
 * ⚠ 編集モード（#205 段階1）では透過率の行を出さない。
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


/* ============ 1. 既定は 100%・保存・下地ごと・0% ============ */
{
  const { page, errors } = await newPage();
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  await page.evaluate(() => toggleLayerPanel());
  await page.waitForTimeout(200);
  const d = await page.evaluate(() => ({
    op: baseTileLayer.options.opacity, faded: document.getElementById('map').classList.contains('base-faded'),
    val: document.getElementById('layer-base-op-val').textContent,
    name: document.querySelector('#layer-base-op .layer-base-op-name').textContent,
  }));
  ok(d.op === 1 && !d.faded && d.val === '100%', '★★既定は 100%（いまと同じ）・白の地は付けない', d);
  ok(d.name === '淡色地図の透過率', '選んでいる下地の名前を出す', d.name);

  const r = await page.evaluate(() => {
    const out = {};
    const range = document.querySelector('#layer-base-op input[type=range]');
    range.value = 40; range.dispatchEvent(new Event('input'));
    out.a = { op: baseTileLayer.options.opacity, faded: document.getElementById('map').classList.contains('base-faded'),
      val: document.getElementById('layer-base-op-val').textContent, bg: getComputedStyle(document.getElementById('map')).backgroundColor,
      saved: JSON.parse(localStorage.getItem('sotoki.map.baseOpacity')) };
    setMapBase('photo');
    out.b = { op: baseTileLayer.options.opacity, val: document.getElementById('layer-base-op-val').textContent,
      faded: document.getElementById('map').classList.contains('base-faded') };
    setBaseOpacity(0);
    out.c = { op: baseTileLayer.options.opacity, saved: JSON.parse(localStorage.getItem('sotoki.map.baseOpacity')) };
    setMapBase('pale');
    out.d = { op: baseTileLayer.options.opacity, val: document.querySelector('#layer-base-op input[type=range]').value };
    setBaseOpacity(1);
    out.e = { faded: document.getElementById('map').classList.contains('base-faded') };
    setBaseOpacity(0.4);
    // 編集モードでは行が消え、完了で戻る
    toggleLayerEdit();
    out.editHidden = getComputedStyle(document.getElementById('layer-base-op')).display === 'none';
    toggleLayerEdit();
    out.backShown = getComputedStyle(document.getElementById('layer-base-op')).display !== 'none';
    return out;
  });
  ok(Math.abs(r.a.op - 0.4) < 1e-9 && r.a.faded && r.a.val === '40%', '★スライダーで下地が薄くなり、% が変わる', r.a);
  ok(r.a.bg === 'rgb(255, 255, 255)', '★薄くしたときの地は白', r.a.bg);
  ok(r.a.saved && r.a.saved.pale === 0.4, '下地ごとに保存する', r.a.saved);
  ok(r.b.op === 1 && r.b.val === '100%' && !r.b.faded, '★下地を切り替えると、その下地の値（未設定なら 100%）になる', r.b);
  ok(r.c.op === 0 && r.c.saved.photo === 0 && r.c.saved.pale === 0.4, '★0%（下地なし）を許す・下地ごとに別の値', r.c);
  ok(Math.abs(r.d.op - 0.4) < 1e-9 && r.d.val === '40', '元の下地に戻すと覚えた値に戻る', r.d);
  ok(!r.e.faded, '100% に戻すと白の地を外す', r.e);
  ok(r.editHidden && r.backShown, '★編集モードでは透過率の行を隠し、完了で戻す', r);
  ok(errors.length === 0, '例外なし（操作）', errors);
  await page.context().close();
}

/* ============ 2. 再起動しても残る（0 は 0 のまま） ============ */
{
  const { page, errors } = await newPage(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
    localStorage.setItem('sotoki.map.baseLayer', 'photo');
    localStorage.setItem('sotoki.map.baseOpacity', JSON.stringify({ photo: 0, pale: 0.4 }));
  });
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  const d = await page.evaluate(() => ({ op: baseTileLayer.options.opacity, pale: baseOpacity('pale'), faded: document.getElementById('map').classList.contains('base-faded') }));
  ok(d.op === 0 && d.pale === 0.4 && d.faded, '★★再起動しても残る（0 を既定の 100% に戻さない）', d);
  ok(errors.length === 0, '例外なし（再起動）', errors);
  await page.context().close();
}

/* ============ 3. 壊れた保存値でも起動でき、黙って透明にしない ============ */
for (const raw of ['{broken', '[1,2]', JSON.stringify({ pale: null, std: '', photo: '0.3', osm: true, esri: -0.5, nope: 0.5 }), JSON.stringify({ pale: 1.5 })]) {
  const { page, errors } = await newPage(new Function(`
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
    localStorage.setItem('sotoki.map.baseOpacity', ${JSON.stringify(raw)});`));
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(400);
  const d = await page.evaluate(() => ({ open: isMapOpen(), op: baseTileLayer.options.opacity, keys: Object.keys(mapPrefs.baseOpacity) }));
  ok(d.open && d.op === 1 && d.keys.length === 0, `★壊れた保存値は捨てて 100%（null・""・文字列・true・範囲外で黙って透明にしない）: ${raw}`, d);
  ok(errors.length === 0, '例外なし（壊れた保存値）', errors);
  await page.context().close();
}

await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
