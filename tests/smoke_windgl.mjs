/* 風の流れ（実験・WebGL）の PoC（v4.120.0・ADR-0013）。見ること:
 *   ①Canvas 版と**同じ場**を見て流れる（場の外に粒を置かない・取り直さない）
 *   ②**パンで止めない**・粒を撒き直さない（Canvas 版は movestart で止めて消す）
 *   ③ズーム（演出なし／演出つき）の後も流れ続ける・粒を世界座標で持ち替える
 *   ④**時刻を変えても一斉に撒き直さない**（古い場から新しい場へ按分）
 *   ⑤風向・速さが Canvas 版と揃う（正比例・同じ色の帯）
 *   ⑥WebGL が使えなければ Canvas 版で流す（黙って空にしない）
 *   ⑦層を切った・地図を閉じたら止める。計測表示を出す
 * ⚠ ここで FPS は見ない（ヘッドレスは SwiftShader＝GPU を CPU で真似るので実機の指標にならない）
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
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };
const pad = n => String(n).padStart(2, '0');
const hourKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    h.time.push(hourKey(new Date(start.getTime() + i * 3600e3)));
    h.temperature_2m.push(15); h.apparent_temperature.push(15); h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3); h.winddirection_10m.push(180);
    h.windgusts_10m.push(5); h.weathercode.push(1); h.cloudcover.push(30);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:30`); daily.sunset.push(`${ds}T17:40`);
  }
  return { hourly: h, daily, elevation: 500 };
}
/* 風の場の応答。気圧面の高さは**固定表と違う値**にしてある（冬の低い高度を想定）。
   固定表（850hPa=1,460m）で決めていたら当たらない値で答え合わせする */
const GH = { 925: 700, 900: 930, 850: 1400, 800: 1880, 700: 2950 };
const SPD = { '10m': 2, 925: 6, 900: 7, 850: 10, 800: 14, 700: 20 };
const DIR = { '10m': 180, 925: 250, 900: 260, 850: 270, 800: 280, 700: 290 };
let gsmFrom = Infinity;   // この時刻以降は 900/800 が null（GSM の期間）
function windResp(n, span) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (span === 'full' ? 3 : 1));
  const len = span === 'full' ? 264 : 96;
  const time = Array.from({ length: len }, (_, i) => hourKey(new Date(start.getTime() + i * 3600e3)));
  return Array.from({ length: n }, () => {
    const h = { time, wind_speed_10m: time.map(() => SPD['10m']), wind_direction_10m: time.map(() => DIR['10m']) };
    for (const p of [925, 900, 850, 800, 700]) {
      const gone = k => (p === 900 || p === 800) && new Date(time[k]).getTime() >= gsmFrom;
      h[`wind_speed_${p}hPa`] = time.map((_, k) => gone(k) ? null : SPD[p]);
      h[`wind_direction_${p}hPa`] = time.map((_, k) => gone(k) ? null : DIR[p]);
      h[`geopotential_height_${p}hPa`] = time.map((_, k) => gone(k) ? null : GH[p]);
    }
    return { elevation: 1000, hourly: h };   // モデル地形 1,000m
  });
}
// 地形表：基準標高はすべて 1,640m（850=1,400 と 800=1,880 のちょうど半分）
function terrainJson(zref = 1640) {
  const cells = {};
  for (let i = 100; i < 200; i++) for (let j = 100; j < 200; j++) cells[`${i},${j}`] = [zref, zref, zref + 300, zref - 300, 5000];
  return JSON.stringify({ version: 1, fields: ['p90s', 'p90', 'max', 'mean', 'n'], cells });
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => errors.push(e.message));
const windReqs = [];
const routeAll = route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('/data/terrain_ref.json')) return route.fulfill({ contentType: 'application/json', body: terrainJson() });
  if (url.includes('api.open-meteo.com')) {
    const u = new URL(url);
    if (u.searchParams.get('hourly').includes('geopotential_height_850hPa') && u.searchParams.get('cell_selection')) {
      windReqs.push(url);
      const n = u.searchParams.get('latitude').split(',').length;
      const span = u.searchParams.get('forecast_days') === '8' ? 'full' : 'near';
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(windResp(n, span)),
        headers: { 'access-control-allow-origin': '*' } });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  }
  return route.fulfill({ status: 404, body: '' });
};
await page.route('**/*', routeAll);
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);



