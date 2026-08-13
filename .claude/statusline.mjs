// foehn ステータスライン
//   モデル名 / コンテキスト使用率 / 5時間セッションのリセット時刻（JST）
// stdinにClaude CodeからのセッションJSONが渡される。1行を標準出力する。
let s = '';
process.stdin.on('data', d => (s += d));
process.stdin.on('end', () => {
  let j = {};
  try { j = JSON.parse(s); } catch (_) {}

  const model = (j.model && j.model.display_name) || '?';

  const cw = j.context_window || {};
  const pct = Math.round(cw.used_percentage || 0);

  // 5時間レートリミットのリセット時刻（Unix秒）→ JST HH:MM
  const resetEpoch = j.rate_limits && j.rate_limits.five_hour && j.rate_limits.five_hour.resets_at;
  let reset = '--:--';
  if (resetEpoch) {
    reset = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(resetEpoch * 1000));
  }

  process.stdout.write(`🤖 ${model}  🧠 ${pct}% context  ♻️ ${reset} JST reset`);
});
