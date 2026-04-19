import { useState, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ClaroLogoMark } from './brand/ClaroLogoMark.jsx'
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
    .join(' / ')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 min-h-touch items-center gap-4 border-b border-claro-indigo/20 bg-claro-panel px-4 sm:px-6">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex min-w-0 items-center gap-2" title="Claro">
          <div
            className="flex h-9 shrink-0 items-center rounded-md border border-claro-indigo/25 bg-claro-canvas/50 px-0.5"
            style={{ boxShadow: persona.matched ? `inset 0 0 0 1px ${persona.accentHex}40` : undefined }}
          >
            <ClaroLogoMark size={32} />
          </div>
        </div>
        <span className="text-claro-muted text-sm hidden sm:block truncate max-w-[12rem]">{breadcrumb}</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1">
        {links.map(l => (
          <Link
            key={l.label}
            to={l.to}
            className={`min-h-touch inline-flex items-center rounded-md px-3 sm:px-4 text-base transition-colors ${
              location.pathname.startsWith(l.to.split('/').slice(0, 3).join('/'))
                ? 'bg-claro-indigo/15 text-claro-indigo font-medium'
                : 'text-claro-muted hover:bg-claro-indigo/10 hover:text-claro-text'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Avatar + dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropOpen(v => !v)}
          className="flex h-10 w-10 min-h-touch min-w-[2.5rem] items-center justify-center rounded-full bg-claro-indigo text-sm font-medium text-white transition-colors hover:brightness-110"
        >
          {initials}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border border-claro-indigo/20 bg-claro-panel py-1 shadow-lg">
            <div className="border-b border-claro-indigo/10 px-4 py-3">
              <div className="text-sm text-claro-text font-medium truncate">{user.email}</div>
              <div className="text-sm text-claro-muted capitalize mt-0.5">{user.role}</div>
            </div>
            {user.role === 'student' && (
              <button
                type="button"
                onClick={() => { setDropOpen(false); navigate('/student/preferences') }}
                className="w-full px-4 py-3 text-left text-base text-claro-text transition-colors hover:bg-claro-indigo/10"
              >
                Preferences
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-base text-claro-coral transition-colors hover:bg-claro-coral/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
