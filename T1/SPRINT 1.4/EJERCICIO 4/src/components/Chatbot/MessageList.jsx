import { useEffect, useRef } from 'react'

const AVATAR = '/assets/icons/LogoOmniWork.png'

function MessageList({ messages, isTyping }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message message-${msg.sender}`}>
          {msg.sender === 'bot' && <img src={AVATAR} alt="Bot" className="message-avatar" />}
          <div className="message-bubble">{msg.text}</div>
        </div>
      ))}

      {isTyping && (
        <div className="message message-bot">
          <img src={AVATAR} alt="Bot" className="message-avatar" />
          <div className="message-bubble message-typing">Pensando...</div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}

export default MessageList
