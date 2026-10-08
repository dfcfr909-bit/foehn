# 試作（栃木北部）：A_out≧1,000万m² の沢の「切れ端」の原因調査（新規）。LANDMARK の再計算はしない（m3 の区間を使う）。
#   切れ端：A_out≧1,000万m² の区間（平坦面マスク後）のつながり（端点を共有する区間の塊）のうち、
#           bbox の端（範囲の外へ続く）に届かないもの。大きい川は範囲の外へ出るか、別の 1,000万m² の川に合流するので、
#           どちらにも届かない塊を「切れ端」とする（上流側は 1,000万m² 未満の沢につながるのが普通なので、上流端は問わない）。
#   原因（塊の「行き止まり」の端点ごとに、次の順で判定。塊の原因は、長さが最も長い端の原因ではなく、下流端（標高が最も低い端点）の原因）：
#     (a) 平坦面マスク：端点の 60m 以内に、マスクで捨てた A_out≧1,000万m² の区間がある
#     (d) タイルの継ぎ目：端点で全部の沢（A_out≧10万m²）につながる区間のうち、別のタイルから来た区間の A_out が 1,000万m² 未満
#         （下流の区間を計算したタイルでは上流の集水が見えず、A_out が過小になって段から落ちる）
#     (e1) 同じタイルの中で、つながる区間の A_out が 1,000万m² 未満（A_out が下流で小さくなる）
#     (d′) 升目のずれ：端点を共有する下流の区間は無いが、45m（升目1.5個）以内に塊の外の低い区間がある
#     (b) 行き止まり：上のどれでもない（近くに下流の区間が無い＝流れの経路が途切れる）
#   ※ 下流の区間＝端点につながる区間のうち、反対側の端点が低い（または同じ高さの）もの（上流から来る支流は除く）
#     (e) その他
#   (c) 人工の段差（水路・道路・盛土）は自動では判定できないので、地理院の標準地図と重ねた画像（非公開）で目視する。
#   ⚠ 出力（pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/fragment_check.py
import json
import numpy as np
from collections import defaultdict
from pyproj import Transformer
from scipy.spatial import cKDTree
from scipy.sparse import csr_matrix
from scipy.sparse.csgraph import connected_components
import rasterio
from shapely.geometry import LineString, MultiLineString
from pilot_lines import load_meta, master_info, assemble, flat_mask, on_mask, process
from prepare_dem import BBOX, UTM

LV = 1e7
GAP_M = 45.0
TO_LL = Transformer.from_crs(UTM, 4326, always_xy=True)


def keyf(p):
    return (round(float(p[0]), 2), round(float(p[1]), 2))


