# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,058行／本体の `<script>` は 2826〜15055 行
- トップレベルの宣言 871（関数 621・定数と状態 250）／ブロック 39
- `code_map.md` に説明があるもの：482／871（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2827：STATE（16）
- 行 3029：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3224：DATA FETCH（28）
- 行 3660：GPS（2）
- 行 3697：RENDER MASTER（40）
- 行 4150：HUD（28）
- 行 4501：ABC JUDGMENT（6）
- 行 4580：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6052：SKY COLOR HELPER（1）
- 行 6076：WEATHER EMOJI（12）
- 行 6251：PARTICLES (雨・雪エフェクト)（5）
- 行 6341：時刻選択（17）
- 行 6686：MAP — レイヤー定義（44）
- 行 7020：MAP — 本体（43）
- 行 7551：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7814：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7922：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8451：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8569：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8722：風の流れ（Particle Engine）（13）
- 行 8903：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9414：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9619：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（156）
- 行 12015：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12293：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13202：検索の履歴（選んだ地点）（8）
- 行 13330：手元の山の検索（#171・第1段階）（33）
- 行 13740：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13878：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14092：FAVORITES（7）
- 行 14282：RANKING（全国山域ランキング）（21）
- 行 14619：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14773：LOCALSTORAGE – 最終地点（2）
- 行 14784：LOADING OVERLAY（2）
- 行 14838：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14980：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2827〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2830 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2848 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2863 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2867 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2883 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2898 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2928 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2930 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2931 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2934 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2944 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2945 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2960 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3001 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3007 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3020 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3029〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3050 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3051 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3052 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3053 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3057 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3060 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3073 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3081 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3087 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3097 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3117 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3139 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3149 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3173 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3189 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3197 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3207 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3224〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3239 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3245 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3247 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3254 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3266 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3287 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3291 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3299 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3305 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3330 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3397 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3402 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3438 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3445 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3471 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3493 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3497 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3511 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3530 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3547 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3556 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3587 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3601 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3602 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3603 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3604 | 1：`processData` |
| `summitGustRange` | 関数 | 3609 | 1：`processData` |
| `processData` 📝 | 関数 | 3614 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3660〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3663 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3688 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3697〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3704 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3726 | 1：`render` |
| `FAV_STEP` | 定数 | 3733 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3735 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3736 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3749 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3750 | 1：`favCircular` |
| `favCount` | 関数 | 3751 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3752 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3754 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3760 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3770 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3779 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3785 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3792 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3794 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3809 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3813 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3814 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3820 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3832 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3837 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3848 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3853 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3860 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3870 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3882 | 0 |
| `saveHome` | 関数 | 3883 | 0 |
| `goHome` | 関数 | 3884 | 0 |
| `currentFavChip` | 関数 | 3888 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3894 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3899 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3945 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3980 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4015 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4028 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4046 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4058 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4067 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4079 | 1：（トップレベル） |

## HUD

行 4150〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4153 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4159 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4165 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4168 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4173 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4178 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4189 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4209 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4214 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4230 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4238 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4256 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4257 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4258 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4268 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4273 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4289 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4290 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4291 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4299 | 1：`peakAt` |
| `peakAt` | 関数 | 4300 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4314 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4342 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4386 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4402 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4481 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4494 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4495 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4501〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4506 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4507 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4509 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4515 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4522 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4566 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4580〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4586 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4587 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4588 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4589 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4590 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4592 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4601 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4602 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4606 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4611 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4620 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4621 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4627 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4628 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4636 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4637 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4638 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4639 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4640 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4641 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4642 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4650 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4653 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4656 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4658 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4831 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4832 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4833 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4845 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4846 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4847 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4848 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4849 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4852 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4870 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4882 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4894 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4903 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4922 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4937 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5046 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5057 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5182 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5241 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5259 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5263 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5264 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5266 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5269 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5273 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5276 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5289 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5303 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5318 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5361 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5375 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5389 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5392 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5393 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5394 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5395 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5397 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5406 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5447 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5456 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5463 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5628 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5673 | 1：`feelColor` |
| `feelColor` | 関数 | 5683 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5702 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5743 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5751 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5758 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5769 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5786 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5808 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5814 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5823 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5851 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5934 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5982 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5999 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6007 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6030 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6036 | 1：（HTML） |

