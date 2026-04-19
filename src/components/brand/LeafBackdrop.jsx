import { FallingLeavesLayer } from './FallingLeavesLayer.jsx'
import { TreeSilhouettes } from './TreeSilhouettes.jsx'

/**
 * Soft decorative leaves for cream surfaces — pointer-events none.
 */
function LeafShape({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path
        d="M16 4c-6 4-10 10-8 18 4-2 8-6 10-12 2 6 6 10 10 12 2-8-2-14-8-18-2 2-4 3-4 3s-2-1-4-3z"
        fill="currentColor"
      />
    </svg>
  )
}

const SPOTS = [
  { className: 'top-4 left-[4%] w-10 h-10 text-[#2D6A4F]', rotate: '-12deg', opacity: 0.14 },
  { className: 'top-[18%] right-[6%] w-14 h-14 text-[#52B788]', rotate: '18deg', opacity: 0.12 },
  { className: 'bottom-[28%] left-[8%] w-9 h-9 text-[#40916c]', rotate: '-25deg', opacity: 0.11 },
  { className: 'bottom-8 right-[12%] w-12 h-12 text-[#1a5f45]', rotate: '8deg', opacity: 0.13 },
  { className: 'top-1/3 left-[2%] w-7 h-7 text-[#95d5b2]', rotate: '35deg', opacity: 0.1 },
  { className: 'bottom-1/4 right-[3%] w-8 h-8 text-[#2f855a]', rotate: '-8deg', opacity: 0.09 },
]

/** Use between background and main content (e.g. Brain intro behind UI). */
export function DecorativeLeaves({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {SPOTS.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.className}`}
          style={{
            opacity: s.opacity,
            transform: `rotate(${s.rotate})`,
          }}
        >
          <LeafShape className="h-full w-full" />
        </div>
      ))}
    </div>
  )
}

/**
 * @param {{ children?: import('react').ReactNode, className?: string }} props
 */
export function LeafBackdrop({ children, className = '' }) {
  return (
    <div className={`relative min-h-0 ${className}`}>
      <DecorativeLeaves />
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <TreeSilhouettes />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <FallingLeavesLayer />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
