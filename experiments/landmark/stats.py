# LANDMARK の出力の統計だけを素早く出す（可視化なし）
import sys
import geopandas as gpd

res = sys.argv[1] if len(sys.argv) > 1 else "10m"
full_dir = f"out/nantai_{res}_full"

ridges = gpd.read_file(f"{full_dir}/ridgelines_se_HSO_nantai_{res}.gpkg.gpkg")
slopes = gpd.read_file(f"{full_dir}/slopelines_se_HSO_nantai_{res}.gpkg.gpkg")
print(f"=== {res} ===")
print(f"ridgelines: {len(ridges)} 区間（全量）／ 総延長 {ridges.geometry.length.sum()/1000:.1f}km")
print(f"slopelines: {len(slopes)} 区間（全量）／ 総延長 {slopes.geometry.length.sum()/1000:.1f}km")
print("--- A_spread 分布 ---")
print(ridges["A_spread"].describe())
for th in [1e4, 1e5, 1e6]:
    n = (ridges["A_spread"] >= th).sum()
    L = ridges[ridges["A_spread"] >= th].geometry.length.sum()/1000
    print(f"  A_spread>={th:.0e}: {n}区間・{L:.1f}km")
print("--- A_out 分布 ---")
print(slopes["A_out"].describe())
for th in [1e4, 1e5, 1e6]:
    n = (slopes["A_out"] >= th).sum()
    L = slopes[slopes["A_out"] >= th].geometry.length.sum()/1000
    print(f"  A_out>={th:.0e}: {n}区間・{L:.1f}km")
print("--- hso（Horton次数）分布 ---")
print(slopes["hso"].value_counts().sort_index())
for hso_th in [1,3,5,7]:
    n = (slopes["hso"] >= hso_th).sum()
    L = slopes[slopes["hso"] >= hso_th].geometry.length.sum()/1000
    print(f"  hso>={hso_th}: {n}区間・{L:.1f}km")
print("--- id_rdl（稜線の本数） ---")
print(f"  ridge の本数（id_rdl のユニーク数）: {ridges['id_rdl'].nunique()}")
print(f"  slope の本数（id_ch_main のユニーク数）: {slopes['id_ch_main'].nunique()}")
