/* 風の強さ（地形）（v4.178.0・docs/requirements_wind_downscale.md・ADR-0019）。WindNinja の倍率の表で、判定の風を地図の各点へ配る。
 *
 * ⚠⚠ 案A：その点の風 ＝ 判定の風 × 倍率(点) ÷ 倍率(基準の峰)。基準の峰の升では判定の風と一致する（丸めの範囲で）。
 * ⚠⚠ 表は 8方位（0〜157.5°）。逆向き（＋180°）は同じ表。157.5° と 180°（＝0°）の間も按分する。
 * ⚠ PNG の読み戻しは色空間の変換と乗算済みアルファを切る。正解は PIL で一度だけ読んだ値（CI に Python は無い）。
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
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const T_JSON = fs.readFileSync(path.join(ROOT, 'data/wind/tanigawa.json'), 'utf8');
const T_PNG = fs.readFileSync(path.join(ROOT, 'data/wind/tanigawa.png'));

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const reqs = [];
let tableStatus = 200;
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('/areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
  if (url.includes('/data/wind/')) {
    reqs.push(url.split('/data/wind/')[1]);
    if (tableStatus !== 200) return route.fulfill({ status: tableStatus, body: '' });
    if (url.endsWith('tanigawa.json')) return route.fulfill({ contentType: 'application/json', body: T_JSON });
    if (url.endsWith('tanigawa.png')) return route.fulfill({ contentType: 'image/png', body: T_PNG });
  }
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.85, lon: 138.9, name: 'テスト' }));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(900);

/* ============ 1. 表の読み戻し（PIL の値と一致） ============ */
const dec = await page.evaluate(async () => {
  const t = await wdLoadTable('tanigawa'), n = t.meta.nx * t.meta.ny, nx = t.meta.nx, ny = t.meta.ny;
  const at = (k, r, c) => [t.r[k * n + r * nx + c], t.a[k * n + r * nx + c]];
  let a0 = 0; for (let i = 0; i < t.a.length; i++) if (t.a[i] !== 255) a0++;
  return { len: t.r.length, nx, ny, a0, s: [at(0, 10, 10), at(3, 225, 225), at(5, 400, 77), at(7, 449, 449), at(2, 123, 321)],
    tani: [0, 1, 2, 3, 4, 5, 6, 7].map(k => t.r[k * n + 326 * nx + 361]) };
});
// PIL（data/wind/tanigawa.png・2026-10-17 生成）：[R, A]
ok(dec.len === 450 * 3600 && dec.a0 === 0, '表は 450×(450×8)・欠け無し', { len: dec.len, a0: dec.a0 });
ok(JSON.stringify(dec.s) === JSON.stringify([[61, 255], [65, 255], [30, 255], [13, 255], [53, 255]]), '★★PNG の R・A が PIL で読んだ値と一致（色空間の変換で R がずれない）', dec.s);
ok(JSON.stringify(dec.tani) === JSON.stringify([93, 120, 145, 156, 151, 130, 102, 83]), '★谷川岳の升の8方位の R が PIL と一致', dec.tani);

