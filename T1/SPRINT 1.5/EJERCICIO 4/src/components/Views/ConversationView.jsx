import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import MessageList from '../Chatbot/MessageList'
import { getConversation } from '../../services/conversations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

// El id llega como segmento de la URL: /conversaciones/:id  (p. ej. /conversaciones/c25)
function ConversationView() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const conversation = getConversation(id)
  useDocumentTitle(conversation ? conversation.title : 'Conversación no encontrada')

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

      {conversation ? (
        <>
          <h1 tabIndex={-1}>{conversation.title}</h1>
          <p>
            Id: <code>{id}</code> · {conversation.messages.length} mensajes
          </p>
          <div className="chat-window chat-window-readonly">
            <MessageList messages={conversation.messages} isTyping={false} />
          </div>
        </>
      ) : (
        <>
          <h1 tabIndex={-1}>Conversación no encontrada</h1>
          <p>
            No existe ninguna conversación con el id <code>{id}</code>.
          </p>
        </>
      )}
    </section>
  )
}

export default ConversationView
