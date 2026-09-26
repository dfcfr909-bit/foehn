/* 高度別の風の場（Wind Field）と自動選択（Auto Selector）の前提を、実データで確かめる。
 *
 * なぜ要るか:
 *   地図の風を「地点ごとに、その地点・その時刻に合う高さの風」で描きたい。
 *   そのためには次の前提が実データで成り立っている必要がある。どれか1つでも崩れたら
 *   実装へ進まず、設計から直す。
 *     ① 気圧面の高さ（geopotential_height_*hPa）が、全層・全期間で返る
 *     ② 応答の elevation が「何の標高か」（実際の地形か、モデルの地形か）を切り分けられる
 *     ③ 地中の気圧面（モデル地形より下）の値が、null で来るのか外挿値で来るのか
 *     ④ 気圧面の高さは本当に日によって・場所によって動くのか（固定表で足りない根拠）
 *     ⑤ 気圧面の間を高さで補間した風は、実際の中間層の風とどれだけ合うか
 *     ⑥ MSM → GSM の切り替わりがどこで起き、800hPa 等がどうなるか
 *     ⑦ 自動選択の案で、隣り合う点の風が不自然に跳ねないか
 *
 *   ⚠ **開発環境から Open-Meteo へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」（target: wind-field）から手動実行する。
 *
 * ⚠ **調べるだけ。判定も表示も何も変えない。**
 * ⚠ 相手を叩く回数はおよそ20回（すべて20地点ずつに分ける）。大きい要求の間は1分あけて、無料枠（1分600回）に収める。
 *   Open-Meteo は「地点数 ×（変数の数/10）」で回数を数える（open-meteo の
 *   ForecastApiResult.swift の calculateQueryWeight）。
 * ⚠ ABC判定の層の選び方（WIND_LEVELS / windLevelFor）は本体から読み出す。書き写さない。
 *
 * 使い方: node scripts/probeWindField.mjs
 *   PROBE_SLEEP_MS … 要求の間の待ち（既定 61000）。手元の空回しでだけ縮める
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OM = 'https://api.open-meteo.com/v1/forecast';
const OM_HIST = 'https://historical-forecast-api.open-meteo.com/v1/forecast';
const SLEEP_MS = Number(process.env.PROBE_SLEEP_MS ?? 61000);
const TIMEOUT = 90000;

const die = msg => { console.error(`✗ ${msg}`); process.exit(1); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- 本体からABC判定の層の選び方を読む（比較用。写さない） ---- */
const html = readFileSync(join(ROOT, 'sotoki_v4.html'), 'utf8');
const grab = (re, what) => {
  const m = html.match(re);
  if (!m) die(`sotoki_v4.html から ${what} を読めない（本体の書き方が変わった？）`);
  return m[0];
};
const abcSrc = [
  grab(/const WIND_LEVELS = \[[\s\S]*?\n\];/, 'WIND_LEVELS'),
  grab(/function windLevelFor\([\s\S]*?\n\}/, 'windLevelFor'),
].join('\n');
const { WIND_LEVELS, windLevelFor } =
  new Function(`${abcSrc}\nreturn { WIND_LEVELS, windLevelFor };`)();

/* ---- 調べる層（気圧面は表で持つ。900 は補間の答え合わせ用） ---- */
const LV_ALL = [925, 900, 850, 800, 700];
const LV_AUTO = [925, 850, 800, 700];          // 自動選択の候補（利用者の指定）
const SFC_BAND_M = 50;                         // 地形がモデル地形からこれ以内なら「地表」とみなす（案）

const hourlyVars = [
  'wind_speed_10m', 'wind_direction_10m', 'surface_pressure',
  ...LV_ALL.flatMap(p => [`wind_speed_${p}hPa`, `wind_direction_${p}hPa`, `geopotential_height_${p}hPa`]),
];

/* ---- 峰と横断線 ---- */
const areas = JSON.parse(readFileSync(join(ROOT, 'areas.json'), 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));
const peakBy = name => peaks.find(p => p.name === name) || die(`areas.json に「${name}」が無い`);

