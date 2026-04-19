import { useNavigate } from 'react-router-dom'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'

const COURSES = [
  {
    id: 'marketing',
    title: 'Marketing Management',
    code: 'MBA 604',
    students: 50,
    avgComprehension: 0.61,
    weakConcepts: ['Positioning', 'Consumer Behavior', 'Marketing Analytics'],
    trend: 'declining',
    color: 'from-rose-600/15 to-pink-600/15',
    border: 'border-rose-600/25',
    accent: '#f87171',
  },
  {
    id: 'strategy',
    title: 'Business Strategy',
    code: 'MBA 605',
    students: 38,
    avgComprehension: 0.74,
    weakConcepts: ['Porter\'s Five Forces'],
    trend: 'improving',
    color: 'from-emerald-600/15 to-teal-600/15',
    border: 'border-emerald-600/25',
    accent: '#34d399',
  },
  {
    id: 'operations',
    title: 'Operations Management',
    code: 'MBA 606',
    students: 44,
    avgComprehension: 0.68,
    weakConcepts: ['Supply Chain Optimization'],
    trend: 'stable',
    color: 'from-blue-600/15 to-indigo-600/15',
    border: 'border-blue-600/25',
    accent: '#60a5fa',
  },
]

function HealthBar({ value, accent }) {
  return (
    <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: accent, transition: 'width 1s ease' }} />
    </div>
  )
}

function TrendBadge({ trend }) {
  const map = {
    declining:  { text: '↓ Declining',  cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
    improving:  { text: '↑ Improving',  cls: 'text-green-400 bg-green-500/10 border-green-500/20' },
    stable:     { text: '→ Stable',     cls: 'text-gray-400 bg-gray-800 border-gray-700' },
  }
  const { text, cls } = map[trend] || map.stable
  return <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cls}`}>{text}</span>
}

export default function ProfessorHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const totalStudents = COURSES.reduce((s, c) => s + c.students, 0)
  const avgHealth = (COURSES.reduce((s, c) => s + c.avgComprehension, 0) / COURSES.length * 100).toFixed(0)

  return (
    <RequireAuth role="professor">
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-1">
              Welcome back, Prof. {user?.name}
            </h1>
            <p className="text-gray-500 text-sm">Here's how your cohorts are performing today.</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Students', value: totalStudents },
              { label: 'Active Courses', value: COURSES.length },
              { label: 'Avg Comprehension', value: `${avgHealth}%` },
              { label: 'Alerts', value: '5', alert: true },
            ].map(s => (
              <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className={`text-2xl font-semibold mb-0.5 ${s.alert ? 'text-red-400' : 'text-white'}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Course cards */}
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Your Courses</h2>
          <div className="space-y-4">
            {COURSES.map(c => (
              <div key={c.id} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-gray-400 bg-white/5 rounded px-1.5 py-0.5">{c.code}</span>
                      <TrendBadge trend={c.trend} />
                    </div>
                    <h3 className="text-white font-medium text-base mb-1">{c.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{c.students} students enrolled</p>

                    {/* Health bar */}
                    <div className="mb-1.5">
                      <HealthBar value={c.avgComprehension} accent={c.accent} />
                    </div>
                    <p className="text-xs text-gray-500">{Math.round(c.avgComprehension * 100)}% avg comprehension</p>

                    {/* Weak concepts */}
                    {c.weakConcepts.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        <span className="text-[10px] text-gray-600">Struggling:</span>
                        {c.weakConcepts.map(w => (
                          <span key={w} className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 rounded px-1.5 py-0.5">{w}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/professor/dashboard/${c.id}`)}
                      className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-5 py-2 text-sm font-medium transition-colors border border-white/10 whitespace-nowrap"
                    >
                      Open dashboard →
                    </button>
                    <button
                      onClick={() => navigate('/professor/analyzer')}
                      className="border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl px-5 py-2 text-sm transition-colors text-center"
                    >
                      Analyze material
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </RequireAuth>
  )
}
