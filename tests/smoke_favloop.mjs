/* お気に入り円柱の循環と、職場🏥（v4.106.0）。
 *
 * 要望: 「ダイヤルが無限循環じゃなくなってる」→ 最後の次に最初が来るようにする。
 *   スクロールは端のある入力なので、同じ並びを FAV_CYCLES 周ぶん並べたトラックの
 *   真ん中から回し、駒の位置は周回を剰余で畳む。止まるたびに真ん中の周へ戻す。
 * ⚠ 地点が2つ以下のときは循環させない（同じ駒が左右両方に見えて紛らわしい）。
 *
 * 要望: 「職場🏥を右端に追加」→ 🏠と同じ扱い（一覧で指定・円柱に並べない・グラフと地図で同じ位置）。
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
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const pad = n => String(n).padStart(2, '0');
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
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
const FAVS = [
  { name: '那須岳', lat: 37.1250, lon: 139.9630 },
  { name: '燧ヶ岳', lat: 36.9551, lon: 139.2848 },
  { name: '火打山', lat: 36.9217, lon: 138.0677 },
  { name: '谷川岳', lat: 36.8372, lon: 138.9300 },
  { name: '会津駒', lat: 37.0470, lon: 139.3470 },
];
const WORK = { name: 'しごと', lat: 35.5000, lon: 139.5000 };   // 架空の地点

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
async function openPage(width, init, arg) {
  const page = await browser.newPage({ viewport: { width, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    return route.abort();
  });
  await page.addInitScript(init, arg);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1200);
  return page;
}
// 画面上の駒の並び（左→右）と正面の駒
const look = page => page.evaluate(() => {
  const chips = [...document.querySelectorAll('#fav-stage .fav-chip')].filter(c => c.style.display !== 'none');
  const x = c => parseFloat((c.style.transform.match(/translate3d\((-?[\d.]+)px/) || [0, NaN])[1]);
  return {
    order: chips.sort((a, b) => x(a) - x(b)).map(c => c.dataset.name),
    centered: [...document.querySelectorAll('#fav-stage .fav-chip.centered')].map(c => c.dataset.name),
    name: state.locationName,
    pos: favPos(),
    n: favCount(),
  };
});
// 駒ぶんだけ回して、止まるのを待つ
async function spin(page, steps) {
  await page.evaluate(k => {
    const el = document.getElementById('fav-rotary');
    el.scrollLeft = el.scrollLeft + k * FAV_STEP;
  }, steps);
  await page.waitForTimeout(1300);
}

/* ============ 1. 5地点：最後の次に最初が来る ============ */
{
  const page = await openPage(390, ([favs]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify(favs));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[0]));
  }, [FAVS]);
  const a = await look(page);
  ok(a.centered.length === 1 && a.centered[0] === '那須岳', '前提: 先頭の那須岳が正面', a);
  ok(a.order.indexOf('会津駒') >= 0 && a.order.indexOf('会津駒') < a.order.indexOf('那須岳'),
    '★★★先頭の左に最後の駒（会津駒）が見える＝循環している', a);
  ok(a.pos > a.n * 4, '★真ん中の周から回し始める（左へ回す余地がある）', a);

  // 左へ1つ回す → 最後の駒へ
  await spin(page, -1);
  const b = await look(page);
  ok(b.name === '会津駒' && b.centered[0] === '会津駒', '★★★先頭から左へ回すと最後の地点へ移る', b);

  // 右へ2つ回す → 会津駒 → 那須岳 → 燧ヶ岳
  await spin(page, 2);
  const c = await look(page);
  ok(c.name === '燧ヶ岳', '★★最後から右へ回すと先頭へ戻り、その先へ進む', c);

  // 何周も回しても端に着かない（止まるたびに真ん中の周へ戻す）
  await page.evaluate(() => {
    const el = document.getElementById('fav-rotary');
    el.scrollLeft = el.scrollWidth;                 // 右端まで一気に
  });
  await page.waitForTimeout(1300);
  const d = await look(page);
  const e = await page.evaluate(() => {
    const el = document.getElementById('fav-rotary');
    return { left: el.scrollLeft, max: el.scrollWidth - el.clientWidth };
  });
  ok(d.centered.length === 1 && d.centered[0] === d.name, '端まで回しても正面の駒と選択が一致する', d);
  ok(e.left > e.max * 0.3 && e.left < e.max * 0.7, '★★止まったら真ん中の周へ戻す（次も左右どちらへも回せる）', e);
  // 戻したあとも並びが連続している
  const f = await look(page);
  ok(f.order.length >= 3 && f.centered[0] === f.name, '戻した直後も見た目が崩れない', f);
  await page.close();
}

