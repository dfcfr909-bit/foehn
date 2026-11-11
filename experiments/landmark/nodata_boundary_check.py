# 調査2：DEM欠測境界（男体山10m＝中禅寺湖の湖面）付近を通る沢線・尾根線を調べる（新規）。
# 既存の out/nantai_10m_full の全量ネットワーク（キャッシュ済み）をそのまま使う。再計算はしない。
#
# 手順:
#   1. 欠測(nodata)マスクから境界画素を求め、KD-Treeで最短距離を引けるようにする
#   2. 沢線(hso>=5 / hso>=7)・尾根線(A_spread>=1e5)を、同じ id_ch / id_rdl でつなぎ直し「連続した線」にする
#   3. 各連続線について、境界から50m/100m以内にある長さの割合と、「境界に沿って連続して
#      張り付いている最長区間」（＝境界を横切るのではなく沿って走っている、の目安）を求める
#   4. 欠測域の内側（無効画素の上）に頂点が乗っている箇所がないかを確認する
#   5. 境界付近の拡大図を作る
#
# 使い方: .venv/Scripts/python.exe nodata_boundary_check.py
import json, os
import numpy as np
import rasterio
import geopandas as gpd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.collections import LineCollection
import matplotlib.font_manager as fm
from scipy import ndimage
from scipy.spatial import cKDTree

OUT = "out/render"
os.makedirs(OUT, exist_ok=True)
DEM_PATH = "data/nantai_10m.tif"
FULL_DIR = "out/nantai_10m_full"
STEM = "nantai_10m"
NEAR_TH = [50, 100]  # 境界からの判定距離(m)

JP_FONT = None
for cand in ["Yu Gothic", "Meiryo", "MS Gothic"]:
    try:
        JP_FONT = fm.FontProperties(fname=fm.findfont(cand, fallback_to_default=False))
        break
    except Exception:
        continue
if JP_FONT is None:
    JP_FONT = fm.FontProperties()


def load_dem():
    with rasterio.open(DEM_PATH) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        cell = d.res[0]
    h = np.where(h == nodata, np.nan, h)
    return h, transform, cell


def boundary_points(h, transform, cell):
    """欠測域の境界画素（陸地側）の世界座標の配列を返す"""
    invalid = ~np.isfinite(h)
    valid = ~invalid
    # 境界＝有効画素のうち、8近傍に無効画素を持つもの
    dil = ndimage.binary_dilation(invalid)
    boundary = dil & valid
    rows, cols = np.where(boundary)
    xs = transform.c + (cols + 0.5) * transform.a
    ys = transform.f + (rows + 0.5) * transform.e
    return np.column_stack([xs, ys]), invalid


def reconstruct_lines(gdf, group_col):
    """elementary な2点線分を group_col でつないで、連続した LineString の座標列にする"""
    lines = {}
    for _, row in gdf.iterrows():
        gid = row[group_col]
        xs, ys = row.geometry.xy
        pt_a, pt_b = (xs[0], ys[0]), (xs[1], ys[1])
        lines.setdefault(gid, []).append((pt_a, pt_b))
    result = {}
    for gid, segs in lines.items():
        # 端点をつないで1本の折れ線にする（同じ点を共有する前提。単純に隣接マッチで連結）
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
        result[gid] = {"pts": pts, "n_unlinked": len(remaining), "attrs": None}
    return result


def analyze_lines(lines, tree, invalid_mask, transform, cell, near_th_list):
    """各連続線について、境界近傍の長さ割合・最長連続区間・欠測侵入の有無を求める"""
    out = []
    for gid, info in lines.items():
        pts = np.array(info["pts"])
        if len(pts) < 2:
            continue
        seglen = np.hypot(np.diff(pts[:, 0]), np.diff(pts[:, 1]))
        total_len = seglen.sum()
        dist_to_boundary, _ = tree.query(pts, k=1)
        # 欠測画素に頂点が乗っていないか確認
        cols_px = ((pts[:, 0] - transform.c) / transform.a).astype(int)
        rows_px = ((pts[:, 1] - transform.f) / transform.e).astype(int)
        in_range = (rows_px >= 0) & (rows_px < invalid_mask.shape[0]) & (cols_px >= 0) & (cols_px < invalid_mask.shape[1])
        inside_nodata = 0
        if in_range.any():
            inside_nodata = invalid_mask[rows_px[in_range], cols_px[in_range]].sum()

        res = {"id": gid, "total_len": total_len, "n_pts": len(pts), "inside_nodata_pts": int(inside_nodata)}
        for th in near_th_list:
            near_mask = dist_to_boundary <= th
            # 境界近傍の長さ（区間の両端が近傍なら加算）
            near_seg = near_mask[:-1] & near_mask[1:]
            near_len = seglen[near_seg].sum()
            # 最長連続区間（近傍が連続する run の最大長）
            run_len, max_run = 0.0, 0.0
            for i, is_near in enumerate(near_seg):
                if is_near:
                    run_len += seglen[i]
                    max_run = max(max_run, run_len)
                else:
                    run_len = 0.0
            res[f"near_len_{th}"] = near_len
            res[f"max_run_{th}"] = max_run
            res[f"near_frac_{th}"] = near_len / total_len if total_len > 0 else 0
        out.append(res)
    return out


