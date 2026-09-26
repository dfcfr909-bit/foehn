/* 高度別の風の場の基準標高 z_ref の表（data/terrain_ref.json）を作る。→ ADR-0012
 *
 * 何を作るか:
 *   MSM 上空の格子（原点 120E / 22.4N、0.125° × 0.1°）の格子点ごとに、その点を中心とする升目
 *   （±0.0625° × ±0.05°）の中の地理院の標高から、
 *     p90  … 標高の90パーセンタイル（海・欠測の画素は除く）
 *     p90s … p90 を隣の升目と 1-2-1 × 1-2-1 の重みでならした値（**z_ref はこれ**）
 *   を求める。あわせて検証用に max・mean・画素数 n も残す。
 *
 * なぜこの統計量か（ADR-0012 の実測）:
 *   格子点1点・平均・中央値は谷とモデル地形に寄り、地表/上空の判定が隣と半々で入れ替わる
 *   （モザイク）。90% をならすと入れ替わりが 0% になり、滑らかさは 850hPa の場そのものと同程度。
 *   表すのは「稜線と斜面上部」＝BC で風にさらされる帯。
 *
 * 使うもの:
 *   国土地理院の標高タイル dem_png（アプリでも使っている情報源）。z10（約120〜140m画素）。
 *   ⚠ 海の上はタイルが無い（404）。z6 → z8 → z10 の順に、在るタイルの子だけを取りに行く。
 *
 * ⚠ 開発環境から地理院へは到達できない。Actions「地形表（基準標高）を作る」から手動実行する。
 * ⚠ 標高の読み方・タイル座標は共通の道具（scripts/lib/demPng.mjs）を使う。書き写さない。
 *
 * 使い方: node scripts/buildTerrainRef.mjs
 *   TERRAIN_OUT  … 出力先（既定 data/terrain_ref.json）
 *   TERRAIN_BBOX … "lat0,lon0,lat1,lon1" で範囲を絞る（手元の空回し・部分の作り直し用）
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchDemTile, tileX, tileY, lonOfX, latOfY, DEM_URL } from './lib/demPng.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = process.env.TERRAIN_OUT || join(ROOT, 'data', 'terrain_ref.json');
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- 格子（MSM 上空。open-meteo の JmaDomain.msm_upper_level と同じ） ---- */
const GRID = { lon0: 120, lat0: 22.4, dlon: 0.125, dlat: 0.1 };
// 対象：日本の陸域を含む範囲（MSM の範囲の内側）
const [BLAT0, BLON0, BLAT1, BLON1] = (process.env.TERRAIN_BBOX || '24,122,46,149').split(',').map(Number);
const Z = 10;                 // 統計を取るズーム
const PRUNE = [6, 8];         // 海を飛ばすための下見のズーム
const MIN_PIXELS = 50;        // これ未満の升目は「陸がほぼ無い」として表に入れない
const BIN_M = 5;              // 90% 点を求めるヒストグラムの刻み（m）
const ELEV_MIN = -100, ELEV_MAX = 4000;
const NBIN = Math.ceil((ELEV_MAX - ELEV_MIN) / BIN_M) + 1;
const DELAY_MS = 40;          // 地理院への問い合わせの間隔

const cellOf = (lat, lon) => [Math.round((lat - GRID.lat0) / GRID.dlat), Math.round((lon - GRID.lon0) / GRID.dlon)];

/* ---- 1. 陸のあるタイルを探す（z6 → z8 → z10） ---- */
// そのズームで範囲にかかるタイルの番号の範囲
function tileRange(z) {
  return { x0: Math.floor(tileX(BLON0, z)), x1: Math.floor(tileX(BLON1, z)),
           y0: Math.floor(tileY(BLAT1, z)), y1: Math.floor(tileY(BLAT0, z)) };
}
const inRange = (z, x, y) => { const r = tileRange(z); return x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1; };
const stats = { requested: 0, found: 0, missing: 0, errors: 0 };
async function getTile(z, x, y) {
  const r = await fetchDemTile(z, x, y);
  stats.requested++;
  if (r.img) stats.found++; else if (r.status === 404) stats.missing++; else stats.errors++;
  await sleep(DELAY_MS);
  return r;
}
console.log(`# 基準標高の表を作る（z${Z}・範囲 ${BLAT0}〜${BLAT1}N / ${BLON0}〜${BLON1}E）`);
let cand = [];
{ const r = tileRange(PRUNE[0]); for (let x = r.x0; x <= r.x1; x++) for (let y = r.y0; y <= r.y1; y++) cand.push([x, y]); }
let zc = PRUNE[0];
for (const zn of [...PRUNE.slice(1), Z]) {
  const keep = [];
  for (const [x, y] of cand) if ((await getTile(zc, x, y)).img) keep.push([x, y]);
  console.log(`  z${zc}: ${cand.length}枚中 ${keep.length}枚に陸`);
  const k = 2 ** (zn - zc);
  // 子のうち範囲にかかるものだけ（親が範囲の端をまたいでいると、外の子まで拾ってしまう）
  cand = keep.flatMap(([x, y]) => {
    const kids = [];
    for (let dx = 0; dx < k; dx++) for (let dy = 0; dy < k; dy++) {
      const cx = x * k + dx, cy = y * k + dy;
      if (inRange(zn, cx, cy)) kids.push([cx, cy]);
    }
    return kids;
  });
  zc = zn;
}

