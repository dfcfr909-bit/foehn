# 試作の閲覧ページの動作確認（新規）：ローカルサーバーを一時的に立て、ヘッドレスの Chromium で viewer.html を開いて、
# 読み込みの表示・コンソールのエラー・画面写しを確かめる。PC の幅と iPhone の幅の2通り。
# ⚠ 画面写し（pilot/out/viewer_*.png）は .gitignore 対象。コミットしない。
# 使い方（experiments/landmark で）: .venv/Scripts/python.exe pilot/check_viewer.py
import functools, http.server, threading
from playwright.sync_api import sync_playwright

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory="pilot")
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8766), Handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, vp in [("pc", {"width": 1280, "height": 860}), ("iphone", {"width": 390, "height": 844})]:
            pg = b.new_page(viewport=vp)
            errs = []
            pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto("http://127.0.0.1:8766/viewer.html")
            pg.wait_for_function("document.getElementById('status').textContent.includes('タイル') || document.getElementById('status').textContent.includes('読み込めない')", timeout=60000)
            pg.wait_for_timeout(2500)
            st = pg.text_content("#status")
            n_layers = pg.evaluate("Object.values(groups).filter(g => map.hasLayer(g)).length")
            pg.screenshot(path=f"pilot/out/viewer_{name}.png")
            # 切り替え：現行の尾根を入れる
            pg.check("input[data-layer=prod_ridge]"); pg.wait_for_timeout(800)
            n_layers2 = pg.evaluate("Object.values(groups).filter(g => map.hasLayer(g)).length")
            print(f"[{name}] 状態「{st}」・表示中の層 {n_layers} → 現行を入れて {n_layers2}・エラー {errs or 'なし'}")
        b.close()
finally:
    srv.shutdown()
