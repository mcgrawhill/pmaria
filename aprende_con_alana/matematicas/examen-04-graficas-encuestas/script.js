// =====================================================
// EXAMEN 4 — Gráficas de barras y encuestas (EMAT 3.º-4.º)
// =====================================================
// Cada "sección" es UNA gráfica. Genera 6 preguntas a partir de ella:
// 1) ¿Cuál es la pregunta de la encuesta? (multiple choice texto)
// 2) ¿Qué opción gusta más? (multiple choice categoría)
// 3) ¿Cuántas personas han respondido en total? (numérica)
// 4) ¿Cuántos eligieron X? (numérica — leer la barra)
// 5) ¿Cuántos más prefieren A que B? (numérica — diferencia)
// 6) Si cocinas X, ¿cuántos NO lo eligieron como favorito? (numérica — complemento)

// ---------- DATOS FIJOS (gráficas con valores predeterminados) ----------

const SECCIONES_BRUTAS = [
  {
    id: 'grafica-platos',
    emoji: '🍕',
    titulo: 'Encuesta: platos favoritos',
    descripcion: 'Mira la gráfica y responde las preguntas sobre la encuesta.',
    grafica: {
      pregunta: '¿Cuál es tu plato favorito?',
      preguntasFalsas: [
        '¿Qué comiste ayer en casa?',
        '¿Cuántos platos hay en el menú?',
        '¿A qué hora se come en tu casa?',
      ],
      unidad: 'niños', unidadCat: 'plato',
      accionNoEligen: 'cocinas',
      categorias: [
        { id: 'pizza', label: 'Pizza', emoji: '🍕', valor: 8 },
        { id: 'pasta', label: 'Pasta', emoji: '🍝', valor: 4 },
        { id: 'ensalada', label: 'Ensalada', emoji: '🥗', valor: 2 },
        { id: 'hamburguesa', label: 'Hamburguesa', emoji: '🍔', valor: 6 },
      ],
      labelEjeY: 'Niños',
    },
    refs: { leer: 'pasta', dif1: 'pizza', dif2: 'ensalada', noEligen: 'pizza' },
  },
  {
    id: 'grafica-deportes',
    emoji: '⚽',
    titulo: 'Encuesta: deportes favoritos',
    descripcion: 'Mira la gráfica y responde las preguntas sobre la encuesta.',
    grafica: {
      pregunta: '¿Cuál es tu deporte favorito?',
      preguntasFalsas: [
        '¿Cuántos deportes practicas?',
        '¿Cuándo entrenas con tu equipo?',
        '¿Qué equipo es el mejor del mundo?',
      ],
      unidad: 'niños', unidadCat: 'deporte',
      accionNoEligen: 'organizas un partido de',
      categorias: [
        { id: 'futbol', label: 'Fútbol', emoji: '⚽', valor: 7 },
        { id: 'baloncesto', label: 'Baloncesto', emoji: '🏀', valor: 5 },
        { id: 'natacion', label: 'Natación', emoji: '🏊', valor: 3 },
        { id: 'tenis', label: 'Tenis', emoji: '🎾', valor: 4 },
      ],
      labelEjeY: 'Niños',
    },
    refs: { leer: 'baloncesto', dif1: 'futbol', dif2: 'natacion', noEligen: 'futbol' },
  },
];

const EXAMEN_ID = 'examen-04-graficas-encuestas';

// ---------- EXPANSIÓN: de "sección bruta" a sección con ejercicios ----------

