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
      { lat: 32.8000, lon: 131.0000, title: '大日岳（遠い同名峰）' },   // 1件目＝遠い
      { lat: 37.8340, lon: 139.6605, title: '大日岳（飯豊）' },        // 近い
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
ok(/要確認 1件/.test(out2), '★離れていれば要確認に出す', out2.slice(0, 600));
ok(/朝日岳/.test(out2) && /km/.test(out2), '距離を添えて出す', out2.slice(0, 600));

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
