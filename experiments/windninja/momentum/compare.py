#!/usr/bin/env python3
# 質量保存と運動量（OpenFOAM）の解を比べる（調査・findings-04）。
# 使い方: python3 compare.py <作業ディレクトリ> <地形.tif> <出力ディレクトリ>
#   <作業>/<解法>_<方位>/ に WindNinja の *_vel.asc・*_ang.asc がある前提（解法＝mass|mom、方位＝315|135）
# 見るもの：①逆向きの風で倍率が同じか（質量保存は同じ＝風下の陰が出ない）②風上が開けた所（Sx＜−10°）と
#   風下の陰（Sx＞10°）の平均の倍率 ③谷川岳の山頂の倍率。地図の画像も書く
import sys, glob, os, math, subprocess
import numpy as np
from PIL import Image, ImageDraw

WORK, DEM, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
def read_asc(path):
    head = {}
    with open(path) as f:
        while True:
            pos = f.tell(); line = f.readline()
            if not line or not line.strip()[:1].isalpha(): f.seek(pos); break
            k, v = line.split()[:2]; head[k.lower()] = float(v)
        a = np.loadtxt(f)
    return head, np.where(a < -9000, np.nan, a)
def load(tag):
    d = os.path.join(WORK, tag)
    h, v = read_asc(glob.glob(d + '/*_vel.asc')[0]); _, a = read_asc(glob.glob(d + '/*_ang.asc')[0])
    return h, v / 10.0, a
runs = {t: load(t) for t in ['mass_315', 'mass_135', 'mom_315', 'mom_135'] if glob.glob(os.path.join(WORK, t, '*_vel.asc'))}
# 質量保存の2回は必ず要る（運動量は失敗しうるので、欠けは「解なし」と書いて続ける）
for t in ['mass_315', 'mass_135']:
    if t not in runs: sys.exit(f'{t} の解が無い')
h0 = runs['mass_315'][0]; cs = h0['cellsize']
# 地形を風の格子に合わせる
dem60 = os.path.join(WORK, 'dem60.asc')
subprocess.run(['gdalwarp', '-q', '-overwrite', '-te', str(h0['xllcorner']), str(h0['yllcorner']), str(h0['xllcorner'] + h0['ncols'] * cs), str(h0['yllcorner'] + h0['nrows'] * cs),
                '-tr', str(cs), str(cs), '-r', 'average', '-of', 'AAIGrid', DEM, dem60], check=True)
_, z = read_asc(dem60)
def sx(z, from_deg, dmax=300):
    r = math.radians(from_deg); ux, uy = math.sin(r), -math.cos(r)   # 風上へ（東・南＝行が増える向き）
    best = np.full(z.shape, -np.inf)
    for k in range(1, int(dmax / cs) + 1):
        sh = np.roll(np.roll(z, -int(round(uy * k)), axis=0), -int(round(ux * k)), axis=1)
        best = np.maximum(best, (sh - z) / (k * cs))
    return np.degrees(np.arctan(best))
lines = []
for d in [315, 135]:
    S = sx(z, d)
    for solver in ['mass', 'mom']:
        t = f'{solver}_{d}'
        if t not in runs: lines.append(f'{t}: 解なし'); continue
        R = runs[t][1]; m = 5
        Ri, Si = R[m:-m, m:-m], S[m:-m, m:-m]
        exp, lee = np.nanmean(Ri[Si < -10]), np.nanmean(Ri[Si > 10])
        lines.append(f'{t}: 風上が開けた所（Sx<-10°）の倍率 {exp:.2f}・風下の陰（Sx>10°）{lee:.2f}・比 {lee / exp:.2f}・中央 {np.nanmedian(R):.2f}')
for solver in ['mass', 'mom']:
    a, b = f'{solver}_315', f'{solver}_135'
    if a in runs and b in runs:
        dd = np.abs(runs[a][1] - runs[b][1])
        lines.append(f'{solver}: 北西と南東の倍率の差 中央 {np.nanmedian(dd):.3f}・95%点 {np.nanpercentile(dd, 95):.3f}（0 なら風下の陰が出ていない）')
# 谷川岳
x, y = map(float, subprocess.run(['gdaltransform', '-s_srs', 'EPSG:4326', '-t_srs', 'EPSG:32654'], input='138.9301 36.8371', capture_output=True, text=True).stdout.split()[:2])
c, r = int((x - h0['xllcorner']) / cs), int(h0['nrows'] - (y - h0['yllcorner']) / cs)
assert 0 <= c < h0['ncols'] and 0 <= r < h0['nrows'], f'谷川岳が範囲の外（{c}, {r}）。gdaltransform の軸の順を疑う'
for t in runs: lines.append(f'谷川岳の山頂 {t}: {runs[t][1][r, c]:.2f}')
# 画像（地形の陰影 × 倍率の色）
gy, gx = np.gradient(np.nan_to_num(z), cs); sl = np.arctan(np.hypot(gx, gy)); asp = np.arctan2(-gx, gy)
hs = np.clip(np.cos(sl) * 0.7 + np.sin(sl) * np.cos(asp - math.radians(135)) * 0.6, 0, 1)
def col(R):
    t = np.clip(R, 0, 2.5); img = np.zeros(R.shape + (3,))
    lo = t < 1; u = np.clip((1 - t) / 0.6, 0, 1); w = np.clip((t - 1) / 1.2, 0, 1)
    img[..., 0] = np.where(lo, 255 * (1 - u) + 30 * u, 255 * (1 - w) + 210 * w)
    img[..., 1] = np.where(lo, 255 * (1 - u) + 90 * u, 255 * (1 - w) + 40 * w)
    img[..., 2] = np.where(lo, 255 * (1 - u) + 200 * u, 255 * (1 - w) + 30 * w)
    return img * (0.45 + 0.55 * hs[..., None])
for t, (_, R, A) in runs.items():
    im = Image.fromarray(np.nan_to_num(col(R)).astype(np.uint8)).resize((R.shape[1] * 2, R.shape[0] * 2), Image.BILINEAR)
    dr = ImageDraw.Draw(im)
    for yy in range(4, R.shape[0], 10):
        for xx in range(4, R.shape[1], 10):
            if not np.isfinite(A[yy, xx]): continue
            th = math.radians(A[yy, xx] + 180); L = 4 + 5 * min(R[yy, xx], 2)
            cx, cy = xx * 2, yy * 2; dr.line((cx, cy, cx + L * math.sin(th), cy - L * math.cos(th)), fill=(20, 20, 20), width=2)
    dr.ellipse((c * 2 - 6, r * 2 - 6, c * 2 + 6, r * 2 + 6), outline=(0, 0, 0), width=3)
    im.convert('RGB').save(os.path.join(OUT, f'{t}.jpg'), quality=75)
open(os.path.join(OUT, 'result.txt'), 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines))
