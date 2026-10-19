// Service Worker mínimo para Alana.
// Estrategia: stale-while-revalidate (responde cacheado y refresca en segundo plano).
// Subir CACHE_NAME al cambiar este archivo para invalidar el cache anterior.

const CACHE_NAME = 'alana-v21';
const ARCHIVOS_BASE = [
  './',
  'index.html',
  'manifest.json',
  'icon.svg',
  'portada.css',
  '_componentes/examen.css',
  '_componentes/teclado.css',
  '_componentes/perfil.css',
  '_componentes/figuras.js',
  '_componentes/teclado.js',
  '_componentes/confeti.js',
  '_componentes/almacen.js',
  '_componentes/perfil.js',
  '_componentes/estrellas.js',
  '_componentes/pwa.js',
  '_componentes/modal.js',
  '_componentes/cronometro.js',
  '_componentes/generador.js',
  'matematicas/index.html',
  'matematicas/lista.css',
  'matematicas/examenes.js',
  'matematicas/examen-01-repaso-general/index.html',
  'matematicas/examen-01-repaso-general/script.js',
  'matematicas/examen-01-repaso-general/style.css',
  'matematicas/examen-02-tablas-multiplicar/index.html',
  'matematicas/examen-02-tablas-multiplicar/script.js',
  'matematicas/examen-02-tablas-multiplicar/style.css',
  'matematicas/examen-03-decimales-y-mas/index.html',
  'matematicas/examen-03-decimales-y-mas/script.js',
  'matematicas/examen-03-decimales-y-mas/style.css',
  'matematicas/examen-04-graficas-encuestas/index.html',
  'matematicas/examen-04-graficas-encuestas/script.js',
  'matematicas/examen-04-graficas-encuestas/style.css',
  'dashboard.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(ARCHIVOS_BASE.map((u) => cache.add(u).catch(() => null)))
    )
  );
  self.skipWaiting();
});

// Permite a la página consultar la versión activa del SW.
self.addEventListener('message', (event) => {
  if (event.data === 'version' && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(nombres.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (new URL(event.request.url).origin !== location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cacheado) => {
        const red = fetch(event.request).then((resp) => {
          if (resp && resp.ok) cache.put(event.request, resp.clone());
          return resp;
        }).catch(() => cacheado);
        // Devolver cacheado si existe (rápido) y actualizar en segundo plano.
        return cacheado || red;
      })
    )
  );
});
