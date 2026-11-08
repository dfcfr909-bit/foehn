// PWA（デスクトップ／ホーム画面へのインストール）の検証
//   ・HTMLからmanifestとアイコンが正しく参照されていること
//   ・manifestがインストール要件を満たすこと（name/start_url/display/192と512のicons/maskable）
//   ・manifestとHTMLが指すファイルが実在し、PNGとして妥当なサイズであること
//   ・Service Workerが登録され、fetchハンドラを持つこと（インストール要件）
//   ・HTMLはネットワーク優先＝更新が古いまま残らないこと
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'sotoki_v4.html'), 'utf8');
const INDEX = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SW = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const MANIFEST = fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8');

// sw.js のナビゲーション処理（HTMLを返す分岐）だけを切り出す。
// 静的ファイル側・タイル側にも cache.put があるので、ファイル全体で調べると
// 「どこかに res.ok がある」だけで通ってしまい、検査にならない。
function navBlock(src) {
  const from = src.indexOf("req.mode === 'navigate'");
  if (from < 0) return null;
  const to = src.indexOf('e.respondWith', src.indexOf('e.respondWith', from) + 1);
  return src.slice(from, to > from ? to : undefined);
}

// PNGのIHDRから幅・高さを読む（画像ライブラリなしでサイズを確認する）
function pngSize(file) {
  const b = fs.readFileSync(file);
  const isPng = b.length > 24 && b.readUInt32BE(0) === 0x89504e47;
  if (!isPng) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), bytes: b.length };
}

