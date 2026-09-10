/* 説明ページ（about.html）。
 *
 * なぜ要るか:
 *   「友人にこのアプリの判断基準・データの出どころ・作りの経緯を説明したい」から作った公開ページ。
 *   ⚠⚠ **いちばん危ないのは、書いてある閾値が本体とずれること。**
 *   人はページの数字を信じて山へ行く。⚠ 判定の数字が2か所にあるのが本質的な危うさなので、
 *   **`THRESH` から組み立てた文字列がページに載っているか**で突き合わせる
 *   （「それらしい数字があるか」では、片方だけ変えたときに素通りする）。
 *
 * ⚠ このリポジトリは public で、このページは GitHub Pages から誰でも読める。
 *   別プロジェクトの語（院内・KYT 等）が紛れ込んでいないことも見る
 *   → 実際に施設名を書いて公開し、リポジトリを作り直した（ADR-0009）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const ABOUT = fs.readFileSync(path.join(ROOT, 'about.html'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

/* ============ 1. ⚠⚠ 閾値が本体と一致する ============
   本体の THRESH をそのまま読み出し、ページに載るはずの文言を組み立てて突き合わせる。
   ⚠ 閾値を調整したらこのページも直す——ここが知らせる。 */
const m = APP.match(/const THRESH = \{([\s\S]*?)\n\};/);
ok(!!m, '★前提: 本体から THRESH を読み出せる（検査が空振りしていない）');
let T = null;
if (m) {
  T = new Function(`return {${m[1]}}`)();
  ok(typeof T.day?.windA === 'number' && typeof T.apparentB === 'number',
    '★前提: THRESH の中身が読めている', T);
}

if (T) {
  const d = T.day;
  const want = [
    // 風速（日帰り）
    `${d.windA} m/s 未満`, `${d.windA} 〜 ${d.windB} m/s`, `${d.windB} m/s 以上`,
    // 体感温度（低いほど悪い）
    `${T.apparentA}℃ より上`, `${T.apparentB} 〜 ${T.apparentA}℃`, `${T.apparentB}℃ 以下`,
    // 降雪
    `${T.snowA} cm/h 未満`, `${T.snowA} 〜 ${T.snowB} cm/h`, `${T.snowB} cm/h 以上`,
    // 降水
    `${T.rainA} mm/h 未満`, `${T.rainA} 〜 ${T.rainB} mm/h`, `${T.rainB} mm/h 以上`,
    // 6時間の気圧変化
    `${T.dpressA} hPa 未満`, `${T.dpressA} 〜 ${T.dpressB} hPa`, `${T.dpressB} hPa 以上`,
  ];
  for (const w of want) {
    ok(ABOUT.includes(w), `★★★説明ページの閾値が本体と一致（「${w}」が載っている）`);
  }
}

/* ============ 2. ⚠ 免責が消えていない ============
   判断に使うページなので、ここが抜けたまま公開されるのがいちばん困る。 */
for (const phrase of [
  '予報であって、保証ではありません',
  '最終的な判断は必ずご自身で',
  '山の天気は急変します',
]) {
  ok(ABOUT.includes(phrase), `★★★免責が残っている（「${phrase}」）`);
}

/* ============ 3. 出典表記が消えていない ============
   ⚠ 地理院・OSM・Esri は**表示することが利用条件**。省略・非表示にしない。 */
for (const src of ['Open-Meteo', '国土地理院', '気象庁', 'OpenStreetMap', 'Esri']) {
  ok(ABOUT.includes(src), `★出典が載っている（${src}）`);
}

/* ============ 4. アプリとページが互いにつながっている ============ */
ok(/id="about-link"[^>]*href="about\.html"/.test(APP),
  '★★アプリの版数から説明ページへ行ける（入口がある）');
/* ⚠ 右端へ寄せる margin-left:auto は**リンク側**に要る。凡例は flex で、
   並ぶのはリンク（版数の span はその中身）。span 側に付けると版数が行の途中に残る。 */
const linkCss = (APP.match(/#about-link \{[\s\S]*?\}/) || [''])[0];
ok(/margin-left:\s*auto/.test(linkCss),
  '★★版数を右端へ寄せる指定がリンク側にある（span 側では効かない）', linkCss);
ok(/<span id="app-version">/.test(APP),
  '★★版数は span のまま（release.yml と smoke_version が読む）');

/* 相対リンクの先が実在すること（GitHub Pages ではサブパス配信なので絶対パスは使えない） */
for (const href of [...ABOUT.matchAll(/(?:href|src)="(?!https?:|#|mailto:)([^"]+)"/g)].map(x => x[1])) {
  ok(fs.existsSync(path.join(ROOT, href)), `★相対リンクの先が実在する（${href}）`);
}

/* ============ 5. ⚠ 公開してはいけない語が無い ============
   このリポジトリは public。実際に施設名を書いて公開し、作り直した（ADR-0009）。
   ⚠ `git push --force` では消えない（refs/pull/* が残る）。 */
for (const banned of ['院内', 'KYT', 'インシデント', '手術室', '青空文庫', 'BlogAutoPost']) {
  ok(!ABOUT.includes(banned),
    `★★★別プロジェクト・非公開の語が混ざっていない（${banned}）`,
    (ABOUT.match(new RegExp('.{0,40}' + banned + '.{0,40}')) || [])[0]);
}

/* ============ 6. 体裁 ============ */
ok(/<meta name="viewport"[^>]*width=device-width/.test(ABOUT), '★スマホ幅に追従する');
ok(/<title>[^<]+<\/title>/.test(ABOUT), '★表題がある');
ok(/prefers-color-scheme:\s*dark/.test(ABOUT), '★暗い配色に追従する（アプリと揃える）');
/* ⚠ 表は狭い画面ではみ出す。横に流す箱に入っていること（本文まで横スクロールさせない） */
const tables = (ABOUT.match(/<table/g) || []).length;
const tws = (ABOUT.match(/<div class="tw">/g) || []).length;
ok(tables > 0 && tws === tables,
  '★★表はすべて横スクロールの箱に入っている（本文を横に流さない）', { tables, tws });

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('ABOUT SMOKE FAILED');
  process.exit(1);
}
console.log('ABOUT SMOKE PASSED');
