# eval_lines.py の出力（out/eval_lines_raw.pkl）を、窓合計の表にまとめる（新規）。
# 使い方: .venv/Scripts/python.exe report_lines.py > out/report_lines.log
import json, pickle
import numpy as np

R = pickle.load(open("out/eval_lines_raw.pkl", "rb"))
NAMES = [r["name"] for r in R]
RES = ["30m", "10m"]
RADII = [30.0, 50.0]
LAB = {"LM_v4": "LANDMARK hso≧4(既定全部)", "LM_v5": "LANDMARK hso≧5", "LM_v7": "LANDMARK hso≧7",
       "PR_v": "現行 既定の定数", "PR_v_m5": "現行 長さ合わせ(hso≧5相当)", "PR_v_m7": "現行 長さ合わせ(hso≧7相当)",
       "LM_r": "LANDMARK 既定(A_spread≧1e5)", "PR_r": "現行 既定(つなぎ有)", "PR_r_nb": "現行 既定(つなぎ無)", "PR_r_m": "現行 長さ合わせ(つなぎ有)"}
out = {}


def real_rows(res, s, ref, r, masked=False, names=None):
    return [(x["name"], q) for x in R if (names is None or x["name"] in names) for q in x["real"]
            if q["res"] == res and q["set"] == s and q["ref"] == ref and q["r"] == r and q["masked"] == masked]


def pooled(res, s, ref, r, masked=False, names=None):
    rows = [q for _, q in real_rows(res, s, ref, r, masked, names)]
    pn = sum(q["pn"] for q in rows); pd_ = sum(q["pd"] for q in rows); rn = sum(q["rn"] for q in rows); rd = sum(q["rd"] for q in rows)
    return {"prec": pn / pd_ if pd_ else None, "rec": rn / rd if rd else None, "det_km": pd_ / 1000, "ref_km": rd / 1000}


def null_pool(res, s, ref, r, names=None):
    key = f"{res}|{s}|{ref}|{r}"
    arrs = [x["null"][key] for x in R if key in x["null"] and (names is None or x["name"] in names)]
    if not arrs:
        return None
    A = np.sum(arrs, axis=0)   # (NDRAW, 4)
    pr = A[:, 0] / np.where(A[:, 1] > 0, A[:, 1], np.nan); rc = A[:, 2] / np.where(A[:, 3] > 0, A[:, 3], np.nan)
    f = lambda v: (float(np.nanmean(v)), float(np.nanpercentile(v, 2.5)), float(np.nanpercentile(v, 97.5)))
    return {"prec": f(pr), "rec": f(rc)}


def fmt(v):
    return "-" if v is None else f"{v*100:5.1f}%"


def fnull(t):
    return "-" if t is None else f"{t[0]*100:4.1f}%[{t[1]*100:.1f}–{t[2]*100:.1f}]"


def area(names=None):
    return sum(x["area_km2"] for x in R if names is None or x["name"] in names)


def dens(res, s, names=None):
    return sum(x["density"][f"{res}|{s}"] for x in R if names is None or x["name"] in names) / area(names)


print("=" * 100)
print("OSM（基準）の取得：", {x["name"]: {"沢km": round(x["osm"]["stream"]["km_in_region"], 1), "尾根線km": round(x["osm"]["ridge"]["km_in_region"], 1),
                                 "水面ポリゴン": x["n_water_polys"]} for x in R})
print("領域の面積 km²:", {x["name"]: round(x["area_km2"], 1) for x in R}, " 合計", round(area(), 1))
print("長さ合わせの内訳（10窓・領域内）:")
for res in RES:
    for k in ["PR_v_m5", "PR_v_m7", "PR_r_m"]:
        t = sum(x["set_info"][res][k]["target_km"] for x in R); u = sum(x["set_info"][res][k]["used_km"] for x in R)
        sh = [x["name"] for x in R if x["set_info"][res][k]["short"]]
        print(f"  {res} {k}: 目標 {t:.0f}km → 使った {u:.0f}km（密な網でも届かなかった窓: {sh or 'なし'}）")

