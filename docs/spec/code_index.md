# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：17,593行／本体の `<script>` は 2988〜17590 行
- トップレベルの宣言 1103（関数 784・定数と状態 319）／ブロック 40
- `code_map.md` に説明があるもの：632／1103（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2989：起動の内訳の計測（v4.185.0・#227）（7）
- 行 3027：STATE（16）
- 行 3229：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（21）
- 行 3471：DATA FETCH（31）
- 行 3983：GPS（2）
- 行 4020：RENDER MASTER（43）
- 行 4492：HUD（28）
- 行 4860：ABC JUDGMENT（6）
- 行 4939：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（89）
- 行 6420：SKY COLOR HELPER（1）
- 行 6444：WEATHER EMOJI（12）
- 行 6619：PARTICLES (雨・雪エフェクト)（5）
- 行 6710：時刻選択（18）
- 行 7073：MAP — レイヤー定義（55）
- 行 7524：MAP — 本体（140）
- 行 8975：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 9245：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 9353：高度別の風の場（Wind Field Engine）— ADR-0012（41）
- 行 9946：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 10064：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 10217：風の流れ（Particle Engine）（13）
- 行 10398：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 10921：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 11126：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（188）
- 行 13879：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（67）
- 行 14599：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（67）
- 行 15611：検索の履歴（選んだ地点）（8）
- 行 15739：手元の山の検索（#171・第1段階）（33）
- 行 16149：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 16287：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 16501：FAVORITES（18）
- 行 16812：RANKING（全国山域ランキング）（21）
- 行 17149：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 17303：LOCALSTORAGE – 最終地点（2）
- 行 17314：LOADING OVERLAY（2）
- 行 17368：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 17510：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## 起動の内訳の計測（v4.185.0・#227）

行 2989〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `BOOT_LS_LOG` 📝 | 定数 | 3000 | 2：`bootSave`、`loadBootLog` |
| `BOOT_SS_HOP` 📝 | 定数 | 3001 | 1：（トップレベル） |
| `BOOT_LOG_KEEP` 📝 | 定数 | 3002 | 1：`bootLogPush` |
| `BOOT_HOP_MAX_MS` | 定数 | 3003 | 1：（トップレベル） |
| `bootTime` 📝 | 状態 | 3004 | 8：`bootAmend`、`bootFinish`、`bootMark`、`bootOut`、`bootRecord`、`fetchWeather` ほか2 |
| `bootMark` 📝 | 関数 | 3005 | 4：`applyWeatherJson`、`fetchWeather`、`render`、（トップレベル） |
| `bootOrigin` 📝 | 関数 | 3010 | 2：`bootRecord`、（トップレベル） |

## STATE

行 3027〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 3030 | 79：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか73 |
| `PAST_HOURS` 📝 | 定数 | 3048 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 3063 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 3067 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 3083 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 3098 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 3128 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 3130 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 3131 | 3：`fetchRankData`、`summitWindAt`、`wxForecastUrl` |
| `MSM_BLEND_HOURS` | 定数 | 3134 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 3144 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 3145 | 3：`makeHintEngine`、`processData`、`windRecHydrate` |
| `summitWindAt` 📝 | 関数 | 3160 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3201 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3207 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3220 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3229〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3253 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3254 | 3：`trimWxCache`、`wxDb`、`wxStore` |
| `WX_WIND_STORE` | 定数 | 3255 | 4：`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxDb` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3256 | 6：`fetchWeather`、`renderFavPrefetch`、`setWxSource`、`trimWxCache`、`windRecord`、`windUseSaved` |
| `WX_STALE_MS` 📝 | 定数 | 3257 | 3：`fetchWeather`、`setWxSource`、`windSavedNote` |
| `WX_MAX_BYTES` 📝 | 定数 | 3261 | 1：`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3262 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3266 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3269 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3285 | 5：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact` |
| `wxStore` 📝 | 関数 | 3293 | 6：`loadWxCache`、`prefetchFavs`、`trimWxCache`、`windUseSaved`、`wxRecordExact`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3299 | 4：`loadWxCache`、`saveWxCache`、`saveWxSupplemental`、`wxRecordExact` |
| `wxUpdate` 📝 | 関数 | 3309 | 2：`saveWxCache`、`saveWxSupplemental` |
| `wxRecSize` 📝 | 関数 | 3330 | 4：`prefetchFavs`、`saveWxCache`、`saveWxSupplemental`、`trimWxCache` |
| `saveWxCache` 📝 | 関数 | 3333 | 2：`fetchWeather`、`prefetchFavs` |
| `saveWxSupplemental` 📝 | 関数 | 3355 | 2：`fetchSupplemental`、`prefetchFavs` |
| `loadWxCache` 📝 | 関数 | 3365 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3390 | 2：`prefetchFavs`、`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3425 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `wxStampText` 📝 | 関数 | 3433 | 3：`renderFavPrefetch`、`setWxSource`、`windSavedNote` |
| `setWxSource` 📝 | 関数 | 3446 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3471〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3486 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3492 | 11：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`prefetchFavs` ほか5 |
| `forecastModel` 📝 | 関数 | 3494 | 5：`fetchWeather`、`prefetchFavs`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3501 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3513 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3534 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3538 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3546 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3552 | 1：`openModelSheet` |
| `wxForecastUrl` 📝 | 関数 | 3586 | 2：`fetchWeather`、`prefetchFavs` |
| `WX_SOFT_MS` 📝 | 定数 | 3591 | 1：`fetchWeather` |
| `fetchWeather` 📝 | 関数 | 3593 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3713 | 2：`fetchWeather`、`prefetchFavs` |
| `applyWeatherJson` 📝 | 関数 | 3718 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3755 | 2：`applySupplemental`、`fetchSupplementalHourly` |
| `fetchSupplemental` 📝 | 関数 | 3762 | 1：`fetchWeather` |
| `fetchSupplementalHourly` 📝 | 関数 | 3771 | 2：`fetchSupplemental`、`prefetchFavs` |
| `applySupplemental` 📝 | 関数 | 3794 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3816 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3820 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3834 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3853 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3870 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3879 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3910 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3924 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3925 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3926 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3927 | 1：`processData` |
| `summitGustRange` | 関数 | 3932 | 1：`processData` |
| `processData` 📝 | 関数 | 3937 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3983〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3986 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 4011 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 4020〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 4027 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 4057 | 1：`render` |
| `FAV_STEP` | 定数 | 4064 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 4066 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 4067 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 4080 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 4081 | 1：`favCircular` |
| `favCount` | 関数 | 4082 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 4083 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 4085 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 4091 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 4101 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 4110 | 3：`renderFavList`、`sortedFavs`、`wdPlan` |
| `sortedFavs` | 関数 | 4116 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 4123 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 4125 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 4140 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 4144 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 4145 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 4151 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 4163 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 4168 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 4179 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 4184 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 4191 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 4201 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 4213 | 0 |
| `saveHome` | 関数 | 4214 | 0 |
| `goHome` | 関数 | 4215 | 0 |
| `currentFavChip` | 関数 | 4219 | 1：`centerActiveChip` |
| `favPos` | 関数 | 4225 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 4230 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 4276 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4311 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4346 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4359 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4377 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4389 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4401 | 1：`selectFav` |
| `LOCATE_GO_ZOOM` 📝 | 定数 | 4406 | 2：`fetchGPS`、`locateFlyToMe` |
| `SEARCH_GO_ZOOM` 📝 | 定数 | 4407 | 3：`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `selectFav` 📝 | 関数 | 4409 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4421 | 1：（トップレベル） |

