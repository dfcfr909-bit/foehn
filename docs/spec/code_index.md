# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,424行／本体の `<script>` は 2725〜14421 行
- トップレベルの宣言 817（関数 591・定数と状態 226）／ブロック 38
- `code_map.md` に説明があるもの：472／817（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2726：STATE（16）
- 行 2928：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3123：DATA FETCH（28）
- 行 3559：GPS（2）
- 行 3596：RENDER MASTER（40）
- 行 4049：HUD（28）
- 行 4400：ABC JUDGMENT（6）
- 行 4479：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5951：SKY COLOR HELPER（1）
- 行 5975：WEATHER EMOJI（12）
- 行 6150：PARTICLES (雨・雪エフェクト)（5）
- 行 6240：時刻選択（17）
- 行 6585：MAP — レイヤー定義（37）
- 行 6875：MAP — 本体（43）
- 行 7399：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7660：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7768：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8297：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8415：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8568：風の流れ（Particle Engine）（13）
- 行 8749：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9260：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9465：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（135）
- 行 11654：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11932：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（52）
- 行 12782：検索の履歴（選んだ地点）（8）
- 行 12904：手元の山の検索（#171・第1段階）（32）
- 行 13278：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（14）
- 行 13470：FAVORITES（7）
- 行 13660：RANKING（全国山域ランキング）（21）
- 行 13997：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14151：LOCALSTORAGE – 最終地点（2）
- 行 14162：LOADING OVERLAY（2）
- 行 14216：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14358：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（3）

## STATE

行 2726〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2729 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2747 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2762 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2766 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2782 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2797 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2827 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2829 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2830 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2833 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2843 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2844 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2859 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2900 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2906 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2919 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2928〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2949 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2950 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2951 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2952 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2956 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2959 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 2972 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 2980 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 2986 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 2996 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3016 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3038 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3048 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3072 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3088 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3096 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3106 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3123〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3138 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3144 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3146 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3153 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3165 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3186 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3190 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3198 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3204 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3229 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3296 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3301 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3337 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3344 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3370 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3392 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3396 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3410 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3429 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3446 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3455 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3486 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3500 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3501 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3502 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3503 | 1：`processData` |
| `summitGustRange` | 関数 | 3508 | 1：`processData` |
| `processData` 📝 | 関数 | 3513 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3559〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3562 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3587 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3596〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3603 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3625 | 1：`render` |
| `FAV_STEP` | 定数 | 3632 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3634 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3635 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3648 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3649 | 1：`favCircular` |
| `favCount` | 関数 | 3650 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3651 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3653 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3659 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3669 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3678 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3684 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3691 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3693 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3708 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3712 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3713 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3719 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3731 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3736 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3747 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3752 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3759 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3769 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3781 | 0 |
| `saveHome` | 関数 | 3782 | 0 |
| `goHome` | 関数 | 3783 | 0 |
| `currentFavChip` | 関数 | 3787 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3793 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3798 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3844 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3879 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3914 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3927 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3945 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3957 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 3966 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 3978 | 1：（トップレベル） |

## HUD

行 4049〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4052 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4058 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4064 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4067 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4072 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4077 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4088 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4108 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4113 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4129 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4137 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4155 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4156 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4157 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4167 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4172 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4188 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4189 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4190 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4198 | 1：`peakAt` |
| `peakAt` | 関数 | 4199 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4213 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4241 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4285 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4301 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4380 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4393 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4394 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4400〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4405 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4406 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4408 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4414 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4421 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4465 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4479〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4485 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4486 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4487 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4488 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4489 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4491 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4500 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4501 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4505 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4510 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4519 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4520 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4526 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4527 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4535 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4536 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4537 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4538 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4539 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4540 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4541 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4549 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4552 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4555 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4557 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4730 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4731 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4732 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4744 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4745 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4746 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4747 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4748 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4751 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4769 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4781 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4793 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4802 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4821 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4836 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4945 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4956 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5081 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5140 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5158 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5162 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5163 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5165 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5168 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5172 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5175 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5188 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5202 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5217 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5260 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5274 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5288 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5291 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5292 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5293 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5294 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5296 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5305 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5346 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5355 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5362 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5527 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5572 | 1：`feelColor` |
| `feelColor` | 関数 | 5582 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5601 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5642 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5650 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5657 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5668 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5685 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5707 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5713 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5722 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5750 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5833 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5881 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5898 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5906 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5929 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5935 | 1：（HTML） |

