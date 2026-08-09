# ナギナビ（リポジトリ名 SotoKi）

バックカントリー（山スキー・雪山）へ行く前と行った先で、山の天気を読むための気象PWA。
メテオグラム（気温・風・降水・雲・気圧を1枚に重ねた時系列図）と、地形・衛星・レーダーを
重ねられる地図、山域ごとの新雪ランキングを、ひとつの画面にまとめている。
予報は Open-Meteo の気象庁（JMA）モデル。インストール不要で、ブラウザだけで動く。

**公開URL: <https://dfcfr909-bit.github.io/SotoKi/>**

---

## 使い方

上のURLをブラウザで開くだけ。地点を選ぶと、実績72時間＋予報168時間のメテオグラムが出る。
下部の帯を左右になぞると時刻が動き、地図・数値・判定がその時刻に合わせて切り替わる。

スマホのホーム画面（PCならデスクトップ）に追加すると、アドレスバーの無い全画面で起動し、
一度開いたデータはオフラインでも残る。手順は **[docs/install.md](docs/install.md)** を参照。

---

## 開発者向け

バンドラもビルド工程も無い。`sotoki_v4.html` の単一ファイルがアプリ本体で、
依存（uPlot）は `vendor/` に同梱してある。

### ローカルで動かす

`file://` で直接開くと Service Worker と `fetch` が動かないので、静的サーバが要る。

```bash
python3 -m http.server 8000
# → http://localhost:8000/            （index.html が本体へリダイレクト）
# → http://localhost:8000/sotoki_v4.html
```

`npx serve` など他の静的サーバでもよい。なお PWA のインストールは HTTPS が必須なので、
インストールの挙動を試すときは公開URLを使う。

### テスト

ヘッドレスChromiumで実際にアプリを読み込み、通信をスタブして検証するスモークテスト（16件）。
**改修のたびに全件を回す。**

```bash
cd tests && npm install   # 初回のみ
node tests/run-all.js     # リポジトリ直下から
```

各テストが何を見ているかは **[tests/README.md](tests/README.md)** にある。

### デプロイ

`main` にマージすると GitHub Pages がそのまま配信する。ビルドも公開作業も無い。
経緯は **[docs/adr/0003-github-pages.md](docs/adr/0003-github-pages.md)**。

---

## ドキュメント

| | |
|---|---|
| [docs/status.md](docs/status.md) | 現状・進行中・未完事項。**まずこれ** |
| [docs/spec/](docs/spec/) | 現行仕様。**[code_map.md](docs/spec/code_map.md) が本体の関数索引** |
| [docs/workflow.md](docs/workflow.md) | 開発の進め方（Issue・ラベル・コミットprefix・タグ・ブランチ） |
| [docs/adr/](docs/adr/) | 設計判断の記録。「なぜそうなっているか」と却下した案 |
| [docs/decisions.md](docs/decisions.md) | 軽い判断・調整値・実装上の落とし穴の1行ログ |
| [docs/install.md](docs/install.md) | PWAインストール手順・アイコン再生成 |
| [docs/snow_ranking.md](docs/snow_ranking.md) | 新雪ランキングの仕様（ABC評価とは独立） |
| [docs/map-selector-requirements.md](docs/map-selector-requirements.md) | 地図の選択画面・レイヤー・タイルキャッシュ |
| [docs/ai_outlook.md](docs/ai_outlook.md) | AI全国概況の生成（GitHub Actions） |
| [docs/requirements_renewal.md](docs/requirements_renewal.md) | 全面改修の要件定義（実施済み・凍結） |
| [docs/archive/handoff_v4.md](docs/archive/handoff_v4.md) | 仕様の詳細と過去の経緯（原本・更新しない） |
| [CLAUDE.md](CLAUDE.md) | AI（Claude Code）向けの規約と禁止事項 |

`kyt_form.html` と `docs/kyt_*.md` は**インシデントレポートのKYT分析用紙**で、
気象アプリとは独立した別プロジェクト。同じリポジトリに同居しているだけ。

---

## 免責

**このアプリの予報・評価はあくまで目安であり、気象判断と行動の責任はすべて利用者にある。**

- 予報値は Open-Meteo 経由の気象庁（JMA）数値予報モデルによるもので、実際の山の天気とは
  ずれる。特に稜線・沢筋のような地形の影響が大きい場所では、モデル格子の値は実況と大きく
  食い違うことがある。
- ABC評価は複数の気象要素を機械的に点数化した**行動の目安**にすぎない。「A」は安全を意味せず、
  **雪崩の危険度は一切評価していない**。
- 新雪ランキングは積雪深の実測ではなく、降水量・気温からの**推定値**である。
- 雪崩・気象遭難を含むあらゆる事故について、作者は責任を負わない。現地の観測、雪崩情報、
  自分の目と経験にもとづいて判断すること。

## 出典

- 予報データ: [Open-Meteo](https://open-meteo.com/)（気象庁 JMA モデル）
- 実況・衛星・レーダー・アメダス: [気象庁](https://www.jma.go.jp/)
- 地図タイル（地形図・標高・陰影起伏・空中写真）: [国土地理院](https://maps.gsi.go.jp/development/ichiran.html)
- 地図タイル: [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
- 衛星画像タイル: Esri, Maxar, Earthstar Geographics

**アプリ画面に出ている出典表記は各提供元の利用条件なので、消さないこと。**

## ライセンス

**検討中**（`LICENSE` ファイルは未設置）。
ライセンスが明示されるまでは著作権法上の全権利を留保するため、
複製・改変・再配布はできない。
