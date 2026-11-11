# 試作の確認用の画像（新規・自分で見る用）。⚠ 出力 pilot/out/preview_*.png は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/preview.py [lon0 lat0 lon1 lat1]
import json, pickle, sys
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
import rasterio
from pyproj import Transformer
from make_tiles import prod_layer
from prepare_dem import BBOX, UTM
plt.rcParams["font.family"] = ["Yu Gothic", "Meiryo", "sans-serif"]
L = pickle.load(open("pilot/out/layers_m3.pkl", "rb"))["layers"]
prod, _ = prod_layer()
ext = [float(v) for v in sys.argv[1:5]] if len(sys.argv) >= 5 else [BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"]]
# 標高（マスター DEM）を経緯度の格子に引いて背景にする
with rasterio.open("pilot/data/master_z12.tif") as d:
    h = d.read(1).astype(float); tr = d.transform; nod = d.nodata
h[h == nod] = np.nan
lo, la = np.meshgrid(np.linspace(ext[0], ext[2], 900), np.linspace(ext[3], ext[1], 900))
x, y = Transformer.from_crs(4326, UTM, always_xy=True).transform(lo, la)
c = ((x - tr.c) / tr.a).astype(int).clip(0, h.shape[1] - 1); r = ((y - tr.f) / tr.e).astype(int).clip(0, h.shape[0] - 1)
fig, axs = plt.subplots(1, 2, figsize=(18, 9))
for ax, (title, sets) in zip(axs, [("LANDMARK：尾根（ヒゲ刈り有・赤）＋沢 A_out≧100万m²（青）", [("ridge_pruned", "#b3261e", .6), ("valley_1e6", "#1a73e8", .8)]),
                                   ("現行 terrainFlow の尾根（紫）", [("prod", "#7b1fa2", .6)])]):
    ax.imshow(h[r, c], extent=[ext[0], ext[2], ext[1], ext[3]], cmap="gist_earth", alpha=.55, aspect=1 / np.cos(np.radians((ext[1] + ext[3]) / 2)))
    for name, col, lw in sets:
        for l in (prod if name == "prod" else L[name]):
            a = np.asarray(l.coords); ax.plot(a[:, 0], a[:, 1], color=col, lw=lw)
    ax.set_xlim(ext[0], ext[2]); ax.set_ylim(ext[1], ext[3]); ax.set_title(title)
plt.tight_layout(); out = f"pilot/out/preview_{'_'.join(str(v) for v in ext)}.png"; plt.savefig(out, dpi=90); print(out)
