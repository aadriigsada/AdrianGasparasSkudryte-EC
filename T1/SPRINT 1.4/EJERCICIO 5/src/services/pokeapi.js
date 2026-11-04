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

export const searchPokemon = async (query) => {
  const cleanQuery = query.trim().toLowerCase().replace(/^#/, '').replace(/^0+(?=\d)/, '')
  if (!cleanQuery) return { error: true }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(cleanQuery)}`)
    if (!response.ok) return { error: true }

    const data = await response.json()

    return {
      error: false,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      id: data.id,
      types: data.types.map(({ type }) => TYPE_TRANSLATIONS[type.name] ?? type.name),
      image: data.sprites.front_default,
    }
  } catch {
    return { error: true }
  }
}
