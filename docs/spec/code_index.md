# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,530行／本体の `<script>` は 2893〜16527 行
- トップレベルの宣言 1013（関数 728・定数と状態 285）／ブロック 39
- `code_map.md` に説明があるもの：556／1013（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2894：STATE（16）
- 行 3096：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3291：DATA FETCH（28）
- 行 3727：GPS（2）
- 行 3764：RENDER MASTER（41）
- 行 4222：HUD（28）
- 行 4573：ABC JUDGMENT（6）
- 行 4652：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6124：SKY COLOR HELPER（1）
- 行 6148：WEATHER EMOJI（12）
- 行 6323：PARTICLES (雨・雪エフェクト)（5）
- 行 6413：時刻選択（17）
- 行 6758：MAP — レイヤー定義（54）
- 行 7198：MAP — 本体（133）
- 行 8592：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8862：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8970：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9499：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9617：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9770：風の流れ（Particle Engine）（13）
- 行 9951：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10474：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10679：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（186）
- 行 13404：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13765：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14674：検索の履歴（選んだ地点）（8）
- 行 14802：手元の山の検索（#171・第1段階）（33）
- 行 15212：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15350：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15564：FAVORITES（7）
- 行 15754：RANKING（全国山域ランキング）（21）
- 行 16091：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16245：LOCALSTORAGE – 最終地点（2）
- 行 16256：LOADING OVERLAY（2）
- 行 16310：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16452：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2894〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2897 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2915 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2930 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2934 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2950 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2965 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2995 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2997 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2998 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 3001 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3011 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3012 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3027 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3068 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3074 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3087 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3096〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3117 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3118 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3119 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3120 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3124 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3127 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3140 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3148 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3154 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3164 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3184 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3206 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3216 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3240 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3256 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3264 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3274 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3291〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3306 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3312 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3314 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3321 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3333 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3354 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3358 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3366 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3372 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3397 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3464 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3469 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3505 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3512 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3538 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3560 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3564 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3578 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3597 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3614 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3623 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3654 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3668 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3669 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3670 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3671 | 1：`processData` |
| `summitGustRange` | 関数 | 3676 | 1：`processData` |
| `processData` 📝 | 関数 | 3681 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3727〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3730 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3755 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3764〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3771 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3793 | 1：`render` |
| `FAV_STEP` | 定数 | 3800 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3802 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3803 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3816 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3817 | 1：`favCircular` |
| `favCount` | 関数 | 3818 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3819 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3821 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3827 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3837 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3846 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 3852 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3859 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3861 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3876 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3880 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3881 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3887 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3899 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3904 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3915 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3920 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3927 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3937 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3949 | 0 |
| `saveHome` | 関数 | 3950 | 0 |
| `goHome` | 関数 | 3951 | 0 |
| `currentFavChip` | 関数 | 3955 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3961 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3966 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4012 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4047 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4082 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4095 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4113 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4125 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4137 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4139 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4151 | 1：（トップレベル） |

## HUD

行 4222〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4225 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4231 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4237 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4240 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4245 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4250 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4261 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4281 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4286 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4302 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4310 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4328 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4329 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4330 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4340 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4345 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4361 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4362 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4363 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4371 | 1：`peakAt` |
| `peakAt` | 関数 | 4372 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4386 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4414 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4458 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4474 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4553 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4566 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4567 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4573〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4578 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4579 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4581 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4587 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4594 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4638 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4652〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4658 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4659 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4660 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4661 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4662 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4664 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4673 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4674 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4678 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4683 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4692 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4693 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4699 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4700 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4708 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4709 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4710 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4711 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4712 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4713 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4714 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4722 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4725 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4728 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4730 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4903 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4904 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4905 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4917 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4918 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4919 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4920 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4921 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4924 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4942 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4954 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4966 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4975 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4994 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5009 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5118 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5129 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5254 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5313 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5331 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5335 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5336 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5338 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5341 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5345 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5348 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5361 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5375 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5390 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5433 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5447 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5461 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5464 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5465 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5466 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5467 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5469 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5478 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5519 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5528 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5535 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5700 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5745 | 1：`feelColor` |
| `feelColor` | 関数 | 5755 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5774 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5815 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5823 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5830 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5841 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5858 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5880 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5886 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5895 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5923 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6006 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6054 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6071 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6079 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6102 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6108 | 1：（HTML） |

## SKY COLOR HELPER

行 6124〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6127 | 0 |

## WEATHER EMOJI

行 6148〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6157 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6164 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6183 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6184 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6185 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6194 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6216 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6229 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6242 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6256 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6304 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6318 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6323〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6326 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6329 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6381 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6398 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6406 | 1：`updateParticles` |

## 時刻選択

