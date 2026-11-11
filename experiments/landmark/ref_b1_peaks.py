# B1：DEMから LANDMARK と無関係に peak と key col を抽出する（新規）。
# col_prominence.py（現行Föhnのterrainfindcolsと同じUnion-Findアルゴリズム）が返す
# 「峰が2つ以上つながる点」のリストは、そのまま「各峰の key col と prominence」になっている
# （低い方の峰が、そのcolで初めて高い方につながって独立でなくなる＝その峰の prominence）。
# LANDMARKの出力は一切参照しない。
#
# 使い方: .venv/Scripts/python.exe ref_b1_peaks.py
import json
import numpy as np
import rasterio
from pyproj import Transformer
from col_prominence import find_cols

SITES = {
    "nantai": {"dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"}},
    "jonen": {"dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"}},
}
PROM_THRESHOLDS = [30, 100]


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
        crs = d.crs
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell, crs


def main():
    for site, info in SITES.items():
        for res, dem_path in info["dems"].items():
            h, transform, cell, crs = load_dem(dem_path)
            cols = find_cols(h, cell)
            to_wgs = Transformer.from_crs(crs, 4326, always_xy=True)

            peaks = []
            for c in cols:
                if c["prom"] < PROM_THRESHOLDS[0]:
                    continue
                px = transform.c + (c["peak_col"] + 0.5) * transform.a
                py = transform.f + (c["peak_row"] + 0.5) * transform.e
                cx = transform.c + (c["col"] + 0.5) * transform.a
                cy = transform.f + (c["row"] + 0.5) * transform.e
                peak_z = h[c["peak_row"], c["peak_col"]]
                plon, plat = to_wgs.transform(px, py)
                clon, clat = to_wgs.transform(cx, cy)
                peaks.append({
                    "peak_x": px, "peak_y": py, "peak_lon": plon, "peak_lat": plat, "peak_z": float(peak_z),
                    "col_x": cx, "col_y": cy, "col_lon": clon, "col_lat": clat, "col_z": c["z"],
                    "prominence": c["prom"],
                })
            peaks.sort(key=lambda p: -p["prominence"])

            out_path = f"out/ref_b1_{site}_{res}.json"
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump({"site": site, "res": res, "crs": str(crs),
                           "n_prom30": len(peaks),
                           "n_prom100": sum(1 for p in peaks if p["prominence"] >= 100),
                           "peaks": peaks}, f, ensure_ascii=False, indent=2)
            print(f"{site} {res}: peak(prom>=30)={len(peaks)}・peak(prom>=100)="
                  f"{sum(1 for p in peaks if p['prominence']>=100)} -> {out_path}")


if __name__ == "__main__":
    main()
