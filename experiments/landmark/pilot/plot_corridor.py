# 試作の確認用（新規）：山の回廊（2つの山頂の間）の尾根の区間を、陰影と重ねて描く。自分で見る用。
# ⚠ 画像（pilot/out/corridor_*.png）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/plot_corridor.py 女峰山 赤薙山
import sys
import numpy as np
import rasterio
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from pilot_lines import load_meta, master_info, assemble
from hand_trial import SUMMITS, TO_UTM
plt.rcParams["font.family"] = ["Yu Gothic", "Meiryo", "sans-serif"]
a, b = sys.argv[1], sys.argv[2]
meta = load_meta(); tr, cell = master_info()
A = assemble(sorted(n for n, t in meta["tiles"].items() if t.get("margin") == "m3"), meta, tr)
pa, pb = np.array(TO_UTM.transform(*SUMMITS[a])), np.array(TO_UTM.transform(*SUMMITS[b]))
c = (pa + pb) / 2; half = max(abs(pa - pb)) / 2 + 1500
x0, x1, y0, y1 = c[0] - half, c[0] + half, c[1] - half, c[1] + half
with rasterio.open("pilot/data/master_z12.tif") as d:
    Z = d.read(1).astype(float); T = d.transform
c0, c1 = int((x0 - T.c) / T.a), int((x1 - T.c) / T.a); r0, r1 = int((T.f - y1) / -T.e), int((T.f - y0) / -T.e)
z = Z[r0:r1, c0:c1]; gy, gx = np.gradient(z, cell)
sh = np.clip(np.cos(np.arctan(np.hypot(gx, gy))) * 0.7 + 0.3 * (-gx - gy) / (np.hypot(gx, gy) + 1e-6) * np.sin(np.arctan(np.hypot(gx, gy))), 0, 1)
fig, ax = plt.subplots(figsize=(10, 10))
ax.imshow(sh, cmap="gray", extent=[x0, x1, y0, y1], origin="upper")
cs = ax.contour(np.linspace(x0, x1, z.shape[1]), np.linspace(y1, y0, z.shape[0]), z, levels=np.arange(1000, 2600, 50), colors="#886", linewidths=.4)
P = A["R"].mean(axis=1); s = (P[:, 0] > x0) & (P[:, 0] < x1) & (P[:, 1] > y0) & (P[:, 1] < y1)
aa = A["A_spread"][s]
lc = LineCollection(A["R"][s], colors=plt.cm.autumn_r(np.clip((np.log10(aa) - 5) / 3, 0, 1)), linewidths=1.6)
ax.add_collection(lc)
for n in (a, b):
    p = TO_UTM.transform(*SUMMITS[n]); ax.plot(*p, "c^", ms=12); ax.text(p[0], p[1] + 120, n, color="c", fontsize=13)
ax.set_title(f"{a}〜{b}：LANDMARK の尾根の区間（色＝A_spread 10万→1億m²）・等高線50m"); ax.set_xlim(x0, x1); ax.set_ylim(y0, y1)
plt.tight_layout(); plt.savefig(f"pilot/out/corridor_{a}_{b}.png", dpi=80); print("done")
