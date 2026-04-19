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
    languages,
    formats: formats.length ? formats : DEFAULT_STUDENT_PREFERENCES.formats,
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
  if (!storedUser) return null
  if (storedUser.role !== 'student') {
    return {
      ...storedUser,
      preferencesComplete: true,
    }
  }

  const savedPreferences = storedUser.email ? readPreferences(storedUser.email) : null
  return {
    ...storedUser,
    preferences: normalizePreferences(savedPreferences || storedUser.preferences || DEFAULT_STUDENT_PREFERENCES),
    preferencesComplete: Boolean(storedUser.preferencesComplete || savedPreferences),
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => hydrateUser(readJSON(USER_KEY, null)))

  const login = (email, role) => {
    const normalizedEmail = normalizeEmail(email)
    const savedPreferences = role === 'student' ? readPreferences(normalizedEmail) : null
    const u = {
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      role,
      preferences: savedPreferences || DEFAULT_STUDENT_PREFERENCES,
      preferencesComplete: role !== 'student' || Boolean(savedPreferences),
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

  if (!user) return <Navigate to="/" replace />

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
