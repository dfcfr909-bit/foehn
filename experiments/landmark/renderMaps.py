# LANDMARK の結果を目視確認用に描画する（新規・既存ファイルは変更しない）。
# 既存の計算結果（data/・out/*_full・out/*_saddles.json）をそのまま使う。再計算はしない。
#
# 出力:
#   out/render/<site>_<res>_map.png   … 1枚（陰影＋稜線＋沢筋＋saddle＋目標点＋凡例・縮尺・注記）
#   out/render/<site>_compare.png     … 30m と 10m を並べた比較
#
# 使い方: .venv/Scripts/python.exe renderMaps.py
import json, math, os
import numpy as np
import rasterio
import geopandas as gpd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
from matplotlib.lines import Line2D
from matplotlib.patches import FancyArrow
from shapely.geometry import Point

OUT = "out/render"
os.makedirs(OUT, exist_ok=True)

SITES = {
    "nantai": {
        "label": "男体山",
        "target_lonlat": (139.4909, 36.7651),
        "target_label": "山頂（参考・鞍部ではない）",
        "dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"},
        "full_dirs": {"30m": "out/nantai_30m_full", "10m": "out/nantai_10m_full"},
        "gpkg_stem": {"30m": "nantai_30m", "10m": "nantai_10m"},
        "saddle_json": {"30m": "out/nantai_30m_saddles.json", "10m": "out/nantai_10m_saddles.json"},
        "highlight_main_ridge": False,
    },
    "jonen": {
        "label": "常念乗越",
        "target_lonlat": (137.72752, 36.33341),
        "target_label": "常念乗越（実座標）",
        "dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"},
        "full_dirs": {"30m": "out/jonen_30m_full", "10m": "out/jonen_10m_full"},
        "gpkg_stem": {"30m": "jonen_30m_gsi", "10m": "jonen_10m_gsi"},
        "saddle_json": {"30m": "out/jonen_30m_saddles.json", "10m": "out/jonen_10m_saddles.json"},
        "highlight_main_ridge": True,
    },
}

A_TH = 1e5  # findings.md の既定閾値
HSO_MID, HSO_HIGH = 5, 7


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
        crs = d.crs
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell, crs


def hillshade(h, cell):
    dx = np.gradient(h, cell, axis=1)
    dy = np.gradient(h, cell, axis=0)
    slope = np.pi / 2 - np.arctan(np.hypot(dx, dy))
    aspect = np.arctan2(-dx, dy)
    az, alt = np.deg2rad(315), np.deg2rad(45)
    shade = np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect)
    return np.clip(shade, 0, 1)


def world_to_px(transform, x, y):
    col = (np.asarray(x) - transform.c) / transform.a
    row = (np.asarray(y) - transform.f) / transform.e
    return col, row


def line_segments(gdf, transform):
    segs = []
    for geom in gdf.geometry:
        xs, ys = geom.xy
        cols, rows = world_to_px(transform, np.array(xs), np.array(ys))
        segs.append(np.column_stack([cols, rows]))
    return segs


def draw_scale_bar(ax, nx, ny, cell, length_m=1000):
    bar_px = length_m / cell
    x0 = nx * 0.05
    y0 = ny * 0.95
    ax.plot([x0, x0 + bar_px], [y0, y0], color="black", linewidth=3, solid_capstyle="butt")
    ax.text(x0 + bar_px / 2, y0 - ny * 0.02, f"{length_m}m", ha="center", va="bottom", fontsize=9,
            fontproperties=JP_FONT)


def find_main_ridge_id(ridges, target_xy, min_a_spread=1e5):
    pt = Point(target_xy)
    ridges = ridges.copy()
    ridges["d"] = ridges.geometry.distance(pt)
    cand = ridges[ridges["A_spread"] >= min_a_spread].sort_values("d")
    if len(cand) == 0:
        cand = ridges.sort_values("d")
    return cand.iloc[0]["id_rdl"]


# 日本語フォント（Windows 標準の游ゴシック／メイリオがあれば使う。無ければ文字化けするが処理は続ける）
import matplotlib.font_manager as fm
JP_FONT = None
for cand in ["Yu Gothic", "Meiryo", "MS Gothic"]:
    try:
        path = fm.findfont(cand, fallback_to_default=False)
        JP_FONT = fm.FontProperties(fname=path)
        break
    except Exception:
        continue
if JP_FONT is None:
    JP_FONT = fm.FontProperties()


