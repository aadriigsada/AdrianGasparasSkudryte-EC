function MessageInput() {
  const handleSubmit = (e) => {
    e.preventDefault()
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input type="text" placeholder="Ej: Pikachu, tipo fuego, #025..." />
      <button type="submit">Buscar</button>
    </form>
  )
}

export default MessageInput
