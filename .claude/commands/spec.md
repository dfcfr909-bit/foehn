---
description: 指定した仕様書と関数索引（code_map）を開く
argument-hint: <名前 overview|chart|ui|map|data|judge|pwa>
allowed-tools: Read, Grep, Glob
---

`$ARGUMENTS` の仕様書を読む。**本体を読む前に必ずこれを通す。**

## 手順

1. `docs/spec/code_map.md` を読む（`sotoki_v4.html` の関数索引）。
2. `docs/spec/$ARGUMENTS.md` を読む。
   名前が一致しなければ、下の表から近いものを提示して選ばせる。
3. 実装を見る必要があるときは、code_map の目安行から
   **関数名で `grep` して部分読み**する。`sotoki_v4.html` は7,000行超あるので
   **全文を読まない** → `docs/project_structure_proposal.md` 第12節-1

## 名前と中身

| 名前 | 中身 |
|---|---|
| `overview` | 画面構成・全体像 |
| `chart` | チャート4枚（軸・パディング定数） |
| `ui` | ヘッダー・円柱ピッカー・スクラバー |
| `map` | 地図選択画面・レイヤー・タイルキャッシュ |
| `data` | Open-Meteo API・補助リクエスト |
| `judge` | ABC評価ロジック（**変更禁止領域**） |
| `pwa` | manifest / `sw.js` |
| `code_map` | 関数索引そのもの |

## 注意

- `spec/` は**現行仕様**（現在形）。「なぜそうなっているか」は `docs/adr/`、
  軽い判断・地雷は `docs/decisions.md` にある。混ぜない
- `judge` を開いたときは、`abcScore` / `abcScoreInv` / `judgePoint` は**変更禁止**。
  調整は `THRESH` の閾値だけ → `docs/adr/0005-wind-unit-ms.md`
- code_map の行番号は**±50行の目安**。ズレていたら関数名で grep し直す
