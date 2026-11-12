# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,452行／本体の `<script>` は 2964〜17449 行
- トップレベルの宣言 1089（関数 778・定数と状態 311）／ブロック 40
- `code_map.md` に説明があるもの：622／1089（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2965：起動の内訳の計測（v4.185.0・#227）（7）
- 行 3003：STATE（16）
- 行 3205：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3447：DATA FETCH（31）
- 行 3959：GPS（2）
- 行 3996：RENDER MASTER（41）
- 行 4462：HUD（28）
- 行 4813：ABC JUDGMENT（6）
- 行 4892：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6364：SKY COLOR HELPER（1）
- 行 6388：WEATHER EMOJI（12）
- 行 6563：PARTICLES (雨・雪エフェクト)（5）
- 行 6653：時刻選択（17）
- 行 6998：MAP — レイヤー定義（55）
- 行 7449：MAP — 本体（140）
- 行 8900：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9170：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9278：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9871：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9989：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10142：風の流れ（Particle Engine）（13）
- 行 10323：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10846：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 11051：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13804：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（67）
- 行 14522：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（60）
- 行 15470：検索の履歴（選んだ地点）（8）
- 行 15598：手元の山の検索（#171・第1段階）（33）
- 行 16008：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 16146：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16360：FAVORITES（18）
- 行 16671：RANKING（全国山域ランキング）（21）
- 行 17008：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 17162：LOCALSTORAGE – 最終地点（2）
- 行 17173：LOADING OVERLAY（2）
- 行 17227：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17369：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## 起動の内訳の計測（v4.185.0・#227）

行 2965〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `BOOT_LS_LOG` 📝 | 定数 | 2976 | 2：`bootSave`、`loadBootLog` |
| `BOOT_SS_HOP` 📝 | 定数 | 2977 | 1：（トップレベル） |
| `BOOT_LOG_KEEP` 📝 | 定数 | 2978 | 1：`bootLogPush` |
| `BOOT_HOP_MAX_MS` | 定数 | 2979 | 1：（トップレベル） |
| `bootTime` 📝 | 状態 | 2980 | 8：`bootAmend`、`bootFinish`、`bootMark`、`bootOut`、`bootRecord`、`fetchWeather` ほか2 |
| `bootMark` 📝 | 関数 | 2981 | 4：`applyWeatherJson`、`fetchWeather`、`render`、（トップレベル） |
| `bootOrigin` 📝 | 関数 | 2986 | 2：`bootRecord`、（トップレベル） |

## STATE

