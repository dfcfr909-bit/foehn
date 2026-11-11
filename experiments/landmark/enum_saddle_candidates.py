# 作業1-1：鞍部候補の列挙（新規）。LANDMARK の出力は一切使わない。
#   OSM（Overpass）: natural=saddle / mountain_pass=yes のノードを範囲内で全件取得
#   地理院: 電子国土基本図（最適化ベクトルタイル experimental_bvmap・z14・labelレイヤー）のうち、
#           名称に 乗越・峠・コル・鞍部・のたわ を含む Point 地物
#   両方登録: OSM と地理院が 100m 以内にある組（名称一致は使わない）
#
# 対象範囲：東北・新潟・栃木・群馬・長野を覆う矩形（下記 REGION）のうち、山岳域だけ。
#   山岳域 = 地理院 DEM z10 タイル（約150m/画素）で、z14 タイル1枚分の 16×16 画素ブロックの
#   最高標高が MOUNTAIN_MIN_M 以上の z14 タイル。平野・海の z14 タイルは取得しない
#   （取得枚数を約1/3に減らすための足切り。標高しきい値以外の恣意的な選別はしない）。
#   ⚠ 矩形なので富山・岐阜・山梨・埼玉・茨城・千葉の一部も含む。県の判定は窓の選定後に
#     地理院の逆ジオコーダで行う（select_windows.py）。
#
# 使い方: .venv/Scripts/python.exe enum_saddle_candidates.py
import io, json, math, time, sys
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import urllib.request, urllib.parse
import numpy as np
import mapbox_vector_tile
from PIL import Image

REGION = {"lat_min": 35.2, "lat_max": 41.6, "lon_min": 137.2, "lon_max": 142.1}
MOUNTAIN_MIN_M = 500.0
KEYWORDS = ["乗越", "峠", "コル", "鞍部", "のたわ"]
Z_LABEL = 14
Z_PRE = 10
EXTENT = 4096
UA = "foehn-landmark-probe (experiments/landmark)"
OVERPASS = "https://overpass-api.de/api/interpreter"
BOTH_M = 100.0


def http_get(url, timeout=30, retries=3):
    last = None
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None  # タイル無し（範囲外・海）
            last = e
        except Exception as e:
            last = e
        time.sleep(1 + i)
    raise RuntimeError(f"取得失敗 {url}: {last}")


def lonlat_to_tile(lon, lat, z):
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    lr = math.radians(lat)
    y = int((1 - math.log(math.tan(lr) + 1 / math.cos(lr)) / math.pi) / 2 * n)
    return x, y


def tile_px_to_lonlat(tx, ty, z, px, py, extent):
    n = 2 ** z
    lon = (tx + px / extent) / n * 360 - 180
    yy = math.pi - 2 * math.pi * (ty + py / extent) / n
    return lon, math.degrees(math.atan(math.sinh(yy)))


def haversine_m(lat1, lon1, lat2, lon2):
    p = math.pi / 180
    a = math.sin((lat2 - lat1) * p / 2) ** 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin((lon2 - lon1) * p / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(a))


# ---------------- OSM ----------------
def fetch_osm():
    """緯度を0.8°刻みに分割して Overpass に投げる（1回の応答を小さくして timeout を避ける）"""
    elements = {}
    lat = REGION["lat_min"]
    strips = []
    while lat < REGION["lat_max"] - 1e-9:
        strips.append((lat, min(lat + 0.8, REGION["lat_max"])))
        lat += 0.8
    for s, n in strips:
        w, e = REGION["lon_min"], REGION["lon_max"]
        q = (f'[out:json][timeout:120];(node["natural"="saddle"]({s},{w},{n},{e});'
             f'node["mountain_pass"="yes"]({s},{w},{n},{e}););out body;')
        for attempt in range(4):
            try:
                req = urllib.request.Request(OVERPASS, data=("data=" + urllib.parse.quote(q)).encode(), headers={"User-Agent": UA})
                with urllib.request.urlopen(req, timeout=180) as r:
                    data = json.loads(r.read().decode("utf-8"))
                break
            except Exception as ex:
                print(f"  Overpass 失敗（{attempt+1}回目）: {ex}")
                time.sleep(10 * (attempt + 1))
        else:
            raise RuntimeError(f"Overpass が取得できない: strip {s}-{n}")
        for el in data.get("elements", []):
            elements[el["id"]] = el
        print(f"  OSM strip lat {s:.1f}-{n:.1f}: {len(data.get('elements', []))}件（累計{len(elements)}）")
        time.sleep(3)
    return list(elements.values())


