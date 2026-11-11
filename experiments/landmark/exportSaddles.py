# LANDMARK の内部の saddle 点（model.sdl_pt）を取り出し、既知の乗越（常念乗越）との距離を見る。
# 標準の export には saddle が含まれないので、パイプラインを手で呼んで直接読む。
import sys
sys.path.insert(0, "landmark/src")
import numpy as np
from landmark.geomorph_tools.load_data_geotiff import LoadData
from landmark.geomorph_tools.D8_LTD import SlopelineMixin
from landmark.geomorph_tools.slopeline import calculate_slopelines
from landmark.geomorph_tools.dpl import dpl
from landmark.geomorph_tools.mutual_dist import mutual_dist
from landmark.geomorph_tools.endo_del import endo_del
from landmark.geomorph_tools.saddle_spill import saddle_spill
from landmark.geomorph_tools.ridge_point import find_ridge_neighbors
from landmark.geomorph_tools.ridge_hier import ridge_hier

class HydroModel(LoadData, SlopelineMixin):
    pass

dem_path = sys.argv[1]
target_lon, target_lat = float(sys.argv[2]), float(sys.argv[3])

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

print(f"saddle 点の数: {len(model.sdl_pt)}")

from pyproj import Transformer
t = Transformer.from_crs(4326, model.crs, always_xy=True)
cx, cy = t.transform(target_lon, target_lat)
print(f"目標地点（UTM）: {cx:.1f}, {cy:.1f}")

rows = []
for sp in model.sdl_pt:
    rp = model.rd_pt[sp.id_rdpt - 1]
    x, y = model.transform * (rp.j / 2, rp.i / 2)
    x += model.delta_x / 2
    y -= model.delta_y / 2
    d = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
    rows.append((d, x, y, rp.Z, sp.id_cis_endo, sp.id_trans_out, sp.A_endo))

rows.sort(key=lambda r: r[0])
print(f"\n目標地点から近い順の saddle（上位10件）:")
print(f"{'距離m':>10} {'x':>12} {'y':>12} {'標高m':>8} {'cis_endo':>9} {'trans_out':>10} {'A_endo':>12}")
for d, x, y, z, cis, tout, aendo in rows[:10]:
    print(f"{d:10.1f} {x:12.1f} {y:12.1f} {z:8.1f} {str(cis):>9} {str(tout):>10} {str(aendo):>12}")
