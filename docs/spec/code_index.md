# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,956行／本体の `<script>` は 2889〜15953 行
- トップレベルの宣言 950（関数 681・定数と状態 269）／ブロック 39
- `code_map.md` に説明があるもの：531／950（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2890：STATE（16）
- 行 3092：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3287：DATA FETCH（28）
- 行 3723：GPS（2）
- 行 3760：RENDER MASTER（41）
- 行 4218：HUD（28）
- 行 4569：ABC JUDGMENT（6）
- 行 4648：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6120：SKY COLOR HELPER（1）
- 行 6144：WEATHER EMOJI（12）
- 行 6319：PARTICLES (雨・雪エフェクト)（5）
- 行 6409：時刻選択（17）
- 行 6754：MAP — レイヤー定義（54）
- 行 7175：MAP — 本体（70）
- 行 8028：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8291：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8399：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8928：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9046：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9199：風の流れ（Particle Engine）（13）
- 行 9380：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 9903：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10108：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（186）
- 行 12830：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 13191：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 14100：検索の履歴（選んだ地点）（8）
- 行 14228：手元の山の検索（#171・第1段階）（33）
- 行 14638：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14776：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14990：FAVORITES（7）
- 行 15180：RANKING（全国山域ランキング）（21）
- 行 15517：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15671：LOCALSTORAGE – 最終地点（2）
- 行 15682：LOADING OVERLAY（2）
- 行 15736：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 15878：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2890〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2893 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2911 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2926 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2930 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2946 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2961 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2991 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2993 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2994 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2997 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3007 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3008 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3023 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3064 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3070 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3083 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3092〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3113 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3114 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3115 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3116 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3120 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3123 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3136 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3144 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3150 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3160 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3180 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3202 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3212 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3236 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3252 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3260 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3270 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3287〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3302 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3308 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3310 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3317 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3329 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3350 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3354 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3362 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3368 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3393 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3460 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3465 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3501 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3508 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3534 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3556 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3560 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3574 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3593 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3610 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3619 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3650 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3664 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3665 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3666 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3667 | 1：`processData` |
| `summitGustRange` | 関数 | 3672 | 1：`processData` |
| `processData` 📝 | 関数 | 3677 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3723〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3726 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3751 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3760〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3767 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3789 | 1：`render` |
| `FAV_STEP` | 定数 | 3796 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3798 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3799 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3812 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3813 | 1：`favCircular` |
| `favCount` | 関数 | 3814 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3815 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3817 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3823 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3833 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3842 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3848 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3855 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3857 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3872 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3876 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3877 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3883 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3895 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3900 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3911 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3916 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3923 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3933 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3945 | 0 |
| `saveHome` | 関数 | 3946 | 0 |
| `goHome` | 関数 | 3947 | 0 |
| `currentFavChip` | 関数 | 3951 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3957 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3962 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4008 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4043 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4078 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4091 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4109 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4121 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4133 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4135 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4147 | 1：（トップレベル） |

## HUD

行 4218〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4221 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4227 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4233 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4236 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4241 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4246 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4257 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4277 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4282 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4298 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4306 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4324 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4325 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4326 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4336 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4341 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4357 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4358 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4359 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4367 | 1：`peakAt` |
| `peakAt` | 関数 | 4368 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4382 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4410 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4454 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4470 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4549 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4562 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4563 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4569〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4574 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4575 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4577 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4583 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4590 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4634 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4648〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4654 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4655 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4656 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4657 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4658 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4660 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4669 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4670 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4674 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4679 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4688 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4689 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4695 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4696 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4704 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4705 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4706 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4707 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4708 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4709 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4710 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4718 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4721 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4724 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4726 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4899 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4900 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4901 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4913 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4914 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4915 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4916 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4917 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4920 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4938 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4950 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4962 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4971 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4990 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5005 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5114 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5125 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5250 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5309 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5327 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5331 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5332 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5334 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5337 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5341 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5344 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5357 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5371 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5386 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5429 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5443 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5457 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5460 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5461 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5462 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5463 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5465 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5474 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5515 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5524 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5531 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5696 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5741 | 1：`feelColor` |
| `feelColor` | 関数 | 5751 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5770 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5811 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5819 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5826 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5837 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5854 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5876 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5882 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5891 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5919 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6002 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6050 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6067 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6075 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6098 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6104 | 1：（HTML） |

## SKY COLOR HELPER

行 6120〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6123 | 0 |

## WEATHER EMOJI

行 6144〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6153 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6160 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6179 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6180 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6181 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6190 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6212 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6225 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6238 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6252 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6300 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6314 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6319〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6322 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6325 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6377 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6394 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6402 | 1：`updateParticles` |

## 時刻選択

