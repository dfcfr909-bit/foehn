# w07（山形）の10mで saddle が桁違いに多い原因の調査（新規）。
# 見る候補: DEM の欠測・平坦部・階段状の標高（量子化）・ノイズ・投影の縁・saddle の偏り。
# 全10窓を並べて w07 だけ何が違うかを見る。位置図を out/render/w07_10m_anomaly.png に出す。
# 使い方: .venv/Scripts/python.exe w07_anomaly.py
import json, numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.ndimage import maximum_filter, minimum_filter, uniform_filter
from eval_windows import load_windows, load_dem
from null_baseline import edge_mask_w, ridge_score, RIDGE_DELTA_M

plt.rcParams["font.family"] = ["Yu Gothic", "Meiryo", "sans-serif"]
rows = []
info = {}
for w in load_windows():
    h, tr, cell, _ = load_dem(w["dems"]["10m"])
    ok = np.isfinite(h)
    m = edge_mask_w(h, cell, 100)
    hf = np.where(ok, h, np.nan)
    hh = np.where(ok, h, 0)
    rng5 = maximum_filter(np.where(ok, h, -1e9), 5) - minimum_filter(np.where(ok, h, 1e9), 5)
    flat = ok & (rng5 < 0.3)
    dx = np.abs(np.diff(hf, axis=1)); same = np.nanmean(dx < 0.005)
    inner = ~m
    with open(f"out/{w['name']}_10m_saddles_depth.json", encoding="utf-8") as f:
        S = json.load(f)
    sx = np.array([s["x"] for s in S]); sy = np.array([s["y"] for s in S]); sz = np.array([s["z"] for s in S])
    sd = np.array([np.nan if s["depth"] is None else s["depth"] for s in S])
    c = np.floor((sx - tr.c) / tr.a).astype(int); r = np.floor((sy - tr.f) / tr.e).astype(int)
    on_flat = flat[r, c]
    # 偏り：500m格子（約65升目）ごとの saddle 数の上位5%格子が全体の何割か
    g = 65
    cnt = np.zeros((h.shape[0] // g + 1, h.shape[1] // g + 1))
    np.add.at(cnt, (r // g, c // g), 1)
    fl = np.sort(cnt.ravel())[::-1]; top = fl[:max(1, int(0.05 * len(fl)))].sum() / max(1, fl.sum())
    # 標高の階段状：標高の小数部（0.1m単位）の偏りと、ユニーク値の数
    v = h[inner]
    uniq = len(np.unique(np.round(v, 3)))
    frac = np.round((v * 10) % 10)
    rows.append((w["name"], len(S), float(np.isnan(sd).mean()), float(flat[inner].mean()), float(on_flat.mean()), float(same),
                 float(top), uniq, float(np.nanmedian(sd)) if np.isfinite(sd).any() else np.nan, float(np.median(h[inner])), float((rng5[inner] < 3).mean())))
    info[w["name"]] = dict(h=h, tr=tr, cell=cell, flat=flat, sx=sx, sy=sy, sd=sd, m=m, cnt=cnt, g=g)

print("窓   saddle数 落差不明率 平坦部率(窓内) saddleが平坦部上の率 隣接同値率 上位5%格子の集中度 標高ユニーク値数 落差中央値 標高中央値 局所起伏3m未満の率")
for t in rows:
    print(f"{t[0]:>6} {t[1]:>6} {t[2]*100:6.1f}% {t[3]*100:8.1f}% {t[4]*100:10.1f}% {t[5]*100:8.2f}% {t[6]*100:10.0f}% {t[7]:>10} {t[8]:8.2f} {t[9]:8.0f} {t[10]*100:8.1f}%")

# w07 の詳細：平坦部に乗る saddle と、それ以外
d = info["w07"]
h, tr = d["h"], d["tr"]
print("\n[w07 詳細]")
inner = ~d["m"]
print("窓内の升目数", int(inner.sum()), " 標高範囲", float(np.nanmin(h[inner])), "〜", float(np.nanmax(h[inner])))
# 平坦部の標高（水田・盆地・水面）の分布
fl_z = h[d["flat"] & inner]
print("平坦部升目", len(fl_z), " 標高の最頻帯:", np.percentile(fl_z, [5, 25, 50, 75, 95]).round(1) if len(fl_z) else "-")
# saddle を平坦/非平坦で分けた落差不明率
c = np.floor((d["sx"] - tr.c) / tr.a).astype(int); r = np.floor((d["sy"] - tr.f) / tr.e).astype(int)
on = d["flat"][r, c]
print(f"saddle {len(on)}件: 平坦部上 {int(on.sum())}件（落差不明 {np.isnan(d['sd'][on]).mean()*100:.0f}%）／それ以外 {int((~on).sum())}件（落差不明 {np.isnan(d['sd'][~on]).mean()*100 if (~on).any() else 0:.0f}%）")
print("平坦部以外の saddle 件数 → 他窓の10m saddle 数（400〜700件）と同程度か:", int((~on).sum()))

# 平坦面のまとまり（連結成分）の大きさと標高
from scipy.ndimage import label
lab, nlab = label(d["flat"] & inner)
sizes = np.bincount(lab.ravel())[1:]
print("平坦面のまとまり（連結成分）上位:")
for i in np.argsort(-sizes)[:6]:
    zz = h[lab == i + 1]
    inside = int(np.sum([lab[rr, cc] == i + 1 for rr, cc in zip(r, c)]))
    print(f"  {sizes[i]}升目（約{sizes[i]*d['cell']**2/1e4:.1f}ha）標高 {zz.min():.1f}〜{zz.max():.1f}m  重なるsaddle {inside}件")

# 位置図（左：陰影＋saddle・右：平坦部と saddle 密度）
ny, nx = h.shape
hs = np.where(np.isfinite(h), h, np.nanmean(h))
gy, gx = np.gradient(hs, d["tr"].a)
az, alt = np.radians(315), np.radians(45)
slope = np.arctan(np.hypot(gx, gy)); aspect = np.arctan2(-gx, gy)
shade = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
ext = [0, nx * d["tr"].a / 1000, 0, ny * abs(d["tr"].e) / 1000]
fig, ax = plt.subplots(1, 2, figsize=(15, 7.4))
for a_ in ax:
    a_.imshow(np.where(np.isfinite(h), shade, np.nan), cmap="gray", extent=ext, origin="upper", vmin=0, vmax=1)
X = (d["sx"] - d["tr"].c) / 1000; Y = (d["tr"].f - d["sy"]) / 1000
Y = ext[3] - Y   # imshow(origin=upper)+extent の縦軸に合わせる（上端が北）
ax[0].scatter(X, Y, s=1.2, c="red", alpha=0.6)
ax[0].set_title(f"w07 10m：陰影 + LANDMARK saddle {len(X)}件（赤）")
fl = np.ma.masked_where(~d["flat"], np.ones_like(h))
ax[1].imshow(fl, cmap="cool", alpha=0.6, extent=ext, origin="upper")
im = ax[1].imshow(np.ma.masked_where(d["cnt"] == 0, d["cnt"]), cmap="YlOrRd", alpha=0.0, extent=ext)
# 密度を格子ごとの数で塗る（500m格子）
cnt = d["cnt"]; g = d["g"]
for iy in range(cnt.shape[0]):
    for ix in range(cnt.shape[1]):
        if cnt[iy, ix] >= 30:
            ax[1].text((ix + .5) * g * d["tr"].a / 1000, ext[3] - (iy + .5) * g * abs(d["tr"].e) / 1000, int(cnt[iy, ix]), color="yellow", fontsize=6, ha="center")
ax[1].set_title("水色=平坦部（5×5升目の起伏0.3m未満）／数字=500m格子のsaddle数(30以上)")
for a_ in ax:
    a_.set_xlabel("東 km"); a_.set_ylabel("北 km")
plt.tight_layout()
plt.subplots_adjust(top=0.93)
import os; os.makedirs("out/render", exist_ok=True)
plt.savefig("out/render/w07_10m_anomaly.png", dpi=110)
print("\n書いた: out/render/w07_10m_anomaly.png")
