// Tests del Almacén. Mock simple de localStorage porque Node no lo trae.

const test = require('node:test');
const assert = require('node:assert/strict');

// localStorage mock global (suficiente para que Almacen funcione).
class StorageFake {
  constructor() { this.s = new Map(); }
  getItem(k) { return this.s.has(k) ? this.s.get(k) : null; }
  setItem(k, v) { this.s.set(k, String(v)); }
  removeItem(k) { this.s.delete(k); }
  clear() { this.s.clear(); }
}
global.localStorage = new StorageFake();

const Almacen = require('../_componentes/almacen.js');

test.beforeEach(() => global.localStorage.clear());

test('perfil: por defecto vacío', () => {
  assert.equal(Almacen.getPerfil().nombre, '');
});

test('perfil: setPerfil persiste y mantiene avatar al pasar solo nombre', () => {
  Almacen.setPerfil({ nombre: 'Ana', avatar: '🦊' });
  Almacen.setPerfil({ nombre: 'Ana María' });
  const p = Almacen.getPerfil();
  assert.equal(p.nombre, 'Ana María');
  assert.equal(p.avatar, '🦊');
});

test('addIntento: guarda modo fijo por defecto', () => {
  Almacen.addIntento('ex1', { correctas: 3, total: 5 });
  const lista = Almacen.getIntentos('ex1');
  assert.equal(lista.length, 1);
  assert.equal(lista[0].modo, 'fijo');
  assert.equal(lista[0].correctas, 3);
});

test('addIntento: respeta modo aleatorio', () => {
  Almacen.addIntento('ex1', { correctas: 2, total: 5, modo: 'aleatorio' });
  const lista = Almacen.getIntentos('ex1');
  assert.equal(lista[0].modo, 'aleatorio');
});

test('getIntentos: filtra por modo', () => {
  Almacen.addIntento('ex1', { correctas: 5, total: 5, modo: 'fijo' });
  Almacen.addIntento('ex1', { correctas: 3, total: 5, modo: 'aleatorio' });
  Almacen.addIntento('ex1', { correctas: 4, total: 5, modo: 'fijo' });
  assert.equal(Almacen.getIntentos('ex1').length, 3);
  assert.equal(Almacen.getIntentos('ex1', { modo: 'fijo' }).length, 2);
  assert.equal(Almacen.getIntentos('ex1', { modo: 'aleatorio' }).length, 1);
});

test('mejorIntento: devuelve el de mayor %', () => {
  Almacen.addIntento('ex1', { correctas: 3, total: 10 });
  Almacen.addIntento('ex1', { correctas: 8, total: 10 });
  Almacen.addIntento('ex1', { correctas: 5, total: 10 });
  const mejor = Almacen.mejorIntento('ex1');
  assert.equal(mejor.correctas, 8);
});

test('mejorIntento: filtra por modo (modo fijo)', () => {
  Almacen.addIntento('ex1', { correctas: 9, total: 10, modo: 'aleatorio' });
  Almacen.addIntento('ex1', { correctas: 5, total: 10, modo: 'fijo' });
  const mejorFijo = Almacen.mejorIntento('ex1', { modo: 'fijo' });
  assert.equal(mejorFijo.correctas, 5);
  const mejorAleat = Almacen.mejorIntento('ex1', { modo: 'aleatorio' });
  assert.equal(mejorAleat.correctas, 9);
});

test('addIntento: guarda porSeccion', () => {
  Almacen.addIntento('ex1', {
    correctas: 3, total: 5,
    porSeccion: { fracciones: { titulo: 'Fracciones', emoji: '🍕', aciertos: 3, total: 5 } },
  });
  const lista = Almacen.getIntentos('ex1');
  assert.deepEqual(lista[0].porSeccion.fracciones, {
    titulo: 'Fracciones', emoji: '🍕', aciertos: 3, total: 5,
  });
});

test('intentos antiguos sin modo se tratan como fijo', () => {
  // Simulamos un intento antiguo escrito directamente sin campo modo.
  const historial = { ex1: [{ fecha: '2026-01-01', correctas: 4, total: 5 }] };
  global.localStorage.setItem(Almacen.CLAVES.historial, JSON.stringify(historial));
  const lista = Almacen.getIntentos('ex1', { modo: 'fijo' });
  assert.equal(lista.length, 1);
});

test('limpiarHistorial: vacía el historial', () => {
  Almacen.addIntento('ex1', { correctas: 1, total: 1 });
  Almacen.limpiarHistorial();
  assert.equal(Almacen.getIntentos('ex1').length, 0);
});

// ---------- BORRADORES ----------

test('borrador: null si no existe', () => {
  assert.equal(Almacen.getBorrador('ex1::fijo'), null);
});

test('borrador: set + get devuelve los datos', () => {
  Almacen.setBorrador('ex1::fijo', { seccion: 2, totalCorrectas: 8 });
  const b = Almacen.getBorrador('ex1::fijo');
  assert.equal(b.seccion, 2);
  assert.equal(b.totalCorrectas, 8);
  assert.ok(b.fecha, 'la fecha se rellena automáticamente');
});

test('borrador: borrar lo elimina', () => {
  Almacen.setBorrador('ex1::fijo', { seccion: 1 });
  Almacen.borrarBorrador('ex1::fijo');
  assert.equal(Almacen.getBorrador('ex1::fijo'), null);
});

test('listarBorradores: solo los del examen indicado', () => {
  Almacen.setBorrador('ex1::fijo', { seccion: 1 });
  Almacen.setBorrador('ex1::aleatorio::42', { seccion: 2 });
  Almacen.setBorrador('ex2::fijo', { seccion: 3 });
  const e1 = Almacen.listarBorradores('ex1');
  assert.equal(e1.length, 2);
  const modos = e1.map(b => b.modo).sort();
  assert.deepEqual(modos, ['aleatorio', 'fijo']);
  const aleat = e1.find(b => b.modo === 'aleatorio');
  assert.equal(aleat.semilla, '42');
});
