#!/usr/bin/env python3
# 風の細分化の表を1山域ぶん作る（WindNinja・質量保存の解法）。experiments/windninja/README.md「段3の計画」
#
# 使い方: python3 buildWindTable.py <山域id> <WindNinja_cli> <WINDNINJA_DATA> <作業ディレクトリ> <出力ディレクトリ>
#   → <出力>/<id>.png（16方位を縦に積む。R＝倍率×100・G＝向きの曲がり（度）＋128・A＝255／欠けは 0）
#     <出力>/<id>.json（範囲・升目・方位の並び・峰ごとの倍率など）
#
# ⚠ 倍率は「範囲の平均の地上10m風」を 1 とした値。端末では 判定の風 × 倍率(地点) ÷ 倍率(選択地点) で使う（案A）。
# ⚠ 範囲の取り方で倍率は 1〜2 割変わる（findings-02）。範囲は「峰を囲む長方形＋4km」に固定し、外周 1km は捨てる。
# ⚠ 入力の風速に対してほぼ線形（findings-02）なので 10 m/s の1回だけ解く。
# ⚠ 風向は吹いてくる向き（北風＝0°）。WindNinja の input_direction も同じ約束。
import sys, os, json, math, subprocess, time, glob, io, urllib.request, datetime
import numpy as np
from PIL import Image

AREA_ID, CLI, WN_DATA, WORK, OUT = sys.argv[1:6]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
MARGIN_KM = 4.0      # 峰を囲む長方形の外へ足す幅
DROP_KM = 1.0        # 外周で捨てる幅（範囲の端の影響）
MESH_M = 60          # WindNinja の升目
DEM_Z = 14           # 地理院 DEM10B のズーム（約 10m）
INPUT_MS = 10.0
DIRS = [i * 22.5 for i in range(16)]
OUT_DEG = 0.0006     # 出力の格子（緯度方向。約 67m）。経度方向は緯度で伸ばす

def sh(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError(f'{cmd[0]} failed: {r.stderr[-800:]}')
    return r.stdout

areas = json.load(open(os.path.join(ROOT, 'areas.json')))['areas']
area = next(a for a in areas if a['id'] == AREA_ID)
peaks = area['peaks']
lat0, lat1 = min(p['lat'] for p in peaks), max(p['lat'] for p in peaks)
lon0, lon1 = min(p['lon'] for p in peaks), max(p['lon'] for p in peaks)
latc = (lat0 + lat1) / 2
dlat = MARGIN_KM / 111.0; dlon = MARGIN_KM / (111.0 * math.cos(math.radians(latc)))
S, N, W, E = lat0 - dlat, lat1 + dlat, lon0 - dlon, lon1 + dlon
zone = int((((lon0 + lon1) / 2) + 180) // 6) + 1
EPSG_UTM = 32600 + zone
os.makedirs(WORK, exist_ok=True); os.makedirs(OUT, exist_ok=True)
print(f'山域 {AREA_ID}（{area["name"]}）峰 {len(peaks)}・範囲 {S:.4f}〜{N:.4f}N {W:.4f}〜{E:.4f}E・UTM {zone}')

# ---- 地形：地理院 DEM10B のタイルを並べる（Webメルカトル）→ UTM 30m ----
R = 6378137.0; WM = 2 * math.pi * R; ts = WM / 2 ** DEM_Z
def tx(lon): return int((lon + 180) / 360 * 2 ** DEM_Z)
def ty(lat):
    r = math.radians(lat); return int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** DEM_Z)
x0, x1, y0, y1 = tx(W), tx(E), ty(N), ty(S)
arr = np.full(((y1 - y0 + 1) * 256, (x1 - x0 + 1) * 256), np.nan, dtype=np.float32)
miss = 0
for yy in range(y0, y1 + 1):
    for xx in range(x0, x1 + 1):
        url = f'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{DEM_Z}/{xx}/{yy}.png'
        for k in range(3):
            try:
                d = np.asarray(Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=30).read())).convert('RGB')).astype(np.int64); break
            except Exception as e:
                if '404' in str(e): d = None; break
                time.sleep(2 * (k + 1)); d = None
        if d is None: miss += 1; continue
        v = d[..., 0] * 65536 + d[..., 1] * 256 + d[..., 2]
        h = np.where(v < 2 ** 23, v, v - 2 ** 24) * 0.01
        arr[(yy - y0) * 256:(yy - y0 + 1) * 256, (xx - x0) * 256:(xx - x0 + 1) * 256] = np.where(v == 2 ** 23, np.nan, h)
print(f'標高タイル {(x1 - x0 + 1) * (y1 - y0 + 1)} 枚（配信なし {miss}）')
merc = os.path.join(WORK, 'dem_merc.asc')
with open(merc, 'w') as f:
    f.write(f'ncols {arr.shape[1]}\nnrows {arr.shape[0]}\nxllcorner {x0 * ts - WM / 2:.3f}\nyllcorner {WM / 2 - (y1 + 1) * ts:.3f}\ncellsize {ts / 256:.6f}\nNODATA_value -9999\n')
    np.savetxt(f, np.nan_to_num(arr, nan=-9999), fmt='%.2f')
dem = os.path.join(WORK, 'dem_utm30.tif')
sh(['gdalwarp', '-q', '-overwrite', '-s_srs', 'EPSG:3857', '-t_srs', f'EPSG:{EPSG_UTM}', '-te_srs', 'EPSG:4326', '-te', str(W), str(S), str(E), str(N),
    '-tr', '30', '30', '-r', 'bilinear', '-srcnodata', '-9999', '-dstnodata', '-9999', merc, dem])

