# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,678行／本体の `<script>` は 2728〜14675 行
- トップレベルの宣言 841（関数 603・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：479／841（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2729：STATE（16）
- 行 2931：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3126：DATA FETCH（28）
- 行 3562：GPS（2）
- 行 3599：RENDER MASTER（40）
- 行 4052：HUD（28）
- 行 4403：ABC JUDGMENT（6）
- 行 4482：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5954：SKY COLOR HELPER（1）
- 行 5978：WEATHER EMOJI（12）
- 行 6153：PARTICLES (雨・雪エフェクト)（5）
- 行 6243：時刻選択（17）
- 行 6588：MAP — レイヤー定義（37）
- 行 6878：MAP — 本体（43）
- 行 7402：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7663：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7771：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8300：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8418：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8571：風の流れ（Particle Engine）（13）
- 行 8752：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9263：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9468：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（135）
- 行 11657：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11935：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（56）
- 行 12822：検索の履歴（選んだ地点）（8）
- 行 12950：手元の山の検索（#171・第1段階）（33）
- 行 13360：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13498：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13712：FAVORITES（7）
- 行 13902：RANKING（全国山域ランキング）（21）
- 行 14239：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14393：LOCALSTORAGE – 最終地点（2）
- 行 14404：LOADING OVERLAY（2）
- 行 14458：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14600：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2729〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2732 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2750 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2765 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2769 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2785 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2800 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2830 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2832 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2833 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2836 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2846 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2847 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2862 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2903 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2909 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2922 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2931〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2952 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2953 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2954 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2955 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2959 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2962 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 2975 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 2983 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 2989 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 2999 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3019 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3041 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3051 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3075 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3091 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3099 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3109 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3126〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3141 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3147 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3149 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3156 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3168 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3189 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3193 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3201 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3207 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3232 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3299 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3304 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3340 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3347 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3373 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3395 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3399 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3413 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3432 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3449 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3458 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3489 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3503 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3504 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3505 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3506 | 1：`processData` |
| `summitGustRange` | 関数 | 3511 | 1：`processData` |
| `processData` 📝 | 関数 | 3516 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3562〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3565 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3590 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3599〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3606 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3628 | 1：`render` |
| `FAV_STEP` | 定数 | 3635 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3637 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3638 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3651 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3652 | 1：`favCircular` |
| `favCount` | 関数 | 3653 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3654 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3656 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3662 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3672 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3681 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3687 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3694 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3696 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3711 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3715 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3716 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3722 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3734 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3739 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3750 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3755 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3762 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3772 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3784 | 0 |
| `saveHome` | 関数 | 3785 | 0 |
| `goHome` | 関数 | 3786 | 0 |
| `currentFavChip` | 関数 | 3790 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3796 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3801 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3847 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3882 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3917 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3930 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3948 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3960 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 3969 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 3981 | 1：（トップレベル） |

## HUD

行 4052〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4055 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4061 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4067 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4070 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4075 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4080 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4091 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4111 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4116 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4132 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4140 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4158 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4159 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4160 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4170 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4175 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4191 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4192 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4193 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4201 | 1：`peakAt` |
| `peakAt` | 関数 | 4202 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4216 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4244 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4288 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4304 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4383 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4396 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4397 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4403〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4408 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4409 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4411 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4417 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4424 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4468 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4482〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4488 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4489 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4490 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4491 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4492 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4494 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4503 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4504 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4508 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4513 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4522 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4523 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4529 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4530 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4538 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4539 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4540 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4541 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4542 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4543 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4544 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4552 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4555 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4558 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4560 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4733 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4734 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4735 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4747 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4748 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4749 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4750 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4751 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4754 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4772 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4784 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4796 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4805 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4824 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4839 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4948 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4959 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5084 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5143 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5161 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5165 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5166 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5168 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5171 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5175 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5178 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5191 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5205 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5220 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5263 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5277 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5291 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5294 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5295 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5296 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5297 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5299 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5308 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5349 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5358 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5365 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5530 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5575 | 1：`feelColor` |
| `feelColor` | 関数 | 5585 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5604 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5645 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5653 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5660 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5671 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5688 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5710 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5716 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5725 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5753 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5836 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5884 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5901 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5909 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5932 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5938 | 1：（HTML） |

