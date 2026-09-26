/* MSM → GSM の切り替わり（jma_seamless の継ぎ目）を実データで確かめる。Phase 1a ⑥。
 *
 * なぜ要るか:
 *   jma_seamless は GSM（0.5°・6時間）の上に MSM（地上0.0625°・1時間／上空0.125°・3時間）を
 *   重ねたもの（open-meteo の ForecastapiController.swift）。高度別の風の場は
 *   「いまの時刻がどちらのモデルの値か」「その時刻にどの層が存在するか」を知っていないと、
 *   無い層を黙って別の層で埋めたり、粗いモデルの値を細かい値と同列に描いたりする。
 *   確かめること:
 *     - seamless が msm と一致する最後の時刻（層ごと・地上ごと）＝切り替わりの正確な時刻
 *     - 800/900hPa が null になる条件（msm が null の時刻と一致するか）
 *     - GSM 期間の値が1時間ごとに動くか（時間方向の補間の有無）
 *     - モデル地形（msm と gsm で elevation=nan が何を返すか）
 *     - 継ぎ目の前後で風が跳ぶか（毎時の変化の大きさと比べる）
 *
 *   ⚠ 開発環境から Open-Meteo へ到達できない。Actions「外部の情報源を調べる」（target: wind-seam）から。
 * ⚠ 調べるだけ。何も変えない。要求は3回（1回目のあとは再試行つき）。
 *
 * 使い方: node scripts/probeWindSeam.mjs
 */
const OM = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT = 60000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 峰（MSM の格子で山地・盆地・平野が混ざるように）
const PTS = [
  { name: '谷川岳', lat: 36.8371, lon: 138.9301 },
  { name: '至仏山', lat: 36.9034, lon: 139.1732 },
  { name: '槍ヶ岳', lat: 36.342, lon: 137.6477 },
  { name: '火打山', lat: 36.9227, lon: 138.0681 },
  { name: '富士山', lat: 35.3606, lon: 138.7274 },
  { name: '宇都宮', lat: 36.555, lon: 139.883 },
  { name: '新潟', lat: 37.902, lon: 139.023 },
  { name: '札幌', lat: 43.062, lon: 141.354 },
];
const LV = [925, 900, 850, 800, 700];
const MODELS = ['jma_seamless', 'jma_msm', 'jma_gsm'];

async function om(label, params) {
  const url = `${OM}?${new URLSearchParams(params)}`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const t0 = Date.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
      const text = await res.text();
      console.log(`  [${label}] HTTP ${res.status} / ${(text.length / 1024).toFixed(0)}KB / ${Date.now() - t0}ms`);
      if (!res.ok) { console.log(`    ${text.slice(0, 200)}`); return null; }
      const j = JSON.parse(text);
      return Array.isArray(j) ? j : [j];
    } catch (e) {
      const c = e.cause ? ` (${e.cause.code || e.cause.message || e.cause})` : '';
      console.log(`  [${label}] 失敗 ${e.message}${c} / ${Date.now() - t0}ms`);
      await sleep(10000);
    }
  }
  return null;
}

const common = {
  latitude: PTS.map(p => p.lat).join(','), longitude: PTS.map(p => p.lon).join(','),
  timezone: 'Asia/Tokyo', wind_speed_unit: 'ms', cell_selection: 'nearest',
  past_days: '1', forecast_days: '7',
  elevation: PTS.map(() => 'nan').join(','),
};
const VARS = ['wind_speed_10m', 'wind_direction_10m',
  ...LV.map(p => `wind_speed_${p}hPa`), 'wind_direction_850hPa',
  'geopotential_height_850hPa', 'geopotential_height_800hPa'];

