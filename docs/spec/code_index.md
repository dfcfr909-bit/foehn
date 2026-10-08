# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,815行／本体の `<script>` は 2803〜14812 行
- トップレベルの宣言 846（関数 608・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：482／846（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2804：STATE（16）
- 行 3006：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3201：DATA FETCH（28）
- 行 3637：GPS（2）
- 行 3674：RENDER MASTER（40）
- 行 4127：HUD（28）
- 行 4478：ABC JUDGMENT（6）
- 行 4557：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6029：SKY COLOR HELPER（1）
- 行 6053：WEATHER EMOJI（12）
- 行 6228：PARTICLES (雨・雪エフェクト)（5）
- 行 6318：時刻選択（17）
- 行 6663：MAP — レイヤー定義（37）
- 行 6953：MAP — 本体（43）
- 行 7477：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7738：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7846：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8375：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8493：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8646：風の流れ（Particle Engine）（13）
- 行 8827：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9338：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9543：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（138）
- 行 11772：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12050：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 12959：検索の履歴（選んだ地点）（8）
- 行 13087：手元の山の検索（#171・第1段階）（33）
- 行 13497：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13635：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13849：FAVORITES（7）
- 行 14039：RANKING（全国山域ランキング）（21）
- 行 14376：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14530：LOCALSTORAGE – 最終地点（2）
- 行 14541：LOADING OVERLAY（2）
- 行 14595：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14737：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2804〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2807 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2825 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2840 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2844 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2860 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2875 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2905 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2907 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2908 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2911 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2921 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2922 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2937 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2978 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2984 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2997 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3006〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3027 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3028 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3029 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3030 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3034 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3037 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3050 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3058 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3064 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3074 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3094 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3116 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3126 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3150 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3166 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3174 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3184 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3201〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3216 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3222 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3224 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3231 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3243 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3264 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3268 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3276 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3282 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3307 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3374 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3379 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3415 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3422 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3448 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3470 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3474 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3488 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3507 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3524 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3533 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3564 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3578 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3579 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3580 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3581 | 1：`processData` |
| `summitGustRange` | 関数 | 3586 | 1：`processData` |
| `processData` 📝 | 関数 | 3591 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3637〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3640 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3665 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3674〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3681 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3703 | 1：`render` |
| `FAV_STEP` | 定数 | 3710 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3712 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3713 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3726 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3727 | 1：`favCircular` |
| `favCount` | 関数 | 3728 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3729 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3731 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3737 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3747 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3756 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3762 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3769 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3771 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3786 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3790 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3791 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3797 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3809 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3814 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3825 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3830 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3837 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3847 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3859 | 0 |
| `saveHome` | 関数 | 3860 | 0 |
| `goHome` | 関数 | 3861 | 0 |
| `currentFavChip` | 関数 | 3865 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3871 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3876 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3922 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3957 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3992 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4005 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4023 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4035 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4044 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4056 | 1：（トップレベル） |

## HUD

行 4127〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4130 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4136 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4142 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4145 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4150 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4155 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4166 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4186 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4191 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4207 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4215 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4233 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4234 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4235 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4245 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4250 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4266 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4267 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4268 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4276 | 1：`peakAt` |
| `peakAt` | 関数 | 4277 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4291 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4319 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4363 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4379 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4458 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4471 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4472 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4478〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4483 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4484 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4486 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4492 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4499 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4543 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4557〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4563 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4564 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4565 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4566 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4567 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4569 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4578 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4579 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4583 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4588 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4597 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4598 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4604 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4605 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4613 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4614 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4615 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4616 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4617 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4618 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4619 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4627 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4630 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4633 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4635 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4808 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4809 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4810 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4822 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4823 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4824 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4825 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4826 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4829 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4847 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4859 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4871 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4880 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4899 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4914 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5023 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5034 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5159 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5218 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5236 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5240 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5241 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5243 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5246 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5250 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5253 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5266 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5280 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5295 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5338 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5352 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5366 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5369 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5370 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5371 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5372 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5374 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5383 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5424 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5433 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5440 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5605 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5650 | 1：`feelColor` |
| `feelColor` | 関数 | 5660 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5679 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5720 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5728 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5735 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5746 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5763 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5785 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5791 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5800 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5828 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5911 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5959 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5976 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5984 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6007 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6013 | 1：（HTML） |