行 6409〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6424 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6425 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6432 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6440 | 0 |
| `positionScrubLine` 📝 | 関数 | 6446 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6467 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6483 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6505 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6525 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6530 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6536 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6568 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6576 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6586 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6599 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6697 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6729 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6754〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6759 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6760 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6763 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6776 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6780 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6783 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6858 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6859 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6861 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6865 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6872 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6873 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6880 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6882 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6883 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6885 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6886 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6887 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6888 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6889 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6890 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6891 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6893 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6894 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6895 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6896 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6897 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6900 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6903 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6904 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 6905 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 6911 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6919 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6922 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6923 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6928 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6929 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6939 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6953 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6958 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6975 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6976 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6981 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6983 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7038 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7039 | 18：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか12 |
| `usableOverlays` 📝 | 関数 | 7043 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7044 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7047 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7055 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7070 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7082 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7089 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7161 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7175〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7180 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7185 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7188 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7205 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7209 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7213 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7223 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7238 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7259 | 1：`ciFetchBlob` |
| `CI_PRM` 📝 | 定数 | 7260 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7261 | 1：`updateCiZoomNote` |
| `CI_BLOB_MAX` | 定数 | 7262 | 2：`ciDecodeMain`、`ciFetchBlob` |
| `ciStats` 📝 | 状態 | 7263 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7266 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7274 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciAcos` 📝 | 関数 | 7298 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7303 | 1：`ciRenderTile` |
| `ciMargin` 📝 | 関数 | 7308 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7310 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7322 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7362 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7394 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7398 | 1：`ciRenderTile` |
| `ciBreakWorker` 📝 | 関数 | 7418 | 1：`getCiWorker` |
| `ciTileKey` | 関数 | 7428 | 2：`ciFetchBlob`、`ciRenderTile` |
| `ciFetchBlob` 📝 | 関数 | 7429 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7450 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7462 | 1：`ciRenderTile` |
| `ciRenderTile` 📝 | 関数 | 7477 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7499 | 1：`applyOverlays` |
| `CiMapLayerClass` 📝 | 関数 | 7509 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 7531 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7539 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7585 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7587 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7602 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7610 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7614 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7617 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7634 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7636 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7641 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7652 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7681 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7683 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7728 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7743 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7776 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7780 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7785 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7810 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7811 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7814 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7815 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7817 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7828 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7853 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7854 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7855 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7856 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7859 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7870 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7877 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7888 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7903 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7908 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7931 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7934 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7948 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8011 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8028〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8045 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8046 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8051 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8055 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8060 | 0 |
| `radarNowWet` | 関数 | 8099 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8107 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8120 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8129 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8161 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8171 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8178 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8207 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8208 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8209 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8210 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8246 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8247 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8258 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8259 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8260 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8261 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8275 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8291〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8306 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8307 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8308 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8309 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8312 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8316 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8317 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8318 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8320 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8326 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8354 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8399〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8414 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8422 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8426 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8428 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8429 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8431 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8432 | 1：`windBand` |
| `windBand` | 関数 | 8433 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8435 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8437 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8438 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8439 | 1：（トップレベル） |
| `windDirName` | 関数 | 8441 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8447 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8457 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8462 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8537 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8554 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8559 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8598 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8606 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8625 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8645 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8662 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8714 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8728 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8729 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8730 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8732 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8733 | 1：`ensureWindField` |
| `windError` | 関数 | 8734 | 1：`ensureWindField` |
| `windClear` | 関数 | 8735 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8739 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8792 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8820 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8924 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8928〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8943 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8956 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8960 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8964 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8973 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8987 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9002 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9004 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9020 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9036 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9046〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9060 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9074 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9083 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9090 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9091 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9092 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9094 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9109 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9124 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9139 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9154 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9156 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9172 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9187 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9199〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9212 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9231 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 9233 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9244 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9257 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9259 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9274 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9286 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9299 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9305 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9307 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9319 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9323 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9380〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9402 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9421 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9439 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9443 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9454 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9479 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9492 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9498 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9519 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9534 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9537 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9538 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9539 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9544 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9545 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9546 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9547 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9553 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9558 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9562 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9567 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9572 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9578 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9585 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9592 | 1：`windGLBgTexture` |
| `windBgFade` | 関数 | 9601 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9607 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9631 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9641 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9646 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9662 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9715 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9722 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9723 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9727 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9769 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9777 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9779 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9821 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9830 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9903〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9921 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9931 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9944 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9950 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9951 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9953 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9961 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9968 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9976 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9991 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10002 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10077 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10102 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10108〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10132 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10138 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10147 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10163 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10164 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10167 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10190 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10218 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10224 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10269 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10295 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10302 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10401 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10416 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10417 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10616 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10633 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10645 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10653 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10660 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10665 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10666 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10667 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10668 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10669 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10684 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10697 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10726 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10759 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10787 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10805 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10818 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10848 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10858 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10881 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10882 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10914 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10961 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10965 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10983 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10990 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10991 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11016 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11066 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11076 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11077 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11095 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11097 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11110 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11132 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11136 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11145 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11152 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11157 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11158 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11159 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11164 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11179 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11194 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11208 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11212 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11225 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11245 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11255 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11264 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11278 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11305 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11401 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11419 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11459 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11471 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11483 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11485 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11490 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11500 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11528 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11557 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11588 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11597 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11607 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11612 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11620 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11621 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11627 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11634 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11641 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11643 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11668 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11683 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11684 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11685 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11686 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11690 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11699 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11711 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11727 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11803 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11804 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11805 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11806 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11807 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11808 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11810 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11815 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11830 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11836 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11842 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11851 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11859 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11910 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11948 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11956 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11973 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11978 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11984 | 1：（HTML） |
| `stepMapTime` | 関数 | 11985 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11986 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11998 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11999 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12000 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12007 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12011 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12016 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12019 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12022 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12028 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12029 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12034 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12097 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12098 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12101 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12114 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12148 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12158 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12170 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12177 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12183 | 1：`blendChips` |
| `blendChips` | 関数 | 12192 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12199 | 21：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか15 |
| `overlayOpacity` 📝 | 関数 | 12200 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12207 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12227 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12253 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12261 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12269 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12354 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12373 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12391 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12392 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12399 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12416 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12424 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12431 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12445 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12453 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 12474 | 1：（HTML） |
| `sectionLayers` | 関数 | 12478 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 12479 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 12481 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 12490 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 12499 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 12507 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 12529 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 12541 | 2：`loadLayerSets`、`saveLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 12542 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 12543 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 12544 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 12547 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 12550 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 12555 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 12569 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 12592 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 12603 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 12609 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 12615 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 12625 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 12632 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 12647 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 12650 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 12662 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 12694 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 12705 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 12712 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 12719 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 12728 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12760 | 20：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか14 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12830〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12833 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12834 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12837 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12851 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12859 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12865 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12892 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12901 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12905 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12932 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12936 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12957 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12963 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13002 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13006 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13013 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13038 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 13048 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 13052 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13077 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13078 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13079 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13083 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13087 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13097 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13104 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 13126 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 13133 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 13140 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 13153 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 13162 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 13176 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 13183 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 13191〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 13216 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 13223 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13245 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13262 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13268 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13283 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13302 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13314 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13329 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13339 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13372 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13395 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13405 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13413 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13420 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 13432 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 13440 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 13473 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 13474 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 13475 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 13478 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 13484 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 13485 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13491 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13533 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13534 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13535 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13541 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13546 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13620 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13621 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13626 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13638 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13642 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13650 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13667 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13668 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13682 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13700 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13752 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13773 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13777 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 13781 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 13800 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 13803 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 13816 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 13817 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 13843 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 13860 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 13863 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 13869 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13930 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13931 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13948 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 14071 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 14072 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 14073 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 14080 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 14100〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 14108 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 14109 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 14111 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 14118 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 14122 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 14126 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 14136 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 14145 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 14228〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 14236 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14246 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14254 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14255 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14265 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14280 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14295 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14302 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14306 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14312 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14323 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14342 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14370 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14377 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14387 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14392 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14399 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14402 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14410 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14416 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14425 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 14440 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 14445 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 14456 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 14462 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 14472 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14489 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14525 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14535 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14551 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14552 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14628 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14629 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14638〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14643 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14648 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14653 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14657 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14668 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14669 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14681 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14702 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14705 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14719 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14740 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14776〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 14786 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 14789 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 14792 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 14793 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 14794 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 14795 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 14796 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 14799 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 14825 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 14826 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 14827 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 14828 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 14833 | 1：`utmResult` |
| `utmResult` | 関数 | 14838 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 14845 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 14869 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 14881 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14915 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14928 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14936 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14978 | 1：（HTML） |

