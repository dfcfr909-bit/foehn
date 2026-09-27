/* 鞍部の検証（実験）：アプリの「検証8地点」（terrainVerifyCols）を、本物の地理院 DEM と Open-Meteo で回して表を出す。
 *
 * なぜ要るか:
 *   開発環境からは国土地理院にも Open-Meteo にも到達できず、手元では走らせられない
 *   （scripts/checkPeaks.mjs と同じ制約）。Actions なら外に出られる。
 *   実機（iPhone）の「検証8地点」と**同じ関数**を呼ぶので、結果は実機と同じ計算になる
 *   （違うのは時刻＝モデル風と、WebGL が GPU を真似る SwiftShader であること）。
 *
 * 使い方: node scripts/verifyCols.mjs   （Chromium の場所は PW_CHROMIUM。無ければ開発環境の同梱パス）
 * 出力: 標準出力にタブ区切りの表。GITHUB_STEP_SUMMARY があればそこへ Markdown の表も書く。
 * ⚠ 何もコミットしない。風の補正もしない（地形の抽出の検証だけ）。
 */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'tests', 'package.json'));
const { chromium } = require('playwright-core');

const TYPES = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.addInitScript(() => localStorage.setItem('sotoki_last', JSON.stringify({ lat: 37.13074, lon: 139.96218, name: '検証' })));
await page.goto(`${base}/sotoki_v4.html`);
await page.waitForFunction(() => typeof state !== 'undefined' && state.allData && state.allData.length > 0, null, { timeout: 90000 });
await page.evaluate(() => openMap());
await page.waitForTimeout(1500);
const gl = await page.evaluate(() => { toggleOverlay('windFlowGL'); return new Promise(r => setTimeout(() => r({ ok: windGL.ok, reason: windGL.reason }), 3000)); });
console.log('WebGL:', JSON.stringify(gl));
/* 地点表（scripts/verifyCols.sites.json）があれば、アプリの8地点の代わりにそれを回す。
   ⚠ アプリ本体は変えない（TERRAIN_VERIFY_COLS は const の配列なので中身だけ入れ替える）。対照（kind=control）は名前に〔対照〕 */
const SITES = path.join(ROOT, 'scripts', 'verifyCols.sites.json');
if (fs.existsSync(SITES)) {
  const sites = JSON.parse(fs.readFileSync(SITES, 'utf8')).sites
    .map(s => ({ name: (s.kind === 'control' ? '〔対照〕' : '') + s.name, lat: s.lat, lon: s.lon }));
  await page.evaluate(list => { TERRAIN_VERIFY_COLS.splice(0, TERRAIN_VERIFY_COLS.length, ...list); }, sites);
  console.log(`地点表：${sites.length}地点（scripts/verifyCols.sites.json）`);
}
const table = await page.evaluate(() => terrainVerifyCols());
console.log(table);
if (errors.length) console.log('ページ内の例外:', errors.join(' / '));
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = table.split('\n');
  const md = rows.filter(l => l.includes('\t')).map(l => '| ' + l.split('\t').join(' | ') + ' |');
  md.splice(1, 0, '|' + ' --- |'.repeat(rows[0].split('\t').length));
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## 鞍部の検証\n\n${md.join('\n')}\n\n${rows.filter(l => !l.includes('\t')).join('\n')}\n`);
}
await browser.close();
server.close();
