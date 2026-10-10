/* CIマップ（栃木県）（#202・v4.168.0）。栃木県の標高タイル（Terrain-RGB）から収束度（CI）を端末で計算して描く。
 *
 * ⚠⚠ Worker が黙って壊れてメインに落ちても絵は同じに出る。**どちらの経路で計算したか（ciStats）を数えて要求する。**
 * ⚠⚠ Worker には関数を fn.toString() で渡す。外の定数を参照すると Worker の中でだけ落ちる
 *    → Worker とメインで同じ画素になることを確かめる。
 * ⚠ 計算は z13〜16。z12 以下は標高タイルを取りに行かず「拡大すると表示」。z17 以上は z16 の標高だけ取りに行く。
 * ⚠ 県外（403）は赤帯（layerFailed）にしない。全部無ければ「表示なし」、一部なら「一部は配信の範囲外」。
 * ⚠ 出典欄は「CIマップ（上原ほか）」と栃木県の加工の旨。CS立体図（栃木県）と同時でも栃木県の文言は1回。
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

/* ---- 作り物の標高タイル（円錐の山）。別のページの canvas で PNG を作る ---- */
const gen = await ctx.newPage();
await gen.setContent('<canvas id="c" width="256" height="256"></canvas>');
const PEAK = { lat: 36.7656, lon: 139.4937 };
async function demPng(z, x, y) {
  return Buffer.from(await gen.evaluate(({ z, x, y, PEAK }) => {
    const c = document.getElementById('c'), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
    const n = 2 ** z, R = 6378137;
    const mx = lon => (lon + 180) / 360 * n * 256;
    const my = lat => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n * 256; };
    const px0 = mx(PEAK.lon), py0 = my(PEAK.lat);
    const mPerPx = 2 * Math.PI * R * Math.cos(PEAK.lat * Math.PI / 180) / (n * 256);
    for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
      const dist = Math.hypot(x * 256 + i - px0, y * 256 + j - py0) * mPerPx;
      const h = 2400 - dist * 0.4, v = Math.round((h + 10000) * 10), k = (j * 256 + i) * 4;
      d[k] = (v >> 16) & 255; d[k + 1] = (v >> 8) & 255; d[k + 2] = v & 255; d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, { z, x, y, PEAK }), 'base64');
}

const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const demReqs = [];
let demMode = 'cone';   // 'cone' | '403' | 'half'
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  const m = url.match(/terrainRGB\/(\d+)\/(\d+)\/(\d+)\.png/);
  if (m) {
    const [z, x, y] = m.slice(1).map(Number);
    demReqs.push({ z, x, y });
    if (demMode === '403' || (demMode === 'half' && x % 2)) return route.fulfill({ status: 403, body: '' });
    return route.fulfill({ contentType: 'image/png', body: await demPng(z, x, y),
      headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.7656, lon: 139.4937, name: '男体山' }));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(900);

