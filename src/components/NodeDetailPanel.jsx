import { useMemo } from 'react'
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

export default function NodeDetailPanel({ node, mode, onClose, preferences }) {
  const learningResources = useMemo(
    () => mode === 'student' ? buildLearningResources(node, preferences) : [],
    [mode, node, preferences]
  )
  const consumedResources = useMemo(
    () => (node?.resources || []).filter(resource => resource.url && resource.url !== '#'),
    [node]
  )
  const summary = useMemo(
    () => mode === 'student' ? preferenceSummary(preferences) : '',
    [mode, preferences]
  )

  if (!node) return null

  // Professor: find struggling students for this concept
  const strugglingStudents = mode === 'professor'
    ? mockStudents.filter(s => s.answeredChecks[node.id] === false).slice(0, 6)
    : []

  const score = node.comprehension ?? node.accuracy ?? 0.5
  const scoreColor = comprehensionColor(score)

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-[360px] bg-gray-900 border-l border-gray-800 flex flex-col z-40"
         style={{ animation: 'slideInRight 0.3s ease-out' }}>

      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-gray-800">
        <div>
          <h2 className="text-white font-medium text-base leading-tight">{node.label || node.id}</h2>
          {node.course && <p className="text-gray-500 text-xs mt-1">{node.course}</p>}
          {node.week  && <p className="text-gray-500 text-xs">Week {node.week}</p>}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-800">x</button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Score */}
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

        {/* Struggling students (professor) */}
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

        {/* Intervention (professor) */}
        {mode === 'professor' && (
          <Section title="Suggested Intervention">
            <div className="bg-indigo-600/10 border border-indigo-600/20 rounded-lg p-3 text-sm text-gray-300 leading-relaxed">
              Re-explain {node.label} with concrete examples. Consider assigning a short visual explainer and follow-up quiz next session.
            </div>
          </Section>
        )}

        {/* Courses (student) */}
        {mode === 'student' && node.course && (
          <Section title="Appears In">
            <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded px-2 py-1 text-xs">{node.course}</span>
          </Section>
        )}

        {/* Student learning resources */}
        {mode === 'student' && learningResources.length > 0 && (
          <Section title="Learn This Topic">
            <p className="text-xs text-gray-500 mb-3">Prioritizing {summary}</p>
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
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 rounded px-1.5 py-0.5 flex-shrink-0">
                      {RESOURCE_LABELS[resource.type] || resource.type}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2">
                    {resource.source} - {resource.language}
                  </div>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Existing external resources */}
        {mode === 'student' && consumedResources.length > 0 && (
          <Section title="Saved Resources">
            <div className="space-y-2">
              {consumedResources.map((resource, i) => (
                <a key={i} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors">
                  <span className="text-indigo-400">{RESOURCE_LABELS[resource.type] || resource.type}</span>
                  <span className="truncate">{resource.title}</span>
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
