# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,468行／本体の `<script>` は 2834〜15465 行
- トップレベルの宣言 907（関数 647・定数と状態 260）／ブロック 39
- `code_map.md` に説明があるもの：507／907（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2835：STATE（16）
- 行 3037：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3232：DATA FETCH（28）
- 行 3668：GPS（2）
- 行 3705：RENDER MASTER（40）
- 行 4158：HUD（28）
- 行 4509：ABC JUDGMENT（6）
- 行 4588：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6060：SKY COLOR HELPER（1）
- 行 6084：WEATHER EMOJI（12）
- 行 6259：PARTICLES (雨・雪エフェクト)（5）
- 行 6349：時刻選択（17）
- 行 6694：MAP — レイヤー定義（46）
- 行 7046：MAP — 本体（67）
- 行 7874：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8137：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8245：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8774：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8892：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9045：風の流れ（Particle Engine）（13）
- 行 9226：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9737：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9942：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（156）
- 行 12342：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 12703：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13612：検索の履歴（選んだ地点）（8）
- 行 13740：手元の山の検索（#171・第1段階）（33）
- 行 14150：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14288：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14502：FAVORITES（7）
- 行 14692：RANKING（全国山域ランキング）（21）
- 行 15029：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15183：LOCALSTORAGE – 最終地点（2）
- 行 15194：LOADING OVERLAY（2）
- 行 15248：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 15390：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2835〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2838 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2856 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2871 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2875 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2891 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2906 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2936 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2938 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2939 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2942 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2952 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2953 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2968 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3009 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3015 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3028 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3037〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3058 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3059 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3060 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3061 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3065 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3068 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3081 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3089 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3095 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3105 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3125 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3147 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3157 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3181 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3197 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3205 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3215 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3232〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3247 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3253 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3255 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3262 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3274 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3295 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3299 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3307 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3313 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3338 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3405 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3410 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3446 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3453 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3479 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3501 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3505 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3519 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3538 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3555 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3564 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3595 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3609 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3610 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3611 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3612 | 1：`processData` |
| `summitGustRange` | 関数 | 3617 | 1：`processData` |
| `processData` 📝 | 関数 | 3622 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3668〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3671 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3696 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3705〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3712 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3734 | 1：`render` |
| `FAV_STEP` | 定数 | 3741 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3743 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3744 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3757 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3758 | 1：`favCircular` |
| `favCount` | 関数 | 3759 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3760 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3762 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3768 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3778 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3787 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3793 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3800 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3802 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3817 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3821 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3822 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3828 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3840 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3845 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3856 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3861 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3868 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3878 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3890 | 0 |
| `saveHome` | 関数 | 3891 | 0 |
| `goHome` | 関数 | 3892 | 0 |
| `currentFavChip` | 関数 | 3896 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3902 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3907 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3953 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3988 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4023 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4036 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4054 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4066 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4075 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4087 | 1：（トップレベル） |

## HUD

行 4158〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4161 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4167 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4173 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4176 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4181 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4186 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4197 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4217 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4222 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4238 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4246 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4264 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4265 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4266 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4276 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4281 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4297 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4298 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4299 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4307 | 1：`peakAt` |
| `peakAt` | 関数 | 4308 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4322 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4350 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4394 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4410 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4489 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4502 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4503 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4509〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4514 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4515 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4517 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4523 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4530 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4574 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4588〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4594 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4595 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4596 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4597 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4598 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4600 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4609 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4610 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4614 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4619 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4628 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4629 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4635 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4636 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4644 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4645 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4646 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4647 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4648 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4649 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4650 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4658 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4661 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4664 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4666 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4839 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4840 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4841 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4853 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4854 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4855 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4856 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4857 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4860 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4878 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4890 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4902 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4911 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4930 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4945 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5054 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5065 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5190 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5249 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5267 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5271 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5272 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5274 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5277 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5281 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5284 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5297 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5311 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5326 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5369 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5383 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5397 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5400 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5401 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5402 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5403 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5405 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5414 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5455 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5464 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5471 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5636 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5681 | 1：`feelColor` |
| `feelColor` | 関数 | 5691 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5710 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5751 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5759 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5766 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5777 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5794 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5816 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5822 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5831 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5859 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5942 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5990 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6007 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6015 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6038 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6044 | 1：（HTML） |

## SKY COLOR HELPER

行 6060〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6063 | 0 |

## WEATHER EMOJI

行 6084〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6093 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6100 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6119 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6120 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6121 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6130 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6152 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6165 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6178 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6192 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6240 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6254 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6259〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6262 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6265 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6317 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6334 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6342 | 1：`updateParticles` |

## 時刻選択

