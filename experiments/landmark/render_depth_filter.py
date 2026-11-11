# 調査1の可視化：落差の閾値ごとにsaddleがどう絞られるかを、男体山10m・常念乗越10mで比較する（新規）。
# 既存の renderMaps.py のヘルパーは流用せず、この調査専用に独立して書く（既存ファイルは変更しない）。
import json, os
import numpy as np
import rasterio
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

OUT = "out/render"
os.makedirs(OUT, exist_ok=True)
THRESHOLDS_SHOW = [0, 2, 5, 10]

JP_FONT = None
for cand in ["Yu Gothic", "Meiryo", "MS Gothic"]:
    try:
        JP_FONT = fm.FontProperties(fname=fm.findfont(cand, fallback_to_default=False))
        break
    except Exception:
        continue
if JP_FONT is None:
    JP_FONT = fm.FontProperties()


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


SITES = {
    "nantai": {"dem": "data/nantai_10m.tif", "label": "男体山 10m", "target_lonlat": (139.4909, 36.7651)},
    "jonen": {"dem": "data/jonen_10m_gsi.tif", "label": "常念乗越 10m", "target_lonlat": (137.72752, 36.33341)},
}


def render(site_key):
    site = SITES[site_key]
    with rasterio.open(site["dem"]) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
        crs = d.crs
    h = np.where(h == nodata, np.nan, h)
    ny, nx = h.shape
    shade = hillshade(h, cell)

    with open(f"out/{site_key}_10m_saddles_depth.json", encoding="utf-8") as f:
        saddles = json.load(f)

    from pyproj import Transformer
    t = Transformer.from_crs(4326, crs, always_xy=True)
    tx, ty = t.transform(*site["target_lonlat"])
    tcol, trow = world_to_px(transform, tx, ty)

    fig, axes = plt.subplots(1, len(THRESHOLDS_SHOW), figsize=(5.2 * len(THRESHOLDS_SHOW), 5.6))
    for ax, th in zip(axes, THRESHOLDS_SHOW):
        ax.imshow(shade, cmap="gray", extent=[0, nx, ny, 0], vmin=0, vmax=1)
        surv = [s for s in saddles if s["depth"] is not None and s["depth"] >= th]
        if surv:
            xs = [s["x"] for s in surv]; ys = [s["y"] for s in surv]
            cols, rows = world_to_px(transform, np.array(xs), np.array(ys))
            ax.scatter(cols, rows, marker="^", s=22, facecolors="#00cc44", edgecolors="black", linewidths=0.5, zorder=5)
        ax.scatter([tcol], [trow], marker="*", s=160, facecolors="yellow", edgecolors="black", linewidths=1.0, zorder=6)
        ax.set_xlim(0, nx); ax.set_ylim(ny, 0)
        ax.set_xticks([]); ax.set_yticks([])
        ax.set_title(f"落差≧{th}m\n残存 {len(surv)}件（全{len(saddles)}件中）", fontproperties=JP_FONT, fontsize=11)
    fig.suptitle(f"{site['label']}：落差フィルタによるsaddleの絞り込み（★=実座標）", fontproperties=JP_FONT, fontsize=13)
    plt.tight_layout()
    out_path = f"{OUT}/{site_key}_10m_depth_filter.png"
    plt.savefig(out_path, dpi=140)
    plt.close(fig)
    print(f"書いた: {out_path}")


if __name__ == "__main__":
    for k in SITES:
        render(k)