function expandirSeccion(sec) {
  const g = sec.grafica;
  const cats = g.categorias;
  const total = cats.reduce((s, c) => s + c.valor, 0);
  const masVotada = cats.reduce((m, c) => c.valor > m.valor ? c : m, cats[0]);
  const refLeer = cats.find(c => c.id === sec.refs.leer);
  const refDif1 = cats.find(c => c.id === sec.refs.dif1);
  const refDif2 = cats.find(c => c.id === sec.refs.dif2);
  const refNoEligen = cats.find(c => c.id === sec.refs.noEligen);

  // Barajamos las opciones de pregunta (textos) para que no siempre estén en el mismo orden
  const opcionesPreg = [g.pregunta, ...g.preguntasFalsas]
    .map((p, i) => ({ p, k: i, r: Math.sin(i + g.pregunta.length) }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.p);

  const id = sec.id;
  const ejercicios = [
    {
      id: `${id}-q1`, tipo: 'mc-texto',
      enunciado: '¿Cuál crees que es la <strong>pregunta de la encuesta</strong>?',
      opciones: opcionesPreg.map(p => ({ valor: p, texto: p })),
      respuesta: g.pregunta,
    },
    {
      id: `${id}-q2`, tipo: 'mc-cat',
      enunciado: `Según la gráfica, ¿qué <strong>${g.unidadCat}</strong> gusta más?`,
      opciones: cats.map(c => ({ valor: c.id, emoji: c.emoji, label: c.label })),
      respuesta: masVotada.id,
    },
    {
      id: `${id}-q3`, tipo: 'numerica',
      enunciado: `¿Cuántos <strong>${g.unidad}</strong> han respondido a la encuesta en total?`,
      respuesta: total,
    },
    {
      id: `${id}-q4`, tipo: 'numerica',
      enunciado: `¿Cuántos ${g.unidad} eligieron <strong>${refLeer.emoji} ${refLeer.label}</strong>?`,
      respuesta: refLeer.valor,
    },
    {
      id: `${id}-q5`, tipo: 'numerica',
      enunciado: `¿A cuántos ${g.unidad} <strong>más</strong> les gusta <strong>${refDif1.emoji} ${refDif1.label}</strong> que <strong>${refDif2.emoji} ${refDif2.label}</strong>?`,
      respuesta: refDif1.valor - refDif2.valor,
    },
    {
      id: `${id}-q6`, tipo: 'numerica',
      enunciado: `Si ${g.accionNoEligen || 'eliges'} <strong>${refNoEligen.emoji} ${refNoEligen.label}</strong>, ¿a cuántos ${g.unidad} <strong>no</strong> les es lo que más les gusta?`,
      respuesta: total - refNoEligen.valor,
    },
  ];
  return { ...sec, ejercicios };
}

// ---------- OBTENER SECCIONES SEGÚN MODO ----------

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
    return Generador.crearExamenGraficas({ semilla }).map(expandirSeccion);
  }
  return SECCIONES_BRUTAS.map(expandirSeccion);
}

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
const MODO_ALEATORIO = SEMILLA_USADA !== null;

