import { useState } from 'react'
import { marketingGraph, comprehensionColor } from '../data/mockGraphMarketing.js'

const PATTERN_ALERTS = [
  { id: 'integrated-marketing', label: 'Integrated Marketing Comms', pct: 42, misconception: 'Confusing IMC with social media only' },
  { id: 'value-proposition',    label: 'Value Proposition',          pct: 38, misconception: 'Equating value prop with product features' },
]

function Accordion({ title, badge, children, badgeColor = 'bg-claro-indigo' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-claro-indigo/12">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-claro-slate/80 transition-colors"
      >
        <span className="text-xs font-medium text-claro-text">{title}</span>
        <div className="flex items-center gap-2">
          {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-white ${badgeColor}`}>{badge}</span>}
          <span className="text-claro-muted text-[10px]">{open ? 'Hide' : 'Show'}</span>
        </div>
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  )
}

function HeatmapCell({ week, concept, score, label }) {
  const [tooltip, setTooltip] = useState(false)
  return (
    <div
      className="relative"
      style={{ width: 28, height: 28 }}
      onMouseEnter={() => setTooltip(true)}
      onMouseLeave={() => setTooltip(false)}
    >
      <div className="w-full h-full rounded-sm cursor-pointer" style={{ background: comprehensionColor(score), opacity: 0.75 }} />
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 bg-claro-text border border-claro-indigo/35 rounded px-2 py-1 whitespace-nowrap text-[10px] text-claro-canvas pointer-events-none shadow-md">
          Week {week} · {label} · {Math.round(score * 100)}%
        </div>
      )}
    </div>
  )
}

export default function AlertsSidebar({ collapsed, onToggle }) {
  // Build heatmap data: 7 weeks × top 8 concepts
  const concepts = marketingGraph.nodes.slice(0, 8)
  const weeks = [1,2,3,4,5,6,7]
  const heatmapData = concepts.map(c => ({
    ...c,
    scores: weeks.map(w => ({
      week: w,
      score: Math.max(0.15, c.comprehension - (7 - w) * 0.04 + (Math.random() * 0.1 - 0.05)),
    }))
  }))

  return (
    <aside className={`flex-shrink-0 bg-claro-panel border-r border-claro-indigo/15 flex flex-col transition-all duration-300 shadow-sm ${collapsed ? 'w-0 overflow-hidden' : 'w-[280px]'}`}>
      {!collapsed && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-claro-indigo/12">
            <span className="text-xs font-medium text-claro-text">Alerts & Insights</span>
            <button onClick={onToggle} className="text-claro-muted hover:text-claro-text text-xs" type="button" aria-label="Collapse sidebar">Back</button>
          </div>


          {/* Pattern alerts */}
          <Accordion title="Cohort Patterns" badge={PATTERN_ALERTS.length} badgeColor="bg-claro-amber">
            <div className="space-y-3">
              {PATTERN_ALERTS.map(a => (
                <div key={a.id}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-claro-muted">{a.label}</span>
                    <span className="text-[10px] text-claro-amber bg-claro-amber/12 border border-claro-amber/25 rounded px-1.5 py-0.5">{a.pct}% wrong</span>
                  </div>
                  <p className="text-[10px] text-claro-muted italic">{a.misconception}</p>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Heatmap */}
          <Accordion title="Micro-Check Heatmap">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-0.5 mb-1 ml-16">
                {weeks.map(w => <div key={w} className="text-[9px] text-claro-muted w-7 text-center">W{w}</div>)}
              </div>
              {heatmapData.map(c => (
                <div key={c.id} className="flex items-center gap-0.5 mb-0.5">
                  <div className="w-16 text-[9px] text-claro-muted truncate pr-1">{c.label.split(' ')[0]}</div>
                  {c.scores.map(({ week, score }) => (
                    <HeatmapCell key={week} week={week} concept={c.id} score={score} label={c.label} />
                  ))}
                </div>
              ))}
            </div>
          </Accordion>
        </>
      )}

      {collapsed && (
        <button type="button" onClick={onToggle} className="w-full h-full flex items-center justify-center text-claro-muted hover:text-claro-text transition-colors text-[10px] px-1 text-center writing-mode-vertical bg-claro-canvas/50" aria-label="Expand sidebar">
          Expand
        </button>
      )}
    </aside>
  )
}
