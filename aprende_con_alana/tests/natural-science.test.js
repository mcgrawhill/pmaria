// Comprueba la coherencia interna del examen de Natural Science.
// No hace falta navegador: se carga script.js en una sandbox con los mínimos
// stubs de DOM y se inspeccionan las SECCIONES que define.

const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function cargarExamen(relativo) {
  const codigo = fs.readFileSync(path.join(__dirname, '..', relativo), 'utf8');
  const sandbox = {
    document: { addEventListener() {}, getElementById: () => null, querySelector: () => null },
    location: { search: '' },
    window: {},
    URLSearchParams,
  };
  vm.createContext(sandbox);
  // Las declaraciones `const` del nivel superior no se cuelgan del objeto
  // global, así que se exportan a mano al final (el mismo motivo por el que
  // `window.PWA` hay que asignarlo explícitamente en _componentes/pwa.js).
  vm.runInContext(codigo + '\n;globalThis.__examen = { SECCIONES, EXAMEN_ID };', sandbox);
  return sandbox.__examen;
}

const { SECCIONES } = cargarExamen('natural-science/examen-01-human-body/script.js');

test('define las 5 partes del examen', () => {
  assert.strictEqual(SECCIONES.length, 5);
  SECCIONES.forEach(sec => {
    assert.ok(sec.id && sec.titulo && sec.emoji, `sección incompleta: ${sec.id}`);
    assert.ok(sec.ejercicios.length > 0, `sección sin ejercicios: ${sec.id}`);
  });
});

test('todos los identificadores son únicos', () => {
  const vistos = new Set();
  SECCIONES.forEach(sec => sec.ejercicios.forEach(ej => {
    assert.ok(!vistos.has(ej.id), `id de ejercicio repetido: ${ej.id}`);
    vistos.add(ej.id);
    (ej.items || []).forEach(it => {
      assert.ok(!vistos.has(it.id), `id de ítem repetido: ${it.id}`);
      vistos.add(it.id);
    });
  }));
});

test('cada ranura tiene respuesta y su palabra está en el banco', () => {
  SECCIONES.forEach(sec => sec.ejercicios.filter(e => e.tipo === 'ranuras').forEach(ej => {
    ej.items.forEach(it => {
      const bancoGrupo = ej.bancos[it.grupo];
      assert.ok(bancoGrupo, `${ej.id}/${it.id}: no hay banco para el grupo "${it.grupo}"`);
      const esConjunto = ej.conjuntos && ej.conjuntos[it.grupo];
      if (esConjunto) {
        // Los grupos "conjunto" se corrigen sin orden: no llevan respuesta propia.
        assert.ok(!it.respuesta, `${ej.id}/${it.id}: un ítem de conjunto no debe fijar respuesta`);
      } else {
        assert.ok(it.respuesta, `${ej.id}/${it.id}: falta la respuesta`);
        const valores = bancoGrupo.map(o => o.valor);
        assert.ok(valores.includes(it.respuesta),
          `${ej.id}/${it.id}: "${it.respuesta}" no está en su banco (${valores.join(', ')})`);
      }
    });
  }));
});

test('los grupos de conjunto tienen tantas palabras como huecos', () => {
  SECCIONES.forEach(sec => sec.ejercicios.filter(e => e.conjuntos).forEach(ej => {
    Object.entries(ej.conjuntos).forEach(([grupo, valores]) => {
      const huecos = ej.items.filter(it => it.grupo === grupo).length;
      assert.strictEqual(valores.length, huecos,
        `${ej.id}: el conjunto "${grupo}" tiene ${valores.length} palabras para ${huecos} huecos`);
      valores.forEach(v => {
        const enBanco = ej.bancos[grupo].map(o => o.valor);
        assert.ok(enBanco.includes(v), `${ej.id}: "${v}" no está en el banco "${grupo}"`);
      });
    });
  }));
});

test('las plantillas de texto tienen un hueco por ítem', () => {
  SECCIONES.forEach(sec => sec.ejercicios
    .filter(e => e.tipo === 'ranuras' && e.presentacion === 'texto')
    .forEach(ej => {
      ej.items.forEach(it => {
        assert.ok(ej.plantilla.includes(`{{${it.id}}}`),
          `${ej.id}: la plantilla no tiene el hueco {{${it.id}}}`);
      });
      const marcadores = ej.plantilla.match(/\{\{[^}]+\}\}/g) || [];
      assert.strictEqual(marcadores.length, ej.items.length,
        `${ej.id}: hay ${marcadores.length} huecos para ${ej.items.length} ítems`);
    }));
});

test('las opciones múltiples apuntan a una respuesta existente', () => {
  SECCIONES.forEach(sec => sec.ejercicios.forEach(ej => {
    if (ej.tipo === 'mc') {
      ej.items.forEach(it => {
        assert.ok(it.respuesta >= 0 && it.respuesta < it.opciones.length,
          `${ej.id}/${it.id}: respuesta fuera de rango`);
      });
    }
    if (ej.tipo === 'multi') {
      assert.ok(ej.respuestas.length >= 2, `${ej.id}: multi debería tener 2 o más correctas`);
      ej.respuestas.forEach(r => {
        assert.ok(r >= 0 && r < ej.opciones.length, `${ej.id}: respuesta ${r} fuera de rango`);
      });
    }
    if (ej.tipo === 'tf') {
      ej.items.forEach(it => {
        assert.ok(['T', 'F'].includes(it.respuesta), `${ej.id}/${it.id}: respuesta debe ser T o F`);
      });
    }
  }));
});

test('los diagramas que se piden existen, con un punto por ítem', () => {
  const Anatomia = require('../_componentes/anatomia.js');
  const dir = path.join(__dirname, '..', 'natural-science', 'examen-01-human-body', 'img');
  SECCIONES.forEach(sec => sec.ejercicios
    .filter(e => e.presentacion === 'diagrama')
    .forEach(ej => {
      const d = Anatomia.DIAGRAMAS[ej.diagrama];
      assert.ok(d, `${ej.id}: Anatomia no define "${ej.diagrama}"`);
      assert.strictEqual(d.puntos.length, ej.items.length,
        `${ej.id}: el diagrama tiene ${d.puntos.length} puntos y el ejercicio ${ej.items.length} huecos`);
      // La numeración del dibujo tiene que casar con la etiqueta de cada hueco.
      ej.items.forEach((it, i) => {
        assert.strictEqual(String(d.puntos[i].n), String(it.etiqueta),
          `${ej.id}: el punto ${i + 1} del diagrama no coincide con la etiqueta "${it.etiqueta}"`);
      });
      // Y los puntos deben caer dentro de la imagen.
      d.puntos.forEach(p => {
        assert.ok(p.x >= 0 && p.x <= 100 && p.y >= 0 && p.y <= 100,
          `${ej.id}: el punto ${p.n} se sale de la imagen (${p.x}%, ${p.y}%)`);
      });
      assert.ok(fs.existsSync(path.join(dir, d.archivo)),
        `${ej.id}: falta la imagen ${d.archivo}`);
    }));
});

test('el examen suma 68 ítems puntuables', () => {
  const total = SECCIONES.reduce((t, sec) => t + sec.ejercicios
    .reduce((s, ej) => s + (ej.tipo === 'multi' ? 1 : ej.items.length), 0), 0);
  assert.strictEqual(total, 68);
});
