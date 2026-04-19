/** Soft brain + synapse motifs at the bottom — replaces tree silhouettes. */
export function NeuralHorizon({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(40vh,340px)] overflow-visible ${className}`}
      aria-hidden
    >
      {/* Left: stylized brain mass (two lobes + stem) */}
      <svg
        className="tree-sway-left absolute bottom-0 left-[-4%] h-full w-[min(48vw,400px)] text-claro-indigo opacity-[0.07]"
        viewBox="0 0 220 260"
        preserveAspectRatio="xMinYMax meet"
      >
        <ellipse cx="78" cy="88" rx="52" ry="68" fill="currentColor" />
        <ellipse cx="142" cy="88" rx="52" ry="68" fill="currentColor" />
        <ellipse cx="110" cy="175" rx="44" ry="52" fill="currentColor" />
        {/* Synapse arcs */}
        <path
          d="M 20 120 Q 55 95 90 110 M 130 105 Q 165 88 200 115"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Right: mirrored cluster + nodes */}
      <svg
        className="tree-sway-right absolute bottom-0 right-[-4%] h-full w-[min(46vw,380px)] text-claro-sage opacity-[0.06]"
        viewBox="0 0 220 260"
        preserveAspectRatio="xMaxYMax meet"
      >
        <ellipse cx="82" cy="90" rx="50" ry="66" fill="currentColor" />
        <ellipse cx="138" cy="90" rx="50" ry="66" fill="currentColor" />
        <ellipse cx="110" cy="172" rx="42" ry="50" fill="currentColor" />
        <circle cx="48" cy="58" r="5" fill="currentColor" opacity="0.9" />
        <circle cx="172" cy="62" r="4" fill="currentColor" opacity="0.85" />
        <circle cx="110" cy="38" r="3.5" fill="currentColor" opacity="0.8" />
        <path
          d="M 48 58 Q 78 78 110 38 M 172 62 Q 145 85 110 38"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.45"
          strokeLinecap="round"
        />
      </svg>

      {/* Center-bottom: faint constellation / neural net */}
      <svg
        className="absolute bottom-0 left-1/2 h-[min(28vh,200px)] w-[min(90vw,520px)] -translate-x-1/2 text-claro-text opacity-[0.05]"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMax meet"
      >
        <circle cx="60" cy="40" r="3" fill="currentColor" />
        <circle cx="120" cy="22" r="2.5" fill="currentColor" />
        <circle cx="200" cy="35" r="3.5" fill="currentColor" />
        <circle cx="280" cy="28" r="2.5" fill="currentColor" />
        <circle cx="340" cy="45" r="3" fill="currentColor" />
        <path
          d="M 60 40 L 120 22 L 200 35 L 280 28 L 340 45"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.7"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
