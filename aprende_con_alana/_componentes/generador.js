// =====================================================
// Generador — ejercicios aleatorios con resultado garantizado
// =====================================================
// Funciones puras: dado un PRNG, devuelven un ejercicio con
// el mismo "shape" que los del array SECCIONES del examen.
// Compatible con navegador (objeto global) y Node (module.exports).

const Generador = (function () {

  // ---------- PRNG con semilla (mulberry32) ----------
  // Devuelve una función rng() que produce [0, 1) reproducible.
  function prng(semilla) {
    let s = (semilla >>> 0) || (Math.random() * 4294967296) >>> 0;
    return function rng() {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Entero aleatorio en [min, max] (ambos inclusive).
  function ent(rng, min, max) {
    return min + Math.floor(rng() * (max - min + 1));
  }

  function elegir(rng, arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  // ---------- GENERADORES POR TIPO ----------

  function fraccion(rng, idx) {
    const den = ent(rng, 2, 10);
    const num = ent(rng, 1, den - 1);
    const colores = ['#fd9644', '#a29bfe', '#fd79a8', '#74b9ff', '#55efc4', '#ffeaa7'];
    return { id: `f${idx}`, tipo: 'fraccion', num, den, color: elegir(rng, colores) };
  }

  // ---------- DECIMALES Y MULTIPLICACIÓN ----------
  // Trabajamos internamente con enteros (centésimas) para no arrastrar
  // errores de coma flotante. Formateamos al final con "," (es-ES).

  function _fmt2(centesimas) {
    const signo = centesimas < 0 ? '-' : '';
    const c = Math.abs(centesimas);
    const ent = Math.floor(c / 100);
    const dec = c % 100;
    return `${signo}${ent},${String(dec).padStart(2, '0')}`;
  }

  function _fmt1(decimas) {
    const signo = decimas < 0 ? '-' : '';
    const d = Math.abs(decimas);
    const ent = Math.floor(d / 10);
    const dec = d % 10;
    return `${signo}${ent},${dec}`;
  }

  function sumaDecimal(rng, idx) {
    const op = elegir(rng, ['+', '-']);
    let aCent = ent(rng, 200, 1999);
    let bCent = ent(rng, 100, 999);
    if (op === '-' && bCent >= aCent) { const t = aCent; aCent = bCent + 100; bCent = t; }
    const rCent = op === '+' ? aCent + bCent : aCent - bCent;
    return {
      id: `sd${idx}`,
      tipo: 'suma-decimal',
      op,
      a: _fmt2(aCent),
      b: _fmt2(bCent),
      respuesta: _fmt2(rCent),
    };
  }

  function multCifra(rng, idx) {
    const cifra = ent(rng, 2, 9);
    const n = ent(rng, 100, 999);
    return { id: `mc${idx}`, tipo: 'mult-cifra', a: n, b: cifra, respuesta: n * cifra };
  }

  function multDosCifras(rng, idx) {
    const a = ent(rng, 11, 99);
    const b = ent(rng, 11, 99);
    return {
      id: `m2${idx}`, tipo: 'mult-dos-cifras',
      a, b,
      // Productos parciales: a × unidades(b) y a × decenas(b) × 10
      parcial1: a * (b % 10),
      parcial2: a * Math.floor(b / 10) * 10,
      respuesta: a * b,
    };
  }

  function multDecimal(rng, idx) {
    // Decimal con 1 cifra decimal × cifra entera. Resultado siempre 1 decimal.
    const aDec = ent(rng, 11, 99); // décimas: 1,1..9,9
    const b = ent(rng, 2, 9);
    return {
      id: `md${idx}`, tipo: 'mult-decimal',
      a: _fmt1(aDec), b,
      respuesta: _fmt1(aDec * b),
    };
  }

  function combinada(rng, idx) {
    // forma: 'a+bc' | 'a-bc' | 'bc+a' | 'bc-a'.
    // El sub-resultado (b*c) y la respuesta final se exponen explícitamente
    // para que el examen pueda pedir AMBOS al niño (paso 1 y paso 2).
    const formas = [
      () => { const a = ent(rng, 1, 9), b = ent(rng, 2, 5), c = ent(rng, 2, 5);
        return { forma: 'a+bc', a, b, c, subResultado: b * c, respuesta: a + b * c }; },
      () => { const b = ent(rng, 2, 5), c = ent(rng, 2, 5), a = ent(rng, 1, 9);
        const sub = b * c, r = sub - a;
        return r > 0 ? { forma: 'bc-a', a, b, c, subResultado: sub, respuesta: r } : null; },
      () => { const a = ent(rng, 8, 25), b = ent(rng, 2, 4), c = ent(rng, 2, 5);
        const sub = b * c, r = a - sub;
        return r > 0 ? { forma: 'a-bc', a, b, c, subResultado: sub, respuesta: r } : null; },
      () => { const b = ent(rng, 2, 9), c = ent(rng, 2, 5), a = ent(rng, 1, 9);
        const sub = b * c;
        return { forma: 'bc+a', a, b, c, subResultado: sub, respuesta: sub + a }; },
    ];
    let r = null;
    for (let i = 0; i < 20 && !r; i++) r = elegir(rng, formas)();
    if (!r) r = { forma: 'a+bc', a: 2, b: 3, c: 4, subResultado: 12, respuesta: 14 };
    return { id: `oc${idx}`, tipo: 'combinada', ...r };
  }

  function divisionGrafica(rng, idx) {
    const divisor = ent(rng, 2, 9);
    const cociente = ent(rng, 2, 5);
    const resto = ent(rng, 0, divisor - 1);
    const dividendo = divisor * cociente + resto;
    return {
      id: `dg${idx}`, tipo: 'division-grafica',
      dividendo, divisor, cociente, resto,
    };
  }

  function mixto(rng, idx) {
    // Limitamos den a 8 para que las pizzas se vean cómodas en pantalla
    // y entero a 4 para no abusar del ancho horizontal.
    const entero = ent(rng, 1, 4);
    const den = ent(rng, 2, 8);
    const num = ent(rng, 1, den - 1);
    const colores = ['#fd9644', '#a29bfe', '#fd79a8', '#74b9ff', '#55efc4', '#ffeaa7'];
    return { id: `m${idx}`, tipo: 'mixto', entero, num, den, color: elegir(rng, colores) };
  }

  function comparar(rng, idx) {
    // Dos fracciones independientes, denominadores hasta 10.
    const a = [ent(rng, 1, 9), ent(rng, 2, 10)];
    let b = [ent(rng, 1, 9), ent(rng, 2, 10)];
    // Asegurar que numerador < denominador (fracciones propias) para que sean visualmente comparables.
    if (a[0] >= a[1]) a[0] = ent(rng, 1, a[1] - 1);
    if (b[0] >= b[1]) b[0] = ent(rng, 1, b[1] - 1);
    return { id: `c${idx}`, tipo: 'comparar', a, b };
  }

  function area(rng, idx) {
    const tipos = ['rect', 'rect', 'rect', 'triangulo', 'rect-diag', 'L'];
    const tipo = elegir(rng, tipos);
    const colores = ['#74b9ff', '#fd9644', '#a29bfe', '#55efc4', '#fd79a8', '#ffeaa7'];
    const color = elegir(rng, colores);

    if (tipo === 'rect') {
      const cols = ent(rng, 2, 8);
      const filas = ent(rng, 2, 6);
      return { id: `a${idx}`, tipo: 'area', figura: { cols, filas, tipo, color }, respuesta: cols * filas };
    }
    if (tipo === 'triangulo' || tipo === 'rect-diag') {
      // Para que la respuesta sea entera, cols*filas debe ser par.
      let cols = ent(rng, 2, 8);
      let filas = ent(rng, 2, 6);
      if ((cols * filas) % 2 !== 0) {
        if (cols % 2 !== 0) cols += 1; else filas += 1;
      }
      return { id: `a${idx}`, tipo: 'area', figura: { cols, filas, tipo, color }, respuesta: (cols * filas) / 2 };
    }
    if (tipo === 'L') {
      const cols = ent(rng, 4, 7);
      const filas = ent(rng, 4, 6);
      const cortarX = ent(rng, 2, cols - 1);
      const cortarY = ent(rng, 2, filas - 1);
      const huecoCols = cols - cortarX;
      const huecoFilas = cortarY;
      const respuesta = cols * filas - huecoCols * huecoFilas;
      return {
        id: `a${idx}`, tipo: 'area',
        figura: { cols, filas, tipo, color, cortarX, cortarY },
        respuesta,
      };
    }
  }

  function probabilidad(rng, idx) {
    // Bolsa con uno o dos colores, varios sucesos posibles.
    const escenarios = [
      // (Bolsa, color a sacar) → categoría
      () => ({ bolsa: [{ color: 'rojo', cantidad: ent(rng, 4, 10) }], sacar: 'rojo', respuesta: 'seguro' }),
      () => ({ bolsa: [{ color: 'azul', cantidad: ent(rng, 4, 10) }], sacar: 'rojo', respuesta: 'imposible' }),
      () => ({ bolsa: [{ color: 'rojo', cantidad: ent(rng, 4, 6) }, { color: 'azul', cantidad: ent(rng, 4, 6) }], sacar: 'rojo', respuesta: 'probable' }),
      () => {
        const c1 = ent(rng, 7, 10);
        const c2 = ent(rng, 1, 2);
        return { bolsa: [{ color: 'azul', cantidad: c1 }, { color: 'rojo', cantidad: c2 }], sacar: 'rojo', respuesta: 'improbable' };
      },
      () => ({ bolsa: [{ color: 'rojo', cantidad: ent(rng, 3, 6) }, { color: 'azul', cantidad: ent(rng, 3, 6) }], sacar: 'verde', respuesta: 'imposible' }),
    ];
    const esc = elegir(rng, escenarios)();
    const nombres = { rojo: 'roja', azul: 'azul', verde: 'verde', amarillo: 'amarilla' };
    return {
      id: `p${idx}`,
      tipo: 'probabilidad',
      bolsa: esc.bolsa,
      enunciado: `Sacar una bola ${nombres[esc.sacar] || esc.sacar}.`,
      respuesta: esc.respuesta,
    };
  }

  function plano(rng, idx, tablero) {
    // Recibe el tablero ya generado y construye un ejercicio sobre él.
    const obj = elegir(rng, tablero);
    const usarPosicion = rng() < 0.5;
    if (usarPosicion) {
      // "¿Qué hay en la posición X?"
      const opciones = tablero.slice().sort(() => rng() - 0.5).slice(0, 4);
      if (!opciones.find(o => o.nombre === obj.nombre)) opciones[0] = obj;
      return {
        id: `pl${idx}`,
        tipo: 'plano-que-hay',
        enunciado: `¿Qué hay en la posición <strong>${obj.pos}</strong>?`,
        opciones: opciones.map(o => ({ valor: o.nombre, texto: `${o.emoji} ${capitalizar(o.nombre)}` })),
        respuesta: obj.nombre,
      };
    }
    // "¿En qué posición está X?"
    return {
      id: `pl${idx}`,
      tipo: 'plano-posicion',
      enunciado: `¿En qué posición está ${obj.emoji} ${nombreArticulo(obj.nombre)}?`,
      respuesta: obj.pos,
    };
  }

  function tableroPlano(rng) {
    const piezas = [
      { emoji: '🚲', nombre: 'bicicleta' },
      { emoji: '✈️', nombre: 'avion' },
      { emoji: '🐟', nombre: 'pez' },
      { emoji: '⚽', nombre: 'balon' },
      { emoji: '🎯', nombre: 'diana' },
      { emoji: '🎈', nombre: 'globo' },
      { emoji: '🐱', nombre: 'gato' },
      { emoji: '🌟', nombre: 'estrella' },
    ];
    const letras = 'ABCDEFGH';
    const usadas = new Set();
    const tablero = [];
    for (const pieza of piezas) {
      let pos;
      let intentos = 0;
      do {
        const l = letras[ent(rng, 0, 7)];
        const n = ent(rng, 1, 8);
        pos = `${l}${n}`;
        intentos++;
      } while (usadas.has(pos) && intentos < 50);
      usadas.add(pos);
      tablero.push({ ...pieza, pos });
      if (tablero.length === 6) break;
    }
    return tablero;
  }

  function capitalizar(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function nombreArticulo(n) {
    const femeninos = ['bicicleta', 'diana', 'estrella'];
    const articulo = femeninos.includes(n) ? 'la' : 'el';
    return `${articulo} ${n}`;
  }

  // ---------- CONSTRUIR EXAMEN COMPLETO ----------

  // Devuelve un array `SECCIONES_ACTIVAS`-compatible.
  // Las secciones generadas: fracciones, comparar, áreas, probabilidad, plano.
  // La sección de simetría se deja como galería curada (la pasa el llamador).
  function crearExamen(opts = {}) {
    const semilla = opts.semilla;
    const rng = prng(semilla);
    const N = opts.porSeccion || {};
    const conSimetria = opts.simetriaCurada || null;

    const tablero = tableroPlano(rng);

    const secciones = [
      {
        id: 'fracciones', emoji: '🍕', titulo: 'Fracciones',
        descripcion: 'Mira cada dibujo y pulsa los casilleros para escribir la fracción coloreada.',
        ejercicios: repetir(N.fracciones || 5, i => fraccion(rng, i + 1)),
      },
      {
        id: 'mixtos', emoji: '🥧', titulo: 'Números mixtos',
        descripcion: 'Cuenta las pizzas enteras y la parte coloreada de la última. Escribe el número mixto (entero y fracción).',
        ejercicios: repetir(N.mixtos || 4, i => mixto(rng, i + 1)),
      },
      {
        id: 'comparar', emoji: '⚖️', titulo: 'Comparo fracciones',
        descripcion: 'Pulsa el símbolo correcto: mayor, menor o igual.',
        ejercicios: repetir(N.comparar || 6, i => comparar(rng, i + 1)),
      },
      {
        id: 'areas', emoji: '📐', titulo: 'Calculo áreas',
        descripcion: 'Cuenta los cuadrados de cada figura. Cada cuadradito vale 1 cm².',
        ejercicios: repetir(N.areas || 5, i => area(rng, i + 1)),
      },
    ];

    if (conSimetria) secciones.push(conSimetria);

    secciones.push({
      id: 'probabilidad', emoji: '🎲', titulo: 'Predigo el resultado',
      descripcion: 'Mira las bolas de la bolsa y di si el suceso es seguro, probable, improbable o imposible.',
      ejercicios: repetir(N.probabilidad || 5, i => probabilidad(rng, i + 1)),
    });

    secciones.push({
      id: 'plano', emoji: '🗺️', titulo: 'Juego con el plano cartesiano',
      descripcion: 'Mira el tablero. Las columnas son letras (A-H) y las filas son números (1-8).',
      tablero,
      ejercicios: repetir(N.plano || 5, i => plano(rng, i + 1, tablero)),
    });

    return secciones;
  }

  // ---------- GRÁFICAS DE BARRAS (encuestas) ----------
  // Escenarios disponibles: cada uno define la pregunta de la encuesta,
  // 3 distractores y las 4 categorías (label + emoji). Los VALORES se
  // generan aleatoriamente cada vez (entre 1 y 10) para que la gráfica
  // sea distinta en modo aleatorio.
  const ESCENARIOS_GRAFICAS = [
    {
      id: 'platos', emoji: '🍕', titulo: 'Encuesta: platos favoritos',
      pregunta: '¿Cuál es tu plato favorito?',
      preguntasFalsas: [
        '¿Qué comiste ayer en casa?',
        '¿Cuántos platos hay en el menú?',
        '¿A qué hora se come en tu casa?',
      ],
      unidad: 'niños', unidadCat: 'plato',
      accionNoEligen: 'cocinas',
      categorias: [
        { id: 'pizza', label: 'Pizza', emoji: '🍕' },
        { id: 'pasta', label: 'Pasta', emoji: '🍝' },
        { id: 'ensalada', label: 'Ensalada', emoji: '🥗' },
        { id: 'hamburguesa', label: 'Hamburguesa', emoji: '🍔' },
      ],
    },
    {
      id: 'deportes', emoji: '⚽', titulo: 'Encuesta: deportes favoritos',
      pregunta: '¿Cuál es tu deporte favorito?',
      preguntasFalsas: [
        '¿Cuántos deportes practicas?',
        '¿Cuándo entrenas con tu equipo?',
        '¿Qué equipo es el mejor del mundo?',
      ],
      unidad: 'niños', unidadCat: 'deporte',
      accionNoEligen: 'organizas un partido de',
      categorias: [
        { id: 'futbol', label: 'Fútbol', emoji: '⚽' },
        { id: 'baloncesto', label: 'Baloncesto', emoji: '🏀' },
        { id: 'natacion', label: 'Natación', emoji: '🏊' },
        { id: 'tenis', label: 'Tenis', emoji: '🎾' },
      ],
    },
    {
      id: 'mascotas', emoji: '🐶', titulo: 'Encuesta: mascotas favoritas',
      pregunta: '¿Cuál es tu mascota favorita?',
      preguntasFalsas: [
        '¿Cuántas mascotas tienes?',
        '¿Qué mascotas hay en el barrio?',
        '¿Cuál es la mascota más bonita?',
      ],
      unidad: 'niños', unidadCat: 'mascota',
      accionNoEligen: 'tienes en casa',
      categorias: [
        { id: 'perro', label: 'Perro', emoji: '🐶' },
        { id: 'gato', label: 'Gato', emoji: '🐱' },
        { id: 'conejo', label: 'Conejo', emoji: '🐰' },
        { id: 'pez', label: 'Pez', emoji: '🐠' },
      ],
    },
  ];

  // Construye una "sección bruta" con valores aleatorios para un escenario dado.
  // El script.js del examen 4 se encarga de expandirla en ejercicios concretos.
  function seccionGraficaBruta(rng, escenario) {
    const cats = escenario.categorias.map(c => ({ ...c, valor: ent(rng, 1, 10) }));
    // Elegimos referencias aleatorias para las preguntas 4-6:
    // - refLeer: leer la barra de esta categoría
    // - refDif1/refDif2: comparar dos categorías DISTINTAS, la primera con más valor
    // - refNoEligen: si cocinas X, ¿cuántos NO la eligen?
    const refLeer = cats[ent(rng, 0, cats.length - 1)];
    const ordenadas = cats.slice().sort((a, b) => b.valor - a.valor);
    const refDif1 = ordenadas[0];
    const refDif2 = ordenadas[ordenadas.length - 1];
    const refNoEligen = cats[ent(rng, 0, cats.length - 1)];
    return {
      id: `grafica-${escenario.id}`,
      emoji: escenario.emoji,
      titulo: escenario.titulo,
      descripcion: 'Mira la gráfica y responde las preguntas sobre la encuesta.',
      grafica: {
        pregunta: escenario.pregunta,
        preguntasFalsas: escenario.preguntasFalsas,
        unidad: escenario.unidad,
        unidadCat: escenario.unidadCat,
        accionNoEligen: escenario.accionNoEligen,
        categorias: cats,
        labelEjeY: capitalizar(escenario.unidad),
      },
      refs: { leer: refLeer.id, dif1: refDif1.id, dif2: refDif2.id, noEligen: refNoEligen.id },
    };
  }

  function crearExamenGraficas(opts = {}) {
    const semilla = opts.semilla;
    const rng = prng(semilla);
    // Elegir 2 escenarios DISTINTOS aleatoriamente.
    const barajadas = ESCENARIOS_GRAFICAS.slice().sort(() => rng() - 0.5);
    return barajadas.slice(0, 2).map(esc => seccionGraficaBruta(rng, esc));
  }

  // Examen 3: decimales, multiplicaciones, combinadas, división gráfica.
  function crearExamenDecimales(opts = {}) {
    const semilla = opts.semilla;
    const rng = prng(semilla);
    const N = opts.porSeccion || {};

    return [
      {
        id: 'sumas-restas-decimales', emoji: '➕', titulo: 'Sumas y restas con decimales',
        descripcion: 'Calcula sumas y restas con números decimales. Pulsa los casilleros y escribe el resultado.',
        ejercicios: repetir(N.sumasDecimales || 6, i => sumaDecimal(rng, i + 1)),
      },
      {
        id: 'mult-una-cifra', emoji: '✖️', titulo: 'Multiplicaciones por una cifra',
        descripcion: 'Calcula el producto de un número grande por una sola cifra.',
        ejercicios: repetir(N.multCifra || 5, i => multCifra(rng, i + 1)),
      },
      {
        id: 'mult-decimales', emoji: '💲', titulo: 'Multiplicaciones con decimales',
        descripcion: 'Multiplica un número decimal por una cifra. ¡Acuérdate de poner la coma!',
        ejercicios: repetir(N.multDecimal || 5, i => multDecimal(rng, i + 1)),
      },
      {
        id: 'mult-dos-cifras', emoji: '🟦', titulo: 'Multiplicaciones por dos cifras',
        descripcion: 'Multiplica dos números de dos cifras y escribe el resultado.',
        ejercicios: repetir(N.multDosCifras || 5, i => multDosCifras(rng, i + 1)),
      },
      {
        id: 'combinadas', emoji: '🧩', titulo: 'Operaciones combinadas',
        descripcion: 'Recuerda: primero las multiplicaciones, luego las sumas y restas.',
        ejercicios: repetir(N.combinadas || 6, i => combinada(rng, i + 1)),
      },
      {
        id: 'division-grafica', emoji: '📏', titulo: 'Divisiones con regletas',
        descripcion: 'Mira las regletas y escribe cuántas caben (cociente) y cuántas sobran (resto).',
        ejercicios: repetir(N.divisionGrafica || 5, i => divisionGrafica(rng, i + 1)),
      },
    ];
  }

  function repetir(n, fn) {
    return Array.from({ length: n }, (_, i) => fn(i));
  }

  // Comparador de fracciones (utilidad pública).
  function compararFracciones(an, ad, bn, bd) {
    const a = an / ad, b = bn / bd;
    if (Math.abs(a - b) < 1e-9) return '=';
    return a < b ? '<' : '>';
  }

  return {
    prng,
    fraccion,
    mixto,
    comparar,
    area,
    probabilidad,
    plano,
    tableroPlano,
    sumaDecimal,
    multCifra,
    multDosCifras,
    multDecimal,
    combinada,
    divisionGrafica,
    crearExamen,
    crearExamenDecimales,
    crearExamenGraficas,
    compararFracciones,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Generador;
