# コードの全索引（自動生成）

> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。
> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。
> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。

- `sotoki_v4.html`：15,712行／本体の `<script>` は 2874〜15709 行
- トップレベルの宣言 928（関数 663・定数と状態 265）／ブロック 39
- `code_map.md` に説明があるもの：521／928（📝 印）
- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。
  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照
- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）

## 目次

- 行 2875：STATE（16）
- 行 3077：OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）（17）
- 行 3272：DATA FETCH（28）
- 行 3708：GPS（2）
- 行 3745：RENDER MASTER（41）
- 行 4202：HUD（28）
- 行 4553：ABC JUDGMENT（6）
- 行 4632：CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。（85）
- 行 6104：SKY COLOR HELPER（1）
- 行 6128：WEATHER EMOJI（12）
- 行 6303：PARTICLES (雨・雪エフェクト)（5）
- 行 6393：時刻選択（17）
- 行 6738：MAP — レイヤー定義（54）
- 行 7159：MAP — 本体（70）
- 行 8012：レーダー実況とモデル予報の突き合わせ（v4.98.0）（23）
- 行 8275：点で描く気象レイヤー（アメダス実測・風の矢印）（11）
- 行 8383：高度別の風の場（Wind Field Engine）— ADR-0012（36）
- 行 8912：降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md（10）
- 行 9030：雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md（14）
- 行 9183：風の流れ（Particle Engine）（13）
- 行 9364：風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）（40）
- 行 9887：段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）（13）
- 行 10092：段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）（164）
- 行 12586：標高タイル（国土地理院 dem_png）から選択地点の標高を読む（33）
- 行 12947：現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）（58）
- 行 13856：検索の履歴（選んだ地点）（8）
- 行 13984：手元の山の検索（#171・第1段階）（33）
- 行 14394：座標の表記（DD・DMS・DDM・度分秒）— v4.109.0（11）
- 行 14532：座標の入力を読む（v4.158.0・findings-09 の B・第1段）（21）
- 行 14746：FAVORITES（7）
- 行 14936：RANKING（全国山域ランキング）（21）
- 行 15273：新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）（9）
- 行 15427：LOCALSTORAGE – 最終地点（2）
- 行 15438：LOADING OVERLAY（2）
- 行 15492：天気図（気象庁の速報天気図・予想天気図）（13）
- 行 15634：AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）（4）

## STATE

行 2875〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `state` 📝 | 状態 | 2878 | 76：`applyPressWindow`、`applyRange`、`applySupplemental`、`applyWeatherJson`、`buildCharts`、`cloudProfileAt` ほか70 |
| `PAST_HOURS` 📝 | 定数 | 2896 | 1：`applyRange` |
| `WIND_LEVELS` 📝 | 定数 | 2911 | 3：`pickWindSource`、`windInterpLevels`、`windLevelFor` |
| `windLevelFor` 📝 | 関数 | 2915 | 1：`pickWindSource` |
| `pickWindSource` 📝 | 関数 | 2931 | 3：`applyWeatherJson`、`buildRanking`、`fetchRankData` |
| `windSourceLabel` 📝 | 関数 | 2946 | 1：`windTraceLabel` |
| `GSM_LEVELS` 📝 | 定数 | 2976 | 1：`fetchRankData` |
| `WIND_INTERP_EXTRA` | 定数 | 2978 | 1：`windInterpLevels` |
| `windInterpLevels` 📝 | 関数 | 2979 | 3：`fetchRankData`、`fetchWeather`、`summitWindAt` |
| `MSM_BLEND_HOURS` | 定数 | 2982 | 1：`windModelPhases` |
| `MSM_ONLY_PROBE_LEVELS` | 定数 | 2992 | 3：`SNOW_HINT`、`THUNDER_HINT`、`windModelPhases` |
| `windModelPhases` 📝 | 関数 | 2993 | 3：`fetchWindColumns`、`makeHintEngine`、`processData` |
| `summitWindAt` 📝 | 関数 | 3008 | 1：`processData` |
| `gradeOf` 📝 | 関数 | 3049 | 3：`drawScrubber`、`judgePeakDay`、`updatePopup` |
| `windTraceLabel` 📝 | 関数 | 3055 | 1：`updatePopup` |
| `THRESH` 📝 | 定数 | 3068 | 3：`drawWindOverlay`、`judgeBreakdown`、`judgePoint` |

## OFFLINE WEATHER CACHE（圏外で、直近に取れた予報を出す）

行 3077〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX_DB_NAME` | 定数 | 3098 | 1：`wxDb` |
| `WX_STORE` | 定数 | 3099 | 2：`wxDb`、`wxStore` |
| `WX_MAX_AGE_MS` 📝 | 定数 | 3100 | 3：`fetchWeather`、`setWxSource`、`trimWxCache` |
| `WX_MAX_ENTRIES` 📝 | 定数 | 3101 | 1：`trimWxCache` |
| `WX_NEAR_KM` 📝 | 定数 | 3105 | 1：`loadWxCache` |
| `wxDb` 📝 | 関数 | 3108 | 1：`wxStore` |
| `wxReq` 📝 | 関数 | 3121 | 2：`loadWxCache`、`trimWxCache` |
| `wxStore` 📝 | 関数 | 3129 | 3：`loadWxCache`、`trimWxCache`、`wxUpdate` |
| `wxKey` 📝 | 関数 | 3135 | 3：`loadWxCache`、`saveWxCache`、`saveWxSupplemental` |
| `wxUpdate` 📝 | 関数 | 3145 | 2：`saveWxCache`、`saveWxSupplemental` |
| `saveWxCache` 📝 | 関数 | 3165 | 1：`fetchWeather` |
| `saveWxSupplemental` 📝 | 関数 | 3187 | 1：`fetchSupplemental` |
| `loadWxCache` 📝 | 関数 | 3197 | 1：`fetchWeather` |
| `trimWxCache` 📝 | 関数 | 3221 | 1：`saveWxCache` |
| `wxAgeText` 📝 | 関数 | 3237 | 1：`setWxSource` |
| `wxStampText` 📝 | 関数 | 3245 | 1：`setWxSource` |
| `setWxSource` 📝 | 関数 | 3255 | 2：`fetchWeather`、（HTML） |

## DATA FETCH

行 3272〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `FORECAST_MODELS` 📝 | 定数 | 3287 | 6：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`openModelSheet`、`switchModel`、`updateModelChip` |
| `DEFAULT_MODEL` 📝 | 定数 | 3293 | 9：`applyWeatherJson`、`fetchWeather`、`forecastModel`、`loadWxCache`、`openModelSheet`、`saveWxCache` ほか3 |
| `forecastModel` 📝 | 関数 | 3295 | 4：`fetchWeather`、`processData`、`switchModel`、`updateModelChip` |
| `updateModelChip` 📝 | 関数 | 3302 | 3：`applyWeatherJson`、`switchModel`、（HTML） |
| `openModelSheet` 📝 | 関数 | 3314 | 1：（HTML） |
| `closeModelSheet` | 関数 | 3335 | 3：`switchModel`、（HTML）、（トップレベル） |
| `showModelNote` 📝 | 関数 | 3339 | 2：`switchModel`、（HTML） |
| `hideModelNote` | 関数 | 3347 | 3：`showModelNote`、`switchModel`、（HTML） |
| `switchModel` 📝 | 関数 | 3353 | 1：`openModelSheet` |
| `fetchWeather` 📝 | 関数 | 3378 | 8：`fetchGPS`、`gotoPeak`、`pickMapPoint`、`pickPinPoint`、`renderFavList`、`selectFav` ほか2 |
| `weatherJsonUsable` | 関数 | 3445 | 1：`fetchWeather` |
| `applyWeatherJson` 📝 | 関数 | 3450 | 1：`fetchWeather` |
| `CLOUD_LEVELS` 📝 | 定数 | 3486 | 2：`applySupplemental`、`fetchSupplemental` |
| `fetchSupplemental` 📝 | 関数 | 3493 | 1：`fetchWeather` |
| `applySupplemental` 📝 | 関数 | 3519 | 2：`fetchSupplemental`、`fetchWeather` |
| `isoHour` 📝 | 関数 | 3541 | 4：`cloudProfileAt`、`ensureWindField`、`makeHintEngine`、`terrainVerifyCols` |
| `cloudProfileAt` 📝 | 関数 | 3545 | 1：`buildCloudRaster` |
| `cloudSlopes` 📝 | 関数 | 3559 | 1：`buildCloudRaster` |
| `cloudAt` 📝 | 関数 | 3578 | 1：`buildCloudRaster` |
| `indexOfNow` 📝 | 関数 | 3595 | 3：`applyRange`、`radarNoteText`、`updateRainOutlook` |
| `applyRange` 📝 | 関数 | 3604 | 1：`applyWeatherJson` |
| `aheadHour` | 関数 | 3635 | 1：`processData` |
| `GUST_FACTOR` | 定数 | 3649 | 2：`summitGust`、`summitGustRange` |
| `GUST_FACTOR_SD` | 定数 | 3650 | 1：`summitGustRange` |
| `GUST_MIN_WIND` | 定数 | 3651 | 2：`summitGust`、`summitGustRange` |
| `summitGust` | 関数 | 3652 | 1：`processData` |
| `summitGustRange` | 関数 | 3657 | 1：`processData` |
| `processData` 📝 | 関数 | 3662 | 2：`applyWeatherJson`、`buildRanking` |

## GPS

行 3708〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `fetchGPS` 📝 | 関数 | 3711 | 2：`setLocateMode`、（HTML） |
| `reverseGeocode` 📝 | 関数 | 3736 | 3：`fetchGPS`、`pickPinPoint`、（トップレベル） |

## RENDER MASTER

行 3745〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `render` 📝 | 関数 | 3752 | 1：`applyWeatherJson` |
| `updateLocationName` 📝 | 関数 | 3774 | 1：`render` |
| `FAV_STEP` | 定数 | 3781 | 5：`centerActiveChip`、`favPos`、`layoutFavRotary`、`spinToIndex`、（トップレベル） |
| `FAV_ANGLE` 📝 | 定数 | 3783 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_R` 📝 | 定数 | 3784 | 2：`layoutFavRotary`、`updateFavRotaryTransforms` |
| `FAV_CYCLES` 📝 | 定数 | 3797 | 3：`favTargetPos`、`layoutFavRotary`、（トップレベル） |
| `FAV_CYCLE_MIN` | 定数 | 3798 | 1：`favCircular` |
| `favCount` | 関数 | 3799 | 4：`centeredChip`、`favCircular`、`favTargetPos`、（トップレベル） |
| `favCircular` | 関数 | 3800 | 4：`favTargetPos`、`favWrapD`、`layoutFavRotary`、（トップレベル） |
| `favWrapD` 📝 | 関数 | 3802 | 2：`centeredChip`、`updateFavRotaryTransforms` |
| `favTargetPos` 📝 | 関数 | 3808 | 2：`centerActiveChip`、`spinToIndex` |
| `sameLoc` 📝 | 関数 | 3818 | 13：`assignSpot`、`currentFavChip`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`renderFavRotary` ほか7 |
| `distKm` | 関数 | 3827 | 2：`renderFavList`、`sortedFavs` |
| `sortedFavs` | 関数 | 3833 | 2：`favRotaryItems`、`renderFavList` |
| `fmtKm` | 関数 | 3840 | 1：`renderFavList` |
| `favRotaryItems` 📝 | 関数 | 3842 | 1：`renderFavRotary` |
| `SPOTS` 📝 | 定数 | 3857 | 7：`SPOT_KINDS`、`goSpot`、`loadSpot`、`renderFavList`、`saveSpot`、`toggleFavStar` ほか1 |
| `SPOT_KINDS` | 定数 | 3861 | 7：`assignSpot`、`favRotaryItems`、`migrateSpotsOutOfFavs`、`renderFavList`、`toggleFavStar`、`updateFavRotaryTransforms` ほか1 |
| `loadSpot` 📝 | 関数 | 3862 | 11：`assignSpot`、`favRotaryItems`、`goSpot`、`loadHome`、`migrateSpotsOutOfFavs`、`releaseSpot` ほか5 |
| `saveSpot` 📝 | 関数 | 3868 | 3：`assignSpot`、`releaseSpot`、`saveHome` |
| `returnToFavs` | 関数 | 3880 | 2：`assignSpot`、`releaseSpot` |
| `assignSpot` | 関数 | 3885 | 2：`goSpot`、`renderFavList` |
| `releaseSpot` | 関数 | 3896 | 1：`renderFavList` |
| `migrateSpotsOutOfFavs` | 関数 | 3901 | 1：（トップレベル） |
| `goSpot` 📝 | 関数 | 3908 | 3：`goHome`、`renderFavList`、（HTML） |
| `updateSpotButtons` 📝 | 関数 | 3918 | 2：`saveSpot`、（トップレベル） |
| `loadHome` | 関数 | 3930 | 0 |
| `saveHome` | 関数 | 3931 | 0 |
| `goHome` | 関数 | 3932 | 0 |
| `currentFavChip` | 関数 | 3936 | 1：`centerActiveChip` |
| `favPos` | 関数 | 3942 | 4：`centeredChip`、`favTargetPos`、`updateFavRotaryTransforms`、（トップレベル） |
| `renderFavRotary` 📝 | 関数 | 3947 | 5：`renderFavList`、`saveCurrentAsFav`、`saveSpot`、`toggleFavStar`、`updateLocationName` |
| `layoutFavRotary` 📝 | 関数 | 3993 | 4：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、（トップレベル） |
| `updateFavRotaryTransforms` 📝 | 関数 | 4028 | 5：`centerActiveChip`、`layoutFavRotary`、`renderFavRotary`、`spinToIndex`、（トップレベル） |
| `spinToIndex` 📝 | 関数 | 4063 | 1：`renderFavRotary` |
| `centerActiveChip` 📝 | 関数 | 4076 | 5：`moveFavRotaryTo`、`renderFavRotary`、`restoreFavRotary`、`selectFav`、（トップレベル） |
| `toggleFavStar` 📝 | 関数 | 4094 | 1：（HTML） |
| `updateFavStar` 📝 | 関数 | 4106 | 1：`renderFavRotary` |
| `FAV_GO_ZOOM` | 定数 | 4117 | 1：`selectFav` |
| `selectFav` 📝 | 関数 | 4119 | 3：`goSpot`、`spinToIndex`、（トップレベル） |
| `centeredChip` 📝 | 関数 | 4131 | 1：（トップレベル） |

