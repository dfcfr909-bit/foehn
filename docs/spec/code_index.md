# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,653行／本体の `<script>` は 2867〜15650 行
- トップレベルの宣言 923（関数 660・定数と状態 263）／ブロック 39
- `code_map.md` に説明があるもの：518／923（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2868：STATE（16）
- 行 3070：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3265：DATA FETCH（28）
- 行 3701：GPS（2）
- 行 3738：RENDER MASTER（40）
- 行 4191：HUD（28）
- 行 4542：ABC JUDGMENT（6）
- 行 4621：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6093：SKY COLOR HELPER（1）
- 行 6117：WEATHER EMOJI（12）
- 行 6292：PARTICLES (雨・雪エフェクト)（5）
- 行 6382：時刻選択（17）
- 行 6727：MAP — レイヤー定義（53）
- 行 7135：MAP — 本体（67）
- 行 7964：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8227：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8335：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8864：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8982：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9135：風の流れ（Particle Engine）（13）
- 行 9316：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 9839：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10044：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（164）
- 行 12527：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 12888：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13797：検索の履歴（選んだ地点）（8）
- 行 13925：手元の山の検索（#171・第1段階）（33）
- 行 14335：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14473：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14687：FAVORITES（7）
- 行 14877：RANKING（全国山域ランキング）（21）
- 行 15214：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15368：LOCALSTORAGE – 最終地点（2）
- 行 15379：LOADING OVERLAY（2）
- 行 15433：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 15575：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2868〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2871 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2889 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2904 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2908 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2924 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2939 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2969 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2971 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2972 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2975 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2985 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2986 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3001 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3042 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3048 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3061 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3070〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3091 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3092 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3093 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3094 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3098 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3101 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3114 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3122 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3128 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3138 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3158 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3180 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3190 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3214 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3230 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3238 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3248 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3265〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3280 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3286 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3288 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3295 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3307 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3328 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3332 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3340 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3346 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3371 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3438 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3443 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3479 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3486 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3512 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3534 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3538 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3552 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3571 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3588 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3597 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3628 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3642 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3643 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3644 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3645 | 1：`processData` |
| `summitGustRange` | 関数 | 3650 | 1：`processData` |
| `processData` 📝 | 関数 | 3655 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3701〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3704 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3729 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3738〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3745 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3767 | 1：`render` |
| `FAV_STEP` | 定数 | 3774 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3776 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3777 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3790 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3791 | 1：`favCircular` |
| `favCount` | 関数 | 3792 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3793 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3795 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3801 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3811 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3820 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3826 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3833 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3835 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3850 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3854 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3855 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3861 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3873 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3878 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3889 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3894 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3901 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3911 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3923 | 0 |
| `saveHome` | 関数 | 3924 | 0 |
| `goHome` | 関数 | 3925 | 0 |
| `currentFavChip` | 関数 | 3929 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3935 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3940 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3986 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4021 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4056 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4069 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4087 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4099 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4108 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4120 | 1：（トップレベル） |

## HUD

行 4191〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4194 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4200 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4206 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4209 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4214 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4219 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4230 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4250 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4255 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4271 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4279 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4297 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4298 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4299 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4309 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4314 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4330 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4331 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4332 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4340 | 1：`peakAt` |
| `peakAt` | 関数 | 4341 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4355 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4383 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4427 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4443 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4522 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4535 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4536 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4542〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4547 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4548 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4550 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4556 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4563 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4607 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4621〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4627 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4628 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4629 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4630 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4631 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4633 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4642 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4643 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4647 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4652 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4661 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4662 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4668 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4669 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4677 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4678 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4679 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4680 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4681 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4682 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4683 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4691 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4694 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4697 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4699 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4872 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4873 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4874 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4886 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4887 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4888 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4889 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4890 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4893 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4911 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4923 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4935 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4944 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4963 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4978 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5087 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5098 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5223 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5282 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5300 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5304 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5305 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5307 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5310 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5314 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5317 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5330 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5344 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5359 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5402 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5416 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5430 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5433 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5434 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5435 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5436 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5438 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5447 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5488 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5497 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5504 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5669 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5714 | 1：`feelColor` |
| `feelColor` | 関数 | 5724 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5743 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5784 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5792 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5799 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5810 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5827 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5849 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5855 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5864 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5892 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5975 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6023 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6040 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6048 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6071 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6077 | 1：（HTML） |

## SKY COLOR HELPER

行 6093〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6096 | 0 |

## WEATHER EMOJI

行 6117〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6126 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6133 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6152 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6153 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6154 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6163 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6185 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6198 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6211 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6225 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6273 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6287 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6292〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6295 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6298 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6350 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6367 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6375 | 1：`updateParticles` |

## 時刻選択

