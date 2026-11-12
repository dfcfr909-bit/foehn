#!/bin/bash
# セッション開始時のブランチ鮮度チェック。
# 目的: 古いブランチ上で作業を始めて「その機能はこのリポジトリに無い」と
# 誤答する事故を防ぐ（2026-08-07 発生。main が42コミット遅れていた）。
#
# 規約ではなく機械として動かすのが要点。CLAUDE.md は読み飛ばされうるが、
# このフックの出力は必ずセッションの文脈に入る。
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# --- プロジェクトの取り違え防止 ---
# 目的: 別プロジェクト（インシデント解決君・Ethicる！・blog記事下書き君・青）の
# 指示を、このリポジトリで実行してしまう事故を防ぐ。
#
# ⚠ **機械で照合するのが要点。AIの自己申告に任せない。**
#    取り違えているときほど「合っています」と自信を持って報告するので、
#    「1行目にプロジェクト名を出す」だけでは何も防げない（人が気づくための印）。
#    リモートURLは事実なので、こちらが真の判定になる。
PROJECT_NAME="Foehn–フェーン–（アウトドア特化天気予報 / アプリ名はナギナビ）"
EXPECT_REMOTE="dfcfr909-bit/foehn"
remote=$(git remote get-url origin 2>/dev/null || echo '(リモートなし)')
case "$remote" in
  *"$EXPECT_REMOTE"*)
    echo "【プロジェクト】${PROJECT_NAME}"
    ;;
  *)
    cat <<MSG
‼️‼️ プロジェクト不一致。**作業を止めて人に確認すること。**
   期待: ${EXPECT_REMOTE}
   実際: ${remote}
   別プロジェクトのリポジトリで作業しようとしている可能性があります。
MSG
    ;;
esac

# --- 開いている PR（進行中の作業の正本） ---
# 目的: 別のセッションで出した PR が返事待ちのまま、新しいセッションが気づかずに
# 並行で作業を始める事故を防ぐ（2026-11-12 発生。#253 が引き継ぎ文からも main の
# docs/status.md からも落ちていた）。
#
# ⚠ **進行中の正本は GitHub の PR の一覧。** 記憶・引き継ぎ文・docs/status.md は遅れる
#    （status.md の更新そのものが、まだマージされていない PR の中にあった）。
# ⚠ git だけでは見分けられない。squash マージ済みのブランチが88本残っていて、
#    「main に無い中身があるか」を調べると85本が該当と出た（2026-11-12 に試した）。
# ⚠ 取れなかったときも黙らない。「何も出ない」を「何も開いていない」と読ませない。
JQ_ROW='[(.number|tostring), (if .draft then "draft" else "ready" end), (.updated_at | fromdateiso8601 + 32400 | strftime("%Y-%m-%d %H:%M")), ([.labels[].name] | join(",")), .title[0:70]] | join("\u001f")'
# timeout の無い環境（素の macOS など）では、付けずに走らせる（付けると必ず失敗する）
run_to() { local sec=$1; shift; if command -v timeout >/dev/null 2>&1; then timeout "$sec" "$@"; else "$@"; fi; }
PR_MAX=100
# まず PR の一覧そのものを引く。使えない環境（検索しか通らない所がある）では検索で引く。
# ⚠ 検索は索引なので、出したばかりの PR が載るまで少し遅れることがある
fetch_prs() {
  run_to 15 gh api -X GET "repos/${EXPECT_REMOTE}/pulls" -f state=open -f per_page=${PR_MAX} --jq ".[] | ${JQ_ROW}" 2>/dev/null && return 0
  run_to 15 gh api -X GET search/issues -f q="repo:${EXPECT_REMOTE} is:pr is:open" -f per_page=${PR_MAX} --jq ".items[] | ${JQ_ROW}" 2>/dev/null
}
if prs=$(fetch_prs); then
  if [ -z "$prs" ]; then
    echo "【開いている PR】なし"
  else
    echo "【開いている PR】（進行中の作業の正本。新しい作業の前に必ず読む）"
    waiting=0
    # ⚠ 区切りはタブにしない。タブは空白扱いで、空の欄（ラベルなし）が詰められて題がラベルの欄に入る
    while IFS=$'\x1f' read -r num state updated labels title; do
      [ -n "$num" ] || continue
      mark="   -"
      case ",${labels}," in
        *",needs-decision,"*) mark="   ‼️ 返事待ち"; waiting=$((waiting + 1)) ;;
      esac
      echo "${mark} #${num} ${state}・最終更新 ${updated} JST${labels:+・[${labels}]}・${title}"
    done <<< "$prs"
    # ⚠ 上限に達したら、続きがあるかもしれないと言う（黙って落とさない）
    if [ "$(printf '%s\n' "$prs" | grep -c .)" -ge "$PR_MAX" ]; then
      echo "   ‼️ ${PR_MAX} 本まで出しました。ほかにも開いている PR があるかもしれません（GitHub で確かめる）。"
    fi
    if [ "$waiting" -gt 0 ]; then
      cat <<MSG
   ‼️ 返事待ちの PR が ${waiting} 本あります。**新しい作業を始める前に**、その PR のコメントにある
      確認の表を利用者へ出すこと（このセッションで一度だけ。CLAUDE.md「並行作業を作らない」）。
