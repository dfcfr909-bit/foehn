// 試作（栃木北部）：現行 terrainFlow の鞍部の上限（COL.MAX_KEEP＝4,000・深い順）の影響を実測する（新規・実験専用）。
// runProdFlowPilot.mjs と同じく sotoki_v4.html から原文のまま抜き出して node で実行する（本番コードは書き換えない）。
// 同じ格子（pilot/out/prod_grid.f32）で、上限あり（本番どおり 4,000）と上限なし（MAX_KEEP＝Infinity）の2回を回し、次を記録する：
//   ・上限なしの鞍部の数（記録の床 COL.FLOOR_M＝3m 以上）・4,000 件目の鞍部の深さ・深さ 10m（FLOW.BRIDGE_COL_M）以上の鞍部の数
//   ・つないだ数／失敗の数・稜線の升目の数・線（terrainVectorize 後）の本数と長さ
//   長さは升目の添字の折れ線の長さ × 升目の幅（bbox で切る前）。bbox で切った長さは filter_trial.py で出す
// 出力：pilot/out/prod_ridges_cap.json・prod_ridges_nocap.json（線）と prod_cap_summary.json（数字）
// 使い方（experiments/landmark で）: node pilot/runProdFlowNoCap.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', '..', '..', 'sotoki_v4.html'), 'utf8');
function between(startMark, endMark) {
  const a = src.indexOf(startMark);
  if (a < 0) throw new Error('見つからない: ' + startMark);
  const b = src.indexOf(endMark, a);
  if (b < 0) throw new Error('終わりが見つからない: ' + endMark);
  return src.slice(a, b);
}
const colText = between('const COL = {', '\n};') + '\n};';
const orderText = between('  let nv = 0, hMin = Infinity', '  // 鞍部を採る範囲');
const findColsText = between('function terrainFindCols(G) {', '\n/* ------ 尾根・沢：水の流れ');
const flowConstText = between('const FLOW = {', 'function terrainFlow(G, cols) {');
const bearingText = between('const bearingOf = ', '\n') + '\n';
const flowText = between('function terrainFlow(G, cols) {', '// 鞍部が稜線の上か');
const vecText = between('const VEC = {', '// Catmull–Rom');
const makeOrder = new Function('h', 'N', `${orderText}\n return order;`);
const api = new Function('performance', `${colText}\n${findColsText}\n${flowConstText}\n${bearingText}\n${flowText}\n${vecText}\n return { terrainFindCols, terrainFlow, terrainVectorize, COL, FLOW };`)(performance);

const out = path.join(here, 'out');
const meta = JSON.parse(fs.readFileSync(path.join(out, 'prod_grid.meta.json'), 'utf8'));
const buf = fs.readFileSync(path.join(out, 'prod_grid.f32'));
const h = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
const { nx, ny, cell } = meta, N = nx * ny;
const G = { nx, ny, N, h, order: makeOrder(h, N), cell, inner: { x0: -1e9, y0: -1e9, x1: 1e9, y1: 1e9 }, toLL: () => ({ lat: 0, lng: 0 }) };
const r3 = a => a.map(v => Math.round(v * 1000) / 1000);
const lenKm = L => L.reduce((s, l) => { let t = 0; for (let i = 1; i < l.x.length; i++) t += Math.hypot(l.x[i] - l.x[i - 1], l.y[i] - l.y[i - 1]); return s + t * cell; }, 0) / 1000;

const keep0 = api.COL.MAX_KEEP;
const summary = { grid: { nx, ny, cell }, floorM: api.COL.FLOOR_M, bridgeColM: api.FLOW.BRIDGE_COL_M, maxKeepProd: keep0, runs: {} };
for (const [tag, maxKeep] of [['cap', keep0], ['nocap', Infinity]]) {
  api.COL.MAX_KEEP = maxKeep;
  const t0 = performance.now();
  const { cols } = api.terrainFindCols(G);   // 深い順（raw を prom の降順に並べてから切る）
  const F = api.terrainFlow(G, cols);
  const V = api.terrainVectorize(G, F);
  let ridgeCells = 0; for (let n = 0; n < N; n++) ridgeCells += F.ridge[n];
  const proms = cols.map(c => c.prom);
  const rec = {
    nCols: cols.length, nColsGe10: proms.filter(p => p >= api.FLOW.BRIDGE_COL_M).length,
    prom4000th: proms.length >= 4000 ? proms[3999] : null, promMin: proms.length ? proms[proms.length - 1] : null,
    bridged: F.bridged, bridgeFail: F.bridgeFail, ridgeCells, nRidgeLines: V.ridges.length, ridgeKm: lenKm(V.ridges),
    ms: performance.now() - t0,
  };
  summary.runs[tag] = rec;
  fs.writeFileSync(path.join(out, `prod_ridges_${tag}.json`), JSON.stringify({ meta, ridges: V.ridges.map(r => ({ x: r3(r.x), y: r3(r.y), relief: r.relief, bridge: r.bridge })) }));
  console.log(tag, JSON.stringify(rec));
}
api.COL.MAX_KEEP = keep0;
const c = summary.runs.cap, u = summary.runs.nocap;
summary.diff = { cols: u.nCols - c.nCols, bridged: u.bridged - c.bridged, ridgeCells: u.ridgeCells - c.ridgeCells, ridgeKm: u.ridgeKm - c.ridgeKm };
fs.writeFileSync(path.join(out, 'prod_cap_summary.json'), JSON.stringify(summary, null, 1));
console.log('差（上限なし − 上限あり）', JSON.stringify(summary.diff));
