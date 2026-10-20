// =====================================================
// Anatomía — diagramas de los sistemas del cuerpo
// =====================================================
// Son las mismas láminas mudas del examen de clase (extraídas del PDF de la
// unidad y recortadas), para que lo que practica sea idéntico a lo que verá
// en la prueba. Sobre cada caja vacía del dibujo se coloca un número, y el
// ejercicio pide decir qué va en cada número.
//
// Las coordenadas de los puntos van en % del ancho/alto de la imagen, así
// que siguen cuadrando a cualquier tamaño de pantalla.
//
// Para añadir un diagrama: recorta la lámina, guárdala en la carpeta `img/`
// del examen y añade aquí su entrada con el centro de cada caja en %.

const Anatomia = (function () {

  const DIAGRAMAS = {
    respiratorio: {
      archivo: 'respiratorio.webp', w: 760, h: 1088,
      alt: 'Respiratory system diagram with seven empty labels',
      puntos: [
        { n: 1, x: 82.5, y: 5.1 },    // nose
        { n: 2, x: 86.8, y: 17.5 },   // mouth
        { n: 3, x: 13.8, y: 20.4 },   // trachea
        { n: 4, x: 11.4, y: 32.2 },   // bronchi
        { n: 5, x: 79.6, y: 55.8 },   // lungs
        { n: 6, x: 17.4, y: 75.6 },   // diaphragm
        { n: 7, x: 78.6, y: 93.8 },   // alveoli
      ],
    },

    digestivo: {
      archivo: 'digestivo.webp', w: 760, h: 613,
      alt: 'Digestive system diagram with six empty labels',
      puntos: [
        { n: 1, x: 87.5, y: 6.9 },    // mouth
        { n: 2, x: 23.0, y: 33.6 },   // oesophagus
        { n: 3, x: 88.9, y: 60.7 },   // stomach
        { n: 4, x: 13.2, y: 57.7 },   // small intestine
        { n: 5, x: 14.1, y: 75.9 },   // large intestine
        { n: 6, x: 88.7, y: 87.4 },   // anus
      ],
    },

    excretor: {
      archivo: 'excretor.webp', w: 760, h: 571,
      alt: 'Excretory system diagram with four empty labels',
      puntos: [
        { n: 1, x: 12.9, y: 54.0 },   // kidney
        { n: 2, x: 85.7, y: 61.8 },   // ureter
        { n: 3, x: 12.1, y: 79.0 },   // bladder
        { n: 4, x: 88.8, y: 82.7 },   // urethra
      ],
    },

    reproductorMasculino: {
      archivo: 'masculino.webp', w: 760, h: 888,
      alt: 'Male reproductive system diagram with three empty labels',
      puntos: [
        { n: 1, x: 14.3, y: 10.9 },   // penis
        { n: 2, x: 78.9, y: 8.8 },    // testicles
        { n: 3, x: 82.9, y: 88.3 },   // urethra
      ],
    },

    reproductorFemenino: {
      archivo: 'femenino.webp', w: 760, h: 929,
      alt: 'Female reproductive system diagram with five empty labels',
      puntos: [
        { n: 1, x: 14.6, y: 16.5 },   // ovary
        { n: 2, x: 85.3, y: 8.3 },    // Fallopian tubes
        { n: 3, x: 13.7, y: 72.7 },   // uterus
        { n: 4, x: 86.3, y: 72.3 },   // vagina
        { n: 5, x: 50.8, y: 92.6 },   // vulva
      ],
    },
  };

  // `base` es la ruta a la carpeta de imágenes desde la página que lo pinta
  // (por defecto `img/`, que es como lo tiene el examen de Unit 1).
  function render(nombre, opts = {}) {
    const d = DIAGRAMAS[nombre];
    if (!d) return '';
    const base = opts.base || 'img/';
    const pines = d.puntos.map(p =>
      `<span class="pin" style="left:${p.x}%;top:${p.y}%" aria-hidden="true">${p.n}</span>`
    ).join('');
    return `<figure class="diagrama" style="aspect-ratio:${d.w}/${d.h}">
      <img src="${base}${d.archivo}" alt="${d.alt}"
           width="${d.w}" height="${d.h}" decoding="async">
      ${pines}
    </figure>`;
  }

  return { render, DIAGRAMAS };
})();

// `const` global no crea propiedad en window: hay que exponerlo a mano.
if (typeof window !== 'undefined') window.Anatomia = Anatomia;
if (typeof module !== 'undefined' && module.exports) module.exports = Anatomia;
