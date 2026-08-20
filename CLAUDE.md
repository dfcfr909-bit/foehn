# ナギナビ

バックカントリー気象PWA（単一HTML / GitHub Pages / Open-Meteo JMAモデル / Leaflet）

> **新しいセッションを始めたら、まず `docs/status.md` を読むこと。**
> 現状・進行中・未完事項・次の一手がまとまっている。

## プロジェクトの取り違え（これを最初に確かめる）

**このセッションは Foehn–フェーン–（アウトドア特化天気予報 / アプリ名はナギナビ）専用。**
リポジトリは `dfcfr909-bit/foehn`。

- **応答の1行目に `[Foehn]` を単独行で出す。** 例外なし（雑談・短い返事・エラー報告でも）
  - ⚠ これは**守りではなく、人が気づくための印**。取り違えているときは
    タグも自信満々に間違って出る。**機械の照合は `.claude/hooks/session-start.sh`** が行う
    （リモートURLを期待値と突き合わせ、不一致なら叫ぶ）
- **下の別プロジェクトの語が出てきたら、着手せず確認する。** 返すのは2つだけ——
  ①どのプロジェクトの指示だと判断したか ②その根拠（ファイル名・機能名・用語）。
  **「このセッションで正しい」と明示されるまで実装しない**
- **迷ったときも着手しない。** 誤って別プロジェクトを改修するより、止まる方がよい

### 別プロジェクトの識別語

| プロジェクト | 識別語 |
|---|---|
| **インシデント解決君** | KYT / KYT分析用紙 / インシデント / 手術室 / 院内 / `hospital-safety` |
| **Ethicる！** | 倫理 / 倫理事例 / 事例検討 |
| **blog記事下書き君** | BlogAutoPost / ブログ / 記事下書き / 投稿 |
| **青** | 青空文庫 / リーダー / 縦書き / ルビ |

⚠ **この表は近いところを踏むたびに足す。** 一度でも取り違えかけた語は必ず書き加えること。
⚠ 院内まわりは特に危ない。**実際に施設名を書いて公開してしまい、リポジトリを作り直した**
（→ `docs/adr/0009-repo-rebuild.md`）。このリポジトリは public。

## 禁止・地雷（違反すると壊れる）

- **ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）は変更禁止**（移植のみ）。
  調整が要るときは `THRESH` の閾値だけを触る → `docs/adr/0005-wind-unit-ms.md`
- **Open-Meteo は `wind_speed_unit=ms` を必ず指定**（既定はkm/h。表示3.6倍・判定3.6倍厳格化の
  事故を出し、閾値を緩める対症療法まで踏んだ） → `docs/adr/0005-wind-unit-ms.md`
- **天気記号を `destination-out` で抜かない**（下の白い座布団ごと消える）
  → `docs/adr/0004-vector-glyph.md`
- **このリポジトリは public。** GitHub Pages で配信しており、置いたものは誰でも見られる。
  院内情報・施設名・部署名・個人名・業務上の非公開情報を書かない。
  一度コミットすると履歴に残り、**あとから消すにはリポジトリの作り直しが要る**
  （実際に様式の出典として施設名を書いてしまい、公開状態になった）
  ⚠ **`git push --force` では消えない。** GitHub が PR ごとに作る `refs/pull/*` は
  こちらから削除も書き換えもできず、Pull Request のページに残り続ける。
  実際にこれで `SotoKi` を捨てて `foehn` を作り直した → `docs/adr/0009-repo-rebuild.md`
- **院内資料（KYT分析用紙・手術室インフォグラフィック）をこのリポジトリに戻さない。**
  別リポジトリ `hospital-safety`（private）へ移した → `docs/adr/0007-split-hospital-safety.md`
- **不可逆な操作は実行前に必ず確認する。** 目安は「戻せるか」——
  push とマージは `git revert` で戻せるので、線引き（下記）に従えば確認は要らない。
  戻せないのは次のもので、これらは**必ず確認**する。
  - **公開**（public なので、一度出たものは消えない。`git push --force` でも
    `refs/pull/*` は消せない → ADR-0009）
  - **ファイルの削除・上書き**、履歴の書き換え（force push・rebase 済みの押し直し）
  - **外部への送信**（新しい送信先が増えるもの）

## 規約

- 命名: camelCase（JS）、コメント日本語
- 段階ごとにcommit分割、各段階完了時に動作確認を求めること
- コミットは日本語＋prefix（`feat:` / `fix:` / `docs:` / `refactor:` / `chore:` / `test:`）。
  リリースは `main` マージ後に `git tag v4.xx.0` → **詳細は `docs/workflow.md`**
- **マージ: CIが緑なら確認なしでよい。** ただし ABC評価・`areas.json` の座標/標高・
  `sw.js`/`manifest`/`icons`・外部の情報源・公開範囲に触れるものは**必ず確認**
  → `docs/workflow.md`「マージ（確認なしでよい範囲）」

## 構成

- `sotoki_v4.html` — 現行版（改修ベース）。7,000行超あるので
  **本体を読む前にまず `docs/spec/code_map.md`（関数索引）を見る**
- `docs/spec/` — **現行仕様**（`overview` / `chart` / `ui` / `map` / `data` / `judge` / `pwa`
  ＋ `code_map.md`）。「いまどうなっているか」はここ
- `docs/status.md` — **現状・進行中・未完事項・次セッションの最初のプロンプト（毎回読む）**
- `docs/adr/` — **設計判断の記録（ADR）。「なぜそうなっているか」と却下した案はここ**（不変。覆すときは新ADR）
- `docs/decisions.md` — 軽い判断・調整値・実装上の落とし穴の1行ログ（追記のみ）
- `docs/archive/handoff_v4.md` — 旧・引き継ぎメモの原本。**仕様の詳細と過去の経緯はここ**（更新しない）
- `docs/project_structure_proposal.md` — ドキュメント構成の移行計画（段階6まで実施済み。移行は完了）
- `docs/requirements_renewal.md` — 全面改修 要件定義書
- `docs/ai_outlook.md` — AI全国概況（GLM × GitHub Actions）
- `snowRanking.js` / `data/spots.*` / `scripts/buildSpots.mjs` — 新雪ランキング。
  仕様は `docs/snow_ranking.md`。**ABC評価とは独立**（`judgePoint`等を参照しない）
- `docs/map-selector-requirements.md` — 地図選択画面（レイヤー・標高タイル・タイルキャッシュ）
- `docs/install.md` — PWAインストール手順・アイコン再生成
- `manifest.webmanifest` / `sw.js` / `icons/` — PWA一式（アイコン原図は `icons/icon.svg`）
- `tests/` — スモークテスト（改修のたびに全件実行する）
- `.claude/` — スラッシュコマンド（`/test` `/status` `/spec` `/release`）・permissions・起動時のブランチ鮮度フック
- `scripts/gen-outlook.mjs` — AI全国概況の生成スクリプト
- `scripts/gen-icons.mjs` — アイコンPNGの書き出しスクリプト
- `scripts/checkPeaks.mjs` / `scripts/snapPeaks.mjs` / `scripts/searchPeaks.mjs` —
  `areas.json` の座標の検査・山頂への吸着・地名検索との突き合わせ。
  手元から地理院に到達できないので **GitHub Actions「山頂座標の検査」から手動実行する**
  （`mode` は `check` / `snap` / `search`）。
  **標高で「山頂かどうか」、名前で「どの山か」**を見る分担 → `docs/decisions.md` 2026-08-14

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
