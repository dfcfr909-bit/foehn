# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,548行／本体の `<script>` は 2987〜17545 行
- トップレベルの宣言 1098（関数 781・定数と状態 317）／ブロック 40
- `code_map.md` に説明があるもの：628／1098（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2988：起動の内訳の計測（v4.185.0・#227）（7）
- 行 3026：STATE（16）
- 行 3228：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3470：DATA FETCH（31）
- 行 3982：GPS（2）
- 行 4019：RENDER MASTER（43）
- 行 4491：HUD（28）
- 行 4859：ABC JUDGMENT（6）
- 行 4938：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（89）
- 行 6419：SKY COLOR HELPER（1）
- 行 6443：WEATHER EMOJI（12）
- 行 6618：PARTICLES (雨・雪エフェクト)（5）
- 行 6709：時刻選択（18）
- 行 7072：MAP — レイヤー定義（55）
- 行 7523：MAP — 本体（140）
- 行 8974：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9244：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9352：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9945：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 10063：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10216：風の流れ（Particle Engine）（13）
- 行 10397：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10920：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 11125：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13878：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（67）
- 行 14598：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（62）
- 行 15566：検索の履歴（選んだ地点）（8）
- 行 15694：手元の山の検索（#171・第1段階）（33）
- 行 16104：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 16242：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16456：FAVORITES（18）
- 行 16767：RANKING（全国山域ランキング）（21）
- 行 17104：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 17258：LOCALSTORAGE – 最終地点（2）
- 行 17269：LOADING OVERLAY（2）
- 行 17323：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17465：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## 起動の内訳の計測（v4.185.0・#227）

行 2988〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `BOOT_LS_LOG` 📝 | 定数 | 2999 | 2：`bootSave`、`loadBootLog` |
| `BOOT_SS_HOP` 📝 | 定数 | 3000 | 1：（トップレベル） |
| `BOOT_LOG_KEEP` 📝 | 定数 | 3001 | 1：`bootLogPush` |
| `BOOT_HOP_MAX_MS` | 定数 | 3002 | 1：（トップレベル） |
| `bootTime` 📝 | 状態 | 3003 | 8：`bootAmend`、`bootFinish`、`bootMark`、`bootOut`、`bootRecord`、`fetchWeather` ほか2 |
| `bootMark` 📝 | 関数 | 3004 | 4：`applyWeatherJson`、`fetchWeather`、`render`、（トップレベル） |
| `bootOrigin` 📝 | 関数 | 3009 | 2：`bootRecord`、（トップレベル） |

## STATE

行 3026〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 3029 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 3047 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 3062 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 3066 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 3082 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 3097 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3127 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3129 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3130 | 3：`fetchRankData`、`summitWindAt`、`wxForecastUrl` |
| `MSM_BLEND_HOURS` | 定数 | 3133 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3143 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3144 | 3：`makeHintEngine`、`processData`、`windRecHydrate` |
| `summitWindAt` 📝 | 関数 | 3159 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3200 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3206 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3219 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3228〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3252 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3253 | 3：`trimWxCache`、`wxDb`、`wxStore` |
| `WX_WIND_STORE` | 定数 | 3254 | 4：`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxDb` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3255 | 6：`fetchWeather`、`renderFavPrefetch`、`setWxSource`、`trimWxCache`、`windRecord`、`windUseSaved` |
| `WX_STALE_MS` 📝 | 定数 | 3256 | 3：`fetchWeather`、`setWxSource`、`windSavedNote` |
| `WX_MAX_BYTES` 📝 | 定数 | 3260 | 1：`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3261 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3265 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3268 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3284 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3292 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3298 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3308 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3329 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3332 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3354 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3364 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3389 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3424 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3432 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3445 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3470〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3485 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3491 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3493 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3500 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3512 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3533 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3537 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3545 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3551 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3585 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3590 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3592 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3712 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3717 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3754 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3761 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3770 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3793 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3815 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3819 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3833 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3852 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3869 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3878 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3909 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3923 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3924 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3925 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3926 | 1：`processData` |
| `summitGustRange` | 関数 | 3931 | 1：`processData` |
| `processData` 📝 | 関数 | 3936 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3982〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3985 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 4010 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 4019〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 4026 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 4056 | 1：`render` |
| `FAV_STEP` | 定数 | 4063 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 4065 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 4066 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 4079 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 4080 | 1：`favCircular` |
| `favCount` | 関数 | 4081 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 4082 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 4084 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 4090 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 4100 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 4109 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 4115 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4122 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4124 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4139 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4143 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4144 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4150 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4162 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4167 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4178 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4183 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4190 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4200 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4212 | 0 |
| `saveHome` | 関数 | 4213 | 0 |
| `goHome` | 関数 | 4214 | 0 |
| `currentFavChip` | 関数 | 4218 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4224 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4229 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4275 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4310 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4345 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4358 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4376 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4388 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4400 | 1：`selectFav` |
| `LOCATE_GO_ZOOM` 📝 | 定数 | 4405 | 2：`fetchGPS`、`locateFlyToMe` |
| `SEARCH_GO_ZOOM` 📝 | 定数 | 4406 | 3：`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `selectFav` 📝 | 関数 | 4408 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4420 | 1：（トップレベル） |

