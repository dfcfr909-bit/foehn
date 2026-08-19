/* areas.json の座標を山頂へ吸着させる修正案を出す（#13）。
 *
 * `checkPeaks.mjs` が「どの峰がずれているか」を教えるのに対し、
 * こちらは「正しい座標はどこか」を探す。**提案を出すだけで、何も書き換えない。**
 *
 * ⚠ 探索範囲でいちばん高い点を採ってはいけない。
 *   笠ヶ岳(2,898m)の近くには槍ヶ岳(3,180m)や穂高(3,190m)があるので、
 *   最高点を採ると**隣の別の山に吸着する**。公称の山頂標高を「山の識別子」として使う。
 *
 * ⚠ かといって「elev と一致する最も近い点」も採ってはいけない。
 *   一致窓は ±MATCH なので **elev−MATCH の等高線**がいちばん外側に広がり、
 *   元の座標がずれているとその手前側の肩を掴む。#13 で要確認12峰の**全部**が
 *   `elev−14〜15m` に着地した（規則的な偏り）。詳細は findSummit の注記。
 *
 *   採るのは **elev と一致し、かつ周囲 LOCALMAX_KM に自分より高い点が無い（＝峰の芯）
 *   点のうち、元の座標にいちばん近いもの**。
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
 *   node scripts/snapPeaks.mjs --conc 6        # タイルの同時取得数。既定6
 *   node scripts/snapPeaks.mjs --write         # areas.json を実際に書き換える
 *
 * ⚠ 開発環境からは国土地理院に到達できない。GitHub Actions「山頂座標の検査」から回す。
 *
 * ⚠ **進捗は端末でなくても出すこと。** Actions では `isTTY` が false なので、
 *   端末限定の上書き表示だけにしていた頃は**29分間まったく出力が無かった**。
 *   しかも fetch に時限が無かったため、「重いだけ」なのか「1本のリクエストで
 *   止まっている」のかを外から区別できなかった（ログはジョブ完了まで取れない）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEM_URL = 'https://cyberjapandata.gsi.go.jp/xyz/dem/{z}/{x}/{y}.txt';
const DEM_Z = 14;            // dem（DEM10B）のネイティブズーム
const SLEEP_MS = 120;        // タイル1枚で6.5万点取れるので、点APIほど回数は要らない
const FETCH_TIMEOUT_MS = 20000;  // 1本のリクエストがこれを超えたら諦めて再試行する
const FETCH_TRIES = 3;
const LOCALMAX_KM = 0.5;     // 吸着先はこの範囲でいちばん高い点でなければならない
const PROGRESS_EVERY = 10;   // 非TTYではこの件数ごとに1行出す
const TILE_CACHE_MAX = 400;  // 抱えるタイルの上限（1枚256KB）。超えたら古いものから捨てる

const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? Number(process.argv[i + 1]) : def;
};
const TOL = arg('tol', 200);        // これを超える差の峰を対象にする
const MATCH = arg('match', 15);     // elev とこれ以内なら「山頂と一致」
const RADIUS_KM = arg('radius', 6); // 探索半径
const CONC = Math.max(1, arg('conc', 6)); // タイルの同時取得数
const ALL = process.argv.includes('--all');
const WRITE = process.argv.includes('--write');

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 進捗。端末なら1行を上書きし、Actions などでは PROGRESS_EVERY 件ごとに1行流す。
   ⚠ 非TTYで黙らせないこと。無音と停止が見分けられなくなる。 */
function progress(i, total, label) {
  if (process.stdout.isTTY) {
    process.stdout.write(`\r${label} ${i}/${total}          `);
  } else if (i === total || i % PROGRESS_EVERY === 0) {
    console.log(`  … ${label} ${i}/${total}`);
  }
}
const progressEnd = () => { if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(60) + '\r'); };

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

/* 同時実行数を CONC 本に抑える小さな門番。相手方は静的タイルの配信なので
   数本なら失礼にならないが、無制限に投げない。 */
