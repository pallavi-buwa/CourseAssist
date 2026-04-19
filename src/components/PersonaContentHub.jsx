import { useNavigate } from 'react-router-dom'
import { slugifySubject } from '../utils/studentGraphSnapshot.js'

/**
 * Persona-specific copy + focus panels; falls back to one panel per graph subject.
 */
export default function PersonaContentHub({ persona, subjects }) {
  const navigate = useNavigate()
  const accent = persona?.accentHex || '#C4B5FF'
  const hub = persona?.contentHub || {}
  const panels = (Array.isArray(hub.focusPanels) && hub.focusPanels.length > 0)
    ? hub.focusPanels
    : (subjects || []).map(title => ({
        heading: title,
        body: 'Reading workspace for this subject from your knowledge graph.',
        courseTitle: title,
      }))

  const openReading = (courseTitle) => {
    const slug = slugifySubject(courseTitle || '')
    if (slug) navigate(`/student/reading/${slug}`)
  }

  return (
    <div className="rounded-2xl border border-claro-indigo/20 bg-claro-panel p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-semibold text-claro-text mb-2">{hub.title || 'Content'}</h2>
      {hub.lead && <p className="text-base text-claro-muted leading-relaxed mb-5">{hub.lead}</p>}
      {hub.bullets?.length > 0 && (
        <ul className="text-base text-claro-muted space-y-2 mb-6 list-disc pl-5 marker:text-claro-indigo/80">
          {hub.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((p, i) => (
          <button
            key={`${p.heading}-${i}`}
            type="button"
            onClick={() => openReading(p.courseTitle || p.heading)}
            className="text-left rounded-xl border border-claro-indigo/15 bg-claro-canvas/60 hover:border-claro-indigo/35 hover:bg-claro-canvas px-5 py-4 min-h-[5.5rem] transition-colors"
          >
            <p className="text-base font-medium text-claro-text mb-1">{p.heading}</p>
            <p className="text-sm text-claro-muted leading-relaxed">{p.body}</p>
            <p className="text-sm mt-3 font-medium" style={{ color: accent }}>Open reading →</p>
          </button>
        ))}
      </div>
      {panels.length === 0 && (
        <p className="text-base text-claro-muted">Add concepts to your graph to see subject shortcuts here.</p>
      )}
    </div>
  )
}
