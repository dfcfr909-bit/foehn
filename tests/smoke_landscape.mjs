/* スマホの横向きのグラフ画面（v4.188.0）。
 * 横向き（高さ 500px 以下）では、グラフ画面を全幅にし、凡例・ボタン行・円柱を隠し、グラフを縦に送れるようにする。
 * それまでは #app が 480px の柱のまま中央に置かれ、844×390 ではチャートが約 130px に潰れていた（利用者の指摘）。
 *
 * ⚠⚠ 縦向きは何も変えない（既存の検査はみな縦向き）。縦へ戻したら送った位置を戻す。
 * ⚠⚠ #app の中に inset:0 で置いている画面（お気に入り・ランキング・天気図・座標）は 480px の柱のまま
 *    （v4.161.0：#app を広げると ✕ がノッチに潜る）。
 * ⚠ 1画面の時間は 48 時間（24 のままだと天気の記号・座布団が倍の大きさ）。
 * ⚠ 送ったあとも、選択情報の窓は見えている範囲に留める。
 * ⚠ iPad の横向き（高さ 500px 超）は今のまま。
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
function fakeWeather() {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  const time = Array.from({ length: 288 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600e3);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  });
  const f = fn => time.map((_, i) => fn(i));
  const h = { time, temperature_2m: f(i => -2 + 6 * Math.sin(i / 24 * 6.28)), apparent_temperature: f(i => -8 + 5 * Math.sin(i / 24 * 6.28)),
    precipitation: f(i => (i % 30 < 4 ? 1.2 : 0)), snowfall: f(i => (i % 30 < 4 ? 1 : 0)), surface_pressure: f(i => 780 + 4 * Math.sin(i / 40)),
    windspeed_10m: f(i => 6 + 4 * Math.sin(i / 17)), winddirection_10m: f(() => 270), windgusts_10m: f(() => 12),
    weathercode: f(i => (i % 30 < 4 ? 71 : 2)), cloudcover: f(i => 50 + 40 * Math.sin(i / 13)),
    cloud_cover_low: f(() => 30), cloud_cover_mid: f(() => 20), cloud_cover_high: f(() => 10) };
  const gh = { 925: 760, 900: 990, 850: 1460, 800: 1950, 700: 3010, 600: 4200 };
  for (const p of Object.keys(gh)) { h[`wind_speed_${p}hPa`] = f(i => 9 + 6 * Math.sin(i / 19)); h[`wind_direction_${p}hPa`] = f(() => 300); h[`geopotential_height_${p}hPa`] = f(() => gh[p]); }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T06:10`); daily.sunset.push(`${ds}T16:40`);
  }
  return { hourly: h, daily, elevation: 2400 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, timezoneId: 'Asia/Tokyo', hasTouch: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => d.dismiss().catch(() => {}));
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
});
await page.goto('https://sotoki.test/');
await page.waitForFunction(() => typeof chartsReady !== 'undefined' && chartsReady, null, { timeout: 15000 });
await page.waitForTimeout(500);

const look = () => page.evaluate(() => {
  const r = id => { const el = document.getElementById(id); const b = el.getBoundingClientRect(); return { w: Math.round(b.width), l: Math.round(b.left), h: Math.round(b.height) }; };
  const shown = id => getComputedStyle(document.getElementById(id)).display !== 'none';
  const outer = document.getElementById('charts-outer');
  return { app: r('app'), vw: innerWidth, wide: isWideGraph(), pph: pxPerHourVal, viewW,
    legend: shown('legend'), footer: shown('footer'), favbar: shown('fav-bar-slot'),
    outerH: outer.clientHeight, outerSH: outer.scrollHeight, st: outer.scrollTop, overflowY: getComputedStyle(outer).overflowY };
});

/* ---------- 1. 横向き（844×390） ---------- */
let L = await look();
ok(L.wide === true, '★横向き（高さ 500px 以下）を見分ける', L);
ok(L.app.w === 844 && L.app.l === 0, '★★グラフ画面を全幅にする（480px の柱にしない）', L.app);
ok(!L.legend && !L.footer && !L.favbar, '★★凡例・ボタン行・円柱を隠す', L);
ok(Math.abs(L.pph - (L.viewW - 68) / 48) < 0.01, '★1画面は 48 時間（記号を倍の大きさにしない）', { pph: L.pph, viewW: L.viewW });
ok(L.overflowY === 'auto' && L.outerSH > L.outerH + 50, '★★グラフを縦に送れる（パネルは潰さない）', L);

