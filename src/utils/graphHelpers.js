import { SUBJECTS } from '../data/graphData.js'

// Status → color mapping
export const STATUS_COLORS = {
  default:    null,   // falls back to subject color
  active:     '#FFD6A8',
  mastered:   '#9EE4D4',
  struggling: '#FFB8C8',
  highlight:  '#ffffff',
}

export function resolveNodeColor(node) {
  if (node.status && node.status !== 'default') return STATUS_COLORS[node.status]
  return node.color || '#B4ABC9'
}

export function resolveNodeOpacity(node, hoveredId, selectedId) {
  if (!hoveredId) return 1
  if (node.id === hoveredId) return 1
  if (node.id === selectedId) return 1
  return 0.25
}

export function getLinkColor(link, hoveredId, neighborIds) {
  if (!hoveredId) return 'rgba(180,171,201,0.16)'
  const srcId = typeof link.source === 'object' ? link.source.id : link.source
  const tgtId = typeof link.target === 'object' ? link.target.id : link.target
  if (srcId === hoveredId || tgtId === hoveredId) return 'rgba(246,242,255,0.62)'
  return 'rgba(180,171,201,0.07)'
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
