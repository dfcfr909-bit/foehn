# チャート4枚

uPlot で描く4枚のパネル。組み立ては `buildCharts()`、実際の絵は各パネルの
draw hook が canvas に直接書く。関数の在り処は `code_map.md`。

## 4枚の中身

| # | パネル | 左軸 | 右軸 | 主な描画関数 |
|---|---|---|---|---|
| 1 | **気温** | ℃ | — | `drawTempOverlay` |
| 2 | **雲/雨** | 降水 mm/h | 高度 km | `drawCloudPrecip` / `drawCloudOverlay` |
| 3 | **風** | 風速 m/s | 突風 m/s | `drawWindOverlay` |
| 4 | **気圧** | hPa | — | `drawPressOverlay` |

高さは `computeChartHeights(outerH)` が表示領域の高さから配分する
（気温29% / 雲・雨 / 風17% / 気圧23%）。合計は `chartsTotalH()`。

## 座標系（スクラバー帯と共通）

| 定数 | 値 | 意味 |
|---|---|---|
| `PADDING_L` | 36 | 左軸ガターの幅 |
| `PADDING_R` | 32 | 右軸ガターの幅 |
| `SKY_TOP_PAD` | 46 | 気温パネル上部の余白（日付ラベル＋天気アイコンの置き場） |
| `TIME_AXIS_H` | 14 | 各チャート下部の時刻ラベル帯 |
| `HOURS_PER_SCREEN` | 24 | 1画面に収める時間数 |
| `SCRUB_POS` | 0.5 | 選択線の画面内位置（ど真ん中） |
| `PX_RATIO` | max 2 | canvas の解像度倍率 |
| `pxPerHourVal` | 実測 | 1時間あたりの px 幅 |

- 全体幅は `chartTotalW()` ＝ `PADDING_L + HOURS * pxPerHourVal + PADDING_R`
- index → x は `idxToX(idx)` ＝ `PADDING_L + (idx + 0.5) * pxPerHourVal`
- **下部スクラバー帯はこの座標系をそのまま共有する** → `ui.md`

## 移動は CSS transform

`#charts-inner` を `translate3d(-chartOffset, 0, 0)` で動かす。`scrollLeft` は使わない。
スクロール量の実体は `chartOffset`、上限は `chartMaxOffset()`。
`chartsWrapper` の scroll イベントは発火しない。
→ `docs/adr/0002-uplot.md`

## 左右の軸ガター

スクロールしても残る固定の軸。`drawAxisGutter()`（左）と `drawAxisGutterRight()`（右）。

- 単位は「気温／℃」のように2段組み
- 名前・単位・数値はすべて**右寄せ**
- 目盛りの数字は 11.5px
- 気圧だけは「値から位置を決める」と単位と重なるため、
  **先に安全な位置（プロット高の45%と82%）を決めて、そこに対応する値を書く**

## 天気記号

時刻ラベルと天気アイコンは**2時間ごと**。

- 白い丸の座布団の上に、`drawWeatherGlyph()` が自前のベクター記号を載せる
- 区分は `weatherEmoji()` と同じ（太陽・月・雲・雨・雪・雷・霧）。原色寄りのべた塗り
- 座布団の半径 `icoR` は `pxPerHourVal - 0.6`（2時間間隔で隣と接しないギリギリ）
- パーツは `wxSun` / `wxMoon` / `wxCloud` / `wxDrops` / `wxBolt`
- **`destination-out` で抜かない**（下の白い座布団ごと消える）
  → `docs/adr/0004-vector-glyph.md`
- 選択情報のポップアップだけは絵文字（`weatherEmoji`）

### 月齢

**月は実際の満ち欠けを描く**。

- `moonPhase(date)` が平均朔望月（`SYNODIC_MONTH` 29.530588853 日、基準 `NEW_MOON_EPOCH`）
  からの近似で位相を出す
- `wxMoon()` が輪郭の半円＋ターミネーター（楕円）を1つのパスにして明るい側を塗る
- 誤差は概ね ±0.5日。**潮汐や暦には使わない**

## 昼夜シェーディング

`paintNightOverlay(u, ctx, H, scale)` が**夜の帯だけ**を塗る。

- 白地でも空色グラデ地でも同じ関数が使えるので、雲/雨パネルにも同じ夜が掛かる
- 帯は `nightBandsFracs()`、昼は `dayBandsFracs()`（日の出〜日の入り。データが無ければ5〜19時）
- 境界は `softGradient()` で左右に約1.6時間ぶんぼかす（`softEdgePx()`）
- 色は `NIGHT_RGB` = `40,52,96`
- **濃さは月齢で変わる**。`nightAlphaAt(date)` が輝面比 `moonIllum()` から
  `NIGHT_ALPHA_NEW`(0.38, 新月＝暗い) 〜 `NIGHT_ALPHA_FULL`(0.20, 満月＝明るい) を返す。
  夜の帯ごとに真ん中の時刻で引く
- **月の出入りは見ていない**（その夜の月がどれだけ満ちているかだけ）
- 第4引数 `scale` でパネルごとに倍率をかけられる（雲パネルは 1.4）

## 雲/雨パネル

### 「青空に白い雲」

