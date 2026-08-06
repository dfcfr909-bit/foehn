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
/* 衛星タイルは**隣り合うタイルで暗部の水準を変える**（6 と 26）。
   ひまわりの夜間画像はタイルごとに黒レベルがわずかに違い、screen合成だと
   その差がタイルの継ぎ目＝縦横の線・格子として見えた（実機で踏んだ）。
   一様に真っ黒な素材では**この不具合が再現しない**ので、わざと差をつけてある。 */
const SAT_DARK_A = solidPng(256, 256, 6, 6, 6);
const SAT_DARK_B = solidPng(256, 256, 26, 26, 26);
/* 雲は**真っ白ではなく薄い灰色**にする。真っ白だといくら黒レベルを切り上げても
   白のままなので、「切り捨てが強すぎて雲まで消える」側の失敗を素通りする（実際に素通りした）。 */
const SAT_CLOUD = solidPng(256, 256, 110, 110, 110);
/* 'patchy' … **一部のタイルだけ404**。ひまわりのカラーが帯状にしか出なかった実機の再現。
   以前の失敗報告は「1枚でも読めたら以降を無視」だったので、この状態を**黙って通していた**。 */
let satTileMode = 'dark';        // 'dark' / 'cloud'（薄い雲）/ 'patchy'（虫食い配信）
function satTileBody(url) {
  if (satTileMode === 'cloud') return SAT_CLOUD;
  const m = /\/(\d+)\/(\d+)\/(\d+)\.jpg/.exec(url);
  return (m && ((+m[2] + +m[3]) % 2)) ? SAT_DARK_B : SAT_DARK_A;
}
// 雨雲のタイルは地図タイルと違う色にする（消えていないかを画素で見分けるため）
const NOWCAST_PNG = solidPng(8, 8, 0, 80, 255);
/* 雷タイルは RGBA で「左上1/4だけ塗り」にする。
   雷マークは塗ってある所にだけ置かれる（＝画像を読んで位置を決めている）ことを見るため */
