const CACHE_NAME = 'my-transit-v3'; // バージョンを上げて確実に更新
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './header-banner.png',
  './bus-map.png',
  './subway-map.png',
  './icon-192.png',
  './icon-512.png',
  './holidays.json',
  './bus_sangen_to_jirou_weekday.json',
  './bus_sangen_to_jirou_saturday.json',
  './bus_sangen_to_jirou_holiday.json',
  './bus_jirou_to_sangen_weekday.json',
  './bus_jirou_to_sangen_saturday.json',
  './bus_jirou_to_sangen_holiday.json',
  './subway_hashimoto_to_jirou_weekday.json',
  './subway_hashimoto_to_jirou_holiday.json',
  './subway_jirou_to_hashimoto_weekday.json',
  './subway_jirou_to_hashimoto_holiday.json',
  './subway_jirou_to_hakata_weekday.json',
  './subway_jirou_to_hakata_holiday.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

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

// キャッシュ優先（即座に表示し、裏でこっそり最新版に更新）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
