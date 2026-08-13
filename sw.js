/* foehn Service Worker
 *
 * 目的はインストール可能にすることと、圏外でも画面が立ち上がること。
 * 「更新したのに古い画面のまま」を絶対に起こさないため、方針を厳密に分けている。
 *
 *   HTML（ナビゲーション）… ネットワーク優先。取れたら必ずそれを表示し、同時にキャッシュを更新。
 *                            通信できないときだけキャッシュへフォールバックする
 *   同梱の静的ファイル      … キャッシュ優先＋裏で更新（stale-while-revalidate）
 *   地図タイル              … 別キャッシュにcache-firstで保存（訪問済みのみ・LRUで上限管理）
 *   気象API・地名検索等     … 一切キャッシュしない（常に最新を取りに行く）
 *
 * CACHE_VERSION を上げると古いキャッシュは activate 時に消える。
 * 本体を大きく変えたときは上げること。
 */
const CACHE_VERSION = 'sotoki-v2';
const CACHE_NAME = `${CACHE_VERSION}`;

// 起動に必要な同梱ファイル。CDN（Leaflet）は落ちても本体が動くのでここには入れない
const PRECACHE = [
  './',
  './index.html',
  './sotoki_v4.html',
  './manifest.webmanifest',
  './areas.json',
  './snowRanking.js',
  './data/spots.json',
  './vendor/uPlot.iife.min.js',
  './vendor/uPlot.min.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // 1つでも失敗すると全部落ちるので個別に入れる（CDN不通などで詰まらせない）
    await Promise.all(PRECACHE.map(u => cache.add(u).catch(() => {})));
    await self.skipWaiting();          // 新しいSWをすぐ有効化する
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    // 地図タイルはアプリシェルと寿命が別。バージョンを上げても巻き添えで消さないこと
    await Promise.all(keys
      .filter(k => k !== CACHE_NAME && k !== TILE_CACHE)
      .map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// このオリジンの同梱ファイルかどうか
function isAppAsset(url) {
  return url.origin === self.location.origin;
}

/* ============================================================
   地図タイルのキャッシュ（訪問済みのみ。事前ダウンロードはしない）

   ・アプリシェルとは別のキャッシュに入れる（消すときに巻き添えにしない）
   ・cache-first。ヒットしたら即返し、裏での更新もしない（地形図は変わらないため）
   ・上限を超えたら最終アクセスが古いものから消す（LRU）
   ・最終アクセス時刻と容量は IndexedDB で管理する
   仕様は docs/map-selector-requirements.md §7
   ============================================================ */
const TILE_CACHE = 'sotoki-tiles-v1';
const TILE_CACHE_LIMIT_BYTES = 150 * 1024 * 1024;   // 150MB。iOS実測後に調整する
const TILE_TOUCH_INTERVAL_MS = 60 * 60 * 1000;      // LRUの更新はこの間隔に間引く（書き込み過多を防ぐ）

// キャッシュ対象のタイル配信元。ここに無いホストは一切触らない
const TILE_HOSTS = [
  'cyberjapandata.gsi.go.jp',
  'tile.openstreetmap.org',
  'server.arcgisonline.com',
  'map.ecoris.info',           // CS立体図
];
function isTileRequest(url) {
  return TILE_HOSTS.includes(url.hostname);
}

/* --- IndexedDB（url -> {t: 最終アクセス, size}）と合計サイズのメタ --- */
const IDB_NAME = 'sotoki-tiles';
const IDB_STORE = 'tiles';
const IDB_META = 'meta';
let idbPromise = null;
function idb() {
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'url' }).createIndex('t', 't');
      }
      if (!db.objectStoreNames.contains(IDB_META)) db.createObjectStore(IDB_META);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return idbPromise;
}
function tx(store, mode) {
  return idb().then(db => db.transaction(store, mode).objectStore(store));
}
function idbReq(r) {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function getTotalBytes() {
  const st = await tx(IDB_META, 'readonly');
  const v = await idbReq(st.get('totalBytes'));
  return typeof v === 'number' ? v : 0;
}
async function setTotalBytes(v) {
  const st = await tx(IDB_META, 'readwrite');
  return idbReq(st.put(Math.max(0, v), 'totalBytes'));
}

// タイルを保存し、最終アクセスと合計サイズを記録する
async function putTile(url, response) {
  const size = (await response.clone().blob()).size;
  const cache = await caches.open(TILE_CACHE);
  await cache.put(url, response.clone());
  const st = await tx(IDB_STORE, 'readwrite');
  const prev = await idbReq(st.get(url));
  await idbReq(st.put({ url, t: Date.now(), size }));
  await setTotalBytes((await getTotalBytes()) - (prev ? prev.size : 0) + size);
  await enforceTileLimit();
}

// ヒット時の最終アクセス更新。毎回書くと重いので間引く
async function touchTile(url) {
  const st = await tx(IDB_STORE, 'readwrite');
  const rec = await idbReq(st.get(url));
  if (!rec) return;
  const now = Date.now();
  if (now - rec.t < TILE_TOUCH_INTERVAL_MS) return;
  rec.t = now;
  await idbReq(st.put(rec));
}

// 上限超過ぶんを、最終アクセスが古い順に消す
async function enforceTileLimit() {
  let total = await getTotalBytes();
  if (total <= TILE_CACHE_LIMIT_BYTES) return;
  const cache = await caches.open(TILE_CACHE);
  const db = await idb();
  const store = db.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE);
  const victims = [];
  await new Promise(resolve => {
    // 't' の昇順＝最終アクセスが古い順
    const cur = store.index('t').openCursor();
    cur.onsuccess = () => {
      const c = cur.result;
      if (!c || total - victims.reduce((a, v) => a + v.size, 0) <= TILE_CACHE_LIMIT_BYTES * 0.9) return resolve();
      victims.push({ url: c.value.url, size: c.value.size || 0 });
      c.continue();
    };
    cur.onerror = () => resolve();
  });
  for (const v of victims) {
    await cache.delete(v.url);
    const st = await tx(IDB_STORE, 'readwrite');
    await idbReq(st.delete(v.url));
    total -= v.size;
  }
  await setTotalBytes(total);
}

