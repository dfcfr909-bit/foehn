/* 新雪ランキングの地点を作るスクリプト（scripts/buildSpots.mjs）の純粋関数の検査（#8）。
 *
 * ⚠ 通信はしない。実際の生成は GitHub Actions「新雪ランキングの地点を作る」で回す
 *   （開発環境からは Overpass・国土地理院に届かない）。
 * ⚠ 見ているのは 2026-11-12 の初回実行で踏んだ所：
 *     - 候補を上限で切ったことが分からず、最上部が漏れても気づけなかった
 *     - どの索道を拾ったかがログから分からず、隣のスキー場の索道を拾っても見分けられなかった
 *     - Overpass の「200 だが時間切れ」を「索道データなし」と取り違えうる
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  extractNamedCandidates, extractCandidates, topCandidates, pickHighest,
  checkOverpass, overpassRetryWaitMs, validateSeed, auditSpots,
} from '../scripts/buildSpots.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };
const throws = fn => { try { fn(); return false; } catch (e) { return true; } };

/* --- 場面1: 候補点に索道の名前が付く・同じ点はまとめる --- */
const OVERPASS = { elements: [
  { type: 'node', lat: 36.95421, lon: 138.83829, tags: { name: '山頂駅' } },
  { type: 'way', tags: { name: '第1リフト' }, geometry: [{ lat: 36.9, lon: 138.8 }, { lat: 36.91, lon: 138.81 }, { lat: 36.95421, lon: 138.83829 }] },
  { type: 'way', tags: {}, geometry: [{ lat: 36.9, lon: 138.8 }, { lat: 36.92, lon: 138.82 }] },
  { type: 'way', geometry: [] },
  { type: 'node', lat: 'x', lon: 1 },
] };
const named = extractNamedCandidates(OVERPASS);
ok(named.total === 3 && named.points.length === 3, '候補は3点（線は両端だけ・同じ点はまとめる・壊れた要素は捨てる）', named);
ok(JSON.stringify(named.points[0]) === JSON.stringify({ lat: 36.9542, lon: 138.8383, names: ['山頂駅', '第1リフト'] }),
  '★駅と線の端が同じ点なら、名前を両方持つ', named.points[0]);
ok(named.points[2].names.length === 0, '名前の無い索道は空のまま（落とさない）', named.points[2]);
ok(JSON.stringify(extractCandidates(OVERPASS)) === JSON.stringify([[36.9542, 138.8383], [36.9, 138.8], [36.92, 138.82]]),
  '従来の形（[lat, lon] の並び）も同じ順で返す', extractCandidates(OVERPASS));

/* --- 場面2: 上限で切ったことが分かる --- */
const cut = extractNamedCandidates(OVERPASS, 2);
ok(cut.points.length === 2 && cut.total === 3, '★★上限で切っても、切る前の数が分かる', cut);
const many = { elements: Array.from({ length: 450 }, (_, i) => ({ type: 'node', lat: 36 + i * 0.001, lon: 138 })) };
const def = extractNamedCandidates(many);
ok(def.total === 450 && def.points.length === 200, '既定の上限は200点', { total: def.total, n: def.points.length });

/* --- 場面3: 標高の上位と最上部が、同じ添字で結ばれている --- */
const elev = [985, 700, null];
const top = topCandidates(named.points, elev);
ok(top.length === 2 && top[0].elevation === 985 && top[0].names[0] === '山頂駅' && top[1].elevation === 700,
  '★上位は標高の高い順・標高の取れなかった点は入れない', top);
const best = pickHighest(extractCandidates(OVERPASS), elev);
ok(best && best.lat === top[0].lat && best.lon === top[0].lon && best.elevation === top[0].elevation,
  '★★採用する最上部と、ログに出す1位が同じ点', { best, top: top[0] });
ok(topCandidates(named.points, [1, 2, 3], 1).length === 1, '件数を指定できる');

/* --- 場面4: Overpass の「200 だが時間切れ」を成功にしない --- */
ok(throws(() => checkOverpass({ elements: [], remark: 'runtime error: Query timed out in "query" at line 3 after 91 seconds.' })),
  '★★時間切れの remark は失敗（索道データなしと取り違えない）');
ok(throws(() => checkOverpass(null)) && throws(() => checkOverpass({})), '形の違う応答は失敗');
ok(!throws(() => checkOverpass({ elements: [] })), '本当に空（remark なし）は成功のまま（＝索道データなし）');
ok(checkOverpass(OVERPASS) === OVERPASS, '正常な応答はそのまま返す');

/* --- 場面5: 再試行の待ち --- */
ok(overpassRetryWaitMs(502, 0) === 20000 && overpassRetryWaitMs(429, 2) === 60000, '混雑（429・502・503・504）は20秒×回数');
ok(overpassRetryWaitMs(0, 0) === 5000 && overpassRetryWaitMs(400, 1) === 10000, 'ほかは5秒×回数');

/* --- 場面6: 種が読めること・BC の峰が areas.json の座標と揃っていること ---
   ⚠ 初回は西吾妻山が約10km・平標山が約3kmずれていた。areas.json にある峰は、そちらが正。 */
const seed = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'spots.seed.json'), 'utf8'));
ok(validateSeed(seed).length === 0, '種に問題が無い', validateSeed(seed));
const peaks = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8')).areas.flatMap(a => a.peaks);
const SAME = { 'hakkoda-odake': '八甲田大岳', 'zao-kumano': '熊野岳', 'nishiazuma': '西吾妻山', 'tairappyo': '平標山', 'shibutsu': '至仏山', 'hiuchi': '燧ヶ岳' };
for (const [id, name] of Object.entries(SAME)) {
  const s = seed.spots.find(x => x.id === id);
  const p = peaks.find(x => x.name === name);
  ok(s && p, `種と areas.json の両方にある（${name}）`, { seed: !!s, areas: !!p });
  if (!s || !p) continue;
  ok(s.coord[0] === p.lat && s.coord[1] === p.lon, `★★種の座標が areas.json と同じ（${name}）`, { seed: s.coord, areas: [p.lat, p.lon] });
  ok(s.expectedAlt === p.elev, `想定標高も同じ（${name}）`, { seed: s.expectedAlt, areas: p.elev });
}

/* --- 場面7: 同じ点を拾った組は警告になる（初回の 神立＝岩原） --- */
const w = auditSpots([{ name: '甲', lat: 36.9542, lon: 138.8383 }, { name: '乙', lat: 36.9542, lon: 138.8383 }, { name: '丙', lat: 36.8, lon: 138.7 }]);
ok(w.length === 1 && /甲/.test(w[0]) && /乙/.test(w[0]), '同じ座標の組だけ警告', w);

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SPOTS SMOKE FAILED');
  process.exit(1);
}
console.log('SPOTS SMOKE PASSED');
