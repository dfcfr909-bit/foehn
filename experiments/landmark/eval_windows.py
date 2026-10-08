# 作業2：複数窓での評価（新規）。B1（落差帯を5mまで拡張）とB2（母数を増やした外部データ）の Recall。
#   入力: out/windows_selected.json、out/enum_candidates.json、各窓の DEM と
#         out/{name}_{res}_saddles_depth.json（既存2窓は既存ファイルを流用）
#   判定: 距離50m以内 かつ 標高差5m以内 に LANDMARK saddle があれば「拾えた」（findings3 と同じ）
#   B1: 窓の端・欠測境界から EDGE_M 以内の key col は除外（端では落差が過小になるため）。
#       除外前の件数も JSON に残す。
#   ⚠ 落差の閾値スイープについて：saddle の「落差」は独立 Union-Find の最寄り col の prominence を
#     流用している（findings3 補足）。B1 の key col と同じ col を引くので、B1 の閾値スイープは
#     「落差T未満の本物の col を切り捨てるコスト」を示すもので、過剰検出を削る効果は示さない。
#     B1 で落差30m以上の col は T<=30 では原理的に消えないので、下限の判断材料にしない。
#   Precision は出さない（基準に抜けがあるため）。
#
# 使い方: .venv/Scripts/python.exe eval_windows.py
import json, math
import numpy as np
import rasterio
from pyproj import Transformer
from scipy.ndimage import binary_dilation
from col_prominence import find_cols

DIST_TH = 50.0
ELEV_TH = 5.0
NEAR_CAP = 200.0  # 距離・標高差の分布を出すときの最寄りsaddleの上限距離
EDGE_M = 100.0
FAR_M = 500.0     # B2：実座標(の代理)から離れているとみなす距離
PROM_MIN = 5.0
BANDS = [(5, 10), (10, 30), (30, 100), (100, 300), (300, 1e9)]
BAND_NAMES = ["5-10", "10-30", "30-100", "100-300", "300+"]
THRESHOLDS = [0, 1, 2, 5, 10, 20, 50]
FACILITY_WORDS = ["トンネル", "橋", "バス停", "温泉", "ダム", "駅", "小学校", "中学校", "郵便", "ホテル", "旅館",
                  "茶屋", "食堂", "スキー場", "ゲレンデ", "駐車場", "IC", "インター", "神社", "寺", "公園", "隧道"]


def load_windows():
    with open("out/windows_selected.json", encoding="utf-8") as f:
        sel = json.load(f)
    wins = []
    for e in sel["existing"]:
        wins.append({"name": e["name"], "label": e["label"], "epsg": e["epsg"], "dems": e["dems"],
                     "lat": e["lat"], "lon": e["lon"]})
    for w in sel["selected"]:
        wins.append({"name": w["name"], "label": w.get("label") or w["name"], "epsg": 32654,
                     "dems": {"10m": f"data/{w['name']}_10m.tif", "30m": f"data/{w['name']}_30m.tif"},
                     "lat": w["center_lat"], "lon": w["center_lon"]})
    return wins


def load_dem(path):
    with rasterio.open(path) as d:
        h = d.read(1); nod = d.nodata; tr = d.transform; cell = d.res[0]; crs = d.crs
    return np.where(h == nod, np.nan, h), tr, cell, crs


def edge_mask(h, cell):
    bad = ~np.isfinite(h)
    k = int(math.ceil(EDGE_M / cell))
    m = binary_dilation(bad, iterations=k)
    m[:k, :] = True; m[-k:, :] = True; m[:, :k] = True; m[:, -k:] = True
    return m