## SKY COLOR HELPER

行 5954〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5957 | 0 |

## WEATHER EMOJI

行 5978〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 5987 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 5994 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6013 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6014 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6015 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6024 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6046 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6059 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6072 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6086 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6134 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6148 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6153〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6156 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6159 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6211 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6228 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6236 | 1：`updateParticles` |

## 時刻選択

行 6243〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6258 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6259 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6266 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6274 | 0 |
| `positionScrubLine` 📝 | 関数 | 6280 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6301 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6317 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6339 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6359 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6364 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6370 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6402 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6410 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6420 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6433 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6531 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6563 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6588〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6593 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6594 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6597 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6610 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6613 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6658 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6659 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6661 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6665 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6672 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6673 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6680 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6682 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6683 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6685 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6686 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6687 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6688 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6689 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6697 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6700 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6701 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6706 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6707 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6717 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6731 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6736 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6753 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6754 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6759 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6761 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6816 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6817 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6821 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6822 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6825 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6868 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6878〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6883 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6887 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6890 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6900 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6914 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6927 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6960 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6962 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 6977 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 6985 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 6989 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 6992 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7009 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7011 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7016 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7027 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7056 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7058 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7103 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7118 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7150 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7154 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7159 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7184 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7185 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7188 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7189 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7191 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7202 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7227 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7228 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7229 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7230 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7233 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7244 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7251 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7262 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7277 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7282 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7305 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7308 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7322 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7385 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7402〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7419 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7420 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7425 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7429 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7434 | 0 |
| `radarNowWet` | 関数 | 7473 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7481 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7494 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7503 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7535 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7545 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7552 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7581 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7582 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7583 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7584 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7618 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7619 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7630 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7631 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7632 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7633 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7647 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7663〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7678 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7679 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7680 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7681 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7684 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7688 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7689 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7690 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7692 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7698 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7726 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7771〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7786 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7794 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7798 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7800 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7801 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7803 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7804 | 1：`windBand` |
| `windBand` | 関数 | 7805 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7807 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7809 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7810 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7811 | 1：（トップレベル） |
| `windDirName` | 関数 | 7813 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7819 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7829 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7834 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7909 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7926 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7931 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 7970 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 7978 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 7997 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8017 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8034 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8086 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8100 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8101 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8102 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8104 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8105 | 1：`ensureWindField` |
| `windError` | 関数 | 8106 | 1：`ensureWindField` |
| `windClear` | 関数 | 8107 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8111 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8164 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8192 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8296 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8300〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8315 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8328 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8332 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8336 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8345 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8359 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8374 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8376 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8392 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8408 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8418〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8432 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8446 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8455 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8462 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8463 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8464 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8466 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8481 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8496 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8511 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8526 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8528 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8544 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8559 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8571〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8584 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8603 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8605 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8616 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8629 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8631 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8646 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8658 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8671 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8677 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8679 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8691 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8695 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8752〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8774 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8793 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8811 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8815 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8826 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8851 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8864 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8870 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8891 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8901 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8904 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8905 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8906 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8911 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8912 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8913 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8914 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8920 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8925 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8929 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8934 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8939 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8945 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8952 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8959 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 8968 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 8991 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9001 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9006 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9022 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9075 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9082 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9083 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9087 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9129 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9137 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9139 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9181 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9190 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9263〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9281 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9291 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9304 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9310 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9311 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9313 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9321 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9328 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9336 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9351 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9362 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9437 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9462 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9468〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9492 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9498 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9507 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9523 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9524 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9527 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9550 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9578 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9584 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9629 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9655 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9662 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9761 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9776 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9777 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 9976 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 9993 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10005 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10013 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10020 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10025 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10026 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10027 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10028 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10029 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10044 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10057 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10086 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10119 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10147 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10165 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10178 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10208 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10218 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10241 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10242 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10274 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10321 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10325 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10343 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10350 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10351 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10376 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10426 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10436 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10437 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10455 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10457 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10470 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10492 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10496 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10505 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10512 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10517 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10518 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10519 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10524 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10539 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10554 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10568 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10572 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10585 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10605 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10615 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10624 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10638 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10665 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10761 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10779 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10819 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10831 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10843 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10845 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10850 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10860 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10888 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10917 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10948 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10957 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 10967 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 10972 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 10980 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 10981 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 10987 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 10994 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11001 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11003 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11028 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11043 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11044 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11045 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11046 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11050 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11059 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11071 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11087 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11157 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11194 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11202 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11219 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11224 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11230 | 1：（HTML） |
| `stepMapTime` | 関数 | 11231 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11232 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11244 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11245 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11246 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11253 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11257 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11262 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11265 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11268 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11274 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11275 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11280 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11343 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11344 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11345 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11371 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11379 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11380 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11387 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11407 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11432 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11440 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11448 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11529 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11543 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11549 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11565 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11572 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11579 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11593 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11601 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11618 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11657〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11660 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11661 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11664 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11678 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11686 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11692 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11719 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11728 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11732 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11759 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11763 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11784 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11790 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11829 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11833 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11840 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11865 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11875 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11879 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11897 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11906 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11920 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11927 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11935〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 11960 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 11967 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 11989 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12006 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12012 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12027 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12046 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12058 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12073 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12083 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12116 | 1：`toggleOrientation` |
| `setHeading` 📝 | 関数 | 12135 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12142 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12154 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12162 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12195 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12196 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12197 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12200 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12206 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12207 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12213 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12255 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12256 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12257 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12263 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12268 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12342 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12343 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12348 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12360 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12364 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12372 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12389 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12390 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12404 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12422 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12474 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12495 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12499 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12503 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12522 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12525 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12538 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12539 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12565 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12582 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12585 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12591 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12652 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12653 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12670 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12793 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12794 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12795 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12802 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12822〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12830 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12831 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12833 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12840 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12844 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12848 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12858 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12867 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 12950〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 12958 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 12968 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 12976 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 12977 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 12987 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13002 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13017 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13024 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13028 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13034 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13045 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13064 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13092 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13099 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13109 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13114 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13121 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13124 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13132 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13138 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13147 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13162 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13167 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13178 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13184 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13194 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13211 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13247 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13257 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13273 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13274 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13350 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13351 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13360〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13365 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13370 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13375 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13379 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13390 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13391 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13403 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13424 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13427 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13441 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13462 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13498〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13508 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13511 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13514 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13515 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13516 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13517 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13518 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13521 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13547 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13548 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13549 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13550 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13555 | 1：`utmResult` |
| `utmResult` | 関数 | 13560 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13567 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13591 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13603 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13637 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13650 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13658 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13700 | 1：（HTML） |

## FAVORITES

行 13712〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13715 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13719 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13729 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13733 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13738 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13742 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13891 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13902〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13908 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13909 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13910 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13913 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13914 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13917 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13926 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13931 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 13956 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 13999 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14008 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14031 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14069 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14070 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14075 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14085 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14169 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14178 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14213 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14223 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14235 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14239〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14250 | 1：（HTML） |
| `setWindMode` | 関数 | 14259 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14266 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14274 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14282 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14290 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14299 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14328 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14386 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14393〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14396 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14399 | 1：（トップレベル） |

## LOADING OVERLAY

行 14404〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14407 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14413 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14458〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14474 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14475 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14485 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14490 | 1：（HTML） |
| `closeWxMap` | 関数 | 14494 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14497 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14503 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14511 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14527 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14537 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14546 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14561 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14571 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14600〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14603 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14606 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14627 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` | 定数 | 14637 | 1：（トップレベル） |

