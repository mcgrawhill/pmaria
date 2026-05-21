// Vista para padres: historial de intentos por examen + desglose por sección.
// Lee de Almacen, no toca localStorage directamente.

(function () {
  const perfil = Almacen.getPerfil();
  const racha = Almacen.getRacha();
  const sub = document.getElementById('dash-subtitle');
  if (perfil.nombre) sub.textContent = `Progreso de ${perfil.nombre}`;

  const main = document.getElementById('dash-main');

  const todosIntentos = EXAMENES.flatMap(e => Almacen.getIntentos(e.id));
  const totalIntentos = todosIntentos.length;
  const totalCorrectas = todosIntentos.reduce((s, i) => s + i.correctas, 0);
  const totalPreguntas = todosIntentos.reduce((s, i) => s + i.total, 0);
  const pctMedio = totalPreguntas ? Math.round((totalCorrectas / totalPreguntas) * 100) : 0;

  main.innerHTML = `
    <section class="dash-tarjeta">
      <h2>📊 Resumen</h2>
      <div class="resumen-grid">
        <div class="resumen-celda">
          <div class="num">${totalIntentos}</div>
          <div class="label">Intentos totales</div>
        </div>
        <div class="resumen-celda">
          <div class="num">${pctMedio}%</div>
          <div class="label">Media de aciertos</div>
        </div>
        <div class="resumen-celda">
          <div class="num">🔥 ${racha.dias}</div>
          <div class="label">Racha (días)</div>
        </div>
      </div>
      ${renderDesgloseGlobal(todosIntentos)}
    </section>
    ${renderExamenes()}
    <div class="acciones">
      <button type="button" class="boton-peligro" id="btn-limpiar">🗑️ Borrar historial</button>
    </div>`;

  document.getElementById('btn-limpiar').addEventListener('click', () => {
    if (confirm('¿Borrar todo el historial de intentos? Esta acción no se puede deshacer.')) {
      Almacen.limpiarHistorial();
      location.reload();
    }
  });

  // ----- DESGLOSE GLOBAL DE TEMAS (suma de todas las secciones de todos los intentos) -----
  function renderDesgloseGlobal(intentos) {
    const acumulado = {};
    intentos.forEach(it => {
      const sec = it.porSeccion || {};
      Object.entries(sec).forEach(([id, info]) => {
        if (!acumulado[id]) acumulado[id] = { titulo: info.titulo, emoji: info.emoji, aciertos: 0, total: 0 };
        acumulado[id].aciertos += info.aciertos;
        acumulado[id].total += info.total;
      });
    });
    const filas = Object.values(acumulado);
    if (!filas.length) return '';
    return `
      <h3 style="margin-top:1.5rem;margin-bottom:0.5rem;">Por tema</h3>
      <div class="temas-grid">
        ${filas.map(f => {
          const pct = f.total ? Math.round((f.aciertos / f.total) * 100) : 0;
          const cls = pct >= 80 ? 'alto' : pct >= 50 ? 'medio' : 'bajo';
          return `
            <div class="tema-tarjeta">
              <div class="tema-titulo">${f.emoji} ${f.titulo}</div>
              <div class="tema-barra-wrap"><div class="tema-barra ${cls}" style="width:${pct}%"></div></div>
              <div class="tema-detalle">${f.aciertos} / ${f.total} (${pct}%)</div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderExamenes() {
    return EXAMENES.map(e => {
      const intentos = Almacen.getIntentos(e.id);
      const mejorFijo = Almacen.mejorIntento(e.id, { modo: 'fijo' });
      const estrellas = mejorFijo ? Estrellas.calcular(mejorFijo.correctas, mejorFijo.total) : 0;

      const cuerpo = intentos.length
        ? renderTabla(intentos)
        : '<div class="dash-vacio">Aún no ha hecho este examen.</div>';

      return `
        <section class="dash-tarjeta">
          <h2>${e.emoji} ${e.titulo} ${Estrellas.render(estrellas)}</h2>
          <p style="color:#555;font-size:0.95rem;">${e.descripcion}</p>
          ${mejorFijo
            ? `<p style="color:#555;font-size:0.9rem;margin-top:0.3rem;">Las ⭐ miden el mejor intento del modo fijo.</p>`
            : ''}
          ${cuerpo}
        </section>`;
    }).join('');
  }

  function renderTabla(intentos) {
    return `
      <table class="intentos-tabla">
        <thead>
          <tr><th>Fecha</th><th>Modo</th><th>Aciertos</th><th>Nota</th><th>Por sección</th></tr>
        </thead>
        <tbody>
          ${intentos.map(it => {
            const pct = Math.round((it.correctas / it.total) * 100);
            const clsPct = pct >= 80 ? 'alto' : pct >= 50 ? 'medio' : 'bajo';
            const modo = it.modo || 'fijo';
            const badge = modo === 'aleatorio'
              ? '<span class="modo-pill aleatorio">🎲 Aleatorio</span>'
              : '<span class="modo-pill fijo">📋 Fijo</span>';
            return `
              <tr>
                <td>${formatearFecha(it.fecha)}</td>
                <td>${badge}</td>
                <td>${it.correctas} / ${it.total}</td>
                <td><span class="pct-pill ${clsPct}">${pct}%</span></td>
                <td>${renderPorSeccion(it.porSeccion)}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`;
  }

  function renderPorSeccion(porSeccion) {
    if (!porSeccion) return '<span style="color:#999;">—</span>';
    const filas = Object.values(porSeccion);
    return `<div class="por-seccion">${filas.map(f => {
      const ok = f.aciertos === f.total;
      const fallos = f.total - f.aciertos;
      const cls = ok ? 'sec-ok' : fallos > f.total / 2 ? 'sec-mal' : 'sec-medio';
      return `<span class="sec-chip ${cls}" title="${f.aciertos} de ${f.total} acertados">${f.emoji} ${f.aciertos}/${f.total}</span>`;
    }).join('')}</div>`;
  }

  function formatearFecha(iso) {
    const d = new Date(iso);
    const fecha = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const hora = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${fecha} · ${hora}`;
  }
})();
