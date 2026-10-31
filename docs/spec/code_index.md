# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,940行／本体の `<script>` は 2914〜16937 行
- トップレベルの宣言 1042（関数 746・定数と状態 296）／ブロック 39
- `code_map.md` に説明があるもの：585／1042（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2915：STATE（16）
- 行 3117：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3321：DATA FETCH（29）
- 行 3811：GPS（2）
- 行 3848：RENDER MASTER（41）
- 行 4306：HUD（28）
- 行 4657：ABC JUDGMENT（6）
- 行 4736：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6208：SKY COLOR HELPER（1）
- 行 6232：WEATHER EMOJI（12）
- 行 6407：PARTICLES (雨・雪エフェクト)（5）
- 行 6497：時刻選択（17）
- 行 6842：MAP — レイヤー定義（55）
- 行 7293：MAP — 本体（140）
- 行 8744：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9014：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9122：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9651：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9769：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9922：風の流れ（Particle Engine）（13）
- 行 10103：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10626：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10831：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13583：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（50）
- 行 14152：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（59）
- 行 15084：検索の履歴（選んだ地点）（8）
- 行 15212：手元の山の検索（#171・第1段階）（33）
- 行 15622：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15760：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15974：FAVORITES（7）
- 行 16164：RANKING（全国山域ランキング）（21）
- 行 16501：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16655：LOCALSTORAGE – 最終地点（2）
- 行 16666：LOADING OVERLAY（2）
- 行 16720：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16862：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2915〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2918 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2936 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2951 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2955 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2971 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2986 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3016 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3018 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3019 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 3022 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3032 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3033 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3048 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3089 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3095 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3108 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3117〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3138 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3139 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3140 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3141 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3145 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3148 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3161 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3169 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3175 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3185 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3205 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3227 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3237 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3261 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3277 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3285 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3298 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3321〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3336 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3342 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3344 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3351 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3363 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3384 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3388 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3396 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3402 | 1：`openModelSheet` |
| `WX_SOFT_MS` 📝 | 定数 | 3435 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3437 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3548 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3553 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3589 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3596 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3622 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3644 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3648 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3662 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3681 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3698 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3707 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3738 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3752 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3753 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3754 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3755 | 1：`processData` |
| `summitGustRange` | 関数 | 3760 | 1：`processData` |
| `processData` 📝 | 関数 | 3765 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3811〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3814 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3839 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3848〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3855 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3877 | 1：`render` |
| `FAV_STEP` | 定数 | 3884 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3886 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3887 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3900 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3901 | 1：`favCircular` |
| `favCount` | 関数 | 3902 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3903 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3905 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3911 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3921 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3930 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3936 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3943 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3945 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3960 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3964 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3965 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3971 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3983 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3988 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3999 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4004 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4011 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4021 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4033 | 0 |
| `saveHome` | 関数 | 4034 | 0 |
| `goHome` | 関数 | 4035 | 0 |
| `currentFavChip` | 関数 | 4039 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4045 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4050 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4096 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4131 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4166 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4179 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4197 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4209 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4221 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4223 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4235 | 1：（トップレベル） |

## HUD

行 4306〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4309 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4315 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4321 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4324 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4329 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4334 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4345 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4365 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4370 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4386 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4394 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4412 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4413 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4414 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4424 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4429 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4445 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4446 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4447 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4455 | 1：`peakAt` |
| `peakAt` | 関数 | 4456 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4470 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4498 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4542 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4558 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4637 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4650 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4651 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4657〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4662 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4663 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4665 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4671 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4678 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4722 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4736〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4742 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4743 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4744 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4745 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4746 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4748 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4757 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4758 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4762 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4767 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4776 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4777 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4783 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4784 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4792 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4793 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4794 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4795 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4796 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4797 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4798 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4806 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4809 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4812 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4814 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4987 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4988 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4989 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5001 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5002 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5003 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5004 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5005 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5008 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5026 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5038 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5050 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5059 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5078 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5093 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5202 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5213 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5338 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5397 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5415 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5419 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5420 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5422 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5425 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5429 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5432 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5445 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5459 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5474 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5517 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5531 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5545 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5548 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5549 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5550 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5551 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5553 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5562 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5603 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5612 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5619 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5784 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5829 | 1：`feelColor` |
| `feelColor` | 関数 | 5839 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5858 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5899 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5907 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5914 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5925 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5942 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5964 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5970 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5979 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6007 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6090 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6138 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6155 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6163 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6186 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6192 | 1：（HTML） |

## SKY COLOR HELPER

行 6208〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6211 | 0 |

## WEATHER EMOJI

行 6232〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6241 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6248 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6267 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6268 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6269 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6278 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6300 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6313 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6326 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6340 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6388 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6402 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6407〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6410 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6413 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6465 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6482 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6490 | 1：`updateParticles` |

