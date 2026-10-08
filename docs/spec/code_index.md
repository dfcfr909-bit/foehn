# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,736行／本体の `<script>` は 2761〜14733 行
- トップレベルの宣言 843（関数 605・定数と状態 238）／ブロック 39
- `code_map.md` に説明があるもの：480／843（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2762：STATE（16）
- 行 2964：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3159：DATA FETCH（28）
- 行 3595：GPS（2）
- 行 3632：RENDER MASTER（40）
- 行 4085：HUD（28）
- 行 4436：ABC JUDGMENT（6）
- 行 4515：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 5987：SKY COLOR HELPER（1）
- 行 6011：WEATHER EMOJI（12）
- 行 6186：PARTICLES (雨・雪エフェクト)（5）
- 行 6276：時刻選択（17）
- 行 6621：MAP — レイヤー定義（37）
- 行 6911：MAP — 本体（43）
- 行 7435：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7696：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7804：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8333：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8451：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8604：風の流れ（Particle Engine）（13）
- 行 8785：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9296：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9501：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（137）
- 行 11715：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 11993：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（56）
- 行 12880：検索の履歴（選んだ地点）（8）
- 行 13008：手元の山の検索（#171・第1段階）（33）
- 行 13418：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13556：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13770：FAVORITES（7）
- 行 13960：RANKING（全国山域ランキング）（21）
- 行 14297：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14451：LOCALSTORAGE – 最終地点（2）
- 行 14462：LOADING OVERLAY（2）
- 行 14516：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14658：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2762〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2765 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2783 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2798 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2802 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2818 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2833 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2863 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2865 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2866 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2869 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2879 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2880 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2895 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2936 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2942 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 2955 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 2964〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 2985 | 1：`wxDb` |
| `WX_STORE` | 定数 | 2986 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 2987 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 2988 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 2992 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 2995 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3008 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3016 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3022 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3032 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3052 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3074 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3084 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3108 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3124 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3132 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3142 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3159〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3174 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3180 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3182 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3189 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3201 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3222 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3226 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3234 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3240 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3265 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3332 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3337 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3373 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3380 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3406 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3428 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3432 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3446 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3465 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3482 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3491 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3522 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3536 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3537 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3538 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3539 | 1：`processData` |
| `summitGustRange` | 関数 | 3544 | 1：`processData` |
| `processData` 📝 | 関数 | 3549 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3595〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3598 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3623 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3632〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3639 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3661 | 1：`render` |
| `FAV_STEP` | 定数 | 3668 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3670 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3671 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3684 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3685 | 1：`favCircular` |
| `favCount` | 関数 | 3686 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3687 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3689 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3695 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3705 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3714 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3720 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3727 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3729 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3744 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3748 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3749 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3755 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3767 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3772 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3783 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3788 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3795 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3805 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3817 | 0 |
| `saveHome` | 関数 | 3818 | 0 |
| `goHome` | 関数 | 3819 | 0 |
| `currentFavChip` | 関数 | 3823 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3829 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3834 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3880 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3915 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 3950 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 3963 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 3981 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 3993 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4002 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4014 | 1：（トップレベル） |

## HUD

行 4085〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4088 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4094 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4100 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4103 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4108 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4113 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4124 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4144 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4149 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4165 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4173 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4191 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4192 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4193 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4203 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4208 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4224 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4225 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4226 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4234 | 1：`peakAt` |
| `peakAt` | 関数 | 4235 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4249 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4277 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4321 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4337 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4416 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4429 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4430 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4436〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4441 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4442 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4444 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4450 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4457 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4501 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4515〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4521 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4522 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4523 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4524 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4525 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4527 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4536 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4537 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4541 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4546 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4555 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4556 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4562 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4563 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4571 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4572 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4573 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4574 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4575 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4576 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4577 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4585 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4588 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4591 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4593 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4766 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4767 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4768 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4780 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4781 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4782 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4783 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4784 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4787 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4805 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4817 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4829 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4838 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4857 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4872 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 4981 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 4992 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5117 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5176 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5194 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5198 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5199 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5201 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5204 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5208 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5211 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5224 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5238 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5253 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5296 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5310 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5324 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5327 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5328 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5329 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5330 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5332 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5341 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5382 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5391 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5398 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5563 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5608 | 1：`feelColor` |
| `feelColor` | 関数 | 5618 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5637 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5678 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5686 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5693 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5704 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5721 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5743 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5749 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5758 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5786 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5869 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5917 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5934 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5942 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 5965 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 5971 | 1：（HTML） |

