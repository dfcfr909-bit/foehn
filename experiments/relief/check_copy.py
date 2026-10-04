# 「JSONをコピー」の確認（新規）。a（Clipboard API）・b（execCommand）・c（prompt）の各経路を、ヘッドレス Chromium で通す。
#   a: http://localhost（セキュアコンテキスト）   b: http://<LANのIP>（http なので isSecureContext=false。iPhone と同じ形）
#   c: b の経路で execCommand を失敗させる   a失敗→b: localhost で writeText を拒否させる
#   ⚠ LAN の IP で待ち受けるため、配るのは /viewer.html だけにする（serve_local.py と同じ）。終わったらすぐ止まる。
# 使い方（experiments/relief で）: ../landmark/.venv/Scripts/python.exe check_copy.py
import functools, http.server, json, socket, threading
from playwright.sync_api import sync_playwright

class H(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
    def do_GET(self):
        if self.path.split("?")[0].split("#")[0] != "/viewer.html": self.send_error(404); return
        super().do_GET()
srv = http.server.ThreadingHTTPServer(("0.0.0.0", 8776), functools.partial(H, directory="."))
threading.Thread(target=srv.serve_forever, daemon=True).start()
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM); s.connect(("8.8.8.8", 80)); LAN = s.getsockname()[0]; s.close()
KEYS = ["src", "layer", "maxz", "sigma", "rad", "z", "fetch", "decode", "compute", "draw", "layerLoadMs", "applyMs", "viewport", "ua"]
results = []
def check(tag, expect, actual, ok):
    results.append(ok); print(f"{tag} 期待: {expect}\n   実測: {json.dumps(actual, ensure_ascii=False)}\n   判定: {'OK' if ok else 'NG'}", flush=True)
def open_page(ctx, url):
    pg = ctx.new_page(); errs = []; dlg = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    def on_dialog(d): dlg.append({"type": d.type, "default": d.default_value, "message": d.message}); d.dismiss()
    pg.on("dialog", on_dialog)
    pg.goto(url); pg.wait_for_function("__stats.layerLoadMs.length>0 && !document.getElementById('apply').disabled", timeout=120000)
    return pg, errs, dlg
with sync_playwright() as p:
    b = p.chromium.launch(); ctx = b.new_context(viewport={"width": 1280, "height": 860})
    ctx.grant_permissions(["clipboard-read", "clipboard-write"], origin="http://localhost:8776")
    # ---- a ----
    pg, errs, dlg = open_page(ctx, "http://localhost:8776/viewer.html#36.7656,139.4937,15")
    info = pg.evaluate("({secure: window.isSecureContext, hasClipboard: !!navigator.clipboard})")
    pg.click("#copy"); pg.wait_for_timeout(1000)
    clip = pg.evaluate("navigator.clipboard.readText()"); msg = pg.text_content("#copyMsg")
    try: obj = json.loads(clip); keys = list(obj.keys())
    except Exception as e: obj = None; keys = str(e)
    check("a localhost", "isSecureContext=true・表示欄「コピーしました（a：…」・クリップボードが JSON.parse でき、項目と順序が従来どおり・prompt なし・例外なし",
          {**info, "msg": msg, "keys": keys, "prompt": dlg, "errors": errs}, info["secure"] and msg.startswith("コピーしました（a") and keys == KEYS and not dlg and not errs)
    pg.close()
    # ---- a失敗 → b ----
    pg, errs, dlg = open_page(ctx, "http://localhost:8776/viewer.html#36.7656,139.4937,15")
    pg.evaluate("() => { navigator.clipboard.writeText = () => Promise.reject(new Error('拒否（試験）')); }")
    pg.click("#copy"); pg.wait_for_timeout(1000); msg = pg.text_content("#copyMsg")
    check("a失敗→b（localhost で writeText を拒否）", "表示欄「コピーしました（b：…」・prompt なし・例外なし", {"msg": msg, "prompt": dlg, "errors": errs}, msg.startswith("コピーしました（b") and not dlg and not errs)
    pg.close()
    # ---- b（http の LAN IP）----
    pg, errs, dlg = open_page(ctx, f"http://{LAN}:8776/viewer.html#36.7656,139.4937,15")
    info = pg.evaluate("({secure: window.isSecureContext, hasClipboard: !!navigator.clipboard})")
    pg.click("#copy"); pg.wait_for_timeout(1000); msg = pg.text_content("#copyMsg")
    pg.evaluate("() => { const t = document.createElement('textarea'); t.id = '__paste'; document.body.appendChild(t); t.focus(); }")
    pg.keyboard.press("Control+V"); pasted = pg.evaluate("document.getElementById('__paste').value")
    try: keys = list(json.loads(pasted).keys())
    except Exception as e: keys = f"JSON.parse 失敗: {str(e)[:60]}（貼り付けた長さ {len(pasted)}）"
    check("b http://<LANのIP>", "isSecureContext=false・表示欄「コピーしました（b：…」・貼り付けた文字列が JSON.parse でき項目と順序が従来どおり・prompt なし・例外なし",
          {"host": LAN, **info, "msg": msg, "keys": keys, "prompt": dlg, "errors": errs}, (not info["secure"]) and msg.startswith("コピーしました（b") and keys == KEYS and not dlg and not errs)
    pg.close()
    # ---- c ----
    pg, errs, dlg = open_page(ctx, f"http://{LAN}:8776/viewer.html#36.7656,139.4937,15")
    pg.evaluate("() => { document.execCommand = () => false; }")
    pg.click("#copy"); pg.wait_for_timeout(1000); msg = pg.text_content("#copyMsg")
    try: keys = list(json.loads(dlg[0]["default"]).keys()) if dlg else "prompt なし"
    except Exception as e: keys = f"JSON.parse 失敗: {str(e)[:60]}"
    check("c（execCommand も失敗）", "prompt が1回出て、その初期値が JSON.parse でき項目と順序が従来どおり・表示欄は空・例外なし",
          {"prompt数": len(dlg), "prompt種別": dlg[0]["type"] if dlg else None, "msg": msg, "keys": keys, "errors": errs}, len(dlg) == 1 and dlg[0]["type"] == "prompt" and keys == KEYS and msg == "" and not errs)
    pg.close(); b.close()
print("全体:", "OK" if all(results) else "NG", f"({sum(results)}/{len(results)})")
