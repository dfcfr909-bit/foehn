# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,760行／本体の `<script>` は 2773〜14757 行
- トップレベルの宣言 844（関数 606・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：482／844（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2774：STATE（16）
- 行 2976：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3171：DATA FETCH（28）
- 行 3607：GPS（2）
- 行 3644：RENDER MASTER（40）
- 行 4097：HUD（28）
- 行 4448：ABC JUDGMENT（6）
- 行 4527：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5999：SKY COLOR HELPER（1）
- 行 6023：WEATHER EMOJI（12）
- 行 6198：PARTICLES (雨・雪エフェクト)（5）
- 行 6288：時刻選択（17）
- 行 6633：MAP — レイヤー定義（37）
- 行 6923：MAP — 本体（43）
- 行 7447：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7708：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7816：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8345：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8463：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8616：風の流れ（Particle Engine）（13）
- 行 8797：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9308：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9513：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（137）
- 行 11727：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12005：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（57）
- 行 12904：検索の履歴（選んだ地点）（8）
- 行 13032：手元の山の検索（#171・第1段階）（33）
- 行 13442：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13580：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13794：FAVORITES（7）
- 行 13984：RANKING（全国山域ランキング）（21）
- 行 14321：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14475：LOCALSTORAGE – 最終地点（2）
- 行 14486：LOADING OVERLAY（2）
- 行 14540：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14682：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2774〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2777 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2795 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2810 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2814 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2830 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2845 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2875 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2877 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2878 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2881 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2891 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2892 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2907 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2948 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2954 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2967 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2976〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2997 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2998 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2999 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3000 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3004 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3007 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3020 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3028 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3034 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3044 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3064 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3086 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3096 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3120 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3136 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3144 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3154 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3171〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3186 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3192 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3194 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3201 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3213 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3234 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3238 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3246 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3252 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3277 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3344 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3349 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3385 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3392 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3418 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3440 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3444 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3458 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3477 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3494 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3503 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3534 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3548 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3549 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3550 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3551 | 1：`processData` |
| `summitGustRange` | 関数 | 3556 | 1：`processData` |
| `processData` 📝 | 関数 | 3561 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3607〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3610 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3635 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3644〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3651 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3673 | 1：`render` |
| `FAV_STEP` | 定数 | 3680 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3682 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3683 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3696 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3697 | 1：`favCircular` |
| `favCount` | 関数 | 3698 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3699 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3701 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3707 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3717 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3726 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3732 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3739 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3741 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3756 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3760 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3761 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3767 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3779 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3784 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3795 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3800 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3807 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3817 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3829 | 0 |
| `saveHome` | 関数 | 3830 | 0 |
| `goHome` | 関数 | 3831 | 0 |
| `currentFavChip` | 関数 | 3835 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3841 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3846 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3892 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3927 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3962 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3975 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3993 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4005 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4014 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4026 | 1：（トップレベル） |

## HUD

行 4097〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4100 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4106 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4112 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4115 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4120 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4125 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4136 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4156 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4161 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4177 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4185 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4203 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4204 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4205 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4215 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4220 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4236 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4237 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4238 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4246 | 1：`peakAt` |
| `peakAt` | 関数 | 4247 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4261 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4289 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4333 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4349 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4428 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4441 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4442 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4448〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4453 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4454 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4456 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4462 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4469 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4513 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4527〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4533 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4534 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4535 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4536 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4537 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4539 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4548 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4549 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4553 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4558 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4567 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4568 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4574 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4575 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4583 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4584 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4585 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4586 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4587 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4588 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4589 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4597 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4600 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4603 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4605 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4778 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4779 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4780 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4792 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4793 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4794 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4795 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4796 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4799 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4817 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4829 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4841 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4850 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4869 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4884 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4993 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5004 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5129 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5188 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5206 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5210 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5211 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5213 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5216 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5220 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5223 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5236 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5250 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5265 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5308 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5322 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5336 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5339 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5340 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5341 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5342 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5344 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5353 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5394 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5403 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5410 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5575 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5620 | 1：`feelColor` |
| `feelColor` | 関数 | 5630 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5649 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5690 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5698 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5705 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5716 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5733 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5755 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5761 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5770 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5798 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5881 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5929 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5946 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5954 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5977 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5983 | 1：（HTML） |

