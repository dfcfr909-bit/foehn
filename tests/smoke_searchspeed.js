/* 地図の山名検索の速さと、相手が詰まったときの振る舞い（`doMapSearch`）。
 *
 * ⚠ 実機で「検索がやたら重い」と言われた。原因は**全部を1本ずつ直列に待っていた**こと
 *   （OSM×3 → 地理院×3。揺れのある語で最大6往復）と、**タイムアウトが無かった**こと。
 * ⚠ ただし **Nominatim の中は直列のまま**にする（利用条件「1秒1回まで」）。
 *   速くするために OSM を並べて叩いていないかもここで見る。
 *
 * 通信はスタブし、応答に遅れを入れる。
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

const LAT = 39.0994, LON = 140.0489;
const SHO = { place_id: 2, lat: '39.0927', lon: '140.0020', display_name: '笙ケ岳 二峰, 遊佐町, 山形県, 日本' };
const NOMINATIM = { '笙ヶ岳': [], '笙ケ岳': [SHO], '笙ガ岳': [SHO],
  '月山': [{ place_id: 5, lat: '38.5489', lon: '140.0270', display_name: '月山, 山形県, 日本' }] };
const GSI = { '釈迦ヶ岳': [{ title: '釈迦ヶ岳', lon: 139.7772, lat: 36.8990 }] };

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  // 相手ごとの振る舞い。delay=遅れ(ms)、mode='ok'|'hang'|'error'
  const net = { osm: { delay: 0, mode: 'ok' }, gsi: { delay: 0, mode: 'ok' } };
  let osmInFlight = 0, osmMaxInFlight = 0;

  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  const safe = p => p.catch(() => {});   // 打ち切られた後の fulfill は失敗してよい
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet.min.js') || url.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet.min.css') || url.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    const cors = { 'access-control-allow-origin': '*' };
    if (url.includes('nominatim.openstreetmap.org/search')) {
      const q = new URL(url).searchParams.get('q');
      const { delay, mode } = net.osm;
      osmInFlight++; osmMaxInFlight = Math.max(osmMaxInFlight, osmInFlight);
      await sleep(mode === 'hang' ? 3000 : delay);
      osmInFlight--;
      if (mode === 'error') return safe(route.fulfill({ status: 503, body: '', headers: cors }));
      return safe(route.fulfill({ contentType: 'application/json', body: JSON.stringify(NOMINATIM[q] || []), headers: cors }));
    }
    if (url.includes('msearch.gsi.go.jp/address-search')) {
      const q = new URL(url).searchParams.get('q');
      const { delay, mode } = net.gsi;
      await sleep(mode === 'hang' ? 3000 : delay);
      if (mode === 'error') return safe(route.abort());
      return safe(route.fulfill({ contentType: 'application/json', headers: cors,
        body: JSON.stringify((GSI[q] || []).map(r => ({ geometry: { coordinates: [r.lon, r.lat] }, properties: { title: r.title } }))) }));
    }
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(ll => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '鳥海山' }));
  }, [LAT, LON]);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);
  const boot = await page.evaluate(() => (typeof fetchJsonWithTimeout === 'undefined'
    ? 'fetchJsonWithTimeout未定義' : null)).catch(e => e.message);
  if (boot) throw new Error(`起動に失敗: ${boot} / pageerror: ${errors.join(' / ') || 'なし'}`);

  const search = q => page.evaluate(async q => {
    document.getElementById('map-search-input').value = q;
    const t0 = performance.now();
    await doMapSearch();
    return { ms: performance.now() - t0,
      names: [...document.querySelectorAll('#map-results .map-result-name')].map(e => e.firstChild.textContent),
      msg: (document.querySelector('#map-results .map-result-msg') || {}).textContent || '' };
  }, q);

  /* --- 1. OSMと地理院を同時に回す（揺れのある語で3本ずつ） --- */
  const D = 300;
  net.osm = { delay: D, mode: 'ok' }; net.gsi = { delay: D, mode: 'ok' };
  osmMaxInFlight = 0;
  const r1 = await search('笙ヶ岳');
  ok(r1.names.length === 1, '結果が出る', r1);
  // 直列なら 6×300=1800ms、並行なら 3×300=900ms 前後
  ok(r1.ms < 1400, '★★★OSMと地理院を同時に回す（直列の6往復を待たない）', Math.round(r1.ms));
  ok(osmMaxInFlight === 1, '★★★Nominatimは並べて叩かない（利用条件「1秒1回まで」）', osmMaxInFlight);

  await page.evaluate(() => { SEARCH_TIMEOUT_MS = 500; });

  /* --- 2. 地理院が詰まってもOSMの結果は出る（待ち続けない） --- */
  net.osm = { delay: 0, mode: 'ok' }; net.gsi = { delay: 0, mode: 'hang' };
  const r2 = await search('月山');
  ok(r2.names.includes('月山'), '★★地理院が詰まってもOSMの結果が出る', r2);
  ok(r2.ms < 2500, '★★★詰まった相手を待ち続けない（タイムアウトで打ち切る）', Math.round(r2.ms));

  /* --- 3. OSMが詰まっても地理院の結果は出る --- */
  net.osm = { delay: 0, mode: 'hang' }; net.gsi = { delay: 0, mode: 'ok' };
  const r3 = await search('釈迦ヶ岳');
  ok(r3.names.includes('釈迦ヶ岳'), '★★OSMが詰まっても地理院の結果が出る（失敗にしない）', r3);
  ok(r3.ms < 2500, 'OSMの詰まりも打ち切る', Math.round(r3.ms));

  /* --- 4. 両方だめなら失敗と言う（黙って空にしない） --- */
  net.osm = { delay: 0, mode: 'error' }; net.gsi = { delay: 0, mode: 'error' };
  const r4 = await search('月山');
  ok(r4.msg.startsWith('検索失敗'), '★両方読めなければ「検索失敗」と出す', r4);
  net.osm = { delay: 0, mode: 'hang' }; net.gsi = { delay: 0, mode: 'hang' };
  const r4b = await search('月山');
  ok(r4b.msg.includes('応答なし'), '★応答なしで打ち切ったことが分かる', r4b);

  /* --- 5. 打ち直したら、前の遅い応答で一覧を上書きしない --- */
  await page.evaluate(() => { SEARCH_TIMEOUT_MS = 5000; });
  net.osm = { delay: 800, mode: 'ok' }; net.gsi = { delay: 0, mode: 'ok' };
  const r5 = await page.evaluate(async () => {
    const q = document.getElementById('map-search-input');
    q.value = '笙ヶ岳';
    const first = doMapSearch();              // 遅い方
    await new Promise(r => setTimeout(r, 100));
    q.value = '釈迦ヶ岳';
    const second = doMapSearch();
    await Promise.all([first, second]);
    return [...document.querySelectorAll('#map-results .map-result-name')].map(e => e.firstChild.textContent);
  });
  ok(r5.length === 1 && r5[0] === '釈迦ヶ岳', '★★打ち直したら前の検索の応答で上書きしない', r5);

  ok(!errors.length, 'ページ内で例外が出ていない', errors);
  await browser.close();
  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('SEARCHSPEED SMOKE FAILED');
    process.exit(1);
  }
  console.log('SEARCHSPEED SMOKE PASSED');
})().catch(e => { console.log('SEARCHSPEED SMOKE FAILED: ' + e.message); process.exit(1); });
