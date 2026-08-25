/* 気象庁の天気図（速報天気図）がブラウザから使えるかを調べる。
 *
 * なぜ要るか:
 *   ADR-0010 で「計算した気圧配置」を外した。代わりの案の1つが
 *   **気象庁の天気図を別パネルの1枚絵で出す**こと。前線が描いてあるのが大きい
 *   （気圧の場だけからは原理的に出せない）。
 *   ⚠ **開発環境から気象庁へ到達できない**（プロキシ403）ので、
 *     GitHub Actions から実際に叩いて確かめる。
 *
 * ⚠ **URLを推測で断定しないこと。** 候補を並べて、返ってきたものから形を読む。
 *   list.json が読めたら、その中身から画像のURLを組み立てて実際に取りに行く。
 *
 * ⚠ **Node の fetch は CORS を強制しない。** ここで分かるのは
 *   「サーバが `access-control-allow-origin` を返すかどうか」まで。
 *   返していればブラウザの fetch も通る。返していなくても、
 *   **`<img>` で表示するだけなら CORS は要らない**（canvas で読まない限り）。
 *   その線引きも一緒に出す。
 *
 * 使い方: node scripts/probeJma.mjs
 */
const ORIGIN = 'https://dfcfr909-bit.github.io';
const TIMEOUT = 20000;

const CANDIDATES = [
  // 対照群。アプリが既に使っていて、実機で動いているもの
  ['対照（アプリが使用中）', 'https://www.jma.go.jp/bosai/amedas/data/latest_time.txt'],
  // 天気図の時刻一覧（これが読めれば「いつの天気図があるか」が分かる）
  ['天気図の一覧', 'https://www.jma.go.jp/bosai/weather_map/data/list.json'],
  // 近海の天気図など、別の置き場の可能性
  ['天気図（別候補）', 'https://www.jma.go.jp/bosai/weather_map/data/index.json'],
];

const head = (res, k) => res.headers.get(k) || '(無し)';

async function probe(label, url) {
  console.log(`\n── ${label}`);
  console.log(`   ${url}`);
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
      headers: { 'Origin': ORIGIN },   // ブラウザからの取得を模す
    });
    const acao = head(res, 'access-control-allow-origin');
    console.log(`   HTTP ${res.status} ${res.statusText}`);
    console.log(`   content-type            : ${head(res, 'content-type')}`);
    console.log(`   access-control-allow-origin : ${acao}`);
    if (!res.ok) return { url, ok: false, status: res.status, acao };
    const buf = Buffer.from(await res.arrayBuffer());
    console.log(`   長さ                    : ${buf.length} バイト`);
    const text = buf.slice(0, 400).toString('utf8');
    console.log(`   先頭                    : ${JSON.stringify(text.slice(0, 300))}`);
    return { url, ok: true, status: res.status, acao, body: buf };
  } catch (e) {
    console.log(`   ✗ 取得できない: ${e.message}`);
    return { url, ok: false, err: e.message };
  }
}

console.log('気象庁の天気図が使えるかを調べます');
console.log(`（Origin: ${ORIGIN} を名乗って取得します）`);

const results = [];
for (const [label, url] of CANDIDATES) results.push(await probe(label, url));

/* 一覧が読めたら、その中身から画像のURLを組み立てて実際に取りに行く。
   ⚠ **ここが肝。** 一覧の形が分かって初めて、画像のURLを推測でなく決められる。 */
const list = results.find(r => r.ok && r.url.includes('weather_map'));
if (list) {
  console.log('\n── 一覧の中身から画像を1枚取ってみる');
  let json = null;
  try { json = JSON.parse(list.body.toString('utf8')); }
  catch (e) { console.log(`   ✗ JSONとして読めない: ${e.message}`); }
  if (json) {
    /* ⚠ **中身の形を推測しない。** 何が何本あるのかをそのまま出す。
         ここを飛ばして実装に入ると、「予想天気図もあるのか」「何時間ぶんあるのか」を
         知らないまま画面を設計することになる。 */
    const walk = (o, path = '') => {
      if (Array.isArray(o)) {
        console.log(`   ${path || '(root)'} : 配列 ${o.length}件`);
        if (o.length) {
          console.log(`      最初 : ${JSON.stringify(o[0]).slice(0, 160)}`);
          if (o.length > 1) console.log(`      最後 : ${JSON.stringify(o[o.length - 1]).slice(0, 160)}`);
        }
      } else if (o && typeof o === 'object') {
        console.log(`   ${path || '(root)'} : オブジェクト {${Object.keys(o).join(', ')}}`);
        for (const k of Object.keys(o)) walk(o[k], path ? `${path}.${k}` : k);
      }
    };
    walk(json);
    // 中身に現れる「それらしい名前」を拾う（推測でURLを組み立てないため）
    const flat = JSON.stringify(json);
    const names = [...new Set(flat.match(/[0-9]{12,14}[-_A-Za-z0-9]*\.(png|jpg|gif)/g) || [])];
    console.log(`\n   画像らしい名前: 全${names.length}件`);
    if (names.length) {
      const base = 'https://www.jma.go.jp/bosai/weather_map/data/png/';
      const r = await probe('画像そのもの（1枚目）', base + names[0]);
      /* PNG の IHDR から縦横を読む（別パネルの大きさを決めるのに要る）。
         ⚠ 画素を読むわけではないので CORS は関係ない。 */
      if (r && r.ok && r.body && r.body.length > 24) {
        const w = r.body.readUInt32BE(16), h = r.body.readUInt32BE(20);
        console.log(`   画像の寸法: ${w} x ${h}`);
      }
      // 最後の1枚も取ってみる（一覧の末尾が予想図なのか実況なのかを見る）
      if (names.length > 1) await probe('画像そのもの（最後）', base + names[names.length - 1]);
    }
  }
}

console.log('\n──────── まとめ ────────');
for (const r of results) {
  const acao = r.acao === undefined ? '-' : r.acao;
  console.log(`${r.ok ? '✓' : '✗'} ${r.status || r.err}  CORS:${acao}  ${r.url}`);
}
console.log(`
⚠ 読み方
  - CORS のヘッダが付いていれば、ブラウザの fetch も通る（一覧が引ける）
  - 付いていなくても、**<img> で表示するだけなら CORS は要らない**
    （canvas で画素を読まない限り）。一覧だけ別の手立てが要る、という話になる
  - ここは Node からの取得。**最終的な可否はブラウザで確かめること**`);
