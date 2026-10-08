# 試作（栃木北部）：表示用の層を z10 のタイル（約30km四方）ごとの JSON に分ける（新規）。配信形式の試作。
#   形式：pilot/out/tiles/10/{x}/{y}.json = {"z":10,"x":..,"y":..,"layers":{層名:[[経度,緯度,経度,緯度,…], …]}}
#         座標は小数5桁（約1m）。線はタイルの境界で切る。
#         pilot/out/tiles/index.json に、タイルの一覧・bbox・層の名前と数字を書く。
#   層：LANDMARK（ridge_pruned・ridge_raw・valley_1e5・valley_1e6・valley_1e7）＋ 比較用の現行 terrainFlow の尾根（prod_ridge）
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない（public リポジトリ・測量法の確認中）。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/make_tiles.py
import gzip, json, math, os, pickle, shutil
import numpy as np
from pyproj import Transformer
from shapely.geometry import LineString, box
from prepare_dem import BBOX, UTM

Z = 10
OUT = "pilot/out/tiles"


def tile_of(lon, lat):
    n = 2 ** Z
    return int((lon + 180) / 360 * n), int((1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n)


def tile_box(x, y):
    n = 2 ** Z
    lon0 = x / n * 360 - 180; lon1 = (x + 1) / n * 360 - 180
    lat = lambda yy: math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * yy / n))))
    return box(lon0, lat(y + 1), lon1, lat(y))


def prod_layer():
    P = json.load(open("pilot/out/prod_ridges.json", encoding="utf-8"))
    m = P["meta"]
    to_ll = Transformer.from_crs(UTM, 4326, always_xy=True)
    bb = box(BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"])
    out = []
    for r in P["ridges"]:
        xs = m["x0"] + np.array(r["x"]) * m["a"]; ys = m["y0"] + np.array(r["y"]) * m["e"]
        if len(xs) < 2:
            continue
        lo, la = to_ll.transform(xs, ys)
        g = LineString(np.c_[lo, la]).intersection(bb)
        if g.is_empty:
            continue
        out.extend(p for p in (g.geoms if hasattr(g, "geoms") else [g]) if isinstance(p, LineString) and len(p.coords) >= 2)
    return out, P


def main():
    L = pickle.load(open("pilot/out/layers_m3.pkl", "rb"))
    layers = dict(L["layers"])
    layers["prod_ridge"], P = prod_layer()
    x0, y0 = tile_of(BBOX["lon0"], BBOX["lat1"]); x1, y1 = tile_of(BBOX["lon1"], BBOX["lat0"])
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    files, per_layer = [], {k: 0 for k in layers}
    for x in range(x0, x1 + 1):
        for y in range(y0, y1 + 1):
            tb = tile_box(x, y)
            doc = {"z": Z, "x": x, "y": y, "layers": {}}
            for name, lines in layers.items():
                arr = []
                for l in lines:
                    if not l.intersects(tb):
                        continue
                    g = l.intersection(tb)
                    for p in (g.geoms if hasattr(g, "geoms") else [g]):
                        if isinstance(p, LineString) and len(p.coords) >= 2:
                            arr.append([round(v, 5) for xy in p.coords for v in xy])
                doc["layers"][name] = arr
                per_layer[name] += len(json.dumps(arr, separators=(",", ":")))
            if not any(doc["layers"].values()):
                continue
            os.makedirs(f"{OUT}/{Z}/{x}", exist_ok=True)
            b = json.dumps(doc, separators=(",", ":")).encode()
            open(f"{OUT}/{Z}/{x}/{y}.json", "wb").write(b)
            files.append({"x": x, "y": y, "bytes": len(b), "gz": len(gzip.compress(b, 6)),
                          "lines": {k: len(v) for k, v in doc["layers"].items()}})
    idx = {"z": Z, "bbox": BBOX, "tiles": [[f["x"], f["y"]] for f in files],
           "layers": list(layers), "stats": L["stats"], "prod": {"nCols": P["nCols"], "bridged": P["bridged"], "ms": P["ms"]}}
    json.dump(idx, open(f"{OUT}/index.json", "w"), ensure_ascii=False, indent=1)
    tot = sum(f["bytes"] for f in files); gz = sum(f["gz"] for f in files)
    print(f"z{Z} タイル {len(files)} 枚（x {x0}〜{x1}・y {y0}〜{y1}）・合計 {tot/1024:.0f}KB・gzip {gz/1024:.0f}KB")
    for f in files:
        print(f"  {f['x']}/{f['y']}: {f['bytes']/1024:.0f}KB（gzip {f['gz']/1024:.0f}KB）線 {f['lines']}")
    print("層ごとの JSON の大きさ（全タイル合計・非圧縮）:", {k: f"{v/1024:.0f}KB" for k, v in per_layer.items()})


if __name__ == "__main__":
    main()
