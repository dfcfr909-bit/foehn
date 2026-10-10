/* 地図を開いた回数（#210 段階0・v4.167.0）。
 * Google マップを下地にした場合の費用の当たりをつけるため、地図画面を開いた回数を端末の中だけで数え、
 * レイヤーパネル最下段に出す。
 *
 * ⚠⚠ 開いたまま openMap() が呼ばれても数えない（二重計上しない）。
 * ⚠⚠ 日付は端末のローカル日付。UTC で組むと日本の 0〜9時が前日に入る。
 * ⚠⚠ 数え始めは日ごとの表と別に持つ。表は60日で切り落とすので、そこから取ると
 *    長く開かなかった後に「今日から」になり、平均が膨らむ。
 * ⚠ localStorage が使えなくても地図は開く。表示は壊れず「読めません」と言う。
 * ⚠ 外へは何も送らない（地図を開いても数える用の送信は無い）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const NM = path.join(ROOT, 'tests/node_modules');
const UPLOT_JS = fs.readFileSync(NM + '/uplot/dist/uPlot.iife.min.js', 'utf8');
const UPLOT_CSS = fs.readFileSync(NM + '/uplot/dist/uPlot.min.css', 'utf8');
const LEAFLET_JS = fs.readFileSync(NM + '/leaflet/dist/leaflet.js', 'utf8');
const LEAFLET_CSS = fs.readFileSync(NM + '/leaflet/dist/leaflet.css', 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, timezoneId: 'Asia/Tokyo' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const KEY = 'sotoki.map.openCount';
const outbound = [];
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('leaflet') && url.endsWith('.css')) return route.fulfill({ contentType: 'text/css', body: LEAFLET_CSS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  if (/opencount|mapopen/i.test(url) || route.request().method() === 'POST') outbound.push(url);
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.0, lon: 138.0, name: 'テスト地点' }));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(900);

/* ============ 1. 純関数 ============ */
const r = await page.evaluate(() => {
  const out = {};
  // 日付はローカル（JST）で組む：JST 0:30 = UTC 前日 15:30
  out.jst0030 = localDayKey(new Date('2026-10-10T00:30:00+09:00'));
  // 数え始め・切り落とし
  let log = null;
  log = bumpMapOpens(log, '2026-10-01');
  log = bumpMapOpens(log, '2026-10-01');
  log = bumpMapOpens(log, '2026-10-10');
  out.basic = log;
  out.sumBasic = summarizeMapOpens(log, '2026-10-10');
  // 今日を含めて60日（08-12〜10-10）を残す。08-11 は落ちる
  const old = { since: '2026-01-01', days: { '2026-08-10': 3, '2026-08-11': 4, '2026-08-12': 5 } };
  out.trim = bumpMapOpens(old, '2026-10-10');
  // 100日空けて開く：数え始めは昔のまま、平均は30日で割る
  const far = bumpMapOpens({ since: '2026-07-01', days: { '2026-07-01': 9 } }, '2026-10-09');
  out.far = far;
  out.sumFar = summarizeMapOpens(far, '2026-10-09');
  // 時計を戻しても数え始めは書き換えない
  out.back = bumpMapOpens({ since: '2026-10-10', days: { '2026-10-10': 1 } }, '2026-10-08');
  // 壊れた値は捨てる
  out.junk = summarizeMapOpens({ since: 'x', days: { 'bad': 5, '2026-10-10': -2, '2026-10-09': 'a' } }, '2026-10-10');
  out.empty = summarizeMapOpens(null, '2026-10-10');
  return out;
});
ok(r.jst0030 === '2026-10-10', '★★日付は端末のローカル日付（JST 0:30 を前日にしない）', r.jst0030);
ok(r.basic.since === '2026-10-01' && r.basic.days['2026-10-01'] === 2 && r.basic.days['2026-10-10'] === 1,
  '★日ごとに数え、数え始めを残す', r.basic);
ok(r.sumBasic.today === 1 && r.sumBasic.sum30 === 3 && r.sumBasic.span === 10,
  '★数え始めが30日未満なら、その日から今日までの日数で割る', r.sumBasic);
