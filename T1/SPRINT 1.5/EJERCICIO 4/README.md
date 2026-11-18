# Actividad 4 · Gestión del historial, restauración de scroll y foco

> **Historia de usuario:** COMO usuario que usa "atrás/adelante" del navegador, QUIERO que la app respete el historial, el scroll y el foco, PARA volver exactamente donde estaba al navegar.

Parte del proyecto de la Actividad 3 (rutas, parámetros, guards).

## Tarea 1 · Comportamiento del historial

- Todo el estado relevante está en la URL (`/conversaciones/:id`, `?q=`, `?sort=`, `?pagina=`). Atrás/Adelante recupera la vista **y** sus parámetros, porque las vistas los leen de la URL en cada render.
- Qué crea entrada en el historial: cambiar de vista, de orden o de página (`push`). Escribir en el buscador **no** la crea (`replace`), así Atrás no recorre letra a letra.
- Las redirecciones de la guarda, el login y el logout usan `replace`, de modo que el historial no conserva pantallas bloqueadas.
- **Sin recálculos sorpresa:** las páginas de la Pokédex se guardan en caché en memoria (`services/pokeapi.js`). Al volver a una página ya vista se muestra al instante, sin repetir la petición.
- "← Volver a Conversaciones", si se llegó desde el listado, hace `navigate(-1)`: es un Atrás real que conserva filtros y scroll.

## Tarea 2 · Restauración de scroll

`hooks/useScrollRestoration.js`:

1. Cada entrada del historial tiene un `location.key` único que se conserva con Atrás/Adelante.
2. Mientras se hace scroll en `ConversationsView` se guarda `{ [key]: scrollY }` en `sessionStorage` (como mucho una vez por frame).
3. Al volver a esa entrada se lee la posición y se hace `window.scrollTo`. Si la entrada es nueva, se empieza arriba.

`AppLayout` sube el scroll arriba en cada cambio de vista (`pathname`), y el listado restaura su posición después. `history.scrollRestoration = 'manual'` evita que el navegador interfiera.

## Tarea 3 · Foco funcional

- **Chat:** el foco va directamente al input del mensaje (`autoFocus`).
- **Resto de vistas:** `AppLayout` enfoca el `<h1>` de la vista nueva (`tabIndex={-1}`), así el teclado y el lector de pantalla continúan desde el contenido nuevo y no desde la cabecera.
- Si la vista ya colocó el foco en un elemento propio, no se le quita.
- Al escribir en el buscador no se roba el foco: sólo cambia el query string, no la vista.
- `Feedback/ScreenAnnouncer.jsx` es una región `aria-live` que anuncia *"Vista cargada: …"* con el título de la pestaña (`hooks/useDocumentTitle.js`).

## 📂 Archivos clave

```
src/
 ├── components/
 │   ├── Layout/AppLayout.jsx         # scroll arriba + foco al cambiar de vista
 │   ├── Views/ConversationsView.jsx  # lista larga (60) con restauración de scroll
 │   └── Feedback/ScreenAnnouncer.jsx # anuncia cambios de vista
 ├── hooks/
 │   ├── useScrollRestoration.js
 │   └── useDocumentTitle.js
 └── styles/layout.css
```

## ✅ Pruebas funcionales

- [x] Navegar entre vistas y usar Atrás/Adelante mantiene estado y parámetros.
- [x] El scroll se restaura al volver a listados.
- [x] El foco cae en el campo esperado.
- [ ] GIF: listado → bajar scroll → detalle → volver → scroll restaurado → `../MEDIA/ejercicio4.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