## HUD

行 4491〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4494 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4500 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4506 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4509 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4514 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4519 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4530 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4550 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4555 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4571 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4579 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4597 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4598 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4599 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4609 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4614 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4630 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4631 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4632 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4640 | 1：`peakAt` |
| `peakAt` | 関数 | 4641 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4655 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4683 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4727 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4743 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4822 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4837 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4838 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4859〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4864 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4865 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4867 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4873 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4880 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4924 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4938〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4944 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4945 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4946 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4947 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4948 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4950 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4959 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4960 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4964 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4969 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4978 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4979 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4985 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4986 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4994 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4995 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4996 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4997 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4998 | 1：`hoursPerScreen` |
| `WIDE_GRAPH_MQ` 📝 | 定数 | 5000 | 1：`isWideGraph` |
| `HOURS_PER_SCREEN_WIDE` | 定数 | 5001 | 1：`hoursPerScreen` |
| `isWideGraph` 📝 | 関数 | 5002 | 4：`buildCharts`、`hoursPerScreen`、`updateParticles`、（トップレベル） |
| `hoursPerScreen` 📝 | 関数 | 5005 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 5006 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 5007 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 5015 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 5018 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 5021 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 5023 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5198 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5199 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5200 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5212 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5213 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5214 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5215 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5216 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5219 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5237 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5249 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5261 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5270 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5289 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5304 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5413 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5424 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5549 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5608 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5626 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5630 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5631 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5633 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5636 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5640 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5643 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5656 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5670 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5685 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5728 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5742 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5756 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5759 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5760 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5761 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5762 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5764 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5773 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5814 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5823 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5830 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5995 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 6040 | 1：`feelColor` |
| `feelColor` | 関数 | 6050 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 6069 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 6110 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 6118 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 6125 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6136 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6153 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6175 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6181 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6190 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6218 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6301 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6349 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6366 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6374 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6397 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6403 | 1：（HTML） |

## SKY COLOR HELPER

行 6419〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6422 | 0 |

## WEATHER EMOJI

行 6443〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6452 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6459 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6478 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6479 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6480 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6489 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6511 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6524 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6537 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6551 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6599 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6613 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6618〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6621 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6624 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6677 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6694 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6702 | 1：`updateParticles` |

## 時刻選択

行 6709〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6724 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6725 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6732 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6740 | 0 |
| `positionScrubLine` 📝 | 関数 | 6746 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6767 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6783 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6805 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6825 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6830 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6836 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6868 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6876 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6886 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6899 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6997 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 7029 | 1：（トップレベル） |
| `TOUCH_AXIS_PX` | 定数 | 7038 | 1：（トップレベル） |

## MAP — レイヤー定義

