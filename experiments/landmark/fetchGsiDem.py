# 地理院タイル（標高PNG）から矩形を切り出し、UTM（真の距離）へ再投影して GeoTIFF に書く。
# LANDMARK は投影座標系（等方なメートル升目）が必須。Web Mercator のタイルは緯度で
# 縮尺が歪む（実距離 = タイル距離 × cos(緯度)）ので、そのままでは面積・勾配が狂う。
# 使い方: python fetchGsiDem.py <lat> <lon> <半幅m> <zoom> <URLテンプレ> <出力.tif> [<UTM EPSG>]
import sys, math
import numpy as np
import requests
import rasterio
from rasterio.warp import reproject, Resampling
from rasterio.transform import Affine

R = 6378137.0  # Web Mercator の地球半径

def lonlat_to_merc(lon, lat):
    x = math.radians(lon) * R
    y = R * math.log(math.tan(math.pi/4 + math.radians(lat)/2))
    return x, y

def decode_tile(png_bytes):
    from PIL import Image
    import io
    im = np.array(Image.open(io.BytesIO(png_bytes)).convert("RGB")).astype(np.int64)
    v = im[:, :, 0]*65536 + im[:, :, 1]*256 + im[:, :, 2]
    nodata = (v == 8388608) | ((im[:, :, 0] == 128) & (im[:, :, 1] == 0) & (im[:, :, 2] == 0))
    z = np.where(v < 8388608, v, v - 16777216).astype(np.float64) * 0.01
    z[nodata] = np.nan
    return z

def fetch_mosaic(lat, lon, half_m, zoom, url_tpl, margin_m=0.0):
    cx, cy = lonlat_to_merc(lon, lat)
    merc_span = 2 * math.pi * R
    px_size = merc_span / (256 * 2**zoom)  # Web Mercator上の1画素の距離（m、緯度非依存）
    half_m += margin_m  # UTM とのずれ（回転）で端が欠けないよう、少し広めに取る
    x0, x1 = cx - half_m, cx + half_m
    y0, y1 = cy - half_m, cy + half_m  # Web Mercator の y は北が正
    n = 2**zoom
    def world_px(x, y):
        # GSI/標準スラインピータイル: 原点は左上=(-半周, +半周)
        px = (x + merc_span/2) / px_size
        py = (merc_span/2 - y) / px_size
        return px, py
    px0, py1 = world_px(x0, y0)
    px1, py0 = world_px(x1, y1)
    tx0, tx1 = int(px0 // 256), int(px1 // 256)
    ty0, ty1 = int(py0 // 256), int(py1 // 256)
    nx_tiles, ny_tiles = tx1 - tx0 + 1, ty1 - ty0 + 1
    print(f"タイル取得: z{zoom} x[{tx0},{tx1}] y[{ty0},{ty1}]（{nx_tiles}x{ny_tiles}枚）")
    mosaic = np.full((ny_tiles*256, nx_tiles*256), np.nan, dtype=np.float64)
    ok, miss = 0, 0
    for j, ty in enumerate(range(ty0, ty1+1)):
        for i, tx in enumerate(range(tx0, tx1+1)):
            url = url_tpl.format(z=zoom, x=tx, y=ty)
            try:
                r = requests.get(url, timeout=20, headers={"user-agent": "foehn-landmark-probe"})
                if r.status_code == 200:
                    mosaic[j*256:(j+1)*256, i*256:(i+1)*256] = decode_tile(r.content)
                    ok += 1
                else:
                    miss += 1
            except Exception as e:
                print(f"  失敗 z{zoom}/{tx}/{ty}: {e}")
                miss += 1
    print(f"  取得 {ok}枚・欠け {miss}枚")
    # モザイク全体の Web Mercator 変換（左上原点）
    mx0 = tx0*256*px_size - merc_span/2
    my0 = merc_span/2 - ty0*256*px_size
    transform = Affine(px_size, 0, mx0, 0, -px_size, my0)
    # 切り出し窓（要求範囲ちょうど）
    win_col0 = int(round((x0 - mx0) / px_size))
    win_row0 = int(round((my0 - y1) / px_size))
    win_w = int(round(2*half_m / px_size))
    win_h = int(round(2*half_m / px_size))
    crop = mosaic[win_row0:win_row0+win_h, win_col0:win_col0+win_w]
    crop_transform = transform * Affine.translation(win_col0, win_row0)
    return crop, crop_transform, px_size

def main():
    lat, lon, half_m, zoom = float(sys.argv[1]), float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4])
    url_tpl = sys.argv[5]
    out_path = sys.argv[6]
    utm_epsg = sys.argv[7] if len(sys.argv) > 7 else "EPSG:32654"

    # UTM は Web Mercator と軸がわずかに回転しているので、少し広め（+3%+500m）に取ってから
    # 再投影し、最後に厳密な範囲へ切り出す（端が nodata=0 で埋まる事故を防ぐ）
    margin_m = half_m * 0.03 + 500.0
    merc_arr, merc_transform, px_size = fetch_mosaic(lat, lon, half_m, zoom, url_tpl, margin_m=margin_m)
    valid = np.isfinite(merc_arr)
    print(f"値あり: {valid.sum()}/{merc_arr.size}（{valid.mean()*100:.1f}%）")
    if valid.any():
        print(f"標高範囲: {merc_arr[valid].min():.1f}m 〜 {merc_arr[valid].max():.1f}m")

    ground_res = px_size * math.cos(math.radians(lat))  # 実距離での升目（m）
    print(f"Web Mercator 升目 {px_size:.3f}m → 実距離 換算 {ground_res:.3f}m（UTM に再投影）")

    # 目的の範囲（中心 ± half_m）ちょうどの大きさへ、直接再投影する
    # （マージン分広く取った Mercator のモザイクが、UTM 軸の回転ぶんのズレを吸収する）
    from pyproj import Transformer
    t = Transformer.from_crs("EPSG:3857", utm_epsg, always_xy=True)
    cx_utm, cy_utm = t.transform(*lonlat_to_merc(lon, lat))
    win_n = int(round(2 * half_m / ground_res))
    dst_transform = Affine(ground_res, 0, cx_utm - half_m, 0, -ground_res, cy_utm + half_m)
    dst_arr = np.full((win_n, win_n), np.nan, dtype="float32")
    src = np.where(np.isfinite(merc_arr), merc_arr, np.nan).astype("float32")
    reproject(
        source=src, destination=dst_arr,
        src_transform=merc_transform, src_crs="EPSG:3857",
        dst_transform=dst_transform, dst_crs=utm_epsg,
        src_nodata=np.nan, dst_nodata=np.nan,
        resampling=Resampling.bilinear,
    )
    out_nodata = -9999.0
    dst_arr = np.where(np.isfinite(dst_arr), dst_arr, out_nodata)
    with rasterio.open(out_path, "w", driver="GTiff", width=win_n, height=win_n,
                        count=1, dtype="float32", crs=utm_epsg, transform=dst_transform,
                        nodata=out_nodata, compress="deflate") as dst:
        dst.write(dst_arr, 1)
    n_valid = (dst_arr != out_nodata).sum()
    print(f"書いた: {out_path}（{win_n}x{win_n}・{ground_res:.2f}m・値あり{n_valid/dst_arr.size*100:.1f}%）")

if __name__ == "__main__":
    main()
