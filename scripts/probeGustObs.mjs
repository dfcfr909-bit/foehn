/* 高標高のアメダスから「突風率（最大瞬間風速 ÷ 平均風速）」を実測できるかを調べる。
 *
 * なぜ要るか:
 *   モデルの10m突風は山頂の突風ではない（docs/decisions.md 2026-10-01）。
 *   山頂の風に掛ける突風率を、観測から決めたい。その前に
 *   ①標高の高い局が何局あるか ②観測値に最大瞬間風速の項目があるか
 *   ③過去の履歴を引けるか、を確かめる。
 *   ⚠ **開発環境から気象庁へ到達できない**（プロキシ403）ので Actions から叩く。
 *
 * ⚠ **キー名を推測で断定しない。** 返ってきた中身から読む。
 *
 * 使い方: node scripts/probeGustObs.mjs
 */
const BASE = 'https://www.jma.go.jp/bosai/amedas';
const TIMEOUT = 30000;

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}
async function getText(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}
const deg = ([d, m]) => d + m / 60;
const pad = n => String(n).padStart(2, '0');

console.log('高標高アメダスの突風率が実測できるかを調べます');

/* ---- ① 局の一覧と標高 ---- */
const table = await getJson(`${BASE}/const/amedastable.json`);
const all = Object.entries(table).map(([code, s]) => ({
  code, name: s.kjName, elev: s.elevation, lat: deg(s.lat), lon: deg(s.lon), type: s.type,
}));
console.log(`\n── ① 局の数: ${all.length}`);
for (const th of [500, 1000, 1500, 2000]) {
  console.log(`   標高 ${th}m 以上: ${all.filter(s => s.elev >= th).length} 局`);
}
const high = all.filter(s => s.elev >= 1000).sort((a, b) => b.elev - a.elev);
console.log('\n   標高 1000m 以上の局（標高の高い順）:');
for (const s of high) {
  console.log(`   ${s.code}  ${String(s.elev).padStart(5)}m  ${s.name}  (${s.lat.toFixed(3)}, ${s.lon.toFixed(3)})  type=${s.type}`);
}

/* ---- ② 観測値の項目 ---- */
const latest = (await getText(`${BASE}/data/latest_time.txt`)).trim();
console.log(`\n── ② 最新時刻: ${latest}`);
// latest_time は +09:00 付き。JST の壁時計のまま取り出す（Date を経由しない）
const m = latest.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
if (!m) throw new Error('latest_time を解釈できない: ' + latest);
const jstStamp = m.slice(1, 7).join('');
const mapJson = await getJson(`${BASE}/data/map/${jstStamp}.json`).catch(e => { console.log('   ✗ ' + e.message); return null; });
if (mapJson) {
  const keys = new Set();
  for (const v of Object.values(mapJson)) Object.keys(v).forEach(k => keys.add(k));
  console.log(`   map の項目（全局の和集合）: ${[...keys].join(', ')}`);
  console.log(`   突風らしい項目: ${[...keys].filter(k => /gust|max|瞬間/i.test(k)).join(', ') || '(無し)'}`);
  const sample = high[0] && mapJson[high[0].code];
  console.log(`   ${high[0] ? high[0].name : '-'} の例: ${JSON.stringify(sample)}`);
}

/* ---- ③ 1局ぶんの履歴（点データ） ---- */
const target = high.find(s => mapJson && mapJson[s.code]) || high[0];
if (target) {
  console.log(`\n── ③ 履歴: ${target.name}（${target.code}）`);
  // 点データは 3 時間ごとのファイル。最新時刻を含むファイルを引く
  const h3 = Math.floor(Number(m[4]) / 3) * 3;
  const ptUrl = `${BASE}/data/point/${target.code}/${m[1] + m[2] + m[3]}_${pad(h3)}.json`;
  console.log(`   ${ptUrl}`);
  const pt = await getJson(ptUrl).catch(e => { console.log('   ✗ ' + e.message); return null; });
  if (pt) {
    const times = Object.keys(pt);
    console.log(`   時刻の数: ${times.length}（先頭 ${times[0]}、末尾 ${times[times.length - 1]}）`);
    const keys = new Set();
    for (const v of Object.values(pt)) Object.keys(v).forEach(k => keys.add(k));
    console.log(`   項目: ${[...keys].join(', ')}`);
    console.log(`   突風らしい項目: ${[...keys].filter(k => /gust|max|瞬間/i.test(k)).join(', ') || '(無し)'}`);
    console.log(`   例: ${JSON.stringify(pt[times[times.length - 1]])}`);
  }
  // 何日前まで遡れるか（1日ずつ試す）
  const ok = [];
  for (const back of [1, 3, 7, 14, 30]) {
    const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]) - back));
    const u = `${BASE}/data/point/${target.code}/${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}_12.json`;
    const r = await fetch(u, { signal: AbortSignal.timeout(TIMEOUT) }).then(x => x.status).catch(() => 'ERR');
    ok.push(`${back}日前: ${r}`);
  }
  console.log(`   遡り: ${ok.join(' / ')}`);
}
console.log('\n完了');
