/* 地図の検索の履歴（`addSearchHist` / `renderSearchHist`）の検証。
 *
 * ⚠ **残すのは「打った語」ではなく「選んだ地点」（名前＋緯度経度）。**
 *   押したら通信せずにその座標へ飛ぶ。山の中の弱い電波で検索し直させないため。
 *   同名の山（笙ヶ岳＝岐阜/山形）を取り違えないのも、座標を持っているから。
 *
 * 通信はスタブする。
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.css', 'utf8');

const LAT = 39.0994, LON = 140.0489;   // 鳥海山付近を見ている
const SHO = { place_id: 2, lat: '39.0927', lon: '140.0020',
  display_name: '笙ケ岳 二峰, 遊佐町, 飽海郡, 山形県, 日本' };
// 揺れのどれで引いても同じ地点が返る（どの揺れを叩くかは nameSearchVariants 次第）
const NOMINATIM = {
  '笙ヶ岳': [], '笙ケ岳': [SHO], '笙ガ岳': [SHO],
  '月山': [{ place_id: 5, lat: '38.5489', lon: '140.0270', display_name: '月山, 山形県, 日本' }],
};

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  const hits = [];

  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  let dialogAnswer = true;
  page.on('dialog', d => (dialogAnswer ? d.accept() : d.dismiss()));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet.min.js') || url.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet.min.css') || url.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('nominatim.openstreetmap.org/search')) {
      const q = new URL(url).searchParams.get('q');
      hits.push(q);
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(NOMINATIM[q] || []),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('msearch.gsi.go.jp/address-search')) {
      hits.push('gsi');
      return route.fulfill({ contentType: 'application/json', body: '[]',
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(ll => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '鳥海山' }));
  }, [LAT, LON]);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);

  const boot = await page.evaluate(() => (typeof renderSearchHist === 'undefined'
    ? 'renderSearchHist未定義（スクリプトが評価されていない）' : null)).catch(e => e.message);
  if (boot) throw new Error(`起動に失敗: ${boot} / pageerror: ${errors.join(' / ') || 'なし'}`);

  // 検索窓は地図の中にある。開いていないとフォーカスできない
  await page.evaluate(() => openMap());
  await page.waitForTimeout(300);

  const histRows = () => page.evaluate(() =>
    [...document.querySelectorAll('#map-results .map-hist-row')].map(r => ({
      name: r.querySelector('.map-result-name').firstChild.textContent,
      sub: r.querySelector('.map-result-sub').textContent,
    })));
  const focusEmpty = () => page.evaluate(() => {
    const q = document.getElementById('map-search-input');
    q.value = ''; q.blur(); q.focus();
  });

  /* --- 履歴が無いときは何も出さない --- */
  await page.evaluate(() => localStorage.removeItem('sotoki_search_hist'));
  await focusEmpty();
  ok(await page.evaluate(() => document.getElementById('map-results').innerHTML === ''),
    '履歴が空なら何も出さない（空の札を出さない）');

  /* --- 検索しただけでは残らない。選んだら残る --- */
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '笙ヶ岳';
    await doMapSearch();
  });
  ok(await page.evaluate(() => loadSearchHist().length === 0), '★検索しただけでは履歴に残さない');
  await page.evaluate(() => document.querySelector('#map-results .map-result-item').click());
  const saved = await page.evaluate(() => loadSearchHist());
  ok(saved.length === 1 && saved[0].name === '笙ケ岳 二峰' &&
    Math.abs(saved[0].lat - 39.0927) < 1e-6 && Math.abs(saved[0].lon - 140.002) < 1e-6,
    '★★選んだ地点を名前と緯度経度で残す', saved);

  /* --- 空で窓を触ると履歴が出て、押すと通信なしで飛ぶ --- */
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '月山';
    await doMapSearch();
    document.querySelector('#map-results .map-result-item').click();
  });
  await focusEmpty();
  let rows = await histRows();
  ok(rows.length === 2 && rows[0].name === '月山' && rows[1].name === '笙ケ岳 二峰',
    '★★空の窓にフォーカスすると新しい順に履歴が出る', rows);
  ok(rows[1] && rows[1].sub === '（座標）', '★座標は数字ではなく「（座標）」とだけ出す（v4.111.0）', rows);
  /* ⚠ 1行にまとめる（座標は名前の右）。2行だと枠が太すぎた（利用者の指摘） */
  const shape = await page.evaluate(() => {
    const row = document.querySelector('#map-results .map-hist-row');
    const nm = row.querySelector('.map-result-name').getBoundingClientRect();
    const sub = row.querySelector('.map-result-sub').getBoundingClientRect();
    return { h: Math.round(row.getBoundingClientRect().height),
      sameLine: Math.abs((nm.top + nm.bottom) / 2 - (sub.top + sub.bottom) / 2) < 6,
      subRight: sub.left > nm.left + 40 };
  });
  ok(shape.sameLine && shape.subRight, '★★座標は名前と同じ行の右に置く', shape);
  ok(shape.h >= 44 && shape.h <= 50, '★★行は1行ぶんの高さ（44px前後。押しやすさは残す）', shape);

  hits.length = 0;
  const picked = await page.evaluate(() => {
    state.summitElev = 999;
    document.querySelectorAll('#map-results .map-hist-row .map-result-item')[1].click();
    return { lat: state.lat, lon: state.lon, name: state.locationName, se: state.summitElev,
      results: document.getElementById('map-results').innerHTML };
  });
  ok(hits.length === 0, '★★★履歴から選ぶときは検索し直さない（通信しない）', hits);
  ok(Math.abs(picked.lat - 39.0927) < 1e-6 && Math.abs(picked.lon - 140.002) < 1e-6 &&
    picked.name === '笙ケ岳 二峰', '★★★履歴の座標そのものへ飛ぶ（同名の別峰を拾わない）', picked);
  ok(picked.se === null, '★DEMの標高を山頂標高の席に入れない', picked);
  ok(picked.results === '', '選んだら一覧は畳む', picked);
  const order = await page.evaluate(() => loadSearchHist().map(h => h.name));
  ok(order.join('/') === '笙ケ岳 二峰/月山', '★使った地点を先頭へ移す', order);

  /* --- 同じ地点を重ねない --- */
  await page.evaluate(() => { addSearchHist('笙ケ岳 二峰', 39.0930, 140.0025); addSearchHist('笙ヶ岳二峰', 39.0928, 140.0021); });
  const dedup = await page.evaluate(() => loadSearchHist().map(h => h.name));
  ok(dedup.length === 2, '★同じ地点（表記揺れ・約1km以内）は1件にまとめる', dedup);
  await page.evaluate(() => addSearchHist('笙ヶ岳', 35.2838, 136.5112));
  ok(await page.evaluate(() => loadSearchHist().length === 3),
    '★★同名でも離れた地点（岐阜の笙ヶ岳）は別に残す');

  /* --- 打つと絞り込む（表記揺れも吸収する） --- */
  await page.evaluate(() => {
    const q = document.getElementById('map-search-input');
    q.value = '笙ケ'; q.dispatchEvent(new Event('input'));
  });
  rows = await histRows();
  ok(rows.length === 2 && rows.every(r => r.name.startsWith('笙')),
    '★★打った文字で絞り込む（ヶ／ケの揺れも拾う）', rows);
  await page.evaluate(() => {
    const q = document.getElementById('map-search-input');
    q.value = ''; q.dispatchEvent(new Event('input'));
  });
  ok((await histRows()).length === 3, '空に戻すと全件に戻る');

  /* --- ✕で1件消す（行を押したことにならない） --- */
  hits.length = 0;
  await page.evaluate(() => { state.locationName = '目印'; document.querySelector('.map-hist-del').click(); });
  const afterDel = await page.evaluate(() => ({ n: loadSearchHist().length, name: state.locationName }));
  ok(afterDel.n === 2, '★✕で1件だけ消える', afterDel);
  ok(afterDel.name === '目印', '★✕を押しても地点は選ばれない', afterDel);
  ok((await histRows()).length === 2, '消したあと一覧を描き直す');

  /* --- 上限100件 --- */
  const cap = await page.evaluate(() => {
    for (let i = 0; i < 130; i++) addSearchHist('山' + i, 36 + i * 0.05, 138);
    const l = loadSearchHist();
    return { n: l.length, first: l[0].name, bytes: localStorage.getItem('sotoki_search_hist').length };
  });
  ok(cap.n === 100, '★★上限100件で古いものから落とす', cap);
  ok(cap.first === '山129', '最新が先頭', cap);
  ok(cap.bytes < 20000, '100件でも容量は小さい（20KB未満）', cap);

  /* --- 全消去は確認してから --- */
  await focusEmpty();
  dialogAnswer = false;
  await page.evaluate(() => document.querySelector('.map-hist-clear').click());
  ok(await page.evaluate(() => loadSearchHist().length === 100), '★確認で取り消したら消さない');
  dialogAnswer = true;
  await page.evaluate(() => document.querySelector('.map-hist-clear').click());
  ok(await page.evaluate(() => loadSearchHist().length === 0 &&
    document.getElementById('map-results').innerHTML === ''), '★確認したら全部消える');

  /* --- 保存値を HTML として解釈しない／壊れた保存値で落ちない --- */
  const safe = await page.evaluate(() => {
    localStorage.setItem('sotoki_search_hist', JSON.stringify([
      { name: '<img src=x onerror="window.__x=1">', lat: 36, lon: 138, t: 1 },
      { name: 'こわれ', lat: 'x' }, null, 5,
    ]));
    const q = document.getElementById('map-search-input'); q.value = ''; q.blur(); q.focus();
    return { img: !!document.querySelector('#map-results img'), n: document.querySelectorAll('.map-hist-row').length };
  });
  ok(!safe.img, '★★保存値をHTMLとして解釈しない', safe);
  ok(safe.n === 1, '壊れた保存値は捨てる', safe);
  await page.evaluate(() => localStorage.setItem('sotoki_search_hist', '{壊れ'));
  ok(await page.evaluate(() => loadSearchHist().length === 0), 'JSONが壊れていても落ちない');

  ok(!errors.length, 'ページ内で例外が出ていない', errors);
  await browser.close();

  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('SEARCHHIST SMOKE FAILED');
    process.exit(1);
  }
  console.log('SEARCHHIST SMOKE PASSED');
})().catch(e => { console.log('SEARCHHIST SMOKE FAILED: ' + e.message); process.exit(1); });
