import { useState } from 'react'
import { getResourceRecommendations } from '../api/claude.js'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
import { studentAccuracyColor } from '../data/mockStudentGraph.js'
import { mockStudents } from '../data/mockStudents.js'

const RESOURCE_ICONS = { video: 'Video', article: 'Article', podcast: 'Podcast' }

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
  const scoreColor =
    node.accuracy != null
      ? studentAccuracyColor(node)
      : node.comprehension != null || node.week != null
        ? comprehensionColor(node)
        : comprehensionColor(score)

  return (
    <div className="fixed right-0 top-14 h-[calc(100vh-56px)] w-[360px] bg-claro-panel border-l border-claro-indigo/15 flex flex-col z-40 shadow-xl"
         style={{ animation: 'slideInRight 0.3s ease-out' }}>

      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-claro-indigo/12">
        <div>
          <h2 className="text-claro-text font-medium text-base leading-tight">{node.label || node.id}</h2>
          {node.course && <p className="text-claro-muted text-xs mt-1">{node.course}</p>}
          {node.week  && <p className="text-claro-muted text-xs">Week {node.week}</p>}
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-claro-muted hover:text-claro-text transition-colors text-xs px-2 py-1 rounded-lg hover:bg-claro-slate">Close</button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">

        {/* Score */}
        <div className="p-5 border-b border-claro-indigo/12">
          {mode === 'professor' ? (
            <>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-medium" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
                <span className="text-claro-muted text-sm">comprehension</span>
              </div>
              <div className="w-full h-2 bg-claro-slate rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${score * 100}%`, background: scoreColor }} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-claro-muted uppercase tracking-wider">Your accuracy</span>
                <span className="text-sm font-medium" style={{ color: scoreColor }}>{Math.round(score * 100)}%</span>
              </div>
              {/* Arc progress indicator (simple) */}
              <div className="w-full h-2 bg-claro-slate rounded-full overflow-hidden">
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
                  <span className="text-claro-muted">{s.name}</span>
                  <span className="text-claro-coral text-[10px]">{node.misconception || 'Common misconception'}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Intervention (professor) */}
        {mode === 'professor' && (
          <Section title="Suggested Intervention">
            <div className="bg-claro-slate/90 border border-claro-indigo/18 rounded-lg p-3 text-sm text-claro-muted leading-relaxed">
              Re-explain {node.label} with concrete examples. Consider assigning a short visual explainer and follow-up quiz next session.
            </div>
          </Section>
        )}

        {/* Courses (student) */}
        {mode === 'student' && node.course && (
          <Section title="Appears in">
            <span className="bg-claro-indigo/12 text-claro-indigo border border-claro-indigo/25 rounded px-2 py-1 text-xs">{node.course}</span>
          </Section>
        )}

        {/* Resources (student) */}
        {mode === 'student' && node.resources?.length > 0 && (
          <Section title="Resources You've Consumed">
            <div className="space-y-2">
              {node.resources.map((r, i) => (
                <a key={i} href={r.url} onClick={e => e.preventDefault()} className="flex items-center gap-2 text-xs text-claro-muted hover:text-claro-text transition-colors">
                  <span className="text-[10px] font-medium uppercase text-claro-muted">{RESOURCE_ICONS[r.type]}</span>
                  <span className="truncate">{r.title}</span>
                  <span className="text-claro-muted text-[10px] flex-shrink-0">{r.type}</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Discover more (student) */}
        {mode === 'student' && (
          <Section title="Discover More">
            {!aiResources && !loadingAI && !aiError && (
              <button onClick={handleDiscover} className="w-full rounded-lg bg-claro-indigo px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125">
                Discover more
              </button>
            )}
            {loadingAI && (
              <div className="space-y-2">
                {[1,2,3].map(i => <div key={i} className="h-8 bg-claro-slate rounded-lg skeleton" />)}
              </div>
            )}
            {aiError && <p className="text-xs text-claro-coral">{aiError}</p>}
            {aiResources && (
              <div className="space-y-2">
                {aiResources.map((r, i) => (
                  <a key={i} href={r.url} target="_blank" rel="noreferrer"
                     className="flex items-start gap-2 p-2 bg-claro-canvas hover:bg-claro-slate rounded-lg border border-claro-indigo/15 transition-colors">
                    <span className="text-[10px] font-medium uppercase text-claro-muted mt-0.5">{RESOURCE_ICONS[r.type]}</span>
                    <div className="min-w-0">
                      <div className="text-xs text-claro-text font-medium truncate">{r.title}</div>
                      <div className="text-xs text-claro-muted truncate">{r.description}</div>
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
    <div className="p-5 border-b border-claro-indigo/10">
      <h3 className="text-[11px] uppercase tracking-widest text-claro-muted font-medium mb-3">{title}</h3>
      {children}
    </div>
  )
}
