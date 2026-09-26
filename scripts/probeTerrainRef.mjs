/* 高度別の風の場で使う「基準標高 z_ref」の決め方を、実データで比べる。Phase 1a の続き。
 *
 * なぜ要るか:
 *   自動選択は「その場所の基準標高 z_ref の高さの風」を気圧面の間の補間で作る。
 *   Phase 1a（probeWindField ⑦）で、格子点1点の標高を z_ref にすると、谷に落ちた点は
 *   地上10m風・尾根に当たった点は上空の風になり、隣の点と半分以上で層が入れ替わる
 *   **モザイク**になった。升目の中の地形をどう代表させれば、
 *     ① モザイクにならず（隣と不自然に跳ばない）
 *     ② BC で出会う風（稜線・斜面の上部の風）を表す
 *   かを、候補を並べて測る。
 *
 * 比べる z_ref の候補（升目＝MSM 上空の格子 0.125°×0.1° の1マス）:
 *   point … 格子点1点の標高 / mean … 平均 / p50 / p75 / p90 / max
 *   p75s / p90s / maxs … それぞれを隣の升目と 1-2-1 でならしたもの
 *
 * 地形は国土地理院の標高タイル（dem_png・z11≒70m画素）。アプリでも使っている情報源。
 * 風とモデル地形は Open-Meteo（jma_seamless, elevation=nan, cell_selection=nearest）。
 *
 * もう1つ、**地表付近（モデル地形と最下の有効な気圧面の間）の埋め方**を答え合わせする。
 *   925hPa が地上から十分上にある点で、925 を伏せて「10m風と 850hPa」から当て、
 *   線形・対数（高さの対数）・上の層・10m風 のどれが近いかを見る。
 *
 * ⚠ 開発環境からは到達できない。Actions「外部の情報源を調べる」（target: terrain-ref）から。
 * ⚠ 調べるだけ。何も変えない。Open-Meteo は20地点ずつ8回、地理院のタイルは約100枚。
 *
 * 使い方: node scripts/probeTerrainRef.mjs
 */
import { inflateSync } from 'node:zlib';

const OM = 'https://api.open-meteo.com/v1/forecast';
const DEM = 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png';
const DEM_Z = 11;
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---- 対象（MSM 上空の格子にちょうど載せる: 120E / 22.4N 起点、0.125° × 0.1°） ---- */
const DLON = 0.125, DLAT = 0.1;
const gLon = j => +(120 + DLON * j).toFixed(4);
const gLat = i => +(22.4 + DLAT * i).toFixed(4);
const PATCHES = [
  { name: '北アルプス〜松本盆地〜美ヶ原', i0: 135, i1: 144, j0: 138, j1: 145 },
  { name: '越後〜谷川〜尾瀬〜関東平野北縁', i0: 140, i1: 147, j0: 150, j1: 159 },
];
const cells = [];
PATCHES.forEach((P, pi) => {
  for (let i = P.i0; i <= P.i1; i++) for (let j = P.j0; j <= P.j1; j++) {
    cells.push({ pi, i, j, lat: gLat(i), lon: gLon(j) });
  }
});
const cellAt = new Map(cells.map((c, n) => [`${c.pi}:${c.i}:${c.j}`, n]));

/* ---- 最小の PNG 読み（8bit RGB/RGBA・インターレース無し。dem_png はこれ） ---- */
function decodePng(buf) {
  let p = 8, w = 0, h = 0, ct = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9]; if (data[8] !== 8 || data[12] !== 0) throw new Error('未対応のPNG'); }
    else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    p += 12 + len;
  }
  const bpp = ct === 6 ? 4 : ct === 2 ? 3 : 0;
  if (!bpp) throw new Error(`未対応の色形式 ${ct}`);
  const raw = inflateSync(Buffer.concat(idat)), stride = w * bpp, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0, b = y ? out[(y - 1) * stride + x] : 0;
      const c = (x >= bpp && y) ? out[(y - 1) * stride + x - bpp] : 0;
      let v = src[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, bpp, px: out };
}
// dem_png の画素 → 標高（アプリの decodeDemPixel と同じ定義）
const demOf = (r, g, b) => { const x = r * 65536 + g * 256 + b; return x === 8388608 ? null : (x < 8388608 ? x : x - 16777216) * 0.01; };
const tileX = lon => (lon + 180) / 360 * 2 ** DEM_Z;
const tileY = lat => { const r = lat * Math.PI / 180; return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** DEM_Z; };
const lonOfX = x => x / 2 ** DEM_Z * 360 - 180;
const latOfY = y => { const n = Math.PI - 2 * Math.PI * y / 2 ** DEM_Z; return 180 / Math.PI * Math.atan(Math.sinh(n)); };

