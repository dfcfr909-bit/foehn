/* 予報モデルの帯（v4.142.0・利用者の要望「今どのモデルの予報を使っているかを画面に出す」）。
 *   ①時刻ごとのモデルが MSM → 移行（5時間）→ GSM の順に付く（900/800hPa の風が null になる時刻で見る）
 *   ②気温パネルの最上端に帯が描かれ、区間ごとの色（青／橙／灰紫）になっている
 *   ③選択情報の窓に「モデル：…」が出る（風の但し書き #pop-windsrc とは別の行）
 *   ④判別できないとき（900/800hPa の列が無い）は「不明」と言い、MSM と言い張らない
 *   ⑤帯のぶん上の余白を広げても、気温の目盛り（左のガター）と本体の位置が揃っている
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };
const pad = n => String(n).padStart(2, '0');

ok(/drawModelBand\(u, pr\)/.test(HTML), '★帯は気温パネルの draw hook（drawTempOverlay）から描く');
ok(/SKY_TOP_PAD\s*=\s*46 \+ MODEL_BAND_H/.test(HTML), '★帯のぶん SKY_TOP_PAD を広げている（ガターと共有）');

const N = 288, FIRST_GSM = 200;   // 200 番目から 900/800hPa が null＝MSM が尽きた
function fakeWeather(withProbe) {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  if (withProbe) { h.wind_speed_900hPa = []; h.wind_speed_800hPa = []; }
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < N; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`);
    h.temperature_2m.push(5); h.apparent_temperature.push(5);
    h.precipitation.push(0); h.snowfall.push(0); h.surface_pressure.push(1013);
    h.windspeed_10m.push(1); h.winddirection_10m.push(270); h.windgusts_10m.push(2);
    h.weathercode.push(1); h.cloudcover.push(20);
    if (withProbe) {
      const v = i < FIRST_GSM ? 6 : null;
      h.wind_speed_900hPa.push(v); h.wind_speed_800hPa.push(v);
    }
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T05:30`); daily.sunset.push(`${ds}T17:30`);
  }
  return { hourly: h, daily, elevation: 800 };
}

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];
async function probe(withProbe) {
  const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(withProbe)) });
    return route.abort();
  });
  await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' })));
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(1300);
  const r = await page.evaluate(({ FIRST_GSM }) => {
    const data = state.allData;
    const models = data.map(d => d.model);
    const segs = modelBandSegments(data).map(s => ({ m: s.m, start: s.start, end: s.end }));
    // 帯の色。3時（正午＝文字の位置を避ける）の枠の左端から少し内側を読む
    const u = skyChart, cv = u.ctx.canvas, pr = cv.width / u.width;
    const img = u.ctx.getImageData(0, 0, cv.width, cv.height).data;
    const rgbAt = (idx) => {
      const x = Math.round(u.valToPos(idx - 0.5, 'x', true) + 3 * pr), y = Math.round(MODEL_BAND_H * pr / 2);
      const i = (y * cv.width + x) * 4; return [img[i], img[i + 1], img[i + 2]];
    };
    const at3 = (from, to) => { for (let i = from; i <= to; i++) if (data[i].time.getHours() === 3) return i; return from; };
    const colors = segs.map(s => ({ m: s.m, rgb: rgbAt(at3(s.start, s.end)) }));
    // 帯の下（日付ラベル・アイコンの領域）に帯の色が漏れていないか
    const yBelow = Math.round((MODEL_BAND_H + 2) * pr);
    const xMid = Math.round(u.valToPos(2, 'x', true));
    const bi = (yBelow * cv.width + xMid) * 4;
    const below = [img[bi], img[bi + 1], img[bi + 2]];
    // ポップアップ
    const pop = {};
    // ⚠ allData は先頭が切り落とされていて生データの添字と一致しない。モデルの値から探す
    const iBlend = models.indexOf('移行') + 2, iGsm = models.indexOf('GSM') + 20, iMsm = Math.floor(models.indexOf('移行') / 2);
    for (const [k, idx] of [['msm', iMsm], ['blend', iBlend], ['gsm', iGsm]]) {
      setSelectedIndex(idx, true, false);
      pop[k] = document.getElementById('pop-model').textContent;
    }
    const windsrc = document.getElementById('pop-windsrc').textContent;
    const iB0 = models.indexOf('移行');
    return { models: { first: models[0], mid: models[iB0 - 20], blend: models[iB0 + 2], gsmFirst: models[iB0 + 5], last: models[models.length - 1],
      counts: models.reduce((a, m) => (a[m] = (a[m] || 0) + 1, a), {}) },
      segs, colors, below, pop, windsrc, skyTopPad: SKY_TOP_PAD, bandH: MODEL_BAND_H };
  }, { FIRST_GSM });
  await page.close();
  return r;
}

const near = (a, b, t = 26) =>   // 過去の時刻は少し暗く塗られるので色は幅を持たせる
   a.every((v, i) => Math.abs(v - b[i]) <= t);
const withP = await probe(true);
ok(withP.models.first === 'MSM' && withP.models.mid === 'MSM', '★MSM の期間は MSM', withP.models);
ok(withP.models.counts['移行'] === 5, '★移行はちょうど5時間（MSM_BLEND_HOURS）', withP.models);
ok(withP.models.blend === '移行' && withP.models.gsmFirst === 'GSM' && withP.models.last === 'GSM', '★移行→GSM の順', withP.models);
ok(withP.segs.length === 3 && withP.segs.map(s => s.m).join() === 'MSM,移行,GSM', '帯は3区間（MSM/移行/GSM）', withP.segs);
const want = { 'MSM': [0x2f, 0x6f, 0xd0], '移行': [0xe0, 0xa0, 0x20], 'GSM': [0x7d, 0x7a, 0xa8] };
for (const c of withP.colors) ok(near(c.rgb, want[c.m]), `★帯の色（${c.m}）`, c);
ok(!near(withP.below, want['MSM'], 20), '帯の下（日付・アイコンの領域）へ色が漏れていない', withP.below);
ok(/MSM/.test(withP.pop.msm) && !/GSM/.test(withP.pop.msm), '★窓：MSM の時刻は「モデル：MSM」', withP.pop);
ok(/移行/.test(withP.pop.blend), '★窓：移行の時刻は「移行」と言う', withP.pop);
ok(/GSM/.test(withP.pop.gsm), '★窓：GSM の時刻は「GSM」', withP.pop);
ok(withP.skyTopPad === 46 + withP.bandH, '上の余白＝従来46＋帯', withP);

const noP = await probe(false);
ok(noP.models.first === null && noP.segs.length === 1 && noP.segs[0].m === '?', '★④判別できないときは1区間「不明」', noP.segs);
ok(/不明/.test(noP.pop.msm) && !/MSM/.test(noP.pop.msm), '★④窓も「不明」と言う（MSM と言い張らない）', noP.pop);
ok(near(noP.colors[0].rgb, [0xd5, 0xda, 0xe2]), '不明は薄灰', noP.colors);

ok(!errors.length, 'ページ内で例外が出ていない', errors);
await browser.close();
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('MODELBAND SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify({ segs: withP.segs, colors: withP.colors, pop: withP.pop }));
console.log('MODELBAND SMOKE PASSED');
