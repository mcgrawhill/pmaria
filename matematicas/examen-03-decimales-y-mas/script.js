// =====================================================
// EXAMEN 3 — Decimales, multiplicaciones y división (EMAT 3.º-4.º)
// =====================================================
// Mismo patrón que examen-01: secciones navegables, modo aleatorio
// con semilla, borrador, repaso de errores y cronómetro.

// ---------- HELPERS DE RENDER ----------

function displaySimple(id, max = 2, label = 'Respuesta') {
  return `<button type="button" class="display-num ancha vacio"
            data-id="${id}" data-valor="" data-max="${max}"
            aria-label="${label}">–</button>`;
}

// Separa una cadena "N" o "N,M" en parte entera y decimal (sin coma).
function partirNumero(s) {
  const t = String(s);
  if (t.includes(',')) {
    const [e, d] = t.split(',');
    return { ent: e, dec: d };
  }
  return { ent: t, dec: '' };
}

// Calcula la alineación visual de una operación vertical:
// devuelve cuántas columnas enteras y decimales hace falta para que
// los tres números (a, b, resultado) queden bien encolumnados.
function alinearOp(a, b, respuesta) {
  const pa = partirNumero(a);
  const pb = partirNumero(b);
  const pr = partirNumero(respuesta);
  const maxEnt = Math.max(pa.ent.length, pb.ent.length, pr.ent.length);
  const maxDec = Math.max(pa.dec.length, pb.dec.length, pr.dec.length);
  const tieneComa = maxDec > 0;
  const pad = (p) => ({
    ent: p.ent.padStart(maxEnt, ' '),
    dec: p.dec.padEnd(maxDec, ' '),
  });
  return {
    maxEnt, maxDec, tieneComa,
    a: pad(pa), b: pad(pb), r: pad(pr),
    // Total de columnas de datos (sin contar la columna de signo a la izquierda).
    cols: maxEnt + (tieneComa ? 1 : 0) + maxDec,
  };
}

// Renderiza una fila estática de un operando (texto, sin inputs).
function _filaEstatica(op, signoTxt, tieneComa) {
  let html = `<div class="op-cel signo">${signoTxt}</div>`;
  op.ent.split('').forEach(c => html += `<div class="op-cel">${c === ' ' ? '' : c}</div>`);
  if (tieneComa) html += `<div class="op-cel coma">,</div>`;
  op.dec.split('').forEach(c => html += `<div class="op-cel">${c === ' ' ? '' : c}</div>`);
  return html;
}

// Renderiza la fila del resultado con casilleros por cifra.
// Cada casillero tiene data-grupo común para encadenarlos.
function _filaResultadoCifras(ej, maxEnt, maxDec, tieneComa) {
  let html = `<div class="op-cel signo"></div>`;
  const grupo = `${ej.id}-r`;
  let idx = 0;
  for (let i = 0; i < maxEnt; i++) {
    html += `<div class="op-cel"><button type="button" class="display-num cifra vacio"
              data-id="${grupo}-${idx}" data-grupo="${grupo}" data-pos="${idx}"
              data-valor="" data-max="1" aria-label="Cifra ${idx + 1} del resultado">–</button></div>`;
    idx++;
  }
  if (tieneComa) html += `<div class="op-cel coma">,</div>`;
  for (let i = 0; i < maxDec; i++) {
    html += `<div class="op-cel"><button type="button" class="display-num cifra vacio"
              data-id="${grupo}-${idx}" data-grupo="${grupo}" data-pos="${idx}"
              data-valor="" data-max="1" aria-label="Cifra ${idx + 1} del resultado">–</button></div>`;
    idx++;
  }
  return html;
}

// Renderiza la fila de llevadas (huecos pequeños, opcionales).
// La columna más a la izquierda no tiene llevada (no hay cifra anterior).
function _filaLlevadas(ej, maxEnt, maxDec, tieneComa) {
  let html = `<div class="op-cel llev"></div>`; // columna del signo
  for (let i = 0; i < maxEnt; i++) {
    if (i === 0) {
      html += `<div class="op-cel llev"></div>`;
    } else {
      html += `<div class="op-cel llev"><button type="button" class="display-num mini vacio"
                data-id="${ej.id}-l${i}" data-valor="" data-max="1"
                aria-label="Llevada columna ${i + 1}">–</button></div>`;
    }
  }
  if (tieneComa) html += `<div class="op-cel llev"></div>`;
  for (let i = 0; i < maxDec; i++) {
    html += `<div class="op-cel llev"><button type="button" class="display-num mini vacio"
              data-id="${ej.id}-ld${i}" data-valor="" data-max="1"
              aria-label="Llevada decimal ${i + 1}">–</button></div>`;
  }
  return html;
}

