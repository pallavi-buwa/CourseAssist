import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const RESOURCE_ICONS = { video: '▶', article: '◈', podcast: '◉' }
const RESOURCE_COLORS = {
  video:   'text-claro-indigo bg-claro-indigo/12 border-claro-indigo/22',
  article: 'text-[#EDE5FF] bg-[#D4B8FF]/14 border-[#D4B8FF]/24',
  podcast: 'text-claro-sage bg-claro-sage/12 border-claro-sage/22',
}
const STATUS_META = {
  active:     { label: 'In Progress', cls: 'bg-claro-amber/15 text-claro-amber border-claro-amber/28' },
  mastered:   { label: 'Mastered',    cls: 'bg-claro-sage/15 text-claro-sage border-claro-sage/28' },
  struggling: { label: 'Needs Help',  cls: 'bg-claro-coral/15 text-claro-coral border-claro-coral/28' },
  default:    { label: 'Not Started', cls: 'bg-white/5 text-claro-muted border-white/10' },
}
const SUBJECT_HEADER = {
  python: 'from-[#C4B5FF]/38 to-claro-midnight/0 border-claro-indigo/28',
  dsa:    'from-[#D4B8FF]/38 to-claro-midnight/0 border-[#D4B8FF]/28',
  cn:     'from-claro-sage/35 to-claro-midnight/0 border-claro-sage/25',
}
const SUBJECT_DOT = {
  python: 'bg-claro-indigo',
  dsa:    'bg-[#D4B8FF]',
  cn:     'bg-claro-sage',
}

const SidePanel = memo(({ node, onClose }) => {
  if (!node) return null

  const subjectInfo = Object.values(SUBJECTS).find(s => s.id === node.subject)
  const statusMeta  = STATUS_META[node.status] || STATUS_META.default
  const headerCls   = SUBJECT_HEADER[node.subject] || 'from-claro-slate/80 to-claro-midnight/0 border-white/10'
  const dotCls      = SUBJECT_DOT[node.subject] || 'bg-claro-muted'

  return (
    <aside className="panel-enter absolute top-0 right-0 h-full w-[340px] flex flex-col z-10"
           style={{ background: '#1E1B2E', borderLeft: '1px solid rgba(180,171,201,0.2)' }}>

      {/* Header */}
      <div className={`bg-gradient-to-b ${headerCls} border-b p-5 pb-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Subject label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
              <span className="text-[11px] text-slate-400 font-medium truncate">
                {subjectInfo?.label}
              </span>
            </div>
            {/* Concept name */}
            <h2 className="text-white font-semibold text-lg leading-tight">
              {node.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10
                       text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center"
          >
            ✕
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
          <p className="text-slate-300 text-sm leading-relaxed">{node.desc}</p>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span>Connections: <span className="text-slate-300 font-medium">{node.degree}</span></span>
            <span>Importance: <span className="text-slate-300 font-medium">{node.weight.toFixed(1)}</span></span>
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
                  <span className="text-base">{RESOURCE_ICONS[r.type]}</span>
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
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">⚠</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Intervention */}
        <Section title="Suggested Intervention">
          <div className="bg-blue-500/8 border border-blue-500/15 rounded-lg p-3">
            <p className="text-sm text-slate-300 leading-relaxed">{node.intervention}</p>
          </div>
        </Section>

        {/* Brain-link visual (mock neuron indicator) */}
        <Section title="Neuron Activation">
          <div className="space-y-2">
            <NeuronBar label="Retention" value={Math.min(1, node.weight / 3)} color="#C4B5FF" />
            <NeuronBar label="Connectivity" value={Math.min(1, node.degree / 12)} color="#D4B8FF" />
            <NeuronBar label="Complexity" value={Math.min(1, (node.misconceptions?.length || 0) / 4 + 0.2)} color="#FFD6A8" />
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Based on concept weight, connections, and known difficulty patterns.
          </p>
        </Section>

      </div>
    </aside>
  )
})

function Section({ title, children }) {
  return (
    <div className="px-5 py-4 border-b border-white/5">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function NeuronBar({ label, value, color }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

SidePanel.displayName = 'SidePanel'
export default SidePanel
