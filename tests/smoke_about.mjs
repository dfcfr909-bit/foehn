/* 説明ページ（about.html）。
 *
 * なぜ要るか:
 *   ⚠ **これは「友人に配る」ページではなく、利用者自身が説明するときの手元資料**
 *   （「友人から尋ねられた際に、ここからこう引いてこう解釈している、と説明するために欲しい」）。
 *   だから **GitHub への案内は置かない**（そこから別プロジェクトの記述に辿れるため。ADR-0009）。
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
  /* ⚠ **行ごとに突き合わせる。** 最初は本文全体に対する includes で見ていたが、
     単位を項目名の側へ出して値が短くなったため、たとえば「5 未満」が
     **降雪の「0.5 未満」に含まれてしまい**、風速の行が間違っていても素通りする。
     表を行に分け、**その行の A/B/C セルが期待どおりか**を見る。 */
  const tbl = (ABOUT.match(/<table class="judge">[\s\S]*?<\/table>/) || [''])[0];
  ok(tbl.length > 0, '★前提: 判定表が見つかる（検査が空振りしていない）');
  const rows = [...tbl.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(r => r[1]);
  const cellsOf = name => {
    const row = rows.find(r => r.includes(`>${name} `) || r.includes(`>${name}<`));
    if (!row) return null;
    return [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(c => c[1].trim());
  };
  const expect = [
    ['風速',       [`${d.windA} 未満`,    `${d.windA} 〜 ${d.windB}`,       `${d.windB} 以上`]],
    ['体感温度',   [`${T.apparentA} より上`, `${T.apparentB} 〜 ${T.apparentA}`, `${T.apparentB} 以下`]],
    ['降雪',       [`${T.snowA} 未満`,   `${T.snowA} 〜 ${T.snowB}`,       `${T.snowB} 以上`]],
    ['降水',       [`${T.rainA} 未満`,   `${T.rainA} 〜 ${T.rainB}`,       `${T.rainB} 以上`]],
    ['気圧の変化', [`${T.dpressA} 未満`, `${T.dpressA} 〜 ${T.dpressB}`,   `${T.dpressB} 以上`]],
  ];
  for (const [name, want] of expect) {
    const got = cellsOf(name);
    ok(got !== null, `★前提: 「${name}」の行がある`);
    ok(got && JSON.stringify(got) === JSON.stringify(want),
      `★★★説明ページの閾値が本体と一致（${name}）`, { 期待: want, ページ: got });
  }
  /* 単位も本体と揃っていること（値だけ合っていても、単位が違えば読み手は間違える） */
  for (const u of ['m/s', '℃', 'cm/h', 'mm/h', 'hPa']) {
    ok(tbl.includes(`<small>${u}</small>`), `★単位が載っている（${u}）`);
  }
}

/* ============ 2. ⚠ 免責が消えていない ============
   判断に使うページなので、ここが抜けたまま公開されるのがいちばん困る。 */
for (const phrase of [
  '予報であって、保証ではありません',
  '最終的な判断はご自身で',
  '山の天気は急変します',
]) {
  ok(ABOUT.includes(phrase), `★★★免責が残っている（「${phrase}」）`);
}

/* ============ 2b. ⚠⚠ 妥協点の節（この資料の核） ============
   利用者が明示的に求めたのは「ABCの判断基準・**妥協点**・データの参照元」。
   ⚠ 説明できる資料であることが目的なので、**都合の悪い項目が消えていないこと**を見る。 */
ok(/id="limits"/.test(ABOUT), '★★★「どこで妥協しているか」の節がある');
for (const point of [
  '継続時間を見ていません',            // 1時間のCも6時間のCも同じ
  '稜線やコルでの増速は入っていません', // モデル格子の値であること
  '判定は寒い側だけ',                  // 熱中症の警告が無い
  '熱中症の警告は出していません',
  '画面の色と判定の閾値が食い違っています', // 気圧（既知・未修正）
  '実測した的中率ではありません',      // 確度の目安
  '斜面の標高を読み',                  // 座標ずれ
]) {
  ok(ABOUT.includes(point), `★★★妥協点が消えていない（「${point}」）`);
}

/* ============ 3. 出典表記が消えていない ============
   ⚠ 地理院・OSM・Esri は**表示することが利用条件**。省略・非表示にしない。 */
for (const src of ['Open-Meteo', '国土地理院', '気象庁', 'OpenStreetMap', 'Esri']) {
  ok(ABOUT.includes(src), `★出典が載っている（${src}）`);
}

/* ============ 3b. ⚠ GitHub への案内を置かない ============
   ⚠ **意図的に外してある。** このページから GitHub へ誘導すると、
   リポジトリの記録（ADR）にある別プロジェクト由来の記述まで辿れてしまう
   （施設名で公開事故を起こし、リポジトリを作り直した経緯がある → ADR-0009。
   `refs/pull/*` は消せないので、いまも読める）。
   ⚠ 戻したくなったときは、**この検査ごと消すこと**（黙って通さない）。 */
ok(!/github\.com/.test(ABOUT),
  '★★GitHub への案内を置かない（別プロジェクトの記述に辿れるため）',
  (ABOUT.match(/.{0,60}github\.com.{0,60}/) || [])[0]);

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
/* フッターの「ℹ️」からも開ける（版数のリンクは見つけにくい） */
ok(/id="btn-about-foot"[^>]*about\.html/.test(APP),
  '★★★フッターに「このアプリについて」の入口がある');

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