// Grid de operación vertical: signo + maxEnt + (coma) + maxDec columnas
// Para mult-cifra y mult-decimal el "operando b" es una cifra, por eso pasamos
// el operando b como número simple alineado a la derecha.
function opCifrasGrid(ej, signoOp, { conLlevadas = true } = {}) {
  const al = alinearOp(ej.a, ej.b, ej.respuesta);
  const totalCols = 1 + al.cols;
  let html = `<div class="op-grid" style="grid-template-columns: repeat(${totalCols}, var(--col-w));">`;
  if (conLlevadas) html += _filaLlevadas(ej, al.maxEnt, al.maxDec, al.tieneComa);
  html += _filaEstatica(al.a, '', al.tieneComa);
  html += _filaEstatica(al.b, signoOp, al.tieneComa);
  html += `<div class="op-linea" style="grid-column: 1 / span ${totalCols};"></div>`;
  html += _filaResultadoCifras(ej, al.maxEnt, al.maxDec, al.tieneComa);
  html += `</div>`;
  return html;
}

// Renderiza una fila de casilleros para un grupo dado (parcial1, parcial2, total)
// dentro de un grid de N columnas. El número se padea por la izquierda.
function _filaCasilleros(ej, grupoSuf, numero, signoTxt, ncols) {
  const num = String(numero);
  const pad = ncols - num.length;
  const grupo = `${ej.id}-${grupoSuf}`;
  let html = `<div class="op-cel signo">${signoTxt}</div>`;
  for (let i = 0; i < pad; i++) html += `<div class="op-cel"></div>`;
  for (let i = 0; i < num.length; i++) {
    html += `<div class="op-cel"><button type="button" class="display-num cifra vacio"
              data-id="${grupo}-${i}" data-grupo="${grupo}" data-pos="${i}"
              data-valor="" data-max="1" aria-label="Cifra ${i + 1}">–</button></div>`;
  }
  return html;
}

// Multiplicación por dos cifras: parcial1, parcial2 (desplazado), suma final.
// No incluye llevadas (saturaría visualmente al haber dos productos parciales).
function mult2CifrasGrid(ej) {
  const total = String(ej.respuesta);
  const ncols = total.length; // las cajas alcanzan el ancho del total
  const totalCols = 1 + ncols;

  // Multiplicandos alineados a la derecha
  const padTexto = (txt) => {
    const pad = ncols - txt.length;
    let html = '';
    for (let i = 0; i < pad; i++) html += `<div class="op-cel"></div>`;
    txt.split('').forEach(c => html += `<div class="op-cel">${c}</div>`);
    return html;
  };

  let html = `<div class="op-grid" style="grid-template-columns: repeat(${totalCols}, var(--col-w));">`;
  // Multiplicandos
  html += `<div class="op-cel signo"></div>` + padTexto(String(ej.a));
  html += `<div class="op-cel signo">×</div>` + padTexto(String(ej.b));
  html += `<div class="op-linea" style="grid-column: 1 / span ${totalCols};"></div>`;
  // Producto parcial 1 (a × unidades(b))
  html += _filaCasilleros(ej, 'p1', ej.parcial1, '', ncols);
  // Producto parcial 2 (a × decenas(b) × 10)
  html += _filaCasilleros(ej, 'p2', ej.parcial2, '+', ncols);
  html += `<div class="op-linea" style="grid-column: 1 / span ${totalCols};"></div>`;
  // Total
  html += _filaCasilleros(ej, 't', total, '', ncols);
  html += `</div>`;
  return html;
}

function casitaDivision(dividendo, divisor, idCociente, idResto, maxCoc, maxResto) {
  return `<div class="division-cuadro">
    <span>${dividendo}</span>
    <span class="barra-div"></span>
    <span>${divisor}</span>
  </div>
  <div class="division-resp" style="margin-top:0.6rem;display:flex;flex-direction:row;gap:1rem;align-items:center;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:0.2rem;">
      <span>Cociente</span>
      ${displaySimple(idCociente, maxCoc, 'Cociente')}
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:0.2rem;">
      <span>Resto</span>
      ${displaySimple(idResto, maxResto, 'Resto')}
    </div>
  </div>`;
}

