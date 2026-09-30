/* 予報モデルの登録簿（段階 B-1・ADR-0015）。**画面は変えない**段階なので、既定（JMA）が
 * 変更前と完全に同じであることを主に見張る。
 *   ①登録簿は4つだけ（JMA/GFS/ICON/ECMWF ifs025）。気圧面が無い ecmwf_ifs・地上の列が空の aifs は入れない
 *   ②既定の取得 URL が変更前と1文字も違わない（models=jma_seamless）
 *   ③モデルを変えると models= だけが変わる。知らないキーは JMA に落ちる
 *   ④オフライン控え：既定のキーは従来と同じ／JMA 以外は別の記録／別のモデルの控えを返さない
 *   ⑤JMA 以外は全時刻をそのモデル名にする（MSM と言い張らない）。JMA は従来どおり MSM/移行/GSM
 *   ⑥JMA 以外でも帯が例外なく描ける
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };
const pad = n => String(n).padStart(2, '0');

/* 変更前（v4.143.0）の取得 URL。lat=36, lon=138。⚠ 変えるなら、変えた理由が要る
   （気圧面の変数・past_days・forecast_days・wind_speed_unit=ms を勝手に変えると判定が化ける） */
const BASELINE_URL = 'https://api.open-meteo.com/v1/forecast?latitude=36&longitude=138&hourly=temperature_2m,apparent_temperature,precipitation,snowfall,surface_pressure,windspeed_10m,winddirection_10m,windgusts_10m,weathercode,cloudcover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,wind_speed_925hPa,wind_direction_925hPa,geopotential_height_925hPa,wind_speed_900hPa,wind_direction_900hPa,geopotential_height_900hPa,wind_speed_850hPa,wind_direction_850hPa,geopotential_height_850hPa,wind_speed_800hPa,wind_direction_800hPa,geopotential_height_800hPa,wind_speed_700hPa,wind_direction_700hPa,geopotential_height_700hPa,wind_speed_600hPa,wind_direction_600hPa,geopotential_height_600hPa,wind_speed_500hPa,wind_direction_500hPa,geopotential_height_500hPa&daily=sunrise,sunset&timezone=Asia%2FTokyo&wind_speed_unit=ms&past_days=3&forecast_days=9&models=jma_seamless';

