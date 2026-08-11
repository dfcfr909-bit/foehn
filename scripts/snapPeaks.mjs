/* areas.json の座標を山頂へ吸着させる修正案を出す（#67）。
 *
 * `checkPeaks.mjs` が「どの峰がずれているか」を教えるのに対し、
 * こちらは「正しい座標はどこか」を探す。**提案を出すだけで、何も書き換えない。**
 *
 * ⚠ 探索範囲でいちばん高い点を採ってはいけない。
 *   笠ヶ岳(2,898m)の近くには槍ヶ岳(3,180m)や穂高(3,190m)があるので、
 *   最高点を採ると**隣の別の山に吸着する**。
 *   代わりに **elev と一致する点のうち、元の座標にいちばん近いもの**を採る。
 *   公称の山頂標高を「山の識別子」として使い、近さで決める。
 *
 * データ: 国土地理院の標高タイル（CSV形式）。
 *   https://cyberjapandata.gsi.go.jp/xyz/dem/{z}/{x}/{y}.txt
 *   1タイル = 256×256 = 65,536点の標高。1リクエストで一帯を総なめできる。
 *   値は m（小数）。データ無しは "e"。
 *
 * 使い方:
 *   node scripts/snapPeaks.mjs                 # checkPeaks が要確認とした峰だけ
 *   node scripts/snapPeaks.mjs --all           # 全110峰
 *   node scripts/snapPeaks.mjs --tol 200       # 要確認とみなす差(m)。既定200
 *   node scripts/snapPeaks.mjs --match 15      # elev と一致とみなす差(m)。既定15
 *   node scripts/snapPeaks.mjs --radius 6      # 探索半径(km)。既定6
 *   node scripts/snapPeaks.mjs --write         # areas.json を実際に書き換える
 *
 * ⚠ 開発環境からは国土地理院に到達できない。GitHub Actions「山頂座標の検査」から回す。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEM_URL = 'https://cyberjapandata.gsi.go.jp/xyz/dem/{z}/{x}/{y}.txt';
const DEM_Z = 14;            // dem（DEM10B）のネイティブズーム
const SLEEP_MS = 120;        // タイル1枚で6.5万点取れるので、点APIほど回数は要らない

const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? Number(process.argv[i + 1]) : def;
};
const TOL = arg('tol', 200);        // これを超える差の峰を対象にする
const MATCH = arg('match', 15);     // elev とこれ以内なら「山頂と一致」
const RADIUS_KM = arg('radius', 6); // 探索半径
const ALL = process.argv.includes('--all');
const WRITE = process.argv.includes('--write');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// アプリ本体（lonLatToTilePixel）と同じ式。ズレると別の場所を読むので必ず揃える
function lonLatToTileXY(lat, lon, z) {
  const n = Math.pow(2, z);
  const xf = (lon + 180) / 360 * n;
  const latRad = lat * Math.PI / 180;
  const yf = (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n;
  return { xf, yf };
}
// タイル内の画素 → 緯度経度（中心）
function tilePixelToLonLat(tx, ty, px, py, z) {
  const n = Math.pow(2, z);
  const xf = tx + (px + 0.5) / 256, yf = ty + (py + 0.5) / 256;
  const lon = xf / n * 360 - 180;
  const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * yf / n))) * 180 / Math.PI;
  return { lat, lon };
}
const R_EARTH = 6371;
const rad = d => d * Math.PI / 180;
function haversineKm(a1, o1, a2, o2) {
  const dA = rad(a2 - a1), dO = rad(o2 - o1);
  const x = Math.sin(dA / 2) ** 2 + Math.cos(rad(a1)) * Math.cos(rad(a2)) * Math.sin(dO / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.sqrt(x));
}

const tileCache = new Map();
async function demTile(tx, ty) {
  const key = `${tx}/${ty}`;
  if (tileCache.has(key)) return tileCache.get(key);
  const url = DEM_URL.replace('{z}', DEM_Z).replace('{x}', tx).replace('{y}', ty);
  let grid = null;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const txt = await res.text();
      // 256行 × 256列のCSV。データ無しは "e"
      grid = txt.trim().split('\n').map(line =>
        line.split(',').map(v => (v === 'e' || v === '') ? null : Number(v)));
      if (grid.length !== 256) grid = null;   // 想定と違う形なら使わない
    } else if (res.status !== 404) {
      throw new Error('HTTP ' + res.status);
    }
    // 404 は「その範囲にデータ無し」。海域などで普通に起きるので黙って null
  } catch (e) {
    grid = { err: e.message };
  }
  tileCache.set(key, grid);
  await sleep(SLEEP_MS);
  return grid;
}

/* 山頂を探す。elev と MATCH 以内で一致する点のうち、元の座標に最も近いものを返す。
   一致が1つも無ければ、範囲内の最高点を「参考」として返す（採用はしない）。 */
