import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ClaroLogoMark } from '../components/brand/ClaroLogoMark.jsx'
import { LeafBackdrop } from '../components/brand/LeafBackdrop.jsx'
export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')

  // Already logged in
  if (user) {
    navigate(user.role === 'professor' ? '/professor/home' : '/student/home', { replace: true })
    return null
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Please enter an email.'); return }
    const u = login(email.trim(), role)
    navigate(u.role === 'professor' ? '/professor/home' : '/student/home', { replace: true })
  }

  return (
    <LeafBackdrop className="relative flex min-h-screen w-full items-center justify-center bg-claro-canvas p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="sr-only">Claro</h1>
          <div className="mx-auto mb-5 flex justify-center px-2">
            <ClaroLogoMark size={52} />
          </div>
          <p className="text-claro-muted text-sm max-w-sm mx-auto leading-relaxed">
            Canvas gives you the grade. We give you the why.
          </p>
        </div>

        <div className="bg-claro-panel border border-claro-indigo/15 rounded-2xl p-8 shadow-sm">
          <h2 className="text-claro-text font-medium text-lg mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-claro-muted mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full bg-claro-panel border border-claro-indigo/18 rounded-xl px-4 py-2.5 text-sm text-claro-text placeholder-claro-muted/60 focus:outline-none focus:border-claro-indigo transition-colors dark:bg-claro-slate/50"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-claro-muted mb-1.5 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', label: 'Student' },
                  { value: 'professor', label: 'Professor' },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      role === r.value
                        ? 'bg-claro-indigo/12 border-claro-indigo text-claro-indigo'
                        : 'bg-claro-canvas border-claro-indigo/15 text-claro-muted hover:border-claro-indigo/30'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-claro-coral text-xs">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-claro-indigo py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:brightness-110 active:brightness-95 dark:hover:brightness-125"
            >
              Continue
            </button>
          </form>

          <p className="text-center text-xs text-claro-muted/80 mt-5">Demo — no real authentication required</p>
        </div>
      </div>
    </LeafBackdrop>
  )
}