// ---------- DATOS DEL EXAMEN (ejercicios fijos del libro) ----------

const SECCIONES = [
  {
    id: 'sumas-restas-decimales',
    emoji: '➕',
    titulo: 'Sumas y restas con decimales',
    descripcion: 'Calcula las operaciones con números decimales. Pulsa el casillero y escribe el resultado (incluida la coma).',
    ejercicios: [
      { id: 'sd1', tipo: 'suma-decimal', op: '-', a: '5,62', b: '4,71', respuesta: '0,91' },
      { id: 'sd2', tipo: 'suma-decimal', op: '+', a: '3,71', b: '5,62', respuesta: '9,33' },
      { id: 'sd3', tipo: 'suma-decimal', op: '-', a: '12,13', b: '8,60', respuesta: '3,53' },
      { id: 'sd4', tipo: 'suma-decimal', op: '+', a: '5,62', b: '4,71', respuesta: '10,33' },
      { id: 'sd5', tipo: 'suma-decimal', op: '+', a: '12,10', b: '4,79', respuesta: '16,89' },
      { id: 'sd6', tipo: 'suma-decimal', op: '-', a: '2,66', b: '1,70', respuesta: '0,96' },
    ],
  },
  {
    id: 'mult-una-cifra',
    emoji: '✖️',
    titulo: 'Multiplicaciones por una cifra',
    descripcion: 'Multiplica cada número de tres cifras por la cifra indicada.',
    ejercicios: [
      { id: 'mc1', tipo: 'mult-cifra', a: 150, b: 4, respuesta: 600 },
      { id: 'mc2', tipo: 'mult-cifra', a: 379, b: 2, respuesta: 758 },
      { id: 'mc3', tipo: 'mult-cifra', a: 397, b: 8, respuesta: 3176 },
      { id: 'mc4', tipo: 'mult-cifra', a: 912, b: 4, respuesta: 3648 },
      { id: 'mc5', tipo: 'mult-cifra', a: 356, b: 6, respuesta: 2136 },
    ],
  },
  {
    id: 'mult-decimales',
    emoji: '💲',
    titulo: 'Multiplicaciones con decimales',
    descripcion: 'Multiplica el número decimal por la cifra. ¡No olvides la coma en el resultado!',
    ejercicios: [
      { id: 'md1', tipo: 'mult-decimal', a: '5,9', b: 4, respuesta: '23,6' },
      { id: 'md2', tipo: 'mult-decimal', a: '1,3', b: 8, respuesta: '10,4' },
      { id: 'md3', tipo: 'mult-decimal', a: '2,5', b: 4, respuesta: '10,0' },
      { id: 'md4', tipo: 'mult-decimal', a: '9,9', b: 6, respuesta: '59,4' },
      { id: 'md5', tipo: 'mult-decimal', a: '5,8', b: 6, respuesta: '34,8' },
    ],
  },
  {
    id: 'mult-dos-cifras',
    emoji: '🟦',
    titulo: 'Multiplicaciones por dos cifras',
    descripcion: 'Multiplica los dos números de dos cifras. Si quieres, descompón mentalmente como en clase.',
    ejercicios: [
      { id: 'm21', tipo: 'mult-dos-cifras', a: 34, b: 56 },
      { id: 'm22', tipo: 'mult-dos-cifras', a: 75, b: 12 },
      { id: 'm23', tipo: 'mult-dos-cifras', a: 12, b: 11 },
      { id: 'm24', tipo: 'mult-dos-cifras', a: 83, b: 27 },
      { id: 'm25', tipo: 'mult-dos-cifras', a: 96, b: 18 },
    ].map(ej => ({
      ...ej,
      parcial1: ej.a * (ej.b % 10),
      parcial2: ej.a * Math.floor(ej.b / 10) * 10,
      respuesta: ej.a * ej.b,
    })),
  },
  {
    id: 'combinadas',
    emoji: '🧩',
    titulo: 'Operaciones combinadas',
    descripcion: 'Recuerda: primero las multiplicaciones, después las sumas y restas.',
    ejercicios: [
      { id: 'oc1', tipo: 'combinada', enunciado: '5 + 5 × 6', respuesta: 35 },
      { id: 'oc2', tipo: 'combinada', enunciado: '3 × 3 - 2', respuesta: 7 },
      { id: 'oc3', tipo: 'combinada', enunciado: '9 - 6 × 1', respuesta: 3 },
      { id: 'oc4', tipo: 'combinada', enunciado: '10 - 4 × 2', respuesta: 2 },
      { id: 'oc5', tipo: 'combinada', enunciado: '5 × 5 + 6', respuesta: 31 },
      { id: 'oc6', tipo: 'combinada', enunciado: '4 + 5 × 2', respuesta: 14 },
    ],
  },
  {
    id: 'division-grafica',
    emoji: '📏',
    titulo: 'Divisiones con regletas',
    descripcion: 'Mira las regletas y escribe cuántas regletas del color caben en el número de arriba (cociente) y cuántas unidades sobran (resto).',
    ejercicios: [
      { id: 'dg1', tipo: 'division-grafica', dividendo: 35, divisor: 9, cociente: 3, resto: 8 },
      { id: 'dg2', tipo: 'division-grafica', dividendo: 35, divisor: 4, cociente: 8, resto: 3 },
      { id: 'dg3', tipo: 'division-grafica', dividendo: 27, divisor: 5, cociente: 5, resto: 2 },
      { id: 'dg4', tipo: 'division-grafica', dividendo: 30, divisor: 6, cociente: 5, resto: 0 },
      { id: 'dg5', tipo: 'division-grafica', dividendo: 23, divisor: 7, cociente: 3, resto: 2 },
    ],
  },
];

