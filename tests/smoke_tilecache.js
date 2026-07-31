// Service Worker の地図タイルキャッシュを検証する（docs/map-selector-requirements.md §7）
//   ・対象は定義したタイル配信元だけで、気象APIなどには触らないこと
//   ・cache-first（ヒットしたらネットワークに行かない・裏でも取り直さない）
//   ・アプリシェルとは別キャッシュで、バージョンを上げても巻き添えで消えないこと
//   ・上限超過時に最終アクセスが古いものから消えること（LRU）
//   ・使用量の問い合わせと手動削除ができること
//
// sw.js を vm で読み込み、caches / indexedDB / fetch を差し替えて実際に動かす。
// IndexedDBは必要な操作だけの簡易実装を用意している（LRUの正しさを実際に確かめるため）。
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const SW_SRC = fs.readFileSync(path.join(__dirname, '..', 'sw.js'), 'utf8');

const fails = [];
const ok = (c, label, extra) => { if (!c) fails.push(label + (extra !== undefined ? ` … ${JSON.stringify(extra)}` : '')); };
const tick = () => new Promise(r => setImmediate(r));
const settle = async (n = 40) => { for (let i = 0; i < n; i++) await tick(); };

/* ---------------- IndexedDB の簡易実装（sw.jsが使う操作だけ） ---------------- */
function makeIndexedDB() {
  const data = { tiles: new Map(), meta: new Map() };
  const req = fn => {
    const r = {};
    setImmediate(() => {
      try { r.result = fn(); r.onsuccess && r.onsuccess(); }
      catch (e) { r.error = e; r.onerror && r.onerror(); }
    });
    return r;
  };
  function objectStore(name) {
    const map = data[name];
    return {
      get: k => req(() => map.get(k)),
      put: (v, k) => req(() => { map.set(k !== undefined ? k : v.url, v); return true; }),
      delete: k => req(() => { map.delete(k); return true; }),
      count: () => req(() => map.size),
      clear: () => req(() => { map.clear(); return true; }),
      index: () => ({
        // 最終アクセス t の昇順で回すカーソル
        openCursor: () => {
          const r = {};
          const items = [...map.values()].sort((a, b) => a.t - b.t);
          let i = 0;
          const step = () => setImmediate(() => {
            if (i >= items.length) { r.result = null; r.onsuccess && r.onsuccess(); return; }
            r.result = { value: items[i++], continue: step };
            r.onsuccess && r.onsuccess();
          });
          step();
          return r;
        },
      }),
    };
  }
  const db = {
    objectStoreNames: { contains: () => true },
    transaction: () => ({ objectStore }),
    createObjectStore: () => ({ createIndex: () => {} }),
  };
  return {
    _data: data,
    open: () => {
      const r = {};
      setImmediate(() => { r.result = db; r.onsuccess && r.onsuccess(); });
      return r;
    },
  };
}

/* ---------------- Cache Storage の簡易実装 ---------------- */
function makeCaches() {
  const store = new Map();   // cacheName -> Map(url -> response)
  const api = {
    _store: store,
    open: async name => {
      if (!store.has(name)) store.set(name, new Map());
      const m = store.get(name);
      return {
        match: async k => m.get(typeof k === 'string' ? k : k.url) || undefined,
        put: async (k, v) => { m.set(typeof k === 'string' ? k : k.url, v); },
        delete: async k => m.delete(typeof k === 'string' ? k : k.url),
        add: async () => {},
      };
    },
    match: async k => {
      for (const m of store.values()) {
        const hit = m.get(typeof k === 'string' ? k : k.url);
        if (hit) return hit;
      }
      return undefined;
    },
    keys: async () => [...store.keys()],
    delete: async name => store.delete(name),
  };
  return api;
}

function makeResponse(body, size) {
  const res = {
    ok: true, status: 200, type: 'basic', _body: body, _size: size,
    clone() { return makeResponse(body, size); },
    async blob() { return { size }; },
  };
  return res;
}