## HUD

行 4202〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DOW_JP` | 定数 | 4205 | 4：`drawScrubber`、`mapTimeLabel`、`updateDateBadge`、`updatePopup` |
| `HOLIDAY_FIXED` | 定数 | 4211 | 1：`jpHolidayBase` |
| `HOLIDAY_NTH` | 定数 | 4217 | 1：`jpHolidayBase` |
| `nthMondayDate` 📝 | 関数 | 4220 | 1：`jpHolidayBase` |
| `equinoxDate` 📝 | 関数 | 4225 | 1：`jpHolidayBase` |
| `jpHolidayBase` 📝 | 関数 | 4230 | 1：`jpHoliday` |
| `jpHoliday` 📝 | 関数 | 4241 | 3：`drawScrubber`、`isRestDay`、`updateDateBadge` |
| `isRestDay` 📝 | 関数 | 4261 | 1：`drawScrubber` |
| `updateDateBadge` 📝 | 関数 | 4266 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `rainWord` 📝 | 関数 | 4282 | 1：`updatePopup` |
| `windWord` 📝 | 関数 | 4290 | 1：`updatePopup` |
| `LEAD_SHOW_H` | 定数 | 4308 | 1：`forecastLead` |
| `LEAD_LOW_H` | 定数 | 4309 | 1：`forecastLead` |
| `forecastLead` | 関数 | 4310 | 3：`fillReliability`、`refreshRanking`、`updatePopup` |
| `forecastLeadText` | 関数 | 4320 | 2：`refreshRanking`、`updatePopup` |
| `LEAD_TITLE` | 定数 | 4325 | 2：`refreshRanking`、`updatePopup` |
| `JMA_FORECAST_BASE` | 定数 | 4341 | 1：`loadReliability` |
| `RELIABILITY_TTL_MS` | 定数 | 4342 | 1：`loadReliability` |
| `RELIABILITY_LABEL` | 定数 | 4343 | 1：`fillReliability` |
| `PEAK_MATCH_DEG` | 定数 | 4351 | 1：`peakAt` |
| `peakAt` | 関数 | 4352 | 1：`fillReliability` |
| `loadReliability` | 関数 | 4366 | 1：`fillReliability` |
| `fillReliability` | 関数 | 4394 | 1：`updatePopup` |
| `updateLegendValues` | 関数 | 4438 | 1：`updatePopup` |
| `updatePopup` 📝 | 関数 | 4454 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`setSelectedIndex`、（トップレベル） |
| `positionPopupAt` 📝 | 関数 | 4533 | 2：`selectFromPointer`、（トップレベル） |
| `POPUP_HOME` 📝 | 定数 | 4546 | 1：`resetPopupPosition` |
| `resetPopupPosition` 📝 | 関数 | 4547 | 2：`render`、（トップレベル） |

## ABC JUDGMENT

行 4553〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `GRADE_COL` 📝 | 定数 | 4558 | 4：`drawAreas`、`drawCloudPrecip`、`drawFeelBand`、`drawScrubber` |
| `GRADE_COL_NONE` 📝 | 定数 | 4559 | 2：`drawAreas`、`drawScrubber` |
| `abcScore` 📝 | 関数 | 4561 | 2：`judgeBreakdown`、`judgePoint` |
| `abcScoreInv` 📝 | 関数 | 4567 | 2：`judgeBreakdown`、`judgePoint` |
| `judgePoint` 📝 | 関数 | 4574 | 1：`gradeOf` |
| `judgeBreakdown` 📝 | 関数 | 4618 | 3：`drawCloudPrecip`、`drawFeelBand`、`updatePopup` |

## CHARTS (uPlot)  ── 1日≒1画面の広い時間軸を横スクロール。

行 4632〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `CHART_H_SKY` | 定数 | 4638 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_CLOUD` | 定数 | 4639 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_WIND` | 定数 | 4640 | 5：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter`、`drawAxisGutterRight` |
| `CHART_H_PRESS` | 定数 | 4641 | 4：`buildCharts`、`chartsTotalH`、`computeChartHeights`、`drawAxisGutter` |
| `chartsTotalH` 📝 | 関数 | 4642 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `computeChartHeights` 📝 | 関数 | 4644 | 1：`buildCharts` |
| `ALT_TOP` | 定数 | 4653 | 3：`altFrac`、`buildCloudRaster`、`drawCloudPrecip` |
| `ALT_TICKS` | 定数 | 4654 | 2：`drawAxisGutterRight`、`drawCloudPrecip` |
| `altFrac` | 関数 | 4658 | 3：`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight` |
| `niceRange` 📝 | 関数 | 4663 | 1：`buildCharts` |
| `PADDING_L` 📝 | 定数 | 4672 | 11：`buildCharts`、`chartTotalW`、`drawAxisGutter`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか5 |
| `PADDING_R` 📝 | 定数 | 4673 | 7：`buildCharts`、`chartTotalW`、`drawAxisGutterRight`、`drawCloudOverlay`、`drawCloudPrecip`、`drawDayBackground` ほか1 |
| `MODEL_BAND_H` | 定数 | 4679 | 3：`SKY_TOP_PAD`、`drawModelBand`、`drawTempOverlay` |
| `SKY_TOP_PAD` 📝 | 定数 | 4680 | 3：`buildCharts`、`drawAxisGutter`、`drawTempOverlay` |
| `FEEL_BAND_H` | 定数 | 4688 | 3：`buildCharts`、`drawAxisGutter`、`drawFeelBand` |
| `FORECAST_HOURS` | 定数 | 4689 | 2：`HOURS`、`applyRange` |
| `HOURS` | 定数 | 4690 | 12：`applyRange`、`buildCharts`、`chartTotalW`、`cursorX`、`dayBandsFracs`、`drawDayBackground` ほか6 |
| `TIME_AXIS_H` | 定数 | 4691 | 6：`buildCharts`、`cloudPlotBox`、`drawAxisGutter`、`drawAxisGutterRight`、`drawFeelBand`、`drawPressOverlay` |
| `HOURS_PER_SCREEN` | 定数 | 4692 | 2：`buildCharts`、`pressWindowFor` |
| `SCRUB_POS` | 定数 | 4693 | 2：`cursorX`、`scrollToIndex` |
| `PX_RATIO` | 定数 | 4694 | 3：`buildCharts`、`drawAxisGutter`、`drawAxisGutterRight` |
| `chartTotalW` 📝 | 関数 | 4702 | 5：`buildCharts`、`chartMaxOffset`、`cursorX`、`drawScrubber`、`layoutScrubber` |
| `idxToX` 📝 | 関数 | 4705 | 5：`cursorX`、`drawScrubber`、`indexScreenX`、`positionScrubLine`、`scrollToIndex` |
| `canvasRatio` 📝 | 関数 | 4708 | 9：`cloudPlotBox`、`drawDayBackground`、`drawFreezingLine`、`drawNowMarker`、`drawPressOverlay`、`drawTempOverlay` ほか3 |
| `buildCharts` 📝 | 関数 | 4710 | 5：`applySupplemental`、`refreshRadarCheck`、`render`、`updateElevationLabel`、（トップレベル） |
| `PRESS_LINE_FRAC` | 定数 | 4883 | 2：`drawPressOverlay`、`pressGutterLayout` |
| `PRESS_BAR_MAX` | 定数 | 4884 | 1：`drawPressOverlay` |
| `PRESS_BOMB_DP` | 定数 | 4885 | 1：`pressBombIndices` |
| `PRESS_WIN_MIN_HPA` | 定数 | 4897 | 1：`pressWindowFor` |
| `PRESS_WIN_PAD` | 定数 | 4898 | 1：`pressWindowFor` |
| `PRESS_WIN_COARSE` | 定数 | 4899 | 1：`updatePressWindow` |
| `PRESS_WIN_FINE` | 定数 | 4900 | 1：`updatePressWindow` |
| `PRESS_WIN_SETTLE_MS` | 定数 | 4901 | 1：`updatePressWindow` |
| `pressWindowFor` 📝 | 関数 | 4904 | 2：`applyPressWindow`、`buildCharts` |
| `applyPressWindow` 📝 | 関数 | 4922 | 1：`updatePressWindow` |
| `updatePressWindow` 📝 | 関数 | 4934 | 1：`setSelectedIndex` |
| `pressSegStyle` 📝 | 関数 | 4946 | 1：`drawPressOverlay` |
| `drawPressBomb` 📝 | 関数 | 4955 | 1：`drawPressOverlay` |
| `pressBombIndices` 📝 | 関数 | 4974 | 1：`drawPressOverlay` |
| `drawPressOverlay` 📝 | 関数 | 4989 | 1：`buildCharts` |
| `pressGutterLayout` 📝 | 関数 | 5098 | 1：`drawAxisGutter` |
| `drawAxisGutter` 📝 | 関数 | 5109 | 2：`applyPressWindow`、`buildCharts` |
| `drawAxisGutterRight` 📝 | 関数 | 5234 | 1：`drawAxisGutter` |
| `dayBandsFracs` 📝 | 関数 | 5293 | 4：`drawDayBackground`、`drawScrubber`、`isNightIdx`、`nightBandsFracs` |
| `NIGHT_RGB` | 定数 | 5311 | 1：`paintNightOverlay` |
| `NIGHT_ALPHA_NEW` | 定数 | 5315 | 1：`nightAlphaAt` |
| `NIGHT_ALPHA_FULL` | 定数 | 5316 | 1：`nightAlphaAt` |
| `moonIllum` 📝 | 関数 | 5318 | 1：`nightAlphaAt` |
| `nightAlphaAt` 📝 | 関数 | 5321 | 1：`paintNightOverlay` |
| `softEdgePx` 📝 | 関数 | 5325 | 2：`drawDayBackground`、`paintNightOverlay` |
| `softGradient` 📝 | 関数 | 5328 | 2：`drawDayBackground`、`paintNightOverlay` |
| `nightBandsFracs` 📝 | 関数 | 5341 | 1：`paintNightOverlay` |
| `paintNightOverlay` 📝 | 関数 | 5355 | 2：`drawCloudPrecip`、`drawDayBackground` |
| `drawDayBackground` 📝 | 関数 | 5370 | 1：`buildCharts` |
| `drawTimeLabels` 📝 | 関数 | 5413 | 5：`drawCloudOverlay`、`drawPressOverlay`、`drawTempOverlay`、`drawTimeLabelsHook`、`drawWindOverlay` |
| `drawTimeLabelsHook` | 関数 | 5427 | 0 |
| `CLOUD_RGB` 📝 | 定数 | 5441 | 1：`buildCloudRaster` |
| `SKY_TOP` 📝 | 定数 | 5444 | 1：`drawCloudPrecip` |
| `SKY_BOTTOM` 📝 | 定数 | 5445 | 1：`drawCloudPrecip` |
| `CLOUD_ROWS` 📝 | 定数 | 5446 | 1：`buildCloudRaster` |
| `CLOUD_SUB` 📝 | 定数 | 5447 | 1：`buildCloudRaster` |
| `cloudAlpha` 📝 | 関数 | 5449 | 1：`buildCloudRaster` |
| `buildCloudRaster` 📝 | 関数 | 5458 | 1：`cloudRasterFor` |
| `cloudRasterFor` 📝 | 関数 | 5499 | 1：`drawCloudPrecip` |
| `cloudPlotBox` 📝 | 関数 | 5508 | 2：`drawCloudOverlay`、`drawCloudPrecip` |
| `drawCloudPrecip` 📝 | 関数 | 5515 | 1：`buildCharts` |
| `drawCloudOverlay` 📝 | 関数 | 5680 | 1：`buildCharts` |
| `FEEL_STOPS` | 定数 | 5725 | 1：`feelColor` |
| `feelColor` | 関数 | 5735 | 1：`drawFeelBand` |
| `drawFeelBand` | 関数 | 5754 | 1：`drawTempOverlay` |
| `FREEZING_LINE_COLOR` | 定数 | 5795 | 2：`drawAxisGutter`、`drawFreezingLine` |
| `COLD_ZONE_STOPS` | 定数 | 5803 | 1：`coldZoneRgba` |
| `coldZoneRgba` | 関数 | 5810 | 1：`drawColdZone` |
| `drawColdZone` | 関数 | 5821 | 1：`drawFreezingLine` |
| `drawFreezingLine` 📝 | 関数 | 5838 | 1：`buildCharts` |
| `MODEL_BAND_STYLE` | 定数 | 5860 | 1：`drawModelBand` |
| `modelBandSegments` 📝 | 関数 | 5866 | 1：`drawModelBand` |
| `drawModelBand` 📝 | 関数 | 5875 | 1：`drawTempOverlay` |
| `drawTempOverlay` 📝 | 関数 | 5903 | 1：`buildCharts` |
| `drawWindOverlay` 📝 | 関数 | 5986 | 1：`buildCharts` |
| `drawWindArrow` 📝 | 関数 | 6034 | 1：`drawWindOverlay` |
| `nowIndexFrac` 📝 | 関数 | 6051 | 7：`drawNowMarker`、`drawScrubber`、`jumpToNow`、`mapTimeLabel`、`mapTimeNow`、`updateMapTime` ほか1 |
| `drawNowMarker` 📝 | 関数 | 6059 | 1：`buildCharts` |
| `updateNowButton` 📝 | 関数 | 6082 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `jumpToNow` 📝 | 関数 | 6088 | 1：（HTML） |

