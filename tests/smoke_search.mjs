/* 地名検索との突き合わせ（scripts/searchPeaks.mjs）の検査。
 *
 * ⚠ **いちばん危ないのは「検索結果の1件目を採る」こと。**
 *   同名の山は各地にある（駒ヶ岳・大日岳・別山…）。順番に意味は無いので、
 *   1件目を採ると**まったく別の県の同名峰**と突き合わせて、
 *   正しい座標を「要確認」に落としたり、その逆をやったりする。
 *   採るのは **areas.json の座標に最も近い候補**。ここを検査する。
 *
 * 通信はスタブする（開発環境から地理院に到達できないため）。
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };

/* areas.json を差し替えられないスクリプトなので、リポジトリごと小さく作って
   そこで走らせる。**本物の areas.json は触らない。** */
function runSearch({ peaks, results, args = [] }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'search-'));
  fs.mkdirSync(path.join(tmp, 'scripts'));
  fs.copyFileSync(path.join(ROOT, 'scripts', 'searchPeaks.mjs'),
    path.join(tmp, 'scripts', 'searchPeaks.mjs'));
  fs.writeFileSync(path.join(tmp, 'areas.json'), JSON.stringify({
    version: 99, note: 'テスト用',
    areas: [{ id: 'test', name: 'テスト山域', region: '中部', peaks }],
  }, null, 2));

  // 名前 → 候補の並び。fetch を差し替えてから本体を import する薄いラッパ
  fs.writeFileSync(path.join(tmp, 'run.mjs'), `
const results = ${JSON.stringify(results)};
globalThis.fetch = async (url) => {
  const q = decodeURIComponent(String(url).split('q=')[1] || '');
  const feats = (results[q] || []).map(r => ({
    geometry: { coordinates: [r.lon, r.lat] },
    properties: { title: r.title || q },
  }));
  return { ok: true, status: 200, json: async () => ({ type: 'FeatureCollection', features: feats }) };
};
await import(${JSON.stringify(pathToFileURL(path.join(tmp, 'scripts', 'searchPeaks.mjs')).href)});
`);

  let out = '';
  try {
    out = execFileSync('node', [path.join(tmp, 'run.mjs'), ...args], { encoding: 'utf8' });
  } catch (e) {
    out = (e.stdout || '') + (e.stderr || '');
    // 要確認が見つかると exit 1 で終わる。異常終了とは区別する
    if (!out.includes('要確認') && !out.includes('引けなかった')) {
      fails.push('スクリプトが異常終了した: ' + (e.stderr || '').slice(0, 300));
    }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  return out;
}

/* --- 場面1: 同名の別峰へ引きずられないこと ---
   「大日岳」を、遠い順で返す。1件目は九州の同名峰のつもり。
   areas.json は飯豊の大日岳（37.8335, 139.6612）を指している。 */
const out1 = runSearch({
  peaks: [{ name: '大日岳', lat: 37.8335, lon: 139.6612, elev: 2128 }],
  results: {
    '大日岳': [
      // ⚠ タイトルは実物に合わせて素の峰名にすること。説明を足すと
      //    名前の照合（住所・施設を落とす仕組み）に引っかかって検査にならない
      { lat: 32.8000, lon: 131.0000, title: '大日岳' },   // 1件目＝遠い同名峰
      { lat: 37.8340, lon: 139.6605, title: '大日岳' },   // 近い（飯豊）
    ],
  },
});
console.log(out1);
ok(/✅ 全1峰が地名検索の位置と/.test(out1),
  '★近い候補を選ぶ（1件目の遠い同名峰に引きずられない）', out1.slice(-400));

/* --- 場面2: 本当に離れていれば要確認に出すこと ---
   候補が1つだけで、areas.json から遠い。 */
const out2 = runSearch({
  peaks: [{ name: '朝日岳', lat: 38.1417, lon: 139.9331, elev: 1871 }],
  results: { '朝日岳': [{ lat: 38.0600, lon: 139.9200, title: '朝日岳' }] },
});
console.log(out2);
ok(/⚠ 要確認 1件/.test(out2), '★離れていれば要確認に出す', out2.slice(0, 600));
ok(/朝日岳/.test(out2) && /km/.test(out2), '距離を添えて出す', out2.slice(0, 600));

/* --- 場面2b: 住所・施設を「その山」として扱わないこと ---
   地名辞書に山が無いと住所や施設が返る。部分一致で通すと
   「離れている＝別の山を指している」と誤報し、**本物の要確認がその中に埋もれる**。 */
const out2b = runSearch({
  peaks: [{ name: '飯豊本山', lat: 37.8548, lon: 139.7071, elev: 2105 }],
  results: {
    '飯豊本山': [{ lat: 37.3047, lon: 140.6143, title: '福島県小野町大字飯豊本飯豊' }],
  },
});
console.log(out2b);
ok(!/⚠ 要確認/.test(out2b), '★★住所を山として拾わない（誤って要確認にしない）', out2b.slice(0, 600));
ok(/名前で引けなかったもの 1件/.test(out2b),
  '拾えなかったものとして別立てで出す', out2b.slice(-400));