ok(Math.abs(r.sumBasic.avg - 0.3) < 1e-9 && r.sumBasic.perMonth === 9 && r.sumBasic.since === '2026-10-01',
  '平均・月換算・数え始めの表示', r.sumBasic);
ok(!('2026-08-10' in r.trim.days) && !('2026-08-11' in r.trim.days) && r.trim.days['2026-08-12'] === 5,
  '★60日より古い日は落とす（境の日は残す）', r.trim.days);
ok(r.trim.since === '2026-01-01', '★★切り落としても数え始めは消えない', r.trim);
ok(r.far.since === '2026-07-01' && r.sumFar.span === 30 && r.sumFar.sum30 === 1 && r.sumFar.perMonth === 1 && r.sumFar.since === null,
  '★★★長く空けた後に開いても平均が膨らまない（30日で割る）', r.sumFar);
ok(r.back.since === '2026-10-10' && r.back.days['2026-10-08'] === 1, '時計を戻しても数え始めは消えない', r.back);
ok(r.junk.sum30 === 0 && r.junk.today === 0 && r.junk.span === 1, '壊れた値は数えない', r.junk);
ok(r.empty.today === 0 && r.empty.sum30 === 0, '記録が無くても要約できる', r.empty);

/* ============ 2. 地図を開いて数える ============ */
await page.evaluate(() => localStorage.removeItem('sotoki.map.openCount'));
await page.evaluate(() => openMap());
await page.waitForTimeout(400);
await page.evaluate(() => openMap());   // 開いたまま呼ぶ → 数えない
await page.evaluate(() => { closeMap(); openMap(); });
await page.waitForTimeout(300);
const s2 = await page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
const today = await page.evaluate(() => localDayKey(new Date()));
ok(s2 && s2.days[today] === 2 && s2.since === today, '★★開いたまま呼んでも数えない／閉じて開けば数える', s2);

await page.evaluate(() => toggleLayerPanel());
await page.waitForTimeout(200);
const view = await page.evaluate(() => {
  const el = document.getElementById('layer-map-opens');
  const panel = document.getElementById('layer-panel-body');
  return { text: el && el.textContent,
    lastIsOpens: panel && panel.lastElementChild && panel.lastElementChild.id === 'layer-opens',
    note: (document.getElementById('layer-opens-note') || {}).textContent || '' };
});
ok(/^今日 2回／直近1日 計2回（1日平均 2\.0回・月に直すと約60回・\d+\/\d+ から）$/.test(view.text || ''),
  '★レイヤーパネルに回数を出す', view.text);
ok(view.lastIsOpens, 'レイヤーパネルの最下段に置く', view);
ok(view.note.includes('外へは送らない'), '外へ送らないと書く', view.note);
await page.evaluate(() => toggleLayerPanel());

/* ============ 3. localStorage が使えなくても地図は開く ============ */
await page.evaluate(() => {
  closeMap();
  const g = Storage.prototype.getItem, s = Storage.prototype.setItem;
  window.__restoreLS = () => { Storage.prototype.getItem = g; Storage.prototype.setItem = s; };
  Storage.prototype.getItem = function (k) { if (k === 'sotoki.map.openCount') throw new Error('blocked'); return g.call(this, k); };
  Storage.prototype.setItem = function (k, v) { if (k === 'sotoki.map.openCount') throw new Error('blocked'); return s.call(this, k, v); };
});
const before = errors.length;
await page.evaluate(() => { openMap(); toggleLayerPanel(); });   // getItem も setItem も投げる
await page.waitForTimeout(300);
const broken = await page.evaluate(() => ({ open: isMapOpen(), text: document.getElementById('layer-map-opens').textContent }));
await page.evaluate(() => window.__restoreLS());
ok(broken.open, '★localStorage が投げても地図は開く', broken);
ok(broken.text === '回数を読めません', '★★読めないときは「0回」ではなく「読めません」と言う', broken.text);
ok(errors.length === before, '例外を外に漏らさない', errors.slice(before));

ok(outbound.length === 0, '★★数えたものを外へ送らない', outbound);
ok(errors.length === 0, 'ページで例外が出ない', errors);

await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
