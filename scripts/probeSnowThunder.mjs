/* 降雪の目安・雷雨の目安（SSI）の入力が、Open-Meteo の JMA モデルで返るかを調べる。
 *
 * なぜ要るか:
 *   降雪の目安（気温・降水・凍結高度）と雷雨の目安（850hPa の気温・露点、500hPa の気温）を
 *   作る前に、**その変数が JMA モデルで本当に返るか**を確かめる。
 *   「返るはず」で実装を始めると、実機で初めて全部 null だと分かる（ADR-0011 と同じ形）。
 *   要件は docs/requirements_snow_thunder_hint.md、Issue は #126。
 *
 *   ⚠ **開発環境から Open-Meteo へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」の target `snow-thunder` から手動実行する。
 *
 * ⚠ **調べるだけ。判定も表示も何も変えない。**
 *
 * 調べること:
 *   A. 変数ごとに、モデル（jma_seamless / jma_msm / jma_gsm）で値が返るか（null の割合・現在時刻の値）
 *   B. elevation=nan（モデル標高）と既定（標高補正あり）で temperature_2m がどう違うか
 *      → 要件の「T = T2m + 0.0065 × (モデル標高 − z_ref)」の前提（気温がモデル標高の値か）の確認
 *   C. 850hPa・500hPa の気温と露点（または相対湿度）が揃うか → SSI を自前で計算できるか
 *   D. 1回の要求に複数地点・全変数を載せられるか（応答の大きさ・時間・レート関連ヘッダ）
 *
 * 使い方:
 *   node scripts/probeSnowThunder.mjs            # 実際に叩く
 *   node scripts/probeSnowThunder.mjs --dry-run  # 叩かずに要求のURLだけ出す（手元の確認用）
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OM = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT = 30000;
const DRY = process.argv.includes('--dry-run');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const die = msg => { console.error(`✗ ${msg}`); process.exit(1); };

/* ---- 地点: areas.json の峰（座標は写さない）＋ 平地の対照 ---- */
const areas = JSON.parse(readFileSync(join(ROOT, 'areas.json'), 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks);
const peak = name => peaks.find(p => p.name === name) || die(`areas.json に「${name}」が無い`);
const SITES = [
  { ...peak('白馬岳'), tag: '北アルプス（日本海側の雪）' },
  { ...peak('谷川岳'), tag: '谷川連峰（日本海側と太平洋側の境）' },
  { ...peak('皇海山'), tag: '日光（モデル標高との差が大きい峰・ADR-0011）' },
  { name: '宇都宮', lat: 36.5551, lon: 139.8828, elev: 119, tag: '平地の対照' },
];

const MODELS = ['jma_seamless', 'jma_msm', 'jma_gsm'];

/* ---- 調べる変数 ---- */
const VARS = {
  '降雪の目安（段階2）': [
    'temperature_2m', 'precipitation', 'snowfall', 'freezing_level_height',
  ],
  '雷雨の目安（段階3）': [
    'temperature_850hPa', 'dew_point_850hPa', 'relative_humidity_850hPa',
    'temperature_500hPa', 'geopotential_height_850hPa', 'geopotential_height_500hPa',
    'cape', 'lifted_index',
  ],
  '雲量（段階1の文言）': ['cloud_cover', 'cloud_cover_low', 'cloud_cover_mid', 'cloud_cover_high'],
};
const ALL_VARS = Object.values(VARS).flat();

/* ---- 通信 ---- */
let calls = 0;
const buildUrl = (pts, vars, extra = {}) => {
  const q = new URLSearchParams({
    latitude: pts.map(p => p.lat).join(','),
    longitude: pts.map(p => p.lon).join(','),
    hourly: vars.join(','),
    timezone: 'Asia/Tokyo',
    wind_speed_unit: 'ms',          // ★既定はkm/h（ADR-0005）。ここでは風を取らないが作法をそろえる
    cell_selection: 'nearest',      // 既定の land は標高の近い隣の格子を選び直す
    past_days: '1',
    forecast_days: '3',
    ...extra,
  });
  return `${OM}?${q}`;
};

/* 返り値: { ok, status, arr, ms, kb, headers } */
async function om(label, url) {
  if (DRY) { console.log(`  [${label}] ${url}`); return { ok: false, dry: true }; }
  const t0 = Date.now();
  let res, text;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    text = await res.text();
  } catch (e) {
    const c = e.cause ? ` (${e.cause.code || ''} ${e.cause.message || e.cause})` : '';
    console.log(`  [${label}] 通信できない: ${e.message}${c} / ${Date.now() - t0}ms`);
    return { ok: false };
  }
  calls++;
  const ms = Date.now() - t0;
  const kb = text.length / 1024;
  const rl = [...res.headers.entries()].filter(([k]) => /rate|limit|usage/i.test(k))
    .map(([k, v]) => `${k}=${v}`).join(' ');
  if (!res.ok) {
    let reason = text.slice(0, 200).replace(/\s+/g, ' ');
    try { reason = JSON.parse(text).reason || reason; } catch (e) { /* 本文のまま */ }
    console.log(`  [${label}] HTTP ${res.status} / ${ms}ms${rl ? ` / ${rl}` : ''}\n    ${reason}`);
    return { ok: false, status: res.status, reason };
  }
  /* ⚠ HTTP 200 でも本文が途中で切れて JSON でないことがある（probeWindField.mjs の注） */
  try {
    const json = JSON.parse(text);
    return { ok: true, status: res.status, arr: Array.isArray(json) ? json : [json], ms, kb, rl };
  } catch (e) {
    console.log(`  [${label}] JSON でない応答: ${text.slice(0, 120).replace(/\s+/g, ' ')}`);
    return { ok: false, status: res.status };
  }
}

