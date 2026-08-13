/* 判定に使う風の高度（ADR-0006）。
   実機で踏んだ皇海山の数字をそのまま固定する。

   2026-08-11 17時の皇海山（2,144m）で、
     windspeed_10m      2.73 m/s  ← 以前はこれで判定していた → 終日A
     wind_speed_800hPa 21.02 m/s  ← 山頂(2,144m)に最も近い層 → C
   てんくらはC。モデル地形が1,405mで山頂より739m低く、山頂が速い層に
   突き出しているのにモデルがそれを知らない、というのが原因だった。

   ⚠ **10m風とのすり替えを「値が変わったか」で見ないこと。** 判定（A/B/C）が
   実際に変わるところまで見る。ここが甘いと、風は正しく取れているのに
   判定に渡っていない、という取りこぼしを見逃す。 */
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const HTML = fs.readFileSync(path.join(__dirname, '..', 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');

/* --- 標高タイル（国土地理院 dem_png）を作る --- */
const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function CRC(buf) { let c = 0xffffffff; for (const b of buf) c = CRC_T[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
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
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
// 標高 x*0.01 [m]。2144.00m → x=214400 → RGB(3,69,128)
const DEM_SUMMIT = solidPng(256, 256, 3, 69, 128);      // 2,144m（皇海山）
// 570.00m → x=57000 → RGB(0,222,168)。モデル地形(1,405m)より低い＝安全弁の検証用
const DEM_LOW = solidPng(256, 256, 0, 222, 168);

const MODEL_ELEV = 1405.0;          // 実測（Open-Meteoが返した値）
const WIND10 = 2.73;                // 実測
const WIND800 = 21.02;              // 実測（800hPa=1,950m。山頂2,144mの最寄り）
const WIND700 = 28.86;              // 実測（3,010m）

let demMode = 'summit';   // 'summit' | 'low'
let levelMode = 'ok';     // 'ok' | 'missing'（層が返ってこない場合）

function pad(n) { return String(n).padStart(2, '0'); }
function fakeWeather() {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [],
    weathercode: [], cloudcover: [],
  };
  const levels = [925, 900, 850, 800, 700, 600];
  if (levelMode === 'ok') {
    for (const p of levels) { h[`wind_speed_${p}hPa`] = []; h[`wind_direction_${p}hPa`] = []; }
  }
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    // 気温・降水・気圧は判定に効かない安全な値に固定し、**風だけで判定が決まる**ようにする
    h.temperature_2m.push(15); h.apparent_temperature.push(15);
    h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(WIND10);          // 地上は終日そよ風
    h.winddirection_10m.push(270);
    h.windgusts_10m.push(17.9);
    h.weathercode.push(2); h.cloudcover.push(40);
    if (levelMode === 'ok') {
      // 山頂高度の層だけが強い。ほかの層は弱くしておき、**層の選び方**まで見る
      h.wind_speed_925hPa.push(3.0);  h.wind_direction_925hPa.push(300);
      h.wind_speed_900hPa.push(3.2);  h.wind_direction_900hPa.push(300);
      h.wind_speed_850hPa.push(4.47); h.wind_direction_850hPa.push(300);
      h.wind_speed_800hPa.push(WIND800); h.wind_direction_800hPa.push(315);
      h.wind_speed_700hPa.push(WIND700); h.wind_direction_700hPa.push(320);
      h.wind_speed_600hPa.push(35.0); h.wind_direction_600hPa.push(320);
    }
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const base = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: MODEL_ELEV };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
  const errors = [];
  const askedLevels = [];

  const newPage = async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
      if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
      if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
      if (url.includes('/dem_png/')) {
        return route.fulfill({ contentType: 'image/png', body: demMode === 'low' ? DEM_LOW : DEM_SUMMIT });
      }
      if (url.includes('api.open-meteo.com')) {
        askedLevels.push(url);
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
      }
      return route.abort();
    });
    await page.addInitScript(() => localStorage.setItem('sotoki_last',
      JSON.stringify({ lat: 36.7364, lon: 139.34, name: '皇海山' })));
    await page.goto('https://sotoki.test/');
    await page.waitForTimeout(1200);
    return page;
  };

  /* ============ 1. 山頂が突き出ている：気圧面の風で判定する ============ */
  const page = await newPage();
  const summit = await page.evaluate(() => {
    const d = state.allData[state.sliderIndex];
    return {
      src: state.windSource,
      wind: d.wind, wind10: d.wind10, wdir: d.wdir,
      grade: judgePoint(d).grade,
      breakdown: judgeBreakdown(d).wind,
      popupWind: document.getElementById('pop-wind').textContent,
      popupSrc: document.getElementById('pop-windsrc').textContent,
      demElev: state.demElevation, modelElev: state.elevation,
    };
  });
  ok(Math.abs(summit.demElev - 2144) < 1, '標高タイルから山頂2,144mを読める（前提）', summit.demElev);
  ok(summit.modelElev === MODEL_ELEV, 'モデル格子の標高は1,405m（前提）', summit.modelElev);
  ok(summit.src && summit.src.kind === 'level' && summit.src.hPa === 800,
    '★山頂2,144mに最も近い800hPa（1,950m）を選ぶ', summit.src);
  ok(Math.abs(summit.wind - WIND800) < 0.01,
    '★判定に渡る風が山頂高度の値になる（21.02 m/s）', { wind: summit.wind, wind10: summit.wind10 });
  ok(Math.abs(summit.wind10 - WIND10) < 0.01, '地上10m風も参照用に残す', summit.wind10);
  ok(summit.wdir === 315, '風向も同じ層の値にそろえる（矢印と判定が食い違わない）', summit.wdir);
  /* ここが本丸。値が変わっただけでなく**判定が変わる**こと。
     10m風2.73なら abcScore(2.73,5,10)=0=A、800hPa21.02なら =2=C */
  ok(summit.grade === 'C', '★★判定がAではなくCになる（てんくらと一致）', summit);
  ok(summit.breakdown === 2, '内訳でも風がC相当', summit.breakdown);
  ok(summit.popupWind === '21', 'ポップアップの風速も山頂高度の値', summit.popupWind);
  ok(summit.popupSrc.includes('2144'), '★どこの高度の風か画面に出す', summit.popupSrc);

  // 気圧面の風をリクエストしていること（本体の1本で取る。補助リクエストに逃がさない）
  const mainUrl = askedLevels.find(u => u.includes('windspeed_10m'));
  ok(/wind_speed_800hPa/.test(mainUrl) && /models=jma_seamless/.test(mainUrl),
    '★本体のリクエストで気圧面の風を取る（モデルを混ぜない・通信を増やさない）');
  ok(/wind_speed_unit=ms/.test(mainUrl), '気圧面の風にも ms 指定が要る（ADR-0005）');
  await page.close();

  /* ============ 2. 安全弁：山頂がモデル地形より低ければ地上風 ============ */
  demMode = 'low';
  const page2 = await newPage();
  const low = await page2.evaluate(() => {
    const d = state.allData[state.sliderIndex];
    return { src: state.windSource, wind: d.wind, grade: judgePoint(d).grade,
             popupSrc: document.getElementById('pop-windsrc').textContent };
  });
  ok(low.src && low.src.kind === 'ground',
    '★山頂がモデル地形(1,405m)より低ければ地上10m風のまま（地中の外挿値を拾わない）', low.src);
  ok(Math.abs(low.wind - WIND10) < 0.01, '地上風が判定に渡る', low.wind);
  ok(low.grade === 'A', 'その場合の判定はA（風が弱いので正しい）', low.grade);
  ok(low.popupSrc.includes('地上'), '地上風であることを画面に出す', low.popupSrc);
  await page2.close();
  demMode = 'summit';

  /* ============ 3. 層が返ってこないとき：黙って甘い判定に戻らない ============ */
  levelMode = 'missing';
  const page3 = await newPage();
  const miss = await page3.evaluate(() => {
    const d = state.allData[state.sliderIndex];
    return { src: state.windSource, wind: d.wind, grade: judgePoint(d).grade,
             popupSrc: document.getElementById('pop-windsrc').textContent };
  });
  ok(miss.src && miss.src.fellBack === true, '層が無ければフォールバックの印を立てる', miss.src);
  ok(Math.abs(miss.wind - WIND10) < 0.01, '地上風に落ちる（壊れはしない）', miss.wind);
  ok(miss.popupSrc.includes('取れず') || miss.popupSrc.includes('地上'),
    '★★落ちたことを黙らない（黙って甘い判定に戻るのがいちばん危ない失敗）', miss.popupSrc);
  await page3.close();
  levelMode = 'ok';

  /* ============ 3.5 座標が山頂からずれていても外さない ============
     ★実機で踏んだ本命の落とし穴。areas.json の皇海山の座標は山頂から約490mずれており、
     DEMが斜面（1,405m以下）を読んで**静かに地上風の判定へ落ちていた**。
     判定はA、表示は「@地上10m」——エラーは何も出ないので気づけない。
     峰と分かっているときは areas.json の標高（state.summitElev）を優先する。 */
  demMode = 'low';   // DEMは570m（山頂2,144mより遥かに低い＝座標ずれの再現）
  const page4 = await newPage();
  const known = await page4.evaluate(() => {
    // ランキングの峰リンクと同じ経路。標高を渡して選び直す
    gotoPeak('皇海山', 36.7364, 139.34, 2144);
    return new Promise(r => setTimeout(() => r({
      summitElev: state.summitElev,
      demElev: state.demElevation,
      src: state.windSource,
      wind: state.allData[state.sliderIndex].wind,
      grade: judgePoint(state.allData[state.sliderIndex]).grade,
      popupSrc: document.getElementById('pop-windsrc').textContent,
    }), 1200));
  });
  ok(known.summitElev === 2144, '峰の標高が state に載る', known.summitElev);
  ok(known.demElev !== null && known.demElev < 1000, 'DEMは低い値を読んでいる（前提の再現）', known.demElev);
  ok(known.src && known.src.kind === 'level' && known.src.hPa === 800,
    '★★DEMが外れていても、峰の標高が分かっていれば気圧面を選ぶ', known.src);
  ok(Math.abs(known.wind - WIND800) < 0.01, '判定に山頂高度の風が渡る', known.wind);
  ok(known.grade === 'C', '★★判定がCになる（座標ずれに影響されない）', known.grade);
  ok(known.popupSrc.includes('2144'), '高度の表示も山頂', known.popupSrc);
  await page4.close();

  // 落ちたときは読んだ標高を出す（なぜ地上風なのか実機で切り分けられるように）
  const diag = await (async () => {
    const p = await newPage();   // summitElev なし・DEM低い → ground/flat
    const r = await p.evaluate(() => document.getElementById('pop-windsrc').textContent);
    await p.close();
    return r;
  })();
  ok(/山頂\d+m/.test(diag),
    '★地上風に落ちたら「読んだ標高」を出す（黙って落ちると切り分けられない）', diag);
  demMode = 'summit';

  /* ============ 4. 層の選び方（境目） ============ */
  const pick = await (async () => {
    const p = await newPage();
    const r = await p.evaluate(() => ({
      // 標高→層の対応。境目で隣の層に移ることを見る
      m900: windLevelFor(990)[0], m850: windLevelFor(1460)[0],
      koukai: windLevelFor(2144)[0],          // 皇海山 → 800hPa
      fuji: windLevelFor(3776)[0],            // 富士山 → 600hPa(4,200m)の方が近い
      tsukuba: windLevelFor(877)[0],          // 筑波山 → 900hPa
      // モデル地形が分からない（ランキング）ときの安全弁
      lowNoModel: pickWindSource(500, null).kind,
      highNoModel: pickWindSource(2144, null).hPa,
      noElev: pickWindSource(null, 1405).kind,
    }));
    await p.close();
    return r;
  })();
  ok(pick.koukai === 800, '皇海山2,144m → 800hPa', pick.koukai);
  ok(pick.fuji === 600, '富士山3,776m → 600hPa（700hPaより近い）', pick.fuji);
  ok(pick.tsukuba === 900, '筑波山877m → 900hPa', pick.tsukuba);
  ok(pick.lowNoModel === 'ground',
    'モデル地形不明かつ最下層より低ければ地上風（ランキングの安全弁）', pick.lowNoModel);
  ok(pick.highNoModel === 800, 'モデル地形不明でも高ければ気圧面を使う（ランキング）', pick.highNoModel);
  ok(pick.noElev === 'ground', '標高が分からなければ地上風', pick.noElev);

  await browser.close();
  if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('WIND SMOKE FAILED');
    process.exit(1);
  }
  console.log(JSON.stringify({ summit, low, miss, known, diag, pick }, null, 2));
  console.log('WIND SMOKE PASSED');
})();
