# 現状（最終更新: 2026-08-09 / v4.77.0）

セッションを始めたら、まずこのファイルを読む。
現行仕様は `docs/spec/`（**本体を読む前に `docs/spec/code_map.md`**）。
設計判断の理由は `docs/adr/`、軽い判断・地雷は `docs/decisions.md`。
**未来のタスクは GitHub Issues**、進め方は `docs/workflow.md`。
過去の経緯は `docs/archive/handoff_v4.md`（原本・更新しない）にある。

## いまの状態

- **公開URL**: https://dfcfr909-bit.github.io/SotoKi/ （GitHub Pages。`index.html` が `sotoki_v4.html` にリダイレクト）
- **本体**: `sotoki_v4.html` 単一ファイル（**7,137行 / 関数約290**）。バンドラなし、uPlotは `vendor/` に同梱
- **開発ブランチ**: `claude/stage-5-issue-ops`
  - PRがマージ済みの場合は**毎回 `origin/main` から作り直す**（`git checkout -B <branch> origin/main`）

## 進行中

- ドキュメント構成の移行 段階5（`docs/project_structure_proposal.md` 第14節）。
  Issueテンプレ2種（タスク / 実機確認）を `.github/ISSUE_TEMPLATE/` に置き、
  ラベル4種・コミットprefix・タグ・ブランチの運用を `docs/workflow.md` にまとめた。
  **「未完・要確認」表の11行はIssue #54〜#65 へ移した。** 段階4までは実施済み。
  残るは段階6（`.claude/` にスラッシュコマンドと permissions）のみ
  - ⚠ **ラベルがまだ作られていない。** `bug` は既定であるが、
    `feature` / `chore` / `needs-decision` は**未作成**なので Issue はラベル無しで立ててある。
    GitHubのUIで3つ作ってから一括で付け直すこと（`docs/workflow.md` に定義がある）
- `netlify.toml` は**残す**と判断した。GitHub Pages は読まないので配信に影響せず、
  PRのNetlifyプレビューが現状唯一のCIチェックのため（消すのはいつでもできる）

## 未完・要確認

**Issueへ移した。** 詳細は各Issueにある（確認する場所・判定の分かれ目・逃げ道つき）。
ここには一覧だけ置く。

| # | 項目 | 種別 |
|---|---|---|
| [#54](https://github.com/dfcfr909-bit/SotoKi/issues/54) | ひまわりカラーの虫食い配信（保留中） | 実機確認 |
| [#55](https://github.com/dfcfr909-bit/SotoKi/issues/55) | 雲の着色（`SAT_TINTS`）が効いているか | 実機確認 |
| [#56](https://github.com/dfcfr909-bit/SotoKi/issues/56) | 雨の予告の分きざみ（気象庁タイルのCORS） | 実機確認 |
| [#57](https://github.com/dfcfr909-bit/SotoKi/issues/57) | 地図レイヤーが表示されるか（火山土地条件図のID等） | 実機確認 |
| [#58](https://github.com/dfcfr909-bit/SotoKi/issues/58) | jma_seamlessの実予報期間 | 実機確認 |
| [#59](https://github.com/dfcfr909-bit/SotoKi/issues/59) | 気圧面ごとの雲量・3層フォールバックの見た目 | 実機確認 |
| [#60](https://github.com/dfcfr909-bit/SotoKi/issues/60) | JMA bosai のCORS（#61が先） | 実機確認 |
| [#61](https://github.com/dfcfr909-bit/SotoKi/issues/61) | `buildSpots.mjs` 未実行（`data/spots.json` が無い） | タスク |
| [#62](https://github.com/dfcfr909-bit/SotoKi/issues/62) | AI全国概況が非表示（`GLM_API_KEY` 待ち） | 要判断 |
| [#63](https://github.com/dfcfr909-bit/SotoKi/issues/63) | CS立体図の配信範囲（URL待ち） | 要判断 |
| [#64](https://github.com/dfcfr909-bit/SotoKi/issues/64) | スクラバー帯のなぞり心地 | タスク |
| [#65](https://github.com/dfcfr909-bit/SotoKi/issues/65) | ライセンス未設定 | 要判断 |

> **この表は増やさない。** 新しい未確認が出たら Issue を立てて1行足す。
> 運用は `docs/workflow.md`。

## 直近の変更（3件まで。古いものは消す）

- v4.77.0 自位置を車のナビと同じ矢尻で描く。追跡中は選択地点のピンを出さない
- v4.76.1 衛星・レーダーが最新の実況を貼るよう `latestObsTime` に統一（時刻ズレの修正）
- v4.76.0 衛星のSVGフィルタを要素ごと作り直す（iOS Safariがフィルタを使い回す件）

## 次セッションの最初のプロンプト

> docs/status.md を読んだうえで、`docs/project_structure_proposal.md` の**段階6**
> （`.claude/` にスラッシュコマンドと permissions を置く）を実施して。
> `origin/main` から新しいブランチを切ること。
>
> やること:
> 1. **`.claude/settings.json` の permissions** を整える。毎回聞かれて煩わしいものを
>    許可に入れる（`node tests/run-all.js` / `git` の読み取り系 / `grep`・`ls` など）。
>    **破壊的なものは入れない**（`rm -rf` / `git push --force` / `wrangler` の秘密操作）
> 2. **スラッシュコマンド**を `.claude/commands/` に置く。候補:
>    - `/test` … `cd tests && npm install`（初回）→ `node tests/run-all.js` を全件流す
>    - `/status` … `docs/status.md` を読み、開発ブランチと `origin/main` の差を出す
>    - `/spec <名前>` … `docs/spec/` の該当ファイルと `code_map.md` を開く
>    - `/release <版>` … 版数表記の更新箇所を示し、タグの打ち方を出す
> 3. `CLAUDE.md` に `.claude/` の存在を**1行だけ**足す（L0は増やさない）
>
> ⚠ `.claude/hooks/session-start.sh` は**既にある。触らない**
> （ブランチ鮮度チェック。第13節の事故対策）。
>
> 制約: **コードは1行も変更しない。** 段階ごとにcommitを分割する。
> アプリ名は「ナギナビ」。完了時は `node tests/run-all.js` を全件流し
> （初回は `cd tests && npm install`）、`docs/status.md` を更新してドラフトPRを作る。

## 未処理の申し送り

- **ラベル3つ（`feature` / `chore` / `needs-decision`）をGitHubのUIで作る。**
  作ったら #54〜#65 に付け直す（定義は `docs/workflow.md`）
- **予報山域の拡張**（未Issue化）。日本百名山をランキングへ追加し、
  100〜300名山を地図に△でプロットしたい。**先に座標データの出所を決める必要がある**
  （`buildSpots.mjs` と同じく開発環境から OSM/国土地理院に到達できない → #61 と同根）。
  ランキング拡張・地図の△プロット・座標調達の3本に割るのが妥当
