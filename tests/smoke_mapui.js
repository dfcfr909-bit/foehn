// 地図選択画面の検証（docs/map-selector-requirements.md）
//   ・ベースマップ5種の排他切替
//   ・オーバーレイのトグルと透過スライダー（0〜100%が地図に反映される）
//   ・赤色立体図風の合成（pane単位のmix-blend-mode）と、傾斜量図・陰影起伏図との排他
//   ・ネイティブ範囲外でも空白にならないこと（maxNativeZoom/minNativeZoomの設定）
//   ・出典表記が有効レイヤーと一致すること
//   ・選択状態の永続化と、不正値のフォールバック
//   ・標高タイルからの標高取得（座標換算とRGB→標高の換算）
//   ・タッチターゲット44px以上
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
const p2 = n => String(n).padStart(2, '0');

/* --- 単色PNGを組み立てる（標高タイルの代わり。既知のRGBを埋めて換算を検証する） --- */
const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return buf => {
    let c = -1;
    for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ -1) >>> 0;
  };
})();
function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function solidPng(w, h, r, g, b) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    const o = y * (w * 3 + 1);
    for (let x = 0; x < w; x++) { raw[o + 1 + x * 3] = r; raw[o + 2 + x * 3] = g; raw[o + 3 + x * 3] = b; }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 2;      // 8bit / truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
