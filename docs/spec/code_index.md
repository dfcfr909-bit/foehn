# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,681行／本体の `<script>` は 2898〜16678 行
- トップレベルの宣言 1024（関数 733・定数と状態 291）／ブロック 39
- `code_map.md` に説明があるもの：572／1024（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2899：STATE（16）
- 行 3101：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3305：DATA FETCH（29）
- 行 3786：GPS（2）
- 行 3823：RENDER MASTER（41）
- 行 4281：HUD（28）
- 行 4632：ABC JUDGMENT（6）
- 行 4711：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6183：SKY COLOR HELPER（1）
- 行 6207：WEATHER EMOJI（12）
- 行 6382：PARTICLES (雨・雪エフェクト)（5）
- 行 6472：時刻選択（17）
- 行 6817：MAP — レイヤー定義（55）
- 行 7268：MAP — 本体（140）
- 行 8717：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8987：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9095：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9624：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9742：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9895：風の流れ（Particle Engine）（13）
- 行 10076：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10599：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10804：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13555：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13916：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14825：検索の履歴（選んだ地点）（8）
- 行 14953：手元の山の検索（#171・第1段階）（33）
- 行 15363：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15501：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15715：FAVORITES（7）
- 行 15905：RANKING（全国山域ランキング）（21）
- 行 16242：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16396：LOCALSTORAGE – 最終地点（2）
- 行 16407：LOADING OVERLAY（2）
- 行 16461：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16603：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2899〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2902 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2920 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2935 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2939 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2955 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2970 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3000 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3002 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3003 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 3006 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3016 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3017 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3032 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3073 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3079 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3092 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3101〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3122 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3123 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3124 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3125 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3129 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3132 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3145 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3153 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3159 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3169 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3189 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3211 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3221 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3245 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3261 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3269 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3282 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3305〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3320 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3326 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3328 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3335 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3347 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3368 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3372 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3380 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3386 | 1：`openModelSheet` |
| `WX_SOFT_MS` | 定数 | 3416 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3418 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3523 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3528 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3564 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3571 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3597 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3619 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3623 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3637 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3656 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3673 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3682 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3713 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3727 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3728 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3729 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3730 | 1：`processData` |
| `summitGustRange` | 関数 | 3735 | 1：`processData` |
| `processData` 📝 | 関数 | 3740 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3786〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3789 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3814 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3823〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3830 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3852 | 1：`render` |
| `FAV_STEP` | 定数 | 3859 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3861 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3862 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3875 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3876 | 1：`favCircular` |
| `favCount` | 関数 | 3877 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3878 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3880 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3886 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3896 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3905 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3911 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3918 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3920 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3935 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3939 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3940 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3946 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3958 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3963 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3974 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3979 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3986 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3996 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4008 | 0 |
| `saveHome` | 関数 | 4009 | 0 |
| `goHome` | 関数 | 4010 | 0 |
| `currentFavChip` | 関数 | 4014 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4020 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4025 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4071 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4106 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4141 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4154 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4172 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4184 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4196 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4198 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4210 | 1：（トップレベル） |

## HUD

行 4281〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4284 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4290 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4296 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4299 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4304 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4309 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4320 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4340 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4345 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4361 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4369 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4387 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4388 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4389 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4399 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4404 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4420 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4421 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4422 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4430 | 1：`peakAt` |
| `peakAt` | 関数 | 4431 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4445 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4473 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4517 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4533 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4612 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4625 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4626 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4632〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4637 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4638 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4640 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4646 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4653 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4697 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4711〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4717 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4718 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4719 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4720 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4721 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4723 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4732 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4733 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4737 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4742 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4751 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4752 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4758 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4759 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4767 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4768 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4769 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4770 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4771 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4772 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4773 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4781 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4784 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4787 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4789 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4962 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4963 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4964 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4976 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4977 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4978 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4979 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4980 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4983 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5001 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5013 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5025 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5034 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5053 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5068 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5177 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5188 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5313 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5372 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5390 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5394 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5395 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5397 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5400 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5404 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5407 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5420 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5434 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5449 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5492 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5506 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5520 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5523 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5524 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5525 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5526 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5528 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5537 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5578 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5587 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5594 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5759 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5804 | 1：`feelColor` |
| `feelColor` | 関数 | 5814 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5833 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5874 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5882 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5889 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5900 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5917 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5939 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5945 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5954 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5982 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6065 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6113 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6130 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6138 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6161 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6167 | 1：（HTML） |

## SKY COLOR HELPER

行 6183〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6186 | 0 |

## WEATHER EMOJI

行 6207〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6216 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6223 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6242 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6243 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6244 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6253 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6275 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6288 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6301 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6315 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6363 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6377 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6382〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6385 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6388 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6440 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6457 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6465 | 1：`updateParticles` |

