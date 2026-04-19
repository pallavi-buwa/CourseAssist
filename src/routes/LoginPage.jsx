import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-claro-indigo/20 border border-claro-indigo/30 mb-4">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-claro-indigo" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="5" r="2" />
              <circle cx="5" cy="19" r="2" />
              <circle cx="19" cy="19" r="2" />
              <line x1="12" y1="7" x2="5" y2="17" strokeOpacity="0.5" />
              <line x1="12" y1="7" x2="19" y2="17" strokeOpacity="0.5" />
              <line x1="5" y1="19" x2="19" y2="19" strokeOpacity="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Claro</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Canvas gives you the grade. We give you the why.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-medium text-lg mb-6">Sign in</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-claro-indigo transition-colors"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">I am a</label>
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
                        ? 'bg-claro-indigo/20 border-claro-indigo text-claro-indigo/90'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-base">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              type="submit"
              className="w-full bg-claro-indigo hover:brightness-110 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
            >
              Continue →
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-5">Demo — no real authentication required</p>
        </div>
      </div>
    </div>
  )
}
