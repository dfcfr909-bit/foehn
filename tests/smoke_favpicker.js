// お気に入り円柱ピッカーの検証
//   ・駒が円柱の側面（1つ=FAV_ANGLE deg）に並び、横の広がりが半径FAV_R以内に収まること
//   ・正面の駒だけが .centered になること
//   ・円柱を回すと正面の駒が変わり、止めると地点が確定すること
//   ・地点確定でDOMが作り直されないこと（引っかかりの原因だったため）
//   ・独立バーを廃してヘッダーに同居していること（省スペース）
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
    h.temperature_2m.push(10); h.apparent_temperature.push(8);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(4);
    h.winddirection_10m.push(180); h.weathercode.push(0); h.cloudcover.push(40);
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
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
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
  // お気に入り4件を仕込み、2番目を現在地点として起動する
  await page.addInitScript(() => {
    localStorage.setItem('sotoki_favs', JSON.stringify([
      { name: '白馬岳',   lat: 36.7583, lon: 137.7583 },
      { name: '立山・黒部', lat: 36.5700, lon: 137.6500 },
      { name: '槍ヶ岳',   lat: 36.3417, lon: 137.6478 },
      { name: '穂高岳',   lat: 36.2892, lon: 137.6478 },
    ]));
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
  });
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1200);

  // 初期状態：4駒が並び、選択中の「立山・黒部」（index=1）が正面
  const init = await page.evaluate(() => {
    const el = document.getElementById('fav-rotary');
    const stage = document.getElementById('fav-stage');
    const chips = Array.from(stage.querySelectorAll('.fav-chip'));
    const ang = c => parseFloat((c.style.transform.match(/rotateY\((-?[\d.]+)deg\)/) || [0, NaN])[1]);
    const tx  = c => parseFloat((c.style.transform.match(/translate3d\((-?[\d.]+)px/) || [0, NaN])[1]);
    return {
      count: chips.length,
      centered: chips.filter(c => c.classList.contains('centered')).map(c => c.dataset.name),
      scrollLeft: el.scrollLeft,
      hasPerspective: getComputedStyle(stage).perspective !== 'none',
      // stickyな舞台の上に絶対配置されていること（スクロールしても位置が変わらない層）
      stagePosition: getComputedStyle(stage).position,
      // 表示中の駒だけを見る（円柱の裏側・枠外の駒は display:none で消える）
      shown: chips.filter(c => c.style.display !== 'none').map(c => ({
        name: c.dataset.name, angle: ang(c), x: tx(c),
      })),
      hiddenCount: chips.filter(c => c.style.display === 'none').length,
      // 円柱なので横方向の広がりは半径(FAV_R)以内に収まる＝場所を取らない
      maxAbsX: Math.max(...chips.filter(c => c.style.display !== 'none').map(c => Math.abs(tx(c)))),
      favR: FAV_R,
      favAngle: FAV_ANGLE,
      opacities: chips.map(c => Number(c.style.opacity)),
      // 独立バーは廃止し、ヘッダーに同居させた（省スペース化の確認）
      favBarGone: document.getElementById('fav-bar') === null,
      headerH: document.getElementById('header').getBoundingClientRect().height,
      inHeader: document.getElementById('header').contains(el),
      // 日付はヘッダー左上。凡例はスクラバー帯より後ろ（＝下段）に移した
      dateInHeader: document.getElementById('header').contains(document.getElementById('date-badge')),
      legendBelow: !!(document.getElementById('time-scroll').compareDocumentPosition(
        document.getElementById('legend')) & Node.DOCUMENT_POSITION_FOLLOWING),
      // 円柱は日付＋時刻と★を置いた残りを使い、右端（★の手前）に寄っている
      rotaryFrac: el.getBoundingClientRect().width / window.innerWidth,
      rotaryRightGap: window.innerWidth - el.getBoundingClientRect().right,
      // ヘッダーがはみ出していないこと（日付を大きくしたので幅が競合しやすい）
      headerOverflow: document.getElementById('header').scrollWidth
                    - document.getElementById('header').clientWidth,
      // バージョンは下段（凡例行）の右端にある
      versionInLegend: document.getElementById('legend')
                        .contains(document.getElementById('app-version')),
      versionRightmost: (() => {
        const v = document.getElementById('app-version').getBoundingClientRect();
        const l = document.getElementById('legend').getBoundingClientRect();
        return l.right - v.right < 16;      // 行の右端に寄っている
      })(),
      // ★は日付・時刻と同じ塊の中（時刻の右）。「現在」はヘッダー右端へ移した
      starInBadge: document.getElementById('date-badge')
                     .contains(document.getElementById('btn-fav-star')),
      starRightOfTime: document.getElementById('btn-fav-star').getBoundingClientRect().left
                     >= document.getElementById('date-time').getBoundingClientRect().right - 1,
      nowInHeader: document.getElementById('header')
                     .contains(document.getElementById('btn-now')),
      // 日付の隣に選択時刻が出ている
      dateText: document.getElementById('date-main').textContent,
      timeText: document.getElementById('date-time').textContent,
    };
  });

  // 円柱を回す：槍ヶ岳（index=2）が正面に来る位置までスクロールし、確定を待つ
  await page.evaluate(() => {
    window.__firstChip = document.querySelector('#fav-stage .fav-chip');
    document.getElementById('fav-rotary').scrollLeft = 2 * FAV_STEP;
  });
  await page.waitForTimeout(1400);

  const after = await page.evaluate(() => {
    const chips = Array.from(document.querySelectorAll('#fav-stage .fav-chip'));
    return {
      centered: chips.filter(c => c.classList.contains('centered')).map(c => c.dataset.name),
      locationName: state.locationName,
      lat: state.lat,
      // 選択確定でDOMが作り直されていないこと（同一ノードが残っている）
      domReused: document.querySelector('#fav-stage .fav-chip') === window.__firstChip,
      count: chips.length,
    };
  });

  await page.screenshot({ path: __dirname + '/smoke_favpicker.png' });
  await browser.close();

  const front = init.shown.find(c => c.name === '立山・黒部');   // 正面の駒
  const side  = init.shown.find(c => c.name === '槍ヶ岳');       // 1つ隣の駒
  const centerAngle = front ? Math.abs(front.angle) : 999;
  const edgeAngle   = side  ? Math.abs(side.angle)  : 0;

  console.log(JSON.stringify({ init, after, centerAngle, edgeAngle, errors }, null, 2));
  const ok = errors.length === 0 &&
    init.count === 4 && init.hasPerspective && init.stagePosition === 'sticky' &&
    init.centered.length === 1 && init.centered[0] === '立山・黒部' &&
    centerAngle < 1 && Math.abs(edgeAngle - init.favAngle) < 1 &&   // 駒1つ=FAV_ANGLEで回る円柱
    init.hiddenCount >= 1 &&                                 // 裏側/枠外の駒は消えている
    init.maxAbsX <= init.favR + 0.5 &&                       // 横の広がりが半径以内
    Math.max(...init.opacities) - Math.min(...init.opacities) > 0.1 &&
    init.favBarGone && init.inHeader && init.headerH < 56 &&  // ヘッダー同居で省スペース化
    init.dateInHeader && init.legendBelow &&                  // 日付は上・凡例は下段
    init.rotaryFrac > 0.28 && init.headerOverflow === 0 &&    // 残り幅を使い、はみ出さない
    init.versionInLegend && init.versionRightmost &&           // バージョンは下段の右端
    init.starInBadge && init.starRightOfTime && init.nowInHeader &&   // ★は時刻の右、現在はヘッダー
    /^\d+月\d+日\(.\)$/.test(init.dateText) &&               // 日付
    /^\d{2}:00$/.test(init.timeText) &&                       // その隣に選択時刻
    init.rotaryRightGap < 80 &&                               // 右端寄せ（★＋バージョンの列ぶんだけ空く）
    after.centered.length === 1 && after.centered[0] === '槍ヶ岳' &&
    after.locationName === '槍ヶ岳' && Math.abs(after.lat - 36.3417) < 1e-3 &&
    after.domReused && after.count === 4;
  console.log(ok ? 'FAVPICKER SMOKE PASSED' : 'FAVPICKER SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
