# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：16,582行／本体の `<script>` は 2893〜16579 行
- トップレベルの宣言 1020（関数 732・定数と状態 288）／ブロック 39
- `code_map.md` に説明があるもの：572／1020（📝 印）
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
- 行 7199：MAP — 本体（140）
- 行 8644：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8914：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9022：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 9551：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9669：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9822：風の流れ（Particle Engine）（13）
- 行 10003：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10526：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10731：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（186）
- 行 13456：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13817：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14726：検索の履歴（選んだ地点）（8）
- 行 14854：手元の山の検索（#171・第1段階）（33）
- 行 15264：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15402：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 15616：FAVORITES（7）
- 行 15806：RANKING（全国山域ランキング）（21）
- 行 16143：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16297：LOCALSTORAGE – 最終地点（2）
- 行 16308：LOADING OVERLAY（2）
- 行 16362：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 16504：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `RRIM_SHADE` 📝 | 定数 | 6877 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6878 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6880 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6884 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6891 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6892 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6899 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6901 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6902 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6904 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6905 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6906 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6907 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6908 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6909 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6910 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6912 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6913 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6914 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6915 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6916 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6919 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6922 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6923 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6924 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6930 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6938 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6941 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6942 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6947 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6948 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6958 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6972 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6977 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6994 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6995 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7000 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7002 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7062 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7063 | 18：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか12 |
| `usableOverlays` 📝 | 関数 | 7067 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7068 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7071 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7079 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7094 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7106 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7113 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7185 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7199〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7204 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7209 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7212 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7229 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7233 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7237 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7247 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7262 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7283 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7284 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7285 | 0 |
| `DEM_SRC` 📝 | 定数 | 7288 | 3：`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7294 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7295 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7298 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7306 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7315 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7339 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7344 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7349 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7351 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7363 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7405 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7408 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7431 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7435 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7458 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7495 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7499 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7519 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7530 | 4：`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7534 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7550 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7555 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7568 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7588 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7610 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7623 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7626 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7627 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7628 | 1：`csRender1m` |
| `csStats` 📝 | 状態 | 7631 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7632 | 1：`csCompute` |
| `csPushTime` | 関数 | 7633 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7634 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7637 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csMissAny` | 関数 | 7646 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7655 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7657 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7669 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7690 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7704 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7718 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7727 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7733 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7746 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7776 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7777 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7779 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7780 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7781 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7782 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7784 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7785 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7786 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7793 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7799 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7805 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7815 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 7829 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 7842 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 7843 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 7844 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 7845 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 7854 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 7868 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 7890 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 7900 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 7904 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 7909 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 7927 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 7928 | 1：`wdPlan` |
| `wd` | 状態 | 7930 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 7932 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 7942 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 7958 | 1：`wdPlan` |
| `wdInterp` | 関数 | 7963 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 7965 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 7970 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 7976 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 7998 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8008 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8016 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8026 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8051 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8053 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8057 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8059 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8068 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8090 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8113 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8138 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8149 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8201 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8203 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8218 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8226 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8230 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8233 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8250 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8252 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8257 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8268 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8297 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8299 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8344 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8359 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8392 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8396 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8401 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8426 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8427 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8430 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8431 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8433 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8444 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8469 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8470 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8471 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8472 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8475 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8486 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8493 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8504 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8519 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8524 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8547 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8550 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8564 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8627 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8644〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8661 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8662 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8667 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8671 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8676 | 0 |
| `radarNowWet` | 関数 | 8715 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8723 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8736 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8745 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8777 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8787 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8794 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8823 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8824 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8825 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8826 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8869 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8870 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8881 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8882 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 8883 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 8884 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8898 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8914〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8929 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8930 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8931 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8932 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8935 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8939 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8940 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8941 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8943 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8949 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8977 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9022〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9037 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9045 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9049 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9051 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9052 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9054 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9055 | 1：`windBand` |
| `windBand` | 関数 | 9056 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9058 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 9060 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9061 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9062 | 1：（トップレベル） |
| `windDirName` | 関数 | 9064 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9070 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 9080 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9085 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9160 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 9177 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9182 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 9221 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9229 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9248 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9268 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9285 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9337 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9351 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9352 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9353 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 9355 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9356 | 1：`ensureWindField` |
| `windError` | 関数 | 9357 | 1：`ensureWindField` |
| `windClear` | 関数 | 9358 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9362 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 9415 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9443 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9547 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9551〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9566 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9579 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9583 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9587 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9596 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9610 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9625 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9627 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9643 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9659 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9669〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9683 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9697 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9706 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9713 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9714 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9715 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9717 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9732 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9747 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9762 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9777 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9779 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9795 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9810 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9822〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9835 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9854 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9856 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9867 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9880 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9882 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9897 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9909 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9922 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9928 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9930 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9942 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9946 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10003〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10025 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10044 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10062 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10066 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10077 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10102 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10115 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10121 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10142 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10157 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10160 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10161 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10162 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10167 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10168 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10169 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10170 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10176 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10181 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10185 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10190 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10195 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10201 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10208 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10215 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10224 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10230 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10254 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10264 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10269 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10285 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10338 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10345 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10346 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10350 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10392 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10400 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10402 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10444 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10453 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10526〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10544 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10554 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10567 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10573 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10574 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10576 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10584 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10591 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10599 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10614 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10625 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10700 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10725 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10731〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10755 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10761 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10770 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10786 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10787 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10790 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10813 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10841 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10847 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10892 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10918 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10925 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11024 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11039 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11040 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11239 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11256 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11268 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11276 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11283 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11288 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11289 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11290 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11291 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11292 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11307 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11320 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11349 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11382 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11410 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11428 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11441 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11471 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11481 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11504 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11505 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11537 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11584 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11588 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11606 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11613 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11614 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11639 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11689 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11699 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11700 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11718 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11720 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11733 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11755 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11759 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11768 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11775 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11780 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11781 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11782 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11787 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11802 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11817 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11831 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11835 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11848 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11868 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11878 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11887 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11901 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11928 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12024 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12042 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12082 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12094 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12106 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12108 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12113 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12123 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12151 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12180 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12211 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12220 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12230 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12235 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12243 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12244 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12250 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12257 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12264 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12266 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12291 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12306 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12307 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12308 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12309 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12313 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12322 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12334 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12350 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12426 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12427 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12428 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12429 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12430 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12431 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12433 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12438 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12453 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12459 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12465 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12474 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12482 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12533 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 12573 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12581 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12599 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12604 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12610 | 1：（HTML） |
| `stepMapTime` | 関数 | 12611 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12612 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12624 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12625 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12626 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12633 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12637 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12642 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12645 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12648 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12654 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12655 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12660 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12723 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12724 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12727 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12740 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12774 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12784 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12796 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12803 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12809 | 1：`blendChips` |
| `blendChips` | 関数 | 12818 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12825 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 12826 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12833 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12853 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12879 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12887 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12895 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12980 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12999 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13017 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13018 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13025 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13042 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13050 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13057 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13071 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13079 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13100 | 1：（HTML） |
| `sectionLayers` | 関数 | 13104 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13105 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13107 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13116 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13125 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13133 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13155 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13167 | 2：`loadLayerSets`、`saveLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13168 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13169 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13170 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13173 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13176 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13181 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13195 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13218 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13229 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13235 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13241 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13251 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13258 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13273 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13276 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13288 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13320 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13331 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13338 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13345 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13354 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13386 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13456〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13459 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13460 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13463 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13477 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13485 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13491 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 13518 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13527 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13531 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13558 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13562 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13583 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13589 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13628 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13632 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13639 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13664 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13674 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13678 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13703 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13704 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13705 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13709 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13713 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13723 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13730 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13752 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13759 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13766 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13779 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13788 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13802 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13809 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13817〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13842 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13849 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13871 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13888 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13894 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13909 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13928 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13940 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13955 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13965 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13998 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14021 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 14031 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14039 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 14046 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14058 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14066 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14099 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14100 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14101 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14104 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14110 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14111 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14117 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14159 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14160 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14161 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14167 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14172 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14246 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14247 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14252 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14264 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14268 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14276 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14293 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14294 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14308 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14326 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14378 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14399 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14403 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14407 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14426 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14429 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14442 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14443 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14469 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14486 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 14489 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 14495 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 14556 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 14557 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 14574 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14697 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14698 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14699 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14706 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14726〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14734 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14735 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14737 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14744 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14748 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14752 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14762 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14771 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14854〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14862 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14872 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14880 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14881 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14891 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14906 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14921 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14928 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14932 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14938 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14949 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14968 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14996 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15003 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15013 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15018 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15025 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15028 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15036 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15042 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15051 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15066 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15071 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15082 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15088 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15098 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15115 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15151 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15161 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15177 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15178 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15254 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15255 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15264〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15269 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15274 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15279 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15283 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15294 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15295 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15307 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15328 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15331 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15345 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15366 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15402〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15412 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15415 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15418 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15419 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15420 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15421 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15422 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15425 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15451 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15452 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15453 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15454 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15459 | 1：`utmResult` |
| `utmResult` | 関数 | 15464 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15471 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 15495 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 15507 | 1：`parseCoordInput` |
| `copyText` | 関数 | 15541 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 15554 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 15562 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 15604 | 1：（HTML） |

## FAVORITES

行 15616〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 15619 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 15623 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15633 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15637 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15642 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15646 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15795 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15806〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15812 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15813 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15814 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15817 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15818 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15821 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 15830 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15835 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15860 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15903 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15912 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15935 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15973 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15974 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15979 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15989 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16073 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16082 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16117 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16127 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16139 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16143〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16154 | 1：（HTML） |
| `setWindMode` | 関数 | 16163 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16170 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16178 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16186 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16194 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16203 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16232 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16290 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16297〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16300 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16303 | 1：（トップレベル） |

## LOADING OVERLAY

行 16308〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16311 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16317 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16362〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 16378 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 16379 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 16389 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 16394 | 1：（HTML） |
| `closeWxMap` | 関数 | 16398 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 16401 | 1：（HTML） |
| `setWxMapArea` | 関数 | 16407 | 1：（HTML） |
| `loadWxMapList` | 関数 | 16415 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 16431 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 16441 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 16450 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 16465 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 16475 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 16504〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 16507 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 16510 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 16531 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 16541 | 1：（トップレベル） |

