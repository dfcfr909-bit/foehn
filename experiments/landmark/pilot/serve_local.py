# 試作の閲覧ページを、同じ Wi-Fi の実機（iPhone）から見るためのローカルサーバー（新規）。
#   python -m http.server だと pilot/ の中身（DEM・LANDMARK の出力など）がすべて LAN から見えるので、
#   閲覧ページ（viewer.html・viewer_filter.html・viewer_v3.html）と表示用のタイル（out/tiles/・out/tiles_filter/・out/tiles_v3/）だけを配る。ほかは 404。
#   ⚠ 私的利用・ローカル確認のみ。公衆の Wi-Fi では使わない。見終わったら Ctrl+C で止める。
# 使い方（experiments/landmark/pilot で）: python serve_local.py [ポート番号（既定 8000）]
import functools, http.server, os, sys

ALLOW_FILES = {"/viewer.html", "/viewer_filter.html", "/viewer_v3.html"}
ALLOW_DIRS = ("/out/tiles/", "/out/tiles_filter/", "/out/tiles_v3/")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == "/":
            self.send_response(302); self.send_header("Location", "/viewer_filter.html"); self.end_headers(); return
        ok = path in ALLOW_FILES or (path.startswith(ALLOW_DIRS) and path.endswith(".json") and ".." not in path)
        if not ok:
            self.send_error(404); return
        super().do_GET()

    def do_HEAD(self):
        self.send_error(405)

    def list_directory(self, path):   # フォルダの一覧は出さない
        self.send_error(404); return None


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    here = os.path.dirname(os.path.abspath(__file__))
    srv = http.server.ThreadingHTTPServer(("0.0.0.0", port), functools.partial(Handler, directory=here))
    print(f"配信中：http://localhost:{port}/viewer_filter.html（閲覧ページとタイルだけ）。止めるときは Ctrl+C", flush=True)
    srv.serve_forever()
