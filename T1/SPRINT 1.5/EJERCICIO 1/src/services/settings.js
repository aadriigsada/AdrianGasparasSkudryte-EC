// Preferencias del asistente, guardadas en localStorage.

const KEY = 'pokesearch.settings'

export const MODELS = [
  { value: 'pokesearch-basico', label: 'PokéSearch Básico (rápido)' },
  { value: 'pokesearch-pro', label: 'PokéSearch Pro (respuestas detalladas)' },
]

export const TONES = [
  { value: 'amigable', label: 'Amigable' },
  { value: 'formal', label: 'Formal' },
  { value: 'breve', label: 'Breve' },
]

const DEFAULTS = { model: MODELS[0].value, tone: TONES[0].value, showSprites: true }

export const getSettings = () => {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }
  } catch {
    return DEFAULTS
  }
}

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // Sin almacenamiento disponible: los ajustes sólo duran esta sesión.
  }
}
