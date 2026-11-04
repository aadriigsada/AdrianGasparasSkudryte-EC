import './styles/App.css'
import './styles/layout.css'
import './styles/chatbot.css'
import ChatWindow from './components/Chatbot/ChatWindow'

function App() {
  return (
    <div className="app-container">
      <header className="chat-header">
        <img
          src="/assets/icons/LogoOmniWork.png"
          alt="Logo OmniWork"
          className="chatbot-logo"
        />
        <div>
          <h1>PokéSearch AI</h1>
          <p className="chat-subtitle">Buscador inteligente de Pokémon</p>
        </div>
      </header>

      <main className="chat-body">
        <ChatWindow />
      </main>
    </div>
  )
}

export default App
