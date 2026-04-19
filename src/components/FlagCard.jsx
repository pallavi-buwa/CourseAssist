import { useState } from 'react'

const CATEGORY_COLORS = {
  'Jargon':             'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Cultural assumption':'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Readability':        'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Implicit knowledge': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Biased framing':     'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function FlagCard({ phrase, category, affected, suggestion }) {
  const [copied, setCopied] = useState(false)
  const catCls = CATEGORY_COLORS[category] || 'bg-gray-700 text-gray-300 border-gray-600'

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 fade-in" style={{ minHeight: 120 }}>
      {/* Top: flagged phrase + category badge */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="bg-claro-amber/15 text-claro-amber border border-claro-amber/30 rounded px-2 py-0.5 text-xs font-medium">
          "{phrase}"
        </span>
        <span className={`border rounded px-2 py-0.5 text-[10px] font-medium flex-shrink-0 ${catCls}`}>
          {category}
        </span>
      </div>

      {/* Middle: who is affected */}
      <p className="text-xs text-gray-400 mb-2">Affects: <span className="text-gray-300">{affected}</span></p>

      {/* Bottom: suggestion */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-green-400 flex-1">→ {suggestion}</p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors text-xs border border-gray-700 rounded px-2 py-1"
        >
          {copied ? 'Copied!' : '⎘ Copy'}
        </button>
      </div>
    </div>
  )
}
