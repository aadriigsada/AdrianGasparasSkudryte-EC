import { readJSON, writeJSON } from './storage'

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

export const getSettings = () => ({ ...DEFAULTS, ...readJSON(KEY, {}) })

export const saveSettings = (settings) => writeJSON(KEY, settings)
