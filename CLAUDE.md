# Proyecto Alana — Páginas web educativas para niños de 9 años

Eres un experto creando páginas web educativas alojadas en **GitHub Pages**, dirigidas al aprendizaje escolar de **niños de 9 años** (3º-4º de Primaria). El proyecto se llama **Alana** y se organiza por asignaturas, cada una con sus exámenes o ejercicios.

## Público objetivo

- Edad: **9 años** (3º-4º de Primaria en España)
- Nivel lector: medio — frases cortas, vocabulario sencillo
- Concentración: 10-15 min por ejercicio máximo
- Motivación: refuerzo positivo constante, sin penalizaciones duras

## Estructura del repositorio

```
alana/
├── CLAUDE.md           # este archivo
├── index.html          # portada con enlaces a todas las asignaturas
├── matematicas/
│   ├── index.html      # listado de exámenes de mates
│   ├── examen-01-sumas/
│   │   ├── index.html
│   │   ├── style.css
│   │   └── script.js
│   ├── examen-02-restas/
│   └── ...
├── lengua/             # (futuro)
├── ciencias/           # (futuro)
└── assets/             # imágenes, sonidos compartidos
```

Cada examen vive en **su propia carpeta autocontenida** con `index.html`, `style.css` y `script.js`. Así son fáciles de enlazar desde GitHub Pages y de mantener por separado.

## Directrices de diseño UI/UX

### Visual
- **Colores vivos pero no chillones**: paletas tipo pastel saturado (azul cielo, verde menta, amarillo suave, coral). Evitar negro puro como fondo.
- **Tipografía grande**: mínimo `18px` para texto normal, `28-36px` para enunciados de ejercicios. Fuentes redondeadas y legibles (`Comic Neue`, `Nunito`, `Quicksand`, `Fredoka`).
- **Botones grandes** (mínimo 48x48 px) con bordes redondeados (`border-radius: 16px+`) y sombra suave.
- **Iconos y emojis** para reforzar visualmente cada concepto (➕ ➖ ✖️ ➗ 🎉 ⭐ 🚀).
- **Espaciado generoso**: padding/margin amplios; no amontonar elementos.
- **Animaciones suaves** al acertar (confetti, estrella que crece, etc.) — usar CSS animations o librerías ligeras tipo `canvas-confetti`.

### Interacción
- **Una pregunta por pantalla** o agrupaciones muy claras de 5-10 ejercicios cortos.
- **Feedback inmediato**: al pulsar la respuesta, mostrar si es correcta o no antes de avanzar.
- **Refuerzo positivo**: "¡Muy bien!", "¡Genial!", "¡Casi! Vuelve a intentarlo" — nunca "FALLO" o "MAL".
- **Sin cuenta atrás agresiva**: si hay temporizador, que sea opcional y visual (no presione).
- **Progreso visible**: barra de progreso o "ejercicio 3 de 10".
- **Resultado final**: número de aciertos, mensaje motivador y opción de "Volver a intentar".

### Accesibilidad
- Contraste suficiente (WCAG AA mínimo).
- Compatible con **móvil y tablet** (la mayoría usarán iPad o móvil de los padres).
- **Sin login**: acceso directo, todo en cliente, sin cookies ni tracking.
- Funciona offline una vez cargado (HTML+CSS+JS estático).

## Directrices técnicas

- **HTML5 + CSS3 + JavaScript vanilla**. Nada de frameworks pesados (React, Vue) salvo que aporten mucho.
- **Mobile-first responsive** con `viewport` meta y unidades relativas (`rem`, `%`, `vw`).
- **GitHub Pages compatible**: todo estático, sin backend. Servir desde `main` o `gh-pages`.
- **Carga rápida**: imágenes optimizadas, sin dependencias externas pesadas. Si se usan fuentes de Google Fonts, preconectar.
- **Código limpio y comentado en español** — este repo lo puede leer un profesor o un familiar.
- **Sin tracking** (Google Analytics, etc.) — privacidad de menores.

## Tipos de exámenes/ejercicios habituales (matemáticas, 9 años)

A esta edad el currículo cubre típicamente:
- Sumas y restas con llevadas (hasta 4-5 cifras)
- Tablas de multiplicar (del 1 al 10)
- Multiplicaciones por 1, 2 y 3 cifras
- Divisiones exactas y con resto
- Problemas de enunciado (1-2 operaciones)
- Unidades de medida (longitud, masa, capacidad, tiempo)
- Fracciones sencillas
- Geometría básica (perímetros, áreas simples, figuras planas)
- Numeración hasta el millón, ordenación, redondeo

Cada examen debe centrarse en **un solo tema o subtema** para no abrumar.

## Convenciones de nomenclatura

- Carpetas de examen: `examen-NN-tema-corto/` (ej: `examen-01-sumas/`, `examen-02-tablas-del-2/`)
- Numeración con dos dígitos para orden alfabético correcto.
- Nombres en **español**, minúsculas, separados por guiones.
- Archivos: siempre `index.html`, `style.css`, `script.js` dentro de cada carpeta.

## Flujo de trabajo

1. El usuario pide un tipo de examen (ej: "examen de tablas de multiplicar del 3").
2. Crear carpeta `matematicas/examen-NN-tema/`.
3. Crear `index.html` autocontenido con CSS y JS (o en archivos separados si crece).
4. Probar visualmente que es agradable y funciona en móvil.
5. Actualizar `matematicas/index.html` con enlace al nuevo examen.
6. Actualizar `index.html` raíz si se añade una asignatura nueva.

## Idioma

**Todo en español de España.** Tanto el código como los textos visibles, comentarios y commits.
