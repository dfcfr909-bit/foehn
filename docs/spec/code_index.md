# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：13,982行／本体の `<script>` は 2698〜13979 行
- トップレベルの宣言 783（関数 564・定数と状態 219）／ブロック 37
- `code_map.md` に説明があるもの：465／783（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2699：STATE（16）
- 行 2901：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3096：DATA FETCH（28）
- 行 3532：GPS（2）
- 行 3569：RENDER MASTER（40）
- 行 4022：HUD（28）
- 行 4373：ABC JUDGMENT（6）
- 行 4452：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5924：SKY COLOR HELPER（1）
- 行 5948：WEATHER EMOJI（12）
- 行 6123：PARTICLES (雨・雪エフェクト)（5）
- 行 6213：時刻選択（17）
- 行 6558：MAP — レイヤー定義（37）
- 行 6848：MAP — 本体（43）
- 行 7372：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7633：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7741：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8270：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8388：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8541：風の流れ（Particle Engine）（13）
- 行 8722：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9233：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9438：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（133）
- 行 11612：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11890：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（52）
- 行 12717：検索の履歴（選んだ地点）（8）
- 行 12836：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（14）
- 行 13028：FAVORITES（7）
- 行 13218：RANKING（全国山域ランキング）（21）
- 行 13555：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 13709：LOCALSTORAGE – 最終地点（2）
- 行 13720：LOADING OVERLAY（2）
- 行 13774：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 13916：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（3）

## STATE

行 2699〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2702 | 75：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか69 |
| `PAST_HOURS` 📝 | 定数 | 2720 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2735 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2739 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2755 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2770 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2800 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2802 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2803 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2806 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2816 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2817 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2832 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2873 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2879 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2892 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2901〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2922 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2923 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2924 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2925 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2929 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2932 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 2945 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 2953 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 2959 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 2969 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 2989 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3011 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3021 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3045 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3061 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3069 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3079 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3096〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3111 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3117 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3119 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3126 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3138 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3159 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3163 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3171 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3177 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3202 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3269 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3274 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3310 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3317 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3343 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3365 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3369 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3383 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3402 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3419 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3428 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3459 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3473 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3474 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3475 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3476 | 1：`processData` |
| `summitGustRange` | 関数 | 3481 | 1：`processData` |
| `processData` 📝 | 関数 | 3486 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3532〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3535 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3560 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3569〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3576 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3598 | 1：`render` |
| `FAV_STEP` | 定数 | 3605 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3607 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3608 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3621 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3622 | 1：`favCircular` |
| `favCount` | 関数 | 3623 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3624 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3626 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3632 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3642 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3651 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3657 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3664 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3666 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3681 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3685 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3686 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3692 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3704 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3709 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3720 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3725 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3732 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3742 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3754 | 0 |
| `saveHome` | 関数 | 3755 | 0 |
| `goHome` | 関数 | 3756 | 0 |
| `currentFavChip` | 関数 | 3760 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3766 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3771 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3817 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3852 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3887 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3900 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3918 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3930 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 3939 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 3951 | 1：（トップレベル） |

## HUD

行 4022〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4025 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4031 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4037 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4040 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4045 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4050 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4061 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4081 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4086 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4102 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4110 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4128 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4129 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4130 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4140 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4145 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4161 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4162 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4163 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4171 | 1：`peakAt` |
| `peakAt` | 関数 | 4172 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4186 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4214 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4258 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4274 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4353 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4366 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4367 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4373〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4378 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4379 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4381 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4387 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4394 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4438 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4452〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4458 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4459 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4460 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4461 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4462 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4464 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4473 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4474 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4478 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4483 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4492 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4493 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4499 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4500 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4508 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4509 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4510 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4511 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4512 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4513 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4514 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4522 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4525 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4528 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4530 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4703 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4704 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4705 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4717 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4718 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4719 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4720 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4721 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4724 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4742 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4754 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4766 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4775 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4794 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4809 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4918 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4929 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5054 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5113 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5131 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5135 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5136 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5138 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5141 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5145 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5148 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5161 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5175 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5190 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5233 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5247 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5261 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5264 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5265 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5266 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5267 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5269 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5278 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5319 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5328 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5335 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5500 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5545 | 1：`feelColor` |
| `feelColor` | 関数 | 5555 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5574 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5615 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5623 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5630 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5641 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5658 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5680 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5686 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5695 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5723 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5806 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5854 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5871 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5879 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5902 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5908 | 1：（HTML） |

