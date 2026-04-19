import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const SUBJECT_STYLES = {
  python: {
    active: 'bg-claro-indigo/20 border-claro-indigo/55 text-claro-indigo',
    idle:   'bg-white/3 border-white/8 text-claro-muted hover:text-claro-text hover:border-white/20',
    dot:    'bg-claro-indigo',
  },
  dsa: {
    active: 'bg-[#D4B8FF]/22 border-[#D4B8FF]/45 text-[#EDE5FF]',
    idle:   'bg-white/3 border-white/8 text-claro-muted hover:text-claro-text hover:border-white/20',
    dot:    'bg-[#D4B8FF]',
  },
  cn: {
    active: 'bg-claro-sage/20 border-claro-sage/50 text-claro-sage',
    idle:   'bg-white/3 border-white/8 text-claro-muted hover:text-claro-text hover:border-white/20',
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
                       px-5 py-3 border-b border-white/5"
            style={{ background: 'rgba(17,14,26,0.92)', backdropFilter: 'blur(12px)' }}>

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-claro-indigo to-[#D4B8FF]
                        flex items-center justify-center text-white text-xs font-bold">
          C
        </div>
        <div>
          <div className="text-claro-text font-semibold text-sm leading-none">Claro</div>
          <div className="text-claro-muted text-[10px] mt-0.5">Knowledge Graph · CS</div>
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
        <div className="flex items-center gap-4 text-xs text-claro-muted border-r border-white/8 pr-3">
          <span><span className="text-claro-text font-medium">{nodeCount}</span> nodes</span>
          <span><span className="text-claro-text font-medium">{linkCount}</span> edges</span>
        </div>

        {/* Reset */}
        <button
          onClick={resetStates}
          className="px-3 py-1.5 rounded-lg border border-white/8 text-[11px] text-claro-muted
                     hover:text-claro-text hover:border-white/20 transition-all"
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
                          : 'bg-white/3 border-white/8 text-claro-muted hover:text-claro-text hover:border-white/20'
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
