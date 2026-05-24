// =====================================================
// Cronometro — medidor de tiempo silencioso (o visible)
// =====================================================
// Mide el tiempo entre start() y stop(). No penaliza, solo informa.
// Permite acumular en pausas (útil al cargar un borrador).
// Compatible con navegador y Node (para tests).

const Cronometro = (function () {
  const ahora = () => (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();

  let inicio = 0;
  let acumulado = 0;
  let activo = false;
  let intervaloUI = null;
  let elementoUI = null;

  // Inicia el cronómetro. Acepta un acumulado inicial (al continuar un borrador).
  function start(acumuladoInicial = 0) {
    inicio = ahora();
    acumulado = acumuladoInicial;
    activo = true;
  }

  // Para definitivamente y devuelve el tiempo total en ms.
  function stop() {
    if (activo) {
      acumulado += ahora() - inicio;
      activo = false;
    }
    detenerUI();
    return acumulado;
  }

  function pause() {
    if (activo) {
      acumulado += ahora() - inicio;
      activo = false;
    }
  }

  function resume() {
    if (!activo) {
      inicio = ahora();
      activo = true;
    }
  }

  function getMs() {
    return activo ? acumulado + (ahora() - inicio) : acumulado;
  }

  function reset() {
    inicio = 0;
    acumulado = 0;
    activo = false;
    detenerUI();
  }

  // Formatea ms a "Xs" o "Xm YYs" — pensado para mostrar a niños.
  function formato(ms) {
    if (ms == null || isNaN(ms)) return '–';
    const segTot = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(segTot / 60);
    const s = segTot % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${String(s).padStart(2, '0')}s`;
  }

  // Vincula un elemento del DOM para que se actualice cada segundo.
  function bindUI(el) {
    elementoUI = el;
    detenerUI();
    if (!el) return;
    const refresca = () => { if (elementoUI) elementoUI.textContent = formato(getMs()); };
    refresca();
    intervaloUI = setInterval(refresca, 1000);
  }

  function detenerUI() {
    if (intervaloUI) {
      clearInterval(intervaloUI);
      intervaloUI = null;
    }
  }

  return { start, stop, pause, resume, getMs, reset, formato, bindUI, detenerUI };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = Cronometro;
