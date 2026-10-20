// =====================================================
// NATURAL SCIENCE — UNIT 1: THE HUMAN BODY
// =====================================================
// Adaptación interactiva del examen de clase (11 ejercicios) repartida en
// 5 bloques cortos. Todo el texto va en inglés, como el examen real.
//
// Los ejercicios de respuesta libre del original se han convertido en
// ejercicios autocorregibles:
//   · "Correct the false sentences" → elegir la corrección buena.
//   · "Write two ways to improve your digestion" → elegir dos hábitos.
//
// Mecanismos de interacción (4):
//   ranuras → etiquetar diagramas, huecos, ordenar, emparejar, clasificar
//   tf      → verdadero / falso
//   mc      → una opción correcta
//   multi   → varias opciones correctas

const EXAMEN_ID = 'natural-science-01-human-body';

// ---------- BANCOS DE PALABRAS ----------

const B = {
  funciones: ['nutrition', 'interaction', 'reproduction'],
  nutricion: ['digestion', 'excretion', 'respiration'],
  respiratorio: ['nose', 'mouth', 'trachea', 'bronchi', 'lungs', 'diaphragm', 'alveoli'],
  digestivo: ['mouth', 'oesophagus', 'stomach', 'small intestine', 'large intestine', 'anus'],
  digestion: ['mouth', 'oesophagus', 'stomach', 'small intestine', 'large intestine', 'anus', 'nutrients'],
  excretor: ['kidney', 'ureter', 'bladder', 'urethra'],
  masculino: ['penis', 'testicles', 'urethra'],
  femenino: ['ovary', 'Fallopian tubes', 'uterus', 'vagina', 'vulva'],
  orden: ['1', '2', '3', '4'],
  letras: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
  sistemas: ['R', 'D', 'E', 'Rep'],
  gases: ['oxygen', 'carbon dioxide', 'nitrogen', 'water'],
  celulas: ['male', 'female', 'baby', 'plant'],
};

const banco = (lista) => lista.map(v => ({ valor: v, texto: v }));

// ---------- SECCIONES ----------

