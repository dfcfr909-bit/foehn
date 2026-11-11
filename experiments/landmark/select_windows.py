# 作業1-2：評価範囲（6km四方の窓）の選定（新規）。LANDMARK の出力は使わない。
#   入力: out/enum_candidates.json（enum_saddle_candidates.py の出力）
#   規則:
#     a. 「両方登録」（OSM ノード数で数える）が多い窓を上位から。窓同士・既存2窓と重ならない。
#        中心が 東北6県・新潟・栃木・群馬・長野 の外（地理院の逆ジオコーダで判定）の窓は除く
#     b. 既存の男体山・常念乗越（結果を流用）＋飛騨乗越の窓＋新規窓で、合計 TOTAL_WINDOWS 窓
#     c. 落差帯（30–100 / 100–300 / 300m+）の key col が、選んだ窓の合計で各帯 MIN_PER_BAND 件以上
#        （窓ごとではなく選定全体で数える。既存2窓の分も含める）。足りなければ入れ替える。
#        それでも足りなければ不足を報告する
#   B1 の key col は、窓の端・欠測境界から EDGE_M 以内のものを除いて数える
#   （端では峰どうしの本来のつながりが窓の外にあり、落差が過小に出るため）
#
# 使い方: .venv/Scripts/python.exe select_windows.py
import json, math, os, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor
import numpy as np
import rasterio
import urllib.request
from pyproj import Transformer

UTM = "EPSG:32654"
HALF_M = 3000.0
CELL_M = 500.0
POOL_N = 14
TOTAL_WINDOWS = 10
MIN_PER_BAND = 3
EDGE_M = 100.0
BANDS = [(30, 100), (100, 300), (300, 1e9)]
BAND_NAMES = ["30-100", "100-300", "300+"]
ALLOWED_PREF = {"02": "青森", "03": "岩手", "04": "宮城", "05": "秋田", "06": "山形", "07": "福島",
                "15": "新潟", "09": "栃木", "10": "群馬", "20": "長野"}
DEM_URL = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png"
UA = "foehn-landmark-probe (experiments/landmark)"
EXISTING = [  # 結果を流用する既存2窓（再計算しない）
    {"name": "nantai", "label": "男体山", "lat": 36.7651, "lon": 139.4909, "epsg": 6677,
     "dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"}},
    {"name": "jonen", "label": "常念乗越", "lat": 36.33341, "lon": 137.72752, "epsg": 32654,
     "dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"}},
]

to_utm = Transformer.from_crs(4326, UTM, always_xy=True)
to_ll = Transformer.from_crs(UTM, 4326, always_xy=True)


def prefecture(lat, lon):
    """地理院の逆ジオコーダで都道府県コード(2桁)を返す。取れなければ None"""
    url = f"https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?lat={lat}&lon={lon}"
    for i in range(3):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as r:
                d = json.loads(r.read().decode("utf-8"))
            m = d.get("results", {}).get("muniCd")
            return m[:2] if m else None
        except Exception:
            time.sleep(1 + i)
    return None


def box_of(lat, lon):
    x, y = to_utm.transform(lon, lat)
    return (x - HALF_M, y - HALF_M, x + HALF_M, y + HALF_M)


def overlap(a, b):
    return not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])


