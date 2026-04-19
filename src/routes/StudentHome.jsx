import { useNavigate } from 'react-router-dom'
import { useAuth, RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const COURSES = [
  {
    id: 'ai-for-business',
    title: 'AI for Business Decisions',
    code: 'MBA 601',
    progress: 72,
    modules: 8,
    nextModule: 'Module 5 — Predictive Analytics',
    color: 'from-[#C4B5FF]/24 to-[#D4B8FF]/18',
    border: 'border-claro-indigo/35',
    accent: 'text-claro-indigo',
    progressGradient: 'from-[#C4B5FF] to-[#D4B8FF]',
    moduleId: 'module-ai-1',
  },
  {
    id: 'strategic-management',
    title: 'Strategic Management',
    code: 'MBA 602',
    progress: 58,
    modules: 10,
    nextModule: 'Module 7 — Competitive Strategy',
    color: 'from-claro-sage/20 to-claro-indigo/15',
    border: 'border-claro-sage/35',
    accent: 'text-claro-sage',
    progressGradient: 'from-claro-sage to-claro-indigo',
    moduleId: 'module-strat-1',
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    code: 'MBA 603',
    progress: 41,
    modules: 9,
    nextModule: 'Module 4 — Pitching & Fundraising',
    color: 'from-claro-amber/22 to-orange-600/15',
    border: 'border-claro-amber/35',
    accent: 'text-claro-amber',
    progressGradient: 'from-claro-amber to-orange-600',
    moduleId: 'module-ent-1',
  },
]

const RECENT = [
  { label: 'Read Module 3 — Decision Frameworks', time: '2h ago', icon: '◈' },
  { label: 'Answered 4 micro-checks in Strategic Mgmt', time: 'Yesterday', icon: '✓' },
  { label: 'Added note on Risk Assessment', time: '2d ago', icon: '✎' },
]

function ProgressBar({ value, progressGradient }) {
  return (
    <div className="w-full h-1.5 bg-claro-midnight rounded-full overflow-hidden border border-white/5">
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
      <div className="min-h-screen bg-claro-midnight">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-claro-text mb-1">
              Good morning, {user?.name} 👋
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
              <div key={s.label} className="bg-claro-slate border border-white/8 rounded-2xl p-5">
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
                    <span className={`text-[10px] font-medium ${c.accent} bg-white/5 rounded px-1.5 py-0.5`}>{c.code}</span>
                  </div>
                  <h3 className="text-claro-text font-medium text-base mb-1">{c.title}</h3>
                  <p className="text-xs text-claro-muted mb-3">Next: {c.nextModule}</p>
                  <ProgressBar value={c.progress} progressGradient={c.progressGradient} />
                  <p className={`text-[11px] ${c.accent} mt-1`}>{c.progress}% complete · {c.modules} modules</p>
                </div>
                <button
                  onClick={() => navigate(`/student/reading/${c.moduleId}`)}
                  className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white rounded-xl px-5 py-2 text-sm font-medium transition-colors border border-white/10"
                >
                  Continue →
                </button>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <h2 className="text-sm font-medium text-claro-muted uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="bg-claro-slate border border-white/8 rounded-2xl divide-y divide-white/10">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-claro-indigo text-base w-5 text-center">{r.icon}</span>
                <span className="text-sm text-claro-text/90 flex-1">{r.label}</span>
                <span className="text-xs text-claro-muted">{r.time}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
