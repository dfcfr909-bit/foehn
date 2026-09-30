# 試作（栃木北部）：タイルの計算結果を組み立てて、表示用の層を作る（新規）。
#   層：
#     ridge_pruned … LANDMARK の尾根（A_spread≧1e5）・ヒゲ刈り有
#     ridge_raw    … 同・ヒゲ刈り無
#     valley_1e5 / valley_1e6 / valley_1e7 … LANDMARK の沢。A_out が 10万・100万・1,000万m² 以上の区間ごとに別の層（参考表示）。
#                    平坦面（DEM だけ）の上の区間は捨てる。ヒゲ刈り有（本番の沢と同じ扱い）
#   余白は m3（3km）を採用する（タイル境界の検証は seam_check.py）。
#   最後に bbox（経緯度）で切る。
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/build_layers.py [m3|m1]
import pickle, sys, time
import numpy as np
from pyproj import Transformer
from shapely.geometry import box, LineString
from shapely.ops import transform as shp_transform
from pilot_lines import load_meta, master_info, assemble, flat_mask, on_mask, process
from prepare_dem import BBOX, UTM

VARIANT = sys.argv[1] if len(sys.argv) > 1 else "m3"
LEVELS = [1e5, 1e6, 1e7]


def main():
    t0 = time.time()
    meta = load_meta(); tr, cell = master_info()
    names = sorted(n for n, t in meta["tiles"].items() if t.get("margin") == VARIANT)
    A = assemble(names, meta, tr)
    mask, mtr, flat = flat_mask()
    Smid = A["S"].mean(axis=1) if len(A["S"]) else np.zeros((0, 2))
    on_flat = on_mask(Smid, mask, mtr)
    Rmid = A["R"].mean(axis=1)
    to_ll = Transformer.from_crs(UTM, 4326, always_xy=True)
    bb = box(BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"])
    seglen = lambda S: np.hypot(*(S[:, 1] - S[:, 0]).T)
    stats = {"n_tiles": len(names), "ridge_segments": int(len(A["R"])), "valley_segments": int(len(A["S"])),
             "flat_cells": int(flat.sum()), "flat_km2": float(flat.sum() * cell ** 2 / 1e6),
             "valley_on_flat_km": float(seglen(A["S"][on_flat]).sum() / 1000),
             "ridge_on_flat_km": float(seglen(A["R"][on_mask(Rmid, mask, mtr)]).sum() / 1000)}

    layers = {"ridge_pruned": process(A["R"], cell, True), "ridge_raw": process(A["R"], cell, False)}
    for lv in LEVELS:
        k = (A["A_out"] >= lv) & ~on_flat
        layers[f"valley_{int(lv):.0e}".replace("+0", "")] = process(A["S"][k], cell, True)

    out = {}
    for name, lines in layers.items():
        ll = []
        for l in lines:
            g = shp_transform(lambda x, y, z=None: to_ll.transform(x, y), l).intersection(bb)
            if g.is_empty:
                continue
            parts = list(g.geoms) if hasattr(g, "geoms") else [g]
            ll.extend(p for p in parts if isinstance(p, LineString) and len(p.coords) >= 2)
        out[name] = ll
        stats[f"{name}_lines"] = len(ll)
        stats[f"{name}_vertices"] = int(sum(len(p.coords) for p in ll))
        stats[f"{name}_km_utm"] = float(sum(l.length for l in lines) / 1000)
    stats["seconds"] = time.time() - t0
    pickle.dump({"layers": out, "stats": stats, "variant": VARIANT}, open(f"pilot/out/layers_{VARIANT}.pkl", "wb"))
    for k, v in stats.items():
        print(k, round(v, 2) if isinstance(v, float) else v)


if __name__ == "__main__":
    main()
