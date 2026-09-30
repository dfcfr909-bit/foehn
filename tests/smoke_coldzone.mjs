/* 氷点下のゾーン（v4.143.0・利用者の要望「氷点下は薄い青で、低いほど寒そうな色に」）。
 *   ①気温が0℃をまたぐ範囲なら、0℃の線より下に青みのある地色が敷かれる
 *   ②深いほど濃い（青の度合いが単調に増える）。0℃の真下はほぼ透明
 *   ③0℃より上には敷かない
 *   ④夏（範囲に0℃が入らない）は敷かない
 *   ⑤気温の線・0℃の点線の下に敷く（smoke_freeze が同じ hook を見ている）
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

ok(/drawColdZone\(u\);/.test(HTML), '★ゾーンは drawFreezingLine（drawAxes の hook）から描く＝気温の線より下');

function fakeWeather(temps) {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    const t = temps[i % temps.length];
    h.temperature_2m.push(t); h.apparent_temperature.push(t);
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
  await page.evaluate(() => {
    /* 背景（昼夜・気温の塗り）は行ごとに色が違うので、青みの絶対値では比べられない。
       ゾーンを描く関数を空にして組み直し、**同じ行を「ある／なし」で測った差**を見る。 */
    const measure = window.__measure = () => {
      const u = skyChart, cv = u.ctx.canvas;
      const img = u.ctx.getImageData(0, 0, cv.width, cv.height).data;
      const y0 = u.valToPos(0, 'y', true);
      const top = u.bbox.top, bottom = u.bbox.top + u.bbox.height;
      const inPlot = y0 >= top && y0 < bottom;
      const x0 = Math.round(u.bbox.left) + 4, x1 = Math.round(u.bbox.left + u.bbox.width) - 4;
      const blue = y => {
        let s = 0, n = 0;
        for (let x = x0; x < x1; x += 3) { const i = (Math.round(y) * cv.width + x) * 4; s += img[i + 2] - img[i]; n++; }
        return s / n;
      };
      const rows = {};
      if (inPlot) {
        const span = bottom - y0;
        rows.aboveZero = blue(Math.max(top + 2, y0 - 14));
        rows.justBelow = blue(y0 + 3);
        rows.q1 = blue(y0 + span * 0.25);
        rows.mid = blue(y0 + span * 0.5);
        rows.q3 = blue(y0 + span * 0.75);
        rows.bottom = blue(bottom - 3);
      }
      return { inPlot, rows, tBottom: inPlot ? u.posToVal(bottom, 'y', true) : null };
    };
    const withZone = measure();
    window.__withZone = withZone;
    window.__origZone = window.drawColdZone;
    window.drawColdZone = () => {};
    buildCharts();
  });
  await page.waitForTimeout(600);   // uPlot の描画を待つ
  const r = await page.evaluate(() => {
    const withZone = window.__withZone, without = window.__measure();
    window.drawColdZone = window.__origZone;
    const diff = {};
    for (const k of Object.keys(withZone.rows)) diff[k] = withZone.rows[k] - (without.rows[k] ?? NaN);
    return { inPlot: withZone.inPlot, withoutInPlot: without.inPlot, tBottom: withZone.tBottom, diff };
  });
  await page.close();
  return r;
}

const winter = await probe([-14, -10, -6, -2, 0, 2, 4, 2, -2, -8]);
ok(winter.inPlot, '前提：気温の範囲に0℃が入っている', winter);
const w = winter.diff;
ok(w.bottom > 15, '★①0℃より下（深いところ）は、ゾーンが無いときより青い', winter);
ok(Math.abs(w.aboveZero) < 1, '★③0℃より上には敷かない（ある／なしで同じ）', winter);
ok(w.justBelow < w.q1 && w.q1 < w.mid && w.mid < w.q3 && w.q3 <= w.bottom + 1, '★②深いほど青が増える（単調）', winter);
ok(w.justBelow < 6, '★②0℃の真下はほぼ透明（0℃の線の点線を潰さない）', winter);
ok(winter.tBottom < 0, '前提：パネルの下端は氷点下', winter);

const summer = await probe([22, 25, 28, 30, 27, 24]);
ok(!summer.inPlot, '前提：夏は範囲に0℃が入らない', summer);
ok(Object.keys(summer.diff).length === 0, '★④夏は敷かない（そもそも0℃が範囲に無い）', summer);

// 0℃が範囲の上端付近（ほとんど氷点下）でも下端まで塗る
const cold = await probe([-20, -18, -15, -12, -10, -8, -3, -1]);
ok(!cold.inPlot || cold.diff.bottom > 15, '極寒のときも例外なく描ける', cold);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('COLDZONE SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ winter: winter.diff, tBottom: winter.tBottom, cold: cold.diff }));
console.log('COLDZONE SMOKE PASSED');
