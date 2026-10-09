# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,874行／本体の `<script>` は 2811〜14871 行
- トップレベルの宣言 854（関数 613・定数と状態 241）／ブロック 39
- `code_map.md` に説明があるもの：482／854（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2812：STATE（16）
- 行 3014：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3209：DATA FETCH（28）
- 行 3645：GPS（2）
- 行 3682：RENDER MASTER（40）
- 行 4135：HUD（28）
- 行 4486：ABC JUDGMENT（6）
- 行 4565：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6037：SKY COLOR HELPER（1）
- 行 6061：WEATHER EMOJI（12）
- 行 6236：PARTICLES (雨・雪エフェクト)（5）
- 行 6326：時刻選択（17）
- 行 6671：MAP — レイヤー定義（42）
- 行 6981：MAP — 本体（43）
- 行 7508：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7769：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7877：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8406：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8524：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8677：風の流れ（Particle Engine）（13）
- 行 8858：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9369：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9574：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（141）
- 行 11831：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12109：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13018：検索の履歴（選んだ地点）（8）
- 行 13146：手元の山の検索（#171・第1段階）（33）
- 行 13556：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13694：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13908：FAVORITES（7）
- 行 14098：RANKING（全国山域ランキング）（21）
- 行 14435：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14589：LOCALSTORAGE – 最終地点（2）
- 行 14600：LOADING OVERLAY（2）
- 行 14654：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14796：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2812〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2815 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2833 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2848 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2852 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2868 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2883 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2913 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2915 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2916 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2919 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2929 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2930 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2945 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2986 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2992 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3005 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3014〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3035 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3036 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3037 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3038 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3042 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3045 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3058 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3066 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3072 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3082 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3102 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3124 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3134 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3158 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3174 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3182 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3192 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3209〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3224 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3230 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3232 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3239 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3251 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3272 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3276 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3284 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3290 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3315 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3382 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3387 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3423 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3430 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3456 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3478 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3482 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3496 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3515 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3532 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3541 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3572 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3586 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3587 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3588 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3589 | 1：`processData` |
| `summitGustRange` | 関数 | 3594 | 1：`processData` |
| `processData` 📝 | 関数 | 3599 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3645〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3648 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3673 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3682〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3689 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3711 | 1：`render` |
| `FAV_STEP` | 定数 | 3718 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3720 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3721 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3734 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3735 | 1：`favCircular` |
| `favCount` | 関数 | 3736 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3737 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3739 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3745 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3755 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3764 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3770 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3777 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3779 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3794 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3798 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3799 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3805 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3817 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3822 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3833 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3838 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3845 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3855 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3867 | 0 |
| `saveHome` | 関数 | 3868 | 0 |
| `goHome` | 関数 | 3869 | 0 |
| `currentFavChip` | 関数 | 3873 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3879 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3884 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3930 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3965 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4000 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4013 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4031 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4043 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4052 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4064 | 1：（トップレベル） |

## HUD

行 4135〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4138 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4144 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4150 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4153 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4158 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4163 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4174 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4194 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4199 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4215 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4223 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4241 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4242 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4243 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4253 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4258 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4274 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4275 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4276 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4284 | 1：`peakAt` |
| `peakAt` | 関数 | 4285 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4299 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4327 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4371 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4387 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4466 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4479 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4480 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4486〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4491 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4492 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4494 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4500 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4507 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4551 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4565〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4571 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4572 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4573 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4574 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4575 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4577 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4586 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4587 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4591 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4596 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4605 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4606 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4612 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4613 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4621 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4622 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4623 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4624 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4625 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4626 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4627 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4635 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4638 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4641 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4643 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4816 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4817 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4818 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4830 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4831 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4832 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4833 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4834 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4837 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4855 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4867 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4879 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4888 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4907 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4922 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5031 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5042 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5167 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5226 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5244 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5248 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5249 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5251 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5254 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5258 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5261 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5274 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5288 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5303 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5346 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5360 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5374 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5377 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5378 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5379 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5380 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5382 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5391 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5432 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5441 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5448 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5613 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5658 | 1：`feelColor` |
| `feelColor` | 関数 | 5668 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5687 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5728 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5736 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5743 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5754 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5771 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5793 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5799 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5808 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5836 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5919 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5967 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5984 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5992 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6015 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6021 | 1：（HTML） |