## SKY COLOR HELPER

行 5999〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6002 | 0 |

## WEATHER EMOJI

行 6023〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6032 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6039 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6058 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6059 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6060 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6069 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6091 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6104 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6117 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6131 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6179 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6193 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6198〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6201 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6204 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6256 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6273 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6281 | 1：`updateParticles` |

## 時刻選択

行 6288〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6303 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6304 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6311 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6319 | 0 |
| `positionScrubLine` 📝 | 関数 | 6325 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6346 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6362 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6384 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6404 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6409 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6415 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6447 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6455 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6465 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6478 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6576 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6608 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6633〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6638 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6639 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6642 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6655 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6658 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6703 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6704 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6706 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6710 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6717 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6718 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6725 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6727 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6728 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6730 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6731 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6732 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6733 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6734 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6742 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6745 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6746 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6751 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6752 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6762 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6776 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6781 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6798 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6799 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6804 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6806 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6861 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6862 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6866 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6867 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6870 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6913 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6923〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6928 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6932 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6935 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6945 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6959 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6972 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7005 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7007 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7022 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7030 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7034 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7037 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7054 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7056 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7061 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7072 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7101 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7103 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7148 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7163 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7195 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7199 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7204 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7229 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7230 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7233 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7234 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7236 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7247 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7272 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7273 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7274 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7275 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7278 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7289 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7296 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7307 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7322 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7327 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7350 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7353 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7367 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7430 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7447〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7464 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7465 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7470 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7474 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7479 | 0 |
| `radarNowWet` | 関数 | 7518 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7526 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7539 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7548 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7580 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7590 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7597 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7626 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7627 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7628 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7629 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7663 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7664 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7675 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7676 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7677 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7678 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7692 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7723 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7724 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7725 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7726 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7729 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7733 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7734 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7735 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7737 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7743 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7771 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7816〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7831 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7839 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7843 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7845 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7846 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7848 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7849 | 1：`windBand` |
| `windBand` | 関数 | 7850 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7852 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7854 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7855 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7856 | 1：（トップレベル） |
| `windDirName` | 関数 | 7858 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7864 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7874 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7879 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7954 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7971 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7976 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8015 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8023 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8042 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8062 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8079 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8131 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8145 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8146 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8147 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8149 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8150 | 1：`ensureWindField` |
| `windError` | 関数 | 8151 | 1：`ensureWindField` |
| `windClear` | 関数 | 8152 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8156 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8209 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8237 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8341 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8345〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8360 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8373 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8377 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8381 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8390 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8404 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8419 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8421 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8437 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8453 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8463〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8477 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8491 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8500 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8507 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8508 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8509 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8511 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8526 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8541 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8556 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8571 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8573 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8589 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8604 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8616〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8629 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8648 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8650 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8661 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8674 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8676 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8691 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8703 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8716 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8722 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8724 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8736 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8740 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8797〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8819 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8838 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8856 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8860 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8871 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8896 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8909 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8915 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8936 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8946 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8949 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8950 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8951 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8956 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8957 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8958 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8959 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8965 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8970 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8974 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8979 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8984 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8990 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8997 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9004 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9013 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9036 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9046 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9051 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9067 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9120 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9127 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9128 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9132 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9174 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9182 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9184 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9226 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9235 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9308〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9326 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9336 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9349 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9355 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9356 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9358 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9366 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9373 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9381 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9396 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9407 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9482 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9507 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9513〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9537 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9543 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9552 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9568 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9569 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9572 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9595 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9623 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9629 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9674 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9700 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9707 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9806 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9821 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9822 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10021 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10038 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10050 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10058 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10065 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10070 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10071 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10072 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10073 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10074 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10089 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10102 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10131 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10164 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10192 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10210 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10223 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10253 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10263 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10286 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10287 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10319 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10366 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10370 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10388 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10395 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10396 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10421 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10471 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10481 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10482 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10500 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10502 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10515 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10537 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10541 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10550 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10557 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10562 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10563 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10564 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10569 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10584 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10599 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10613 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10617 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10630 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10650 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10660 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10669 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10683 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10710 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10806 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10824 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10864 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10876 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10888 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10890 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10895 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10905 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10933 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10962 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10993 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11002 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11012 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11017 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11025 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11026 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11032 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11039 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11046 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11048 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11073 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11088 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11089 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11090 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11091 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11095 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11104 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11116 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11132 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11202 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11239 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11247 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11264 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11269 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11275 | 1：（HTML） |
| `stepMapTime` | 関数 | 11276 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11277 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11289 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11290 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11291 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11298 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11302 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11307 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11310 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11313 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11319 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11320 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11325 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11388 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11389 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11390 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11416 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11424 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11425 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11432 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11452 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11477 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11485 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11493 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11575 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11594 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11612 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11613 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11619 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11635 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11642 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11649 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11663 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11671 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11688 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11727〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11730 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11731 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11734 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11748 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11756 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11762 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11789 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11798 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11802 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11829 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11833 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11854 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11860 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11899 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11903 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11910 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11935 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11945 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11949 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11967 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11976 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11990 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11997 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12005〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12030 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12037 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12059 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12076 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12082 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12097 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12116 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12128 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12143 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12153 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12186 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12209 | 1：`enableHeading` |
| `setHeading` 📝 | 関数 | 12217 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12224 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12236 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12244 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12277 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12278 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12279 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12282 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12288 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12289 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12295 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12337 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12338 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12339 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12345 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12350 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12424 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12425 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12430 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12442 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12446 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12454 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12471 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12472 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12486 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12504 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12556 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12577 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12581 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12585 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12604 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12607 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12620 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12621 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12647 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12664 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12667 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12673 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12734 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12735 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12752 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12875 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12876 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12877 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12884 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12904〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12912 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12913 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12915 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12922 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12926 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12930 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12940 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12949 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13032〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13040 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13050 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13058 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13059 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13069 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13084 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13099 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13106 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13110 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13116 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13127 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13146 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13174 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13181 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13191 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13196 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13203 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13206 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13214 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13220 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13229 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13244 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13249 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13260 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13266 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13276 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13293 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13329 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13339 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13355 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13356 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13432 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13433 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13442〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13447 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13452 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13457 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13461 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13472 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13473 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13485 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13506 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13509 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13523 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13544 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13580〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13590 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13593 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13596 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13597 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13598 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13599 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13600 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13603 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13629 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13630 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13631 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13632 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13637 | 1：`utmResult` |
| `utmResult` | 関数 | 13642 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13649 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13673 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13685 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13719 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13732 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13740 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13782 | 1：（HTML） |

## FAVORITES

行 13794〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13797 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13801 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13811 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13815 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13820 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13824 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13973 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13984〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13990 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13991 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13992 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13995 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13996 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13999 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14008 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14013 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14038 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14081 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14090 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14113 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14151 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14152 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14157 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14167 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14251 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14260 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14295 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14305 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14317 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14321〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14332 | 1：（HTML） |
| `setWindMode` | 関数 | 14341 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14348 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14356 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14364 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14372 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14381 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14410 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14468 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14475〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14478 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14481 | 1：（トップレベル） |

## LOADING OVERLAY

行 14486〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14489 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14495 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14540〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14556 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14557 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14567 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14572 | 1：（HTML） |
| `closeWxMap` | 関数 | 14576 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14579 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14585 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14593 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14609 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14619 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14628 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14643 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14653 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14682〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14685 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14688 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14709 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14719 | 1：（トップレベル） |

