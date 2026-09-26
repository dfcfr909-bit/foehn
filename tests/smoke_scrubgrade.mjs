/* スクラバー帯の判定バー（`drawScrubber`）。
 *
 * 「緑マークが続く場合は白線で区切らずに緑ラインで繋げて」という要望（v4.105.0）。
 * - **A（緑）が続くところは継ぎ目なく1本**になっていること
 * - **B・Cは1時間ずつ区切ったまま**であること（長く続くと何時間続くかを数えにくくなる）
 * ⚠ 1時間ずつ隙間なく並べて塗る実装だと、座標が小数のとき境目に薄い継ぎ目が残る。
 *   だから「境目の画素が緑そのものか」を画素で見る。
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
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const pad = n => String(n).padStart(2, '0');
// 10時間ごとに「荒れ」を挟む。穏やかな区間はA、荒れた区間はCになる
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    const bad = Math.floor(i / 10) % 4 === 0;
    h.temperature_2m.push(18); h.apparent_temperature.push(18);
    h.precipitation.push(bad ? 3 : 0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(bad ? 12 : 2); h.winddirection_10m.push(200); h.windgusts_10m.push(bad ? 18 : 4);
    h.weathercode.push(bad ? 61 : 1); h.cloudcover.push(bad ? 90 : 20);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:30`); daily.sunset.push(`${ds}T17:40`);
  }
  return { hourly: h, daily, elevation: 120 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
// ⚠ 倍率を変えて見る。1時間の幅が小数になると継ぎ目が出やすい
for (const dpr of [1, 2, 3]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 }, deviceScaleFactor: dpr });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last',
    JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1200);

  const r = await page.evaluate(() => {
    drawScrubber();
    const cv = document.getElementById('scrubber-canvas');
    const ctx = cv.getContext('2d');
    const k = cv.width / parseFloat(cv.style.width);
    const grades = state.allData.map(d => judgePoint(d).grade);
    const pph = pxPerHourVal;
    const y = Math.round((17 + 17 / 2) * k);   // 判定バーの縦の中ほど
    // 境目（i と i+1 の間）の画素。境目をまたいで2画素ぶん見る
    const seam = i => {
      const xb = (idxToX(i + 1) - pph / 2) * k;
      return [Math.floor(xb) - 1, Math.floor(xb), Math.ceil(xb)].map(x => [...ctx.getImageData(x, y, 1, 1).data]);
    };
    const hex = GRADE_COL.A.replace('#', '');
    const A = [0, 2, 4].map(o => parseInt(hex.substr(o, 2), 16));
    const isA = px => px.every((v, c) => c > 2 || Math.abs(v - A[c]) <= 6);
    const out = { dpr: devicePixelRatio, pph, aa: [], cc: [], counts: {} };
    grades.forEach(g => { out.counts[g] = (out.counts[g] || 0) + 1; });
    for (let i = 0; i < grades.length - 1; i++) {
      // 日付の区切り線（0時）と現在時刻の印は判定バーの上に描くので、そこは見ない
      if (state.allData[i + 1].time.getHours() === 0) continue;
      const nf = nowIndexFrac();
      if (nf != null && Math.abs(nf - (i + 0.5)) < 1.5) continue;
      if (grades[i] === 'A' && grades[i + 1] === 'A' && out.aa.length < 20) out.aa.push({ i, ok: seam(i).every(isA), px: seam(i) });
      if (grades[i] === 'C' && grades[i + 1] === 'C' && out.cc.length < 5) {
        const px = seam(i);
        // 区切りが残っていれば、境目のどこかが赤より明るい
        out.cc.push({ i, gap: px.some(p => p[1] > 120) });
      }
    }
    return out;
  });
  ok(r.aa.length > 5, `前提(dpr=${dpr}): A が続く区間がある`, r.counts);
  ok(r.cc.length > 0, `前提(dpr=${dpr}): C が続く区間がある`, r.counts);
  const badA = r.aa.filter(s => !s.ok);
  ok(badA.length === 0, `★★★(dpr=${dpr}) Aが続くところは継ぎ目なく1本（白線・薄い継ぎ目を出さない）`, badA.slice(0, 3));
  ok(r.cc.every(s => s.gap), `★★(dpr=${dpr}) Cは1時間ずつ区切ったまま`, r.cc);
  await page.close();
}
ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SCRUBGRADE SMOKE FAILED');
  process.exit(1);
}
console.log('SCRUBGRADE SMOKE PASSED');