/* ============ 2. 純関数 ============ */
const pure = await page.evaluate(async () => {
  const out = {};
  out.w = [0, 11.25, 157.5, 168.75, 180, 200, 20, 350, -10].map(d => { const w = wdDirWeights(d); return [w.i0, w.i1, +w.t.toFixed(3)]; });
  const tables = await wdTablesFor();
  const tb = tables[0];
  out.peaks = tb.peaks.map(p => p.name);
  const T = new Date(2026, 9, 17, 9);
  const d = (o) => Object.assign({ time: T, wind: 15, wdir: 300, windMissing: false, windTrace: { kind: 'level' } }, o);
  // 谷川岳の真上：基準は谷川岳。その升の推定の風 ＝ 判定の風（丸めの範囲）
  const tani = tb.peaks.find(p => p.name === '谷川岳');
  const plan = wdPlan(tables, tani.lat, tani.lon, d({}), 1977);
  const cell = wdCell(tb.meta, tani.lat, tani.lon), n = tb.meta.nx * tb.meta.ny, i = cell.r * tb.meta.nx + cell.c;
  const rr = (tb.tbl.r[plan.w.i0 * n + i] * (1 - plan.w.t) + tb.tbl.r[plan.w.i1 * n + i] * plan.w.t) / tb.meta.encoding.rScale;
  out.ref = { name: plan.ref.name, cell, refR: plan.refR, est: 15 * rr / plan.refR, tol: 15 * (0.5 / 64 + 0.0005) / plan.refR };
  // 逆向き（120° と 300°）は同じ計画の倍率
  out.rev = [wdPlan(tables, tani.lat, tani.lon, d({ wdir: 120 }), 1977).refR, plan.refR];
  // 色：基準の峰の升は windBgRGB(判定の風) と同じ色
  const pix = wdPaint(tb.tbl, plan);
  out.color = { got: Array.from(pix.slice(i * 4, i * 4 + 4)), want: windBgRGB(out.ref.est) };
  // 塗らないとき
  out.outside = wdPlan(tables, 36.0, 139.9, d({}), 1000);
  out.missing = wdPlan(tables, tani.lat, tani.lon, d({ windMissing: true, wind: null, wdir: null }), 1977);
  out.ground = wdPlan(tables, tani.lat, tani.lon, d({ windTrace: { kind: 'ground', reason: 'low' } }), 1977);
  out.tmiss = wdPlan(tables, tani.lat, tani.lon, d({ windTrace: { kind: 'missing' } }), 1977);
  // 基準の峰の倍率が小さい・表に無い（作り物の表）
  const fake = (pr) => [{ id: 'x', meta: Object.assign({}, tb.meta, { peakRatio: { 谷川岳: pr } }), peaks: [tani], tbl: tb.tbl }];
  out.small = wdPlan(fake([0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]), tani.lat, tani.lon, d({}), 1977);
  out.nul = wdPlan(fake([1, 1, 1, 1, 1, 1, null, 1.4]), tani.lat, tani.lon, d({ wdir: 140 }), 1977);
  // 300m 以上低い（土合あたり）
  out.low = wdPlan(tables, 36.83, 138.97, d({}), 650);
  out.notLow = wdPlan(tables, tani.lat, tani.lon, d({}), 1900);
  out.lowText = wdInfoText(out.low);
  // 欠けの升（A=0）は透明
  const holed = { meta: tb.meta, r: tb.tbl.r, a: tb.tbl.a.slice() };
  holed.a[plan.w.i1 * n + i] = 0;
  out.hole = wdPaint(holed, plan)[i * 4 + 3];
  return out;
});
ok(JSON.stringify(pure.w) === JSON.stringify([[0, 1, 0], [0, 1, 0.5], [7, 0, 0], [7, 0, 0.5], [0, 1, 0], [0, 1, 0.889], [0, 1, 0.889], [7, 0, 0.556], [7, 0, 0.556]]),
  '★★方位の按分（逆向きは同じ・157.5〜180° は 7 と 0 の間・負の角度）', pure.w);
ok(JSON.stringify(pure.peaks) === JSON.stringify(['苗場山', '平標山', '谷川岳', '巻機山']), '表の範囲内の峰は areas.json の谷川4峰', pure.peaks);
ok(pure.ref.name === '谷川岳' && Math.abs(pure.ref.est - 15) <= pure.ref.tol, '★★★基準の峰の升で推定の風＝判定の風（丸めの範囲）', pure.ref);
ok(Math.abs(pure.rev[0] - pure.rev[1]) < 1e-9, '★逆向きの風は同じ倍率', pure.rev);
ok(pure.color.got[3] === 255 && pure.color.got.slice(0, 3).every((v, k) => v === pure.color.want[k]), '★色は風の流れの背景と同じ（同じ m/s が同じ色）', pure.color);
ok(!pure.outside.ok && /範囲外/.test(pure.outside.reason), '★範囲外は塗らず理由', pure.outside);
ok(!pure.missing.ok && /風データなし/.test(pure.missing.reason), '★風が欠けた時刻は塗らない', pure.missing);
ok(!pure.ground.ok && /地上10m/.test(pure.ground.reason), '★★地上10m風に落ちた時刻は塗らない', pure.ground);
ok(!pure.tmiss.ok, '風の出どころが欠けなら塗らない', pure.tmiss);
ok(!pure.small.ok && /小さすぎる/.test(pure.small.reason), '★基準の峰の倍率 0.3 未満は塗らない', pure.small);
ok(!pure.nul.ok && /表に無い/.test(pure.nul.reason), '★基準の峰の倍率が null の方位は塗らない（0 扱いで通さない）', pure.nul);
ok(pure.low.ok && pure.low.low && pure.low.ref.name === '谷川岳' && /峰より低い/.test(pure.lowText) && !pure.notLow.low, '★選択地点が峰より 300m 以上低いと注記（塗りは出す）', { low: pure.low.low, t: pure.lowText });
ok(pure.hole === 0, '★欠けの升は透明', pure.hole);