const SECCIONES = [
  {
    id: 'life-and-breathing',
    emoji: '🫁',
    titulo: 'Life functions & breathing',
    descripcion: 'The three life functions and how the respiratory system works.',
    ejercicios: [
      {
        id: 'q1', tipo: 'ranuras', presentacion: 'texto',
        enunciado: '<strong>1. Life functions.</strong> Complete the sentences.',
        bancos: { funciones: banco(B.funciones), nutricion: banco(B.nutricion) },
        // Cada grupo se corrige como conjunto: el orden no importa.
        conjuntos: { funciones: B.funciones, nutricion: B.nutricion },
        plantilla: `<p class="texto-hueco">The human body performs three life functions:
          {{f1}}, {{f2}} and {{f3}}.</p>
          <p class="texto-hueco">The function of nutrition includes {{n1}}, {{n2}},
          {{n3}} and circulation.</p>`,
        items: [
          { id: 'f1', grupo: 'funciones' }, { id: 'f2', grupo: 'funciones' }, { id: 'f3', grupo: 'funciones' },
          { id: 'n1', grupo: 'nutricion' }, { id: 'n2', grupo: 'nutricion' }, { id: 'n3', grupo: 'nutricion' },
        ],
      },
      {
        id: 'q2', tipo: 'ranuras', presentacion: 'diagrama',
        enunciado: '<strong>2. Respiratory system.</strong> Label the diagram.',
        diagrama: 'respiratorio',
        bancos: { respiratorio: banco(B.respiratorio) },
        items: [
          { id: 'r1', etiqueta: '1', grupo: 'respiratorio', respuesta: 'nose' },
          { id: 'r2', etiqueta: '2', grupo: 'respiratorio', respuesta: 'mouth' },
          { id: 'r3', etiqueta: '3', grupo: 'respiratorio', respuesta: 'trachea' },
          { id: 'r4', etiqueta: '4', grupo: 'respiratorio', respuesta: 'bronchi' },
          { id: 'r5', etiqueta: '5', grupo: 'respiratorio', respuesta: 'lungs' },
          { id: 'r6', etiqueta: '6', grupo: 'respiratorio', respuesta: 'diaphragm' },
          { id: 'r7', etiqueta: '7', grupo: 'respiratorio', respuesta: 'alveoli' },
        ],
      },
      {
        id: 'q3', tipo: 'ranuras', presentacion: 'orden',
        enunciado: '<strong>3. Breathing.</strong> Put the steps in order (1–4).',
        bancos: { orden: banco(B.orden) },
        items: [
          { id: 'o1', grupo: 'orden', respuesta: '3', etiqueta: 'The air inside the lungs goes into small air sacs, called <strong>alveoli</strong>.' },
          { id: 'o2', grupo: 'orden', respuesta: '1', etiqueta: 'We breathe in air through our <strong>nose</strong> and <strong>mouth</strong>.' },
          { id: 'o3', grupo: 'orden', respuesta: '4', etiqueta: 'The alveoli transfer <strong>oxygen</strong> into the blood. We breathe out <strong>carbon dioxide</strong>.' },
          { id: 'o4', grupo: 'orden', respuesta: '2', etiqueta: 'The air travels down the <strong>trachea</strong> and into the <strong>bronchi</strong>. They take air into our lungs.' },
        ],
      },
    ],
  },

  {
    id: 'digestion',
    emoji: '🍎',
    titulo: 'Digestive system',
    descripcion: 'Label the digestive system and follow the journey of the food.',
    ejercicios: [
      {
        id: 'q4', tipo: 'ranuras', presentacion: 'diagrama',
        enunciado: '<strong>4. Digestive system.</strong> Label the diagram.',
        diagrama: 'digestivo',
        bancos: { digestivo: banco(B.digestivo) },
        items: [
          { id: 'd1', etiqueta: '1', grupo: 'digestivo', respuesta: 'mouth' },
          { id: 'd2', etiqueta: '2', grupo: 'digestivo', respuesta: 'oesophagus' },
          { id: 'd3', etiqueta: '3', grupo: 'digestivo', respuesta: 'stomach' },
          { id: 'd4', etiqueta: '4', grupo: 'digestivo', respuesta: 'small intestine' },
          { id: 'd5', etiqueta: '5', grupo: 'digestivo', respuesta: 'large intestine' },
          { id: 'd6', etiqueta: '6', grupo: 'digestivo', respuesta: 'anus' },
        ],
      },
      {
        id: 'q5', tipo: 'ranuras', presentacion: 'texto',
        enunciado: '<strong>5. Digestion.</strong> Complete the text.',
        bancos: { digestion: banco(B.digestion) },
        plantilla: `<p class="texto-hueco">Our digestive system helps our body absorb {{g1}}
          from the food we eat. Digestion begins in the {{g2}}. Food travels down the
          {{g3}} into our {{g4}}. The {{g5}} separates the nutrients from the waste.
          The waste passes into the {{g6}} and leaves our body through the {{g7}}.</p>`,
        items: [
          { id: 'g1', grupo: 'digestion', respuesta: 'nutrients' },
          { id: 'g2', grupo: 'digestion', respuesta: 'mouth' },
          { id: 'g3', grupo: 'digestion', respuesta: 'oesophagus' },
          { id: 'g4', grupo: 'digestion', respuesta: 'stomach' },
          { id: 'g5', grupo: 'digestion', respuesta: 'small intestine' },
          { id: 'g6', grupo: 'digestion', respuesta: 'large intestine' },
          { id: 'g7', grupo: 'digestion', respuesta: 'anus' },
        ],
      },
    ],
  },

  {
    id: 'excretion',
    emoji: '💧',
    titulo: 'Excretory system',
    descripcion: 'Label the excretory system and decide what is true.',
    ejercicios: [
      {
        id: 'q6', tipo: 'ranuras', presentacion: 'diagrama',
        enunciado: '<strong>6. Excretory system.</strong> Label the diagram.',
        diagrama: 'excretor',
        bancos: { excretor: banco(B.excretor) },
        items: [
          { id: 'e1', etiqueta: '1', grupo: 'excretor', respuesta: 'kidney' },
          { id: 'e2', etiqueta: '2', grupo: 'excretor', respuesta: 'ureter' },
          { id: 'e3', etiqueta: '3', grupo: 'excretor', respuesta: 'bladder' },
          { id: 'e4', etiqueta: '4', grupo: 'excretor', respuesta: 'urethra' },
        ],
      },
      {
        id: 'q7', tipo: 'tf',
        enunciado: '<strong>7. True or False?</strong> Tap T or F.',
        items: [
          { id: 't1', texto: 'The excretory system eliminates waste from our body.', respuesta: 'T' },
          { id: 't2', texto: 'The kidneys make urine by filtering the blood.', respuesta: 'T' },
          { id: 't3', texto: 'The urethra carries urine from the kidneys to the bladder.', respuesta: 'F' },
          { id: 't4', texto: 'We have only one kidney.', respuesta: 'F' },
          { id: 't5', texto: 'Urine leaves the bladder through the urethra.', respuesta: 'T' },
          { id: 't6', texto: 'Our body also eliminates waste through our skin. It is called sweat.', respuesta: 'T' },
        ],
      },
      {
        id: 'q7b', tipo: 'mc',
        enunciado: '<strong>7b. Corrections.</strong> Choose the right correction for the false sentences.',
        items: [
          {
            id: 'c1', texto: '“The urethra carries urine from the kidneys to the bladder.”',
            opciones: [
              'The <strong>ureters</strong> carry urine from the kidneys to the bladder.',
              'The <strong>kidneys</strong> carry urine from the bladder to the ureters.',
              'The <strong>bladder</strong> carries urine from the urethra to the kidneys.',
            ],
            respuesta: 0,
          },
          {
            id: 'c2', texto: '“We have only one kidney.”',
            opciones: [
              'We have <strong>three</strong> kidneys.',
              'We have <strong>two</strong> kidneys.',
              'We have <strong>no</strong> kidneys.',
            ],
            respuesta: 1,
          },
        ],
      },
    ],
  },

  {
    id: 'reproduction',
    emoji: '👪',
    titulo: 'Reproductive systems',
    descripcion: 'Label both systems and match each organ with its function.',
    ejercicios: [
      {
        id: 'q8a', tipo: 'ranuras', presentacion: 'diagrama',
        enunciado: '<strong>8a. Male reproductive system.</strong> Label the diagram.',
        diagrama: 'reproductorMasculino',
        bancos: { masculino: banco(B.masculino) },
        items: [
          { id: 'm1', etiqueta: '1', grupo: 'masculino', respuesta: 'penis' },
          { id: 'm2', etiqueta: '2', grupo: 'masculino', respuesta: 'testicles' },
          { id: 'm3', etiqueta: '3', grupo: 'masculino', respuesta: 'urethra' },
        ],
      },
      {
        id: 'q8b', tipo: 'ranuras', presentacion: 'diagrama',
        enunciado: '<strong>8b. Female reproductive system.</strong> Label the diagram.',
        diagrama: 'reproductorFemenino',
        bancos: { femenino: banco(B.femenino) },
        items: [
          { id: 'w1', etiqueta: '1', grupo: 'femenino', respuesta: 'ovary' },
          { id: 'w2', etiqueta: '2', grupo: 'femenino', respuesta: 'Fallopian tubes' },
          { id: 'w3', etiqueta: '3', grupo: 'femenino', respuesta: 'uterus' },
          { id: 'w4', etiqueta: '4', grupo: 'femenino', respuesta: 'vagina' },
          { id: 'w5', etiqueta: '5', grupo: 'femenino', respuesta: 'vulva' },
        ],
      },
      {
        id: 'q9', tipo: 'ranuras', presentacion: 'filas',
        enunciado: '<strong>9. Match each organ with its function.</strong> Write the letter.',
        leyenda: `<ul class="leyenda">
          <li><strong>a)</strong> It protects the female reproductive organs.</li>
          <li><strong>b)</strong> They connect the ovaries to the uterus.</li>
          <li><strong>c)</strong> They produce the male cells.</li>
          <li><strong>d)</strong> It connects the uterus to the outside of the body.</li>
          <li><strong>e)</strong> Male cells and urine travel through it to the outside.</li>
          <li><strong>f)</strong> This is where the baby grows during pregnancy.</li>
          <li><strong>g)</strong> The main female reproductive organ.</li>
        </ul>`,
        bancos: { letras: banco(B.letras) },
        items: [
          { id: 'y1', etiqueta: 'Testicles', grupo: 'letras', respuesta: 'c' },
          { id: 'y2', etiqueta: 'Ovary', grupo: 'letras', respuesta: 'g' },
          { id: 'y3', etiqueta: 'Fallopian tubes', grupo: 'letras', respuesta: 'b' },
          { id: 'y4', etiqueta: 'Uterus', grupo: 'letras', respuesta: 'f' },
          { id: 'y5', etiqueta: 'Vagina', grupo: 'letras', respuesta: 'd' },
          { id: 'y6', etiqueta: 'Vulva', grupo: 'letras', respuesta: 'a' },
          { id: 'y7', etiqueta: 'Urethra (male)', grupo: 'letras', respuesta: 'e' },
        ],
      },
    ],
  },

  {
    id: 'review',
    emoji: '🧠',
    titulo: 'Final review',
    descripcion: 'Put everything together.',
    ejercicios: [
      {
        id: 'q10', tipo: 'ranuras', presentacion: 'filas',
        enunciado: '<strong>10. Which system does each organ belong to?</strong>',
        leyenda: `<p class="leyenda-linea"><strong>R</strong> = respiratory ·
          <strong>D</strong> = digestive · <strong>E</strong> = excretory ·
          <strong>Rep</strong> = reproductive</p>`,
        bancos: { sistemas: banco(B.sistemas) },
        // Aquí sí se puede repetir valor: varios órganos comparten sistema.
        repetible: true,
        items: [
          { id: 's1', etiqueta: 'lungs', grupo: 'sistemas', respuesta: 'R' },
          { id: 's2', etiqueta: 'kidney', grupo: 'sistemas', respuesta: 'E' },
          { id: 's3', etiqueta: 'stomach', grupo: 'sistemas', respuesta: 'D' },
          { id: 's4', etiqueta: 'ovary', grupo: 'sistemas', respuesta: 'Rep' },
          { id: 's5', etiqueta: 'trachea', grupo: 'sistemas', respuesta: 'R' },
          { id: 's6', etiqueta: 'bladder', grupo: 'sistemas', respuesta: 'E' },
        ],
      },
      {
        id: 'q11a', tipo: 'ranuras', presentacion: 'texto',
        enunciado: '<strong>11a. Gases.</strong> Complete the sentence.',
        bancos: { gases: banco(B.gases) },
        plantilla: `<p class="texto-hueco">We breathe in {{h1}} and we breathe out {{h2}}.</p>`,
        items: [
          { id: 'h1', grupo: 'gases', respuesta: 'oxygen' },
          { id: 'h2', grupo: 'gases', respuesta: 'carbon dioxide' },
        ],
      },
      {
        id: 'q11b', tipo: 'multi',
        enunciado: '<strong>11b. Digestion habits.</strong> Choose the <strong>TWO</strong> habits that help your digestion.',
        opciones: [
          'Eat foods rich in fibre, like fruit and vegetables.',
          'Drink lots of fizzy drinks.',
          'Drink plenty of water.',
          'Eat sweets every day.',
        ],
        respuestas: [0, 2],
      },
      {
        id: 'q11c', tipo: 'ranuras', presentacion: 'texto',
        enunciado: '<strong>11c. Reproduction.</strong> Complete the sentence.',
        bancos: { celulas: banco(B.celulas) },
        conjuntos: { celulas: ['male', 'female'] },
        plantilla: `<p class="texto-hueco">Reproduction occurs when {{k1}} and {{k2}} cells
          combine and make one cell.</p>`,
        items: [
          { id: 'k1', grupo: 'celulas' },
          { id: 'k2', grupo: 'celulas' },
        ],
      },
    ],
  },
];