## SKY COLOR HELPER

行 5924〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5927 | 0 |

## WEATHER EMOJI

行 5948〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 5957 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 5964 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 5983 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 5984 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 5985 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 5994 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6016 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6029 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6042 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6056 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6104 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6118 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6123〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6126 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6129 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6181 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6198 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6206 | 1：`updateParticles` |

## 時刻選択

行 6213〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6228 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6229 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6236 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6244 | 0 |
| `positionScrubLine` 📝 | 関数 | 6250 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6271 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6287 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6309 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6329 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6334 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6340 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6372 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6380 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6390 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6403 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6501 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6533 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6558〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6563 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6564 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6567 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6580 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6583 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6628 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6629 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6631 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6635 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6642 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6643 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6650 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6652 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6653 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6655 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6656 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6657 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6658 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6659 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6667 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6670 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6671 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6676 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6677 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6687 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6701 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6706 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6723 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6724 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6729 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6731 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6786 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6787 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6791 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6792 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6795 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6838 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6848〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6853 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6857 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6860 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6870 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6884 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6897 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6930 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6932 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 6947 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 6955 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 6959 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 6962 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 6979 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 6981 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 6986 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 6997 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7026 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7028 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7073 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7088 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7120 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7124 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7129 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7154 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7155 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7158 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7159 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7161 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7172 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7197 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7198 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7199 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7200 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7203 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7214 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7221 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7232 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7247 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7252 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7275 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7278 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7292 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7355 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7372〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7389 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7390 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7395 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7399 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7404 | 0 |
| `radarNowWet` | 関数 | 7443 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7451 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7464 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7473 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7505 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7515 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7522 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7551 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7552 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7553 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7554 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7588 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7589 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7600 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7601 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7602 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7603 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7617 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7633〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7648 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7649 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7650 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7651 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7654 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7658 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7659 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7660 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7662 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7668 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7696 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7741〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7756 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7764 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7768 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7770 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7771 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7773 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7774 | 1：`windBand` |
| `windBand` | 関数 | 7775 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7777 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7779 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7780 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7781 | 1：（トップレベル） |
| `windDirName` | 関数 | 7783 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7789 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7799 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7804 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7879 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7896 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7901 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 7940 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 7948 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 7967 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 7987 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8004 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8056 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8070 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8071 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8072 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8074 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8075 | 1：`ensureWindField` |
| `windError` | 関数 | 8076 | 1：`ensureWindField` |
| `windClear` | 関数 | 8077 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8081 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8134 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8162 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8266 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8270〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8285 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8298 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8302 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8306 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8315 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8329 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8344 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8346 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8362 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8378 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8388〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8402 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8416 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8425 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8432 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8433 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8434 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8436 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8451 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8466 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8481 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8496 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8498 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8514 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8529 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8541〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8554 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8573 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8575 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8586 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8599 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8601 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8616 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8628 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8641 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8647 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8649 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8661 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8665 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8722〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8744 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8763 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8781 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8785 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8796 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8821 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8834 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8840 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8861 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8871 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8874 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8875 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8876 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8881 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8882 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8883 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8884 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8890 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8895 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8899 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8904 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8909 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8915 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8922 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8929 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 8938 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 8961 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 8971 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 8976 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 8992 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9045 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9052 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9053 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9057 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9099 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9107 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9109 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9151 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9160 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9233〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9251 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9261 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9274 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9280 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9281 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9283 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9291 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9298 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9306 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9321 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9332 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9407 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9432 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9438〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9462 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9468 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9477 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9493 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9494 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9497 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9520 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9548 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9554 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9599 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9625 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9632 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9731 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9746 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9747 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 9946 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 9963 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 9975 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 9983 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 9990 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 9995 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 9996 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 9997 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 9998 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 9999 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10014 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10027 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10056 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10089 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10117 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10135 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10148 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10178 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10188 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10211 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10212 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10244 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10291 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10295 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10313 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10320 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10321 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10346 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10396 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10406 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10407 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10425 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10427 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10440 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10462 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10466 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10475 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10482 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10487 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10488 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10489 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10494 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10509 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10524 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10538 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10542 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10555 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10575 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10585 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10594 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10608 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10635 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10731 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10749 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10789 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10801 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10813 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10815 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10820 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10830 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10858 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10887 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10918 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10927 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 10937 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 10942 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 10950 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 10951 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 10957 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 10964 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 10971 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 10973 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 10998 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11013 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11014 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11015 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11016 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11020 | 2：`areaShape`、`loadWxCache` |
| `areaShape` 📝 | 関数 | 11029 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11041 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11057 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11127 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11164 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11172 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11189 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11194 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11200 | 1：（HTML） |
| `stepMapTime` | 関数 | 11201 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11202 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11214 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11215 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11216 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11223 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11227 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11232 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11235 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11238 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11244 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11245 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11250 | 1：`updateThunderIcons` |
| `updateMapAttribution` 📝 | 関数 | 11313 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11326 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11334 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11335 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11342 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11362 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11387 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11395 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11403 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11484 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11498 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11504 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11520 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11527 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11534 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11548 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11556 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11573 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11612〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11615 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11616 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11619 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11633 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11641 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11647 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11674 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11683 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11687 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11714 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11718 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11739 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11745 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11784 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11788 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11795 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11820 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11830 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11834 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11852 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11861 | 3：`drawAreas`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11875 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11882 | 4：`fetchGPS`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11890〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 11915 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 11922 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 11944 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 11961 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 11967 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 11982 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12001 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12013 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12028 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12038 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12071 | 1：`toggleOrientation` |
| `setHeading` 📝 | 関数 | 12090 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12097 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12109 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12117 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12150 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12151 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12152 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12155 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12161 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12162 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12168 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12210 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12211 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12212 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12218 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12223 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12297 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12298 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12303 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12315 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12319 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12327 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12344 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12345 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12359 | 1：`bindPinLongPress` |
| `bindPinLongPress` 📝 | 関数 | 12377 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12429 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12450 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12454 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12458 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12477 | 1：`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12480 | 4：`doMapSearch`、`findHyakumeizan`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12493 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12494 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12520 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12537 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12540 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12546 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12606 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12607 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12624 | 2：（HTML）、（トップレベル） |

## 検索の履歴（選んだ地点）

行 12717〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12725 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12726 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12728 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12735 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `sameHistPlace` | 関数 | 12739 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12743 | 2：`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12752 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12761 | 1：（トップレベル） |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 12836〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 12841 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 12846 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 12851 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 12855 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 12866 | 1：`toUTM` |
| `utmZone` | 関数 | 12867 | 1：`toUTM` |
| `toUTM` | 関数 | 12879 | 1：`coordFormats` |
| `fmtUTM` | 関数 | 12900 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 12903 | 1：`coordFormats` |
| `coordFormats` | 関数 | 12917 | 1：`openCoordSheet` |
| `copyText` | 関数 | 12953 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 12966 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 12974 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13016 | 1：（HTML） |

## FAVORITES

行 13028〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13031 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13035 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13045 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13049 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13054 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13058 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13207 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13218〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13224 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13225 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13226 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13229 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13230 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13233 | 5：`buildRanking`、`doMapSearch`、`drawAreas`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13242 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13247 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 13272 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 13315 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 13324 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 13347 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 13385 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 13386 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 13391 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 13401 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 13485 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 13494 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 13529 | 1：（HTML） |
| `openRank` 📝 | 関数 | 13539 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 13551 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 13555〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 13566 | 1：（HTML） |
| `setWindMode` | 関数 | 13575 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 13582 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 13590 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 13598 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 13606 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 13615 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 13644 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 13702 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 13709〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 13712 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 13715 | 1：（トップレベル） |

## LOADING OVERLAY

行 13720〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 13723 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 13729 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 13774〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 13790 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 13791 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 13801 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 13806 | 1：（HTML） |
| `closeWxMap` | 関数 | 13810 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 13813 | 1：（HTML） |
| `setWxMapArea` | 関数 | 13819 | 1：（HTML） |
| `loadWxMapList` | 関数 | 13827 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 13843 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 13853 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 13862 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 13877 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 13887 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 13916〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 13919 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 13922 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 13943 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |

