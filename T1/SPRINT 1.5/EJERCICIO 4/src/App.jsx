import { Route, Routes } from 'react-router-dom'
import './styles/layout.css'
import './styles/chatbot.css'
import './styles/auth.css'
import AppLayout from './components/Layout/AppLayout'
import RequireAuth from './components/Navigation/RequireAuth'
import LoginView from './components/Auth/LoginView'
import ChatView from './components/Views/ChatView'
import ConversationsView from './components/Views/ConversationsView'
import ConversationView from './components/Views/ConversationView'
import PokedexView from './components/Views/PokedexView'
import SettingsView from './components/Views/SettingsView'

/*
 * Mapa de rutas (reglas de acceso en components/Navigation/Guards.md):
 *   Públicas
 *     /login               -> LoginView
 *   Protegidas (requieren sesión local)
 *     /                    -> ChatView
 *     /conversaciones      -> ConversationsView   (?q= &sort=)
 *     /conversaciones/:id  -> ConversationView
 *     /pokedex             -> PokedexView         (?pagina=)
 *     /ajustes             -> SettingsView
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="login" element={<LoginView />} />

        <Route element={<RequireAuth />}>
          <Route index element={<ChatView />} />
          <Route path="conversaciones" element={<ConversationsView />} />
          <Route path="conversaciones/:id" element={<ConversationView />} />
          <Route path="pokedex" element={<PokedexView />} />
          <Route path="ajustes" element={<SettingsView />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
