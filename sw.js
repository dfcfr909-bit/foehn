/* SotoKi Service Worker
 *
 * 目的はインストール可能にすることと、圏外でも画面が立ち上がること。
 * 「更新したのに古い画面のまま」を絶対に起こさないため、方針を厳密に分けている。
 *
 *   HTML（ナビゲーション）… ネットワーク優先。取れたら必ずそれを表示し、同時にキャッシュを更新。
 *                            通信できないときだけキャッシュへフォールバックする
 *   同梱の静的ファイル      … キャッシュ優先＋裏で更新（stale-while-revalidate）
 *   気象API・地図タイル等   … 一切キャッシュしない（常に最新を取りに行く）
 *
 * CACHE_VERSION を上げると古いキャッシュは activate 時に消える。
 * 本体を大きく変えたときは上げること。
 */
const CACHE_VERSION = 'sotoki-v1';
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
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// このオリジンの同梱ファイルかどうか
function isAppAsset(url) {
  return url.origin === self.location.origin;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 気象API・地名検索・地図タイル・AI概況は常にネットワーク（キャッシュしない）
  if (!isAppAsset(url) || url.pathname.endsWith('/outlook.json')) return;

  // HTMLはネットワーク優先。更新が即座に反映されるようにする
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
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
