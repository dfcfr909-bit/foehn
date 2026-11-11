# 尾根・沢の比較（findings6）の共通の道具（新規）。線の読み込み・サンプリング・評価領域・指標・線のつながり。
#   物差しは scripts/probeDemRes.mjs（過去のコミット 9f79c37）の定義を踏襲する：
#     OSM の線を 5m おきにサンプル／精度＝検出した線のうち基準線から d 以内の割合／再現＝基準線のうち検出した線から d 以内の割合
#     ／欠け（DEM の欠測帯）の近くは評価から外す。
#   使えなかった部分：probeDemRes.mjs は Chromium で本番アプリを動かして地理院タイルを取る Actions 前提の実験で、
#     LANDMARK の線を入れられず、窓の DEM（30m・10m の GeoTIFF）も使えない。→ 定義だけ踏襲して Python で測る。
import json, math, os, pickle
import numpy as np
import rasterio
from scipy.spatial import cKDTree
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components, dijkstra
from pyproj import Transformer
from null_baseline import edge_mask_w

STEP_M = 10.0      # 手法の線のサンプル間隔
OSM_STEP_M = 5.0   # OSM の線のサンプル間隔（probeDemRes.mjs と同じ）
EDGE_M = 100.0
RADII = [30.0, 50.0]


# ---------------- 線の読み込み ----------------
def lm_lines(name, res):
    """LANDMARK の尾根線・沢線（既定閾値。ridge: A_spread>=1e5、沢: A_out>=1e5・hso>=4）"""
    import geopandas as gpd
    stem = f"{name}_{res}" + ("_gsi" if name == "jonen" else "")
    d = f"out/{name}_{res}"
    r = gpd.read_file(f"{d}/ridgelines_se_HSO_{stem}.gpkg.gpkg")
    s = gpd.read_file(f"{d}/slopelines_se_HSO_{stem}.gpkg.gpkg")
    rp = [np.asarray(g.coords)[:, :2] for g in r.geometry]
    sp = [np.asarray(g.coords)[:, :2] for g in s.geometry]
    return {"ridge": {"polys": rp, "A_spread": r["A_spread"].to_numpy(), "id": r["id_rdl"].to_numpy()},
            "valley": {"polys": sp, "hso": s["hso"].to_numpy(), "A_out": s["A_out"].to_numpy()}}


def prod_lines(name, res, tr):
    """現行方式（本番 JS を node で実行した出力）。x,y は升目の添字（小数）→ 窓の座標へ"""
    d = json.load(open(f"out/prodcols/{name}_{res}.flow.json", encoding="utf-8"))
    def conv(lst, key):
        polys = [np.c_[tr.c + np.array(l["x"]) * tr.a, tr.f + np.array(l["y"]) * tr.e] for l in lst]
        return polys, np.array([l[key] for l in lst])
    out = {}
    for variant in ["bridge", "nobridge", "dense"]:
        f = d["flow"][variant]
        rp, relief = conv(f["ridges"], "relief")
        vp, sca = conv(f["valleys"], "sca")
        out[variant] = {"ridge": {"polys": rp, "relief": relief}, "valley": {"polys": vp, "sca": sca},
                        "bridged": f.get("bridged"), "bridgeFail": f.get("bridgeFail")}
    return out


def osm_elements(name, transformer):
    rec = json.load(open(f"out/osm_lines_{name}.json", encoding="utf-8"))
    streams, ridges, waters = [], [], []
    for e in rec["elements"]:
        t = e.get("tags", {})
        if e["type"] == "way" and "geometry" in e:
            xy = np.array([transformer.transform(p["lon"], p["lat"]) for p in e["geometry"]])
            if t.get("waterway") in ("river", "stream"):
                streams.append(xy)
            elif t.get("natural") in ("ridge", "arete"):
                ridges.append(xy)
            if t.get("natural") == "water" or t.get("waterway") == "riverbank" or t.get("landuse") == "reservoir":
                waters.append({"ring": xy, "tags": t, "id": e["id"]})
        elif e["type"] == "relation" and t.get("natural") == "water":
            from shapely.geometry import LineString
            from shapely.ops import linemerge, polygonize
            lines = []
            for m in e.get("members", []):
                if m.get("role") == "outer" and "geometry" in m and len(m["geometry"]) >= 2:
                    lines.append(LineString([transformer.transform(p["lon"], p["lat"]) for p in m["geometry"]]))
            if lines:
                for poly in polygonize(linemerge(lines)):
                    waters.append({"ring": np.array(poly.exterior.coords), "tags": t, "id": e["id"]})
    return streams, ridges, waters, rec["fetched_at_utc"]


