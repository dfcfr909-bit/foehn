# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,783行／本体の `<script>` は 2786〜14780 行
- トップレベルの宣言 845（関数 607・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：482／845（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2787：STATE（16）
- 行 2989：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3184：DATA FETCH（28）
- 行 3620：GPS（2）
- 行 3657：RENDER MASTER（40）
- 行 4110：HUD（28）
- 行 4461：ABC JUDGMENT（6）
- 行 4540：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6012：SKY COLOR HELPER（1）
- 行 6036：WEATHER EMOJI（12）
- 行 6211：PARTICLES (雨・雪エフェクト)（5）
- 行 6301：時刻選択（17）
- 行 6646：MAP — レイヤー定義（37）
- 行 6936：MAP — 本体（43）
- 行 7460：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7721：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7829：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8358：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8476：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8629：風の流れ（Particle Engine）（13）
- 行 8810：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9321：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9526：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（137）
- 行 11740：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12018：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 12927：検索の履歴（選んだ地点）（8）
- 行 13055：手元の山の検索（#171・第1段階）（33）
- 行 13465：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13603：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13817：FAVORITES（7）
- 行 14007：RANKING（全国山域ランキング）（21）
- 行 14344：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14498：LOCALSTORAGE – 最終地点（2）
- 行 14509：LOADING OVERLAY（2）
- 行 14563：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14705：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2787〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2790 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2808 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2823 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2827 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2843 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2858 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2888 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2890 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2891 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2894 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2904 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2905 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2920 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2961 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2967 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2980 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2989〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3010 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3011 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3012 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3013 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3017 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3020 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3033 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3041 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3047 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3057 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3077 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3099 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3109 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3133 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3149 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3157 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3167 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3184〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3199 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3205 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3207 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3214 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3226 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3247 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3251 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3259 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3265 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3290 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3357 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3362 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3398 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3405 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3431 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3453 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3457 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3471 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3490 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3507 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3516 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3547 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3561 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3562 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3563 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3564 | 1：`processData` |
| `summitGustRange` | 関数 | 3569 | 1：`processData` |
| `processData` 📝 | 関数 | 3574 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3620〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3623 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3648 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3657〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3664 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3686 | 1：`render` |
| `FAV_STEP` | 定数 | 3693 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3695 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3696 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3709 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3710 | 1：`favCircular` |
| `favCount` | 関数 | 3711 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3712 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3714 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3720 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3730 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3739 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3745 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3752 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3754 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3769 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3773 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3774 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3780 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3792 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3797 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3808 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3813 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3820 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3830 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3842 | 0 |
| `saveHome` | 関数 | 3843 | 0 |
| `goHome` | 関数 | 3844 | 0 |
| `currentFavChip` | 関数 | 3848 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3854 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3859 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3905 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3940 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3975 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3988 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4006 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4018 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4027 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4039 | 1：（トップレベル） |

## HUD

行 4110〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4113 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4119 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4125 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4128 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4133 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4138 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4149 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4169 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4174 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4190 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4198 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4216 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4217 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4218 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4228 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4233 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4249 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4250 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4251 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4259 | 1：`peakAt` |
| `peakAt` | 関数 | 4260 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4274 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4302 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4346 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4362 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4441 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4454 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4455 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4461〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4466 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4467 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4469 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4475 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4482 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4526 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4540〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4546 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4547 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4548 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4549 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4550 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4552 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4561 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4562 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4566 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4571 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4580 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4581 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4587 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4588 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4596 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4597 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4598 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4599 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4600 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4601 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4602 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4610 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4613 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4616 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4618 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4791 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4792 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4793 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4805 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4806 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4807 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4808 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4809 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4812 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4830 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4842 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4854 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4863 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4882 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4897 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5006 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5017 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5142 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5201 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5219 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5223 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5224 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5226 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5229 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5233 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5236 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5249 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5263 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5278 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5321 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5335 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5349 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5352 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5353 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5354 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5355 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5357 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5366 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5407 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5416 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5423 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5588 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5633 | 1：`feelColor` |
| `feelColor` | 関数 | 5643 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5662 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5703 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5711 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5718 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5729 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5746 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5768 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5774 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5783 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5811 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5894 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5942 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5959 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5967 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5990 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5996 | 1：（HTML） |

