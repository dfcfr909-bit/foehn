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

  /* ---------- 1b. UTM・MGRS の表示を貼り戻せる（v4.159.0・第2段） ----------
     ⚠ 日本の帯 51〜56 すべてと、緯度帯の境（32°・40°）のすぐ北。境の北は 1m 切り捨ての北距から出すと
       境の南に落ちることがあり、文字の照合を幅なしで行うと自分の表示が弾かれる（レビューの指摘）。
     ⚠ 照合は本体の表示との往復（自分同士）。外の道具との突き合わせは smoke_coord.mjs の北半球の値で行う */
  const UPOINTS = [
    [24.4497, 122.9342],       // 51 与那国島付近
    [26.2124, 127.6809],       // 52 那覇
    [33.082187, 131.240871],   // 52 久住山（131°は52帯）
    [35.0116, 135.7681],       // 53 京都
    [36.9536, 139.2873],       // 54 燧ヶ岳
    [44.0756, 145.1219],       // 55 知床
    [24.2867, 153.9807],       // 56 南鳥島
    [40.000005, 140.5],        // 緯度帯 S/T の境のすぐ北
    [32.000005, 130.5],        // 緯度帯 R/S の境のすぐ北
    [39.999995, 140.5],        // 境のすぐ南
  ];
  const uround = await page.evaluate(points => points.map(([lat, lon]) =>
    coordFormats(lat, lon).filter(f => /UTM|MGRS/.test(f.k)).flatMap(f =>
      [f.v, f.parts.join(' ')].map(v => {
        const r = parseCoordInput(v);
        const m = r && r.lat != null ? Math.hypot((r.lat - lat) * 111320, (r.lon - lon) * 111320 * Math.cos(lat * Math.PI / 180)) : null;
        return { k: f.k, v, lat, lon, r, m, z: f.v.slice(0, 2) };
      }))).flat(), UPOINTS);
  // 表示は 1m 切り捨て → 戻りは南西へ最大 √2 m
  const badU = uround.filter(x => x.m == null || x.m > 1.5 || x.r.fmt !== (x.k === 'MGRS' ? 'MGRS' : 'UTM'));
  ok(uround.length === UPOINTS.length * 4 && badU.length === 0,
    '★★★UTM・MGRS の表示（1行・画面の2行の連結）を貼り戻すと 1.5m 以内で元の地点に戻る（帯51〜56・緯度帯の境の両側）', badU);
  ok([...new Set(uround.map(x => x.z))].sort().join(',') === '51,52,53,54,55,56', '日本の帯 51〜56 をすべて通した',
    [...new Set(uround.map(x => x.z))]);

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
      // UTM・MGRS（v4.159.0）
      mgrsNoSp: P('54suf4751091028'),
      mgrsBandSp: P('54 S UF 47510 91028'),
      mgrs2: P('54SUF4791'),                             // 2桁＝1km 升目の南西の隅
      utmN: P('54N 347510 4091028'),                     // N を北半球の意味で書いたもの
      utmComma: P('54S, 347510, 4091028'),
      utmBad: parseCoordInput('54T 347510 4091028'),     // 北距は S 帯（緯度36.95）
      mgrsBad: parseCoordInput('54TUF4751091028'),
      mgrsN: parseCoordInput('54NUF4751091028'),         // MGRS の N は緯度帯（赤道付近）
      mgrsIO: parseCoordInput('54SIF4751091028'),
      mgrsOdd: parseCoordInput('54SUF475'),              // 打つ途中（数字が奇数）
      mgrsUneven: parseCoordInput('54SUF 4751 091028'),
      utmShort: parseCoordInput('54S 347510 409102'),     // 打つ途中（北距6桁）
      utmNoBand: parseCoordInput('54 347510 4091028'),
      utmZone0: parseCoordInput('0S 347510 4091028'),
      utmZone33: parseCoordInput('33S 347510 4091028'),  // 書式は正しいが日本の外
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
  const HIUCHI = [36.953, 139.2873];
  ok(near(cases.mgrsNoSp, ...HIUCHI) && cases.mgrsNoSp.fmt === 'MGRS', '★★MGRS：空白なし・小文字', cases.mgrsNoSp);
  ok(near(cases.mgrsBandSp, ...HIUCHI), 'MGRS：帯の数と文字の間の空白', cases.mgrsBandSp);
  ok(cases.mgrs2 && Math.abs(cases.mgrs2.lat - 36.9507) < 0.002 && cases.mgrs2.lat < HIUCHI[0] && cases.mgrs2.lon < HIUCHI[1],
    '★MGRS の桁が少なければ升目の南西の隅（54SUF4791＝1km 升目）', cases.mgrs2);
  ok(near(cases.utmN, ...HIUCHI) && cases.utmN.fmt === 'UTM', '★★UTM の N は北半球の意味として読む（N 帯は日本に無い）', cases.utmN);
  ok(near(cases.utmComma, ...HIUCHI), 'UTM：カンマ区切り', cases.utmComma);
  ok(cases.utmBad && cases.utmBad.bad === 'band' && cases.utmBad.band === 'T' && cases.utmBad.fmt === 'UTM',
    '★★UTM：緯度帯の文字と北距が合わなければ {bad:band}（文字は確認にだけ使う）', cases.utmBad);
  ok(cases.mgrsBad && cases.mgrsBad.bad === 'band' && cases.mgrsBad.fmt === 'MGRS', '★MGRS：帯の文字と北距が合わない', cases.mgrsBad);
  ok(cases.mgrsN && cases.mgrsN.lat == null, 'MGRS の N は緯度帯として読む（日本の地点にはならない）', cases.mgrsN);
  ok([cases.mgrsIO, cases.mgrsOdd, cases.mgrsUneven, cases.utmShort, cases.utmNoBand, cases.utmZone0].every(r => r === null),
    '★★読まないもの（I・O・数字が奇数・東北の桁違い・北距6桁・帯の文字なし・帯0）は null＝地点を出さない',
    [cases.mgrsIO, cases.mgrsOdd, cases.mgrsUneven, cases.utmShort, cases.utmNoBand, cases.utmZone0]);
  ok(cases.utmZone33 && cases.utmZone33.outOfRange === true, '書式は正しいが日本の外の帯は「範囲外」', cases.utmZone33);

  /* ---------- 3. 画面：透過文字・入力中の先頭行 ---------- */
  await page.evaluate(() => openMap());
  await page.waitForTimeout(300);
  /* ⚠ 透過文字は「座標」の一語にまとめた（v4.159.0・利用者の決定）。形式を並べると 390px の窓からはみ出す
       （旧「… 緯度経度 度分秒」247px も切れていた。UTM MGRS を足すと 334px）。受ける形式は仕様書に書く */
  ok(await page.evaluate(() => document.getElementById('map-search-input').placeholder) === '山名 よみ 地名 住所 座標',
    '★透過文字は「山名 よみ 地名 住所 座標」');
  /* ⚠ 透過文字が窓に収まるか（390px）。はみ出すと末尾が切れて見えない（形式を並べた案は 334px で切れた） */
  const ph = await page.evaluate(() => {
    const q = document.getElementById('map-search-input'), cs = getComputedStyle(q);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontSize} ${cs.fontFamily}`;
    return { text: Math.ceil(ctx.measureText(q.placeholder).width),
      box: q.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) };
  });
  ok(ph.text <= ph.box, '★透過文字が 390px の窓に収まる', ph);
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
  ok(!top || (!/coord-go/.test(top.cls) && !top.text.includes('範囲外')),
    '★入力中は範囲外を出さない（打っている途中の 35 1 で騒がない。範囲外と言うのは Enter のときだけ）', top);
  for (const v of ['54S 347510 409102', '54SUF475', '54T 347510 4091028']) {
    await typeIn(v);
    top = await page.evaluate(() => {
      const el = document.querySelector('#map-results > :first-child');
      return el && { cls: el.className, text: el.textContent };
    });
    ok(!top || (!/coord-go/.test(top.cls) && !top.text.includes('範囲外') && !top.text.includes('合いません')),
      `★★UTM・MGRS を打つ途中・帯の不一致（${v}）では、入力中に地点も理由も出さない`, top);
  }
  await typeIn('54SUF4751091028');
  top = await page.evaluate(() => {
    const el = document.querySelector('#map-results > :first-child');
    return el && { cls: el.className, text: el.textContent };
  });
  ok(top && /coord-go/.test(top.cls) && top.text.includes('MGRS として読みました'), '★MGRS は「MGRS として読みました」', top);

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

  Object.keys(hits).forEach(k => { hits[k] = 0; });
  st = await page.evaluate(async () => {
    const lat0 = state.lat;
    document.getElementById('map-search-input').value = '54T 347510 4091028';
    await doMapSearch();
    return { text: document.getElementById('map-results').textContent, moved: state.lat !== lat0 };
  });
  ok(st.text.includes('緯度帯の文字（T）と北距が合いません（UTM）') && !st.moved && hits.search === 0 && hits.gsi === 0 && hits.reverse === 0,
    '★★帯の文字が合わない Enter は、移らず・外に投げず理由を出す', { st, hits });

  Object.keys(hits).forEach(k => { hits[k] = 0; });
  st = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '54SUF4751091028';
    await doMapSearch();
    await new Promise(r => setTimeout(r, 400));   // 逆ジオコーディングを待つ
    return { lat: state.lat, lon: state.lon };
  });
  ok(Math.abs(st.lat - 36.953) < 1e-4 && Math.abs(st.lon - 139.2873) < 1e-4 && hits.search === 0 && hits.reverse === 1,
    '★★MGRS の Enter でその地点へ移る（外の地名検索に投げない）', { st, hits });
  await page.evaluate(() => localStorage.removeItem('sotoki_search_hist'));
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '33.082187, 131.240871';
    await doMapSearch();
  });
  await page.waitForTimeout(300);

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
