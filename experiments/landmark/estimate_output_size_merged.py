# estimate_output_size.py の続き（新規）：LANDMARK の短い区間（升目2点）を linemerge で連続した線につなぎ直してから
# 間引き（Douglas–Peucker・升目の 0.25 個分）した場合の容量。属性は区間ごとに違うので、つなぐのは同じ閾値の集合の中だけ・属性は落とす
# （＝階層を後から切り替えられない形。階層ごとに別レイヤーにする前提の見積もり）。
# 使い方: .venv/Scripts/python.exe estimate_output_size_merged.py > out/estimate_output_size_merged.log
import gzip, json
import numpy as np
from pyproj import Transformer
from shapely.geometry import LineString, MultiLineString
from shapely.ops import linemerge, transform as shp_transform
from eval_windows import load_windows
from lines_common import lm_lines, Region
from estimate_output_size import mvt_size

prev = json.load(open("out/estimate_output_size.json"))
tot = {}
for w in load_windows():
    name = w["name"]; region = Region(w)
    to_ll = Transformer.from_crs(w["epsg"], 4326, always_xy=True); to_m = Transformer.from_crs(w["epsg"], 3857, always_xy=True)
    for res in ["30m", "10m"]:
        cell = region.grids[res]["cell"]; lm = lm_lines(name, res); a_cut = prev[f"{name}|{res}|a_cut"]
        groups = {"ridge": lm["ridge"]["polys"], "valley_native": [c for c, a in zip(lm["valley"]["polys"], lm["valley"]["A_out"]) if a >= a_cut],
                  "valley_all": lm["valley"]["polys"]}
        for g, polys in groups.items():
            m = linemerge(MultiLineString([LineString(c) for c in polys if len(c) >= 2]))
            parts = list(m.geoms) if hasattr(m, "geoms") else [m]
            parts = [p.simplify(0.25 * cell, preserve_topology=False) for p in parts]
            nv = sum(len(p.coords) for p in parts)
            feats = [{"type": "Feature", "properties": {}, "geometry": {"type": "LineString", "coordinates": [[round(x, 5), round(y, 5)] for x, y in zip(*to_ll.transform(*np.asarray(p.coords).T))]}} for p in parts]
            gj = json.dumps({"type": "FeatureCollection", "features": feats}, separators=(",", ":")).encode()
            merc = [shp_transform(lambda x, y, z=None: to_m.transform(x, y), p) for p in parts]
            mz14, _ = mvt_size(merc, [{}] * len(merc), 14)
            mz12, _ = mvt_size(merc, [{}] * len(merc), 12)
            t = tot.setdefault(f"{res}|{g}", np.zeros(6)); t += [len(parts), nv, len(gj), len(gzip.compress(gj, 6)), mz12, mz14]
        print(name, res, "done", flush=True)
for res in ["30m", "10m"]:
    area = sum(prev[f"{w['name']}|{res}|area_km2"] for w in load_windows())
    for g in ["ridge", "valley_native", "valley_all"]:
        t = tot[f"{res}|{g}"]; kb = lambda b: f"{b/1024:,.0f}KB({b/1024/area:.2f})"
        print(f"  {g:<13} {res} つなぎ直し+間引き | 線 {int(t[0]):>6,} 頂点 {int(t[1]):>8,} | GeoJSON {kb(t[2])} gz {kb(t[3])} | MVT z12 gz {kb(t[4])} z14 gz {kb(t[5])}")
    print(f"  （{res} 有効面積 {area:.0f}km²）")
json.dump({k: v.tolist() for k, v in tot.items()}, open("out/estimate_output_size_merged.json", "w"), indent=1)