MSG
    fi
  fi
else
  cat <<MSG
【開いている PR】取得できず（gh が無い・通信の失敗）。
   ‼️ 作業を始める前に、GitHub の PR の一覧（MCP の list_pull_requests・state=open）で
      開いている PR を確かめること。**「出ていない」は「開いていない」ではありません。**
MSG
fi

# 取得できなくても致命的ではないので失敗は握りつぶす
# （SESSION_HOOK_SKIP_FETCH は検査用。tests/smoke_sessionhook.mjs が通信なしで走らせる）
[ -n "${SESSION_HOOK_SKIP_FETCH:-}" ] || run_to 20 git fetch --quiet origin 2>/dev/null

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')
version=$(grep -o 'id="app-version">v[0-9.]*' sotoki_v4.html 2>/dev/null | head -1 | sed 's/.*>//')

if ! git rev-parse --verify --quiet origin/main >/dev/null 2>&1; then
  echo "【ブランチ】${branch} / 版 ${version:-不明}（origin/main が取得できず比較なし）"
  exit 0
fi

read -r behind ahead < <(git rev-list --left-right --count origin/main...HEAD 2>/dev/null | tr '\t' ' ')
behind=${behind:-0}; ahead=${ahead:-0}

echo "【ブランチ】${branch}　【作業ツリーの版】${version:-不明}"
echo "【origin/main との差】遅れ ${behind} / 先行 ${ahead}"

if [ "$behind" -gt 0 ]; then
  cat <<MSG

‼️ 警告: いまのブランチは origin/main より ${behind} コミット遅れています。
   ここで読むコードもドキュメント（CLAUDE.md / docs/）も、その分だけ古い内容です。
   「その機能は無い」と判断する前に、必ず origin/main 側を確認してください。
   通常は先に  /sync-main  で追いつかせてから作業を始めます（merge で取り込む。rebase・force push はしない）。
   いまいるのが main なら、追いつかせるのではなく origin/main から新しいブランチを切ります。
MSG
fi

# main 自体が実態から遅れていないかの逆方向チェック。
# 2026-08-07 の事故は main が42コミット遅れていたことが原因だった。
#
# ⚠ 以前は「main より10コミット以上先行するブランチ」を警告していたが、外した（2026-11-12）。
#   merge で main を取り込んだブランチを数百コミット先行と数え（実際の差は8ファイル）、
#   6コミットしか無い返事待ちの PR は素通りしていた。進行中の正本は上の「開いている PR」。
# ここで見るのは、その網から漏れるもの——**PR を出さずに push されたブランチ**。
# 「main の先端より新しいコミットを持つ」ブランチだけを出す（squash マージ済みの古いブランチは拾わない）。
mainTime=$(git log -1 --format=%ct origin/main 2>/dev/null || echo 0)
newer=$(for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin 2>/dev/null | grep -v 'origin/HEAD$' | grep -v 'origin/main$' | grep -v '^origin$'); do
  t=$(git log -1 --format=%ct "$b" 2>/dev/null || echo 0)
  [ "$t" -gt "$mainTime" ] || continue
  n=$(git rev-list --count origin/main.."$b" 2>/dev/null || echo 0)
  [ "$n" -ge 1 ] && echo "$t $b"
done | sort -rn | head -5)

if [ -n "$newer" ]; then
  echo
  echo "【main の先端より新しいコミットを持つブランチ】（上の「開いている PR」に無ければ、PR の無い作業かもしれません）"
  echo "$newer" | while read -r t b; do echo "   - $b"; done
fi

exit 0
