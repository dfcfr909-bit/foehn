/* 山頂への吸着ルール（scripts/snapPeaks.mjs）の検査。
 *
 * ⚠ **いちばん危ないのは「隣の別の山に吸着する」こと。**
 *   笠ヶ岳(2,898m)の近くには槍ヶ岳(3,180m)や穂高(3,190m)がある。
 *   「探索範囲の最高点」を採ると隣の山へ飛び、しかも**それらしい値なので気づけない**。
 *   だから elev を識別子にして「一致する点のうち最も近いもの」を採る。
 *   ここではその区別が本当に効いているかを、合成の地形で確かめる。
 *
 * ⚠ **二番目に危ないのは「一致窓の下端で止まる」こと。**
 *   一致窓は ±MATCH なので elev−MATCH の等高線がいちばん外に広がり、
 *   「一致する最も近い点」は山頂の手前・約MATCH m低い肩に当たる。
 *   #13 では要確認12峰の**全部**が elev−14〜15m に着地した（規則的な偏り）。
 *   いまは「周囲に自分より高い点が無い＝峰の芯」を条件に足してある。
 *   その条件が本当に効いているかを場面2〜3で確かめる。
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
}

/* --- 場面2: 一致窓の下端（肩）でなく山頂の芯を採ること ---
   #13 で実際に踏んだ偏りの再現。山頂 2,898m を芯に、その周りを 2,884m
   （＝elev−14m、一致窓 ±15m の内側）の輪で囲む。元の座標は輪の外・約3km南。

   ⚠ 「一致する最も近い点」を採る実装は**必ず輪の手前側**に着地する。
      要確認12峰の全部が elev−14〜15m に着地したのがこれ。
      芯を採るには「周囲にもっと高い点が無い」条件が要る。 */
const CORE = { lat: 36.5100, lon: 137.5000, h: 2898, r: 70 };
const SHELF = { lat: 36.5100, lon: 137.5000, h: 2884, r: 500 };   // 芯を囲む輪

const out2 = runSnap({
  ground: 1600,
  features: [SHELF, CORE],   // 後のものが優先されるので芯が上書きする
  peaks: [{ name: '芯ヶ岳', lat: 36.4830, lon: 137.5000, elev: 2898, hyakumeizan: true }],
});
console.log(out2);

const line2 = out2.split('\n').find(l => l.includes('芯ヶ岳') && l.includes('→'));
ok(!!line2, '場面2でも修正案が出る', out2.slice(0, 400));
if (line2) {
  const m = line2.match(/→\s*([\d.]+),([\d.]+)\s+(\d+)m/);
  ok(!!m, '修正案の形が読める', line2);
  if (m) {
    const lat = Number(m[1]), lon = Number(m[2]), h = Number(m[3]);
    const dCore = Math.hypot((lat - CORE.lat) * 111, (lon - CORE.lon) * 89);
    ok(h === 2898, '★★★山頂の芯(2,898m)を採る（肩の2,884mで止まらない）', { h, line2 });
    ok(dCore < 0.1, '芯の座標へ寄る', { lat, lon, dCoreKm: +dCore.toFixed(3) });
  }
}

/* --- 場面3: 肩しか無ければ「決められなかった」に落とすこと ---
   2,884m の輪の芯を、公称より高い 2,950m にする。
   輪は一致窓には入るが局所最高点ではなく、芯は局所最高点だが標高が合わない。
   ＝**採ってよい点が1つも無い**地形。

   ⚠ ここで肩(2,884m)を拾って返す実装に戻ると、場面2の検査をすり抜ける。
   ⚠ 「平らな台地」は肩ではない。周囲に自分より高い点が無ければ、それは
      その地形の頂上なので採ってよい（同値は許す）。ここで落としたいのは
      **もっと高い芯を持つ輪**だけ。 */
const out3 = runSnap({
  ground: 1600,
  features: [{ lat: 36.5100, lon: 137.5000, h: 2884, r: 500 },
             { lat: 36.5100, lon: 137.5000, h: 2950, r: 70 }],
  peaks: [{ name: '肩ヶ岳', lat: 36.4830, lon: 137.5000, elev: 2898, hyakumeizan: true }],
});
ok(/決められなかったもの/.test(out3) && out3.includes('肩ヶ岳'),
  '★肩しか無ければ黙って返さず「決められなかった」に落とす', out3.slice(-500));

/* 平らな台地は採ってよい（メサ状の山頂を弾かないこと） */
const out3b = runSnap({
  ground: 1600,
  features: [{ lat: 36.5100, lon: 137.5000, h: 2898, r: 500 }],
  peaks: [{ name: '台ヶ岳', lat: 36.4830, lon: 137.5000, elev: 2898, hyakumeizan: true }],
});
ok(/台ヶ岳.*→/.test(out3b), '平らな台地は「決められなかった」にしない', out3b.slice(-500));

/* --- 場面4: --write は決まったものだけ書く --- */
const out4 = runSnap({
  ground: 1600,
  features: [SHELF, CORE],
  peaks: [{ name: '芯ヶ岳', lat: 36.4830, lon: 137.5000, elev: 2898, hyakumeizan: true }],
  args: ['--write'],
});
ok(/areas.json の 1件を書き換え/.test(out4), '--write が修正案を書き込む', out4.slice(-400));

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SNAP SMOKE FAILED');
  process.exit(1);
}
console.log('SNAP SMOKE PASSED');
