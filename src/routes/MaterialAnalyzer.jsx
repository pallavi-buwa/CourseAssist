import { useState } from 'react'
import { RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import FlagCard from '../components/FlagCard.jsx'
import { analyzeForInclusivity } from '../api/openai.js'

const PLACEHOLDER = `Example: Week 1: Introduction to Marketing Strategy

Marketing strategy is built on STP: Segmentation, Targeting, Positioning. Students are expected to have prior knowledge of Western consumer behavior models and standard business frameworks used in Fortune 500 companies. Case studies will draw heavily from American market contexts.

Prerequisites: familiarity with Nielsen data analysis and basic econometric models.`

const CATEGORY_ORDER = ['Jargon', 'Cultural assumption', 'Readability', 'Implicit knowledge', 'Biased framing']

export default function MaterialAnalyzer() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [flags, setFlags] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setFlags(null)
    try {
      const result = await analyzeForInclusivity(text)
      const normalized = Array.isArray(result) ? result.map((f) => ({
        phrase: String(f?.phrase || ''),
        category: String(f?.category || 'Readability'),
        affected: String(f?.affected || 'Learners with mixed prior context'),
        suggestion: String(f?.suggestion || ''),
        severity: String(f?.severity || 'medium').toLowerCase(),
        countryContext: String(f?.countryContext || ''),
        example: String(f?.example || ''),
        referenceLinks: Array.isArray(f?.referenceLinks) ? f.referenceLinks.filter(Boolean).slice(0, 3) : [],
      })) : []
      setFlags(normalized)
    } catch (e) {
      setError(e.message.includes('API_KEY')
        ? 'Add VITE_OPENAI_API_KEY to .env to use AI analysis.'
        : e.message)
    } finally {
      setLoading(false)
    }
  }

  // Group flags by category
  const grouped = flags ? CATEGORY_ORDER.reduce((acc, cat) => {
    const catFlags = flags.filter(f => f.category === cat)
    if (catFlags.length) acc[cat] = catFlags
    return acc
  }, {}) : {}

  return (
    <RequireAuth role="professor">
      <div className="min-h-screen bg-space-page">
        <Navbar />
        <main className="pt-16 max-w-5xl mx-auto px-5 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-white mb-1">Material Inclusivity Analyzer</h1>
            <p className="text-gray-500 text-sm">Paste course material for quick clarity and accessibility feedback.</p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {/* Input panel */}
            <div className="col-span-2 flex flex-col gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-medium text-gray-400">Paste course material</label>
                  <button
                    type="button"
                    onClick={() => setText(PLACEHOLDER)}
                    className="text-[11px] text-claro-indigo hover:text-white border border-claro-indigo/30 hover:border-claro-indigo/60 rounded px-2 py-1 transition-colors"
                    title="Load sample text to see how analyzer works"
                  >
                    Use sample
                  </button>
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  className="flex-1 min-h-64 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-claro-indigo transition-colors leading-relaxed"
                  placeholder={PLACEHOLDER}
                />

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="w-full bg-claro-indigo hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing…
                    </>
                  ) : 'Analyze for inclusivity'}
                </button>

                {text.trim() && (
                  <p className="text-xs text-gray-600 text-center">{text.trim().split(/\s+/).length} words</p>
                )}
              </div>

              {/* Tips */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-xs font-medium text-gray-400 mb-3">Checks</h3>
                <ul className="space-y-2">
                  {[
                    'Jargon and acronyms',
                    'Cultural assumptions',
                    'Readability and accessibility',
                    'Implicit prerequisites',
                    'Biased framing',
                  ].map(label => (
                    <li key={label} className="flex items-start gap-2 text-xs text-gray-500">
                      <span className="text-claro-muted">•</span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Results panel */}
            <div className="col-span-3">
              {!flags && !loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">Results will appear here after analysis</p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-gray-900 border border-gray-800 rounded-2xl skeleton" />
                  ))}
                </div>
              )}

              {flags && (
                <div className="space-y-5">
                  {/* Flags by category */}
                  {Object.entries(grouped).map(([category, catFlags]) => (
                    <div key={category}>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        {category}
                        <span className="text-gray-700 normal-case">({catFlags.length})</span>
                      </h3>
                      <div className="space-y-3">
                        {catFlags.map((flag, i) => (
                          <FlagCard
                            key={i}
                            {...flag}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