## HUD

行 4492〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4495 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4501 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4507 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4510 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4515 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4520 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4531 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4551 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4556 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4572 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4580 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4598 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4599 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4600 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4610 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4615 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4631 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4632 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4633 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4641 | 1：`peakAt` |
| `peakAt` | 関数 | 4642 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4656 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4684 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4728 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4744 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4823 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4838 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4839 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4860〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4865 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4866 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4868 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4874 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4881 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4925 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4939〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4945 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4946 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4947 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4948 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4949 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4951 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4960 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4961 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4965 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4970 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4979 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4980 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4986 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4987 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4995 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4996 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4997 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4998 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4999 | 1：`hoursPerScreen` |
| `WIDE_GRAPH_MQ` 📝 | 定数 | 5001 | 1：`isWideGraph` |
| `HOURS_PER_SCREEN_WIDE` | 定数 | 5002 | 1：`hoursPerScreen` |
| `isWideGraph` 📝 | 関数 | 5003 | 4：`buildCharts`、`hoursPerScreen`、`updateParticles`、（トップレベル） |
| `hoursPerScreen` 📝 | 関数 | 5006 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 5007 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 5008 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 5016 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 5019 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 5022 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 5024 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 5199 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 5200 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 5201 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 5213 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 5214 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 5215 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 5216 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 5217 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 5220 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 5238 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 5250 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 5262 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 5271 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 5290 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 5305 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5414 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5425 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5550 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5609 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5627 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5631 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5632 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5634 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5637 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5641 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5644 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5657 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5671 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5686 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5729 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5743 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5757 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5760 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5761 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5762 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5763 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5765 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5774 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5815 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5824 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5831 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5996 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 6041 | 1：`feelColor` |
| `feelColor` | 関数 | 6051 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 6070 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 6111 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 6119 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 6126 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 6137 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 6154 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 6176 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 6182 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 6191 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 6219 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 6302 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6350 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6367 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6375 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6398 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6404 | 1：（HTML） |

## SKY COLOR HELPER

行 6420〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6423 | 0 |

## WEATHER EMOJI

行 6444〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6453 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6460 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6479 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6480 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6481 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6490 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6512 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6525 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6538 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6552 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6600 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6614 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6619〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6622 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6625 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6678 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6695 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6703 | 1：`updateParticles` |

## 時刻選択

行 6710〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6725 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6726 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6733 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6741 | 0 |
| `positionScrubLine` 📝 | 関数 | 6747 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6768 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6784 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6806 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6826 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6831 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6837 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6869 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6877 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6887 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6900 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6998 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 7030 | 1：（トップレベル） |
| `TOUCH_AXIS_PX` | 定数 | 7039 | 1：（トップレベル） |

## MAP — レイヤー定義

