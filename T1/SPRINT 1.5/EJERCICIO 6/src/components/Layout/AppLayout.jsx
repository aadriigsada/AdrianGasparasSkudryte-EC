import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from '../Navigation/NavBar'
import SessionIndicator from '../Auth/SessionIndicator'
import ScreenAnnouncer from '../Feedback/ScreenAnnouncer'

// Contenedor común: cabecera persistente + área de contenido.
// Al navegar sólo cambia lo que hay dentro de <Outlet />; la cabecera nunca se desmonta.
function AppLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef(null)

  // Scroll: al cambiar de vista se empieza arriba.
  // Las vistas con listados largos (ConversationsView) restauran después su posición con useScrollRestoration.
  // Sólo depende de pathname: cambiar ?q= o ?sort= no es cambiar de vista.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Foco: al cambiar de vista va a un elemento significativo.
  //  - Si la vista ya ha enfocado algo propio (p. ej. el input del Chat con autoFocus), se respeta.
  //  - Si no, se enfoca el <h1> de la vista (tabIndex=-1), así teclado y lector de pantalla empiezan en el contenido nuevo.
  useEffect(() => {
    const main = mainRef.current
    if (!main || main.contains(document.activeElement)) return
    main.querySelector('h1')?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="app-brand">
          <img src="/assets/icons/LogoOmniWork.png" alt="" className="app-logo" />
          <span className="app-title">PokéSearch AI</span>
        </div>
        <NavBar />
        <SessionIndicator />
      </header>

      <ScreenAnnouncer />

      <main className="app-content" ref={mainRef}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
