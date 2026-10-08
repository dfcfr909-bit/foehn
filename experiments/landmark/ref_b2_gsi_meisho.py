# B2：地理院の地名データ（乗越・峠・コル・鞍部・のたわ）を範囲内で全件取得する（新規）。
# 情報源：国土地理院 電子国土基本図（地名情報）の最適化ベクトルタイル experimental_bvmap の
#   "label" レイヤー（knj=漢字表記）。bbox×部分一致で検索できる実用APIが無いため、
#   範囲を覆うタイルを全部取得してデコードし、キーワードで絞り込む方式にした。
# LANDMARKの出力は見ずに作る。
#
# 使い方: .venv/Scripts/python.exe ref_b2_gsi_meisho.py
import json, math, time
from datetime import datetime, timezone
import urllib.request
import mapbox_vector_tile

SITES = {
    "nantai": {"lat": 36.7651, "lon": 139.4909},
    "jonen": {"lat": 36.33341, "lon": 137.72752},
}
HALF_M = 3000
ZOOM = 14
EXTENT = 4096
KEYWORDS = ["乗越", "峠", "コル", "鞍部", "のたわ"]
UA = "foehn-landmark-probe (experiments/landmark)"


def bbox_latlon(lat, lon, half_m):
    dlat = half_m / 111320
    dlon = half_m / (111320 * math.cos(math.radians(lat)))
    return lat - dlat, lon - dlon, lat + dlat, lon + dlon


def latlon_to_tile(lat, lon, z):
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    lat_rad = math.radians(lat)
    y = int((1 - math.log(math.tan(lat_rad) + 1 / math.cos(lat_rad)) / math.pi) / 2 * n)
    return x, y


def tile_px_to_lonlat(tx, ty, z, px, py, extent=EXTENT):
    n = 2 ** z
    lon = (tx + px / extent) / n * 360 - 180
    yy = math.pi - 2 * math.pi * (ty + py / extent) / n
    lat = math.degrees(math.atan(math.sinh(yy)))
    return lon, lat


def fetch_tile(z, x, y):
    url = f"https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{z}/{x}/{y}.pbf"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return mapbox_vector_tile.decode(r.read())
    except Exception:
        return None


def main():
    now = datetime.now(timezone.utc).isoformat()
    out = {
        "fetched_at_utc": now,
        "source": f"国土地理院 電子国土基本図（地名情報）最適化ベクトルタイル experimental_bvmap（z{ZOOM}・labelレイヤー）",
        "keywords": KEYWORDS, "sites": {},
    }
    for site, c in SITES.items():
        s, w, n_, e = bbox_latlon(c["lat"], c["lon"], HALF_M)
        x0, y0 = latlon_to_tile(n_, w, ZOOM)  # 北西
        x1, y1 = latlon_to_tile(s, e, ZOOM)   # 南東
        print(f"=== {site}: z{ZOOM} x[{x0},{x1}] y[{y0},{y1}] ===")
        hits = []
        seen = set()
        n_tiles = 0
        for tx in range(x0, x1 + 1):
            for ty in range(y0, y1 + 1):
                n_tiles += 1
                t = fetch_tile(ZOOM, tx, ty)
                if not t or "label" not in t:
                    continue
                for f in t["label"]["features"]:
                    knj = f["properties"].get("knj", "")
                    if not knj or not any(k in knj for k in KEYWORDS):
                        continue
                    geom = f["geometry"]
                    if geom["type"] != "Point":
                        continue
                    px, py = geom["coordinates"]
                    lon, lat = tile_px_to_lonlat(tx, ty, ZOOM, px, py)
                    key = (knj, round(lat, 5), round(lon, 5))
                    if key in seen:
                        continue
                    seen.add(key)
                    hits.append({"name": knj, "lat": lat, "lon": lon, "ftCode": f["properties"].get("ftCode"),
                                 "annoCtg": f["properties"].get("annoCtg")})
                time.sleep(0.05)
        print(f"タイル{n_tiles}枚取得・該当地名{len(hits)}件")
        for h in hits:
            print(f"  - {h['name']} ({h['lat']:.5f},{h['lon']:.5f})")
        out["sites"][site] = {"bbox": [s, w, n_, e], "n_tiles": n_tiles, "n_hits": len(hits), "hits": hits}

    with open("out/ref_b2_gsi_meisho.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("\n書いた: out/ref_b2_gsi_meisho.json")


if __name__ == "__main__":
    main()
