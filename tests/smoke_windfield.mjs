/* 高度別の風の場（Wind Field Engine・ADR-0012）。
 *
 * この機能の目的は「気圧面を標高に読み替える作業」をエンジンで行うこと。ここで見るのは:
 *   ①AUTO が**その時刻の気圧面の高さ**で、基準標高を上下から挟む面を U/V で補間する（固定表を使わない）
 *   ②モデル地形より下の面（外挿値）を使わない。実際の地形とモデル地形の役割分担
 *   ③地表付近は 10m風と最下の有効な面を高さで按分し、**推定値**と印を付ける
 *   ④手動の層は**その層そのもの**。無い時刻（GSM の 800）を別の層で埋めない
 *   ⑤AUTO と手動は**同じ取得・同じ場**を通る（切り替えても取り直さない）
 *   ⑥場（U/V の格子）は描画から独立していて、任意の点の風を引ける
 *   ⑦矢印を押すと「なぜその風か」が出る
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
await page.route('**/*', route => {
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
});
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' })));
await page.goto('https://sotoki.test/');
await page.waitForTimeout(1200);

/* ---- 1. 鉛直の決め方（純粋な関数）---- */
const v = await page.evaluate(() => {
  const col = (over = {}) => WIND_FIELD_LEVELS.map(lv => {
    const id = lv.id;
    const d = Object.assign({
      '10m': [2, 180, null], 925: [6, 250, 700], 900: [7, 260, 930], 850: [10, 270, 1400], 800: [14, 280, 1880], 700: [20, 290, 2950],
    }, over)[id];
    return { lv, spd: d ? d[0] : null, dir: d ? d[1] : null, z: d ? d[2] : null, w: d && d[0] != null ? windUV(d[0], d[1]) : null };
  });
  const sd = r => r.w ? windSpdDir(r.w) : null;
  const mid = WindVertical.auto(col(), 1640, 1000);           // 850(1,400)と800(1,880)の間
  const gap = WindVertical.auto(col(), 1300, 1250);           // 925/900 は地中、最下の有効面は 850(1,400)
  const valley = WindVertical.auto(col(), 900, 1000);         // 基準標高がモデル地形より下
  const sea = WindVertical.auto(col(), null, 0);              // 地形表に無い升目
  const top = WindVertical.auto(col(), 3300, 1000);           // 700(2,950)より上
  const gsm = WindVertical.auto(col({ 900: null, 800: null }), 1640, 1000);   // GSM：800 が無い
  const l800 = WindVertical.layer(col({ 800: null }), '800', 1000);
  const l925 = WindVertical.layer(col(), '925', 1000);          // 925(700m) < モデル地形1,000m
  const l850 = WindVertical.layer(col(), '850', 1000);
  // 期待値：U/V を高さで按分
  const lerpUV = (a, b, t) => { const A = windUV(...a), B = windUV(...b); return windSpdDir([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t]); };
  return {
    mid: { trace: mid.trace, sd: sd(mid), want: lerpUV([10, 270], [14, 280], (1640 - 1400) / (1880 - 1400)) },
    gap: { trace: gap.trace, sd: sd(gap), want: lerpUV([2, 180], [10, 270], (1300 - 1260) / (1400 - 1260)) },
    valley: valley.trace, sea: sea.trace, top: top.trace,
    gsm: { trace: gsm.trace, sd: sd(gsm), want: lerpUV([10, 270], [20, 290], (1640 - 1400) / (2950 - 1400)) },
    l800: l800.trace, l925: l925.trace, l850: { trace: l850.trace, sd: sd(l850) },
  };
});
ok(v.mid.trace.kind === 'interp' && v.mid.trace.lo.id === '850' && v.mid.trace.hi.id === '800',
  '★★AUTO：基準標高を上下から挟む面（850/800）を選ぶ', v.mid.trace);
ok(Math.abs(v.mid.sd.spd - v.mid.want.spd) < 1e-6 && Math.abs(v.mid.sd.dir - v.mid.want.dir) < 1e-6,
  '★★U/V を高さで按分する（風向の平均を取らない）', v.mid);
