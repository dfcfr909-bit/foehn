// 横スクロール（1日≒1画面）+ 選択線追従 + 現在ボタンの検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
function pad(n) { return String(n).padStart(2, '0'); }
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 1);
  for (let i = 0; i < 120; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10 + 8 * Math.sin(i / 10)); h.apparent_temperature.push(8);
    h.precipitation.push(i % 18 < 3 ? 3 : 0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3 + 8 * Math.abs(Math.sin(i / 8)));
    h.winddirection_10m.push((i * 30) % 360); h.weathercode.push(i % 6 < 3 ? 0 : 2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 5; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${pad(b.getMonth()+1)}-${pad(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily };
}
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
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
  await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1000);

  const init = await page.evaluate(() => {
    const wrap = document.getElementById('charts-wrapper');
    return {
      hasHScroll: wrap.scrollWidth > wrap.clientWidth + 5,          // 横スクロール可能
      innerCanvases: document.querySelectorAll("#charts-inner canvas").length,
      hasGutter: !!document.getElementById('axis-gutter'),
      idx: state.sliderIndex,          // 初期=現在（0）
      nowFrac: nowIndexFrac(),
      btnNow: document.getElementById('btn-now').style.display,
      hoursOnScreen: Math.round((wrap.clientWidth - 44 - 6) / (pxPerHourVal)), // ≒24
      pph: pxPerHourVal,
    };
  });

  // スライダーで選択時刻を進める → 選択indexが進み、現在ボタンが出る
  await page.evaluate(() => onTimeRangeInput(500));
  await page.waitForTimeout(300);
  const afterScroll = await page.evaluate(() => ({
    idx: state.sliderIndex,
    badge: document.getElementById('pop-time').textContent,
    btnNow: document.getElementById('btn-now').style.display,
    hud: document.getElementById('pop-time').textContent,
  }));

  // 「現在」ボタンで現在時刻へ戻る
  await page.click('#btn-now');
  await page.waitForTimeout(700);
  await page.waitForTimeout(200);
  const afterNow = await page.evaluate(() => ({
    idx: state.sliderIndex,
    nowRound: Math.round(nowIndexFrac()),
    btnNow: document.getElementById('btn-now').style.display,
  }));

  await page.screenshot({ path: __dirname + '/smoke_hscroll.png' });
  await browser.close();

  console.log(JSON.stringify({ init, afterScroll, afterNow, errors }, null, 2));
  const ok = errors.length === 0 &&
    init.hasHScroll && init.innerCanvases === 4 && init.hasGutter &&
    init.idx === 0 && init.btnNow === 'none' &&
    init.hoursOnScreen >= 22 && init.hoursOnScreen <= 26 &&
    afterScroll.idx > init.idx && afterScroll.btnNow === 'block' &&
    afterNow.idx === afterNow.nowRound && afterNow.btnNow === 'none';
  console.log(ok ? 'HSCROLL SMOKE PASSED' : 'HSCROLL SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
