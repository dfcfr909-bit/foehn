# 「適用」ボタン方式の動作確認（新規）。各項目を「期待」「実測」で並べて出す。画像は保存しない。
# 使い方（experiments/relief で）: ../landmark/.venv/Scripts/python.exe check_apply.py
import functools, http.server, json, threading
from playwright.sync_api import sync_playwright

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8774), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
READY = "__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled"
S = "() => ({computeN: __stats.compute.length, loads: __stats.layerLoadMs.length, gen, resCacheSize: resCache.size, " \
    "disabled: $('apply').disabled, text: $('apply').textContent, dirty: $('apply').classList.contains('dirty'), " \
    "layerOpacity: layer.options.opacity, P: {sigma: P.sigma, rad: P.rad, op: P.op}})"
results = []
def check(tag, expect, actual, ok):
    results.append(ok); print(f"{tag} 期待: {expect}\n   実測: {json.dumps(actual, ensure_ascii=False)}\n   判定: {'OK' if ok else 'NG'}", flush=True)
def move(pg, k, v): pg.fill("#" + k, v); pg.dispatch_event("#" + k, "input")
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1280, "height": 860}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("http://127.0.0.1:8774/viewer.html#36.7656,139.4937,15")
    pg.wait_for_function(READY, timeout=120000); pg.wait_for_timeout(1500)
    a = pg.evaluate(S)
    check("A 初回描画（適用は押していない）", "layerLoadMs が1個以上", {"loads": a["loads"], "computeN": a["computeN"]}, a["loads"] >= 1 and a["computeN"] > 0)
    for k, v in [("rad", "40"), ("sigma", "8"), ("rad", "80"), ("sigma", "12"), ("rad", "20")]: move(pg, k, v)
    pg.wait_for_timeout(3000); bb = pg.evaluate(S)
    check("B 適用前に5回動かす", "computeN と loads が増えない・P は変わらない", {"computeN": [a["computeN"], bb["computeN"]], "loads": [a["loads"], bb["loads"]], "P": bb["P"]},
          bb["computeN"] == a["computeN"] and bb["loads"] == a["loads"] and bb["P"]["sigma"] == 5 and bb["P"]["rad"] == 30)
    check("F1 未適用の印", "dirty クラスが付く", {"dirty": bb["dirty"]}, bb["dirty"])
    for v in ["0.3", "0.6", "0.4", "0.9", "0.5"]: move(pg, "op", v)
    pg.wait_for_timeout(1500); d = pg.evaluate(S)
    check("D 不透明度を5回動かす", "computeN と gen が増えない・resCache は同じ・層の不透明度は 0.5", {"computeN": [bb["computeN"], d["computeN"]], "gen": [bb["gen"], d["gen"]],
          "resCacheSize": [bb["resCacheSize"], d["resCacheSize"]], "layerOpacity": d["layerOpacity"]}, d["computeN"] == bb["computeN"] and d["gen"] == bb["gen"] and d["resCacheSize"] == bb["resCacheSize"] and d["layerOpacity"] == 0.5)
    pg.evaluate("resetStats()")
    e1 = pg.evaluate("() => { $('apply').click(); return {disabled: $('apply').disabled, text: $('apply').textContent}; }")
    check("E1 適用クリック直後", "disabled かつ「計算中…」", e1, e1["disabled"] and e1["text"] == "計算中…")
    pg.wait_for_function(READY, timeout=180000); pg.wait_for_timeout(3000); c = pg.evaluate(S)
    check("C 適用1回", "layerLoadMs がちょうど1個増える（リセット後なので 1）", {"loads": c["loads"], "computeN": c["computeN"], "gen": [d["gen"], c["gen"]]}, c["loads"] == 1 and c["gen"] == d["gen"] + 1)
    check("E2 load 後", "「適用」で有効", {"disabled": c["disabled"], "text": c["text"]}, (not c["disabled"]) and c["text"] == "適用")
    check("F2 適用後", "dirty クラスが外れる・P が確定している（sigma=12, rad=20）", {"dirty": c["dirty"], "P": c["P"]}, (not c["dirty"]) and c["P"]["sigma"] == 12 and c["P"]["rad"] == 20)
    # G: load で先に戻ったら、保険のタイマー（60秒）は解除されている → 60秒後に setBusy が呼ばれない
    pg.evaluate("() => { window.__sb = 0; const o = setBusy; setBusy = (on) => { __sb++; return o(on); }; }")
    pg.wait_for_timeout(63000); g = pg.evaluate("__sb")
    check("G 保険タイマーの解除", "load で戻った後、63秒待っても setBusy が呼ばれない（0回）", {"setBusy呼び出し": g}, g == 0)
    check("エラー", "ページエラーなし", errs, not errs)
    b.close()
print("全体:", "OK" if all(results) else "NG", f"({sum(results)}/{len(results)})")
