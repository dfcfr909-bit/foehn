#!/usr/bin/env python3
# 風の細分化の表を1山域ぶん作る（WindNinja・質量保存の解法）。experiments/windninja/README.md「段3の計画」
#
# 使い方: python3 buildWindTable.py <山域id> <WindNinja_cli> <WINDNINJA_DATA> <作業ディレクトリ> <出力ディレクトリ>
#   → <出力>/<id>.png（8方位を縦に積む。R＝倍率×64・G＝向きの曲がり（度）×127/180＋128・A＝255／欠けは 0）
#     <出力>/<id>.json（範囲・升目・方位の並び・峰ごとの倍率など）
#
# ⚠ 倍率は「範囲の平均の地上10m風」を 1 とした値。端末では 判定の風 × 倍率(地点) ÷ 倍率(選択地点) で使う（案A）。
# ⚠ 範囲の取り方で倍率は 1〜2 割変わる（findings-02）。範囲は**峰を囲む長方形の中心から一辺 SIDE_KM の正方形に固定**し、
#   外周 1km は捨てる。峰が端から EDGE_KM より近ければ止める（範囲を山域ごとに変えない）。
# ⚠ 欠けを黙って通さない：標高タイルの通信の失敗・欠けの多い出力・倍率の頭打ちは、終了コード 1 で止める。
# ⚠ WindNinja は外へ通信させない（環境変数 WN_PREFIX に `sudo unshare -n` などを入れると、通信の無い名前空間で動かす）。
# ⚠ 入力の風速に対してほぼ線形（findings-02）なので 10 m/s の1回だけ解く。
# ⚠ 風向は吹いてくる向き（北風＝0°）。WindNinja の input_direction も同じ約束。
import sys, os, re, json, math, subprocess, time, glob, io, urllib.request, urllib.error, datetime, shlex
import numpy as np
from PIL import Image

AREA_ID, CLI, WN_DATA, WORK, OUT = sys.argv[1:6]
if not re.fullmatch(r'[a-z0-9-]+', AREA_ID):
    sys.exit(f'山域 id が不正: {AREA_ID!r}')
WN_PREFIX = shlex.split(os.environ.get('WN_PREFIX', ''))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
SIDE_KM = 32.0       # 解く範囲（正方形）の一辺。全山域で同じ
EDGE_KM = 3.0        # 峰がこれより端に近ければ止める
DROP_KM = 1.0        # 外周で捨てる幅（範囲の端の影響）
MESH_M = 60          # WindNinja の升目
DEM_Z = 14           # 地理院 DEM10B のズーム（約 10m）
INPUT_MS = 10.0
# ⚠ 質量保存の解は風を逆向きにすると流れが逆向きになるだけ（倍率・曲がりとも全升目で同じ。findings-03）。
#   逆向き（＋180°）は同じ表を使うので、0〜157.5° の 8方位だけ解く（端末は d と d−180 のどちらかで引く）
DIRS = [i * 22.5 for i in range(8)]
OUT_DEG = 0.0006     # 出力の格子（緯度方向。約 67m）。経度方向は緯度で伸ばす
R_SCALE = 64         # PNG の R＝倍率×64（0〜3.98）。超えたら止める
G_SCALE = 127 / 180  # PNG の G＝曲がり（度）×127/180＋128（±180° がそのまま入る・1.4° 刻み）。
                     # ⚠ 風がほぼ止まる升目（風下の渦）では向きが 180° 近く回ることが実際にある（谷川・67.5° で 0.004%）
