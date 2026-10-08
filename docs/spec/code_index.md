# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,702行／本体の `<script>` は 2740〜14699 行
- トップレベルの宣言 842（関数 604・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：480／842（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2741：STATE（16）
- 行 2943：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3138：DATA FETCH（28）
- 行 3574：GPS（2）
- 行 3611：RENDER MASTER（40）
- 行 4064：HUD（28）
- 行 4415：ABC JUDGMENT（6）
- 行 4494：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5966：SKY COLOR HELPER（1）
- 行 5990：WEATHER EMOJI（12）
- 行 6165：PARTICLES (雨・雪エフェクト)（5）
- 行 6255：時刻選択（17）
- 行 6600：MAP — レイヤー定義（37）
- 行 6890：MAP — 本体（43）
- 行 7414：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7675：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7783：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8312：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8430：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8583：風の流れ（Particle Engine）（13）
- 行 8764：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9275：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9480：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（135）
- 行 11669：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11947：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（57）
- 行 12846：検索の履歴（選んだ地点）（8）
- 行 12974：手元の山の検索（#171・第1段階）（33）
- 行 13384：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13522：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13736：FAVORITES（7）
- 行 13926：RANKING（全国山域ランキング）（21）
- 行 14263：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14417：LOCALSTORAGE – 最終地点（2）
- 行 14428：LOADING OVERLAY（2）
- 行 14482：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14624：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2741〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2744 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2762 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2777 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2781 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2797 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2812 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2842 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2844 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2845 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2848 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2858 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2859 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2874 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2915 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2921 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2934 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2943〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2964 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2965 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2966 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2967 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2971 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2974 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 2987 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 2995 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3001 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3011 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3031 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3053 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3063 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3087 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3103 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3111 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3121 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3138〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3153 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3159 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3161 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3168 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3180 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3201 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3205 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3213 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3219 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3244 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3311 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3316 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3352 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3359 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3385 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3407 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3411 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3425 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3444 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3461 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3470 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3501 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3515 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3516 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3517 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3518 | 1：`processData` |
| `summitGustRange` | 関数 | 3523 | 1：`processData` |
| `processData` 📝 | 関数 | 3528 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3574〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3577 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3602 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3611〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3618 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3640 | 1：`render` |
| `FAV_STEP` | 定数 | 3647 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3649 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3650 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3663 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3664 | 1：`favCircular` |
| `favCount` | 関数 | 3665 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3666 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3668 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3674 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3684 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3693 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3699 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3706 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3708 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3723 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3727 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3728 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3734 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3746 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3751 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3762 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3767 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3774 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3784 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3796 | 0 |
| `saveHome` | 関数 | 3797 | 0 |
| `goHome` | 関数 | 3798 | 0 |
| `currentFavChip` | 関数 | 3802 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3808 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3813 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3859 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3894 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3929 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3942 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3960 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3972 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 3981 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 3993 | 1：（トップレベル） |

## HUD

行 4064〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4067 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4073 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4079 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4082 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4087 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4092 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4103 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4123 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4128 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4144 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4152 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4170 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4171 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4172 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4182 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4187 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4203 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4204 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4205 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4213 | 1：`peakAt` |
| `peakAt` | 関数 | 4214 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4228 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4256 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4300 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4316 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4395 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4408 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4409 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4415〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4420 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4421 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4423 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4429 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4436 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4480 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4494〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4500 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4501 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4502 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4503 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4504 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4506 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4515 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4516 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4520 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4525 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4534 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4535 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4541 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4542 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4550 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4551 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4552 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4553 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4554 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4555 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4556 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4564 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4567 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4570 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4572 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4745 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4746 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4747 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4759 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4760 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4761 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4762 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4763 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4766 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4784 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4796 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4808 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4817 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4836 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4851 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4960 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4971 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5096 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5155 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5173 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5177 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5178 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5180 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5183 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5187 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5190 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5203 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5217 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5232 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5275 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5289 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5303 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5306 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5307 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5308 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5309 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5311 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5320 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5361 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5370 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5377 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5542 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5587 | 1：`feelColor` |
| `feelColor` | 関数 | 5597 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5616 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5657 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5665 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5672 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5683 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5700 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5722 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5728 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5737 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5765 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5848 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5896 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5913 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5921 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5944 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5950 | 1：（HTML） |

