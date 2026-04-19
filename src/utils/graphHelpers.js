import { SUBJECTS } from '../data/graphData.js'

// Status → color mapping
export const STATUS_COLORS = {
  default:    null,   // falls back to subject color
  active:     '#facc15',   // yellow - currently focused
  mastered:   '#4ade80',   // green
  struggling: '#f87171',   // red
  highlight:  '#ffffff',   // hover highlight
}

export function resolveNodeColor(node) {
  if (node.status && node.status !== 'default') return STATUS_COLORS[node.status]
  return node.color || '#94a3b8'
}

export function resolveNodeOpacity(node, hoveredId, selectedId) {
  if (!hoveredId) return 1
  if (node.id === hoveredId) return 1
  if (node.id === selectedId) return 1
  return 0.25
}

export function getLinkColor(link, hoveredId, neighborIds) {
  if (!hoveredId) return 'rgba(148,163,184,0.15)'
  const srcId = typeof link.source === 'object' ? link.source.id : link.source
  const tgtId = typeof link.target === 'object' ? link.target.id : link.target
  if (srcId === hoveredId || tgtId === hoveredId) return 'rgba(255,255,255,0.7)'
  return 'rgba(148,163,184,0.05)'
}

export function getNeighborIds(nodeId, links) {
  const neighbors = new Set()
  links.forEach(link => {
    const src = typeof link.source === 'object' ? link.source.id : link.source
    const tgt = typeof link.target === 'object' ? link.target.id : link.target
    if (src === nodeId) neighbors.add(tgt)
    if (tgt === nodeId) neighbors.add(src)
  })
  return neighbors
}

export function getSubjectLabel(subjectId) {
  return SUBJECTS[subjectId?.toUpperCase()]?.label || subjectId
}

export const SUBJECT_COLORS = {
  python: SUBJECTS.PYTHON.color,
  dsa:    SUBJECTS.DSA.color,
  cn:     SUBJECTS.CN.color,
}
