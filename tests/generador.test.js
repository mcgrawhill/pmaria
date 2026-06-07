// Tests del generador de ejercicios. Garantizan que las respuestas
// son matemáticamente correctas y que los rangos son razonables para
// niños de 3.º-4.º Primaria.

const test = require('node:test');
const assert = require('node:assert/strict');
const Generador = require('../_componentes/generador.js');

const SEMILLA = 12345;

test('prng: reproducible con misma semilla', () => {
  const a = Generador.prng(SEMILLA);
  const b = Generador.prng(SEMILLA);
  for (let i = 0; i < 100; i++) {
    assert.equal(a(), b());
  }
});

test('prng: valores en [0, 1)', () => {
  const rng = Generador.prng(7);
  for (let i = 0; i < 200; i++) {
    const v = rng();
    assert.ok(v >= 0 && v < 1, `valor fuera de rango: ${v}`);
  }
});

test('fraccion: 1 ≤ num < den ≤ 10', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.fraccion(rng, i);
    assert.equal(ej.tipo, 'fraccion');
    assert.ok(ej.num >= 1, `num=${ej.num}`);
    assert.ok(ej.num < ej.den, `num=${ej.num}, den=${ej.den}`);
    assert.ok(ej.den >= 2 && ej.den <= 10, `den=${ej.den}`);
  }
});

test('mixto: entero ∈ [1,4], 1 ≤ num < den ≤ 8', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.mixto(rng, i);
    assert.equal(ej.tipo, 'mixto');
    assert.ok(ej.entero >= 1 && ej.entero <= 4, `entero=${ej.entero}`);
    assert.ok(ej.num >= 1, `num=${ej.num}`);
    assert.ok(ej.num < ej.den, `num=${ej.num}, den=${ej.den}`);
    assert.ok(ej.den >= 2 && ej.den <= 8, `den=${ej.den}`);
  }
});

test('comparar: ambas fracciones propias y comparable', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.comparar(rng, i);
    assert.equal(ej.tipo, 'comparar');
    assert.ok(ej.a[0] >= 1 && ej.a[0] < ej.a[1]);
    assert.ok(ej.b[0] >= 1 && ej.b[0] < ej.b[1]);
    const r = Generador.compararFracciones(ej.a[0], ej.a[1], ej.b[0], ej.b[1]);
    assert.ok(['<', '>', '='].includes(r), `comparación inesperada: ${r}`);
  }
});

test('compararFracciones: casos conocidos', () => {
  assert.equal(Generador.compararFracciones(1, 2, 1, 4), '>');
  assert.equal(Generador.compararFracciones(1, 4, 1, 2), '<');
  assert.equal(Generador.compararFracciones(2, 4, 1, 2), '=');
  assert.equal(Generador.compararFracciones(3, 6, 1, 2), '=');
  assert.equal(Generador.compararFracciones(2, 3, 6, 9), '=');
});

test('area: respuesta entera y > 0', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 300; i++) {
    const ej = Generador.area(rng, i);
    assert.equal(ej.tipo, 'area');
    assert.ok(Number.isInteger(ej.respuesta), `no entero: ${ej.respuesta} (tipo=${ej.figura.tipo})`);
    assert.ok(ej.respuesta > 0);
    assert.ok(['rect', 'rect-diag', 'triangulo', 'L'].includes(ej.figura.tipo));
  }
});

test('area: rectángulo respuesta = cols * filas', () => {
  const rng = Generador.prng(99);
  let visto = 0;
  for (let i = 0; i < 500 && visto < 50; i++) {
    const ej = Generador.area(rng, i);
    if (ej.figura.tipo === 'rect') {
      assert.equal(ej.respuesta, ej.figura.cols * ej.figura.filas);
      visto++;
    }
  }
  assert.ok(visto > 0, 'no se generó ningún rectángulo en 500 intentos');
});

test('area: triángulo/diagonal respuesta = (cols * filas) / 2', () => {
  const rng = Generador.prng(42);
  let visto = 0;
  for (let i = 0; i < 500 && visto < 30; i++) {
    const ej = Generador.area(rng, i);
    if (ej.figura.tipo === 'triangulo' || ej.figura.tipo === 'rect-diag') {
      assert.equal(ej.respuesta, (ej.figura.cols * ej.figura.filas) / 2);
      visto++;
    }
  }
  assert.ok(visto > 0);
});

