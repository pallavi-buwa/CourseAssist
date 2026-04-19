import { useState } from 'react'
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

function Accordion({ title, badge, children, badgeColor = 'bg-[#2D6A4F]' }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="border-b border-[#2D6A4F]/12">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#E8F0EB]/80 transition-colors"
      >
        <span className="text-xs font-medium text-[#1B4332]">{title}</span>
        <div className="flex items-center gap-2">
          {badge && <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-white ${badgeColor}`}>{badge}</span>}
          <span className="text-[#5C6B63] text-xs">{open ? '▲' : '▼'}</span>
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
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 bg-[#1B4332] border border-[#2D6A4F]/35 rounded px-2 py-1 whitespace-nowrap text-[10px] text-[#FFFCF7] pointer-events-none shadow-md">
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
    <aside className={`flex-shrink-0 bg-[#FFFCF7] border-r border-[#2D6A4F]/15 flex flex-col transition-all duration-300 shadow-sm ${collapsed ? 'w-0 overflow-hidden' : 'w-[280px]'}`}>
      {!collapsed && (
        <>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#2D6A4F]/12">
            <span className="text-xs font-medium text-[#1B4332]">Alerts & Insights</span>
            <button onClick={onToggle} className="text-[#5C6B63] hover:text-[#1B4332] text-xs">◀</button>
          </div>

          {/* Drift alerts */}
          <Accordion title="Drift Alerts" badge={DRIFT_ALERTS.length} badgeColor="bg-[#78350f]">
            <div className="space-y-2">
              {DRIFT_ALERTS.map(a => (
                <div key={a.id} className="flex items-center justify-between">
                  <span className="text-xs text-[#3d5248]">{a.label}</span>
                  <span className="text-xs font-medium text-[#78350f] bg-[#78350f]/10 border border-[#78350f]/22 rounded px-1.5 py-0.5">{a.delta > 0 ? '+' : ''}{Math.round(a.delta * 100)}%</span>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Pattern alerts */}
          <Accordion title="Cohort Patterns" badge={PATTERN_ALERTS.length} badgeColor="bg-[#a16207]">
            <div className="space-y-3">
              {PATTERN_ALERTS.map(a => (
                <div key={a.id}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-[#3d5248]">{a.label}</span>
                    <span className="text-[10px] text-[#92400e] bg-[#a16207]/12 border border-[#a16207]/25 rounded px-1.5 py-0.5">{a.pct}% wrong</span>
                  </div>
                  <p className="text-[10px] text-[#5C6B63] italic">{a.misconception}</p>
                </div>
              ))}
            </div>
          </Accordion>

          {/* Heatmap */}
          <Accordion title="Micro-Check Heatmap">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-0.5 mb-1 ml-16">
                {weeks.map(w => <div key={w} className="text-[9px] text-[#5C6B63] w-7 text-center">W{w}</div>)}
              </div>
              {heatmapData.map(c => (
                <div key={c.id} className="flex items-center gap-0.5 mb-0.5">
                  <div className="w-16 text-[9px] text-[#5C6B63] truncate pr-1">{c.label.split(' ')[0]}</div>
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
        <button onClick={onToggle} className="w-full h-full flex items-center justify-center text-[#5C6B63] hover:text-[#1B4332] transition-colors text-xs writing-mode-vertical bg-[#FDF6ED]/50">
          ▶
        </button>
      )}
    </aside>
  )
}
