// 雨の予告の検証
//   ・毎時データからの見込み（「明日夕方15時から雨」「〜ごろ雨が止む見込み」）
//   ・雨と雪の言い分け、0.1mm/hのしきい値
//   ・ナウキャストの地点1画素読み（タイル番号と画素位置がLeafletの投影と一致すること）
//   ・分きざみ（「あと〇〇分で雨が止みます」）が毎時の見込みを上書きすること
//   ・タイルが読めない環境では黙って毎時の見込みに戻ること
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

/* --- PNG組み立て（ナウキャストのタイルの代わり） --- */
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
const TILE_PNG = rgbaPng(8, 8, () => [200, 200, 200, 255]);
/* 雨のタイルは**32×32の一角だけ**塗る（面積の1.5%）。
   全面を塗ると「どの画素を読んでいるか」が検証できず、座標換算を間違えた実装でも
   通ってしまう（雷マークの検査で実際にすり抜けた）。
   検査地点がこの中に落ちることは、Leafletの投影から出した値で別途裏取りする。 */
const RAIN_BOX = { x0: 128, x1: 160, y0: 16, y1: 48 };
const OFF_BOX = { x0: 32, x1: 64, y0: 160, y1: 192 };      // 地点から外れた所
const inBox = (b, x, y) => x >= b.x0 && x < b.x1 && y >= b.y0 && y < b.y1;
const RAIN_PNG = rgbaPng(256, 256, (x, y) => inBox(RAIN_BOX, x, y) ? [0, 80, 255, 220] : [0, 0, 0, 0]);
const DRY_PNG = rgbaPng(256, 256, () => [0, 0, 0, 0]);
const OFFSET_PNG = rgbaPng(256, 256, (x, y) => inBox(OFF_BOX, x, y) ? [0, 80, 255, 220] : [0, 0, 0, 0]);

const LAT = 36.57, LON = 137.65;

// ナウキャストの時刻表：実況＋5分きざみで60分先まで
function nowcastTimes() {
  const base = new Date(Math.floor(Date.now() / 300e3) * 300e3);
  const stamp = d => `${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}T` +
    `${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}${p2(d.getUTCSeconds())}Z`;
  const b = stamp(base);
  const out = [{ basetime: b, validtime: b, elements: ['hrpns'] }];
  for (let i = 1; i <= 12; i++) {
    out.push({ basetime: b, validtime: stamp(new Date(base.getTime() + i * 300e3)), elements: ['hrpns'] });
  }
  return { base, list: out };
}
// URLの validtime が実況から何分後か
function stepOf(url, base) {
  const m = /\/(\d{8}T\d{6}Z)\/surf\//.exec(url);
  if (!m) return null;
  const s = m[1];
  const d = new Date(Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8),
    +s.slice(9, 11), +s.slice(11, 13), +s.slice(13, 15)));
  return Math.round((d.getTime() - base.getTime()) / 60000);
}

