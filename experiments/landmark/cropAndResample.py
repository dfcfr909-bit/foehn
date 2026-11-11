# 男体山山頂の周り6km四方を切り出し、複数の解像度（0.5m・1m・2m・5m・10m・30m）に粗くする。
# 入力：栃木県 数値標高モデル(DEM)0.5m 図郭 09HD1（EPSG:6677・レーザー測量）
# 使い方: .venv/Scripts/python.exe cropAndResample.py
import numpy as np
import rasterio
from rasterio.windows import from_bounds
from rasterio.transform import from_origin
from rasterio.warp import reproject, Resampling
import os

SRC = r"C:\Users\dfcfr\Downloads\dem_09hd1.tif"
OUT_DIR = "data"
os.makedirs(OUT_DIR, exist_ok=True)

# 男体山山頂（36.7651, 139.4909）を EPSG:6677 に変換した座標（前段の計算）
CX, CY = -30571.0, 84946.0
HALF = 3000.0  # 周り3km（6km四方）

with rasterio.open(SRC) as src:
    win = from_bounds(CX - HALF, CY - HALF, CX + HALF, CY + HALF, transform=src.transform)
    win = win.round_offsets().round_lengths()
    print(f"切り出す窓: {win}（{win.width}×{win.height} 画素・0.5m）")
    data = src.read(1, window=win)
    win_transform = src.window_transform(win)
    crs = src.crs
    nodata = src.nodata

valid = np.isfinite(data) & (data != nodata)
print(f"値あり: {valid.sum()}/{data.size}（{valid.mean()*100:.1f}%）")
if valid.any():
    print(f"標高範囲: {data[valid].min():.1f}m 〜 {data[valid].max():.1f}m")

# 0.5m のまま保存（このあとの解像度変換の元）
half_path = os.path.join(OUT_DIR, "nantai_0.5m.tif")
with rasterio.open(half_path, "w", driver="GTiff", width=data.shape[1], height=data.shape[0],
                    count=1, dtype="float32", crs=crs, transform=win_transform, nodata=nodata,
                    compress="deflate") as dst:
    dst.write(data.astype("float32"), 1)
print(f"書いた: {half_path}")

# 粗くする解像度（m）。平均でダウンサンプル（LANDMARK に通す前提の升目数を見て決める）
for res in [1, 2, 5, 10, 30]:
    scale = res / 0.5
    new_w = int(data.shape[1] / scale)
    new_h = int(data.shape[0] / scale)
    new_transform = rasterio.transform.from_origin(win_transform.c, win_transform.f, res, res)
    dst_arr = np.full((new_h, new_w), np.nan, dtype="float32")
    src_arr = np.where(valid, data, np.nan).astype("float32")
    reproject(
        source=src_arr, destination=dst_arr,
        src_transform=win_transform, src_crs=crs,
        dst_transform=new_transform, dst_crs=crs,
        resampling=Resampling.average,
    )
    out_nodata = -9999.0
    dst_arr = np.where(np.isfinite(dst_arr), dst_arr, out_nodata)
    out_path = os.path.join(OUT_DIR, f"nantai_{res}m.tif")
    with rasterio.open(out_path, "w", driver="GTiff", width=new_w, height=new_h,
                        count=1, dtype="float32", crs=crs, transform=new_transform,
                        nodata=out_nodata, compress="deflate") as dst:
        dst.write(dst_arr, 1)
    n_valid = (dst_arr != out_nodata).sum()
    print(f"{res}m: {new_w}×{new_h}（{new_w*new_h}升目）・値あり {n_valid}（{n_valid/(new_w*new_h)*100:.1f}%） → {out_path}")
