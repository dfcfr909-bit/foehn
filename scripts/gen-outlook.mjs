// ============================================================
// foehn AI全国概況 生成スクリプト
//   - Open-Meteoから全国の海面気圧格子＋代表都市の日別予報を取得
//   - 気圧配置の手がかりを軽く算出（西高東低/移動性高気圧 等）
//   - GLM(Z.ai, OpenAI互換API)に「与えたデータのみを根拠に」概況文を書かせる
//   - outlook.json として出力（GitHub Pagesで静的配信）
//
// 実行:  GLM_API_KEY=xxx node scripts/gen-outlook.mjs
//   環境変数:
//     GLM_API_KEY   Z.ai(GLM) APIキー（必須。本番はGitHub Secrets）
//     OUTLOOK_MODEL 使用モデル（既定 glm-4.6。glm-5.2 等に変更可）
//     GLM_BASE_URL  APIベースURL（既定 https://api.z.ai/api/paas/v4）
//     OUTLOOK_OUT   出力パス（既定 ./outlook.json）
//     MOCK=1        ネットワークを使わず内蔵フィクスチャで自己テスト
// ============================================================

const MODEL = process.env.OUTLOOK_MODEL || 'glm-4.6';
const GLM_BASE_URL = (process.env.GLM_BASE_URL || 'https://api.z.ai/api/paas/v4').replace(/\/$/, '');
const OUT_PATH = process.env.OUTLOOK_OUT || new URL('../outlook.json', import.meta.url).pathname;
const MOCK = process.env.MOCK === '1';

// 全国の代表都市（概況の言語化に使う）
const CITIES = [
  { name: '札幌', lat: 43.06, lon: 141.35 },
  { name: '仙台', lat: 38.27, lon: 140.87 },
  { name: '東京', lat: 35.69, lon: 139.69 },
  { name: '新潟', lat: 37.90, lon: 139.02 },
  { name: '長野', lat: 36.65, lon: 138.18 },
  { name: '名古屋', lat: 35.18, lon: 136.91 },
  { name: '大阪', lat: 34.69, lon: 135.50 },
  { name: '広島', lat: 34.40, lon: 132.46 },
  { name: '高知', lat: 33.56, lon: 133.53 },
  { name: '福岡', lat: 33.59, lon: 130.40 },
  { name: '那覇', lat: 26.21, lon: 127.68 },
];

// 気圧配置判定用の格子（日本周辺）
const GRID_LATS = [30, 34, 38, 42, 45];
const GRID_LONS = [128, 132, 136, 140, 144];

const WCODE_JP = [
  [0, '快晴'], [1, '晴れ'], [2, '晴れ時々曇り'], [3, '曇り'],
  [45, '霧'], [48, '霧'], [51, '霧雨'], [53, '霧雨'], [55, '霧雨'],
  [61, '弱い雨'], [63, '雨'], [65, '強い雨'], [66, '着氷性の雨'], [67, '着氷性の雨'],
  [71, '弱い雪'], [73, '雪'], [75, '強い雪'], [77, '霧雪'],
  [80, 'にわか雨'], [81, 'にわか雨'], [82, '激しいにわか雨'],
  [85, 'にわか雪'], [86, '強いにわか雪'],
  [95, '雷雨'], [96, '雷雨(雹)'], [99, '激しい雷雨'],
];
function wcodeText(code) {
  const hit = WCODE_JP.find(([c]) => c === code);
  return hit ? hit[1] : `天気コード${code}`;
}

const DOW = ['日', '月', '火', '水', '木', '金', '土'];
function pad(n) { return String(n).padStart(2, '0'); }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function mdDow(d) { return `${d.getMonth() + 1}/${d.getDate()}(${DOW[d.getDay()]})`; }

// JSTの「今日0時」を返す（Actionsランナーは通常UTCなので明示補正）
function jstToday() {
  const nowUtcMs = Date.now();
  const jst = new Date(nowUtcMs + 9 * 3600e3);
  return new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate()));
}