## SKY COLOR HELPER

行 6012〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6015 | 0 |

## WEATHER EMOJI

行 6036〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6045 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6052 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6071 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6072 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6073 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6082 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6104 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6117 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6130 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6144 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6192 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6206 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6211〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6214 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6217 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6269 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6286 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6294 | 1：`updateParticles` |

## 時刻選択

行 6301〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6316 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6317 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6324 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6332 | 0 |
| `positionScrubLine` 📝 | 関数 | 6338 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6359 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6375 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6397 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6417 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6422 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6428 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6460 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6468 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6478 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6491 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6589 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6621 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6646〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6651 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6652 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6655 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6668 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6671 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6716 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6717 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6719 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6723 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6730 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6731 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6738 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6740 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6741 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6743 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6744 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6745 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6746 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6747 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6755 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6758 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6759 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6764 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6765 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6775 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6789 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6794 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6811 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6812 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6817 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6819 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6874 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6875 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6879 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6880 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6883 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6926 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6936〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6941 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6945 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6948 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6958 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6972 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6985 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7018 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7020 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7035 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7043 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7047 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7050 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7067 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7069 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7074 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7085 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7114 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7116 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7161 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7176 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7208 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7212 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7217 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7242 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7243 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7246 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7247 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7249 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7260 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7285 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7286 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7287 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7288 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7291 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7302 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7309 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7320 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7335 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7340 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7363 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7366 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7380 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7443 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7460〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7477 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7478 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7483 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7487 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7492 | 0 |
| `radarNowWet` | 関数 | 7531 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7539 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7552 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7561 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7593 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7603 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7610 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7639 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7640 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7641 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7642 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7676 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7677 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7688 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7689 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7690 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7691 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7705 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7721〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7736 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7737 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7738 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7739 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7742 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7746 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7747 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7748 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7750 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7756 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7784 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7829〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7844 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7852 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7856 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7858 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7859 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7861 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7862 | 1：`windBand` |
| `windBand` | 関数 | 7863 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7865 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7867 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7868 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7869 | 1：（トップレベル） |
| `windDirName` | 関数 | 7871 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7877 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7887 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7892 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7967 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7984 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7989 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8028 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8036 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8055 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8075 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8092 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8144 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8158 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8159 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8160 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8162 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8163 | 1：`ensureWindField` |
| `windError` | 関数 | 8164 | 1：`ensureWindField` |
| `windClear` | 関数 | 8165 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8169 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8222 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8250 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8354 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8358〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8373 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8386 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8390 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8394 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8403 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8417 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8432 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8434 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8450 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8466 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8476〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8490 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8504 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8513 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8520 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8521 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8522 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8524 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8539 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8554 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8569 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8584 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8586 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8602 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8617 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8629〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8642 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8661 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8663 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8674 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8687 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8689 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8704 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8716 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8729 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8735 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8737 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8749 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8753 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8810〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8832 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8851 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8869 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8873 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8884 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8909 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8922 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8928 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8949 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8959 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8962 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8963 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8964 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8969 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8970 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8971 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8972 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8978 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8983 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8987 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8992 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8997 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9003 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9010 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9017 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9026 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9049 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9059 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9064 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9080 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9133 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9140 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9141 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9145 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9187 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9195 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9197 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9239 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9248 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9321〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9339 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9349 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9362 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9368 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9369 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9371 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9379 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9386 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9394 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9409 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9420 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9495 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9520 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9526〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9550 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9556 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9565 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9581 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9582 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9585 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9608 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9636 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9642 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9687 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9713 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9720 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9819 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9834 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9835 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10034 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10051 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10063 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10071 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10078 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10083 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10084 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10085 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10086 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10087 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10102 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10115 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10144 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10177 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10205 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10223 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10236 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10266 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10276 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10299 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10300 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10332 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10379 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10383 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10401 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10408 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10409 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10434 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10484 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10494 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10495 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10513 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10515 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10528 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10550 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10554 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10563 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10570 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10575 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10576 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10577 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10582 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10597 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10612 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10626 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10630 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10643 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10663 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10673 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10682 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10696 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10723 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10819 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10837 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10877 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10889 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10901 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10903 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10908 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10918 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10946 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10975 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11006 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11015 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11025 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11030 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11038 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11039 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11045 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11052 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11059 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11061 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11086 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11101 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11102 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11103 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11104 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11108 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11117 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11129 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11145 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11215 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11252 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11260 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11277 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11282 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11288 | 1：（HTML） |
| `stepMapTime` | 関数 | 11289 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11290 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11302 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11303 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11304 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11311 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11315 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11320 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11323 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11326 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11332 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11333 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11338 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11401 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11402 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11403 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11429 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11437 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11438 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11445 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11465 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11490 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11498 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11506 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11588 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11607 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11625 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11626 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11632 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11648 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11655 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11662 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11676 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11684 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11701 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11740〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11743 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11744 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11747 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11761 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11769 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11775 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11802 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11811 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11815 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11842 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11846 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11867 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11873 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11912 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11916 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11923 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11948 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11958 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11962 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11980 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11989 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12003 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12010 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12018〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12043 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12050 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12072 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12089 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12095 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12110 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12129 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12141 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12156 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12166 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12199 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12222 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12232 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12240 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12247 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12259 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12267 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12300 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12301 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12302 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12305 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12311 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12312 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12318 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12360 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12361 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12362 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12368 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12373 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12447 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12448 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12453 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12465 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12469 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12477 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12494 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12495 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12509 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12527 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12579 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12600 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12604 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12608 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12627 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12630 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12643 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12644 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12670 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12687 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12690 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12696 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12757 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12758 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12775 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12898 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12899 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12900 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12907 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12927〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12935 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12936 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12938 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12945 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12949 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12953 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12963 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12972 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13055〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13063 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13073 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13081 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13082 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13092 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13107 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13122 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13129 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13133 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13139 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13150 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13169 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13197 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13204 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13214 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13219 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13226 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13229 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13237 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13243 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13252 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13267 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13272 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13283 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13289 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13299 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13316 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13352 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13362 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13378 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13379 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13455 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13456 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13465〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13470 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13475 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13480 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13484 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13495 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13496 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13508 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13529 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13532 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13546 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13567 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13603〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13613 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13616 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13619 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13620 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13621 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13622 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13623 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13626 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13652 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13653 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13654 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13655 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13660 | 1：`utmResult` |
| `utmResult` | 関数 | 13665 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13672 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13696 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13708 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13742 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13755 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13763 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13805 | 1：（HTML） |

## FAVORITES

行 13817〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13820 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13824 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13834 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13838 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13843 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13847 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13996 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14007〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14013 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14014 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14015 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14018 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14019 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14022 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14031 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14036 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14061 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14104 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14113 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14136 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14174 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14175 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14180 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14190 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14274 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14283 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14318 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14328 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14340 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14344〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14355 | 1：（HTML） |
| `setWindMode` | 関数 | 14364 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14371 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14379 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14387 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14395 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14404 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14433 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14491 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14498〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14501 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14504 | 1：（トップレベル） |

## LOADING OVERLAY

行 14509〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14512 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14518 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14563〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14579 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14580 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14590 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14595 | 1：（HTML） |
| `closeWxMap` | 関数 | 14599 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14602 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14608 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14616 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14632 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14642 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14651 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14666 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14676 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14705〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14708 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14711 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14732 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14742 | 1：（トップレベル） |

