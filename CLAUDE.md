# SotoKi

バックカントリー気象PWA（単一HTML / Netlify / Open-Meteo JMAモデル / Leaflet）

## 規約

- 命名: camelCase（JS）、コメント日本語
- 破壊的変更は実行前に要確認
- 段階ごとにcommit分割、各段階完了時に動作確認を求めること
- ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）は変更禁止（移植のみ）

## 構成

- `sotoki_v4.html` — 現行版（改修ベース）
- `docs/requirements_renewal.md` — 全面改修 要件定義書

## 改修計画

`docs/requirements_renewal.md` に従い、以下の順で実装する:

1. uPlot移行 + スクロール性能改善（コア）
2. 過去48h統合 + 現在時刻線
3. 昼夜シェーディング
4. テーマ自動追従 + 視認性再設計
5. 地図: 雨雲タイル → 格子点マーカー

## 技術スタック

- 単一HTML構成（バンドラなし）
- 外部ライブラリはCDN読み込み: Leaflet 1.9.x, uPlot 1.6.x
- デプロイ: Netlify（静的ファイル直接配信）
- データ: Open-Meteo Forecast API（JMAモデル）
