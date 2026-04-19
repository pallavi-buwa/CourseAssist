import { useState } from 'react'
import { generateKnowledgeGraph } from '../api/claude.js'

export default function GraphGenerator({ onClose, onGenerated }) {
  const [text, setText]       = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState(null)

  const handleBuild = async () => {
    if (!text.trim()) return
    setLoading(true); setError(null); setResult(null)
    try {
      const graph = await generateKnowledgeGraph(text)
      // Stagger node reveal
      for (let i = 0; i < graph.nodes.length; i++) {
        await new Promise(r => setTimeout(r, 100))
        setResult(prev => ({
          nodes: [...(prev?.nodes || []), graph.nodes[i]],
          links: i === graph.nodes.length - 1 ? graph.links : (prev?.links || []),
        }))
      }
      onGenerated?.(graph)
    } catch (e) {
      setError(e.message.includes('API_KEY') ? 'Add VITE_ANTHROPIC_API_KEY to .env to use AI generation.' : e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-medium">Build Knowledge Graph from Syllabus</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-36 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-claro-indigo"
            placeholder="Paste syllabus or topic list here…"
          />

          {loading && (
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-claro-indigo border-t-transparent rounded-full animate-spin" />
              Analyzing course structure…
            </div>
          )}

          {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}

          {result && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <p className="text-sm text-green-400 font-medium mb-2">
                ✓ Added {result.nodes?.length || 0} concepts and {result.links?.length || 0} relationships to your graph
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {result.nodes?.map((n, i) => (
                  <span key={i} className="text-xs bg-claro-indigo/20 text-claro-indigo border border-claro-indigo/30 rounded px-2 py-0.5 fade-in">{n.label}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-800">
          <button onClick={handleBuild} disabled={loading || !text.trim()}
            className="w-full bg-claro-indigo hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
            {loading ? 'Building…' : 'Build graph'}
          </button>
        </div>
      </div>
    </div>
  )
}
