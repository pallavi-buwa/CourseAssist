import { SUBJECTS } from '../data/graphData.js'

// Status → color mapping
export const STATUS_COLORS = {
  default:    null,
  active:     '#ca8a04',
  mastered:   '#047857',
  struggling: '#c2410c',
  highlight:  '#FFFCF7',
}

export function resolveNodeColor(node) {
  if (node.status && node.status !== 'default') return STATUS_COLORS[node.status]
  return node.color || '#8a9b94'
}

export function resolveNodeOpacity(node, hoveredId, selectedId) {
  if (!hoveredId) return 1
  if (node.id === hoveredId) return 1
  if (node.id === selectedId) return 1
  return 0.25
}

export function getLinkColor(link, hoveredId, neighborIds) {
  if (!hoveredId) return 'rgba(45,106,79,0.18)'
  const srcId = typeof link.source === 'object' ? link.source.id : link.source
  const tgtId = typeof link.target === 'object' ? link.target.id : link.target
  if (srcId === hoveredId || tgtId === hoveredId) return 'rgba(27,67,50,0.45)'
  return 'rgba(45,106,79,0.08)'
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
