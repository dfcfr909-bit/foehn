# ABC評価

> ⚠ **このロジックは変更禁止。** `abcScore` / `abcScoreInv` / `judgePoint` の
> **中身を書き換えない**（移植のみ）。調整が要るときは **`THRESH` の値だけ**を触る。
> → `docs/adr/0005-wind-unit-ms.md`

登山の適否を A（良）／B（注意）／C（危険）の3段階で出す。

## 評価していないもの

- **雪崩の危険度は評価していない。** 積雪の安定性・弱層・斜面方位は一切見ていない
- 地形（急斜面・沢地形・雪庇）も見ていない
- 評価の対象は「気象要素が単独で危険域にあるか」だけ

README の免責と同じ立場。**このアプリの判定だけで入山の可否を決めない。**

## 閾値（`THRESH`）

```js
const THRESH = {
  day:  { windA: 5,  windB: 10 },
  camp: { windA: 3,  windB: 8  },
  apparentA: -3, apparentB: -15,
  snowA: 0.5, snowB: 2,
  rainA: 1,   rainB: 3,
  dpressA: 6, dpressB: 10,
};
```

| 項目 | 単位 | A→B | B→C | 備考 |
|---|---|---|---|---|
| 風速（日帰り） | m/s | 5 | 10 | `state.mode` は `'day'` 固定 |
| 風速（幕営） | m/s | 3 | 8 | 切替UIは無い。`judgePoint` の構造を変えないため定義だけ残す |
| 体感気温 | ℃ | -3 | -15 | **低いほど悪い**（`abcScoreInv`） |
| 降雪 | cm/h | 0.5 | 2 | `snow > 0` のときだけ評価に入る |
| 降水 | mm/h | 1 | 3 | `precip > 0` のときだけ。B の理由は出さない |
| 気圧変化 | hPa/6h | 6 | 10 | 絶対値で見る（上昇も下降も） |

**風速は m/s。** Open-Meteo に `wind_speed_unit=ms` を指定して取得している。

## スコア関数

```js
function abcScore(val, a, b)     // 高いほど悪い: val<a → 0 / val<b → 1 / それ以上 → 2
function abcScoreInv(val, a, b)  // 低いほど悪い: val>a → 0 / val>b → 1 / それ以下 → 2
```

`val == null` はどちらも 0（評価しない）を返す。

## `judgePoint(d)`

**入力** — 1時刻ぶんのデータ `d`。使うのは次の5つ。

| キー | 意味 |
|---|---|
| `d.wind` | 風速 m/s |
| `d.apparent` | 体感気温 ℃ |
| `d.snow` | 降雪 cm/h |
| `d.precip` | 降水 mm/h |
| `d.dpress` | 6時間の気圧変化量 hPa（符号つき。絶対値で評価する） |

閾値は `THRESH` と `THRESH[state.mode]` から引く。

**出力**

```js
{ grade: 'A' | 'B' | 'C', reasons: string[] }
```

- `grade` は各項目のスコアの**最悪値**（`Math.max`）を `['A','B','C']` に写したもの
- `reasons` はスコアが 1 以上だった項目の文言

| 項目 | スコア1 | スコア2 |
|---|---|---|
| 風速 | 風が強め | 風速が危険値 |
| 体感気温 | 体感寒冷 | 体感気温が危険値 |
| 降雪 | 降雪あり | 降雪が危険値 |
| 降水 | （文言なし） | 降水が危険値 |
| 気圧変化 | 気圧低下中 | 気圧変化が急激 |

## `judgeBreakdown(d)`

ポップアップで**根拠の数値を色分けする**ための内訳。読み取り専用。

```js
{ wind: 0|1|2, apparent: 0|1|2, precip: 0|1|2, dpress: 0|1|2 }
```

- `precip` は降雪と降水の**大きい方**
- **`judgePoint` とまったく同じ `THRESH`・同じ `abcScore`/`abcScoreInv` を使う。**
  だから閾値を変えるときは `THRESH` だけを触れば両方に効く
- `judgePoint` が変更禁止なので、内訳はこちらに分けてある

表示側は `updatePopup()` が `.lv1`（B相当=黄）／`.lv2`（C相当=赤）を付ける → `ui.md`

## 使われている所

| 場所 | 使い方 |
|---|---|
| 選択情報のポップアップ | `judgePoint` の grade ＋ `judgeBreakdown` の色分け |
| スクラバー帯の判定バー | 各時刻の grade を色で並べる（`drawScrubber`。A=`#2a7d4f` / B=`#e8a020` / C=`#d03030`） |
| 全国山域ランキング | `judgePeakDay()` が行動時間帯（`RANK_WINDOW_START`=6時〜18時）の**最悪値**を採る |

## 新雪ランキングとの関係

**新雪ランキング（`snowRanking.js`）は ABC評価とは完全に独立している。**
`judgePoint` / `THRESH` / `abcScore` を参照しない（テストで固定してある）。
→ `docs/snow_ranking.md`

## 関連

- 風速単位と閾値の経緯 → `docs/adr/0005-wind-unit-ms.md`
- ポップアップの表示 → `ui.md`
- データの取得 → `data.md`
