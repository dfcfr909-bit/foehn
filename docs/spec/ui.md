# UI — ヘッダー・日付バッジ・円柱ピッカー・スクラバー帯・選択線

チャート本体以外の操作部分。関数の在り処は `code_map.md`。

## ヘッダー（48px 1行）

左＝日付バッジ（大きな日付＋選択時刻＋★） / 中＝お気に入り円柱 / 右＝「現在」ボタン。

「現在」ボタンは選択が現在から離れたときだけ出る（`updateNowButton()`）。
出ている間は円柱の枠が狭くなるが、ResizeObserver が寸法を取り直すので破綻しない。

## 日付バッジ（`#date-badge`）

画面で一番目立つ位置。`updateDateBadge()` が更新する。

- 選択中の「N月N日(曜)」を 22px、その隣に選択時刻「HH:00」を 18px
- スクラバーの操作に追従する
- 祝日名だけ2行目に落とす（`#date-holiday:empty` で消える）
- **★（お気に入り登録）は時刻の右**、バッジの中にある（`toggleFavStar` / `updateFavStar`）
- ブランド表記は無い。バージョンは下段（凡例行）の右端

### 曜日と祝日の色分け

**日曜・祝日は赤、土曜は青。祝日は「（山の日）」のように名称も出す。**

`jpHoliday(date)` が算出する。内訳:

| 関数 | 担当 |
|---|---|
| `jpHolidayBase(y, m, d)` | 日付固定（`HOLIDAY_FIXED`）＋ハッピーマンデー（`HOLIDAY_NTH`）＋春分/秋分 |
| `nthMondayDate(y, m, n)` | 第n月曜 |
| `equinoxDate(y, spring)` | 春分・秋分の近似式（1980〜2099年で有効） |
| `jpHoliday(date)` | 上に加えて**振替休日・国民の休日**を判定 |
| `isRestDay(date)` | 土日・祝日をまとめて判定 |

五輪年のような一度きりの特例日程には非対応（表示は前後10日ぶんなので実害なし）。

スクラバー帯の日付ラベルも同じ規則で色分けし、祝日名を添える。

## お気に入り円柱ピッカー（`#fav-rotary`）

縦軸まわりに回る円柱の側面に地点名が書いてあるイメージ。

- **スクロールは入力（慣性・スナップ）専用**。透明トラック `#fav-track` がスクロール量を作り、
  `position: sticky` の `#fav-stage` に駒を絶対配置する。舞台はスクロールしないので、
  駒の位置を JS が円柱の座標として自由に決められる
- 正面からの距離 d（駒数）に対し
  角度 = d × `FAV_ANGLE`、x = `FAV_R` × sin(角度)、z = `FAV_R` × cos(角度) − `FAV_R`、rotateY(角度)。
  88deg を超えた駒は円柱の裏側なので非表示（`updateFavRotaryTransforms`）
- **`FAV_R` と `FAV_ANGLE` は固定値ではなく `layoutFavRotary()` が枠の広さと駒の幅から決める。**
  隣の駒が正面と重ならない条件 `R·sinθ − (cw/2)cosθ ≧ cw/2` を満たす最小の角度を採る。
  枠が狭いほど半径は小さく角度は大きくなる
- 枠幅は日付の文字数で変わるので **ResizeObserver で監視して寸法を取り直す**
- 枠自体は `flex: 1 1 0` ＋ `margin-left:auto` で、日付と★を置いた残りを右寄せで使う
- 正面の駒＝選択地点（`.centered`）。回している最中も正面の駒が即座に強調される
- **地点リストの顔ぶれが変わらない限り DOM を作り直さない**（`favRotaryKey` で判定）

主な関数: `favRotaryItems` / `renderFavRotary` / `layoutFavRotary` /
`updateFavRotaryTransforms` / `spinToIndex` / `centerActiveChip` / `centeredChip` / `selectFav`

**円柱の DOM は1つだけ。** 地図を開いている間だけ `#map-fav-slot` へ引っ越し
（`moveFavRotaryTo` / `restoreFavRotary`）、閉じたらヘッダーへ戻す → `map.md`

## お気に入り一覧（全画面オーバーレイ）

`openFav` / `closeFav` / `renderFavList` / `saveCurrentAsFav`。
永続化は `loadFavs` / `saveFavs`（localStorage）。

## 時間スクラバー帯（`#scrubber`）

