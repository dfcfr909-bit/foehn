/* 自宅（🏠）と最下段のバー（v4.105.0）。
 *
 * 要望: 「自宅はホームマーク🏠で画面上に常に配置。できればグラフと地図で位置が変わらない場所」
 * - **🏠はグラフと地図で同じ位置**（器 #fav-bar ごと地図の下へ引っ越す。余白を揃えてある）
 * - 自宅はお気に入り一覧の🏠で指定する。未設定で🏠を押したら「いまの地点を自宅に？」と聞く
 * - 自宅は円柱に並べない（🏠専用）。自宅を見ている間、円柱の駒を「選択中」に見せない
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
];
const HOME = { name: 'うち', lat: 35.0000, lon: 139.0000 };   // 架空の地点

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
const homeRect = page => page.evaluate(() => {
  const r = document.getElementById('btn-home').getBoundingClientRect();
  return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
});

/* ============ 1. 🏠はグラフと地図で同じ位置 ============ */
for (const w of [390, 360]) {
  const page = await openPage(w, ([favs]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify(favs));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[1]));
  }, [FAVS]);
  const onChart = await homeRect(page);
  // 見えていて押せる（読み込みの覆いなどの下に潜っていない）
  const hitChart = await page.evaluate(() => {
    const r = document.getElementById('btn-home').getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!(el && el.closest('#btn-home'));
  });
  await page.evaluate(() => openMap());
  await page.waitForTimeout(500);
  const onMap = await homeRect(page);
  const hitMap = await page.evaluate(() => {
    const r = document.getElementById('btn-home').getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!(el && el.closest('#btn-home'));
  });
  ok(onChart.w >= 40 && onChart.h >= 40, `(w=${w}) 🏠は押しやすい大きさ（44px前後）`, onChart);
  ok(hitChart, `★(w=${w}) グラフ画面で🏠が押せる（何かの下に潜っていない）`);
  ok(hitMap, `★(w=${w}) 地図画面で🏠が押せる`);
  ok(Math.abs(onChart.x - onMap.x) <= 1 && Math.abs(onChart.y - onMap.y) <= 1,
    `★★★(w=${w}) 🏠がグラフと地図で同じ位置`, { onChart, onMap });
  ok(await page.evaluate(() => document.getElementById('map-fav-slot').contains(document.getElementById('fav-rotary'))),
    `(w=${w}) 地図を開いている間は円柱も一緒に地図の下へ`);
  await page.evaluate(() => closeMap());
  await page.waitForTimeout(300);
  const back = await homeRect(page);
  ok(Math.abs(back.x - onChart.x) <= 1 && Math.abs(back.y - onChart.y) <= 1,
    `(w=${w}) 地図を閉じたら元の位置へ戻る`, { back, onChart });
  await page.close();
}

/* ============ 2. 未設定のとき：押すと「いまの地点を自宅に？」 ============ */
{
  const page = await openPage(390, ([favs]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify(favs));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[0]));
    localStorage.removeItem('sotoki_home');
  }, [FAVS]);
  ok(await page.evaluate(() => document.getElementById('btn-home').classList.contains('unset')),
    '未設定の🏠は薄く出す');
  const dialogs = [];
  page.once('dialog', d => { dialogs.push(d.message()); d.dismiss(); });
  await page.evaluate(() => goHome());
  await page.waitForTimeout(100);
  ok(dialogs.length === 1 && dialogs[0].includes('那須岳'), '★未設定で押すと、いまの地点を自宅にするか聞く', dialogs);
  ok(await page.evaluate(() => loadHome() === null), '★取り消したら設定しない');
  page.once('dialog', d => d.accept());
  await page.evaluate(() => goHome());
  await page.waitForTimeout(100);
  const h = await page.evaluate(() => loadHome());
  ok(h && h.name === '那須岳' && Math.abs(h.lat - 37.125) < 1e-6, '★★承諾したら、いまの地点が自宅になる', h);
  ok(await page.evaluate(() => document.getElementById('btn-home').classList.contains('on')),
    'いま自宅を見ていれば🏠が点く');
  await page.close();
}

