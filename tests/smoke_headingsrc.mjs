/* ヘディングアップの向きの出どころ（v4.189.0）。
 * 動いている間は GPS の進む向きを使う。方位センサー＋画面の回転角だと、車載ホルダーに立てて横向きにした iPhone で
 * 地図が約 90° ずれて横へ流れた（利用者の実機・2026-11-19）。進む向きは持ち方・傾き・回転角に関係しない。
 *
 * ⚠⚠ GPS の向きは速さが HEADING_GPS_MIN_SPEED 以上のときだけ。不明な値（null・NaN・負）は採らない。
 * ⚠⚠ 止まってから HEADING_GPS_HOLD_MS の間は GPS の向きを保つ（方位センサーを使わない）。過ぎたら方位センサー。
 * ⚠ 方位センサーの経路（画面の回転角を足す）は今までどおり。遅い GPS は、方位センサーが無いときだけ代用する（今までどおり）。
 * ⚠ 手元の Chromium は DeviceOrientationEvent の扱いが CI と違う（smoke_mapui のヘディングアップの節が手元で落ちる）。
 *   ここでは enableHeading を通さず、handler を直接つないで確かめる。
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
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.55, lon: 139.88, name: 'テスト地点' }));
  // 横向きの回転角 270（右へ 90° 回した）。navigator.geolocation は使わない（onGeoUpdate を直接呼ぶ）
  Object.defineProperty(window, 'orientation', { configurable: true, get: () => -90 });
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(800);

/* ---------- 1. 純関数 ---------- */
const pure = await page.evaluate(() => ({
  ok1: gpsCourseUsable({ heading: 180, speed: 10 }),
  slow: gpsCourseUsable({ heading: 180, speed: 1.0 }),
  edge: gpsCourseUsable({ heading: 0, speed: HEADING_GPS_MIN_SPEED }),
  neg: gpsCourseUsable({ heading: -1, speed: 10 }),
  nan: gpsCourseUsable({ heading: NaN, speed: 10 }),
  nul: gpsCourseUsable({ heading: null, speed: 10 }),
  over: gpsCourseUsable({ heading: 360, speed: 10 }),
  noSpeed: gpsCourseUsable({ heading: 90, speed: null }),
  negSpeed: gpsCourseUsable({ heading: 90, speed: -1 }),
  none: gpsCourseUsable(null),
  tiltFlat: Math.round(screenTiltDeg(0, 0)), tiltUp: Math.round(screenTiltDeg(90, 0)), tiltSide: Math.round(screenTiltDeg(0, -90)),
  tilt45: Math.round(screenTiltDeg(45, 0)), tiltNone: screenTiltDeg(undefined, 0),
  min: HEADING_GPS_MIN_SPEED, hold: HEADING_GPS_HOLD_MS,
}));
ok(pure.ok1 && pure.edge, '★動いていて進む向きが分かれば GPS の向きを使う', pure);
ok(!pure.slow, '★遅いと GPS の向きは使わない（ふらつく）', pure);
ok(!pure.neg && !pure.nan && !pure.nul && !pure.over && !pure.noSpeed && !pure.negSpeed && !pure.none, '★★不明な向き・速さ（-1・NaN・null・360）は採らない', pure);
ok(pure.tiltFlat === 0 && pure.tiltUp === 90 && pure.tiltSide === 90 && pure.tilt45 === 45 && pure.tiltNone === null, '画面の傾き（仮の表示用）', pure);
ok(pure.min === 2.5 && pure.hold === 8000, 'しきい値（2.5 m/s・8 秒）', pure);

