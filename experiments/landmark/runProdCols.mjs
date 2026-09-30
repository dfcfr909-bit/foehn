// 現行方式の col を「本番の JS の原文そのまま」で求める（新規・実験専用）。
// sotoki_v4.html から COL 定数・terrainFindCols・terrainDemGrid の「高い順の並び」の部分を文字列で抜き出し、
// 手元の DEM 格子（export_dem_grids.py の出力）に対して node で実行する。本番コードは書き換えない。
//   差し替えたもの: G.toLL（地図が要るので座標は Python 側で c から復元）、G.inner（全域を採る）
//   ⚠ 本番の格子は地理院 z12 タイルを平均した約30m。ここでは窓の30m・10m の DEM をそのまま格子に使う
// 使い方: node runProdCols.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = fs.readFileSync(path.join(here, '..', '..', 'sotoki_v4.html'), 'utf8');

function between(startMark, endMark, from = 0) {
  const a = src.indexOf(startMark, from);
  if (a < 0) throw new Error('見つからない: ' + startMark);
  const b = src.indexOf(endMark, a);
  if (b < 0) throw new Error('終わりが見つからない: ' + endMark);
  return src.slice(a, b);
}
const colText = between('const COL = {', '\n};') + '\n};';
const fnText = between('function terrainFindCols(G) {', '\n/* ------ 尾根・沢：水の流れ');
const orderText = between('  let nv = 0, hMin = Infinity', '  // 鞍部を採る範囲');   // 高い順の並び（0.1m刻みの数え上げ）

const makeOrder = new Function('h', 'N', `${orderText}\n return order;`);
const findCols = new Function('performance', `${colText}\n${fnText}\n return { terrainFindCols, COL };`)(performance);

const dir = path.join(here, 'out', 'prodcols');
const metas = fs.readdirSync(dir).filter(f => f.endsWith('.meta.json'));
for (const mf of metas) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, mf), 'utf8'));
  const buf = fs.readFileSync(path.join(dir, mf.replace('.meta.json', '.f32')));
  const h = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  const { nx, ny, cell } = meta, N = nx * ny;
  const order = makeOrder(h, N);
  const G = { nx, ny, N, h, order, cell,
    inner: { x0: -1e9, y0: -1e9, x1: 1e9, y1: 1e9 },
    toLL: () => ({ lat: 0, lng: 0 }) };
  const t0 = performance.now();
  const { cols } = findCols.terrainFindCols(G);
  const out = cols.map(c => ({ c: c.cell, prom: c.prom, h: c.h, edge: c.edge }));
  fs.writeFileSync(path.join(dir, mf.replace('.meta.json', '.cols.json')), JSON.stringify({ meta, floor: findCols.COL.FLOOR_M, maxKeep: findCols.COL.MAX_KEEP, n: out.length, cols: out }));
  console.log(`${meta.name} ${meta.res}: 有効${order.length}/${N}升目・col ${out.length}件（床${findCols.COL.FLOOR_M}m・上限${findCols.COL.MAX_KEEP}）${(performance.now() - t0).toFixed(0)}ms`);
}
