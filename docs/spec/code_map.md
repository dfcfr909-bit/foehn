# コードマップ（`sotoki_v4.html` の関数索引）

**本体を読む前にまずこれを見る。**

`sotoki_v4.html` は単一HTML構成で、実測 **7,300行 / 関数 約295**（2026-08-09 時点）。
全文を読むと消費が大きいので、「どのブロックの、どの関数か」をここで当たってから
その周辺だけを読む。

## 使い方

1. **まず機能ブロックの見出しを見る**（下の目次）
2. そのブロックの表から関数を選ぶ
3. 目安行を頼りに読む。**ズレていたら関数名で grep する**

⚠ **目安行は ±50行の目安。** 改修のたびにズレるが、逐一直すことはしない。
関数名は変わらないので、行がズレたら `grep -n 'function 名前' sotoki_v4.html` で引く。

⚠ 全関数を載せてはいない。ワンライナーのヘルパーは省いてある。

このファイルだけは spec の「1ファイル150〜250行」の目安を外れている。索引なので
割ると引けなくなるため、代わりに**機能ブロックの見出しで区切って**上から読まなくて
済むようにしてある。

## ファイルの大まかな区切り

| 範囲 | 中身 |
|---|---|
| 1〜27 | `<head>`・CDN（Leaflet）・同梱スクリプト（uPlot / `snowRanking.js`） |
| 28〜1629 | `<style>`（16ブロック。下記） |
| 1630〜1886 | `<body>` のマークアップ |
| 1887〜7137 | `<script>`（本体。以下すべてここ） |

### `<style>` の内訳（目安行）

| 行 | ブロック |
|---|---|
| 29 | BASE & TYPOGRAPHY |
| 88 | APP SHELL |
| 103 | HEADER |
| 228 | 日付・曜日・時刻バー |
| 268 | HUD – 大型数値表示 |
| 317 | ABC CARD |
| 369 | AI全国概況カード |
| 440 | CHARTS AREA |
| 581 | FOOTER |
| 666 | MAP OVERLAY（方位バッジ 862 / 現在地ボタン 876） |
| 1155 | FAVORITES OVERLAY |
| 1216 | RANKING OVERLAY |
| 1390 | SNOW RANKING |
| 1517 | LOADING / ERROR |
| 1543 | PARTICLES CANVAS |
| 1554 | LEGEND |

## 目次（機能ブロック）

