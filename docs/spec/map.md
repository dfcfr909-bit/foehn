# 地図画面（現在の実装）

全画面オーバーレイ `#map-overlay`。地点の選択と、リアルタイムの気象レイヤーを見る画面。

> **役割分担**: このファイルは**いまの実装**を書く。
> **要件**（何を満たすべきか・レイヤーの一覧・未確認事項）は
> `docs/map-selector-requirements.md` にある。重複させない。

## レイアウト

**地図は全画面。** レイアウト上の帯は無く、ヘッダー・検索行・お気に入り円柱・案内文は
すべて `#map-stage` の中に浮かせてある。

- 浮かせた器は `pointer-events: none`、中身だけ `auto`
- 浮かせた器の z-index は **1100**（Leaflet 標準のコントロールが 1000）
- **Leaflet 標準の +/- は出さない**（`zoomControl: false`）。左上は「閉じる」の場所
- 案内文は開いた直後だけ `MAP_HINT_MS`(4500ms) 出て消える（`showMapHint`）。
  短いタップで呼び戻す
- **出典表記は消さない**（利用条件）。浮かせた下段に地点名と並ぶ。`updateMapAttribution()`
- `#map-stage` には `overflow: hidden` が要る（レイヤーパネルは閉じているとき
  `translateY(101%)` で下へ逃がしてあるため）
- ノッチ／ホームインジケータの逃げ幅は **`--sa-top` / `--sa-bottom`（`:root`）**。
  `env(safe-area-inset-*)` を直接書かず必ず変数を通す
- 地図画面だけ `prefers-color-scheme` に追従する（アプリ本体は light 固定）

開閉は `openMap()` / `closeMap()` / `isMapOpen()`。
**地点を選んでも地図は閉じない。** 閉じるのは✕を押したときだけ。

**円柱ピッカーの DOM は1つだけ。** 地図を開いている間だけ🏠ごと（`#fav-bar`）`#map-fav-slot` へ引っ越す
（`moveFavRotaryTo` / `restoreFavRotary`）→ `ui.md`。⚠ 🏠をグラフと地図で同じ位置に出すため、
`#map-bottom` の余白（左右8px・下 6px＋safe-area）はグラフ側の `#fav-bar-slot` と揃えてある

地図を開いている間の「取得中…」は地点名の欄に出る（`showLoading`）。**取り終えたら `hideLoading` が
地点名へ戻す**（v4.105.0。戻していなかったので「気象データ取得中…」が残り続けていた）

## 風の矢印の問い合わせ（v4.108.0）

⚠⚠ **HTTP 429（問い合わせが多すぎる）を出していた。** 控えの鍵が「画面の範囲＋選択時刻」で、
地図を少し動かすたび・時刻を変えるたびに 25地点を取り直していた。

- 格子は**ズームごとに固定の網目**（`windLattice`。タイル幅の 1/3 × 1/2）。動かしても同じ点は同じ鍵
- 点ごとに**2日分の毎時の値**を控える（`windCache`、30分）。時刻を変えても取らない
- 取るのは**控えに無い点だけ**。動き終わってから 500ms 待って1回
- **429 を受けたら1分待つ**（`windBackoffUntil`）。その間は控えだけ描き、「断られた・何秒で取り直す」と出す
- ⚠ 値が返らなかった点も**空で控える**。控えないと描き直すたびに取り直しが続く
- 検査は `tests/smoke_windrate.mjs`（回数と地点の数を数える）

## レイヤー定義

レイヤーは3つの表に外出ししてある。**URL やズーム範囲を変えるときは、コードではなく
この表だけを直す。**

| 表 | 中身 |
|---|---|
| `MAP_BASES` | ベースマップ5種（地理院 std/pale/photo・OSM・Esri）。排他。既定は `MAP_BASE_DEFAULT`='pale' |
| `MAP_OVERLAYS` | 地形系オーバーレイ。複数可＋透過スライダー |
| `MAP_WEATHER` | 気象レイヤー（下記） |

- ズーム範囲は `MAP_ZOOM_MIN`(4) 〜 `MAP_ZOOM_MAX`(18)
- **Esri だけ URL のタイル座標順が `{z}/{y}/{x}`**（x と y が逆）
- ネイティブ範囲外は `maxNativeZoom`/`minNativeZoom` でオーバーズームさせる（空白にしない）
- **赤色立体図風**（`buildRrimLayers`）は陰影起伏図（`RRIM_SHADE`）の上に
  傾斜量図（`RRIM_SLOPE`）を `mix-blend-mode: multiply` で重ねる。**pane 単位**で掛ける。
  単独トグル（`RRIM_CONFLICTS`）とは自動で排他にする
