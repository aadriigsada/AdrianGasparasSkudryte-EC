import { useState } from 'react'

function MessageInput({ onSendMessage }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    onSendMessage(value)
    setText('')
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ej: Pikachu, tipo fuego, #025..."
      />
      <button type="submit">Buscar</button>
    </form>
  )
}

export default MessageInput
