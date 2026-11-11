// 試作（栃木北部）：本番の terrainFlow が内部で求める「沢筋からの高さ（HAND）」を、升目ごとに書き出す（新規・実験専用）。
// sotoki_v4.html から原文のまま抜き出して node で実行する（runProdFlowPilot.mjs と同じ流儀。本番コードは書き換えない）。
//   HAND の定義（本番の terrainFlow のまま）：
//     沢筋 chan … 多方向流の比集水面積 ≧ FLOW.VALLEY_SCA_M（5,000m）かつ 比集水面積×勾配 ≧ FLOW.VALLEY_POWER（1,500）。平坦地（FLAT_*）は除く
//     HAND     … 最も急な下り（down）をたどって最初に着く沢筋の升目との標高差。平坦地は NaN
//   本番の VEC.RIDGE_MIN_RELIEF（40m）は、この HAND の「線（辺）の上の最大」が 40m 未満の稜線を描かない、という条件。
//   鞍部からのつなぎは HAND に関係しないので、cols は空で渡す。
//   入力：pilot/out/prod_grid.f32・.meta.json（export_prod_grid.py）
//   出力：pilot/out/prod_hand.f32（升目ごとの HAND・NaN あり）・prod_chan.u8（沢筋）・prod_flat.u8（平坦地）
//         ＋ 勾配の条件を外した版 prod_hand_sca.f32・prod_chan_sca.u8（下の注記）
// 使い方（experiments/landmark で）: node --max-old-space-size=8192 pilot/exportHand.mjs
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
const orderText = between('  let nv = 0, hMin = Infinity', '  // 鞍部を採る範囲');
const flowConstText = between('const FLOW = {', 'function terrainFlow(G, cols) {');
const bearingText = between('const bearingOf = ', '\n') + '\n';
const flowText = between('function terrainFlow(G, cols) {', '// 鞍部が稜線の上か');
const makeOrder = new Function('h', 'N', `${orderText}\n return order;`);
const api = new Function('performance', `${flowConstText}\n${bearingText}\n${flowText}\n return { terrainFlow, FLOW };`)(performance);

const out = path.join(here, 'out');
const meta = JSON.parse(fs.readFileSync(path.join(out, 'prod_grid.meta.json'), 'utf8'));
const buf = fs.readFileSync(path.join(out, 'prod_grid.f32'));
const h = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
const { nx, ny, cell } = meta, N = nx * ny;
const G = { nx, ny, N, h, order: makeOrder(h, N), cell };
/* 2通り：prod＝本番の定数のまま／sca＝沢筋の条件から「比集水面積×勾配≧VALLEY_POWER」だけを外す（VALLEY_POWER＝0。ほかは同じコード）。
   ⚠ 本番の条件だと、勾配の小さい扇状地・平野で沢筋ができず、HAND が NaN になるか、扇状地の傾斜ぶん（何km も下の沢筋まで）の高さになる */
const keep = api.FLOW.VALLEY_POWER;
for (const [tag, power] of [['prod', keep], ['sca', 0]]) {
  api.FLOW.VALLEY_POWER = power;
  const t0 = performance.now();
  const F = api.terrainFlow(G, []);
  const sfx = tag === 'prod' ? '' : '_sca';
  fs.writeFileSync(path.join(out, `prod_hand${sfx}.f32`), Buffer.from(F.hand.buffer, F.hand.byteOffset, F.hand.byteLength));
  fs.writeFileSync(path.join(out, `prod_chan${sfx}.u8`), Buffer.from(F.chan.buffer, F.chan.byteOffset, F.chan.byteLength));
  if (tag === 'prod') fs.writeFileSync(path.join(out, 'prod_flat.u8'), Buffer.from(F.flat.buffer, F.flat.byteOffset, F.flat.byteLength));
  let nc = 0, nn = 0; for (let n = 0; n < N; n++) { nc += F.chan[n]; if (F.hand[n] !== F.hand[n]) nn++; }
  console.log(`[${tag}] 升目 ${nx}×${ny}・沢筋 ${nc}升目・HAND が NaN ${nn}升目（${(nn / N * 100).toFixed(1)}%）・${(performance.now() - t0).toFixed(0)}ms（VALLEY_SCA_M ${api.FLOW.VALLEY_SCA_M}・VALLEY_POWER ${api.FLOW.VALLEY_POWER}）`);
}
api.FLOW.VALLEY_POWER = keep;
