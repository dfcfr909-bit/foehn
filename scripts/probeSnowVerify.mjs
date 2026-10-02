/* 降雪の目安の標高補正が、実際の高地でどれだけ外れるかを、アメダスの気温の観測と
 * Open-Meteo の「当時の予報」（Previous Runs）を突き合わせて測る。
 *
 * なぜ要るか:
 *   降雪の目安（v4.151.0・#131）は、モデル標高の2m気温を稜線の高さへ 0.0065℃/m で補正して、
 *   雨・みぞれ・雪に分ける。閾値は仮置きで、「実地でズレが出たら直す」方針（#133）。
 *   そのとき**原因が補正式か、モデルの外れか、閾値か**を切り分ける道具がこれ。要件は
 *   docs/requirements_snow_thunder_hint.md、Issue は #134。
 *
 *   ⚠ **開発環境から気象庁・Open-Meteo へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」の target `snow-verify` から手動実行する。
 *
 * ⚠ **調べるだけ。判定も表示も何も変えない。**
 *
 * 比べるもの（局の標高で）:
 *   raw  … モデル標高の2m気温（elevation=nan。Windy の2m気温と同じ＝地形の補正なし）
 *   補正 … raw + 0.0065 × (モデル標高 − 局の標高)  ← 本体の降雪の目安と同じ式
 *   ⚠ 減率と閾値の幅は本体（sotoki_v4.html の SNOW_HINT）から読む。写さない（写し違いを作らない）
 *
 * 出すもの: 誤差（予報 − 観測）のバイアス・平均絶対誤差・10〜90% の幅を、
 *   モデル（MSM／GSM）× 何日前の予報か × 方式 × 標高帯 で。
 *   目安: 平均絶対誤差が「みぞれの幅（SLEET_MAX_C − SNOW_MAX_C）」を超えると、境の気温を詰めても意味が薄い。
 *
 * ⚠ 制約（先に知っておくこと）:
 *   ・アメダスの点データは**約1週間しか遡れない**（14日前は404・#134 の調査）
 *   ・高標高の局は少なく、**稜線の上にあるとは限らない**。日射・風の影響も受ける（観測側の誤差）
 *   ・格子約5〜50kmに対して観測は1点（代表性）
 *   ・雨か雪かの正解は取れない（気温だけ）
 *
 * ⚠ **キー名・URLを推測で断定しない。** 取れなかった局・時刻・API は理由を出す（黙って捨てない）。
 *
 * 使い方:
 *   node scripts/probeSnowVerify.mjs              # 実際に叩く（既定：標高の高い10局・5日）
 *   STATIONS=14 DAYS=6 node scripts/probeSnowVerify.mjs
 *   node scripts/probeSnowVerify.mjs --dry-run    # 叩かずに、選ぶ局と要求のURLだけ出す
 *   node scripts/probeSnowVerify.mjs --selftest   # 通信せず、集計の答え合わせだけ
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const JMA = 'https://www.jma.go.jp/bosai/amedas';
const OM_PREV = 'https://previous-runs-api.open-meteo.com/v1/forecast';
const OM_HIST = 'https://historical-forecast-api.open-meteo.com/v1/forecast';
const TIMEOUT = 30000;
const DRY = process.argv.includes('--dry-run');
const SELFTEST = process.argv.includes('--selftest');
const N_STATIONS = Math.max(1, Number(process.env.STATIONS) || 10);
const DAYS = Math.min(7, Math.max(1, Number(process.env.DAYS) || 5));   // 点データは約1週間まで
const LEADS = [0, 1, 2, 3];                                              // 何日前の予報か（0＝その日の直近の予報）
const MODELS = ['jma_msm', 'jma_gsm'];
const BAND_SPLIT_M = 1400;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = n => String(n).padStart(2, '0');
const die = msg => { console.error(`✗ ${msg}`); process.exit(1); };

/* ---- 本体から減率と閾値の幅を読む（写さない） ---- */
function readAppConstants() {
  const html = readFileSync(join(ROOT, 'sotoki_v4.html'), 'utf8');
  const blk = html.match(/const SNOW_HINT = \{([\s\S]*?)\n\};/);
  if (!blk) die('sotoki_v4.html から SNOW_HINT を読めない（本体の書き方が変わった？）');
  const num = k => {
    const m = blk[1].match(new RegExp(`${k}:\\s*([0-9.]+)`));
    if (!m) die(`SNOW_HINT.${k} を読めない`);
    return Number(m[1]);
  };
  return { lapse: num('LAPSE_C_PER_M'), snowMax: num('SNOW_MAX_C'), sleetMax: num('SLEET_MAX_C') };
}

