# 採用設計の調査（design_options.md）用：対象範囲の候補ごとの「山岳域の面積」を測る（新規）。
#   定義は enum_saddle_candidates.py の山岳域と同じ：地理院 DEM z10（約150m/画素）の 16×16 画素ブロック
#   （＝z14 タイル1枚分）の最高標高が 500m 以上。参考に 1,000m 以上も数える。
#   ブロックの面積は緯度で補正する（Web Mercator の1ブロック × cos²(緯度)）。
#   ⚠ 範囲は経緯度の矩形の近似（県境ではない）。隣の県の一部を含む。
#   ⚠ LANDMARK・現行方式の再計算ではない（標高タイルを読んで面積を数えるだけ）。
# 使い方: .venv/Scripts/python.exe estimate_areas.py > out/estimate_areas.log
import io, json, math, os
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from PIL import Image
from enum_saddle_candidates import http_get, lonlat_to_tile

Z = 10
REGIONS = {
    "A 東北＋新潟＋栃木（36.2–41.6N・138.4–142.1E）": (36.2, 41.6, 138.4, 142.1),
    "B 中部山岳（北・中央・南アルプス・八ヶ岳・白山・御嶽）（35.1–37.0N・136.5–138.8E）": (35.1, 37.0, 136.5, 138.8),
    "C これまでの列挙範囲（35.2–41.6N・137.2–142.1E）": (35.2, 41.6, 137.2, 142.1),
    "D 全国（沖縄・離島の一部を除く）（30.0–45.6N・128.0–146.0E）": (30.0, 45.6, 128.0, 146.0),
}
CACHE = "out/estimate_areas_blocks.json"


def tile_blocks(xy):
    x, y = xy
    b = http_get(f"https://cyberjapandata.gsi.go.jp/xyz/dem_png/{Z}/{x}/{y}.png")
    if b is None:
        return xy, None
    im = np.array(Image.open(io.BytesIO(b)).convert("RGB")).astype(np.int64)
    v = im[:, :, 0] * 65536 + im[:, :, 1] * 256 + im[:, :, 2]
    z = np.where(v < 8388608, v, v - 16777216) * 0.01
    z[v == 8388608] = -9999
    return xy, z.reshape(16, 16, 16, 16).max(axis=(1, 3)).round(1).tolist()   # 16×16 ブロックの最高標高


def main():
    lat0 = min(r[0] for r in REGIONS.values()); lat1 = max(r[1] for r in REGIONS.values())
    lon0 = min(r[2] for r in REGIONS.values()); lon1 = max(r[3] for r in REGIONS.values())
    x0, y0 = lonlat_to_tile(lon0, lat1, Z); x1, y1 = lonlat_to_tile(lon1, lat0, Z)
    cache = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    todo = [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1) if f"{x}/{y}" not in cache]
    with ThreadPoolExecutor(8) as ex:
        for (x, y), blk in ex.map(tile_blocks, todo):
            cache[f"{x}/{y}"] = blk
    json.dump(cache, open(CACHE, "w"))
    n = 2 ** (Z + 4)   # ブロックは z14 のタイルと同じ
    circ = 2 * math.pi * 6378137.0 / 1000
    for name, (a0, a1, o0, o1) in REGIONS.items():
        s500 = s1000 = 0.0; n500 = 0
        for key, blk in cache.items():
            if blk is None:
                continue
            x, y = map(int, key.split("/"))
            B = np.array(blk)
            for j in range(16):
                for i in range(16):
                    bx, by = x * 16 + i + 0.5, y * 16 + j + 0.5
                    lon = bx / n * 360 - 180
                    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * by / n))))
                    if not (a0 <= lat <= a1 and o0 <= lon <= o1):
                        continue
                    area = (circ / n * math.cos(math.radians(lat))) ** 2
                    if B[j, i] >= 500:
                        s500 += area; n500 += 1
                    if B[j, i] >= 1000:
                        s1000 += area
        print(f"{name}: 最高標高500m以上のブロック {n500:,}（z14 タイル相当）・面積 {s500:,.0f}km²／1,000m以上 {s1000:,.0f}km²")


if __name__ == "__main__":
    main()
