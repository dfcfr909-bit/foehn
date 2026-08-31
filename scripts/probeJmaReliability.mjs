/* 気象庁の週間予報「信頼度」が使えるかを調べる。
 *
 * なぜ要るか:
 *   PR #45 で「だいぶ先の予報」に**リードタイムから引いた目安**を出した。
 *   ⚠ **あれは実測した精度ではない。** 気象庁は週間予報に信頼度（A/B/C）を出しており、
 *   そちらが本物。取れるなら置き換える（`docs/decisions.md`）。
 *
 * ⚠ **開発環境から気象庁へ到達できない**（プロキシ403）ので Actions から叩く。
 * ⚠ **キーの名前を推測で決め打たない。** 返ってきた JSON を全部たどって
 *   「信頼度らしきもの」を探し、**見つかった場所をそのまま出す**。
 *   1回目の天気図の調査で、出力を切ったせいで予想図の存在に気づけなかった反省。
 *
 * 使い方: node scripts/probeJmaReliability.mjs
 */
const ORIGIN = 'https://dfcfr909-bit.github.io';
const TIMEOUT = 20000;

/* 山域のある県をいくつか。⚠ **コードが正しいかも含めて確かめる**ので、
   外れたら 404 が出るだけで害はない。 */
const OFFICES = [
  ['長野県', '200000'],   // 北アルプス・八ヶ岳
  ['新潟県', '150000'],   // 越後・妙高
  ['北海道（石狩）', '016000'],
];

async function get(label, url) {
  console.log(`\n── ${label}`);
  console.log(`   ${url}`);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT), headers: { Origin: ORIGIN } });
    console.log(`   HTTP ${res.status} / CORS: ${res.headers.get('access-control-allow-origin') || '(無し)'}`);
    if (!res.ok) return null;
    const text = await res.text();
    console.log(`   長さ: ${text.length} バイト`);
    try { return JSON.parse(text); }
    catch (e) { console.log(`   ✗ JSONとして読めない: ${e.message}`); return null; }
  } catch (e) {
    console.log(`   ✗ 取得できない: ${e.message}`);
    return null;
  }
}

/* 入れ子をたどって「信頼度らしきもの」を探す。**キー名を決め打たない。** */
function findReliability(node, path = '', hits = []) {
  if (node && typeof node === 'object') {
    for (const k of Object.keys(node)) {
      const p = path ? `${path}.${k}` : k;
      if (/reliab|信頼/i.test(k)) hits.push({ path: p, value: node[k] });
      findReliability(node[k], p, hits);
    }
  }
  return hits;
}

console.log('気象庁の週間予報「信頼度」を調べます');

/* 1) 予報区の一覧。**どの単位で信頼度が出るのか**を知るのに要る */
const area = await get('予報区の一覧', 'https://www.jma.go.jp/bosai/common/const/area.json');
if (area) {
  console.log(`   トップのキー: ${Object.keys(area).join(', ')}`);
  for (const k of Object.keys(area)) {
    const n = Object.keys(area[k] || {}).length;
    const first = Object.entries(area[k] || {})[0];
    console.log(`   ${k}: ${n}件  例) ${first ? `${first[0]} = ${JSON.stringify(first[1]).slice(0, 120)}` : '-'}`);
  }
}

/* 2) 府県ごとの予報。信頼度がどこに入っているかを探す */
for (const [name, code] of OFFICES) {
  const j = await get(`週間予報 ${name}(${code})`,
    `https://www.jma.go.jp/bosai/forecast/data/forecast/${code}.json`);
  if (!j) continue;
  console.log(`   形: ${Array.isArray(j) ? `配列${j.length}件` : 'オブジェクト'}`);
  if (Array.isArray(j)) {
    j.forEach((part, i) => {
      const ts = (part.timeSeries || []).map(t => (t.areas && t.areas[0] ? Object.keys(t.areas[0]) : []).join('/'));
      console.log(`   [${i}] publishingOffice=${part.publishingOffice || '-'} reportDatetime=${part.reportDatetime || '-'}`);
      console.log(`       timeSeries の中身: ${ts.join(' | ') || '(無し)'}`);
    });
  }
  const hits = findReliability(j);
  console.log(`   ★信頼度らしきもの: ${hits.length}件`);
  for (const h of hits.slice(0, 4)) {
    console.log(`      ${h.path} = ${JSON.stringify(h.value).slice(0, 200)}`);
  }
  /* 週間予報の日付も出す（信頼度が何日先のぶんに付くのかを見る） */
  if (Array.isArray(j) && j[1] && j[1].timeSeries && j[1].timeSeries[0]) {
    console.log(`   週間の日付: ${JSON.stringify(j[1].timeSeries[0].timeDefines || []).slice(0, 260)}`);
  }
}

console.log(`
⚠ 読み方
  - 信頼度が**どの単位（府県／細分区域）**に付くのかを見る。
    山の地点ごとには出ない可能性が高く、その場合は
    **山域→予報区の対応づけ**が別途要る（areas.json に持たせるなど）
  - **何日先のぶんに付くのか**も見る（週間予報は3〜7日先）
  - CORS が通れば、ブラウザから直接引ける`);