- `pending: true` のレイヤーは UI に出ない（URL が確認できていないものを推測で書かないため）
- `unverified: true` はパネルに「要確認」バッジを出す

適用は `applyBaseLayer()` / `applyOverlays()` / `setMapBase()` / `toggleOverlay()` /
`setOverlayOpacity()` / `isOverlayOn()` / `overlayOpacity()`。
設定の永続化は `loadMapPrefs()` / `saveMapPrefs()`（`MAP_LS_*` キー）。

パネルは `toggleLayerPanel()` / `closeLayerPanel()` / `renderLayerPanel()`。

## 山域・百名山レイヤー（`areas` / `drawAreas`）

`areas.json` から描く。**タイルではないので配信元も利用条件も無く、通信は
`areas.json` 1本だけ**（ランキングと共用のキャッシュ `areasData`）。

一般的な「山地・山脈図」を配信しているタイルは無く、あってもランキングの山域とズレる。
ここで描くのは**ランキングの評価単位そのもの**なので、地図と一覧が必ず一致する。

| 要素 | 内容 |
|---|---|
| **山域の面** | 峰の重心を中心に、最遠の峰＋`AREA_PAD_KM`(4km) を半径にした円。最低 `AREA_MIN_R_KM`(5km) |
| **山域ラベル** | 重心に山域名。`AREA_LABEL_MIN_ZOOM`(7) 以上で出す |
| **百名山の△** | `hyakumeizan: true` の峰。`PEAK_NAME_MIN_ZOOM`(9) 以上で山名も添える |

- 中心と半径は `areaShape(area)`、距離は `haversineKm()`
- 円が画面にかからない山域は飛ばす
- △を押すと**その峰を選ぶ**（`pickMapPoint(lat, lon, name)`。名前が分かっているので
  逆ジオコーディングは通らない）。地図は開いたまま

### 色は判定（A/B/C）

`areaGradeById`（山域id → `'A'|'B'|'C'`）があれば `GRADE_COL` で塗る。
無ければ `GRADE_COL_NONE`（灰色）。

⚠ **この描画のために気象データを取りに行かない。** 地図を開いただけで全国ぶんを
引くと通信が重い。`refreshRanking()` がランキングを組んだ**あとに**
`areaGradeById` を作って渡し、地図が開いていれば貼り直す。

まだ色が無いことは**パネルに出す**（「ランキングを開くと判定の色になります」）。
黙って灰色にしない。

### 「いつの判定か」を出す（`#map-when` / `updateMapWhen`）

色が付いているとき、上部（検索行の下）に1行だけ出す。

```
判定 8/10(月) 6〜18時
判定 8/9(日) 14〜18時（今から先）
```

- 日付は `rankDates`、時間帯は `rankHourWindow()`。**当日は「今から先」を添える**
- ⚠ **地図側に独立した日付を持たせない。** 色の出所はランキングの選択日なので、
  地図に別の日付切替を作ると二重管理になり必ず食い違う。日付を変えるのはランキング側
- 色が無いとき（ランキング未オープン）とレイヤーがオフのときは出さない
- 検索結果が出ている間は隠す（結果の札と重なるため。CSSの `~` で消している）
- 器は `pointer-events: none`。**札の下の地図が触れなくなると全画面にした意味が無い**

### 低ズームでの間引き

低ズームでは山域名を出さない（51個の札が重なって読めなくなるため）。**面と△は残す**。

## 気象レイヤー（`MAP_WEATHER`）

アメダス実測（点）・降雨レーダー・衛星の雲（ひまわり）・雷（気象庁ナウキャスト）・
風向風速（Open-Meteo）。

⚠ **気圧配置（H/L・等圧線）は一度作って外した** → `docs/adr/0010-pressure-layer-removed.md`。
「格子点APIで総観規模の場を、閲覧のたびにブラウザから描く」形が
このアプリの制約と噛み合わなかった。**作り直す前にADRを読むこと。**
詳細な一覧は `docs/map-selector-requirements.md` §15・§18。

- **Windy 風のアニメーション風速は無い**。画面を `WIND_GRID_N`(5)×5 に割った代表点の風を
  1リクエストで取り、矢印を置く（`loadWindGrid` / `drawWindArrows`）。
  矢印の向きは `風向+180°`
- 点で描くレイヤーはズームで間引く（アメダス `AMEDAS_MIN_ZOOM`(8) 以上・最大140地点／
  風 `WIND_MIN_ZOOM`(7) 以上）。出さないときは理由をパネルに出す（`setLayerNote`）
