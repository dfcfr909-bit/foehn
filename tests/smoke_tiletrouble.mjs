/* 取得できていないことを地図の上に出す。
 *
 * なぜ要るか:
 *   ヘディングアップで走行中、地図に帯や筋が出るという報告があった（2026-09-19）。
 *   タイルが落ちているなら `watchTileStatus` が気づいているはずだが、出す先が
 *   **レイヤーパネルの中**だけで、開かないと分からなかった。地図の上にも出す。
 *
 * ⚠⚠ **下地（ベースマップ）に `watchTileStatus` が付いていなかった。**
 *   地図そのものが取れていなくても誰も気づかない状態だったので、ここも見る。
 *
 * ⚠⚠ **「この範囲に表示なし」を警告に混ぜない。** 雷は元から無いことがある。
 *   混ぜると狼少年になり、本物の失敗を見なくなる。
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

let baseFails = false;        // 下地のタイルを落とすか
let baseHits = 0;
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
  // 下地（国土地理院の地図タイル）。dem_png は標高なので別扱い
  if (url.includes('cyberjapandata') && !url.includes('/dem_png/')) {
    baseHits++;
    if (baseFails) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: 'image/png', body: TILE });
  }
  if (/\.(png|jpg)/.test(url)) return route.fulfill({ contentType: 'image/png', body: TILE });
  return route.abort();
});
await page.addInitScript(() => localStorage.setItem('sotoki_last',
  JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1100);
await page.evaluate(() => openMap());
await page.waitForTimeout(1600);

const band = () => page.evaluate(() => {
  const el = document.getElementById('map-trouble');
  return { shown: !!el.offsetParent, cls: el.className, text: (el.textContent || '').trim() };
});

/* ============ 1. 取れているときは何も出さない ============ */
{
  ok(baseHits > 0, '★前提: 下地のタイルを実際に取りに行っている', baseHits);
  const b = await band();
  ok(!b.shown, '★★★取れているときは警告を出さない（狼少年にしない）', b);
}

/* ============ 2. ⚠⚠ 下地が落ちたら地図の上に出る ============ */
{
  baseFails = true;
  await page.evaluate(() => applyBaseLayer());     // 貼り直して取りに行かせる
  await page.waitForTimeout(2600);                 // WX_FAIL_SETTLE_MS を越えて落ち着かせる
  const b = await band();
  ok(b.shown, '★★★下地が取れないことを地図の上に出す（パネルを開かないと分からない状態をやめる）', b);
  ok(b.text.includes('取れていません'), '★★取れていないと言う', b.text);
  ok(/地理院|標準地図|淡色地図|OpenStreetMap|航空写真|衛星画像/.test(b.text),
    '★★★どのレイヤーが落ちているか名前で言う', b.text);
}

/* ============ 3. 押すとレイヤーパネルが開いて内訳が見える ============ */
{
  // ⚠ 出ていないものは押せない。例外で落ちると原因が読めないので、検査として落とす
  const pre = await band();
  if (!pre.shown) {
    ok(false, '★前提: 警告が出ていないので押せない（上の検査を先に見ること）', pre);
  } else {
    await page.click('#map-trouble');
    await page.waitForTimeout(400);
    const open = await page.evaluate(() =>
      document.getElementById('layer-panel').classList.contains('open'));
    ok(open, '★★押すとレイヤーパネルが開く（内訳をそこで見る）');
    await page.evaluate(() => closeLayerPanel());
    await page.waitForTimeout(300);
  }
}

/* ============ 4. 直ったら消える ============ */
{
  baseFails = false;
  await page.evaluate(() => applyBaseLayer());
  await page.waitForTimeout(2600);
  const b = await band();
  ok(!b.shown, '★★★取れるようになったら警告を消す（出しっぱなしにしない）', b);
}

