# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,166行／本体の `<script>` は 2927〜17163 行
- トップレベルの宣言 1063（関数 758・定数と状態 305）／ブロック 39
- `code_map.md` に説明があるもの：600／1063（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2928：STATE（16）
- 行 3130：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3372：DATA FETCH（31）
- 行 3873：GPS（2）
- 行 3910：RENDER MASTER（41）
- 行 4368：HUD（28）
- 行 4719：ABC JUDGMENT（6）
- 行 4798：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6270：SKY COLOR HELPER（1）
- 行 6294：WEATHER EMOJI（12）
- 行 6469：PARTICLES (雨・雪エフェクト)（5）
- 行 6559：時刻選択（17）
- 行 6904：MAP — レイヤー定義（55）
- 行 7355：MAP — 本体（140）
- 行 8806：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9076：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9184：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9777：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9895：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10048：風の流れ（Particle Engine）（13）
- 行 10229：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10752：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10957：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13709：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（50）
- 行 14278：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 15187：検索の履歴（選んだ地点）（8）
- 行 15315：手元の山の検索（#171・第1段階）（33）
- 行 15725：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15863：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16077：FAVORITES（18）
- 行 16388：RANKING（全国山域ランキング）（21）
- 行 16725：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16879：LOCALSTORAGE – 最終地点（2）
- 行 16890：LOADING OVERLAY（2）
- 行 16944：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17086：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `wxReq` 📝 | 関数 | 3186 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3194 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3200 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3210 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3231 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3234 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3256 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3266 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3291 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3326 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3334 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3347 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3372〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3387 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3393 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3395 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3402 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3414 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3435 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3439 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3447 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3453 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3487 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3492 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3494 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3604 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3609 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3645 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3652 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3661 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3684 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3706 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3710 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3724 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3743 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3760 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3769 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3800 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3814 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3815 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3816 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3817 | 1：`processData` |
| `summitGustRange` | 関数 | 3822 | 1：`processData` |
| `processData` 📝 | 関数 | 3827 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3873〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3876 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3901 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3910〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3917 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3939 | 1：`render` |
| `FAV_STEP` | 定数 | 3946 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3948 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3949 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3962 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3963 | 1：`favCircular` |
| `favCount` | 関数 | 3964 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3965 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3967 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3973 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3983 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3992 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3998 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4005 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4007 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4022 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4026 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4027 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4033 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4045 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4050 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4061 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4066 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4073 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4083 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4095 | 0 |
| `saveHome` | 関数 | 4096 | 0 |
| `goHome` | 関数 | 4097 | 0 |
| `currentFavChip` | 関数 | 4101 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4107 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4112 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4158 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4193 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4228 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4241 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4259 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4271 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4283 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4285 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4297 | 1：（トップレベル） |

## HUD

行 4368〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4371 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4377 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4383 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4386 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4391 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4396 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4407 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4427 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4432 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4448 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4456 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4474 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4475 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4476 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4486 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4491 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4507 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4508 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4509 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4517 | 1：`peakAt` |
| `peakAt` | 関数 | 4518 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4532 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4560 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4604 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4620 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4699 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4712 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4713 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4719〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4724 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4725 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4727 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4733 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4740 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4784 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4798〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4804 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4805 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4806 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4807 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4808 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4810 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4819 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4820 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4824 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4829 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4838 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4839 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4845 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4846 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4854 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4855 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4856 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4857 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4858 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4859 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4860 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4868 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4871 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4874 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4876 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5049 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5050 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5051 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5063 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5064 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5065 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5066 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5067 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5070 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5088 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5100 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5112 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5121 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5140 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5155 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5264 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5275 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5400 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5459 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5477 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5481 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5482 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5484 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5487 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5491 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5494 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5507 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5521 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5536 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5579 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5593 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5607 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5610 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5611 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5612 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5613 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5615 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5624 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5665 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5674 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5681 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5846 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5891 | 1：`feelColor` |
| `feelColor` | 関数 | 5901 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5920 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5961 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5969 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5976 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5987 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6004 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6026 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6032 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6041 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6069 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6152 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6200 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6217 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6225 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6248 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6254 | 1：（HTML） |

## SKY COLOR HELPER

行 6270〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6273 | 0 |

## WEATHER EMOJI

行 6294〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6303 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6310 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6329 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6330 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6331 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6340 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6362 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6375 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6388 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6402 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6450 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6464 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6469〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6472 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6475 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6527 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6544 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6552 | 1：`updateParticles` |

## 時刻選択

