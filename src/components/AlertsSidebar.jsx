import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { marketingGraph, comprehensionColor } from '../data/mockGraphMarketing.js'

const DRIFT_ALERTS = [
  { id: 'positioning',          label: 'Positioning',          delta: -0.14 },
  { id: 'consumer-behavior',    label: 'Consumer Behavior',    delta: -0.11 },
  { id: 'marketing-analytics',  label: 'Marketing Analytics',  delta: -0.18 },
]
const PATTERN_ALERTS = [
  { id: 'integrated-marketing', label: 'Integrated Marketing Comms', pct: 42, misconception: 'Confusing IMC with social media only' },
  { id: 'value-proposition',    label: 'Value Proposition',          pct: 38, misconception: 'Equating value prop with product features' },
]

function Accordion({ title, badge, children, badgeColor = 'bg-gray-700' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-gray-800">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-xs font-medium text-gray-300">{title}</span>
        <div className="flex items-center gap-2">
          {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-white ${badgeColor}`}>{badge}</span>}
          <span className="text-gray-600 text-xs">{open ? '▲' : '▼'}</span>
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 bg-gray-900 border border-gray-700 rounded px-2 py-1 whitespace-nowrap text-[10px] text-white pointer-events-none">
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
    <aside className={`flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-[280px]'}`}>
      {!collapsed && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <span className="text-xs font-medium text-white">Alerts & Insights</span>
            <button onClick={onToggle} className="text-gray-500 hover:text-white text-xs">◀</button>
          </div>

          {/* Drift alerts */}
          <Accordion title="Drift Alerts" badge={DRIFT_ALERTS.length} badgeColor="bg-claro-coral">
            <div className="space-y-2">
              {DRIFT_ALERTS.map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{a.label}</span>
                  <span className="text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">{a.delta > 0 ? '+' : ''}{Math.round(a.delta * 100)}%</span>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Pattern alerts */}
          <Accordion title="Cohort Patterns" badge={PATTERN_ALERTS.length} badgeColor="bg-claro-amber">
            <div className="space-y-3">
              {PATTERN_ALERTS.map(a => (
                <div key={a.id}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-gray-300">{a.label}</span>
                    <span className="text-[10px] text-claro-amber bg-claro-amber/10 border border-claro-amber/22 rounded px-1.5 py-0.5">{a.pct}% wrong</span>
                  </div>
                  <p className="text-[10px] text-gray-500 italic">{a.misconception}</p>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Heatmap */}
          <Accordion title="Micro-Check Heatmap">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-0.5 mb-1 ml-16">
                {weeks.map(w => <div key={w} className="text-[9px] text-gray-600 w-7 text-center">W{w}</div>)}
              </div>
              {heatmapData.map(c => (
                <div key={c.id} className="flex items-center gap-0.5 mb-0.5">
                  <div className="w-16 text-[9px] text-gray-500 truncate pr-1">{c.label.split(' ')[0]}</div>
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
        <button onClick={onToggle} className="w-full h-full flex items-center justify-center text-gray-600 hover:text-white transition-colors text-xs writing-mode-vertical">
          ▶
        </button>
      )}
    </aside>
  )
}
