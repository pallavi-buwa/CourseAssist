/** Demo personas: sign in with these emails (any password flow — email + role) for distinct graphs and UI accents. */

function norm(email) {
  return String(email || '').trim().toLowerCase()
}

const DEFAULT_STUDENT = {
  id: 'default',
  label: 'Student',
  accentHex: '#C4B5FF',
  tagline: 'Pick up where you left off.',
  studentGraphKey: null,
  stats: null,
  recentActivity: null,
  tryAIGraph: false,
  graphFocus: 'Balanced coverage across AI for Business, Strategy, and Entrepreneurship.',
  /** Dynamic panels merge with subjects from the graph when `focusPanels` is empty. */
  contentHub: {
    title: 'Content',
    lead: 'Open a subject below to start reading.',
    bullets: [],
    focusPanels: [],
  },
}

const DEFAULT_PROFESSOR = {
  id: 'default',
  label: 'Faculty',
  accentHex: '#C4B5FF',
  tagline: "Here's how your cohorts are performing today.",
  professorGraphVariant: 'default',
  cohortHint: 'General MBA section',
  tryAIGraph: false,
  graphFocus: 'Typical marketing cohort comprehension distribution.',
}

/** Student demo accounts */
export const STUDENT_PERSONA_BY_EMAIL = {
  'alex.analyst@claro.demo': {
    id: 'analyst',
    label: 'Alex — Analyst track',
    accentHex: '#9EE4D4',
    tagline: 'Your graph emphasizes analytics, forecasting, and evidence-based decisions.',
    studentGraphKey: 'analyst',
    stats: [
      { label: 'Concepts Mastered', value: '52', sub: 'analytics-heavy courses' },
      { label: 'Avg Accuracy', value: '78%', sub: 'quant & AI modules' },
      { label: 'Streak', value: '9 days', sub: 'strong consistency' },
    ],
    recentActivity: [
      { label: 'Drilled predictive models in AI for Business', time: '1h ago', icon: '◈' },
      { label: 'Micro-check streak: Strategic Mgmt (5 correct)', time: 'Yesterday', icon: '✓' },
      { label: 'Note: ROI sensitivity analysis', time: '2d ago', icon: '✎' },
    ],
    tryAIGraph: true,
    graphFocus:
      'Strong in quantitative reasoning. Weight nodes toward predictive analytics, data-driven strategy, marketing analytics, measurement, and risk modeling across the three MBA courses.',
    contentHub: {
      title: 'Analyst track — labs & readings',
      lead: 'Three lab-style subjects focused on quantitative reasoning.',
      bullets: [
        'Forecasting & KPI Lab — experiments, forecasting, and KPI guardrails.',
        'Decision Analytics Core — competitive views, scorecards, and quant risk.',
        'Venture Metrics Studio — unit economics, PMF metrics, and cohort growth.',
      ],
      focusPanels: [
        { heading: 'Forecasting & KPI Lab', body: 'Regression, demand curves, A/B tests, and predictive workflows.', courseTitle: 'Forecasting & KPI Lab' },
        { heading: 'Decision Analytics Core', body: 'Competitive sets, balanced scorecards, and quantified risk.', courseTitle: 'Decision Analytics Core' },
        { heading: 'Venture Metrics Studio', body: 'Unit economics, PMF signals, and funnel math.', courseTitle: 'Venture Metrics Studio' },
      ],
    },
  },
  'sam.creative@claro.demo': {
    id: 'creative',
    label: 'Sam — Creative / brand track',
    accentHex: '#FFD6A8',
    tagline: 'Your graph highlights positioning, narrative, and entrepreneurial storytelling.',
    studentGraphKey: 'creative',
    stats: [
      { label: 'Concepts Explored', value: '41', sub: 'design & narrative threads' },
      { label: 'Avg Accuracy', value: '68%', sub: 'reflective modules' },
      { label: 'Streak', value: '4 days', sub: 'building momentum' },
    ],
    recentActivity: [
      { label: 'Mapped PMF story arc in Entrepreneurship', time: '3h ago', icon: '◈' },
      { label: 'Shared notes on brand positioning', time: 'Yesterday', icon: '✎' },
      { label: 'Micro-check: stakeholder framing', time: '3d ago', icon: '✓' },
    ],
    tryAIGraph: true,
    graphFocus:
      'Creative and brand-oriented learner. Emphasize positioning, value proposition, growth, culture, pitching, and narrative-heavy concepts across courses; fewer pure-technical nodes.',
    contentHub: {
      title: 'Creative track — story & brand',
      lead: 'Narrative, positioning, and venture storytelling.',
      bullets: [
        'Brand & AI Signals — ethical AI stories and customer language.',
        'Culture & Positioning Studio — culture, stakeholders, and change comms.',
        'Venture Narrative Lab — pitch, PMF story, growth loops, pivots.',
      ],
      focusPanels: [
        { heading: 'Brand & AI Signals', body: 'Voice, NLP for insight, and responsible storytelling.', courseTitle: 'Brand & AI Signals' },
        { heading: 'Culture & Positioning Studio', body: 'Positioning, culture, stakeholders, and change narratives.', courseTitle: 'Culture & Positioning Studio' },
        { heading: 'Venture Narrative Lab', body: 'Pitch structure, PMF as story, growth loops, pivots.', courseTitle: 'Venture Narrative Lab' },
      ],
    },
  },
  'jordan.ops@claro.demo': {
    id: 'operator',
    label: 'Jordan — Execution / ops track',
    accentHex: '#FFB8C8',
    tagline: 'Your graph stresses implementation, change, and getting initiatives to land.',
    studentGraphKey: 'operator',
    stats: [
      { label: 'Concepts In Flight', value: '44', sub: 'execution-linked nodes' },
      { label: 'Avg Accuracy', value: '71%', sub: 'ops & strategy blend' },
      { label: 'Streak', value: '5 days', sub: 'steady progress' },
    ],
    recentActivity: [
      { label: 'Reviewed change management playbook', time: '5h ago', icon: '◈' },
      { label: 'Automation vs. AI ethics micro-check', time: 'Yesterday', icon: '✓' },
      { label: 'Checklist: AI implementation rollout', time: '1d ago', icon: '✎' },
    ],
    tryAIGraph: true,
    graphFocus:
      'Operations- and implementation-minded. Emphasize process automation, AI implementation, change management, stakeholder management, MVP, fundraising mechanics, and execution bridges between strategy and delivery.',
    contentHub: {
      title: 'Operator track — ship & scale',
      lead: 'Deployment, change management, and delivery.',
      bullets: [
        'Systems & Responsible AI — automation, rollout, ROI, ethics.',
        'Change & Execution — stakeholders, M&A integration, global execution.',
        'Build & Scale Practice — lean ops, MVP delivery, fundraising execution, scale.',
      ],
      focusPanels: [
        { heading: 'Systems & Responsible AI', body: 'Automation, implementation, ROI cases, and guardrails.', courseTitle: 'Systems & Responsible AI' },
        { heading: 'Change & Execution', body: 'Change programs, stakeholder rollouts, M&A and global execution.', courseTitle: 'Change & Execution' },
        { heading: 'Build & Scale Practice', body: 'Lean ops, MVPs, fundraising mechanics, scaling playbooks.', courseTitle: 'Build & Scale Practice' },
      ],
    },
  },
}

