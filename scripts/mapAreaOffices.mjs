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

/* class20s（市区町村）から office まで親をたどる。⚠ **名前で引かない**（同名の市があるため）。

   ⚠⚠ **鍵は「JISコード5桁 + 00」とは限らない。** 最初そう決めつけて、
     松本市(2020200)・静岡市(2210100)・仙丈ヶ岳のある伊那市(2020900)などで
     `class20s に … が無い` を大量に出した。**気象庁は大きな市町村を
     細分している**（2020201, 2020202 … のように枝番が付く）。
   だから **5桁で始まる鍵をすべて拾い**、行き着く office が1つに揃うことを確かめる。
   ⚠ 揃わなければ（市が複数の予報区にまたがる）**そのまま返して人に見せる**。 */
function officeOfMuni(muniCd) {
  const pref0 = String(muniCd).padStart(5, '0');
  let pref = pref0, viaCity = false;
  let keys = Object.keys(area.class20s).filter(k => k.slice(0, 5) === pref);
  /* ⚠ **政令指定都市の「区」で引けない。** 逆ジオコーダは区のコードを返すが
       （静岡市葵区=22101）、気象庁は**市の単位**で持っている（静岡市=22100）。
       末尾が 0 でなければ、末尾を 0 にした市のコードで引き直す。
     ⚠ **引き直したことは返り値に残す**（黙って別のコードで引くと、
       あとから「なぜこの県になったか」が追えなくなる）。 */
  if (!keys.length && pref0[4] !== '0') {
    pref = pref0.slice(0, 4) + '0';
    keys = Object.keys(area.class20s).filter(k => k.slice(0, 5) === pref);
    if (keys.length) viaCity = true;
  }
  if (!keys.length) {
    /* 次に困らないよう、近いコードを添えて出す */
    const near = Object.keys(area.class20s).filter(k => k.slice(0, 2) === pref0.slice(0, 2)).slice(0, 6);
    return { err: `class20s に ${pref0} で始まる鍵が無い（同じ都道府県の例: ${near.join(', ') || 'なし'}）` };
  }
  const resolved = [];
  for (const key of keys) {
    const c20 = area.class20s[key];
    const c15 = c20 && area.class15s[c20.parent];
    const c10 = c15 && area.class10s[c15.parent];
    const off = c10 && area.offices[c10.parent];
    if (!off) continue;
    resolved.push({ muni: c20.name, class10: c10.name, code: c10.parent, name: off.name });
  }
  if (!resolved.length) return { err: `${pref} から予報区までたどれない` };
  const codes = [...new Set(resolved.map(r => r.code))];
  if (codes.length > 1) {
    return { err: `市町村が複数の予報区にまたがる: ${codes.map(c =>
      `${area.offices[c] ? area.offices[c].name : c}(${c})`).join(' / ')}` };
  }
  const r = resolved[0];
  const center = area.centers[area.offices[r.code].parent];
  return { ...r, center: center ? center.name : '?', ...(viaCity ? { viaCity: `${pref0}→${pref}` } : {}) };
}

/* ⚠ **機械で決まらなかった2峰。人が決めた（2026-08-31）。**
     ここに書いておくのは、**再実行しても失われないようにする**ため。
     コメントに理由を残さないと、半年後に「なぜこの県？」が分からなくなる。

   - 蔵王 熊野岳 … 山頂が境界未定で、周囲1kmが山形県/宮城県に割れた。
     刈田岳は宮城県に解けるが、BCの入山は蔵王温泉（山形）側が主なので**山形県**とした
   - 富士山 … **山頂一帯が丸ごと境界未定で、そもそも県境が無い。**
     ⚠ **片方を選ぶ根拠が無い**ので、山梨県と静岡県の**両方**を持たせる。
     表示側で両方出す（割れたら「山梨 B / 静岡 C」のように） */
const MANUAL = {
  '熊野岳': { codes: ['060000'], why: '境界未定。山形/宮城に割れるが、入山は蔵王温泉(山形)側が主' },
  '富士山': { codes: ['190000', '220000'], why: '山頂一帯が境界未定で県境が無い。両方を持たせる' },
};

const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8'));
let done = 0, firstRaw = true;
const results = [];

async function muniAt(lat, lon, label) {
  const j = await getJson(`${REVGEO}?lat=${lat}&lon=${lon}`, label);
  /* ⚠ **1件目だけ生の応答を出す。** 形が想像と違ったらここで分かる
       （推測した形のまま110件回して全部無駄、を避ける）。 */
  if (firstRaw) { console.log(`   生の応答の例: ${JSON.stringify(j).slice(0, 200)}`); firstRaw = false; }
  return (j && j.results && j.results.muniCd) || null;
}

/* ⚠ **山頂は「境界未定地域」であることが多い。** 富士山頂・蔵王・月山・南アルプスの稜線は
     どの市町村にも属しておらず、逆ジオコーダが市区町村コードを返さない。
     そこで**周囲4点（約1km）でも引いてみる**。
   ⚠ ただし**ずらして引いたことは必ず出す**。黙って埋めると、
     「山頂ではなく1km離れた場所の県」を使っていることが分からなくなる。 */