def main():
    h, transform, cell = load_dem()
    bpts, invalid_mask = boundary_points(h, transform, cell)
    print(f"欠測境界の画素数: {len(bpts)}")
    tree = cKDTree(bpts)

    slopes = gpd.read_file(f"{FULL_DIR}/slopelines_se_HSO_{STEM}.gpkg.gpkg")
    ridges = gpd.read_file(f"{FULL_DIR}/ridgelines_se_HSO_{STEM}.gpkg.gpkg")

    report_lines = ["# 調査2：DEM欠測境界（中禅寺湖）付近の沢線・尾根線（男体山10m）", ""]

    for tier_name, gdf, group_col, filt in [
        ("沢線 hso>=5", slopes, "id_ch", slopes["hso"] >= 5),
        ("沢線 hso>=7", slopes, "id_ch", slopes["hso"] >= 7),
        ("尾根線 A_spread>=1e5", ridges, "id_rdl", ridges["A_spread"] >= 1e5),
    ]:
        sub = gdf[filt]
        lines = reconstruct_lines(sub, group_col)
        analyzed = analyze_lines(lines, tree, invalid_mask, transform, cell, NEAR_TH)
        total_len_all = sum(a["total_len"] for a in analyzed)
        n_inside = sum(1 for a in analyzed if a["inside_nodata_pts"] > 0)
        report_lines.append(f"## {tier_name}")
        report_lines.append(f"- 連続線の本数: {len(analyzed)}・総延長: {total_len_all/1000:.2f}km")
        report_lines.append(f"- 頂点が欠測画素に乗っている線: {n_inside}本（構造的に起きないはずの確認）")
        for th in NEAR_TH:
            suspect = [a for a in analyzed if a[f"max_run_{th}"] >= 200 or a[f"near_frac_{th}"] >= 0.5]
            suspect_len = sum(a["total_len"] for a in suspect)
            near_any = [a for a in analyzed if a[f"near_len_{th}"] > 0]
            near_any_len = sum(a[f"near_len_{th}"] for a in near_any)
            report_lines.append(
                f"- 境界から{th}m以内: かすった線 {len(near_any)}本・近傍部分の長さ計 {near_any_len:.0f}m／"
                f"「境界に沿って{('200m以上連続' if th==NEAR_TH[0] else '200m以上連続')}または近傍が全体の50%以上」"
                f"＝境界由来を疑う線 {len(suspect)}本・その総延長 {suspect_len:.0f}m"
            )
            for a in sorted(suspect, key=lambda x: -x["total_len"])[:5]:
                report_lines.append(
                    f"    - id={a['id']}: 全長{a['total_len']:.0f}m・境界近傍最長連続{a[f'max_run_{th}']:.0f}m"
                    f"・境界近傍割合{a[f'near_frac_{th}']*100:.0f}%"
                )
        report_lines.append("")

    with open("out/nodata_boundary_report.md", "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
    print("\n".join(report_lines))

    # 拡大図：欠測境界付近
    render_zoom(h, transform, cell, slopes, ridges, invalid_mask)


def render_zoom(h, transform, cell, slopes, ridges, invalid_mask):
    ny, nx = h.shape
    dx = np.gradient(h, cell, axis=1); dy = np.gradient(h, cell, axis=0)
    slope = np.pi / 2 - np.arctan(np.hypot(dx, dy))
    aspect = np.arctan2(-dx, dy)
    az, alt = np.deg2rad(315), np.deg2rad(45)
    shade = np.clip(np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect), 0, 1)

    def w2p(x, y):
        return (np.asarray(x) - transform.c) / transform.a, (np.asarray(y) - transform.f) / transform.e

    fig, ax = plt.subplots(figsize=(9, 9))
    ax.imshow(shade, cmap="gray", extent=[0, nx, ny, 0], vmin=0, vmax=1)
    # 欠測域を青系半透明で重ねる
    overlay = np.zeros((ny, nx, 4))
    overlay[invalid_mask] = [0.2, 0.5, 1.0, 0.45]
    ax.imshow(overlay, extent=[0, nx, ny, 0])

    hso5 = slopes[slopes["hso"] >= 5]
    hso7 = slopes[slopes["hso"] >= 7]
    ridge_f = ridges[ridges["A_spread"] >= 1e5]

    def segs(gdf):
        out = []
        for geom in gdf.geometry:
            xs, ys = geom.xy
            c, r = w2p(np.array(xs), np.array(ys))
            out.append(np.column_stack([c, r]))
        return out

    ax.add_collection(LineCollection(segs(ridge_f), colors="#e60000", linewidths=0.6, zorder=3))
    ax.add_collection(LineCollection(segs(hso5), colors="#3366cc", linewidths=1.2, zorder=4))
    ax.add_collection(LineCollection(segs(hso7), colors="#001a66", linewidths=2.0, zorder=5))

    # 湖付近にズーム（左下）
    ax.set_xlim(0, nx * 0.45)
    ax.set_ylim(ny, ny * 0.5)
    ax.set_xticks([]); ax.set_yticks([])
    ax.set_title("男体山10m：DEM欠測境界（中禅寺湖・水色）付近の沢線・尾根線\n"
                  "赤=尾根(既定閾値)・青=沢筋hso≥5・濃紺=沢筋hso≥7", fontproperties=JP_FONT, fontsize=12)
    plt.tight_layout()
    out_path = f"{OUT}/nantai_10m_nodata_boundary_zoom.png"
    plt.savefig(out_path, dpi=150)
    plt.close(fig)
    print(f"\n書いた: {out_path}")


if __name__ == "__main__":
    main()
