/* 天気図（気象庁の速報天気図・予想天気図）。ADR-0010 の代替として入れたもの。
 *
 * ⚠ **いちばん危ないのは時刻の取り違え。** ファイル名の時刻は**UTC**で、
 *   そのまま出すと9時間ずれる。さらに**予想図の2つ目の時刻は基準時刻**であって
 *   対象時刻ではない（対象は基準＋24h／＋48h）。取り違えると
 *   「1日前の予想」と表示してしまい、しかも**絵は正しいので気づけない**。
 *
 * ⚠ **地図に重ねない**（投影法が違う）。**canvas に載せない**（CORSが要らない形を保つ）。
 *   **CSSフィルタを使わない**（iOS特有の不具合を2回踏んでいる）。
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

/* --- 原文を読む静的検査（実装の形そのものを守る） --- */
const a = HTML.indexOf('   天気図（気象庁の速報天気図・予想天気図）');
const b = HTML.indexOf('   AI全国概況（outlook.json を読むだけ');
ok(a > 0 && b > a, '天気図の節が見つかる（検査が空振りしていない）', { a, b });
const section = HTML.slice(a, b).split('\n').filter(l => !/^\s*[/*⚠]/.test(l)).join('\n');
ok(/loadWxMapList/.test(section), '注記を落としても中身が残っている');
// ⚠ canvas に載せると CORS が要るようになる（いまは <img> だけなので要らない）
ok(!/canvas|getImageData|drawImage/i.test(section),
  '★★★天気図を canvas に載せない（CORSが要らない形を保つ）',
  (section.match(/.*canvas.*/i) || [])[0]);
// ⚠ 地図に重ねない（投影法が違う）
ok(!/leafletMap|L\.imageOverlay/.test(section),
  '★★★天気図を地図に重ねない（投影法が違う）',
  (section.match(/.*leafletMap.*/) || [])[0]);
// ⚠ iOS特有のフィルタ不具合を2回踏んでいる
const cssBlock = HTML.slice(HTML.indexOf('#wxmap-overlay {'), HTML.indexOf('.rank-tab {'));
ok(!/filter\s*:/.test(cssBlock), '★★CSSフィルタで色を反転・減光しない（iOS）',
  (cssBlock.match(/.*filter\s*:.*/) || [])[0]);

/* --- 画面を動かす検査 --- */
const CRC_T = (() => { const t = []; for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const CRC = buf => { let c = 0xffffffff; for (const x of buf) c = CRC_T[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function pngChunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}
function tinyPng(w, h) {
  const raw = Buffer.alloc((w * 3 + 1) * h, 0xdd);
  for (let y = 0; y < h; y++) raw[y * (w * 3 + 1)] = 0;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr), pngChunk('IDAT', zlib.deflateSync(raw)), pngChunk('IEND', Buffer.alloc(0))]);
}
const PNG = tinyPng(60, 58);

// 実測した名前の形（scripts/probeJma.mjs で確認したもの）
const nm = (issued, base, kind, area) =>
  `${issued}_0_Z__C_010000_${base}_MET_CHT_JCI${kind}_${area}_JRcolor_Tjmahp_image.png`;
/* ⚠ **わざと降順・混在で並べる。** 実装が「配列の最後＝最新」と決め打ちしていたら
     ここで落ちる。並び順は仕様ではない。 */
const LIST = {
  near: {
    now: [
      nm('20260825143731', '20260825120000', 'spas', 'JCP600x581'),   // いちばん新しい
      nm('20260822141500', '20260822120000', 'spas', 'JCP600x581'),
      nm('20260824141500', '20260824120000', 'spas', 'JCP600x581'),
    ],
    ft24: [nm('20260825053331', '20260825000000', 'fsas24', 'JCP600x581')],
    ft48: [],                                                          // ⚠ 空の場合
  },
  asia: {
    now: [nm('20260825143731', '20260825060000', 'asas', 'JCP600x512')],
    ft24: [], ft48: [],
  },
};

let listMode = 'ok';    // 'ok' | 'fail'
let pngMode = 'ok';     // 'ok' | 'fail'

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
let pngHits = 0, listHits = 0;
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('weather_map/data/list.json')) {
    listHits++;
    if (listMode === 'fail') return route.fulfill({ status: 503, body: '' });
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(LIST) });
  }
  if (url.includes('weather_map/data/png/')) {
    pngHits++;
    if (pngMode === 'fail') return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: 'image/png', body: PNG });
  }
  return route.abort();
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(500);

const view = () => page.evaluate(() => ({
  open: document.getElementById('wxmap-overlay').classList.contains('open'),
  imgShown: getComputedStyle(document.getElementById('wxmap-img')).display !== 'none',
  src: document.getElementById('wxmap-img').getAttribute('src') || '',
  msg: document.getElementById('wxmap-msg').textContent,
  msgShown: getComputedStyle(document.getElementById('wxmap-msg')).display !== 'none',
  when: document.getElementById('wxmap-when').textContent,
}));

/* --- 場面1: 開いて実況が出る --- */
await page.evaluate(() => openWxMap());
await page.waitForTimeout(400);
let v = await view();
ok(v.open, '天気図の画面が開く', v);
ok(v.imgShown && !v.msgShown, '★画像が出る（案内は引っ込む）', v);
ok(v.src.includes('20260825143731'), '★★★並び順を仮定せず、いちばん新しい1枚を選ぶ', v.src);

/* ⚠ 時刻の検査。基準 20260825120000 は**UTC**なので日本時間では 8/25 21:00。
     そのまま出すと 12:00 と表示され、9時間ずれる。 */
