import { useEffect } from 'react'

// Pone el título de la pestaña. ScreenAnnouncer lo lee para anunciar el cambio de vista.
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = `${title} · PokéSearch AI`
  }, [title])
}
