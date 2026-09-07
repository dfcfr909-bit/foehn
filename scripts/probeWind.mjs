/* 予報の風速と実測（体感）が食い違った日を、あとから突き合わせる。
 *
 * なぜ要るか:
 *   2026-09-06 の至仏山で「表示より現地の風が明らかに強かった」という報告が出た。
 *   ⚠ **このとき報告に欠けていたのは「アプリが何 m/s と出していたか」だけ。**
 *   そこが空欄のままだと、原因の議論が全部あてずっぽうになる。ここで埋める。
 *
 *   ⚠ **開発環境から Open-Meteo へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」から手動実行する。
 *
 * ⚠ **調べるだけ。判定も表示も何も変えない。**
 *
 * ⚠ **風の層の選び方（ADR-0006）を、この場で書き写さないこと。**
 *   写した瞬間に本体とずれる。sotoki_v4.html から実際の定義を読み出し、
 *   読めなければ**黙って既定値に落ちずに止まる**。
 *
 * 使い方:
 *   PEAK=至仏山 DATE=2026-09-06 node scripts/probeWind.mjs
 *   （DATE 省略時は前日。PEAK は areas.json の峰の名前）
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT = 30000;

const PEAK = process.env.PEAK || '至仏山';
const DATE = process.env.DATE || new Date(Date.now() - 864e5).toISOString().slice(0, 10);

const die = msg => { console.error(`✗ ${msg}`); process.exit(1); };

/* ---- 峰を探す ---- */
const areas = JSON.parse(readFileSync(join(ROOT, 'areas.json'), 'utf8'));
let peak = null, areaName = null;
for (const a of areas.areas) {
  for (const p of a.peaks) if (p.name === PEAK) { peak = p; areaName = a.name; }
}
if (!peak) die(`areas.json に「${PEAK}」が無い`);

/* ---- 本体から風の決まりを読み出す（写さない） ---- */
const html = readFileSync(join(ROOT, 'sotoki_v4.html'), 'utf8');

// ⚠ 行末の注釈にも「]」が入る（[hPa, 高度m] と書いてある）。
// 括弧の手前で切ろうとすると読めない。宣言の終わり「\n];」まで丸ごと取る
const lvSrc = html.match(/const WIND_LEVELS = \[([\s\S]*?)\n\];/);
if (!lvSrc) die('sotoki_v4.html から WIND_LEVELS を読めない（本体の書き方が変わった？）');
const LEVELS = [...lvSrc[1].matchAll(/\[(\d+),\s*(\d+)\]/g)].map(m => [+m[1], +m[2]]);
if (!LEVELS.length) die('WIND_LEVELS が空に見える');

const riseSrc = html.match(/const WIND_LEVEL_MIN_RISE = (\d+)/);
if (!riseSrc) die('sotoki_v4.html から WIND_LEVEL_MIN_RISE を読めない');
const MIN_RISE = +riseSrc[1];

const thSrc = html.match(/day:\s*\{\s*windA:\s*(\d+),\s*windB:\s*(\d+)\s*\}/);
if (!thSrc) die('sotoki_v4.html から THRESH.day の風速閾値を読めない');
const [WIND_A, WIND_B] = [+thSrc[1], +thSrc[2]];

const windLevelFor = elevM =>
  LEVELS.reduce((best, lv) => Math.abs(lv[1] - elevM) < Math.abs(best[1] - elevM) ? lv : best, LEVELS[0]);

const abcWind = v => v <= WIND_A ? 'A' : v <= WIND_B ? 'B' : 'C';

/* ---- 取得 ---- */
const lvVars = LEVELS.map(([hPa]) => `wind_speed_${hPa}hPa,wind_direction_${hPa}hPa`).join(',');
const days = Math.ceil((Date.parse(`${new Date().toISOString().slice(0, 10)}T00:00:00Z`)
  - Date.parse(`${DATE}T00:00:00Z`)) / 864e5);
if (!(days >= 0)) die(`DATE=${DATE} は未来（この道具は過ぎた日を見るためのもの）`);
if (days > 90) die(`DATE=${DATE} は古すぎる（past_days は92日まで）`);

async function get(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) });
  if (!res.ok) die(`HTTP ${res.status} — ${url}`);
  return res.json();
}

const base = `https://api.open-meteo.com/v1/forecast?latitude=${peak.lat}&longitude=${peak.lon}`
  + `&timezone=Asia%2FTokyo&wind_speed_unit=ms&past_days=${Math.max(days, 1)}&forecast_days=1&hourly=`;
const MAIN = `windspeed_10m,winddirection_10m,${lvVars}`;

console.log(`風の突き合わせ: ${PEAK}（${areaName}）${peak.elev}m  ${peak.lat}, ${peak.lon}`);
console.log(`対象日: ${DATE}（JST）`);
console.log(`本体から読んだ決まり: 層=${LEVELS.map(l => l[0]).join('/')}hPa`
  + ` / 気圧面へ切り替える高さの差=${MIN_RISE}m / 風のABC閾値=${WIND_A}・${WIND_B} m/s`);