# ---------------- サンプリング ----------------
def densify(polys, step):
    pts, w, idx = [], [], []
    for i, c in enumerate(polys):
        if len(c) < 2:
            continue
        seg = np.hypot(np.diff(c[:, 0]), np.diff(c[:, 1]))
        L = float(seg.sum())
        if L <= 0:
            continue
        n = max(1, int(round(L / step)))
        s = (np.arange(n) + 0.5) * L / n
        cum = np.concatenate([[0.0], np.cumsum(seg)])
        pts.append(np.c_[np.interp(s, cum, c[:, 0]), np.interp(s, cum, c[:, 1])])
        w.append(np.full(n, L / n)); idx.append(np.full(n, i))
    if not pts:
        return np.zeros((0, 2)), np.zeros(0), np.zeros(0, int)
    return np.vstack(pts), np.concatenate(w), np.concatenate(idx).astype(int)


class LineSet:
    """線の集合。点（サンプル）と重み（その点が受け持つ長さ m）と、点が属する線の番号・線ごとの属性を持つ"""
    def __init__(self, polys, step, attrs=None, region=None):
        self.polys = polys
        self.attrs = attrs or {}
        self.P, self.w, self.i = densify(polys, step)
        self.region = region(self.P) if region is not None and len(self.P) else np.zeros(len(self.P), bool)
        self._tree = None

    def tree(self):
        if self._tree is None:
            self._tree = cKDTree(self.P) if len(self.P) else None
        return self._tree

    def length_in(self, mask=None):
        m = self.region if mask is None else mask
        return float(self.w[m].sum())

    def select(self, line_mask, region=None):
        """線（番号）を選んだ部分集合（再サンプルしない）"""
        s = object.__new__(LineSet)
        keep_lines = np.where(line_mask)[0]
        remap = -np.ones(len(self.polys), int); remap[keep_lines] = np.arange(len(keep_lines))
        pm = line_mask[self.i] if len(self.i) else np.zeros(0, bool)
        s.polys = [self.polys[k] for k in keep_lines]
        s.attrs = {k: v[keep_lines] for k, v in self.attrs.items()}
        s.P, s.w, s.i = self.P[pm], self.w[pm], remap[self.i[pm]]
        s.region = self.region[pm]
        s._tree = None
        return s

    def match_length(self, key, target_m, descending=True):
        """属性 key の大きい順に線を足し、領域内の全長が target_m にもっとも近くなる所で切る。返り値 (部分集合, 使った全長, 全部足しても届かないか)"""
        n = len(self.polys)
        per = np.bincount(self.i[self.region], weights=self.w[self.region], minlength=n) if n else np.zeros(0)
        order = np.argsort(-self.attrs[key] if descending else self.attrs[key], kind="stable")
        cum = np.cumsum(per[order])
        if not len(cum):
            return self.select(np.zeros(n, bool)), 0.0, True
        k = int(np.argmin(np.abs(cum - target_m))) + 1
        m = np.zeros(n, bool); m[order[:k]] = True
        return self.select(m), float(cum[k - 1]), bool(cum[-1] < target_m * 0.98)


# ---------------- 評価領域 ----------------
class Region:
    """窓の評価領域：10m と 30m の DEM の両方で「端・欠測帯から EDGE_M より内側」の所（findings4/5 と同じ幅）"""
    def __init__(self, win):
        self.grids = {}
        for res in ["10m", "30m"]:
            with rasterio.open(win["dems"][res]) as d:
                h = d.read(1).astype("float64"); nod = d.nodata; tr = d.transform; cell = d.res[0]
            h[h == nod] = np.nan
            self.grids[res] = {"h": h, "tr": tr, "cell": cell, "mask": edge_mask_w(h, cell, EDGE_M)}
        g = self.grids["10m"]
        ys, xs = np.mgrid[0:g["h"].shape[0], 0:g["h"].shape[1]]
        cx = g["tr"].c + (xs + 0.5) * g["tr"].a; cy = g["tr"].f + (ys + 0.5) * g["tr"].e
        inside = ~g["mask"] & self._lookup("30m", cx.ravel(), cy.ravel()).reshape(xs.shape)
        self.inside10 = inside
        self.area_km2 = float(inside.sum()) * g["cell"] ** 2 / 1e6
        tr = g["tr"]
        self.bounds = (tr.c, tr.f + tr.e * g["h"].shape[0], tr.c + tr.a * g["h"].shape[1], tr.f)   # x0,y0,x1,y1
        self.center = ((self.bounds[0] + self.bounds[2]) / 2, (self.bounds[1] + self.bounds[3]) / 2)
        self.excl = None   # 平坦面・水面（作業4）。np.bool_ 配列（10m 格子）

    def _lookup(self, res, x, y):
        g = self.grids[res]; tr = g["tr"]
        c = np.floor((x - tr.c) / tr.a).astype(int); r = np.floor((y - tr.f) / tr.e).astype(int)
        ok = (c >= 0) & (r >= 0) & (c < g["h"].shape[1]) & (r < g["h"].shape[0])
        out = np.zeros(len(x), bool)
        out[ok] = ~g["mask"][r[ok], c[ok]]
        return out

    def __call__(self, P, masked=False):
        """点が評価領域の内側か。masked=True なら平坦面・水面も外す"""
        if not len(P):
            return np.zeros(0, bool)
        ok = self._lookup("10m", P[:, 0], P[:, 1]) & self._lookup("30m", P[:, 0], P[:, 1])
        if masked and self.excl is not None:
            g = self.grids["10m"]; tr = g["tr"]
            c = np.floor((P[:, 0] - tr.c) / tr.a).astype(int); r = np.floor((P[:, 1] - tr.f) / tr.e).astype(int)
            inb = (c >= 0) & (r >= 0) & (c < g["h"].shape[1]) & (r < g["h"].shape[0])
            ex = np.zeros(len(P), bool); ex[inb] = self.excl[r[inb], c[inb]]
            ok &= ~ex
        return ok

    def on_excl(self, P):
        g = self.grids["10m"]; tr = g["tr"]
        c = np.floor((P[:, 0] - tr.c) / tr.a).astype(int); r = np.floor((P[:, 1] - tr.f) / tr.e).astype(int)
        inb = (c >= 0) & (r >= 0) & (c < g["h"].shape[1]) & (r < g["h"].shape[0])
        ex = np.zeros(len(P), bool); ex[inb] = self.excl[r[inb], c[inb]]
        return ex


