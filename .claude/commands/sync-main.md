---
description: 作業中のブランチに最新の main を取り込み、テストを通して PR に出せる状態にする（rebase・force push はしない）
allowed-tools: Bash(git status*), Bash(git branch*), Bash(git fetch*), Bash(git log*), Bash(git diff*), Bash(git show*), Bash(git rev-parse*), Bash(git rev-list*), Bash(git merge origin/main*), Bash(git merge --abort), Bash(git add*), Bash(git commit*), Bash(git push -u origin HEAD), Bash(git stash push*), Bash(git stash list), Bash(node tests/*), Bash(cd tests && npm install), Bash(node scripts/genCodeIndex.mjs*), Bash(node scripts/checkVersionBump.mjs*), Bash(grep*), Read, Edit, Grep, Glob
---

作業中のブランチに、最新の `origin/main` を取り込む。取り込みは **merge**（rebase しない）。

## 絶対にしないこと

- **main に触らない。** main への push・マージ、PR の作成・マージはしない
- **履歴を書き換えない。** `git reset --hard`・`git rebase`・`git push --force`・`--amend` は使わない
- **未コミットの変更を捨てない。** `git checkout -- .`・`git restore .`・`git clean` は使わない

## 手順

1. **現状を確かめる**
   - `git branch --show-current`。**`main` にいたら、ここで止めて報告する**（作業ブランチではない）
   - `git status --short`。未コミットの変更があれば、`git stash push -u -m "sync-main 前の退避"` で退避してから進め、
     最後の報告で「退避した」と言う（自分では戻さない。戻すかは利用者が決める）
2. **main の最新を取る**：`git fetch origin main`。
   `git rev-list --count HEAD..origin/main` が 0 なら「取り込むものなし」で手順7へ
3. **取り込む**：`git merge origin/main`
4. **競合したら**、ファイルごとに次で解く。どれも `git diff`・`git log origin/main -- <ファイル>` で
   **main 側で何を変えたか／このブランチで何を変えたか**を確かめてから直す。片方を丸ごと採るのは、もう片方の変更が不要と確かめたときだけ
   - **版数（`sotoki_v4.html` の `<span id="app-version">`）**：このブランチの版が main の版より上ならそのまま。
     同じか下なら、main の版の次にする（このブランチが minor を上げていたなら minor+1、そうでなければ patch+1）。
     `docs/status.md` の1行目の版もそろえる。仕様判断ではないので自分で決めてよい
   - **`docs/spec/code_index.md`**：手で混ぜない。どちらかを採ってから `node scripts/genCodeIndex.mjs` で作り直す
   - **`docs/status.md` の「直近の変更」・`docs/decisions.md`**：両方の項目を残す（追記どうしの競合）
   - **コード（`sotoki_v4.html` ほか）**：両方の意図が並び立つように直す。
     **同じ処理を両方が別の方向に変えていて、どちらかを捨てると機能が変わるときは、勝手に決めない。**
     `git merge --abort` で取り込み前に戻し、競合の中身（main 側・このブランチ側・どちらを採ると何が変わるか）を報告して止める
   - **禁止事項に触れる競合**（ABC評価 `abcScore` / `abcScoreInv` / `judgePoint` / `THRESH`、`wind_speed_unit=ms`、
     `areas.json` の座標・標高、`sw.js` / `manifest` / `icons`）：同じく `git merge --abort` して報告で止める
5. **検査する**（競合の有無に関わらず）
   - `node scripts/genCodeIndex.mjs --check`（落ちたら `node scripts/genCodeIndex.mjs` で作り直してコミット）
   - `node scripts/checkVersionBump.mjs origin/main`（`sotoki_v4.html` を変えているのに版が上がっていなければ直す）
   - `node tests/run-all.js`（全件。**10分を超えることがあるので、バックグラウンドで流して終わりを待つ**。
     前面で流すと上限で打ち切られる（2026-10-05 に実際に起きた）。`Cannot find module` なら `cd tests && npm install` を1回）
6. **落ちたら原因を切り分ける**：取り込み前の自分のブランチ（`git stash` ではなく `ORIG_HEAD`）と main 単体で同じテストが通るかを見て、
   「取り込みで壊れた」「もともと落ちていた」「不安定」のどれかを言う。取り込みで壊れたなら直してコミットする。
   推測で「既知」「無関係」と言わない
7. **push する**：検査が全部通ったら `git push -u origin HEAD`（作業ブランチへの追記。force はしない）
8. **確かめる**：`git rev-list --count HEAD..origin/main` が 0 であること

## 報告（この形で簡潔に）

- 現在のブランチ：
- 最新 main の取り込み：（取り込んだコミット数／取り込むものなし）
- 競合：（なし／あり：ファイル名と、どう解いたか1行ずつ）
- 実行したテスト：
- 結果：（全件 PASS／落ちたもの・原因・直したか）
- PR に出せる状態か：
- 判断が要ること：（なければ「なし」。あれば、利用者が答えやすい平文で選択肢と推奨を添える）
- 退避した変更：（なければ書かない）