## SKY COLOR HELPER

行 6104〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `getSkyColor` 📝 | 関数 | 6107 | 0 |

## WEATHER EMOJI

行 6128〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WX` | 定数 | 6137 | 5：`drawWeatherGlyph`、`wxBolt`、`wxDrops`、`wxMoon`、`wxSun` |
| `wxSun` 📝 | 関数 | 6144 | 1：`drawWeatherGlyph` |
| `SYNODIC_MONTH` | 定数 | 6163 | 1：`moonPhase` |
| `NEW_MOON_EPOCH` | 定数 | 6164 | 1：`moonPhase` |
| `moonPhase` 📝 | 関数 | 6165 | 2：`drawWeatherGlyph`、`moonIllum` |
| `wxMoon` 📝 | 関数 | 6174 | 1：`drawWeatherGlyph` |
| `wxCloud` 📝 | 関数 | 6196 | 1：`drawWeatherGlyph` |
| `wxDrops` 📝 | 関数 | 6209 | 1：`drawWeatherGlyph` |
| `wxBolt` 📝 | 関数 | 6222 | 1：`drawWeatherGlyph` |
| `drawWeatherGlyph` 📝 | 関数 | 6236 | 1：`drawTempOverlay` |
| `weatherEmoji` 📝 | 関数 | 6284 | 1：`updatePopup` |
| `isNightIdx` 📝 | 関数 | 6298 | 1：`drawTempOverlay` |

## PARTICLES (雨・雪エフェクト)

行 6303〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `particles` | 状態 | 6306 | 1：`updateParticles` |
| `updateParticles` 📝 | 関数 | 6309 | 3：`render`、`scrubFrame`、（トップレベル） |
| `makeParticle` 📝 | 関数 | 6361 | 1：`updateParticles` |
| `drawRaindrop` 📝 | 関数 | 6378 | 1：`updateParticles` |
| `drawSnowflake` 📝 | 関数 | 6386 | 1：`updateParticles` |

## 時刻選択

行 6393〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `chartMaxOffset` 📝 | 関数 | 6408 | 3：`cursorX`、`scrollToIndex`、`setChartOffset` |
| `setChartOffset` 📝 | 関数 | 6409 | 2：`scrubFrame`、`setScrollBoth` |
| `indexFromClientX` 📝 | 関数 | 6416 | 1：`selectFromPointer` |
| `indexScreenX` 📝 | 関数 | 6424 | 0 |
| `positionScrubLine` 📝 | 関数 | 6430 | 8：`animateScrollTo`、`applySupplemental`、`refreshRadarCheck`、`render`、`scrollToIndex`、`scrubFrame` ほか2 |
| `setSelectedIndex` 📝 | 関数 | 6451 | 4：`jumpToNow`、`scrubFrame`、`selectFromPointer`、`setMapTime` |
| `cursorX` 📝 | 関数 | 6467 | 2：`scrollToIndex`、`scrubberIndexFromScroll` |
| `scrollToIndex` 📝 | 関数 | 6489 | 3：`render`、`setSelectedIndex`、（トップレベル） |
| `setScrollBoth` 📝 | 関数 | 6509 | 2：`animateScrollTo`、`scrollToIndex` |
| `cancelScrollAnim` 📝 | 関数 | 6514 | 3：`animateScrollTo`、`scrollToIndex`、（トップレベル） |
| `animateScrollTo` 📝 | 関数 | 6520 | 1：`scrollToIndex` |
| `scrubberIndexFromScroll` 📝 | 関数 | 6552 | 1：`scrubFrame` |
| `mirrorScrollToScrubber` 📝 | 関数 | 6560 | 1：`layoutScrubber` |
| `layoutScrubber` 📝 | 関数 | 6570 | 2：`render`、（トップレベル） |
| `drawScrubber` 📝 | 関数 | 6583 | 1：`layoutScrubber` |
| `scrubFrame` 📝 | 関数 | 6681 | 1：（トップレベル） |
| `selectFromPointer` 📝 | 関数 | 6713 | 1：（トップレベル） |

## MAP — レイヤー定義

行 6738〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MAP_ZOOM_MIN` 📝 | 定数 | 6743 | 2：`openMap`、`tileOpts` |
| `MAP_ZOOM_MAX` 📝 | 定数 | 6744 | 2：`openMap`、`tileOpts` |
| `MAP_BASES` 📝 | 定数 | 6747 | 2：`findBase`、`layerSectionDefs` |
| `MAP_BASE_DEFAULT` | 定数 | 6760 | 4：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`renderLayerPanel` |
| `TOCHIGI_CREDIT` | 定数 | 6764 | 1：`MAP_OVERLAYS` |
| `MAP_OVERLAYS` 📝 | 定数 | 6767 | 2：`findOverlay`、`usableOverlays` |
| `RRIM_SHADE` 📝 | 定数 | 6842 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_SLOPE` 📝 | 定数 | 6843 | 2：`RRIM_CONFLICTS`、`buildRrimLayers` |
| `RRIM_CONFLICTS` 📝 | 定数 | 6845 | 1：`toggleOverlay` |
| `AMEDAS_ELEMENTS` 📝 | 定数 | 6849 | 4：`amedasElementChips`、`amedasElementDef`、`drawAmedas`、`loadMapPrefs` |
| `AMEDAS_ELEMENT_DEFAULT` | 定数 | 6856 | 2：`loadMapPrefs`、`mapPrefs` |
| `amedasElementDef` 📝 | 関数 | 6857 | 2：`drawAmedas`、`setAmedasElement` |
| `AMEDAS_DIR16` 📝 | 定数 | 6864 | 2：`amedasDirName`、`windDirName` |
| `amedasDirName` 📝 | 関数 | 6866 | 1：`drawAmedas` |
| `amedasDirDeg` 📝 | 関数 | 6867 | 1：`drawAmedas` |
| `MAP_LS_BASE` | 定数 | 6869 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OVERLAYS` | 定数 | 6870 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_AMEDAS_EL` | 定数 | 6871 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_WIND_MODE` | 定数 | 6872 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_SAT_BAND` | 定数 | 6873 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_OPENS` 📝 | 定数 | 6874 | 2：`loadMapOpens`、`recordMapOpen` |
| `MAP_LS_BLEND` | 定数 | 6875 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_ORDER` | 定数 | 6877 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_LAYER_HIDDEN` | 定数 | 6878 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `MAP_LS_BASE_OPACITY` | 定数 | 6879 | 2：`loadMapPrefs`、`saveMapPrefs` |
| `LAYER_SECTIONS` | 定数 | 6880 | 2：`sanitizeLayerHiddenIds`、`sanitizeLayerOrder` |
| `MAP_BLEND_MODES` | 定数 | 6881 | 3：`blendChips`、`loadMapPrefs`、`setOverlayBlend` |
| `MAP_BLEND_KINDS_EXCLUDED` | 定数 | 6884 | 1：`isBlendable` |
| `BLEND_HOST` | 定数 | 6887 | 2：`applyBlendHost`、`isBlendable` |
| `BLEND_DEFAULT` | 定数 | 6888 | 1：`blendOf` |
| `isBlendable` | 関数 | 6889 | 5：`addTimedTileLayer`、`applyOverlays`、`loadMapPrefs`、`renderLayerPanel`、`setOverlayBlend` |
| `blendOf` | 関数 | 6895 | 4：`applyBlendHost`、`blendChips`、`openMap`、`overlayPane` |
| `JMA_NOWCAST_BASE` 📝 | 定数 | 6903 | 3：`JMA_TIMES_PRECIP`、`JMA_TIMES_THUNDER`、`timedTileUrl` |
| `JMA_TIMES_PRECIP` 📝 | 定数 | 6906 | 1：`MAP_WEATHER` |
| `JMA_TIMES_THUNDER` 📝 | 定数 | 6907 | 1：`MAP_WEATHER` |
| `JMA_SAT_BASE` 📝 | 定数 | 6912 | 2：`JMA_TIMES_SAT`、`timedTileUrl` |
| `JMA_TIMES_SAT` 📝 | 定数 | 6913 | 1：`MAP_WEATHER` |
| `SAT_BANDS` 📝 | 定数 | 6923 | 2：`satBandDef`、`satBands` |
| `SAT_BAND_DEFAULT` | 定数 | 6937 | 2：`loadMapPrefs`、`mapPrefs` |
| `SAT_COMMON_HINT` | 定数 | 6942 | 1：`satBandChips` |
| `satBands` 📝 | 関数 | 6959 | 3：`loadMapPrefs`、`satBandChips`、`satBandDef` |
| `satBandDef` 📝 | 関数 | 6960 | 4：`applyWxBlend`、`satBandChips`、`setSatBand`、`timedTileUrl` |
| `WX_REFRESH_MS` 📝 | 定数 | 6965 | 1：`startWxRefresh` |
| `MAP_WEATHER` 📝 | 定数 | 6967 | 2：`findOverlay`、`usableWeather` |
| `findBase` 📝 | 関数 | 7022 | 6：`applyBaseLayer`、`loadMapPrefs`、`paintTileTrouble`、`renderLayerPanel`、`setMapBase`、`updateMapAttribution` |
| `findOverlay` 📝 | 関数 | 7023 | 13：`applyOverlays`、`buildRrimLayers`、`loadMapPrefs`、`overlayOpacity`、`paintTileTrouble`、`readNowcastSeriesRaw` ほか7 |
| `usableOverlays` 📝 | 関数 | 7027 | 1：`layerSectionDefs` |
| `usableWeather` 📝 | 関数 | 7028 | 1：`layerSectionDefs` |
| `layerSectionDefs` 📝 | 関数 | 7031 | 4：`layerHiddenSummary`、`sanitizeLayerHiddenIds`、`sanitizeLayerOrder`、`sectionLayers` |
| `orderLayers` 📝 | 関数 | 7039 | 2：`sanitizeLayerOrder`、`sectionLayers` |
| `sanitizeLayerOrder` 📝 | 関数 | 7054 | 1：`loadMapPrefs` |
| `sanitizeLayerHiddenIds` 📝 | 関数 | 7066 | 1：`loadMapPrefs` |
| `loadMapPrefs` 📝 | 関数 | 7073 | 1：`openMap` |
| `saveMapPrefs` 📝 | 関数 | 7145 | 11：`moveLayer`、`resetLayerOrder`、`setAmedasElement`、`setBaseOpacity`、`setMapBase`、`setOverlayBlend` ほか5 |

## MAP — 本体

