import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

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
    <div style={{ minHeight: '100vh', background: '#07070b', color: '#e8e6e0', fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 36px', background: '#07070bcc', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>Claro<span style={{ color: '#ef4444' }}>.</span></span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn label="Student" onClick={goStudent} ghost />
          <Btn label="Professor" onClick={goProf} />
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════
          SECTION 1: HERO — Minto Layer 1 (Conclusion)
          Present: 0:00–0:10
          ═══════════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 36px' }}>
        <p style={{ ...fade(0), fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 32 }}>
          JHU Product Hackathon 2026
        </p>
        <h1 style={{ ...fade(0.1), fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 650, marginBottom: 8 }}>
          Your LMS gives you the grade.
        </h1>
        <h1 style={{ ...fade(0.2), fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#ef4444', fontStyle: 'italic', marginBottom: 28 }}>
          We make it clear.
        </h1>
        <p style={{ ...fade(0.3), fontSize: 16, color: '#b0ada6', maxWidth: 440, lineHeight: 1.65, marginBottom: 40 }}>
          AI that turns quiz scores into diagnoses — prerequisite gaps, language barriers, and predicted exam outcomes — so professors can intervene before students fail.
        </p>
        <div style={{ ...fade(0.4), display: 'flex', gap: 12 }}>
          <Cta label="Professor demo" onClick={goProf} />
          <Cta label="Student demo" onClick={goStudent} ghost />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2: COMPARISON — Minto Layer 2 (Key Argument)
          Present: 0:10–0:40
          "Here's what a professor sees today vs with Claro"
          ═══════════════════════════════════════════════ */}
      <section style={{ padding: '40px 36px 80px', maxWidth: 880, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 16 }}>The difference</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 8, overflow: 'hidden', border: '1px solid #1e1e30' }}>
          <div style={{ padding: '36px 32px', background: '#0c0c14' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 16 }}>Your LMS today</p>
            <p style={{ fontSize: 52, fontWeight: 700, color: '#475569', lineHeight: 1 }}>45%</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 10 }}>Marcus Williams, Quiz 3</p>
          </div>
          <div style={{ padding: '36px 32px', background: '#10101a', borderLeft: '1px solid #1e1e30' }}>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 16 }}>With Claro</p>
            <p style={{ fontSize: 14, lineHeight: 1.75, color: '#d4d0c8' }}>
              Failed due to a <span style={{ color: '#ef4444', fontWeight: 500 }}>Week 3 prerequisite gap</span>, not Week 7 content. Same root cause in <span style={{ color: '#ef4444', fontWeight: 500 }}>14 students</span>. Q3 phrasing is filtering non-native speakers.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3: HOW IT WORKS — Minto Layer 3 (Supporting Reasons)
          Present: 0:40–1:15
          Narrate over each card, don't read them
          ═══════════════════════════════════════════════ */}
      <section style={{ padding: '40px 36px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 12 }}>How it works</p>
        <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 32, maxWidth: 480, color: '#e8e6e0' }}>Paste your syllabus. Watch your course come alive.</h2>
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

      {/* ═══════════════════════════════════════════════
          SECTION 4: AI — Minto Layer 4 (Evidence)
          Present: 1:15–1:30
          One sentence per capability, fast
          ═══════════════════════════════════════════════ */}
      <section style={{ padding: '60px 36px', borderTop: '1px solid #1e1e30', borderBottom: '1px solid #1e1e30' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 10 }}>The AI</p>
          <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 600, lineHeight: 1.2, marginBottom: 28, maxWidth: 440, color: '#e8e6e0' }}>Analytical, not conversational. No chatbot. No tutor.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { l: 'Comprehension decomposition', b: 'Turns "45%" into "prerequisite gap from Week 3 + language filter." The score becomes a diagnosis.' },
              { l: 'Material analysis', b: 'Reads your exam before students see it. Flags phrasing that filters non-native speakers.' },
              { l: 'Exam prediction', b: 'Paste your midterm. See which questions will fail — and why — before students sit down.' },
            ].map(c => (
              <div key={c.l} style={{ padding: 20, border: '1px solid #1e1e30', borderRadius: 6, background: '#0c0c14' }}>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{c.l}</p>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#b0ada6' }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5: CTA — Return to conclusion
          Present: 4:45–5:00 (after demos, scroll back here to close)
          ═══════════════════════════════════════════════ */}
      <section style={{ padding: '80px 36px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 600, marginBottom: 6, color: '#e8e6e0' }}>Your LMS gives you the grade.</h2>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#ef4444', fontStyle: 'italic', marginBottom: 12 }}>We make it clear.</h2>
        <p style={{ fontSize: 20, color: '#94a3b8', marginBottom: 36, fontStyle: 'italic' }}>Now I see.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Cta label="Professor demo" onClick={goProf} />
          <Cta label="Student demo" onClick={goStudent} ghost />
        </div>
      </section>

      <footer style={{ padding: '16px 36px', borderTop: '1px solid #1e1e30', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Claro<span style={{ color: '#ef4444' }}>.</span></span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#94a3b8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>JHU Product Hackathon 2026 — Round 2</span>
      </footer>
    </div>
  )
}

function Btn({ label, onClick, ghost }) {
  return <button onClick={onClick} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '7px 18px', borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s', border: 'none', background: ghost ? 'transparent' : '#ef4444', color: ghost ? '#b0ada6' : '#fff', outline: ghost ? '1px solid #334155' : 'none' }}
    onMouseEnter={e => { if (ghost) { e.target.style.outlineColor = '#ef4444'; e.target.style.color = '#e8e6e0' } else e.target.style.background = '#dc2626' }}
    onMouseLeave={e => { if (ghost) { e.target.style.outlineColor = '#334155'; e.target.style.color = '#b0ada6' } else e.target.style.background = '#ef4444' }}
  >{label}</button>
}

function Cta({ label, onClick, ghost }) {
  return <button onClick={onClick} style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '14px 32px', borderRadius: 3, cursor: 'pointer', transition: 'all 0.2s', background: ghost ? 'transparent' : '#ef4444', color: ghost ? '#e8e6e0' : '#fff', border: ghost ? '1px solid #475569' : 'none' }}
    onMouseEnter={e => { if (ghost) e.target.style.borderColor = '#ef4444'; else { e.target.style.background = '#dc2626'; e.target.style.transform = 'translateY(-1px)' } }}
    onMouseLeave={e => { if (ghost) e.target.style.borderColor = '#475569'; else { e.target.style.background = '#ef4444'; e.target.style.transform = 'translateY(0)' } }}
  >{label}</button>
}

function Card({ n, t, b }) {
  return (
    <div style={{ background: '#0c0c14', border: '1px solid #1e1e30', borderRadius: 8, padding: '28px 24px', transition: 'border-color 0.2s', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#ef4444'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e30'}>
      <span style={{ position: 'absolute', top: 14, right: 18, fontSize: 42, fontWeight: 700, color: '#12121c', fontFamily: "'Space Mono', monospace" }}>{n}</span>
      <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#ef4444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{n}</p>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: '#e8e6e0' }}>{t}</h3>
      <p style={{ fontSize: 13, lineHeight: 1.65, color: '#b0ada6' }}>{b}</p>
    </div>
  )
}