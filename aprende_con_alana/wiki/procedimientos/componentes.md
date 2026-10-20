# Componentes compartidos (`_componentes/`)

Todo lo reutilizable vive aquí. Son archivos sueltos sin empaquetador: se
cargan con `<script src>` y exponen un objeto global.

> **Importante.** Cada módulo se declara `const X = …` y se expone **a mano**
> al final con `window.X = X;`. Una `const` global no crea propiedad en
> `window`, así que sin esa línea cualquier `if (window.X)` da falso y el
> módulo no se usa nunca. Pasó de verdad con `pwa.js` y el Service Worker
> estuvo meses sin registrarse.

## Lógica

### `almacen.js` — `Almacen`

Única puerta a `localStorage`. Nadie más debe tocarlo.

| Método | Para qué |
|---|---|
| `getPerfil()` / `setPerfil({nombre, avatar})` | Nombre y avatar |
| `getPrefs()` / `setPrefs({cronometroVisible})` | Preferencias |
| `addIntento(examenId, {correctas, total, errores, porSeccion, modo, tiempoMs})` | Guardar un intento terminado |
| `getIntentos(id, {modo})` | Historial, del más reciente al más antiguo |
| `mejorIntento(id, {modo})` / `mejorTiempo(id, {modo})` | Para estrellas y récords |
| `getBorrador(clave)` / `setBorrador()` / `borrarBorrador()` | Examen a medias |
| `listarBorradores(examenId)` | Para el "continuar" de la lista |
| `getRacha()` | Días seguidos practicando |

La clave de borrador es `EXAMEN_ID::modo[::semilla]`.

### `pwa.js` — `PWA`

Registra el Service Worker. **Se autorregistra** al cargarse: basta con
incluir el `<script>` en la página. `PWA.registrar()` es idempotente.

### `generador.js` — `Generador`

Ejercicios de matemáticas aleatorios y reproducibles a partir de una semilla
(`?aleatorio=1` o `?semilla=N`). Solo lo usa matemáticas.

### `estrellas.js` — `Estrellas`

`calcular(correctas, total)` → 0-3 estrellas. `render(n)` → el HTML.

### `cronometro.js` — `Cronometro`

`start(acumuladoMs)`, `stop()` → ms, `getMs()`, `formato(ms)`, `bindUI(elem)`.
Mide siempre; solo se muestra si está activado en la zona de padres.

## Interfaz

### `ranuras.js` — `Ranuras`

Huecos que se rellenan eligiendo de un banco de palabras. Ver
[tipos-de-ejercicio.md](tipos-de-ejercicio.md).

- `Ranuras.init()` — una vez, al arrancar
- `Ranuras.render(id, grupo, placeholder, extraClase)` → el HTML del hueco
- `Ranuras.conectar(contenedor, bancos, onCambio)` — engancha los eventos

Clases útiles: `inline` (dentro de un párrafo), `corta` (para números o letras).

### `anatomia.js` — `Anatomia`

Diagramas SVG del cuerpo humano, dibujados a mano en el propio archivo:
`respiratorio()`, `digestivo()`, `excretor()`, `reproductorMasculino()`,
`reproductorFemenino()`.

Cada uno lleva puntos azules numerados; el número se corresponde con el
`etiqueta` del ítem en el ejercicio. Para añadir un diagrama nuevo, copia
una función, dibuja con `<path>` y coloca los puntos con el helper
`punto(n, x, y, anclaX, anclaY)`.

> **No se usan imágenes del libro de texto.** Tienen copyright y este repo es
> público. El material escaneado del libro está en el `.gitignore`
> (`matematicas/capturas_libro/`, `*.zip`) y sirve solo de referencia para
> dibujar.

### `figuras.js` — `Figuras`

Figuras geométricas y gráficas de barras para matemáticas.

### `teclado.js` — `Teclado`

Teclado numérico tipo teléfono para respuestas numéricas.

### `modal.js` — `Modal`

`Modal.mostrar({emoji, titulo, html, color, botones:[{texto, clase, accion}]})`.
Se usa para confirmar, para el resumen de cada sección y para avisos.

### `confeti.js` — `Confeti`

`Confeti.lanzar(n)`. Necesita un `<canvas id="confeti">` en la página.

### `perfil.js` — `Perfil`

Cabecera con nombre y avatar. `Perfil.render()` + `Perfil.conectarBotones()`.

## Hojas de estilo

- `examen.css` — base común y **variables de color** (`--azul`, `--verde-osc`,
  `--radio`…). Úsalas siempre en vez de poner colores a mano.
- `lista.css` — listados de exámenes de cualquier asignatura
- `perfil.css`, `teclado.css` — lo que dice su nombre