## SKY COLOR HELPER

行 5951〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5954 | 0 |

## WEATHER EMOJI

行 5975〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 5984 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 5991 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6010 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6011 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6012 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6021 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6043 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6056 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6069 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6083 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6131 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6145 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6150〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6153 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6156 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6208 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6225 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6233 | 1：`updateParticles` |

## 時刻選択

行 6240〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6255 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6256 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6263 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6271 | 0 |
| `positionScrubLine` 📝 | 関数 | 6277 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6298 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6314 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6336 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6356 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6361 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6367 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6399 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6407 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6417 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6430 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6528 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6560 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6585〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6590 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6591 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6594 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6607 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6610 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6655 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6656 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6658 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6662 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6669 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6670 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6677 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6679 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6680 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6682 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6683 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6684 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6685 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6686 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6694 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6697 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6698 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6703 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6704 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6714 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6728 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6733 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6750 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6751 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6756 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6758 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6813 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6814 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6818 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6819 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6822 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6865 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6875〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6880 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6884 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6887 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6897 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6911 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6924 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6957 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6959 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 6974 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 6982 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 6986 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 6989 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7006 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7008 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7013 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7024 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7053 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7055 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7100 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7115 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7147 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7151 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7156 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7181 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7182 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7185 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7186 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7188 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7199 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7224 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7225 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7226 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7227 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7230 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7241 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7248 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7259 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7274 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7279 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7302 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7305 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7319 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7382 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7399〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7416 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7417 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7422 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7426 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7431 | 0 |
| `radarNowWet` | 関数 | 7470 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7478 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7491 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7500 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7532 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7542 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7549 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7578 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7579 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7580 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7581 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7615 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7616 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7627 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7628 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7629 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7630 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7644 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7660〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7675 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7676 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7677 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7678 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7681 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7685 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7686 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7687 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7689 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7695 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7723 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7768〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7783 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7791 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7795 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7797 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7798 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7800 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7801 | 1：`windBand` |
| `windBand` | 関数 | 7802 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7804 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7806 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7807 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7808 | 1：（トップレベル） |
| `windDirName` | 関数 | 7810 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7816 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7826 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7831 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7906 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7923 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7928 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 7967 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 7975 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 7994 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8014 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8031 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8083 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8097 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8098 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8099 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8101 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8102 | 1：`ensureWindField` |
| `windError` | 関数 | 8103 | 1：`ensureWindField` |
| `windClear` | 関数 | 8104 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8108 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8161 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8189 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8293 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8297〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8312 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8325 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8329 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8333 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8342 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8356 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8371 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8373 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8389 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8405 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8415〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8429 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8443 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8452 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8459 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8460 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8461 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8463 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8478 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8493 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8508 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8523 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8525 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8541 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8556 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8568〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8581 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8600 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8602 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8613 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8626 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8628 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8643 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8655 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8668 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8674 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8676 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8688 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8692 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8749〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8771 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8790 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8808 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8812 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8823 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8848 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8861 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8867 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8888 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8898 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8901 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8902 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8903 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8908 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8909 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8910 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8911 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8917 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8922 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8926 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8931 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8936 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8942 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8949 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8956 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 8965 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 8988 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 8998 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9003 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9019 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9072 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9079 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9080 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9084 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9126 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9134 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9136 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9178 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9187 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9260〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9278 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9288 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9301 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9307 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9308 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9310 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9318 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9325 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9333 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9348 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9359 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9434 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9459 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9465〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9489 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9495 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9504 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9520 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9521 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9524 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9547 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9575 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9581 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9626 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9652 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9659 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9758 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9773 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9774 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 9973 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 9990 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10002 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10010 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10017 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10022 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10023 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10024 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10025 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10026 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10041 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10054 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10083 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10116 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10144 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10162 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10175 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10205 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10215 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10238 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10239 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10271 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10318 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10322 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10340 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10347 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10348 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10373 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10423 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10433 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10434 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10452 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10454 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10467 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10489 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10493 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10502 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10509 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10514 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10515 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10516 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10521 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10536 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10551 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10565 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10569 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10582 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10602 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10612 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10621 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10635 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10662 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10758 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10776 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10816 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10828 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10840 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10842 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10847 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10857 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10885 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10914 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10945 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10954 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 10964 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 10969 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 10977 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 10978 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 10984 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 10991 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 10998 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11000 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11025 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11040 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11041 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11042 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11043 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11047 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11056 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11068 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11084 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11154 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11191 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11199 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11216 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11221 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11227 | 1：（HTML） |
| `stepMapTime` | 関数 | 11228 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11229 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11241 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11242 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11243 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11250 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11254 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11259 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11262 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11265 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11271 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11272 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11277 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11340 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11341 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11342 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11368 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11376 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11377 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11384 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11404 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11429 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11437 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11445 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11526 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11540 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11546 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11562 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11569 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11576 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11590 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11598 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11615 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11654〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11657 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11658 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11661 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11675 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11683 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11689 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11716 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11725 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11729 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11756 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11760 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11781 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11787 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11826 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11830 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11837 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11862 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11872 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11876 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11894 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11903 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11917 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11924 | 4：`fetchGPS`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11932〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 11957 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 11964 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 11986 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12003 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12009 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12024 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12043 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12055 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12070 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12080 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12113 | 1：`toggleOrientation` |
| `setHeading` 📝 | 関数 | 12132 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12139 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12151 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12159 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12192 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12193 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12194 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12197 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12203 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12204 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12210 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12252 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12253 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12254 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12260 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12265 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12339 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12340 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12345 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12357 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12361 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12369 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12386 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12387 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12401 | 1：`bindPinLongPress` |
| `bindPinLongPress` 📝 | 関数 | 12419 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12471 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12492 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12496 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12500 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12519 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12522 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12535 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12536 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12562 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12579 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12582 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12588 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12649 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12650 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12667 | 2：（HTML）、（トップレベル） |