// ---------- MODO REPASO ----------

function filtrarParaRepaso(base) {
  const ids = (new URLSearchParams(location.search).get('repaso') || '').split(',').filter(Boolean);
  if (!ids.length) return base;
  return base
    .map(sec => ({ ...sec, ejercicios: sec.ejercicios.filter(ej => ids.includes(ej.id)) }))
    .filter(sec => sec.ejercicios.length > 0);
}

const SECCIONES_ACTIVAS = filtrarParaRepaso(SECCIONES);
const MODO_REPASO = SECCIONES_ACTIVAS.length !== SECCIONES.length
  || SECCIONES_ACTIVAS.some((s, i) => s.ejercicios.length !== SECCIONES[i].ejercicios.length);

// Cada "ítem" puntúa por separado: así el marcador refleja el esfuerzo real.
function contarItems(secs) {
  return secs.reduce((t, sec) => t + sec.ejercicios.reduce((s, ej) => s + numItems(ej), 0), 0);
}
function numItems(ej) {
  if (ej.tipo === 'multi') return 1;
  return (ej.items || []).length;
}

const estado = {
  seccion: 0,
  respuestas: {},
  totalCorrectas: 0,
  totalItems: contarItems(SECCIONES_ACTIVAS),
  erroresPorId: [],
  resumenPorSeccion: {},
  tiempoAcumuladoMs: 0,
};

