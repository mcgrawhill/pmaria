# Natural Science — Unit 1: The human body

**Estado:** ✅ Publicado · **Carpeta:** `natural-science/examen-01-human-body/`
· **`EXAMEN_ID`:** `natural-science-01-human-body`

## Qué es

Adaptación interactiva del examen de clase de Unit 1 (el cuerpo humano).
Todo el contenido está **en inglés**, como la asignatura y como la prueba real.

Origen: `~/Desktop/ALANA/estudios/natural science/exam_unit1_human_body.pdf`
(examen de 6 páginas con su hoja de respuestas). Las fotos del libro de la
carpeta `cuerpo humano/` se usaron **solo como referencia** para dibujar los
diagramas; no se publica ninguna imagen del libro.

## Estructura

5 partes, 68 ítems puntuables:

| Parte | Contenido | Ítems |
|---|---|---|
| 1 · Life functions & breathing 🫁 | Funciones vitales, etiquetar el respiratorio, ordenar los pasos de la respiración | 17 |
| 2 · Digestive system 🍎 | Etiquetar el digestivo, completar el texto de la digestión | 13 |
| 3 · Excretory system 💧 | Etiquetar el excretor, verdadero/falso y corregir las falsas | 12 |
| 4 · Reproductive systems 👪 | Etiquetar ambos aparatos, emparejar órgano con función | 15 |
| 5 · Final review 🧠 | Clasificar órganos por sistema, gases, hábitos y reproducción | 11 |

## Cómo se adaptaron los ejercicios no autocorregibles

El examen original tiene dos ejercicios de respuesta libre:

- **"Correct the false sentences"** → después del verdadero/falso se añade un
  ejercicio de opción múltiple (`q7b`) donde elige la corrección correcta de
  entre tres.
- **"Write two ways to improve your digestion"** → se convierte en elegir los
  **dos** hábitos buenos de entre cuatro (`q11b`, tipo `multi`).

El apartado 11a (gases que respiramos) y el 11c (células) pasan a ser huecos
con banco de palabras.

## Diagramas

Cinco SVG dibujados a mano en `_componentes/anatomia.js`: respiratorio,
digestivo, excretor, reproductor masculino y femenino. Cada uno lleva puntos
azules numerados que se corresponden con los huecos del ejercicio.

Al dibujarlos hay un detalle que importa: **dos etiquetas distintas tienen
que señalar a sitios visualmente distintos**. La primera versión del
respiratorio tenía una cabeza sin perfil y los puntos de `nose` y `mouth`
caían casi encima, así que el ejercicio no se podía resolver mirando el
dibujo. Se rehízo el perfil con nariz y labios marcados.

## Verificación

- `tests/natural-science.test.js` — 8 tests de coherencia: ids únicos, cada
  respuesta está en su banco, las plantillas tienen un hueco por ítem, los
  índices de las opciones existen, los diagramas que se piden están definidos
  y el total sigue siendo 68 ítems.
- Probado en navegador resolviéndolo entero dos veces, con todas las
  respuestas correctas (100%) y todas erróneas (0%), sin errores de JS.

## Pendiente / ideas

- Modo aleatorio: ahora solo hay un examen fijo. Habría que barajar el orden
  de los ítems y de los bancos de palabras.
- Audio con la pronunciación del vocabulario en inglés.
- Unit 2 cuando toque.