/* ============ 3. 地図で入れる ============ */
await page.evaluate(() => {
  const T = new Date(2026, 9, 17, 9);
  state.allData = [{ time: T, wind: 15, wdir: 300, windMissing: false, windTrace: { kind: 'level' } },
                   { time: T, wind: 8, wdir: 45, windMissing: false, windTrace: { kind: 'level' } },
                   { time: T, wind: 4, wdir: 0, windMissing: false, windTrace: { kind: 'ground', reason: 'low' } }];
  state.sliderIndex = 0; state.lat = 36.8371; state.lon = 138.9301; state.summitElev = 1977;
  openMap();
});
await page.waitForTimeout(500);
await page.evaluate(() => { leafletMap.setView([36.84, 138.93], 11, { animate: false }); toggleOverlay('windDown'); });
await page.waitForTimeout(1500);
const m1 = await page.evaluate(() => {
  renderLayerPanel();
  const l = overlayTileLayers.windDown;
  return { img: l instanceof L.ImageOverlay, url: l && l._url.slice(0, 22), pane: l && l.options.pane, info: (document.getElementById('winddown-info') || {}).textContent,
    blend: isBlendable(findOverlay('windDown')), attr: document.getElementById('map-attribution').textContent,
    time: !document.getElementById('map-time').classList.contains('hidden'), b: l && l.getBounds().toBBoxString() };
});
ok(m1.img && m1.url === 'data:image/png;base64,' && m1.pane === 'mapOv_windDown', '★★画像1枚で載る（自前の pane・L.tileLayer にしない）', m1);
ok(/^西北西の風 15\.0 m\/s を、谷川岳（0\.0 km）で一致させた推定$/.test(m1.info), '★行の下に使った風と基準の峰', m1.info);
ok(m1.blend, '重ね方を選べる', m1.blend);
ok(m1.attr.split('WindNinja（米国農務省林野局）で計算').length === 2 && m1.attr.includes('地理院タイル（標高タイル）を加工して作成'), '★出典：WindNinja と地理院の加工を1回ずつ', m1.attr);
ok(m1.time, '時刻の帯を出す（時刻で変わる）', m1.time);
ok(reqs.filter(r => r === 'tanigawa.png').length === 1, '表は1回だけ取る', reqs);

/* 時刻を変える → 塗り直す。地上10m風の時刻は消して理由 */
const urls = await page.evaluate(async () => {
  const u0 = overlayTileLayers.windDown._url;
  state.sliderIndex = 1; await wdSync();
  const u1 = overlayTileLayers.windDown._url, i1 = document.getElementById('winddown-info').textContent;
  state.sliderIndex = 2; await wdSync();
  const u2 = overlayTileLayers.windDown._url, i2 = document.getElementById('winddown-info').textContent;
  state.sliderIndex = 0; await wdSync();
  const back = overlayTileLayers.windDown._url === u0;
  // 塗る → 塗らない → 同じ塗るに戻る（同じ画素は同じ dataURL。空にしたあと貼り直されること）
  state.sliderIndex = 2; await wdSync();
  state.sliderIndex = 0; await wdSync();
  return { changed: u1 !== u0, i1, blank: u2 === WD_BLANK, i2, back, back2: overlayTileLayers.windDown._url === u0 };
});
ok(urls.changed && /^北東の風 8\.0/.test(urls.i1), '★時刻を変えると塗り直す', urls);
ok(urls.blank && /地上10m/.test(urls.i2), '★★地上10m風の時刻は消して理由', urls);
ok(urls.back, '戻すと同じ絵', urls.back);
ok(urls.back2, '★★塗らない時刻から同じ時刻に戻ると、また塗る（空のまま残らない）', urls);

/* 別の層を入れ外ししても残る（applyOverlays が作り直す） */
await page.evaluate(() => { toggleOverlay('windArrows'); });
await page.waitForTimeout(800);
await page.evaluate(() => { toggleOverlay('windArrows'); });
await page.waitForTimeout(800);
const kept = await page.evaluate(() => ({ url: overlayTileLayers.windDown && overlayTileLayers.windDown._url.slice(0, 22), on: leafletMap.hasLayer(overlayTileLayers.windDown) }));
ok(kept.on && kept.url === 'data:image/png;base64,', '★★別の層を入れ外ししても消えない', kept);

/* 範囲外へ移る → 塗らない */
const out = await page.evaluate(async () => {
  state.lat = 36.0; state.lon = 139.9; await wdSync();
  return { blank: overlayTileLayers.windDown._url === WD_BLANK, info: document.getElementById('winddown-info').textContent };
});
ok(out.blank && /範囲外/.test(out.info), '★範囲外の地点では塗らない', out);

/* 表が取れない → 理由を出す（黙って空にしない） */
const fail = await page.evaluate(async () => {
  toggleOverlay('windDown'); wdTables.clear(); wd.key = null; return true;
});
tableStatus = 404;
await page.evaluate(() => { state.lat = 36.8371; state.lon = 138.9301; toggleOverlay('windDown'); });
await page.waitForTimeout(1200);
const f = await page.evaluate(() => ({ status: layerStatus.windDown, info: wd.info }));
ok(fail && /表を読めません/.test(f.info) && /表を読めません/.test(f.status || ''), '★表が取れなければ理由を出す', f);
// 取れるようになったら、失敗の文言を消して塗る
tableStatus = 200;
const rec = await page.evaluate(async () => { await wdSync(); return { status: layerStatus.windDown || '', url: overlayTileLayers.windDown._url.slice(0, 22) }; });
ok(rec.status === '' && rec.url === 'data:image/png;base64,', '★失敗から戻ったら文言を消して塗る', rec);

ok(errors.length === 0, 'ページで例外が出ない', errors);
await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