/* ============ 5. ⚠⚠ 「表示なし」を警告に混ぜない — **本物の呼び出し経路で見る** ============
   v4.95.0 の検査はここで `setLayerStatus(id, text, false)` と**旗を自分で渡して**いた。
   仕掛けだけを見て呼び出し側を見ていなかったので、点で描くレイヤーが旗を付け忘れて
   いることに気づけず、実機で赤帯『山域・百名山：この範囲に山域がありません』が出た。
   → **アプリと同じ道**（山域レイヤーを点けて、山域が1つも無い所へ動かす）で見る。 */
{
  await page.evaluate(() => { openMap(); });
  await page.waitForTimeout(600);
  await page.evaluate(() => { if (!isOverlayOn('areas')) toggleOverlay('areas'); });
  await page.waitForTimeout(800);
  // 太平洋の沖。山域は1つも無い
  await page.evaluate(() => leafletMap.setView([33.0, 142.5], 9));
  await page.waitForTimeout(1200);

  const panel = await page.evaluate(() => layerStatus.areas);
  ok(panel && panel.includes('山域がありません'),
    '★前提: 山域が無い所まで動かせている（この検査の土台）', panel);
  const b = await band();
  ok(!b.shown,
    '★★★「この範囲に山域がありません」で赤帯を出さない（実機で出た狼少年）', b);

  // 山域のある所へ戻したら知らせも消える
  await page.evaluate(() => leafletMap.setView([36.57, 137.65], 9));
  await page.waitForTimeout(1200);
  const back = await page.evaluate(() => layerStatus.areas);
  ok(!back || !back.includes('ありません'), '★★戻したら知らせを持ち越さない', back);
  await page.evaluate(() => { if (isOverlayOn('areas')) toggleOverlay('areas'); });
  await page.waitForTimeout(400);
}

/* ============ 5b. 旗を渡す書き方そのものを残さない ============
   ⚠ `setLayerStatus(id, text, isError)` が残っていると、また付け忘れられる。
   呼ぶ側が setLayerError / setLayerNote のどちらかを**選ばないと書けない**形にした。 */
{
  const src = HTML.replace(/\/\*[\s\S]*?\*\//g, '');   // コメントの中の言及は数えない
  ok(!/setLayerStatus\s*\(/.test(src),
    '★★★旗つきの setLayerStatus を残さない（選ばないと書けない形にする）');
  const api = await page.evaluate(() => ({
    err: typeof setLayerError, note: typeof setLayerNote, clr: typeof clearLayerStatus }));
  ok(api.err === 'function' && api.note === 'function' && api.clr === 'function',
    '★3つに分かれている', api);
}

/* ============ 6. 知らせは畳み、本当の失敗だけ出す ============ */
{
  await page.evaluate(() => setLayerNote('thunder', 'この範囲に表示なし（z8のタイルが無い）'));
  await page.waitForTimeout(250);
  ok(!(await band()).shown, '★★★知らせ（setLayerNote）では警告を出さない', await band());
  const panel = await page.evaluate(() => layerStatus.thunder);
  ok(panel && panel.includes('表示なし'), '★ただしパネルの中には残す（事実は伝える）', panel);

  await page.evaluate(() => setLayerError('hillshade', '取得できません（z15のタイルが無い）'));
  await page.waitForTimeout(250);
  const b = await band();
  ok(b.shown && b.text.includes('陰影起伏図'), '★★★本当の失敗なら地図の上に出す', b);
  // 2件以上あるときは「ほか◯件」に畳む（帯を太らせない）
  await page.evaluate(() => setLayerError('slope', '取得できません（z15のタイルが無い）'));
  await page.waitForTimeout(250);
  const b2 = await band();
  ok(b2.text.includes('ほか1件'), '★★2件目からは「ほか◯件」に畳む（帯を太らせない）', b2.text);
}

/* ============ 7. 地図を閉じたら畳む ============ */
{
  await page.evaluate(() => closeMap());
  await page.waitForTimeout(400);
  const b = await band();
  ok(!b.shown, '★★地図を閉じたら警告も畳む', b);
}

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);

await browser.close();

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_tiletrouble PASS');
