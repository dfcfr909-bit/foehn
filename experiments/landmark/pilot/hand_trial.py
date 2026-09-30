# 試作（栃木北部）：尾根の絞り込みに「沢筋からの高さ（HAND）」を加える（新規）。LANDMARK の再計算はしない（m3 の区間を使う）。
#   HAND は exportHand.mjs の出力（本番 terrainFlow のコードで求めた升目ごとの値）を、尾根の区間の中点で引く。2つの定義：
#     prod … 本番の定数のまま（沢筋＝比集水面積≧5,000m かつ 比集水面積×勾配≧1,500）
#     sca  … 沢筋の条件から勾配の条件を外したもの（比集水面積≧5,000m だけ）。扇状地では prod の沢筋ができず、HAND が
#             NaN か、扇状地の傾斜ぶんの高さになるため（findings10 参照）
#     HAND が NaN（沢筋に着かない・平坦地）の区間は「閾値を満たさない」として捨てる（本番の terrainVectorize も NaN は 40m 未満と同じ扱い）
#   ⚠ 本番の VEC.RIDGE_MIN_RELIEF は「線（辺）の上の HAND の最大」で線ごとに判定する。ここでは区間ごとに判定する
#     （線ごとだと、山の尾根から扇状地へ伸びた部分が、山側の大きな HAND で残ってしまうため）。
#   絞り込みの組み合わせ：起伏≧60m（あり／なし）× A_spread≧30万・100万m² × HAND≧20・40・60m（sca・prod）
#   場所ごとの長さ：
#     扇状地   … 那須野ヶ原・百村山の東〜西岩崎：東経139.915〜139.995・北緯37.005〜37.055
#     日光谷底 … 大谷川・東武日光駅〜所野：東経139.595〜139.640・北緯36.735〜36.780（箱の中で標高700m未満の部分も別に出す）
#     那須岳   … 茶臼岳（139.9631, 37.1248）・三本槍岳（139.9614, 37.1502）を囲む範囲（両側に1.5km）
#     女峰赤薙 … 女峰山（139.5365, 36.8115）・赤薙山（139.5692, 36.8092）を囲む範囲（両側に1.5km）
#     山の2か所は、範囲の中の尾根線で、両端の山頂の300m以内の節どうしの最短経路（線に沿った長さ）を出す。
#     絞り込みなしの経路と比べて、経路があり長さが1.1倍以内なら「主稜線が残る」とする
#   座標は地理院の地名検索（msearch.gsi.go.jp）で引いた。
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/hand_trial.py
import json, pickle
import numpy as np
from pyproj import Transformer
from shapely.geometry import box, LineString, Point
from shapely.ops import transform as shp_transform
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components
from pilot_lines import load_meta, master_info, assemble, flat_mask, on_mask, process
from filter_trial import relief_grid, at, clip_ll
from prepare_dem import BBOX, UTM

TO_UTM = Transformer.from_crs(4326, UTM, always_xy=True)
TO_LL = Transformer.from_crs(UTM, 4326, always_xy=True)
SUMMITS = {"茶臼岳": (139.9631, 37.1248), "三本槍岳": (139.9614, 37.1502), "女峰山": (139.5365, 36.8115), "赤薙山": (139.5692, 36.8092)}
BOXES = {"扇状地": (139.915, 37.005, 139.995, 37.055), "日光谷底": (139.595, 36.735, 139.640, 36.780)}
CORRIDORS = {"那須岳": ("茶臼岳", "三本槍岳"), "女峰赤薙": ("女峰山", "赤薙山")}
BOX_PAD_M = 1500.0
GAP_M = 45.0
NEAR_M = 300.0
LOW_M = 700.0


def hand_grid(tag):
    m = json.load(open("pilot/out/prod_grid.meta.json"))
    H = np.fromfile(f"pilot/out/prod_hand{'' if tag == 'prod' else '_sca'}.f32", dtype=np.float32).reshape(m["ny"], m["nx"])
    return H, m


def hand_at(H, m, P):
    c = ((P[:, 0] - m["x0"]) / m["a"]).astype(int); r = ((P[:, 1] - m["y0"]) / m["e"]).astype(int)
    ok = (c >= 0) & (r >= 0) & (c < H.shape[1]) & (r < H.shape[0])
    out = np.full(len(P), np.nan, np.float32); out[ok] = H[r[ok], c[ok]]
    return out


def variants():
    V = {"r60_a1e6": (60, 1e6, None, None), "r60_a3e5": (60, 3e5, None, None)}
    for hdef in ["sca", "prod"]:
        for t in [20, 40, 60]:
            for rmin in [60, 0]:
                for amin in [1e6, 3e5]:
                    V[f"{'r60_' if rmin else ''}a{'1e6' if amin == 1e6 else '3e5'}_h{t}{'' if hdef == 'sca' else 'p'}"] = (rmin, amin, hdef, t)
    return V


