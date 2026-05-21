// =====================================================
// Estrellas — cálculo y render de calificación 1-3 ⭐
// =====================================================

const Estrellas = {
  // 0 → ninguna, 1-49% → 1 estrella, 50-79% → 2, 80%+ → 3.
  calcular(correctas, total) {
    if (!total) return 0;
    const pct = (correctas / total) * 100;
    if (pct >= 80) return 3;
    if (pct >= 50) return 2;
    if (pct > 0) return 1;
    return 0;
  },

  // Devuelve HTML con `max` estrellas (rellenas o vacías).
  render(n, max = 3) {
    let html = '<span class="estrellas" aria-label="' + n + ' de ' + max + ' estrellas">';
    for (let i = 0; i < max; i++) {
      html += i < n ? '<span class="estrella-on">★</span>' : '<span class="estrella-off">☆</span>';
    }
    html += '</span>';
    return html;
  },
};