console.log('# MSM → GSM の切り替わり（jma_seamless の継ぎ目）');
console.log(`実行時刻: ${new Date().toISOString()}\n`);
console.log('## 通信');
const R = await om('3モデル並べて', { ...common, hourly: VARS.join(','), models: MODELS.join(',') });
await sleep(3000);
const RM = await om('msm のモデル地形', { ...common, hourly: 'wind_speed_10m', models: 'jma_msm', past_days: '0', forecast_days: '1' });
await sleep(3000);
const RG = await om('gsm のモデル地形', { ...common, hourly: 'wind_speed_10m', models: 'jma_gsm', past_days: '0', forecast_days: '1' });
console.log();
if (!R) { console.log('✗ 本体の要求が通らなかった'); process.exit(1); }

const f1 = x => (x == null || !Number.isFinite(x)) ? '   -' : x.toFixed(1).padStart(5);
const col = (h, v, m) => h[`${v}_${m}`] || null;
const rng = (arr, time) => {
  if (!arr) return '変数ごと無い';
  const ks = arr.map((v, k) => v != null ? k : -1).filter(k => k >= 0);
  return ks.length ? `${time[ks[0]].slice(5)} 〜 ${time[ks[ks.length - 1]].slice(5)}（${ks.length}時刻）` : '全部 null';
};
const uv = (s, d) => (s == null || d == null) ? null : [-s * Math.sin(d * Math.PI / 180), -s * Math.cos(d * Math.PI / 180)];

/* ---- 1. 層ごとの存在期間 ---- */
console.log('## 1. 層ごとの存在期間（1地点目。他の地点も同じかは 2 で見る）');
{
  const h = R[0].hourly, t = h.time;
  console.log(`  時刻の範囲: ${t[0]} 〜 ${t[t.length - 1]}（${t.length}時刻）`);
  for (const v of ['wind_speed_10m', ...LV.map(p => `wind_speed_${p}hPa`)]) {
    console.log(`  ${v.padEnd(20)} seamless ${rng(col(h, v, 'jma_seamless'), t)}`);
    console.log(`  ${''.padEnd(20)} msm      ${rng(col(h, v, 'jma_msm'), t)}`);
    console.log(`  ${''.padEnd(20)} gsm      ${rng(col(h, v, 'jma_gsm'), t)}`);
  }
}
console.log();

/* ---- 2. seamless がどちらと一致するか（切り替わりの時刻・全地点） ---- */
console.log('## 2. seamless が msm / gsm のどちらと一致するか（地点ごと・変数ごとの区間）');
const seamAt = {};   // `${点}:${変数}` -> 最初に gsm 側になった時刻の index
R.forEach((r, i) => {
  const h = r.hourly, t = h.time;
  for (const v of ['wind_speed_10m', 'wind_speed_850hPa', 'wind_speed_800hPa', 'wind_speed_900hPa', 'wind_speed_925hPa', 'wind_speed_700hPa']) {
    const s = col(h, v, 'jma_seamless'), m = col(h, v, 'jma_msm'), g = col(h, v, 'jma_gsm');
    if (!s) continue;
    const segs = [];
    let cur = null, from = 0;
    for (let k = 0; k < t.length; k++) {
      const tag = s[k] == null ? '欠' : (m && s[k] === m[k]) ? 'MSM' : (g && s[k] === g[k]) ? 'GSM' : '他';
      if (tag !== cur) { if (cur) segs.push(`${cur} ${t[from].slice(5, 13)}〜${t[k - 1].slice(5, 13)}`); cur = tag; from = k; }
      if (tag === 'GSM' && seamAt[`${i}:${v}`] == null) seamAt[`${i}:${v}`] = k;
    }
    segs.push(`${cur} ${t[from].slice(5, 13)}〜${t[t.length - 1].slice(5, 13)}`);
    console.log(`  ${PTS[i].name.padEnd(4, '　')} ${v.replace('wind_speed_', '').padEnd(7)} ${segs.join(' → ')}`);
  }
});
console.log();

