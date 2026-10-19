// =====================================================
// EXAMEN 1 — Repaso general (3.º-4.º Primaria, EMAT)
// Usa los componentes compartidos de matematicas/_componentes/
// =====================================================

// ---------- HELPERS DE RENDER ----------

function displayFraccion(id, maxNum = 1, maxDen = 1) {
  return `<span class="fraccion-input">
    <button type="button" class="display-num vacio" data-id="${id}" data-parte="num" data-valor="" data-max="${maxNum}" aria-label="Numerador">–</button>
    <span class="barra-fraccion"></span>
    <button type="button" class="display-num vacio" data-id="${id}" data-parte="den" data-valor="" data-max="${maxDen}" aria-label="Denominador">–</button>
  </span>`;
}

function displayMixto(id, maxEntero = 1, maxNum = 1, maxDen = 1) {
  return `<span class="mixto-input">
    <button type="button" class="display-num vacio" data-id="${id}" data-parte="entero" data-valor="" data-max="${maxEntero}" aria-label="Parte entera">–</button>
    <span class="mixto-y">y</span>
    <span class="fraccion-input">
      <button type="button" class="display-num vacio" data-id="${id}" data-parte="num" data-valor="" data-max="${maxNum}" aria-label="Numerador">–</button>
      <span class="barra-fraccion"></span>
      <button type="button" class="display-num vacio" data-id="${id}" data-parte="den" data-valor="" data-max="${maxDen}" aria-label="Denominador">–</button>
    </span>
  </span>`;
}

function displayNumero(id, max = 2, label = 'Respuesta') {
  return `<button type="button" class="display-num ancha vacio" data-id="${id}" data-valor="" data-max="${max}" aria-label="${label}">–</button>`;
}

function opcionesBotones(id, opciones) {
  return `<div class="opciones" data-id="${id}">
    ${opciones.map(op => `<button type="button" class="opcion" data-valor="${op.valor}">${op.texto}</button>`).join('')}
  </div>`;
}

function opcionesPrediccion(id) {
  return `<div class="opciones predict" data-id="${id}">
    <button type="button" class="opcion" data-valor="seguro">✅ Seguro</button>
    <button type="button" class="opcion" data-valor="probable">🙂 Probable</button>
    <button type="button" class="opcion" data-valor="improbable">😕 Improbable</button>
    <button type="button" class="opcion" data-valor="imposible">❌ Imposible</button>
  </div>`;
}

function selectorCoordenadas(id, letras = 'ABCDEFGH', filas = 8) {
  let btnsLetras = '';
  for (const l of letras) {
    btnsLetras += `<button type="button" class="coord-btn" data-id="${id}" data-parte="letra" data-v="${l}">${l}</button>`;
  }
  let btnsNumeros = '';
  for (let n = 1; n <= filas; n++) {
    btnsNumeros += `<button type="button" class="coord-btn" data-id="${id}" data-parte="numero" data-v="${n}">${n}</button>`;
  }
  return `<div class="coord-selector" data-id="${id}">
    <div class="coord-display vacio" id="coord-disp-${id}">–</div>
    <div class="coord-fila-label">Elige una letra:</div>
    <div class="coord-fila">${btnsLetras}</div>
    <div class="coord-fila-label">Elige un número:</div>
    <div class="coord-fila">${btnsNumeros}</div>
  </div>`;
}

// ---------- DATOS DEL EXAMEN ----------