| 定数 | 値 |
|---|---|
| `SKY_TOP` | `#6f9fca`（上空＝高度12km側） |
| `SKY_BOTTOM` | `#93c0e2`（地上付近） |
| `CLOUD_RGB` | `252, 253, 255` |
| `ALT_TOP` | 12000（高度軸の上限 m） |
| `ALT_TICKS` | 1500 / 3500 / 6000 / 9000 m |

- 夜は**空だけ**が暗くなり雲は明るいままなので、昼でも夜でも雲だけが浮く
- グラデーションの上下差は小さい（下を淡くしすぎると低層の雲が白地に白で埋もれる）
- **高度で色を変えない**。高度の手がかりはグラデーションと右軸の目盛りが担う
- 高度グリッド線は白の破線、降水バーは明るい縁つき、時刻軸の帯だけは白
- 凡例 `#cloud-legend` は `cloudAlpha()` と同じ濃さを並べてある。
  **カーブか空の色を変えたら凡例も直す**

### 雲の無段階描画

`buildCloudRaster` / `cloudAlpha` / `cloudSlopes` / `cloudRasterFor` の4つ。

1. **高度方向** … 気圧面のあいだを `cloudSlopes()` の単調3次補間（Fritsch–Carlson）で
   つなぐ。単調性の制限があるので雲量が 0〜100% の外へ行かない。読み出しは `cloudAt()`
2. **濃さ** … `cloudAlpha(cov)` の連続カーブ `0.95·((cov−3)/97)^0.75`
3. **時刻方向** … 1時間を `CLOUD_SUB`(8) 分割・高さ `CLOUD_ROWS`(192) 段のラスタを
   `createImageData` で組み、隣の時刻とは smoothstep で混ぜる。それを1枚の
   `drawImage` で引き伸ばして貼り、さらに `ctx.filter` の blur 1.2px を重ねる

ラスタは `cloudRasterFor()` が `state.allData` と `state.cloudProfiles` の参照でキャッシュする。
組み立て時に一度作るだけなので、なぞっている間の負荷はゼロ。

気圧面は**14層**（1000/975/950/925/900/850/800/700/600/500/400/300/250/200 hPa）→ `data.md`

## 気圧パネル（上下2段）

| 定数 | 値 | 意味 |
|---|---|---|
| `PRESS_LINE_FRAC` | 0.70 | パネルのうち上段（絶対気圧の線）が使う割合 |
| `PRESS_BAR_MAX` | 8 | 下段 ΔP バーの振り切り（hPa/6h） |
| `PRESS_BOMB_DP` | -3.5 | これより急な下降に爆弾マーク |
| `PRESS_WIN_MIN_HPA` | 10 | 縦窓の最小の幅 |
| `PRESS_WIN_PAD` | 1.3 | 画面内の変動に対する余裕 |
| `PRESS_WIN_COARSE` | 2.5 | なぞっている間の描き直し閾値 |
| `PRESS_WIN_FINE` | 0.4 | 落ち着いてからの合わせ直し |
| `PRESS_WIN_SETTLE_MS` | 180 | 落ち着いたとみなす時間 |

- **上段＝絶対気圧の線**（6時間変化量で色分け。`pressSegStyle(dp)`）／
  **下段＝ΔP6h のバー**。バーは常に ±`PRESS_BAR_MAX` の固定スケール
- **上段は「縦窓」で、選択時刻に追従して上下に動く**。`pressWindowFor(idx)` が
  画面に入る範囲の実変動＋余裕だけを映し、`applyPressWindow` / `updatePressWindow`
  が二段構え（なぞり中は coarse、離してから fine）で合わせる。
  左のガターの数字も一緒に動くので絶対値は読めたまま
- 線は `u.valToPos(v,'p')` ではなく上段に収まるよう自前で y を出す。
  スケールのレンジ自体は `p` のまま（ガターの数字と揃えるため）
- ガターの hPa 目盛りも上段の範囲で割る（`pressGutterLayout()`）
- **線は必ずクリップする**（縦窓は選択時刻のまわりに合わせてあるため）
- **急降下には爆弾マーク**。`pressBombIndices(data)` が連続して閾値を割っている
  区間ごとに、いちばん急な1点だけを返す。描画は `drawPressBomb()`
- 色は **下降＝暖色（橙→赤）／上昇＝寒色（水色→青）**。急なほど濃く太い

## 風パネル

`drawWindOverlay(u)` が風速バー（`THRESH` で色分け）と風向矢印（`drawWindArrow`）を描く。
右軸は突風。矢印の向きは `風向+180°`（風向は吹いてくる方角なので進む向きは逆）。

## 雨・雪のエフェクト

`updateParticles()` / `makeParticle()` / `drawRaindrop()` / `drawSnowflake()`。

- 選択時刻の**風速と風向に合わせて横に流す**。進む向きは `-sin(風向)`
- 横殴りのときは風上側の画面外からも湧かせ、左右にはみ出したら出し直す

## 現在時刻の印

`nowIndexFrac()` が現在時刻の小数 index を出し、`drawNowMarker(u)` が印を描く。
選択が現在から離れると `updateNowButton()` がヘッダーの「現在」ボタンを出す。

## 関連

- 選択線・スクラバー帯 → `ui.md`
- データの取得と加工 → `data.md`
- ABC 評価の色分け → `judge.md`
- uPlot を選んだ理由 → `docs/adr/0002-uplot.md`
- ベクター記号にした理由 → `docs/adr/0004-vector-glyph.md`