// 標高1845.67m → x=184567 → RGB(2,208,247)
const DEM_RGB = [2, 208, 247];
const DEM_EXPECTED_M = 1845.67;
const DEM_PNG = solidPng(256, 256, ...DEM_RGB);
const TILE_PNG = solidPng(8, 8, 200, 200, 200);

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.temperature_2m.push(-5); h.apparent_temperature.push(-9);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(4);
    h.winddirection_10m.push(180); h.weathercode.push(2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${p2(b.getMonth() + 1)}-${p2(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily, elevation: 1500 };
}

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const errors = [];
  const tileHits = [];
  const demHits = [];

  async function newPage(initLocalStorage) {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
    page.on('pageerror', e => errors.push(e.message));
    page.on('dialog', d => d.accept());
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
      if (url.includes('/dem_png/')) { demHits.push(url); return route.fulfill({ contentType: 'image/png', body: DEM_PNG }); }
      if (url.includes('cyberjapandata.gsi.go.jp') || url.includes('tile.openstreetmap.org') ||
          url.includes('server.arcgisonline.com')) {
        tileHits.push(url);
        return route.fulfill({ contentType: 'image/png', body: TILE_PNG });
      }
      if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
      return route.abort();
    });
    await page.addInitScript(ls => {
      localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
      for (const [k, v] of Object.entries(ls || {})) localStorage.setItem(k, v);
    }, initLocalStorage || {});
    await page.goto('https://sotoki.test/');
    await page.waitForTimeout(1200);
    return page;
  }

  /* ================= 1. 既定状態とレイヤーパネル ================= */
  const page = await newPage();
  await page.click('#btn-map');
  await page.waitForTimeout(700);
  await page.click('#btn-layers');
  await page.waitForTimeout(400);

  const init = await page.evaluate(() => {
    const baseBtns = [...document.querySelectorAll('.layer-base')];
    const ovRows = [...document.querySelectorAll('.layer-ov')];
    const small = [...document.querySelectorAll('#layer-panel button, #layer-panel input[type=range], #btn-layers')]
      .map(el => ({ id: el.id || el.className, h: el.getBoundingClientRect().height }))
      .filter(x => x.h > 0 && x.h < 44);
    return {
      panelOpen: document.getElementById('layer-panel').classList.contains('open'),
      baseCount: baseBtns.length,
      baseNames: baseBtns.map(b => b.querySelector('.layer-base-name').textContent),
      activeBase: baseBtns.filter(b => b.classList.contains('active'))
        .map(b => b.querySelector('.layer-base-name').textContent),
      prefBase: mapPrefs.base,
      overlayNames: ovRows.map(r => r.querySelector('.layer-ov-name').textContent.trim().split('\n')[0]),
      // URL未確認の火山土地条件図はUIに出さない
      hasVolcano: ovRows.some(r => /火山/.test(r.textContent)),
      volcanoDefined: MAP_OVERLAYS.some(o => o.id === 'volcano' && o.pending),
      attribution: document.getElementById('map-attribution').textContent,
      tooSmall: small,
      // 既定はオーバーレイなし
      overlaysOn: mapPrefs.overlays.length,
      zoomRange: [leafletMap.getMinZoom(), leafletMap.getMaxZoom()],
    };
  });
  ok(init.panelOpen, 'レイヤーパネルが開く');
  ok(init.baseCount === 5, 'ベースマップは5種', init.baseCount);
  ok(init.prefBase === 'pale', '既定は淡色地図', init.prefBase);
  ok(init.activeBase.length === 1 && init.activeBase[0] === '淡色地図', '排他選択（1つだけactive）', init.activeBase);
  ok(init.overlaysOn === 0, '既定はオーバーレイなし');
  ok(!init.hasVolcano && init.volcanoDefined, '火山土地条件図はpendingでUIに出さない',
    { hasVolcano: init.hasVolcano, defined: init.volcanoDefined });
  ok(init.attribution === '国土地理院', '出典が有効ベースと一致', init.attribution);
  ok(init.tooSmall.length === 0, 'タッチターゲットは44px以上', init.tooSmall);
  ok(init.zoomRange[1] === 18, '最大ズームは18', init.zoomRange);

  /* ================= 2. ベースマップ切替 ================= */
  await page.click('.layer-base:nth-child(5)');   // 衛星画像（Esri）
  await page.waitForTimeout(400);
  const esri = await page.evaluate(() => ({
    pref: mapPrefs.base,
    url: baseTileLayer._url,
    saved: localStorage.getItem('sotoki.map.baseLayer'),
    attribution: document.getElementById('map-attribution').textContent,
    activeCount: document.querySelectorAll('.layer-base.active').length,
  }));
  ok(esri.pref === 'esri', 'ベースマップが切り替わる', esri.pref);
  ok(/\{z\}\/\{y\}\/\{x\}/.test(esri.url), 'EsriはURLのx/yが逆', esri.url);
  ok(esri.saved === 'esri', '選択が保存される', esri.saved);
  ok(esri.attribution.includes('Esri'), '出典がEsriに変わる', esri.attribution);
  ok(esri.activeCount === 1, '切替後もactiveは1つだけ', esri.activeCount);

  /* ================= 3. オーバーレイと透過スライダー ================= */
  await page.evaluate(() => toggleOverlay('relief'));
  await page.waitForTimeout(300);
  const relief = await page.evaluate(() => ({
    on: isOverlayOn('relief'),
    opacity: overlayTileLayers.relief.options.opacity,
    layerUrl: overlayTileLayers.relief._url,
    maxNative: overlayTileLayers.relief.options.maxNativeZoom,
    maxZoom: overlayTileLayers.relief.options.maxZoom,
    attribution: document.getElementById('map-attribution').textContent,
  }));
  ok(relief.on, 'オーバーレイが有効になる');
  ok(Math.abs(relief.opacity - 0.40) < 1e-6, '既定透過率40%', relief.opacity);
  ok(relief.maxNative === 15 && relief.maxZoom === 18,
    'ネイティブ上限を超えてもオーバーズームで埋める', relief);
  ok(relief.attribution.includes('Esri') && relief.attribution.includes('国土地理院'),
    '出典がベース＋オーバーレイになる', relief.attribution);

  // スライダーを動かすと即座に反映される
  await page.evaluate(() => setOverlayOpacity('relief', 0));
  const at0 = await page.evaluate(() => overlayTileLayers.relief.options.opacity);
  await page.evaluate(() => setOverlayOpacity('relief', 1));
  const at100 = await page.evaluate(() => ({
    op: overlayTileLayers.relief.options.opacity,
    label: document.querySelector('.layer-op-val[data-id="relief"]').textContent,
  }));
  ok(at0 === 0, '透過率0%が反映される', at0);
  ok(at100.op === 1 && at100.label === '100%', '透過率100%が反映される', at100);

  /* ================= 4. 赤色立体図風の合成と排他 ================= */
  await page.evaluate(() => { toggleOverlay('slope'); toggleOverlay('hillshade'); });
  await page.waitForTimeout(200);
  const before = await page.evaluate(() => mapPrefs.overlays.map(o => o.id));
  await page.evaluate(() => toggleOverlay('rrimLike'));
  await page.waitForTimeout(400);
  const rrim = await page.evaluate(() => {
    const slopePane = leafletMap.getPane('rrimSlope');
    const shadePane = leafletMap.getPane('rrimShade');
    return {
      ids: mapPrefs.overlays.map(o => o.id),
      layerCount: Array.isArray(overlayTileLayers.rrimLike) ? overlayTileLayers.rrimLike.length : 0,
      urls: (overlayTileLayers.rrimLike || []).map(l => l._url),
      blend: getComputedStyle(slopePane).mixBlendMode,
      shadeBlend: getComputedStyle(shadePane).mixBlendMode,
      paneOpacity: [Number(shadePane.style.opacity), Number(slopePane.style.opacity)],
      zIndex: [Number(shadePane.style.zIndex), Number(slopePane.style.zIndex)],
      maxNative: (overlayTileLayers.rrimLike || []).map(l => l.options.maxNativeZoom),
    };
  });
  ok(before.includes('slope') && before.includes('hillshade'), '前提：単独トグルが有効だった', before);
  ok(!rrim.ids.includes('slope') && !rrim.ids.includes('hillshade'),
    '赤色立体図風にすると傾斜量図・陰影起伏図は自動で外れる', rrim.ids);
  ok(rrim.layerCount === 2, '合成は2枚のタイルレイヤー', rrim.layerCount);
  ok(rrim.urls.some(u => u.includes('hillshademap')) && rrim.urls.some(u => u.includes('slopemap')),
    '陰影起伏図と傾斜量図を使う', rrim.urls);
  ok(rrim.blend === 'multiply', '傾斜量図のpaneがmultiply（pane単位で掛ける）', rrim.blend);
  ok(rrim.shadeBlend === 'normal', '陰影起伏図のpaneは通常合成', rrim.shadeBlend);
  ok(rrim.paneOpacity[0] === 0.7 && rrim.paneOpacity[1] === 0.7, '合成全体の不透明度はpaneで制御', rrim.paneOpacity);
  ok(rrim.zIndex[1] > rrim.zIndex[0], '傾斜量図が上に載る', rrim.zIndex);
  ok(rrim.maxNative.every(z => z === 15), '合成のネイティブ上限は傾斜量図に合わせる', rrim.maxNative);

  // 逆向きの排他：傾斜量図を入れると赤色立体図風が外れる
  await page.evaluate(() => toggleOverlay('slope'));
  await page.waitForTimeout(200);
  const backToSlope = await page.evaluate(() => mapPrefs.overlays.map(o => o.id));
  ok(backToSlope.includes('slope') && !backToSlope.includes('rrimLike'),
    '傾斜量図を入れると赤色立体図風が外れる', backToSlope);

  /* ================= 5. 標高タイル ================= */
  const elev = await page.evaluate(async () => {
    // 換算そのもの（RGB→標高）
    const dec = {
      normal: decodeDemPixel(2, 208, 247),
      zero: decodeDemPixel(0, 0, 0),
      invalid: decodeDemPixel(128, 0, 0),          // x = 2^23 は無効値
      negative: decodeDemPixel(255, 255, 255),     // x > 2^23 は負の標高
    };
    // タイル座標とタイル内画素
    const t = lonLatToTilePixel(35.3606, 138.7274, 14);   // 富士山付近
    // 実際に取りに行く（スタブが単色PNGを返す）
    const got = await fetchPointElevation(36.57, 137.65);
    return {
      dec, t, got,
      label: document.getElementById('map-elev').textContent,
      labelShown: getComputedStyle(document.getElementById('map-elev')).display !== 'none',
      display: displayElevation(),
      modelElevation: state.elevation,
    };
  });
  ok(Math.abs(elev.dec.normal - 1845.67) < 1e-6, 'RGB→標高の換算', elev.dec.normal);
  ok(elev.dec.zero === 0, '標高0m');
  ok(elev.dec.invalid === null, 'x=2^23 は無効値（null）', elev.dec.invalid);
  ok(elev.dec.negative < 0, 'x>2^23 は負の標高', elev.dec.negative);
  // 期待値は別式（0.5 − ln((1+sinφ)/(1−sinφ))/4π）で検算した値
  ok(elev.t.tx === 14505 && elev.t.ty === 6469 && elev.t.px === 163 && elev.t.py === 150,
    'タイル座標とタイル内画素の換算', elev.t);
  ok(elev.t.px >= 0 && elev.t.px < 256 && elev.t.py >= 0 && elev.t.py < 256, 'タイル内画素は0〜255', elev.t);
  ok(Math.abs(elev.got - 1845.67) < 0.02, '標高タイルから標高を読む', elev.got);
  ok(elev.labelShown && /1846m/.test(elev.label), '標高が表示される', elev.label);
  ok(Math.abs(elev.display - 1845.67) < 0.02, '表示用はDEM実測を優先', elev.display);
  ok(elev.modelElevation === 1500, 'Open-Meteoのモデル標高は変えない（API用）', elev.modelElevation);

  // 同一地点は再取得しない（通信が増えないことで確かめる）
  const demBefore = demHits.length;
  const refetch = await page.evaluate(() => fetchPointElevation(36.57, 137.65));
  await page.waitForTimeout(200);
  ok(demHits.length === demBefore, '同一地点は標高タイルを取り直さない',
    { before: demBefore, after: demHits.length });
  ok(Math.abs(refetch - 1845.67) < 0.02, '再取得でも同じ値を返す', refetch);

  // 取得失敗しても地図は止まらない
  const failElev = await page.evaluate(async () => {
    const v = await fetchPointElevation(0.0, 0.0);   // スタブは単色PNGを返すので値は入るが、経路の確認
    return { v, mapAlive: !!leafletMap && !!leafletMap.getCenter() };
  });
  ok(failElev.mapAlive, '標高取得の後も地図は生きている');

  await page.screenshot({ path: __dirname + '/smoke_mapui.png' });

  /* ================= 6. 永続化と復元 ================= */
  const saved = await page.evaluate(() => ({
    base: localStorage.getItem('sotoki.map.baseLayer'),
    overlays: localStorage.getItem('sotoki.map.overlays'),
  }));
  ok(saved.base === 'esri', 'ベースが保存されている', saved.base);
  ok(/relief/.test(saved.overlays), 'オーバーレイが保存されている', saved.overlays);
  await page.close();

  // 保存済みの状態で開き直すと復元される
  const page2 = await newPage({
    'sotoki.map.baseLayer': 'photo',
    'sotoki.map.overlays': JSON.stringify([{ id: 'hillshade', opacity: 0.25 }]),
  });
  await page2.click('#btn-map');
  await page2.waitForTimeout(700);
  const restored = await page2.evaluate(() => ({
    base: mapPrefs.base,
    baseUrl: baseTileLayer._url,
    overlays: mapPrefs.overlays,
    liveOpacity: overlayTileLayers.hillshade ? overlayTileLayers.hillshade.options.opacity : null,
  }));
  ok(restored.base === 'photo', 'ベースが復元される', restored.base);
  ok(/seamlessphoto/.test(restored.baseUrl), '復元したURLが正しい', restored.baseUrl);
  ok(restored.overlays.length === 1 && restored.overlays[0].id === 'hillshade',
    'オーバーレイが復元される', restored.overlays);
  ok(restored.liveOpacity === 0.25, '透過率も復元される', restored.liveOpacity);
  await page2.close();

  // 不正値はデフォルトへ落とす
  const page3 = await newPage({
    'sotoki.map.baseLayer': 'nonexistent',
    'sotoki.map.overlays': JSON.stringify([
      { id: 'unknownLayer', opacity: 0.5 },
      { id: 'volcano', opacity: 0.6 },        // pendingは復元しない
      { id: 'relief', opacity: 99 },          // 範囲外の透過率
      'ゴミ',
    ]),
  });
  await page3.click('#btn-map');
  await page3.waitForTimeout(700);
  const fallback = await page3.evaluate(() => ({
    base: mapPrefs.base,
    overlays: mapPrefs.overlays,
  }));
  ok(fallback.base === 'pale', '未知のベースIDは既定（淡色地図）へ', fallback.base);
  ok(fallback.overlays.length === 1 && fallback.overlays[0].id === 'relief',
    '未知ID・pendingは捨てる', fallback.overlays);
  ok(fallback.overlays[0].opacity === 0.40, '範囲外の透過率は既定へ', fallback.overlays[0]);

  // 壊れたJSONでも落ちない
  await page3.close();
  const page4 = await newPage({ 'sotoki.map.overlays': '{壊れたJSON' });
  await page4.click('#btn-map');
  await page4.waitForTimeout(700);
  const broken = await page4.evaluate(() => ({ base: mapPrefs.base, n: mapPrefs.overlays.length }));
  ok(broken.base === 'pale' && broken.n === 0, '壊れた保存値でも既定で起動する', broken);
  await page4.close();

  await browser.close();
  if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('MAPUI SMOKE FAILED');
    process.exit(1);
  }
  console.log(JSON.stringify({ init, esri, relief, rrim, elev: elev.dec, restored, fallback }, null, 2));
  console.log(`タイル取得 ${tileHits.length}件`);
  console.log('MAPUI SMOKE PASSED');
})();
