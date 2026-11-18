// Estado de carga común a todas las vistas.
function Loading({ label = 'Cargando…' }) {
  return (
    <p className="loading" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      {label}
    </p>
  )
}

export default Loading