const SECCIONES = [
  {
    id: 'fracciones',
    emoji: '🍕',
    titulo: 'Fracciones',
    descripcion: 'Mira cada dibujo y pulsa los casilleros para escribir la fracción coloreada.',
    ejercicios: [
      { id: 'f1', tipo: 'fraccion', num: 3, den: 4 },
      { id: 'f2', tipo: 'fraccion', num: 1, den: 3 },
      { id: 'f3', tipo: 'fraccion', num: 4, den: 6 },
      { id: 'f4', tipo: 'fraccion', num: 5, den: 8 },
      { id: 'f5', tipo: 'fraccion', num: 3, den: 10, color: '#fd79a8' },
    ],
  },
  {
    id: 'mixtos',
    emoji: '🥧',
    titulo: 'Números mixtos',
    descripcion: 'Cuenta las pizzas enteras y la parte coloreada de la última. Escribe el número mixto (entero y fracción).',
    ejercicios: [
      { id: 'm1', tipo: 'mixto', entero: 1, num: 1, den: 2 },
      { id: 'm2', tipo: 'mixto', entero: 2, num: 3, den: 4, color: '#a29bfe' },
      { id: 'm3', tipo: 'mixto', entero: 1, num: 2, den: 3, color: '#55efc4' },
      { id: 'm4', tipo: 'mixto', entero: 3, num: 1, den: 4, color: '#fd79a8' },
      { id: 'm5', tipo: 'mixto', entero: 2, num: 5, den: 6, color: '#74b9ff' },
    ],
  },
  {
    id: 'comparar',
    emoji: '⚖️',
    titulo: 'Comparo fracciones',
    descripcion: 'Pulsa el símbolo correcto: mayor, menor o igual.',
    ejercicios: [
      { id: 'c1', tipo: 'comparar', a: [1, 2], b: [1, 4] },
      { id: 'c2', tipo: 'comparar', a: [1, 3], b: [1, 2] },
      { id: 'c3', tipo: 'comparar', a: [3, 4], b: [2, 3] },
      { id: 'c4', tipo: 'comparar', a: [2, 7], b: [3, 5] },
      { id: 'c5', tipo: 'comparar', a: [3, 6], b: [1, 2] },
      { id: 'c6', tipo: 'comparar', a: [5, 8], b: [1, 2] },
      { id: 'c7', tipo: 'comparar', a: [2, 3], b: [6, 9] },
      { id: 'c8', tipo: 'comparar', a: [4, 8], b: [1, 2] },
    ],
  },
  {
    id: 'areas',
    emoji: '📐',
    titulo: 'Calculo áreas',
    descripcion: 'Cuenta los cuadrados de cada figura. Cada cuadradito vale 1 cm². Los medios cuadrados valen ½ cm².',
    ejercicios: [
      { id: 'a1', tipo: 'area', figura: { cols: 6, filas: 4, tipo: 'rect' }, respuesta: 24 },
      { id: 'a2', tipo: 'area', figura: { cols: 5, filas: 3, tipo: 'rect', color: '#fd9644' }, respuesta: 15 },
      { id: 'a3', tipo: 'area', figura: { cols: 4, filas: 4, tipo: 'rect', color: '#a29bfe' }, respuesta: 16 },
      { id: 'a4', tipo: 'area', figura: { cols: 8, filas: 8, tipo: 'rect-diag', color: '#55efc4' }, respuesta: 32 },
      { id: 'a5', tipo: 'area', figura: { cols: 6, filas: 5, tipo: 'L', cortarX: 4, cortarY: 2, color: '#fd79a8' }, respuesta: 26 },
      { id: 'a6', tipo: 'area', figura: { cols: 4, filas: 4, tipo: 'triangulo', color: '#ffeaa7' }, respuesta: 8 },
    ],
  },
  {
    id: 'simetria',
    emoji: '🦋',
    titulo: 'Identifico figuras simétricas',
    descripcion: 'Si la línea roja punteada divide la figura en dos mitades iguales (como un espejo), elige SÍ. Si no, elige NO.',
    ejercicios: [
      { id: 's1', tipo: 'simetria', figura: 'mariposa', mostrarEje: true, respuesta: 'si' },
      { id: 's2', tipo: 'simetria', figura: 'letraA', mostrarEje: true, respuesta: 'si' },
      { id: 's3', tipo: 'simetria', figura: 'letraP', mostrarEje: true, respuesta: 'no' },
      { id: 's4', tipo: 'simetria', figura: 'corazon', mostrarEje: true, respuesta: 'si' },
      { id: 's5', tipo: 'simetria', figura: 'irregular', mostrarEje: true, respuesta: 'no' },
      { id: 's6', tipo: 'simetria', figura: 'pezVertical', mostrarEje: true, respuesta: 'no' },
    ],
  },
  {
    id: 'probabilidad',
    emoji: '🎲',
    titulo: 'Predigo el resultado',
    descripcion: 'Mira las bolas de la bolsa y di si el suceso es seguro, probable, improbable o imposible.',
    ejercicios: [
      { id: 'p1', tipo: 'probabilidad', bolsa: [{ color: 'rojo', cantidad: 8 }], enunciado: 'Sacar una bola roja.', respuesta: 'seguro' },
      { id: 'p2', tipo: 'probabilidad', bolsa: [{ color: 'rojo', cantidad: 8 }], enunciado: 'Sacar una bola azul.', respuesta: 'imposible' },
      { id: 'p3', tipo: 'probabilidad', bolsa: [{ color: 'rojo', cantidad: 5 }, { color: 'azul', cantidad: 5 }], enunciado: 'Sacar una bola roja.', respuesta: 'probable' },
      { id: 'p4', tipo: 'probabilidad', bolsa: [{ color: 'azul', cantidad: 9 }, { color: 'rojo', cantidad: 1 }], enunciado: 'Sacar una bola roja.', respuesta: 'improbable' },
      { id: 'p5', tipo: 'probabilidad', bolsa: [{ color: 'azul', cantidad: 9 }, { color: 'rojo', cantidad: 1 }], enunciado: 'Sacar una bola azul.', respuesta: 'probable' },
      { id: 'p6', tipo: 'probabilidad', bolsa: [{ color: 'rojo', cantidad: 5 }, { color: 'azul', cantidad: 5 }], enunciado: 'Sacar una bola verde.', respuesta: 'imposible' },
    ],
  },
  {
    id: 'plano',
    emoji: '🗺️',
    titulo: 'Juego con el plano cartesiano',
    descripcion: 'Mira el tablero. Las columnas son letras (A-H) y las filas son números (1-8). Responde a cada pregunta.',
    tablero: [
      { emoji: '🚲', pos: 'C5', nombre: 'bicicleta' },
      { emoji: '✈️', pos: 'F3', nombre: 'avion' },
      { emoji: '🐟', pos: 'A7', nombre: 'pez' },
      { emoji: '⚽', pos: 'E2', nombre: 'balon' },
      { emoji: '🎯', pos: 'G6', nombre: 'diana' },
      { emoji: '🎈', pos: 'B3', nombre: 'globo' },
    ],
    ejercicios: [
      {
        id: 'pl1', tipo: 'plano-que-hay',
        enunciado: '¿Qué hay en la posición <strong>C5</strong>?',
        opciones: [
          { valor: 'bicicleta', texto: '🚲 Bicicleta' },
          { valor: 'avion', texto: '✈️ Avión' },
          { valor: 'pez', texto: '🐟 Pez' },
          { valor: 'diana', texto: '🎯 Diana' },
        ],
        respuesta: 'bicicleta',
      },
      {
        id: 'pl2', tipo: 'plano-que-hay',
        enunciado: '¿Qué hay en la posición <strong>F3</strong>?',
        opciones: [
          { valor: 'balon', texto: '⚽ Balón' },
          { valor: 'avion', texto: '✈️ Avión' },
          { valor: 'globo', texto: '🎈 Globo' },
          { valor: 'pez', texto: '🐟 Pez' },
        ],
        respuesta: 'avion',
      },
      { id: 'pl3', tipo: 'plano-posicion', enunciado: '¿En qué posición está el 🐟 pez?', respuesta: 'A7' },
      { id: 'pl4', tipo: 'plano-posicion', enunciado: '¿En qué posición está la 🎯 diana?', respuesta: 'G6' },
      { id: 'pl5', tipo: 'plano-posicion', enunciado: '¿En qué posición está el ⚽ balón?', respuesta: 'E2' },
      {
        id: 'pl6', tipo: 'plano-que-hay',
        enunciado: '¿Qué hay en la posición <strong>B3</strong>?',
        opciones: [
          { valor: 'globo', texto: '🎈 Globo' },
          { valor: 'bicicleta', texto: '🚲 Bicicleta' },
          { valor: 'pez', texto: '🐟 Pez' },
          { valor: 'avion', texto: '✈️ Avión' },
        ],
        respuesta: 'globo',
      },
    ],
  },
];

