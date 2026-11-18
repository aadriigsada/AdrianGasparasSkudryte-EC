import { readJSON, writeJSON } from './storage'

/**
 * ============================================================================
 *  Servicio de conversaciones · CONTRATO
 * ============================================================================
 *  Persistencia: localStorage, clave "pokesearch.conversations".
 *  La primera vez se rellena con 60 conversaciones de ejemplo (c1 … c60).
 *  Al guardarse en localStorage, una URL /conversaciones/:id abierta en otra
 *  pestaña del mismo navegador ve los mismos datos.
 *
 *  Tipos
 *    Message      { id: string, sender: 'user' | 'bot', text: string,
 *                   image?: string, isError?: boolean }
 *    Conversation { id: string, title: string, createdAt: string (ISO),
 *                   messages: Message[] }
 *
 *  Lectura: asíncrona, con 500 ms de latencia simulada (como un servidor)
 *    fetchConversations()   → Promise<Conversation[]>
 *    fetchConversation(id)  → Promise<Conversation | null>
 *        · null  ⇒ el id NO existe. No es un error: la vista muestra "no encontrada".
 *        · rechaza (throw) ⇒ fallo al leer: la vista muestra ErrorBlock.
 *
 *  Escritura: síncrona; devuelve el resultado para poder navegar justo después
 *    createConversation()          → Conversation           (nueva, sólo con el saludo)
 *    duplicateConversation(id)     → Conversation | null    (copia con id nuevo; null si no existe)
 *    deleteConversation(id)        → boolean                (false si no existía)
 *    saveMessages(id, messages)    → Conversation | null    (null si ya no existe)
 * ============================================================================
 */

const STORAGE_KEY = 'pokesearch.conversations'
const LATENCY_MS = 500
const NEW_TITLE = 'Nueva conversación'

export const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'bot',
  text: '¡Hola! Dime el nombre o número de un Pokémon.',
}

/* ===== Datos de ejemplo ===== */

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

const buildSeed = () =>
  POKEMON.map((name, i) => {
    const number = i + 1
    const pretty = capitalize(name)
    return {
      id: `c${number}`,
      title: `Consulta sobre ${pretty}`,
      // Fechas desordenadas respecto al nombre, para que ordenar por fecha y por título dé resultados distintos.
      createdAt: new Date(BASE_DATE - ((i * 37) % 60) * 5 * HOUR).toISOString(),
      messages: [
        { ...WELCOME_MESSAGE, id: `c${number}-m1` },
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

/* ===== Persistencia ===== */

const load = () => {
  const stored = readJSON(STORAGE_KEY)
  if (Array.isArray(stored)) return stored
  const seed = buildSeed()
  writeJSON(STORAGE_KEY, seed)
  return seed
}

const persist = (conversations) => writeJSON(STORAGE_KEY, conversations)

const newId = () => `c-${crypto.randomUUID().slice(0, 8)}`

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/* ===== Lectura ===== */

export const fetchConversations = async () => {
  await delay(LATENCY_MS)
  return load()
}

export const fetchConversation = async (id) => {
  await delay(LATENCY_MS)
  return load().find((c) => c.id === id) ?? null
}

/* ===== Escritura ===== */

export const createConversation = () => {
  const conversation = {
    id: newId(),
    title: NEW_TITLE,
    createdAt: new Date().toISOString(),
    messages: [WELCOME_MESSAGE],
  }
  persist([conversation, ...load()])
  return conversation
}

export const duplicateConversation = (id) => {
  const all = load()
  const original = all.find((c) => c.id === id)
  if (!original) return null

  const copy = {
    ...original,
    id: newId(),
    title: `${original.title} (copia)`,
    createdAt: new Date().toISOString(),
    messages: original.messages.map((m) => ({ ...m })),
  }
  persist([copy, ...all])
  return copy
}

export const deleteConversation = (id) => {
  const all = load()
  const remaining = all.filter((c) => c.id !== id)
  persist(remaining)
  return remaining.length !== all.length
}

export const saveMessages = (id, messages) => {
  const all = load()
  const index = all.findIndex((c) => c.id === id)
  if (index === -1) return null

  const conversation = { ...all[index], messages }
  // Una conversación nueva toma su título de la primera pregunta del usuario.
  const firstQuestion = messages.find((m) => m.sender === 'user')
  if (conversation.title === NEW_TITLE && firstQuestion) {
    conversation.title = `Consulta sobre ${capitalize(firstQuestion.text)}`
  }

  all[index] = conversation
  persist(all)
  return conversation
}

/* ===== Búsqueda y orden (?q= y ?sort=, ver url-state.md) ===== */

export const SORTS = [
  { value: 'recientes', label: 'Más recientes primero' },
  { value: 'antiguas', label: 'Más antiguas primero' },
  { value: 'titulo', label: 'Título (A-Z)' },
]
export const DEFAULT_SORT = 'recientes'

// Minúsculas y sin tildes, para que "pokedex" encuentre "Pokédex".
const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Filtra por texto (título o contenido de los mensajes) y ordena. No modifica el array original.
export const queryConversations = (conversations, { q = '', sort = DEFAULT_SORT } = {}) => {
  const term = normalize(q.trim())
  const filtered = term
    ? conversations.filter((c) =>
        normalize([c.title, ...c.messages.map((m) => m.text)].join(' ')).includes(term),
      )
    : [...conversations]

  const byDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  if (sort === 'antiguas') return filtered.sort(byDate)
  if (sort === 'titulo') return filtered.sort((a, b) => a.title.localeCompare(b.title, 'es'))
  return filtered.sort((a, b) => byDate(b, a))
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })
