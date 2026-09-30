# 常念乗越まわり（2.4km四方）の尾根線を、LANDMARK（青）と現行方式（赤=つなぎ有／橙=つなぎ無）で重ねて描く（新規）。
# 使い方: .venv/Scripts/python.exe plot_jonen_ridge.py
import json, numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from pyproj import Transformer
from eval_windows import load_windows, load_dem
from lines_common import lm_lines, prod_lines
plt.rcParams["font.family"] = ["Yu Gothic", "Meiryo", "sans-serif"]
w = [x for x in load_windows() if x["name"] == "jonen"][0]
jx, jy = Transformer.from_crs(4326, w["epsg"], always_xy=True).transform(137.72752, 36.33341)
H = 1200
fig, axs = plt.subplots(1, 2, figsize=(16, 8))
for ax, res in zip(axs, ["30m", "10m"]):
    h, tr, cell, _ = load_dem(w["dems"][res])
    hs = np.where(np.isfinite(h), h, np.nanmean(h)); gy, gx = np.gradient(hs, cell)
    slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
    shade = np.sin(np.radians(45)) * np.cos(slope) + np.cos(np.radians(45)) * np.sin(slope) * np.cos(np.radians(315) - aspect)
    ext = [tr.c, tr.c + tr.a * h.shape[1], tr.f + tr.e * h.shape[0], tr.f]
    ax.imshow(shade, cmap="gray", extent=ext, origin="upper", vmin=0.2, vmax=1)
    lm = lm_lines("jonen", res); pr = prod_lines("jonen", res, tr)
    def draw(polys, col, lw, label):
        first = True
        for c in polys:
            if len(c) and (abs(c[:, 0] - jx).min() < H * 1.6) and (abs(c[:, 1] - jy).min() < H * 1.6):
                ax.plot(c[:, 0], c[:, 1], color=col, lw=lw, label=label if first else None); first = False
    draw(lm["ridge"]["polys"], "#1565c0", 1.6, "LANDMARK 尾根")
    draw(pr["nobridge"]["ridge"]["polys"], "#ff9800", 2.4, "現行（つなぎ無）")
    draw(pr["bridge"]["ridge"]["polys"], "#c62828", 1.2, "現行（つなぎ有）")
    ax.plot(jx, jy, "y*", ms=16, mec="k", label="常念乗越")
    ax.set_xlim(jx - H, jx + H); ax.set_ylim(jy - H, jy + H); ax.set_title(f"常念乗越まわり {res}（2.4km四方）"); ax.legend(loc="upper right")
plt.tight_layout(); plt.savefig("out/render/jonen_ridge_compare.png", dpi=100)
print("書いた: out/render/jonen_ridge_compare.png")
