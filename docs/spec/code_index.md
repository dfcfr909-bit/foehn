# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,478行／本体の `<script>` は 2964〜17475 行
- トップレベルの宣言 1093（関数 779・定数と状態 314）／ブロック 40
- `code_map.md` に説明があるもの：625／1093（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2965：起動の内訳の計測（v4.185.0・#227）（7）
- 行 3003：STATE（16）
- 行 3205：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3447：DATA FETCH（31）
- 行 3959：GPS（2）
- 行 3996：RENDER MASTER（43）
- 行 4468：HUD（28）
- 行 4819：ABC JUDGMENT（6）
- 行 4898：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6370：SKY COLOR HELPER（1）
- 行 6394：WEATHER EMOJI（12）
- 行 6569：PARTICLES (雨・雪エフェクト)（5）
- 行 6659：時刻選択（17）
- 行 7004：MAP — レイヤー定義（55）
- 行 7455：MAP — 本体（140）
- 行 8906：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9176：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9284：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9877：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9995：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10148：風の流れ（Particle Engine）（13）
- 行 10329：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10852：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 11057：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13810：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（67）
- 行 14530：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（62）
- 行 15496：検索の履歴（選んだ地点）（8）
- 行 15624：手元の山の検索（#171・第1段階）（33）
- 行 16034：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 16172：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16386：FAVORITES（18）
- 行 16697：RANKING（全国山域ランキング）（21）
- 行 17034：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 17188：LOCALSTORAGE – 最終地点（2）
- 行 17199：LOADING OVERLAY（2）
- 行 17253：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17395：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

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
| `LOCATE_GO_ZOOM` 📝 | 定数 | 4382 | 2：`fetchGPS`、`locateFlyToMe` |
| `SEARCH_GO_ZOOM` 📝 | 定数 | 4383 | 3：`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `selectFav` 📝 | 関数 | 4385 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4397 | 1：（トップレベル） |

## HUD

行 4468〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4471 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4477 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4483 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4486 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4491 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4496 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4507 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4527 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4532 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4548 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4556 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4574 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4575 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4576 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4586 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4591 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4607 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4608 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4609 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4617 | 1：`peakAt` |
| `peakAt` | 関数 | 4618 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4632 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4660 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4704 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4720 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4799 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4812 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4813 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4819〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4824 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4825 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4827 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4833 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4840 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4884 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4898〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4904 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4905 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4906 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4907 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4908 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4910 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4919 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4920 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4924 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4929 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4938 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4939 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4945 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4946 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4954 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4955 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4956 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4957 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4958 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4959 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4960 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4968 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4971 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4974 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4976 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5149 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5150 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5151 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5163 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5164 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5165 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5166 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5167 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5170 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5188 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5200 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5212 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5221 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5240 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5255 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5364 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5375 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5500 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5559 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5577 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5581 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5582 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5584 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5587 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5591 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5594 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5607 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5621 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5636 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5679 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5693 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5707 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5710 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5711 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5712 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5713 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5715 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5724 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5765 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5774 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5781 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5946 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5991 | 1：`feelColor` |
| `feelColor` | 関数 | 6001 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 6020 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 6061 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 6069 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 6076 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6087 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6104 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6126 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6132 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6141 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6169 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6252 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6300 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6317 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6325 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6348 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6354 | 1：（HTML） |

## SKY COLOR HELPER

行 6370〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6373 | 0 |

## WEATHER EMOJI

行 6394〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6403 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6410 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6429 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6430 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6431 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6440 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6462 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6475 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6488 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6502 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6550 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6564 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6569〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6572 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6575 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6627 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6644 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6652 | 1：`updateParticles` |

## 時刻選択

行 6659〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6674 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6675 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6682 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6690 | 0 |
| `positionScrubLine` 📝 | 関数 | 6696 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6717 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6733 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6755 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6775 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6780 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6786 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6818 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6826 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6836 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6849 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6947 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6979 | 1：（トップレベル） |

## MAP — レイヤー定義

行 7004〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 7009 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 7010 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 7013 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 7026 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 7030 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 7033 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7124 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7125 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7127 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7131 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7138 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7139 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7146 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7148 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7149 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7151 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7152 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7153 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7154 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7155 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7156 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7157 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7158 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7160 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7161 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7162 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7163 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7164 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7167 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7170 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7171 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7172 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7178 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7186 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7189 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7190 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7195 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7196 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7206 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7220 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7225 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7242 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7243 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7248 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7250 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7310 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7311 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7315 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7316 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7319 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7327 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7342 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7354 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7361 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7441 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7455〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7460 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7465 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7468 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7485 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7489 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7493 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7503 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7518 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7539 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7540 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7541 | 0 |
| `DEM_SRC` 📝 | 定数 | 7544 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7550 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7551 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7554 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7562 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7571 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7595 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7600 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7605 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7607 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7619 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7661 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7664 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7688 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7692 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7715 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7752 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7756 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7776 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7787 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7791 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7807 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7812 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7825 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7845 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7867 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7881 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7885 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7886 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7887 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7890 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7891 | 1：`csCompute` |
| `csPushTime` | 関数 | 7892 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7893 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7896 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7905 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7914 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7916 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7928 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 7949 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 7963 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 7977 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 7986 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 7992 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 8006 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 8037 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 8038 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 8040 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 8041 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 8042 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 8043 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 8045 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 8046 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 8047 | 1：（トップレベル） |
| `windExpSave` | 関数 | 8054 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 8060 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 8066 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 8076 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8090 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8103 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8104 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8105 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8106 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8115 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8129 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8151 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8161 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8165 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8170 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8188 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8189 | 1：`wdPlan` |
| `wd` | 状態 | 8191 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8193 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8203 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8219 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8224 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8226 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8231 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8237 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8259 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8269 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8277 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8287 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8312 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8314 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8318 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8320 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8329 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8351 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8374 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8399 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8410 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8463 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8465 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8480 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8488 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8492 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8495 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8512 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8514 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8519 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8530 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8559 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8561 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8606 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8621 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8654 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8658 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8663 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8688 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8689 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8692 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8693 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8695 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8706 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8731 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8732 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8733 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8734 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8737 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8748 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8755 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8766 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8781 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8786 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8809 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8812 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8826 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8889 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8906〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8923 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8924 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8929 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8933 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8938 | 0 |
| `radarNowWet` | 関数 | 8977 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8985 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8998 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 9007 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 9039 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 9049 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 9056 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 9085 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 9086 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9087 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9088 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9131 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9132 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9143 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9144 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9145 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9146 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9160 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9176〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9191 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9192 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9193 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9194 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9197 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9201 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9202 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9203 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9205 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9211 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9239 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9284〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9299 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9307 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9311 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9313 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9314 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9316 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9317 | 1：`windBand` |
| `windBand` | 関数 | 9318 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9320 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9322 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9323 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9324 | 1：（トップレベル） |
| `windDirName` | 関数 | 9326 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9332 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9342 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9347 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9422 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9441 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9442 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9449 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9456 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9491 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9496 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9504 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9523 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9543 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9560 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9612 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9626 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9627 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9628 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9630 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9631 | 1：`ensureWindField` |
| `windError` | 関数 | 9632 | 1：`ensureWindField` |
| `windClear` | 関数 | 9633 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9637 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9707 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9726 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9741 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9769 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9873 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9877〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9892 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9905 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9909 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9913 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9922 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 9936 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 9951 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 9953 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9969 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9985 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9995〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 10009 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 10023 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 10032 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 10039 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 10040 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 10041 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 10043 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 10058 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 10073 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10088 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10103 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10105 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10121 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10136 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10148〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10161 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10180 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10182 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10193 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10206 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10208 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10223 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10235 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10248 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10254 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10256 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10268 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10272 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10329〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10351 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10370 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10388 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10392 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10403 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10428 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10441 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10447 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10468 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10483 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10486 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10487 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10488 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10493 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10494 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10495 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10496 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10502 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10507 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10511 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10516 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10521 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10527 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10534 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10541 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10550 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10556 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10580 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10590 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10595 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10611 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10664 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10671 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10672 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10676 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10718 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10726 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10728 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10770 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10779 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10852〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10870 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10880 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10893 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10899 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10900 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10902 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10910 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10917 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10925 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 10940 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 10951 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 11026 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 11051 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 11057〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 11081 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11087 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11096 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11112 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11113 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11116 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11139 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11167 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11173 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11218 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11244 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11251 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11350 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11365 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11366 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11565 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11582 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11594 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11602 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11609 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11614 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11615 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11616 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11617 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11618 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11633 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11646 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11675 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11708 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11736 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11754 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11767 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11797 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11807 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11830 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11831 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11863 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11910 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11914 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 11932 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 11939 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 11940 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11965 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 12015 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 12025 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 12026 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 12044 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 12046 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 12059 | 1：`windGLHud` |
| `terrainKey` | 関数 | 12081 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 12085 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12094 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12101 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12106 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12107 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12108 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12113 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12128 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12143 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12157 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12161 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12174 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12194 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12204 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12213 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12227 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12254 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12350 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12368 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12408 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12420 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12432 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12434 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12439 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12449 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12477 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12506 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12537 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12546 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12556 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12561 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12569 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12570 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12576 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12583 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12590 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12592 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12617 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12632 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12633 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12634 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12635 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12639 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12648 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12660 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12676 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12752 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12753 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12754 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12755 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12756 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12757 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12759 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12764 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12779 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12785 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12791 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12800 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12808 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12859 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12899 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12907 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12925 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12930 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 12936 | 1：（HTML） |
| `stepMapTime` | 関数 | 12937 | 1：（HTML） |
| `mapTimeNow` | 関数 | 12938 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 12950 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 12951 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 12952 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 12959 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 12963 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12968 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12971 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12974 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12980 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12981 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12986 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 13049 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 13050 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 13053 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 13066 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13100 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13110 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13122 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13129 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13135 | 1：`blendChips` |
| `blendChips` | 関数 | 13144 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13151 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13152 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13159 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13180 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13185 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13213 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13221 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13229 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13314 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13333 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13351 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13352 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13359 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13378 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13386 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13393 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13407 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13415 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13436 | 1：（HTML） |
| `sectionLayers` | 関数 | 13440 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13441 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13443 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13452 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13461 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13469 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13491 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13503 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13504 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13505 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13506 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13507 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13510 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13513 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13518 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13532 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13555 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13566 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13589 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13595 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13605 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13612 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13627 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13630 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13642 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13674 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13685 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13692 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13699 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13708 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13740 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13810〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13813 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13814 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13817 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13831 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13839 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13845 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13872 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13881 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13885 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13912 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13916 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 13937 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 13943 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 13982 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 13986 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 13993 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 14019 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 14029 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 14033 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 14058 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 14059 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 14060 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 14064 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 14068 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 14078 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 14085 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14107 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14114 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14121 | 1：`toggleLayerPanel` |
| `bootOut` 📝 | 関数 | 14144 | 2：`bootFinish`、`fetchWeather` |
| `bootNavInfo` 📝 | 関数 | 14145 | 1：`bootRecord` |
| `bootRecord` 📝 | 関数 | 14161 | 1：`bootSave` |
| `bootLogPush` 📝 | 関数 | 14171 | 1：`bootSave` |
| `loadBootLog` 📝 | 関数 | 14176 | 3：`bootLogText`、`bootSave`、`refreshBootLogView` |
| `bootSave` 📝 | 関数 | 14182 | 2：`bootAmend`、`bootFinish` |
| `bootFinish` 📝 | 関数 | 14187 | 2：`fetchWeather`、`render` |
| `bootAmend` 📝 | 関数 | 14195 | 2：`fetchWeather`、`render` |
| `BOOT_OUT_LABEL` | 定数 | 14197 | 2：`bootHeadline`、`bootRows` |
| `bootSec` 📝 | 関数 | 14198 | 4：`bootHeadline`、`bootLogText`、`bootRows`、`refreshBootLogView` |
| `bootTotal` 📝 | 関数 | 14200 | 1：`bootHeadline` |
| `bootRows` 📝 | 関数 | 14207 | 2：`bootLogText`、`refreshBootLogView` |
| `bootWhen` 📝 | 関数 | 14238 | 1：`bootHeadline` |
| `bootHeadline` 📝 | 関数 | 14243 | 2：`bootLogText`、`refreshBootLogView` |
| `refreshBootLogView` 📝 | 関数 | 14250 | 1：`toggleLayerPanel` |
| `bootLogText` 📝 | 関数 | 14268 | 1：`copyBootLog` |
| `copyBootLog` 📝 | 関数 | 14275 | 1：（HTML） |
| `clearTileCache` 📝 | 関数 | 14283 | 1：（HTML） |
| `AREA_LS` | 定数 | 14298 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14299 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14300 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14301 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14303 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14310 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14315 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14325 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14340 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14350 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14355 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14360 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14365 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14366 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14367 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14445 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14458 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14500 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14515 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14522 | 4：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14530〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14555 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14562 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14584 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `LOCATE_FLY_S` | 定数 | 14602 | 1：`locateFlyToMe` |
| `locateFlyToMe` 📝 | 関数 | 14604 | 2：`onGeoUpdate`、`setLocateMode` |
| `cycleLocate` 📝 | 関数 | 14610 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14616 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14634 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14653 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14666 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14682 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14696 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14729 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14756 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `showOrientDiag` | 関数 | 14773 | 1：`enableHeading` |
| `applyNotchSide` | 関数 | 14786 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14794 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14802 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14813 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14825 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14833 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14869 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14870 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14871 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14874 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14880 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14881 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14887 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14929 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 14930 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 14931 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 14937 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 14942 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 15016 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 15017 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 15022 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 15034 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 15038 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 15046 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 15063 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 15064 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 15078 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 15096 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 15148 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 15169 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 15173 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 15177 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 15196 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 15199 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 15212 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 15213 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 15239 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 15256 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15259 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15265 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15326 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15327 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15344 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15467 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15468 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15469 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15476 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15496〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15504 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15505 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15507 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15514 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15518 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15522 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15532 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15541 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15624〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15632 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15642 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15650 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15651 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15661 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15676 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15691 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15698 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15702 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15708 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15719 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15738 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15766 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15773 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15783 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15788 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15795 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15798 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15806 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15812 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15821 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15836 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15841 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15852 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15858 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15868 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15885 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15921 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 15931 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 15947 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 15948 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 16024 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 16025 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 16034〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 16039 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 16044 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 16049 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 16053 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 16064 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 16065 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 16077 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 16098 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 16101 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 16115 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 16136 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 16172〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 16182 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 16185 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 16188 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 16189 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 16190 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 16191 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 16192 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 16195 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 16221 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 16222 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 16223 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 16224 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 16229 | 1：`utmResult` |
| `utmResult` | 関数 | 16234 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 16241 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16265 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16277 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16311 | 2：`copyBootLog`、`openCoordSheet` |
| `flashCopied` | 関数 | 16324 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16332 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16374 | 1：（HTML） |

## FAVORITES

行 16386〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16389 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16393 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16406 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16407 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16408 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16409 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16410 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16412 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16417 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16426 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16429 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16430 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16491 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16523 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16527 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16533 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16537 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16686 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16697〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16703 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16704 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16705 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16708 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16709 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16712 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16721 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16726 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16751 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16794 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16803 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16826 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16864 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16865 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16870 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16880 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 16964 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 16973 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 17008 | 1：（HTML） |
| `openRank` 📝 | 関数 | 17018 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 17030 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 17034〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 17045 | 1：（HTML） |
| `setWindMode` | 関数 | 17054 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 17061 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 17069 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 17077 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 17085 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 17094 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 17123 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 17181 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 17188〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 17191 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 17194 | 1：（トップレベル） |

## LOADING OVERLAY

行 17199〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 17202 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 17208 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 17253〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17269 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17270 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17280 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17285 | 1：（HTML） |
| `closeWxMap` | 関数 | 17289 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17292 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17298 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17306 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17322 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17332 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17341 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17356 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17366 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17395〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17398 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17401 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17422 | 14：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか8 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17432 | 1：（トップレベル） |

