# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,690行／本体の `<script>` は 2898〜16687 行
- トップレベルの宣言 1024（関数 733・定数と状態 291）／ブロック 39
- `code_map.md` に説明があるもの：573／1024（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2899：STATE（16）
- 行 3101：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3305：DATA FETCH（29）
- 行 3795：GPS（2）
- 行 3832：RENDER MASTER（41）
- 行 4290：HUD（28）
- 行 4641：ABC JUDGMENT（6）
- 行 4720：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6192：SKY COLOR HELPER（1）
- 行 6216：WEATHER EMOJI（12）
- 行 6391：PARTICLES (雨・雪エフェクト)（5）
- 行 6481：時刻選択（17）
- 行 6826：MAP — レイヤー定義（55）
- 行 7277：MAP — 本体（140）
- 行 8726：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8996：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9104：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9633：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9751：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9904：風の流れ（Particle Engine）（13）
- 行 10085：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10608：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10813：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13564：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13925：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14834：検索の履歴（選んだ地点）（8）
- 行 14962：手元の山の検索（#171・第1段階）（33）
- 行 15372：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15510：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15724：FAVORITES（7）
- 行 15914：RANKING（全国山域ランキング）（21）
- 行 16251：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16405：LOCALSTORAGE – 最終地点（2）
- 行 16416：LOADING OVERLAY（2）
- 行 16470：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16612：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `WX_SOFT_MS` 📝 | 定数 | 3419 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3421 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3532 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3537 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3573 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3580 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3606 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3628 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3632 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3646 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3665 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3682 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3691 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3722 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3736 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3737 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3738 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3739 | 1：`processData` |
| `summitGustRange` | 関数 | 3744 | 1：`processData` |
| `processData` 📝 | 関数 | 3749 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3795〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3798 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3823 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3832〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3839 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3861 | 1：`render` |
| `FAV_STEP` | 定数 | 3868 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3870 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3871 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3884 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3885 | 1：`favCircular` |
| `favCount` | 関数 | 3886 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3887 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3889 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3895 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3905 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3914 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3920 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3927 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3929 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3944 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3948 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3949 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3955 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3967 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3972 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3983 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3988 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3995 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4005 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4017 | 0 |
| `saveHome` | 関数 | 4018 | 0 |
| `goHome` | 関数 | 4019 | 0 |
| `currentFavChip` | 関数 | 4023 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4029 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4034 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4080 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4115 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4150 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4163 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4181 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4193 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4205 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4207 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4219 | 1：（トップレベル） |

## HUD

行 4290〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4293 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4299 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4305 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4308 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4313 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4318 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4329 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4349 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4354 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4370 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4378 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4396 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4397 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4398 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4408 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4413 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4429 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4430 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4431 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4439 | 1：`peakAt` |
| `peakAt` | 関数 | 4440 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4454 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4482 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4526 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4542 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4621 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4634 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4635 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4641〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4646 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4647 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4649 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4655 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4662 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4706 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4720〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4726 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4727 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4728 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4729 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4730 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4732 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4741 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4742 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4746 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4751 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4760 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4761 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4767 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4768 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4776 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4777 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4778 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4779 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4780 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4781 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4782 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4790 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4793 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4796 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4798 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4971 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4972 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4973 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4985 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4986 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4987 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4988 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4989 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4992 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5010 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5022 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5034 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5043 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5062 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5077 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5186 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5197 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5322 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5381 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5399 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5403 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5404 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5406 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5409 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5413 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5416 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5429 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5443 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5458 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5501 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5515 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5529 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5532 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5533 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5534 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5535 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5537 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5546 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5587 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5596 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5603 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5768 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5813 | 1：`feelColor` |
| `feelColor` | 関数 | 5823 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5842 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5883 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5891 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5898 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5909 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5926 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5948 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5954 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5963 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5991 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6074 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6122 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6139 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6147 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6170 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6176 | 1：（HTML） |

## SKY COLOR HELPER

行 6192〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6195 | 0 |

## WEATHER EMOJI

行 6216〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6225 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6232 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6251 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6252 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6253 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6262 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6284 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6297 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6310 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6324 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6372 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6386 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6391〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6394 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6397 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6449 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6466 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6474 | 1：`updateParticles` |

## 時刻選択

