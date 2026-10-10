#!/usr/bin/env node
/* 地図の「施設（OSM）」レイヤーのデータを作る（#199）
 *
 *   areas.json  →  Overpass API（OpenStreetMap）  →  data/poi.json
 *
 * areas.json の峰ごとに半径8kmの円で登山口・駐車場（名前のあるもの）・山小屋・トイレ・
 * 水場・温泉・店を取り出す。ランタイムでは Overpass を叩かない（生成物だけを読む）。
 *
 * ⚠ 開発環境からは Overpass に届かない。GitHub Actions「施設データ（OSM）を作る」で走らせる
 * ⚠ データは ODbL 1.0（© OpenStreetMap contributors）。出力にもライセンスを書き込む
 * ⚠ このリポジトリは public。医療施設の名前（○○病院駐車場など）は山の用途に要らないので落とす
 *
 *   node scripts/buildPoi.mjs            … 生成する
 *   node scripts/buildPoi.mjs --dry-run  … 通信せず、山域ごとの峰の数と問い合わせ文だけ出す
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

// 峰ごとに、この半径の円の中を拾う（利用者の決定・2026-10-10）。
// 山域の円（重心＋最遠の峰）だと、峰の離れた山域（石鎚・剣山 91km）で町まで入った
const PEAK_RADIUS_M = 8000;
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

// 峰ごとの矩形（8km 四方の外接）で問い合わせ、円の外は手元で落とす（peakDistanceOk）。
// ⚠ around は Overpass 側で重く、1山域に1〜4分かかって51山域が60分に収まらなかった（2回目・2026-10-10）
export function peakBbox(p) {
  const dLat = PEAK_RADIUS_M / 111320;
  const dLon = PEAK_RADIUS_M / (111320 * Math.cos(p.lat * Math.PI / 180));
  const f = v => Number(v.toFixed(4));
  return [f(p.lat - dLat), f(p.lon - dLon), f(p.lat + dLat), f(p.lon + dLon)];
}
function distM(lat1, lon1, lat2, lon2) {
  const R = 6371000, rad = d => d * Math.PI / 180;
  const dLat = rad(lat2 - lat1), dLon = rad(lon2 - lon1);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}
// どれかの峰から PEAK_RADIUS_M 以内か
export function peakDistanceOk(peaks, lat, lon) {
  return peaks.some(p => distM(p.lat, p.lon, lat, lon) <= PEAK_RADIUS_M);
}
export function buildPoiQuery(peaks) {
  const sels = [
    '["highway"="trailhead"]',
    '["amenity"="parking"]["name"]',          // 名前のある駐車場だけ（名前の無い町中の駐車場が9割だった）
    '["tourism"~"^(alpine_hut|wilderness_hut)$"]',
    '["amenity"="toilets"]',
    '["amenity"="drinking_water"]',
    '["natural"="spring"]',
    '["natural"="hot_spring"]',
    '["amenity"="public_bath"]',
    '["shop"~"^(convenience|supermarket|outdoor)$"]',
  ];
  const lines = [];
  for (const p of peaks) {
    const b = peakBbox(p).join(',');
    for (const sel of sels) lines.push(`  nw${sel}(${b});`);
  }
  return `[out:json][timeout:120];
(
${lines.join('\n')}
);
out center tags;`;
}

/* Overpass は時間切れでも 200 で空の elements と remark を返す（1回目で「北アルプス中部 0件」）。
   それを成功と見なさない */
export function checkOverpass(json) {
  if (!json || !Array.isArray(json.elements)) throw new Error('応答の形が違う');
  if (json.remark && /error|timeout|timed out|runtime/i.test(json.remark)) throw new Error(`remark: ${json.remark}`);
  return json;
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
  if (typeId === 1 && !(t['name:ja'] || t.name || '').trim()) return 'noname';
  return null;
}

/* Overpass の結果を [lat, lon, typeId, name] に。seen（`n123`/`w123`）で山域をまたぐ重複を除く */
export function extractItems(json, seen, stats, peaks) {
  const out = [];
  for (const el of (json && json.elements) || []) {
    const key = (el.type === 'node' ? 'n' : el.type === 'way' ? 'w' : 'r') + el.id;
    if (seen.has(key)) continue;
    const lat = el.type === 'node' ? el.lat : el.center && el.center.lat;
    const lon = el.type === 'node' ? el.lon : el.center && el.center.lon;
    if (typeof lat !== 'number' || typeof lon !== 'number') continue;
    if (peaks && !peakDistanceOk(peaks, lat, lon)) continue;   // 矩形の角（円の外）を落とす
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

async function fetchOverpass(peaks, tries = 4) {
  const body = new URLSearchParams({ data: buildPoiQuery(peaks) });
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST', body, headers: { 'User-Agent': USER_AGENT },
      });
      if (res.ok) return checkOverpass(await res.json());
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
    if (dryRun) { console.log(`${area.id}\t峰${area.peaks.length}`); continue; }
    try {
      const got = extractItems(await fetchOverpass(area.peaks), seen, stats, area.peaks);
      items.push(...got);
      // 0件は失敗にしない（小さい山域では本当に0件がありうる）が、目で見られるように印を付ける
      console.log(`${area.id}\t${got.length}件${got.length ? '' : '  ⚠ 0件'}`);
    } catch (e) {
      failed.push(area.id);
      console.log(`${area.id}\t✗ ${e.message}`);
    }
    await sleep(OVERPASS_INTERVAL_MS);
  }
  if (dryRun) { console.log(buildPoiQuery(areas[0].peaks)); return; }

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
    note: 'areas.json の峰ごとに半径8kmで取り出したもの。scripts/buildPoi.mjs で作る。items は [緯度, 経度, 種類id, 名前（あれば）]',
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
  console.log(`落とした件数: 医療施設の名前 ${stats.dropped.medical || 0} / 私有の駐車場 ${stats.dropped.private || 0} / 名前の無い駐車場 ${stats.dropped.noname || 0}`);
  const kb = n => (n / 1024).toFixed(1) + ' KB';
  console.log(`大きさ: ${kb(Buffer.byteLength(text))}（gzip 後 ${kb(gzipSync(text).length)}）`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}