行 6559〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6574 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6575 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6582 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6590 | 0 |
| `positionScrubLine` 📝 | 関数 | 6596 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6617 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6633 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6655 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6675 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6680 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6686 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6718 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6726 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6736 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6749 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6847 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6879 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6904〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6909 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6910 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6913 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6926 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6930 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6933 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7024 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7025 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7027 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7031 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7038 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7039 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7046 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7048 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7049 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7051 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7052 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7053 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7054 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7055 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7056 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7057 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7058 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7060 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7061 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7062 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7063 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7064 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7067 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7070 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7071 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7072 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7078 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7086 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7089 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7090 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7095 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7096 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7106 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7120 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7125 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7142 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7143 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7148 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7150 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7210 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7211 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7215 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7216 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7219 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7227 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7242 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7254 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7261 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7341 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7355〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7360 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7365 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7368 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7385 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7389 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7393 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7403 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7418 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7439 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7440 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7441 | 0 |
| `DEM_SRC` 📝 | 定数 | 7444 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7450 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7451 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7454 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7462 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7471 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7495 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7500 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7505 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7507 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7519 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7561 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7564 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7588 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7592 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7615 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7652 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7656 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7676 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7687 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7691 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7707 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7712 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7725 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7745 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7767 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7781 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7785 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7786 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7787 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7790 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7791 | 1：`csCompute` |
| `csPushTime` | 関数 | 7792 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7793 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7796 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7805 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7814 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7816 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7828 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7849 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7863 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7877 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7886 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7892 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7906 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7937 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7938 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7940 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7941 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7942 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7943 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7945 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7946 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7947 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7954 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7960 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7966 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7976 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7990 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8003 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8004 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8005 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8006 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8015 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8029 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8051 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8061 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8065 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8070 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8088 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8089 | 1：`wdPlan` |
| `wd` | 状態 | 8091 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8093 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8103 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8119 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8124 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8126 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8131 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8137 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8159 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8169 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8177 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8187 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8212 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8214 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8218 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8220 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8229 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8251 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8274 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8299 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8310 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8363 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8365 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8380 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8388 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8392 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8395 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8412 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8414 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8419 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8430 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8459 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8461 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8506 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8521 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8554 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8558 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8563 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8588 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8589 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8592 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8593 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8595 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8606 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8631 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8632 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8633 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8634 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8637 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8648 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8655 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8666 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8681 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8686 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8709 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8712 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8726 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8789 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8806〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8823 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8824 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8829 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8833 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8838 | 0 |
| `radarNowWet` | 関数 | 8877 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8885 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8898 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8907 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8939 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8949 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8956 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8985 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8986 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8987 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8988 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9031 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9032 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9043 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9044 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9045 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9046 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9060 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9076〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9091 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9092 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9093 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9094 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9097 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9101 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9102 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9103 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9105 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9111 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9139 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9184〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9199 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9207 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9211 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9213 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9214 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9216 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9217 | 1：`windBand` |
| `windBand` | 関数 | 9218 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9220 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9222 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9223 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9224 | 1：（トップレベル） |
| `windDirName` | 関数 | 9226 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9232 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9242 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9247 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9322 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9341 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9342 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9349 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9356 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9391 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9396 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9404 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9423 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9443 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9460 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9512 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9526 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9527 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9528 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9530 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9531 | 1：`ensureWindField` |
| `windError` | 関数 | 9532 | 1：`ensureWindField` |
| `windClear` | 関数 | 9533 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9537 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9607 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9626 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9641 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9669 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9773 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9777〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9792 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9805 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9809 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9813 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9822 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9836 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9851 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9853 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9869 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9885 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9895〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9909 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9923 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9932 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9939 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9940 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9941 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9943 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9958 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9973 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9988 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10003 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10005 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10021 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10036 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10048〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10061 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10080 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10082 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10093 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10106 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10108 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10123 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10135 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10148 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10154 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10156 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10168 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10172 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10229〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10251 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10270 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10288 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10292 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10303 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10328 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10341 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10347 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10368 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10383 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10386 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10387 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10388 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10393 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10394 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10395 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10396 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10402 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10407 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10411 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10416 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10421 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10427 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10434 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10441 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10450 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10456 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10480 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10490 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10495 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10511 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10564 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10571 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10572 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10576 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10618 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10626 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10628 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10670 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10679 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10752〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10770 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10780 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10793 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10799 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10800 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10802 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10810 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10817 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10825 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10840 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10851 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10926 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10951 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10957〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10981 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10987 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10996 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11012 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11013 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11016 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11039 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11067 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11073 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11118 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11144 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11151 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11250 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11265 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11266 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11465 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11482 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11494 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11502 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11509 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11514 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11515 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11516 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11517 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11518 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11533 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11546 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11575 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11608 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11636 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11654 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11667 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11697 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11707 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11730 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11731 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11763 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11810 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11814 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11832 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11839 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11840 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11865 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11915 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11925 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11926 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11944 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11946 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11959 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11981 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11985 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11994 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12001 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12006 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12007 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12008 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12013 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12028 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12043 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12057 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12061 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12074 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12094 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12104 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12113 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12127 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12154 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12250 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12268 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12308 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12320 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12332 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12334 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12339 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12349 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12377 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12406 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12437 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12446 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12456 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12461 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12469 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12470 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12476 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12483 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12490 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12492 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12517 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12532 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12533 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12534 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12535 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12539 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12548 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12560 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12576 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12652 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12653 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12654 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12655 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12656 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12657 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12659 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12664 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12679 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12685 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12691 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12700 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12708 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12759 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12799 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12807 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12825 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12830 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12836 | 1：（HTML） |
| `stepMapTime` | 関数 | 12837 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12838 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12850 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12851 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12852 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12859 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12863 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12868 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12871 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12874 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12880 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12881 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12886 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12949 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12950 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12953 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12966 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13000 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13010 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13022 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13029 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13035 | 1：`blendChips` |
| `blendChips` | 関数 | 13044 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13051 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13052 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13059 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13080 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13085 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13113 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13121 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13129 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13214 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13233 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13251 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13252 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13259 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13277 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13285 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13292 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13306 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13314 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13335 | 1：（HTML） |
| `sectionLayers` | 関数 | 13339 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13340 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13342 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13351 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13360 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13368 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13390 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13402 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13403 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13404 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13405 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13406 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13409 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13412 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13417 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13431 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13454 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13465 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13488 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13494 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13504 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13511 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13526 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13529 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13541 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13573 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13584 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13591 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13598 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13607 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13639 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13709〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13712 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13713 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13716 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13730 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13738 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13744 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13771 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13780 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13784 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13811 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13815 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13836 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13842 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13881 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13885 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13892 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13918 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 13928 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 13932 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13957 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13958 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13959 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13963 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13967 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13977 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13984 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14006 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14013 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14020 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 14033 | 1：（HTML） |
| `AREA_LS` | 定数 | 14048 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14049 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14050 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14051 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14053 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14060 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14065 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14075 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14090 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14100 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14105 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14110 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14115 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14116 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14117 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14195 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14208 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14249 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14263 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14270 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14278〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14303 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14310 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14332 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14349 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14355 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14370 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14389 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14401 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14416 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14426 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14459 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14482 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14492 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14500 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14507 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14519 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14527 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14560 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14561 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14562 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14565 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14571 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14572 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14578 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14620 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14621 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14622 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14628 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14633 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14707 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14708 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14713 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14725 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14729 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14737 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14754 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14755 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14769 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14787 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14839 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14860 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14864 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14868 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14887 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14890 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14903 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14904 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14930 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14947 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14950 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14956 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15017 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15018 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15035 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15158 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15159 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15160 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15167 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15187〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15195 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15196 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15198 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15205 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15209 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15213 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15223 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15232 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15315〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15323 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15333 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15341 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15342 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15352 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15367 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15382 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15389 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15393 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15399 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15410 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15429 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15457 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15464 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15474 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15479 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15486 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15489 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15497 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15503 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15512 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15527 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15532 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15543 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15549 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15559 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15576 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15612 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15622 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15638 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15639 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15715 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15716 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15725〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15730 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15735 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15740 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15744 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15755 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15756 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15768 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15789 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15792 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15806 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15827 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15863〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15873 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15876 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15879 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15880 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15881 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15882 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15883 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15886 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15912 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15913 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15914 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15915 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15920 | 1：`utmResult` |
| `utmResult` | 関数 | 15925 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15932 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15956 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15968 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16002 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 16015 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16023 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16065 | 1：（HTML） |

## FAVORITES

行 16077〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16080 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16084 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16097 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16098 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16099 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16100 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16101 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16103 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16108 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16117 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16120 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16121 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16182 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16214 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16218 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16224 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16228 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16377 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16388〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16394 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16395 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16396 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16399 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16400 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16403 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16412 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16417 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16442 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16485 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16494 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16517 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16555 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16556 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16561 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16571 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16655 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16664 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16699 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16709 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16721 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16725〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16736 | 1：（HTML） |
| `setWindMode` | 関数 | 16745 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16752 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16760 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16768 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16776 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16785 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16814 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16872 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16879〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16882 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16885 | 1：（トップレベル） |

## LOADING OVERLAY

行 16890〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16893 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16899 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16944〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16960 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16961 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16971 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16976 | 1：（HTML） |
| `closeWxMap` | 関数 | 16980 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16983 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16989 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16997 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17013 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17023 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17032 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17047 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17057 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17086〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17089 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17092 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17113 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17123 | 1：（トップレベル） |

