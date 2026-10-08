# DEM から「峰どうしがつながる点」の prominence（落差）を求める（新規・実験専用）。
# 現行 Föhn の terrainFindCols（sotoki_v4.html）と同じ考え方・同じアルゴリズム
# （標高の高い順にUnion-Findで陸地を広げ、2つの峰域が最初につながる点＝コル。
#  落差＝低い方の峰の標高－コルの標高）を、このDEM配列に対して独立に Python で実装する。
# ⚠ これは LANDMARK 内部の saddle（model.sdl_pt）とは別物。LANDMARK の saddle 点に
#   この独立計算の落差を対応づけて使う（saddle_depth_analysis.py から呼ぶ）。
import numpy as np


def find_cols(h, cell):
    """h: (ny,nx) の標高配列（欠測はnp.nan）。cell: 升目の一辺(m、正方形前提)。
    戻り値: list of dict {row, col, prom, peak_row, peak_col, other_peak_row, other_peak_col}
      峰どうしがつながる点（コル）ごとに、低い方の峰との標高差（落差）を持つ。
    """
    ny, nx = h.shape
    N = ny * nx
    flat = h.reshape(-1)
    valid = np.isfinite(flat)
    order = np.argsort(-np.where(valid, flat, -np.inf), kind="stable")
    order = order[valid[order]]  # 高い順・有効画素のみ

    parent = np.full(N, -1, dtype=np.int64)
    peak = np.full(N, -1, dtype=np.int64)

    def find(a):
        r = a
        while parent[r] != r:
            r = parent[r]
        while parent[a] != r:
            nxt = parent[a]
            parent[a] = r
            a = nxt
        return r

    NB = [-nx - 1, -nx, -nx + 1, -1, 1, nx - 1, nx, nx + 1]
    cols = []
    for c in order:
        cx = c % nx
        roots = []
        for d in NB:
            nb = c + d
            if nb < 0 or nb >= N:
                continue
            nbx = nb % nx
            if abs(nbx - cx) > 1:
                continue  # 行の端をまたがない
            if parent[nb] < 0:
                continue  # まだ陸地になっていない（低い）
            r = find(nb)
            if r not in roots:
                roots.append(r)
        if not roots:
            parent[c] = c
            peak[c] = c
            continue
        roots.sort(key=lambda r: -flat[peak[r]])
        main = roots[0]
        parent[c] = main
        for i in range(1, len(roots)):
            r = roots[i]
            pa, pb = peak[main], peak[r]
            prom = flat[pb] - flat[c]
            cols.append({
                "row": c // nx, "col": c % nx, "prom": float(prom),
                "peak_row": pa // nx, "peak_col": pa % nx,
                "other_peak_row": pb // nx, "other_peak_col": pb % nx,
                "z": float(flat[c]),
            })
            parent[r] = main
    return cols


if __name__ == "__main__":
    import sys, rasterio, time
    path = sys.argv[1]
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        cell = d.res[0]
    h = np.where(h == nodata, np.nan, h)
    t0 = time.time()
    cols = find_cols(h, cell)
    print(f"col候補（全量・落差フィルタなし）: {len(cols)}件・{time.time()-t0:.1f}秒")
    proms = sorted(c["prom"] for c in cols)
    import numpy as _np
    print("落差の分布（パーセンタイル）:", {p: round(_np.percentile(proms, p), 2) for p in [10, 25, 50, 75, 90, 99]})