/** Professor demo accounts — different cohort narratives + 2D graph variants */
export const PROFESSOR_PERSONA_BY_EMAIL = {
  'morgan.research@claro.demo': {
    id: 'morgan',
    label: 'Prof. Morgan — Research-led marketing',
    accentHex: '#C4B5FF',
    tagline: 'Cohort A: heavier analytics; watch Marketing Analytics and positioning gaps.',
    professorGraphVariant: 'marketing_research',
    cohortHint: 'Cohort A · research-heavy',
    tryAIGraph: true,
    graphFocus:
      'MBA marketing section with weaker digital analytics and integrated comms; keep classic STP and brand nodes but skew comprehension lower on analytics-heavy topics.',
  },
  'chen.strategy@claro.demo': {
    id: 'chen',
    label: 'Prof. Chen — Strategy-first lens',
    accentHex: '#8EE4D2',
    tagline: 'Cohort B: stronger on frameworks; consumer journey and retention need attention.',
    professorGraphVariant: 'marketing_strategy',
    cohortHint: 'Cohort B · strategy-first',
    tryAIGraph: true,
    graphFocus:
      'Same marketing course but comprehension pattern differs: stronger SWOT/competitive analysis, softer on customer journey, retention, and integrated marketing comms.',
  },
}

export function resolvePersona(email, role) {
  const e = norm(email)
  if (role === 'professor') {
    const row = PROFESSOR_PERSONA_BY_EMAIL[e]
    return row ? { ...DEFAULT_PROFESSOR, ...row, email: e, matched: true } : { ...DEFAULT_PROFESSOR, email: e, matched: false }
  }
  const row = STUDENT_PERSONA_BY_EMAIL[e]
  return row ? { ...DEFAULT_STUDENT, ...row, email: e, matched: true } : { ...DEFAULT_STUDENT, email: e, matched: false }
}

export function listDemoPersonaHints() {
  return {
    students: Object.keys(STUDENT_PERSONA_BY_EMAIL),
    professors: Object.keys(PROFESSOR_PERSONA_BY_EMAIL),
  }
}
