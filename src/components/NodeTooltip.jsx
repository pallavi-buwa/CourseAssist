import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const SUBJECT_BADGE = {
  python: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  dsa:    'bg-purple-500/20 text-purple-300 border-purple-500/30',
  cn:     'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
}

const STATUS_BADGE = {
  active:     'text-yellow-300',
  mastered:   'text-green-400',
  struggling: 'text-red-400',
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