/* ---- 現在時刻に最も近い添字 ---- */
function nowIndex(times) {
  const now = Date.now();
  let best = 0, bd = Infinity;
  times.forEach((t, i) => {
    // timezone=Asia/Tokyo の "YYYY-MM-DDTHH:MM" は JST。+09:00 を付けて絶対時刻にする
    const d = Math.abs(new Date(`${t}:00+09:00`).getTime() - now);
    if (d < bd) { bd = d; best = i; }
  });
  return best;
}

/* ---- 1変数の要約 ---- */
function summarize(r, v, k) {
  const a = r.hourly && r.hourly[v];
  if (!a) return { state: '無し（キーが返らない）' };
  const n = a.length, nn = a.filter(x => x != null).length;
  if (nn === 0) return { state: `全部 null（${n}時間）` };
  const state = nn === n ? `返る（${n}/${n}）` : `一部のみ（${nn}/${n}）`;
  return { state, now: a[k] == null ? null : a[k], nn, n };
}
const fmt = x => x == null ? '-' : (Number.isFinite(x) ? String(Math.round(x * 100) / 100) : String(x));

/* =====================================================================
   A. モデル × 変数
   ===================================================================== */
const availability = {};            // availability[モデル][変数] = true|false（全時間 null でなければ true）
async function sectionA() {
  console.log('\n## A. 変数ごとに返るか（地点は4つ・過去1日＋先3日）');
  for (const model of MODELS) {
    console.log(`\n### モデル ${model}`);
    availability[model] = {};
    let r = await om(`${model} 全変数`, buildUrl(SITES, ALL_VARS, { models: model, elevation: SITES.map(() => 'nan').join(',') }));
    if (r.dry) continue;            // --dry-run: URL を出すだけ
    let perVar = false;
    if (!r.ok) {
      /* 知らない変数が1つでもあると 400 になる。**どの変数が原因か**を切り分けるため、1つずつ取り直す */
      console.log('  → 全変数まとめては失敗。1変数ずつ取り直して原因を探す');
      perVar = true;
    }
    for (const v of ALL_VARS) {
      let rr = r;
      if (perVar) {
        await sleep(500);
        rr = await om(`${model} ${v}`, buildUrl(SITES, [v], { models: model, elevation: SITES.map(() => 'nan').join(',') }));
      }
      if (!rr.ok) {
        availability[model][v] = false;
        console.log(`  ${v.padEnd(28)} ✗ 取得できない${rr.reason ? `（${rr.reason}）` : ''}`);
        continue;
      }
      // 地点ごとの要約を1行に
      const cells = SITES.map((s, i) => {
        const res = rr.arr[i];
        if (!res || !res.hourly) return `${s.name}:応答なし`;
        const k = nowIndex(res.hourly.time);
        const sm = summarize(res, v, k);
        return `${s.name}:${sm.state}${sm.now != null ? ` 今=${fmt(sm.now)}` : ''}`;
      });
      const ok = SITES.some((s, i) => {
        const res = rr.arr[i];
        const a = res && res.hourly && res.hourly[v];
        return a && a.some(x => x != null);
      });
      availability[model][v] = ok;
      console.log(`  ${v.padEnd(28)} ${ok ? '○' : '×'} ${cells.join(' / ')}`);
    }
    await sleep(2000);
  }
}

/* =====================================================================
   B. elevation=nan（モデル標高）と既定（標高補正）で気温がどう違うか
   ===================================================================== */
