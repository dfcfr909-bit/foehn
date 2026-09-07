/* 「山頂がモデル地形より100m以上高くない」ときの安全弁（ADR-0006）に、
 * 110峰のうち何峰が掛かっているかを数える。
 *
 * なぜ要るか:
 *   至仏山（2,228m）で、モデル地形が 2,133m。差が 95m しかないため安全弁が働き、
 *   詳細画面は**地上10m風に落ちていた**（2026-09-06 は終日 A、800hPa は 22.8 m/s）。
 *   ⚠ 一方 **ランキングはモデル標高を渡さない**ので同じ峰でも気圧面風を使う。
 *     同じ日の同じ山が、ランキングでは C、詳細では A になりうる。
 *   これが至仏山だけの不運なのか、何峰も掛かっているのかで打ち手が変わる。
 *
 *   ⚠ **開発環境から Open-Meteo へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」から手動実行する。
 *
 * ⚠ **調べるだけ。判定も表示も何も変えない。**
 * ⚠ 相手を叩く回数は**1回**。全峰をまとめて1リクエストで引く（アプリのランキングと同じ形）。
 * ⚠ 判定の分かれ目は本体の pickWindSource をそのまま切り出して動かす。書き写さない。
 *
 * 使い方: node scripts/probeWindGap.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const die = msg => { console.error(`✗ ${msg}`); process.exit(1); };

/* ---- 本体から判定の分かれ目を切り出す（写さない） ---- */
const html = readFileSync(join(ROOT, 'sotoki_v4.html'), 'utf8');
const grab = (re, what) => {
  const m = html.match(re);
  if (!m) die(`sotoki_v4.html から ${what} を読めない（本体の書き方が変わった？）`);
  return m[0];
};
const src = [
  grab(/const WIND_LEVELS = \[[\s\S]*?\n\];/, 'WIND_LEVELS'),
  grab(/const WIND_LEVEL_MIN_RISE = \d+;/, 'WIND_LEVEL_MIN_RISE'),
  grab(/function windLevelFor\([\s\S]*?\n\}/, 'windLevelFor'),
  grab(/function pickWindSource\([\s\S]*?\n\}\n/, 'pickWindSource'),
].join('\n');
const pickWindSource = new Function(`${src}\nreturn pickWindSource;`)();
const MIN_RISE = +grab(/const WIND_LEVEL_MIN_RISE = \d+;/, 'WIND_LEVEL_MIN_RISE').match(/\d+/)[0];

/* ---- 全峰 ---- */
const areas = JSON.parse(readFileSync(join(ROOT, 'areas.json'), 'utf8'));
const peaks = areas.areas.flatMap(a => a.peaks.map(p => ({ ...p, area: a.name })));
console.log(`${peaks.length}峰を1リクエストでまとめて引きます（安全弁のしきい ${MIN_RISE}m）`);

const url = 'https://api.open-meteo.com/v1/forecast'
  + `?latitude=${peaks.map(p => p.lat).join(',')}`
  + `&longitude=${peaks.map(p => p.lon).join(',')}`
  + '&hourly=windspeed_10m&forecast_days=1&timezone=Asia%2FTokyo'
  + '&wind_speed_unit=ms&models=jma_seamless';
const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
if (!res.ok) die(`HTTP ${res.status}`);
let json = await res.json();
if (!Array.isArray(json)) json = [json];
if (json.length !== peaks.length) die(`返ってきた地点数が合わない: ${json.length} / ${peaks.length}`);

/* ---- 数える ---- */
const rows = peaks.map((p, i) => {
  const modelM = json[i].elevation;
  // 詳細画面はモデル標高が分かる。ランキングは山頂標高を指定して取るので分からない
  const detail = pickWindSource(p.elev, modelM);
  const rank = pickWindSource(p.elev, null);
  return { p, modelM, gap: p.elev - modelM, detail, rank };
});

const fell = rows.filter(r => r.detail.kind === 'ground');
const split = rows.filter(r => r.detail.kind !== r.rank.kind);

console.log(`\n安全弁で地上10m風に落ちる峰: ${fell.length} / ${rows.length}`);
console.log(`うち、ランキングとで判定に使う風が食い違う峰: ${split.length}`);

const fmt = r => `  ${r.p.name.padEnd(8, '　')} ${String(r.p.elev).padStart(4)}m`
  + ` / モデル ${String(Math.round(r.modelM)).padStart(4)}m`
  + ` / 差 ${String(Math.round(r.gap)).padStart(4)}m`
  + `  詳細=${r.detail.kind === 'ground' ? '地上10m' : r.detail.hPa + 'hPa'}`
  + `  ランキング=${r.rank.kind === 'ground' ? '地上10m' : r.rank.hPa + 'hPa'}`
  + `  （${r.p.area}）`;

console.log('\n── 落ちる峰（差が小さい順）');
for (const r of [...fell].sort((a, b) => a.gap - b.gap)) console.log(fmt(r));

/* ⚠ しきいを動かしたら何峰が救われるかも一緒に出す。
   「100を80にすれば直る」で終わらせず、**どこに何峰かたまっているか**を見るため */
console.log('\n── しきいを変えると救われる峰の数（差がしきい以上なら気圧面風を使う）');
for (const th of [0, 25, 50, 75, 100, 150, 200, 300]) {
  const n = rows.filter(r => r.gap > th).length;
  console.log(`  しきい ${String(th).padStart(3)}m: 気圧面風を使う峰 ${String(n).padStart(3)} / ${rows.length}`
    + (th === MIN_RISE ? '  ← いまの設定' : ''));
}
