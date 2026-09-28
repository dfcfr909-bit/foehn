/* DEM の解像度と尾根・沢の判定（実験）：30m／10m／5m／1m の DEM で、アプリの terrainFlow を**そのまま**回し、
 * 現行の稜線の条件（横断の高低差 crossLow）と CI（収束指数・探索半径つき）を比べる。
 *
 * なぜ要るか:
 *   偽の地形（30m 升目）での試算では、現行の横断テストが「丸い尾根を落とし、円錐の斜面を通す」、CI は両者を分けた。
 *   実際の DEM で、解像度を上げると判定がどれだけ変わるか・CI が効くかを見てから CI を入れるか決める（利用者の判断）。
 *   開発環境からは国土地理院に届かないので Actions で回す（verifyCols.mjs と同じ制約）。
 *
 * 使い方: node scripts/probeDemRes.mjs   （Chromium の場所は PW_CHROMIUM）
 * 出力: 標準出力とサマリーに表。out/dem-res/ に画像（ワークフローが artifact に上げる）。⚠ 何もコミットしない。
 *
 * 正解の代わり（どれも不完全。数字は「傾向」として読む）:
 *   ・沢 … OSM の waterway=stream/river（山の上流は描かれていないことが多い＝精度は低めに出る）
 *   ・尾根 … OSM の natural=saddle/peak（鞍部と山頂は稜線の上にあるはず）
 *   ・解像度をまたいだ一致 … いちばん細かい DEM の結果との一致（細かい方が正しいとは限らない）
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'tests', 'package.json'));
const { chromium } = require('playwright-core');
const OUT = path.join(ROOT, 'out', 'dem-res');
fs.mkdirSync(OUT, { recursive: true });
const UA = 'nagi-nav-dem-probe (https://github.com/dfcfr909-bit/foehn)';

const SITES = [
  { key: 'nantai', name: '男体山', q: null, lat: 36.7651, lon: 139.4909 },          // areas.json（地理院で検証済み）
  { key: 'hida', name: '飛騨乗越', q: '飛騨乗越', lat: 36.3382, lon: 137.6462 },      // 近似。地理院の地名検索で置き換える
  { key: 'jonen', name: '常念乗越', q: null, lat: 36.33341, lon: 137.72752 },        // verifyCols.sites.json
];
const DEM = {
  gsi: 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png',
  gsi5a: 'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png',
  gsi5b: 'https://cyberjapandata.gsi.go.jp/xyz/dem5b_png/{z}/{x}/{y}.png',
  gsi5c: 'https://cyberjapandata.gsi.go.jp/xyz/dem5c_png/{z}/{x}/{y}.png',
};
// 1m の候補（あるか分からない。実行時に探る）
const ONE_M = [
  { id: 'gsi1a', url: 'https://cyberjapandata.gsi.go.jp/xyz/dem1a_png/{z}/{x}/{y}.png' },
  { id: 'gsj-gsidem', url: 'https://tiles.gsj.jp/tiles/elev/gsidem/{z}/{y}/{x}.png' },
  { id: 'gsj-land', url: 'https://tiles.gsj.jp/tiles/elev/land/{z}/{y}/{x}.png' },
];

// ---- 取得の中継（ページから CORS を気にせず取る）----
const cache = new Map();
const stat = { req: 0, ok: 0, miss: 0 };
async function upstream(u) {
  if (cache.has(u)) return cache.get(u);
  let r = null;
  for (let t = 0; t < 3 && !r; t++) {
    try {
      stat.req++;
      const res = await fetch(u, { headers: { 'user-agent': UA } });
      r = { status: res.status, type: res.headers.get('content-type') || '', body: Buffer.from(await res.arrayBuffer()) };
      if (res.status >= 500) { r = null; await new Promise(z => setTimeout(z, 1000 * (t + 1))); }
    } catch { await new Promise(z => setTimeout(z, 1000 * (t + 1))); }
  }
  r = r || { status: 599, type: '', body: Buffer.alloc(0) };
  if (r.status === 200) stat.ok++; else stat.miss++;
  cache.set(u, r);
  return r;
}
const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/proxy') {
    const r = await upstream(url.searchParams.get('u'));
    res.writeHead(r.status, { 'content-type': r.type || 'application/octet-stream' });
    return res.end(r.body);
  }
  const p = path.join(ROOT, decodeURIComponent(url.pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// ---- 地点の座標：地理院の地名検索で名前を引けたら置き換える ----
for (const s of SITES) {
  if (!s.q) continue;
  try {
    const r = await upstream(`https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(s.q)}`);
    const hit = JSON.parse(r.body.toString('utf8')).find(f => f.properties && f.properties.title === s.q);
    if (hit) { [s.lon, s.lat] = hit.geometry.coordinates; console.log(`地名検索：${s.q} → ${s.lat}, ${s.lon}`); }
    else console.log(`地名検索：${s.q} は見つからない（近似の座標のまま ${s.lat}, ${s.lon}）`);
  } catch (e) { console.log(`地名検索：${s.q} 失敗（${e.message}）。近似の座標のまま`); }
}

// ---- OSM（沢・鞍部・山頂・尾根線）----
async function osm(s, halfM) {
  const dLat = halfM / 110574, dLon = halfM / (111320 * Math.cos(s.lat * Math.PI / 180));
  const bb = `${s.lat - dLat},${s.lon - dLon},${s.lat + dLat},${s.lon + dLon}`;
  const q = `[out:json][timeout:90];(way["waterway"~"^(stream|river)$"](${bb});way["natural"~"^(ridge|arete)$"](${bb});node["natural"~"^(saddle|peak)$"](${bb}););out geom;`;
  const EPS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
  for (let round = 0; round < 2; round++) for (const ep of EPS) {   // ⚠ 1回目の実行で 504 が続いた。間を置いてもう1周
    if (round) await new Promise(z => setTimeout(z, 10000));
    try {
      const res = await fetch(ep, { method: 'POST', headers: { 'user-agent': UA, 'content-type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(q) });
      if (!res.ok) { console.log(`OSM ${ep} ${res.status}`); continue; }
      return (await res.json()).elements;
    } catch (e) { console.log(`OSM ${ep} 失敗（${e.message}）`); }
  }
  return null;
}
// 地点を原点にした平面の m（東・北）
const toLocal = (s, lat, lon) => [(lon - s.lon) * 111320 * Math.cos(s.lat * Math.PI / 180), (lat - s.lat) * 110574];
function osmLocal(s, els) {
  const streams = [], ridges = [], saddles = [], peaks = [];
  const sample = (geom, out) => {   // 線を 5m おきの点に
    for (let i = 1; i < geom.length; i++) {
      const a = toLocal(s, geom[i - 1].lat, geom[i - 1].lon), b = toLocal(s, geom[i].lat, geom[i].lon);
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.ceil(L / 5));
      for (let j = 0; j < k; j++) out.push([a[0] + (b[0] - a[0]) * j / k, a[1] + (b[1] - a[1]) * j / k]);
    }
  };
  for (const e of els || []) {
    const t = e.tags || {};
    if (e.type === 'way' && e.geometry && /^(stream|river)$/.test(t.waterway || '')) sample(e.geometry, streams);
    else if (e.type === 'way' && e.geometry && /^(ridge|arete)$/.test(t.natural || '')) sample(e.geometry, ridges);
    else if (e.type === 'node' && t.natural === 'saddle') saddles.push({ p: toLocal(s, e.lat, e.lon), name: t.name || '' });
    else if (e.type === 'node' && t.natural === 'peak') peaks.push({ p: toLocal(s, e.lat, e.lon), name: t.name || '' });
  }
  return { streams, ridges, saddles, peaks };
}

// ---- ブラウザ（アプリの terrainFlow・FLOW をそのまま使う）----
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true,
  args: ['--js-flags=--max-old-space-size=4096'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
page.on('pageerror', e => console.log('pageerror:', e.message));
await page.goto(`${base}/sotoki_v4.html`);
await page.waitForFunction(() => typeof terrainFlow === 'function' && typeof FLOW === 'object', null, { timeout: 90000 });
// 手元の確かめ用：PROBE_FAKE=1 ならタイルを偽の地形（円錐＋鋭い尾根＋丸い尾根＋±1m の凹凸）で作る。地理院には行かない
if (process.env.PROBE_FAKE) await page.evaluate(() => {
  window.__fake = (z, tx, ty) => {
    const e = new Float32Array(65536), n = 256 * Math.pow(2, z), res = 40075016.7 * Math.cos(36.7 * Math.PI / 180) / n;
    for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
      const X = ((tx * 256 + i) / n - 0.5) * 40075016.7 * Math.cos(36.7 * Math.PI / 180), Y = ((ty * 256 + j) / n) * 40075016.7 * Math.cos(36.7 * Math.PI / 180);
      const x = ((X % 6000) + 6000) % 6000, y = ((Y % 6000) + 6000) % 6000;
      const cone = 1500 - 0.35 * Math.hypot(x - 1500, y - 3000), sharp = 1250 - 0.6 * Math.abs(x - 3800) - 0.02 * y, round = 1150 - ((x - 5200) ** 2) / 1600 - 0.02 * y;
      e[j * 256 + i] = Math.max(300, cone, sharp, round) + Math.sin(X * 0.37 + Y * 0.91) * Math.cos(X * 0.53 - Y * 0.29);
    }
    void res; return e;
  };
});

// ページ側：DEM を升目に並べ、terrainFlow を回し、稜線の候補（分水界＋頂）ごとに crossLow と CI を返す
await page.evaluate(() => {
  const tiles = new Map();
  async function tile(tpl, z, x, y) {
    const u = tpl.replace('{z}', z).replace('{x}', x).replace('{y}', y), k = u;
    if (tiles.has(k)) return tiles.get(k);
    const p = (async () => {
      if (window.__fake) return window.__fake(z, x, y);
      const r = await fetch('/proxy?u=' + encodeURIComponent(u));
      if (r.status !== 200) return null;
      const bmp = await createImageBitmap(await r.blob(), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
      const cv = new OffscreenCanvas(256, 256), c = cv.getContext('2d', { willReadFrequently: true });
      c.drawImage(bmp, 0, 0);
      const d = c.getImageData(0, 0, 256, 256).data, e = new Float32Array(65536);
      let valid = 0;
      for (let i = 0; i < 65536; i++) {
        const v = d[i * 4] * 65536 + d[i * 4 + 1] * 256 + d[i * 4 + 2];
        e[i] = (v === 8388608 || d[i * 4 + 3] === 0) ? NaN : (v < 8388608 ? v : v - 16777216) * 0.01;
        if (e[i] === e[i]) valid++;
      }
      return valid ? e : null;
    })();
    tiles.set(k, p);
    return p;
  }
  const worldPx = (lat, lon, z) => {
    const n = 256 * Math.pow(2, z), s = Math.sin(lat * Math.PI / 180);
    return [(lon + 180) / 360 * n, (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n];
  };
  // 1m の候補を探る：中心のタイルが取れて、値が入っているか
  window.__probeSrc = async (tpl, lat, lon, z) => {
    const [wx, wy] = worldPx(lat, lon, z), t = await tile(tpl, z, Math.floor(wx / 256), Math.floor(wy / 256));
    if (!t) return null;
    const v = t[Math.floor(wy % 256) * 256 + Math.floor(wx % 256)];
    // 実効の細かさ：1画素おきの2階差分が 0（折れ線＝粗い DEM の補間）になる割合
    let zero = 0, n = 0, med = [];
    for (let y = 1; y < 255; y += 3) for (let x = 1; x < 255; x++) {
      const a = t[y * 256 + x - 1], b = t[y * 256 + x], c = t[y * 256 + x + 1];
      if (a !== a || b !== b || c !== c) continue;
      const d2 = Math.abs(a - 2 * b + c); n++; if (d2 < 0.015) zero++; med.push(d2);
    }
    med.sort((a, b) => a - b);
    return { v, zeroFrac: n ? zero / n : NaN, medD2: med.length ? med[med.length >> 1] : NaN };
  };
  window.__run = async ({ lat, lon, boxM, z, m, srcs, ciR, img }) => {
    const t0 = performance.now();
    const p = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, z), cell = p * m;
    const [wxc, wyc] = worldPx(lat, lon, z);
    const nx = Math.ceil(boxM / cell), ny = nx, N = nx * ny;
    const x0 = Math.floor(wxc - nx * m / 2), y0 = Math.floor(wyc - ny * m / 2);
    // タイルを先に全部取る（出どころの内訳も数える）
    const need = new Set(), used = {};
    for (let ty = Math.floor(y0 / 256); ty <= Math.floor((y0 + ny * m - 1) / 256); ty++)
      for (let tx = Math.floor(x0 / 256); tx <= Math.floor((x0 + nx * m - 1) / 256); tx++) need.add(tx + ',' + ty);
    const tmap = new Map();
    await Promise.all([...need].map(async key => {
      const [tx, ty] = key.split(',').map(Number);
      for (const s of srcs) { const t = await tile(s.url, z, tx, ty); if (t) { tmap.set(key, t); used[s.id] = (used[s.id] || 0) + 1; return; } }
      used.none = (used.none || 0) + 1;
    }));
    // 出どころが混ざるとき（5A が無いタイルは 5B…）、タイル単位で次の候補へ。画素の欠けも次の候補で埋める
    const alt = async (tx, ty) => { for (const s of srcs.slice(1)) { const t = await tile(s.url, z, tx, ty); if (t) return t; } return null; };
    const h = new Float32Array(N).fill(NaN);
    const altCache = new Map();
    let filled = 0;
    for (let b = 0; b < ny; b++) for (let a = 0; a < nx; a++) {
      let sum = 0, cnt = 0;
      for (let j = 0; j < m; j++) for (let i = 0; i < m; i++) {
        const wx = x0 + a * m + i, wy = y0 + b * m + j, tx = Math.floor(wx / 256), ty = Math.floor(wy / 256), key = tx + ',' + ty;
        const t = tmap.get(key); let v = t ? t[(wy - ty * 256) * 256 + (wx - tx * 256)] : NaN;
        if (v !== v && srcs.length > 1) {
          if (!altCache.has(key)) altCache.set(key, await alt(tx, ty));
          const t2 = altCache.get(key); if (t2) { v = t2[(wy - ty * 256) * 256 + (wx - tx * 256)]; if (v === v) filled++; }
        }
        if (v === v) { sum += v; cnt++; }
      }
      if (cnt) h[b * nx + a] = sum / cnt;
    }
    let nv = 0, hMin = Infinity, hMax = -Infinity;
    for (let n = 0; n < N; n++) { const v = h[n]; if (v === v) { nv++; if (v < hMin) hMin = v; if (v > hMax) hMax = v; } }
    // 高い順（terrainDemGrid と同じ 0.1m 刻みの数え上げ）
    const order = new Uint32Array(nv);
    if (nv) {
      const B = Math.floor((hMax - hMin) * 10) + 1, c = new Uint32Array(B + 1);
      for (let n = 0; n < N; n++) { const v = h[n]; if (v === v) c[B - 1 - Math.floor((v - hMin) * 10)]++; }
      for (let q = 1; q <= B; q++) c[q] += c[q - 1];
      for (let n = N - 1; n >= 0; n--) { const v = h[n]; if (v === v) order[--c[B - 1 - Math.floor((v - hMin) * 10)]] = n; }
    }
    const G = { zd: z, m, x0, y0, nx, ny, N, cell, h, order, loading: false,
      inner: { x0: 0, y0: 0, x1: nx, y1: ny }, toLL: () => ({ lat: 0, lng: 0 }) };
    const tFetch = performance.now() - t0;
    // ⚠ 平らの判定は升目の間の標高差（m）なので、升目が細かいと同じ勾配でも「平ら」になる。勾配（0.15m／30m）でそろえる
    const flatTol0 = FLOW.FLAT_TOL_M;
    FLOW.FLAT_TOL_M = 0.005 * cell;
    const t1 = performance.now();
    let F;
    try { F = terrainFlow(G, []); } finally { FLOW.FLAT_TOL_M = flatTol0; }
    const tFlow = performance.now() - t1;
    // 稜線の候補（terrainFlow の分水界・頂と同じ条件。横断の条件だけ外して、あとで付け替える）
    const Q4 = [1, nx - 0, -1, -nx];   // 右・下・左・上（隣の添字の差）
    const okN = (n, d) => { const x = n % nx, nb = n + d; if (nb < 0 || nb >= N) return -1; if ((d === 1 && x === nx - 1) || (d === -1 && x === 0)) return -1; return h[nb] === h[nb] ? nb : -1; };
    const bil = (fx, fy) => {
      const x = Math.floor(fx), y = Math.floor(fy);
      if (x < 0 || y < 0 || x >= nx - 1 || y >= ny - 1) return NaN;
      const tx = fx - x, ty = fy - y, n = y * nx + x;
      return (h[n] * (1 - tx) + h[n + 1] * tx) * (1 - ty) + (h[n + nx] * (1 - tx) + h[n + nx + 1] * tx) * ty;
    };
    // CI（収束指数・探索半径 R m）：半径 R の円周上16点の下りの向きが、中心から外へ向くか。+100＝発散（頂・尾根）、−100＝収束（谷）
    const ci = (n, R) => {
      const x = n % nx, y = (n - x) / nx, r = Math.max(1, R / cell), s = Math.max(1, r / 3);
      let sum = 0, k = 0;
      for (let i = 0; i < 16; i++) {
        const th = i * Math.PI / 8, ox = Math.cos(th), oy = Math.sin(th), sx = x + r * ox, sy = y + r * oy;
        const gx = (bil(sx + s, sy) - bil(sx - s, sy)) / (2 * s), gy = (bil(sx, sy + s) - bil(sx, sy - s)) / (2 * s), gl = Math.hypot(gx, gy);
        if (!(gl > 1e-6)) continue;
        const c = Math.max(-1, Math.min(1, (-gx * ox - gy * oy) / gl));
        sum += 90 - Math.acos(c) * 180 / Math.PI; k++;
      }
      return k >= 12 ? sum / k / 90 * 100 : NaN;
    };
    const border = Math.round(150 / cell);
    const inB = n => { const x = n % nx, y = (n - x) / nx; return x >= border && y >= border && x < nx - border && y < ny - border; };
    const toE = n => { const x = n % nx, y = (n - x) / nx; return [Math.round(((x0 + (x + 0.5) * m) - wxc) * p * 10) / 10, Math.round(-((y0 + (y + 0.5) * m) - wyc) * p * 10) / 10]; };
    const cand = [], chan = [];
    const candFlag = new Uint8Array(N);   // 1＝候補（横断で落ちる）、2＝現行の稜線（候補＋横断を満たす）、画像用
    for (let n = 0; n < N; n++) {
      const hn = h[n]; if (hn !== hn || !inB(n)) continue;
      if (F.chan[n]) { chan.push(toE(n)); continue; }
      if (F.flat[n]) continue;
      let kind = 0;
      if (F.up[n] < 0 && F.down[n] >= 0) { if (F.hand[n] >= FLOW.RIDGE_HAND_M || F.hand[n] !== F.hand[n]) kind = 1; }   // 頂
      else if (F.basin[n] >= 0 && F.hand[n] >= FLOW.RIDGE_HAND_M) {
        for (const d of Q4) {
          const nb = okN(n, d); if (nb < 0) continue;
          if (F.basin[nb] >= 0 && F.basin[nb] !== F.basin[n] && (h[nb] < hn || (h[nb] === hn && nb > n))) { kind = 2; break; }
        }
      }
      if (!kind) continue;
      let cross = true;   // terrainFlow の crossLow と同じ（crossInfo の両側の低さ ≧ 必要な低さ）
      if (kind === 2) { const ci0 = F.crossInfo(n); if (ci0) cross = ci0.lows.every(v => v >= ci0.need); }
      const e = toE(n), row = [e[0], e[1], kind, cross ? 1 : 0];
      for (const R of ciR) { const v = ci(n, R); row.push(v === v ? Math.round(v) : null); }
      cand.push(row);
      candFlag[n] = cross ? 2 : 1;
    }
    let image = null;
    if (img) {
      // 陰影（北西の光）＋沢（青）＋稜線：現行＝赤、CI のみ＝黄（img.ciR, img.ciT）。OSM の沢（水色）・鞍部（緑）・山頂（白）
      const cv = new OffscreenCanvas(nx, ny), c = cv.getContext('2d'), im = c.createImageData(nx, ny), d = im.data;
      const ciIdx = ciR.indexOf(img.ciR);
      const ciOk = new Uint8Array(N);
      { let i = 0; for (let n = 0; n < N; n++) if (candFlag[n]) { const v = cand[i++][4 + ciIdx]; ciOk[n] = (cand[i - 1][2] === 1) || (v != null && v >= img.ciT) ? 1 : 0; } }
      for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
        const n = y * nx + x, v = h[n];
        let g = 40;
        if (v === v && x > 0 && y > 0 && x < nx - 1 && y < ny - 1) {
          const dx = (h[n + 1] - h[n - 1]) / (2 * cell), dy = (h[n + nx] - h[n - nx]) / (2 * cell);
          const sh = (-dx * -0.7071 - dy * -0.7071 + 1) / Math.sqrt(dx * dx + dy * dy + 1);   // 光は北西の上から（東・南の成分で −,−）
          g = Math.max(0, Math.min(255, 60 + 150 * sh / 1.7));
        }
        let r = g, gg = g, b = g;
        if (F.chan[n]) { r = 40; gg = 110; b = 255; }
        const cur = candFlag[n] === 2, cin = ciOk[n] === 1;
        if (cur && cin) { r = 255; gg = 140; b = 0; } else if (cur) { r = 255; gg = 30; b = 30; } else if (cin) { r = 255; gg = 240; b = 0; }
        const o = n * 4; d[o] = r; d[o + 1] = gg; d[o + 2] = b; d[o + 3] = 255;
      }
      c.putImageData(im, 0, 0);
      const px = e => [(e[0] / p + wxc - x0) / m, (-e[1] / p + wyc - y0) / m];
      c.fillStyle = 'rgba(0,255,255,0.8)';
      for (const e of img.osm.streams) { const [a, b] = px(e); c.fillRect(a, b, 1, 1); }
      for (const [list, col] of [[img.osm.saddles, '#0f0'], [img.osm.peaks, '#fff']]) {
        c.strokeStyle = col; c.lineWidth = Math.max(1, nx / 400);
        for (const s of list) { const [a, b] = px(s.p); c.beginPath(); c.arc(a, b, Math.max(3, nx / 150), 0, 2 * Math.PI); c.stroke(); }
      }
      const blob = await cv.convertToBlob({ type: 'image/png' });
      const buf = new Uint8Array(await blob.arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      image = btoa(s);
    }
    // 標高の欠け（10m おきに間引いた点）。欠けの近くは評価から外す（細かい DEM の配信が無い所を「不一致」に数えない）
    const holes = [], hk = Math.max(1, Math.round(10 / cell));
    for (let y = 0; y < ny; y += hk) for (let x = 0; x < nx; x += hk) if (h[y * nx + x] !== h[y * nx + x]) holes.push(toE(y * nx + x));
    return { cell, nx, N, nv, used, filled, tFetch, tFlow, cand, chan, holes, image, bridged: F.bridged };
  };
});

// ---- 回す ----
const CI_R = [30, 60, 120];     // CI の探索半径（m）
const CI_T = [10, 25, 40];      // CI の閾値
const IMG_CI = { ciR: 60, ciT: 25 };
const results = [];
function fmt(v, d = 0) { return v == null || v !== v ? '' : v.toFixed(d); }
const pct = v => v == null || v !== v ? '－' : (v * 100).toFixed(0) + '%';

for (const s of SITES) {
  console.log(`\n===== ${s.name}（${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}） =====`);
  const els = await osm(s, 2200);
  const O = osmLocal(s, els);
  console.log(`OSM：沢の点 ${O.streams.length}（5m おき）・尾根線の点 ${O.ridges.length}・鞍部 ${O.saddles.length}・山頂 ${O.peaks.length}` + (els ? '' : '（取得失敗）'));
  for (const x of O.saddles) console.log(`  鞍部 ${x.name || '(無名)'} ${fmt(x.p[0])},${fmt(x.p[1])}`);
  // 1m の候補を探る
  const oneM = [];
  for (const c of ONE_M) {
    const r = await page.evaluate(({ url, lat, lon }) => window.__probeSrc(url, lat, lon, 17), { url: c.url, lat: s.lat, lon: s.lon });
    console.log(`1m の候補 ${c.id} z17：` + (r ? `標高 ${fmt(r.v, 1)}m・2階差分0の割合 ${fmt(r.zeroFrac * 100)}%・中央値 ${fmt(r.medD2, 3)}m` : '取れない'));
    if (r && r.v === r.v) oneM.push({ ...c, ...r });
  }
  // 2階差分0の割合が小さい（＝補間の折れ線ではない）ものを 1m として使う
  const best = oneM.sort((a, b) => a.zeroFrac - b.zeroFrac)[0];
  const RUNS = [
    { id: '30m', label: '地理院 z12（現行・約30m）', z: 12, m: 1, boxM: 4000, srcs: [{ id: 'dem10b', url: DEM.gsi }] },
    { id: '10m', label: '地理院 z14（DEM10B）', z: 14, m: 1, boxM: 4000, srcs: [{ id: 'dem10b', url: DEM.gsi }] },
    { id: '5m', label: '地理院 z15（DEM5A→5B→5C）', z: 15, m: 1, boxM: 4000,
      srcs: [{ id: 'dem5a', url: DEM.gsi5a }, { id: 'dem5b', url: DEM.gsi5b }, { id: 'dem5c', url: DEM.gsi5c }, { id: 'dem10b', url: DEM.gsi }] },
    { id: '5m-s', label: '同上・1.2km 四方（範囲の影響を見る対照）', z: 15, m: 1, boxM: 1200,
      srcs: [{ id: 'dem5a', url: DEM.gsi5a }, { id: 'dem5b', url: DEM.gsi5b }, { id: 'dem5c', url: DEM.gsi5c }, { id: 'dem10b', url: DEM.gsi }] },
  ];
  if (best) {
    RUNS.push({ id: '2m', label: `${best.id} z17 を2×2で平均（約2m）・2.4km 四方`, z: 17, m: 2, boxM: 2400, srcs: [{ id: best.id, url: best.url }] });
    RUNS.push({ id: '1m', label: `${best.id} z17（約1m）・1.2km 四方`, z: 17, m: 1, boxM: 1200, srcs: [{ id: best.id, url: best.url }] });
  } else console.log('1m：使える候補なし（30m／10m／5m だけで比べる）');
  for (const run of RUNS) {
    let r;
    try {
      r = await page.evaluate(a => window.__run(a), { lat: s.lat, lon: s.lon, boxM: run.boxM, z: run.z, m: run.m, srcs: run.srcs, ciR: CI_R, img: { ...IMG_CI, osm: O } });
    } catch (e) { console.log(`${run.id}：失敗（${e.message.split('\n')[0]}）`); continue; }
    if (r.image) fs.writeFileSync(path.join(OUT, `${s.key}_${run.id}.png`), Buffer.from(r.image, 'base64'));
    delete r.image;
    console.log(`${run.id} ${run.label}：升目 ${fmt(r.cell, 2)}m × ${r.nx}²（${r.N}）・値あり ${fmt(r.nv / r.N * 100, 1)}%・出どころ ${JSON.stringify(r.used)}・補填 ${r.filled}・取得 ${fmt(r.tFetch)}ms・terrainFlow ${fmt(r.tFlow)}ms`);
    results.push({ site: s, O, run, r });
  }
}
await browser.close();
server.close();

// ---- 評価（Node 側）----
// 空間の網（点の近さを数える）
function hashOf(pts, cs = 20) {
  const m = new Map();
  for (const p of pts) { const k = Math.floor(p[0] / cs) + ',' + Math.floor(p[1] / cs); let a = m.get(k); if (!a) m.set(k, a = []); a.push(p); }
  return { m, cs };
}
function near(H, p, d) {
  const r = Math.ceil(d / H.cs), bx = Math.floor(p[0] / H.cs), by = Math.floor(p[1] / H.cs), d2 = d * d;
  for (let y = by - r; y <= by + r; y++) for (let x = bx - r; x <= bx + r; x++) {
    const a = H.m.get(x + ',' + y); if (!a) continue;
    for (const q of a) if ((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 <= d2) return true;
  }
  return false;
}
const inSq = (p, half) => Math.abs(p[0]) <= half && Math.abs(p[1]) <= half;
const frac = (pts, H, d) => pts.length ? pts.filter(p => near(H, p, d)).length / pts.length : NaN;
// 稜線の方式：現行（候補＋横断）と CI（候補＋CI≧T。頂はそのまま）
const METHODS = [{ id: 'cur', label: '現行（横断60m）', pick: c => c[3] === 1 }];
for (const [ri, R] of CI_R.entries()) for (const T of CI_T)
  METHODS.push({ id: `ci${R}_${T}`, label: `CI R${R}m ≧${T}`, pick: c => c[2] === 1 || (c[4 + ri] != null && c[4 + ri] >= T) });
METHODS.push({ id: 'none', label: '（横断の条件なし＝分水界すべて）', pick: () => true });

const EVAL = [{ id: 'S', half: 450, label: '中心の 900m 四方（全解像度で比べられる）' }, { id: 'L', half: 1700, label: '中心の 3.4km 四方（4km の範囲で回したものだけ）' }];
const lines = [];
const out = (...a) => { const t = a.join(''); console.log(t); lines.push(t); };
out('# DEM の解像度と尾根・沢の判定（実験）');
out('');
out(`取得：${stat.req} 回（成功 ${stat.ok}・無し ${stat.miss}）`);
for (const site of SITES) {
  const rs = results.filter(x => x.site === site);
  if (!rs.length) continue;
  const O = rs[0].O;
  out(`\n## ${site.name}\n`);
  out(`OSM：沢の点 ${O.streams.length}・鞍部 ${O.saddles.length}・山頂 ${O.peaks.length}・尾根線の点 ${O.ridges.length}\n`);
  for (const E of EVAL) {
    const rows = rs.filter(x => E.id === 'S' || x.run.boxM >= 4000);
    if (!rows.length) continue;
    const area = (2 * E.half / 1000) ** 2;
    const finest = rows.filter(x => x.run.id !== '5m-s').sort((a, b) => a.r.cell - b.r.cell)[0];
    // 欠けの近く（30m 以内）は、比べる2つのどちらかにあれば外す。箱の外も欠けとみなす
    for (const x of rows) x.Hh = hashOf(x.r.holes);
    const okAt = (p, ...xs) => xs.every(x => Math.abs(p[0]) <= x.run.boxM / 2 - 150 && Math.abs(p[1]) <= x.run.boxM / 2 - 150 && !near(x.Hh, p, 30));
    const validFrac = x => { let a = 0, b = 0; for (let yy = -E.half; yy <= E.half; yy += 20) for (let xx = -E.half; xx <= E.half; xx += 20) { b++; if (okAt([xx, yy], x)) a++; } return a / b; };
    const streams = O.streams.filter(p => inSq(p, E.half)), Hs = hashOf(streams);
    const marks = [...O.saddles, ...O.peaks].map(x => x.p).filter(p => inSq(p, E.half));
    const sadd = O.saddles.map(x => x.p).filter(p => inSq(p, E.half));
    const oRidge = O.ridges.filter(p => inSq(p, E.half));   // OSM の尾根線（ridge/arete）。方式にも解像度にも寄らない唯一の独立した正解
    out(`### ${E.label}（OSM：沢の点 ${streams.length}・鞍部 ${sadd.length}・鞍部＋山頂 ${marks.length}・尾根線の点 ${oRidge.length}）\n`);
    // 沢
    out('**沢**（OSM の沢との一致。精度＝検出した沢の升目のうち OSM の沢から d 以内、再現＝OSM の沢の点のうち検出した沢から d 以内）\n');
    out('| DEM | 升目 | 沢の密度 km/km² | 精度 30m | 精度 60m | 再現 30m | 再現 60m | 値のある範囲 | terrainFlow |');
    out('|---|---|---|---|---|---|---|---|---|');
    for (const x of rows) {
      const ch = x.r.chan.filter(p => inSq(p, E.half)), Hc = hashOf(ch), st = streams.filter(p => okAt(p, x));
      out(`| ${x.run.id} | ${fmt(x.r.cell, 1)}m | ${fmt(ch.length * x.r.cell / 1000 / area, 1)} | ${pct(frac(ch, Hs, 30))} | ${pct(frac(ch, Hs, 60))} | ${pct(frac(st, Hc, 30))} | ${pct(frac(st, Hc, 60))} | ${pct(validFrac(x))} | ${fmt(x.r.tFlow)}ms（${x.r.N}升目） |`);
    }
    // 稜線
    out('\n**稜線**（密度＝稜線の升目×升目の幅。鞍部・山頂に稜線が d 以内に来る割合。細かい DEM との一致＝同じ方式でいちばん細かい DEM の稜線から 30m 以内の割合）\n');
    out(`（いちばん細かい DEM：${finest.run.id}。一致は両方に値がある所だけで数える。「同じ方式」＝その方式で細かい DEM を回した稜線、「現行」＝細かい DEM を現行の条件で回した稜線＝方式どうしで同じ相手）\n`);
    out('| DEM | 方式 | 密度 km/km² | 鞍部 30m | 鞍部 60m | 鞍部＋山頂 60m | 同じ方式：精度 | 同じ方式：再現 | 現行：精度 | 現行：再現 | OSM尾根線 30m | OSM尾根線 60m |');
    out('|---|---|---|---|---|---|---|---|---|---|---|---|');
    const curM = METHODS.find(q => q.id === 'cur');
    const refCur = finest.r.cand.filter(c => curM.pick(c) && inSq(c, E.half));
    const sel = ['cur', 'ci30_25', 'ci60_10', 'ci60_25', 'ci60_40', 'ci120_25', 'none'];
    for (const mid of sel) {
      const M = METHODS.find(q => q.id === mid);
      const ref = finest.r.cand.filter(c => M.pick(c) && inSq(c, E.half)), Href = hashOf(ref);
      for (const x of rows) {
        const rp = x.r.cand.filter(c => M.pick(c) && inSq(c, E.half)), Hr = hashOf(rp);
        const same = x === finest, rpV = rp.filter(p => okAt(p, x, finest)), refV = ref.filter(p => okAt(p, x, finest)), curV = refCur.filter(p => okAt(p, x, finest));
        const Hc = hashOf(refCur);
        out(`| ${x.run.id} | ${M.label} | ${fmt(rp.length * x.r.cell / 1000 / area, 1)} | ${pct(frac(sadd, Hr, 30))} | ${pct(frac(sadd, Hr, 60))} | ${pct(frac(marks, Hr, 60))} | ${same ? '—' : pct(frac(rpV, Href, 30))} | ${same ? '—' : pct(frac(refV, Hr, 30))} | ${pct(frac(rpV, Hc, 30))} | ${pct(frac(curV, Hr, 30))} | ${pct(frac(oRidge.filter(p => okAt(p, x)), Hr, 30))} | ${pct(frac(oRidge.filter(p => okAt(p, x)), Hr, 60))} |`);
      }
    }
    out('');
  }
}
out('\n画像（artifact）：灰＝陰影、青＝沢、赤＝現行の稜線だけ、黄＝CI（R60m ≧25）だけ、橙＝両方、水色＝OSM の沢、緑○＝OSM の鞍部、白○＝OSM の山頂');
fs.writeFileSync(path.join(OUT, 'summary.md'), lines.join('\n') + '\n');
fs.writeFileSync(path.join(OUT, 'raw.json'), JSON.stringify(results.map(x => ({ site: x.site.name, run: x.run.id, cell: x.r.cell, N: x.r.N, used: x.r.used, tFlow: x.r.tFlow,
  nCand: x.r.cand.length, nChan: x.r.chan.length }))));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
