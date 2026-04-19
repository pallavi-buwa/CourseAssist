import { useState, useEffect } from 'react'

export default function MicroCheck({ check, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  const isCorrect = selected === check.correct

  useEffect(() => {
    if (selected !== null && isCorrect) {
      const t = setTimeout(() => setDismissed(true), 1500)
      return () => clearTimeout(t)
    }
  }, [selected, isCorrect])

  if (dismissed) return null

  const handleSelect = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    onAnswer?.({ conceptId: check.conceptId, correct: idx === check.correct })
  }

  return (
    <div className="my-6 rounded-xl border border-gray-700 bg-gray-900 p-4 fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs bg-claro-indigo/20 text-claro-indigo border border-claro-indigo/30 rounded px-2 py-0.5 font-medium">Quick Check</span>
      </div>
      <p className="text-sm font-medium text-white mb-3">{check.question}</p>
      <div className="space-y-2">
        {check.options.map((opt, i) => {
          let cls = 'w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all '
          if (selected === null) {
            cls += 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 cursor-pointer'
          } else if (i === check.correct) {
            cls += 'border-green-500/50 bg-green-500/10 text-green-400'
          } else if (i === selected && !isCorrect) {
            cls += 'border-red-500/50 bg-red-500/10 text-red-400'
          } else {
            cls += 'border-gray-800 text-gray-500'
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && isCorrect && (
        <div className="mt-3 text-green-400 text-sm">
          Great work.
        </div>
      )}
      {selected !== null && !isCorrect && (
        <div className="mt-3 bg-claro-amber/10 border border-claro-amber/30 rounded-lg p-3">
          <p className="text-claro-amber text-sm font-medium mb-1">Consider re-reading this section. <button type="button" className="underline hover:text-claro-amber" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Scroll to top</button></p>
          {check.misconception && <p className="text-claro-amber/80 text-xs">{check.misconception}</p>}
          <button className="mt-2 text-xs text-gray-500 hover:text-gray-400 underline" onClick={() => setDismissed(true)}>Dismiss</button>
        </div>
      )}
    </div>
  )
}
