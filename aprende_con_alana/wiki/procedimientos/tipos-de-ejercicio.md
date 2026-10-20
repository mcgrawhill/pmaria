# Tipos de ejercicio (dinámicas)

Catálogo de lo que hay construido, con cuándo usar cada cosa. Antes de
inventar una dinámica nueva, mira si alguna de estas sirve: cuantas menos
formas distintas de interactuar, menos tiene que aprender la niña.

## Regla de oro: nada de arrastrar y soltar

El *drag & drop* es frustrante con el dedo (y en iPad, directamente malo).
Todo se resuelve **tocando**: tocas el hueco, eliges de una lista.

## Catálogo

### Ranuras con banco de palabras — `_componentes/ranuras.js`

El mecanismo más versátil. Una "ranura" es un hueco que se rellena eligiendo
de un banco de palabras que sube desde abajo. Cuatro presentaciones:

| Presentación | Pinta | Se usa para |
|---|---|---|
| `diagrama` | SVG con puntos numerados + lista de huecos | Etiquetar partes del cuerpo, mapas, figuras |
| `texto` | Párrafo con huecos entre el texto | Rellenar frases, completar un texto |
| `orden` | Lista de frases, cada una con un hueco corto | Ordenar pasos (1, 2, 3, 4) |
| `filas` | `etiqueta → hueco` | Emparejar, clasificar |

Un ejercicio de ranuras se define así:

```js
{
  id: 'q2', tipo: 'ranuras', presentacion: 'diagrama',
  enunciado: '<strong>2. Respiratory system.</strong> Label the diagram.',
  diagrama: 'respiratorio',              // una función de Anatomia
  bancos: { respiratorio: banco(['nose', 'mouth', ...]) },
  items: [
    { id: 'r1', etiqueta: '1', grupo: 'respiratorio', respuesta: 'nose' },
    ...
  ],
}
```

**Corrección por conjunto.** Cuando el orden da igual ("escribe las tres
funciones vitales"), se declara `conjuntos` y los ítems **no** llevan
`respuesta`:

```js
conjuntos: { funciones: ['nutrition', 'interaction', 'reproduction'] },
items: [{ id: 'f1', grupo: 'funciones' }, { id: 'f2', grupo: 'funciones' }, ...]
```

Se da por buena cualquier palabra del conjunto que no se haya repetido.

**Valores repetibles.** Si varios huecos comparten respuesta (clasificar seis
órganos en cuatro sistemas), marca `repetible: true`.

### Verdadero / falso — `tipo: 'tf'`

Una frase y dos botones grandes, T y F.

```js
{ id: 't1', texto: 'We have only one kidney.', respuesta: 'F' }
```

Para el clásico "corrige las frases falsas", que no se puede autocorregir,
se añade después un ejercicio `mc` donde elige **cuál es la corrección buena**.

### Opción múltiple — `tipo: 'mc'`

Una respuesta correcta entre varias. `respuesta` es el **índice** de la
opción, empezando en 0.

### Opción múltiple con varias correctas — `tipo: 'multi'`

Para "elige DOS hábitos que ayuden a la digestión". `respuestas` es un array
de índices y **puntúa 1 solo punto**: o está entera bien, o no.

### Numérica con teclado — `_componentes/teclado.js`

Solo en matemáticas. Abre un teclado tipo teléfono. Ver cualquier examen de
`matematicas/`.

## Cómo se puntúa

Cada **ítem** suma un punto, no cada ejercicio. Un diagrama con 7 etiquetas
vale 7 puntos. La excepción es `multi`, que vale 1.

El marcador total se calcula solo (`estado.totalItems`); si cambias los ítems,
actualiza el test que comprueba el total.

## Feedback

Al corregir, siempre:

- Verde en lo acertado, rojo en lo fallado, **y la respuesta correcta marcada**
  para que la vea aunque haya fallado.
- Mensaje positivo: "¡Casi!", "Keep going!" — nunca "MAL" ni "FALLO".
- Confeti si la sección sale perfecta.
- Al final, opción de **repetir solo los fallos** (`?repaso=id1,id2`).