/* ============ 2. 2地点：循環させない ============ */
{
  const page = await openPage(390, ([favs]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify(favs.slice(0, 2)));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[0]));
  }, [FAVS]);
  const a = await look(page);
  ok(a.n === 2, '前提: 2地点', a);
  ok(a.order[0] === '那須岳', '★2地点では先頭の左に何も出さない（同じ駒が左右に見えない）', a);
  ok(await page.evaluate(() => !favCircular()), '2地点では循環しない');
  await page.close();
}

/* ============ 3. 職場🏥 ============ */
for (const w of [390, 360]) {
  const page = await openPage(w, ([favs, work]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify([...favs, work]));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[0]));
    localStorage.removeItem('sotoki_work');
  }, [FAVS, WORK]);
  const rect = () => page.evaluate(() => {
    const r = document.getElementById('btn-work').getBoundingClientRect();
    const bar = document.getElementById('fav-bar').getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width),
      rightGap: Math.round(bar.right - r.right), hit: !!(el && el.closest('#btn-work')) };
  });
  const onChart = await rect();
  ok(onChart.rightGap < 12 && onChart.w >= 40, `★★(w=${w}) 🏥は最下段の右端`, onChart);
  ok(onChart.hit, `(w=${w}) 🏥が押せる`);
  await page.evaluate(() => openMap());
  await page.waitForTimeout(500);
  const onMap = await rect();
  ok(Math.abs(onChart.x - onMap.x) <= 1 && Math.abs(onChart.y - onMap.y) <= 1 && onMap.hit,
    `★★★(w=${w}) 🏥がグラフと地図で同じ位置`, { onChart, onMap });
  await page.evaluate(() => closeMap());

  if (w === 390) {
    // 一覧の「しごと」の行の🏥で指定
    await page.evaluate(() => { document.getElementById('loading-overlay').style.display = 'none'; openFav(); });
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => {
      const row = [...document.querySelectorAll('#fav-list .fav-item')]
        .find(x => x.querySelector('.fav-item-name').textContent === 'しごと');
      row.querySelector('.fav-work').click();
      return { work: loadSpot('work'), home: loadSpot('home'), name: state.locationName,
        lit: [...document.querySelectorAll('#fav-list .fav-work.on')].length };
    });
    ok(r.work && r.work.name === 'しごと', '★★お気に入り一覧の🏥で職場を指定できる', r);
    ok(r.home === null, '🏥を押しても自宅は変わらない', r);
    ok(r.lit === 1 && r.name === '那須岳', '一覧で職場の行だけ🏥が点き、その行を選んだことにはならない', r);
    await page.evaluate(() => closeFav());
    const items = await page.evaluate(() => favRotaryItems().map(f => f.name));
    ok(!items.includes('しごと'), '★★職場は円柱に並べない', items);
    await page.evaluate(() => goSpot('work'));
    await page.waitForTimeout(700);
    const at = await page.evaluate(() => ({ name: state.locationName,
      on: document.getElementById('btn-work').classList.contains('on'),
      homeOn: document.getElementById('btn-home').classList.contains('on'),
      centered: [...document.querySelectorAll('#fav-stage .fav-chip.centered')].length }));
    ok(at.name === 'しごと' && at.on && !at.homeOn, '★★★🏥で職場へ移り、🏥だけが点く', at);
    ok(at.centered === 0, '★職場を見ている間は円柱の駒を「選択中」に見せない', at);
    // 未設定の🏠は聞いてくる（🏥とは別）
    const msgs = [];
    page.once('dialog', d => { msgs.push(d.message()); d.dismiss(); });
    await page.evaluate(() => goSpot('home'));
    await page.waitForTimeout(100);
    ok(msgs.length === 1 && msgs[0].includes('自宅'), '未設定の🏠は「自宅にしますか？」と聞く（職場とは別に持つ）', msgs);
  }
  await page.close();
}

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('FAVLOOP SMOKE FAILED');
  process.exit(1);
}
console.log('FAVLOOP SMOKE PASSED');
