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
    <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-5 mb-6">
      <h2 className="text-sm font-semibold text-white mb-2">{hub.title || 'Content'}</h2>
      {hub.lead && <p className="text-xs text-gray-400 leading-relaxed mb-4">{hub.lead}</p>}
      {hub.bullets?.length > 0 && (
        <ul className="text-[11px] text-gray-500 space-y-1.5 mb-5 list-disc pl-4">
          {hub.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((p, i) => (
          <button
            key={`${p.heading}-${i}`}
            type="button"
            onClick={() => openReading(p.courseTitle || p.heading)}
            className="text-left rounded-xl border border-gray-800 bg-gray-950/80 hover:border-white/15 hover:bg-gray-900 px-4 py-3 transition-colors"
          >
            <p className="text-xs font-medium text-white mb-1">{p.heading}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{p.body}</p>
            <p className="text-[10px] mt-2 opacity-90" style={{ color: accent }}>Open reading →</p>
          </button>
        ))}
      </div>
      {panels.length === 0 && (
        <p className="text-xs text-gray-600">Add concepts to your graph to see subject shortcuts here.</p>
      )}
    </div>
  )
}
