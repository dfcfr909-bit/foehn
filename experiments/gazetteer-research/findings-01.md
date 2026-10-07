# 地名・山名検索の調査 01：到達確認・方法・要約

調査日: 2026-10-07（調査のみ。UI・既存コード・依存は変更していない）

## ファイル一覧

| ファイル | 中身 |
|---|---|
| `findings-01.md` | 到達確認・調べ方・全体の要約・未確認の一覧（このファイル） |
| `findings-02.md` | 項目1 国土地理院「日本の主な山岳標高（1003山）」 |
| `findings-03.md` | 項目2 読み付きの山名データ（国土数値情報・地理院の注記・OSM・Wikidata の実測） |
| `findings-04.md` | 項目3 ライセンスの境界（ODbL・地理院・国土数値情報・測量法） |
| `findings-05.md` | 項目4 国土地理院の住所検索API |
| `findings-06.md` | 項目5 山群（那須岳・高原山・八甲田山）の事実確認 |
| `findings-07.md` | 項目6 座標入力（UTM・MGRS） |
| `findings-08.md` | 項目7 検索窓の挙動（スーパー地形・地理院地図・YAMAP・ヤマレコ）＋ Föhn の検索データに要る項目 |
| `findings-09.md` | 次フェーズ（データモデル確定）の前に人間が判断すべき点 |
| `raw/` | 取得した生データの抜粋（出典つき） |
| `queries/` | Overpass・SPARQL のクエリ |
| `scripts/` | 抽出に使った小さなスクリプト（`python -I` で、データとは別の場所から実行した） |

## 到達確認（2026-10-07、このセッションの環境から）

| ホスト | 結果 | 備考 |
|---|---|---|
| `www.gsi.go.jp` | **✕ 到達できない** | TLS 接続でエラー（`unsafe legacy renegotiation disabled`）。回避の設定は権限で止められたため、**このホストの情報はすべて「未確認」** |
| `maps.gsi.go.jp` | ○ | ヘルプ・利用規約・PDF マニュアル・開発者向けページを取得 |
| `cyberjapandata.gsi.go.jp` | ○ | ベクトルタイル（pbf）を取得 |
| `nlftp.mlit.go.jp` | ○ | 国土数値情報の一覧・利用規約・観光資源の仕様 |
| `msearch.gsi.go.jp` | △ | ルート `/` は 403。API `/address-search/AddressSearch` は 200 |
| `www.openstreetmap.org` | ○ | 著作権ページと API 0.6（`/api/0.6/map`） |
| `overpass-api.de` | △ | HTTPS は接続リセット。**HTTP は 503・504 が続き、数分おきの再試行で2回だけ通った**（集計と一覧を取得） |
| `wiki.osmfoundation.org` | △ | 301 で `osmfoundation.org` へ転送され、**転送先が ✕**（下記） |
| `opendatacommons.org` | ○ | ODbL 1.0 本文 |
| `www.wikidata.org` / `query.wikidata.org` | ○ | ライセンスページ・SPARQL |
| `www.kashmir3d.com` | ○ | スーパー地形の公式マニュアル・紹介ページ |
| `help.yamap.com` | **✕** | Cloudflare の確認画面（403）。回避はしていない |
| `www.yamareco.com` | ○ | 使い方ガイド |

調査中に新たに拒否されたホスト（プロキシの CONNECT が 403）:
`osmfoundation.org`・`wiki.openstreetmap.org`・`taginfo.openstreetmap.org`・`taginfo.geofabrik.de`・
`api.openstreetmap.org`・`nominatim.openstreetmap.org`・`github.com`（Web 画面）・`api.github.com`・
`www.data.jma.go.jp`・`gbank.gsj.jp`・`laws.e-gov.go.jp`・`elaws.e-gov.go.jp`・`www.env.go.jp`・
`fgd.gsi.go.jp`・`service.gsi.go.jp`・`www.registries.digital.go.jp`・`catalog.registries.digital.go.jp`。
`overpass.kumi.systems`・`maps.mail.ru` は接続できなかった。
GitHub の公開リポジトリは `git clone` だけ通った（地理院の `gsi-cyberjapan/gsimaps-vector-experiment`・`vector-tile-experiment`）。

## 調べ方

- 規約・仕様は、取得できたページの本文だけを根拠にした。取得できなかったページの URL は根拠として付けていない
- 実測は、Overpass（全国の集計）・OSM API 0.6（峰の周りの狭い範囲）・Wikidata SPARQL・
  地理院ベクトルタイル（pbf を復号）・地理院の住所検索 API で行った
- ダウンロードしたものは作業用の別ディレクトリに置き、スクリプトは別の場所から `python -I` で実行した。
  npm の配布物は**展開して大きさを測っただけで、コードは実行していない**
