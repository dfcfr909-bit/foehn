# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,218行／本体の `<script>` は 2940〜17215 行
- トップレベルの宣言 1065（関数 760・定数と状態 305）／ブロック 39
- `code_map.md` に説明があるもの：600／1065（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2941：STATE（16）
- 行 3143：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3385：DATA FETCH（31）
- 行 3886：GPS（2）
- 行 3923：RENDER MASTER（41）
- 行 4381：HUD（28）
- 行 4732：ABC JUDGMENT（6）
- 行 4811：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6283：SKY COLOR HELPER（1）
- 行 6307：WEATHER EMOJI（12）
- 行 6482：PARTICLES (雨・雪エフェクト)（5）
- 行 6572：時刻選択（17）
- 行 6917：MAP — レイヤー定義（55）
- 行 7368：MAP — 本体（140）
- 行 8819：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9089：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9197：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9790：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9908：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10061：風の流れ（Particle Engine）（13）
- 行 10242：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10765：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10970：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13722：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（50）
- 行 14291：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（60）
- 行 15239：検索の履歴（選んだ地点）（8）
- 行 15367：手元の山の検索（#171・第1段階）（33）
- 行 15777：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 15915：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16129：FAVORITES（18）
- 行 16440：RANKING（全国山域ランキング）（21）
- 行 16777：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 16931：LOCALSTORAGE – 最終地点（2）
- 行 16942：LOADING OVERLAY（2）
- 行 16996：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17138：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2941〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2944 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 2962 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2977 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2981 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2997 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 3012 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3042 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3044 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3045 | 3：`fetchRankData`、`summitWindAt`、`wxForecastUrl` |
| `MSM_BLEND_HOURS` | 定数 | 3048 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3058 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3059 | 3：`makeHintEngine`、`processData`、`windRecHydrate` |
| `summitWindAt` 📝 | 関数 | 3074 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3115 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3121 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3134 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3143〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3167 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3168 | 3：`trimWxCache`、`wxDb`、`wxStore` |
| `WX_WIND_STORE` | 定数 | 3169 | 4：`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxDb` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3170 | 6：`fetchWeather`、`renderFavPrefetch`、`setWxSource`、`trimWxCache`、`windRecord`、`windUseSaved` |
| `WX_STALE_MS` 📝 | 定数 | 3171 | 3：`fetchWeather`、`setWxSource`、`windSavedNote` |
| `WX_MAX_BYTES` 📝 | 定数 | 3175 | 1：`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3176 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3180 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3183 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3199 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3207 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3213 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3223 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3244 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3247 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3269 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3279 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3304 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3339 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3347 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3360 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3385〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3400 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3406 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3408 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3415 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3427 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3448 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3452 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3460 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3466 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3500 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3505 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3507 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3617 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3622 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3658 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3665 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3674 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3697 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3719 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3723 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3737 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3756 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3773 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3782 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3813 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3827 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3828 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3829 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3830 | 1：`processData` |
| `summitGustRange` | 関数 | 3835 | 1：`processData` |
| `processData` 📝 | 関数 | 3840 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3886〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3889 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3914 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3923〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3930 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3952 | 1：`render` |
| `FAV_STEP` | 定数 | 3959 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3961 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3962 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3975 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3976 | 1：`favCircular` |
| `favCount` | 関数 | 3977 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3978 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3980 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3986 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3996 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 4005 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 4011 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4018 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4020 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4035 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4039 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4040 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4046 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4058 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4063 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4074 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4079 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4086 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4096 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4108 | 0 |
| `saveHome` | 関数 | 4109 | 0 |
| `goHome` | 関数 | 4110 | 0 |
| `currentFavChip` | 関数 | 4114 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4120 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4125 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4171 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4206 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4241 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4254 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4272 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4284 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4296 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4298 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4310 | 1：（トップレベル） |

## HUD

行 4381〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4384 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4390 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4396 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4399 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4404 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4409 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4420 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4440 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4445 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4461 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4469 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4487 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4488 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4489 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4499 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4504 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4520 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4521 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4522 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4530 | 1：`peakAt` |
| `peakAt` | 関数 | 4531 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4545 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4573 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4617 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4633 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4712 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4725 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4726 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4732〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4737 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4738 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4740 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4746 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4753 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4797 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4811〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4817 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4818 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4819 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4820 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4821 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4823 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4832 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4833 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4837 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4842 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4851 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4852 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4858 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4859 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4867 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4868 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4869 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4870 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4871 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4872 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4873 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4881 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4884 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4887 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4889 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5062 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5063 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5064 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5076 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5077 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5078 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5079 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5080 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5083 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5101 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5113 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5125 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5134 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5153 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5168 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5277 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5288 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5413 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5472 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5490 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5494 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5495 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5497 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5500 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5504 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5507 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5520 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5534 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5549 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5592 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5606 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5620 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5623 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5624 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5625 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5626 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5628 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5637 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5678 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5687 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5694 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5859 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5904 | 1：`feelColor` |
| `feelColor` | 関数 | 5914 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5933 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5974 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5982 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5989 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6000 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6017 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6039 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6045 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6054 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6082 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6165 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6213 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6230 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6238 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6261 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6267 | 1：（HTML） |

## SKY COLOR HELPER

行 6283〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6286 | 0 |

## WEATHER EMOJI

行 6307〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6316 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6323 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6342 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6343 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6344 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6353 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6375 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6388 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6401 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6415 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6463 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6477 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6482〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6485 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6488 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6540 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6557 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6565 | 1：`updateParticles` |

## 時刻選択

行 6572〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6587 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6588 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6595 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6603 | 0 |
| `positionScrubLine` 📝 | 関数 | 6609 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6630 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6646 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6668 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6688 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6693 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6699 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6731 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6739 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6749 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6762 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6860 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6892 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6917〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6922 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6923 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6926 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6939 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6943 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6946 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7037 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7038 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7040 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7044 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7051 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7052 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7059 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7061 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7062 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7064 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7065 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7066 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7067 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7068 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7069 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7070 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7071 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7073 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7074 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7075 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7076 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7077 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7080 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7083 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7084 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7085 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7091 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7099 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7102 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7103 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7108 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7109 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7119 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7133 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7138 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7155 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7156 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7161 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7163 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7223 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7224 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7228 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7229 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7232 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7240 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7255 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7267 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7274 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7354 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7368〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7373 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7378 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7381 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7398 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7402 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7406 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7416 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7431 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7452 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7453 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7454 | 0 |
| `DEM_SRC` 📝 | 定数 | 7457 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7463 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7464 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7467 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7475 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7484 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7508 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7513 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7518 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7520 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7532 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7574 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7577 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7601 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7605 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7628 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7665 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7669 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7689 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7700 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7704 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7720 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7725 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7738 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7758 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7780 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7794 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7798 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7799 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7800 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7803 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7804 | 1：`csCompute` |
| `csPushTime` | 関数 | 7805 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7806 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7809 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7818 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7827 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7829 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7841 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7862 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7876 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7890 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7899 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7905 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7919 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 7950 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 7951 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 7953 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 7954 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 7955 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 7956 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 7958 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 7959 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 7960 | 1：（トップレベル） |
| `windExpSave` | 関数 | 7967 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 7973 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 7979 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 7989 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8003 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8016 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8017 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8018 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8019 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8028 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8042 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8064 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8074 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8078 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8083 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8101 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8102 | 1：`wdPlan` |
| `wd` | 状態 | 8104 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8106 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8116 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8132 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8137 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8139 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8144 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8150 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8172 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8182 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8190 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8200 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8225 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8227 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8231 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8233 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8242 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8264 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8287 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8312 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8323 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8376 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8378 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8393 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8401 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8405 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8408 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8425 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8427 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8432 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8443 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8472 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8474 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8519 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8534 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8567 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8571 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8576 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8601 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8602 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8605 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8606 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8608 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8619 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8644 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8645 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8646 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8647 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8650 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8661 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8668 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8679 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8694 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8699 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8722 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8725 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8739 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8802 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8819〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8836 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8837 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8842 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8846 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8851 | 0 |
| `radarNowWet` | 関数 | 8890 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8898 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8911 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8920 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8952 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8962 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8969 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8998 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8999 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9000 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9001 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9044 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9045 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9056 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9057 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9058 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9059 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9073 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9089〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9104 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9105 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9106 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9107 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9110 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9114 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9115 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9116 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9118 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9124 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9152 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9197〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9212 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9220 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9224 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9226 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9227 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9229 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9230 | 1：`windBand` |
| `windBand` | 関数 | 9231 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9233 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9235 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9236 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9237 | 1：（トップレベル） |
| `windDirName` | 関数 | 9239 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9245 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9255 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9260 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9335 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9354 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9355 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9362 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9369 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9404 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9409 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9417 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9436 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9456 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9473 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9525 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9539 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9540 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9541 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9543 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9544 | 1：`ensureWindField` |
| `windError` | 関数 | 9545 | 1：`ensureWindField` |
| `windClear` | 関数 | 9546 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9550 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9620 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9639 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9654 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9682 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9786 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9790〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9805 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9818 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9822 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9826 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9835 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9849 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9864 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9866 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9882 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9898 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9908〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9922 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9936 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9945 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9952 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9953 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9954 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9956 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9971 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9986 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10001 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10016 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10018 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10034 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10049 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10061〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10074 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10093 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10095 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10106 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10119 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10121 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10136 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10148 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10161 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10167 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10169 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10181 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10185 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10242〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10264 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10283 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10301 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10305 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10316 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10341 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10354 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10360 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10381 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10396 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10399 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10400 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10401 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10406 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10407 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10408 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10409 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10415 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10420 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10424 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10429 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10434 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10440 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10447 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10454 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10463 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10469 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10493 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10503 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10508 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10524 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10577 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10584 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10585 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10589 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10631 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10639 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10641 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10683 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10692 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10765〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10783 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10793 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10806 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10812 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10813 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10815 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10823 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10830 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10838 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10853 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10864 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10939 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10964 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10970〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10994 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11000 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11009 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11025 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11026 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11029 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11052 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11080 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11086 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11131 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11157 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11164 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11263 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11278 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11279 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11478 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11495 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11507 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11515 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11522 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11527 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11528 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11529 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11530 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11531 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11546 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11559 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11588 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11621 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11649 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11667 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11680 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11710 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11720 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11743 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11744 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11776 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11823 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11827 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11845 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11852 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11853 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11878 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11928 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11938 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11939 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11957 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11959 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11972 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11994 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11998 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12007 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12014 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12019 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12020 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12021 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12026 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12041 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12056 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12070 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12074 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12087 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12107 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12117 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12126 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12140 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12167 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12263 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12281 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12321 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12333 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12345 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12347 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12352 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12362 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12390 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12419 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12450 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12459 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12469 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12474 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12482 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12483 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12489 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12496 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12503 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12505 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12530 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12545 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12546 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12547 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12548 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12552 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12561 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12573 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12589 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12665 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12666 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12667 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12668 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12669 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12670 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12672 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12677 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12692 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12698 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12704 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12713 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12721 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12772 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12812 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12820 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12838 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12843 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12849 | 1：（HTML） |
| `stepMapTime` | 関数 | 12850 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12851 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12863 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12864 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12865 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12872 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12876 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12881 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12884 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12887 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12893 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12894 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12899 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12962 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12963 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12966 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12979 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13013 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13023 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13035 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13042 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13048 | 1：`blendChips` |
| `blendChips` | 関数 | 13057 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13064 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13065 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13072 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13093 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13098 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13126 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13134 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13142 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13227 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13246 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13264 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13265 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13272 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13290 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13298 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13305 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13319 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13327 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13348 | 1：（HTML） |
| `sectionLayers` | 関数 | 13352 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13353 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13355 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13364 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13373 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13381 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13403 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13415 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13416 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13417 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13418 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13419 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13422 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13425 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13430 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13444 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13467 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13478 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13501 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13507 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13517 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13524 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13539 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13542 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13554 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13586 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13597 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13604 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13611 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13620 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13652 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13722〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13725 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13726 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13729 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13743 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13751 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13757 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13784 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13793 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13797 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13824 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13828 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13849 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13855 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13894 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13898 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13905 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 13931 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 13941 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 13945 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 13970 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 13971 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 13972 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 13976 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 13980 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 13990 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 13997 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14019 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14026 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14033 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 14046 | 1：（HTML） |
| `AREA_LS` | 定数 | 14061 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14062 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14063 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14064 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14066 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14073 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14078 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14088 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14103 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14113 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14118 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14123 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14128 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14129 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14130 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14208 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14221 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14262 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14276 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14283 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14291〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14316 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14323 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14345 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14362 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14368 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14383 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14402 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14414 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14429 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14439 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14472 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14499 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `showOrientDiag` | 関数 | 14516 | 1：`enableHeading` |
| `applyNotchSide` | 関数 | 14529 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14537 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14545 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14556 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14568 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14576 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14612 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14613 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14614 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14617 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14623 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14624 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14630 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14672 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14673 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14674 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14680 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14685 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14759 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14760 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14765 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 14777 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 14781 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 14789 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 14806 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 14807 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 14821 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 14839 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 14891 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 14912 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 14916 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 14920 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 14939 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 14942 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 14955 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 14956 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 14982 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 14999 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15002 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15008 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15069 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15070 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15087 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15210 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15211 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15212 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15219 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15239〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15247 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15248 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15250 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15257 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15261 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15265 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15275 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15284 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15367〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15375 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15385 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15393 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15394 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15404 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15419 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15434 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15441 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15445 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15451 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15462 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15481 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15509 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15516 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15526 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15531 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15538 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15541 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15549 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15555 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15564 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15579 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15584 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15595 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15601 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15611 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15628 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15664 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15674 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15690 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15691 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15767 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15768 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 15777〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 15782 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 15787 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 15792 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 15796 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 15807 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 15808 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 15820 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 15841 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 15844 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 15858 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 15879 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 15915〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 15925 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 15928 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 15931 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 15932 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 15933 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 15934 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 15935 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 15938 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 15964 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 15965 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 15966 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 15967 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 15972 | 1：`utmResult` |
| `utmResult` | 関数 | 15977 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 15984 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16008 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16020 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16054 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 16067 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16075 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16117 | 1：（HTML） |

## FAVORITES

行 16129〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16132 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16136 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16149 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16150 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16151 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16152 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16153 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16155 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16160 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16169 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16172 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16173 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16234 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16266 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16270 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16276 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16280 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16429 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16440〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16446 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16447 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16448 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16451 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16452 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16455 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16464 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16469 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16494 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16537 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16546 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16569 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16607 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16608 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16613 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16623 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16707 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16716 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16751 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16761 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 16773 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 16777〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 16788 | 1：（HTML） |
| `setWindMode` | 関数 | 16797 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 16804 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 16812 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 16820 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 16828 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 16837 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 16866 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 16924 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 16931〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 16934 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 16937 | 1：（トップレベル） |

## LOADING OVERLAY

行 16942〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 16945 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 16951 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 16996〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17012 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17013 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17023 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17028 | 1：（HTML） |
| `closeWxMap` | 関数 | 17032 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17035 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17041 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17049 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17065 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17075 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17084 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17099 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17109 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17138〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17141 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17144 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17165 | 13：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか7 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17175 | 1：（トップレベル） |

