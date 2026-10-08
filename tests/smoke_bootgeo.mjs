/* 起動時の位置情報待ちに上限があること（v4.159.1）。
 *
 * なぜ要るか:
 *   前回の地点が無い起動（初めて開いた・保存が消えた）は位置情報を求める。https のページで
 *   許可の問いに誰も答えないと getCurrentPosition は成功も失敗も呼ばず（timeout は許可が出てから数える）、
 *   「GPS取得中…」のまま通信0本で止まっていた（公開URLの検証 run 129 で 30.9 秒）。
 *
 * 見ること:
 *   ① 問いに誰も答えない → BOOT_GEO_WAIT_MS で既定の地点の天気を取り、オーバーレイが消える
 *   ② 許可あり → 待たずにその座標で取る（従来どおり）
 *   ③ 時間切れのあとに成功が来ても、二重に取らず地点も動かさない
 *   いずれも予報の要求は1回だけ。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');
const LEAFLET_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.js'), 'utf8');
const LEAFLET_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/leaflet/dist/leaflet.css'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const pad = n => String(n).padStart(2, '0');
const LEVELS = [925, 900, 850, 800, 700, 600];
function fakeWeather() {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  const time = Array.from({ length: 288 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600e3);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  });
  const f = v => time.map(() => v);
  const h = { time, temperature_2m: f(5), apparent_temperature: f(2), precipitation: f(0),
    snowfall: f(0), surface_pressure: f(1013), windspeed_10m: f(4), winddirection_10m: f(270),
    windgusts_10m: f(6), weathercode: f(1), cloudcover: f(20),
    cloud_cover_low: f(10), cloud_cover_mid: f(10), cloud_cover_high: f(10) };
  for (const p of LEVELS) { h[`wind_speed_${p}hPa`] = f(6); h[`wind_direction_${p}hPa`] = f(300); }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let d = 0; d < 13; d++) {
    const b = new Date(start.getTime() + d * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:00`); daily.sunset.push(`${ds}T18:00`);
  }
  return { hourly: h, daily, elevation: 800 };
}
const TILE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64');

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });

/* 1回ぶんの起動。geo: 'none'（問いに誰も答えない）／'granted'／'late'（10秒後に成功を返す差し替え） */
async function boot(geo) {
  const opts = { viewport: { width: 390, height: 800 } };
  if (geo === 'granted') Object.assign(opts, { permissions: ['geolocation'], geolocation: { latitude: 35.36, longitude: 138.73, accuracy: 25 } });
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.dismiss().catch(() => {}));
  if (geo === 'late') {
    await page.addInitScript(() => {
      navigator.geolocation.getCurrentPosition = ok => setTimeout(() =>
        ok({ coords: { latitude: 35.36, longitude: 138.73, accuracy: 25 } }), 10000);
    });
  }
  const wx = [];   // 予報（本体）の要求の時刻と座標
  const t0 = Date.now();
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet') && url.includes('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet') && url.includes('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('api.open-meteo.com')) {
      // ⚠ 本体の取得だけを数える（補助の取得は hourly の並びが違う）
      if (url.includes('temperature_2m,apparent_temperature')) {
        const u = new URL(url);
        wx.push({ ms: Date.now() - t0, lat: +u.searchParams.get('latitude'), lon: +u.searchParams.get('longitude') });
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    }
    if (url.includes('nominatim.openstreetmap.org/reverse'))
      return route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ address: { town: 'テスト町' } }) });
    if (/\.(png|jpg)/.test(url)) return route.fulfill({ contentType: 'image/png', body: TILE });
    return route.abort();
  });
  await page.goto('https://sotoki.test/');
  const look = () => page.evaluate(() => {
    const el = document.getElementById('loading-overlay');
    return { loading: getComputedStyle(el).display !== 'none', text: el.textContent.trim(),
      lat: state.lat, lon: state.lon, name: state.locationName, wait: typeof BOOT_GEO_WAIT_MS === 'number' ? BOOT_GEO_WAIT_MS : null };
  });
  return { page, ctx, wx, errors, look, t0 };
}

/* ① 問いに誰も答えない */
{
  const b = await boot('none');
  await b.page.waitForTimeout(1500);
  const early = await b.look();
  ok(early.loading && early.text.includes('GPS取得中') && b.wx.length === 0, '①待ちの間は「GPS取得中…」で、まだ取りに行かない', early);
  ok(early.wait >= 5000 && early.wait <= 15000, '①待ちの上限 BOOT_GEO_WAIT_MS が 5〜15秒', early.wait);
  await b.page.waitForTimeout((early.wait || 8000) + 1500);
  const s = await b.look();
  ok(b.wx.length === 1, '★★①問いに誰も答えなくても、上限で予報を1回取りに行く', b.wx);
  ok(b.wx[0] && b.wx[0].ms >= (early.wait || 8000) - 500, '①取りに行くのは上限まで待ってから', b.wx);
  ok(b.wx[0] && Math.abs(b.wx[0].lat - 36.57) < 1e-6 && Math.abs(b.wx[0].lon - 137.65) < 1e-6 && s.name === '立山・黒部',
    '★①取るのは既定の地点（立山・黒部）', { wx: b.wx, s });
  ok(!s.loading, '★★①読み込みオーバーレイが消える', s);
  ok(b.errors.length === 0, '①例外が出ない', b.errors);
  await b.ctx.close();
}

/* ② 許可あり（従来どおり） */
{
  const b = await boot('granted');
  await b.page.waitForTimeout(3000);
  const s = await b.look();
  ok(b.wx.length === 1 && Math.abs(b.wx[0].lat - 35.36) < 1e-6 && b.wx[0].ms < 3000,
    '★②許可があれば待たずにその座標で取る', b.wx);
  ok(!s.loading, '②オーバーレイが消える', s);
  await b.page.waitForTimeout(8000);   // 上限を過ぎても既定の地点で取り直さない
  ok(b.wx.length === 1, '★★②成功のあと、上限が来ても取り直さない', b.wx);
  ok(b.errors.length === 0, '②例外が出ない', b.errors);
  await b.ctx.close();
}

/* ③ 時間切れのあとに成功が来る */
{
  const b = await boot('late');
  await b.page.waitForTimeout(12500);
  const s = await b.look();
  ok(b.wx.length === 1 && Math.abs(b.wx[0].lat - 36.57) < 1e-6,
    '★★③時間切れのあとに届いた成功では、二重に取らない（既定の地点のまま）', b.wx);
  ok(Math.abs(s.lat - 36.57) < 1e-6 && s.name === '立山・黒部' && !s.loading, '③地点も動かさない', s);
  ok(b.errors.length === 0, '③例外が出ない', b.errors);
  await b.ctx.close();
}

await browser.close();
if (fails.length) {
  console.log('BOOTGEO SMOKE FAILED');
  fails.forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('BOOTGEO SMOKE PASSED');
