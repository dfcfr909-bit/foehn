/* 山頂への吸着ルール（scripts/snapPeaks.mjs）の検査。
 *
 * ⚠ **いちばん危ないのは「隣の別の山に吸着する」こと。**
 *   笠ヶ岳(2,898m)の近くには槍ヶ岳(3,180m)や穂高(3,190m)がある。
 *   「探索範囲の最高点」を採ると隣の山へ飛び、しかも**それらしい値なので気づけない**。
 *   だから elev を識別子にして「一致する点のうち最も近いもの」を採る。
 *   ここではその区別が本当に効いているかを、合成の地形で確かめる。
 *
 * ⚠ **二番目に危ないのは「稜線の肩を掴む」こと。**
 *   広い山頂部では公称標高±MATCH の点が帯状に並ぶので、「一致する点のうち
 *   最も近いもの」は山頂を通り過ぎて手前の肩に当たりうる。吸着先の周囲に
 *   もっと高い点があれば峰ではない、という検査（⚠稜線？）が効くかを見る。
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

/* 合成地形を組む。features は { lat, lon, h, r } の並びで、
   半径 r m 以内をその標高で塗る（後ろのものが優先）。地の標高は ground。 */
function tileBuilder(features, ground) {
  return `
function build(tx, ty) {
  const n = Math.pow(2, ${DEM_Z});
  const rows = [];
  for (let py = 0; py < 256; py++) {
    const yf = ty + (py + 0.5) / 256;
    const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * yf / n))) * 180 / Math.PI;
    const row = [];
    for (let px = 0; px < 256; px++) {
      const xf = tx + (px + 0.5) / 256;
      const lon = xf / n * 360 - 180;
      let h = ${ground};
      for (const s of ${JSON.stringify(features)}) {
        const dLat = (lat - s.lat) * 111000;
        const dLon = (lon - s.lon) * 111000 * Math.cos(lat * Math.PI / 180);
        if (Math.hypot(dLat, dLon) < s.r) h = s.h;
      }
      row.push(h);
    }
    rows.push(row.join(','));
  }
  return rows.join('\\n');
}`;
}

/* fetch をスタブして合成タイルを返す小さなローダを噛ませる。
   スクリプト本体は書き換えず、--experimental-loader も使わない。
   代わりに「fetch を差し替えてから本体を import する」薄いラッパを作る。 */
function runSnap({ peaks, features, ground, args = [] }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'snap-'));
  const areasPath = path.join(tmp, 'areas.json');
  fs.writeFileSync(areasPath, JSON.stringify({
    version: 99, note: 'テスト用',
    areas: [{ id: 'test', name: 'テスト山域', region: '中部', peaks }],
  }, null, 2));

  fs.writeFileSync(path.join(tmp, 'tiles.mjs'), `
export async function fakeFetch(url) {
  const m = String(url).match(/\\/dem\\/(\\d+)\\/(\\d+)\\/(\\d+)\\.txt/);
  if (!m) return { ok: false, status: 404, text: async () => '' };
  const body = build(Number(m[2]), Number(m[3]));
  return { ok: true, status: 200, text: async () => body };
}
${tileBuilder(features, ground)}
`);
  fs.writeFileSync(path.join(tmp, 'run.mjs'), `
const mod = await import(${JSON.stringify(pathToFileURL(path.join(tmp, 'tiles.mjs')).href)});
globalThis.fetch = mod.fakeFetch;
await import(${JSON.stringify(pathToFileURL(path.join(ROOT, 'scripts', 'snapPeaks.mjs')).href)});
`);

  let out = '';
  try {
    out = execFileSync('node', [path.join(tmp, 'run.mjs'), ...args], {
      encoding: 'utf8',
      env: { ...process.env, SNAP_AREAS: areasPath },
    });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
    fails.push('スクリプトが異常終了した: ' + (e.stderr || '').slice(0, 300));
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
}

