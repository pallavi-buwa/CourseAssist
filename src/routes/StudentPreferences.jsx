import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const LANGUAGE_OPTIONS = [
  'Spanish',
  'Hindi',
  'Mandarin',
  'Arabic',
  'French',
  'Portuguese',
  'Vietnamese',
  'Korean',
]

const FORMAT_OPTIONS = [
  {
    id: 'video',
    title: 'Video',
    description: 'Walkthroughs, lectures, and visual explainers.',
  },
  {
    id: 'text',
    title: 'Text guides',
    description: 'Articles, notes, and step-by-step reading.',
  },
  {
    id: 'podcast',
    title: 'Audio',
    description: 'Podcast-style discussions and listenable lessons.',
  },
  {
    id: 'interactive',
    title: 'Interactive',
    description: 'Practice, simulations, and guided exercises.',
  },
]

function uniqueCleanList(values) {
  return Array.from(
    new Set(
      values
        .map(value => value.trim())
        .filter(Boolean)
        .filter(value => value.toLowerCase() !== 'english')
    )
  )
}

function normalizePreferences(preferences) {
  return {
    languages: Array.isArray(preferences?.languages) ? preferences.languages : [],
    formats: Array.isArray(preferences?.formats) && preferences.formats.length ? preferences.formats : ['video'],
  }
}

export default function StudentPreferences() {
  const { user, savePreferences } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const savedPreferences = normalizePreferences(user?.preferences)
  const initialCustomLanguages = useMemo(
    () => savedPreferences.languages.filter(language => !LANGUAGE_OPTIONS.includes(language)).join(', '),
    [savedPreferences.languages]
  )

  const [languages, setLanguages] = useState(
    savedPreferences.languages.filter(language => LANGUAGE_OPTIONS.includes(language))
  )
  const [customLanguages, setCustomLanguages] = useState(initialCustomLanguages)
  const [formats, setFormats] = useState(savedPreferences.formats?.length ? savedPreferences.formats : ['video'])
  const [error, setError] = useState('')

  const isFirstRun = !user?.preferencesComplete

  const toggleLanguage = (language) => {
    setLanguages(current =>
      current.includes(language)
        ? current.filter(item => item !== language)
        : [...current, language]
    )
  }

  const toggleFormat = (format) => {
    setFormats(current =>
      current.includes(format)
        ? current.filter(item => item !== format)
        : [...current, format]
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formats.length) {
      setError('Choose at least one learning format.')
      return
    }

    const custom = customLanguages.split(',')
    savePreferences({
      languages: uniqueCleanList([...languages, ...custom]),
      formats,
    })

    const destination = location.state?.from && location.state.from !== '/student/preferences'
      ? location.state.from
      : '/student/home'

    navigate(destination, { replace: true })
  }

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-space-page">
        <Navbar />
        <main className="pt-16">
          <section className="border-b border-claro-indigo/15 bg-claro-panel">
            <div className="max-w-5xl mx-auto px-5 py-10">
              <p className="text-xs font-medium uppercase tracking-widest text-claro-muted mb-3">
                {isFirstRun ? 'First-time setup' : 'Preferences'}
              </p>
              <h1 className="text-3xl font-semibold text-claro-text mb-3">
                Shape Claro around how you learn.
              </h1>
              <p className="text-sm text-claro-muted max-w-2xl leading-6">
                Choose the languages and formats you prefer. Claro will prioritize these when suggesting content.
              </p>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-5 py-8">
            <div className="grid lg:grid-cols-[1fr_320px] gap-6">
              <div className="space-y-8">
                <section>
                  <div className="flex items-end justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-lg font-medium text-claro-text">Preferred languages</h2>
                      <p className="text-sm text-claro-muted mt-1">
                        English is always included. Add others to see resources in those languages.
                      </p>
                    </div>
                    {languages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setLanguages([])}
                        className="text-xs text-claro-muted hover:text-claro-text transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {LANGUAGE_OPTIONS.map(language => {
                      const selected = languages.includes(language)
                      return (
                        <button
                          key={language}
                          type="button"
                          onClick={() => toggleLanguage(language)}
                          className={`min-h-20 rounded-lg border px-4 py-3 text-left transition-all ${
                            selected
                              ? 'border-claro-indigo bg-claro-indigo/15 text-claro-text'
                              : 'border-claro-slate/60 bg-claro-panel text-claro-muted hover:border-claro-indigo/40 hover:text-claro-text'
                          }`}
                        >
                          <span className="block text-sm font-medium">{language}</span>
                          <span className="block text-xs text-claro-muted mt-1">
                            {selected ? 'Selected' : 'Tap to add'}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <label className="block mt-4">
                    <span className="text-xs text-claro-muted mb-1.5 block">Other languages</span>
                    <input
                      value={customLanguages}
                      onChange={event => setCustomLanguages(event.target.value)}
                      placeholder="German, Japanese, Yoruba"
                      className="w-full bg-claro-panel border border-claro-slate/60 rounded-lg px-4 py-3 text-sm text-claro-text placeholder-claro-muted/50 focus:outline-none focus:border-claro-indigo transition-colors"
                    />
                  </label>
                </section>

                <section>
                  <h2 className="text-lg font-medium text-claro-text mb-1">Learning format</h2>
                  <p className="text-sm text-claro-muted mb-4">
                    Pick every format you want Claro to prioritize.
                  </p>

                  <div className="grid md:grid-cols-2 gap-3">
                    {FORMAT_OPTIONS.map(format => {
                      const selected = formats.includes(format.id)
                      return (
                        <button
                          key={format.id}
                          type="button"
                          onClick={() => toggleFormat(format.id)}
                          className={`rounded-lg border p-4 text-left transition-all ${
                            selected
                              ? 'border-claro-indigo bg-claro-indigo/15 text-claro-text'
                              : 'border-claro-slate/60 bg-claro-panel text-claro-muted hover:border-claro-indigo/40 hover:text-claro-text'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium">{format.title}</span>
                            <span className={`h-3 w-3 rounded-full border ${selected ? 'bg-claro-indigo border-claro-indigo' : 'border-claro-slate'}`} />
                          </div>
                          <p className="text-xs text-claro-muted leading-5 mt-2">{format.description}</p>
                        </button>
                      )
                    })}
                  </div>
                </section>
              </div>

              <aside className="lg:sticky lg:top-20 h-fit rounded-lg border border-claro-indigo/15 bg-claro-panel p-5">
                <h2 className="text-sm font-medium text-claro-text mb-4">Your learning mix</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-claro-muted mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueCleanList([...languages, ...customLanguages.split(',')]).length ? (
                        uniqueCleanList([...languages, ...customLanguages.split(',')]).map(language => (
                          <span key={language} className="rounded bg-claro-indigo/15 border border-claro-indigo/25 px-2 py-1 text-xs text-claro-text">
                            {language}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-claro-muted">English only</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-claro-muted mb-2">Formats</p>
                    <div className="flex flex-wrap gap-2">
                      {formats.map(format => (
                        <span key={format} className="rounded bg-claro-teal/15 border border-claro-teal/25 px-2 py-1 text-xs text-claro-text">
                          {FORMAT_OPTIONS.find(option => option.id === format)?.title || format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {error && <p className="text-xs text-claro-coral mt-5">{error}</p>}

                <button
                  type="submit"
                  className="w-full mt-6 bg-claro-indigo hover:brightness-110 text-white rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                >
                  {isFirstRun ? 'Start learning' : 'Save preferences'}
                </button>
              </aside>
            </div>
          </form>
        </main>
      </div>
    </RequireAuth>
  )
}
