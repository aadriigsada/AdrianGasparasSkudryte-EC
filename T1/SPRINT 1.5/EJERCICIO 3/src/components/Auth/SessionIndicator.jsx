import { useNavigate } from 'react-router-dom'
import { endSession, useSession } from '../../services/storage'

// Muestra el estado de la sesión local y permite cerrarla.
function SessionIndicator() {
  const session = useSession()
  const navigate = useNavigate()

  const handleLogout = () => {
    endSession()
    // Redirección predecible: tras salir, siempre a la vista pública.
    navigate('/login', { replace: true })
  }

  if (!session) {
    return (
      <p className="session-indicator" role="status">
        <span className="session-dot session-off" aria-hidden="true" /> Sin sesión
      </p>
    )
  }

  return (
    <div className="session-indicator" role="status">
      <span className="session-dot session-on" aria-hidden="true" />
      <span>
        Sesión: <strong>{session}</strong>
      </span>
      <button type="button" className="session-logout" onClick={handleLogout}>
        Salir
      </button>
    </div>
  )
}

export default SessionIndicator
