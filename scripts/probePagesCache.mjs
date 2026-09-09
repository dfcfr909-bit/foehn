/* 公開URLがどんなキャッシュ指示を返しているかを調べる。
 *
 * なぜ要るか:
 *   「マージして配信も照合も緑なのに、実機では古い画面のまま」という報告。
 *   ⚠ `sw.js` は **HTMLをネットワーク優先**にしてあるので、Service Worker は
 *     容疑者から外れる。だが SW の中の `fetch(req)` は**ブラウザのHTTPキャッシュを
 *     経由する**ので、配信元が長い `max-age` を返していれば、
 *     「ネットワーク優先」と書いてあっても古いものが返る。
 *   その `max-age` が実際に何秒なのかを、推測せずに確かめる。
 *
 *   ⚠ **開発環境から GitHub Pages へ到達できない**（プロキシ403）。
 *     GitHub Actions「外部の情報源を調べる」から手動実行する。
 *
 * ⚠ **調べるだけ。何も変えない。**
 *
 * 使い方: node scripts/probePagesCache.mjs
 */
const TARGETS = [
  ['本体（HTML）',      'https://dfcfr909-bit.github.io/foehn/sotoki_v4.html'],
  ['入口（リダイレクト）', 'https://dfcfr909-bit.github.io/foehn/'],
  ['Service Worker',    'https://dfcfr909-bit.github.io/foehn/sw.js'],
  ['山のデータ',        'https://dfcfr909-bit.github.io/foehn/areas.json'],
];
const KEYS = ['cache-control', 'etag', 'last-modified', 'age', 'expires', 'content-length'];

console.log('公開URLのキャッシュ指示を調べます');
console.log('⚠ 見たいのは cache-control の max-age。ここが長いと、SWがネットワーク優先でも');
console.log('  ブラウザのHTTPキャッシュが古いものを返す。');

let worst = 0;
for (const [label, url] of TARGETS) {
  console.log(`\n── ${label}`);
  console.log(`   ${url}`);
  try {
    // ⚠ 既定のまま取る。no-cache を付けると「ブラウザが普通に取ったとき」が分からない
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    console.log(`   HTTP ${res.status} ${res.statusText}`);
    for (const k of KEYS) console.log(`   ${k.padEnd(16)}: ${res.headers.get(k) || '(無し)'}`);
    const m = /max-age=(\d+)/.exec(res.headers.get('cache-control') || '');
    if (m) {
      const sec = +m[1];
      if (label.includes('HTML') || label.includes('入口')) worst = Math.max(worst, sec);
      console.log(`   → 最大 ${sec} 秒（約${Math.round(sec / 60)}分）は古いものが返りうる`);
    }
    // 再検証だけさせたときに 304 が返るか（ETagが効いているか）
    const et = res.headers.get('etag');
    if (et) {
      const r2 = await fetch(url, { headers: { 'if-none-match': et }, signal: AbortSignal.timeout(20000) });
      console.log(`   再検証（If-None-Match）: HTTP ${r2.status}` +
        (r2.status === 304 ? '  → 304。no-cache で取り直しても通信は軽い' : ''));
    }
  } catch (e) {
    console.log(`   ✗ 取得できない: ${e.message}`);
  }
}

console.log('\n── まとめ');
if (worst > 0) {
  console.log(`⚠ HTMLは最大 ${worst} 秒（約${Math.round(worst / 60)}分）古いものが返りうる。`);
  console.log('  sw.js の HTML分岐を fetch(req.url, { cache: "no-cache" }) にすれば、');
  console.log('  毎回サーバへ確認しに行く（ETagが効くので中身は304で済む）。');
  console.log('⚠ req をそのまま new Request で作り直さないこと。');
  console.log('  ナビゲーションの Request は mode:"navigate" で、作り直すと例外になる。');
} else {
  console.log('HTMLに max-age は付いていない。原因は別のところにある。');
}
