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

  /* --- 揺れの無い語では余計に叩かないこと --- */
  hits.length = 0;
  await page.evaluate(async () => {
    document.getElementById('map-search-input').value = '富士山';
    await doMapSearch();
  });
  ok(hits.length === 1, '揺れの無い語は1回だけ叩く', hits);

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
