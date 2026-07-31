#!/usr/bin/env node
/* 新雪ランキングの地点座標を確定させるビルドスクリプト
 *
 *   data/spots.seed.json  →  data/spots.json
 *
 * 座標をハードコードしないための工程。resort は OpenStreetMap の索道から
 * 「索道最上部」を、bc は与えた座標をそのまま使い、いずれも標高は国土地理院で取る。
 * ランタイムではこの2つのAPIを叩かない（生成物だけを読む）。
 *
 *   node scripts/buildSpots.mjs            … 生成する
 *   node scripts/buildSpots.mjs --dry-run  … 通信せずシードの妥当性だけ見る
 *
 * 実行後は必ず出力を目視すること。特に:
 *   ・湯沢周辺（かぐら/神立/岩原/中里）が別々の座標になっているか
 *   ・「索道データなし」の地点（シードに coord を足して手動指定する）
 *   ・bcの標高乖離警告（座標が間違っている可能性が高い）
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SEED_PATH = join(ROOT, 'data', 'spots.seed.json');
const OUT_PATH = join(ROOT, 'data', 'spots.json');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const GSI_URL = 'https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php';

// レート制限（相手は公共の無料API。詰めすぎない）
const GSI_INTERVAL_MS = 250;
const OVERPASS_INTERVAL_MS = 1200;

const MAX_CANDIDATES = 60;      // 1地点あたりの標高問い合わせ上限
const COORD_DECIMALS = 4;       // 約11m。これで重複を潰す
const ALT_TOLERANCE_M = 100;    // bcの標高乖離警告のしきい値

/* ---------------- 純粋関数（テストから使う） ---------------- */

// 索道の種類。ロープウェー・ゴンドラ・リフト・T/J/皿バー・ロープトゥ
export const AERIALWAY_RE = '^(chair_lift|gondola|cable_car|mixed_lift|t-bar|j-bar|platter|rope_tow)$';

export function buildOverpassQuery(bbox) {
  const [s, w, n, e] = bbox;
  return `[out:json][timeout:90];
(
  node["aerialway"="station"](${s},${w},${n},${e});
  way["aerialway"~"${AERIALWAY_RE}"](${s},${w},${n},${e});
);
out geom;`;
}

export function roundCoord(v) {
  return Number(v.toFixed(COORD_DECIMALS));
}

/** Overpassの結果から標高を問い合わせる候補点を取り出す。
 *  索道駅ノードと、各索道線の両端（＝山頂側の駅がここに入る）。 */
