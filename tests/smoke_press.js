// 気圧パネルの検証
//   ・下段の ΔP6h バー（絶対気圧のレンジに関係なく同じ変化量は同じ高さ）
//   ・急降下の爆弾マーク（事件ごとに1つ・穏やかなら出ない）
//   ・hPaの目盛りが「線の帯」の中に収まること（下段のバーの高さに数字を並べない）
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const ENGINE = fs.readFileSync(path.join(ROOT, 'snowRanking.js'), 'utf8');
const AREAS = fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
const p2 = n => String(n).padStart(2, '0');

/* 気圧の作り方を差し替えられるfixture。
   pressAt(i) で「i時間目の気圧」を決める。 */
function fakeWeather(pressAt) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [],
  };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.temperature_2m.push(-5); h.apparent_temperature.push(-9);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(pressAt(i));
    h.windspeed_10m.push(4); h.winddirection_10m.push(180);
    h.weathercode.push(2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${p2(b.getMonth() + 1)}-${p2(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily, elevation: 1500 };
}

// 全体は大きく下る（＝絶対気圧のレンジが広い）が、急降下は1回だけ
const DROP_FROM = 120, DROP_TO = 140;
const pressStormy = i => {
  const trend = 1025 - i * 0.10;
  const bomb = i <= DROP_FROM ? 0 : (i < DROP_TO ? -(i - DROP_FROM) * 0.55 : -(DROP_TO - DROP_FROM) * 0.55);
  return trend + bomb;
};
const pressCalm = () => 1013;

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const errors = [];

  async function open(pressAt) {
    const page = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2 });
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
      if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
      if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
      if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
      if (url.includes('leaflet')) return route.fulfill({ contentType: 'application/javascript', body: '' });
      if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
      if (url.includes('api.open-meteo.com')) {
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(pressAt)) });
      }
      return route.abort();
    });
    await page.addInitScript(() => {
      localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
    });
    await page.goto('https://sotoki.test/');
    await page.waitForTimeout(1800);
    const boot = await page.evaluate(() => (typeof state === 'undefined' || !state.allData) ? 'stateなし' : null);
    if (boot) { console.error('起動に失敗:', boot); process.exit(1); }
    return page;
  }

  /* ================= 1. 急降下の拾い方 ================= */
  const page = await open(pressStormy);
  const bombs = await page.evaluate(() => {
    const idx = pressBombIndices(state.allData);
    return {
      count: idx.length,
      idx,
      dps: idx.map(i => state.allData[i].dpress),
      threshold: PRESS_BOMB_DP,
      // いちばん急な点であること
      steepest: idx.map(i => {
        let best = i;
        for (let j = Math.max(0, i - 12); j < Math.min(state.allData.length, i + 12); j++) {
          if ((state.allData[j].dpress || 0) < (state.allData[best].dpress || 0)) best = j;
        }
        return best === i;
      }),
    };
  });
  ok(bombs.count === 1, '★続けて下がっても爆弾は事件ごとに1つ（毎時は置かない）', bombs);
  ok(bombs.dps.every(d => d <= bombs.threshold), '閾値を割った所にだけ置く', bombs);
  ok(bombs.steepest.every(Boolean), 'その事件のいちばん急な点に置く', bombs);

  /* ================= 2. ΔPバーが下段に描かれる ================= */
  const layout = await page.evaluate(() => {
    const c = document.getElementById('chart-press').querySelector('canvas');
    const pr = c.width / pressChart.width;
    const plotH = c.height - TIME_AXIS_H * pr;
    const top = 10 * pr;
    const lineBot = top + (plotH - top) * PRESS_LINE_FRAC;
    const barTop = lineBot + 6 * pr;
    const barBot = plotH - 2 * pr;
    return {
      pr, plotH, top, lineBot, barTop, barBot,
      zeroY: (barTop + barBot) / 2,
      barMax: PRESS_BAR_MAX,
      lineFrac: PRESS_LINE_FRAC,
      w: c.width,
    };
  });
  ok(layout.lineFrac > 0.5 && layout.lineFrac < 0.85, '線が上段の大半を使う', layout.lineFrac);
  ok(layout.barTop > layout.lineBot, 'バーの帯は線の帯とぶつからない', layout);

  // 急降下の位置と、変化のほとんど無い位置で、下段の画素を比べる
  /* ⚠**サンプルするindexはデータから取ること。** fixtureの時刻index と
     表示ウィンドウ（実績72h＋予報）のindex は現在時刻ぶんズレる。
     決め打ちすると見当違いの場所を読んで落ちる（実際に落ちた）。 */
  const bars = await page.evaluate(lay => {
    const c = document.getElementById('chart-press').querySelector('canvas');
    const ctx = c.getContext('2d');
    const d = state.allData;
    const dropIdx = pressBombIndices(d)[0];
    let quietIdx = -1;
    for (let i = 2; i < d.length - 2; i++) {
      if (Math.abs(d[i].dpress || 0) < 0.1) { quietIdx = i; break; }
    }
    const at = (i, y) => {
      const x = Math.round(pressChart.valToPos(i, 'x', true));
      const px = ctx.getImageData(Math.max(0, Math.min(c.width - 1, x)), Math.round(y), 1, 1).data;
      return { r: px[0], g: px[1], b: px[2], a: px[3] };
    };
    /* バーの高さは |dp|/PRESS_BAR_MAX の割合なので、ゼロ線のすぐ下を読む。
       深く読むとバーの先端を外して背景を拾う（実際に外した） */
    const below = lay.zeroY + (lay.barBot - lay.zeroY) * 0.2;
    return {
      dropIdx, quietIdx,
      dropDp: dropIdx != null ? d[dropIdx].dpress : null,
      quietDp: quietIdx >= 0 ? d[quietIdx].dpress : null,
      drop: dropIdx != null ? at(dropIdx, below) : null,
      quiet: quietIdx >= 0 ? at(quietIdx, below) : null,
    };
  }, layout);
  const warm = c => !!c && c.r > c.b + 60;      // 下降は暖色（濃く塗られる）
  ok(warm(bars.drop), '★急降下の所は下段のバーが暖色で塗られる', bars);
  ok(!warm(bars.quiet), '変化が緩い所はバーがほとんど出ない', bars);

  /* ================= 3. hPaの目盛りは線の帯の中 ================= */
  const gutter = await page.evaluate(() => {
    const prTop = CHART_H_SKY + CHART_H_CLOUD + CHART_H_WIND;
    const plotTop = prTop + 10, plotBottom = prTop + CHART_H_PRESS - TIME_AXIS_H;
    const pl = pressGutterLayout(plotTop, plotBottom);
    return {
      plotTop, plotBottom, lineBottom: pl.lineBottom,
      labelYs: pl.labels.map(l => l.y),
      barLabelY: pl.barLabelY,
    };
  });
  ok(gutter.labelYs.every(y => y > gutter.plotTop && y < gutter.lineBottom),
    '★hPaの目盛りは線の帯の中に収まる（バーの高さに数字を並べない）', gutter);
  ok(gutter.barLabelY > gutter.lineBottom && gutter.barLabelY < gutter.plotBottom,
    'Δ6hの見出しはバーの帯に置く', gutter);

  /* ================= 4. 縦窓がスライダーに追従する（v4.66.0） =================
     絶対気圧は10日で30hPa以上動く。全期間を1画面に収めると1日ぶんが線に出ないので、
     縦窓を狭く保って選択時刻に追従させる。左のガターの数字も一緒に動く。 */
  const win = await page.evaluate(async () => {
    const d = state.allData;
    // 気圧の高い時刻と低い時刻を探す
    let hi = 0, lo = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i].pressure == null) continue;
      if (d[i].pressure > d[hi].pressure) hi = i;
      if (d[i].pressure < d[lo].pressure) lo = i;
    }
    const snap = async idx => {
      setSelectedIndex(idx);
      await new Promise(r => setTimeout(r, 500));   // 落ち着いてからの合わせ直しを待つ
      return {
        idx, press: d[idx].pressure,
        min: pressChart.scales.p.min, max: pressChart.scales.p.max,
        gutMin: scaleInfo.pressMin, gutMax: scaleInfo.pressMax,
      };
    };
    const atHi = await snap(hi);
    const atLo = await snap(lo);
    const full = (() => {
      let mn = Infinity, mx = -Infinity;
      d.forEach(x => { if (x.pressure != null) { mn = Math.min(mn, x.pressure); mx = Math.max(mx, x.pressure); } });
      return mx - mn;
    })();
    return { atHi, atLo, fullSpan: full, minSpan: PRESS_WIN_MIN_HPA };
  });
  const spanOf = w => w.max - w.min;
  ok(win.fullSpan > 20, 'fixtureは全期間で20hPa以上動く（窓の効果を見るため）', win.fullSpan);
  ok(spanOf(win.atHi) < win.fullSpan * 0.7 && spanOf(win.atLo) < win.fullSpan * 0.7,
    '★縦窓は全期間より狭い（＝上下動が拡大される）', win);
  ok(spanOf(win.atHi) >= win.minSpan - 0.01, '窓は狭くしすぎない（最小幅を保つ）', win);
  ok(win.atHi.min > win.atLo.min + 3,
    '★選択時刻を動かすと窓も上下に動く', { hi: win.atHi, lo: win.atLo });
  ok(win.atHi.press >= win.atHi.min && win.atHi.press <= win.atHi.max &&
     win.atLo.press >= win.atLo.min && win.atLo.press <= win.atLo.max,
    '★選択時刻の気圧は必ず窓の中に入る', win);
  ok(win.atHi.gutMin === win.atHi.min && win.atLo.gutMax === win.atLo.max,
    '★左のガターの数字も窓と一緒に動く（絶対値が読めたまま）', win);

  /* ★線が窓を外れても下段のバーや隣のパネルに突き抜けないこと。
     縦窓は選択時刻のまわりに合わせるので、画面外の時刻は必ず窓を大きく外れる。 */
  const spill = await page.evaluate(lay => {
    const c = document.getElementById('chart-press').querySelector('canvas');
    const ctx = c.getContext('2d');
    const d = state.allData;
    // 窓から最も外れている時刻を探す
    const p = pressChart.scales.p;
    let worst = 0, worstD = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i].pressure == null) continue;
      const off = Math.max(p.min - d[i].pressure, d[i].pressure - p.max);
      if (off > worstD) { worstD = off; worst = i; }
    }
    /* 隙間の1行をまるごと走査する。1点だけ読むと、線がその列を通っていないだけで
       通ってしまう（実際に空振りした） */
    const gapY = Math.round((lay.lineBot + lay.barTop) / 2);
    const row = ctx.getImageData(0, gapY, c.width, 1).data;
    let inkedPx = 0;
    for (let x = 0; x < c.width; x++) {
      const r = row[x * 4], g = row[x * 4 + 1], b = row[x * 4 + 2];
      // 線の色は橙か青。背景（灰・淡い警告帯）はRGBが近い
      if (Math.abs(r - b) > 55) inkedPx++;
    }
    return { worst, worstD, gapY, inkedPx, width: c.width };
  }, layout);
  ok(spill.worstD > 1, '窓を大きく外れる時刻が存在する（検査が空振りしていない）', spill);
  ok(spill.inkedPx === 0, '★窓を外れた線が帯の外へ突き抜けない（クリップしている）', spill);

  await page.screenshot({ path: __dirname + '/smoke_press.png' });
  await page.close();

  /* ================= 4. 穏やかなときは爆弾を出さない ================= */
  const calm = await open(pressCalm);
  const calmBombs = await calm.evaluate(() => ({
    bombs: pressBombIndices(state.allData).length,
    maxAbsDp: Math.max(...state.allData.map(d => Math.abs(d.dpress || 0))),
  }));
  ok(calmBombs.bombs === 0, '★気圧が動かないときは爆弾を出さない', calmBombs);
  await calm.close();

  await browser.close();

  ok(errors.length === 0, 'ページ内エラーが出ていない', errors);
  if (fails.length) {
    console.error('FAILED ' + fails.length + '件:');
    fails.forEach(f => console.error('  ✗ ' + f));
    console.log('PRESS SMOKE FAILED');
    process.exit(1);
  }
  console.log('PRESS SMOKE PASSED');
})();
