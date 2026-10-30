# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,149行／本体の `<script>` は 2927〜17146 行
- トップレベルの宣言 1063（関数 758・定数と状態 305）／ブロック 39
- `code_map.md` に説明があるもの：600／1063（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2928：STATE（16）
- 行 3130：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3361：DATA FETCH（31）
- 行 3862：GPS（2）
- 行 3899：RENDER MASTER（41）
- 行 4357：HUD（28）
- 行 4708：ABC JUDGMENT（6）
- 行 4787：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6259：SKY COLOR HELPER（1）
- 行 6283：WEATHER EMOJI（12）
- 行 6458：PARTICLES (雨・雪エフェクト)（5）
- 行 6548：時刻選択（17）
- 行 6893：MAP — レイヤー定義（55）
- 行 7344：MAP — 本体（140）
- 行 8795：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9065：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9173：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9760：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9878：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10031：風の流れ（Particle Engine）（13）
- 行 10212：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10735：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10940：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13692：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（50）
- 行 14261：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 15170：検索の履歴（選んだ地点）（8）
- 行 15298：手元の山の検索（#171・第1段階）（33）
- 行 15708：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15846：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16060：FAVORITES（18）
- 行 16371：RANKING（全国山域ランキング）（21）
- 行 16708：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16862：LOCALSTORAGE – 最終地点（2）
- 行 16873：LOADING OVERLAY（2）
- 行 16927：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17069：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2928〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2931 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2949 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2964 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2968 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2984 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2999 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3029 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3031 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3032 | 3：`fetchRankData`、`summitWindAt`、`wxForecastUrl` |
| `MSM_BLEND_HOURS` | 定数 | 3035 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3045 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3046 | 3：`makeHintEngine`、`processData`、`windRecHydrate` |
| `summitWindAt` 📝 | 関数 | 3061 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3102 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3108 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3121 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3130〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3154 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3155 | 3：`trimWxCache`、`wxDb`、`wxStore` |
| `WX_WIND_STORE` | 定数 | 3156 | 4：`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxDb` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3157 | 6：`fetchWeather`、`renderFavPrefetch`、`setWxSource`、`trimWxCache`、`windRecord`、`windUseSaved` |
| `WX_STALE_MS` 📝 | 定数 | 3158 | 3：`fetchWeather`、`setWxSource`、`windSavedNote` |
| `WX_MAX_BYTES` 📝 | 定数 | 3162 | 1：`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3163 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3167 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3170 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3185 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3193 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3199 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3209 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3230 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3233 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3255 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3265 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3290 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3315 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3323 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3336 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3361〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3376 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3382 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3384 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3391 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3403 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3424 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3428 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3436 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3442 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3476 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3481 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3483 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3593 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3598 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3634 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3641 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3650 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3673 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3695 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3699 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3713 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3732 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3749 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3758 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3789 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3803 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3804 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3805 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3806 | 1：`processData` |
| `summitGustRange` | 関数 | 3811 | 1：`processData` |
| `processData` 📝 | 関数 | 3816 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3862〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3865 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3890 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3899〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3906 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3928 | 1：`render` |
| `FAV_STEP` | 定数 | 3935 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3937 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3938 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3951 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3952 | 1：`favCircular` |
| `favCount` | 関数 | 3953 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3954 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3956 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3962 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3972 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3981 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3987 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3994 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3996 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4011 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4015 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4016 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4022 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4034 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4039 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4050 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4055 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4062 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4072 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4084 | 0 |
| `saveHome` | 関数 | 4085 | 0 |
| `goHome` | 関数 | 4086 | 0 |
| `currentFavChip` | 関数 | 4090 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4096 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4101 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4147 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4182 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4217 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4230 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4248 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4260 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4272 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4274 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4286 | 1：（トップレベル） |

## HUD

行 4357〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4360 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4366 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4372 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4375 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4380 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4385 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4396 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4416 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4421 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4437 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4445 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4463 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4464 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4465 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4475 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4480 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4496 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4497 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4498 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4506 | 1：`peakAt` |
| `peakAt` | 関数 | 4507 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4521 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4549 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4593 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4609 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4688 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4701 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4702 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4713 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4714 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4716 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4722 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4729 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4773 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4787〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4793 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4794 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4795 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4796 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4797 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4799 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4808 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4809 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4813 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4818 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4827 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4828 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4834 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4835 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4843 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4844 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4845 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4846 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4847 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4848 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4849 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4857 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4860 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4863 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4865 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5038 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5039 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5040 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5052 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5053 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5054 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5055 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5056 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5059 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5077 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5089 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5101 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5110 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5129 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5144 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5253 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5264 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5389 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5448 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5466 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5470 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5471 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5473 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5476 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5480 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5483 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5496 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5510 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5525 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5568 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5582 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5596 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5599 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5600 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5601 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5602 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5604 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5613 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5654 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5663 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5670 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5835 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5880 | 1：`feelColor` |
| `feelColor` | 関数 | 5890 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5909 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5950 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5958 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5965 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5976 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5993 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6015 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6021 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6030 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6058 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6141 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6189 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6206 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6214 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6237 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6243 | 1：（HTML） |

## SKY COLOR HELPER

行 6259〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6262 | 0 |

## WEATHER EMOJI

行 6283〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6292 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6299 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6318 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6319 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6320 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6329 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6351 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6364 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6377 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6391 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6439 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6453 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6458〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6461 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6464 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6516 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6533 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6541 | 1：`updateParticles` |

## 時刻選択

行 6548〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6563 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6564 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6571 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6579 | 0 |
| `positionScrubLine` 📝 | 関数 | 6585 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6606 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6622 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6644 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6664 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6669 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6675 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6707 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6715 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6725 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6738 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6836 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6868 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6893〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6898 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6899 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6902 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6915 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6919 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6922 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7013 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7014 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7016 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7020 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7027 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7028 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7035 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7037 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7038 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7040 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7041 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7042 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7043 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7044 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7045 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7046 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7047 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7049 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7050 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7051 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7052 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7053 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7056 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7059 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7060 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7061 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7067 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7075 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7078 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7079 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7084 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7085 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7095 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7109 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7114 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7131 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7132 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7137 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7139 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7199 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7200 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7204 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7205 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7208 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7216 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7231 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7243 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7250 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7330 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7344〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7349 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7354 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7357 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7374 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7378 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7382 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7392 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7407 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7428 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7429 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7430 | 0 |
| `DEM_SRC` 📝 | 定数 | 7433 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7439 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7440 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7443 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7451 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7460 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7484 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7489 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7494 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7496 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7508 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7550 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7553 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7577 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7581 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7604 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7641 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7645 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7665 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7676 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7680 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7696 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7701 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7714 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7734 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7756 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7770 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7774 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7775 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7776 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7779 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7780 | 1：`csCompute` |
| `csPushTime` | 関数 | 7781 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7782 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7785 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7794 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7803 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7805 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7817 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7838 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7852 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7866 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7875 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7881 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7895 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7926 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7927 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7929 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7930 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7931 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7932 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7934 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7935 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7936 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7943 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7949 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7955 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7965 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7979 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7992 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7993 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7994 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7995 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8004 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8018 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8040 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8050 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8054 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8059 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8077 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8078 | 1：`wdPlan` |
| `wd` | 状態 | 8080 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8082 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8092 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8108 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8113 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8115 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8120 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8126 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8148 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8158 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8166 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8176 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8201 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8203 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8207 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8209 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8218 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8240 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8263 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8288 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8299 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8352 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8354 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8369 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8377 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8381 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8384 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8401 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8403 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8408 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8419 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8448 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8450 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8495 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8510 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8543 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8547 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8552 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8577 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8578 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8581 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8582 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8584 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8595 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8620 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8621 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8622 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8623 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8626 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8637 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8644 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8655 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8670 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8675 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8698 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8701 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8715 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8778 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8795〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8812 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8813 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8818 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8822 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8827 | 0 |
| `radarNowWet` | 関数 | 8866 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8874 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8887 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8896 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8928 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8938 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8945 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8974 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8975 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8976 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8977 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9020 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9021 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9032 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9033 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9034 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9035 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9049 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9065〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9080 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9081 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9082 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9083 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9086 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9090 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9091 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9092 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9094 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9100 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9128 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9173〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9188 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9196 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9200 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9202 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9203 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9205 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9206 | 1：`windBand` |
| `windBand` | 関数 | 9207 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9209 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9211 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9212 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9213 | 1：（トップレベル） |
| `windDirName` | 関数 | 9215 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9221 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9231 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9236 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9311 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9330 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9331 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9338 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9345 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9380 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9385 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9393 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9412 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9432 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9449 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9501 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9515 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9516 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9517 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9519 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9520 | 1：`ensureWindField` |
| `windError` | 関数 | 9521 | 1：`ensureWindField` |
| `windClear` | 関数 | 9522 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9526 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9596 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9613 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9624 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9652 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9756 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9760〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9775 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9788 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9792 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9796 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9805 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9819 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9834 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9836 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9852 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9868 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9878〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9892 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9906 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9915 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9922 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9923 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9924 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9926 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9941 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9956 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9971 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9986 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9988 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10004 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10019 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10031〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10044 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10063 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10065 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10076 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10089 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10091 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10106 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10118 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10131 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10137 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10139 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10151 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10155 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10212〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10234 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10253 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10271 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10275 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10286 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10311 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10324 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10330 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10351 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10366 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10369 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10370 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10371 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10376 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10377 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10378 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10379 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10385 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10390 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10394 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10399 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10404 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10410 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10417 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10424 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10433 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10439 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10463 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10473 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10478 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10494 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10547 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10554 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10555 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10559 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10601 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10609 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10611 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10653 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10662 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10735〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10753 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10763 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10776 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10782 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10783 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10785 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10793 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10800 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10808 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10823 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10834 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10909 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10934 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10940〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10964 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10970 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10979 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10995 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10996 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10999 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11022 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11050 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11056 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11101 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11127 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11134 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11233 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11248 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11249 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11448 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11465 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11477 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11485 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11492 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11497 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11498 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11499 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11500 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11501 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11516 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11529 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11558 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11591 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11619 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11637 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11650 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11680 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11690 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11713 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11714 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11746 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11793 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11797 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11815 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11822 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11823 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11848 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11898 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11908 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11909 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11927 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11929 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11942 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11964 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11968 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11977 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11984 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11989 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11990 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11991 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11996 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12011 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12026 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12040 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12044 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12057 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12077 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12087 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12096 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12110 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12137 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12233 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12251 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12291 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12303 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12315 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12317 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12322 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12332 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12360 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12389 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12420 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12429 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12439 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12444 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12452 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12453 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12459 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12466 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12473 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12475 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12500 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12515 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12516 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12517 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12518 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12522 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12531 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12543 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12559 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12635 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12636 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12637 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12638 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12639 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12640 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12642 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12647 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12662 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12668 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12674 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12683 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12691 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12742 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12782 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12790 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12808 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12813 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12819 | 1：（HTML） |
| `stepMapTime` | 関数 | 12820 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12821 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12833 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12834 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12835 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12842 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12846 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12851 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12854 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12857 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12863 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12864 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12869 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12932 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12933 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12936 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12949 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12983 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12993 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13005 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13012 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13018 | 1：`blendChips` |
| `blendChips` | 関数 | 13027 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13034 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13035 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13042 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13063 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13068 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13096 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13104 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13112 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13197 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13216 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13234 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13235 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13242 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13260 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13268 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13275 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13289 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13297 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13318 | 1：（HTML） |
| `sectionLayers` | 関数 | 13322 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13323 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13325 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13334 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13343 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13351 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13373 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13385 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13386 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13387 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13388 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13389 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13392 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13395 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13400 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13414 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13437 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13448 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13471 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13477 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13487 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13494 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13509 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13512 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13524 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13556 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13567 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13574 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13581 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13590 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13622 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13692〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13695 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13696 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13699 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13713 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13721 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13727 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13754 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13763 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13767 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13794 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13798 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13819 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13825 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13864 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13868 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13875 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13901 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 13911 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 13915 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13940 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13941 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13942 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13946 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13950 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13960 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13967 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13989 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13996 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14003 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 14016 | 1：（HTML） |
| `AREA_LS` | 定数 | 14031 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14032 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14033 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14034 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14036 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14043 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14048 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14058 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14073 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14083 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14088 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14093 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14098 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14099 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14100 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14178 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14191 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14232 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14246 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14253 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14261〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14286 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14293 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14315 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14332 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14338 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14353 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14372 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14384 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14399 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14409 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14442 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14465 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14475 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14483 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14490 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14502 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14510 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14543 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14544 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14545 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14548 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14554 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14555 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14561 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14603 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14604 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14605 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14611 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14616 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14690 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14691 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14696 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14708 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14712 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14720 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14737 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14738 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14752 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14770 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14822 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14843 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14847 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14851 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14870 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14873 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14886 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14887 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14913 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14930 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14933 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14939 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15000 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15001 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15018 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15141 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15142 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15143 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15150 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15170〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15178 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15179 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15181 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15188 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15192 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15196 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15206 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15215 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15298〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15306 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15316 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15324 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15325 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15335 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15350 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15365 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15372 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15376 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15382 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15393 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15412 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15440 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15447 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15457 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15462 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15469 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15472 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15480 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15486 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15495 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15510 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15515 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15526 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15532 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15542 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15559 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15595 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15605 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15621 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15622 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15698 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15699 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15713 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15718 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15723 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15727 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15738 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15739 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15751 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15772 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15775 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15789 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15810 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15856 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15859 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15862 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15863 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15864 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15865 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15866 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15869 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15895 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15896 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15897 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15898 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15903 | 1：`utmResult` |
| `utmResult` | 関数 | 15908 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15915 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15939 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15951 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15985 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15998 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16006 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16048 | 1：（HTML） |

## FAVORITES

行 16060〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16063 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16067 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16080 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16081 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16082 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16083 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16084 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16086 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16091 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16100 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16103 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16104 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16165 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16197 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16201 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16207 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16211 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16360 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16371〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16377 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16378 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16379 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16382 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16383 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16386 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16395 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16400 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16425 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16468 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16477 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16500 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16538 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16539 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16544 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16554 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16638 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16647 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16682 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16692 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16704 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16719 | 1：（HTML） |
| `setWindMode` | 関数 | 16728 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16735 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16743 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16751 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16759 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16768 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16797 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16855 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16862〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16865 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16868 | 1：（トップレベル） |

## LOADING OVERLAY

行 16873〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16876 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16882 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16927〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16943 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16944 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16954 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16959 | 1：（HTML） |
| `closeWxMap` | 関数 | 16963 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16966 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16972 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16980 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16996 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17006 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17015 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17030 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17040 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17069〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17072 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17075 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17096 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17106 | 1：（トップレベル） |