class SaddleIndex:
    """window×res の saddle を配列で持ち、最寄り検索を速くする"""
    def __init__(self, path):
        with open(path, encoding="utf-8") as f:
            s = json.load(f)
        self.x = np.array([a["x"] for a in s]); self.y = np.array([a["y"] for a in s])
        self.z = np.array([a["z"] for a in s])
        self.depth = np.array([np.nan if a["depth"] is None else a["depth"] for a in s])

    def hit(self, x, y, z, min_depth=None, unknown_pass=False, dist_th=DIST_TH, elev_th=ELEV_TH):
        d = np.hypot(self.x - x, self.y - y)
        ok = d <= dist_th
        if z is not None:
            ok &= np.abs(self.z - z) <= elev_th
        if min_depth is not None:
            known = np.isfinite(self.depth)
            cond = known & (self.depth >= min_depth)
            if unknown_pass:
                cond |= ~known
            ok &= cond
        return bool(ok.any())

    def nearest(self, x, y, z):
        d = np.hypot(self.x - x, self.y - y)
        i = int(np.argmin(d))
        return float(d[i]), float(abs(self.z[i] - z))


def pct(vals, p):
    return float(np.percentile(vals, p)) if len(vals) else None


def main():
    wins = load_windows()
    with open("out/enum_candidates.json", encoding="utf-8") as f:
        enum = json.load(f)

    b1 = {res: {b: {"n": 0, "hits": 0, "n_before_edge": 0, "dist": [], "dz": [],
                    "sweep": {t: 0 for t in THRESHOLDS}} for b in BAND_NAMES} for res in ["10m", "30m"]}
    b1_per_window = {}
    b2_rows = []   # 参照点ごとの結果
    b2_by_res = {}

    for w in wins:
        to_crs = Transformer.from_crs(4326, w["epsg"], always_xy=True)
        cols10 = None
        for res in ["10m", "30m"]:
            h, tr, cell, crs = load_dem(w["dems"][res])
            mask = edge_mask(h, cell)
            cols = find_cols(h, cell)
            cols = [c for c in cols if c["prom"] >= PROM_MIN]
            if res == "10m":
                cols10 = [(tr.c + (c["col"] + 0.5) * tr.a, tr.f + (c["row"] + 0.5) * tr.e, c["prom"], c["z"])
                          for c in cols if not mask[c["row"], c["col"]]]
            sad = SaddleIndex(f"out/{w['name']}_{res}_saddles_depth.json")
            per = {b: {"n": 0, "hits": 0} for b in BAND_NAMES}
            for c in cols:
                bi = next(i for i, (lo, hi) in enumerate(BANDS) if lo <= c["prom"] < hi)
                bn = BAND_NAMES[bi]
                b1[res][bn]["n_before_edge"] += 1
                if mask[c["row"], c["col"]]:
                    continue
                x = tr.c + (c["col"] + 0.5) * tr.a
                y = tr.f + (c["row"] + 0.5) * tr.e
                z = c["z"]
                b1[res][bn]["n"] += 1
                per[bn]["n"] += 1
                if sad.hit(x, y, z):
                    b1[res][bn]["hits"] += 1
                    per[bn]["hits"] += 1
                for t in THRESHOLDS:
                    if sad.hit(x, y, z, min_depth=t):
                        b1[res][bn]["sweep"][t] += 1
                dd, dz = sad.nearest(x, y, z)
                if dd <= NEAR_CAP:
                    b1[res][bn]["dist"].append(dd)
                    b1[res][bn]["dz"].append(dz)
            b1_per_window[f"{w['name']}_{res}"] = per

        # ---- B2 ----
        # 窓の範囲（10m DEM の外形）から EDGE_M 以内の参照点は除く
        h10, tr10, cell10, _ = load_dem(w["dems"]["10m"])
        x_min, x_max = tr10.c, tr10.c + tr10.a * h10.shape[1]
        y_max, y_min = tr10.f, tr10.f + tr10.e * h10.shape[0]
        refs = []
        for gi, g in enumerate(enum["gsi"]):
            x, y = to_crs.transform(g["lon"], g["lat"])
            if x_min + EDGE_M <= x <= x_max - EDGE_M and y_min + EDGE_M <= y <= y_max - EDGE_M:
                ele = None
                if g["osm_within"]:
                    e0 = enum["osm"][g["osm_within"][0]].get("ele")
                    ele = float(e0) if e0 and e0.replace(".", "", 1).isdigit() else None
                refs.append({"src": "両方" if g["both"] else "GSIのみ", "name": g["name"], "x": x, "y": y, "ele": ele,
                             "lat": g["lat"], "lon": g["lon"], "ftCode": g.get("ftCode"), "annoCtg": g.get("annoCtg"),
                             "has_pair": g["both"]})
        for o in enum["osm"]:
            x, y = to_crs.transform(o["lon"], o["lat"])
            if x_min + EDGE_M <= x <= x_max - EDGE_M and y_min + EDGE_M <= y <= y_max - EDGE_M:
                if o["both"]:
                    continue  # 「両方」は地理院側の行で数える（二重計上しない）
                ele = float(o["ele"]) if o.get("ele") and str(o["ele"]).replace(".", "", 1).isdigit() else None
                refs.append({"src": "OSMのみ", "name": o.get("name") or "(無名)", "x": x, "y": y, "ele": ele,
                             "lat": o["lat"], "lon": o["lon"], "ftCode": None, "annoCtg": None, "has_pair": False})
        # 両方登録の OSM 側は、地理院側の行に標高だけ引き継いである。位置は地理院側を使う
        cx = np.array([c[0] for c in cols10]); cy = np.array([c[1] for c in cols10])
        cp = np.array([c[2] for c in cols10])
        cz = np.array([c[3] for c in cols10])
        sel_c = cp >= 10
        for r in refs:
            if sel_c.any():
                d = np.hypot(cx[sel_c] - r["x"], cy[sel_c] - r["y"])
                r["near_col_dist"] = float(d.min())
                r["near_col_prom"] = float(cp[sel_c][int(np.argmin(d))])
            else:
                r["near_col_dist"] = None; r["near_col_prom"] = None
            r["far"] = r["near_col_dist"] is None or r["near_col_dist"] >= FAR_M
            r["facility_name"] = any(k in r["name"] for k in FACILITY_WORDS)
            r["window"] = w["name"]
            for res in ["10m", "30m"]:
                sad = SaddleIndex(f"out/{w['name']}_{res}_saddles_depth.json")
                rr = {"hit": sad.hit(r["x"], r["y"], r["ele"])}
                rr["sweep_excl"] = {t: sad.hit(r["x"], r["y"], r["ele"], min_depth=t) for t in THRESHOLDS}
                rr["sweep_pass"] = {t: sad.hit(r["x"], r["y"], r["ele"], min_depth=t, unknown_pass=True) for t in THRESHOLDS}
                r[res] = rr
        b2_rows.extend(refs)
        print(f"{w['name']} {w['label']}: B2参照点 {len(refs)}件（両方{sum(r['src']=='両方' for r in refs)}・"
              f"OSMのみ{sum(r['src']=='OSMのみ' for r in refs)}・GSIのみ{sum(r['src']=='GSIのみ' for r in refs)}）", flush=True)

    # ---------------- 出力 ----------------
    print("\n" + "=" * 70 + "\nB1：落差帯別 Recall（端除外後。n<10 の帯は参考値）\n" + "=" * 70)
    for res in ["30m", "10m"]:
        print(f"\n[{res}]  帯 / n（除外前） / 拾えた / Recall / 最寄りsaddle距離 中央値・p90(m) / 標高差 中央値・p90(m) (200m以内のn)")
        for bn in BAND_NAMES:
            r = b1[res][bn]
            rec = f"{r['hits']/r['n']*100:.0f}%" if r["n"] else "-"
            note = "（参考値 n<10）" if r["n"] < 10 else ""
            dm, d9 = pct(r["dist"], 50), pct(r["dist"], 90)
            zm, z9 = pct(r["dz"], 50), pct(r["dz"], 90)
            f = lambda v: f"{v:.1f}" if v is not None else "-"
            print(f"  {bn:>8}: n={r['n']:>4}（{r['n_before_edge']}） 拾えた={r['hits']:>4} {rec:>5}{note}  "
                  f"距離 {f(dm)}/{f(d9)}  標高差 {f(zm)}/{f(z9)} (n={len(r['dist'])})")
    print("\n" + "-" * 70 + "\nB1：落差の閾値スイープ（残存Recall＝落差T以上のsaddleだけ採用。不明落差は除外）")
    print("  ⚠ 落差T未満の本物のcolを切り捨てるコストを示す。過剰検出を削る効果は示さない。")
    print("  ⚠ 30m以上の帯は T<=30 で原理的に不変なので下限の判断材料にしない。判断材料は 5-10・10-30 帯のみ。")
    for res in ["30m", "10m"]:
        print(f"\n[{res}]  " + "  ".join(f">={t}m" for t in THRESHOLDS))
        for bn in BAND_NAMES:
            r = b1[res][bn]
            cells = "  ".join(f"{r['sweep'][t]}/{r['n']}" for t in THRESHOLDS)
            print(f"  {bn:>8}: {cells}")

    def b2_table(rows, label):
        print(f"\n[B2 {label}]")
        for res in ["30m", "10m"]:
            print(f"  {res}:")
            for src in ["両方", "OSMのみ", "GSIのみ", "全体"]:
                rs = [r for r in rows if src == "全体" or r["src"] == src]
                near = [r for r in rs if not r["far"]]
                far = [r for r in rs if r["far"]]
                def rec(x):
                    return f"{sum(r[res]['hit'] for r in x)}/{len(x)}" + (f"（{sum(r[res]['hit'] for r in x)/len(x)*100:.0f}%）" if x else "")
                print(f"    {src:>7}: 500m未満 {rec(near):>14} ／ 500m以上離れ {rec(far):>14}")

    print("\n" + "=" * 70 + "\nB2：Recall（母数を増やした外部データ）\n" + "=" * 70)
    b2_table(b2_rows, "全参照点")
    nf = [r for r in b2_rows if not r["facility_name"]]
    b2_table(nf, "施設名らしい名称(トンネル・橋・温泉 等)を除いた場合（感度確認）")

    print("\n" + "-" * 70 + "\nB2：落差の閾値スイープ（500m未満の参照点のみ）")
    for res in ["30m", "10m"]:
        for mode, key in [("落差不明を除外", "sweep_excl"), ("落差不明を通す", "sweep_pass")]:
            rs = [r for r in b2_rows if not r["far"]]
            cells = "  ".join(f">={t}m:{sum(r[res][key][t] for r in rs)}/{len(rs)}" for t in THRESHOLDS)
            print(f"  {res} {mode}: {cells}")

    print("\n" + "-" * 70 + "\nB2：実座標から500m以上離れた参照点（位置ずれの可能性）")
    far = [r for r in b2_rows if r["far"]]
    print(f"  件数 {len(far)}（両方{sum(r['src']=='両方' for r in far)}・OSMのみ{sum(r['src']=='OSMのみ' for r in far)}・"
          f"GSIのみ{sum(r['src']=='GSIのみ' for r in far)}）")
    print(f"  うち施設名らしい名称: {sum(r['facility_name'] for r in far)}件")
    for r in sorted(far, key=lambda r: (r["src"], r["name"])):
        nd = f"{r['near_col_dist']:.0f}m" if r["near_col_dist"] is not None else "-"
        print(f"    {r['window']} {r['src']:>6} {r['name']} 最寄りcol(落差>=10m) {nd} ftCode={r['ftCode']} annoCtg={r['annoCtg']} "
              f"{'施設名らしい' if r['facility_name'] else ''}")

    out = {
        "params": {"dist_th": DIST_TH, "elev_th": ELEV_TH, "edge_m": EDGE_M, "far_m": FAR_M, "near_cap": NEAR_CAP,
                   "prom_min": PROM_MIN, "bands": BAND_NAMES, "thresholds": THRESHOLDS},
        "b1": {res: {bn: {**{k: v for k, v in r.items() if k not in ("dist", "dz")},
                          "dist_median": pct(r["dist"], 50), "dist_p90": pct(r["dist"], 90),
                          "dz_median": pct(r["dz"], 50), "dz_p90": pct(r["dz"], 90), "n_near": len(r["dist"])}
                     for bn, r in b1[res].items()} for res in b1},
        "b1_per_window": b1_per_window,
        "b2_refs": b2_rows,
    }
    with open("out/eval_windows_summary.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1, default=str)
    print("\n書いた: out/eval_windows_summary.json")


if __name__ == "__main__":
    main()