行 7159〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `mapPrefs` 📝 | 状態 | 7164 | 35：`amedasElementChips`、`applyBaseLayer`、`applyOverlays`、`applyWxBlend`、`baseOpacity`、`blendOf` ほか29 |
| `overlayTileLayers` | 状態 | 7169 | 4：`addTimedTileLayer`、`applyOverlays`、`paintThunderIcons`、`setOverlayOpacity` |
| `tileOpts` 📝 | 関数 | 7172 | 4：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays`、`buildRrimLayers` |
| `baseOpacity` 📝 | 関数 | 7189 | 5：`applyBaseLayer`、`loadMapPrefs`、`mapPrefs`、`paintBaseFaded`、`renderLayerPanel` |
| `paintBaseFaded` 📝 | 関数 | 7193 | 2：`applyBaseLayer`、`setBaseOpacity` |
| `setBaseOpacity` 📝 | 関数 | 7197 | 1：`renderLayerPanel` |
| `applyBaseLayer` 📝 | 関数 | 7207 | 2：`openMap`、`setMapBase` |
| `buildRrimLayers` 📝 | 関数 | 7222 | 1：`applyOverlays` |
| `CI_TERRAIN_URL` | 定数 | 7243 | 1：`ciFetchBlob` |
| `CI_PRM` 📝 | 定数 | 7244 | 3：`CiMapLayerClass`、`ciComputeMain`、`ciRenderTile` |
| `CI_ZOOM_NOTE` | 定数 | 7245 | 1：`updateCiZoomNote` |
| `CI_BLOB_MAX` | 定数 | 7246 | 2：`ciDecodeMain`、`ciFetchBlob` |
| `ciStats` 📝 | 状態 | 7247 | 2：`ciComputeMain`、`ciRenderTile` |
| `decodeTochigiDem` 📝 | 関数 | 7250 | 3：`CI_WORKER_FNS`、`ciDecodeMain`、`ciWorkerMain` |
| `ciGaussBlur` 📝 | 関数 | 7258 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciAcos` 📝 | 関数 | 7282 | 2：`CI_WORKER_FNS`、`computeCiTile` |
| `ciMetersPerPx` | 関数 | 7287 | 1：`ciRenderTile` |
| `ciMargin` 📝 | 関数 | 7292 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciAssembleGrid` 📝 | 関数 | 7294 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `computeCiTile` 📝 | 関数 | 7306 | 3：`CI_WORKER_FNS`、`ciComputeMain`、`ciWorkerMain` |
| `ciWorkerMain` 📝 | 関数 | 7346 | 1：`getCiWorker` |
| `CI_WORKER_FNS` 📝 | 定数 | 7378 | 1：`getCiWorker` |
| `getCiWorker` 📝 | 関数 | 7382 | 1：`ciRenderTile` |
| `ciBreakWorker` 📝 | 関数 | 7402 | 1：`getCiWorker` |
| `ciTileKey` | 関数 | 7412 | 2：`ciFetchBlob`、`ciRenderTile` |
| `ciFetchBlob` 📝 | 関数 | 7413 | 1：`ciRenderTile` |
| `ciDecodeMain` 📝 | 関数 | 7434 | 1：`ciComputeMain` |
| `ciComputeMain` 📝 | 関数 | 7446 | 1：`ciRenderTile` |
| `ciRenderTile` 📝 | 関数 | 7461 | 1：`CiMapLayerClass` |
| `ciCancel` 📝 | 関数 | 7483 | 1：`applyOverlays` |
| `CiMapLayerClass` 📝 | 関数 | 7493 | 1：`applyOverlays` |
| `updateCiZoomNote` 📝 | 関数 | 7515 | 2：`applyOverlays`、`openMap` |
| `applyOverlays` 📝 | 関数 | 7523 | 2：`openMap`、`toggleOverlay` |
| `wxTimesPromises` | 状態 | 7569 | 2：`clearWxTimes`、`jmaTimesList` |
| `jmaTimesList` 📝 | 関数 | 7571 | 2：`jmaTimes`、`readNowcastSeriesRaw` |
| `latestObsTime` 📝 | 関数 | 7586 | 2：`jmaTimes`、`nowcastSeries` |
| `jmaTimes` 📝 | 関数 | 7594 | 1：`addTimedTileLayer` |
| `clearWxTimes` 📝 | 関数 | 7598 | 1：`refreshWeatherLayers` |
| `timedTileUrl` 📝 | 関数 | 7601 | 2：`addTimedTileLayer`、`readNowcastSeriesRaw` |
| `WX_DROP_MS` 📝 | 定数 | 7618 | 1：`addTimedTileLayer` |
| `dropStaleWxLayer` 📝 | 関数 | 7620 | 1：`addTimedTileLayer` |
| `dropAllStaleWxLayers` 📝 | 関数 | 7625 | 2：`applyOverlays`、`closeMap` |
| `wxPaneFor` 📝 | 関数 | 7636 | 1：`addTimedTileLayer` |
| `SVG_NS` | 定数 | 7665 | 1：`buildSatFilter` |
| `buildSatFilter` 📝 | 関数 | 7667 | 2：`applyWxBlend`、（HTML） |
| `applyWxBlend` 📝 | 関数 | 7712 | 1：`addTimedTileLayer` |
| `addTimedTileLayer` 📝 | 関数 | 7727 | 3：`applyOverlays`、`refreshWeatherLayers`、`setSatBand` |
| `startWxRefresh` 📝 | 関数 | 7760 | 1：`openMap` |
| `stopWxRefresh` 📝 | 関数 | 7764 | 1：`closeMap` |
| `refreshWeatherLayers` 📝 | 関数 | 7769 | 2：`openMap`、`startWxRefresh` |
| `RAIN_MM` | 定数 | 7794 | 2：`radarNoteText`、`rainOutlookHourly` |
| `RAIN_LOOK_H` | 定数 | 7795 | 1：`rainOutlookHourly` |
| `JMA_BANDS` | 定数 | 7798 | 1：`timeBandWord` |
| `timeBandWord` 📝 | 関数 | 7799 | 1：`rainOutlookHourly` |
| `dayWord` 📝 | 関数 | 7801 | 1：`rainOutlookHourly` |
| `rainOutlookHourly` 📝 | 関数 | 7812 | 1：`updateRainOutlook` |
| `NOWC_TILE_Z` | 定数 | 7837 | 1：`readNowcastSeriesRaw` |
| `NOWC_ALPHA_MIN` | 定数 | 7838 | 1：`readNowcastSeriesRaw` |
| `NOWC_MAX_STEPS` | 定数 | 7839 | 1：`readNowcastSeriesRaw` |
| `NOWC_STEP_MIN` | 定数 | 7840 | 3：`drawCloudPrecip`、`radarWetAt`、`rainOutlookNowcast` |
| `tilePixelAt` 📝 | 関数 | 7843 | 1：`readNowcastSeriesRaw` |
| `parseJmaTime` 📝 | 関数 | 7854 | 1：`readNowcastSeriesRaw` |
| `nowcastSeries` 📝 | 関数 | 7861 | 1：`readNowcastSeriesRaw` |
| `probeTileAlpha` 📝 | 関数 | 7872 | 1：`readNowcastSeriesRaw` |
| `tileReachable` | 関数 | 7887 | 1：`readNowcastSeriesRaw` |
| `loadTileImage` 📝 | 関数 | 7892 | 1：`readNowcastSeriesRaw` |
| `NOWC_CACHE_MS` | 定数 | 7915 | 1：`readNowcastSeries` |
| `readNowcastSeries` | 関数 | 7918 | 2：`rainOutlookNowcast`、`refreshRadarCheck` |
| `readNowcastSeriesRaw` | 関数 | 7932 | 1：`readNowcastSeries` |
| `rainOutlookNowcast` 📝 | 関数 | 7995 | 1：`updateRainOutlook` |

## レーダー実況とモデル予報の突き合わせ（v4.98.0）

行 8012〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RADAR_MAX_AGE_MS` | 定数 | 8029 | 1：`radarUsable` |
| `RADAR_REFRESH_MS` | 定数 | 8030 | 1：`startRadarWatch` |
| `radarAgeMs` | 関数 | 8035 | 1：`radarUsable` |
| `radarUsable` | 関数 | 8039 | 4：`drawCloudPrecip`、`radarNoteText`、`radarNowWet`、`radarWetAt` |
| `radarWetAt` | 関数 | 8044 | 0 |
| `radarNowWet` | 関数 | 8083 | 1：`radarNoteText` |
| `refreshRadarCheck` | 関数 | 8091 | 2：`applyWeatherJson`、`startRadarWatch` |
| `startRadarWatch` | 関数 | 8104 | 1：`applyWeatherJson` |
| `radarNoteText` | 関数 | 8113 | 1：`paintRadarNote` |
| `paintRadarNote` | 関数 | 8145 | 3：`applyWeatherJson`、`refreshRadarCheck`、（HTML） |
| `setRainText` 📝 | 関数 | 8155 | 1：`updateRainOutlook` |
| `updateRainOutlook` 📝 | 関数 | 8162 | 4：`applyWeatherJson`、`openMap`、`pickPinPoint`、`refreshWeatherLayers` |
| `WX_FAIL_MIN_TILES` | 定数 | 8191 | 1：`watchTileStatus` |
| `WX_FAIL_RATIO` | 定数 | 8192 | 1：`watchTileStatus` |
| `WX_FAIL_SETTLE_MS` | 定数 | 8193 | 1：`watchTileStatus` |
| `watchTileStatus` 📝 | 関数 | 8194 | 3：`addTimedTileLayer`、`applyBaseLayer`、`applyOverlays` |
| `layerStatus` | 状態 | 8230 | 4：`applyLayerStatus`、`paintTileTrouble`、`renderLayerPanel`、`updateCiZoomNote` |
| `layerFailed` 📝 | 状態 | 8231 | 3：`applyLayerStatus`、`drawPoi`、`paintTileTrouble` |
| `setLayerError` 📝 | 関数 | 8242 | 7：`addTimedTileLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`watchTileStatus` ほか1 |
| `setLayerNote` 📝 | 関数 | 8243 | 8：`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote`、`updateWindFlowGL` ほか2 |
| `clearLayerStatus` 📝 | 関数 | 8244 | 8：`applyBaseLayer`、`drawAmedas`、`drawAreas`、`drawPoi`、`makeHintEngine`、`updateCiZoomNote` ほか2 |
| `applyLayerStatus` | 関数 | 8245 | 3：`clearLayerStatus`、`setLayerError`、`setLayerNote` |
| `paintTileTrouble` 📝 | 関数 | 8259 | 2：`applyLayerStatus`、`closeMap` |

## 点で描く気象レイヤー（アメダス実測・風の矢印）

行 8275〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_CACHE_MS` | 定数 | 8290 | 1：`windRecord` |
| `WIND_CACHE_MAX` | 定数 | 8291 | 1：`fetchWindColumns` |
| `WIND_FETCH_DELAY_MS` | 定数 | 8292 | 1：`ensureWindField` |
| `WIND_BACKOFF_MS` | 定数 | 8293 | 3：`ensureWindField`、`fetchWindColumns`、`makeHintEngine` |
| `WIND_FETCH_MAX_POINTS` | 定数 | 8296 | 1：`ensureWindField` |
| `weatherMarkers` | 状態 | 8300 | 7：`clearWeatherMarkers`、`drawAmedas`、`drawAreas`、`drawPoi`、`drawSnowHint`、`drawThunderHint` ほか1 |
| `AMEDAS_MIN_ZOOM` | 定数 | 8301 | 1：`drawAmedas` |
| `WIND_MIN_ZOOM` | 定数 | 8302 | 2：`ensureWindField`、`makeHintEngine` |
| `clearWeatherMarkers` 📝 | 関数 | 8304 | 1：`refreshWeatherPoints` |
| `loadAmedas` 📝 | 関数 | 8310 | 1：`drawAmedas` |
| `drawAmedas` 📝 | 関数 | 8338 | 1：`refreshWeatherPoints` |

## 高度別の風の場（Wind Field Engine）— ADR-0012

行 8383〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FIELD_LEVELS` 📝 | 定数 | 8398 | 5：`WIND_FIELD_MODES`、`fetchWindColumns`、`windColumnAt`、`windModeNote`、`windTraceText` |
| `wfVars` | 関数 | 8406 | 2：`fetchWindColumns`、`windColumnAt` |
| `WIND_FIELD_MODES` 📝 | 定数 | 8410 | 3：`loadMapPrefs`、`windModeChips`、`windModeDef` |
| `WIND_MODE_DEFAULT` | 定数 | 8412 | 2：`ensureWindField`、`loadMapPrefs` |
| `windModeDef` | 関数 | 8413 | 2：`setWindMode`、`windModeNote` |
| `WIND_GRID` | 定数 | 8415 | 2：`buildWindField`、`windFieldLattice` |
| `WIND_BANDS` | 定数 | 8416 | 1：`windBand` |
| `windBand` | 関数 | 8417 | 1：`windFieldLattice` |
| `WIND_SPANS` | 定数 | 8419 | 1：`fetchWindColumns` |
| `windUV` | 関数 | 8421 | 1：`windColumnAt` |
| `windSpdDir` | 関数 | 8422 | 5：`drawWindArrows`、`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow`、`windTraceText` |
| `windLerp` | 関数 | 8423 | 1：（トップレベル） |
| `windDirName` | 関数 | 8425 | 2：`terrainColText`、`windTraceText` |
| `loadTerrainRef` 📝 | 関数 | 8431 | 2：`ensureWindField`、`makeHintEngine` |
| `zRefAt` 📝 | 関数 | 8441 | 3：`resolveWindAt`、`snowHintAt`、`windGLTerrainHeight` |
| `zMaxAt` | 関数 | 8446 | 1：`resolveWindAt` |
| `windFieldLattice` 📝 | 関数 | 8521 | 2：`buildWindField`、`makeHintEngine` |
| `windRecord` | 関数 | 8538 | 1：`buildWindField` |
| `fetchWindColumns` 📝 | 関数 | 8543 | 1：`ensureWindField` |
| `windColumnAt` | 関数 | 8582 | 1：`resolveWindAt` |
| `resolveWindAt` 📝 | 関数 | 8590 | 1：`buildWindField` |
| `buildWindField` 📝 | 関数 | 8609 | 1：`ensureWindField` |
| `sampleWindField` 📝 | 関数 | 8629 | 2：`buildFlowGrid`、`buildGLGrid` |
| `windTraceText` 📝 | 関数 | 8646 | 1：`drawWindArrows` |
| `windModeNote` | 関数 | 8698 | 1：`ensureWindField` |
| `WIND_LAYER_IDS` | 定数 | 8712 | 1：`windLayersOn` |
| `windLayersOn` | 関数 | 8713 | 4：`windAnyOn`、`windClear`、`windError`、`windNote` |
| `windAnyOn` | 関数 | 8714 | 3：`ensureWindField`、`pointHintAnyOn`、`refreshWeatherPoints` |
| `pointHintAnyOn` | 関数 | 8716 | 2：`loadTerrainRef`、`updateMapTime` |
| `windNote` | 関数 | 8717 | 1：`ensureWindField` |
| `windError` | 関数 | 8718 | 1：`ensureWindField` |
| `windClear` | 関数 | 8719 | 1：`ensureWindField` |
| `ensureWindField` 📝 | 関数 | 8723 | 1：`refreshWeatherPoints` |
| `drawWindArrows` 📝 | 関数 | 8776 | 1：`refreshWeatherPoints` |
| `makeHintEngine` 📝 | 関数 | 8804 | 1：（トップレベル） |
| `hintModelText` 📝 | 関数 | 8908 | 2：`snowHintText`、`thunderHintText` |

## 降雪の目安（段階2・#131）→ docs/requirements_snow_thunder_hint.md

行 8912〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SNOW_HINT` 📝 | 定数 | 8927 | 6：`snowHintAt`、`snowHintLegend`、`snowHintText`、`snowTempAt`、`snowTypeOf`、（トップレベル） |
| `SNOW_TYPES` | 定数 | 8940 | 3：`drawSnowHint`、`snowHintLegend`、`snowHintText` |
| `snowTypeOf` 📝 | 関数 | 8944 | 1：`snowHintAt` |
| `snowTempAt` 📝 | 関数 | 8948 | 1：`snowHintAt` |
| `snowHintAt` 📝 | 関数 | 8957 | 1：（トップレベル） |
| `snowHintStateNote` | 関数 | 8971 | 1：（トップレベル） |
| `ensureSnowHint` 📝 | 関数 | 8986 | 1：`refreshWeatherPoints` |
| `snowHintText` | 関数 | 8988 | 1：`drawSnowHint` |
| `drawSnowHint` 📝 | 関数 | 9004 | 1：`refreshWeatherPoints` |
| `snowHintLegend` 📝 | 関数 | 9020 | 1：`renderLayerPanel` |