// 横断線は MSM 地上の格子点（原点 120E / 22.4N、0.0625° × 0.05°）にちょうど載せる
const msmLon = j => +(120 + 0.0625 * j).toFixed(4);
const msmLat = i => +(22.4 + 0.05 * i).toFixed(4);
const line = (name, i, j0, j1) => ({
  name,
  pts: Array.from({ length: j1 - j0 + 1 }, (_, n) => ({ lat: msmLat(i), lon: msmLon(j0 + n) })),
});
const LINES = [
  line('北アルプス横断（槍ヶ岳の北 36.40N・137.25〜138.13E）', 280, 276, 290),
  line('谷川連峰〜尾瀬横断（36.85N・138.50〜139.38E）', 289, 296, 310),
];

/* ---- 通信 ---- */
let calls = 0;
async function om(label, params, base = OM) {
  const q = new URLSearchParams(params);
  const url = `${base}?${q}`;
  const t0 = Date.now();
  let res, text;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    text = await res.text();
  } catch (e) {
    // fetch failed の中身（接続を切られた・時間切れ等）まで出す
    const c = e.cause ? ` (${e.cause.code || ''} ${e.cause.message || e.cause})` : '';
    console.log(`  [${label}] 通信できない: ${e.message}${c} / ${Date.now() - t0}ms`);
    return null;
  }
  calls++;
  const rl = [...res.headers.entries()].filter(([k]) => /rate|limit|usage/i.test(k))
    .map(([k, v]) => `${k}=${v}`).join(' ');
  console.log(`  [${label}] HTTP ${res.status} / ${(text.length / 1024).toFixed(0)}KB / ${Date.now() - t0}ms` +
    (rl ? ` / ${rl}` : ''));
  if (!res.ok) { console.log(`    ${text.slice(0, 300)}`); return null; }
  /* ⚠ HTTP 200 でも本文が途中で切れて JSON でないことがある。110地点×18変数を送ったとき
     42秒後に「Unexpected error while streaming data: timeoutReached」が返った（2026-09-26。
     同じ要求が1回目は1秒で通っている＝相手の混み具合しだい） */
  try {
    const json = JSON.parse(text);
    return Array.isArray(json) ? json : [json];
  } catch (e) {
    console.log(`    JSON でない応答: ${text.slice(0, 120).replace(/\s+/g, ' ')}`);
    return null;
  }
}
/* 地点を分けて取り、順につなぐ。⚠ 110地点をまとめて送ると、接続を切られたり（fetch failed）
   本文が途中で切れたり（timeoutReached）した（2026-09-26）。分ければ回数の数え方は変わらない */
async function omChunked(label, pts, extra = {}, size = 20) {
  const out = [];
  for (let s = 0; s < pts.length; s += size) {
    const part = pts.slice(s, s + size);
    const ex = { ...extra };
    if (ex.elevation === 'nan') ex.elevation = part.map(() => 'nan').join(',');
    let r = await om(`${label} ${s + 1}〜${s + part.length}`, baseParams(part, ex));
    if (!r) { await sleep(10000); r = await om(`${label} ${s + 1}〜${s + part.length} 再試行`, baseParams(part, ex)); }
    if (!r) return null;
    out.push(...r);
    await sleep(3000);
  }
  return out;
}
const baseParams = (pts, extra = {}) => ({
  latitude: pts.map(p => p.lat).join(','),
  longitude: pts.map(p => p.lon).join(','),
  hourly: hourlyVars.join(','),
  models: 'jma_seamless',
  timezone: 'Asia/Tokyo',
  wind_speed_unit: 'ms',          // ★既定はkm/h（ADR-0005）
  cell_selection: 'nearest',      // 既定の land は標高の近い隣の格子を選び直す
  forecast_days: '5',             // MSM（最長78時間）を越えて GSM まで入れる
  ...extra,
});

