import { resolvePersona } from '../data/personas.js'
import { getStaticStudentGraphForPersona } from '../data/personaStudentGraphs.js'
import { readCachedStudentAIGraph } from './personaGraphStorage.js'

export function slugifySubject(title) {
  return String(title || 'module')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'module'
}

export function getStudentGraphSnapshot(email) {
  const p = resolvePersona(email, 'student')
  return readCachedStudentAIGraph(email) || getStaticStudentGraphForPersona(p)
}

/** Unique `node.course` values from the current graph, sorted. */
export function uniqueSubjectsFromGraph(graphData) {
  const set = new Set()
  for (const n of graphData?.nodes || []) {
    const c = n?.course
    if (c && String(c).trim()) set.add(String(c).trim())
  }
  return [...set].sort((a, b) => a.localeCompare(b))
}

/** Short label for tab UI (does not change filter id). */
export function compactSubjectLabel(name, max = 20) {
  const s = String(name || '')
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

const ACCENT_ROTATION = [
  { color: 'from-[#C4B5FF]/24 to-[#D4B8FF]/18', border: 'border-claro-indigo/35', accent: 'text-claro-indigo', progressGradient: 'from-[#C4B5FF] to-[#D4B8FF]' },
  { color: 'from-claro-sage/20 to-claro-indigo/15', border: 'border-claro-sage/35', accent: 'text-claro-sage', progressGradient: 'from-claro-sage to-claro-indigo' },
  { color: 'from-claro-amber/22 to-orange-600/15', border: 'border-claro-amber/35', accent: 'text-claro-amber', progressGradient: 'from-claro-amber to-orange-600' },
  { color: 'from-[#FFB8C8]/22 to-pink-400/10', border: 'border-[#FFB8C8]/32', accent: 'text-claro-coral', progressGradient: 'from-claro-coral to-pink-400' },
]

export function subjectCardStyle(index) {
  return ACCENT_ROTATION[index % ACCENT_ROTATION.length]
}

/** Build home cards from graph subjects (demo progress cycles by index). */
export function buildSubjectCardsFromGraph(graphData) {
  const titles = uniqueSubjectsFromGraph(graphData)
  const progressCycle = [72, 58, 41, 65, 50]
  const moduleCycle = [
    'Predictive Analytics & KPIs',
    'Competitive Strategy',
    'Pitching & Fundraising',
    'Customer insight & positioning',
    'Operations & scaling',
  ]
  return titles.map((title, i) => ({
    slug: slugifySubject(title),
    title,
    code: `MBA ${600 + i + 1}`,
    progress: progressCycle[i % progressCycle.length],
    modules: 6 + (i % 5),
    nextModule: moduleCycle[i % moduleCycle.length],
    ...subjectCardStyle(i),
  }))
}

/** Resolve reading header line from URL segment (supports legacy module-* ids). */
export function resolveSubjectTitleForReading(email, moduleId) {
  const slug = String(moduleId || '').trim()
  const legacyTitles = {
    'module-ai-1': 'AI for Business Decisions',
    'module-strat-1': 'Strategic Management',
    'module-ent-1': 'Entrepreneurship',
  }
  if (legacyTitles[slug]) return legacyTitles[slug]
  const subjects = uniqueSubjectsFromGraph(getStudentGraphSnapshot(email))
  return subjects.find(t => slugifySubject(t) === slug) || null
}
