---
description: 版数の更新箇所を洗い出してタグを打つ手順を示す
argument-hint: <版数 例 v4.78.0>
allowed-tools: Read, Edit, Grep, Bash(grep*), Bash(git tag -l*), Bash(git log*), Bash(git status*), Bash(git rev-parse*)
---

`$ARGUMENTS` へ版数を上げる。

## まず確かめる（打つ前の条件）

- **タグは `main` にマージされたあとに打つ。** 作業ブランチ上では打たない
- **ドキュメントだけの変更では打たない** → `docs/workflow.md`
- 直前の版を確認する: `git tag -l 'v4.*' | tail -5`

## 版数を書き換える場所

```bash
grep -rn 'v4\.[0-9]*\.[0-9]*' sotoki_v4.html docs/status.md
```

| 場所 | 内容 |
|---|---|
| `sotoki_v4.html` の `<span id="app-version">` | 画面下段・凡例行の右端に出る表記。**これが正** |
| `docs/status.md` の1行目 | `# 現状（最終更新: YYYY-MM-DD / v4.xx.0）` |

- `sw.js` の `CACHE_VERSION` は**版数と連動していない**。
  配信ファイルの構成（`PRECACHE` の中身）を変えたときだけ上げる
- `tests/smoke_favpicker.js` は `app-version` を**要素IDで**見ているので、
  版数を上げてもテストは直さなくてよい

## タグを打つ

⚠ **`git tag` を手元で打たない。** Claude のセッションからは `git push` でタグを
送れない（403）ので、手元で打っても届かない。

**版数を上げるPRを `main` にマージしたあと、Actions「タグを打つ」を実行する。**

- ワークフロー: `.github/workflows/release.yml`（`workflow_dispatch`）
- ブランチに `main` を選び、`version` に `$ARGUMENTS` を入れる

止まる条件（どれも「打つ前に止める」ためのもの）:

| 止まる | なぜ |
|---|---|
| `main` 以外で実行した | 作業ブランチのタグは意味が違う |
| `version` が HTML の表記と食い違う | **中身が古いまま新しいタグが付く**のを防ぐ |
| そのタグが既にある | 打ち直しは先に消してから |
| スモークテストが落ちる | 動いていない中身に目印を付けない |

⚠ **順番が肝。HTMLを上げてマージ → それからタグ。** 逆にすると止まる。

単一HTML構成なので、**タグさえあれば「あの時動いていた版」を1ファイルで取り出せる**。

## 最後に

- `node tests/run-all.js` が全件PASSしていること
- `docs/status.md` の「直近の変更」を更新する（**3件まで**。古いものは消す）
