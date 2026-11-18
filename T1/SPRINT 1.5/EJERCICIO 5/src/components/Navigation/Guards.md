# Reglas de acceso y redirecciones

La aplicación no tiene servidor de autenticación. La **sesión local** se simula guardando el nombre del usuario en `localStorage` (clave `pokesearch.session`) desde `services/storage.js`. Es una protección **de cliente**: sirve para ordenar la navegación, no como seguridad real.

## Política de acceso

| Ruta | Vista | Acceso |
|------|-------|--------|
| `/login` | `LoginView` | 🌐 Pública |
| `/` | `ChatView` | 🔒 Requiere sesión |
| `/conversaciones` | `ConversationsView` | 🔒 Requiere sesión |
| `/conversaciones/:id` | `ConversationView` | 🔒 Requiere sesión |
| `/pokedex` | `PokedexView` | 🔒 Requiere sesión |
| `/ajustes` | `SettingsView` | 🔒 Requiere sesión |

La cabecera (logo, navegación e indicador de sesión) está siempre visible. Los enlaces a vistas protegidas también se ven sin sesión, y al pulsarlos la guarda redirige a `/login`.

## Guarda: `RequireAuth.jsx`

Es una ruta "layout" que envuelve a todas las rutas protegidas en `App.jsx`:

```jsx
<Route element={<RequireAuth />}>
  <Route index element={<ChatView />} />
  …
</Route>
```

- **Con sesión:** renderiza `<Outlet />`, es decir, la vista pedida.
- **Sin sesión:** `<Navigate to="/login" replace state={{ from }} />`.
  - `replace` evita que "Atrás" vuelva a la vista bloqueada, lo que provocaría un bucle de redirecciones.
  - `from` guarda la ruta que se intentó abrir; `LoginView` la usa para mostrar el aviso funcional *"Necesitas una sesión local para abrir /conversaciones"*.

`useSession()` usa `useSyncExternalStore`, así que la guarda reacciona al instante cuando la sesión cambia, también si se cierra desde otra pestaña (evento `storage`).

## Redirecciones

| Situación | Destino | Cómo |
|-----------|---------|------|
| Sin sesión → abrir una ruta protegida | `/login` + aviso | `RequireAuth` (`replace`) |
| Acceder (login simulado) | `/` (Chat) | `navigate('/', { replace: true })` |
| Abrir `/login` con sesión activa | `/` (Chat) | `<Navigate to="/" replace />` |
| Salir (logout) | `/login` | `navigate('/login', { replace: true })` |

Tras acceder se va **siempre al Chat**, aunque se hubiera intentado abrir otra vista. Así la redirección es predecible. Las redirecciones usan `replace` para que el historial no conserve pantallas por las que el usuario no puede pasar.
