// Tests del cronómetro. No usamos timers reales para no ralentizar los tests.

const test = require('node:test');
const assert = require('node:assert/strict');
const Cronometro = require('../_componentes/cronometro.js');

test.beforeEach(() => Cronometro.reset());

test('start + getMs: avanza con el tiempo', async () => {
  Cronometro.start();
  await new Promise(r => setTimeout(r, 30));
  const ms = Cronometro.getMs();
  assert.ok(ms >= 20 && ms < 200, `ms inesperado: ${ms}`);
});

test('start con acumulado inicial: arranca desde ese valor', async () => {
  Cronometro.start(5000);
  await new Promise(r => setTimeout(r, 10));
  const ms = Cronometro.getMs();
  assert.ok(ms >= 5000 && ms < 5300, `ms=${ms}`);
});

test('stop: detiene y devuelve el total', async () => {
  Cronometro.start();
  await new Promise(r => setTimeout(r, 20));
  const total = Cronometro.stop();
  await new Promise(r => setTimeout(r, 30));
  // Después de stop, getMs ya no avanza.
  assert.equal(Cronometro.getMs(), total);
});

test('pause/resume: no cuenta el tiempo en pausa', async () => {
  Cronometro.start();
  await new Promise(r => setTimeout(r, 20));
  Cronometro.pause();
  const enPausa = Cronometro.getMs();
  await new Promise(r => setTimeout(r, 30));
  // En pausa el tiempo no avanza.
  assert.equal(Cronometro.getMs(), enPausa);
  Cronometro.resume();
  await new Promise(r => setTimeout(r, 20));
  assert.ok(Cronometro.getMs() > enPausa);
});

test('formato: 0..59s muestra sólo segundos', () => {
  assert.equal(Cronometro.formato(0), '0s');
  assert.equal(Cronometro.formato(5000), '5s');
  assert.equal(Cronometro.formato(59000), '59s');
});

test('formato: 60s+ muestra m + ss con cero a la izquierda', () => {
  assert.equal(Cronometro.formato(60000), '1m 00s');
  assert.equal(Cronometro.formato(75000), '1m 15s');
  assert.equal(Cronometro.formato(125000), '2m 05s');
});

test('formato: valores inválidos devuelven guion', () => {
  assert.equal(Cronometro.formato(null), '–');
  assert.equal(Cronometro.formato(NaN), '–');
});

test('reset: vuelve a cero', () => {
  Cronometro.start(1000);
  Cronometro.stop();
  Cronometro.reset();
  assert.equal(Cronometro.getMs(), 0);
});