- **アメダスは出す要素を選べる**（`AMEDAS_ELEMENTS`：気温／風／降水／積雪／湿度。
  既定 `AMEDAS_ELEMENT_DEFAULT`='temp'）。選んだ要素を観測していない地点はピンごと出さない
- **アメダスの風向は16方位の index**（0=静穏, 1=北北東 … 16=北）。度は index×22.5
  （`AMEDAS_DIR16` / `amedasDirName` / `amedasDirDeg`）
- **`watchTileStatus()` を全部のタイルレイヤーに付ける** → `data.md`
- **UI にズームレベル（z7/z8）を出さない**。「もう少し拡大すると表示されます」と書く
- **気象レイヤーは SW のキャッシュ対象に入れない**（`TILE_HOSTS` に足さない）→ `pwa.md`

描画は `clearWeatherMarkers` / `loadAmedas` / `drawAmedas` / `refreshWeatherPoints`。

### 地点のピン（`leafletMarker` / `.pick-pin`）

⚠⚠ **ピンはタップを一切受けない**（`interactive: false` ＋ `pointer-events: none`）。

Leaflet の既定のピンは `<img>` なので、**iOSでは長押しすると「画像として」
共有／"写真"に保存のメニューが出る**（実機で指摘を受けた 2026-08-31）。
地図のピンとしてはタップを受ける必要が無く、**触ったら下の地図に抜ける**のが正しい。

- `-webkit-touch-callout: none` … iOSの長押しメニューを止める。
  ⚠ **Chromium には無いプロパティ**なので、テストは原文で確認するしかない
- `-webkit-user-drag: none` / `user-select: none` … 画像としてつまめないようにする
- 影（`.leaflet-marker-shadow`）も既定のピンだけが持つ `<img>` なので一緒に止める

⚠ **他のマーカーまで一括で止めないこと。** 百名山の△（`.peak-tri`）は
**タップで地点を選ぶ**ので、一括指定すると黙って死ぬ（`tests/smoke_pin.mjs` が見張る）。

⚠ **iOS の長押しメニューが本当に出なくなるかは実機でしか確かめられない。**

### 時刻つきタイルの貼り替え

`addTimedTileLayer(def, opacity, replace)` が担う。

- **`WX_REFRESH_MS`(5分) ごとに自動更新**。`refreshWeatherLayers()` が時刻表のキャッシュを
  捨て（`clearWxTimes()`）、新しい basetime で貼り直す
- **新しいタイルが1枚出るまで古いレイヤーを消さない**。取れなかったときは古い方も落とす
- タイマーは地図を開いている間だけ（`startWxRefresh` / `stopWxRefresh`）。
  `document.hidden` のときは自動更新しない
- 古いレイヤーは `staleWxLayers` に積み、`WX_DROP_MS`(8秒) で必ず外す
  （`dropStaleWxLayer` / `dropAllStaleWxLayers`）
- pane は `wxPaneFor(def)` が振り分ける（衛星＝`mapSat`、その他＝`mapNowcast`）

時刻表の扱い（`jmaTimesList` / `latestObsTime` / `jmaTimes` / `timedTileUrl`）→ `data.md`

### 衛星の雲（ひまわり）

バンドは `SAT_BANDS`（既定 `SAT_BAND_DEFAULT`='B13'）。切替は `setSatBand`。
⚠⚠ **着色（`SAT_TINTS`・ピンク／シアン）は v4.99.0 で撤去した。作り直さないこと。**
実機（iOS）では最後まで白のままで、**Chromium では正しく色が付く**
（画素で確認：ピンク(255,46,184) / シアン(51,242,255)）。
つまり**ヘッドレスでは永久に捕まえられない**不具合で、検査を足しても意味が無い。
直す道も塞がっている（下の「1段しか効かない」を参照）。
出せない色を選ばせるUIは嘘なので、チップごと消した → `docs/decisions.md` 2026-09-20

**JPEG なので透明部分が無い。「合成」ではなく「輝度→透明度」で抜く。**

- インライン SVG の `#satAlpha`（`feColorMatrix` で A=輝度 → `feFuncA` で直線変換）を
  `mapSatMask` に掛け、`alpha = (輝度 − cut) / (1 − cut)` にする
- 暗い所（晴れ）は地図が素通し、明るい所（雲）は**色をそのまま残して**乗るので、
  雲頂の色分けが読める。`cut` は暗部の切り捨ても兼ねる
