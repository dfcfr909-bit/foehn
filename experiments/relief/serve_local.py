# CS立体図・CI の試作の閲覧ページを、同じ Wi-Fi の実機（iPhone）から見るためのローカルサーバー（新規）。
#   viewer.html だけを配る（標高タイルはブラウザが配信元へ直接取りに行く）。ほかは 404。
#   ⚠ 私的利用・ローカル確認のみ。公衆の Wi-Fi では使わない。見終わったら Ctrl+C で止める。
# 使い方（experiments/relief で）: python serve_local.py [ポート番号（既定 8010）]
import functools, http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == "/":
            self.send_response(302); self.send_header("Location", "/viewer.html"); self.end_headers(); return
        if path != "/viewer.html":
            self.send_error(404); return
        super().do_GET()
    def do_HEAD(self):
        self.send_error(405)
    def list_directory(self, path):
        self.send_error(404); return None

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8010
    here = os.path.dirname(os.path.abspath(__file__))
    srv = http.server.ThreadingHTTPServer(("0.0.0.0", port), functools.partial(Handler, directory=here))
    print(f"配信中：http://localhost:{port}/viewer.html（閲覧ページだけ）。止めるときは Ctrl+C", flush=True)
    srv.serve_forever()
