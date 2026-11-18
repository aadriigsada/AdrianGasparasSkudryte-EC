# Actividad 1 · Mapa de rutas y contenedores funcionales

> **Historia de usuario:** COMO usuario que entra en la aplicación, QUIERO entender qué pantallas existen y moverme entre ellas, PARA acceder rápidamente al chat, a mis conversaciones, a la Pokédex y a los ajustes.

## Tarea 1 · Mapa de rutas

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `ChatView` | **Inicio / Chat**. Vista principal: el chatbot PokéSearch. |
| `/conversaciones` | `ConversationsView` | **Conversaciones**. Listado de conversaciones guardadas. |
| `/conversaciones/:id` | `ConversationView` | **Conversación**. Detalle de una conversación con su historial. |
| `/pokedex` | `PokedexView` | **Pokédex**. Demostrador de la PokéAPI (listado paginado). |
| `/ajustes` | `SettingsView` | **Ajustes**. Preferencias del asistente/modelo. |

```
AppLayout (cabecera + NavBar persistentes)
 ├── /                     ChatView
 ├── /conversaciones       ConversationsView ──► /conversaciones/:id  ConversationView
 ├── /pokedex              PokedexView
 └── /ajustes              SettingsView
```

## Tarea 2 · Contenedor visual común

`components/Layout/AppLayout.jsx` pinta la cabecera (logo, título y navegación) y un `<main>` con un `<Outlet />` de React Router. Al cambiar de ruta sólo se sustituye el contenido del `<Outlet />`: la cabecera no se desmonta y se queda fija arriba (`position: sticky`).

## Tarea 3 · Elementos de navegación

`components/Navigation/NavBar.jsx` usa `NavLink`, que genera enlaces `<a href>` reales:

- Se recorren con **Tab** y se activan con **Enter**.
- El enlace de la vista actual recibe `class="active"` y `aria-current="page"`.
- Los elementos del listado de conversaciones también son enlaces (`Link`) al detalle.

## 📂 Estructura

```
src/
 ├── App.jsx                     # declaración de rutas
 ├── main.jsx                    # BrowserRouter
 ├── components/
 │   ├── Chatbot/                # chat de los sprints anteriores
 │   ├── Layout/AppLayout.jsx    # cabecera + área de contenido
 │   ├── Navigation/NavBar.jsx   # enlaces funcionales
 │   └── Views/                  # ChatView, ConversationsView, ConversationView, PokedexView, SettingsView
 ├── services/                   # pokeapi.js, conversations.js, settings.js
 └── styles/                     # index.css, layout.css, chatbot.css
public/
 └── assets/
```

## ✅ Pruebas funcionales

- [x] Hacer clic en cada enlace cambia la vista correctamente.
- [x] La cabecera se mantiene estable.
- [ ] GIF: recorrido por todas las vistas usando la propia navegación → `../MEDIA/ejercicio1.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