/* ---------- 2. 実際の流れ（ヘディングアップ・横向き） ---------- */
const flow = await page.evaluate(async () => {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  openMap(); await wait(500);
  // ヘディングアップにする。方位センサーは enableHeading を通さず、同じ handler をつなぐ（手元の Chromium の違いを避ける）
  const realDOE = window.DeviceOrientationEvent;
  window.DeviceOrientationEvent = function () {}; window.DeviceOrientationEvent.requestPermission = async () => 'granted';
  await enableHeading();
  window.DeviceOrientationEvent = realDOE;
  setLocateMode('follow');
  setHeadingUp(true);
  const fire = (h, beta, gamma) => { const ev = new Event('deviceorientation'); ev.webkitCompassHeading = h; ev.beta = beta; ev.gamma = gamma; window.dispatchEvent(ev); };
  const gps = (heading, speed) => onGeoUpdate({ coords: { latitude: 36.55, longitude: 139.88, accuracy: 10, heading, speed } });
  const out = {};
  // 止まっている：方位センサー＋画面の回転角（今までどおり）
  fire(100, 80, 0);
  out.compass = { heading: Math.round(headingDeg), src: headingSrc };
  // 走り出した：GPS の進む向き（回転角は足さない）。方位センサーが来ても上書きしない
  gps(180, 12);
  out.gps = { heading: Math.round(headingDeg), src: headingSrc, rot: Math.round(mapRotationDeg) };
  fire(206, 80, 0);
  out.afterCompassWhileMoving = Math.round(headingDeg);
  // 遅くなった（信号で止まった）：HOLD の間は GPS の向きを保つ
  gps(NaN, 0);
  fire(300, 80, 0);
  out.stoppedHold = Math.round(headingDeg);
  // HOLD を過ぎた：方位センサーに戻る
  gpsHeadingAt = performance.now() - HEADING_GPS_HOLD_MS - 1;
  fire(300, 80, 0);
  out.afterHold = { heading: Math.round(headingDeg), src: headingSrc };
  // 不明な向き（-1）で走っていても採らない
  gps(-1, 15);
  out.negHeading = Math.round(headingDeg);
  // 仮の表示に出どころ・速さ・傾きが出る
  gps(90, 20);
  out.diag = document.getElementById('map-orient-diag').textContent;
  out.diagShown = !document.getElementById('map-orient-diag').classList.contains('hidden');
  // 追跡をやめたら GPS の向きを保つ状態を消す
  stopTracking();
  out.reset = { at: gpsHeadingAt, src: headingSrc };
  return out;
});
ok(flow.compass.heading === (100 + 270) % 360 && flow.compass.src === 'compass', '止まっているときは方位センサー＋画面の回転角（今までどおり）', flow.compass);
ok(flow.gps.heading === 180 && flow.gps.src === 'gps' && flow.gps.rot === -180, '★★走り出したら GPS の進む向き（回転角は足さない）で地図を回す', flow.gps);
ok(flow.afterCompassWhileMoving === 180, '★★走っている間は方位センサーで上書きしない', flow);
ok(flow.stoppedHold === 180, '★止まってもしばらくは GPS の向きを保つ（信号で跳ばない）', flow);
ok(flow.afterHold.heading === (300 + 270) % 360 && flow.afterHold.src === 'compass', '保つ間を過ぎたら方位センサーに戻る', flow.afterHold);
ok(flow.negHeading === (300 + 270) % 360, '★不明な向き（-1）は採らない', flow);
ok(flow.diagShown && /出どころ GPS/.test(flow.diag) && /GPS 90°・20\.0m\/s/.test(flow.diag) && /傾き 80°/.test(flow.diag), '仮の表示に出どころ・GPS の向きと速さ・傾きが出る', flow.diag);
ok(flow.reset.at === -Infinity && flow.reset.src === null, '追跡をやめたら GPS の向きを保つ状態を消す', flow.reset);

/* ---------- 3. 方位センサーが無い端末：遅くても GPS の向きで代用（今までどおり） ---------- */
const noSensor = await page.evaluate(() => {
  const keep = headingHandler;
  if (keep) window.removeEventListener('deviceorientation', keep, true);
  headingHandler = null;
  onGeoUpdate({ coords: { latitude: 36.55, longitude: 139.88, accuracy: 10, heading: 45, speed: 0.5 } });
  return Math.round(headingDeg);
});
ok(noSensor === 45, '方位センサーが無ければ、遅くても GPS の向きで代用する（今までどおり）', noSensor);

ok(errors.length === 0, 'ページ内で例外が出ない', errors);
await browser.close();
if (fails.length) {
  console.log('HEADINGSRC SMOKE FAILED');
  fails.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('HEADINGSRC SMOKE PASSED');
