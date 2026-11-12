/* 起動の内訳の計測（v4.185.0・#227）。
 * 「PWA の初回が 8〜10 秒」の内訳を実機で読むため、起動の各段に印を付けて端末の中に直近10件を残し、
 * 地図のレイヤーパネルの下の方（「地図を開いた回数」の上）に出す。
 *
 * ⚠⚠ **測るだけ。起動の流れは変えない。** 印が待ち合わせ・順序・戻り値を変えていないことは、
 *    既存の smoke_offline（6秒の先出し・追い越し）・smoke_bootgeo（位置情報待ち）が見る。
 * ⚠⚠ 記録に緯度経度・地点名を入れない。外へは何も送らない。
 * ⚠⚠ 経路ごとに印の有無と順序が違う（先出しでは apply が wxJson より先・控えだけなら wxJson が無い）。
 *    先出しの後に届いた通信の時間が、記録から漏れないこと（同じ記録に足す）。
 * ⚠ localStorage が使えなくても起動する。表示は壊れず「読めません」と言う。
 * ⚠ ホーム画面の PWA は index.html から入る。入口のぶんは移った先の時計に乗らないので、出発時刻の差で測る。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const NM = path.join(ROOT, 'tests/node_modules');
const UPLOT_JS = fs.readFileSync(NM + '/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(NM + '/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(NM + '/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(NM + '/leaflet/dist/leaflet.css', 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };

/* ---- 気象データの作り物 ---- */
const pad = n => String(n).padStart(2, '0');
const LEVELS = [925, 900, 850, 800, 700, 600];
function fakeWeather() {
  const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - 3);
  const time = Array.from({ length: 288 }, (_, i) => {
    const d = new Date(start.getTime() + i * 3600e3);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
  });
  const fill = v => time.map(() => v);
  const h = { time, temperature_2m: fill(5), apparent_temperature: fill(2), precipitation: fill(0),
    snowfall: fill(0), surface_pressure: fill(1013), windspeed_10m: fill(6), winddirection_10m: fill(270),
    windgusts_10m: fill(9), weathercode: fill(2), cloudcover: fill(40),
    cloud_cover_low: fill(30), cloud_cover_mid: fill(20), cloud_cover_high: fill(10) };
  for (const p of LEVELS) { h[`wind_speed_${p}hPa`] = fill(8); h[`wind_direction_${p}hPa`] = fill(300); }
  const daily = { time: [], sunrise: [], sunset: [] };
  for (let dd = 0; dd < 13; dd++) {
    const b = new Date(start.getTime() + dd * 24 * 3600e3);
    const ds = `${b.getFullYear()}-${pad(b.getMonth() + 1)}-${pad(b.getDate())}`;
    daily.time.push(ds); daily.sunrise.push(`${ds}T04:40`); daily.sunset.push(`${ds}T19:00`);
  }
  return { hourly: h, daily, elevation: 1200 };
}

const KEY = 'sotoki.boot.log';
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });

/* 1つの文脈を作る。net … { online, slowMs, htmlDelay } を外から動かす */
async function open({ last = true, breakStorage = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, timezoneId: 'Asia/Tokyo' });
  const page = await ctx.newPage();
  const net = { online: true, slowMs: 0, htmlDelay: 0 };
  const errors = [], dialogs = [], outbound = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });
  await page.route('**/*', async route => {
    const req = route.request(), url = req.url();
    if (url === 'https://sotoki.test/index.html') return route.fulfill({ contentType: 'text/html', body: INDEX });
    if (url === 'https://sotoki.test/sotoki_v4.html') {
      if (net.htmlDelay) await new Promise(r => setTimeout(r, net.htmlDelay));
      return route.fulfill({ contentType: 'text/html', body: HTML });
    }
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
    if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
    if (url.includes('api.open-meteo.com')) {
      if (!net.online) return route.abort();
      if (net.slowMs && url.includes('models=jma_seamless')) await new Promise(r => setTimeout(r, net.slowMs));
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(fakeWeather()) });
    }
    // 計測のための送信が無いこと（記録の中身を外へ出していない）
    if (/boot/i.test(url.replace('https://sotoki.test/', '')) || req.method() === 'POST') outbound.push(url);
    return route.fulfill({ status: 404, body: '' });
  });
  await page.addInitScript(([useLast, brk]) => {
    if (useLast && !localStorage.getItem('sotoki_last')) {
      localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.123, lon: 138.456, name: 'テスト地点' }));
    }
    if (brk) {
      // 起動の内訳の鍵だけ読み書きできない端末
      const g = Storage.prototype.getItem, s = Storage.prototype.setItem;
      Storage.prototype.getItem = function (k) { if (k === 'sotoki.boot.log') throw new Error('読めない'); return g.call(this, k); };
      Storage.prototype.setItem = function (k, v) { if (k === 'sotoki.boot.log') throw new Error('書けない'); return s.call(this, k, v); };
    }
  }, [last, breakStorage]);
  const log = () => page.evaluate(k => JSON.parse(localStorage.getItem(k) || '[]'), KEY);
  const rendered = () => page.waitForFunction(() => typeof chartsReady !== 'undefined' && chartsReady, null, { timeout: 15000 });
  return { ctx, page, net, errors, dialogs, outbound, log, rendered };
}
const ordered = (m, keys) => {
  const have = keys.filter(k => Number.isFinite(m[k]));
  return have.every((k, i) => i === 0 || m[have[i - 1]] <= m[k]);
};

