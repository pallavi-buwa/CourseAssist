import { useNavigate } from 'react-router-dom'
import { useAuth, RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'

const COURSES = [
  {
    id: 'ai-for-business',
    title: 'AI for Business Decisions',
    code: 'MBA 601',
    progress: 72,
    modules: 8,
    nextModule: 'Module 5 — Predictive Analytics',
    color: 'from-[#E8F0EB]/95 to-[#d8eadc]/55 dark:from-claro-slate/50 dark:to-claro-panel/35',
    border: 'border-claro-indigo/28',
    accent: 'text-claro-indigo',
    progressGradient: 'from-[#22c55e] to-[#4ade80]',
    moduleId: 'module-ai-1',
  },
  {
    id: 'strategic-management',
    title: 'Strategic Management',
    code: 'MBA 602',
    progress: 58,
    modules: 10,
    nextModule: 'Module 7 — Competitive Strategy',
    color: 'from-[#e8f2ea]/90 to-[#dceee0]/50 dark:from-claro-slate/45 dark:to-claro-panel/30',
    border: 'border-claro-indigo/30',
    accent: 'text-claro-indigo',
    progressGradient: 'from-[#16a34a] to-[#22c55e]',
    moduleId: 'module-strat-1',
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    code: 'MBA 603',
    progress: 41,
    modules: 9,
    nextModule: 'Module 4 — Pitching & Fundraising',
    color: 'from-[#f4ebe3]/95 to-[#e8dcc8]/45 dark:from-claro-slate/40 dark:to-claro-panel/25',
    border: 'border-claro-amber/32',
    accent: 'text-claro-coral',
    progressGradient: 'from-[#eab308] to-[#ef4444]',
    moduleId: 'module-ent-1',
  },
]

const RECENT = [
  { label: 'Read Module 3 — Decision Frameworks', time: '2h ago' },
  { label: 'Answered 4 micro-checks in Strategic Mgmt', time: 'Yesterday' },
  { label: 'Added note on Risk Assessment', time: '2d ago' },
]

function ProgressBar({ value, progressGradient }) {
  return (
    <div className="w-full h-1.5 bg-claro-slate rounded-full overflow-hidden border border-claro-indigo/12">
      <div className={`h-full rounded-full bg-gradient-to-r ${progressGradient}`}
           style={{ width: `${value}%`, transition: 'width 1s ease' }} />
    </div>
  )
}

export default function StudentHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <RequireAuth role="student">
      <LeafBackdrop className="min-h-screen bg-space-page">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-claro-text mb-1">
              Good morning, {user?.name}
            </h1>
            <p className="text-claro-muted text-sm">Pick up where you left off.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Concepts Mastered', value: '47', sub: 'out of 90 total' },
              { label: 'Avg Accuracy', value: '73%', sub: 'across all courses' },
              { label: 'Streak', value: '6 days', sub: 'keep it up!' },
            ].map(s => (
              <div key={s.label} className="bg-claro-panel border border-claro-indigo/12 rounded-2xl p-5 shadow-sm">
                <p className="text-2xl font-semibold text-claro-text mb-0.5">{s.value}</p>
                <p className="text-xs font-medium text-claro-text/85">{s.label}</p>
                <p className="text-[11px] text-claro-muted mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <h2 className="text-sm font-medium text-claro-muted uppercase tracking-wider mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {COURSES.map(c => (
              <div key={c.id} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5 flex items-center justify-between gap-6`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium ${c.accent} bg-claro-canvas/80 rounded px-1.5 py-0.5 border border-claro-indigo/10`}>{c.code}</span>
                  </div>
                  <h3 className="text-claro-text font-medium text-base mb-1">{c.title}</h3>
                  <p className="text-xs text-claro-muted mb-3">Next: {c.nextModule}</p>
                  <ProgressBar value={c.progress} progressGradient={c.progressGradient} />
                  <p className={`text-[11px] ${c.accent} mt-1`}>{c.progress}% complete · {c.modules} modules</p>
                </div>
                <button
                  onClick={() => navigate(`/student/reading/${c.moduleId}`)}
                  className="flex-shrink-0 rounded-xl border border-claro-indigo/40 bg-claro-indigo px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <h2 className="text-sm font-medium text-claro-muted uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="bg-claro-panel border border-claro-indigo/12 rounded-2xl divide-y divide-claro-indigo/10">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-sm text-claro-text/90 flex-1">{r.label}</span>
                <span className="text-xs text-claro-muted">{r.time}</span>
              </div>
            ))}
          </div>
        </main>
      </LeafBackdrop>
    </RequireAuth>
  )
}
