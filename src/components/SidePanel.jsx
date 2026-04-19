import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const RESOURCE_ICONS = { video: '▶', article: '◈', podcast: '◉' }
const RESOURCE_COLORS = {
  video:   'text-[#1B4332] bg-[#2D6A4F]/10 border-[#2D6A4F]/22',
  article: 'text-[#1B4332] bg-[#78350f]/10 border-[#78350f]/22',
  podcast: 'text-[#1B4332] bg-[#3f5c4d]/12 border-[#3f5c4d]/24',
}
const STATUS_META = {
  active:     { label: 'In Progress', cls: 'bg-[#a16207]/12 text-[#92400e] border-[#a16207]/28' },
  mastered:   { label: 'Mastered',    cls: 'bg-[#14532d]/12 text-[#14532d] border-[#14532d]/28' },
  struggling: { label: 'Needs Help',  cls: 'bg-[#78350f]/12 text-[#78350f] border-[#78350f]/28' },
  default:    { label: 'Not Started', cls: 'bg-[#E8F0EB] text-claro-muted border-[#2D6A4F]/15' },
}
const SUBJECT_HEADER = {
  python: 'from-[#2D6A4F]/18 to-[#FDF6ED]/0 border-[#2D6A4F]/25',
  dsa:    'from-[#1a5f45]/20 to-[#FDF6ED]/0 border-[#1a5f45]/28',
  cn:     'from-[#3f5c4d]/18 to-[#FDF6ED]/0 border-[#3f5c4d]/28',
}
const SUBJECT_DOT = {
  python: 'bg-[#2D6A4F]',
  dsa:    'bg-[#1a5f45]',
  cn:     'bg-[#3f5c4d]',
}

const SidePanel = memo(({ node, onClose }) => {
  if (!node) return null

  const subjectInfo = Object.values(SUBJECTS).find(s => s.id === node.subject)
  const statusMeta  = STATUS_META[node.status] || STATUS_META.default
  const headerCls   = SUBJECT_HEADER[node.subject] || 'from-[#E8F0EB]/90 to-[#FDF6ED]/0 border-[#2D6A4F]/15'
  const dotCls      = SUBJECT_DOT[node.subject] || 'bg-claro-muted'

  return (
    <aside className="panel-enter absolute top-0 right-0 h-full w-[340px] flex flex-col z-10 shadow-xl"
           style={{ background: '#FFFCF7', borderLeft: '1px solid rgba(45,106,79,0.18)' }}>

      {/* Header */}
      <div className={`bg-gradient-to-b ${headerCls} border-b p-5 pb-4`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Subject label */}
            <div className="flex items-center gap-1.5 mb-2">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
              <span className="text-[11px] text-[#5C6B63] font-medium truncate">
                {subjectInfo?.label}
              </span>
            </div>
            {/* Concept name */}
            <h2 className="text-[#1B4332] font-semibold text-lg leading-tight">
              {node.label}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E8F0EB] hover:bg-[#2D6A4F]/12
                       text-[#5C6B63] hover:text-[#1B4332] text-sm transition-colors flex items-center justify-center"
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
          <p className="text-[#3d5248] text-sm leading-relaxed">{node.desc}</p>
          <div className="flex gap-4 mt-3 text-xs text-[#5C6B63]">
            <span>Connections: <span className="text-[#1B4332] font-medium">{node.degree}</span></span>
            <span>Importance: <span className="text-[#1B4332] font-medium">{node.weight.toFixed(1)}</span></span>
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
                <li key={i} className="flex items-start gap-2 text-sm text-[#3d5248]">
                  <span className="text-[#a16207] mt-0.5 flex-shrink-0">⚠</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Intervention */}
        <Section title="Suggested Intervention">
          <div className="bg-[#E8F0EB]/80 border border-[#2D6A4F]/18 rounded-lg p-3">
            <p className="text-sm text-[#3d5248] leading-relaxed">{node.intervention}</p>
          </div>
        </Section>

        {/* Brain-link visual (mock neuron indicator) */}
        <Section title="Neuron Activation">
          <div className="space-y-2">
            <NeuronBar label="Retention" value={Math.min(1, node.weight / 3)} color="#047857" />
            <NeuronBar label="Connectivity" value={Math.min(1, node.degree / 12)} color="#0d9488" />
            <NeuronBar label="Complexity" value={Math.min(1, (node.misconceptions?.length || 0) / 4 + 0.2)} color="#c2410c" />
          </div>
          <p className="text-[11px] text-[#5C6B63] mt-3">
            Based on concept weight, connections, and known difficulty patterns.
          </p>
        </Section>

      </div>
    </aside>
  )
})

function Section({ title, children }) {
  return (
    <div className="px-5 py-4 border-b border-[#2D6A4F]/10">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#5C6B63] mb-3">
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
      <div className="flex justify-between text-xs text-[#5C6B63] mb-1">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#E8F0EB] rounded-full overflow-hidden">
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
