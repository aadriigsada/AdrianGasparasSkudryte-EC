# Actividad 6 · Deep-linking de conversación y navegación programática

> **Historia de usuario:** COMO usuario que comparte trabajo, QUIERO abrir directamente una conversación concreta y que la aplicación lo respete, PARA retomar un hilo sin pasos intermedios.

Parte del proyecto de la Actividad 5. Es la versión final del sprint: incluye todo lo anterior.

## Tarea 1 · Abrir conversación por URL

- Las conversaciones se guardan en `localStorage` (`services/conversations.js`). La primera vez se crean 60 de ejemplo (`c1` … `c60`).
- Al abrir `/conversaciones/c25` desde fuera (escribiendo la URL, recargando o en otra pestaña) se carga ese historial y se puede seguir chateando. Cada mensaje nuevo se guarda.
- `ConversationView` monta una pantalla nueva por cada id (`key={id}`), así al saltar de una conversación a otra no queda nada de la anterior.

## Tarea 2 · Acciones de navegación desde la UI

| Acción | Dónde | Qué hace | Historial |
|--------|-------|----------|-----------|
| **Nueva conversación** | Chat, Conversaciones, Conversación | Crea una conversación vacía, navega a `/conversaciones/:nuevoId` y pone el foco en el input. El título se genera con la primera pregunta. | `push` |
| **Duplicar** | Conversación | Crea una copia (`… (copia)`) con id nuevo y navega a ella. Muestra el aviso "Copia creada…". | `push`: Atrás vuelve a la original |
| **Borrar** | Conversación | Pide confirmación, borra y vuelve a `/conversaciones` con el aviso "Conversación … borrada". | `replace`: Atrás no lleva a la conversación borrada |

## Tarea 3 · Estados vacíos

Si el id no existe (enlace antiguo, conversación borrada o id mal escrito), se muestra **"Conversación no encontrada"** con el id, un botón **Volver a Conversaciones** y un enlace **Ir al Chat**.

| Estado de `ConversationView` | Qué se ve |
|------------------------------|-----------|
| Cargando | `Loading` ("Cargando conversación…") |
| Error al leer | `ErrorBlock` con Reintentar |
| Id inexistente | Estado vacío + CTA a Conversaciones |
| Encontrada | Acciones + `ChatWindow` con el historial |

## Contrato del servicio

Documentado en la cabecera de [`src/services/conversations.js`](src/services/conversations.js):

```
fetchConversations()          → Promise<Conversation[]>
fetchConversation(id)         → Promise<Conversation | null>   (null = no existe)
createConversation()          → Conversation
duplicateConversation(id)     → Conversation | null
deleteConversation(id)        → boolean
saveMessages(id, messages)    → Conversation | null
```

## 📂 Archivos clave

```
src/
 ├── components/
 │   ├── Chatbot/
 │   │    ├── ChatWindow.jsx      # admite initialMessages + onMessagesChange
 │   │    ├── MessageList.jsx
 │   │    └── MessageInput.jsx
 │   └── Views/
 │        ├── ConversationsView.jsx  # + botón "Nueva conversación" y avisos
 │        └── ConversationView.jsx   # id inexistente, Nueva/Duplicar/Borrar
 └── services/
      └── conversations.js           # persistencia + contrato de lectura por id
```

## ✅ Pruebas funcionales

- [x] Abrir por URL una conversación válida funciona y el historial se ve.
- [x] Nueva/Duplicar/Borrar navegan de forma correcta y predecible.
- [x] Una conversación inexistente muestra el estado "no encontrada" y un enlace de retorno.
- [ ] GIF: copiar URL → pegar en otra pestaña → la conversación carga; borrar → volver al listado → `../MEDIA/ejercicio6.gif`

## ⚙️ Ejecución

```bash
npm install
npm run dev
```