/* ---- 地形：升目ごとの統計 ---- */
console.log('# 基準標高 z_ref の候補を比べる');
console.log(`升目 ${cells.length}（${PATCHES.map(P => P.name).join(' ／ ')}）\n`);
console.log('## 通信（地理院の標高タイル）');
const samples = cells.map(() => []);
const pointElev = cells.map(() => null);
let tiles = 0, tilesMiss = 0;
for (const [pi, P] of PATCHES.entries()) {
  const lonW = gLon(P.j0) - DLON / 2, lonE = gLon(P.j1) + DLON / 2;
  const latS = gLat(P.i0) - DLAT / 2, latN = gLat(P.i1) + DLAT / 2;
  const x0 = Math.floor(tileX(lonW)), x1 = Math.floor(tileX(lonE));
  const y0 = Math.floor(tileY(latN)), y1 = Math.floor(tileY(latS));
  for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) {
    const url = DEM.replace('{z}', DEM_Z).replace('{x}', tx).replace('{y}', ty);
    let img = null;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.ok) img = decodePng(Buffer.from(await res.arrayBuffer()));
    } catch (e) { /* 取れないタイルは海など */ }
    tiles++;
    if (!img) { tilesMiss++; continue; }
    for (let py = 0; py < img.h; py++) for (let px = 0; px < img.w; px++) {
      const lon = lonOfX(tx + (px + 0.5) / img.w), lat = latOfY(ty + (py + 0.5) / img.h);
      const j = Math.round((lon - 120) / DLON), i = Math.round((lat - 22.4) / DLAT);
      const n = cellAt.get(`${pi}:${i}:${j}`);
      if (n == null) continue;
      const o = (py * img.w + px) * img.bpp;
      const e = demOf(img.px[o], img.px[o + 1], img.px[o + 2]);
      if (e == null) continue;
      samples[n].push(e);
    }
    // 格子点そのものが入っている画素（z_ref の候補 point）
    cells.forEach((c, n) => {
      if (c.pi !== pi) return;
      const fx = tileX(c.lon), fy = tileY(c.lat);
      if (Math.floor(fx) !== tx || Math.floor(fy) !== ty) return;
      const o = (Math.floor((fy - ty) * img.h) * img.w + Math.floor((fx - tx) * img.w)) * img.bpp;
      pointElev[n] = demOf(img.px[o], img.px[o + 1], img.px[o + 2]);
    });
    await sleep(80);
  }
}
console.log(`  タイル ${tiles}枚（取れなかった ${tilesMiss}枚）`);
const q = (a, f) => a[Math.min(a.length - 1, Math.floor(f * a.length))];
const stat = cells.map((c, n) => {
  const a = samples[n].slice().sort((x, y) => x - y);
  if (a.length < 50) return null;
  return { n: a.length, point: pointElev[n] ?? q(a, 0.5), mean: a.reduce((s, x) => s + x, 0) / a.length,
    p50: q(a, 0.5), p75: q(a, 0.75), p90: q(a, 0.9), max: a[a.length - 1] };
});
// 隣の升目と 1-2-1 でならす（端は重みを正規化）
function smooth(key) {
  return cells.map((c, n) => {
    if (!stat[n]) return null;
    let s = 0, w = 0;
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      const m = cellAt.get(`${c.pi}:${c.i + di}:${c.j + dj}`);
      if (m == null || !stat[m]) continue;
      const k = (di ? 1 : 2) * (dj ? 1 : 2);
      s += k * stat[m][key]; w += k;
    }
    return s / w;
  });
}
const Z_REFS = {
  point: cells.map((c, n) => stat[n]?.point ?? null),
  mean: cells.map((c, n) => stat[n]?.mean ?? null),
  p50: cells.map((c, n) => stat[n]?.p50 ?? null),
  p75: cells.map((c, n) => stat[n]?.p75 ?? null),
  p90: cells.map((c, n) => stat[n]?.p90 ?? null),
  max: cells.map((c, n) => stat[n]?.max ?? null),
  p75s: smooth('p75'), p90s: smooth('p90'), maxs: smooth('max'),
};
console.log(`  地形の統計が取れた升目 ${stat.filter(Boolean).length} / ${cells.length}（海だけの升目は除く）`);

