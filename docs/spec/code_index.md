# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,450行／本体の `<script>` は 2964〜17447 行
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
- 行 4461：HUD（28）
- 行 4812：ABC JUDGMENT（6）
- 行 4891：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6363：SKY COLOR HELPER（1）
- 行 6387：WEATHER EMOJI（12）
- 行 6562：PARTICLES (雨・雪エフェクト)（5）
- 行 6652：時刻選択（17）
- 行 6997：MAP — レイヤー定義（55）
- 行 7448：MAP — 本体（140）
- 行 8899：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9169：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9277：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9870：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9988：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10141：風の流れ（Particle Engine）（13）
- 行 10322：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10845：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 11050：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13803：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（67）
- 行 14520：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（60）
- 行 15468：検索の履歴（選んだ地点）（8）
- 行 15596：手元の山の検索（#171・第1段階）（33）
- 行 16006：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 16144：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16358：FAVORITES（18）
- 行 16669：RANKING（全国山域ランキング）（21）
- 行 17006：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 17160：LOCALSTORAGE – 最終地点（2）
- 行 17171：LOADING OVERLAY（2）
- 行 17225：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17367：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `updateLocationName` 📝 | 関数 | 4032 | 1：`render` |
| `FAV_STEP` | 定数 | 4039 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 4041 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 4042 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 4055 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 4056 | 1：`favCircular` |
| `favCount` | 関数 | 4057 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 4058 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 4060 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 4066 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 4076 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 4085 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 4091 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4098 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4100 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4115 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4119 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4120 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4126 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4138 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4143 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4154 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4159 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4166 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4176 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4188 | 0 |
| `saveHome` | 関数 | 4189 | 0 |
| `goHome` | 関数 | 4190 | 0 |
| `currentFavChip` | 関数 | 4194 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4200 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4205 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4251 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4286 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4321 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4334 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4352 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4364 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4376 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4378 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4390 | 1：（トップレベル） |

## HUD

行 4461〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4464 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4470 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4476 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4479 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4484 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4489 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4500 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4520 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4525 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4541 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4549 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4567 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4568 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4569 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4579 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4584 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4600 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4601 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4602 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4610 | 1：`peakAt` |
| `peakAt` | 関数 | 4611 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4625 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4653 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4697 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4713 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4792 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4805 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4806 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4812〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4817 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4818 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4820 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4826 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4833 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4877 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4891〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4897 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4898 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4899 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4900 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4901 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4903 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4912 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4913 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4917 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4922 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4931 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4932 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4938 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4939 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4947 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4948 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4949 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4950 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4951 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4952 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4953 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4961 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4964 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4967 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4969 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5142 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5143 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5144 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5156 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5157 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5158 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5159 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5160 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5163 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5181 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5193 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5205 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5214 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5233 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5248 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5357 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5368 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5493 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5552 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5570 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5574 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5575 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5577 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5580 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5584 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5587 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5600 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5614 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5629 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5672 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5686 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5700 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5703 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5704 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5705 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5706 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5708 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5717 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5758 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5767 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5774 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5939 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5984 | 1：`feelColor` |
| `feelColor` | 関数 | 5994 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 6013 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 6054 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 6062 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 6069 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6080 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6097 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6119 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6125 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6134 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6162 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6245 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6293 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6310 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6318 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6341 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6347 | 1：（HTML） |

## SKY COLOR HELPER

行 6363〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6366 | 0 |

## WEATHER EMOJI

行 6387〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6396 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6403 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6422 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6423 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6424 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6433 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6455 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6468 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6481 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6495 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6543 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6557 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6562〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6565 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6568 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6620 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6637 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6645 | 1：`updateParticles` |

## 時刻選択

