import { useMemo } from 'react'

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

const PALETTE = ['#1B4332', '#2D6A4F', '#52B788', '#a16207', '#14532d', '#0d9488', '#ca8a04']

/** Drifting leaves falling through the frame (CSS-only). */
export function FallingLeavesLayer({ className = '', count = 26 }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${((i * 47) % 92) + 4}%`,
        delay: `${((i * 0.41) % 16).toFixed(2)}s`,
        duration: `${10 + (i % 9)}s`,
        size: 11 + (i % 6) * 2.5,
        color: PALETTE[i % PALETTE.length],
      })),
    [count]
  )

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {leaves.map(l => (
        <div
          key={l.id}
          className="leaf-fall absolute opacity-[0.55]"
          style={{
            left: l.left,
            top: '-6%',
            width: l.size,
            height: l.size * 1.15,
            color: l.color,
            animationDuration: l.duration,
            animationDelay: l.delay,
          }}
        >
          <LeafShape className="h-full w-full drop-shadow-sm" />
        </div>
      ))}
    </div>
  )
}
