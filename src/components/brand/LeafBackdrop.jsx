import { NeuralHorizon } from './NeuralHorizon.jsx'

function StarGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 5.5h5.7l-4.6 3.4 1.8 5.5-4.7-3.4-4.7 3.4 1.8-5.5-4.6-3.4h5.7L12 2z" />
    </svg>
  )
}

function NeuronGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="5" fill="currentColor" opacity="0.85" />
      <path
        d="M16 6v5M16 21v5M6 16h5M21 16h5M9.5 9.5l3.5 3.5M19 19l3.5 3.5M22.5 9.5L19 13M13 19l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}

function BrainGlyph({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      {/* Simplified cerebrum: two lobes + midline */}
      <ellipse cx="11" cy="14" rx="7" ry="9" opacity="0.92" />
      <ellipse cx="21" cy="14" rx="7" ry="9" opacity="0.92" />
      <ellipse cx="16" cy="22" rx="5" ry="6" opacity="0.88" />
    </svg>
  )
}

const MOTIFS = [
  { className: 'top-4 left-[4%] w-10 h-10 text-claro-indigo', rotate: '-12deg', opacity: 0.14, G: NeuronGlyph },
  { className: 'top-[18%] right-[6%] w-8 h-8 text-claro-sage', rotate: '18deg', opacity: 0.12, G: StarGlyph },
  { className: 'bottom-[28%] left-[8%] w-9 h-9 text-claro-sage', rotate: '-25deg', opacity: 0.11, G: BrainGlyph },
  { className: 'bottom-8 right-[12%] w-7 h-7 text-claro-indigo', rotate: '8deg', opacity: 0.13, G: StarGlyph },
  { className: 'top-1/3 left-[2%] w-8 h-8 text-claro-indigo', rotate: '35deg', opacity: 0.1, G: NeuronGlyph },
  { className: 'bottom-1/4 right-[3%] w-10 h-10 text-claro-sage', rotate: '-8deg', opacity: 0.09, G: BrainGlyph },
  { className: 'top-[52%] right-[18%] w-6 h-6 text-claro-indigo', rotate: '22deg', opacity: 0.08, G: StarGlyph },
]

/** Floating neurons / stars / micro-brains — pointer-events none. */
export function DecorativeNeuralMotifs({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {MOTIFS.map((s, i) => {
        const G = s.G
        return (
          <div
            key={i}
            className={`absolute ${s.className}`}
            style={{
              opacity: s.opacity,
              transform: `rotate(${s.rotate})`,
            }}
          >
            <G className="h-full w-full" />
          </div>
        )
      })}
    </div>
  )
}

/**
 * Page shell: cosmic space field + neural horizon (replaces leaves & trees).
 * @param {{ children?: import('react').ReactNode, className?: string }} props
 */
export function LeafBackdrop({ children, className = '' }) {
  return (
    <div className={`relative min-h-0 ${className}`}>
      <DecorativeNeuralMotifs />
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <NeuralHorizon />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
