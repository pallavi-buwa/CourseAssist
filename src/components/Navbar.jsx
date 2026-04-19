import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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
    .join(' › ')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-900 border-b border-gray-800 flex items-center px-5 gap-6">
      {/* Logo + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">EG</div>
          <span className="font-medium text-white text-sm">EduGraph</span>
        </div>
        <span className="text-gray-600 text-xs hidden sm:block truncate max-w-40">{breadcrumb}</span>
      </div>

      {/* Nav links */}
      <div className="flex-1 flex items-center justify-center gap-1">
        {links.map(l => (
          <Link
            key={l.label}
            to={l.to}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              location.pathname.startsWith(l.to.split('/').slice(0, 3).join('/'))
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
          className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-medium hover:bg-indigo-500 transition-colors"
        >
          {initials}
        </button>
        {dropOpen && (
          <div className="absolute right-0 top-10 w-44 bg-gray-900 border border-gray-800 rounded-xl shadow-xl py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-800">
              <div className="text-xs text-white font-medium truncate">{user.email}</div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors">Preferences</button>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