行 7073〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 7078 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 7079 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 7082 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 7095 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 7099 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 7102 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 7193 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 7194 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 7196 | 2：`sanitizeSetOverlays`、`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 7200 | 5：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs`、`sanitizeLayerSet` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 7207 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 7208 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 7215 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 7217 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 7218 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 7220 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 7221 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_CS_STRENGTH` | 定数 | 7222 | 1：`loadMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 7223 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 7224 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 7225 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 7226 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 7227 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 7229 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 7230 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 7231 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 7232 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 7233 | 4：`blendChips`、`loadMapPrefs`、`sanitizeLayerSet`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 7236 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 7239 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 7240 | 3：`applyLayerSet`、`blendOf`、`isLayerSetActive` |
| `isBlendable` | 関数 | 7241 | 9：`addTimedTileLayer`、`applyLayerSet`、`applyOverlays`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs` ほか3 |
| `blendOf` | 関数 | 7247 | 5：`applyBlendHost`、`blendChips`、`captureLayerSet`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 7255 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 7258 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 7259 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 7264 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 7265 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 7275 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 7289 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 7294 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 7311 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 7312 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 7317 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 7319 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7379 | 7：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`sanitizeLayerSet`、`setMapBase` ほか1 |
| `findOverlay` 📝 | 関数 | 7380 | 19：`applyLayerSet`、`applyOverlays`、`buildRrimLayers`、`captureLayerSet`、`isLayerSetActive`、`loadLayerSets` ほか13 |
| `usableOverlays` 📝 | 関数 | 7384 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7385 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7388 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7396 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7411 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7423 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7430 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7510 | 12：`applyLayerSet`、`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase` ほか6 |

## MAP — 本体

行 7524〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7529 | 37：`amedasElementChips`、`applyBaseLayer`、`applyLayerSet`、`applyOverlays`、`applyWxBlend`、`baseOpacity` ほか31 |
| `overlayTileLayers` | 状態 | 7534 | 7：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity`、`sxSync`、`wdClear` ほか1 |
| `tileOpts` 📝 | 関数 | 7537 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7554 | 9：`applyBaseLayer`、`applyLayerSet`、`captureLayerSet`、`isLayerSetActive`、`loadMapPrefs`、`mapPrefs` ほか3 |
| `paintBaseFaded` 📝 | 関数 | 7558 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7562 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7572 | 3：`applyLayerSet`、`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7587 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7608 | 1：`DEM_SRC` |
| `CI_PRM` 📝 | 定数 | 7609 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7610 | 0 |
| `DEM_SRC` 📝 | 定数 | 7613 | 4：`areaTile`、`csRenderTile`、`demFetchBlob`、`sxRenderTile` |
| `CI_BLOB_MAX` | 定数 | 7619 | 2：`ciDecodeMain`、`demFetchBlob` |
| `ciStats` 📝 | 状態 | 7620 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7623 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `decodeGsiDem` 📝 | 関数 | 7631 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7640 | 4：`CI_WORKER_FNS`、`computeCiTile`、`computeCsTile`、`computeSxTile` |
| `ciAcos` 📝 | 関数 | 7664 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7669 | 2：`ciRenderTile`、`csCompute` |
| `ciMargin` 📝 | 関数 | 7674 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7676 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7688 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `csMargin` 📝 | 関数 | 7730 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCsTile` 📝 | 関数 | 7733 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `sxMargin` 📝 | 関数 | 7757 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeSxTile` 📝 | 関数 | 7761 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7784 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7821 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7825 | 2：`ciRenderTile`、`csCompute` |
| `ciBreakWorker` 📝 | 関数 | 7845 | 1：`getCiWorker` |
| `ciTileKey` 📝 | 関数 | 7856 | 5：`areaTile`、`ciRenderTile`、`csGather`、`csRender1m`、`demFetchBlob` |
| `demFetchBlob` 📝 | 関数 | 7860 | 2：`ciFetchBlob`、`csGather` |
| `ciFetchBlob` 📝 | 関数 | 7876 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7881 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7894 | 2：`ciRenderTile`、`csCompute` |
| `ciRenderTile` 📝 | 関数 | 7914 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7936 | 1：`applyOverlays` |
| `CS_PRM` 📝 | 定数 | 7950 | 3：`CsLayerClass`、`csCompute`、`csCropPart` |
| `CS_PRM_1M` 📝 | 定数 | 7954 | 1：`csRender1m` |
| `CS_MISS_KEY` | 定数 | 7955 | 3：`csMissAny`、`csMissLoad`、`csMissMark` |
| `CS_MISS1A_KEY` 📝 | 定数 | 7956 | 2：`csRender1m`、`saveArea` |
| `csStats` 📝 | 状態 | 7959 | 2：`csCompute`、`csPushTime` |
| `CS_SRC_STAT` | 定数 | 7960 | 1：`csCompute` |
| `csPushTime` | 関数 | 7961 | 2：`csCompute`、`csGather` |
| `csMissLoad` | 関数 | 7962 | 2：`csMissAny`、`csMissMark` |
| `csMissMark` | 関数 | 7965 | 4：`csRender1m`、`csRenderTile`、`saveArea`、`sxRenderTile` |
| `csMissAny` | 関数 | 7974 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `csNetError` | 関数 | 7983 | 4：`csParent`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csGather` 📝 | 関数 | 7985 | 5：`csParent`、`csRender1m`、`csRenderTile`、`sxParent`、`sxRenderTile` |
| `csCompute` 📝 | 関数 | 7997 | 4：`csParent`、`csRender1m`、`csRenderTile`、`sxComputeCached` |
| `csParent` 📝 | 関数 | 8018 | 1：`csRenderTile` |
| `csCropPart` 📝 | 関数 | 8032 | 2：`csRenderTile`、`csStretch15` |
| `csZ15` 📝 | 関数 | 8046 | 1：`csStretch15` |
| `csStretch15` 📝 | 関数 | 8055 | 1：`csRender1m` |
| `csRender1m` 📝 | 関数 | 8061 | 1：`csRenderTile` |
| `csRenderTile` 📝 | 関数 | 8075 | 2：`CsLayerClass`、`csZ15` |
| `SX_PRM` | 定数 | 8106 | 3：`SxLayerClass`、`sxPrm`、`sxRenderTile` |
| `SX_DMAX` | 定数 | 8107 | 3：`setWindExpDmax`、`windExpLoad`、`windExpSettings` |
| `SX_COLOR` | 定数 | 8109 | 2：`sxColorize`、`windExpSettings` |
| `SX_WEAK_MS` | 定数 | 8110 | 1：`windExpInfoText` |
| `SX_DIR16` | 定数 | 8111 | 3：`wdInfoText`、`windExpInfoText`、`windExpSettings` |
| `sxStats` | 状態 | 8112 | 1：`sxComputeCached` |
| `windExp` 📝 | 状態 | 8114 | 16：`MAP_OVERLAYS`、`SxLayerClass`、`WINDEXP_KEY`、`applyOverlays`、`isBlendable`、`refreshWeatherPoints` ほか10 |
| `WINDEXP_KEY` | 定数 | 8115 | 2：`windExpLoad`、`windExpSave` |
| `windExpLoad` | 関数 | 8116 | 1：（トップレベル） |
| `windExpSave` | 関数 | 8123 | 2：`setWindExpDmax`、`setWindExpMode` |
| `windExpDir` 📝 | 関数 | 8129 | 3：`applyOverlays`、`sxSync`、`windExpSettings` |
| `windExpInfoText` | 関数 | 8135 | 2：`sxSync`、`windExpSettings` |
| `sxColorize` 📝 | 関数 | 8145 | 1：`SxLayerClass` |
| `sxCropQuarter` 📝 | 関数 | 8159 | 1：`sxRenderTile` |
| `sxCacheGet` | 関数 | 8172 | 1：`sxComputeCached` |
| `sxCacheSet` | 関数 | 8173 | 1：`sxComputeCached` |
| `sxPrm` | 関数 | 8174 | 1：`sxComputeCached` |
| `sxComputeCached` | 関数 | 8175 | 2：`sxParent`、`sxRenderTile` |
| `sxParent` 📝 | 関数 | 8184 | 1：`sxRenderTile` |
| `sxRenderTile` 📝 | 関数 | 8198 | 1：`SxLayerClass` |
| `sxSync` 📝 | 関数 | 8220 | 3：`refreshWeatherPoints`、`setWindExpDmax`、`setWindExpMode` |
| `setWindExpMode` | 関数 | 8230 | 1：`windExpSettings` |
| `setWindExpDmax` | 関数 | 8234 | 1：`windExpSettings` |
| `windExpSettings` 📝 | 関数 | 8239 | 1：`renderLayerPanel` |
| `WIND_TABLE_AREAS` 📝 | 定数 | 8257 | 1：`wdTablesFor` |
| `WD` 📝 | 定数 | 8258 | 1：`wdPlan` |
| `wd` | 状態 | 8260 | 3：`wdSetInfo`、`wdSync`、`windDownSettings` |
| `wdDecodePng` 📝 | 関数 | 8262 | 1：`wdLoadTable` |
| `wdLoadTable` 📝 | 関数 | 8272 | 1：`wdTablesFor` |
| `wdDirWeights` 📝 | 関数 | 8288 | 1：`wdPlan` |
| `wdInterp` | 関数 | 8293 | 1：`wdPlan` |
| `wdCell` 📝 | 関数 | 8295 | 2：`wdPlan`、`wdTablesFor` |
| `wdDistKm` | 関数 | 8300 | 1：`wdPlan` |
| `wdPlan` 📝 | 関数 | 8306 | 1：`wdSync` |
| `wdPaint` 📝 | 関数 | 8328 | 1：`wdSync` |
| `wdInfoText` | 関数 | 8338 | 2：`wdSync`、`windDownSettings` |
| `wdTablesFor` 📝 | 関数 | 8346 | 1：`wdSync` |
| `wdSync` 📝 | 関数 | 8356 | 1：`refreshWeatherPoints` |
| `WD_BLANK` | 定数 | 8381 | 2：`applyOverlays`、`wdClear` |
| `wdClear` | 関数 | 8383 | 1：`wdSync` |
| `wdSetInfo` | 関数 | 8387 | 1：`wdSync` |
| `windDownSettings` 📝 | 関数 | 8389 | 1：`renderLayerPanel` |
| `CiMapLayerClass` 📝 | 関数 | 8398 | 1：`applyOverlays` |
| `CsLayerClass` 📝 | 関数 | 8420 | 1：`applyOverlays` |
| `SxLayerClass` 📝 | 関数 | 8443 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 8468 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 8479 | 3：`applyLayerSet`、`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 8532 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 8534 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 8549 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 8557 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 8561 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 8564 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 8581 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 8583 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 8588 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 8599 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 8628 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 8630 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 8675 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 8690 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 8723 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 8727 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 8732 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 8757 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 8758 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 8761 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 8762 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 8764 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 8775 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 8800 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 8801 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 8802 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 8803 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 8806 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 8817 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 8824 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 8835 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 8850 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 8855 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 8878 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 8881 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 8895 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 8958 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8975〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8992 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8993 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8998 | 1：`radarUsable` |
| `radarUsable` | 関数 | 9002 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 9007 | 0 |
| `radarNowWet` | 関数 | 9046 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 9054 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 9067 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 9076 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 9108 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 9118 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 9125 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 9154 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 9155 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 9156 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 9157 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 9200 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 9201 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 9212 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 9213 | 9：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか3 |
| `clearLayerStatus` 📝 | 関数 | 9214 | 9：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか3 |
| `applyLayerStatus` | 関数 | 9215 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 9229 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 9245〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 9260 | 2：`windRecord`、`windUseSaved` |
| `WIND_CACHE_MAX` | 定数 | 9261 | 2：`fetchWindColumns`、`windUseSaved` |
| `WIND_FETCH_DELAY_MS` | 定数 | 9262 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 9263 | 4：`ensureWindField`、`fetchWindRaw`、`makeHintEngine`、`prefetchFavs` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 9266 | 2：`ensureWindField`、`prefetchFavs` |
| `weatherMarkers` | 状態 | 9270 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 9271 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 9272 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 9274 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 9280 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 9308 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 9353〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 9368 | 5：`WIND_FIELD_MODES`、`fetchWindRaw`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 9376 | 2：`fetchWindRaw`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 9380 | 4：`loadMapPrefs`、`sanitizeLayerSet`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 9382 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 9383 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 9385 | 3：`buildWindField`、`favWindPoints`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 9386 | 1：`windBand` |
| `windBand` | 関数 | 9387 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 9389 | 1：`fetchWindRaw` |
| `windUV` | 関数 | 9391 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 9392 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 9393 | 1：（トップレベル） |
| `windDirName` | 関数 | 9395 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 9401 | 3：`ensureWindField`、`makeHintEngine`、`prefetchFavs` |
| `zRefAt` 📝 | 関数 | 9411 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 9416 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 9491 | 2：`buildWindField`、`makeHintEngine` |
| `WIND_OFFLINE_RETRY_MS` 📝 | 定数 | 9510 | 2：`ensureWindField`、`windUseSaved` |
| `windRecord` 📝 | 関数 | 9511 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 9518 | 1：`ensureWindField` |
| `fetchWindRaw` 📝 | 関数 | 9525 | 2：`fetchWindColumns`、`prefetchFavs` |
| `windRecHydrate` 📝 | 関数 | 9560 | 2：`fetchWindColumns`、`windUseSaved` |
| `windColumnAt` | 関数 | 9565 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 9573 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 9592 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 9612 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 9629 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 9681 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 9695 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 9696 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 9697 | 4：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints`、（トップレベル） |
| `pointHintAnyOn` | 関数 | 9699 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 9700 | 1：`ensureWindField` |
| `windError` | 関数 | 9701 | 1：`ensureWindField` |
| `windClear` | 関数 | 9702 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 9706 | 1：`refreshWeatherPoints` |
| `windUseSaved` 📝 | 関数 | 9776 | 1：`ensureWindField` |
| `windSavedNote` 📝 | 関数 | 9795 | 1：`ensureWindField` |
| `drawWindArrows` 📝 | 関数 | 9810 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 9838 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 9942 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 9946〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 9961 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 9974 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 9978 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 9982 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 9991 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 10005 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 10020 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 10022 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 10038 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 10054 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 10064〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 10078 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 10092 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 10101 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 10108 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 10109 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 10110 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 10112 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 10127 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 10142 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 10157 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 10172 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 10174 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 10190 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 10205 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 10217〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 10230 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 10249 | 19：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか13 |
| `windFlowCanvas` | 関数 | 10251 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 10262 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 10275 | 0 |
| `buildFlowGrid` 📝 | 関数 | 10277 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 10292 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 10304 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 10317 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 10323 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 10325 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 10337 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 10341 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 10398〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 10420 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 10439 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 10457 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 10461 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 10472 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 10497 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 10510 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 10516 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 10537 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 10552 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 10555 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 10556 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 10557 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 10562 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 10563 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 10564 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 10565 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 10571 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 10576 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 10580 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 10585 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 10590 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 10596 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 10603 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 10610 | 2：`wdPaint`、`windGLBgTexture` |
| `windBgFade` | 関数 | 10619 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 10625 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 10649 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 10659 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 10664 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 10680 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 10733 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 10740 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 10741 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 10745 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 10787 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 10795 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 10797 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 10839 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 10848 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 10921〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 10939 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 10949 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 10962 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 10968 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 10969 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 10971 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 10979 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 10986 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 10994 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 11009 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 11020 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 11095 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 11120 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 11126〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 11150 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 11156 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 11165 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 11181 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 11182 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 11185 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 11208 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 11236 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 11242 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 11287 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 11313 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 11320 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 11419 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 11434 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 11435 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 11634 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 11651 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 11663 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 11671 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 11678 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 11683 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 11684 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 11685 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 11686 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 11687 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 11702 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 11715 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 11744 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 11777 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 11805 | 1：`smoothPath` |
| `smoothPath` | 関数 | 11823 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 11836 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 11866 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 11876 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 11899 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 11900 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 11932 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 11979 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 11983 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 12001 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 12008 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 12009 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 12034 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 12084 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 12094 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 12095 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 12113 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 12115 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 12128 | 1：`windGLHud` |
| `terrainKey` | 関数 | 12150 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 12154 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 12163 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 12170 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 12175 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 12176 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 12177 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 12182 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 12197 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 12212 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 12226 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 12230 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 12243 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 12263 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 12273 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 12282 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 12296 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 12323 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 12419 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 12437 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 12477 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 12489 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 12501 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 12503 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 12508 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 12518 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 12546 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 12575 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 12606 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 12615 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 12625 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 12630 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 12638 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 12639 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 12645 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 12652 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 12659 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 12661 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 12686 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 12701 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 12702 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 12703 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 12704 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 12708 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 12717 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 12729 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 12745 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 12821 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 12822 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 12823 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 12824 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 12825 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 12826 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 12828 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 12833 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 12848 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 12854 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 12860 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 12869 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 12877 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 12928 | 17：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか11 |
| `mapTimeLabel` | 関数 | 12968 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 12976 | 3：`refreshWeatherPoints`、`setWindExpMode`、（HTML） |
| `onMapTimeInput` | 関数 | 12994 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 12999 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 13005 | 1：（HTML） |
| `stepMapTime` | 関数 | 13006 | 1：（HTML） |
| `mapTimeNow` | 関数 | 13007 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 13019 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 13020 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 13021 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 13028 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 13032 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 13037 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 13040 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 13043 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 13049 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 13050 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 13055 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 13118 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 13119 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 13122 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 13135 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 13169 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 13179 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 13191 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 13198 | 3：`addTimedTileLayer`、`applyLayerSet`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 13204 | 1：`blendChips` |
| `blendChips` | 関数 | 13213 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 13220 | 23：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか17 |
| `overlayOpacity` 📝 | 関数 | 13221 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 13228 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `csStrength` | 関数 | 13249 | 2：`applyOverlays`、`setOverlayOpacity` |
| `setOverlayOpacity` 📝 | 関数 | 13254 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 13282 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 13290 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 13298 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 13383 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 13402 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 13420 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 13421 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 13428 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 13447 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 13455 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 13462 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 13476 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 13484 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 13505 | 1：（HTML） |
| `sectionLayers` | 関数 | 13509 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 13510 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 13512 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 13521 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 13530 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 13538 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 13560 | 1：`renderLayerPanel` |
| `MAP_LS_LAYER_SETS` | 定数 | 13572 | 2：`loadLayerSets`、`saveLayerSets` |
| `MAP_LS_CS_STRENGTH_SETS` | 定数 | 13573 | 1：`loadLayerSets` |
| `LAYER_SETS_MAX` | 定数 | 13574 | 3：`renderLayerSets`、`sanitizeLayerSets`、`saveCurrentLayerSet` |
| `LAYER_SET_NAME_MAX` | 定数 | 13575 | 2：`cutLayerSetName`、`saveCurrentLayerSet` |
| `LAYER_SET_ID_RE` | 定数 | 13576 | 1：`sanitizeLayerSet` |
| `cutLayerSetName` | 関数 | 13579 | 3：`renameLayerSet`、`sanitizeLayerSet`、`saveCurrentLayerSet` |
| `layerSetOpacity` | 関数 | 13582 | 2：`sanitizeLayerSet`、`sanitizeSetOverlays` |
| `sanitizeSetOverlays` | 関数 | 13587 | 1：`sanitizeLayerSet` |
| `sanitizeLayerSet` | 関数 | 13601 | 1：`sanitizeLayerSets` |
| `sanitizeLayerSets` 📝 | 関数 | 13624 | 1：`loadLayerSets` |
| `loadLayerSets` | 関数 | 13635 | 7：`applyLayerSet`、`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`renderLayerSets` ほか1 |
| `saveLayerSets` | 関数 | 13658 | 5：`deleteLayerSet`、`moveLayerSet`、`overwriteLayerSet`、`renameLayerSet`、`saveCurrentLayerSet` |
| `captureLayerSet` 📝 | 関数 | 13664 | 3：`isLayerSetActive`、`overwriteLayerSet`、`saveCurrentLayerSet` |
| `layerSetKey` | 関数 | 13674 | 1：`isLayerSetActive` |
| `isLayerSetActive` 📝 | 関数 | 13681 | 1：`renderLayerSets` |
| `newLayerSetId` | 関数 | 13696 | 1：`saveCurrentLayerSet` |
| `saveCurrentLayerSet` 📝 | 関数 | 13699 | 1：`renderLayerSets` |
| `applyLayerSet` 📝 | 関数 | 13711 | 1：`renderLayerSets` |
| `renameLayerSet` 📝 | 関数 | 13743 | 1：`renderLayerSets` |
| `overwriteLayerSet` 📝 | 関数 | 13754 | 1：`renderLayerSets` |
| `deleteLayerSet` 📝 | 関数 | 13761 | 1：`renderLayerSets` |
| `moveLayerSet` 📝 | 関数 | 13768 | 1：`renderLayerSets` |
| `renderLayerSets` 📝 | 関数 | 13777 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 13809 | 21：`applyLayerSet`、`deleteLayerSet`、`drawPoi`、`moveLayer`、`moveLayerSet`、`openMap` ほか15 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 13879〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 13882 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 13883 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 13886 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 13900 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 13908 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 13914 | 3：`doMapSearch`、`fetchPointElevation`、`prefetchFavs` |
| `fetchPointElevation` 📝 | 関数 | 13941 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 13950 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 13954 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 13981 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 13985 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 14006 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 14012 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 14051 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 14055 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 14062 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 14088 | 4：`clearTileCache`、`deleteArea`、`refreshTileCacheUsage`、`saveArea` |
| `formatBytes` 📝 | 関数 | 14098 | 3：`refreshTileCacheUsage`、`renderAreaPanel`、`saveArea` |
| `refreshTileCacheUsage` 📝 | 関数 | 14102 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 14127 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 14128 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 14129 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 14133 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 14137 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 14147 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 14154 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 14176 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 14183 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 14190 | 1：`toggleLayerPanel` |
| `bootOut` 📝 | 関数 | 14213 | 2：`bootFinish`、`fetchWeather` |
| `bootNavInfo` 📝 | 関数 | 14214 | 1：`bootRecord` |
| `bootRecord` 📝 | 関数 | 14230 | 1：`bootSave` |
| `bootLogPush` 📝 | 関数 | 14240 | 1：`bootSave` |
| `loadBootLog` 📝 | 関数 | 14245 | 3：`bootLogText`、`bootSave`、`refreshBootLogView` |
| `bootSave` 📝 | 関数 | 14251 | 2：`bootAmend`、`bootFinish` |
| `bootFinish` 📝 | 関数 | 14256 | 2：`fetchWeather`、`render` |
| `bootAmend` 📝 | 関数 | 14264 | 2：`fetchWeather`、`render` |
| `BOOT_OUT_LABEL` | 定数 | 14266 | 2：`bootHeadline`、`bootRows` |
| `bootSec` 📝 | 関数 | 14267 | 4：`bootHeadline`、`bootLogText`、`bootRows`、`refreshBootLogView` |
| `bootTotal` 📝 | 関数 | 14269 | 1：`bootHeadline` |
| `bootRows` 📝 | 関数 | 14276 | 2：`bootLogText`、`refreshBootLogView` |
| `bootWhen` 📝 | 関数 | 14307 | 1：`bootHeadline` |
| `bootHeadline` 📝 | 関数 | 14312 | 2：`bootLogText`、`refreshBootLogView` |
| `refreshBootLogView` 📝 | 関数 | 14319 | 1：`toggleLayerPanel` |
| `bootLogText` 📝 | 関数 | 14337 | 1：`copyBootLog` |
| `copyBootLog` 📝 | 関数 | 14344 | 1：（HTML） |
| `clearTileCache` 📝 | 関数 | 14352 | 1：（HTML） |
| `AREA_LS` | 定数 | 14367 | 2：`loadSavedAreas`、`storeSavedAreas` |
| `AREA_DEM_MAX` 📝 | 定数 | 14368 | 2：`areaPlan`、`saveArea` |
| `AREA_FETCH_TIMEOUT_MS` | 定数 | 14369 | 2：`deleteArea`、`saveArea` |
| `AREA_STD_URL` | 定数 | 14370 | 1：`areaTile` |
| `areaTileRange` 📝 | 関数 | 14372 | 1：`areaTilesIn` |
| `areaTile` 📝 | 関数 | 14379 | 2：`areaTiles10b`、`areaTilesIn` |
| `areaTilesIn` 📝 | 関数 | 14384 | 1：`areaPlan` |
| `areaTiles10b` 📝 | 関数 | 14394 | 1：`areaPlan` |
| `areaPlan` 📝 | 関数 | 14409 | 2：`deleteArea`、`saveArea` |
| `loadSavedAreas` 📝 | 関数 | 14419 | 4：`areaMissHas`、`deleteArea`、`renderAreaPanel`、`saveArea` |
| `storeSavedAreas` 📝 | 関数 | 14424 | 2：`deleteArea`、`saveArea` |
| `areaMissHas` 📝 | 関数 | 14429 | 3：`csRender1m`、`csRenderTile`、`sxRenderTile` |
| `areaJob` | 状態 | 14434 | 3：`deleteArea`、`renderAreaPanel`、`saveArea` |
| `areaIdOf` | 関数 | 14435 | 2：`renderAreaPanel`、`saveArea` |
| `saveArea` 📝 | 関数 | 14436 | 1：`renderAreaPanel` |
| `deleteArea` 📝 | 関数 | 14514 | 1：`renderAreaPanel` |
| `renderAreaPanel` 📝 | 関数 | 14527 | 3：`deleteArea`、`saveArea`、`toggleLayerPanel` |
| `pickMapPoint` 📝 | 関数 | 14569 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 14584 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 14591 | 4：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 14599〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `HEADING_GPS_MIN_SPEED` | 定数 | 14625 | 1：`gpsCourseUsable` |
| `HEADING_GPS_HOLD_MS` | 定数 | 14626 | 1：`compassHeadingAllowed` |
| `gpsCourseUsable` 📝 | 関数 | 14632 | 1：`onGeoUpdate` |
| `compassHeadingAllowed` 📝 | 関数 | 14637 | 1：`enableHeading` |
| `updatePinVisibility` 📝 | 関数 | 14643 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 14650 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 14672 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `LOCATE_FLY_S` | 定数 | 14690 | 1：`locateFlyToMe` |
| `locateFlyToMe` 📝 | 関数 | 14692 | 2：`onGeoUpdate`、`setLocateMode` |
| `cycleLocate` 📝 | 関数 | 14698 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 14704 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 14722 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 14741 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 14754 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 14771 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 14792 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 14825 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 14857 | 3：`applyNotchSide`、`enableHeading`、`showOrientDiag` |
| `screenTiltDeg` 📝 | 関数 | 14876 | 1：`showOrientDiag` |
| `showOrientDiag` 📝 | 関数 | 14882 | 2：`enableHeading`、`onGeoUpdate` |
| `applyNotchSide` | 関数 | 14899 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 14907 | 2：`enableHeading`、`onGeoUpdate` |
| `updateMapDiag` | 関数 | 14915 | 2：`setHeadingUp`、（トップレベル） |
| `applyMapRotation` 📝 | 関数 | 14926 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 14938 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 14948 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 14984 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 14985 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 14986 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 14989 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 14995 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 14996 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 15002 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 15044 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 15045 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 15046 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 15052 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 15057 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 15131 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 15132 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 15137 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 15149 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 15153 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 15161 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 15178 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 15179 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 15193 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 15211 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 15263 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 15284 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 15288 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 15292 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 15311 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 15314 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 15327 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 15328 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 15354 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 15371 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 15374 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 15380 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 15441 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 15442 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 15459 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 15582 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 15583 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 15584 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 15591 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 15611〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 15619 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 15620 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 15622 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 15629 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 15633 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 15637 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 15647 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 15656 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 15739〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 15747 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 15757 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 15765 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 15766 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 15776 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 15791 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 15806 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 15813 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 15817 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 15823 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 15834 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 15853 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 15881 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 15888 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 15898 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 15903 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 15910 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 15913 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 15921 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 15927 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 15936 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 15951 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 15956 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 15967 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 15973 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 15983 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 16000 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 16036 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 16046 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 16062 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 16063 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 16139 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 16140 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 16149〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 16154 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 16159 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 16164 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 16168 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 16179 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 16180 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 16192 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 16213 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 16216 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 16230 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 16251 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 16287〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 16297 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 16300 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 16303 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 16304 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 16305 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 16306 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 16307 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 16310 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 16336 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 16337 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 16338 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 16339 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 16344 | 1：`utmResult` |
| `utmResult` | 関数 | 16349 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 16356 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 16380 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 16392 | 1：`parseCoordInput` |
| `copyText` | 関数 | 16426 | 2：`copyBootLog`、`openCoordSheet` |
| `flashCopied` | 関数 | 16439 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 16447 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 16489 | 1：（HTML） |

## FAVORITES

行 16501〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 16504 | 10：`assignSpot`、`favPrefetchTargets`、`migrateSpotsOutOfFavs`、`renderAreaPanel`、`renderFavList`、`returnToFavs` ほか4 |
| `saveFavs` 📝 | 関数 | 16508 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `FAV_PREFETCH_DELAY_MS` | 定数 | 16521 | 1：（トップレベル） |
| `FAV_PREFETCH_GAP_MS` | 定数 | 16522 | 1：`prefetchFavs` |
| `FAV_PREFETCH_FRESH_MS` | 定数 | 16523 | 1：`prefetchFavs` |
| `FAV_WIND_RADIUS` | 定数 | 16524 | 1：`favWindPoints` |
| `favPrefetch` | 状態 | 16525 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `wxRecordExact` 📝 | 関数 | 16527 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favWindPoints` 📝 | 関数 | 16532 | 1：`prefetchFavs` |
| `favPrefetchTargets` | 関数 | 16541 | 2：`prefetchFavs`、`renderFavPrefetch` |
| `favPrefetchWait` | 関数 | 16544 | 1：`prefetchFavs` |
| `prefetchFavs` 📝 | 関数 | 16545 | 2：`renderFavPrefetch`、（トップレベル） |
| `renderFavPrefetch` 📝 | 関数 | 16606 | 2：`openFav`、`prefetchFavs` |
| `toggleFavSpots` | 関数 | 16638 | 1：（HTML） |
| `openFav` 📝 | 関数 | 16642 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 16648 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 16652 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 16801 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 16812〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 16818 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 16819 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 16820 | 1：`openRank` |
| `rankFetchCache` | 状態 | 16823 | 1：`fetchRankData` |
| `rankDates` | 状態 | 16824 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 16827 | 7：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` ほか1 |
| `fmtDateISO` | 関数 | 16836 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 16841 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 16866 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 16909 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 16918 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 16941 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 16979 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 16980 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 16985 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 16995 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 17079 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 17088 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 17123 | 1：（HTML） |
| `openRank` 📝 | 関数 | 17133 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 17145 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 17149〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 17160 | 1：（HTML） |
| `setWindMode` | 関数 | 17169 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 17176 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 17184 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 17192 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 17200 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 17209 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 17238 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 17296 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 17303〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 17306 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 17309 | 1：（トップレベル） |

## LOADING OVERLAY

行 17314〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 17317 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 17323 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 17368〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 17384 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 17385 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 17395 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 17400 | 1：（HTML） |
| `closeWxMap` | 関数 | 17404 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 17407 | 1：（HTML） |
| `setWxMapArea` | 関数 | 17413 | 1：（HTML） |
| `loadWxMapList` | 関数 | 17421 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 17437 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 17447 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 17456 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 17471 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 17481 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 17510〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 17513 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 17516 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 17537 | 14：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか8 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 17547 | 1：（トップレベル） |