ok(Math.abs(v.mid.trace.t - 0.5) < 1e-9, '按分の重みは**その時刻の気圧面の高さ**から（固定表の1,460/1,950mではない）', v.mid.trace);
ok(v.gap.trace.kind === 'gap' && v.gap.trace.estimate === true && v.gap.trace.hi.id === '850',
  '★★地表付近：モデル地中の925/900を飛ばし、10m風と850を按分して「推定値」と印を付ける', v.gap.trace);
ok(Math.abs(v.gap.sd.spd - v.gap.want.spd) < 1e-6, '地表付近は高さで線形に按分（Phase 1 の決め方）', v.gap);
ok(v.valley.kind === 'surface' && v.valley.reason === 'belowModel', '★基準標高がモデル地形以下なら地上10m（谷・平地）', v.valley);
ok(v.sea.kind === 'surface' && v.sea.reason === 'sea', '地形表に無い升目（海）は地上10m', v.sea);
ok(v.top.kind === 'top' && v.top.estimate === true, 'いちばん上の面より高ければ上の面を使い「推定値」と断る', v.top);
ok(v.gsm.trace.kind === 'interp' && v.gsm.trace.lo.id === '850' && v.gsm.trace.hi.id === '700',
  '★★GSM の期間（800 が無い）は実在する 850/700 から按分する', v.gsm.trace);
ok(Math.abs(v.gsm.sd.spd - v.gsm.want.spd) < 1e-6, 'GSM の期間の按分も U/V・その時刻の高さ', v.gsm);
ok(v.l800.kind === 'missing' && v.l800.reason === 'noData', '★★★手動800：無い時刻は別の層で埋めない（データなし）', v.l800);
ok(v.l925.kind === 'underground', '★手動925：モデル地形より下は外挿値なので描かない', v.l925);
ok(v.l850.trace.kind === 'layer' && Math.abs(v.l850.sd.spd - 10) < 1e-9, '手動850：その層そのもの', v.l850);

/* ---- 2. 地図：AUTO の場・同じ取得で手動に切り替える ---- */
await page.evaluate(() => openMap());
await page.waitForTimeout(600);
await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 10, { animate: false }); toggleOverlay('windArrows'); });
await page.waitForTimeout(1800);
const auto = await page.evaluate(() => ({
  mode: mapPrefs.windMode,
  arrows: document.querySelectorAll('.wind-box').length,
  field: lastWindField && { mode: lastWindField.mode, ni: lastWindField.ni, nj: lastWindField.nj,
    ok: [...lastWindField.ok].filter(Boolean).length, kinds: [...new Set(lastWindField.cells.map(c => c.res.trace.kind))] },
  sample: lastWindField && sampleWindField(lastWindField, lastWindField.lat0 + lastWindField.dlat * 0.5, lastWindField.lon0 + lastWindField.dlon * 0.5),
  chips: [...document.querySelectorAll('.wind-modes .amedas-el')].map(b => b.textContent.trim()),
  status: (document.querySelector('.layer-status[data-id="windArrows"]') || {}).textContent || '',
}));
ok(auto.mode === 'auto', '★既定は AUTO', auto.mode);
ok(auto.arrows > 0 && auto.field && auto.field.ok > 0, 'AUTO の場ができて矢印が出る', auto);
ok(auto.field && auto.field.kinds.length === 1 && auto.field.kinds[0] === 'interp', 'この条件では全点が850/800の按分', auto.field);
ok(Array.isArray(auto.sample) && auto.sample.length === 2, '★★場は描画から独立して任意の点の U/V を引ける（粒子が使う）', auto.sample);
ok(auto.chips.join(',') === 'AUTO,10m,925,900,850,800,700', '★レイヤーパネルに AUTO と各層', auto.chips);
ok(/AUTO/.test(auto.status), 'いま AUTO で描いていると言う', auto.status);
const nReq = windReqs.length;
ok(nReq >= 1, '前提: 風の場を取った', nReq);
ok(windReqs.every(u => /wind_speed_unit=ms/.test(u)), '★★★wind_speed_unit=ms（ADR-0005）');
ok(windReqs.every(u => /elevation=nan/.test(u)), '★モデル地形を返させる（elevation=nan）');

