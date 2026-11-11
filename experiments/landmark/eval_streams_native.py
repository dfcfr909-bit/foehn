# 沢の追加確認（findings7）：現行方式の「本番の既定の定数」の網と、同じ全長にそろえた LANDMARK の沢を比べる（新規）。
#   findings6 の沢比較は、現行側が閾値を下げた「密な網」から切った線で、本番の既定の設定ではなかった。
#   ここでは現行側を本番の既定の定数の網（PR_v：30m 139km・10m 327km）に固定し、
#   LANDMARK 側は沢の区間を A_out（集水面積）の大きい順に足して、領域内の全長がそれにもっとも近くなる所で切る（hso は使わない）。
#   指標・基準（OSM の waterway=river/stream）・領域・バッファ・偶然の値（OSM の線をランダムに回転・移動、100回・同じシード）は findings6 と同じ。
#   平坦面・水面マスクの前後を出す。マスクありは2通り：
#     maskedA … 線は plain のまま（マスクした領域で数えるので、LANDMARK の全長は現行より短くなる）
#     maskedB … マスクした領域で全長をそろえ直した（LANDMARK の線を A_out 順にとり直す）
#   偶然の値は、モードごとに、その領域で数え直した。
#   ⚠ 既存の出力だけを使う（LANDMARK の gpkg・node で実行した現行方式の線・OSM の取得結果）。LANDMARK・現行方式の再計算はしない。
#
# 使い方: .venv/Scripts/python.exe eval_streams_native.py > out/eval_streams_native.log
import json, math, pickle
from concurrent.futures import ProcessPoolExecutor
import numpy as np
from pyproj import Transformer
from scipy.spatial import cKDTree
from eval_windows import load_windows
from eval_lines import build_flat_water, SEED, NDRAW, SUB, RES, SHIFT_M
from lines_common import LineSet, Region, prec_rec, rigid, rigid_inv, STEP_M, OSM_STEP_M, RADII, lm_lines, prod_lines, osm_elements


def make_sets(name, region, res, masked):
    """masked=True なら、平坦面・水面を外した領域で全長を数えて長さ合わせをする"""
    reg = (lambda P: region(P, True)) if masked else region
    lm = lm_lines(name, res)
    pr = prod_lines(name, res, region.grids[res]["tr"])
    PR = LineSet(pr["bridge"]["valley"]["polys"], STEP_M, {"sca": pr["bridge"]["valley"]["sca"]}, reg)
    LM = LineSet(lm["valley"]["polys"], STEP_M, {"A_out": lm["valley"]["A_out"].astype(float), "hso": lm["valley"]["hso"].astype(float)}, reg)
    LMA, used, short = LM.match_length("A_out", PR.length_in())
    hso = LMA.attrs["hso"]
    per = np.bincount(LMA.i[LMA.region], weights=LMA.w[LMA.region], minlength=len(LMA.polys))
    info = {"target_km": PR.length_in() / 1000, "used_km": used / 1000, "short": short, "lm_total_km": LM.length_in() / 1000,
            "a_out_min": float(LMA.attrs["A_out"].min()) if len(LMA.polys) else None,
            "hso_share": {int(h): float(per[hso == h].sum() / max(per.sum(), 1)) for h in np.unique(hso)}}
    return {"LM_A": LMA, "PR_v": PR}, info