# ---------------- 沢 ----------------
print("\n" + "=" * 100 + "\n作業1：沢（OSM waterway=river/stream）\n" + "=" * 100)
out["stream"] = {}
for res in RES:
    for r in RADII:
        print(f"\n[{res}・バッファ{int(r)}m]  手法 / 密度km/km² / 検出の全長km / 精度相当(偶然[95%範囲]) / 再現相当(偶然[95%範囲]) / OSM沢の長さkm")
        for s in ["LM_v5", "PR_v_m5", "LM_v7", "PR_v_m7", "PR_v", "LM_v4"]:
            p = pooled(res, s, "stream", r); n = null_pool(res, s, "stream", r) if s != "LM_v4" else None
            print(f"  {LAB[s]:<26} {dens(res, s):6.1f}  {p['det_km']:7.0f}  {fmt(p['prec'])} ({fnull(n['prec'] if n else None)})  {fmt(p['rec'])} ({fnull(n['rec'] if n else None)})  {p['ref_km']:.0f}")
            out["stream"][f"{res}|{int(r)}|{s}"] = {**p, "dens": dens(res, s), "null": n}

# ---------------- 尾根（OSM ridge/arete） ----------------
print("\n" + "=" * 100 + "\n作業2：尾根（OSM natural=ridge/arete）\n" + "=" * 100)
rn_ = [x["name"] for x in R if x["osm"]["ridge"]["km_in_region"] >= 1.0]
print("OSM の尾根線が領域内に1km以上ある窓:", rn_, " 領域内の長さ km:", {x["name"]: round(x["osm"]["ridge"]["km_in_region"], 1) for x in R if x["osm"]["ridge"]["km_in_region"] > 0})
out["ridge"] = {}
for res in RES:
    for r in RADII:
        print(f"\n[{res}・バッファ{int(r)}m・OSM尾根線のある窓のみ]  手法 / 密度 / 検出km / 精度相当(偶然) / 再現相当(偶然) / OSM尾根線km")
        for s in ["LM_r", "PR_r", "PR_r_nb", "PR_r_m"]:
            p = pooled(res, s, "ridge", r, names=rn_); n = null_pool(res, s, "ridge", r, names=rn_)
            print(f"  {LAB[s]:<26} {dens(res, s, rn_):6.1f}  {p['det_km']:6.0f}  {fmt(p['prec'])} ({fnull(n['prec'] if n else None)})  {fmt(p['rec'])} ({fnull(n['rec'] if n else None)})  {p['ref_km']:.1f}")
            out["ridge"][f"{res}|{int(r)}|{s}"] = {**p, "dens": dens(res, s, rn_), "null": n}

print("\n尾根の密度（10窓合計 km/km²）:")
for res in RES:
    print(f"  {res}: " + "  ".join(f"{LAB[s]}={dens(res, s):.1f}" for s in ["LM_r", "PR_r", "PR_r_nb", "PR_r_m"]))