- `cut` は 赤外 0.45 ／ 雲頂 0.40（ひまわりの「晴れ」は真っ黒ではなく中間の灰色のため）
- **フィルタは `buildSatFilter(tint, cut)` が毎回まるごと作り直す**（属性の書き換えで
  済ませない）
- フィルタは2段構成（feColorMatrix ＋ feComponentTransfer(feFuncA linear)）
- `color-interpolation-filters="sRGB"` は必須
- フィルタの SVG を 0×0 や `display:none` で隠さない。実寸1px のまま画面外へ逃がす
- RGB は**常に素通し**（雲頂の色分けを潰さないため）。A＝輝度だけを作る。
  ⚠ かつてここで RGB を定数に差し替えて着色していた。撤去済み（上記）
- 旧方式（`blend`/`floor` による `screen` 合成）は逃げ道として残してある。
  適用は `applyWxBlend(def)`。**掛けないバンドでは必ず外す**

→ 経緯と却下した形は `docs/decisions.md` / `docs/archive/handoff_v4.md`

### 雷マーク

気象庁のタイルはべた塗りの多角形なので、縦Zの稲妻（`THUNDER_BOLT`）を重ねて面に見せる。

| 定数 | 値 | 意味 |
|---|---|---|
| `THUNDER_CELL_PX` | 46 | この間隔で1つ置く |
| `THUNDER_MIN_HITS` | 5 | マス内にこれだけ塗りがあれば雷とみなす |
| `THUNDER_MAX_ICONS` | 64 | 上限 |
| `THUNDER_SCAN_SCALE` | 0.5 | 走査 canvas の解像度（画面の半分） |
| `THUNDER_DEBOUNCE_MS` | 250 | `tileload` からの再走査の間引き |

- 位置はタイル画像そのものから読む。走査 canvas は使い回す（`releaseThunderScan`）
- 見た目は小さく・輪郭線なし・半透明・数多く
- **ぼかしは pane ではなくレイヤーの入れ物（`.leaflet-layer`）に掛ける**
- タイルは別ドメインなので canvas が汚染されると読めない。例外を握って
  「ぼかしだけ効いた状態」に落ちる

関数: `clearThunderIcons` / `updateThunderIcons` / `paintThunderIcons`

## 操作

### 拡大縮小（ダブルタップ＋上下ドラッグ）

`bindDoubleTapZoom(map)` の自前実装。2回目のタップを押したまま上下に動かすと連続ズームし、
ほとんど動かさずに離せば1段拡大する（着地は整数ズーム）。

| 定数 | 値 |
|---|---|
| `DTAP_MS` | 300（2回目のタップとみなす間隔） |
| `DTAP_SLOP_PX` | 30（2回目が同じ場所とみなすズレ） |
| `DTAP_PX_PER_ZOOM` | 90（1段ズームするのに要る指の移動量） |

- 地図は `zoomSnap: 0`（小数ズーム可）。Leaflet 標準の `doubleClickZoom` は切ってある
- **毎フレーム `setZoom` を呼ばない。** `map._move(..., {pinch:true, round:false})` で
  変形だけ動かし、指を離したときに `_animateZoom` で一度だけ確定させる
- **操作中は Leaflet のパンにイベントを渡さない。** 地図の親要素でキャプチャして
  `stopPropagation()` する
- 基準点は `zoomAnchor(map, fallbackLatLng)`。追跡中は自分の位置、していなければタップ地点

### ピンは長押しで立てる

短いタップ＝何も起きない（下の案内文を光らせる。`flashPinHint`）。

| 定数 | 値 |
|---|---|
| `PIN_HOLD_MS` | 500（押し続けたらピンが立つ） |
| `PIN_HOLD_SLOP_PX` | 12（超えて動かすと取り消し＝パン扱い） |

- `map.on('click')` での地点確定は無い（`bindPinLongPress(map)` が担う）
- 押している間は輪（`#pin-hold`）が締まる（`showPinHold` / `hidePinHold` / `cancelPinHold`）。
  閉じる時間は JS から `animationDuration` に入れる
- **緯度経度は押した時点で控える**
- ダブルタップ拡大の1回目は「短いタップ」に見えるので、`flashPinHint()` は
  `dtapLastAt` を見て抑止する
- 長押しは地図コンテナのバブリング側、ダブルタップ拡大は親要素のキャプチャ側。
  `passive: true` で聞く（Leaflet のパンを邪魔しない）

地点の確定は**2本ある。混ぜないこと。**

