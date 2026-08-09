---
name: タスク
about: 実装・改修・調査の依頼。AIに渡す前提で書く
title: ''
labels: ''
assignees: ''
---

## やること

（1文で。これが長くなるなら Issue を分割する）

## 背景 / なぜ

（任意。「なぜそうしたか」が設計判断なら `docs/adr/` に回す）

## 受け入れ条件

- [ ] 
- [ ] `node tests/run-all.js` が通る（初回は `cd tests && npm install`）
- [ ] 実機（iPhone Safari）で確認

## 触る予定のファイル

- 

## 触ってはいけないもの

- ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）→ 調整は `THRESH` の値だけ
- （その他）

---

<!--
1 Issue = 1 PR = 1 セッション。超えるなら分割する。
本体を読む前に docs/spec/code_map.md（関数索引）を見ること。
-->
