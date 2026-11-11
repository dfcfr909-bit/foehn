# 作業A：落差が計算できなかった saddle（対応する独立col無し）の内訳を、
#   欠測境界／平坦部／範囲端／その他 に分けて数える（新規）。
# 既存の out/*_saddles_depth.json（saddle_depth_analysis.py の出力）をそのまま使う。再計算はしない。
#
# 分類の順番（先に該当した理由を採用）:
#   1. 範囲端　：DEM配列の端から RANGE_EDGE_CELL 升目以内
#   2. 欠測境界：欠測画素から NODATA_NEAR_M m 以内
#   3. 平坦部　：周囲 FLAT_WIN x FLAT_WIN 升目の標高差が FLAT_TOL_M m 未満
#   4. その他　：上のどれにも当てはまらない
#
# 使い方: .venv/Scripts/python.exe saddle_unmatched_breakdown.py
import json, os
import numpy as np
import rasterio
from scipy import ndimage
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

OUT = "out/render"
os.makedirs(OUT, exist_ok=True)

RANGE_EDGE_CELL = 3
NODATA_NEAR_M = 50
FLAT_WIN = 5
FLAT_TOL_M = 0.3

SITES = {
    "nantai": {"dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"}},
    "jonen": {"dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"}},
}

JP_FONT = None
for cand in ["Yu Gothic", "Meiryo", "MS Gothic"]:
    try:
        JP_FONT = fm.FontProperties(fname=fm.findfont(cand, fallback_to_default=False))
        break
    except Exception:
        continue
if JP_FONT is None:
    JP_FONT = fm.FontProperties()


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell


def classify(site, res):
    dem_path = SITES[site]["dems"][res]
    h, transform, cell = load_dem(dem_path)
    ny, nx = h.shape
    invalid = ~np.isfinite(h)
    dist_to_nodata_px = ndimage.distance_transform_edt(~invalid) if invalid.any() else np.full(h.shape, 1e9)

    with open(f"out/{site}_{res}_saddles_depth.json", encoding="utf-8") as f:
        saddles = json.load(f)

    def world_to_rc(x, y):
        col = (x - transform.c) / transform.a
        row = (y - transform.f) / transform.e
        return int(round(row)), int(round(col))

    n_total = len(saddles)
    n_unmatched = sum(1 for s in saddles if s["depth"] is None)
    counts = {"範囲端": 0, "欠測境界": 0, "平坦部": 0, "その他": 0}
    classified = []
    for s in saddles:
        if s["depth"] is not None:
            continue
        r, c = world_to_rc(s["x"], s["y"])
        reason = None
        if r < RANGE_EDGE_CELL or r >= ny - RANGE_EDGE_CELL or c < RANGE_EDGE_CELL or c >= nx - RANGE_EDGE_CELL:
            reason = "範囲端"
        elif invalid.any() and dist_to_nodata_px[r, c] * cell <= NODATA_NEAR_M:
            reason = "欠測境界"
        else:
            r0, r1 = max(0, r - FLAT_WIN // 2), min(ny, r + FLAT_WIN // 2 + 1)
            c0, c1 = max(0, c - FLAT_WIN // 2), min(nx, c + FLAT_WIN // 2 + 1)
            win = h[r0:r1, c0:c1]
            valid_win = win[np.isfinite(win)]
            if valid_win.size and (valid_win.max() - valid_win.min()) < FLAT_TOL_M:
                reason = "平坦部"
            else:
                reason = "その他"
        counts[reason] += 1
        classified.append({**s, "reason": reason, "row": r, "col": c})

    return {
        "site": site, "res": res, "n_total": n_total, "n_unmatched": n_unmatched,
        "n_matched_depth_known": n_total - n_unmatched, "counts": counts,
        "classified": classified, "h_shape": h.shape, "cell": cell, "transform": transform,
    }


def render(site, res, result):
    dem_path = SITES[site]["dems"][res]
    h, transform, cell = load_dem(dem_path)
    ny, nx = h.shape
    dx = np.gradient(h, cell, axis=1); dy = np.gradient(h, cell, axis=0)
    slope = np.pi / 2 - np.arctan(np.hypot(dx, dy))
    aspect = np.arctan2(-dx, dy)
    az, alt = np.deg2rad(315), np.deg2rad(45)
    shade = np.clip(np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect), 0, 1)

    colors = {"範囲端": "#ffcc00", "欠測境界": "#00c2ff", "平坦部": "#ff33cc", "その他": "#ff3333"}
    fig, ax = plt.subplots(figsize=(8, 8))
    ax.imshow(shade, cmap="gray", extent=[0, nx, ny, 0], vmin=0, vmax=1)
    for reason, color in colors.items():
        pts = [s for s in result["classified"] if s["reason"] == reason]
        if pts:
            cols_ = [(s["x"] - transform.c) / transform.a for s in pts]
            rows_ = [(s["y"] - transform.f) / transform.e for s in pts]
            ax.scatter(cols_, rows_, s=14, c=color, label=f"{reason}（{len(pts)}）", zorder=5, edgecolors="black", linewidths=0.2)
    ax.set_xlim(0, nx); ax.set_ylim(ny, 0)
    ax.set_xticks([]); ax.set_yticks([])
    ax.legend(loc="lower left", fontsize=9, framealpha=0.85, prop=JP_FONT)
    ax.set_title(f"{site} {res}：落差不明saddleの内訳（全{result['n_total']}件中 不明{result['n_unmatched']}件）",
                 fontproperties=JP_FONT, fontsize=12)
    plt.tight_layout()
    out_path = f"{OUT}/{site}_{res}_unmatched_breakdown.png"
    plt.savefig(out_path, dpi=140)
    plt.close(fig)
    print(f"書いた: {out_path}")


def main():
    all_results = {}
    for site, res in [("nantai", "30m"), ("nantai", "10m"), ("jonen", "30m"), ("jonen", "10m")]:
        r = classify(site, res)
        all_results[f"{site}_{res}"] = {k: v for k, v in r.items() if k not in ("classified", "transform")}
        print(f"=== {site} {res} ===")
        print(f"総数={r['n_total']}・落差既知={r['n_matched_depth_known']}・落差不明={r['n_unmatched']}")
        for reason, cnt in r["counts"].items():
            print(f"  {reason}: {cnt}")
        render(site, res, r)
        with open(f"out/{site}_{res}_unmatched_detail.json", "w", encoding="utf-8") as f:
            json.dump(r["classified"], f, ensure_ascii=False, indent=2)

    with open("out/saddle_unmatched_summary.json", "w", encoding="utf-8") as f:
        json.dump(all_results, f, ensure_ascii=False, indent=2)
    print("\n書いた: out/saddle_unmatched_summary.json")


if __name__ == "__main__":
    main()
