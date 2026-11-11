# 試作（栃木北部）：尾根の絞り込みの試行（新規）。LANDMARK の再計算はしない（m3 の組み立て済みの区間を使う）。
#   絞り込みは「区間」（升目2点）の段階で行い、そのあと既存の後処理（つなぎ直し→ヒゲ刈り→ならし→間引き）を通す。
#     起伏：区間の中点の 1km 四方（33×33 升目）の最高−最低（relief_check.py と同じ定義）
#     A_spread：LANDMARK の区間ごとの値
#     平坦面：pilot_lines.flat_mask（沢と同じ定義）に乗る尾根の区間を捨てる（findings8 では尾根は捨てていなかった）
#   試す組み合わせ（VARIANTS）。長さは bbox で切ったあと、線を 30m おきの点にして数える（relief_check.py と同じ）。
#   現行 terrainFlow の尾根（上限あり・pilot/out/prod_ridges_cap.json）も同じ方法で長さを数え、起伏60m以上に絞った長さとの比も出す。
#   さらに A_spread の段で切ったとき、タイル計算（m1・m3）と参照（継ぎ目なし）で「段の内外」が入れ替わる長さの割合を、
#   継ぎ目からの距離帯ごとに出す（参照の芯の中）。
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/filter_trial.py
import json, pickle
import numpy as np
import rasterio
from scipy.ndimage import maximum_filter, minimum_filter
from pyproj import Transformer
from shapely.geometry import box, LineString
from shapely.ops import transform as shp_transform
from pilot_lines import load_meta, master_info, assemble, flat_mask, on_mask, process, core_rect
from seam_check import seg_keys, seam_dist, BINS, BIN_LAB
from prepare_dem import BBOX, UTM

VARIANTS = {   # 名前: (起伏の下限 m, A_spread の下限 m², 平坦面の尾根を捨てるか)
    "base": (0, 0, False),
    "flat": (0, 0, True),
    "r60": (60, 0, True),
    "a3e5": (0, 3e5, True),
    "a1e6": (0, 1e6, True),
    "r60_a3e5": (60, 3e5, True),
    "r60_a1e6": (60, 1e6, True),
}
TIERS = [3e5, 1e6]
RBANDS = [0, 30, 60, 100, 200, 1e9]


def relief_grid():
    with rasterio.open("pilot/data/master_z12.tif") as d:
        h = d.read(1).astype(float); nod = d.nodata; tr = d.transform
    ok = h != nod
    return maximum_filter(np.where(ok, h, -1e9), 33) - minimum_filter(np.where(ok, h, 1e9), 33), tr


def at(grid, tr, P):
    c = ((P[:, 0] - tr.c) / tr.a).astype(int); r = ((P[:, 1] - tr.f) / tr.e).astype(int)
    return grid[r, c]


def clip_ll(lines, to_ll, bb):
    out = []
    for l in lines:
        g = shp_transform(lambda x, y, z=None: to_ll.transform(x, y), l).intersection(bb)
        if not g.is_empty:
            out.extend(p for p in (g.geoms if hasattr(g, "geoms") else [g]) if isinstance(p, LineString) and len(p.coords) >= 2)
    return out


