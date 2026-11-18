import { useEffect, useState } from 'react'
import { listPokemon } from '../../services/pokeapi'

const PAGE_SIZE = 24

function PokedexView() {
  const [page, setPage] = useState(1)
  // Guardamos a qué página pertenece el resultado: si no coincide con la actual, está cargando.
  const [result, setResult] = useState({ page: null, data: null, error: null })

  useEffect(() => {
    let active = true
    listPokemon({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE })
      .then((data) => active && setResult({ page, data, error: null }))
      .catch((error) => active && setResult({ page, data: null, error }))
    return () => {
      active = false
    }
  }, [page])

  const loading = result.page !== page
  const totalPages = result.data ? Math.ceil(result.data.total / PAGE_SIZE) : 1

  return (
    <section className="view">
      <h1>Pokédex</h1>

      <div className="toolbar">
        <button type="button" onClick={() => setPage(page - 1)} disabled={page <= 1}>
          ← Anterior
        </button>
        <span>
          Página {page} de {totalPages}
        </span>
        <button type="button" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Siguiente →
        </button>
      </div>

      {loading && <p>Cargando…</p>}
      {!loading && result.error && <p>Error: {result.error.message}</p>}
      {!loading && result.data && (
        <ul className="pokedex-grid">
          {result.data.items.map((p) => (
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
