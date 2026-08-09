# 画面構成の全体像

ナギナビの画面がどう組み立てられているかをまとめる。個々の詳細は
`chart.md` / `ui.md` / `map.md` / `data.md` / `judge.md` / `pwa.md` に分けてある。
コードの在り処は `code_map.md` を見る。

> **なぜそうなっているか**は書かない。判断の理由は `docs/adr/`、
> 細かい地雷は `docs/decisions.md` にある。ここは「いまどうなっているか」だけ。

## 画面の並び

上から順に:

1. **ヘッダー**（48px 1行）— 左＝大きな日付＋選択時刻＋★ / 中＝お気に入り円柱 / 右＝「現在」ボタン
2. **チャート4枚** — 気温 / 雲・雨 / 風 / 気圧
3. **時間スクラバー帯** — 選択時刻を移動する入力面
4. **凡例（左寄せ）＋バージョン（右端）**
5. **フッター**

チャートの上に載るのはヘッダー1行だけ。お気に入り専用の行は無く、ヘッダーに同居する。

この上にかぶさる全画面オーバーレイが3つある。いずれも `viewport-fit=cover` の
逃げ幅（`--sa-top` / `--sa-bottom`）を持つ。

| オーバーレイ | 中身 | 詳細 |
|---|---|---|
| `#map-overlay` | 地図選択画面 | `map.md` |
| `#rank-overlay` | 全国山域ランキング＋新雪ランキング | `docs/snow_ranking.md` |
| お気に入り一覧 | 登録地点の編集 | `ui.md` |

## 役割分担

- **画面上部のチャート＝参照**（見るためのもの。指スワイプによる横スクロールは無効）
- **下部のスクラバー帯＝移動**（なぞって選択時刻を動かす）

## 状態（`state`）

アプリの状態は単一のオブジェクト `state` に集約されている（本体冒頭）。

| キー | 中身 |
|---|---|
| `lat` / `lon` | 選択地点の緯度経度 |
| `locationName` | 表示する地点名 |
| `mode` | `'day'` 固定。日帰り/幕営の切替UIは無い（`THRESH.camp` の定義だけ残っている） |
| `allData` | 表示範囲ぶんの時系列（実績72h＋現在＋予報168h） |
| `fullData` | 取得した全データ。再取得なしで範囲を切り出す元 |
| `daily` | 日の出・日の入り |
| `elevation` | Open-Meteo が返すモデル格子の標高(m)。API 用 |
| `demElevation` | 国土地理院の標高タイルから読んだ実際の地点標高(m)。表示用 |
| `cloudProfiles` | 時刻→`[[高度m, 雲量%], …]`。気圧面ごとの雲量 |
| `sliderIndex` | **選択時刻の index。選択の主体** |

標高が2本立てなのは混ぜないため。表示は `displayElevation()` が DEM を優先し、
無ければモデル標高へ落ちる。

地図の設定は `state` ではなく `mapPrefs`（localStorage 永続）に分けてある。

## 表示範囲

**実績72h（`PAST_HOURS`）＋現在＋予報168h（`FORECAST_HOURS`）＝241点**の固定。
「予報 / 実績+予報」の切替UIは無い。取得は `past_days=3&forecast_days=9`。
モデルの予報期間を超えた末尾は `processData` が null を見て切り落とすので、
`forecast_days` に何を指定しても「実際に値がある所まで」が表示される。

## 選択の仕組み

`state.sliderIndex` が主。赤の選択線はその時刻の位置を指す。

- チャートのタップ／ドラッグ → その位置の時刻を選択（スクロールしない）
- 下部スクラバー帯をなぞる → 選択時刻を移動（チャートが連動してスクロール）
- チャートの指スワイプによる横スクロールは無効（`overflow-x: hidden`）
- 選択情報は指追従のポップアップに集約されている。上部の日付バー／HUD／ABCカードは無い
- ポップアップでは判定の根拠になった数値を色分けする（B相当=黄 `.lv1` / C相当=赤 `.lv2`）。
  内訳は `judgeBreakdown()` が出す → `judge.md`

## 描画の流れ

```
fetchWeather(lat, lon)          ← Open-Meteo（data.md）
  └ processData → state.fullData
     └ applyRange → state.allData
        └ render()
           ├ buildCharts()      ← uPlot 4枚（chart.md）
           ├ drawScrubber()     ← 下部の帯（ui.md）
           ├ updateDateBadge() / updatePopup()
           └ updateParticles()  ← 雨雪エフェクト
```

チャートは**データ取得時とリサイズ時にだけ**組み立てる。なぞっている間は
CSS transform で動かすだけで再描画しない → `chart.md`

## 関連

- 仕様の詳細 … このディレクトリの各ファイル
- 関数の在り処 … `code_map.md`
- 設計判断の理由 … `docs/adr/`
- 細かい判断・地雷 … `docs/decisions.md`
- 過去の経緯 … `docs/archive/handoff_v4.md`（原本。更新しない）
