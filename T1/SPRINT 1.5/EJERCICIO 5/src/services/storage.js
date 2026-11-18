import { useSyncExternalStore } from 'react'

// Persistencia simple en localStorage, protegida con try/catch
// (en modo privado o con el almacenamiento bloqueado puede lanzar excepciones).

export const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Almacenamiento no disponible: el dato sólo vive en memoria.
  }
}

/* ===== Sesión local simulada ===== */

const SESSION_KEY = 'pokesearch.session'
const SESSION_EVENT = 'pokesearch:session-change'

// Devuelve el nombre de usuario guardado o null si no hay sesión.
export const getSession = () => {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

const notify = () => window.dispatchEvent(new Event(SESSION_EVENT))

export const startSession = (username) => {
  try {
    localStorage.setItem(SESSION_KEY, username)
  } catch {
    // Sin almacenamiento la sesión no se puede guardar.
  }
  notify()
}

export const endSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nada que borrar.
  }
  notify()
}

// Se avisa tanto de cambios en esta pestaña (evento propio)
// como en otras pestañas (evento "storage" del navegador).
const subscribe = (callback) => {
  window.addEventListener(SESSION_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(SESSION_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

// Hook: re-renderiza el componente cuando la sesión cambia.
export const useSession = () => useSyncExternalStore(subscribe, getSession)
