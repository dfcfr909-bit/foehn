# LANDMARK の saddle 点（model.sdl_pt）を可視化用に JSON へ書き出す（新規・exportSaddles.py は変更しない）。
# exportSaddles.py は標準出力に表示するだけでファイルを残さないため、renderMaps.py から使えるように
# 同じ計算をもう一度回し、緯度経度つきで out/<site>_<res>_saddles.json に保存する。
# ⚠ DEM 読み込みからの LANDMARK パイプライン再実行になる（sdl_pt は標準の gpkg 書き出しに含まれないため）。
#   対象は 10m・30m のみ（5m・1m は回さない）。
#
# 使い方: .venv/Scripts/python.exe saddleCache.py <site> <res> <dem.tif> <target_lon> <target_lat> <out.json>
#   例: python saddleCache.py jonen 10m data/jonen_10m_gsi.tif 137.72752 36.33341 out/jonen_10m_saddles.json
import sys, json
sys.path.insert(0, "landmark/src")
from landmark.geomorph_tools.load_data_geotiff import LoadData
from landmark.geomorph_tools.D8_LTD import SlopelineMixin
from landmark.geomorph_tools.slopeline import calculate_slopelines
from landmark.geomorph_tools.dpl import dpl
from landmark.geomorph_tools.mutual_dist import mutual_dist
from landmark.geomorph_tools.endo_del import endo_del
from landmark.geomorph_tools.saddle_spill import saddle_spill
from landmark.geomorph_tools.ridge_point import find_ridge_neighbors
from landmark.geomorph_tools.ridge_hier import ridge_hier
from pyproj import Transformer


class HydroModel(LoadData, SlopelineMixin):
    pass


def main():
    site, res, dem_path, lon, lat, out_json = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4]), float(sys.argv[5]), sys.argv[6]

    model = HydroModel()
    model.main_channel_choice = 2
    model.type_of_landscape = 0
    model.a_spread_threshold = 1e5
    model.a_out_threshold = 1e5
    model.hso_th = 3
    model.curvature_slope = False
    model.n_pts_calc_slope = 5
    model.noData = [-9999, -9999.0]

    model.read_geotiff(dem_path)
    calculate_slopelines(model)
    dpl(model)
    mutual_dist(model)
    endo_del(model)
    saddle_spill(model)
    find_ridge_neighbors(model)
    ridge_hier(model)

    to_wgs84 = Transformer.from_crs(model.crs, 4326, always_xy=True)
    to_target_crs = Transformer.from_crs(4326, model.crs, always_xy=True)
    cx, cy = to_target_crs.transform(lon, lat)

    saddles = []
    for sp in model.sdl_pt:
        rp = model.rd_pt[sp.id_rdpt - 1]
        x, y = model.transform * (rp.j / 2, rp.i / 2)
        x += model.delta_x / 2
        y -= model.delta_y / 2
        d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
        slon, slat = to_wgs84.transform(x, y)
        saddles.append({"x": x, "y": y, "z": rp.Z, "lon": slon, "lat": slat, "d_from_target": d})
    saddles.sort(key=lambda s: s["d_from_target"])

    out = {
        "site": site, "res": res, "dem": dem_path, "crs": str(model.crs),
        "target_lonlat": [lon, lat], "target_xy": [cx, cy],
        "n_saddles": len(saddles),
        "saddles": saddles[:30],  # 近い順に上位30件だけ（可視化用途で十分）
    }
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"saddle {len(saddles)}件中、近い順30件を書いた: {out_json}")
    if saddles:
        s0 = saddles[0]
        print(f"目標地点から最も近いsaddle: {s0['d_from_target']:.1f}m・標高{s0['z']:.1f}m")


if __name__ == "__main__":
    main()
