# B3：OSMの登山道と、LANDMARKの尾根線（既定閾値）の交点を求め、交点近くの標高極小点を
#   候補（本物のコルらしき場所）として出す（新規）。
# 登山道の取得だけがLANDMARK非依存（B2と同じOverpass）。交点を出す段でLANDMARKの尾根線を使う
#   （B3は定義上「尾根線と交わる登山道」なので、これは基準セットの作成の一部であり、
#   LANDMARKのsaddleそのものは見ていない＝作業Cで初めて突き合わせる）。
#
# 使い方: .venv/Scripts/python.exe ref_b3_trails.py
import json, math, time
from datetime import datetime, timezone
import urllib.request
import numpy as np
import rasterio
import geopandas as gpd
from shapely.geometry import LineString, Point
from shapely.strtree import STRtree
from pyproj import Transformer

SITES = {
    "nantai": {"lat": 36.7651, "lon": 139.4909, "dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"},
               "full_dirs": {"30m": "out/nantai_30m_full", "10m": "out/nantai_10m_full"},
               "stem": {"30m": "nantai_30m", "10m": "nantai_10m"}},
    "jonen": {"lat": 36.33341, "lon": 137.72752, "dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"},
              "full_dirs": {"30m": "out/jonen_30m_full", "10m": "out/jonen_10m_full"},
              "stem": {"30m": "jonen_30m_gsi", "10m": "jonen_10m_gsi"}},
}
HALF_M = 3000
EP = "https://overpass-api.de/api/interpreter"
UA = "foehn-landmark-probe (experiments/landmark)"
SEARCH_RADIUS_M = 100  # 交点近くで標高極小点を探す半径
CROSS_ANGLE_MIN = 60   # これ以上なら「横切る」とみなす角度（度）
ALONG_ANGLE_MAX = 30   # これ以下なら「沿って歩く」とみなす角度（度）
DEDUPE_M = 30           # 近い交点はまとめる距離


def seg_bearing(line, point, eps=1e-6):
    """LineString上のpoint付近の向き（度・0-180に畳む）"""
    coords = list(line.coords)
    best_d, best_i = 1e18, 0
    for i in range(len(coords) - 1):
        seg = LineString([coords[i], coords[i + 1]])
        d = seg.distance(point)
        if d < best_d:
            best_d, best_i = d, i
    (x0, y0), (x1, y1) = coords[best_i], coords[best_i + 1]
    ang = math.degrees(math.atan2(y1 - y0, x1 - x0)) % 180
    return ang


def angle_diff(a, b):
    d = abs(a - b) % 180
    return min(d, 180 - d)


def bbox_latlon(lat, lon, half_m):
    dlat = half_m / 111320
    dlon = half_m / (111320 * math.cos(math.radians(lat)))
    return lat - dlat, lon - dlon, lat + dlat, lon + dlon


def fetch_trails(lat, lon):
    s, w, n, e = bbox_latlon(lat, lon, HALF_M)
    q = (f'[out:json][timeout:60];'
         f'way["highway"~"^(path|footway)$"]({s},{w},{n},{e});'
         f'out geom;')
    req = urllib.request.Request(EP, data=("data=" + q).encode("utf-8"), headers={"User-Agent": UA})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                data = json.loads(r.read().decode("utf-8"))
            return data.get("elements", [])
        except Exception as ex:
            print(f"  取得失敗（{attempt+1}回目）: {ex}")
            time.sleep(15 * (attempt + 1))
    raise RuntimeError("Overpassの取得に失敗（リトライ上限）")


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
        crs = d.crs
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell, crs


def sample_dem(h, transform, x, y):
    col = int(round((x - transform.c) / transform.a))
    row = int(round((y - transform.f) / transform.e))
    if 0 <= row < h.shape[0] and 0 <= col < h.shape[1]:
        v = h[row, col]
        return float(v) if np.isfinite(v) else None
    return None


def reconstruct_lines(gdf, group_col):
    """elementaryな2点線分をgroup_colでつないで連続したLineStringにする（nodata_boundary_checkと同じ方式）"""
    lines = {}
    for _, row in gdf.iterrows():
        gid = row[group_col]
        xs, ys = row.geometry.xy
        lines.setdefault(gid, []).append(((xs[0], ys[0]), (xs[1], ys[1])))
    result = {}
    for gid, segs in lines.items():
        pts = [segs[0][0], segs[0][1]]
        remaining = segs[1:]
        changed = True
        while remaining and changed:
            changed = False
            for i, (a, b) in enumerate(remaining):
                if a == pts[-1]:
                    pts.append(b); remaining.pop(i); changed = True; break
                elif b == pts[-1]:
                    pts.append(a); remaining.pop(i); changed = True; break
                elif a == pts[0]:
                    pts.insert(0, b); remaining.pop(i); changed = True; break
                elif b == pts[0]:
                    pts.insert(0, a); remaining.pop(i); changed = True; break
        result[gid] = LineString(pts) if len(pts) >= 2 else None
    return result


