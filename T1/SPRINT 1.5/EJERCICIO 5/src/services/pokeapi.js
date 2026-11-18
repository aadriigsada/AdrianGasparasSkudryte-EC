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

// Caché en memoria: al volver con Atrás/Adelante a una página ya vista
// se reutiliza el resultado en vez de repetir la petición.
const listCache = new Map()

// Listado paginado para la Pokédex. Lanza un Error si la API falla.
// forceError: pide un endpoint inexistente de la PokéAPI (respuesta 404 real) para probar el manejo de errores.
export const listPokemon = ({ limit = 24, offset = 0, forceError = false } = {}) => {
  if (forceError) return fetchBrokenEndpoint()

  const key = `${limit}:${offset}`
  if (!listCache.has(key)) {
    const request = fetchPokemonPage(limit, offset)
    // Los errores no se cachean, para que "reintentar" haga una petición nueva.
    request.catch(() => listCache.delete(key))
    listCache.set(key, request)
  }
  return listCache.get(key)
}

// Petición JSON con mensajes de error comprensibles (sin tener que mirar la consola).
const getJSON = async (url) => {
  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('No se ha podido conectar con la PokéAPI. Revisa tu conexión a Internet.')
  }
  if (!response.ok) throw new Error(`La PokéAPI respondió con el estado ${response.status}.`)
  return response.json()
}

const fetchBrokenEndpoint = () => getJSON(`${API}/pokemon-que-no-existe`)

const fetchPokemonPage = async (limit, offset) => {
  const data = await getJSON(`${API}/pokemon?limit=${limit}&offset=${offset}`)
  return {
    total: data.count,
    items: data.results.map(({ name, url }) => {
      const id = Number(url.split('/').filter(Boolean).pop())
      return { id, name: capitalize(name), image: spriteUrl(id) }
    }),
  }
}

// Búsqueda del chat. No lanza: devuelve { error: true, reason } para que el chat responda con un mensaje.
//   reason: 'not-found' (no existe ese Pokémon) | 'network' (fallo de conexión o de la API)
export const searchPokemon = async (query) => {
  const cleanQuery = query.trim().toLowerCase().replace(/^#/, '').replace(/^0+(?=\d)/, '')
  if (!cleanQuery) return { error: true, reason: 'not-found' }

  try {
    const response = await fetch(`${API}/pokemon/${encodeURIComponent(cleanQuery)}`)
    if (response.status === 404) return { error: true, reason: 'not-found' }
    if (!response.ok) return { error: true, reason: 'network' }

    const data = await response.json()

    return {
      error: false,
      name: capitalize(data.name),
      id: data.id,
      types: data.types.map(({ type }) => TYPE_TRANSLATIONS[type.name] ?? type.name),
      image: data.sprites.front_default,
    }
  } catch {
    return { error: true, reason: 'network' }
  }
}
