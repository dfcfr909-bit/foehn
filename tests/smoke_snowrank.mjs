// 新雪ランキング推定エンジンの検証（通信しない。合成データで論理だけを見る）
//   ・雪水比が気温で切り替わり、実効新雪深がSLRぶん変わること
//   ・補正係数kのクランプと、分母が小さいときに補正しないこと
//   ・補正基準点がコスト最小で選ばれ、60km超は使わないこと
//   ・信頼度が距離・標高差で落ちること
//   ・評価窓が (now-24, now] と (now, now+12] であること
//   ・雪でない時間の降水を加算しないこと
//   ・URLに wind_speed_unit=ms が入っていること（既定km/hの取り違え防止）
//   ・夏季（snowキーなし）でもエラーにならず k=1 で動くこと
//   ・降雪ゼロの地点が totalCm:0 で最下位に並ぶこと
//   ・通信回数が地点数に依存しないこと
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const SR = require(join(here, '..', 'snowRanking.js'));

const fails = [];
function ok(cond, label, extra) {
  if (!cond) fails.push(label + (extra ? ` … ${JSON.stringify(extra)}` : ''));
}
function near(a, b, tol, label) { ok(Math.abs(a - b) <= tol, label, { got: a, want: b }); }

/* ---------------- 時刻の合成 ---------------- */
const NOW = new Date(2026, 0, 20, 14, 0, 0);      // 2026-01-20 14:00 JST
const p2 = n => String(n).padStart(2, '0');
const fmt = d => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}T${p2(d.getHours())}:00`;
// past_days=2 / forecast_days=2 と同じ並び（4日=96時間）
const T0 = new Date(2026, 0, 18, 0, 0, 0);
const TIMES = Array.from({ length: 96 }, (_, i) => fmt(new Date(T0.getTime() + i * 3600e3)));
const NOW_IDX = TIMES.indexOf(fmt(NOW));

/** hourlyを組み立てる。fn(i) -> {precip, snowfall, temp, wind, dir} */
function makeHourly(fn) {
  const h = { time: TIMES, precipitation: [], snowfall: [], temperature_2m: [], wind_speed_10m: [], wind_direction_10m: [] };
  for (let i = 0; i < TIMES.length; i++) {
    const v = fn(i) || {};
    h.precipitation.push(v.precip ?? 0);
    h.snowfall.push(v.snowfall ?? 0);
    h.temperature_2m.push(v.temp ?? 0);
    h.wind_speed_10m.push(v.wind ?? 0);
    h.wind_direction_10m.push(v.dir ?? 0);
  }
  return h;
}

/* ---------------- 1. 雪水比 ---------------- */
ok(SR.slrFromTemp(0) === 7, 'SLR: 0℃は7');
ok(SR.slrFromTemp(-1) === 7, 'SLR: -1℃は7（境界は含む）');
ok(SR.slrFromTemp(-3) === 11, 'SLR: -3℃は11');
ok(SR.slrFromTemp(-5) === 11, 'SLR: -5℃は11（境界）');
ok(SR.slrFromTemp(-7) === 15, 'SLR: -7℃は15');
ok(SR.slrFromTemp(-10) === 15, 'SLR: -10℃は15（境界）');
ok(SR.slrFromTemp(-15) === 20, 'SLR: -15℃は20');
near(SR.effectiveSnowCm(10, -3), 11, 1e-9, '実効新雪深: 10mm×11÷10=11cm');
near(SR.effectiveSnowCm(10, 0), 7, 1e-9, '実効新雪深: 湿雪なら同じ10mmでも7cm');
near(SR.effectiveSnowCm(10, -15), 20, 1e-9, '実効新雪深: パウダーなら20cm');
ok(SR.effectiveSnowCm(0, -10) === 0, '実効新雪深: 降水0なら0');
ok(SR.slrLabel(20) === 'パウダー' && SR.slrLabel(11) === '標準' && SR.slrLabel(7) === '湿雪',
  'SLRのラベル');

/* ---------------- 2. 補正係数 k ---------------- */
near(SR.computeK(20, 10), 2.0, 1e-9, 'k: 実測20cm/モデル10cm=2.0');
near(SR.computeK(30, 10), 2.0, 1e-9, 'k: 上限2.0でクランプ');
near(SR.computeK(1, 10), 0.5, 1e-9, 'k: 下限0.5でクランプ');
near(SR.computeK(12, 10), 1.2, 1e-9, 'k: 素直な比');
ok(SR.computeK(5, 1.9) === 1, 'k: モデル値が2cm未満なら補正しない');
ok(SR.computeK(null, 10) === 1, 'k: snow24hが欠測なら補正しない');
ok(SR.computeK(undefined, 10) === 1, 'k: snow24hが無くても落ちない');
ok(SR.computeK(10, 0) === 1, 'k: モデル0なら補正しない（0除算の回避）');

/* ---------------- 3. 基準点の選定 ---------------- */
const TABLE = {
  '54012': { kjName: '湯沢',   lat: [36, 56.0], lon: [138, 49.0], alt: 340 },
  '54046': { kjName: '藤原',   lat: [36, 51.0], lon: [139, 3.0],  alt: 700 },
  '35426': { kjName: '山形',   lat: [38, 15.0], lon: [140, 20.0], alt: 153 },
  '99999': { kjName: '遠い所', lat: [43, 0.0],  lon: [141, 0.0],  alt: 100 },
};
const MAP = {
  '54012': { snow: [180, 0], snow24h: [24, 0], temp: [-2, 0] },
  '54046': { snow: [210, 0], snow24h: [30, 0], temp: [-4, 0] },
  '35426': { snow: [40, 0],  snow24h: [8, 0],  temp: [-1, 0] },
  '99999': { snow: [90, 0],  snow24h: [12, 0], temp: [-6, 0] },
  '11111': { temp: [3, 0] },                       // 積雪を観測していない地点は候補外
};
const stations = SR.snowStations(MAP, TABLE);
ok(stations.length === 4, '基準点候補: snowキーのある4地点だけ', { got: stations.length });
ok(!stations.some(s => s.id === '11111'), '基準点候補: snowが無い地点は除外');
near(SR.dmsToDeg([36, 56.0]), 36.9333, 1e-3, '[度,分]→10進度');

const kagura = { id: 'kagura', name: 'かぐら', area: '上越', type: 'resort', lat: 36.86, lon: 138.83, elevation: 1845 };
const pickK = SR.pickStation(kagura, stations);
ok(pickK && pickK.station.name === '湯沢', 'かぐらの基準点は湯沢（コスト最小）', pickK && pickK.station.name);
ok(pickK.altDiff === 1845 - 340, '標高差は 地点 − アメダス');
// 積雪観測アメダスは谷底にしか無いので、山頂との標高差は1200mを超えやすい。
// 「近いのに信頼度low」は仕様どおりの挙動（距離ではなく標高差で落ちている）。
ok(pickK.distKm < 15, 'かぐら〜湯沢は近い', pickK.distKm);
ok(SR.confidenceOf(pickK) === 'low', 'それでも標高差1505mなのでlow（仕様どおり）');

// 60km以内に候補が無ければ補正なし
const faraway = { id: 'x', name: '遠隔', area: '?', type: 'bc', lat: 26.2, lon: 127.7, elevation: 500 };
ok(SR.pickStation(faraway, stations) === null, '60km超しか無ければ基準点なし');

// 蔵王は麓の山形しか無く、標高差が大きいので low になる想定
const zao = { id: 'zao', name: '蔵王', area: '山形', type: 'resort', lat: 38.16, lon: 140.44, elevation: 1660 };
const pickZ = SR.pickStation(zao, stations);
ok(pickZ && pickZ.station.name === '山形', '蔵王の基準点は山形');
ok(SR.confidenceOf(pickZ) === 'low', '蔵王は標高差1200m超で low', SR.confidenceOf(pickZ));

/* ---------------- 4. 信頼度 ---------------- */
ok(SR.confidenceOf(null) === 'low', '信頼度: 基準点なしはlow');
ok(SR.confidenceOf({ distKm: 10, altDiff: 500 }) === 'high', '信頼度: 近くて標高差も小さいならhigh');
ok(SR.confidenceOf({ distKm: 30, altDiff: 500 }) === 'mid', '信頼度: 25km超はmid');
ok(SR.confidenceOf({ distKm: 10, altDiff: 900 }) === 'mid', '信頼度: 標高差800m超はmid');
ok(SR.confidenceOf({ distKm: 45, altDiff: 100 }) === 'low', '信頼度: 40km超はlow');
ok(SR.confidenceOf({ distKm: 10, altDiff: -1300 }) === 'low', '信頼度: 標高差は絶対値で見る');

/* ---------------- 5. 評価窓 ---------------- */
ok(SR.findNowIndex(TIMES, NOW) === NOW_IDX, '現在index');
ok(TIMES[NOW_IDX] === '2026-01-20T14:00', '現在indexの時刻', TIMES[NOW_IDX]);
const past = SR.windowRange(96, NOW_IDX - 24, NOW_IDX);
const next = SR.windowRange(96, NOW_IDX, NOW_IDX + 12);
ok(past.length === 24, '直近24hは24点', past.length);
ok(past[past.length - 1] === NOW_IDX, '直近24hは現在時刻を含む');
ok(past[0] === NOW_IDX - 23, '直近24hは (now-24, now]');
ok(next.length === 12, '予報12hは12点', next.length);
ok(next[0] === NOW_IDX + 1, '予報12hは現在の次の時刻から');
ok(!next.includes(NOW_IDX), '予報窓は現在時刻を含まない（二重計上しない）');
// 配列の外へ出ない
ok(SR.windowRange(96, -30, 5)[0] === 0, '窓は配列の先頭を超えない');
ok(SR.windowRange(96, 90, 200).pop() === 95, '窓は配列の末尾を超えない');

/* ---------------- 6. 積算：雪でない時間を混ぜない ---------------- */
// 現在より前の24時間だけ、雨(snowfall=0)と雪(snowfall>0)を交互に置く
const mixed = makeHourly(i => {
  if (!past.includes(i)) return {};
  const isSnow = i % 2 === 0;
  return { precip: 2, snowfall: isSnow ? 1 : 0, temp: isSnow ? -3 : 2 };
});
const acc = SR.accumulate(mixed, past, 1);
// 雪の時間は12h。2mm × SLR11 ÷ 10 = 2.2cm/h → 26.4cm
near(acc.cm, 12 * 2.2, 1e-6, '積算: 雨の時間(snowfall=0)は加算しない', acc.cm);
ok(acc.snowHours === 12, '積算: 雪だったのは12時間');
near(acc.avgSlr, 11, 1e-9, '積算: 平均SLRは降っている時間だけで採る');

// kは precipitation に掛けてから SLR を適用する
const accK = SR.accumulate(mixed, past, 1.5);
near(accK.cm, acc.cm * 1.5, 1e-6, '積算: kは線形に効く');

/* ---------------- 7. Open-Meteo URL ---------------- */
const url = SR.buildOpenMeteoUrl([
  { lat: 36.86, lon: 138.83, elevation: 1845 },
  { lat: 36.93, lon: 138.82, elevation: 340 },
]);
ok(url.includes('wind_speed_unit=ms'), '★URL: wind_speed_unit=ms がある（既定km/hの取り違え防止）');
ok(url.includes('models=jma_seamless'), 'URL: jma_seamless');
ok(/latitude=36\.86%2C36\.93/.test(url), 'URL: 座標はカンマ区切りでまとめる', url.match(/latitude=[^&]*/)[0]);
ok(/elevation=1845%2C340/.test(url), 'URL: 標高もカンマ区切り');
ok(url.includes('past_days=2') && url.includes('forecast_days=2'), 'URL: 窓に足りる期間');
ok(url.includes('timezone=Asia%2FTokyo'), 'URL: JST');
ok(!SR.buildOpenMeteoUrl([{ lat: 36, lon: 138, elevation: 100 }], { noElevation: true }).includes('elevation='),
  'URL: フォールバックでは標高指定を外せる');
ok(SR.normalizeSeries({ a: 1 }).length === 1 && SR.normalizeSeries([{ a: 1 }, { a: 2 }]).length === 2,
  'レスポンスの配列/単体を正規化');

/* ---------------- 8. ランキング統合（通信をスタブ） ---------------- */
const SPOTS = [
  { id: 'kagura', name: 'かぐら', area: '上越', type: 'resort', lat: 36.86, lon: 138.83, elevation: 1845 },
  { id: 'tairappyo', name: '平標山', area: '上越', type: 'bc', lat: 36.812, lon: 138.858, elevation: 1984 },
  { id: 'zao', name: '蔵王温泉', area: '山形', type: 'resort', lat: 38.16, lon: 140.44, elevation: 1660 },
  { id: 'dry', name: '降らない所', area: '上越', type: 'resort', lat: 36.87, lon: 138.84, elevation: 1200 },
];
// 地点ごとの降り方。平標>かぐら>蔵王>降らない所 になるように置く
const PROFILE = {
  kagura:    { precipPast: 2.0, precipNext: 1.0, temp: -6 },   // SLR15
  tairappyo: { precipPast: 2.5, precipNext: 1.5, temp: -12 },  // SLR20
  zao:       { precipPast: 1.0, precipNext: 0.5, temp: -2 },   // SLR11
  dry:       { precipPast: 0,   precipNext: 0,   temp: -8 },
};
// 基準点のモデル値[cm/h]。past24hで積むと 湯沢20cm / 藤原20cm / 山形3cm になる。
//   湯沢 実測24 ÷ 20 = 1.2      藤原 実測30 ÷ 20 = 1.5
//   山形 実測8  ÷ 3  = 2.67 → 上限2.0でクランプ
const STATION_MODEL = { '54012': 20 / 24, '54046': 20 / 24, '35426': 3 / 24, '99999': 0.5 };

// fetchSnowRanking が Open-Meteo に並べる基準点の順（地点の順に、重複を除いて現れる）
const EXPECTED_STATIONS = [];
{
  const seen = new Set();
  for (const s of SPOTS) {
    const p = SR.pickStation(s, stations);
    if (p && !seen.has(p.station.id)) { seen.add(p.station.id); EXPECTED_STATIONS.push(p.station.id); }
  }
}
ok(EXPECTED_STATIONS.length === 3, '使う基準点は湯沢・藤原・山形の3つ', EXPECTED_STATIONS);

let requestCount = 0;
const fetchStub = async (u) => {
  requestCount++;
  if (u.includes('latest_time.txt')) {
    return { ok: true, text: async () => '2026-01-20T14:10:00+09:00\n' };
  }
  if (u.includes('amedastable.json')) {
    return { ok: true, json: async () => TABLE };
  }
  if (u.includes('/data/map/')) {
    ok(u.includes('20260120141000.json'), 'map JSONのファイル名がlatest_timeから作られる', u);
    return { ok: true, json: async () => MAP };
  }
  if (u.startsWith('https://api.open-meteo.com')) {
    const q = new URL(u);
    const lats = q.searchParams.get('latitude').split(',');
    // 地点4 + 使われた基準点3 = 7 を1リクエストにまとめる
    ok(lats.length === SPOTS.length + EXPECTED_STATIONS.length,
      'Open-Meteo: 地点と基準点をまとめて1リクエスト', lats.length);
    const out = lats.map((lat, i) => {
      const spot = SPOTS[i];
      if (spot) {
        const pr = PROFILE[spot.id];
        return { hourly: makeHourly(j => {
          const inPast = past.includes(j), inNext = next.includes(j);
          if (!inPast && !inNext) return {};
          const mm = inPast ? pr.precipPast : pr.precipNext;
          return { precip: mm, snowfall: mm > 0 ? mm * 0.7 : 0, temp: pr.temp, wind: 8, dir: 315 };
        }) };
      }
      // 基準点：past24hのモデルsnowfall合計が STATION_MODEL×24 になるように置く
      const stId = EXPECTED_STATIONS[i - SPOTS.length];
      const perHour = STATION_MODEL[stId] || 0;
      return { hourly: makeHourly(j => past.includes(j) ? { snowfall: perHour, precip: perHour, temp: -3 } : {}) };
    });
    return { ok: true, json: async () => out };
  }
  throw new Error('想定外のURL ' + u);
};

const result = await SR.fetchSnowRanking(SPOTS, { fetch: fetchStub, storage: null, now: NOW });
ok(requestCount === 4, '通信は4回（latest_time・地点表・map・Open-Meteo）', requestCount);

const byId = Object.fromEntries(result.rows.map(r => [r.id, r]));
ok(result.rows.length === 4, 'ランキング行数', result.rows.length);
ok(result.rows[0].id === 'tairappyo', '1位は平標山（降水多×パウダー）', result.rows.map(r => r.id));
ok(result.rows[result.rows.length - 1].id === 'dry', '降雪ゼロの地点が最下位', result.rows.map(r => r.id));
ok(byId.dry.totalCm === 0, '降雪ゼロの地点は totalCm:0', byId.dry.totalCm);
for (let i = 1; i < result.rows.length; i++) {
  ok(result.rows[i - 1].totalCm >= result.rows[i].totalCm, 'totalCm降順に並んでいる');
}
// かぐら: k=1.2、past 2.0mm×1.2×15/10=3.6cm/h×24h=86.4、next 1.0×1.2×1.5=1.8×12=21.6
near(byId.kagura.k, 1.2, 0.01, 'かぐらのk（湯沢の実測24cm/モデル20cm）', byId.kagura.k);
near(byId.kagura.past24hCm, 86.4, 0.2, 'かぐらの直近24h', byId.kagura.past24hCm);
near(byId.kagura.next12hCm, 21.6, 0.2, 'かぐらの予想12h', byId.kagura.next12hCm);
near(byId.kagura.totalCm, 108.0, 0.3, 'かぐらの合計＝24h＋12h', byId.kagura.totalCm);
ok(byId.kagura.avgSlr === 15, 'かぐらの平均SLRは15（-6℃）', byId.kagura.avgSlr);
ok(byId.kagura.slrLabel === 'パウダー', 'かぐらの雪質ラベル');
ok(byId.kagura.stationName === '湯沢', 'かぐらの基準点名を出す');
ok(byId.kagura.stationAltDiff === 1505, 'かぐらの標高差を出す（lowの理由が読めるように）');
ok(byId.kagura.confidence === 'low', 'かぐらは標高差1505mでlow', byId.kagura.confidence);
near(byId.zao.k, 2.0, 0.01, '蔵王のkは上限クランプ', byId.zao.k);
ok(byId.zao.confidence === 'low', '蔵王はlow（麓の山形しか無い）');
ok(byId.dry.k >= 0.5, '降らない地点でもkは有効な範囲');
ok(byId.kagura.windMax === 8 && byId.kagura.windWarn === false, '風速8m/sは警告なし');

// 風の警告
const windy = SR.rankSpots(
  [SPOTS[0]], stations, { kagura: null },
  { kagura: makeHourly(j => next.includes(j) ? { wind: 18, dir: 270, precip: 1, snowfall: 1, temp: -5 } : {}) },
  {}, NOW);
ok(windy[0].windWarn === true, '15m/s超で警告フラグ', windy[0].windMax);
ok(windy[0].windDir === 270, '最大風速時の風向を保持');
ok(windy[0].k === 1, '基準点なしならk=1');
ok(windy[0].confidence === 'low', '基準点なしならlow');

/* ---------------- 9. 夏季（snowキーが無い） ---------------- */
const summerMap = { '54012': { temp: [28, 0] }, '35426': { temp: [30, 0] } };
ok(SR.snowStations(summerMap, TABLE).length === 0, '夏季: 積雪観測地点は0件');
let summerReq = 0;
const summerFetch = async (u) => {
  summerReq++;
  if (u.includes('latest_time.txt')) return { ok: true, text: async () => '2026-07-20T14:10:00+09:00' };
  if (u.includes('amedastable.json')) return { ok: true, json: async () => TABLE };
  if (u.includes('/data/map/')) return { ok: true, json: async () => summerMap };
  return { ok: true, json: async () => SPOTS.map(() => ({ hourly: makeHourly(() => ({})) })) };
};
const summer = await SR.fetchSnowRanking(SPOTS, { fetch: summerFetch, storage: null, now: NOW });
ok(summer.rows.length === 4, '夏季: エラーにならず全地点returnする', summer.rows.length);
ok(summer.rows.every(r => r.k === 1), '夏季: k=1で動く');
ok(summer.rows.every(r => r.totalCm === 0), '夏季: 降雪0');
ok(summer.rows.every(r => r.confidence === 'low'), '夏季: 基準点なしなのでlow');
ok(summer.notes.some(n => n.includes('季節外')), '夏季: 注記が出る', summer.notes);

/* ---------------- 10. アメダスが落ちていても動く ---------------- */
const brokenFetch = async (u) => {
  if (u.includes('jma.go.jp')) return { ok: false, status: 503, text: async () => '', json: async () => ({}) };
  return { ok: true, json: async () => SPOTS.map(() => ({ hourly: makeHourly(j => past.includes(j) ? { precip: 1, snowfall: 1, temp: -8 } : {}) })) };
};
const degraded = await SR.fetchSnowRanking(SPOTS, { fetch: brokenFetch, storage: null, now: NOW });
ok(degraded.rows.length === 4, 'アメダス障害時も予報だけで出る', degraded.rows.length);
ok(degraded.rows.every(r => r.k === 1), 'アメダス障害時はk=1');
ok(degraded.notes.some(n => n.includes('アメダス')), 'アメダス障害の注記が出る', degraded.notes);

/* ---------------- 11. 通信回数が地点数に依存しない ---------------- */
const many = Array.from({ length: 40 }, (_, i) => ({
  id: 'p' + i, name: '地点' + i, area: 'テスト', type: 'resort',
  lat: 36.8 + i * 0.001, lon: 138.8, elevation: 1500,
}));
let manyReq = 0;
const manyFetch = async (u) => {
  manyReq++;
  if (u.includes('latest_time.txt')) return { ok: true, text: async () => '2026-01-20T14:10:00+09:00' };
  if (u.includes('amedastable.json')) return { ok: true, json: async () => TABLE };
  if (u.includes('/data/map/')) return { ok: true, json: async () => MAP };
  const n = new URL(u).searchParams.get('latitude').split(',').length;
  return { ok: true, json: async () => Array.from({ length: n }, () => ({ hourly: makeHourly(() => ({})) })) };
};
await SR.fetchSnowRanking(many, { fetch: manyFetch, storage: null, now: NOW });
ok(manyReq === 4, '40地点でも通信は4回のまま', manyReq);

/* ---------------- 12. 地点表はセッション内で使い回す ---------------- */
// 初回は4回（latest_time・地点表・map・Open-Meteo）、2回目以降は地点表を省いて3回
const fakeStore = (() => {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
})();
let warmReq = 0, tableReq = 0;
const warmFetch = async (u) => {
  warmReq++;
  if (u.includes('amedastable.json')) { tableReq++; return { ok: true, json: async () => TABLE }; }
  if (u.includes('latest_time.txt')) return { ok: true, text: async () => '2026-01-20T14:10:00+09:00' };
  if (u.includes('/data/map/')) return { ok: true, json: async () => MAP };
  const n = new URL(u).searchParams.get('latitude').split(',').length;
  return { ok: true, json: async () => Array.from({ length: n }, () => ({ hourly: makeHourly(() => ({})) })) };
};
await SR.fetchSnowRanking(SPOTS, { fetch: warmFetch, storage: fakeStore, now: NOW });
ok(warmReq === 4, '初回は4回', warmReq);
warmReq = 0;
await SR.fetchSnowRanking(SPOTS, { fetch: warmFetch, storage: fakeStore, now: NOW });
ok(warmReq === 3, '2回目は3回（地点表はキャッシュ）', warmReq);
ok(tableReq === 1, '地点表を取りに行くのは1回だけ', tableReq);

/* ---------------- 13. 既存のABC評価に触れていない ---------------- */
const html = readFileSync(join(here, '..', 'sotoki_v4.html'), 'utf8');
// コメントは除いてコードだけを見る（ヘッダーに「ABC評価とは独立」と書いてあるため）
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}
const engineCode = stripComments(readFileSync(join(here, '..', 'snowRanking.js'), 'utf8'));
for (const name of ['judgePoint', 'abcScore', 'abcScoreInv', 'THRESH']) {
  ok(!new RegExp(`\\b${name}\\b`).test(engineCode), `snowRanking.js のコードは ${name} を参照しない`);
}
ok(html.includes('function judgePoint'), '本体のjudgePointは残っている（消していない）');

/* ---------------- 結果 ---------------- */
if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SNOWRANK SMOKE FAILED');
  process.exit(1);
}
console.log(JSON.stringify(result.rows, null, 2));
console.log('SNOWRANK SMOKE PASSED');
