# Bitácora

Histórico cronológico de decisiones y cambios. Lo más reciente, arriba.

## 2026-10-20 — Natural Science: Unit 1, The human body

Nueva asignatura **Natural Science** con el examen de Unit 1 adaptado del
PDF de clase: 5 partes y 68 ítems, todo en inglés como la prueba real.

- Cinco diagramas SVG dibujados a mano en `_componentes/anatomia.js`. No se
  usa ninguna imagen del libro de texto: tienen copyright y el repo es
  público.
- Componente nuevo `_componentes/ranuras.js`: huecos que se rellenan
  eligiendo de un banco de palabras. Sustituye al arrastrar y soltar, que en
  tablet es frustrante. Sirve para etiquetar, rellenar, ordenar, emparejar y
  clasificar.
- Los dos ejercicios de respuesta libre del original se convirtieron en
  autocorregibles (elegir la corrección buena / elegir dos hábitos).
- `lista.css` pasa de `matematicas/` a `_componentes/` para compartirlo.
- El dashboard de padres junta ya las listas de todas las asignaturas.
- Se creó la `wiki/` con los procedimientos para añadir asignaturas,
  exámenes y dinámicas nuevas.

Versión: v24.

## 2026-10-19 — El Service Worker no se había registrado nunca

Al verificar la mudadura del sitio apareció un fallo de fondo: `pwa.js`
declaraba `const PWA = …` y la portada comprobaba `if (window.PWA)`. Una
`const` global no crea propiedad en `window`, así que la condición era
siempre falsa y **el SW no se registró nunca** desde que se añadió la PWA en
`8eea1ce`. La app no había funcionado sin conexión en ningún momento.

- `window.PWA = PWA` explícito, y `pwa.js` pasa a autorregistrarse al
  cargarse para que cualquier página de entrada active el SW, no solo la
  portada (v23).
- Esto explica retroactivamente los parches de `ac4785d` (fallback porque
  "el SW activo no sabe responder") y `ed7370c` (literal de versión fijo).

Versiones: v22 (registro arreglado) y v23 (registro desde cualquier página).

## 2026-10-19 — El sitio se muda a `aprende_con_alana/`

El contenido pasa de la raíz del repositorio a la subcarpeta
`aprende_con_alana/`. En la raíz quedan `.nojekyll`, una redirección y un
Service Worker de retirada que limpia el scope antiguo.

Dos cosas que se rompieron con el movimiento y hubo que arreglar:

- Los patrones del `.gitignore` llevan barra intermedia, así que git los
  ancla a la raíz del repo: las capturas del libro **dejaron de estar
  ignoradas** y el siguiente `git add -A` las habría publicado. Los patrones
  del sitio viven ahora en `aprende_con_alana/.gitignore`.
- La URL pública cambia a `/pmaria/aprende_con_alana/`.

Versión: v21 → sin cambio funcional en el SW del sitio.
