import './styles/App.css'

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
        <p>¡Hola! Dime el nombre, tipo o número de un Pokémon y lo busco por ti.</p>
      </main>

      <form className="chat-input" onSubmit={(e) => e.preventDefault()}>
        <input type="text" placeholder="Ej: Pikachu, tipo fuego, #025..." />
        <button type="submit">Buscar</button>
      </form>
    </div>
  )
}

export default App
