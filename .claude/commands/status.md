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
- **開いている PR** … 起動時フックの「開いている PR」をそのまま（番号・状態・最終更新）。「‼️ 返事待ち」があれば先頭に書く。
  フックが「取得できず」だった・出力が文脈に無いときは、**確かめられていないと書く**（「無い」と書かない）
- **進行中** … `docs/status.md` の「進行中」から要点だけ
- **次の一手** … 「次セッションの最初のプロンプト」を1〜2行に圧縮
- **止まっているもの** … 「未処理の申し送り」のうち人間の操作待ちのもの

## 注意

- **遅れが1以上あるなら、そこで止めて先に知らせる。**
  古いブランチ上ではコードもドキュメントも同じだけ古い。
  「その機能は無い」と判断する前に `origin/main` を確認すること
  （2026-08-07 に main が42コミット遅れた状態で誤答した事故がある）
- **開いている作業 PR があるなら、新しい作業の前に知らせる**（並行作業を作らない → `docs/workflow.md`）。
  進行中の正本は PR の一覧で、`docs/status.md` ではない（2026-11-12 に #253 が status から落ちていた）
- マージ済みブランチは使い回さない。`git checkout -B <branch> origin/main` で作り直す
- 未完・要確認の一覧は **GitHub Issues** にある。ここで漁らない
  （`docs/status.md` の表と `docs/workflow.md` を見る）