行 6349〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6364 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6365 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6372 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6380 | 0 |
| `positionScrubLine` 📝 | 関数 | 6386 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6407 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6423 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6445 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6465 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6470 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6476 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6508 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6516 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6526 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6539 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6637 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6669 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6694〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6699 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6700 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6703 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6716 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `TOCHIGI_CREDIT` | 定数 | 6720 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6723 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6798 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6799 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6801 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6805 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6812 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6813 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6820 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6822 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6823 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6825 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6826 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6827 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6828 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6829 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6830 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6831 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_BLEND_MODES` | 定数 | 6832 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6835 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6838 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6839 | 1：`blendOf` |
| `isBlendable` | 関数 | 6840 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6846 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6854 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6857 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6858 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6863 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6864 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6874 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6888 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6893 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6910 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6911 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6916 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6918 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6973 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6974 | 13：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか7 |
| `usableOverlays` 📝 | 関数 | 6978 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6979 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6982 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7035 | 7：`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity`、`setSatBand`、`setWindMode` ほか1 |

## MAP — 本体

行 7046〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 7051 | 26：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか20 |
| `overlayTileLayers` | 状態 | 7055 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7058 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7070 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7084 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7105 | 1：`ciFetchBlob` |
| `CI_PRM` 📝 | 定数 | 7106 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7107 | 1：`updateCiZoomNote` |
| `CI_BLOB_MAX` | 定数 | 7108 | 2：`ciDecodeMain`、`ciFetchBlob` |
| `ciStats` 📝 | 状態 | 7109 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7112 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7120 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciAcos` 📝 | 関数 | 7144 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7149 | 1：`ciRenderTile` |
| `ciMargin` 📝 | 関数 | 7154 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7156 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7168 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7208 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7240 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7244 | 1：`ciRenderTile` |
| `ciBreakWorker` 📝 | 関数 | 7264 | 1：`getCiWorker` |
| `ciTileKey` | 関数 | 7274 | 2：`ciFetchBlob`、`ciRenderTile` |
| `ciFetchBlob` 📝 | 関数 | 7275 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7296 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7308 | 1：`ciRenderTile` |
| `ciRenderTile` 📝 | 関数 | 7323 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7345 | 1：`applyOverlays` |
| `CiMapLayerClass` 📝 | 関数 | 7355 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 7377 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7385 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7431 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7433 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7448 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7456 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7460 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7463 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7480 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7482 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7487 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7498 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7527 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7529 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7574 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7589 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7622 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7626 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7631 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7656 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7657 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7660 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7661 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7663 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7674 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7699 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7700 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7701 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7702 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7705 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7716 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7723 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7734 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7749 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7754 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7777 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7780 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7794 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7857 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7874〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7891 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7892 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7897 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7901 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7906 | 0 |
| `radarNowWet` | 関数 | 7945 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7953 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7966 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7975 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8007 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8017 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8024 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8053 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8054 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8055 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8056 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8092 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8093 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8104 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8105 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8106 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8107 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8121 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8137〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8152 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8153 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8154 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8155 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8158 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8162 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8163 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8164 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8166 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8172 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8200 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8245〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8260 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8268 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8272 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8274 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8275 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8277 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8278 | 1：`windBand` |
| `windBand` | 関数 | 8279 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8281 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8283 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8284 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8285 | 1：（トップレベル） |
| `windDirName` | 関数 | 8287 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8293 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8303 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8308 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8383 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8400 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8405 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8444 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8452 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8471 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8491 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8508 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8560 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8574 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8575 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8576 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8578 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8579 | 1：`ensureWindField` |
| `windError` | 関数 | 8580 | 1：`ensureWindField` |
| `windClear` | 関数 | 8581 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8585 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8638 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8666 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8770 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8774〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8789 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8802 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8806 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8810 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8819 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8833 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8848 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8850 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8866 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8882 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8892〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8906 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8920 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8929 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8936 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8937 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8938 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8940 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8955 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8970 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8985 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9000 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9002 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9018 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9033 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9045〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9058 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9077 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 9079 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9090 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9103 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9105 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9120 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9132 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9145 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9151 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9153 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9165 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9169 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9226〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9248 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9267 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9285 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9289 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9300 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9325 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9338 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9344 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9365 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9375 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9378 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9379 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9380 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9385 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9386 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9387 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9388 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9394 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9399 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9403 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9408 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9413 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9419 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9426 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9433 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9442 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9465 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9475 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9480 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9496 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9549 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9556 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9557 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9561 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9603 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9611 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9613 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9655 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9664 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9737〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9755 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9765 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9778 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9784 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9785 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9787 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9795 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9802 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9810 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9825 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9836 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9911 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9936 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9942〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9966 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9972 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9981 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9997 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9998 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10001 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10024 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10052 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10058 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10103 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10129 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10136 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10235 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10250 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10251 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10450 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10467 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10479 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10487 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10494 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10499 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10500 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10501 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10502 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10503 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10518 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10531 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10560 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10593 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10621 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10639 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10652 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10682 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10692 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10715 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10716 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10748 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10795 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10799 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10817 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10824 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10825 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10850 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10900 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10910 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10911 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10929 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10931 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10944 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10966 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10970 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10979 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10986 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10991 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10992 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10993 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10998 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11013 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11028 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11042 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11046 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11059 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11079 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11089 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11098 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11112 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11139 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11235 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11253 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11293 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11305 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11317 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11319 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11324 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11334 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11362 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11391 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11422 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11431 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11441 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11446 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11454 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11455 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11461 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11468 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11475 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11477 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11502 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11517 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11518 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11519 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11520 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11524 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11533 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11545 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11561 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11637 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11638 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11639 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11640 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11641 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11642 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11644 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11649 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11664 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11670 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11676 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11685 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11693 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11744 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11782 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11790 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11807 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11812 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11818 | 1：（HTML） |
| `stepMapTime` | 関数 | 11819 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11820 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11832 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11833 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11834 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11841 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11845 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11850 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11853 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11856 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11862 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11863 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11868 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11931 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11932 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11935 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11948 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11982 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 11992 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12004 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12011 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12017 | 1：`blendChips` |
| `blendChips` | 関数 | 12026 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12033 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 12034 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12041 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12061 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12087 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12095 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12103 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12188 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12207 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12225 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12226 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12232 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12249 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12256 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12263 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12277 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12285 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12302 | 10：`drawPoi`、`openMap`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setSatBand` ほか4 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12342〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12345 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12346 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12349 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12363 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12371 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12377 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12404 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12413 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12417 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12444 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12448 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12469 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12475 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12514 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12518 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12525 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12550 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12560 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12564 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 12589 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 12590 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 12591 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 12595 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 12599 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 12609 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 12616 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 12638 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 12645 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 12652 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12665 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12674 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12688 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12695 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12703〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12728 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12735 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12757 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12774 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12780 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12795 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12814 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12826 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12841 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12851 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12884 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12907 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12917 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12925 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12932 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12944 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12952 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12985 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12986 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12987 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12990 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12996 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12997 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13003 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13045 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13046 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13047 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13053 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13058 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13132 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13133 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13138 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13150 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13154 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13162 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13179 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13180 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13194 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13212 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13264 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13285 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13289 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 13293 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 13312 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 13315 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 13328 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 13329 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 13355 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 13372 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 13375 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 13381 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13442 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13443 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13460 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13583 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13584 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13585 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13592 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13612〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13620 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13621 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13623 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13630 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13634 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13638 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13648 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13657 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13740〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13748 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13758 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13766 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13767 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13777 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13792 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13807 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13814 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13818 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13824 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13835 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13854 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13882 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13889 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13899 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13904 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13911 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13914 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13922 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13928 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13937 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13952 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13957 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13968 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13974 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13984 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14001 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14037 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14047 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14063 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14064 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14140 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14141 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14150〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14155 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14160 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14165 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14169 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14180 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14181 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14193 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14214 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14217 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14231 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14252 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14288〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 14298 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 14301 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 14304 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 14305 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 14306 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 14307 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 14308 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 14311 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 14337 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 14338 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 14339 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 14340 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 14345 | 1：`utmResult` |
| `utmResult` | 関数 | 14350 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 14357 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 14381 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 14393 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14427 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14440 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14448 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14490 | 1：（HTML） |

## FAVORITES

行 14502〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14505 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14509 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 14519 | 1：（HTML） |
| `openFav` 📝 | 関数 | 14523 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 14528 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 14532 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14681 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14692〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14698 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14699 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14700 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14703 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14704 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14707 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14716 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14721 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14746 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14789 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14798 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14821 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14859 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14860 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14865 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14875 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14959 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14968 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15003 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15013 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15025 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15029〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15040 | 1：（HTML） |
| `setWindMode` | 関数 | 15049 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15056 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15064 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15072 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15080 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15089 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15118 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15176 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15183〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15186 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15189 | 1：（トップレベル） |

## LOADING OVERLAY

行 15194〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15197 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15203 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15248〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15264 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15265 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15275 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15280 | 1：（HTML） |
| `closeWxMap` | 関数 | 15284 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15287 | 1：（HTML） |
| `setWxMapArea` | 関数 | 15293 | 1：（HTML） |
| `loadWxMapList` | 関数 | 15301 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 15317 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 15327 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 15336 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 15351 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 15361 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 15390〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 15393 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 15396 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15417 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`loadOutlook`、`poiTypeChips`、`renderLayerPanel` ほか3 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15427 | 1：（トップレベル） |

