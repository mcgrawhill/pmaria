// =====================================================
// Teclado numérico modal — compartido entre exámenes
// =====================================================
//
// Uso:
//   <button class="display-num" data-id="f1-num">–</button>
//   Teclado.init();
//   document.querySelector('.display-num').addEventListener('click', (e) => {
//     Teclado.abrir(e.currentTarget, {
//       maxDigitos: 1,        // cuando v.length alcance este número se auto-cierra
//       onCambio: (valor) => { ... },
//     });
//   });
//
// Comportamiento:
//   - Al pulsar un dígito, se añade al display.
//   - Cuando v.length == maxDigitos se cierra automáticamente.
//   - Al reabrir un display con valor, la primera pulsación lo reemplaza.
//   - ⌫ borra el último dígito (no cierra).
//   - Tocar fuera del teclado o abrir otro display lo cierra.

const Teclado = {
  display: null,
  opts: {},
  primerPulse: false,

  abrir(displayEl, opts = {}) {
    this.display = displayEl;
    this.opts = { maxDigitos: 1, decimal: false, ...opts };
    this.primerPulse = !!(displayEl.dataset.valor && displayEl.dataset.valor.length > 0);

    const teclado = document.getElementById('teclado');
    if (!teclado) return;
    teclado.classList.toggle('con-decimal', !!this.opts.decimal);
    teclado.hidden = false;

    document.querySelectorAll('.display-num').forEach(d => d.classList.remove('display-activo'));
    displayEl.classList.add('display-activo');

    this._mostrarOverlay();
  },

  cerrar() {
    const teclado = document.getElementById('teclado');
    if (teclado) teclado.hidden = true;
    if (this.display) this.display.classList.remove('display-activo');
    this.display = null;
    this.opts = {};
    this._quitarOverlay();
  },

  pulsar(tecla) {
    if (!this.display) return;
    let v = this.display.dataset.valor || '';

    if (tecla === 'borrar') {
      v = v.slice(0, -1);
      this.primerPulse = false;
    } else if (tecla === ',') {
      if (!this.opts.decimal) return;
      if (this.primerPulse) { v = ','; this.primerPulse = false; }
      else if (v.includes(',')) return;
      else if (v.length < this.opts.maxDigitos) v += ',';
      else return;
    } else {
      if (this.primerPulse) {
        v = tecla;
        this.primerPulse = false;
      } else if (v.length < this.opts.maxDigitos) {
        v += tecla;
      }
    }

    this.display.dataset.valor = v;
    this.display.textContent = v || '–';
    this.display.classList.toggle('vacio', v === '');
    if (this.opts.onCambio) this.opts.onCambio(v);

    // Auto-cierre cuando alcanza el número de dígitos esperado.
    // Tras coma esperamos más entrada, así que no auto-cerramos por la coma.
    if (tecla !== 'borrar' && tecla !== ',' && v.length >= this.opts.maxDigitos) {
      setTimeout(() => this.cerrar(), 180);
    }
  },

  init() {
    // Asegurar que la tecla coma existe (oculta salvo en modo decimal).
    // Así no hay que tocar el HTML de cada examen.
    this._inyectarTeclaComa();

    document.querySelectorAll('.tecla').forEach(t => {
      t.addEventListener('click', () => this.pulsar(t.dataset.tecla));
    });
    document.addEventListener('keydown', (e) => {
      if (!this.display) return;
      if (e.key === 'Escape') this.cerrar();
      else if (/^[0-9]$/.test(e.key)) this.pulsar(e.key);
      else if (e.key === ',' || e.key === '.') this.pulsar(',');
      else if (e.key === 'Backspace' || e.key === 'Delete') this.pulsar('borrar');
      else if (e.key === 'Enter') this.cerrar();
    });
  },

  _inyectarTeclaComa() {
    const teclas = document.querySelector('.teclado-teclas');
    if (!teclas || teclas.querySelector('[data-tecla=","]')) return;
    const cero = teclas.querySelector('[data-tecla="0"]');
    const coma = document.createElement('button');
    coma.type = 'button';
    coma.className = 'tecla tecla-coma';
    coma.dataset.tecla = ',';
    coma.textContent = ',';
    coma.setAttribute('aria-label', 'Coma decimal');
    if (cero) teclas.insertBefore(coma, cero);
    else teclas.appendChild(coma);
  },

  _mostrarOverlay() {
    if (document.getElementById('teclado-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'teclado-overlay';
    ov.className = 'teclado-overlay';
    ov.addEventListener('click', () => this.cerrar());
    document.body.appendChild(ov);
  },

  _quitarOverlay() {
    const ov = document.getElementById('teclado-overlay');
    if (ov) ov.remove();
  },
};
