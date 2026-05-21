// Vista para padres: historial de intentos por examen + estadísticas básicas.
// Lee de Almacen, no toca localStorage directamente.

(function () {
  const perfil = Almacen.getPerfil();
  const racha = Almacen.getRacha();
  const sub = document.getElementById('dash-subtitle');
  if (perfil.nombre) sub.textContent = `Progreso de ${perfil.nombre}`;

  const main = document.getElementById('dash-main');

  // --- Resumen ---
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

  function renderExamenes() {
    return EXAMENES.map(e => {
      const intentos = Almacen.getIntentos(e.id);
      const mejor = Almacen.mejorIntento(e.id);
      const estrellas = mejor ? Estrellas.calcular(mejor.correctas, mejor.total) : 0;

      const cuerpo = intentos.length
        ? renderTabla(intentos)
        : '<div class="dash-vacio">Aún no ha hecho este examen.</div>';

      return `
        <section class="dash-tarjeta">
          <h2>${e.emoji} ${e.titulo} ${Estrellas.render(estrellas)}</h2>
          <p style="color:#555;font-size:0.95rem;">${e.descripcion}</p>
          ${cuerpo}
        </section>`;
    }).join('');
  }

  function renderTabla(intentos) {
    return `
      <table class="intentos-tabla">
        <thead>
          <tr><th>Fecha</th><th>Aciertos</th><th>Nota</th><th>Estrellas</th></tr>
        </thead>
        <tbody>
          ${intentos.map(it => {
            const pct = Math.round((it.correctas / it.total) * 100);
            const cls = pct >= 80 ? 'alto' : pct >= 50 ? 'medio' : 'bajo';
            const est = Estrellas.calcular(it.correctas, it.total);
            return `
              <tr>
                <td>${formatearFecha(it.fecha)}</td>
                <td>${it.correctas} / ${it.total}</td>
                <td><span class="pct-pill ${cls}">${pct}%</span></td>
                <td>${Estrellas.render(est)}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>`;
  }

  function formatearFecha(iso) {
    const d = new Date(iso);
    const fecha = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    const hora = d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    return `${fecha} · ${hora}`;
  }
})();