MAX_MISSING = 0.02   # 出力の欠けの割合の上限（これを超えたら止める）
def fail(msg): print('✗ ' + msg); sys.exit(1)

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
latc, lonc = (lat0 + lat1) / 2, (lon0 + lon1) / 2
kmLat = 111.0; kmLon = 111.0 * math.cos(math.radians(latc))
h = SIDE_KM / 2
S, N, W, E = latc - h / kmLat, latc + h / kmLat, lonc - h / kmLon, lonc + h / kmLon
for p in peaks:
    d = min((p['lat'] - S) * kmLat, (N - p['lat']) * kmLat, (p['lon'] - W) * kmLon, (E - p['lon']) * kmLon)
    if d < EDGE_KM: fail(f'{p["name"]} が範囲の端から {d:.1f} km（{EDGE_KM:g} km 未満）。一辺 {SIDE_KM:g} km に収まらない山域')
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
miss = 0   # 404（配信なし＝海など）。通信の失敗は止める
for yy in range(y0, y1 + 1):
    for xx in range(x0, x1 + 1):
        url = f'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{DEM_Z}/{xx}/{yy}.png'
        d, err = None, None
        for k in range(4):
            try:
                d = np.asarray(Image.open(io.BytesIO(urllib.request.urlopen(url, timeout=30).read())).convert('RGB')).astype(np.int64); break
            except urllib.error.HTTPError as e:
                if e.code == 404: break
                err = e; time.sleep(2 ** (k + 1))
            except Exception as e:
                err = e; time.sleep(2 ** (k + 1))
        if d is None:
            if err is not None: fail(f'標高タイルが取れない: {url}（{err}）')
            miss += 1; continue
        v = d[..., 0] * 65536 + d[..., 1] * 256 + d[..., 2]
        h = np.where(v < 2 ** 23, v, v - 2 ** 24) * 0.01
        arr[(yy - y0) * 256:(yy - y0 + 1) * 256, (xx - x0) * 256:(xx - x0 + 1) * 256] = np.where(v == 2 ** 23, np.nan, h)
print(f'標高タイル {(x1 - x0 + 1) * (y1 - y0 + 1)} 枚（配信なし {miss}）')
if miss > 0.1 * (x1 - x0 + 1) * (y1 - y0 + 1): fail(f'配信なしの標高タイルが多すぎる（{miss} 枚）')
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

# ESRI ASCII グリッドを読む → (見出しの行, 値)。⚠ 見出しの行数は決め打ちしない（GDAL は升目が正方でないと
#   cellsize の代わりに dx・dy を書き、7行になる）
def read_asc(path):
    head = []
    with open(path) as f:
        while True:
            pos = f.tell(); line = f.readline()
            if not line or not line.strip()[:1].isalpha(): f.seek(pos); break
            head.append(line)
        a = np.loadtxt(f)
    return head, a

def warp(src, out):
    sh(['gdalwarp', '-q', '-overwrite', '-s_srs', f'EPSG:{EPSG_UTM}', '-t_srs', 'EPSG:4326', '-te', str(oW), str(oS), str(oE), str(oN),
        '-ts', str(nx), str(ny), '-r', 'bilinear', '-srcnodata', '-9999', '-dstnodata', '-9999', '-of', 'AAIGrid', src, out])
    _, a = read_asc(out)
    return np.where(a < -9000, np.nan, a)

# ---- 8方位を解く ----
img = np.zeros((ny * 16, nx, 4), dtype=np.uint8)
peak_ratio = {p['name']: [] for p in peaks}
ratio_max = 0.0
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
    sh(WN_PREFIX + ['env', f'WINDNINJA_DATA={WN_DATA}', CLI, cfg])
    vel = warp(glob.glob(od + '/*_vel.asc')[0], os.path.join(od, 'vel_ll.asc'))
    # ⚠ 向きそのもの（0〜360°）を双線形で引き直すと、北寄りの風で 355° と 5° の間が 180° になって壊れる。
    #   元の UTM の格子で入力との差（曲がり・±180）にしてから引き直す（曲がりは ±数十度で ±180 をまたがない）
    src_ang = glob.glob(od + '/*_ang.asc')[0]
    head, a0 = read_asc(src_ang)
    t0a = np.where(a0 < -9000, -9999, (a0 - d + 180) % 360 - 180)
    turn_src = os.path.join(od, 'turn.asc')
    with open(turn_src, 'w') as f:
        f.writelines(head); np.savetxt(f, t0a, fmt='%.2f')
    prj = src_ang[:-4] + '.prj'
    if os.path.exists(prj):
        with open(prj) as fi, open(turn_src[:-4] + '.prj', 'w') as fo: fo.write(fi.read())
    turn = warp(turn_src, os.path.join(od, 'turn_ll.asc'))
    ratio = vel / INPUT_MS
    big_turn = float(np.nanmean(np.abs(turn) > 90))   # 記録だけ（止めない）
    # 向きの約束の検査：出力の向き（_ang）が入力と同じ「吹いてくる向き」なら、範囲全体の曲がりの中央はほぼ 0。
    #   約束がずれていれば ±180 付近になる（全方位が逆向きで黙って通るのを止める）
    if abs(float(np.nanmedian(turn))) > 15: fail(f'{d}°：曲がりの中央が {np.nanmedian(turn):.0f}°（向きの約束が入力と違う疑い）')
    ok = np.isfinite(ratio) & np.isfinite(turn)
    blk = img[k * ny:(k + 1) * ny]
    if not np.isfinite(ratio).any(): fail(f'{d}°：出力が空')
    rmax = float(np.nanmax(ratio)); ratio_max = max(ratio_max, rmax)
    if rmax * R_SCALE > 255: fail(f'{d}°：倍率 {rmax:.2f} が PNG の上限 {255 / R_SCALE:.2f} を超える（R_SCALE を見直す）')
    miss_frac = 1 - ok.mean()
    if miss_frac > MAX_MISSING: fail(f'{d}°：欠けが {miss_frac:.1%}（上限 {MAX_MISSING:.0%}）')
    blk[..., 0] = np.round(np.nan_to_num(ratio) * R_SCALE).astype(np.uint8)
    blk[..., 1] = np.clip(np.round(np.nan_to_num(turn) * G_SCALE) + 128, 1, 255).astype(np.uint8)
    blk[..., 3] = np.where(ok, 255, 0).astype(np.uint8)
    for p in peaks:
        # 升目の幅は gdalwarp に渡した -te と -ts で決まる（丸める前の lon_deg・OUT_DEG ではない）。端末も bounds と nx・ny から同じ式で引く
        c = int((p['lon'] - oW) / ((oE - oW) / nx)); r = int((oN - p['lat']) / ((oN - oS) / ny))
        v = ratio[r, c] if 0 <= r < ny and 0 <= c < nx else float('nan')
        peak_ratio[p['name']].append(None if not np.isfinite(v) else round(float(v), 3))
    print(f'{d:6.1f}°  {time.time() - t0:5.1f} 秒  倍率 5%点 {np.nanpercentile(ratio, 5):.2f}・中央 {np.nanmedian(ratio):.2f}・95%点 {np.nanpercentile(ratio, 95):.2f}  '
          f'曲がり 95%点 {np.nanpercentile(np.abs(turn), 95):.0f}°・90°超 {big_turn:.3%}  最大 {rmax:.2f}  欠け {miss_frac:.2%}')

