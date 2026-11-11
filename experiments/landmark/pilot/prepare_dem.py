# 試作（栃木北部）：範囲全体を覆うマスター DEM を1枚作る（新規）。
#   地理院 dem_png z12（約30m）を、既存の fetchGsiDem.py（変更しない。subprocess で呼ぶ）で UTM 54N に再投影する。
#   タイルはすべてこのマスターから切り出す → 升目の位置が全タイルでそろい、つなぎ目で線の座標が一致する。
#   ⚠ 出力（pilot/data/）は .gitignore 対象。コミットしない（public リポジトリ・測量法の確認中）。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/prepare_dem.py
import math, os, subprocess, sys
import numpy as np
import rasterio
from pyproj import Transformer

BBOX = {"lat0": 36.70, "lat1": 37.20, "lon0": 139.35, "lon1": 140.05}   # 北緯・東経
UTM = "EPSG:32654"
MAX_MARGIN_M = 3000.0
EXTRA_M = 2000.0   # マスターの縁（再投影の欠け）を避ける分
DEM_URL = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png"
OUT = "pilot/data/master_z12.tif"


def bbox_utm():
    t = Transformer.from_crs(4326, UTM, always_xy=True)
    pts = [t.transform(lo, la) for la in np.linspace(BBOX["lat0"], BBOX["lat1"], 21) for lo in np.linspace(BBOX["lon0"], BBOX["lon1"], 21)]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    return min(xs), min(ys), max(xs), max(ys)


def main():
    os.makedirs("pilot/data", exist_ok=True)
    x0, y0, x1, y1 = bbox_utm()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    half = max(x1 - x0, y1 - y0) / 2 + MAX_MARGIN_M + EXTRA_M
    lon, lat = Transformer.from_crs(UTM, 4326, always_xy=True).transform(cx, cy)
    print(f"bbox（UTM）x {x0:.0f}〜{x1:.0f}・y {y0:.0f}〜{y1:.0f}（{(x1-x0)/1000:.1f}×{(y1-y0)/1000:.1f}km）中心 {lat:.5f},{lon:.5f} 半幅 {half:.0f}m")
    # ⚠ fetchGsiDem.py は Web Mercator 側を「半幅m」で切り出すので、地上距離では cos(緯度) 倍の範囲しか取れず、
    #   UTM の外周が欠ける（findings3・4 の縁の欠けと同じ）。既存ファイルは変えず、半幅を 1/cos(緯度) 倍に広げて呼ぶ
    half_fetch = half / math.cos(math.radians(lat)) + 1000.0
    if not os.path.exists(OUT):
        r = subprocess.run([sys.executable, "fetchGsiDem.py", str(lat), str(lon), str(half_fetch), "12", DEM_URL, OUT, UTM])
        if r.returncode != 0:
            sys.exit("DEM の取得に失敗")
    with rasterio.open(OUT) as d:
        h = d.read(1); tr = d.transform; nod = d.nodata
    ok = h != nod
    # bbox＋最大余白の範囲に欠測が無いか
    c0 = int((x0 - MAX_MARGIN_M - tr.c) / tr.a); c1 = int(math.ceil((x1 + MAX_MARGIN_M - tr.c) / tr.a))
    r0 = int((tr.f - (y1 + MAX_MARGIN_M)) / -tr.e); r1 = int(math.ceil((tr.f - (y0 - MAX_MARGIN_M)) / -tr.e))
    sub = ok[max(r0, 0):r1, max(c0, 0):c1]
    print(f"マスター {h.shape[1]}×{h.shape[0]} 升目・{tr.a:.2f}m・全体の有効 {ok.mean()*100:.2f}%・bbox＋3km の有効 {sub.mean()*100:.3f}%"
          f"（範囲がマスターの内側か: {r0 >= 0 and c0 >= 0 and r1 <= h.shape[0] and c1 <= h.shape[1]}）")


if __name__ == "__main__":
    main()