/* ---- 集計の道具（--selftest で答え合わせする） ---- */
function quantile(sorted, q) {
  if (!sorted.length) return null;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round(q * (sorted.length - 1))));
  return sorted[i];
}
// 誤差の配列（予報 − 観測）→ { n, bias, mae, p10, p90 }
function statsOf(errs) {
  const a = errs.filter(Number.isFinite).sort((x, y) => x - y);
  if (!a.length) return { n: 0 };
  const sum = a.reduce((s, x) => s + x, 0);
  const abs = a.reduce((s, x) => s + Math.abs(x), 0);
  return { n: a.length, bias: sum / a.length, mae: abs / a.length, p10: quantile(a, 0.1), p90: quantile(a, 0.9) };
}
const corrected = (raw, zModel, zStation, lapse) => raw + lapse * (zModel - zStation);

if (SELFTEST) {
  const eq = (a, b, label) => { if (Math.abs(a - b) > 1e-9) die(`selftest NG: ${label} … ${a} ≠ ${b}`); console.log(`  ok ${label}`); };
  const obs = [0, 2, 4], fc = [10, 12, 14];
  eq(corrected(10, 1000, 2000, 0.0065), 3.5, '補正：モデル標高が局より1,000m低い→ −6.5℃');
  const rawErr = fc.map((x, i) => x - obs[i]);
  const corErr = fc.map((x, i) => corrected(x, 1000, 2000, 0.0065) - obs[i]);
  eq(statsOf(rawErr).bias, 10, 'raw のバイアス');
  eq(statsOf(corErr).bias, 3.5, '補正のバイアス');
  eq(statsOf(corErr).mae, 3.5, '補正の平均絶対誤差');
  eq(statsOf([-2, -1, 0, 1, 2]).mae, 1.2, '符号が混ざる平均絶対誤差');
  eq(statsOf([-2, -1, 0, 1, 2]).bias, 0, '符号が混ざるバイアス');
  eq(statsOf([5, NaN, 5]).n, 2, '欠測（NaN）は数えない');
  eq(quantile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.1), 2, '10%点');
  eq(quantile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.9), 9, '90%点');
  console.log('selftest OK');
  process.exit(0);
}

const C = readAppConstants();
const WIDTH = C.sleetMax - C.snowMax;
console.log('# 降雪の目安の標高補正の検証（#134）');
console.log(`実行: ${new Date().toISOString()} ${DRY ? '（--dry-run: 叩かない）' : ''}`);
console.log(`本体の定数: 減率 ${C.lapse}℃/m・雪 ≦${C.snowMax}℃・みぞれ ≦${C.sleetMax}℃（みぞれの幅 ${WIDTH}℃）`);
console.log(`設定: 局 ${N_STATIONS}・${DAYS}日分・何日前の予報か ${LEADS.join('/')}・モデル ${MODELS.join('/')}`);

/* ---- 通信 ---- */
let calls = 0;
async function getJson(url, label) {
  if (DRY) { console.log(`  [${label}] ${url}`); return null; }
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
    calls++;
    if (!res.ok) return { error: `HTTP ${res.status}`, body: (await res.text()).slice(0, 200).replace(/\s+/g, ' ') };
    return { json: await res.json() };
  } catch (e) {
    const c = e.cause ? ` (${e.cause.code || ''} ${e.cause.message || e.cause})` : '';
    return { error: `通信できない: ${e.message}${c}` };
  }
}