## SKY COLOR HELPER

行 6037〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6040 | 0 |

## WEATHER EMOJI

行 6061〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6070 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6077 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6096 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6097 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6098 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6107 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6129 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6142 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6155 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6169 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6217 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6231 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6236〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6239 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6242 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6294 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6311 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6319 | 1：`updateParticles` |

## 時刻選択

行 6326〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6341 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6342 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6349 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6357 | 0 |
| `positionScrubLine` 📝 | 関数 | 6363 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6384 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6400 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6422 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6442 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6447 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6453 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6485 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6493 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6503 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6516 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6614 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6646 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6671〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6676 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6677 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6680 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6693 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6696 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6741 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6742 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6744 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6748 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6755 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6756 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6763 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6765 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6766 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6768 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6769 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6770 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6771 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6772 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BLEND` | 定数 | 6773 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_BLEND_MODES` | 定数 | 6774 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6777 | 1：`isBlendable` |
| `isBlendable` | 関数 | 6778 | 4：`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6781 | 2：`blendChips`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6789 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6792 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6793 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6798 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6799 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6809 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6823 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6828 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6845 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6846 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6851 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6853 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6908 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6909 | 12：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか6 |
| `usableOverlays` 📝 | 関数 | 6913 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6914 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6917 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6970 | 7：`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity`、`setSatBand`、`setWindMode` ほか1 |

## MAP — 本体

行 6981〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6986 | 24：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか18 |
| `overlayTileLayers` | 状態 | 6990 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6993 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7003 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7017 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 7030 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7066 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7068 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7083 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7091 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7095 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7098 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7115 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7117 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7122 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7133 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7162 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7164 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7209 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7224 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7256 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7260 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7265 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7290 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7291 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7294 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7295 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7297 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7308 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7333 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7334 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7335 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7336 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7339 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7350 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7357 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7368 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7383 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7388 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7411 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7414 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7428 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7491 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7508〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7525 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7526 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7531 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7535 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7540 | 0 |
| `radarNowWet` | 関数 | 7579 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7587 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7600 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7609 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7641 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7651 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7658 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7687 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7688 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7689 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7690 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7724 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7725 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7736 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7737 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7738 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7739 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7753 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7769〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7784 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7785 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7786 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7787 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7790 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7794 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7795 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7796 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7798 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7804 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7832 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7877〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7892 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7900 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7904 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7906 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7907 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7909 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7910 | 1：`windBand` |
| `windBand` | 関数 | 7911 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7913 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7915 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7916 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7917 | 1：（トップレベル） |
| `windDirName` | 関数 | 7919 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7925 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7935 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7940 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8015 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8032 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8037 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8076 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8084 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8103 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8123 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8140 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8192 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8206 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8207 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8208 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8210 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8211 | 1：`ensureWindField` |
| `windError` | 関数 | 8212 | 1：`ensureWindField` |
| `windClear` | 関数 | 8213 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8217 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8270 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8298 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8402 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8406〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8421 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8434 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8438 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8442 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8451 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8465 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8480 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8482 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8498 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8514 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8524〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8538 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8552 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8561 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8568 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8569 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8570 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8572 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8587 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8602 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8617 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8632 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8634 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8650 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8665 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8677〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8690 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8709 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 8711 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8722 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8735 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8737 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8752 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8764 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8777 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8783 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8785 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8797 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8801 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8858〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8880 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8899 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8917 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8921 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8932 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8957 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8970 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8976 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8997 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9007 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9010 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9011 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9012 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9017 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9018 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9019 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9020 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9026 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9031 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9035 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9040 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9045 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9051 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9058 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9065 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9074 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9097 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9107 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9112 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9128 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9181 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9188 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9189 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9193 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9235 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9243 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9245 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9287 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9296 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9369〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9387 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9397 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9410 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9416 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9417 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9419 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9427 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9434 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9442 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9457 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9468 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9543 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9568 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9574〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9598 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9604 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9613 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9629 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9630 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9633 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9656 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9684 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9690 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9735 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9761 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9768 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9867 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9882 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9883 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10082 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10099 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10111 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10119 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10126 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10131 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10132 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10133 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10134 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10135 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10150 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10163 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10192 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10225 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10253 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10271 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10284 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10314 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10324 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10347 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10348 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10380 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10427 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10431 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10449 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10456 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10457 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10482 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10532 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10542 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10543 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10561 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10563 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10576 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10598 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10602 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10611 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10618 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10623 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10624 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10625 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10630 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10645 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10660 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10674 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10678 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10691 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10711 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10721 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10730 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10744 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10771 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10867 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10885 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10925 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10937 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10949 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10951 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10956 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10966 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10994 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11023 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11054 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11063 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11073 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11078 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11086 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11087 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11093 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11100 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11107 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11109 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11134 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11149 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11150 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11151 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11152 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11156 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11165 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11177 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11193 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11263 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11300 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11308 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11325 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11330 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11336 | 1：（HTML） |
| `stepMapTime` | 関数 | 11337 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11338 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11350 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11351 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11352 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11359 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11363 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11368 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11371 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11374 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11380 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11381 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11386 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11449 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11450 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11453 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11466 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11492 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 11502 | 1：`applyOverlays` |
| `setOverlayBlend` | 関数 | 11511 | 1：`blendChips` |
| `blendChips` | 関数 | 11521 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11528 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11529 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11536 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11556 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11581 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11589 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11597 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11678 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11697 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11715 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11716 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11722 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11738 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11745 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11752 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11766 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11774 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11791 | 8：`openMap`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setSatBand`、`setWindMode` ほか2 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11831〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11834 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11835 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11838 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11852 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11860 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11866 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11893 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11902 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11906 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11933 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11937 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11958 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11964 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12003 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12007 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12014 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12039 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12049 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12053 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12071 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12080 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12094 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12101 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12109〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12134 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12141 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12163 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12180 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12186 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12201 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12220 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12232 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12247 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12257 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12290 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12313 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12323 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12331 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12338 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12350 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12358 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12391 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12392 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12393 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12396 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12402 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12403 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12409 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12451 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12452 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12453 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12459 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12464 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12538 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12539 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12544 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12556 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12560 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12568 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12585 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12586 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12600 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12618 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12670 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12691 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12695 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12699 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12718 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12721 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12734 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12735 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12761 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12778 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12781 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12787 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12848 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12849 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12866 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12989 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12990 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12991 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12998 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13018〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13026 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13027 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13029 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13036 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13040 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13044 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13054 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13063 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13146〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13154 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13164 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13172 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13173 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13183 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13198 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13213 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13220 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13224 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13230 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13241 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13260 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13288 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13295 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13305 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13310 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13317 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13320 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13328 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13334 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13343 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13358 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13363 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13374 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13380 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13390 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13407 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13443 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13453 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13469 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13470 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13546 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13547 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13556〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13561 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13566 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13571 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13575 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13586 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13587 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13599 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13620 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13623 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13637 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13658 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13694〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13704 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13707 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13710 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13711 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13712 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13713 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13714 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13717 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13743 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13744 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13745 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13746 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13751 | 1：`utmResult` |
| `utmResult` | 関数 | 13756 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13763 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13787 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13799 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13833 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13846 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13854 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13896 | 1：（HTML） |

## FAVORITES

行 13908〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13911 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13915 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13925 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13929 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13934 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13938 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14087 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14098〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14104 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14105 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14106 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14109 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14110 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14113 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14122 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14127 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14152 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14195 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14204 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14227 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14265 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14266 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14271 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14281 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14365 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14374 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14409 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14419 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14431 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14435〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14446 | 1：（HTML） |
| `setWindMode` | 関数 | 14455 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14462 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14470 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14478 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14486 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14495 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14524 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14582 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14589〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14592 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14595 | 1：（トップレベル） |

## LOADING OVERLAY

行 14600〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14603 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14609 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14654〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14670 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14671 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14681 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14686 | 1：（HTML） |
| `closeWxMap` | 関数 | 14690 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14693 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14699 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14707 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14723 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14733 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14742 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14757 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14767 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14796〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14799 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14802 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14823 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14833 | 1：（トップレベル） |

