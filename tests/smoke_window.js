// 表示ウィンドウ（実績72h＋現在＋予報168h＝241点）+ 日タブ削除の検証
const { chromium } = require('playwright-core');
const fs = require('fs');
const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');

function pad(n) { return String(n).padStart(2, '0'); }
// past_days=1 + forecast_days=4 = 120h。先頭は昨日0時
function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {   // 過去3日＋先9日ぶん（アプリの取得範囲と同じ）
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(10 + 8 * Math.sin(i / 10)); h.apparent_temperature.push(8);
    h.precipitation.push(i % 20 < 3 ? 2 : 0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3 + 6 * Math.abs(Math.sin(i / 8)));
    h.winddirection_10m.push((i * 30) % 360); h.weathercode.push(2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
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
      // 実績+予報の固定表示なので、先頭はPAST_HOURS(72h)前・選択位置は現在
      firstIsPast72: Math.round((nowH - state.allData[0].time) / 3600e3) === 72,
      selectedIsNow: state.allData[state.sliderIndex].getHours === undefined
        ? state.allData[state.sliderIndex].time.getHours() === nowH.getHours() : false,
      rangeToggleGone: document.getElementById('range-toggle') === null,
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
  // 日付バッジと祝日判定（表示範囲に祝日が入らないので関数を直接叩いて検証）
  const hol = await page.evaluate(() => {
    const badge = document.getElementById('date-badge');
    const cls = () => [...badge.classList].sort().join(',');
    // 選択中の時刻を差し替えてバッジの色分けを確認する
    const probe = (y, m, d) => {
      const keep = state.allData[state.sliderIndex].time;
      state.allData[state.sliderIndex].time = new Date(y, m - 1, d, 12);
      updateDateBadge();
      const r = { text: document.getElementById('date-main').textContent,
                  holText: document.getElementById('date-holiday').textContent, cls: cls() };
      state.allData[state.sliderIndex].time = keep;
      updateDateBadge();
      return r;
    };
    return {
      names: {
        umi:      jpHoliday(new Date(2026, 6, 20)),   // 海の日（7月第3月曜）
        yama:     jpHoliday(new Date(2026, 7, 11)),   // 山の日
        shunbun:  jpHoliday(new Date(2026, 2, 20)),   // 春分の日（近似式）
        furikae:  jpHoliday(new Date(2026, 4, 6)),    // 振替休日（5/3が日曜）
        kokumin:  jpHoliday(new Date(2026, 8, 22)),   // 国民の休日
        heijitsu: jpHoliday(new Date(2026, 6, 23)),   // ただの平日
      },
      badgeHoliday: probe(2026, 8, 11),   // 山の日（火）→ 祝日として赤
      badgeSunday:  probe(2026, 7, 26),   // 日曜 → 赤
      badgeSat:     probe(2026, 7, 25),   // 土曜 → 青
      badgeWeekday: probe(2026, 7, 23),   // 平日 → 通常色
    };
  });

  await page.screenshot({ path: __dirname + '/smoke_window.png' });
  await browser.close();

  console.log(JSON.stringify({ r, hol, errors }, null, 2));
  const ok = errors.length === 0 && r.dayTabsGone && r.len === 241 &&
    r.firstIsPast72 && r.selectedIsNow && r.rangeToggleGone &&
    r.spanHours === 240 && r.sliderIdx === 72 &&
    r.hoursVal === 241 && r.nowFrac != null &&
    // 祝日名（ハッピーマンデー・固定日・春分の近似式・振替休日・国民の休日）
    hol.names.umi === '海の日' && hol.names.yama === '山の日' &&
    hol.names.shunbun === '春分の日' && hol.names.furikae === '振替休日' &&
    hol.names.kokumin === '国民の休日' && hol.names.heijitsu === null &&
    // バッジの表記と色分け
    hol.badgeHoliday.text === '8月11日(火)' && hol.badgeHoliday.holText === '（山の日）' &&
    hol.badgeHoliday.cls === 'holiday' &&
    hol.badgeSunday.cls === 'sun' && hol.badgeSat.cls === 'sat' &&
    hol.badgeWeekday.cls === '' && hol.badgeWeekday.holText === '';
  console.log(ok ? 'WINDOW SMOKE PASSED' : 'WINDOW SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
