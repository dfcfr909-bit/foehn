# 欠けの扱いと、メインスレッドの止まり具合の確認（新規）。数字だけ出す。画像は保存しない。
# 使い方（experiments/relief で）: ../landmark/.venv/Scripts/python.exe check_missing.py
import functools, http.server, json, threading
from playwright.sync_api import sync_playwright
class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8772), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
JS_MISS = """async () => {
  const keys = [...elevCache.keys()], nulls = [];
  for (const k of keys) { if ((await elevCache.get(k)) === null) nulls.push(k); }
  const b = map.getPixelBounds(), z = map.getZoom(), tl = b.min.divideBy(256).floor(), br = b.max.divideBy(256).floor();
  const shown = []; for (let x = tl.x; x <= br.x; x++) for (let y = tl.y; y <= br.y; y++) shown.push(`gsi5/${z}/${x}/${y}`);
  const keyset = new Set(shown);
  return { elevKeys: keys.length, nullKeys: nulls, nullInShownRange: nulls.filter(k => keyset.has(k)), shownRange: shown.length,
           statsAfterLoad: { miss403: stats.miss403, missOther: stats.missOther, transparent: stats.allTransparent, tiles: stats.tiles, computeN: stats.compute.length } };
}"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, vp in [("pc", {"width": 1280, "height": 860}), ("w390", {"width": 390, "height": 844})]:
        pg = b.new_page(viewport=vp)
        pg.goto("http://127.0.0.1:8772/viewer.html#36.2853,137.7328,15")
        pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000)   # 初回表示が描き終わるのを待つ
        pg.select_option("#layer", "cs"); pg.dispatch_event("#layer", "input")
        pg.evaluate("resetStats()"); pg.click("#apply")
        pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(1500)
        print(name, "常念岳 dem5a z15 CS", json.dumps(pg.evaluate(JS_MISS), ensure_ascii=False), flush=True); pg.close()
    # メインスレッドの止まり：栃木 z17 CI（PC 幅）の再描画中の longtask
    pg = b.new_page(viewport={"width": 1280, "height": 860})
    pg.goto("http://127.0.0.1:8772/viewer.html#36.7656,139.4937,17")
    pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000)   # 初回表示が描き終わるのを待つ
    pg.select_option("#src", "tochigi"); pg.dispatch_event("#src", "input")
    pg.select_option("#layer", "ci"); pg.dispatch_event("#layer", "input")
    pg.click("#apply")   # 1回目の適用：標高タイルをメモリに入れる（ならし運転。数えない）
    pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(3000)
    pg.evaluate("""() => { window.__lt = []; new PerformanceObserver(l => l.getEntries().forEach(e => __lt.push(Math.round(e.duration)))).observe({type: 'longtask', buffered: false}); }""")
    pg.evaluate("resetStats()"); pg.click("#apply")
    pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000); pg.wait_for_timeout(1500)
    print("pc 栃木z17 CI 再描画中の longtask(ms)", json.dumps(pg.evaluate("({lt: __lt, loadMs: __stats.layerLoadMs, computeN: __stats.compute.length})")), flush=True)
    b.close()
