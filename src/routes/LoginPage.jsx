import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ClaroLogoMark } from '../components/brand/ClaroLogoMark.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'
import { listDemoPersonaHints } from '../data/personas.js'
export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')

  const signedInDestination = user?.role === 'professor'
    ? '/professor/home'
    : user?.preferencesComplete ? '/student/home' : '/student/preferences'

  useEffect(() => {
    if (user) navigate(signedInDestination, { replace: true })
  }, [navigate, signedInDestination, user])

  if (user) return <Navigate to={signedInDestination} replace />

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter an email.'); return }
    const u = login(email.trim(), role)
    const destination = u.role === 'professor'
      ? '/professor/home'
      : u.preferencesComplete ? '/student/home' : '/student/preferences'
    navigate(destination, { replace: true })
  }

  return (
    <LeafBackdrop className="relative flex min-h-screen w-full items-center justify-center bg-space-page p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="sr-only">Claro</h1>
          <div className="mx-auto mb-6 flex justify-center px-2">
            <ClaroLogoMark size={56} />
          </div>
          <p className="text-claro-muted text-base max-w-md mx-auto leading-relaxed">
            Canvas gives you the grade. We give you the why.
          </p>
        </div>

        <div className="bg-claro-panel border border-claro-indigo/20 rounded-2xl p-8 sm:p-10 shadow-sm">
          <h2 className="text-claro-text font-semibold text-xl mb-8">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm text-claro-muted mb-2 block font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full min-h-touch bg-claro-panel border border-claro-indigo/20 rounded-xl px-4 py-3 text-base text-claro-text placeholder-claro-muted/60 focus:outline-none focus:border-claro-indigo focus:ring-1 focus:ring-claro-indigo/30 transition-colors dark:bg-claro-slate/50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm text-claro-muted mb-2 block font-medium">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'professor', label: 'Professor' },
                  { value: 'student', label: 'Student' },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`min-h-touch flex items-center justify-center px-4 py-3 rounded-xl border text-base font-medium transition-all ${role === r.value
                        ? 'bg-claro-indigo/12 border-claro-indigo text-claro-indigo'
                        : 'bg-claro-canvas border-claro-indigo/15 text-claro-muted hover:border-claro-indigo/30'
                      }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-claro-coral text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full min-h-touch rounded-xl bg-claro-indigo py-3.5 text-base font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
            >
              Continue
            </button>
          </form>

          <p className="text-center text-sm text-claro-muted mt-6">Demo: no password required</p>

          <div className="mt-8 rounded-xl border border-claro-indigo/15 bg-claro-canvas/50 p-5 text-left">
            <p className="text-sm font-medium text-claro-text mb-3">Demo accounts</p>
            <p className="text-sm text-claro-muted mb-2"><span className="text-claro-text">Students:</span>{' '}
              {listDemoPersonaHints().students.join(', ')}
            </p>
            <p className="text-sm text-claro-muted"><span className="text-claro-text">Professors:</span>{' '}
              {listDemoPersonaHints().professors.join(', ')}
            </p>
            <p className="text-sm text-claro-muted mt-3 leading-relaxed">
              Optional: set <code className="text-claro-text/90 bg-claro-slate/80 px-1.5 py-0.5 rounded text-[0.9em]">VITE_OPENAI_API_KEY</code> to enable AI features.
            </p>
          </div>
        </div>
      </div>
    </LeafBackdrop>
  )
}
