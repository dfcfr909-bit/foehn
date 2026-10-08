# 新規8窓の LANDMARK の尾根線・沢線（既定閾値）を書き出す（新規）。既存2窓（男体山・常念乗越）は再計算せず既存の
# out/{site}_{res}/ を使う。既定閾値＝ridge A_spread>=1e5・沢 A_out>=1e5・hso_th=3（既存の out/nantai_10m と同じ）。
# 使い方: .venv/Scripts/python.exe run_landmark_lines.py
import subprocess, sys, os, time
from concurrent.futures import ProcessPoolExecutor

EXE = os.path.join(".venv", "Scripts", "landmark.exe")
NAMES = [f"w0{i}" for i in range(1, 9)]


def run(job):
    name, res = job
    out = f"out/{name}_{res}"
    rid = os.path.join(out, f"ridgelines_se_HSO_{name}_{res}.gpkg.gpkg")
    if os.path.exists(rid):
        return name, res, "既存"
    os.makedirs(out, exist_ok=True)
    t0 = time.time()
    r = subprocess.run([EXE, f"data/{name}_{res}.tif", "--output_dir", out, "--a_spread", "1e5", "--a_out", "1e5",
                        "--hso_th", "3", "--no_data_values", "-9999"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode != 0 or not os.path.exists(rid):
        return name, res, "失敗: " + (r.stderr or r.stdout)[-400:]
    return name, res, f"{time.time()-t0:.0f}秒"


if __name__ == "__main__":
    jobs = [(n, r) for r in ["10m", "30m"] for n in NAMES]
    with ProcessPoolExecutor(5) as ex:
        for name, res, msg in ex.map(run, jobs):
            print(name, res, msg, flush=True)