## 検索の履歴（選んだ地点）

行 12782〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12790 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12791 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12793 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12800 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12804 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12808 | 2：`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12817 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12826 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 12904〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 12912 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 12922 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 12930 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 12931 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 12941 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 12956 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 12971 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 12978 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 12982 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 12988 | 1：`mtnSearch` |
| `buildPeakIndex` 📝 | 関数 | 12998 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13022 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13029 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13039 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13044 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13051 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13054 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13062 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13068 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13077 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13091 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13095 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13106 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13111 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13121 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13138 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13166 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13176 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13192 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13193 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13269 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13270 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13278〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13283 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13288 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13293 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13297 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13308 | 1：`toUTM` |
| `utmZone` | 関数 | 13309 | 1：`toUTM` |
| `toUTM` | 関数 | 13321 | 1：`coordFormats` |
| `fmtUTM` | 関数 | 13342 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13345 | 1：`coordFormats` |
| `coordFormats` | 関数 | 13359 | 1：`openCoordSheet` |
| `copyText` | 関数 | 13395 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13408 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13416 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13458 | 1：（HTML） |

## FAVORITES

行 13470〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13473 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13477 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13487 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13491 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13496 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13500 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13649 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13660〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13666 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13667 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13668 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13671 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13672 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13675 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13684 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13689 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 13714 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 13757 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 13766 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 13789 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 13827 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 13828 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 13833 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 13843 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 13927 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 13936 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 13971 | 1：（HTML） |
| `openRank` 📝 | 関数 | 13981 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 13993 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 13997〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14008 | 1：（HTML） |
| `setWindMode` | 関数 | 14017 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14024 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14032 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14040 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14048 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14057 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14086 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14144 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14151〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14154 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14157 | 1：（トップレベル） |

## LOADING OVERLAY

行 14162〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14165 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14171 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14216〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14232 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14233 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14243 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14248 | 1：（HTML） |
| `closeWxMap` | 関数 | 14252 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14255 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14261 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14269 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14285 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14295 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14304 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14319 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14329 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14358〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14361 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14364 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14385 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |

