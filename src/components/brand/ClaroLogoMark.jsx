/**
 * Claro brand mark: tree trunk + graph canopy (nodes) + leaves — growth & knowledge.
 */
export function ClaroLogoMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      {/* background leaves (behind tree) */}
      <path
        d="M5 26c2.5-5 7-7 11-4-3.5 4.5-7 6.5-11 4z"
        fill="#95d5b2"
        opacity="0.55"
      />
      <path
        d="M35 19c-2.5-5-8.5-6-12-2 3 4 7.5 5 12 2z"
        fill="#52B788"
        opacity="0.5"
      />
      {/* trunk */}
      <rect x="16" y="20" width="8" height="18" rx="2.2" fill="#7c5a3c" />
      {/* canopy — knowledge-graph nodes */}
      <circle cx="13" cy="14" r="6" fill="#14532d" />
      <circle cx="22" cy="10" r="6.5" fill="#2D6A4F" />
      <circle cx="29" cy="15" r="5" fill="#40916c" />
      <path
        d="M18.5 20 L14 14 M20 19 L22 10 M20.5 19.5 L28.5 15.5"
        stroke="#0f291f"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* foreground leaves */}
      <path
        d="M4 14c3-2.5 8-2 10 2.5-4.5.5-8-.5-10-2.5z"
        fill="#52B788"
        opacity="0.9"
      />
      <path
        d="M36 22c-2.5 4-7.5 5.5-11 2.5 3-3.5 7-4 11-2.5z"
        fill="#2f855a"
        opacity="0.85"
      />
      <ellipse
        cx="31"
        cy="7"
        rx="2.8"
        ry="4.2"
        fill="#52B788"
        opacity="0.65"
        transform="rotate(28 31 7)"
      />
    </svg>
  )
}
