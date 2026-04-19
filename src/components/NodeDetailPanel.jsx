import { useEffect, useMemo, useState } from 'react'
import { getResourceRecommendations } from '../api/openai.js'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
import { studentAccuracyColor } from '../data/mockStudentGraph.js'
import { mockStudents } from '../data/mockStudents.js'
import { buildLearningResources, preferenceSummary } from '../utils/resourceRecommendations.js'

const RESOURCE_LABELS = {
  video: 'Video',
  text: 'Text',
  article: 'Text',
  pdf: 'PDF',
  podcast: 'Audio',
  interactive: 'Practice',
}

const CACHE_KEY = 'eg_ai_resource_cache'

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {}
  } catch {
    return {}
  }
}

function writeCache(key, resources) {
  const cache = readCache()
  cache[key] = {
    resources,
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
}

function getCacheKey(node, preferences) {
  return JSON.stringify({
    nodeId: node?.id,
    label: node?.label,
    course: node?.course,
    preferences,
  })
}

function hashCode(s) {
  let h = 0
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function struggleReasonFor(node, student) {
  const reasons = [
    'Confuses the core definition with a related concept.',
    'Can repeat terms but misses application in case scenarios.',
    'Mixes sequence/order with the previous step in the framework.',
    'Over-relies on memorized formulas without context fit.',
    'Struggles to map this idea to local market examples.',
    'Understands theory but misses common edge cases.',
    'Interprets metrics correctly but chooses weak action from them.',
    'Needs a concrete real-world analogy before abstract reasoning clicks.',
  ]
  const k = hashCode(`${node?.id || ''}:${student?.id || ''}`)
  return reasons[k % reasons.length]
}

function studentStrugglesOnNode(student, nodeId, score) {
  const explicit = student?.answeredChecks?.[nodeId]
  if (explicit === false) return true
  if (explicit === true) return false
  // Fallback for AI/custom graph ids not present in mock checks.
  const threshold = score < 0.45 ? 0.55 : score < 0.62 ? 0.35 : 0.18
  const seed = (hashCode(`${student?.id || ''}:${nodeId || ''}`) % 1000) / 1000
  return seed < threshold
}

export default function NodeDetailPanel({
  node,
  mode,
  onClose,
  preferences,
  onMasteryChange,
  graphDefaultAccuracy,
}) {
  const fallbackResources = useMemo(
    () => mode === 'student' ? buildLearningResources(node, preferences) : [],
    [mode, node, preferences]
  )
  const summary = useMemo(
    () => mode === 'student' ? preferenceSummary(preferences) : '',
    [mode, preferences]
  )
  const [learningResources, setLearningResources] = useState(fallbackResources)
  const [resourceStatus, setResourceStatus] = useState('idle')
  const [resourceNote, setResourceNote] = useState('')

  useEffect(() => {
    if (mode !== 'student' || !node) return

    const cacheKey = getCacheKey(node, preferences)
    const cached = readCache()[cacheKey]?.resources
    let cancelled = false

    if (cached?.length) {
      setLearningResources(cached)
      setResourceStatus('ai')
      setResourceNote('AI-generated from this node and your preferences.')
      return
    }

    setLearningResources(fallbackResources)
    setResourceStatus('loading')
    setResourceNote('Generating direct links from this topic and your preferences...')

    getResourceRecommendations(node, preferences, fallbackResources)
      .then(resources => {
        if (cancelled) return
        if (resources.length) {
          setLearningResources(resources)
          setResourceStatus('ai')
          setResourceNote('AI-generated from this node and your preferences.')
          writeCache(cacheKey, resources)
        } else {
          setLearningResources(fallbackResources)
          setResourceStatus('fallback')
          setResourceNote('Using verified backup links because the AI did not return usable direct URLs.')
        }
      })
      .catch(error => {
        if (cancelled) return
        setLearningResources(fallbackResources)
        setResourceStatus('fallback')
        setResourceNote(
          error.message.includes('VITE_OPENAI_API_KEY')
            ? 'Using verified backup links. Add VITE_OPENAI_API_KEY to .env to enable AI-generated links.'
            : 'Using verified backup links because AI link generation failed.'
        )
      })

    return () => {
      cancelled = true
    }
  }, [fallbackResources, mode, node, preferences])

  if (!node) return null

  const score = node.comprehension ?? node.accuracy ?? 0.5
  const strugglingStudents = mode === 'professor'
    ? mockStudents.filter(s => studentStrugglesOnNode(s, node.id, score)).slice(0, 6)
    : []
  const scoreColor =
    mode === 'student' && node?.accuracy != null
      ? studentAccuracyColor(node)
      : comprehensionColor(node)
  const defaultAcc = graphDefaultAccuracy ?? node._graphAccuracy ?? score

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-[min(100vw,400px)] sm:w-[400px] bg-claro-panel border-l border-claro-indigo/15 flex flex-col z-40"
         style={{ animation: 'slideInRight 0.3s ease-out' }}>

      <div className="flex items-start justify-between p-5 border-b border-claro-indigo/12">
        <div>
          <h2 className="text-claro-text font-semibold text-lg leading-snug pr-2">{node.label || node.id}</h2>
          {node.course && <p className="text-claro-muted text-sm mt-1">{node.course}</p>}
          {node.week  && <p className="text-claro-muted text-sm">Week {node.week}</p>}
        </div>
        <button type="button" onClick={onClose} className="text-claro-muted hover:text-claro-text transition-colors text-xl leading-none min-h-touch min-w-[2.75rem] flex items-center justify-center rounded-lg hover:bg-claro-indigo/10" aria-label="Close panel">×</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b border-claro-indigo/12">
          {mode === 'professor' ? (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-medium" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
                <span className="text-claro-muted text-sm">comprehension</span>
              </div>
              <div className="w-full h-2 bg-claro-slate/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: scoreColor }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-claro-muted">Your accuracy</span>
                <span className="text-base font-semibold" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-claro-slate/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: scoreColor }} />
              </div>
            </>
          )}
        </div>

        {mode === 'student' && onMasteryChange && (
          <Section title="How well you know this">
            <p className="text-sm text-claro-muted mb-4 leading-relaxed">
              Drag to set how well you know this concept (saved in this browser). Reset uses the graph default ({Math.round(defaultAcc * 100)}%).
            </p>
            <input
              type="range"
              min={5}
              max={98}
              step={1}
              value={Math.round(score * 100)}
              onChange={e => onMasteryChange(node.id, Number(e.target.value) / 100)}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-sm text-claro-muted mt-2">
              <span>Needs work</span>
              <span>Strong</span>
            </div>
            <button
              type="button"
              onClick={() => onMasteryChange(node.id, null)}
              className="mt-4 w-full min-h-touch text-sm py-2.5 rounded-lg border border-claro-indigo/25 text-claro-muted hover:text-claro-text hover:border-claro-indigo/40 transition-colors"
            >
              Reset to graph default
            </button>
          </Section>
        )}

        {mode === 'professor' && strugglingStudents.length > 0 && (
          <Section title="Struggling Students">
            <div className="space-y-1.5">
              {strugglingStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm gap-2">
                  <span className="text-claro-text">{s.name}</span>
                  <span className="text-red-400 text-xs text-right max-w-[58%]">{struggleReasonFor(node, s)}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {mode === 'professor' && (
          <Section title="Suggested Intervention">
            <div className="bg-claro-indigo/10 border border-claro-indigo/20 rounded-lg p-4 text-base text-claro-text leading-relaxed">
              Re-explain {node.label} with concrete examples. Consider assigning a short visual explainer and follow-up quiz next session.
            </div>
          </Section>
        )}

        {mode === 'student' && node.course && (
          <Section title="Appears In">
            <span className="bg-claro-indigo/20 text-claro-indigo border border-claro-indigo/30 rounded px-3 py-1.5 text-sm">{node.course}</span>
          </Section>
        )}

        {mode === 'student' && (
          <Section title="AI Learning Links">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm text-claro-muted">Prioritizing {summary}</p>
              <span className={`text-xs rounded px-2 py-1 border flex-shrink-0 ${
                resourceStatus === 'ai'
                  ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20'
                  : resourceStatus === 'loading'
                    ? 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20'
                    : 'text-amber-300 bg-amber-400/10 border-amber-400/20'
              }`}>
                {resourceStatus === 'ai' ? 'AI' : resourceStatus === 'loading' ? 'Generating' : 'Backup'}
              </span>
            </div>

            {resourceNote && <p className="text-sm text-claro-muted leading-relaxed mb-3">{resourceNote}</p>}

            {resourceStatus === 'loading' && (
              <div className="space-y-2 mb-3">
                {[1, 2].map(i => <div key={i} className="h-8 bg-claro-slate/60 rounded-lg skeleton" />)}
              </div>
            )}

            <div className="space-y-2">
              {learningResources.map((resource, i) => (
                <a
                  key={`${resource.url}-${i}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 bg-claro-slate/50 hover:bg-claro-slate/80 rounded-lg border border-claro-indigo/15 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-claro-text font-medium truncate">{resource.title}</div>
                      <div className="text-sm text-claro-muted leading-snug mt-1">{resource.description}</div>
                      {resource.why && <div className="text-xs text-claro-muted leading-relaxed mt-2">{resource.why}</div>}
                    </div>
                    <span className="text-xs text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded px-2 py-1 flex-shrink-0">
                      {RESOURCE_LABELS[resource.type] || resource.type}
                    </span>
                  </div>
                  <div className="text-xs text-claro-muted mt-3">
                    {resource.source || 'Learning resource'} - {resource.language || 'English'}
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="p-5 border-b border-claro-indigo/12">
      <h3 className="text-sm font-semibold text-claro-text mb-3">{title}</h3>
      {children}
    </div>
  )
}
