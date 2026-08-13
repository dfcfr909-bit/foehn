/* areas.json の座標が本当に山頂を指しているかを機械的に洗い出す（#13）。
 *
 * やり方: 国土地理院の標高APIで「その座標の実際の標高」を引き、
 * areas.json の elev と突き合わせる。**食い違いが大きい＝座標が山頂から外れている**。
 *
 * なぜこれで分かるか:
 *   山頂は周囲より高いので、座標が数百mずれると読める標高がはっきり下がる。
 *   皇海山は座標が約490mずれていて、DEMが 1,390m を返していた（山頂は 2,144m）。
 *   標高そのものは信頼できる値なので、「elev と DEM の差」が座標ズレの指標になる。
 *
 * ⚠ なぜ座標ズレが効くのか（ただの見た目の問題ではない）:
 *   ABC評価の風速は山頂高度の気圧面から選ぶ（ADR-0006）。メテオグラムで
 *   標高をDEMから取る経路では、座標がずれると低い層を選び、**判定が甘くなる**。
 *   ランキングは areas.json の elev を直接使うので影響を受けない——
 *   つまり同じ山で両者の判定が食い違う。
 *
 * 使い方:
 *   node scripts/checkPeaks.mjs            # 全峰を検査
 *   node scripts/checkPeaks.mjs --tol 150  # 許容差(m)を変える。既定は200
 *
 * ⚠ **開発環境からは国土地理院に到達できないので、ここでは実行できない。**
 *   ネットワークに出られる環境で走らせること（#8 と同じ制約）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const GSI = 'https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php';
const SLEEP_MS = 250;        // 相手方に負荷をかけない間隔
const DEFAULT_TOL_M = 200;   // これを超える差を「要確認」とする

const argTol = process.argv.indexOf('--tol');
const TOL = argTol > -1 ? Number(process.argv[argTol + 1]) : DEFAULT_TOL_M;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function elevationAt(lat, lon) {
  const url = `${GSI}?lon=${lon}&lat=${lat}&outtype=JSON`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  // 圏外は "-----" が返る（0mではない。数値化しないこと）
  const v = json.elevation;
  return (typeof v === 'number' && isFinite(v)) ? v : null;
}

const areas = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));

console.log(`areas.json v${areas.version} … ${areas.areas.length}山域 / ${peaks.length}峰`);
console.log(`許容差 ${TOL}m を超えたものを「要確認」として並べます\n`);

const bad = [], failed = [];
for (let i = 0; i < peaks.length; i++) {
  const p = peaks[i];
  // 進捗は端末のときだけ上書き表示する（ログに流すと \r が溜まって読めなくなる）
  if (process.stdout.isTTY) process.stdout.write(`\r検査中 ${i + 1}/${peaks.length} … ${p.name}          `);
  let dem = null;
  try { dem = await elevationAt(p.lat, p.lon); }
  catch (e) { failed.push({ ...p, err: e.message }); await sleep(SLEEP_MS); continue; }
  if (dem == null) { failed.push({ ...p, err: '標高なし（圏外）' }); await sleep(SLEEP_MS); continue; }
  const diff = p.elev - dem;                       // 正なら「座標が山頂より低い所を指している」
  if (Math.abs(diff) > TOL) bad.push({ ...p, dem, diff });
  await sleep(SLEEP_MS);
}
if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(60) + '\r');

if (bad.length) {
  bad.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  console.log(`⚠ 要確認 ${bad.length}件（差の大きい順）\n`);
  console.log('  山域            峰            areas.json   実際     差');
  for (const b of bad) {
    console.log(`  ${b.area.padEnd(14)} ${b.name.padEnd(12)} ` +
      `${String(b.elev).padStart(6)}m ${String(Math.round(b.dem)).padStart(7)}m ` +
      `${(b.diff > 0 ? '+' : '') + Math.round(b.diff)}m   (${b.lat}, ${b.lon})`);
  }
  console.log('\n差が正（areas.jsonの方が高い）＝座標が山頂を外して斜面を指している疑い。');
  console.log('地理院地図で山頂の三角点を探し、areas.json の lat/lon を直すこと。');
  console.log('※ elev の方を下げて辻褄を合わせないこと。山頂の標高は正しい前提。');
} else {
  console.log(`✅ 全${peaks.length}峰が許容差 ${TOL}m 以内`);
}

if (failed.length) {
  console.log(`\n取得できなかったもの ${failed.length}件:`);
  for (const f of failed) console.log(`  ${f.area} / ${f.name} … ${f.err}`);
}
process.exit(bad.length ? 1 : 0);