/* ---- 数値の道具 ---- */
const rad = d => d * Math.PI / 180;
const uv = (s, d) => (s == null || d == null) ? null : [-s * Math.sin(rad(d)), -s * Math.cos(rad(d))];
const spdOf = w => Math.hypot(w[0], w[1]);
const dirOf = w => (Math.atan2(-w[0], -w[1]) * 180 / Math.PI + 360) % 360;
const vdiff = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lerp = (a, b, w) => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
function stats(xs) {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  if (!a.length) return { n: 0 };
  const q = f => a[Math.min(a.length - 1, Math.floor(f * a.length))];
  return { n: a.length, min: a[0], p10: q(0.1), med: q(0.5), p90: q(0.9), max: a[a.length - 1],
    mean: a.reduce((s, x) => s + x, 0) / a.length };
}
const f0 = x => (x == null || !Number.isFinite(x)) ? '   -' : String(Math.round(x)).padStart(4);
const f1 = x => (x == null || !Number.isFinite(x)) ? '  -' : x.toFixed(1).padStart(5);
const fs = s => s.n ? `n=${s.n} 最小${f1(s.min)} 10%${f1(s.p10)} 中央${f1(s.med)} 90%${f1(s.p90)} 最大${f1(s.max)}` : 'n=0';
const DIR16 = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const d16 = d => DIR16[Math.round(d / 22.5) % 16];

// ある地点・ある時刻の鉛直の並び
function profile(r, k) {
  const h = r.hourly;
  const g = n => (h[n] && h[n][k] != null) ? h[n][k] : null;
  return {
    time: h.time[k],
    sp: g('surface_pressure'),
    sfc: { spd: g('wind_speed_10m'), dir: g('wind_direction_10m'), w: uv(g('wind_speed_10m'), g('wind_direction_10m')) },
    lv: LV_ALL.map(p => ({ p, z: g(`geopotential_height_${p}hPa`), spd: g(`wind_speed_${p}hPa`),
      dir: g(`wind_direction_${p}hPa`), w: uv(g(`wind_speed_${p}hPa`), g(`wind_direction_${p}hPa`)) })),
  };
}
const lvOf = (pr, p) => pr.lv.find(l => l.p === p);

// 地上気圧に当たる高さを、気圧面の高さから ln(p) で内挿して推定する（下端より下は外挿）
function heightOfPressure(pr, pHpa) {
  const ls = pr.lv.filter(l => l.z != null).sort((a, b) => b.p - a.p);   // 下から
  if (ls.length < 2 || pHpa == null) return null;
  let a = ls[0], b = ls[1];
  for (let i = 0; i < ls.length - 1; i++) {
    if (ls[i].p >= pHpa && pHpa >= ls[i + 1].p) { a = ls[i]; b = ls[i + 1]; break; }
    if (pHpa < ls[i + 1].p) { a = ls[i]; b = ls[i + 1]; }
  }
  const w = (Math.log(a.p) - Math.log(pHpa)) / (Math.log(a.p) - Math.log(b.p));
  return a.z + (b.z - a.z) * w;
}

/* 自動選択の案（評価用）。mode:
     'lowestAbove' … 地形より上にある一番下の気圧面をそのまま使う（最近傍の考え方）
     'interp'      … 地形の高さを挟む2面を高さで線形補間。最下面より下は10m風と按分
   有効な面 = 値があり、かつ**モデル地形より上**（下は外挿値なので使わない） */
function autoPick(pr, zs, zm, mode) {
  if (zs == null || zm == null || !pr.sfc.w) return null;
  const valid = pr.lv.filter(l => LV_AUTO.includes(l.p) && l.z != null && l.w && l.z >= zm)
    .sort((a, b) => a.z - b.z);
  if (zs <= zm + SFC_BAND_M || !valid.length) return { kind: '10m', w: pr.sfc.w, used: '10m' };
  const lo = valid[0];
  if (zs < lo.z) {
    if (mode === 'lowestAbove') return { kind: 'level', w: lo.w, used: `${lo.p}` };
    const zb = zm + 10;
    return { kind: 'blend', w: lerp(pr.sfc.w, lo.w, (zs - zb) / (lo.z - zb)), used: `10m-${lo.p}` };
  }
  for (let i = 0; i < valid.length - 1; i++) {
    const a = valid[i], b = valid[i + 1];
    if (a.z <= zs && zs <= b.z) {
      if (mode === 'lowestAbove') return { kind: 'level', w: b.w, used: `${b.p}` };
      return { kind: 'interp', w: lerp(a.w, b.w, (zs - a.z) / (b.z - a.z)), used: `${a.p}-${b.p}` };
    }
  }
  const top = valid[valid.length - 1];
  return { kind: 'top', w: top.w, used: `${top.p}` };
}

