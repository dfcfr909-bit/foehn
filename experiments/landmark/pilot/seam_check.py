# 試作（栃木北部）：タイル境界（つなぎ目）の検証（新規）。
#   比べるもの：
#     ① 参照（中央 3×3 枚の芯＝約30km四方を1回で計算。中に継ぎ目が無い）に対する、余白1km（m1）・3km（m3）のタイル計算。
#        参照の芯の中だけで比べる。距離は「参照の中にある、タイルの継ぎ目（芯の境界）」からの距離で帯に分ける。
#     ② 範囲全体で m1 と m3 を比べる（距離は全部の内側の継ぎ目から）。
#   指標（尾根＝ridge・沢＝valley の区間ごと。区間は升目2点）：
#     一致  … 同じ座標の区間がある割合（升目がそろっているので完全一致で見られる）
#     30m   … 区間の中点から 30m 以内に相手の区間の中点がある割合（位置のずれの許容）
#     過小   … 完全一致した区間のうち、A_spread（尾根）／A_out（沢）が相手の 0.95 倍未満の割合（余白が足りず集まりが切れた影響）
#     段替わり … 沢の完全一致区間のうち、A_out の段（10万・100万・1,000万m²）が相手と違う割合
#   ※ 参照も範囲の外（3km 余白の外）の集まりは見えないので、参照より大きい川の A_out は参照でも過小。ここで見るのは「タイルに切ったことで増えた差」。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/seam_check.py
import json
import numpy as np
from scipy.spatial import cKDTree
from pilot_lines import load_meta, master_info, assemble, core_rect

BINS = [0, 250, 500, 1000, 2000, 1e9]
BIN_LAB = ["0–250m", "250–500m", "500–1000m", "1–2km", "2km以上"]
LEVELS = [1e5, 1e6, 1e7]


def seg_keys(S):
    a = np.round(S.reshape(-1, 4), 2)
    # 向きをそろえる（始点・終点の順に依らない鍵）
    sw = (a[:, 0] > a[:, 2]) | ((a[:, 0] == a[:, 2]) & (a[:, 1] > a[:, 3]))
    a[sw] = a[sw][:, [2, 3, 0, 1]]
    return [tuple(r) for r in a]


def compare(A, B, attrA, attrB, levels, dist, sel_A):
    """A（調べる側）の区間ごとに B（基準）と比べる。sel_A：比べる対象の区間（領域の中）。dist：継ぎ目からの距離"""
    ka = seg_keys(A); kb = {k: i for i, k in enumerate(seg_keys(B))}
    Lm = np.hypot(*(A[:, 1] - A[:, 0]).T)
    tb = cKDTree(B.mean(axis=1)) if len(B) else None
    d30 = tb.query(A.mean(axis=1), distance_upper_bound=30.0)[0] if tb is not None else np.full(len(A), np.inf)
    match = np.array([kb.get(k, -1) for k in ka])
    rows = []
    for lo, hi, lab in zip(BINS[:-1], BINS[1:], BIN_LAB):
        s = sel_A & (dist >= lo) & (dist < hi)
        L = Lm[s].sum()
        if L == 0:
            rows.append({"bin": lab, "km": 0.0}); continue
        m = s & (match >= 0)
        r = {"bin": lab, "km": float(L / 1000), "exact": float(Lm[m].sum() / L), "within30": float(Lm[s & np.isfinite(d30)].sum() / L)}
        if m.any():
            ra = attrA[m] / attrB[match[m]]
            r["under"] = float((Lm[m] * (ra < 0.95)).sum() / Lm[m].sum())
            r["ratio_p10"] = float(np.percentile(ra, 10))
            if levels:
                la = np.searchsorted(levels, attrA[m], side="right"); lb = np.searchsorted(levels, attrB[match[m]], side="right")
                r["level_change"] = float((Lm[m] * (la != lb)).sum() / Lm[m].sum())
        rows.append(r)
    return rows


def seam_dist(P, xs, ys):
    d = np.full(len(P), np.inf)
    for x in xs:
        d = np.minimum(d, np.abs(P[:, 0] - x))
    for y in ys:
        d = np.minimum(d, np.abs(P[:, 1] - y))
    return d


