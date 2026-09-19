/* 圏外で「直近に取れた予報」を出す仕組み。
 *
 * なぜ要るか:
 *   山では圏外がふつう。`sw.js` は気象APIを**意図的にキャッシュしない**方針なので、
 *   圏外で開くと画面は立ち上がるのにデータが空だった。そこをアプリ側で埋めている。
 *
 * ⚠⚠ **この検査の本丸は「出るか」ではなく「黙って出さないか」。**
 *   古い数字を、新しいものと同じ顔で出すのがこの仕組みでいちばん危ない失敗の仕方。
 *   ADR-0011（`elevation` の意味が変わり、判定が黙って甘くなった件）と同じ形になる。
 *   だから **帯が出ること・通信できたら必ず消えること・距離が添うこと**を見る。
 *
 * ⚠ **24時間より古いものは使わない**（数字を出さず「古すぎる」とだけ言う）。
 *   利用者判断（2026-09-13）。緩めるならこの検査ごと直すこと。
 *
 * ⚠ バックグラウンドでの定期取得は**していない**（iOSに手段が無い）。
 *   ここが見るのは「開いている間に取れたものを、次に開いたとき圏外でも出す」まで。
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

/* ---- 気象データの作り物（本体・補助とも） ---- */
const pad = n => String(n).padStart(2, '0');
const LEVELS = [925, 900, 850, 800, 700, 600];
const CLOUD_HPA = [1000, 975, 950, 925, 900, 850, 800, 700, 600, 500, 400, 300, 250, 200];
function hours() {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  return Array.from({ length: 288 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600e3);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  });
}
function fakeWeather() {
  const time = hours();
  const h = { time };
  const fill = v => time.map(() => v);
  Object.assign(h, {
    temperature_2m: fill(5), apparent_temperature: fill(2), precipitation: fill(0.4),
    snowfall: fill(0), surface_pressure: fill(1013), windspeed_10m: fill(6),
    winddirection_10m: fill(270), windgusts_10m: fill(9), weathercode: fill(2), cloudcover: fill(40),
    cloud_cover_low: fill(30), cloud_cover_mid: fill(20), cloud_cover_high: fill(10),
  });
  for (const p of LEVELS) { h[`wind_speed_${p}hPa`] = fill(8); h[`wind_direction_${p}hPa`] = fill(300); }
  const daily = { time: [], sunrise: [], sunset: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let dd = 0; dd < 13; dd++) {
    const base = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 1200 };
}
// 補助リクエスト（models未指定）。突風と気圧面ごとの雲量
function fakeSupplemental() {
  const time = hours();
  const h = { time, wind_gusts_10m: time.map(() => 13) };
  for (const p of CLOUD_HPA) h[`cloud_cover_${p}hPa`] = time.map(() => 55);
  return { hourly: h };
}

/* ---- 1つの文脈（＝1つのIndexedDB）を使い回して、開き直しを再現する ---- */
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 780 } });
const page = await context.newPage();
const errors = [];
const dialogs = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => { dialogs.push(d.message); d.dismiss().catch(() => {}); });

let online = true;          // false にすると気象APIだけ落ちる（＝圏外）
let slowMs = 0;             // >0 にすると気象APIの応答を遅らせる（取得中の割り込みを作る）
let apiHits = 0;
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('api.open-meteo.com')) {
    apiHits++;
    if (!online) return route.abort();
    if (slowMs) await new Promise(r => setTimeout(r, slowMs));
    const body = url.includes('models=jma_seamless') ? fakeWeather() : fakeSupplemental();
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
  }
  return route.abort();     // 標高タイル・SW・地図タイルなどは落として構わない
});

const P1 = { lat: 36.9034, lon: 139.1732, name: '控えた地点' };
async function openAt(p) {
  await page.evaluate(v => localStorage.setItem('sotoki_last', JSON.stringify(v)), p);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1400);
}
const note = () => page.evaluate(() => {
  const el = document.getElementById('offline-note');
  return { cls: el.className, text: el.textContent, shown: !!el.offsetParent };
});
const cached = () => page.evaluate(() => new Promise(res => {
  const r = indexedDB.open('sotoki-wx', 1);
  r.onerror = () => res([]);
  r.onsuccess = () => {
    const g = r.result.transaction('points', 'readonly').objectStore('points').getAll();
    g.onerror = () => res([]);
    g.onsuccess = () => res(g.result.map(x => ({
      key: x.key, name: x.name, at: x.at,
      hasJson: !!(x.json && x.json.hourly && x.json.hourly.time), hasSup: !!x.sup,
    })));
  };
}));
/* ⚠ `state` は `const` なので **window には生えない**。素の識別子で読むこと
   （`window.state` で見ると常に 0 になり、この検査がまるごと空振りする）。 */