/* ---- 3. 800/900 が null になる条件 ---- */
console.log('## 3. seamless の 800/900hPa が null の時刻と、msm が null の時刻は一致するか');
for (const p of [900, 800]) {
  let same = 0, diff = 0;
  R.forEach(r => {
    const s = col(r.hourly, `wind_speed_${p}hPa`, 'jma_seamless'), m = col(r.hourly, `wind_speed_${p}hPa`, 'jma_msm');
    if (!s || !m) return;
    s.forEach((v, k) => { if ((v == null) === (m[k] == null)) same++; else diff++; });
  });
  console.log(`  ${p}hPa: 一致 ${same} / 不一致 ${diff}`);
}
console.log();

/* ---- 4. 時間方向の細かさ ---- */
console.log('## 4. 毎時の値が動くか（前の時刻と同じ値の割合。6時間おきの値を並べただけなら 5/6 が同値）');
{
  const h = R[0].hourly;
  for (const [v, m] of [['wind_speed_10m', 'jma_msm'], ['wind_speed_850hPa', 'jma_msm'], ['wind_speed_10m', 'jma_gsm'], ['wind_speed_850hPa', 'jma_gsm']]) {
    const a = col(h, v, m);
    if (!a) continue;
    let n = 0, same = 0;
    for (let k = 1; k < a.length; k++) if (a[k] != null && a[k - 1] != null) { n++; if (a[k] === a[k - 1]) same++; }
    console.log(`  ${m.padEnd(8)} ${v.padEnd(18)} 同値 ${same}/${n}`);
  }
  const g = col(h, 'wind_speed_850hPa', 'jma_gsm');
  const k1 = g ? g.findIndex(v => v != null) : -1;
  if (k1 >= 0) console.log(`  gsm 850hPa（${PTS[0].name}）の毎時: ${g.slice(k1 + 96, k1 + 110).map(f1).join(' ')}`);
  const m8 = col(h, 'wind_speed_850hPa', 'jma_msm');
  if (m8) console.log(`  msm 850hPa（${PTS[0].name}）の毎時: ${m8.slice(30, 44).map(f1).join(' ')}`);
}
console.log();

/* ---- 5. モデル地形 ---- */
console.log('## 5. モデル地形（elevation=nan の応答）');
PTS.forEach((p, i) => {
  console.log(`  ${p.name.padEnd(4, '　')} msm ${RM?.[i]?.elevation ?? '-'} m / gsm ${RG?.[i]?.elevation ?? '-'} m / 3モデル並べ ${R[i].elevation ?? '-'} m`);
});
console.log();

/* ---- 6. 継ぎ目の前後で風が跳ぶか ---- */
console.log('## 6. 継ぎ目での風の跳び（継ぎ目の1時間の変化 ÷ その変数のふだんの毎時の変化の中央値）');
R.forEach((r, i) => {
  const h = r.hourly;
  for (const [sv, dv] of [['wind_speed_10m', 'wind_direction_10m'], ['wind_speed_850hPa', 'wind_direction_850hPa']]) {
    const s = col(h, sv, 'jma_seamless'), d = col(h, dv, 'jma_seamless');
    const k = seamAt[`${i}:${sv}`];
    if (!s || !d || k == null || k < 1) continue;
    const steps = [];
    for (let q = 1; q < s.length; q++) {
      const a = uv(s[q - 1], d[q - 1]), b = uv(s[q], d[q]);
      if (a && b && q !== k) steps.push(Math.hypot(a[0] - b[0], a[1] - b[1]));
    }
    steps.sort((x, y) => x - y);
    const med = steps[Math.floor(steps.length / 2)] || NaN;
    const a = uv(s[k - 1], d[k - 1]), b = uv(s[k], d[k]);
    const jump = (a && b) ? Math.hypot(a[0] - b[0], a[1] - b[1]) : NaN;
    console.log(`  ${PTS[i].name.padEnd(4, '　')} ${sv.replace('wind_speed_', '').padEnd(6)} 継ぎ目 ${h.time[k - 1].slice(5, 13)}→${h.time[k].slice(5, 13)}: ` +
      `${f1(s[k - 1])}→${f1(s[k])} m/s・ベクトル差 ${f1(jump)}（ふだんの中央 ${f1(med)}、${(jump / med).toFixed(1)}倍）`);
  }
});
console.log('\n以上。');
