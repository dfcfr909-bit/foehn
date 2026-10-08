# 試作（栃木北部）の共通処理（新規）：タイルの LANDMARK 出力の組み立てと、線の後処理。
#   組み立て：各タイルの出力（升目2点の短い区間）のうち、区間の中点が「芯」の中にあるものだけを採る（余白の分は捨てる）。
#             タイルはマスター DEM から升目をそろえて切り出しているので、隣のタイルの区間と座標が一致し、つなぎ直せる。
#   後処理（本番の VEC に合わせる）：
#     ① linemerge でつなぎ直す
#     ② ヒゲ刈り（任意）：行き止まりの 200m 未満の辺を刈る（2回）→ 分岐でなくなった所でつなぎ直す（本番 pruneEdges と同じ条件）
#     ③ ならし：頂点の列を [1,2,1] で4回（両端は固定・輪は一周でならす。本番 smoothPath と同じ）
#     ④ 間引き：Douglas–Peucker・升目の 0.25 個分（本番 VEC.SIMPLIFY_CELLS）
#     ⚠ 本番の順序は「ならし→間引き」（smoothPath）。依頼文は「間引き→ならし」の順に書かれていたが、本番と同じ順にした
#   平坦面マスク（沢だけ）：DEM の平坦面（5×5 升目の起伏 0.3m 未満・2ha 以上のかたまり・1升目ふくらませる。findings6 と同じ定義）に
#     中点が乗る沢の区間を捨てる。OSM は使わない。
import json, math, os
import numpy as np
import geopandas as gpd
from shapely.geometry import LineString, MultiLineString
from shapely.ops import linemerge
from scipy.ndimage import maximum_filter, minimum_filter, label, binary_dilation
import rasterio

MASTER = "pilot/data/master_z12.tif"
SPUR_M = 200.0
SMOOTH_PASS = 4
SIMPLIFY_CELLS = 0.25


def load_meta():
    return json.load(open("pilot/out/tiles_meta.json"))


def master_info():
    with rasterio.open(MASTER) as d:
        return d.transform, d.res[0]


def core_rect(t, tr):
    x0 = tr.c + t["col"] * tr.a; y1 = tr.f + t["row"] * tr.e
    return x0, y1 + t["h"] * tr.e, x0 + t["w"] * tr.a, y1   # x0, y0, x1, y1


def read_tile(name):
    d = f"pilot/out/lm/{name}"
    r = gpd.read_file(f"{d}/ridgelines_se_HSO_{name}.gpkg.gpkg")
    s = gpd.read_file(f"{d}/slopelines_se_HSO_{name}.gpkg.gpkg")
    R = np.array([np.asarray(g.coords)[[0, -1], :2] for g in r.geometry])
    S = np.array([np.asarray(g.coords)[[0, -1], :2] for g in s.geometry])
    return R, r["A_spread"].to_numpy(float), S, s["A_out"].to_numpy(float), s["hso"].to_numpy(int)


def assemble(names, meta, tr):
    """タイル名の並び → 芯の中の区間を集めたもの"""
    Rs, As, Ss, Ao, Hs, Rt, St = [], [], [], [], [], [], []
    for n in names:
        t = meta["tiles"][n]
        x0, y0, x1, y1 = core_rect(t, tr)
        R, a, S, ao, hs = read_tile(n)
        for seg, keep_list, attr_lists, tag in [(R, (Rs, Rt), [(As, a)], n), (S, (Ss, St), [(Ao, ao), (Hs, hs)], n)]:
            if not len(seg):
                continue
            m = seg.mean(axis=1)
            k = (m[:, 0] >= x0) & (m[:, 0] < x1) & (m[:, 1] >= y0) & (m[:, 1] < y1)
            keep_list[0].append(seg[k]); keep_list[1].extend([tag] * int(k.sum()))
            for lst, arr in attr_lists:
                lst.append(arr[k])
    cat = lambda L, shape: np.concatenate(L) if L else np.zeros(shape)
    return {"R": cat(Rs, (0, 2, 2)), "A_spread": cat(As, 0), "R_tile": np.array(Rt),
            "S": cat(Ss, (0, 2, 2)), "A_out": cat(Ao, 0), "hso": cat(Hs, 0).astype(int), "S_tile": np.array(St)}


def flat_mask():
    """DEM の平坦面（findings6 と同じ定義）→ (mask, transform)"""
    with rasterio.open(MASTER) as d:
        h = d.read(1).astype(float); nod = d.nodata; tr = d.transform; cell = d.res[0]
    ok = h != nod
    rng5 = maximum_filter(np.where(ok, h, -1e9), 5) - minimum_filter(np.where(ok, h, 1e9), 5)
    raw = ok & (rng5 < 0.3)
    lab, n = label(raw)
    sizes = np.bincount(lab.ravel(), minlength=n + 1)
    keep = np.zeros(n + 1, bool); keep[1:] = sizes[1:] >= 20000.0 / cell ** 2
    flat = keep[lab]
    return binary_dilation(flat, iterations=1), tr, flat


def on_mask(P, mask, tr):
    c = np.floor((P[:, 0] - tr.c) / tr.a).astype(int); r = np.floor((P[:, 1] - tr.f) / tr.e).astype(int)
    ok = (c >= 0) & (r >= 0) & (c < mask.shape[1]) & (r < mask.shape[0])
    out = np.zeros(len(P), bool); out[ok] = mask[r[ok], c[ok]]
    return out


# ---------------- 後処理 ----------------
def merge(segs):
    if not len(segs):
        return []
    m = linemerge(MultiLineString([LineString(s) for s in segs]))
    return list(m.geoms) if hasattr(m, "geoms") else [m]


def prune(lines, min_m=SPUR_M):
    """本番 pruneEdges と同じ条件：端の一方が行き止まり（次数1）で min_m 未満の辺を刈る（両端とも行き止まりで min_m 以上の孤立線は残す）。2回。
       そのあと、分岐でなくなった所（次数2）でつなぎ直す"""
    key = lambda p: (round(p[0], 3), round(p[1], 3))
    for _ in range(2):
        deg = {}
        for l in lines:
            for p in (l.coords[0], l.coords[-1]):
                deg[key(p)] = deg.get(key(p), 0) + 1
        keep = []
        for l in lines:
            a, b = deg[key(l.coords[0])], deg[key(l.coords[-1])]
            L = l.length
            if (a == 1 or b == 1) and not (a == 1 and b == 1 and L >= min_m) and L < min_m:
                continue
            keep.append(l)
        lines = keep
    return merge([np.asarray(c) for l in lines for c in zip(l.coords[:-1], l.coords[1:])]) if lines else []


def smooth_simplify(line, cell):
    xy = np.asarray(line.coords, float)
    closed = len(xy) > 3 and np.allclose(xy[0], xy[-1])
    for _ in range(SMOOTH_PASS):
        n = xy.copy()
        n[1:-1] = (xy[:-2] + 2 * xy[1:-1] + xy[2:]) / 4
        if closed:
            n[0] = n[-1] = (xy[-2] + 2 * xy[0] + xy[1]) / 4
        xy = n
    return LineString(xy).simplify(SIMPLIFY_CELLS * cell, preserve_topology=False)


def process(segs, cell, do_prune):
    lines = merge(segs)
    if do_prune:
        lines = prune(lines)
    return [smooth_simplify(l, cell) for l in lines if l.length > 0]