const N = 288, FIRST_GSM = 200;
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [],
    wind_speed_900hPa: [], wind_speed_800hPa: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < N; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(5); h.apparent_temperature.push(5);
    h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(1); h.winddirection_10m.push(270); h.windgusts_10m.push(2);
    h.weathercode.push(1); h.cloudcover.push(20);
    const v = i < FIRST_GSM ? 6 : null;
    h.wind_speed_900hPa.push(v); h.wind_speed_800hPa.push(v);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:30`); daily.sunset.push(`${ds}T17:30`);
  }
  return { hourly: h, daily, elevation: 800 };
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
page.on('pageerror', e => errors.push(e.message));
const mainUrls = [];
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('api.open-meteo.com')) {
    if (url.includes('models=')) mainUrls.push(url);
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
  }
  return route.abort();
});
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36, lon: 138, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1500);

// ①登録簿
const reg = await page.evaluate(() => ({
  keys: Object.keys(FORECAST_MODELS),
  ids: Object.values(FORECAST_MODELS).map(m => m.id),
  def: DEFAULT_MODEL, stateModel: state.model,
}));
ok(reg.keys.join() === 'jma,gfs,icon,ecmwf', '★①登録簿は4つだけ（JMA/GFS/ICON/ECMWF）', reg);
ok(reg.ids.join() === 'jma_seamless,gfs_seamless,icon_seamless,ecmwf_ifs025', '★①models= に渡す ID', reg);
ok(!reg.ids.includes('ecmwf_ifs') && !reg.ids.includes('ecmwf_aifs025'), '★①気圧面の無い ecmwf_ifs・地上の列が空の aifs は入れない', reg);
ok(reg.def === 'jma' && reg.stateModel === 'jma', '①既定は JMA', reg);

// ②既定の URL が変更前と同じ
ok(mainUrls.length >= 1 && mainUrls[0] === BASELINE_URL, '★★②既定の取得 URL が変更前と1文字も違わない', { got: mainUrls[0], len: mainUrls[0] && mainUrls[0].length });

// ③モデルを変える
const other = await page.evaluate(async () => {
  const seen = [];
  const orig = window.fetch;
  window.fetch = (u, ...a) => { if (String(u).includes('models=')) seen.push(String(u)); return orig(u, ...a); };
  const out = {};
  for (const k of ['gfs', 'icon', 'ecmwf', 'xx']) {
    state.model = k;
    seen.length = 0;
    await fetchWeather(36, 138);
    out[k] = seen[0] || null;
  }
  state.model = 'jma';
  window.fetch = orig;
  return out;
});
const swap = (u, id) => u && u.replace(/models=[^&]+$/, `models=${id}`);
ok(other.gfs === swap(BASELINE_URL, 'gfs_seamless'), '★③GFS は models= だけが変わる', other.gfs);
ok(other.icon === swap(BASELINE_URL, 'icon_seamless'), '③ICON は models= だけが変わる', other.icon);
ok(other.ecmwf === swap(BASELINE_URL, 'ecmwf_ifs025'), '③ECMWF は models= だけが変わる', other.ecmwf);
ok(other.xx === BASELINE_URL, '★③知らないキーは JMA に落ちる', other.xx);

// ④オフライン控え
const cache = await page.evaluate(async () => {
  const json = { hourly: { time: ['2026-01-01T00:00'] }, elevation: 1 };
  const out = { keyDef: wxKey(36.8371, 138.9301), keyJma: wxKey(36.8371, 138.9301, 'jma'), keyGfs: wxKey(36.8371, 138.9301, 'gfs') };
  const lat = 35.123, lon = 137.456;
  await saveWxCache(lat, lon, json, 1000, 'JMAの地点');           // 引数なし＝JMA
  out.gfsBefore = await loadWxCache(lat, lon, 'gfs');            // JMA の控えしか無い → GFS は null
  await saveWxCache(lat, lon, json, 1000, 'GFSの地点', 'gfs');
  const j = await loadWxCache(lat, lon);
  const g = await loadWxCache(lat, lon, 'gfs');
  const i = await loadWxCache(lat, lon, 'icon');
  out.jmaName = j && j.rec.name; out.jmaModel = j && j.rec.model; out.jmaKey = j && j.rec.key;
  out.gfsName = g && g.rec.name; out.gfsModel = g && g.rec.model; out.gfsKey = g && g.rec.key;
  out.icon = i;
  // 欄（model）が無い古い控えは JMA として返る
  const st = await wxStore('readwrite');
  await new Promise((res, rej) => { const r = st.put({ key: wxKey(34.5, 135.5), lat: 34.5, lon: 135.5, name: '古い控え', at: Date.now(), json, dem: null }); r.onsuccess = res; r.onerror = () => rej(r.error); });
  const old = await loadWxCache(34.5, 135.5);
  const oldGfs = await loadWxCache(34.5, 135.5, 'gfs');
  out.old = old && old.rec.name; out.oldGfs = oldGfs;
  return out;
});
ok(cache.keyDef === '36.837,138.930' && cache.keyJma === cache.keyDef, '★④既定（JMA）の控えのキーは従来と同じ（保存済みの控えを無効にしない）', cache);
ok(cache.keyGfs === '36.837,138.930|gfs', '④JMA 以外は別のキー', cache);
ok(cache.gfsBefore === null, '★④JMA の控えしか無いとき、GFS の問い合わせに JMA の控えを返さない', cache);
ok(cache.jmaName === 'JMAの地点' && cache.jmaModel === 'jma', '④JMA の控えは JMA のまま', cache);
ok(cache.gfsName === 'GFSの地点' && cache.gfsModel === 'gfs' && cache.gfsKey === '35.123,137.456|gfs', '④GFS の控えは別の記録', cache);
ok(cache.icon === null, '④ICON の控えは無い（GFS・JMA のを返さない）', cache);
ok(cache.old === '古い控え' && cache.oldGfs === null, '④欄が無い古い控えは JMA として返り、GFS には返さない', cache);

// ⑤モデルごとの時刻ラベル
const ph = await page.evaluate(() => {
  const json = fakeJson();
  function fakeJson() {
    const n = 100, h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [],
      windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [], wind_speed_900hPa: [], wind_speed_800hPa: [] };
    for (let i = 0; i < n; i++) {
      h.time.push(`2026-10-01T${String(i % 24).padStart(2, '0')}:00`);
      h.temperature_2m.push(0); h.apparent_temperature.push(0); h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1000);
      h.windspeed_10m.push(1); h.winddirection_10m.push(0); h.windgusts_10m.push(1); h.weathercode.push(0); h.cloudcover.push(0);
      h.wind_speed_900hPa.push(i < 60 ? 5 : null); h.wind_speed_800hPa.push(i < 60 ? 5 : null);
    }
    return { hourly: h };
  }
  const count = arr => arr.reduce((a, d) => (a[d.model] = (a[d.model] || 0) + 1, a), {});
  return {
    def: count(processData(json, pickWindSource(1500))),
    jma: count(processData(json, pickWindSource(1500), 'jma')),
    gfs: count(processData(json, pickWindSource(1500), 'gfs')),
    ecmwf: count(processData(json, pickWindSource(1500), 'ecmwf')),
    bad: count(processData(json, pickWindSource(1500), 'nothing')),
  };
});
ok(ph.def['MSM'] > 0 && ph.def['GSM'] > 0 && ph.def['移行'] === 5, '★⑤省略（ランキング等）は従来どおり JMA の MSM/移行/GSM', ph.def);
ok(JSON.stringify(ph.jma) === JSON.stringify(ph.def), '⑤JMA を明示しても同じ', ph);
ok(ph.gfs['GFS'] === 100 && Object.keys(ph.gfs).length === 1, '★⑤GFS は全時刻を「GFS」とする（MSM と言い張らない）', ph.gfs);
ok(ph.ecmwf['ECMWF'] === 100 && Object.keys(ph.ecmwf).length === 1, '⑤ECMWF は全時刻を「ECMWF」とする', ph.ecmwf);
ok(JSON.stringify(ph.bad) === JSON.stringify(ph.def), '⑤知らないキーは JMA として扱う', ph.bad);

// ⑥JMA 以外でも帯が描ける
await page.evaluate(async () => { state.model = 'gfs'; await fetchWeather(36, 138); });
await page.waitForTimeout(800);
const band = await page.evaluate(() => {
  const u = skyChart, cv = u.ctx.canvas, pr = cv.width / u.width;
  const img = u.ctx.getImageData(0, 0, cv.width, cv.height).data;
  const x = Math.round(u.valToPos(60, 'x', true) + 3 * pr), y = Math.round(MODEL_BAND_H * pr / 2);
  const i = (y * cv.width + x) * 4;
  return { models: [...new Set(state.allData.map(d => d.model))], rgb: [img[i], img[i + 1], img[i + 2]], pop: (updatePopup(), document.getElementById('pop-model').textContent) };
});
ok(band.models.join() === 'GFS', '⑥GFS のとき、帯の区間は「GFS」だけ', band);
ok(Math.abs(band.rgb[0] - 0x5f) < 40 && Math.abs(band.rgb[1] - 0x8a) < 40 && Math.abs(band.rgb[2] - 0x6e) < 40, '⑥JMA 以外は一色の帯（未知の名前でも例外なく描く）', band);
ok(/GFS/.test(band.pop) && !/MSM/.test(band.pop), '⑥窓も「モデル：GFS」', band);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MODELREG SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ reg, urlLen: mainUrls[0].length, phases: ph, band }));
console.log('MODELREG SMOKE PASSED');