async function sectionB() {
  console.log('\n## B. 気温の標高補正（jma_seamless）: elevation=nan（モデル標高）と既定を比べる');
  console.log('   既定は実際の地形に補正した標高・気温になる（ADR-0012）。nan はモデル地形のまま。');
  const vars = ['temperature_2m'];
  const rn = await om('elevation=nan', buildUrl(SITES, vars, { models: 'jma_seamless', elevation: SITES.map(() => 'nan').join(',') }));
  await sleep(1000);
  const rd = await om('既定', buildUrl(SITES, vars, { models: 'jma_seamless' }));
  if (DRY || !rn.ok || !rd.ok) { console.log('  比較できない（どちらかの取得に失敗）'); return; }
  console.log('  地点         公称標高  nan標高  既定標高  nan気温  既定気温  差(既定-nan)  標高差  実効の減率(℃/km)');
  SITES.forEach((s, i) => {
    const a = rn.arr[i], b = rd.arr[i];
    if (!a || !b || !a.hourly || !b.hourly) { console.log(`  ${s.name}  応答なし`); return; }
    const k = nowIndex(a.hourly.time);
    const ta = a.hourly.temperature_2m[k], tb = b.hourly.temperature_2m[k];
    const ea = a.elevation, eb = b.elevation;
    const dT = (ta != null && tb != null) ? tb - ta : null;
    const dZ = (ea != null && eb != null) ? eb - ea : null;
    const lapse = (dT != null && dZ != null && Math.abs(dZ) >= 50) ? (-dT / dZ * 1000) : null;
    console.log(`  ${s.name.padEnd(8)} ${String(s.elev).padStart(6)}m ${fmt(ea).padStart(7)} ${fmt(eb).padStart(8)} ${fmt(ta).padStart(8)} ${fmt(tb).padStart(8)} ${fmt(dT).padStart(10)} ${fmt(dZ).padStart(8)} ${fmt(lapse).padStart(10)}`);
  });
  console.log('   読み方: 標高差が±50m以上あるのに気温差が0なら、気温は標高補正されていない（要件の補正式が要る）。');
  console.log('           実効の減率が 6.5 前後なら、既定は標高補正した気温（nan 側はモデル標高の気温）と読める。');
}

/* =====================================================================
   C. SSI を自前で計算できるか
   ===================================================================== */
function sectionC() {
  console.log('\n## C. SSI（ショワルター安定指数）を自前で計算できるか');
  console.log('   SSI = T500 − T_P（T_P: 850hPa の空気塊を 500hPa まで持ち上げた温度）。');
  console.log('   必要: 850hPa の気温・露点（または相対湿度から換算）、500hPa の気温');
  if (DRY) return;
  for (const model of MODELS) {
    const av = availability[model] || {};
    const t850 = av.temperature_850hPa, td850 = av.dew_point_850hPa, rh850 = av.relative_humidity_850hPa, t500 = av.temperature_500hPa;
    const humid = td850 ? '露点' : (rh850 ? '相対湿度' : null);
    const can = t850 && t500 && humid;
    console.log(`  ${model.padEnd(13)} ${can ? `○ 計算できる（湿り: ${humid}）` : '× 計算できない'}` +
      `  [T850:${t850 ? '○' : '×'} Td850:${td850 ? '○' : '×'} RH850:${rh850 ? '○' : '×'} T500:${t500 ? '○' : '×'}]` +
      `  代用: cape:${av.cape ? '○' : '×'} lifted_index:${av.lifted_index ? '○' : '×'}`);
  }
  console.log('   ⚠ lifted_index（地表の空気塊）はショワルター（850hPa の空気塊）とは別物。cape も別の指標。');
}

/* =====================================================================
   D. 1回の要求に複数地点・全変数を載せられるか
   ===================================================================== */
async function sectionD() {
  console.log('\n## D. 1回の要求に載せる（jma_seamless・全変数・20地点）');
  const pts = [];
  // 白馬岳の近くを 0.1° おきに並べた20点（取得の重さを見るだけ。位置に意味は無い）
  for (let i = 0; i < 20; i++) pts.push({ lat: +(36.5 + (i % 5) * 0.1).toFixed(4), lon: +(137.5 + Math.floor(i / 5) * 0.125).toFixed(4) });
  const r = await om('20地点×全変数', buildUrl(pts, ALL_VARS, {
    models: 'jma_seamless', elevation: pts.map(() => 'nan').join(','), past_days: '1', forecast_days: '3',
  }));
  if (r.ok) console.log(`  HTTP ${r.status} / ${r.kb.toFixed(0)}KB / ${r.ms}ms${r.rl ? ` / ${r.rl}` : ''}`);
  console.log('  ⚠ Open-Meteo は「地点数 × 変数の数 × 日数」で呼び出し数を数える（公式の説明）。');
  console.log('    実際の重みは上のレート関連ヘッダ（あれば）で見る。無ければ、風の取得（1地点あたり約1.7回）と比べる。');
}

/* ---- 実行 ---- */
console.log('# 降雪・雷雨の目安の入力を調べる（#126）');
console.log(`実行: ${new Date().toISOString()} ${DRY ? '（--dry-run: 叩かない）' : ''}`);
console.log('地点: ' + SITES.map(s => `${s.name}(${s.lat},${s.lon})`).join(' / '));
await sectionA();
await sectionB();
sectionC();
await sectionD();
console.log(`\n通信回数: ${calls}`);
if (!DRY && calls === 0) die('1回も通信できなかった（ネットワーク）');
