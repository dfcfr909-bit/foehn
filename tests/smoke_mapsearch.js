/* 地図の山名検索（`doMapSearch` / `nameSearchVariants`）の検証。
 *
 * ⚠ **山名は地図・辞書ごとに表記が違う。1字違うだけで検索は空振りする。**
 *   #13 で実際に踏んだ: 鳥海山の笙ヶ岳は地理院が「笙**ガ**岳」、
 *   OSMが「笙**ケ**岳 二峰」。利用者が素直に「笙ヶ岳」と打つと
 *   **岐阜県の笙ヶ岳(908m)しか出ず、選ぶと500km先へ飛ぶ**。
 *   「無い」のではなく「引けていない」。
 *
 * ⚠ **並び順が「どれを選ぶか」を決めてしまう。** 同名の山は各地にあるので、
 *   いま見ている場所に近いものが上に来ないと、遠い同名峰を選ばせてしまう。
 *
 * 通信はスタブする。
 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(__dirname + '/node_modules/leaflet/dist/leaflet.css', 'utf8');

// 鳥海山（新山）付近を見ている状態にする
const LAT = 39.0994, LON = 140.0489;

/* --- 標高タイル（国土地理院 dem_png）を組み立てる ---
   x = R*65536 + G*256 + B、標高 = x * 0.01。単色のPNGを返せば1画素読みで足りる。 */
const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function CRC(buf) { let c = 0xffffffff; for (const b of buf) c = CRC_T[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function demPng(metres) {
  const x = Math.round(metres * 100);
  const r = (x >> 16) & 255, g = (x >> 8) & 255, b = x & 255;
  const W = 256, H = 256;
  const raw = Buffer.alloc((W * 3 + 1) * H);
  for (let y = 0; y < H; y++) {
    const o = y * (W * 3 + 1);
    for (let xx = 0; xx < W; xx++) { raw[o + 1 + xx * 3] = r; raw[o + 2 + xx * 3] = g; raw[o + 3 + xx * 3] = b; }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
// タイル番号 → そのタイルの中心の緯度経度（どの候補のタイルかを見分ける）
function tileCenter(z, x, y) {
  const n = Math.pow(2, z);
  const lon = (x + 0.5) / n * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 0.5) / n))) * 180 / Math.PI;
  return { lat, lon };
}

/* 実物の Nominatim の振る舞いを模す。**表記が完全に一致したときだけ返す。**
   これが今回の不具合の本体なので、ここを緩めると検査にならない。 */
const GIFU = { place_id: 1, lat: '35.2838', lon: '136.5112',
  display_name: '笙ヶ岳, 大垣市, 岐阜県, 日本' };
const YAMAGATA = { place_id: 2, lat: '39.0927', lon: '140.0020',
  display_name: '笙ケ岳 二峰, 遊佐町, 飽海郡, 山形県, 日本' };
const NOMINATIM = {
  '笙ヶ岳': [GIFU],           // 素直に打つとこれしか出ない
  '笙ケ岳': [YAMAGATA],       // 揺れを当てて初めて出る
  '笙ガ岳': [YAMAGATA],       // 同じ地点（重複するはず）
  '間ノ岳': [{ place_id: 3, lat: '35.6460', lon: '138.2282', display_name: '間ノ岳, 日本' }],
  // ⚠ **OSMは日本の山名の網羅性が低い。** 釈迦ヶ岳は山梨の2件しか返らず、
  //   矢板（高原山）が出てこない。件数上限ではなく索引に無い（実機で確認）
  '釈迦ヶ岳': [
    { place_id: 10, lat: '35.6480', lon: '138.7060', display_name: '釈迦ヶ岳, 笛吹市, 山梨県, 日本' },
    { place_id: 11, lat: '35.5340', lon: '138.4600', display_name: '釈迦ヶ岳, 市川三郷町, 西八代郡, 山梨県, 日本' },
  ],
};

/* 五竜岳。地理院は同名を2つ返す。**標高を併記しないと選び分けられない**
   （実機で確認。1,585m の方と 2,814m の北アルプス）。 */
const GORYU_LOW  = { title: '五龍岳', lon: 140.1500, lat: 38.9000, elev: 1585 };
const GORYU_HIGH = { title: '五龍岳', lon: 137.7526, lat: 36.6584, elev: 2814 };

/* 国土地理院の地名検索。OSMに無い峰を埋める役。
   矢板（高原山）の釈迦ヶ岳はこちらにだけある。 */
