/* 画面を消さない（ヘディングアップ＋自機追跡のあいだ）。
 *
 * なぜ要るか:
 *   ヘディングアップで自機を追跡している最中に画面が落ちると、地図として使えない。
 *
 * ⚠⚠ **この検査の本丸は「消さないか」ではなく「嘘をつかないか」。**
 *   ホーム画面のPWAでは iOS 18.4 未満で Wake Lock が効かない（Appleが18.4で直した）。
 *   効かないのに「消しません」と出すと、**消えないつもりで山で画面が落ちる**。
 *   取れなかったときに警告へ変わること、勝手に解放されたときに表示が残らないことを見る。
 *
 * ⚠ 「充電中だけ」は作れない（Battery Status API を WebKit が実装していない）ので、
 *   ヘディングアップ＋追跡のあいだは常に取りに行く（利用者判断 2026-09-19）。
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
const page = await browser.newPage({
  viewport: { width: 390, height: 800 },
  permissions: ['geolocation'],
  geolocation: { latitude: 36.57, longitude: 137.65, accuracy: 25 },
});
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => d.dismiss().catch(() => {}));

/* ---- Wake Lock を差し替える。本物のブラウザの都合ではなく、こちらの筋道を見る ---- */
await page.addInitScript(() => {
  window.__wake = { requests: 0, releases: 0, lastType: null, mode: 'ok', current: null };
  Object.defineProperty(navigator, 'wakeLock', {
    configurable: true,
    value: {
      request: async type => {
        window.__wake.requests++;
        window.__wake.lastType = type;
        if (window.__wake.mode === 'fail') throw new Error('NotAllowedError');
        const fns = [];
        const sentinel = {
          type, released: false,
          addEventListener: (t, f) => { if (t === 'release') fns.push(f); },
          release: async () => {
            sentinel.released = true; window.__wake.releases++;
            window.__wake.current = null; fns.forEach(f => f());
          },
          // ブラウザ側の都合で勝手に解放された状況を作る
          __drop: () => { sentinel.released = true; window.__wake.current = null; fns.forEach(f => f()); },
        };
        window.__wake.current = sentinel;
        return sentinel;
      },
    },
  });
});
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.includes('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.includes('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  if (/\.(png|jpg)/.test(url)) return route.fulfill({ contentType: 'image/png', body: TILE });
  return route.abort();
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1100);
await page.evaluate(() => openMap());
await page.waitForTimeout(1100);

const badge = () => page.evaluate(() => {
  const el = document.getElementById('map-awake');
  return {
    cls: el.className, shown: !!el.offsetParent,
    text: (document.getElementById('map-awake-text').textContent || '').trim(),
    btn: (document.getElementById('map-awake-btn').textContent || '').trim(),
    wake: { ...window.__wake, current: !!window.__wake.current },
  };
});
const enterHeadingUp = async () => {
  await page.evaluate(() => { locateMode = 'follow'; setHeadingUp(true); });
  await page.waitForTimeout(220);
};

/* ============ 1. 地図を見ているだけでは取りに行かない ============ */
{
  const b = await badge();
  ok(!b.shown, '★ヘディングアップでなければ帯を出さない', b);
  ok(b.wake.requests === 0, '★★地図を開いただけで画面を保持しない（電池を無駄にしない）', b.wake);
}

/* ============ 2. ヘディングアップ＋追跡で取りに行く ============ */
await enterHeadingUp();
{
  const b = await badge();
  ok(b.wake.requests === 1 && b.wake.lastType === 'screen',
    "★★★ヘディングアップ＋追跡で screen の保持を取りに行く", b.wake);
  ok(b.shown && b.cls === '', '★★帯が出る（警告色ではない）', b);
  ok(b.text.includes('画面を消しません'), '★★いま消さないことを言う', b.text);
  ok(b.text.includes('充電'), '★★★電池を使うので充電をすすめる（「◯分」は出さない）', b.text);
  ok(!/\d+\s*分/.test(b.text),
    '★★★「あと◯分でスリープ」は出さない（OSの自動ロック設定はWebから読めない）', b.text);
  ok(b.btn === 'やめる', '★自分で切れる', b);
}

