import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ClaroLogoMark } from '../components/brand/ClaroLogoMark.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'

const STATS = [
  { label: 'Concepts analyzed weekly', target: 1240, suffix: '+' },
  { label: 'Early risk signals surfaced', target: 87, suffix: '%' },
  { label: 'Avg diagnosis time saved', target: 42, suffix: 'min' },
]

const FAQ = [
  {
    q: 'Do students need to install or learn anything new?',
    a: 'No. Claro works on existing syllabus and quiz/exam data, then gives instructors a clearer diagnostic view.',
  },
  {
    q: 'Can this run without live AI keys?',
    a: 'Yes. The demo runs with seeded data and supports AI-enhanced personalization when keys are available.',
  },
  {
    q: 'What changes for professors day-to-day?',
    a: 'They keep the same workflow, but now see root-cause insights instead of only raw scores.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [mouse, setMouse] = useState({ x: 50, y: 30 })
  const [activeFaq, setActiveFaq] = useState(0)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  const goLogin = () => {
    navigate('/login')
  }

  const fade = (d) => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(16px)',
    transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  })

  const heroGlow = useMemo(
    () => ({
      background: `radial-gradient(520px circle at ${mouse.x}% ${mouse.y}%, rgba(255,255,255,0.08), transparent 60%)`,
    }),
    [mouse],
  )

  return (
    <LeafBackdrop className="min-h-screen bg-space-page">
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-claro-indigo/20 bg-claro-panel">
        <div className="mx-auto flex h-16 min-h-touch max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <ClaroLogoMark size={34} />
            <span className="hidden text-sm text-claro-muted sm:block">From grades to why</span>
          </div>
          <div className="flex items-center gap-2">
            <LandingButton label="Get started" onClick={goLogin} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <section
          className="relative overflow-hidden rounded-2xl border border-claro-indigo/20 bg-claro-panel p-8 sm:p-12"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * 100
            const y = ((e.clientY - rect.top) / rect.height) * 100
            setMouse({ x, y })
          }}
        >
          <div className="pointer-events-none absolute inset-0" style={heroGlow} />
          <div className="relative">
            <p className="text-sm font-medium text-claro-indigo" style={fade(0)}>JHU Product Hackathon 2026</p>
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
              <LandingCta label="Get started" onClick={goLogin} />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {STATS.map((item, idx) => (
            <div key={item.label} className="rounded-xl border border-claro-indigo/15 bg-claro-panel p-5 transition-all hover:-translate-y-1 hover:border-claro-indigo/35" style={fade(0.45 + idx * 0.06)}>
              <p className="text-3xl font-semibold text-claro-text">
                <CountUp target={item.target} play={show} />{item.suffix}
              </p>
              <p className="mt-2 text-sm text-claro-muted">{item.label}</p>
            </div>
          ))}
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
              { n: '01', t: 'The graph appears', b: 'Paste your syllabus. AI extracts concepts and maps dependencies.' },
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
              <div key={c.l} className="rounded-xl border border-claro-indigo/15 bg-claro-canvas/60 p-5 transition-colors hover:border-claro-indigo/30">
                <p className="text-sm font-medium text-claro-indigo">{c.l}</p>
                <p className="mt-2 text-sm leading-relaxed text-claro-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-claro-indigo/20 bg-claro-panel p-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-claro-text">Quick FAQs</h3>
            <span className="text-sm text-claro-muted">Tap to expand</span>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, idx) => (
              <FaqRow
                key={item.q}
                item={item}
                open={activeFaq === idx}
                onToggle={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              />
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-claro-indigo/20 bg-claro-panel p-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-claro-text sm:text-4xl">Your LMS gives you the grade.</h2>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-claro-indigo sm:text-4xl">We make it clear.</h2>
          <p className="mt-3 text-lg text-claro-muted">Now I see.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <LandingCta label="Get started" onClick={goLogin} />
          </div>
        </section>
      </main>
    </LeafBackdrop>
  )
}

function CountUp({ target, play }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!play) return
    let frame = 0
    const maxFrames = 36
    const timer = setInterval(() => {
      frame += 1
      const p = frame / maxFrames
      const eased = 1 - (1 - p) ** 3
      setValue(Math.round(target * eased))
      if (frame >= maxFrames) clearInterval(timer)
    }, 24)
    return () => clearInterval(timer)
  }, [play, target])

  return value.toLocaleString()
}

function FaqRow({ item, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full rounded-xl border border-claro-indigo/15 bg-claro-canvas/50 px-5 py-4 text-left transition-colors hover:border-claro-indigo/35"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-medium text-claro-text">{item.q}</p>
        <span className="text-claro-indigo text-xl leading-none">{open ? '−' : '+'}</span>
      </div>
      {open && <p className="mt-3 text-sm leading-relaxed text-claro-muted">{item.a}</p>}
    </button>
  )
}

function LandingButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-touch rounded-lg px-4 py-2 text-sm font-medium transition-colors bg-claro-indigo text-white hover:brightness-110"
    >
      {label}
    </button>
  )
}

function LandingCta({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-touch rounded-xl px-6 py-3 text-base font-medium transition-colors bg-claro-indigo text-white hover:brightness-110"
    >
      {label}
    </button>
  )
}

function LandingCard({ n, t, b }) {
  return (
    <div className="rounded-xl border border-claro-indigo/15 bg-claro-panel p-6 transition-all hover:-translate-y-1 hover:border-claro-indigo/35">
      <p className="text-sm font-medium text-claro-indigo">{n}</p>
      <h3 className="mt-2 text-lg font-semibold text-claro-text">{t}</h3>
      <p className="mt-2 text-sm leading-relaxed text-claro-muted">{b}</p>
    </div>
  )
}