const man = await page.evaluate(async () => {
  setWindMode('850');
  await new Promise(r => setTimeout(r, 400));
  const f = lastWindField;
  const c = f.cells[0];
  return { mode: f.mode, kind: c.res.trace.kind, spd: windSpdDir(c.res.w).spd,
    status: (document.querySelector('.layer-status[data-id="windArrows"]') || {}).textContent || '' };
});
ok(man.mode === '850' && man.kind === 'layer' && Math.abs(man.spd - 10) < 1e-6, '★手動850の場はその層そのもの', man);
ok(windReqs.length === nReq, '★★★AUTO→手動に切り替えても取り直さない（同じ取得・同じ控え）', windReqs.length - nReq);
ok(/850hPa（手動）/.test(man.status), '手動の層を言う', man.status);

// 手動925：モデル地形（1,000m）より下なので描かない（地中の印だけ）
const m925 = await page.evaluate(async () => {
  setWindMode('925');
  await new Promise(r => setTimeout(r, 300));
  return { under: document.querySelectorAll('.wind-box.under').length, vals: document.querySelectorAll('.wind-box:not(.under)').length };
});
ok(m925.under > 0 && m925.vals === 0, '★手動925：モデル地中は値を出さず「地中」', m925);

/* ---- 3. 矢印を押すと根拠 ---- */
const why = await page.evaluate(async () => {
  setWindMode('auto');
  await new Promise(r => setTimeout(r, 300));
  const m = weatherMarkers.find(x => x.getPopup && x.getPopup());
  m.openPopup();
  await new Promise(r => setTimeout(r, 100));
  return (document.querySelector('.wind-why') || {}).textContent || '';
});
ok(/AUTO/.test(why) && /基準標高/.test(why) && /850hPa\/800hPa を高度按分/.test(why) && /50%/.test(why),
  '★★AUTO の根拠：基準標高・採用した面・按分の割合', why);
ok(/1,400m/.test(why) && /1,880m/.test(why), '★各層の**その時刻の**高さを出す', why);
ok(/モデル：MSM/.test(why), 'モデルを出す', why);

/* ---- 4. GSM の期間：手動800 はデータなしと言う・AUTO は 850/700 で按分 ---- */
const gsm = await page.evaluate(async () => {
  // 3日半より先の時刻へ（800 が null の区間）
  const k = state.allData.findIndex(d => d.time.getTime() >= Date.now() + 5 * 864e5);
  state.sliderIndex = k;
  setWindMode('800');
  return true;
});
gsmFrom = Date.now() + 4 * 864e5;
// 控えを空にして、full の応答（800 が消える区間を含む）を取り直させる
await page.evaluate(() => { windCols.clear(); refreshWeatherPoints(); });
await page.waitForTimeout(2200);
const g = await page.evaluate(() => ({
  status: (document.querySelector('.layer-status[data-id="windArrows"]') || {}).textContent || '',
  arrows: document.querySelectorAll('.wind-box').length,
  spans: [...windCols.values()].map(r => r.span),
}));
ok(g.spans.length && g.spans.every(s => s === 'full'), '★スライダーを近い範囲の外へ動かしたら、その時刻を含む幅を取り直す', g.spans);
ok(/800hPa：この時間帯はデータなし/.test(g.status) && g.arrows === 0,
  '★★★手動800：GSM の期間は「データなし」と言い、別の層で埋めない', g);
const ga = await page.evaluate(async () => {
  setWindMode('auto');
  await new Promise(r => setTimeout(r, 300));
  const c = lastWindField.cells[0];
  return { trace: c.res.trace, model: c.res.model,
    status: (document.querySelector('.layer-status[data-id="windArrows"]') || {}).textContent || '' };
});
ok(ga.trace.kind === 'interp' && ga.trace.lo.id === '850' && ga.trace.hi.id === '700' && ga.model === 'GSM',
  '★★AUTO：GSM の期間は 850/700 で按分し、モデル GSM と記録', ga);
ok(/GSM/.test(ga.status), '粗いモデルの期間だと言う', ga.status);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WINDFIELD SMOKE FAILED');
  process.exit(1);
}
console.log('WINDFIELD SMOKE PASSED');