// ---------- IDENTIDAD DEL EXAMEN ----------
const EXAMEN_ID = 'examen-03-decimales-y-mas';

// Si la URL pide modo aleatorio, generamos ejercicios nuevos con Generador.
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
    return Generador.crearExamenDecimales({ semilla });
  }
  return SECCIONES;
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
const MODO_ALEATORIO = SECCIONES_BASE !== SECCIONES;

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

  if (ej.tipo === 'suma-decimal') {
    const signo = ej.op === '+' ? '+' : '−';
    contenido = `<div class="ejercicio-contenido">${opCifrasGrid(ej, signo)}</div>`;
  } else if (ej.tipo === 'mult-cifra' || ej.tipo === 'mult-decimal') {
    contenido = `<div class="ejercicio-contenido">${opCifrasGrid(ej, '×')}</div>`;
  } else if (ej.tipo === 'mult-dos-cifras') {
    contenido = `<div class="ejercicio-contenido">${mult2CifrasGrid(ej)}</div>`;
  } else if (ej.tipo === 'combinada') {
    contenido = `
      <div class="ejercicio-contenido">
        <div class="op-horizontal">${ej.enunciado} =</div>
        ${displaySimple(ej.id, String(ej.respuesta).length, 'Resultado')}
      </div>`;
  } else if (ej.tipo === 'division-grafica') {
    const idCoc = `${ej.id}-c`;
    const idRes = `${ej.id}-r`;
    contenido = `
      <div class="ejercicio-contenido" style="flex-direction:column;align-items:flex-start;">
        ${Figuras.regletasDivision(ej.dividendo, ej.divisor)}
        <div style="display:flex;gap:1.2rem;align-items:flex-start;flex-wrap:wrap;margin-top:0.4rem;">
          ${casitaDivision(ej.dividendo, ej.divisor, idCoc, idRes,
            String(ej.cociente).length, String(ej.divisor - 1).length)}
        </div>
      </div>`;
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
  document.querySelectorAll('.display-num').forEach(disp => {
    disp.addEventListener('click', () => {
      if (disp.disabled) return;
      const id = disp.dataset.id;
      const grupo = disp.dataset.grupo;
      const pos = parseInt(disp.dataset.pos, 10);
      Teclado.abrir(disp, {
        maxDigitos: parseInt(disp.dataset.max, 10) || 1,
        decimal: false,
        onCambio: (valor) => { estado.respuestas[id] = valor; },
        // Si pertenece a un grupo de cifras, al llenar pasa al siguiente.
        onCompleto: grupo ? () => {
          const siguiente = document.querySelector(
            `.display-num.cifra[data-grupo="${grupo}"][data-pos="${pos + 1}"]:not([disabled])`);
          if (siguiente) siguiente.click();
        } : undefined,
      });
    });
  });
}

