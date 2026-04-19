import { useState } from 'react'
import { getResourceRecommendations } from '../api/claude.js'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
import { mockStudents } from '../data/mockStudents.js'

const RESOURCE_ICONS = { video: '▶', article: '◈', podcast: '◉' }

export default function NodeDetailPanel({ node, mode, onClose, preferences }) {
  const [aiResources, setAiResources] = useState(null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState(null)

  if (!node) return null

  const handleDiscover = async () => {
    setLoadingAI(true); setAiError(null)
    try {
      const prefs = preferences || { language: 'English', format: 'video' }
      const recs = await getResourceRecommendations(node.label || node.id, prefs)
      setAiResources(recs)
    } catch (e) {
      setAiError('API key not configured. Add VITE_ANTHROPIC_API_KEY to .env')
    } finally {
      setLoadingAI(false)
    }
  }

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
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-800">✕</button>
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
              {/* Arc progress indicator (simple) */}
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
            <div className="bg-claro-indigo/10 border border-claro-indigo/20 rounded-lg p-3 text-sm text-gray-300 leading-relaxed">
              Re-explain {node.label} with concrete examples. Consider assigning a short visual explainer and follow-up quiz next session.
            </div>
          </Section>
        )}

        {/* Courses (student) */}
        {mode === 'student' && node.course && (
          <Section title="Appears in">
            <span className="bg-claro-indigo/20 text-claro-indigo border border-claro-indigo/30 rounded px-2 py-1 text-xs">{node.course}</span>
          </Section>
        )}

        {/* Resources (student) */}
        {mode === 'student' && node.resources?.length > 0 && (
          <Section title="Resources You've Consumed">
            <div className="space-y-2">
              {node.resources.map((r, i) => (
                <a key={i} href={r.url} onClick={e => e.preventDefault()} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white transition-colors">
                  <span className="text-claro-indigo">{RESOURCE_ICONS[r.type]}</span>
                  <span className="truncate">{r.title}</span>
                  <span className="text-gray-600 text-[10px] flex-shrink-0">{r.type}</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Discover more (student) */}
        {mode === 'student' && (
          <Section title="Discover More">
            {!aiResources && !loadingAI && !aiError && (
              <button onClick={handleDiscover} className="w-full bg-claro-indigo hover:brightness-110 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Discover more →
              </button>
            )}
            {loadingAI && (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-800 rounded-lg skeleton" />)}
              </div>
            )}
            {aiError && <p className="text-xs text-red-400">{aiError}</p>}
            {aiResources && (
              <div className="space-y-2">
                {aiResources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer"
                     className="flex items-start gap-2 p-2 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 transition-colors">
                    <span className="text-claro-indigo text-base mt-0.5">{RESOURCE_ICONS[r.type]}</span>
                    <div className="min-w-0">
                      <div className="text-xs text-white font-medium truncate">{r.title}</div>
                      <div className="text-xs text-gray-500 truncate">{r.description}</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
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