def rank_windows(enum):
    """500m格子の累積和で、6km窓（12×12格子）ごとの件数を数え、貪欲に重ならない窓を上位から並べる"""
    pts = []  # (x, y, kind)  kind: 'both_osm' | 'osm' | 'gsi'
    for o in enum["osm"]:
        x, y = to_utm.transform(o["lon"], o["lat"])
        pts.append((x, y, "both" if o["both"] else "osm"))
    for g in enum["gsi"]:
        x, y = to_utm.transform(g["lon"], g["lat"])
        pts.append((x, y, "gsi_both" if g["both"] else "gsi"))
    xs = np.array([p[0] for p in pts]); ys = np.array([p[1] for p in pts])
    x0, y0 = xs.min() - 1, ys.min() - 1
    nx = int((xs.max() - x0) // CELL_M) + 13
    ny = int((ys.max() - y0) // CELL_M) + 13

    def grid(kinds):
        g = np.zeros((ny, nx), dtype=np.int32)
        for x, y, k in pts:
            if k in kinds:
                g[int((y - y0) // CELL_M), int((x - x0) // CELL_M)] += 1
        return g

    def slide(g):
        c = np.zeros((ny + 1, nx + 1), dtype=np.int64)
        c[1:, 1:] = g.cumsum(0).cumsum(1)
        w = int(2 * HALF_M / CELL_M)
        return c[w:, w:] - c[:-w, w:] - c[w:, :-w] + c[:-w, :-w]  # 窓の左下=(iy,ix)

    s_both = slide(grid({"both"}))
    s_osm = slide(grid({"both", "osm"}))
    s_gsi = slide(grid({"gsi", "gsi_both"}))
    cand = np.argwhere(s_both > 0)
    rows = []
    for iy, ix in cand:
        rows.append({"n_both": int(s_both[iy, ix]), "n_osm": int(s_osm[iy, ix]), "n_gsi": int(s_gsi[iy, ix]),
                     "box": (x0 + ix * CELL_M, y0 + iy * CELL_M, x0 + ix * CELL_M + 2 * HALF_M, y0 + iy * CELL_M + 2 * HALF_M)})
    rows.sort(key=lambda r: (-r["n_both"], -(r["n_osm"] + r["n_gsi"]), r["box"][1], r["box"][0]))
    return rows


def count_in(enum, box):
    cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    lon, lat = to_ll.transform(cx, cy)
    n = {"n_both": 0, "n_osm": 0, "n_gsi": 0}
    for o in enum["osm"]:
        x, y = to_utm.transform(o["lon"], o["lat"])
        if box[0] <= x < box[2] and box[1] <= y < box[3]:
            n["n_osm"] += 1
            n["n_both"] += bool(o["both"])
    for g in enum["gsi"]:
        x, y = to_utm.transform(g["lon"], g["lat"])
        if box[0] <= x < box[2] and box[1] <= y < box[3]:
            n["n_gsi"] += 1
    return n


def fetch_dem(name, lat, lon, zoom, out):
    if os.path.exists(out):
        return
    r = subprocess.run([sys.executable, "fetchGsiDem.py", str(lat), str(lon), str(HALF_M), str(zoom), DEM_URL, out, UTM],
                       capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError(f"DEM取得失敗 {name} z{zoom}: {r.stderr[-400:]}")


def b1_band_counts(dem_path):
    """窓のDEMから key col の落差帯別件数（端・欠測境界から EDGE_M 以内は除外）を数える"""
    from col_prominence import find_cols
    from scipy.ndimage import binary_dilation
    with rasterio.open(dem_path) as d:
        h = d.read(1); nod = d.nodata; cell = d.res[0]
    h = np.where(h == nod, np.nan, h)
    bad = ~np.isfinite(h)
    k = int(math.ceil(EDGE_M / cell))
    bad_d = binary_dilation(bad, iterations=k)
    bad_d[:k, :] = True; bad_d[-k:, :] = True; bad_d[:, :k] = True; bad_d[:, -k:] = True
    cols = find_cols(h, cell)
    counts = [0, 0, 0]
    for c in cols:
        if bad_d[c["row"], c["col"]]:
            continue
        for i, (lo, hi) in enumerate(BANDS):
            if lo <= c["prom"] < hi:
                counts[i] += 1
    return counts, float(bad.mean())


def _job(args):
    name, path = args
    return name, b1_band_counts(path)


def main():
    with open("out/enum_candidates.json", encoding="utf-8") as f:
        enum = json.load(f)
    print(f"列挙: OSM {enum['n_osm']}件・地理院 {enum['n_gsi']}件・両方登録(OSM側) {sum(o['both'] for o in enum['osm'])}件")

    existing_boxes = [box_of(e["lat"], e["lon"]) for e in EXISTING]

    # --- 飛騨乗越（規則に関係なく候補に含める） ---
    hida = [("OSM", o) for o in enum["osm"] if o.get("name") and "飛騨乗越" in o["name"]] + \
           [("GSI", g) for g in enum["gsi"] if "飛騨乗越" in g["name"]]
    forced = None
    if hida:
        src, h = hida[0]
        forced_box = box_of(h["lat"], h["lon"])
        forced = {"name": "hida", "label": "飛騨乗越", "lat": h["lat"], "lon": h["lon"], "box": forced_box,
                  "reason": f"飛騨乗越（{src}登録・{len(hida)}件ヒット）を含む窓（規則に関係なく含める）", **count_in(enum, forced_box)}
        ov = [e["label"] for e, b in zip(EXISTING, existing_boxes) if overlap(b, forced_box)]
        if ov:
            forced["overlaps_existing"] = ov
        print(f"飛騨乗越: {[(s, x['name'], round(x['lat'],5), round(x['lon'],5)) for s, x in hida]}")
    else:
        print("飛騨乗越: OSM・地理院のどちらにも名称ヒット無し（座標を推測しないので窓は作らない）")

    # --- 貪欲に重ならない上位窓（プール）を作る ---
    ranked = rank_windows(enum)
    print(f"両方登録>=1 の窓候補（格子上）: {len(ranked)}")
    pool = []
    taken = list(existing_boxes) + ([forced["box"]] if forced else [])
    n_pref_skip = 0
    for r in ranked:
        if len(pool) >= POOL_N:
            break
        if any(overlap(r["box"], b) for b in taken):
            continue
        cx, cy = (r["box"][0] + r["box"][2]) / 2, (r["box"][1] + r["box"][3]) / 2
        lon, lat = to_ll.transform(cx, cy)
        pc = prefecture(lat, lon)
        if pc not in ALLOWED_PREF:
            n_pref_skip += 1
            continue
        r.update({"lat": lat, "lon": lon, "pref": ALLOWED_PREF[pc]})
        pool.append(r)
        taken.append(r["box"])
    print(f"プール {len(pool)}窓（対象県外で除外した上位候補 {n_pref_skip}）")
    for i, p in enumerate(pool):
        p["name"] = f"w{i+1:02d}"

    # --- プール窓のDEM(10m)を取り、B1 の落差帯別件数を数える（規則 c 用） ---
    os.makedirs("data", exist_ok=True)
    allw = pool + ([forced] if forced else [])
    for w in allw:
        if "lat" not in w:
            continue
        if w["name"] == "hida":
            pass
        cx, cy = ((w["box"][0] + w["box"][2]) / 2, (w["box"][1] + w["box"][3]) / 2)
        lon, lat = to_ll.transform(cx, cy)
        w["center_lat"], w["center_lon"] = lat, lon
        fetch_dem(w["name"], lat, lon, 14, f"data/{w['name']}_10m.tif")
    with ProcessPoolExecutor(6) as ex:
        res = dict(ex.map(_job, [(w["name"], f"data/{w['name']}_10m.tif") for w in allw]))
    for w in allw:
        counts, nodata_frac = res[w["name"]]
        w["b1_counts"] = dict(zip(BAND_NAMES, counts))
        w["nodata_frac"] = nodata_frac

    # 既存2窓の B1（同じ端の除外で数える）
    ex_rows = []
    for e in EXISTING:
        counts, nf = b1_band_counts(e["dems"]["10m"])
        ex_rows.append({"name": e["name"], "label": e["label"], "b1_counts": dict(zip(BAND_NAMES, counts))})

    # --- 選定：飛騨乗越(あれば)＋プール上位を、合計 TOTAL_WINDOWS 窓まで。規則 c で入れ替え ---
    n_new = TOTAL_WINDOWS - len(EXISTING)
    selected = ([forced] if forced else [])
    for p in pool:
        if len(selected) >= n_new:
            break
        p["reason"] = "規則a（両方登録の件数の上位）"
        selected.append(p)

    def totals(sel):
        t = {b: 0 for b in BAND_NAMES}
        for w in sel:
            for b in BAND_NAMES:
                t[b] += w["b1_counts"][b]
        for e in ex_rows:
            for b in BAND_NAMES:
                t[b] += e["b1_counts"][b]
        return t

    swaps = []
    for _ in range(20):
        t = totals(selected)
        short = [b for b in BAND_NAMES if t[b] < MIN_PER_BAND]
        if not short:
            break
        b = min(short, key=lambda b: t[b])
        unsel = [p for p in pool if p not in selected]
        if not unsel:
            break
        add = max(unsel, key=lambda p: (p["b1_counts"][b], p["n_both"]))
        if add["b1_counts"][b] == 0:
            break
        # 外す窓：forced 以外で「両方登録」が最少、かつ外しても他の帯が MIN_PER_BAND を割らない
        removable = []
        for w in selected:
            if w is forced:
                continue
            t2 = dict(t)
            for bb in BAND_NAMES:
                t2[bb] += add["b1_counts"][bb] - w["b1_counts"][bb]
            if all(t2[bb] >= min(MIN_PER_BAND, t[bb]) for bb in BAND_NAMES):
                removable.append(w)
        if not removable:
            break
        rem = min(removable, key=lambda w: (w["n_both"], w["n_osm"] + w["n_gsi"]))
        selected.remove(rem)
        add["reason"] = f"規則c（{b}帯の不足を補うため {rem['name']} と入れ替え）"
        selected.append(add)
        swaps.append({"added": add["name"], "removed": rem["name"], "band": b})

    t = totals(selected)
    short = [b for b in BAND_NAMES if t[b] < MIN_PER_BAND]

    # --- 選定した窓の都道府県（forced も含めて確認） ---
    for w in selected:
        if "pref" not in w:
            pc = prefecture(w["center_lat"], w["center_lon"])
            w["pref"] = ALLOWED_PREF.get(pc, f"対象県外({pc})")

    out = {
        "params": {"half_m": HALF_M, "cell_m": CELL_M, "pool_n": POOL_N, "total_windows": TOTAL_WINDOWS,
                   "min_per_band": MIN_PER_BAND, "edge_m": EDGE_M, "utm": UTM},
        "hida": [{"src": s, "name": x["name"], "lat": x["lat"], "lon": x["lon"]} for s, x in hida],
        "existing": [{**e, **{"b1_counts": r["b1_counts"]}} for e, r in zip(EXISTING, ex_rows)],
        "pool": [{k: v for k, v in p.items()} for p in pool],
        "forced": forced,
        "selected": selected, "swaps": swaps,
        "band_totals": t, "band_short": short,
    }
    with open("out/windows_selected.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1, default=str)

    print("\n=== プール（両方登録の上位）===")
    for p in pool:
        mark = "★選定" if p in selected else ""
        print(f"{p['name']} ({p['center_lat']:.4f},{p['center_lon']:.4f}) {p['pref']} 両方登録={p['n_both']} OSM={p['n_osm']} GSI={p['n_gsi']} "
              f"B1={p['b1_counts']} 欠測{p['nodata_frac']*100:.1f}% {mark}")
    print("\n=== 選定 ===")
    for w in selected:
        print(f"{w['name']} {w.get('label','')} ({w['center_lat']:.4f},{w['center_lon']:.4f}) {w['pref']} "
              f"両方登録={w['n_both']} OSM={w['n_osm']} GSI={w['n_gsi']} B1={w['b1_counts']} 理由={w['reason']}")
    for e in ex_rows:
        print(f"[既存] {e['label']} B1={e['b1_counts']}")
    print(f"\n落差帯の合計（既存含む）: {t}  不足: {short or 'なし'}  入れ替え: {swaps}")


if __name__ == "__main__":
    main()
