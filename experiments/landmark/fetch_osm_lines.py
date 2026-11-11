# 尾根・沢の評価の基準（OSM）を窓ごとに取得する（新規）。LANDMARK・現行方式の出力は見ない。
#   waterway=river/stream（沢）、natural=ridge/arete（尾根）、水面（natural=water・waterway=riverbank・landuse=reservoir）
#   窓の範囲＋500m の矩形で Overpass に投げ、幾何（out geom）ごと保存する。取得元・日時・件数を記録する。
# 使い方: .venv/Scripts/python.exe fetch_osm_lines.py
import json, os, time, urllib.request, urllib.parse
from datetime import datetime, timezone
from pyproj import Transformer
from eval_windows import load_windows, load_dem

EP = "https://overpass-api.de/api/interpreter"
UA = "foehn-landmark-probe (experiments/landmark)"
MARGIN_M = 500.0


def window_bbox(w):
    h, tr, cell, crs = load_dem(w["dems"]["10m"])
    x0, x1 = tr.c - MARGIN_M, tr.c + tr.a * h.shape[1] + MARGIN_M
    y1, y0 = tr.f + MARGIN_M, tr.f + tr.e * h.shape[0] - MARGIN_M
    t = Transformer.from_crs(w["epsg"], 4326, always_xy=True)
    pts = [t.transform(x, y) for x, y in [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]]
    return min(p[1] for p in pts), min(p[0] for p in pts), max(p[1] for p in pts), max(p[0] for p in pts)


def _post(q):
    for a in range(6):
        try:
            req = urllib.request.Request(EP, data=("data=" + urllib.parse.quote(q)).encode(), headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.loads(r.read().decode("utf-8"))
        except Exception as ex:
            print("  失敗", a + 1, ex, flush=True); time.sleep(30 * (a + 1))
    raise RuntimeError("Overpass 取得失敗")


def fetch(bb):
    """重いと 504 になる窓があったので、線状の地物と水面の2回に分けて取る"""
    s, w, n, e = bb
    q1 = (f'[out:json][timeout:90];(way["waterway"~"^(river|stream)$"]({s},{w},{n},{e});'
          f'way["natural"~"^(ridge|arete)$"]({s},{w},{n},{e}););out geom;')
    q2 = (f'[out:json][timeout:90];(way["natural"="water"]({s},{w},{n},{e});relation["natural"="water"]({s},{w},{n},{e});'
          f'way["waterway"="riverbank"]({s},{w},{n},{e});way["landuse"="reservoir"]({s},{w},{n},{e}););out geom;')
    d1 = _post(q1); time.sleep(3); d2 = _post(q2)
    return {"elements": d1.get("elements", []) + d2.get("elements", [])}


def main():
    log = {"source": f"OpenStreetMap via Overpass API ({EP})", "windows": {}}
    for w in load_windows():
        path = f"out/osm_lines_{w['name']}.json"
        if os.path.exists(path):   # 取得済みの窓は飛ばす（再開用）
            rec = json.load(open(path, encoding="utf-8")); els = rec["elements"]; now = rec["fetched_at_utc"]
            d = {"elements": els}; bb = rec["bbox"]
        else:
            bb = window_bbox(w)
            d = fetch(bb)
        els = d.get("elements", [])
        if not os.path.exists(path):
            now = datetime.now(timezone.utc).isoformat()
            rec = {"fetched_at_utc": now, "bbox": bb, "elements": els}
            json.dump(rec, open(path, "w", encoding="utf-8"), ensure_ascii=False)
        def cnt(f): return sum(1 for e in els if f(e.get("tags", {})))
        c = {"waterway": cnt(lambda t: t.get("waterway") in ("river", "stream")),
             "ridge_arete": cnt(lambda t: t.get("natural") in ("ridge", "arete")),
             "water": cnt(lambda t: t.get("natural") == "water" or t.get("waterway") == "riverbank" or t.get("landuse") == "reservoir")}
        log["windows"][w["name"]] = {"fetched_at_utc": now, **c}
        print(w["name"], c, flush=True)
        time.sleep(4 if not os.path.exists(path) else 0)
    json.dump(log, open("out/osm_lines_summary.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
