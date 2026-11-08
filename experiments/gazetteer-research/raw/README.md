# raw/：取得した生データの抜粋

すべて 2026-10-07 に取得。取得の手順は `../findings-01.md`、使ったクエリは `../queries/`。

| ファイル | 中身 | 出典・ライセンス |
|---|---|---|
| `osm_jp_peak_tag_counts.json` | Overpass の応答そのまま（日本の `natural=peak` の件数と、読みのタグごとの件数） | © OpenStreetMap contributors, ODbL |
| `osm_jp_peaks_head40.tsv` | 日本の peak・volcano 一覧（全 17,671行）の先頭40行 | 同上 |
| `osm_target_peaks.tsv` | 指定の峰の周囲（±0.012°）の peak・volcano 節点 | 同上 |
| `wikidata_wd_*.json` | SPARQL の応答（件数・クラス内訳・指定の峰） | Wikidata, CC0 |
| `gsi_vt_labels_311_312.tsv` | 地理院ベクトルタイル（`experimental_bvmap`）の注記 311・312 を5山域で復号した一覧 | 国土地理院ベクトルタイル提供実験を加工して作成 |
| `gsi_vt_attr_compare_nasu_z15.txt` | 那須岳付近のタイル1枚の属性（旧形式と現行形式の比較） | 同上 |
| `npm_coord_libs.tsv` | UTM・MGRS ライブラリの npm 登録情報 | registry.npmjs.org |
| `npm_coord_libs_filesize.tsv` | 配布物の単体ファイルの大きさ（実行はしていない） | 実測 |
| `utm_zone_japan_points.tsv` | 日本の端点・指定の峰の UTM ゾーンと緯度帯（計算） | 座標は地理院の住所検索 API の応答 |

置いていないもの:

- **地理院の住所検索 API の生の応答**：利用条件（保存・再配信）が確認できなかったため（→ `../findings-05.md`）。必要な行だけ本文に引いた
- **1003山のファイル**：取得できなかった（→ `../findings-02.md`）
- **他社の画面写真・マニュアル本文**：挙動の確認に使っただけ。本文の引用は必要な文だけ
