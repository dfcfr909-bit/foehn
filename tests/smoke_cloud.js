// 気圧面雲量の無段階表示を検証する
//   ・補助リクエストで気圧面14層（1000〜200hPa）を取りに行くこと
//   ・高度方向の補間が単調3次で、0〜100%の外へ行き過ぎないこと
//   ・描画された雲に「1時間ぶんの箱」の縦線が出ないこと（時刻方向がなめらか）
//   ・濃さが段階的（旧実装は6段階）ではなく連続していること
//   ・空＝青／雲＝白であること（灰色どうしで背景・夜・雲が混ざらないための肝）
//   ・夜は空だけが暗くなること
//   ・月齢で夜の濃さが変わること（満月＝明るい / 新月＝暗い）
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname, '..', 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
function pad(n) { return String(n).padStart(2, '0'); }

const START = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 3); return d; })();
const N = 288;                      // 過去3日＋先9日ぶん
function times() {
  const t = [];
  for (let i = 0; i < N; i++) {
    const d = new Date(START.getTime() + i * 3600e3);
    t.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
  }
  return t;
}
function fakeWeather() {
  const h = { time: times(), temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [], cloud_cover_low: [], cloud_cover_mid: [], cloud_cover_high: [] };
  for (let i = 0; i < N; i++) {
    h.temperature_2m.push(10); h.apparent_temperature.push(8);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(4);
    h.winddirection_10m.push(180); h.weathercode.push(2); h.cloudcover.push(40);
    h.cloud_cover_low.push(30); h.cloud_cover_mid.push(50); h.cloud_cover_high.push(20);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(START.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${pad(b.getMonth()+1)}-${pad(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily };
}
// 補助データ：850hPa付近だけ、時刻ごとに 0%↔100% を交互に切り替える。
// 旧実装ならここに1時間ごとの縦の切れ目がはっきり出る（＝境界の検出用）。
const LEVELS = [1000, 975, 950, 925, 900, 850, 800, 700, 600, 500, 400, 300, 250, 200];
function fakeSupplemental(reqUrl) {
  const h = { time: times() };
  h.wind_gusts_10m = new Array(N).fill(9);
  for (const hPa of LEVELS) {
    if (!reqUrl.includes(`cloud_cover_${hPa}hPa`)) continue;
    h[`cloud_cover_${hPa}hPa`] = Array.from({ length: N }, (_, i) =>
      (hPa === 850 || hPa === 800) ? (i % 2 === 0 ? 100 : 0) : 0);
  }
  return { hourly: h };
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => { errors.push('dialog: ' + d.message()); d.dismiss(); });
  let supplementalUrl = null;
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) {
      if (url.includes('cloud_cover_1000hPa') || url.includes('wind_gusts_10m')) {
        supplementalUrl = url;
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeSupplemental(url)) });
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    }
    return route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
  });
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1800);

  const r = await page.evaluate(() => {
    const prof = state.cloudProfiles ? state.cloudProfiles.values().next().value : null;
    // 補間が 0〜100 の外へ出ないこと（単調3次の行き過ぎ防止が効いているか）
    let minV = 999, maxV = -999, kinks = 0, prevSlope = null;
    if (prof) {
      const sl = cloudSlopes(prof);
      let prev = null;
      for (let a = 0; a <= ALT_TOP; a += 20) {
        const v = cloudAt(prof, a, sl);
        minV = Math.min(minV, v); maxV = Math.max(maxV, v);
        if (prev != null) {
          const s = v - prev;
          // 傾きが1ステップで大きく折れる箇所＝折れ線の角
          if (prevSlope != null && Math.abs(s - prevSlope) > 3) kinks++;
          prevSlope = s;
        }
        prev = v;
      }
    }
    // 実際に描かれた雲の画素を読む
    const cv = document.querySelector('#chart-cloud canvas');
    const ctx = cv.getContext('2d');
    const box = cloudPlotBox(cloudChart);
    /* 明るさを1点だけ読むための道具（雲は白・空は青なので赤成分で足りる）。
       ★高度グリッド線は破線なので、線に乗ると時刻ごとに破線の位相が変わって
         明るさが数十も揺れる。高度から安全なyを選ぶところまでを込みにする。 */
    const safeY = alt => {
      let yy = Math.round(box.yAlt(alt));
      while (ALT_TICKS.some(a => Math.abs(box.yAlt(a) - yy) < 4)) yy -= 1;
      return yy;
    };
    const yCloudBand = safeY(1700);     // 雲の帯の中
    const ySky = safeY(5000);           // 雲のない高さ
    const at = (idx, yy) => {
      const px = ctx.getImageData(Math.round(cloudChart.valToPos(idx, 'x', true)), yy, 1, 1).data;
      return { r: px[0], g: px[1], b: px[2], lum: 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2] };
    };

    // 雲の帯（850〜800hPa）の中の1行を横に走査する。
    // 0時の日付区切り線が入ると段差として拾ってしまうので、1時〜22時の中で見る。
    // 高度グリッド線は破線なので、線に重ならない高さを選ぶ（重なると3px周期の縞を拾う）
    const y = yCloudBand;
    const i0 = state.allData.findIndex(d => d.time.getHours() === 1);
    const x0 = Math.round(cloudChart.valToPos(i0, 'x', true));
    const x1 = Math.round(cloudChart.valToPos(i0 + 21, 'x', true));
    const row = ctx.getImageData(x0, y, x1 - x0, 1).data;
    const lum = [];
    for (let i = 0; i < row.length; i += 4) lum.push(row[i]);   // 雲が濃いほど明るい（白）

    // 雲(100%)と晴れ(0%)を隣り合う時刻で比べる。fixtureは偶数時=100% / 奇数時=0%
    const iCloud = state.allData.findIndex((d, k) => k > 30 && d.time.getHours() % 2 === 0);
    const iClear = iCloud + 1;
    // 昼と夜を、雲のない高度(6000m)で比べる（日の出04:40 / 日の入19:00のfixture）。
    // ★fixtureは「indexの偶奇」で雲を出し分けているので、比べる2点は偶奇をそろえること。
    //   ずれると雲の量の差を夜の暗さと取り違える（1時と12時で比べて実際に落ちた）。
    const iNight = state.allData.findIndex((d, k) => k > 30 && d.time.getHours() === 1);
    const iDay = state.allData.findIndex((d, k) => k > 30 && d.time.getHours() === 13);
    /* 「1時間ごとの段差」を見たいので、**時刻の境目とそれ以外を分けて**測る。
       全体の最大値だけ見ると、夜のシェーディングの境目のような
       雲と無関係のなだらかな変化を拾って、実行時刻によって落ちる（実際に落ちた）。 */
    let maxJump = 0, maxJumpHour = 0, maxJumpOther = 0;
    const hourXs = new Set();
    for (let k = 0; k <= 24; k++) {
      const px = Math.round(cloudChart.valToPos(i0 + k - 0.5, 'x', true)) - x0;
      for (let d = -1; d <= 1; d++) hourXs.add(px + d);
    }
    for (let i = 1; i < lum.length; i++) {
      const j = Math.abs(lum[i] - lum[i - 1]);
      maxJump = Math.max(maxJump, j);
      if (hourXs.has(i)) maxJumpHour = Math.max(maxJumpHour, j);
      else maxJumpOther = Math.max(maxJumpOther, j);
    }
    const distinct = new Set(lum).size;
    const span = Math.max(...lum) - Math.min(...lum);
    return {
      levels: prof ? prof.length : 0,
      profiles: state.cloudProfiles ? state.cloudProfiles.size : 0,
      minV, maxV, kinks,
      alphaAt: [0, 10, 25, 50, 75, 90, 100].map(c => Number(cloudAlpha(c).toFixed(3))),
      rasterW: cloudRasterFor(state.allData).width,
      rasterH: cloudRasterFor(state.allData).height,
      hours: state.allData.length,
      cached: cloudRasterFor(state.allData) === cloudRasterFor(state.allData),
      px: { n: lum.length, maxJump, maxJumpHour, maxJumpOther, distinct, span },
      // 空＝青 / 雲＝白 の関係（灰色どうしで混ざらないための肝）
      cloudPx: at(iCloud, yCloudBand),
      clearPx: at(iClear, yCloudBand),
      nightSky: at(iNight, ySky),
      daySky: at(iDay, ySky),
      // 月齢による夜の濃さ（満月=明るい / 新月=暗い）
      moon: (() => {
        const base = Date.UTC(2000, 0, 6, 18, 14);           // 基準の新月
        const nm = new Date(base + 100 * SYNODIC_MONTH * 86400000);
        const fm = new Date(base + 100.5 * SYNODIC_MONTH * 86400000);
        return {
          illumNew: Number(moonIllum(nm).toFixed(3)),
          illumFull: Number(moonIllum(fm).toFixed(3)),
          alphaNew: Number(nightAlphaAt(nm).toFixed(3)),
          alphaFull: Number(nightAlphaAt(fm).toFixed(3)),
        };
      })(),
    };
  });

  await page.screenshot({ path: __dirname + '/smoke_cloud.png' });
  await browser.close();

  console.log(JSON.stringify({ supplementalUrl, ...r, errors }, null, 2));
  // 濃さのカーブが単調増加であること
  const monoAlpha = r.alphaAt.every((v, i) => i === 0 || v >= r.alphaAt[i - 1]);
  const ok = errors.length === 0 &&
    !!supplementalUrl && supplementalUrl.includes('cloud_cover_975hPa') &&
    supplementalUrl.includes('cloud_cover_925hPa') &&
    r.levels === 14 && r.profiles > 200 &&                 // 14層ぶん取れている
    r.minV >= 0 && r.maxV <= 100 &&                        // 補間の行き過ぎなし
    r.kinks === 0 &&                                       // 高度方向に折れ線の角が無い
    r.alphaAt[0] === 0 && monoAlpha && r.alphaAt[6] > 0.7 &&
    r.rasterH === 192 && r.rasterW === r.hours * 8 && r.cached &&   // 1時間8分割のラスタを使い回す
    r.px.span > 40 &&                                      // 0%↔100%の差はちゃんと出ている
    r.px.distinct > 30 &&                                  // 濃さが段階的でない（旧実装は数種類）
    /* 時刻の境目に段差が無い（旧実装なら1時間ごとに span ぶんの段差が出た）。
       ⚠**絶対値で頭打ちにしないこと。** 以前は `maxJump <= 14` としていたが、
       この14は「なめらかな坂のいちばん急な所」の実測値すれすれで、
       **実行時刻によって15になって落ちた**（アプリは何も変わっていないのに）。
       見たいのは「境目だけ余分に飛ぶか」なので、境目と境目以外を比べる。 */
    r.px.maxJumpHour <= r.px.maxJumpOther + 6 &&
    // 念のため、坂そのものが段になっていないことも幅に対する割合で見る
    r.px.maxJump < r.px.span * 0.35 &&
    // 空＝青 / 雲＝白。雲のほうが明るく、晴れ空は青い（青成分が赤成分より大きい）
    r.cloudPx.lum > r.clearPx.lum + 30 &&
    r.clearPx.b > r.clearPx.r + 25 &&
    r.cloudPx.r > 200 && r.cloudPx.g > 200 && r.cloudPx.b > 200 &&
    // 夜は空だけが暗くなる（雲は白のままなので混ざらない）
    r.daySky.lum > r.nightSky.lum + 20 &&
    // 月齢で夜の濃さが変わる（満月＝明るい / 新月＝暗い）
    r.moon.illumNew < 0.02 && r.moon.illumFull > 0.98 &&
    r.moon.alphaNew > r.moon.alphaFull + 0.1;
  console.log(ok ? 'CLOUD SMOKE PASSED' : 'CLOUD SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