## 時刻選択

行 6497〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6512 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6513 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6520 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6528 | 0 |
| `positionScrubLine` 📝 | 関数 | 6534 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6555 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6571 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6593 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6613 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6618 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6624 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6656 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6664 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6674 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6687 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6785 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6817 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6842〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6847 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6848 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6851 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6864 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6868 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6871 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6962 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6963 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6965 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6969 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6976 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6977 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6984 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6986 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6987 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6989 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6990 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 6991 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6992 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6993 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6994 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6995 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6996 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6998 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6999 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7000 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7001 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7002 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7005 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7008 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7009 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7010 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7016 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7024 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7027 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7028 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7033 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7034 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7044 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7058 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7063 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7080 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7081 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7086 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7088 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7148 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7149 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7153 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7154 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7157 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7165 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7180 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7192 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7199 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7279 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7293〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7298 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7303 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7306 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7323 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7327 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7331 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7341 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7356 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7377 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7378 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7379 | 0 |
| `DEM_SRC` 📝 | 定数 | 7382 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7388 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7389 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7392 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7400 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7409 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7433 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7438 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7443 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7445 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7457 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7499 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7502 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7526 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7530 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7553 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7590 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7594 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7614 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7625 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7629 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7645 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7650 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7663 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7683 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7705 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7719 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7723 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7724 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7725 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7728 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7729 | 1：`csCompute` |
| `csPushTime` | 関数 | 7730 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7731 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7734 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7743 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7752 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7754 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7766 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7787 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7801 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7815 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7824 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7830 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7844 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7875 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7876 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7878 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7879 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7880 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7881 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7883 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7884 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7885 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7892 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7898 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7904 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7914 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7928 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7941 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7942 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7943 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7944 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7953 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7967 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7989 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7999 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8003 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8008 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8026 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8027 | 1：`wdPlan` |
| `wd` | 状態 | 8029 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8031 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8041 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8057 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8062 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8064 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8069 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8075 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8097 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8107 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8115 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8125 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8150 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8152 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8156 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8158 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8167 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8189 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8212 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8237 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8248 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8301 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8303 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8318 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8326 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8330 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8333 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8350 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8352 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8357 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8368 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8397 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8399 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8444 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8459 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8492 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8496 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8501 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8526 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8527 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8530 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8531 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8533 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8544 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8569 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8570 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8571 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8572 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8575 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8586 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8593 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8604 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8619 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8624 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8647 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8650 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8664 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8727 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8744〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8761 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8762 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8767 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8771 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8776 | 0 |
| `radarNowWet` | 関数 | 8815 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8823 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8836 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8845 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8877 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8887 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8894 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8923 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8924 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8925 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8926 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8969 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8970 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8981 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8982 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8983 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8984 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8998 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9014〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9029 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 9030 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9031 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9032 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9035 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 9039 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9040 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9041 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9043 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9049 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9077 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9122〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9137 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9145 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9149 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9151 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9152 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9154 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9155 | 1：`windBand` |
| `windBand` | 関数 | 9156 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9158 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9160 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9161 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9162 | 1：（トップレベル） |
| `windDirName` | 関数 | 9164 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9170 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9180 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9185 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9260 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9277 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9282 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9321 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9329 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9348 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9368 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9385 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9437 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9451 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9452 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9453 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9455 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9456 | 1：`ensureWindField` |
| `windError` | 関数 | 9457 | 1：`ensureWindField` |
| `windClear` | 関数 | 9458 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9462 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9515 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9543 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9647 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9651〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9666 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9679 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9683 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9687 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9696 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9710 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9725 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9727 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9743 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9759 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9769〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9783 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9797 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9806 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9813 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9814 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9815 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9817 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9832 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9847 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9862 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9877 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9879 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9895 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9910 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9922〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9935 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9954 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9956 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9967 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9980 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9982 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9997 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10009 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10022 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10028 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10030 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10042 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10046 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10103〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10125 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10144 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10162 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10166 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10177 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10202 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10215 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10221 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10242 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10257 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10260 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10261 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10262 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10267 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10268 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10269 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10270 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10276 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10281 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10285 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10290 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10295 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10301 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10308 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10315 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10324 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10330 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10354 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10364 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10369 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10385 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10438 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10445 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10446 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10450 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10492 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10500 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10502 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10544 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10553 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10626〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10644 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10654 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10667 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10673 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10674 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10676 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10684 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10691 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10699 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10714 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10725 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10800 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10825 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10831〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10855 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10861 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10870 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10886 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10887 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10890 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10913 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10941 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10947 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10992 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11018 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11025 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11124 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11139 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11140 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11339 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11356 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11368 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11376 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11383 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11388 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11389 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11390 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11391 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11392 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11407 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11420 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11449 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11482 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11510 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11528 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11541 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11571 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11581 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11604 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11605 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11637 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11684 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11688 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11706 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11713 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11714 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11739 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11789 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11799 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11800 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11818 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11820 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11833 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11855 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11859 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11868 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11875 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11880 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11881 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11882 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11887 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11902 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11917 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11931 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11935 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11948 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11968 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11978 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11987 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12001 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12028 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12124 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12142 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12182 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12194 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12206 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12208 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12213 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12223 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12251 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12280 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12311 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12320 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12330 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12335 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12343 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12344 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12350 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12357 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12364 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12366 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12391 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12406 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12407 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12408 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12409 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12413 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12422 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12434 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12450 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12526 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12527 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12528 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12529 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12530 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12531 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12533 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12538 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12553 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12559 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12565 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12574 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12582 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12633 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12673 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12681 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12699 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12704 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12710 | 1：（HTML） |
| `stepMapTime` | 関数 | 12711 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12712 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12724 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12725 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12726 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12733 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12737 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12742 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12745 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12748 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12754 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12755 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12760 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12823 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12824 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12827 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12840 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12874 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12884 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12896 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12903 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12909 | 1：`blendChips` |
| `blendChips` | 関数 | 12918 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12925 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12926 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12933 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 12954 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 12959 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12987 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12995 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13003 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13088 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13107 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13125 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13126 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13133 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13151 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13159 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13166 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13180 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13188 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13209 | 1：（HTML） |
| `sectionLayers` | 関数 | 13213 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13214 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13216 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13225 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13234 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13242 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13264 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13276 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13277 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13278 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13279 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13280 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13283 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13286 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13291 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13305 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13328 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13339 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13362 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13368 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13378 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13385 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13400 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13403 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13415 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13447 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13458 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13465 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13472 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13481 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13513 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13583〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13586 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13587 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13590 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13604 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13612 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13618 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13645 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13654 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13658 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13685 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13689 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13710 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13716 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13755 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13759 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13766 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13792 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 13802 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 13806 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13831 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13832 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13833 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13837 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13841 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13851 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13858 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13880 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13887 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13894 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13907 | 1：（HTML） |
| `AREA_LS` | 定数 | 13922 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 13923 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 13924 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 13925 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 13927 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 13934 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 13939 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 13949 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 13964 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 13974 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 13979 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 13984 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 13989 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 13990 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 13991 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14069 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14082 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14123 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14137 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14144 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14152〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14177 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14184 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14206 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14223 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14229 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14244 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14263 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14275 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14290 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14300 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14333 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14359 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14376 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14384 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14392 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14403 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14415 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14423 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14457 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14458 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14459 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14462 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14468 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14469 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14475 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14517 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14518 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14519 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14525 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14530 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14604 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14605 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14610 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14622 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14626 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14634 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14651 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14652 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14666 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14684 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14736 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14757 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14761 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14765 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14784 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14787 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14800 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14801 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14827 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14844 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14847 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14853 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14914 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14915 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14932 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15055 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15056 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15057 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15064 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15084〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15092 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15093 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15095 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15102 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15106 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15110 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15120 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15129 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15212〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15220 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15230 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15238 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15239 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15249 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15264 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15279 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15286 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15290 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15296 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15307 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15326 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15354 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15361 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15371 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15376 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15383 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15386 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15394 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15400 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15409 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15424 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15429 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15440 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15446 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15456 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15473 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15509 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15519 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15535 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15536 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15612 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15613 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15622〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15627 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15632 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15637 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15641 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15652 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15653 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15665 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15686 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15689 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15703 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15724 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15760〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15770 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15773 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15776 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15777 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15778 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15779 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15780 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15783 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15809 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15810 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15811 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15812 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15817 | 1：`utmResult` |
| `utmResult` | 関数 | 15822 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15829 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15853 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15865 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15899 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15912 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15920 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15962 | 1：（HTML） |

## FAVORITES

行 15974〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15977 | 9：`assignSpot`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav` ほか3 |
| `saveFavs` 📝 | 関数 | 15981 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15991 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15995 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16000 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16004 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16153 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16164〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16170 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16171 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16172 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16175 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16176 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16179 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16188 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16193 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16218 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16261 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16270 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16293 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16331 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16332 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16337 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16347 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16431 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16440 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16475 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16485 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16497 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16501〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16512 | 1：（HTML） |
| `setWindMode` | 関数 | 16521 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16528 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16536 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16544 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16552 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16561 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16590 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16648 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16655〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16658 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16661 | 1：（トップレベル） |

## LOADING OVERLAY

行 16666〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16669 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16675 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16720〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16736 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16737 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16747 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16752 | 1：（HTML） |
| `closeWxMap` | 関数 | 16756 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16759 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16765 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16773 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16789 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16799 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16808 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16823 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16833 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16862〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16865 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16868 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16889 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16899 | 1：（トップレベル） |

