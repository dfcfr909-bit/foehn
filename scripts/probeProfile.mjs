/* 地点の「高さごとの風と気温」を時刻ごとに出す（#219 の切り分け用）。
 * ⚠ 調べるだけ。判定も表示も何も変えない。開発環境から Open-Meteo に届かないので Actions から手動実行する。
 * 使い方: PEAK=男体山 DATE=2026-10-10 node scripts/probeProfile.mjs （DATE は JST の日。翌朝6時まで出す）
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PEAK = process.env.PEAK || '男体山';
const DATE = process.env.DATE || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const LV = [925, 900, 850, 800, 700];

const areas = JSON.parse(readFileSync(join(ROOT, 'areas.json'), 'utf8'));
let peak = null;
for (const a of areas.areas) for (const p of a.peaks) if (p.name === PEAK) peak = p;
if (!peak) { console.error(`✗ areas.json に「${PEAK}」が無い`); process.exit(1); }

const vars = ['wind_speed_10m', 'wind_direction_10m', 'temperature_2m',
  ...LV.flatMap(p => [`wind_speed_${p}hPa`, `wind_direction_${p}hPa`, `geopotential_height_${p}hPa`, `temperature_${p}hPa`])];
const end = new Date(Date.parse(DATE) + 864e5).toISOString().slice(0, 10);
const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + peak.lat + '&longitude=' + peak.lon +
  '&models=jma_seamless&wind_speed_unit=ms&timezone=Asia%2FTokyo&start_date=' + DATE + '&end_date=' + end +
  '&hourly=' + vars.join(',');
const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
if (!r.ok) { console.error(`✗ HTTP ${r.status}`); process.exit(1); }
const j = await r.json(), h = j.hourly;

const f = (v, d = 1) => (v == null ? '  -  ' : v.toFixed(d).padStart(5));
console.log(`${PEAK}（${peak.elev}m・${peak.lat}, ${peak.lon}）JMA・モデル地形の標高 ${j.elevation}m`);
console.log('各列：風速 m/s（その気圧面の高さ m・気温 ℃）。地上は 10m 風・2m 気温');
for (let i = 0; i < h.time.length; i++) {
  const t = h.time[i];
  const hr = +t.slice(11, 13), day2 = t.slice(0, 10) !== DATE;
  if ((!day2 && hr < 15) || (day2 && hr > 6)) continue;
  const cells = LV.map(p => `${p}hPa ${f(h[`wind_speed_${p}hPa`][i])}（${Math.round(h[`geopotential_height_${p}hPa`][i] ?? NaN)}m・${f(h[`temperature_${p}hPa`][i])}）`);
  console.log(`${t.slice(5, 10)} ${t.slice(11, 16)}  地上 ${f(h.wind_speed_10m[i])}（${f(h.temperature_2m[i])}）  ` + cells.join('  '));
}
