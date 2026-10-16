/* 風の当たり方（v4.177.0・docs/requirements_wind_exposure.md）。細かい地形 × 風向で、風上の地形の仰角 Sx を塗る。
 *
 * ⚠⚠ 向きの約束：風向は**吹いてくる向き**（北風＝0°）。風上＝その向きへ歩く。逆にすると陰と当たる側が入れ替わる。
 * ⚠⚠ 余白は DMAX ぶん要る（sxMargin）。csMargin（数 px）だとタイルの縁から DMAX の帯で風上が欠け、継ぎ目が出る。
 * ⚠ 粒子の遮蔽（terrainSx・30m）と式は同じ。同じ格子なら値もおおむね同じ。
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

/* ---- 作り物の標高タイル（東西に走る稜線・地理院の符号化 0.01m） ---- */
const gen = await ctx.newPage();
await gen.setContent('<canvas id="c" width="256" height="256"></canvas>');
const RIDGE_LAT = 36.9;
const pngCache = new Map();
async function demPng(z, x, y) {
  const key = `${z}/${x}/${y}`;
  if (pngCache.has(key)) return pngCache.get(key);
  const buf = Buffer.from(await gen.evaluate(({ z, x, y, RIDGE_LAT }) => {
    const c = document.getElementById('c'), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
    const n = 2 ** z, R = 6378137;
    const my = lat => { const s = Math.sin(lat * Math.PI / 180); return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n * 256; };
    const py0 = my(RIDGE_LAT), mPerPx = 2 * Math.PI * R * Math.cos(RIDGE_LAT * Math.PI / 180) / (n * 256);
    for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
      const dist = Math.abs(y * 256 + j - py0) * mPerPx;
      const v = Math.round(Math.max(1000, 1600 - dist * 0.5) * 100), k = (j * 256 + i) * 4;
      d[k] = (v >> 16) & 255; d[k + 1] = (v >> 8) & 255; d[k + 2] = v & 255; d[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png').split(',')[1];
  }, { z, x, y, RIDGE_LAT }), 'base64');
  pngCache.set(key, buf);
  return buf;
}

const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const reqs = [];
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  const m = url.match(/xyz\/(dem5a_png|dem_png)\/(\d+)\/(\d+)\/(\d+)\.png/);
  if (m) {
    const [z, x, y] = m.slice(2).map(Number);
    reqs.push({ src: m[1], z, x, y });
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
  const n = 256, px = 4, prm = (fromDeg, sigM = 5) => ({ tile: n, sigM, dmaxM: 300, fromDeg });
  const M = sxMargin(px, prm(0)), W = n + 2 * M;
  out.M = M;
  const make = f => { const g = new Float32Array(W * W); for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) g[y * W + x] = f(x - M, y - M); return g; };
  // 東西の稜線（タイルの y=128）。北＝y の小さい側
  const ridge = make((x, y) => 1600 - Math.abs(y - 128) * px * 0.5);
  const north = computeSxTile(ridge, M, px, prm(0)), south = computeSxTile(ridge, M, px, prm(180));
  out.nWind = { windward: north[100 * n + 128], lee: north[160 * n + 128], crest: north[128 * n + 128] };
  out.sWind = { windward: south[160 * n + 128], lee: south[100 * n + 128] };
  // 平地は 0
  out.flat = computeSxTile(make(() => 1000), M, px, prm(0))[128 * n + 128];
  // 欠け
  const holed = make(() => 1000); holed[(M + 50) * W + (M + 50)] = NaN;
  out.hole = Number.isNaN(computeSxTile(holed, M, px, prm(0, 0))[50 * n + 50]);
  // 縁：西風。平地に南北の壁（高さ 100m）がタイルの外（x=−40〜−20）にある。タイルの左の縁（x=2）は壁の陰（余白で風上を見ている）
  const wall = x => (x >= -40 && x <= -20 ? 1100 : 1000);
  const west = make(x => wall(x));
  const fW = computeSxTile(west, M, px, prm(270));
  out.edge = { x2: fW[128 * n + 2], x200: fW[128 * n + 200] };
  // 余白が足りない（csMargin）と縁で陰を見落とす（この検査が意味を持つことの確認）
  const Ms = csMargin(px, CS_PRM), Ws = n + 2 * Ms, small = new Float32Array(Ws * Ws);
  for (let y = 0; y < Ws; y++) for (let x = 0; x < Ws; x++) small[y * Ws + x] = wall(x - Ms);
  out.edgeSmall = computeSxTile(small, Ms, px, prm(270))[128 * n + 2];
  // terrainSx（粒子の遮蔽）と同じ式：ならし無しで同じ格子
  const G = { nx: W, ny: W, h: ridge, cell: px };
  const sxA = computeSxTile(ridge, M, px, prm(0, 0));
  out.vsTerrain = [[128, 100], [128, 160], [60, 140]].map(([x, y]) => {
    const a = sxA[y * n + x], b = terrainSx(G, x + M, y + M, 0, 1);   // 北風＝南へ吹く（東・南の成分 0, 1）
    return Math.abs(a - b);
  });
  // 色：当たる＝橙・陰＝青・平地は透明
  const col = sxColorize(new Float32Array([-15, 25, 0, NaN]), 2);
  out.col = Array.from(col);
  // 親の4分の1（数値で）：右上の象限は 7
  const q = new Float32Array(n * n);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) q[y * n + x] = (y >= 128 ? 2 : 0) + (x >= 128 ? 1 : 0) + 6;
  out.crop = [sxCropQuarter(q, 1, 0, n)[128 * n + 128], sxCropQuarter(q, 0, 1, n)[128 * n + 128]];
  return out;
});
ok(pure.M > 75 && pure.M <= 256, '★★余白は風上を見る距離ぶん（z15 相当で 75px 超）', pure.M);
ok(pure.nWind.windward < -10 && pure.nWind.lee > 10, '★★★北風：北の斜面（風上）が当たる（負）・南の斜面（風下）が陰（正）', pure.nWind);
ok(pure.sWind.windward < -10 && pure.sWind.lee > 10, '★★風向を変えると陰の側が入れ替わる', pure.sWind);
ok(Math.abs(pure.flat) < 0.5, '平地は 0 付近', pure.flat);
ok(pure.hole, '欠けの升目は NaN', pure.hole);
ok(pure.edge.x2 > 10 && Math.abs(pure.edge.x200) < 0.5, '★★タイルの縁でも風上まで見ている（タイルの外の壁の陰が縁に出る・遠くは 0）', pure.edge);
ok(!(pure.edgeSmall > 10), '（確認）余白が足りないと縁の陰を見落とす', pure.edgeSmall);
ok(pure.vsTerrain.every(d => d < 1.5), '★粒子の遮蔽（terrainSx）と同じ式（同じ格子なら差 1.5° 未満）', pure.vsTerrain);
ok(pure.col[0] > pure.col[2] && pure.col[3] > 200 && pure.col[6] > pure.col[4] && pure.col[7] > 200 && pure.col[11] === 0 && pure.col[15] === 0,
  '★当たる＝橙・陰＝青・平地と欠けは透明', pure.col);