/* ============ A. ふつうの起動（通信で取れた） ============ */
{
  const s = await open();
  await s.page.goto('https://sotoki.test/sotoki_v4.html');
  await s.rendered();
  await s.page.waitForFunction(k => (JSON.parse(localStorage.getItem(k) || '[]')[0] || { m: {} }).m.paint != null, KEY, { timeout: 5000 }).catch(() => {});
  let log = await s.log();
  ok(log.length === 1, 'A: 起動すると記録が1件残る', log.length);
  const rec = log[0] || { m: {} };
  ok(rec.out === 'net', 'A: 通信で取れた起動は out=net', rec.out);
  const need = ['script', 'boot', 'wx0', 'wxRes', 'wxJson', 'dem1', 'apply', 'render0', 'render1', 'paint'];
  ok(need.every(k => Number.isFinite(rec.m[k])), 'A: 印がそろう', rec.m);
  ok(ordered(rec.m, ['script', 'boot', 'wx0', 'wxRes', 'wxJson', 'apply', 'render0', 'render1', 'paint']), 'A: 印が順に並ぶ', rec.m);
  ok(rec.m.dem1 >= rec.m.wx0 && rec.m.dem1 <= rec.m.apply, 'A: 標高は予報と並行で、描画の前に決着する（ADR-0006 の待ち合わせのまま）', rec.m);
  ok(rec.m.geo0 === undefined, 'A: 前回の地点があれば位置情報待ちの印は無い', rec.m);
  ok(rec.over === false && rec.err === false, 'A: 追い越し・通信の失敗の印は立たない', rec);
  ok(/^v4\.\d+\.\d+$/.test(rec.v), 'A: 版が入る', rec.v);
  ok(Math.abs(rec.t - Date.now()) < 60000, 'A: 読み込み開始の時刻が入る', rec.t);
  // ⚠ 位置・地点名を入れない
  const raw = JSON.stringify(log);
  ok(!/テスト地点|36\.123|138\.456|"lat"|"lon"|"name"/.test(raw), 'A: 記録に緯度経度・地点名が無い', raw.slice(0, 300));
  ok(s.outbound.length === 0, 'A: 計測のための送信が無い', s.outbound);

  /* ---- 表示（レイヤーパネルの下の方。最下段は「地図を開いた回数」のまま＝smoke_mapopens） ---- */
  const view = await s.page.evaluate(() => {
    refreshBootLogView();
    const el = document.getElementById('layer-boot-view');
    return { text: el.textContent, rows: el.querySelectorAll('.boot-table tbody tr').length,
             labels: [...el.querySelectorAll('.boot-table tbody td:first-child')].map(td => td.textContent),
             inPanel: !!document.querySelector('#layer-boot ~ #layer-opens'),
             copy: bootLogText() };
  });
  ok(/合計 \d+\.\d\d秒（通信で取得/.test(view.text), 'A: 見出しに合計と経路が出る', view.text.slice(0, 120));
  ok(['プログラムの準備', '予報の取得', '標高の取得', '描画の準備', '描画', '画面に出るまで'].every(l => view.labels.includes(l)), 'A: 表に各段が出る', view.labels);
  ok(!view.labels.includes('位置情報待ち') && !view.labels.includes('控えを出すまで') && !view.labels.includes('入口（index.html）'), 'A: 通らなかった段は出さない', view.labels);
  ok(view.inPanel, 'A: 置き場は「地図を開いた回数」の上（最下段は回数のまま）');
  ok(/raw \{"t":\d+/.test(view.copy) && view.copy.includes('予報の取得'), 'A: コピーの文面に行と生の値が入る', view.copy.slice(0, 200));

  /* ---- 開き直すと2件目。同じ起動は置き換え ---- */
  await s.page.reload();
  await s.rendered();
  log = await s.log();
  ok(log.length === 2 && log[1].t > log[0].t, 'A: 開き直すと2件目が足される', log.map(r => r.t));
  const older = await s.page.evaluate(() => { refreshBootLogView(); return document.querySelectorAll('#layer-boot-view .boot-older div').length; });
  ok(older === 1, 'A: 以前の起動は1行ずつ出る', older);

  /* ---- 純関数 ---- */
  const p = await s.page.evaluate(() => {
    const out = {};
    let log = null;
    for (let i = 1; i <= 12; i++) log = bootLogPush(log, { t: i, m: { render1: i } });
    out.keep = log.map(r => r.t);
    out.replace = bootLogPush(log, { t: 12, m: { render1: 99 } }).map(r => r.m.render1).slice(-2);
    out.broken = bootLogPush([null, 'x', { t: 'a', m: {} }, { t: 5 }, { t: 6, m: { render1: 1 } }], { t: 7, m: {} }).map(r => r.t);
    out.notArray = bootLogPush({ a: 1 }, { t: 1, m: {} }).length;
    // 通信で取れた起動（入口つき）
    const net = { t: 0, v: 'v4.185.0', out: 'net', sw: true, on: true,
      m: { script: 900, boot: 1400, wx0: 1400, wxRes: 3900, wxJson: 4000, dem1: 2200, apply: 4010, render0: 4050, render1: 4800, paint: 4830 },
      nav: { fs: 5, ws: 2, rs: 600, re: 800, type: 'navigate', size: 300000 }, hop: { ms: 1200, now: 700 } };
    out.netRows = bootRows(net).map(r => [r.label, r.start, r.dur]);
    out.netTotal = bootTotal(net);
    out.netHead = bootHeadline(net);
    out.netNote = bootRows(net).find(r => r.label === '画面（HTML）の取得').note;
    // 先出し（控えを先に出し、通信はまだ届いていない）
    const soft = { t: 0, v: 'v', out: 'soft', sw: true, on: true, m: { script: 500, boot: 900, wx0: 900, dem1: 1500, apply: 6950, render0: 6990, render1: 7600 }, nav: null, hop: null };
    out.softRows = bootRows(soft).map(r => [r.label, r.start, r.dur, r.note]);
    out.softTotal = bootTotal(soft);
    // 描画に至らず
    const fail = { t: 0, v: 'v', out: 'fail', sw: false, on: false, err: true, m: { script: 500, boot: 900, wx0: 900 }, nav: { fs: 1, ws: 0, rs: 100, re: 200, type: 'reload' }, hop: null };
    out.failTotal = bootTotal(fail);
    out.failHead = bootHeadline(fail);
    out.failWx = bootRows(fail).find(r => r.label === '予報の取得');
    // 逆転した印（時計のずれ）は負にしない
    out.clamp = bootRows({ m: { script: 300, boot: 200 }, nav: { re: 400, rs: 100, ws: 0 } }).map(r => r.dur);
    out.empty = bootRows(null).length > 0 && bootTotal(null) === null;
    return out;
  });
  ok(JSON.stringify(p.keep) === JSON.stringify([3, 4, 5, 6, 7, 8, 9, 10, 11, 12]), '純: 直近10件に切る', p.keep);
  ok(JSON.stringify(p.replace) === JSON.stringify([11, 99]), '純: 同じ起動（t が同じ）は置き換える', p.replace);
  ok(JSON.stringify(p.broken) === JSON.stringify([6, 7]) && p.notArray === 1, '純: 壊れた値は捨てる', [p.broken, p.notArray]);
  const row = (rows, label) => rows.find(r => r[0] === label);
  ok(JSON.stringify(row(p.netRows, '入口（index.html）')) === JSON.stringify(['入口（index.html）', null, 1200]), '純: 入口の行', p.netRows[0]);
  ok(JSON.stringify(row(p.netRows, '画面（HTML）の取得')) === JSON.stringify(['画面（HTML）の取得', 0, 800]), '純: HTML の取得は 0 から受信の終わりまで', p.netRows);
  ok(/SW の起動 0\.00・応答まで 0\.60／受信 0\.20/.test(p.netNote), '純: HTML の取得の内訳（応答まで・受信）', p.netNote);
  ok(row(p.netRows, '解析〜プログラム開始')[2] === 100 && row(p.netRows, 'プログラムの準備')[2] === 500, '純: 解析・準備', p.netRows);
  ok(row(p.netRows, '予報の取得')[2] === 2600 && row(p.netRows, '標高の取得')[2] === 800, '純: 予報・標高は取得の開始から', p.netRows);
  ok(row(p.netRows, '描画の準備')[2] === 40 && row(p.netRows, '描画')[2] === 750 && row(p.netRows, '画面に出るまで')[2] === 30, '純: 描画', p.netRows);
  ok(p.netTotal === 6030, '純: 合計＝入口＋画面に出るまで', p.netTotal);
  ok(/合計 6\.03秒（通信で取得）/.test(p.netHead), '純: 見出し', p.netHead);
  const softWx = row(p.softRows, '予報の取得');
  ok(softWx[2] === null && softWx[3] === '届く前に記録', '純: 先出しでは予報の所要は「—」（届く前）', softWx);
  ok(row(p.softRows, '控えを出すまで')[2] === 6050 && p.softTotal === 7600, '純: 先出しは控えを出すまでの時間を出す', p.softRows);
  ok(p.failTotal === null && /合計 —（描画に至らず・SW なし・圏外・再読み込み（reload））/.test(p.failHead), '純: 描画に至らない起動', p.failHead);
  ok(p.failWx.dur === null && p.failWx.note === '通信で取れなかった', '純: 通信で取れなかったと言う', p.failWx);
  ok(p.clamp.every(d => d === null || d >= 0), '純: 所要を負にしない', p.clamp);
  ok(p.empty, '純: 空の記録でも落ちない');
  ok(s.errors.length === 0, 'A: 例外が出ない', s.errors);
  await s.ctx.close();
}

/* ============ B. 入口（index.html）した時間 ============ */
{
  const s = await open();
  s.net.htmlDelay = 400;
  await s.page.goto('https://sotoki.test/index.html');
  await s.page.waitForURL('**/sotoki_v4.html');
  await s.rendered();
  const rec = (await s.log())[0] || { m: {} };
  ok(rec.hop && rec.hop.ms >= 0 && rec.hop.ms < 10000 && Number.isFinite(rec.hop.now), 'B: 入口を経由した時間が入る', rec.hop);
  // 入口の出発から数えて、本体の HTML が届くまで 400ms 以上かかっている
  ok(rec.hop && rec.nav && rec.hop.ms + rec.nav.re >= 380, 'B: 入口＋本体の取得が、遅らせた時間より短くならない', [rec.hop, rec.nav]);
  const left = await s.page.evaluate(() => sessionStorage.getItem('sotoki.boot.hop'));
  ok(left === null, 'B: 出発時刻は読んだら消す', left);
  const label = await s.page.evaluate(() => bootRows(loadBootLog()[0])[0].label);
  ok(label === '入口（index.html）', 'B: 表の先頭に入口の行', label);
  // 再読み込みでは入口を通らない＝前の値を数えない
  await s.page.reload();
  await s.rendered();
  const log = await s.log();
  ok(log.length === 2 && log[1].hop === null, 'B: 再読み込みに前の入口の時間を付けない', log[1] && log[1].hop);
  ok(s.errors.length === 0, 'B: 例外が出ない', s.errors);
  await s.ctx.close();
}

/* ============ C. 前回の地点が無い起動（位置情報待ち） ============ */
{
  const s = await open({ last: false });
  await s.page.goto('https://sotoki.test/sotoki_v4.html');
  await s.rendered();
  const rec = (await s.log())[0] || { m: {} };
  ok(Number.isFinite(rec.m.geo0) && Number.isFinite(rec.m.geo1), 'C: 位置情報待ちの印が入る', rec.m);
  ok(ordered(rec.m, ['script', 'boot', 'geo0', 'geo1', 'wx0', 'wxJson', 'apply', 'render0', 'render1']), 'C: 印が順に並ぶ', rec.m);
  const labels = await s.page.evaluate(() => bootRows(loadBootLog()[0]).map(r => r.label));
  ok(labels.includes('位置情報待ち'), 'C: 表に位置情報待ちが出る', labels);
  await s.ctx.close();
}

/* ============ D. 圏外・控え無し（描画に至らない起動も残す） ============ */
{
  const s = await open();
  s.net.online = false;
  await s.page.goto('https://sotoki.test/sotoki_v4.html');
  await s.page.waitForFunction(k => JSON.parse(localStorage.getItem(k) || '[]').length === 1, KEY, { timeout: 10000 }).catch(() => {});
  const rec = (await s.log())[0] || { m: {} };
  ok(rec.out === 'fail' && rec.err === true, 'D: 描画に至らない起動は out=fail で残す', rec);
  ok(rec.m.render1 === undefined && rec.m.wxJson === undefined && Number.isFinite(rec.m.wx0), 'D: 通らなかった印は無い', rec.m);
  const head = await s.page.evaluate(() => bootHeadline(loadBootLog()[0]));
  ok(/合計 —（描画に至らず/.test(head), 'D: 見出しは合計を出さず理由を言う', head);
  await s.ctx.close();
}

/* ============ E. 弱電波：控えを先に出し、あとから届いた通信の時間を同じ記録に足す ============ */
{
  const s = await open();
  await s.page.goto('https://sotoki.test/sotoki_v4.html');   // 1回目：控えを作る
  await s.rendered();
  await s.page.waitForTimeout(500);
  s.net.slowMs = 7500;                                        // 2回目：6秒の見切りより遅い
  await s.page.reload();
  await s.rendered();
  let log = await s.log();
  let rec = log[1] || { m: {} };
  ok(log.length === 2 && rec.out === 'soft', 'E: 控えを先に出した起動は out=soft', [log.length, rec.out]);
  ok(rec.m.wxJson === undefined && rec.m.apply - rec.m.wx0 >= 5900, 'E: 先出しの時点では通信はまだ届いていない', rec.m);
  const softLabels = await s.page.evaluate(() => bootRows(loadBootLog()[1]).map(r => r.label));
  ok(softLabels.includes('控えを出すまで'), 'E: 表に「控えを出すまで」が出る', softLabels);
  // 通信が届いたら、同じ記録に足される（件数は増えない・経路は soft のまま）
  await s.page.waitForFunction(k => (JSON.parse(localStorage.getItem(k) || '[]')[1] || { m: {} }).m.wxJson != null, KEY, { timeout: 6000 }).catch(() => {});
  log = await s.log();
  rec = log[1] || { m: {} };
  ok(log.length === 2 && rec.out === 'soft', 'E: 届いた後も同じ1件（置き換え）', [log.length, rec.out]);
  ok(Number.isFinite(rec.m.wxJson) && rec.m.wxJson - rec.m.wx0 >= 7000 && rec.m.wxJson > rec.m.render1, 'E: 先出しの後に届いた通信の時間が記録に入る', rec.m);
  ok(s.errors.length === 0, 'E: 例外が出ない', s.errors);
  await s.ctx.close();
}

/* ============ F. 記録を読み書きできない端末でも起動する ============ */
{
  const s = await open({ breakStorage: true });
  await s.page.goto('https://sotoki.test/sotoki_v4.html');
  await s.rendered();
  const r = await s.page.evaluate(() => {
    refreshBootLogView();
    return { overlay: getComputedStyle(document.getElementById('loading-overlay')).display,
             view: document.getElementById('layer-boot-view').textContent, done: bootTime.done };
  });
  ok(r.overlay === 'none' && r.done, 'F: 書けなくても起動は最後まで進む', r);
  ok(r.view === '記録を読めません', 'F: 読めないときは「読めません」と言う（0件と区別する）', r.view);
  ok(s.errors.length === 0 && s.dialogs.length === 0, 'F: 例外も警告も出ない', [s.errors, s.dialogs]);
  await s.ctx.close();
}

await browser.close();
if (fails.length) {
  console.error('✗ smoke_boottime\n  - ' + fails.join('\n  - '));
  process.exit(1);
}
console.log('✓ smoke_boottime（起動の内訳：印の順序・経路ごとの記録・入口の時間・先出しの後の追記・位置を入れない・書けなくても起動）');
