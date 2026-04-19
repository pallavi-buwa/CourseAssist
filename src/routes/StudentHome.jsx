import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { resolvePersona } from '../data/personas.js'
import { buildSubjectCardsFromGraph, getStudentGraphSnapshot } from '../utils/studentGraphSnapshot.js'

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
  const persona = useMemo(() => resolvePersona(user?.email, 'student'), [user?.email])
  const courseCards = useMemo(
    () => buildSubjectCardsFromGraph(getStudentGraphSnapshot(user?.email)),
    [user?.email],
  )
  const stats = persona.stats || [
    { label: 'Concepts Mastered', value: '47', sub: 'out of 90 total' },
    { label: 'Avg Accuracy', value: '73%', sub: 'across all courses' },
    { label: 'Streak', value: '6 days', sub: 'keep it up!' },
  ]
  const recent = persona.recentActivity || RECENT

  return (
    <RequireAuth role="student">
      <div className="min-h-screen bg-claro-midnight">
        <div className="h-0.5 w-full" style={{ backgroundColor: persona.accentHex, opacity: 0.65 }} aria-hidden />
        <Navbar />
        <main className="pt-14 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-claro-text mb-1">
              Good morning, {user?.name} 👋
            </h1>
            <p className="text-claro-muted text-sm">{persona.tagline}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-claro-slate border border-white/8 rounded-2xl p-5">
                <p className="text-2xl font-semibold text-claro-text mb-0.5">{s.value}</p>
                <p className="text-xs font-medium text-claro-text/85">{s.label}</p>
                <p className="text-[11px] text-claro-muted mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <h2 className="text-sm font-medium text-claro-muted uppercase tracking-wider mb-4">Your courses</h2>
          <p className="text-[11px] text-claro-muted mb-3 -mt-2">Titles come from your knowledge graph, so they stay in sync when the graph changes.</p>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {courseCards.length === 0 && (
              <p className="text-sm text-claro-muted border border-white/10 rounded-2xl px-5 py-6 bg-claro-slate/50">
                No subjects found on your knowledge graph yet. Open <span className="text-claro-text">My Graph</span> and add concepts (or sign in again) to populate courses here.
              </p>
            )}
            {courseCards.map(c => (
              <div key={c.slug} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5 flex items-center justify-between gap-6`}>
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
                  onClick={() => navigate(`/student/reading/${c.slug}`)}
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
            {recent.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <span className="text-claro-indigo text-base w-5 text-center" style={{ color: persona.accentHex }}>{r.icon}</span>
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