// 縦に送ったあと、選択情報の窓が見えている範囲にある（タップ・定位置・送った直後）
const pop = await page.evaluate(async () => {
  const outer = document.getElementById('charts-outer'), p = document.getElementById('scrub-popup');
  const inView = () => { const o = outer.getBoundingClientRect(), b = p.getBoundingClientRect();
    return b.top >= o.top - 1 && b.bottom <= o.bottom + 1; };
  const out = {};
  outer.scrollTop = 9999; await new Promise(r => setTimeout(r, 120));
  out.st = outer.scrollTop;
  out.afterScroll = inView();
  const o = outer.getBoundingClientRect();
  positionPopupAt(o.left + 300, o.top + o.height - 20);
  out.afterTap = inView();
  positionPopupAt(o.left + 300, o.top + 5);
  out.afterTapTop = inView();
  resetPopupPosition();
  out.afterReset = inView();
  outer.scrollTop = 0; await new Promise(r => setTimeout(r, 120));
  out.backTop = inView();
  // 雪・雨の粒は送った先にも降らせる
  updateParticles();
  out.pcH = document.getElementById('particle-canvas').height;
  out.sh = outer.scrollHeight;
  return out;
});
ok(pop.st > 50, '縦に送れた', pop);
ok(pop.afterScroll && pop.afterTap && pop.afterTapTop && pop.afterReset && pop.backTop, '★★送ったあとも選択情報の窓は見えている範囲にある', pop);
ok(pop.pcH >= pop.sh - 1, '雪・雨の粒のキャンバスは送った先まで届く', pop);

// 重ねる画面は 480px の柱のまま（✕ をノッチに潜らせない）
const ov = await page.evaluate(() => {
  const out = {};
  for (const id of ['fav-overlay', 'rank-overlay', 'wxmap-overlay', 'coord-sheet']) {
    const el = document.getElementById(id), cs = getComputedStyle(el);
    // 表示の有無に関わらず置き場所だけ測る
    const prev = [el.style.display, el.hidden]; el.hidden = false; el.style.display = 'flex';
    const b = el.getBoundingClientRect();
    out[id] = { w: Math.round(b.width), l: Math.round(b.left) };
    el.style.display = prev[0]; el.hidden = prev[1];
  }
  return out;
});
for (const [id, b] of Object.entries(ov)) ok(b.w === 480 && b.l === Math.round((844 - 480) / 2), `★★${id} は中央の 480px の柱のまま`, b);

// ⚠ 縦に払っても時刻は変えない（送るだけ）。横になぞったら選ぶ。指を置いただけでは選ばない（タップは click）
const swipe = await page.evaluate(async () => {
  const w = document.getElementById('charts-wrapper'), o = document.getElementById('charts-outer').getBoundingClientRect();
  const fire = (type, x, y) => {
    const t = new Touch({ identifier: 1, target: w, clientX: x, clientY: y });
    w.dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true }));
  };
  const x0 = o.left + o.width * 0.8, y0 = o.top + 60;
  setSelectedIndex(100, false);
  const out = { before: state.sliderIndex };
  fire('touchstart', x0, y0);
  out.afterStart = state.sliderIndex;
  for (let i = 1; i <= 6; i++) fire('touchmove', x0 + i, y0 + i * 20);   // ほぼ縦（わずかに横へずれる）
  fire('touchend', x0 + 6, y0 + 120);
  out.afterVertical = state.sliderIndex;
  fire('touchstart', x0, y0);
  for (let i = 1; i <= 6; i++) fire('touchmove', x0 - i * 20, y0 + i);   // 横
  fire('touchend', x0 - 120, y0 + 6);
  out.afterHorizontal = state.sliderIndex;
  return out;
});
ok(swipe.afterStart === swipe.before, '★横向きは、指を置いただけでは時刻を選ばない', swipe);
ok(swipe.afterVertical === swipe.before, '★★横向きで縦に払っても時刻は変えない（送るだけ）', swipe);
ok(swipe.afterHorizontal !== swipe.before, '横向きでも横になぞれば時刻を選ぶ', swipe);