function rgbaPng(w, h, fn) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const o = y * (w * 4 + 1);
    for (let x = 0; x < w; x++) {
      const p = fn(x, y);
      raw[o + 1 + x * 4] = p[0]; raw[o + 2 + x * 4] = p[1];
      raw[o + 3 + x * 4] = p[2]; raw[o + 4 + x * 4] = p[3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;   // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
/* 塗るのはタイルの一部だけ（12/64＝面積の3.5%）。
   広く塗ると「格子状に置いているだけ」の実装でも近くに塗りが見つかってしまい、
   検査が意味を失う（実際にすり抜けた）。 */
const THUNDER_PNG = rgbaPng(64, 64,
  (x, y) => (x >= 10 && x < 22 && y >= 10 && y < 22) ? [255, 230, 0, 230] : [0, 0, 0, 0]);

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

const MAP_HINT_WAIT = 5200;   // sotoki_v4.html の MAP_HINT_MS(4500) より少し長く

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
      // 雷は一部だけ塗ったタイル（雷マークの置き場所を画像から決めているのを見るため）
      if (url.includes('/surf/thns/')) {
        nowcastHits.push(url);
        return route.fulfill({ contentType: 'image/png', body: THUNDER_PNG,
          headers: { 'access-control-allow-origin': '*' } });
      }
      // 雨雲だけ色を変える（地図タイルと見分けて「消えていないか」を画素で見るため）
      if (url.includes('/jmatile/')) { nowcastHits.push(url); return route.fulfill({ contentType: 'image/png', body: NOWCAST_PNG }); }
      // 衛星は**暗いタイル**を返す（ひまわりのJPEGは透明部分が無く、実機で全面真っ黒になった）
      if (url.includes('/himawari/')) {
        satHits.push(url);
        if (satTileMode === 'patchy') {
          // 1列だけ通し、残りは404（実機で見えた「帯だけ出る」状態）
          const m = /\/(\d+)\/(\d+)\/(\d+)\.jpg/.exec(url);
          const keep = m && (+m[2] % 3 === 0);
          if (!keep) return route.fulfill({ status: 404, body: '' });
        }
        return route.fulfill({ contentType: 'image/jpeg', body: satTileBody(url) });
      }
      if (url.includes('/amedas/data/latest_time.txt')) return route.fulfill({ contentType: 'text/plain', body: '2026-01-31T12:10:00+09:00' });
      if (url.includes('/amedas/const/amedastable.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(AMEDAS_TABLE) });
      if (url.includes('/amedas/data/map/')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(AMEDAS_MAP) });
      if (url.includes('cyberjapandata.gsi.go.jp') || url.includes('tile.openstreetmap.org') ||
          url.includes('server.arcgisonline.com')) {
        tileHits.push(url);
        return route.fulfill({ contentType: 'image/png', body: TILE_PNG });
      }
      if (url.includes('nominatim.openstreetmap.org/search')) {
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(
          Array.from({ length: 8 }, (_, i) => ({
            lat: String(36.5 + i * 0.01), lon: String(137.6 + i * 0.01),
            display_name: `東町${i}, 矢板市, 栃木県, 日本`, name: `東町${i}`,
          }))) });
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
  /* CS立体図は保留中（v4.63.1）。実機で石川県が配信範囲外だったのでUIから隠してある。
     火山土地条件図と同じく、定義は残して pending でだけ止める。 */
  const csmap = await page.evaluate(() => {
    const def = MAP_OVERLAYS.find(o => o.id === 'csmap');
    return {
      defined: !!def,
      pending: !!(def && def.pending),
      shown: usableOverlays().some(o => o.id === 'csmap'),
      inPanel: /CS立体図/.test(document.getElementById('layer-overlays').innerHTML),
      // 保存済みの設定に残っていても復元しない
      restored: (() => {
        localStorage.setItem('sotoki.map.overlays', JSON.stringify([{ id: 'csmap', opacity: 0.7 }]));
        const p = loadMapPrefs();
        localStorage.removeItem('sotoki.map.overlays');
        return p.overlays.some(o => o.id === 'csmap');
      })(),
    };
  });
  ok(csmap.defined && csmap.pending, 'CS立体図は定義を残したまま保留（pending）', csmap);
  ok(!csmap.shown && !csmap.inPanel, '保留中はレイヤー一覧に出さない', csmap);
  ok(!csmap.restored, '保存済みに残っていても保留中のレイヤーは復元しない', csmap.restored);

  /* ★ふつうのオーバーレイでも、タイルが取れなければ理由をパネルに出すこと。
     時刻つきタイルにしか報告を付けていなかったため、CS立体図が失敗しても
     黙って空になり「表示されない」としか分からなかった（v4.63.0で共通化）。 */
  await page.route('**/xyz/relief/**', r => r.fulfill({ status: 404, body: '' }));
  await page.evaluate(() => {
    if (isOverlayOn('relief')) toggleOverlay('relief');   // 先の検査で入っている場合がある
    toggleOverlay('relief');
    leafletMap.setView([36.57, 137.65], 11);
  });
  await page.waitForTimeout(2200);
  const reliefFail = await page.evaluate(() => {
    const el = document.querySelector('.layer-status[data-id="relief"]');
    return el ? el.textContent : null;
  });
  ok(reliefFail && /タイルが無い/.test(reliefFail),
    '★取れないオーバーレイは理由を出す（黙って空にしない）', reliefFail);
  ok(reliefFail && /z\d+/.test(reliefFail), '失敗したズームを添える（切り分けに要る）', reliefFail);
  // 後続の永続化の検査が relief を見るので、入れた状態に戻しておく
  await page.unroute('**/xyz/relief/**');
  await page.evaluate(() => { if (!isOverlayOn('relief')) toggleOverlay('relief'); });
  await page.waitForTimeout(400);

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

  /* ★雷を「雷らしく」見せる（v4.61.0）。べた塗りだと何の色か分からないという指摘。
     マークはタイル画像を読んで塗ってある所にだけ置く。 */
  await page.evaluate(() => leafletMap.setView([36.57, 137.65], 8));
  await page.waitForTimeout(1800);
  const bolts = await page.evaluate(() => {
    const pins = [...document.querySelectorAll('.thunder-pin')];
    const th = overlayTileLayers.thunder, rd = overlayTileLayers.radar;
    // マークが塗ってある所（＝タイルの左上1/4）に乗っているか、画素を読んで確かめる
    const cv = document.createElement('canvas');
    const size = leafletMap.getSize();
    cv.width = size.x; cv.height = size.y;
    const ctx = cv.getContext('2d');
    const ts = th.getTileSize();
    for (const k of Object.keys(th._tiles)) {
      const t = th._tiles[k];
      if (!t || !t.loaded || !t.el || !t.el.naturalWidth) continue;
      const c = th._keyToTileCoords(k);
      const nw = leafletMap.latLngToContainerPoint(leafletMap.unproject(L.point(c.x * ts.x, c.y * ts.y), c.z));
      const se = leafletMap.latLngToContainerPoint(leafletMap.unproject(L.point((c.x + 1) * ts.x, (c.y + 1) * ts.y), c.z));
      ctx.drawImage(t.el, nw.x, nw.y, se.x - nw.x, se.y - nw.y);
    }
    let data = null;
    try { data = ctx.getImageData(0, 0, cv.width, cv.height).data; } catch (e) { /* 読めない */ }
    /* マークの近くに塗りがあるか。真上の1画素で見ると、2つの塗りにまたがるマスの
       重心が「塗りの谷間」に落ちて誤検出するので、マス半分ぶんの範囲で探す。
       画像を読まずに格子状に置いていれば、塗りの無い3/4側にも出るので落ちる。 */
    const R = Math.round(THUNDER_CELL_PX / 2);
    const onPaint = pins.map(p => {
      const r = p.getBoundingClientRect();
      const mr = leafletMap.getContainer().getBoundingClientRect();
      const cxp = Math.round(r.left + r.width / 2 - mr.left);
      const cyp = Math.round(r.top + r.height / 2 - mr.top);
      if (!data) return null;
      for (let y = Math.max(0, cyp - R); y < Math.min(cv.height, cyp + R); y += 3) {
        for (let x = Math.max(0, cxp - R); x < Math.min(cv.width, cxp + R); x += 3) {
          if (data[(y * cv.width + x) * 4 + 3] > 40) return true;
        }
      }
      return false;
    }).filter(v => v !== null);
    return {
      count: pins.length,
      onPaint: onPaint.filter(Boolean).length,
      checked: onPaint.length,
      readable: !!data,
      max: THUNDER_MAX_ICONS,
      thunderGlow: !!th && th.getContainer().classList.contains('wx-glow'),
      radarGlow: !!rd && rd.getContainer().classList.contains('wx-glow'),
      glowFilter: (() => { const e = document.querySelector('.wx-glow'); return e ? getComputedStyle(e).filter : null; })(),
    };
  });
  ok(bolts.readable, '雷タイルの画素が読める（CORSが通っている）', bolts.readable);
  ok(bolts.count > 0 && bolts.count <= bolts.max, '★雷マークが置かれる（上限内）', bolts);
  ok(bolts.checked > 0 && bolts.onPaint === bolts.checked,
    '★雷マークは塗ってある所にだけ置く（画像を読んで位置を決めている）', bolts);
  ok(bolts.count >= 4, '複数の雷域にマークが散る', bolts.count);
  ok(bolts.thunderGlow && !bolts.radarGlow,
    '★ぼかしは雷のレイヤーだけに掛ける（雨雲まで滲ませない）', bolts);
  ok(/blur/.test(bolts.glowFilter || ''), '境目をぼかしている', bolts.glowFilter);

  await page.evaluate(() => toggleOverlay('thunder'));
  await page.waitForTimeout(500);
  const boltsOff = await page.evaluate(() => document.querySelectorAll('.thunder-pin').length);
  ok(boltsOff === 0, '雷を消したら雷マークも消える', boltsOff);
  await page.waitForTimeout(200);

  /* 衛星の雲（ひまわり）。レーダーは降っている所しか映らないので、
     「曇っているが降っていない」を見るのはこちらの役目。 */
  await page.evaluate(() => toggleOverlay('satellite'));
  await page.waitForTimeout(900);
  const SAT_PENDING_DEFINED = await page.evaluate(() =>
    SAT_BANDS.some(b => b.id === 'REP' && b.pending));
  const sat = await page.evaluate(() => ({
    url: overlayTileLayers.satellite ? overlayTileLayers.satellite._url : null,
    pane: overlayTileLayers.satellite ? overlayTileLayers.satellite.options.pane : null,
    chips: [...document.querySelectorAll('.amedas-el')].map(b => b.textContent),
  }));
  ok(sat.url && /himawari\/data\/satimg/.test(sat.url), '衛星タイルはひまわりの配信を見る', sat.url);
  ok(sat.url && /20260131123000/.test(sat.url), '衛星も targetTimes の時刻でURLを組む', sat.url);
  ok(sat.url && /\/jp\/.*\/B13\/TBB\//.test(sat.url), '既定は赤外（B13/TBB）', sat.url);
  /* カラーは実機で配信が虫食いだったので保留（定義は残しつつ出さない）。
     保存済みに残っていても復元しないこと。 */
  ok(!sat.chips.includes('カラー'), '★保留中のカラーはチップに出さない', sat.chips);
  ok(SAT_PENDING_DEFINED, 'カラーの定義自体は残してある（原因が分かれば戻せる）');
  ok(sat.pane === 'mapSat', '衛星は合成用の別pane（雨雲まで一緒に薄まらないように）', sat.pane);
  ok(timesHits.some(u => u.includes('targetTimes_jp')), '衛星は日本域の targetTimes', timesHits);
  ok(sat.chips.includes('赤外') && sat.chips.includes('雲頂'), 'バンド切替のチップが出る', sat.chips);
  ok(satHits.length > 0, '衛星タイルを実際に取りに行っている', satHits.length);

  /* バンドを変えるとURLと**合成方法**が変わり、選択は保存される。
     ⚠合成はバンドごと。赤外は背景が暗いので screen が効くが、
     色つきの雲頂を screen にすると明るい地図の上で潰れる（カラーで実際に潰れた）。 */
  const satPane = () => getComputedStyle(leafletMap.getPane('mapSatMask'));
  const irBlend = await page.evaluate(() => ({
    blend: getComputedStyle(leafletMap.getPane('mapSatMask')).mixBlendMode,
    filter: getComputedStyle(leafletMap.getPane('mapSatMask')).filter,
  }));
  ok(irBlend.blend === 'screen' && /contrast/.test(irBlend.filter),
    '赤外は screen ＋ 黒レベルの切り捨て', irBlend);

  await page.evaluate(() => setSatBand('SND'));
  await page.waitForTimeout(900);
  const satBand = await page.evaluate(() => ({
    url: overlayTileLayers.satellite ? overlayTileLayers.satellite._url : null,
    saved: localStorage.getItem('sotoki.map.satBand'),
    blend: getComputedStyle(leafletMap.getPane('mapSatMask')).mixBlendMode,
    filter: getComputedStyle(leafletMap.getPane('mapSatMask')).filter,
  }));
  ok(satBand.url && /\/SND\/ETC\//.test(satBand.url), '雲頂に切り替わる（SND/ETC）', satBand.url);
  ok(satBand.saved === 'SND', '選んだバンドが保存される', satBand.saved);
  ok(satBand.blend === 'normal' && !/contrast/.test(satBand.filter),
    '★色つきのバンドでは合成を外す（前のバンドの設定を残さない）', satBand);

  // 保留中のバンドは指定しても選ばれない
  const repIgnored = await page.evaluate(() => {
    setSatBand('REP');
    return { saved: mapPrefs.satBand,
             url: overlayTileLayers.satellite ? overlayTileLayers.satellite._url : null };
  });
  ok(repIgnored.saved !== 'REP', '★保留中のバンドは指定しても選ばれない', repIgnored);

  await page.evaluate(() => setSatBand('B13'));
  await page.waitForTimeout(700);

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
      // 「現在地」は右上の丸ボタンに統合した（下部からは消えている）
      gpsBtn: !!document.getElementById('btn-locate'),
      oldGpsBtn: !!document.getElementById('btn-map-gps'),
      gpsH: document.getElementById('btn-locate').getBoundingClientRect().height,
      // 実際に押せるか（高さだけ見ても、上に何かが被っていたら押せない）
      gpsHit: (() => {
        const b = document.getElementById('btn-locate').getBoundingClientRect();
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !!t && document.getElementById('btn-locate').contains(t);
      })(),
      rotaryHit: (() => {
        const b = el.getBoundingClientRect();
        const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        return !!t && el.contains(t);
      })(),
      width: el.getBoundingClientRect().width,
    };
  });
  /* ================= 5d-1. 地図は全画面（v4.60.0） =================
     以前はヘッダー・検索行・円柱・案内文が画面の3割（201px）を占めていた。
     いまは全部を地図の上に浮かせている。 */
  const full = await page.evaluate(() => {
    const stage = document.getElementById('map-stage').getBoundingClientRect();
    const hit = (x, y) => { const e = document.elementFromPoint(x, y); return e ? (e.id || e.className || e.tagName) : null; };
    const inMap = (x, y) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#map'); };
    const fav = document.getElementById('map-fav-slot').getBoundingClientRect();
    const close = document.getElementById('btn-map-close').getBoundingClientRect();
    const search = document.getElementById('map-search-input').getBoundingClientRect();
    const inside = id => !!document.getElementById(id).closest('#map-overlay');
    return {
      screenH: window.innerHeight,
      stageH: Math.round(stage.height),
      /* 浮いた帯の「外側」は地図に触れる（器が pointer-events を食っていないこと）。
         地図上のマーカー（アメダスのピン等）に当たることもあるので、
         「#map の中かどうか」で見る。浮いた帯が食っていれば #map の外になる */
      centre: inMap(Math.round(stage.left + stage.width / 2), Math.round(stage.top + stage.height / 2)),
      besideFav: inMap(4, Math.round(fav.top + fav.height / 2)),
      underSearch: inMap(Math.round(stage.left + stage.width / 2), Math.round(search.bottom + 60)),
      // 当たった先の名前（落ちたときに何が食っているか分かるように）
      centreHit: hit(Math.round(stage.left + stage.width / 2), Math.round(stage.top + stage.height / 2)),
      besideFavHit: hit(4, Math.round(fav.top + fav.height / 2)),
      // 浮いているもの自体はちゃんと押せる
      closeHit: (() => { const t = document.elementFromPoint(close.left + close.width / 2, close.top + close.height / 2);
                         return !!t && document.getElementById('btn-map-close').contains(t); })(),
      searchHit: (() => { const t = document.elementFromPoint(search.left + search.width / 2, search.top + search.height / 2);
                          return !!t && document.getElementById('map-search-input').contains(t); })(),
      closeH: Math.round(close.height),
      // 出典表記は利用条件。浮かせても見えていること
      attrVisible: (() => { const a = document.getElementById('map-attribution').getBoundingClientRect();
                            return a.width > 0 && a.height > 0 && a.bottom <= window.innerHeight + 1; })(),
      // ★DOMの入れ子が壊れていないこと（他の画面が地図の中に入り込むと見えなくなる）
      rankOutside: !inside('rank-overlay'),
      favOverlayOutside: !inside('fav-overlay'),
      // 標準の +/- は出さない（左上は閉じるボタンの場所）
      zoomCtl: document.querySelectorAll('.leaflet-control-zoom').length,
    };
  });
  ok(full.stageH === full.screenH, '★地図が画面いっぱいを使う（上下の帯を無くした）', full);
  ok(full.centre && full.besideFav && full.underSearch,
    '★浮かせた帯の外側は地図に触れる（器がタップを食わない）', full);
  ok(full.closeHit && full.closeH >= 44, '閉じるボタンが押せる（44px以上）', full);
  ok(full.searchHit, '検索欄が押せる', full.searchHit);
  ok(full.attrVisible, '出典表記が見えている（利用条件）', full.attrVisible);
  ok(full.rankOutside && full.favOverlayOutside,
    '★他の画面が地図の入れ子に紛れ込んでいない', full);
  ok(full.zoomCtl === 0, 'Leaflet標準の+/-は出さない（左上は閉じるボタン）', full.zoomCtl);

  // 案内文は開いた直後だけ出て、しばらくすると消える（地図を隠し続けない）
  const hintNow = await page.evaluate(() => document.getElementById('map-hint').classList.contains('hidden'));
  await page.evaluate(() => { showMapHint(); });
  const hintShown = await page.evaluate(() => document.getElementById('map-hint').classList.contains('hidden'));
  await page.waitForTimeout(MAP_HINT_WAIT);
  const hintGone = await page.evaluate(() => document.getElementById('map-hint').classList.contains('hidden'));
  ok(!hintShown, '開いた直後は案内文が出る', { hintNow, hintShown });
  ok(hintGone, '★案内文はしばらくすると消える（全画面を地図に譲る）', hintGone);

  /* ================= 5d-2. safe-area（ノッチ／ホームインジケータ） =================
     ⚠v4.60.0 で viewport-fit=cover を入れたのに、ランキングとお気に入りの
     ヘッダーに逃げ幅を入れ忘れ、「ランキング」の文字が時計に重なり ✕ が押せなくなった。
     env() は headless では 0 なので、**変数を差し替えて全画面ぶんまとめて検査する**。 */
  const SA_TOP = 47, SA_BOT = 34;   // iPhoneのノッチ／ホームインジケータ相当
  const safeArea = await page.evaluate(async ([top, bot]) => {
    const root = document.documentElement;
    root.style.setProperty('--sa-top', top + 'px');
    root.style.setProperty('--sa-bottom', bot + 'px');
    await new Promise(r => setTimeout(r, 120));
    // 各画面の「いちばん上にある押せるもの」が、ノッチの下にあり実際に押せること
    closeMap(); closeRank(); closeFav();          // まず全部たたんで本体から見る
    await new Promise(r => setTimeout(r, 250));
    const screens = [
      { name: '本体', open: null, btn: 'btn-map' },
      { name: '地図', open: 'openMap', btn: 'btn-map-close', close: 'closeMap' },
      { name: 'ランキング', open: 'openRank', btn: 'btn-rank-close', close: 'closeRank' },
      { name: 'お気に入り', open: 'openFav', btn: 'btn-fav-close', close: 'closeFav' },
    ];
    const out = [];
    for (const sc of screens) {
      if (sc.open) { window[sc.open](); await new Promise(r => setTimeout(r, 350)); }
      const el = document.getElementById(sc.btn);
      const r = el.getBoundingClientRect();
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      out.push({
        name: sc.name,
        top: Math.round(r.top),
        clear: r.top >= top,                       // ノッチの下から始まっているか
        hit: !!t && el.contains(t),                // 本当に押せるか
      });
      if (sc.close) { window[sc.close](); await new Promise(r => setTimeout(r, 250)); }
    }
    root.style.removeProperty('--sa-top');
    root.style.removeProperty('--sa-bottom');
    openMap();                                   // 後続の検査のため地図に戻す
    await new Promise(r => setTimeout(r, 400));
    return out;
  }, [SA_TOP, SA_BOT]);
  await page.waitForTimeout(500);
  const sunk = safeArea.filter(x => !x.clear || !x.hit);
  ok(sunk.length === 0,
    '★どの画面も上端の操作がノッチに潜らず押せる（safe-area）', safeArea);
  // 変数を通していない書き方が混ざっていないか（env()直書きは検査をすり抜ける）
  const envDirect = await page.evaluate(() =>
    [...document.querySelectorAll('style')].map(s => s.textContent).join('')
      .match(/env\(safe-area-inset-[a-z]+\)(?!,)/g) || []);
  ok(envDirect.length === 0,
    'safe-area は --sa-top / --sa-bottom を通す（env()の直書きは検査をすり抜ける）', envDirect);

  ok(rotary.count === 1, 'お気に入り円柱の実体は1つだけ', rotary.count);
  ok(rotary.inMap, '地図を開くと円柱が地図画面へ移る', rotary);
  ok(rotary.gpsBtn && rotary.gpsH >= 44, '地図に「現在地」ボタンがある（44px以上）', rotary);
  ok(!rotary.oldGpsBtn, '下部の「現在地」ボタンは消えている（右上に統合）', rotary.oldGpsBtn);
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

  /* 現在地ボタンは押すたびに off → 現在地へ → 追跡 → off と回る（v4.58.0） */
  const locOff = await page.evaluate(() => ({
    mode: document.getElementById('btn-locate').dataset.mode,
    badge: getComputedStyle(document.getElementById('locate-badge')).display,
  }));
  ok(locOff.mode === 'off' && locOff.badge === 'none', '最初は何もしていない状態', locOff);

  await page.click('#btn-locate');
  await page.waitForTimeout(900);
  const locOnce = await page.evaluate(() => ({
    mode: document.getElementById('btn-locate').dataset.mode,
    watching: geoWatchId != null,
    follow: mapFollow,
    badge: getComputedStyle(document.getElementById('locate-badge')).display,
    dot: document.querySelectorAll('.me-dot').length,
    circle: !!meCircle,
    picked: document.getElementById('map-picked-name').textContent,
    // 現在地マーカーは「選択地点のピン」とは別物
    separateFromPin: !!meMarker && !!leafletMarker && meMarker !== leafletMarker,
  }));
  ok(locOnce.mode === 'once' && locOnce.watching, '1回目は現在地へ寄る', locOnce);
  ok(locOnce.follow === false, '1回目はまだ追跡しない（見に行くだけ）', locOnce.follow);
  ok(locOnce.badge === 'none', '追跡していないので隅の印は出ない', locOnce.badge);
  ok(locOnce.dot === 1 && locOnce.circle, '現在地マーカーと誤差の輪が出る', locOnce);
  ok(locOnce.separateFromPin, '現在地は選択地点のピンとは別のマーカー', locOnce.separateFromPin);
  ok(locOnce.picked && locOnce.picked !== '—',
    '★現在地ボタンで地点も選べる（下部の「現在地」ボタンの役目を引き継ぐ）', locOnce.picked);

  await page.click('#btn-locate');
  await page.waitForTimeout(700);
  const locFollow = await page.evaluate(() => ({
    mode: document.getElementById('btn-locate').dataset.mode,
    follow: mapFollow,
    badge: getComputedStyle(document.getElementById('locate-badge')).display,
    pressed: document.getElementById('btn-locate').getAttribute('aria-pressed'),
  }));
  ok(locFollow.mode === 'follow' && locFollow.follow === true, '★2回目で追跡モードになる', locFollow);
  ok(locFollow.badge !== 'none', '★追跡中はボタンの隅に印が出る', locFollow.badge);
  ok(locFollow.pressed === 'true', '押されている状態として読み上げる', locFollow.pressed);

  await page.click('#btn-locate');
  await page.waitForTimeout(400);
  const locBack = await page.evaluate(() => ({
    mode: document.getElementById('btn-locate').dataset.mode,
    watching: geoWatchId != null,
    dot: document.querySelectorAll('.me-dot').length,
  }));
  ok(locBack.mode === 'off' && !locBack.watching && locBack.dot === 0,
    '3回目で解除される（マーカーも消える）', locBack);

  // 以降のヘディングアップの検査のため、追跡に戻しておく
  await page.click('#btn-locate');
  await page.waitForTimeout(700);
  await page.click('#btn-locate');
  await page.waitForTimeout(700);
  const tracking = await page.evaluate(() => ({ watching: geoWatchId != null, follow: mapFollow }));
  ok(tracking.watching && tracking.follow, '追跡が始まる', tracking);

  /* ★追跡中に地点を選んだら追従をやめること。
     やめないと、選んだ地点へ飛んだ数秒後に**次のGPS更新で現在地へ引き戻される**
     （円柱で地域を選ぶと一度飛んでから戻る、という報告の正体）。
     現在地の点は残したいので、追跡ごと切らず 'once' に落とす。 */
  const followPick = await page.evaluate(async () => {
    const far = [35.36, 138.73];                 // 現在地(36.57,137.65)から十分離れた所
    selectFav(far[0], far[1], '遠くの山');
    await new Promise(r => setTimeout(r, 1200));
    const afterPick = leafletMap.getCenter();
    // 次のGPS更新が来た体で、引き戻されないことを見る
    onGeoUpdate({ coords: { latitude: 36.57, longitude: 137.65, accuracy: 20 } });
    await new Promise(r => setTimeout(r, 900));
    const afterGeo = leafletMap.getCenter();
    return {
      mode: document.getElementById('btn-locate').dataset.mode,
      follow: mapFollow, watching: geoWatchId != null,
      dot: document.querySelectorAll('.me-dot').length,
      movedToPick: Math.abs(afterPick.lat - far[0]) < 0.05,
      pulledBack: Math.abs(afterGeo.lat - 36.57) < 0.05,
      drift: Math.abs(afterGeo.lat - afterPick.lat),
    };
  });
  ok(followPick.movedToPick, '選んだ地点へ寄る', followPick);
  ok(followPick.follow === false && followPick.mode === 'once',
    '★地点を選んだら追従はやめる（現在地の表示は残す）', followPick);
  ok(followPick.watching && followPick.dot === 1, '追跡そのものは切らない（点は出たまま）', followPick);
  ok(!followPick.pulledBack && followPick.drift < 0.02,
    '★次のGPS更新が来ても現在地へ引き戻されない', followPick);

  // 拡大縮小の基準点も、追従していないなら現在地に引っぱられない
  const zoomAnchorAway = await page.evaluate(() => {
    const c = leafletMap.getCenter();
    const a = zoomAnchor(leafletMap);
    return { anchorLat: a.lat, centerLat: c.lat, myLat: myPos ? myPos.lat : null };
  });
  ok(Math.abs(zoomAnchorAway.anchorLat - zoomAnchorAway.centerLat) < 0.02,
    '★追従していないなら拡大の基準点も現在地に引っぱられない', zoomAnchorAway);

  // 以降のヘディングアップの検査のため、追跡に戻す
  await page.evaluate(() => setLocateMode('follow'));
  await page.waitForTimeout(700);

  // ノースアップのときの方位環の色（ヘディングアップと見分けが付くかの比較用）
  const northRim = await page.evaluate(() => {
    const r = document.querySelector('.orient-rim');
    return getComputedStyle(r).stroke;
  });
  const northRing = await page.evaluate(() =>
    document.getElementById('orient-ring').getAttribute('transform'));
  ok(/rotate\(0/.test(northRing || ''), 'ノースアップではNは真上（環は回らない）', northRing);

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
      // 方位バッジ：環は北へ向いて回り、Nの文字だけは立てておく
      ring: document.getElementById('orient-ring').getAttribute('transform'),
      nLabel: document.getElementById('orient-n-label').getAttribute('transform'),
      rimColor: getComputedStyle(document.querySelector('.orient-rim')).stroke,
      // スマホの絵は回らない（＝手に持っている端末の向き）
      phoneRotated: !!document.querySelector('.orient-phone').getAttribute('transform'),
      pressed: document.getElementById('btn-orient').getAttribute('aria-pressed'),
    };
  });
  ok(heading.headingUp, 'ヘディングアップに切り替わる', heading);
  ok(heading.rotation === -90, '東を向いたら地図は-90度回る（進行方向が上）', heading.rotation);
  ok(/rotate\(-90deg\)/.test(heading.mapTransform), '地図にrotateが掛かる', heading.mapTransform);
  ok(heading.counterRot === '90deg', '自前ラベルは逆回転で立てる', heading.counterRot);
  ok(heading.dragging === false, '★回転中は手動パンを止める（座標がねじれるため）', heading.dragging);
  /* ★方位バッジ（スーパー地形のような見た目）。ヘディングアップだと
     Nが真横を向くので、ノースアップとの違いが一目で分かる */
  ok(/rotate\(-90/.test(heading.ring || ''), '★方位環が北の方へ回る（東を向けば-90度）', heading.ring);
  ok(/rotate\(90/.test(heading.nLabel || ''), 'Nの文字だけは逆回転で立てる（読めるように）', heading.nLabel);
  ok(!heading.phoneRotated, '★スマホの絵は回さない（端末の向きを表すため）', heading.phoneRotated);
  ok(heading.pressed === 'true', 'ヘディングアップ中だと分かる状態にする', heading.pressed);
  ok(heading.rimColor !== northRim, '★ヘディングアップでは方位環の色が変わる', { heading: heading.rimColor, north: northRim });
  ok(heading.rotating, '地図の実体を広げるクラスが付く');

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
    ring: document.getElementById('orient-ring').getAttribute('transform'),
    rimColor: getComputedStyle(document.querySelector('.orient-rim')).stroke,
    pressed: document.getElementById('btn-orient').getAttribute('aria-pressed'),
  }));
  ok(!northUp.headingUp && northUp.rotation === 0, 'ノースアップに戻る', northUp);
  ok(northUp.dragging === true, '戻したら手動パンが復活する', northUp.dragging);
  ok(/rotate\(0/.test(northUp.ring || ''), '戻したらNも真上へ戻る', northUp.ring);
  ok(northUp.rimColor === northRim && northUp.pressed === 'false',
    '戻したら方位環の色も元に戻る', northUp);

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
  /* 遠く（穴の外＝中心から200px下）と、穴の中だがマーカーには掛からない場所。
     穴はマーカーのすぐ外側だけなので（v4.59.0で縮小）、近い方は中心の20px左を見る。
     方位の扇は右を向いている（先の検査で東を向けたまま）ので左が安全。 */
  const farClip = { x: cx - 12, y: cy + 190, width: 24, height: 24 };
  const nearClip = { x: cx - 23, y: cy - 3, width: 6, height: 6 };
  // 標本の場所に他の要素が乗っていないことを先に確かめる（乗っていると比較が無意味になる）
  const onTop = await page.evaluate(pts => pts.map(([x, y]) => {
    const e = document.elementFromPoint(x, y);
    return e ? (e.id || e.className || e.tagName) : null;
  }), [[cx, cy + 202], [cx - 20, cy]]);
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

  /* ★自動更新でレイヤーが積み上がらないこと。
     「新しいタイルが1枚出たら古いのを外す」だけだと、新しい方が読み込まれも
     失敗もしない状況で古い方が地図に残り続け、5分ごとに積み上がる。
     iOSはメモリ上限が厳しく、放置するとページごと落ちる（実機で踏んだ）。
     ここではタイルを永久に返さない状態にして、それでも外れることを見る。 */
  // ⚠タイル画像だけ止めること。jmatile 全体を止めると targetTimes まで止まり、
  //   レイヤーが1枚も作られず検査が空振りする（実際に空振りした）。
  await page.route('**/surf/hrpns/**', route => new Promise(() => {}));   // 応答しない
  await page.evaluate(() => { refreshWeatherLayers(); refreshWeatherLayers(); });
  await page.waitForTimeout(1200);
  const piled = await page.evaluate(() => {
    let n = 0; leafletMap.eachLayer(l => { if (l._url && /jmatile/.test(l._url)) n++; });
    return { layers: n, stale: staleWxLayers.size, dropMs: WX_DROP_MS };
  });
  await page.waitForTimeout(piled.dropMs + 800);
  const afterDrop = await page.evaluate(() => {
    let n = 0; leafletMap.eachLayer(l => { if (l._url && /jmatile/.test(l._url)) n++; });
    return { layers: n, stale: staleWxLayers.size };
  });
  ok(afterDrop.layers <= 2 && afterDrop.stale === 0,
    '★タイルが返ってこなくても古いレイヤーは必ず外れる（積み上がらない）',
    { 貼り替え直後: piled, 待ったあと: afterDrop });
  await page.unroute('**/surf/hrpns/**');
  // 応答しなかったリクエストが残るので、積み直して綺麗な状態に戻す
  await page.evaluate(() => applyOverlays());
  await page.waitForTimeout(1500);

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

  /* ================= 検索結果とレイヤーパネルの重なり =================
     ★検索したままパネルを開くと、結果の札が浮いて残り**パネルの✕まで覆って
     閉じられなくなる**（実機で踏んだ）。地図の✕はパネルを開くと引っ込む決まりなので、
     パネルの✕が押せなくなると**戻る手段がひとつも無くなる**。 */
  const pageS = await newPage();
  await pageS.click('#btn-map');
  await pageS.waitForTimeout(700);
  await pageS.fill('#map-search-input', '東町');
  await pageS.click('#map-search-btn');
  await pageS.waitForTimeout(900);
  const searched = await pageS.evaluate(() => {
    const r = document.getElementById('map-results');
    return { n: r.querySelectorAll('.map-result-item').length,
             shown: getComputedStyle(r).display !== 'none' };
  });
  ok(searched.n > 0 && searched.shown, '検索結果が出る（以降の検査の前提）', searched);

  await pageS.click('#btn-layers');
  await pageS.waitForTimeout(600);
  const trapped = await pageS.evaluate(() => {
    const btn = document.getElementById('btn-layer-close');
    const b = btn.getBoundingClientRect();
    const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    const res = document.getElementById('map-results');
    return {
      panelOpen: document.getElementById('layer-panel').classList.contains('open'),
      // パネルの✕を押したとき、本当にその✕に当たるか
      hitsClose: !!hit && (hit === btn || btn.contains(hit)),
      hitId: hit ? (hit.id || hit.className || hit.tagName) : null,
      resultsCleared: res.querySelectorAll('.map-result-item').length === 0,
      resultsHidden: getComputedStyle(res).opacity === '0' ||
                     getComputedStyle(res).display === 'none',
      // 地図側の✕は引っ込んでいる（だからパネルの✕が唯一の出口）
      mapCloseHidden: getComputedStyle(document.getElementById('map-top')).opacity === '0',
    };
  });
  ok(trapped.panelOpen, 'レイヤーパネルが開く', trapped);
  ok(trapped.mapCloseHidden, 'パネルを開くと地図の✕は引っ込む（前提）', trapped);
  ok(trapped.resultsCleared && trapped.resultsHidden,
    '★パネルを開いたら検索結果は畳む', trapped);
  ok(trapped.hitsClose, '★パネルの✕が本当に押せる（閉じられなくならない）', trapped);
  /* 実際に閉じられることまで見る。
     ⚠**押せないと分かっているときはclickしないこと。** 覆われたままclickすると
     Playwrightが30秒待ってタイムアウトし、原因の見えない落ち方になる。 */
  if (trapped.hitsClose) {
    await pageS.click('#btn-layer-close');
    await pageS.waitForTimeout(500);
    const escaped = await pageS.evaluate(() => ({
      panelOpen: document.getElementById('layer-panel').classList.contains('open'),
      mapCloseBack: getComputedStyle(document.getElementById('map-top')).opacity !== '0',
    }));
    ok(!escaped.panelOpen && escaped.mapCloseBack, '★閉じれば地図の✕も戻る', escaped);
  }
  await pageS.close();

  /* ================= 虫食い配信を黙って通さない =================
     ★以前の失敗報告は「1枚でも読めたら以降のエラーを全部無視」だった。
     そのせいで、ひまわりのカラーが大半404で帯状にしか出ていないのに
     画面には何も出ず、利用者からは「雲が写らない」としか見えなかった。
     「全部ダメ」だけでなく「ほとんどダメ」も言えることを見る。 */
  satTileMode = 'patchy';
  const pageP = await newPage({ 'sotoki.map.overlays': JSON.stringify([{ id: 'satellite', opacity: 1 }]) });
  await pageP.click('#btn-map');
  await pageP.waitForTimeout(1200);
  /* 引いて表示する。近づいたままだと衛星タイルは2枚しか要らず、
     枚数が判定の下限（WX_FAIL_MIN_TILES）に届かないので検査が空振りする */
  await pageP.evaluate(() => leafletMap.setZoom(5));
  await pageP.waitForTimeout(1500);
  await pageP.click('#btn-layers');
  await pageP.waitForTimeout(3000);            // WX_FAIL_SETTLE_MS より長く待つ
  const patchy = await pageP.evaluate(() => {
    const row = [...document.querySelectorAll('.layer-ov')]
      .find(r => /衛星/.test(r.textContent));
    const l = overlayTileLayers.satellite;
    return { text: row ? row.textContent.replace(/\s+/g, ' ') : null,
             status: layerStatus.satellite,
             tiles: l ? Object.keys(l._tiles).length : 0 };
  });
  ok(patchy.tiles >= 4, '検査に足るだけタイルを要求している（空振り防止）', patchy.tiles);
  ok(patchy.status && /一部しか取得できません/.test(patchy.status),
    '★大半が404なら「一部しか取得できません」と出す', patchy);
  ok(patchy.status && /%/.test(patchy.status), '取得できなかった割合を添える', patchy.status);
  await pageP.close();
  satTileMode = 'dark';

  /* 全部届いているときは何も言わないこと（言うと狼少年になる） */
  const pageQ = await newPage({ 'sotoki.map.overlays': JSON.stringify([{ id: 'satellite', opacity: 1 }]) });
  await pageQ.click('#btn-map');
  await pageQ.waitForTimeout(1200);
  await pageQ.evaluate(() => leafletMap.setZoom(5));
  await pageQ.waitForTimeout(1500);
  await pageQ.click('#btn-layers');
  await pageQ.waitForTimeout(3000);
  const healthy = await pageQ.evaluate(() => layerStatus.satellite || '');
  ok(!healthy, '全部届いているときは何も出さない', healthy);
  await pageQ.close();

  /* ================= 衛星の雲の合成（暗い所を透かす） =================
     ★ひまわりのタイルはJPEGで**透明部分が無い**。そのまま濃くすると雲の無い所まで
     塗り潰れて地図が消える（実機で「全面真っ黒」を踏んだ）。
     真っ黒なタイルを返したうえで、濃度100%でも下の地図が残ることを画素で確かめる。
     他のレイヤーが混ざると比較が無意味になるので、専用のページで衛星だけを載せる。 */
  const page5 = await newPage({ 'sotoki.map.overlays': JSON.stringify([{ id: 'satellite', opacity: 1 }]) });
  await page5.click('#btn-map');
  await page5.waitForTimeout(2000);
  const blend = await page5.evaluate(() => ({
    on: isOverlayOn('satellite'),
    pane: overlayTileLayers.satellite ? overlayTileLayers.satellite.options.pane : null,
    host: getComputedStyle(leafletMap.getPane('mapSatMask')).mixBlendMode,
    tiles: getComputedStyle(leafletMap.getPane('mapSat')).mixBlendMode,
    nowcast: getComputedStyle(leafletMap.getPane('mapNowcastMask')).mixBlendMode,
    satZ: +getComputedStyle(leafletMap.getPane('mapSatMask')).zIndex,
    nowZ: +getComputedStyle(leafletMap.getPane('mapNowcastMask')).zIndex,
  }));
  ok(blend.on && blend.pane === 'mapSat', '衛星は合成用の別pane（雨雲まで一緒に薄まらないように）', blend);
  ok(blend.host === 'screen', '★暗い所が透ける合成をpaneに掛けている', blend);
  /* 合成は**外側（z-indexを持つ箱）**に掛けること。内側に掛けても
     いちばん近いスタッキングコンテキストの中でしか混ざらず、黒いままになる */
  ok(blend.tiles === 'normal', '合成は内側のpaneには掛けない（下と混ざらないため）', blend);
  ok(blend.nowcast === 'normal', '雨雲・雷は合成しない（透明部分のあるPNGなので不要）', blend);
  ok(blend.satZ < blend.nowZ, '衛星は雨雲より下に敷く', blend);

  const satBox = await page5.evaluate(() => {
    const r = document.getElementById('map').getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
  /* 標本は**縦に長い帯**にする。8px角だとタイルの継ぎ目をまたがないので、
     「継ぎ目に線が出る」不具合を素通ししてしまう（実機で線が見えた）。
     ピンや浮いた帯に掛からない左寄りの列を、縦にまるごと見る。 */
  const satClip = { x: Math.round(satBox.x + satBox.w * 0.2), y: Math.round(satBox.y + 120),
                    width: 4, height: Math.round(satBox.h - 300) };
  const onTopSat = await page5.evaluate(c => {
    const out = [];
    for (let y = c.y; y < c.y + c.height; y += 40) {
      const e = document.elementFromPoint(c.x + 2, y);
      out.push(e ? (e.id || e.className || e.tagName) : null);
    }
    return out;
  }, satClip);
  ok(onTopSat.every(t => t === 'map'), '画素を見る帯に他の要素が乗っていない', onTopSat);

  const satOn = await page5.screenshot({ clip: satClip });
  // 合成を外すと同じ場所が変わる（＝この帯は本当に衛星に覆われている）
  await page5.evaluate(() => { leafletMap.getPane('mapSatMask').style.mixBlendMode = 'normal'; });
  await page5.waitForTimeout(400);
  const satFlat = await page5.screenshot({ clip: satClip });
  await page5.evaluate(() => { leafletMap.getPane('mapSatMask').style.mixBlendMode = 'screen'; });
  await page5.waitForTimeout(400);
  // 黒レベルの切り捨てを外すと、タイルごとの暗部の差が線になって出る
  await page5.evaluate(() => { leafletMap.getPane('mapSatMask').style.filter = 'none'; });
  await page5.waitForTimeout(400);
  const satNoFloor = await page5.screenshot({ clip: satClip });
  await page5.evaluate(() => { leafletMap.getPane('mapSatMask').style.filter = ''; });
  await page5.waitForTimeout(400);
  await page5.evaluate(() => { if (isOverlayOn('satellite')) toggleOverlay('satellite'); });
  await page5.waitForTimeout(800);
  const satOff = await page5.screenshot({ clip: satClip });
  ok(!satFlat.equals(satOff), '標本の帯は本当に衛星に覆われている（合成なしなら塗り潰れる）');
  ok(!satNoFloor.equals(satOff), '黒レベルを切り捨てないとタイルごとの暗部の差が出る（検査の前提）');
  ok(satOn.equals(satOff), '★暗部を切り捨てるのでタイルの継ぎ目に線が出ない・地図がそのまま見える');
  await page5.close();

  /* 暗部を切り捨てても**雲そのものは消えない**こと。
     切り捨てが強すぎると「線は消えたが雲も出ない」になり、レイヤーの意味が無くなる。 */
  satTileMode = 'cloud';
  const page6 = await newPage({ 'sotoki.map.overlays': JSON.stringify([{ id: 'satellite', opacity: 1 }]) });
  await page6.click('#btn-map');
  await page6.waitForTimeout(2000);
  const cloudOn = await page6.screenshot({ clip: satClip });
  await page6.evaluate(() => { if (isOverlayOn('satellite')) toggleOverlay('satellite'); });
  await page6.waitForTimeout(800);
  const cloudOff = await page6.screenshot({ clip: satClip });
  ok(!cloudOn.equals(cloudOff), '★薄い雲も消さない（切り捨てが強すぎない）');
  await page6.close();
  satTileMode = 'dark';

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
