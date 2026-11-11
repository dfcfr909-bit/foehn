# 追検証（findings5）：偶然一致の基準値・現行方式との B2 比較・端の除外幅の感度（新規）。
#   B1・B2 の判定「50m以内かつ標高差5m以内に saddle（col）があるか」を、本物の基準点の代わりに
#   ランダムな点で行い、偶然の Recall を出す。乱数シードは固定。
#   点の置き方:
#     (a) 窓内の一様ランダム点（端・欠測境界から EDGE_M 以内は除く）
#     (b) 尾根状の点の上のランダム点。尾根状 = 半径 RIDGE_R_M の両側がどちらも RIDGE_DELTA_M 以上低い向きがある升目
#         （基準の col は尾根の上にあるので、こちらが本命の比較対象）。
#         ⚠ LANDMARK の尾根線は使わない（saddle は LANDMARK の尾根点の上に作られるので、偶然の値が甘くなる）。
#            DEM だけから決める簡易な定義で、LANDMARK にも現行方式にも依存しない
#     (m) 上の(b)を、本物の基準点と標高を合わせて引いたもの（±MATCH_DZ_M。基準1点につき MATCH_K 点）
#   ランダム点の標高は DEM から取る。各窓・解像度で N_PLAIN 点。
#   手法: LANDMARK（LM_all=全 saddle／LM_d20=落差20m以上）、現行方式（PR_all=落差3m以上=記録する床／PR_d20=20m以上=既定の表示）
#   現行方式の col は runProdCols.mjs（本番の terrainFindCols の原文を node で実行）の出力を使う。
#
# 使い方: .venv/Scripts/python.exe null_baseline.py   （export_dem_grids.py → node runProdCols.mjs の後）
import json, math, os, pickle
import numpy as np
from scipy.spatial import cKDTree
from scipy.ndimage import binary_dilation
from pyproj import Transformer
from col_prominence import find_cols
from eval_windows import load_windows, load_dem, BANDS, BAND_NAMES

SEED = 20260930
N_PLAIN = 2000
MATCH_K = 30
MATCH_DZ_M = 20.0
RIDGE_R_M = 150.0
RIDGE_DELTA_M = 10.0
DIST_TH, ELEV_TH = 50.0, 5.0
EDGES = [50.0, 100.0, 200.0]
EDGE_MAIN = 100.0
PROM_MIN = 5.0
METHODS = ["LM_all", "LM_d20", "PR_all", "PR_d20"]
RES = ["30m", "10m"]


def edge_mask_w(h, cell, w):
    bad = ~np.isfinite(h)
    k = int(math.ceil(w / cell))
    m = binary_dilation(bad, iterations=k)
    m[:k, :] = True; m[-k:, :] = True; m[:, :k] = True; m[:, -k:] = True
    return m


def shifted(a, dy, dx):
    """a[y+dy, x+dx] を返す（範囲外は NaN。np.roll のように反対側へ回り込ませない）"""
    out = np.full_like(a, np.nan)
    ny, nx = a.shape
    ys, yd = (slice(0, ny - dy), slice(dy, ny)) if dy >= 0 else (slice(-dy, ny), slice(0, ny + dy))
    xs, xd = (slice(0, nx - dx), slice(dx, nx)) if dx >= 0 else (slice(-dx, nx), slice(0, nx + dx))
    out[ys, xs] = a[yd, xd]
    return out


def ridge_score(h, cell):
    """半径 RIDGE_R_M の両側がどちらも低い向きのうち、最も高低差が小さい側の値が最大になる向きでの値"""
    r = RIDGE_R_M / cell
    best = np.full(h.shape, -np.inf)
    for k in range(8):
        a = math.radians(22.5 * k)
        dx, dy = int(round(r * math.cos(a))), int(round(r * math.sin(a)))
        p, q = shifted(h, dy, dx), shifted(h, -dy, -dx)
        s = np.minimum(h - p, h - q)
        s = np.where(np.isfinite(s), s, -np.inf)
        best = np.maximum(best, s)
    return best


