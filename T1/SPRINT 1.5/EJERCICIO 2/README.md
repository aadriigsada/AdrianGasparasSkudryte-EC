# Actividad 2 · Enrutado con parámetros, queries y estados

> **Historia de usuario:** COMO persona que comparte enlaces, QUIERO que la URL refleje la vista actual y sus parámetros (id de conversación, filtros), PARA abrir directamente contenido concreto.

Parte del proyecto de la Actividad 1 (mismo mapa de rutas y layout).

## Tarea 1 · Parámetros de ruta

`ConversationView` recibe el id como segmento de la URL: `/conversaciones/:id` (p. ej. `/conversaciones/c25`). Lo lee con `useParams()` y, si el id no existe, muestra "Conversación no encontrada" con un enlace para volver al listado.

## Tarea 2 · Query params funcionales

`ConversationsView` interpreta:

- `?q=`: texto de búsqueda. Filtra por título y por contenido de los mensajes, sin distinguir mayúsculas ni tildes.
- `?sort=`: orden, que puede ser `recientes` (por defecto), `antiguas` o `titulo`.

Además, la Pokédex guarda la página actual en `?pagina=`.

## Tarea 3 · Sincronía URL ⇄ Estado

Los controles no tienen estado propio: su valor se lee de la URL (`useSearchParams`) y al cambiarlos se escribe en ella. Por eso:

- Escribir o borrar en "Buscar" actualiza `?q=` al instante (con `replace`, para no llenar el historial).
- Cambiar "Ordenar" actualiza `?sort=` (con `push`, así Atrás recupera el orden anterior).
- Al abrir o recargar una URL con `?q=` y `?sort=` se ve el mismo listado filtrado y ordenado.

Documentación completa de los parámetros: [`src/services/url-state.md`](src/services/url-state.md).

## 📂 Archivos clave

```
src/
 ├── components/Views/
 │    ├── ConversationsView.jsx  # lee/aplica q y sort
 │    ├── ConversationView.jsx   # lee/aplica id
 │    └── PokedexView.jsx        # lee/aplica pagina
 └── services/
      ├── conversations.js       # queryConversations(): filtrado y orden
      └── url-state.md           # qué params se usan y por qué
```

## ✅ Pruebas funcionales

- [x] Escribir/limpiar búsqueda actualiza la URL.
- [x] Abrir una URL con `?q=` y `?sort=` muestra el listado filtrado/ordenado (p. ej. `/conversaciones?q=saur&sort=titulo`).
- [x] Abrir directamente una conversación por su id funciona (p. ej. `/conversaciones/c25`).
- [ ] GIF: filtrar con query param → recargar → se mantiene → `../MEDIA/ejercicio2.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
