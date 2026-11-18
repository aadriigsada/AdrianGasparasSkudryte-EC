# Estado en la URL

La URL es la **única fuente de verdad** para todo lo que se quiera compartir o recuperar al recargar. Los componentes no copian estos valores a `useState`: los leen de la URL en cada render (`useParams` / `useSearchParams`) y los controles escriben en la URL. Así, abrir un enlace, recargar o usar Atrás/Adelante siempre muestra lo mismo.

## Parámetros de ruta

| Ruta | Parámetro | Ejemplo | Uso |
|------|-----------|---------|-----|
| `/conversaciones/:id` | `id` | `/conversaciones/c25` | Identifica la conversación que muestra `ConversationView`. Si no existe se muestra "Conversación no encontrada". |

Va en el **segmento** de la ruta, y no como `?id=`, porque identifica el recurso: sin él la vista no tiene sentido.

## Query params

| Vista | Param | Valores | Por defecto | Uso |
|-------|-------|---------|-------------|-----|
| `ConversationsView` | `q` | texto libre | *(vacío)* | Filtra por título y contenido de los mensajes. No distingue mayúsculas ni tildes. |
| `ConversationsView` | `sort` | `recientes` · `antiguas` · `titulo` | `recientes` | Orden del listado. Un valor no válido se trata como `recientes`. |
| `PokedexView` | `pagina` | entero ≥ 1 | `1` | Página del listado de la PokéAPI. |

Son **query params** porque son opcionales y sólo modifican cómo se presenta una misma vista.

### Ejemplos

- `/conversaciones?q=pika` → sólo conversaciones que contienen "pika".
- `/conversaciones?sort=titulo` → listado completo ordenado A-Z.
- `/conversaciones?q=saur&sort=antiguas` → filtrado y ordenado.
- `/pokedex?pagina=3` → tercera página de la Pokédex.

## Sincronía URL ⇄ Estado

| Acción en la UI | Efecto en la URL | Historial |
|-----------------|------------------|-----------|
| Escribir en "Buscar" | actualiza `?q=` | `replace`: no se crea una entrada por cada tecla |
| Vaciar "Buscar" | elimina `q` | `replace` |
| Cambiar "Ordenar" | actualiza `?sort=` | `push`: Atrás vuelve al orden anterior |
| "Limpiar filtros" | elimina `q` y `sort` | `push` |
| Anterior / Siguiente (Pokédex) | actualiza `?pagina=` | `push` |

Reglas:

1. Los valores por defecto **no se escriben** en la URL (`sort=recientes`, `pagina=1`, `q` vacío), para que las URLs sean lo más cortas posible.
2. Se conservan los demás parámetros al cambiar uno (`new URLSearchParams(prev)`).
3. Los valores desconocidos se ignoran y se usa el valor por defecto, sin romper la vista.