## SKY COLOR HELPER

行 6052〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6055 | 0 |

## WEATHER EMOJI

行 6076〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6085 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6092 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6111 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6112 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6113 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6122 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6144 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6157 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6170 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6184 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6232 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6246 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6251〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6254 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6257 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6309 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6326 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6334 | 1：`updateParticles` |

## 時刻選択

行 6341〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6356 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6357 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6364 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6372 | 0 |
| `positionScrubLine` 📝 | 関数 | 6378 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6399 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6415 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6437 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6457 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6462 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6468 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6500 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6508 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6518 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6531 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6629 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6661 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6686〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6691 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6692 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6695 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6708 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6711 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6774 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6775 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6777 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6781 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6788 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6789 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6796 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6798 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6799 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6801 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6802 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6803 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6804 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6805 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BLEND` | 定数 | 6806 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_BLEND_MODES` | 定数 | 6807 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6810 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6813 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6814 | 1：`blendOf` |
| `isBlendable` | 関数 | 6815 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6820 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6828 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6831 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6832 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6837 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6838 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6848 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6862 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6867 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6884 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6885 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6890 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6892 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6947 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6948 | 12：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか6 |
| `usableOverlays` 📝 | 関数 | 6952 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6953 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6956 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7009 | 7：`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity`、`setSatBand`、`setWindMode` ほか1 |

## MAP — 本体

