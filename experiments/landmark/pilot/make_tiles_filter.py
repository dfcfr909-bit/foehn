# 試作（栃木北部）：絞り込みの試行の層を z10 タイルの JSON に分ける（新規。make_tiles.py と同じ形式・別のフォルダ）。
#   層：尾根の絞り込み（filter_trial.py の出力）＋ 沢（A_out 100万・1,000万m²。layers_m3.pkl）＋ 比較の現行の尾根（上限あり）
#   出力：pilot/out/tiles_filter/10/{x}/{y}.json と index.json（viewer_filter.html が読む）
#   ⚠ 出力は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/make_tiles_filter.py
import gzip, json, os, pickle, shutil
from shapely.geometry import LineString
from make_tiles import tile_of, tile_box, Z
from filter_trial import prod_lines_ll
from prepare_dem import BBOX, UTM
from pyproj import Transformer
from shapely.geometry import box

OUT = "pilot/out/tiles_filter"
F = pickle.load(open("pilot/out/layers_filter.pkl", "rb"))["layers"]
M = pickle.load(open("pilot/out/layers_m3.pkl", "rb"))["layers"]
layers = {k: F[k] for k in ["ridge_base", "ridge_r60", "ridge_r60_a3e5", "ridge_r60_a1e6", "ridge_a1e6"]}
layers["valley_1e6"] = M["valley_1e6"]; layers["valley_1e7"] = M["valley_1e7"]
layers["prod_ridge"] = prod_lines_ll(Transformer.from_crs(UTM, 4326, always_xy=True), box(BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"]))
x0, y0 = tile_of(BBOX["lon0"], BBOX["lat1"]); x1, y1 = tile_of(BBOX["lon1"], BBOX["lat0"])
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
files, per = [], {k: 0 for k in layers}
for x in range(x0, x1 + 1):
    for y in range(y0, y1 + 1):
        tb = tile_box(x, y); doc = {"z": Z, "x": x, "y": y, "layers": {}}
        for name, lines in layers.items():
            arr = []
            for l in lines:
                if not l.intersects(tb):
                    continue
                g = l.intersection(tb)
                for p in (g.geoms if hasattr(g, "geoms") else [g]):
                    if isinstance(p, LineString) and len(p.coords) >= 2:
                        arr.append([round(v, 5) for xy in p.coords for v in xy])
            doc["layers"][name] = arr; per[name] += len(json.dumps(arr, separators=(",", ":")))
        if not any(doc["layers"].values()):
            continue
        os.makedirs(f"{OUT}/{Z}/{x}", exist_ok=True)
        b = json.dumps(doc, separators=(",", ":")).encode()
        open(f"{OUT}/{Z}/{x}/{y}.json", "wb").write(b)
        files.append((x, y, len(b), len(gzip.compress(b, 6))))
json.dump({"z": Z, "bbox": BBOX, "tiles": [[f[0], f[1]] for f in files], "layers": list(layers)}, open(f"{OUT}/index.json", "w", encoding="utf-8"), ensure_ascii=False)
print(f"タイル {len(files)} 枚・合計 {sum(f[2] for f in files)/1024:.0f}KB（gzip {sum(f[3] for f in files)/1024:.0f}KB）")
print("層ごと（非圧縮）:", {k: f"{v/1024:.0f}KB" for k, v in per.items()})