await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); toggleOverlay('windFlowGL'); });
await page.waitForTimeout(2200);
// v4.141.0（ADR-0014）：計測表示は既定で切。設定（色・補正・高さ・粒・背景・計測表示）は「風の流れ」の行に出る
const set0 = await page.evaluate(() => ({ hud: !!document.getElementById('wind-hud') && !document.getElementById('wind-hud').classList.contains('hidden'),
  name: MAP_WEATHER.find(o => o.id === 'windFlowGL').name,
  ids: ['wind-hud-color', 'wind-hud-shelter', 'wind-hud-terrain', 'wind-sl-count', 'wind-sl-bg', 'wind-set-hud'].filter(id => document.querySelector('#layer-weather #' + id)).length,
  btnsInHud: !!document.querySelector('#wind-hud #wind-hud-color') }));
ok(!set0.hud && set0.name === '風の流れ' && set0.ids === 6 && !set0.btnsInHud, '★計測表示は既定で切・設定は「風の流れ」の行に', set0);
await page.evaluate(() => windGLSetHud(true));
const setHud = await page.evaluate(() => ({ on: !document.getElementById('wind-hud').classList.contains('hidden'), saved: windPref.get('hud') }));
ok(setHud.on && setHud.saved === 1, '★「計測表示」を入れると出る・端末に覚える', setHud);
const painted = () => page.evaluate(() => {
  const gl = windGL.gl, W = windGL.cv.width, H = windGL.cv.height;
  gl.bindFramebuffer(gl.FRAMEBUFFER, windGL.fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, windGL.tex[1 - windGL.cur], 0);
  const px = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  let n = 0; for (let k = 3; k < px.length; k += 4) if (px[k] > 20) n++;
  return n;
});
const snap = () => page.evaluate(() => {
  let off = 0, alive = 0;
  for (let i = 0; i < windGL.n; i++) {
    if (!(windGL.life[i] > 0)) continue;
    alive++;
    if (!glGridSample(windGL.grid, windGL.px[i], windGL.py[i])) off++;
  }
  return { ok: windGL.ok, running: windGL.running, n: windGL.n, alive, off, respawns: windGL.respawns,
    z0: windGL.grid && windGL.grid.z0, dpr: windGL.dpr, cvW: windGL.cv.width, cssW: parseFloat(windGL.cv.style.width),
    canvasRunning: windFlow.running, hud: !document.getElementById('wind-hud').classList.contains('hidden'),
    chips: document.querySelectorAll('.wind-modes').length,
    status: (document.querySelector('.layer-status[data-id="windFlowGL"]') || {}).textContent || '' };
});
// n コマ進むのを待つ（ヘッドレスは SwiftShader で遅いので時間では待たない）
const frames = n => page.evaluate(k => new Promise(r => {
  const f0 = windGL.frameNo || 0, t = setInterval(() => { if ((windGL.frameNo || 0) - f0 >= k) { clearInterval(t); r(); } }, 20);
}), n);
const a = await snap();
ok(a.ok === true && a.running, '★WebGL で流れている', a);
ok(a.n === 10000, '★粒の数の初期値（PC 10,000）', a.n);
ok(a.alive > a.n * 0.9, '粒のほとんどが場の中にいる', a);
ok(a.off === 0, '★★場の無い所を流れている粒が無い', a);
ok(!a.canvasRunning, 'Canvas 版は入れていないので流さない（別の層）', a);
ok(a.dpr <= 1.5 && a.cvW <= Math.ceil(a.cssW * 1.5) + 1, 'canvas の倍率は1.5で頭打ち（Canvas 版と同じ）', a);
ok(a.hud, '計測表示を出す', a);
ok(a.chips === 1 && /AUTO/.test(a.status), '風の流れの行に AUTO／層の切り替えと状態の文', a);
ok(await painted() > 2000, '★★尾のテクスチャに軌跡が描かれている');
ok(await page.evaluate(() => /WebGL/.test(document.getElementById('wind-hud-text').textContent)), '計測表示に WebGL の行');

