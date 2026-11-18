import { useEffect, useRef } from 'react'

const AVATAR = '/assets/icons/LogoOmniWork.png'

// Convierte **texto** en <strong>texto</strong>
const renderText = (text) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))

function MessageList({ messages, isTyping }) {
  const listRef = useRef(null)

  // Baja hasta el último mensaje desplazando sólo la propia lista
  // (scrollIntoView movería también la página y rompería la restauración de scroll).
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="message-list" ref={listRef}>
      {messages.map((msg) => (
        <div key={msg.id} className={`message message-${msg.sender}`}>
          {msg.sender === 'bot' && <img src={AVATAR} alt="Bot" className="message-avatar" />}
          <div className="message-bubble">
            {renderText(msg.text)}
            {msg.image && <img src={msg.image} alt="Sprite" className="pokemon-sprite" />}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="message message-bot">
          <img src={AVATAR} alt="Bot" className="message-avatar" />
          <div className="message-bubble message-typing">Pensando...</div>
        </div>
      )}
    </div>
  )
}

export default MessageList