Image.fromarray(img, 'RGBA').save(os.path.join(OUT, f'{AREA_ID}.png'), optimize=True)
wn_ver = os.environ.get('WINDNINJA_VERSION', '')
meta = {
    'area': AREA_ID, 'name': area['name'],
    'bounds': {'south': round(oS, 6), 'north': round(oN, 6), 'west': round(oW, 6), 'east': round(oE, 6)},
    'nx': nx, 'ny': ny, 'cellNote': '升目の幅は (east−west)/nx・(north−south)/ny。行は北から', 'dirs': DIRS, 'dirNote': '吹いてくる向き（北風＝0°）。PNG は方位の順に縦に積む（1方位 ny 行）。逆向き（＋180°）は同じ表（倍率・曲がりとも同じ値）',
    'encoding': {'r': f'倍率×{R_SCALE}（範囲の平均の地上10m風＝1）', 'rScale': R_SCALE, 'g': '向きの曲がり（度・時計回りが正）×127/180＋128', 'gScale': round(G_SCALE, 6), 'a': '255＝値あり／0＝欠け'},
    'peakRatio': peak_ratio, 'ratioMax': round(ratio_max, 3),
    'solver': f'WindNinja {wn_ver}（質量保存）・domainAverage・入力 {INPUT_MS} m/s（地上10m）・植生 grass・升目 {MESH_M} m',
    'domain': {'sideKm': SIDE_KM, 'dropKm': DROP_KM, 'center': [round(latc, 5), round(lonc, 5)], 'utmZone': zone,
               'note': f'峰を囲む長方形の中心から一辺 {SIDE_KM:g}km の正方形で解き、外周 {DROP_KM:g}km を捨てた'},
    'source': '地理院タイル（標高タイル）を加工して作成',
    'generated': datetime.date.today().isoformat(),
}
for p in peaks:
    if any(v is None for v in peak_ratio[p['name']]): fail(f'{p["name"]} の倍率が欠けている')
json.dump(meta, open(os.path.join(OUT, f'{AREA_ID}.json'), 'w'), ensure_ascii=False, indent=1)
size = os.path.getsize(os.path.join(OUT, f'{AREA_ID}.png'))
print(f'合計 {time.time() - t_all:.0f} 秒・PNG {size / 1e6:.2f} MB')
print('峰の倍率（北・東・南・西）:', {k: [v[0], v[4], v[8], v[12]] for k, v in peak_ratio.items()})
