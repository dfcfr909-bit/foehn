/* 峰の名前から座標を引き、areas.json と突き合わせる（#13）。
 *
 * なぜ要るか:
 *   `snapPeaks.mjs` は標高だけを手がかりに山頂を探すので、**同じ標高の別の峰に
 *   吸着していても気づけない**。原理的に検出できない種類の誤りが残る。
 *   名前から引いた座標と照らせば「そもそも別の山を指していないか」を機械で言える。
 *   標高で「山頂かどうか」を、名前で「どの山か」を見る、という分担。
 *
 *   #13 では五竜岳・平標山・平ヶ岳で、吸着先の近傍最高点が公称標高より
 *   40〜85m 高く出ていた（＝隣の別の峰の疑い）。ここを裁くための道具。
 *
 * データ: 国土地理院の地名検索。
 *   https://msearch.gsi.go.jp/address-search/AddressSearch?q=<名前>
 *   GeoJSON の FeatureCollection で、各 feature の geometry.coordinates が [lon, lat]。
 *
 * ⚠ **これは「山の同定」にだけ使う。標高の根拠にはしない。**
 *   地名の代表点は必ずしも最高地点ではない。三角点が山頂と一致しない山も多い
 *   （富士山の二等三角点と剣ヶ峰など）。`areas.json` の `elev` は公称の**山頂**標高なので、
 *   代表点の座標をそのまま入れると標高と座標が別の場所を指しかねない。
 *   **最高地点の特定は DEM（snapPeaks）の仕事**、こちらは「どの山か」の裏取り。
 *
 * ⚠ 同名の山は各地にある（駒ヶ岳・大日岳・別山…）。だから
 *   **areas.json の座標に最も近い候補**を選ぶ。全国から名前だけで選ばない。
 *
 * 使い方:
 *   node scripts/searchPeaks.mjs             # 全110峰
 *   node scripts/searchPeaks.mjs --far 3     # これ以上離れていたら「要確認」。既定3km
 *
 * ⚠ 開発環境からは国土地理院に到達できない。GitHub Actions「山頂座標の検査」から回す。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEARCH_URL = 'https://msearch.gsi.go.jp/address-search/AddressSearch';
const SLEEP_MS = 300;            // 検索は1峰1回。相手方に負荷をかけない間隔
const FETCH_TIMEOUT_MS = 20000;
const FETCH_TRIES = 3;
const PROGRESS_EVERY = 10;

const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? Number(process.argv[i + 1]) : def;
};
const FAR_KM = arg('far', 3);    // これを超えて離れていたら要確認

const sleep = ms => new Promise(r => setTimeout(r, ms));
const rad = d => d * Math.PI / 180;
function haversineKm(a1, o1, a2, o2) {
  const dA = rad(a2 - a1), dO = rad(o2 - o1);
  const x = Math.sin(dA / 2) ** 2 + Math.cos(rad(a1)) * Math.cos(rad(a2)) * Math.sin(dO / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(x));
}

function progress(i, total) {
  if (process.stdout.isTTY) process.stdout.write(`\r検索中 ${i}/${total}          `);
  else if (i === total || i % PROGRESS_EVERY === 0) console.log(`  … 検索中 ${i}/${total}`);
}

async function fetchJson(url) {
  let lastErr;
  for (let i = 1; i <= FETCH_TRIES; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i < FETCH_TRIES) await sleep(500 * i);
    }
  }
  throw lastErr;
}

/* 名前で引き、areas.json の座標に最も近い候補を返す。
   ⚠ 「1件目」を採らないこと。同名の山が各地にあるので順番に意味は無い。 */
async function lookup(peak) {
  const json = await fetchJson(`${SEARCH_URL}?q=${encodeURIComponent(peak.name)}`);
  const feats = Array.isArray(json) ? json : (json && json.features) || [];
  let best = null;
  for (const f of feats) {
    const c = f && f.geometry && f.geometry.coordinates;
    if (!Array.isArray(c) || c.length < 2) continue;
    const lon = Number(c[0]), lat = Number(c[1]);
    if (!isFinite(lat) || !isFinite(lon)) continue;
    const d = haversineKm(peak.lat, peak.lon, lat, lon);
    if (!best || d < best.d) best = { lat, lon, d, title: (f.properties && f.properties.title) || '' };
  }
  return { best, count: feats.length };
}

const areas = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));

console.log(`areas.json v${areas.version} … ${areas.areas.length}山域 / ${peaks.length}峰`);
console.log(`地名検索と突き合わせ、${FAR_KM}km 以上離れていたら「要確認」として出します`);
console.log('⚠ これは山の同定のための照合。座標の採用は DEM（snapPeaks）側で決めること。\n');

const far = [], missing = [], failed = [];
for (let i = 0; i < peaks.length; i++) {
  const p = peaks[i];
  progress(i + 1, peaks.length);
  let r;
  try { r = await lookup(p); }
  catch (e) { failed.push({ p, err: e.message }); await sleep(SLEEP_MS); continue; }
  if (!r.best) { missing.push(p); await sleep(SLEEP_MS); continue; }
  if (r.best.d >= FAR_KM) far.push({ p, ...r.best });
  await sleep(SLEEP_MS);
}
if (process.stdout.isTTY) process.stdout.write('\r' + ' '.repeat(40) + '\r');

if (far.length) {
  far.sort((a, b) => b.d - a.d);
  console.log(`⚠ 要確認 ${far.length}件（離れている順）\n`);
  console.log('  山域            峰            areas.json          地名検索            距離');
  for (const f of far) {
    console.log(`  ${f.p.area.padEnd(14)} ${f.p.name.padEnd(12)} ` +
      `${f.p.lat.toFixed(4)},${f.p.lon.toFixed(4)} → ${f.lat.toFixed(4)},${f.lon.toFixed(4)} ` +
      `${f.d.toFixed(2).padStart(7)}km  ${f.title}`);
  }
  console.log('\n離れている＝areas.json が別の山を指している疑い。');
  console.log('⚠ ただし地名の代表点は最高地点とは限らないので、**そのまま採用しないこと**。');
  console.log('   「どの山か」を確かめたうえで、座標は snapPeaks の吸着結果から採る。');
} else if (!missing.length && !failed.length) {
  console.log(`✅ 全${peaks.length}峰が地名検索の位置と ${FAR_KM}km 以内`);
} else {
  // ⚠ 照合できなかった峰があるのに ✅ を出さないこと。
  //    「検証していない峰が検証済みに見える」のがこの手の道具のいちばん悪い嘘。
  console.log(`${FAR_KM}km 以上離れた峰はありません` +
    `（ただし ${missing.length + failed.length}峰は照合できていない。下記）`);
}

if (missing.length) {
  console.log(`\n名前で引けなかったもの ${missing.length}件（手で確認する）:`);
  for (const p of missing) console.log(`  ${p.area} / ${p.name}（${p.elev}m）`);
}
if (failed.length) {
  console.log(`\n取得できなかったもの ${failed.length}件:`);
  for (const f of failed) console.log(`  ${f.p.area} / ${f.p.name} … ${f.err}`);
}
// 照合できなかったものも「素通り」にしない（合否は人が見る前提だが、印は残す）
process.exit(far.length || missing.length || failed.length ? 1 : 0);
