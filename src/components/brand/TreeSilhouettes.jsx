/** Soft tree shapes at the bottom — slow parallax-style motion. */
export function TreeSilhouettes({ className = '' }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(38vh,320px)] overflow-visible ${className}`}
      aria-hidden
    >
      <svg
        className="tree-sway-left absolute bottom-0 left-[-2%] h-full w-[min(45vw,380px)] text-claro-text opacity-[0.07]"
        viewBox="0 0 200 240"
        preserveAspectRatio="xMinYMax meet"
      >
        <path
          fill="currentColor"
          d="M100 238 L100 160 Q55 145 40 95 Q35 55 100 8 Q165 55 160 95 Q145 145 100 160 Z"
        />
        <ellipse cx="100" cy="78" rx="62" ry="58" fill="currentColor" opacity="0.85" />
      </svg>
      <svg
        className="tree-sway-right absolute bottom-0 right-[-2%] h-full w-[min(42vw,360px)] text-claro-indigo opacity-[0.06]"
        viewBox="0 0 200 240"
        preserveAspectRatio="xMaxYMax meet"
      >
        <path
          fill="currentColor"
          d="M100 238 L100 168 Q148 150 162 102 Q168 58 100 12 Q32 58 38 102 Q52 150 100 168 Z"
        />
        <ellipse cx="100" cy="82" rx="58" ry="54" fill="currentColor" opacity="0.88" />
      </svg>
    </div>
  )
}