| 関数 | 使う場面 | 名前 |
|---|---|---|
| `pickMapPoint(lat, lon, name)` | 検索結果・百名山の△ | **渡された名前を使う**。`mapFlyTo` でその地点へ飛ぶ |
| `pickPinPoint(lat, lng)` | 長押しで落としたピン | 地名が分からないので**逆ジオコーディングで引く** |

選んだ地点の**緯度経度**は `updateLatLonLabel()` が `#map-latlon` に4桁で出す。
⚠ **消したり桁を落としたりしないこと。** `areas.json` の座標が山頂を指しているかを
人が確かめる唯一の手段（#13）。開発環境から地理院に到達できず、座標の正否を
機械で決められないため。長押しで山頂を選び、この数字を `areas.json` に写す。

表示名は `setPickedName`、
移動は `mapFlyTo(lat, lon, zoom)`（`flyTo`, duration 0.8s。`setView` の瞬間移動は使わない）。
検索は `doMapSearch()`。

### 検索の速さ（v4.104.0）

- **OSM（Nominatim）と地理院は同時に回す**（`Promise.allSettled`）。以前は OSM×3 → 地理院×3 を
  1本ずつ待っていて、揺れのある語（〜ヶ岳）で最大6往復を直列に待たされた
- ⚠ **Nominatim の中は直列のまま。** 利用条件が「1秒1回まで」なので、揺れの3本を並べて叩かない
- **1本あたり `SEARCH_TIMEOUT_MS`=5秒で打ち切る**（`fetchJsonWithTimeout`）。地理院が詰まれば黙って捨て、
  OSMが詰まっても地理院の結果があれば出す。両方とも空でOSMが落ちていたときだけ「検索失敗」
- 結果を足す順は以前と同じ（OSM → 地理院）。重複を畳むときにどちらを残すかを変えないため
- 打ち直したら前の検索の応答は捨てる（`mapSearchSeq`）

### 検索の履歴（v4.103.0）

**残すのは「打った語」ではなく「選んだ地点」（名前＋緯度経度＋読めていれば標高）。**
押したら `pickMapPoint` でその座標へ直接飛ぶ——**検索し直さないので通信が要らない**
（山の中の弱い電波で待たされない）。同名の山（笙ヶ岳＝岐阜/山形）を取り違えないのも座標を持つから。

- **出すとき**：検索窓にフォーカスして入力が空なら全件。打つと `normalizeSearchName` で
  揃えた部分一致で絞り込む（ヶ／ケの揺れも拾う）。Enter／「検索」はこれまでどおり
- **残すとき**：**検索結果の行を押して地点を選んだときだけ**。長押しのピン・円柱の選択は残さない。
  履歴から選び直したものは先頭へ移す
- **重ねない**：名前（揺れを揃えて）が同じで約1km四方以内なら同じ地点として先頭へ移すだけ
- **上限**：`SEARCH_HIST_MAX`=100件、`localStorage` の `sotoki_search_hist`（約10KB。
  タイルのキャッシュは Cache API で置き場が別）
- **消す**：行の右の✕で1件、「履歴を消去」（確認あり）で全件
- **行は1行**（名前＋標高を左、座標を右）。2行だと枠が太すぎた（v4.106.0。利用者の指摘）。高さは 44px を下限に残す
- ⚠ 保存値は **textContent で組む**（innerHTML に入れない）。標高は **`pickMapPoint` の第4引数に渡さない**
  （DEMの読みで公称の山頂標高ではない。検索結果と同じ扱い）
- ⚠ `#map-results` は **z-index 1150**。右上の浮きボタン（`#map-tools`, 1100）と同じ高さだと
  後ろに書いたボタンが一覧に被り、行の右端（✕）が押せなかった

### 右上の操作ボタン（5つ縦）

**レイヤー**（角丸のピル）・**方位**（丸）・**現在地**（丸）・**天気図 🌐**（丸）・**このアプリについて ℹ️**（丸）。
`updateMapToolButtons()`。天気図と ℹ️ は v4.105.0 でフッターから移した。

- **レイヤーパネルを開いている間は浮きボタンを引っ込める**（`#map-stage.panel-open`）
- **方位バッジは絵で状態を出す**（`paintCompass()`）。環とNが実際の北を向いて回り、
  スマホの絵は常に上を向く。ヘディングアップ中は環が赤。
  Nの文字だけは逆回転させて立て、`paint-order: stroke` で `--surface` のフチを付ける

## 現在地の追跡（`locateMode`）

3段階。`cycleLocate()` が押すたびに回す。

