const TYPE_TRANSLATIONS = {
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
  normal: 'Normal',
}

const API = 'https://pokeapi.co/api/v2'

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

export const spriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

// Listado paginado para la Pokédex. Lanza un Error si la API falla.
export const listPokemon = async ({ limit = 24, offset = 0 } = {}) => {
  const response = await fetch(`${API}/pokemon?limit=${limit}&offset=${offset}`)
  if (!response.ok) throw new Error(`La PokéAPI respondió con el estado ${response.status}`)

  const data = await response.json()
  return {
    total: data.count,
    items: data.results.map(({ name, url }) => {
      const id = Number(url.split('/').filter(Boolean).pop())
      return { id, name: capitalize(name), image: spriteUrl(id) }
    }),
  }
}

export const searchPokemon = async (query) => {
  const cleanQuery = query.trim().toLowerCase().replace(/^#/, '').replace(/^0+(?=\d)/, '')
  if (!cleanQuery) return { error: true }

  try {
    const response = await fetch(`${API}/pokemon/${encodeURIComponent(cleanQuery)}`)
    if (!response.ok) return { error: true }

    const data = await response.json()

    return {
      error: false,
      name: capitalize(data.name),
      id: data.id,
      types: data.types.map(({ type }) => TYPE_TRANSLATIONS[type.name] ?? type.name),
      image: data.sprites.front_default,
    }
  } catch {
    return { error: true }
  }
}