ok(pure.crop[0] === 7 && pure.crop[1] === 8, 'z15 の子は親（z14）の自分の4分の1（数値で）', pure.crop);

/* ============ 2. 地図で入れる（手動の風向・Worker） ============ */
async function shown() {
  return page.evaluate(() => {
    const layer = overlayTileLayers.windExp;
    if (!layer) return { n: 0, colored: 0 };
    let colored = 0, n = 0;
    for (const k in layer._tiles) {
      const t = layer._tiles[k]; if (!t.loaded) continue; n++;
      const d = t.el.getContext('2d').getImageData(0, 0, 256, 256).data;
      for (let j = 3; j < d.length; j += 4 * 31) if (d[j] > 0) { colored++; break; }
    }
    return { n, colored };
  });
}
await page.evaluate(() => { openMap(); });
await page.waitForTimeout(500);
await page.evaluate(() => { setWindExpMode('0'); leafletMap.setView([36.9, 139.2], 15, { animate: false }); toggleOverlay('windExp'); });
await page.waitForTimeout(4000);
const s1 = await page.evaluate(() => ({ ...sxStats, cs: { ...csStats, fetch: 0, decode: 0, compute: 0 }, sector: windExp.sector, cache: sxCache.size }));
const p1 = await shown();
ok(s1.worker > 0 && s1.main === 0 && s1.src5a > 0, '★★★DEM5A を Worker で計算している', s1);
ok(s1.cs.worker === 0 && s1.cs.src5a === 0, 'CS立体図風の計数には入れない', s1.cs);
ok(s1.sector === 0 && p1.n > 0 && p1.colored > 0, '★北風（手動）でタイルに色が付く', { s1, p1 });
ok(reqs.some(r => r.src === 'dem5a_png' && r.z === 15), 'z15 では DEM5A の z15 を取りに行く', reqs.slice(0, 3));
const ui = await page.evaluate(() => {
  renderLayerPanel();
  return { sel: !!document.getElementById('windexp-dir'), info: (document.getElementById('windexp-info') || {}).textContent, blend: isBlendable(findOverlay('windExp')) };
});
ok(ui.sel && ui.info === '北の風（手動）', '★行の下に風向の選択と使っている風', ui);
ok(ui.blend, '重ね方（乗算・スクリーン）を選べる', ui);

