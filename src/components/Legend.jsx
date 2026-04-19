import { memo } from 'react'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

const Legend = memo(() => (
  <div
    className="pointer-events-none absolute bottom-6 left-5 z-20 rounded-[10px] border border-claro-green/25 bg-claro-panel/95 px-4 py-3 backdrop-blur-md"
  >
    <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-claro-yellow">Legend</div>

    {/* Subjects */}
    <div className="mb-3 space-y-1.5">
      {[
        { color: '#22c55e', label: 'Python Programming' },
        { color: '#16a34a', label: 'DS & Algorithms' },
        { color: '#15803d', label: 'Computer Networks' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: color }} />
          <span className="text-[11px] text-claro-text/90">{label}</span>
        </div>
      ))}
    </div>

    <div className="space-y-1.5 border-t border-claro-green/20 pt-2.5">
      {[
        { color: '#eab308', label: 'Active' },
        { color: '#22c55e', label: 'Mastered' },
        { color: '#ef4444', label: 'Struggling' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: color }} />
          <span className="text-[11px] text-claro-muted">{label}</span>
        </div>
      ))}
    </div>

    {/* Score ramp */}
    <div className="mt-2.5 space-y-1.5 border-t border-claro-green/20 pt-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-widest text-claro-muted">Score (when shown)</div>
      {SCORE_BANDS.slice(0, 4).map(b => (
        <div key={b.range} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-white/10" style={{ background: b.color }} />
          <span className="text-[10px] text-claro-muted">
            {b.range} · {b.label}
          </span>
        </div>
      ))}
    </div>

    <div className="mt-2 flex items-center gap-3 border-t border-claro-green/20 pt-2.5">
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
