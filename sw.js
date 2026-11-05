const CACHE_NAME = 'bull-hotel-v2';
const urlsToCache = [
  './',
  './manifest.json'
];

// Instalar el Service Worker sin bloquear si falla algún recurso secundario
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => console.log('Aviso al cachear:', err));
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Interceptar peticiones respetando peticiones de cookies y CDNs externos
self.addEventListener('fetch', event => {
  // Ignorar peticiones no GET o de extensiones
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request).catch(() => {
          return caches.match('./');
        });
      })
  );
});
