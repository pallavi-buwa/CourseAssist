import { marketingGraph } from './mockGraphMarketing.js'

/** Cohort A: weaker analytics & integrated comms (research-led narrative) */
export const marketingGraphResearch = {
  nodes: marketingGraph.nodes.map(n => {
    if (n.id === 'marketing-analytics') return { ...n, comprehension: 0.28 }
    if (n.id === 'integrated-marketing') return { ...n, comprehension: 0.26 }
    if (n.id === 'market-research') return { ...n, comprehension: 0.88 }
    if (n.id === 'digital-marketing') return { ...n, comprehension: 0.68 }
    return { ...n }
  }),
  links: marketingGraph.links.map(l => ({ ...l })),
}

/** Cohort B: stronger frameworks; softer on journey & retention */
export const marketingGraphStrategy = {
  nodes: marketingGraph.nodes.map(n => {
    if (n.id === 'swot-analysis') return { ...n, comprehension: 0.92 }
    if (n.id === 'competitive-analysis') return { ...n, comprehension: 0.84 }
    if (n.id === 'customer-journey') return { ...n, comprehension: 0.36 }
    if (n.id === 'customer-retention') return { ...n, comprehension: 0.34 }
    if (n.id === 'integrated-marketing') return { ...n, comprehension: 0.38 }
    return { ...n }
  }),
  links: marketingGraph.links.map(l => ({ ...l })),
}

const VARIANTS = {
  default: marketingGraph,
  marketing_research: marketingGraphResearch,
  marketing_strategy: marketingGraphStrategy,
}

export function getProfessorMarketingGraph(persona) {
  const v = persona?.professorGraphVariant
  const g = VARIANTS[v] || marketingGraph
  return { nodes: g.nodes.map(n => ({ ...n })), links: g.links.map(l => ({ ...l })) }
}
