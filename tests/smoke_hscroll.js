// 横スクロール（1日≒1画面）+ 選択線追従 + 現在ボタンの検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
function pad(n) { return String(n).padStart(2, '0'); }
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {   // 過去3日＋先9日ぶん（アプリの取得範囲と同じ）
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10 + 8 * Math.sin(i / 10)); h.apparent_temperature.push(8);
    h.precipitation.push(i % 18 < 3 ? 3 : 0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3 + 8 * Math.abs(Math.sin(i / 8)));
    h.winddirection_10m.push((i * 30) % 360); h.weathercode.push(i % 6 < 3 ? 0 : 2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${pad(b.getMonth()+1)}-${pad(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily };
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 }, hasTouch: true });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1000);

  const init = await page.evaluate(() => {
    const wrap = document.getElementById('charts-wrapper');
    return {
      // チャートはtransformで動かす（scrollLeftではない）。内容が画面より広いこと
      hasHScroll: document.getElementById('charts-inner').getBoundingClientRect().width
                > wrap.clientWidth + 5,
      innerCanvases: document.querySelectorAll("#charts-inner canvas").length,
      hasGutter: !!document.getElementById('axis-gutter'),
      idx: state.sliderIndex,          // 初期=現在（実績72hぶん後ろなので72）
      nowFrac: nowIndexFrac(),
      btnNow: document.getElementById('btn-now').style.display,
      hoursOnScreen: Math.round((wrap.clientWidth - 44 - 6) / (pxPerHourVal)), // ≒24
      pph: pxPerHourVal,
      // スクラバー帯：全時間ぶんの幅があり、チャートとスクロール量が一致していること
      scrubScrollable: (() => {
        const s = document.getElementById('scrubber');
        return s.scrollWidth > s.clientWidth + 5;
      })(),
      scrubLeft: document.getElementById('scrubber').scrollLeft,
      hasScrubCanvas: !!document.getElementById('scrubber-canvas'),
      // 帯とチャートは同じ座標系＝同じ移動量・同じ内容幅
      scrollMatched: Math.abs(document.getElementById('scrubber').scrollLeft - chartOffset) < 1,
      // 両端の余白はゼロ（末尾の空白の原因だったので置かない）
      padL: chartPadL, padR: chartPadR,
      widthMatched: Math.abs(document.getElementById('scrubber-inner').getBoundingClientRect().width
                           - document.getElementById('charts-inner').getBoundingClientRect().width) < 1,
    };
  });

  // スクラバー帯をなぞって選択時刻を進める → 選択indexが進み、現在ボタンが出る。
  // チャートと同じ座標系なので、index=120をSCRUB_POS位置に置くスクロール量を直接使える
  await page.evaluate(() => {
    document.getElementById('scrubber').scrollLeft = chartPadL + idxToX(120) - viewW * SCRUB_POS;
  });
  await page.waitForTimeout(700);
  const afterScroll = await page.evaluate(() => ({
    idx: state.sliderIndex,
    badge: document.getElementById('pop-time').textContent,
    btnNow: document.getElementById('btn-now').style.display,
    hud: document.getElementById('pop-time').textContent,
    // 帯を動かすとチャートも同じ量だけ動くこと
    scrollMatched: Math.abs(document.getElementById('scrubber').scrollLeft - chartOffset) < 1.5,
    // 赤の選択線と帯の指標が同じx＝上下でズレないこと（今回の修正点）
    lineX: parseFloat(document.getElementById('scrub-line').style.left),
    markX: parseFloat(document.getElementById('scrubber-center').style.left),
  }));

  // なぞっている最中（吸い付き前）でも、上下の選択線とスクロール量が一致していること。
  // イベント間引きで上のラインだけ遅れる不具合の回帰テスト
  const midScrub = await page.evaluate(async () => {
    const sc = document.getElementById('scrubber');
    const wrap = document.getElementById('charts-wrapper');
    const samples = [];
    const base = sc.scrollLeft;
    for (let k = 1; k <= 5; k++) {
      sc.scrollLeft = base + k * 37;                       // 指で動かしている想定
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      samples.push({
        dScroll: Math.abs(sc.scrollLeft - chartOffset),
        dLine: Math.abs(parseFloat(document.getElementById('scrub-line').style.left)
                      - parseFloat(document.getElementById('scrubber-center').style.left)),
      });
    }
    return samples;
  });

  // 末尾までスクロール → 最後の時刻が選ばれ、空白が出ないこと
  await page.evaluate(() => {
    const s = document.getElementById('scrubber');
    s.scrollLeft = s.scrollWidth - s.clientWidth;
  });
  await page.waitForTimeout(700);
  const atEnd = await page.evaluate(() => {
    const max = chartMaxOffset();
    return {
      idx: state.sliderIndex,
      lastIdx: HOURS - 1,
      // 末尾の時刻の画面x。空白が無いので右端付近に来る（14%固定ではない）
      lastX: indexScreenX(HOURS - 1),
      viewW,
      // データの右端が画面の右端に達している＝空白なし
      contentRight: document.getElementById('charts-inner').getBoundingClientRect().width - max,
      lineX: parseFloat(document.getElementById('scrub-line').style.left),
      markX: parseFloat(document.getElementById('scrubber-center').style.left),
    };
  });

  // 先頭までスクロール → 最初の時刻が選ばれ、選択線は左寄りに来ること
  await page.evaluate(() => { document.getElementById('scrubber').scrollLeft = 0; });
  await page.waitForTimeout(700);
  const atStart = await page.evaluate(() => ({
    idx: state.sliderIndex,
    firstX: indexScreenX(0),
    viewW,
    lineX: parseFloat(document.getElementById('scrub-line').style.left),
    markX: parseFloat(document.getElementById('scrubber-center').style.left),
  }));

  // 「現在」ボタンで現在時刻へ戻る。
  // 帯をなぞった直後に押すと、チャートだけをsmoothスクロールしていたせいで
  // 帯のscrollイベントが「なぞり」と誤検出され、元の位置へ引き戻されていた（回帰テスト）
  await page.click('#btn-now');
  await page.waitForTimeout(900);
  const afterNow = await page.evaluate(() => {
    const sc = document.getElementById('scrubber');
    // 現在時刻を選んだときに本来あるべき位置を解き直して比較する
    const idxNow = Math.round(nowIndexFrac());
    const max = chartMaxOffset();
    let want = Math.max(0, Math.min(max, idxToX(idxNow) - viewW * SCRUB_POS));
    for (let k = 0; k < 6; k++) want = Math.max(0, Math.min(max, idxToX(idxNow) - cursorX(want)));
    return {
      idx: state.sliderIndex,
      nowRound: idxNow,
      btnNow: document.getElementById('btn-now').style.display,
      // 上下が同じ位置に着地し、そこに留まっていること
      dScroll: Math.abs(chartOffset - sc.scrollLeft),
      dTarget: Math.abs(chartOffset - want),
      dLine: Math.abs(parseFloat(document.getElementById('scrub-line').style.left)
                    - parseFloat(document.getElementById('scrubber-center').style.left)),
    };
  });

  // 画面をタッチして指を離しても、評価ポップアップがその場に留まること
  await page.touchscreen.tap(300, 300);
  await page.waitForTimeout(400);
  const popup = await page.evaluate(() => {
    const pop = document.getElementById('scrub-popup');
    const outer = document.getElementById('charts-outer').getBoundingClientRect();
    const r = pop.getBoundingClientRect();
    return {
      left: r.left,
      // 既定位置（左から13%）へ戻っていないこと
      homeLeft: outer.left + outer.width * 0.13,
      opacity: getComputedStyle(pop).backgroundColor,
    };
  });

  await page.screenshot({ path: __dirname + '/smoke_hscroll.png' });
  await browser.close();

  console.log(JSON.stringify({ init, afterScroll, midScrub, atEnd, atStart, afterNow, popup, errors }, null, 2));
  const ok = errors.length === 0 &&
    init.hasHScroll && init.innerCanvases === 4 && init.hasGutter &&
    init.idx === Math.floor(init.nowFrac) && init.btnNow === 'none' &&
    init.hoursOnScreen >= 22 && init.hoursOnScreen <= 26 &&
    init.scrubScrollable && init.hasScrubCanvas &&
    init.scrollMatched && init.widthMatched &&
    afterScroll.idx === 120 && afterScroll.scrollMatched &&
    // 中間では選択線は画面のど真ん中
    Math.abs(afterScroll.lineX - 390 / 2) < 1 &&
    Math.abs(afterScroll.lineX - afterScroll.markX) < 0.5 &&
    afterScroll.btnNow === 'block' &&
    // なぞり中もチャートと帯のスクロール量・上下の選択線が一致し続ける
    midScrub.every(x => x.dScroll < 1.5 && x.dLine < 0.5) &&
    init.padL === 0 && init.padR === 0 &&
    // 末尾：最後の時刻が選べ、選択線は右寄りに来て、空白が残らない
    atEnd.idx === atEnd.lastIdx &&
    atEnd.lastX > atEnd.viewW * 0.5 && atEnd.lastX < atEnd.viewW &&
    Math.abs(atEnd.contentRight - atEnd.viewW) < 1.5 &&
    Math.abs(atEnd.lineX - atEnd.markX) < 0.5 &&
    // 先頭：最初の時刻が選べ、選択線は左寄りに来る（中央固定だと届かない範囲を救う）
    atStart.idx === 0 && atStart.firstX < atStart.viewW * 0.4 && atStart.firstX > 0 &&
    Math.abs(atStart.lineX - atStart.markX) < 0.5 &&
    afterNow.idx === afterNow.nowRound && afterNow.btnNow === 'none' &&
    // 「現在」で上下とも本来の位置へ着地し、引き戻されないこと
    afterNow.dScroll < 1.5 && afterNow.dTarget < 2 && afterNow.dLine < 0.5 &&
    // タッチ後のポップアップが既定位置へ戻っていないこと
    Math.abs(popup.left - popup.homeLeft) > 20;
  console.log(ok ? 'HSCROLL SMOKE PASSED' : 'HSCROLL SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
