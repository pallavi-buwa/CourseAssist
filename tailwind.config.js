/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        claro: {
          // Cream canvas + forest greens + brown accents
          cream: '#FDF6ED',
          indigo: '#2D6A4F',
          amber: '#a16207',
          sage: '#52B788',
          coral: '#78350f',
          midnight: '#FDF6ED',
          slate: '#E8F0EB',
          text: '#1B4332',
          muted: '#5C6B63',
        },
        surface: '#EEF5F0',
        panel: '#E8F0EB',
        border: '#C5D4C8',
        accent: {
          python: '#14532d',
          dsa: '#1a5f45',
          cn: '#3f5c4d',
        },
      },
      fontFamily: {
        sans: ['Lato', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
