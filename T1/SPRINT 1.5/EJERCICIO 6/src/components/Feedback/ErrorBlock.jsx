import { Link } from 'react-router-dom'

// Bloque de error común. Se pinta DENTRO de la vista que falla:
// la cabecera y la navegación siguen funcionando y siempre hay una salida (Reintentar / Volver al Chat).
function ErrorBlock({ title = 'Algo ha fallado', error, onRetry }) {
  return (
    <div className="error-block" role="alert">
      <strong>{title}</strong>
      {error && <p>{error.message ?? String(error)}</p>}
      <div className="toolbar">
        {onRetry && (
          <button type="button" onClick={onRetry}>
            Reintentar
          </button>
        )}
        <Link to="/">Volver al Chat</Link>
      </div>
    </div>
  )
}

export default ErrorBlock
