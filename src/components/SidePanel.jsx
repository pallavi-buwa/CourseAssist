import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const RESOURCE_ICONS = { video: 'Video', article: 'Article', podcast: 'Podcast' }
const RESOURCE_COLORS = {
  video:   'text-claro-text bg-claro-indigo/10 border-claro-indigo/22',
  article: 'text-claro-text bg-claro-coral/10 border-claro-coral/22',
  podcast: 'text-claro-text bg-claro-sage/12 border-claro-sage/25',
}
const STATUS_META = {
  active:     { label: 'In Progress', cls: 'bg-claro-amber/12 text-claro-amber border-claro-amber/28' },
  mastered:   { label: 'Mastered',    cls: 'bg-claro-indigo/12 text-claro-indigo border-claro-indigo/28' },
  struggling: { label: 'Needs Help',  cls: 'bg-claro-coral/12 text-claro-coral border-claro-coral/28' },
  default:    { label: 'Not Started', cls: 'bg-claro-slate text-claro-muted border-claro-indigo/15' },
}
const SUBJECT_HEADER = {
  python: 'from-claro-indigo/18 to-transparent border-claro-indigo/25',
  dsa:    'from-claro-sage/18 to-transparent border-claro-sage/28',
  cn:     'from-claro-muted/20 to-transparent border-claro-indigo/22',
}
const SUBJECT_DOT = {
  python: 'bg-claro-indigo',
  dsa:    'bg-accent-dsa',
  cn:     'bg-accent-cn',
}

const SidePanel = memo(({ node, onClose }) => {
  if (!node) return null

  const subjectInfo = Object.values(SUBJECTS).find(s => s.id === node.subject)
  const statusMeta  = STATUS_META[node.status] || STATUS_META.default
  const headerCls   = SUBJECT_HEADER[node.subject] || 'from-claro-slate/90 to-transparent border-claro-indigo/15'
  const dotCls      = SUBJECT_DOT[node.subject] || 'bg-claro-muted'

  return (
    <aside className="panel-enter absolute right-0 top-0 z-10 flex h-full w-[340px] flex-col border-l border-claro-indigo/20 bg-claro-panel shadow-xl dark:border-claro-sage/25">

      {/* Header */}
      <div className={`bg-gradient-to-b ${headerCls} border-b p-5 pb-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Subject label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
              <span className="text-[11px] text-claro-muted font-medium truncate">
                {subjectInfo?.label}
              </span>
            </div>
            {/* Concept name */}
            <h2 className="text-claro-text font-semibold text-lg leading-tight">
              {node.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 rounded-full bg-claro-slate px-2 py-1 text-[11px] hover:bg-claro-indigo/12
                       text-claro-muted hover:text-claro-text transition-colors"
          >
            Close
          </button>
        </div>

        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-medium mt-3 ${statusMeta.cls}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {statusMeta.label}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Description */}
        <Section title="About">
          <p className="text-claro-muted text-sm leading-relaxed">{node.desc}</p>
          <div className="flex gap-4 mt-3 text-xs text-claro-muted">
            <span>Connections: <span className="text-claro-text font-medium">{node.degree}</span></span>
            <span>Importance: <span className="text-claro-text font-medium">{node.weight.toFixed(1)}</span></span>
          </div>
        </Section>

        {/* Resources */}
        {node.resources?.length > 0 && (
          <Section title="Learning Resources">
            <div className="space-y-2">
              {node.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  onClick={e => e.preventDefault()}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border
                              text-xs transition-opacity hover:opacity-90 cursor-pointer ${RESOURCE_COLORS[r.type]}`}
                >
                  <span className="text-[10px] font-medium uppercase text-claro-muted">{RESOURCE_ICONS[r.type]}</span>
                  <span className="flex-1 truncate font-medium">{r.label}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">{r.type}</span>
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Misconceptions */}
        {node.misconceptions?.length > 0 && (
          <Section title="Common Misconceptions">
            <ul className="space-y-2">
              {node.misconceptions.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-claro-muted">
                  <span className="mt-0.5 flex-shrink-0 font-medium text-claro-amber" aria-hidden>!</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Intervention */}
        <Section title="Suggested Intervention">
          <div className="bg-claro-slate/80 border border-claro-indigo/18 rounded-lg p-3">
            <p className="text-sm text-claro-muted leading-relaxed">{node.intervention}</p>
          </div>
        </Section>

        {/* Brain-link visual (mock neuron indicator) */}
        <Section title="Neuron Activation">
          <div className="space-y-2">
            <NeuronBar label="Retention" value={Math.min(1, node.weight / 3)} barClass="bg-claro-sage" />
            <NeuronBar label="Connectivity" value={Math.min(1, node.degree / 12)} barClass="bg-claro-indigo" />
            <NeuronBar label="Complexity" value={Math.min(1, (node.misconceptions?.length || 0) / 4 + 0.2)} barClass="bg-claro-coral" />
          </div>
          <p className="text-[11px] text-claro-muted mt-3">
            Based on concept weight, connections, and known difficulty patterns.
          </p>
        </Section>

      </div>
    </aside>
  )
})

function Section({ title, children }) {
  return (
    <div className="px-5 py-4 border-b border-claro-indigo/10">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-claro-muted mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function NeuronBar({ label, value, barClass = 'bg-claro-indigo' }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-claro-muted mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-claro-slate rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

SidePanel.displayName = 'SidePanel'
export default SidePanel