## 雷雨の目安（段階3・#138）→ docs/requirements_snow_thunder_hint.md

行 9030〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `THUNDER_HINT` | 定数 | 9044 | 5：`thunderHintAt`、`thunderHintLegend`、`thunderHintStateNote`、`thunderLevelOf`、（トップレベル） |
| `THUNDER_LEVELS` | 定数 | 9058 | 2：`thunderHintLegend`、`thunderHintText` |
| `thunderLevelOf` 📝 | 関数 | 9067 | 1：`thunderHintAt` |
| `THERMO` | 定数 | 9074 | 2：`moistAscentC`、`showalterIndex` |
| `satVapPressure` | 関数 | 9075 | 1：`moistAscentC` |
| `lclTempK` 📝 | 関数 | 9076 | 1：`showalterIndex` |
| `moistAscentC` 📝 | 関数 | 9078 | 1：`showalterIndex` |
| `showalterIndex` 📝 | 関数 | 9093 | 1：`thunderHintAt` |
| `thunderHintAt` 📝 | 関数 | 9108 | 1：（トップレベル） |
| `thunderHintStateNote` | 関数 | 9123 | 1：（トップレベル） |
| `ensureThunderHint` 📝 | 関数 | 9138 | 1：`refreshWeatherPoints` |
| `thunderHintText` | 関数 | 9140 | 1：`drawThunderHint` |
| `drawThunderHint` 📝 | 関数 | 9156 | 1：`refreshWeatherPoints` |
| `thunderHintLegend` 📝 | 関数 | 9171 | 1：`renderLayerPanel` |

## 風の流れ（Particle Engine）

行 9183〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_FLOW` 📝 | 定数 | 9196 | 10：`WIND_GL`、`buildFlowGrid`、`placeWindFlowCanvas`、`spawnParticle`、`updateWindFlow`、`windBgRGB` ほか4 |
| `windFlow` 📝 | 状態 | 9215 | 18：`MAP_BLEND_KINDS_EXCLUDED`、`MAP_WEATHER`、`WIND_LAYER_IDS`、`applyOverlays`、`buildFlowGrid`、`loadMapPrefs` ほか12 |
| `windFlowCanvas` | 関数 | 9217 | 1：`placeWindFlowCanvas` |
| `placeWindFlowCanvas` | 関数 | 9228 | 1：`updateWindFlow` |
| `windFlowPx` | 関数 | 9241 | 0 |
| `buildFlowGrid` 📝 | 関数 | 9243 | 1：`updateWindFlow` |
| `flowAt` 📝 | 関数 | 9258 | 2：`spawnParticle`、`windFlowFrame` |
| `spawnParticle` | 関数 | 9270 | 2：`updateWindFlow`、`windFlowFrame` |
| `stopWindFlow` 📝 | 関数 | 9283 | 5：`closeMap`、`pauseWindFlow`、`refreshWeatherPoints`、`updateWindFlow`、（トップレベル） |
| `pauseWindFlow` 📝 | 関数 | 9289 | 1：`openMap` |
| `updateWindFlow` 📝 | 関数 | 9291 | 2：`refreshWeatherPoints`、（トップレベル） |
| `windFlowColorIndex` | 関数 | 9303 | 1：`windFlowFrame` |
| `windFlowFrame` 📝 | 関数 | 9307 | 1：`updateWindFlow` |

## 風の流れ（実験・WebGL）— PoC（v4.120.0・ADR-0013）

行 9364〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_GL` 📝 | 定数 | 9386 | 9：`buildGLGrid`、`glWindAt`、`placeGLCanvas`、`windGLFrame`、`windGLParticleCount`、`windGLRender` ほか3 |
| `windGL` 📝 | 状態 | 9405 | 47：`glView`、`glWindAt`、`placeGLCanvas`、`setOverlayOpacity`、`stopWindFlowGL`、`terrainDraw` ほか41 |
| `windPref` 📝 | 状態 | 9423 | 15：`windBgAbsolute`、`windBgAlpha`、`windBgToggleSpeedMinMode`、`windGLInit`、`windGLParticleCount`、`windGLSetBgAlpha` ほか9 |
| `windGLParticleCount` 📝 | 関数 | 9427 | 4：`updateWindFlowGL`、`windFlowSettings`、`windFlowSettingsSync`、`windGLScaleCount` |
| `WIND_GL_SEG_VS` | 定数 | 9438 | 1：`windGLInit` |
| `WIND_GL_SEG_FS` | 定数 | 9463 | 1：`windGLInit` |
| `WIND_GL_QUAD_VS` | 定数 | 9476 | 1：`windGLInit` |
| `WIND_GL_QUAD_FS` | 定数 | 9482 | 1：`windGLInit` |
| `WIND_BG` 📝 | 定数 | 9503 | 5：`windBgAlpha`、`windBgFade`、`windBgMinSpeed`、`windBgRGB`、`windSpeedPos` |
| `WIND_SLIDER` 📝 | 定数 | 9518 | 9：`windBgAlpha`、`windFlowSettings`、`windGLParticleCount`、`windGLSetBgAlpha`、`windGLSetCount`、`windGLSetPAlpha` ほか3 |
| `WIND_COUNT_STEPS` | 定数 | 9521 | 2：`windCountIndex`、`windFlowSettings` |
| `windCountIndex` | 関数 | 9522 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgAlpha` 📝 | 関数 | 9523 | 4：`windFlowSettings`、`windFlowSettingsSync`、`windGLBgTexture`、`windGLHudText` |
| `windBgAbsolute` | 関数 | 9528 | 5：`windBgMinSpeed`、`windBgSpeedLabel`、`windBgToggleSpeedMinMode`、`windFlowSettings`、`windFlowSettingsSync` |
| `windBgMinSpeed` | 関数 | 9529 | 2：`windBgSpeedLabel`、`windGLBgTexture` |
| `windBgSpeedLabel` | 関数 | 9530 | 2：`windFlowSettings`、`windFlowSettingsSync` |
| `windBgToggleSpeedMinMode` | 関数 | 9531 | 1：`windFlowSettings` |
| `windPWidth` | 関数 | 9537 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windPAlpha` | 関数 | 9542 | 3：`windFlowSettings`、`windFlowSettingsSync`、`windGLRender` |
| `windGLSetWidth` | 関数 | 9546 | 1：`windFlowSettings` |
| `windGLSetPAlpha` | 関数 | 9551 | 1：`windFlowSettings` |
| `windGLSetCount` 📝 | 関数 | 9556 | 2：`windFlowSettings`、`windGLScaleCount` |
| `windGLSetBgAlpha` 📝 | 関数 | 9562 | 1：`windFlowSettings` |
| `windSpeedPos` | 関数 | 9569 | 1：`windGLStep` |
| `windBgRGB` 📝 | 関数 | 9576 | 1：`windGLBgTexture` |
| `windBgFade` | 関数 | 9585 | 1：`windGLBgTexture` |
| `windGLBgTexture` 📝 | 関数 | 9591 | 4：`updateWindFlowGL`、`windBgToggleSpeedMinMode`、`windGLSetBgAlpha`、`windGLToggleColor` |
| `WIND_GL_BG_VS` 📝 | 定数 | 9615 | 1：`windGLInit` |
| `WIND_GL_BG_FS` | 定数 | 9625 | 1：`windGLInit` |
| `windGLProgram` | 関数 | 9630 | 1：`windGLInit` |
| `windGLInit` 📝 | 関数 | 9646 | 1：`updateWindFlowGL` |
| `windGLFail` 📝 | 関数 | 9699 | 1：`windGLInit` |
| `windGLFallback` | 関数 | 9706 | 1：`windFlowWanted` |
| `windFlowWanted` 📝 | 関数 | 9707 | 2：`updateWindFlow`、（トップレベル） |
| `buildGLGrid` 📝 | 関数 | 9711 | 1：`updateWindFlowGL` |
| `WIND_TERRAIN` 📝 | 定数 | 9753 | 2：`windDemTile`、`windGLTerrainHeight` |
| `windDem` | 状態 | 9761 | 2：`windDemTile`、`windGLMeasure` |
| `windDemTile` 📝 | 関数 | 9763 | 2：`terrainDemBlock`、`windDemAt` |
| `windDemAt` 📝 | 関数 | 9805 | 2：`terrainProbeCenter`、`windGLTerrainHeight` |
| `windGLTerrainHeight` 📝 | 関数 | 9814 | 1：`updateWindFlowGL` |

## 段階3a：風下の遮蔽（v4.133.0〜・実験・**既定は切**。計測表示の「補正」で入れる）

