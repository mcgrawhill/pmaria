// Service Worker mínimo para Alana.
// Estrategia: stale-while-revalidate (responde cacheado y refresca en segundo plano).
// Subir CACHE_NAME al cambiar este archivo para invalidar el cache anterior.

const CACHE_NAME = 'alana-v25';
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
  '_componentes/lista.css',
  '_componentes/anatomia.js',
  '_componentes/ranuras.js',
  'matematicas/index.html',
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
  'natural-science/index.html',
  'natural-science/lista.css',
  'natural-science/examenes.js',
  'natural-science/examen-01-human-body/index.html',
  'natural-science/examen-01-human-body/script.js',
  'natural-science/examen-01-human-body/style.css',
  'natural-science/examen-01-human-body/img/respiratorio.webp',
  'natural-science/examen-01-human-body/img/digestivo.webp',
  'natural-science/examen-01-human-body/img/excretor.webp',
  'natural-science/examen-01-human-body/img/masculino.webp',
  'natural-science/examen-01-human-body/img/femenino.webp',
  'dashboard.html',
  'reset.html',
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
      // Solo las cachés de Alana: en github.io todos los repos comparten
      // origen, así que borrar por "todo lo que no sea la mía" se llevaría
      // por delante las de otro sitio publicado en la misma cuenta.
      Promise.all(nombres
        .filter((n) => n.startsWith('alana-') && n !== CACHE_NAME)
        .map((n) => caches.delete(n)))
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
