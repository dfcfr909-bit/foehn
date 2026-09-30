# LANDMARK の結果を拡大して見られる単体 HTML にする（新規・既存ファイルは変更しない）。
# Leaflet は CDN から読む（folium が既定でそうする）。既存の計算結果（data/・out/*_full・
# out/*_saddles.json）をそのまま使い、再計算はしない。
#
# 出力: out/render/landmark_interactive.html （このファイル1つで完結。地点ごとに地図を分け、
#        30m/10m・稜線・沢筋（hso帯）・saddleをレイヤーで切り替えられる）
#
# 使い方: .venv/Scripts/python.exe renderInteractive.py
import base64, io, json, os
import numpy as np
import rasterio
import geopandas as gpd
import folium
from folium import FeatureGroup, LayerControl
from pyproj import Transformer
from PIL import Image
from shapely.geometry import Point

OUT = "out/render"
os.makedirs(OUT, exist_ok=True)
A_TH = 1e5

SITES = {
    "nantai": {
        "label": "男体山",
        "target_lonlat": (139.4909, 36.7651),
        "dems": {"30m": "data/nantai_30m.tif", "10m": "data/nantai_10m.tif"},
        "full_dirs": {"30m": "out/nantai_30m_full", "10m": "out/nantai_10m_full"},
        "gpkg_stem": {"30m": "nantai_30m", "10m": "nantai_10m"},
        "saddle_json": {"30m": "out/nantai_30m_saddles.json", "10m": "out/nantai_10m_saddles.json"},
        "highlight_main_ridge": False,
        "target_label": "山頂（参考・鞍部ではない）",
    },
    "jonen": {
        "label": "常念乗越",
        "target_lonlat": (137.72752, 36.33341),
        "dems": {"30m": "data/jonen_30m_gsi.tif", "10m": "data/jonen_10m_gsi.tif"},
        "full_dirs": {"30m": "out/jonen_30m_full", "10m": "out/jonen_10m_full"},
        "gpkg_stem": {"30m": "jonen_30m_gsi", "10m": "jonen_10m_gsi"},
        "saddle_json": {"30m": "out/jonen_30m_saddles.json", "10m": "out/jonen_10m_saddles.json"},
        "highlight_main_ridge": True,
        "target_label": "常念乗越（実座標）",
    },
}


def hillshade_overlay_png(dem_path, max_px=900):
    with rasterio.open(dem_path) as d:
        h = d.read(1)
        nodata = d.nodata
        transform = d.transform
        crs = d.crs
        bounds = d.bounds
    h = np.where(h == nodata, np.nan, h).astype("float64")
    cell = transform.a
    dx = np.gradient(h, cell, axis=1)
    dy = np.gradient(h, cell, axis=0)
    slope = np.pi / 2 - np.arctan(np.hypot(dx, dy))
    aspect = np.arctan2(-dx, dy)
    az, alt = np.deg2rad(315), np.deg2rad(45)
    shade = np.sin(alt) * np.sin(slope) + np.cos(alt) * np.cos(slope) * np.cos(az - aspect)
    shade = np.clip(shade, 0, 1)
    gray = (shade * 255).astype("uint8")
    alpha = np.where(np.isfinite(h), 200, 0).astype("uint8")  # 半透明（下にOSM等を敷けるように）
    rgba = np.dstack([gray, gray, gray, alpha])
    img = Image.fromarray(rgba, mode="RGBA")
    scale = max_px / max(img.size)
    if scale < 1:
        img = img.resize((int(img.width * scale), int(img.height * scale)), Image.BILINEAR)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")

    to_wgs = Transformer.from_crs(crs, 4326, always_xy=True)
    lon0, lat0 = to_wgs.transform(bounds.left, bounds.bottom)
    lon1, lat1 = to_wgs.transform(bounds.right, bounds.top)
    # UTM/EPSG:6677 は緯度経度と軸が厳密には揃わないが、画像オーバーレイは矩形しか指定できないため
    # 対角2点から矩形近似する（見た目確認用の簡略化。端で数十m程度ずれうる）
    sw = (min(lat0, lat1), min(lon0, lon1))
    ne = (max(lat0, lat1), max(lon0, lon1))
    return f"data:image/png;base64,{b64}", [sw, ne]