行 3003〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 3006 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 3024 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 3039 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 3043 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 3059 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 3074 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3104 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3106 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3107 | 3：`fetchRankData`、`summitWindAt`、`wxForecastUrl` |
| `MSM_BLEND_HOURS` | 定数 | 3110 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3120 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3121 | 3：`makeHintEngine`、`processData`、`windRecHydrate` |
| `summitWindAt` 📝 | 関数 | 3136 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3177 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3183 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3196 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3205〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3229 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3230 | 3：`trimWxCache`、`wxDb`、`wxStore` |
| `WX_WIND_STORE` | 定数 | 3231 | 4：`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxDb` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3232 | 6：`fetchWeather`、`renderFavPrefetch`、`setWxSource`、`trimWxCache`、`windRecord`、`windUseSaved` |
| `WX_STALE_MS` 📝 | 定数 | 3233 | 3：`fetchWeather`、`setWxSource`、`windSavedNote` |
| `WX_MAX_BYTES` 📝 | 定数 | 3237 | 1：`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3238 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3242 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3245 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3261 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3269 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3275 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3285 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3306 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3309 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3331 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3341 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3366 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3401 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3409 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3422 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3447〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3462 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3468 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3470 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3477 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3489 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3510 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3514 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3522 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3528 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3562 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3567 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3569 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3689 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3694 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3731 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3738 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3747 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3770 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3792 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3796 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3810 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3829 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3846 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3855 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3886 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3900 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3901 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3902 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3903 | 1：`processData` |
| `summitGustRange` | 関数 | 3908 | 1：`processData` |
| `processData` 📝 | 関数 | 3913 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3959〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3962 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3987 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3996〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 4003 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 4033 | 1：`render` |
| `FAV_STEP` | 定数 | 4040 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 4042 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 4043 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 4056 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 4057 | 1：`favCircular` |
| `favCount` | 関数 | 4058 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 4059 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 4061 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 4067 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 4077 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 4086 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 4092 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4099 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4101 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4116 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4120 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4121 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4127 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4139 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4144 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4155 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4160 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4167 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4177 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4189 | 0 |
| `saveHome` | 関数 | 4190 | 0 |
| `goHome` | 関数 | 4191 | 0 |
| `currentFavChip` | 関数 | 4195 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4201 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4206 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4252 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4287 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4322 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4335 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4353 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4365 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4377 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4379 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4391 | 1：（トップレベル） |

## HUD

行 4462〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4465 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4471 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4477 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4480 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4485 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4490 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4501 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4521 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4526 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4542 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4550 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4568 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4569 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4570 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4580 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4585 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4601 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4602 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4603 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4611 | 1：`peakAt` |
| `peakAt` | 関数 | 4612 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4626 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4654 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4698 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4714 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4793 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4806 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4807 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4813〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4818 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4819 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4821 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4827 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4834 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4878 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4892〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4898 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4899 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4900 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4901 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4902 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4904 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4913 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4914 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4918 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4923 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4932 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4933 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4939 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4940 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4948 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4949 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4950 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4951 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4952 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4953 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4954 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4962 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4965 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4968 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4970 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5143 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5144 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5145 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5157 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5158 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5159 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5160 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5161 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5164 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5182 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5194 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5206 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5215 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5234 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5249 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5358 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5369 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5494 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5553 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5571 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5575 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5576 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5578 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5581 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5585 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5588 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5601 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5615 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5630 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5673 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5687 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5701 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5704 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5705 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5706 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5707 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5709 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5718 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5759 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5768 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5775 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5940 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5985 | 1：`feelColor` |
| `feelColor` | 関数 | 5995 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 6014 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 6055 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 6063 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 6070 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6081 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6098 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6120 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6126 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6135 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6163 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6246 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6294 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6311 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6319 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6342 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6348 | 1：（HTML） |

## SKY COLOR HELPER

行 6364〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6367 | 0 |

## WEATHER EMOJI

行 6388〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6397 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6404 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6423 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6424 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6425 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6434 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6456 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6469 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6482 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6496 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6544 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6558 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6563〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6566 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6569 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6621 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6638 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6646 | 1：`updateParticles` |

## 時刻選択

行 6653〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6668 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6669 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6676 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6684 | 0 |
| `positionScrubLine` 📝 | 関数 | 6690 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6711 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6727 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6749 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6769 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6774 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6780 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6812 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6820 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6830 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6843 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6941 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6973 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6998〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 7003 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 7004 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 7007 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 7020 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 7024 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 7027 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7118 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7119 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7121 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7125 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7132 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7133 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7140 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7142 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7143 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7145 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7146 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7147 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7148 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7149 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7150 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7151 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7152 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7154 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7155 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7156 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7157 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7158 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7161 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7164 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7165 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7166 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7172 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7180 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7183 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7184 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7189 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7190 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7200 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7214 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7219 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7236 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7237 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7242 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7244 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7304 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7305 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7309 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7310 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7313 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7321 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7336 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7348 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7355 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7435 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7449〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7454 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7459 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7462 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7479 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7483 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7487 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7497 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7512 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7533 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7534 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7535 | 0 |
| `DEM_SRC` 📝 | 定数 | 7538 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7544 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7545 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7548 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7556 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7565 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7589 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7594 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7599 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7601 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7613 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7655 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7658 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7682 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7686 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7709 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7746 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7750 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7770 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7781 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7785 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7801 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7806 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7819 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7839 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7861 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7875 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7879 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7880 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7881 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7884 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7885 | 1：`csCompute` |
| `csPushTime` | 関数 | 7886 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7887 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7890 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7899 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7908 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7910 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7922 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7943 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7957 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7971 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7980 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7986 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 8000 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 8031 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 8032 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 8034 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 8035 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 8036 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 8037 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 8039 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 8040 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 8041 | 1：（トップレベル） |
| `windExpSave` | 関数 | 8048 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 8054 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 8060 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 8070 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8084 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8097 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8098 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8099 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8100 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8109 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8123 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8145 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8155 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8159 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8164 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8182 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8183 | 1：`wdPlan` |
| `wd` | 状態 | 8185 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8187 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8197 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8213 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8218 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8220 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8225 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8231 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8253 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8263 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8271 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8281 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8306 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8308 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8312 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8314 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8323 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8345 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8368 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8393 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8404 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8457 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8459 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8474 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8482 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8486 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8489 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8506 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8508 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8513 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8524 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8553 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8555 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8600 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8615 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8648 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8652 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8657 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8682 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8683 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8686 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8687 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8689 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8700 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8725 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8726 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8727 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8728 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8731 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8742 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8749 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8760 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8775 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8780 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8803 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8806 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8820 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8883 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8900〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8917 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8918 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8923 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8927 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8932 | 0 |
| `radarNowWet` | 関数 | 8971 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8979 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8992 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 9001 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 9033 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 9043 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 9050 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 9079 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 9080 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9081 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9082 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9125 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9126 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9137 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9138 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9139 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9140 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9154 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9170〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9185 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9186 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9187 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9188 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9191 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9195 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9196 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9197 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9199 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9205 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9233 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9278〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9293 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9301 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9305 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9307 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9308 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9310 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9311 | 1：`windBand` |
| `windBand` | 関数 | 9312 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9314 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9316 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9317 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9318 | 1：（トップレベル） |
| `windDirName` | 関数 | 9320 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9326 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9336 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9341 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9416 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9435 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9436 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9443 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9450 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9485 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9490 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9498 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9517 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9537 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9554 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9606 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9620 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9621 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9622 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9624 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9625 | 1：`ensureWindField` |
| `windError` | 関数 | 9626 | 1：`ensureWindField` |
| `windClear` | 関数 | 9627 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9631 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9701 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9720 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9735 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9763 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9867 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9871〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9886 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9899 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9903 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9907 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9916 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9930 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9945 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9947 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9963 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9979 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9989〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 10003 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 10017 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 10026 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 10033 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 10034 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 10035 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 10037 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 10052 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 10067 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10082 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10097 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10099 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10115 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10130 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10142〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10155 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10174 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10176 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10187 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10200 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10202 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10217 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10229 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10242 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10248 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10250 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10262 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10266 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10323〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10345 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10364 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10382 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10386 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10397 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10422 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10435 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10441 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10462 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10477 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10480 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10481 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10482 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10487 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10488 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10489 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10490 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10496 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10501 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10505 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10510 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10515 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10521 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10528 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10535 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10544 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10550 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10574 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10584 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10589 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10605 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10658 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10665 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10666 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10670 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10712 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10720 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10722 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10764 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10773 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10864 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10874 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10887 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10893 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10894 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10896 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10904 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10911 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10919 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10934 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10945 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 11020 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 11045 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 11051〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 11075 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11081 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11090 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11106 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11107 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11110 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11133 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11161 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11167 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11212 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11238 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11245 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11344 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11359 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11360 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11559 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11576 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11588 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11596 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11603 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11608 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11609 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11610 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11611 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11612 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11627 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11640 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11669 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11702 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11730 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11748 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11761 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11791 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11801 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11824 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11825 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11857 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11904 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11908 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11926 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11933 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11934 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11959 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 12009 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 12019 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 12020 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 12038 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 12040 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 12053 | 1：`windGLHud` |
| `terrainKey` | 関数 | 12075 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 12079 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12088 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12095 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12100 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12101 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12102 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12107 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12122 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12137 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12151 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12155 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12168 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12188 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12198 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12207 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12221 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12248 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12344 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12362 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12402 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12414 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12426 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12428 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12433 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12443 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12471 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12500 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12531 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12540 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12550 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12555 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12563 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12564 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12570 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12577 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12584 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12586 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12611 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12626 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12627 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12628 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12629 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12633 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12642 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12654 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12670 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12746 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12747 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12748 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12749 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12750 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12751 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12753 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12758 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12773 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12779 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12785 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12794 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12802 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12853 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12893 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12901 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12919 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12924 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12930 | 1：（HTML） |
| `stepMapTime` | 関数 | 12931 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12932 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12944 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12945 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12946 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12953 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12957 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12962 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12965 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12968 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12974 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12975 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12980 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 13043 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 13044 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 13047 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 13060 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13094 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13104 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13116 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13123 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13129 | 1：`blendChips` |
| `blendChips` | 関数 | 13138 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13145 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13146 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13153 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13174 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13179 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13207 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13215 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13223 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13308 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13327 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13345 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13346 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13353 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13372 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13380 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13387 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13401 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13409 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13430 | 1：（HTML） |
| `sectionLayers` | 関数 | 13434 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13435 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13437 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13446 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13455 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13463 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13485 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13497 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13498 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13499 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13500 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13501 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13504 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13507 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13512 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13526 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13549 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13560 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13583 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13589 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13599 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13606 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13621 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13624 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13636 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13668 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13679 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13686 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13693 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13702 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13734 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13804〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13807 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13808 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13811 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13825 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13833 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13839 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13866 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13875 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13879 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13906 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13910 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13931 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13937 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13976 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13980 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13987 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 14013 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 14023 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 14027 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 14052 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 14053 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 14054 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 14058 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 14062 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 14072 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 14079 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14101 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14108 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14115 | 1：`toggleLayerPanel` |
| `bootOut` 📝 | 関数 | 14138 | 2：`bootFinish`、`fetchWeather` |
| `bootNavInfo` 📝 | 関数 | 14139 | 1：`bootRecord` |
| `bootRecord` 📝 | 関数 | 14155 | 1：`bootSave` |
| `bootLogPush` 📝 | 関数 | 14165 | 1：`bootSave` |
| `loadBootLog` 📝 | 関数 | 14170 | 3：`bootLogText`、`bootSave`、`refreshBootLogView` |
| `bootSave` 📝 | 関数 | 14176 | 2：`bootAmend`、`bootFinish` |
| `bootFinish` 📝 | 関数 | 14181 | 2：`fetchWeather`、`render` |
| `bootAmend` 📝 | 関数 | 14189 | 2：`fetchWeather`、`render` |
| `BOOT_OUT_LABEL` | 定数 | 14191 | 2：`bootHeadline`、`bootRows` |
| `bootSec` 📝 | 関数 | 14192 | 4：`bootHeadline`、`bootLogText`、`bootRows`、`refreshBootLogView` |
| `bootTotal` 📝 | 関数 | 14194 | 1：`bootHeadline` |
| `bootRows` 📝 | 関数 | 14201 | 2：`bootLogText`、`refreshBootLogView` |
| `bootWhen` 📝 | 関数 | 14232 | 1：`bootHeadline` |
| `bootHeadline` 📝 | 関数 | 14237 | 2：`bootLogText`、`refreshBootLogView` |
| `refreshBootLogView` 📝 | 関数 | 14244 | 1：`toggleLayerPanel` |
| `bootLogText` 📝 | 関数 | 14262 | 1：`copyBootLog` |
| `copyBootLog` 📝 | 関数 | 14269 | 1：（HTML） |
| `clearTileCache` 📝 | 関数 | 14277 | 1：（HTML） |
| `AREA_LS` | 定数 | 14292 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14293 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14294 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14295 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14297 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14304 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14309 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14319 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14334 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14344 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14349 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14354 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14359 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14360 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14361 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14439 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14452 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14493 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14507 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14514 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14522〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14547 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14554 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14576 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14593 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14599 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14614 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14633 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14645 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14660 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14670 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14703 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14730 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `showOrientDiag` | 関数 | 14747 | 1：`enableHeading` |
| `applyNotchSide` | 関数 | 14760 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14768 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14776 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14787 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14799 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14807 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14843 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14844 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14845 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14848 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14854 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14855 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14861 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14903 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14904 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14905 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14911 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14916 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14990 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14991 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14996 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 15008 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 15012 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 15020 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 15037 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 15038 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 15052 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 15070 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 15122 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 15143 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 15147 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 15151 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 15170 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 15173 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 15186 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 15187 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 15213 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 15230 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15233 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15239 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15300 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15301 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15318 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15441 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15442 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15443 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15450 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15470〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15478 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15479 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15481 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15488 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15492 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15496 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15506 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15515 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15598〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15606 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15616 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15624 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15625 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15635 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15650 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15665 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15672 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15676 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15682 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15693 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15712 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15740 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15747 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15757 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15762 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15769 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15772 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15780 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15786 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15795 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15810 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15815 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15826 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15832 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15842 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15859 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15895 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15905 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15921 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15922 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15998 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15999 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 16008〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 16013 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 16018 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 16023 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 16027 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 16038 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 16039 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 16051 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 16072 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 16075 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 16089 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 16110 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 16146〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 16156 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 16159 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 16162 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 16163 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 16164 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 16165 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 16166 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 16169 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 16195 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 16196 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 16197 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 16198 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 16203 | 1：`utmResult` |
| `utmResult` | 関数 | 16208 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 16215 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16239 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16251 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16285 | 2：`copyBootLog`、`openCoordSheet` |
| `flashCopied` | 関数 | 16298 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16306 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16348 | 1：（HTML） |

## FAVORITES

行 16360〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16363 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16367 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16380 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16381 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16382 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16383 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16384 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16386 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16391 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16400 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16403 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16404 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16465 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16497 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16501 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16507 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16511 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16660 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16671〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16677 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16678 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16679 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16682 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16683 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16686 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16695 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16700 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16725 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16768 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16777 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16800 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16838 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16839 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16844 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16854 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16938 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16947 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16982 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16992 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 17004 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 17008〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 17019 | 1：（HTML） |
| `setWindMode` | 関数 | 17028 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 17035 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 17043 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 17051 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 17059 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 17068 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 17097 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 17155 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 17162〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 17165 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 17168 | 1：（トップレベル） |

## LOADING OVERLAY

行 17173〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 17176 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 17182 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 17227〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17243 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17244 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17254 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17259 | 1：（HTML） |
| `closeWxMap` | 関数 | 17263 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17266 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17272 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17280 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17296 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17306 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17315 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17330 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17340 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17369〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17372 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17375 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17396 | 14：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか8 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17406 | 1：（トップレベル） |

