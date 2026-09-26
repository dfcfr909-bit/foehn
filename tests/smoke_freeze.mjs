/* 気温パネルの0℃の線（v4.114.0・利用者の要望）。
 *   ①気温が0℃をまたぐ範囲なら、0℃の高さに濃い青の点線が引かれる（点線＝途切れがある）
 *   ②夏（範囲に0℃が入らない）は引かない。範囲を0℃まで広げて気温の線をつぶさない
 *   ③気温の線より下に敷く（drawAxes の hook。線を隠さない）
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

ok(/drawAxes: \[drawFreezingLine\]/.test(HTML), '★0℃の線は drawAxes の hook（気温の線より下に敷く）');

function fakeWeather(temps) {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    h.time.push(`${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}T00:00`);
    const d = new Date(start.getTime() + i * 3600e3);
    h.time[i] = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
    h.temperature_2m.push(temps[i % temps.length]); h.apparent_temperature.push(temps[i % temps.length]);
    h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(1); h.winddirection_10m.push(270); h.windgusts_10m.push(2);
    h.weathercode.push(1); h.cloudcover.push(20);
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
async function probe(temps) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(temps)) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1300);
  const r = await page.evaluate(() => {
    const u = skyChart, cv = u.ctx.canvas;
    const img = u.ctx.getImageData(0, 0, cv.width, cv.height).data;
    const blue = (x, y) => { const i = (y * cv.width + x) * 4; const [r, g, b] = [img[i], img[i + 1], img[i + 2]]; return b > 110 && b - r > 50 && b - g > 30; };
    const y0 = Math.round(u.valToPos(0, 'y', true));
    const inPlot = y0 >= u.bbox.top && y0 <= u.bbox.top + u.bbox.height;
    // 0℃の行（±1画素）の青の画素と、途切れ（点線）の数
    let hits = 0, runs = 0, prev = false;
    const x0 = Math.round(u.bbox.left) + 2, x1 = Math.round(u.bbox.left + u.bbox.width) - 2;
    for (let x = x0; x < x1; x++) {
      const on = [y0 - 1, y0, y0 + 1].some(y => y >= 0 && y < cv.height && blue(x, y));
      if (on) hits++; if (on && !prev) runs++; prev = on;
    }
    // プロットの中のどこかの行に同じ青の横線があるか（夏の検査用）
    let rowsWithLine = 0;
    for (let y = Math.round(u.bbox.top); y < Math.round(u.bbox.top + u.bbox.height); y++) {
      let c = 0; for (let x = x0; x < x1; x += 3) if (blue(x, y)) c++;
      if (c > (x1 - x0) / 3 * 0.3) rowsWithLine++;
    }
    return { inPlot, hits, runs, width: x1 - x0, rowsWithLine };
  });
  await page.close();
  return r;
}

const winter = await probe([-4, -2, 0, 2, 4, 6, 4, 2, 0, -2]);
ok(winter.inPlot, '前提：気温の範囲に0℃が入っている', winter);
ok(winter.hits > winter.width * 0.35, '★★0℃の高さに濃い青の線がある（横幅の大半）', winter);
ok(winter.runs > 10, '★点線になっている（途切れがある）', winter);

const summer = await probe([22, 25, 28, 30, 27, 24]);
ok(!summer.inPlot, '前提：夏は気温の範囲に0℃が入らない', summer);
ok(summer.rowsWithLine === 0, '★夏は0℃の線を引かない（範囲を広げて気温の線をつぶさない）', summer);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('FREEZE SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ winter, summer }));
console.log('FREEZE SMOKE PASSED');