// 対象日: 明日・明後日・今週末(次の土日)
function targetDates() {
  const base = jstToday();
  const addDays = n => new Date(base.getTime() + n * 24 * 3600e3);
  const tomorrow = addDays(1);
  const dayafter = addDays(2);
  // 次の土曜（今日が土なら今日、日なら翌週土は先だが「今週末」は当日+翌日扱い）
  const dow = base.getDay(); // 0=日..6=土
  let satOffset;
  if (dow === 6) satOffset = 0;         // 土曜
  else if (dow === 0) satOffset = 6;    // 日曜→次の土曜
  else satOffset = 6 - dow;             // 平日→今週土曜
  const sat = addDays(satOffset);
  const sun = addDays(satOffset + 1);
  return { tomorrow, dayafter, sat, sun };
}

// ---- Open-Meteo 取得 ----
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}: ${url}`);
  return res.json();
}

// 代表都市の日別予報（複数地点一括）
async function fetchCityDaily() {
  const lat = CITIES.map(c => c.lat).join(',');
  const lon = CITIES.map(c => c.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weathercode,precipitation_sum,temperature_2m_max,temperature_2m_min,windspeed_10m_max` +
    `&forecast_days=8&timezone=Asia%2FTokyo`;
  const json = await fetchJson(url);
  return Array.isArray(json) ? json : [json];
}

