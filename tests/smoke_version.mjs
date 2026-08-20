/* 版数の照合（scripts/checkVersion.mjs）の検査。
 *
 * ⚠ **いちばん危ないのは「HTMLを上げ忘れたまま新しいタグが付く」こと。**
 *   版数の正は `sotoki_v4.html` の `<span id="app-version">` で、タグはその目印。
 *   食い違ったタグは、あとから見て中身が古いことに気づけない。
 *   （実際 v4.77.0 のまま7つマージが進んだ状態が続いた）
 *
 * ⚠ 検査は**二重入力**である点が肝。片方だけでは事故を止められない——
 *     HTMLから読むだけ → 上げ忘れを通す ／ 入力を信じるだけ → 打ち間違いを通す
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT = path.join(ROOT, 'scripts', 'checkVersion.mjs');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ver-'));

/* HTML と status.md を差し替えて走らせる。**本物のファイルは触らない。** */
function run(arg, { html = '<span id="app-version">v4.78.0</span>', status = '# 現状（v4.78.0）' } = {}) {
  const h = path.join(tmp, 'sotoki_v4.html');
  const s = path.join(tmp, 'status.md');
  fs.writeFileSync(h, html);
  fs.writeFileSync(s, status);
  const env = { ...process.env, CHECK_VERSION_HTML: h, CHECK_VERSION_STATUS: s };
  try {
    return { code: 0, out: execFileSync('node', [SCRIPT, arg], { encoding: 'utf8', env }) };
  } catch (e) {
    return { code: e.status, out: (e.stdout || '') + (e.stderr || '') };
  }
}

/* --- 場面1: 一致すれば通す --- */
const r1 = run('v4.78.0');
ok(r1.code === 0, '★一致すれば通す', r1);
ok(/✓ 版数が一致する/.test(r1.out), '一致したことを出す', r1.out);

/* --- 場面2: HTMLの上げ忘れを止める（本丸） ---
   ⚠ v4.79.0 を打とうとしているのに HTML は v4.78.0 のまま。
     ここを通すと**中身が古いまま新しいタグが付く**。 */
const r2 = run('v4.79.0', { html: '<span id="app-version">v4.78.0</span>' });
ok(r2.code !== 0, '★★★HTMLを上げ忘れたまま打とうとしたら止める', r2);
ok(/v4\.79\.0/.test(r2.out) && /v4\.78\.0/.test(r2.out),
  '★どちらとどちらが食い違っているかを両方出す', r2.out);
ok(/HTML の版数を上げてマージ/.test(r2.out), '直し方（順番）を出す', r2.out);

/* --- 場面3: 打ち間違いを止める ---
   HTMLは v4.78.0 なのに v4.87.0 と打った（数字の入れ替わり）。 */
const r3 = run('v4.87.0');
ok(r3.code !== 0, '★★打ち間違い（87/78）を止める', r3);

/* --- 場面4: 書式を絞る ---
   ⚠ **ここを緩めると、値がそのままシェルへ渡る素性の分からない文字列になる。**
     ワークフロー側でも env 経由にして引用しているが、入口でも絞る。 */
for (const bad of ['4.78.0', 'v4.78', 'v4.78.0.1', '', 'latest',
                   'v4.78.0; echo pwned', 'v4.78.0 && echo pwned', '$(echo v4.78.0)']) {
  const r = run(bad);
  ok(r.code !== 0, `★書式違いを弾く: ${JSON.stringify(bad)}`, r);
}

/* --- 場面4b: ワークフローが入力を run: へ直に埋め込んでいないこと ---
   ⚠ **ここが本当の注入口。** スクリプト側で書式を絞っていても、
     `run: git tag ${{ inputs.version }}` と書けば**式が先に展開されて**
     シェルのソースになる。スクリプトは呼ばれる前に負ける。
   ⚠ 直し方は `env:` に受けて `"$VERSION"` と引用して使うこと。
     この検査は、あとから run: の中に書き戻す変更を止めるためにある。 */
const wfRaw = fs.readFileSync(path.join(ROOT, '.github', 'workflows', 'release.yml'), 'utf8');
/* ⚠ **注記を落としてから見ること。** YAMLのコメントは構文解析で捨てられるので
     効き目が無い。規則を説明した注記そのものを「違反」と読むと、
     **注意書きを厚くするほどテストが落ちる**という逆立ちが起きる。 */