/* 毎時データ。雨の降り方は rainAt(i) で作り分ける（iは先頭からの経過時間） */
function fakeWeather(rainAt) {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.temperature_2m.push(-5); h.apparent_temperature.push(-9);
    const r = rainAt ? rainAt(d) : 0;
    h.precipitation.push(r); h.snowfall.push(0);
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

  /* opts:
       wetFrom  … 実況から何分後に雨のタイルへ変わるか（nullなら全部からっぽ）
       dryFrom  … 実況は雨、この分数から止む
       cors     … falseにするとCORSヘッダを付けない（読めない環境の再現）
       offset   … trueで「地点から外れた所だけ塗った」タイルを返す
       rainAt   … 毎時データの降り方 */
  async function newPage(opts) {
    const o = opts || {};
    const { base, list } = nowcastTimes();
    const nowcastHits = [];
    const page = await browser.newPage({
      viewport: { width: 390, height: 800 },
      permissions: ['geolocation'],
      geolocation: { latitude: LAT, longitude: LON, accuracy: 25 },
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
      if (url.includes('targetTimes_N1')) {
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(list) });
      }
      if (url.includes('targetTimes_')) {
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify([]) });
      }
      if (url.includes('/surf/hrpns/')) {
        nowcastHits.push(url);
        const step = stepOf(url, base);
        let body = DRY_PNG;
        if (o.offset) body = OFFSET_PNG;
        else if (o.wetFrom != null) body = (step >= o.wetFrom) ? RAIN_PNG : DRY_PNG;
        else if (o.dryFrom != null) body = (step >= o.dryFrom) ? DRY_PNG : RAIN_PNG;
        const headers = (o.cors === false) ? {} : { 'access-control-allow-origin': '*' };
        return route.fulfill({ contentType: 'image/png', body, headers });
      }
      if (url.includes('jma.go.jp') || url.includes('cyberjapandata.gsi.go.jp') ||
          url.includes('tile.openstreetmap.org') || url.includes('server.arcgisonline.com')) {
        return route.fulfill({ contentType: 'image/png', body: TILE_PNG,
          headers: { 'access-control-allow-origin': '*' } });
      }
      if (url.includes('api.open-meteo.com')) {
        if (url.includes('wind_speed_10m') && url.includes('latitude=') &&
            new URL(url).searchParams.get('latitude').includes(',')) {
          const n = new URL(url).searchParams.get('latitude').split(',').length;
          return route.fulfill({ contentType: 'application/json',
            body: JSON.stringify(Array.from({ length: n }, () => fakeWeather())) });
        }
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(o.rainAt)) });
      }
      return route.abort();
    });
    await page.addInitScript(ll => {
      localStorage.setItem('sotoki_last', JSON.stringify({ lat: ll[0], lon: ll[1], name: '立山・黒部' }));
    }, [LAT, LON]);
    await page.goto('https://sotoki.test/');
    await page.waitForTimeout(1200);
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
    page.nowcastHits = nowcastHits;
    return page;
  }

  /* ================= 1. 毎時データからの見込み（純関数） ================= */
  const page = await newPage({ wetFrom: null });
  const pure = await page.evaluate(() => {
    // 2026-01-31 09:00 から1時間刻み。降り方だけ差し替えて言い回しを見る
    const mk = fn => Array.from({ length: 80 }, (_, i) => {
      const t = new Date(2026, 0, 31, 9 + i, 0, 0);
      const v = fn(i) || {};
      return { time: t, precip: v.p || 0, snow: v.s || 0 };
    });
    const starts = rainOutlookHourly(mk(i => (i >= 30 ? { p: 2 } : null)), 0);
    const stops  = rainOutlookHourly(mk(i => (i < 5 ? { p: 1 } : null)), 0);
    const snow   = rainOutlookHourly(mk(i => (i < 3 ? { p: 1, s: 2 } : null)), 0);
    const none   = rainOutlookHourly(mk(() => null), 0);
    const keeps  = rainOutlookHourly(mk(() => ({ p: 1 })), 0);
    // 0.05mm/hは「降っている」に数えない。0.1mm/hから数える
    const thresh = rainOutlookHourly(mk(i => (i === 10 ? { p: 0.05 } : i >= 20 ? { p: 0.1 } : null)), 0);
    // 途中の時刻を起点にしても、そこから先の最初の変わり目を見る
    const midway = rainOutlookHourly(mk(i => (i >= 30 ? { p: 2 } : null)), 10);
    return { starts, stops, snow, none, keeps, thresh, midway };
  });
  ok(pure.starts.kind === 'starts' && pure.starts.text === '明日夕方15時から雨',
    '降り出しは「明日夕方15時から雨」', pure.starts);
  ok(pure.starts.idx === 30, '降り出しのindexは最初に降る時刻', pure.starts.idx);
  ok(pure.stops.kind === 'stops' && pure.stops.text === '今日昼過ぎ14時ごろ雨が止む見込み',
    '降り止みは時間帯つきで言う', pure.stops);
  ok(pure.snow.text === '今日昼過ぎ12時ごろ雪が止む見込み' && pure.snow.isSnow === true,
    '雪は「雪」と言い分ける', pure.snow);
  ok(pure.none.kind === 'none' && /予想なし/.test(pure.none.text),
    '降らないときは予想なしと言う', pure.none);
  ok(pure.keeps.kind === 'none' && /続く見込み/.test(pure.keeps.text),
    '降り続くときは続くと言う', pure.keeps);
  ok(pure.thresh.idx === 20, '0.1mm/h未満は降っていない扱い', pure.thresh);
  ok(pure.midway.idx === 30, '起点をずらしても最初の変わり目を返す', pure.midway);

  /* ================= 2. タイル番号と画素位置がLeafletの投影と一致する ================= */
  const proj = await page.evaluate(([lat, lon]) => {
    const z = NOWC_TILE_Z;
    const p = L.CRS.EPSG3857.latLngToPoint(L.latLng(lat, lon), z);   // Leafletの世界画素座標
    const mine = tilePixelAt(lat, lon, z);
    return {
      mine,
      want: { x: Math.floor(p.x / 256), y: Math.floor(p.y / 256),
              px: Math.floor(p.x % 256), py: Math.floor(p.y % 256) },
    };
  }, [LAT, LON]);
  ok(proj.mine.x === proj.want.x && proj.mine.y === proj.want.y,
    'タイル番号がLeafletの投影と一致', proj);
  ok(Math.abs(proj.mine.px - proj.want.px) <= 1 && Math.abs(proj.mine.py - proj.want.py) <= 1,
    'タイル内の画素位置がLeafletの投影と一致', proj);
  /* 検査地点が RAIN_BOX の中に落ちること（以降の検査の前提）。
     判定にはLeafletの投影から出した want を使う。mineで判定すると
     「実装が自分で出した座標で自分を検査する」ことになり意味が無くなる */
  ok(inBox(RAIN_BOX, proj.want.px, proj.want.py),
    '検査地点は雨タイルの塗りの中にある（以降の検査の前提）', proj.want);
  ok(!inBox(OFF_BOX, proj.want.px, proj.want.py),
    '検査地点は外れタイルの塗りの外にある（以降の検査の前提）', proj.want);
  await page.close();

  /* ================= 3. 地図を開くと毎時の見込みが出る ================= */
  //   36時間ずっと降らない → 「予想なし」ではなく、途中から降り出す形にする
  const startAt = new Date(Date.now() + 30 * 3600e3);
  const p2page = await newPage({ wetFrom: null, cors: false,
    rainAt: d => (d.getTime() >= startAt.getTime() ? 2 : 0) });
  await p2page.click('#btn-map');
  await p2page.waitForTimeout(1500);
  const hourly = await p2page.evaluate(() => {
    const el = document.getElementById('map-rain');
    return { text: el.textContent, hidden: el.classList.contains('hidden'),
             nowcast: el.classList.contains('nowcast'),
             visible: getComputedStyle(el).display !== 'none' };
  });
  ok(!hourly.hidden && hourly.visible, '地図を開くと雨の予告が出る', hourly);
  ok(/^(今日|明日|明後日|\d+\/\d+)(未明|明け方|朝|昼前|昼過ぎ|夕方|夜のはじめ頃|夜遅く)\d+時から雨$/.test(hourly.text),
    '毎時の見込みは「◯◯夕方15時から雨」の形', hourly.text);
  // CORSが通らない環境ではナウキャストに上書きさせない（黙って毎時のまま）
  ok(!hourly.nowcast, 'タイルが読めないときは毎時の見込みのまま', hourly);
  ok(errors.length === 0, 'タイルが読めなくてもページエラーにしない', errors);
  await p2page.close();

  /* ================= 4. 分きざみ（降り出し）が毎時の見込みを上書きする ================= */
  const p3 = await newPage({ wetFrom: 30, rainAt: d => (d.getTime() >= startAt.getTime() ? 2 : 0) });
  await p3.click('#btn-map');
  await p3.waitForTimeout(2500);
  const soon = await p3.evaluate(() => {
    const el = document.getElementById('map-rain');
    return { text: el.textContent, nowcast: el.classList.contains('nowcast') };
  });
  const mSoon = /^あと(\d+)分で雨が降り出します$/.exec(soon.text);
  ok(!!mSoon, '分きざみの降り出しを出す', soon);
  ok(mSoon && [25, 30].includes(+mSoon[1]), '30分後に変わるタイルなら「あと25〜30分」', soon.text);
  ok(soon.nowcast, 'ナウキャスト由来は見た目で区別できる', soon);
  // 実況＋12ステップ（60分先）までしか読まない
  ok(p3.nowcastHits.length <= 13, 'タイルの取得は実況＋60分先まで', p3.nowcastHits.length);
  await p3.close();

  /* ================= 5. 分きざみ（降り止み） ================= */
  const p4 = await newPage({ dryFrom: 20, rainAt: () => 2 });
  await p4.click('#btn-map');
  await p4.waitForTimeout(2500);
  const stop = await p4.evaluate(() => document.getElementById('map-rain').textContent);
  const mStop = /^あと(\d+)分で雨が止みます$/.exec(stop);
  ok(!!mStop, '分きざみの降り止みを出す（利用者の要望そのもの）', stop);
  ok(mStop && [15, 20].includes(+mStop[1]), '20分後に止むタイルなら「あと15〜20分」', stop);
  await p4.close();

  /* ================= 6. 地点から外れた塗りは拾わない ================= */
  //   タイルは届いていて塗りもあるが、地点の画素は空。毎時の見込みのままになること
  const p5 = await newPage({ offset: true, rainAt: d => (d.getTime() >= startAt.getTime() ? 2 : 0) });
  await p5.click('#btn-map');
  await p5.waitForTimeout(2500);
  const off = await p5.evaluate(() => {
    const el = document.getElementById('map-rain');
    return { text: el.textContent, nowcast: el.classList.contains('nowcast') };
  });
  ok(!off.nowcast && !/あと\d+分/.test(off.text),
    '地点以外の塗りでは分きざみを出さない', off);
  await p5.close();

  /* ================= 7. 地図を閉じている間は取りに行かない ================= */
  const p6 = await newPage({ wetFrom: 30 });
  const closedHits = p6.nowcastHits.length;
  const closedText = await p6.evaluate(() => document.getElementById('map-rain').textContent);
  ok(closedHits === 0, '地図を閉じている間はナウキャストを取りに行かない', closedHits);
  ok(closedText === '', '地図を閉じている間は文言を持たない', closedText);
  await p6.close();

  await browser.close();
  if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('RAIN SMOKE FAILED');
    process.exit(1);
  }
  console.log(JSON.stringify({ pure, proj, hourly, soon, stop, off }, null, 2));
  console.log('RAIN SMOKE PASSED');
})();