# ---------------- 地理院 ----------------
def mountain_tiles():
    """DEM z10 で最高標高 >= MOUNTAIN_MIN_M の z14 タイル (x,y) の一覧"""
    x0, y0 = lonlat_to_tile(REGION["lon_min"], REGION["lat_max"], Z_PRE)
    x1, y1 = lonlat_to_tile(REGION["lon_max"], REGION["lat_min"], Z_PRE)
    ratio = 2 ** (Z_LABEL - Z_PRE)  # 16
    blk = 256 // ratio  # 16画素

    def one(xy):
        x, y = xy
        b = http_get(f"https://cyberjapandata.gsi.go.jp/xyz/dem_png/{Z_PRE}/{x}/{y}.png")
        if b is None:
            return []
        im = np.array(Image.open(io.BytesIO(b)).convert("RGB")).astype(np.int64)
        v = im[:, :, 0] * 65536 + im[:, :, 1] * 256 + im[:, :, 2]
        nod = v == 8388608
        z = np.where(v < 8388608, v, v - 16777216) * 0.01
        z[nod] = -9999
        out = []
        for j in range(ratio):
            for i in range(ratio):
                if z[j * blk:(j + 1) * blk, i * blk:(i + 1) * blk].max() >= MOUNTAIN_MIN_M:
                    out.append((x * ratio + i, y * ratio + j))
        return out

    coords = [(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)]
    tiles = []
    with ThreadPoolExecutor(8) as ex:
        for r in ex.map(one, coords):
            tiles.extend(r)
    # 矩形の外にはみ出した分を落とす
    keep = []
    for tx, ty in tiles:
        lon, lat = tile_px_to_lonlat(tx, ty, Z_LABEL, EXTENT / 2, EXTENT / 2, EXTENT)
        if REGION["lat_min"] <= lat <= REGION["lat_max"] and REGION["lon_min"] <= lon <= REGION["lon_max"]:
            keep.append((tx, ty))
    return coords, keep


def fetch_gsi(tiles):
    def one(t):
        tx, ty = t
        b = http_get(f"https://cyberjapandata.gsi.go.jp/xyz/experimental_bvmap/{Z_LABEL}/{tx}/{ty}.pbf")
        if b is None:
            return t, [], False
        try:
            d = mapbox_vector_tile.decode(b)
        except Exception:
            return t, [], False
        hits = []
        for f in d.get("label", {}).get("features", []):
            p = f["properties"]
            knj = p.get("knj", "")
            if not knj or not any(k in knj for k in KEYWORDS):
                continue
            g = f["geometry"]
            if g["type"] != "Point":
                continue
            px, py = g["coordinates"]
            lon, lat = tile_px_to_lonlat(tx, ty, Z_LABEL, px, py, EXTENT)
            hits.append({"name": knj, "lat": lat, "lon": lon, "ftCode": p.get("ftCode"), "annoCtg": p.get("annoCtg")})
        return t, hits, True

    feats, n_ok, n_fail = [], 0, 0
    with ThreadPoolExecutor(12) as ex:
        for i, (t, hits, ok) in enumerate(ex.map(one, tiles)):
            feats.extend(hits)
            n_ok += ok
            n_fail += (not ok)
            if (i + 1) % 2000 == 0:
                print(f"  GSI {i+1}/{len(tiles)}枚・地物{len(feats)}件")
    # タイル境界の重複除去（同名・30m以内）
    feats.sort(key=lambda h: (h["name"], h["lat"], h["lon"]))
    uniq = []
    for h in feats:
        if uniq and uniq[-1]["name"] == h["name"] and haversine_m(uniq[-1]["lat"], uniq[-1]["lon"], h["lat"], h["lon"]) < 30:
            continue
        uniq.append(h)
    return uniq, n_ok, n_fail


