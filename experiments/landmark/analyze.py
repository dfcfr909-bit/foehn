# LANDMARK の結果を可視化・統計する（実験用）。
# 使い方: .venv/Scripts/python.exe analyze.py <res>   例: python analyze.py 10m
import sys, os
import numpy as np
import rasterio
import geopandas as gpd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection

site = sys.argv[1] if len(sys.argv) > 1 else "nantai"
res = sys.argv[2] if len(sys.argv) > 2 else "10m"
dem_suffix = "_gsi" if site == "jonen" else ""
dem_path = f"data/{site}_{res}{dem_suffix}.tif"
full_dir = f"out/{site}_{res}_full"

with rasterio.open(dem_path) as d:
    h = d.read(1)
    nodata = d.nodata
    transform = d.transform
    cell = d.res[0]
h = np.where(h == nodata, np.nan, h)
ny, nx = h.shape
print(f"[{res}] 升目 {nx}x{ny}（{cell}m）・値あり {np.isfinite(h).sum()}/{h.size}")
print(f"標高範囲 {np.nanmin(h):.1f} 〜 {np.nanmax(h):.1f}m")

ridges = gpd.read_file(f"{full_dir}/ridgelines_se_HSO_{site}_{res}{dem_suffix}.gpkg.gpkg")
slopes = gpd.read_file(f"{full_dir}/slopelines_se_HSO_{site}_{res}{dem_suffix}.gpkg.gpkg")
print(f"ridgelines: {len(ridges)} 区間（全量・閾値なし）")
print(f"slopelines: {len(slopes)} 区間（全量・閾値なし）")
print("--- A_spread の分布（ridgelines） ---")
print(ridges["A_spread"].describe())
print("--- A_out の分布（slopelines） ---")
print(slopes["A_out"].describe())
print("--- hso の分布（slopelines・Horton次数） ---")
print(slopes["hso"].value_counts().sort_index())

# 陰影図
dx = np.gradient(h, cell, axis=1)
dy = np.gradient(h, cell, axis=0)
slope = np.pi/2 - np.arctan(np.hypot(dx, dy))
aspect = np.arctan2(-dx, dy)
az, alt = np.deg2rad(315), np.deg2rad(45)
shade = np.sin(alt)*np.sin(slope) + np.cos(alt)*np.cos(slope)*np.cos(az - aspect)
shade = np.clip(shade, 0, 1)

def world_to_px(x, y):
    col = (x - transform.c) / transform.a
    row = (y - transform.f) / transform.e
    return col, row

def to_segments(gdf):
    segs = []
    for geom in gdf.geometry:
        xs, ys = geom.xy
        cols, rows = world_to_px(np.array(xs), np.array(ys))
        segs.append(np.column_stack([cols, rows]))
    return segs

fig, axes = plt.subplots(1, 3, figsize=(21, 7))
thresholds = [(1e3, "A_spread/A_out >= 1e3"), (1e4, "A_spread/A_out >= 1e4"), (1e5, "A_spread/A_out >= 1e5（既定）")]
for ax, (th, label) in zip(axes, thresholds):
    ax.imshow(shade, cmap="gray", extent=[0, nx, ny, 0], vmin=0, vmax=1)
    rf = ridges[ridges["A_spread"] >= th]
    sf = slopes[slopes["A_out"] >= th]
    if len(sf):
        ax.add_collection(LineCollection(to_segments(sf), colors="#3399ff", linewidths=0.6))
    if len(rf):
        ax.add_collection(LineCollection(to_segments(rf), colors="#ff3333", linewidths=0.6))
    ax.set_xlim(0, nx); ax.set_ylim(ny, 0)
    ax.set_title(f"{label}\n稜線{len(rf)}区間・沢筋{len(sf)}区間")
    ax.set_xticks([]); ax.set_yticks([])
site_label = {"nantai": "男体山（レーザー0.5m由来）", "jonen": "常念乗越（地理院タイル）"}.get(site, site)
plt.suptitle(f"{site_label} {res} DEM 赤=ridge(LANDMARK) 青=thalweg(LANDMARK)")
plt.tight_layout()
out_png = f"out/{site}_{res}_overview.png"
plt.savefig(out_png, dpi=130)
print(f"書いた: {out_png}")