| 状態 | 押すと | 見た目 |
|---|---|---|
| `off` | 現在地へ寄り、**その地点を選ぶ** | 灰色 |
| `once` | 追跡モードへ | 青（`--gps-col`） |
| `follow` | 解除 | 青＋隅に印（`#locate-badge`） |

- **地点を選ぶのはこのボタンの役目**（地図のタップではピンを立てないため）
- 追跡中の現在地は**選択地点のピンとは別のマーカー**（`drawMe()`、半径 `ME_DOT_R`=14px）。
  `updatePinVisibility()` が追跡中は選択地点のピンを出さない
- `watchPosition` で追い（`startTracking` / `stopTracking` / `onGeoUpdate`）、
  `mapFollow` が立っている間は画面中央へ寄せ続ける。
  **`once` は watch するが追従しない**
- **「自分の意思で地点を選んだ」ら追従はやめる**（`releaseFollow()`）。
  呼ぶ場所は3つ——円柱（`selectFav`）・検索結果・長押しのピン。
  追跡ごと切らず `follow` → `once` に落とす
- **「追跡しているか」と「追従しているか」を混同しない。** 拡大縮小の基準点は
  `geoWatchId != null` ではなく `mapFollow` で判定する
- **地図を閉じたら追跡も止める**（電池のため）
- モード設定は `setLocateMode(mode)`

### 地図の向き（ヘディングアップ）

- **`#map` を CSS で回して実現している**（Leaflet に回転機能は無い）。
  `applyMapRotation(deg)` / `setHeadingUp(on)` / `toggleOrientation()`
- 回すと Leaflet の座標変換が狂うので、`patchRotatedInput(map)` が
  `mouseEventToContainerPoint` を中心まわりの逆回転で補正する
- **回転中は手動パンを止める**（`dragging.disable()`）
- 角が欠けないよう、回転中は `#map` の実体を `inset:-40%` で広げる
- 自前のラベル（アメダス・風）は `--map-rot` で逆回転させて立てる
- 方位は iOS が `webkitCompassHeading`、他は `alpha`（360−alpha）。`setHeading(deg)`。
  **iOS は利用者の操作の中で `DeviceOrientationEvent.requestPermission()` が要る**
  （`enableHeading()`）。センサーが使えないときは GPS の `heading` で代用する

## 現在地のまわりだけ雨雲を抜く

`updateMeSpotlight()` / `paintMeSpotlight()` / `paintSpotlightPane(host, tiles)`。

- radial-gradient のマスク。中心 `SPOT_CLEAR_PX`(`ME_DOT_R`+1) は完全に抜け、
  `SPOT_FADE_PX`(`ME_DOT_R`×2.6) で元の濃さに戻る
- **マスクは「実寸のある箱」にしか効かない。Leaflet の pane は 0×0。**
  マスク用の入れ物（`mapNowcastMask` / `mapSatMask`）を1枚挟み、そちらに画面ぶんの
  寸法を持たせる。タイルは中の `mapNowcast` / `mapSat` に入る
- 入れ物は「map pane のずれ（`_getMapPanePos()`）を引いて画面の左上に合わせ、
  中身を同じ量だけ逆に動かす」。同じ値を使う限り差し引きは 0 なのでタイルはずれない
- 対象は `SPOT_PANES` = `[['mapNowcastMask','mapNowcast'], ['mapSatMask','mapSat']]`
- **ナウキャストは `mapNowcast`、マーカーは `mapWeather` と pane を分けてある**
  （同じ pane に入れるとマスクで現在地マーカーごと消える）
- 貼り直しは `move`/`zoom` と現在地更新のたび。rAF で間引く。追跡を止めたら外す

## 標高

`fetchPointElevation(lat, lon)` が国土地理院の標高タイル（`DEM_TILE_URL`、`DEM_ZOOM`=14）から
実際の地点標高を読む。

- タイル座標＋画素は `lonLatToTilePixel(lat, lon, z)`、キーは `demKey()`
- RGB→標高は `decodeDemPixel(r, g, b)`。`x = 2^23` は**無効値**なので null を返す（0m ではない）
- 取得失敗時は標高欄を隠すだけで地図は止めない（`updateElevationLabel`）
- 表示は `displayElevation()` が DEM を優先し、無ければモデル標高へ落ちる → `overview.md`

## 雨の予告（`#map-rain`）

地図画面の下、地点チップの上に1行だけ出す。**2段構え。上の段が出せなければ下の段のまま。**
→ 仕様は `data.md`

## 取得できていないことを地図の上に出す（`#map-trouble`）