/* ---- ① 局を選ぶ（標高の高い順） ---- */
const deg = ([d, m]) => d + m / 60;
const tbl = await getJson(`${JMA}/const/amedastable.json`, '局の一覧');
let stations;
if (DRY) {
  stations = [{ code: '00000', name: '（dry-run）', alt: 2000, lat: 36.0, lon: 138.0 }];
} else {
  if (tbl.error) die(`局の一覧を取れない: ${tbl.error}`);
  stations = Object.entries(tbl.json)
    .map(([code, s]) => ({ code, name: s.kjName, alt: s.alt, lat: deg(s.lat), lon: deg(s.lon), elems: String(s.elems || '') }))
    /* ⚠ 気温を観測する局だけ。elems の先頭が '1' の局は気温あり、'0' は無し（#134 の最初の実行で、
       先頭が '0' の7局は点データに temp が1件も無く、先頭が '1' の3局は全時間そろっていた）。
       標高の高い順に取ると、降水だけの局（御嶽山・上高地など）ばかり選んで検証が空振りした */
    .filter(s => typeof s.alt === 'number' && s.alt >= 1000 && s.elems[0] === '1')
    .sort((a, b) => b.alt - a.alt)
    .slice(0, N_STATIONS);
}
console.log(`\n## ① 検証する局（標高 1,000m 以上で気温を観測する局を、標高の高い順に ${stations.length} 局）`);
for (const s of stations) console.log(`  ${s.code}  ${String(s.alt).padStart(5)}m  ${s.name}  (${s.lat.toFixed(3)}, ${s.lon.toFixed(3)})`);

/* ---- ② 観測：点データ（3時間ごとのファイル）から毎正時の気温 ---- */
const latestTxt = DRY ? null : await fetch(`${JMA}/data/latest_time.txt`, { signal: AbortSignal.timeout(TIMEOUT) }).then(r => r.text()).catch(() => null);
const lm = latestTxt && latestTxt.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
if (!DRY && !lm) die('latest_time を解釈できない: ' + latestTxt);
// JST の壁時計のまま扱う（Date を経由して時差を作らない）
const today = DRY ? { y: 2026, m: 1, d: 1, h: 12 } : { y: +lm[1], m: +lm[2], d: +lm[3], h: +lm[4] };
const dateBack = back => {
  const t = new Date(Date.UTC(today.y, today.m - 1, today.d - back));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
};
const obsByStation = new Map();         // code -> Map(hourKey -> temp)
const obsNote = new Map();              // code -> { blocks, missing, badFlag }
async function fetchObs(s) {
  const temps = new Map();
  const note = { blocks: 0, missing: 0, badFlag: 0, noTemp: 0 };
  const jobs = [];
  for (let back = 0; back <= DAYS; back++) {
    const dt = dateBack(back);
    for (let hh = 0; hh < 24; hh += 3) {
      if (back === 0 && hh > today.h) continue;       // まだ来ていないファイル
      jobs.push(`${JMA}/data/point/${s.code}/${dt.y}${pad(dt.m)}${pad(dt.d)}_${pad(hh)}.json`);
    }
  }
  if (DRY) { console.log(`  [観測 ${s.name}] ${jobs[0]} ほか ${jobs.length - 1} 本`); return { temps, note }; }
  // 同時に4本まで（相手に優しく）
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < jobs.length) {
      const url = jobs[next++];
      const r = await getJson(url, '観測');
      note.blocks++;
      if (r.error) { note.missing++; continue; }
      for (const [k, v] of Object.entries(r.json)) {
        // キーは yyyymmddhhmmss。毎正時（分が 00）だけ使う
        if (!/^\d{14}$/.test(k) || k.slice(10, 12) !== '00') continue;
        const t = v && v.temp;
        if (!Array.isArray(t) || t[0] == null) { note.noTemp++; continue; }
        if (t[1] !== 0) { note.badFlag++; continue; }          // 品質フラグが 0（正常）以外は使わない
        temps.set(`${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}T${k.slice(8, 10)}:00`, t[0]);
      }
      await sleep(80);
    }
  }));
  return { temps, note };
}
console.log(`\n## ② アメダスの気温（毎正時・品質フラグ 0 のみ）`);
for (const s of stations) {
  const { temps, note } = await fetchObs(s);
  obsByStation.set(s.code, temps); obsNote.set(s.code, note);
  if (!DRY) console.log(`  ${s.name.padEnd(6)} ${String(temps.size).padStart(4)}時間ぶん  （ファイル ${note.blocks}・取れず ${note.missing}・気温なし ${note.noTemp}・品質不良 ${note.badFlag}）`);
}

