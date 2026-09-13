# データの取得と加工

Open-Meteo（気象データ）と気象庁（タイル・時刻表・アメダス）から取る。
関数の在り処は `code_map.md`。

## Open-Meteo（本体）

`fetchWeather(lat, lon)` が1本のリクエストで取る。モデルは **`jma_seamless`**。

```
https://api.open-meteo.com/v1/forecast
  ?latitude={lat}&longitude={lon}
  &hourly=temperature_2m,apparent_temperature,precipitation,snowfall,
          surface_pressure,windspeed_10m,winddirection_10m,windgusts_10m,
          weathercode,cloudcover,cloud_cover_low,cloud_cover_mid,cloud_cover_high
  &daily=sunrise,sunset
  &timezone=Asia%2FTokyo
  &wind_speed_unit=ms
  &past_days=3&forecast_days=9
  &models=jma_seamless
```

⚠ **`wind_speed_unit=ms` を必ず指定する。** Open-Meteo の既定は km/h。
→ `docs/adr/0005-wind-unit-ms.md`

⚠ **気圧面の風（`wind_speed_{hPa}hPa` / `wind_direction_{hPa}hPa`）も本体で取る。**
`WIND_LEVELS` の6層（925/900/850/800/700/600）。ABC評価は地上10m風ではなく
**山頂高度の気圧面風**で行う → `judge.md` / `docs/adr/0006-summit-wind.md`

`jma_seamless` は気圧面の風を返す（models未指定の値と完全一致することを実測で確認）。
**補助リクエストに逃がさない**理由は3つ——モデルが混ざらない／通信が増えない／
**判定が後から覆らない**（補助は非同期なので、先に A を出してから C に化ける）。

標高（地理院DEM）は**判定の入力**なので、気象データと `Promise.all` で一緒に待つ。

- `past_days=3` で過去3日ぶん（解析値）、`forecast_days=9` で先に余裕を持たせる
- 応答は `processData(json)` が整形して `state.fullData` に入る。
  **末尾の null は切り落とす**ので、モデルが返さない先まで指定しても表示は壊れない
- `dpress`（6時間の気圧変化量）は全期間の文脈で `processData` が算出する
- 表示範囲の切り出しは `applyRange()`（`PAST_HOURS`=72 ＋ 現在 ＋ `FORECAST_HOURS`=168）
- 現在時刻の index は `indexOfNow(data)`、時刻キーは `isoHour(t)`
- 標高は `json.elevation` を `state.elevation` に持つ（モデル格子の標高。API 用）

## Open-Meteo（補助リクエスト）

`fetchSupplemental(lat, lon)` が **models 未指定（best_match）** で別に取る。
`models=jma_seamless` では返らない変数があるため。

- 取るもの: **突風**と**気圧面ごとの雲量**
- 気圧面は `CLOUD_LEVELS` の**14層**
  （1000/975/950/925/900/850/800/700/600/500/400/300/250/200 hPa）。
  975 と 925 を足してあるのは、地上〜1,000m の分解能を稼ぐため
- **未対応なら低・中・高の3層合成にフォールバックする**
- `state.elevation` を渡して地形条件を揃える
- **失敗しても本体に影響させない**

結果は `state.cloudProfiles`（時刻→`[[高度m, 雲量%], …]`）に入り、
`cloudProfileAt(d)` が読み出す → 描画は `chart.md`

## 予報期間

`forecast_days` の上限は16だが、実際に値が返る長さはモデル依存。
`jma_seamless` は GSM の予報期間まで。末尾の null は `processData` が切り落とす。

## 圏外の控え（オフラインキャッシュ）

山では圏外がふつう。`sw.js` は気象APIを**意図的にキャッシュしない**方針なので
（→ `pwa.md`）、圏外で開くと画面は立ち上がるのにデータが空だった。そこをアプリ側で埋める。

**できること／できないこと**

- できる … 開いている間に取れたものを控え、次に開いたとき圏外でも出す
- **できない … アプリを閉じた状態での定期取得。** iOS は Background Sync /
  Periodic Background Sync / Background Fetch のいずれも未対応で、
  バックグラウンドに回すとページと Service Worker の JS ごと止まる。
  Android の Periodic Background Sync も**最短12時間**で、10分間隔は元から無い