/* --- 場面1: 隣の高い峰へ飛ばないこと ---
   本物 : 2,898m を (36.3050, 137.5530) に置く … これを当ててほしい
   囮   : 3,180m を元の座標の約3km東に置く … 「最高点」を採ると飛ぶ先
   地の標高は 1,600m。元の座標は本物から約2.3km離した所にしておく。 */
const TRUE_SUMMIT = { lat: 36.3050, lon: 137.5530, h: 2898 };
// ⚠ 囮は**探索半径の内側**に置くこと。外に置くと判別を一度も試さないまま通る
//   （最初にそう書いて、わざと「最高点」に変えても素通りした）。元の座標から約3km東。
const DECOY_PEAK = { lat: 36.2850, lon: 137.5890, h: 3180 };

const out1 = runSnap({
  ground: 1600,
  features: [{ ...TRUE_SUMMIT, r: 60 }, { ...DECOY_PEAK, r: 60 }],
  // 本物から約2.3km ずらした座標を持たせる（＝直すべき状態）
  peaks: [{ name: '笠ヶ岳', lat: 36.2842, lon: 137.5556, elev: 2898, hyakumeizan: true }],
});
console.log(out1);

const line1 = out1.split('\n').find(l => l.includes('笠ヶ岳') && l.includes('→'));
ok(!!line1, '修正案が出る', out1.slice(0, 400));
if (line1) {
  const m = line1.match(/→\s*([\d.]+),([\d.]+)\s+(\d+)m/);
  ok(!!m, '修正案の形が読める', line1);
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
  ok(!line1.includes('稜線'), '単独の峰に「稜線？」は付かない', line1);
}

/* --- 場面2: 稜線の肩を掴んだら印を付けること ---
   公称 2,000m の峰。元の座標の側に 2,000m の肩を張り出させ、
   その 300m 先に本当の高み 2,040m を置く。
   「elev に一致する最も近い点」は肩に当たるので、⚠稜線？ が出てほしい。 */
const SHOULDER = { lat: 36.5000, lon: 137.5000, h: 2000, r: 80 };
const REAL_TOP = { lat: 36.5027, lon: 137.5000, h: 2040, r: 80 };   // 肩の約300m北

const out2 = runSnap({
  ground: 1500,
  features: [SHOULDER, REAL_TOP],
  peaks: [{ name: '肩ヶ岳', lat: 36.4900, lon: 137.5000, elev: 2000, hyakumeizan: true }],
});
console.log(out2);

const line2 = out2.split('\n').find(l => l.includes('肩ヶ岳') && l.includes('→'));
ok(!!line2, '場面2でも修正案が出る', out2.slice(0, 400));
if (line2) {
  ok(line2.includes('稜線'), '★★★肩を掴んだら「稜線？」が付く（0.5km以内に高い点がある）', line2);
  ok(/2040m/.test(line2), '近傍の最高点の標高を併記する', line2);
  // 形は崩さない。ここが崩れると場面1の読み取りも壊れる
  ok(/→\s*[\d.]+,[\d.]+\s+\d+m/.test(line2), '「稜線？」が付いても修正案の形は読める', line2);
}
ok(/「稜線？」が付いた 1件/.test(out2), '稜線の件数をまとめて出す', out2.slice(-500));

/* --- 場面3: --write は「稜線？」を書き込まない --- */
const out3 = runSnap({
  ground: 1500,
  features: [SHOULDER, REAL_TOP],
  peaks: [{ name: '肩ヶ岳', lat: 36.4900, lon: 137.5000, elev: 2000, hyakumeizan: true }],
  args: ['--write'],
});
ok(/書き込みから外しました/.test(out3), '★--write は疑わしい吸着先を書かない', out3.slice(-400));
ok(!/areas.json の [1-9]件を書き換え/.test(out3), '疑わしいものだけのときは1件も書かない',
  out3.slice(-400));

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SNAP SMOKE FAILED');
  process.exit(1);
}
console.log('SNAP SMOKE PASSED');
