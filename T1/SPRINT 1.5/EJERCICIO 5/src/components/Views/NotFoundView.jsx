import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

// Psyduck (Nº 54), el Pokémon que nunca sabe dónde está.
const LOST_POKEMON =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png'

// Cualquier URL no declarada en App.jsx acaba aquí (ruta "*").
function NotFoundView() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useDocumentTitle('Página no encontrada')

  // React Router guarda la posición en el historial (idx): si la URL se abrió directamente no hay "atrás" dentro de la app.
  const canGoBack = window.history.state?.idx > 0

  return (
    <section className="view not-found">
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <img src={LOST_POKEMON} alt="Psyduck confundido" className="not-found-image" width="120" height="120" />

      <h1 tabIndex={-1}>Página no encontrada</h1>
      <p>
        La dirección <code>{pathname}</code> no existe en PokéSearch AI.
      </p>

      <div className="not-found-actions">
        <Link to="/" className="button-link">
          Volver a Inicio / Chat
        </Link>
        {canGoBack && (
          <button type="button" onClick={() => navigate(-1)}>
            Volver atrás
          </button>
        )}
      </div>
    </section>
  )
}

export default NotFoundView
