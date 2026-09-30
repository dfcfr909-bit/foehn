/* 山頂高度の風を、モデルごとの作り方で作る（段階 B-2・ADR-0015）。
 *   ①JMA（windMethod:'table'）は従来どおり：選んだ層に値があればその層そのもの（回帰なし）
 *   ②JMA 以外（'gh'）は固定表の最寄り層を使わず、常に山頂を挟む上下の層を gh で按分する
 *   ③挟めないときは風データなし（地上10m風や近い層で埋めない）。判定はAにならず「判定不能」
 *   ④U/V で按分する（風向の平均を取らない）
 *   ⑤processData が モデルに応じた方式を使い、窓の但し書きは「無し→」と言わない
 *   ⑥ランキング等（モデル省略）は JMA のまま
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
const near = (a, b, t = 0.05) => a != null && Math.abs(a - b) <= t;

ok(/windMethod: 'table'/.test(HTML) && (HTML.match(/windMethod: 'gh'/g) || []).length === 3, '★登録簿：JMA は table・他の3つは gh');

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
page.on('pageerror', e => errors.push(e.message));
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  return route.abort();
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(800);

const r = await page.evaluate(() => {
  // 気圧面の列を作る：{気圧: [風速, 風向, 高さ]}
  const mk = (levels) => {
    const h = { windspeed_10m: [1], winddirection_10m: [0] };
    for (const [p, [s, d, z]] of Object.entries(levels)) {
      h[`wind_speed_${p}hPa`] = [s]; h[`wind_direction_${p}hPa`] = [d]; h[`geopotential_height_${p}hPa`] = [z];
    }
    return h;
  };
  const out = {};
  // 燧ヶ岳の GFS 相当：800hPa（地中）3.2m/s・700hPa 9.6m/s
  const gfs = mk({ 925: [1.5, 270, 786], 850: [2.1, 270, 1494], 800: [3.2, 270, 1998], 700: [9.6, 270, 3095], 600: [15.5, 270, 4340] });
  const src = pickWindSource(2356);
  out.srcHPa = src.hPa;
  out.table = summitWindAt(gfs, 0, src, 'JMA', 'table');   // 従来：800hPa そのまま
  out.tableUndef = summitWindAt(gfs, 0, src, 'JMA');        // 引数なし＝従来
  out.gh = summitWindAt(gfs, 0, src, 'GFS', 'gh');          // 800/700 を高さで按分
  // 期待値：3.2 + (9.6-3.2) * (2356-1998)/(3095-1998)
  out.expGh = 3.2 + (9.6 - 3.2) * (2356 - 1998) / (3095 - 1998);
  // 山頂が最上の層より上：挟めない → 風データなし（地上風や近い層で埋めない）
  const high = mk({ 925: [1, 270, 786], 850: [2, 270, 1494], 700: [9, 270, 3095] });
  out.missing = summitWindAt(high, 0, pickWindSource(3776), 'GFS', 'gh');
  // U/V 按分：西風と東風 → 風向の平均を取らない（速さは打ち消し合う）
  const opp = mk({ 850: [10, 270, 1500], 800: [10, 90, 2000] });
  const o = summitWindAt(opp, 0, { kind: 'level', hPa: 850, alt: 1460, summitM: 1750 }, 'ICON', 'gh');
  out.opp = { spd: o.spd, kind: o.trace.kind };
  // 該当層に値があっても gh のときは使わない（富士山：600hPa は山頂の約560m上）
  const fuji = mk({ 700: [10, 270, 3100], 600: [20, 270, 4340] });
  out.fujiTable = summitWindAt(fuji, 0, pickWindSource(3776), 'JMA', 'table').spd;
  out.fujiGh = summitWindAt(fuji, 0, pickWindSource(3776), 'ICON', 'gh').spd;
  out.fujiExp = 10 + (20 - 10) * (3776 - 3100) / (4340 - 3100);
  // 窓の但し書き
  const dGh = { windTrace: out.gh.trace }, dTb = { windTrace: summitWindAt(mk({ 850: [2, 270, 1494], 700: [9, 270, 3095] }), 0, src, 'GSM', 'table').trace };
  out.labelGh = windTraceLabel(dGh, src);
  out.labelTable = windTraceLabel(dTb, src);
  out.traceTableBy = dTb.windTrace.by;
  return out;
});
ok(r.srcHPa === 800, '前提：燧ヶ岳(2356m)の固定表の最寄り層は 800hPa', r);
ok(near(r.table.spd, 3.2) && r.table.trace.kind === 'level', '★①JMA（table）は 800hPa をそのまま使う（従来）', r.table);
ok(near(r.tableUndef.spd, 3.2) && r.tableUndef.trace.kind === 'level', '★①メソッド省略も従来どおり', r.tableUndef);
ok(near(r.gh.spd, r.expGh) && r.gh.trace.kind === 'interp' && r.gh.trace.by === 'gh', '★②gh は 800/700hPa を高さで按分する', { got: r.gh.spd, exp: r.expGh, trace: r.gh.trace });
ok(r.gh.trace.lo.hPa === 800 && r.gh.trace.hi.hPa === 700, '②挟んだ層が trace に残る', r.gh.trace);
ok(r.missing.spd == null && r.missing.trace.kind === 'missing', '★③挟めないときは風データなし（地上風・近い層で埋めない）', r.missing);
ok(near(r.opp.spd, 0, 0.5) && r.opp.kind === 'interp', '★④西風と東風は U/V 按分で打ち消し合う（風向を平均しない）', r.opp);
ok(near(r.fujiTable, 20) && near(r.fujiGh, r.fujiExp), '②富士山：table は 600hPa(20)・gh は山頂高度へ按分', { t: r.fujiTable, g: r.fujiGh, e: r.fujiExp });
ok(!/無し/.test(r.labelGh) && /800\/700hPaから按分/.test(r.labelGh), '★⑤gh の但し書きは「無し→」と言わない', r.labelGh);
ok(/無し→/.test(r.labelTable), '⑤table で層が無いときは従来の「無し→」', r.labelTable);
ok(r.traceTableBy === undefined, '⑤table の trace に by は付かない（従来と同じ形）', r.traceTableBy);

// ⑤processData の配線・⑥判定
const pd = await page.evaluate(() => {
  const n = 30, h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [],
    windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  for (const [p] of [[925], [850], [800], [700], [600], [500]]) {
    h[`wind_speed_${p}hPa`] = []; h[`wind_direction_${p}hPa`] = []; h[`geopotential_height_${p}hPa`] = [];
  }
  const L = { 925: [1.5, 786], 850: [2.1, 1494], 800: [3.2, 1998], 700: [9.6, 3095], 600: [15.5, 4340], 500: [30, 5780] };
  for (let i = 0; i < n; i++) {
    h.time.push(`2026-10-01T${String(i % 24).padStart(2, '0')}:00`);
    h.temperature_2m.push(0); h.apparent_temperature.push(0); h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(770);
    h.windspeed_10m.push(1); h.winddirection_10m.push(0); h.windgusts_10m.push(1); h.weathercode.push(0); h.cloudcover.push(0);
    for (const [p, [s, z]] of Object.entries(L)) { h[`wind_speed_${p}hPa`].push(s); h[`wind_direction_${p}hPa`].push(270); h[`geopotential_height_${p}hPa`].push(z); }
  }
  const json = { hourly: h };
  const src = pickWindSource(2356);
  const kinds = arr => [...new Set(arr.map(d => d.windTrace.kind))].join();
  const jma = processData(json, src, 'jma'), def = processData(json, src), gfs = processData(json, src, 'gfs');
  return { jma: { kinds: kinds(jma), w: jma[0].wind }, def: { kinds: kinds(def), w: def[0].wind }, gfs: { kinds: kinds(gfs), w: gfs[0].wind, by: gfs[0].windTrace.by },
    gradeGfs: gradeOf(gfs[0]).grade, missingFlag: gfs[0].windMissing };
});
ok(pd.jma.kinds === 'level' && near(pd.jma.w, 3.2), '★⑤processData：JMA は 800hPa をそのまま（従来）', pd.jma);
ok(pd.def.kinds === 'level' && near(pd.def.w, 3.2), '★⑥モデル省略（ランキング等）は JMA のまま', pd.def);
ok(pd.gfs.kinds === 'interp' && pd.gfs.by === 'gh' && pd.gfs.w > 4.5 && pd.gfs.w < 5.5, '★⑤processData：GFS は按分（800 の 3.2 ではなく約 5.3）', pd.gfs);
ok(pd.missingFlag === false && pd.gradeGfs != null, '⑤風があれば判定が出る', pd);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MODELWIND SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ gh: r.gh.spd, expGh: r.expGh, fuji: [r.fujiTable, r.fujiGh], pd }));
console.log('MODELWIND SMOKE PASSED');
