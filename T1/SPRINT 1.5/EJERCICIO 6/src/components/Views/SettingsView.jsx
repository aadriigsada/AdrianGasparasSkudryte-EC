import { useState } from 'react'
import { MODELS, TONES, getSettings, saveSettings } from '../../services/settings'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

function SettingsView() {
  useDocumentTitle('Ajustes')
  const [settings, setSettings] = useState(getSettings)
  const [saved, setSaved] = useState(false)

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    saveSettings(settings)
    setSaved(true)
  }

  return (
    <section className="view">
      <h1 tabIndex={-1}>Ajustes</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Modelo del asistente
          <select value={settings.model} onChange={(e) => update('model', e.target.value)}>
            {MODELS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tono de las respuestas
          <select value={settings.tone} onChange={(e) => update('tone', e.target.value)}>
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-check">
          <input
            type="checkbox"
            checked={settings.showSprites}
            onChange={(e) => update('showSprites', e.target.checked)}
          />
          Mostrar sprites en las respuestas
        </label>

        <button type="submit">Guardar ajustes</button>
        {saved && <p role="status">Ajustes guardados.</p>}
      </form>
    </section>
  )
}

export default SettingsView
