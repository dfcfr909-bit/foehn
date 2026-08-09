# 現状（最終更新: 2026-08-09 / v4.77.0）

セッションを始めたら、まずこのファイルを読む。
現行仕様は `docs/spec/`（**本体を読む前に `docs/spec/code_map.md`**）。
設計判断の理由は `docs/adr/`、軽い判断・地雷は `docs/decisions.md`。
**未来のタスクは GitHub Issues**、進め方は `docs/workflow.md`。
過去の経緯は `docs/archive/handoff_v4.md`（原本・更新しない）にある。

## いまの状態

- **公開URL**: https://dfcfr909-bit.github.io/SotoKi/ （GitHub Pages。`index.html` が `sotoki_v4.html` にリダイレクト）
- **本体**: `sotoki_v4.html` 単一ファイル（**7,137行 / 関数約290**）。バンドラなし、uPlotは `vendor/` に同梱
- **開発ブランチ**: `claude/hyakumeizan-areas`
  - PRがマージ済みの場合は**毎回 `origin/main` から作り直す**（`git checkout -B <branch> origin/main`）

## 進行中

- **予報山域の拡張。** `areas.json` を 20山域/45峰 → **51山域/110峰**にし、
  **日本百名山100座すべて**を入れた。峰に `hyakumeizan` フラグを足してある
  （判定には使わない。地図の△プロットで使い回す）。粒度の方針は `docs/spec/judge.md`。
  **座標は未検証（#67）／Open-Meteoのレートは未確認（#68）**
  - 次は**地図の山域レイヤー（#69）**。山域の面＋百名山の△を `areas.json` から描く。
    写真のような一般的な山脈図の公式タイルは無いので、自前データではなく
    ランキングの山域をそのまま描く方針にした
- ドキュメント構成の移行は**段階5まで完了**（`docs/project_structure_proposal.md` 第14節）。
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
| [#67](https://github.com/dfcfr909-bit/SotoKi/issues/67) | `areas.json` の座標110点を地理院で検証 | タスク |
| [#68](https://github.com/dfcfr909-bit/SotoKi/issues/68) | ランキング110地点がOpen-Meteoのレートに収まるか | 実機確認 |
| [#69](https://github.com/dfcfr909-bit/SotoKi/issues/69) | 地図の山域レイヤー（面＋百名山の△） | タスク |

> **この表は増やさない。** 新しい未確認が出たら Issue を立てて1行足す。
> 運用は `docs/workflow.md`。

## 直近の変更（3件まで。古いものは消す）

- 全国山域ランキングに日本百名山100座を追加（51山域/110峰）
- v4.77.0 自位置を車のナビと同じ矢尻で描く。追跡中は選択地点のピンを出さない
- v4.76.1 衛星・レーダーが最新の実況を貼るよう `latestObsTime` に統一（時刻ズレの修正）

## 次セッションの最初のプロンプト

> docs/status.md を読んだうえで、**Issue #69（地図の山域レイヤー）**を実装して。
> `origin/main` から新しいブランチを切ること。
>
> `areas.json`（51山域/110峰）から地図に描く。追加データは要らない。
> 1. **山域の面** … 峰の重心を中心に、最遠の峰までの距離＋余白を半径にした円を
>    うっすら塗り、重心に山域名のラベルを置く
> 2. **百名山の△** … `hyakumeizan: true` の峰に△。ズームで間引く
> 3. できれば山域の色をその日の判定（A/B/C。`GRADE_COL`）にする
>
> 既存の**アメダスの点描画**（`drawAmedas` / `refreshWeatherPoints`）がほぼ流用できる。
> レイヤー定義は `MAP_OVERLAYS` の表に足す（**URLやズーム範囲はコードでなく表を直す**）。
> ヘディングアップ時にラベルと△が立つよう `--map-rot` で逆回転させること。
>
> ⚠ **マスクは pane に直接掛けない**（Leafletのpaneは0×0。入れ物を挟む）。
> ⚠ ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）は変更禁止。
>
> 本体を読む前に `docs/spec/code_map.md`、地図の仕様は `docs/spec/map.md` を見ること。
> 完了時は `node tests/run-all.js` を全件流し、`docs/status.md` を更新してドラフトPRを作る。

## 未処理の申し送り

- **ラベル3つ（`feature` / `chore` / `needs-decision`）をGitHubのUIで作る。**
  作ったら #54〜#65 に付け直す（定義は `docs/workflow.md`）
- **二百・三百名山**は保留。選定に揺れがあり同名峰の同定も要るため、まず百名山だけで作る。
  広げるなら `hyakumeizan` と同じ形で `nihyaku` / `sanbyaku` を足す（座標調達は #61/#67 と同根）
- **石鎚・剣山の山域が広すぎる**（2峰で91km）。既存の山域なので今回は触っていないが、
  粒度の方針（`docs/spec/judge.md`）からは外れている。割るかどうかは要判断