/* ============ 3. 「やめる」で手放し、表示もそう変わる ============ */
{
  await page.click('#map-awake-btn');
  await page.waitForTimeout(220);
  const b = await badge();
  ok(b.wake.releases === 1 && !b.wake.current, '★★★「やめる」で本当に手放す', b.wake);
  ok(b.cls === 'off' && b.text.includes('自動で消えます'),
    '★★消える側に回ったことを言う（消さないと言ったまま残さない）', b);
  ok(b.btn === '消さない', '★入れ直せる', b);
}

/* ============ 4. 入れ直せる ============ */
{
  await page.click('#map-awake-btn');
  await page.waitForTimeout(220);
  const b = await badge();
  ok(b.wake.requests === 2 && b.wake.current, '★★取り直す', b.wake);
  ok(b.text.includes('画面を消しません'), '★表示も戻る', b.text);
}

/* ============ 5. ⚠⚠ 取れなかったら黙らない（iOS18.4未満のPWA） ============ */
{
  await page.evaluate(() => { setHeadingUp(false); window.__wake.mode = 'fail'; });
  await page.waitForTimeout(220);
  await enterHeadingUp();
  const b = await badge();
  ok(!b.wake.current, '★前提: 取れていない（この検査が空振りしていない）', b.wake);
  ok(b.cls === 'warn', '★★★取れなかったら警告の見た目にする', b);
  ok(b.text.includes('消えます'), '★★★「消えます」と正直に言う', b.text);
  ok(!b.text.includes('画面を消しません'),
    '★★★取れていないのに「消しません」と言わない（山で画面が落ちる）', b.text);
  ok(b.text.includes('充電器'), '★★充電器につなぐよう促す', b.text);
}

/* ============ 6. ⚠ 勝手に解放されたら表示が残らない ============ */
{
  await page.evaluate(() => { setHeadingUp(false); window.__wake.mode = 'ok'; });
  await page.waitForTimeout(220);
  await enterHeadingUp();
  const before = await badge();
  ok(before.text.includes('画面を消しません'), '★前提: いったん取れている', before.text);
  await page.evaluate(() => window.__wake.current.__drop());   // ブラウザ都合の解放
  await page.waitForTimeout(160);
  const b = await badge();
  ok(!b.text.includes('画面を消しません'),
    '★★★勝手に解放されたら「消しません」の表示を残さない', b.text);
}

/* ============ 7. モードを抜けたら手放す。「やめる」の選択も持ち越さない ============ */
{
  await page.evaluate(() => { window.__wake.releases = 0; });
  await enterHeadingUp();                       // 取り直してから
  await page.click('#map-awake-btn');           // 「やめる」を押した状態で
  await page.waitForTimeout(200);
  await page.evaluate(() => setHeadingUp(false));
  await page.waitForTimeout(220);
  const off = await badge();
  ok(!off.shown, '★★モードを抜けたら帯を出さない', off);
  ok(!off.wake.current, '★★★モードを抜けたら画面の保持を手放す', off.wake);

  await enterHeadingUp();
  const b = await badge();
  ok(b.text.includes('画面を消しません'),
    '★★★前回の「やめる」を持ち越さない（黙って消える側のまま山へ行かせない）', b.text);
}

/* ============ 8. 地図を閉じたら手放す ============ */
{
  await page.evaluate(() => closeMap());
  await page.waitForTimeout(260);
  const b = await badge();
  ok(!b.wake.current, '★★★地図を閉じたら画面の保持を手放す（見ていないのに電池を使わない）', b.wake);
  ok(!b.shown, '★帯も消える', b);
}

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);

await browser.close();

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_awake PASS');
