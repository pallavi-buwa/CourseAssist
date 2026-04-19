import { studentGraph } from './mockStudentGraph.js'

const res = (t, u = '#') => [{ type: t, title: 'Resource', url: u }]

/** Quant / analytics-heavy subset + relabeled emphasis */
export const studentGraphAnalyst = {
  nodes: [
    { id: 'an-regression', label: 'Regression for Decisions', course: 'Forecasting & KPI Lab', accuracy: 0.86, resources: res('video') },
    { id: 'an-forecasting', label: 'Demand Forecasting', course: 'Forecasting & KPI Lab', accuracy: 0.81, resources: res('article') },
    { id: 'an-kpis', label: 'KPI Design & Guardrails', course: 'Forecasting & KPI Lab', accuracy: 0.74, resources: res('video') },
    { id: 'an-predictive', label: 'Predictive Analytics', course: 'Forecasting & KPI Lab', accuracy: 0.69, resources: res('podcast') },
    { id: 'an-experiment', label: 'A/B Testing & Experiments', course: 'Forecasting & KPI Lab', accuracy: 0.77, resources: res('article') },
    { id: 'an-data-strat', label: 'Data-Driven Strategy', course: 'Forecasting & KPI Lab', accuracy: 0.72, resources: res('video') },
    { id: 'an-risk-q', label: 'Quantitative Risk', course: 'Decision Analytics Core', accuracy: 0.68, resources: res('article') },
    { id: 'an-bsc', label: 'Balanced Scorecard', course: 'Decision Analytics Core', accuracy: 0.58, resources: res('video') },
    { id: 'an-competitive', label: 'Competitive Analysis', course: 'Decision Analytics Core', accuracy: 0.79, resources: res('article') },
    { id: 'an-unit-econ', label: 'Unit Economics', course: 'Venture Metrics Studio', accuracy: 0.83, resources: res('video') },
    { id: 'an-metrics-pmf', label: 'PMF Metrics', course: 'Venture Metrics Studio', accuracy: 0.64, resources: res('article') },
    { id: 'an-growth-metrics', label: 'Growth Funnels & Cohorts', course: 'Venture Metrics Studio', accuracy: 0.71, resources: res('podcast') },
  ],
  links: [
    { source: 'an-regression', target: 'an-forecasting' },
    { source: 'an-forecasting', target: 'an-predictive' },
    { source: 'an-kpis', target: 'an-experiment' },
    { source: 'an-experiment', target: 'an-data-strat' },
    { source: 'an-predictive', target: 'an-data-strat' },
    { source: 'an-competitive', target: 'an-risk-q' },
    { source: 'an-risk-q', target: 'an-bsc' },
    { source: 'an-unit-econ', target: 'an-metrics-pmf' },
    { source: 'an-metrics-pmf', target: 'an-growth-metrics' },
    { source: 'an-data-strat', target: 'an-bsc', crossCourse: true },
    { source: 'an-predictive', target: 'an-growth-metrics', crossCourse: true },
  ],
}

/** Brand / narrative / creative emphasis */
export const studentGraphCreative = {
  nodes: [
    { id: 'cr-brand-voice', label: 'Brand Voice & Narrative', course: 'Brand & AI Signals', accuracy: 0.73, resources: res('article') },
    { id: 'cr-nlp-cx', label: 'NLP for Customer Insight', course: 'Brand & AI Signals', accuracy: 0.66, resources: res('video') },
    { id: 'cr-ethics-story', label: 'Ethical Storytelling with AI', course: 'Brand & AI Signals', accuracy: 0.78, resources: res('podcast') },
    { id: 'cr-positioning', label: 'Strategic Positioning', course: 'Culture & Positioning Studio', accuracy: 0.7, resources: res('article') },
    { id: 'cr-culture', label: 'Culture as Strategy', course: 'Culture & Positioning Studio', accuracy: 0.81, resources: res('video') },
    { id: 'cr-stakeholder', label: 'Stakeholder Narratives', course: 'Culture & Positioning Studio', accuracy: 0.67, resources: res('article') },
    { id: 'cr-change-story', label: 'Change Communication', course: 'Culture & Positioning Studio', accuracy: 0.62, resources: res('video') },
    { id: 'cr-pitch', label: 'Pitch Architecture', course: 'Venture Narrative Lab', accuracy: 0.76, resources: res('video') },
    { id: 'cr-pmf-story', label: 'PMF as a Story', course: 'Venture Narrative Lab', accuracy: 0.69, resources: res('article') },
    { id: 'cr-growth-brand', label: 'Growth & Brand Loops', course: 'Venture Narrative Lab', accuracy: 0.64, resources: res('podcast') },
    { id: 'cr-bmc', label: 'Business Model Canvas', course: 'Venture Narrative Lab', accuracy: 0.72, resources: res('video') },
    { id: 'cr-pivot-narrative', label: 'Pivot Narratives', course: 'Venture Narrative Lab', accuracy: 0.55, resources: res('article') },
  ],
  links: [
    { source: 'cr-brand-voice', target: 'cr-nlp-cx' },
    { source: 'cr-nlp-cx', target: 'cr-ethics-story' },
    { source: 'cr-positioning', target: 'cr-culture' },
    { source: 'cr-culture', target: 'cr-stakeholder' },
    { source: 'cr-stakeholder', target: 'cr-change-story' },
    { source: 'cr-bmc', target: 'cr-pmf-story' },
    { source: 'cr-pmf-story', target: 'cr-pitch' },
    { source: 'cr-pitch', target: 'cr-growth-brand' },
    { source: 'cr-pmf-story', target: 'cr-pivot-narrative' },
    { source: 'cr-ethics-story', target: 'cr-change-story', crossCourse: true },
    { source: 'cr-positioning', target: 'cr-bmc', crossCourse: true },
  ],
}

