import { memo } from 'react'

const Legend = memo(() => (
  <div className="absolute bottom-6 left-5 z-20 pointer-events-none"
       style={{ background: 'rgba(17,14,26,0.9)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 16px' }}>
    <div className="text-[10px] font-semibold uppercase tracking-widest text-claro-muted mb-3">Legend</div>

    {/* Subjects */}
    <div className="space-y-1.5 mb-3">
      {[
        { color: '#C4B5FF', label: 'Python Programming' },
        { color: '#D4B8FF', label: 'DS & Algorithms' },
        { color: '#8EE4D2', label: 'Computer Networks' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-[11px] text-claro-text/90">{label}</span>
        </div>
      ))}
    </div>

    <div className="border-t border-white/5 pt-2.5 space-y-1.5">
      {[
        { color: '#FFD6A8', label: 'Active' },
        { color: '#9EE4D4', label: 'Mastered' },
        { color: '#FFB8C8', label: 'Struggling' },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-[11px] text-claro-muted">{label}</span>
        </div>
      ))}
    </div>

    {/* Node size hint */}
    <div className="border-t border-white/5 pt-2.5 mt-2 flex items-center gap-3">
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
