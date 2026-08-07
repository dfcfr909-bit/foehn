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

# 取得できなくても致命的ではないので失敗は握りつぶす
timeout 20 git fetch --quiet origin 2>/dev/null

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
   通常は先に  git rebase origin/main  で追いつかせてから作業を始めます。
MSG
fi

# main 自体が実態から遅れていないかの逆方向チェック。
# 2026-08-07 の事故は main が42コミット遅れていたことが原因だった。
# 「main より先行」だけだと放棄済みの古いブランチを拾うので、
# 「main の先端より新しいコミットを持つ」ことも条件にする。
mainTime=$(git log -1 --format=%ct origin/main 2>/dev/null || echo 0)
lead=$(for b in $(git for-each-ref --format='%(refname:short)' refs/remotes/origin 2>/dev/null | grep -v 'origin/HEAD$' | grep -v 'origin/main$'); do
  n=$(git rev-list --count origin/main.."$b" 2>/dev/null || echo 0)
  [ "$n" -ge 10 ] || continue
  t=$(git log -1 --format=%ct "$b" 2>/dev/null || echo 0)
  [ "$t" -gt "$mainTime" ] && echo "$n $b"
done | sort -rn | head -3)

if [ -n "$lead" ]; then
  echo
  echo "‼️ 警告: origin/main より10コミット以上先行しているブランチがあります。"
  echo "   main が実態から遅れている可能性があります。どれが真実かを人間に確認してください。"
  echo "$lead" | while read -r n b; do echo "   - $b（main より ${n} コミット先行）"; done
fi

exit 0
