# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,911行／本体の `<script>` は 2908〜16908 行
- トップレベルの宣言 1041（関数 745・定数と状態 296）／ブロック 39
- `code_map.md` に説明があるもの：585／1041（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2909：STATE（16）
- 行 3111：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3315：DATA FETCH（29）
- 行 3805：GPS（2）
- 行 3842：RENDER MASTER（41）
- 行 4300：HUD（28）
- 行 4651：ABC JUDGMENT（6）
- 行 4730：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6202：SKY COLOR HELPER（1）
- 行 6226：WEATHER EMOJI（12）
- 行 6401：PARTICLES (雨・雪エフェクト)（5）
- 行 6491：時刻選択（17）
- 行 6836：MAP — レイヤー定義（55）
- 行 7287：MAP — 本体（140）
- 行 8738：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9008：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9116：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9645：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9763：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9916：風の流れ（Particle Engine）（13）
- 行 10097：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10620：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10825：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13577：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（50）
- 行 14146：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 15055：検索の履歴（選んだ地点）（8）
- 行 15183：手元の山の検索（#171・第1段階）（33）
- 行 15593：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15731：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15945：FAVORITES（7）
- 行 16135：RANKING（全国山域ランキング）（21）
- 行 16472：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16626：LOCALSTORAGE – 最終地点（2）
- 行 16637：LOADING OVERLAY（2）
- 行 16691：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16833：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2909〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2912 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2930 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2945 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2949 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2965 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2980 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3010 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3012 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3013 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 3016 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3026 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3027 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3042 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3083 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3089 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3102 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3111〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3132 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3133 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3134 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3135 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3139 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3142 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3155 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3163 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3169 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3179 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3199 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3221 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3231 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3255 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3271 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3279 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3292 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3315〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3330 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3336 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3338 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3345 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3357 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3378 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3382 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3390 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3396 | 1：`openModelSheet` |
| `WX_SOFT_MS` 📝 | 定数 | 3429 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3431 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3542 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3547 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3583 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3590 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3616 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3638 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3642 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3656 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3675 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3692 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3701 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3732 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3746 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3747 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3748 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3749 | 1：`processData` |
| `summitGustRange` | 関数 | 3754 | 1：`processData` |
| `processData` 📝 | 関数 | 3759 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3805〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3808 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3833 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3842〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3849 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3871 | 1：`render` |
| `FAV_STEP` | 定数 | 3878 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3880 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3881 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3894 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3895 | 1：`favCircular` |
| `favCount` | 関数 | 3896 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3897 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3899 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3905 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3915 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3924 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3930 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3937 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3939 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3954 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3958 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3959 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3965 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3977 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3982 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3993 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3998 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4005 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4015 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4027 | 0 |
| `saveHome` | 関数 | 4028 | 0 |
| `goHome` | 関数 | 4029 | 0 |
| `currentFavChip` | 関数 | 4033 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4039 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4044 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4090 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4125 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4160 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4173 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4191 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4203 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4215 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4217 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4229 | 1：（トップレベル） |

## HUD

行 4300〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4303 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4309 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4315 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4318 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4323 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4328 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4339 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4359 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4364 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4380 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4388 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4406 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4407 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4408 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4418 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4423 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4439 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4440 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4441 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4449 | 1：`peakAt` |
| `peakAt` | 関数 | 4450 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4464 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4492 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4536 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4552 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4631 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4644 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4645 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4651〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4656 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4657 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4659 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4665 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4672 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4716 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4730〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4736 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4737 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4738 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4739 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4740 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4742 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4751 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4752 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4756 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4761 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4770 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4771 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4777 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4778 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4786 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4787 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4788 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4789 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4790 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4791 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4792 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4800 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4803 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4806 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4808 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4981 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4982 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4983 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4995 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4996 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4997 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4998 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4999 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5002 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5020 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5032 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5044 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5053 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5072 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5087 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5196 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5207 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5332 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5391 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5409 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5413 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5414 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5416 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5419 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5423 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5426 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5439 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5453 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5468 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5511 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5525 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5539 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5542 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5543 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5544 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5545 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5547 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5556 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5597 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5606 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5613 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5778 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5823 | 1：`feelColor` |
| `feelColor` | 関数 | 5833 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5852 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5893 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5901 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5908 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5919 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5936 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5958 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5964 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5973 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6001 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6084 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6132 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6149 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6157 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6180 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6186 | 1：（HTML） |

## SKY COLOR HELPER

行 6202〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6205 | 0 |

## WEATHER EMOJI

行 6226〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6235 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6242 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6261 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6262 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6263 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6272 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6294 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6307 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6320 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6334 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6382 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6396 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6401〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6404 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6407 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6459 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6476 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6484 | 1：`updateParticles` |

## 時刻選択

