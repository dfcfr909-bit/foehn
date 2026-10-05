# 閲覧ページ（viewer.html）の動作確認と描画時間の計測（新規）。画面写しは out/（.gitignore 対象）。
# 使い方（experiments/relief で）: ../landmark/.venv/Scripts/python.exe check_viewer.py
import functools, http.server, json, threading
from playwright.sync_api import sync_playwright

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8771), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
CASES = [("gsi5", "cs", "36.7656,139.4937,15"), ("gsi5", "ci", "36.7656,139.4937,15"),
         ("tochigi", "cs", "36.7656,139.4937,17"), ("tochigi", "ci", "36.7656,139.4937,17"),
         ("tochigi", "cs", "36.7656,139.4937,17,15"), ("gsi5", "cs", "36.2853,137.7328,15")]
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, vp in [("pc", {"width": 1280, "height": 860}), ("iphone", {"width": 390, "height": 844})]:
        for i, (src, lay, v) in [(i, c) for i, c in enumerate(CASES) for _ in range(3)]:
            f = v.split(","); pg = b.new_page(viewport=vp); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://127.0.0.1:8771/viewer.html#{f[0]},{f[1]},{f[2]}")
            pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000)   # 初回表示（既定の設定）が描き終わるのを待つ
            pg.select_option("#src", src); pg.dispatch_event("#src", "input")
            pg.select_option("#layer", lay); pg.dispatch_event("#layer", "input")
            if len(f) == 4: pg.fill("#maxz", f[3]); pg.dispatch_event("#maxz", "input")
            pg.click("#apply")   # 1回目の適用：標高タイルをメモリに入れる（ならし運転。数えない）
            pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(1500)
            pg.evaluate("resetStats()")   # 数え直してから、もう一度「適用」を押して測る（メモリ上のタイルでの再描画）
            pg.click("#apply")
            pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(1500)
            r = pg.evaluate("({tiles:__stats.tiles, computeN:__stats.compute.length, computeMedian:[...__stats.compute].sort((a,b)=>a-b)[Math.floor(__stats.compute.length/2)], computeMax:Math.max(0,...__stats.compute), loadMs:__stats.layerLoadMs, hit:__stats.hit, m403:__stats.miss403, mOther:__stats.missOther, transparent:__stats.allTransparent})")
            pg.screenshot(path=f"out/{name}_{i}_{src}_{lay}.png")
            print(name, src, lay, v, json.dumps(r), errs[:3], flush=True); pg.close()
    b.close()