/* ================================================================ */
console.log('# 高度別の風の場・自動選択の前提を確かめる（Phase 1a）');
console.log(`取得: jma_seamless / cell_selection=nearest / forecast_days=5 / 変数${hourlyVars.length}個`);
console.log(`峰 ${peaks.length} / 横断線 ${LINES.map(l => l.pts.length).join('+')}点\n`);

console.log('## 通信');
// 1) 峰：既定の標高（地形の標高で縮尺補正される）
const R1 = await omChunked('峰・既定の標高', peaks);
await sleep(SLEEP_MS);
// 2) 峰：elevation=nan（標高の補正を切る＝格子そのものの標高が返るはず）
const R2 = await omChunked('峰・elevation=nan', peaks, { elevation: 'nan' });
await sleep(SLEEP_MS);
// 3) 横断線：既定と nan
const linePts = LINES.flatMap(l => l.pts);
const R3a = await omChunked('横断線・既定の標高', linePts);
await sleep(SLEEP_MS);
const R3b = await omChunked('横断線・elevation=nan', linePts, { elevation: 'nan' });
await sleep(SLEEP_MS);
// 4) モデルの切り替わり：同じ5峰を seamless / msm / gsm で
const SW_PEAKS = ['谷川岳', '至仏山', '槍ヶ岳', '火打山', '富士山'].map(peakBy);
const R4 = await om('5峰・3モデル', {
  latitude: SW_PEAKS.map(p => p.lat).join(','), longitude: SW_PEAKS.map(p => p.lon).join(','),
  hourly: ['wind_speed_10m', 'wind_speed_850hPa', 'wind_speed_800hPa', 'wind_speed_700hPa',
    'geopotential_height_850hPa', 'geopotential_height_800hPa'].join(','),
  models: 'jma_seamless,jma_msm,jma_gsm', timezone: 'Asia/Tokyo', wind_speed_unit: 'ms',
  cell_selection: 'nearest', forecast_days: '5',
  elevation: SW_PEAKS.map(() => 'nan').join(','),
});
await sleep(5000);
// 5) 季節：冬と夏の同じ峰（過去の予報の控え。取れなければ飛ばす）
const SEASON = { 冬: '2026-01-20', 夏: '2026-08-05' };
const R5 = {};
for (const [k, d] of Object.entries(SEASON)) {
  R5[k] = await om(`5峰・${k}（${d}）`, {
    latitude: SW_PEAKS.map(p => p.lat).join(','), longitude: SW_PEAKS.map(p => p.lon).join(','),
    hourly: LV_AUTO.map(p => `geopotential_height_${p}hPa`).join(','),
    models: 'jma_seamless', timezone: 'Asia/Tokyo', cell_selection: 'nearest',
    start_date: d, end_date: d,
  }, OM_HIST);
  await sleep(5000);
}
console.log(`（要求 ${calls} 回）\n`);

if (!R1 || !R2) die('峰の取得に失敗したので、ここから先は判断できない');
if (R1.length !== peaks.length || R2.length !== peaks.length) die('返ってきた地点数が合わない');

const nT = R1[0].hourly.time.length;
console.log(`時刻の数: ${nT}（${R1[0].hourly.time[0]} 〜 ${R1[0].hourly.time[nT - 1]}）\n`);

/* ---- ① 値が返るか（層ごと・時刻ごとの欠け） ---- */
console.log('## ① 層ごとの値の有無（峰×時刻のうち null の割合）');
const nullRate = (R, name) => {
  let n = 0, miss = 0;
  R.forEach(r => (r.hourly[name] || []).forEach(v => { n++; if (v == null) miss++; }));
  return R.every(r => r.hourly[name]) ? `${(100 * miss / n).toFixed(1)}%` : '変数ごと無い';
};
for (const name of hourlyVars) console.log(`  ${name.padEnd(28)} ${nullRate(R2, name)}`);
// どの時刻から欠けるか（800hPa・900hPa の風速）
for (const p of [900, 800]) {
  const name = `wind_speed_${p}hPa`;
  const first = [];
  R2.forEach(r => { const a = r.hourly[name] || []; const k = a.findIndex(v => v == null); if (k >= 0) first.push(k); });
  const s = stats(first);
  console.log(`  ${p}hPa が最初に欠ける時刻: ${s.n ? `${s.n}峰で欠ける／先頭から ${s.min}〜${s.max} 時間目` : '欠けない'}`);
}
console.log();

