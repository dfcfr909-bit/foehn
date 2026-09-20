/* レーダー実況とモデル予報の突き合わせ（v4.98.0）。
 *
 * なぜ要るか:
 *   グラフに出ているのは JMA MSM の**予報**。実機で「降っていないのに雨 3.7mm」と
 *   出た。1時間のズレ（v4.97.0）を別にすれば**モデルの外れ**で、これは直せない。
 *   直せないなら隠さない——気象庁ナウキャストの**実況**と突き合わせて出す。
 *
 * ⚠⚠ **本丸は「帯が出るか」ではなく「嘘をつかないか」。**
 *   - 範囲外（実況＋60分の外）を「降っていない」と言わない
 *   - 画素が読めない端末で、黙って「食い違いなし」にしない
 *   - 通信が無いだけのときに「読めません」と言わない（圏外の帯と二重になる）
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const UPLOT_JS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.iife.min.js'), 'utf8');
const UPLOT_CSS = fs.readFileSync(path.join(ROOT, 'tests/node_modules/uplot/dist/uPlot.min.css'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };
const p2 = n => String(n).padStart(2, '0');

/* ---- PNGを手で組む（依存を増やさない。smoke_rain と同じ作り） ---- */
const CRC = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c; }
  return buf => { let c = -1; for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
})();
function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function rgbaPng(w, h, fn) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const o = y * (w * 4 + 1);
    for (let x = 0; x < w; x++) {
      const p = fn(x, y);
      raw[o + 1 + x * 4] = p[0]; raw[o + 2 + x * 4] = p[1];
      raw[o + 3 + x * 4] = p[2]; raw[o + 4 + x * 4] = p[3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
const WET_PNG = rgbaPng(256, 256, () => [0, 80, 255, 220]);   // 一面に雨雲
const DRY_PNG = rgbaPng(256, 256, () => [0, 0, 0, 0]);        // 透明＝降っていない
const TILE_PNG = rgbaPng(8, 8, () => [200, 200, 200, 255]);

const LAT = 36.57, LON = 137.65;
function nowcastTimes(shiftMin) {
  const base = new Date(Math.floor(Date.now() / 300e3) * 300e3 - (shiftMin || 0) * 60000);
  const stamp = d => `${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}T` +
    `${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}${p2(d.getUTCSeconds())}Z`;
  const b = stamp(base);
  const out = [{ basetime: b, validtime: b, elements: ['hrpns'] }];
  for (let i = 1; i <= 12; i++) out.push({ basetime: b, validtime: stamp(new Date(base.getTime() + i * 300e3)), elements: ['hrpns'] });
  return { base, list: out };
}

/* 毎時データ。modelRain=true なら全時間ずっと雨（3.7mm）にする */
function fakeWeather(modelRain) {
  const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], snowfall: [],
    surface_pressure: [], windspeed_10m: [], winddirection_10m: [], windgusts_10m: [], weathercode: [], cloudcover: [] };
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  for (let i = 0; i < 288; i++) {
    const d = new Date(start.getTime() + i * 3600e3);
    h.time.push(`${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`);
    h.temperature_2m.push(10); h.apparent_temperature.push(8);
    h.precipitation.push(modelRain ? 3.7 : 0); h.snowfall.push(0);
    h.surface_pressure.push(1013); h.windspeed_10m.push(3); h.winddirection_10m.push(270);
    h.windgusts_10m.push(6); h.weathercode.push(modelRain ? 61 : 1); h.cloudcover.push(60);
  }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 864e5);
    const ds = `${b.getFullYear()}-${p2(b.getMonth() + 1)}-${p2(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 800 };
}

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const errors = [];

/* o = { modelRain, radarWet, cors, offline, ageMin } */
async function open(o) {
  const { list } = nowcastTimes(o.ageMin || 0);
  let tileHits = 0;
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => d.dismiss().catch(() => {}));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather(o.modelRain)) });
    if (url.includes('targetTimes_N1')) return route.fulfill({ contentType: 'application/json', body: JSON.stringify(list) });
    if (url.includes('targetTimes')) return route.fulfill({ contentType: 'application/json', body: '[]' });
    // 届かない状態（通信そのものが死んでいる）。no-cors の取り直しも落ちる
    if (o.unreachable && url.includes('/surf/hrpns/')) { tileHits++; return route.abort(); }
    if (url.includes('/surf/hrpns/')) {
      tileHits++;
      /* ⚠⚠ **本番のCORS失敗はこの形になる。**
         crossOrigin='anonymous' を付けた <img> は、ACAOヘッダが無いと
         「汚れる」のではなく**読み込み自体が失敗**する（onerror）。
         それを再現するため、**届くが画像として読めない**中身を返す。
         no-cors の取り直しは成功するので、「届いてはいる」と判定できるはず。 */
      if (o.badImage) return route.fulfill({ contentType: 'image/png', body: Buffer.from('not an image') });
      const headers = (o.cors === false) ? {} : { 'access-control-allow-origin': '*' };
      return route.fulfill({ contentType: 'image/png', body: o.radarWet ? WET_PNG : DRY_PNG, headers });
    }
    if (/\.(png|jpg)/.test(url)) return route.fulfill({ contentType: 'image/png', body: TILE_PNG,
      headers: { 'access-control-allow-origin': '*' } });
    return route.abort();
  });
  await page.addInitScript(ll => localStorage.setItem('sotoki_last',
    JSON.stringify({ lat: ll[0], lon: ll[1], name: 'テスト地点' })), [LAT, LON]);
  if (o.offline) await page.addInitScript(() =>
    Object.defineProperty(navigator, 'onLine', { get: () => false, configurable: true }));
  /* 画素が読めない端末の再現。
     ⚠ CORSヘッダを外すだけでは Playwright の fulfill が素通ししてしまい再現しない。
       実際に起きるのは getImageData の SecurityError なので、**そこを起こす**。
       1×1（probeTileAlpha 専用のcanvas）だけに効かせ、チャートの描画は壊さない。 */
  if (o.cors === false) await page.addInitScript(() => {
    const orig = CanvasRenderingContext2D.prototype.getImageData;
    CanvasRenderingContext2D.prototype.getImageData = function (...a) {
      if (this.canvas.width === 1 && this.canvas.height === 1) {
        throw new DOMException('Tainted canvases may not be read', 'SecurityError');
      }
      return orig.apply(this, a);
    };
  });
  await page.goto('https://sotoki.test/');
  await page.waitForTimeout(2600);
  page.tileHits = () => tileHits;
  return page;
}
/* 実況を「消す前」と「消した後」の画面を突き合わせて、**本当に描かれているか**を測る。
   ⚠⚠ **これが無かったから素通りした。** v4.98.0〜v4.100.0 は `state.radar` と帯の
     文言しか見ておらず、**ストリップが一度も描かれていない**ことに気づけなかった。
     実機で「実況が出ない」と言われて初めて分かった（画素で測って差分ゼロ）。 */
async function stripVisibility(page) {
  const withShot = await page.screenshot();
  await page.evaluate(() => { state.radar = null; buildCharts(); });
  await page.waitForTimeout(500);
  const withoutShot = await page.screenshot();
  return page.evaluate(async ([a, b]) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = 'data:image/png;base64,' + src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const cv = document.createElement('canvas');
    cv.width = ia.width; cv.height = ia.height;
    const cx = cv.getContext('2d');
    cx.drawImage(ia, 0, 0); const da = cx.getImageData(0, 0, cv.width, cv.height).data;
    cx.clearRect(0, 0, cv.width, cv.height);
    cx.drawImage(ib, 0, 0); const db = cx.getImageData(0, 0, cv.width, cv.height).data;
    /* ⚠ 明暗の**両方向**を測る。薄い白を乗せただけなら「明るくなる」しか起きない。
       濃い縁が敷かれていれば「暗くなる」画素も必ず出る。
       ⚠⚠ 差分の大きさだけで見てはいけない。ここの背は濃い青なので、
         10%の白でも差は出る——**実機の明るい背では埋もれるのに通ってしまう**
         （実際そう書いて壊し方をすり抜けさせた）。 */
    let maxD = 0, cnt = 0, up = 0, down = 0;
    for (let i = 0; i < da.length; i += 4) {
      const la = (da[i] + da[i+1] + da[i+2]) / 3;
      const lb = (db[i] + db[i+1] + db[i+2]) / 3;
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i+1] - db[i+1]), Math.abs(da[i+2] - db[i+2]));
      if (d > maxD) maxD = d;
      if (d >= 24) cnt++;                  // 「うっすら」は数えない
      if (la - lb >= 24) up++;             // 実況を描いて明るくなった（塗り）
      if (lb - la >= 24) down++;           // 実況を描いて暗くなった（縁）
    }
    return { maxD, cnt, up, down };
  }, [withShot.toString('base64'), withoutShot.toString('base64')]);
}

const note = page => page.evaluate(() => {
  const el = document.getElementById('radar-note');
  return { shown: !!el.offsetParent, cls: el.className, text: (el.textContent || '').trim() };
});

/* ============ 1. ★★★ 予報は雨・実況は降っていない → 言う ============
   実機の報告そのもの。ここが出ないなら、この機能を作った意味が無い。 */
{
  const p = await open({ modelRain: true, radarWet: false });
  const n = await note(p);
  const st = await p.evaluate(() => ({ ok: state.radar && state.radar.ok, usable: radarUsable() }));
  ok(st.ok && st.usable, '★前提: 実況を読めている（この検査の土台）', st);
  ok(n.shown, '★★★予報とレーダーが食い違ったら帯を出す', n);
  ok(/レーダー/.test(n.text) && /ありません/.test(n.text),
    '★★どちらが何と言っているかを書く', n.text);
  await p.close();
}

/* ============ 1b. ★★★ ストリップが実際に画面に描かれていること ============
   ⚠⚠ **「state に入っているか」ではなく「画面に出ているか」を見る。**
   v4.98.0〜v4.100.0 は前者しか見ておらず、`state.radar.ok === true` なのに
   **一度も描かれていなかった**。読み取りはタイル13枚ぶんで必ず `render()` より
   遅く返るのに、初回は描き直さない実装にしていたため（実機で発覚）。
   ⚠ 雲パネルの背は青にも白にもなるので、**薄い色だけで描かない**。
     縁を敷いて、どちらの背でも読めること。 */
{
  const p = await open({ modelRain: false, radarWet: false });
  const before = await p.evaluate(() => ({ ok: state.radar && state.radar.ok, usable: radarUsable() }));
  ok(before.ok && before.usable, '★前提: 実況を読めている', before);
  const v = await stripVisibility(p);
  ok(v.maxD >= 40,
    '★★★実況のストリップが画面に描かれている（stateに入っただけで終わらせない）', v);
  ok(v.cnt >= 40, '★★はっきり分かる面積で描く', v);
  /* ⚠⚠ 濃い縁が敷かれていること。塗りだけだと**明るい背で埋もれて**、
     「実況が無い」と見分けがつかなくなる。 */
  ok(v.down >= 20 && v.up >= 20,
    '★★★塗りと縁の両方がある（明るい背でも暗い背でも読める）', v);
  await p.close();
}

/* ============ 2. ★★★ 一致しているときは黙る（狼少年にしない） ============ */
{
  const p = await open({ modelRain: true, radarWet: true });
  const n = await note(p);
  ok(!n.shown, '★★★予報とレーダーが一致していたら帯を出さない', n);
  await p.close();
}
{
  const p = await open({ modelRain: false, radarWet: false });
  const n = await note(p);
  ok(!n.shown, '★★★どちらも「降らない」でも帯を出さない', n);
  await p.close();
}

/* ============ 3. ★★★ 範囲外を「降っていない」と言わない ============
   ナウキャストは実況＋60分先だけ。それ以外の時間は**分からない**のであって、
   「降っていない」ではない。null で返すこと。 */
{
  const p = await open({ modelRain: false, radarWet: true });
  const r = await p.evaluate(() => {
    const now = Date.now();
    return {
      いま:      radarWetAt(new Date(now)),
      三十分後:  radarWetAt(new Date(now + 30 * 60000)),
      三時間後:  radarWetAt(new Date(now + 3 * 3600e3)),
      一日前:    radarWetAt(new Date(now - 24 * 3600e3)),
    };
  });
  ok(r.いま === true && r.三十分後 === true, '★前提: 範囲内は実況を返す', r);
  ok(r.三時間後 === null, '★★★範囲外（先）は null（＝分からない）。「降っていない」と言わない', r);
  ok(r.一日前 === null, '★★★範囲外（過去）も null', r);
  await p.close();
}

/* ============ 4. ⚠⚠ 画素が読めない端末では、読めないと言う ============
   黙って帯を出さないと「食い違いが無い」と区別がつかない（ADR-0011）。 */
{
  const p = await open({ modelRain: true, radarWet: false, cors: false });
  const st = await p.evaluate(() => ({ ok: state.radar.ok, kind: state.radar.kind }));
  const n = await note(p);
  ok(st.ok === false && st.kind === 'device', '★前提: 画素が読めない状態を作れている', st);
  ok(n.shown && /読めません/.test(n.text),
    '★★★画素が読めない端末では黙らない（「食い違いなし」と区別がつかなくなる）', n);
  await p.close();
}

/* ============ 4b. ⚠⚠⚠ 画像が読めないのに黙らないこと（実機で踏んだ穴） ============
   v4.98.0 は「画像の読み込み失敗」を一律 kind:'network'＝黙る に分類していた。
   ところが **CORS で拒まれた場合もここに来る**（crossOrigin='anonymous' を付けた
   <img> は ACAO が無いと onerror になる）。つまり本番の失敗モードでちょうど黙り、
   実機では帯も棒も出なかった。**この機能を作った目的そのものが達成できていなかった。** */
{
  const p = await open({ modelRain: true, radarWet: false, badImage: true });
  const st = await p.evaluate(() => ({ ok: state.radar.ok, kind: state.radar.kind }));
  const n = await note(p);
  ok(p.tileHits() > 0, '★前提: タイルは取りに行っている（届いてはいる）', p.tileHits());
  ok(st.ok === false && st.kind === 'device',
    '★★★届くが読めないときは device に分類する（通信の失敗と混ぜない）', st);
  ok(n.shown && /読めません/.test(n.text),
    '★★★画像が読めないなら黙らない（CORSの失敗はここに化ける）', n);
  await p.close();
}

/* ============ 4c. ★★ 本当に届かないなら黙る（帯を2本にしない） ============
   ⚠ 4b と対。ここまで黙らなくすると、通信が死んでいるだけで帯が増えて
   チャートが縮む。**届くかどうか**で分けているので、ここは静かなまま。 */
{
  const p = await open({ modelRain: true, radarWet: false, unreachable: true });
  const st = await p.evaluate(() => ({ ok: state.radar.ok, kind: state.radar.kind }));
  const n = await note(p);
  ok(st.ok === false && st.kind === 'network', '★前提: 届かない状態を作れている', st);
  ok(!n.shown, '★★★本当に届かないときは黙る（圏外の帯と二重にしない）', n);
  await p.close();
}

/* ============ 5. ⚠⚠ 通信が無いだけなら黙る（帯を2本にしない） ============ */
{
  const p = await open({ modelRain: true, radarWet: false, offline: true });
  const n = await note(p);
  ok(p.tileHits() === 0, '★★圏外ではタイルを取りに行かない', p.tileHits());
  ok(!n.shown, '★★★通信が無いだけのときは「読めません」と言わない（圏外の帯と二重にしない）', n);
  await p.close();
}

/* ============ 6. ★★ 古い実況は使わない ============
   5分ごとに更新されるものを、30分前のまま「いま」として出さない。 */
{
  const p = await open({ modelRain: true, radarWet: false, ageMin: 40 });
  const r = await p.evaluate(() => ({ ok: state.radar.ok, usable: radarUsable(),
    wet: radarWetAt(new Date()) }));
  ok(r.ok === true, '★前提: 読めてはいる（古いだけ）', r);
  ok(r.usable === false, '★★★古すぎる実況は使わない', r);
  ok(r.wet === null, '★★古い実況から「降っている／いない」を言わない', r);
  await p.close();
}

await browser.close();
ok(errors.length === 0, '★ページ内で例外が出ていない', errors);

if (fails.length) {
  console.log(`❌ ${fails.length}件`);
  for (const f of fails) console.log('  - ' + f);
  process.exit(1);
}
console.log('✅ smoke_radarcheck PASS');