## SKY COLOR HELPER

行 5966〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5969 | 0 |

## WEATHER EMOJI

行 5990〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 5999 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6006 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6025 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6026 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6027 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6036 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6058 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6071 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6084 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6098 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6146 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6160 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6165〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6168 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6171 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6223 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6240 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6248 | 1：`updateParticles` |

## 時刻選択

行 6255〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6270 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6271 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6278 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6286 | 0 |
| `positionScrubLine` 📝 | 関数 | 6292 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6313 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6329 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6351 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6371 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6376 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6382 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6414 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6422 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6432 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6445 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6543 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6575 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6600〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6605 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6606 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6609 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6622 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6625 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6670 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6671 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6673 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6677 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6684 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6685 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6692 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6694 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6695 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6697 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6698 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6699 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6700 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6701 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6709 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6712 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6713 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6718 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6719 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6729 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6743 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6748 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6765 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6766 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6771 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6773 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6828 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6829 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6833 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6834 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6837 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6880 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6890〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6895 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6899 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6902 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6912 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6926 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6939 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6972 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6974 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 6989 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 6997 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7001 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7004 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7021 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7023 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7028 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7039 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7068 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7070 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7115 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7130 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7162 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7166 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7171 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7196 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7197 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7200 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7201 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7203 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7214 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7239 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7240 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7241 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7242 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7245 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7256 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7263 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7274 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7289 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7294 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7317 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7320 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7334 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7397 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7414〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7431 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7432 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7437 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7441 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7446 | 0 |
| `radarNowWet` | 関数 | 7485 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7493 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7506 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7515 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7547 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7557 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7564 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7593 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7594 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7595 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7596 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7630 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7631 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7642 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7643 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7644 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7645 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7659 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7675〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7690 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7691 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7692 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7693 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7696 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7700 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7701 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7702 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7704 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7710 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7738 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7783〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7798 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7806 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7810 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7812 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7813 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7815 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7816 | 1：`windBand` |
| `windBand` | 関数 | 7817 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7819 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7821 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7822 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7823 | 1：（トップレベル） |
| `windDirName` | 関数 | 7825 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7831 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7841 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7846 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7921 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7938 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7943 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 7982 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 7990 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8009 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8029 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8046 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8098 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8112 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8113 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8114 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8116 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8117 | 1：`ensureWindField` |
| `windError` | 関数 | 8118 | 1：`ensureWindField` |
| `windClear` | 関数 | 8119 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8123 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8176 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8204 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8308 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8312〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8327 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8340 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8344 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8348 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8357 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8371 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8386 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8388 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8404 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8420 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8430〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8444 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8458 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8467 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8474 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8475 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8476 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8478 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8493 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8508 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8523 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8538 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8540 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8556 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8571 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8583〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8596 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8615 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8617 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8628 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8641 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8643 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8658 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8670 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8683 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8689 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8691 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8703 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8707 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8764〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8786 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8805 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8823 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8827 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8838 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8863 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8876 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8882 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8903 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8913 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8916 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8917 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8918 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8923 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8924 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8925 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8926 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8932 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8937 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8941 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8946 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8951 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8957 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8964 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8971 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 8980 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9003 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9013 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9018 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9034 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9087 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9094 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9095 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9099 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9141 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9149 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9151 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9193 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9202 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9275〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9293 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9303 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9316 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9322 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9323 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9325 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9333 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9340 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9348 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9363 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9374 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9449 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9474 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9480〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9504 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9510 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9519 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9535 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9536 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9539 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9562 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9590 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9596 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9641 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9667 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9674 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9773 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9788 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9789 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 9988 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10005 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10017 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10025 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10032 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10037 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10038 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10039 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10040 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10041 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10056 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10069 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10098 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10131 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10159 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10177 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10190 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10220 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10230 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10253 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10254 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10286 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10333 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10337 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10355 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10362 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10363 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10388 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10438 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10448 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10449 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10467 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10469 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10482 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10504 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10508 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10517 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10524 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10529 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10530 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10531 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10536 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10551 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10566 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10580 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10584 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10597 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10617 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10627 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10636 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10650 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10677 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10773 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10791 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10831 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10843 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10855 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10857 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10862 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10872 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10900 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10929 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10960 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10969 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 10979 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 10984 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 10992 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 10993 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 10999 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11006 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11013 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11015 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11040 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11055 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11056 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11057 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11058 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11062 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11071 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11083 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11099 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11169 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11206 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11214 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11231 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11236 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11242 | 1：（HTML） |
| `stepMapTime` | 関数 | 11243 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11244 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11256 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11257 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11258 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11265 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11269 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11274 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11277 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11280 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11286 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11287 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11292 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11355 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11356 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11357 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11383 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11391 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11392 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11399 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11419 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11444 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11452 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11460 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11541 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11555 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11561 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11577 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11584 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11591 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11605 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11613 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11630 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11669〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11672 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11673 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11676 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11690 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11698 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11704 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11731 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11740 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11744 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11771 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11775 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11796 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11802 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11841 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11845 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11852 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11877 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11887 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11891 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11909 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11918 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11932 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11939 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11947〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 11972 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 11979 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12001 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12018 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12024 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12039 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12058 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12070 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12085 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12095 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12128 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12151 | 1：`enableHeading` |
| `setHeading` 📝 | 関数 | 12159 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12166 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12178 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12186 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12219 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12220 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12221 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12224 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12230 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12231 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12237 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12279 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12280 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12281 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12287 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12292 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12366 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12367 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12372 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12384 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12388 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12396 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12413 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12414 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12428 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12446 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12498 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12519 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12523 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12527 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12546 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12549 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12562 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12563 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12589 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12606 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12609 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12615 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12676 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12677 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12694 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12817 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12818 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12819 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12826 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12854 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12855 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12857 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12864 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12868 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12872 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12882 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12891 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 12974〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 12982 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 12992 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13000 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13001 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13011 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13026 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13041 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13048 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13052 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13058 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13069 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13088 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13116 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13123 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13133 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13138 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13145 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13148 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13156 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13162 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13171 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13186 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13191 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13202 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13208 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13218 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13235 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13271 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13281 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13297 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13298 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13374 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13375 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13384〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13389 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13394 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13399 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13403 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13414 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13415 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13427 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13448 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13451 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13465 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13486 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13522〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13532 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13535 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13538 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13539 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13540 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13541 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13542 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13545 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13571 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13572 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13573 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13574 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13579 | 1：`utmResult` |
| `utmResult` | 関数 | 13584 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13591 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13615 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13627 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13661 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13674 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13682 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13724 | 1：（HTML） |

## FAVORITES

行 13736〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13739 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13743 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13753 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13757 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13762 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13766 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13915 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13926〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13932 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13933 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13934 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13937 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13938 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13941 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13950 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13955 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 13980 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14023 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14032 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14055 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14093 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14094 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14099 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14109 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14193 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14202 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14237 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14247 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14259 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14263〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14274 | 1：（HTML） |
| `setWindMode` | 関数 | 14283 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14290 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14298 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14306 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14314 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14323 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14352 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14410 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14417〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14420 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14423 | 1：（トップレベル） |

## LOADING OVERLAY

行 14428〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14431 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14437 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14482〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14498 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14499 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14509 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14514 | 1：（HTML） |
| `closeWxMap` | 関数 | 14518 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14521 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14527 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14535 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14551 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14561 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14570 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14585 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14595 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14624〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14627 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14630 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14651 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14661 | 1：（トップレベル） |

