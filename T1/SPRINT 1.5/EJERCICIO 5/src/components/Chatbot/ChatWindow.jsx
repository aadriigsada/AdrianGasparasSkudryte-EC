import { useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { searchPokemon } from '../../services/pokeapi'

const WELCOME = {
  id: 'welcome',
  text: '¡Hola! Dime el nombre o número de un Pokémon.',
  sender: 'bot',
}

function ChatWindow({ autoFocus = false }) {
  const [messages, setMessages] = useState([WELCOME])
  const [isTyping, setIsTyping] = useState(false)

  const addMessage = (message) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), ...message }])
  }

  const handleSendMessage = async (text) => {
    addMessage({ text, sender: 'user' })
    setIsTyping(true)

    const pokemon = await searchPokemon(text)

    if (pokemon.error && pokemon.reason === 'network') {
      addMessage({
        text: 'No he podido conectar con la PokéAPI. Comprueba tu conexión e inténtalo de nuevo.',
        sender: 'bot',
        isError: true,
      })
    } else if (pokemon.error) {
      addMessage({
        text: `No he encontrado ningún Pokémon que coincida con '${text}'. Revisa si está bien escrito.`,
        sender: 'bot',
      })
    } else {
      addMessage({
        text: `¡Aquí tienes! Es **${pokemon.name}** (Nº ${pokemon.id}). Tipo: ${pokemon.types.join(' / ')}.`,
        sender: 'bot',
        image: pokemon.image,
      })
    }

    setIsTyping(false)
  }

  return (
    <section className="chat-window">
      <MessageList messages={messages} isTyping={isTyping} />
      <MessageInput onSendMessage={handleSendMessage} autoFocus={autoFocus} />
    </section>
  )
}

export default ChatWindow