/* ============ 3. お気に入り一覧で指定・🏠で移動・円柱には並べない ============ */
{
  const page = await openPage(390, ([favs, home]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify([...favs, home]));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[1]));
    localStorage.removeItem('sotoki_home');
  }, [FAVS, HOME]);
  // 一覧の「うち」の行の🏠を押す
  await page.evaluate(() => { document.getElementById('loading-overlay').style.display = 'none'; openFav(); });
  await page.waitForTimeout(200);
  /* v4.108.0: 自宅・職場の設定は**見出しの右の🏠／🏥**から開く（利用者：「お気に入り地点の右側が
     空いてる。そこに🏠🏥ってマークを置くだけでいい」）。ふだんは欄も各行のボタンも出さない */
  const fold = await page.evaluate(() => {
    const shown = el => !!el && getComputedStyle(el).display !== 'none';
    const head = document.getElementById('fav-header');
    const hb = document.getElementById('btn-fav-spot-home'), wb = document.getElementById('btn-fav-spot-work');
    const title = head.querySelector('h2').getBoundingClientRect();
    const close = document.getElementById('btn-fav-close').getBoundingClientRect();
    const hr = hb.getBoundingClientRect(), wr = wb.getBoundingClientRect();
    const rowBtns = sel => [...document.querySelectorAll(`#fav-list .fav-item ${sel}`)];
    const r = {
      inHeader: head.contains(hb) && head.contains(wb),
      between: hr.left > title.left && wr.right <= close.left + 1 && Math.abs(hr.top - close.top) < 12,
      noSpots: !document.getElementById('fav-spots') || !document.getElementById('fav-list').contains(document.getElementById('fav-spots')),
      rowBtnsHidden: rowBtns('.fav-spot').every(b => !shown(b)),
      noToggleRow: !document.getElementById('fav-spots-toggle'),
    };
    hb.click();
    r.homeRow = !!document.querySelector('#fav-spots .fav-spot-row[data-kind="home"]');
    r.workRowWhileHome = !!document.querySelector('#fav-spots .fav-spot-row[data-kind="work"]');
    r.homeBtns = rowBtns('.fav-home').every(b => shown(b));
    r.workBtnsWhileHome = rowBtns('.fav-work').some(b => shown(b));
    hb.click();
    r.closedAgain = !document.querySelector('#fav-spots .fav-spot-row') && rowBtns('.fav-spot').every(b => !shown(b));
    return r;
  });
  ok(fold.inHeader && fold.between, '★★★見出しの右（✕の左）に🏠と🏥のマークがある', fold);
  ok(fold.noSpots && fold.rowBtnsHidden && fold.noToggleRow, '★★★ふだんは自宅・職場の欄も各行の🏠／🏥も出さない', fold);
  ok(fold.homeRow && fold.homeBtns, '★★🏠を押すと自宅の欄と各行の🏠が出る', fold);
  ok(!fold.workRowWhileHome && !fold.workBtnsWhileHome, '★🏠を押しても職場のぶんは出さない', fold);
  ok(fold.closedAgain, 'もう一度押すと閉じる', fold);
  await page.evaluate(() => toggleFavSpots('home'));
  const listed = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('#fav-list .fav-item')];
    const row = rows.find(r => r.querySelector('.fav-item-name').textContent === 'うち');
    row.querySelector('.fav-home').click();
    return { n: rows.length, home: loadHome(),
      favNames: loadFavs().map(f => f.name),
      rowsAfter: [...document.querySelectorAll('#fav-list .fav-item .fav-item-name')].map(e => e.textContent),
      spotText: document.querySelector('#fav-spots .fav-spot-row[data-kind="home"] .fav-item-name').textContent,
      name: state.locationName };
  });
  ok(listed.n === 4, '前提: お気に入りが4件', listed);
  ok(listed.home && listed.home.name === 'うち', '★★お気に入り一覧の🏠で自宅を指定できる', listed);
  /* v4.107.0: 自宅・職場はお気に入りとは別の項目。指定したらお気に入りから抜く（利用者の要望） */
  ok(!listed.favNames.includes('うち') && !listed.rowsAfter.includes('うち'),
    '★★★自宅にした地点はお気に入りから抜ける（別の項目）', listed);
  ok(listed.spotText.includes('うち'), '★★一覧の上の自宅の欄に出る', listed);
  ok(listed.name === '燧ヶ岳', '★🏠を押しても、その行を選んだことにはならない', listed);
  await page.evaluate(() => closeFav());

  const items = await page.evaluate(() => favRotaryItems().map(f => f.name));
  ok(!items.includes('うち'), '★★自宅は円柱に並べない（🏠専用）', items);

  // 🏠で自宅へ
  await page.evaluate(() => goHome());
  await page.waitForTimeout(700);
  const at = await page.evaluate(() => ({
    name: state.locationName, lat: state.lat, lon: state.lon,
    on: document.getElementById('btn-home').classList.contains('on'),
    centered: [...document.querySelectorAll('#fav-stage .fav-chip.centered')].map(c => c.dataset.name),
    items: favRotaryItems().map(f => f.name),
  }));
  ok(at.name === 'うち' && Math.abs(at.lat - 35) < 1e-6 && Math.abs(at.lon - 139) < 1e-6,
    '★★★🏠を押すと自宅へ移る', at);
  ok(at.on, '自宅を見ている間は🏠が点く', at);
  ok(!at.items.includes('うち'), '★自宅を見ていても円柱の先頭に足さない', at);
  ok(at.centered.length === 0, '★★自宅を見ている間、円柱の駒を「選択中」に見せない', at);

  // 円柱を回せば、そこへ移る（自宅から抜けられる）
  await page.evaluate(() => { document.getElementById('fav-rotary').scrollLeft = 2 * FAV_STEP; });
  await page.waitForTimeout(1200);
  const spun = await page.evaluate(() => ({ name: state.locationName,
    on: document.getElementById('btn-home').classList.contains('on') }));
  ok(spun.name === '火打山', '★★自宅から円柱を回せば、その地点へ移る', spun);
  ok(!spun.on, '自宅を離れたら🏠は消灯', spun);

  // 地図の中でも🏠で自宅へ
  await page.evaluate(() => openMap());
  await page.waitForTimeout(500);
  await page.click('#btn-home');
  // 地図を開いている間は、取得中の文言が地点名の欄に出る（showLoading）。取り終わるまで待つ
  await page.waitForFunction(() => !/取得中/.test(document.getElementById('map-picked-name').textContent), null, { timeout: 5000 }).catch(() => {});
  ok(await page.evaluate(() => state.locationName === 'うち' && document.getElementById('map-picked-name').textContent === 'うち'),
    '★★地図の中でも🏠で自宅へ移る（地点名も変わる）');

  // 自宅の欄の「外す」→ お気に入りへ戻る（黙って消さない）
  await page.evaluate(() => { closeMap(); openFav(); toggleFavSpots('home'); });
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('#fav-spots .fav-spot-row[data-kind="home"] .fav-spot-off').click());
  const off = await page.evaluate(() => ({ home: loadHome(), favs: loadFavs().map(f => f.name) }));
  ok(off.home === null, '★自宅の欄の「外す」で指定を外せる', off);
  ok(off.favs.includes('うち'), '★★★外した地点はお気に入りへ戻る（黙って消さない）', off);

  // 自宅の欄の「いまの地点に」：いま見ている地点がお気に入りなら、そこから抜いて自宅にする
  const here = await page.evaluate(() => {
    const cur = state.locationName;
    document.querySelector('#fav-spots .fav-spot-row[data-kind="home"] .fav-spot-here').click();
    return { cur, home: loadHome(), favs: loadFavs().map(f => f.name) };
  });
  ok(here.home && here.home.name === here.cur && !here.favs.includes(here.cur),
    '★★「いまの地点に」でいまの地点が自宅になり、お気に入りからは抜ける', here);
  // 置き換え：別の地点を🏠にすると、前の自宅はお気に入りへ戻る
  page.once('dialog', d => d.accept());
  const swap = await page.evaluate(() => {
    const row = [...document.querySelectorAll('#fav-list .fav-item')]
      .find(x => x.querySelector('.fav-item-name').textContent === '那須岳');
    row.querySelector('.fav-home').click();
    return { home: loadHome(), favs: loadFavs().map(f => f.name) };
  });
  ok(swap.home.name === '那須岳' && swap.favs.includes(here.cur) && !swap.favs.includes('那須岳'),
    '★★自宅を置き換えると、前の自宅はお気に入りへ戻る', swap);
  // ★は自宅・職場をお気に入りに入れない
  const star = await page.evaluate(() => {
    closeFav();
    const h = loadHome();
    state.lat = h.lat; state.lon = h.lon; state.locationName = h.name;
    const msgs = []; const a = window.alert; window.alert = m => msgs.push(m);
    toggleFavStar(); window.alert = a;
    return { msgs, favs: loadFavs().map(f => f.name) };
  });
  ok(!star.favs.includes('那須岳') && star.msgs.length === 1, '★自宅の地点で★を押してもお気に入りに入れない', star);
  await page.close();
}

