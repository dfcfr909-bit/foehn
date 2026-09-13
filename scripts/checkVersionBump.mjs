/* 配信されるファイルが変わったのに版数が上がっていないときに落とす。
 *
 * なぜ要るか:
 *   タグ打ちを自動にすると（`release.yml` の `workflow_run` 経路）、
 *   **二重入力＝人が版数を手で打って HTML と突き合わせる**という守りが外れる。
 *   その二重入力が防いでいたのは「打ち間違い」と**「HTMLの上げ忘れ」**の2つで、
 *   打ち間違いは人が打たなくなれば消えるが、**上げ忘れは残る**。
 *   残る方を、人の手ではなく**この検査**で止める。
 *
 *   止めないとどうなるか: 中身だけ進んで版数が据え置かれ、
 *   **画面に出る版数と配信物が食い違ったまま**になる。利用者が「4.98.0」と言い、
 *   実際は v4.90.0 だった——版数が当てにならなくなると、この食い違いを解けない。
 *
 * 使い方:
 *   node scripts/checkVersionBump.mjs [比較先]     既定は origin/main
 *
 * 判定:
 *   中身が同じ            → 通す（版数を上げる必要はない）
 *   中身が違って版数が上  → 通す
 *   中身が違って版数が同じ／下 → 落とす
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readAppVersion, isVersion, compareVersion } from './lib/appVersion.mjs';

/* ⚠ 置き場所を差し替えられるようにしてあるのは**検査のため**（`tests/smoke_version.mjs`)。
     本物のリポジトリを触らずに、作り物の git の中で走らせて挙動を確かめる。 */
const ROOT = process.env.CHECK_BUMP_ROOT
  || path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REL = process.env.CHECK_BUMP_FILE || 'sotoki_v4.html';
const BASE = (process.argv[2] || process.env.CHECK_BUMP_BASE || 'origin/main').trim();

const fail = msg => { console.error(`✗ ${msg}`); process.exit(1); };
const version = (html, where) => {
  const r = readAppVersion(html);
  if (r.error) fail(`${where}: ${r.error}`);
  if (!isVersion(r.version)) fail(`${where}: 版数の書式が違う（${JSON.stringify(r.version)}）`);
  return r.version;
};

const headHtml = fs.readFileSync(path.join(ROOT, REL), 'utf8');
const head = version(headHtml, `いまの ${REL}`);

/* 比較先の中身を取り出す。
   ⚠ **見つからないときは通す。** 浅いクローンで比較先が取れない、
     ファイルがまだ無い、といった事情で**リリースを止めない**。
     ここは「上げ忘れに気づかせる」ための検査で、門番ではない。 */
let baseHtml = null;
try {
  baseHtml = execFileSync('git', ['show', `${BASE}:${REL}`],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch {
  console.log(`⚠ ${BASE}:${REL} が取れないので、比べずに通す`);
  process.exit(0);
}

if (baseHtml === headHtml) {
  console.log(`✓ ${REL} は ${BASE} と同じ（版数を上げる必要はない）`);
  process.exit(0);
}

const base = version(baseHtml, `${BASE} の ${REL}`);
const d = compareVersion(head, base);

if (d > 0) {
  console.log(`✓ ${REL} が変わっていて版数も上がっている（${base} → ${head}）`);
  process.exit(0);
}

console.error(`✗ ${REL} が変わっているのに版数が上がっていない`);
console.error(`    ${BASE} : ${base}`);
console.error(`    いま    : ${head}`);
if (d === 0) {
  console.error(`  → **<span id="app-version"> を上げること。**`);
  console.error(`     マージすると Pages へ出て、その版数でタグが自動で打たれる。`);
  console.error(`     据え置くと、画面に出る版数と配信物が食い違ったまま進む。`);
} else {
  console.error(`  → 版数が**下がっている**。${BASE} を取り込み直したか確かめること。`);
}
process.exit(1);
