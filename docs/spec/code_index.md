# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,177行／本体の `<script>` は 2890〜16174 行
- トップレベルの宣言 971（関数 698・定数と状態 273）／ブロック 39
- `code_map.md` に説明があるもの：547／971（📝 印）
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
- 行 7184：MAP — 本体（91）
- 行 8242：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8512：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8620：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9149：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9267：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9420：風の流れ（Particle Engine）（13）
- 行 9601：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10124：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10329：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（186）
- 行 13051：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13412：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14321：検索の履歴（選んだ地点）（8）
- 行 14449：手元の山の検索（#171・第1段階）（33）
- 行 14859：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14997：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15211：FAVORITES（7）
- 行 15401：RANKING（全国山域ランキング）（21）
- 行 15738：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15892：LOCALSTORAGE – 最終地点（2）
- 行 15903：LOADING OVERLAY（2）
- 行 15957：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16099：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `csStats` 📝 | 状態 | 7576 | 3：`csCompute`、`csPushTime`、`csStatsText` |
| `csPushTime` | 関数 | 7577 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7578 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7581 | 1：`csRenderTile` |
| `csMissAny` | 関数 | 7590 | 1：`csRenderTile` |
| `csNetError` | 関数 | 7599 | 2：`csParent`、`csRenderTile` |
| `csGather` 📝 | 関数 | 7601 | 2：`csParent`、`csRenderTile` |
| `csCompute` 📝 | 関数 | 7613 | 2：`csParent`、`csRenderTile` |
| `csParent` 📝 | 関数 | 7633 | 1：`csRenderTile` |
| `csCropQuarter` 📝 | 関数 | 7647 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7656 | 1：`CsLayerClass` |
| `csStatsText` 📝 | 関数 | 7678 | 2：`renderLayerPanel`、`updateCsStatsNote` |
| `CiMapLayerClass` 📝 | 関数 | 7686 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 7708 | 1：`applyOverlays` |
| `updateCsStatsNote` 📝 | 関数 | 7731 | 1：`CsLayerClass` |
| `updateCiZoomNote` 📝 | 関数 | 7741 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7752 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7799 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7801 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7816 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7824 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7828 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7831 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7848 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7850 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7855 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7866 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7895 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7897 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7942 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7957 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7990 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7994 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7999 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8024 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8025 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8028 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8029 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8031 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8042 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8067 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8068 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8069 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8070 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8073 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8084 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8091 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8102 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8117 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8122 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8145 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8148 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8162 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8225 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8242〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8259 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8260 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8265 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8269 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8274 | 0 |
| `radarNowWet` | 関数 | 8313 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8321 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8334 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8343 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8375 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8385 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8392 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8421 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8422 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8423 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8424 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8467 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8468 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8479 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8480 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8481 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8482 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8496 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8512〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8527 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8528 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8529 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8530 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8533 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8537 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8538 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8539 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8541 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8547 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8575 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8620〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8635 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8643 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8647 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8649 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8650 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8652 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8653 | 1：`windBand` |
| `windBand` | 関数 | 8654 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8656 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8658 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8659 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8660 | 1：（トップレベル） |
| `windDirName` | 関数 | 8662 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8668 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8678 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8683 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8758 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8775 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8780 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8819 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8827 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8846 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8866 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8883 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8935 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8949 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8950 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8951 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8953 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8954 | 1：`ensureWindField` |
| `windError` | 関数 | 8955 | 1：`ensureWindField` |
| `windClear` | 関数 | 8956 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8960 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9013 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9041 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9145 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9149〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9164 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9177 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9181 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9185 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9194 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9208 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9223 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9225 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9241 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9257 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9267〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9281 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9295 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9304 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9311 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9312 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9313 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9315 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9330 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9345 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9360 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9375 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9377 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9393 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9408 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9420〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9433 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9452 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9454 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9465 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9478 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9480 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9495 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9507 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9520 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9526 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9528 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9540 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9544 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9601〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9623 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9642 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9660 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9664 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9675 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9700 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9713 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9719 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9740 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9755 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9758 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9759 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9760 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9765 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9766 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9767 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9768 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9774 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9779 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9783 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9788 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9793 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9799 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9806 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9813 | 1：`windGLBgTexture` |
| `windBgFade` | 関数 | 9822 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9828 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9852 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9862 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9867 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9883 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9936 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9943 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9944 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9948 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9990 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9998 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10000 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10042 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10051 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10124〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10142 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10152 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10165 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10171 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10172 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10174 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10182 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10189 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10197 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10212 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10223 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10298 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10323 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10329〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10353 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10359 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10368 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10384 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10385 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10388 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10411 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10439 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10445 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10490 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10516 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10523 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10622 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10637 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10638 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10837 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10854 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10866 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10874 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10881 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10886 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10887 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10888 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10889 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10890 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10905 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10918 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10947 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10980 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11008 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11026 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11039 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11069 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11079 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11102 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11103 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11135 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11182 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11186 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11204 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11211 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11212 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11237 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11287 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11297 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11298 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11316 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11318 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11331 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11353 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11357 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11366 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11373 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11378 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11379 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11380 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11385 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11400 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11415 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11429 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11433 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11446 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11466 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11476 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11485 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11499 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11526 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11622 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11640 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11680 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11692 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11704 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11706 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11711 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11721 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11749 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11778 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11809 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11818 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11828 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11833 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11841 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11842 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11848 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11855 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11862 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11864 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11889 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11904 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11905 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11906 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11907 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11911 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11920 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11932 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11948 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12024 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12025 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12026 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12027 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12028 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12029 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12031 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12036 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12051 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12057 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12063 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12072 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12080 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12131 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12169 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12177 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 12194 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12199 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12205 | 1：（HTML） |
| `stepMapTime` | 関数 | 12206 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12207 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12219 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12220 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12221 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12228 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12232 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12237 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12240 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12243 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12249 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12250 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12255 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12318 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12319 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12322 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12335 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12369 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12379 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12391 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12398 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12404 | 1：`blendChips` |
| `blendChips` | 関数 | 12413 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12420 | 21：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか15 |
| `overlayOpacity` 📝 | 関数 | 12421 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12428 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12448 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12474 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12482 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12490 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12575 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12594 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12612 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12613 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12620 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12637 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12645 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12652 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12666 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12674 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 12695 | 1：（HTML） |
| `sectionLayers` | 関数 | 12699 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 12700 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 12702 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 12711 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 12720 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 12728 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 12750 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 12762 | 2：`loadLayerSets`、`saveLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 12763 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 12764 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 12765 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 12768 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 12771 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 12776 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 12790 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 12813 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 12824 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 12830 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 12836 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 12846 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 12853 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 12868 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 12871 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 12883 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 12915 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 12926 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 12933 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 12940 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 12949 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12981 | 20：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか14 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13051〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13054 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13055 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13058 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13072 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13080 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13086 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13113 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13122 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13126 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13153 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13157 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13178 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13184 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13223 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13227 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13234 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13259 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13269 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13273 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13298 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13299 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13300 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13304 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13308 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13318 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13325 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13347 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13354 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13361 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13374 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13383 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13397 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13404 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13412〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13437 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13444 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13466 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13483 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13489 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13504 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13523 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13535 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13550 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13560 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13593 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13616 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13626 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13634 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13641 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 13653 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 13661 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 13694 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 13695 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 13696 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 13699 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 13705 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 13706 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13712 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13754 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13755 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13756 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13762 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13767 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13841 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13842 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13847 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13859 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13863 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13871 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13888 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13889 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13903 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13921 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13973 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13994 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13998 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14002 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14021 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14024 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14037 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14038 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14064 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14081 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14084 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14090 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14151 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14152 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14169 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14292 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14293 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14294 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14301 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14321〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14329 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14330 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14332 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14339 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14343 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14347 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14357 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14366 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14449〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14457 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14467 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14475 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14476 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14486 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14501 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14516 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14523 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14527 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14533 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14544 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14563 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14591 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14598 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14608 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14613 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14620 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14623 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14631 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14637 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14646 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 14661 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 14666 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 14677 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 14683 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 14693 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14710 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14746 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14756 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14772 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14773 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14849 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14850 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14859〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14864 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14869 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14874 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14878 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14889 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14890 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14902 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14923 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14926 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14940 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14961 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14997〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15007 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15010 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15013 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15014 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15015 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15016 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15017 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15020 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15046 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15047 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15048 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15049 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15054 | 1：`utmResult` |
| `utmResult` | 関数 | 15059 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15066 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15090 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15102 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15136 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15149 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15157 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15199 | 1：（HTML） |

## FAVORITES

行 15211〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15214 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15218 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15228 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15232 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15237 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15241 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15390 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15401〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15407 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15408 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15409 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15412 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15413 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15416 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 15425 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15430 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15455 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15498 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15507 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15530 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15568 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15569 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15574 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15584 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 15668 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 15677 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15712 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15722 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15734 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15738〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15749 | 1：（HTML） |
| `setWindMode` | 関数 | 15758 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15765 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15773 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15781 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15789 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15798 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15827 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15885 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15892〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15895 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15898 | 1：（トップレベル） |

## LOADING OVERLAY

行 15903〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15906 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15912 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15957〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15973 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15974 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15984 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15989 | 1：（HTML） |
| `closeWxMap` | 関数 | 15993 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15996 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16002 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16010 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16026 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16036 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16045 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16060 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16070 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16099〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16102 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16105 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16126 | 11：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか5 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16136 | 1：（トップレベル） |