const OFFSET_DEG = 0.01;   // 約1km
async function resolvePeak(p) {
  try {
    const cd = await muniAt(p.lat, p.lon, p.name);
    if (cd) return { peak: p.name, muniCd: cd, ...officeOfMuni(cd) };
  } catch (e) { return { peak: p.name, err: e.message }; }
  // 山頂で引けなかった：周囲をずらす
  const around = [];
  for (const [dLat, dLon] of [[OFFSET_DEG, 0], [-OFFSET_DEG, 0], [0, OFFSET_DEG], [0, -OFFSET_DEG]]) {
    await sleep(GAP_MS);
    try {
      const cd = await muniAt(p.lat + dLat, p.lon + dLon, p.name);
      if (cd) around.push(officeOfMuni(cd));
    } catch (e) { /* 1点くらい引けなくても続ける */ }
  }
  const codes = [...new Set(around.filter(r => r.code).map(r => r.code))];
  if (!codes.length) return { peak: p.name, err: '境界未定で、周囲1kmでも引けなかった' };
  if (codes.length > 1) {
    return { peak: p.name, offset: true, ambiguous: codes,
      err: `境界未定。周囲1kmが ${codes.map(c => `${area.offices[c] ? area.offices[c].name : c}(${c})`).join(' / ')} に割れた` };
  }
  const one = around.find(r => r.code === codes[0]);
  return { peak: p.name, offset: true, ...one };
}

for (const a of data.areas) {
  const perPeak = [];
  for (const p of a.peaks) {
    /* ⚠ 人が決めた峰は問い合わせない（相手方を無駄に叩かない・結果を上書きしない） */
    if (MANUAL[p.name]) {
      const m = MANUAL[p.name];
      const first = area.offices[m.codes[0]];
      perPeak.push({ peak: p.name, manual: true, codes: m.codes, why: m.why,
        code: m.codes[0], name: first ? first.name : '?',
        class10: m.codes.map(c => area.offices[c] ? area.offices[c].name : c).join('・') });
      continue;
    }
    perPeak.push(await resolvePeak(p));
    if (++done % 10 === 0) console.log(`   … ${done}/110`);
    await sleep(GAP_MS);
  }
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
    /* ⚠ **名前はコードから引く。** 先頭の峰から取ると、その峰が引けなかったときに
         `undefined` が出る（実際に富士周辺と南アルプス南部で出した）。 */
    const off = area.offices[r.uniq[0]];
    console.log(`  ${head} ${off ? off.name : '?'}(${r.uniq[0]}) [${r.region}] ${names}`);
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
/* ⚠ **山域が解けていても、峰ごとの失敗を握りつぶさない。**
     最初の版はここを山域単位でしか出さず、富士山が引けていないのに
     「富士周辺＝山梨県」とだけ出ていた（三ツ峠山だけで決まっていた）。 */
const peakErrs = [], offsets = [], viaCities = [];
for (const r of results) for (const p of r.perPeak) {
  if (p.err) peakErrs.push(`${r.name} ${p.peak}: ${p.err}`);
  else {
    if (p.offset) offsets.push(`${r.name} ${p.peak} → ${p.name}/${p.class10}`);
    if (p.viaCity) viaCities.push(`${r.name} ${p.peak}: ${p.viaCity} → ${p.name}/${p.class10}`);
  }
}
const manuals = [];
for (const r of results) for (const p of r.perPeak) if (p.manual) {
  manuals.push(`${r.name} ${p.peak} → ${p.class10}（${p.why}）`);
}
if (manuals.length) {
  console.log(`\n⚠ 人が決めたもの ${manuals.length}件:`);
  for (const m of manuals) console.log(`  ${m}`);
}
if (viaCities.length) {
  console.log(`\n⚠ 政令市の区から市へ引き直したもの ${viaCities.length}件:`);
  for (const v of viaCities) console.log(`  ${v}`);
}
if (offsets.length) {
  console.log(`\n⚠ 山頂が境界未定で、周囲1kmの点で引いたもの ${offsets.length}件:`);
  for (const o of offsets) console.log(`  ${o}`);
}
if (peakErrs.length) {
  console.log(`\n✗ 引けなかった峰 ${peakErrs.length}件:`);
  for (const e of peakErrs) console.log(`  ${e}`);
}

/* ⚠ **手元へ持ち帰るための機械可読な出力。**
     このスクリプトはランナーの上で動くので、書き込んでも手元には残らない。
     一覧を貼り付けて手で写すと必ず間違えるので、**そのまま使える形**で出す。 */
console.log('\n===PEAK_OFFICES_BEGIN===');
const table = {};
for (const r of results) for (const p of r.perPeak) {
  table[`${r.id}/${p.peak}`] = p.codes ? p.codes : (p.code ? [p.code] : null);
}
console.log(JSON.stringify(table));
console.log('===PEAK_OFFICES_END===');
const missing = Object.entries(table).filter(([, v]) => !v);
console.log(missing.length ? `⚠ 未決定 ${missing.length}件: ${missing.map(([k]) => k).join(', ')}`
                           : `✅ 全${Object.keys(table).length}峰に予報区が決まった`);

if (WRITE) {
  /* ⚠ **またがる山域と引けなかった山域は書かない。** 人が決めるまで空けておく
       （機械が黙って1つ選ぶと、あとから間違いに気づけない）。 */
  let wrote = 0;
  for (const r of results) {
    if (r.uniq.length !== 1) continue;
    const a = data.areas.find(x => x.id === r.id);
    a.office = r.uniq[0];
    a.officeName = area.offices[r.uniq[0]] ? area.offices[r.uniq[0]].name : '';
    wrote++;
  }
  fs.writeFileSync(path.join(ROOT, 'areas.json'), JSON.stringify(data, null, 2) + '\n');
  console.log(`\n✅ areas.json に ${wrote}件 書き込んだ（またがる/引けなかった ${results.length - wrote}件は空のまま）`);
} else {
  console.log('\n（--write を付けると areas.json に書き込む。まず目で確かめること）');
}
