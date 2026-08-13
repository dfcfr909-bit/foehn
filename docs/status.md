# 現状（最終更新: 2026-08-13 / v4.77.0）

セッションを始めたら、まずこのファイルを読む。
現行仕様は `docs/spec/`（**本体を読む前に `docs/spec/code_map.md`**）。
設計判断の理由は `docs/adr/`、軽い判断・地雷は `docs/decisions.md`。
**未来のタスクは GitHub Issues**、進め方は `docs/workflow.md`。
過去の経緯は `docs/archive/handoff_v4.md`（原本・更新しない）にある。

## いまの状態

- **公開URL**: https://dfcfr909-bit.github.io/foehn/ （`index.html` が `sotoki_v4.html` にリダイレクト）
  - ⚠ **リポジトリを `SotoKi` から `foehn` へ作り直した（ADR-0009）。**
    履歴の SHA・Issue番号・公開URLがすべて変わっている。
    **旧 `SotoKi` のクローンは使えない**（全SHAが別物）。取り直すこと
  - **Pages は Actions 方式で配信している**（`.github/workflows/pages.yml`）。
    設定画面で「Deploy from a branch」が選べなかったため → `docs/decisions.md`
    `main` にマージすると自動でデプロイされる
- **本体**: `sotoki_v4.html` 単一ファイル（**7,380行 / 関数約300**）。バンドラなし、uPlotは `vendor/` に同梱
  - ⚠ **ファイル名は変えない。** `sw.js`・`index.html`・`manifest`・テスト・`code_map.md` が
    この名前に依存している（55箇所）。リネームするなら独立したPRで
- **アプリ名は「ナギナビ」/ `NAGI NAV`。** 変えたのはリポジトリ名だけ
- **開発ブランチ**: `origin/main` から毎回新しく切る
  （`git checkout -B <branch> origin/main`）。前回は `claude/sotoki-foehn-migration-cdiddb`（マージ済み）

## 進行中

- **ABC評価の風速を「山頂高度の気圧面風」に変えた（ADR-0006）。** 判定が甘すぎた不具合。
  地上10m風で判定していたため、モデル地形より高く突き出た山ほど風が弱く出ていた。
  皇海山(2,144m)はモデル地形1,405mで、10m風2.73m/s → 800hPa 21.02m/s。**終日A → C** に是正。
  - `judgePoint` / `THRESH` は**一切変更していない**。変えたのは入力データの質だけ
  - ⚠ **ランキングの見え方が一変する。** A の山域の多くが B/C になる。これが正しい姿。
    「厳しくなった」と言われても**閾値を戻さないこと**（ADR-0005と同じ罠）
  - 実機確認は #16。**座標ズレで判定が甘くなる**ことが分かったので、
    峰と分かっている選択では `areas.json` の標高を優先する（DEM頼みにしない）
- 地図の山域・百名山レイヤー（#69）は実装済み。見た目の実機確認は #15
- 予報山域は **51山域/110峰**（日本百名山100座）。座標は未検証（#13）
- ドキュメント構成の移行は**段階5まで完了**。残るは段階6（`.claude/`）のみ
  - ⚠ **ラベルがまだ作られていない。** `feature` / `chore` / `needs-decision` は未作成
- **Netlify は撤去した（ADR-0008）。** プロジェクトを削除し `netlify.toml` も消した。
  PRのチェックは GitHub Actions のスモークテスト（`.github/workflows/test.yml`）に置き換え
  - ⚠ **マージ前に実機で触る手段は無くなった。** 実機確認はマージ後に公開URLで行う

## 未完・要確認

**Issueへ移した。** 詳細は各Issueにある（確認する場所・判定の分かれ目・逃げ道つき）。
ここには一覧だけ置く。

