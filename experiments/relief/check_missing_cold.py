# 初回の取得時に 404 が missOther に数えられるかの確認（新規）。数字だけ。
import functools, http.server, json, threading
from playwright.sync_api import sync_playwright
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8773), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 860}); st = []
    pg.on("response", lambda r: st.append(r.status) if "dem5a_png" in r.url and r.status != 200 else None)
    pg.goto("http://127.0.0.1:8773/viewer.html#36.2853,137.7328,15")
    # 初回表示（既定の設定＝CS）の取得時の数を見る。「適用」は押さない
    pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(3000)
    print(json.dumps(pg.evaluate("({miss403:__stats.miss403, missOther:__stats.missOther, transparent:__stats.allTransparent, tiles:__stats.tiles, computeN:__stats.compute.length})")), "非200の応答:", st, flush=True)
    b.close()
