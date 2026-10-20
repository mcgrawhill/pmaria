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

Las láminas mudas del examen de clase (las del PDF de la unidad, recortadas
y pasadas a WebP), con un número superpuesto dentro de cada caja vacía.

`Anatomia.render('respiratorio')` devuelve el `<figure>` con la imagen y sus
puntos. Diagramas disponibles: `respiratorio`, `digestivo`, `excretor`,
`reproductorMasculino`, `reproductorFemenino`.

Se usan las láminas originales **a propósito**: lo que practica tiene que
parecerse a lo que verá en la prueba. Un primer intento con dibujos propios
en SVG se descartó por eso.

Para añadir un diagrama nuevo:

1. Extrae la lámina del PDF:
   `pdftoppm -png -r 200 -f <pág> -l <pág> -x <X> -y <Y> -W <W> -H <H> archivo.pdf salida`
2. Recórtala y pásala a WebP (un PNG de línea pesa 10× más).
   Guárdala en la carpeta `img/` del examen.
3. Añade su entrada en `DIAGRAMAS` con el ancho y alto reales y el centro de
   cada caja **en % del ancho y alto** (así cuadran a cualquier tamaño).
4. Comprueba en el navegador que cada número cae dentro de su caja. Los
   tests verifican que hay un punto por hueco y que ninguno se sale, pero
   **no** pueden saber si el número está en la caja correcta: eso se mira.

> Ojo con las **fotos del libro** (`cuerpo humano/*.jpg`, las capturas de
> matemáticas): esas sí llevan el texto y la maquetación de la editorial.
> Están en el `.gitignore` y se usan solo como referencia.

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
