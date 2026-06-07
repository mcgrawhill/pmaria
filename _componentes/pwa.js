// =====================================================
// PWA — registrar service worker + banner "nueva versión"
// =====================================================
// Llamar a PWA.registrar() desde la página principal.
// El SW vive en la raíz para que su scope cubra todo el sitio.

const PWA = (function () {

  // Flag: ¿la página ya tenía un controller cuando arrancó? Si lo tenía y
  // luego controller cambia, es que se ha activado una versión nueva.
  let teniaController = false;

  function inyectarEstilos() {
    if (document.getElementById('pwa-estilos')) return;
    const css = `
      .pwa-banner {
        position: fixed;
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        background: #0984e3;
        color: white;
        padding: 0.55rem 0.7rem 0.55rem 1.1rem;
        border-radius: 999px;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        z-index: 1000;
        font-family: 'Fredoka', system-ui, sans-serif;
        font-size: 0.95rem;
        animation: pwa-slide-in 0.4s ease;
        max-width: calc(100% - 2rem);
      }
      @keyframes pwa-slide-in {
        from { transform: translate(-50%, 150%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
      }
      .pwa-banner-texto { font-weight: 600; }
      .pwa-banner-recargar {
        background: white;
        color: #0984e3;
        border: none;
        border-radius: 999px;
        padding: 0.4rem 0.95rem;
        font-family: inherit;
        font-weight: 700;
        cursor: pointer;
        font-size: 0.9rem;
      }
      .pwa-banner-recargar:hover { background: #f1f6fa; }
      .pwa-banner-cerrar {
        background: transparent;
        color: white;
        border: none;
        font-size: 1.4rem;
        width: 26px;
        height: 26px;
        line-height: 1;
        cursor: pointer;
        opacity: 0.75;
        padding: 0;
      }
      .pwa-banner-cerrar:hover { opacity: 1; }
    `;
    const tag = document.createElement('style');
    tag.id = 'pwa-estilos';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function mostrarBanner() {
    if (document.getElementById('pwa-banner')) return;
    inyectarEstilos();
    const div = document.createElement('div');
    div.id = 'pwa-banner';
    div.className = 'pwa-banner';
    div.innerHTML = `
      <span class="pwa-banner-texto">✨ Hay una versión nueva</span>
      <button type="button" class="pwa-banner-recargar">Actualizar</button>
      <button type="button" class="pwa-banner-cerrar" aria-label="Cerrar aviso">×</button>
    `;
    div.querySelector('.pwa-banner-recargar').addEventListener('click', () => {
      location.reload();
    });
    div.querySelector('.pwa-banner-cerrar').addEventListener('click', () => {
      div.remove();
    });
    document.body.appendChild(div);
  }

  function registrar() {
    if (!('serviceWorker' in navigator)) return;

    const baseScripts = document.querySelector('script[src$="pwa.js"]');
    if (!baseScripts) return;
    // pwa.js vive en _componentes/, sw.js vive en la raíz → un nivel arriba.
    const swUrl = new URL('../sw.js', baseScripts.src).pathname;

    teniaController = !!navigator.serviceWorker.controller;

    navigator.serviceWorker.register(swUrl).then((reg) => {
      // Comprobar updates al volver al foco y cada 30 min mientras la app esté abierta.
      const buscar = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') buscar();
      });
      setInterval(buscar, 30 * 60 * 1000);
    }).catch(() => {
      // Silencioso: si falla (file:// o navegador antiguo), seguimos sin offline.
    });

    // Si el controller cambia *después* del arranque y antes ya había uno,
    // significa que se activó una versión nueva → avisamos al usuario.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (teniaController) mostrarBanner();
      teniaController = true;
    });
  }

  // Pregunta al SW activo cuál es su versión. Devuelve null si no hay
  // controller o si la respuesta tarda > 1500ms (timeout).
  function obtenerVersion() {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      const ch = new MessageChannel();
      let resuelto = false;
      ch.port1.onmessage = (e) => {
        if (resuelto) return;
        resuelto = true;
        resolve((e.data && e.data.version) || null);
      };
      try {
        navigator.serviceWorker.controller.postMessage('version', [ch.port2]);
      } catch (e) {
        resuelto = true;
        resolve(null);
      }
      setTimeout(() => { if (!resuelto) { resuelto = true; resolve(null); } }, 1500);
    });
  }

  return { registrar, obtenerVersion };
})();
