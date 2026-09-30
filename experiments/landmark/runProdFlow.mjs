// 現行方式の尾根・沢を「本番の JS の原文そのまま」で求める（新規・実験専用）。
// sotoki_v4.html から FLOW 定数・terrainFindCols・terrainFlow・線にする一式（terrainVectorize など）を
// 文字列で抜き出し、手元の DEM 格子（export_dem_grids.py の出力）に対して node で実行する。本番コードは書き換えない。
//   差し替えたもの: G.toLL（座標は Python 側で復元）、G.inner（全域を採る）
//   稜線のつなぎ（BRIDGE_*）は 2 通り回す: bridge=有（鞍部 cols を渡す・本番と同じ）／無（cols を空にして渡す）
//   ⚠ 本番の格子は地理院 z12 タイルを平均した約30m。ここでは窓の30m・10m の DEM をそのまま格子に使う
// 使い方: node runProdFlow.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', '..', 'sotoki_v4.html'), 'utf8');

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
const flowConstText = between('const FLOW = {', 'function terrainFlow(G, cols) {');       // FLOW と RIDGE_SRC
const bearingText = between('const bearingOf = ', '\n') + '\n';
const flowText = between('function terrainFlow(G, cols) {', '// 鞍部が稜線の上か');
const vecText = between('const VEC = {', '// Catmull–Rom');                              // VEC・細線化・辺・ヒゲ・ならし・terrainVectorize

const makeOrder = new Function('h', 'N', `${orderText}\n return order;`);
const api = new Function('performance', `${colText}\n${findColsText}\n${flowConstText}\n${bearingText}\n${flowText}\n${vecText}\n return { terrainFindCols, terrainFlow, terrainVectorize, COL, FLOW, VEC };`)(performance);

const r3 = a => a.map(v => Math.round(v * 1000) / 1000);
const dir = path.join(here, 'out', 'prodcols');
for (const mf of fs.readdirSync(dir).filter(f => f.endsWith('.meta.json'))) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, mf), 'utf8'));
  const base = mf.replace('.meta.json', '');
  const buf = fs.readFileSync(path.join(dir, base + '.f32'));
  const h = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  const { nx, ny, cell } = meta, N = nx * ny;
  const G = { nx, ny, N, h, order: makeOrder(h, N), cell, inner: { x0: -1e9, y0: -1e9, x1: 1e9, y1: 1e9 }, toLL: () => ({ lat: 0, lng: 0 }) };
  const { cols } = api.terrainFindCols(G);
  const res = { meta, flow: {} };
  for (const bridge of [true, false]) {
    const t0 = performance.now();
    const F = api.terrainFlow(G, bridge ? cols : []);
    const t1 = performance.now();
    const V = api.terrainVectorize(G, F);
    res.flow[bridge ? 'bridge' : 'nobridge'] = {
      bridged: F.bridged, bridgeFail: F.bridgeFail, nRidgeCells: F.ridge.reduce((a, b) => a + b, 0), nRidgeComp: F.nRidge,
      nChanCells: F.chan.reduce((a, b) => a + b, 0), nFlat: F.nFlat, msFlow: t1 - t0, msVec: performance.now() - t1,
      ridges: V.ridges.map(r => ({ x: r3(r.x), y: r3(r.y), relief: r.relief, bridge: r.bridge })),
      valleys: V.valleys.map(v => ({ x: r3(v.x), y: r3(v.y), sca: v.sca })),
    };
    if (bridge) fs.writeFileSync(path.join(dir, base + '.flat.u8'), Buffer.from(F.flat.buffer, F.flat.byteOffset, F.flat.byteLength));
  }
  /* 長さ合わせ用の「密な」版：本番と同じコードで、閾値の定数だけを下げる（沢が始まる条件・稜線の沢筋からの高さ・描く最小の格）。
     LANDMARK の階層（hso>=5 など）と全長をそろえるとき、線を比集水面積（沢）／沢筋からの高さ（稜線）の大きい順に切って使う。
     ⚠ 本番の既定の網は LANDMARK の階層より疎で、既定のままでは全長が合わないため。定数は実行の間だけ書き換えて元に戻す */
  const keep = { s: api.FLOW.VALLEY_SCA_M, p: api.FLOW.VALLEY_POWER, h: api.FLOW.RIDGE_HAND_M, vs: api.VEC.VALLEY_MIN_SCA, vr: api.VEC.RIDGE_MIN_RELIEF };
  api.FLOW.VALLEY_SCA_M = 600; api.FLOW.VALLEY_POWER = 0; api.FLOW.RIDGE_HAND_M = 5; api.VEC.VALLEY_MIN_SCA = 600; api.VEC.RIDGE_MIN_RELIEF = 5;
  {
    const F = api.terrainFlow(G, cols), V = api.terrainVectorize(G, F);
    res.flow.dense = { bridged: F.bridged, bridgeFail: F.bridgeFail, nFlat: F.nFlat,
      ridges: V.ridges.map(r => ({ x: r3(r.x), y: r3(r.y), relief: r.relief, bridge: r.bridge })),
      valleys: V.valleys.map(v => ({ x: r3(v.x), y: r3(v.y), sca: v.sca })) };
  }
  api.FLOW.VALLEY_SCA_M = keep.s; api.FLOW.VALLEY_POWER = keep.p; api.FLOW.RIDGE_HAND_M = keep.h; api.VEC.VALLEY_MIN_SCA = keep.vs; api.VEC.RIDGE_MIN_RELIEF = keep.vr;
  fs.writeFileSync(path.join(dir, base + '.flow.json'), JSON.stringify(res));
  const b = res.flow.bridge, n = res.flow.nobridge;
  const len = L => L.reduce((s, l) => { let t = 0; for (let i = 1; i < l.x.length; i++) t += Math.hypot(l.x[i] - l.x[i - 1], l.y[i] - l.y[i - 1]); return s + t * cell; }, 0) / 1000;
  console.log(`${base}: 稜線 ${b.ridges.length}本 ${len(b.ridges).toFixed(1)}km（つなぎ無し ${n.ridges.length}本 ${len(n.ridges).toFixed(1)}km・つないだ鞍部 ${b.bridged}／失敗 ${b.bridgeFail}）・沢 ${b.valleys.length}本 ${len(b.valleys).toFixed(1)}km・密な版 稜線${len(res.flow.dense.ridges).toFixed(0) && ''}${len(res.flow.dense.ridges).toFixed(1)}km／沢${len(res.flow.dense.valleys).toFixed(1)}km・平坦 ${b.nFlat}升目・${(b.msFlow + b.msVec).toFixed(0)}ms`);
}
