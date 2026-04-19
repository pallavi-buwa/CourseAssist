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
    <LeafBackdrop className="flex min-h-screen w-full items-center justify-center bg-[#FDF6ED] p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-[#2D6A4F]/22 bg-gradient-to-br from-[#E8F0EB] to-[#FDF6ED] p-2 shadow-sm">
            <ClaroLogoMark size={72} className="drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-semibold text-claro-text mb-1">Claro</h1>
          <p className="text-claro-muted text-sm max-w-sm mx-auto leading-relaxed">
            Canvas gives you the grade. We give you the why.
          </p>
        </div>

        <div className="bg-[#FFFCF7] border border-[#2D6A4F]/15 rounded-2xl p-8 shadow-sm">
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
                className="w-full bg-white/90 border border-[#2D6A4F]/18 rounded-xl px-4 py-2.5 text-sm text-claro-text placeholder-claro-muted/60 focus:outline-none focus:border-[#2D6A4F] transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-claro-muted mb-1.5 block">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'student', icon: '🎓', label: 'Student' },
                  { value: 'professor', icon: '👨‍🏫', label: 'Professor' },
                ].map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                      role === r.value
                        ? 'bg-[#2D6A4F]/12 border-[#2D6A4F] text-[#14532d]'
                        : 'bg-[#FDF6ED] border-[#2D6A4F]/15 text-claro-muted hover:border-[#2D6A4F]/30'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-[#78350f] text-xs">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white rounded-xl py-2.5 text-sm font-medium transition-colors shadow-sm"
            >
              Continue →
            </button>
          </form>

          <p className="text-center text-xs text-claro-muted/80 mt-5">Demo — no real authentication required</p>
        </div>
      </div>
    </LeafBackdrop>
  )
}