`watchTileStatus` が数えた失敗を、レイヤーパネルの中だけでなく**地図の上にも**出す。
押すとレイヤーパネルが開いて内訳が見える。

⚠⚠ **パネルの中だけでは気づけない。** 走行中に地図へ帯や筋が出たとき、
レイヤーを開くまで「取れていない」ことが分からなかった（2026-09-19 の報告）。

⚠⚠ **下地（ベースマップ）には `watchTileStatus` が付いていなかった。**
地図そのものが取れていなくても誰も気づかない状態だったので `applyBaseLayer` で付けた。
帯や筋が出る原因として最初に疑う所。

⚠⚠ **「この範囲に表示なし」を警告に混ぜない。** 雷（`mayBeEmpty`）は元から
タイルが無いことがある。失敗と同じ顔で出すと狼少年になり、本物の失敗を見なくなる。
`setLayerError`（本当の失敗＝赤帯に出す）と `setLayerNote`（表示なし・要拡大・取得中
＝赤帯に出さない）に**関数を分けて**区別する。
⚠⚠ v4.95.0 は第3引数 `isError`（既定「文言があれば失敗」）で分けていたが、点で描く
レイヤーで付け忘れ、実機で『山域・百名山：この範囲に山域がありません』が赤帯に出た。
**旗は付け忘れる。関数なら選ばないと書けない** → v4.96.1 で分割。

⚠ 2件目からは「ほか◯件」に畳む（帯を太らせない）。地図を閉じたら畳む。

検査は `tests/smoke_tiletrouble.mjs`。

## 画面を消さない（`#map-awake` / Screen Wake Lock）

ヘディングアップで自機を追跡している最中に画面が落ちると、地図として使えない。
**その状態のあいだだけ** `navigator.wakeLock.request('screen')` を握る。

⚠⚠ **「充電中だけ」は作れない。** Battery Status API を WebKit が実装していない
（指紋採取のリスクとして見送られたまま出荷されていない）。iOS はサードパーティの
ブラウザも WebKit 強制なので、どのブラウザでも充電状態は取れない。
だから条件は「ヘディングアップ＋追跡のあいだは常に」（利用者判断 2026-09-19）。

⚠⚠ **「あと◯分でスリープ」は出せない。** OS の自動ロック設定は Web から読めない。
分からない数字を書くと嘘になるので、時間は出さず「充電推奨」とだけ言う。

⚠⚠ **ホーム画面のPWAでは iOS 18.4 未満で効かない**（Apple が 18.4 で直したバグ）。
効かなかったときに黙ると、**消えないつもりで山で画面が落ちる**。必ず帯で知らせる。

| 状態 | 帯 |
|---|---|
| 握れている | 🔆 画面を消しません（電池を使います・充電推奨）＋「やめる」 |
| 利用者が切った | 🌙 画面は自動で消えます ＋「消さない」 |
| 握れなかった | ⚠ この端末では画面が消えます（充電器につないでください） |

⚠ 画面を隠すとブラウザが勝手に解放する。`visibilitychange` で取り直し、
`release` イベントで表示を落とす（**握れていない状態で「消しません」を残さない**）。
⚠ モードを抜けたら「やめる」の選択も戻す。前回の取り消しが黙って残っていると、
次に山で使うときに画面が落ちる。

検査は `tests/smoke_awake.mjs`。本丸は「消さないか」ではなく**「嘘をつかないか」**。

## 縮尺のメジャー（`#map-scale`）

拡大縮小したときに「画面のこの長さが何kmか」を出す。**左上**（検索行の下）。⚠ 最初は右下・出典の真上に置いたが、**走行中に読みにくかった**
ので左上へ移し、棒と文字を大きくした（利用者判断 2026-09-19）。

⚠⚠ **Leaflet の `L.control.scale` は使わない。** ヘディングアップは `#map` 要素ごと
CSS の `rotate()` で実現している（`applyMapRotation`）ので、**地図の中に置いた
コントロールは目盛りごと傾いて読めなくなる**。`#map-bottom`（`#map` の外）に自前で置く。
`smoke_mapscale` が「`#map` の中にいないこと」を構造として見ている。

| | |
|---|---|
| 長さの上限 | `MAP_SCALE_MAX_PX`（150px）と画面幅の40%の小さいほう |
| 数字 | `niceScaleMeters()` で **1 / 2 / 5 × 10ⁿ** に丸める |
| 単位 | **1km未満は m、1km以上は km**（利用者判断 2026-09-19） |
| 測り直し | `moveend` / `zoomend`、地図を開いたとき、`invalidateSize` のあと |

