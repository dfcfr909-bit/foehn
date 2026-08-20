/* 打とうとしている版数が、配信されるファイルの表記と一致するかを見る。
 *
 * なぜ要るか:
 *   **版数の正は `sotoki_v4.html` の `<span id="app-version">`**。画面に出るのはこれで、
 *   タグはそれを指す目印にすぎない。ところが「タグを打つ」操作だけを自動化すると、
 *   **HTMLを上げ忘れたまま v4.78.0 のタグが v4.77.0 の中身に付く**。
 *   一度付いたタグは、あとから見て中身と食い違っていることに気づけない。
 *
 *   だからワークフローには版数を**手で打たせる**。手で打った値と HTML の表記が
 *   食い違ったら止める、という二重入力の検査。**片方だけでは事故を止められない。**
 *   （HTMLから読むだけにすると「上げ忘れ」をそのまま通す。
 *     入力を信じるだけにすると「打ち間違い」をそのまま通す）
 *
 * 使い方: node scripts/checkVersion.mjs v4.78.0
 * 一致すれば exit 0、それ以外は exit 1。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = process.env.CHECK_VERSION_HTML || path.join(ROOT, 'sotoki_v4.html');
const STATUS = process.env.CHECK_VERSION_STATUS || path.join(ROOT, 'docs', 'status.md');

const want = (process.argv[2] || '').trim();
const fail = msg => { console.error(`✗ ${msg}`); process.exit(1); };

/* ⚠ **書式を先に見る。** ここを緩めると、あとで文字列としてシェルに渡る値の
     素性が分からなくなる。`v` + 数字3つ以外は受け取らない。 */
if (!/^v\d+\.\d+\.\d+$/.test(want)) {
  fail(`版数の書式が違う（受け取った値: ${JSON.stringify(want)}）。例: v4.78.0`);
}

const html = fs.readFileSync(HTML, 'utf8');
/* ⚠ **複数見つかったら落とす。** 版数の表記が2か所に増えると、
     どちらが正か分からないまま片方だけ直す事故が起きる。 */
const hits = [...html.matchAll(/<span id="app-version">([^<]*)<\/span>/g)].map(m => m[1].trim());
if (hits.length === 0) fail(`${path.basename(HTML)} に <span id="app-version"> が無い`);
if (hits.length > 1) fail(`<span id="app-version"> が${hits.length}か所ある: ${JSON.stringify(hits)}`);

const have = hits[0];
if (have !== want) {
  console.error(`✗ 版数が一致しない`);
  console.error(`    打とうとしている版数 : ${want}`);
  console.error(`    ${path.basename(HTML)} の表記 : ${have}`);
  console.error(`  → **タグを打つ前に HTML の版数を上げてマージすること。**`);
  console.error(`     順番を逆にすると、中身が古いまま新しいタグが付く。`);
  process.exit(1);
}

console.log(`✓ 版数が一致する（${have}）`);

/* status.md は**警告どまり**にする。
   ⚠ 1行目は自由文（「タグは v4.77.0 のまま＝4機能ぶん遅れている」など）で、
     版数以外の v4.x.y が混ざりうる。ここで落とすと、
     **本質でない書式のズレでリリースが止まる**。気づかせるだけでよい。 */
try {
  const first = fs.readFileSync(STATUS, 'utf8').split('\n')[0];
  const inStatus = (first.match(/v\d+\.\d+\.\d+/g) || []);
  if (inStatus.length && !inStatus.includes(want)) {
    console.log(`⚠ docs/status.md の1行目が ${JSON.stringify(inStatus.join(' '))} のまま（${want} ではない）`);
    console.log(`  リリースを止めるほどではないが、上げておくこと → docs/workflow.md`);
  }
} catch { /* 無くても止めない */ }
