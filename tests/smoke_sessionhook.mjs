/* 起動時フック（.claude/hooks/session-start.sh）の「開いている PR」の検査。
 *
 * ⚠ 狙い：別のセッションで出した PR が返事待ちのまま、新しいセッションが気づかずに
 *   並行で作業を始める事故を止める（2026-11-12・#253）。**進行中の正本は PR の一覧**で、
 *   それを毎回セッションの文脈に入れるのがこのフックの役目。
 * ⚠ 通信はしない。`gh` は偽物（PATH の先頭に置くスタブ）で、返す中身をこちらで決める。
 *   スタブは jq を通した後の形（欄を \x1f で区切った行）を返す。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HOOK = path.join(ROOT, '.claude', 'hooks', 'session-start.sh');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 400)}` : '')); };

const US = '\x1f';
const row = (num, state, updated, labels, title, head = '') => [num, state, updated, labels, head, title].join(US);

/** 偽の gh を置いてフックを走らせる。lines=null なら gh は失敗する。
 *  pullsFail なら、PR の一覧（repos/…/pulls）だけ失敗させて検索へ落とす。 */
function run(lines, { pullsFail = false, projectDir = ROOT } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-'));
  const out = path.join(dir, 'out.txt');
  if (lines) fs.writeFileSync(out, lines.join('\n') + (lines.length ? '\n' : ''));
  const args = path.join(dir, 'args.txt');
  fs.writeFileSync(path.join(dir, 'gh'),
    `#!/bin/bash\nprintf '%s\\n' "$@" >> "${args}"\n`
    + (pullsFail ? 'case "$*" in *"/pulls"*) exit 1 ;; esac\n' : '')
    + (lines ? `cat "${out}"\n` : 'exit 1\n'), { mode: 0o755 });
  const r = spawnSync('bash', [HOOK], {
    cwd: projectDir, encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}`, CLAUDE_PROJECT_DIR: projectDir, SESSION_HOOK_SKIP_FETCH: '1' },
  });
  const called = fs.existsSync(args) ? fs.readFileSync(args, 'utf8') : '';
  fs.rmSync(dir, { recursive: true, force: true });
  return { text: (r.stdout || '') + (r.stderr || ''), status: r.status, called };
}

ok(fs.existsSync(HOOK), '前提: フックがある');
/* ⚠ 「取得できず」の語だけで見ない。CI の浅い取得では origin/main が無く、
     「origin/main が取得できず比較なし」という**別の行**が出る（2026-11-12 にこれで CI が落ちた）。 */
const PR_FAILED = /【開いている PR】取得できず/;

/* --- 場面1: 開いている PR が並ぶ。ラベルの無い PR でも欄がずれない --- */
const a = run([
  row('901', 'draft', '2026-11-08 15:08', '', 'feat: 甲の機能'),
  row('902', 'ready', '2026-11-12 08:05', 'relief,parked', 'relief: 乙の試作'),
]);
ok(a.status === 0, 'フックは 0 で終わる', a);
ok(/【開いている PR】/.test(a.text), '★★開いている PR の見出しが出る', a.text);
ok(/#901 draft・最終更新 2026-11-08 15:08 JST・feat: 甲の機能/.test(a.text),
  '★ラベルの無い PR：番号・状態・日時・題の順（題がラベルの欄に入らない）', a.text);
ok(/#902 ready・最終更新 2026-11-12 08:05 JST・\[relief,parked\]・relief: 乙の試作/.test(a.text), 'ラベルは [ ] で出る', a.text);
ok(!/返事待ち/.test(a.text), '返事待ちが無ければ、返事待ちと言わない', a.text);
ok(/repos\/dfcfr909-bit\/foehn\/pulls/.test(a.called) && /state=open/.test(a.called), '★このリポジトリの開いている PR を引いている', a.called);
ok(!/search\/issues/.test(a.called), '一覧が取れたら検索は叩かない', a.called);

/* --- 場面1b: 一覧が引けない環境では、検索で引く --- */
const a2 = run([row('901', 'draft', '2026-11-08 15:08', '', 'feat: 甲の機能')], { pullsFail: true });
ok(/#901 draft/.test(a2.text) && !PR_FAILED.test(a2.text), '★★一覧が失敗しても、検索で取れれば出す', a2.text);
ok(/search\/issues/.test(a2.called) && /is:pr is:open/.test(a2.called), '検索は開いている PR に絞っている', a2.called);

/* --- 場面2: needs-decision の PR は「返事待ち」。新しい作業より先に出せと言う --- */
const b = run([
  row('903', 'draft', '2026-10-30 18:20', 'needs-decision', 'feat: 丙（確認待ち）'),
  row('904', 'draft', '2026-11-01 09:00', 'docs', 'docs: 丁'),
]);
ok(/‼️ 返事待ち #903 /.test(b.text), '★★★needs-decision の PR に「返事待ち」が付く', b.text);
ok(!/返事待ち #904/.test(b.text), '付いていない PR には付けない', b.text);
ok(/返事待ちの PR が 1 本/.test(b.text) && /新しい作業を始める前に/.test(b.text),
  '★★新しい作業の前に確認の表を出すよう言う', b.text);
// 名前が似ているだけのラベルを拾わない
const b2 = run([row('905', 'draft', '2026-11-01 09:00', 'not-needs-decision-yet', 'x')]);
ok(!/返事待ち/.test(b2.text), '似た名前のラベルは返事待ちにしない', b2.text);

/* --- 場面3: 取れなかったとき黙らない --- */
const c = run(null);
ok(c.status === 0, 'gh が失敗してもフックは 0 で終わる（セッションを止めない）', c);
ok(PR_FAILED.test(c.text), '★★★取れなかったと言う（何も出さない、をしない）', c.text);
ok(/list_pull_requests/.test(c.text) && /「出ていない」は「開いていない」ではありません/.test(c.text),
  '★代わりの確かめ方を言う', c.text);

/* --- 場面4: 0件なら「なし」 --- */
const d = run([]);
ok(/【開いている PR】なし/.test(d.text), '★0件は「なし」と言う（取得できずと区別する）', d.text);
ok(!PR_FAILED.test(d.text), '0件を失敗と言わない', d.text);

/* --- 場面4b: 上限まで出したら、続きがあるかもしれないと言う（黙って落とさない） --- */
const e = run(Array.from({ length: 100 }, (_, i) => row(String(1000 + i), 'draft', '2026-11-01 09:00', '', `t${i}`)));
ok(/100 本まで出しました/.test(e.text), '★上限の100本に達したら、ほかにもあるかもしれないと言う', e.text.slice(-300));
ok(!/本まで出しました/.test(a.text), '上限に達していなければ言わない', a.text);

/* --- 場面4c: PR を出さずに push されたブランチを拾う。PR のあるブランチは「PR が無い」と言わない ---
   作り物のリポジトリ：origin/main（古い）と、それより新しい2本（片方だけ開いている PR の head）。 */
{
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'hookrepo-'));
  const git = (args, date) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', ...args], {
    cwd: repo, encoding: 'utf8',
    env: { ...process.env, ...(date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {}) },
  });
  git(['init', '-q']);
  git(['remote', 'add', 'origin', 'https://github.com/dfcfr909-bit/foehn']);
  git(['commit', '-q', '--allow-empty', '-m', 'a'], '2026-11-01T00:00:00Z');
  git(['update-ref', 'refs/remotes/origin/main', 'HEAD']);
  git(['commit', '-q', '--allow-empty', '-m', 'b'], '2026-11-05T00:00:00Z');
  git(['update-ref', 'refs/remotes/origin/feat-with-pr', 'HEAD']);
  git(['update-ref', 'refs/remotes/origin/feat-no-pr', 'HEAD']);
  const f = run([row('906', 'draft', '2026-11-05 09:00', '', 'feat: PR のある作業', 'feat-with-pr')], { projectDir: repo });
  ok(/PR の無いブランチかもしれません/.test(f.text) && /origin\/feat-no-pr/.test(f.text),
    '★★PR を出さずに push されたブランチを出す', f.text);
  ok(!/- origin\/feat-with-pr/.test(f.text), '★★開いている PR の head は「PR が無い」と言わない', f.text);
  ok(/#906 draft・最終更新 2026-11-05 09:00 JST・feat: PR のある作業/.test(f.text), 'head の欄が題に混ざらない', f.text);
  fs.rmSync(repo, { recursive: true, force: true });
}

/* --- 場面5: 誤報の多かった古い警告を戻していない ---
   ⚠ 「main より10コミット以上先行」は、merge で main を取り込んだブランチを数百と数え、
     6コミットの返事待ちの PR を素通りしていた。 */
ok(!/10コミット以上先行しているブランチ/.test(a.text + b.text + c.text + d.text), '古い警告を出さない');
// プロジェクトの取り違えの照合は残っている
ok(/【プロジェクト】|プロジェクト不一致/.test(a.text), 'プロジェクトの照合は残っている', a.text);

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SESSIONHOOK SMOKE FAILED');
  process.exit(1);
}
console.log('SESSIONHOOK SMOKE PASSED');
