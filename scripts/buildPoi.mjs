#!/usr/bin/env node
/* 地図の「施設（OSM）」レイヤーのデータを作る（#199）
 *
 *   areas.json  →  Overpass API（OpenStreetMap）  →  data/poi.json
 *
 * 山域ごとに、山域の円を囲む矩形（＋余白）で登山口・駐車場・山小屋・トイレ・
 * 水場・温泉・店を取り出す。ランタイムでは Overpass を叩かない（生成物だけを読む）。
 *
 * ⚠ 開発環境からは Overpass に届かない。GitHub Actions「施設データ（OSM）を作る」で走らせる
 * ⚠ データは ODbL 1.0（© OpenStreetMap contributors）。出力にもライセンスを書き込む
 * ⚠ このリポジトリは public。医療施設の名前（○○病院駐車場など）は山の用途に要らないので落とす
 *
 *   node scripts/buildPoi.mjs            … 生成する
 *   node scripts/buildPoi.mjs --dry-run  … 通信せず、山域ごとの矩形と問い合わせ文だけ出す
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const AREAS_PATH = join(ROOT, 'areas.json');
const OUT_PATH = join(ROOT, 'data', 'poi.json');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'NagiNavi-buildPoi/1.0 (+https://dfcfr909-bit.github.io/foehn/)';
const OVERPASS_INTERVAL_MS = 3000;   // 相手は公共の無料API。山域ごとに間をあける

// 山域の円（sotoki_v4.html の areaShape・AREA_PAD_KM・AREA_MIN_R_KM を写したもの。
// 向こうを変えたらここも直す）＋ 施設を拾う余白
const AREA_PAD_KM = 4;
const AREA_MIN_R_KM = 5;
const POI_MARGIN_KM = 10;
const COORD_DECIMALS = 5;            // 約1m

/* 種類。id は出力の typeId（数字が短いので容量が減る）。並びは表示の並び */
export const POI_TYPES = [
  { id: 0, key: 'trailhead', name: '登山口' },
  { id: 1, key: 'parking',   name: '駐車場' },
  { id: 2, key: 'hut',       name: '山小屋' },
  { id: 3, key: 'toilets',   name: 'トイレ' },
  { id: 4, key: 'water',     name: '水場' },
  { id: 5, key: 'onsen',     name: '温泉' },
  { id: 6, key: 'shop',      name: '店' },
];

// 医療施設の名前（山の用途に要らない・公開リポジトリに置かない → ADR-0009）
const MEDICAL_RE = /病院|医院|クリニック|診療所|歯科|医療センター|hospital|clinic/i;

/* ---------------- 純粋関数 ---------------- */

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371, rad = d => d * Math.PI / 180;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const x = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// 山域の円（中心と半径 km）。sotoki_v4.html の areaShape と同じ式
export function areaCircle(area) {
  const n = area.peaks.length;
  const lat = area.peaks.reduce((s, p) => s + p.lat, 0) / n;
  const lon = area.peaks.reduce((s, p) => s + p.lon, 0) / n;
  const far = Math.max(...area.peaks.map(p => haversineKm(lat, lon, p.lat, p.lon)));
  return { lat, lon, radiusKm: Math.max(AREA_MIN_R_KM, far + AREA_PAD_KM) };
}

// 円＋余白を囲む矩形 [s, w, n, e]
export function areaBbox(area) {
  const c = areaCircle(area);
  const r = c.radiusKm + POI_MARGIN_KM;
  const dLat = r / 111.32;
  const dLon = r / (111.32 * Math.cos(c.lat * Math.PI / 180));
  const f = v => Number(v.toFixed(4));
  return [f(c.lat - dLat), f(c.lon - dLon), f(c.lat + dLat), f(c.lon + dLon)];
}

export function buildPoiQuery(bbox) {
  const b = bbox.join(',');
  const nw = sel => `  nw${sel}(${b});`;
  return `[out:json][timeout:120];
(
${nw('["highway"="trailhead"]')}
${nw('["amenity"="parking"]')}
${nw('["tourism"~"^(alpine_hut|wilderness_hut)$"]')}
${nw('["amenity"="toilets"]')}
${nw('["amenity"="drinking_water"]')}
${nw('["natural"="spring"]')}
${nw('["natural"="hot_spring"]')}
${nw('["amenity"="public_bath"]')}
${nw('["shop"~"^(convenience|supermarket|outdoor)$"]')}
);
out center tags;`;
}

// タグから種類（typeId）を決める。当てはまらなければ null
export function classify(tags) {
  const t = tags || {};
  if (t.highway === 'trailhead') return 0;
  if (t.tourism === 'alpine_hut' || t.tourism === 'wilderness_hut') return 2;
  if (t.natural === 'hot_spring' || t.amenity === 'public_bath') return 5;
  if (t.amenity === 'drinking_water' || t.natural === 'spring') return 4;
  if (t.amenity === 'toilets') return 3;
  if (/^(convenience|supermarket|outdoor)$/.test(t.shop || '')) return 6;
  if (t.amenity === 'parking') return 1;
  return null;
}