const YAITA = { title: '釈迦ヶ岳', lon: 139.7772, lat: 36.8990, elev: 1795 };
const GSI = {
  '釈迦ヶ岳': [YAITA],
  // ⚠ 地理院は竜／龍を自前で吸収して「五龍岳」を返す（実機で確認）。
  //    こちらで漢字の揺れを作る必要は無いので、キーは打った字のまま
  '五竜岳': [GORYU_LOW, GORYU_HIGH],
  '笙ヶ岳': [], '笙ケ岳': [], '笙ガ岳': [],
  '富士山': [{ title: '富士山', lon: 138.7274, lat: 35.3606 }],
};

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  const hits = [], gsiHits = [], demHits = [];
  let gsiBlocked = false, demBlocked = false;

  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet.min.js') || url.includes('leaflet.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet.min.css') || url.includes('leaflet.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('data/spots.json')) return route.fulfill({ status: 404, body: '' });
    if (url.includes('nominatim.openstreetmap.org/search')) {
      const q = new URL(url).searchParams.get('q');
      hits.push(q);
      return route.fulfill({ contentType: 'application/json',
        body: JSON.stringify(NOMINATIM[q] || []),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('msearch.gsi.go.jp/address-search')) {
      const q = new URL(url).searchParams.get('q');
      gsiHits.push(q);
      if (gsiBlocked) return route.abort();   // CORSで読めない環境の再現
      return route.fulfill({ contentType: 'application/json',
        body: JSON.stringify((GSI[q] || []).map(r => ({
          geometry: { coordinates: [r.lon, r.lat] }, properties: { title: r.title },
        }))),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('/xyz/dem_png/')) {
      demHits.push(url);
      if (demBlocked) return route.abort();   // 標高が読めない環境の再現
      const m = url.match(/dem_png\/(\d+)\/(\d+)\/(\d+)\.png/);
      const c = tileCenter(Number(m[1]), Number(m[2]), Number(m[3]));
      // いちばん近い候補の標高を返す
      let best = null;
      for (const p of [GORYU_LOW, GORYU_HIGH, YAITA]) {
        const d = Math.hypot(c.lat - p.lat, c.lon - p.lon);
        if (!best || d < best.d) best = { d, elev: p.elev || 1000 };
      }
      return route.fulfill({ contentType: 'image/png', body: demPng(best.elev),
        headers: { 'access-control-allow-origin': '*' } });
    }
    if (url.includes('api.open-meteo.com')) {
      return route.fulfill({ contentType: 'application/json', body: '{}' });
    }
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(ll => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '鳥海山' }));
  }, [LAT, LON]);
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);

  const boot = await page.evaluate(() => (typeof nameSearchVariants === 'undefined'
    ? 'nameSearchVariants未定義（スクリプトが評価されていない）' : null))
    .catch(e => e.message);
  if (boot) throw new Error(`起動に失敗: ${boot} / pageerror: ${errors.join(' / ') || 'なし'}`);

  /* --- 表記揺れの作り方 --- */
  const variants = await page.evaluate(() => ({
    sho: nameSearchVariants('笙ヶ岳'),
    ai: nameSearchVariants('間ノ岳'),
    plain: nameSearchVariants('富士山'),
  }));
  ok(variants.sho[0] === '笙ヶ岳', '★元の語を先頭に置く（打った通りを最優先）', variants.sho);
  ok(variants.sho.includes('笙ケ岳') || variants.sho.includes('笙ガ岳'),
    '★「ヶ」の揺れを作る', variants.sho);
  ok(variants.sho.length <= 3, '★★叩く回数の上限を守る（Nominatimの利用条件）', variants.sho);
  ok(variants.ai.includes('間の岳'), '「ノ」の揺れも作る（間ノ岳／間の岳）', variants.ai);
  ok(variants.plain.length === 1, '揺れの無い語で余計に叩かない', variants.plain);

  /* --- 実際に検索させる --- */
  hits.length = 0;
  const rows = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '笙ヶ岳';
    await doMapSearch();
    return [...document.querySelectorAll('#map-results .map-result-item')].map(el => ({
      name: el.querySelector('.map-result-name').textContent,
      sub: el.querySelector('.map-result-sub').textContent,
    }));
  });

  ok(rows.length >= 2, '★★表記揺れの側（山形）も結果に出る', { rows, hits });
  ok(rows.some(r => r.sub.includes('山形県')), '★★★山形の笙ケ岳が引ける（1字違いで空振りしない）',
    { rows, hits });
  ok(rows[0] && rows[0].sub.includes('山形県'),
    '★★★いま見ている場所に近い方が先頭（遠い同名峰を選ばせない）', rows);
  ok(rows.filter(r => r.sub.includes('山形県')).length === 1,
    '★同じ地点を重複して出さない（ケとガで2回引いても1件）', rows);
  ok(hits.length <= 3, '★★Nominatimを叩く回数が上限内', hits);

  /* --- OSMに無い峰を地理院が埋めること ---
     ⚠ 実機で踏んだ件。「釈迦ヶ岳」はOSMだと山梨の2件しか返らず、
       矢板（高原山）が出てこなかった。**情報源を足すしか手が無い。** */
  hits.length = 0; gsiHits.length = 0;
  const shaka = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '釈迦ヶ岳';
    await doMapSearch();
    return [...document.querySelectorAll('#map-results .map-result-item')].map(el => ({
      name: el.querySelector('.map-result-name').textContent,
      sub: el.querySelector('.map-result-sub').textContent,
    }));
  });
  ok(shaka.length === 3, '★★OSMの2件に地理院の1件が加わる', shaka);
  ok(shaka.some(r => r.sub.includes('国土地理院')),
    '★★★OSMに無い峰（矢板の釈迦ヶ岳）が地理院側から出る', shaka);
  ok(shaka.some(r => r.sub.includes('笛吹市')) && shaka.some(r => r.sub.includes('市川三郷町')),
    'OSM側の候補も消えていない', shaka);
  ok(gsiHits.length >= 1, '地理院にも問い合わせている', gsiHits);

  /* --- 地理院が読めない環境（CORS）でも壊れないこと ---
     ⚠ ブラウザから叩けるかは環境依存。**読めなければOSMだけに戻る**だけで、
       検索そのものが失敗してはいけない。 */
  gsiBlocked = true;
  const fallback = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '釈迦ヶ岳';
    await doMapSearch();
    return [...document.querySelectorAll('#map-results .map-result-item')].map(el =>
      el.querySelector('.map-result-sub').textContent);
  });
  ok(fallback.length === 2, '★★地理院が読めなくてもOSMの結果は出る（検索が壊れない）', fallback);
  ok(!fallback.some(t => t.includes('国土地理院')), '読めなかった側は混ざらない', fallback);
  gsiBlocked = false;

  /* --- 同名峰は標高で選び分けられること ---
     ⚠ 実機で踏んだ件。「五竜岳」で地理院が同名を2つ返し、**どちらが北アルプスか
       名前と住所だけでは分からなかった**。標高を併記すれば一目で選べる。 */
  const goryu = await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '五竜岳';
    await doMapSearch();
    await new Promise(r => setTimeout(r, 600));   // 標高は一覧を出したあとに埋まる
    return [...document.querySelectorAll('#map-results .map-result-item')].map(el => ({
      name: el.querySelector('.map-result-name').textContent,
      elev: el.querySelector('.map-result-elev').textContent,
    }));
  });
  ok(goryu.length === 2, '同名2件が出る', goryu);
  ok(goryu.some(r => r.elev === '2814m') && goryu.some(r => r.elev === '1585m'),
    '★★★同名峰に標高が併記され、選び分けられる', goryu);

  /* ⚠ **選択中の地点の標高を壊さないこと。**
     候補の標高読みは `state.demElevation` を触ってはいけない。 */
  const kept = await page.evaluate(async () => {
    state.demElevation = 12345;                       // 目印
    document.getElementById('map-search-input').value = '五竜岳';
    await doMapSearch();
    await new Promise(r => setTimeout(r, 600));
    return state.demElevation;
  });
  ok(kept === 12345, '★★候補の標高読みが選択中の地点の標高を上書きしない', kept);

  /* --- 標高が読めなくても一覧は出ること --- */
  demBlocked = true;
  const noElev = await page.evaluate(async () => {
    demCache.clear();   // ⚠ 前の検索でキャッシュ済み。消さないと「読めた」ままになる
    document.getElementById('map-search-input').value = '釈迦ヶ岳';
    await doMapSearch();
    await new Promise(r => setTimeout(r, 600));
    return [...document.querySelectorAll('#map-results .map-result-item')].map(el =>
      el.querySelector('.map-result-elev').textContent);
  });
  ok(noElev.length === 3, '★標高が読めなくても候補は出る（一覧を止めない）', noElev);
  ok(noElev.every(t => t === ''), '読めなかった標高は空のまま', noElev);
  demBlocked = false;

  /* --- 揺れの無い語では余計に叩かないこと --- */
  hits.length = 0;
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '富士山';
    await doMapSearch();
  });
  ok(hits.length === 1, '揺れの無い語はOSMを1回だけ叩く', hits);

  ok(!errors.length, 'ページ内で例外が出ていない', errors);
  await browser.close();

  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('MAPSEARCH SMOKE FAILED');
    process.exit(1);
  }
  console.log('MAPSEARCH SMOKE PASSED');
})().catch(e => { console.log('MAPSEARCH SMOKE FAILED: ' + e.message); process.exit(1); });