const drawn = () => page.evaluate(() => ({
  points: (typeof state !== 'undefined' && state.allData) ? state.allData.length : 0,
  gust: (typeof state !== 'undefined' && state.allData) ? state.allData[0].gust : null,
  loading: getComputedStyle(document.getElementById('loading-overlay')).display,
}));

/* ============ A. 通信できたとき ============ */
await page.goto('https://sotoki.test/');
await openAt(P1);
{
  const n = await note();
  ok(!n.shown && n.cls === '', '★★★通信で取れたときは帯を出さない（出しっぱなしにすると印の意味が消える）', n);
  const c = await cached();
  ok(c.length === 1 && c[0].hasJson, '★前提: 応答を控えている（この検査が空振りしていない）', c);
  ok(c[0].hasSup, '★補助データ（突風・気圧面の雲量）も控えている', c);
  ok(c[0].name === P1.name, '★取得した地点の名前も一緒に控えている', c);
}

/* ============ B. 圏外で、控えてあるものを出す ============ */
online = false;
dialogs.length = 0;
await openAt(P1);
{
  const n = await note();
  const d = await drawn();
  ok(d.points > 0, '★★★圏外でも控えてあるもので画面が描ける', d);
  ok(d.loading === 'none', '★読込中の表示が残らない', d);
  ok(n.shown && /\bon\b/.test(n.cls) && !/expired/.test(n.cls), '★★★控えを出しているときは帯が出る', n);
  ok(n.text.includes('保存データを表示中'), '★★何を見ているのか帯で言っている', n.text);
  ok(/\d+\/\d+ \d\d:\d\d取得/.test(n.text), '★★★いつ取ったものかを出している', n.text);
  ok(n.text.includes(P1.name), '★★どこで取ったものかを出している', n.text);
  ok(d.gust === 13, '★★控えた補助データも混ざる（突風が欠けない）', d);
  ok(dialogs.length === 0, '★控えがあるときに「取得失敗」で驚かせない', dialogs);
}

/* ============ B2. 帯のぶんチャートが画面外へ押し出されていない ============
   ⚠ 帯は描画の予約より**先に**出す決まり。あとから出すと下端が隠れる。 */
{
  const fit = await page.evaluate(() => {
    const outer = document.getElementById('charts-outer').getBoundingClientRect();
    const note = document.getElementById('offline-note').getBoundingClientRect();
    const cvs = [...document.querySelectorAll('#charts-outer canvas')].map(c => c.getBoundingClientRect());
    return {
      noteBottom: Math.round(note.bottom), outerTop: Math.round(outer.top),
      outerBottom: Math.round(outer.bottom),
      overflow: Math.round(Math.max(0, ...cvs.map(r => r.bottom - outer.bottom - 1), 0)),
      n: cvs.length,
    };
  });
  ok(fit.n > 0, '★前提: チャートが描かれている（この検査が空振りしていない）', fit);
  ok(fit.noteBottom <= fit.outerTop, '★帯はチャートの上にあり、重なっていない', fit);
  ok(fit.overflow === 0, '★★★帯を出してもチャートが下へはみ出さない（先に帯を出す決まり）', fit);
}

/* ============ C. 近い別地点の控えを流用し、離れている距離を出す ============
   ⚠ GPSは毎回わずかに違う座標を返すので、現在地は**完全一致しない**。
     流用そのものは要るが、**黙って隣の予報を出さない**ために距離を必ず添える。 */
{
  const near = { lat: P1.lat + 0.03, lon: P1.lon + 0.02, name: '少し離れた所' };   // 約3.7km
  await openAt(near);
  const n = await note();
  ok(n.shown && !/expired/.test(n.cls), '★★近い控えは流用する（完全一致でなくても出す）', n);
  ok(/（\d+\.\d+km先）/.test(n.text), '★★★流用した控えが何km離れているかを出す', n.text);
  ok(n.text.includes(P1.name), '★流用元の地点名を出す（いま選んだ名前ではない）', n.text);
}

