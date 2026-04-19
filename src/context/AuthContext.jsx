import { createContext, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthContext = createContext(null)
const USER_KEY = 'eg_user'
const PREFERENCES_KEY = 'eg_student_preferences'

export const DEFAULT_STUDENT_PREFERENCES = {
  languages: [],
  formats: ['video'],
}

function readJSON(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizePreferences(preferences) {
  const languages = Array.isArray(preferences?.languages)
    ? preferences.languages
    : preferences?.language && preferences.language !== 'English'
      ? [preferences.language]
      : []
  const formats = Array.isArray(preferences?.formats)
    ? preferences.formats
    : preferences?.format
      ? [preferences.format]
      : DEFAULT_STUDENT_PREFERENCES.formats

  return {
    languages: languages.map(String).filter(Boolean),
    formats: formats.length ? formats.map(String).filter(Boolean) : DEFAULT_STUDENT_PREFERENCES.formats,
    updatedAt: preferences?.updatedAt,
  }
}

function readPreferences(email) {
  const allPreferences = readJSON(PREFERENCES_KEY, {})
  return allPreferences[normalizeEmail(email)] || null
}

function writePreferences(email, preferences) {
  const allPreferences = readJSON(PREFERENCES_KEY, {})
  const cleanPreferences = {
    ...normalizePreferences(preferences),
    updatedAt: new Date().toISOString(),
  }

  allPreferences[normalizeEmail(email)] = cleanPreferences
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(allPreferences))
  return cleanPreferences
}

function hydrateUser(storedUser) {
  if (!storedUser || typeof storedUser !== 'object') return null
  if (!['student', 'professor'].includes(storedUser.role)) return null

  const email = normalizeEmail(storedUser.email)
  const name = storedUser.name || email.split('@')[0] || 'student'

  if (storedUser.role === 'professor') {
    return {
      ...storedUser,
      email,
      name,
      preferencesComplete: true,
    }
  }

  const savedPreferences = email ? readPreferences(email) : null
  const preferences = normalizePreferences(savedPreferences || storedUser.preferences || DEFAULT_STUDENT_PREFERENCES)

  return {
    ...storedUser,
    email,
    name,
    role: 'student',
    preferences,
    preferencesComplete: Boolean(storedUser.preferencesComplete || savedPreferences),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => hydrateUser(readJSON(USER_KEY, null)))

  const login = (email, role) => {
    const normalizedEmail = normalizeEmail(email)
    const normalizedRole = role === 'professor' ? 'professor' : 'student'
    const savedPreferences = normalizedRole === 'student' ? readPreferences(normalizedEmail) : null
    const u = {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0] || 'student',
      role: normalizedRole,
      preferences: normalizePreferences(savedPreferences || DEFAULT_STUDENT_PREFERENCES),
      preferencesComplete: normalizedRole !== 'student' || Boolean(savedPreferences),
    }

    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUser(u)
    return u
  }

  const savePreferences = (preferences) => {
    if (!user || user.role !== 'student') return null

    const savedPreferences = writePreferences(user.email, preferences)
    const nextUser = {
      ...user,
      preferences: savedPreferences,
      preferencesComplete: true,
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
    return savedPreferences
  }

  const logout = () => {
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, savePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export function RequireAuth({ children, role }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/" replace state={{ from: location.pathname }} />

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'professor' ? '/professor/home' : '/student/home'} replace />
  }

  if (
    user.role === 'student' &&
    !user.preferencesComplete &&
    location.pathname !== '/student/preferences'
  ) {
    return <Navigate to="/student/preferences" replace state={{ from: location.pathname }} />
  }

  return children
}
