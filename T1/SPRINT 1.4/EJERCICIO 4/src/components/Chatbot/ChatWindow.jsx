import { useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

const WELCOME = {
  id: 'welcome',
  text: '¡Hola! Dime el nombre, tipo o número de un Pokémon.',
  sender: 'bot',
}

function ChatWindow() {
  const [messages, setMessages] = useState([WELCOME])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (text) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text, sender: 'user' }])
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: 'Esta es una respuesta simulada para: ' + text,
          sender: 'bot',
        },
      ])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <section className="chat-window">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} />
    </section>
  )
}

export default ChatWindow
