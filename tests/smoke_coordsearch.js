/* 地図の検索窓で座標を打って移る（`parseCoordInput` / `goCoordPoint`・v4.158.0）の検証。
 *
 * ⚠ **本体が表示する座標（coordFormats）を貼り戻せること**が要（findings-09 の B）。
 *   表示の文字列をそのまま読ませ、表示の精度の内で元の地点に戻ることを見る。
 * ⚠ 座標は外（Nominatim の search・地理院の地名検索）に投げない。
 *   地点名を引く逆ジオコーディング（/reverse）だけは長押しと同じく1回走る。
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
const META = fs.readFileSync(path.join(ROOT, 'data', 'peak_meta.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.css', 'utf8');

const LAT = 36.7380, LON = 139.4950;   // 日光付近を見ている

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  const hits = { search: 0, gsi: 0, reverse: 0 };
  let slowSearch = 0;   // 地名検索を遅らせる時間（古い結果が後から描かれないかを見る）

  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', async route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet.min.js') || url.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet.min.css') || url.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.endsWith('data/peak_meta.json')) return route.fulfill({ contentType: 'application/json', body: META });
    const cors = { 'access-control-allow-origin': '*' };
    if (url.includes('nominatim.openstreetmap.org/search')) {
      hits.search++;
      if (slowSearch) await new Promise(r => setTimeout(r, slowSearch));
      return route.fulfill({ contentType: 'application/json', headers: cors, body: JSON.stringify([
        { place_id: 9, lat: '36.6', lon: '139.4', display_name: '古い候補の地名, 栃木県, 日本' }]) }).catch(() => {});
    }
    if (url.includes('nominatim.openstreetmap.org/reverse')) {
      hits.reverse++;
      return route.fulfill({ contentType: 'application/json', headers: cors,
        body: JSON.stringify({ display_name: '久住山, 竹田市, 大分県, 日本', address: { peak: '久住山' } }) });
    }
    if (url.includes('msearch.gsi.go.jp/address-search')) {
      hits.gsi++;
      return route.fulfill({ contentType: 'application/json', headers: cors, body: '[]' });
    }
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(ll => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '日光' }));
  }, [LAT, LON]);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);

  const boot = await page.evaluate(() => (typeof parseCoordInput === 'undefined'
    ? 'parseCoordInput未定義（スクリプトが評価されていない）' : null)).catch(e => e.message);
  if (boot) throw new Error(`起動に失敗: ${boot} / pageerror: ${errors.join(' / ') || 'なし'}`);

  /* ---------- 1. 本体の表示を貼り戻せる（表示の精度の内で元に戻る） ---------- */
  const POINTS = [
    [33.082187, 131.240871],   // 久住山
    [35.360556, 138.727778],   // 富士山
    [45.522, 141.936],         // 宗谷岬付近
    [24.4497, 122.9342],       // 与那国島付近
    [36.99999, 137.99999],     // 秒の繰り上がりの境（36°59'60.0" と出さない）
  ];
  const round = await page.evaluate(points => points.map(([lat, lon]) =>
    coordFormats(lat, lon).filter(f => !/UTM|MGRS/.test(f.k)).map(f => {
      const r = parseCoordInput(f.v);
      return { k: f.k, v: f.v, lat, lon, r };
    })).flat(), POINTS);
  // 表示の最小単位の半分まで：DD 小数5桁／DDM 0.001分／DMS 0.1秒
  const TOL = { '十進度（DD）': 0.5e-5, '度・十進分（DDM）': 0.0005 / 60, '度分秒（DMS）': 0.05 / 3600, '度分秒（北緯・東経）': 0.05 / 3600 };
  const badRound = round.filter(x => !x.r || x.r.outOfRange ||
    Math.abs(x.r.lat - x.lat) > TOL[x.k] + 1e-12 || Math.abs(x.r.lon - x.lon) > TOL[x.k] + 1e-12 || x.r.swapped);
  ok(round.length === POINTS.length * 4 && badRound.length === 0,
    '★★本体の表示（DD・DDM・DMS・読み）を貼り戻すと、表示の精度の内で元の地点に戻る', badRound);

  /* ---------- 2. 方言・入れ替え・範囲外・座標ではないもの ---------- */
  const cases = await page.evaluate(() => {
    const P = s => { const r = parseCoordInput(s); return r && !r.outOfRange
      ? { lat: +r.lat.toFixed(5), lon: +r.lon.toFixed(5), swapped: r.swapped, fmt: r.fmt } : r; };
    return {
      space: P('33.082187 131.240871'),
      slash: P('33.08/131.24'),                          // スーパー地形
      dots: P('33.04.55.9/131.14.27.1'),                 // スーパー地形の度分秒
      zen: P('３３．０８，１３１．２４'),
      touten: P('33.08、131.24'),
      primes: P('33°04′55.9″N 131°14′27.1″E'),           // NFKC で ″ が ′′ になる
      jpNoSec: P('北緯33度4分 東経131度14分'),
      eFirst: P('E131.24 N33.08'),
      mixed: P('33.08 E131.24'),
      swap: P('131.240871, 33.082187'),
      out: P('2 3'),
      outS: P('S33.08 E131.24'),
      name: P('三ノ沢 2'),
      one: P('1786'),
      three: P('33.08 131.24 5'),
      min60: P("33°60'N 131°00'E"),
      ordo: P('33º04 131'),
      neg: P('-33 131'),
    };
  });
  const near = (r, lat, lon) => r && Math.abs(r.lat - lat) < 1e-4 && Math.abs(r.lon - lon) < 1e-4;
  ok(near(cases.space, 33.08219, 131.24087) && cases.space.fmt === 'DD', '★空白区切りの十進度', cases.space);
  ok(near(cases.slash, 33.08, 131.24), '★スラッシュ区切り（スーパー地形）', cases.slash);
  ok(near(cases.dots, 33.08219, 131.24086) && cases.dots.fmt === 'DMS', '★ドット区切りの度分秒（スーパー地形）', cases.dots);
  ok(near(cases.zen, 33.08, 131.24), '★全角の数字・読点', cases.zen);
  ok(near(cases.touten, 33.08, 131.24), '読点区切り', cases.touten);
  ok(near(cases.primes, 33.08219, 131.24086), '★★′″（NFKC で ′′ にばらける）を秒として読む', cases.primes);
  ok(near(cases.jpNoSec, 33 + 4 / 60, 131 + 14 / 60) && cases.jpNoSec.fmt === 'DDM', '漢字の度・分（秒なし）', cases.jpNoSec);
  ok(near(cases.eFirst, 33.08, 131.24) && !cases.eFirst.swapped, '★E が先でも記号で読む（入れ替えの札は出さない）', cases.eFirst);
  ok(near(cases.mixed, 33.08, 131.24), '記号の付き方が混ざった入力（33.08 E131.24）', cases.mixed);
  ok(near(cases.swap, 33.08219, 131.24087) && cases.swap.swapped === true, '★★経度・緯度の順は入れ替え、入れ替えたと分かる', cases.swap);
  ok(cases.out && cases.out.outOfRange === true, '★日本の範囲外は「範囲外」', cases.out);
  ok(cases.outS && cases.outS.outOfRange === true, '南緯は範囲外', cases.outS);
  ok(cases.name === null && cases.one === null && cases.three === null, '★★座標ではないもの（地名・数1つ・数3つ）は null＝地名検索へ', [cases.name, cases.one, cases.three]);
  ok(cases.min60 === null, '分が60以上は読まない', cases.min60);
  ok(cases.ordo === null && cases.neg === null, 'º（NFKC で o に化ける）・負の数は読まない', [cases.ordo, cases.neg]);

  /* ---------- 3. 画面：透過文字・入力中の先頭行 ---------- */
  await page.evaluate(() => openMap());
  await page.waitForTimeout(300);
  ok(await page.evaluate(() => document.getElementById('map-search-input').placeholder) === '山名 よみ 地名 住所 緯度経度 度分秒',
    '★透過文字は実際に検索できるものだけ（UTM・MGRS は第2段まで書かない）');
  const typeIn = v => page.evaluate(v => {
    const q = document.getElementById('map-search-input');
    q.focus(); q.value = v; q.dispatchEvent(new Event('input'));
  }, v);
  await typeIn('131.240871, 33.082187');
  let top = await page.evaluate(() => {
    const el = document.querySelector('#map-results > :first-child');
    return el && { cls: el.className, text: el.textContent };
  });
  ok(top && /coord-go/.test(top.cls) && top.text.includes('33.08219, 131.24087 へ移動') && top.text.includes('入れ替え'),
    '★★入力中に窓の先頭へ「座標へ移動」の行（入れ替えたことも出す）', top);
  await typeIn('2 3');
  top = await page.evaluate(() => {
    const el = document.querySelector('#map-results > :first-child');
    return el && { cls: el.className, text: el.textContent };
  });
  ok(top && /coord-go-out/.test(top.cls) && top.text.includes('範囲外'), '★範囲外は「範囲外」の行だけ（移動の行は出さない）', top);

  /* ---------- 4. Enter：外に投げずに移る・履歴に残る ---------- */
  await page.evaluate(() => localStorage.removeItem('sotoki_search_hist'));
  Object.keys(hits).forEach(k => { hits[k] = 0; });
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '33.082187, 131.240871';
    await doMapSearch();
  });
  await page.waitForTimeout(400);
  let st = await page.evaluate(() => ({ lat: state.lat, lon: state.lon, elev: state.summitElev,
    res: document.getElementById('map-results').innerHTML, hist: loadSearchHist() }));
  ok(Math.abs(st.lat - 33.082187) < 1e-9 && Math.abs(st.lon - 131.240871) < 1e-9, '★★Enter でその座標へ移る', st);
  ok(hits.search === 0 && hits.gsi === 0, '★★座標は地名検索（Nominatim の search・地理院）に投げない', hits);
  ok(hits.reverse === 1, '★地点名の逆ジオコーディングは長押しと同じく1回', hits);
  ok(st.elev === null, '標高は DEM に任せる（公称値を渡さない＝長押しと同じ）', st.elev);
  ok(st.res === '', '移ったら窓を畳む', st.res);
  ok(st.hist.length === 1 && st.hist[0].name === '33.08219, 131.24087' && st.hist[0].coord === true,
    '★★座標の入力は地名の履歴に「緯度, 経度」の名前と印 coord で残す', st.hist);

  Object.keys(hits).forEach(k => { hits[k] = 0; });
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '2 3';
    await doMapSearch();
  });
  st = await page.evaluate(() => document.getElementById('map-results').textContent);
  ok(st.includes('範囲外') && hits.search === 0 && hits.gsi === 0 && hits.reverse === 0,
    '★範囲外の Enter は外に何も投げず「範囲外」と出す', { st, hits });

  /* ---------- 5. 履歴の座標の行は、何度押しても打ったときと同じ動き ---------- */
  await page.evaluate(() => { state.lat = 36.0; state.lon = 139.0; });
  for (let n = 1; n <= 2; n++) {
    Object.keys(hits).forEach(k => { hits[k] = 0; });
    await page.evaluate(() => {
      const q = document.getElementById('map-search-input');
      q.value = ''; q.blur(); q.focus(); q.dispatchEvent(new Event('input'));
      const row = [...document.querySelectorAll('#map-results .map-hist-row .map-result-item')]
        .find(el => el.querySelector('.map-result-name').firstChild.textContent === '33.08219, 131.24087');
      row.click();
    });
    await page.waitForTimeout(300);
    st = await page.evaluate(() => ({ lat: state.lat, hist: loadSearchHist() }));
    ok(Math.abs(st.lat - 33.082187) < 1e-5 && hits.reverse === 1 && st.hist[0].coord === true && st.hist.length === 1,
      `★★履歴の座標の行を押すと打ったときと同じ動き（${n}回目・/reverse 1回・印 coord が残る）`, { st, hits });
    await page.evaluate(() => { state.lat = 36.0; state.lon = 139.0; });
  }

  /* ---------- 6. 遅い地名検索の途中で座標を Enter しても、古い結果は描かれない ---------- */
  slowSearch = 1500;
  await page.evaluate(() => {
    document.getElementById('map-search-input').value = '古い候補';
    doMapSearch();   // 待たない
  });
  await page.waitForTimeout(300);
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '33.082187 131.240871';
    await doMapSearch();
  });
  await page.waitForTimeout(2500);   // 遅い応答が届き終わるまで
  slowSearch = 0;
  /* ⚠ 窓の結果欄は移った時点で消えるので、画面だけ見ても差が出ない。
     遅れた応答が候補（mapSearchItems）を上書きしていないこと＝通し番号で捨てたことを見る */
  st = await page.evaluate(() => ({ html: document.getElementById('map-results').textContent, lat: state.lat,
    items: mapSearchItems.map(it => it.display_name) }));
  ok(!st.html.includes('古い候補の地名') && st.items.length === 0 && Math.abs(st.lat - 33.082187) < 1e-5,
    '★★遅れて届いた地名検索の結果を、座標へ移った後に使わない（通し番号で捨てる）', st);

  ok(errors.length === 0, 'ページ内で例外が出ていない', errors);

  await browser.close();
  if (fails.length) {
    console.log('COORDSEARCH SMOKE FAILED');
    fails.forEach(f => console.log('  ✗ ' + f));
    process.exit(1);
  }
  console.log('COORDSEARCH SMOKE PASSED');
})().catch(e => { console.error(e); process.exit(1); });