/* ============ 3b. 以前の版で「お気に入りの中で指定した」自宅は、起動時にお気に入りから抜く ============ */
{
  const page = await openPage(390, ([favs, home]) => {
    localStorage.setItem('sotoki_favs', JSON.stringify([...favs, home]));
    localStorage.setItem('sotoki_home', JSON.stringify(home));
    localStorage.setItem('sotoki_last', JSON.stringify(favs[0]));
  }, [FAVS, HOME]);
  const m = await page.evaluate(() => ({ favs: loadFavs().map(f => f.name), home: loadHome() }));
  ok(!m.favs.includes('うち') && m.favs.length === 3 && m.home && m.home.name === 'うち',
    '★★起動時に、お気に入りに残っている自宅を抜く（v4.106.0 以前の保存値）', m);
  await page.close();
}

/* ============ 4. 壊れた保存値で落ちない ============ */
{
  const page = await openPage(390, () => { localStorage.setItem('sotoki_home', '{壊れ'); });
  ok(await page.evaluate(() => loadHome() === null && document.getElementById('btn-home').classList.contains('unset')),
    '自宅の保存値が壊れていても落ちず、未設定として扱う');
  await page.close();
}

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('HOME SMOKE FAILED');
  process.exit(1);
}
console.log('HOME SMOKE PASSED');
