# 作業C：B1（DEM由来peak）・B2（外部データ）・B3（登山道×尾根）に対する LANDMARK saddle の
#   Recall を求める（新規）。既存の out/{site}_{res}_saddles_depth.json（落差つき）をそのまま使う。
#
# 判定基準：距離50m以内 かつ 標高差5m以内 に LANDMARK saddle があれば「拾えた」とする
#   （B3は登山道×尾根の交点近くの標高極小点という性質上、距離のみの判定も併記する）
#
# 使い方: .venv/Scripts/python.exe ref_c_evaluate.py
import json
import numpy as np
from pyproj import Transformer

DIST_TH = 50.0
ELEV_TH = 5.0
DEPTH_THRESHOLDS = [0, 1, 2, 5, 10, 20, 50]

SITES_RES = [("nantai", "30m"), ("nantai", "10m"), ("jonen", "30m"), ("jonen", "10m")]
CRS = {"nantai": 6677, "jonen": 32654}


def load_saddles(site, res):
    with open(f"out/{site}_{res}_saddles_depth.json", encoding="utf-8") as f:
        return json.load(f)


def nearest_hit(saddles, x, y, z, dist_th=DIST_TH, elev_th=ELEV_TH, min_depth=None):
    best = None
    for s in saddles:
        if min_depth is not None:
            if s["depth"] is None or s["depth"] < min_depth:
                continue
        d = ((s["x"] - x) ** 2 + (s["y"] - y) ** 2) ** 0.5
        if d > dist_th:
            continue
        if z is not None and abs(s["z"] - z) > elev_th:
            continue
        if best is None or d < best[0]:
            best = (d, s)
    return best


def evaluate_b1():
    print("\n" + "=" * 60 + "\n作業C-1: B1（DEM由来peakのkey col）に対するRecall\n" + "=" * 60)
    results = {}
    for site, res in SITES_RES:
        with open(f"out/ref_b1_{site}_{res}.json", encoding="utf-8") as f:
            b1 = json.load(f)
        saddles = load_saddles(site, res)
        bands = [(30, 100), (100, 300), (300, 1e9)]
        band_names = ["30-100m", "100-300m", "300m+"]
        band_rows = {}
        for (lo, hi), name in zip(bands, band_names):
            peaks = [p for p in b1["peaks"] if lo <= p["prominence"] < hi]
            hits = 0
            for p in peaks:
                h = nearest_hit(saddles, p["col_x"], p["col_y"], p["col_z"])
                if h:
                    hits += 1
            band_rows[name] = {"n": len(peaks), "hits": hits}
        print(f"\n[{site} {res}] 総peak数(prom>=30)={len(b1['peaks'])}")
        for name, r in band_rows.items():
            pct = f"{r['hits']/r['n']*100:.0f}%" if r["n"] else "-"
            print(f"  落差帯{name}: n={r['n']}・拾えた={r['hits']}（{pct}）")

        # 閾値ごとのRecall（全peak・落差フィルタをLANDMARK側に適用）
        sweep = []
        for th in DEPTH_THRESHOLDS:
            hits = sum(1 for p in b1["peaks"] if nearest_hit(saddles, p["col_x"], p["col_y"], p["col_z"], min_depth=th))
            sweep.append({"threshold": th, "hits": hits, "n": len(b1["peaks"])})
        print("  落差閾値ごとのRecall（全peak対象）:")
        for row in sweep:
            pct = f"{row['hits']/row['n']*100:.0f}%" if row["n"] else "-"
            print(f"    >={row['threshold']}m: {row['hits']}/{row['n']}（{pct}）")

        results[f"{site}_{res}"] = {"bands": band_rows, "sweep": sweep, "n_total": len(b1["peaks"])}
    return results