def mark_both(osm_pts, gsi_pts):
    """OSM と地理院が BOTH_M 以内 → 両方登録（名称は見ない）"""
    for o in osm_pts:
        o["gsi_within"] = []
    for g in gsi_pts:
        g["osm_within"] = []
    for oi, o in enumerate(osm_pts):
        for gi, g in enumerate(gsi_pts):
            if abs(o["lat"] - g["lat"]) > 0.002 or abs(o["lon"] - g["lon"]) > 0.003:
                continue
            d = haversine_m(o["lat"], o["lon"], g["lat"], g["lon"])
            if d <= BOTH_M:
                o["gsi_within"].append(gi)
                g["osm_within"].append(oi)
    for o in osm_pts:
        o["both"] = bool(o["gsi_within"])
    for g in gsi_pts:
        g["both"] = bool(g["osm_within"])


def main():
    now = datetime.now(timezone.utc).isoformat()
    print("== OSM（Overpass）==")
    osm_raw = fetch_osm()
    osm_pts = []
    for el in osm_raw:
        t = el.get("tags", {})
        osm_pts.append({"id": el["id"], "lat": el["lat"], "lon": el["lon"], "name": t.get("name"),
                        "ele": t.get("ele"), "natural": t.get("natural"), "mountain_pass": t.get("mountain_pass")})
    print(f"OSM 合計 {len(osm_pts)}件（natural=saddle {sum(1 for p in osm_pts if p['natural']=='saddle')}・"
          f"mountain_pass=yes {sum(1 for p in osm_pts if p['mountain_pass']=='yes')}）")

    print("== 地理院: 山岳域 z14 タイルの選定 ==")
    all_z10, tiles = mountain_tiles()
    print(f"z10 DEM タイル {len(all_z10)}枚 → 山岳域 z14 タイル {len(tiles)}枚（最高標高>={MOUNTAIN_MIN_M:.0f}m）")
    print("== 地理院: label 取得 ==")
    gsi_pts, n_ok, n_fail = fetch_gsi(tiles)
    print(f"z14 タイル 成功{n_ok}・失敗/無し{n_fail}・地物（重複除去後）{len(gsi_pts)}件")

    mark_both(osm_pts, gsi_pts)
    print(f"両方登録: OSM側 {sum(p['both'] for p in osm_pts)}件・地理院側 {sum(p['both'] for p in gsi_pts)}件")

    out = {
        "fetched_at_utc": now, "region": REGION, "mountain_min_m": MOUNTAIN_MIN_M,
        "sources": {
            "osm": f"OpenStreetMap via Overpass API ({OVERPASS})",
            "gsi": f"国土地理院 電子国土基本図 最適化ベクトルタイル experimental_bvmap z{Z_LABEL} labelレイヤー（knj）",
        },
        "keywords": KEYWORDS, "both_within_m": BOTH_M,
        "n_osm": len(osm_pts), "n_gsi": len(gsi_pts),
        "n_gsi_tiles_requested": len(tiles), "n_gsi_tiles_ok": n_ok, "n_gsi_tiles_missing": n_fail,
        "osm": osm_pts, "gsi": gsi_pts,
    }
    with open("out/enum_candidates.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print("書いた: out/enum_candidates.json")


if __name__ == "__main__":
    main()