// ---------- RENDER ----------

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderPasos() {
  document.getElementById('pasos').innerHTML = SECCIONES_ACTIVAS.map((sec, i) => {
    let clase = 'paso';
    if (i < estado.seccion) clase += ' hecho';
    if (i === estado.seccion) clase += ' actual';
    return `<div class="${clase}"><span>${sec.emoji}</span><span>${sec.titulo}</span></div>`;
  }).join('');
}

function renderEjercicio(ej) {
  let cuerpo = '';

  if (ej.tipo === 'ranuras') {
    if (ej.presentacion === 'diagrama') {
      cuerpo += `<div class="diagrama-wrap">${Anatomia.render(ej.diagrama)}</div>`;
      cuerpo += `<div class="slots">` + ej.items.map(it =>
        `<div class="slot"><span class="slot-num">${it.etiqueta}</span>
           ${Ranuras.render(it.id, it.grupo, 'tap to choose')}</div>`).join('') + `</div>`;
    } else if (ej.presentacion === 'texto') {
      let html = ej.plantilla;
      ej.items.forEach(it => {
        html = html.replace(`{{${it.id}}}`, Ranuras.render(it.id, it.grupo, '______', 'inline'));
      });
      cuerpo += html;
    } else if (ej.presentacion === 'orden') {
      cuerpo += `<div class="filas">` + ej.items.map(it =>
        `<div class="fila-orden">${Ranuras.render(it.id, it.grupo, '?', 'corta')}
           <span class="fila-texto">${it.etiqueta}</span></div>`).join('') + `</div>`;
    } else if (ej.presentacion === 'filas') {
      if (ej.leyenda) cuerpo += ej.leyenda;
      cuerpo += `<div class="filas">` + ej.items.map(it =>
        `<div class="fila-match"><span class="fila-texto">${it.etiqueta}</span>
           ${Ranuras.render(it.id, it.grupo, '?', 'corta')}</div>`).join('') + `</div>`;
    }
  } else if (ej.tipo === 'tf') {
    cuerpo += `<div class="filas">` + ej.items.map(it =>
      `<div class="fila-tf" data-item="${it.id}">
         <span class="fila-texto">${it.texto}</span>
         <div class="tf-botones">
           <button type="button" class="tf-btn" data-item="${it.id}" data-valor="T">T</button>
           <button type="button" class="tf-btn" data-item="${it.id}" data-valor="F">F</button>
         </div>
       </div>`).join('') + `</div>`;
  } else if (ej.tipo === 'mc') {
    cuerpo += ej.items.map(it =>
      `<div class="bloque-mc" data-item="${it.id}">
         <p class="mc-pregunta">${it.texto}</p>
         <div class="opciones-texto" data-item="${it.id}">
           ${it.opciones.map((op, i) =>
             `<button type="button" class="opcion-texto" data-item="${it.id}" data-valor="${i}">${op}</button>`).join('')}
         </div>
       </div>`).join('');
  } else if (ej.tipo === 'multi') {
    cuerpo += `<div class="opciones-texto multi" data-item="${ej.id}">
      ${ej.opciones.map((op, i) =>
        `<button type="button" class="opcion-texto" data-item="${ej.id}" data-valor="${i}">${op}</button>`).join('')}
    </div>`;
  }

  return `<div class="ejercicio" data-ej="${ej.id}">
    <p class="ejercicio-enunciado">${ej.enunciado}</p>
    ${cuerpo}
    <div class="feedback" id="fb-${ej.id}"></div>
  </div>`;
}