// 格子点の海面気圧（複数地点一括, hourly）
async function fetchGridPressure() {
  const lats = [], lons = [];
  for (const la of GRID_LATS) for (const lo of GRID_LONS) { lats.push(la); lons.push(lo); }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats.join(',')}&longitude=${lons.join(',')}` +
    `&hourly=pressure_msl&forecast_days=8&timezone=Asia%2FTokyo`;
  const json = await fetchJson(url);
  const arr = Array.isArray(json) ? json : [json];
  // [{lat,lon,pmsl@09:00(date)}] の形に整形するための素データを返す
  return arr.map((o, i) => ({ lat: lats[i], lon: lons[i], hourly: o.hourly }));
}

// 指定日の09:00の各格子点気圧から配置の手がかりを算出
function pressureHint(grid, date) {
  const key = `${ymd(date)}T09:00`;
  const pts = grid.map(g => {
    const idx = g.hourly.time.indexOf(key);
    return { lat: g.lat, lon: g.lon, p: idx >= 0 ? g.hourly.pressure_msl[idx] : null };
  }).filter(p => p.p != null);
  if (pts.length < 4) return null;

  const avg = pts.reduce((s, p) => s + p.p, 0) / pts.length;
  const westP = avg2(pts.filter(p => p.lon <= 132));
  const eastP = avg2(pts.filter(p => p.lon >= 140));
  const southP = avg2(pts.filter(p => p.lat <= 34));
  const northP = avg2(pts.filter(p => p.lat >= 42));
  const gradWE = (westP != null && eastP != null) ? westP - eastP : 0;   // +:西高東低傾向
  const gradNS = (southP != null && northP != null) ? southP - northP : 0; // +:南高北低傾向
  const low = pts.reduce((m, p) => (p.p < m.p ? p : m), pts[0]);
  const high = pts.reduce((m, p) => (p.p > m.p ? p : m), pts[0]);

  const tags = [];
  if (gradWE >= 6) tags.push('西高東低の傾向');
  if (gradWE <= -6) tags.push('東高西低の傾向');
  if (high.p - low.p >= 20 && near(high)) tags.push('本州付近に高気圧');
  if (low.p <= 1004 && near(low)) tags.push('日本付近に低気圧');
  if (Math.abs(gradWE) < 6 && Math.abs(gradNS) < 6 && high.p - low.p < 12) tags.push('気圧傾度は緩やか');

  return {
    date: ymd(date),
    avgHpa: Math.round(avg),
    gradWE: Math.round(gradWE),
    gradNS: Math.round(gradNS),
    lowCenter: { region: regionOf(low), hPa: Math.round(low.p) },
    highCenter: { region: regionOf(high), hPa: Math.round(high.p) },
    tags,
  };
}
function avg2(a) { return a.length ? a.reduce((s, p) => s + p.p, 0) / a.length : null; }
function near(p) { return p.lat >= 30 && p.lat <= 46 && p.lon >= 128 && p.lon <= 146; }
function regionOf(p) {
  const ns = p.lat >= 42 ? '北日本' : (p.lat >= 36 ? '東日本' : (p.lat >= 32 ? '西日本' : '南西諸島'));
  const ew = p.lon >= 140 ? '東方海上' : (p.lon <= 132 ? '西方' : '付近');
  return `${ns}${ew}`;
}

// 都市日別データから指定日の1行サマリを作る
function citySummary(cityDaily, date) {
  const key = ymd(date);
  return CITIES.map((c, i) => {
    const d = cityDaily[i]?.daily;
    if (!d) return null;
    const idx = d.time.indexOf(key);
    if (idx < 0) return null;
    return {
      city: c.name,
      weather: wcodeText(d.weathercode[idx]),
      precip: Math.round((d.precipitation_sum[idx] || 0) * 10) / 10,
      tmax: Math.round(d.temperature_2m_max[idx]),
      tmin: Math.round(d.temperature_2m_min[idx]),
      windMax: Math.round(d.windspeed_10m_max[idx]),
    };
  }).filter(Boolean);
}

// ---- GLM(Z.ai, OpenAI互換) 呼び出し ----
const PLAIN_SUFFIX = '\n必ず指定のJSONのみを出力。前置き・後書き・Markdownは一切不要。';
const SYSTEM_PROMPT =
  'あなたは日本の山岳・アウトドア向けの気象概況ライターです。' +
  '与えられた数値データ（気圧配置の手がかりと全国主要都市の日別予報）だけを根拠に、' +
  '登山者に役立つ簡潔な概況を日本語で書きます。' +
  'データに無い前線・台風・降水・気温を絶対に創作しないこと。断定を避け「見込み」等の表現を用いること。';

function buildUserPrompt(payload) {
  return (
    '次のデータから、各セクションの概況を2〜3文で書いてください。\n' +
    '出力は次のJSON形式のみ:\n' +
    '{"pattern":"気圧配置を数語で","weekend":"...","tomorrow":"...","dayafter":"..."}\n\n' +
    '【データ(JSON)】\n' + JSON.stringify(payload)
  );
}

async function callGLM(payload) {
  const body = {
    model: MODEL,
    temperature: 0.6,
    max_tokens: 900,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(payload) + PLAIN_SUFFIX },
    ],
  };
  const res = await fetch(`${GLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${process.env.GLM_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (json.error) throw new Error(`GLM ${json.error.code || ''}: ${json.error.message}`);
  if (!res.ok) throw new Error(`GLM HTTP ${res.status}: ${JSON.stringify(json).slice(0, 160)}`);
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('GLM: 空レスポンス');
  return text;
}

// JSON抽出（前後にゴミが混じっても最初の{...}を拾う）
function parseModelJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('モデル出力からJSONを抽出できません: ' + text.slice(0, 120));
  return JSON.parse(m[0]);
}

// ---- モック（ネットワーク無し自己テスト用） ----
function mockCityDaily() {
  const base = jstToday();
  return CITIES.map((c, ci) => {
    const time = [], weathercode = [], precipitation_sum = [], temperature_2m_max = [], temperature_2m_min = [], windspeed_10m_max = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date(base.getTime() + i * 24 * 3600e3);
      time.push(ymd(d));
      weathercode.push([0, 2, 3, 61][(i + ci) % 4]);
      precipitation_sum.push((i + ci) % 4 === 3 ? 8 : 0);
      temperature_2m_max.push(24 - ci * 0.7);
      temperature_2m_min.push(16 - ci * 0.7);
      windspeed_10m_max.push(4 + ((i + ci) % 5) * 2);
    }
    return { daily: { time, weathercode, precipitation_sum, temperature_2m_max, temperature_2m_min, windspeed_10m_max } };
  });
}
function mockGrid() {
  const base = jstToday();
  const lats = [], lons = [];
  for (const la of GRID_LATS) for (const lo of GRID_LONS) { lats.push(la); lons.push(lo); }
  return lats.map((la, i) => {
    const lo = lons[i];
    const time = [], pressure_msl = [];
    for (let d = 0; d < 8; d++) {
      const dd = new Date(base.getTime() + d * 24 * 3600e3);
      for (let h = 0; h < 24; h++) {
        time.push(`${ymd(dd)}T${pad(h)}:00`);
        // 西で高く東で低い（西高東低）っぽい擬似場
        pressure_msl.push(1016 - (lo - 136) * 0.8 + Math.sin(d) * 2);
      }
    }
    return { lat: la, lon: lo, hourly: { time, pressure_msl } };
  });
}