let running = 0;
const waiting = [];
async function withSlot(fn) {
  if (running >= CONC) await new Promise(r => waiting.push(r));
  running++;
  try { return await fn(); }
  finally { running--; const next = waiting.shift(); if (next) next(); }
}

/* ⚠ 時限を必ず付ける。付けていなかった頃は1本のリクエストが返らないと
   ジョブごと無言で止まり、外からは「重いだけ」と区別できなかった。 */
async function fetchTile(url) {
  let lastErr;
  for (let i = 1; i <= FETCH_TRIES; i++) {
    try {
      return await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    } catch (e) {
      lastErr = e;
      if (i < FETCH_TRIES) await sleep(500 * i);
    }
  }
  throw lastErr;
}

/* キャッシュには「値」ではなく「約束」を入れる。同じタイルへの並行要求が
   二重に飛ぶのを防ぐため（並列化で初めて起きるようになった）。

   ⚠ **際限なく溜めないこと。** タイルを入れ子配列で持ったまま全部残していた頃、
     `--all`（110峰・約4,000枚）で**ヒープ4GBを使い切って落ちた**（90/110で OOM）。
     いまは Float32Array（1枚256KB）で持ち、古いものから捨てる。
     隣り合う峰はタイルを共有するので、数百枚あれば取り直しはほとんど起きない。 */
const tileCache = new Map();
function demTile(tx, ty) {
  const key = `${tx}/${ty}`;
  if (tileCache.has(key)) {
    const hit = tileCache.get(key);
    tileCache.delete(key); tileCache.set(key, hit);   // 使ったものを新しい側へ
    return hit;
  }
  const p = loadTile(tx, ty);
  tileCache.set(key, p);
  // Map は挿入順を保つので、先頭が最も古い
  while (tileCache.size > TILE_CACHE_MAX) tileCache.delete(tileCache.keys().next().value);
  return p;
}
async function loadTile(tx, ty) {
  const url = DEM_URL.replace('{z}', DEM_Z).replace('{x}', tx).replace('{y}', ty);
  return withSlot(async () => {
    let grid = null;
    try {
      const res = await fetchTile(url);
      if (res.ok) {
        // 256行 × 256列のCSV。データ無しは "e"。無い所は -Infinity にしておく
        // （NaN にすると移動最大値フィルタの比較が常に false になって壊れる）
        const lines = (await res.text()).trim().split('\n');
        if (lines.length === 256) {
          grid = new Float32Array(65536).fill(-Infinity);
          for (let y = 0; y < 256; y++) {
            const cols = lines[y].split(',');
            for (let x = 0; x < 256; x++) {
              const v = cols[x];
              if (v && v !== 'e') { const n = +v; if (isFinite(n)) grid[y * 256 + x] = n; }
            }
          }
        }
        // 想定と違う形なら使わない（grid は null のまま）
      } else if (res.status !== 404) {
        throw new Error('HTTP ' + res.status);
      }
      // 404 は「その範囲にデータ無し」。海域などで普通に起きるので黙って null
    } catch (e) {
      grid = { err: e.message };
    }
    await sleep(SLEEP_MS);
    return grid;
  });
}

/* 山頂を探す。
   ⚠ **「elev に一致する最も近い点」を採ってはいけない。**
     一致窓は ±MATCH なので、山頂を芯とする円錐では **elev−MATCH の等高線**が
     いちばん外側に広がる。元の座標がずれていると、その等高線のうち手前側の点が
     「最も近い一致点」になり、**山頂の手前・約MATCH m低い肩で止まる**。
     しかも止まる向きは常に元のズレの方向なので、**誤差が誤差を呼ぶ**。
     #13 で28峰を回したとき、要確認12峰の**全部**が `elev−14〜15m` に着地した
     （平ヶ岳 −15 / 笠ヶ岳 −14 / 常念岳 −14 …）。偶然ではなく規則的な偏りだった。

   だから条件を2つにする。
     ① elev と MATCH 以内で一致する ②周囲 LOCALMAX_KM に自分より高い点が無い
   ②を満たす点＝峰の芯。肩は①を満たしても②で落ちる。
   その中から元の座標に最も近いものを採る（近さで山を選ぶ役割は変えない）。

   ⚠ **「範囲の最高点」を採る形には戻さないこと。** 笠ヶ岳(2,898m)の近くには
     槍ヶ岳(3,180m)や穂高(3,190m)があり、隣の別の山へ飛ぶ。①はそれを防いでいる。 */
