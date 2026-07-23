# AI全国概況（outlook.json）

気圧配置と全国主要都市の予報から、**週末・明日・明後日**の天気概況を GLM(Z.ai) で自動生成し、
静的な `outlook.json` としてGitHub Pagesで配信する仕組み。アプリ（`sotoki_v4.html`）はそれを読むだけ。

## 構成

- `scripts/gen-outlook.mjs` — Open-Meteo取得 → 気圧配置の手がかり算出 → GLM呼び出し（OpenAI互換API） → `outlook.json` 出力
- `.github/workflows/outlook.yml` — 1日2回（JST 06:00 / 18:00）＋手動実行。差分があればcommit
- `outlook.json` — 生成物（初期はプレースホルダで `sections: []`）
- `sotoki_v4.html` — 「🧭 AI全国概況」カード。`sections` が空 or 取得失敗なら非表示（非破壊）

## 位置づけ（重要）

LLMは物理予測をしない。**与えたデータ（気圧配置の手がかり＋全国都市の日別予報）だけを根拠**に概況文を書く
grounding方式。カードは常に「参考」表示＋気象庁への注記を出す。数値グラフ・ABC判定が一次情報。

## セットアップ（手動・1回だけ）

1. **GLM(Z.ai) APIキーをSecretに登録**
   リポジトリ Settings → Secrets and variables → Actions → New repository secret
   - Name: `GLM_API_KEY`
   - Value: Z.ai（GLM）のAPIキー
2. **（任意）モデル・エンドポイント変更** … 同画面の Variables に
   - `OUTLOOK_MODEL`（既定 `glm-4.6`。`glm-5.2` 等に変更可）
   - `GLM_BASE_URL`（既定 `https://api.z.ai/api/paas/v4`。中国版は `https://open.bigmodel.cn/api/paas/v4`）
3. **Actionsの書き込み権限** … Settings → Actions → General → Workflow permissions を
   「Read and write permissions」に設定
4. **初回生成** … Actions →「AI全国概況の生成」→ Run workflow（手動実行）
   → `outlook.json` が更新され、アプリにカードが出る

## ローカル確認

```bash
# ネット無しの自己テスト（API/取得をモック）
MOCK=1 node scripts/gen-outlook.mjs
# 本番同等（要ネット＋キー）
GLM_API_KEY=xxx node scripts/gen-outlook.mjs
```

## 更新頻度・コスト

1回あたり数千トークン程度、1日2回のみ。全ユーザーで1つの `outlook.json` を共有するため、
ユーザーごとのAPI課金は発生しない。
