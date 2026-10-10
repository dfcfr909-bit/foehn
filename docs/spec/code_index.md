# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：14,889行／本体の `<script>` は 2811〜14886 行
- トップレベルの宣言 857（関数 614・定数と状態 243）／ブロック 39
- `code_map.md` に説明があるもの：482／857（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2812：STATE（16）
- 行 3014：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3209：DATA FETCH（28）
- 行 3645：GPS（2）
- 行 3682：RENDER MASTER（40）
- 行 4135：HUD（28）
- 行 4486：ABC JUDGMENT（6）
- 行 4565：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6037：SKY COLOR HELPER（1）
- 行 6061：WEATHER EMOJI（12）
- 行 6236：PARTICLES (雨・雪エフェクト)（5）
- 行 6326：時刻選択（17）
- 行 6671：MAP — レイヤー定義（44）
- 行 6987：MAP — 本体（43）
- 行 7515：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 7776：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 7884：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8413：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 8531：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 8684：風の流れ（Particle Engine）（13）
- 行 8865：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（39）
- 行 9376：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 9581：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（142）
- 行 11846：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（23）
- 行 12124：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13033：検索の履歴（選んだ地点）（8）
- 行 13161：手元の山の検索（#171・第1段階）（33）
- 行 13571：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 13709：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 13923：FAVORITES（7）
- 行 14113：RANKING（全国山域ランキング）（21）
- 行 14450：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 14604：LOCALSTORAGE – 最終地点（2）
- 行 14615：LOADING OVERLAY（2）
- 行 14669：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 14811：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2812〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2815 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2833 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2848 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2852 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2868 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2883 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2913 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2915 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2916 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2919 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2929 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2930 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 2945 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 2986 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 2992 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3005 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3014〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3035 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3036 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3037 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3038 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3042 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3045 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3058 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3066 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3072 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3082 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3102 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3124 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3134 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3158 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3174 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3182 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3192 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3209〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3224 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3230 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3232 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3239 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3251 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3272 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3276 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3284 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3290 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3315 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3382 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3387 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3423 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3430 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3456 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3478 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3482 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3496 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3515 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3532 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3541 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3572 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3586 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3587 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3588 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3589 | 1：`processData` |
| `summitGustRange` | 関数 | 3594 | 1：`processData` |
| `processData` 📝 | 関数 | 3599 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3645〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3648 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3673 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3682〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3689 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3711 | 1：`render` |
| `FAV_STEP` | 定数 | 3718 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3720 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3721 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3734 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3735 | 1：`favCircular` |
| `favCount` | 関数 | 3736 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3737 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3739 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3745 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3755 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3764 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3770 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3777 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3779 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3794 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3798 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3799 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3805 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3817 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3822 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3833 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3838 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3845 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3855 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3867 | 0 |
| `saveHome` | 関数 | 3868 | 0 |
| `goHome` | 関数 | 3869 | 0 |
| `currentFavChip` | 関数 | 3873 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3879 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3884 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3930 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 3965 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4000 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4013 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4031 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4043 | 1：`renderFavRotary` |
| `selectFav` 📝 | 関数 | 4052 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4064 | 1：（トップレベル） |

## HUD

行 4135〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4138 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4144 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4150 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4153 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4158 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4163 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4174 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4194 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4199 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4215 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4223 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4241 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4242 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4243 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4253 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4258 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4274 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4275 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4276 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4284 | 1：`peakAt` |
| `peakAt` | 関数 | 4285 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4299 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4327 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4371 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4387 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4466 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4479 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4480 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4486〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4491 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4492 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4494 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4500 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4507 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4551 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4565〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4571 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4572 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4573 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4574 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4575 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4577 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4586 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4587 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4591 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4596 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4605 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4606 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4612 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4613 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4621 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4622 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4623 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4624 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4625 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4626 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4627 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4635 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4638 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4641 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4643 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4816 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4817 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4818 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4830 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4831 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4832 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4833 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4834 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4837 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4855 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4867 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4879 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4888 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4907 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4922 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5031 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5042 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5167 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5226 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5244 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5248 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5249 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5251 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5254 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5258 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5261 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5274 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5288 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5303 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5346 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5360 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5374 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5377 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5378 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5379 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5380 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5382 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5391 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5432 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5441 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5448 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5613 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5658 | 1：`feelColor` |
| `feelColor` | 関数 | 5668 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5687 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5728 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5736 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5743 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5754 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5771 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5793 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5799 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5808 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5836 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5919 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 5967 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 5984 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 5992 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6015 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6021 | 1：（HTML） |

