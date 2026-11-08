/* CS立体図風（全国）（v4.176.0・ADR-0018）。地理院の標高タイル（DEM5A／DEM10B）から曲率と傾斜を端末で計算して描く。
 *
 * ⚠⚠ Worker が黙ってメインに落ちても絵は同じに出る → csStats で経路を数える。Worker とメインで同じ画素か確かめる。
 * ⚠⚠ 源の選び方：DEM5A の9枚のうち1枚でも 404 なら9枚とも DEM10B。通信の失敗（504）では落とさない。
 *    ただし「DEM5A が無い」と記録した鍵があれば（30日以内）圏外でも DEM10B で描く。圏内ではいつも DEM5A を取りに行く。
 * ⚠ z15 で DEM10B なら z14 の親を1回計算して4枚の子で切り出す。
 * ⚠ 出典「地理院タイル（標高タイル）を加工して作成」は出典欄に1回だけ。
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

/* ---- 作り物の標高タイル（円錐の山・地理院の符号化 0.01m） ---- */
const gen = await ctx.newPage();
await gen.setContent('<canvas id="c" width="256" height="256"></canvas>');
const PEAK = { lat: 36.9, lon: 139.2 };
const pngCache = new Map();
async function demPng(z, x, y, gap = false) {
  const key = `${z}/${x}/${y}/${gap}`;
  if (pngCache.has(key)) return pngCache.get(key);
  const buf = Buffer.from(await gen.evaluate(({ z, x, y, PEAK, gap }) => {
    const c = document.getElementById('c'), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
    const n = 2 ** z, R = 6378137;
    const mx = lon => (lon + 180) / 360 * n * 256;
    const my = lat => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n * 256; };
    const px0 = mx(PEAK.lon), py0 = my(PEAK.lat);
    const mPerPx = 2 * Math.PI * R * Math.cos(PEAK.lat * Math.PI / 180) / (n * 256);
    for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
      const dist = Math.hypot(x * 256 + i - px0, y * 256 + j - py0) * mPerPx;
      const v = Math.round((2400 - dist * 0.4) * 100), k = (j * 256 + i) * 4;
      d[k] = (v >> 16) & 255; d[k + 1] = (v >> 8) & 255; d[k + 2] = v & 255; d[k + 3] = 255;
      if (gap && i === 128 && j === 128) { d[k] = 128; d[k + 1] = 0; d[k + 2] = 0; }   // 画素の欠け（2^23）
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, { z, x, y, PEAK, gap }), 'base64');
  pngCache.set(key, buf);
  return buf;
}

const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const reqs = [];   // { src, z, x, y }
/* mode5a：'ok' | 'hole'（holeX の列だけ 404）| 'none'（全部 404）| 'off'（504＝圏外）
   mode10b：'ok' | 'off'
   mode1a：'ok' | 'hole'（holeX1a の列だけ 404）| 'none' | 'off' | 'gap'（中心の1枚に画素の欠け） */
let mode5a = 'ok', mode10b = 'ok', holeX = -1, mode1a = 'none', holeX1a = -1, gapAt = '';
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  const m = url.match(/xyz\/(dem5a_png|dem_png|dem1a_png)\/(\d+)\/(\d+)\/(\d+)\.png/);
  if (m) {
    const src = m[1] === 'dem5a_png' ? '5a' : m[1] === 'dem1a_png' ? '1a' : '10b', [z, x, y] = m.slice(2).map(Number);
    reqs.push({ src, z, x, y });
    if (src === '1a') {
      if (mode1a === 'off') return route.fulfill({ status: 504, body: '' });
      if (mode1a === 'none' || (mode1a === 'hole' && x === holeX1a)) return route.fulfill({ status: 404, body: '' });
      return route.fulfill({ contentType: 'image/png', body: await demPng(z, x, y, mode1a === 'gap' && `${z}/${x}/${y}` === gapAt), headers: { 'Access-Control-Allow-Origin': '*' } });
    }
    const mode = src === '5a' ? mode5a : mode10b;
    if (mode === 'off') return route.fulfill({ status: 504, body: '' });
    if (mode === 'bad') return route.fulfill({ contentType: 'image/png', body: 'not a png', headers: { 'Access-Control-Allow-Origin': '*' } });
    if (mode === 'none' || (mode === 'hole' && x === holeX)) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: 'image/png', body: await demPng(z, x, y), headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.9, lon: 139.2, name: 'テスト' }));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(900);

