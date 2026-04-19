import { useEffect, useMemo, useState } from 'react'
import { getResourceRecommendations } from '../api/openai.js'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
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

export default function NodeDetailPanel({ node, mode, onClose, preferences }) {
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

  const strugglingStudents = mode === 'professor'
    ? mockStudents.filter(s => s.answeredChecks[node.id] === false).slice(0, 6)
    : []

  const score = node.comprehension ?? node.accuracy ?? 0.5
  const scoreColor = comprehensionColor(score)

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-[360px] bg-gray-900 border-l border-gray-800 flex flex-col z-40"
         style={{ animation: 'slideInRight 0.3s ease-out' }}>

      <div className="flex items-start justify-between p-5 border-b border-gray-800">
        <div>
          <h2 className="text-white font-medium text-base leading-tight">{node.label || node.id}</h2>
          {node.course && <p className="text-gray-500 text-xs mt-1">{node.course}</p>}
          {node.week  && <p className="text-gray-500 text-xs">Week {node.week}</p>}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-800">x</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-5 border-b border-gray-800">
          {mode === 'professor' ? (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-medium" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
                <span className="text-gray-500 text-sm">comprehension</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: scoreColor }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Your accuracy</span>
                <span className="text-sm font-medium" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: scoreColor }} />
              </div>
            </>
          )}
        </div>

        {mode === 'professor' && strugglingStudents.length > 0 && (
          <Section title="Struggling Students">
            <div className="space-y-1.5">
              {strugglingStudents.map(s => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-red-400 text-[10px]">{node.misconception || 'Common misconception'}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {mode === 'professor' && (
          <Section title="Suggested Intervention">
            <div className="bg-claro-indigo/10 border border-claro-indigo/20 rounded-lg p-3 text-sm text-gray-300 leading-relaxed">
              Re-explain {node.label} with concrete examples. Consider assigning a short visual explainer and follow-up quiz next session.
            </div>
          </Section>
        )}

        {mode === 'student' && node.course && (
          <Section title="Appears In">
            <span className="bg-claro-indigo/20 text-claro-indigo border border-claro-indigo/30 rounded px-2 py-1 text-xs">{node.course}</span>
          </Section>
        )}

        {mode === 'student' && (
          <Section title="AI Learning Links">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-xs text-gray-500">Prioritizing {summary}</p>
              <span className={`text-[10px] rounded px-1.5 py-0.5 border flex-shrink-0 ${
                resourceStatus === 'ai'
                  ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20'
                  : resourceStatus === 'loading'
                    ? 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20'
                    : 'text-amber-300 bg-amber-400/10 border-amber-400/20'
              }`}>
                {resourceStatus === 'ai' ? 'AI' : resourceStatus === 'loading' ? 'Generating' : 'Backup'}
              </span>
            </div>

            {resourceNote && <p className="text-xs text-gray-500 leading-5 mb-3">{resourceNote}</p>}

            {resourceStatus === 'loading' && (
              <div className="space-y-2 mb-3">
                {[1, 2].map(i => <div key={i} className="h-8 bg-gray-800 rounded-lg skeleton" />)}
              </div>
            )}

            <div className="space-y-2">
              {learningResources.map((resource, i) => (
                <a
                  key={`${resource.url}-${i}`}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-white font-medium truncate">{resource.title}</div>
                      <div className="text-xs text-gray-500 leading-5 mt-1">{resource.description}</div>
                      {resource.why && <div className="text-[10px] text-gray-500 leading-4 mt-1">{resource.why}</div>}
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded px-1.5 py-0.5 flex-shrink-0">
                      {RESOURCE_LABELS[resource.type] || resource.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">
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
    <div className="p-5 border-b border-gray-800">
      <h3 className="text-[11px] uppercase tracking-widest text-gray-500 font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}
