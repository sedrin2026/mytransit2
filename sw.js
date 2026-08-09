
const CACHE_NAME = 'my-transit-cache-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // 必要に応じてCSSやJSファイルがあればここに追加します
];

// インストール時にファイルをキャッシュに保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// ネットがなくてもキャッシュからデータを返す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがあればそれを返す、なければネットに取りに行く
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