## SKY COLOR HELPER

行 6029〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6032 | 0 |

## WEATHER EMOJI

行 6053〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6062 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6069 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6088 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6089 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6090 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6099 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6121 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6134 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6147 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6161 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6209 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6223 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6228〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6231 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6234 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6286 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6303 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6311 | 1：`updateParticles` |

## 時刻選択

行 6318〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6333 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6334 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6341 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6349 | 0 |
| `positionScrubLine` 📝 | 関数 | 6355 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6376 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6392 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6414 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6434 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6439 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6445 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6477 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6485 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6495 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6508 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6606 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6638 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6663〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6668 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6669 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6672 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6685 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6688 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6733 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6734 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6736 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6740 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6747 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6748 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6755 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6757 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6758 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6760 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6761 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6762 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6763 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6764 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6772 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6775 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6776 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6781 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6782 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6792 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6806 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6811 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6828 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6829 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6834 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6836 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6891 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6892 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6896 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6897 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6900 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6943 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6953〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6958 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6962 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6965 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6975 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6989 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 7002 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7035 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7037 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7052 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7060 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7064 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7067 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7084 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7086 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7091 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7102 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7131 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7133 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7178 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7193 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7225 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7229 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7234 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7259 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7260 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7263 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7264 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7266 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7277 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7302 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7303 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7304 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7305 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7308 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7319 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7326 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7337 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7352 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7357 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7380 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7383 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7397 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7460 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7477〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7494 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7495 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7500 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7504 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7509 | 0 |
| `radarNowWet` | 関数 | 7548 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7556 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7569 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7578 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7610 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7620 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7627 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7656 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7657 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7658 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7659 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7693 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7694 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7705 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7706 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7707 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7708 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7722 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7738〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7753 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7754 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7755 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7756 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7759 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7763 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7764 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7765 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7767 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7773 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7801 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7861 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7869 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7873 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7875 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7876 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7878 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7879 | 1：`windBand` |
| `windBand` | 関数 | 7880 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7882 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7884 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7885 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7886 | 1：（トップレベル） |
| `windDirName` | 関数 | 7888 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7894 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7904 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7909 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7984 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8001 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8006 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8045 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8053 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8072 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8092 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8109 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8161 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8175 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8176 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8177 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8179 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8180 | 1：`ensureWindField` |
| `windError` | 関数 | 8181 | 1：`ensureWindField` |
| `windClear` | 関数 | 8182 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8186 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8239 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8267 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8371 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8375〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8390 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8403 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8407 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8411 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8420 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8434 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8449 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8451 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8467 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8483 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8493〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8507 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8521 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8530 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8537 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8538 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8539 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8541 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8556 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8571 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8586 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8601 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8603 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8619 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8634 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8646〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8659 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8678 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8680 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8691 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8704 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8706 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8721 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8733 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8746 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8752 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8754 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8766 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8770 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8827〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8849 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8868 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8886 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8890 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8901 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8926 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8939 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8945 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8966 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8976 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8979 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8980 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8981 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8986 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8987 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8988 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8989 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8995 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9000 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9004 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9009 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9014 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9020 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9027 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9034 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9043 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9066 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9076 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9081 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9097 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9150 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9157 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9158 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9162 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9204 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9212 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9214 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9256 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9265 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9338〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9356 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9366 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9379 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9385 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9386 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9388 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9396 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9403 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9411 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9426 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9437 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9512 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9537 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9543〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9567 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9573 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9582 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9598 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9599 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9602 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9625 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9653 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9659 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9704 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9730 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9737 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9836 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9851 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9852 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10051 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10068 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10080 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10088 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10095 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10100 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10101 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10102 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10103 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10104 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10119 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10132 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10161 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10194 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10222 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10240 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10253 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10283 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10293 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10316 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10317 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10349 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10396 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10400 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10418 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10425 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10426 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10451 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10501 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10511 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10512 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10530 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10532 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10545 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10567 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10571 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10580 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10587 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10592 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10593 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10594 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10599 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10614 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10629 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10643 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10647 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10660 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10680 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10690 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10699 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10713 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10740 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10836 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10854 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10894 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10906 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10918 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10920 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10925 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10935 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10963 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10992 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11023 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11032 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11042 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11047 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11055 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11056 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11062 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11069 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11076 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11078 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11103 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11118 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11119 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11120 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11121 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11125 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11134 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11146 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11162 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11232 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11269 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11277 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11294 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11299 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11305 | 1：（HTML） |
| `stepMapTime` | 関数 | 11306 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11307 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11319 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11320 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11321 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11328 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11332 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11337 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11340 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11343 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11349 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11350 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11355 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11418 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11419 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11422 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11435 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11461 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11469 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11470 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11477 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11497 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11522 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11530 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11538 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11620 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11639 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11657 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11658 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11664 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11680 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11687 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11694 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11708 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11716 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11733 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11772〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11775 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11776 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11779 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11793 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11801 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11807 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11834 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11843 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11847 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11874 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11878 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11899 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11905 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11944 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11948 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11955 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11980 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11990 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11994 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12012 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12021 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12035 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12042 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12050〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12075 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12082 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12104 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12121 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12127 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12142 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12161 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12173 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12188 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12198 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12231 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12254 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12264 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12272 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12279 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12291 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12299 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12332 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12333 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12334 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12337 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12343 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12344 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12350 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12392 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12393 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12394 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12400 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12405 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12479 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12480 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12485 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12497 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12501 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12509 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12526 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12527 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12541 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12559 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12611 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12632 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12636 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12640 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12659 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12662 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12675 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12676 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12702 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12719 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12722 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12728 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12789 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12790 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12807 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12930 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12931 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12932 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12939 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12959〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12967 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12968 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12970 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12977 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12981 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12985 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12995 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13004 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13087〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13095 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13105 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13113 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13114 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13124 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13139 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13154 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13161 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13165 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13171 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13182 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13201 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13229 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13236 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13246 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13251 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13258 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13261 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13269 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13275 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13284 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13299 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13304 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13315 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13321 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13331 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13348 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13384 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13394 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13410 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13411 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13487 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13488 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13497〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13502 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13507 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13512 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13516 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13527 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13528 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13540 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13561 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13564 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13578 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13599 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13635〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13645 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13648 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13651 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13652 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13653 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13654 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13655 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13658 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13684 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13685 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13686 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13687 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13692 | 1：`utmResult` |
| `utmResult` | 関数 | 13697 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13704 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13728 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13740 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13774 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13787 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13795 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13837 | 1：（HTML） |

## FAVORITES

行 13849〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13852 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13856 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13866 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13870 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13875 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13879 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14028 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14039〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14045 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14046 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14047 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14050 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14051 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14054 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14063 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14068 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14093 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14136 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14145 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14168 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14206 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14207 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14212 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14222 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14306 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14315 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14350 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14360 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14372 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14376〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14387 | 1：（HTML） |
| `setWindMode` | 関数 | 14396 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14403 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14411 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14419 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14427 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14436 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14465 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14523 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14530〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14533 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14536 | 1：（トップレベル） |

## LOADING OVERLAY

行 14541〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14544 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14550 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14595〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14611 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14612 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14622 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14627 | 1：（HTML） |
| `closeWxMap` | 関数 | 14631 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14634 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14640 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14648 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14664 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14674 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14683 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14698 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14708 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14737〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14740 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14743 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14764 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14774 | 1：（トップレベル） |

