import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'
import { ClaroLogoMark } from './brand/ClaroLogoMark.jsx'

const SUBJECT_STYLES = {
  python: {
    active: 'bg-claro-indigo/20 border-claro-indigo/55 text-claro-indigo',
    idle:   'bg-[#FDF6ED]/80 border-[#2D6A4F]/12 text-claro-muted hover:text-claro-text hover:border-[#2D6A4F]/28',
    dot:    'bg-claro-indigo',
  },
  dsa: {
    active: 'bg-[#2D6A4F]/15 border-[#2D6A4F]/45 text-[#1B4332]',
    idle:   'bg-[#FDF6ED]/80 border-[#2D6A4F]/12 text-claro-muted hover:text-claro-text hover:border-[#2D6A4F]/28',
    dot:    'bg-[#1a5f45]',
  },
  cn: {
    active: 'bg-claro-sage/20 border-claro-sage/50 text-claro-sage',
    idle:   'bg-[#FDF6ED]/80 border-[#2D6A4F]/12 text-claro-muted hover:text-claro-text hover:border-[#2D6A4F]/28',
    dot:    'bg-claro-sage',
  },
}

const TopBar = memo(({
  nodeCount,
  linkCount,
  isLive,
  toggleLive,
  resetStates,
  activeFilter,
  setSubjectFilter,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between
                       px-5 py-3 border-b border-[#2D6A4F]/12"
            style={{ background: 'rgba(253,246,237,0.92)', backdropFilter: 'blur(12px)' }}>

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#2D6A4F]/30 bg-gradient-to-br from-[#E8F0EB] to-white p-0.5 shadow-sm">
          <ClaroLogoMark size={30} />
        </div>
        <div>
          <div className="text-claro-text font-semibold text-sm leading-none">Claro</div>
          <div className="text-claro-muted text-[10px] mt-0.5 max-w-[14rem] leading-tight">
            Scores → diagnosis · Knowledge graph
          </div>
        </div>
      </div>

      {/* Subject filters */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-claro-muted uppercase tracking-wider mr-1">Focus</span>
        {Object.values(SUBJECTS).map(subj => {
          const styles = SUBJECT_STYLES[subj.id]
          const isActive = activeFilter === subj.id
          return (
            <button
              key={subj.id}
              onClick={() => setSubjectFilter(subj.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px]
                          font-medium transition-all ${isActive ? styles.active : styles.idle}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
              {subj.label}
            </button>
          )
        })}
      </div>

      {/* Stats + controls */}
      <div className="flex items-center gap-3">
        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-claro-muted border-r border-[#2D6A4F]/15 pr-3">
          <span><span className="text-claro-text font-medium">{nodeCount}</span> nodes</span>
          <span><span className="text-claro-text font-medium">{linkCount}</span> edges</span>
        </div>

        {/* Reset */}
        <button
          onClick={resetStates}
          className="px-3 py-1.5 rounded-lg border border-[#2D6A4F]/15 text-[11px] text-claro-muted
                     hover:text-claro-text hover:border-[#2D6A4F]/30 transition-all bg-[#FDF6ED]/60"
        >
          Reset
        </button>

        {/* Live toggle */}
        <button
          onClick={toggleLive}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px]
                      font-medium transition-all ${
                        isLive
                          ? 'bg-claro-amber/15 border-claro-amber/45 text-claro-amber'
                          : 'bg-[#FDF6ED]/70 border-[#2D6A4F]/12 text-claro-muted hover:text-claro-text hover:border-[#2D6A4F]/28'
                      }`}
        >
          {isLive && <span className="live-pulse w-1.5 h-1.5 rounded-full bg-claro-amber" />}
          {isLive ? 'Live' : 'Simulate'}
        </button>
      </div>
    </header>
  )
})

TopBar.displayName = 'TopBar'
export default TopBar
