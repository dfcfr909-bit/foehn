#!/usr/bin/env python3
# WindNinja の出力（ASCII グリッド）を比べる（調査）。
# 使い方: python3 analyze.py <出力の親ディレクトリ>
# 比べるもの：入力の風速を変えても倍率が同じか（線形か）／風向を ±22.5° 変えたときの差（16方位で足りるか）／升目 30・60・120m の差
import sys, glob, os, math, subprocess
import numpy as np

root = sys.argv[1]
def rd(p):
    h = {}
    with open(p) as f:
        for _ in range(6):
            k, v = f.readline().split(); h[k.lower()] = float(v)
        a = np.loadtxt(f)
    a = np.where(a < -9000, np.nan, a)
    return h, a
def load(tag):
    d = os.path.join(root, 'out_' + tag)
    v = glob.glob(d + '/*_vel.asc')[0]; g = glob.glob(d + '/*_ang.asc')[0]
    hv, av = rd(v); _, ag = rd(g)
    return hv, av, ag
def inp(tag): return {'s5': 5, 's20': 20}.get(tag, 10)

base_h, base_v, base_a = load('base')
R0 = base_v / 10
def stats(d):
    d = d[np.isfinite(d)]
    return f'中央 {np.median(np.abs(d)):.3f}・95% {np.percentile(np.abs(d), 95):.3f}・最大 {np.max(np.abs(d)):.3f}'
def angdiff(a, b): return (a - b + 180) % 360 - 180

print('## 線形か（入力 5・20 m/s の倍率と 10 m/s の倍率の差）')
for t in ['s5', 's20']:
    _, v, a = load(t)
    print(f'- {t}: 倍率の差 {stats(v / inp(t) - R0)}／向きの差（度）{stats(angdiff(a, base_a))}')

print('## 風向を ±22.5° 変えたとき（倍率の差。16方位の丸めの最大のずれは ±11.25°）')
for t in ['d293', 'd338']:
    _, v, a = load(t)
    print(f'- {t}: 倍率の差 {stats(v / 10 - R0)}')

# 地点（緯度経度 → UTM 54N → 升目）
# 座標はおおよそ（DEM の標高で谷川岳 1,964m・天神平 1,357m・土合 681m を確かめた）
PTS = {'谷川岳（トマの耳付近）': (36.8375, 138.9300), '天神平': (36.8306, 138.9447), '土合（谷）': (36.8341, 138.9665)}
def cell(h, a, lat, lon):
    x, y = map(float, subprocess.run(['gdaltransform', '-s_srs', 'EPSG:4326', '-t_srs', 'EPSG:32654'], input=f'{lon} {lat}', capture_output=True, text=True).stdout.split()[:2])
    c = int((x - h['xllcorner']) / h['cellsize']); r = int(a.shape[0] - (y - h['yllcorner']) / h['cellsize'])
    return a[r, c] if 0 <= r < a.shape[0] and 0 <= c < a.shape[1] else float('nan')
print('## 升目の細かさ（地点の倍率・北西 10 m/s）')
print('| 地点 | 30m | 60m | 120m |\n|---|---|---|---|')
res = {t: load(t) for t in ['r30', 'base', 'r120']}
for name, (lat, lon) in PTS.items():
    print(f'| {name} | ' + ' | '.join(f'{cell(res[t][0], res[t][1], lat, lon) / 10:.2f}' for t in ['r30', 'base', 'r120']) + ' |')
for t in ['r30', 'base', 'r120']:
    v = res[t][1] / 10
    print(f'- {t}: 倍率の 5%点 {np.nanpercentile(v, 5):.2f}・中央 {np.nanmedian(v):.2f}・95%点 {np.nanpercentile(v, 95):.2f}')
