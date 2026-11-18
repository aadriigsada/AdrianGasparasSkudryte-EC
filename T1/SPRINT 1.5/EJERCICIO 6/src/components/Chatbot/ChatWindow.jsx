import { useEffect, useState } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { searchPokemon } from '../../services/pokeapi'
import { WELCOME_MESSAGE } from '../../services/conversations'

const DEFAULT_MESSAGES = [WELCOME_MESSAGE]

/**
 * Ventana de chat reutilizable.
 *  - Sin props: chat rápido (ChatView), no se guarda.
 *  - Con initialMessages + onMessagesChange: chat de una conversación guardada (ConversationView).
 *    Para cargar otra conversación hay que montar un ChatWindow nuevo (prop key distinta).
 */
function ChatWindow({ initialMessages = DEFAULT_MESSAGES, onMessagesChange, autoFocus = false }) {
  const [messages, setMessages] = useState(initialMessages)
  const [isTyping, setIsTyping] = useState(false)

  // Avisa al padre de cada cambio para que lo persista (no en el montaje inicial).
  useEffect(() => {
    if (messages !== initialMessages) onMessagesChange?.(messages)
  }, [messages, initialMessages, onMessagesChange])

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
