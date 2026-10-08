# 現行方式（本番 terrainFindCols）を node で動かすための入力を書き出す（新規）。
# 各窓・各解像度の DEM を float32 の生配列（欠測は NaN）とメタ情報にする。
# 使い方: .venv/Scripts/python.exe export_dem_grids.py
import json, os
import numpy as np
import rasterio
from eval_windows import load_windows

os.makedirs("out/prodcols", exist_ok=True)
for w in load_windows():
    for res in ["10m", "30m"]:
        with rasterio.open(w["dems"][res]) as d:
            h = d.read(1).astype("float32"); nod = d.nodata; cell = d.res[0]
        h[h == nod] = np.nan
        h.tofile(f"out/prodcols/{w['name']}_{res}.f32")
        json.dump({"name": w["name"], "res": res, "ny": h.shape[0], "nx": h.shape[1], "cell": cell},
                  open(f"out/prodcols/{w['name']}_{res}.meta.json", "w"))
        print(w["name"], res, h.shape, round(cell, 2))
