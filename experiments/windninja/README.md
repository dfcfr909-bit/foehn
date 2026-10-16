# WindNinja の調査（風速の細分化・案B）

**状態: 調査中（2026-10-16）。本体は未変更。** 背景は `docs/requirements_wind_exposure.md`「第1段の範囲外」。

やりたいこと：約11km格子の予報の風を、地形に合わせて約60〜100m の升目へ細分化する。
端末では解かず、**Actions で山域ごとに風向16方位 × 1回ずつ前もって解き、「モデルの風の何倍・何度曲がるか」の表を配る**案。

## 分かったこと（findings-01・2026-10-16）

| 確かめること | 結果 |
|---|---|
| ライセンス | **パブリックドメイン（米国政府職員の著作）＋外部の寄稿は BSD**（`LICENSE`）。計算結果を public のリポジトリに置いてよい。BSD 部分を同梱するなら著作権表示を残す（同梱はしない予定：Actions でビルドして使うだけ） |
| ビルド | **Ubuntu 24.04 で CLI だけビルドできた**（GUI・OpenFOAM なし）。下の手順で約15分（4コア）。⚠ `WITH_NOMADS_SUPPORT=OFF`・`WITH_LCP_CLIENT=OFF` にするとリンクで落ちる（既定の ON のまま）。外へ問い合わせる機能は `PHONE_HOME_QUERIES=OFF` で止めた |
| 計算時間 | **谷川岳の 14km 四方・60m の升目・質量保存の解法・4スレッドで 9.4 秒/1方位**。16方位で約2.5分/山域。51山域で約2時間（Actions の1回で収まる見込み・推測） |
| 出力 | 風速（m/s）と風向の ASCII グリッド（UTM・60m）。`output_speed_units = mps` を書かないと **mph** で出る（最初に取り違えた） |
| 見た目 | 北西10m/s（地上10m）を一様に与えると、主稜線が赤（約1.3〜2倍）、稜線の風下・沢の中が青（0.4〜0.8倍）。谷川岳の山頂で 1.30倍。分布は 5%点 4.3・中央 8.6・95%点 15.5・最大 26.9 m/s → `tanigawa_nw10.jpg`（地形の陰影＋倍率の色＋風の向きの棒） |

![谷川岳・北西10m/s](tanigawa_nw10.jpg)

## まだ分からないこと

- **合っているか**。質量保存の解法は稜線の増速は得意、**風下の剥離（巻き返し）は苦手**（Wagenbrenner ら 2016・2019）。
  熱の風（谷風・山風）はほぼ検証されていない。検証の手段（山の観測）が少ない
- **入力の高さの合わせ方**。WindNinja の「一様な初期の風」は地上10mで与える。アプリの判定は山頂高度の気圧面の風を使う（ADR-0011）。
  どちらを「1倍」とみなすか（例：山頂の倍率で割り戻して、山頂で予報の値に一致させる）は決めていない
- 升目 60m で尾根・沢がどこまで出るか（30m・100m との比較は未実施）
- 端末に配る表の大きさ（16方位 × 倍率・角度。14km 四方・60m で 1山域 約 1.7MB（Float32）。8bit に量子化すれば 1/4）

## 手順（再現）

```sh
# 依存（Ubuntu 24.04）
apt-get install -y pkg-config libboost-program-options-dev libboost-date-time-dev libboost-test-dev libshp-dev libgdal-dev gdal-bin libnetcdf-dev
git clone --depth 1 https://github.com/firelab/windninja.git src
mkdir build && cd build
cmake -DNINJA_GUI=OFF -DNINJAFOAM=OFF -DPHONE_HOME_QUERIES=OFF -DSUPRESS_WARNINGS=ON -DCMAKE_BUILD_TYPE=Release ../src && make -j4

# 地形（地理院 DEM10B z14 → Webメルカトル → UTM 54N・30m）
python3 fetchDem.py 36.8375 138.9300 6 14 dem_png tanigawa_merc.asc
gdalwarp -s_srs EPSG:3857 -t_srs EPSG:32654 -tr 30 30 -r bilinear -srcnodata -9999 -dstnodata -9999 tanigawa_merc.asc tanigawa_utm30.tif

# 解く（WINDNINJA_DATA はソースの data/）
WINDNINJA_DATA=../src/data ./src/cli/WindNinja_cli tanigawa_nw.cfg
```

出典：地理院タイル（標高タイル）を加工して作成。