- ⚠ そもそも1回の取得で `past_days=3` / `forecast_days=9` ぶん手元に来る。
  足りないのは「新しい予報」ではなく「**取ったものを保持していないこと**」だった

**置き場所と中身**

| | |
|---|---|
| 保存先 | IndexedDB `sotoki-wx` / オブジェクトストア `points` |
| キー | `緯度,経度`（**小数3桁に丸める**。GPSの揺れで件数が増えないように） |
| 中身 | `{ key, lat, lon, name, at, json, dem, sup, supAt }` |
| 上限 | 40件。超えたら取得が古い順に消す |
| 期限 | **24時間**（`WX_MAX_AGE_MS`）。これより古いものは使わない |
| 流用 | 完全一致が無ければ **20km 以内**の最寄り（`WX_NEAR_KM`） |

⚠ **控えるのはAPI応答そのもの**で、整形後（`fullData`）ではない。
復元も通信時と同じ `processData` を通す（`applyWeatherJson` に一本化）。
整形後を控えると、判定の直し忘れが片側にだけ残る。

⚠ **`WX_NEAR_KM` を0にはできない。** GPSは毎回わずかに違う座標を返すので、
現在地は完全一致しない。そのかわり**離れている距離を必ず画面に出す**。

⚠ **`wxUpdate` は1つのトランザクションの中で読んで書き戻す。**
IndexedDBのトランザクションは `await` で閉じるため、素直に書くと読みと書きが
別トランザクションに分かれる。本体の保存と補助データの後付けが同時に走ると、
補助のほうが保存前の古い `at` を書き戻し、直後の整理で期限切れとして消えた
（`smoke_offline` で踏んだ）。補助データの取得は本体を控えてから始める。

**画面（`#offline-note`）**

ヘッダー直下の帯。`setWxSource(info)` が出し分ける。

| 状態 | 見た目 | 文言 |
|---|---|---|
| 通信で取れた | 出さない | — |
| 控えを出している（24時間以内） | 橙 | `📴 保存データを表示中　9/13 05:20取得（3時間前）／地点名（2.1km先）` |
| 控えが古すぎる（24時間超） | 赤 | `⚠ 通信できません。…古すぎるため、画面の数字は更新していません` |

⚠⚠ **この帯が、黙って古い数字を出さないための唯一の歯止め。**
判定の色は出ているのに中身は半日前、というのがこの仕組みで最悪の見え方で、
ADR-0011（`elevation` の意味が変わり判定が黙って甘くなった件）と同じ形になる。
**通信で取れたときは必ず消すこと。** 出しっぱなしにすると印の意味が薄れる。

⚠ 帯は**描画の予約より先に出す**。あとから出すとチャートの下端が隠れる。

検査は `tests/smoke_offline.mjs`。

## GPS・逆ジオコーディング

- `fetchGPS(opts)` … `navigator.geolocation` の薄い包み
- `reverseGeocode(lat, lon)` … 緯度経度→地点名
- 地点名の表示は `updateLocationName()`、同一地点の判定は `sameLoc(a, b)`
- 最後に見た地点は localStorage（`saveLast` / `loadLast`）

## 気象庁のタイルと時刻表

### 時刻表（`targetTimes`）

**古い順に並んだ配列**。種別ごとに別ファイル。

| 種別 | ファイル | 定数 |
|---|---|---|
| 降水ナウキャスト | `targetTimes_N1.json` | `JMA_TIMES_PRECIP` |
| 雷・竜巻ナウキャスト | `targetTimes_N2.json` | `JMA_TIMES_THUNDER` |
| ひまわり | `targetTimes_jp.json` | `JMA_TIMES_SAT` |

ベースURLは `JMA_NOWCAST_BASE` / `JMA_SAT_BASE`。

| 関数 | 役割 |
|---|---|
| `jmaTimesList(url)` | 時刻表を**絞らずに全部**返す（実況＋予報） |
| `latestObsTime(list)` | **一番新しい実況**を選ぶ |
| `jmaTimes(url)` | 地図に貼る用。`latestObsTime` から実況だけを取り出す薄い包み |
| `nowcastSeries(list)` | 「実況→予報」の並びに直す（雨の予告用） |
| `parseJmaTime(s)` | 気象庁の時刻文字列を Date に |
| `timedTileUrl(def, t)` | 定義と時刻からタイルURLを組む |
| `clearWxTimes()` | 時刻表のキャッシュを捨てる（自動更新のたびに呼ぶ） |

