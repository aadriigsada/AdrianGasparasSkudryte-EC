import { useSearchParams } from 'react-router-dom'
import { listPokemon } from '../../services/pokeapi'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { useAsync } from '../../hooks/useAsync'
import Loading from '../Feedback/Loading'
import ErrorBlock from '../Feedback/ErrorBlock'

const PAGE_SIZE = 24

function PokedexView() {
  useDocumentTitle('Pokédex')

  // Estado en la URL: ?pagina=N y ?fallo=1 (simular error de la API).
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get('pagina'), 10) || 1)
  const forceError = searchParams.get('fallo') === '1'

  const setParam = (name, value) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(name, value)
      else next.delete(name)
      return next
    })

  const goToPage = (n) => setParam('pagina', n > 1 ? String(n) : null)

  const { status, data, error, reload } = useAsync(
    () => listPokemon({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE, forceError }),
    `${page}|${forceError}`,
  )

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : page

  return (
    <section className="view">
      <h1 tabIndex={-1}>Pokédex</h1>

      <div className="toolbar">
        <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>
          ← Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={status !== 'success' || page >= totalPages}
        >
          Siguiente →
        </button>

        <label className="form-check">
          <input
            type="checkbox"
            checked={forceError}
            onChange={(e) => setParam('fallo', e.target.checked ? '1' : null)}
          />{' '}
          Simular error de la PokéAPI
        </label>
      </div>

      {status === 'loading' && <Loading label="Cargando Pokémon…" />}

      {status === 'error' && (
        <ErrorBlock title="No se ha podido cargar la Pokédex" error={error} onRetry={reload} />
      )}

      {status === 'success' && (
        <ul className="pokedex-grid">
          {data.items.map((p) => (
            <li key={p.id}>
              <img src={p.image} alt="" width="72" height="72" loading="lazy" />
              <span>
                #{p.id} {p.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default PokedexView
