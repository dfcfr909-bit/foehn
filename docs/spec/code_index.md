# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：13,999行／本体の `<script>` は 2700〜13996 行
- トップレベルの宣言 785（関数 564・定数と状態 221）／ブロック 37
- `code_map.md` に説明があるもの：465／785（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2701：STATE（16）
- 行 2903：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3098：DATA FETCH（28）
- 行 3534：GPS（2）
- 行 3571：RENDER MASTER（40）
- 行 4024：HUD（28）
- 行 4375：ABC JUDGMENT（6）
- 行 4454：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5926：SKY COLOR HELPER（1）
- 行 5950：WEATHER EMOJI（12）
- 行 6125：PARTICLES (雨・雪エフェクト)（5）
- 行 6215：時刻選択（17）
- 行 6560：MAP — レイヤー定義（37）
- 行 6850：MAP — 本体（43）
- 行 7374：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7635：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7743：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8272：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8390：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8543：風の流れ（Particle Engine）（13）
- 行 8724：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9235：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9440：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（135）
- 行 11629：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11907：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（52）
- 行 12734：検索の履歴（選んだ地点）（8）
- 行 12853：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（14）
- 行 13045：FAVORITES（7）
- 行 13235：RANKING（全国山域ランキング）（21）
- 行 13572：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 13726：LOCALSTORAGE – 最終地点（2）
- 行 13737：LOADING OVERLAY（2）
- 行 13791：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 13933：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（3）

## STATE

行 2701〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2704 | 75：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか69 |
| `PAST_HOURS` 📝 | 定数 | 2722 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2737 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2741 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2757 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2772 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2802 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2804 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2805 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2808 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2818 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2819 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2834 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2875 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2881 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2894 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2903〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2924 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2925 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2926 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2927 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2931 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2934 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 2947 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 2955 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 2961 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 2971 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 2991 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3013 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3023 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3047 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3063 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3071 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3081 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3098〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3113 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3119 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3121 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3128 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3140 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3161 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3165 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3173 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3179 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3204 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3271 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3276 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3312 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3319 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3345 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3367 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3371 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3385 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3404 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3421 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3430 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3461 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3475 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3476 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3477 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3478 | 1：`processData` |
| `summitGustRange` | 関数 | 3483 | 1：`processData` |
| `processData` 📝 | 関数 | 3488 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3534〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3537 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3562 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3571〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3578 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3600 | 1：`render` |
| `FAV_STEP` | 定数 | 3607 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3609 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3610 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3623 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3624 | 1：`favCircular` |
| `favCount` | 関数 | 3625 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3626 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3628 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3634 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3644 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3653 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3659 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3666 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3668 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3683 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3687 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3688 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3694 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3706 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3711 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3722 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3727 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3734 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3744 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3756 | 0 |
| `saveHome` | 関数 | 3757 | 0 |
| `goHome` | 関数 | 3758 | 0 |
| `currentFavChip` | 関数 | 3762 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3768 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3773 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3819 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3854 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3889 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3902 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3920 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3932 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 3941 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 3953 | 1：（トップレベル） |

## HUD

行 4024〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4027 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4033 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4039 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4042 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4047 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4052 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4063 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4083 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4088 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4104 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4112 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4130 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4131 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4132 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4142 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4147 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4163 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4164 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4165 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4173 | 1：`peakAt` |
| `peakAt` | 関数 | 4174 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4188 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4216 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4260 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4276 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4355 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4368 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4369 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4375〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4380 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4381 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4383 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4389 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4396 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4440 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4454〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4460 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4461 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4462 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4463 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4464 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4466 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4475 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4476 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4480 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4485 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4494 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4495 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4501 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4502 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4510 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4511 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4512 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4513 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4514 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4515 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4516 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4524 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4527 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4530 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4532 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4705 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4706 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4707 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4719 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4720 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4721 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4722 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4723 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4726 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4744 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4756 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4768 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4777 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4796 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4811 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4920 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4931 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5056 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5115 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5133 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5137 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5138 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5140 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5143 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5147 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5150 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5163 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5177 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5192 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5235 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5249 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5263 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5266 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5267 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5268 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5269 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5271 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5280 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5321 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5330 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5337 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5502 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5547 | 1：`feelColor` |
| `feelColor` | 関数 | 5557 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5576 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5617 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5625 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5632 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5643 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5660 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5682 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5688 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5697 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5725 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5808 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5856 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5873 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5881 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5904 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5910 | 1：（HTML） |

