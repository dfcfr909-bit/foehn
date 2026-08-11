/* 山頂への吸着ルール（scripts/snapPeaks.mjs）の検査。
 *
 * ⚠ **いちばん危ないのは「隣の別の山に吸着する」こと。**
 *   笠ヶ岳(2,898m)の近くには槍ヶ岳(3,180m)や穂高(3,190m)がある。
 *   「探索範囲の最高点」を採ると隣の山へ飛び、しかも**それらしい値なので気づけない**。
 *   だから elev を識別子にして「一致する点のうち最も近いもの」を採る。
 *   ここではその区別が本当に効いているかを、合成の地形で確かめる。
 *
 * 通信はスタブする（開発環境から地理院に到達できないため）。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEM_Z = 14;
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };

/* --- 合成地形 ---
   本物 : 2,898m を (36.3050, 137.5530) に置く … これを当ててほしい
   囮   : 3,180m を元の座標の約3km東に置く … 「最高点」を採ると飛ぶ先
   地の標高は 1,600m。元の座標は本物から約2.3km離した所にしておく。 */
const TRUE_SUMMIT = { lat: 36.3050, lon: 137.5530, h: 2898 };
// ⚠ 囮は**探索半径の内側**に置くこと。外に置くと判別を一度も試さないまま通る
//   （最初にそう書いて、わざと「最高点」に変えても素通りした）。元の座標から約3km東。
const DECOY_PEAK  = { lat: 36.2850, lon: 137.5890, h: 3180 };
const GROUND = 1600;

function tileToLonLatGrid(tx, ty) {
  const n = Math.pow(2, DEM_Z);
  const rows = [];
  for (let py = 0; py < 256; py++) {
    const yf = ty + (py + 0.5) / 256;
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * yf / n))) * 180 / Math.PI;
    const row = [];
    for (let px = 0; px < 256; px++) {
      const xf = tx + (px + 0.5) / 256;
      const lon = xf / n * 360 - 180;
      // 各「山」を半径150m程度の点として置く（10mメッシュなので数画素ぶん）
      let h = GROUND;
      for (const s of [TRUE_SUMMIT, DECOY_PEAK]) {
        const dLat = (lat - s.lat) * 111000;
        const dLon = (lon - s.lon) * 111000 * Math.cos(lat * Math.PI / 180);
        if (Math.hypot(dLat, dLon) < 60) h = s.h;
      }
      row.push(h);
    }
    rows.push(row.join(','));
  }
  return rows.join('\n');
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'snap-'));
const areasPath = path.join(tmp, 'areas.json');
fs.writeFileSync(areasPath, JSON.stringify({
  version: 99, note: 'テスト用',
  areas: [{ id: 'test', name: 'テスト山域', region: '中部', peaks: [
    // 本物から約2.3km ずらした座標を持たせる（＝直すべき状態）
    { name: '笠ヶ岳', lat: 36.2842, lon: 137.5556, elev: 2898, hyakumeizan: true },
  ]}],
}, null, 2));

/* fetch をスタブして合成タイルを返す小さなローダを噛ませる。
   スクリプト本体は書き換えず、--experimental-loader も使わない。
   代わりに「fetch を差し替えてから本体を import する」薄いラッパを作る。 */
const wrapper = path.join(tmp, 'run.mjs');
fs.writeFileSync(wrapper, `
import { pathToFileURL } from 'node:url';
const mod = await import(${JSON.stringify(pathToFileURL(path.join(tmp, 'tiles.mjs')).href)});
globalThis.fetch = mod.fakeFetch;
await import(${JSON.stringify(pathToFileURL(path.join(ROOT, 'scripts', 'snapPeaks.mjs')).href)});
`);
fs.writeFileSync(path.join(tmp, 'tiles.mjs'), `
const grids = ${JSON.stringify({})};
export async function fakeFetch(url) {
  const m = String(url).match(/\\/dem\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.txt/);
  if (!m) return { ok: false, status: 404, text: async () => '' };
  const tx = Number(m[2]), ty = Number(m[3]);
  const body = build(tx, ty);
  return { ok: true, status: 200, text: async () => body };
}
${tileToLonLatGrid.toString().replace('function tileToLonLatGrid', 'function build')}
const DEM_Z = ${DEM_Z};
const TRUE_SUMMIT = ${JSON.stringify(TRUE_SUMMIT)};
const DECOY_PEAK = ${JSON.stringify(DECOY_PEAK)};
const GROUND = ${GROUND};
`);

let out = '';
try {
  out = execFileSync('node', [wrapper], {
    encoding: 'utf8',
    env: { ...process.env, SNAP_AREAS: areasPath },
  });
} catch (e) {
  out = (e.stdout || '') + (e.stderr || '');
  fails.push('スクリプトが異常終了した: ' + (e.stderr || '').slice(0, 300));
}

console.log(out);

// 本物の山頂に吸着し、囮には飛んでいないこと
const line = out.split('\n').find(l => l.includes('笠ヶ岳') && l.includes('→'));
ok(!!line, '修正案が出る', out.slice(0, 400));
if (line) {
  const m = line.match(/→\s*([\d.]+),([\d.]+)\s+(\d+)m/);
  ok(!!m, '修正案の形が読める', line);
  if (m) {
    const lat = Number(m[1]), lon = Number(m[2]), h = Number(m[3]);
    const dTrue = Math.hypot((lat - TRUE_SUMMIT.lat) * 111, (lon - TRUE_SUMMIT.lon) * 89);
    const dDecoy = Math.hypot((lat - DECOY_PEAK.lat) * 111, (lon - DECOY_PEAK.lon) * 89);
    ok(dTrue < 0.15, '★本物の山頂(2,898m)へ吸着する', { lat, lon, dTrueKm: +dTrue.toFixed(3) });
    // 囮に吸着していれば dDecoy はほぼ0になる。1km離れていれば「飛んでいない」と言える
    ok(dDecoy > 1, '★★隣の高い峰(3,180m)へ飛んでいない（最高点を採っていない）',
      { dDecoyKm: +dDecoy.toFixed(2) });
    ok(Math.abs(h - 2898) <= 15, '吸着先の標高が elev と一致する', h);
  }
}

fs.rmSync(tmp, { recursive: true, force: true });
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SNAP SMOKE FAILED');
  process.exit(1);
}
console.log('SNAP SMOKE PASSED');
