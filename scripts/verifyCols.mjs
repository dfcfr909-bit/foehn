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
/* 深さの閾値の検証（v4.131.0〜・既定）：コル・対照（地点表）と、百名山ほか110峰の山頂（areas.json・地理院で検証済みの座標）を
   **同じ測り方**で回し、深さ T ごとに「コルが拾えるか」「山頂（コルではない）に◎が出てしまうか」を比べる。
   測り方：点から 150m／300m 以内でいちばん深い鞍部の深さ（端の鞍部は除く）と、画面内の◎の数（深さ T 以上）。
   ⚠ 山頂のすぐ脇に本物のコルがある峰（双耳峰など）は山頂でも深い鞍部が出る。表で名前を見て除く。
   旧来の表（アプリの「検証8地点」と同じ関数）は --table で出す */
const SITES = path.join(ROOT, 'scripts', 'verifyCols.sites.json');
const siteList = fs.existsSync(SITES) ? JSON.parse(fs.readFileSync(SITES, 'utf8')).sites : [];
if (process.argv.includes('--table')) {
  const sites = siteList.map(s => ({ name: (s.kind === 'control' ? '〔対照〕' : '') + s.name, lat: s.lat, lon: s.lon }));
  await page.evaluate(list => { TERRAIN_VERIFY_COLS.splice(0, TERRAIN_VERIFY_COLS.length, ...list); }, sites);
  console.log(`地点表：${sites.length}地点（scripts/verifyCols.sites.json）`);
  const table = await page.evaluate(() => terrainVerifyCols());
  console.log(table);
  summary(`## 鞍部の検証\n\n${mdTable(table.split('\n').filter(l => l.includes('\t')))}\n\n${table.split('\n').filter(l => !l.includes('\t')).join('\n')}\n`);
} else {
  const areas = JSON.parse(fs.readFileSync(path.join(ROOT, 'areas.json'), 'utf8')).areas;
  const summits = areas.flatMap(a => a.peaks.map(p => ({ name: `${p.name}（${a.name}）`, lat: p.lat, lon: p.lon, elev: p.elev, kind: 'summit' })));
  const all = [...siteList, ...summits];
  console.log(`深さの閾値の検証：コル${siteList.filter(s => s.kind === 'col').length}・対照${siteList.filter(s => s.kind === 'control').length}・山頂${summits.length}`);
  await page.evaluate(() => { if (!isOverlayOn('windFlowGL')) toggleOverlay('windFlowGL'); if (!terrainAn.on) terrainToggle(); });
  const rows = [];
  for (const [i, site] of all.entries()) {
    const r = await page.evaluate(async site => {
      leafletMap.setView([site.lat, site.lon], VERIFY_ZOOM, { animate: false });
      await terrainWaitReady(20000);
      terrainRefresh();
      const res = terrainAn.result;
      if (!res) return null;
      const p = { lat: site.lat, lon: site.lon }, G = res.grid, gi = terrainGridIndex(G, site.lat, site.lon);
      const cols = res.cols.cols.filter(c => !c.edge).map(c => ({ c, d: geoDist(p, c) }));
      const deepest = R => cols.filter(x => x.d <= R).sort((a, b) => b.c.prom - a.c.prom)[0];
      const near = cols.slice().sort((a, b) => a.d - b.d)[0];
      const TS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
      const d150 = deepest(150), d300 = deepest(300);
      return { dem: gi == null ? null : G.h[gi], loading: !!res.loading, cell: G.cell, n: cols.length,
        near: near ? { d: near.d, prom: near.c.prom } : null,
        d150: d150 ? { d: d150.d, prom: d150.c.prom } : null, d300: d300 ? { d: d300.d, prom: d300.c.prom } : null,
        count: Object.fromEntries(TS.map(t => [t, cols.filter(x => x.c.prom >= t).length])) };
    }, site);
    rows.push({ ...site, r });
    process.stdout.write(`\r${i + 1}/${all.length} ${site.name}                    `);
  }
  console.log('');
  const f0 = x => (x == null || x !== x) ? '' : String(Math.round(x));
  const head = ['種別', '地点', 'DEM標高m', '標高m(表)', '最寄りの鞍部 距離m', '最寄り 深さm', '150m内の最深 深さm', '300m内の最深 深さm', '300m内の最深 距離m', '画面の◎（≧20m）', '備考'];
  const KIND = { col: 'コル', control: '対照', summit: '山頂' };
  const lines = [head.join('\t'), ...rows.map(({ kind, name, elev, r }) => [KIND[kind], name, f0(r && r.dem), f0(elev),
    f0(r && r.near && r.near.d), f0(r && r.near && r.near.prom), f0(r && r.d150 && r.d150.prom), f0(r && r.d300 && r.d300.prom), f0(r && r.d300 && r.d300.d),
    r ? String(r.count[20]) : '', !r ? '解析できず' : r.loading ? '読込中あり' : ''].join('\t'))];
  // 深さ T ごとの集計：コルは300m以内に深さ T 以上の鞍部があるか（拾える割合）、山頂は150m／300m以内にあるか（誤って出る割合）
  const TS = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
  const pct = (list, f) => list.length ? `${Math.round(100 * list.filter(f).length / list.length)}%（${list.filter(f).length}/${list.length}）` : '';
  const ok = k => rows.filter(x => x.kind === k && x.r);
  const cols = ok('col'), ctrl = ok('control'), sums = ok('summit');
  const agg = [['深さ T m', 'コル：300m内に T 以上（拾える）', '対照：300m内に T 以上（誤り）', '山頂：150m内に T 以上（誤り）', '山頂：300m内に T 以上（誤り）', '山頂の画面の◎の数（平均）'].join('\t'),
    ...TS.map(t => [t, pct(cols, x => x.r.d300 && x.r.d300.prom >= t), pct(ctrl, x => x.r.d300 && x.r.d300.prom >= t),
      pct(sums, x => x.r.d150 && x.r.d150.prom >= t), pct(sums, x => x.r.d300 && x.r.d300.prom >= t),
      sums.length ? (sums.reduce((a, x) => a + x.r.count[t], 0) / sums.length).toFixed(1) : ''].join('\t'))];
  console.log(lines.join('\n'));
  console.log('\n' + agg.join('\n'));
  const sel = await page.evaluate(() => (document.getElementById('app-version') || {}).textContent || '');
  summary(`## 深さの閾値の検証（${sel}・ズーム15・端の鞍部は除く）\n\n### 深さ T ごと\n\n${mdTable(agg)}\n\n### 地点ごと\n\n${mdTable(lines)}\n`);
}
if (errors.length) console.log('ページ内の例外:', errors.join(' / '));
function mdTable(rows) {
  const md = rows.map(l => '| ' + l.split('\t').join(' | ') + ' |');
  md.splice(1, 0, '|' + ' --- |'.repeat(rows[0].split('\t').length));
  return md.join('\n');
}
function summary(text) { if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text); }
await browser.close();
server.close();