## SKY COLOR HELPER

行 5926〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5929 | 0 |

## WEATHER EMOJI

行 5950〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 5959 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 5966 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 5985 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 5986 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 5987 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 5996 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6018 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6031 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6044 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6058 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6106 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6120 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6125〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6128 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6131 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6183 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6200 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6208 | 1：`updateParticles` |

## 時刻選択

行 6215〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6230 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6231 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6238 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6246 | 0 |
| `positionScrubLine` 📝 | 関数 | 6252 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6273 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6289 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6311 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6331 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6336 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6342 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6374 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6382 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6392 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6405 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6503 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6535 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6560〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6565 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6566 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6569 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6582 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6585 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6630 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6631 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6633 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6637 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6644 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6645 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6652 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6654 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6655 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6657 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6658 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6659 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6660 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6661 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6669 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6672 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6673 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6678 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6679 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6689 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6703 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6708 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6725 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6726 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6731 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6733 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6788 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6789 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6793 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6794 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6797 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6840 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6850〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6855 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6859 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6862 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6872 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6886 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6899 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6932 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6934 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 6949 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 6957 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 6961 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 6964 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 6981 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 6983 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 6988 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 6999 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7028 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7030 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7075 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7090 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7122 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7126 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7131 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7156 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7157 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7160 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7161 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7163 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7174 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7199 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7200 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7201 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7202 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7205 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7216 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7223 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7234 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7249 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7254 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7277 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7280 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7294 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7357 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7374〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7391 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7392 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7397 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7401 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7406 | 0 |
| `radarNowWet` | 関数 | 7445 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7453 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7466 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7475 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7507 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7517 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7524 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7553 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7554 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7555 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7556 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7590 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7591 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7602 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7603 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7604 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7605 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7619 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7635〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7650 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7651 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7652 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7653 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7656 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7660 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7661 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7662 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7664 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7670 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7698 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7743〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7758 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7766 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7770 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7772 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7773 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7775 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7776 | 1：`windBand` |
| `windBand` | 関数 | 7777 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7779 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7781 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7782 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7783 | 1：（トップレベル） |
| `windDirName` | 関数 | 7785 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7791 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7801 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7806 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7881 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7898 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7903 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 7942 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 7950 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 7969 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 7989 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8006 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8058 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8072 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8073 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8074 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8076 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8077 | 1：`ensureWindField` |
| `windError` | 関数 | 8078 | 1：`ensureWindField` |
| `windClear` | 関数 | 8079 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8083 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8136 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8164 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8268 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8272〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8287 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8300 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8304 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8308 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8317 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8331 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8346 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8348 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8364 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8380 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8390〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8404 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8418 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8427 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8434 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8435 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8436 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8438 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8453 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8468 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8483 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8498 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8500 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8516 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8531 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8543〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8556 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8575 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8577 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8588 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8601 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8603 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8618 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8630 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8643 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8649 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8651 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8663 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8667 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8724〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8746 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8765 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8783 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8787 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8798 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8823 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8836 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8842 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8863 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8873 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8876 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8877 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8878 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8883 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8884 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8885 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8886 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8892 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8897 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8901 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8906 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8911 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8917 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8924 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8931 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 8940 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 8963 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 8973 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 8978 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 8994 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9047 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9054 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9055 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9059 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9101 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9109 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9111 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9153 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9162 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9235〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9253 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9263 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9276 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9282 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9283 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9285 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9293 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9300 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9308 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9323 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9334 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9409 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9434 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9440〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9464 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9470 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9479 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9495 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9496 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9499 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9522 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9550 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9556 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9601 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9627 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9634 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9733 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9748 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9749 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 9948 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 9965 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 9977 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 9985 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 9992 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 9997 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 9998 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 9999 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10000 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10001 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10016 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10029 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10058 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10091 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10119 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10137 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10150 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10180 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10190 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10213 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10214 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10246 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10293 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10297 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10315 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10322 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10323 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10348 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10398 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10408 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10409 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10427 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10429 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10442 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10464 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10468 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10477 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10484 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10489 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10490 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10491 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10496 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10511 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10526 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10540 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10544 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10557 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10577 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10587 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10596 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10610 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10637 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10733 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10751 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10791 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10803 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10815 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10817 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10822 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10832 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10860 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10889 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10920 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10929 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 10939 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 10944 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 10952 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 10953 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 10959 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 10966 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 10973 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 10975 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11000 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11015 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11016 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11017 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11018 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11022 | 2：`areaShape`、`loadWxCache` |
| `areaShape` 📝 | 関数 | 11031 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11043 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11059 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11129 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11166 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11174 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11191 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11196 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11202 | 1：（HTML） |
| `stepMapTime` | 関数 | 11203 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11204 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11216 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11217 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11218 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11225 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11229 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11234 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11237 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11240 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11246 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11247 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11252 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11315 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11316 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11317 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11343 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11351 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11352 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11359 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11379 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11404 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11412 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11420 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11501 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11515 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11521 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11537 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11544 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11551 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11565 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11573 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11590 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11629〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11632 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11633 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11636 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11650 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11658 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11664 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11691 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11700 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11704 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11731 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11735 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11756 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11762 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11801 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11805 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11812 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11837 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11847 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11851 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11869 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11878 | 3：`drawAreas`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11892 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11899 | 4：`fetchGPS`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11907〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 11932 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 11939 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 11961 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 11978 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 11984 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 11999 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12018 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12030 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12045 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12055 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12088 | 1：`toggleOrientation` |
| `setHeading` 📝 | 関数 | 12107 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12114 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12126 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12134 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12167 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12168 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12169 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12172 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12178 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12179 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12185 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12227 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12228 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12229 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12235 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12240 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12314 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12315 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12320 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12332 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12336 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12344 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12361 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12362 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12376 | 1：`bindPinLongPress` |
| `bindPinLongPress` 📝 | 関数 | 12394 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12446 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12467 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12471 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12475 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12494 | 1：`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12497 | 4：`doMapSearch`、`findHyakumeizan`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12510 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12511 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12537 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12554 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12557 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12563 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12623 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12624 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12641 | 2：（HTML）、（トップレベル） |

## 検索の履歴（選んだ地点）

行 12734〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12742 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12743 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12745 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12752 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `sameHistPlace` | 関数 | 12756 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12760 | 2：`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12769 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12778 | 1：（トップレベル） |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 12853〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 12858 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 12863 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 12868 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 12872 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 12883 | 1：`toUTM` |
| `utmZone` | 関数 | 12884 | 1：`toUTM` |
| `toUTM` | 関数 | 12896 | 1：`coordFormats` |
| `fmtUTM` | 関数 | 12917 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 12920 | 1：`coordFormats` |
| `coordFormats` | 関数 | 12934 | 1：`openCoordSheet` |
| `copyText` | 関数 | 12970 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 12983 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 12991 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13033 | 1：（HTML） |

## FAVORITES

行 13045〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13048 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13052 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13062 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13066 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13071 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13075 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13224 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13235〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13241 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13242 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13243 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13246 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13247 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13250 | 5：`buildRanking`、`doMapSearch`、`drawAreas`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13259 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13264 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 13289 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 13332 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 13341 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 13364 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 13402 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 13403 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 13408 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 13418 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 13502 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 13511 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 13546 | 1：（HTML） |
| `openRank` 📝 | 関数 | 13556 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 13568 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 13572〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 13583 | 1：（HTML） |
| `setWindMode` | 関数 | 13592 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 13599 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 13607 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 13615 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 13623 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 13632 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 13661 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 13719 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 13726〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 13729 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 13732 | 1：（トップレベル） |

## LOADING OVERLAY

行 13737〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 13740 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 13746 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 13791〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 13807 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 13808 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 13818 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 13823 | 1：（HTML） |
| `closeWxMap` | 関数 | 13827 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 13830 | 1：（HTML） |
| `setWxMapArea` | 関数 | 13836 | 1：（HTML） |
| `loadWxMapList` | 関数 | 13844 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 13860 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 13870 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 13879 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 13894 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 13904 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 13933〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 13936 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 13939 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 13960 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |

