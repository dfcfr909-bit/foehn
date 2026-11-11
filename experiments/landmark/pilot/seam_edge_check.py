# 試作（栃木北部）：A_spread・A_out の過小の原因の切り分け（新規）。
#   問い：m3（余白3km）の「継ぎ目から2km以上」でも 4.7% 過小なのは、
#     (a) 参照の端の影響か、(b) A_spread が数km先まで効く量で、継ぎ目から離れても余白の外の影響が残るのか。
#   方法：参照（30km四方の芯＋3km）の芯の内側だけで、完全一致した区間について、
#     ・参照の芯の端からの距離帯ごとの過小率（<0.95倍）と過大率（>1.05倍）
#     ・継ぎ目からの距離 × 参照の端からの距離 のクロス集計（過小率）
#   を出す。m1（余白1km）と m3（余白3km）、尾根（A_spread）と沢（A_out）。
#   ※ 過大（タイルの方が大きい）は、参照の方が切れている（参照の外の集まりが見えない）ことを示す。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/seam_edge_check.py
import json
import numpy as np
from pilot_lines import load_meta, master_info, assemble, core_rect
from seam_check import seg_keys, seam_dist

EDGE_BINS = [0, 1000, 2000, 4000, 7000, 1e9]
EDGE_LAB = ["0–1km", "1–2km", "2–4km", "4–7km", "7km以上"]
SEAM_BINS = [0, 500, 2000, 1e9]
SEAM_LAB = ["継ぎ目0–500m", "500m–2km", "2km以上"]


def matched(A, B, attrA, attrB):
    kb = {k: i for i, k in enumerate(seg_keys(B))}
    idx = np.array([kb.get(k, -1) for k in seg_keys(A)])
    m = idx >= 0
    L = np.hypot(*(A[:, 1] - A[:, 0]).T)
    ratio = np.full(len(A), np.nan); ratio[m] = attrA[m] / attrB[idx[m]]
    return m, ratio, L


def main():
    meta = load_meta(); tr, cell = master_info()
    T = meta["tiles"]; ref = meta["ref"]
    V = {mk: assemble(sorted(n for n, t in T.items() if t.get("margin") == mk), meta, tr) for mk in ["m1", "m3"]}
    REF = assemble(["ref_m3"], meta, tr)
    rx0, ry0, rx1, ry1 = core_rect(T["ref_m3"], tr)
    cx0, _, _, cy1 = core_rect(T[f"m3_t{ref['i0']}_{ref['j0']}"], tr)
    xs_in = [cx0 + k * meta["core_cells"] * tr.a for k in range(1, ref["i1"] - ref["i0"] + 1)]
    ys_in = [cy1 + k * meta["core_cells"] * tr.e for k in range(1, ref["j1"] - ref["j0"] + 1)]
    out = {}
    for kind, Sk, Ak in [("尾根 A_spread", "R", "A_spread"), ("沢 A_out", "S", "A_out")]:
        for mk in ["m1", "m3"]:
            A = V[mk][Sk]; P = A.mean(axis=1)
            inside = (P[:, 0] >= rx0) & (P[:, 0] < rx1) & (P[:, 1] >= ry0) & (P[:, 1] < ry1)
            m, ratio, L = matched(A, REF[Sk], V[mk][Ak], REF[Ak])
            edge = np.minimum.reduce([P[:, 0] - rx0, rx1 - P[:, 0], P[:, 1] - ry0, ry1 - P[:, 1]])
            sd = seam_dist(P, xs_in, ys_in)
            base = inside & m
            print(f"\n[{kind}・{mk}（余白 {'1km' if mk == 'm1' else '3km'}）] 参照の芯の端からの距離帯")
            print("  端からの距離 | 長さkm | 過小(<0.95) | 過大(>1.05) | 比の中央値")
            rows = []
            for lo, hi, lab in zip(EDGE_BINS[:-1], EDGE_BINS[1:], EDGE_LAB):
                s = base & (edge >= lo) & (edge < hi)
                Ls = L[s].sum()
                if Ls == 0:
                    print(f"  {lab:>8} | 0"); continue
                u = L[s & (ratio < 0.95)].sum() / Ls; o = L[s & (ratio > 1.05)].sum() / Ls
                rows.append({"edge": lab, "km": Ls / 1000, "under": u, "over": o, "median": float(np.median(ratio[s]))})
                print(f"  {lab:>8} | {Ls/1000:6.1f} | {u*100:5.1f}% | {o*100:5.1f}% | {np.median(ratio[s]):.2f}")
            print("  クロス集計（過小率・括弧は長さkm）：行＝継ぎ目からの距離、列＝参照の端からの距離")
            print("  " + " " * 14 + " | ".join(f"{e:>13}" for e in EDGE_LAB))
            cross = {}
            for slo, shi, slab in zip(SEAM_BINS[:-1], SEAM_BINS[1:], SEAM_LAB):
                cells = []
                for lo, hi, lab in zip(EDGE_BINS[:-1], EDGE_BINS[1:], EDGE_LAB):
                    s = base & (edge >= lo) & (edge < hi) & (sd >= slo) & (sd < shi)
                    Ls = L[s].sum()
                    if Ls == 0:
                        cells.append(f"{'-':>13}"); continue
                    u = L[s & (ratio < 0.95)].sum() / Ls
                    cross[f"{slab}|{lab}"] = {"under": u, "km": Ls / 1000}
                    cells.append(f"{u*100:5.1f}%({Ls/1000:5.0f})")
                print(f"  {slab:<14}" + " | ".join(cells))
            out[f"{kind}|{mk}"] = {"by_edge": rows, "cross": cross}
    json.dump(out, open("pilot/out/seam_edge_check.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
