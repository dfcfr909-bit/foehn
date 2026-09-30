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
        for i, (src, lay, v) in enumerate(CASES):
            f = v.split(","); pg = b.new_page(viewport=vp); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(f"http://127.0.0.1:8771/viewer.html#{f[0]},{f[1]},{f[2]}")
            pg.select_option("#src", src); pg.dispatch_event("#src", "input")
            pg.select_option("#layer", lay); pg.dispatch_event("#layer", "input")
            if len(f) == 4: pg.fill("#maxz", f[3]); pg.dispatch_event("#maxz", "input")
            pg.evaluate("__stats.compute.length=0;__stats.layerLoadMs.length=0;__stats.draw.length=0")
            pg.evaluate("apply()")
            pg.wait_for_function("__stats.layerLoadMs.length>0", timeout=120000); pg.wait_for_timeout(500)
            r = pg.evaluate("({c:__stats.compute.length, cm:[...__stats.compute].sort((a,b)=>a-b)[Math.floor(__stats.compute.length/2)], cmax:Math.max(0,...__stats.compute), load:__stats.layerLoadMs, hit:__stats.hit, m403:__stats.miss403, mo:__stats.missOther, tr:__stats.allTransparent})")
            pg.screenshot(path=f"out/{name}_{i}_{src}_{lay}.png")
            print(name, src, lay, v, json.dumps(r), errs[:3], flush=True); pg.close()
    b.close()
