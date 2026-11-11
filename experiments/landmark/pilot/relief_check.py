# 試作の確認（新規）：尾根線が「起伏の小さい所」（平野・扇状地など）にどれだけ乗っているかを数える。
#   起伏＝マスター DEM で、その点を中心とする 1km 四方（33×33 升目）の最高−最低（m）。
#   比べるのは LANDMARK の尾根（ヒゲ刈り有・無）と、現行 terrainFlow の尾根。線を 30m おきに点にして数える。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/relief_check.py
import pickle
import numpy as np
import rasterio
from scipy.ndimage import maximum_filter, minimum_filter
from pyproj import Transformer
from make_tiles import prod_layer
from prepare_dem import UTM

with rasterio.open("pilot/data/master_z12.tif") as d:
    h = d.read(1).astype(float); tr = d.transform; nod = d.nodata
ok = h != nod
rel = maximum_filter(np.where(ok, h, -1e9), 33) - minimum_filter(np.where(ok, h, 1e9), 33)
L = pickle.load(open("pilot/out/layers_m3.pkl", "rb"))["layers"]
prod, _ = prod_layer()
to_utm = Transformer.from_crs(4326, UTM, always_xy=True)
BANDS = [0, 30, 60, 100, 200, 1e9]


def sample(lines):
    P, W = [], []
    for l in lines:
        a = np.asarray(l.coords); x, y = to_utm.transform(a[:, 0], a[:, 1]); a = np.c_[x, y]
        seg = np.hypot(*np.diff(a, axis=0).T); cum = np.r_[0, np.cumsum(seg)]
        if cum[-1] <= 0:
            continue
        n = max(1, int(cum[-1] // 30)); s = (np.arange(n) + .5) * cum[-1] / n
        P.append(np.c_[np.interp(s, cum, a[:, 0]), np.interp(s, cum, a[:, 1])]); W.append(np.full(n, cum[-1] / n))
    return np.vstack(P), np.concatenate(W)


print("1km四方の起伏の帯ごとの尾根の長さ（km）と割合")
print("  層 | " + " | ".join(f"{int(a)}–{int(b) if b < 1e8 else '∞'}m" for a, b in zip(BANDS[:-1], BANDS[1:])) + " | 合計")
for name, lines in [("LANDMARK 尾根・ヒゲ刈り有", L["ridge_pruned"]), ("LANDMARK 尾根・ヒゲ刈り無", L["ridge_raw"]), ("現行 terrainFlow の尾根", prod)]:
    P, W = sample(lines)
    c = ((P[:, 0] - tr.c) / tr.a).astype(int); r = ((P[:, 1] - tr.f) / tr.e).astype(int)
    v = rel[r, c]; tot = W.sum()
    cells = [f"{W[(v >= a) & (v < b)].sum()/1000:,.0f}（{W[(v >= a) & (v < b)].sum()/tot*100:.0f}%）" for a, b in zip(BANDS[:-1], BANDS[1:])]
    print(f"  {name} | " + " | ".join(cells) + f" | {tot/1000:,.0f}")
# 面積の方も（bbox の中）
