# ナギナビ

バックカントリー気象PWA（単一HTML / GitHub Pages / Open-Meteo JMAモデル / Leaflet）

> **新しいセッションを始めたら、まず `docs/status.md` を読むこと。**
> 現状・進行中・未完事項・次の一手がまとまっている。

## 禁止・地雷（違反すると壊れる）

- **ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）は変更禁止**（移植のみ）。
  調整が要るときは `THRESH` の閾値だけを触る → `docs/adr/0005-wind-unit-ms.md`
- **Open-Meteo は `wind_speed_unit=ms` を必ず指定**（既定はkm/h。表示3.6倍・判定3.6倍厳格化の
  事故を出し、閾値を緩める対症療法まで踏んだ） → `docs/adr/0005-wind-unit-ms.md`
- **天気記号を `destination-out` で抜かない**（下の白い座布団ごと消える）
  → `docs/adr/0004-vector-glyph.md`
- **秘密は `wrangler secret` で登録。`wrangler.toml` に書かない** → `docs/kyt_worker.md`
- **破壊的変更は実行前に要確認**

## 規約

- 命名: camelCase（JS）、コメント日本語
- 段階ごとにcommit分割、各段階完了時に動作確認を求めること

## 構成

- `sotoki_v4.html` — 現行版（改修ベース）
- `docs/status.md` — **現状・進行中・未完事項・次セッションの最初のプロンプト（毎回読む）**
- `docs/adr/` — **設計判断の記録（ADR）。「なぜそうなっているか」と却下した案はここ**（不変。覆すときは新ADR）
- `docs/decisions.md` — 軽い判断・調整値・実装上の落とし穴の1行ログ（追記のみ）
- `docs/archive/handoff_v4.md` — 旧・引き継ぎメモの原本。**仕様の詳細と過去の経緯はここ**（更新しない）
- `docs/project_structure_proposal.md` — ドキュメント構成の移行計画（段階2まで実施済み）
- `docs/requirements_renewal.md` — 全面改修 要件定義書
- `docs/ai_outlook.md` — AI全国概況（GLM × GitHub Actions）
- `snowRanking.js` / `data/spots.*` / `scripts/buildSpots.mjs` — 新雪ランキング。
  仕様は `docs/snow_ranking.md`。**ABC評価とは独立**（`judgePoint`等を参照しない）
- `docs/map-selector-requirements.md` — 地図選択画面（レイヤー・標高タイル・タイルキャッシュ）
- `docs/install.md` — PWAインストール手順・アイコン再生成
- `kyt_form.html` — インシデントレポートKYT分析用紙（A4印刷用）。**気象アプリとは独立した別物**
- `docs/kyt_form.md` — 上記の様式仕様・寸法定数・次段階（生成API連携）の差し込み口
- `docs/kyt_generate.md` — 下書き生成の契約（サーバ関数とのやり取り・プロンプト）
- `worker/` — 下書き生成のCloudflare Worker。手順は `docs/kyt_worker.md`
  （**秘密はwrangler secretで登録。wrangler.tomlに書かない**）
- `manifest.webmanifest` / `sw.js` / `icons/` — PWA一式（アイコン原図は `icons/icon.svg`）
- `tests/` — スモークテスト（改修のたびに全件実行する）
- `scripts/gen-outlook.mjs` — AI全国概況の生成スクリプト
- `scripts/gen-icons.mjs` — アイコンPNGの書き出しスクリプト

## 改修計画

`docs/requirements_renewal.md` の1〜5（uPlot移行／過去統合／昼夜シェーディング／
視認性再設計／地図）は**実施済み**。現状と未完事項は `docs/status.md`、
現行仕様と変更の経緯は `docs/archive/handoff_v4.md` を参照。

## 技術スタック

- 単一HTML構成（バンドラなし） → `docs/adr/0001-single-html.md`
- uPlot 1.6.32 は `vendor/` に同梱（CDNは403等で失敗した実績があるため）。Leaflet 1.9.x はCDN
  → `docs/adr/0002-uplot.md`
- デプロイ: GitHub Pages（静的ファイル直接配信。Netlifyは無料枠停止のため移行済み）
  → `docs/adr/0003-github-pages.md`
- データ: Open-Meteo Forecast API（JMAモデル）
  - **風速は `wind_speed_unit=ms` を必ず指定**（既定はkm/h。過去に取り違えて不具合を出した）
  - 突風・気圧面ごとの雲量はJMAが返さないため、models未指定の補助リクエストで取得

## コマンド

- テスト: `cd tests && npm install`（初回のみ）→ `node tests/run-all.js`
- アイコン: `node scripts/gen-icons.mjs`

## 詳しくは

- **現状・進行中・未完** → `docs/status.md`（毎回読む）
- **設計判断の理由** → `docs/adr/`（構造的な判断と却下した案） / `docs/decisions.md`（軽い判断・地雷）
- **仕様の詳細と過去の経緯** → `docs/archive/handoff_v4.md`（旧・引き継ぎメモの原本。更新しない）
