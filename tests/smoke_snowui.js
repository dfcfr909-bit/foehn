// 新雪ランキングのUI検証
//   ・ランキングオーバーレイに「指数 / 新雪」のタブが増え、既存の指数タブが壊れていないこと
//   ・新雪タブを開くとランキング形式（カードではなく順位つきの行）で並ぶこと
//   ・resort / bc のタグとフィルタ切り替えが効くこと
//   ・信頼度lowの行が視覚的に区別されること
//   ・spots.json が未生成のときに「何をすればいいか」が出ること
//   ・既存のABC評価（judgePoint/THRESH/abcScore）に手が入っていないこと
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

// 生成済み spots.json の代わり（このテストではビルド結果に依存しない）
const SPOTS = {
  generatedAt: '2026-01-20T00:00:00.000Z',
  spots: [
    { id: 'kagura', name: 'かぐら', area: '上越', type: 'resort', lat: 36.86, lon: 138.83, elevation: 1845 },
    { id: 'tairappyo', name: '平標山', area: '上越', type: 'bc', lat: 36.812, lon: 138.858, elevation: 1984 },
    { id: 'zao', name: '蔵王温泉', area: '山形', type: 'resort', lat: 38.16, lon: 140.44, elevation: 1660 },
    { id: 'shibutsu', name: '至仏山', area: '尾瀬', type: 'bc', lat: 36.903, lon: 139.174, elevation: 2228 },
    // 八甲田は高標高アメダス（酸ケ湯890m）が至近にあるので信頼度highになる
    { id: 'hakkoda', name: '八甲田 大岳', area: '青森', type: 'bc', lat: 40.659, lon: 140.878, elevation: 1585 },
  ],
};
const TABLE = {
  '54012': { kjName: '湯沢', lat: [36, 56.0], lon: [138, 49.0], alt: 340 },
  '35426': { kjName: '山形', lat: [38, 15.0], lon: [140, 20.0], alt: 153 },
  '31312': { kjName: '酸ケ湯', lat: [40, 39.0], lon: [140, 51.0], alt: 890 },
};
const AMEDAS_MAP = {
  '54012': { snow: [180, 0], snow24h: [24, 0] },
  '35426': { snow: [40, 0], snow24h: [8, 0] },
  '31312': { snow: [320, 0], snow24h: [40, 0] },
};

// past_days=2 / forecast_days=2 と同じ4日ぶん
function hourlyFor(mmPerHour, tempC, windMs) {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 2);
  const h = { time: [], snowfall: [], precipitation: [], temperature_2m: [], wind_speed_10m: [], wind_direction_10m: [] };
  for (let i = 0; i < 96; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.snowfall.push(mmPerHour > 0 ? mmPerHour * 0.7 : 0);
    h.precipitation.push(mmPerHour);
    h.temperature_2m.push(tempC);
    h.wind_speed_10m.push(windMs);
    h.wind_direction_10m.push(315);
  }
  return h;
}
// 平標(パウダー・強風) > かぐら > 至仏 > 蔵王 の順になるように置く
const PROFILE = [
  hourlyFor(2.0, -6, 8),     // かぐら
  hourlyFor(2.5, -12, 18),   // 平標（強風警告が出る）
  hourlyFor(0.6, -2, 5),     // 蔵王
  hourlyFor(1.2, -8, 7),     // 至仏
  hourlyFor(1.0, -7, 6),     // 八甲田
];

function fakeWeather() {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [], surface_pressure: [], windspeed_10m: [], winddirection_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.temperature_2m.push(-5); h.apparent_temperature.push(-9);
    h.precipitation.push(0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(4);
    h.winddirection_10m.push(180); h.weathercode.push(2); h.cloudcover.push(40);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const s = `${b.getFullYear()}-${p2(b.getMonth() + 1)}-${p2(b.getDate())}`;
    daily.time.push(s); daily.sunrise.push(s + 'T04:40'); daily.sunset.push(s + 'T19:00');
  }
  return { hourly: h, daily };
}

