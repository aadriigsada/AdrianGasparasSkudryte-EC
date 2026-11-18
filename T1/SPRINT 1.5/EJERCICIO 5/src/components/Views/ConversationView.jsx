import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import MessageList from '../Chatbot/MessageList'
import { fetchConversation } from '../../services/conversations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAsync } from '../../hooks/useAsync'
import Loading from '../Feedback/Loading'
import ErrorBlock from '../Feedback/ErrorBlock'

// El id llega como segmento de la URL: /conversaciones/:id  (p. ej. /conversaciones/c25)
function ConversationView() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { status, data: conversation, error, reload } = useAsync(() => fetchConversation(id), id)

  let title = 'Conversación'
  if (status === 'success') title = conversation ? conversation.title : 'Conversación no encontrada'
  useDocumentTitle(title)

  // Si venimos del listado, "Volver" equivale a Atrás: recupera filtros y punto de scroll.
  // Si se abrió la URL directamente, es un enlace normal a /conversaciones.
  const handleBack = (e) => {
    if (location.state?.fromList) {
      e.preventDefault()
      navigate(-1)
    }
  }

  return (
    <section className="view">
      <p>
        <Link to="/conversaciones" onClick={handleBack}>
          ← Volver a Conversaciones
        </Link>
      </p>

      <h1 tabIndex={-1}>{title}</h1>

      {status === 'loading' && <Loading label="Cargando conversación…" />}

      {status === 'error' && (
        <ErrorBlock title="No se ha podido cargar la conversación" error={error} onRetry={reload} />
      )}

      {status === 'success' && !conversation && (
        <p>
          No existe ninguna conversación con el id <code>{id}</code>.
        </p>
      )}

      {status === 'success' && conversation && (
        <>
          <p>
            Id: <code>{id}</code> · {conversation.messages.length} mensajes
          </p>
          <div className="chat-window chat-window-readonly">
            <MessageList messages={conversation.messages} isTyping={false} />
          </div>
        </>
      )}
    </section>
  )
}

export default ConversationView