## SKY COLOR HELPER

行 6037〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6040 | 0 |

## WEATHER EMOJI

行 6061〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6070 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6077 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6096 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6097 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6098 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6107 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6129 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6142 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6155 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6169 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6217 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6231 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6236〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6239 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6242 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6294 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6311 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6319 | 1：`updateParticles` |

## 時刻選択

行 6326〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6341 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6342 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6349 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6357 | 0 |
| `positionScrubLine` 📝 | 関数 | 6363 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6384 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6400 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6422 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6442 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6447 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6453 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6485 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6493 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6503 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6516 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6614 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6646 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6671〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6676 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6677 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6680 | 2：`findBase`、`renderLayerPanel` |
| `MAP_BASE_DEFAULT` | 定数 | 6693 | 3：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs` |
| `MAP_OVERLAYS` 📝 | 定数 | 6696 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6741 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6742 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6744 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6748 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6755 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6756 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6763 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6765 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6766 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6768 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6769 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6770 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6771 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6772 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BLEND` | 定数 | 6773 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_BLEND_MODES` | 定数 | 6774 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6777 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6780 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6781 | 1：`blendOf` |
| `isBlendable` | 関数 | 6782 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6787 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6795 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6798 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6799 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6804 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6805 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6815 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6829 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6834 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6851 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6852 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6857 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6859 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 6914 | 5：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 6915 | 12：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか6 |
| `usableOverlays` 📝 | 関数 | 6919 | 1：`renderLayerPanel` |
| `usableWeather` 📝 | 関数 | 6920 | 1：`renderLayerPanel` |
| `loadMapPrefs` 📝 | 関数 | 6923 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 6976 | 7：`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setOverlayOpacity`、`setSatBand`、`setWindMode` ほか1 |

## MAP — 本体

行 6987〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` | 状態 | 6992 | 24：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`blendOf`、`drawAmedas` ほか18 |
| `overlayTileLayers` | 状態 | 6996 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 6999 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `applyBaseLayer` 📝 | 関数 | 7009 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7023 | 1：`applyOverlays` |
| `applyOverlays` 📝 | 関数 | 7036 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7072 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7074 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7089 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7097 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7101 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7104 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7121 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7123 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7128 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7139 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7168 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7170 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7215 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7230 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7263 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7267 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7272 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7297 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7298 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7301 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7302 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7304 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7315 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7340 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7341 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7342 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7343 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7346 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7357 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7364 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7375 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7390 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7395 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7418 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7421 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7435 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7498 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 7515〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 7532 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 7533 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 7538 | 1：`radarUsable` |
| `radarUsable` | 関数 | 7542 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 7547 | 0 |
| `radarNowWet` | 関数 | 7586 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 7594 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 7607 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 7616 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 7648 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 7658 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 7665 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 7694 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 7695 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 7696 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 7697 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 7731 | 3：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel` |
| `layerFailed` 📝 | 状態 | 7732 | 2：`applyLayerStatus`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 7743 | 6：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windError` |
| `setLayerNote` 📝 | 関数 | 7744 | 6：`drawAmedas`、`drawAreas`、`makeHintEngine`、`updateWindFlowGL`、`watchTileStatus`、`windNote` |
| `clearLayerStatus` 📝 | 関数 | 7745 | 6：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`makeHintEngine`、`watchTileStatus`、`windClear` |
| `applyLayerStatus` | 関数 | 7746 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 7760 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 7776〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 7791 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 7792 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 7793 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 7794 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 7797 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 7801 | 6：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawSnowHint`、`drawThunderHint`、`drawWindArrows` |
| `AMEDAS_MIN_ZOOM` | 定数 | 7802 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 7803 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 7805 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 7811 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 7839 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 7884〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 7899 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 7907 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 7911 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 7913 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 7914 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 7916 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 7917 | 1：`windBand` |
| `windBand` | 関数 | 7918 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 7920 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 7922 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 7923 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 7924 | 1：（トップレベル） |
| `windDirName` | 関数 | 7926 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 7932 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 7942 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 7947 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8022 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8039 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8044 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8083 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8091 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8110 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8130 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8147 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8199 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8213 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8214 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8215 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8217 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8218 | 1：`ensureWindField` |
| `windError` | 関数 | 8219 | 1：`ensureWindField` |
| `windClear` | 関数 | 8220 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8224 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8277 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8305 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8409 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8413〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8428 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8441 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8445 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8449 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8458 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8472 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8487 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8489 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 8505 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 8521 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 8531〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 8545 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 8559 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 8568 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 8575 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 8576 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 8577 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 8579 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 8594 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 8609 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 8624 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 8639 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 8641 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 8657 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 8672 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 8684〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 8697 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 8716 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 8718 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 8729 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 8742 | 0 |
| `buildFlowGrid` 📝 | 関数 | 8744 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 8759 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 8771 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 8784 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 8790 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 8792 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 8804 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 8808 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 8865〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 8887 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 8906 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 8924 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 8928 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 8939 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 8964 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 8977 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 8983 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9004 | 4：`windBgAlpha`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9014 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9017 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9018 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9019 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9024 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9025 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9026 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9027 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9033 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9038 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9042 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9047 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9052 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9058 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9065 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9072 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9081 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9104 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9114 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9119 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9135 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9188 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9195 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9196 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9200 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9242 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9250 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9252 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9294 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9303 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9376〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9394 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9404 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9417 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9423 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9424 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9426 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9434 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9441 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9449 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9464 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9475 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 9550 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 9575 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 9581〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 9605 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 9611 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 9620 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 9636 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 9637 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 9640 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 9663 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 9691 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 9697 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 9742 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 9768 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 9775 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 9874 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 9889 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 9890 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10089 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10106 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10118 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10126 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10133 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10138 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10139 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10140 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10141 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10142 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10157 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10170 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10199 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10232 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10260 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10278 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10291 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10321 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10331 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10354 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10355 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10387 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10434 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10438 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10456 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10463 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10464 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 10489 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 10539 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 10549 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 10550 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 10568 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 10570 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 10583 | 1：`windGLHud` |
| `terrainKey` | 関数 | 10605 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 10609 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 10618 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 10625 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 10630 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 10631 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 10632 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 10637 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 10652 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 10667 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 10681 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 10685 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 10698 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 10718 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 10728 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 10737 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 10751 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 10778 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 10874 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 10892 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 10932 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 10944 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 10956 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 10958 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 10963 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 10973 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11001 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11030 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11061 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11070 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11080 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11085 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11093 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11094 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11100 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11107 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11114 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11116 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11141 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11156 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11157 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11158 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11159 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11163 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11172 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11184 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11200 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11270 | 14：`applyOverlays`、`drawAmedas`、`drawAreas`、`ensureWindField`、`loadTerrainRef`、`makeHintEngine` ほか8 |
| `mapTimeLabel` | 関数 | 11307 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11315 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11332 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11337 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11343 | 1：（HTML） |
| `stepMapTime` | 関数 | 11344 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11345 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11357 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11358 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11359 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11366 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11370 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 11375 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 11378 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 11381 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 11387 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 11388 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 11393 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 11456 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 11457 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 11460 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 11473 | 3：`applyBaseLayer`、`applyOverlays`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 11499 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 11509 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 11519 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 11525 | 1：`blendChips` |
| `blendChips` | 関数 | 11534 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 11541 | 19：`addTimedTileLayer`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas`、`pointHintAnyOn`、`refreshRanking` ほか13 |
| `overlayOpacity` 📝 | 関数 | 11542 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 11549 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 11569 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 11594 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 11602 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 11610 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 11693 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 11712 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 11730 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 11731 | 21：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`paintTileTrouble` ほか15 |
| `toggleLayerPanel` 📝 | 関数 | 11737 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 11753 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 11760 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 11767 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 11781 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 11789 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 11806 | 8：`openMap`、`setAmedasElement`、`setMapBase`、`setOverlayBlend`、`setSatBand`、`setWindMode` ほか2 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 11846〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 11849 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 11850 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 11853 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 11867 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 11875 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 11881 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 11908 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 11917 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 11921 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 11948 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 11952 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 11973 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 11979 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12018 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12022 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12029 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12054 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12064 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12068 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12086 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12095 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12109 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12116 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12124〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12149 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12156 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 12178 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 12195 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 12201 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 12216 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 12235 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 12247 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 12262 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 12272 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 12305 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 12328 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 12338 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 12346 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 12353 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 12365 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 12373 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 12406 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 12407 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 12408 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 12411 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 12417 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 12418 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 12424 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 12466 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 12467 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 12468 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 12474 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 12479 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 12553 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 12554 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 12559 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 12571 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 12575 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 12583 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 12600 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 12601 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 12615 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 12633 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 12685 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 12706 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 12710 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 12714 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 12733 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 12736 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 12749 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 12750 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 12776 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 12793 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 12796 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 12802 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 12863 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 12864 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 12881 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13004 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13005 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13006 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13013 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13033〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13041 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13042 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13044 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13051 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13055 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13059 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13069 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13078 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13161〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13169 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 13179 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 13187 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 13188 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 13198 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 13213 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 13228 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 13235 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 13239 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 13245 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 13256 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 13275 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 13303 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 13310 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 13320 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 13325 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 13332 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 13335 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 13343 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 13349 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 13358 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 13373 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 13378 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 13389 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 13395 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 13405 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 13422 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 13458 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 13468 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 13484 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 13485 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 13561 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 13562 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 13571〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 13576 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 13581 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 13586 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 13590 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 13601 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 13602 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 13614 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 13635 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 13638 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 13652 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 13673 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 13709〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 13719 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 13722 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 13725 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 13726 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 13727 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 13728 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 13729 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 13732 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 13758 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 13759 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 13760 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 13761 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 13766 | 1：`utmResult` |
| `utmResult` | 関数 | 13771 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 13778 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 13802 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 13814 | 1：`parseCoordInput` |
| `copyText` | 関数 | 13848 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 13861 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 13869 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 13911 | 1：（HTML） |

