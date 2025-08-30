const CACHE_NAME = 'painel-rj-solucoes-v1';
const URLS_TO_CACHE = [
  '/painel-rj-solucoes/',
  '/painel-rj-solucoes/index.html',
  '/painel-rj-solucoes/manifest.json',
  '/painel-rj-solucoes/icon-192.png',
  '/painel-rj-solucoes/icon-512.png'
];

// Instala o Service Worker e armazena arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Intercepta requisições e serve do cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
