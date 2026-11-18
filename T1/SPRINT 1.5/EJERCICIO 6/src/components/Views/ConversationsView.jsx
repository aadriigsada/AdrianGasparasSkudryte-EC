import { useState } from 'react'
import { Link, useLocation, useNavigate, useNavigationType, useSearchParams } from 'react-router-dom'
import {
  DEFAULT_SORT,
  SORTS,
  createConversation,
  fetchConversations,
  formatDate,
  queryConversations,
} from '../../services/conversations'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import { useAsync } from '../../hooks/useAsync'
import Loading from '../Feedback/Loading'
import ErrorBlock from '../Feedback/ErrorBlock'

// La URL es la única fuente de verdad: q y sort se leen de ?q= y ?sort=,
// y los controles escriben en la URL (ver services/url-state.md).
function ConversationsView() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  useDocumentTitle('Conversaciones')

  // Aviso que llega al volver de otra acción (p. ej. "Conversación … borrada").
  const notice = location.state?.notice

  const handleNew = () => {
    const created = createConversation()
    navigate(`/conversaciones/${created.id}`)
  }

  // Los datos se piden una vez al entrar en la vista; filtrar y ordenar se hace en cliente.
  const { status, data: all, error, reload } = useAsync(fetchConversations, 'conversations')

  // Listado largo (60 elementos): al volver con Atrás se recupera el punto de scroll,
  // pero sólo cuando ya está pintado (con "Cargando…" la página aún no tiene altura).
  useScrollRestoration(status === 'success')

  const q = searchParams.get('q') ?? ''

  // El texto del buscador también vive en un estado local: React Router actualiza la URL dentro de una
  // transición y, si el input dependiera sólo de la URL, al escribir rápido se perderían letras.
  const navigationType = useNavigationType()
  const [draft, setDraft] = useState(q)
  const [syncedQ, setSyncedQ] = useState(q)
  if (q !== syncedQ) {
    setSyncedQ(q)
    // Si la URL cambia por otra causa (Atrás/Adelante, un enlace, "Limpiar filtros"), el input la refleja.
    // Los cambios del propio buscador usan replace y no se reaplican.
    if (navigationType !== 'REPLACE') setDraft(q)
  }
  const sortParam = searchParams.get('sort')
  const sort = SORTS.some((s) => s.value === sortParam) ? sortParam : DEFAULT_SORT

  // Escribe un parámetro; si queda vacío o con el valor por defecto se elimina para mantener la URL limpia.
  const setParam = (name, value, defaultValue, options) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value || value === defaultValue) next.delete(name)
      else next.set(name, value)
      return next
    }, options)
  }

  const conversations = status === 'success' ? queryConversations(all, { q, sort }) : []

  return (
    <section className="view">
      <h1 tabIndex={-1}>Conversaciones</h1>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      <div className="toolbar">
        <button type="button" onClick={handleNew}>
          Nueva conversación
        </button>
      </div>

      <form className="toolbar" role="search" onSubmit={(e) => e.preventDefault()}>
        <label>
          Buscar{' '}
          <input
            type="search"
            value={draft}
            // replace: cada tecla no crea una entrada nueva en el historial
            onChange={(e) => {
              setDraft(e.target.value)
              setParam('q', e.target.value, '', { replace: true })
            }}
            placeholder="Ej: pikachu"
          />
        </label>

        <label>
          Ordenar{' '}
          <select value={sort} onChange={(e) => setParam('sort', e.target.value, DEFAULT_SORT)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <button type="button" onClick={() => setSearchParams({})} disabled={!q && sort === DEFAULT_SORT}>
          Limpiar filtros
        </button>
      </form>

      {status === 'loading' && <Loading label="Cargando conversaciones…" />}

      {status === 'error' && (
        <ErrorBlock title="No se han podido cargar las conversaciones" error={error} onRetry={reload} />
      )}

      {status === 'success' && (
        <>
          <p role="status">
            Mostrando {conversations.length} de {all.length} conversaciones.
          </p>

          {conversations.length === 0 ? (
            <p>Ninguna conversación coincide con «{q}».</p>
          ) : (
            <ul className="conversation-list">
              {conversations.map((c) => (
                <li key={c.id}>
                  {/* state.fromList: el detalle sabe que puede volver con navigate(-1) y recuperar scroll y filtros */}
                  <Link to={`/conversaciones/${c.id}`} state={{ fromList: true }}>
                    {c.title}
                  </Link>
                  <small>{formatDate(c.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default ConversationsView