/* 括弧つきの峰名は括弧の前で照合する（立山（雄山）→「立山」） */
const out2c = runSearch({
  peaks: [{ name: '立山（雄山）', lat: 36.5759, lon: 137.6198, elev: 3003 }],
  results: {
    '立山（雄山）': [
      { lat: 36.6635, lon: 137.3137, title: '富山県中新川郡立山町' },
      { lat: 36.5760, lon: 137.6200, title: '立山' },
    ],
  },
});
console.log(out2c);
ok(/✅ 全1峰/.test(out2c), '括弧つきの峰名は括弧の前で照合する', out2c.slice(-400));

/* --- 場面2d: 遠すぎる同名峰を「座標の誤り」と呼ばないこと ---
   ⚠ 山が地名辞書に無いと、遠くの同名峰だけが候補に残る。
     鳥海山の笙ヶ岳に対して養老山地の笙ヶ岳（525km）が出たのが実例。
     これを「別の山を指している疑い」に混ぜると、**直すところが無い峰を疑わせる**。 */
const out2d = runSearch({
  peaks: [{ name: '笙ヶ岳', lat: 39.0972, lon: 140.0089, elev: 1635 }],
  results: { '笙ヶ岳': [{ lat: 35.2838, lon: 136.5112, title: '笙ヶ岳' }] },
});
console.log(out2d);
ok(!/⚠ 要確認/.test(out2d), '★★遠すぎる同名峰を要確認に混ぜない', out2d.slice(0, 700));
ok(/同名の別の山しか見つからなかったもの 1件/.test(out2d) && /525km/.test(out2d),
  '別立てで距離つきに出す', out2d.slice(-600));
ok(/座標の誤りではない/.test(out2d), '座標の誤りではないと明記する', out2d.slice(-600));

/* --- 場面2e: 表記揺れで空振りしないこと ---
   ⚠ **これが #13 の最後の落とし穴だった。** 鳥海山の笙ヶ岳は地理院に
     「笙**ガ**岳」で載っている。「笙ヶ岳」でしか引かないと岐阜県の
     笙ヶ岳(908m)しか返らず、525km離れているので**「同名の別の山」と
     誤って結論づける**。実際には辞書に有り、引けていなかっただけだった。 */
const out2e = runSearch({
  peaks: [{ name: '笙ヶ岳', lat: 39.0927, lon: 140.0020, elev: 1635 }],
  results: {
    '笙ヶ岳': [{ lat: 35.2838, lon: 136.5112, title: '笙ヶ岳' }],       // 岐阜だけ
    '笙ケ岳': [{ lat: 39.0930, lon: 140.0025, title: '笙ガ岳' }],       // 揺れを当てて初めて出る
    '笙ガ岳': [{ lat: 39.0930, lon: 140.0025, title: '笙ガ岳' }],
  },
});
console.log(out2e);
ok(/✅ 全1峰/.test(out2e),
  '★★★表記揺れ（ヶ／ガ）を吸収して正しい山に当てる', out2e.slice(-600));
ok(!/同名の別の山/.test(out2e),
  '★★引けていないだけのものを「別の山」と言わない', out2e.slice(-600));

/* 「ノ」の揺れ（間ノ岳／間の岳） */
const out2f = runSearch({
  peaks: [{ name: '間ノ岳', lat: 35.6460, lon: 138.2282, elev: 3190 }],
  results: { '間の岳': [{ lat: 35.6462, lon: 138.2280, title: '間の岳' }] },
});
console.log(out2f);
ok(/✅ 全1峰/.test(out2f), '「ノ」の揺れも吸収する', out2f.slice(-500));

/* --- 場面3: 引けなかったものを黙って落とさないこと ---
   ⚠ 候補ゼロを「一致」と同じ扱いにすると、**検証していない峰が検証済みに見える**。 */
const out3 = runSearch({
  peaks: [{ name: '無名峰', lat: 36.0000, lon: 137.0000, elev: 2000 }],
  results: {},
});
console.log(out3);
ok(/名前で引けなかったもの 1件/.test(out3) && /無名峰/.test(out3),
  '★引けなかった峰を別立てで出す（黙って合格にしない）', out3.slice(-400));
// ⚠ ここが本丸。✅ を出すと「検証していない峰が検証済みに見える」
ok(!/✅/.test(out3), '★★照合できない峰があるうちは ✅ を出さない', out3.slice(-500));
ok(/照合できていない/.test(out3), '照合できていない件数を明示する', out3.slice(-500));

if (fails.length) {
  console.log(`FAILED ${fails.length}件:`);
  for (const f of fails) console.log('  ✗ ' + f);
  console.log('SEARCH SMOKE FAILED');
  process.exit(1);
}
console.log('SEARCH SMOKE PASSED');
