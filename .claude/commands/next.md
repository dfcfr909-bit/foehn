---
description: ready の Issue を1件選び、計画→実装→テスト→PR→（線引きの外なら）マージ→Issue を閉じる
allowed-tools: Bash(git status*), Bash(git branch*), Bash(git fetch*), Bash(git checkout -B claude/*), Bash(git log*), Bash(git diff*), Bash(git show*), Bash(git rev-parse*), Bash(git rev-list*), Bash(git add*), Bash(git commit*), Bash(git merge origin/main*), Bash(git merge --abort), Bash(git push -u origin HEAD), Bash(node tests/*), Bash(cd tests && npm install), Bash(node scripts/*), Bash(grep*), Read, Edit, Write, Grep, Glob, Agent, mcp__github__list_issues, mcp__github__issue_read, mcp__github__issue_write, mcp__github__add_issue_comment, mcp__github__list_pull_requests, mcp__github__search_pull_requests, mcp__github__create_pull_request, mcp__github__pull_request_read, mcp__github__merge_pull_request, mcp__github__update_pull_request, mcp__claude-code-remote__subscribe_pr_activity, Bash(gh api repos/dfcfr909-bit/foehn/pulls/*/ccr/ready_for_review*)
---

`ready` ラベルの Issue を1件だけ片付ける。運用の全体は `docs/workflow.md`「Issue 駆動の進め方」。
GitHub の操作は **GitHub MCP（`mcp__github__*`）で行う**（`gh` の GraphQL は使えない）。

## 絶対にしないこと

- **`ready` を自分で付けない・外さない。** `ready` は人間だけが付ける。AI が付けた `ready` は無効（見つけたら外さず報告する）
- **`needs-decision` が付いた Issue は選ばない。** 両方付いていたら人間の付け間違いなので、選ばずに報告する
- main へ直接 push しない。rebase・force push・`--amend` をしない
- **Issue を2件以上まとめて着手しない**（1 Issue = 1 PR）

## 手順

1. **選ぶ（前提の確認つき）**
   - `git fetch origin main`。`git status --short` が空でなければ止めて報告
   - **ほかに開いている作業 PR（`claude/*` のブランチ）が1本でもあれば、新しく着手しない。** 先にその PR を片付ける
     （領域ラベルは並行の衝突回避にならない。`sotoki_v4.html` が単一ファイルで版数の行も共通のため）
   - `ready` の open な Issue を一覧し、`needs-decision` が付いていないものを選ぶ。複数あれば番号の若い順。
     人間が番号を指定していれば、それを優先（`ready` が付いていることは確認する）
   - **選んだ Issue の本文を読み、public に書いてよい内容か確かめる**（院内・施設名・個人名・CLAUDE.md の別プロジェクト識別語が入っていたら止めて報告）
   - 受け入れ条件が無い・曖昧なら、着手せずコメントで質問して止まる
2. **ブランチ**：`git checkout -B claude/<番号>-<短い英語> origin/main`
3. **計画 → `plan-reviewer`**
   - 対象は CLAUDE.md の区分（`sotoki_v4.html` のロジック変更・複数ファイル・確認が要る区分）。文言だけ・1か所の小修正は省いてよい
   - 判定が「直して出し直し」なら直して再提出。**「利用者の判断が要る」なら、その質問をそのまま利用者に渡して止まる**（言い換えて薄めない）
4. **実装・テスト**：段階ごとにコミット（日本語＋prefix、末尾 `Refs #N`）。
   `node tests/run-all.js` は全件をバックグラウンドで流して終わりを待つ（10分超がある）。
   `sotoki_v4.html` を変えたら `<span id="app-version">` と `docs/status.md` の版を上げる。関数を足す・消す・改名したら `node scripts/genCodeIndex.mjs`
5. **差分 → `plan-reviewer`**（3と同じ対象）。同様に扱う
6. **PR**：`git push -u origin HEAD` → draft の PR。**本文に `Closes #N`** を入れる。
   実機で見たい変更は版を本文に明記する。PR を出したら `subscribe_pr_activity` で見張る
7. **マージの前に、差分で線引きを機械的に判定する**（「触れていそう」の目視で済ませない）
   - ここに書く止まる条件は、`docs/workflow.md` の表に **`/next` 固有の追加**（`.github/workflows/`・`.claude/settings.json`・`CLAUDE.md`・`destination-out`）を足したもの。自動で動く工程なので広く取る
   - `git diff origin/main --name-only` に次が**含まれる** → 止まって利用者に確認
     `areas.json` ／ `sw.js` ／ `manifest.webmanifest` ／ `icons/` ／ `.github/workflows/` ／ `.claude/settings.json` ／ `CLAUDE.md`
   - `git diff origin/main` に次の語が**出る** → 止まって確認
     `abcScore` ／ `abcScoreInv` ／ `judgePoint` ／ `THRESH` ／ `wind_speed_unit` ／ `destination-out`
   - **追加行**（`git diff origin/main | grep '^+'`）に `https?://` が出る（外部URL・送信先が増える）／ファイルの削除・上書きがある／公開範囲に関わる語が入りうる → 止まって確認
   - 何も該当せず、**CI（`smoke`）が緑**で、`plan-reviewer` が「進めてよい」→ **利用者に見せずにマージしてよい**（CLAUDE.md「CIが緑なら確認なしでマージ」の範囲。止まった場合だけ、差分と該当した線引きを利用者に見せて承認を待つ）
   - マージの前に **draft を外す**（`update_pull_request` の `draft: false`。通らなければ `gh api -X POST repos/dfcfr909-bit/foehn/pulls/<N>/ccr/ready_for_review`）
8. **マージして閉じる**：`merge_pull_request`（squash）。`Closes #N` で閉じなければ、`issue_write` で `state_reason: completed` を付けて閉じる。
   マージしたら **「マージ完了。v（その版） が main に反映されます。PWAはキャッシュをクリアして再起動してください。」** を出す（`sotoki_v4.html` を変えたときだけ）
9. **区切り**：PR を数本マージしたら、CLAUDE.md「セッションの区切り」に従い移行を提案する

## 報告（簡潔に）

- 選んだ Issue と、選んだ理由：
- PR：
- `plan-reviewer` の判定（計画／差分）：
- テスト・CI：
- マージ：（した／止まった：どの線引きに当たったか）
- 利用者の判断が要ること：（なければ「なし」）