| # | 項目 | 種別 |
|---|---|---|
| [#1](https://github.com/dfcfr909-bit/foehn/issues/1) | ひまわりカラーの虫食い配信（保留中） | 実機確認 |
| [#2](https://github.com/dfcfr909-bit/foehn/issues/2) | 雲の着色（`SAT_TINTS`）が効いているか | 実機確認 |
| [#3](https://github.com/dfcfr909-bit/foehn/issues/3) | 雨の予告の分きざみ（気象庁タイルのCORS） | 実機確認 |
| [#4](https://github.com/dfcfr909-bit/foehn/issues/4) | 地図レイヤーが表示されるか（火山土地条件図のID等） | 実機確認 |
| [#5](https://github.com/dfcfr909-bit/foehn/issues/5) | jma_seamlessの実予報期間 | 実機確認 |
| [#6](https://github.com/dfcfr909-bit/foehn/issues/6) | 気圧面ごとの雲量・3層フォールバックの見た目 | 実機確認 |
| [#7](https://github.com/dfcfr909-bit/foehn/issues/7) | JMA bosai のCORS（#8が先） | 実機確認 |
| [#8](https://github.com/dfcfr909-bit/foehn/issues/8) | `buildSpots.mjs` 未実行（`data/spots.json` が無い） | タスク |
| [#9](https://github.com/dfcfr909-bit/foehn/issues/9) | AI全国概況が非表示（`GLM_API_KEY` 待ち） | 要判断 |
| [#10](https://github.com/dfcfr909-bit/foehn/issues/10) | CS立体図の配信範囲（URL待ち） | 要判断 |
| [#11](https://github.com/dfcfr909-bit/foehn/issues/11) | スクラバー帯のなぞり心地 | タスク |
| [#12](https://github.com/dfcfr909-bit/foehn/issues/12) | ライセンス未設定 | 要判断 |
| [#13](https://github.com/dfcfr909-bit/foehn/issues/13) | `areas.json` の座標を検証（`checkPeaks.mjs` で洗い出し→地図で読み取り） | タスク |
| [#14](https://github.com/dfcfr909-bit/foehn/issues/14) | ランキング110地点がOpen-Meteoのレートに収まるか | 実機確認 |
| [#15](https://github.com/dfcfr909-bit/foehn/issues/15) | 山域レイヤーの見た目（札の重なり・△の見え方） | 実機確認 |
| [#16](https://github.com/dfcfr909-bit/foehn/issues/16) | 山頂高度の風による判定が実際の予報と合うか（ADR-0006） | 実機確認 |

> **この表は増やさない。** 新しい未確認が出たら Issue を立てて1行足す。
> 運用は `docs/workflow.md`。

## 直近の変更（3件まで。古いものは消す）

- **`SotoKi` → `foehn` へリポジトリを作り直した（ADR-0009）。** 履歴から対象外の資料を除去。
  Issue16件を復元（旧 #54〜#73 → 新 #1〜#16）、URL・表記・Issue番号を置換
- **Pages を Actions 方式に**（`.github/workflows/pages.yml`）。設定画面でブランチ配信を選べなかったため
- ABC評価の風速を山頂高度の気圧面風にした（判定が甘すぎた。ADR-0006）

## 次セッションの最初のプロンプト

⚠ このリポジトリは `SotoKi` から作り直した `foehn`（ADR-0009）。
手元に旧 `SotoKi` のクローンがあっても**使わずに取り直すこと**（全SHAが別物）。

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

- ⚠ **`sw.js` がエラー応答をキャッシュしてしまう（未修正のバグ）。**
  ナビゲーション処理（`sw.js` の `req.mode === 'navigate'` の分岐）が
  `const fresh = await fetch(req); cache.put(req, fresh.clone());` となっていて、
  **`res.ok` を見ていない**。404や500が返るとそれをHTMLキャッシュに焼き付け、
  以後は圏外でもそのエラーが返る。**「圏外でも画面が立ち上がる」という `sw.js` の
  目的が壊れる**（`docs/spec/pwa.md`）。同ファイルの静的ファイル側は `res.ok` を見ているので、
  ナビゲーション側だけの漏れ。`res.ok` を確認してから `cache.put` するだけで直る。
  移行作業中に発見。別件なので手を付けていない
- ⚠ **`smoke_mapui` の「古いレイヤーは残さない（重ならない）」がCIで稀に落ちる（フレーク）。**
  2026-08-13、`docs/status.md` しか変えていないPRで落ち、**再実行で通った**（手元では常にPASS）。
  落ちたときの `smoke_mapui` は約105秒かかっており、条件待ちの上限が遅いランナーで
  足りていないと思われる。**同じ症状は PR #77 でも直している**（固定1000ms待ち → 条件待ち）ので、
  待ち方をもう一段見直す余地がある。**まず再実行すること。**
  他のテストが道連れで落ちていないか（1件だけの失敗か）を確認材料にする
- **旧リポジトリ `SotoKi` はまだ削除していない。** Issue16件の復元は済んでいるので削除して構わない
  （`https://github.com/dfcfr909-bit/SotoKi/settings` 最下部 Danger Zone）。
  旧URLの PWA は端末に別アプリとして残り、開くと GitHub の404が出る
- **ラベル3つ（`feature` / `chore` / `needs-decision`）をGitHubのUIで作る。**
  作ったら #1〜#12 に付け直す（定義は `docs/workflow.md`）
- **二百・三百名山**は保留。選定に揺れがあり同名峰の同定も要るため、まず百名山だけで作る。
  広げるなら `hyakumeizan` と同じ形で `nihyaku` / `sanbyaku` を足す（座標調達は #8/#13 と同根）
- **山域の分け方に見直したい所がある**（円の中心が主峰からズレる形で表面化した）。
  計算式ではなく**データ側**の問題なので、#13 の座標検証と一緒に見るとよい。
  - `富士周辺` … 富士山＋三ツ峠山。**富士山は独立峰なので1座だけの山域が素直**
    （三ツ峠山は百名山でなく山塊も別。いま中心が11km北へ寄っている）
  - `石鎚・剣山` … 2峰で**91km**。粒度の方針（`docs/spec/judge.md`）から外れている
  - `九重・祖母` … 30km。上2つほどではないが同種
  - ⚠ 円の中心の計算式（重心）は**変えない**と決めた。理由は `docs/decisions.md` 2026-08-09
