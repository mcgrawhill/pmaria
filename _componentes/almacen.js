// =====================================================
// Almacén — única puerta de acceso a localStorage
// =====================================================
// Centraliza perfil, historial de intentos y racha diaria
// para que el resto del código no toque localStorage directamente.

const Almacen = {
  CLAVES: {
    perfil: 'alana.perfil',
    historial: 'alana.historial',
    racha: 'alana.racha',
  },

  // ---------- PERFIL ----------
  getPerfil() {
    return this._leer(this.CLAVES.perfil, { nombre: '', avatar: '👧' });
  },

  setPerfil(perfil) {
    const actual = this.getPerfil();
    this._guardar(this.CLAVES.perfil, { ...actual, ...perfil });
  },

  // ---------- HISTORIAL DE INTENTOS ----------
  // Estructura: { [examenId]: [{ fecha, correctas, total, errores: [ejId] }, ...] }

  getHistorial() {
    return this._leer(this.CLAVES.historial, {});
  },

  getIntentos(examenId) {
    return (this.getHistorial()[examenId] || []).slice().reverse();
  },

  mejorIntento(examenId) {
    const lista = this.getIntentos(examenId);
    if (!lista.length) return null;
    return lista.reduce((mejor, it) => {
      const pct = it.correctas / it.total;
      const mejorPct = mejor ? mejor.correctas / mejor.total : -1;
      return pct > mejorPct ? it : mejor;
    }, null);
  },

  addIntento(examenId, intento) {
    const historial = this.getHistorial();
    if (!historial[examenId]) historial[examenId] = [];
    historial[examenId].push({
      fecha: new Date().toISOString(),
      correctas: intento.correctas,
      total: intento.total,
      errores: intento.errores || [],
    });
    this._guardar(this.CLAVES.historial, historial);
    this._tocarRacha();
  },

  limpiarHistorial() {
    this._guardar(this.CLAVES.historial, {});
  },

  // ---------- RACHA DIARIA ----------
  // Aumenta cada día que el niño completa al menos un intento.

  getRacha() {
    return this._leer(this.CLAVES.racha, { dias: 0, ultimoDia: null });
  },

  _tocarRacha() {
    const hoy = this._diaActual();
    const racha = this.getRacha();
    if (racha.ultimoDia === hoy) return;
    const ayer = this._diaPrevio(hoy);
    racha.dias = racha.ultimoDia === ayer ? racha.dias + 1 : 1;
    racha.ultimoDia = hoy;
    this._guardar(this.CLAVES.racha, racha);
  },

  _diaActual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },

  _diaPrevio(iso) {
    const d = new Date(iso + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    return this._diaActual.call({ _diaActual: () => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` });
  },

  // ---------- INTERNO ----------
  _leer(clave, porDefecto) {
    try {
      const raw = localStorage.getItem(clave);
      return raw ? JSON.parse(raw) : porDefecto;
    } catch {
      return porDefecto;
    }
  },

  _guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      // localStorage lleno o bloqueado: ignorar silenciosamente
    }
  },
};