行 6413〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6428 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6429 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6436 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6444 | 0 |
| `positionScrubLine` 📝 | 関数 | 6450 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6471 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6487 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6509 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6529 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6534 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6540 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6572 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6580 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6590 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6603 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6701 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6733 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6758〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6763 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6764 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6767 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6780 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6784 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6787 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6876 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6877 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6879 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6883 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6890 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6891 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6898 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6900 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6901 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6903 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6904 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6905 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6906 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6907 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6908 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6909 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6911 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6912 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6913 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6914 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6915 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6918 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6921 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6922 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6923 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6929 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6937 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6940 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6941 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6946 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6947 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6957 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6971 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6976 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6993 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6994 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6999 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7001 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7061 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7062 | 18：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか12 |
| `usableOverlays` 📝 | 関数 | 7066 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7067 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7070 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7078 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7093 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7105 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7112 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7184 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7198〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7203 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7208 | 6：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdSync` |
| `tileOpts` 📝 | 関数 | 7211 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7228 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7232 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7236 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7246 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7261 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7282 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7283 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7284 | 0 |
| `DEM_SRC` 📝 | 定数 | 7287 | 3：`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7292 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7293 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7296 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7304 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7313 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7337 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7342 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7347 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7349 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7361 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7403 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7405 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7427 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7431 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7454 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7490 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7494 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7514 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7525 | 3：`ciRenderTile`、`csGather`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7529 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7545 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7550 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7563 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7582 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7604 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7617 | 3：`CsLayerClass`、`csCompute`、`csCropQuarter` |
| `CS_MISS_KEY` | 定数 | 7618 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `csStats` 📝 | 状態 | 7621 | 2：`csCompute`、`csPushTime` |
| `csPushTime` | 関数 | 7622 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7623 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7626 | 2：`csRenderTile`、`sxRenderTile` |
| `csMissAny` | 関数 | 7635 | 2：`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7644 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7646 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7658 | 3：`csParent`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7678 | 1：`csRenderTile` |
| `csCropQuarter` 📝 | 関数 | 7692 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7701 | 1：`CsLayerClass` |
| `SX_PRM` | 定数 | 7730 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7731 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7733 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7734 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7735 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7736 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7738 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7739 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7740 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7747 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7753 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7759 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7769 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7783 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7796 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7797 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7798 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7799 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7808 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7822 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7844 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7854 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7858 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 7863 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` | 定数 | 7881 | 1：`wdTablesFor` |
| `WD` | 定数 | 7882 | 2：`wdPaint`、`wdPlan` |
| `wd` | 状態 | 7884 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` | 関数 | 7886 | 1：`wdLoadTable` |
| `wdLoadTable` | 関数 | 7896 | 1：`wdTablesFor` |
| `wdDirWeights` | 関数 | 7912 | 1：`wdPlan` |
| `wdInterp` | 関数 | 7917 | 1：`wdPlan` |
| `wdCell` | 関数 | 7919 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 7924 | 1：`wdPlan` |
| `wdPlan` | 関数 | 7930 | 1：`wdSync` |
| `wdPaint` | 関数 | 7952 | 1：`wdSync` |
| `wdInfoText` | 関数 | 7962 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` | 関数 | 7970 | 1：`wdSync` |
| `wdSync` | 関数 | 7980 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8004 | 2：`applyOverlays`、`wdSync` |
| `wdSetInfo` | 関数 | 8005 | 1：`wdSync` |
| `windDownSettings` | 関数 | 8007 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8016 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8038 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8061 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8086 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8097 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8149 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8151 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8166 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8174 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8178 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8181 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8198 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8200 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8205 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8216 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8245 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8247 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8292 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8307 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8340 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8344 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8349 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8374 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8375 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8378 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8379 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8381 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8392 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8417 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8418 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8419 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8420 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8423 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8434 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8441 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8452 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8467 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8472 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8495 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8498 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8512 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8575 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8592〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8609 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8610 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8615 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8619 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8624 | 0 |
| `radarNowWet` | 関数 | 8663 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8671 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8684 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8693 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8725 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8735 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8742 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8771 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8772 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8773 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8774 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8817 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8818 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8829 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8830 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8831 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8832 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8846 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8862〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8877 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8878 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8879 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8880 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8883 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8887 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8888 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8889 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8891 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8897 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8925 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8970〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8985 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8993 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8997 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8999 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9000 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9002 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9003 | 1：`windBand` |
| `windBand` | 関数 | 9004 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9006 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9008 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9009 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9010 | 1：（トップレベル） |
| `windDirName` | 関数 | 9012 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9018 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9028 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9033 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9108 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9125 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9130 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9169 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9177 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9196 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9216 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9233 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9285 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9299 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9300 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9301 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9303 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9304 | 1：`ensureWindField` |
| `windError` | 関数 | 9305 | 1：`ensureWindField` |
| `windClear` | 関数 | 9306 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9310 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9363 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9391 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9495 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9499〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9514 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9527 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9531 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9535 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9544 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9558 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9573 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9575 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9591 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9607 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9617〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9631 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9645 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9654 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9661 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9662 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9663 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9665 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9680 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9695 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9710 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9725 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9727 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9743 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9758 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9770〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9783 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9802 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9804 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9815 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9828 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9830 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9845 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9857 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9870 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9876 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9878 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9890 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9894 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9951〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9973 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9992 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10010 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10014 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10025 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10050 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10063 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10069 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10090 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10105 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10108 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10109 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10110 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10115 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10116 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10117 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10118 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10124 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10129 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10133 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10138 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10143 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10149 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10156 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10163 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10172 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10178 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10202 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10212 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10217 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10233 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10286 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10293 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10294 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10298 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10340 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10348 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10350 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10392 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10401 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10474〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10492 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10502 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10515 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10521 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10522 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10524 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10532 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10539 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10547 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10562 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10573 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10648 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10673 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10679〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10703 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10709 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10718 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10734 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10735 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10738 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10761 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10789 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10795 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10840 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10866 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10873 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10972 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10987 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10988 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11187 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11204 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11216 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11224 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11231 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11236 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11237 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11238 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11239 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11240 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11255 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11268 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11297 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11330 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11358 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11376 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11389 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11419 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11429 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11452 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11453 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11485 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11532 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11536 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11554 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11561 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11562 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11587 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11637 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11647 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11648 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11666 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11668 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11681 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11703 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11707 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11716 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11723 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11728 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11729 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11730 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11735 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11750 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11765 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11779 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11783 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11796 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11816 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11826 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11835 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11849 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11876 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11972 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11990 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12030 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12042 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12054 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12056 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12061 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12071 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12099 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12128 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12159 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12168 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12178 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12183 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12191 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12192 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12198 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12205 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12212 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12214 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12239 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12254 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12255 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12256 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12257 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12261 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12270 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12282 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12298 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12374 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12375 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12376 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12377 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12378 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12379 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12381 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12386 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12401 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12407 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12413 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12422 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12430 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12481 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12521 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12529 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12547 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12552 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12558 | 1：（HTML） |
| `stepMapTime` | 関数 | 12559 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12560 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12572 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12573 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12574 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12581 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12585 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12590 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12593 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12596 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12602 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12603 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12608 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12671 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12672 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12675 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12688 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12722 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12732 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12744 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12751 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12757 | 1：`blendChips` |
| `blendChips` | 関数 | 12766 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12773 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12774 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12781 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12801 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12827 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12835 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12843 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12928 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12947 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12965 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12966 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12973 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12990 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12998 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13005 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13019 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13027 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13048 | 1：（HTML） |
| `sectionLayers` | 関数 | 13052 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13053 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13055 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13064 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13073 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13081 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13103 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13115 | 2：`loadLayerSets`、`saveLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13116 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13117 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13118 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13121 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13124 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13129 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13143 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13166 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13177 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13183 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13189 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13199 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13206 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13221 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13224 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13236 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13268 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13279 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13286 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13293 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13302 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13334 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13404〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13407 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13408 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13411 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13425 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13433 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13439 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13466 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13475 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13479 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13506 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13510 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13531 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13537 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13576 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13580 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13587 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13612 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13622 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13626 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13651 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13652 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13653 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13657 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13661 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13671 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13678 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13700 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13707 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13714 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13727 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13736 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13750 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13757 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13765〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13790 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13797 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13819 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13836 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13842 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13857 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13876 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13888 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13903 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13913 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13946 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13969 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13979 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13987 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13994 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14006 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14014 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14047 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14048 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14049 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14052 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14058 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14059 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14065 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14107 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14108 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14109 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14115 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14120 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14194 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14195 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14200 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14212 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14216 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14224 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14241 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14242 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14256 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14274 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14326 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14347 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14351 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14355 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14374 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14377 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14390 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14391 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14417 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14434 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14437 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14443 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14504 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14505 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14522 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14645 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14646 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14647 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14654 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14674〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14682 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14683 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14685 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14692 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14696 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14700 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14710 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14719 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14802〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14810 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14820 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14828 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14829 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14839 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14854 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14869 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14876 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14880 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14886 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14897 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14916 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14944 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14951 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14961 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14966 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14973 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14976 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14984 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14990 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14999 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15014 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15019 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15030 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15036 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15046 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15063 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15099 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15109 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15125 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15126 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15202 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15203 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15212〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15217 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15222 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15227 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15231 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15242 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15243 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15255 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15276 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15279 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15293 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15314 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15350〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15360 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15363 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15366 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15367 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15368 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15369 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15370 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15373 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15399 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15400 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15401 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15402 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15407 | 1：`utmResult` |
| `utmResult` | 関数 | 15412 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15419 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15443 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15455 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15489 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15502 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15510 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15552 | 1：（HTML） |

## FAVORITES

行 15564〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15567 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15571 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15581 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15585 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15590 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15594 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15743 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15754〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15760 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15761 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15762 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15765 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15766 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15769 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 15778 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15783 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15808 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15851 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15860 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15883 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15921 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15922 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15927 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15937 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16021 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16030 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16065 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16075 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16087 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16091〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16102 | 1：（HTML） |
| `setWindMode` | 関数 | 16111 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16118 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16126 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16134 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16142 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16151 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16180 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16238 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16245〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16248 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16251 | 1：（トップレベル） |

## LOADING OVERLAY

行 16256〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16259 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16265 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16310〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16326 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16327 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16337 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16342 | 1：（HTML） |
| `closeWxMap` | 関数 | 16346 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16349 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16355 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16363 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16379 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16389 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16398 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16413 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16423 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16452〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16455 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16458 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16479 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16489 | 1：（トップレベル） |

