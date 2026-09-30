# 試作（栃木北部）：マスター DEM をタイルに分け、余白を付けて LANDMARK（既定閾値）を回す（新規）。
#   芯のタイル：約10km（CORE 升目）四方を 7×6 枚。bbox（UTM の外接矩形）を覆う。升目の位置はマスターにそろえる。
#   余白：1km・3km の2通り（MARGINS）。各タイルの DEM は「芯＋余白」を切り出して、LANDMARK をそのまま実行する。
#   参照：中央の 3×3 枚ぶんの芯（約30km四方）＋3km を1回で計算する（中の継ぎ目が無い）。タイル境界の検証の基準にする。
#   既定閾値：--a_spread 1e5 --a_out 1e5 --hso_th 3（これまでの実験と同じ）
#   ⚠ 出力（pilot/data/・pilot/out/）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/run_tiles.py
import json, math, os, subprocess, sys, time
from concurrent.futures import ProcessPoolExecutor
import rasterio
from rasterio.windows import Window

MASTER = "pilot/data/master_z12.tif"
EXE = os.path.join(".venv", "Scripts", "landmark.exe")
CORE = 328                   # 芯の升目（30.54m × 328 ≒ 10.0km）
NX, NY = 7, 6                # 芯のタイルの数（東西・南北）
MARGINS = {"m1": 1000.0, "m3": 3000.0}
REF = {"i0": 2, "i1": 4, "j0": 1, "j1": 3}   # 参照：芯の列 2〜4・行 1〜3（3×3）を1枚で
BBOX_UTM = (352609.0, 4062014.0, 415694.0, 4118334.0)   # prepare_dem.py の出力（x0, y0, x1, y1）


def layout():
    with rasterio.open(MASTER) as d:
        tr, W, H, cell = d.transform, d.width, d.height, d.res[0]
    # 芯の格子の原点（左上）を、bbox の中心にそろえて、マスターの升目に丸める
    cx, cy = (BBOX_UTM[0] + BBOX_UTM[2]) / 2, (BBOX_UTM[1] + BBOX_UTM[3]) / 2
    col_c = (cx - tr.c) / tr.a; row_c = (tr.f - cy) / -tr.e
    col0 = int(round(col_c - NX * CORE / 2)); row0 = int(round(row_c - NY * CORE / 2))
    return {"tr": tr, "W": W, "H": H, "cell": cell, "col0": col0, "row0": row0}


def core_window(L, i, j, i1=None, j1=None):
    i1 = i if i1 is None else i1; j1 = j if j1 is None else j1
    return (L["col0"] + i * CORE, L["row0"] + j * CORE, (i1 - i + 1) * CORE, (j1 - j + 1) * CORE)   # col, row, w, h


def run_one(job):
    name, col, row, w, h, mcells = job
    tif = f"pilot/data/tiles/{name}.tif"
    outdir = f"pilot/out/lm/{name}"
    stem = os.path.basename(tif)[:-4]
    rid = os.path.join(outdir, f"ridgelines_se_HSO_{stem}.gpkg.gpkg")
    if os.path.exists(rid):
        return name, None, "既存"
    os.makedirs(os.path.dirname(tif), exist_ok=True); os.makedirs(outdir, exist_ok=True)
    with rasterio.open(MASTER) as d:
        win = Window(col - mcells, row - mcells, w + 2 * mcells, h + 2 * mcells)
        a = d.read(1, window=win)
        prof = d.profile.copy(); prof.update(width=a.shape[1], height=a.shape[0], transform=d.window_transform(win))
    with rasterio.open(tif, "w", **prof) as o:
        o.write(a, 1)
    t0 = time.time()
    r = subprocess.run([EXE, tif, "--output_dir", outdir, "--a_spread", "1e5", "--a_out", "1e5", "--hso_th", "3", "--no_data_values", "-9999"],
                       capture_output=True, text=True, encoding="utf-8", errors="replace")
    dt = time.time() - t0
    if r.returncode != 0 or not os.path.exists(rid):
        return name, dt, "失敗: " + (r.stderr or r.stdout)[-300:]
    return name, dt, f"{a.shape[1]}×{a.shape[0]}升目"


def main():
    L = layout()
    meta = {"core_cells": CORE, "cell_m": L["cell"], "nx": NX, "ny": NY, "col0": L["col0"], "row0": L["row0"],
            "margins": MARGINS, "ref": REF, "tiles": {}}
    jobs = []
    for mk, mm in MARGINS.items():
        mc = int(round(mm / L["cell"]))
        for j in range(NY):
            for i in range(NX):
                col, row, w, h = core_window(L, i, j)
                name = f"{mk}_t{i}_{j}"
                jobs.append((name, col, row, w, h, mc)); meta["tiles"][name] = {"i": i, "j": j, "margin": mk, "col": col, "row": row, "w": w, "h": h, "mcells": mc}
    col, row, w, h = core_window(L, REF["i0"], REF["j0"], REF["i1"], REF["j1"])
    mc = int(round(3000.0 / L["cell"]))
    ref_job = ("ref_m3", col, row, w, h, mc)
    meta["tiles"]["ref_m3"] = {"ref": True, "col": col, "row": row, "w": w, "h": h, "mcells": mc}
    os.makedirs("pilot/out", exist_ok=True)
    times = {}
    t0 = time.time()
    with ProcessPoolExecutor(4) as ex:   # 3km 余白のタイルで1本 約0.8GB（見積もり）。メモリ 15GB の PC で4並列
        for name, dt, msg in ex.map(run_one, jobs):
            times[name] = dt; print(name, f"{dt:.0f}秒" if dt else "", msg, flush=True)
    wall_tiles = time.time() - t0
    t1 = time.time()
    name, dt, msg = run_one(ref_job)   # 参照は大きい（約140万升目）ので単独で
    times[name] = dt; print(name, f"{dt:.0f}秒" if dt else "", msg, flush=True)
    meta["times_s"] = times; meta["wall_tiles_s"] = wall_tiles; meta["wall_ref_s"] = time.time() - t1
    json.dump(meta, open("pilot/out/tiles_meta.json", "w"), indent=1)
    for mk in MARGINS:
        ts = [v for k, v in times.items() if k.startswith(mk) and v]
        if ts:
            print(f"{mk}: {len(ts)}枚・1枚 {min(ts):.0f}〜{max(ts):.0f}秒・合計 {sum(ts)/60:.1f}分（CPU）")
    print(f"タイル全体の実時間 {wall_tiles/60:.1f}分（4並列）・参照 {meta['wall_ref_s']/60:.1f}分")


if __name__ == "__main__":
    main()