def render_site_res(site_key, res, ax, title_suffix=""):
    site = SITES[site_key]
    dem_path = site["dems"][res]
    h, transform, cell, crs = load_dem(dem_path)
    ny, nx = h.shape
    shade = hillshade(h, cell)

    stem = site["gpkg_stem"][res]
    full_dir = site["full_dirs"][res]
    ridges = gpd.read_file(f"{full_dir}/ridgelines_se_HSO_{stem}.gpkg.gpkg")
    slopes = gpd.read_file(f"{full_dir}/slopelines_se_HSO_{stem}.gpkg.gpkg")

    from pyproj import Transformer
    t = Transformer.from_crs(4326, crs, always_xy=True)
    tx, ty = t.transform(*site["target_lonlat"])

    ridges_f = ridges[ridges["A_spread"] >= A_TH]
    slopes_f = slopes[slopes["A_out"] >= A_TH]
    slopes_mid = slopes_f[slopes_f["hso"] >= HSO_MID]
    slopes_high = slopes_f[slopes_f["hso"] >= HSO_HIGH]

    ax.imshow(shade, cmap="gray", extent=[0, nx, ny, 0], vmin=0, vmax=1)

    # 沢筋：既定閾値=細い水色、hso>=5=中太の青、hso>=7=太い濃紺
    if len(slopes_f):
        ax.add_collection(LineCollection(line_segments(slopes_f, transform), colors="#99ccff", linewidths=0.5, zorder=2))
    if len(slopes_mid):
        ax.add_collection(LineCollection(line_segments(slopes_mid, transform), colors="#3366cc", linewidths=1.0, zorder=3))
    if len(slopes_high):
        ax.add_collection(LineCollection(line_segments(slopes_high, transform), colors="#001a66", linewidths=1.8, zorder=4))

    # 稜線：既定閾値=赤。常念乗越は目標点を通る本線（id_rdl）を橙で強調
    main_id = None
    if site["highlight_main_ridge"]:
        main_id = find_main_ridge_id(ridges, (tx, ty))
        ridges_main = ridges[ridges["id_rdl"] == main_id]
        ridges_other = ridges_f[ridges_f["id_rdl"] != main_id]
    else:
        ridges_main = ridges_f.iloc[0:0]
        ridges_other = ridges_f

    if len(ridges_other):
        ax.add_collection(LineCollection(line_segments(ridges_other, transform), colors="#e60000", linewidths=0.7, zorder=5))
    if len(ridges_main):
        ax.add_collection(LineCollection(line_segments(ridges_main, transform), colors="#ff9900", linewidths=2.2, zorder=6))

    # saddle（LANDMARK）：JSON から読み、画面内のものを表示。最も近い1件を強調
    with open(site["saddle_json"][res], encoding="utf-8") as f:
        sdl = json.load(f)
    sx, sy = zip(*[(s["x"], s["y"]) for s in sdl["saddles"]]) if sdl["saddles"] else ([], [])
    scol, srow = world_to_px(transform, np.array(sx), np.array(sy))
    inb = (scol >= 0) & (scol < nx) & (srow >= 0) & (srow < ny)
    ax.scatter(scol[inb], srow[inb], marker="^", s=28, facecolors="none", edgecolors="#00cc44", linewidths=1.3, zorder=7, label="saddle(LANDMARK)")
    if sdl["saddles"]:
        s0 = sdl["saddles"][0]
        c0, r0 = world_to_px(transform, s0["x"], s0["y"])
        ax.scatter([c0], [r0], marker="^", s=90, facecolors="#00cc44", edgecolors="black", linewidths=1.0, zorder=8)

    # 目標点（既知の座標）
    tcol, trow = world_to_px(transform, tx, ty)
    ax.scatter([tcol], [trow], marker="*", s=200, facecolors="yellow", edgecolors="black", linewidths=1.2, zorder=9)

    ax.set_xlim(0, nx)
    ax.set_ylim(ny, 0)
    ax.set_xticks([]); ax.set_yticks([])
    draw_scale_bar(ax, nx, ny, cell)
    d0 = sdl["saddles"][0]["d_from_target"] if sdl["saddles"] else float("nan")
    ax.set_title(f"{site['label']} {res}（升目{cell:.1f}m・{crs}）{title_suffix}\n"
                 f"最寄saddle {d0:.0f}m", fontproperties=JP_FONT, fontsize=11)
    return main_id, d0


def legend_handles():
    return [
        Line2D([0], [0], color="#e60000", lw=1.5, label="稜線 ridge（A_spread≧1e5）"),
        Line2D([0], [0], color="#ff9900", lw=2.5, label="稜線：目標点を通る本線（常念乗越のみ）"),
        Line2D([0], [0], color="#99ccff", lw=1.5, label="沢筋 thalweg（A_out≧1e5）"),
        Line2D([0], [0], color="#3366cc", lw=2.0, label="沢筋（hso≧5）"),
        Line2D([0], [0], color="#001a66", lw=2.5, label="沢筋（hso≧7）"),
        Line2D([0], [0], marker="^", color="none", markeredgecolor="#00cc44", markerfacecolor="none", markersize=8, label="saddle（LANDMARK・窪地の溢れ口）"),
        Line2D([0], [0], marker="^", color="none", markeredgecolor="black", markerfacecolor="#00cc44", markersize=10, label="saddle（目標点に最も近い1件）"),
        Line2D([0], [0], marker="*", color="none", markeredgecolor="black", markerfacecolor="yellow", markersize=14, label="目標点（実座標：乗越 or 山頂）"),
    ]


def main():
    for site_key in SITES:
        for res in ["30m", "10m"]:
            fig, ax = plt.subplots(figsize=(9, 9))
            main_id, d0 = render_site_res(site_key, res, ax)
            ax.legend(handles=legend_handles(), loc="lower left", fontsize=7, framealpha=0.85, prop=JP_FONT)
            fig.text(0.5, 0.01, "地形からの推定・参考値（LANDMARK予備実験・PR #114）", ha="center", fontsize=8,
                      color="#666666", fontproperties=JP_FONT)
            plt.tight_layout()
            out_path = f"{OUT}/{site_key}_{res}_map.png"
            plt.savefig(out_path, dpi=150)
            plt.close(fig)
            print(f"書いた: {out_path}" + (f"（本線 id_rdl={main_id}）" if main_id is not None else ""))

        # 30m/10m 比較
        fig, axes = plt.subplots(1, 2, figsize=(16, 8.5))
        for ax, res in zip(axes, ["30m", "10m"]):
            render_site_res(site_key, res, ax)
        axes[0].legend(handles=legend_handles(), loc="lower left", fontsize=6.5, framealpha=0.85, prop=JP_FONT)
        fig.suptitle(f"{SITES[site_key]['label']}：30m と 10m の比較（地形からの推定・参考値）", fontproperties=JP_FONT)
        plt.tight_layout()
        out_path = f"{OUT}/{site_key}_compare.png"
        plt.savefig(out_path, dpi=150)
        plt.close(fig)
        print(f"書いた: {out_path}")


if __name__ == "__main__":
    main()
