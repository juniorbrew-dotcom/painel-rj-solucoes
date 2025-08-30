const CACHE_NAME = "rj-solucoes-cache";
const URLS_TO_CACHE = [
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png"
];

// Instala e adiciona arquivos ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Arquivos adicionados ao cache");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // força ativação imediata
});

// Ativa e remove caches antigos automaticamente
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Cache antigo removido:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // aplica a nova versão para todos os clientes
});

// Intercepta requisições e atualiza o cache em segundo plano
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => response); // se offline, usa o cache
      return response || fetchPromise;
    })
  );
});