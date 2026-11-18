import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSession } from '../../services/storage'

// Guarda de rutas (ver Guards.md).
// Sin sesión local: redirige a /login (con replace, para que "Atrás" no vuelva a la vista bloqueada)
// y le pasa la ruta que se intentó abrir para mostrar el aviso.
function RequireAuth() {
  const session = useSession()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return <Outlet />
}

export default RequireAuth
