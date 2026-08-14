# 現状（最終更新: 2026-08-14 / v4.77.0）

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
  （`git checkout -B <branch> origin/main`）。前回は `claude/foehn-claude-setup-gryofy`（PR #20）

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
- **ドキュメント構成の移行は完了した（段階6まで）。** `docs/project_structure_proposal.md` は役目を終えた
  - `.claude/` にスラッシュコマンド（`/test` `/status` `/spec` `/release`）と permissions を置いた
  - ラベル `feature` / `chore` / `needs-decision` は**作成済み**（`bug` は既定のもの）。
    ⚠ **Issue #1〜#16 への付け直しはまだ**（2026-08-13 時点でどれも未ラベル）
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

- **`smoke_mapui` のフレークに原因を出させるようにした**（残存レイヤーのURL等）。
  併せて**タグを積み直した**（`v4.77.0`。移行で引き継がれていなかった）
- **`sw.js` がエラー応答をHTMLキャッシュに焼き付ける不具合を直した**（`res.ok` を見る）。
  `smoke_pwa` に検査を追加
- **`.claude/` にスラッシュコマンドと permissions を置いた（段階6）。** ドキュメント整理はこれで終わり

## 次セッションの最初のプロンプト

⚠ このリポジトリは `SotoKi` から作り直した `foehn`（ADR-0009）。
手元に旧 `SotoKi` のクローンがあっても**使わずに取り直すこと**（全SHAが別物）。

> docs/status.md を読んだうえで、**Issue #13（`areas.json` の座標の検証）**を進めて。
> `origin/main` から新しいブランチを切ること。
>
> - 手元から地理院に到達できないので、**GitHub Actions「山頂座標の検査」から
>   `checkPeaks.mjs` を手動実行**する。そこで出たズレの一覧が出発点
> - ⚠ **座標ズレは判定を甘くする**（モデル地形が低く出て風が弱くなる。ADR-0006）。
>   峰と分かっている選択では `areas.json` の標高を優先し、DEM頼みにしない
> - **山域の分け方の見直しと同じ根**なので一緒に見る（下の申し送り）。
>   `富士周辺` / `石鎚・剣山`(91km) / `九重・祖母`(30km) の3つ。
>   ⚠ 円の中心の計算式（重心）は**変えない**と決めてある → `docs/decisions.md` 2026-08-09
> - 受け入れ条件: `node tests/run-all.js` 全16件PASS（`smoke_snap` が座標まわりの砦）
>
> 触ってはいけないもの: ABC評価ロジック（`abcScore` / `abcScoreInv` / `judgePoint`）。
> 制約: 段階ごとにcommitを分割し、各段階の完了時に動作確認を求めること。

## 未処理の申し送り

- ⚠ **`smoke_mapui` の「古いレイヤーは残さない（重ならない）」がCIで稀に落ちる（フレーク）。**
  2026-08-13、`docs/status.md` しか変えていないPRで落ち、**再実行で通った**（手元では常にPASS）。
  **まず再実行すること。** 他のテストが道連れで落ちていないか（1件だけの失敗か）を確認材料にする。
  - **2026-08-13 に3回踏んだ**（#19 のCI／PR #20 で手元／PR #21 のCIで2回連続）。
    いずれも1件だけ・値は常に「3」・所要は約105秒。3回目の再実行で通った。
    **変更内容とは無関係**（コードを1行も変えていないブランチでも出た）
  - ⚠ **原因はまだ分かっていない。** 「遅いから」という見立ては**外れの可能性が高い**。
    手元で実測すると2枚になるまで **34ms**（当時の上限12,000ms）で、待ちは制約になっていなかった
  - **次に落ちたらログで切り分けられる**ようにした（PR #22）。残存レイヤーのURL・
    `staleWxLayers` の中身・ONのオーバーレイ・実際の待ち時間が出る。
    3枚目が「外れ損ねた古いレイヤー」か「別種のレイヤー」かはそれで分かる。
    **落ちたログを捨てないこと**（再実行で流れる前に控える）
- **タグは `v4.77.0`（`488b684`）の1本だけ。** 移行でタグが引き継がれなかったので、
  2026-08-14 にここから積み直した。旧 `SotoKi` のタグの移植は**しない**と決めた
  （SHAが全部別物で対応付けが手作業になる）。過去は諦めて今から積む
  - ⚠ **Claude のセッションからはタグを打てない。** push が 403 で拒否される
    （ブランチは push できるのでタグ ref だけの制限）。**人間が打つ**
  - スマホからは **Releases → New release → Create new tag → Publish release**。
    ⚠ `Save draft` ではタグは作られない（`on publish` と書いてあるとおり）。
    Actions の手動実行で打てるようにする案もある（「山頂座標の検査」と同じ形）
- **旧リポジトリ `SotoKi` はまだ削除していない。** Issue16件の復元は済んでいるので削除して構わない
  （`https://github.com/dfcfr909-bit/SotoKi/settings` 最下部 Danger Zone）。
  旧URLの PWA は端末に別アプリとして残り、開くと GitHub の404が出る
- **ラベルを Issue に付け直す**（作成は済んだ。定義は `docs/workflow.md`）。
  一覧でチェックを入れて右上の Label から一括で付けられる。
  `needs-decision` … #9 #10 #12 ／ `feature` … #11 ／ `chore` … 残り（#1〜#8, #13〜#16）
- **二百・三百名山**は保留。選定に揺れがあり同名峰の同定も要るため、まず百名山だけで作る。
  広げるなら `hyakumeizan` と同じ形で `nihyaku` / `sanbyaku` を足す（座標調達は #8/#13 と同根）
- **山域の分け方に見直したい所がある**（円の中心が主峰からズレる形で表面化した）。
  計算式ではなく**データ側**の問題なので、#13 の座標検証と一緒に見るとよい。
  - `富士周辺` … 富士山＋三ツ峠山。**富士山は独立峰なので1座だけの山域が素直**
    （三ツ峠山は百名山でなく山塊も別。いま中心が11km北へ寄っている）
  - `石鎚・剣山` … 2峰で**91km**。粒度の方針（`docs/spec/judge.md`）から外れている
  - `九重・祖母` … 30km。上2つほどではないが同種
  - ⚠ 円の中心の計算式（重心）は**変えない**と決めた。理由は `docs/decisions.md` 2026-08-09