/* ============ 1. 純関数 ============ */
const pure = await page.evaluate(() => {
  const out = {};
  // 地理院の符号化：0・1234.56・−5.12・欠け（2^23）
  const enc = h => { if (h === null) return [128, 0, 0]; let v = Math.round(h * 100); if (v < 0) v += 16777216; return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
  const hs = [0, 1234.56, -5.12, null], d = new Uint8ClampedArray(16);
  hs.forEach((h, i) => { const c = enc(h); d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255; });
  const dec = decodeGsiDem(d, 2);
  out.dec = [dec[0], Math.round(dec[1] * 100) / 100, Math.round(dec[2] * 100) / 100, Number.isNaN(dec[3])];
  const allMiss = new Uint8ClampedArray(16); for (let i = 0; i < 4; i++) allMiss[i * 4] = 128;
  out.allMissing = decodeGsiDem(allMiss, 2) === null;
  // 人工の地形
  const n = 256, px = 5, M = csMargin(px, CS_PRM), W = n + 2 * M;
  const make = f => { const g = new Float32Array(W * W); for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) g[y * W + x] = f(x - W / 2, y - W / 2); return g; };
  const at = (pix, x, y) => { const j = (y * n + x) * 4; return [pix[j], pix[j + 1], pix[j + 2], pix[j + 3]]; };
  // 尖った円錐・すり鉢は中心のそばで曲率が大きい
  out.cone = at(computeCsTile(make((x, y) => 1000 - Math.hypot(x, y) * px * 0.3), M, px, CS_PRM), 131, 128);
  out.bowl = at(computeCsTile(make((x, y) => 1000 + Math.hypot(x, y) * px * 0.3), M, px, CS_PRM), 131, 128);
  out.gentle = at(computeCsTile(make((x, y) => 1000 + x * px * 0.1), M, px, CS_PRM), 60, 60);
  out.steep = at(computeCsTile(make((x, y) => 1000 + x * px * 1.5), M, px, CS_PRM), 60, 60);
  const holed = make(() => 1000); holed[(M + 50) * W + (M + 50)] = NaN;
  out.hole = at(computeCsTile(holed, M, px, CS_PRM), 50, 50)[3];
  // 親の4分の1の切り出し：左上・右上・左下・右下を別の色に
  const q = new Uint8ClampedArray(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const j = (y * n + x) * 4, k = (y >= 128 ? 2 : 0) + (x >= 128 ? 1 : 0); q[j] = [10, 80, 160, 240][k]; q[j + 3] = 255; }
  const tr = csCropPart(q, 2, 1, 0), bl = csCropPart(q, 2, 0, 1);
  out.crop = [tr[(128 * n + 128) * 4], bl[(128 * n + 128) * 4]];
  const c16a = csCropPart(q, 4, 0, 3), c16b = csCropPart(q, 4, 3, 2);   // 左下・右下の象限の中
  out.crop16 = [c16a[(128 * n + 128) * 4], c16b[(128 * n + 128) * 4]];
  const W1 = { ...CS_PRM_1M }, M1 = csMargin(1, W1), Wd = n + 2 * M1;
  const flat1 = new Float32Array(Wd * Wd).fill(1000), gap1 = flat1.slice(); gap1[3] = NaN;   // 余白の隅の1点だけ欠け
  out.whole = computeCsTile(gap1, M1, 1, W1);
  out.wholeOk = computeCsTile(flat1, M1, 1, W1) ? 'pix' : null;
  out.holeNoWhole = computeCsTile(gap1, M1, 1, CS_PRM) ? 'pix' : null;
  return out;
});
ok(JSON.stringify(pure.dec) === JSON.stringify([0, 1234.56, -5.12, true]), '★★地理院の標高の復号（0.01m・負の標高・2^23 は欠け）', pure.dec);
ok(pure.allMissing, '全部欠けたタイルは null', pure);
ok(pure.cone[0] > pure.cone[2] + 60, '★★円錐（凸・尾根）は赤系', pure.cone);
ok(pure.bowl[2] > pure.bowl[0] + 60, '★★すり鉢（凹・谷）は青系', pure.bowl);
ok(pure.steep[0] < pure.gentle[0] - 40 && Math.abs(pure.gentle[0] - pure.gentle[2]) < 10, '★急な斜面ほど暗い（平らな面は灰）', [pure.gentle, pure.steep]);
ok(pure.hole === 0, '欠けの升目は透明', pure.hole);
ok(pure.crop[0] === 80 && pure.crop[1] === 160, '★z15 の子は親（z14）の自分の4分の1を切り出す（右上・左下）', pure.crop);
ok(pure.crop16[0] === 160 && pure.crop16[1] === 240, '★z17 は z15 の 16分の1（qx・qy は 0〜3）を切り出す', pure.crop16);
ok(pure.whole === null && pure.wholeOk !== null && pure.holeNoWhole !== null, '★★1m 用（whole）は格子に欠けが1つでもあれば null・欠けが無ければ描く・whole でなければ従来どおり', pure);