# ---------------- 指標 ----------------
def near_num_den(A_P, A_w, ref_tree, r):
    """A の点のうち ref から r 以内の長さ（分子）と全長（分母）"""
    if not len(A_P):
        return 0.0, 0.0
    if ref_tree is None:
        return 0.0, float(A_w.sum())
    d = ref_tree.query(A_P, distance_upper_bound=r)[0]
    return float(A_w[np.isfinite(d)].sum()), float(A_w.sum())


def prec_rec(A, O, region, r, masked=False):
    """精度＝A（検出）のうち O（基準）から r 以内、再現＝O のうち A から r 以内。(分子,分母) の組で返す"""
    a_in = region(A.P, masked) if len(A.P) else np.zeros(0, bool)
    o_in = region(O.P, masked) if len(O.P) else np.zeros(0, bool)
    p = near_num_den(A.P[a_in], A.w[a_in], O.tree(), r)
    q = near_num_den(O.P[o_in], O.w[o_in], A.tree(), r)
    return p, q


def rigid(P, center, theta, shift):
    c, s = math.cos(theta), math.sin(theta)
    d = P - np.asarray(center)
    return np.c_[d[:, 0] * c - d[:, 1] * s, d[:, 0] * s + d[:, 1] * c] + np.asarray(center) + np.asarray(shift)


def rigid_inv(P, center, theta, shift):
    c, s = math.cos(-theta), math.sin(-theta)
    d = P - np.asarray(center) - np.asarray(shift)
    return np.c_[d[:, 0] * c - d[:, 1] * s, d[:, 0] * s + d[:, 1] * c] + np.asarray(center)


def null_prec_rec(A, O, region, r, theta, shift, cover, max_pts=8000, rng=None, masked=False):
    """基準線 O を窓の中心まわりに theta 回転・shift 平行移動した偽の基準に対する 精度・再現（(分子,分母) の組）。
       精度の分母は、偽の基準がカバーしている範囲（もとの O の取得範囲を同じ動きで動かした矩形）の中の A の点だけ"""
    a_in = region(A.P, masked) if len(A.P) else np.zeros(0, bool)
    AP, Aw = A.P[a_in], A.w[a_in]
    if len(AP) > max_pts:
        sel = rng.choice(len(AP), max_pts, replace=False); AP, Aw = AP[sel], Aw[sel]
    Oc = rigid(O.P, region.center, theta, shift)
    ot = cKDTree(Oc) if len(Oc) else None
    q = rigid_inv(AP, region.center, theta, shift)
    x0, y0, x1, y1 = cover
    cov = (q[:, 0] >= x0) & (q[:, 0] <= x1) & (q[:, 1] >= y0) & (q[:, 1] <= y1)
    p = near_num_den(AP[cov], Aw[cov], ot, r)
    o_in = region(Oc, masked)
    qq = near_num_den(Oc[o_in], O.w[o_in], A.tree(), r)
    return p, qq