/* ---- ② 応答の elevation は何の標高か ---- */
console.log('## ② 応答の elevation（峰の標高＝地理院で検証済みとの差）');
const e1 = peaks.map((p, i) => R1[i].elevation - p.elev);
const e2 = peaks.map((p, i) => R2[i].elevation - p.elev);
console.log(`  既定        − 山頂: ${fs(stats(e1))}`);
console.log(`  elevation=nan − 山頂: ${fs(stats(e2))}`);
console.log(`  既定 と nan が同じ値の峰: ${peaks.filter((p, i) => R1[i].elevation === R2[i].elevation).length} / ${peaks.length}`);
// 地上気圧から逆算した高さと突き合わせる（風の場が立っている地面かどうか）
const k0 = 12;   // 初日の12時（MSM の範囲）
const sp1 = peaks.map((p, i) => heightOfPressure(profile(R1[i], k0), profile(R1[i], k0).sp) - R1[i].elevation);
const sp2 = peaks.map((p, i) => heightOfPressure(profile(R2[i], k0), profile(R2[i], k0).sp) - R2[i].elevation);
console.log(`  地上気圧から逆算した高さ − elevation（既定）: ${fs(stats(sp1))}`);
console.log(`  地上気圧から逆算した高さ − elevation（nan） : ${fs(stats(sp2))}`);
// 同じ格子か（風が一致するか）
let same10 = 0, same850 = 0, nCmp = 0;
peaks.forEach((p, i) => {
  for (let k = 0; k < nT; k++) {
    nCmp++;
    if (R1[i].hourly.wind_speed_10m[k] === R2[i].hourly.wind_speed_10m[k]) same10++;
    if (R1[i].hourly.wind_speed_850hPa[k] === R2[i].hourly.wind_speed_850hPa[k]) same850++;
  }
});
console.log(`  風が既定と nan で一致: 10m ${(100 * same10 / nCmp).toFixed(1)}% / 850hPa ${(100 * same850 / nCmp).toFixed(1)}%`);
console.log();

// 以降は「モデル地形 zm = nan の elevation」「実際の地形 zs = 山頂標高」で見る。
// ⚠ ②の結果で nan の elevation がモデル地形と言えなければ、この前提ごと崩れる
const zmOf = i => R2[i].elevation;

/* ---- ③ 地中の気圧面の扱い ---- */
console.log('## ③ モデル地形より下の気圧面（地中）の値');
for (const p of LV_AUTO) {
  let under = 0, underNull = 0, n = 0;
  const gap = [];
  peaks.forEach((pk, i) => {
    for (let k = 0; k < nT; k++) {
      const pr = profile(R2[i], k), l = lvOf(pr, p);
      if (l.z == null) continue;
      n++;
      if (l.z < zmOf(i)) { under++; if (l.spd == null) underNull++; gap.push(zmOf(i) - l.z); }
    }
  });
  console.log(`  ${p}hPa: 地中 ${under}/${n}（うち風が null ${underNull}）` +
    (under ? `／地中の深さ(m) 中央${f0(stats(gap).med)} 最大${f0(stats(gap).max)}` : ''));
}
console.log('  峰の山頂より下（実際の地形で地中）:');
for (const p of LV_AUTO) {
  let under = 0, n = 0;
  peaks.forEach((pk, i) => { for (let k = 0; k < nT; k++) { const l = lvOf(profile(R2[i], k), p); if (l.z == null) continue; n++; if (l.z < pk.elev) under++; } });
  console.log(`    ${p}hPa: ${under}/${n}（${(100 * under / n).toFixed(0)}%）`);
}
console.log();

