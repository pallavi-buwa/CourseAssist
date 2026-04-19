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
    color: 'from-[#f4ebe3]/95 to-[#ead8c8]/40',
    border: 'border-[#a16207]/30',
    accent: '#a16207',
  },
  {
    id: 'strategy',
    title: 'Business Strategy',
    code: 'MBA 605',
    students: 38,
    avgComprehension: 0.74,
    weakConcepts: ['Porter\'s Five Forces'],
    trend: 'improving',
    color: 'from-[#E8F0EB]/95 to-[#d4e8dc]/50',
    border: 'border-[#2D6A4F]/28',
    accent: '#2D6A4F',
  },
  {
    id: 'operations',
    title: 'Operations Management',
    code: 'MBA 606',
    students: 44,
    avgComprehension: 0.68,
    weakConcepts: ['Supply Chain Optimization'],
    trend: 'stable',
    color: 'from-[#eef6f0]/95 to-[#e0ebe4]/50',
    border: 'border-[#1a5f45]/28',
    accent: '#1a5f45',
  },
]

function HealthBar({ value, accent }) {
  return (
    <div className="w-full h-1.5 bg-[#E8F0EB] rounded-full overflow-hidden border border-[#2D6A4F]/12">
      <div className="h-full rounded-full" style={{ width: `${value * 100}%`, background: accent, transition: 'width 1s ease' }} />
    </div>
  )
}

function TrendBadge({ trend }) {
  const map = {
    declining:  { text: '↓ Declining',  cls: 'text-[#78350f] bg-[#78350f]/10 border-[#78350f]/22' },
    improving:  { text: '↑ Improving',  cls: 'text-[#14532d] bg-[#14532d]/10 border-[#14532d]/22' },
    stable:     { text: '→ Stable',     cls: 'text-claro-muted bg-[#E8F0EB] border-[#2D6A4F]/15' },
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
              <div key={s.label} className="bg-[#FFFCF7] border border-[#2D6A4F]/12 rounded-2xl p-4 shadow-sm">
                <p className={`text-2xl font-semibold mb-0.5 ${s.alert ? 'text-[#78350f]' : 'text-claro-text'}`}>{s.value}</p>
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
                      <span className="text-[10px] text-claro-muted bg-[#FDF6ED]/90 border border-[#2D6A4F]/10 rounded px-1.5 py-0.5">{c.code}</span>
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
                          <span key={w} className="text-[10px] text-[#78350f] bg-[#78350f]/10 border border-[#78350f]/22 rounded px-1.5 py-0.5">{w}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/professor/dashboard/${c.id}`)}
                      className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl px-5 py-2 text-sm font-medium transition-colors border border-[#2D6A4F]/35 shadow-sm whitespace-nowrap"
                    >
                      Open dashboard →
                    </button>
                    <button
                      onClick={() => navigate('/professor/analyzer')}
                      className="border border-[#2D6A4F]/25 text-[#5C6B63] hover:text-[#1B4332] hover:border-[#2D6A4F]/45 rounded-xl px-5 py-2 text-sm transition-colors text-center bg-[#FFFCF7]"
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
