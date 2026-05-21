// =====================================================
// PWA — registrar service worker y exponer "instalar"
// =====================================================
// Llamar a PWA.registrar() desde la página principal.
// El SW vive en la raíz para que su scope cubra todo el sitio.

const PWA = {
  registrar() {
    if (!('serviceWorker' in navigator)) return;
    // Calcular la ruta al sw.js relativa a la URL actual (sirve igual en /alana/ y en /).
    const baseScripts = document.querySelector('script[src$="pwa.js"]');
    if (!baseScripts) return;
    // pwa.js vive en _componentes/, sw.js vive en la raíz → un nivel arriba.
    const swUrl = new URL('../sw.js', baseScripts.src).pathname;
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Silencioso: si falla (file:// o navegador antiguo), seguimos sin offline.
    });
  },
};