行 6382〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6397 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6398 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6405 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6413 | 0 |
| `positionScrubLine` 📝 | 関数 | 6419 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6440 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6456 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6478 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6498 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6503 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6509 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6541 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6549 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6559 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6572 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6670 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6702 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6727〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6732 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6733 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6736 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6749 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `TOCHIGI_CREDIT` | 定数 | 6753 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6756 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6831 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6832 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6834 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6838 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6845 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6846 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6853 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6855 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6856 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6858 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6859 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6860 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6861 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6862 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6863 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6864 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6866 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6867 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6868 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6869 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6872 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6875 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6876 | 1：`blendOf` |
| `isBlendable` | 関数 | 6877 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6883 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6891 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6894 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6895 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6900 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6901 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6911 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6925 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6930 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6947 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6948 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6953 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6955 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7010 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 7011 | 13：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか7 |
| `usableOverlays` 📝 | 関数 | 7015 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7016 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7019 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7027 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7042 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7054 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7061 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7122 | 10：`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity` ほか4 |

## MAP — 本体

行 7135〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7140 | 32：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか26 |
| `overlayTileLayers` | 状態 | 7145 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7148 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7160 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7174 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7195 | 1：`ciFetchBlob` |
| `CI_PRM` 📝 | 定数 | 7196 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7197 | 1：`updateCiZoomNote` |
| `CI_BLOB_MAX` | 定数 | 7198 | 2：`ciDecodeMain`、`ciFetchBlob` |
| `ciStats` 📝 | 状態 | 7199 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7202 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7210 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciAcos` 📝 | 関数 | 7234 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7239 | 1：`ciRenderTile` |
| `ciMargin` 📝 | 関数 | 7244 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7246 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7258 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7298 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7330 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7334 | 1：`ciRenderTile` |
| `ciBreakWorker` 📝 | 関数 | 7354 | 1：`getCiWorker` |
| `ciTileKey` | 関数 | 7364 | 2：`ciFetchBlob`、`ciRenderTile` |
| `ciFetchBlob` 📝 | 関数 | 7365 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7386 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7398 | 1：`ciRenderTile` |
| `ciRenderTile` 📝 | 関数 | 7413 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7435 | 1：`applyOverlays` |
| `CiMapLayerClass` 📝 | 関数 | 7445 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 7467 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7475 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7521 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7523 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7538 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7546 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7550 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7553 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7570 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7572 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7577 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7588 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7617 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7619 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7664 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7679 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7712 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7716 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7721 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7746 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7747 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7750 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7751 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7753 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7764 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7789 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7790 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7791 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7792 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7795 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7806 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7813 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7824 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7839 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7844 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7867 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7870 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7884 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7947 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7964〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7981 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7982 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7987 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7991 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7996 | 0 |
| `radarNowWet` | 関数 | 8035 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8043 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8056 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8065 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8097 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8107 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8114 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8143 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8144 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8145 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8146 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8182 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8183 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8194 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8195 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8196 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8197 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8211 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8227〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8242 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8243 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8244 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8245 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8248 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8252 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8253 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8254 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8256 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8262 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8290 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8335〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8350 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8358 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8362 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8364 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8365 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8367 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8368 | 1：`windBand` |
| `windBand` | 関数 | 8369 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8371 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8373 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8374 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8375 | 1：（トップレベル） |
| `windDirName` | 関数 | 8377 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8383 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8393 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8398 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8473 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8490 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8495 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8534 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8542 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8561 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8581 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8598 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8650 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8664 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8665 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8666 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8668 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8669 | 1：`ensureWindField` |
| `windError` | 関数 | 8670 | 1：`ensureWindField` |
| `windClear` | 関数 | 8671 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8675 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8728 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8756 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8860 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8864〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8879 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8892 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8896 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8900 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8909 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8923 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8938 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8940 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8956 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8972 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8982〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8996 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9010 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9019 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9026 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9027 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9028 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9030 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9045 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9060 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9075 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9090 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9092 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9108 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9123 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9135〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9148 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9167 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 9169 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9180 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9193 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9195 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9210 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9222 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9235 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9241 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9243 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9255 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9259 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9316〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9338 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9357 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9375 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9379 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9390 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9415 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9428 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9434 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9455 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9470 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9473 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9474 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9475 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9480 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9481 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9482 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9483 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9489 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9494 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9498 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9503 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9508 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9514 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9521 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9528 | 1：`windGLBgTexture` |
| `windBgFade` | 関数 | 9537 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9543 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9567 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9577 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9582 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9598 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9651 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9658 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9659 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9663 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9705 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9713 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9715 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9757 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9766 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9839〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9857 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9867 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9880 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9886 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9887 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9889 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9897 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9904 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9912 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9927 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9938 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10013 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10038 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10044〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10068 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10074 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10083 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10099 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10100 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10103 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10126 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10154 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10160 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10205 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10231 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10238 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10337 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10352 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10353 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10552 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10569 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10581 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10589 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10596 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10601 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10602 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10603 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10604 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10605 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10620 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10633 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10662 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10695 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10723 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10741 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10754 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10784 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10794 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10817 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10818 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10850 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10897 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10901 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10919 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10926 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10927 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10952 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11002 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11012 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11013 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11031 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11033 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11046 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11068 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11072 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11081 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11088 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11093 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11094 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11095 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11100 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11115 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11130 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11144 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11148 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11161 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11181 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11191 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11200 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11214 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11241 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11337 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11355 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11395 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11407 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11419 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11421 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11426 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11436 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11464 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11493 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11524 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11533 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11543 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11548 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11556 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11557 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11563 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11570 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11577 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11579 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11604 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11619 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11620 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11621 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11622 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11626 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11635 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11647 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11663 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11739 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11740 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11741 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11742 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11743 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11744 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11746 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11751 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11766 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11772 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11778 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11787 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11795 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11846 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11884 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11892 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11909 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11914 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11920 | 1：（HTML） |
| `stepMapTime` | 関数 | 11921 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11922 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11934 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11935 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11936 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11943 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11947 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11952 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11955 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11958 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11964 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11965 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11970 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12033 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12034 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12037 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12050 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12084 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12094 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12106 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12113 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12119 | 1：`blendChips` |
| `blendChips` | 関数 | 12128 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12135 | 21：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか15 |
| `overlayOpacity` 📝 | 関数 | 12136 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12143 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12163 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12189 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12197 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12205 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12290 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12309 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12327 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12328 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12335 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12352 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12360 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12367 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12381 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12389 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 12410 | 1：（HTML） |
| `sectionLayers` | 関数 | 12414 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 12415 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 12417 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 12426 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 12435 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 12443 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 12465 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12471 | 14：`drawPoi`、`moveLayer`、`openMap`、`resetLayerOrder`、`setAmedasElement`、`setMapBase` ほか8 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12527〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12530 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12531 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12534 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12548 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12556 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12562 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12589 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12598 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12602 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12629 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12633 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12654 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12660 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12699 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12703 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12710 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12735 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12745 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12749 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 12774 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 12775 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 12776 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 12780 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 12784 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 12794 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 12801 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 12823 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 12830 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 12837 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12850 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12859 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12873 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12880 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12888〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12913 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12920 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12942 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12959 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12965 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12980 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12999 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13011 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13026 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13036 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13069 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13092 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13102 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13110 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13117 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 13129 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 13137 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 13170 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 13171 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 13172 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 13175 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 13181 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 13182 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13188 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13230 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13231 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13232 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13238 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13243 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13317 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13318 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13323 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13335 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13339 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13347 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13364 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13365 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13379 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13397 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13449 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13470 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13474 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 13478 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 13497 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 13500 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 13513 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 13514 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 13540 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 13557 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 13560 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 13566 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13627 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13628 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13645 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13768 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13769 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13770 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13777 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13797〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13805 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13806 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13808 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13815 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13819 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13823 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13833 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13842 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13925〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13933 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13943 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13951 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13952 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13962 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13977 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13992 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13999 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14003 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14009 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14020 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14039 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14067 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14074 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14084 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14089 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14096 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14099 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14107 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14113 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14122 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 14137 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 14142 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 14153 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 14159 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 14169 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14186 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14222 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14232 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14248 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14249 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14325 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14326 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14335〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14340 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14345 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14350 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14354 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14365 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14366 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14378 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14399 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14402 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14416 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14437 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14473〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 14483 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 14486 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 14489 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 14490 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 14491 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 14492 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 14493 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 14496 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 14522 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 14523 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 14524 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 14525 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 14530 | 1：`utmResult` |
| `utmResult` | 関数 | 14535 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 14542 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 14566 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 14578 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14612 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14625 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14633 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14675 | 1：（HTML） |

## FAVORITES

行 14687〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14690 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14694 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 14704 | 1：（HTML） |
| `openFav` 📝 | 関数 | 14708 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 14713 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 14717 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14866 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14877〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14883 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14884 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14885 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14888 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14889 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14892 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14901 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14906 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14931 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14974 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14983 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15006 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15044 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15045 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15050 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15060 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 15144 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 15153 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15188 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15198 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15210 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15214〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15225 | 1：（HTML） |
| `setWindMode` | 関数 | 15234 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15241 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15249 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15257 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15265 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15274 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15303 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15361 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15368〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15371 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15374 | 1：（トップレベル） |

## LOADING OVERLAY

行 15379〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15382 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15388 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15433〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15449 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15450 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15460 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15465 | 1：（HTML） |
| `closeWxMap` | 関数 | 15469 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15472 | 1：（HTML） |
| `setWxMapArea` | 関数 | 15478 | 1：（HTML） |
| `loadWxMapList` | 関数 | 15486 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 15502 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 15512 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 15521 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 15536 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 15546 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 15575〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 15578 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 15581 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15602 | 10：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか4 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15612 | 1：（トップレベル） |

