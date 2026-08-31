/* 予報の確からしさの目安（リードタイム）。
 * 「週末など、だいぶ先の予報は精度が怪しいと分かるようにしたい」という要望から。
 *
 * ⚠⚠ **いちばん危ないのは、目安を「実測した精度」に見せること。**
 *   85% のような数字を根拠なく出すと、出さないより悪い——判断を誤らせる。
 *   ここでは「何日先か」から引いた目安しか出さないこと、
 *   **画面に「目安」と書いてあること**を検査する。
 *
 * ⚠ **ABC評価には一切関与させない。** 表示だけ。
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

/* --- 原文を読む静的検査 --- */
const a = HTML.indexOf('/* ------ 予報の確からしさの目安（リードタイム） ------');
const b = HTML.indexOf('// 選択情報ポップアップの中身を更新');
ok(a > 0 && b > a, '節が見つかる（検査が空振りしていない）', { a, b });
const raw = HTML.slice(a, b);
const section = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
ok(/forecastLead/.test(section), '注記を落としても中身が残っている');
// ⚠ ABC評価に触れない
for (const banned of ['judgePoint', 'abcScoreInv', 'abcScore', 'THRESH']) {
  ok(!section.includes(banned), `★★ABC評価に触れない（${banned}）`,
    (section.match(new RegExp('.*' + banned + '.*')) || [])[0]);
}
// ⚠ 的中率のような数値を作らない
ok(!/%/.test(section), '★★★的中率のような割合を作らない', (section.match(/.*%.*/) || [])[0]);

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 780 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.route('**/*', route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
  return route.abort();
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(400);

// 基準時刻を固定して、そこから h 時間先を渡す
const lead = h => page.evaluate(hh => {
  const now = new Date('2026-01-10T09:00:00');
  const t = new Date(now.getTime() + hh * 3600000);
  const l = forecastLead(t, now);
  return { l, text: forecastLeadText(l) };
}, h);

/* --- 場面1: 近い予報・実績には出さない ---
   ⚠ 近い予報にまで出すと**狼少年**になり、本当に怪しいときの印が効かなくなる。 */
ok((await lead(-24)).l === null, '★実績（過去）には出さない');
ok((await lead(0)).l === null, '★いまには出さない');
ok((await lead(24)).l === null, '★★翌日には出さない（狼少年にしない）');
ok((await lead(47)).l === null, '境目の手前では出さない');

/* --- 場面2: 2日先から「中」 --- */
const l48 = await lead(48);
ok(l48.l && l48.l.level === 'mid', '★48時間先から出る（確度 中）', l48);
ok(/2日先/.test(l48.text) && /中/.test(l48.text), '何日先かと確度を書く', l48.text);

const l96 = await lead(96);
ok(l96.l && l96.l.level === 'mid' && /4日先/.test(l96.text), '4日先も「中」', l96.text);

/* --- 場面3: 5日先を超えたら「低」 --- */
const l120 = await lead(120);
ok(l120.l && l120.l.level === 'low' && /5日先/.test(l120.text), '★★5日先から「低」', l120.text);
const l168 = await lead(168);
ok(l168.l && l168.l.level === 'low' && /7日先/.test(l168.text), '7日先も「低」', l168.text);

/* --- 場面4: 日数の丸め（100時間＝4.17日→4日） --- */
ok(/4日先/.test((await lead(100)).text), '日数は四捨五入して出す', (await lead(100)).text);

/* --- 場面5: 「目安」と伝えること（本丸） ---
   ⚠ 数字を出さないだけでは足りない。**目安であることが画面から分かる**必要がある。 */
const title = await page.evaluate(() => LEAD_TITLE);
ok(/目安/.test(title), '★★★目安であると明記する', title);
ok(/的中率|実測/.test(title), '★★実測した的中率ではないと明記する', title);

/* --- 場面6: 画面に出る場所があること --- */
const dom = await page.evaluate(() => {
  const pop = document.getElementById('pop-lead');
  const rank = document.getElementById('rank-lead');
  if (!pop) return { pop: false };
  // 中身が空のときは場所を取らないこと（近い予報で余白が空くのを防ぐ）
  pop.textContent = '';
  const emptyHidden = getComputedStyle(pop).display === 'none';
  pop.textContent = '5日先・確度低';
  pop.className = 'pop-lead low';
  const st = getComputedStyle(pop);
  return { pop: true, rank: !!rank, emptyHidden, shown: st.display !== 'none', color: st.color,
    size: parseFloat(st.fontSize) };
});
ok(dom.pop && dom.rank, '★ポップアップとランキングの両方に出す場所がある', dom);
ok(dom.emptyHidden, '★空のときは場所を取らない', dom);
ok(dom.shown, '中身があれば出る', dom);
ok(dom.size >= 9, '★小さすぎない（判断を左右する注記なので読める大きさ）', dom.size);
ok(dom.color !== 'rgb(0, 0, 0)', '確度に応じた色が付く', dom.color);

ok(errors.length === 0, 'ページ内で例外が出ていない', errors);
await browser.close();

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('LEAD SMOKE FAILED');
  process.exit(1);
}
console.log('LEAD SMOKE PASSED');
