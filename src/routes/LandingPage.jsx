import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { ClaroLogoMark } from '../components/brand/ClaroLogoMark.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [show, setShow] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setShow(true)) }, [])

  const goProf = () => {
    login('demo@university.edu', 'professor')
    navigate('/professor/home')
  }
  const goStudent = () => {
    const u = login('demo@university.edu', 'student')
    u.preferencesComplete = true
    localStorage.setItem('eg_user', JSON.stringify(u))
    window.location.href = '/student/home'
  }

  const fade = d => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(16px)',
    transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  })

  return (
    <LeafBackdrop className="min-h-screen bg-space-page">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-claro-indigo/20 bg-claro-panel">
        <div className="mx-auto flex h-16 min-h-touch max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <ClaroLogoMark size={34} />
            <span className="hidden text-sm text-claro-muted sm:block">From grades to why</span>
          </div>
          <div className="flex items-center gap-2">
            <LandingButton label="Student demo" onClick={goStudent} ghost />
            <LandingButton label="Professor demo" onClick={goProf} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <section className="rounded-2xl border border-claro-indigo/20 bg-claro-panel p-8 sm:p-12">
          <p className="text-sm font-medium text-claro-indigo" style={fade(0)}>
            JHU Product Hackathon 2026
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-claro-text sm:text-5xl" style={fade(0.1)}>
            Your LMS gives you the grade.
          </h1>
          <h1 className="mt-1 text-4xl font-semibold leading-tight tracking-tight text-claro-indigo sm:text-5xl" style={fade(0.2)}>
            We make it clear.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-claro-muted" style={fade(0.3)}>
            AI that turns quiz scores into diagnoses: prerequisite gaps, language barriers, and predicted exam outcomes, so professors can intervene before students fail.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" style={fade(0.4)}>
            <LandingCta label="Professor demo" onClick={goProf} />
            <LandingCta label="Student demo" onClick={goStudent} ghost />
          </div>
        </section>

        <section className="mt-10">
          <p className="mb-3 text-sm font-medium text-claro-muted">The difference</p>
          <div className="grid overflow-hidden rounded-2xl border border-claro-indigo/20 bg-claro-panel md:grid-cols-2">
            <div className="border-b border-claro-indigo/15 p-8 md:border-b-0 md:border-r">
              <p className="text-sm font-medium text-claro-muted">Your LMS today</p>
              <p className="mt-4 text-6xl font-semibold text-claro-muted/70">45%</p>
              <p className="mt-2 text-sm text-claro-muted">Marcus Williams, Quiz 3</p>
            </div>
            <div className="p-8">
              <p className="text-sm font-medium text-claro-indigo">With Claro</p>
              <p className="mt-4 text-base leading-relaxed text-claro-text/90">
                Failed due to a <span className="font-semibold text-claro-indigo">Week 3 prerequisite gap</span>, not Week 7 content.
                Same root cause in <span className="font-semibold text-claro-indigo">14 students</span>.
                Q3 phrasing is filtering non-native speakers.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <p className="mb-2 text-sm font-medium text-claro-muted">How it works</p>
          <h2 className="mb-6 max-w-2xl text-2xl font-semibold tracking-tight text-claro-text sm:text-3xl">
            Paste your syllabus. Watch your course come alive.
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { n: '01', t: 'The graph appears', b: "Paste your syllabus. AI extracts concepts and maps dependencies." },
              { n: '02', t: 'Exam data lights it up', b: 'Import quiz results from your LMS and see exactly where your class is stuck.' },
              { n: '03', t: 'Click to diagnose', b: 'See concept gap, language barrier, missing prerequisite, plus a short intervention.' },
              { n: '04', t: 'Predict the future', b: 'Paste your upcoming midterm and preview likely outcomes before students sit down.' },
            ].map((c) => (
              <LandingCard key={c.n} {...c} />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-claro-indigo/20 bg-claro-panel p-6 sm:p-8">
          <p className="text-sm font-medium text-claro-indigo">The AI</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-claro-text sm:text-3xl">
            Analytical, not conversational.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { l: 'Comprehension decomposition', b: 'Turns "45%" into root causes that instructors can act on quickly.' },
              { l: 'Material analysis', b: 'Flags wording in exam prompts that creates hidden comprehension barriers.' },
              { l: 'Exam prediction', b: 'Predicts where students are likely to fail before the exam is delivered.' },
            ].map(c => (
              <div key={c.l} className="rounded-xl border border-claro-indigo/15 bg-claro-canvas/60 p-5">
                <p className="text-sm font-medium text-claro-indigo">{c.l}</p>
                <p className="mt-2 text-sm leading-relaxed text-claro-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-claro-indigo/20 bg-claro-panel p-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-claro-text sm:text-4xl">Your LMS gives you the grade.</h2>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-claro-indigo sm:text-4xl">We make it clear.</h2>
          <p className="mt-3 text-lg text-claro-muted">Now I see.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LandingCta label="Professor demo" onClick={goProf} />
            <LandingCta label="Student demo" onClick={goStudent} ghost />
          </div>
        </section>
      </main>
    </LeafBackdrop>
  )
}

function LandingButton({ label, onClick, ghost }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-touch rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
        ghost
          ? 'border border-claro-indigo/25 text-claro-muted hover:border-claro-indigo/40 hover:text-claro-text'
          : 'bg-claro-indigo text-white hover:brightness-110'
      }`}
    >
      {label}
    </button>
  )
}

function LandingCta({ label, onClick, ghost }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-touch rounded-xl px-6 py-3 text-base font-medium transition-colors ${
        ghost
          ? 'border border-claro-indigo/30 text-claro-text hover:border-claro-indigo/50'
          : 'bg-claro-indigo text-white hover:brightness-110'
      }`}
    >
      {label}
    </button>
  )
}

function LandingCard({ n, t, b }) {
  return (
    <div className="rounded-xl border border-claro-indigo/15 bg-claro-panel p-6">
      <p className="text-sm font-medium text-claro-indigo">{n}</p>
      <h3 className="mt-2 text-lg font-semibold text-claro-text">{t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-claro-muted">{b}</p>
    </div>
  )
}