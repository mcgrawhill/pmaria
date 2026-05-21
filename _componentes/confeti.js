// =====================================================
// Confeti — animación compartida para celebrar aciertos
// =====================================================
//
// Uso: Confeti.lanzar(120)
// Requiere un <canvas id="confeti"> en la página.

const Confeti = {
  lanzar(cantidad = 120) {
    const canvas = document.getElementById('confeti');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const piezas = [];
    const colores = ['#ff7675', '#74b9ff', '#55efc4', '#fdcb6e', '#a29bfe', '#fd79a8'];

    for (let i = 0; i < cantidad; i++) {
      piezas.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 200,
        v: 2 + Math.random() * 4,
        vx: (Math.random() - 0.5) * 3,
        r: 4 + Math.random() * 6,
        color: colores[Math.floor(Math.random() * colores.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.2,
      });
    }
    let frames = 0;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      piezas.forEach(p => {
        p.y += p.v;
        p.x += p.vx;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      });
      frames++;
      if (frames < 200) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    tick();
  },
};
