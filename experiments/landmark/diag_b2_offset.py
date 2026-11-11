# B2 の診断（新規）：参照点ごとに「最寄りの LANDMARK saddle」「最寄りの DEM 由来 col」までの距離を出し、
# 地名ラベルの表示位置のずれ と LANDMARK の取りこぼし を切り分ける材料にする。
# 使い方: .venv/Scripts/python.exe diag_b2_offset.py   （eval_windows.py の後）
import json, numpy as np, rasterio
from col_prominence import find_cols
from eval_windows import load_windows, load_dem, edge_mask, SaddleIndex

S = json.load(open("out/eval_windows_summary.json", encoding="utf-8"))
wins = {w["name"]: w for w in load_windows()}
cache = {}
rows = []
for r in S["b2_refs"]:
    w = wins[r["window"]]
    if w["name"] not in cache:
        h, tr, cell, _ = load_dem(w["dems"]["10m"]); m = edge_mask(h, cell)
        cols = [(tr.c + (c["col"] + .5) * tr.a, tr.f + (c["row"] + .5) * tr.e, c["prom"])
                for c in find_cols(h, cell) if c["prom"] >= 5 and not m[c["row"], c["col"]]]
        cache[w["name"]] = (np.array(cols), SaddleIndex(f"out/{w['name']}_10m_saddles_depth.json"))
    cols, sad = cache[w["name"]]
    d_col5 = np.hypot(cols[:, 0] - r["x"], cols[:, 1] - r["y"]).min()
    d_sad = np.hypot(sad.x - r["x"], sad.y - r["y"]).min()
    rows.append((r["src"], r["window"], r["name"], d_col5, d_sad, r["near_col_dist"], r["10m"]["hit"]))
rows.sort(key=lambda t: (t[0], t[3]))
print("src  window name  最寄りcol(落差>=5) 最寄りLANDMARK saddle(標高不問) 最寄りcol(落差>=10) 10m判定")
for t in rows:
    print(f"{t[0]:>6} {t[1]:>6} {t[2]:<8} col5={t[3]:6.0f}m  saddle={t[4]:6.0f}m  col10={t[5]:6.0f}m  {'○' if t[6] else '×'}")
for src in ["両方", "OSMのみ", "GSIのみ"]:
    a = [t for t in rows if t[0] == src]
    if a:
        print(src, "n=%d" % len(a), "col5距離 中央値/最大 %.0f/%.0f" % (np.median([t[3] for t in a]), max(t[3] for t in a)),
              "saddle距離 中央値/最大 %.0f/%.0f" % (np.median([t[4] for t in a]), max(t[4] for t in a)))

# ---- 追加：「両方登録」を OSM 側の座標で判定した場合（地理院ラベル位置のずれの影響を除く）----
from pyproj import Transformer
enum = json.load(open("out/enum_candidates.json", encoding="utf-8"))
print("\n[両方登録：OSM座標で判定した場合]  (距離50m・標高差5m。OSM の ele があれば使う)")
tot = {"10m": [0, 0], "30m": [0, 0]}
for r in S["b2_refs"]:
    if r["src"] != "両方":
        continue
    w = wins[r["window"]]
    g = min((g for g in enum["gsi"] if g["both"] and g["name"] == r["name"]),
            key=lambda g: abs(g["lat"] - r["lat"]) + abs(g["lon"] - r["lon"]))
    o = enum["osm"][g["osm_within"][0]]
    x, y = Transformer.from_crs(4326, w["epsg"], always_xy=True).transform(o["lon"], o["lat"])
    ele = float(o["ele"]) if o.get("ele") and str(o["ele"]).replace(".", "", 1).isdigit() else None
    line = f"  {r['window']} {r['name']} OSM名={o.get('name')} ele={ele}:"
    for res in ["10m", "30m"]:
        sad = SaddleIndex(f"out/{w['name']}_{res}_saddles_depth.json")
        h = sad.hit(x, y, ele)
        tot[res][0] += h; tot[res][1] += 1
        line += f" {res}={'○' if h else '×'}"
    print(line)
print("  合計:", {k: f"{v[0]}/{v[1]}" for k, v in tot.items()})

# ---- 追加：距離許容を広げた場合の参考（GSI ラベルの表示位置ずれを許す）----
print("\n[参考：距離許容を広げたときの Recall（10m・標高は見ない・参照点の全数）]")
for src in ["両方", "OSMのみ", "GSIのみ"]:
    a = [t for t in rows if t[0] == src]
    print(" ", src, "n=%d" % len(a), {tol: sum(t[4] <= tol for t in a) for tol in (50, 100, 200, 300, 500)})