async function main() {
  // キー未設定時は失敗させず静かにスキップ（セットアップ前のcronを赤くしない）
  if (!MOCK && !process.env.GLM_API_KEY) {
    console.log('ℹ️ GLM_API_KEY が未設定のため生成をスキップします（Secrets登録後に有効化）。');
    return;
  }
  const t = targetDates();
  const [cityDaily, grid] = MOCK
    ? [mockCityDaily(), mockGrid()]
    : await Promise.all([fetchCityDaily(), fetchGridPressure()]);

  const payload = {
    generatedAt: new Date().toISOString(),
    hints: {
      weekend: [pressureHint(grid, t.sat), pressureHint(grid, t.sun)].filter(Boolean),
      tomorrow: pressureHint(grid, t.tomorrow),
      dayafter: pressureHint(grid, t.dayafter),
    },
    cities: {
      weekendSat: citySummary(cityDaily, t.sat),
      weekendSun: citySummary(cityDaily, t.sun),
      tomorrow: citySummary(cityDaily, t.tomorrow),
      dayafter: citySummary(cityDaily, t.dayafter),
    },
    labels: {
      weekend: `今週末 ${mdDow(t.sat)}〜${mdDow(t.sun)}`,
      tomorrow: `明日 ${mdDow(t.tomorrow)}`,
      dayafter: `明後日 ${mdDow(t.dayafter)}`,
    },
  };

  let model;
  if (MOCK) {
    model = { pattern: '西高東低（モック）', weekend: '週末は西高東低の傾向で日本海側は雲が多く、太平洋側は晴れる見込み。', tomorrow: '明日は各地で晴れ間が広がる見込み。', dayafter: '明後日は気圧の谷の接近で山沿いは雲が増える見込み。' };
  } else {
    model = parseModelJson(await callGLM(payload));
  }

  const outlook = {
    generatedAt: payload.generatedAt,
    model: MODEL,
    pattern: String(model.pattern || '').slice(0, 40),
    sections: [
      { key: 'weekend', label: payload.labels.weekend, text: String(model.weekend || '').trim() },
      { key: 'tomorrow', label: payload.labels.tomorrow, text: String(model.tomorrow || '').trim() },
      { key: 'dayafter', label: payload.labels.dayafter, text: String(model.dayafter || '').trim() },
    ].filter(s => s.text),
    disclaimer: 'AIによる全国概況（参考）。正式な予報は気象庁を確認してください。',
  };

  const { writeFileSync } = await import('node:fs');
  writeFileSync(OUT_PATH, JSON.stringify(outlook, null, 2) + '\n');
  console.log(`✅ outlook.json を書き出しました (${outlook.sections.length}セクション, model=${MODEL}${MOCK ? ', MOCK' : ''})`);
  console.log(JSON.stringify(outlook, null, 2));
}

import { fileURLToPath } from 'node:url';
const isEntry = process.argv[1] === fileURLToPath(import.meta.url);
if (isEntry) {
  main().catch(e => { console.error('❌ 生成失敗:', e.message); process.exit(1); });
}

export { targetDates, pressureHint, citySummary, mockGrid, mockCityDaily, buildUserPrompt, parseModelJson, callGLM };