// ---------- IDENTIDAD DEL EXAMEN ----------
const EXAMEN_ID = 'examen-01-repaso-general';

// El array SECCIONES de arriba contiene los ejercicios fijos (los del libro).
// La sección de simetría se reutiliza también en modo aleatorio
// (la galería curada no se genera algorítmicamente — ver Generador).
const SECCION_SIMETRIA = SECCIONES.find(s => s.id === 'simetria');

// Si la URL pide modo aleatorio, generamos ejercicios nuevos con Generador.
// La semilla se fija en la URL la primera vez para que el examen sea
// recuperable: al volver con la misma URL, mismos ejercicios.
let SEMILLA_USADA = null;
function obtenerSeccionesBase() {
  const params = new URLSearchParams(location.search);
  if (params.get('aleatorio') === '1' || params.has('semilla')) {
    let semilla = parseInt(params.get('semilla'), 10);
    if (!semilla) {
      semilla = Date.now() % 2147483647;
      params.delete('aleatorio');
      params.set('semilla', semilla);
      history.replaceState(null, '', `?${params.toString()}`);
    }
    SEMILLA_USADA = semilla;
    return Generador.crearExamen({ semilla, simetriaCurada: SECCION_SIMETRIA });
  }
  return SECCIONES;
}

// Filtrar ejercicios si la URL trae ?repaso=id1,id2,...
function filtrarSeccionesParaRepaso(base) {
  const params = new URLSearchParams(location.search);
  const ids = (params.get('repaso') || '').split(',').filter(Boolean);
  if (!ids.length) return base;
  return base
    .map(sec => ({ ...sec, ejercicios: sec.ejercicios.filter(ej => ids.includes(ej.id)) }))
    .filter(sec => sec.ejercicios.length > 0);
}

const SECCIONES_BASE = obtenerSeccionesBase();
const SECCIONES_ACTIVAS = filtrarSeccionesParaRepaso(SECCIONES_BASE);
const MODO_REPASO = SECCIONES_ACTIVAS !== SECCIONES_BASE;
const MODO_ALEATORIO = SECCIONES_BASE !== SECCIONES;

// ---------- ESTADO ----------
const estado = {
  seccion: 0,
  respuestas: {},
  resultadoSeccion: {},
  totalCorrectas: 0,
  totalEjercicios: SECCIONES_ACTIVAS.reduce((s, sec) => s + sec.ejercicios.length, 0),
  erroresPorId: [],
  // { fracciones: { titulo, emoji, aciertos, total }, ... } para el dashboard.
  resumenPorSeccion: {},
};

// ---------- RENDER ----------

function renderPasos() {
  const cont = document.getElementById('pasos');
  cont.innerHTML = SECCIONES_ACTIVAS.map((sec, i) => {
    let clase = 'paso';
    if (i < estado.seccion) clase += ' hecho';
    if (i === estado.seccion) clase += ' actual';
    return `<div class="${clase}" data-i="${i}"><span>${sec.emoji}</span><span>${sec.titulo}</span></div>`;
  }).join('');
}

