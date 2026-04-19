import { createContext, useContext, useEffect, useMemo } from 'react'

const ThemeContext = createContext(null)

/** App is dark-only; values are fixed for WebGL/CSS consumers. */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const value = useMemo(
    () => ({
      mode: 'dark',
      isDark: true,
      canvasHex: '#000000',
    }),
    []
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