/* Worker とメインで同じ値 */
const same = await page.evaluate(async () => {
  const layer = overlayTileLayers.windExp;
  const k = Object.keys(layer._tiles).find(k => layer._tiles[k].loaded);
  const c = layer._tiles[k].coords, g = await csGather('gsi5a', c.z, c.x, c.y);
  const prm = sxPrm(0, windExp.dmax);
  const viaWorker = sxCache.get(`gsi5a|${c.z}/${c.x}/${c.y}|0|${windExp.dmax}`);
  const job = { id: -1, cancelled: false, keys: g.keys, blobs: g.blobs, px: ciMetersPerPx(c.z, c.y, 256), prm, dec: 'gsi', alg: 'sx', stats: { main: 0 } };
  const raw = await ciComputeMain(job);
  let diff = 0, nan = 0;
  for (let i = 0; i < raw.length; i++) { if (raw[i] !== raw[i]) { nan++; continue; } diff = Math.max(diff, Math.abs(raw[i] - viaWorker[i])); }
  return { has: !!viaWorker, diff, nan };
});
ok(same.has && same.diff < 1e-4, '★★Worker とメインで同じ Sx', same);

/* 風向を変える → 描き直す。戻すと控えから（計算しない） */
const before = await page.evaluate(() => sxStats.worker);
await page.evaluate(() => setWindExpMode('8'));
await page.waitForTimeout(3000);
const after8 = await page.evaluate(() => ({ w: sxStats.worker, drawn: windExp.drawn }));
ok(after8.w > before && after8.drawn === `8|${300}`, '★風向を変えると描き直す', { before, after8 });
await page.evaluate(() => setWindExpMode('0'));
await page.waitForTimeout(2000);
const back = await page.evaluate(() => sxStats.worker);
ok(back === after8.w, '★戻した風向は控えから（計算し直さない）', { after8, back });

/* 見る距離 100m */
await page.evaluate(() => setWindExpDmax(100));
await page.waitForTimeout(3000);
const d100 = await page.evaluate(() => ({ drawn: windExp.drawn, saved: JSON.parse(localStorage.getItem('windExp')) }));
ok(d100.drawn === '0|100' && d100.saved.dmax === 100 && d100.saved.mode === 0, '★見る距離 100m に切り替え・端末に覚える', d100);

/* ============ 3. 自動の風向（選択地点の判定の風） ============ */
const auto = await page.evaluate(() => {
  const keep = { all: state.allData, idx: state.sliderIndex };
  const t = new Date(2026, 9, 16, 9);
  state.allData = [{ time: t, wdir: 312, wind: 12.3, windMissing: false }, { time: t, wdir: null, wind: null, windMissing: true }, { time: t, wdir: 45, wind: 1.2, windMissing: false }];
  state.sliderIndex = 0;
  setWindExpMode('auto');
  const r = [];
  r.push({ sector: windExp.sector, info: document.getElementById('windexp-info').textContent });
  state.sliderIndex = 1; sxSync();
  r.push({ sector: windExp.sector, info: document.getElementById('windexp-info').textContent });
  state.sliderIndex = 2; sxSync();
  r.push({ sector: windExp.sector, info: document.getElementById('windexp-info').textContent });
  state.allData = keep.all; state.sliderIndex = keep.idx;
  return r;
});
ok(auto[0].sector === 14 && /^北西の風 12\.3 m\/s（地点の予報・10\/16 09:00）$/.test(auto[0].info), '★★自動：判定の風の向き（312°→北西）を使い、出どころを出す', auto[0]);
ok(auto[1].sector === null && /風データなし/.test(auto[1].info), '★風が欠けた時刻は塗らず「風データなし」', auto[1]);
ok(auto[2].sector === 2 && /風が弱い/.test(auto[2].info), '風が弱いときは添える', auto[2]);

/* ============ 4. ズーム ============ */
reqs.length = 0;
await page.evaluate(() => { setWindExpMode('0'); leafletMap.setView([36.9, 139.2], 12, { animate: false }); });
await page.waitForTimeout(1500);
const z12 = await page.evaluate(() => ({ text: layerStatus.windExp, failed: !!layerFailed.windExp }));
ok(!reqs.some(r => r.src === 'dem5a_png'), '★z12 では標高タイルを取りに行かない', reqs.slice(0, 3));
ok(z12.text === '拡大すると表示（z13 から）' && !z12.failed, '★z12 では「拡大すると表示（z13 から）」', z12);

ok(errors.length === 0, 'ページで例外が出ない', errors);
await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
