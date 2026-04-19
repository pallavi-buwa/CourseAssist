// ─────────────────────────────────────────────────────────────────────────────
// Cluster & LOD utilities
// ─────────────────────────────────────────────────────────────────────────────

// Top N nodes per subject for the overview layer
const OVERVIEW_PER_SUBJECT = 10

/**
 * Returns the initial visible node ID set: highest-importance nodes per subject.
 */
export function getInitialVisibleIds(nodes) {
  const bySubject = {}
  nodes.forEach(n => {
    if (!bySubject[n.subject]) bySubject[n.subject] = []
    bySubject[n.subject].push(n)
  })

  const visible = new Set()
  Object.values(bySubject).forEach(group => {
    group
      .slice()
      .sort((a, b) => b.val - a.val)
      .slice(0, OVERVIEW_PER_SUBJECT)
      .forEach(n => visible.add(n.id))
  })
  return visible
}

/**
 * Returns all neighbor IDs of a given node from the link list.
 */
export function getDirectNeighborIds(nodeId, links) {
  const ids = new Set()
  links.forEach(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source
    const t = typeof l.target === 'object' ? l.target.id : l.target
    if (s === nodeId) ids.add(t)
    if (t === nodeId) ids.add(s)
  })
  return ids
}

/**
 * Returns links where both endpoints are in visibleIds.
 */
export function filterLinks(links, visibleIds) {
  return links.filter(l => {
    const s = typeof l.source === 'object' ? l.source.id : l.source
    const t = typeof l.target === 'object' ? l.target.id : l.target
    return visibleIds.has(s) && visibleIds.has(t)
  })
}

/**
 * Compute sphere radius for a node based on val and level.
 * Far/overview nodes are drawn bigger so they're visible; near/detail nodes are standard.
 */
export function nodeRadius(node, level) {
  const base = Math.sqrt(node.val) * 2.8
  if (level === 0) return base * 1.35  // bigger in overview
  if (level === 1) return base * 1.1
  return base
}
