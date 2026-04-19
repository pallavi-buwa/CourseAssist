import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [show, setShow] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setShow(true)) }, [])

const goSignup = () => { navigate('/login') }
const goStudent = () => {
  const u = login('demo@university.edu', 'student')
  u.preferencesComplete = true
  localStorage.setItem('eg_user', JSON.stringify(u))
  window.location.href = '/student/home'
}
  const fade = d => ({
    opacity: show ? 1 : 0,
    transform: show ? 'translateY(0)' : 'translateY(20px)',
    transition: `all 0.8s cubic-bezier(0.22,1,0.36,1) ${d}s`,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#07070b', color: '#e2e0d8', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden', position: 'relative' }}>

      <div style={{ position: 'fixed', top: '-15%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, #ef444408, transparent 70%)', pointerEvents: 'none' }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 36px', background: '#07070bcc', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>Claro<span style={{ color: '#ef4444' }}>.</span></span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={goSignup} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 18px', borderRadius: 3, cursor: 'pointer', background: '#ef4444', color: '#fff', border: 'none' }}>Sign up</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 36px', position: 'relative', zIndex: 1 }}>
        <div style={fade(0)}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 28 }}>JHU Product Hackathon 2026</p>
        </div>
        <h1 style={{ ...fade(0.12), fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 680, marginBottom: 28 }}>
          Your LMS gives you<br />the grade.<br /><span style={{ color: '#ef4444' }}>We make it clear.</span>
        </h1>
        <div style={fade(0.25)}>
          <div style={{ width: 48, height: 2, background: '#ef4444', marginBottom: 20 }} />
          <p style={{ fontSize: 17, lineHeight: 1.7, color: '#706d63', maxWidth: 460, fontWeight: 300 }}>
            An AI comprehension layer that turns raw quiz scores into diagnoses — prerequisite gaps, language barriers, and predicted exam outcomes. Your LMS shows you the number. Claro shows you the picture.
          </p>
        </div>
        <div style={{ ...fade(0.4), display: 'flex', gap: 12, marginTop: 40 }}>
          <button onClick={goSignup} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 3, cursor: 'pointer', background: '#ef4444', color: '#fff', border: 'none' }}>Get started</button>
        </div>
      </section>

      {/* Comparison */}
      <section style={{ padding: '40px 36px 100px', maxWidth: 880, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 16 }}>The difference</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 8, overflow: 'hidden', border: '1px solid #1a1a25' }}>
          <div style={{ padding: '36px 32px', background: '#0a0a12' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 16 }}>Your LMS today</p>
            <p style={{ fontSize: 52, fontWeight: 700, color: '#64748b', lineHeight: 1 }}>45%</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 10 }}>Marcus Williams, Quiz 3</p>
          </div>
          <div style={{ padding: '36px 32px', background: '#0c0c16', borderLeft: '1px solid #1a1a25' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 16 }}>With Claro.</p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#8a8880' }}>
              Failed due to a <span style={{ color: '#ef4444', fontWeight: 500 }}>Week 3 prerequisite gap</span>, not Week 7 content. Same root cause in <span style={{ color: '#ef4444', fontWeight: 500 }}>14 students</span>. Q3 phrasing is filtering non-native speakers.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 36px 80px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 12 }}>How it works</p>
        <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 36, maxWidth: 480 }}>Paste your syllabus. Watch your course come alive.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { n: '01', t: 'The graph appears', b: "Paste your syllabus. AI extracts concepts and maps dependencies. You've taught this for years. You've never seen it this way." },
            { n: '02', t: 'Exam data lights it up', b: "Import quiz results from your LMS. Nodes turn green, yellow, red. See where the class understands — and where they're lost." },
            { n: '03', t: 'Click to diagnose', b: 'Click a red node. See why students failed — concept gap, language barrier, missing prerequisite. Get a 5-minute fix.' },
            { n: '04', t: 'Predict the future', b: "Paste your upcoming midterm. The graph predicts outcomes before students sit down." },
          ].map(c => (
            <Card key={c.n} {...c} />
          ))}
        </div>
      </section>

      {/* AI */}
      <section style={{ padding: '60px 36px', borderTop: '1px solid #1a1a25', borderBottom: '1px solid #1a1a25', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 10 }}>The AI</p>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 28, maxWidth: 440 }}>Analytical, not conversational. No chatbot. No tutor.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { l: 'Comprehension decomposition', b: 'Turns "45%" into "prerequisite gap from Week 3 + language filter." The score becomes a diagnosis.' },
              { l: 'Material analysis', b: 'Reads your exam before students see it. Flags phrasing that filters non-native speakers.' },
              { l: 'Cohort pattern detection', b: '"Q3 and Q7 test the same concept. Q3 averages 52%. Q7 averages 83%. The difference is two words."' },
            ].map(c => (
              <div key={c.l} style={{ padding: 20, border: '1px solid #1a1a25', borderRadius: 6, background: '#0a0a0f' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{c.l}</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#64748b' }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 36px', maxWidth: 880, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, textAlign: 'center' }}>
          {[
            { n: '8 wks', l: 'Avg delay before a professor detects a struggling student' },
            { n: '56%', l: 'Of US college students are first-generation' },
            { n: '1M+', l: "International students who won't self-identify" },
          ].map(s => (
            <div key={s.n}>
              <p style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, color: '#ef4444', lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 8, lineHeight: 1.5 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 36px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 600, marginBottom: 6 }}>Your LMS gives you the grade.</h2>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, color: '#ef4444', fontStyle: 'italic', marginBottom: 36 }}>We give you the why.</h2>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={goSignup} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 3, cursor: 'pointer', background: '#ef4444', color: '#fff', border: 'none' }}>Get started</button>
        </div>
      </section>

      <footer style={{ padding: '16px 36px', borderTop: '1px solid #1a1a25', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Claro<span style={{ color: '#ef4444' }}>.</span></span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase' }}>JHU Product Hackathon 2026 — Round 2</span>
      </footer>
    </div>
  )
}

function Card({ n, t, b }) {
  return (
    <div style={{ background: '#0c0c14', border: '1px solid #1a1a25', borderRadius: 8, padding: '28px 24px', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#ef4444'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a25'}>
      <span style={{ position: 'absolute', top: 14, right: 18, fontSize: 42, fontWeight: 700, color: '#0f0f1a', fontFamily: "'Space Mono', monospace" }}>{n}</span>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{n}</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{t}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: '#64748b' }}>{b}</p>
    </div>
  )
}