function renderSeccion() {
  const sec = SECCIONES_ACTIVAS[estado.seccion];
  document.getElementById('seccion-titulo').textContent = `${sec.emoji} ${sec.titulo}`;
  document.getElementById('seccion-subtitulo').textContent =
    (MODO_REPASO ? 'Review · ' : '') + `Part ${estado.seccion + 1} of ${SECCIONES_ACTIVAS.length}`;
  renderPasos();
  document.getElementById('barra-fill').style.width =
    `${(estado.seccion / SECCIONES_ACTIVAS.length) * 100}%`;

  let html = '';
  if (MODO_REPASO && estado.seccion === 0) {
    html += `<div class="seccion-intro" style="border-left-color:var(--rojo-osc);">
      <h2>🎯 Review your mistakes</h2><p>Only the exercises you got wrong.</p></div>`;
  }
  html += `<div class="seccion-intro"><h2>${sec.emoji} ${sec.titulo}</h2>
    <p>${sec.descripcion}</p></div>`;
  html += sec.ejercicios.map(renderEjercicio).join('');

  const main = document.getElementById('examen');
  main.innerHTML = html;
  conectarEventos(sec);

  document.getElementById('btn-comprobar').hidden = false;
  document.getElementById('btn-siguiente').hidden = true;
  document.getElementById('btn-final').hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- INTERACCIÓN ----------

function conectarEventos(sec) {
  const main = document.getElementById('examen');

  sec.ejercicios.forEach(ej => {
    const div = main.querySelector(`[data-ej="${ej.id}"]`);
    if (ej.tipo === 'ranuras') {
      Ranuras.conectar(div, ej.bancos, (id, valor) => { estado.respuestas[id] = valor; });
    }
  });

  main.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const item = btn.dataset.item;
      main.querySelectorAll(`.tf-btn[data-item="${item}"]`).forEach(b => b.classList.remove('elegida'));
      btn.classList.add('elegida');
      estado.respuestas[item] = btn.dataset.valor;
    });
  });

  main.querySelectorAll('.opciones-texto:not(.multi)').forEach(grupo => {
    const item = grupo.dataset.item;
    grupo.querySelectorAll('.opcion-texto').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        grupo.querySelectorAll('.opcion-texto').forEach(b => b.classList.remove('elegida'));
        btn.classList.add('elegida');
        estado.respuestas[item] = btn.dataset.valor;
      });
    });
  });

  main.querySelectorAll('.opciones-texto.multi').forEach(grupo => {
    const item = grupo.dataset.item;
    grupo.querySelectorAll('.opcion-texto').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.classList.toggle('elegida');
        estado.respuestas[item] = [...grupo.querySelectorAll('.opcion-texto.elegida')]
          .map(b => parseInt(b.dataset.valor, 10)).sort((a, b2) => a - b2);
      });
    });
  });
}

