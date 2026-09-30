/* 予報モデルの切り替え UI（段階 B-3・ADR-0015）。
 *   ①ヘッダーにチップ「JMA ▾」。JMA のときは橙にしない
 *   ②押すとシートが開き、4つのモデルが並ぶ（JMA が表示中）。✕・背景・Esc で閉じる
 *   ③GFS を選ぶと models=gfs_seamless で取り直し、チップ・ヘッダーが橙になり、帯・窓も GFS
 *   ④地点を変えても選んだモデルを維持する（チップは橙のまま）
 *   ⑤取得に失敗（HTTP エラー／空の応答）したら、表示は直前のデータのまま・モデルは元に戻り・理由の帯が出る
 *   ⑥JMA を選ぶと元に戻る（橙が消える）
 *   ⑦覚えない：ページを開き直すと JMA
 *   ⑧幅 360px でもチップが収まり、ヘッダーが折り返さない
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

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [],
    wind_speed_900hPa: [], wind_speed_800hPa: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(3); h.apparent_temperature.push(1);
    h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(2); h.winddirection_10m.push(270); h.windgusts_10m.push(4);
    h.weathercode.push(1); h.cloudcover.push(20);
    h.wind_speed_900hPa.push(i < 200 ? 6 : null); h.wind_speed_800hPa.push(i < 200 ? 6 : null);
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
const requests = [];
let failMode = null;   // 'http' | 'empty' | null（models= の値ごとの失敗を作る）
let failModel = null;

async function newPage(width = 390) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) {
      const m = (url.match(/models=([^&]+)/) || [])[1];
      if (m) requests.push(m);
      if (m && failModel && m === failModel) {
        if (failMode === 'http') return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":true}' });
        if (failMode === 'empty') return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ hourly: { time: [] }, elevation: 1 }) });
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    }
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36, lon: 138, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1300);
  return page;
}
const snap = page => page.evaluate(() => {
  const b = document.getElementById('btn-model'), hd = document.getElementById('header');
  const note = document.getElementById('model-note');
  return {
    chip: b.textContent, alt: b.classList.contains('alt'), headerAlt: hd.classList.contains('model-alt'),
    sheetHidden: document.getElementById('model-sheet').hidden,
    model: state.model, dataModel: state.dataModel,
    bandModels: [...new Set(state.allData.map(d => d.model))].join(),
    noteOn: note.classList.contains('on'), noteText: note.textContent,
    firstTemp: state.allData[0].temp,
  };
});

// ①②
let page = await newPage();
let a = await snap(page);
ok(a.chip === 'JMA ▾' && !a.alt && !a.headerAlt, '★①JMA のときは橙にしない', a);
ok(a.sheetHidden, '①シートは初め閉じている', a);
await page.click('#btn-model');
const sheet = await page.evaluate(() => ({
  hidden: document.getElementById('model-sheet').hidden,
  rows: [...document.querySelectorAll('.model-row')].map(r => ({ k: r.dataset.k, cur: r.classList.contains('cur'), h: r.getBoundingClientRect().height, text: r.textContent })),
}));
ok(!sheet.hidden && sheet.rows.map(r => r.k).join() === 'jma,gfs,icon,ecmwf', '★②シートに4つ並ぶ', sheet);
ok(sheet.rows[0].cur && sheet.rows.slice(1).every(r => !r.cur), '②JMA が表示中', sheet);
ok(sheet.rows.every(r => r.h >= 44), '②行は押しやすい高さ（44px以上）', sheet.rows.map(r => r.h));
ok(/突風あり/.test(sheet.rows[1].text) && /約7日/.test(sheet.rows[2].text), '②各モデルの特徴が書いてある', sheet.rows.map(r => r.text));
// 閉じ方：✕・Esc・背景
await page.click('#model-sheet-close'); ok((await snap(page)).sheetHidden, '②✕で閉じる');
await page.click('#btn-model'); await page.keyboard.press('Escape'); ok((await snap(page)).sheetHidden, '②Esc で閉じる');
await page.click('#btn-model'); await page.mouse.click(10, 10); ok((await snap(page)).sheetHidden, '②背景で閉じる');

// ③GFS を選ぶ
requests.length = 0;
await page.click('#btn-model'); await page.click('.model-row[data-k="gfs"]');
await page.waitForTimeout(1200);
a = await snap(page);
ok(requests.includes('gfs_seamless'), '★③models=gfs_seamless で取り直す', requests);
ok(a.chip === '⚠ GFS ▾' && a.alt && a.headerAlt, '★③チップとヘッダーが橙になる', a);
ok(a.bandModels === 'GFS' && a.model === 'gfs' && a.dataModel === 'gfs' && a.sheetHidden, '③帯も GFS・シートは閉じる', a);
const pop = await page.evaluate(() => (updatePopup(), document.getElementById('pop-model').textContent));
ok(/GFS/.test(pop), '③窓も「モデル：GFS」', pop);
const ariaLabel = await page.evaluate(() => document.getElementById('btn-model').getAttribute('aria-label'));
ok(/GFS/.test(ariaLabel) && /JMA ではありません/.test(ariaLabel), '③読み上げでも JMA ではないと分かる', ariaLabel);

// ④地点を変えても維持
requests.length = 0;
await page.evaluate(async () => { state.locationName = '別の山'; await fetchWeather(37, 139); });
await page.waitForTimeout(800);
a = await snap(page);
ok(requests.includes('gfs_seamless') && !requests.includes('jma_seamless'), '★④地点を変えても GFS で取る', requests);
ok(a.alt && a.headerAlt && a.model === 'gfs' && a.bandModels === 'GFS', '④橙のまま', a);

// ⑤失敗：HTTP エラー（表示は直前＝GFS のまま）
failModel = 'icon_seamless'; failMode = 'http';
const before = await snap(page);
await page.click('#btn-model'); await page.click('.model-row[data-k="icon"]');
await page.waitForTimeout(1200);
a = await snap(page);
ok(a.model === 'gfs' && a.dataModel === 'gfs' && a.bandModels === 'GFS', '★⑤HTTP エラー：モデルは元に戻り、表示は GFS のまま', a);
ok(a.noteOn && /ICON/.test(a.noteText) && /取得に失敗/.test(a.noteText) && /GFS/.test(a.noteText), '★⑤理由の帯が出る（ICON の失敗・表示は GFS のまま）', a.noteText);
ok(a.firstTemp === before.firstTemp && a.chip === '⚠ GFS ▾', '⑤データもチップも変わらない', { a, before });
ok(await page.evaluate(() => getComputedStyle(document.getElementById('loading-overlay')).display === 'none'), '⑤取得中の覆いが残らない');
await page.click('#model-note'); ok(!(await snap(page)).noteOn, '⑤帯は押すと消える');
// ⑤失敗：空の応答
failModel = 'ecmwf_ifs025'; failMode = 'empty';
await page.click('#btn-model'); await page.click('.model-row[data-k="ecmwf"]');
await page.waitForTimeout(1200);
a = await snap(page);
ok(a.model === 'gfs' && a.dataModel === 'gfs' && a.noteOn && /データが空/.test(a.noteText), '★⑤空の応答も失敗として扱い、理由を出す', a);
failModel = null; failMode = null;

// ⑥JMA に戻す
requests.length = 0;
await page.click('#btn-model'); await page.click('.model-row[data-k="jma"]');
await page.waitForTimeout(1200);
a = await snap(page);
ok(a.chip === 'JMA ▾' && !a.alt && !a.headerAlt && a.bandModels === 'MSM,移行,GSM' && requests.includes('jma_seamless'), '★⑥JMA に戻すと橙が消え、帯も MSM/移行/GSM', { a, requests });
ok(!a.noteOn, '⑥帯は残らない', a);
await page.close();

// ⑦覚えない
page = await newPage();
await page.click('#btn-model'); await page.click('.model-row[data-k="icon"]'); await page.waitForTimeout(1000);
ok((await snap(page)).alt, '前提：ICON に切り替えた');
const stored = await page.evaluate(() => Object.keys(localStorage).filter(k => /model/i.test(k) || /icon|gfs/i.test(localStorage.getItem(k) || '')));
ok(stored.length === 0, '★⑦モデルを localStorage に書かない', stored);
await page.close();
page = await newPage();
a = await snap(page);
ok(a.chip === 'JMA ▾' && !a.alt && a.model === 'jma', '★⑦開き直すと JMA', a);
await page.close();

// ⑧幅 360px
for (const w of [360, 390]) {
  page = await newPage(w);
  await page.click('#btn-model'); await page.click('.model-row[data-k="ecmwf"]'); await page.waitForTimeout(1000);
  const lay = await page.evaluate(() => {
    const b = document.getElementById('btn-model').getBoundingClientRect(), h = document.getElementById('header').getBoundingClientRect();
    return { right: b.right, w: window.innerWidth, chipH: b.height, headerH: h.height, chipTop: b.top, headerTop: h.top };
  });
  ok(lay.right <= lay.w + 0.5 && lay.chipH >= 34, `★⑧${w}px：チップが画面内に収まり、押しやすい高さ`, lay);
  ok(lay.headerH < 90, `⑧${w}px：ヘッダーが折り返して太らない`, lay);
  await page.close();
}

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MODELUI SMOKE FAILED');
  process.exit(1);
}
console.log('MODELUI SMOKE PASSED');
