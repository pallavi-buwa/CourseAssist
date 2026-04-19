import { useState } from 'react'
import { generateMicroChecks } from '../api/claude.js'

export default function MicroCheckGenerator({ onClose }) {
  const [text, setText]           = useState('')
  const [loading, setLoading]     = useState(false)
  const [questions, setQuestions] = useState(null)
  const [error, setError]         = useState(null)
  const [published, setPublished] = useState(false)

  const handleGenerate = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setQuestions(null)
    try {
      const qs = await generateMicroChecks(text)
      setQuestions(qs)
    } catch (e) {
      setError(e.message.includes('API_KEY') ? 'Add VITE_ANTHROPIC_API_KEY to .env to use AI generation.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = () => {
    setPublished(true)
    setTimeout(onClose, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-medium">Generate Micro-Checks</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500"
            placeholder="Paste course content here…"
          />

          {loading && (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-800 rounded-xl skeleton" />)}
            </div>
          )}

          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}

          {published && (
            <div className="text-center text-green-400 font-medium py-4">✓ 3 questions published to Module 4</div>
          )}

          {questions && !published && (
            <div className="space-y-3">
              {questions.map((q, i) => (
                <div key={i} className="rounded-xl border border-gray-800 bg-gray-800/50 p-4">
                  <p className="text-sm font-medium text-white mb-3">{q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, j) => (
                      <div key={j} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${j === q.correct ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-gray-700/50 text-gray-400'}`}>
                        {j === q.correct && <span>✓</span>}
                        {opt}
                        {j !== q.correct && q.misconceptions?.[j] && (
                          <span className="ml-auto text-amber-500/70 italic">{q.misconceptions[j]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800 flex gap-3">
          <button onClick={handleGenerate} disabled={loading || !text.trim()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            {loading ? 'Generating…' : 'Generate questions'}
          </button>
          {questions && !published && (
            <button onClick={handlePublish} className="flex-1 border border-green-500/50 text-green-400 hover:bg-green-500/10 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
              Approve & publish
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