行 9887〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WIND_SHELTER` 📝 | 定数 | 9905 | 5：`shelterFactor`、`terrainSx`、`windShelterActive`、`windShelterHudText`、`windShelterProbeLines` |
| `WIND_COL` 📝 | 定数 | 9915 | 4：`colBoostFactor`、`windColMinDepth`、`windGLShelter`、`windShelterProbeLines` |
| `WIND_CONV` 📝 | 定数 | 9928 | 2：`windGLShelter`、`windShelterProbeLines` |
| `turnDeg` 📝 | 関数 | 9934 | 1：`windGLShelter` |
| `windColMinDepth` 📝 | 関数 | 9935 | 3：`colBoostFactor`、`windGLShelter`、`windShelterProbeLines` |
| `colBoostFactor` 📝 | 関数 | 9937 | 1：`windGLShelter` |
| `shelterFactor` 📝 | 関数 | 9945 | 1：`windGLShelter` |
| `terrainGridBil` | 関数 | 9952 | 1：`terrainSx` |
| `terrainSx` 📝 | 関数 | 9960 | 1：`windGLShelter` |
| `windShelterGrid` | 関数 | 9975 | 1：`windGLShelter` |
| `windGLShelter` 📝 | 関数 | 9986 | 1：`updateWindFlowGL` |
| `windShelterProbeLines` 📝 | 関数 | 10061 | 2：`terrainProbeCenter`、`windShelterProbe` |
| `windShelterProbe` | 関数 | 10086 | 1：`windGLHud` |

## 段階2：地形の構造の抽出（尾根・沢・鞍部）— 検証用（v4.122.0〜v4.124.0）

行 10092〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `TERRAIN_SCALES` 📝 | 定数 | 10116 | 1：`terrainProbeCenter` |
| `TERRAIN_AN` 📝 | 定数 | 10122 | 3：`terrainAnalyzeScale`、`terrainDraw`、`terrainProbeCenter` |
| `COL` 📝 | 定数 | 10131 | 8：`terrainAn`、`terrainColText`、`terrainCycleShowMin`、`terrainDemGrid`、`terrainFindCols`、`terrainProbeCenter` ほか2 |
| `terrainAn` 📝 | 状態 | 10147 | 19：`stopWindFlowGL`、`terrainClearMarkers`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainDraw`、`terrainDrawBands` ほか13 |
| `demPxM` | 関数 | 10148 | 3：`terrainAnalyzeScale`、`terrainDemGrid`、`terrainProbeCenter` |
| `terrainDemBlock` | 関数 | 10151 | 2：`terrainAnalyzeScale`、`terrainDemGrid` |
| `terrainGauss` | 関数 | 10174 | 1：`terrainAnalyzeScale` |
| `terrainView` | 関数 | 10202 | 4：`terrainAnalyze`、`terrainDraw`、`terrainProbeCenter`、`windShelterGrid` |
| `terrainAnalyzeScale` 📝 | 関数 | 10208 | 1：`terrainProbeCenter` |
| `terrainDemGrid` 📝 | 関数 | 10253 | 2：`terrainAnalyze`、`windShelterGrid` |
| `terrainGridIndex` 📝 | 関数 | 10279 | 1：`terrainProbeCenter` |
| `terrainFindCols` 📝 | 関数 | 10286 | 2：`terrainAnalyze`、`windShelterGrid` |
| `FLOW` 📝 | 定数 | 10385 | 4：`terrainCycleBand`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy` |
| `RIDGE_SRC` 📝 | 定数 | 10400 | 3：`terrainFlow`、`terrainRidgeWhy`、`terrainVectorize` |
| `terrainFlow` 📝 | 関数 | 10401 | 1：`terrainAnalyze` |
| `terrainLinkColsToRidges` 📝 | 関数 | 10600 | 1：`terrainAnalyze` |
| `terrainAnalyze` 📝 | 関数 | 10617 | 1：`terrainRefresh` |
| `terrainCellAt` | 関数 | 10629 | 1：`terrainProbeCenter` |
| `terrainWindAt` | 関数 | 10637 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyCols`、`terrainVerifyRow` |
| `terrainCrossAngle` | 関数 | 10644 | 5：`terrainColText`、`terrainDraw`、`terrainProbeCenter`、`terrainVerifyRow`、`windGLShelter` |
| `bearingOf` | 関数 | 10649 | 7：`geoBearing`、`terrainColText`、`terrainFlow`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` ほか1 |
| `geoDist` | 関数 | 10650 | 2：`terrainNearestCols`、`terrainRidgeWhy` |
| `geoBearing` | 関数 | 10651 | 3：`terrainColText`、`terrainProbeCenter`、`terrainVerifyRow` |
| `DIR8` | 定数 | 10652 | 2：`dir8`、`terrainRidgeWhy` |
| `dir8` | 関数 | 10653 | 4：`terrainColText`、`terrainProbeCenter`、`terrainRidgeWhy`、`terrainVerifyRow` |
| `VEC` | 定数 | 10668 | 4：`smoothPath`、`terrainDrawBands`、`terrainDrawLines`、`terrainVectorize` |
| `thinMask` | 関数 | 10681 | 1：`terrainVectorize` |
| `skeletonEdges` | 関数 | 10710 | 1：`terrainVectorize` |
| `pruneEdges` | 関数 | 10743 | 1：`terrainVectorize` |
| `dpSimplify` | 関数 | 10771 | 1：`smoothPath` |
| `smoothPath` | 関数 | 10789 | 1：`terrainVectorize` |
| `terrainVectorize` | 関数 | 10802 | 1：`terrainAnalyze` |
| `strokeSmooth` | 関数 | 10832 | 1：`terrainDrawLines` |
| `terrainDrawLines` | 関数 | 10842 | 1：`terrainDraw` |
| `BAND_COLORS` | 定数 | 10865 | 1：`terrainDrawBands` |
| `terrainDrawBands` | 関数 | 10866 | 1：`terrainDraw` |
| `terrainDraw` 📝 | 関数 | 10898 | 6：`stopWindFlowGL`、`terrainCycleBand`、`terrainCycleShowMin`、`terrainRefresh`、`terrainToggleBands`、`terrainToggleLines` |
| `terrainClearMarkers` | 関数 | 10945 | 1：`terrainDraw` |
| `terrainColText` 📝 | 関数 | 10949 | 1：`terrainDraw` |
| `terrainNearestCols` | 関数 | 10967 | 2：`terrainProbeCenter`、`terrainVerifyRow` |
| `RIDGE_WHY_R` | 定数 | 10974 | 1：`terrainRidgeWhy` |
| `terrainRidgeWhy` 📝 | 関数 | 10975 | 1：`terrainProbeCenter` |
| `terrainProbeCenter` 📝 | 関数 | 11000 | 1：`windGLHud` |
| `TERRAIN_VERIFY_COLS` 📝 | 定数 | 11050 | 1：`terrainVerifyCols` |
| `VERIFY_ZOOM` | 定数 | 11060 | 1：`terrainVerifyCols` |
| `terrainVerifyRow` | 関数 | 11061 | 1：`terrainVerifyCols` |
| `TERRAIN_VERIFY_HEAD` | 定数 | 11079 | 1：`terrainVerifyCols` |
| `terrainWaitReady` | 関数 | 11081 | 1：`terrainVerifyCols` |
| `terrainVerifyCols` 📝 | 関数 | 11094 | 1：`windGLHud` |
| `terrainKey` | 関数 | 11116 | 3：`terrainRefresh`、`terrainWaitReady`、`windShelterGrid` |
| `terrainRefresh` 📝 | 関数 | 11120 | 4：`terrainToggle`、`terrainVerifyCols`、`terrainWaitReady`、`updateWindFlowGL` |
| `terrainToggle` | 関数 | 11129 | 3：`terrainVerifyCols`、`windGLHud`、`windGLSetHud` |
| `terrainCycleBand` 📝 | 関数 | 11136 | 1：`windGLHud` |
| `terrainToggleBands` | 関数 | 11141 | 1：`windGLHud` |
| `terrainToggleLines` | 関数 | 11142 | 1：`windGLHud` |
| `terrainCycleShowMin` | 関数 | 11143 | 1：`windGLHud` |
| `terrainHudText` | 関数 | 11148 | 1：`windGLHudText` |
| `glGridSample` 📝 | 関数 | 11163 | 5：`glWindAt`、`terrainWindAt`、`windGLShelter`、`windGLSpawn`、`windGLStep` |
| `glWindAt` 📝 | 関数 | 11178 | 1：`windGLStep` |
| `glView` 📝 | 関数 | 11192 | 2：`windGLAlloc`、`windGLFrame` |
| `placeGLCanvas` | 関数 | 11196 | 2：`updateWindFlowGL`、`windGLFrame` |
| `windGLTrailTextures` | 関数 | 11209 | 1：`placeGLCanvas` |
| `windGLZoomAnim` 📝 | 関数 | 11229 | 1：`windGLInit` |
| `windGLAlloc` | 関数 | 11239 | 2：`updateWindFlowGL`、`windGLSetCount` |
| `windGLSpawn` | 関数 | 11248 | 2：`windGLAlloc`、`windGLStep` |
| `windGLStep` 📝 | 関数 | 11262 | 1：`windGLFrame` |
| `windGLRender` 📝 | 関数 | 11289 | 1：`windGLFrame` |
| `windGLFrame` 📝 | 関数 | 11385 | 1：`updateWindFlowGL` |
| `updateWindFlowGL` 📝 | 関数 | 11403 | 5：`refreshWeatherPoints`、`windDemTile`、`windGLToggleShelter`、`windGLToggleTerrain`、（トップレベル） |
| `stopWindFlowGL` 📝 | 関数 | 11443 | 5：`closeMap`、`refreshWeatherPoints`、`updateWindFlowGL`、`windGLFail`、（トップレベル） |
| `windFlowStat` 📝 | 関数 | 11455 | 2：`windFlowFrame`、`windGLFrame` |
| `windFlowStats` | 状態 | 11467 | 3：`windFlowFrame`、`windGLHudText`、`windGLMeasure` |
| `windGLTimerBegin` | 関数 | 11469 | 1：`windGLFrame` |
| `windGLTimerEnd` | 関数 | 11474 | 1：`windGLFrame` |
| `windGLHud` | 関数 | 11484 | 3：`stopWindFlowGL`、`updateWindFlowGL`、`windGLSetHud` |
| `windFlowSettingsSync` 📝 | 関数 | 11512 | 1：`windGLHudText` |
| `windGLHudText` | 関数 | 11541 | 11：`terrainDraw`、`windBgToggleSpeedMinMode`、`windFlowStat`、`windGLHud`、`windGLSetBgAlpha`、`windGLSetCount` ほか5 |
| `windGLTerrainText` 📝 | 関数 | 11572 | 2：`windGLHudText`、`windGLMeasure` |
| `windShelterHudText` | 関数 | 11581 | 1：`windGLHudText` |
| `windGLSetHud` 📝 | 関数 | 11591 | 1：`windFlowSettings` |
| `windGLToggleColor` 📝 | 関数 | 11596 | 1：`windFlowSettings` |
| `windShelterActive` | 関数 | 11604 | 4：`updateWindFlowGL`、`windGLHudText`、`windShelterHudText`、`windShelterProbeLines` |
| `windGLToggleShelter` 📝 | 関数 | 11605 | 1：`windFlowSettings` |
| `windGLToggleTerrain` 📝 | 関数 | 11611 | 1：`windFlowSettings` |
| `windGLHudMin` | 関数 | 11618 | 1：`windGLHud` |
| `windGLScaleCount` | 関数 | 11625 | 1：`windFlowSettings` |
| `windGLMeasure` 📝 | 関数 | 11627 | 1：`windGLHud` |
| `windGLCopy` | 関数 | 11652 | 1：`windGLHud` |
| `AREA_LABEL_MIN_ZOOM` | 定数 | 11667 | 1：`drawAreas` |
| `PEAK_NAME_MIN_ZOOM` | 定数 | 11668 | 1：`drawAreas` |
| `AREA_PAD_KM` | 定数 | 11669 | 1：`areaShape` |
| `AREA_MIN_R_KM` | 定数 | 11670 | 1：`areaShape` |
| `haversineKm` 📝 | 関数 | 11674 | 5：`areaShape`、`isShownMtn`、`loadWxCache`、`mtnSortList`、`renderMtnSection` |
| `areaShape` 📝 | 関数 | 11683 | 1：`drawAreas` |
| `updateMapWhen` 📝 | 関数 | 11695 | 1：`refreshWeatherPoints` |
| `drawAreas` 📝 | 関数 | 11711 | 1：`refreshWeatherPoints` |
| `POI_MIN_ZOOM` | 定数 | 11787 | 1：`drawPoi` |
| `POI_NAME_MIN_ZOOM` | 定数 | 11788 | 1：`drawPoi` |
| `POI_THIN_PX` | 定数 | 11789 | 1：`drawPoi` |
| `POI_MAX_MARKERS` | 定数 | 11790 | 1：`drawPoi` |
| `POI_LS_HIDDEN` | 定数 | 11791 | 2：`poiHiddenSet`、`togglePoiType` |
| `POI_ICONS` | 定数 | 11792 | 4：`drawPoi`、`poiHiddenSet`、`poiTypeChips`、`togglePoiType` |
| `POI_NAMES` | 定数 | 11794 | 1：`poiTypeChips` |
| `loadPoi` | 関数 | 11799 | 1：`drawPoi` |
| `poiAttribution` | 関数 | 11814 | 1：`updateMapAttribution` |
| `poiHiddenSet` | 関数 | 11820 | 3：`drawPoi`、`poiTypeChips`、`togglePoiType` |
| `togglePoiType` | 関数 | 11826 | 1：`poiTypeChips` |
| `poiTypeChips` | 関数 | 11835 | 1：`renderLayerPanel` |
| `drawPoi` | 関数 | 11843 | 1：`refreshWeatherPoints` |
| `refreshWeatherPoints` 📝 | 関数 | 11894 | 16：`applyOverlays`、`drawAmedas`、`drawAreas`、`drawPoi`、`ensureWindField`、`loadTerrainRef` ほか10 |
| `mapTimeLabel` | 関数 | 11932 | 2：`onMapTimeInput`、`updateMapTime` |
| `updateMapTime` 📝 | 関数 | 11940 | 2：`refreshWeatherPoints`、（HTML） |
| `onMapTimeInput` | 関数 | 11957 | 1：（HTML） |
| `setMapTime` 📝 | 関数 | 11962 | 3：`mapTimeNow`、`onMapTimeCommit`、`stepMapTime` |
| `onMapTimeCommit` | 関数 | 11968 | 1：（HTML） |
| `stepMapTime` | 関数 | 11969 | 1：（HTML） |
| `mapTimeNow` | 関数 | 11970 | 1：（HTML） |
| `THUNDER_CELL_PX` | 定数 | 11982 | 1：`paintThunderIcons` |
| `THUNDER_MIN_HITS` | 定数 | 11983 | 1：`paintThunderIcons` |
| `THUNDER_MAX_ICONS` | 定数 | 11984 | 1：`paintThunderIcons` |
| `THUNDER_SCAN_SCALE` | 定数 | 11991 | 1：`paintThunderIcons` |
| `releaseThunderScan` 📝 | 関数 | 11995 | 2：`closeMap`、`paintThunderIcons` |
| `THUNDER_BOLT` | 定数 | 12000 | 1：`paintThunderIcons` |
| `thunderMarkers` | 状態 | 12003 | 2：`clearThunderIcons`、`paintThunderIcons` |
| `clearThunderIcons` 📝 | 関数 | 12006 | 1：`paintThunderIcons` |
| `THUNDER_DEBOUNCE_MS` | 定数 | 12012 | 1：`updateThunderIcons` |
| `updateThunderIcons` 📝 | 関数 | 12013 | 2：`addTimedTileLayer`、`refreshWeatherPoints` |
| `paintThunderIcons` 📝 | 関数 | 12018 | 1：`updateThunderIcons` |
| `GSI_TILE_LIST_URL` | 定数 | 12081 | 1：`updateMapAttribution` |
| `GSI_DEM_CREDIT` | 定数 | 12082 | 1：`updateMapAttribution` |
| `watchAttributionHeight` | 関数 | 12085 | 1：（トップレベル） |
| `updateMapAttribution` 📝 | 関数 | 12098 | 4：`applyBaseLayer`、`applyOverlays`、`drawPoi`、`renderLayerPanel` |
| `setMapBase` 📝 | 関数 | 12132 | 1：`renderLayerPanel` |
| `overlayPane` | 関数 | 12142 | 1：`applyOverlays` |
| `orderNowcastBoxes` | 関数 | 12154 | 1：`applyOverlays` |
| `applyBlendHost` | 関数 | 12161 | 2：`addTimedTileLayer`、`setOverlayBlend` |
| `setOverlayBlend` | 関数 | 12167 | 1：`blendChips` |
| `blendChips` | 関数 | 12176 | 1：`renderLayerPanel` |
| `isOverlayOn` 📝 | 関数 | 12183 | 21：`addTimedTileLayer`、`layerEditRows`、`layerHiddenSummary`、`makeHintEngine`、`paintThunderIcons`、`placeWindFlowCanvas` ほか15 |
| `overlayOpacity` 📝 | 関数 | 12184 | 6：`placeGLCanvas`、`placeWindFlowCanvas`、`refreshWeatherPoints`、`renderLayerPanel`、`setSatBand`、`toggleOverlay` |
| `toggleOverlay` 📝 | 関数 | 12191 | 2：`renderLayerPanel`、`terrainVerifyCols` |
| `setOverlayOpacity` 📝 | 関数 | 12211 | 1：`renderLayerPanel` |
| `moveFavRotaryTo` 📝 | 関数 | 12237 | 2：`openMap`、（HTML） |
| `restoreFavRotary` 📝 | 関数 | 12245 | 1：`closeMap` |
| `openMap` 📝 | 関数 | 12253 | 1：（HTML） |
| `closeMap` 📝 | 関数 | 12338 | 1：（HTML） |
| `setMapDeclutter` 📝 | 関数 | 12357 | 3：`closeMap`、`openMap`、`toggleMapDeclutter` |
| `toggleMapDeclutter` 📝 | 関数 | 12375 | 1：（HTML） |
| `isMapOpen` 📝 | 関数 | 12376 | 22：`ensureWindField`、`fetchGPS`、`hideLoading`、`loadTerrainRef`、`makeHintEngine`、`openMap` ほか16 |
| `toggleLayerPanel` 📝 | 関数 | 12383 | 1：（HTML） |
| `closeLayerPanel` 📝 | 関数 | 12400 | 3：`closeMap`、`toggleLayerPanel`、（HTML） |
| `amedasElementChips` 📝 | 関数 | 12408 | 1：`renderLayerPanel` |
| `satBandChips` 📝 | 関数 | 12415 | 1：`renderLayerPanel` |
| `windModeChips` | 関数 | 12429 | 1：`renderLayerPanel` |
| `windFlowSettings` 📝 | 関数 | 12437 | 1：`renderLayerPanel` |
| `toggleLayerEdit` 📝 | 関数 | 12458 | 1：（HTML） |
| `sectionLayers` | 関数 | 12462 | 3：`layerEditRows`、`moveLayer`、`renderLayerPanel` |
| `isLayerHidden` | 関数 | 12463 | 3：`layerEditRows`、`layerHiddenSummary`、`renderLayerPanel` |
| `moveLayer` 📝 | 関数 | 12465 | 1：`layerEditRows` |
| `toggleLayerHidden` 📝 | 関数 | 12474 | 1：`layerEditRows` |
| `resetLayerOrder` 📝 | 関数 | 12483 | 1：`layerEditRows` |
| `layerEditRows` 📝 | 関数 | 12491 | 1：`renderLayerPanel` |
| `layerHiddenSummary` 📝 | 関数 | 12513 | 1：`renderLayerPanel` |
| `renderLayerPanel` 📝 | 関数 | 12519 | 14：`drawPoi`、`moveLayer`、`openMap`、`resetLayerOrder`、`setAmedasElement`、`setMapBase` ほか8 |

## 標高タイル（国土地理院 dem_png）から選択地点の標高を読む

行 12586〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `DEM_TILE_URL` | 定数 | 12589 | 2：`readDemElevation`、`windDemTile` |
| `DEM_ZOOM` | 定数 | 12590 | 2：`COL`、`readDemElevation` |
| `lonLatToTilePixel` 📝 | 関数 | 12593 | 1：`readDemElevation` |
| `decodeDemPixel` 📝 | 関数 | 12607 | 2：`readDemElevation`、`windDemTile` |
| `demKey` | 関数 | 12615 | 1：`readDemElevation` |
| `readDemElevation` | 関数 | 12621 | 2：`doMapSearch`、`fetchPointElevation` |
| `fetchPointElevation` 📝 | 関数 | 12648 | 3：`fetchGPS`、`fetchWeather`、`pickPinPoint` |
| `displayElevation` 📝 | 関数 | 12657 | 2：`drawAxisGutter`、`drawCloudOverlay` |
| `updateElevationLabel` 📝 | 関数 | 12661 | 1：`fetchPointElevation` |
| `wantsWakeLock` 📝 | 関数 | 12688 | 1：`syncWakeLock` |
| `syncWakeLock` 📝 | 関数 | 12692 | 4：`closeMap`、`toggleWakeLock`、`updateMapToolButtons`、（トップレベル） |
| `toggleWakeLock` 📝 | 関数 | 12713 | 1：（HTML） |
| `paintWakeBadge` 📝 | 関数 | 12719 | 1：`syncWakeLock` |
| `MAP_SCALE_MAX_PX` 📝 | 定数 | 12758 | 1：`updateMapScale` |
| `niceScaleMeters` 📝 | 関数 | 12762 | 1：`updateMapScale` |
| `updateMapScale` 📝 | 関数 | 12769 | 2：`openMap`、`setHeadingUp` |
| `swMessage` 📝 | 関数 | 12794 | 2：`clearTileCache`、`refreshTileCacheUsage` |
| `formatBytes` 📝 | 関数 | 12804 | 1：`refreshTileCacheUsage` |
| `refreshTileCacheUsage` 📝 | 関数 | 12808 | 3：`clearTileCache`、`openMap`、`toggleLayerPanel` |
| `MAP_OPENS_KEEP_DAYS` | 定数 | 12833 | 1：`bumpMapOpens` |
| `MAP_OPENS_WINDOW` | 定数 | 12834 | 1：`summarizeMapOpens` |
| `localDayKey` 📝 | 関数 | 12835 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `dayKeyToUtcMs` | 関数 | 12839 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `normalizeMapOpens` | 関数 | 12843 | 2：`bumpMapOpens`、`summarizeMapOpens` |
| `bumpMapOpens` 📝 | 関数 | 12853 | 1：`recordMapOpen` |
| `summarizeMapOpens` 📝 | 関数 | 12860 | 1：`refreshMapOpensView` |
| `loadMapOpens` | 関数 | 12882 | 2：`recordMapOpen`、`refreshMapOpensView` |
| `recordMapOpen` 📝 | 関数 | 12889 | 1：`openMap` |
| `refreshMapOpensView` 📝 | 関数 | 12896 | 1：`toggleLayerPanel` |
| `clearTileCache` 📝 | 関数 | 12909 | 1：（HTML） |
| `pickMapPoint` 📝 | 関数 | 12918 | 4：`drawAreas`、`pickMtn`、`renderMapResults`、`renderSearchHist` |
| `setPickedName` 📝 | 関数 | 12932 | 7：`fetchGPS`、`hideLoading`、`openMap`、`pickMapPoint`、`pickPinPoint`、`selectFav` ほか1 |
| `mapFlyTo` 📝 | 関数 | 12939 | 5：`fetchGPS`、`goCoordPoint`、`pickMapPoint`、`selectFav`、`setLocateMode` |

## 現在地の追跡と、地図の向き（ノースアップ／ヘディングアップ）

行 12947〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `updatePinVisibility` 📝 | 関数 | 12972 | 5：`openMap`、`releaseFollow`、`setLocateMode`、`startTracking`、`stopTracking` |
| `updateMapToolButtons` 📝 | 関数 | 12979 | 5：`releaseFollow`、`setHeadingUp`、`setLocateMode`、`startTracking`、`stopTracking` |
| `paintCompass` 📝 | 関数 | 13001 | 2：`applyMapRotation`、`updateMapToolButtons` |
| `cycleLocate` 📝 | 関数 | 13018 | 1：（HTML） |
| `setLocateMode` 📝 | 関数 | 13024 | 2：`cycleLocate`、`toggleOrientation` |
| `startTracking` 📝 | 関数 | 13039 | 1：`setLocateMode` |
| `releaseFollow` 📝 | 関数 | 13058 | 3：`pickMapPoint`、`pickPinPoint`、`selectFav` |
| `stopTracking` 📝 | 関数 | 13070 | 3：`closeMap`、`setLocateMode`、`startTracking` |
| `onGeoUpdate` 📝 | 関数 | 13085 | 1：`startTracking` |
| `drawMe` 📝 | 関数 | 13095 | 3：`applyMapRotation`、`onGeoUpdate`、`setHeading` |
| `enableHeading` 📝 | 関数 | 13128 | 1：`toggleOrientation` |
| `screenAngle` | 関数 | 13151 | 2：`applyNotchSide`、`enableHeading` |
| `applyNotchSide` | 関数 | 13161 | 1：（トップレベル） |
| `setHeading` 📝 | 関数 | 13169 | 2：`enableHeading`、`onGeoUpdate` |
| `applyMapRotation` 📝 | 関数 | 13176 | 2：`setHeading`、`setHeadingUp` |
| `toggleOrientation` 📝 | 関数 | 13188 | 1：（HTML） |
| `setHeadingUp` 📝 | 関数 | 13196 | 3：`releaseFollow`、`stopTracking`、`toggleOrientation` |
| `ME_DOT_R` 📝 | 定数 | 13229 | 2：`SPOT_CLEAR_PX`、`SPOT_FADE_PX` |
| `SPOT_CLEAR_PX` | 定数 | 13230 | 1：`paintSpotlightPane` |
| `SPOT_FADE_PX` | 定数 | 13231 | 1：`paintSpotlightPane` |
| `updateMeSpotlight` 📝 | 関数 | 13234 | 3：`onGeoUpdate`、`openMap`、`stopTracking` |
| `SPOT_PANES` | 定数 | 13240 | 1：`paintMeSpotlight` |
| `paintMeSpotlight` 📝 | 関数 | 13241 | 1：`updateMeSpotlight` |
| `paintSpotlightPane` 📝 | 関数 | 13247 | 1：`paintMeSpotlight` |
| `DTAP_MS` 📝 | 定数 | 13289 | 2：`bindDoubleTapZoom`、`flashPinHint` |
| `DTAP_SLOP_PX` 📝 | 定数 | 13290 | 1：`bindDoubleTapZoom` |
| `DTAP_PX_PER_ZOOM` 📝 | 定数 | 13291 | 1：`bindDoubleTapZoom` |
| `zoomAnchor` 📝 | 関数 | 13297 | 1：`bindDoubleTapZoom` |
| `bindDoubleTapZoom` 📝 | 関数 | 13302 | 1：`openMap` |
| `PIN_HOLD_MS` 📝 | 定数 | 13376 | 2：`bindPinLongPress`、`showPinHold` |
| `PIN_HOLD_SLOP_PX` 📝 | 定数 | 13377 | 1：`bindPinLongPress` |
| `showPinHold` 📝 | 関数 | 13382 | 1：`bindPinLongPress` |
| `hidePinHold` 📝 | 関数 | 13394 | 2：`bindPinLongPress`、`cancelPinHold` |
| `cancelPinHold` 📝 | 関数 | 13398 | 2：`bindPinLongPress`、`closeMap` |
| `flashPinHint` 📝 | 関数 | 13406 | 1：`bindPinLongPress` |
| `MAP_HINT_MS` 📝 | 定数 | 13423 | 1：`showMapHint` |
| `showMapHint` 📝 | 関数 | 13424 | 1：`openMap` |
| `pickPinPoint` 📝 | 関数 | 13438 | 2：`bindPinLongPress`、`goCoordPoint` |
| `bindPinLongPress` 📝 | 関数 | 13456 | 1：`openMap` |
| `patchRotatedInput` 📝 | 関数 | 13508 | 1：`openMap` |
| `NAME_VARIANT_GROUPS` | 定数 | 13529 | 2：`nameSearchVariants`、`normalizeSearchName` |
| `SEARCH_VARIANT_MAX` | 定数 | 13533 | 1：`nameSearchVariants` |
| `nameSearchVariants` | 関数 | 13537 | 1：`doMapSearch` |
| `KANJI_VARIANT_PAIRS` | 定数 | 13556 | 2：`mtnKey`、`normalizeSearchName` |
| `normalizeSearchName` | 関数 | 13559 | 5：`doMapSearch`、`findHyakumeizan`、`isShownMtn`、`renderSearchHist`、`sameHistPlace` |
| `HYAKU_MATCH_KM` | 定数 | 13572 | 1：`findHyakumeizan` |
| `findHyakumeizan` | 関数 | 13573 | 1：`renderMapResults` |
| `gsiPlaceSearch` | 関数 | 13599 | 1：`doMapSearch` |
| `mapSearchItems` | 状態 | 13616 | 3：`doMapSearch`、`renderMapResults`、`renderSearchHist` |
| `setMapSearchSort` | 関数 | 13619 | 1：`renderMapResults` |
| `renderMapResults` | 関数 | 13625 | 2：`doMapSearch`、`setMapSearchSort` |
| `SEARCH_TIMEOUT_MS` 📝 | 定数 | 13686 | 1：`fetchJsonWithTimeout` |
| `fetchJsonWithTimeout` 📝 | 関数 | 13687 | 2：`doMapSearch`、`gsiPlaceSearch` |
| `doMapSearch` 📝 | 関数 | 13704 | 2：（HTML）、（トップレベル） |
| `COORD_GO_ZOOM` | 定数 | 13827 | 1：`goCoordPoint` |
| `COORD_OUT_MSG` | 定数 | 13828 | 1：`doMapSearch` |
| `goCoordPoint` 📝 | 関数 | 13829 | 3：`coordGoRow`、`doMapSearch`、`renderSearchHist` |
| `coordGoRow` 📝 | 関数 | 13836 | 1：`renderSearchHist` |

## 検索の履歴（選んだ地点）

行 13856〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `SEARCH_HIST_KEY` | 定数 | 13864 | 2：`loadSearchHist`、`saveSearchHist` |
| `SEARCH_HIST_MAX` | 定数 | 13865 | 1：`addSearchHist` |
| `loadSearchHist` | 関数 | 13867 | 3：`addSearchHist`、`removeSearchHist`、`renderSearchHist` |
| `saveSearchHist` | 関数 | 13874 | 3：`addSearchHist`、`mtnClearButton`、`removeSearchHist` |
| `sameHistPlace` | 関数 | 13878 | 1：`addSearchHist` |
| `addSearchHist` 📝 | 関数 | 13882 | 3：`goCoordPoint`、`renderMapResults`、`renderSearchHist` |
| `removeSearchHist` | 関数 | 13892 | 1：`renderSearchHist` |
| `renderSearchHist` 📝 | 関数 | 13901 | 3：`mtnClearButton`、`renderMtnSection`、（トップレベル） |

## 手元の山の検索（#171・第1段階）

行 13984〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `MTN_SEARCH` 📝 | 定数 | 13992 | 7：`addMtnHist`、`mtnHistBoost`、`mtnMatchKey`、`mtnTagChip`、`mtnTierBoost`、`mtnTopTier` ほか1 |
| `MTN_HIST_KEY` | 定数 | 14002 | 2：`loadMtnHist`、`saveMtnHist` |
| `MTN_KA_GROUP` | 定数 | 14010 | 1：`mtnKey` |
| `mtnKey` 📝 | 関数 | 14011 | 2：`buildPeakIndex`、`mtnSearch` |
| `editDistance` | 関数 | 14021 | 1：`mtnMatchKey` |
| `mtnMatchKey` | 関数 | 14036 | 1：`mtnMatchScore` |
| `mtnMatchScore` | 関数 | 14051 | 1：`mtnSearch` |
| `mtnTopTier` | 関数 | 14058 | 3：`mtnTagChip`、`mtnTierBoost`、`renderMtnSection` |
| `mtnTierBoost` | 関数 | 14062 | 1：`mtnSearch` |
| `mtnHistBoost` | 関数 | 14068 | 1：`mtnSearch` |
| `mtnRoleInfo` | 関数 | 14079 | 1：`buildPeakIndex` |
| `buildPeakIndex` 📝 | 関数 | 14098 | 1：`ensureMtnIndex` |
| `loadPeakMeta` | 関数 | 14126 | 1：`ensureMtnIndex` |
| `ensureMtnIndex` | 関数 | 14133 | 2：`doMapSearch`、`renderSearchHist` |
| `mtnById` | 関数 | 14143 | 1：`renderMtnSection` |
| `loadMtnHist` | 関数 | 14148 | 4：`addMtnHist`、`mtnSearch`、`removeMtnHist`、`renderMtnSection` |
| `saveMtnHist` | 関数 | 14155 | 3：`addMtnHist`、`mtnClearButton`、`removeMtnHist` |
| `addMtnHist` 📝 | 関数 | 14158 | 1：`pickMtn` |
| `removeMtnHist` | 関数 | 14166 | 1：`renderMtnSection` |
| `mtnDistOrigin` | 関数 | 14172 | 1：`renderMtnSection` |
| `mtnSearch` 📝 | 関数 | 14181 | 1：`renderMtnSection` |
| `mtnNameCmp` | 関数 | 14196 | 2：`mtnSortList`、`renderMtnSection` |
| `mtnSortList` | 関数 | 14201 | 1：`renderMtnSection` |
| `mtnDisplayName` | 関数 | 14212 | 1：`mtnRowEl` |
| `pickMtn` 📝 | 関数 | 14218 | 1：`mtnRowEl` |
| `mtnTagChip` | 関数 | 14228 | 1：`mtnRowEl` |
| `mtnRowEl` | 関数 | 14245 | 1：`renderMtnSection` |
| `mtnHead` | 関数 | 14281 | 1：`renderMtnSection` |
| `mtnClearButton` | 関数 | 14291 | 2：`renderMtnSection`、`renderSearchHist` |
| `mtnShown` | 状態 | 14307 | 2：`isShownMtn`、`renderMtnSection` |
| `renderMtnSection` 📝 | 関数 | 14308 | 2：`doMapSearch`、`renderSearchHist` |
| `MTN_DUP_KM` | 定数 | 14384 | 1：`isShownMtn` |
| `isShownMtn` | 関数 | 14385 | 1：`doMapSearch` |

## 座標の表記（DD・DMS・DDM・度分秒）— v4.109.0

行 14394〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `coordParts` | 関数 | 14399 | 3：`fmtDDM`、`fmtDMS`、`fmtJpDMS` |
| `fmtDMS` | 関数 | 14404 | 1：`coordFormats` |
| `fmtDDM` | 関数 | 14409 | 1：`coordFormats` |
| `fmtJpDMS` | 関数 | 14413 | 1：`coordFormats` |
| `UTM_BANDS` | 定数 | 14424 | 2：`toUTM`、`utmBandRange` |
| `utmZone` | 関数 | 14425 | 1：`toUTM` |
| `toUTM` 📝 | 関数 | 14437 | 2：`coordFormats`、`parseUtmMgrs` |
| `fmtUTM` | 関数 | 14458 | 1：`coordFormats` |
| `fmtMGRS` | 関数 | 14461 | 1：`coordFormats` |
| `fromUTM` 📝 | 関数 | 14475 | 2：`utmCellInBand`、`utmResult` |
| `coordFormats` | 関数 | 14496 | 1：`openCoordSheet` |

## 座標の入力を読む（v4.158.0・findings-09 の B・第1段）

行 14532〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `COORD_JP` | 定数 | 14542 | 1：`coordInJapan` |
| `COORD_NUM` | 定数 | 14545 | 2：`COORD_COMP_POST`、`COORD_COMP_PRE` |
| `COORD_LABEL` | 定数 | 14548 | 3：`COORD_COMP_POST`、`COORD_COMP_PRE`、`parseCoordInput` |
| `COORD_COMP_PRE` | 定数 | 14549 | 1：`parseCoordWith` |
| `COORD_COMP_POST` | 定数 | 14550 | 1：`parseCoordWith` |
| `COORD_SEP` | 定数 | 14551 | 1：`parseCoordWith` |
| `coordInJapan` | 関数 | 14552 | 2：`parseCoordWith`、`utmResult` |
| `parseCoordComp` | 関数 | 14555 | 1：`parseCoordWith` |
| `UTM_IN` | 定数 | 14581 | 1：`parseUtmMgrs` |
| `MGRS_IN` | 定数 | 14582 | 1：`parseUtmMgrs` |
| `MGRS_ROWS` | 定数 | 14583 | 1：`parseUtmMgrs` |
| `utmBandRange` | 関数 | 14584 | 2：`parseUtmMgrs`、`utmCellInBand` |
| `utmCellInBand` 📝 | 関数 | 14589 | 1：`utmResult` |
| `utmResult` | 関数 | 14594 | 1：`parseUtmMgrs` |
| `parseUtmMgrs` 📝 | 関数 | 14601 | 1：`parseCoordInput` |
| `parseCoordInput` 📝 | 関数 | 14625 | 2：`doMapSearch`、`renderSearchHist` |
| `parseCoordWith` | 関数 | 14637 | 1：`parseCoordInput` |
| `copyText` | 関数 | 14671 | 1：`openCoordSheet` |
| `flashCopied` | 関数 | 14684 | 1：`openCoordSheet` |
| `openCoordSheet` | 関数 | 14692 | 2：`renderFavList`、`renderSearchHist` |
| `closeCoordSheet` | 関数 | 14734 | 1：（HTML） |

## FAVORITES

行 14746〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `loadFavs` 📝 | 関数 | 14749 | 8：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`sortedFavs` ほか2 |
| `saveFavs` 📝 | 関数 | 14753 | 6：`assignSpot`、`migrateSpotsOutOfFavs`、`renderFavList`、`returnToFavs`、`saveCurrentAsFav`、`toggleFavStar` |
| `toggleFavSpots` | 関数 | 14763 | 1：（HTML） |
| `openFav` 📝 | 関数 | 14767 | 1：（HTML） |
| `closeFav` 📝 | 関数 | 14772 | 2：`renderFavList`、（HTML） |
| `renderFavList` 📝 | 関数 | 14776 | 3：`openFav`、`saveCurrentAsFav`、`toggleFavSpots` |
| `saveCurrentAsFav` 📝 | 関数 | 14925 | 1：（HTML） |

## RANKING（全国山域ランキング）

行 14936〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `RANK_WINDOW_START` 📝 | 定数 | 14942 | 1：`rankHourWindow` |
| `RANK_WINDOW_END` | 定数 | 14943 | 1：`rankHourWindow` |
| `RANK_MAX_AHEAD` | 定数 | 14944 | 1：`openRank` |
| `rankFetchCache` | 状態 | 14947 | 1：`fetchRankData` |
| `rankDates` | 状態 | 14948 | 4：`openRank`、`refreshRanking`、`setRankDate`、`updateMapWhen` |
| `loadAreas` 📝 | 関数 | 14951 | 6：`buildRanking`、`doMapSearch`、`drawAreas`、`ensureMtnIndex`、`fetchRankData`、`fillReliability` |
| `fmtDateISO` | 関数 | 14960 | 7：`fillReliability`、`judgePeakDay`、`openRank`、`rankHourWindow`、`refreshRanking`、`resolveRankDates` ほか1 |
| `resolveRankDates` 📝 | 関数 | 14965 | 2：`openRank`、`setRankDate` |
| `fetchRankData` 📝 | 関数 | 14990 | 1：`buildRanking` |
| `rankHourWindow` 📝 | 関数 | 15033 | 3：`judgePeakDay`、`refreshRanking`、`updateMapWhen` |
| `judgePeakDay` 📝 | 関数 | 15042 | 1：`buildRanking` |
| `buildRanking` 📝 | 関数 | 15065 | 1：`refreshRanking` |
| `rankGradeChar` | 関数 | 15103 | 2：`refreshRanking`、`renderRankList` |
| `rankDowChar` | 関数 | 15104 | 2：`renderRankList`、`updateMapWhen` |
| `bestPeakOf` 📝 | 関数 | 15109 | 1：`renderRankList` |
| `renderRankList` 📝 | 関数 | 15119 | 1：`refreshRanking` |
| `gotoPeak` 📝 | 関数 | 15203 | 2：`renderRankList`、`renderSnowList` |
| `refreshRanking` 📝 | 関数 | 15212 | 2：`openRank`、`setRankDate` |
| `setRankDate` 📝 | 関数 | 15247 | 1：（HTML） |
| `openRank` 📝 | 関数 | 15257 | 1：（HTML） |
| `closeRank` 📝 | 関数 | 15269 | 2：`gotoPeak`、（HTML） |

## 新雪ランキング（直近24hの新雪＋今夜〜明朝12hの予想降雪）

行 15273〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `setRankTab` 📝 | 関数 | 15284 | 1：（HTML） |
| `setWindMode` | 関数 | 15293 | 1：`windModeChips` |
| `setAmedasElement` 📝 | 関数 | 15300 | 1：`amedasElementChips` |
| `setSatBand` 📝 | 関数 | 15308 | 1：`satBandChips` |
| `setSnowFilter` 📝 | 関数 | 15316 | 1：（HTML） |
| `loadSnowSpots` 📝 | 関数 | 15324 | 1：`refreshSnowRanking` |
| `refreshSnowRanking` 📝 | 関数 | 15333 | 1：`setRankTab` |
| `renderSnowList` 📝 | 関数 | 15362 | 2：`refreshSnowRanking`、`setSnowFilter` |
| `degToDir` 📝 | 関数 | 15420 | 1：`renderSnowList` |

## LOCALSTORAGE – 最終地点

行 15427〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `saveLast` 📝 | 関数 | 15430 | 1：`applyWeatherJson` |
| `loadLast` 📝 | 関数 | 15433 | 1：（トップレベル） |

## LOADING OVERLAY

行 15438〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `showLoading` 📝 | 関数 | 15441 | 3：`fetchGPS`、`fetchWeather`、（トップレベル） |
| `hideLoading` 📝 | 関数 | 15447 | 4：`fetchGPS`、`fetchWeather`、`render`、（トップレベル） |

## 天気図（気象庁の速報天気図・予想天気図）

行 15492〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `WXMAP_LIST_URL` | 定数 | 15508 | 1：`loadWxMapList` |
| `WXMAP_PNG_BASE` | 定数 | 15509 | 1：`renderWxMap` |
| `isWxMapOpen` | 関数 | 15519 | 1：`renderWxMap` |
| `openWxMap` | 関数 | 15524 | 1：（HTML） |
| `closeWxMap` | 関数 | 15528 | 1：（HTML） |
| `setWxMapWhen` | 関数 | 15531 | 1：（HTML） |
| `setWxMapArea` | 関数 | 15537 | 1：（HTML） |
| `loadWxMapList` | 関数 | 15545 | 1：`renderWxMap` |
| `wxMapParseName` | 関数 | 15561 | 1：`wxMapPick` |
| `wxMapJst` | 関数 | 15571 | 1：`renderWxMap` |
| `wxMapPick` | 関数 | 15580 | 1：`renderWxMap` |
| `toggleWxMapZoom` | 関数 | 15595 | 2：`renderWxMap`、（HTML） |
| `renderWxMap` | 関数 | 15605 | 3：`openWxMap`、`setWxMapArea`、`setWxMapWhen` |

## AI全国概況（outlook.json を読むだけ。失敗・未生成時は非表示）

行 15634〜

| 名前 | 種類 | 行 | 参照元 |
|---|---|---|---|
| `toggleOutlook` 📝 | 関数 | 15637 | 1：（HTML） |
| `loadOutlook` 📝 | 関数 | 15640 | 1：（トップレベル） |
| `escapeHtml` 📝 | 関数 | 15661 | 10：`drawAmedas`、`drawAreas`、`drawPoi`、`layerEditRows`、`loadOutlook`、`poiTypeChips` ほか4 |
| `BOOT_GEO_WAIT_MS` 📝 | 定数 | 15671 | 1：（トップレベル） |

