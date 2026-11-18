import { Link, useParams } from 'react-router-dom'
import MessageList from '../Chatbot/MessageList'
import { getConversation } from '../../services/conversations'

function ConversationView() {
  const { id } = useParams()
  const conversation = getConversation(id)

  return (
    <section className="view">
      <p>
        <Link to="/conversaciones">← Volver a Conversaciones</Link>
      </p>
      <h1>{conversation ? conversation.title : 'Conversación'}</h1>
      <p>
        Id: <code>{id}</code>
      </p>

      {conversation ? (
        <div className="chat-window chat-window-readonly">
          <MessageList messages={conversation.messages} isTyping={false} />
        </div>
      ) : (
        <p>No existe ninguna conversación con ese id.</p>
      )}
    </section>
  )
}

export default ConversationView