| 行 | ブロック | 仕様 |
|---|---|---|
| 1888 | [状態と閾値](#状態と閾値) | `overview.md` / `judge.md` |
| 1920 | [気象データ取得](#気象データ取得) | `data.md` |
| 2119 | [GPS・地点名](#gps地点名) | `data.md` |
| 2156 | [レンダリング統括](#レンダリング統括) | `overview.md` |
| 2184 | [お気に入り円柱ピッカー](#お気に入り円柱ピッカー) | `ui.md` |
| 2438 | [日付バッジ・祝日・ポップアップ](#日付バッジ祝日ポップアップ) | `ui.md` |
| 2612 | [ABC評価（変更禁止）](#abc評価変更禁止) | `judge.md` |
| 2686 | [チャート — 組み立てと座標系](#チャート--組み立てと座標系) | `chart.md` |
| 2904 | [チャート — 気圧パネル](#チャート--気圧パネル) | `chart.md` |
| 3138 | [チャート — 軸ガター](#チャート--軸ガター) | `chart.md` |
| 3286 | [チャート — 昼夜シェーディング・背景](#チャート--昼夜シェーディング背景) | `chart.md` |
| 3423 | [チャート — 雲の無段階描画](#チャート--雲の無段階描画) | `chart.md` |
| 3594 | [チャート — 各パネルの描画hook](#チャート--各パネルの描画hook) | `chart.md` |
| 3879 | [天気記号と月齢](#天気記号と月齢) | `chart.md` |
| 4054 | [雨雪のパーティクル](#雨雪のパーティクル) | `chart.md` |
| 4144 | [時刻選択・スクロール・スクラバー帯](#時刻選択スクロールスクラバー帯) | `ui.md` |
| 4479 | [地図 — レイヤー定義](#地図--レイヤー定義) | `map.md` |
| 4723 | [地図 — 本体とタイルレイヤー](#地図--本体とタイルレイヤー) | `map.md` |
| 5013 | [雨の予告](#雨の予告) | `data.md` |
| 5185 | [タイル取得の失敗報告](#タイル取得の失敗報告) | `data.md` |
| 5235 | [点で描く気象レイヤー・雷マーク](#点で描く気象レイヤー雷マーク) | `map.md` |
| 5521 | [地図 — 開閉・レイヤーパネル](#地図--開閉レイヤーパネル) | `map.md` |
| 5769 | [標高タイル](#標高タイル) | `map.md` |
| 5845 | [タイルキャッシュ（SW連携）](#タイルキャッシュsw連携) | `pwa.md` |
| 5885 | [地図 — 地点の確定・移動・検索](#地図--地点の確定移動検索) | `map.md` |
| 5916 | [現在地の追跡と地図の向き](#現在地の追跡と地図の向き) | `map.md` |
| 6224 | [地図 — 拡大縮小・長押しピン](#地図--拡大縮小長押しピン) | `map.md` |
| 6491 | [お気に入り](#お気に入り) | `ui.md` |
| 6559 | [全国山域ランキング](#全国山域ランキング) | `judge.md` |
| 6857 | [新雪ランキング（表示）](#新雪ランキング表示) | `docs/snow_ranking.md` |
| 7011 | [雑多（保存・読込・リサイズ・SW・BOOT）](#雑多保存読込リサイズswboot) | — |
| 7072 | [AI全国概況](#ai全国概況) | `docs/ai_outlook.md` |

---

## 状態と閾値

| 名前 | 役割 | 目安行 |
|---|---|---|
| `state` | アプリの状態（地点・データ・選択index・標高） | 約 1891 |
| `PAST_HOURS` | 実績で遡る時間数（72） | 約 1905 |
| `THRESH` | **ABC判定の閾値。調整するのはここだけ** | 約 1930 |
| `WIND_LEVELS` | 判定に使う気圧面と高度（ADR-0006） | 約 1913 |
| `windLevelFor(elevM)` | 山頂高度に最も近い気圧面 | 約 1920 |
| `pickWindSource(summitM, modelM)` | **気圧面と地上10mのどちらで判定するか** | 約 1932 |
| `windSourceLabel(src)` | どこの風か画面に出す文言 | 約 1950 |

## 気象データ取得

| 関数 | 役割 | 目安行 |
|---|---|---|
| `fetchWeather(lat, lon)` | Open-Meteo（`jma_seamless`）本体。**`wind_speed_unit=ms` 必須** | 約 1923 |
| `fetchSupplemental(lat, lon)` | 突風・気圧面ごとの雲量（models未指定の補助リクエスト） | 約 1964 |
| `CLOUD_LEVELS` | 気圧面14層の定義 | 約 1957 |
| `cloudProfileAt(d)` | 時刻→高度別の雲量プロファイル | 約 2017 |
| `cloudSlopes(prof)` | 高度方向の単調3次補間（Fritsch–Carlson）の傾き | 約 2031 |
| `cloudAt(prof, alt, slopes)` | 任意高度の雲量を読む | 約 2050 |
| `indexOfNow(data)` | 現在時刻の index | 約 2067 |
| `applyRange()` | `fullData` → `allData` の切り出し | 約 2076 |
| `processData(json)` | API応答の整形。`dpress` 算出・末尾nullの切り落とし | 約 2087 |
| `isoHour(t)` | 時刻キー | 約 2013 |

## GPS・地点名

| 関数 | 役割 | 目安行 |
|---|---|---|
| `fetchGPS(opts)` | `navigator.geolocation` の包み | 約 2122 |
| `reverseGeocode(lat, lon)` | 緯度経度→地点名 | 約 2147 |
| `updateLocationName()` | 地点名の表示更新 | 約 2180 |
| `sameLoc(a, b)` | 同一地点の判定 | 約 2198 |

## レンダリング統括

| 関数 | 役割 | 目安行 |
|---|---|---|
| `render()` | **描画の入口。** チャート組み立て・帯・バッジ・ポップアップを一括更新 | 約 2159 |

## お気に入り円柱ピッカー

| 関数 | 役割 | 目安行 |
|---|---|---|
| `favRotaryItems()` | 駒に並べる地点の一覧 | 約 2203 |
| `renderFavRotary()` | 駒のDOMを作る（顔ぶれが同じなら作り直さない） | 約 2224 |
| `layoutFavRotary()` | **枠の広さから `FAV_R` / `FAV_ANGLE` を決める** | 約 2267 |
| `updateFavRotaryTransforms()` | 円柱座標→transform（88deg超は非表示） | 約 2296 |
| `spinToIndex(i, select)` | 指定の駒を正面へ回す | 約 2329 |
| `centerActiveChip(smooth)` | 選択中の駒を正面へ | 約 2342 |
| `centeredChip()` | いま正面にある駒 | 約 2389 |
| `selectFav(lat, lon, name)` | 駒を選んで地点を切り替える（`releaseFollow` を呼ぶ） | 約 2378 |
| `toggleFavStar` / `updateFavStar` | ヘッダーの★ | 約 2360 / 2369 |

## 日付バッジ・祝日・ポップアップ

| 関数 | 役割 | 目安行 |
|---|---|---|
| `jpHoliday(date)` | **祝日の判定**（振替休日・国民の休日を含む） | 約 2477 |
| `jpHolidayBase(y, m, d)` | 固定日・ハッピーマンデー・春分秋分 | 約 2466 |
| `nthMondayDate(y, m, n)` | 第n月曜 | 約 2456 |
| `equinoxDate(y, spring)` | 春分・秋分の近似（1980〜2099） | 約 2461 |
| `isRestDay(date)` | 土日・祝日 | 約 2497 |
| `updateDateBadge()` | ヘッダー左の日付・時刻・祝日名 | 約 2502 |
| `updatePopup()` | 選択情報。`judgeBreakdown` で数値を色分け | 約 2536 |
| `positionPopupAt(x, y)` | 指追従の位置 | 約 2592 |
| `resetPopupPosition()` | `POPUP_HOME`(13%) へ戻す | 約 2606 |
| `rainWord(mm)` / `windWord(ms)` | 言い回し | 約 2518 / 2526 |

## ABC評価（変更禁止）

> ⚠ **`abcScore` / `abcScoreInv` / `judgePoint` は変更禁止。**
> 調整は `THRESH` の値だけ。→ `judge.md` / `docs/adr/0005-wind-unit-ms.md`

| 関数 | 役割 | 目安行 |
|---|---|---|
| `GRADE_COL` / `GRADE_COL_NONE` | 判定の色。スクラバー帯と地図の山域レイヤーで共通 | 約 2613 |
| `abcScore(val, a, b)` | 高いほど悪い項目のスコア（0/1/2） | 約 2615 |
| `abcScoreInv(val, a, b)` | 低いほど悪い項目のスコア（体感気温） | 約 2621 |
| `judgePoint(d)` | **ABC判定本体。** `{ grade, reasons }` を返す | 約 2628 |
| `judgeBreakdown(d)` | 項目別スコア（ポップアップの色分け用。読み取り専用） | 約 2672 |

## チャート — 組み立てと座標系

| 名前 | 役割 | 目安行 |
|---|---|---|
| `computeChartHeights(outerH)` | 4パネルへの高さ配分 | 約 2698 |
| `chartsTotalH()` | 4枚の合計高 | 約 2696 |
| `niceRange(vals, …)` | 軸レンジの丸め | 約 2710 |
| `PADDING_L` / `PADDING_R` / `SKY_TOP_PAD` ほか | 座標系の定数 | 約 2719-2727 |
| `chartTotalW()` | 全時間ぶんの論理幅 | 約 2735 |
| `idxToX(idx)` | index → x座標。**帯と共通** | 約 2738 |
| `canvasRatio(u)` | canvas の実倍率 | 約 2741 |
| `buildCharts()` | **uPlot 4枚を組み立てる（この関数が一番大きい）** | 約 2743 |

## チャート — 気圧パネル

| 関数 | 役割 | 目安行 |
|---|---|---|
| `pressWindowFor(idx)` | 選択時刻に追従する縦窓の範囲 | 約 2935 |
| `applyPressWindow(threshold)` | 窓の適用（coarse/fine の二段構え） | 約 2953 |
| `updatePressWindow()` | なぞり中／落ち着いてからの切り替え | 約 2965 |
| `pressSegStyle(dp)` | ΔP6h → 線の色と太さ（下降=暖色 / 上昇=寒色） | 約 2977 |
| `pressBombIndices(data)` | 急降下の区間ごとに最も急な1点 | 約 3005 |
| `drawPressBomb(ctx, x, y, r)` | 爆弾マーク | 約 2986 |
| `drawPressOverlay(u)` | **上段の線＋下段のバー＋警告帯** | 約 3020 |
| `pressGutterLayout(top, bottom)` | ガターのhPa目盛りを上段の範囲で割る | 約 3129 |

## チャート — 軸ガター

| 関数 | 役割 | 目安行 |
|---|---|---|
| `drawAxisGutter()` | 左の固定軸（気温／降水／風速／気圧） | 約 3140 |
| `drawAxisGutterRight()` | 右の固定軸（高度km／突風） | 約 3228 |

## チャート — 昼夜シェーディング・背景

| 関数 | 役割 | 目安行 |
|---|---|---|
| `dayBandsFracs()` | 昼の帯（日の出〜日の入り。無ければ5〜19時） | 約 3287 |
| `nightBandsFracs()` | 夜の帯 | 約 3335 |
| `moonIllum(date)` | 輝面比 | 約 3312 |
| `nightAlphaAt(date)` | 月齢による夜の濃さ（0.38〜0.20） | 約 3315 |
| `softEdgePx(pr)` / `softGradient(…)` | 帯の境界を約1.6時間ぶんぼかす | 約 3319 / 3322 |
| `paintNightOverlay(u, ctx, H, scale)` | **夜の帯だけを塗る**（全パネル共通） | 約 3349 |
| `drawDayBackground(u)` | 共通背景（地色＋グリッド＋日付区切り） | 約 3364 |
| `drawTimeLabels(u, pr)` | 下部の時刻ラベル | 約 3407 |

## チャート — 雲の無段階描画

| 関数 | 役割 | 目安行 |
|---|---|---|
| `cloudAlpha(cov)` | 雲量→濃さの連続カーブ。**凡例とセットで直す** | 約 3443 |
| `buildCloudRaster(data)` | `CLOUD_SUB`×`CLOUD_ROWS` のラスタを組む | 約 3452 |
| `cloudRasterFor(data)` | ラスタのキャッシュ | 約 3493 |
| `cloudPlotBox(u)` | 雲パネルの描画領域 | 約 3502 |

定数: `CLOUD_RGB` / `SKY_TOP` / `SKY_BOTTOM` / `CLOUD_ROWS` / `CLOUD_SUB` … 約 3435-3441

## チャート — 各パネルの描画hook

| 関数 | 役割 | 目安行 |
|---|---|---|
| `drawCloudPrecip(u)` | 雲のラスタ＋降水バー（drawClear hook） | 約 3509 |
| `drawCloudOverlay(u)` | 標高ライン＋時刻ラベル | 約 3595 |
| `drawTempOverlay(u)` | 日付ヘッダー・**天気アイコン**・最高最低注記 | 約 3625 |
| `drawPrecipBars(u)` | 降水・降雪バー | 約 3706 |
| `drawWindOverlay(u)` | 風速バー（`THRESH` で色分け）＋風向矢印 | 約 3737 |
| `drawWindArrow(ctx, x, y, dirFrom, len)` | 矢印1本（向きは風向+180°） | 約 3785 |
| `nowIndexFrac()` / `drawNowMarker(u)` | 現在時刻の印 | 約 3802 / 3810 |
| `updateNowButton()` / `jumpToNow()` | ヘッダーの「現在」ボタン | 約 3833 / 3839 |
| `getSkyColor(hour, cloud, wcode)` | 空の色 | 約 3858 |

## 天気記号と月齢

| 関数 | 役割 | 目安行 |
|---|---|---|
| `drawWeatherGlyph(ctx, code, night, cx, cy, r, date)` | **記号のベクター描画（入口）** | 約 3987 |
| `wxSun` / `wxCloud` / `wxDrops` / `wxBolt` | 各パーツ | 約 3895 / 3947 / 3960 / 3973 |
| `moonPhase(date)` | 平均朔望月からの位相の近似（誤差±0.5日） | 約 3916 |
| `wxMoon(ctx, cx, cy, r, phase)` | **実際の満ち欠けを1パスで描く** | 約 3925 |
| `weatherEmoji(code, night)` | 絵文字（ポップアップ用） | 約 4035 |
| `isNightIdx(i)` | その index が夜か | 約 4049 |

⚠ `destination-out` で抜かない → `docs/adr/0004-vector-glyph.md`

## 雨雪のパーティクル

| 関数 | 役割 | 目安行 |
|---|---|---|
| `updateParticles()` | 選択時刻の風速・風向に合わせて横に流す | 約 4060 |
| `makeParticle(W, H, isSnow, reset, drift)` | 1粒 | 約 4112 |
| `drawRaindrop` / `drawSnowflake` | 描画 | 約 4129 / 4137 |

## 時刻選択・スクロール・スクラバー帯

| 関数 | 役割 | 目安行 |
|---|---|---|
| `chartMaxOffset()` / `setChartOffset(x)` | **CSS transform でチャートを動かす** | 約 4159 / 4160 |
| `indexFromClientX(clientX)` | 画面x → index | 約 4167 |
| `indexScreenX(idx)` | index → 画面x | 約 4175 |
| `positionScrubLine(at)` | 上下の選択線を同じ値で置く | 約 4181 |
| `setSelectedIndex(idx, scroll, smooth)` | 選択の確定 | 約 4202 |
| `cursorX(scrollLeft)` | **選択線の画面内位置**（中央固定＋両端ランプ） | 約 4218 |
| `scrollToIndex(idx, smooth)` | 不動点反復で解く | 約 4240 |
| `setScrollBoth(left)` | チャートと帯を同時に動かす | 約 4260 |
| `animateScrollTo(target, ms)` | **自前のrAFアニメーション**（標準のsmoothは使わない） | 約 4271 |
| `cancelScrollAnim()` | 指が触れたら即中断 | 約 4265 |
| `scrubberIndexFromScroll()` | 帯のスクロール量 → index | 約 4303 |
| `mirrorScrollToScrubber()` | チャート→帯の同期 | 約 4311 |
| `layoutScrubber()` | 帯の寸法 | 約 4321 |
| `drawScrubber()` | 帯の canvas（昼夜・ABCバー・降水・日付区切り） | 約 4334 |
| `scrubFrame()` | **なぞり中の rAF ループ**（scrollイベントに依存しない） | 約 4422 |
| `selectFromPointer(clientX, clientY)` | チャートのタップ／ドラッグ選択 | 約 4454 |

## 地図 — レイヤー定義

> **URLやズーム範囲を変えるときは、コードではなくこの表だけを直す。**

| 名前 | 中身 | 目安行 |
|---|---|---|
| `MAP_ZOOM_MIN` / `MAP_ZOOM_MAX` | 4 / 18 | 約 4484 |
| `MAP_BASES` | ベース5種（地理院std/pale/photo・OSM・Esri） | 約 4488 |
| `MAP_OVERLAYS` | 地形系オーバーレイ | 約 4504 |
| `RRIM_SHADE` / `RRIM_SLOPE` / `RRIM_CONFLICTS` | 赤色立体図風の合成 | 約 4544 |
| `AMEDAS_ELEMENTS` / `AMEDAS_DIR16` | アメダスの要素と16方位 | 約 4551 / 4566 |
| `MAP_LS_*` | localStorage のキー | 約 4571 |
| `JMA_NOWCAST_BASE` / `JMA_TIMES_PRECIP` / `JMA_TIMES_THUNDER` | ナウキャスト | 約 4583 |
| `JMA_SAT_BASE` / `JMA_TIMES_SAT` | ひまわり | 約 4592 |
| `SAT_BANDS` / `SAT_TINTS` | 衛星のバンドと着色 | 約 4603 / 4619 |
| `MAP_WEATHER` | 気象レイヤーの表 | 約 4634 |
| `WX_REFRESH_MS` | 自動更新の間隔（5分） | 約 4632 |
| `findBase` / `findOverlay` / `usableOverlays` / `usableWeather` | 表の引き当て（`pending` を除く） | 約 4668-4674 |
| `satBandDef` / `satTintDef` / `satBands` | 同上（衛星） | 約 4625-4627 |
| `amedasElementDef` / `amedasDirName` / `amedasDirDeg` | 同上（アメダス） | 約 4559-4569 |

## 地図 — 本体とタイルレイヤー

| 関数 | 役割 | 目安行 |
|---|---|---|
| `loadMapPrefs()` / `saveMapPrefs()` | 設定の永続化（不正値は既定へ落とす） | 約 4677 / 4713 |
| `tileOpts(def, extra)` | TileLayer の共通オプション | 約 4734 |
| `applyBaseLayer()` | ベースマップの適用 | 約 4744 |
| `buildRrimLayers(opacity)` | 赤色立体図風（pane単位の multiply） | 約 4754 |
| `applyOverlays()` | オーバーレイの適用 | 約 4767 |
| `jmaTimesList(url)` | 気象庁の時刻表を**全部**返す | 約 4802 |
| `latestObsTime(list)` | **一番新しい実況を選ぶ** | 約 4817 |
| `jmaTimes(url)` | 地図に貼る用（実況だけ） | 約 4825 |
| `clearWxTimes()` | 時刻表のキャッシュ破棄 | 約 4829 |
| `timedTileUrl(def, t)` | 時刻つきタイルのURL | 約 4832 |
| `dropStaleWxLayer` / `dropAllStaleWxLayers` | 古いレイヤーを必ず外す（`WX_DROP_MS`=8秒） | 約 4851 / 4856 |
| `wxPaneFor(def)` | pane の振り分け（衛星=`mapSat`／他=`mapNowcast`） | 約 4867 |
| `buildSatFilter(tint, cut)` | **輝度→透明度のSVGフィルタを毎回作り直す** | 約 4899 |
| `applyWxBlend(def)` | 旧方式（`blend`/`floor`）の適用と解除 | 約 4942 |
| `addTimedTileLayer(def, op, replace)` | **時刻つきタイルの貼り替え**（新しいのが出るまで消さない） | 約 4957 |
| `startWxRefresh` / `stopWxRefresh` / `refreshWeatherLayers` | 5分ごとの自動更新 | 約 4989-4998 |

## 雨の予告

| 関数 | 役割 | 目安行 |
|---|---|---|
| `rainOutlookHourly(data, fromIdx)` | **1段目。** 毎時データだけ。通信ゼロで必ず出せる | 約 5041 |
| `rainOutlookNowcast(lat, lon)` | **2段目。** ナウキャストのタイルを**1画素だけ**読む | 約 5123 |
| `nowcastSeries(list)` | 「実況→予報」の並びに直す | 約 5090 |
| `tilePixelAt(lat, lon, z)` | 緯度経度 → タイル番号＋タイル内画素 | 約 5072 |
| `loadTileImage(url)` / `probeTileAlpha(img, px, py)` | 1画素の不透明度を読む | 約 5111 / 5101 |
| `parseJmaTime(s)` | 気象庁の時刻文字列 | 約 5083 |
| `timeBandWord(d)` / `dayWord(d, from)` | 「明日夕方」の言い回し | 約 5028 / 5030 |
| `updateRainOutlook()` | 入口。**地図を閉じている間は取りに行かない** | 約 5161 |
| `setRainText(text, fromNowcast)` | `#map-rain` の書き換え | 約 5154 |

## タイル取得の失敗報告

| 関数 | 役割 | 目安行 |
|---|---|---|
| `watchTileStatus(layer, def, hooks)` | **全タイルレイヤーに必ず付ける。** 割合で「ほとんどダメ」も言う | 約 5193 |
| `setLayerStatus(id, text)` | パネルへの表示 | 約 5228 |

## 点で描く気象レイヤー・雷マーク

| 関数 | 役割 | 目安行 |
|---|---|---|
| `clearWeatherMarkers()` | 点レイヤーの掃除 | 約 5249 |
| `drawAreas(bounds, opacity)` | **山域の面＋ラベル＋百名山の△**（`areas.json` から描く） | 約 5315 |
| `updateMapWhen()` | 山域の色が「いつの判定か」を上部に出す（`#map-when`） | 約 5297 |
| `areaShape(area)` | 山域の中心（峰の重心）と半径 | 約 5285 |
| `haversineKm(...)` | 2点間の距離(km)。山域の広がりを測る | 約 5275 |
| `loadAmedas()` | アメダス実測の取得 | 約 5255 |
| `drawAmedas(bounds, opacity)` | 表示範囲ぶんの点を描く（最大140地点） | 約 5283 |
| `loadWindGrid(bounds)` | 画面を5×5に割った代表点の風を1リクエストで | 約 5331 |
| `drawWindArrows(bounds, opacity)` | 矢印（向きは風向+180°） | 約 5375 |
| `refreshWeatherPoints()` | 地図が動くたびに描き直す | 約 5402 |
| `updateThunderIcons()` / `paintThunderIcons()` | **タイル画像を走査して雷マークを置く** | 約 5453 / 5458 |
| `releaseThunderScan()` / `clearThunderIcons()` | 走査canvasの解放（メモリ） | 約 5435 / 5446 |

## 地図 — 開閉・レイヤーパネル

| 関数 | 役割 | 目安行 |
|---|---|---|
| `openMap()` / `closeMap()` / `isMapOpen()` | 開閉。閉じたら追跡とタイマーも止める | 約 5608 / 5673 / 5683 |
| `updateMapAttribution()` | **出典表記（消さない）** | 約 5521 |
| `setMapBase(id)` | ベースの切り替え | 約 5534 |
| `isOverlayOn` / `overlayOpacity` / `toggleOverlay` / `setOverlayOpacity` | オーバーレイの操作 | 約 5542-5570 |
| `moveFavRotaryTo(slot)` / `restoreFavRotary()` | **円柱の引っ越し（DOMは1つだけ）** | 約 5592 / 5600 |
| `toggleLayerPanel` / `closeLayerPanel` / `renderLayerPanel` | レイヤーパネル | 約 5689-5730 |
| `amedasElementChips()` / `satBandChips()` | パネル内のチップ | 約 5712 / 5719 |
| `setAmedasElement` / `setSatTint` / `setSatBand` | 選択の確定（localStorageへ） | 約 6877-6893 |

## 標高タイル

| 関数 | 役割 | 目安行 |
|---|---|---|
| `lonLatToTilePixel(lat, lon, z)` | タイル座標＋画素 | 約 5776 |
| `decodeDemPixel(r, g, b)` | RGB→標高。**`2^23` は無効値（null）** | 約 5790 |
| `fetchPointElevation(lat, lon)` | 地理院 `dem_png`（z14）から読む | 約 5800 |
| `displayElevation()` | **DEM優先、無ければモデル標高** | 約 5833 |
| `updateElevationLabel()` | 表示（失敗時は隠すだけ） | 約 5837 |

## タイルキャッシュ（SW連携）

| 関数 | 役割 | 目安行 |
|---|---|---|
| `swMessage(payload)` | Service Worker とのやり取り | 約 5848 |
| `refreshTileCacheUsage()` | 使用量の取得（レイヤーパネル最下段） | 約 5862 |
| `clearTileCache()` | 削除 | 約 5880 |
| `formatBytes(n)` | 表示整形 | 約 5858 |

SW 側の実装は `sw.js` → `pwa.md`

## 地図 — 地点の確定・移動・検索

| 関数 | 役割 | 目安行 |
|---|---|---|
| `pickMapPoint(lat, lon, name)` | **名前つきの地点確定**（検索結果・百名山の△）。`mapFlyTo` で飛ぶ | 約 6002 |
| `pickPinPoint(lat, lng)` | **長押しのピン**。逆ジオコーディングで名前を引く。⚠ 上と混ぜない | 約 6481 |
| `setPickedName(name)` | 地点名の表示 | 約 5901 |
| `mapFlyTo(lat, lon, zoom)` | `flyTo` 0.8s（`setView` の瞬間移動は使わない） | 約 5908 |
| `updatePinVisibility()` | 追跡中は選択地点のピンを出さない | 約 5941 |
| `updateMapToolButtons()` | 右上3ボタンの状態 | 約 5948 |
| `doMapSearch()` | 地名検索 | 約 6452 |
| `showMapHint()` / `flashPinHint()` | 案内文（`MAP_HINT_MS`=4.5秒） | 約 6359 / 6341 |

## 現在地の追跡と地図の向き

| 関数 | 役割 | 目安行 |
|---|---|---|
| `cycleLocate()` | **3段階（off → once → follow）を回す** | 約 5986 |
| `setLocateMode(mode)` | モードの適用 | 約 5992 |
| `startTracking(follow)` / `stopTracking()` | `watchPosition` の開始・停止 | 約 6007 / 6038 |
| `onGeoUpdate(pos)` | GPS更新 | 約 6053 |
| `releaseFollow()` | **意思を持って地点を選んだら追従をやめる**（follow→once） | 約 6026 |
| `drawMe()` | 現在地マーカー（矢尻。半径 `ME_DOT_R`=14px） | 約 6063 |
| `enableHeading()` | iOS の `requestPermission()` を操作の中で呼ぶ | 約 6089 |
| `setHeading(deg)` | iOS=`webkitCompassHeading` / 他=360−alpha | 約 6108 |
| `applyMapRotation(deg)` | **`#map` をCSSで回す**（Leafletに回転機能は無い） | 約 6115 |
| `toggleOrientation()` / `setHeadingUp(on)` | ノースアップ↔ヘディングアップ | 約 6127 / 6135 |
| `patchRotatedInput(map)` | **回転中のタップ座標を逆回転で補正**（外すと誤爆する） | 約 6437 |
| `paintCompass()` | 方位バッジ（Nだけ逆回転で立てる） | 約 5969 |
| `updateMeSpotlight()` / `paintMeSpotlight()` / `paintSpotlightPane(host, tiles)` | **現在地のまわりだけ雨雲を抜く** | 約 6169-6182 |
| `zoomAnchor(map, fallbackLatLng)` | 拡大の基準点（判定は `mapFollow`） | 約 6232 |

## 地図 — 拡大縮小・長押しピン

| 関数 | 役割 | 目安行 |
|---|---|---|
| `bindDoubleTapZoom(map)` | **ダブルタップ＋上下ドラッグの拡大縮小**（自前実装） | 約 6237 |
| `bindPinLongPress(map)` | **長押しでピンを立てる**（`PIN_HOLD_MS`=500ms） | 約 6385 |
| `showPinHold` / `hidePinHold` / `cancelPinHold` | 締まる輪 `#pin-hold` | 約 6317-6333 |

定数: `DTAP_MS` / `DTAP_SLOP_PX` / `DTAP_PX_PER_ZOOM`（約 6224）、
`PIN_HOLD_MS` / `PIN_HOLD_SLOP_PX`（約 6311）

## お気に入り

| 関数 | 役割 | 目安行 |
|---|---|---|
| `loadFavs()` / `saveFavs(favs)` | localStorage | 約 6494 / 6498 |
| `openFav()` / `closeFav()` / `renderFavList()` | 一覧オーバーレイ | 約 6502-6510 |
| `saveCurrentAsFav()` | 現在地点を登録 | 約 6548 |

## 全国山域ランキング

**ABC判定は `judgePoint` をそのまま使う。**

| 関数 | 役割 | 目安行 |
|---|---|---|
| `loadAreas()` | `areas.json` の読み込み | 約 6574 |
| `resolveRankDates(kind)` / `setRankDate(kind)` | 対象日の解決 | 約 6588 / 6831 |
| `fetchRankData(dates)` | 全地点ぶんの気象データ | 約 6613 |
| `rankHourWindow(dateStr)` | 行動時間帯（`RANK_WINDOW_START`=6時〜18時） | 約 6643 |
| `judgePeakDay(hourData, dateStr)` | **時間帯の最悪値を採る** | 約 6652 |
| `buildRanking(dates)` | 山域ごとに集計 | 約 6672 |
| `bestPeakOf(row)` | 山域の代表峰（いちばん良い判定を出した峰） | 約 6713 |
| `renderRankList(rows, dates)` | 一覧の描画 | 約 6723 |
| `gotoPeak(name, lat, lon)` | **一覧からメテオグラムへ飛ぶ** | 約 6803 |
| `refreshRanking()` | 再取得 | 約 6811 |
| `openRank()` / `closeRank()` / `setRankTab(tab)` | オーバーレイとタブ | 約 6841-6868 |

## 新雪ランキング（表示）

**推定は `snowRanking.js` が担う。ここは表示だけ。** → `docs/snow_ranking.md`

| 関数 | 役割 | 目安行 |
|---|---|---|
| `loadSnowSpots()` | `data/spots.json`（無ければ案内文だけ） | 約 6909 |
| `refreshSnowRanking()` | `snowRanking.js` を呼ぶ | 約 6918 |
| `renderSnowList()` | 一覧の描画（`.spot-link` で飛べる） | 約 6947 |
| `setSnowFilter(kind)` | 絞り込み | 約 6901 |
| `degToDir(deg)` | 度→方位名 | 約 7004 |

## 雑多（保存・読込・リサイズ・SW・BOOT）

| 関数 | 役割 | 目安行 |
|---|---|---|
| `saveLast(lat, lon, name)` / `loadLast()` | 最終地点の localStorage | 約 7014 / 7017 |
| `showLoading(msg)` / `hideLoading()` | **地図を開いている間は出さない** | 約 7025 / 7031 |
| resize ハンドラ | 150ms デバウンスでチャートを組み直す | 約 7038 |
| Service Worker 登録 | 失敗してもアプリの動作に影響させない | 約 7058 |
| BOOT | 起動 | 約 7069 |

## AI全国概況

| 関数 | 役割 | 目安行 |
|---|---|---|
| `loadOutlook()` | `outlook.json` を読むだけ（未生成なら非表示） | 約 7078 |
| `toggleOutlook()` | カードの開閉 | 約 7075 |
| `escapeHtml(s)` | 生成文の埋め込み | 約 7099 |

生成側は `scripts/gen-outlook.mjs` → `docs/ai_outlook.md`

---

## 別ファイル

### `snowRanking.js`（455行）

UMD で `self.snowRanking` に生やす。**ABC評価とは完全に独立**
（`judgePoint` / `THRESH` / `abcScore` を参照しない。テストで固定してある）。
仕様は `docs/snow_ranking.md`。

| 関数 | 役割 | 目安行 |
|---|---|---|
| `fetchSnowRanking(spots, opts)` | **入口。** 通信は初回4回・以降3回で地点数に依存しない | 約 378 |
| `rankSpots(…)` | 順位付け | 約 279 |
| `slrFromTemp(t)` / `slrLabel(slr)` | 気温から雪水比（SLR） | 約 70 / 79 |
| `effectiveSnowCm(precipMm, tempC)` | 降水量→新雪深 | 約 87 |
| `computeK(stationSnow24hCm, modelSnow24hCm)` | 近傍アメダスの実測で作る補正係数 | 約 98 |
| `snowStations(amedasMap, amedasTable)` | 積雪観測アメダスの抽出 | 約 113 |
| `pickStation(spot, stations)` / `confidenceOf(pick)` | 近傍局の選定と信頼度 | 約 139 / 152 |
| `buildOpenMeteoUrl(points, opts)` | **`wind_speed_unit=ms` を必ず付ける** | 約 245 |
| `normalizeSeries(json)` | 複数地点応答の正規化 | 約 263 |
| `accumulate` / `sumSnowfall` / `windStats` | 期間の集計 | 約 192 / 219 / 227 |
| `loadAmedasTable(fetchImpl, storage)` | アメダス地点表（キャッシュあり） | 約 357 |
| `haversineKm` / `dmsToDeg` / `parseLatestTime` | 補助 | 約 58 / 44 / 52 |

座標の生成は `scripts/buildSpots.mjs`（ビルド時に `data/spots.json` を作る）。

### `sw.js`

Service Worker。キャッシュ方針・タイルキャッシュのLRU → `pwa.md`

## 関連

- 仕様 → このディレクトリの各ファイル（`overview.md` から）
- 設計判断の理由 → `docs/adr/`
- 軽い判断・地雷 → `docs/decisions.md`
- 過去の経緯 → `docs/archive/handoff_v4.md`（原本。更新しない）