/* ---- ④ 気圧面の高さはどれだけ動くか（固定表で足りるか） ---- */
console.log('## ④ 気圧面の高さ（m）の幅と、ABC判定の固定表との差');
for (const p of LV_AUTO) {
  const zs = [];
  R2.forEach(r => (r.hourly[`geopotential_height_${p}hPa`] || []).forEach(v => zs.push(v)));
  const fixed = (WIND_LEVELS.find(l => l[0] === p) || [])[1];
  console.log(`  ${p}hPa: ${fs(stats(zs))}　固定表 ${fixed ?? '-'}`);
}
// 同じ峰の中での時間変化（5日間の最大−最小）
for (const p of LV_AUTO) {
  const rng = R2.map(r => { const s = stats(r.hourly[`geopotential_height_${p}hPa`] || []); return s.n ? s.max - s.min : NaN; });
  console.log(`  ${p}hPa の5日間の上下幅（峰ごと）: ${fs(stats(rng))}`);
}
// 山頂に一番近い層：固定表 と 実際の高さ で食い違う割合
let mism = 0, nm = 0;
const mismEx = [];
peaks.forEach((pk, i) => {
  for (let k = 0; k < nT; k++) {
    const pr = profile(R2[i], k);
    const cand = pr.lv.filter(l => WIND_LEVELS.some(w => w[0] === l.p) && l.z != null);
    if (!cand.length) continue;
    const real = cand.reduce((a, b) => Math.abs(b.z - pk.elev) < Math.abs(a.z - pk.elev) ? b : a).p;
    const fix = windLevelFor(pk.elev)[0];
    nm++;
    if (real !== fix) { mism++; if (mismEx.length < 8 && !mismEx.some(e => e.startsWith(pk.name))) mismEx.push(`${pk.name}(${pk.elev}m) 固定表${fix}→実際${real} @${pr.time}`); }
  }
});
console.log(`  山頂に最も近い層が固定表と実際の高さで食い違う: ${mism}/${nm}（${(100 * mism / nm).toFixed(1)}%）`);
mismEx.forEach(e => console.log(`    例: ${e}`));
// 季節
for (const [k, R] of Object.entries(R5)) {
  if (!R) { console.log(`  ${k}: 取れなかった`); continue; }
  const row = SW_PEAKS.map((pk, i) => {
    const z = R[i]?.hourly?.geopotential_height_850hPa;
    return `${pk.name} ${z ? f0(stats(z).med) : '   -'}`;
  }).join(' / ');
  console.log(`  ${k}の850hPa高度（日中央値）: ${row}`);
}
{
  const row = SW_PEAKS.map(pk => { const i = peaks.indexOf(pk); return `${pk.name} ${f0(stats(R2[i].hourly.geopotential_height_850hPa).med)}`; }).join(' / ');
  console.log(`  いまの850hPa高度（5日中央値）: ${row}`);
}
console.log();

/* ---- ⑤ 高さで補間した風は、実際の中間層の風と合うか ---- */
console.log('## ⑤ 気圧面の間の補間（答え合わせ：実際にある中間層と比べる。MSM の範囲・モデル地形より上だけ）');
function interpTest(pMid, pLo, pHi) {
  const errI = [], errN = [], relI = [], dirI = [];
  R2.forEach((r, i) => {
    for (let k = 0; k < nT; k++) {
      const pr = profile(r, k);
      const m = lvOf(pr, pMid), a = lvOf(pr, pLo), b = lvOf(pr, pHi);
      if (![m, a, b].every(l => l.z != null && l.w && l.z >= zmOf(i))) continue;
      const w = (m.z - a.z) / (b.z - a.z);
      const wi = lerp(a.w, b.w, w);
      const near = Math.abs(m.z - a.z) < Math.abs(b.z - m.z) ? a.w : b.w;
      errI.push(vdiff(wi, m.w)); errN.push(vdiff(near, m.w));
      if (m.spd >= 5) { relI.push(vdiff(wi, m.w) / m.spd); let dd = Math.abs(dirOf(wi) - m.dir) % 360; dirI.push(dd > 180 ? 360 - dd : dd); }
    }
  });
  console.log(`  ${pMid}hPa を ${pLo}/${pHi} から:`);
  console.log(`    補間の誤差(m/s)       ${fs(stats(errI))}`);
  console.log(`    近い方の層の誤差(m/s) ${fs(stats(errN))}`);
  console.log(`    補間の相対誤差(風速5m/s以上) 中央${f1(stats(relI).med * 100)}% 90%${f1(stats(relI).p90 * 100)}%／風向差 中央${f1(stats(dirI).med)}° 90%${f1(stats(dirI).p90)}°`);
}
interpTest(900, 925, 850);   // 隣の面どうし（50〜75hPa）
interpTest(800, 850, 700);   // 1面とばし（GSM の期間に 800 が無いときの代わりになるか）
interpTest(850, 925, 800);   // 1面とばし（下層）
// 10m風と「モデル地形より上の最下面」の違い（境界層の影響）
{
  const bins = [[0, 300], [300, 700], [700, 1500]];
  bins.forEach(([lo, hi]) => {
    const ratio = [], dd = [];
    R2.forEach((r, i) => {
      for (let k = 0; k < nT; k++) {
        const pr = profile(r, k);
        const l = pr.lv.filter(x => LV_AUTO.includes(x.p) && x.z != null && x.w && x.z >= zmOf(i)).sort((a, b) => a.z - b.z)[0];
        if (!l || !pr.sfc.w || l.spd < 3) continue;
        const h = l.z - zmOf(i);
        if (h < lo || h >= hi) continue;
        ratio.push(pr.sfc.spd / l.spd);
        let d = Math.abs(pr.sfc.dir - l.dir) % 360; dd.push(d > 180 ? 360 - d : d);
      }
    });
    console.log(`  10m風 ÷ 最下面の風（最下面がモデル地形の上 ${lo}〜${hi}m）: 比 ${fs(stats(ratio))}／風向差 中央${f1(stats(dd).med)}°`);
  });
}
console.log();

