// =====================================================
// Ranuras — asignar una palabra de un banco a un hueco
// =====================================================
// Mecanismo común a casi todos los ejercicios de Natural Science:
// etiquetar diagramas, rellenar huecos, ordenar pasos, emparejar
// y clasificar son todos "elegir un valor de una lista para una ranura".
//
// Se evita el arrastrar y soltar a propósito: en móvil y tablet es
// frustrante para un niño. Aquí se toca la ranura y se elige del panel.

const Ranuras = (function () {

  let panel = null;
  let ranuraActiva = null;
  let alElegir = null;

  function init() {
    if (panel) return;
    panel = document.createElement('div');
    panel.className = 'banco-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <div class="banco-fondo" data-cerrar="1"></div>
      <div class="banco-hoja" role="dialog" aria-label="Elige una palabra">
        <p class="banco-titulo">Choose a word</p>
        <div class="banco-chips"></div>
        <div class="banco-acciones">
          <button type="button" class="boton banco-borrar">Clear</button>
          <button type="button" class="boton banco-cerrar" data-cerrar="1">Close</button>
        </div>
      </div>`;
    document.body.appendChild(panel);

    panel.addEventListener('click', (e) => {
      if (e.target.dataset.cerrar) cerrar();
    });
    panel.querySelector('.banco-borrar').addEventListener('click', () => {
      if (ranuraActiva) aplicar(ranuraActiva, '', '');
      cerrar();
    });
  }

  // `opciones`: [{ valor, texto }]. `usadas`: valores ya puestos en otras
  // ranuras del mismo grupo, para marcarlos sin llegar a bloquearlos
  // (si se equivocó, debe poder reusar la palabra).
  function abrir(ranura, opciones, usadas, onElegir) {
    init();
    ranuraActiva = ranura;
    alElegir = onElegir;
    const chips = panel.querySelector('.banco-chips');
    chips.innerHTML = opciones.map(op => {
      const usada = usadas.includes(op.valor) && ranura.dataset.valor !== op.valor;
      return `<button type="button" class="banco-chip${usada ? ' usada' : ''}"
                data-valor="${esc(op.valor)}">${esc(op.texto)}</button>`;
    }).join('');
    chips.querySelectorAll('.banco-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const op = opciones.find(o => o.valor === chip.dataset.valor);
        aplicar(ranuraActiva, op.valor, op.texto);
        cerrar();
      });
    });
    panel.hidden = false;
    document.body.classList.add('con-panel');
  }

  function aplicar(ranura, valor, texto) {
    ranura.dataset.valor = valor;
    ranura.textContent = texto || ranura.dataset.placeholder || '?';
    ranura.classList.toggle('vacia', !valor);
    if (alElegir) alElegir(ranura.dataset.id, valor);
  }

  function cerrar() {
    if (!panel) return;
    panel.hidden = true;
    ranuraActiva = null;
    document.body.classList.remove('con-panel');
  }

  // Pinta una ranura. `grupo` agrupa las ranuras que comparten banco.
  function render(id, grupo, placeholder, extraClase = '') {
    return `<button type="button" class="ranura vacia ${extraClase}"
              data-id="${esc(id)}" data-grupo="${esc(grupo)}"
              data-valor="" data-placeholder="${esc(placeholder)}"
            >${esc(placeholder)}</button>`;
  }

  // Conecta todas las ranuras de un contenedor con su banco de palabras.
  // `bancos`: { [grupo]: [{ valor, texto }] }
  function conectar(contenedor, bancos, onCambio) {
    contenedor.querySelectorAll('.ranura').forEach(ranura => {
      ranura.addEventListener('click', () => {
        if (ranura.disabled) return;
        const grupo = ranura.dataset.grupo;
        const opciones = bancos[grupo] || [];
        const usadas = [...contenedor.querySelectorAll(`.ranura[data-grupo="${grupo}"]`)]
          .map(r => r.dataset.valor).filter(Boolean);
        abrir(ranura, opciones, usadas, onCambio);
      });
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  return { init, render, conectar, cerrar };
})();

// `const` global no crea propiedad en window: hay que exponerlo a mano.
if (typeof window !== 'undefined') window.Ranuras = Ranuras;
if (typeof module !== 'undefined' && module.exports) module.exports = Ranuras;
