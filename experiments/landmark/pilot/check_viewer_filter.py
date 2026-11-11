# 試作の絞り込みの閲覧ページ（viewer_filter.html）の動作確認（新規。check_viewer.py と同じ流儀）。
# ⚠ 画面写し（pilot/out/viewer_filter_*.png）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/check_viewer_filter.py
import functools, http.server, threading
from playwright.sync_api import sync_playwright

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory="pilot")
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
ON = "Object.keys(groups).filter(k => map.hasLayer(groups[k])).sort().join(',')"
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, vp in [("pc", {"width": 1280, "height": 860}), ("iphone", {"width": 390, "height": 844})]:
            pg = b.new_page(viewport=vp); errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto("http://127.0.0.1:8767/viewer_filter.html")
            pg.wait_for_function("document.getElementById('status').textContent.includes('タイル') || document.getElementById('status').textContent.includes('読み込めない')", timeout=60000)
            pg.wait_for_timeout(2500)
            st = pg.text_content("#status"); on1 = pg.evaluate(ON)
            pg.screenshot(path=f"pilot/out/viewer_filter_{name}.png")
            pg.check("input[name=rf][value=ridge_base]"); pg.wait_for_timeout(600); on2 = pg.evaluate(ON)
            pg.check("input[name=rf][value='']"); pg.wait_for_timeout(600); on3 = pg.evaluate(ON)
            print(f"[{name}] 状態「{st}」／初期 {on1}／絞り込みなしに切替 {on2}／尾根なし {on3}／エラー {errs or 'なし'}")
        b.close()
finally:
    srv.shutdown()