/* ---- 風とモデル地形 ---- */
console.log('\n## 通信（Open-Meteo）');
const LV = [925, 900, 850, 800, 700];
const VARS = ['wind_speed_10m', 'wind_direction_10m', ...LV.flatMap(p => [`wind_speed_${p}hPa`, `wind_direction_${p}hPa`, `geopotential_height_${p}hPa`])];
const wx = [];
for (let s = 0; s < cells.length; s += 20) {
  const part = cells.slice(s, s + 20);
  const params = new URLSearchParams({
    latitude: part.map(c => c.lat).join(','), longitude: part.map(c => c.lon).join(','),
    elevation: part.map(() => 'nan').join(','), hourly: VARS.join(','),
    models: 'jma_seamless', timezone: 'Asia/Tokyo', wind_speed_unit: 'ms', cell_selection: 'nearest', forecast_days: '3',
  });
  let r = null;
  for (let a = 0; a < 3 && !r; a++) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${OM}?${params}`, { signal: AbortSignal.timeout(60000) });
      const text = await res.text();
      console.log(`  [${s + 1}〜${s + part.length}] HTTP ${res.status} / ${(text.length / 1024).toFixed(0)}KB / ${Date.now() - t0}ms`);
      if (res.ok) { const j = JSON.parse(text); r = Array.isArray(j) ? j : [j]; }
    } catch (e) {
      console.log(`  [${s + 1}〜${s + part.length}] 失敗 ${e.message}${e.cause ? ` (${e.cause.code || e.cause.message})` : ''}`);
      await sleep(10000);
    }
  }
  if (!r) { console.log('✗ 風が取れなかった'); process.exit(1); }
  wx.push(...r);
  await sleep(3000);
}
const zm = wx.map(r => r.elevation);
const nT = wx[0].hourly.time.length;

/* ---- 道具 ---- */
const rad = d => d * Math.PI / 180;
const uv = (s, d) => (s == null || d == null) ? null : [-s * Math.sin(rad(d)), -s * Math.cos(rad(d))];
const vd = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lerp = (a, b, w) => [a[0] + (b[0] - a[0]) * w, a[1] + (b[1] - a[1]) * w];
function stats(xs) {
  const a = xs.filter(Number.isFinite).sort((x, y) => x - y);
  return a.length ? { n: a.length, med: q(a, 0.5), p90: q(a, 0.9), max: a[a.length - 1], mean: a.reduce((s, x) => s + x, 0) / a.length } : { n: 0 };
}
const f1 = x => (x == null || !Number.isFinite(x)) ? '  -' : x.toFixed(1).padStart(5);
const f0 = x => (x == null || !Number.isFinite(x)) ? '   -' : String(Math.round(x)).padStart(5);
function prof(n, k) {
  const h = wx[n].hourly, g = v => (h[v] && h[v][k] != null) ? h[v][k] : null;
  return {
    sfc: uv(g('wind_speed_10m'), g('wind_direction_10m')),
    lv: LV.map(p => ({ p, z: g(`geopotential_height_${p}hPa`), w: uv(g(`wind_speed_${p}hPa`), g(`wind_direction_${p}hPa`)) })),
  };
}
const hasMsm = (n, k) => prof(n, k).lv.find(l => l.p === 800).w != null;   // 800hPa がある＝MSM の期間

/* 自動選択の案（エンジンに入れる形）。lower は地表付近の埋め方
     'log' … 10m風（モデル地形+10m）と最下の有効な面を、地上からの高さの対数で按分
     'lo'  … 最下の有効な面をそのまま
   返り値の regime: 'sfc'（地表＝10m風）/ 'gap'（地表と最下面の間）/ 'mid'（面の間）/ 'top' */
function auto(pr, H, z_m, lower) {
  if (H == null || z_m == null || !pr.sfc) return null;
  if (H <= z_m) return { regime: 'sfc', w: pr.sfc };
  const v = pr.lv.filter(l => l.z != null && l.w && l.z >= z_m).sort((a, b) => a.z - b.z);
  if (!v.length) return null;
  if (H < v[0].z) {
    if (lower === 'lo') return { regime: 'gap', w: v[0].w };
    const h = Math.max(10, H - z_m), hl = Math.max(11, v[0].z - z_m);
    return { regime: 'gap', w: lerp(pr.sfc, v[0].w, Math.log(h / 10) / Math.log(hl / 10)) };
  }
  for (let i = 0; i < v.length - 1; i++) {
    if (v[i].z <= H && H <= v[i + 1].z) return { regime: 'mid', w: lerp(v[i].w, v[i + 1].w, (H - v[i].z) / (v[i + 1].z - v[i].z)), lo: v[i].p };
  }
  return { regime: 'top', w: v[v.length - 1].w };
}

/* ---- 1. 地形の統計の姿 ---- */
console.log('\n## 1. 升目ごとの地形（m）の分布とモデル地形との差');
for (const [k, zr] of Object.entries(Z_REFS)) {
  const d = zr.map((z, n) => z != null ? z - zm[n] : NaN);
  console.log(`  ${k.padEnd(5)} 中央${f0(stats(zr).med)}  z_ref−モデル地形: 中央${f0(stats(d).med)} 90%${f0(stats(d).p90)}／モデル地形以下の升目 ${d.filter(x => x <= 0).length}`);
}

/* ---- 2. 候補ごとのモザイクの度合い ---- */
console.log('\n## 2. 候補ごとの風の場（MSM の期間。隣＝上下左右の升目、約11km）');
console.log('  自然な場（参考）:');
{
  const nat = { '10m': [], '850hPa': [], '700hPa': [] };
  for (let k = 0; k < nT; k++) cells.forEach((c, n) => {
    if (!hasMsm(n, k)) return;
    for (const [di, dj] of [[0, 1], [1, 0]]) {
      const m = cellAt.get(`${c.pi}:${c.i + di}:${c.j + dj}`);
      if (m == null) continue;
      const A = prof(n, k), B = prof(m, k);
      if (A.sfc && B.sfc) nat['10m'].push(vd(A.sfc, B.sfc));
      for (const p of [850, 700]) { const a = A.lv.find(l => l.p === p).w, b = B.lv.find(l => l.p === p).w; if (a && b) nat[`${p}hPa`].push(vd(a, b)); }
    }
  });
  for (const [k, v] of Object.entries(nat)) { const s = stats(v); console.log(`    ${k.padEnd(7)} 隣との差 中央${f1(s.med)} 90%${f1(s.p90)} m/s`); }
}
console.log('  z_ref ごと（地表付近の埋め方 = 対数 / 最下面）:');
console.log('    候補   | 隣との差 中央 90% | 地表(10m)の升目 | 隣と区分が違う | 地表付近の升目');
const regimeMaps = {};
for (const [key, zr] of Object.entries(Z_REFS)) {
  for (const lower of ['log', 'lo']) {
    const jumps = [], reg = { sfc: 0, gap: 0, mid: 0, top: 0 };
    let pairs = 0, pairsDiff = 0, tot = 0;
    for (let k = 0; k < nT; k++) {
      const res = cells.map((c, n) => hasMsm(n, k) ? auto(prof(n, k), zr[n], zm[n], lower) : null);
      res.forEach(r => { if (r) { reg[r.regime]++; tot++; } });
      cells.forEach((c, n) => {
        if (!res[n]) return;
        for (const [di, dj] of [[0, 1], [1, 0]]) {
          const m = cellAt.get(`${c.pi}:${c.i + di}:${c.j + dj}`);
          if (m == null || !res[m]) continue;
          pairs++;
          jumps.push(vd(res[n].w, res[m].w));
          if ((res[n].regime === 'sfc') !== (res[m].regime === 'sfc')) pairsDiff++;
        }
      });
      if (k === 12 && lower === 'log') regimeMaps[key] = res;
    }
    const s = stats(jumps);
    console.log(`    ${key.padEnd(5)} ${lower.padEnd(3)} | ${f1(s.med)} ${f1(s.p90)}        | ${(100 * reg.sfc / tot).toFixed(0).padStart(3)}%          | ${(100 * pairsDiff / pairs).toFixed(0).padStart(3)}%          | ${(100 * reg.gap / tot).toFixed(0).padStart(3)}%`);
  }
}

/* ---- 3. 地図で見る（初日12時） ---- */
console.log('\n## 3. 升目の区分の地図（初日12時・対数）  S=地表(10m) g=地表付近 数字=挟んだ下の面（9=925/900, 8=850/800, 7=700） T=上端');
const ch = r => !r ? ' ' : r.regime === 'sfc' ? 'S' : r.regime === 'gap' ? 'g' : r.regime === 'top' ? 'T' : String(r.lo)[0] === '9' ? '9' : String(r.lo)[0];
for (const key of ['point', 'p50', 'p75', 'p90', 'max', 'p75s', 'p90s']) {
  const res = regimeMaps[key];
  if (!res) continue;
  console.log(`  [${key}]`);
  PATCHES.forEach((P, pi) => {
    for (let i = P.i1; i >= P.i0; i--) {
      let row = '';
      for (let j = P.j0; j <= P.j1; j++) { const n = cellAt.get(`${pi}:${i}:${j}`); row += ch(res[n]); }
      console.log(`    ${pi + 1} ${gLat(i).toFixed(1)}N ${row}`);
    }
  });
}
console.log('  [参考：p90 の標高（百m）・初日12時の850hPa高度（百m）]');
PATCHES.forEach((P, pi) => {
  for (let i = P.i1; i >= P.i0; i--) {
    let a = '', b = '';
    for (let j = P.j0; j <= P.j1; j++) {
      const n = cellAt.get(`${pi}:${i}:${j}`);
      a += Z_REFS.p90[n] == null ? '  .' : String(Math.round(Z_REFS.p90[n] / 100)).padStart(3);
      b += String(Math.round(prof(n, 12).lv.find(l => l.p === 850).z / 100)).padStart(3);
    }
    console.log(`    ${pi + 1} ${gLat(i).toFixed(1)}N ${a}  |${b}`);
  }
});

/* ---- 4. 地表付近の埋め方の答え合わせ ---- */
console.log('\n## 4. 地表付近の埋め方（925hPa を伏せ、10m風と850hPa から当てる。925 が地上100m以上の升目・MSM の期間）');
{
  const err = { 線形: [], 対数: [], '850をそのまま': [], '10mをそのまま': [] };
  let n925 = 0;
  for (let k = 0; k < nT; k++) cells.forEach((c, n) => {
    if (!hasMsm(n, k)) return;
    const pr = prof(n, k), a = pr.lv.find(l => l.p === 925), b = pr.lv.find(l => l.p === 850);
    if (!pr.sfc || !a.w || !b.w || a.z == null || b.z == null || a.z < zm[n] + 100) return;
    n925++;
    const z0 = zm[n] + 10;
    err.線形.push(vd(lerp(pr.sfc, b.w, (a.z - z0) / (b.z - z0)), a.w));
    err.対数.push(vd(lerp(pr.sfc, b.w, Math.log((a.z - zm[n]) / 10) / Math.log((b.z - zm[n]) / 10)), a.w));
    err['850をそのまま'].push(vd(b.w, a.w));
    err['10mをそのまま'].push(vd(pr.sfc, a.w));
  });
  console.log(`  対象 ${n925} 件（升目×時刻）`);
  for (const [k, v] of Object.entries(err)) { const s = stats(v); console.log(`    ${k.padEnd(8, '　')} 誤差 中央${f1(s.med)} 90%${f1(s.p90)} m/s`); }
}
console.log('\n以上。');
