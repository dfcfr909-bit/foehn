// 現在時刻〜+72h表示 + 日タブ削除の検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');

function pad(n) { return String(n).padStart(2, '0'); }
// past_days=1 + forecast_days=4 = 120h。先頭は昨日0時
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 1);
  for (let i = 0; i < 120; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10 + 8 * Math.sin(i / 10)); h.apparent_temperature.push(8);
    h.precipitation.push(i % 20 < 3 ? 2 : 0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3 + 6 * Math.abs(Math.sin(i / 8)));
    h.winddirection_10m.push((i * 30) % 360); h.weathercode.push(2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 5; dd++) {
    const base = new Date(start.getTime() + dd * 24 * 3600e3);
    const dstr = `${base.getFullYear()}-${pad(base.getMonth()+1)}-${pad(base.getDate())}`;
    daily.time.push(dstr); daily.sunrise.push(`${dstr}T04:40`); daily.sunset.push(`${dstr}T19:00`);
  }
  return { hourly: h, daily };
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
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

  const r = await page.evaluate(() => {
    const nowH = new Date(); nowH.setMinutes(0, 0, 0);
    return {
      dayTabsGone: document.getElementById('day-selector') === null && document.querySelectorAll('.day-tab').length === 0,
      len: state.allData.length,
      firstIsCurrentHour: state.allData[0].time.getHours() === nowH.getHours(),
      firstIso: state.allData[0].time.toISOString(),
      lastIso: state.allData[state.allData.length - 1].time.toISOString(),
      spanHours: Math.round((state.allData[state.allData.length-1].time - state.allData[0].time) / 3600e3),
      sliderIdx: state.sliderIndex,
      hoursVal: HOURS,
      nowFrac: nowIndexFrac(),
      badge: document.getElementById('pop-time').textContent,
      badge2: document.getElementById('pop-time').textContent,
    };
  });
  await page.screenshot({ path: __dirname + '/smoke_window.png' });
  await browser.close();

  console.log(JSON.stringify({ r, errors }, null, 2));
  const ok = errors.length === 0 && r.dayTabsGone && r.len === 73 &&
    r.firstIsCurrentHour && r.spanHours === 72 && r.sliderIdx === 0 &&
    r.hoursVal === 73 && r.nowFrac != null && r.nowFrac < 1;
  console.log(ok ? 'WINDOW SMOKE PASSED' : 'WINDOW SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