async function findSummit(peak) {
  const dLat = RADIUS_KM / 111;
  const dLon = RADIUS_KM / (111 * Math.cos(rad(peak.lat)));
  const a = lonLatToTileXY(peak.lat + dLat, peak.lon - dLon, DEM_Z);   // 北西
  const b = lonLatToTileXY(peak.lat - dLat, peak.lon + dLon, DEM_Z);   // 南東
  const tx0 = Math.floor(a.xf), tx1 = Math.floor(b.xf);
  const ty0 = Math.floor(a.yf), ty1 = Math.floor(b.yf);

  let best = null, highest = null, errors = [];
  for (let tx = tx0; tx <= tx1; tx++) {
    for (let ty = ty0; ty <= ty1; ty++) {
      const grid = await demTile(tx, ty);
      if (!grid) continue;
      if (grid.err) { errors.push(grid.err); continue; }
      for (let py = 0; py < 256; py++) {
        const row = grid[py];
        if (!row) continue;
        for (let px = 0; px < 256; px++) {
          const h = row[px];
          if (h == null || !isFinite(h)) continue;
          if (!highest || h > highest.h) {
            const p = tilePixelToLonLat(tx, ty, px, py, DEM_Z);
            highest = { ...p, h };
          }
          if (Math.abs(h - peak.elev) > MATCH) continue;
          const p = tilePixelToLonLat(tx, ty, px, py, DEM_Z);
          const d = haversineKm(peak.lat, peak.lon, p.lat, p.lon);
          if (d > RADIUS_KM) continue;                 // 箱の角が半径を超える分を落とす
          if (!best || d < best.d) best = { ...p, h, d };
        }
      }
    }
  }
  return { best, highest, errors };
}

// SNAP_AREAS はテスト用の差し替え口（合成の地形で吸着ルールを検査するため）
const areasPath = process.env.SNAP_AREAS || path.join(ROOT, 'areas.json');
const areas = JSON.parse(fs.readFileSync(areasPath, 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));

console.log(`areas.json v${areas.version} … ${areas.areas.length}山域 / ${peaks.length}峰`);
console.log(`探索半径 ${RADIUS_KM}km / 一致とみなす差 ±${MATCH}m / 対象は差 ${TOL}m 超` +
  (ALL ? '（--all なので全峰）' : '') + '\n');

// 対象を絞る（--all でなければ、まず現在地点の標高を見て「ずれている峰」だけにする）
let targets = peaks;
if (!ALL) {
  const kept = [];
  for (let i = 0; i < peaks.length; i++) {
    const p = peaks[i];
    if (process.stdout.isTTY) process.stdout.write(`\r対象を選別中 ${i + 1}/${peaks.length}   `);
    const { xf, yf } = lonLatToTileXY(p.lat, p.lon, DEM_Z);
    const tx = Math.floor(xf), ty = Math.floor(yf);
    const grid = await demTile(tx, ty);
    if (!grid || grid.err) { kept.push(p); continue; }   // 読めないものは念のため対象に
    const h = grid[Math.floor((yf - ty) * 256)]?.[Math.floor((xf - tx) * 256)];
    if (h == null || Math.abs(p.elev - h) > TOL) kept.push(p);
  }
  if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(40) + '\r');
  targets = kept;
}
console.log(`対象 ${targets.length}峰\n`);

const fixes = [], unresolved = [];
for (let i = 0; i < targets.length; i++) {
  const p = targets[i];
  if (process.stdout.isTTY) process.stdout.write(`\r探索中 ${i + 1}/${targets.length} … ${p.name}     `);
  const { best, highest, errors } = await findSummit(p);
  if (errors.length) { unresolved.push({ p, why: `取得失敗: ${errors[0]}` }); continue; }
  if (!best) {
    unresolved.push({ p, why: `半径${RADIUS_KM}kmに ${p.elev}m±${MATCH}m の点が無い` +
      (highest ? `（範囲の最高点は ${Math.round(highest.h)}m）` : '') });
    continue;
  }
  const moved = best.d;
  if (moved < 0.02) continue;   // 20m未満は動かす意味がない
  fixes.push({ p, lat: +best.lat.toFixed(4), lon: +best.lon.toFixed(4), h: best.h, moved });
}
if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(50) + '\r');

if (fixes.length) {
  fixes.sort((a, b) => b.moved - a.moved);
  console.log(`修正案 ${fixes.length}件（移動距離の大きい順）\n`);
  console.log('  山域            峰            現在の座標          → 山頂の座標         標高   移動');
  for (const f of fixes) {
    console.log(`  ${f.p.area.padEnd(14)} ${f.p.name.padEnd(12)} ` +
      `${f.p.lat.toFixed(4)},${f.p.lon.toFixed(4)} → ${f.lat.toFixed(4)},${f.lon.toFixed(4)} ` +
      `${String(Math.round(f.h)).padStart(5)}m ${f.moved.toFixed(2).padStart(6)}km`);
  }
  console.log('\n⚠ **移動距離が大きいものは地図で目視確認すること。**');
  console.log('   同じ標高の別の峰に吸着している可能性がある（elevを識別子にしているため）。');
}

if (unresolved.length) {
  console.log(`\n決められなかったもの ${unresolved.length}件（手で確認する）:`);
  for (const u of unresolved) console.log(`  ${u.p.area} / ${u.p.name}（${u.p.elev}m） … ${u.why}`);
}

if (!fixes.length && !unresolved.length) console.log('✅ 動かす必要のある峰はありません');

/* 書き込みは JSON を組み直す（正規表現で差し替えない）。
   峰名は重複しないことを areas.json の検査で確かめてあるが、念のため
   「同じ山域の同じ峰名」で引き当てて、取り違えを防ぐ。 */
if (WRITE && fixes.length) {
  const doc = JSON.parse(fs.readFileSync(areasPath, 'utf8'));
  let n = 0;
  for (const f of fixes) {
    const area = doc.areas.find(a => a.name === f.p.area);
    const peak = area && area.peaks.find(p => p.name === f.p.name);
    if (!peak) { console.log(`⚠ 書き換えられなかった: ${f.p.area} / ${f.p.name}`); continue; }
    peak.lat = f.lat;
    peak.lon = f.lon;
    n++;
  }
  fs.writeFileSync(areasPath, JSON.stringify(doc, null, 2) + '\n');
  console.log(`\n✍ areas.json の ${n}件を書き換えました。**git diff で必ず確認すること。**`);
}