ok(/8\/25 21:00/.test(v.when), '★★★UTCを日本時間に直して出す（9時間ずれない）', v.when);
ok(/実況/.test(v.when) && /日本時間/.test(v.when), '実況であること・時刻帯を明示する', v.when);

/* --- 場面2: 予想図は「基準＋24時間」が対象 ---
   ⚠ 基準 20260825000000(UTC) の FSAS24 は、対象が 8/26 00:00 UTC＝**日本時間 8/26 09:00**。
     基準をそのまま出すと「8/25 09:00 の予想」となり、**1日前の予想に見える**。 */
await page.evaluate(() => setWxMapWhen('ft24'));
await page.waitForTimeout(400);
v = await view();
ok(v.src.includes('fsas24'), '24時間後のタブで予想図を選ぶ', v.src);
ok(/8\/26 09:00/.test(v.when),
  '★★★予想図の対象時刻は基準＋24時間（基準をそのまま出さない）', v.when);
ok(/予想/.test(v.when), '予想であることを明示する', v.when);

/* --- 場面3: 配信されていない種類で落ちないこと --- */
await page.evaluate(() => setWxMapWhen('ft48'));
await page.waitForTimeout(300);
v = await view();
ok(!v.imgShown && v.msgShown, '★空の種類では画像を出さない', v);
ok(/配信されていません/.test(v.msg), '★理由を出す（黙って空にしない）', v.msg);

/* --- 場面4: 範囲の切り替え --- */
await page.evaluate(() => { setWxMapWhen('now'); setWxMapArea('asia'); });
await page.waitForTimeout(400);
v = await view();
ok(v.src.includes('JCP600x512'), '★アジア広域に切り替わる', v.src);
ok(/8\/25 15:00/.test(v.when), 'アジア図の時刻（06:00Z→15:00 JST）', v.when);

/* --- 場面5: 一覧が引けないときに理由を出すこと --- */
await page.evaluate(() => { wxMapList = null; });
listMode = 'fail';
await page.evaluate(() => { setWxMapArea('near'); });
await page.waitForTimeout(500);
v = await view();
ok(!v.imgShown && v.msgShown, '★一覧が引けなければ画像を出さない', v);
ok(/取得できません/.test(v.msg), '★★理由を出す（白い画面で放置しない）', v.msg);
listMode = 'ok';

/* --- 場面6: 画像が取れないときに理由を出すこと --- */
await page.evaluate(() => { wxMapList = null; });
pngMode = 'fail';
await page.evaluate(() => { setWxMapWhen('now'); });
await page.waitForTimeout(700);
v = await view();
ok(!v.imgShown && v.msgShown, '★画像が取れなければ出さない', v);
ok(/取得できませんでした/.test(v.msg), '★★理由を出す', v.msg);
pngMode = 'ok';

/* --- 場面7: 一覧は取り直さない（開くたびに叩かない） --- */
await page.evaluate(() => { wxMapList = null; });
const before = listHits;
await page.evaluate(() => { setWxMapWhen('now'); });
await page.waitForTimeout(500);
await page.evaluate(() => { setWxMapWhen('ft24'); setWxMapArea('asia'); setWxMapWhen('now'); });
await page.waitForTimeout(500);
ok(listHits - before === 1, '★一覧は1回だけ引く（切り替えるたびに叩かない）',
  { 増えた回数: listHits - before });

/* --- 場面8: フッターから開けること --- */
await page.evaluate(() => closeWxMap());
/* ⚠ 気象データの取得を止めてあるので読み込みの覆いが出たままになる。
     これは検査の都合であって不具合ではないので、どかしてからボタンを押す
     （押せること自体を見たいので、`click()` を直接呼ばずに本物のタップにする）。 */
await page.evaluate(() => { document.getElementById('loading-overlay').style.display = 'none'; });
await page.click('#btn-wxmap');
await page.waitForTimeout(300);
ok((await view()).open, '★フッターのボタンから開ける');

/* --- 場面9: タップで原寸に切り替わること ---
   ⚠ 天気図は600px幅の絵。390pxの画面に収めると前線記号や気圧の数字が潰れて読めない。
   ⚠ **拡大したまま別の図に切り替えない。** いきなり隅が映って迷子になる。 */
await page.evaluate(() => { wxMapList = null; setWxMapArea('near'); setWxMapWhen('now'); });
await page.waitForTimeout(600);
const zoom = await page.evaluate(async () => {
  const img = document.getElementById('wxmap-img');
  const stage = document.getElementById('wxmap-stage');
  const before = img.classList.contains('zoom');
  img.click();
  const after = img.classList.contains('zoom');
  const hint = document.getElementById('wxmap-hint').textContent;
  const staged = stage.classList.contains('zoomed');
  // 別の図に切り替えると畳まれること
  setWxMapWhen('ft24');
  await new Promise(r => setTimeout(r, 300));
  return { before, after, hint, staged, afterSwitch: img.classList.contains('zoom') };
});
ok(zoom.before === false && zoom.after === true, '★タップで原寸に切り替わる', zoom);
ok(/縮小/.test(zoom.hint), '案内の文言も切り替わる', zoom.hint);
ok(zoom.staged, '枠の寄せ方も原寸向きに変わる（中央寄せのままだと隅が見えない）', zoom);
ok(zoom.afterSwitch === false, '★★図を切り替えたら拡大は畳む', zoom);

ok(errors.length === 0, 'ページ内で例外が出ていない', errors);
await page.screenshot({ path: path.join(ROOT, 'tests', 'smoke_wxmap.png') });
await browser.close();

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WXMAP SMOKE FAILED');
  process.exit(1);
}
console.log('WXMAP SMOKE PASSED');