行 6481〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6496 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6497 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6504 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6512 | 0 |
| `positionScrubLine` 📝 | 関数 | 6518 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6539 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6555 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6577 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6597 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6602 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6608 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6640 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6648 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6658 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6671 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6769 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6801 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6826〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6831 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6832 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6835 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6848 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6852 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6855 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6946 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6947 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6949 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6953 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6960 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6961 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6968 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6970 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6971 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6973 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6974 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 6975 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6976 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6977 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6978 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6979 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6980 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6982 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6983 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6984 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6985 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6986 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6989 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6992 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6993 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6994 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7000 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7008 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7011 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7012 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7017 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7018 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7028 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7042 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7047 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7064 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7065 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7070 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7072 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7132 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7133 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7137 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7138 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7141 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7149 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7164 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7176 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7183 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7263 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7277〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7282 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7287 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7290 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7307 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7311 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7315 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7325 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7340 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7361 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7362 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7363 | 0 |
| `DEM_SRC` 📝 | 定数 | 7366 | 3：`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7372 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7373 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7376 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7384 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7393 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7417 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7422 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7427 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7429 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7441 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7483 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7486 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7510 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7514 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7537 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7574 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7578 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7598 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7609 | 4：`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7613 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7629 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7634 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7647 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7667 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7689 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7703 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7707 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7708 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7709 | 1：`csRender1m` |
| `csStats` 📝 | 状態 | 7712 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7713 | 1：`csCompute` |
| `csPushTime` | 関数 | 7714 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7715 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7718 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csMissAny` | 関数 | 7727 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7736 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7738 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7750 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7771 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7785 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7799 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7808 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7814 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7827 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7857 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7858 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7860 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7861 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7862 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7863 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7865 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7866 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7867 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7874 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7880 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7886 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7896 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7910 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7923 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7924 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7925 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7926 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7935 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7949 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7971 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7981 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7985 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 7990 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8008 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8009 | 1：`wdPlan` |
| `wd` | 状態 | 8011 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8013 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8023 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8039 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8044 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8046 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8051 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8057 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8079 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8089 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8097 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8107 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8132 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8134 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8138 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8140 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8149 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8171 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8194 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8219 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8230 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8283 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8285 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8300 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8308 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8312 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8315 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8332 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8334 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8339 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8350 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8379 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8381 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8426 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8441 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8474 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8478 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8483 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8508 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8509 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8512 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8513 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8515 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8526 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8551 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8552 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8553 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8554 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8557 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8568 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8575 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8586 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8601 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8606 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8629 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8632 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8646 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8709 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8726〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8743 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8744 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8749 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8753 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8758 | 0 |
| `radarNowWet` | 関数 | 8797 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8805 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8818 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8827 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8859 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8869 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8876 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8905 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8906 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8907 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8908 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8951 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8952 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8963 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8964 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8965 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8966 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8980 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8996〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9011 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 9012 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9013 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9014 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9017 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 9021 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9022 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9023 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9025 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9031 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9059 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9104〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9119 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9127 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9131 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9133 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9134 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9136 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9137 | 1：`windBand` |
| `windBand` | 関数 | 9138 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9140 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9142 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9143 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9144 | 1：（トップレベル） |
| `windDirName` | 関数 | 9146 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9152 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9162 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9167 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9242 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9259 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9264 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9303 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9311 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9330 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9350 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9367 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9419 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9433 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9434 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9435 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9437 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9438 | 1：`ensureWindField` |
| `windError` | 関数 | 9439 | 1：`ensureWindField` |
| `windClear` | 関数 | 9440 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9444 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9497 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9525 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9629 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9633〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9648 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9661 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9665 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9669 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9678 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9692 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9707 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9709 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9725 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9741 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9751〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9765 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9779 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9788 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9795 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9796 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9797 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9799 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9814 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9829 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9844 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9859 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9861 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9877 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9892 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9904〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9917 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9936 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9938 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9949 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9962 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9964 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9979 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9991 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10004 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10010 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10012 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10024 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10028 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10085〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10107 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10126 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10144 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10148 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10159 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10184 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10197 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10203 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10224 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10239 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10242 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10243 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10244 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10249 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10250 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10251 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10252 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10258 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10263 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10267 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10272 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10277 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10283 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10290 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10297 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10306 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10312 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10336 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10346 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10351 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10367 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10420 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10427 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10428 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10432 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10474 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10482 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10484 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10526 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10535 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10608〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10626 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10636 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10649 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10655 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10656 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10658 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10666 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10673 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10681 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10696 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10707 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10782 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10807 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10813〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10837 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10843 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10852 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10868 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10869 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10872 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10895 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10923 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10929 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10974 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11000 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11007 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11106 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11121 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11122 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11321 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11338 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11350 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11358 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11365 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11370 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11371 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11372 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11373 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11374 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11389 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11402 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11431 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11464 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11492 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11510 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11523 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11553 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11563 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11586 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11587 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11619 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11666 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11670 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11688 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11695 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11696 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11721 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11771 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11781 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11782 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11800 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11802 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11815 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11837 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11841 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11850 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11857 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11862 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11863 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11864 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11869 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11884 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11899 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11913 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11917 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11930 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11950 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11960 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11969 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11983 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12010 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12106 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12124 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12164 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12176 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12188 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12190 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12195 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12205 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12233 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12262 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12293 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12302 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12312 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12317 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12325 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12326 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12332 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12339 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12346 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12348 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12373 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12388 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12389 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12390 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12391 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12395 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12404 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12416 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12432 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12508 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12509 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12510 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12511 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12512 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12513 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12515 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12520 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12535 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12541 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12547 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12556 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12564 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12615 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12655 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12663 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12681 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12686 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12692 | 1：（HTML） |
| `stepMapTime` | 関数 | 12693 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12694 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12706 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12707 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12708 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12715 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12719 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12724 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12727 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12730 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12736 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12737 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12742 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12805 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12806 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12809 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12822 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12856 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12866 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12878 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12885 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12891 | 1：`blendChips` |
| `blendChips` | 関数 | 12900 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12907 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12908 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12915 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 12936 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 12941 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12969 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12977 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12985 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13070 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13089 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13107 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13108 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13115 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13132 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13140 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13147 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13161 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13169 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13190 | 1：（HTML） |
| `sectionLayers` | 関数 | 13194 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13195 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13197 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13206 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13215 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13223 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13245 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13257 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13258 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13259 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13260 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13261 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13264 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13267 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13272 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13286 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13309 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13320 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13343 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13349 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13359 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13366 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13381 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13384 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13396 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13428 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13439 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13446 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13453 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13462 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13494 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13564〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13567 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13568 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13571 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13585 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13593 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13599 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13626 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13635 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13639 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13666 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13670 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13691 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13697 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13736 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13740 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13747 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13772 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13782 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13786 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13811 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13812 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13813 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13817 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13821 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13831 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13838 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13860 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13867 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13874 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13887 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13896 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13910 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13917 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13925〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13950 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13957 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13979 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13996 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14002 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14017 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14036 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14048 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14063 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14073 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14106 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14129 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14139 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14147 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14154 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14166 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14174 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14207 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14208 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14209 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14212 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14218 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14219 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14225 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14267 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14268 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14269 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14275 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14280 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14354 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14355 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14360 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14372 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14376 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14384 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14401 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14402 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14416 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14434 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14486 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14507 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14511 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14515 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14534 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14537 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14550 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14551 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14577 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14594 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14597 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14603 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14664 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14665 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14682 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14805 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14806 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14807 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14814 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14834〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14842 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14843 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14845 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14852 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14856 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14860 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14870 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14879 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14962〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14970 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14980 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14988 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14989 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14999 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15014 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15029 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15036 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15040 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15046 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15057 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15076 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15104 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15111 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15121 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15126 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15133 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15136 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15144 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15150 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15159 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15174 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15179 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15190 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15196 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15206 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15223 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15259 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15269 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15285 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15286 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15362 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15363 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15372〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15377 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15382 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15387 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15391 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15402 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15403 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15415 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15436 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15439 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15453 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15474 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15510〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15520 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15523 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15526 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15527 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15528 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15529 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15530 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15533 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15559 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15560 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15561 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15562 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15567 | 1：`utmResult` |
| `utmResult` | 関数 | 15572 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15579 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15603 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15615 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15649 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15662 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15670 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15712 | 1：（HTML） |

## FAVORITES

行 15724〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15727 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15731 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15741 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15745 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15750 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15754 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15903 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15914〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15920 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15921 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15922 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15925 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15926 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15929 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 15938 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15943 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15968 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16011 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16020 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16043 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16081 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16082 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16087 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16097 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16181 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16190 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16225 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16235 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16247 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16251〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16262 | 1：（HTML） |
| `setWindMode` | 関数 | 16271 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16278 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16286 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16294 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16302 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16311 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16340 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16398 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16405〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16408 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16411 | 1：（トップレベル） |

## LOADING OVERLAY

行 16416〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16419 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16425 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16470〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16486 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16487 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16497 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16502 | 1：（HTML） |
| `closeWxMap` | 関数 | 16506 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16509 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16515 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16523 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16539 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16549 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16558 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16573 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16583 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16612〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16615 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16618 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16639 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16649 | 1：（トップレベル） |

