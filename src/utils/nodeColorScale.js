/**
 * Score → fill color. Brand ramp: green (strong) → yellow → red (critical).
 */
export const SCORE_BANDS = [
  { min: 0.78, label: 'Strong', range: '≥78%', color: '#22c55e' },
  { min: 0.62, label: 'Solid', range: '62–78%', color: '#84cc16' },
  { min: 0.48, label: 'Fair', range: '48–62%', color: '#eab308' },
  { min: 0.32, label: 'Low', range: '32–48%', color: '#f97316' },
  { min: 0.18, label: 'At risk', range: '18–32%', color: '#ef4444' },
  { min: 0, label: 'Critical', range: '<18%', color: '#991b1b' },
]

export function scoreToNodeColor(t) {
  const x = Math.max(0, Math.min(1, t))
  for (const band of SCORE_BANDS) {
    if (x >= band.min) return band.color
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1].color
}

/** Short label for tooltips / UI */
export function scoreBandLabel(t) {
  const x = Math.max(0, Math.min(1, t))
  for (const band of SCORE_BANDS) {
    if (x >= band.min) return band.label
  }
  return SCORE_BANDS[SCORE_BANDS.length - 1].label
}

/** Distinct greens for subject chips (separate from score ramp) */
export const SUBJECT_TINT = {
  python: '#22c55e',
  dsa: '#16a34a',
  cn: '#15803d',
}

/**
 * Marketing graph: comprehension + recency - low scores on recent weeks read as slightly more urgent.
 */
export function marketingEffectiveScore(node) {
  const c = node.comprehension ?? 0.5
  const week = Math.min(8, Math.max(1, node.week ?? 4))
  const recency = (week / 8) * 0.18
  const strain = (1 - c) * recency
  return Math.max(0, Math.min(1, c - strain * 0.55))
}

/**
 * Student graph: accuracy + hub weakness - weak hubs read one band lower.
 */
export function smartStudentNodeColor(node, opts = {}) {
  const acc = node.accuracy ?? 0.5
  const deg = opts.degree ?? node.degree ?? 4
  const importance = Math.min(1, deg / 14)
  const hubPenalty = importance * (1 - acc) * 0.22
  const eff = Math.max(0, Math.min(1, acc - hubPenalty))
  return scoreToNodeColor(eff)
}