行 6491〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6506 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6507 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6514 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6522 | 0 |
| `positionScrubLine` 📝 | 関数 | 6528 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6549 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6565 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6587 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6607 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6612 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6618 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6650 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6658 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6668 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6681 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6779 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6811 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6836〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6841 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6842 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6845 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6858 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6862 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6865 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6956 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6957 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6959 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6963 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6970 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6971 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6978 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6980 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6981 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6983 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6984 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 6985 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6986 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6987 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6988 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6989 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6990 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6992 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6993 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6994 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6995 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6996 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6999 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7002 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7003 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7004 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7010 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7018 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7021 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7022 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7027 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7028 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7038 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7052 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7057 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7074 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7075 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7080 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7082 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7142 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7143 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7147 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7148 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7151 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7159 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7174 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7186 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7193 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7273 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7287〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7292 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7297 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7300 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7317 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7321 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7325 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7335 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7350 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7371 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7372 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7373 | 0 |
| `DEM_SRC` 📝 | 定数 | 7376 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7382 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7383 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7386 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7394 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7403 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7427 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7432 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7437 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7439 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7451 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7493 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7496 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7520 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7524 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7547 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7584 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7588 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7608 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7619 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7623 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7639 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7644 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7657 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7677 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7699 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7713 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7717 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7718 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7719 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7722 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7723 | 1：`csCompute` |
| `csPushTime` | 関数 | 7724 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7725 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7728 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7737 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7746 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7748 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7760 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7781 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7795 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7809 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7818 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7824 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7838 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7869 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7870 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7872 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7873 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7874 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7875 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7877 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7878 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7879 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7886 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7892 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7898 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7908 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7922 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7935 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7936 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7937 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7938 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7947 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7961 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7983 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7993 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7997 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8002 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8020 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8021 | 1：`wdPlan` |
| `wd` | 状態 | 8023 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8025 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8035 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8051 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8056 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8058 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8063 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8069 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8091 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8101 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8109 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8119 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8144 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8146 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8150 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8152 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8161 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8183 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8206 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8231 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8242 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8295 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8297 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8312 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8320 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8324 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8327 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8344 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8346 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8351 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8362 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8391 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8393 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8438 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8453 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8486 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8490 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8495 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8520 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8521 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8524 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8525 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8527 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8538 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8563 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8564 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8565 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8566 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8569 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8580 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8587 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8598 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8613 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8618 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8641 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8644 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8658 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8721 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8738〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8755 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8756 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8761 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8765 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8770 | 0 |
| `radarNowWet` | 関数 | 8809 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8817 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8830 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8839 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8871 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8881 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8888 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8917 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8918 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8919 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8920 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8963 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8964 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8975 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8976 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8977 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8978 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8992 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9008〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9023 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 9024 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9025 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9026 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9029 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 9033 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9034 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9035 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9037 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9043 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9071 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9116〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9131 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9139 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9143 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9145 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9146 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9148 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9149 | 1：`windBand` |
| `windBand` | 関数 | 9150 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9152 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9154 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9155 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9156 | 1：（トップレベル） |
| `windDirName` | 関数 | 9158 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9164 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9174 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9179 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9254 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9271 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9276 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9315 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9323 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9342 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9362 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9379 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9431 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9445 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9446 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9447 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9449 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9450 | 1：`ensureWindField` |
| `windError` | 関数 | 9451 | 1：`ensureWindField` |
| `windClear` | 関数 | 9452 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9456 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9509 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9537 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9641 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9645〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9660 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9673 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9677 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9681 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9690 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9704 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9719 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9721 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9737 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9753 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9763〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9777 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9791 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9800 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9807 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9808 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9809 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9811 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9826 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9841 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9856 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9871 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9873 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9889 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9904 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9916〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9929 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9948 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9950 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9961 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9974 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9976 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9991 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10003 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10016 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10022 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10024 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10036 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10040 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10097〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10119 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10138 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10156 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10160 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10171 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10196 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10209 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10215 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10236 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10251 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10254 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10255 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10256 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10261 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10262 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10263 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10264 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10270 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10275 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10279 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10284 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10289 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10295 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10302 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10309 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10318 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10324 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10348 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10358 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10363 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10379 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10432 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10439 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10440 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10444 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10486 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10494 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10496 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10538 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10547 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10620〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10638 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10648 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10661 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10667 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10668 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10670 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10678 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10685 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10693 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10708 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10719 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10794 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10819 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10825〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10849 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10855 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10864 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10880 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10881 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10884 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10907 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10935 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10941 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10986 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11012 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11019 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11118 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11133 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11134 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11333 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11350 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11362 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11370 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11377 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11382 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11383 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11384 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11385 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11386 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11401 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11414 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11443 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11476 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11504 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11522 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11535 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11565 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11575 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11598 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11599 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11631 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11678 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11682 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11700 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11707 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11708 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11733 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11783 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11793 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11794 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11812 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11814 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11827 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11849 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11853 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11862 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11869 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11874 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11875 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11876 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11881 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11896 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11911 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11925 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11929 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11942 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11962 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11972 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11981 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11995 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12022 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12118 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12136 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12176 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12188 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12200 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12202 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12207 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12217 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12245 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12274 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12305 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12314 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12324 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12329 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12337 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12338 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12344 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12351 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12358 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12360 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12385 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12400 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12401 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12402 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12403 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12407 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12416 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12428 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12444 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12520 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12521 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12522 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12523 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12524 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12525 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12527 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12532 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12547 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12553 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12559 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12568 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12576 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12627 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12667 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12675 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12693 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12698 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12704 | 1：（HTML） |
| `stepMapTime` | 関数 | 12705 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12706 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12718 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12719 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12720 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12727 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12731 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12736 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12739 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12742 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12748 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12749 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12754 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12817 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12818 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12821 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12834 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12868 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12878 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12890 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12897 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12903 | 1：`blendChips` |
| `blendChips` | 関数 | 12912 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12919 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12920 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12927 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 12948 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 12953 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12981 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12989 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12997 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13082 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13101 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13119 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13120 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13127 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13145 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13153 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13160 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13174 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13182 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13203 | 1：（HTML） |
| `sectionLayers` | 関数 | 13207 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13208 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13210 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13219 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13228 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13236 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13258 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13270 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13271 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13272 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13273 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13274 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13277 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13280 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13285 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13299 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13322 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13333 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13356 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13362 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13372 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13379 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13394 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13397 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13409 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13441 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13452 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13459 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13466 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13475 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13507 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13577〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13580 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13581 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13584 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13598 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13606 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13612 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13639 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13648 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13652 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13679 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13683 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13704 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13710 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13749 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13753 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13760 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13786 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 13796 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 13800 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13825 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13826 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13827 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13831 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13835 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13845 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13852 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13874 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13881 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13888 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13901 | 1：（HTML） |
| `AREA_LS` | 定数 | 13916 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 13917 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 13918 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 13919 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 13921 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 13928 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 13933 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 13943 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 13958 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 13968 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 13973 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 13978 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 13983 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 13984 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 13985 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14063 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14076 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14117 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14131 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14138 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14146〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14171 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14178 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14200 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14217 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14223 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14238 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14257 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14269 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14284 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14294 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14327 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14350 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14360 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14368 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14375 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14387 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14395 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14428 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14429 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14430 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14433 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14439 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14440 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14446 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14488 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14489 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14490 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14496 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14501 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14575 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14576 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14581 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14593 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14597 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14605 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14622 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14623 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14637 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14655 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14707 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14728 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14732 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14736 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14755 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14758 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14771 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14772 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14798 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14815 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14818 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14824 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14885 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14886 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14903 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15026 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15027 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15028 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15035 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15055〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15063 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15064 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15066 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15073 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15077 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15081 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15091 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15100 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15183〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15191 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15201 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15209 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15210 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15220 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15235 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15250 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15257 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15261 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15267 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15278 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15297 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15325 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15332 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15342 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15347 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15354 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15357 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15365 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15371 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15380 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15395 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15400 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15411 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15417 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15427 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15444 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15480 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15490 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15506 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15507 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15583 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15584 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15593〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15598 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15603 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15608 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15612 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15623 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15624 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15636 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15657 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15660 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15674 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15695 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15731〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15741 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15744 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15747 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15748 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15749 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15750 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15751 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15754 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15780 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15781 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15782 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15783 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15788 | 1：`utmResult` |
| `utmResult` | 関数 | 15793 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15800 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15824 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15836 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15870 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15883 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15891 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15933 | 1：（HTML） |

## FAVORITES

行 15945〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15948 | 9：`assignSpot`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav` ほか3 |
| `saveFavs` 📝 | 関数 | 15952 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15962 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15966 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15971 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15975 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16124 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16135〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16141 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16142 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16143 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16146 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16147 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16150 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16159 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16164 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16189 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16232 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16241 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16264 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16302 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16303 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16308 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16318 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16402 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16411 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16446 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16456 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16468 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16472〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16483 | 1：（HTML） |
| `setWindMode` | 関数 | 16492 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16499 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16507 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16515 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16523 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16532 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16561 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16619 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16626〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16629 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16632 | 1：（トップレベル） |

## LOADING OVERLAY

行 16637〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16640 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16646 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16691〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16707 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16708 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16718 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16723 | 1：（HTML） |
| `closeWxMap` | 関数 | 16727 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16730 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16736 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16744 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16760 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16770 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16779 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16794 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16804 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16833〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16836 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16839 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16860 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16870 | 1：（トップレベル） |

