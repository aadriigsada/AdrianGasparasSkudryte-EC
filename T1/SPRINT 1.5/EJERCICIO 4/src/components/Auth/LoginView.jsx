import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { startSession, useSession } from '../../services/storage'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

// Vista pública: login simulado (sin contraseña ni servidor; sólo un nombre en localStorage).
function LoginView() {
  useDocumentTitle('Iniciar sesión')
  const session = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')

  // Con sesión ya iniciada, /login no tiene sentido: se va al Chat.
  if (session) return <Navigate to="/" replace />

  const blockedFrom = location.state?.from

  const handleSubmit = (e) => {
    e.preventDefault()
    const name = username.trim()
    if (!name) return
    startSession(name)
    // Redirección predecible: tras acceder, siempre al Chat.
    navigate('/', { replace: true })
  }

  return (
    <section className="view auth-view">
      <h1 tabIndex={-1}>Iniciar sesión</h1>

      {blockedFrom && (
        <p className="auth-notice" role="alert">
          Necesitas una sesión local para abrir <code>{blockedFrom}</code>.
        </p>
      )}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Nombre de entrenador
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ej: Ash"
            autoComplete="username"
            required
          />
        </label>
        <button type="submit">Acceder (simulado)</button>
      </form>

      <p className="auth-hint">
        La sesión es local: se guarda sólo en este navegador y no se envía a ningún servidor.
      </p>
    </section>
  )
}

export default LoginView
