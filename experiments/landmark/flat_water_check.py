# 平坦面が水面かの確認（新規）：平坦面（10m DEM で5×5升目の起伏0.3m未満・2ha以上）ごとに、
# OSM の水面ポリゴンまでの距離と、面の周辺（外接矩形＋50m）にある OSM 要素のタグを調べる。
# 使い方: .venv/Scripts/python.exe flat_water_check.py
import json, sys, time, urllib.request, urllib.parse
from collections import Counter
import numpy as np
import rasterio.features
from pyproj import Transformer
from scipy.ndimage import label, distance_transform_edt
from shapely.geometry import Polygon
from eval_windows import load_windows
from lines_common import Region, osm_elements
from eval_lines import build_flat_water, FLAT_MIN_M2

EP = "https://overpass-api.de/api/interpreter"
UA = "foehn-landmark-probe (experiments/landmark)"
out = {}
for w in load_windows():
    if w["name"] not in (sys.argv[1:] or ("nantai", "w07", "w08")):
        continue
    to_crs = Transformer.from_crs(4326, w["epsg"], always_xy=True)
    to_ll = Transformer.from_crs(w["epsg"], 4326, always_xy=True)
    region = Region(w)
    _, _, waters, _ = osm_elements(w["name"], to_crs)
    excl, flat, water, comps = build_flat_water(region, waters, w["epsg"])
    g = region.grids["10m"]; tr = g["tr"]
    dist_m = distance_transform_edt(~water) * g["cell"] if water.any() else np.full(water.shape, 1e9)
    lab, n = label(flat)
    print(f"\n=== {w['name']}（OSM水面ポリゴン {len(waters)}件）===")
    for i in range(1, n + 1):
        m = lab == i
        rows, cols = np.where(m)
        ha = m.sum() * g["cell"] ** 2 / 1e4
        if ha < 2:
            continue
        z = g["h"][m]
        x0, x1 = tr.c + cols.min() * tr.a - 50, tr.c + (cols.max() + 1) * tr.a + 50
        y1, y0 = tr.f + rows.min() * tr.e + 50, tr.f + (rows.max() + 1) * tr.e - 50
        s, west = to_ll.transform(x0, y0)[::-1]; north, east = to_ll.transform(x1, y1)[::-1]
        d = dist_m[m]
        line = (f"平坦面 {ha:.1f}ha 標高 {z.min():.1f}〜{z.max():.1f}m｜OSM水面ポリゴンの中 {water[m].mean()*100:.0f}%・30m以内 {(d<=30).mean()*100:.0f}%・100m以内 {(d<=100).mean()*100:.0f}%")
        q = f'[out:json][timeout:60];nwr({s},{west},{north},{east});out tags;'
        tags = Counter()
        for a in range(5):
            try:
                req = urllib.request.Request(EP, data=("data=" + urllib.parse.quote(q)).encode(), headers={"User-Agent": UA})
                els = json.loads(urllib.request.urlopen(req, timeout=90).read().decode("utf-8")).get("elements", [])
                for e in els:
                    for k in ("natural", "water", "landuse", "waterway", "leisure", "man_made", "wetland"):
                        if k in e.get("tags", {}):
                            tags[f"{k}={e['tags'][k]}"] += 1
                    if "name" in e.get("tags", {}):
                        tags["名称:" + e["tags"]["name"]] += 1
                break
            except Exception as ex:
                time.sleep(40 * (a + 1)); els = None
        print("  " + line)
        print("    周辺(外接矩形+50m)のOSM要素のタグ:", dict(tags) if els is not None else "取得失敗")
        out.setdefault(w["name"], []).append({"ha": float(ha), "z": [float(z.min()), float(z.max())], "in_water": float(water[m].mean()),
                                              "within30": float((d <= 30).mean()), "within100": float((d <= 100).mean()), "tags": dict(tags)})
        time.sleep(3)
json.dump(out, open("out/flat_water_check" + ("_" + "_".join(sys.argv[1:]) if sys.argv[1:] else "") + ".json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
