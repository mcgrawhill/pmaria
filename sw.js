// Service Worker mínimo para Alana — cache-first con fallback a red.
// Permite usar la app offline tras la primera visita.

const CACHE_NAME = 'alana-v1';
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
  'matematicas/index.html',
  'matematicas/lista.css',
  'matematicas/examenes.js',
  'matematicas/examen-01-repaso-general/index.html',
  'matematicas/examen-01-repaso-general/script.js',
  'matematicas/examen-01-repaso-general/style.css',
  'dashboard.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      // Si falla algún archivo (404), no romper la instalación.
      Promise.all(ARCHIVOS_BASE.map((u) => cache.add(u).catch(() => null)))
    )
  );
  self.skipWaiting();
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
  event.respondWith(
    caches.match(event.request).then((cacheado) =>
      cacheado ||
      fetch(event.request).then((resp) => {
        // Guardar en caché las respuestas correctas del mismo origen
        if (resp.ok && new URL(event.request.url).origin === location.origin) {
          const copia = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, copia));
        }
        return resp;
      }).catch(() => cacheado)
    )
  );
});