/* ============ 1. 純関数 ============ */
const pure = await page.evaluate(() => {
  const out = {};
  // 復号：2479.2m ＝ (2479.2+10000)*10 = 124792 = 0x01_E7_78、A=0 は NaN
  const d = new Uint8ClampedArray([0x01, 0xE7, 0x78, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const dec = decodeTochigiDem(d, 2);
  out.dec0 = Math.round(dec[0] * 10) / 10; out.decNaN = Number.isNaN(dec[1]);
  out.allMissing = decodeTochigiDem(new Uint8ClampedArray(16), 2) === null;
  // 人工の地形：円錐（尾根）・すり鉢（谷）・平面
  const n = 256, px = 2, M = ciMargin(px, CI_PRM), W = n + 2 * M;
  const make = f => { const g = new Float32Array(W * W); for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) g[y * W + x] = f(x - W / 2, y - W / 2); return g; };
  const at = (pix, x, y) => { const j = (y * n + x) * 4; return [pix[j], pix[j + 1], pix[j + 2], pix[j + 3]]; };
  // 円錐の頂上は丸める（尖りの1点は勾配が定まらない）。中心から少し離れた点で見る
  const cone = computeCiTile(make((x, y) => 1000 - Math.hypot(x, y) * px * 0.5), M, px, CI_PRM);
  const bowl = computeCiTile(make((x, y) => 1000 + Math.hypot(x, y) * px * 0.5), M, px, CI_PRM);
  const plane = computeCiTile(make((x, y) => 1000 + x * px * 0.3), M, px, CI_PRM);
  out.cone = at(cone, 140, 128); out.bowl = at(bowl, 140, 128); out.plane = at(plane, 60, 60);
  return out;
});
ok(pure.dec0 === 2479.2 && pure.decNaN, '★Terrain-RGB の変換（0.1m 単位・A=0 は欠け）', pure);
ok(pure.allMissing, '全部欠けたタイルは null', pure);
ok(pure.cone[0] > pure.cone[2] + 60, '★★円錐（尾根・発散）は赤系', pure.cone);
ok(pure.bowl[2] > pure.bowl[0] + 60, '★★すり鉢（谷・収束）は青系', pure.bowl);
ok(Math.abs(pure.plane[0] - pure.plane[2]) < 20 && pure.plane[3] < 80, '平面は灰で淡い', pure.plane);

/* ============ 2. 地図で入れる（Worker の経路） ============ */
async function shownPixels() {
  return page.evaluate(() => {
    const layer = overlayTileLayers.ciMapTochigi;
    if (!layer) return { n: 0, colored: 0 };
    let colored = 0, n = 0;
    for (const k in layer._tiles) {
      const t = layer._tiles[k]; if (!t.loaded) continue; n++;
      const d = t.el.getContext('2d').getImageData(0, 0, 256, 256).data;
      for (let j = 3; j < d.length; j += 4 * 97) if (d[j] > 0) { colored++; break; }
    }
    return { n, colored };
  });
}
await page.evaluate(() => { openMap(); });
await page.waitForTimeout(500);
await page.evaluate(() => { leafletMap.setView([36.7656, 139.4937], 15, { animate: false }); toggleOverlay('ciMapTochigi'); });
await page.waitForTimeout(4000);
const w1 = await page.evaluate(() => ({ ...ciStats, broken: ciWorkerBroken, hasWorker: !!ciWorker }));
const p1 = await shownPixels();
ok(w1.worker > 0 && w1.main === 0 && !w1.broken, '★★★Worker で計算している（メインに黙って落ちていない）', w1);
ok(p1.n > 0 && p1.colored === p1.n, '★タイルに色が付く', p1);
ok(demReqs.length > 0 && demReqs.every(r => r.z === 15), 'z15 では z15 の標高を取りに行く', demReqs.slice(0, 3));

/* Worker とメインで同じ画素（fn.toString で渡した関数が同じ値を返す） */
const same = await page.evaluate(async () => {
  const layer = overlayTileLayers.ciMapTochigi;
  const k = Object.keys(layer._tiles).find(k => layer._tiles[k].loaded);
  const t = layer._tiles[k], c = t.coords;
  const a = t.el.getContext('2d').getImageData(0, 0, 256, 256).data;
  const job = { id: -1, cancelled: false };
  const keys = [], blobs = [];
  for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { keys.push(ciTileKey(c.z, c.x + ox, c.y + oy)); blobs.push(await ciFetchBlob(c.z, c.x + ox, c.y + oy)); }
  Object.assign(job, { keys, blobs, px: ciMetersPerPx(c.z, c.y, 256) });
  const before = ciStats.main;
  const raw = await ciComputeMain(job);
  ciStats.main = before;   // 検査のための計算は数えない
  // 地図のタイルは canvas を通っている（不透明度の掛け合わせで丸まる）ので、同じ道を通して比べる
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  cv.getContext('2d').putImageData(new ImageData(raw, 256, 256), 0, 0);
  const b = cv.getContext('2d').getImageData(0, 0, 256, 256).data;
  let diff = 0; for (let i = 0; i < a.length; i++) diff = Math.max(diff, Math.abs(a[i] - b[i]));
  return { diff };
});
ok(same.diff === 0, '★★Worker とメインで同じ画素', same);

/* 不透明度 */
const op = await page.evaluate(() => { setOverlayOpacity('ciMapTochigi', 0.4); return overlayTileLayers.ciMapTochigi.options.opacity; });
ok(op === 0.4, '透過率のスライダーが効く', op);

/* 出典欄 */
const attr1 = await page.evaluate(() => { toggleOverlay('csmapTochigi'); return document.getElementById('map-attribution').textContent; });
ok(attr1.includes('CIマップ（上原ほか）'), '★出典欄に「CIマップ（上原ほか）」', attr1);
ok(attr1.split('栃木県森林資源データ（2021〜2022年度計測）を加工して作成').length === 2, '★CS立体図と同時でも栃木県の文言は1回', attr1);
await page.evaluate(() => toggleOverlay('csmapTochigi'));

/* ============ 3. ズーム ============ */
demReqs.length = 0;
await page.evaluate(() => leafletMap.setView([36.7656, 139.4937], 18, { animate: false }));
await page.waitForTimeout(2500);
ok(demReqs.length > 0 && demReqs.every(r => r.z === 16), '★★z18 では z16 の標高だけ取りに行く（引き伸ばし）', demReqs.slice(0, 3));
demReqs.length = 0;
await page.evaluate(() => leafletMap.setView([36.7656, 139.4937], 12, { animate: false }));
await page.waitForTimeout(1500);
const z12 = await page.evaluate(() => ({ text: layerStatus.ciMapTochigi, failed: !!layerFailed.ciMapTochigi }));
ok(demReqs.length === 0, '★z12 では標高タイルを取りに行かない', demReqs.slice(0, 3));
ok(z12.text === '拡大すると表示（z13 から）' && !z12.failed, '★z12 では「拡大すると表示」', z12);
await page.evaluate(() => leafletMap.setView([36.7656, 139.4937], 14, { animate: false }));
await page.waitForTimeout(2500);
const z14 = await page.evaluate(() => layerStatus.ciMapTochigi || '');
ok(z14 !== '拡大すると表示（z13 から）', 'z13 以上に戻ると注記を消す', z14);

/* ============ 4. 範囲外（403） ============ */
async function freshLayerAt(mode, lat, lon) {
  demMode = mode;
  await page.evaluate(([lat, lon]) => {
    toggleOverlay('ciMapTochigi');              // 外す
    ciBlobCache.clear();
    clearLayerStatus('ciMapTochigi');
    leafletMap.setView([lat, lon], 15, { animate: false });
    toggleOverlay('ciMapTochigi');              // 入れ直す
  }, [lat, lon]);
  await page.waitForTimeout(5000);
  return page.evaluate(() => ({ text: layerStatus.ciMapTochigi, failed: !!layerFailed.ciMapTochigi }));
}
const all403 = await freshLayerAt('403', 36.70, 139.40);
ok(/表示なし/.test(all403.text || '') && !all403.failed, '★全部 403 なら「表示なし」（赤帯にしない）', all403);
const half = await freshLayerAt('half', 36.72, 139.42);
ok(/配信の範囲外/.test(half.text || '') && !half.failed, '★一部 403 なら「一部は配信の範囲外」（赤帯にしない）', half);

/* ============ 5. Worker が使えないときはメインで描く ============ */
demMode = 'cone';
const fb = await page.evaluate(async () => {
  ciBreakWorker();
  ciStats.worker = 0; ciStats.main = 0;
  toggleOverlay('ciMapTochigi'); ciBlobCache.clear(); clearLayerStatus('ciMapTochigi');
  leafletMap.setView([36.7656, 139.4937], 15, { animate: false });
  toggleOverlay('ciMapTochigi');
  await new Promise(r => setTimeout(r, 5000));
  return { ...ciStats };
});
const p2 = await shownPixels();
ok(fb.main > 0 && fb.worker === 0, '★Worker が使えなければメインで計算する', fb);
ok(p2.n > 0 && p2.colored === p2.n, 'メインでも色が付く', p2);

ok(errors.length === 0, 'ページで例外が出ない', errors);
await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