def process_window(args):
    win, widx = args
    name = win["name"]
    to_crs = Transformer.from_crs(4326, win["epsg"], always_xy=True)
    region = Region(win)
    streams, _, waters, _ = osm_elements(name, to_crs)
    O = LineSet(streams, OSM_STEP_M, region=region)
    excl, _, _, _ = build_flat_water(region, waters, win["epsg"])
    region.excl = excl
    b = region.bounds
    cover = (b[0] - 500, b[1] - 500, b[2] + 500, b[3] + 500)

    S = {"plain": {}, "maskedB": {}}
    info = {"plain": {}, "maskedB": {}}
    for res in RES:
        S["plain"][res], info["plain"][res] = make_sets(name, region, res, False)
        S["maskedB"][res], info["maskedB"][res] = make_sets(name, region, res, True)
    S["maskedA"] = S["plain"]
    MASKED = {"plain": False, "maskedA": True, "maskedB": True}

    out = {"name": name, "area_km2": region.area_km2, "osm_km": O.length_in() / 1000, "info": info, "real": [], "null": {}, "on_excl_km": {}}
    for mode, masked in MASKED.items():
        for res in RES:
            for s, ls in S[mode][res].items():
                if mode == "plain":
                    onx = region.on_excl(ls.P) & region(ls.P) if len(ls.P) else np.zeros(0, bool)
                    out["on_excl_km"][f"{res}|{s}"] = [float(ls.w[onx].sum() / 1000), ls.length_in() / 1000]
                for r in RADII:
                    p, q = prec_rec(ls, O, region, r, masked)
                    out["real"].append({"mode": mode, "res": res, "set": s, "r": r, "pn": p[0], "pd": p[1], "rn": q[0], "rd": q[1]})

    # 偶然の値：findings6 と同じ乱数（同じシード・同じ回数・同じ動かし方）。モードごとに、その領域で数える
    rng = np.random.default_rng(np.random.SeedSequence([SEED, widx]))
    draws = [(rng.uniform(0, 2 * math.pi), rng.uniform(-SHIFT_M, SHIFT_M, 2)) for _ in range(NDRAW)]
    subs = {}
    for mode, masked in MASKED.items():
        for res in RES:
            for s, ls in S[mode][res].items():
                m = region(ls.P, masked) if len(ls.P) else np.zeros(0, bool)
                P, w = ls.P[m], ls.w[m]
                if len(P) > SUB:
                    sel = rng.choice(len(P), SUB, replace=False); P, w = P[sel], w[sel]
                subs[(mode, res, s)] = (P, w)
    nulls = {}
    if len(O.P) and O.length_in() >= 1000:
        for k, (th, sh) in enumerate(draws):
            Oc = rigid(O.P, region.center, th, sh)
            ot = cKDTree(Oc)
            o_in_by = {False: region(Oc, False), True: region(Oc, True)}
            for mode, masked in MASKED.items():
                o_in = o_in_by[masked]
                for res in RES:
                    for s, ls in S[mode][res].items():
                        P, w = subs[(mode, res, s)]
                        q = rigid_inv(P, region.center, th, sh)
                        cov = (q[:, 0] >= cover[0]) & (q[:, 0] <= cover[2]) & (q[:, 1] >= cover[1]) & (q[:, 1] <= cover[3])
                        for r in RADII:
                            d = ot.query(P[cov], distance_upper_bound=r)[0] if cov.any() else np.zeros(0)
                            pn, pd = float(w[cov][np.isfinite(d)].sum()), float(w[cov].sum())
                            d2 = ls.tree().query(Oc[o_in], distance_upper_bound=r)[0] if o_in.any() else np.zeros(0)
                            rn, rd = float(O.w[o_in][np.isfinite(d2)].sum()), float(O.w[o_in].sum())
                            nulls.setdefault(f"{mode}|{res}|{s}|{r}", np.zeros((NDRAW, 4)))[k] = [pn, pd, rn, rd]
    out["null"] = nulls
    return out


