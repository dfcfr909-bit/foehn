# 試作（栃木北部）：runProdFlowPilot.mjs に渡す DEM 格子を書き出す（新規）。
#   範囲は「全タイルの芯（7×6）＋3km」（LANDMARK の m3 と同じ外周）。マスター DEM から切り出す。
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/export_prod_grid.py
import json
import numpy as np
import rasterio
from rasterio.windows import Window
from pilot_lines import MASTER, load_meta

meta = load_meta()
cell = meta["cell_m"]; mc = int(round(3000.0 / cell)); core = meta["core_cells"]
col = meta["col0"] - mc; row = meta["row0"] - mc
w = meta["nx"] * core + 2 * mc; h = meta["ny"] * core + 2 * mc
with rasterio.open(MASTER) as d:
    a = d.read(1, window=Window(col, row, w, h)).astype("float32"); nod = d.nodata
    tr = d.window_transform(Window(col, row, w, h))
a[a == nod] = np.nan
a.tofile("pilot/out/prod_grid.f32")
json.dump({"nx": w, "ny": h, "cell": cell, "x0": tr.c, "y0": tr.f, "a": tr.a, "e": tr.e}, open("pilot/out/prod_grid.meta.json", "w"))
print(f"格子 {w}×{h}（{w*h/1e6:.2f}M 升目）・欠測 {np.isnan(a).mean()*100:.3f}%")
