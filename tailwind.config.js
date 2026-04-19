/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0d0d14',
        panel: '#13131f',
        border: '#1e1e30',
        accent: {
          python: '#3b82f6',
          dsa: '#8b5cf6',
          cn: '#10b981',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    }
  },
  plugins: []
}
