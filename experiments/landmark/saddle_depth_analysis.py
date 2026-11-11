# 調査1：LANDMARKのsaddleに「落差」を対応づけ、閾値別の件数・目標点の追跡を表にする（新規）。
#
# 落差の定義：DEMを高い順に処理するUnion-Findで「2つの峰域が最初につながる点」（col）の
#   低い方の峰との標高差＝prominence。現行Föhnの terrainFindCols（COL.FLOOR_M）と
#   同じ考え方・同じアルゴリズムを col_prominence.py として独立実装し、この DEM に対して回す。
#   ⚠ これは LANDMARK 内部の cis_endo/trans_out（窪地の溢れ口の定義）とは別物。
#   LANDMARK の各 saddle 点を、独立計算で見つかった最も近い col に対応づけ、その prominence を
#   「その saddle の落差」とする（対応する col が近傍になければ「落差不明」）。
#
# 使い方: .venv/Scripts/python.exe saddle_depth_analysis.py
import json
import numpy as np
import rasterio
from scipy.spatial import cKDTree
from col_prominence import find_cols

SITES = {
    "nantai": {"dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"}},
    "jonen": {"dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"}},
}
THRESHOLDS = [0, 1, 2, 5, 10, 20]
MATCH_RADIUS_CELL = 2.0  # 対応づけの許容半径（升目単位）


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell


def assign_depth(saddles, cols, transform, cell):
    """各 saddle（world座標）に、最も近い col（row,col→world座標）の prominence を対応づける"""
    if not cols:
        for s in saddles:
            s["depth"] = None
        return 0
    col_xy = np.array([
        [transform.c + (c["col"] + 0.5) * transform.a, transform.f + (c["row"] + 0.5) * transform.e]
        for c in cols
    ])
    tree = cKDTree(col_xy)
    sad_xy = np.array([[s["x"], s["y"]] for s in saddles])
    dist, idx = tree.query(sad_xy, k=1)
    n_unmatched = 0
    for s, dd, ii in zip(saddles, dist, idx):
        if dd <= MATCH_RADIUS_CELL * cell:
            s["depth"] = cols[ii]["prom"]
            s["depth_match_dist"] = float(dd)
        else:
            s["depth"] = None
            s["depth_match_dist"] = float(dd)
            n_unmatched += 1
    return n_unmatched


def analyze(site, res):
    dem_path = SITES[site]["dems"][res]
    h, transform, cell = load_dem(dem_path)
    cols = find_cols(h, cell)

    with open(f"out/{site}_{res}_saddles_all.json", encoding="utf-8") as f:
        data = json.load(f)
    saddles = data["saddles"]
    n_unmatched = assign_depth(saddles, cols, transform, cell)

    rows = []
    for th in THRESHOLDS:
        survivors = [s for s in saddles if s["depth"] is not None and s["depth"] >= th]
        survivors_sorted = sorted(survivors, key=lambda s: s["d_from_target"])
        nearest = survivors_sorted[0] if survivors_sorted else None
        rows.append({
            "threshold": th,
            "n_survive": len(survivors),
            "nearest_d": nearest["d_from_target"] if nearest else None,
            "nearest_z": nearest["z"] if nearest else None,
            "nearest_depth": nearest["depth"] if nearest else None,
        })
    return {
        "site": site, "res": res, "n_saddles": len(saddles), "n_cols_independent": len(cols),
        "n_depth_unavailable": n_unmatched, "rows": rows, "saddles_with_depth": saddles,
    }


def main():
    results = {}
    for site in SITES:
        for res in ["30m", "10m"]:
            print(f"=== {site} {res} ===")
            r = analyze(site, res)
            results[f"{site}_{res}"] = r
            print(f"saddle総数={r['n_saddles']}・独立col候補={r['n_cols_independent']}・落差不明={r['n_depth_unavailable']}")
            print(f"{'落差閾値':>8} {'残存件数':>8} {'最寄り距離m':>10} {'標高差の参考(m)':>14}")
            for row in r["rows"]:
                nd = f"{row['nearest_d']:.1f}" if row["nearest_d"] is not None else "-"
                nz = f"{row['nearest_z']:.1f}" if row["nearest_z"] is not None else "-"
                print(f"{row['threshold']:>7}m {row['n_survive']:>8} {nd:>10} {nz:>14}")

    # 保存（saddleごとの落差つき詳細と、サマリー表）
    out = {}
    for k, r in results.items():
        out[k] = {
            "site": r["site"], "res": r["res"], "n_saddles": r["n_saddles"],
            "n_cols_independent": r["n_cols_independent"], "n_depth_unavailable": r["n_depth_unavailable"],
            "rows": r["rows"],
        }
    with open("out/saddle_depth_summary.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    for k, r in results.items():
        with open(f"out/{k}_saddles_depth.json", "w", encoding="utf-8") as f:
            json.dump(r["saddles_with_depth"], f, ensure_ascii=False, indent=2)
    print("\n書いた: out/saddle_depth_summary.json, out/<site>_<res>_saddles_depth.json")


if __name__ == "__main__":
    main()