# ---- 出力の格子（緯度経度・外周 DROP_KM を捨てる） ----
dl = DROP_KM / 111.0; dlo = DROP_KM / (111.0 * math.cos(math.radians(latc)))
oS, oN, oW, oE = S + dl, N - dl, W + dlo, E - dlo
lon_deg = OUT_DEG / math.cos(math.radians(latc))
nx = int(round((oE - oW) / lon_deg)); ny = int(round((oN - oS) / OUT_DEG))
print(f'出力の格子 {nx}×{ny}（{OUT_DEG}° × {lon_deg:.6f}°）')

def warp(src, out):
    sh(['gdalwarp', '-q', '-overwrite', '-s_srs', f'EPSG:{EPSG_UTM}', '-t_srs', 'EPSG:4326', '-te', str(oW), str(oS), str(oE), str(oN),
        '-ts', str(nx), str(ny), '-r', 'bilinear', '-srcnodata', '-9999', '-dstnodata', '-9999', '-of', 'AAIGrid', src, out])
    with open(out) as f:
        for _ in range(6): f.readline()
        a = np.loadtxt(f)
    return np.where(a < -9000, np.nan, a)

# ---- 16方位を解く ----
img = np.zeros((ny * 16, nx, 4), dtype=np.uint8)
peak_ratio = {p['name']: [] for p in peaks}
t_all = time.time()
for k, d in enumerate(DIRS):
    od = os.path.join(WORK, f'd{k:02d}'); os.makedirs(od, exist_ok=True)
    cfg = os.path.join(od, 'run.cfg')
    with open(cfg, 'w') as f:
        f.write(f'''num_threads = {os.cpu_count() or 2}
elevation_file = {dem}
initialization_method = domainAverageInitialization
input_speed = {INPUT_MS}
input_speed_units = mps
input_direction = {d}
input_wind_height = 10.0
units_input_wind_height = m
output_wind_height = 10.0
units_output_wind_height = m
output_speed_units = mps
vegetation = grass
mesh_resolution = {MESH_M}
units_mesh_resolution = m
write_ascii_output = true
ascii_out_resolution = {MESH_M}
units_ascii_out_resolution = m
output_path = {od}
''')
    t0 = time.time()
    sh([CLI, cfg], env=dict(os.environ, WINDNINJA_DATA=WN_DATA))
    vel = warp(glob.glob(od + '/*_vel.asc')[0], os.path.join(od, 'vel_ll.asc'))
    ang = warp(glob.glob(od + '/*_ang.asc')[0], os.path.join(od, 'ang_ll.asc'))
    # ⚠ 向きは双線形で補間すると 0/360 をまたぐ所で壊れる。曲がり（入力との差）にしてから補間しても、
    #   元の格子で差にしてから引き直すのが正しいが、差は ±数十度で 0/360 をまたがないので、出力側で差を取る（近似）
    ratio = vel / INPUT_MS
    turn = (ang - d + 180) % 360 - 180
    ok = np.isfinite(ratio) & np.isfinite(turn)
    blk = img[k * ny:(k + 1) * ny]
    blk[..., 0] = np.clip(np.round(np.nan_to_num(ratio) * 100), 0, 255).astype(np.uint8)
    blk[..., 1] = np.clip(np.round(np.nan_to_num(turn)) + 128, 0, 255).astype(np.uint8)
    blk[..., 3] = np.where(ok, 255, 0).astype(np.uint8)
    for p in peaks:
        c = int((p['lon'] - oW) / lon_deg); r = int((oN - p['lat']) / OUT_DEG)
        v = ratio[r, c] if 0 <= r < ny and 0 <= c < nx else float('nan')
        peak_ratio[p['name']].append(None if not np.isfinite(v) else round(float(v), 3))
    print(f'{d:6.1f}°  {time.time() - t0:5.1f} 秒  倍率 5%点 {np.nanpercentile(ratio, 5):.2f}・中央 {np.nanmedian(ratio):.2f}・95%点 {np.nanpercentile(ratio, 95):.2f}  '
          f'曲がり 95%点 {np.nanpercentile(np.abs(turn), 95):.0f}°  255超 {int(np.sum(ratio > 2.55))}')

Image.fromarray(img, 'RGBA').save(os.path.join(OUT, f'{AREA_ID}.png'), optimize=True)
wn_ver = os.environ.get('WINDNINJA_VERSION', '')
meta = {
    'area': AREA_ID, 'name': area['name'],
    'bounds': {'south': round(oS, 6), 'north': round(oN, 6), 'west': round(oW, 6), 'east': round(oE, 6)},
    'nx': nx, 'ny': ny, 'dirs': DIRS, 'dirNote': '吹いてくる向き（北風＝0°）。PNG は方位の順に縦に積む（1方位 ny 行）',
    'encoding': {'r': '倍率×100（範囲の平均の地上10m風＝1）', 'g': '向きの曲がり（度・時計回りが正）＋128', 'a': '255＝値あり／0＝欠け'},
    'peakRatio': peak_ratio,
    'solver': f'WindNinja {wn_ver}（質量保存）・domainAverage・入力 {INPUT_MS} m/s（地上10m）・植生 grass・升目 {MESH_M} m',
    'domain': f'峰を囲む長方形＋{MARGIN_KM:g}km で解き、外周 {DROP_KM:g}km を捨てた',
    'source': '地理院タイル（標高タイル）を加工して作成',
    'generated': datetime.date.today().isoformat(),
}
json.dump(meta, open(os.path.join(OUT, f'{AREA_ID}.json'), 'w'), ensure_ascii=False, indent=1)
size = os.path.getsize(os.path.join(OUT, f'{AREA_ID}.png'))
print(f'合計 {time.time() - t_all:.0f} 秒・PNG {size / 1e6:.2f} MB')
print('峰の倍率（北・東・南・西）:', {k: [v[0], v[4], v[8], v[12]] for k, v in peak_ratio.items()})