def to_geojson(gdf, crs):
    if len(gdf) == 0:
        return {"type": "FeatureCollection", "features": []}
    g = gdf.to_crs(4326).copy()
    # 座標を丸めてファイルサイズを抑える（表示用途で十分な精度）
    g["geometry"] = g["geometry"].apply(lambda geom: geom.simplify(0.0000005, preserve_topology=False) if geom else geom)
    keep_cols = [c for c in ["A_spread", "A_out", "hso", "id_rdl", "id_ch_main", "length"] if c in g.columns]
    return json.loads(g[keep_cols + ["geometry"]].to_json())


def build_site_map(site_key):
    site = SITES[site_key]
    tlon, tlat = site["target_lonlat"]
    fmap = folium.Map(location=[tlat, tlon], zoom_start=14, tiles="OpenStreetMap",
                       control_scale=True)
    folium.Marker([tlat, tlon], tooltip=site["target_label"],
                  icon=folium.Icon(color="orange", icon="star", prefix="fa")).add_to(fmap)

    for res in ["30m", "10m"]:
        dem_path = site["dems"][res]
        crs_str = None
        with rasterio.open(dem_path) as d:
            crs_str = str(d.crs)
        img_uri, bounds = hillshade_overlay_png(dem_path)
        show_default = (site_key == "jonen" and res == "10m")

        fg_shade = FeatureGroup(name=f"[{res}] 陰影起伏図", show=show_default)
        folium.raster_layers.ImageOverlay(image=img_uri, bounds=bounds, opacity=0.85,
                                           name=f"[{res}] 陰影").add_to(fg_shade)
        fg_shade.add_to(fmap)

        stem = site["gpkg_stem"][res]
        full_dir = site["full_dirs"][res]
        ridges = gpd.read_file(f"{full_dir}/ridgelines_se_HSO_{stem}.gpkg.gpkg")
        slopes = gpd.read_file(f"{full_dir}/slopelines_se_HSO_{stem}.gpkg.gpkg")
        crs = ridges.crs

        t = Transformer.from_crs(4326, crs, always_xy=True)
        tx, ty = t.transform(tlon, tlat)

        ridges_f = ridges[ridges["A_spread"] >= A_TH]
        slopes_f = slopes[slopes["A_out"] >= A_TH]

        main_id = None
        if site["highlight_main_ridge"]:
            pt = Point(tx, ty)
            cand = ridges_f.copy()
            cand["d"] = cand.geometry.distance(pt)
            main_id = cand.sort_values("d").iloc[0]["id_rdl"]
            ridges_main = ridges[ridges["id_rdl"] == main_id]
            ridges_other = ridges_f[ridges_f["id_rdl"] != main_id]
        else:
            ridges_main = ridges_f.iloc[0:0]
            ridges_other = ridges_f

        fg_ridge = FeatureGroup(name=f"[{res}] 稜線 ridge（A_spread≧1e5）", show=show_default)
        folium.GeoJson(to_geojson(ridges_other, crs), style_function=lambda x: {"color": "#e60000", "weight": 1.5},
                       name=f"[{res}] 稜線").add_to(fg_ridge)
        fg_ridge.add_to(fmap)

        if main_id is not None and len(ridges_main):
            fg_main = FeatureGroup(name=f"[{res}] 稜線：目標点を通る本線（id_rdl={int(main_id)}）", show=show_default)
            folium.GeoJson(to_geojson(ridges_main, crs), style_function=lambda x: {"color": "#ff9900", "weight": 4},
                           name=f"[{res}] 本線").add_to(fg_main)
            fg_main.add_to(fmap)

        # 沢筋：排他的な階級（低=3-4, 中=5-6, 高=7+）でファイルを軽くする
        low = slopes_f[(slopes_f["hso"] >= 3) & (slopes_f["hso"] < 5)]
        mid = slopes_f[(slopes_f["hso"] >= 5) & (slopes_f["hso"] < 7)]
        high = slopes_f[slopes_f["hso"] >= 7]
        for tier, gdf, color, weight in [("hso3-4", low, "#99ccff", 1.2), ("hso5-6", mid, "#3366cc", 2.0), ("hso7+", high, "#001a66", 3.0)]:
            fg = FeatureGroup(name=f"[{res}] 沢筋 {tier}", show=show_default)
            folium.GeoJson(to_geojson(gdf, crs), style_function=lambda x, c=color, w=weight: {"color": c, "weight": w},
                           name=f"[{res}] {tier}").add_to(fg)
            fg.add_to(fmap)

        # saddle
        with open(site["saddle_json"][res], encoding="utf-8") as f:
            sdl = json.load(f)
        fg_sdl = FeatureGroup(name=f"[{res}] saddle（LANDMARK）", show=show_default)
        for i, s in enumerate(sdl["saddles"]):
            is_nearest = (i == 0)
            folium.CircleMarker(
                [s["lat"], s["lon"]],
                radius=7 if is_nearest else 4,
                color="black" if is_nearest else "#00cc44",
                fill=True, fill_color="#00cc44", fill_opacity=1.0 if is_nearest else 0.6,
                tooltip=f"saddle 標高{s['z']:.1f}m・目標点から{s['d_from_target']:.0f}m" + ("（最寄り）" if is_nearest else ""),
            ).add_to(fg_sdl)
        fg_sdl.add_to(fmap)

        print(f"{site_key} {res}: 稜線{len(ridges_other)}(+本線{len(ridges_main)})・沢筋 低{len(low)}/中{len(mid)}/高{len(high)}・saddle{len(sdl['saddles'])} / CRS={crs_str}")

    LayerControl(collapsed=False).add_to(fmap)
    return fmap