class Targets:
    def __init__(self, x, y, z):
        self.x, self.y, self.z = np.asarray(x), np.asarray(y), np.asarray(z)
        self.tree = cKDTree(np.c_[self.x, self.y]) if len(self.x) else None

    def hit(self, P, Z):
        """P:(n,2) 座標、Z:(n,) 標高（None なら標高は見ない）→ bool 配列"""
        out = np.zeros(len(P), dtype=bool)
        if self.tree is None:
            return out
        for i, l in enumerate(self.tree.query_ball_point(P, DIST_TH)):
            if l and (Z is None or np.any(np.abs(self.z[l] - Z[i]) <= ELEV_TH)):
                out[i] = True
        return out


class WinRes:
    def __init__(self, w, res):
        self.name, self.res, self.epsg = w["name"], res, w["epsg"]
        self.h, self.tr, self.cell, _ = load_dem(w["dems"][res])
        self.masks = {e: edge_mask_w(self.h, self.cell, e) for e in EDGES}
        self.b1 = self._b1_cols()
        self.targets = self._targets()
        self.ridge = ridge_score(self.h, self.cell)

    def xy(self, rows, cols):
        return (self.tr.c + (np.asarray(cols) + 0.5) * self.tr.a, self.tr.f + (np.asarray(rows) + 0.5) * self.tr.e)

    def _b1_cols(self):
        path = f"out/cache_b1cols_{self.name}_{self.res}.pkl"
        if os.path.exists(path):
            cols = pickle.load(open(path, "rb"))
        else:
            cols = [(c["row"], c["col"], c["prom"], c["z"]) for c in find_cols(self.h, self.cell) if c["prom"] >= PROM_MIN]
            pickle.dump(cols, open(path, "wb"))
        a = np.array(cols, dtype=float).reshape(-1, 4)
        x, y = self.xy(a[:, 0], a[:, 1])
        return {"row": a[:, 0].astype(int), "col": a[:, 1].astype(int), "prom": a[:, 2], "z": a[:, 3], "x": x, "y": y}

    def _targets(self):
        with open(f"out/{self.name}_{self.res}_saddles_depth.json", encoding="utf-8") as f:
            s = json.load(f)
        sx = np.array([a["x"] for a in s]); sy = np.array([a["y"] for a in s]); sz = np.array([a["z"] for a in s])
        sd = np.array([np.nan if a["depth"] is None else a["depth"] for a in s])
        with open(f"out/prodcols/{self.name}_{self.res}.cols.json", encoding="utf-8") as f:
            pc = json.load(f)
        nx = self.h.shape[1]
        cc = np.array([c["c"] for c in pc["cols"]], dtype=int)
        pr = np.array([c["prom"] for c in pc["cols"]])
        px, py = self.xy(cc // nx, cc % nx)
        pz = np.array([c["h"] for c in pc["cols"]])
        d20 = np.isfinite(sd) & (sd >= 20)
        return {"LM_all": Targets(sx, sy, sz), "LM_d20": Targets(sx[d20], sy[d20], sz[d20]),
                "PR_all": Targets(px, py, pz), "PR_d20": Targets(px[pr >= 20], py[pr >= 20], pz[pr >= 20]),
                "n": {"LM_all": len(sx), "LM_d20": int(d20.sum()), "PR_all": len(px), "PR_d20": int((pr >= 20).sum())}}

    def cell_at(self, x, y):
        col = np.floor((x - self.tr.c) / self.tr.a).astype(int)
        row = np.floor((y - self.tr.f) / self.tr.e).astype(int)
        return row, col

    def pools(self, edge):
        interior = ~self.masks[edge]
        uni = np.argwhere(interior)
        rid = np.argwhere(interior & (self.ridge >= RIDGE_DELTA_M))
        return {"a": uni, "b": rid}

    def points(self, cells, rng):
        """升目(row,col) の配列 → 升目内の一様ランダムな座標と DEM 標高"""
        j = rng.uniform(-0.5, 0.5, size=(len(cells), 2))
        x = self.tr.c + (cells[:, 1] + 0.5 + j[:, 0]) * self.tr.a
        y = self.tr.f + (cells[:, 0] + 0.5 + j[:, 1]) * self.tr.e
        return np.c_[x, y], self.h[cells[:, 0], cells[:, 1]]

    def matched_cells(self, pool, zs, rng):
        """基準点の標高 zs ごとに、pool から標高が ±MATCH_DZ_M の升目を MATCH_K 個引く（足りなければ近い標高の升目）"""
        pz = self.h[pool[:, 0], pool[:, 1]]
        order = np.argsort(pz)
        pzs, pool_s = pz[order], pool[order]
        out = []
        for z in zs:
            lo, hi = np.searchsorted(pzs, z - MATCH_DZ_M), np.searchsorted(pzs, z + MATCH_DZ_M)
            if hi - lo < 20:
                mid = np.searchsorted(pzs, z)
                lo, hi = max(0, mid - 10), min(len(pzs), mid + 10)
            out.append(pool_s[rng.integers(lo, hi, size=MATCH_K)])
        return np.concatenate(out) if out else np.zeros((0, 2), dtype=int)


def rng_for(*keys):
    return np.random.default_rng(np.random.SeedSequence([SEED, *[abs(hash(k)) % (2 ** 31) if isinstance(k, str) else k for k in keys]]))


def stable_id(s):
    return sum((i + 1) * ord(c) for i, c in enumerate(s))


def main():
    wins = load_windows()
    enum = json.load(open("out/enum_candidates.json", encoding="utf-8"))
    WR = {(w["name"], res): WinRes(w, res) for w in wins for res in RES}
    wmap = {w["name"]: w for w in wins}
    names = [w["name"] for w in wins]
    result = {"params": {"seed": SEED, "n_plain": N_PLAIN, "match_k": MATCH_K, "match_dz_m": MATCH_DZ_M,
                         "ridge_r_m": RIDGE_R_M, "ridge_delta_m": RIDGE_DELTA_M, "edge_main": EDGE_MAIN}}

    # ---------- 窓ごとの偶然の一致率（一様ランダム・尾根状。標高一致あり／なし） ----------
    plain = {}   # (name,res,edge) -> {kind: {method: {"D": rate, "E": rate}}, "n_pool": ...}
    for (name, res), wr in WR.items():
        for edge in ([EDGE_MAIN] if True else EDGES):
            pools = wr.pools(edge)
            rec = {"pool_size": {k: int(len(v)) for k, v in pools.items()}}
            for kind in ["a", "b"]:
                rng = rng_for(stable_id(name), stable_id(res), stable_id(kind), int(edge))
                cells = pools[kind][rng.integers(0, len(pools[kind]), size=N_PLAIN)] if len(pools[kind]) else np.zeros((0, 2), int)
                P, Z = wr.points(cells, rng)
                rec[kind] = {m: {"D": float(wr.targets[m].hit(P, None).mean()), "E": float(wr.targets[m].hit(P, Z).mean())} for m in METHODS}
            plain[(name, res, edge)] = rec
    result["plain"] = {f"{k[0]}_{k[1]}_{int(k[2])}": v for k, v in plain.items()}

    # ---------- B1：落差帯別 実際の Recall と偶然の Recall ----------
    def b1_tables(edge, wnames):
        tab = {}
        for res in RES:
            for bn, (lo, hi) in zip(BAND_NAMES, BANDS):
                n = hits = 0
                ea = eb = 0.0
                m_draw = m_hits = 0
                for name in wnames:
                    wr = WR[(name, res)]
                    b = wr.b1
                    sel = (b["prom"] >= lo) & (b["prom"] < hi) & ~wr.masks[edge][b["row"], b["col"]]
                    k = int(sel.sum())
                    if not k:
                        continue
                    P = np.c_[b["x"][sel], b["y"][sel]]
                    hitv = wr.targets["LM_all"].hit(P, b["z"][sel])
                    n += k; hits += int(hitv.sum())
                    pl = plain[(name, res, edge)] if edge == EDGE_MAIN else None
                    if pl:
                        ea += k * pl["a"]["LM_all"]["E"]
                        eb += k * pl["b"]["LM_all"]["E"]
                    pools = wr.pools(edge)
                    if len(pools["b"]):
                        rng = rng_for(stable_id(name), stable_id(res), stable_id(bn), 7, int(edge))
                        cells = wr.matched_cells(pools["b"], b["z"][sel], rng)
                        P2, Z2 = wr.points(cells, rng)
                        m_hits += int(wr.targets["LM_all"].hit(P2, Z2).sum()); m_draw += len(cells)
                tab[(res, bn)] = {"n": n, "hits": hits, "exp_a": ea, "exp_b": eb,
                                  "exp_b_matched": (m_hits / m_draw * n) if m_draw else None}
        return tab

    def fmt_b1(tab, title):
        print(f"\n{title}")
        print("  解像度 落差帯    n   実際(拾えた/Recall)   偶然(a)一様   偶然(b)尾根状   偶然(b)標高合わせ")
        for res in RES:
            for bn in BAND_NAMES:
                t = tab[(res, bn)]
                if not t["n"]:
                    print(f"  {res:>4} {bn:>8}  n=0"); continue
                r = lambda v: f"{v:6.1f} ({v/t['n']*100:3.0f}%)" if v is not None else "   -"
                print(f"  {res:>4} {bn:>8} {t['n']:>4}   {t['hits']:>4} ({t['hits']/t['n']*100:3.0f}%)      {r(t['exp_a'])}   {r(t['exp_b'])}   {r(t['exp_b_matched'])}")

    b1_all = b1_tables(EDGE_MAIN, names)
    fmt_b1(b1_all, "=== B1 窓合計（10窓・端除外100m）===")
    b1_w07 = b1_tables(EDGE_MAIN, ["w07"])
    fmt_b1(b1_w07, "=== B1 w07 単独 ===")
    b1_each = {n: b1_tables(EDGE_MAIN, [n]) for n in names}
    result["b1_all"] = {f"{k[0]}_{k[1]}": v for k, v in b1_all.items()}
    result["b1_w07"] = {f"{k[0]}_{k[1]}": v for k, v in b1_w07.items()}
    result["b1_each"] = {n: {f"{k[0]}_{k[1]}": v for k, v in t.items()} for n, t in b1_each.items()}

    print("\n=== 窓ごとの偶然の一致率（LANDMARK 全saddle・距離50m＋標高差5m。一様/尾根状） ===")
    for res in RES:
        print(f"  [{res}] " + "  ".join(f"{n}:{plain[(n,res,EDGE_MAIN)]['a']['LM_all']['E']*100:.0f}/{plain[(n,res,EDGE_MAIN)]['b']['LM_all']['E']*100:.0f}%" for n in names)
              + f"   （saddle件数 " + " ".join(f"{n}:{WR[(n,res)].targets['n']['LM_all']}" for n in names) + "）")

    # ---------- B2：OSM 基準点 ----------
    to_crs = {w["name"]: Transformer.from_crs(4326, w["epsg"], always_xy=True) for w in wins}

    def b2_refs(name, res, edge):
        wr = WR[(name, res)]
        rows = []
        for o in enum["osm"]:
            x, y = to_crs[name].transform(o["lon"], o["lat"])
            r, c = wr.cell_at(np.array([x]), np.array([y]))
            r, c = int(r[0]), int(c[0])
            if r < 0 or c < 0 or r >= wr.h.shape[0] or c >= wr.h.shape[1] or wr.masks[edge][r, c]:
                continue
            ele = float(o["ele"]) if o.get("ele") and str(o["ele"]).replace(".", "", 1).isdigit() else None
            rows.append({"x": x, "y": y, "row": r, "col": c, "z_dem": float(wr.h[r, c]), "ele": ele,
                         "both": bool(o["both"]), "name": o.get("name") or "(無名)"})
        return rows

    def b2_tables(edge, wnames, with_null=True):
        tab = {}
        for res in RES:
            for grp in ["全体", "両方登録", "OSMのみ"]:
                for m in METHODS:
                    n = hD = hE = hO = 0
                    e = {k: [0.0, 0.0] for k in ["a", "b"]}  # 期待値 D,E
                    mD = mE = md = 0
                    for name in wnames:
                        wr = WR[(name, res)]
                        refs = [r for r in b2_refs(name, res, edge) if grp == "全体" or (grp == "両方登録") == r["both"]]
                        if not refs:
                            continue
                        P = np.array([[r["x"], r["y"]] for r in refs])
                        Zd = np.array([r["z_dem"] for r in refs])
                        T = wr.targets[m]
                        n += len(refs)
                        hD += int(T.hit(P, None).sum()); hE += int(T.hit(P, Zd).sum())
                        # 従来の判定：OSM の ele タグがあれば標高も見る。無ければ距離のみ
                        for r_, p_ in zip(refs, P):
                            hO += int(T.hit(p_[None, :], None if r_["ele"] is None else np.array([r_["ele"]]))[0])
                        if with_null and edge == EDGE_MAIN:
                            pl = plain[(name, res, edge)]
                            for kind in ["a", "b"]:
                                e[kind][0] += len(refs) * pl[kind][m]["D"]; e[kind][1] += len(refs) * pl[kind][m]["E"]
                            pools = wr.pools(edge)
                            if len(pools["b"]):
                                rng = rng_for(stable_id(name), stable_id(res), stable_id(grp), stable_id(m), 11)
                                cells = wr.matched_cells(pools["b"], Zd, rng)
                                P2, Z2 = wr.points(cells, rng)
                                mD += int(T.hit(P2, None).sum()); mE += int(T.hit(P2, Z2).sum()); md += len(cells)
                    tab[(res, grp, m)] = {"n": n, "hit_D": hD, "hit_E": hE, "hit_old": hO,
                                          "exp_a_D": e["a"][0], "exp_a_E": e["a"][1], "exp_b_D": e["b"][0], "exp_b_E": e["b"][1],
                                          "exp_bm_D": (mD / md * n) if md else None, "exp_bm_E": (mE / md * n) if md else None,
                                          "n_targets_total": sum(WR[(nm, res)].targets["n"][m] for nm in wnames)}
        return tab

    b2 = b2_tables(EDGE_MAIN, names)
    result["b2"] = {f"{k[0]}|{k[1]}|{k[2]}": v for k, v in b2.items()}
    lab = {"LM_all": "LANDMARK 全saddle", "LM_d20": "LANDMARK 落差≧20m", "PR_all": "現行方式 落差≧3m(記録)", "PR_d20": "現行方式 落差≧20m(既定表示)"}
    for var, vname in [("D", "距離50mのみ"), ("E", "距離50m＋標高差5m(DEM標高)")]:
        print(f"\n=== B2 OSM基準点（端除外100m）判定={vname} ===")
        print("  解像度 区分     手法                     n   実際          偶然(a)一様    偶然(b)尾根状   偶然(b)標高合わせ   [従来判定の実際]")
        for res in RES:
            for grp in ["全体", "両方登録", "OSMのみ"]:
                for m in METHODS:
                    t = b2[(res, grp, m)]
                    if not t["n"]:
                        continue
                    f = lambda v: f"{v:5.1f}({v/t['n']*100:3.0f}%)" if v is not None else "   -"
                    print(f"  {res:>4} {grp:<6} {lab[m]:<26} {t['n']:>3}  {t['hit_'+var]:>3}({t['hit_'+var]/t['n']*100:3.0f}%)   {f(t['exp_a_'+var])}   {f(t['exp_b_'+var])}   {f(t['exp_bm_'+var])}    [{t['hit_old']}]")

    # ---------- 感度：端の除外幅 50/100/200m ----------
    print("\n=== 感度：端の除外幅 ===")
    sens = {}
    for e in EDGES:
        b1e = b1_tables(e, names)
        b2e = b2_tables(e, names, with_null=False)
        sens[int(e)] = {"b1": {f"{k[0]}_{k[1]}": v for k, v in b1e.items()}, "b2": {f"{k[0]}|{k[1]}|{k[2]}": v for k, v in b2e.items()}}
    result["sensitivity"] = sens
    print("  B1（LANDMARK 全saddle・拾えた/n）")
    print("  除外幅   " + "   ".join(f"{res} {bn}" for res in RES for bn in ["30-100", "10-30"]))
    for e in EDGES:
        cells = []
        for res in RES:
            for bn in ["30-100", "10-30"]:
                t = sens[int(e)]["b1"][f"{res}_{bn}"]
                cells.append(f"{t['hits']}/{t['n']}({t['hits']/t['n']*100:.0f}%)" if t["n"] else "-")
        print(f"  {int(e):>4}m   " + "   ".join(cells))
    print("  B2（OSM全体・距離50mのみ D／距離＋標高 E。拾えた/n）")
    for res in RES:
        for m in METHODS:
            cells = []
            for e in EDGES:
                t = sens[int(e)]["b2"][f"{res}|全体|{m}"]
                cells.append(f"{int(e)}m: D {t['hit_D']}/{t['n']} E {t['hit_E']}/{t['n']}")
            print(f"  {res:>4} {lab[m]:<26} " + " | ".join(cells))

    with open("out/null_baseline_summary.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=1, default=float)
    print("\n書いた: out/null_baseline_summary.json")


if __name__ == "__main__":
    main()
