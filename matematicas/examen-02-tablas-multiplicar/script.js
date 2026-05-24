// =====================================================
// EXAMEN 2 — Tablas de multiplicar (3.º-4.º Primaria)
// =====================================================
// Una sola pantalla con 10 productos. El usuario elige primero
// qué tabla (del 1 al 10) o "todas mezcladas".

const EXAMEN_ID = 'examen-02-tablas-multiplicar';
const NUM_PREGUNTAS = 10;

const estado = {
  modo: null, // 'tabla-N' o 'mezcla'
  ejercicios: [],
  respuestas: {},
  comprobado: false,
  totalCorrectas: 0,
};

// ---------- GENERACIÓN ----------

function barajar(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generarEjercicios(modo) {
  const ejs = [];
  if (modo.startsWith('tabla-')) {
    const n = parseInt(modo.split('-')[1], 10);
    // 10 preguntas barajadas: n×1, n×2, ..., n×10
    const factores = barajar([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    factores.forEach((f, i) => {
      // Alternamos el orden para evitar patrón fijo (n×f o f×n).
      const [a, b] = Math.random() < 0.5 ? [n, f] : [f, n];
      ejs.push({ id: `q${i + 1}`, a, b, respuesta: n * f });
    });
  } else {
    // Mezcla: 10 productos aleatorios con factores 1..10.
    for (let i = 0; i < NUM_PREGUNTAS; i++) {
      const a = 1 + Math.floor(Math.random() * 10);
      const b = 1 + Math.floor(Math.random() * 10);
      ejs.push({ id: `q${i + 1}`, a, b, respuesta: a * b });
    }
  }
  return ejs;
}

// ---------- PANTALLAS ----------

function renderSelector() {
  estado.modo = null;
  estado.comprobado = false;
  document.getElementById('seccion-titulo').textContent = '✖️ Tablas de multiplicar';
  document.getElementById('seccion-subtitulo').textContent = 'Elige una tabla para repasar';
  document.getElementById('pie').hidden = true;
  document.getElementById('barra-fill').style.width = '0%';

  const main = document.getElementById('examen');
  let botones = `
    <button type="button" class="tabla-btn destacado" data-modo="mezcla">
      🎯 Todas mezcladas
    </button>`;
  for (let n = 1; n <= 10; n++) {
    botones += `
      <button type="button" class="tabla-btn" data-modo="tabla-${n}">
        <span class="tabla-emoji">✖️</span>Tabla del ${n}
      </button>`;
  }

  main.innerHTML = `
    <div class="selector-tablas">
      <h2>¿Qué quieres practicar?</h2>
      <p>Vas a tener <strong>${NUM_PREGUNTAS} multiplicaciones</strong>. Tómate tu tiempo, sin prisa.</p>
      <div class="tabla-grid">${botones}</div>
    </div>`;

  main.querySelectorAll('.tabla-btn').forEach(btn => {
    btn.addEventListener('click', () => empezar(btn.dataset.modo));
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function empezar(modo) {
  estado.modo = modo;
  estado.ejercicios = generarEjercicios(modo);
  estado.respuestas = {};
  estado.comprobado = false;
  estado.totalCorrectas = 0;
  document.getElementById('puntos').textContent = '0';
  renderEjercicios();
}

function renderEjercicios() {
  const titulo = estado.modo === 'mezcla'
    ? '🎯 Todas mezcladas'
    : `✖️ Tabla del ${estado.modo.split('-')[1]}`;
  document.getElementById('seccion-titulo').textContent = titulo;
  document.getElementById('seccion-subtitulo').textContent =
    `Resuelve las ${NUM_PREGUNTAS} multiplicaciones`;

  const main = document.getElementById('examen');
  let html = `<div class="seccion-intro">
    <h2>${titulo}</h2>
    <p>Pulsa cada casillero para escribir el resultado.</p>
  </div>`;

  estado.ejercicios.forEach((ej, i) => {
    html += `
      <div class="ej-tabla" data-ej="${ej.id}">
        <span class="ejercicio-num">${i + 1}</span>
        <span class="operacion">
          ${ej.a} × ${ej.b} =
          <button type="button" class="display-num ancha vacio"
                  data-id="${ej.id}" data-valor=""
                  data-max="${String(ej.respuesta).length}"
                  aria-label="Resultado">–</button>
        </span>
        <div class="feedback" id="fb-${ej.id}"></div>
      </div>`;
  });

  main.innerHTML = html;
  conectarEventos();

  const pie = document.getElementById('pie');
  pie.hidden = false;
  pie.innerHTML = `<button id="btn-comprobar" class="boton boton-comprobar" type="button">
    Comprobar respuestas ✓
  </button>`;
  document.getElementById('btn-comprobar').addEventListener('click', () => {
    pedirConfirmacion();
  });

  document.getElementById('barra-fill').style.width = '0%';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function conectarEventos() {
  document.querySelectorAll('.display-num').forEach(disp => {
    disp.addEventListener('click', () => {
      if (disp.disabled) return;
      const id = disp.dataset.id;
      Teclado.abrir(disp, {
        maxDigitos: parseInt(disp.dataset.max, 10) || 3,
        onCambio: (valor) => { estado.respuestas[id] = valor; },
      });
    });
  });
}

// ---------- CONFIRMACIÓN + COMPROBACIÓN ----------

function pedirConfirmacion() {
  const sinResponder = estado.ejercicios.filter(ej => !estado.respuestas[ej.id]).length;
  const aviso = sinResponder > 0
    ? `<p>Te quedan <strong>${sinResponder}</strong> sin responder. Las contaremos como falladas.</p>`
    : '';
  Modal.mostrar({
    emoji: '🤔',
    titulo: '¿Has terminado?',
    html: `<p>¿Quieres comprobar tus respuestas?</p>${aviso}`,
    color: 'var(--naranja)',
    botones: [
      { texto: 'Déjame revisar', clase: 'boton-volver' },
      { texto: 'Sí, comprobar ✓', clase: 'boton-comprobar', accion: comprobar },
    ],
  });
}

function comprobar() {
  estado.comprobado = true;
  let aciertos = 0;
  const errores = [];

  estado.ejercicios.forEach(ej => {
    const v = parseInt(estado.respuestas[ej.id], 10);
    const correcto = v === ej.respuesta;
    const div = document.querySelector(`[data-ej="${ej.id}"]`);
    const fb = document.getElementById(`fb-${ej.id}`);
    const disp = div.querySelector('.display-num');
    disp.disabled = true;
    disp.classList.add(correcto ? 'ok' : 'ko');
    if (correcto) {
      aciertos++;
      div.classList.add('correcto');
      fb.classList.add('mostrar', 'ok');
      fb.innerHTML = '🎉 ¡Correcto!';
    } else {
      errores.push(ej.id);
      div.classList.add('incorrecto');
      fb.classList.add('mostrar', 'ko');
      fb.innerHTML = `💡 La respuesta correcta es <strong>${ej.respuesta}</strong>.`;
    }
  });

  estado.totalCorrectas = aciertos;
  document.getElementById('puntos').textContent = String(aciertos);
  document.getElementById('barra-fill').style.width = '100%';

  // Guardar intento (usamos `modo` para distinguir tabla vs mezcla en el dashboard).
  if (typeof Almacen !== 'undefined') {
    Almacen.addIntento(EXAMEN_ID, {
      correctas: aciertos,
      total: estado.ejercicios.length,
      modo: estado.modo === 'mezcla' ? 'fijo' : estado.modo,
      errores,
    });
  }

  mostrarResumen(aciertos, estado.ejercicios.length);
}

function mostrarResumen(aciertos, total) {
  const pct = Math.round((aciertos / total) * 100);
  let emoji, titulo, color, mensaje;
  if (pct === 100) {
    emoji = '🏆'; titulo = '¡Increíble!'; color = 'var(--verde-osc)';
    mensaje = '¡Las has acertado todas! Eres un crack de las tablas.';
  } else if (pct >= 80) {
    emoji = '🌟'; titulo = '¡Muy bien!'; color = 'var(--verde-osc)';
    mensaje = '¡Genial trabajo! Casi todas correctas.';
  } else if (pct >= 60) {
    emoji = '😊'; titulo = '¡Bien hecho!'; color = 'var(--naranja)';
    mensaje = 'Buen intento. Repasa las que has fallado y la próxima irás aún mejor.';
  } else if (pct >= 40) {
    emoji = '💪'; titulo = '¡Sigue así!'; color = 'var(--naranja)';
    mensaje = 'Vas mejorando. Practica un poco más con esta tabla.';
  } else {
    emoji = '🌱'; titulo = '¡A practicar!'; color = 'var(--naranja)';
    mensaje = 'Repasa con calma y vuelve a intentarlo. ¡Tú puedes!';
  }

  if (pct >= 80) Confeti.lanzar(pct === 100 ? 180 : 100);

  Modal.mostrar({
    emoji,
    titulo,
    color,
    html: `<p>${mensaje}</p>
           <p><strong>${aciertos} de ${total}</strong> correctas (${pct}%).</p>`,
    botones: [
      { texto: 'Revisar respuestas', clase: 'boton-volver' },
      { texto: 'Otra tabla 🔄', clase: 'boton-siguiente', accion: renderSelector },
    ],
  });
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  Teclado.init();
  // Si la URL trae ?tabla=N o ?aleatorio=1, saltamos el selector.
  const params = new URLSearchParams(location.search);
  const tabla = params.get('tabla');
  if (tabla === 'mezcla' || params.get('aleatorio') === '1') {
    empezar('mezcla');
  } else if (tabla && /^([1-9]|10)$/.test(tabla)) {
    empezar(`tabla-${tabla}`);
  } else {
    renderSelector();
  }
});
