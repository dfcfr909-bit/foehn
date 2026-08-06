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

  /* ★山域名タップ → その山域の代表峰へ飛ぶ（利用者の要望）。
     山域名は「峰の一覧を開く」動作と場所が近いので、
     **押しても展開しない**ことと**飛び先が代表峰＝いちばん良い判定の峰**であることを見る。 */
  const areaJump = await page.evaluate(async () => {
    const order = { A: 0, B: 1, C: 2 };
    // その山域でいちばん良い判定を出した峰（＝飛び先の正解）を、描かれている表から読む
    const bestOf = card => {
      let name = null, rank = 99, first = null;
      for (const tr of [...card.querySelectorAll('.rank-detail tr')].slice(1)) {
        const nm = tr.querySelector('.peak-link');
        if (nm && !first) first = nm.textContent;
        for (const g of tr.querySelectorAll('.pd-grade')) {
          const r = order[g.textContent.trim()];
          if (r != null && r < rank) { rank = r; name = nm ? nm.textContent : null; }
        }
      }
      return { name, first };
    };
    /* ⚠**「代表峰＝先頭の峰」でないカードを選ぶこと。**
       たまたま先頭が最良のカードで試すと、「先頭の峰へ飛ぶ」だけの実装でも通ってしまう
       （実際に素通りした）。差のあるカードが1枚も無ければ検査が成立しないので失敗させる。 */
    const cards = [...document.querySelectorAll('.rank-card')];
    const card = cards.find(c => {
      const b = bestOf(c);
      return b.name && b.first && b.name !== b.first;
    });
    if (!card) return { noDistinctCard: true, cards: cards.length };
    const want = bestOf(card);
    const link = card.querySelector('.rn-main .area-link');
    if (!link) return { missing: true };
    const openBefore = card.classList.contains('open');
    link.click();
    await new Promise(r => setTimeout(r, 900));
    return {
      linkName: link.textContent,
      wantName: want.name,
      firstPeak: want.first,
      // 山域名を押しただけで峰の一覧が開いてしまわないこと
      toggled: card.classList.contains('open') !== openBefore,
      overlayOpen: document.getElementById('rank-overlay').classList.contains('open'),
      locationName: state.locationName,
      lat: state.lat, lon: state.lon,
    };
  });

  // ランキングに戻して、以降の峰タップの検査を続ける
  await page.evaluate(() => openRank());
  await page.waitForTimeout(1500);

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
  console.log(JSON.stringify({ rankState, expanded, tomorrow, areaJump, peakName, afterJump, errors }, null, 2));
  if (areaJump.noDistinctCard) console.log('  ✗ 代表峰と先頭の峰が違うカードが無い（検査が成立しない）');
  if (areaJump.missing) console.log('  ✗ 山域名がリンクになっていない');
  if (areaJump.toggled) console.log('  ✗ 山域名を押すと峰の一覧が開いてしまう');
  if (areaJump.overlayOpen) console.log('  ✗ 山域名を押してもランキングが閉じない');
  if (areaJump.wantName && areaJump.locationName !== areaJump.wantName) {
    console.log(`  ✗ 飛び先が代表峰でない（${areaJump.locationName} ≠ ${areaJump.wantName}）`);
  }

  const ok = errors.length === 0 &&
    !areaJump.noDistinctCard && !areaJump.missing &&
    !areaJump.toggled && !areaJump.overlayOpen &&
    areaJump.locationName === areaJump.wantName &&
    rankState.overlayOpen && rankState.cardCount === 20 && rankState.hasUnjudgeable &&
    expanded.open && expanded.peakRows >= 2 &&
    tomorrow.badgeCols === 1 &&
    !afterJump.overlayOpen && afterJump.locationName === peakName && afterJump.chartCanvases === 4;
  console.log(ok ? 'RANK SMOKE PASSED' : 'RANK SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
