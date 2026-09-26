/* 国土地理院の標高タイル（dem_png）を Node で読むための道具。
 * scripts/probeTerrainRef.mjs と scripts/buildTerrainRef.mjs で共通に使う（書き写さない）。
 *
 * ⚠ 標高の読み方はアプリの decodeDemPixel（sotoki_v4.html）と同じ定義:
 *   x = R*65536 + G*256 + B として
 *     x <  2^23 : x * 0.01 [m]
 *     x == 2^23 : 無効値（海域・データなし）
 *     x >  2^23 : (x - 2^24) * 0.01（負の標高）
 */
import { inflateSync } from 'node:zlib';

export const DEM_URL = 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png';

// 最小の PNG 読み（8bit RGB/RGBA・インターレース無し。dem_png はこれ）
export function decodePng(buf) {
  let p = 8, w = 0, h = 0, ct = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString('ascii', p + 4, p + 8);
    const data = buf.subarray(p + 8, p + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4); ct = data[9];
      if (data[8] !== 8 || data[12] !== 0) throw new Error('未対応のPNG（8bit・インターレース無しだけ読める）');
    } else if (type === 'IDAT') idat.push(data);
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
      else if (f === 4) {
        const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      out[y * stride + x] = v & 255;
    }
  }
  return { w, h, bpp, px: out };
}

export const demOf = (r, g, b) => {
  const x = r * 65536 + g * 256 + b;
  return x === 8388608 ? null : (x < 8388608 ? x : x - 16777216) * 0.01;
};

// Webメルカトルのタイル座標（小数）⇔ 緯度経度
export const tileX = (lon, z) => (lon + 180) / 360 * 2 ** z;
export const tileY = (lat, z) => {
  const r = lat * Math.PI / 180;
  return (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z;
};
export const lonOfX = (x, z) => x / 2 ** z * 360 - 180;
export const latOfY = (y, z) => {
  const n = Math.PI - 2 * Math.PI * y / 2 ** z;
  return 180 / Math.PI * Math.atan(Math.sinh(n));
};

// 1枚取って読む。無い（海など404）・読めないときは null
export async function fetchDemTile(z, x, y, timeoutMs = 30000) {
  const url = DEM_URL.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return { status: res.status, img: null };
    return { status: res.status, img: decodePng(Buffer.from(await res.arrayBuffer())) };
  } catch (e) {
    return { status: 0, img: null, error: e.message };
  }
}