// ---------- COMPROBACIÓN ----------

function comprobarEjercicio(ej, div) {
  let aciertos = 0;
  const total = numItems(ej);
  const fallos = [];

  if (ej.tipo === 'ranuras') {
    // Grupos que se corrigen como conjunto (el orden da igual).
    const usadosPorConjunto = {};
    ej.items.forEach(it => {
      const ranura = div.querySelector(`.ranura[data-id="${it.id}"]`);
      const dado = ranura.dataset.valor;
      let ok;
      const conj = ej.conjuntos && ej.conjuntos[it.grupo];
      if (conj) {
        usadosPorConjunto[it.grupo] = usadosPorConjunto[it.grupo] || [];
        ok = conj.includes(dado) && !usadosPorConjunto[it.grupo].includes(dado);
        if (ok) usadosPorConjunto[it.grupo].push(dado);
      } else {
        ok = dado === it.respuesta;
      }
      ranura.disabled = true;
      ranura.classList.add(ok ? 'ok' : 'ko');
      if (ok) aciertos++;
      else fallos.push(`<strong>${it.etiqueta || ''}</strong> ${conj ? '' : '→ ' + esc(it.respuesta)}`.trim());
    });
    if (ej.conjuntos && fallos.length) {
      Object.entries(ej.conjuntos).forEach(([g, vals]) => {
        fallos.push(`the words were: <strong>${vals.join(', ')}</strong>`);
      });
    }
  } else if (ej.tipo === 'tf') {
    ej.items.forEach(it => {
      const dado = estado.respuestas[it.id];
      const ok = dado === it.respuesta;
      div.querySelectorAll(`.tf-btn[data-item="${it.id}"]`).forEach(b => {
        b.disabled = true;
        if (b.dataset.valor === it.respuesta) b.classList.add('ok');
        if (b.classList.contains('elegida') && b.dataset.valor !== it.respuesta) b.classList.add('ko');
      });
      if (ok) aciertos++; else fallos.push(`“${esc(it.texto)}” → <strong>${it.respuesta}</strong>`);
    });
  } else if (ej.tipo === 'mc') {
    ej.items.forEach(it => {
      const dado = parseInt(estado.respuestas[it.id], 10);
      const ok = dado === it.respuesta;
      div.querySelectorAll(`.opcion-texto[data-item="${it.id}"]`).forEach(b => {
        b.disabled = true;
        const i = parseInt(b.dataset.valor, 10);
        if (i === it.respuesta) b.classList.add('ok', 'solucion');
        if (b.classList.contains('elegida') && i !== it.respuesta) b.classList.add('ko');
      });
      if (ok) aciertos++;
    });
  } else if (ej.tipo === 'multi') {
    const dadas = estado.respuestas[ej.id] || [];
    const ok = dadas.length === ej.respuestas.length
      && dadas.every((v, i) => v === ej.respuestas[i]);
    div.querySelectorAll('.opcion-texto').forEach(b => {
      b.disabled = true;
      const i = parseInt(b.dataset.valor, 10);
      if (ej.respuestas.includes(i)) b.classList.add('ok', 'solucion');
      if (b.classList.contains('elegida') && !ej.respuestas.includes(i)) b.classList.add('ko');
    });
    if (ok) aciertos++;
  }

  const fb = document.getElementById(`fb-${ej.id}`);
  fb.classList.add('mostrar', aciertos === total ? 'ok' : 'ko');
  if (aciertos === total) {
    fb.innerHTML = '🎉 All correct!';
    div.classList.add('correcto');
  } else {
    fb.innerHTML = `💡 ${aciertos} of ${total} correct. The right answers are marked in green.`;
    div.classList.add('incorrecto');
    estado.erroresPorId.push(ej.id);
  }
  return aciertos;
}