/* ---------------- sw.js を読み込んでハンドラを捕まえる ---------------- */
function loadSw({ fetchImpl }) {
  const handlers = {};
  const indexedDB = makeIndexedDB();
  const caches = makeCaches();
  const waits = [];
  const self = {
    addEventListener: (type, fn) => { handlers[type] = fn; },
    location: { origin: 'https://sotoki.test' },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };
  const ctx = {
    self, caches, indexedDB, fetch: fetchImpl, URL, Response: class {
      constructor(body, init) { Object.assign(this, init || {}); this.body = body; this.ok = false; }
    },
    setTimeout, clearTimeout, setImmediate, Promise, console,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(SW_SRC, ctx);
  // constで宣言した定数はコンテキストのプロパティにならないので、式として評価して取り出す
  const get = name => vm.runInContext(name, ctx);
  return { handlers, caches, indexedDB, self, waits, ctx, get };
}

// fetchイベントを1回流し、respondWith に渡された結果を返す
async function runFetch(sw, url, netResponse) {
  let responded, waited = [];
  const req = { method: 'GET', url, mode: 'no-cors', headers: { get: () => '' } };
  const e = {
    request: req,
    respondWith: p => { responded = p; },
    waitUntil: p => { waited.push(p); },
  };
  sw.handlers.fetch(e);
  const res = responded ? await responded : null;
  await settle();
  await Promise.allSettled(waited);
  await settle();
  return { res, intercepted: responded !== undefined };
}

async function ask(sw, type) {
  let out;
  const e = { data: { type }, ports: [{ postMessage: v => { out = v; } }], waitUntil: p => p };
  sw.handlers.message(e);
  await settle(60);
  return out;
}

(async () => {
  /* ================= 1. 対象ホストの判定 ================= */
  {
    const sw = loadSw({ fetchImpl: async () => makeResponse('x', 100) });
    const isTile = u => sw.ctx.isTileRequest(new URL(u));
    const K = sw.get;
    ok(isTile('https://cyberjapandata.gsi.go.jp/xyz/pale/14/1/1.png'), '地理院タイルは対象');
    ok(isTile('https://tile.openstreetmap.org/14/1/1.png'), 'OSMタイルは対象');
    ok(isTile('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/1/1'), 'Esriタイルは対象');
    ok(!isTile('https://api.open-meteo.com/v1/forecast?x=1'), '気象APIは対象外');
    ok(!isTile('https://nominatim.openstreetmap.org/search?q=x'), '地名検索は対象外（OSMでもホストが違う）');
    ok(!isTile('https://sotoki.test/sotoki_v4.html'), 'アプリ本体は対象外');
    ok(!isTile('https://www.jma.go.jp/bosai/amedas/data/latest_time.txt'), 'アメダスは対象外');
    ok(K('TILE_CACHE') === 'sotoki-tiles-v1', 'キャッシュ名', K('TILE_CACHE'));
    ok(K('TILE_CACHE') !== K('CACHE_NAME'), 'アプリシェルとは別のキャッシュ');
    ok(K('TILE_CACHE_LIMIT_BYTES') === 150 * 1024 * 1024, '上限150MB', K('TILE_CACHE_LIMIT_BYTES'));
  }

  /* ================= 2. cache-first ================= */
  {
    let netCalls = 0;
    const sw = loadSw({ fetchImpl: async () => { netCalls++; return makeResponse('tile', 1000); } });
    const url = 'https://cyberjapandata.gsi.go.jp/xyz/pale/14/100/200.png';

    const miss = await runFetch(sw, url);
    ok(miss.intercepted, 'タイルはSWが処理する');
    ok(netCalls === 1, '初回はネットワークへ行く', netCalls);

    const hit = await runFetch(sw, url);
    ok(netCalls === 1, 'ヒット時はネットワークに行かない（裏でも取り直さない）', netCalls);
    ok(hit.res && hit.res._body === 'tile', 'キャッシュから返る');

    // 気象APIには手を出さない（respondWithが呼ばれない＝素通し）
    const passthrough = await runFetch(sw, 'https://api.open-meteo.com/v1/forecast?a=1');
    ok(!passthrough.intercepted, '気象APIはSWが横取りしない');

    const usage = await ask(sw, 'tiles-usage');
    ok(usage && usage.count === 1 && usage.bytes === 1000, '使用量を答える', usage);
  }

  /* ================= 3. 上限超過でLRU削除 ================= */
  {
    let netCalls = 0;
    const sw = loadSw({ fetchImpl: async () => { netCalls++; return makeResponse('tile', 60 * 1024 * 1024); } });
    // 上限150MB。60MBのタイルを3枚入れると180MBで超過する
    const urls = [
      'https://cyberjapandata.gsi.go.jp/xyz/pale/14/1/1.png',
      'https://cyberjapandata.gsi.go.jp/xyz/pale/14/2/2.png',
      'https://cyberjapandata.gsi.go.jp/xyz/pale/14/3/3.png',
    ];
    for (const u of urls) { await runFetch(sw, u); await settle(20); }

    const tiles = sw.indexedDB._data.tiles;
    const cache = sw.caches._store.get('sotoki-tiles-v1');
    const usage = await ask(sw, 'tiles-usage');
    ok(!tiles.has(urls[0]), '最終アクセスが最も古いタイルが消える',
      { remaining: [...tiles.keys()].map(u => u.slice(-9)) });
    ok(tiles.has(urls[2]), '最後に入れたタイルは残る');
    ok(!cache.has(urls[0]), 'キャッシュ本体からも消える');
    ok(usage.bytes <= sw.get('TILE_CACHE_LIMIT_BYTES'), '合計が上限以下に収まる',
      { bytes: usage.bytes, limit: sw.get('TILE_CACHE_LIMIT_BYTES') });
    ok(usage.count === tiles.size, '枚数と索引が一致', { usage: usage.count, idb: tiles.size });
  }

  /* ================= 4. 手動削除 ================= */
  {
    const sw = loadSw({ fetchImpl: async () => makeResponse('tile', 5000) });
    await runFetch(sw, 'https://tile.openstreetmap.org/14/1/1.png');
    await settle(20);
    const before = await ask(sw, 'tiles-usage');
    ok(before.count === 1, '削除前に1枚ある', before);
    await ask(sw, 'tiles-clear');
    const after = await ask(sw, 'tiles-usage');
    ok(after.count === 0 && after.bytes === 0, '削除後は空になる', after);
  }

  /* ================= 5. activateでタイルを巻き添えにしない ================= */
  {
    const sw = loadSw({ fetchImpl: async () => makeResponse('x', 10) });
    // 旧バージョンのアプリキャッシュ・現行・タイルキャッシュを用意する
    await sw.caches.open('sotoki-v1');
    await sw.caches.open(sw.get('CACHE_NAME'));
    await sw.caches.open('sotoki-tiles-v1');
    const waits = [];
    sw.handlers.activate({ waitUntil: p => waits.push(p) });
    await Promise.allSettled(waits);
    await settle();
    const keys = await sw.caches.keys();
    ok(!keys.includes('sotoki-v1'), '古いアプリキャッシュは消える', keys);
    ok(keys.includes('sotoki-tiles-v1'), '★タイルキャッシュは残る（バージョン更新で消さない）', keys);
    ok(keys.includes(sw.get('CACHE_NAME')), '現行のアプリキャッシュは残る', keys);
  }

  /* ================= 6. opaqueレスポンスは保存しない ================= */
  {
    const sw = loadSw({ fetchImpl: async () => {
      const r = makeResponse('opaque', 0); r.type = 'opaque'; r.ok = false; return r;
    } });
    await runFetch(sw, 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/1/1');
    await settle(20);
    const usage = await ask(sw, 'tiles-usage');
    ok(usage.count === 0, 'サイズの分からないレスポンスは保存しない（LRUが壊れるため）', usage);
  }

  if (fails.length) {
    console.log(`FAILED ${fails.length}件:`);
    for (const f of fails) console.log('  ✗ ' + f);
    console.log('TILECACHE SMOKE FAILED');
    process.exit(1);
  }
  console.log('TILECACHE SMOKE PASSED');
})();
