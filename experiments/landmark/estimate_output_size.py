# 採用設計の調査（design_options.md）用：既存10窓の LANDMARK の線（既定閾値の出力。再計算しない）を、
# 配信形式にしたときの容量を実測する（新規）。
#   ・GeoJSON（経緯度・小数5桁）… そのままと gzip 後
#   ・MVT（z12・z14 のタイルに切って mapbox_vector_tile で符号化）… gzip 後の合計
#   それぞれ 間引きなし／間引きあり（Douglas–Peucker・升目の 0.25 個分。本番の VEC.SIMPLIFY_CELLS と同じ）の2通り
#   対象：尾根（A_spread≧1e5）・沢（A_out≧1e5。hso≧4 全部と、A_out 上位で本番の既定の網と同じ全長に切ったもの）
#   面積あたり（KB/km²）に直して design_options.md の外挿に使う。
# 使い方: .venv/Scripts/python.exe estimate_output_size.py > out/estimate_output_size.log
import gzip, json, math
import numpy as np
import mapbox_vector_tile
from pyproj import Transformer
from shapely.geometry import LineString, box, mapping
from shapely.ops import transform as shp_transform
from eval_windows import load_windows
from lines_common import lm_lines, prod_lines, Region, LineSet, STEP_M

R = 6378137.0
ZOOMS = [12, 14]


def merc_tile_bounds(z, x, y):
    n = 2 ** z; span = 2 * math.pi * R / n
    x0 = -math.pi * R + x * span; y1 = math.pi * R - y * span
    return x0, y1 - span, x0 + span, y1


def mvt_size(lines_merc, props, z):
    """lines_merc: Web Mercator の LineString のリスト。z のタイルに切り、タイルごとに符号化して gzip 後の合計バイト"""
    if not lines_merc:
        return 0, 0
    xs = [c for l in lines_merc for c in l.bounds[0::2]]; ys = [c for l in lines_merc for c in l.bounds[1::2]]
    n = 2 ** z; span = 2 * math.pi * R / n
    tx0, tx1 = int((min(xs) + math.pi * R) // span), int((max(xs) + math.pi * R) // span)
    ty0, ty1 = int((math.pi * R - max(ys)) // span), int((math.pi * R - min(ys)) // span)
    total, ntiles = 0, 0
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            b = merc_tile_bounds(z, tx, ty); bb = box(*b)
            feats = []
            for l, p in zip(lines_merc, props):
                if not l.intersects(bb):
                    continue
                g = l.intersection(bb)
                if g.is_empty:
                    continue
                feats.append({"geometry": g, "properties": p})
            if not feats:
                continue
            data = mapbox_vector_tile.encode([{"name": "lines", "features": feats}], quantize_bounds=b, extents=4096)
            total += len(gzip.compress(data, 6)); ntiles += 1
    return total, ntiles


def main():
    out = {}
    for w in load_windows():
        name = w["name"]
        region = Region(w)
        to_ll = Transformer.from_crs(w["epsg"], 4326, always_xy=True)
        to_m = Transformer.from_crs(w["epsg"], 3857, always_xy=True)
        for res in ["30m", "10m"]:
            cell = region.grids[res]["cell"]
            lm = lm_lines(name, res)
            # 沢：本番の既定の網と同じ全長（A_out 上位）
            pr = prod_lines(name, res, region.grids[res]["tr"])
            PR = LineSet(pr["bridge"]["valley"]["polys"], STEP_M, {"sca": pr["bridge"]["valley"]["sca"]}, region)
            LMv = LineSet(lm["valley"]["polys"], STEP_M, {"A_out": lm["valley"]["A_out"].astype(float)}, region)
            LMA, _, _ = LMv.match_length("A_out", PR.length_in())
            a_cut = float(LMA.attrs["A_out"].min()) if len(LMA.polys) else float("inf")
            groups = {
                "ridge": [(c, {"k": "r", "a": int(a)}) for c, a in zip(lm["ridge"]["polys"], lm["ridge"]["A_spread"])],
                "valley_all": [(c, {"k": "v", "a": int(a), "h": int(h)}) for c, a, h in zip(lm["valley"]["polys"], lm["valley"]["A_out"], lm["valley"]["hso"])],
                "valley_native": [(c, {"k": "v", "a": int(a), "h": int(h)}) for c, a, h in zip(lm["valley"]["polys"], lm["valley"]["A_out"], lm["valley"]["hso"]) if a >= a_cut],
            }
            for gname, items in groups.items():
                for simp in (False, True):
                    geoms, props, nv = [], [], 0
                    feats_ll = []
                    # ⚠ LANDMARK の出力は升目2点の短い区間の集まり。区間ごとの小さな線のまま数える（まとめない＝最悪側の見積もり）
                    for c, p in items:
                        if len(c) < 2:
                            continue
                        l = LineString(c)
                        if simp:
                            l = l.simplify(0.25 * cell, preserve_topology=False)
                        nv += len(l.coords)
                        feats_ll.append({"type": "Feature", "properties": p,
                                         "geometry": {"type": "LineString", "coordinates": [[round(x, 5), round(y, 5)] for x, y in zip(*to_ll.transform(*np.asarray(l.coords).T))]}})
                        geoms.append(shp_transform(lambda x, y, z=None: to_m.transform(x, y), l)); props.append(p)
                    gj = json.dumps({"type": "FeatureCollection", "features": feats_ll}, separators=(",", ":")).encode()
                    rec = {"n_lines": len(geoms), "n_vertices": nv, "geojson_bytes": len(gj), "geojson_gz_bytes": len(gzip.compress(gj, 6))}
                    for z in ZOOMS:
                        rec[f"mvt_z{z}_gz_bytes"], rec[f"mvt_z{z}_tiles"] = mvt_size(geoms, props, z)
                    out[f"{name}|{res}|{gname}|{'simp' if simp else 'raw'}"] = rec
            out[f"{name}|{res}|area_km2"] = float(np.isfinite(region.grids[res]["h"]).sum() * cell ** 2 / 1e6)
            out[f"{name}|{res}|a_cut"] = a_cut
            print(name, res, "done", flush=True)
    json.dump(out, open("out/estimate_output_size.json", "w", encoding="utf-8"), indent=1)

    # 集計（10窓合計・面積あたり）
    names = [w["name"] for w in load_windows()]
    print("\n種類 / 解像度 / 間引き | 線の本数 頂点数 | GeoJSON 生・gz | MVT z12 gz・z14 gz  （10窓合計。括弧は KB/km²）")
    for res in ["30m", "10m"]:
        area = sum(out[f"{n}|{res}|area_km2"] for n in names)
        for g in ["ridge", "valley_native", "valley_all"]:
            for s in ["raw", "simp"]:
                t = {k: sum(out[f"{n}|{res}|{g}|{s}"][k] for n in names) for k in ["n_lines", "n_vertices", "geojson_bytes", "geojson_gz_bytes", "mvt_z12_gz_bytes", "mvt_z14_gz_bytes"]}
                kb = lambda b: f"{b/1024:,.0f}KB({b/1024/area:.1f})"
                print(f"  {g:<13} {res} {s:<4} | {t['n_lines']:>7,} {t['n_vertices']:>9,} | {kb(t['geojson_bytes'])} {kb(t['geojson_gz_bytes'])} | {kb(t['mvt_z12_gz_bytes'])} {kb(t['mvt_z14_gz_bytes'])}")
        print(f"  （{res} の DEM の有効面積 10窓合計 {area:.0f}km²）")


if __name__ == "__main__":
    main()
