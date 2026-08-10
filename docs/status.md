# 現状（最終更新: 2026-08-09 / v4.77.0）

セッションを始めたら、まずこのファイルを読む。
現行仕様は `docs/spec/`（**本体を読む前に `docs/spec/code_map.md`**）。
設計判断の理由は `docs/adr/`、軽い判断・地雷は `docs/decisions.md`。
**未来のタスクは GitHub Issues**、進め方は `docs/workflow.md`。
過去の経緯は `docs/archive/handoff_v4.md`（原本・更新しない）にある。

## いまの状態

- **公開URL**: https://dfcfr909-bit.github.io/SotoKi/ （GitHub Pages。`index.html` が `sotoki_v4.html` にリダイレクト）
- **本体**: `sotoki_v4.html` 単一ファイル（**7,380行 / 関数約300**）。バンドラなし、uPlotは `vendor/` に同梱
- **開発ブランチ**: `claude/summit-wind`
  - PRがマージ済みの場合は**毎回 `origin/main` から作り直す**（`git checkout -B <branch> origin/main`）

## 進行中

- **ABC評価の風速を「山頂高度の気圧面風」に変えた（ADR-0006）。** 判定が甘すぎた不具合。
  地上10m風で判定していたため、モデル地形より高く突き出た山ほど風が弱く出ていた。
  皇海山(2,144m)はモデル地形1,405mで、10m風2.73m/s → 800hPa 21.02m/s。**終日A → C** に是正。
  - `judgePoint` / `THRESH` は**一切変更していない**。変えたのは入力データの質だけ
  - ⚠ **ランキングの見え方が一変する。** A の山域の多くが B/C になる。これが正しい姿。
    「厳しくなった」と言われても**閾値を戻さないこと**（ADR-0005と同じ罠）
  - 実機確認は #73。**座標ズレで判定が甘くなる**ことが分かったので、
    峰と分かっている選択では `areas.json` の標高を優先する（DEM頼みにしない）
- 地図の山域・百名山レイヤー（#69）は実装済み。見た目の実機確認は #71
- 予報山域は **51山域/110峰**（日本百名山100座）。座標は未検証（#67）
- ドキュメント構成の移行は**段階5まで完了**。残るは段階6（`.claude/`）のみ
  - ⚠ **ラベルがまだ作られていない。** `feature` / `chore` / `needs-decision` は未作成
- `netlify.toml` は**残す**と判断した（PRのNetlifyプレビューが唯一のCIチェックのため）

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
| [#67](https://github.com/dfcfr909-bit/SotoKi/issues/67) | `areas.json` の座標を検証（`checkPeaks.mjs` で洗い出し→地図で読み取り） | タスク |
| [#68](https://github.com/dfcfr909-bit/SotoKi/issues/68) | ランキング110地点がOpen-Meteoのレートに収まるか | 実機確認 |
| [#71](https://github.com/dfcfr909-bit/SotoKi/issues/71) | 山域レイヤーの見た目（札の重なり・△の見え方） | 実機確認 |

> **この表は増やさない。** 新しい未確認が出たら Issue を立てて1行足す。
> 運用は `docs/workflow.md`。

## 直近の変更（3件まで。古いものは消す）

- ABC評価の風速を山頂高度の気圧面風にした（判定が甘すぎた。ADR-0006）
- 地図に山域・百名山レイヤーを追加（#69）。検索結果タップの不具合も修正
- 全国山域ランキングに日本百名山100座を追加（51山域/110峰）

## 次セッションの最初のプロンプト

> docs/status.md を読んだうえで、`docs/project_structure_proposal.md` の**段階6**
> （`.claude/` にスラッシュコマンドと permissions を置く）を実施して。
> `origin/main` から新しいブランチを切ること。**ドキュメント整理はこれで最後**。
>
> 1. **`.claude/settings.json` の permissions** … 毎回聞かれて煩わしいものを許可に入れる
>    （`node tests/run-all.js` / `git` の読み取り系 / `grep`・`ls` など）。
>    **破壊的なものは入れない**（`rm -rf` / `git push --force` / `wrangler` の秘密操作）
> 2. **スラッシュコマンド**を `.claude/commands/` に置く。候補:
>    `/test`（16件流す）/ `/status`（status.md＋ブランチ鮮度）/
>    `/spec <名前>`（該当specと code_map を開く）/ `/release <版>`（版数の更新箇所とタグ）
> 3. `CLAUDE.md` に `.claude/` の存在を**1行だけ**足す（L0は増やさない）
>
> ⚠ `.claude/hooks/session-start.sh` は**既にある。触らない**。
> 制約: **コードは1行も変更しない。** 段階ごとにcommitを分割する。

## 未処理の申し送り

- **ラベル3つ（`feature` / `chore` / `needs-decision`）をGitHubのUIで作る。**
  作ったら #54〜#65 に付け直す（定義は `docs/workflow.md`）
- **二百・三百名山**は保留。選定に揺れがあり同名峰の同定も要るため、まず百名山だけで作る。
  広げるなら `hyakumeizan` と同じ形で `nihyaku` / `sanbyaku` を足す（座標調達は #61/#67 と同根）
- **山域の分け方に見直したい所がある**（円の中心が主峰からズレる形で表面化した）。
  計算式ではなく**データ側**の問題なので、#67 の座標検証と一緒に見るとよい。
  - `富士周辺` … 富士山＋三ツ峠山。**富士山は独立峰なので1座だけの山域が素直**
    （三ツ峠山は百名山でなく山塊も別。いま中心が11km北へ寄っている）
  - `石鎚・剣山` … 2峰で**91km**。粒度の方針（`docs/spec/judge.md`）から外れている
  - `九重・祖母` … 30km。上2つほどではないが同種
  - ⚠ 円の中心の計算式（重心）は**変えない**と決めた。理由は `docs/decisions.md` 2026-08-09
