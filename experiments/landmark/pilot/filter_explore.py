# 試作（栃木北部）：絞り込みの閾値を選ぶための分布（新規）。m3 の尾根の区間（bbox 内）について、
#   A_spread の段 × 起伏（1km四方の最高−最低）の帯の長さ（km）を出す。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/filter_explore.py
import numpy as np
import rasterio
from scipy.ndimage import maximum_filter, minimum_filter
from pyproj import Transformer
from pilot_lines import load_meta, master_info, assemble
from prepare_dem import BBOX, UTM

meta = load_meta(); tr, cell = master_info()
A = assemble(sorted(n for n, t in meta["tiles"].items() if t.get("margin") == "m3"), meta, tr)
with rasterio.open("pilot/data/master_z12.tif") as d:
    h = d.read(1).astype(float); nod = d.nodata
ok = h != nod
rel = maximum_filter(np.where(ok, h, -1e9), 33) - minimum_filter(np.where(ok, h, 1e9), 33)
P = A["R"].mean(axis=1); L = np.hypot(*(A["R"][:, 1] - A["R"][:, 0]).T)
lo, la = Transformer.from_crs(UTM, 4326, always_xy=True).transform(P[:, 0], P[:, 1])
inb = (lo >= BBOX["lon0"]) & (lo <= BBOX["lon1"]) & (la >= BBOX["lat0"]) & (la <= BBOX["lat1"])
c = ((P[:, 0] - tr.c) / tr.a).astype(int); r = ((P[:, 1] - tr.f) / tr.e).astype(int)
v = rel[r, c]; a = A["A_spread"]
TA = [1e5, 3e5, 1e6, 3e6, 1e7, 1e20]; TR = [0, 30, 60, 100, 200, 1e9]
print("尾根の区間（bbox 内・km）：行＝A_spread の段、列＝起伏の帯")
print("  A_spread | " + " | ".join(f"{int(x)}–{int(y) if y < 1e8 else '∞'}m" for x, y in zip(TR[:-1], TR[1:])) + " | 合計")
for x0, x1 in zip(TA[:-1], TA[1:]):
    s = inb & (a >= x0) & (a < x1)
    cells = [f"{L[s & (v >= y0) & (v < y1)].sum()/1000:6.0f}" for y0, y1 in zip(TR[:-1], TR[1:])]
    print(f"  {x0:.0e}〜 | " + " | ".join(cells) + f" | {L[s].sum()/1000:6.0f}")
print("A_spread の区間数での分位（bbox 内。区間の長さは約30〜43m でほぼそろう）:", {q: f"{np.percentile(a[inb], q):.2e}" for q in [10, 25, 50, 75, 90]})
print("累積（A_spread≧T の長さ km）:", {f"{t:.0e}": round(L[inb & (a >= t)].sum() / 1000) for t in [1e5, 2e5, 3e5, 5e5, 1e6, 2e6, 3e6, 1e7]})