- 画像（他社の画面写真）は**挙動の確認のために見ただけ**で、このリポジトリには置いていない
- 地理院の住所検索 API の応答は、利用条件が確認できなかったため（→ `findings-05.md`）**生の応答は置かず**、
  本文に必要な行だけ引いた

## 要約（詳細と根拠は各ファイル）

1. **1003山のデータは確認できなかった**（配信元が `www.gsi.go.jp`）。列構成・件数・ライセンスはすべて未確認
2. **読み付きの山名は、地理院のベクトルタイル（旧形式 `experimental_bvmap`）の注記に入っている。**
   5つの山域で山名の注記 112件を数え、**読みの欠けは 0件**。しかも注記の種別が
   **311＝山の総称（那須岳・八甲田山・燧ヶ岳・高原山）／312＝個々の山（茶臼岳・大岳・俎嵓・柴安嵓…）**
   に分かれていた（種別コードの正式な定義は未確認）。⚠ 現行形式の `optimal_bvmap-v1` には**読みが無い**。
   地理院の告知（2017-08-04、利用者が端末で開いた画面で確認）にも「居住地名と自然地名には、地名の『よみ』の情報も含まれています」
   「ベクトルタイル提供実験として公開」とある
3. OSM の日本の `natural=peak` は 17,484件。名前つき 13,894件のうち `name:ja-Hira` は **3,110件（22.4%）**。
   Wikidata の日本の山 6,477件のうち、仮名の名前（P1814）は **407件（6.3%）**。どちらも読みの主な情報源にはならない
4. ODbL は「検索の結果などから作った著作物（Produced Work）」と「派生データベース」を分けている。
   **OSM の読みを自作の JSON に混ぜて配信すると、その JSON は派生データベースに当たる**と読める（ODbL 本文 §1・§4.4 b）。
   照合だけに使って成果物に入れない場合の扱いは、OSMF のガイドラインが取得できず**未確認**
5. 地理院の住所検索 API は、**API 単体の利用規約が見つからなかった。**
   地理院地図の利用規約は `maps.gsi.go.jp` ドメインのサービスが対象で、`msearch.gsi.go.jp` を名指ししていない
6. 那須岳・高原山・八甲田山は、地理院の注記でも Wikidata でも OSM でも「総称」として別扱いされている。
   **地理院の地名検索で「那須岳」を引くと、茶臼岳の山頂から 12m の点が返る**（総称の名前が茶臼岳の位置に置かれている）
7. 日本は **UTM 51〜56帯・緯度帯 Q〜T** に収まる。⚠ 「52S」の S は**緯度帯**で、南半球ではない（スーパー地形のマニュアルが明記）
8. スーパー地形の検索窓は、**地名・山名・住所・緯度経度・度分秒・UTM・MGRS・地図名・読み**を1つの欄で受け、
   結果は**名前・読み・種類・県名・標高・緯度・経度**で並べ替えられる（公式マニュアル）。
   **入力中に候補が出るか（インクリメンタル）は、マニュアルに記述が無く未確認**

## 未確認の一覧

| 項目 | 理由 |
|---|---|
| 1003山の列構成・件数・更新日・文字コード・改行・ライセンス・各山の入り方 | `www.gsi.go.jp` に到達できない |
| 国土地理院コンテンツ利用規約の本文（出典・加工の表示の条件） | 同上（`kikakuchousei40182.html`） |
| 地理院ベクトルタイルの注記種別コード（311・312・810…）の正式な定義 | 定義表が見つからなかった（実データの傾向からの推定のみ） |
| 基盤地図情報の注記（読みの有無） | `fgd.gsi.go.jp`・`service.gsi.go.jp` に到達できない |
| OSMF のガイドライン（Produced Work・Substantial・Collective Database） | `osmfoundation.org` に到達できない |
| 測量法の条文 | `laws.e-gov.go.jp` に到達できない |
| 住所検索 API の利用条件・保存・再配信 | 規約が見つからない。地理院の FAQ（GitHub の Issues）は Web 画面に到達できない |
| 気象庁・産総研による山群の構成（一次情報） | `www.data.jma.go.jp`・`gbank.gsj.jp` に到達できない |
| YAMAP の検索の挙動 | `help.yamap.com` が確認画面で本文を返さない |
| スーパー地形の入力中の候補・同名の山の見せ方・検索の履歴・オフライン時の検索 | マニュアルに記述が無い |
| アドレス・ベース・レジストリ（デジタル庁）の住所データ | 到達できない |

## 前提の食い違い（1点）

依頼文の背景に「Netlify静的配信」とあるが、このリポジトリは **GitHub Pages で配信している**
（`CLAUDE.md`・`docs/adr/0003-github-pages.md`・`docs/adr/0008-remove-netlify.md` で Netlify は撤去済み）。
今回の調査結果には影響しない（どちらも静的配信で、配信するファイルの扱いは同じ）。
