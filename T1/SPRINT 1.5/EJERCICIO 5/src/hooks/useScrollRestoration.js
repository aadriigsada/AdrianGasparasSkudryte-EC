import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Restauración de scroll por entrada del historial.
// React Router da a cada entrada un location.key único que se conserva al usar Atrás/Adelante.
// Guardamos la posición de scroll de cada key en sessionStorage y la recuperamos al volver.

const STORAGE_KEY = 'pokesearch.scroll'

const readPositions = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

const savePosition = (key, y) => {
  const positions = readPositions()
  positions[key] = y
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
  } catch {
    // Sin sessionStorage simplemente no se restaura.
  }
}

/**
 * @param {boolean} ready  true cuando el contenido ya está pintado
 *                         (si se restaurase antes, la página aún no tendría altura suficiente).
 */
export function useScrollRestoration(ready = true) {
  const { key } = useLocation()

  // 1) Guardar la posición mientras el usuario hace scroll (como mucho una vez por frame).
  //    Sólo cuando el contenido está listo: mientras carga, el "scroll arriba" de AppLayout
  //    dispararía un evento scroll que sobrescribiría con 0 la posición que queremos restaurar.
  useEffect(() => {
    if (!ready) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => savePosition(key, window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [key, ready])

  // 2) Restaurar al entrar en esta entrada del historial (si es nueva, no hay posición: arriba del todo).
  //    Es un useEffect (no useLayoutEffect) para ejecutarse después del "scroll arriba" global de AppLayout.
  useEffect(() => {
    if (!ready) return
    window.scrollTo(0, readPositions()[key] ?? 0)
  }, [key, ready])
}