// ⑤風向・速さ：偽データの AUTO は 270°/280° から＝東へ。速さは Canvas 版と同じ正比例
const dir = await page.evaluate(() => {
  let sx = 0, sy = 0;
  for (let i = 0; i < windGL.n; i++) {
    const o = i * 5; if (!(windGL.seg[o + 4] > 0)) continue;
    sx += windGL.seg[o + 2] - windGL.seg[o]; sy += windGL.seg[o + 3] - windGL.seg[o + 1];
  }
  return { sx, sy, speed: WIND_GL.SPEED_PX_S, canvas: WIND_FLOW.SPEED_PX * 30 };
});
ok(dir.sx > 0 && Math.abs(dir.sy) < Math.abs(dir.sx), '★★西から吹く風の粒は東（右）へ流れる', dir);
ok(dir.speed === dir.canvas, '★見た目の速さは Canvas 版（30コマ）と同じ・正比例', dir);
// ここから先は動きの検査。ヘッドレスの SwiftShader は遅いので粒を減らす（数の決め方は上で見た）
await page.evaluate(() => windGLScaleCount(0.1));
const speedCheck = await page.evaluate(() => {
  // 1秒ぶん進めたときの移動量（画面 px）＝ 風速 × SPEED_PX_S
  const v = glView(), g = windGL.grid;
  const i = windGL.life.findIndex(l => l > 0);
  glGridSample(g, windGL.px[i], windGL.py[i]);
  const ms = Math.hypot(glU, glV), k = WIND_GL.SPEED_PX_S / v.s;
  return { ms, px: Math.hypot(glU * k, glV * k) * v.s, expect: ms * WIND_GL.SPEED_PX_S };
});
ok(Math.abs(speedCheck.px - speedCheck.expect) < 1e-6, '速さは風速に正比例（ズームに依らない見た目の速さ）', speedCheck);

// ① Canvas 版も並べて入れても取り直さない（同じ場）
const nReq = windReqs.length;
await page.evaluate(async () => { toggleOverlay('windFlow'); await new Promise(r => setTimeout(r, 500)); });
const both = await snap();
ok(both.running && both.canvasRunning, '★★Canvas 版と実験を並べて流せる（比べるため）', both);
ok(windReqs.length === nReq, '★★並べても取り直さない（同じ取得・同じ場）', windReqs.length - nReq);
await page.waitForTimeout(1100);
ok(await page.evaluate(() => /Canvas/.test(document.getElementById('wind-hud-text').textContent)), '計測表示に Canvas の行（並べて比べる）');
await page.evaluate(() => toggleOverlay('windFlow'));

// ② パン：止めない・粒を撒き直さない（Canvas 版は movestart で止めて消していた）
const pan = await page.evaluate(() => new Promise(r => {
  const r0 = windGL.respawns, n = windGL.n;
  leafletMap.once('movestart', () => { r.running = windGL.running; });
  leafletMap.panBy([60, 0], { animate: false });
  setTimeout(() => r({ runningAtStart: r.running, running: windGL.running, respawned: windGL.respawns - r0, n }), 700);
}));
ok(pan.runningAtStart !== false && pan.running, '★★★パンで止めない（Canvas 版との違い）', pan);
ok(pan.respawned < pan.n * 0.6, '★★パンで粒を一斉に撒き直さない（画面の外へ出た分と寿命の分だけ）', pan);
// 演出つきのパンの途中でも流れている
const midPan = await page.evaluate(() => new Promise(r => {
  leafletMap.panBy([-120, 40], { animate: true, duration: 0.6 });
  setTimeout(() => r({ running: windGL.running, moving: leafletMap._panAnim && leafletMap._panAnim._inProgress }), 300);
}));
ok(midPan.running, '★★パンの途中も流れている', midPan);
await page.waitForTimeout(900);
await frames(3);
ok((await snap()).off === 0, 'パンの後も場の外に粒が無い');

