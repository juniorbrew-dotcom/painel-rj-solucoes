const CACHE_NAME = 'painel-rj-solucoes-v1';
const URLS_TO_CACHE = [
  '/',              // raiz
  '/index.html',    // página principal
  '/manifest.json', // manifesto PWA
  '/icon-192.png',  // ícone 192px
  '/icon-512.png',  // ícone 512px
  // adicione aqui outros arquivos CSS, JS ou imagens que queira manter offline
];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// Ativa o Service Worker e remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
                  .map(name => caches.delete(name))
      );
    })
  );
});

// Intercepta requisições e serve do cache quando possível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