function comprobarSeccion() {
  const sec = SECCIONES_ACTIVAS[estado.seccion];
  let aciertos = 0;
  let total = 0;
  sec.ejercicios.forEach(ej => {
    const div = document.querySelector(`[data-ej="${ej.id}"]`);
    aciertos += comprobarEjercicio(ej, div);
    total += numItems(ej);
  });

  estado.totalCorrectas += aciertos;
  estado.resumenPorSeccion[sec.id] = { titulo: sec.titulo, emoji: sec.emoji, aciertos, total };
  document.getElementById('puntos').textContent = estado.totalCorrectas;

  document.getElementById('btn-comprobar').hidden = true;
  if (estado.seccion < SECCIONES_ACTIVAS.length - 1) document.getElementById('btn-siguiente').hidden = false;
  else document.getElementById('btn-final').hidden = false;

  if (aciertos === total) Confeti.lanzar(60);

  const ultima = estado.seccion >= SECCIONES_ACTIVAS.length - 1;
  const perfecto = aciertos === total;
  Modal.mostrar({
    emoji: perfecto ? '🌟' : (aciertos / total >= 0.5 ? '👍' : '💪'),
    titulo: perfecto ? 'Perfect!' : (aciertos / total >= 0.5 ? 'Well done!' : 'Keep going!'),
    color: perfecto ? 'var(--verde-osc)' : 'var(--naranja)',
    html: `<p>You got <strong>${aciertos} of ${total}</strong> right in this part.</p>`,
    botones: [
      { texto: 'Check my answers', clase: 'boton-volver' },
      ultima
        ? { texto: 'See my result 🎉', clase: 'boton-final', accion: mostrarFinal }
        : { texto: 'Next part →', clase: 'boton-siguiente', accion: siguienteSeccion },
    ],
  });
}

function siguienteSeccion() {
  estado.seccion++;
  guardarBorrador();
  renderSeccion();
}

// ---------- FINAL ----------

function mostrarFinal() {
  document.getElementById('barra-fill').style.width = '100%';
  const total = estado.totalItems;
  const correctas = estado.totalCorrectas;
  const pct = Math.round((correctas / total) * 100);
  const tiempoMs = typeof Cronometro !== 'undefined' ? Cronometro.stop() : null;
  const mejorPrevio = (!MODO_REPASO && typeof Almacen !== 'undefined')
    ? Almacen.mejorTiempo(EXAMEN_ID, { modo: 'fijo' }) : null;
  const esRecord = tiempoMs && correctas === total && (!mejorPrevio || tiempoMs < mejorPrevio.tiempoMs);

  if (!MODO_REPASO && typeof Almacen !== 'undefined') {
    Almacen.addIntento(EXAMEN_ID, {
      correctas, total, errores: estado.erroresPorId,
      porSeccion: estado.resumenPorSeccion, modo: 'fijo', tiempoMs,
    });
    descartarBorrador();
  }

  let emoji, titulo, mensaje;
  if (pct === 100) { emoji = '🏆'; titulo = 'Amazing!'; mensaje = 'You know the human body inside out!'; }
  else if (pct >= 80) { emoji = '🌟'; titulo = 'Very good!'; mensaje = 'Great job. Just a few words to review.'; }
  else if (pct >= 60) { emoji = '😊'; titulo = 'Well done!'; mensaje = 'Good work. Review your mistakes and try again.'; }
  else if (pct >= 40) { emoji = '💪'; titulo = 'Keep going!'; mensaje = 'You are learning. Practise the diagrams again.'; }
  else { emoji = '🌱'; titulo = 'Try again!'; mensaje = 'Read the unit calmly and come back. You can do it!'; }

  document.getElementById('modal-emoji').textContent = emoji;
  document.getElementById('modal-titulo').textContent = titulo;
  document.getElementById('modal-mensaje').textContent = mensaje;
  document.getElementById('stat-correctas').textContent = correctas;
  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-porcentaje').textContent = pct + '%';

  const elemTiempo = document.getElementById('modal-tiempo');
  if (tiempoMs && elemTiempo) {
    const txt = Cronometro.formato(tiempoMs);
    if (esRecord) {
      elemTiempo.classList.add('record');
      elemTiempo.innerHTML = `🚀 New time record! <strong>${txt}</strong>`;
    } else if (mejorPrevio) {
      elemTiempo.innerHTML = `⏱️ Your time: <strong>${txt}</strong>. Best: ${Cronometro.formato(mejorPrevio.tiempoMs)}`;
    } else {
      elemTiempo.innerHTML = `⏱️ Your time: <strong>${txt}</strong>`;
    }
    elemTiempo.hidden = false;
  }

  const previo = document.getElementById('boton-repaso');
  if (previo) previo.remove();
  if (estado.erroresPorId.length > 0 && !MODO_REPASO) {
    const cont = document.querySelector('#modal-final .modal-contenido');
    const btn = document.createElement('button');
    btn.id = 'boton-repaso';
    btn.className = 'boton boton-siguiente';
    btn.type = 'button';
    btn.innerHTML = `Repeat the ${estado.erroresPorId.length} I got wrong 🎯`;
    btn.addEventListener('click', () => { location.search = '?repaso=' + estado.erroresPorId.join(','); });
    cont.insertBefore(btn, cont.querySelector('.boton-reiniciar'));
  }

  document.getElementById('modal-final').hidden = false;
  if (pct >= 80) Confeti.lanzar(180);
}

