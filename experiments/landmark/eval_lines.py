# 尾根・沢の比較（LANDMARK vs 現行 terrainFlow）の評価本体（新規）。10窓・10m と 30m。
#   手法の線：
#     LANDMARK … 既定閾値の出力（尾根: A_spread>=1e5、沢: A_out>=1e5 の hso>=4 を hso>=5・>=7 に絞る）
#     現行方式 … 本番の terrainFlow・terrainVectorize を node で原文のまま実行（runProdFlow.mjs）。
#                 PR_*  ＝ 本番の既定の定数のまま。PR_*_m ＝ 閾値の定数だけ下げた「密な網」を、比集水面積（沢）／沢筋からの高さ（尾根）の
#                 大きい順に切って、LANDMARK の対応する階層と領域内の全長がほぼ同じになるようにしたもの。
#   基準：OSM の waterway=river/stream・natural=ridge/arete（fetch_osm_lines.py）。
#   指標：バッファ 30m・50m の精度相当・再現相当・密度。偶然の値は OSM の線を窓の中心まわりにランダムに回転・平行移動させて同じ指標（100回）。
#   ⚠ OSM の沢は小さな沢ほど載っていない。精度相当（検出した沢のうち OSM の沢の近くにある割合）は低めに出る。
#   ⚠ 領域は findings4/5 と同じ「端・欠測帯から100m以内を除く」。両解像度で内側の所だけを使う。
#
# 使い方: .venv/Scripts/python.exe eval_lines.py
import json, math, os, pickle, sys
from concurrent.futures import ProcessPoolExecutor
import numpy as np
import rasterio.features
from pyproj import Transformer
from scipy.ndimage import maximum_filter, minimum_filter, label, binary_dilation
from shapely.geometry import Polygon
from eval_windows import load_windows
from lines_common import (LineSet, Region, Graph, prec_rec, rigid, rigid_inv, STEP_M, OSM_STEP_M, RADII, lm_lines, prod_lines,
                          osm_elements)
from scipy.spatial import cKDTree

NDRAW = 100
SEED = 20260930
SUB = 8000
RES = ["30m", "10m"]
SHIFT_M = 1500.0
FLAT_RANGE_M = 0.3
FLAT_MIN_M2 = 20000.0
VALLEY_SETS = ["LM_v4", "LM_v5", "LM_v7", "PR_v", "PR_v_m5", "PR_v_m7"]
RIDGE_SETS = ["LM_r", "PR_r", "PR_r_nb", "PR_r_m"]
AGREE_SETS = ["LM_r", "LM_v5", "LM_v7", "PR_r", "PR_r_m", "PR_v", "PR_v_m5"]
JONEN_COL = (137.72752, 36.33341)


def kind_of(s):
    return "stream" if "_v" in s else "ridge"


def build_flat_water(region, waters, to_transform_epsg):
    """平坦面（10m DEM で 5×5 升目の起伏0.3m未満・2ha 以上のかたまり）と OSM の水面を重ね、除外マスク（10m格子）を作る"""
    g = region.grids["10m"]; h = g["h"]; ok = np.isfinite(h)
    rng5 = maximum_filter(np.where(ok, h, -1e9), 5) - minimum_filter(np.where(ok, h, 1e9), 5)
    flat_raw = ok & (rng5 < FLAT_RANGE_M)
    lab, n = label(flat_raw)
    minc = FLAT_MIN_M2 / g["cell"] ** 2
    sizes = np.bincount(lab.ravel(), minlength=n + 1)
    keep = np.zeros(n + 1, bool); keep[1:] = sizes[1:] >= minc
    flat = keep[lab]
    shapes = []
    for w in waters:
        try:
            poly = Polygon(w["ring"]).buffer(0)
            if not poly.is_empty:
                shapes.append((poly, 1))
        except Exception:
            pass
    water = rasterio.features.rasterize(shapes, out_shape=h.shape, transform=g["tr"], fill=0, dtype="uint8").astype(bool) if shapes else np.zeros(h.shape, bool)
    comps = []
    lab2, n2 = label(flat)
    for i in range(1, n2 + 1):
        m = lab2 == i
        zz = h[m]
        comps.append({"cells": int(m.sum()), "ha": float(m.sum() * g["cell"] ** 2 / 1e4), "z_min": float(zz.min()), "z_max": float(zz.max()),
                      "in_osm_water": float(water[m].mean()), "inside_region": float(region.inside10[m].mean())})
    comps.sort(key=lambda c: -c["cells"])
    excl = binary_dilation(flat | water, iterations=1)
    return excl, flat, water, comps


