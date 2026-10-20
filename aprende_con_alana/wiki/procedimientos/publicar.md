# Publicar y versionar

## Resumen rápido

```bash
# 1. sw.js: añadir los archivos nuevos a ARCHIVOS_BASE
# 2. sw.js: CACHE_NAME 'alana-vN' → 'alana-vN+1'
# 3. index.html (portada): <span>Alana · vN+1</span>   ← OBLIGATORIO, el mismo número
node --test tests/
git add -A && git commit && git push origin main
# 4. Esperar ~1 min y comprobar que la portada muestra la versión nueva
```

## La regla de los dos números

`CACHE_NAME` en `sw.js` y el literal `Alana · vNN` del pie de la portada van
**siempre en el mismo commit y con el mismo número**.

Motivo: la versión se comprueba a simple vista desde la portada. El literal
es texto fijo, así que se ve aunque el navegador tenga un Service Worker
viejo cacheado. Si los dos números se desincronizan, deja de servir para
saber si el despliegue entró.

## Dónde está cada cosa

El sitio **no se sirve desde la raíz del repositorio**, sino desde
`aprende_con_alana/`. En la raíz solo quedan:

- `.nojekyll` — sin él, GitHub Pages ignora `_componentes/` (empieza por `_`)
- `index.html` — redirección a `aprende_con_alana/`
- `sw.js` — Service Worker de retirada de la dirección antigua

**No toques esos dos últimos ni los versiones.** Los que se mantienen son los
de `aprende_con_alana/`.

## Despliegue

GitHub Pages sirve `main` desde la raíz del repo. Un `git push origin main`
despliega; tarda entre 30 segundos y un par de minutos.

URL: <https://mcgrawhill.github.io/pmaria/aprende_con_alana/>

## Comprobar que ha entrado

```bash
curl -s https://mcgrawhill.github.io/pmaria/aprende_con_alana/ | grep -o "Alana · v[0-9]*"
```

Si sigue saliendo la versión anterior, el despliegue aún no ha terminado.

Para una comprobación de verdad (que el SW se registra y la app funciona sin
conexión) hace falta un navegador: abre la página, DevTools →
Application → Service Workers, y marca *Offline* para ver si sigue cargando.

## Qué NO se publica

El material escaneado del libro de texto tiene copyright. Está ignorado en
`aprende_con_alana/.gitignore`:

```
matematicas/capturas_libro/
matematicas/capturas_libro_*/
matematicas/examen_ejemplo/
matematicas/*.zip
```

Ojo con los patrones con barra: git los ancla a la carpeta del `.gitignore`
que los contiene. Si mueves carpetas, revísalos — ya pasó una vez que
dejaron de aplicar sin avisar.

Antes de un commit grande, comprueba que no se cuela nada:

```bash
git diff --cached --name-only | grep -iE 'capturas|examen_ejemplo|\.zip'
```