export function extractCandidates(overpassJson) {
  const els = (overpassJson && overpassJson.elements) || [];
  const out = [];
  const seen = new Set();
  const push = (lat, lon) => {
    if (typeof lat !== 'number' || typeof lon !== 'number') return;
    const p = [roundCoord(lat), roundCoord(lon)];
    const key = `${p[0]},${p[1]}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };
  for (const el of els) {
    if (el.type === 'node') {
      push(el.lat, el.lon);
    } else if (el.type === 'way' && Array.isArray(el.geometry) && el.geometry.length) {
      // 線の両端だけ。中間点は標高を問い合わせるだけ無駄
      const g = el.geometry.filter(p => p && typeof p.lat === 'number');
      if (!g.length) continue;
      push(g[0].lat, g[0].lon);
      push(g[g.length - 1].lat, g[g.length - 1].lon);
    }
  }
  return out.slice(0, MAX_CANDIDATES);
}

/** 候補点と標高から索道最上部を選ぶ。標高が取れなかった点は捨てる。 */
export function pickHighest(points, elevations) {
  let best = null;
  for (let i = 0; i < points.length; i++) {
    const el = elevations[i];
    if (typeof el !== 'number' || !Number.isFinite(el)) continue;
    if (!best || el > best.elevation) best = { lat: points[i][0], lon: points[i][1], elevation: el };
  }
  return best;
}

/** GSI標高APIのレスポンスを数値にする。「-----」（データ無し）はnull。 */
export function parseElevation(json) {
  if (!json) return null;
  const v = json.elevation;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** シードの静的な妥当性チェック（通信不要）。問題の説明を配列で返す。 */
export function validateSeed(seed) {
  const problems = [];
  const spots = (seed && seed.spots) || [];
  if (!spots.length) problems.push('spots が空');
  const ids = new Set();
  for (const s of spots) {
    const at = `[${s.id || '?'}]`;
    if (!s.id) problems.push(`${at} id がない`);
    else if (ids.has(s.id)) problems.push(`${at} id が重複`);
    ids.add(s.id);
    if (!s.name) problems.push(`${at} name がない`);
    if (!s.area) problems.push(`${at} area がない`);
    if (s.type !== 'resort' && s.type !== 'bc') problems.push(`${at} type は resort か bc`);
    if (s.type === 'bc' && !Array.isArray(s.coord)) problems.push(`${at} bc には coord が要る`);
    if (s.type === 'resort' && !Array.isArray(s.bbox) && !Array.isArray(s.coord)) {
      problems.push(`${at} resort には bbox（か手動指定の coord）が要る`);
    }
    if (Array.isArray(s.bbox)) {
      const [sLat, wLon, nLat, eLon] = s.bbox;
      if (s.bbox.length !== 4) problems.push(`${at} bbox は [南,西,北,東] の4要素`);
      else if (!(sLat < nLat && wLon < eLon)) problems.push(`${at} bbox の南北・東西が逆`);
    }
    if (Array.isArray(s.coord)) {
      const [lat, lon] = s.coord;
      if (!(lat > 24 && lat < 46 && lon > 122 && lon < 154)) problems.push(`${at} coord が日本の範囲外`);
    }
  }
  return problems;
}

/* ---------------- 通信 ---------------- */

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchJson(url, init, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, init);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < tries - 1) await sleep(1000 * Math.pow(2, i));   // 1s, 2s
    }
  }
  throw lastErr;
}

async function fetchOverpass(bbox) {
  const body = new URLSearchParams({ data: buildOverpassQuery(bbox) });
  return fetchJson(OVERPASS_URL, { method: 'POST', body });
}

async function fetchElevation(lat, lon) {
  const url = `${GSI_URL}?lon=${lon}&lat=${lat}&outtype=JSON`;
  try {
    return parseElevation(await fetchJson(url, undefined, 2));
  } catch (e) {
    return null;
  }
}

/* ---------------- 本体 ---------------- */

async function resolveResort(spot, log) {
  // 手動指定があれば通信しない（OSMに索道が無い地点の逃げ道）
  if (Array.isArray(spot.coord)) {
    const [lat, lon] = spot.coord;
    const elevation = await fetchElevation(lat, lon);
    log.push(`  手動指定の座標を使用 (${lat}, ${lon}) 標高${elevation ?? '不明'}m`);
    return elevation == null ? null : { lat: roundCoord(lat), lon: roundCoord(lon), elevation: Math.round(elevation) };
  }
  let overpass;
  try {
    overpass = await fetchOverpass(spot.bbox);
  } catch (e) {
    log.push(`  ⚠ Overpass失敗: ${e.message}`);
    return null;
  }
  const points = extractCandidates(overpass);
  if (!points.length) {
    log.push('  ⚠ OSMに索道データなし → シードに coord を足して手動指定すること');
    return null;
  }
  log.push(`  索道の候補点 ${points.length}箇所の標高を取得中…`);
  const elevations = [];
  for (const [lat, lon] of points) {
    elevations.push(await fetchElevation(lat, lon));
    await sleep(GSI_INTERVAL_MS);
  }
  const best = pickHighest(points, elevations);
  if (!best) {
    log.push('  ⚠ 標高がひとつも取れなかった');
    return null;
  }
  const got = elevations.filter(e => e != null).length;
  log.push(`  索道最上部 (${best.lat}, ${best.lon}) 標高${Math.round(best.elevation)}m　[${got}/${points.length}点で標高取得]`);
  return { lat: best.lat, lon: best.lon, elevation: Math.round(best.elevation) };
}

async function resolveBc(spot, log) {
  const [lat, lon] = spot.coord;
  const elevation = await fetchElevation(lat, lon);
  if (elevation == null) {
    log.push('  ⚠ 標高が取れなかった');
    return null;
  }
  const rounded = Math.round(elevation);
  if (typeof spot.expectedAlt === 'number') {
    const diff = rounded - spot.expectedAlt;
    if (Math.abs(diff) >= ALT_TOLERANCE_M) {
      log.push(`  ⚠ 標高乖離 ${diff > 0 ? '+' : ''}${diff}m（実測${rounded}m / 想定${spot.expectedAlt}m）→ 座標ミスの疑い`);
    } else {
      log.push(`  標高${rounded}m（想定${spot.expectedAlt}m、差${diff > 0 ? '+' : ''}${diff}m）`);
    }
  } else {
    log.push(`  標高${rounded}m`);
  }
  return { lat: roundCoord(lat), lon: roundCoord(lon), elevation: rounded };
}

/** 出力を目視するための後処理チェック。 */
export function auditSpots(spots) {
  const warns = [];
  // 別々のスキー場が同じ索道を拾っていないか（近すぎる組を疑う）
  for (let i = 0; i < spots.length; i++) {
    for (let j = i + 1; j < spots.length; j++) {
      const a = spots[i], b = spots[j];
      const dLat = Math.abs(a.lat - b.lat), dLon = Math.abs(a.lon - b.lon);
      if (dLat < 0.004 && dLon < 0.004) {
        warns.push(`⚠ ${a.name} と ${b.name} の座標がほぼ同一（同じ索道を拾った可能性）`);
      }
    }
  }
  return warns;
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const seed = JSON.parse(await readFile(SEED_PATH, 'utf8'));

  const problems = validateSeed(seed);
  if (problems.length) {
    console.error('シードに問題があります:');
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log(`シード ${seed.spots.length}地点を読み込みました。`);
  if (dryRun) { console.log('--dry-run のため通信しません。'); return; }

  const resolved = [];
  const failed = [];
  const allWarns = [];
  for (let i = 0; i < seed.spots.length; i++) {
    const spot = seed.spots[i];
    const log = [];
    console.log(`\n[${i + 1}/${seed.spots.length}] ${spot.name} (${spot.id}) ${spot.type}`);
    const got = spot.type === 'bc' ? await resolveBc(spot, log) : await resolveResort(spot, log);
    for (const line of log) {
      console.log(line);
      if (line.includes('⚠')) allWarns.push(`${spot.name}: ${line.trim()}`);
    }
    if (got) {
      resolved.push({ id: spot.id, name: spot.name, area: spot.area, type: spot.type, ...got });
    } else {
      failed.push(spot.id);
    }
    // Overpassを叩いた地点のあとだけ長めに待つ
    if (spot.type === 'resort' && !spot.coord && i < seed.spots.length - 1) await sleep(OVERPASS_INTERVAL_MS);
  }

  for (const w of auditSpots(resolved)) { console.log(w); allWarns.push(w); }

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    spots: resolved,
  }, null, 2) + '\n', 'utf8');

  console.log(`\n──────── 結果 ────────`);
  console.log(`確定 ${resolved.length} / ${seed.spots.length} 地点 → ${OUT_PATH}`);
  if (failed.length) console.log(`未確定: ${failed.join(', ')}（シードに coord を足して再実行）`);
  if (allWarns.length) {
    console.log(`\n要確認 ${allWarns.length}件:`);
    for (const w of allWarns) console.log('  ' + w);
  }
  console.log('\n出力の目視を忘れずに（湯沢周辺が別座標か／標高乖離が無いか）。');
}

// テストから import されたときは実行しない
if (process.argv[1] && process.argv[1].endsWith('buildSpots.mjs')) {
  main().catch(e => { console.error(e); process.exit(1); });
}