async function findSummit(peak) {
  const dLat = RADIUS_KM / 111;
  const dLon = RADIUS_KM / (111 * Math.cos(rad(peak.lat)));
  const a = lonLatToTileXY(peak.lat + dLat, peak.lon - dLon, DEM_Z);   // 北西
  const b = lonLatToTileXY(peak.lat - dLat, peak.lon + dLon, DEM_Z);   // 南東
  const tx0 = Math.floor(a.xf), tx1 = Math.floor(b.xf);
  const ty0 = Math.floor(a.yf), ty1 = Math.floor(b.yf);

  // ⚠ まず全タイルの取得を**先に起こす**。ここで await してしまうと門番が
  //    仕事を1本ずつしか受け取れず、並列化が効かない。
  const tiles = [];
  for (let tx = tx0; tx <= tx1; tx++) {
    for (let ty = ty0; ty <= ty1; ty++) tiles.push({ tx, ty, p: demTile(tx, ty) });
  }

  /* 探索範囲を1枚の格子に並べ直す。局所最高点の判定を移動最大値フィルタで
     一度に済ませるため（点ごとに周囲を舐めると桁違いに遅い）。
     データ無しは -Infinity。NaN にすると比較が常に false になり、
     フィルタの単調デックから抜けなくなる。 */
  const W = (tx1 - tx0 + 1) * 256, H = (ty1 - ty0 + 1) * 256;
  const grid = new Float32Array(W * H).fill(-Infinity);
  const errors = [];
  for (const t of tiles) {
    const g = await t.p;
    if (!g) continue;
    if (g.err) { errors.push(g.err); continue; }
    const ox = (t.tx - tx0) * 256, oy = (t.ty - ty0) * 256;
    for (let py = 0; py < 256; py++) {
      grid.set(g.subarray(py * 256, py * 256 + 256), (oy + py) * W + ox);
    }
  }

  // 1画素の地上寸法（Webメルカトルなので緯度で縮む）
  const mPerPx = 156543.03392 * Math.cos(rad(peak.lat)) / Math.pow(2, DEM_Z);
  const R = Math.max(1, Math.round(LOCALMAX_KM * 1000 / mPerPx));
  const win = maxFilter(grid, W, H, R);

  let best = null, highest = null;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const h = grid[i];
      if (h === -Infinity) continue;
      if (!highest || h > highest.h) {
        highest = { ...pixelToLonLat(tx0, ty0, x, y), h };
      }
      if (Math.abs(h - peak.elev) > MATCH) continue;   // ①標高が一致する
      if (h < win[i]) continue;                        // ②周囲にもっと高い点が無い
      const p = pixelToLonLat(tx0, ty0, x, y);
      const d = haversineKm(peak.lat, peak.lon, p.lat, p.lon);
      if (d > RADIUS_KM) continue;                     // 箱の角が半径を超える分を落とす
      if (!best || d < best.d) best = { ...p, h, d };
    }
  }
  return { best, highest, errors };
}

// 並べ直した格子の画素 → 緯度経度
function pixelToLonLat(tx0, ty0, x, y) {
  return tilePixelToLonLat(tx0 + Math.floor(x / 256), ty0 + Math.floor(y / 256),
    x % 256, y % 256, DEM_Z);
}

/* 幅 2R+1 の移動最大値（横→縦の2段）。単調減少デックで O(画素数)。
   これが無いと、点ごとに周囲 R 画素を舐めることになり実用にならない。 */