## 時刻選択

行 6472〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6487 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6488 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6495 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6503 | 0 |
| `positionScrubLine` 📝 | 関数 | 6509 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6530 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6546 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6568 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6588 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6593 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6599 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6631 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6639 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6649 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6662 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6760 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6792 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6817〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6822 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6823 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6826 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6839 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6843 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6846 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6937 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6938 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6940 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6944 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6951 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6952 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6959 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6961 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6962 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6964 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6965 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 6966 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6967 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6968 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6969 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6970 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6971 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6973 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6974 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6975 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6976 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6977 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6980 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6983 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6984 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6985 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6991 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6999 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7002 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7003 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7008 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7009 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7019 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7033 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7038 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7055 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7056 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7061 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7063 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7123 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7124 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7128 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7129 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7132 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7140 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7155 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7167 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7174 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7254 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7268〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7273 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7278 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7281 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7298 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7302 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7306 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7316 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7331 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7352 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7353 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7354 | 0 |
| `DEM_SRC` 📝 | 定数 | 7357 | 3：`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7363 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7364 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7367 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7375 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7384 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7408 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7413 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7418 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7420 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7432 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7474 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7477 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7501 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7505 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7528 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7565 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7569 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7589 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7600 | 4：`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7604 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7620 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7625 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7638 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7658 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7680 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7694 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7698 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7699 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7700 | 1：`csRender1m` |
| `csStats` 📝 | 状態 | 7703 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7704 | 1：`csCompute` |
| `csPushTime` | 関数 | 7705 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7706 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7709 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csMissAny` | 関数 | 7718 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7727 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7729 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7741 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7762 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7776 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7790 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7799 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7805 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7818 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7848 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7849 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7851 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7852 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7853 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7854 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7856 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7857 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7858 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7865 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7871 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7877 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7887 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7901 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7914 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7915 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7916 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7917 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7926 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7940 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7962 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7972 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7976 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 7981 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 7999 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8000 | 1：`wdPlan` |
| `wd` | 状態 | 8002 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8004 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8014 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8030 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8035 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8037 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8042 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8048 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8070 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8080 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8088 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8098 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8123 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8125 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8129 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8131 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8140 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8162 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8185 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8210 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8221 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8274 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8276 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8291 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8299 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8303 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8306 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8323 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8325 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8330 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8341 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8370 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8372 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8417 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8432 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8465 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8469 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8474 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8499 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8500 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8503 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8504 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8506 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8517 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8542 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8543 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8544 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8545 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8548 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8559 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8566 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8577 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8592 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8597 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8620 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8623 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8637 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8700 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8717〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8734 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8735 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8740 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8744 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8749 | 0 |
| `radarNowWet` | 関数 | 8788 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8796 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8809 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8818 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8850 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8860 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8867 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8896 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8897 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8898 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8899 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8942 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8943 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8954 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8955 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8956 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8957 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8971 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8987〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9002 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 9003 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9004 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9005 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9008 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 9012 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9013 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9014 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9016 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9022 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9050 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9095〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9110 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9118 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9122 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9124 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9125 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9127 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9128 | 1：`windBand` |
| `windBand` | 関数 | 9129 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9131 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9133 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9134 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9135 | 1：（トップレベル） |
| `windDirName` | 関数 | 9137 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9143 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9153 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9158 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9233 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9250 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9255 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9294 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9302 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9321 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9341 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9358 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9410 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9424 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9425 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9426 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9428 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9429 | 1：`ensureWindField` |
| `windError` | 関数 | 9430 | 1：`ensureWindField` |
| `windClear` | 関数 | 9431 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9435 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9488 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9516 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9620 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9624〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9639 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9652 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9656 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9660 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9669 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9683 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9698 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9700 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9716 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9732 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9742〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9756 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9770 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9779 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9786 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9787 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9788 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9790 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9805 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9820 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9835 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9850 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9852 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9868 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9883 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9895〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9908 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9927 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9929 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9940 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9953 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9955 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9970 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9982 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9995 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10001 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10003 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10015 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10019 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10076〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10098 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10117 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10135 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10139 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10150 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10175 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10188 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10194 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10215 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10230 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10233 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10234 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10235 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10240 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10241 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10242 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10243 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10249 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10254 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10258 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10263 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10268 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10274 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10281 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10288 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10297 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10303 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10327 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10337 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10342 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10358 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10411 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10418 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10419 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10423 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10465 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10473 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10475 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10517 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10526 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10599〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10617 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10627 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10640 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10646 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10647 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10649 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10657 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10664 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10672 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10687 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10698 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10773 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10798 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10804〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10828 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10834 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10843 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10859 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10860 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10863 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10886 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10914 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10920 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10965 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10991 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10998 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11097 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11112 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11113 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11312 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11329 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11341 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11349 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11356 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11361 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11362 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11363 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11364 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11365 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11380 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11393 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11422 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11455 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11483 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11501 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11514 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11544 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11554 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11577 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11578 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11610 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11657 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11661 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11679 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11686 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11687 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11712 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11762 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11772 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11773 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11791 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11793 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11806 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11828 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11832 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11841 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11848 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11853 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11854 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11855 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11860 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11875 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11890 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11904 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11908 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11921 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11941 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11951 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11960 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11974 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12001 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12097 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12115 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12155 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12167 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12179 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12181 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12186 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12196 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12224 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12253 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12284 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12293 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12303 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12308 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12316 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12317 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12323 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12330 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12337 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12339 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12364 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12379 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12380 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12381 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12382 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12386 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12395 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12407 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12423 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12499 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12500 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12501 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12502 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12503 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12504 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12506 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12511 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12526 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12532 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12538 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12547 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12555 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12606 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12646 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12654 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12672 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12677 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12683 | 1：（HTML） |
| `stepMapTime` | 関数 | 12684 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12685 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12697 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12698 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12699 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12706 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12710 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12715 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12718 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12721 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12727 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12728 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12733 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12796 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12797 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12800 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12813 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12847 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12857 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12869 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12876 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12882 | 1：`blendChips` |
| `blendChips` | 関数 | 12891 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12898 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12899 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12906 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 12927 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 12932 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12960 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12968 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12976 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13061 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13080 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13098 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13099 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13106 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13123 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13131 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13138 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13152 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13160 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13181 | 1：（HTML） |
| `sectionLayers` | 関数 | 13185 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13186 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13188 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13197 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13206 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13214 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13236 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13248 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13249 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13250 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13251 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13252 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13255 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13258 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13263 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13277 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13300 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13311 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13334 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13340 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13350 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13357 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13372 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13375 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13387 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13419 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13430 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13437 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13444 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13453 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13485 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13555〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13558 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13559 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13562 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13576 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13584 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13590 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13617 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13626 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13630 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13657 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13661 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13682 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13688 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13727 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13731 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13738 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13763 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13773 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13777 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13802 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13803 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13804 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13808 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13812 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13822 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13829 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13851 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13858 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13865 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13878 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13887 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13901 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13908 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13916〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13941 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13948 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13970 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13987 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13993 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14008 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14027 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14039 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14054 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14064 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14097 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14120 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14130 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14138 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14145 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14157 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14165 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14198 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14199 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14200 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14203 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14209 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14210 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14216 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14258 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14259 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14260 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14266 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14271 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14345 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14346 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14351 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14363 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14367 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14375 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14392 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14393 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14407 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14425 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14477 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14498 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14502 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14506 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14525 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14528 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14541 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14542 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14568 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14585 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14588 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14594 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14655 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14656 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14673 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14796 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14797 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14798 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14805 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14825〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14833 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14834 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14836 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14843 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14847 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14851 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14861 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14870 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14953〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14961 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14971 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14979 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14980 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14990 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15005 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15020 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15027 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15031 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15037 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15048 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15067 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15095 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15102 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15112 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15117 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15124 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15127 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15135 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15141 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15150 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15165 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15170 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15181 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15187 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15197 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15214 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15250 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15260 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15276 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15277 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15353 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15354 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15363〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15368 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15373 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15378 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15382 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15393 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15394 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15406 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15427 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15430 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15444 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15465 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15501〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15511 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15514 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15517 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15518 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15519 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15520 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15521 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15524 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15550 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15551 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15552 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15553 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15558 | 1：`utmResult` |
| `utmResult` | 関数 | 15563 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15570 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15594 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15606 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15640 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15653 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15661 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15703 | 1：（HTML） |

## FAVORITES

行 15715〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15718 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15722 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15732 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15736 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15741 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15745 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15894 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15905〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15911 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15912 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15913 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15916 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15917 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15920 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 15929 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15934 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15959 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16002 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16011 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16034 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16072 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16073 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16078 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16088 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16172 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16181 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16216 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16226 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16238 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16242〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16253 | 1：（HTML） |
| `setWindMode` | 関数 | 16262 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16269 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16277 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16285 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16293 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16302 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16331 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16389 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16396〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16399 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16402 | 1：（トップレベル） |

## LOADING OVERLAY

行 16407〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16410 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16416 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16461〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16477 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16478 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16488 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16493 | 1：（HTML） |
| `closeWxMap` | 関数 | 16497 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16500 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16506 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16514 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16530 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16540 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16549 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16564 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16574 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16603〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16606 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16609 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16630 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16640 | 1：（トップレベル） |

