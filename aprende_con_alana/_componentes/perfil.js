// =====================================================
// Perfil — saludo con nombre + avatar editable
// =====================================================
// Render del saludo y modal para editar nombre/avatar.
// Persistencia via Almacen.

const Perfil = {
  AVATARES: ['👧', '👦', '🦊', '🐼', '🦁', '🐯', '🐰', '🦄', '🐸', '🐧', '🐵', '🐶'],

  saludo() {
    const { nombre } = Almacen.getPerfil();
    return nombre ? `¡Hola, ${nombre}!` : '¡Hola!';
  },

  // Devuelve HTML con saludo + avatar + botón ✏️ editar.
  // Llamar a Perfil.conectarBotones() después de inyectar.
  render() {
    const p = Almacen.getPerfil();
    const racha = Almacen.getRacha();
    const rachaHTML = racha.dias >= 2
      ? `<div class="racha" title="Días seguidos jugando">🔥 ${racha.dias} días</div>`
      : '';
    return `
      <div class="perfil-bloque">
        <button type="button" class="perfil-avatar" data-perfil-edit aria-label="Cambiar perfil">${p.avatar || '👧'}</button>
        <div class="perfil-texto">
          <h1>${this.saludo()}</h1>
          ${p.nombre
            ? `<button type="button" class="perfil-edit" data-perfil-edit>Cambiar nombre ✏️</button>`
            : `<button type="button" class="perfil-edit destacado" data-perfil-edit>Escribe tu nombre ✏️</button>`}
        </div>
        ${rachaHTML}
      </div>`;
  },

  conectarBotones() {
    document.querySelectorAll('[data-perfil-edit]').forEach(el => {
      el.addEventListener('click', () => this.abrirModal());
    });
  },

  abrirModal() {
    const p = Almacen.getPerfil();
    const modal = document.createElement('div');
    modal.className = 'modal perfil-modal';
    modal.innerHTML = `
      <div class="modal-contenido">
        <h2>¿Cómo te llamas?</h2>
        <input type="text" id="perfil-nombre-input" class="perfil-input" maxlength="20" placeholder="Tu nombre" value="${p.nombre || ''}" autocomplete="off" />
        <p style="margin:1rem 0 0.5rem;font-weight:600;">Elige tu avatar:</p>
        <div class="perfil-avatares">
          ${this.AVATARES.map(a => `
            <button type="button" class="perfil-avatar-opcion ${a === p.avatar ? 'elegido' : ''}" data-avatar="${a}">${a}</button>
          `).join('')}
        </div>
        <div class="perfil-acciones">
          <button type="button" class="boton boton-volver" id="perfil-cancelar">Cancelar</button>
          <button type="button" class="boton boton-siguiente" id="perfil-guardar">Guardar ✓</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const input = modal.querySelector('#perfil-nombre-input');
    input.focus();
    input.select();

    let avatarElegido = p.avatar || '👧';
    modal.querySelectorAll('.perfil-avatar-opcion').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.perfil-avatar-opcion').forEach(b => b.classList.remove('elegido'));
        btn.classList.add('elegido');
        avatarElegido = btn.dataset.avatar;
      });
    });

    modal.querySelector('#perfil-cancelar').addEventListener('click', () => modal.remove());
    modal.querySelector('#perfil-guardar').addEventListener('click', () => {
      const nombre = input.value.trim().slice(0, 20);
      Almacen.setPerfil({ nombre, avatar: avatarElegido });
      modal.remove();
      // Refrescar saludo en la página si existe el contenedor.
      const cont = document.getElementById('perfil-cont');
      if (cont) {
        cont.innerHTML = this.render();
        this.conectarBotones();
      }
    });

    // Enter guarda, Esc cancela.
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') modal.querySelector('#perfil-guardar').click();
      if (e.key === 'Escape') modal.querySelector('#perfil-cancelar').click();
    });
  },
};