def main():
    wins = load_windows()
    with ProcessPoolExecutor(6) as ex:
        R = list(ex.map(process_window, [(w, i) for i, w in enumerate(wins)]))
    pickle.dump(R, open("out/eval_streams_native_raw.pkl", "wb"))

    LAB = {"LM_A": "LANDMARK（A_out 順・全長を現行にそろえた）", "PR_v": "現行 本番の既定の定数"}
    MODES = [("plain", "マスクなし"), ("maskedA", "マスクあり（線はマスクなしのまま。全長は不揃い）"), ("maskedB", "マスクあり（マスク後に全長をそろえ直した）")]
    area = sum(x["area_km2"] for x in R)
    print(f"OSM 沢（領域内）{sum(x['osm_km'] for x in R):.0f}km・領域の面積 {area:.0f}km²・窓 {len(R)}")
    summary = {}
    print("\n長さ合わせ（10窓・領域内）:")
    for mode in ["plain", "maskedB"]:
        for res in RES:
            infos = [x["info"][mode][res] for x in R]
            t = sum(i["target_km"] for i in infos); u = sum(i["used_km"] for i in infos); lt = sum(i["lm_total_km"] for i in infos)
            sh = [x["name"] for x in R if x["info"][mode][res]["short"]]
            amin = sorted(i["a_out_min"] for i in infos if i["a_out_min"] is not None)
            hs = {}
            for i in infos:
                for h, sh_ in i["hso_share"].items():
                    hs[h] = hs.get(h, 0) + sh_ * i["used_km"]
            tot = sum(hs.values())
            print(f"  [{mode}] {res}: 目標（現行の網）{t:.0f}km → 使った {u:.0f}km（LANDMARK 既定の全部 {lt:.0f}km）・届かなかった窓 {sh or 'なし'}・"
                  f"切った A_out の下限（窓ごと）{amin[0]/1e4:.1f}〜{amin[-1]/1e4:.1f}万m²（中央値 {amin[len(amin)//2]/1e4:.1f}万m²）")
            print("        選ばれた線の hso 構成: " + "  ".join(f"hso{h}:{hs[h]/tot*100:.0f}%" for h in sorted(hs)))
            summary[f"{mode}|{res}"] = {"target_km": t, "used_km": u, "hso_mix": {int(h): hs[h] / tot for h in hs}}

    def pooled(mode, res, s, r):
        rows = [q for x in R for q in x["real"] if q["mode"] == mode and q["res"] == res and q["set"] == s and q["r"] == r]
        pn, pd_, rn, rd = (sum(q[k] for q in rows) for k in ("pn", "pd", "rn", "rd"))
        return {"prec": pn / pd_, "rec": rn / rd, "det_km": pd_ / 1000, "ref_km": rd / 1000}

    def nullp(mode, res, s, r):
        A = np.sum([x["null"][f"{mode}|{res}|{s}|{r}"] for x in R if f"{mode}|{res}|{s}|{r}" in x["null"]], axis=0)
        pr = A[:, 0] / A[:, 1]; rc = A[:, 2] / A[:, 3]
        f = lambda v: [float(v.mean()), float(np.percentile(v, 2.5)), float(np.percentile(v, 97.5))]
        return {"prec": f(pr), "rec": f(rc)}

    fm = lambda v: f"{v*100:5.1f}%"
    fn = lambda t: f"{t[0]*100:4.1f}%[{t[1]*100:.1f}–{t[2]*100:.1f}]"
    res_out = {}
    for mode, title in MODES:
        print("\n" + "=" * 90 + f"\n{title}（OSM 沢基準・10窓合計）\n" + "=" * 90)
        for res in RES:
            for r in RADII:
                print(f"\n[{res}・バッファ{int(r)}m]  手法 / 検出km / 精度相当（偶然[95%範囲]） / 再現相当（偶然[95%範囲]） / OSM沢km")
                for s in ["LM_A", "PR_v"]:
                    p = pooled(mode, res, s, r); n = nullp(mode, res, s, r)
                    print(f"  {LAB[s]:<26} {p['det_km']:6.0f}  {fm(p['prec'])} ({fn(n['prec'])})  {fm(p['rec'])} ({fn(n['rec'])})  {p['ref_km']:.0f}")
                    res_out[f"{mode}|{res}|{int(r)}|{s}"] = {**p, "null": n}
    print("\n平坦面・水面の上に乗る線（領域内・10窓合計 km／割合。マスクなしの線）:")
    for res in RES:
        for s in ["LM_A", "PR_v"]:
            a = sum(x["on_excl_km"][f"{res}|{s}"][0] for x in R); b = sum(x["on_excl_km"][f"{res}|{s}"][1] for x in R)
            print(f"  {res} {LAB[s]:<26} {a:.2f}km／{b:.0f}km（{a/b*100:.1f}%）")
    print("\n差（LANDMARK − 現行、ポイント）／偶然の95%範囲の上限:")
    for mode, title in MODES:
        for res in RES:
            for r in RADII:
                a, b = res_out[f"{mode}|{res}|{int(r)}|LM_A"], res_out[f"{mode}|{res}|{int(r)}|PR_v"]
                print(f"  {mode:>8} {res} {int(r)}m: 精度 {100*(a['prec']-b['prec']):+5.1f}pt  再現 {100*(a['rec']-b['rec']):+5.1f}pt   （偶然の上限 精度 {a['null']['prec'][2]*100:.1f}% 再現 {a['null']['rec'][2]*100:.1f}%）")
    json.dump({"summary": summary, "results": res_out}, open("out/eval_streams_native_summary.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1, default=float)


if __name__ == "__main__":
    main()