- **チャートとまったく同じ座標系を使う。** 左右の余白（`chartPadL`/`chartPadR`）、
  内容幅（`chartTotalW()`）、1時間の幅（`pxPerHourVal`）、x座標（`idxToX()`）、
  スクロール量のすべてが `#charts-inner` と共通。だから帯の目盛りは
  真上のチャートの同じ時刻の真下に来る
- **なぞり中の同期は `scrubFrame()` の requestAnimationFrame ループが行う。**
  最初の scroll イベントでループを起こし、以降は毎フレーム帯の `scrollLeft` を実測して
  チャートと上下の選択線を更新する
- なぞり中は上下の選択線を**どちらも帯の実測値**で置く（`positionScrubLine(at)`）
- チャート側からの同期は `mirrorScrollToScrubber()`。ループ動作中は主導権を譲る
- 選択インジケータ `#scrubber-center` は固定位置ではなく、`positionScrubLine()` が
  赤い選択線とまったく同じ x に置く
- 帯の canvas（`drawScrubber()`）に昼夜の地色・ABC判定バー・降水バー・日付区切り・
  現在時刻の印を描く。判定バーの色は `GRADE_COL`（A=`#2a7d4f` / B=`#e8a020` / C=`#d03030`）

レイアウトは `layoutScrubber()`、スクロール量→index は `scrubberIndexFromScroll()`。

## 選択線の位置（`cursorX`）

- **両端に余白は置かない**（`chartPadL` / `chartPadR` は 0）
- 選択線はふだん画面の `SCRUB_POS`(**0.5＝ど真ん中**)に固定だが、
  **両端の ramp px ぶんだけかけてその端へ寄っていく**。これで余白ゼロのまま
  スクロールだけで先頭・末尾の時刻に届く。中央固定なので先頭側にもランプが要る
- `cursorX` がスクロール量に依存するため、`scrollToIndex()` は不動点反復で解く

関連: `setChartOffset` / `chartMaxOffset` / `indexFromClientX` / `indexScreenX` /
`setSelectedIndex` / `setScrollBoth`

## ポップアップ（選択情報）

- 初期位置は `POPUP_HOME`(0.13)。`SCRUB_POS` に追従させると中央の選択線と重なるので別定数
- **指を離してもその場に留まる**。`resetPopupPosition()` を呼ぶのは初期表示とリサイズ時だけ
- 中身は `updatePopup()`。判定の根拠になった数値を `judgeBreakdown()` の結果で色分けする
  （B相当=黄 `.lv1` / C相当=赤 `.lv2`） → `judge.md`
- 言い回しは `rainWord(mm)` / `windWord(ms)`
- 位置は `positionPopupAt(clientX, clientY)`

## プログラム的スクロール（「現在」ボタンなど）

- `animateScrollTo(target, ms)` が自前の rAF アニメーションでチャートと帯を
  **毎フレーム同じ値へ同時に**動かす。実行中は `programmaticScroll` を立てて
  両方のスクロールハンドラを止める
- **ブラウザ標準の `scrollTo({behavior:'smooth'})` は使わない**（片方しか動かせない）
- 帯に指が触れたら `cancelScrollAnim()` で即座に操作を優先する
- 「現在」へ飛ぶのは `jumpToNow()`

## 予報の確からしさの目安（`forecastLead` / `#pop-lead` / `#rank-lead`）

「週末など、だいぶ先の予報は精度が怪しいと分かるようにしたい」という要望から。
選択時刻が先のときだけ、ポップアップとランキングの注記に小さく出す。

| 先の長さ | 表示 |
|---|---|
| 48時間未満（実績・直近） | **出さない** |
| 48〜120時間 | `N日先・確度中`（橙） |
| 120時間以上 | `N日先・確度低`（赤） |

⚠⚠ **これは実測した的中率ではない。** 「何日先か」から引いた一般的な目安。
`LEAD_TITLE` に「先の長さから引いた目安です。実測した的中率ではありません」と書いて
`title` に出している。**割合の数字（85%など）を根拠なく出さないこと**——
目安より悪い。判断を誤らせる。

⚠ **近い予報には出さない。** 全部に出すと狼少年になり、本当に怪しいときの印が効かなくなる。

⚠ **ABC評価には一切関与させない。** 表示だけ（`tests/smoke_lead.mjs` が原文で見張る）。

⚠ **空のときは場所を取らない**（`:empty { display: none }`）。近い予報で余白が空くのを防ぐ。

⚠ ランキングでは**対象日の行動時間帯の頭**を基準にする。日付の0時にすると1日ぶん近く見える。

