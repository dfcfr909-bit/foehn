#!/usr/bin/env python3
# 地理院の標高タイル（PNG）を並べて GeoTIFF（Webメルカトル）にする。WindNinja の入力用（調査）
# 使い方: python3 fetchDem.py <緯度> <経度> <半径km> <z> <src: dem5a_png|dem_png> <出力.asc>
# 出力は ESRI ASCII グリッド（Webメルカトル）。投影は gdalwarp で UTM へ（README）
import sys, math, io, urllib.request
import numpy as np
from PIL import Image

lat, lon, rkm, z, src, out = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5], sys.argv[6]
R = 6378137.0
def merc(lat, lon):
    return R * math.radians(lon), R * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
cx, cy = merc(lat, lon)
half = rkm * 1000 / math.cos(math.radians(lat))   # メルカトル上の長さ（緯度で伸びる）
W = 2 * math.pi * R; ts = W / 2 ** z
def tile(x, y): return int((x + W / 2) // ts), int((W / 2 - y) // ts)
x0, y0 = tile(cx - half, cy + half); x1, y1 = tile(cx + half, cy - half)
nx, ny = x1 - x0 + 1, y1 - y0 + 1
arr = np.full((ny * 256, nx * 256), np.nan, dtype=np.float32)
for ty in range(y0, y1 + 1):
    for tx in range(x0, x1 + 1):
        url = f'https://cyberjapandata.gsi.go.jp/xyz/{src}/{z}/{tx}/{ty}.png'
        try:
            d = np.asarray(Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=30).read())).convert('RGB')).astype(np.int64)
        except Exception as e:
            print('miss', url, e, file=sys.stderr); continue
        x = d[..., 0] * 65536 + d[..., 1] * 256 + d[..., 2]
        h = np.where(x < 2 ** 23, x, x - 2 ** 24) * 0.01
        h = np.where(x == 2 ** 23, np.nan, h)
        arr[(ty - y0) * 256:(ty - y0 + 1) * 256, (tx - x0) * 256:(tx - x0 + 1) * 256] = h
px = ts / 256
with open(out, 'w') as f:
    f.write(f"ncols {arr.shape[1]}\nnrows {arr.shape[0]}\nxllcorner {x0 * ts - W / 2:.3f}\nyllcorner {W / 2 - (y1 + 1) * ts:.3f}\ncellsize {px:.6f}\nNODATA_value -9999\n")
    np.savetxt(f, np.nan_to_num(arr, nan=-9999), fmt='%.2f')
print(out, arr.shape, 'nan:', int(np.isnan(arr).sum()), 'min/max:', np.nanmin(arr), np.nanmax(arr))