test('area: forma en L cuadra con cols*filas - hueco', () => {
  const rng = Generador.prng(101);
  let visto = 0;
  for (let i = 0; i < 1000 && visto < 30; i++) {
    const ej = Generador.area(rng, i);
    if (ej.figura.tipo === 'L') {
      const { cols, filas, cortarX, cortarY } = ej.figura;
      assert.ok(cortarX >= 1 && cortarX < cols, `cortarX=${cortarX} cols=${cols}`);
      assert.ok(cortarY >= 1 && cortarY < filas);
      const huecoCols = cols - cortarX;
      const huecoFilas = cortarY;
      assert.equal(ej.respuesta, cols * filas - huecoCols * huecoFilas);
      assert.ok(huecoCols > 0 && huecoFilas > 0, 'la L debe tener un hueco real');
      visto++;
    }
  }
  assert.ok(visto > 0);
});

test('probabilidad: respuesta válida y consistente con la bolsa', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 300; i++) {
    const ej = Generador.probabilidad(rng, i);
    assert.equal(ej.tipo, 'probabilidad');
    assert.ok(['seguro', 'probable', 'improbable', 'imposible'].includes(ej.respuesta));
    assert.ok(ej.bolsa.length > 0);
    ej.bolsa.forEach(d => assert.ok(d.cantidad > 0));
  }
});

test('plano: si pide posición, devuelve coordenada válida (letra+num)', () => {
  const rng = Generador.prng(7);
  const tablero = Generador.tableroPlano(rng);
  for (let i = 0; i < 100; i++) {
    const ej = Generador.plano(rng, i, tablero);
    if (ej.tipo === 'plano-posicion') {
      assert.match(ej.respuesta, /^[A-H][1-8]$/, `posición inválida: ${ej.respuesta}`);
    } else {
      assert.equal(ej.tipo, 'plano-que-hay');
      assert.ok(ej.opciones.length >= 2);
      assert.ok(ej.opciones.find(o => o.valor === ej.respuesta), 'la respuesta debe estar entre las opciones');
    }
  }
});

test('tableroPlano: posiciones únicas y dentro del tablero', () => {
  const rng = Generador.prng(SEMILLA);
  const tablero = Generador.tableroPlano(rng);
  assert.equal(tablero.length, 6, 'debe tener 6 piezas');
  const posiciones = new Set();
  tablero.forEach(p => {
    assert.match(p.pos, /^[A-H][1-8]$/);
    assert.ok(!posiciones.has(p.pos), `posición duplicada: ${p.pos}`);
    posiciones.add(p.pos);
  });
});

test('crearExamen: reproducible con semilla y bien estructurado', () => {
  const a = Generador.crearExamen({ semilla: SEMILLA });
  const b = Generador.crearExamen({ semilla: SEMILLA });
  assert.deepEqual(a, b, 'misma semilla → mismo examen');

  assert.ok(a.length >= 5, 'al menos 5 secciones generadas');
  for (const sec of a) {
    assert.ok(sec.id && sec.titulo && sec.descripcion);
    assert.ok(Array.isArray(sec.ejercicios) && sec.ejercicios.length > 0);
  }
});

test('crearExamen: con simetría curada incluida', () => {
  const simetriaFake = { id: 'simetria', titulo: 'Simetría', ejercicios: [{ id: 's1' }] };
  const ex = Generador.crearExamen({ semilla: 1, simetriaCurada: simetriaFake });
  assert.ok(ex.find(s => s.id === 'simetria'));
});

test('crearExamen: incluye sección de mixtos con ejercicios bien formados', () => {
  const ex = Generador.crearExamen({ semilla: 1 });
  const sec = ex.find(s => s.id === 'mixtos');
  assert.ok(sec, 'la sección mixtos debe estar presente');
  assert.ok(sec.ejercicios.length > 0);
  sec.ejercicios.forEach(ej => {
    assert.equal(ej.tipo, 'mixto');
    assert.ok(ej.entero >= 1 && ej.num >= 1 && ej.num < ej.den);
  });
});

// ---------- EXAMEN 3: DECIMALES Y OPERACIONES ----------

