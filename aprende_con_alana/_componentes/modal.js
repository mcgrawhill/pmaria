// =====================================================
// Modal — overlay centrado reutilizable
// =====================================================
// Uso:
//   Modal.mostrar({
//     emoji: '🌟', titulo: '¡Perfecto!',
//     html: '<p>...</p>',
//     color: 'var(--verde-osc)',
//     botones: [
//       { texto: 'Cancelar', clase: 'boton-volver' },
//       { texto: 'Sí', clase: 'boton-comprobar', accion: () => doIt() },
//     ],
//   });
// Si la acción devuelve false la modal NO se cierra.
// Si no se pasan botones, click fuera cierra.

const Modal = (function () {
  let nodo = null;
  let onEscape = null;

  function cerrar() {
    if (!nodo) return;
    nodo.remove();
    nodo = null;
    if (onEscape) document.removeEventListener('keydown', onEscape);
    onEscape = null;
    document.body.style.overflow = '';
  }

  function mostrar(opts) {
    cerrar();
    const { emoji, titulo, html = '', botones = [], color, cerrableFuera = false } = opts;

    nodo = document.createElement('div');
    nodo.className = 'modal modal-info';
    const estilo = color ? ` style="border-top:8px solid ${color};"` : '';
    nodo.innerHTML = `
      <div class="modal-contenido"${estilo}>
        ${emoji ? `<div class="modal-emoji">${emoji}</div>` : ''}
        ${titulo ? `<h2>${titulo}</h2>` : ''}
        ${html ? `<div class="modal-cuerpo">${html}</div>` : ''}
        <div class="modal-botones"></div>
      </div>`;

    const cont = nodo.querySelector('.modal-botones');
    botones.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'boton ' + (b.clase || 'boton-siguiente');
      btn.innerHTML = b.texto;
      btn.addEventListener('click', () => {
        const r = b.accion ? b.accion() : undefined;
        if (r !== false) cerrar();
      });
      cont.appendChild(btn);
    });

    if (cerrableFuera || botones.length === 0) {
      nodo.addEventListener('click', (e) => {
        if (e.target === nodo) cerrar();
      });
    }

    onEscape = (e) => {
      if (e.key === 'Escape' && (cerrableFuera || botones.length === 0)) cerrar();
    };
    document.addEventListener('keydown', onEscape);

    document.body.appendChild(nodo);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const ultimo = cont.querySelector('button:last-child');
      if (ultimo) ultimo.focus();
    }, 50);
  }

  return { mostrar, cerrar };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Modal;
