# 試作の閲覧ページ第3版（viewer_v3.html）の動作確認（新規。check_viewer.py と同じ流儀）。
#   自動モードで、ズーム 11（広域）と 14（拡大）で出る層が入れ替わるか、境目の数字を変えると入れ替わるか、手動モードの切り替えを確かめる。
# ⚠ 画面写し（pilot/out/viewer_v3_*.png）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/check_viewer_v3.py
import functools, http.server, threading
from playwright.sync_api import sync_playwright

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory="pilot")
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8768), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
ON = "Object.keys(groups).filter(k => map.hasLayer(groups[k])).sort().join(',')"
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, vp in [("pc", {"width": 1280, "height": 860}), ("iphone", {"width": 390, "height": 844})]:
            pg = b.new_page(viewport=vp); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto("http://127.0.0.1:8768/viewer_v3.html")
            pg.wait_for_function("document.getElementById('status').textContent.includes('タイル') || document.getElementById('status').textContent.includes('読み込めない')", timeout=60000)
            pg.wait_for_timeout(1500)
            out = {"status": pg.text_content("#status")}
            for z in (11, 14):
                pg.evaluate(f"void map.setZoom({z}, {{animate:false}})"); pg.wait_for_timeout(800)
                out[f"auto_z{z}"] = pg.evaluate(ON)
                pg.screenshot(path=f"pilot/out/viewer_v3_{name}_z{z}.png")
            pg.fill("#zb", "14"); pg.dispatch_event("#zb", "input"); pg.wait_for_timeout(500)
            out["auto_z14_border14"] = pg.evaluate(ON)
            pg.check("input[name=mode][value=manual]"); pg.wait_for_timeout(500)
            out["manual"] = pg.evaluate(ON)
            print(f"[{name}] {out}・エラー {errs or 'なし'}")
        b.close()
finally:
    srv.shutdown()
