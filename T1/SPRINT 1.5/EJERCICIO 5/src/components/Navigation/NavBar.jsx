import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Chat', end: true },
  { to: '/conversaciones', label: 'Conversaciones' },
  { to: '/pokedex', label: 'Pokédex' },
  { to: '/ajustes', label: 'Ajustes' },
]

// NavLink renderiza un <a href> real: funciona con Tab + Enter
// y añade class="active" + aria-current="page" al enlace de la vista actual.
function NavBar() {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <ul>
        {LINKS.map((link) => (
          <li key={link.to}>
            <NavLink to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