function maxFilter(src, W, H, R) {
  const tmp = new Float32Array(W * H);
  const out = new Float32Array(W * H);
  const q = new Int32Array(Math.max(W, H));

  for (let y = 0; y < H; y++) {
    const base = y * W;
    let head = 0, tail = 0, j = 0;
    for (let x = 0; x < W; x++) {
      for (const hi = Math.min(W - 1, x + R); j <= hi; j++) {
        const v = src[base + j];
        while (tail > head && src[base + q[tail - 1]] <= v) tail--;
        q[tail++] = j;
      }
      while (q[head] < x - R) head++;
      tmp[base + x] = src[base + q[head]];
    }
  }
  for (let x = 0; x < W; x++) {
    let head = 0, tail = 0, j = 0;
    for (let y = 0; y < H; y++) {
      for (const hi = Math.min(H - 1, y + R); j <= hi; j++) {
        const v = tmp[j * W + x];
        while (tail > head && tmp[q[tail - 1] * W + x] <= v) tail--;
        q[tail++] = j;
      }
      while (q[head] < y - R) head++;
      out[y * W + x] = tmp[q[head] * W + x];
    }
  }
  return out;
}

// SNAP_AREAS はテスト用の差し替え口（合成の地形で吸着ルールを検査するため）
const areasPath = process.env.SNAP_AREAS || path.join(ROOT, 'areas.json');
const areas = JSON.parse(fs.readFileSync(areasPath, 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));

console.log(`areas.json v${areas.version} … ${areas.areas.length}山域 / ${peaks.length}峰`);
console.log(`探索半径 ${RADIUS_KM}km / 一致とみなす差 ±${MATCH}m / 同時取得 ${CONC}本 / ` +
  `対象は差 ${TOL}m 超` + (ALL ? '（--all なので全峰）' : '') + '\n');

// 対象を絞る（--all でなければ、まず現在地点の標高を見て「ずれている峰」だけにする）
let targets = peaks;
if (!ALL) {
  const kept = [];
  // 選別は1峰1タイル。まとめて起こしてから読むと門番が並列に捌ける
  const cells = peaks.map(p => {
    const { xf, yf } = lonLatToTileXY(p.lat, p.lon, DEM_Z);
    const tx = Math.floor(xf), ty = Math.floor(yf);
    return { p, xf, yf, tx, ty, tile: demTile(tx, ty) };
  });
  for (let i = 0; i < cells.length; i++) {
    const { p, xf, yf, tx, ty, tile } = cells[i];
    progress(i + 1, cells.length, '対象を選別中');
    const grid = await tile;
    if (!grid || grid.err) { kept.push(p); continue; }   // 読めないものは念のため対象に
    const h = grid[Math.floor((yf - ty) * 256) * 256 + Math.floor((xf - tx) * 256)];
    if (h === -Infinity || Math.abs(p.elev - h) > TOL) kept.push(p);
  }
  progressEnd();
  targets = kept;
}
console.log(`対象 ${targets.length}峰\n`);

const fixes = [], unresolved = [];
for (let i = 0; i < targets.length; i++) {
  const p = targets[i];
  progress(i + 1, targets.length, '探索中');
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
progressEnd();

if (fixes.length) {
  fixes.sort((a, b) => b.moved - a.moved);
  console.log(`修正案 ${fixes.length}件（移動距離の大きい順）\n`);
  console.log('  山域            峰            現在の座標          → 山頂の座標         標高   Δ    移動');
  for (const f of fixes) {
    const d = Math.round(f.h - f.p.elev);   // DEMは山頂を数m低く読む。±MATCH に収まる
    console.log(`  ${f.p.area.padEnd(14)} ${f.p.name.padEnd(12)} ` +
      `${f.p.lat.toFixed(4)},${f.p.lon.toFixed(4)} → ${f.lat.toFixed(4)},${f.lon.toFixed(4)} ` +
      `${String(Math.round(f.h)).padStart(5)}m ${((d > 0 ? '+' : '') + d).padStart(4)}m ` +
      `${f.moved.toFixed(2).padStart(6)}km`);
  }
  console.log(`\n吸着先は「周囲${LOCALMAX_KM}kmに自分より高い点が無い＝峰の芯」だけに限っている。`);
  console.log('Δ は DEM の読みと公称標高の差で、数m低く出るのが正常（皇海山 2,144m→2,141m）。');
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
