import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, RequireAuth } from '../context/AuthContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'
import { resolvePersona } from '../data/personas.js'
import { buildSubjectCardsFromGraph, getStudentGraphSnapshot } from '../utils/studentGraphSnapshot.js'

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
      <LeafBackdrop className="min-h-screen bg-space-page">
        <div className="h-0.5 w-full" style={{ backgroundColor: persona.accentHex, opacity: 0.65 }} aria-hidden />
        <Navbar />
        <main className="pt-16 max-w-5xl mx-auto px-5 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-claro-text mb-1">
              Good morning, {user?.name}
            </h1>
            <p className="text-claro-muted text-base">{persona.tagline}</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {stats.map(s => (
              <div key={s.label} className="bg-claro-panel border border-claro-indigo/12 rounded-2xl p-6 shadow-sm">
                <p className="text-3xl font-semibold text-claro-text mb-1">{s.value}</p>
                <p className="text-sm font-medium text-claro-text">{s.label}</p>
                <p className="text-sm text-claro-muted mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <h2 className="text-lg font-semibold text-claro-text mb-2">Your courses</h2>
          <p className="text-sm text-claro-muted mb-5">Based on your knowledge graph.</p>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {courseCards.length === 0 && (
              <p className="text-sm text-claro-muted border border-claro-indigo/12 rounded-2xl px-5 py-6 bg-claro-panel/50">
                No subjects yet. Open <span className="text-claro-text">My Graph</span> to add concepts.
              </p>
            )}
            {courseCards.map(c => (
              <div key={c.slug} className={`bg-gradient-to-r ${c.color} border ${c.border} rounded-2xl p-5 flex items-center justify-between gap-6`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${c.accent} bg-claro-canvas/80 rounded px-2 py-0.5 border border-claro-indigo/10`}>{c.code}</span>
                  </div>
                  <h3 className="text-claro-text font-semibold text-lg mb-1">{c.title}</h3>
                  <p className="text-sm text-claro-muted mb-4">Next: {c.nextModule}</p>
                  <ProgressBar value={c.progress} progressGradient={c.progressGradient} />
                  <p className={`text-sm ${c.accent} mt-2`}>{c.progress}% complete · {c.modules} modules</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/student/reading/${c.slug}`)}
                  className="flex-shrink-0 min-h-touch rounded-xl border border-claro-indigo/40 bg-claro-indigo px-6 py-3 text-base font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
                >
                  Continue
                </button>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <h2 className="text-lg font-semibold text-claro-text mb-4">Recent activity</h2>
          <div className="bg-claro-panel border border-claro-indigo/12 rounded-2xl divide-y divide-claro-indigo/10">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 min-h-touch">
                {r.icon != null && r.icon !== '' && (
                  <span className="text-lg w-6 shrink-0 text-center" style={{ color: persona.accentHex }}>{r.icon}</span>
                )}
                <span className="text-base text-claro-text flex-1">{r.label}</span>
                <span className="text-sm text-claro-muted shrink-0">{r.time}</span>
              </div>
            ))}
          </div>
        </main>
      </LeafBackdrop>
    </RequireAuth>
  )
}
