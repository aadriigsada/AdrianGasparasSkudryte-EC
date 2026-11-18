# Actividad 3 · Rutas "protegidas" en cliente (guards) y redirecciones

> **Historia de usuario:** COMO usuario no autenticado en este dispositivo, QUIERO ver sólo las vistas públicas, PARA evitar acceder a secciones que requieren sesión local.

Parte del proyecto de la Actividad 2 (rutas, parámetros y query params).

## Tarea 1 · Política de acceso

| Ruta | Acceso |
|------|--------|
| `/login` | 🌐 Pública |
| `/`, `/conversaciones`, `/conversaciones/:id`, `/pokedex`, `/ajustes` | 🔒 Requieren sesión local |

Detalle completo en [`src/components/Navigation/Guards.md`](src/components/Navigation/Guards.md).

## Tarea 2 · Guarda funcional

`RequireAuth.jsx` envuelve las rutas protegidas. Sin sesión redirige a `/login` y muestra el aviso *"Necesitas una sesión local para abrir …"*. La sesión es un nombre guardado en `localStorage` mediante `services/storage.js`, y `useSession()` hace que toda la app reaccione cuando cambia.

## Tarea 3 · Redirecciones predecibles

- **Acceder** → siempre a Chat (`/`).
- **Salir** (botón en la cabecera) → siempre a `/login`.
- Abrir `/login` con sesión activa → Chat.
- Todas las redirecciones usan `replace`, así "Atrás" no devuelve a pantallas bloqueadas.

## 📂 Archivos nuevos

```
src/
 ├── components/
 │   ├── Auth/
 │   │    ├── LoginView.jsx         # login simulado (vista pública)
 │   │    └── SessionIndicator.jsx  # estado de la sesión + botón Salir
 │   └── Navigation/
 │        ├── RequireAuth.jsx       # la guarda
 │        └── Guards.md             # reglas de acceso y redirecciones
 ├── services/
 │   └── storage.js                 # persistencia de la sesión (y helpers JSON)
 └── styles/
     └── auth.css
```

## ✅ Pruebas funcionales

- [x] Sin sesión: intentar abrir Conversaciones/Chat lleva a la vista pública.
- [x] Con sesión: se accede a cualquier vista protegida.
- [x] Tras cerrar sesión: redirección a la vista pública.
- [ ] GIF: intento sin sesión → bloqueo → login simulado → acceso → logout → `../MEDIA/ejercicio3.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
