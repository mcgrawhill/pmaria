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
    comparar,
    area,
    probabilidad,
    plano,
    tableroPlano,
    crearExamen,
    compararFracciones,
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Generador;
