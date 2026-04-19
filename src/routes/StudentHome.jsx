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
    color: 'from-indigo-600/20 to-purple-600/20',
    border: 'border-indigo-600/30',
    accent: 'text-indigo-400',
    moduleId: 'module-ai-1',
  },
  {
    id: 'strategic-management',
    title: 'Strategic Management',
    code: 'MBA 602',
    progress: 58,
    modules: 10,
    nextModule: 'Module 7 — Competitive Strategy',
    color: 'from-cyan-600/20 to-blue-600/20',
    border: 'border-cyan-600/30',
    accent: 'text-cyan-400',
    moduleId: 'module-strat-1',
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    code: 'MBA 603',
    progress: 41,
    modules: 9,
    nextModule: 'Module 4 — Pitching & Fundraising',
    color: 'from-amber-600/20 to-orange-600/20',
    border: 'border-amber-600/30',
    accent: 'text-amber-400',
    moduleId: 'module-ent-1',
  },
]

const RECENT = [
  { label: 'Read Module 3 — Decision Frameworks', time: '2h ago', icon: '◈' },
  { label: 'Answered 4 micro-checks in Strategic Mgmt', time: 'Yesterday', icon: '✓' },
  { label: 'Added note on Risk Assessment', time: '2d ago', icon: '✎' },
]

function ProgressBar({ value, accent }) {
  return (
    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full bg-gradient-to-r ${accent === 'text-indigo-400' ? 'from-indigo-500 to-purple-500' : accent === 'text-cyan-400' ? 'from-cyan-500 to-blue-500' : 'from-amber-500 to-orange-500'}`}
           style={{ width: `${value}%`, transition: 'width 1s ease' }} />
    </div>
  )
}

export default function StudentHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-1">
              Good morning, {user?.name} 👋
            </h1>
            <p className="text-gray-500 text-sm">Pick up where you left off.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Concepts Mastered', value: '47', sub: 'out of 90 total' },
              { label: 'Avg Accuracy', value: '73%', sub: 'across all courses' },
              { label: 'Streak', value: '6 days', sub: 'keep it up!' },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-2xl font-semibold text-white mb-0.5">{s.value}</p>
                <p className="text-xs font-medium text-gray-300">{s.label}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Your Courses</h2>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {COURSES.map(c => (
              <div key={c.id} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5 flex items-center justify-between gap-6`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-medium ${c.accent} bg-white/5 rounded px-1.5 py-0.5`}>{c.code}</span>
                  </div>
                  <h3 className="text-white font-medium text-base mb-1">{c.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">Next: {c.nextModule}</p>
                  <ProgressBar value={c.progress} accent={c.accent} />
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
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Recent Activity</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl divide-y divide-gray-800">
            {RECENT.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-indigo-400 text-base w-5 text-center">{r.icon}</span>
                <span className="text-sm text-gray-300 flex-1">{r.label}</span>
                <span className="text-xs text-gray-600">{r.time}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
