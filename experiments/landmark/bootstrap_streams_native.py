# 沢の追加確認（findings7）の補助：LANDMARK と現行の差が、窓のばらつきの範囲に収まるかを見る（新規）。
#   10窓を単位に、重複ありで引き直して（ブートストラップ 5,000回・シード固定）、合算した差（LANDMARK − 現行）の95%範囲を出す。
#   窓ごとの符号（LANDMARK が上回った窓の数）も出す。
# 使い方: .venv/Scripts/python.exe bootstrap_streams_native.py   （eval_streams_native.py の後）
import pickle
import numpy as np

R = pickle.load(open("out/eval_streams_native_raw.pkl", "rb"))
rng = np.random.default_rng(20260930)
N = len(R)
idx = rng.integers(0, N, size=(5000, N))


def arr(mode, res, s, r):
    a = np.zeros((N, 4))
    for i, x in enumerate(R):
        for q in x["real"]:
            if q["mode"] == mode and q["res"] == res and q["set"] == s and q["r"] == r:
                a[i] = [q["pn"], q["pd"], q["rn"], q["rd"]]
    return a


print("モード 解像度 バッファ | 精度の差(pt) 実際 [ブートストラップ95%範囲]・LANDMARKが上の窓 | 再現の差(pt) 実際 [95%範囲]・LANDMARKが上の窓")
for mode in ["plain", "maskedA", "maskedB"]:
    for res in ["30m", "10m"]:
        for r in [30.0, 50.0]:
            A, P = arr(mode, res, "LM_A", r), arr(mode, res, "PR_v", r)
            def diff(sel, k):
                a, p = A[sel], P[sel]
                return (a[:, k].sum() / a[:, k + 1].sum() - p[:, k].sum() / p[:, k + 1].sum()) * 100
            out = []
            for k in (0, 2):
                real = diff(np.arange(N), k)
                bs = np.array([diff(ix, k) for ix in idx])
                win = int(((A[:, k] / np.where(A[:, k + 1] > 0, A[:, k + 1], np.nan)) > (P[:, k] / np.where(P[:, k + 1] > 0, P[:, k + 1], np.nan))).sum())
                out.append(f"{real:+5.1f} [{np.percentile(bs, 2.5):+5.1f}〜{np.percentile(bs, 97.5):+5.1f}]・{win}/{N}窓")
            print(f"{mode:>8} {res} {int(r)}m | 精度 {out[0]} | 再現 {out[1]}")
