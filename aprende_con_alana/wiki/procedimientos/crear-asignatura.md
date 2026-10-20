# Crear una asignatura nueva

Ejemplo real: así se dio de alta Natural Science (octubre de 2026).

## Resumen rápido

```bash
mkdir -p <asignatura>/
# 1. <asignatura>/index.html   → listado de exámenes
# 2. <asignatura>/examenes.js  → array con los exámenes
# 3. <asignatura>/lista.css    → solo el color de fondo propio
# 4. Activar la tarjeta en index.html (la portada)
# 5. Cargar su examenes.js en dashboard.html
# 6. Añadir los archivos a sw.js y subir versión
```

## Paso a paso

### 1. Nombre de la carpeta

En minúsculas y con guiones. Si la asignatura se da en inglés en el colegio,
usa su nombre en inglés (`natural-science/`), porque es como la niña la
conoce. El resto de la interfaz de la app sigue en español.

### 2. `<asignatura>/index.html`

Copia `natural-science/index.html`. Es el listado: pinta una tarjeta por
examen con sus estrellas, el mejor resultado y el aviso de "tienes uno
empezado". Enlaza tres hojas de estilo en este orden:

```html
<link rel="stylesheet" href="../_componentes/examen.css" />
<link rel="stylesheet" href="../_componentes/perfil.css" />
<link rel="stylesheet" href="../_componentes/lista.css" />
<link rel="stylesheet" href="lista.css" />   <!-- solo el fondo propio -->
```

`_componentes/lista.css` es el estilo común de todas las listas. El
`lista.css` de la asignatura solo cambia el degradado del fondo, para que
cada asignatura se distinga de un vistazo:

```css
body.lista {
  background: linear-gradient(135deg, #d9f3ea 0%, #a8e6cf 100%);
  background-attachment: fixed;
}
```

### 3. `<asignatura>/examenes.js`

Un array con una constante **con nombre propio** (`EXAMENES_NS`,
`EXAMENES_LENGUA`…), no `EXAMENES` a secas: el dashboard carga todas las
listas a la vez y chocarían.

### 4. La portada

En `index.html` (la raíz del sitio), cambia la tarjeta `disabled` por un
enlace:

```html
<a class="card" href="natural-science/index.html">
  <span class="emoji">🔬</span>
  <h2>Natural Science</h2>
  <span class="desc">The human body</span>
</a>
```

### 5. La zona de padres

En `dashboard.html`, añade el `<script src="<asignatura>/examenes.js">` antes
de `dashboard.js`. El dashboard junta todas las listas en `TODOS_EXAMENES`,
así que no hay que tocar nada más: la asignatura aparece sola en el resumen,
en el desglose por tema y en el historial.

### 6. Service Worker y versión

Añade todos los archivos nuevos a `ARCHIVOS_BASE` en `sw.js` y sube la
versión. Ver [publicar.md](publicar.md).

## Sobre el idioma

- La **interfaz** de la app (portada, menús, zona de padres) va en español.
- El **contenido** de una asignatura bilingüe va en el idioma en que se
  examina. En Natural Science todo el examen está en inglés, incluidos los
  enunciados y el feedback, porque así es la prueba real.
