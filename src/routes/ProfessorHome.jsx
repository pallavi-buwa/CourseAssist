import { useNavigate } from 'react-router-dom'
import { RequireAuth, useAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'

const COURSES = [
  {
    id: 'marketing',
    title: 'Marketing Management',
    code: 'MBA 604',
    students: 50,
    avgComprehension: 0.61,
    weakConcepts: ['Positioning', 'Consumer Behavior', 'Marketing Analytics'],
    trend: 'declining',
    color: 'from-[#f4ebe3]/95 to-[#ead8c8]/40 dark:from-claro-slate/40 dark:to-claro-panel/25',
    border: 'border-claro-amber/30',
    accent: 'rgb(var(--tw-claro-amber))',
  },
  {
    id: 'strategy',
    title: 'Business Strategy',
    code: 'MBA 605',
    students: 38,
    avgComprehension: 0.74,
    weakConcepts: ['Porter\'s Five Forces'],
    trend: 'improving',
    color: 'from-[#E8F0EB]/95 to-[#d4e8dc]/50 dark:from-claro-slate/50 dark:to-claro-panel/35',
    border: 'border-claro-indigo/28',
    accent: 'rgb(var(--tw-claro-indigo))',
  },
  {
    id: 'operations',
    title: 'Operations Management',
    code: 'MBA 606',
    students: 44,
    avgComprehension: 0.68,
    weakConcepts: ['Supply Chain Optimization'],
    trend: 'stable',
    color: 'from-[#eef6f0]/95 to-[#e0ebe4]/50 dark:from-claro-slate/45 dark:to-claro-panel/30',
    border: 'border-claro-indigo/28',
    accent: 'rgb(var(--tw-claro-sage))',
  },
]

function HealthBar({ value, accent }) {
  return (
    <div className="w-full h-1.5 bg-claro-slate rounded-full overflow-hidden border border-claro-indigo/12">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: accent, transition: 'width 1s ease' }} />
    </div>
  )
}

function TrendBadge({ trend }) {
  const map = {
    declining:  { text: 'Declining',  cls: 'text-claro-coral bg-claro-coral/10 border-claro-coral/25' },
    improving:  { text: 'Improving',  cls: 'text-claro-indigo bg-claro-indigo/10 border-claro-indigo/22' },
    stable:     { text: 'Stable',     cls: 'text-claro-muted bg-claro-slate border-claro-indigo/15' },
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
      <LeafBackdrop className="min-h-screen bg-claro-midnight">
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-claro-text mb-1">
              Welcome back, Prof. {user?.name}
            </h1>
            <p className="text-claro-muted text-sm">Here's how your cohorts are performing today.</p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Students', value: totalStudents },
              { label: 'Active Courses', value: COURSES.length },
              { label: 'Avg Comprehension', value: `${avgHealth}%` },
              { label: 'Alerts', value: '5', alert: true },
            ].map(s => (
              <div key={s.label} className="bg-claro-panel border border-claro-indigo/12 rounded-2xl p-4 shadow-sm">
                <p className={`text-2xl font-semibold mb-0.5 ${s.alert ? 'text-claro-coral' : 'text-claro-text'}`}>{s.value}</p>
                <p className="text-xs text-claro-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Course cards */}
          <h2 className="text-sm font-medium text-claro-muted uppercase tracking-wider mb-4">Your Courses</h2>
          <div className="space-y-4">
            {COURSES.map(c => (
              <div key={c.id} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5`}>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] text-claro-muted bg-claro-canvas/90 border border-claro-indigo/10 rounded px-1.5 py-0.5">{c.code}</span>
                      <TrendBadge trend={c.trend} />
                    </div>
                    <h3 className="text-claro-text font-medium text-base mb-1">{c.title}</h3>
                    <p className="text-xs text-claro-muted mb-3">{c.students} students enrolled</p>

                    {/* Health bar */}
                    <div className="mb-1.5">
                      <HealthBar value={c.avgComprehension} accent={c.accent} />
                    </div>
                    <p className="text-xs text-claro-muted">{Math.round(c.avgComprehension * 100)}% avg comprehension</p>

                    {/* Weak concepts */}
                    {c.weakConcepts.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        <span className="text-[10px] text-claro-muted/80">Struggling:</span>
                        {c.weakConcepts.map(w => (
                          <span key={w} className="text-[10px] text-claro-coral bg-claro-coral/10 border border-claro-coral/22 rounded px-1.5 py-0.5">{w}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/professor/dashboard/${c.id}`)}
                      className="whitespace-nowrap rounded-xl border border-claro-indigo/35 bg-claro-indigo px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
                    >
                      Open dashboard
                    </button>
                    <button
                      onClick={() => navigate('/professor/analyzer')}
                      className="border border-claro-indigo/25 text-claro-muted hover:text-claro-text hover:border-claro-indigo/45 rounded-xl px-5 py-2 text-sm transition-colors text-center bg-claro-panel"
                    >
                      Analyze material
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </LeafBackdrop>
    </RequireAuth>
  )
}
