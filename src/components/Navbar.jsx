import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ClaroLogoMark } from './brand/ClaroLogoMark.jsx'
const studentLinks = [
  { label: 'Home',     to: '/student/home' },
  { label: 'My Graph', to: '/student/dashboard' },
  { label: 'Courses',  to: '/student/reading/module-1' },
  { label: 'Notes',    to: '/student/dashboard' },
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
  const initials = user.name.slice(0, 2).toUpperCase()

  const breadcrumb = location.pathname
    .split('/').filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' / ')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center gap-6 border-b border-claro-indigo/15 bg-claro-panel/95 px-5 backdrop-blur-sm dark:border-claro-sage/20">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex min-w-0 items-center gap-2" title="Claro">
          <div className="flex h-8 shrink-0 items-center">
            <ClaroLogoMark size={28} />
          </div>
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
                ? 'bg-claro-indigo/15 text-claro-indigo dark:bg-claro-indigo/25'
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
          onClick={() => setDropOpen(v => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-claro-indigo text-xs font-medium text-white transition-colors hover:brightness-110"
        >
          {initials}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-claro-indigo/20 bg-claro-panel py-1 shadow-xl dark:border-claro-sage/25">
            <div className="border-b border-claro-indigo/10 px-3 py-2 dark:border-claro-sage/15">
              <div className="text-xs text-claro-text font-medium truncate">{user.email}</div>
              <div className="text-xs text-claro-muted capitalize">{user.role}</div>
            </div>
            <button className="w-full px-3 py-2 text-left text-sm text-claro-text/90 transition-colors hover:bg-claro-indigo/10">Preferences</button>
            <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-claro-coral transition-colors hover:bg-claro-coral/10">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
