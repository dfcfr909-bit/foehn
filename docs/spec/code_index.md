# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,164行／本体の `<script>` は 2890〜16161 行
- トップレベルの宣言 969（関数 696・定数と状態 273）／ブロック 39
- `code_map.md` に説明があるもの：545／969（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2891：STATE（16）
- 行 3093：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3288：DATA FETCH（28）
- 行 3724：GPS（2）
- 行 3761：RENDER MASTER（41）
- 行 4219：HUD（28）
- 行 4570：ABC JUDGMENT（6）
- 行 4649：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6121：SKY COLOR HELPER（1）
- 行 6145：WEATHER EMOJI（12）
- 行 6320：PARTICLES (雨・雪エフェクト)（5）
- 行 6410：時刻選択（17）
- 行 6755：MAP — レイヤー定義（54）
- 行 7184：MAP — 本体（89）
- 行 8229：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8499：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8607：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9136：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9254：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9407：風の流れ（Particle Engine）（13）
- 行 9588：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10111：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10316：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（186）
- 行 13038：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13399：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14308：検索の履歴（選んだ地点）（8）
- 行 14436：手元の山の検索（#171・第1段階）（33）
- 行 14846：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14984：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15198：FAVORITES（7）
- 行 15388：RANKING（全国山域ランキング）（21）
- 行 15725：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15879：LOCALSTORAGE – 最終地点（2）
- 行 15890：LOADING OVERLAY（2）
- 行 15944：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16086：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2891〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2894 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2912 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2927 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2931 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2947 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2962 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2992 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2994 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2995 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2998 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3008 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3009 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3024 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3065 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3071 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3084 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3093〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3114 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3115 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3116 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3117 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3121 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3124 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3137 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3145 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3151 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3161 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3181 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3203 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3213 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3237 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3253 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3261 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3271 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3288〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3303 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3309 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3311 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3318 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3330 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3351 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3355 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3363 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3369 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3394 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3461 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3466 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3502 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3509 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3535 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3557 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3561 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3575 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3594 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3611 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3620 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3651 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3665 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3666 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3667 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3668 | 1：`processData` |
| `summitGustRange` | 関数 | 3673 | 1：`processData` |
| `processData` 📝 | 関数 | 3678 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3724〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3727 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3752 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3761〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3768 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3790 | 1：`render` |
| `FAV_STEP` | 定数 | 3797 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3799 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3800 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3813 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3814 | 1：`favCircular` |
| `favCount` | 関数 | 3815 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3816 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3818 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3824 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3834 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3843 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3849 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3856 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3858 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3873 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3877 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3878 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3884 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3896 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3901 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3912 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3917 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3924 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3934 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3946 | 0 |
| `saveHome` | 関数 | 3947 | 0 |
| `goHome` | 関数 | 3948 | 0 |
| `currentFavChip` | 関数 | 3952 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3958 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3963 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4009 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4044 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4079 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4092 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4110 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4122 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4134 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4136 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4148 | 1：（トップレベル） |

## HUD

行 4219〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4222 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4228 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4234 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4237 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4242 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4247 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4258 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4278 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4283 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4299 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4307 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4325 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4326 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4327 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4337 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4342 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4358 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4359 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4360 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4368 | 1：`peakAt` |
| `peakAt` | 関数 | 4369 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4383 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4411 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4455 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4471 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4550 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4563 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4564 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4570〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4575 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4576 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4578 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4584 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4591 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4635 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4649〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4655 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4656 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4657 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4658 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4659 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4661 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4670 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4671 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4675 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4680 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4689 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4690 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4696 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4697 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4705 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4706 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4707 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4708 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4709 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4710 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4711 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4719 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4722 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4725 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4727 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4900 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4901 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4902 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4914 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4915 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4916 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4917 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4918 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4921 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4939 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4951 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4963 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4972 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4991 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5006 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5115 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5126 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5251 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5310 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5328 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5332 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5333 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5335 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5338 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5342 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5345 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5358 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5372 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5387 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5430 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5444 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5458 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5461 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5462 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5463 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5464 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5466 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5475 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5516 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5525 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5532 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5697 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5742 | 1：`feelColor` |
| `feelColor` | 関数 | 5752 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5771 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5812 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5820 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5827 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5838 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5855 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5877 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5883 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5892 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5920 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6003 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6051 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6068 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6076 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6099 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6105 | 1：（HTML） |

## SKY COLOR HELPER

行 6121〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6124 | 0 |

## WEATHER EMOJI

行 6145〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6154 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6161 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6180 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6181 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6182 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6191 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6213 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6226 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6239 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6253 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6301 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6315 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6320〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6323 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6326 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6378 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6395 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6403 | 1：`updateParticles` |

## 時刻選択