## FAVORITES

行 14990〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14993 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14997 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 15007 | 1：（HTML） |
| `openFav` 📝 | 関数 | 15011 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 15016 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 15020 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 15169 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 15180〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 15186 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 15187 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 15188 | 1：`openRank` |
| `rankFetchCache` | 状態 | 15191 | 1：`fetchRankData` |
| `rankDates` | 状態 | 15192 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 15195 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 15204 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 15209 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 15234 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15277 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15286 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15309 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15347 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15348 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15353 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15363 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 15447 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 15456 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15491 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15501 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15513 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15517〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15528 | 1：（HTML） |
| `setWindMode` | 関数 | 15537 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15544 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15552 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15560 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15568 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15577 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15606 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15664 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15671〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15674 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15677 | 1：（トップレベル） |

## LOADING OVERLAY

行 15682〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15685 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15691 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15736〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15752 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15753 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15763 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15768 | 1：（HTML） |
| `closeWxMap` | 関数 | 15772 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15775 | 1：（HTML） |
| `setWxMapArea` | 関数 | 15781 | 1：（HTML） |
| `loadWxMapList` | 関数 | 15789 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 15805 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 15815 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 15824 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 15839 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 15849 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 15878〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 15881 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 15884 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15905 | 11：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか5 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15915 | 1：（トップレベル） |