// ③ ズーム（演出なし）：粒を世界座標で持ち替えて続ける
const zoom = await page.evaluate(() => new Promise(r => {
  const r0 = windGL.respawns, z0 = windGL.grid.z0;
  leafletMap.setZoom(10.6, { animate: false });
  setTimeout(() => r({ running: windGL.running, z0, z1: windGL.grid.z0, respawned: windGL.respawns - r0, n: windGL.n }), 900);
}));
ok(zoom.running && Math.abs(zoom.z1 - 10.6) < 1e-6 && zoom.z0 !== zoom.z1, '★★ズームしても流れ続け、基準ズームを持ち替える', zoom);
await frames(3);
ok((await snap()).off === 0, '★ズームの後も場の外に粒が無い（世界座標の持ち替えが合っている）');
// ズーム（演出つき）：演出の間は CSS に任せ、終わったら続ける
const zanim = await page.evaluate(() => new Promise(r => {
  let during = null;
  leafletMap.once('zoomanim', () => setTimeout(() => { during = { zooming: windGL.zooming, tf: windGL.cv.style.transform }; }, 0));
  leafletMap.setZoom(11.2, { animate: true });
  setTimeout(() => r({ during, zooming: windGL.zooming, running: windGL.running }), 1200);
}));
ok(zanim.during && zanim.during.zooming && /scale/.test(zanim.during.tf), '★ズームの演出の間は canvas を CSS で拡大縮小', zanim);
ok(!zanim.zooming && zanim.running, '★★ズームの演出が終わったら流れを続ける（撒き直して止めない）', zanim);
await frames(3);
ok((await snap()).off === 0, '演出つきズームの後も場の外に粒が無い');

// ④ 時刻：一斉に撒き直さない・古い場から新しい場へ按分
const tchg = await page.evaluate(() => new Promise(r => {
  const r0 = windGL.respawns, n = windGL.n, key0 = windGL.fieldKey;
  setMapTime(state.sliderIndex + 1);
  const mid = { crossfade: !!windGL.gridOld, key: windGL.fieldKey };
  setTimeout(() => r({ key0, mid, respawned: windGL.respawns - r0, n, after: !!windGL.gridOld, running: windGL.running }), 600);
}));
ok(tchg.mid.key !== tchg.key0 && tchg.mid.crossfade, '★★時刻を変えたら古い場から新しい場へ按分する', tchg);
ok(tchg.respawned < tchg.n * 0.5 && tchg.running, '★★★時刻を変えても一斉に撒き直さない', tchg);
ok(!tchg.after, '按分は時間が来たら終える', tchg);

// 粒の数を変える（計測用）
const cnt = await page.evaluate(() => { const n0 = windGL.n; windGLScaleCount(0.5); const a = windGL.n; windGLScaleCount(2); return { n0, a, b: windGL.n }; });
ok(cnt.a === cnt.n0 / 2 && cnt.b === cnt.n0, '計測表示で粒の数を半分・倍にできる', cnt);

// ⑦ 層を切ったら止める・地図を閉じたら止める
ok(await page.evaluate(() => { toggleOverlay('windFlowGL'); return !windGL.running && document.getElementById('wind-hud').classList.contains('hidden'); }), '★層を切ったら止める・計測表示を隠す');
await page.evaluate(() => toggleOverlay('windFlowGL'));
await page.waitForTimeout(600);
ok(await page.evaluate(() => windGL.running), '入れ直したら流れる');
ok(await page.evaluate(() => { closeMap(); return !windGL.running; }), '★★地図を閉じたら止める（電池）');
ok(!errors.length, 'ページ内で例外が出ていない', errors);

