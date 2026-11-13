// Service Worker の入口（./ と index.html）の扱いを検証する（v4.187.0・#227）。
//   ホーム画面の PWA は start_url（./）から入り、index.html が sotoki_v4.html へ移すだけ。
//   ここをネットワーク優先で待つと、起動のたびに HTML の取得が2本直列になる。
//   ・入口は控えを即返す（通信を待たない）。裏で取り直して控えを更新する
//   ・⚠⚠ 本体（sotoki_v4.html）はネットワーク優先のまま（古い画面を出さない・利用者の決定）
//   ・⚠ エラー応答（404・500）を控えに焼き付けない
//   ・控えが無い初回は通信で取る。圏外なら本体の控えへ
//   ・サブパス配信（/foehn/）でも入口を見分ける。入口でないもの（about.html など）は巻き込まない
//
// sw.js を vm で読み込み、caches / fetch を差し替えて実際に動かす（smoke_tilecache と同じやり方）。
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const SW_SRC = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
const tick = () => new Promise(r => setImmediate(r));
const settle = async (n = 30) => { for (let i = 0; i < n; i++) await tick(); };

const ORIGIN = 'https://sotoki.test';
function makeCaches(base) {
  const store = new Map();
  // 相対の鍵（'./index.html'）は SW の置き場から解く（本物の Cache と同じ）。?以降は ignoreSearch のときだけ落とす
  const key = (k, opt) => {
    const u = new URL(typeof k === 'string' ? k : k.url, ORIGIN + base);
    if (opt && opt.ignoreSearch) u.search = '';
    return u.href;
  };
  const api = {
    _store: store,
    open: async name => {
      if (!store.has(name)) store.set(name, new Map());
      const m = store.get(name);
      return {
        match: async (k, opt) => m.get(key(k, opt)) || undefined,
        put: async (k, v) => { m.set(key(k), v); },
        delete: async k => m.delete(key(k)),
        add: async () => {},
      };
    },
    match: async k => { for (const m of store.values()) { const hit = m.get(key(k)); if (hit) return hit; } return undefined; },
    keys: async () => [...store.keys()],
    delete: async name => store.delete(name),
  };
  return api;
}
const makeResponse = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, type: 'basic', body,
  clone() { return makeResponse(body, status); }, async blob() { return { size: 10 }; } });

function loadSw({ base = '/', fetchImpl, noHref = false }) {
  const handlers = {};
  const caches = makeCaches(base);
  const self = {
    addEventListener: (type, fn) => { handlers[type] = fn; },
    location: noHref ? { origin: ORIGIN } : { origin: ORIGIN, href: `${ORIGIN}${base}sw.js` },
    skipWaiting: async () => {}, clients: { claim: async () => {} },
  };
  const ctx = { self, caches, indexedDB: { open: () => ({}) }, fetch: fetchImpl, URL,
    Response: class { constructor(body, init) { Object.assign(this, init || {}); this.body = body; this.ok = false; } },
    setTimeout, clearTimeout, setImmediate, Promise, console };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(SW_SRC, ctx);
  return { handlers, caches, get: name => vm.runInContext(name, ctx) };
}
// fetch イベントを1回流す。respondWith の結果と、裏の仕事（waitUntil）を返す
function fire(sw, url, { navigate = true } = {}) {
  let responded; const waited = [];
  const req = { method: 'GET', url, mode: navigate ? 'navigate' : 'no-cors', headers: { get: () => (navigate ? 'text/html' : '') } };
  sw.handlers.fetch({ request: req, respondWith: p => { responded = p; }, waitUntil: p => { waited.push(p); } });
  return { responded, waited, intercepted: responded !== undefined };
}
const SHELL = 'sotoki-v2';

