# 「適用」ボタン方式の動作確認（新規）。各項目を「期待」「実測」で並べて出す。画像は保存しない。
# 使い方（experiments/relief で）: 初回は python -m venv .venv → .venv/Scripts/pip install -r requirements.txt → .venv/Scripts/python -m playwright install chromium。実行は .venv/Scripts/python check_apply.py
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
    ini = pg.evaluate("() => ({layer: P.layer, src: P.src, maxz: P.maxz, sigma: P.sigma, rad: P.rad, sigc: P.sigc, cscale: P.cscale, cs0: P.cs0, ciscale: P.ciscale, op: P.op, miss: P.miss, "
                      "label: $('cscale_o').textContent, opLabel: $('op_o').textContent, dirtyClass: $('apply').classList.contains('dirty'), isDirty: isDirty(), layerOpacity: layer.options.opacity})")
    check("A2 初期値", "層=cs・dem5a・z15・σ5・R30・下ならし1.5・曲率の強さ 0.010（cscale=-2）・満色20・不透明度0.65・欠け赤なし・未適用の印なし・層の不透明度0.65",
          ini, ini["layer"] == "cs" and ini["src"] == "gsi5" and ini["maxz"] == 15 and ini["sigma"] == 5 and ini["rad"] == 30 and ini["sigc"] == 1.5 and ini["cscale"] == -2 and ini["label"] == "0.010"
          and ini["ciscale"] == 20 and ini["op"] == 0.65 and ini["miss"] is False and not ini["dirtyClass"] and not ini["isDirty"] and ini["layerOpacity"] == 0.65)
    t0 = pg.evaluate("$('applyTime').textContent")
    check("H1 適用前の表示欄", "「適用：未実行」・applyMs は空", {"text": t0, "applyMs": pg.evaluate("__stats.applyMs")}, t0 == "適用：未実行" and pg.evaluate("__stats.applyMs.length") == 0)
    for k, v in [("rad", "40"), ("sigma", "8"), ("rad", "80"), ("sigma", "12"), ("rad", "20")]: move(pg, k, v)
    pg.wait_for_timeout(3000); bb = pg.evaluate(S)
    check("B 適用前に5回動かす", "computeN と loads が増えない・P は変わらない", {"computeN": [a["computeN"], bb["computeN"]], "loads": [a["loads"], bb["loads"]], "P": bb["P"]},
          bb["computeN"] == a["computeN"] and bb["loads"] == a["loads"] and bb["P"]["sigma"] == 5 and bb["P"]["rad"] == 30)
    check("F1 未適用の印", "dirty クラスが付く", {"dirty": bb["dirty"]}, bb["dirty"])
    for v in ["0.3", "0.6", "0.4", "0.9", "0.5"]: move(pg, "op", v)
    pg.wait_for_timeout(1500); d = pg.evaluate(S)
    check("D 不透明度を5回動かす", "computeN と gen が増えない・resCache は同じ・層の不透明度は 0.5", {"computeN": [bb["computeN"], d["computeN"]], "gen": [bb["gen"], d["gen"]],
          "resCacheSize": [bb["resCacheSize"], d["resCacheSize"]], "layerOpacity": d["layerOpacity"]}, d["computeN"] == bb["computeN"] and d["gen"] == bb["gen"] and d["resCacheSize"] == bb["resCacheSize"] and d["layerOpacity"] == 0.5)
    pg.evaluate("() => { window.__ticks = 0; window.__lt = []; new PerformanceObserver(l => l.getEntries().forEach(e => __lt.push(Math.round(e.duration)))).observe({type: 'longtask'}); setInterval(() => { if ($('apply').disabled) __ticks++; }, 50); }")
    pg.evaluate("resetStats()")
    e1 = pg.evaluate("() => { $('apply').click(); return {disabled: $('apply').disabled, text: $('apply').textContent}; }")
    check("E1 適用クリック直後", "disabled かつ「計算中…」", e1, e1["disabled"] and e1["text"] == "計算中…")
    pg.wait_for_function(READY, timeout=180000); pg.wait_for_timeout(3000); c = pg.evaluate(S)
    check("C 適用1回", "layerLoadMs がちょうど1個増える（リセット後なので 1）", {"loads": c["loads"], "computeN": c["computeN"], "gen": [d["gen"], c["gen"]]}, c["loads"] == 1 and c["gen"] == d["gen"] + 1)
    ti = pg.evaluate("({ticks: __ticks, longtaskMax: Math.max(0, ...__lt), longtaskN: __lt.length, applyMs: __stats.applyMs.map(Math.round)})")
    check("I 適用中の分割実行", "適用中（ボタンが無効の間）に 50ms 間隔の setInterval が3回以上動く（1タイルごとに制御を返している）", ti, ti["ticks"] >= 3)
    check("E2 load 後", "「適用」で有効", {"disabled": c["disabled"], "text": c["text"]}, (not c["disabled"]) and c["text"] == "適用")
    check("F2 適用後", "dirty クラスが外れる・P が確定している（sigma=12, rad=20）", {"dirty": c["dirty"], "P": c["P"]}, (not c["dirty"]) and c["P"]["sigma"] == 12 and c["P"]["rad"] == 20)
    h = pg.evaluate("({text: $('applyTime').textContent, applyMs: __stats.applyMs, lastLayerLoad: __stats.layerLoadMs[__stats.layerLoadMs.length - 1]})")
    check("H2 適用後の表示欄", "「前回の適用：」で始まる・applyMs が長さ1・値が layerLoadMs の最後以上", h,
          h["text"].startswith("前回の適用：") and len(h["applyMs"]) == 1 and h["applyMs"][0] >= h["lastLayerLoad"])
    pg.evaluate("map.panBy([300, 0], {animate: false})"); pg.wait_for_timeout(5000)
    h3 = pg.evaluate("({text: $('applyTime').textContent, applyMs: __stats.applyMs.length, loads: __stats.layerLoadMs.length})")
    check("H3 パンでは記録しない", "applyMs の長さが 1 のまま（layerLoadMs はパンの load で増えてよい）", h3, h3["applyMs"] == 1)
    # G: load で先に戻ったら、保険のタイマー（60秒）は解除されている → 60秒後に setBusy が呼ばれない
    pg.evaluate("() => { window.__sb = 0; const o = setBusy; setBusy = (on) => { __sb++; return o(on); }; }")
    pg.wait_for_timeout(63000); g = pg.evaluate("__sb")
    check("G 保険タイマーの解除", "load で戻った後、63秒待っても setBusy が呼ばれない（0回）", {"setBusy呼び出し": g}, g == 0)
    check("エラー", "ページエラーなし", errs, not errs)
    b.close()
print("全体:", "OK" if all(results) else "NG", f"({sum(results)}/{len(results)})")