function renderSeccion() {
  const sec = SECCIONES_ACTIVAS[estado.seccion];
  document.getElementById('seccion-titulo').textContent = `${sec.emoji} ${sec.titulo}`;
  const subt = MODO_REPASO
    ? `Repaso de errores · Sección ${estado.seccion + 1} de ${SECCIONES_ACTIVAS.length}`
    : `Sección ${estado.seccion + 1} de ${SECCIONES_ACTIVAS.length}`;
  document.getElementById('seccion-subtitulo').textContent = subt;
  renderPasos();
  actualizarBarra();

  const main = document.getElementById('examen');
  let html = '';
  if (MODO_REPASO && estado.seccion === 0) {
    html += `<div class="seccion-intro" style="border-left-color:var(--rojo-osc);">
      <h2>🎯 Repaso de errores</h2>
      <p>Vamos a repetir solo los ejercicios que fallaste. ¡A por todos!</p>
    </div>`;
  }
  if (MODO_ALEATORIO && estado.seccion === 0) {
    html += `<div class="seccion-intro" style="border-left-color:var(--morado);">
      <h2>🎲 Modo aleatorio</h2>
      <p>Cada vez serán ejercicios distintos. ¡Vamos a por ello!</p>
    </div>`;
  }
  html += `<div class="seccion-intro">
    <h2>${sec.emoji} ${sec.titulo}</h2>
    <p>${sec.descripcion}</p>
  </div>`;

  if (sec.id === 'plano' && sec.tablero) {
    html += `<div class="ejercicio" style="border-left-color:var(--morado);">
      <div class="ejercicio-enunciado"><strong>📋 Tablero del juego:</strong></div>
      ${Figuras.planoCartesiano(sec.tablero)}
    </div>`;
  }

  sec.ejercicios.forEach((ej, idx) => {
    html += renderEjercicio(ej, idx + 1);
  });

  main.innerHTML = html;
  conectarEventos();

  document.getElementById('btn-comprobar').hidden = false;
  document.getElementById('btn-siguiente').hidden = true;
  document.getElementById('btn-final').hidden = true;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderEjercicio(ej, num) {
  let contenido = '';

  if (ej.tipo === 'fraccion') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.fraccionCirculo(ej.num, ej.den, ej.color || '#fd9644')}
        <div>
          <p style="margin-bottom:0.4rem;">Pulsa para escribir la fracción:</p>
          ${displayFraccion(ej.id, String(ej.num).length, String(ej.den).length)}
        </div>
      </div>`;
  } else if (ej.tipo === 'mixto') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.fraccionMixta(ej.entero, ej.num, ej.den, ej.color || '#fd9644')}
        <div>
          <p style="margin-bottom:0.4rem;">Pulsa para escribir el número mixto:</p>
          ${displayMixto(ej.id, String(ej.entero).length, String(ej.num).length, String(ej.den).length)}
        </div>
      </div>`;
  } else if (ej.tipo === 'comparar') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.fraccionTexto(ej.a[0], ej.a[1])}
        ${opcionesBotones(ej.id, [
          { valor: '<', texto: '<' },
          { valor: '=', texto: '=' },
          { valor: '>', texto: '>' },
        ])}
        ${Figuras.fraccionTexto(ej.b[0], ej.b[1])}
      </div>`;
  } else if (ej.tipo === 'area') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.areaCuadricula(ej.figura)}
        <div>
          <p style="margin-bottom:0.4rem;">Área:</p>
          ${displayNumero(ej.id, String(ej.respuesta).length, 'Área en cm²')}
          <span style="margin-left:0.4rem;font-weight:600;">cm²</span>
        </div>
      </div>`;
  } else if (ej.tipo === 'simetria') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.simetria(ej.figura, ej.mostrarEje)}
        <div>
          <p style="margin-bottom:0.4rem;">¿La línea roja es eje de simetría?</p>
          ${opcionesBotones(ej.id, [
            { valor: 'si', texto: '✓ Sí' },
            { valor: 'no', texto: '✗ No' },
          ])}
        </div>
      </div>`;
  } else if (ej.tipo === 'probabilidad') {
    contenido = `
      <div class="ejercicio-contenido">
        ${Figuras.bolsa(ej.bolsa)}
        <div style="flex:1;min-width:200px;">
          <p style="margin-bottom:0.6rem;font-size:1.05rem;"><strong>Suceso:</strong> ${ej.enunciado}</p>
          ${opcionesPrediccion(ej.id)}
        </div>
      </div>`;
  } else if (ej.tipo === 'plano-que-hay') {
    contenido = `
      <p class="ejercicio-enunciado" style="margin-bottom:0.6rem;">${ej.enunciado}</p>
      ${opcionesBotones(ej.id, ej.opciones)}`;
  } else if (ej.tipo === 'plano-posicion') {
    contenido = `
      <p class="ejercicio-enunciado" style="margin-bottom:0.6rem;">${ej.enunciado}</p>
      ${selectorCoordenadas(ej.id)}`;
  }

  return `<div class="ejercicio" data-ej="${ej.id}">
    <div class="ejercicio-enunciado">
      <span class="ejercicio-num">${num}</span>
    </div>
    ${contenido}
    <div class="feedback" id="fb-${ej.id}"></div>
  </div>`;
}

function actualizarBarra() {
  const pct = (estado.seccion / SECCIONES_ACTIVAS.length) * 100;
  document.getElementById('barra-fill').style.width = `${pct}%`;
}

// ---------- INTERACCIÓN ----------

function conectarEventos() {
  // Botones de opciones
  document.querySelectorAll('.opciones').forEach(grupo => {
    grupo.querySelectorAll('.opcion').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled || btn.classList.contains('ok') || btn.classList.contains('ko')) return;
        const id = grupo.dataset.id;
        const valor = btn.dataset.valor;
        grupo.querySelectorAll('.opcion').forEach(b => b.classList.remove('elegida'));
        btn.classList.add('elegida');
        estado.respuestas[id] = valor;
      });
    });
  });

  // Displays numéricos (abren teclado)
  document.querySelectorAll('.display-num').forEach(disp => {
    disp.addEventListener('click', () => {
      if (disp.disabled) return;
      const id = disp.dataset.id;
      const parte = disp.dataset.parte;
      Teclado.abrir(disp, {
        maxDigitos: parseInt(disp.dataset.max, 10) || 1,
        onCambio: (valor) => {
          if (parte === 'num' || parte === 'den' || parte === 'entero') {
            if (!estado.respuestas[id]) estado.respuestas[id] = {};
            estado.respuestas[id][parte] = valor;
          } else {
            estado.respuestas[id] = valor;
          }
        },
      });
    });
  });

  // Selectores de coordenadas (letra + número)
  document.querySelectorAll('.coord-selector').forEach(sel => {
    const id = sel.dataset.id;
    sel.querySelectorAll('.coord-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const parte = btn.dataset.parte;
        const v = btn.dataset.v;
        sel.querySelectorAll(`.coord-btn[data-parte="${parte}"]`).forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        if (!estado.respuestas[id]) estado.respuestas[id] = {};
        estado.respuestas[id][parte] = v;
        actualizarDisplayCoord(id);
      });
    });
  });
}

function actualizarDisplayCoord(id) {
  const r = estado.respuestas[id] || {};
  const txt = (r.letra || '') + (r.numero || '');
  const disp = document.getElementById(`coord-disp-${id}`);
  if (!disp) return;
  disp.textContent = txt || '–';
  disp.classList.toggle('vacio', !txt);
}

function comprobarSeccion() {
  const sec = SECCIONES_ACTIVAS[estado.seccion];
  let aciertos = 0;

  sec.ejercicios.forEach(ej => {
    const div = document.querySelector(`[data-ej="${ej.id}"]`);
    const fb = document.getElementById(`fb-${ej.id}`);
    let correcto = false;
    let textoCorrecto = '';

    if (ej.tipo === 'fraccion') {
      const r = estado.respuestas[ej.id] || {};
      const numOk = parseInt(r.num, 10) === ej.num;
      const denOk = parseInt(r.den, 10) === ej.den;
      correcto = numOk && denOk;
      textoCorrecto = `${ej.num}/${ej.den}`;
      const displays = div.querySelectorAll('.display-num');
      displays.forEach(d => {
        d.disabled = true;
        if (d.dataset.parte === 'num') d.classList.add(numOk ? 'ok' : 'ko');
        if (d.dataset.parte === 'den') d.classList.add(denOk ? 'ok' : 'ko');
      });
    } else if (ej.tipo === 'mixto') {
      const r = estado.respuestas[ej.id] || {};
      const entOk = parseInt(r.entero, 10) === ej.entero;
      const numOk = parseInt(r.num, 10) === ej.num;
      const denOk = parseInt(r.den, 10) === ej.den;
      correcto = entOk && numOk && denOk;
      textoCorrecto = `${ej.entero} y ${ej.num}/${ej.den}`;
      const displays = div.querySelectorAll('.display-num');
      displays.forEach(d => {
        d.disabled = true;
        if (d.dataset.parte === 'entero') d.classList.add(entOk ? 'ok' : 'ko');
        if (d.dataset.parte === 'num') d.classList.add(numOk ? 'ok' : 'ko');
        if (d.dataset.parte === 'den') d.classList.add(denOk ? 'ok' : 'ko');
      });
    } else if (ej.tipo === 'comparar') {
      const v = estado.respuestas[ej.id];
      const correcta = compararFracciones(ej.a[0], ej.a[1], ej.b[0], ej.b[1]);
      correcto = v === correcta;
      textoCorrecto = correcta;
      marcarOpciones(div, ej.id, correcta);
    } else if (ej.tipo === 'area') {
      const v = parseInt(estado.respuestas[ej.id], 10);
      correcto = v === ej.respuesta;
      textoCorrecto = `${ej.respuesta} cm²`;
      const d = div.querySelector('.display-num');
      d.disabled = true;
      d.classList.add(correcto ? 'ok' : 'ko');
    } else if (ej.tipo === 'simetria') {
      const v = estado.respuestas[ej.id];
      correcto = v === ej.respuesta;
      textoCorrecto = ej.respuesta === 'si' ? 'Sí' : 'No';
      marcarOpciones(div, ej.id, ej.respuesta);
    } else if (ej.tipo === 'probabilidad') {
      const v = estado.respuestas[ej.id];
      correcto = v === ej.respuesta;
      textoCorrecto = textoPrediccion(ej.respuesta);
      marcarOpciones(div, ej.id, ej.respuesta);
    } else if (ej.tipo === 'plano-que-hay') {
      const v = estado.respuestas[ej.id];
      correcto = v === ej.respuesta;
      const opCorrecta = ej.opciones.find(o => o.valor === ej.respuesta);
      textoCorrecto = opCorrecta ? opCorrecta.texto : ej.respuesta;
      marcarOpciones(div, ej.id, ej.respuesta);
    } else if (ej.tipo === 'plano-posicion') {
      const r = estado.respuestas[ej.id] || {};
      const v = ((r.letra || '') + (r.numero || '')).toUpperCase();
      correcto = v === ej.respuesta;
      textoCorrecto = ej.respuesta;
      const disp = document.getElementById(`coord-disp-${ej.id}`);
      if (disp) disp.classList.add(correcto ? 'ok' : 'ko');
      div.querySelectorAll('.coord-btn').forEach(b => b.disabled = true);
    }

    if (correcto) {
      aciertos++;
      div.classList.add('correcto');
      fb.classList.add('mostrar', 'ok');
      fb.innerHTML = `🎉 ¡Genial! Respuesta correcta.`;
    } else {
      div.classList.add('incorrecto');
      fb.classList.add('mostrar', 'ko');
      fb.innerHTML = `💡 La respuesta correcta es <strong>${textoCorrecto}</strong>. ¡La próxima vez seguro que aciertas!`;
      estado.erroresPorId.push(ej.id);
    }
  });

  estado.totalCorrectas += aciertos;
  estado.resultadoSeccion[sec.id] = { aciertos, total: sec.ejercicios.length };
  estado.resumenPorSeccion[sec.id] = {
    titulo: sec.titulo,
    emoji: sec.emoji,
    aciertos,
    total: sec.ejercicios.length,
  };
  document.getElementById('puntos').textContent = estado.totalCorrectas;

  document.getElementById('btn-comprobar').hidden = true;
  if (estado.seccion < SECCIONES_ACTIVAS.length - 1) {
    document.getElementById('btn-siguiente').hidden = false;
  } else {
    document.getElementById('btn-final').hidden = false;
  }

  if (aciertos === sec.ejercicios.length) Confeti.lanzar(60);

  // Resumen de sección en modal centrada (mejor que aparecer al final del scroll).
  mostrarResumenSeccion(aciertos, sec.ejercicios.length);
}

function mostrarResumenSeccion(aciertos, total) {
  const perfecto = aciertos === total;
  const ultimaSec = estado.seccion >= SECCIONES_ACTIVAS.length - 1;

  let emoji, titulo, color;
  if (perfecto) {
    emoji = '🌟'; titulo = '¡Perfecto!'; color = 'var(--verde-osc)';
  } else if (aciertos / total >= 0.5) {
    emoji = '👍'; titulo = '¡Buen trabajo!'; color = 'var(--naranja)';
  } else {
    emoji = '💪'; titulo = '¡Sigue practicando!'; color = 'var(--naranja)';
  }

  const avanzar = ultimaSec
    ? { texto: 'Ver mi resultado 🎉', clase: 'boton-final', accion: mostrarFinal }
    : { texto: 'Siguiente sección →', clase: 'boton-siguiente', accion: siguienteSeccion };

  Modal.mostrar({
    emoji,
    titulo,
    color,
    html: `<p>Has acertado <strong>${aciertos} de ${total}</strong> ejercicios en esta sección.</p>
           ${aciertos < total ? '<p>Puedes revisar tus respuestas antes de seguir.</p>' : ''}`,
    botones: [
      { texto: 'Revisar respuestas', clase: 'boton-volver' },
      avanzar,
    ],
  });
}

function marcarOpciones(div, id, valorCorrecto) {
  const grupo = div.querySelector(`.opciones[data-id="${id}"]`);
  if (!grupo) return;
  grupo.querySelectorAll('.opcion').forEach(btn => {
    btn.disabled = true;
    const v = btn.dataset.valor;
    if (v === valorCorrecto) btn.classList.add('ok', 'solucion');
    if (btn.classList.contains('elegida') && v !== valorCorrecto) btn.classList.add('ko');
  });
}

function compararFracciones(an, ad, bn, bd) {
  const a = an / ad, b = bn / bd;
  if (Math.abs(a - b) < 1e-9) return '=';
  return a < b ? '<' : '>';
}

function textoPrediccion(v) {
  return { seguro: '✅ Seguro', probable: '🙂 Probable', improbable: '😕 Improbable', imposible: '❌ Imposible' }[v];
}

function siguienteSeccion() {
  estado.seccion++;
  guardarBorrador();
  renderSeccion();
}

function mostrarFinal() {
  document.getElementById('barra-fill').style.width = '100%';
  const total = estado.totalEjercicios;
  const correctas = estado.totalCorrectas;
  const pct = Math.round((correctas / total) * 100);
  const modoActual = MODO_ALEATORIO ? 'aleatorio' : 'fijo';

  // Parar cronómetro y calcular si es récord.
  const tiempoMs = typeof Cronometro !== 'undefined' ? Cronometro.stop() : null;
  const mejorPrevio = (!MODO_REPASO && typeof Almacen !== 'undefined')
    ? Almacen.mejorTiempo(EXAMEN_ID, { modo: modoActual })
    : null;
  const esRecord = tiempoMs && correctas === total
    && (!mejorPrevio || tiempoMs < mejorPrevio.tiempoMs);

  // Guardar el intento (excepto en modo repaso, que es una sub-tirada del intento previo).
  // Modo fijo y aleatorio se guardan ambos, distinguidos por el campo `modo`.
  if (!MODO_REPASO && typeof Almacen !== 'undefined') {
    Almacen.addIntento(EXAMEN_ID, {
      correctas,
      total,
      errores: estado.erroresPorId,
      porSeccion: estado.resumenPorSeccion,
      modo: modoActual,
      tiempoMs,
    });
    descartarBorrador();
  }

  let emoji, titulo, mensaje;
  if (pct === 100) { emoji = '🏆'; titulo = '¡Increíble!'; mensaje = '¡Has acertado todas las preguntas! Eres un crack de las mates.'; }
  else if (pct >= 80) { emoji = '🌟'; titulo = '¡Muy bien!'; mensaje = '¡Genial trabajo! Has hecho un examen estupendo.'; }
  else if (pct >= 60) { emoji = '😊'; titulo = '¡Bien hecho!'; mensaje = 'Buen examen. Repasa lo que has fallado y la próxima será aún mejor.'; }
  else if (pct >= 40) { emoji = '💪'; titulo = '¡Sigue así!'; mensaje = 'Vas avanzando. Practica un poco más y verás cómo mejoras.'; }
  else { emoji = '🌱'; titulo = '¡A practicar!'; mensaje = 'Repasa con calma y vuelve a intentarlo. ¡Tú puedes!'; }

  document.getElementById('modal-emoji').textContent = emoji;
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('stat-correctas').textContent = correctas;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-porcentaje').textContent = pct + '%';

  // Tiempo + récord (solo si el cronómetro funcionó).
  const elemTiempo = document.getElementById('modal-tiempo');
  if (tiempoMs && elemTiempo) {
    const tiempoTxt = Cronometro.formato(tiempoMs);
    if (esRecord) {
      elemTiempo.classList.add('record');
      elemTiempo.innerHTML = `🚀 ¡Nuevo récord de tiempo! <strong>${tiempoTxt}</strong>`;
    } else if (mejorPrevio) {
      elemTiempo.classList.remove('record');
      elemTiempo.innerHTML = `⏱️ Has tardado <strong>${tiempoTxt}</strong>. Tu mejor: ${Cronometro.formato(mejorPrevio.tiempoMs)}`;
    } else {
      elemTiempo.classList.remove('record');
      elemTiempo.innerHTML = `⏱️ Has tardado <strong>${tiempoTxt}</strong>`;
    }
    elemTiempo.hidden = false;
  }

  // Botón de repaso de errores si hay fallos y no estamos ya repasando.
  const btnRepaso = document.getElementById('boton-repaso');
  if (btnRepaso) btnRepaso.remove();
  if (estado.erroresPorId.length > 0 && !MODO_REPASO) {
    const cont = document.querySelector('#modal-final .modal-contenido');
    const reinicio = cont.querySelector('.boton-reiniciar');
    const btn = document.createElement('button');
    btn.id = 'boton-repaso';
    btn.className = 'boton boton-siguiente';
    btn.type = 'button';
    btn.innerHTML = `Repetir solo los ${estado.erroresPorId.length} fallos 🎯`;
    btn.addEventListener('click', () => {
      location.search = '?repaso=' + estado.erroresPorId.join(',');
    });
    cont.insertBefore(btn, reinicio);
  }

  document.getElementById('modal-final').hidden = false;

  if (pct >= 80) Confeti.lanzar(180);
}

// ---------- CONFIRMACIÓN Y RESUMEN — MODAL CENTRADA ----------

function pedirConfirmacion(textoPregunta, accion) {
  Modal.mostrar({
    emoji: '🤔',
    titulo: '¿Has terminado?',
    html: `<p>${textoPregunta}</p>`,
    color: 'var(--naranja)',
    botones: [
      { texto: 'Déjame revisar', clase: 'boton-volver' },
      { texto: 'Sí, comprobar ✓', clase: 'boton-comprobar', accion },
    ],
  });
}

function enlazarBotonesPie() {
  const btnComp = document.getElementById('btn-comprobar');
  const btnSig = document.getElementById('btn-siguiente');
  const btnFin = document.getElementById('btn-final');
  if (btnComp) btnComp.addEventListener('click', () => {
    pedirConfirmacion('¿Has terminado todas las preguntas de esta sección?', comprobarSeccion);
  });
  if (btnSig) btnSig.addEventListener('click', siguienteSeccion);
  if (btnFin) btnFin.addEventListener('click', mostrarFinal);
}

// ---------- BORRADOR (continuar examen abandonado) ----------
// Identificador único del borrador: examen + modo + semilla (si aleatorio).
function claveBorrador() {
  if (MODO_ALEATORIO) return `${EXAMEN_ID}::aleatorio::${SEMILLA_USADA}`;
  return `${EXAMEN_ID}::fijo`;
}

function guardarBorrador() {
  if (MODO_REPASO || typeof Almacen === 'undefined') return;
  Almacen.setBorrador(claveBorrador(), {
    seccion: estado.seccion,
    totalCorrectas: estado.totalCorrectas,
    resultadoSeccion: estado.resultadoSeccion,
    resumenPorSeccion: estado.resumenPorSeccion,
    erroresPorId: estado.erroresPorId,
    tiempoAcumuladoMs: typeof Cronometro !== 'undefined' ? Cronometro.getMs() : 0,
  });
}

function descartarBorrador() {
  if (MODO_REPASO || typeof Almacen === 'undefined') return;
  Almacen.borrarBorrador(claveBorrador());
}

function leerBorradorPendiente() {
  if (MODO_REPASO || typeof Almacen === 'undefined') return null;
  const b = Almacen.getBorrador(claveBorrador());
  if (!b) return null;
  // Si el borrador apunta más allá del último, está obsoleto.
  if (typeof b.seccion !== 'number' || b.seccion < 1 || b.seccion >= SECCIONES_ACTIVAS.length) {
    descartarBorrador();
    return null;
  }
  return b;
}

function aplicarBorrador(b) {
  estado.seccion = b.seccion;
  estado.totalCorrectas = b.totalCorrectas || 0;
  estado.resultadoSeccion = b.resultadoSeccion || {};
  estado.resumenPorSeccion = b.resumenPorSeccion || {};
  estado.erroresPorId = b.erroresPorId || [];
  estado.tiempoAcumuladoMs = b.tiempoAcumuladoMs || 0;
  document.getElementById('puntos').textContent = estado.totalCorrectas;
}

function mostrarBannerContinuar(borrador) {
  const main = document.getElementById('examen');
  const fecha = new Date(borrador.fecha).toLocaleString('es-ES', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
  document.getElementById('seccion-titulo').textContent = `📌 Examen empezado`;
  document.getElementById('seccion-subtitulo').textContent = 'Decide cómo quieres seguir';
  main.innerHTML = `
    <div class="seccion-intro" style="border-left-color:var(--azul-osc);">
      <h2>📌 Tienes este examen empezado</h2>
      <p>Lo dejaste el <strong>${fecha}</strong>. Vas por la sección <strong>${borrador.seccion + 1} de ${SECCIONES_ACTIVAS.length}</strong> con <strong>${borrador.totalCorrectas} aciertos</strong>.</p>
      <div class="confirma-acciones" style="margin-top:1.2rem;">
        <button type="button" class="boton boton-volver" id="banner-nuevo">🔄 Empezar de nuevo</button>
        <button type="button" class="boton boton-siguiente" id="banner-continuar">Continuar →</button>
      </div>
    </div>`;
  document.querySelector('.pie').style.display = 'none';
  document.getElementById('banner-continuar').addEventListener('click', () => {
    aplicarBorrador(borrador);
    document.querySelector('.pie').style.display = '';
    iniciarCronometro(estado.tiempoAcumuladoMs || 0);
    renderSeccion();
  });
  document.getElementById('banner-nuevo').addEventListener('click', () => {
    descartarBorrador();
    document.querySelector('.pie').style.display = '';
    iniciarCronometro(0);
    renderSeccion();
  });
}

// ---------- CRONÓMETRO ----------
// Silencioso por defecto; visible en cabecera si el padre lo activó en el dashboard.
// Se persiste el acumulado en el borrador para no perder tiempo entre sesiones.
function iniciarCronometro(acumuladoMs = 0) {
  if (typeof Cronometro === 'undefined') return;
  Cronometro.start(acumuladoMs);
  const visible = (typeof Almacen !== 'undefined') && Almacen.getPrefs().cronometroVisible;
  const chip = document.getElementById('cron-chip');
  if (visible && chip) {
    chip.hidden = false;
    Cronometro.bindUI(document.getElementById('cron-tiempo'));
  }
}

// ---------- INIT ----------
function init() {
  Teclado.init();
  enlazarBotonesPie();
  const borrador = leerBorradorPendiente();
  if (borrador) {
    // Pintar primero la cabecera (pasos, barra) y luego el banner.
    renderPasos();
    actualizarBarra();
    mostrarBannerContinuar(borrador);
  } else {
    iniciarCronometro(0);
    renderSeccion();
  }
}

document.addEventListener('DOMContentLoaded', init);
