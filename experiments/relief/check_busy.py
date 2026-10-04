# 「計算中…」の描画と、load が来ないときの保険（60秒）の確認（新規）。数字だけ出す。
#   B: 「適用」のクリック → redraw → 計算開始 → load の時刻と、その間に出た画面フレーム（CDP screencast）を並べる。
#      フレームの画像は out/（.gitignore 対象）。画像の中身は目で見て確かめる（このスクリプトは文字を読まない）。
#   C: タイルが0枚になる場合（ズーム 6 < minZoom 8）と、層「なし」で、load が来るか・ボタンが戻るかを見る。
# 使い方（experiments/relief で）: ../landmark/.venv/Scripts/python.exe check_busy.py
import base64, functools, http.server, json, threading, time
from playwright.sync_api import sync_playwright

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8775), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
READY = "__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled"
BTN = "() => ({disabled: $('apply').disabled, text: $('apply').textContent})"
def show(tag, v): print(tag, json.dumps(v, ensure_ascii=False), flush=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    # ---- B ----
    ctx = b.new_context(viewport={"width": 1280, "height": 860}); pg = ctx.new_page()
    pg.goto("http://127.0.0.1:8775/viewer.html#36.7656,139.4937,17")
    pg.wait_for_function(READY, timeout=120000)
    pg.select_option("#src", "tochigi"); pg.dispatch_event("#src", "input")
    pg.select_option("#layer", "ci"); pg.dispatch_event("#layer", "input")
    pg.click("#apply"); pg.wait_for_function(READY, timeout=180000); pg.wait_for_timeout(2000)   # ならし運転
    pg.fill("#rad", "40"); pg.dispatch_event("#rad", "input")                                     # 設定を1つ変えて、もう一度適用する
    pg.evaluate("""() => {
      const T = () => performance.timeOrigin + performance.now(); window.__st = {raf: 0, ev: []};
      (function loop() { __st.raf++; requestAnimationFrame(loop); })();
      const rd = layer.redraw.bind(layer); layer.redraw = () => { __st.ev.push(['redraw', T(), __st.raf, $('apply').textContent]); return rd(); };
      const ct = computeTile; computeTile = (...a) => { if (!__st.ev.some(e => e[0] === 'computeTile')) __st.ev.push(['computeTile', T(), __st.raf, $('apply').textContent]); return ct(...a); };
      layer.on('load', () => __st.ev.push(['load', T(), __st.raf, $('apply').textContent]));
      $('apply').addEventListener('click', () => __st.ev.push(['click', T(), __st.raf, $('apply').textContent]), true);
    }""")
    cdp = ctx.new_cdp_session(pg); frames = []
    def on_frame(e):
        frames.append((e["metadata"]["timestamp"] * 1000, e["data"]))
        try: cdp.send("Page.screencastFrameAck", {"sessionId": e["sessionId"]})
        except Exception: pass
    cdp.on("Page.screencastFrame", on_frame)
    cdp.send("Page.startScreencast", {"format": "png", "everyNthFrame": 1})
    pg.wait_for_timeout(500); pg.click("#apply")
    pg.wait_for_function(READY, timeout=180000); pg.wait_for_timeout(1000)
    cdp.send("Page.stopScreencast")
    ev = pg.evaluate("__st.ev"); t0 = ev[0][1]
    show("B イベント（名前, クリックからの経過ms, その時の rAF 回数, ボタンの文字）", [[e[0], round(e[1] - t0, 1), e[2], e[3]] for e in ev])
    tk = [e for e in ev if e[0] == "computeTile"][0][1]
    fr = [(round(t - t0, 1), d) for t, d in frames if t >= t0 - 50]
    show("B 画面フレームのクリックからの経過ms", [t for t, _ in fr])
    for i, (t, d) in enumerate(fr):
        open(f"out/busy_frame_{i}_{t}ms.png", "wb").write(base64.b64decode(d))
    show("B 計算開始（クリックからの経過ms）", round(tk - t0, 1))
    pg.close(); ctx.close()
    # ---- C ----
    for name, setup in [("ズーム6（タイル0枚）", "map.setZoom(6, {animate: false})"), ("層「なし」", None)]:
        pg = b.new_page(viewport={"width": 1280, "height": 860}); errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto("http://127.0.0.1:8775/viewer.html#36.7656,139.4937,15"); pg.wait_for_function(READY, timeout=120000)
        if setup: pg.evaluate(setup)
        else: pg.select_option("#layer", "none"); pg.dispatch_event("#layer", "input")
        pg.wait_for_timeout(1500); pg.evaluate("resetStats()")
        t = time.time(); pg.click("#apply")
        pg.wait_for_timeout(3000)
        show(f"C {name} クリック3秒後", {**pg.evaluate(BTN), "loads": pg.evaluate("__stats.layerLoadMs.length"), "tiles": pg.evaluate("__stats.tiles")})
        try:
            pg.wait_for_function("!document.getElementById('apply').disabled", timeout=70000)
            show(f"C {name} ボタンが戻るまで(s)", round(time.time() - t, 1))
        except Exception as e: show(f"C {name} 70秒待っても戻らない", str(e)[:80])
        show(f"C {name} 戻った後", {**pg.evaluate(BTN), "loads": pg.evaluate("__stats.layerLoadMs.length"), "errors": errs}); pg.close()
    # ---- D：load が来ない状況を作って（redraw を何もしない関数に差し替え）、保険（60秒）で戻るかを見る。実際に起きる状況ではなく、仕組みの確認 ----
    pg = b.new_page(viewport={"width": 1280, "height": 860})
    pg.goto("http://127.0.0.1:8775/viewer.html#36.7656,139.4937,15"); pg.wait_for_function(READY, timeout=120000)
    pg.evaluate("layer.redraw = () => {}")
    pg.fill("#sigma", "7"); pg.dispatch_event("#sigma", "input")
    t = time.time(); pg.click("#apply"); pg.wait_for_timeout(1000)
    show("D 擬似（load なし）クリック1秒後", pg.evaluate(BTN))
    pg.wait_for_timeout(55000)
    show("D 擬似 クリック56秒後（まだ戻らない想定）", pg.evaluate(BTN))
    pg.wait_for_function("!document.getElementById('apply').disabled", timeout=20000)
    show("D 擬似 ボタンが戻るまで(s)", round(time.time() - t, 1)); show("D 擬似 戻った後", pg.evaluate(BTN))
    show("D 擬似 所要時間の表示欄と applyMs", pg.evaluate("({text: $('applyTime').textContent, applyMs: __stats.applyMs})")); pg.close()
    b.close()