/** Execution / ops / implementation emphasis */
export const studentGraphOperator = {
  nodes: [
    { id: 'op-automation', label: 'Process Automation', course: 'Systems & Responsible AI', accuracy: 0.84, resources: res('video') },
    { id: 'op-ai-deploy', label: 'AI Implementation', course: 'Systems & Responsible AI', accuracy: 0.7, resources: res('article') },
    { id: 'op-ai-ethics', label: 'Responsible Deployment', course: 'Systems & Responsible AI', accuracy: 0.76, resources: res('podcast') },
    { id: 'op-roi', label: 'AI ROI & Business Case', course: 'Systems & Responsible AI', accuracy: 0.61, resources: res('article') },
    { id: 'op-change', label: 'Change Management', course: 'Change & Execution', accuracy: 0.79, resources: res('video') },
    { id: 'op-stakeholder', label: 'Stakeholder Rollout', course: 'Change & Execution', accuracy: 0.73, resources: res('article') },
    { id: 'op-ma-exec', label: 'M&A Integration', course: 'Change & Execution', accuracy: 0.52, resources: res('video') },
    { id: 'op-global-exec', label: 'Global Execution', course: 'Change & Execution', accuracy: 0.65, resources: res('article') },
    { id: 'op-mvp', label: 'MVP Delivery', course: 'Build & Scale Practice', accuracy: 0.8, resources: res('video') },
    { id: 'op-lean', label: 'Lean Operations', course: 'Build & Scale Practice', accuracy: 0.74, resources: res('article') },
    { id: 'op-fundraise-exec', label: 'Fundraising Execution', course: 'Build & Scale Practice', accuracy: 0.63, resources: res('podcast') },
    { id: 'op-scale', label: 'Scaling Playbooks', course: 'Build & Scale Practice', accuracy: 0.58, resources: res('video') },
  ],
  links: [
    { source: 'op-automation', target: 'op-ai-deploy' },
    { source: 'op-ai-deploy', target: 'op-roi' },
    { source: 'op-ai-deploy', target: 'op-ai-ethics' },
    { source: 'op-change', target: 'op-stakeholder' },
    { source: 'op-stakeholder', target: 'op-ma-exec' },
    { source: 'op-ma-exec', target: 'op-global-exec' },
    { source: 'op-lean', target: 'op-mvp' },
    { source: 'op-mvp', target: 'op-scale' },
    { source: 'op-mvp', target: 'op-fundraise-exec' },
    { source: 'op-ai-deploy', target: 'op-change', crossCourse: true },
    { source: 'op-roi', target: 'op-fundraise-exec', crossCourse: true },
  ],
}

const BY_KEY = {
  analyst: studentGraphAnalyst,
  creative: studentGraphCreative,
  operator: studentGraphOperator,
}

export function getStaticStudentGraphForPersona(persona) {
  const key = persona?.studentGraphKey
  if (key && BY_KEY[key]) {
    return structuredClone(BY_KEY[key])
  }
  return structuredClone(studentGraph)
}
