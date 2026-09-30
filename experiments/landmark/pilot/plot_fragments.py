# 試作の確認用（新規）：A_out≧1,000万m² の沢を、地理院の標準地図（z13）と重ねて描き、切れ端を原因ごとに色分けする。自分で見る用。
#   川の名前（蛇尾川・熊川など）の注記と、線の位置が合うかを目で確かめる。
# ⚠ 画像（pilot/out/fragments_*.png）は .gitignore 対象。コミットしない。背景の標準地図はその場で読み込み、保存しない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/plot_fragments.py [lon0 lat0 lon1 lat1 名前]
import io, json, math, sys, urllib.request
import numpy as np
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image
from pyproj import Transformer
from pilot_lines import load_meta, master_info, assemble, flat_mask, on_mask
from prepare_dem import UTM

ext = [float(v) for v in sys.argv[1:5]] if len(sys.argv) >= 5 else [139.85, 36.85, 140.05, 37.05]
name = sys.argv[5] if len(sys.argv) >= 6 else "nasunogahara"
Z = 13
plt.rcParams["font.family"] = ["Yu Gothic", "Meiryo", "sans-serif"]


def merc(lon, lat):
    n = 2 ** Z
    return (lon + 180) / 360 * n * 256, (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n * 256


x0, y1 = merc(ext[0], ext[1]); x1, y0 = merc(ext[2], ext[3])
tx0, tx1, ty0, ty1 = int(x0 // 256), int(x1 // 256), int(y0 // 256), int(y1 // 256)
img = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256), "white")
for tx in range(tx0, tx1 + 1):
    for ty in range(ty0, ty1 + 1):
        req = urllib.request.Request(f"https://cyberjapandata.gsi.go.jp/xyz/std/{Z}/{tx}/{ty}.png", headers={"User-Agent": "foehn-landmark-probe"})
        img.paste(Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGB"), ((tx - tx0) * 256, (ty - ty0) * 256))
img = img.crop((int(x0 - tx0 * 256), int(y0 - ty0 * 256), int(x1 - tx0 * 256), int(y1 - ty0 * 256)))

meta = load_meta(); tr, cell = master_info()
A = assemble(sorted(n for n, t in meta["tiles"].items() if t.get("margin") == "m3"), meta, tr)
mask, mtr, _ = flat_mask()
onf = on_mask(A["S"].mean(axis=1), mask, mtr)
F = json.load(open("pilot/out/fragment_check.json", encoding="utf-8"))
to_ll = Transformer.from_crs(UTM, 4326, always_xy=True)
K = np.where((A["A_out"] >= 1e7) & ~onf)[0]
# 切れ端の区間：fragment_check.py と同じ塊の番号づけをやり直すのは重いので、下流端の近くから塊をたどる代わりに、
# 1,000万の区間をすべて描き、切れ端の下流端に印を付ける（色＝原因）
fig, ax = plt.subplots(figsize=(13, 13))
ax.imshow(img, extent=[0, img.width, img.height, 0])
def to_px(lon, lat):
    X, Y = merc(lon, lat); return X - x0, Y - y0
for i in K:
    lo, la = to_ll.transform(A["S"][i][:, 0], A["S"][i][:, 1])
    if lo.max() < ext[0] or lo.min() > ext[2] or la.max() < ext[1] or la.min() > ext[3]:
        continue
    px = [to_px(a, b) for a, b in zip(lo, la)]
    ax.plot([p[0] for p in px], [p[1] for p in px], color="#0b3d91", lw=2.2, alpha=.8)
COL = {"a": "#2e7d32", "d": "#d81b60", "g": "#f57c00", "e1": "#6a1b9a", "b": "#000000", "e": "#555555"}
LAB = {"a": "平坦面マスク", "d": "継ぎ目：A_out 過小", "g": "継ぎ目：升目のずれ", "e1": "同じタイル内", "b": "行き止まり", "e": "その他"}
seen = set()
for f in F["fragments"]:
    lo, la = f["down_lonlat"]
    if not (ext[0] <= lo <= ext[2] and ext[1] <= la <= ext[3]):
        continue
    X, Y = to_px(lo, la)
    ax.plot(X, Y, "o", ms=13, mfc="none", mec=COL[f["cause"]], mew=3, label=LAB[f["cause"]] if f["cause"] not in seen else None)
    seen.add(f["cause"])
ax.legend(loc="lower right", fontsize=12); ax.set_axis_off()
ax.set_title(f"A_out≧1,000万m² の沢（紺）と切れ端の下流端（丸・色＝原因）背景：地理院 標準地図 {ext}")
plt.tight_layout(); plt.savefig(f"pilot/out/fragments_{name}.png", dpi=75); print("done")