⚠ **`jmaTimes` と `nowcastSeries` は同じ時刻表を見るので、必ず `latestObsTime` に寄せる。**

### タイル取得の失敗報告（`watchTileStatus`）

**「全部ダメ」だけでなく「ほとんどダメ」も言う。**

| 定数 | 値 | 意味 |
|---|---|---|
| `WX_FAIL_MIN_TILES` | 6 | これだけ届くまでは判定しない（起動直後に騒がない） |
| `WX_FAIL_RATIO` | 0.4 | 4割以上落ちたら「一部しか出ていません（N%）」と言う |
| `WX_FAIL_SETTLE_MS` | 1500 | タイルは非同期に届くので落ち着いてから数える |

- 端の欠けで騒がないよう、**枚数が溜まってから割合で**判定する
- 全部届いているときは何も出さない
- **`watchTileStatus()` は全部のタイルレイヤーに付ける。** 新しいタイルレイヤーを
  足したら必ず通す
- 表示は `setLayerStatus(id, text)`

## 雨の予告（`updateRainOutlook`）

地図画面に1行だけ出す。**2段構え。上の段が出せなければ下の段のまま。**

### 1. 毎時データの見込み（`rainOutlookHourly(data, fromIdx)`）

`state.allData` の `precip` だけを見る純関数。追加の通信ゼロなので**必ず出せる**。

| 定数 | 値 |
|---|---|
| `RAIN_MM` | 0.1（これ以上を「降っている」とみなす mm/h） |
| `RAIN_LOOK_H` | 48（何時間先まで探すか） |

- そこから先の**最初の変わり目**を探す
- 言い回しは気象庁の時間帯（`JMA_BANDS`＝未明/明け方/朝/昼前/昼過ぎ/夕方/夜のはじめ頃/夜遅く）
  ＋今日/明日/明後日（`timeBandWord` / `dayWord`）。それより先は `M/D`
- **雨と雪を言い分ける**（`snow > 0`）

### 2. ナウキャストの1画素読み（`rainOutlookNowcast(lat, lon)`）

| 定数 | 値 |
|---|---|
| `NOWC_TILE_Z` | 10（降水ナウキャストのネイティブ最大ズーム） |
| `NOWC_ALPHA_MIN` | 30（これ以上の不透明度を「降っている」とみなす） |
| `NOWC_MAX_STEPS` | 13（実況＋60分先） |
| `NOWC_STEP_MIN` | 5（刻み。分） |

- `targetTimes_N1.json` は**実況だけでなく予報も入っている**（basetime が同じで
  validtime が5分ずつ進む）。`nowcastSeries()` が「実況→予報」の並びに直す
- 地点の緯度経度を `tilePixelAt(lat, lon, z)` でタイル番号＋タイル内画素に直し、
  タイルを1枚ずつ読む（`loadTileImage` / `probeTileAlpha`）
- **色→mm/h の対応は推測しない。** 「塗ってあるか否か」だけで判断する
- 最初の変わり目を5分刻みに丸めて「あと35分で雨が止みます」を出す。
  出せたら1段目を上書きし、`.nowcast` クラスで出所の違いを見せる（`setRainText`）

⚠ **気をつけること**

- **1画素しか読まない。** 1×1 の canvas に負のオフセットで描いて目当ての画素を (0,0) に落とす
- **CORS が通らない環境では黙って1段目に戻す。** `rainOutlookNowcast` は null を返し、
  毎時の見込みがそのまま残る
- **地図を閉じている間は取りに行かない**（`updateRainOutlook()` の先頭で `isMapOpen()` を見る）

## アメダス

`loadAmedas()` が気象庁の bosai から実測を取る。ブラウザから直に叩く。

- 最新時刻は `latest_time.txt`
- 出す要素は `AMEDAS_ELEMENTS` から選ぶ → `map.md`
- 新雪ランキングも同じアメダスを使う（`snowRanking.js`）→ `docs/snow_ranking.md`

## 関連

- 描画側 → `chart.md`
- タイルレイヤーの貼り替え → `map.md`
- タイルのキャッシュ → `pwa.md`
- 風速単位の経緯 → `docs/adr/0005-wind-unit-ms.md`
