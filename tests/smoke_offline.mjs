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
 * ⚠ **7日より古いものは使わない**（数字を出さず「古すぎる」とだけ言う）。
 *   24時間（利用者判断 2026-09-13）を、お気に入りの裏取り（#228）に合わせて7日へ広げた（2026-10-30）。
 *   **24時間を超えたものは帯の色を変え「1日以上前の予報」と言う**（E）。お気に入りの裏取りは I。
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
    temperature_2m: fill(weatherTemp), apparent_temperature: fill(2), precipitation: fill(0.4),
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
  const h = { time, wind_gusts_10m: time.map(() => 13) };   // 突風は使わない（山頂の風×1.75）。混ざったら検出する
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
let slowFor = '';           // 空でなければ、この文字列を含む URL だけ slowMs 遅らせる（H の弱電波）
let weatherTemp = 5;        // 作り物の気温（新しいデータと控えを見分ける）
let apiHits = 0;
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('api.open-meteo.com')) {
    apiHits++;
    if (!online) return route.abort();
    if (slowMs && (!slowFor || url.includes(slowFor))) await new Promise(r => setTimeout(r, slowMs));
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
  const r = indexedDB.open('sotoki-wx');
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
  wind: (typeof state !== 'undefined' && state.allData) ? state.allData[0].wind : null,
  loading: getComputedStyle(document.getElementById('loading-overlay')).display,
}));