// 落とす理由（落とさないなら null）
export function dropReason(tags, typeId) {
  const t = tags || {};
  const name = [t.name, t['name:ja'], t.operator].filter(Boolean).join(' ');
  if (MEDICAL_RE.test(name)) return 'medical';
  if (typeId === 1 && /^(private|no|customers)$/.test(t.access || '')) return 'private';
  return null;
}

/* Overpass の結果を [lat, lon, typeId, name] に。seen（`n123`/`w123`）で山域をまたぐ重複を除く */
export function extractItems(json, seen, stats) {
  const out = [];
  for (const el of (json && json.elements) || []) {
    const key = (el.type === 'node' ? 'n' : el.type === 'way' ? 'w' : 'r') + el.id;
    if (seen.has(key)) continue;
    const lat = el.type === 'node' ? el.lat : el.center && el.center.lat;
    const lon = el.type === 'node' ? el.lon : el.center && el.center.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    const typeId = classify(el.tags);
    if (typeId === null) continue;
    seen.add(key);
    const why = dropReason(el.tags, typeId);
    if (why) { stats.dropped[why] = (stats.dropped[why] || 0) + 1; continue; }
    const t = el.tags || {};
    const name = (t['name:ja'] || t.name || '').trim();
    const r = v => Number(v.toFixed(COORD_DECIMALS));
    out.push(name ? [r(lat), r(lon), typeId, name] : [r(lat), r(lon), typeId]);
  }
  return out;
}

/* ---------------- 通信 ---------------- */

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchOverpass(bbox, tries = 4) {
  const body = new URLSearchParams({ data: buildPoiQuery(bbox) });
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST', body, headers: { 'User-Agent': USER_AGENT },
      });
      if (res.ok) return await res.json();
      last = new Error(`HTTP ${res.status}`);
      // 429/504 は相手が混んでいる。長めに待つ
      await sleep((res.status === 429 || res.status === 504 ? 30000 : 5000) * (i + 1));
    } catch (e) {
      last = e;
      await sleep(5000 * (i + 1));
    }
  }
  throw last;
}

/* ---------------- 本体 ---------------- */

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const areas = JSON.parse(await readFile(AREAS_PATH, 'utf8')).areas;
  const seen = new Set();
  const stats = { dropped: {} };
  const items = [];
  const failed = [];

  for (const area of areas) {
    const bbox = areaBbox(area);
    if (dryRun) { console.log(`${area.id}\t${bbox.join(',')}`); continue; }
    try {
      const got = extractItems(await fetchOverpass(bbox), seen, stats);
      items.push(...got);
      console.log(`${area.id}\t${got.length}件`);
    } catch (e) {
      failed.push(area.id);
      console.log(`${area.id}\t✗ ${e.message}`);
    }
    await sleep(OVERPASS_INTERVAL_MS);
  }
  if (dryRun) { console.log(buildPoiQuery(areaBbox(areas[0]))); return; }

  // ⚠ 欠けたデータはコミットしない
  if (failed.length) {
    console.log(`\n✗ 取得に失敗した山域: ${failed.join(', ')}`);
    process.exit(1);
  }

  items.sort((a, b) => a[2] - b[2] || a[0] - b[0] || a[1] - b[1]);
  const out = {
    source: 'OpenStreetMap（Overpass API）',
    license: 'ODbL 1.0（https://opendatacommons.org/licenses/odbl/1-0/）',
    attribution: '© OpenStreetMap contributors',
    generated: new Date().toISOString().slice(0, 10),
    note: 'areas.json の山域ごとに取り出したもの。scripts/buildPoi.mjs で作る。items は [緯度, 経度, 種類id, 名前（あれば）]',
    types: POI_TYPES.map(({ id, key, name }) => ({ id, key, name })),
    items,
  };
  const text = JSON.stringify(out);
  await writeFile(OUT_PATH, text + '\n');

  console.log('\n種類ごとの件数');
  for (const t of POI_TYPES) {
    const n = items.filter(i => i[2] === t.id).length;
    const named = items.filter(i => i[2] === t.id && i[3]).length;
    console.log(`  ${t.name}\t${n}件（名前あり ${named}）`);
  }
  console.log(`  合計\t${items.length}件`);
  console.log(`落とした件数: 医療施設の名前 ${stats.dropped.medical || 0} / 私有の駐車場 ${stats.dropped.private || 0}`);
  const kb = n => (n / 1024).toFixed(1) + ' KB';
  console.log(`大きさ: ${kb(Buffer.byteLength(text))}（gzip 後 ${kb(gzipSync(text).length)}）`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}