/* ---- ③ 予報：当時の予報（Previous Runs）。取れなければ Historical Forecast に落ちる（0日前のみ） ---- */
const pastDays = DAYS + 1;
const prevVars = LEADS.map(l => l === 0 ? 'temperature_2m' : `temperature_2m_previous_day${l}`);
const forecasts = new Map();             // model -> { source, leads: Map(lead -> [per station: Map(hourKey -> temp)]), zModel: [per station] }
async function fetchForecast(model) {
  const common = {
    latitude: stations.map(s => s.lat).join(','), longitude: stations.map(s => s.lon).join(','),
    elevation: stations.map(() => 'nan').join(','),   // モデル標高の気温を取る（補正は自前＝本体と同じ作法）
    cell_selection: 'nearest', models: model, timezone: 'Asia/Tokyo', past_days: String(pastDays), forecast_days: '1',
  };
  const tries = [
    { source: 'Previous Runs API', base: OM_PREV, vars: prevVars, leads: LEADS },
    { source: 'Historical Forecast API（0日前のみ）', base: OM_HIST, vars: ['temperature_2m'], leads: [0] },
  ];
  for (const t of tries) {
    const q = new URLSearchParams({ ...common, hourly: t.vars.join(',') });
    const r = await getJson(`${t.base}?${q}`, `${model} ${t.source}`);
    if (DRY) continue;
    if (r.error) { console.log(`  ${model}: ${t.source} ✗ ${r.error} ${r.body || ''}`); continue; }
    const arr = Array.isArray(r.json) ? r.json : [r.json];
    const leads = new Map();
    t.leads.forEach((l, i) => {
      leads.set(l, arr.map(rec => {
        const h = rec && rec.hourly, a = h && h[t.vars[i]];
        const m = new Map();
        if (a) h.time.forEach((tm, k) => { if (a[k] != null) m.set(tm, a[k]); });
        return m;
      }));
    });
    const zModel = arr.map(rec => (rec && typeof rec.elevation === 'number') ? rec.elevation : null);
    console.log(`  ${model}: ${t.source} ○（局 ${arr.length}・各日前の有効な時間数 ${t.leads.map(l => `${l}日前=${leads.get(l).reduce((s, m) => s + m.size, 0)}`).join(' ')}）`);
    return { source: t.source, leads, zModel };
  }
  return null;
}
console.log(`\n## ③ Open-Meteo の当時の予報（${MODELS.join('・')}）`);
for (const model of MODELS) {
  const f = await fetchForecast(model);
  if (f) forecasts.set(model, f);
  await sleep(1000);
}
if (DRY) { console.log(`\n通信回数: ${calls}（--dry-run）`); process.exit(0); }
if (!forecasts.size) die('どのモデルも当時の予報を取れなかった（Previous Runs も Historical Forecast も失敗）');

