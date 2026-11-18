import { Outlet } from 'react-router-dom'
import NavBar from '../Navigation/NavBar'

// Contenedor común: cabecera persistente + área de contenido.
// Al navegar sólo cambia lo que hay dentro de <Outlet />; la cabecera nunca se desmonta.
function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-brand">
          <img src="/assets/icons/LogoOmniWork.png" alt="" className="app-logo" />
          <span className="app-title">PokéSearch AI</span>
        </div>
        <NavBar />
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