# ---------------- 線のつながり ----------------
class Graph:
    """線を節と辺のグラフにする。⚠ 現行方式の線は間引き（Douglas–Peucker）で頂点がまばらなので、辺を GRAPH_STEP_M 以下に
       割って節を補い、「線に沿って何m先に節があるか」の判定が頂点の間隔に左右されないようにする"""
    GRAPH_STEP_M = 10.0

    def __init__(self, polys, region, min_in_frac=0.5):
        keys, edges, self.line_of_edge = {}, [], []
        self.xy = []
        for li, c in enumerate(polys):
            if len(c) < 2:
                continue
            pts = [c[0]]
            for a_, b_ in zip(c[:-1], c[1:]):
                d = math.hypot(b_[0] - a_[0], b_[1] - a_[1])
                n = max(1, int(math.ceil(d / self.GRAPH_STEP_M)))
                for j in range(1, n + 1):
                    pts.append(a_ + (b_ - a_) * (j / n))
            pts = np.array(pts)
            if region(pts).mean() < min_in_frac:
                continue
            prev = None
            for (x, y) in pts:
                k = (round(float(x), 1), round(float(y), 1))
                if k not in keys:
                    keys[k] = len(keys); self.xy.append(k)
                n = keys[k]
                if prev is not None and prev != n:
                    edges.append((prev, n, math.hypot(self.xy[n][0] - self.xy[prev][0], self.xy[n][1] - self.xy[prev][1])))
                    self.line_of_edge.append(li)
                prev = n
        self.n = len(keys)
        self.xy = np.array(self.xy) if self.xy else np.zeros((0, 2))
        if edges:
            a = np.array([e[0] for e in edges]); b = np.array([e[1] for e in edges]); w = np.array([e[2] for e in edges])
            self.csr = csr_matrix((np.r_[w, w], (np.r_[a, b], np.r_[b, a])), shape=(self.n, self.n))
            self.n_comp, self.label = connected_components(self.csr, directed=False)
            self.comp_len_all = np.bincount(self.label[a], weights=w, minlength=self.n_comp)   # 成分番号ごとの全長
            self.comp_len = self.comp_len_all[self.comp_len_all > 0]
        else:
            self.csr = csr_matrix((max(self.n, 1), max(self.n, 1))); self.n_comp = 0; self.label = np.zeros(0, int); self.comp_len = np.zeros(0); self.comp_len_all = np.zeros(0)
        self.tree = cKDTree(self.xy) if self.n else None

    def comp_stats(self):
        L = np.sort(self.comp_len)[::-1]
        if not len(L):
            return {"n": 0, "total_km": 0.0, "median_m": None, "p90_m": None, "max_m": None, "top1_share": None, "n_ge_1km": 0, "n_lt_500m": 0}
        return {"n": int(len(L)), "total_km": float(L.sum() / 1000), "median_m": float(np.median(L)), "p90_m": float(np.percentile(L, 90)),
                "max_m": float(L[0]), "top1_share": float(L[0] / L.sum()), "n_ge_1km": int((L >= 1000).sum()), "n_lt_500m": int((L < 500).sum())}

    def anchor(self, x, y, near_m=100.0):
        """点 (x,y) から near_m 以内の節のうち、最も長い成分に属する節（複数あればその成分で点に最も近い節）。無ければ None。
           ⚠ 最寄りの節だと、点のすぐそばの短い断片を拾って本線を見落とす（現行方式の 10m）。両手法に同じ規則で、
              近くにある最長の成分を採る（つながりを判定する側に有利な規則）"""
        if self.tree is None:
            return None
        cand = self.tree.query_ball_point([x, y], near_m)
        if not cand:
            return None
        cand = np.array(cand)
        lens = self.comp_len_all[self.label[cand]]
        best = cand[lens == lens.max()]
        d = np.hypot(self.xy[best, 0] - x, self.xy[best, 1] - y)
        return int(best[int(np.argmin(d))])

    def through(self, x, y, near_m=100.0, reach=(300.0, 1000.0)):
        """点の近く(near_m 以内)の最長の成分の節から、線に沿って reach[k] 以上の所に、互いに逆向き(120°以上開く)の節が
           2方向あるか。返り値 (近くに線があるか, {reach: 両側に続くか})"""
        i = self.anchor(x, y, near_m)
        if i is None:
            return False, {r: False for r in reach}
        res = {}
        dist = dijkstra(self.csr, directed=False, indices=int(i), limit=max(reach) * 1.25)
        for r in reach:
            band = np.where((dist >= r) & (dist <= r * 1.25))[0]
            if len(band) < 2:
                res[r] = False; continue
            v = self.xy[band] - self.xy[i]
            v = v / (np.hypot(v[:, 0], v[:, 1])[:, None] + 1e-9)
            res[r] = bool((v @ v.T).min() <= -0.5)   # 120° 以上開く2点がある
        return True, res
