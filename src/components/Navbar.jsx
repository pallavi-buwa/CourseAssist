import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const studentLinks = [
  { label: 'Home',     to: '/student/home' },
  { label: 'My Graph', to: '/student/dashboard' },
  { label: 'Courses',  to: '/student/reading' },
  { label: 'Notes',       to: '/student/notes' },
  { label: 'Preferences', to: '/student/preferences' },
]
const professorLinks = [
  { label: 'Home',      to: '/professor/home' },
  { label: 'Dashboard', to: '/professor/dashboard/intro-marketing' },
  { label: 'Analyzer',  to: '/professor/analyzer' },
  { label: 'Settings',  to: '/professor/home' },
]

function isActiveRoute(pathname, linkTo) {
  if (linkTo === '/professor/dashboard/intro-marketing') {
    return pathname.startsWith('/professor/dashboard/')
  }

  return pathname === linkTo || pathname.startsWith(`${linkTo}/`)
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropOpen, setDropOpen] = useState(false)

  if (!user) return null

  const links = user.role === 'professor' ? professorLinks : studentLinks
  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase()

  const breadcrumb = location.pathname
    .split('/').filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' › ')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-claro-slate border-b border-[#3A3550] flex items-center px-5 gap-6">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-claro-indigo flex items-center justify-center text-white text-xs font-semibold">C</div>
          <span className="font-medium text-claro-text text-sm">Claro</span>
        </div>
        <span className="text-claro-muted text-xs hidden sm:block truncate max-w-40">{breadcrumb}</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex items-center justify-center gap-1">
        {links.map(l => {
          const isActive = isActiveRoute(location.pathname, l.to)

          return (
            <Link
              key={l.label}
              to={l.to}
              aria-current={isActive ? 'page' : undefined}
              className={`group relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-claro-indigo/18 text-white shadow-[inset_0_0_0_1px_rgba(196,181,255,0.5)]'
                  : 'text-claro-muted hover:text-white hover:bg-white/8 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
              }`}
            >
              <span>{l.label}</span>
              <span
                className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full transition-opacity duration-200 ${
                  isActive
                    ? 'bg-claro-indigo opacity-100'
                    : 'bg-white/60 opacity-0 group-hover:opacity-100'
                }`}
              />
            </Link>
          )
        })}
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
          <div className="absolute right-0 top-10 w-44 bg-claro-slate border border-[#3A3550] rounded-xl shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-[#3A3550]">
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
