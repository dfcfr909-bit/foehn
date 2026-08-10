# 現状（最終更新: 2026-08-09 / v4.77.0）

セッションを始めたら、まずこのファイルを読む。
現行仕様は `docs/spec/`（**本体を読む前に `docs/spec/code_map.md`**）。
設計判断の理由は `docs/adr/`、軽い判断・地雷は `docs/decisions.md`。
**未来のタスクは GitHub Issues**、進め方は `docs/workflow.md`。
過去の経緯は `docs/archive/handoff_v4.md`（原本・更新しない）にある。

## いまの状態

- **公開URL**: https://dfcfr909-bit.github.io/SotoKi/ （GitHub Pages。`index.html` が `sotoki_v4.html` にリダイレクト）
- **本体**: `sotoki_v4.html` 単一ファイル（**7,296行 / 関数約295**）。バンドラなし、uPlotは `vendor/` に同梱
- **開発ブランチ**: `claude/69-area-layer`
  - PRがマージ済みの場合は**毎回 `origin/main` から作り直す**（`git checkout -B <branch> origin/main`）

## 進行中

- **地図の山域・百名山レイヤー（#69）を実装した。** `areas.json` から山域の面・
  ラベル・百名山の△を描く。色はランキングを開いた後にその日の判定（A/B/C）になる。
  **この描画のために気象データを取りに行かない**（地図を開いただけで全国ぶんを引くと重い）
  - あわせて `pickMapPoint` の二重定義を直した。**検索結果をタップしても地図が動かず、
    渡した名前が捨てられていた**（長押し側を `pickPinPoint` に分離）
- 予報山域は **51山域/110峰**（日本百名山100座を含む）。
  **座標は未検証（#67）／Open-Meteoのレートは未確認（#68）**
- ドキュメント構成の移行は**段階5まで完了**。残るは段階6（`.claude/`）のみ
  - ⚠ **ラベルがまだ作られていない。** `feature` / `chore` / `needs-decision` は未作成で、
    Issue はラベル無しで立ててある（定義は `docs/workflow.md`）
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
| [#71](https://github.com/dfcfr909-bit/SotoKi/issues/71) | 山域レイヤーの見た目（札の重なり・△の見え方） | 実機確認 |

> **この表は増やさない。** 新しい未確認が出たら Issue を立てて1行足す。
> 運用は `docs/workflow.md`。

## 直近の変更（3件まで。古いものは消す）

- 地図に山域・百名山レイヤーを追加（#69）。検索結果タップの不具合も修正
- 全国山域ランキングに日本百名山100座を追加（51山域/110峰）
- v4.77.0 自位置を車のナビと同じ矢尻で描く。追跡中は選択地点のピンを出さない

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
