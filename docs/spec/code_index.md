# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,147行／本体の `<script>` は 2834〜15144 行
- トップレベルの宣言 882（関数 629・定数と状態 253）／ブロック 39
- `code_map.md` に説明があるもの：488／882（📝 印）
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
- 行 6694：MAP — レイヤー定義（45）
- 行 7029：MAP — 本体（43）
- 行 7560：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7823：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7931：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8460：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8578：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8731：風の流れ（Particle Engine）（13）
- 行 8912：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9423：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9628：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（156）
- 行 12026：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 12382：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13291：検索の履歴（選んだ地点）（8）
- 行 13419：手元の山の検索（#171・第1段階）（33）
- 行 13829：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13967：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14181：FAVORITES（7）
- 行 14371：RANKING（全国山域ランキング）（21）
- 行 14708：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14862：LOCALSTORAGE – 最終地点（2）
- 行 14873：LOADING OVERLAY（2）
- 行 14927：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 15069：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `MAP_OVERLAYS` 📝 | 定数 | 6719 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6782 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6783 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6785 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6789 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6796 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6797 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6804 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6806 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6807 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6809 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6810 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6811 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6812 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6813 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6814 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6815 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_BLEND_MODES` | 定数 | 6816 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6819 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6822 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6823 | 1：`blendOf` |
| `isBlendable` | 関数 | 6824 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6829 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6837 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6840 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6841 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6846 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6847 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6857 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6871 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6876 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6893 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6894 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6899 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6901 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6956 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6957 | 12：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか6 |
| `usableOverlays` 📝 | 関数 | 6961 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6962 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6965 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7018 | 7：`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity`、`setSatBand`、`setWindMode` ほか1 |

## MAP — 本体

行 7029〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 7034 | 25：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか19 |
| `overlayTileLayers` | 状態 | 7038 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7041 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7053 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7067 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 7080 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7117 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7119 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7134 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7142 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7146 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7149 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7166 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7168 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7173 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7184 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7213 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7215 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7260 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7275 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7308 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7312 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7317 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7342 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7343 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7346 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7347 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7349 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7360 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7385 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7386 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7387 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7388 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7391 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7402 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7409 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7420 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7435 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7440 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7463 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7466 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7480 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7543 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7560〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7577 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7578 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7583 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7587 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7592 | 0 |
| `radarNowWet` | 関数 | 7631 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7639 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7652 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7661 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7693 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7703 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7710 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7739 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7740 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7741 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7742 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7778 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7779 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7790 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 7791 | 7：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus` ほか1 |
| `clearLayerStatus` 📝 | 関数 | 7792 | 7：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `applyLayerStatus` | 関数 | 7793 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7807 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7823〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7838 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7839 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7840 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7841 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7844 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7848 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 7849 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7850 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7852 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7858 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7886 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7931〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7946 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7954 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7958 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7960 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7961 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7963 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7964 | 1：`windBand` |
| `windBand` | 関数 | 7965 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7967 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7969 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7970 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7971 | 1：（トップレベル） |
| `windDirName` | 関数 | 7973 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7979 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7989 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7994 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8069 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8086 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8091 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8130 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8138 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8157 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8177 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8194 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8246 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8260 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8261 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8262 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8264 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8265 | 1：`ensureWindField` |
| `windError` | 関数 | 8266 | 1：`ensureWindField` |
| `windClear` | 関数 | 8267 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8271 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8324 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8352 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8456 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8460〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8475 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8488 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8492 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8496 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8505 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8519 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8534 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8536 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8552 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8568 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8578〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8592 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8606 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8615 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8622 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8623 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8624 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8626 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8641 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8656 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8671 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8686 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8688 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8704 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8719 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8731〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8744 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8763 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 8765 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8776 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8789 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8791 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8806 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8818 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8831 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8837 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8839 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8851 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8855 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8912〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8934 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8953 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8971 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8975 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8986 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9011 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9024 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9030 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9051 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9061 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9064 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9065 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9066 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9071 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9072 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9073 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9074 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9080 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9085 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9089 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9094 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9099 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9105 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9112 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9119 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9128 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9151 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9161 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9166 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9182 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9235 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9242 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9243 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9247 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9289 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9297 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9299 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9341 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9350 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9423〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9441 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9451 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9464 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9470 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9471 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9473 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9481 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9488 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9496 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9511 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9522 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9597 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9622 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9628〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9652 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9658 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9667 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9683 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9684 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9687 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9710 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9738 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9744 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9789 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9815 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9822 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9921 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9936 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9937 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10136 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10153 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10165 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10173 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10180 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10185 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10186 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10187 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10188 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10189 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10204 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10217 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10246 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10279 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10307 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10325 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10338 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10368 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10378 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10401 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10402 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10434 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10481 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10485 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10503 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10510 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10511 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10536 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10586 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10596 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10597 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10615 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10617 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10630 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10652 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10656 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10665 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10672 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10677 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10678 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10679 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10684 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10699 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10714 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10728 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10732 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10745 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10765 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10775 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10784 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10798 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10825 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10921 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10939 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10979 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10991 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11003 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11005 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11010 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11020 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11048 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11077 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11108 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11117 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11127 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11132 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11140 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11141 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11147 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11154 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11161 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11163 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11188 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11203 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11204 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11205 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11206 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11210 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11219 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11231 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11247 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11323 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11324 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11325 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11326 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11327 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11328 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11330 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11335 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11350 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11356 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11362 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11371 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11379 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11430 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11468 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11476 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11493 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11498 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11504 | 1：（HTML） |
| `stepMapTime` | 関数 | 11505 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11506 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11518 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11519 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11520 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11527 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11531 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11536 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11539 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11542 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11548 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11549 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11554 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11617 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11618 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11621 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11634 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11667 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 11677 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 11689 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 11696 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 11702 | 1：`blendChips` |
| `blendChips` | 関数 | 11711 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11718 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11719 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11726 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11746 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11772 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11780 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11788 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11872 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11891 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11909 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11910 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 11916 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11933 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11940 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11947 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11961 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11969 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11986 | 10：`drawPoi`、`openMap`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setSatBand` ほか4 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12026〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12029 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12030 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12033 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12047 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12055 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12061 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12088 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12097 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12101 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12128 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12132 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12153 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12159 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12198 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12202 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12209 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12234 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12244 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12248 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 12273 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 12274 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 12275 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 12279 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 12283 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 12293 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 12300 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 12317 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 12324 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 12331 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12344 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12353 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12367 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12374 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12382〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12407 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12414 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12436 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12453 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12459 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12474 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12493 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12505 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12520 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12530 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12563 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12586 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12596 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12604 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12611 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12623 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12631 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12664 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12665 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12666 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12669 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12675 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12676 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12682 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12724 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12725 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12726 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12732 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12737 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12811 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12812 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12817 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12829 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12833 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12841 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12858 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12859 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12873 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12891 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12943 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12964 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12968 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12972 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12991 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12994 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 13007 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 13008 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 13034 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 13051 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 13054 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 13060 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13121 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13122 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13139 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13262 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13263 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13264 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13271 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13291〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13299 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13300 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13302 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13309 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13313 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13317 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13327 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13336 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13419〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13427 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13437 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13445 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13446 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13456 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13471 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13486 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13493 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13497 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13503 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13514 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13533 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13561 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13568 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13578 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13583 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13590 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13593 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13601 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13607 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13616 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13631 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13636 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13647 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13653 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13663 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13680 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13716 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13726 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13742 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13743 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13819 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13820 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13829〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13834 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13839 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13844 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13848 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13859 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13860 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13872 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13893 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13896 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13910 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13931 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13967〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13977 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13980 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13983 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13984 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13985 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13986 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13987 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13990 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 14016 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 14017 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 14018 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 14019 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 14024 | 1：`utmResult` |
| `utmResult` | 関数 | 14029 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 14036 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 14060 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 14072 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14106 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14119 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14127 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14169 | 1：（HTML） |

## FAVORITES

行 14181〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14184 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14188 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 14198 | 1：（HTML） |
| `openFav` 📝 | 関数 | 14202 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 14207 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 14211 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14360 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14371〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14377 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14378 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14379 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14382 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14383 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14386 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14395 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14400 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14425 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14468 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14477 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14500 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14538 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14539 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14544 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14554 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14638 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14647 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14682 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14692 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14704 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14719 | 1：（HTML） |
| `setWindMode` | 関数 | 14728 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14735 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14743 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14751 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14759 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14768 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14797 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14855 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14862〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14865 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14868 | 1：（トップレベル） |

## LOADING OVERLAY

行 14873〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14876 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14882 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14927〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14943 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14944 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14954 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14959 | 1：（HTML） |
| `closeWxMap` | 関数 | 14963 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14966 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14972 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14980 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14996 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 15006 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 15015 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 15030 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 15040 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 15069〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 15072 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 15075 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15096 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`loadOutlook`、`poiTypeChips`、`renderLayerPanel` ほか3 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15106 | 1：（トップレベル） |