/* ============ D. 遠すぎる控えは流用しない ============ */
{
  dialogs.length = 0;
  const far = { lat: P1.lat + 1.0, lon: P1.lon, name: '遠い所' };                  // 約111km
  await openAt(far);
  const n = await note();
  ok(!n.shown, '★★★20kmより遠い控えは流用しない（別の山の予報を出さない）', n);
  ok(dialogs.length > 0, '★出せるものが無いときは従来どおり取得失敗を知らせる', dialogs);
}

/* ============ E. 24時間より古い控えは使わない ============ */
{
  const aged = await page.evaluate(hoursOld => new Promise(res => {
    const r = indexedDB.open('sotoki-wx', 1);
    r.onsuccess = () => {
      const st = r.result.transaction('points', 'readwrite').objectStore('points');
      const g = st.getAll();
      g.onsuccess = () => {
        for (const rec of g.result) { rec.at = Date.now() - hoursOld * 3600e3; st.put(rec); }
        res(g.result.length);
      };
    };
  }), 26);
  ok(aged > 0, '★前提: 控えを古くできた（この検査が空振りしていない）', aged);

  dialogs.length = 0;
  await openAt(P1);
  const n = await note();
  const d = await drawn();
  ok(/expired/.test(n.cls) && n.shown, '★★★古すぎるときは別の見た目で知らせる', n);
  ok(n.text.includes('古すぎる'), '★★★「古すぎる」と言葉で言う', n.text);
  ok(d.points === 0, '★★★古すぎる控えの数字は画面に出さない', d);
  ok(d.loading === 'none', '★読込中の表示が残らない（古すぎるときも）', d);
}

/* ============ F. 通信が戻ったら帯は消える ============ */
{
  online = true;
  await openAt(P1);
  const n = await note();
  ok(!n.shown && n.cls === '', '★★★通信が戻ったら帯は必ず消える', n);
  const c = await cached();
  ok(c.some(x => x.key === `${P1.lat.toFixed(3)},${P1.lon.toFixed(3)}` && Date.now() - x.at < 60000),
    '★取り直したら控えも新しくなる', c);
}

/* ============ F2. 取得中に別の地点へ移っても、控えの名前が入れ替わらない ============
   ⚠⚠ 緯度経度は引数で固定されるのに名前だけグローバルから読んでいたため、
     通信とIndexedDBの往復のあいだに別地点を選ぶと**後の名前が先の控えに焼き付いた**。
     座標は正しいまま名前だけ別の山になるので、帯が実在しない組み合わせを出す
     （実機で「女峰山（19.2km先）」が吾妻の座標に出た）。 */
{
  online = true;
  slowMs = 600;                                   // 取得中に横から書き換える隙を作る
  const P9 = { lat: 35.360, lon: 138.727, name: '正しい名前' };
  await page.evaluate(v => localStorage.setItem('sotoki_last', JSON.stringify(v)), P9);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(250);                 // まだ取得中
  const swapped = await page.evaluate(() => {
    if (typeof state === 'undefined') return false;
    state.locationName = 'すり替えた名前';        // 別地点を選んだのと同じ状態にする
    return true;
  });
  ok(swapped, '★前提: 取得中に名前を書き換えられた（この検査が空振りしていない）');
  await page.waitForTimeout(2000);
  slowMs = 0;

  const c = await cached();
  const rec = c.find(x => x.key === `${P9.lat.toFixed(3)},${P9.lon.toFixed(3)}`);
  ok(!!rec, '★前提: その地点の控えができている', c);
  ok(rec && rec.name === P9.name,
    '★★★取得中に別の地点へ移っても、控えの名前が入れ替わらない', rec);

  // 帯にもその名前が出る（圏外で開き直す）
  online = false;
  await openAt(P9);
  const n = await note();
  ok(n.text.includes(P9.name) && !n.text.includes('すり替えた名前'),
    '★★★帯に出る地点名も入れ替わらない', n.text);
  online = true;
}

/* ============ G. 気象APIは Service Worker で焼き付けない ============
   ⚠ 古い数字が**黙って**出るのを避けるための方針。控えるのはアプリ側だけ。 */
{
  const SW = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
  ok(/気象API[^\n]*キャッシュしない|キャッシュしない[^\n]*気象/.test(SW),
    '★★sw.js は気象APIをキャッシュしない方針のまま');
  ok(!/api\.open-meteo\.com/.test(SW),
    '★★★sw.js に気象APIのホストを足さない（古さを画面に出せなくなる）');
}

ok(errors.length === 0, '★ページ内で例外が出ていない', errors);
ok(apiHits > 0, '★前提: 気象APIを実際に叩いている（この検査が空振りしていない）', apiHits);

await browser.close();

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_offline PASS');