// Devuelve el array ordenado de elementos de un grupo de cifras.
function _displaysGrupo(grupo) {
  return Array.from(document.querySelectorAll(`.display-num.cifra[data-grupo="${grupo}"]`))
    .sort((a, b) => parseInt(a.dataset.pos, 10) - parseInt(b.dataset.pos, 10));
}

// Comprueba un grupo de cifras contra el número esperado. Marca cada cifra
// individualmente (ok/ko) y deshabilita. Devuelve true si todas coinciden.
function _comprobarGrupoCifras(grupo, esperado) {
  const lista = _displaysGrupo(grupo);
  const esperadoDigitos = String(esperado).replace(',', '').split('');
  let todoOk = lista.length === esperadoDigitos.length;
  lista.forEach((d, i) => {
    const v = d.dataset.valor || '';
    const ok = v === esperadoDigitos[i];
    d.disabled = true;
    d.classList.add(ok ? 'ok' : 'ko');
    if (!ok) todoOk = false;
  });
  return todoOk;
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

    if (ej.tipo === 'suma-decimal' || ej.tipo === 'mult-cifra' || ej.tipo === 'mult-decimal') {
      correcto = _comprobarGrupoCifras(`${ej.id}-r`, ej.respuesta);
      textoCorrecto = String(ej.respuesta);
    } else if (ej.tipo === 'mult-dos-cifras') {
      // Comprobar los tres grupos (parcial1, parcial2, total) cifra a cifra.
      _comprobarGrupoCifras(`${ej.id}-p1`, ej.parcial1);
      _comprobarGrupoCifras(`${ej.id}-p2`, ej.parcial2);
      const totalOk = _comprobarGrupoCifras(`${ej.id}-t`, ej.respuesta);
      correcto = totalOk;
      textoCorrecto = `${ej.respuesta} (parciales: ${ej.parcial1} + ${ej.parcial2})`;
    } else if (ej.tipo === 'combinada') {
      const v = parseInt(estado.respuestas[ej.id], 10);
      correcto = v === ej.respuesta;
      textoCorrecto = String(ej.respuesta);
      marcarDisplay(div, ej.id, correcto);
    } else if (ej.tipo === 'division-grafica') {
      const rc = parseInt(estado.respuestas[`${ej.id}-c`], 10);
      const rr = parseInt(estado.respuestas[`${ej.id}-r`], 10);
      const cocOk = rc === ej.cociente;
      const resOk = rr === ej.resto;
      correcto = cocOk && resOk;
      textoCorrecto = `cociente ${ej.cociente}, resto ${ej.resto}`;
      const displays = div.querySelectorAll('.display-num');
      displays.forEach(d => {
        d.disabled = true;
        if (d.dataset.id === `${ej.id}-c`) d.classList.add(cocOk ? 'ok' : 'ko');
        if (d.dataset.id === `${ej.id}-r`) d.classList.add(resOk ? 'ok' : 'ko');
      });
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
  mostrarResumenSeccion(aciertos, sec.ejercicios.length);
}

function marcarDisplay(div, id, correcto) {
  const d = div.querySelector(`.display-num[data-id="${id}"]`);
  if (!d) return;
  d.disabled = true;
  d.classList.add(correcto ? 'ok' : 'ko');
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
    emoji, titulo, color,
    html: `<p>Has acertado <strong>${aciertos} de ${total}</strong> ejercicios en esta sección.</p>
           ${aciertos < total ? '<p>Puedes revisar tus respuestas antes de seguir.</p>' : ''}`,
    botones: [
      { texto: 'Revisar respuestas', clase: 'boton-volver' },
      avanzar,
    ],
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
    ? Almacen.mejorTiempo(EXAMEN_ID, { modo: modoActual })
    : null;
  const esRecord = tiempoMs && correctas === total
    && (!mejorPrevio || tiempoMs < mejorPrevio.tiempoMs);

  if (!MODO_REPASO && typeof Almacen !== 'undefined') {
    Almacen.addIntento(EXAMEN_ID, {
      correctas, total,
      errores: estado.erroresPorId,
      porSeccion: estado.resumenPorSeccion,
      modo: modoActual,
      tiempoMs,
    });
    descartarBorrador();
  }

  let emoji, titulo, mensaje;
  if (pct === 100) { emoji = '🏆'; titulo = '¡Increíble!'; mensaje = '¡Has acertado todas! Eres un crack del cálculo.'; }
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

// ---------- CONFIRMACIÓN ----------

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
  document.getElementById('seccion-titulo').textContent = '📌 Examen empezado';
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