// ---------- BORRADOR ----------

const claveBorrador = () => `${EXAMEN_ID}::fijo`;

function guardarBorrador() {
  if (MODO_REPASO || typeof Almacen === 'undefined') return;
  Almacen.setBorrador(claveBorrador(), {
    seccion: estado.seccion,
    totalCorrectas: estado.totalCorrectas,
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
function mostrarBannerContinuar(b) {
  const fecha = new Date(b.fecha).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
  document.getElementById('seccion-titulo').textContent = '📌 Exam in progress';
  document.getElementById('seccion-subtitulo').textContent = 'Choose how to continue';
  document.getElementById('examen').innerHTML = `
    <div class="seccion-intro" style="border-left-color:var(--azul-osc);">
      <h2>📌 You already started this exam</h2>
      <p>You left it on <strong>${fecha}</strong>, at part
        <strong>${b.seccion + 1} of ${SECCIONES_ACTIVAS.length}</strong>
        with <strong>${b.totalCorrectas} correct answers</strong>.</p>
      <div class="confirma-acciones" style="margin-top:1.2rem;">
        <button type="button" class="boton boton-volver" id="banner-nuevo">🔄 Start again</button>
        <button type="button" class="boton boton-siguiente" id="banner-continuar">Continue →</button>
      </div>
    </div>`;
  document.querySelector('.pie').style.display = 'none';
  document.getElementById('banner-continuar').addEventListener('click', () => {
    estado.seccion = b.seccion;
    estado.totalCorrectas = b.totalCorrectas || 0;
    estado.resumenPorSeccion = b.resumenPorSeccion || {};
    estado.erroresPorId = b.erroresPorId || [];
    document.getElementById('puntos').textContent = estado.totalCorrectas;
    document.querySelector('.pie').style.display = '';
    iniciarCronometro(b.tiempoAcumuladoMs || 0);
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
  Ranuras.init();
  document.getElementById('btn-comprobar').addEventListener('click', () => {
    Modal.mostrar({
      emoji: '🤔', titulo: 'Have you finished?',
      html: '<p>Have you answered everything in this part?</p>',
      color: 'var(--naranja)',
      botones: [
        { texto: 'Let me check', clase: 'boton-volver' },
        { texto: 'Yes, check it ✓', clase: 'boton-comprobar', accion: comprobarSeccion },
      ],
    });
  });
  document.getElementById('btn-siguiente').addEventListener('click', siguienteSeccion);
  document.getElementById('btn-final').addEventListener('click', mostrarFinal);

  const borrador = leerBorradorPendiente();
  if (borrador) {
    renderPasos();
    mostrarBannerContinuar(borrador);
  } else {
    iniciarCronometro(0);
    renderSeccion();
  }
}

document.addEventListener('DOMContentLoaded', init);
