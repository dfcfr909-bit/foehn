# B2：外部データ（OSMのnatural=saddle・mountain_pass=yes）を範囲内で全件取得する（新規）。
# LANDMARKの出力は見ずに作る。取得元・取得日時・件数を記録する。
#
# ⚠ 地理院の地名データ（乗越・峠・コル・鞍部・のたわ）は、bbox＋部分一致で全件検索できる
#   実用的なAPIが見当たらなかった（msearch.gsi.go.jpは完全一致の地名検索のみ）。
#   国土数値情報「地名」は全国データのダウンロードが要り、この予備調査の範囲では見送った。
#   → 指示の通り、この部分は「取得できなかった」として飛ばす（推測で作らない）。
#
# 使い方: .venv/Scripts/python.exe ref_b2_osm_saddles.py
import json, math, time
from datetime import datetime, timezone
import urllib.request

SITES = {
    "nantai": {"lat": 36.7651, "lon": 139.4909},
    "jonen": {"lat": 36.33341, "lon": 137.72752},
}
HALF_M = 3000
EP = "https://overpass-api.de/api/interpreter"
UA = "foehn-landmark-probe (experiments/landmark)"


def bbox(lat, lon, half_m):
    dlat = half_m / 111320
    dlon = half_m / (111320 * math.cos(math.radians(lat)))
    return lat - dlat, lon - dlon, lat + dlat, lon + dlon


def query_overpass(q):
    req = urllib.request.Request(EP, data=("data=" + q).encode("utf-8"), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def main():
    now = datetime.now(timezone.utc).isoformat()
    out = {"fetched_at_utc": now, "source": "OpenStreetMap via Overpass API (" + EP + ")",
           "note_gsi_meisho": "国土地理院の地名データはbbox+部分一致で全件検索できる実用的なAPIが無く、今回は取得を見送った（推測で作らない）。",
           "sites": {}}
    for site, c in SITES.items():
        s, w, n, e = bbox(c["lat"], c["lon"], HALF_M)
        q = (f'[out:json][timeout:60];'
             f'(node["natural"="saddle"]({s},{w},{n},{e});'
             f'node["mountain_pass"="yes"]({s},{w},{n},{e}););'
             f'out body;')
        print(f"=== {site} bbox=({s:.5f},{w:.5f},{n:.5f},{e:.5f}) ===")
        try:
            data = query_overpass(q)
        except Exception as ex:
            print(f"取得失敗: {ex}")
            out["sites"][site] = {"error": str(ex), "elements": []}
            continue
        elements = data.get("elements", [])
        saddle_nodes = [el for el in elements if el.get("tags", {}).get("natural") == "saddle"]
        pass_nodes = [el for el in elements if el.get("tags", {}).get("mountain_pass") == "yes"]
        print(f"natural=saddle: {len(saddle_nodes)}件・mountain_pass=yes: {len(pass_nodes)}件（重複含む可能性）")
        for el in elements:
            t = el.get("tags", {})
            print(f"  - {t.get('name','(無名)')} lat={el['lat']:.5f} lon={el['lon']:.5f} tags={t}")
        out["sites"][site] = {
            "bbox": [s, w, n, e], "n_saddle": len(saddle_nodes), "n_pass": len(pass_nodes),
            "elements": elements,
        }
        time.sleep(2)  # Overpassへの配慮

    with open("out/ref_b2_osm_saddles.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("\n書いた: out/ref_b2_osm_saddles.json")


if __name__ == "__main__":
    main()