行 7072〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 7077 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 7078 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 7081 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 7094 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 7098 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 7101 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7192 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7193 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7195 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7199 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7206 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7207 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7214 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7216 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7217 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7219 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7220 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7221 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7222 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7223 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7224 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7225 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7226 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7228 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7229 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7230 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7231 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7232 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7235 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7238 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7239 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7240 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7246 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7254 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7257 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7258 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7263 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7264 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7274 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7288 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7293 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7310 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7311 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7316 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7318 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7378 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7379 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7383 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7384 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7387 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7395 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7410 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7422 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7429 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7509 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7523〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7528 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7533 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7536 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7553 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7557 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7561 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7571 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7586 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7607 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7608 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7609 | 0 |
| `DEM_SRC` 📝 | 定数 | 7612 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7618 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7619 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7622 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7630 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7639 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7663 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7668 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7673 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7675 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7687 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7729 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7732 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7756 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7760 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7783 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7820 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7824 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7844 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7855 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7859 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7875 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7880 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7893 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7913 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7935 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7949 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7953 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7954 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7955 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7958 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7959 | 1：`csCompute` |
| `csPushTime` | 関数 | 7960 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7961 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7964 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7973 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7982 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7984 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7996 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 8017 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 8031 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 8045 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 8054 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 8060 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 8074 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 8105 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 8106 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 8108 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 8109 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 8110 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 8111 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 8113 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 8114 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 8115 | 1：（トップレベル） |
| `windExpSave` | 関数 | 8122 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 8128 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 8134 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 8144 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8158 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8171 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8172 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8173 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8174 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8183 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8197 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8219 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8229 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8233 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8238 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8256 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8257 | 1：`wdPlan` |
| `wd` | 状態 | 8259 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8261 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8271 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8287 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8292 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8294 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8299 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8305 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8327 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8337 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8345 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8355 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8380 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8382 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8386 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8388 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8397 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8419 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8442 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8467 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8478 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8531 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8533 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8548 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8556 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8560 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8563 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8580 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8582 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8587 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8598 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8627 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8629 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8674 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8689 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8722 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8726 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8731 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8756 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8757 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8760 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8761 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8763 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8774 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8799 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8800 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8801 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8802 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8805 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8816 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8823 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8834 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8849 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8854 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8877 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8880 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8894 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8957 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8974〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8991 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8992 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8997 | 1：`radarUsable` |
| `radarUsable` | 関数 | 9001 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 9006 | 0 |
| `radarNowWet` | 関数 | 9045 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 9053 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 9066 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 9075 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 9107 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 9117 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 9124 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 9153 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 9154 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9155 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9156 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9199 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9200 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9211 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9212 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9213 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9214 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9228 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9244〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9259 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9260 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9261 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9262 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9265 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9269 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9270 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9271 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9273 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9279 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9307 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9352〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9367 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9375 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9379 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9381 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9382 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9384 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9385 | 1：`windBand` |
| `windBand` | 関数 | 9386 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9388 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9390 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9391 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9392 | 1：（トップレベル） |
| `windDirName` | 関数 | 9394 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9400 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9410 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9415 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9490 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9509 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9510 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9517 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9524 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9559 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9564 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9572 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9591 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9611 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9628 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9680 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9694 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9695 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9696 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9698 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9699 | 1：`ensureWindField` |
| `windError` | 関数 | 9700 | 1：`ensureWindField` |
| `windClear` | 関数 | 9701 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9705 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9775 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9794 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9809 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9837 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9941 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9945〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9960 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9973 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9977 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9981 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9990 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 10004 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 10019 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 10021 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 10037 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 10053 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 10063〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 10077 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 10091 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 10100 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 10107 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 10108 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 10109 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 10111 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 10126 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 10141 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10156 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10171 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10173 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10189 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10204 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10216〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10229 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10248 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10250 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10261 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10274 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10276 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10291 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10303 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10316 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10322 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10324 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10336 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10340 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10397〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10419 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10438 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10456 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10460 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10471 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10496 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10509 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10515 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10536 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10551 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10554 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10555 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10556 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10561 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10562 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10563 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10564 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10570 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10575 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10579 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10584 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10589 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10595 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10602 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10609 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10618 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10624 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10648 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10658 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10663 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10679 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10732 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10739 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10740 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10744 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10786 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10794 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10796 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10838 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10847 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10920〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10938 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10948 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10961 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10967 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10968 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10970 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10978 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10985 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10993 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 11008 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 11019 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 11094 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 11119 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 11125〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 11149 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11155 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11164 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11180 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11181 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11184 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11207 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11235 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11241 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11286 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11312 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11319 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11418 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11433 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11434 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11633 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11650 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11662 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11670 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11677 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11682 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11683 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11684 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11685 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11686 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11701 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11714 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11743 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11776 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11804 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11822 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11835 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11865 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11875 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11898 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11899 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11931 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11978 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11982 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 12000 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 12007 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 12008 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 12033 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 12083 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 12093 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 12094 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 12112 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 12114 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 12127 | 1：`windGLHud` |
| `terrainKey` | 関数 | 12149 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 12153 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12162 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12169 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12174 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12175 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12176 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12181 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12196 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12211 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12225 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12229 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12242 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12262 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12272 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12281 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12295 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12322 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12418 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12436 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12476 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12488 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12500 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12502 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12507 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12517 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12545 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12574 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12605 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12614 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12624 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12629 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12637 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12638 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12644 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12651 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12658 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12660 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12685 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12700 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12701 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12702 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12703 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12707 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12716 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12728 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12744 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12820 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12821 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12822 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12823 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12824 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12825 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12827 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12832 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12847 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12853 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12859 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12868 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12876 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12927 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12967 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12975 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12993 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12998 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 13004 | 1：（HTML） |
| `stepMapTime` | 関数 | 13005 | 1：（HTML） |
| `mapTimeNow` | 関数 | 13006 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 13018 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 13019 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 13020 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 13027 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 13031 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 13036 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 13039 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 13042 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 13048 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 13049 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 13054 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 13117 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 13118 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 13121 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 13134 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13168 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13178 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13190 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13197 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13203 | 1：`blendChips` |
| `blendChips` | 関数 | 13212 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13219 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13220 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13227 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13248 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13253 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13281 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13289 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13297 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13382 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13401 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13419 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13420 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13427 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13446 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13454 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13461 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13475 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13483 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13504 | 1：（HTML） |
| `sectionLayers` | 関数 | 13508 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13509 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13511 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13520 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13529 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13537 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13559 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13571 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13572 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13573 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13574 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13575 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13578 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13581 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13586 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13600 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13623 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13634 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13657 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13663 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13673 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13680 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13695 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13698 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13710 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13742 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13753 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13760 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13767 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13776 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13808 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13878〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13881 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13882 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13885 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13899 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13907 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13913 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13940 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13949 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13953 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13980 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13984 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 14005 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 14011 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 14050 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 14054 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 14061 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 14087 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 14097 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 14101 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 14126 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 14127 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 14128 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 14132 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 14136 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 14146 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 14153 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14175 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14182 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14189 | 1：`toggleLayerPanel` |
| `bootOut` 📝 | 関数 | 14212 | 2：`bootFinish`、`fetchWeather` |
| `bootNavInfo` 📝 | 関数 | 14213 | 1：`bootRecord` |
| `bootRecord` 📝 | 関数 | 14229 | 1：`bootSave` |
| `bootLogPush` 📝 | 関数 | 14239 | 1：`bootSave` |
| `loadBootLog` 📝 | 関数 | 14244 | 3：`bootLogText`、`bootSave`、`refreshBootLogView` |
| `bootSave` 📝 | 関数 | 14250 | 2：`bootAmend`、`bootFinish` |
| `bootFinish` 📝 | 関数 | 14255 | 2：`fetchWeather`、`render` |
| `bootAmend` 📝 | 関数 | 14263 | 2：`fetchWeather`、`render` |
| `BOOT_OUT_LABEL` | 定数 | 14265 | 2：`bootHeadline`、`bootRows` |
| `bootSec` 📝 | 関数 | 14266 | 4：`bootHeadline`、`bootLogText`、`bootRows`、`refreshBootLogView` |
| `bootTotal` 📝 | 関数 | 14268 | 1：`bootHeadline` |
| `bootRows` 📝 | 関数 | 14275 | 2：`bootLogText`、`refreshBootLogView` |
| `bootWhen` 📝 | 関数 | 14306 | 1：`bootHeadline` |
| `bootHeadline` 📝 | 関数 | 14311 | 2：`bootLogText`、`refreshBootLogView` |
| `refreshBootLogView` 📝 | 関数 | 14318 | 1：`toggleLayerPanel` |
| `bootLogText` 📝 | 関数 | 14336 | 1：`copyBootLog` |
| `copyBootLog` 📝 | 関数 | 14343 | 1：（HTML） |
| `clearTileCache` 📝 | 関数 | 14351 | 1：（HTML） |
| `AREA_LS` | 定数 | 14366 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14367 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14368 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14369 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14371 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14378 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14383 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14393 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14408 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14418 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14423 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14428 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14433 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14434 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14435 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14513 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14526 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14568 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14583 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14590 | 4：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14598〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 14623 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14630 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14652 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `LOCATE_FLY_S` | 定数 | 14670 | 1：`locateFlyToMe` |
| `locateFlyToMe` 📝 | 関数 | 14672 | 2：`onGeoUpdate`、`setLocateMode` |
| `cycleLocate` 📝 | 関数 | 14678 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14684 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14702 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14721 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14734 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14750 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14764 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14797 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14824 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `showOrientDiag` | 関数 | 14841 | 1：`enableHeading` |
| `applyNotchSide` | 関数 | 14854 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14862 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14870 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14881 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14893 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14903 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14939 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14940 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14941 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14944 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14950 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14951 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 14957 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 14999 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 15000 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 15001 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 15007 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 15012 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 15086 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 15087 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 15092 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 15104 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 15108 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 15116 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 15133 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 15134 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 15148 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 15166 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 15218 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 15239 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 15243 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 15247 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 15266 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 15269 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 15282 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 15283 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 15309 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 15326 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15329 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15335 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15396 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15397 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15414 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15537 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15538 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15539 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15546 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15566〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15574 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15575 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15577 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15584 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15588 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15592 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15602 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15611 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15694〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15702 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15712 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15720 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15721 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15731 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15746 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15761 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15768 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15772 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15778 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15789 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15808 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15836 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15843 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15853 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15858 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15865 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15868 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15876 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15882 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15891 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15906 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15911 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15922 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15928 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15938 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 15955 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 15991 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 16001 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 16017 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 16018 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 16094 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 16095 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 16104〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 16109 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 16114 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 16119 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 16123 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 16134 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 16135 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 16147 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 16168 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 16171 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 16185 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 16206 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 16242〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 16252 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 16255 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 16258 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 16259 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 16260 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 16261 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 16262 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 16265 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 16291 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 16292 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 16293 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 16294 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 16299 | 1：`utmResult` |
| `utmResult` | 関数 | 16304 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 16311 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16335 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16347 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16381 | 2：`copyBootLog`、`openCoordSheet` |
| `flashCopied` | 関数 | 16394 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16402 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16444 | 1：（HTML） |

## FAVORITES

行 16456〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16459 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16463 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16476 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16477 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16478 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16479 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16480 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16482 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16487 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16496 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16499 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16500 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16561 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16593 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16597 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16603 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16607 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16756 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16767〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16773 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16774 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16775 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16778 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16779 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16782 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16791 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16796 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16821 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16864 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16873 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16896 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16934 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16935 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16940 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16950 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 17034 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 17043 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 17078 | 1：（HTML） |
| `openRank` 📝 | 関数 | 17088 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 17100 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 17104〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 17115 | 1：（HTML） |
| `setWindMode` | 関数 | 17124 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 17131 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 17139 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 17147 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 17155 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 17164 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 17193 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 17251 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 17258〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 17261 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 17264 | 1：（トップレベル） |

## LOADING OVERLAY

行 17269〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 17272 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 17278 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 17323〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17339 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17340 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17350 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17355 | 1：（HTML） |
| `closeWxMap` | 関数 | 17359 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17362 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17368 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17376 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17392 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17402 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17411 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17426 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17436 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17465〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17468 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17471 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17492 | 14：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか8 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17502 | 1：（トップレベル） |

