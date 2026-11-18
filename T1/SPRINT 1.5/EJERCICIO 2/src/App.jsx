import { Route, Routes } from 'react-router-dom'
import './styles/layout.css'
import './styles/chatbot.css'
import AppLayout from './components/Layout/AppLayout'
import ChatView from './components/Views/ChatView'
import ConversationsView from './components/Views/ConversationsView'
import ConversationView from './components/Views/ConversationView'
import PokedexView from './components/Views/PokedexView'
import SettingsView from './components/Views/SettingsView'

/*
 * Mapa de rutas (documentado en README.md):
 *   /                    -> ChatView           (Inicio / Chat)
 *   /conversaciones      -> ConversationsView  (listado)
 *   /conversaciones/:id  -> ConversationView   (detalle con historial)
 *   /pokedex             -> PokedexView        (demostrador PokéAPI)
 *   /ajustes             -> SettingsView       (preferencias del asistente)
 */
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ChatView />} />
        <Route path="conversaciones" element={<ConversationsView />} />
        <Route path="conversaciones/:id" element={<ConversationView />} />
        <Route path="pokedex" element={<PokedexView />} />
        <Route path="ajustes" element={<SettingsView />} />
      </Route>
    </Routes>
  )
}

export default App
