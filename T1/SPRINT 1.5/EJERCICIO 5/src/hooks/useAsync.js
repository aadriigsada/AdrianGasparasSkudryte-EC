import { useCallback, useEffect, useState } from 'react'

/**
 * Carga datos asíncronos con estados homogéneos para todas las vistas.
 *
 * @param {() => Promise<any>} loader  función que hace la petición
 * @param {string} key                 identifica la petición: si cambia, se vuelve a cargar
 * @returns {{ status: 'loading'|'error'|'success', data: any, error: Error|null, reload: () => void }}
 */
export function useAsync(loader, key) {
  const [attempt, setAttempt] = useState(0)
  const requestKey = `${key}#${attempt}`

  // Guardamos a qué petición pertenece el resultado: si no coincide con la actual, está cargando.
  const [result, setResult] = useState({ requestKey: null, data: undefined, error: null })

  useEffect(() => {
    let active = true
    Promise.resolve()
      .then(loader)
      .then(
        (data) => active && setResult({ requestKey, data, error: null }),
        (error) => active && setResult({ requestKey, data: undefined, error }),
      )
    // Si la vista cambia de petición o se desmonta antes de terminar, el resultado viejo se descarta.
    return () => {
      active = false
    }
    // loader se recrea en cada render; la petición sólo depende de key (y de los reintentos).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])

  let status = 'success'
  if (result.requestKey !== requestKey) status = 'loading'
  else if (result.error) status = 'error'

  return { status, data: result.data, error: result.error, reload }
}
