/* 施設（OSM）レイヤー（#199・v4.166.0）。
 *
 * ⚠⚠ 名前は OpenStreetMap の誰でも書き換えられる値。HTML に入れる前に escapeHtml に通していることを、
 *   名前に <b> を混ぜて確かめる（要素として現れたら負け）。
 * ほか：z11 未満は置かない・z11〜12 は間引く・z13 から名前・押しても地点を変えない・
 *   種類の絞り込みは key で覚える・出典に取り出した日・下地が OSM でも出典を重ねない・取りに行くのは1回
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

const POI = JSON.stringify({
  source: 'test', license: 'ODbL 1.0', attribution: '© OpenStreetMap contributors', generated: '2026-10-10',
  types: [{ id: 0, key: 'trailhead', name: '登山口' }, { id: 1, key: 'parking', name: '駐車場' }, { id: 2, key: 'hut', name: '山小屋' }],
  items: [
    [36.570, 137.650, 2, 'テスト小屋<b id="poi-inj">注入</b>'],
    [36.571, 137.651, 0, '作り物の登山口'],
    [36.572, 137.652, 1, '作り物の駐車場'],
    [36.5701, 137.6501, 2, '近すぎる小屋'],
  ],
});
let poiFetches = 0;
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
  if (url.endsWith('/data/poi.json')) { poiFetches++; return route.fulfill({ contentType: 'application/json', body: POI }); }
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


const marks = () => page.evaluate(() => [...document.querySelectorAll('.poi-box')].map(b => b.textContent));

/* 1. 一覧に出る・ON にできる */
{
  const r = await page.evaluate(() => {
    toggleLayerPanel();
    const listed = usableOverlays().some(o => o.id === 'poi');
    toggleOverlay('poi');
    return { listed, on: isOverlayOn('poi') };
  });
  ok(r.listed && r.on, '★一覧に出て ON にできる', r);
  await page.waitForTimeout(600);
}

/* 2. z10 では置かず、拡大すると出ると言う */
{
  await page.evaluate(() => leafletMap.setView([36.570, 137.650], 10, { animate: false }));
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => ({ n: document.querySelectorAll('.poi-box').length, note: layerStatus.poi }));
  ok(r.n === 0 && /拡大/.test(r.note || ''), '★★z11 未満は置かず「拡大すると出ます」', r);
}

/* 3. z11 は間引き（近すぎる同じ種類は1つ）・名前なし／z14 は全部・名前つき */
{
  await page.evaluate(() => leafletMap.setView([36.571, 137.651], 11, { animate: false }));
  await page.waitForTimeout(600);
  const z11 = await marks();
  ok(z11.length === 3, '★★z11 は升目で間引く（小屋2つのうち1つ）', z11);
  ok(z11.every(t => !/作り物/.test(t)), '★z11 では名前を添えない', z11);
  await page.evaluate(() => leafletMap.setView([36.571, 137.651], 14, { animate: false }));
  await page.waitForTimeout(600);
  const z14 = await marks();
  ok(z14.length === 4 && z14.some(t => /作り物の登山口/.test(t)), '★★z13 以上は全部・名前つき', z14);
}

/* 4. ⚠ 名前の HTML は要素にならない（OSM の値は誰でも書ける） */
{
  const r = await page.evaluate(() => ({
    injected: !!document.getElementById('poi-inj'),
    shown: [...document.querySelectorAll('.poi-box')].some(b => b.textContent.includes('<b id="poi-inj">')),
  }));
  ok(!r.injected && r.shown, '★★★名前に混ぜた <b> が要素にならず文字のまま出る', r);
}

/* 5. 押すと札が開く・地点は変えない */
{
  const r = await page.evaluate(() => {
    const before = JSON.stringify([state.lat, state.lon]);
    const m = weatherMarkers.find(x => x.getTooltip && x.getTooltip() && /作り物の登山口/.test(x.getTooltip().getContent()));
    if (!m) return { found: false };
    m.fire('click'); m.openTooltip();
    const tip = document.querySelector('.leaflet-tooltip');
    return { found: true, tip: tip ? tip.textContent : null, same: before === JSON.stringify([state.lat, state.lon]) };
  });
  ok(r.found && /作り物の登山口/.test(r.tip || '') && /登山口/.test(r.tip || ''), '★札に名前と種類が出る', r);
  ok(r.same, '★★押しても天気を見る地点は変わらない', r);
}

/* 6. 種類の絞り込み（key で覚える・読み込み直しても残る） */
{
  await page.evaluate(() => togglePoiType('parking'));
  await page.waitForTimeout(400);
  const after = await marks();
  ok(!after.some(t => /作り物の駐車場/.test(t)) && after.length === 3, '★★駐車場を隠すと消える', after);
  const saved = await page.evaluate(() => localStorage.getItem('sotoki.map.poiHidden'));
  ok(saved === '["parking"]', '★隠した種類を key で覚える', saved);
  const chips = await page.evaluate(() => document.querySelectorAll('#layer-overlays .amedas-el').length);
  ok(chips === 3, '★行が ON のとき種類のチップが出る', chips);
  await page.evaluate(() => togglePoiType('parking'));
}

/* 7. 出典に OpenStreetMap と取り出した日・下地が OSM でも重ねて出さない */
{
  const r1 = await page.evaluate(() => document.getElementById('map-attribution').textContent);
  ok(/OpenStreetMap contributors（ODbL・施設は 2026-10-10 時点）/.test(r1), '★★出典に OSM と取り出した日', r1);
  const r2 = await page.evaluate(() => { setMapBase('osm'); return document.getElementById('map-attribution').textContent; });
  ok((r2.match(/OpenStreetMap contributors/g) || []).length === 1, '★下地が OSM でも出典は1つ', r2);
  await page.evaluate(() => setMapBase('pale'));
}

/* 8. 取りに行くのは1回だけ */
ok(poiFetches === 1, '★data/poi.json は1回だけ取る', poiFetches);

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_poi PASS');
