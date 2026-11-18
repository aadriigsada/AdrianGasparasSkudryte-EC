import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ChatWindow from '../Chatbot/ChatWindow'
import {
  createConversation,
  deleteConversation,
  duplicateConversation,
  fetchConversation,
  saveMessages,
} from '../../services/conversations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAsync } from '../../hooks/useAsync'
import Loading from '../Feedback/Loading'
import ErrorBlock from '../Feedback/ErrorBlock'

// /conversaciones/:id
// Se monta una pantalla nueva por cada id (key={id}): al duplicar o crear y navegar a otro id
// no queda nada de la conversación anterior (mensajes, título, estado de carga…).
function ConversationView() {
  const { id } = useParams()
  return <ConversationScreen key={id} id={id} />
}

function ConversationScreen({ id }) {
  const location = useLocation()
  const navigate = useNavigate()

  const { status, data: conversation, error, reload } = useAsync(() => fetchConversation(id), id)
  // El título puede cambiar al enviar el primer mensaje de una conversación nueva.
  const [liveTitle, setLiveTitle] = useState(null)

  let title = 'Conversación'
  if (status === 'success') title = conversation ? (liveTitle ?? conversation.title) : 'Conversación no encontrada'
  useDocumentTitle(title)

  const notice = location.state?.notice

  // Si venimos del listado, "Volver" equivale a Atrás: recupera filtros y punto de scroll.
  const handleBack = (e) => {
    if (location.state?.fromList) {
      e.preventDefault()
      navigate(-1)
    }
  }

  /* ===== Acciones de navegación programática ===== */

  // Nueva: crea una conversación vacía y navega a ella; el input del chat recibe el foco.
  const handleNew = () => {
    const created = createConversation()
    navigate(`/conversaciones/${created.id}`)
  }

  // Duplicar: crea la copia y navega a ella (push: Atrás vuelve a la original).
  const handleDuplicate = () => {
    const copy = duplicateConversation(id)
    if (!copy) return
    navigate(`/conversaciones/${copy.id}`, {
      state: { notice: `Copia creada a partir de «${title}».` },
    })
  }

  // Borrar: vuelve al listado con replace, así Atrás no lleva a una conversación que ya no existe.
  const handleDelete = () => {
    if (!window.confirm(`¿Borrar «${title}»? Esta acción no se puede deshacer.`)) return
    deleteConversation(id)
    navigate('/conversaciones', {
      replace: true,
      state: { notice: `Conversación «${title}» borrada.` },
    })
  }

  const handleMessagesChange = (messages) => {
    const updated = saveMessages(id, messages)
    if (updated) setLiveTitle(updated.title)
  }

  /* ===== Estados ===== */

  if (status === 'loading') {
    return (
      <section className="view">
        <h1 tabIndex={-1}>{title}</h1>
        <Loading label="Cargando conversación…" />
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="view">
        <h1 tabIndex={-1}>{title}</h1>
        <ErrorBlock title="No se ha podido cargar la conversación" error={error} onRetry={reload} />
      </section>
    )
  }

  // Estado vacío: el id de la URL no existe (enlace antiguo, conversación borrada, id mal escrito…).
  if (!conversation) {
    return (
      <section className="view">
        <h1 tabIndex={-1}>{title}</h1>
        <div className="empty-state">
          <p>
            No existe ninguna conversación con el id <code>{id}</code>. Puede que se haya borrado o que el
            enlace no sea correcto.
          </p>
          <div className="toolbar">
            <Link to="/conversaciones" className="button-link">
              Volver a Conversaciones
            </Link>
            <Link to="/">Ir al Chat</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="view">
      <p>
        <Link to="/conversaciones" onClick={handleBack}>
          ← Volver a Conversaciones
        </Link>
      </p>

      <h1 tabIndex={-1}>{title}</h1>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="toolbar">
        <button type="button" onClick={handleNew}>
          Nueva conversación
        </button>
        <button type="button" onClick={handleDuplicate}>
          Duplicar
        </button>
        <button type="button" className="button-danger" onClick={handleDelete}>
          Borrar
        </button>
        <span>
          Id: <code>{id}</code>
        </span>
      </div>

      <ChatWindow
        initialMessages={conversation.messages}
        onMessagesChange={handleMessagesChange}
        autoFocus
      />
    </section>
  )
}

export default ConversationView
