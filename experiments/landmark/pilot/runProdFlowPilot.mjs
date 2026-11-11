// 試作（栃木北部）：比較用に、現行の terrainFlow の尾根を同じ範囲で求める（新規・実験専用）。
// sotoki_v4.html から COL・terrainFindCols・FLOW・terrainFlow・VEC と線にする一式を「原文のまま」文字列で抜き出して node で実行する
// （../runProdFlow.mjs と同じ流儀。本番コードは書き換えない）。
//   入力：pilot/out/prod_grid.f32 と .meta.json（export_prod_grid.py の出力。マスター DEM の「全タイルの芯＋3km」の範囲）
//   ⚠ 本番は「画面＋3km」ごとに z12 を最大25万升目で解析する。ここでは範囲全体（約540万升目）を1回で解析した。
//      本番の画面ごとの結果とは、範囲の端・升目の粗さが違う。
//   出力：pilot/out/prod_ridges.json（升目の添字の座標。稜線は本番と同じ条件＝沢筋からの高さ40m以上・ヒゲ刈り済み）
// 使い方（experiments/landmark で）: node pilot/runProdFlowPilot.mjs
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
const api = new Function('performance', `${colText}\n${findColsText}\n${flowConstText}\n${bearingText}\n${flowText}\n${vecText}\n return { terrainFindCols, terrainFlow, terrainVectorize };`)(performance);

const out = path.join(here, 'out');
const meta = JSON.parse(fs.readFileSync(path.join(out, 'prod_grid.meta.json'), 'utf8'));
const buf = fs.readFileSync(path.join(out, 'prod_grid.f32'));
const h = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
const { nx, ny, cell } = meta, N = nx * ny;
const t0 = performance.now();
const G = { nx, ny, N, h, order: makeOrder(h, N), cell, inner: { x0: -1e9, y0: -1e9, x1: 1e9, y1: 1e9 }, toLL: () => ({ lat: 0, lng: 0 }) };
const { cols } = api.terrainFindCols(G);
const t1 = performance.now();
const F = api.terrainFlow(G, cols);
const t2 = performance.now();
const V = api.terrainVectorize(G, F);
const t3 = performance.now();
const r3 = a => a.map(v => Math.round(v * 1000) / 1000);
fs.writeFileSync(path.join(out, 'prod_ridges.json'), JSON.stringify({
  meta, ms: { cols: t1 - t0, flow: t2 - t1, vec: t3 - t2 }, nCols: cols.length, bridged: F.bridged, bridgeFail: F.bridgeFail,
  ridges: V.ridges.map(r => ({ x: r3(r.x), y: r3(r.y), relief: r.relief, bridge: r.bridge })),
}));
console.log(`升目 ${nx}×${ny}（${(N / 1e6).toFixed(2)}M）・鞍部 ${cols.length}・つないだ鞍部 ${F.bridged}／失敗 ${F.bridgeFail}・稜線 ${V.ridges.length}本・` +
  `時間 鞍部 ${(t1 - t0).toFixed(0)}ms 尾根沢 ${(t2 - t1).toFixed(0)}ms 線 ${(t3 - t2).toFixed(0)}ms`);