(async () => {
  /* ---------- 1. 控えがある入口：通信を待たずに返す。裏で取り直す ---------- */
  for (const base of ['/', '/foehn/']) {
    for (const entry of ['', 'index.html', '?source=pwa']) {
      let release, hits = 0;
      const gate = new Promise(r => { release = r; });
      const sw = loadSw({ base, fetchImpl: async () => { hits++; await gate; return makeResponse('新しい入口'); } });
      const cache = await sw.caches.open(sw.get('CACHE_NAME'));
      await cache.put('./index.html', makeResponse('控えの入口'));
      const url = `${ORIGIN}${base}${entry}`;
      const f = fire(sw, url);
      const res = await Promise.race([f.responded, new Promise(r => setTimeout(() => r('待たされた'), 300))]);
      ok(res && res.body === '控えの入口', `★★入口（${base}${entry}）は控えを即返す（通信を待たない）`, res && res.body);
      ok(hits === 1 && f.waited.length === 1, `入口（${base}${entry}）は裏で取り直す`, { hits, waited: f.waited.length });
      release();
      await Promise.allSettled(f.waited); await settle();
      // 取り直したものは、開いた URL の鍵で控える（?付きはそのまま）。次の起動は新しい方が返る
      if (entry !== '?source=pwa') {
        const again = await fire(loadSwWith(sw), url).responded;
        ok(again && again.body === '新しい入口', `★入口（${base}${entry}）は次の起動で新しい方を返す`, again && again.body);
      }
    }
  }
  // 同じ SW（同じ控え）で、通信が落ちている状態を作る
  function loadSwWith(sw) { sw.ctxFetch = null; return { handlers: sw.handlers, caches: sw.caches, get: sw.get }; }

  /* ---------- 2. エラー応答を控えに焼き付けない ---------- */
  {
    const sw = loadSw({ fetchImpl: async () => makeResponse('Not Found', 404) });
    const cache = await sw.caches.open(SHELL);
    await cache.put('./index.html', makeResponse('控えの入口'));
    const f = fire(sw, `${ORIGIN}/`);
    await f.responded; await Promise.allSettled(f.waited); await settle();
    const kept = await cache.match(`${ORIGIN}/`) || await cache.match('./index.html');
    ok(kept && kept.body === '控えの入口', '★★404 を控えに焼き付けない', kept && kept.body);
  }

  /* ---------- 2b. リダイレクトを経た応答は使わない・控えない（ナビゲーションに返すと起動できなくなる） ---------- */
  {
    const redir = body => Object.assign(makeResponse(body), { redirected: true, clone() { return redir(body); } });
    const sw = loadSw({ fetchImpl: async () => redir('リダイレクト後の入口') });
    const cache = await sw.caches.open(SHELL);
    await cache.put(`${ORIGIN}/`, redir('リダイレクトの控え'));
    await cache.put('./index.html', makeResponse('控えの入口'));
    const f = fire(sw, `${ORIGIN}/`);
    const res = await f.responded; await Promise.allSettled(f.waited); await settle();
    ok(res && res.body === '控えの入口', '★リダイレクトを経た控えは返さない（別の鍵の控えを使う）', res && res.body);
    ok(((await cache.match(`${ORIGIN}/`)) || {}).body === 'リダイレクトの控え', '★リダイレクトを経た応答は控えない（上書きしていない）');
  }

  /* ---------- 3. 控えが無い初回：通信で取り、控える。圏外なら本体の控え → 503 ---------- */
  {
    const sw = loadSw({ fetchImpl: async () => makeResponse('通信の入口') });
    const f = fire(sw, `${ORIGIN}/`);
    const res = await f.responded; await settle();
    ok(res && res.body === '通信の入口', '控えが無ければ通信で取る', res && res.body);
    const cache = await sw.caches.open(SHELL);
    ok(((await cache.match(`${ORIGIN}/`)) || {}).body === '通信の入口', '取れたものは控える');
  }
  {
    const sw = loadSw({ fetchImpl: async () => { throw new Error('圏外'); } });
    const cache = await sw.caches.open(SHELL);
    await cache.put('./sotoki_v4.html', makeResponse('本体の控え'));
    const res = await fire(sw, `${ORIGIN}/`).responded;
    ok(res && res.body === '本体の控え', '入口の控えが無く圏外なら、本体の控えを返す', res && res.body);
    const sw2 = loadSw({ fetchImpl: async () => { throw new Error('圏外'); } });
    const res2 = await fire(sw2, `${ORIGIN}/`).responded;
    ok(res2 && res2.status === 503, '何も無ければ 503（黙って空を返さない）', res2 && res2.status);
  }

  /* ---------- 4. ⚠⚠ 本体はネットワーク優先のまま ---------- */
  for (const base of ['/', '/foehn/']) {
    for (const page of ['sotoki_v4.html', 'about.html']) {
      const sw = loadSw({ base, fetchImpl: async () => makeResponse('新しい画面') });
      const cache = await sw.caches.open(SHELL);
      await cache.put(`./${page}`, makeResponse('古い画面'));
      const res = await fire(sw, `${ORIGIN}${base}${page}`).responded;
      ok(res && res.body === '新しい画面', `★★★${base}${page} はネットワーク優先のまま（古い画面を出さない）`, res && res.body);
      const off = loadSw({ base, fetchImpl: async () => { throw new Error('圏外'); } });
      await (await off.caches.open(SHELL)).put(`./${page}`, makeResponse('古い画面'));
      const res2 = await fire(off, `${ORIGIN}${base}${page}`).responded;
      ok(res2 && res2.body === '古い画面', `${base}${page} は圏外のときだけ控え`, res2 && res2.body);
    }
  }

  /* ---------- 5. 入口の見分け ---------- */
  {
    const sw = loadSw({ base: '/foehn/', fetchImpl: async () => makeResponse('x') });
    const is = p => sw.get(`isEntry(new URL(${JSON.stringify(ORIGIN + p)}))`);
    ok(is('/foehn/') && is('/foehn/index.html') && is('/foehn/?a=1'), 'サブパス配信でも入口を見分ける', sw.get('ENTRY_PATHS'));
    ok(!is('/foehn/sotoki_v4.html') && !is('/foehn/about.html') && !is('/') && !is('/foehn/sub/') && !is('/foehn/sub/index.html'),
      '★入口でないものは巻き込まない');
    ok(!sw.get(`isEntry(new URL('https://example.com/foehn/'))`), '別のオリジンは入口にしない');
    // 置き場が読めない環境では入口を作らない＝今までどおりネットワーク優先
    const bare = loadSw({ fetchImpl: async () => makeResponse('新しい入口'), noHref: true });
    ok(bare.get('ENTRY_PATHS').length === 0, '置き場が読めなければ入口の扱いをしない', bare.get('ENTRY_PATHS'));
    await (await bare.caches.open(SHELL)).put(`${ORIGIN}/`, makeResponse('控えの入口'));
    const res = await fire(bare, `${ORIGIN}/`).responded;
    ok(res && res.body === '新しい入口', '置き場が読めなければネットワーク優先のまま', res && res.body);
  }

  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('SWENTRY SMOKE FAILED');
    process.exit(1);
  }
  console.log('SWENTRY SMOKE PASSED');
})();
