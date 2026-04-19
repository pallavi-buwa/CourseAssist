import { memo } from 'react'

const Breadcrumb = memo(({ breadcrumbs, onBack, onReset, level }) => {
  if (level === 0) return null

  return (
    <div className="absolute top-[62px] left-5 z-20 flex items-center gap-1.5 pointer-events-auto">
      {/* Home / Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px]
                   text-slate-400 hover:text-white border border-white/8 hover:border-white/20
                   transition-all"
        style={{ background: 'rgba(13,13,20,0.85)', backdropFilter: 'blur(8px)' }}
      >
        ⌂ Overview
      </button>

      {breadcrumbs.map((crumb, i) => (
        <div key={crumb.id} className="flex items-center gap-1.5">
          <span className="text-slate-600 text-[10px]">›</span>
          <span
            className={`px-2.5 py-1.5 rounded-lg text-[11px] border transition-all
              ${i === breadcrumbs.length - 1
                ? 'text-white border-white/20 bg-white/8'
                : 'text-slate-400 border-white/8 bg-transparent'
              }`}
            style={{ backdropFilter: 'blur(8px)' }}
          >
            {crumb.label}
          </span>
        </div>
      ))}

      {/* Back button */}
      <button
        onClick={onBack}
        className="ml-1 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px]
                   text-slate-400 hover:text-white border border-white/8 hover:border-white/20
                   transition-all"
        style={{ background: 'rgba(13,13,20,0.85)', backdropFilter: 'blur(8px)' }}
      >
        ← Back
      </button>
    </div>
  )
})

Breadcrumb.displayName = 'Breadcrumb'
export default Breadcrumb
