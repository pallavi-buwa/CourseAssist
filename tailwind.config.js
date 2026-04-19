/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        gray: {
          950: '#0a0a0f',
        },
        claro: {
          indigo: '#C4B5FF',
          amber: '#FFD6A8',
          sage: '#9EE4D4',
          coral: '#FFB8C8',
          midnight: '#110E1A',
          slate: '#1E1B2E',
          text: '#F6F2FF',
          muted: '#B4ABC9',
        },
        surface: '#1E1B2E',
        panel: '#1E1B2E',
        border: '#2E2A40',
        accent: {
          python: '#C4B5FF',
          dsa: '#D4B8FF',
          cn: '#8EE4D2',
        },
      },
    },
  },
  plugins: [],
}