def evaluate_b2():
    print("\n" + "=" * 60 + "\n作業C-2: B2（外部データ：OSM+地理院地名）に対するRecall\n" + "=" * 60)
    with open("out/ref_b2_osm_saddles.json", encoding="utf-8") as f:
        osm = json.load(f)
    with open("out/ref_b2_gsi_meisho.json", encoding="utf-8") as f:
        gsi = json.load(f)

    results = {}
    for site, res in SITES_RES:
        saddles = load_saddles(site, res)
        to_crs = Transformer.from_crs(4326, CRS[site], always_xy=True)

        refs = []
        for el in osm["sites"][site]["elements"]:
            x, y = to_crs.transform(el["lon"], el["lat"])
            z = float(el["tags"]["ele"]) if "ele" in el.get("tags", {}) else None
            refs.append({"name": el.get("tags", {}).get("name", "(無名)"), "x": x, "y": y, "z": z, "src": "OSM"})
        for h in gsi["sites"][site]["hits"]:
            x, y = to_crs.transform(h["lon"], h["lat"])
            refs.append({"name": h["name"], "x": x, "y": y, "z": None, "src": "GSI地名"})

        hits = 0
        detail = []
        for r in refs:
            hit = nearest_hit(saddles, r["x"], r["y"], r["z"]) if r["z"] is not None else \
                  nearest_hit(saddles, r["x"], r["y"], None, dist_th=DIST_TH, elev_th=1e9)
            if hit:
                hits += 1
            detail.append({"name": r["name"], "src": r["src"], "hit": bool(hit),
                            "hit_dist": hit[0] if hit else None})
        print(f"\n[{site} {res}] 外部データ点数={len(refs)}・拾えた={hits}")
        for d in detail:
            mark = f"○ {d['hit_dist']:.0f}m" if d["hit"] else "×"
            print(f"  - {d['name']}（{d['src']}）: {mark}")
        results[f"{site}_{res}"] = {"n": len(refs), "hits": hits, "detail": detail}
    return results


def evaluate_b3():
    print("\n" + "=" * 60 + "\n作業C-3: B3（登山道×尾根の交点近くの標高極小点）に対するRecall\n" + "=" * 60)
    with open("out/ref_b3_trails.json", encoding="utf-8") as f:
        b3 = json.load(f)
    results = {}
    for site, res in SITES_RES:
        cands = b3["sites"][site]["res"][res]["candidates"]
        saddles = load_saddles(site, res)
        hits_full = 0   # 距離+標高
        hits_dist = 0   # 距離のみ
        for c in cands:
            if nearest_hit(saddles, c["min_x"], c["min_y"], c["min_z"]):
                hits_full += 1
            if nearest_hit(saddles, c["min_x"], c["min_y"], None, elev_th=1e9):
                hits_dist += 1
        print(f"\n[{site} {res}] 候補={len(cands)}・拾えた(距離+標高)={hits_full}・拾えた(距離のみ)={hits_dist}")

        sweep = []
        for th in DEPTH_THRESHOLDS:
            hits = sum(1 for c in cands if nearest_hit(saddles, c["min_x"], c["min_y"], c["min_z"], min_depth=th))
            sweep.append({"threshold": th, "hits": hits, "n": len(cands)})
        for row in sweep:
            pct = f"{row['hits']/row['n']*100:.0f}%" if row["n"] else "-"
            print(f"    >={row['threshold']}m: {row['hits']}/{row['n']}（{pct}）")

        results[f"{site}_{res}"] = {"n": len(cands), "hits_full": hits_full, "hits_dist": hits_dist, "sweep": sweep}
    return results


def main():
    b1 = evaluate_b1()
    b2 = evaluate_b2()
    b3 = evaluate_b3()
    with open("out/ref_c_evaluate_summary.json", "w", encoding="utf-8") as f:
        json.dump({"B1": b1, "B2": b2, "B3": b3}, f, ensure_ascii=False, indent=2)
    print("\n書いた: out/ref_c_evaluate_summary.json")


if __name__ == "__main__":
    main()
