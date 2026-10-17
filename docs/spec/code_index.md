# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,622行／本体の `<script>` は 2893〜16619 行
- トップレベルの宣言 1023（関数 733・定数と状態 290）／ブロック 39
- `code_map.md` に説明があるもの：572／1023（📝 印）
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
- 行 6758：MAP — レイヤー定義（55）
- 行 7209：MAP — 本体（140）
- 行 8658：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8928：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9036：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9565：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9683：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9836：風の流れ（Particle Engine）（13）
- 行 10017：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10540：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10745：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13496：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13857：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14766：検索の履歴（選んだ地点）（8）
- 行 14894：手元の山の検索（#171・第1段階）（33）
- 行 15304：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15442：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15656：FAVORITES（7）
- 行 15846：RANKING（全国山域ランキング）（21）
- 行 16183：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16337：LOCALSTORAGE – 最終地点（2）
- 行 16348：LOADING OVERLAY（2）
- 行 16402：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16544：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `RRIM_SHADE` 📝 | 定数 | 6878 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6879 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6881 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6885 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6892 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6893 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6900 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6902 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6903 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6905 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6906 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 6907 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6908 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6909 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6910 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6911 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6912 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6914 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6915 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6916 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6917 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6918 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6921 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6924 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6925 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6926 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6932 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6940 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6943 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6944 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6949 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6950 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6960 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6974 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6979 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6996 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6997 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7002 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7004 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7064 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7065 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7069 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7070 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7073 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7081 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7096 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7108 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7115 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7195 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7209〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7214 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7219 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7222 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7239 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7243 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7247 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7257 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7272 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7293 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7294 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7295 | 0 |
| `DEM_SRC` 📝 | 定数 | 7298 | 3：`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7304 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7305 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7308 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7316 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7325 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7349 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7354 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7359 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7361 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7373 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7415 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7418 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7442 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7446 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7469 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7506 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7510 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7530 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7541 | 4：`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7545 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7561 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7566 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7579 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7599 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7621 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7635 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7639 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7640 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7641 | 1：`csRender1m` |
| `csStats` 📝 | 状態 | 7644 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7645 | 1：`csCompute` |
| `csPushTime` | 関数 | 7646 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7647 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7650 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csMissAny` | 関数 | 7659 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7668 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7670 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7682 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7703 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7717 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7731 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7740 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7746 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7759 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7789 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7790 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7792 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7793 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7794 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7795 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7797 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7798 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7799 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7806 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7812 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7818 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7828 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7842 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7855 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7856 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7857 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7858 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7867 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7881 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7903 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7913 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7917 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 7922 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 7940 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 7941 | 1：`wdPlan` |
| `wd` | 状態 | 7943 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 7945 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 7955 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 7971 | 1：`wdPlan` |
| `wdInterp` | 関数 | 7976 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 7978 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 7983 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 7989 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8011 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8021 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8029 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8039 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8064 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8066 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8070 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8072 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8081 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8103 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8126 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8151 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8162 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8215 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8217 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8232 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8240 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8244 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8247 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8264 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8266 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8271 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8282 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8311 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8313 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8358 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8373 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8406 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8410 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8415 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8440 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8441 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8444 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8445 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8447 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8458 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8483 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8484 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8485 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8486 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8489 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8500 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8507 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8518 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8533 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8538 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8561 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8564 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8578 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8641 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8658〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8675 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8676 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8681 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8685 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8690 | 0 |
| `radarNowWet` | 関数 | 8729 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8737 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8750 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8759 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8791 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8801 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8808 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8837 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8838 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8839 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8840 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8883 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8884 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8895 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8896 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8897 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8898 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8912 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8928〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8943 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8944 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8945 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8946 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8949 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8953 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8954 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8955 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8957 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8963 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8991 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9036〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9051 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9059 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9063 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9065 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9066 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9068 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9069 | 1：`windBand` |
| `windBand` | 関数 | 9070 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9072 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9074 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9075 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9076 | 1：（トップレベル） |
| `windDirName` | 関数 | 9078 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9084 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9094 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9099 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9174 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9191 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9196 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9235 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9243 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9262 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9282 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9299 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9351 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9365 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9366 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9367 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9369 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9370 | 1：`ensureWindField` |
| `windError` | 関数 | 9371 | 1：`ensureWindField` |
| `windClear` | 関数 | 9372 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9376 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9429 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9457 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9561 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9565〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9580 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9593 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9597 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9601 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9610 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9624 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9639 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9641 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9657 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9673 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9683〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9697 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9711 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9720 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9727 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9728 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9729 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9731 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9746 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9761 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9776 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9791 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9793 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9809 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9824 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9836〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9849 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9868 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9870 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9881 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9894 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9896 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9911 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9923 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9936 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9942 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9944 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9956 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9960 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10017〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10039 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10058 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10076 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10080 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10091 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10116 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10129 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10135 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10156 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10171 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10174 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10175 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10176 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10181 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10182 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10183 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10184 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10190 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10195 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10199 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10204 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10209 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10215 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10222 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10229 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10238 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10244 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10268 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10278 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10283 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10299 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10352 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10359 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10360 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10364 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10406 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10414 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10416 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10458 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10467 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10540〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10558 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10568 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10581 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10587 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10588 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10590 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10598 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10605 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10613 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10628 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10639 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10714 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10739 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10745〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10769 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10775 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10784 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10800 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10801 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10804 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10827 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10855 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10861 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10906 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10932 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10939 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11038 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11053 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11054 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11253 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11270 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11282 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11290 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11297 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11302 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11303 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11304 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11305 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11306 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11321 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11334 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11363 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11396 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11424 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11442 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11455 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11485 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11495 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11518 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11519 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11551 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11598 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11602 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11620 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11627 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11628 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11653 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11703 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11713 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11714 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11732 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11734 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11747 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11769 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11773 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11782 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11789 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11794 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11795 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11796 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11801 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11816 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11831 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11845 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11849 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11862 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11882 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11892 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11901 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11915 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11942 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12038 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12056 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12096 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12108 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12120 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12122 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12127 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12137 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12165 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12194 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12225 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12234 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12244 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12249 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12257 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12258 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12264 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12271 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12278 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12280 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12305 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12320 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12321 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12322 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12323 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12327 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12336 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12348 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12364 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12440 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12441 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12442 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12443 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12444 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12445 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12447 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12452 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12467 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12473 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12479 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12488 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12496 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12547 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12587 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12595 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12613 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12618 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12624 | 1：（HTML） |
| `stepMapTime` | 関数 | 12625 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12626 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12638 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12639 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12640 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12647 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12651 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12656 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12659 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12662 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12668 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12669 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12674 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12737 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12738 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12741 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12754 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12788 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12798 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12810 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12817 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12823 | 1：`blendChips` |
| `blendChips` | 関数 | 12832 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12839 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12840 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12847 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 12868 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 12873 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12901 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12909 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12917 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13002 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13021 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13039 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13040 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13047 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13064 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13072 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13079 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13093 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13101 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13122 | 1：（HTML） |
| `sectionLayers` | 関数 | 13126 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13127 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13129 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13138 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13147 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13155 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13177 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13189 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13190 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13191 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13192 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13193 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13196 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13199 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13204 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13218 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13241 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13252 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13275 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13281 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13291 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13298 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13313 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13316 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13328 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13360 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13371 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13378 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13385 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13394 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13426 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13496〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13499 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13500 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13503 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13517 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13525 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13531 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13558 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13567 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13571 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13598 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13602 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13623 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13629 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13668 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13672 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13679 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13704 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13714 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13718 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13743 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13744 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13745 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13749 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13753 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13763 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13770 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13792 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13799 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13806 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13819 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13828 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13842 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13849 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13857〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13882 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13889 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13911 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13928 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13934 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13949 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13968 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13980 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13995 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14005 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14038 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14061 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14071 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14079 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14086 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14098 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14106 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14139 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14140 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14141 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14144 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14150 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14151 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14157 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14199 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14200 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14201 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14207 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14212 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14286 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14287 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14292 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14304 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14308 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14316 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14333 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14334 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14348 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14366 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14418 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14439 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14443 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14447 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14466 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14469 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14482 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14483 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14509 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14526 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14529 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14535 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14596 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14597 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14614 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14737 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14738 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14739 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14746 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14766〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14774 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14775 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14777 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14784 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14788 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14792 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14802 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14811 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14894〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14902 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14912 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14920 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14921 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14931 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14946 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14961 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14968 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14972 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14978 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14989 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15008 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15036 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15043 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15053 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15058 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15065 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15068 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15076 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15082 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15091 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15106 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15111 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15122 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15128 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15138 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15155 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15191 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15201 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15217 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15218 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15294 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15295 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15304〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15309 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15314 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15319 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15323 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15334 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15335 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15347 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15368 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15371 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15385 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15406 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15442〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15452 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15455 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15458 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15459 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15460 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15461 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15462 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15465 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15491 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15492 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15493 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15494 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15499 | 1：`utmResult` |
| `utmResult` | 関数 | 15504 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15511 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15535 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15547 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15581 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15594 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15602 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15644 | 1：（HTML） |

## FAVORITES

行 15656〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15659 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15663 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15673 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15677 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15682 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15686 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15835 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15852 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15853 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15854 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15857 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15858 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15861 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 15870 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15875 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15900 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15943 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15952 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15975 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16013 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16014 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16019 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16029 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16113 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16122 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16157 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16167 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16179 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16183〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16194 | 1：（HTML） |
| `setWindMode` | 関数 | 16203 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16210 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16218 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16226 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16234 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16243 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16272 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16330 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16337〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16340 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16343 | 1：（トップレベル） |

## LOADING OVERLAY

行 16348〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16351 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16357 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16402〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16418 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16419 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16429 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16434 | 1：（HTML） |
| `closeWxMap` | 関数 | 16438 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16441 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16447 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16455 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16471 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16481 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16490 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16505 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16515 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16544〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16547 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16550 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16571 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16581 | 1：（トップレベル） |

