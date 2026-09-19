/* 地図の縮尺メジャー（キロメートル表示）。
 *
 * なぜ要るか:
 *   ヘディングアップで自機を追跡しながら拡大縮小したとき、
 *   「画面のこの長さが何kmか」がその場で読めないと距離の見当がつかない。
 *
 * ⚠⚠ **この検査の本丸は「出るか」ではなく「棒の長さと数字が合っているか」。**
 *   数字だけ合っていて棒が別の長さなら、読み取った距離が丸ごと嘘になる。
 *   実際に棒のピクセル幅を緯度経度へ戻して測り、ラベルの値と突き合わせる。
 *
 * ⚠⚠ **`#map` の中に置いてはいけない。** ヘディングアップは `#map` 要素ごと
 *   CSS の `rotate()` で実現しているので、中に置くと目盛りごと傾いて読めなくなる。
 *   構造として `#map` の外にあることを見る（傾けて確かめるのではなく、置き場所で防ぐ）。
 *
 * ⚠ **1pxあたりの距離は緯度で変わる**（メルカトル）。固定式で出していないことを、
 *   北と南で同じ倍率にしたときの棒の長さが変わることで確かめる。
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

/* ---- 気象データの作り物（地図を開くまでの道を通すだけ） ---- */
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
// 1x1 の透明PNG（地図タイルの代わり）
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
await page.waitForTimeout(1200);
await page.evaluate(() => openMap());
await page.waitForTimeout(1200);

/* 棒の見た目の長さを実際に測り、ラベルの値と突き合わせる */
const readScale = () => page.evaluate(() => {
  const el = document.getElementById('map-scale');
  const bar = document.getElementById('map-scale-bar');
  const label = document.getElementById('map-scale-label');
  if (!el || !bar || !label) return null;
  const px = bar.getBoundingClientRect().width;
  const y = Math.round(leafletMap.getSize().y / 2);
  // 棒の長さぶんが実際に何mか（表示とは別の道で測り直す）
  const meters = leafletMap.distance(
    leafletMap.containerPointToLatLng([0, y]),
    leafletMap.containerPointToLatLng([px, y]));
  return {
    shown: !!el.offsetParent, cls: el.className, text: label.textContent,
    px, meters, zoom: leafletMap.getZoom(),
  };
});
const labelMeters = t => {
  const m = /^([\d.]+)\s*(km|m)$/.exec((t || '').trim());
  return m ? (+m[1]) * (m[2] === 'km' ? 1000 : 1) : NaN;
};

/* ============ 1. 地図を開いたら出る ============ */
{
  const s = await readScale();
  ok(s && s.shown, '★★★地図を開いたら縮尺のメジャーが出る', s);
  ok(s && /^[\d.]+ (km|m)$/.test(s.text), '★数字と単位で出る', s && s.text);
}

/* ============ 2. ⚠⚠ #map の中に置かない（ヘディングアップで傾く） ============ */
{
  const where = await page.evaluate(() => {
    const el = document.getElementById('map-scale');
    return {
      insideMap: !!el.closest('#map'),
      insideOverlay: !!el.closest('#map-overlay'),
      // 出典の真上（利用者判断 2026-09-19）
      beforeAttribution: !!(el.compareDocumentPosition(document.getElementById('map-attribution'))
        & Node.DOCUMENT_POSITION_FOLLOWING),
    };
  });
  ok(!where.insideMap,
    '★★★#map の中に置かない（中だとヘディングアップで目盛りごと傾く）', where);
  ok(where.insideOverlay, '★地図画面の中にはある', where);
  ok(where.beforeAttribution, '★出典より前（＝真上）にある', where);
}

/* ============ 3. ⚠⚠ 棒の長さと数字が合っている ============ */
{
  const s = await readScale();
  const want = labelMeters(s.text);
  ok(isFinite(want) && want > 0, '★前提: ラベルを数値として読めた', s && s.text);
  const err = Math.abs(s.meters - want) / want;
  ok(err < 0.03,
    '★★★棒の見た目の長さが数字どおり（誤差3%未満）', { ラベル: s.text, 実測m: Math.round(s.meters), ずれ: err });
}

/* ============ 4. きりのいい数字だけ出す（1 / 2 / 5 × 10ⁿ） ============ */
{
  const bad = [];
  const seen = [];
  for (let z = 6; z <= 16; z++) {
    await page.evaluate(zz => leafletMap.setZoom(zz), z);
    await page.waitForTimeout(260);
    const s = await readScale();
    const m = labelMeters(s.text);
    seen.push(s.text);
    const pow = Math.pow(10, Math.floor(Math.log10(m)));
    const mant = Math.round(m / pow);
    if (![1, 2, 5].includes(mant)) bad.push(s.text);
    // 倍率を変えても長さと数字は合い続ける
    if (Math.abs(s.meters - m) / m >= 0.03) bad.push(`${s.text}(長さ不一致)`);
  }
  ok(bad.length === 0, '★★★どの倍率でも 1/2/5 × 10ⁿ で、棒の長さと合っている', bad);
  ok(new Set(seen).size >= 5, '★前提: 倍率で表示が変わっている（この検査が空振りしていない）', seen);
}

/* ============ 5. 1km未満は m、1km以上は km（利用者判断 2026-09-19） ============ */
{
  const forms = [];
  for (let z = 8; z <= 17; z++) {
    await page.evaluate(zz => leafletMap.setZoom(zz), z);
    await page.waitForTimeout(240);
    const s = await readScale();
    const m = labelMeters(s.text);
    const unit = /km$/.test(s.text.trim()) ? 'km' : 'm';
    if (m >= 1000 && unit !== 'km') forms.push(`${s.text} は km で出すべき`);
    if (m < 1000 && unit !== 'm') forms.push(`${s.text} は m で出すべき`);
    forms.push(null);
  }
  ok(forms.every(x => x === null), '★★★1km未満は m、1km以上は km', forms.filter(Boolean));
}

/* ============ 6. ⚠ 緯度で1pxあたりの距離が変わることを見ている ============
   固定式（倍率だけ）で出していると、北と南で同じ長さになってしまう。 */
{
  const at = async (lat) => {
    await page.evaluate(([la]) => leafletMap.setView([la, 140], 10), [lat]);
    await page.waitForTimeout(280);
    const s = await readScale();
    return { lat, text: s.text, px: Math.round(s.px), mPerPx: s.meters / s.px };
  };
  const north = await at(45.4);   // 北海道
  const south = await at(24.4);   // 八重山
  ok(Math.abs(north.mPerPx - south.mPerPx) / south.mPerPx > 0.15,
    '★前提: 緯度で1pxあたりの距離が実際に変わっている', { north, south });
  ok(north.px !== south.px || north.text !== south.text,
    '★★★緯度を見て測り直している（倍率だけの固定式になっていない）', { north, south });
}

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);

await browser.close();

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_mapscale PASS');