const wf = wfRaw.split('\n').filter(line => !/^\s*#/.test(line)).join('\n');
const inputRefs = wf.split('\n')
  .map((line, i) => ({ line, no: i + 1 }))
  .filter(({ line }) => /\$\{\{\s*(inputs|github\.event\.inputs)\./.test(line));
ok(inputRefs.length > 0, 'ワークフローが入力を使っている（検査が空振りしていない）');
// 許すのは env の代入行だけ（`  VERSION: ${{ inputs.version }}`）
const bare = inputRefs.filter(({ line }) => !/^\s*[A-Z_]+:\s*\$\{\{\s*inputs\.\w+\s*\}\}\s*$/.test(line));
ok(bare.length === 0,
  '★★★入力を run: へ直に埋め込まない（env 経由で渡す）', bare);

/* 権限は tag を送るぶんだけ。
   ⚠ **ワークフロー全体に write を与えない。** タグを打つジョブだけに与える。
     `contents: write` はタグだけでなく**ブランチにも書ける**ので、
     門番やテストのジョブにまで配ると、必要のない手順が書き込み権限を持つ。 */
ok(/^permissions:\n  contents: read\n/m.test(wf),
  '★★ワークフロー既定の権限は read', (wf.match(/^permissions:[\s\S]{0,40}/m) || [])[0]);
const writes = (wf.match(/contents:\s*write/g) || []);
ok(writes.length === 1, '★★`contents: write` は1か所だけ', writes);
ok(/^ {4}permissions:\n {6}contents: write\n/m.test(wf),
  '★★`contents: write` はジョブに直付けする（ワークフロー全体ではなく）');
ok(!/id-token|packages:|pages:/.test(wf), '★他の権限を足さない');

// main 以外では打たない
ok(/GITHUB_REF_NAME.*!=.*main|!=.*\"main\"/.test(wf),
  '★main 以外では打たない検査がある');

/* --- 場面4c: テストの走らせ方を書き写していないこと ---
   ⚠ **これで実際に落ちた（2026-08-20）。** release.yml に `npm install` だけ書き写して
     **Chromium の用意（`playwright install` と `PW_CHROMIUM`）を落とし**、
     19件中14件が「executable doesn't exist」で落ちた。
     ⚠ 同じ手順が2か所にあると、片方だけ直して食い違う。**呼ぶこと。** */
ok(/uses:\s*\.\/\.github\/workflows\/test\.yml/.test(wf),
  '★★★テストは test.yml を呼ぶ（手順を書き写さない）');
ok(!/playwright/i.test(wf),
  '★★Chromium の用意を release.yml に書き写さない',
  (wf.match(/.*playwright.*/i) || [])[0]);

/* --- 場面5: 版数の置き場所が壊れていたら止める --- */
const r5a = run('v4.78.0', { html: '<span id="version">v4.78.0</span>' });
ok(r5a.code !== 0 && /app-version/.test(r5a.out),
  '★app-version が無ければ止める（黙って通さない）', r5a);

// ⚠ 2か所に増えると「どちらが正か」が決まらず、片方だけ直す事故が起きる
const r5b = run('v4.78.0', {
  html: '<span id="app-version">v4.78.0</span><span id="app-version">v4.77.0</span>' });
ok(r5b.code !== 0 && /2か所/.test(r5b.out),
  '★★版数の表記が2か所あれば止める', r5b);

/* --- 場面6: status.md のズレでは止めない ---
   ⚠ 1行目は自由文で、版数以外の v4.x.y が混ざりうる。
     ここで落とすと**本質でない書式のズレでリリースが止まる**。警告どまりにする。 */
const r6 = run('v4.78.0', { status: '# 現状（最終更新: 2026-08-20 / タグは v4.77.0 のまま）' });
ok(r6.code === 0, '★status.md のズレではリリースを止めない', r6);
ok(/⚠/.test(r6.out) && /status\.md/.test(r6.out), '止めないが警告は出す', r6.out);

// status.md に版数が無くても落ちない
const r6b = run('v4.78.0', { status: '# 現状' });
ok(r6b.code === 0, 'status.md に版数が無くても止めない', r6b);

fs.rmSync(tmp, { recursive: true, force: true });

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('VERSION SMOKE FAILED');
  process.exit(1);
}
console.log('VERSION SMOKE PASSED');