/* ---- ④ 突き合わせ ---- */
const band = s => s.alt >= BAND_SPLIT_M ? `${BAND_SPLIT_M}m以上` : `1000〜${BAND_SPLIT_M}m`;
const rows = new Map();                  // key -> errs[]
const perStation = new Map();            // `${model}|${lead}|${code}|${method}` -> errs[]
const todRows = new Map();               // `${model}|${method}|${band}|${tod}`（1日前の予報のみ）-> errs[]
const todOf = hk => { const h = +hk.slice(11, 13); return h >= 9 && h <= 15 ? '昼(9〜15時)' : (h >= 21 || h <= 5) ? '夜(21〜5時)' : '朝夕'; };
const push = (m, key, e) => { if (!m.has(key)) m.set(key, []); m.get(key).push(e); };
for (const [model, f] of forecasts) {
  for (const [lead, perSt] of f.leads) {
    stations.forEach((s, i) => {
      const obs = obsByStation.get(s.code), fc = perSt[i], zm = f.zModel[i];
      if (!obs || !fc || zm == null) return;
      for (const [hk, raw] of fc) {
        const o = obs.get(hk);
        if (o == null) continue;
        const eRaw = raw - o;
        const eCor = corrected(raw, zm, s.alt, C.lapse) - o;
        for (const [method, e] of [['raw', eRaw], ['補正', eCor]]) {
          push(rows, `${model}|${lead}|${method}|${band(s)}`, e);
          push(rows, `${model}|${lead}|${method}|全局`, e);
          push(perStation, `${model}|${lead}|${s.code}|${method}`, e);
          if (lead === 1) push(todRows, `${model}|${method}|${band(s)}|${todOf(hk)}`, e);
        }
      }
    });
  }
}
const f1 = x => x == null || !Number.isFinite(x) ? '    -' : x.toFixed(1).padStart(5);
console.log(`\n## ④ 誤差（予報 − 観測。℃）。目安：平均絶対誤差が ${WIDTH}℃（みぞれの幅）以内なら、境の気温を詰める意味がある`);
console.log('   モデル   日前  方式   標高帯          n    バイアス  平均絶対   10%    90%   目安');
const keys = [...rows.keys()].sort();
for (const k of keys) {
  const [model, lead, method, b] = k.split('|');
  const st = statsOf(rows.get(k));
  if (!st.n) continue;
  console.log(`   ${model.padEnd(8)} ${lead}日前  ${method.padEnd(3)}  ${b.padEnd(13)} ${String(st.n).padStart(5)}  ${f1(st.bias)}   ${f1(st.mae)}  ${f1(st.p10)} ${f1(st.p90)}   ${st.mae <= WIDTH ? '○' : '×'}`);
}

console.log(`\n## ⑤ 局ごとのバイアス（予報 − 観測。1日前の予報）`);
console.log('   局           標高  モデル標高   MSM raw  MSM 補正   GSM raw  GSM 補正  実効の減率(MSM・℃/km)');
stations.forEach((s, i) => {
  const cell = (model, method) => {
    const e = perStation.get(`${model}|1|${s.code}|${method}`);
    return e ? f1(statsOf(e).bias) : '    -';
  };
  const zm = forecasts.get('jma_msm') ? forecasts.get('jma_msm').zModel[i] : null;
  /* 実効の減率：raw の誤差 ÷ (局の標高 − モデル標高)。標高差が小さい（±300m 未満）局は誤差に埋もれるので出さない。
     本体の減率（0.0065℃/m＝6.5℃/km）と比べて、補正が効きすぎ／足りないかを読む */
  const eRaw = perStation.get(`jma_msm|1|${s.code}|raw`);
  const dz = zm == null ? null : s.alt - zm;
  const eff = (eRaw && dz != null && Math.abs(dz) >= 300) ? statsOf(eRaw).bias / dz * 1000 : null;
  console.log(`   ${s.name.padEnd(6)} ${String(s.alt).padStart(6)}m ${zm == null ? '      -' : String(Math.round(zm)).padStart(6) + 'm'}  ${cell('jma_msm', 'raw')}  ${cell('jma_msm', '補正')}   ${cell('jma_gsm', 'raw')}  ${cell('jma_gsm', '補正')}   ${eff == null ? '        -' : f1(eff)}`);
});

console.log(`\n## ⑥ 時間帯別（1日前の予報。昼は日射でモデルの2m気温が暖まり、夜は放射冷却で冷える）`);
console.log('   モデル   方式   標高帯          時間帯        n    バイアス  平均絶対');
for (const k of [...todRows.keys()].sort()) {
  const [model, method, b, tod] = k.split('|');
  const st = statsOf(todRows.get(k));
  if (!st.n) continue;
  console.log(`   ${model.padEnd(8)} ${method.padEnd(3)}  ${b.padEnd(13)} ${tod.padEnd(10)} ${String(st.n).padStart(5)}  ${f1(st.bias)}   ${f1(st.mae)}`);
}
console.log('\n読み方: バイアスが正＝予報が観測より暖かい（雪を雨と見誤る側）、負＝寒い（雨を雪と見誤る側）。');
console.log('        raw と 補正 を比べて、補正で 0 に近づけば標高補正が効いている。補正後も一方向にずれるなら補正式（減率）か局の代表性を疑う。');
console.log(`\n通信回数: ${calls}`);