// 横向きで地図を開いて閉じる（円柱は隠れた器へ戻る）→ 縦へ戻したら円柱を測り直す
await page.evaluate(async () => { openMap(); await new Promise(r => setTimeout(r, 400)); closeMap(); await new Promise(r => setTimeout(r, 300)); });

/* ---------- 2. 縦へ戻す（390×844） ---------- */
await page.evaluate(() => { document.getElementById('charts-outer').scrollTop = 120; });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(700);
let P = await look();
ok(P.wide === false, '縦向きは横向きとして扱わない', P);
ok(P.app.w === 390 && P.legend && P.footer && P.favbar, '★縦へ戻すと凡例・ボタン行・円柱が戻る', P);
ok(Math.abs(P.pph - (P.viewW - 68) / 24) < 0.01, '★縦向きは 24 時間のまま', { pph: P.pph, viewW: P.viewW });
ok(P.st === 0, '★★縦へ戻したら送った位置を戻す（上が切れたままにしない）', P);
ok(P.overflowY === 'hidden', '縦向きはグラフを縦に送らない（今のまま）', P);
const fav = await page.evaluate(() => ({ el: document.getElementById('fav-rotary').clientWidth,
  stage: parseFloat(document.getElementById('fav-stage').style.width) }));
ok(fav.el > 200 && Math.abs(fav.stage - fav.el) < 1, '★横向きで地図を開いて閉じたあと、縦へ戻すと円柱を測り直す（仮の 200px のままにしない）', fav);
// 縦向きは指を置いた所の時刻を選ぶ（今のまま）
const portraitTouch = await page.evaluate(() => {
  const w = document.getElementById('charts-wrapper'), o = document.getElementById('charts-outer').getBoundingClientRect();
  setSelectedIndex(100, false);
  const before = state.sliderIndex;
  const t = new Touch({ identifier: 2, target: w, clientX: o.left + o.width * 0.9, clientY: o.top + 80 });
  w.dispatchEvent(new TouchEvent('touchstart', { touches: [t], changedTouches: [t], bubbles: true }));
  w.dispatchEvent(new TouchEvent('touchend', { touches: [], changedTouches: [t], bubbles: true }));
  return { before, after: state.sliderIndex };
});
ok(portraitTouch.after !== portraitTouch.before, '縦向きは今までどおり、指を置いた所の時刻を選ぶ', portraitTouch);

/* ---------- 3. iPad の横向き（1180×820）は今のまま ---------- */
await page.setViewportSize({ width: 1180, height: 820 });
await page.waitForTimeout(700);
const T = await look();
ok(T.wide === false && T.app.w === 480 && T.legend && T.footer, '★iPad の横向き（高さ 500px 超）は今のまま', T);

/* ---------- 4. もう一度横へ：元どおり ---------- */
await page.setViewportSize({ width: 844, height: 390 });
await page.waitForTimeout(700);
L = await look();
ok(L.wide && L.app.w === 844 && !L.legend && Math.abs(L.pph - (L.viewW - 68) / 48) < 0.01, '横へ戻すと全幅・48時間', L);

ok(errors.length === 0, 'ページ内で例外が出ない', errors);
await browser.close();
if (fails.length) {
  console.log('LANDSCAPE SMOKE FAILED');
  fails.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('LANDSCAPE SMOKE PASSED');