## FAVORITES

行 13923〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 13926 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 13930 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 13940 | 1：（HTML） |
| `openFav` 📝 | 関数 | 13944 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 13949 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 13953 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14102 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14113〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14119 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14120 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14121 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14124 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14125 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14128 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14137 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14142 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14167 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 14210 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 14219 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 14242 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 14280 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 14281 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 14286 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 14296 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 14380 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 14389 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 14424 | 1：（HTML） |
| `openRank` 📝 | 関数 | 14434 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 14446 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 14450〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 14461 | 1：（HTML） |
| `setWindMode` | 関数 | 14470 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 14477 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 14485 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 14493 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 14501 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 14510 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 14539 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 14597 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 14604〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 14607 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 14610 | 1：（トップレベル） |

## LOADING OVERLAY

行 14615〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 14618 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 14624 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 14669〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 14685 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 14686 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 14696 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 14701 | 1：（HTML） |
| `closeWxMap` | 関数 | 14705 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 14708 | 1：（HTML） |
| `setWxMapArea` | 関数 | 14714 | 1：（HTML） |
| `loadWxMapList` | 関数 | 14722 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 14738 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 14748 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 14757 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 14772 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 14782 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 14811〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 14814 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 14817 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 14838 | 7：`drawAmedas`、`drawAreas`、`loadOutlook`、`renderLayerPanel`、`renderSnowList`、`satBandChips` ほか1 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 14848 | 1：（トップレベル） |

