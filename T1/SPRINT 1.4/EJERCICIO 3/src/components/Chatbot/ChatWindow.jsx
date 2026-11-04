import MessageList from './MessageList'
import MessageInput from './MessageInput'

function ChatWindow() {
  return (
    <section className="chat-window">
      <MessageList />
      <MessageInput />
    </section>
  )
}

export default ChatWindow