行 6652〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6667 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6668 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6675 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6683 | 0 |
| `positionScrubLine` 📝 | 関数 | 6689 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6710 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6726 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6748 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6768 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6773 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6779 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6811 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6819 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6829 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6842 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6940 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6972 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6997〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 7002 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 7003 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 7006 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 7019 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 7023 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 7026 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7117 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7118 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7120 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7124 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7131 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7132 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7139 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7141 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7142 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7144 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7145 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7146 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7147 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7148 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7149 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7150 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7151 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7153 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7154 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7155 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7156 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7157 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7160 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7163 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7164 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7165 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7171 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7179 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7182 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7183 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7188 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7189 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7199 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7213 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7218 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7235 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7236 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7241 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7243 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7303 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7304 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7308 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7309 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7312 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7320 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7335 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7347 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7354 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7434 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7448〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7453 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7458 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7461 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7478 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7482 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7486 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7496 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7511 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7532 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7533 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7534 | 0 |
| `DEM_SRC` 📝 | 定数 | 7537 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7543 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7544 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7547 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7555 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7564 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7588 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7593 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7598 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7600 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7612 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7654 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7657 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7681 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7685 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7708 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7745 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7749 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7769 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7780 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7784 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7800 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7805 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7818 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7838 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7860 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7874 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7878 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7879 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7880 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7883 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7884 | 1：`csCompute` |
| `csPushTime` | 関数 | 7885 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7886 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7889 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7898 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7907 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7909 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7921 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7942 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7956 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7970 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7979 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7985 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 7999 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 8030 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 8031 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 8033 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 8034 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 8035 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 8036 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 8038 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 8039 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 8040 | 1：（トップレベル） |
| `windExpSave` | 関数 | 8047 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 8053 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 8059 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 8069 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8083 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8096 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8097 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8098 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8099 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8108 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8122 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8144 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8154 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8158 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8163 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8181 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8182 | 1：`wdPlan` |
| `wd` | 状態 | 8184 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8186 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8196 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8212 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8217 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8219 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8224 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8230 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8252 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8262 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8270 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8280 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8305 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8307 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8311 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8313 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8322 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8344 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8367 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8392 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8403 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8456 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8458 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8473 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8481 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8485 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8488 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8505 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8507 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8512 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8523 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8552 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8554 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8599 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8614 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8647 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8651 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8656 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8681 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8682 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8685 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8686 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8688 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8699 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8724 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8725 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8726 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8727 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8730 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8741 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8748 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8759 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8774 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8779 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8802 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8805 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8819 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8882 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8899〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8916 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8917 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8922 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8926 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8931 | 0 |
| `radarNowWet` | 関数 | 8970 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8978 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8991 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 9000 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 9032 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 9042 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 9049 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 9078 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 9079 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9080 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9081 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9124 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9125 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9136 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9137 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9138 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9139 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9153 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9169〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9184 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9185 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9186 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9187 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9190 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9194 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9195 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9196 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9198 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9204 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9232 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9277〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9292 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9300 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9304 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9306 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9307 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9309 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9310 | 1：`windBand` |
| `windBand` | 関数 | 9311 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9313 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9315 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9316 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9317 | 1：（トップレベル） |
| `windDirName` | 関数 | 9319 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9325 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9335 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9340 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9415 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9434 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9435 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9442 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9449 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9484 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9489 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9497 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9516 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9536 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9553 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9605 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9619 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9620 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9621 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9623 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9624 | 1：`ensureWindField` |
| `windError` | 関数 | 9625 | 1：`ensureWindField` |
| `windClear` | 関数 | 9626 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9630 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9700 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9719 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9734 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9762 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9866 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9870〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9885 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9898 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9902 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9906 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9915 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9929 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9944 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9946 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9962 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9978 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9988〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 10002 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 10016 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 10025 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 10032 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 10033 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 10034 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 10036 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 10051 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 10066 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10081 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10096 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10098 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10114 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10129 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10141〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10154 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10173 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10175 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10186 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10199 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10201 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10216 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10228 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10241 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10247 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10249 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10261 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10265 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10322〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10344 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10363 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10381 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10385 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10396 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10421 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10434 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10440 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10461 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10476 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10479 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10480 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10481 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10486 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10487 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10488 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10489 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10495 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10500 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10504 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10509 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10514 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10520 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10527 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10534 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10543 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10549 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10573 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10583 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10588 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10604 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10657 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10664 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10665 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10669 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10711 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10719 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10721 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10763 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10772 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10845〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10863 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10873 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10886 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10892 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10893 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10895 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10903 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10910 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10918 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10933 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10944 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 11019 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 11044 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 11050〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 11074 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11080 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11089 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11105 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11106 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11109 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11132 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11160 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11166 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11211 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11237 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11244 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11343 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11358 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11359 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11558 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11575 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11587 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11595 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11602 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11607 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11608 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11609 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11610 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11611 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11626 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11639 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11668 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11701 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11729 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11747 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11760 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11790 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11800 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11823 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11824 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11856 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11903 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11907 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11925 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11932 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11933 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11958 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 12008 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 12018 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 12019 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 12037 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 12039 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 12052 | 1：`windGLHud` |
| `terrainKey` | 関数 | 12074 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 12078 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12087 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12094 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12099 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12100 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12101 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12106 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12121 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12136 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12150 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12154 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12167 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12187 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12197 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12206 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12220 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12247 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12343 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12361 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12401 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12413 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12425 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12427 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12432 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12442 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12470 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12499 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12530 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12539 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12549 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12554 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12562 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12563 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12569 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12576 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12583 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12585 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12610 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12625 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12626 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12627 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12628 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12632 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12641 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12653 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12669 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12745 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12746 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12747 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12748 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12749 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12750 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12752 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12757 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12772 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12778 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12784 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12793 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12801 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12852 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12892 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12900 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12918 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12923 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12929 | 1：（HTML） |
| `stepMapTime` | 関数 | 12930 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12931 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12943 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12944 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12945 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12952 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12956 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12961 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12964 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12967 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12973 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12974 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12979 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 13042 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 13043 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 13046 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 13059 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13093 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13103 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13115 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13122 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13128 | 1：`blendChips` |
| `blendChips` | 関数 | 13137 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13144 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13145 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13152 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13173 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13178 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13206 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13214 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13222 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13307 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13326 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13344 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13345 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13352 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13371 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13379 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13386 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13400 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13408 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13429 | 1：（HTML） |
| `sectionLayers` | 関数 | 13433 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13434 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13436 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13445 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13454 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13462 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13484 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13496 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13497 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13498 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13499 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13500 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13503 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13506 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13511 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13525 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13548 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13559 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13582 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13588 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13598 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13605 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13620 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13623 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13635 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13667 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13678 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13685 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13692 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13701 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13733 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13803〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13806 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13807 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13810 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13824 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13832 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13838 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13865 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13874 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13878 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13905 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13909 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13930 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13936 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13975 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13979 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13986 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 14012 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 14022 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 14026 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 14051 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 14052 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 14053 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 14057 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 14061 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 14071 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 14078 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14100 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14107 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14114 | 1：`toggleLayerPanel` |
| `bootOut` 📝 | 関数 | 14137 | 2：`bootFinish`、`fetchWeather` |
| `bootNavInfo` 📝 | 関数 | 14138 | 1：`bootRecord` |
| `bootRecord` 📝 | 関数 | 14154 | 1：`bootSave` |
| `bootLogPush` 📝 | 関数 | 14164 | 1：`bootSave` |
| `loadBootLog` 📝 | 関数 | 14169 | 3：`bootLogText`、`bootSave`、`refreshBootLogView` |
| `bootSave` 📝 | 関数 | 14175 | 2：`bootAmend`、`bootFinish` |
| `bootFinish` 📝 | 関数 | 14180 | 2：`fetchWeather`、`render` |
| `bootAmend` 📝 | 関数 | 14187 | 2：`fetchWeather`、`render` |
| `BOOT_OUT_LABEL` | 定数 | 14189 | 2：`bootHeadline`、`bootRows` |
| `bootSec` 📝 | 関数 | 14190 | 4：`bootHeadline`、`bootLogText`、`bootRows`、`refreshBootLogView` |
| `bootTotal` 📝 | 関数 | 14192 | 1：`bootHeadline` |
| `bootRows` 📝 | 関数 | 14199 | 2：`bootLogText`、`refreshBootLogView` |
| `bootWhen` 📝 | 関数 | 14230 | 1：`bootHeadline` |
| `bootHeadline` 📝 | 関数 | 14235 | 2：`bootLogText`、`refreshBootLogView` |
| `refreshBootLogView` 📝 | 関数 | 14242 | 1：`toggleLayerPanel` |
| `bootLogText` 📝 | 関数 | 14260 | 1：`copyBootLog` |
| `copyBootLog` 📝 | 関数 | 14267 | 1：（HTML） |
| `clearTileCache` 📝 | 関数 | 14275 | 1：（HTML） |
| `AREA_LS` | 定数 | 14290 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14291 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14292 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14293 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14295 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14302 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14307 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14317 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14332 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14342 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14347 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14352 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14357 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14358 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14359 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14437 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14450 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14491 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14505 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14512 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14520〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14545 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14552 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14574 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 14591 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14597 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14612 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14631 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14643 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14658 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14668 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14701 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14728 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `showOrientDiag` | 関数 | 14745 | 1：`enableHeading` |
| `applyNotchSide` | 関数 | 14758 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14766 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14774 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14785 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14797 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14805 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14841 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14842 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14843 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14846 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14852 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14853 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14859 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14901 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14902 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14903 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14909 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14914 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 14988 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 14989 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 14994 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 15006 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 15010 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 15018 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 15035 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 15036 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 15050 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 15068 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 15120 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 15141 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 15145 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 15149 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 15168 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 15171 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 15184 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 15185 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 15211 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 15228 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15231 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15237 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15298 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15299 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15316 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15439 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15440 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15441 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15448 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15468〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15476 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15477 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15479 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15486 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15490 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15494 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15504 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15513 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15596〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15604 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15614 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15622 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15623 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15633 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15648 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15663 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15670 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15674 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15680 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15691 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15710 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15738 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15745 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15755 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15760 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15767 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15770 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15778 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15784 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15793 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15808 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15813 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15824 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15830 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15840 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15857 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15893 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15903 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15919 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15920 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 15996 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 15997 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 16006〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 16011 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 16016 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 16021 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 16025 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 16036 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 16037 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 16049 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 16070 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 16073 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 16087 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 16108 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 16144〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 16154 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 16157 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 16160 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 16161 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 16162 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 16163 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 16164 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 16167 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 16193 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 16194 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 16195 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 16196 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 16201 | 1：`utmResult` |
| `utmResult` | 関数 | 16206 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 16213 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16237 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16249 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16283 | 2：`copyBootLog`、`openCoordSheet` |
| `flashCopied` | 関数 | 16296 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16304 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16346 | 1：（HTML） |

## FAVORITES

行 16358〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16361 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16365 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16378 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16379 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16380 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16381 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16382 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16384 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16389 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16398 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16401 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16402 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16463 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16495 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16499 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16505 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16509 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16658 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16669〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16675 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16676 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16677 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16680 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16681 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16684 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16693 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16698 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16723 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16766 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16775 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16798 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16836 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16837 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16842 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16852 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16936 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16945 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 16980 | 1：（HTML） |
| `openRank` 📝 | 関数 | 16990 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 17002 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 17006〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 17017 | 1：（HTML） |
| `setWindMode` | 関数 | 17026 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 17033 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 17041 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 17049 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 17057 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 17066 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 17095 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 17153 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 17160〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 17163 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 17166 | 1：（トップレベル） |

## LOADING OVERLAY

行 17171〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 17174 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 17180 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 17225〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17241 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17242 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17252 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17257 | 1：（HTML） |
| `closeWxMap` | 関数 | 17261 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17264 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17270 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17278 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17294 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17304 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17313 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17328 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17338 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17367〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17370 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17373 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17394 | 14：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか8 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17404 | 1：（トップレベル） |

