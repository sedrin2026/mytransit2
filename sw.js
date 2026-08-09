const CACHE_NAME = 'my-transit-v2'; // 最新アプリ用のキャッシュ名
const urlsToCache = [
  './index.html',
  './manifest.json',
  './bus-map.png',
  './subway-map.png'
  // ※もし他にもCSSやJSファイルがあればここに書き足してな
];

// 新しいサービスワーカーが来たら即座に入れ替える
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 古いキャッシュを掃除する
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ネット優先（ダメならキャッシュから表示）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