(async () => {
  const errors = [];
  const manifest = JSON.parse(MANIFEST);

  // --- manifestの中身（インストール要件） ---
  const icons = manifest.icons || [];
  const hasAny192 = icons.some(i => i.sizes === '192x192');
  const hasAny512 = icons.some(i => i.sizes === '512x512' && (i.purpose || 'any').includes('any'));
  const hasMaskable = icons.some(i => (i.purpose || '').includes('maskable'));

  // --- manifestが指すアイコンが実在し、宣言どおりの寸法か ---
  const iconChecks = icons.map(i => {
    const f = path.join(ROOT, i.src);
    const s = fs.existsSync(f) ? pngSize(f) : null;
    const [w, h] = i.sizes.split('x').map(Number);
    return { src: i.src, ok: !!s && s.w === w && s.h === h, actual: s };
  });

  // --- HTMLからの参照 ---
  const refs = {
    manifestInApp: /<link[^>]+rel="manifest"[^>]+href="manifest\.webmanifest"/.test(HTML),
    manifestInIndex: /<link[^>]+rel="manifest"[^>]+href="manifest\.webmanifest"/.test(INDEX),
    themeColor: /<meta[^>]+name="theme-color"/.test(HTML),
    appleIcon: /<link[^>]+rel="apple-touch-icon"[^>]+href="icons\/apple-touch-icon\.png"/.test(HTML),
    favicon: /<link[^>]+rel="icon"[^>]+href="icons\/favicon-32\.png"/.test(HTML),
    appleCapable: /<meta[^>]+name="apple-mobile-web-app-capable"[^>]+content="yes"/.test(HTML),
    registersSw: /navigator\.serviceWorker\.register\('sw\.js'\)/.test(HTML),
  };
  const htmlIconFiles = ['icons/apple-touch-icon.png', 'icons/favicon-32.png', 'icons/favicon-16.png']
    .map(f => ({ f, size: fs.existsSync(path.join(ROOT, f)) ? pngSize(path.join(ROOT, f)) : null }));

  // --- Service Workerの中身 ---
  const swChecks = {
    hasFetchHandler: /addEventListener\('fetch'/.test(SW),
    hasInstall: /addEventListener\('install'/.test(SW),
    hasActivate: /addEventListener\('activate'/.test(SW),
    // HTMLはネットワーク優先（古い画面が残らないこと）
    htmlNetworkFirst: /req\.mode === 'navigate'/.test(SW) && /const fresh = await fetch\(req\)/.test(SW),
    // ⚠ エラー応答を焼き付けないこと。404や500をHTMLキャッシュに入れると
    //   以後は圏外でもそれが返り、「圏外でも立ち上がる」目的が壊れる
    htmlSkipsErrorResponses: (() => {
      const block = navBlock(SW);
      if (!block) return false;
      const guard = block.search(/\bfresh\.ok\b/);
      const put = block.search(/cache\.put\(/);
      return guard >= 0 && put >= 0 && guard < put;   // ok を見てから put していること
    })(),
    // 気象APIなど外部はキャッシュしない
    skipsCrossOrigin: /if \(!isAppAsset\(url\)/.test(SW),
    // 古いキャッシュを消す
    cleansOldCaches: /caches\.delete/.test(SW),
  };

  // --- 起動を止める外部読み込みが無いこと（圏外・弱電波で開かない・地図が作れない → ADR-0017・#227） ---
  //   ⚠ 対象は本体（sotoki_v4.html）だけ。experiments/ は CDN のまま
  const NM_LEAFLET = path.join(__dirname, 'node_modules/leaflet/dist');
  const sameFile = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));
  const offlineBoot = {
    // 外部オリジンの <script src> が無い（同期読み込みで止まる）
    noExternalScript: !/<script[^>]+src="(https?:)?\/\//i.test(HTML),
    // 外部の stylesheet は media="print"（読めたら切り替える）のものだけ
    externalCssNonBlocking: [...HTML.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)]
      .filter(m => /href="(https?:)?\/\//i.test(m[0])).every(m => /media="print"/.test(m[0])),
    // <style> の中の @import で外部を読まない（描画を止める）
    noExternalImport: !/@import\s+url\(['"]?(https?:)?\/\//i.test(HTML),
    // Leaflet は vendor/ から読み、PRECACHE に入っている
    leafletVendored: /<script src="vendor\/leaflet\/leaflet\.js"><\/script>/.test(HTML) &&
      /<link rel="stylesheet" href="vendor\/leaflet\/leaflet\.css">/.test(HTML),
    leafletPrecached: ['leaflet.js', 'leaflet.css', 'images/marker-icon.png', 'images/marker-icon-2x.png',
      'images/marker-shadow.png'].every(f => SW.includes(`'./vendor/leaflet/${f}'`)),
    // 同梱物はテストで使う npm の leaflet@1.9.4 と同じ中身（テストは node_modules 側を読むので、ずれると気づけない）
    leafletSameAsTests: ['leaflet.js', 'leaflet.css', 'images/marker-icon.png', 'images/marker-icon-2x.png',
      'images/marker-shadow.png', 'images/layers.png', 'images/layers-2x.png']
      .every(f => sameFile(path.join(ROOT, 'vendor/leaflet', f), path.join(NM_LEAFLET, f))),
  };

  // --- 実ブラウザで manifest が読めるか ---
  // index.html は即 sotoki_v4.html へリダイレクトするので、本体を直接開いて確認する
  const UPLOT_JS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.iife.min.js', 'utf8');
  const UPLOT_CSS = fs.readFileSync(__dirname + '/node_modules/uplot/dist/uPlot.min.css', 'utf8');
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
  page.on('pageerror', e => errors.push(e.message));
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url === 'https://sotoki.test/sotoki_v4.html') {
      return route.fulfill({ contentType: 'text/html', body: HTML });
    }
    if (url.endsWith('/manifest.webmanifest')) {
      return route.fulfill({ contentType: 'application/manifest+json', body: MANIFEST });
    }
    if (url.endsWith('/sw.js')) return route.fulfill({ contentType: 'application/javascript', body: SW });
    if (url.includes('uPlot.iife.min.js')) return route.fulfill({ contentType: 'application/javascript', body: UPLOT_JS });
    if (url.includes('uPlot.min.css')) return route.fulfill({ contentType: 'text/css', body: UPLOT_CSS });
    if (url.includes('api.open-meteo.com')) return route.fulfill({ contentType: 'application/json', body: '{}' });
    return route.abort();
  });
  await page.goto('https://sotoki.test/sotoki_v4.html');
  await page.waitForTimeout(500);
  const linked = await page.evaluate(async () => {
    const el = document.querySelector('link[rel="manifest"]');
    if (!el) return null;
    const res = await fetch(el.href);
    const m = await res.json();
    return { name: m.name, short_name: m.short_name, display: m.display, start_url: m.start_url, scope: m.scope };
  });
  await browser.close();

  const out = { manifest: { hasAny192, hasAny512, hasMaskable, display: manifest.display,
                            start_url: manifest.start_url, scope: manifest.scope,
                            name: manifest.name, short_name: manifest.short_name, orientation: manifest.orientation },
                iconChecks, htmlIconFiles, refs, swChecks, offlineBoot, linked, errors };
  console.log(JSON.stringify(out, null, 2));

  const ok = errors.length === 0 &&
    // manifestのインストール要件
    !!manifest.name && !!manifest.short_name && manifest.short_name.length <= 12 &&
    manifest.display === 'standalone' && manifest.start_url === './' && manifest.scope === './' &&
    // 横向きを許す（#184・v4.161.0）。portrait に戻すとホーム画面の PWA が縦に固定される
    manifest.orientation === 'any' &&
    hasAny192 && hasAny512 && hasMaskable &&
    // アイコンが実在し宣言どおりの寸法
    iconChecks.every(c => c.ok) &&
    htmlIconFiles.every(x => x.size && x.size.bytes > 100) &&
    htmlIconFiles.find(x => x.f.includes('apple')).size.w === 180 &&
    // HTMLからの参照
    refs.manifestInApp && refs.manifestInIndex && refs.themeColor &&
    refs.appleIcon && refs.favicon && refs.appleCapable && refs.registersSw &&
    // Service Workerの要件と更新方針
    swChecks.hasFetchHandler && swChecks.hasInstall && swChecks.hasActivate &&
    swChecks.htmlNetworkFirst && swChecks.htmlSkipsErrorResponses &&
    swChecks.skipsCrossOrigin && swChecks.cleansOldCaches &&
    // 起動を止める外部読み込みが無い・Leaflet を同梱
    Object.values(offlineBoot).every(Boolean) &&
    // ブラウザからmanifestが読める
    linked && linked.display === 'standalone' && linked.short_name === 'NAGI NAV';

  console.log(ok ? 'PWA SMOKE PASSED' : 'PWA SMOKE FAILED');
  process.exit(ok ? 0 : 1);
})();
