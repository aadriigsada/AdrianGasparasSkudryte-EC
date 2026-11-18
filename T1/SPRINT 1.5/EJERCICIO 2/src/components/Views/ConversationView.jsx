import { Link, useParams } from 'react-router-dom'
import MessageList from '../Chatbot/MessageList'
import { getConversation } from '../../services/conversations'

// El id llega como segmento de la URL: /conversaciones/:id  (p. ej. /conversaciones/c25)
function ConversationView() {
  const { id } = useParams()
  const conversation = getConversation(id)

  return (
    <section className="view">
      <p>
        <Link to="/conversaciones">← Volver a Conversaciones</Link>
      </p>

      {conversation ? (
        <>
          <h1>{conversation.title}</h1>
          <p>
            Id: <code>{id}</code> · {conversation.messages.length} mensajes
          </p>
          <div className="chat-window chat-window-readonly">
            <MessageList messages={conversation.messages} isTyping={false} />
          </div>
        </>
      ) : (
        <>
          <h1>Conversación no encontrada</h1>
          <p>
            No existe ninguna conversación con el id <code>{id}</code>.
          </p>
        </>
      )}
    </section>
  )
}

export default ConversationView
