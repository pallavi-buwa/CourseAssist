import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eg_user')) } catch { return null }
  })

  const login = (email, role) => {
    const u = { email, name: email.split('@')[0], role }
    localStorage.setItem('eg_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  const logout = () => {
    localStorage.removeItem('eg_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

// Route guard — redirect to / if not logged in (or wrong role)
export function RequireAuth({ children, role }) {
  const { user } = useAuth()
  const navigate = useNavigate ? useNavigate() : null

  useEffect(() => {
    if (!user) { window.location.replace('/'); return }
    if (role && user.role !== role) {
      window.location.replace(user.role === 'professor' ? '/professor/home' : '/student/home')
    }
  }, [user, role])

  if (!user) return null
  if (role && user.role !== role) return null
  return children
}