行 6410〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6425 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6426 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6433 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6441 | 0 |
| `positionScrubLine` 📝 | 関数 | 6447 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6468 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6484 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6506 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6526 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6531 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6537 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6569 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6577 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6587 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6600 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6698 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6730 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6755〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6760 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6761 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6764 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6777 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6781 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6784 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6867 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6868 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6870 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6874 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6881 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6882 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6889 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6891 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6892 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6894 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6895 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6896 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6897 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6898 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6899 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6900 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6902 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6903 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6904 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6905 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6906 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6909 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6912 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6913 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6914 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6920 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6928 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6931 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6932 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6937 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6938 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6948 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6962 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6967 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6984 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6985 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6990 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6992 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7047 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7048 | 18：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか12 |
| `usableOverlays` 📝 | 関数 | 7052 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7053 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7056 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7064 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7079 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7091 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7098 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7170 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7184〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7189 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7194 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7197 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7214 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7218 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7222 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7232 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7247 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7268 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7269 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7270 | 0 |
| `DEM_SRC` 📝 | 定数 | 7273 | 2：`csRenderTile`、`demFetchBlob` |
| `CI_BLOB_MAX` | 定数 | 7278 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7279 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7282 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7290 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7299 | 3：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile` |
| `ciAcos` 📝 | 関数 | 7323 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7328 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7333 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7335 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7347 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7389 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7391 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7411 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7447 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7451 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7471 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7482 | 3：`ciRenderTile`、`csGather`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7486 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7502 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7507 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7520 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7539 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7561 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7574 | 3：`CsLayerClass`、`csCompute`、`csCropQuarter` |
| `CS_MISS_KEY` | 定数 | 7575 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `csStats` 📝 | 状態 | 7578 | 2：`csCompute`、`csPushTime` |
| `csPushTime` | 関数 | 7579 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7580 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7583 | 1：`csRenderTile` |
| `csMissAny` | 関数 | 7592 | 1：`csRenderTile` |
| `csNetError` | 関数 | 7601 | 2：`csParent`、`csRenderTile` |
| `csGather` 📝 | 関数 | 7603 | 2：`csParent`、`csRenderTile` |
| `csCompute` 📝 | 関数 | 7615 | 2：`csParent`、`csRenderTile` |
| `csParent` 📝 | 関数 | 7635 | 1：`csRenderTile` |
| `csCropQuarter` 📝 | 関数 | 7649 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7658 | 1：`CsLayerClass` |
| `CiMapLayerClass` 📝 | 関数 | 7683 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 7705 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 7728 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7739 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7786 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7788 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7803 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7811 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7815 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7818 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7835 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7837 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7842 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7853 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7882 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7884 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7929 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7944 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7977 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7981 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7986 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8011 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8012 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8015 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8016 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8018 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8029 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8054 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8055 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8056 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8057 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8060 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8071 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8078 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8089 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8104 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8109 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8132 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8135 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8149 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8212 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8229〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8246 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8247 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8252 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8256 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8261 | 0 |
| `radarNowWet` | 関数 | 8300 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8308 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8321 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8330 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8362 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8372 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8379 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8408 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8409 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8410 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8411 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8454 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8455 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8466 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8467 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8468 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8469 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8483 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8499〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8514 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8515 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8516 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8517 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8520 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8524 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8525 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8526 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8528 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8534 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8562 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8607〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8622 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8630 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8634 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8636 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8637 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8639 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8640 | 1：`windBand` |
| `windBand` | 関数 | 8641 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8643 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8645 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8646 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8647 | 1：（トップレベル） |
| `windDirName` | 関数 | 8649 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8655 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8665 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8670 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8745 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8762 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8767 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8806 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8814 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8833 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8853 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8870 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8922 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8936 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8937 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8938 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8940 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8941 | 1：`ensureWindField` |
| `windError` | 関数 | 8942 | 1：`ensureWindField` |
| `windClear` | 関数 | 8943 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8947 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9000 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9028 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9132 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9136〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9151 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9164 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9168 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9172 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9181 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9195 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9210 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9212 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9228 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9244 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9254〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9268 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9282 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9291 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9298 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9299 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9300 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9302 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9317 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9332 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9347 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9362 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9364 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9380 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9395 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9407〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9420 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9439 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9441 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9452 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9465 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9467 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9482 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9494 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9507 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9513 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9515 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9527 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9531 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9588〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9610 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9629 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9647 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9651 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9662 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9687 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9700 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9706 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9727 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9742 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9745 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9746 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9747 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9752 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9753 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9754 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9755 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9761 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9766 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9770 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9775 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9780 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9786 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9793 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9800 | 1：`windGLBgTexture` |
| `windBgFade` | 関数 | 9809 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9815 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9839 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9849 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9854 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9870 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9923 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9930 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9931 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9935 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9977 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9985 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9987 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10029 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10038 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10111〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10129 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10139 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10152 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10158 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10159 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10161 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10169 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10176 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10184 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10199 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10210 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10285 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10310 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10316〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10340 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10346 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10355 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10371 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10372 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10375 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10398 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10426 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10432 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10477 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10503 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10510 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10609 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10624 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10625 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10824 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10841 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10853 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10861 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10868 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10873 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10874 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10875 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10876 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10877 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10892 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10905 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10934 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10967 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10995 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11013 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11026 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11056 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11066 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11089 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11090 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11122 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11169 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11173 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11191 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11198 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11199 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11224 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11274 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11284 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11285 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11303 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11305 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11318 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11340 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11344 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11353 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11360 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11365 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11366 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11367 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11372 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11387 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11402 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11416 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11420 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11433 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11453 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11463 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11472 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11486 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11513 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11609 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11627 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11667 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11679 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11691 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11693 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11698 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11708 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11736 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11765 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11796 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11805 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11815 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11820 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11828 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11829 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11835 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11842 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11849 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11851 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11876 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11891 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11892 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11893 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11894 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11898 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11907 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11919 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11935 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12011 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12012 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12013 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12014 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12015 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12016 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12018 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12023 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12038 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12044 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12050 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12059 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12067 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12118 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12156 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12164 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 12181 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12186 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12192 | 1：（HTML） |
| `stepMapTime` | 関数 | 12193 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12194 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12206 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12207 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12208 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12215 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12219 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12224 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12227 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12230 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12236 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12237 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12242 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12305 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12306 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12309 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12322 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12356 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12366 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12378 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12385 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12391 | 1：`blendChips` |
| `blendChips` | 関数 | 12400 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12407 | 21：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか15 |
| `overlayOpacity` 📝 | 関数 | 12408 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12415 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12435 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12461 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12469 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12477 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12562 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12581 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12599 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12600 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12607 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12624 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12632 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12639 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12653 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12661 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 12682 | 1：（HTML） |
| `sectionLayers` | 関数 | 12686 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 12687 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 12689 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 12698 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 12707 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 12715 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 12737 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 12749 | 2：`loadLayerSets`、`saveLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 12750 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 12751 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 12752 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 12755 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 12758 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 12763 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 12777 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 12800 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 12811 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 12817 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 12823 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 12833 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 12840 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 12855 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 12858 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 12870 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 12902 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 12913 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 12920 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 12927 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 12936 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12968 | 20：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか14 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13038〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13041 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13042 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13045 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13059 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13067 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13073 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13100 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13109 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13113 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13140 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13144 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13165 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13171 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13210 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13214 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13221 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13246 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13256 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13260 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13285 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13286 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13287 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13291 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13295 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13305 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13312 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13334 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13341 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13348 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13361 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13370 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13384 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13391 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13399〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13424 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13431 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13453 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13470 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13476 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13491 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13510 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13522 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13537 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13547 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13580 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13603 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13613 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13621 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13628 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 13640 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 13648 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 13681 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 13682 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 13683 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 13686 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 13692 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 13693 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13699 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13741 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13742 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13743 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13749 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13754 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13828 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13829 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13834 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13846 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13850 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13858 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13875 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13876 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13890 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13908 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13960 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13981 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13985 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 13989 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14008 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14011 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14024 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14025 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14051 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14068 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14071 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14077 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14138 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14139 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14156 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14279 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14280 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14281 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14288 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14308〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14316 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14317 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14319 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14326 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14330 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14334 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14344 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14353 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14436〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14444 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14454 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14462 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14463 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14473 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14488 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14503 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14510 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14514 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14520 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14531 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14550 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14578 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14585 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14595 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14600 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14607 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14610 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14618 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14624 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14633 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 14648 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 14653 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 14664 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 14670 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 14680 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14697 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14733 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14743 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14759 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14760 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14836 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14837 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14851 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14856 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14861 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14865 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14876 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14877 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14889 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14910 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14913 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14927 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14948 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14984〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 14994 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 14997 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15000 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15001 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15002 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15003 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15004 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15007 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15033 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15034 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15035 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15036 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15041 | 1：`utmResult` |
| `utmResult` | 関数 | 15046 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15053 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15077 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15089 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15123 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15136 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15144 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15186 | 1：（HTML） |

## FAVORITES

行 15198〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15201 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15205 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15215 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15219 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15224 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15228 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15377 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15388〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15394 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15395 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15396 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15399 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15400 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15403 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 15412 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15417 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15442 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15485 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15494 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15517 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15555 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15556 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15561 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15571 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 15655 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 15664 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15699 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15709 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15721 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15725〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15736 | 1：（HTML） |
| `setWindMode` | 関数 | 15745 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15752 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15760 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15768 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15776 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15785 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15814 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15872 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15879〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15882 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15885 | 1：（トップレベル） |

## LOADING OVERLAY

行 15890〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15893 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15899 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15944〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15960 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15961 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15971 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15976 | 1：（HTML） |
| `closeWxMap` | 関数 | 15980 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15983 | 1：（HTML） |
| `setWxMapArea` | 関数 | 15989 | 1：（HTML） |
| `loadWxMapList` | 関数 | 15997 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16013 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16023 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16032 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16047 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16057 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16086〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16089 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16092 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16113 | 11：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか5 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16123 | 1：（トップレベル） |