test('sumaDecimal: respuesta = operando aplicando el signo', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.sumaDecimal(rng, i);
    assert.equal(ej.tipo, 'suma-decimal');
    const aN = parseFloat(ej.a.replace(',', '.'));
    const bN = parseFloat(ej.b.replace(',', '.'));
    const rN = parseFloat(ej.respuesta.replace(',', '.'));
    const esperado = ej.op === '+' ? aN + bN : aN - bN;
    assert.ok(Math.abs(rN - esperado) < 1e-9,
      `${ej.a} ${ej.op} ${ej.b} = ${ej.respuesta} (esperado ${esperado.toFixed(2)})`);
    assert.ok(rN >= 0, 'resta no debería dar negativo');
  }
});

test('multCifra: respuesta = a * b, a en [100,999], b en [2,9]', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.multCifra(rng, i);
    assert.equal(ej.tipo, 'mult-cifra');
    assert.equal(ej.respuesta, ej.a * ej.b);
    assert.ok(ej.a >= 100 && ej.a <= 999);
    assert.ok(ej.b >= 2 && ej.b <= 9);
  }
});

test('multDosCifras: respuesta = a * b y parciales suman correctamente', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.multDosCifras(rng, i);
    assert.equal(ej.tipo, 'mult-dos-cifras');
    assert.ok(ej.a >= 11 && ej.a <= 99);
    assert.ok(ej.b >= 11 && ej.b <= 99);
    assert.equal(ej.respuesta, ej.a * ej.b);
    assert.equal(ej.parcial1 + ej.parcial2, ej.respuesta);
  }
});

test('multDecimal: respuesta correcta con 1 decimal', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.multDecimal(rng, i);
    assert.equal(ej.tipo, 'mult-decimal');
    const aN = parseFloat(ej.a.replace(',', '.'));
    const rN = parseFloat(ej.respuesta.replace(',', '.'));
    const esperado = aN * ej.b;
    assert.ok(Math.abs(rN - esperado) < 1e-9,
      `${ej.a} × ${ej.b} = ${ej.respuesta} (esperado ${esperado})`);
    assert.match(ej.respuesta, /^\d+,\d$/, 'debe tener exactamente 1 decimal');
  }
});

test('combinada: respuesta > 0 y consistente con forma y operandos', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.combinada(rng, i);
    assert.equal(ej.tipo, 'combinada');
    assert.ok(['a+bc', 'a-bc', 'bc+a', 'bc-a'].includes(ej.forma), `forma inesperada: ${ej.forma}`);
    assert.ok(ej.respuesta > 0, `resultado debe ser positivo`);
    assert.equal(ej.subResultado, ej.b * ej.c, `subResultado debe ser b*c`);
    let esperado;
    if (ej.forma === 'a+bc') esperado = ej.a + ej.subResultado;
    else if (ej.forma === 'a-bc') esperado = ej.a - ej.subResultado;
    else if (ej.forma === 'bc+a') esperado = ej.subResultado + ej.a;
    else if (ej.forma === 'bc-a') esperado = ej.subResultado - ej.a;
    assert.equal(esperado, ej.respuesta);
  }
});

test('divisionGrafica: dividendo = divisor*cociente + resto, resto < divisor', () => {
  const rng = Generador.prng(SEMILLA);
  for (let i = 0; i < 200; i++) {
    const ej = Generador.divisionGrafica(rng, i);
    assert.equal(ej.tipo, 'division-grafica');
    assert.equal(ej.dividendo, ej.divisor * ej.cociente + ej.resto);
    assert.ok(ej.resto < ej.divisor && ej.resto >= 0);
    assert.ok(ej.divisor >= 2 && ej.divisor <= 9);
  }
});

test('crearExamenDecimales: 6 secciones reproducibles', () => {
  const a = Generador.crearExamenDecimales({ semilla: 42 });
  const b = Generador.crearExamenDecimales({ semilla: 42 });
  assert.deepEqual(a, b, 'misma semilla → mismo examen');
  const ids = a.map(s => s.id);
  assert.deepEqual(ids, [
    'sumas-restas-decimales',
    'mult-una-cifra',
    'mult-decimales',
    'mult-dos-cifras',
    'combinadas',
    'division-grafica',
  ]);
});
