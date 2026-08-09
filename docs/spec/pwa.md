# PWA（manifest / sw.js / タイルキャッシュ）

デスクトップ／ホーム画面にインストールできる。
**インストール手順とアイコンの再生成は `docs/install.md`。**

## `manifest.webmanifest`

| キー | 値 |
|---|---|
| `name` / `short_name` | `NAGI NAV` |
| `start_url` / `scope` | `./`（**相対**。GitHub Pages のサブパス配信でも動く） |
| `display` | `standalone` |
| `orientation` | `portrait` |
| `background_color` | `#f5f4f0` |
| `theme_color` | `#ffffff` |
| `icons` | 192 / 512（`purpose: any`）＋ maskable 512 |

`start_url` と `scope` を相対にしてあるのは、GitHub Pages のサブパスでも
Netlify プレビューでもそのまま動かすため → `docs/adr/0003-github-pages.md`

## アイコン

- **原図は `icons/icon.svg`**
- PNG は `node scripts/gen-icons.mjs` で書き出して**コミットする**
  （ImageMagick 等が無い環境なので、同梱の Chromium で描画している）

## `sw.js` — キャッシュ方針

配信物の種類ごとに方針を分けてある。

| 対象 | 方針 |
|---|---|
| HTML（ナビゲーション） | **ネットワーク優先。** 取れたら必ずそれを表示し、同時にキャッシュを更新。通信できないときだけキャッシュへフォールバック |
| 同梱の静的ファイル | キャッシュ優先＋裏で更新（stale-while-revalidate） |
| 地図タイル | **別キャッシュ**に cache-first で保存（訪問済みのみ・LRU で上限管理） |
| 気象API・地名検索・`outlook.json` | **一切キャッシュしない** |

HTML をネットワーク優先にしてあるので、「更新したのに古い画面のまま」は起きない。

### バージョン

`CACHE_VERSION`（現在 `sotoki-v2`）。**本体を大きく変えたら上げる。**
`activate` で `CACHE_NAME` と `TILE_CACHE` 以外のキャッシュを消す。

⚠ **タイルキャッシュはアプリシェルと寿命が別。`activate` の掃除で巻き添えにしない**
（バージョンを上げたときにユーザーの地図が消えると圏外で困る）。

### プリキャッシュ（`PRECACHE`）

起動に必要な同梱ファイルだけ。**CDN（Leaflet）は入れない**（落ちても本体が動くため）。

```
./  ./index.html  ./sotoki_v4.html  ./manifest.webmanifest
./areas.json  ./snowRanking.js  ./data/spots.json
./vendor/uPlot.iife.min.js  ./vendor/uPlot.min.css
./icons/icon-192.png  ./icons/icon-512.png
```

**1つでも失敗すると全部落ちる**ので、`cache.addAll` ではなく個別に `cache.add` して
失敗を握りつぶす。

## 地図タイルのキャッシュ

訪問済みのタイルだけを `sotoki-tiles-v1` に cache-first で保存する。
**事前ダウンロードはしない。** 仕様は `docs/map-selector-requirements.md` §7。

| 定数 | 値 |
|---|---|
| `TILE_CACHE` | `sotoki-tiles-v1` |
| `TILE_CACHE_LIMIT_BYTES` | 150MB |
| `TILE_TOUCH_INTERVAL_MS` | 1時間（LRU の更新をこの間隔に間引く） |

- cache-first。ヒットしたら即返し、裏での更新もしない（地形図は変わらないため）
- 上限を超えたら最終アクセスが古い順に **90%** まで削る
- 最終アクセス時刻と合計サイズは **IndexedDB**（`sotoki-tiles` / store `tiles` `meta`）で持つ
- **サイズの分からない opaque レスポンスは保存しない**（LRU の合計が壊れるため）

### 対象ホスト（`TILE_HOSTS`）

```
cyberjapandata.gsi.go.jp    国土地理院
tile.openstreetmap.org      OSM
server.arcgisonline.com     Esri
map.ecoris.info             CS立体図
```

**ここに無いホストは一切触らない。**

⚠ **気象レイヤー（気象庁のナウキャスト・ひまわり）は `TILE_HOSTS` に足さない。**
時間で中身が変わるため。

### 使用量の表示と削除

本アプリに設定画面が無いので、**レイヤーパネルの最下段**に置いてある。
本体側は `swMessage(payload)` で SW とやり取りし、
`refreshTileCacheUsage()` が件数・容量・上限を取り、`clearTileCache()` が消す。
表示の整形は `formatBytes(n)`。

## 関連

- インストール手順・アイコン再生成 → `docs/install.md`
- タイルキャッシュの要件 → `docs/map-selector-requirements.md` §7
- 地図画面 → `map.md`
- GitHub Pages 配信 → `docs/adr/0003-github-pages.md`