/* ============ A. 通信できたとき ============ */
await page.goto('https://sotoki.test/');
await openAt(P1);
{
  const n = await note();
  ok(!n.shown && n.cls === '', '★★★通信で取れたときは帯を出さない（出しっぱなしにすると印の意味が消える）', n);
  // ⚠ 最初の goto で既定の地点（立山・黒部）の控えもできることがある（取得が reload より先に済んだとき）。キーで引く
  const c = await cached(), r1 = c.find(x => x.key === `${P1.lat.toFixed(3)},${P1.lon.toFixed(3)}`);
  ok(r1 && r1.hasJson, '★前提: 応答を控えている（この検査が空振りしていない）', c);
  ok(r1 && r1.hasSup, '★補助データ（突風・気圧面の雲量）も控えている', c);
  ok(r1 && r1.name === P1.name, '★取得した地点の名前も一緒に控えている', c);
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
  ok(d.wind != null && d.gust != null && Math.abs(d.gust - d.wind * 1.75) < 1e-9,
    '★★圏外でも突風が出る（山頂の風×1.75。控えた補助の突風 13 は使わない）', d);
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

/* ============ E. 24時間を超えた控えは「1日以上前」と言って出す・7日より古い控えは使わない ============ */
const ageAll = hoursOld => page.evaluate(hoursOld => new Promise(res => {
  const r = indexedDB.open('sotoki-wx');
  r.onsuccess = () => {
    const st = r.result.transaction('points', 'readwrite').objectStore('points');
    const g = st.getAll();
    g.onsuccess = () => {
      for (const rec of g.result) { rec.at = Date.now() - hoursOld * 3600e3; st.put(rec); }
      res(g.result.length);
    };
  };
}), hoursOld);
{
  const aged = await ageAll(26);
  ok(aged > 0, '★前提: 控えを26時間前にできた', aged);
  dialogs.length = 0;
  await openAt(P1);
  const n = await note();
  const d = await drawn();
  ok(d.points > 0, '★★7日以内なら1日を超えた控えも出す（#228）', d);
  ok(/\bstale\b/.test(n.cls) && !/expired/.test(n.cls) && n.shown, '★★★1日を超えた控えは帯の見た目を変える', n);
  ok(n.text.includes('1日以上前の予報です') && /1日2時間前/.test(n.text), '★★★1日以上前の予報だと、取得日時と「◯日前」で言う', n.text);
}
{
  const aged = await page.evaluate(hoursOld => new Promise(res => {
    const r = indexedDB.open('sotoki-wx');
    r.onsuccess = () => {
      const st = r.result.transaction('points', 'readwrite').objectStore('points');
      const g = st.getAll();
      g.onsuccess = () => {
        for (const rec of g.result) { rec.at = Date.now() - hoursOld * 3600e3; st.put(rec); }
        res(g.result.length);
      };
    };
  }), 7 * 24 + 2);
  ok(aged > 0, '★前提: 控えを7日より古くできた（この検査が空振りしていない）', aged);

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

/* ============ H. 弱電波（#227・v4.182.0）：6秒で控えを先に出し、届いた新しいデータは押して替える ============ */
{
  online = true; slowMs = 0; slowFor = ''; weatherTemp = 5;
  const PH = { lat: 36.2, lon: 138.5, name: '弱電波の地点' };
  await openAt(PH);                                   // まず控えを作る（気温 5）
  const temp0 = () => page.evaluate(() => (typeof state !== 'undefined' && state.allData) ? state.allData[0].temp : null);
  ok(await temp0() === 5, '★前提: 控えができた（気温 5）');
  weatherTemp = 12; slowMs = 10000; slowFor = 'latitude=36.2';
  await page.evaluate(v => localStorage.setItem('sotoki_last', JSON.stringify(v)), PH);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(3500);
  const early = await note();
  ok(!/保存データ/.test(early.text), '6秒までは控えを出さない（通信を待つ）', early);
  await page.waitForTimeout(4000);                    // 7.5 秒
  const mid = await note(), dmid = await drawn();
  ok(mid.shown && /保存データを表示中/.test(mid.text) && /通信を続けています/.test(mid.text) && dmid.points > 0 && dmid.loading === 'none',
    '★★★弱電波：6秒で控えを先に出し、「通信を続けています」と添える', { mid, dmid });
  ok(await temp0() === 5, '控えの数字（気温 5）を出している');
  await page.waitForTimeout(4500);                    // 12 秒：届いた
  const arrived = await note();
  ok(/新しいデータがあります/.test(arrived.text) && await temp0() === 5,
    '★★★新しいデータが届いても勝手に描き直さない（押すと更新を出す）', { arrived, t: await temp0() });
  await page.click('#offline-note .wx-fresh-btn');
  await page.waitForTimeout(600);
  const after = await note();
  ok(await temp0() === 12 && !after.shown, '★★押すと新しいデータ（気温 12）に替わり、帯が消える', { after, t: await temp0() });

  // 弱電波の取得中に別の地点へ移ったら、古い取得は画面に触らない
  weatherTemp = 7;
  await page.evaluate(v => localStorage.setItem('sotoki_last', JSON.stringify(v)), PH);
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const P2 = { lat: 35.9, lon: 138.9 };
  await page.evaluate(v => { state.locationName = '移った先'; fetchWeather(v.lat, v.lon); }, P2);
  await page.waitForTimeout(11000);
  const moved = await page.evaluate(() => ({ lat: state.lat, name: state.locationName }));
  const nm = await note();
  ok(Math.abs(moved.lat - P2.lat) < 1e-9 && !/新しいデータ|保存データ/.test(nm.text),
    '★★★取得中に別の地点へ移ったら、古い取得の控え・新しいデータで画面を上書きしない', { moved, nm });
  ok(dialogs.length === 0 || !dialogs.some(d => /データ取得失敗/.test(d)), '追い越された取得は失敗の知らせを出さない', dialogs);
  // モデル切り替え（strict）の取得が追い越されたら、例外を投げない（switchModel が「失敗」と言わない）
  slowMs = 4000; slowFor = 'latitude=36.2';
  const st = await page.evaluate(async v => {
    const p = fetchWeather(36.2, 138.5, { strict: true }).then(r => 'ok:' + r, e => 'threw:' + e.message);
    await new Promise(r => setTimeout(r, 300));
    fetchWeather(v.lat, v.lon);
    return p;
  }, P2);
  ok(st === 'ok:false', '★★追い越された strict の取得は例外を投げず false を返す', st);
  // 通常の取得の最中はモデルを切り替えない（追い越して失敗すると新しい地点が描かれない）
  slowMs = 3000;
  const busy = await page.evaluate(async () => {
    const p = fetchWeather(36.2, 138.5);
    await new Promise(r => setTimeout(r, 200));
    const before = state.model, other = Object.keys(FORECAST_MODELS).find(k => k !== state.model);
    await switchModel(other);
    const res = { changed: state.model !== before, note: document.getElementById('model-note').textContent };
    await p;
    return res;
  });
  ok(!busy.changed && /取得中/.test(busy.note), '★★地点の取得中はモデルを切り替えず、理由を出す', busy);
  // 控えの無い地点で遅い応答：控えは出さず、待って描く
  slowMs = 8000; slowFor = 'latitude=34.1'; weatherTemp = 9;
  await page.evaluate(() => { state.locationName = '控えの無い地点'; fetchWeather(34.1, 135.1); });
  await page.waitForTimeout(7000);
  const noc = await note();
  ok(!/保存データ/.test(noc.text), '控えの無い地点では、遅くても控えを出さない（待つ）', noc);
  await page.waitForTimeout(2500);
  const got = await page.evaluate(() => ({ lat: state.lat, t: state.allData[0].temp }));
  ok(Math.abs(got.lat - 34.1) < 1e-9 && got.t === 9, '★控えの無い地点は届いたら描く', got);
  slowMs = 0; slowFor = ''; weatherTemp = 5;
}

/* ============ I. お気に入りの予報と風を裏で控える（#228） ============
   ⚠ 本丸は「画面に触らない」こと（見ている地点の予報・標高・帯が、裏取りで別の地点に化けない） */
{
  online = true; slowMs = 0; slowFor = ''; weatherTemp = 5;
  const FA = { name: 'お気に入りA', lat: 36.70, lon: 138.50 }, FB = { name: 'お気に入りB', lat: 35.80, lon: 137.60 };
  await page.evaluate(f => localStorage.setItem('sotoki_favs', JSON.stringify(f)), [FA, FB]);
  await openAt(P1);
  const before = await page.evaluate(() => ({ lat: state.lat, name: state.locationName, dem: state.demElevation, n: state.allData.length }));
  weatherTemp = 21;
  const hits0 = apiHits;
  await page.evaluate(() => prefetchFavs());
  const after = await page.evaluate(() => ({ lat: state.lat, name: state.locationName, dem: state.demElevation, n: state.allData.length, t: state.allData[0].temp }));
  ok(after.lat === before.lat && after.name === before.name && after.dem === before.dem && after.t === 5,
    '★★★裏取りは画面の地点・名前・標高・予報に触らない', { before, after });
  const c = await cached();
  const ka = `${FA.lat.toFixed(3)},${FA.lon.toFixed(3)}`, kb = `${FB.lat.toFixed(3)},${FB.lon.toFixed(3)}`;
  const ra = c.find(x => x.key === ka), rb = c.find(x => x.key === kb);
  ok(ra && rb && ra.hasJson && rb.hasJson && ra.name === FA.name, '★★お気に入り全地点の予報を控える（名前つき）', c);
  ok(ra && ra.hasSup, '★補助データ（気圧面の雲量）も控える', ra);
  const wind = await page.evaluate(() => new Promise(res => {
    const r = indexedDB.open('sotoki-wx');
    r.onsuccess = () => { const g = r.result.transaction('wind', 'readonly').objectStore('wind').getAll(); g.onsuccess = () => res(g.result.map(x => ({ key: x.key, n: x.time.length, size: x.size }))); };
    r.onerror = () => res([]);
  }));
  ok(wind.length === 50 && wind.every(w => w.size > 0), '★★まわりの風の格子（5×5 点×2地点）を控える', wind.length);
  const hits1 = apiHits;
  ok(hits1 > hits0, '★前提: 裏取りで気象APIを叩いた', { hits0, hits1 });
  await page.evaluate(() => prefetchFavs());
  ok(apiHits === hits1, '★★自動の裏取りは3時間以内に取った地点を取り直さない', { hits1, now: apiHits });
  await page.evaluate(() => prefetchFavs({ manual: true }));
  ok(apiHits > hits1, '★手動の「いま保存」は新しくても取り直す', { hits1, now: apiHits });
  // 一覧の状態の行
  await page.evaluate(() => openFav());
  await page.waitForTimeout(300);
  const row = await page.evaluate(() => document.getElementById('fav-wx-save').textContent);
  ok(/2 \/ 2地点/.test(row) && /いま保存/.test(row), '★一覧に控えの状態とボタンが出る', row);
  await page.evaluate(() => closeFav());

  // 圏外：お気に入りの地点を開くと、控えた予報（気温 21）が出る
  online = false;
  await openAt(FA);
  const d = await drawn(), n = await note();
  const t = await page.evaluate(() => state.allData[0].temp);
  ok(d.points > 0 && t === 21 && n.text.includes(FA.name), '★★★圏外でもお気に入りの予報が出る（開いたことが無くても）', { d, t, n });
  // 圏外：保存した風が場に入り、取得時刻を言う
  const w = await page.evaluate(async f => {
    const pts = favWindPoints(f.lat, f.lon);
    const okUse = await windUseSaved(pts);
    const rec = windRecord(pts[12].key);
    return { okUse, offline: windOffline, has: !!rec, saved: !!(rec && rec.saved), idx: !!(rec && rec.idx instanceof Map), ph: !!(rec && rec.phases) };
  }, FA);
  ok(w.okUse && w.offline && w.has && w.saved && w.idx && w.ph, '★★★圏外では保存した風を使う（索引とモデルの判別を作り直す）', w);
  const wn = await page.evaluate(f => {
    const pts = favWindPoints(f.lat, f.lon);
    const cells = pts.map(p => ({ i: p.i, j: p.j }));
    return windSavedNote({ cells, missing: [] });
  }, FA);
  ok(/保存した風を表示中/.test(wn) && /\d+\/\d+ \d\d:\d\d取得/.test(wn), '★★保存した風の状態の文に取得時刻を出す', wn);
  const back = await page.evaluate(f => { windOffline = false; return !!windRecord(favWindPoints(f.lat, f.lon)[12].key); }, FA);
  ok(!back, '★★通信が戻れば保存した風は使わない（取り直す）', back);
  online = true;
  await page.evaluate(() => localStorage.removeItem('sotoki_favs'));
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