def local_min_along_ridge(h, transform, ridge_line, cross_point, radius_m):
    """交点から、尾根線に沿って±radius_m以内（弧長）の標高極小点を探す（谷側に落ちないよう、
    正方形の窓ではなく尾根線そのものの上だけを見る）"""
    if ridge_line is None:
        return None
    s0 = ridge_line.project(cross_point)
    length = ridge_line.length
    ss = np.arange(max(0, s0 - radius_m), min(length, s0 + radius_m), max(1.0, transform.a / 2))
    if len(ss) == 0:
        ss = [s0]
    best = None
    for s in ss:
        p = ridge_line.interpolate(s)
        z = sample_dem(h, transform, p.x, p.y)
        if z is None:
            continue
        if best is None or z < best[2]:
            best = (p.x, p.y, z)
    if best is None:
        return None
    return {"x": float(best[0]), "y": float(best[1]), "z": float(best[2])}


def main():
    out = {"fetched_at_utc": datetime.now(timezone.utc).isoformat(),
           "source": f"OpenStreetMap highway=path/footway via Overpass API ({EP})", "sites": {}}

    for site, info in SITES.items():
        print(f"=== {site}：登山道を取得 ===")
        elements = fetch_trails(info["lat"], info["lon"])
        ways = [el for el in elements if el.get("type") == "way" and el.get("geometry")]
        print(f"way(path/footway): {len(ways)}本")
        time.sleep(2)

        site_out = {"n_trail_ways": len(ways), "res": {}}
        for res in ["30m", "10m"]:
            h, transform, cell, crs = load_dem(info["dems"][res])
            to_crs = Transformer.from_crs(4326, crs, always_xy=True)

            trail_lines = []
            for w in ways:
                pts = [to_crs.transform(pt["lon"], pt["lat"]) for pt in w["geometry"]]
                if len(pts) >= 2:
                    trail_lines.append(LineString(pts))

            ridges = gpd.read_file(f"{info['full_dirs'][res]}/ridgelines_se_HSO_{info['stem'][res]}.gpkg.gpkg")
            ridges_f = ridges[ridges["A_spread"] >= 1e5]
            ridge_geoms = list(ridges_f.geometry)
            ridge_id_rdl = list(ridges_f["id_rdl"])
            tree = STRtree(ridge_geoms) if ridge_geoms else None
            # 尾根の連続線（id_rdlでつなぎ直す）：交点近くの探索を「尾根線の上だけ」に限るため
            continuous = reconstruct_lines(ridges_f, "id_rdl")

            raw_points = []  # (Point, trail_line, ridge_geom, id_rdl)
            if tree is not None:
                for tl in trail_lines:
                    idxs = tree.query(tl, predicate="intersects")
                    for i in idxs:
                        rg = ridge_geoms[i]
                        inter = tl.intersection(rg)
                        pts = []
                        if inter.is_empty:
                            continue
                        if inter.geom_type == "Point":
                            pts = [inter]
                        elif inter.geom_type == "MultiPoint":
                            pts = list(inter.geoms)
                        for p in pts:
                            raw_points.append((p, tl, rg, ridge_id_rdl[i]))

            # 角度で分類：横切る(cross)・沿って歩く(along)・どちらでもない(ambiguous)
            classified = {"cross": [], "along": [], "ambiguous": []}
            for p, tl, rg, gid in raw_points:
                a_trail = seg_bearing(tl, p)
                a_ridge = seg_bearing(rg, p)
                diff = angle_diff(a_trail, a_ridge)
                kind = "cross" if diff >= CROSS_ANGLE_MIN else ("along" if diff <= ALONG_ANGLE_MAX else "ambiguous")
                classified[kind].append((p, diff, gid))

            # cross のみ、近い点をまとめて代表点にする（id_rdlも保持）
            dedup = []  # (Point, gid)
            for p, _, gid in classified["cross"]:
                if all(p.distance(q) > DEDUPE_M for q, _ in dedup):
                    dedup.append((p, gid))

            to_wgs = Transformer.from_crs(crs, 4326, always_xy=True)
            candidates = []
            for p, gid in dedup:
                ridge_line = continuous.get(gid)
                m = local_min_along_ridge(h, transform, ridge_line, p, SEARCH_RADIUS_M)
                if m:
                    mlon, mlat = to_wgs.transform(m["x"], m["y"])
                    candidates.append({"cross_x": p.x, "cross_y": p.y, "min_x": m["x"], "min_y": m["y"],
                                        "min_z": m["z"], "min_lon": mlon, "min_lat": mlat, "id_rdl": int(gid)})
            print(f"  {res}: 生の交点{len(raw_points)}件 → 横切る{len(classified['cross'])}"
                  f"（重複整理後{len(dedup)}）・沿う{len(classified['along'])}・曖昧{len(classified['ambiguous'])}")
            site_out["res"][res] = {
                "n_raw_intersections": len(raw_points), "n_cross_raw": len(classified["cross"]),
                "n_cross_dedup": len(dedup), "n_along": len(classified["along"]),
                "n_ambiguous": len(classified["ambiguous"]), "n_intersections": len(candidates),
                "candidates": candidates,
            }

        out["sites"][site] = site_out

    with open("out/ref_b3_trails.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("\n書いた: out/ref_b3_trails.json")


if __name__ == "__main__":
    main()
