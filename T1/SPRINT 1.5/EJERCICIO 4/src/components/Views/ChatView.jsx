import ChatWindow from '../Chatbot/ChatWindow'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

function ChatView() {
  useDocumentTitle('Chat')

  return (
    <section className="view">
      <h1 tabIndex={-1}>Chat</h1>
      {/* Al entrar en el Chat el foco va al input */}
      <ChatWindow autoFocus />
    </section>
  )
}

export default ChatView