// iPhone 相当（指で触る端末＝pointer: coarse）では 8,000粒
const errors2 = [];
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, hasTouch: true, isMobile: true });
const p3 = await ctx.newPage();
p3.on('pageerror', e => errors2.push(e.message));
await p3.route('**/*', routeAll);
await p3.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await p3.goto('https://sotoki.test/');
await p3.waitForTimeout(1200);
await p3.evaluate(() => { openMap(); });
await p3.waitForTimeout(600);
await p3.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); toggleOverlay('windFlowGL'); });
await p3.waitForTimeout(2200);
ok(await p3.evaluate(() => windGL.n) === 8000, '★粒の数の初期値（iPhone 相当 8,000）');
await p3.evaluate(() => { toggleOverlay('windFlowGL'); closeMap(); });
await ctx.close();

const ctx2 = await browser.newContext({ viewport: { width: 390, height: 800 } });
const p4 = await ctx2.newPage();
p4.on('pageerror', e => errors2.push(e.message));
await p4.route('**/*', routeAll);
await p4.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' }));
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) { return /webgl/.test(type) ? null : orig.call(this, type, ...rest); };
});
await p4.goto('https://sotoki.test/');
await p4.waitForTimeout(1200);
await p4.evaluate(() => openMap());
await p4.waitForTimeout(600);
await p4.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); toggleOverlay('windFlowGL'); });
await p4.waitForTimeout(2200);
const fb = await p4.evaluate(() => ({ ok: windGL.ok, gl: windGL.running, canvas: windFlow.running,
  status: (document.querySelector('.layer-status[data-id="windFlowGL"]') || {}).textContent || '' }));
ok(fb.ok === false && !fb.gl && fb.canvas, '★★★WebGL が使えなければ Canvas 版で流す', fb);
ok(/WebGL が使えない/.test(fb.status) && /Canvas/.test(fb.status), '★使えないことを層の行で言う（黙って替えない）', fb);
ok(await p4.evaluate(() => { toggleOverlay('windFlowGL'); return !windFlow.running; }), '実験の層を切れば代わりの Canvas 版も止める');
await ctx2.close();
ok(!errors2.length, '（別の端末）ページ内で例外が出ていない', errors2);

// v4.141.0（ADR-0014）：前の版で Canvas 版の「風の流れ」を入れていた人は WebGL 版へ移す。色・補正・高さ・計測表示は端末に覚えた値で始まる
const ctx3 = await browser.newContext({ viewport: { width: 390, height: 800 } });
const p5 = await ctx3.newPage();
p5.on('pageerror', e => errors2.push(e.message));
await p5.route('**/*', routeAll);
await p5.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' }));
  localStorage.setItem('sotoki.map.overlays', JSON.stringify([{ id: 'windFlow', opacity: 0.7 }]));
  localStorage.setItem('windGL.color', '0'); localStorage.setItem('windGL.shelter', '1'); localStorage.setItem('windGL.terrain', '0'); localStorage.setItem('windGL.hud', '0');
});
await p5.goto('https://sotoki.test/');
await p5.waitForTimeout(1200);
await p5.evaluate(() => openMap());
await p5.waitForTimeout(600);
await p5.evaluate(() => leafletMap.setView([36.57, 137.65], 10, { animate: false }));
await p5.waitForTimeout(2200);
const mig = await p5.evaluate(() => ({ gl: isOverlayOn('windFlowGL'), cv: isOverlayOn('windFlow'), op: overlayOpacity('windFlowGL'),
  running: windGL.running, canvas: windFlow.running, color: windGL.colorMode, shelter: windGL.shelterOn, terrain: windGL.terrainOn,
  hud: !!document.getElementById('wind-hud') && !document.getElementById('wind-hud').classList.contains('hidden'),
  chip: (document.getElementById('wind-hud-color') || {}).textContent }));
ok(mig.gl && !mig.cv && Math.abs(mig.op - 0.7) < 1e-9 && mig.running && !mig.canvas, '★★Canvas 版を入れていた人は WebGL 版の「風の流れ」へ移す（透過率も引き継ぐ）', mig);
ok(mig.color === 'particle' && mig.shelter === true && mig.terrain === false && !mig.hud && mig.chip === '色:粒', '★色・補正・高さ・計測表示は端末に覚えた値で始まる', mig);
await ctx3.close();

await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WINDGL SMOKE FAILED');
  process.exit(1);
}
console.log('WINDGL SMOKE PASSED');
