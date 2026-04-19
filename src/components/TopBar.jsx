import { memo } from 'react'
import { SUBJECTS } from '../data/graphData.js'

const SUBJECT_STYLES = {
  python: {
    active: 'bg-blue-500/20 border-blue-400/60 text-blue-300',
    idle:   'bg-white/3 border-white/8 text-slate-400 hover:text-slate-200 hover:border-white/20',
    dot:    'bg-blue-400',
  },
  dsa: {
    active: 'bg-purple-500/20 border-purple-400/60 text-purple-300',
    idle:   'bg-white/3 border-white/8 text-slate-400 hover:text-slate-200 hover:border-white/20',
    dot:    'bg-purple-400',
  },
  cn: {
    active: 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300',
    idle:   'bg-white/3 border-white/8 text-slate-400 hover:text-slate-200 hover:border-white/20',
    dot:    'bg-emerald-400',
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
            style={{ background: 'rgba(13,13,20,0.85)', backdropFilter: 'blur(12px)' }}>

      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600
                        flex items-center justify-center text-white text-xs font-bold">
          CA
        </div>
        <div>
          <div className="text-white font-semibold text-sm leading-none">CourseAssist</div>
          <div className="text-slate-500 text-[10px] mt-0.5">Knowledge Graph · CS</div>
        </div>
      </div>

      {/* Subject filters */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider mr-1">Focus</span>
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
        <div className="flex items-center gap-4 text-xs text-slate-400 border-r border-white/8 pr-3">
          <span><span className="text-white font-medium">{nodeCount}</span> nodes</span>
          <span><span className="text-white font-medium">{linkCount}</span> edges</span>
        </div>

        {/* Reset */}
        <button
          onClick={resetStates}
          className="px-3 py-1.5 rounded-lg border border-white/8 text-[11px] text-slate-400
                     hover:text-white hover:border-white/20 transition-all"
        >
          Reset
        </button>

        {/* Live toggle */}
        <button
          onClick={toggleLive}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px]
                      font-medium transition-all ${
                        isLive
                          ? 'bg-yellow-500/15 border-yellow-400/40 text-yellow-300'
                          : 'bg-white/3 border-white/8 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
        >
          {isLive && <span className="live-pulse w-1.5 h-1.5 rounded-full bg-yellow-400" />}
          {isLive ? 'Live' : 'Simulate'}
        </button>
      </div>
    </header>
  )
})

TopBar.displayName = 'TopBar'
export default TopBar
