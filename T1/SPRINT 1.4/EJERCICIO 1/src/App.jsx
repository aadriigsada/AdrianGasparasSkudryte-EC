import './styles/App.css'

function App() {
  return (
    <div className="app-container">
      <header className="chat-header">
        {/* Vite sirve la carpeta public/ desde la raíz: public/assets/x.png -> /assets/x.png */}
        <img
          src="/assets/LogoOmniWork.png"
          alt="Logo OmniWork" 
          className="chatbot-logo"
        />
        <h1>OmniWork Assistant</h1>
      </header>

      <main className="chat-body">
        <p>¡Hola! Soy tu asistente virtual de OmniWork. ¿En qué te puedo ayudar hoy?</p>
      </main>
    </div>
  )
}

export default App