(async () => {
  const fails = [];
  const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };

  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => { errors.push('dialog: ' + d.message()); d.dismiss(); });

  let spotsMissing = false;      // spots.json を404にするモード
  let snowReqs = 0;
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('data/spots.json')) {
      if (spotsMissing) return route.fulfill({ status: 404, body: 'not found' });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(SPOTS) });
    }
    if (url.includes('jma.go.jp')) {
      snowReqs++;
      if (url.includes('latest_time.txt')) {
        const d = new Date();
        return route.fulfill({ contentType: 'text/plain',
          body: `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:10:00+09:00` });
      }
      if (url.includes('amedastable.json')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(TABLE) });
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(AMEDAS_MAP) });
    }
    if (url.includes('api.open-meteo.com')) {
      // 新雪ランキングのリクエストは models=jma_seamless かつ snowfall を含む複数座標
      if (url.includes('snowfall') && url.includes('wind_speed_unit=ms') && url.includes('past_days=2')) {
        snowReqs++;
        const n = new URL(url).searchParams.get('latitude').split(',').length;
        const out = [];
        for (let i = 0; i < n; i++) out.push({ hourly: PROFILE[i] || hourlyFor(0.5, -3, 4) });
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(out) });
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    }
    return route.abort();
  });
  await page.addInitScript(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
  });
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1500);

  // --- 1. 既存の指数ランキングが壊れていないこと ---
  await page.click('#btn-rank');
  await page.waitForTimeout(1200);
  const indexTab = await page.evaluate(() => ({
    open: document.getElementById('rank-overlay').classList.contains('open'),
    tabs: [...document.querySelectorAll('.rank-tab')].map(b => b.dataset.tab),
    activeTab: document.querySelector('.rank-tab.active').dataset.tab,
    indexPaneVisible: getComputedStyle(document.getElementById('rank-pane-index')).display !== 'none',
    snowPaneVisible: getComputedStyle(document.getElementById('rank-pane-snow')).display !== 'none',
    rankCards: document.querySelectorAll('.rank-card').length,
    dateBtns: document.querySelectorAll('.rank-date-btn').length,
  }));
  ok(indexTab.open, 'ランキングが開く');
  ok(JSON.stringify(indexTab.tabs) === JSON.stringify(['index', 'snow']), 'タブは指数と新雪', indexTab.tabs);
  ok(indexTab.activeTab === 'index', '初期は指数タブ');
  ok(indexTab.indexPaneVisible && !indexTab.snowPaneVisible, '指数タブだけ見えている');
  ok(indexTab.rankCards > 0, '既存の指数ランキングが従来どおり出る', indexTab.rankCards);
  ok(indexTab.dateBtns === 3, '既存の日付ボタンが残っている', indexTab.dateBtns);

  // --- 2. 新雪タブ ---
  await page.click('.rank-tab[data-tab="snow"]');
  await page.waitForTimeout(1500);
  const snow = await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.snow-row')];
    return {
      indexPaneVisible: getComputedStyle(document.getElementById('rank-pane-index')).display !== 'none',
      count: rows.length,
      names: rows.map(r => r.querySelector('.snow-name').textContent),
      positions: rows.map(r => r.querySelector('.snow-pos').textContent),
      totals: rows.map(r => parseFloat(r.querySelector('.snow-total b').textContent)),
      tags: rows.map(r => r.querySelector('.snow-tag').textContent),
      confs: rows.map(r => [...r.classList].find(c => c.startsWith('conf-'))),
      // 信頼度lowは淡くする
      lowOpacity: (() => {
        const low = rows.find(r => r.classList.contains('conf-low'));
        return low ? Number(getComputedStyle(low).opacity) : null;
      })(),
      highOpacity: (() => {
        const hi = rows.find(r => !r.classList.contains('conf-low'));
        return hi ? Number(getComputedStyle(hi).opacity) : null;
      })(),
      hasWarn: rows.some(r => r.querySelector('.snow-cond .warn')),
      condText: rows.map(r => r.querySelector('.snow-cond').textContent.replace(/\s+/g, ' ').trim()),
      srcText: rows.map(r => r.querySelector('.snow-src').textContent.replace(/\s+/g, ' ').trim()),
      splitText: rows.map(r => r.querySelector('.snow-split').textContent.replace(/\s+/g, ' ').trim()),
      overflow: document.getElementById('rank-overlay').scrollWidth
              - document.getElementById('rank-overlay').clientWidth,
    };
  });
  ok(!snow.indexPaneVisible, '新雪タブに切り替わると指数タブは隠れる');
  ok(snow.count === 5, '5地点ぶんの行が出る', snow.count);
  ok(snow.names[0] === '平標山', '1位は平標山（降水多×パウダー）', snow.names);
  ok(JSON.stringify(snow.positions) === JSON.stringify(['1','2','3','4','5']), '順位が振られる', snow.positions);
  for (let i = 1; i < snow.totals.length; i++) {
    ok(snow.totals[i - 1] >= snow.totals[i], '合計cmの降順に並ぶ', snow.totals);
  }
  ok(snow.tags.includes('BC') && snow.tags.includes('ゲレンデ'), 'resort/bcのタグが出る', snow.tags);
  ok(snow.confs.some(c => c === 'conf-low'), '信頼度lowの行がある', snow.confs);
  ok(snow.lowOpacity !== null && snow.lowOpacity < 0.8, 'lowは淡く表示される', snow.lowOpacity);
  ok(snow.highOpacity === 1, 'low以外は淡くしない', snow.highOpacity);
  ok(snow.hasWarn, '15m/s超に強風警告が付く');
  ok(/SLR\d+/.test(snow.condText.join(' ')), 'SLRの数値が出る', snow.condText[0]);
  ok(/パウダー|標準|湿雪/.test(snow.condText.join(' ')), 'SLRのラベルも併記される', snow.condText[0]);
  ok(/℃/.test(snow.condText.join(' ')), '平均気温が出る');
  ok(/24h .*cm/.test(snow.splitText[0]) && /12h .*cm/.test(snow.splitText[0]),
    '直近24hと予想12hを分けて出す', snow.splitText[0]);
  ok(/基準 .*km/.test(snow.srcText.join(' ')), '補正基準点と距離が出る', snow.srcText[0]);
  ok(/信頼度 (高|中|低)/.test(snow.srcText.join(' ')), '信頼度が言葉で出る', snow.srcText[0]);
  ok(snow.overflow === 0, '横にはみ出さない', snow.overflow);
  // 通信は アメダス3（latest_time/地点表/map）＋ Open-Meteo1
  ok(snowReqs === 4, '通信回数は地点数に依存しない（4回）', snowReqs);

  // --- 3. フィルタ ---
  await page.click('.snow-filter-btn[data-filter="bc"]');
  await page.waitForTimeout(300);
  const bcOnly = await page.evaluate(() => ({
    tags: [...document.querySelectorAll('.snow-row .snow-tag')].map(t => t.textContent),
    positions: [...document.querySelectorAll('.snow-row .snow-pos')].map(t => t.textContent),
  }));
  ok(bcOnly.tags.length === 3 && bcOnly.tags.every(t => t === 'BC'), 'BCのみに絞れる', bcOnly.tags);
  ok(JSON.stringify(bcOnly.positions) === JSON.stringify(['1','2','3']), '絞ったあとも順位は振り直す', bcOnly.positions);

  await page.click('.snow-filter-btn[data-filter="resort"]');
  await page.waitForTimeout(300);
  const resortOnly = await page.evaluate(() =>
    [...document.querySelectorAll('.snow-row .snow-tag')].map(t => t.textContent));
  ok(resortOnly.length === 2 && resortOnly.every(t => t === 'ゲレンデ'), 'ゲレンデのみに絞れる', resortOnly);

  await page.click('.snow-filter-btn[data-filter="all"]');
  await page.waitForTimeout(300);
  const all = await page.evaluate(() => document.querySelectorAll('.snow-row').length);
  ok(all === 5, '全部に戻せる', all);

  // 再取得していない（フィルタは手元の結果を並べ替えるだけ）
  ok(snowReqs === 4, 'フィルタ切り替えで再取得しない', snowReqs);

  await page.screenshot({ path: __dirname + '/smoke_snowui.png' });

  // --- 4. spots.json が未生成のとき ---
  spotsMissing = true;
  const page2 = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page2.on('pageerror', e => errors.push('p2: ' + e.message));
  page2.on('dialog', d => d.dismiss());
  await page2.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.endsWith('/snowRanking.js')) return route.fulfill({ contentType: 'application/javascript', body: ENGINE });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.endsWith('areas.json')) return route.fulfill({ contentType: 'application/json', body: AREAS });
    if (url.includes('data/spots.json')) return route.fulfill({ status: 404, body: 'not found' });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    return route.abort();
  });
  await page2.addInitScript(() => {
    localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.57, lon: 137.65, name: '立山・黒部' }));
  });
  await page2.goto('https://sotoki.test/');
  await page2.waitForTimeout(1200);
  await page2.click('#btn-rank');
  await page2.click('.rank-tab[data-tab="snow"]');
  await page2.waitForTimeout(800);
  const missing = await page2.evaluate(() => document.getElementById('snow-list').textContent.replace(/\s+/g, ' ').trim());
  ok(/buildSpots\.mjs/.test(missing), 'spots.json未生成なら次にやることを出す', missing);

  // --- 5. 既存のABC評価に手を入れていない ---
  const stripComments = s => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const engineCode = stripComments(ENGINE);
  for (const name of ['judgePoint', 'abcScore', 'abcScoreInv', 'THRESH']) {
    ok(!new RegExp(`\\b${name}\\b`).test(engineCode), `snowRanking.js は ${name} を参照しない`);
  }

  await browser.close();
  if (errors.length) fails.push('ページエラー: ' + errors.join(' / '));
  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('SNOWUI SMOKE FAILED');
    process.exit(1);
  }
  console.log(JSON.stringify({ snow, snowReqs }, null, 2));
  console.log('SNOWUI SMOKE PASSED');
})();