/* ============ 2. 地図で入れる（DEM5A・Worker の経路） ============ */
async function shown() {
  return page.evaluate(() => {
    const layer = overlayTileLayers.csLike;
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
await page.evaluate(() => { leafletMap.setView([36.9, 139.2], 15, { animate: false }); toggleOverlay('csLike'); });
await page.waitForTimeout(4000);
const s1 = await page.evaluate(() => ({ worker: csStats.worker, main: csStats.main, src5a: csStats.src5a, src10b: csStats.src10b, ci: { ...ciStats } }));
const p1 = await shown();
ok(s1.worker > 0 && s1.main === 0 && s1.src5a > 0 && s1.src10b === 0, '★★★DEM5A を Worker で計算している', s1);
ok(s1.ci.worker === 0 && s1.ci.main === 0, 'CIマップの計数には入れない', s1.ci);
ok(p1.n > 0 && p1.colored === p1.n, '★タイルに色が付く', p1);
// ⚠ dem_png z14 は地点の標高（readDemElevation）が別に読むので、DEM5A の取得だけを見る
const r5 = reqs.filter(r => r.src === '5a');
ok(r5.length > 0 && r5.every(r => r.z === 15), 'z15 では DEM5A の z15 を取りに行く', r5.slice(0, 3));
const panel = await page.evaluate(() => { renderLayerPanel(); return !!document.getElementById('cs-stats'); });
ok(!panel, '試作の計測は行の下に出さない（#231 で測り終えた）', panel);
const times = await page.evaluate(() => ({ f: csStats.fetch.length, d: csStats.decode.length, c: csStats.compute.length }));
ok(times.f > 0 && times.d > 0 && times.c > 0, '取得・復号・計算の時間は数えている（検査用）', times);

/* Worker とメインで同じ画素 */
const same = await page.evaluate(async () => {
  const layer = overlayTileLayers.csLike;
  const k = Object.keys(layer._tiles).find(k => layer._tiles[k].loaded);
  const t = layer._tiles[k], c = t.coords;
  const a = t.el.getContext('2d').getImageData(0, 0, 256, 256).data;
  const g = await csGather('gsi5a', c.z, c.x, c.y);
  const job = { id: -1, cancelled: false, keys: g.keys, blobs: g.blobs, px: ciMetersPerPx(c.z, c.y, 256), prm: CS_PRM, dec: 'gsi', alg: 'cs', stats: { main: 0 } };
  const raw = await ciComputeMain(job);
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  cv.getContext('2d').putImageData(new ImageData(raw, 256, 256), 0, 0);
  const b = cv.getContext('2d').getImageData(0, 0, 256, 256).data;
  let diff = 0; for (let i = 0; i < a.length; i++) diff = Math.max(diff, Math.abs(a[i] - b[i]));
  return { diff };
});
ok(same.diff === 0, '★★Worker とメインで同じ画素', same);

/* 出典は1回だけ */
const attr = await page.evaluate(() => document.getElementById('map-attribution').textContent);
ok(attr.split('地理院タイル（標高タイル）を加工して作成').length === 2, '★出典「地理院タイル（標高タイル）を加工して作成」は1回だけ', attr);
const blend = await page.evaluate(() => isBlendable(findOverlay('csLike')));
ok(blend, '重ね方（乗算・スクリーン）を選べる', blend);

/* ============ 3. ズーム ============ */
reqs.length = 0;
await page.evaluate(() => leafletMap.setView([36.9, 139.2], 11, { animate: false }));
await page.waitForTimeout(1500);
const z11 = await page.evaluate(() => ({ text: layerStatus.csLike, failed: !!layerFailed.csLike }));
ok(reqs.length === 0, '★z11 では標高タイルを取りに行かない', reqs.slice(0, 3));
ok(z11.text === '拡大すると表示（z12 から）' && !z11.failed, '★z11 では「拡大すると表示（z12 から）」', z11);
await page.evaluate(() => leafletMap.setView([36.9, 139.2], 12, { animate: false }));
await page.waitForTimeout(2500);
const z12 = await page.evaluate(() => layerStatus.csLike || '');
ok(z12 !== '拡大すると表示（z12 から）', 'z12 に戻ると注記を消す', z12);
reqs.length = 0; mode1a = 'ok';
await page.evaluate(() => { ciBlobCache.clear(); csStats.src1a = 0; leafletMap.setView([36.9, 139.2], 17, { animate: false }); });
await page.waitForTimeout(3500);
const z17 = await page.evaluate(() => ({ src1a: csStats.src1a, main: csStats.main }));
const p17 = await shown();
ok(reqs.some(r => r.src === '1a') && reqs.filter(r => r.src === '1a').every(r => r.z === 17), '★★z17 では DEM1A の z17 を取りに行く', reqs.filter(r => r.src === '1a').slice(0, 3));
ok(z17.src1a > 0 && z17.main === 0 && p17.n > 0 && p17.colored === p17.n, '★★z17 は DEM1A を Worker で計算して描く', { z17, p17 });
ok(!reqs.some(r => r.src === '5a' && r.z > 15), 'DEM5A は z15 より上を取りに行かない', reqs.filter(r => r.src === '5a').slice(0, 3));
reqs.length = 0;
await page.evaluate(() => { ciBlobCache.clear(); leafletMap.setView([36.9, 139.2], 15, { animate: false }); });
await page.waitForTimeout(2500);
ok(!reqs.some(r => r.src === '1a'), '★z15 以下では DEM1A を取りに行かない', reqs.filter(r => r.src === '1a').slice(0, 3));
mode1a = 'none';

/* ============ 4. 源の選び方（csRenderTile を直接） ============ */
// 4枚の子（z15）が共有する z14 の親と、その周り
const T = await page.evaluate(() => {
  const n = 2 ** 15, x = Math.floor((139.2 + 180) / 360 * n), r = 36.9 * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
  return { x: x & ~1, y: y & ~1 };
});
async function render(list) {
  return page.evaluate(async list => {
    const out = [];
    for (const c of list) {
      try { const pix = await csRenderTile(c, { id: ++ciSeq, cancelled: false }); out.push(pix === null ? 'null' : pix ? 'pix' : 'undef'); }
      catch (e) { out.push('err:' + e.message); }
    }
    return out;
  }, list);
}
const reset = () => page.evaluate(() => { ciBlobCache.clear(); csParentCache.clear(); csZ15Cache.clear(); localStorage.removeItem('demMiss5a'); localStorage.removeItem('demMiss1a'); for (const k of ['src5a', 'src10b', 'src1a']) csStats[k] = 0; });

// 4a. 周りの1枚だけ DEM5A が 404 → 9枚とも DEM10B。z15 なら z14 の親を1回だけ計算し、4枚の子で使う
await reset(); reqs.length = 0; mode5a = 'hole'; mode10b = 'ok'; holeX = T.x + 2;   // 子 (T.x+1) の右隣の列が 404
const kids = [{ z: 15, x: T.x, y: T.y }, { z: 15, x: T.x + 1, y: T.y }, { z: 15, x: T.x, y: T.y + 1 }, { z: 15, x: T.x + 1, y: T.y + 1 }];
const r4a = await render([kids[1]]);
const after1 = await page.evaluate(() => ({ src10b: csStats.src10b, miss: Object.keys(JSON.parse(localStorage.getItem('demMiss5a') || '{}')) }));
ok(r4a[0] === 'pix' && after1.src10b === 1, '★★周りの1枚が 404 なら DEM10B で描く', { r4a, after1 });
ok(after1.miss.length === 3 && after1.miss.every(k => k.startsWith('gsi5a/15/' + (T.x + 2) + '/')), '★404 だった鍵をすべて記録する（その列の3枚）', after1.miss);
ok(reqs.filter(r => r.src === '10b').every(r => r.z === 14), 'z15 の DEM10B は z14 を取りに行く', reqs.filter(r => r.src === '10b').slice(0, 3));
holeX = -1; mode5a = 'none';
const r4b = await render(kids);
const after2 = await page.evaluate(() => csStats.src10b);
ok(r4b.every(v => v === 'pix') && after2 === 1, '★★4枚の子は z14 の親の計算を1回だけ使う', { r4b, after2 });

// 4b. 圏外（DEM5A は 504）：記録のある所は DEM10B（控えにある）で描ける
await page.evaluate(() => { ciBlobCache.clear(); csParentCache.clear(); });
mode5a = 'off'; mode10b = 'ok';
const r4c = await render([kids[1]]);
ok(r4c[0] === 'pix', '★★★圏外でも、DEM5A が無いと記録した所は DEM10B で描ける', r4c);
// 記録の無い所は失敗（10B に落とさない）
const far = { z: 15, x: T.x + 40, y: T.y + 40 };
const r4d = await render([far]);
ok(/^err:/.test(r4d[0]), '★★記録の無い所で 504 なら失敗（DEM10B に落とさない）', r4d);
// 31日前の記録は使わない
await page.evaluate(k => { const o = JSON.parse(localStorage.getItem('demMiss5a')); for (const key of Object.keys(o)) o[key] = Date.now() - 31 * 86400000; localStorage.setItem('demMiss5a', JSON.stringify(o)); ciBlobCache.clear(); csParentCache.clear(); }, null);
const r4e = await render([kids[1]]);
ok(/^err:/.test(r4e[0]), '★30日を過ぎた記録は使わない', r4e);

// 4c. 圏内では記録があっても DEM5A を取りに行く
await reset(); mode5a = 'none'; await render([kids[0]]);
await page.evaluate(() => { ciBlobCache.clear(); csParentCache.clear(); });
reqs.length = 0; mode5a = 'ok';
const r4f = await render([kids[0]]);
const s4f = await page.evaluate(() => csStats.src5a);
ok(r4f[0] === 'pix' && reqs.some(r => r.src === '5a') && s4f === 1, '★★記録があっても圏内では DEM5A を取りに行き、あれば DEM5A で描く', { r4f, s4f, n: reqs.length });

// 4d. 両方無い → null（範囲外）
await reset(); mode5a = 'none'; mode10b = 'off';
const r4g = await render([{ z: 13, x: T.x >> 2, y: T.y >> 2 }]);
ok(/^err:/.test(r4g[0]), 'DEM10B も通信できなければ失敗', r4g);

// 4e. 海の上など両方とも配信が無い（404）：赤い失敗にしない
await reset(); mode5a = 'none'; mode10b = 'none';
await page.evaluate(() => { toggleOverlay('csLike'); clearLayerStatus('csLike'); leafletMap.setView([36.9, 139.2], 14, { animate: false }); toggleOverlay('csLike'); });
await page.waitForTimeout(4000);
const sea = await page.evaluate(() => ({ text: layerStatus.csLike, failed: !!layerFailed.csLike }));
ok(/表示なし/.test(sea.text || '') && !sea.failed, '★配信の無い範囲は「表示なし」（赤い失敗にしない）', sea);
// 4f. 圏外（両方 504・記録なし）：「表示なし」にせず、失敗として出す
await reset(); mode5a = 'off'; mode10b = 'off';
await page.evaluate(() => { toggleOverlay('csLike'); clearLayerStatus('csLike'); leafletMap.setView([36.95, 139.25], 14, { animate: false }); toggleOverlay('csLike'); });
await page.waitForTimeout(4000);
const off = await page.evaluate(() => ({ text: layerStatus.csLike, failed: !!layerFailed.csLike }));
ok(off.failed && !/表示なし|範囲外/.test(off.text || ''), '★★圏外（504）は「表示なし」と取り違えず、失敗として出す', off);
// 4g. 壊れたタイル（復号の失敗）は通信の失敗の印を付けない
await reset(); mode5a = 'bad'; mode10b = 'bad';
const r4h = await page.evaluate(async c => { try { await csRenderTile(c, { id: ++ciSeq, cancelled: false }); return 'ok'; } catch (e) { return e.network ? 'network' : 'other'; } }, { z: 14, x: T.x >> 1, y: T.y >> 1 });
ok(r4h === 'other', '壊れたタイルの失敗は「通信できない」にしない', r4h);

/* ============ 5. z16〜17 の 1m（ADR-0020） ============ */
// z17 の子：z15 の T（偶数の x, y）の中の (1, 2) 番目。z16 の子：(1, 0) 番目
const K17 = { z: 17, x: T.x * 4 + 1, y: T.y * 4 + 2 }, K16 = { z: 16, x: T.x * 2 + 1, y: T.y * 2 };
// z15 を引き伸ばした画素（比べる基準）と、csRenderTile の結果の差
async function vsStretch(c) {
  return page.evaluate(async c => {
    const pix = await csRenderTile(c, { id: ++ciSeq, cancelled: false });
    if (!pix) return { pix: String(pix) };
    const sh = c.z - 15, k = 1 << sh, p15 = await csRenderTile({ z: 15, x: c.x >> sh, y: c.y >> sh }, { id: ++ciSeq, cancelled: false });
    const ref = csCropPart(p15, k, c.x & (k - 1), c.y & (k - 1));
    let diff = 0; for (let i = 0; i < pix.length; i++) diff = Math.max(diff, Math.abs(pix[i] - ref[i]));
    return { pix: 'pix', diff };
  }, c);
}
const n1a = () => reqs.filter(r => r.src === '1a').length;
// 5a. 9枚とも 1A：1m で計算（z15 の引き伸ばしと違う画素）
await reset(); mode5a = 'ok'; mode1a = 'ok'; reqs.length = 0;
const r5a = await vsStretch(K17);
const s5a = await page.evaluate(() => csStats.src1a);
ok(r5a.pix === 'pix' && r5a.diff > 0 && s5a === 1 && n1a() === 9, '★★★9枚とも DEM1A なら 1m で計算する（z17）', { r5a, s5a, n: n1a() });
await reset(); reqs.length = 0;
const r5b = await vsStretch(K16);
ok(r5b.pix === 'pix' && r5b.diff > 0 && reqs.filter(r => r.src === '1a').every(r => r.z === 16), '★★z16 は DEM1A の z16 で計算する', r5b);
// 5b. 周りの1枚が 404：z15 の引き伸ばし（今と同じ画素）・記録・次は取りに行かない
await reset(); mode1a = 'hole'; holeX1a = K17.x + 1; reqs.length = 0;
const r5c = await vsStretch(K17);
const miss1 = await page.evaluate(() => ({ m1: Object.keys(JSON.parse(localStorage.getItem('demMiss1a') || '{}')), m5: localStorage.getItem('demMiss5a'), s: csStats.src1a }));
ok(r5c.pix === 'pix' && r5c.diff === 0 && miss1.s === 0, '★★★1枚でも DEM1A が 404 なら z15 の引き伸ばし（今と同じ画素）', { r5c, miss1 });
ok(miss1.m1.length === 3 && miss1.m1.every(k => k.startsWith(`gsi1a/17/${K17.x + 1}/`)) && !miss1.m5, '★404 だった 1A の鍵を demMiss1a に記録する（demMiss5a とは別）', miss1);
await page.evaluate(() => { ciBlobCache.clear(); csZ15Cache.clear(); });
reqs.length = 0; mode1a = 'ok';
const r5d = await vsStretch(K17);
ok(r5d.diff === 0 && n1a() === 0, '★★記録のある9枚は、圏内でも DEM1A を取りに行かない', { r5d, n: n1a() });
await page.evaluate(() => { const o = JSON.parse(localStorage.getItem('demMiss1a')); for (const k of Object.keys(o)) o[k] = Date.now() - 31 * 86400000; localStorage.setItem('demMiss1a', JSON.stringify(o)); ciBlobCache.clear(); csZ15Cache.clear(); });
reqs.length = 0;
const r5e = await vsStretch(K17);
ok(r5e.diff > 0 && n1a() === 9, '★30日を過ぎた記録は使わない（取り直して 1m）', { r5e, n: n1a() });
// 5c. 通信の失敗（504）：z15 の引き伸ばしで描ける（失敗にしない）・記録しない
await reset(); mode1a = 'off';
const r5f = await vsStretch(K17);
const miss2 = await page.evaluate(() => localStorage.getItem('demMiss1a'));
ok(r5f.pix === 'pix' && r5f.diff === 0 && !miss2, '★★★DEM1A が通信できなければ z15 の引き伸ばしで描く（記録しない）', { r5f, miss2 });
// z15 も通信できなければ失敗（今と同じ）
await reset(); mode1a = 'off'; mode5a = 'off';
const r5g = await render([K17]);
ok(/^err:/.test(r5g[0]), 'z15 も通信できなければ失敗（今と同じ）', r5g);
// 5d. 画素の欠け：z15 の引き伸ばし。⚠ Worker は復号した標高を鍵で覚えるので、まだ読んでいない所（G1・G2）で試す
const G1 = { z: 17, x: K17.x + 16, y: K17.y }, G2 = { z: 17, x: K17.x + 32, y: K17.y };
await reset(); mode5a = 'ok'; mode1a = 'gap'; gapAt = `17/${G1.x}/${G1.y - 1}`;   // 上の隣の中ほど（余白の外）
const r5h = await vsStretch(G1);
ok(r5h.pix === 'pix' && r5h.diff > 0, '計算に使わない所の欠けは 1m のまま', r5h);
await reset(); gapAt = `17/${G2.x}/${G2.y}`;   // 中心の1枚の中ほど
const r5i = await vsStretch(G2);
const s5i = await page.evaluate(() => ({ s: csStats.src1a, miss: localStorage.getItem('demMiss1a') }));
ok(r5i.pix === 'pix' && r5i.diff === 0 && s5i.s === 0, '★★★計算に使う範囲に画素の欠けがあれば z15 の引き伸ばし（1m の計数に入れない）', { r5i, s5i });
// 5e. z15 で 10B（DEM5A が無い）のときも、z16 の引き伸ばしは同じ z15 の結果（z14 の親の切り出し）
await reset(); mode5a = 'none'; mode10b = 'ok'; mode1a = 'none';
const r5j = await vsStretch(K16);
ok(r5j.pix === 'pix' && r5j.diff === 0, '★z15 が DEM10B の所でも z16 は z15 を引き伸ばす', r5j);
// 5f. 両方とも配信なし → null（範囲外）
await reset(); mode5a = 'none'; mode10b = 'none'; mode1a = 'none';
const r5k = await render([K17]);
ok(r5k[0] === 'null', '1A も z15 も配信なしなら「範囲外」', r5k);

/* ============ 6. 濃さのスライダー（v4.181.0） ============ */
const st = await page.evaluate(() => ({ a: csStrength(0.25), b: csStrength(0.5), c: csStrength(1), def: findOverlay('csLike').opacity }));
ok(st.a.opacity === 0.5 && st.a.filter === '' && st.b.opacity === 1 && st.b.filter === '', '★★濃さ 50% までは透過率 0〜100%（色はそのまま）', st);
ok(st.c.opacity === 1 && /saturate\(2\.2/.test(st.c.filter) && /contrast\(1\.5/.test(st.c.filter), '★★50% より上は不透明のまま色を濃く', st.c);
ok(st.def === 0.5, '既定は 50%（今までの 100% と同じ見え方）', st.def);
await reset(); mode5a = 'ok'; mode1a = 'none';
const live = await page.evaluate(() => {
  if (!isOverlayOn('csLike')) toggleOverlay('csLike');
  setOverlayOpacity('csLike', 0.9);
  const pane = leafletMap.getPane('mapOv_csLike'), a = { op: overlayTileLayers.csLike.options.opacity, f: pane.style.filter };
  setOverlayOpacity('csLike', 0.3);
  return { a, b: { op: overlayTileLayers.csLike.options.opacity, f: pane.style.filter } };
});
ok(live.a.op === 1 && /saturate/.test(live.a.f) && Math.abs(live.b.op - 0.6) < 1e-9 && !live.b.f, '★スライダーで透過率と色の濃さが変わる', live);
// レイヤーセットの呼び出し（applyOverlays で作り直す入口）でも濃さが効く
const viaSet = await page.evaluate(() => {
  setOverlayOpacity('csLike', 0.9);
  const cap = captureLayerSet();
  setOverlayOpacity('csLike', 0.3);
  saveLayerSets([...loadLayerSets(), Object.assign(cap, { id: 'tstr', name: '濃い' })]);
  applyLayerSet('tstr');
  return { op: overlayTileLayers.csLike && overlayTileLayers.csLike.options.opacity, f: leafletMap.getPane('mapOv_csLike').style.filter };
});
ok(viaSet.op === 1 && /saturate/.test(viaSet.f), '★セットを呼び出しても濃さ（フィルタ）が効く', viaSet);
// 移し替え：覚えていた 100% は 50% に（一度だけ）。セットの値も
const mig = await ctx.newPage(), migErrors = [];
mig.on('pageerror', e => migErrors.push(e.message));
await mig.route('**/*', r => {
  const u = r.request().url();
  if (u === 'https://sotoki.test/') return r.fulfill({ contentType: 'text/html', body: HTML });
  if (u.includes('uPlot.iife.min.js')) return r.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (u.includes('leaflet') && u.endsWith('.js')) return r.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  return r.fulfill({ status: 404, body: '' });
});
await mig.addInitScript(() => {
  if (sessionStorage.getItem('seeded')) return;
  sessionStorage.setItem('seeded', '1');
  localStorage.removeItem('sotoki.map.csStrength'); localStorage.removeItem('sotoki.map.csStrengthSets');
  localStorage.setItem('sotoki.map.overlays', JSON.stringify([{ id: 'csLike', opacity: 1 }, { id: 'hillshade', opacity: 0.8 }]));
  localStorage.setItem('sotoki.map.layerSets', JSON.stringify([{ id: 's1', name: 'A', base: null, overlays: [{ id: 'csLike', opacity: 0.8 }], blend: {} },
    { id: 's2', name: 'B', base: null, overlays: [{ id: 'csLike', opacity: 'こわれた' }], blend: {} }]));
});
await mig.goto('https://sotoki.test/'); await mig.waitForTimeout(600);
const m1 = await mig.evaluate(() => ({ cs: loadMapPrefs().overlays.find(o => o.id === 'csLike')?.opacity, other: loadMapPrefs().overlays.find(o => o.id !== 'csLike')?.opacity, sets: loadLayerSets().map(s => s.overlays[0]?.opacity) }));
await mig.reload(); await mig.waitForTimeout(600);
const m2 = await mig.evaluate(() => ({ cs: loadMapPrefs().overlays.find(o => o.id === 'csLike')?.opacity, sets: loadLayerSets().map(s => s.overlays[0]?.opacity) }));
ok(m1.cs === 0.5 && m2.cs === 0.5 && m1.other === 0.8, '★★★覚えていた CS立体図風の 100% は 50% に移し替える（二度目の起動で半分にしない）', { m1, m2 });
ok(m1.sets[0] === 0.4 && m2.sets[0] === 0.4, '★★セットに覚えた値も一度だけ半分にする', { m1, m2 });
ok(m1.sets[1] === 0.5 && m2.sets[1] === 0.5, '壊れた値は既定（50%）に戻し、半分にしない', { m1, m2 });
ok(migErrors.length === 0, '移し替えのページで例外が出ない', migErrors);
await mig.close();

ok(errors.length === 0, 'ページで例外が出ない', errors);
await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
