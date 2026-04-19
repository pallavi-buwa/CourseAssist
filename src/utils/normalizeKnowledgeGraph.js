function slugId(s, i) {
  const base = String(s || `node-${i}`)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return base || `node-${i}`
}

export function normalizeStudentGraphFromAI(raw) {
  const nodesIn = Array.isArray(raw?.nodes) ? raw.nodes : []
  const nodes = nodesIn.map((n, i) => {
    const id = slugId(n.id, i)
    const rawCourse = n.course != null && String(n.course).trim() ? String(n.course).trim() : ''
    const course = rawCourse || 'General'
    let accuracy = typeof n.accuracy === 'number' ? n.accuracy : 0.42 + (i % 7) * 0.06
    accuracy = Math.max(0.22, Math.min(0.93, accuracy))
    const resources = Array.isArray(n.resources) && n.resources.length
      ? n.resources.map(r => ({
          type: ['video', 'article', 'podcast', 'text'].includes(r.type) ? r.type : 'article',
          title: String(r.title || 'Reading').slice(0, 120),
          url: String(r.url || '#').slice(0, 500),
        }))
      : [{ type: 'article', title: 'Review', url: '#' }]
    return {
      id,
      label: String(n.label || `Concept ${i + 1}`).slice(0, 80),
      course,
      accuracy,
      resources,
    }
  })

  const idSet = new Set(nodes.map(n => n.id))
  const links = (Array.isArray(raw?.links) ? raw.links : [])
    .map(l => ({
      source: slugId(l.source, 0),
      target: slugId(l.target, 0),
      ...(l.crossCourse ? { crossCourse: true } : {}),
    }))
    .filter(l => idSet.has(l.source) && idSet.has(l.target))

  return { nodes, links }
}

export function normalizeProfessorGraphFromAI(raw) {
  const nodesIn = Array.isArray(raw?.nodes) ? raw.nodes : []
  const nodes = nodesIn.map((n, i) => {
    const id = slugId(n.id, i)
    let comprehension = typeof n.comprehension === 'number' ? n.comprehension : 0.35 + (i % 8) * 0.07
    comprehension = Math.max(0.18, Math.min(0.96, comprehension))
    let week = typeof n.week === 'number' ? Math.round(n.week) : (i % 8) + 1
    week = Math.max(1, Math.min(8, week))
    return {
      id,
      label: String(n.label || `Topic ${i + 1}`).slice(0, 80),
      comprehension,
      week,
    }
  })

  const idSet = new Set(nodes.map(n => n.id))
  const links = (Array.isArray(raw?.links) ? raw.links : [])
    .map(l => ({
      source: slugId(l.source, 0),
      target: slugId(l.target, 0),
    }))
    .filter(l => idSet.has(l.source) && idSet.has(l.target))

  return { nodes, links }
}
