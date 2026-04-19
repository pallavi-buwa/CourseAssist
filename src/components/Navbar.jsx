import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { resolvePersona } from '../data/personas.js'

const studentLinks = [
  { label: 'Home',     to: '/student/home' },
  { label: 'My Graph', to: '/student/dashboard' },
  { label: 'Courses',  to: '/student/home' },
  { label: 'Notes',       to: '/student/notes' },
  { label: 'Preferences', to: '/student/preferences' },
]
const professorLinks = [
  { label: 'Home',      to: '/professor/home' },
  { label: 'Dashboard', to: '/professor/dashboard/intro-marketing' },
  { label: 'Analyzer',  to: '/professor/analyzer' },
  { label: 'Settings',  to: '/professor/home' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  if (!user) return null

  const links = user.role === 'professor' ? professorLinks : studentLinks
  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()
  const persona = useMemo(() => resolvePersona(user.email, user.role), [user.email, user.role])

  const breadcrumb = location.pathname
    .split('/').filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' › ')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-claro-slate border-b border-white/8 flex items-center px-5 gap-6">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-semibold"
            style={{ backgroundColor: persona.accentHex }}
          >
            C
          </div>
          <span className="font-medium text-claro-text text-sm">Claro</span>
        </div>
        <span className="text-claro-muted text-xs hidden sm:block truncate max-w-40">{breadcrumb}</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex items-center justify-center gap-1">
        {links.map(l => (
          <Link
            key={l.label}
            to={l.to}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname.startsWith(l.to.split('/').slice(0, 3).join('/'))
                ? 'bg-claro-indigo/20 text-claro-indigo'
                : 'text-claro-muted hover:text-claro-text hover:bg-white/5'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Avatar + dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropOpen(v => !v)}
          className="w-8 h-8 rounded-full bg-claro-indigo flex items-center justify-center text-white text-xs font-medium hover:brightness-110 transition-colors"
        >
          {initials}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-10 w-44 bg-claro-slate border border-white/10 rounded-xl shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-white/8">
              <div className="text-xs text-claro-text font-medium truncate">{user.email}</div>
              <div className="text-xs text-claro-muted capitalize">{user.role}</div>
            </div>
            {user.role === 'student' && (
              <button
                onClick={() => { setDropOpen(false); navigate('/student/preferences') }}
                className="w-full text-left px-3 py-2 text-sm text-claro-text/90 hover:bg-white/5 transition-colors"
              >
                Preferences
              </button>
            )}
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-claro-coral hover:bg-white/5 transition-colors">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