/* ---- ⑥ MSM → GSM の切り替わり ---- */
console.log('## ⑥ モデルの切り替わり（seamless が msm / gsm のどちらと一致するか）');
if (!R4) console.log('  取れなかった');
else {
  R4.forEach((r, i) => {
    const h = r.hourly, pk = SW_PEAKS[i];
    const segs = [];
    let cur = null, from = 0;
    for (let k = 0; k < h.time.length; k++) {
      const s = h.wind_speed_850hPa_jma_seamless?.[k] ?? h.wind_speed_850hPa?.[k];
      const m = h.wind_speed_850hPa_jma_msm?.[k], g = h.wind_speed_850hPa_jma_gsm?.[k];
      const tag = s == null ? '欠' : (s === m ? 'MSM' : (s === g ? 'GSM' : '他'));
      if (tag !== cur) { if (cur) segs.push(`${cur} ${h.time[from].slice(5)}〜${h.time[k - 1].slice(5)}`); cur = tag; from = k; }
    }
    segs.push(`${cur} ${h.time[from].slice(5)}〜${h.time[h.time.length - 1].slice(5)}`);
    const msmLast = (h.wind_speed_850hPa_jma_msm || []).map((v, k) => v != null ? k : -1).filter(k => k >= 0).pop();
    const s800 = h.wind_speed_800hPa_jma_seamless || [];
    const n800 = s800.filter(v => v != null).length;
    const g800 = h.wind_speed_800hPa_jma_gsm ? h.wind_speed_800hPa_jma_gsm.filter(v => v != null).length : '変数ごと無い';
    console.log(`  ${pk.name}: ${segs.join(' → ')}`);
    console.log(`    MSM の最後の時刻 ${msmLast != null ? h.time[msmLast] : '-'}／seamless の800hPa ${n800}/${s800.length}時刻／gsm の800hPa ${g800}`);
  });
  // GSM 期間の時間方向の細かさ（1時間ごとに値が動くか＝補間されているか）
  const h = R4[0].hourly, g = h.wind_speed_850hPa_jma_gsm || [];
  const k1 = g.findIndex(v => v != null);
  if (k1 >= 0) console.log(`  GSM 850hPa（${SW_PEAKS[0].name}）の毎時の値: ${g.slice(k1 + 72, k1 + 85).map(f1).join(' ')}`);
  const elevs = ['jma_seamless', 'jma_msm', 'jma_gsm'].map(m => `${m}=${R4[0][`elevation_${m}`] ?? '-'}`);
  console.log(`  elevation（${SW_PEAKS[0].name}、nan 指定）: ${R4[0].elevation ?? '-'} ${elevs.join(' ')}`);
}
console.log();

