/**
 * Score → fill color. Uses clearly separated hues (not all green) so bands are
 * scannable: emerald / teal / amber / orange / rust (growth metaphor → heat at risk).
 */
export const SCORE_BANDS = [
  { min: 0.78, label: 'Strong', range: '≥78%', color: '#047857' },
  { min: 0.62, label: 'Solid', range: '62–78%', color: '#0d9488' },
  { min: 0.48, label: 'Fair', range: '48–62%', color: '#ca8a04' },
  { min: 0.32, label: 'Low', range: '32–48%', color: '#ea580c' },
  { min: 0.18, label: 'At risk', range: '18–32%', color: '#c2410c' },
  { min: 0, label: 'Critical', range: '<18%', color: '#7f1d1d' },
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
  python: '#14532d',
  dsa: '#1a5f45',
  cn: '#3f5c4d',
}

/**
 * Marketing graph: comprehension + recency — low scores on recent weeks read as slightly more urgent.
 */
export function marketingEffectiveScore(node) {
  const c = node.comprehension ?? 0.5
  const week = Math.min(8, Math.max(1, node.week ?? 4))
  const recency = (week / 8) * 0.18
  const strain = (1 - c) * recency
  return Math.max(0, Math.min(1, c - strain * 0.55))
}

/**
 * Student graph: accuracy + hub weakness — weak hubs read one band lower.
 * No extra hue mixing so score colors stay interpretable.
 */
export function smartStudentNodeColor(node, opts = {}) {
  const acc = node.accuracy ?? 0.5
  const deg = opts.degree ?? node.degree ?? 4
  const importance = Math.min(1, deg / 14)
  const hubPenalty = importance * (1 - acc) * 0.22
  const eff = Math.max(0, Math.min(1, acc - hubPenalty))
  return scoreToNodeColor(eff)
}
