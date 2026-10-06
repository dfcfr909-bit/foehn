#!/usr/bin/env node
// sotoki_v4.html の全関数・定数の索引（docs/spec/code_index.md）を作る。
//   node scripts/genCodeIndex.mjs          … 作り直して書き出す
//   node scripts/genCodeIndex.mjs --check  … 顔ぶれ（追加・削除・改名）が索引とずれていたら落とす（行番号のずれでは落とさない）
// 説明・地雷は手書きの docs/spec/code_map.md に書く。ここは機械で作れる「どこに何があり、誰が使うか」だけ
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.CODE_INDEX_SRC || path.join(ROOT, 'sotoki_v4.html');
const OUT = process.env.CODE_INDEX_OUT || path.join(ROOT, 'docs', 'spec', 'code_index.md');
const MAP = path.join(ROOT, 'docs', 'spec', 'code_map.md');

// トップレベル（行頭）の宣言だけを拾う。入れ子の関数は親の中身として扱う
const DECLS = [
  { kind: '関数', re: /^(?:async )?function\s+([A-Za-z_$][\w$]*)\s*\(/ },
  { kind: '関数', re: /^(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/ },
  { kind: '定数', re: /^(?:const|let)\s+([A-Z][A-Z0-9_]+)\s*=/ },
  { kind: '状態', re: /^(?:const|let)\s+([a-z][\w$]*)\s*=\s*[{[]/ },
];

export function buildIndex(html) {
  const lines = html.split('\n');
  const sOpen = lines.findIndex(l => l.trim() === '<script>');
  const sClose = lines.findIndex((l, i) => i > sOpen && l.trim() === '</script>');
  if (sOpen < 0 || sClose < 0) throw new Error('本体の <script> が見つからない');

  // ブロック見出し（/* ===== の次の行）
  const blocks = [];
  for (let i = sOpen; i < sClose; i++) {
    if (/^\s*\/\*\s*={6,}\s*$/.test(lines[i]) && lines[i + 1]) {
      const t = lines[i + 1].trim().replace(/\*\/\s*$/, '').trim();
      if (t && !/^=+$/.test(t)) blocks.push({ line: i + 1, title: t });
    }
  }
  const blockAt = ln => { let b = null; for (const x of blocks) { if (x.line <= ln) b = x; else break; } return b; };

  // 宣言
  const decls = [];
  for (let i = sOpen + 1; i < sClose; i++) {
    for (const d of DECLS) {
      const m = lines[i].match(d.re);
      if (m) { decls.push({ name: m[1], kind: d.kind, line: i + 1 }); break; }
    }
  }
  // 宣言の終わり：次に行頭（字下げなし）で始まる行。閉じ括弧（} ] )）ならその行まで、それ以外はその手前まで
  for (const d of decls) {
    d.end = d.line;
    for (let j = d.line; j < sClose; j++) {
      const c = lines[j][0];
      if (!c || /\s/.test(c)) continue;
      d.end = /[}\])]/.test(c) ? j + 1 : j;
      break;
    }
  }
  const byName = new Map();
  for (const d of decls) if (!byName.has(d.name)) byName.set(d.name, d);
  const ownerAt = ln => { let o = null; for (const d of decls) { if (d.line <= ln) o = d; else break; } return o && ln <= o.end ? o : null; };

  // 参照（コメントを除いた本文で、識別子として出てくる所）。持ち主＝その行を含むトップレベル宣言
  const refs = new Map([...byName.keys()].map(n => [n, new Set()]));
  let inBlock = false;
  for (let i = 0; i < lines.length; i++) {
    let t = lines[i];
    if (inBlock) { const e = t.indexOf('*/'); if (e < 0) continue; t = t.slice(e + 2); inBlock = false; }
    t = t.replace(/\/\*.*?\*\//g, ' ');
    const s = t.indexOf('/*'); if (s >= 0) { t = t.slice(0, s); inBlock = true; }
    t = t.replace(/(^|\s)\/\/.*$/, '$1');
    const ln = i + 1;
    const inScript = ln > sOpen + 1 && ln < sClose + 1;
    const owner = inScript ? ownerAt(ln) : null;
    const ownerName = owner ? owner.name : inScript ? '（トップレベル）' : '（HTML）';
    for (const m of t.matchAll(/[A-Za-z_$][\w$]*/g)) {
      const n = m[0];
      if (!refs.has(n)) continue;
      const d = byName.get(n);
      if (owner && owner.name === n) continue;          // 自分の中
      if (d.line === ln) continue;                       // 宣言の行
      if (m.index > 0 && t[m.index - 1] === '.' && t.slice(m.index - 3, m.index) !== '...') continue; // obj.name は別物（...name は展開なので数える）
      refs.get(n).add(ownerName);
    }
  }

  return { lines: lines.length, sOpen: sOpen + 1, sClose: sClose + 1, blocks, decls, byName, refs };
}

function documented(names) {
  let txt = '';
  try { txt = fs.readFileSync(MAP, 'utf8'); } catch { return new Set(); }
  const found = new Set(txt.match(/[A-Za-z_$][\w$]*/g) || []);
  return new Set(names.filter(n => found.has(n)));
}

export function renderIndex(ix) {
  const names = [...ix.byName.keys()];
  const doc = documented(names);
  const fnCount = ix.decls.filter(d => d.kind === '関数').length;
  const out = [];
  out.push('# コードの全索引（自動生成）');
  out.push('');
  out.push('> ⚠ **このファイルは手で直さない。** `node scripts/genCodeIndex.mjs` で作り直す。');
  out.push('> 関数・定数を足す・消す・改名したら作り直す（`tests/smoke_codeindex.mjs` が顔ぶれのずれで落とす。行番号のずれでは落とさない）。');
  out.push('> 説明・地雷・「なぜ」は手書きの [`code_map.md`](code_map.md) と `docs/adr/`。ここは「どこに何があり、誰が使うか」だけ。');
  out.push('');
  out.push(`- \`sotoki_v4.html\`：${ix.lines.toLocaleString()}行／本体の \`<script>\` は ${ix.sOpen}〜${ix.sClose} 行`);
  out.push(`- トップレベルの宣言 ${ix.decls.length}（関数 ${fnCount}・定数と状態 ${ix.decls.length - fnCount}）／ブロック ${ix.blocks.length}`);
  out.push(`- \`code_map.md\` に説明があるもの：${doc.size}／${names.length}（📝 印）`);
  out.push('- **参照元**＝その名前を使っているトップレベルの関数（推定。文字列の中の `onclick="名前()"` も数える。コメントは除く）。');
  out.push('  変更の影響範囲を見るときの手がかりで、網羅は保証しない。`（HTML）` は `<script>` の外（マークアップ）、`（トップレベル）` は関数の外の文（起動時の登録など）からの参照');
  out.push('- 参照元が 0 のもの＝どこからも呼ばれていない候補（起動時に1回だけ動くものや、テストからだけ使うものもある）');
  out.push('');
  out.push('## 目次');
  out.push('');
  const groups = [];
  const head = { line: ix.sOpen, title: '（先頭・見出しの前）' };
  for (const d of ix.decls) {
    let b = head;
    for (const x of ix.blocks) { if (x.line <= d.line) b = x; else break; }
    let g = groups.find(g => g.b === b);
    if (!g) groups.push(g = { b, items: [] });
    g.items.push(d);
  }
  for (const g of groups) out.push(`- 行 ${g.b.line}：${g.b.title}（${g.items.length}）`);
  out.push('');
  for (const g of groups) {
    out.push(`## ${g.b.title}`);
    out.push('');
    out.push(`行 ${g.b.line}〜`);
    out.push('');
    out.push('| 名前 | 種類 | 行 | 参照元 |');
    out.push('|---|---|---|---|');
    for (const d of g.items) {
      if (ix.byName.get(d.name) !== d) continue;  // 同名の再宣言は先頭だけ
      const r = [...ix.refs.get(d.name)].sort();
      const shown = r.slice(0, 6).map(x => x.startsWith('（') ? x : `\`${x}\``).join('、');
      const more = r.length > 6 ? ` ほか${r.length - 6}` : '';
      out.push(`| \`${d.name}\`${doc.has(d.name) ? ' 📝' : ''} | ${d.kind} | ${d.line} | ${r.length ? `${r.length}：${shown}${more}` : '0'} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

const namesInIndex = md => new Set([...md.matchAll(/^\| `([A-Za-z_$][\w$]*)`/gm)].map(m => m[1]));

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const ix = buildIndex(fs.readFileSync(SRC, 'utf8'));
  if (process.argv.includes('--check')) {
    let cur = '';
    try { cur = fs.readFileSync(OUT, 'utf8'); } catch { console.error(`✗ ${path.relative(ROOT, OUT)} が無い。node scripts/genCodeIndex.mjs で作る`); process.exit(1); }
    const want = new Set(ix.byName.keys()), have = namesInIndex(cur);
    const added = [...want].filter(n => !have.has(n)), removed = [...have].filter(n => !want.has(n));
    if (added.length || removed.length) {
      console.error('✗ 索引（docs/spec/code_index.md）が本体とずれている。node scripts/genCodeIndex.mjs で作り直す');
      if (added.length) console.error(`  索引に無い：${added.join(', ')}`);
      if (removed.length) console.error(`  本体に無い：${removed.join(', ')}`);
      process.exit(1);
    }
    console.log(`✓ 索引の顔ぶれは本体と一致（${want.size}件）`);
  } else {
    fs.writeFileSync(OUT, renderIndex(ix) + '\n');
    console.log(`✓ ${path.relative(ROOT, OUT)} を書き出した（${ix.byName.size}件・ブロック ${ix.blocks.length}）`);
  }
}
