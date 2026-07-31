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
// 雨雲のタイルは地図タイルと違う色にする（消えていないかを画素で見分けるため）
const NOWCAST_PNG = solidPng(8, 8, 0, 80, 255);

const AMEDAS_TABLE = {
  '55102': { kjName: '富山',   lat: [36, 42.0], lon: [137, 12.0], alt: 9 },
  '55136': { kjName: '立山',   lat: [36, 34.0], lon: [137, 39.0], alt: 420 },
  '55396': { kjName: '大山',   lat: [36, 33.0], lon: [137, 24.0], alt: 60 },
  '55999': { kjName: '雨量のみ', lat: [36, 35.0], lon: [137, 38.0], alt: 300 },
};
const AMEDAS_MAP = {
  '55102': { temp: [2.4, 0], wind: [3.1, 0], windDirection: [8, 0], humidity: [70, 0] },
  '55136': { temp: [-4.8, 0], wind: [6.2, 0], windDirection: [16, 0], snow: [180, 0] },
  '55396': { temp: [1.1, 0], wind: [2.0, 0] },
  '55999': { precipitation1h: [3.5, 0] },      // 雨量計のみ＝気温も風も無い地点
};

// 風の格子レスポンス（座標ごとに1つ。1点だけ強風にして警告表示も見る）
function windGridResponse(n) {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 1);
  const time = [];
  for (let i = 0; i < 72; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
  }
  return Array.from({ length: n }, (_, i) => ({
    hourly: {
      time,
      wind_speed_10m: time.map(() => (i === 0 ? 18 : 6)),
      wind_direction_10m: time.map(() => 270),
    },
  }));
}

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
  const nowcastHits = [];
  const satHits = [];
  const timesHits = [];

  async function newPage(initLocalStorage) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 800 },
      permissions: ['geolocation'],
      geolocation: { latitude: 36.57, longitude: 137.65, accuracy: 25 },
    });
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
      if (url.includes('targetTimes_')) {
        timesHits.push(url);
        // 自動更新で時刻表を引き直しているか見るため、2回目以降は別の時刻を返す
        const isJp = url.includes('_jp');
        const isN2 = url.includes('_N2');
        const nth = timesHits.filter(u => u === url).length;
        const stamp = isJp ? (nth > 1 ? '20260131124000' : '20260131123000')
                    : isN2 ? '20260131123000'
                    : (nth > 1 ? '20260131121000' : '20260131120000');
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify([{
          basetime: stamp, validtime: stamp,
          elements: [isN2 ? 'thns' : 'hrpns'],
        }]) });
      }
      // 雨雲だけ色を変える（地図タイルと見分けて「消えていないか」を画素で見るため）
      if (url.includes('/jmatile/')) { nowcastHits.push(url); return route.fulfill({ contentType: 'image/png', body: NOWCAST_PNG }); }
      if (url.includes('/himawari/')) { satHits.push(url); return route.fulfill({ contentType: 'image/jpeg', body: TILE_PNG }); }
      if (url.includes('/amedas/data/latest_time.txt')) return route.fulfill({ contentType: 'text/plain', body: '2026-01-31T12:10:00+09:00' });
      if (url.includes('/amedas/const/amedastable.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(AMEDAS_TABLE) });
      if (url.includes('/amedas/data/map/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(AMEDAS_MAP) });
      if (url.includes('cyberjapandata.gsi.go.jp') || url.includes('tile.openstreetmap.org') ||
          url.includes('server.arcgisonline.com')) {
        tileHits.push(url);
        return route.fulfill({ contentType: 'image/png', body: TILE_PNG });
      }
      if (url.includes('api.open-meteo.com')) {
        // 風の格子（複数座標・wind_speed_10m）は配列で返す
        if (url.includes('wind_speed_10m')) {
          const n = new URL(url).searchParams.get('latitude').split(',').length;
          return route.fulfill({ contentType: 'application/json', body: JSON.stringify(windGridResponse(n)) });
        }
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
      }
      return route.abort();
    });
    await page.addInitScript(ls => {
      localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
      for (const [k, v] of Object.entries(ls || {})) localStorage.setItem(k, v);
    }, initLocalStorage || {});
    await page.goto('https://sotoki.test/');
    await page.waitForTimeout(1200);
    // スクリプトが評価に失敗すると読み込み中のまま固まり、以降のclickが30秒待ちになる。
    // （実際にTDZ＝constの宣言より前で参照して起きた）。ここで早く落として原因を出す。
    const boot = await page.evaluate(() => ({
      err: typeof mapPrefs === 'undefined' ? 'mapPrefs未定義（スクリプトが評価されていない）' : null,
      loading: (() => {
        const el = document.getElementById('loading-overlay');
        return !!el && getComputedStyle(el).display !== 'none';
      })(),
    })).catch(e => ({ err: e.message, loading: true }));
    if (boot.err || boot.loading) {
      throw new Error(`起動に失敗: ${boot.err || '読み込み中のまま'} / pageerror: ${errors.join(' / ') || 'なし'}`);
    }
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

  /* ================= 5b. 複数レイヤーの重ね合わせ ================= */
  await page.evaluate(() => {
    // いったん全部外してから3枚重ねる
    mapPrefs.overlays.slice().forEach(o => toggleOverlay(o.id));
    toggleOverlay('hillshade'); toggleOverlay('relief'); toggleOverlay('gazo1');
  });
  await page.waitForTimeout(400);
  const stacked = await page.evaluate(() => {
    const ids = mapPrefs.overlays.map(o => o.id);
    const live = ids.filter(id => !!overlayTileLayers[id]);
    const onMap = ids.filter(id => leafletMap.hasLayer(overlayTileLayers[id]));
    return { ids, live, onMap, saved: JSON.parse(localStorage.getItem('sotoki.map.overlays') || '[]').map(o => o.id) };
  });
  ok(stacked.ids.length === 3, 'オーバーレイは同時に3枚載る', stacked.ids);
  ok(stacked.live.length === 3 && stacked.onMap.length === 3, '3枚とも地図に載っている', stacked);
  ok(stacked.saved.length === 3, '重ねた状態が保存される', stacked.saved);

  /* ================= 5c. 気象レイヤー ================= */
  const wxDefs = await page.evaluate(() => MAP_WEATHER.map(w => ({ id: w.id, kind: w.kind })));
  ok(wxDefs.length === 5, '気象レイヤーは5種', wxDefs);

  // 降雨レーダー：targetTimes を引いてから basetime/validtime 入りのURLを組む
  await page.evaluate(() => toggleOverlay('radar'));
  await page.waitForTimeout(900);
  const radar = await page.evaluate(() => ({
    on: isOverlayOn('radar'),
    url: overlayTileLayers.radar ? overlayTileLayers.radar._url : null,
    opacity: overlayTileLayers.radar ? overlayTileLayers.radar.options.opacity : null,
    pane: overlayTileLayers.radar ? overlayTileLayers.radar.options.pane : null,
    attribution: document.getElementById('map-attribution').textContent,
  }));
  ok(radar.on && radar.url, '降雨レーダーが載る', radar);
  ok(/20260131120000/.test(radar.url) && /surf\/hrpns/.test(radar.url),
    'targetTimesのbasetime/validtimeでURLを組む', radar.url);
  // ナウキャストだけ別pane。現在地まわりのマスクをここに掛けるため
  ok(radar.pane === 'mapNowcast', 'ナウキャストは専用paneに載る（マスク用に分離）', radar.pane);
  ok(radar.attribution.includes('気象庁'), '出典に気象庁が入る', radar.attribution);

  // 雷は降水とは別のtargetTimes（N2）を見に行く
  await page.evaluate(() => toggleOverlay('thunder'));
  await page.waitForTimeout(900);
  const thunder = await page.evaluate(() => ({
    url: overlayTileLayers.thunder ? overlayTileLayers.thunder._url : null,
    maxNative: overlayTileLayers.thunder ? overlayTileLayers.thunder.options.maxNativeZoom : null,
  }));
  ok(timesHits.some(u => u.includes('targetTimes_N1')), '降水はN1のtargetTimes', timesHits);
  ok(timesHits.some(u => u.includes('targetTimes_N2')), '雷はN2のtargetTimes（降水とは別）', timesHits);
  ok(thunder.url && /20260131123000/.test(thunder.url) && /surf\/thns/.test(thunder.url),
    '雷はN2の時刻でURLを組む', thunder.url);
  ok(thunder.maxNative === 8, '雷はズーム上限が低い（降水より粗いメッシュ）', thunder.maxNative);
  await page.evaluate(() => toggleOverlay('thunder'));
  await page.waitForTimeout(200);

  /* 衛星の雲（ひまわり）。レーダーは降っている所しか映らないので、
     「曇っているが降っていない」を見るのはこちらの役目。 */
  await page.evaluate(() => toggleOverlay('satellite'));
  await page.waitForTimeout(900);
  const sat = await page.evaluate(() => ({
    url: overlayTileLayers.satellite ? overlayTileLayers.satellite._url : null,
    pane: overlayTileLayers.satellite ? overlayTileLayers.satellite.options.pane : null,
    chips: [...document.querySelectorAll('.amedas-el')].map(b => b.textContent),
  }));
  ok(sat.url && /himawari\/data\/satimg/.test(sat.url), '衛星タイルはひまわりの配信を見る', sat.url);
  ok(sat.url && /20260131123000/.test(sat.url), '衛星も targetTimes の時刻でURLを組む', sat.url);
  ok(sat.url && /\/jp\/.*\/REP\/ETC\//.test(sat.url), '既定はカラー（REP/ETC）', sat.url);
  ok(sat.pane === 'mapNowcast', '衛星も雨雲と同じpane（現在地マスクの対象）', sat.pane);
  ok(timesHits.some(u => u.includes('targetTimes_jp')), '衛星は日本域の targetTimes', timesHits);
  ok(sat.chips.includes('赤外'), 'バンド切替のチップが出る', sat.chips);
  ok(satHits.length > 0, '衛星タイルを実際に取りに行っている', satHits.length);

  // バンドを変えるとURLが変わり、選択は保存される
  await page.evaluate(() => setSatBand('B13'));
  await page.waitForTimeout(700);
  const satBand = await page.evaluate(() => ({
    url: overlayTileLayers.satellite ? overlayTileLayers.satellite._url : null,
    saved: localStorage.getItem('sotoki.map.satBand'),
  }));
  ok(satBand.url && /\/B13\/TBB\//.test(satBand.url), '赤外に切り替わる（B13/TBB）', satBand.url);
  ok(satBand.saved === 'B13', '選んだバンドが保存される', satBand.saved);
  await page.evaluate(() => setSatBand('REP'));
  await page.waitForTimeout(500);

  /* 自動更新：時刻表を引き直して新しい basetime のレイヤーに貼り替える。
     雨雲も衛星も数分で更新されるので、開けっぱなしで古い絵のままにしない。 */
  const beforeRefresh = await page.evaluate(() => ({
    radar: overlayTileLayers.radar._url,
    sat: overlayTileLayers.satellite._url,
    interval: WX_REFRESH_MS,
    timerOn: wxRefreshTimer !== null,
  }));
  ok(beforeRefresh.interval === 5 * 60 * 1000, '自動更新は5分間隔', beforeRefresh.interval);
  ok(beforeRefresh.timerOn, '地図を開いている間はタイマーが動く', beforeRefresh.timerOn);
  await page.evaluate(() => refreshWeatherLayers());
  await page.waitForTimeout(1000);
  const afterRefresh = await page.evaluate(() => ({
    radar: overlayTileLayers.radar._url,
    sat: overlayTileLayers.satellite._url,
    layers: (() => { let n = 0; leafletMap.eachLayer(l => { if (l._url && /jmatile|himawari/.test(l._url)) n++; }); return n; })(),
  }));
  ok(/20260131121000/.test(afterRefresh.radar), '更新後は新しいbasetimeで貼り直す', afterRefresh.radar);
  ok(/20260131124000/.test(afterRefresh.sat), '衛星も新しいbasetimeで貼り直す', afterRefresh.sat);
  ok(afterRefresh.layers === 2, '古いレイヤーは残さない（重ならない）', afterRefresh.layers);

  // 閉じたらタイマーを止める（見ていない間は通信しない）
  await page.evaluate(() => closeMap());
  await page.waitForTimeout(200);
  const wxTimerStopped = await page.evaluate(() => wxRefreshTimer === null);
  ok(wxTimerStopped, '地図を閉じたら自動更新を止める', wxTimerStopped);
  await page.evaluate(() => openMap());
  await page.waitForTimeout(900);

  await page.evaluate(() => toggleOverlay('satellite'));
  await page.waitForTimeout(200);

  // アメダス：z8以上で実測ピンが出る
  await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 9); toggleOverlay('amedas'); });
  await page.waitForTimeout(1200);
  const amedas = await page.evaluate(() => {
    const pins = [...document.querySelectorAll('.amedas-box')];
    return {
      count: pins.length,
      texts: pins.map(p => p.textContent),
      status: (document.querySelector('.layer-status[data-id="amedas"]') || {}).textContent,
    };
  });
  ok(amedas.count >= 2, 'アメダスの実測ピンが出る', amedas);
  ok(amedas.texts.some(t => /-4\.8/.test(t)), '気温の実測値を出す', amedas.texts);
  ok(!amedas.texts.some(t => /雨量のみ/.test(t)),
    '気温を持たない地点（雨量計のみ）は気温表示では出さない', amedas.texts);

  // 表示する要素を切り替えられる
  const byElement = await page.evaluate(async () => {
    const out = {};
    for (const id of ['wind', 'precip', 'snow', 'humidity', 'temp']) {
      setAmedasElement(id);
      await new Promise(r => setTimeout(r, 120));
      out[id] = {
        texts: [...document.querySelectorAll('.amedas-box')].map(p => p.textContent),
        arrows: document.querySelectorAll('.amedas-arrow').length,
        saved: localStorage.getItem('sotoki.map.amedasElement'),
      };
    }
    return out;
  });
  ok(byElement.wind.texts.some(t => /6\.2m\/s/.test(t)), '風速に切り替えられる', byElement.wind.texts);
  ok(byElement.wind.arrows > 0, '風のときは向きの矢印が付く', byElement.wind.arrows);
  ok(byElement.precip.texts.some(t => /3\.5mm/.test(t)) &&
     byElement.precip.texts.some(t => /雨量のみ/.test(t)),
    '降水では雨量計のみの地点も出る', byElement.precip.texts);
  ok(byElement.snow.texts.length === 1 && /180cm/.test(byElement.snow.texts[0]),
    '積雪は観測している地点だけ', byElement.snow.texts);
  ok(byElement.humidity.texts.some(t => /70%/.test(t)), '湿度に切り替えられる', byElement.humidity.texts);
  ok(byElement.temp.saved === 'temp', '選んだ要素が保存される', byElement.temp.saved);

  // ズームを引くと出さない（点が多すぎるため）。理由をパネルに出す
  await page.evaluate(() => leafletMap.setView([36.57, 137.65], 6));
  await page.waitForTimeout(700);
  const zoomedOut = await page.evaluate(() => ({
    pins: document.querySelectorAll('.amedas-box').length,
    status: (document.querySelector('.layer-status[data-id="amedas"]') || {}).textContent,
  }));
  ok(zoomedOut.pins === 0, 'ズームを引いたらアメダスは出さない', zoomedOut);
  ok(/拡大/.test(zoomedOut.status || ''), '出さない理由を平易な言葉で出す', zoomedOut.status);

  // 風の矢印（leaflet-velocityは使わない＝アニメーションなし）
  await page.evaluate(() => { leafletMap.setView([36.57, 137.65], 9); toggleOverlay('windArrows'); });
  await page.waitForTimeout(1200);
  const wind = await page.evaluate(() => {
    const boxes = [...document.querySelectorAll('.wind-box')];
    return {
      count: boxes.length,
      rotated: boxes.filter(b => /rotate/.test(b.querySelector('.wind-a').style.transform)).length,
      usesVelocity: typeof L.velocityLayer !== 'undefined',
    };
  });
  ok(wind.count > 0, '風の矢印が出る', wind);
  ok(wind.rotated === wind.count, '矢印が風向に回っている', wind);
  ok(!wind.usesVelocity, 'leaflet-velocityは使っていない（禁止ライブラリ）');

  // 気象レイヤーはSWのキャッシュ対象に入れない（時間で中身が変わるため）
  const wxHosts = await page.evaluate(() => ({
    nowcast: JMA_NOWCAST_BASE,
  }));
  ok(/www\.jma\.go\.jp/.test(wxHosts.nowcast), 'ナウキャストは気象庁ホスト', wxHosts);

  await page.screenshot({ path: __dirname + '/smoke_mapui.png' });

  /* ================= 5d. 地図を閉じずに地点を選べる ================= */
  await page.evaluate(() => { closeLayerPanel(); leafletMap.setView([36.57, 137.65], 11); });
  await page.waitForTimeout(300);
  // お気に入り円柱がヘッダーから地図の下へ引っ越していること（実体は1つ）
  const rotary = await page.evaluate(() => {
    const el = document.getElementById('fav-rotary');
    return {
      count: document.querySelectorAll('#fav-rotary').length,
      inMap: document.getElementById('map-fav-slot').contains(el),
      gpsBtn: !!document.getElementById('btn-map-gps'),
      gpsH: document.getElementById('btn-map-gps').getBoundingClientRect().height,
      // 実際に押せるか（高さだけ見ても、上に何かが被っていたら押せない）
      gpsHit: (() => {
        const b = document.getElementById('btn-map-gps').getBoundingClientRect();
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !!t && document.getElementById('btn-map-gps').contains(t);
      })(),
      rotaryHit: (() => {
        const b = el.getBoundingClientRect();
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !!t && el.contains(t);
      })(),
      width: el.getBoundingClientRect().width,
    };
  });
  ok(rotary.count === 1, 'お気に入り円柱の実体は1つだけ', rotary.count);
  ok(rotary.inMap, '地図を開くと円柱が地図画面へ移る', rotary);
  ok(rotary.gpsBtn && rotary.gpsH >= 44, '地図に「現在地」ボタンがある（44px以上）', rotary);
  // ★閉じたレイヤーパネルが覆いかぶさって押せなくなっていたことがある
  ok(rotary.gpsHit, '「現在地」ボタンが他の要素に覆われていない', rotary.gpsHit);
  ok(rotary.rotaryHit, 'お気に入り円柱が他の要素に覆われていない', rotary.rotaryHit);
  ok(rotary.width > 100, '円柱は地図の幅を使える', rotary.width);

  /* ピンは長押しでだけ立つ（触れたところにすぐ置かれるのは不快、という指摘 v4.56.0）。
     まず「ただのタップでは動かない」ことを見る。 */
  const box = await page.evaluate(() => {
    const r = document.getElementById('map').getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const beforeTap = await page.evaluate(() => ({
    ll: leafletMarker.getLatLng(), picked: document.getElementById('map-picked-name').textContent,
  }));
  await page.mouse.click(box.x + 30, box.y - 20);
  await page.waitForTimeout(1000);
  const shortTap = await page.evaluate(() => ({
    ll: leafletMarker.getLatLng(),
    picked: document.getElementById('map-picked-name').textContent,
    hint: document.getElementById('map-hint').classList.contains('flash'),
    hintText: document.getElementById('map-hint').textContent,
    open: document.getElementById('map-overlay').classList.contains('open'),
  }));
  ok(shortTap.ll.lat === beforeTap.ll.lat && shortTap.ll.lng === beforeTap.ll.lng,
    '★ただのタップではピンが動かない', { before: beforeTap.ll, after: shortTap.ll });
  ok(shortTap.picked === beforeTap.picked, 'ただのタップでは地点も変わらない', shortTap.picked);
  ok(shortTap.hint, '押しても何も起きない理由を案内する（長押しの文言を光らせる）', shortTap);
  ok(/長押し/.test(shortTap.hintText), '案内の文言が「長押し」になっている', shortTap.hintText);
  ok(shortTap.open, 'タップで地図は閉じない');

  // 途中で動かしたら取り消す（地図を動かしたいだけのとき）
  await page.mouse.move(box.x - 40, box.y + 10);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.move(box.x - 40 + 40, box.y + 10 + 40);   // SLOPを超えて動かす
  await page.waitForTimeout(600);
  await page.mouse.up();
  await page.waitForTimeout(400);
  const dragged = await page.evaluate(() => leafletMarker.getLatLng());
  ok(dragged.lat === beforeTap.ll.lat && dragged.lng === beforeTap.ll.lng,
    '★押している途中で動かしたらピンは立たない（パンと取り合わない）', dragged);

  // 長押しすると立つ。押している間は輪が出る
  await page.mouse.move(box.x + 30, box.y - 20);
  await page.mouse.down();
  await page.waitForTimeout(200);
  const holding = await page.evaluate(() => ({
    on: document.getElementById('pin-hold').classList.contains('on'),
    dur: document.getElementById('pin-hold').style.animationDuration,
  }));
  ok(holding.on, '押している間は輪が出る（あとどれくらいで確定するか分かる）', holding);
  ok(holding.dur === '500ms', '輪が閉じる時間は PIN_HOLD_MS と同じ', holding.dur);
  await page.waitForTimeout(500);
  await page.mouse.up();
  await page.waitForTimeout(1200);
  const afterTap = await page.evaluate(() => ({
    open: document.getElementById('map-overlay').classList.contains('open'),
    picked: document.getElementById('map-picked-name').textContent,
    loading: getComputedStyle(document.getElementById('loading-overlay')).display,
    ll: leafletMarker.getLatLng(),
    ring: document.getElementById('pin-hold').classList.contains('on'),
  }));
  ok(afterTap.ll.lat !== beforeTap.ll.lat || afterTap.ll.lng !== beforeTap.ll.lng,
    '★長押しならピンが立つ', { before: beforeTap.ll, after: afterTap.ll });
  ok(!afterTap.ring, '確定したら輪は消える', afterTap.ring);
  ok(afterTap.open, '★地点を選んでも地図は閉じない');
  ok(afterTap.picked && afterTap.picked !== '—', '選んだ地点の名前が出る', afterTap.picked);
  ok(afterTap.loading === 'none', '地図を覆う読込オーバーレイを出さない', afterTap.loading);

  // 円柱で地点を選ぶと、一瞬で飛ばずになめらかに寄る
  const fly = await page.evaluate(() => {
    const calls = [];
    const orig = leafletMap.flyTo.bind(leafletMap);
    leafletMap.flyTo = (ll, z, o) => { calls.push({ ll, z, o }); return orig(ll, z, o); };
    selectFav(36.7583, 137.7583, '白馬岳');
    return { calls, open: document.getElementById('map-overlay').classList.contains('open') };
  });
  ok(fly.calls.length === 1, '円柱の選択でflyToが呼ばれる（setViewの瞬間移動ではない）', fly.calls);
  ok(fly.calls[0] && fly.calls[0].o && fly.calls[0].o.duration > 0, 'アニメーション時間が指定されている', fly.calls[0]);
  ok(fly.open, '円柱で選んでも地図は開いたまま');
  await page.waitForTimeout(1200);

  // 閉じると円柱はヘッダーへ戻る
  await page.evaluate(() => closeMap());
  await page.waitForTimeout(300);
  const rotaryHome = await page.evaluate(() => ({
    inHeader: document.getElementById('header').contains(document.getElementById('fav-rotary')),
    count: document.querySelectorAll('#fav-rotary').length,
  }));
  ok(rotaryHome.inHeader && rotaryHome.count === 1, '地図を閉じると円柱はヘッダーへ戻る', rotaryHome);
  await page.evaluate(() => openMap());
  await page.waitForTimeout(600);

  /* ================= 5e. 現在地の追跡とヘディングアップ ================= */
  await page.evaluate(() => { if (mapHeadingUp) setHeadingUp(false); if (geoWatchId != null) stopTracking(); });
  await page.click('#btn-track');
  await page.waitForTimeout(900);
  const tracking = await page.evaluate(() => ({
    watching: geoWatchId != null,
    pressed: document.getElementById('btn-track').getAttribute('aria-pressed'),
    dot: document.querySelectorAll('.me-dot').length,
    circle: !!meCircle,
    // 現在地マーカーは「選択地点のピン」とは別物
    separateFromPin: !!meMarker && !!leafletMarker && meMarker !== leafletMarker,
  }));
  ok(tracking.watching && tracking.pressed === 'true', '追跡が始まる', tracking);
  ok(tracking.dot === 1 && tracking.circle, '現在地マーカーと誤差の輪が出る', tracking);
  ok(tracking.separateFromPin, '現在地は選択地点のピンとは別のマーカー', tracking.separateFromPin);

  // ヘディングアップ：地図が回り、手動パンは止まり、ラベルは逆回転で立つ
  const heading = await page.evaluate(async () => {
    // 方位センサーの許可ダイアログはこの環境に無いので、そのままイベントを流す
    await toggleOrientation();
    const ev = new Event('deviceorientation');
    ev.webkitCompassHeading = 90;          // 東を向いている
    window.dispatchEvent(ev);
    await new Promise(r => setTimeout(r, 200));
    const stage = document.getElementById('map-stage');
    return {
      headingUp: mapHeadingUp,
      rotation: mapRotationDeg,
      mapTransform: document.getElementById('map').style.transform,
      counterRot: getComputedStyle(stage).getPropertyValue('--map-rot').trim(),
      dragging: leafletMap.dragging.enabled(),
      rotating: stage.classList.contains('rotating'),
      label: document.getElementById('orient-label').textContent,
    };
  });
  ok(heading.headingUp, 'ヘディングアップに切り替わる', heading);
  ok(heading.rotation === -90, '東を向いたら地図は-90度回る（進行方向が上）', heading.rotation);
  ok(/rotate\(-90deg\)/.test(heading.mapTransform), '地図にrotateが掛かる', heading.mapTransform);
  ok(heading.counterRot === '90deg', '自前ラベルは逆回転で立てる', heading.counterRot);
  ok(heading.dragging === false, '★回転中は手動パンを止める（座標がねじれるため）', heading.dragging);
  ok(heading.rotating, '地図の実体を広げるクラスが付く');
  ok(heading.label === '進行', 'ボタンの表示が「進行」になる', heading.label);

  // ★回転中でもタップした場所が正しく取れること（補正が効いているか）
  const rotTap = await page.evaluate(() => {
    const c = leafletMap.getContainer();
    const r = c.getBoundingClientRect();
    // 画面上でコンテナ中心から右へ100pxの位置をタップしたことにする
    const fake = { clientX: r.left + r.width / 2 + 100, clientY: r.top + r.height / 2 };
    const p = leafletMap.mouseEventToContainerPoint(fake);
    return { x: Math.round(p.x - c.clientWidth / 2), y: Math.round(p.y - c.clientHeight / 2) };
  });
  // -90度回した地図で画面右は、地図座標では下（+y）にあたる
  ok(Math.abs(rotTap.x) <= 1 && Math.abs(rotTap.y - 100) <= 1,
    '回転中のタップ座標が逆回転で補正される', rotTap);

  // 北向きに戻す
  await page.evaluate(() => setHeadingUp(false));
  await page.waitForTimeout(200);
  const northUp = await page.evaluate(() => ({
    headingUp: mapHeadingUp,
    rotation: mapRotationDeg,
    dragging: leafletMap.dragging.enabled(),
    label: document.getElementById('orient-label').textContent,
  }));
  ok(!northUp.headingUp && northUp.rotation === 0, 'ノースアップに戻る', northUp);
  ok(northUp.dragging === true, '戻したら手動パンが復活する', northUp.dragging);
  ok(northUp.label === '北', 'ボタンの表示が「北」に戻る', northUp.label);

  // ★雨雲の中でも自位置が分かるよう、現在地のまわりだけ雨雲を抜く
  const spot = await page.evaluate(() => {
    const host = leafletMap.getPane('mapNowcastMask');
    const tiles = leafletMap.getPane('mapNowcast');
    const hr = host.getBoundingClientRect(), size = leafletMap.getSize();
    return {
      mask: host.style.maskImage || host.style.webkitMaskImage,
      tileMask: tiles.style.maskImage || tiles.style.webkitMaskImage,
      hostW: Math.round(hr.width), hostH: Math.round(hr.height),
      sizeX: size.x, sizeY: size.y,
      // マーカーは別paneなので抜かれない
      markerPane: meMarker.options.pane,
      nowcastPane: overlayTileLayers.radar ? overlayTileLayers.radar.options.pane : null,
    };
  });
  ok(/radial-gradient/.test(spot.mask || ''), '現在地のまわりにマスクが掛かる', spot.mask);
  ok(/rgba\(0, ?0, ?0, ?0\)/.test(spot.mask || ''), 'マスクの中心は透明（雨雲が抜ける）', spot.mask);
  ok(spot.markerPane === 'mapWeather' && spot.nowcastPane === 'mapNowcast',
    '現在地マーカーと雨雲は別pane（マーカーごと消さないため）', spot);
  /* ★マスクは「実寸のある箱」にしか効かない。Leafletのpaneは0×0なので、
     paneに直接掛けると塗り領域が無くレイヤーが丸ごと消える（実際に出した不具合）。
     入れ物を挟んで画面ぶんの寸法を持たせていること。 */
  ok(spot.hostW === spot.sizeX && spot.hostH === spot.sizeY,
    '★マスクを掛ける入れ物が画面と同じ実寸を持つ（0×0だとレイヤーごと消える）', spot);
  ok(!spot.tileMask, 'タイルのpane自体にはマスクを掛けない（0×0なので消える）', spot.tileMask);

  /* ★画素で確かめる。追跡のon/offで、離れた場所の雨雲は変わってはいけない
     （「追跡をonにするとレイヤーが変わる」という指摘の正体がこれだった）。 */
  await page.evaluate(() => {
    // 点で描くレイヤーは消しておく（矢印やピンが混ざると雨雲の変化と見分けられない）
    if (isOverlayOn('amedas')) toggleOverlay('amedas');
    if (isOverlayOn('windArrows')) toggleOverlay('windArrows');
    stopTracking();
    leafletMap.setView([36.57, 137.65], 11);      // 現在地と同じ中心＝追跡でも地図は動かない
  });
  await page.waitForTimeout(1500);
  const mapBox = await page.evaluate(() => {
    const r = document.getElementById('map').getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const cx = Math.round(mapBox.x + mapBox.w / 2), cy = Math.round(mapBox.y + mapBox.h / 2);
  // 遠く（穴の外＝中心から200px下）と、穴の中だがマーカーには掛からない場所（中心の78px左）
  const farClip = { x: cx - 12, y: cy + 190, width: 24, height: 24 };
  const nearClip = { x: cx - 86, y: cy - 8, width: 16, height: 16 };
  // 標本の場所に他の要素が乗っていないことを先に確かめる（乗っていると比較が無意味になる）
  const onTop = await page.evaluate(pts => pts.map(([x, y]) => {
    const e = document.elementFromPoint(x, y);
    return e ? (e.id || e.className || e.tagName) : null;
  }), [[cx, cy + 202], [cx - 78, cy]]);
  ok(onTop.every(t => t === 'map'), '画素を比べる場所に他の要素が乗っていない', onTop);
  const farOff = await page.screenshot({ clip: farClip });
  const nearOff = await page.screenshot({ clip: nearClip });
  await page.evaluate(() => startTracking());
  await page.waitForTimeout(1200);
  const farOn = await page.screenshot({ clip: farClip });
  const nearOn = await page.screenshot({ clip: nearClip });
  ok(farOn.equals(farOff), '★追跡をonにしても離れた場所の雨雲は変わらない（レイヤーが消えない）');
  ok(!nearOn.equals(nearOff), '★現在地のまわりだけは実際に薄くなる（マスクが効いている）');

  // ダブルタップ＋上下ドラッグで拡大縮小できる
  const dtap = await page.evaluate(async () => {
    const el = leafletMap.getContainer();
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const touch = (tx, ty) => [{ clientX: tx, clientY: ty, identifier: 1, target: el }];
    const fire = (type, tx, ty) => {
      const ev = new Event(type, { bubbles: true, cancelable: true });
      ev.touches = type === 'touchend' ? [] : touch(tx, ty);
      el.dispatchEvent(ev);
      return ev;
    };
    const before = leafletMap.getZoom();
    fire('touchstart', x, y); fire('touchend', x, y);       // 1回目
    await new Promise(r2 => setTimeout(r2, 60));
    const start = fire('touchstart', x, y);                  // 2回目（押したまま）
    fire('touchmove', x, y - 180);                           // 上へ180px＝2段ぶん
    // 変形の更新はrequestAnimationFrameに載せているので1フレーム待つ
    await new Promise(r2 => requestAnimationFrame(() => requestAnimationFrame(r2)));
    const during = leafletMap.getZoom();
    fire('touchend', x, y - 180);
    await new Promise(r2 => setTimeout(r2, 400));
    const c = leafletMap.getCenter();
    return { before, during, after: leafletMap.getZoom(), prevented: start.defaultPrevented,
             snap: leafletMap.options.zoomSnap,
             tracking: geoWatchId != null,
             centerOffMe: myPos ? Math.max(Math.abs(c.lat - myPos.lat), Math.abs(c.lng - myPos.lon)) : null,
             // ピンチと同じ道（_move）を通しているか。setZoomを毎フレーム呼ぶとカクつく
             usesPinchPath: typeof leafletMap._move === 'function' && typeof leafletMap._animateZoom === 'function' };
  });
  ok(dtap.during > dtap.before + 1.5, 'ダブルタップ＋上ドラッグで拡大する（指を動かしている最中に効く）', dtap);
  ok(Math.abs(dtap.during - dtap.after) < 0.01, '指を離した位置のズームで止まる', dtap);
  ok(dtap.prevented, '2回目のタップは地図のパンに取られない', dtap.prevented);
  ok(dtap.snap === 0, '小数ズームを許してなめらかにする', dtap.snap);
  ok(dtap.usesPinchPath, 'ピンチズームと同じ内部経路が使える（Leaflet 1.9系）', dtap.usesPinchPath);
  // ★追跡中は自分の位置を中心に拡大縮小する
  ok(dtap.tracking && dtap.centerOffMe != null && dtap.centerOffMe < 1e-4,
    '追跡中は自位置を中心に拡大縮小する', dtap);

  // 動かさずに離せば、ふつうのダブルタップとして1段拡大
  const dtapPlain = await page.evaluate(async () => {
    const el = leafletMap.getContainer();
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const fire = (type, tx, ty) => {
      const ev = new Event(type, { bubbles: true, cancelable: true });
      ev.touches = type === 'touchend' ? [] : [{ clientX: tx, clientY: ty, identifier: 1, target: el }];
      el.dispatchEvent(ev);
    };
    leafletMap.setZoom(10, { animate: false });
    await new Promise(r2 => setTimeout(r2, 200));
    const before = leafletMap.getZoom();
    fire('touchstart', x, y); fire('touchend', x, y);
    await new Promise(r2 => setTimeout(r2, 60));
    fire('touchstart', x, y); fire('touchend', x, y);
    await new Promise(r2 => setTimeout(r2, 400));
    return { before, after: leafletMap.getZoom() };
  });
  ok(Math.abs(dtapPlain.after - dtapPlain.before - 1) < 0.01,
    'その場のダブルタップは1段拡大', dtapPlain);

  // 追跡を止めるとマーカーも消える
  await page.evaluate(() => stopTracking());
  await page.waitForTimeout(200);
  const stopped = await page.evaluate(() => ({
    watching: geoWatchId != null,
    dot: document.querySelectorAll('.me-dot').length,
  }));
  ok(!stopped.watching && stopped.dot === 0, '追跡を止めると現在地マーカーが消える', stopped);
  const spotOff = await page.evaluate(() => {
    const host = leafletMap.getPane('mapNowcastMask');
    const tiles = leafletMap.getPane('mapNowcast');
    return {
      mask: host.style.maskImage || host.style.webkitMaskImage || '',
      hostW: host.style.width, tileLeft: tiles.style.left,
    };
  });
  ok(spotOff.mask === '', '追跡を止めたらマスクも外れる', spotOff.mask);
  ok(spotOff.hostW === '' && spotOff.tileLeft === '',
    '入れ物のずらしも元に戻す（掛けっぱなしにしない）', spotOff);

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
