import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const SUBJECT_BADGE = {
  python: 'bg-claro-indigo/20 text-claro-indigo border-claro-indigo/35',
  dsa:    'bg-[#D4B8FF]/22 text-[#EDE5FF] border-[#D4B8FF]/38',
  cn:     'bg-claro-sage/20 text-claro-sage border-claro-sage/35',
}

const STATUS_BADGE = {
  active:     'text-claro-amber',
  mastered:   'text-claro-sage',
  struggling: 'text-claro-coral',
}

const NodeTooltip = memo(({ node, position }) => {
  if (!node) return null
  const { x, y } = position

  // Position tooltip so it doesn't clip viewport edges
  const left = x + 16
  const top  = y - 10

  const subjectInfo = Object.values(SUBJECTS).find(s => s.id === node.subject)
  const badgeCls = SUBJECT_BADGE[node.subject] || 'bg-slate-700 text-slate-300'

  return (
    <div
      className="node-tooltip"
      style={{ left, top }}
    >
      {/* Subject badge */}
      <div className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded border mb-2 ${badgeCls}`}>
        {subjectInfo?.label || node.subject}
      </div>

      {/* Node label */}
      <div className="font-semibold text-white text-[13px] leading-tight mb-1">
        {node.label}
      </div>

      {/* Status indicator */}
      {node.status && node.status !== 'default' && (
        <div className={`text-[11px] font-medium capitalize ${STATUS_BADGE[node.status] || 'text-slate-400'}`}>
          ● {node.status}
        </div>
      )}

      {/* Mini stats */}
      <div className="flex gap-3 mt-2 text-[10px] text-slate-400">
        <span>connections: <span className="text-slate-300">{node.degree}</span></span>
        <span>weight: <span className="text-slate-300">{node.weight.toFixed(1)}</span></span>
      </div>

      <div className="text-[10px] text-slate-500 mt-1.5">click to expand →</div>
    </div>
  )
})

NodeTooltip.displayName = 'NodeTooltip'
export default NodeTooltip
