# 尾根状の点の定義（両側が何m以上低いか）を変えたとき、偶然の Recall(b) がどう動くかの確認（新規）。
# 使い方: .venv/Scripts/python.exe null_ridge_sensitivity.py   （null_baseline.py の後）
import numpy as np
import null_baseline as nb
from eval_windows import load_windows

wins = load_windows(); names = [w["name"] for w in wins]
WR = {(w["name"], r): nb.WinRes(w, r) for w in wins for r in nb.RES}
print("しきい値Δ  解像度  尾根状の割合  偶然(b)Recall（LANDMARK全saddle・標高一致あり）  B1 30-100m帯の期待値(n)")
for delta in [10.0, 20.0, 30.0]:
    nb.RIDGE_DELTA_M = delta
    for res in nb.RES:
        share, exp, n30 = [], 0.0, 0
        for name in names:
            wr = WR[(name, res)]
            pools = wr.pools(nb.EDGE_MAIN)
            share.append(len(pools["b"]) / len(pools["a"]))
            rng = np.random.default_rng(nb.SEED + int(delta))
            cells = pools["b"][rng.integers(0, len(pools["b"]), size=nb.N_PLAIN)]
            P, Z = wr.points(cells, rng)
            rate = wr.targets["LM_all"].hit(P, Z).mean()
            b = wr.b1
            k = int(((b["prom"] >= 30) & (b["prom"] < 100) & ~wr.masks[nb.EDGE_MAIN][b["row"], b["col"]]).sum())
            exp += k * rate; n30 += k
        print(f"  {delta:>4.0f}m   {res}   {np.mean(share)*100:5.0f}%      {exp/n30*100:5.1f}%      {exp:.1f}/{n30}")