def main():
    meta = load_meta(); tr, cell = master_info()
    A = assemble(sorted(n for n, t in meta["tiles"].items() if t.get("margin") == "m3"), meta, tr)
    S, Ao, St = A["S"], A["A_out"], A["S_tile"]
    mask, mtr, _ = flat_mask()
    onf = on_mask(S.mean(axis=1), mask, mtr)
    with rasterio.open("pilot/data/master_z12.tif") as d:
        Z = d.read(1); T = d.transform
    zat = lambda p: float(Z[int((p[1] - T.f) / T.e), int((p[0] - T.c) / T.a)])
    # 全部の沢（A_out≧10万）の端点 → 区間の番号
    node_segs = defaultdict(list)
    for i, s in enumerate(S):
        node_segs[keyf(s[0])].append(i); node_segs[keyf(s[1])].append(i)
    K = np.where((Ao >= LV) & ~onf)[0]
    gtree = cKDTree(S.reshape(-1, 2))   # 全部の沢の区間の端点（2つずつ）
    # タイルの継ぎ目（芯の境界。外周を除く）
    t0 = meta["tiles"]["m3_t0_0"]; core = meta["core_cells"]
    XS = [tr.c + (t0["col"] + k * core) * tr.a for k in range(1, meta["nx"])]
    YS = [tr.f + (t0["row"] + k * core) * tr.e for k in range(1, meta["ny"])]
    masked = np.where((Ao >= LV) & onf)[0]
    mtree = cKDTree(S[masked].reshape(-1, 2)) if len(masked) else None
    # 1,000万の区間の塊
    keys = {}
    e = []
    for i in K:
        a, b = keyf(S[i][0]), keyf(S[i][1])
        for k in (a, b):
            keys.setdefault(k, len(keys))
        e.append((keys[a], keys[b]))
    n = len(keys)
    g = csr_matrix((np.ones(len(e)), ([x for x, _ in e], [y for _, y in e])), shape=(n, n))
    nc, lab = connected_components(g, directed=False)
    kxy = np.array(list(keys.keys()))
    deg = np.bincount(np.array([x for x, _ in e] + [y for _, y in e]), minlength=n)
    lo, la = TO_LL.transform(kxy[:, 0], kxy[:, 1])
    tol_deg = 0.0006   # 約50m
    at_edge = (lo < BBOX["lon0"] + tol_deg) | (lo > BBOX["lon1"] - tol_deg) | (la < BBOX["lat0"] + tol_deg) | (la > BBOX["lat1"] - tol_deg)
    outside = (lo < BBOX["lon0"]) | (lo > BBOX["lon1"]) | (la < BBOX["lat0"]) | (la > BBOX["lat1"])
    seg_comp = lab[[keys[keyf(S[i][0])] for i in K]]
    seg_len = np.hypot(*(S[K][:, 1] - S[K][:, 0]).T)
    frags = []
    for c in range(nc):
        nodes = np.where(lab == c)[0]
        if at_edge[nodes].any() or outside[nodes].all():
            continue
        inb = ~outside[nodes]
        if not inb.any():
            continue
        L = float(seg_len[seg_comp == c].sum())
        ends = nodes[deg[nodes] == 1]
        if not len(ends):
            ends = nodes
        zs = np.array([zat(kxy[j]) for j in ends])
        dn = ends[int(np.argmin(zs))]   # 下流端＝行き止まりの端点のうち最も低い
        p = kxy[dn]; kk = keyf(p)
        comp_segs = set(K[seg_comp == c])
        zp = zat(p)
        # 下流の区間：端点につながる区間（塊の外）のうち、反対側の端点が低い（または同じ高さの）もの。上流から来る支流は除く
        far = lambda j: S[j][1] if keyf(S[j][0]) == kk else S[j][0]
        adj = [j for j in node_segs[kk] if j not in comp_segs and zat(far(j)) <= zp + 0.5]
        my_tiles = {St[j] for j in node_segs[kk] if j in comp_segs}
        cause, detail = "e", ""
        if mtree is not None and mtree.query(p)[0] <= 60:
            cause = "a"
        elif adj:
            other = [j for j in adj if St[j] not in my_tiles]
            same = [j for j in adj if St[j] in my_tiles]
            if other and max(Ao[j] for j in other) < LV:
                cause = "d"; detail = f"下流側の区間 A_out {max(Ao[j] for j in other)/1e4:.0f}万m²（別タイル）・切れ端の端 {min(Ao[j] for j in node_segs[kk] if j in comp_segs)/1e4:.0f}万m²"
            elif same and max(Ao[j] for j in same) < LV:
                cause = "e1"; detail = f"下流側の区間 A_out {max(Ao[j] for j in same)/1e4:.0f}万m²（同じタイル）"
        else:
            # 端点を共有する下流の区間が無い：45m 以内に、塊の外の（より低い）区間の端点があれば「升目のずれ」
            d_near, j_near = gtree.query(p, k=8, distance_upper_bound=GAP_M)
            cand = [int(jj) // 2 for dd, jj in zip(np.atleast_1d(d_near), np.atleast_1d(j_near)) if np.isfinite(dd) and int(jj) // 2 not in comp_segs]
            cand = [j for j in cand if min(zat(S[j][0]), zat(S[j][1])) <= zp + 0.5]
            if cand:
                cause = "g"; j = cand[0]
                detail = f"45m 以内の区間 A_out {Ao[j]/1e4:.0f}万m²（{'別タイル' if St[j] not in my_tiles else '同じタイル'}）"
            else:
                cause = "b"
        lon, lat = TO_LL.transform(*p)
        seam_m = float(min(np.abs(p[0] - np.array(XS)).min(), np.abs(p[1] - np.array(YS)).min()))
        frags.append({"comp": int(c), "len_m": L, "seam_m": round(seam_m, 1), "n_seg": int((seg_comp == c).sum()), "down_lonlat": [round(lon, 5), round(lat, 5)],
                      "down_z": round(zat(p), 1), "cause": cause, "detail": detail,
                      "a_out_max": float(Ao[list(comp_segs)].max()), "a_out_min": float(Ao[list(comp_segs)].min())})
    frags.sort(key=lambda f: -f["len_m"])
    tot = seg_len.sum()
    print(f"A_out≧1,000万m² の区間（平坦面マスク後）：{len(K)}区間・{tot/1000:.1f}km・塊 {nc}")
    print(f"切れ端（bbox の端に届かない塊）：{len(frags)}個・{sum(f['len_m'] for f in frags)/1000:.1f}km（区間の折れ線の長さ）")
    by = defaultdict(lambda: [0, 0.0])
    for f in frags:
        by[f["cause"]][0] += 1; by[f["cause"]][1] += f["len_m"]
    names = {"g": "(d′) 升目のずれ（45m 以内に下流の区間があるが端点を共有しない）", "a": "(a) 平坦面マスク", "d": "(d) タイルの継ぎ目（下流のタイルで A_out が過小）", "e1": "(e) 同じタイル内で A_out が下流で小さくなる", "b": "(b) 行き止まり", "e": "(e) その他"}
    for k2, (c2, L2) in sorted(by.items(), key=lambda x: -x[1][1]):
        print(f"  {names[k2]}: {c2}個・{L2/1000:.1f}km")
    for f in frags:
        print(f"  {f['len_m']/1000:5.2f}km {f['n_seg']:4d}区間 下流端 {f['down_lonlat']} 標高{f['down_z']}m 継ぎ目から{f['seam_m']:.0f}m 原因 {f['cause']} {f['detail']}")
    print("\n原因ごとの、下流端から最寄りの継ぎ目までの距離（中央値・最大）:")
    for k2 in by:
        ds = [f["seam_m"] for f in frags if f["cause"] == k2]
        print(f"  {names[k2]}: 中央値 {np.median(ds):.0f}m・最大 {max(ds):.0f}m・100m以内 {sum(d <= 100 for d in ds)}/{len(ds)}個")

    # 後処理（つなぎ直し→ヒゲ刈り→ならし→間引き）した線での切れ端（見た目の数）
    lines = process(S[K], cell, True)
    ends = []
    for i, l in enumerate(lines):
        for c in (l.coords[0], l.coords[-1]):
            ends.append((c, i))
    keys2 = {}
    rows, cols = [], []
    for c, i in ends:
        k = keyf(c); keys2.setdefault(k, len(keys2))
    m2 = len(lines) + len(keys2)
    for c, i in ends:
        rows.append(i); cols.append(len(lines) + keys2[keyf(c)])
    g2 = csr_matrix((np.ones(len(rows)), (rows, cols)), shape=(m2, m2))
    nc2, lab2 = connected_components(g2, directed=False)
    edge_line = []
    for l in lines:
        a = np.asarray(l.coords); lo2, la2 = TO_LL.transform(a[:, 0], a[:, 1])
        edge_line.append(bool(((lo2 < BBOX["lon0"] + tol_deg) | (lo2 > BBOX["lon1"] - tol_deg) | (la2 < BBOX["lat0"] + tol_deg) | (la2 > BBOX["lat1"] - tol_deg)).any()))
    comp_edge = defaultdict(bool); comp_len = defaultdict(float)
    for i, l in enumerate(lines):
        comp_edge[lab2[i]] |= edge_line[i]; comp_len[lab2[i]] += l.length
    fr2 = [c for c in comp_len if not comp_edge[c]]
    print(f"\n後処理した線での切れ端：{len(fr2)}個・{sum(comp_len[c] for c in fr2)/1000:.1f}km（線の塊 {len(comp_len)}）")
    json.dump({"segments": int(len(K)), "km": tot / 1000, "components": int(nc), "fragments": frags,
               "by_cause": {k2: {"n": v2[0], "km": v2[1] / 1000} for k2, v2 in by.items()},
               "processed_fragments": {"n": len(fr2), "km": sum(comp_len[c] for c in fr2) / 1000, "components": len(comp_len)}},
              open("pilot/out/fragment_check.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
