import { memo } from 'react'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

const Legend = memo(() => (
  <div className="absolute bottom-6 left-5 z-20 pointer-events-none"
       style={{ background: 'rgba(253,246,237,0.94)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(45,106,79,0.2)', borderRadius: 10, padding: '12px 16px' }}>
    <div className="text-[10px] font-semibold uppercase tracking-widest text-claro-muted mb-3">Legend</div>

    {/* Subjects */}
    <div className="space-y-1.5 mb-3">
      {[
        { color: '#14532d', label: 'Python Programming' },
        { color: '#1a5f45', label: 'DS & Algorithms' },
        { color: '#3f5c4d', label: 'Computer Networks' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-[11px] text-claro-text/90">{label}</span>
        </div>
      ))}
    </div>

    <div className="border-t border-[#2D6A4F]/15 pt-2.5 space-y-1.5">
      {[
        { color: '#ca8a04', label: 'Active' },
        { color: '#047857', label: 'Mastered' },
        { color: '#c2410c', label: 'Struggling' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-[11px] text-claro-muted">{label}</span>
        </div>
      ))}
    </div>

    {/* Score ramp (comprehension / accuracy views) */}
    <div className="border-t border-[#2D6A4F]/15 pt-2.5 space-y-1.5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-claro-muted">Score (when shown)</div>
      {SCORE_BANDS.slice(0, 4).map(b => (
        <div key={b.range} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ background: b.color }} />
          <span className="text-[10px] text-claro-muted">{b.range} · {b.label}</span>
        </div>
      ))}
    </div>

    <div className="border-t border-[#2D6A4F]/15 pt-2.5 mt-2 flex items-center gap-3">
      {[5, 10, 16].map(size => (
        <div key={size} className="flex flex-col items-center gap-1">
          <span className="rounded-full bg-claro-muted/35" style={{ width: size, height: size }} />
        </div>
      ))}
      <span className="text-[10px] text-claro-muted/80">= importance</span>
    </div>
  </div>
))

Legend.displayName = 'Legend'
export default Legend