def make_sets(win, res, region, tr):
    name = win["name"]
    lm = lm_lines(name, res)
    pr = prod_lines(name, res, tr)
    S, info = {}, {}
    reg = region
    S["LM_r"] = LineSet(lm["ridge"]["polys"], STEP_M, {"A": lm["ridge"]["A_spread"]}, reg)
    LMv = LineSet(lm["valley"]["polys"], STEP_M, {"hso": lm["valley"]["hso"].astype(float)}, reg)
    S["LM_v4"] = LMv
    S["LM_v5"] = LMv.select(LMv.attrs["hso"] >= 5)
    S["LM_v7"] = LMv.select(LMv.attrs["hso"] >= 7)
    S["PR_r"] = LineSet(pr["bridge"]["ridge"]["polys"], STEP_M, {"relief": pr["bridge"]["ridge"]["relief"]}, reg)
    S["PR_r_nb"] = LineSet(pr["nobridge"]["ridge"]["polys"], STEP_M, {"relief": pr["nobridge"]["ridge"]["relief"]}, reg)
    S["PR_v"] = LineSet(pr["bridge"]["valley"]["polys"], STEP_M, {"sca": pr["bridge"]["valley"]["sca"]}, reg)
    dr = LineSet(pr["dense"]["ridge"]["polys"], STEP_M, {"relief": pr["dense"]["ridge"]["relief"]}, reg)
    dv = LineSet(pr["dense"]["valley"]["polys"], STEP_M, {"sca": pr["dense"]["valley"]["sca"]}, reg)
    S["PR_r_m"], used, short = dr.match_length("relief", S["LM_r"].length_in())
    info["PR_r_m"] = {"target_km": S["LM_r"].length_in() / 1000, "used_km": used / 1000, "short": short, "dense_total_km": dr.length_in() / 1000}
    for k, tgt in [("PR_v_m5", "LM_v5"), ("PR_v_m7", "LM_v7")]:
        S[k], used, short = dv.match_length("sca", S[tgt].length_in())
        info[k] = {"target_km": S[tgt].length_in() / 1000, "used_km": used / 1000, "short": short, "dense_total_km": dv.length_in() / 1000}
    info["bridge"] = {"bridged": pr["bridge"]["bridged"], "bridgeFail": pr["bridge"]["bridgeFail"]}
    return S, info


