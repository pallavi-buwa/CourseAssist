/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        claro: {
          canvas: 'rgb(var(--tw-claro-canvas) / <alpha-value>)',
          panel: 'rgb(var(--tw-claro-panel) / <alpha-value>)',
          slate: 'rgb(var(--tw-claro-slate) / <alpha-value>)',
          text: 'rgb(var(--tw-claro-text) / <alpha-value>)',
          muted: 'rgb(var(--tw-claro-muted) / <alpha-value>)',
          /** Brand */
          green: 'rgb(var(--tw-claro-green) / <alpha-value>)',
          red: 'rgb(var(--tw-claro-red) / <alpha-value>)',
          yellow: 'rgb(var(--tw-claro-yellow) / <alpha-value>)',
          /** Legacy names (mapped in index.css to green / yellow / red) */
          indigo: 'rgb(var(--tw-claro-indigo) / <alpha-value>)',
          amber: 'rgb(var(--tw-claro-amber) / <alpha-value>)',
          sage: 'rgb(var(--tw-claro-sage) / <alpha-value>)',
          coral: 'rgb(var(--tw-claro-coral) / <alpha-value>)',
          midnight: 'rgb(var(--tw-claro-canvas) / <alpha-value>)',
          cream: 'rgb(var(--tw-claro-canvas) / <alpha-value>)',
        },
        surface: 'rgb(var(--tw-surface) / <alpha-value>)',
        panel: 'rgb(var(--tw-panel) / <alpha-value>)',
        border: 'rgb(var(--tw-border) / <alpha-value>)',
        accent: {
          python: '#22c55e',
          dsa: '#16a34a',
          cn: '#15803d',
        },
      },
      fontFamily: {
        sans: [
          '"Brandon Grotesque"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
