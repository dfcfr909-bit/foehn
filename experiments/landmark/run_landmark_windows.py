# 作業1-2 の続き：選定した新規窓で LANDMARK（10m・30m）を回し、saddle に落差を対応づける（新規）。
#   既存2窓（男体山・常念乗越）は再計算せず、既存の out/{site}_{res}_saddles_depth.json を流用する。
#   30m は地理院 DEM z12 タイル（既存の常念乗越30mと同じ作り方）。5m・1m は回さない。
#   saddle_full_cache.py / saddle_depth_analysis.py は変更せず、前者は subprocess で、
#   後者の assign_depth は import して使う。
#
# 使い方: .venv/Scripts/python.exe run_landmark_windows.py
import json, os, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor
import numpy as np
import rasterio
from col_prominence import find_cols
from saddle_depth_analysis import assign_depth
from select_windows import fetch_dem

PY = sys.executable


def run_one(job):
    name, res, lon, lat = job
    dem = f"data/{name}_{res}.tif"
    out = f"out/{name}_{res}_saddles_all.json"
    if not os.path.exists(out):
        t0 = time.time()
        r = subprocess.run([PY, "saddle_full_cache.py", name, res, dem, str(lon), str(lat), out],
                           capture_output=True, text=True, encoding="utf-8")
        if r.returncode != 0:
            return name, res, f"LANDMARK失敗: {r.stderr[-500:]}"
        msg = f"{time.time()-t0:.0f}秒"
    else:
        msg = "既存"
    # 落差の対応づけ（saddle_depth_analysis.analyze と同じ手順）
    with rasterio.open(dem) as d:
        h = d.read(1); nod = d.nodata; tr = d.transform; cell = d.res[0]
    h = np.where(h == nod, np.nan, h)
    cols = find_cols(h, cell)
    with open(out, encoding="utf-8") as f:
        data = json.load(f)
    saddles = data["saddles"]
    n_un = assign_depth(saddles, cols, tr, cell)
    with open(f"out/{name}_{res}_saddles_depth.json", "w", encoding="utf-8") as f:
        json.dump(saddles, f, ensure_ascii=False, indent=2)
    return name, res, f"{msg}・saddle {len(saddles)}件・落差不明 {n_un}件"


def main():
    with open("out/windows_selected.json", encoding="utf-8") as f:
        sel = json.load(f)
    jobs = []
    for w in sel["selected"]:
        lat, lon = w["center_lat"], w["center_lon"]
        fetch_dem(w["name"], lat, lon, 14, f"data/{w['name']}_10m.tif")
        fetch_dem(w["name"], lat, lon, 12, f"data/{w['name']}_30m.tif")
        jobs.append((w["name"], "30m", lon, lat))
        jobs.append((w["name"], "10m", lon, lat))
    # 10m（重い）を先に投げる
    jobs.sort(key=lambda j: j[1] != "10m")
    with ProcessPoolExecutor(5) as ex:
        for name, res, msg in ex.map(run_one, jobs):
            print(f"{name} {res}: {msg}", flush=True)


if __name__ == "__main__":
    main()
