# Crear un examen nuevo

Para añadir un examen a una asignatura **que ya existe**. Si la asignatura es
nueva, empieza por [crear-asignatura.md](crear-asignatura.md).

## Resumen rápido

```bash
# 1. Carpeta (NN = dos dígitos, orden alfabético correcto)
mkdir -p <asignatura>/examen-NN-tema/

# 2. Tres archivos: index.html, script.js, style.css
#    Lo más rápido es copiar el examen más parecido que ya exista.

# 3. Dar de alta el examen en la lista de la asignatura
#    <asignatura>/examenes.js

# 4. Añadir los 3 archivos nuevos a ARCHIVOS_BASE en sw.js
#    y subir CACHE_NAME + el literal de la portada (ver publicar.md)

# 5. Comprobar
node --test tests/
```

## Paso a paso

### 1. La carpeta

Convención: `examen-NN-tema-corto/`, en minúsculas y con guiones. Dentro,
siempre los mismos tres nombres: `index.html`, `style.css`, `script.js`.

El examen es **autocontenido**: solo depende de `../../_componentes/`.

### 2. `index.html`

Copia el de un examen existente y cambia el título. La estructura fija es:

- `header.cabecera` con `#seccion-titulo`, `#seccion-subtitulo`, `#puntos`
  y el chip de cronómetro `#cron-chip`.
- `.barra-progreso > #barra-fill`
- `nav#pasos` — los puntos de las secciones
- `main#examen` — aquí se pinta todo desde JS
- `footer.pie` con `#btn-comprobar`, `#btn-siguiente`, `#btn-final`
- `#modal-final` con sus `#stat-*`
- `canvas#confeti`

Al final, los `<script>` de los componentes que uses y luego `script.js`.
**Incluye siempre `_componentes/pwa.js`**: es lo que registra el Service
Worker, y sin él esa página no funcionaría sin conexión.

### 3. `script.js`

El patrón es siempre el mismo:

1. `const EXAMEN_ID = '...'` — identificador único, se usa para guardar el
   historial y los borradores. No lo cambies después: perderías el progreso.
2. `SECCIONES` — array de bloques, cada uno con `id`, `emoji`, `titulo`,
   `descripcion` y `ejercicios[]`.
3. `renderSeccion()` → pinta; `comprobarSeccion()` → corrige y puntúa.
4. Borrador (continuar un examen a medias) y cronómetro: copia los bloques
   tal cual del examen más reciente, no tienen misterio.

Cada sección debe durar **10-15 minutos como máximo**. Si el examen es largo,
pártelo en más secciones en vez de alargarlas.

### 4. Darlo de alta en la lista

En `<asignatura>/examenes.js`, añade una entrada:

```js
{
  id: 'mismo-valor-que-EXAMEN_ID',
  emoji: '🫀',
  titulo: 'Unit 1 — The human body',
  descripcion: 'Una frase corta de lo que entra.',
  url: 'examen-01-human-body/index.html',
}
```

El `id` **tiene que coincidir** con el `EXAMEN_ID` del script, o las estrellas
y el "continuar" no encontrarán el historial.

### 5. Service Worker

Añade los tres archivos nuevos a `ARCHIVOS_BASE` en `sw.js` y sube la versión.
Ver [publicar.md](publicar.md). Si se te olvida, el examen funciona con
conexión pero no sin ella.

### 6. Comprobar

```bash
node --test tests/                       # los tests no deben romperse
python3 -m http.server 8000              # y probarlo a mano en el navegador
```

Pruébalo **en móvil** (o con el navegador en 390 px de ancho): es donde se
usa de verdad.

## Errores que ya se han cometido

- **Usar `if (window.X)` con un módulo declarado como `const X`**: siempre da
  falso. Los módulos de `_componentes/` se exponen a mano con `window.X = X`
  al final del archivo.
- **Olvidar `pwa.js`** en una página: esa entrada al sitio no registra el SW.
- **Cambiar el `EXAMEN_ID`** de un examen ya publicado: se pierde el historial.
- **Subir `CACHE_NAME` sin actualizar el literal de la portada**: no se puede
  verificar a simple vista si el despliegue entró.