def sample_pts(lines_utm, step=30.0):
    P, W = [], []
    for l in lines_utm:
        a = np.asarray(l.coords); cum = np.r_[0, np.cumsum(np.hypot(*np.diff(a, axis=0).T))]
        if cum[-1] <= 0:
            continue
        n = max(1, int(cum[-1] // step)); s = (np.arange(n) + .5) * cum[-1] / n
        P.append(np.c_[np.interp(s, cum, a[:, 0]), np.interp(s, cum, a[:, 1])]); W.append(np.full(n, cum[-1] / n))
    return (np.vstack(P), np.concatenate(W)) if P else (np.zeros((0, 2)), np.zeros(0))


def corridor_connect(lines_utm, a, b):
    """2つの山頂を囲む範囲（両側に BOX_PAD_M）の中の尾根線で、山頂の近く（NEAR_M 以内）の節どうしの最短経路（線に沿った長さ）。
       ⚠ 最初は「2つの山頂を結ぶ直線の両側600m」で見たが、女峰山〜赤薙山の主稜線は直線から北へ最大約900m 回り込むので、
          回廊からはみ出して、絞り込みなしでも × になった（判定の誤り）。範囲で囲んで最短経路を見る方式に替えた"""
    pa, pb = np.array(TO_UTM.transform(*SUMMITS[a])), np.array(TO_UTM.transform(*SUMMITS[b]))
    bx = box(min(pa[0], pb[0]) - BOX_PAD_M, min(pa[1], pb[1]) - BOX_PAD_M, max(pa[0], pb[0]) + BOX_PAD_M, max(pa[1], pb[1]) + BOX_PAD_M)
    pieces = []
    for l in lines_utm:
        if not l.intersects(bx):
            continue
        g = l.intersection(bx)
        pieces.extend(p for p in (g.geoms if hasattr(g, "geoms") else [g]) if isinstance(p, LineString) and len(p.coords) >= 2)
    out = {"km": sum(p.length for p in pieces) / 1000, "near_a": None, "near_b": None, "connected": False, "path_km": None}
    if not pieces:
        return out
    keys, rows, cols, w, xy = {}, [], [], [], []
    for p in pieces:
        prev = None
        for c in p.coords:
            k = (round(c[0], 1), round(c[1], 1))
            if k not in keys:
                keys[k] = len(keys); xy.append(c)
            if prev is not None and prev != keys[k]:
                rows.append(prev); cols.append(keys[k]); w.append(float(np.hypot(c[0] - xy[prev][0], c[1] - xy[prev][1])) + 1e-6)
            prev = keys[k]
    n = len(keys); xy = np.array(xy)
    from scipy.spatial import cKDTree
    from scipy.sparse.csgraph import dijkstra
    # 升目1.5個分（GAP_M）以内のすき間はつながっているとみなし、すき間の長さを経路に足す。
    # ⚠ LANDMARK の尾根は、交わる所で升目1つずれて節を共有しないことがある（茶臼岳〜三本槍岳で30.5m のすき間を確認）
    for i, j in cKDTree(xy).query_pairs(GAP_M):
        rows.append(i); cols.append(j); w.append(float(np.hypot(*(xy[i] - xy[j]))) + 1e-6)
    # ⚠ csr_matrix は同じ (i, j) の重みを足し合わせる。線の上で隣り合う頂点に、すき間の辺が重なって入ると経路が伸びる
    #   （最初の実行で、辺を足したのに最短経路が 3.55→4.07km に伸びた）。同じ組は短い方の重みだけにする
    best = {}
    for i, j, ww in zip(rows, cols, w):
        k2 = (min(i, j), max(i, j))
        if k2[0] != k2[1] and (k2 not in best or ww < best[k2]):
            best[k2] = ww
    rows = [k2[0] for k2 in best]; cols = [k2[1] for k2 in best]; w = list(best.values())
    g = csr_matrix((w, (rows, cols)), shape=(n, n))
    da = np.hypot(xy[:, 0] - pa[0], xy[:, 1] - pa[1]); db = np.hypot(xy[:, 0] - pb[0], xy[:, 1] - pb[1])
    out["near_a"], out["near_b"] = float(da.min()), float(db.min())
    ia, ib = np.where(da <= NEAR_M)[0], np.where(db <= NEAR_M)[0]
    if len(ia) and len(ib):
        D = dijkstra(g, directed=False, indices=ia)
        best = D[:, ib].min()
        if np.isfinite(best):
            out["connected"] = True; out["path_km"] = float(best / 1000)
    return out


def main():
    meta = load_meta(); tr, cell = master_info()
    A = assemble(sorted(n for n, t in meta["tiles"].items() if t.get("margin") == "m3"), meta, tr)
    rel, rtr = relief_grid(); mask, mtr, _ = flat_mask()
    Pm = A["R"].mean(axis=1)
    v = at(rel, rtr, Pm); onf = on_mask(Pm, mask, mtr); a = A["A_spread"]
    Hs = {}
    for tag in ["sca", "prod"]:
        H, m = hand_grid(tag); Hs[tag] = hand_at(H, m, Pm)
    with np.errstate(invalid="ignore"):
        pass
    zgrid = np.fromfile("pilot/out/prod_grid.f32", dtype=np.float32).reshape(json.load(open("pilot/out/prod_grid.meta.json"))["ny"], -1)
    zm = json.load(open("pilot/out/prod_grid.meta.json"))
    boxes_utm = {k: box(*TO_UTM.transform(b[0], b[1]), *TO_UTM.transform(b[2], b[3])) for k, b in BOXES.items()}
    bb = box(BBOX["lon0"], BBOX["lat0"], BBOX["lon1"], BBOX["lat1"])
    # 基準：絞り込みなし（findings9 の base と同じ）
    VV = {"base": (0, 0, None, None), **variants()}
    res, layers = {}, {}
    print("条件 | 全体km | 扇状地km | 日光谷底km（700m未満）| 那須岳 範囲km・山頂間の最短経路 | 女峰赤薙 範囲km・山頂間の最短経路")
    for name, (rmin, amin, hdef, t) in VV.items():
        k = (v >= rmin) & (a >= amin) & (~onf if name != "base" else np.ones(len(a), bool))
        if hdef:
            with np.errstate(invalid="ignore"):
                k &= Hs[hdef] >= t   # NaN は False
        lines = process(A["R"][k], cell, True)
        P, W = sample_pts(lines)
        lo, la = TO_LL.transform(P[:, 0], P[:, 1]) if len(P) else (np.zeros(0), np.zeros(0))
        inb = (lo >= BBOX["lon0"]) & (lo <= BBOX["lon1"]) & (la >= BBOX["lat0"]) & (la <= BBOX["lat1"])
        r = {"total_km": float(W[inb].sum() / 1000)}
        for bn, (x0, y0, x1, y1) in BOXES.items():
            s = (lo >= x0) & (lo <= x1) & (la >= y0) & (la <= y1)
            r[bn] = float(W[s].sum() / 1000)
            if bn == "日光谷底":
                c = ((P[s, 0] - zm["x0"]) / zm["a"]).astype(int); rr = ((P[s, 1] - zm["y0"]) / zm["e"]).astype(int)
                r["日光谷底_700m未満"] = float(W[s][zgrid[rr, c] < LOW_M].sum() / 1000)
        for cn, (sa, sb) in CORRIDORS.items():
            r[cn] = corridor_connect(lines, sa, sb)
        res[name] = {"rmin": rmin, "amin": amin, "hand": hdef, "hmin": t, **r}
        print(f"  {name:<14} | {r['total_km']:6,.0f} | {r['扇状地']:6.1f} | {r['日光谷底']:6.1f}（{r['日光谷底_700m未満']:5.1f}）| "
              f"{r['那須岳']['km']:5.1f}・経路 {r['那須岳']['path_km'] or float('nan'):.2f}km | {r['女峰赤薙']['km']:5.1f}・経路 {r['女峰赤薙']['path_km'] or float('nan'):.2f}km", flush=True)
        layers[f"ridge_{name}"] = clip_ll(lines, TO_LL, bb)
    # HAND の分布（区間・場所ごと）
    dist = {}
    for bn, (x0, y0, x1, y1) in BOXES.items():
        lo, la = TO_LL.transform(Pm[:, 0], Pm[:, 1])
        s = (lo >= x0) & (lo <= x1) & (la >= y0) & (la <= y1) & (a >= 3e5)
        dist[bn] = {tag: {"nan": float(np.isnan(Hs[tag][s]).mean()), "p": [float(x) for x in np.nanpercentile(Hs[tag][s], [10, 25, 50, 75, 90])]} for tag in Hs}
    res["_hand_dist_ridge_segments_a3e5"] = dist
    print("\n場所ごとの尾根の区間（A_spread≧30万）の HAND の分布:", json.dumps(dist, ensure_ascii=False))
    json.dump(res, open("pilot/out/hand_trial.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    pickle.dump({"layers": layers}, open("pilot/out/layers_hand.pkl", "wb"))


if __name__ == "__main__":
    main()
