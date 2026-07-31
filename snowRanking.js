/* 新雪ランキング 推定エンジン
 *
 *   メイン指標 = 直近24時間の新雪 ＋ 今夜〜明朝12時間の予想降雪
 *
 * 既存のABC評価（judgePoint / THRESH / abcScore）とは完全に独立している。
 * あちらには一切触れないこと。
 *
 * 設計の要点:
 *   ・アメダスは麓にしか無いので、Open-Meteoに山頂標高を直接指定して推定する
 *   ・モデルは日々バイアスを持つので、近傍アメダスの実測降雪で係数kを作って補正する
 *   ・snowfallは降水量×7の固定換算でパウダーと重雪を区別できないので、
 *     気温から雪水比(SLR)を引き直して precipitation から新雪深を出す
 *
 * ★単位に注意（過去に風速のkm/hとm/sを取り違えて事故を起こしている）
 *   Open-Meteo  precipitation … mm      snowfall … cm
 *               temperature_2m … ℃     wind_speed_10m … 既定km/h
 *   → 風速は必ず wind_speed_unit=ms を付ける。付け忘れると3.6倍になり、
 *     15m/s の強風警告が出っぱなしになる
 *   アメダス    snow24h … cm  snow … cm
 *   よって k = cm / cm で無次元、precipitation[mm] × SLR ÷ 10 = [cm]。
 *
 * ブラウザでは window.snowRanking、Nodeでは module.exports として使える。
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.snowRanking = api;
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  const AMEDAS_BASE = 'https://www.jma.go.jp/bosai/amedas';
  const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

  const PAST_HOURS = 24;          // 直近の実績窓
  const NEXT_HOURS = 12;          // 今夜〜明朝の予報窓
  const K_MIN = 0.5, K_MAX = 2.0; // 補正係数のクランプ
  const K_MIN_MODEL_CM = 2;       // モデル値がこれ未満なら比が不安定なので補正しない
  const STATION_MAX_KM = 60;      // これより遠いアメダスは使わない
  const WIND_WARN_MS = 15;        // 吹き飛び・ウインドスラブ生成の目安

  /* ---------------- 単位・座標 ---------------- */

  /** アメダス地点表の [度, 分] を10進度に直す */
  function dmsToDeg(pair) {
    if (!Array.isArray(pair) || pair.length < 2) return null;
    const [d, m] = pair;
    if (typeof d !== 'number' || typeof m !== 'number') return null;
    return d + m / 60;
  }

  /** latest_time.txt を Date を経由せずに map のファイル名へ変換する（TZ事故の回避） */
  function parseLatestTime(text) {
    const m = String(text).trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    if (!m) return null;
    return `${m[1]}${m[2]}${m[3]}${m[4]}${m[5]}00`;
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  /* ---------------- 雪水比 ---------------- */

  /** 気温[℃]から雪水比を返す。低いほど軽い雪。 */
  function slrFromTemp(t) {
    if (t == null || !Number.isFinite(t)) return 7;
    if (t >= -1) return 7;      // 湿雪・重い
    if (t >= -5) return 11;
    if (t >= -10) return 15;
    return 20;                  // ドライパウダー
  }

  /** SLRを言葉にする（数値だけだと現場で使いづらいため） */
  function slrLabel(slr) {
    if (slr == null) return '—';
    if (slr >= 15) return 'パウダー';
    if (slr >= 11) return '標準';
    return '湿雪';
  }

  /** 降水量[mm]と気温[℃]から実効新雪深[cm]。例: 10mm × 11 ÷ 10 = 11cm */
  function effectiveSnowCm(precipMm, tempC) {
    if (!Number.isFinite(precipMm) || precipMm <= 0) return 0;
    return precipMm * slrFromTemp(tempC) / 10;
  }

  /* ---------------- 補正係数 k ---------------- */

  /**
   * k = アメダス実測 snow24h ÷ 同座標・同標高でのモデル24h snowfall
   * 分母が小さいときは比が発散するので、その場合は補正しない（k=1）。
   */
  function computeK(stationSnow24hCm, modelSnow24hCm) {
    if (!Number.isFinite(stationSnow24hCm) || stationSnow24hCm < 0) return 1;
    if (!Number.isFinite(modelSnow24hCm) || modelSnow24hCm < K_MIN_MODEL_CM) return 1;
    const k = stationSnow24hCm / modelSnow24hCm;
    if (!Number.isFinite(k)) return 1;
    return Math.min(K_MAX, Math.max(K_MIN, k));
  }

  /* ---------------- 補正基準点の選定 ---------------- */

  /**
   * map JSON と地点表から「積雪深を観測している地点」を取り出す。
   * どの地点が観測しているかは elems の解釈ではなく、map に snow キーが
   * 非nullで載っているかで動的に判定する（スキーマ依存を避ける）。
   */
  function snowStations(amedasMap, amedasTable) {
    const out = [];
    if (!amedasMap || !amedasTable) return out;
    for (const id of Object.keys(amedasMap)) {
      const obs = amedasMap[id];
      const meta = amedasTable[id];
      if (!obs || !meta) continue;
      // 値は [値, 品質フラグ] の配列
      const snow = Array.isArray(obs.snow) ? obs.snow[0] : null;
      if (snow == null) continue;                       // 積雪深を観測していない地点／季節
      const lat = dmsToDeg(meta.lat), lon = dmsToDeg(meta.lon);
      if (lat == null || lon == null) continue;
      const snow24h = Array.isArray(obs.snow24h) ? obs.snow24h[0] : null;
      out.push({
        id,
        name: meta.kjName || id,
        lat, lon,
        alt: typeof meta.alt === 'number' ? meta.alt : 0,
        snowCm: snow,
        snow24hCm: typeof snow24h === 'number' ? snow24h : null,
      });
    }
    return out;
  }

  /** 距離と標高差からコスト最小の基準点を選ぶ。60km以内に無ければ null。 */
  function pickStation(spot, stations) {
    let best = null;
    for (const st of stations) {
      const distKm = haversineKm(spot.lat, spot.lon, st.lat, st.lon);
      if (distKm > STATION_MAX_KM) continue;
      const altDiff = spot.elevation - st.alt;
      const cost = distKm + Math.abs(altDiff) / 50;
      if (!best || cost < best.cost) best = { station: st, distKm, altDiff, cost };
    }
    return best;
  }

  /** 基準点の質を信頼度にする。ユーザーにこの差を見せることが重要。 */
  function confidenceOf(pick) {
    if (!pick) return 'low';
    const d = pick.distKm, a = Math.abs(pick.altDiff);
    if (d > 40 || a > 1200) return 'low';
    if (d > 25 || a > 800) return 'mid';
    return 'high';
  }

  /* ---------------- 評価窓 ---------------- */

  /**
   * hourly.time は Asia/Tokyo のローカル文字列（2026-01-20T14:00）。
   * 現在の「日付＋時」に一致する index を返す。見つからなければ現在以前で最も新しい index。
   */
  function findNowIndex(times, now) {
    if (!Array.isArray(times) || !times.length) return -1;
    const d = now || new Date();
    const p = n => String(n).padStart(2, '0');
    const key = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
    const hit = times.indexOf(key);
    if (hit >= 0) return hit;
    let last = -1;
    for (let i = 0; i < times.length; i++) if (times[i] <= key) last = i;
    return last;
  }

  /** (from, to] のindexを返す。配列の外へは出ない。 */
  function windowRange(len, fromExclusive, toInclusive) {
    const a = Math.max(0, fromExclusive + 1);
    const b = Math.min(len - 1, toInclusive);
    const out = [];
    for (let i = a; i <= b; i++) out.push(i);
    return out;
  }

  /**
   * 窓のなかの新雪深[cm]を積算する。
   * 雪かどうかは「その時刻の snowfall > 0」で判定する（気温だけで決めない）。
   * kは precipitation に掛けてから SLR を適用する。
   */
  function accumulate(hourly, idxs, k) {
    let cm = 0, precipSum = 0, slrWeighted = 0, tempSum = 0, snowHours = 0;
    const snowfall = hourly.snowfall || [];
    const precip = hourly.precipitation || [];
    const temp = hourly.temperature_2m || [];
    for (const i of idxs) {
      const sf = snowfall[i];
      if (!Number.isFinite(sf) || sf <= 0) continue;     // 雪でない時間は加算しない
      const t = Number.isFinite(temp[i]) ? temp[i] : null;
      const mm = Number.isFinite(precip[i]) ? precip[i] * k : 0;
      if (mm <= 0) continue;
      const slr = slrFromTemp(t);
      cm += mm * slr / 10;
      precipSum += mm;
      slrWeighted += slr * mm;
      if (t != null) { tempSum += t; snowHours++; }
    }
    return {
      cm,
      precipMm: precipSum,
      avgSlr: precipSum > 0 ? slrWeighted / precipSum : null,
      avgTemp: snowHours > 0 ? tempSum / snowHours : null,
      snowHours,
    };
  }

  /** モデル素のsnowfall[cm]の合計。k を作るときの分母に使う。 */
  function sumSnowfall(hourly, idxs) {
    const sf = hourly.snowfall || [];
    let s = 0;
    for (const i of idxs) if (Number.isFinite(sf[i])) s += sf[i];
    return s;
  }

  /** 窓のなかの最大風速[m/s]と、そのときの風向 */
  function windStats(hourly, idxs) {
    const ws = hourly.wind_speed_10m || [];
    const wd = hourly.wind_direction_10m || [];
    let max = null, dir = null;
    for (const i of idxs) {
      const v = ws[i];
      if (!Number.isFinite(v)) continue;
      if (max == null || v > max) { max = v; dir = Number.isFinite(wd[i]) ? wd[i] : null; }
    }
    return { windMax: max, windDir: dir, windWarn: max != null && max > WIND_WARN_MS };
  }

  /* ---------------- Open-Meteo ---------------- */

  /**
   * 地点と補正用アメダスをまとめて1リクエストにする。
   * 何地点あってもフェッチ回数は増えない。
   */
  function buildOpenMeteoUrl(points, opts) {
    const o = opts || {};
    const q = new URLSearchParams({
      latitude: points.map(p => p.lat).join(','),
      longitude: points.map(p => p.lon).join(','),
      hourly: 'snowfall,precipitation,temperature_2m,wind_speed_10m,wind_direction_10m',
      models: 'jma_seamless',
      timezone: 'Asia/Tokyo',
      wind_speed_unit: 'ms',       // ★既定はkm/h。付け忘れると風速が3.6倍になる
      past_days: '2',
      forecast_days: '2',
    });
    // 標高指定が効かない環境向けに外せるようにしてある（フォールバック用）
    if (!o.noElevation) q.set('elevation', points.map(p => Math.round(p.elevation)).join(','));
    return `${OPEN_METEO}?${q.toString()}`;
  }

  /** 複数座標のときレスポンスは配列。単数のときのオブジェクトと形を揃える。 */
  function normalizeSeries(json) {
    return Array.isArray(json) ? json : [json];
  }

  /* ---------------- ランキング本体（純粋関数） ---------------- */

  /**
   * 取得済みのデータからランキングを組む。ここは通信しないのでテストしやすい。
   *
   * @param spots        data/spots.json の spots
   * @param stations     snowStations() の結果
   * @param picks        spot.id -> pickStation() の結果
   * @param spotSeries   spot.id -> Open-Meteoのhourly
   * @param stationSeries station.id -> Open-Meteoのhourly
   * @param now          基準時刻（省略時は現在）
   */
  function rankSpots(spots, stations, picks, spotSeries, stationSeries, now) {
    const rows = [];
    for (const spot of spots) {
      const hourly = spotSeries[spot.id];
      if (!hourly || !hourly.time) continue;
      const nowIdx = findNowIndex(hourly.time, now);
      if (nowIdx < 0) continue;
      const len = hourly.time.length;
      const pastIdx = windowRange(len, nowIdx - PAST_HOURS, nowIdx);
      const nextIdx = windowRange(len, nowIdx, nowIdx + NEXT_HOURS);

      // 補正係数k：基準点の実測snow24hと、同じ窓でのモデルsnowfallの比
      const pick = picks[spot.id] || null;
      let k = 1;
      if (pick) {
        const stHourly = stationSeries[pick.station.id];
        if (stHourly && stHourly.time) {
          const stNow = findNowIndex(stHourly.time, now);
          if (stNow >= 0) {
            const stPast = windowRange(stHourly.time.length, stNow - PAST_HOURS, stNow);
            k = computeK(pick.station.snow24hCm, sumSnowfall(stHourly, stPast));
          }
        }
      }

      const past = accumulate(hourly, pastIdx, k);
      const next = accumulate(hourly, nextIdx, k);
      const wind = windStats(hourly, nextIdx);

      // 平均は「降っている時間」だけで採る。降っていない時間を混ぜると薄まって意味を失う
      const totalPrecip = past.precipMm + next.precipMm;
      const avgSlr = totalPrecip > 0
        ? (past.avgSlr * past.precipMm + next.avgSlr * next.precipMm) / totalPrecip : null;
      const snowHours = past.snowHours + next.snowHours;
      const avgTemp = snowHours > 0
        ? (past.avgTemp * past.snowHours + next.avgTemp * next.snowHours) / snowHours : null;

      const r1 = v => v == null ? null : Math.round(v * 10) / 10;
      rows.push({
        id: spot.id,
        name: spot.name,
        area: spot.area,
        type: spot.type,
        elevation: spot.elevation,
        past24hCm: r1(past.cm) || 0,
        next12hCm: r1(next.cm) || 0,
        totalCm: r1(past.cm + next.cm) || 0,
        avgSlr: avgSlr == null ? null : Math.round(avgSlr),
        slrLabel: slrLabel(avgSlr),
        avgTemp: r1(avgTemp),
        windMax: r1(wind.windMax),
        windDir: wind.windDir == null ? null : Math.round(wind.windDir),
        windWarn: wind.windWarn,
        k: Math.round(k * 100) / 100,
        stationName: pick ? pick.station.name : null,
        stationDistKm: pick ? Math.round(pick.distKm * 10) / 10 : null,
        stationAltDiff: pick ? Math.round(pick.altDiff) : null,
        confidence: confidenceOf(pick),
      });
    }
    rows.sort((a, b) => b.totalCm - a.totalCm);
    return rows;
  }

  /* ---------------- 通信のとりまとめ ---------------- */

  const TABLE_CACHE_KEY = 'sotoki_amedas_table';

  async function getJson(url, fetchImpl) {
    const res = await fetchImpl(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
    return res.json();
  }

  /** アメダス地点表は事実上の静的データなのでセッション内で使い回す */
  async function loadAmedasTable(fetchImpl, storage) {
    if (storage) {
      try {
        const cached = storage.getItem(TABLE_CACHE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (e) { /* 壊れていたら取り直す */ }
    }
    const table = await getJson(`${AMEDAS_BASE}/const/amedastable.json`, fetchImpl);
    if (storage) {
      try { storage.setItem(TABLE_CACHE_KEY, JSON.stringify(table)); } catch (e) { /* 容量超過は無視 */ }
    }
    return table;
  }

  /**
   * ランキングを取得する。
   *
   * 通信回数は地点数に依存しない:
   *   アメダス latest_time → map（2回）＋ Open-Meteo（1回）。
   *   地点表は初回だけ追加で1回、以降はsessionStorageから読む。
   */
  async function fetchSnowRanking(spots, opts) {
    const o = opts || {};
    const fetchImpl = o.fetch || ((...a) => fetch(...a));
    const storage = o.storage !== undefined ? o.storage
      : (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
    const now = o.now || new Date();
    const notes = [];

    // 1) アメダス（実測）。失敗しても補正なしで続行する
    let stations = [];
    try {
      const [latestText, table] = await Promise.all([
        fetchImpl(`${AMEDAS_BASE}/data/latest_time.txt`).then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.text();
        }),
        loadAmedasTable(fetchImpl, storage),
      ]);
      const stamp = parseLatestTime(latestText);
      if (!stamp) throw new Error('latest_time.txt を解釈できない');
      const map = await getJson(`${AMEDAS_BASE}/data/map/${stamp}.json`, fetchImpl);
      stations = snowStations(map, table);
      if (!stations.length) notes.push('積雪を観測しているアメダスがありません（季節外）。補正なしで表示します。');
    } catch (e) {
      notes.push(`アメダスを取得できませんでした（${e.message}）。補正なしで表示します。`);
      stations = [];
    }

    // 2) 地点ごとの基準点を決め、使う基準点だけを集める
    const picks = {};
    const usedStations = new Map();
    for (const spot of spots) {
      const pick = pickStation(spot, stations);
      picks[spot.id] = pick;
      if (pick) usedStations.set(pick.station.id, pick.station);
    }

    // 3) 地点＋基準点をまとめて1リクエスト
    const stationList = [...usedStations.values()];
    const points = spots.map(s => ({ lat: s.lat, lon: s.lon, elevation: s.elevation }))
      .concat(stationList.map(s => ({ lat: s.lat, lon: s.lon, elevation: s.alt })));
    let series;
    try {
      series = normalizeSeries(await getJson(buildOpenMeteoUrl(points, o), fetchImpl));
    } catch (e) {
      // 標高のカンマ区切り指定が効かない環境向けのフォールバック
      notes.push(`標高指定つきの取得に失敗（${e.message}）。標高指定なしで再取得します。`);
      series = normalizeSeries(await getJson(buildOpenMeteoUrl(points, { noElevation: true }), fetchImpl));
    }

    const spotSeries = {}, stationSeries = {};
    spots.forEach((s, i) => { if (series[i]) spotSeries[s.id] = series[i].hourly; });
    stationList.forEach((s, i) => {
      const r = series[spots.length + i];
      if (r) stationSeries[s.id] = r.hourly;
    });

    return {
      generatedAt: now.toISOString(),
      rows: rankSpots(spots, stations, picks, spotSeries, stationSeries, now),
      stationCount: stations.length,
      notes,
    };
  }

  return {
    // 定数
    PAST_HOURS, NEXT_HOURS, K_MIN, K_MAX, K_MIN_MODEL_CM, STATION_MAX_KM, WIND_WARN_MS,
    // 純粋関数
    dmsToDeg, parseLatestTime, haversineKm,
    slrFromTemp, slrLabel, effectiveSnowCm, computeK,
    snowStations, pickStation, confidenceOf,
    findNowIndex, windowRange, accumulate, sumSnowfall, windStats,
    buildOpenMeteoUrl, normalizeSeries, rankSpots,
    // 通信
    fetchSnowRanking,
  };
});
