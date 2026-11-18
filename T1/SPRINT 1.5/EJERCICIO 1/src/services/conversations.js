// Datos de ejemplo: 60 conversaciones generadas a partir de los primeros Pokémon.
// Así hay un listado lo bastante largo para probar navegación, búsqueda y scroll.

const POKEMON = [
  'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise', 'caterpie', 'metapod', 'butterfree',
  'weedle', 'kakuna', 'beedrill', 'pidgey', 'pidgeotto', 'pidgeot',
  'rattata', 'raticate', 'spearow', 'fearow', 'ekans', 'arbok',
  'pikachu', 'raichu', 'sandshrew', 'sandslash', 'nidoran-f', 'nidorina',
  'nidoqueen', 'nidoran-m', 'nidorino', 'nidoking', 'clefairy', 'clefable',
  'vulpix', 'ninetales', 'jigglypuff', 'wigglytuff', 'zubat', 'golbat',
  'oddish', 'gloom', 'vileplume', 'paras', 'parasect', 'venonat',
  'venomoth', 'diglett', 'dugtrio', 'meowth', 'persian', 'psyduck',
  'golduck', 'mankey', 'primeape', 'growlithe', 'arcanine', 'poliwag',
]

const HOUR = 60 * 60 * 1000
const BASE_DATE = Date.UTC(2026, 10, 15, 18)

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)
const spriteUrl = (n) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n}.png`

const CONVERSATIONS = POKEMON.map((name, i) => {
  const number = i + 1
  const pretty = capitalize(name)
  return {
    id: `c${number}`,
    title: `Consulta sobre ${pretty}`,
    // Fechas desordenadas respecto al nombre, para que ordenar por fecha y por título dé resultados distintos.
    createdAt: new Date(BASE_DATE - ((i * 37) % 60) * 5 * HOUR).toISOString(),
    messages: [
      { id: `c${number}-m1`, sender: 'bot', text: '¡Hola! Dime el nombre o número de un Pokémon.' },
      { id: `c${number}-m2`, sender: 'user', text: name },
      {
        id: `c${number}-m3`,
        sender: 'bot',
        text: `¡Aquí tienes! Es **${pretty}** (Nº ${number}).`,
        image: spriteUrl(number),
      },
    ],
  }
})

export const listConversations = () => CONVERSATIONS

export const getConversation = (id) => CONVERSATIONS.find((c) => c.id === id) ?? null

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