## SKY COLOR HELPER

行 5987〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 5990 | 0 |

## WEATHER EMOJI

行 6011〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6020 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6027 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6046 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6047 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6048 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6057 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6079 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6092 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6105 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6119 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6167 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6181 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6186〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6189 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6192 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6244 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6261 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6269 | 1：`updateParticles` |

## 時刻選択

行 6276〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6291 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6292 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6299 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6307 | 0 |
| `positionScrubLine` 📝 | 関数 | 6313 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6334 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6350 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6372 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6392 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6397 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6403 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6435 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6443 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6453 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6466 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6564 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6596 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6621〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6626 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6627 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6630 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6643 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6646 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6691 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6692 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6694 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6698 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6705 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6706 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6713 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6715 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6716 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6718 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6719 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6720 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6721 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6722 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6730 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6733 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6734 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6739 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6740 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6750 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6764 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6769 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6786 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6787 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6792 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6794 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6849 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6850 | 11：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか5 |
| `usableOverlays` 📝 | 関数 | 6854 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6855 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6858 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6901 | 6：`setAmedasElement`、`setMapBase`、`setOverlayOpacity`、`setSatBand`、`setWindMode`、`toggleOverlay` |

## MAP — 本体

行 6911〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6916 | 22：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`drawAmedas`、`ensureWindField` ほか16 |
| `overlayTileLayers` | 状態 | 6920 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6923 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 6933 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 6947 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 6960 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 6993 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 6995 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7010 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7018 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7022 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7025 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7042 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7044 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7049 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7060 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7089 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7091 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7136 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7151 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7183 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7187 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7192 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7217 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7218 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7221 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7222 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7224 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7235 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7260 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7261 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7262 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7263 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7266 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7277 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7284 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7295 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7310 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7315 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7338 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7341 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7355 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7418 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7435〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7452 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7453 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7458 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7462 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7467 | 0 |
| `radarNowWet` | 関数 | 7506 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7514 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7527 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7536 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7568 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7578 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7585 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7614 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7615 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7616 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7617 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7651 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7652 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7663 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7664 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7665 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7666 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7680 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7696〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7711 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7712 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7713 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7714 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7717 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7721 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7722 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7723 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7725 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7731 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7759 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7804〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7819 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7827 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7831 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7833 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7834 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7836 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7837 | 1：`windBand` |
| `windBand` | 関数 | 7838 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7840 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7842 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7843 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7844 | 1：（トップレベル） |
| `windDirName` | 関数 | 7846 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7852 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7862 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7867 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 7942 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 7959 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 7964 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8003 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8011 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8030 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8050 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8067 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8119 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8133 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8134 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8135 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8137 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8138 | 1：`ensureWindField` |
| `windError` | 関数 | 8139 | 1：`ensureWindField` |
| `windClear` | 関数 | 8140 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8144 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8197 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8225 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8329 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8333〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8348 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8361 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8365 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8369 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8378 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8392 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8407 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8409 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8425 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8441 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8451〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8465 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8479 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8488 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8495 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8496 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8497 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8499 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8514 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8529 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8544 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8559 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8561 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8577 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8592 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8604〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8617 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8636 | 17：`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs`、`pauseWindFlow` ほか11 |
| `windFlowCanvas` | 関数 | 8638 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8649 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8662 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8664 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8679 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8691 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8704 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8710 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8712 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8724 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8728 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8785〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8807 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8826 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8844 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8848 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8859 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8884 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8897 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8903 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 8924 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 8934 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 8937 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 8938 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 8939 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 8944 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 8945 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 8946 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 8947 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 8953 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 8958 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 8962 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 8967 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 8972 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 8978 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 8985 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 8992 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9001 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9024 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9034 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9039 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9055 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9108 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9115 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9116 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9120 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9162 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9170 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9172 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9214 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9223 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9296〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9314 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9324 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9337 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9343 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9344 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9346 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9354 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9361 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9369 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9384 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9395 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9470 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9495 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9501〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9525 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9531 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9540 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9556 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9557 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9560 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9583 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9611 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9617 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9662 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9688 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9695 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9794 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9809 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9810 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10009 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10026 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10038 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10046 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10053 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10058 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10059 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10060 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10061 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10062 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10077 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10090 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10119 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10152 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10180 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10198 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10211 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10241 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10251 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10274 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10275 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10307 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10354 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10358 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10376 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10383 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10384 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10409 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10459 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10469 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10470 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10488 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10490 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10503 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10525 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10529 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10538 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10545 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10550 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10551 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10552 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10557 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10572 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10587 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10601 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10605 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10618 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10638 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10648 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10657 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10671 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10698 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10794 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10812 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10852 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10864 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10876 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10878 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10883 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10893 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 10921 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 10950 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 10981 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 10990 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11000 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11005 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11013 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11014 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11020 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11027 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11034 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11036 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11061 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11076 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11077 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11078 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11079 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11083 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11092 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11104 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11120 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11190 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11227 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11235 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11252 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11257 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11263 | 1：（HTML） |
| `stepMapTime` | 関数 | 11264 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11265 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11277 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11278 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11279 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11286 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11290 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11295 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11298 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11301 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11307 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11308 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11313 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11376 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11377 | 1：`updateMapAttribution` |
| `updateMapAttribution` 📝 | 関数 | 11378 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11404 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11412 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11413 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11420 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11440 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11465 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11473 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11481 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11563 | 1：（HTML） |
| `setMapDeclutter` | 関数 | 11582 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` | 関数 | 11600 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11601 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11607 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11623 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11630 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11637 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11651 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11659 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11676 | 7：`openMap`、`setAmedasElement`、`setMapBase`、`setSatBand`、`setWindMode`、`toggleLayerPanel` ほか1 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11715〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11718 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11719 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11722 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11736 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11744 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11750 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11777 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11786 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11790 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11817 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11821 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11842 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11848 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 11887 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 11891 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 11898 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 11923 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 11933 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 11937 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 11955 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 11964 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 11978 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 11985 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 11993〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12018 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12025 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12047 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12064 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12070 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12085 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12104 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12116 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12131 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12141 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12174 | 1：`toggleOrientation` |
| `setHeading` 📝 | 関数 | 12193 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12200 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12212 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12220 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12253 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12254 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12255 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12258 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12264 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12265 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12271 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12313 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12314 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12315 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12321 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12326 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12400 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12401 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12406 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12418 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12422 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12430 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12447 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12448 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12462 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12480 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12532 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12553 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12557 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12561 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12580 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12583 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12596 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12597 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12623 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12640 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12643 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12649 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12710 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12711 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12728 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 12851 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 12852 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 12853 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 12860 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 12880〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 12888 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 12889 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 12891 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 12898 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 12902 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 12906 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 12916 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 12925 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13008〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13016 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13026 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13034 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13035 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13045 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13060 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13075 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13082 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13086 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13092 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13103 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13122 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13150 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13157 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13167 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13172 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13179 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13182 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13190 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13196 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13205 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13220 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13225 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13236 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13242 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13252 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13269 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13305 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13315 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13331 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13332 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13408 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13409 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13418〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13423 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13428 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13433 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13437 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13448 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13449 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13461 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13482 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13485 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13499 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13520 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13556〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13566 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13569 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13572 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13573 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13574 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13575 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13576 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13579 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13605 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13606 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13607 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13608 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13613 | 1：`utmResult` |
| `utmResult` | 関数 | 13618 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13625 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13649 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13661 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13695 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13708 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13716 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13758 | 1：（HTML） |

## FAVORITES

行 13770〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13773 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13777 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13787 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13791 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13796 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13800 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 13949 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 13960〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 13966 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 13967 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 13968 | 1：`openRank` |
| `rankFetchCache` | 状態 | 13971 | 1：`fetchRankData` |
| `rankDates` | 状態 | 13972 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 13975 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 13984 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 13989 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14014 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14057 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14066 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14089 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14127 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14128 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14133 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14143 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14227 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14236 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14271 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14281 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14293 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14297〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14308 | 1：（HTML） |
| `setWindMode` | 関数 | 14317 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14324 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14332 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14340 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14348 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14357 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14386 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14444 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14451〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14454 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14457 | 1：（トップレベル） |

## LOADING OVERLAY

行 14462〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14465 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14471 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14516〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14532 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14533 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14543 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14548 | 1：（HTML） |
| `closeWxMap` | 関数 | 14552 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14555 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14561 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14569 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14585 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14595 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14604 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14619 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14629 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14658〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14661 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14664 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14685 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14695 | 1：（トップレベル） |

