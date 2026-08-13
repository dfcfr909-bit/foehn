---
description: docs/status.md とブランチ鮮度を確認して現状を要約する
allowed-tools: Read, Bash(git fetch*), Bash(git rev-list*), Bash(git rev-parse*), Bash(git log*), Bash(git status*)
---

いまどこに立っているかを確認する。**セッション冒頭に使う。**

## 手順

1. `docs/status.md` を読む。
2. ブランチ鮮度を確認する。

   ```bash
   git fetch origin main
   git rev-parse --abbrev-ref HEAD
   git rev-list --left-right --count origin/main...HEAD
   git status --short
   ```

3. 下の形式で要約する。

## 報告の形式

- **ブランチ** … 現在ブランチ / `origin/main` に対して 遅れ N・先行 M / 未コミットの有無
- **進行中** … `docs/status.md` の「進行中」から要点だけ
- **次の一手** … 「次セッションの最初のプロンプト」を1〜2行に圧縮
- **止まっているもの** … 「未処理の申し送り」のうち人間の操作待ちのもの

## 注意

- **遅れが1以上あるなら、そこで止めて先に知らせる。**
  古いブランチ上ではコードもドキュメントも同じだけ古い。
  「その機能は無い」と判断する前に `origin/main` を確認すること
  （2026-08-07 に main が42コミット遅れた状態で誤答した事故がある）
- マージ済みブランチは使い回さない。`git checkout -B <branch> origin/main` で作り直す
- 未完・要確認の一覧は **GitHub Issues** にある。ここで漁らない
  （`docs/status.md` の表と `docs/workflow.md` を見る）
