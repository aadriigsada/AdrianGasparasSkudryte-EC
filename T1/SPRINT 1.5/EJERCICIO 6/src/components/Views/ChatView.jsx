import { useNavigate } from 'react-router-dom'
import ChatWindow from '../Chatbot/ChatWindow'
import { createConversation } from '../../services/conversations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

function ChatView() {
  useDocumentTitle('Chat')
  const navigate = useNavigate()

  // Crea una conversación guardada y navega a ella: el contenedor del chat queda listo con el foco en el input.
  const handleNew = () => {
    const created = createConversation()
    navigate(`/conversaciones/${created.id}`)
  }

  return (
    <section className="view">
      <h1 tabIndex={-1}>Chat</h1>

      <div className="toolbar">
        <span>Chat rápido: no se guarda.</span>
        <button type="button" onClick={handleNew}>
          Nueva conversación guardada
        </button>
      </div>

      {/* Al entrar en el Chat el foco va al input */}
      <ChatWindow autoFocus />
    </section>
  )
}

export default ChatView
