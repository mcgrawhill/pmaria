// =====================================================
// FIGURAS SVG reutilizables para exámenes de matemáticas
// Estilo: EMAT (libro de 3.º-4.º Primaria)
// =====================================================
// Uso: cargar antes que el script del examen.
// Las funciones devuelven STRINGS de HTML/SVG.

const Figuras = {
  // Círculo dividido en `den` sectores con `num` coloreados (pizza).
  fraccionCirculo(num, den, color = '#fd9644') {
    const cx = 100, cy = 100, r = 90;
    const sectores = [];
    for (let i = 0; i < den; i++) {
      const a0 = (i / den) * 2 * Math.PI - Math.PI / 2;
      const a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
      const x0 = cx + r * Math.cos(a0);
      const y0 = cy + r * Math.sin(a0);
      const x1 = cx + r * Math.cos(a1);
      const y1 = cy + r * Math.sin(a1);
      const grande = (1 / den) > 0.5 ? 1 : 0;
      const fill = i < num ? color : '#ffffff';
      sectores.push(
        `<path d="M ${cx} ${cy} L ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${grande} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z" fill="${fill}" stroke="#2d3436" stroke-width="2.5"/>`
      );
    }
    return `<svg class="figura figura-pequena" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fracción ${num} de ${den}">
      ${sectores.join('')}
    </svg>`;
  },

  // Rectángulo dividido en partes verticales (barra).
  fraccionBarra(num, den, color = '#a29bfe') {
    const ancho = 240, alto = 80;
    const w = ancho / den;
    let trozos = '';
    for (let i = 0; i < den; i++) {
      const fill = i < num ? color : '#ffffff';
      trozos += `<rect x="${i * w}" y="0" width="${w}" height="${alto}" fill="${fill}" stroke="#2d3436" stroke-width="2.5"/>`;
    }
    return `<svg class="figura" viewBox="0 0 ${ancho} ${alto}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Fracción ${num} de ${den}">
      ${trozos}
    </svg>`;
  },

  // Fracción dibujada (no editable) en formato a/b con barra horizontal.
  fraccionTexto(num, den) {
    return `<span class="fraccion-texto"><span class="num">${num}</span><span class="barra-fraccion"></span><span class="den">${den}</span></span>`;
  },

  // Cuadrícula con figura coloreada para calcular áreas.
  // tipo: 'rect' | 'rect-diag' | 'L' | 'triangulo'
  areaCuadricula(opts) {
    const { cols, filas, tipo, color = '#74b9ff', borde = '#0984e3' } = opts;
    const lado = 28;
    const ancho = cols * lado;
    const alto = filas * lado;
    const padding = 6;
    let figura = '';

    if (tipo === 'rect') {
      figura = `<rect x="0" y="0" width="${ancho}" height="${alto}" fill="${color}" opacity="0.55" stroke="${borde}" stroke-width="3"/>`;
    } else if (tipo === 'rect-diag') {
      figura = `<rect x="0" y="0" width="${ancho}" height="${alto}" fill="none" stroke="${borde}" stroke-width="3"/>
                <polygon points="0,0 ${ancho},0 0,${alto}" fill="${color}" opacity="0.55"/>
                <line x1="${ancho}" y1="0" x2="0" y2="${alto}" stroke="${borde}" stroke-width="3"/>`;
    } else if (tipo === 'triangulo') {
      figura = `<polygon points="0,${alto} ${ancho},${alto} 0,0" fill="${color}" opacity="0.55" stroke="${borde}" stroke-width="3"/>`;
    } else if (tipo === 'L') {
      const cortarX = opts.cortarX || Math.floor(cols / 2);
      const cortarY = opts.cortarY || Math.floor(filas / 2);
      figura = `<polygon points="0,0 ${cortarX * lado},0 ${cortarX * lado},${cortarY * lado} ${ancho},${cortarY * lado} ${ancho},${alto} 0,${alto}" fill="${color}" opacity="0.55" stroke="${borde}" stroke-width="3"/>`;
    }

    let cuadricula = '';
    for (let i = 0; i <= cols; i++) {
      cuadricula += `<line x1="${i * lado}" y1="0" x2="${i * lado}" y2="${alto}" stroke="#999" stroke-width="1" opacity="0.6"/>`;
    }
    for (let j = 0; j <= filas; j++) {
      cuadricula += `<line x1="0" y1="${j * lado}" x2="${ancho}" y2="${j * lado}" stroke="#999" stroke-width="1" opacity="0.6"/>`;
    }

    return `<svg class="figura" viewBox="${-padding} ${-padding} ${ancho + padding * 2} ${alto + padding * 2}" width="${ancho + padding * 2}" height="${alto + padding * 2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Figura en cuadrícula">
      ${figura}
      ${cuadricula}
    </svg>`;
  },

  // Figuras predefinidas para simetría.
  simetria(tipo, mostrarEje = false) {
    const ejeLinea = mostrarEje
      ? `<line x1="100" y1="10" x2="100" y2="190" stroke="#d63031" stroke-width="3" stroke-dasharray="6 6"/>`
      : '';
    let figura = '';

    if (tipo === 'mariposa') {
      figura = `
        <g fill="#fd79a8" stroke="#2d3436" stroke-width="2">
          <ellipse cx="65" cy="80" rx="35" ry="40"/>
          <ellipse cx="135" cy="80" rx="35" ry="40"/>
          <ellipse cx="65" cy="135" rx="28" ry="30"/>
          <ellipse cx="135" cy="135" rx="28" ry="30"/>
        </g>
        <line x1="100" y1="40" x2="100" y2="170" stroke="#2d3436" stroke-width="4"/>
        <circle cx="100" cy="35" r="8" fill="#2d3436"/>`;
    } else if (tipo === 'letraA') {
      figura = `<polygon points="100,30 60,170 80,170 90,140 110,140 120,170 140,170" fill="#74b9ff" stroke="#2d3436" stroke-width="3"/>
                <rect x="88" y="110" width="24" height="8" fill="#74b9ff" stroke="#2d3436" stroke-width="2"/>`;
    } else if (tipo === 'letraP') {
      figura = `<rect x="60" y="30" width="22" height="140" fill="#55efc4" stroke="#2d3436" stroke-width="3"/>
                <path d="M 82 30 L 120 30 A 30 30 0 0 1 120 90 L 82 90 Z" fill="#55efc4" stroke="#2d3436" stroke-width="3"/>`;
    } else if (tipo === 'corazon') {
      figura = `<path d="M 100 170 C 30 120 30 60 65 60 C 85 60 100 80 100 95 C 100 80 115 60 135 60 C 170 60 170 120 100 170 Z" fill="#ff7675" stroke="#2d3436" stroke-width="3"/>`;
    } else if (tipo === 'irregular') {
      figura = `<polygon points="40,60 130,40 170,90 150,150 80,170 30,120" fill="#fdcb6e" stroke="#2d3436" stroke-width="3"/>`;
    } else if (tipo === 'flecha') {
      figura = `<polygon points="40,90 120,90 120,60 170,100 120,140 120,110 40,110" fill="#a29bfe" stroke="#2d3436" stroke-width="3"/>`;
    } else if (tipo === 'pezVertical') {
      figura = `<ellipse cx="100" cy="100" rx="60" ry="30" fill="#fd9644" stroke="#2d3436" stroke-width="3"/>
                <polygon points="160,100 190,75 190,125" fill="#fd9644" stroke="#2d3436" stroke-width="3"/>
                <circle cx="75" cy="95" r="5" fill="#2d3436"/>`;
    }

    return `<svg class="figura figura-media" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Figura de simetría">
      ${figura}
      ${ejeLinea}
    </svg>`;
  },

  // Bolsa con bolas de colores para problemas de probabilidad.
  bolsa(distribucion) {
    const colores = { rojo: '#e74c3c', azul: '#3498db', verde: '#2ecc71', amarillo: '#f1c40f' };
    let bolas = '';
    distribucion.forEach(d => {
      for (let i = 0; i < d.cantidad; i++) {
        bolas += `<div class="bola" style="background:${colores[d.color]}" aria-label="Bola ${d.color}"></div>`;
      }
    });
    return `<div class="bolsa">
      <div class="bolsa-titulo">🎒 Bolsa</div>
      <div class="bolas-contenedor">${bolas}</div>
    </div>`;
  },

  // Tablero estilo "Hundir la flota" con letras y números.
  planoCartesiano(objetos, letras = 'ABCDEFGH', filas = 8) {
    const cols = letras.length;
    const lado = 38;
    const margenIzq = 32;
    const margenAbajo = 30;
    const margenArriba = 8;
    const margenDer = 8;
    const ancho = margenIzq + cols * lado + margenDer;
    const alto = margenArriba + filas * lado + margenAbajo;

    let celdas = '';
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const x = margenIzq + c * lado;
        const y = margenArriba + f * lado;
        const claro = (f + c) % 2 === 0;
        celdas += `<rect x="${x}" y="${y}" width="${lado}" height="${lado}" fill="${claro ? '#f7e7c4' : '#d2a679'}" stroke="#8b6f47" stroke-width="1"/>`;
      }
    }

    let etiquetasX = '';
    for (let c = 0; c < cols; c++) {
      const x = margenIzq + c * lado + lado / 2;
      etiquetasX += `<text x="${x}" y="${alto - 8}" text-anchor="middle" font-size="14" font-weight="700" fill="#2d3436" font-family="Fredoka, sans-serif">${letras[c]}</text>`;
    }

    let etiquetasY = '';
    for (let f = 0; f < filas; f++) {
      const y = margenArriba + (filas - 1 - f) * lado + lado / 2 + 5;
      etiquetasY += `<text x="14" y="${y}" text-anchor="middle" font-size="14" font-weight="700" fill="#2d3436" font-family="Fredoka, sans-serif">${f + 1}</text>`;
    }

    let dibujos = '';
    objetos.forEach(o => {
      const col = letras.indexOf(o.pos[0].toUpperCase());
      const fila = parseInt(o.pos.slice(1), 10);
      if (col < 0 || fila < 1 || fila > filas) return;
      const x = margenIzq + col * lado + lado / 2;
      const y = margenArriba + (filas - fila) * lado + lado / 2 + 9;
      dibujos += `<text x="${x}" y="${y}" text-anchor="middle" font-size="24">${o.emoji}</text>`;
    });

    return `<div class="plano-wrap"><svg class="figura" viewBox="0 0 ${ancho} ${alto}" width="${ancho}" height="${alto}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tablero plano cartesiano">
      ${celdas}
      ${etiquetasX}
      ${etiquetasY}
      ${dibujos}
    </svg></div>`;
  },
};