const j = await get(`${base}${MAIN}&models=jma_seamless`);
// ⚠ 突風は JMAモデルが返さない。本体も models を指定しない別リクエストで取っている
// （fetchSupplemental）。ここで models 付きのまま取ると、アプリが実際に出している
// 突風とは違うもの（全部 --）を見て「突風も出ていない」と誤読する
const jg = await get(`${base}wind_gusts_10m`);
const gust = new Map();
for (let i = 0; i < jg.hourly.time.length; i++) {
  if (jg.hourly.wind_gusts_10m[i] != null) gust.set(jg.hourly.time[i], jg.hourly.wind_gusts_10m[i]);
}
const modelElev = j.elevation;
console.log(`\nモデル地形の標高: ${modelElev}m（山頂との差 ${Math.round(peak.elev - modelElev)}m）`);

const useLevel = peak.elev > modelElev + MIN_RISE;
const [hPa, alt] = windLevelFor(peak.elev);
console.log(useLevel
  ? `→ アプリが判定に使う風: ${hPa}hPa（標準大気で約${alt}m）の風`
  : `→ アプリが判定に使う風: 地上10m風（山頂がモデル地形より${MIN_RISE}m以上高くない）`);

const h = j.hourly;
const idx = [...h.time.keys()].filter(i => h.time[i].startsWith(DATE));
if (!idx.length) die(`${DATE} のデータが返ってこない`);

const pad = (v, n) => String(v == null ? '--' : v).padStart(n);
console.log(`\n時刻   判定風  ABC   10m  突風  ` + LEVELS.map(([p]) => pad(p + 'hPa', 7)).join(''));
let maxJudge = -Infinity, maxGust = -Infinity;
for (const i of idx) {
  const j10 = h.windspeed_10m[i];
  const lv = useLevel ? h[`wind_speed_${hPa}hPa`][i] : j10;
  const g = gust.get(h.time[i]);
  if (lv != null) maxJudge = Math.max(maxJudge, lv);
  if (g != null) maxGust = Math.max(maxGust, g);
  console.log(`${h.time[i].slice(11, 16)} ${pad(lv, 6)}   ${lv == null ? '-' : abcWind(lv)}  `
    + `${pad(j10, 5)} ${pad(g, 5)}  `
    + LEVELS.map(([p]) => pad(h[`wind_speed_${p}hPa`][i], 7)).join(''));
}
console.log(`\n${DATE} の最大: 判定に使う風 ${maxJudge} m/s（${abcWind(maxJudge)}）`
  + (isFinite(maxGust) ? `／ 突風 ${maxGust} m/s（${(maxGust / maxJudge).toFixed(2)}倍）` : '／ 突風は取れなかった'));

/* ⚠ 判定に使わなかった層も最大を並べる。
   「地上10m風に落ちた日に、上の層がどうだったか」がこの調べものの肝。
   落ちたこと自体は画面に出ているが、**いくら見落としたか**は出ていない */
console.log('\n各層の最大（判定に使っていない層も含む）:');
for (const [p, alt] of LEVELS) {
  const vals = idx.map(i => h[`wind_speed_${p}hPa`][i]).filter(v => v != null);
  if (!vals.length) continue;
  const mx = Math.max(...vals);
  const mark = (useLevel && p === hPa) ? ' ← 判定に使用' : '';
  console.log(`  ${String(p).padStart(4)}hPa（約${String(alt).padStart(4)}m）: ${String(mx).padStart(6)} m/s（${abcWind(mx)}）${mark}`);
}
const near = windLevelFor(peak.elev);
if (!useLevel) {
  const vals = idx.map(i => h[`wind_speed_${near[0]}hPa`][i]).filter(v => v != null);
  const mx = vals.length ? Math.max(...vals) : null;
  console.log(`\n⚠ 地上10m風に落ちている。山頂高度に最も近い層は ${near[0]}hPa（約${near[1]}m）で、`
    + `その日の最大は ${mx} m/s（${mx == null ? '-' : abcWind(mx)}）。`);
  console.log(`  判定に使った ${maxJudge} m/s（${abcWind(maxJudge)}）との差は ${(mx - maxJudge).toFixed(2)} m/s。`);
}

/* ---- ADR-0006 の「elevation は風に効かない」を毎回確かめ直す ---- */
console.log('\n── elevation を渡すと風が変わるか（ADR-0006で「効かない」と結論した点）');
const j2 = await get(`${base}${MAIN}&models=jma_seamless&elevation=${peak.elev}`);
const same = idx.every(i => h.windspeed_10m[i] === j2.hourly.windspeed_10m[i])
  && idx.every(i => !useLevel || h[`wind_speed_${hPa}hPa`][i] === j2.hourly[`wind_speed_${hPa}hPa`][i]);
console.log(`  応答の elevation: ${j.elevation} → ${j2.hourly ? j2.elevation : '?'}`);
console.log(same
  ? '  風速は1点も変わらない → ADR-0006 のとおり。elevation では直らない'
  : '  ⚠ 風速が変わった。ADR-0006 の前提が崩れているので読み直すこと');