def main():
    maps_html = []
    for site_key in SITES:
        print(f"=== {site_key} ===")
        fmap = build_site_map(site_key)
        maps_html.append((SITES[site_key]["label"], fmap.get_root().render()))

    # 2つの folium 地図（各自 Leaflet の CDN 読み込みを含む）を1つの HTML に縦に並べる
    parts = ["""<!doctype html><html><head><meta charset="utf-8">
<title>LANDMARK 予備実験（男体山・常念乗越）</title>
<style>
body{font-family:"Yu Gothic","Meiryo",sans-serif;margin:0;padding:0;background:#222;color:#eee;}
h2{margin:12px 16px 4px;} p.note{margin:0 16px 12px;color:#aaa;font-size:13px;}
.mapblock{width:100%;height:640px;margin-bottom:8px;}
.mapblock iframe{width:100%;height:100%;border:0;}
</style></head><body>
<h2>LANDMARK 地形描出 予備実験（PR #114・地形からの推定・参考値）</h2>
<p class="note">左上のレイヤー切替で解像度（30m/10m）・稜線・沢筋（Horton次数の帯）・saddleを個別に表示できます。
黄色い星＝実座標（常念乗越は乗越、男体山は山頂＝参考。鞍部ではない）。緑の三角＝LANDMARKのsaddle（濃い方が目標点に最も近い1件）。
背景はOpenStreetMap（要インターネット接続）＋DEMの陰影起伏図（半透明）。</p>
"""]
    for i, (label, html) in enumerate(maps_html):
        parts.append(f'<h2 style="margin-top:24px">{label}</h2>')
        parts.append(f'<div class="mapblock">{_wrap_iframe(html, i)}</div>')
    parts.append("</body></html>")

    out_path = f"{OUT}/landmark_interactive.html"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    print(f"\n書いた: {out_path}")


def _wrap_iframe(inner_html, idx):
    # 各 folium 地図をまるごと1つの iframe に srcdoc で埋め込み、2枚の Leaflet インスタンスが
    # 互いの CSS/JS を汚さないようにする
    escaped = inner_html.replace('"', "&quot;")
    return f'<iframe srcdoc="{escaped}"></iframe>'


if __name__ == "__main__":
    main()