async function tileCacheUsage() {
  const st = await tx(IDB_STORE, 'readonly');
  const count = await idbReq(st.count());
  return { count, bytes: await getTotalBytes(), limit: TILE_CACHE_LIMIT_BYTES };
}

async function clearTiles() {
  await caches.delete(TILE_CACHE);
  const st = await tx(IDB_STORE, 'readwrite');
  await idbReq(st.clear());
  await setTotalBytes(0);
  return { ok: true };
}

// 画面からの問い合わせ（使用量・削除）
self.addEventListener('message', e => {
  const msg = e.data || {};
  const reply = r => { if (e.ports && e.ports[0]) e.ports[0].postMessage(r); };
  if (msg.type === 'tiles-usage') {
    e.waitUntil(tileCacheUsage().then(reply).catch(() => reply(null)));
  } else if (msg.type === 'tiles-clear') {
    e.waitUntil(clearTiles().then(reply).catch(() => reply(null)));
  }
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 地図タイルはcache-first（訪問済みのぶんが圏外でも出るように）
  if (isTileRequest(url)) {
    e.respondWith((async () => {
      const cache = await caches.open(TILE_CACHE);
      const hit = await cache.match(req.url);
      if (hit) {
        e.waitUntil(touchTile(req.url).catch(() => {}));
        return hit;                       // ヒットしたら裏でも取り直さない
      }
      try {
        const res = await fetch(req);
        // 不透明レスポンス(opaque)はサイズが0に見えLRUが破綻するので保存しない
        if (res && res.ok && res.type !== 'opaque') {
          e.waitUntil(putTile(req.url, res.clone()).catch(() => {}));
        }
        return res;
      } catch (err) {
        return new Response('', { status: 504 });
      }
    })());
    return;
  }

  // 気象API・地名検索・AI概況は常にネットワーク（キャッシュしない）
  if (!isAppAsset(url) || url.pathname.endsWith('/outlook.json')) return;

  // HTMLはネットワーク優先。更新が即座に反映されるようにする
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        // ⚠ res.ok を必ず見る。404や500を焼き付けると、以後は圏外でも
        //   そのエラーが返り「圏外でも画面が立ち上がる」という目的が壊れる
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch {
        return (await caches.match(req)) || (await caches.match('./sotoki_v4.html')) ||
               new Response('オフラインです', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
    })());
    return;
  }

  // それ以外の同梱ファイルはキャッシュ優先＋裏で更新
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const fetching = fetch(req).then(res => {
      if (res && res.ok) caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => null);
    return cached || (await fetching) ||
      new Response('', { status: 504 });
  })());
});
