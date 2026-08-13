---
description: スモークテストを全16件流す
allowed-tools: Bash(node tests/run-all.js), Bash(cd tests && npm install), Bash(node tests/*), Read, Grep
---

`node tests/run-all.js` をリポジトリ直下で実行し、結果を報告する。

## 手順

1. リポジトリ直下で `node tests/run-all.js` を実行する（全16件）。
2. `Cannot find module` 等で落ちたら初回セットアップが済んでいない。
   `cd tests && npm install` を1回だけ実行してから、もう一度流す。
3. 結果を報告する。

## 報告の仕方

- **全件PASSなら1行で終える**（例:「全16件PASS」）。
  出力を会話に貼らない → `docs/project_structure_proposal.md` 第12節-6
- 落ちたときは**落ちたテスト名と、直前に出る JSON の実測値と期待値の差**だけを示す。
  `run-all.js` は失敗時に全出力を出すので、その中から差分の要点を拾う

## 落ちたときの注意

- `smoke_mapui` の「古いレイヤーは残さない（重ならない）」は**CIで稀に落ちるフレーク**。
  まず再実行する。手元では常にPASSしている。1件だけの失敗か、
  他も道連れで落ちているかを確認材料にすること → `docs/status.md` の申し送り
- 手元から地理院・OSM・気象庁・Open-Meteo には**到達できない**。
  通信を伴う失敗は、まずスタブが効いているかを疑う → `tests/README.md`