/* ---- ⑦ 横断線：自動選択の案で、隣の点との風の跳び ---- */
console.log('## ⑦ 横断線での自動選択（zs=既定の elevation、zm=nan の elevation）');
if (!R3a || !R3b) console.log('  取れなかった');
else {
  let off = 0;
  for (const L of LINES) {
    const n = L.pts.length, idx = Array.from({ length: n }, (_, q) => off + q);
    off += n;
    console.log(`\n### ${L.name}`);
    console.log('   経度    地形  モデル | Z925 Z850 Z800 Z700 | 地中(モデル) | 最近傍案        | 補間案');
    for (const q of idx) {
      const pr = profile(R3b[q], k0), zs = R3a[q].elevation, zm = R3b[q].elevation;
      const under = LV_AUTO.filter(p => { const l = lvOf(pr, p); return l.z != null && l.z < zm; }).join(',') || '-';
      const a = autoPick(pr, zs, zm, 'lowestAbove'), b = autoPick(pr, zs, zm, 'interp');
      const fmt = x => x ? `${x.used.padEnd(7)} ${f1(spdOf(x.w))} ${d16(dirOf(x.w)).padEnd(3)}` : '-';
      console.log(`  ${R3b[q].longitude.toFixed(3)} ${f0(zs)} ${f0(zm)}  | ${LV_AUTO.map(p => f0(lvOf(pr, p).z)).join(' ')} | ${under.padEnd(12)} | ${fmt(a)} | ${fmt(b)}`);
    }
    // 全時刻（MSM の範囲＝800hPa がある時刻）で、隣の点との差
    const jumps = { '10m': [], '850hPa': [], '700hPa': [], 最近傍案: [], 補間案: [] };
    let levelSwitch = 0, pairs = 0;
    for (let k = 0; k < nT; k++) {
      for (let q = idx[0]; q < idx[idx.length - 1]; q++) {
        const A = profile(R3b[q], k), B = profile(R3b[q + 1], k);
        if (lvOf(A, 800).w == null || lvOf(B, 800).w == null) continue;
        const za = [R3a[q].elevation, R3b[q].elevation], zb = [R3a[q + 1].elevation, R3b[q + 1].elevation];
        const pa = autoPick(A, ...za, 'lowestAbove'), pb = autoPick(B, ...zb, 'lowestAbove');
        const ia = autoPick(A, ...za, 'interp'), ib = autoPick(B, ...zb, 'interp');
        if (!pa || !pb || !ia || !ib) continue;
        pairs++;
        if (pa.used !== pb.used) levelSwitch++;
        if (A.sfc.w && B.sfc.w) jumps['10m'].push(vdiff(A.sfc.w, B.sfc.w));
        if (lvOf(A, 850).w && lvOf(B, 850).w) jumps['850hPa'].push(vdiff(lvOf(A, 850).w, lvOf(B, 850).w));
        if (lvOf(A, 700).w && lvOf(B, 700).w) jumps['700hPa'].push(vdiff(lvOf(A, 700).w, lvOf(B, 700).w));
        jumps.最近傍案.push(vdiff(pa.w, pb.w));
        jumps.補間案.push(vdiff(ia.w, ib.w));
      }
    }
    console.log(`  隣の点（約5.6km）との風の差 m/s（MSM の時刻すべて）:`);
    for (const [kk, v] of Object.entries(jumps)) console.log(`    ${kk.padEnd(6, '　')} ${fs(stats(v))}`);
    console.log(`  最近傍案で隣と層が変わる組: ${levelSwitch}/${pairs}`);
  }
}
console.log();

/* ---- 峰での自動選択の内訳（ABC判定の層と並べる） ---- */
console.log('## 峰（山頂標高）での自動選択の内訳（MSM の範囲）');
{
  const cnt = {};
  let diffAbc = 0, n = 0;
  peaks.forEach((pk, i) => {
    for (let k = 0; k < nT; k++) {
      const pr = profile(R2[i], k);
      if (lvOf(pr, 800).w == null) continue;
      const b = autoPick(pr, pk.elev, zmOf(i), 'interp');
      if (!b) continue;
      n++;
      cnt[b.used] = (cnt[b.used] || 0) + 1;
      const a = autoPick(pr, pk.elev, zmOf(i), 'lowestAbove');
      if (a && a.used !== String(windLevelFor(pk.elev)[0])) diffAbc++;
    }
  });
  console.log(`  ${Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' / ')}（計 ${n}）`);
  console.log(`  最近傍案の層が ABC判定の層（固定表）と違う: ${diffAbc}/${n}`);
}
console.log('\n以上。');