⚠ **1pxあたりの距離は緯度で変わる**（メルカトル）。倍率だけの固定式で出さず、
`containerPointToLatLng` で画面上の2点を緯度経度へ戻して `map.distance` で測る。
北海道と八重山では1割以上ちがう。

⚠ **回転は長さを変えない。** 傾いていてもこの数字のままで正しい。

⚠ **`#map-topleft` は `#map-results` より下に重ねる**（z-index 1090 < 1100）。
検索結果と同じ左上に出るので、上に重ねると結果が読めなくなる。
`#map-when`（いつの判定か）も同じ器に縦積みしてある。

⚠ **棒の長さは上限の40〜100%で毎回変わる**（1/2/5への丸めのため）。
検査で長さの下限を固定値にすると丸めの当たり外れで落ちるので、**上限の定数**を見ること。

⚠⚠ **棒に `transition` を付けない。** なめらかに伸び縮みさせると、拡大縮小の途中で
**棒の長さと数字が食い違う**。メジャーは読み取る道具なので、一瞬でも嘘の長さを出さない
（実装時に付けてしまい、検査が食い違いを捕まえた）。

## 札の配色

- 半透明の下地は **`rgba(var(--surface-rgb), α)`** を使う（ライト=白 / ダーク=暗色）
- 下地が `var(--text)` のもの（`#map-search-btn`）は、文字を `#fff` ではなく `var(--surface)` にする
- `#map-attribution` / `#map-rain` は下地も文字も直書きで対になっている

## メモリ

**iOS は Web プロセスごと落ちる。**

- 貼り替えた古いレイヤーには必ず外れる道を用意する（`staleWxLayers` / `WX_DROP_MS`）
- いま載っているレイヤーは `await` の**あと**に取る
- 雷マークの走査 canvas は使い回し、画面の半分の解像度で持つ
- `tileload` からの再走査は rAF ではなく時間で間引く
- 地図を閉じたら `dropAllStaleWxLayers()` と `releaseThunderScan()` で明示的に手放す

## 関連

- **要件・レイヤー一覧・未確認事項** → `docs/map-selector-requirements.md`
- タイルの取得失敗報告・気象庁の時刻表 → `data.md`
- タイルキャッシュ → `pwa.md`
- 円柱ピッカー本体 → `ui.md`

## ⚠⚠ 回転した地図の上で「向き」を描くときの決まり

ヘディングアップでは `#map` に `rotate(mapRotationDeg)` が掛かる（`mapRotationDeg = -方位`）。
**地図の中に置いたものは、この回転をすでに受けている。** ここを取り違えて2つの不具合を出した
（実機で「ヘディングアップが効いていない、逆に進んでいるみたい」と指摘 / v4.90.0 で修正）。

| もの | どこにある | 正しい指定 |
|---|---|---|
| 現在地の矢尻 `.me-arrow` | 地図の中（Leaflet マーカー） | **方位のぶんだけ**。地図の回転を足さない |
| 風向の矢印 `.wind-a` / `.amedas-arrow` | 地図の中の**逆回転した箱**の中 | 風向 **− `--map-rot`**（地図の回転を足し戻す） |
| 札・△（`.area-label-box` 等） | 地図の中 | `--map-rot` で逆回転して立てる |
| 方位環（ボタンの中） | 地図の**外** | `mapRotationDeg` をそのまま |

- ⚠ **矢尻に `mapRotationDeg` を足さない。** 足すと二重に効き、
  ヘディングアップで**画面上 -方位**になる（南を向くと真下を指した）
- ⚠ **箱の中の矢印は地図の回転を失う。** 箱が文字を立てるために逆回転しているため。
  風向は地理的な向きなので**足し戻す**
- ⚠ **角度を JS で焼き込まない。** 地図は方位が変わるたびに回るので、
  焼き込むと次に描き直すまでずれたままになる。CSS 変数（`--wind-deg`）で持ち、
  `--map-rot` と一緒に計算させる

### 検査の書き方

⚠⚠ **要素自身の `transform` を見てはいけない。** 祖先（回転した地図・逆回転した箱）を
勘定できないので、**画面上では逆を向いていても素通りする**。
実際、旧い検査は `.me-arrow` の `style.transform` が `rotate(0deg)` であることだけを見ており、
**矢尻が真後ろを向く不具合を通していた**。

祖先の `transform` をすべて掛け合わせて**画面上の向き**を出すこと
（`smoke_mapui.js` の `__screenDeg`）。風向は「回っているか」ではなく
**指定した風向と一致するか**で見る。
