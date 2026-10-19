// Service Worker de retirada para la dirección antigua del sitio.
//
// Antes, Alana se servía desde esta carpeta y registraba aquí un SW con
// estrategia stale-while-revalidate. Al mudarse el sitio a la subcarpeta
// aprende_con_alana/, ese SW seguiría controlando la ruta antigua y sirviendo
// para siempre una copia cacheada que ya no existe en el servidor.
//
// Este archivo lo sustituye: no cachea nada, limpia lo que quedó de la ruta
// antigua, se desregistra y recarga las pestañas abiertas para que lleguen a
// la redirección de index.html.

// Ruta del sitio nuevo, resuelta desde el scope de este SW (la raíz).
const RUTA_NUEVA = new URL('aprende_con_alana/', self.registration.scope).href;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // CacheStorage se comparte por origen, no por scope: el sitio nuevo usa el
    // mismo nombre de caché ('alana-vN'), así que borrar cachés enteras le
    // dejaría sin precache. Se eliminan solo las entradas que quedaron fuera
    // de la ruta nueva.
    const nombres = await caches.keys();
    for (const nombre of nombres) {
      const cache = await caches.open(nombre);
      const claves = await cache.keys();
      await Promise.all(
        claves
          .filter((peticion) => !peticion.url.startsWith(RUTA_NUEVA))
          .map((peticion) => cache.delete(peticion))
      );
    }

    // Dejar de controlar esta ruta.
    await self.registration.unregister();

    // Recargar las pestañas que siguieran abiertas en la dirección vieja.
    const clientes = await self.clients.matchAll({ type: 'window' });
    clientes.forEach((cliente) => cliente.navigate(cliente.url));
  })());
});
