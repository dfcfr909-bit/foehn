/* ワークフロー全体に共通する決まりの検査。
 *
 * ⚠ **狙いは「同じことが複数箇所に書いてあり、片方だけ変わる」を止めること。**
 *   2026-08-20 に3回踏んだ。どれも中身の間違いではなく**写し違い**だった。
 *     - `release.yml` に Chromium の用意を書き写し損ねて19件中14件が落ちた
 *     - `node-version` が6か所にあり、`release.yml` だけ 22、他は 20 に割れていた
 *       （しかも手元は22なので、**手元で通ってCIで落ちる**形になっていた）
 *   個々の間違いを直すだけでは同じことが起きるので、**形の方を見張る**。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, '.github', 'workflows');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

/* ⚠ **注記を落としてから見ること。** YAMLのコメントは構文解析で捨てられるので
     効き目が無い。規則を説明した注記そのものを「違反」と読むと、
     **注意書きを厚くするほどテストが落ちる**という逆立ちが起きる（実際2回踏んだ）。 */
const strip = s => s.split('\n').filter(l => !/^\s*#/.test(l)).join('\n');

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.yml')).sort();
ok(files.length > 0, 'ワークフローが見つかる（検査が空振りしていない）');
const wf = Object.fromEntries(files.map(f =>
  [f, strip(fs.readFileSync(path.join(DIR, f), 'utf8'))]));

/* --- 場面1: Node の版を直書きしない ---
   ⚠ **これが実際に割れていた。** 置き場所が6か所あると、片方だけ変えても誰も気づかない。
     `.nvmrc` に一本化して、手元とCIが同じ版で走るようにする。 */
ok(fs.existsSync(path.join(ROOT, '.nvmrc')), '★.nvmrc がある（Nodeの版の置き場所）');
const nvmrc = fs.existsSync(path.join(ROOT, '.nvmrc'))
  ? fs.readFileSync(path.join(ROOT, '.nvmrc'), 'utf8').trim() : '';
ok(/^\d+(\.\d+)*$/.test(nvmrc), '.nvmrc の中身が版数だけ', nvmrc);

for (const [f, s] of Object.entries(wf)) {
  ok(!/\n\s*node-version:\s/.test(s),
    `★★★Nodeの版を直書きしない（${f}）。node-version-file: .nvmrc を使う`,
    (s.match(/\n\s*node-version:.*/) || [])[0]);
}
// setup-node を使うなら .nvmrc を指していること
for (const [f, s] of Object.entries(wf)) {
  if (!/uses:\s*actions\/setup-node/.test(s)) continue;
  ok(/node-version-file:\s*\.nvmrc/.test(s),
    `★setup-node を使うなら .nvmrc を指す（${f}）`);
}

/* --- 場面2: 同じアクションの版が割れていないこと ---
   ⚠ 片方だけ上げると、**同じことをしているのに挙動が違うジョブ**ができる。 */
const versions = {};
for (const [f, s] of Object.entries(wf)) {
  for (const m of s.matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@([\w.-]+)/g)) {
    (versions[m[1]] ||= new Map()).set(m[2], f);
  }
}
for (const [action, vers] of Object.entries(versions)) {
  ok(vers.size === 1, `★${action} の版が割れている`,
    [...vers].map(([v, f]) => `${v}(${f})`));
}

/* --- 場面3: Chromium の用意を書き写さない ---
   ⚠ **これで実際に落ちた。** 手順が3つ（install / 実体を glob で探す / PW_CHROMIUM で渡す）
     あり、書き写すと必ずどれか落ちる。release.yml へ写したとき install を落として
     19件中14件が `executable doesn't exist` になった。
     ⚠ 共通アクション `.github/actions/chromium` が持つ。**ワークフローには書かない。** */
const CHROMIUM_ACTION = path.join(ROOT, '.github', 'actions', 'chromium', 'action.yml');
ok(fs.existsSync(CHROMIUM_ACTION), '★Chromium を用意する共通アクションがある');
for (const [f, s] of Object.entries(wf)) {
  ok(!/playwright/i.test(s),
    `★★★Chromium の用意を書き写さない（${f}）。uses: ./.github/actions/chromium`,
    (s.match(/.*playwright.*/i) || [])[0]);
  ok(!/PW_CHROMIUM/.test(s),
    `★★PW_CHROMIUM の受け渡しも書き写さない（${f}）`,
    (s.match(/.*PW_CHROMIUM.*/) || [])[0]);
}
// 実際に使われていること（共通アクションを置いただけで誰も呼んでいない、を防ぐ）
const users = Object.entries(wf).filter(([, s]) => /uses:\s*\.\/\.github\/actions\/chromium/.test(s));
ok(users.length >= 2, '★共通アクションが実際に呼ばれている', users.map(([f]) => f));

/* --- 場面3b: スモークテストの走らせ方も書き写さない ---
   ⚠ release.yml は test.yml を呼ぶ（workflow_call）。 */
ok(/workflow_call/.test(wf['test.yml'] || ''),
  '★test.yml が呼べるようになっている（workflow_call）');
for (const [f, s] of Object.entries(wf)) {
  if (f === 'test.yml') continue;
  ok(!/run-all\.js/.test(s),
    `★★スモークの走らせ方を書き写さない（${f}）。test.yml を呼ぶ`,
    (s.match(/.*run-all\.js.*/) || [])[0]);
}

/* --- 場面4: 権限を既定任せにしない ---
   ⚠ 明示が無いとリポジトリ既定が効く。既定は変わりうるし、
     **そのワークフローが何を触れるのかが読んで分からない**。 */
for (const [f, s] of Object.entries(wf)) {
  ok(/\n\s*permissions:\s*\n/.test(s) || /\npermissions:\s*\n/.test(s),
    `★権限を明示する（${f}）`);
}

/* --- 場面5: 安全でない逃げ道を使わない ---
   ⚠ Node20 非推奨の警告が案内してくる環境変数。名前のとおり
     **安全でない古いランタイムに戻すだけ**で、問題は先送りになり状況は悪化する。 */
for (const [f, s] of Object.entries(wf)) {
  ok(!/ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION/.test(s),
    `★★安全でないNodeへ戻さない（${f}）`);
}

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('WORKFLOWS SMOKE FAILED');
  process.exit(1);
}
console.log(`WORKFLOWS SMOKE PASSED（${files.length}ファイル / Node ${nvmrc}）`);