// ---------- ESTADO ----------
const estado = {
  seccion: 0,
  respuestas: {},
  resultadoSeccion: {},
  totalCorrectas: 0,
  totalEjercicios: SECCIONES_ACTIVAS.reduce((s, sec) => s + sec.ejercicios.length, 0),
  erroresPorId: [],
  resumenPorSeccion: {},
  tiempoAcumuladoMs: 0,
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
    ? `Repaso de errores · Gráfica ${estado.seccion + 1} de ${SECCIONES_ACTIVAS.length}`
    : `Gráfica ${estado.seccion + 1} de ${SECCIONES_ACTIVAS.length}`;
  document.getElementById('seccion-subtitulo').textContent = subt;
  renderPasos();
  actualizarBarra();

  const main = document.getElementById('examen');
  let html = '';
  if (MODO_REPASO && estado.seccion === 0) {
    html += `<div class="seccion-intro" style="border-left-color:var(--rojo-osc);">
      <h2>🎯 Repaso de errores</h2>
      <p>Vamos a repetir solo las preguntas que fallaste.</p>
    </div>`;
  }
  if (MODO_ALEATORIO && estado.seccion === 0) {
    html += `<div class="seccion-intro" style="border-left-color:var(--morado);">
      <h2>🎲 Modo aleatorio</h2>
      <p>Cada vez los valores y categorías serán distintos.</p>
    </div>`;
  }
  html += `<div class="seccion-intro">
    <h2>${sec.emoji} ${sec.titulo}</h2>
    <p>${sec.descripcion}</p>
  </div>`;

  // La gráfica solo se renderiza si el ejercicio no es de tipo MC-texto sobre la pregunta de la encuesta.
  // Actually la gráfica siempre se renderiza, porque las preguntas todas dependen de ella.
  // Excepción: la primera (cuál es la pregunta de la encuesta) — el niño debe DEDUCIR la pregunta
  // a partir de las categorías del eje X. Para mantener simple, mostramos la gráfica siempre.
  if (!MODO_REPASO && sec.grafica) {
    html += `<div class="ejercicio">${Figuras.graficaBarras(sec.grafica.categorias, { maxValor: 10, labelEjeY: sec.grafica.labelEjeY })}</div>`;
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
  if (ej.tipo === 'mc-texto') {
    contenido = `
      <p class="ejercicio-enunciado">${ej.enunciado}</p>
      <div class="opciones-texto" data-id="${ej.id}">
        ${ej.opciones.map(op => `<button type="button" class="opcion-texto" data-valor="${escapeHtml(op.valor)}">${op.texto}</button>`).join('')}
      </div>`;
  } else if (ej.tipo === 'mc-cat') {
    contenido = `
      <p class="ejercicio-enunciado">${ej.enunciado}</p>
      <div class="opciones-cat" data-id="${ej.id}">
        ${ej.opciones.map(op => `<button type="button" class="opcion-cat" data-valor="${op.valor}"><span class="emoji">${op.emoji}</span>${op.label}</button>`).join('')}
      </div>`;
  } else if (ej.tipo === 'numerica') {
    const max = String(ej.respuesta).length;
    contenido = `
      <div class="preg-numerica">
        <p class="preg-label">${ej.enunciado}</p>
        <button type="button" class="display-num ancha vacio"
          data-id="${ej.id}" data-valor="" data-max="${max}"
          aria-label="Respuesta numérica">–</button>
      </div>`;
  }
  return `<div class="ejercicio" data-ej="${ej.id}">
    <div class="ejercicio-enunciado"><span class="ejercicio-num">${num}</span></div>
    ${contenido}
    <div class="feedback" id="fb-${ej.id}"></div>
  </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function actualizarBarra() {
  const pct = (estado.seccion / SECCIONES_ACTIVAS.length) * 100;
  document.getElementById('barra-fill').style.width = `${pct}%`;
}

// ---------- INTERACCIÓN ----------

function conectarEventos() {
  // Multiple choice texto
  document.querySelectorAll('.opciones-texto').forEach(grupo => {
    const id = grupo.dataset.id;
    grupo.querySelectorAll('.opcion-texto').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        grupo.querySelectorAll('.opcion-texto').forEach(b => b.classList.remove('elegida'));
        btn.classList.add('elegida');
        estado.respuestas[id] = btn.dataset.valor;
      });
    });
  });
  // Multiple choice categoría
  document.querySelectorAll('.opciones-cat').forEach(grupo => {
    const id = grupo.dataset.id;
    grupo.querySelectorAll('.opcion-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        grupo.querySelectorAll('.opcion-cat').forEach(b => b.classList.remove('elegida'));
        btn.classList.add('elegida');
        estado.respuestas[id] = btn.dataset.valor;
      });
    });
  });
  // Numérica (teclado modal)
  document.querySelectorAll('.display-num').forEach(disp => {
    disp.addEventListener('click', () => {
      if (disp.disabled) return;
      const id = disp.dataset.id;
      Teclado.abrir(disp, {
        maxDigitos: parseInt(disp.dataset.max, 10) || 2,
        onCambio: (valor) => { estado.respuestas[id] = valor; },
      });
    });
  });
}

// ---------- COMPROBACIÓN ----------

function comprobarSeccion() {
  const sec = SECCIONES_ACTIVAS[estado.seccion];
  let aciertos = 0;

  sec.ejercicios.forEach(ej => {
    const div = document.querySelector(`[data-ej="${ej.id}"]`);
    const fb = document.getElementById(`fb-${ej.id}`);
    let correcto = false;
    let textoCorrecto = '';

    if (ej.tipo === 'mc-texto') {
      const v = estado.respuestas[ej.id];
      correcto = v === ej.respuesta;
      textoCorrecto = ej.respuesta;
      marcarOpcionesTexto(div, ej);
    } else if (ej.tipo === 'mc-cat') {
      const v = estado.respuestas[ej.id];
      correcto = v === ej.respuesta;
      const opC = ej.opciones.find(o => o.valor === ej.respuesta);
      textoCorrecto = opC ? `${opC.emoji} ${opC.label}` : ej.respuesta;
      marcarOpcionesCat(div, ej);
    } else if (ej.tipo === 'numerica') {
      const v = parseInt(estado.respuestas[ej.id], 10);
      correcto = v === ej.respuesta;
      textoCorrecto = String(ej.respuesta);
      const d = div.querySelector('.display-num');
      d.disabled = true;
      d.classList.add(correcto ? 'ok' : 'ko');
    }

    if (correcto) {
      aciertos++;
      div.classList.add('correcto');
      fb.classList.add('mostrar', 'ok');
      fb.innerHTML = `🎉 ¡Correcto!`;
    } else {
      div.classList.add('incorrecto');
      fb.classList.add('mostrar', 'ko');
      fb.innerHTML = `💡 La respuesta correcta es <strong>${textoCorrecto}</strong>.`;
      estado.erroresPorId.push(ej.id);
    }
  });

  estado.totalCorrectas += aciertos;
  estado.resultadoSeccion[sec.id] = { aciertos, total: sec.ejercicios.length };
  estado.resumenPorSeccion[sec.id] = {
    titulo: sec.titulo, emoji: sec.emoji,
    aciertos, total: sec.ejercicios.length,
  };
  document.getElementById('puntos').textContent = estado.totalCorrectas;

  document.getElementById('btn-comprobar').hidden = true;
  if (estado.seccion < SECCIONES_ACTIVAS.length - 1) {
    document.getElementById('btn-siguiente').hidden = false;
  } else {
    document.getElementById('btn-final').hidden = false;
  }

  if (aciertos === sec.ejercicios.length) Confeti.lanzar(60);
  mostrarResumenSeccion(aciertos, sec.ejercicios.length);
}

function marcarOpcionesTexto(div, ej) {
  div.querySelectorAll('.opcion-texto').forEach(btn => {
    btn.disabled = true;
    const v = btn.dataset.valor;
    if (v === ej.respuesta) btn.classList.add('ok', 'solucion');
    if (btn.classList.contains('elegida') && v !== ej.respuesta) btn.classList.add('ko');
  });
}
function marcarOpcionesCat(div, ej) {
  div.querySelectorAll('.opcion-cat').forEach(btn => {
    btn.disabled = true;
    const v = btn.dataset.valor;
    if (v === ej.respuesta) btn.classList.add('ok', 'solucion');
    if (btn.classList.contains('elegida') && v !== ej.respuesta) btn.classList.add('ko');
  });
}

function mostrarResumenSeccion(aciertos, total) {
  const perfecto = aciertos === total;
  const ultimaSec = estado.seccion >= SECCIONES_ACTIVAS.length - 1;
  let emoji, titulo, color;
  if (perfecto) { emoji = '🌟'; titulo = '¡Perfecto!'; color = 'var(--verde-osc)'; }
  else if (aciertos / total >= 0.5) { emoji = '👍'; titulo = '¡Buen trabajo!'; color = 'var(--naranja)'; }
  else { emoji = '💪'; titulo = '¡Sigue practicando!'; color = 'var(--naranja)'; }

  const avanzar = ultimaSec
    ? { texto: 'Ver mi resultado 🎉', clase: 'boton-final', accion: mostrarFinal }
    : { texto: 'Siguiente gráfica →', clase: 'boton-siguiente', accion: siguienteSeccion };

  Modal.mostrar({
    emoji, titulo, color,
    html: `<p>Has acertado <strong>${aciertos} de ${total}</strong> preguntas en esta gráfica.</p>`,
    botones: [{ texto: 'Revisar respuestas', clase: 'boton-volver' }, avanzar],
  });
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

  const tiempoMs = typeof Cronometro !== 'undefined' ? Cronometro.stop() : null;
  const mejorPrevio = (!MODO_REPASO && typeof Almacen !== 'undefined')
    ? Almacen.mejorTiempo(EXAMEN_ID, { modo: modoActual }) : null;
  const esRecord = tiempoMs && correctas === total
    && (!mejorPrevio || tiempoMs < mejorPrevio.tiempoMs);

  if (!MODO_REPASO && typeof Almacen !== 'undefined') {
    Almacen.addIntento(EXAMEN_ID, {
      correctas, total,
      errores: estado.erroresPorId,
      porSeccion: estado.resumenPorSeccion,
      modo: modoActual, tiempoMs,
    });
    descartarBorrador();
  }

  let emoji, titulo, mensaje;
  if (pct === 100) { emoji = '🏆'; titulo = '¡Increíble!'; mensaje = '¡Has acertado todas! Sabes leer gráficas como un profesional.'; }
  else if (pct >= 80) { emoji = '🌟'; titulo = '¡Muy bien!'; mensaje = '¡Genial! Has interpretado bien la mayoría de las gráficas.'; }
  else if (pct >= 60) { emoji = '😊'; titulo = '¡Bien hecho!'; mensaje = 'Buen examen. Repasa lo que has fallado y la próxima irá aún mejor.'; }
  else if (pct >= 40) { emoji = '💪'; titulo = '¡Sigue así!'; mensaje = 'Vas avanzando. Practica un poco más con las gráficas.'; }
  else { emoji = '🌱'; titulo = '¡A practicar!'; mensaje = 'Repasa con calma y vuelve a intentarlo. ¡Tú puedes!'; }

  document.getElementById('modal-emoji').textContent = emoji;
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('stat-correctas').textContent = correctas;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-porcentaje').textContent = pct + '%';

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
    pedirConfirmacion('¿Has terminado todas las preguntas de esta gráfica?', comprobarSeccion);
  });
  if (btnSig) btnSig.addEventListener('click', siguienteSeccion);
  if (btnFin) btnFin.addEventListener('click', mostrarFinal);
}

// ---------- BORRADOR ----------

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
  if (typeof b.seccion !== 'number' || b.seccion < 1 || b.seccion >= SECCIONES_ACTIVAS.length) {
    descartarBorrador(); return null;
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
  document.getElementById('seccion-titulo').textContent = '📌 Examen empezado';
  document.getElementById('seccion-subtitulo').textContent = 'Decide cómo quieres seguir';
  main.innerHTML = `
    <div class="seccion-intro" style="border-left-color:var(--azul-osc);">
      <h2>📌 Tienes este examen empezado</h2>
      <p>Lo dejaste el <strong>${fecha}</strong>. Vas por la gráfica <strong>${borrador.seccion + 1} de ${SECCIONES_ACTIVAS.length}</strong> con <strong>${borrador.totalCorrectas} aciertos</strong>.</p>
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
    renderPasos();
    actualizarBarra();
    mostrarBannerContinuar(borrador);
  } else {
    iniciarCronometro(0);
    renderSeccion();
  }
}

document.addEventListener('DOMContentLoaded', init);
