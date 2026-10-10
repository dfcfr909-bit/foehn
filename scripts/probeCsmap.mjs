/* 県版の CS立体図（G空間情報センター）の配信を調べる（#112・#10）
 *
 * 知りたいこと:
 *   ① 栃木県「微地形図（CS立体図）」（csmap_tochigi）の XYZ タイルの実際の URL
 *   ② ライセンス欄の値と、リンク先（規約）の URL
 *   ③ どのズームでタイルが返るか（栃木の山で z8〜18）・画像の形式・CORS ヘッダ
 *   ④ 県境の外（福島側・群馬側）でどう返るか（404 か透明か）
 *   ⑤ 参考：G空間に載っている他の CS立体図のデータセット（名前・組織・ライセンス）
 *
 * ⚠ 開発環境からは G空間情報センターに届かない。Actions「CS立体図の配信を調べる」で走らせる。
 * ⚠ 調べるだけ。何も変えない。タイルは数十枚だけ取る。
 *
 * 使い方: node scripts/probeCsmap.mjs
 */
const CKAN = 'https://www.geospatial.jp/ckan/api/3/action';
const UA = 'NagiNavi-probeCsmap/1.0 (+https://dfcfr909-bit.github.io/foehn/)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 調べる地点（栃木の山と、県境の外）
const SPOTS = [
  { name: '男体山',           lat: 36.7650, lon: 139.4908, inside: true },
  { name: '那須・茶臼岳',     lat: 37.1225, lon: 139.9633, inside: true },
  { name: '日光白根山',       lat: 36.7986, lon: 139.3758, inside: true },   // 群馬県境の近く
  { name: '県外：尾瀬ヶ原（群馬）', lat: 36.9350, lon: 139.2300, inside: false },
  { name: '県外：会津駒ヶ岳（福島）', lat: 37.0480, lon: 139.3550, inside: false },
];
const ZOOMS = [8, 10, 12, 14, 15, 16, 17, 18];

const tileX = (lon, z) => Math.floor((lon + 180) / 360 * 2 ** z);
const tileY = (lat, z) => {
  const r = lat * Math.PI / 180;
  return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z);
};

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

function showPackage(p) {
  console.log(`\n### ${p.title}（${p.name}）`);
  console.log(`組織: ${p.organization ? p.organization.title : '（なし）'}`);
  console.log(`作成者: ${p.author || '（空欄）'} / メンテナー: ${p.maintainer || '（空欄）'}`);
  console.log(`ライセンス: id=${p.license_id || ''} title=${p.license_title || ''} url=${p.license_url || ''}`);
  for (const ex of p.extras || []) {
    if (/licen|許諾|規約|利用|出典|copyright/i.test(ex.key)) console.log(`  extras ${ex.key}: ${ex.value}`);
  }
  console.log(`更新: ${p.metadata_modified}`);
  console.log('リソース:');
  for (const r of p.resources || []) {
    console.log(`  - [${r.format || '?'}] ${r.name || ''}\n      ${r.url}`);
    if (r.description) console.log(`      説明: ${r.description.replace(/\s+/g, ' ').slice(0, 300)}`);
  }
  if (p.notes) console.log(`説明文（先頭600字）:\n${p.notes.replace(/\s+/g, ' ').slice(0, 600)}`);
}

// リソースから XYZ のテンプレートを拾う（{z}/{x}/{y} を含むもの）
function xyzTemplates(p) {
  return (p.resources || []).map(r => r.url || '').filter(u => /\{z\}/.test(u) && /\{x\}/.test(u));
}

async function probeTile(tpl, z, x, y) {
  const url = tpl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': UA, Origin: 'https://dfcfr909-bit.github.io' } });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      status: res.status, type: res.headers.get('content-type') || '',
      bytes: buf.length, cors: res.headers.get('access-control-allow-origin') || '（なし）',
      cache: res.headers.get('cache-control') || '',
    };
  } catch (e) {
    return { status: 'ERR', type: e.message, bytes: 0, cors: '', cache: '' };
  }
}

async function main() {
  console.log('## ① 栃木県 csmap_tochigi');
  let tochigi = null;
  try {
    tochigi = (await getJson(`${CKAN}/package_show?id=csmap_tochigi`)).result;
    showPackage(tochigi);
  } catch (e) {
    console.log(`✗ 取れない: ${e.message}`);
  }

  const tpls = tochigi ? xyzTemplates(tochigi) : [];
  console.log(`\n## ③④ タイル（XYZ のテンプレート ${tpls.length}件）`);
  for (const tpl of tpls) {
    console.log(`\n### ${tpl}`);
    for (const s of SPOTS) {
      console.log(`- ${s.name}（${s.inside ? '県内' : '県外'}）`);
      for (const z of ZOOMS) {
        const r = await probeTile(tpl, z, tileX(s.lon, z), tileY(s.lat, z));
        console.log(`    z${z}: ${r.status} ${r.type} ${r.bytes}B CORS=${r.cors} ${r.cache}`);
        await sleep(300);
      }
    }
  }
  if (!tpls.length) console.log('XYZ のテンプレートがリソースに無い。上のリソース一覧から URL を読むこと');

  console.log('\n## ⑤ G空間の CS立体図のデータセット');
  try {
    const res = (await getJson(`${CKAN}/package_search?q=${encodeURIComponent('CS立体図')}&rows=100`)).result;
    console.log(`件数: ${res.count}`);
    for (const p of res.results) {
      const xyz = xyzTemplates(p).length ? ' XYZあり' : '';
      console.log(`- ${p.title}（${p.name}）／${p.organization ? p.organization.title : ''}／作成者 ${p.author || '空欄'}／ライセンス ${p.license_title || p.license_id || '?'}${xyz}`);
    }
  } catch (e) {
    console.log(`✗ 取れない: ${e.message}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