行 7020〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 7025 | 25：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか19 |
| `overlayTileLayers` | 状態 | 7029 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7032 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7044 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7058 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 7071 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7108 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7110 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7125 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7133 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7137 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7140 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7157 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7159 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7164 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7175 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7204 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7206 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7251 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7266 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7299 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7303 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7308 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7333 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7334 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7337 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7338 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7340 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7351 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7376 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7377 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7378 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7379 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7382 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7393 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7400 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7411 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7426 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7431 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7454 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7457 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7471 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7534 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7551〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7568 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7569 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7574 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7578 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7583 | 0 |
| `radarNowWet` | 関数 | 7622 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7630 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7643 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7652 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7684 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7694 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7701 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7730 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7731 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7732 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7733 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7769 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7770 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7781 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 7782 | 7：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus` ほか1 |
| `clearLayerStatus` 📝 | 関数 | 7783 | 7：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `applyLayerStatus` | 関数 | 7784 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7798 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7814〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7829 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7830 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7831 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7832 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7835 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7839 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 7840 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7841 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7843 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7849 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7877 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7922〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7937 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7945 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7949 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7951 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7952 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7954 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7955 | 1：`windBand` |
| `windBand` | 関数 | 7956 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7958 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7960 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7961 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7962 | 1：（トップレベル） |
| `windDirName` | 関数 | 7964 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7970 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7980 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7985 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8060 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8077 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8082 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8121 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8129 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8148 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8168 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8185 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8237 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8251 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8252 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8253 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8255 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8256 | 1：`ensureWindField` |
| `windError` | 関数 | 8257 | 1：`ensureWindField` |
| `windClear` | 関数 | 8258 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8262 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8315 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8343 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8447 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8451〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8466 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8479 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8483 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8487 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8496 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8510 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8525 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8527 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8543 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8559 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8569〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8583 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8597 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8606 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8613 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8614 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8615 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8617 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8632 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8647 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8662 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8677 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8679 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8695 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8710 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8722〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8735 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8754 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 8756 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8767 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8780 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8782 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8797 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8809 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8822 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8828 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8830 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8842 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8846 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8903〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8925 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8944 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8962 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8966 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8977 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9002 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9015 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9021 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9042 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9052 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9055 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9056 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9057 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9062 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9063 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9064 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9065 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9071 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9076 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9080 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9085 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9090 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9096 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9103 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9110 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9119 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9142 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9152 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9157 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9173 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9226 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9233 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9234 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9238 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9280 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9288 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9290 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9332 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9341 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9414〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9432 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9442 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9455 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9461 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9462 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9464 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9472 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9479 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9487 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9502 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9513 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9588 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9613 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9619〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9643 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9649 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9658 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9674 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9675 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9678 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9701 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9729 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9735 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9780 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9806 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9813 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9912 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9927 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9928 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10127 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10144 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10156 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10164 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10171 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10176 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10177 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10178 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10179 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10180 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10195 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10208 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10237 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10270 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10298 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10316 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10329 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10359 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10369 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10392 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10393 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10425 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10472 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10476 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10494 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10501 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10502 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10527 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10577 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10587 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10588 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10606 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10608 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10621 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10643 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10647 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10656 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10663 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10668 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10669 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10670 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10675 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10690 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10705 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10719 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10723 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10736 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10756 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10766 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10775 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10789 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10816 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10912 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10930 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10970 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10982 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10994 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10996 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11001 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11011 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11039 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11068 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11099 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11108 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11118 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11123 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11131 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11132 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11138 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11145 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11152 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11154 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11179 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11194 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11195 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11196 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11197 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11201 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11210 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11222 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11238 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11314 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11315 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11316 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11317 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11318 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11319 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11321 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11326 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11341 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11347 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11353 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11362 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11370 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11421 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11459 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11467 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11484 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11489 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11495 | 1：（HTML） |
| `stepMapTime` | 関数 | 11496 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11497 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11509 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11510 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11511 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11518 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11522 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11527 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11530 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11533 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11539 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11540 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11545 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11608 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11609 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11612 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11625 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11658 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 11668 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 11680 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 11687 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 11693 | 1：`blendChips` |
| `blendChips` | 関数 | 11702 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11709 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11710 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11717 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11737 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11763 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11771 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11779 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11862 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11881 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11899 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11900 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11906 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11922 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11929 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11936 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11950 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11958 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11975 | 10：`drawPoi`、`openMap`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setSatBand` ほか4 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12015〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12018 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12019 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12022 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12036 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12044 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12050 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12077 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12086 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12090 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12117 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12121 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12142 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12148 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12187 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12191 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12198 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12223 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12233 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12237 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12255 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12264 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12278 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12285 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12293〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12318 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12325 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12347 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12364 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12370 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12385 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12404 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12416 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12431 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12441 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12474 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12497 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12507 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12515 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12522 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12534 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12542 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12575 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12576 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12577 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12580 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12586 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12587 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12593 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12635 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12636 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12637 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12643 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12648 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12722 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12723 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12728 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12740 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12744 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12752 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12769 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12770 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12784 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12802 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12854 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12875 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12879 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12883 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12902 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12905 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12918 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12919 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12945 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12962 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12965 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12971 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13032 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13033 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13050 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13173 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13174 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13175 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13182 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13202〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13210 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13211 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13213 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13220 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13224 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13228 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13238 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13247 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13330〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13338 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13348 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13356 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13357 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13367 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13382 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13397 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13404 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13408 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13414 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13425 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13444 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13472 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13479 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13489 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13494 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13501 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13504 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13512 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13518 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13527 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13542 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13547 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13558 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13564 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13574 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13591 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13627 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13637 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13653 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13654 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13730 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13731 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13740〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13745 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13750 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13755 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13759 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13770 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13771 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13783 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13804 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13807 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13821 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13842 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13878〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13888 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13891 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13894 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13895 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13896 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13897 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13898 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13901 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13927 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13928 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13929 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13930 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13935 | 1：`utmResult` |
| `utmResult` | 関数 | 13940 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13947 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13971 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13983 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14017 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14030 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14038 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14080 | 1：（HTML） |

## FAVORITES

行 14092〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14095 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14099 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 14109 | 1：（HTML） |
| `openFav` 📝 | 関数 | 14113 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 14118 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 14122 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14271 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14282〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14288 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14289 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14290 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14293 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14294 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14297 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14306 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14311 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14336 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14379 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14388 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14411 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14449 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14450 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14455 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14465 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14549 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14558 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14593 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14603 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14615 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14619〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14630 | 1：（HTML） |
| `setWindMode` | 関数 | 14639 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14646 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14654 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14662 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14670 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14679 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14708 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14766 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14773〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14776 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14779 | 1：（トップレベル） |

## LOADING OVERLAY

行 14784〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14787 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14793 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14838〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14854 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14855 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14865 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14870 | 1：（HTML） |
| `closeWxMap` | 関数 | 14874 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14877 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14883 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14891 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14907 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14917 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14926 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14941 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14951 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14980〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14983 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14986 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15007 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`loadOutlook`、`poiTypeChips`、`renderLayerPanel` ほか3 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15017 | 1：（トップレベル） |