def process_window(args):
    win, widx = args
    name = win["name"]
    to_crs = Transformer.from_crs(4326, win["epsg"], always_xy=True)
    region = Region(win)
    streams, oridges, waters, fetched = osm_elements(name, to_crs)
    O = {"stream": LineSet(streams, OSM_STEP_M, region=region), "ridge": LineSet(oridges, OSM_STEP_M, region=region)}
    b = region.bounds
    cover = (b[0] - 500, b[1] - 500, b[2] + 500, b[3] + 500)
    excl, flat, water, comps = build_flat_water(region, waters, win["epsg"])
    region.excl = excl

    sets, sinfo = {}, {}
    for res in RES:
        sets[res], sinfo[res] = make_sets(win, res, region, region.grids[res]["tr"])

    out = {"name": name, "area_km2": region.area_km2, "osm": {k: {"n": len(v.polys), "km_in_region": v.length_in() / 1000} for k, v in O.items()},
           "osm_fetched": fetched, "n_water_polys": len(waters), "flat_comps": comps, "set_info": sinfo, "density": {}, "real": [], "null": {}, "agree": [], "agree_null": {},
           "cont": {}, "col_through": {}, "excl_len": {}, "jonen": None}

    # ---- 密度・除外マスク上の長さ ----
    for res in RES:
        for s, ls in sets[res].items():
            out["density"][f"{res}|{s}"] = ls.length_in() / 1000
            onx = region.on_excl(ls.P) & region(ls.P) if len(ls.P) else np.zeros(0, bool)
            # 「領域の内側にあって、平坦面・水面の上」の長さ（領域の判定は平坦面・水面を除かない方）
            out["excl_len"][f"{res}|{s}"] = float(ls.w[onx].sum() / 1000) if len(ls.P) else 0.0

    # ---- 実際の指標（OSM）：通常と、平坦面・水面を外したもの ----
    for res in RES:
        for s, ls in sets[res].items():
            ok = kind_of(s)
            if not len(O[ok].P):
                continue
            for r in RADII:
                for masked in (False, True):
                    p, q = prec_rec(ls, O[ok], region, r, masked)
                    out["real"].append({"res": res, "set": s, "ref": ok, "r": r, "masked": masked, "pn": p[0], "pd": p[1], "rn": q[0], "rd": q[1]})

    # ---- 偶然の値：OSM の線を窓の中心まわりにランダムに回転・平行移動（NDRAW 回・シード固定） ----
    rng = np.random.default_rng(np.random.SeedSequence([SEED, widx]))
    draws = [(rng.uniform(0, 2 * math.pi), rng.uniform(-SHIFT_M, SHIFT_M, 2)) for _ in range(NDRAW)]
    subs = {}
    for res in RES:
        for s, ls in sets[res].items():
            m = ls.region
            P, w = ls.P[m], ls.w[m]
            if len(P) > SUB:
                sel = rng.choice(len(P), SUB, replace=False); P, w = P[sel], w[sel]
            subs[(res, s)] = (P, w)
    nulls = {}
    for kind in ["stream", "ridge"]:
        Ok = O[kind]
        if not len(Ok.P) or Ok.length_in() < 1000:
            continue
        for k, (th, sh) in enumerate(draws):
            Oc = rigid(Ok.P, region.center, th, sh)
            ot = cKDTree(Oc)
            o_in = region(Oc)
            for res in RES:
                for s in (VALLEY_SETS if kind == "stream" else RIDGE_SETS):
                    if s == "LM_v4":
                        continue
                    ls = sets[res][s]
                    P, w = subs[(res, s)]
                    q = rigid_inv(P, region.center, th, sh)
                    cov = (q[:, 0] >= cover[0]) & (q[:, 0] <= cover[2]) & (q[:, 1] >= cover[1]) & (q[:, 1] <= cover[3])
                    for r in RADII:
                        d = ot.query(P[cov], distance_upper_bound=r)[0] if cov.any() else np.zeros(0)
                        pn, pd = float(w[cov][np.isfinite(d)].sum()), float(w[cov].sum())
                        tr_ = ls.tree()
                        if tr_ is not None and o_in.any():
                            d2 = tr_.query(Oc[o_in], distance_upper_bound=r)[0]
                            rn, rd = float(Ok.w[o_in][np.isfinite(d2)].sum()), float(Ok.w[o_in].sum())
                        else:
                            rn, rd = 0.0, float(Ok.w[o_in].sum()) if len(o_in) else 0.0
                        key = f"{res}|{s}|{kind}|{r}"
                        nulls.setdefault(key, np.zeros((NDRAW, 4)))[k] = [pn, pd, rn, rd]
    out["null"] = {k: v for k, v in nulls.items()}

    # ---- 解像度依存：30m の線と 10m の線の一致（位置）と偶然の値 ----
    for s in AGREE_SETS:
        A, B = sets["30m"][s], sets["10m"][s]
        for r in RADII:
            p, q = prec_rec(A, B, region, r)   # p: 30m の線のうち10mの線から r 以内、q: 10m の線のうち30mの線から r 以内
            out["agree"].append({"set": s, "r": r, "pn": p[0], "pd": p[1], "rn": q[0], "rd": q[1]})
    ag = {}
    for s in AGREE_SETS:
        A, B = sets["30m"][s], sets["10m"][s]
        if not len(A.P) or not len(B.P):
            continue
        P, w = subs[("30m", s)]
        for k, (th, sh) in enumerate(draws):
            Bc = rigid(B.P, region.center, th, sh)
            bt = cKDTree(Bc); b_in = region(Bc)
            q = rigid_inv(P, region.center, th, sh)
            cov = (q[:, 0] >= b[0]) & (q[:, 0] <= b[2]) & (q[:, 1] >= b[1]) & (q[:, 1] <= b[3])
            for r in RADII:
                d = bt.query(P[cov], distance_upper_bound=r)[0] if cov.any() else np.zeros(0)
                pn, pd = float(w[cov][np.isfinite(d)].sum()), float(w[cov].sum())
                d2 = A.tree().query(Bc[b_in], distance_upper_bound=r)[0] if b_in.any() else np.zeros(0)
                rn, rd = float(B.w[b_in][np.isfinite(d2)].sum()), float(B.w[b_in].sum())
                ag.setdefault(f"{s}|{r}", np.zeros((NDRAW, 4)))[k] = [pn, pd, rn, rd]
    out["agree_null"] = ag

    # ---- 尾根の連続性：連結成分と、鞍部（落差30m以上）を通る尾根の割合 ----
    for res in RES:
        g = region.grids[res]; tr = g["tr"]
        cols = pickle.load(open(f"out/cache_b1cols_{name}_{res}.pkl", "rb"))
        pts = []
        for (row, col, prom, z) in cols:
            if prom < 30:
                continue
            x = tr.c + (col + 0.5) * tr.a; y = tr.f + (row + 0.5) * tr.e
            if region(np.array([[x, y]]))[0]:
                pts.append((x, y, prom))
        for s in RIDGE_SETS:
            G = Graph(sets[res][s].polys, region)
            st = G.comp_stats(); st["lengths_m"] = [float(v) for v in G.comp_len]
            out["cont"][f"{res}|{s}"] = st
            n_near = n300 = n1000 = 0
            for (x, y, prom) in pts:
                near, th_ = G.through(x, y)
                n_near += near; n300 += th_[300.0]; n1000 += th_[1000.0]
            out["col_through"][f"{res}|{s}"] = {"n_cols": len(pts), "near100": n_near, "through300": n300, "through1000": n1000}
            if name == "jonen":
                if out["jonen"] is None:
                    out["jonen"] = {}
                tt = Transformer.from_crs(4326, win["epsg"], always_xy=True)
                jx, jy = tt.transform(*JONEN_COL)
                near, th_ = G.through(jx, jy, near_m=150.0, reach=(300.0, 1000.0, 2000.0))
                i = G.anchor(jx, jy, 150.0)
                d = float(np.hypot(G.xy[i, 0] - jx, G.xy[i, 1] - jy)) if i is not None else None
                clen = float(G.comp_len_all[G.label[i]]) if i is not None else None   # 採った節が属する成分の全長
                out["jonen"][f"{res}|{s}"] = {"nearest_node_m": d, "near150": near,
                                              "through": {str(k): v for k, v in th_.items()}, "component_length_m": clen}
    return out


def main():
    wins = load_windows()
    with ProcessPoolExecutor(6) as ex:
        results = list(ex.map(process_window, [(w, i) for i, w in enumerate(wins)]))
    with open("out/eval_lines_raw.pkl", "wb") as f:
        pickle.dump(results, f)
    print("書いた: out/eval_lines_raw.pkl（集計は report_lines.py）")


if __name__ == "__main__":
    main()
