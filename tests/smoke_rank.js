// ランキング機能スモークテスト: areas.json + Open-Meteo一括取得をスタブして検証
const { chromium } = require('playwright-core');
const fs = require('fs');

const HTML = fs.readFileSync(require('path').join(__dirname,'..','sotoki_v4.html'), 'utf8');
const AREAS = fs.readFileSync(require('path').join(__dirname,'..','areas.json'), 'utf8');
const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');

// 96h（メイン画面用）
function fakeMainWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 1);
  for (let i = 0; i < 96; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:00`);
    h.temperature_2m.push(10); h.apparent_temperature.push(8); h.precipitation.push(0);
    h.snowfall.push(0); h.surface_pressure.push(1013); h.windspeed_10m.push(3);
    h.weathercode.push(2); h.cloudcover.push(50);
  }
  return { hourly: h };
}

// ランキング用バッチ: forecast_days方式。峰indexごとに風速を変える
function fakeBatch(url) {
  const u = new URL(url);
  const nLoc = u.searchParams.get('latitude').split(',').length;
  const fdays = parseInt(u.searchParams.get('forecast_days') || '4');
  const start = new Date(); start.setHours(0, 0, 0, 0);   // 今日0時から
  const hours = fdays * 24;
  const out = [];
  for (let p = 0; p < nLoc; p++) {
    if (p === 5) { out.push({ error: true }); continue; }  // 1峰を失敗させ判定不能表示を検証
    const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], weathercode: [], cloudcover: [] };
    for (let i = 0; i < hours; i++) {
      const d = new Date(start.getTime() + i * 3600e3);
      h.time.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}T${String(d.getHours()).padStart(2,'0')}:00`);
      h.temperature_2m.push(15 - p * 0.3);
      h.apparent_temperature.push(13 - p * 0.3);
      h.precipitation.push(p % 7 === 0 ? 2 : 0);
      h.snowfall.push(0);
      h.surface_pressure.push(1013);
      h.windspeed_10m.push(2 + (p % 13));   // 峰ごとに風速差 → A/B/C分布
      h.weathercode.push(2);
      h.cloudcover.push(40);
    }
    out.push({ hourly: h });
  }
  return out;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));

  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) {
      if (url.includes('elevation=')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeBatch(url)) });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeMainWeather()) });
    }
    return route.abort();
  });

  await page.addInitScript(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: 'テスト地点' }));
  });

  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(800);

  // ランキングを開く（デフォルト=今週末）
  await page.click('#btn-rank');
  await page.waitForTimeout(800);

  const rankState = await page.evaluate(() => ({
    overlayOpen: document.getElementById('rank-overlay').classList.contains('open'),
    cardCount: document.querySelectorAll('.rank-card').length,
    badgesFirst: document.querySelector('.rank-card .rank-badges').textContent.trim(),
    firstArea: document.querySelector('.rank-card .rn-main').textContent,
    lastArea: [...document.querySelectorAll('.rank-card .rn-main')].pop().textContent,
    dates: rankDates,
    hasUnjudgeable: document.body.innerHTML.includes('判定不能'),
    badgeCols: document.querySelector('.rank-card .rank-badges').querySelectorAll('.rank-badge').length,
  }));

  // 先頭カードを展開
  await page.click('.rank-card .rank-card-head');
  await page.waitForTimeout(200);
  const expanded = await page.evaluate(() => ({
    open: document.querySelector('.rank-card').classList.contains('open'),
    peakRows: document.querySelector('.rank-card.open .rank-detail').querySelectorAll('tr').length - 1,
    firstPeak: document.querySelector('.rank-card.open .peak-link').textContent,
  }));
  await page.screenshot({ path: __dirname + '/smoke_rank.png' });

  // 「明日」= 単日1列
  await page.click('.rank-date-btn[data-kind="tomorrow"]');
  await page.waitForTimeout(600);
  const tomorrow = await page.evaluate(() => ({
    badgeCols: document.querySelector('.rank-card .rank-badges').querySelectorAll('.rank-badge').length,
    dates: rankDates,
  }));

  // 峰タップ → メテオグラム遷移
  await page.click('.rank-card .rank-card-head');
  await page.waitForTimeout(200);
  const peakName = await page.evaluate(() => document.querySelector('.rank-card.open .peak-link').textContent);
  await page.click('.rank-card.open .peak-link');
  await page.waitForTimeout(800);
  const afterJump = await page.evaluate(() => ({
    overlayOpen: document.getElementById('rank-overlay').classList.contains('open'),
    locationName: state.locationName,
    chartCanvases: document.querySelectorAll('#charts-inner canvas').length,
  }));

  await browser.close();
  console.log(JSON.stringify({ rankState, expanded, tomorrow, peakName, afterJump, errors }, null, 2));

  const ok = errors.length === 0 &&
    rankState.overlayOpen && rankState.cardCount === 20 && rankState.hasUnjudgeable &&
    expanded.open && expanded.peakRows >= 2 &&
    tomorrow.badgeCols === 1 &&
    !afterJump.overlayOpen && afterJump.locationName === peakName && afterJump.chartCanvases === 4;
  console.log(ok ? 'RANK SMOKE PASSED' : 'RANK SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
