# ADR-0013: 風の流れを WebGL で描く試作（描画は GPU、移流は CPU）

- ステータス: 採用（**PoC・実験の層として**。正式な描画エンジンにするかは実機の計測で決める）
- 日付: 2026-09-27

## 背景

風の流れ（v4.116.0〜・Canvas 2D）は「絵として出る」ところまで来たが、Windy の滑らかさとの差が大きい。

- **地図を動かすと消える。** `movestart`/`zoomstart` で止めて消し、動き終わってから撒き直す
- **時刻を変えると全部を撒き直す**ので、画面が一度に入れ替わる
- 粒の数は面積比例で**最大1,400**。線を CPU で描くので、これ以上増やすと iPhone で重くなる見込み
- 1コマごとの移動なので、端末が重くなると流れも遅くなる

要件は「Windy の API やコードを使わずに、**Föhn 自身の風の場**で滑らかな粒子を描けるか確かめる」。
場（`buildWindField` / `sampleWindField` / `resolveWindAt` / `WindVertical`）・判定・取得には触らない。

## 決定

**方式 C'：描画は GPU（WebGL）、粒の移流は CPU（型付き配列）**の自前エンジンを、
実験の層「風の流れ（実験）」（`windFlowGL`）として足す。Canvas 版と矢印は残し、並べて比べられるようにする。
WebGL が使えない端末では Canvas 版が代わりに流す。

- 粒の位置は**世界座標**（Web メルカトルの px・基準ズーム z0）で持つ → パン・ピンチで止めない・撒き直さない
- 尾はフレームバッファ2枚の往復で薄め、地図が動いた分は前のコマの尾を**ずらして・拡大縮小して**重ねる
- 時刻を変えたら、古い場から新しい場へ 0.4 秒かけて按分する（粒は撒き直さない）
- 速さは Canvas 版と同じ**風速に正比例**（v4.118.0）。コマ数ではなく経過時間で動かす

## 理由 / 検討した代案

| 案 | 判断 |
|---|---|
| A 現行 Canvas を改善 | 予備として残す（WebGL が無い端末用）。線を描く処理と画面全体を薄める処理が CPU に残るので、粒の数の余裕が出ない |
| B earth / windy.js 系の Canvas | 現行とほぼ同じ方式なので得るものが少ない |
| **C' 描画は GPU・移流は CPU（採用）** | 重いのは線を描く処理と画面全体を薄める処理で、移流は軽い（PC のヘッドレスで 20,000粒の移流が約1.3ms）。WebGL1＋`ANGLE_instanced_arrays` で動き、**float テクスチャに頼らない**。粒の位置を JS で持つので、検査が「場の中にいるか・風向どおりか」を直接見られる |
| C/D 移流も GPU（mapbox/webgl-wind 型） | **却下（いまは）**。位置をテクスチャに詰めるので、iPhone の float の描画先の対応に賭けるか、RGBA8 に詰める仕掛けが要る。スマホの画面にそこまでの粒（6万〜）は要らない。移流が CPU のネックになったら次の段で移す |
| E wind-layer（sakitam-fdd）を使う | **却下**。WebGL 版は `@sakitam-gis/vis-engine`・`gl-matrix`・`earcut`・worker に依存し、入力は U/V を詰めた PNG／タイル。バンドラの無い単一HTML（ADR-0001）と合わない |
| leaflet-velocity | 以前から使わない方針（依存を増やさない）。中身は windy.js（earth の簡略版）で、現行の Canvas 版と同じ方式 |
| Windy の API | 使わない（目的外・外部への依存）。非公開のコードも見ない |

### 参考にした考え方（コードは写していない）

| 出典 | License | 借りた考え方 |
|---|---|---|
| [mapbox/webgl-wind](https://github.com/mapbox/webgl-wind) | ISC | 尾を画面テクスチャ2枚の往復で薄める／`floor(c*255*fade)/255` で 8bit の消え残りを払う／寿命とは別の一定確率の撒き直し |
| [cambecc/earth](https://github.com/cambecc/earth) | MIT | 格子→補間した場→粒の移流・寿命・色の帯で描く流れ |
| [onaci/leaflet-velocity](https://github.com/onaci/leaflet-velocity)（windy.js） | CSIRO（BSD 変種）＋MIT | 同上（earth の簡略版）。色ごとにまとめて描く |
| [sakitam-fdd/wind-layer](https://github.com/sakitam-fdd/wind-layer) | MIT | Leaflet への重ね方（`wind-core` は Canvas、`leaflet-wind` は WebGL） |
| Leaflet 1.9 `ImageOverlay._animateZoom` | BSD-2 | ズームの演出に `_latLngToNewLayerPoint`＋`setTransform` で合わせる |

- Esri/wind-js（windy.js の出どころ）は取得できず（404）、ライセンスを確かめられなかったので参考にしていない
- Föhn はライセンスが未設定（#12）。他所のコードを混ぜないため、**考え方だけを借りて自前で書いた**

## 影響

- 場（`buildWindField` 以前）は描画側から変えない。WebGL 版も `sampleWindField` で場を引くだけ
- 粒の数を決めるのは `windGLParticleCount()` の1か所だけ（PoC は iPhone 相当 8,000／PC 20,000 の固定値）。
  端末の性能・画面の広さ・実測の FPS に応じて増減する形（adaptive）へは、ここを育てる
- ⚠ **ヘッドレスの Chromium（SwiftShader）の FPS は実機の指標にしない。** GPU を CPU で真似ているので、
  Canvas 版より遅く出る（1,400粒で WebGL 約38ms・Canvas 約9ms）。実機は計測表示の「10秒計測」で測る
- ⚠ ズームの演出の間（約0.25秒）は描かずに CSS で拡大縮小する。演出の終わりに尾を新しい倍率へ写して続ける
- 正式に採用するなら Canvas 版を予備に下げ、層を1つにまとめる（別の ADR で決める）
