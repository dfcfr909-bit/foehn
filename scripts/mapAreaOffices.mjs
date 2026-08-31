/* 山域を気象庁の府県予報区（office）に対応づける。
 *
 * なぜ要るか:
 *   気象庁の週間予報「信頼度（A/B/C）」は **office（府県予報区・58件）単位**で出る。
 *   地点ごとには出ないので、山域→office の対応表が要る。
 *
 * ⚠⚠ **手打ちしないこと。** 間違えると**別の県の信頼度を平然と表示**する。
 *   しかも値は「それらしく」見えるので、画面からは気づけない。
 *
 * どうやるか（名前の曖昧一致を避ける）:
 *   ① 国土地理院の逆ジオコーダで**峰ごとに市区町村コード（muniCd）**を得る
 *   ② `area.json` の `class20s` は **JISコード5桁 + "00"** が鍵になっている。
 *      そこから親をたどって office に着く。**名前で照合しないので取り違えが起きない**
 *   ③ 山域の峰が**複数の office にまたがる**場合は、そのまま出して人に見せる
 *      （北アルプスは長野・富山・岐阜にまたがる。機械が黙って1つ選ぶと事故になる）
 *
 * ⚠ 開発環境から地理院に到達できないので **GitHub Actions から実行する**。
 * ⚠ 相手方に配慮して1件ずつ間を空ける。110峰で3分ほど。
 *
 * 使い方: node scripts/mapAreaOffices.mjs [--write]
 *   --write を付けると areas.json に office を書き込む（**まず付けずに目で見る**）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');
const GAP_MS = 1200;          // 1件ごとに空ける間隔
const TRIES = 3;
const REVGEO = 'https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress';
const AREA_JSON = 'https://www.jma.go.jp/bosai/common/const/area.json';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getJson(url, label) {
  let last;
  for (let i = 0; i < TRIES; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      last = e;
      if (i < TRIES - 1) await sleep(1500 * (i + 1));
    }
  }
  throw new Error(`${label}: ${last.message}`);
}

const area = await getJson(AREA_JSON, 'area.json');
console.log(`予報区の一覧を取得: offices=${Object.keys(area.offices).length} / class20s=${Object.keys(area.class20s).length}`);

/* class20s（市区町村）から office まで親をたどる。
   ⚠ **鍵は JISコード5桁 + "00"。** 名前で引かないので同名の市があっても間違えない。 */
function officeOfMuni(muniCd) {
  const key = String(muniCd).padStart(5, '0') + '00';
  const c20 = area.class20s[key];
  if (!c20) return { err: `class20s に ${key} が無い` };
  const c15 = area.class15s[c20.parent];
  if (!c15) return { err: `class15s に ${c20.parent} が無い` };
  const c10 = area.class10s[c15.parent];
  if (!c10) return { err: `class10s に ${c15.parent} が無い` };
  const off = area.offices[c10.parent];
  if (!off) return { err: `offices に ${c10.parent} が無い` };
  const center = area.centers[off.parent];
  return { muni: c20.name, class10: c10.name, code: c10.parent, name: off.name,
    center: center ? center.name : '?' };
}

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8'));
let done = 0, firstRaw = true;
const results = [];

for (const a of data.areas) {
  const perPeak = [];
  for (const p of a.peaks) {
    const url = `${REVGEO}?lat=${p.lat}&lon=${p.lon}`;
    let muniCd = null, err = null;
    try {
      const j = await getJson(url, p.name);
      /* ⚠ **1件目だけ生の応答を出す。** 形が想像と違ったらここで分かる
           （推測した形のまま110件回して全部無駄、を避ける）。 */
      if (firstRaw) { console.log(`   生の応答の例: ${JSON.stringify(j).slice(0, 200)}`); firstRaw = false; }
      muniCd = j && j.results && j.results.muniCd;
      if (!muniCd) err = '市区町村コードが返らない';
    } catch (e) { err = e.message; }
    perPeak.push({ peak: p.name, muniCd, ...(muniCd ? officeOfMuni(muniCd) : {}), err });
    if (++done % 10 === 0) console.log(`   … ${done}/110`);
    await sleep(GAP_MS);
  }
  // 山域の中で office がばらけていないかを見る
  const codes = perPeak.filter(r => r.code).map(r => r.code);
  const uniq = [...new Set(codes)];
  results.push({ id: a.id, name: a.name, region: a.region, perPeak, uniq });
}

console.log('\n──────── 山域 → 府県予報区 ────────');
const straddle = [], failed = [];
for (const r of results) {
  const head = `${r.name}(${r.id})`.padEnd(22, '　');
  if (!r.uniq.length) { failed.push(r); console.log(`✗ ${head} 引けなかった`); continue; }
  const names = r.perPeak.filter(p => p.code)
    .map(p => `${p.peak}→${p.name}/${p.class10}`).join(' , ');
  if (r.uniq.length > 1) {
    straddle.push(r);
    console.log(`⚠ ${head} **またがる**: ${names}`);
  } else {
    console.log(`  ${head} ${r.perPeak[0].name}(${r.uniq[0]}) [${r.region}] ${names}`);
  }
}

console.log(`\n合計 ${results.length}山域 / またがる ${straddle.length} / 引けなかった ${failed.length}`);
if (straddle.length) {
  console.log('\n⚠ **またがる山域は機械で決めない。** どの府県の信頼度を使うかは人が決める:');
  for (const r of straddle) {
    const tally = {};
    for (const p of r.perPeak) if (p.name) tally[`${p.name}(${p.code})`] = (tally[`${p.name}(${p.code})`] || 0) + 1;
    console.log(`  ${r.name}: ${Object.entries(tally).map(([k, v]) => `${k}×${v}`).join(' / ')}`);
  }
}
if (failed.length) {
  console.log('\n✗ 引けなかった山域:');
  for (const r of failed) for (const p of r.perPeak) if (p.err) console.log(`  ${r.name} ${p.peak}: ${p.err}`);
}

if (WRITE) {
  /* ⚠ **またがる山域と引けなかった山域は書かない。** 人が決めるまで空けておく
       （機械が黙って1つ選ぶと、あとから間違いに気づけない）。 */
  let wrote = 0;
  for (const r of results) {
    if (r.uniq.length !== 1) continue;
    const a = data.areas.find(x => x.id === r.id);
    a.office = r.uniq[0];
    a.officeName = r.perPeak[0].name;
    wrote++;
  }
  fs.writeFileSync(path.join(ROOT, 'areas.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✅ areas.json に ${wrote}件 書き込んだ（またがる/引けなかった ${results.length - wrote}件は空のまま）`);
} else {
  console.log('\n（--write を付けると areas.json に書き込む。まず目で確かめること）');
}