/* ---- 2. z10 のタイルを読み、升目ごとのヒストグラムに積む ---- */
const cells = new Map();   // "i,j" -> { hist: Uint32Array, n, sum, max }
let tilesRead = 0;
for (const [x, y] of cand) {
  const r = await getTile(Z, x, y);
  if (!r.img) continue;
  tilesRead++;
  const { img } = r;
  const lons = [], lats = [];
  for (let px = 0; px < img.w; px++) lons.push(lonOfX(x + (px + 0.5) / img.w, Z));
  for (let py = 0; py < img.h; py++) lats.push(latOfY(y + (py + 0.5) / img.h, Z));
  for (let py = 0; py < img.h; py++) {
    const lat = lats[py];
    if (lat < BLAT0 || lat > BLAT1) continue;
    for (let px = 0; px < img.w; px++) {
      const lon = lons[px];
      if (lon < BLON0 || lon > BLON1) continue;
      const o = (py * img.w + px) * img.bpp;
      const xv = img.px[o] * 65536 + img.px[o + 1] * 256 + img.px[o + 2];
      if (xv === 8388608) continue;                 // 海・欠測（demOf と同じ定義）
      const e = (xv < 8388608 ? xv : xv - 16777216) * 0.01;
      const [i, j] = cellOf(lat, lon);
      const key = `${i},${j}`;
      let c = cells.get(key);
      if (!c) { c = { hist: new Uint32Array(NBIN), n: 0, sum: 0, max: -Infinity }; cells.set(key, c); }
      const b = Math.max(0, Math.min(NBIN - 1, Math.floor((e - ELEV_MIN) / BIN_M)));
      c.hist[b]++; c.n++; c.sum += e; if (e > c.max) c.max = e;
    }
  }
  if (tilesRead % 200 === 0) console.log(`  z${Z}: ${tilesRead}枚読んだ（升目 ${cells.size}）`);
}
console.log(`  z${Z}: ${tilesRead}枚読んだ／升目 ${cells.size}`);

/* ---- 3. 90% 点 → ならす ---- */
const p90 = new Map();
for (const [key, c] of cells) {
  if (c.n < MIN_PIXELS) continue;
  const want = Math.ceil(c.n * 0.9);
  let acc = 0, b = 0;
  for (; b < NBIN; b++) { acc += c.hist[b]; if (acc >= want) break; }
  p90.set(key, ELEV_MIN + (b + 0.5) * BIN_M);
}
const out = {};
for (const [key, v] of p90) {
  const [i, j] = key.split(',').map(Number);
  let s = 0, w = 0;
  for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
    const nv = p90.get(`${i + di},${j + dj}`);
    if (nv == null) continue;                        // 海の升目は重みから外す
    const k = (di ? 1 : 2) * (dj ? 1 : 2);
    s += k * nv; w += k;
  }
  const c = cells.get(key);
  out[key] = [Math.round(s / w), Math.round(v), Math.round(c.max), Math.round(c.sum / c.n), c.n];
}

/* ---- 4. 書き出す（出所を追えるように、作り方ごと残す） ---- */
const doc = {
  version: 1,
  what: '高度別の風の場の基準標高 z_ref（ADR-0012）。升目ごとの地理院標高の90パーセンタイルを隣とならした値',
  generated: new Date().toISOString(),
  generator: 'scripts/buildTerrainRef.mjs',
  commit: process.env.GITHUB_SHA || null,
  source: { name: '国土地理院 標高タイル（dem_png）', url: DEM_URL, zoom: Z,
    note: '海・欠測の画素（x=2^23）は除く。海の上はタイルが無い（404）ので z6→z8→z10 の順に在る所だけ読む' },
  grid: { name: 'MSM 上空の格子（open-meteo JmaDomain.msm_upper_level）', ...GRID,
    cell: '格子点を中心とする ±dlon/2 × ±dlat/2', key: 'i,j（lat = lat0 + i*dlat, lon = lon0 + j*dlon）',
    bbox: [BLAT0, BLON0, BLAT1, BLON1] },
  stat: { p90: `升目内の標高画素の90パーセンタイル（${BIN_M}m 刻みのヒストグラムの階級の中央）`,
    p90s: '隣の升目と 1-2-1 × 1-2-1 の重みでならした p90。海の升目は重みから外して正規化。**z_ref はこれ**',
    minPixels: MIN_PIXELS },
  fields: ['p90s', 'p90', 'max', 'mean', 'n'],
  tiles: { ...stats, read: tilesRead },
  cells: out,
};
if (!Object.keys(out).length) { console.log('✗ 升目が1つも作れなかった（タイルが取れていない）'); process.exit(1); }
mkdirSync(dirname(OUT), { recursive: true });
// 升目は1行1つ（差分が読めるように）
const head = JSON.stringify({ ...doc, cells: undefined }).slice(0, -1);
const body = Object.entries(out).map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`).join(',\n');
writeFileSync(OUT, `${head},"cells":{\n${body}\n}}\n`);
console.log(`書き出し: ${OUT}（升目 ${Object.keys(out).length}・問い合わせ ${stats.requested}回・404 ${stats.missing}・失敗 ${stats.errors}）`);
if (stats.errors > 0) { console.log('⚠ 取れなかったタイルがある（404 以外）。表が欠けているので作り直すこと'); process.exit(1); }