def show(title, rows, kind):
    print(f"\n{title}")
    print("  継ぎ目からの距離 | 長さkm | 完全一致 | 30m以内 | 過小(<0.95倍) | 比の10%点" + (" | 段替わり" if kind == "valley" else ""))
    for r in rows:
        if not r.get("km"):
            print(f"  {r['bin']:>9} | 0"); continue
        f = lambda k: f"{r[k]*100:5.1f}%" if k in r else "   - "
        print(f"  {r['bin']:>9} | {r['km']:6.1f} | {f('exact')} | {f('within30')} | {f('under')} | {r.get('ratio_p10', float('nan')):.2f}" + (f" | {f('level_change')}" if kind == "valley" else ""))


def main():
    meta = load_meta(); tr, cell = master_info()
    T = meta["tiles"]
    V = {mk: assemble(sorted(n for n, t in T.items() if t.get("margin") == mk), meta, tr) for mk in ["m1", "m3"]}
    REF = assemble(["ref_m3"], meta, tr)
    rx0, ry0, rx1, ry1 = core_rect(T["ref_m3"], tr)
    ref = meta["ref"]
    # 参照の中にある継ぎ目（芯の境界）
    t_any = T[f"m3_t{ref['i0']}_{ref['j0']}"]
    cx0, _, _, cy1 = core_rect(t_any, tr)
    xs_in = [cx0 + k * meta["core_cells"] * tr.a for k in range(1, ref["i1"] - ref["i0"] + 1)]
    ys_in = [cy1 + k * meta["core_cells"] * tr.e for k in range(1, ref["j1"] - ref["j0"] + 1)]
    out = {"ref_rect": [rx0, ry0, rx1, ry1], "seams_x": xs_in, "seams_y": ys_in}
    for kind, Sk, Ak, lv in [("ridge", "R", "A_spread", None), ("valley", "S", "A_out", LEVELS)]:
        for mk in ["m1", "m3"]:
            A = V[mk][Sk]; P = A.mean(axis=1)
            inside = (P[:, 0] >= rx0) & (P[:, 0] < rx1) & (P[:, 1] >= ry0) & (P[:, 1] < ry1)
            rows = compare(A, REF[Sk], V[mk][Ak], REF[Ak], lv, seam_dist(P, xs_in, ys_in), inside)
            out[f"vsref|{kind}|{mk}"] = rows
            show(f"① 参照（継ぎ目なし・30km四方）に対する {mk}（余白 {'1km' if mk == 'm1' else '3km'}）の{'尾根' if kind == 'ridge' else '沢'}", rows, kind)
        # ② 範囲全体で m1 を m3 に対して
        x_all = [T["m3_t0_0"]["col"] * tr.a + tr.c + k * meta["core_cells"] * tr.a for k in range(1, meta["nx"])]
        y_all = [tr.f + T["m3_t0_0"]["row"] * tr.e + k * meta["core_cells"] * tr.e for k in range(1, meta["ny"])]
        A = V["m1"][Sk]; P = A.mean(axis=1)
        rows = compare(A, V["m3"][Sk], V["m1"][Ak], V["m3"][Ak], lv, seam_dist(P, x_all, y_all), np.ones(len(A), bool))
        out[f"m1vsm3|{kind}"] = rows
        show(f"② 範囲全体：m1（余白1km）を m3（余白3km）に対して・{'尾根' if kind == 'ridge' else '沢'}", rows, kind)
    # 参照の中の尾根・沢の全長（規模の確認）
    for mk in ["m1", "m3"]:
        for Sk, lab in [("R", "尾根"), ("S", "沢")]:
            A = V[mk][Sk]; P = A.mean(axis=1)
            inside = (P[:, 0] >= rx0) & (P[:, 0] < rx1) & (P[:, 1] >= ry0) & (P[:, 1] < ry1)
            print(f"参照の芯の中の{lab}の全長：{mk} {np.hypot(*(A[inside][:, 1] - A[inside][:, 0]).T).sum()/1000:.1f}km")
    for Sk, lab in [("R", "尾根"), ("S", "沢")]:
        print(f"参照の芯の中の{lab}の全長：ref {np.hypot(*(REF[Sk][:, 1] - REF[Sk][:, 0]).T).sum()/1000:.1f}km")
    json.dump(out, open("pilot/out/seam_check.json", "w"), indent=1)


if __name__ == "__main__":
    main()