# ---------------- 連続性 ----------------
print("\n" + "=" * 100 + "\n作業2：尾根の連続性（連結成分・落差30m以上の鞍部を通る尾根）\n" + "=" * 100)
out["cont"] = {}
print("手法 / 成分数 / 成分あたり長さ 中央値・p90・最大(m) / 全長km / 1km以上の成分が全長に占める割合 / 100kmあたりの成分数 || 鞍部(落差≧30m): 数 / 100m以内に尾根線 / 両側300m以上 / 両側1000m以上")
for res in RES:
    print(f"[{res}]")
    for s in ["LM_r", "PR_r", "PR_r_nb", "PR_r_m"]:
        L = np.array(sum((x["cont"][f"{res}|{s}"]["lengths_m"] for x in R), []))
        tot = L.sum()
        big = L[L >= 1000].sum() / tot if tot else 0
        c = {k: sum(x["col_through"][f"{res}|{s}"][k] for x in R) for k in ["n_cols", "near100", "through300", "through1000"]}
        print(f"  {LAB[s]:<26} {len(L):5d}  {np.median(L):6.0f} {np.percentile(L, 90):6.0f} {L.max():7.0f}  {tot/1000:6.0f}  {big*100:4.0f}%  {len(L)/(tot/1000)*100:6.0f} || "
              f"{c['n_cols']:3d}  {c['near100']:3d}({c['near100']/c['n_cols']*100:.0f}%)  {c['through300']:3d}({c['through300']/c['n_cols']*100:.0f}%)  {c['through1000']:3d}({c['through1000']/c['n_cols']*100:.0f}%)")
        out["cont"][f"{res}|{s}"] = {"n": int(len(L)), "median": float(np.median(L)), "p90": float(np.percentile(L, 90)), "max": float(L.max()), "total_km": float(tot / 1000), "big_share": float(big), **c}

print("\n常念乗越（36.33341, 137.72752）を通る尾根線（最寄りの節から。150m以内に線があるか／線に沿って両側に何m以上続くか）:")
for x in R:
    if x["name"] == "jonen":
        for res in RES:
            for s in ["LM_r", "PR_r", "PR_r_nb", "PR_r_m"]:
                j = x["jonen"][f"{res}|{s}"]
                print(f"  {res} {LAB[s]:<26} 最寄りの節まで {j['nearest_node_m']:6.0f}m  150m以内に線:{j['near150']}  続く長さ(300/1000/2000m以上):{j['through']}  その成分の全長 {j['component_length_m']:.0f}m")
        out["jonen"] = x["jonen"]

# ---------------- 解像度依存 ----------------
print("\n" + "=" * 100 + "\n作業2：解像度依存（30m → 10m）\n" + "=" * 100)
print("密度 km/km²（10窓合計）:")
out["res"] = {}
for s in ["LM_r", "PR_r", "PR_r_m", "LM_v5", "LM_v7", "PR_v", "PR_v_m5", "PR_v_m7"]:
    d30, d10 = dens("30m", s), dens("10m", s)
    print(f"  {LAB[s]:<26} 30m {d30:6.1f} → 10m {d10:6.1f}（{d10/d30:.2f}倍）")
    out["res"][s] = {"d30": d30, "d10": d10}
print("\n位置の一致（30m の線が 10m の線から d 以内にある割合 ／ 10m の線が 30m の線から d 以内にある割合。偶然＝10m の線をランダムに回転・移動）:")
for r in RADII:
    print(f"[バッファ{int(r)}m]")
    for s in ["LM_r", "PR_r", "PR_r_m", "LM_v5", "LM_v7", "PR_v", "PR_v_m5"]:
        pn = sum(q["pn"] for x in R for q in x["agree"] if q["set"] == s and q["r"] == r); pd_ = sum(q["pd"] for x in R for q in x["agree"] if q["set"] == s and q["r"] == r)
        rn = sum(q["rn"] for x in R for q in x["agree"] if q["set"] == s and q["r"] == r); rd = sum(q["rd"] for x in R for q in x["agree"] if q["set"] == s and q["r"] == r)
        key = f"{s}|{r}"
        A = np.sum([x["agree_null"][key] for x in R if key in x["agree_null"]], axis=0)
        npr = A[:, 0] / A[:, 1]; nrc = A[:, 2] / A[:, 3]
        f = lambda v: f"{v.mean()*100:4.1f}%[{np.percentile(v,2.5)*100:.1f}–{np.percentile(v,97.5)*100:.1f}]"
        print(f"  {LAB[s]:<26} 30→10 {pn/pd_*100:5.1f}% (偶然 {f(npr)})   10→30 {rn/rd*100:5.1f}% (偶然 {f(nrc)})")
        out["res"][f"{s}|{int(r)}"] = {"a30_10": pn / pd_, "a10_30": rn / rd, "null_a": [float(npr.mean()), float(np.percentile(npr, 2.5)), float(np.percentile(npr, 97.5))],
                                        "null_b": [float(nrc.mean()), float(np.percentile(nrc, 2.5)), float(np.percentile(nrc, 97.5))]}

