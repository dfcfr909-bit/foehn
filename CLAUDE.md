# SotoKi

バックカントリー気象PWA（単一HTML / GitHub Pages / Open-Meteo JMAモデル / Leaflet）

> **新しいセッションを始めたら、まず `docs/handoff.md` を読むこと。**
> 現状・未完事項・過去の失敗（風速の単位取り違え等）がまとまっている。

## 規約

- 命名: camelCase（JS）、コメント日本語
- 破壊的変更は実行前に要確認
- 段階ごとにcommit分割、各段階完了時に動作確認を求めること
- ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）は変更禁止（移植のみ）

## 構成

- `sotoki_v4.html` — 現行版（改修ベース）
- `docs/handoff.md` — **引き継ぎメモ（現状・未完事項・経緯）**
- `docs/requirements_renewal.md` — 全面改修 要件定義書
- `docs/ai_outlook.md` — AI全国概況（GLM × GitHub Actions）
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
視認性再設計／地図）は**実施済み**。以降の変更履歴と現行仕様は `docs/handoff.md` を参照。

## 技術スタック

- 単一HTML構成（バンドラなし）
- uPlot 1.6.32 は `vendor/` に同梱（CDNは403等で失敗した実績があるため）。Leaflet 1.9.x はCDN
- デプロイ: GitHub Pages（静的ファイル直接配信。Netlifyは無料枠停止のため移行済み）
- データ: Open-Meteo Forecast API（JMAモデル）
  - **風速は `wind_speed_unit=ms` を必ず指定**（既定はkm/h。過去に取り違えて不具合を出した）
  - 突風・気圧面ごとの雲量はJMAが返さないため、models未指定の補助リクエストで取得
