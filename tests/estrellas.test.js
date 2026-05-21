const test = require('node:test');
const assert = require('node:assert/strict');
const Estrellas = require('../_componentes/estrellas.js');

test('calcular: 0 sin total', () => {
  assert.equal(Estrellas.calcular(0, 0), 0);
});

test('calcular: 0 correctas → 0 estrellas', () => {
  assert.equal(Estrellas.calcular(0, 10), 0);
});

test('calcular: 1-49% → 1 estrella', () => {
  assert.equal(Estrellas.calcular(1, 10), 1);
  assert.equal(Estrellas.calcular(4, 10), 1);
});

test('calcular: 50-79% → 2 estrellas', () => {
  assert.equal(Estrellas.calcular(5, 10), 2);
  assert.equal(Estrellas.calcular(7, 10), 2);
});

test('calcular: 80%+ → 3 estrellas', () => {
  assert.equal(Estrellas.calcular(8, 10), 3);
  assert.equal(Estrellas.calcular(10, 10), 3);
});

test('render: tantas estrellas rellenas como n', () => {
  const html = Estrellas.render(2);
  const rellenas = (html.match(/estrella-on/g) || []).length;
  const vacias = (html.match(/estrella-off/g) || []).length;
  assert.equal(rellenas, 2);
  assert.equal(vacias, 1);
});
