# Actividad 5 · Errores, 404 y estados de carga unificados

> **Historia de usuario:** COMO usuario, QUIERO que los errores y pantallas inexistentes se manejen de forma clara y consistente, PARA entender qué ocurre sin inspeccionar la consola.

Parte del proyecto de la Actividad 4 (rutas, parámetros, guards, historial/scroll/foco).

## Tarea 1 · Vista 404 funcional

`Views/NotFoundView.jsx` se declara como ruta comodín `path="*"` dentro del layout, de modo que la cabecera y la navegación siguen visibles. Muestra la URL que no existe y un enlace **"Volver a Inicio / Chat"**. Es pública: se ve con o sin sesión.

> Una conversación con un id inexistente (`/conversaciones/xyz`) **no** es un 404: la ruta existe, y la propia vista indica que esa conversación no se encuentra.

## Tarea 2 · Estados de carga homogéneos

- `Feedback/Loading.jsx`: un único componente de carga ("Cargando…" con `role="status"`).
- `hooks/useAsync.js`: un hook común que devuelve `status: 'loading' | 'error' | 'success'`, `data`, `error` y `reload()`. Descarta respuestas antiguas si la vista cambia de petición o se desmonta.
- Lo usan `ConversationsView`, `ConversationView` y `PokedexView`.
- Las lecturas de conversaciones son asíncronas, con 500 ms de latencia simulada, para que el estado de carga se vea. La Pokédex hace peticiones reales a la PokéAPI.

## Tarea 3 · Captura de error por vista

- `Feedback/ErrorBlock.jsx` se pinta **dentro de la vista** que falla, con el mensaje, un botón **Reintentar** y un enlace **Volver al Chat**. La cabecera y la navegación siguen funcionando.
- `services/pokeapi.js` traduce los fallos a mensajes legibles: sin conexión → *"No se ha podido conectar con la PokéAPI…"*; respuesta HTTP de error → *"La PokéAPI respondió con el estado 404."*
- **Forzar un error:** en la Pokédex, marcar *"Simular error de la PokéAPI"* (o abrir `/pokedex?fallo=1`). Se pide un endpoint inexistente y la API devuelve un 404 real.
- En el **Chat**, un fallo de red se distingue de "Pokémon no encontrado" y se muestra como un mensaje de error del bot (`chatbot.css`).

## 📂 Archivos nuevos

```
src/
 ├── components/
 │   ├── Views/NotFoundView.jsx
 │   └── Feedback/
 │        ├── Loading.jsx
 │        └── ErrorBlock.jsx
 ├── hooks/useAsync.js
 └── styles/
     ├── layout.css    # .loading, .error-block
     └── chatbot.css   # .message-error
```

## ✅ Pruebas funcionales

- [x] Escribir una URL desconocida (p. ej. `/no-existe`) muestra el 404.
- [x] Los estados de carga se ven durante las peticiones reales.
- [x] Un error de la PokéAPI produce un bloque de error sin romper la app.
- [ ] GIF: URL inexistente → 404 → volver a inicio; forzar un error de API y ver cómo se maneja → `../MEDIA/ejercicio5.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
