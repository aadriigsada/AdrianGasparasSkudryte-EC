import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Región aria-live: los lectores de pantalla anuncian cada cambio de vista
// (en una SPA no hay recarga de página que lo haga de forma automática).
function ScreenAnnouncer() {
  const { pathname } = useLocation()
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Pequeña espera para que la vista nueva haya actualizado document.title.
    const timer = setTimeout(() => setMessage(`Vista cargada: ${document.title}`), 150)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <p className="sr-only" role="status" aria-live="polite">
      {message}
    </p>
  )
}

export default ScreenAnnouncer
