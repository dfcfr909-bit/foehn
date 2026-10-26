/* 山域の保存（#244 段2＋#229・ADR-0020）。
 *
 * ⚠⚠ 取るのは Service Worker（smoke_tilecache の 7 で見る）。ここはページ側：範囲と枚数・間隔・やめる・続き・404 の記録・削除・圏外で描けるか。
 *    SW への依頼（swMessage）を差し替え、箱（AREA_CACHE）はページの Cache Storage を本物のまま使う。
 * ⚠ 保存した URL は本体と同じ式（demFetchBlob・MAP_BASES の std）でないと、圏外で引けない。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const NM = path.join(ROOT, 'tests/node_modules');
const UPLOT_JS = fs.readFileSync(NM + '/uplot/dist/uPlot.iife.min.js', 'utf8');
const LEAFLET_JS = fs.readFileSync(NM + '/leaflet/dist/leaflet.js', 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra).slice(0, 300)}` : '')); };

const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 800 } });

/* 作り物の標高タイル（平らな斜面・地理院の符号化） */
const gen = await ctx.newPage();
await gen.setContent('<canvas id="c" width="256" height="256"></canvas>');
const PNG = Buffer.from(await gen.evaluate(() => {
  const c = document.getElementById('c'), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
  for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
    const v = Math.round((1500 + i * 0.5 + Math.sin(j / 9) * 3) * 100), k = (j * 256 + i) * 4;
    d[k] = (v >> 16) & 255; d[k + 1] = (v >> 8) & 255; d[k + 2] = v & 255; d[k + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL('image/png').split(',')[1];
}), 'base64');

const page = await ctx.newPage();
const errors = [], dialogs = [];
page.on('pageerror', e => errors.push(e.message));
page.on('dialog', d => { dialogs.push(d.message()); d.accept().catch(() => {}); });
let net = { '5a': 'ok', '10b': 'ok', '1a': 'ok' };   // 'ok' | 'off'（504＝圏外）| 'none'（404）
await page.route('**/*', async route => {
  const url = route.request().url();
  if (url === 'https://sotoki.test/') return route.fulfill({ contentType: 'text/html', body: HTML });
  if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
  if (url.includes('leaflet') && url.endsWith('.js')) return route.fulfill({ contentType: 'application/javascript', body: LEAFLET_JS });
  if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
  const m = url.match(/xyz\/(dem5a_png|dem_png|dem1a_png)\//);
  if (m) {
    const mode = net[m[1] === 'dem5a_png' ? '5a' : m[1] === 'dem1a_png' ? '1a' : '10b'];
    if (mode === 'off') return route.fulfill({ status: 504, body: '' });
    if (mode === 'none') return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ contentType: 'image/png', body: PNG, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  return route.fulfill({ status: 404, body: '' });
});
await page.addInitScript(() => {
  localStorage.setItem('sotoki_last', JSON.stringify({ lat: 36.9, lon: 139.2, name: 'テスト' }));
  localStorage.setItem('sotoki_favs', JSON.stringify([{ name: '男体山', lat: 36.7655, lon: 139.4908 }, { name: '隣の山', lat: 36.77, lon: 139.50 }]));
});
await page.goto('https://sotoki.test/');
await page.waitForTimeout(800);

/* ============ 1. 範囲と枚数・URL ============ */
const plan = await page.evaluate(() => {
  const p = areaPlan(36.7655, 139.4908), byz = {};
  p.dem.forEach(t => { const k = t.src + '/' + t.z; byz[k] = (byz[k] || 0) + 1; });
  const sample = p.dem.find(t => t.src === 'gsi1a' && t.z === 17);
  const std = p.std[0];
  const hi = areaPlan(44.07, 145.12);   // 北の山域（タイルが細かい＝枚数が多い）
  const m10 = areaTiles10b(['gsi5a/15/29000/12900', 'gsi5a/13/7250/3225']);
  const z17 = p.dem.filter(t => t.z === 17), c = areaTileRange(36.7655, 139.4908, 2.5, 17);
  const cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2;
  return {
    dem: p.dem.length, std: p.std.length, byz,
    url1a: sample.url === DEM_SRC.gsi1a.url.replace('{z}', 17).replace('{x}', sample.x).replace('{y}', sample.y),
    key1a: sample.key === ciTileKey(17, sample.x, sample.y, 'gsi1a'),
    stdUrl: std.url === findBase('std').url.replace('{z}', std.z).replace('{x}', std.x).replace('{y}', std.y),
    hiDem: hi.dem.length, hiStd: hi.std.length, hiZ17: hi.dem.filter(t => t.z === 17).length,
    nearFirst: Math.hypot(z17[0].x - cx, z17[0].y - cy) <= Math.hypot(z17[z17.length - 1].x - cx, z17[z17.length - 1].y - cy),
    m10: m10.map(t => t.key), m10n: m10.length,
  };
});
ok(plan.byz['gsi5a/15'] > 100 && plan.byz['gsi1a/16'] > 400 && plan.byz['gsi1a/17'] > 400 && !plan.byz['gsi5a/16'],
  '★★5A は z13〜15（10km 四方）・1A は z16（10km）と z17（5km）', plan.byz);
ok(plan.dem <= 1100 && plan.std <= 750 && plan.std > 550, '★★上限：標高 1,100・標準地図 750（10km 四方 z12〜16）', plan);
ok(plan.url1a && plan.key1a && plan.stdUrl, '★★★保存する URL と鍵は本体が取りに行くものと同じ式', plan);
ok(plan.hiDem === 1100 && plan.hiStd <= 750 && plan.hiZ17 < 552, '★北の山域は上限で z17 の外側を削る', plan);
ok(plan.nearFirst, 'z17 は中心から近い順（削るのは外側）');
ok(plan.m10.includes('gsi10b/14/14500/6450') && plan.m10.includes('gsi10b/13/7250/3225') && plan.m10n === 18, '★5A が 404 の所は 10B（z15 は z14 の親）と周り1枚', plan.m10);

/* ============ 2. 保存の流れ（SW への依頼を差し替え） ============ */
// 小さな計画で回す：標高 20 枚（5A 6・1A 14）・標準地図 4 枚
await page.evaluate(() => {
  Object.defineProperty(navigator.serviceWorker, 'controller', { configurable: true, get: () => ({}) });
  const real = areaPlan;
  window.areaPlan = (lat, lon, miss = []) => {
    const p = real(lat, lon, miss);
    return { dem: [...p.dem.filter(t => t.src === 'gsi5a').slice(0, 6), ...p.dem.filter(t => t.src === 'gsi10b'), ...p.dem.filter(t => t.src === 'gsi1a').slice(0, 14)], std: p.std.slice(0, 4) };
  };
  window.__sw = { calls: [], mode: 'ok', status404: new Set() };
  window.swMessage = async (msg) => {
    const s = window.__sw;
    if (msg.type === 'area-fetch') {
      s.calls.push({ t: Date.now(), n: msg.urls.length, urls: msg.urls });
      if (s.mode === 'null') return null;
      const cache = await caches.open(AREA_CACHE_NAME), out = [];
      for (const u of msg.urls) {
        if (s.mode === 'fail') { out.push({ url: u, status: 0, size: 0 }); continue; }
        if (s.status404.has(u)) { out.push({ url: u, status: 404, size: 0 }); continue; }
        await cache.put(u, new Response('x'.repeat(100)));
        out.push({ url: u, status: 200, size: 100 });
      }
      return out;
    }
    if (msg.type === 'area-delete') {
      const cache = await caches.open(AREA_CACHE_NAME); let n = 0;
      for (const u of msg.urls) if (await cache.delete(u)) n++;
      return { deleted: n };
    }
    return null;
  };
  openMap();
});
await page.waitForTimeout(500);
// 5A の 2 枚と 1A の 1 枚は 404
const p0 = await page.evaluate(() => {
  const p = areaPlan(36.7655, 139.4908), a5 = p.dem.filter(t => t.src === 'gsi5a'), a1 = p.dem.filter(t => t.src === 'gsi1a');
  [a5[0], a5[1], a1[0]].forEach(t => window.__sw.status404.add(t.url));
  return { a5: [a5[0].key, a5[1].key], a1: a1[0].key, total: p.dem.length + p.std.length };
});
const t0 = Date.now();
await page.evaluate(() => saveArea(loadFavs()[0]));
const run1 = await page.evaluate(() => ({ calls: window.__sw.calls.map(c => ({ t: c.t, n: c.n })), area: loadSavedAreas()[0], text: areaJob.text,
  m1: JSON.parse(localStorage.getItem('demMiss1a') || '{}'), m5: JSON.parse(localStorage.getItem('demMiss5a') || '{}') }));
const gaps = run1.calls.slice(1).map((c, i) => c.t - run1.calls[i].t);
ok(run1.calls.every(c => c.n <= 8) && gaps.every(g => g >= 1900), '★★★毎秒 4 枚まで（8 枚ずつ・2 秒あける）', { gaps, n: run1.calls.map(c => c.n) });
ok(run1.area && run1.area.complete && run1.area.done > 0 && run1.area.miss.length >= 3, '★★最後まで取れたら complete・404 は miss に', run1.area);
ok(p0.a5.every(k => run1.area.miss.includes(k)) && run1.area.miss.includes(p0.a1), '404 の鍵を山域に記録する', run1.area.miss);
ok(run1.m1[p0.a1] && p0.a5.every(k => run1.m5[k]), '★404 は端末の記録（demMiss1a・demMiss5a）にも入れる', { m1: Object.keys(run1.m1), m5: Object.keys(run1.m5) });
ok(run1.area.miss.length > 0 && run1.calls.some(c => true), '前提: 保存を回した');
const reqs10b = await page.evaluate(() => window.__sw.calls.flatMap(c => c.urls).filter(u => u.includes('/dem_png/')).length);
ok(reqs10b > 0, '★★5A が 404 の所は 10B も取る', reqs10b);
const hasMiss = await page.evaluate(k => { localStorage.removeItem('demMiss5a'); return areaMissHas([k]); }, p0.a5[0]);
ok(hasMiss, '★★★端末の記録（30 日）が消えても、保存した山域の 404 は残る（areaMissHas）');

// 続き：箱にあるものは取らない（2 回目は何も頼まない）
await page.evaluate(() => { window.__sw.calls = []; const l = loadSavedAreas(); l[0].complete = false; storeSavedAreas(l); });
await page.evaluate(() => saveArea(loadFavs()[0]));
const again = await page.evaluate(() => window.__sw.calls.length);
ok(again === 0, '★★続きは「箱に無く 404 でもない」ものだけ取る（全部あれば頼まない）', again);

// やめる：そこまでは残る・途中の印
await page.evaluate(async () => { await caches.delete(AREA_CACHE_NAME); storeSavedAreas([]); window.__sw.calls = []; });
await page.evaluate(() => { const p = saveArea(loadFavs()[0]); setTimeout(() => { areaJob.cancel = true; }, 2500); return p; });
const cancelled = await page.evaluate(() => ({ calls: window.__sw.calls.length, area: loadSavedAreas()[0], text: areaJob.text }));
ok(cancelled.calls >= 1 && cancelled.calls < 4 && cancelled.area && !cancelled.area.complete && cancelled.area.done > 0 && /やめました/.test(cancelled.text),
  '★★やめるとそこで止まり、取れた分は残る（途中の印）', cancelled);

// 通信できない・SW が応答しない：止めて理由を出す
await page.evaluate(() => { window.__sw.mode = 'fail'; });
await page.evaluate(() => saveArea(loadFavs()[0]));
ok(/通信できません/.test(await page.evaluate(() => areaJob.text)), '★全部失敗なら「通信できません」で止める');
await page.evaluate(() => { window.__sw.mode = 'null'; });
await page.evaluate(() => saveArea(loadFavs()[0]));
ok(/応答がありません/.test(await page.evaluate(() => areaJob.text)), '★SW が応答しない（待ち時間切れ）は止めたことにせず「続きから」と出す');
await page.evaluate(() => { window.__sw.mode = 'ok'; });

// SW が無い（初回・強制再読み込み）：保存できないと出す
const noSw = await page.evaluate(() => {
  Object.defineProperty(navigator.serviceWorker, 'controller', { configurable: true, get: () => null });
  window.__sw.calls = []; saveArea(loadFavs()[0]);
  const n = window.__sw.calls.length;
  Object.defineProperty(navigator.serviceWorker, 'controller', { configurable: true, get: () => ({}) });
  return n;
});
ok(noSw === 0 && dialogs.some(d => /保存できません/.test(d)), '★SW が無いときは保存できないと出す', dialogs.slice(-2));

/* ============ 3. 削除：重なるタイルは残す ============ */
await page.evaluate(async () => { await caches.delete(AREA_CACHE_NAME); storeSavedAreas([]); window.__sw.calls = []; window.__sw.status404 = new Set(); });
await page.evaluate(async () => { await saveArea(loadFavs()[0]); await saveArea(loadFavs()[1]); });
const del = await page.evaluate(async () => {
  const a = areaPlan(36.7655, 139.4908), b = areaPlan(36.77, 139.50);
  const ua = [...a.dem, ...a.std].map(t => t.url), ub = new Set([...b.dem, ...b.std].map(t => t.url));
  const shared = ua.filter(u => ub.has(u)), only = ua.filter(u => !ub.has(u));
  await deleteArea(loadSavedAreas().find(x => x.name === '男体山').id);
  const cache = await caches.open(AREA_CACHE_NAME);
  return { shared: shared.length, sharedKept: (await Promise.all(shared.map(u => cache.match(u)))).every(Boolean),
    onlyGone: (await Promise.all(only.map(u => cache.match(u)))).every(r => !r), left: loadSavedAreas().map(x => x.name) };
});
ok(del.shared > 0 && del.sharedKept && del.onlyGone && del.left.length === 1 && del.left[0] === '隣の山', '★★★削除は重なるタイルを残し、自分だけのものを消す', del);

/* ============ 4. 圏外：保存した山域で 5A が 404 だった所は 10B で描ける（記録が切れても） ============ */
net = { '5a': 'off', '10b': 'ok', '1a': 'off' };
const off = await page.evaluate(async () => {
  const n = 2 ** 14, lat = 36.6, lon = 139.0;
  const x = Math.floor((lon + 180) / 360 * n), r = lat * Math.PI / 180, y = Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n);
  ciBlobCache.clear(); csParentCache.clear(); localStorage.removeItem('demMiss5a');
  const miss = [];
  for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) miss.push(ciTileKey(14, x + ox, y + oy, 'gsi5a'));
  const run = async () => { try { const p = await csRenderTile({ z: 14, x, y }, { id: ++ciSeq, cancelled: false }); return p ? 'pix' : String(p); } catch (e) { return 'err'; } };
  const before = await run();
  storeSavedAreas([...loadSavedAreas(), { id: 'off', name: '圏外の山', lat, lon, at: Date.now(), done: 9, bytes: 0, miss, complete: true }]);
  ciBlobCache.clear();
  return { before, after: await run() };
});
ok(off.before === 'err' && off.after === 'pix', '★★★圏外で 5A が通らなくても、保存した山域で 404 だった所は 10B で描く（端末の記録が切れていても）', off);

/* ============ 5. 画面 ============ */
net = { '5a': 'ok', '10b': 'ok', '1a': 'ok' };
const ui = await page.evaluate(() => {
  renderAreaPanel();
  const box = document.getElementById('layer-areas');
  return { rows: box.querySelectorAll('.area-row').length, text: box.textContent, note: document.getElementById('layer-areas-note').textContent,
    clearMsg: clearTileCache.toString().includes('保存した山域は消えません') };
});
ok(/隣の山/.test(ui.text) && /削除/.test(ui.text) && /この山域を保存|続きを保存/.test(ui.text), '★保存した山域（削除）とお気に入り（保存）が並ぶ', ui.text);
ok(/z16 まで/.test(ui.note), '圏外の下地は z16 までと書く', ui.note);
ok(ui.clearMsg, '★見た範囲の削除の確認に「保存した山域は消えません」と書く');

ok(errors.length === 0, 'ページで例外が出ない', errors);
await browser.close();
if (fails.length) { console.log('FAIL\n  - ' + fails.join('\n  - ')); process.exit(1); }
console.log('OK');