### 気象庁の信頼度で置き換える（`fillReliability`）

**峰と分かっている地点では、目安を気象庁の週間予報の信頼度に置き換える。**
`areas.json` の `peaks[].office` を使う → `docs/spec/judge.md`

⚠⚠ **これは「降水確率と気温」の信頼度であって、風の信頼度ではない。**
このアプリは**風で判定する**ので、そこを書かないと**意味が反転して伝わる**。
短い表示に収まらないので `title` に必ず添える
（⚠ `title` は素のテキスト。Markdown の `**` を書かない）。

⚠⚠ **A/B/C という字面がアプリの判定と衝突する。** アプリのA/B/Cは「登山適性」、
気象庁のA/B/Cは「予報の信頼度」。同じ字で出すと**判定Cと読まれる**。
画面には **高/中/低**（`気象庁の確度 低`）で出し、**元の記号は `title` に回す**。

- ⚠ **目安と本物を同時に出さない。** 同じ要素を上書きする。どちらを信じるか分からなくなる
- ⚠ 信頼度は**3〜7日目にしか入らない**（1〜2日目は空）。空なら**目安のまま**にする——
  「無い」と「読めなかった」を混ぜない
- ⚠ **配列の何番目かを決め打たない。** `reliabilities` を持つ `timeSeries` を探す
- ⚠ **速くスクラブすると古い応答が後から届く。** 通し番号で捨てる
- ⚠ 峰かどうかは**緯度経度で照合**する（約500m）。選び方（ランキング・△・検索・
  お気に入り・前回の復元）に依らず効かせたいため
- ⚠ `areas.json` は地図やランキングを開くまで読まれないので、ここで**遅延して読む**
- 予報区が複数ある峰（富士山）は**低い方の色**にする（安全側）
- 引けなければ**目安のまま**（黙って壊れない）

## 天気図（`#wxmap-overlay` / `openWxMap`）— #26

気象庁の**速報天気図・予想天気図をそのまま1枚絵で出す**。フッターの「🌐 天気図」から開く。
ADR-0010 で「格子点から自前で描く気圧配置」を外した代わり。

- 情報源: `https://www.jma.go.jp/bosai/weather_map/data/list.json` と
  同 `/png/{名前}`。⚠ **どちらも `access-control-allow-origin: *`**（実測。`scripts/probeJma.mjs`）
- 一覧の形（2026-08-25 実測）:
  `{ near:{now,ft24,ft48}, near_monochrome, asia:{...}, asia_monochrome }`
- 画面: 実況／24時間後／48時間後 × 日本周辺／アジア広域。タップで原寸に拡大

⚠ **地図には重ねない。** 天気図は円錐図法などで描かれた絵で、地図（Webメルカトル）と
座標系が違う。重ねると **H の位置が数百kmずれる** → `docs/adr/0010-pressure-layer-removed.md`

⚠ **前線が描いてあるのが最大の利点。** 気圧の場だけからは原理的に出せない。

⚠ **ファイル名の時刻はUTC。** そのまま出すと**9時間ずれる**。
`20260825143731_0_Z__C_010000_20260825120000_MET_CHT_JCIspas_...` の
前が発表時刻、後ろが基準時刻。

⚠ **予想図（ft24/ft48）の2つ目の時刻は基準時刻であって対象時刻ではない。**
対象は基準＋24h／＋48h。取り違えると「1日前の予想」と表示してしまい、
**絵は正しいので気づけない**。

⚠ **並び順を仮定しない。** 名前から読んだ時刻で最新を選ぶ（`wxMapPick`）。
一覧が昇順に見えても、順序が変われば黙って古い絵を出すことになる。

⚠ **canvas に載せない。** `<img>` で出すだけなら CORS は要らない形が保てる。
⚠ **CSSフィルタで反転・減光しない**（iOS特有の不具合を2回踏んでいる）。モノクロ版も使わない。
⚠ **一覧は1回だけ引く**（切り替えるたびに叩かない）。
⚠ 図を切り替えたら拡大は畳む（隅が映ったまま別の図になるのを防ぐ）。

検査は `tests/smoke_wxmap.mjs`。

## 読込オーバーレイ

`showLoading(msg)` / `hideLoading()`。**地図を開いている間は出さない**
（`isMapOpen()` を見て抑止し、代わりに左下のバッジに状態を出す）→ `map.md`

## 関連

- チャート側の座標系 → `chart.md`
- 地図画面での円柱の引っ越し → `map.md`
- ABC 評価 → `judge.md`