def sample_len(lines_ll, to_utm, rel, rtr):
    """経緯度の線 → 30m おきの点の長さ（km）を、起伏の帯ごとに"""
    tot = np.zeros(len(RBANDS) - 1)
    for l in lines_ll:
        a = np.asarray(l.coords); x, y = to_utm.transform(a[:, 0], a[:, 1]); a = np.c_[x, y]
        cum = np.r_[0, np.cumsum(np.hypot(*np.diff(a, axis=0).T))]
        if cum[-1] <= 0:
            continue
        n = max(1, int(cum[-1] // 30)); s = (np.arange(n) + .5) * cum[-1] / n
        P = np.c_[np.interp(s, cum, a[:, 0]), np.interp(s, cum, a[:, 1])]
        v = at(rel, rtr, P); w = cum[-1] / n
        for k, (lo, hi) in enumerate(zip(RBANDS[:-1], RBANDS[1:])):
            tot[k] += w * ((v >= lo) & (v < hi)).sum()
    return tot / 1000


def prod_lines_ll(to_ll, bb):
    P = json.load(open("pilot/out/prod_ridges_cap.json", encoding="utf-8"))
    m = P["meta"]; ls = []
    for r in P["ridges"]:
        if len(r["x"]) < 2:
            continue
        ls.append(LineString(np.c_[m["x0"] + np.array(r["x"]) * m["a"], m["y0"] + np.array(r["y"]) * m["e"]]))
    return clip_ll(ls, to_ll, bb)


def main():
    meta = load_meta(); tr, cell = master_info()
    T = meta["tiles"]
    A = assemble(sorted(n for n, t in T.items() if t.get("margin") == "m3"), meta, tr)
    rel, rtr = relief_grid()
    mask, mtr, _ = flat_mask()
    Pm = A["R"].mean(axis=1)
    v = at(rel, rtr, Pm); onf = on_mask(Pm, mask, mtr); a = A["A_spread"]
    to_ll = Transformer.from_crs(UTM, 4326, always_xy=True); to_utm = Transformer.from_crs(4326, UTM, always_xy=True)
    bb = box(BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"])

    prod = prod_lines_ll(to_ll, bb)
    prod_b = sample_len(prod, to_utm, rel, rtr)
    prod_tot, prod_r60 = prod_b.sum(), prod_b[2:].sum()
    res = {"prod": {"bands_km": prod_b.tolist(), "total_km": prod_tot, "r60_km": prod_r60}, "variants": {}}
    layers = {}
    print(f"現行 terrainFlow の尾根（上限あり）：合計 {prod_tot:,.0f}km・起伏60m以上 {prod_r60:,.0f}km")
    print("\n絞り込み | 区間の長さ(折れ線のまま) | 線の本数 | 後処理後の長さ（bbox）| 起伏帯 0–30/30–60/60–100/100–200/200+ | 60m未満の割合 | 現行比（全体）| 現行比（現行も60m以上）")
    for name, (rmin, amin, drop_flat) in VARIANTS.items():
        k = (v >= rmin) & (a >= amin)
        if drop_flat:
            k &= ~onf
        seg_km = np.hypot(*(A["R"][k][:, 1] - A["R"][k][:, 0]).T).sum() / 1000
        lines = process(A["R"][k], cell, True)
        ll = clip_ll(lines, to_ll, bb)
        bands = sample_len(ll, to_utm, rel, rtr)
        tot = bands.sum()
        layers[f"ridge_{name}"] = ll
        res["variants"][name] = {"rmin": rmin, "amin": amin, "drop_flat": drop_flat, "seg_km": seg_km, "n_lines": len(ll),
                                 "bands_km": bands.tolist(), "total_km": tot, "lt60_share": bands[:2].sum() / tot,
                                 "ratio_prod": tot / prod_tot, "ratio_prod_r60": tot / prod_r60}
        print(f"  {name:<9} | {seg_km:7,.0f}km | {len(ll):6,} | {tot:6,.0f}km | " + "/".join(f"{b:,.0f}" for b in bands) +
              f" | {bands[:2].sum()/tot*100:4.1f}% | {tot/prod_tot:.2f} | {tot/prod_r60:.2f}")

    # ---- A_spread の段で切ったときの、継ぎ目による「段の内外」の入れ替わり（参照の芯の中）----
    V1 = assemble(sorted(n for n, t in T.items() if t.get("margin") == "m1"), meta, tr)
    REF = assemble(["ref_m3"], meta, tr)
    rx0, ry0, rx1, ry1 = core_rect(T["ref_m3"], tr); ref = meta["ref"]
    cx0, _, _, cy1 = core_rect(T[f"m3_t{ref['i0']}_{ref['j0']}"], tr)
    xs_in = [cx0 + k2 * meta["core_cells"] * tr.a for k2 in range(1, ref["i1"] - ref["i0"] + 1)]
    ys_in = [cy1 + k2 * meta["core_cells"] * tr.e for k2 in range(1, ref["j1"] - ref["j0"] + 1)]
    kb = {kk: i for i, kk in enumerate(seg_keys(REF["R"]))}
    res["tier_flip"] = {}
    print("\nA_spread の段の内外の入れ替わり（参照の芯の中・完全一致した区間。入れ替わった長さ／参照で段の内にある長さ）")
    for mk, VV in [("m1", V1), ("m3", A)]:
        P = VV["R"].mean(axis=1)
        inside = (P[:, 0] >= rx0) & (P[:, 0] < rx1) & (P[:, 1] >= ry0) & (P[:, 1] < ry1)
        idx = np.array([kb.get(kk, -1) for kk in seg_keys(VV["R"])]); m = inside & (idx >= 0)
        L = np.hypot(*(VV["R"][:, 1] - VV["R"][:, 0]).T); sd = seam_dist(P, xs_in, ys_in)
        for t in TIERS:
            a_t = VV["A_spread"] >= t; a_r = np.zeros(len(P), bool); a_r[m] = REF["A_spread"][idx[m]] >= t
            row = []
            for lo, hi, lab in zip(BINS[:-1], BINS[1:], BIN_LAB):
                s = m & (sd >= lo) & (sd < hi)
                den = L[s & a_r].sum()
                lost = L[s & a_r & ~a_t].sum(); gained = L[s & ~a_r & a_t].sum()
                row.append({"bin": lab, "ref_in_km": den / 1000, "lost": lost / den if den else None, "gained": gained / den if den else None})
            res["tier_flip"][f"{mk}|{t:.0e}"] = row
            print(f"  {mk} A_spread≧{t:.0e}: " + "  ".join(f"{r['bin']} 落ちる {r['lost']*100:4.1f}%・増える {r['gained']*100:4.1f}%（{r['ref_in_km']:.0f}km）" for r in row))
    json.dump(res, open("pilot/out/filter_trial.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    pickle.dump({"layers": layers}, open("pilot/out/layers_filter.pkl", "wb"))


if __name__ == "__main__":
    main()