# ---------------- 平坦面 ----------------
print("\n" + "=" * 100 + "\n作業4：平坦面・水面\n" + "=" * 100)
print("平坦面（10m DEM で5×5升目の起伏0.3m未満・2ha以上）と OSM の水面（natural=water 等）の重なり:")
for x in R:
    big = [c for c in x["flat_comps"] if c["ha"] >= 2.0]
    if big:
        print(f"  {x['name']}: 平坦面 {len(big)}か所・計{sum(c['ha'] for c in big):.0f}ha／うちOSM水面と重なる升目の割合（面積加重）{sum(c['ha']*c['in_osm_water'] for c in big)/sum(c['ha'] for c in big)*100:.0f}%（OSM水面ポリゴン {x['n_water_polys']}件）")
        for c in big[:4]:
            print(f"      {c['ha']:6.1f}ha 標高 {c['z_min']:.1f}〜{c['z_max']:.1f}m OSM水面と重なる {c['in_osm_water']*100:3.0f}%  評価領域の内側 {c['inside_region']*100:3.0f}%")
print("\n平坦面・水面（マスク）の上に乗る線の長さ km（領域内・10窓合計 / w07 / 全長に対する割合）:")
for res in RES:
    print(f"[{res}]")
    for s in ["LM_v5", "PR_v_m5", "LM_v7", "PR_v_m7", "PR_v", "LM_r", "PR_r", "PR_r_m"]:
        tot = sum(x["excl_len"][f"{res}|{s}"] for x in R); L = sum(x["density"][f"{res}|{s}"] for x in R)
        w7 = [x for x in R if x["name"] == "w07"][0]
        print(f"  {LAB[s]:<26} 合計 {tot:6.2f}km（{tot/L*100:4.1f}%）  w07 {w7['excl_len'][f'{res}|{s}']:5.2f}km（{w7['excl_len'][f'{res}|{s}']/w7['density'][f'{res}|{s}']*100:4.1f}%）")
print("\nマスク（平坦面・水面を除く）前後の指標（沢・OSM基準・10窓合計。精度相当／再現相当）:")
out["mask"] = {}
for res in RES:
    for r in RADII:
        print(f"[{res}・{int(r)}m]")
        for s in ["LM_v5", "PR_v_m5", "LM_v7", "PR_v_m7"]:
            a = pooled(res, s, "stream", r, False); b = pooled(res, s, "stream", r, True)
            print(f"  {LAB[s]:<26} 精度 {fmt(a['prec'])}→{fmt(b['prec'])}  再現 {fmt(a['rec'])}→{fmt(b['rec'])}  （検出 {a['det_km']:.0f}→{b['det_km']:.0f}km）")
            out["mask"][f"{res}|{int(r)}|{s}"] = {"before": a, "after": b}
print("\nw07 のみ（沢・OSM基準）:")
for res in RES:
    for r in RADII:
        for s in ["LM_v5", "PR_v_m5"]:
            a = pooled(res, s, "stream", r, False, ["w07"]); b = pooled(res, s, "stream", r, True, ["w07"])
            if a["prec"] is not None:
                print(f"  {res}・{int(r)}m {LAB[s]:<26} 精度 {fmt(a['prec'])}→{fmt(b['prec'])}  再現 {fmt(a['rec'])}→{fmt(b['rec'])}  （検出 {a['det_km']:.0f}→{b['det_km']:.0f}km・OSM沢 {a['ref_km']:.1f}km）")

json.dump(out, open("out/report_lines_summary.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1, default=float)
