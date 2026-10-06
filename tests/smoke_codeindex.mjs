// コードの全索引（docs/spec/code_index.md）が本体とずれていないか・参照元の数え方が正しいか
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { buildIndex } from '../scripts/genCodeIndex.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.join(ROOT, 'scripts', 'genCodeIndex.mjs');
const fails = [];
const ok = (c, msg, info) => { if (!c) fails.push(`  ✗ ${msg}${info === undefined ? '' : ' … ' + JSON.stringify(info)}`); };
const run = env => { try { execFileSync(process.execPath, [GEN, '--check'], { env: { ...process.env, ...env }, stdio: 'pipe' }); return 0; } catch (e) { return { code: e.status, err: String(e.stderr) }; } };

// ①本物：索引の顔ぶれが本体と一致
const real = run({});
ok(real === 0, '★docs/spec/code_index.md の顔ぶれが sotoki_v4.html と一致（ずれたら node scripts/genCodeIndex.mjs で作り直す）', real);

// ②参照元の数え方（本物で既知の関係）
const ix = buildIndex(fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8'));
const refs = n => [...(ix.refs.get(n) || [])];
ok(refs('judgePoint').includes('gradeOf'), '関数の中からの呼び出しを数える（gradeOf → judgePoint）', refs('judgePoint'));
ok(refs('selectFromPointer').includes('（トップレベル）'), '関数の外の文（起動時の登録）からの参照を数える', refs('selectFromPointer'));
ok(refs('WIND_INTERP_EXTRA').includes('windInterpLevels'), '展開（...名前）も参照として数える', refs('WIND_INTERP_EXTRA'));
ok(refs('windBgToggleSpeedMinMode').some(x => x !== 'windBgToggleSpeedMinMode'), '文字列の onclick="名前()" も参照として数える', refs('windBgToggleSpeedMinMode'));
ok(!refs('radarWetAt').length, 'コメントの中の名前は数えない（radarWetAt は説明文にしか出てこない）', refs('radarWetAt'));
ok(ix.byName.get('THRESH')?.kind === '定数' && ix.byName.get('windPref')?.kind === '状態', '定数・状態も載る', [ix.byName.get('THRESH')?.kind, ix.byName.get('windPref')?.kind]);

// ③ずれの検出：偽の本体で、足した・消した関数を落とす。行がずれただけなら落とさない
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'codeindex-'));
const src = path.join(tmp, 'x.html'), out = path.join(tmp, 'index.md');
const body = fns => `<html>\n<script>\n/* ============================================================\n   TEST\n   ============================================================ */\n${fns}\n</script>\n</html>\n`;
fs.writeFileSync(src, body('function aaa() {\n  return bbb();\n}\nfunction bbb() {\n  return 1;\n}'));
execFileSync(process.execPath, [GEN], { env: { ...process.env, CODE_INDEX_SRC: src, CODE_INDEX_OUT: out } });
const env = { CODE_INDEX_SRC: src, CODE_INDEX_OUT: out };
ok(run(env) === 0, '作り直した直後は通る');
fs.writeFileSync(src, body('\n\n\nfunction aaa() {\n  return bbb();\n}\nfunction bbb() {\n  return 1;\n}'));
ok(run(env) === 0, '★行がずれただけでは落とさない（普通の改修で毎回作り直しを強いない）');
fs.writeFileSync(src, body('function aaa() {\n  return bbb();\n}\nfunction bbb() {\n  return 1;\n}\nfunction ccc() {}'));
const add = run(env);
ok(add && add.code === 1 && /索引に無い：ccc/.test(add.err), '★関数を足したのに作り直していなければ落とし、名前を言う', add);
fs.writeFileSync(src, body('function aaa() {\n  return 1;\n}'));
const del = run(env);
ok(del && del.code === 1 && /本体に無い：bbb/.test(del.err), '★関数を消した・改名したのに作り直していなければ落とす', del);
fs.rmSync(tmp, { recursive: true, force: true });

if (fails.length) { console.log(`FAILED ${fails.length}件:\n${fails.join('\n')}`); console.log('CODEINDEX SMOKE FAILED'); process.exit(1); }
console.log('CODEINDEX SMOKE PASSED');
