// =====================================================
// Anatomía — diagramas SVG de los sistemas del cuerpo
// =====================================================
// Dibujos propios y esquemáticos (NO se usan imágenes del libro: tienen
// copyright y este repo es público). Cada diagrama lleva puntos numerados
// que el niño debe etiquetar; el número del círculo se corresponde con el
// índice de la ranura en el ejercicio.
//
// Todos devuelven un <svg> responsive (width 100%, viewBox fijo) para que
// se vea bien en móvil, que es donde más se usa.

const Anatomia = (function () {

  // Paleta suave, coherente con el resto de la app.
  const C = {
    piel: '#ffe0cc',
    trazo: '#2d3436',
    pulmon: '#fab1a7',
    pulmonOsc: '#e8857c',
    organo: '#ffd3b6',
    musculo: '#ff9aa2',
    tubo: '#ffeaa7',
    rinon: '#c8a2c8',
    vejiga: '#a8e6cf',
    utero: '#ffc8dd',
    fondo: '#ffffff',
  };

  // Punto numerado: círculo azul con el número dentro y una línea guía
  // hasta el órgano al que señala.
  function punto(n, x, y, ax, ay) {
    const linea = (ax !== undefined)
      ? `<line x1="${x}" y1="${y}" x2="${ax}" y2="${ay}" stroke="${C.trazo}" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.55"/>`
      : '';
    return `${linea}
      <g class="punto-anatomia" data-punto="${n}">
        <circle cx="${x}" cy="${y}" r="15" fill="#0984e3" stroke="#fff" stroke-width="3"/>
        <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central"
              fill="#fff" font-size="16" font-weight="700" font-family="Fredoka, sans-serif">${n}</text>
      </g>`;
  }

  function envolver(viewBox, contenido, titulo) {
    return `<svg class="diagrama" viewBox="${viewBox}" role="img" aria-label="${titulo}"
                 xmlns="http://www.w3.org/2000/svg">
      <title>${titulo}</title>
      ${contenido}
    </svg>`;
  }

  // ---------- 1. SISTEMA RESPIRATORIO ----------
  // Puntos: 1 nose · 2 mouth · 3 trachea · 4 bronchi · 5 lungs · 6 diaphragm · 7 alveoli
  function respiratorio() {
    return envolver('0 0 420 380', `
      <!-- cabeza de perfil mirando a la derecha: la nariz y la boca tienen que
           verse por separado, porque son dos etiquetas distintas -->
      <path d="M118 100
               C 118 46, 158 26, 194 30
               C 232 34, 252 62, 250 96
               C 249 106, 246 110, 248 114
               C 252 119, 268 125, 272 131
               C 274 135, 268 138, 258 138
               C 252 139, 250 143, 252 147
               C 254 151, 250 155, 244 157
               C 250 161, 252 167, 246 175
               C 238 187, 212 195, 190 192
               L 152 178
               C 130 162, 118 132, 118 100 Z"
            fill="${C.piel}" stroke="${C.trazo}" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- boca: línea entre los labios -->
      <path d="M243 153 q8 -2 12 -5" fill="none" stroke="${C.trazo}" stroke-width="2.5" stroke-linecap="round"/>
      <!-- fosa nasal -->
      <path d="M260 132 q5 1 6 4" fill="none" stroke="${C.trazo}" stroke-width="2" stroke-linecap="round"/>
      <!-- ojo -->
      <circle cx="222" cy="104" r="4" fill="${C.trazo}"/>
      <!-- cuello y hombros -->
      <path d="M176 190 h54 q8 32 60 42 v148 h-212 v-148 q50 -10 58 -42 z"
            fill="#eaf4ff" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- tráquea -->
      <rect x="212" y="150" width="20" height="62" rx="9" fill="${C.tubo}" stroke="${C.trazo}" stroke-width="2.5"/>
      <line x1="212" y1="164" x2="232" y2="164" stroke="${C.trazo}" stroke-width="1.5"/>
      <line x1="212" y1="178" x2="232" y2="178" stroke="${C.trazo}" stroke-width="1.5"/>
      <line x1="212" y1="192" x2="232" y2="192" stroke="${C.trazo}" stroke-width="1.5"/>
      <!-- bronquios -->
      <path d="M218 212 q-26 14 -34 34" fill="none" stroke="${C.trazo}" stroke-width="7" stroke-linecap="round"/>
      <path d="M226 212 q26 14 34 34" fill="none" stroke="${C.trazo}" stroke-width="7" stroke-linecap="round"/>
      <path d="M218 212 q-26 14 -34 34" fill="none" stroke="${C.tubo}" stroke-width="4" stroke-linecap="round"/>
      <path d="M226 212 q26 14 34 34" fill="none" stroke="${C.tubo}" stroke-width="4" stroke-linecap="round"/>
      <!-- pulmones -->
      <path d="M180 238 q-44 6 -50 56 q-6 52 24 70 q22 14 30 -10 q6 -44 4 -116 z"
            fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2.5"/>
      <path d="M264 238 q44 6 50 56 q6 52 -24 70 q-22 14 -30 -10 q-6 -44 -4 -116 z"
            fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- ramificaciones interiores -->
      <path d="M176 258 q-16 16 -18 40 M176 258 q-4 24 -2 46" fill="none"
            stroke="${C.pulmonOsc}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M268 258 q16 16 18 40 M268 258 q4 24 2 46" fill="none"
            stroke="${C.pulmonOsc}" stroke-width="2.5" stroke-linecap="round"/>
      <!-- diafragma -->
      <path d="M126 350 q96 30 192 0" fill="none" stroke="${C.musculo}" stroke-width="9" stroke-linecap="round"/>
      <path d="M126 350 q96 30 192 0" fill="none" stroke="${C.trazo}" stroke-width="2"/>
      <!-- alvéolos: lupa ampliada -->
      <circle cx="356" cy="286" r="40" fill="#fff" stroke="${C.trazo}" stroke-width="2.5"/>
      <circle cx="344" cy="278" r="9" fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2"/>
      <circle cx="364" cy="276" r="9" fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2"/>
      <circle cx="354" cy="296" r="9" fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2"/>
      <circle cx="372" cy="294" r="7" fill="${C.pulmon}" stroke="${C.trazo}" stroke-width="2"/>
      <line x1="300" y1="270" x2="320" y2="280" stroke="${C.trazo}" stroke-width="2" stroke-dasharray="4 3"/>

      ${punto(1, 360, 106, 276, 130)}
      ${punto(2, 360, 168, 252, 156)}
      ${punto(3, 96, 168, 208, 178)}
      ${punto(4, 60, 240, 202, 240)}
      ${punto(5, 60, 304, 142, 300)}
      ${punto(6, 112, 368, 168, 358)}
      ${punto(7, 392, 344, 368, 318)}
    `, 'Respiratory system diagram');
  }

  // ---------- 2. SISTEMA DIGESTIVO ----------
  // Puntos: 1 mouth · 2 oesophagus · 3 stomach · 4 small intestine · 5 large intestine · 6 anus
  function digestivo() {
    return envolver('0 0 420 420', `
      <!-- silueta -->
      <path d="M210 24 q34 0 34 34 q0 20 -14 30 q44 10 54 48 l12 96 q2 16 -14 18 q-14 2 -18 -14
               l-10 -54 v76 l14 148 q2 16 -16 16 q-14 0 -16 -14 l-14 -108 h-4 l-14 108
               q-2 14 -16 14 q-18 0 -16 -16 l14 -148 v-76 l-10 54 q-4 16 -18 14 q-16 -2 -14 -18
               l12 -96 q10 -38 54 -48 q-14 -10 -14 -30 q0 -34 34 -34 z"
            fill="${C.piel}" stroke="${C.trazo}" stroke-width="2.5" opacity="0.5"/>
      <!-- boca -->
      <ellipse cx="210" cy="66" rx="15" ry="9" fill="#ff8f8f" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- esófago -->
      <path d="M210 76 v62" fill="none" stroke="${C.tubo}" stroke-width="15" stroke-linecap="round"/>
      <path d="M210 76 v62" fill="none" stroke="${C.trazo}" stroke-width="2.5" fill-opacity="0"
            stroke-linecap="round" opacity="0.35"/>
      <!-- estómago -->
      <path d="M210 138 q40 -4 48 32 q8 38 -22 50 q-32 12 -42 -14 q-8 -22 4 -34 z"
            fill="${C.organo}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- intestino grueso: ascendente (dcha) + transverso + descendente (izda)
           + sigmoide, con las esquinas redondeadas para que no parezca un marco -->
      <path d="M272 320 V252 Q272 232 252 232 H168 Q148 232 148 252 V310
               Q148 330 168 334 Q196 340 206 350"
            fill="none" stroke="#b5838d" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- intestino delgado: bucles apretados dentro del marco del grueso -->
      <path d="M176 262 q20 -12 40 -2 q20 10 36 -2
               M172 284 q22 -12 42 -2 q20 10 38 -4
               M176 306 q20 -12 40 -2 q18 10 34 -2"
            fill="none" stroke="${C.musculo}" stroke-width="12" stroke-linecap="round"/>
      <!-- recto y ano -->
      <path d="M208 350 v22" fill="none" stroke="#b5838d" stroke-width="14" stroke-linecap="round"/>
      <circle cx="208" cy="382" r="9" fill="#b5838d" stroke="${C.trazo}" stroke-width="2.5"/>

      ${punto(1, 334, 62, 228, 66)}
      ${punto(2, 334, 112, 222, 108)}
      ${punto(3, 334, 172, 256, 176)}
      ${punto(4, 74, 290, 168, 290)}
      ${punto(5, 334, 250, 290, 272)}
      ${punto(6, 334, 382, 224, 382)}
    `, 'Digestive system diagram');
  }

  // ---------- 3. SISTEMA EXCRETOR ----------
  // Puntos: 1 kidney · 2 ureter · 3 bladder · 4 urethra
  function excretor() {
    return envolver('0 0 380 360', `
      <!-- riñones -->
      <path d="M150 70 q-30 -16 -46 6 q-16 24 -4 52 q10 24 32 18 q18 -6 18 -34 q0 -24 0 -42 z"
            fill="${C.rinon}" stroke="${C.trazo}" stroke-width="2.5"/>
      <path d="M230 70 q30 -16 46 6 q16 24 4 52 q-10 24 -32 18 q-18 -6 -18 -34 q0 -24 0 -42 z"
            fill="${C.rinon}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- uréteres -->
      <path d="M148 140 q8 54 32 76" fill="none" stroke="${C.tubo}" stroke-width="11" stroke-linecap="round"/>
      <path d="M232 140 q-8 54 -32 76" fill="none" stroke="${C.tubo}" stroke-width="11" stroke-linecap="round"/>
      <path d="M148 140 q8 54 32 76 M232 140 q-8 54 -32 76" fill="none"
            stroke="${C.trazo}" stroke-width="2" opacity="0.4"/>
      <!-- vejiga -->
      <path d="M190 218 q46 0 50 38 q4 36 -50 38 q-54 -2 -50 -38 q4 -38 50 -38 z"
            fill="${C.vejiga}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- uretra -->
      <path d="M190 294 v44" fill="none" stroke="${C.tubo}" stroke-width="11" stroke-linecap="round"/>
      <path d="M190 294 v44" fill="none" stroke="${C.trazo}" stroke-width="2" opacity="0.4"/>

      ${punto(1, 60, 86, 108, 92)}
      ${punto(2, 300, 160, 228, 170)}
      ${punto(3, 300, 256, 244, 256)}
      ${punto(4, 60, 320, 178, 326)}
    `, 'Excretory system diagram');
  }

  // ---------- 4. APARATO REPRODUCTOR MASCULINO ----------
  // Puntos: 1 penis · 2 testicles · 3 urethra
  function reproductorMasculino() {
    return envolver('0 0 340 300', `
      <!-- vejiga de referencia (sin etiquetar) -->
      <ellipse cx="170" cy="78" rx="46" ry="34" fill="${C.vejiga}" stroke="${C.trazo}" stroke-width="2.5"/>
      <text x="170" y="82" text-anchor="middle" font-size="13" font-family="Fredoka, sans-serif"
            fill="${C.trazo}" opacity="0.65">bladder</text>
      <!-- conducto / uretra -->
      <path d="M170 112 v56 q0 14 -14 18" fill="none" stroke="${C.tubo}" stroke-width="12" stroke-linecap="round"/>
      <path d="M170 112 v56 q0 14 -14 18" fill="none" stroke="${C.trazo}" stroke-width="2" opacity="0.4"/>
      <!-- pene -->
      <path d="M156 168 q-56 6 -74 30 q-10 14 4 24 q14 8 28 -4 q22 -18 46 -22 z"
            fill="${C.piel}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- testículos -->
      <ellipse cx="146" cy="238" rx="26" ry="32" fill="${C.piel}" stroke="${C.trazo}" stroke-width="2.5"/>
      <ellipse cx="196" cy="238" rx="26" ry="32" fill="${C.piel}" stroke="${C.trazo}" stroke-width="2.5"/>

      ${punto(1, 40, 162, 92, 190)}
      ${punto(2, 290, 252, 224, 244)}
      ${punto(3, 290, 140, 180, 148)}
    `, 'Male reproductive system diagram');
  }

  // ---------- 5. APARATO REPRODUCTOR FEMENINO ----------
  // Puntos: 1 ovary · 2 Fallopian tubes · 3 uterus · 4 vagina · 5 vulva
  function reproductorFemenino() {
    return envolver('0 0 380 320', `
      <!-- útero -->
      <path d="M190 96 q54 6 58 62 q4 44 -26 58 h-64 q-30 -14 -26 -58 q4 -56 58 -62 z"
            fill="${C.utero}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- trompas -->
      <path d="M150 104 q-44 -34 -74 -8" fill="none" stroke="${C.utero}" stroke-width="11" stroke-linecap="round"/>
      <path d="M230 104 q44 -34 74 -8" fill="none" stroke="${C.utero}" stroke-width="11" stroke-linecap="round"/>
      <path d="M150 104 q-44 -34 -74 -8 M230 104 q44 -34 74 -8" fill="none"
            stroke="${C.trazo}" stroke-width="2" opacity="0.4"/>
      <!-- flecos de las trompas -->
      <path d="M76 96 l-12 -8 M76 96 l-14 2 M76 96 l-8 12" stroke="${C.trazo}" stroke-width="2" stroke-linecap="round"/>
      <path d="M304 96 l12 -8 M304 96 l14 2 M304 96 l8 12" stroke="${C.trazo}" stroke-width="2" stroke-linecap="round"/>
      <!-- ovarios -->
      <ellipse cx="68" cy="118" rx="22" ry="15" fill="#f4a9c0" stroke="${C.trazo}" stroke-width="2.5"/>
      <ellipse cx="312" cy="118" rx="22" ry="15" fill="#f4a9c0" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- cuello y vagina -->
      <path d="M190 216 v22" fill="none" stroke="${C.utero}" stroke-width="20" stroke-linecap="round"/>
      <path d="M190 238 q-20 24 0 48 q20 -24 0 -48 z" fill="${C.utero}" stroke="${C.trazo}" stroke-width="2.5"/>
      <!-- vulva -->
      <path d="M190 286 q-16 10 0 24 q16 -14 0 -24 z" fill="#f4a9c0" stroke="${C.trazo}" stroke-width="2.5"/>

      ${punto(1, 34, 170, 60, 134)}
      ${punto(2, 148, 36, 120, 84)}
      ${punto(3, 340, 196, 240, 170)}
      ${punto(4, 60, 256, 174, 258)}
      ${punto(5, 340, 300, 204, 298)}
    `, 'Female reproductive system diagram');
  }

  return {
    respiratorio, digestivo, excretor,
    reproductorMasculino, reproductorFemenino,
  };
})();

window.Anatomia = Anatomia;
if (typeof module !== 'undefined' && module.exports) module.exports = Anatomia;
