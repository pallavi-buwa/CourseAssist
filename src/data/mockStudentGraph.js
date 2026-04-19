// Student personal knowledge graph across 3 courses
export const studentGraph = {
  nodes: [
    // AI for Business Decisions
    { id: 'ai-intro',          label: 'AI Fundamentals',       course: 'AI for Business Decisions',  accuracy: 0.85, resources: [{ type: 'video', title: 'AI Basics Explained', url: '#' }, { type: 'article', title: 'What is AI?', url: '#' }] },
    { id: 'ml-basics',         label: 'Machine Learning Basics', course: 'AI for Business Decisions', accuracy: 0.72, resources: [{ type: 'video', title: 'ML Crash Course', url: '#' }, { type: 'podcast', title: 'AI in Business Pod', url: '#' }] },
    { id: 'decision-frameworks', label: 'Decision Frameworks', course: 'AI for Business Decisions',  accuracy: 0.61, resources: [{ type: 'article', title: 'Decision Theory', url: '#' }, { type: 'video', title: 'Frameworks Explained', url: '#' }] },
    { id: 'data-driven-strategy', label: 'Data-Driven Strategy', course: 'AI for Business Decisions', accuracy: 0.55, resources: [{ type: 'video', title: 'Data Strategy', url: '#' }, { type: 'article', title: 'Analytics for Decisions', url: '#' }] },
    { id: 'predictive-analytics', label: 'Predictive Analytics', course: 'AI for Business Decisions', accuracy: 0.48, resources: [{ type: 'video', title: 'Forecasting Methods', url: '#' }] },
    { id: 'nlp-business',      label: 'NLP in Business',       course: 'AI for Business Decisions',  accuracy: 0.66, resources: [{ type: 'article', title: 'NLP Use Cases', url: '#' }] },
    { id: 'ai-ethics',         label: 'AI Ethics',             course: 'AI for Business Decisions',  accuracy: 0.79, resources: [{ type: 'podcast', title: 'Ethics in AI', url: '#' }, { type: 'article', title: 'Responsible AI', url: '#' }] },
    { id: 'automation',        label: 'Process Automation',    course: 'AI for Business Decisions',  accuracy: 0.82, resources: [{ type: 'video', title: 'RPA Overview', url: '#' }] },
    { id: 'ai-roi',            label: 'AI ROI Measurement',    course: 'AI for Business Decisions',  accuracy: 0.43, resources: [{ type: 'article', title: 'Measuring AI Value', url: '#' }] },
    { id: 'ai-implementation', label: 'AI Implementation',     course: 'AI for Business Decisions',  accuracy: 0.58, resources: [{ type: 'video', title: 'Deploying AI', url: '#' }] },

    // Strategic Management
    { id: 'strategy-basics',   label: 'Strategy Fundamentals', course: 'Strategic Management',       accuracy: 0.91, resources: [{ type: 'video', title: 'Strategy 101', url: '#' }] },
    { id: 'competitive-advantage', label: 'Competitive Advantage', course: 'Strategic Management',   accuracy: 0.77, resources: [{ type: 'article', title: "Porter's Framework", url: '#' }] },
    { id: 'decision-frameworks-sm', label: 'Decision Frameworks', course: 'Strategic Management',    accuracy: 0.64, resources: [{ type: 'video', title: 'Strategic Decisions', url: '#' }] },
    { id: 'risk-assessment',   label: 'Risk Assessment',       course: 'Strategic Management',       accuracy: 0.52, resources: [{ type: 'article', title: 'Risk Analysis Methods', url: '#' }] },
    { id: 'stakeholder-mgmt',  label: 'Stakeholder Management', course: 'Strategic Management',      accuracy: 0.68, resources: [{ type: 'podcast', title: 'Managing Stakeholders', url: '#' }] },
    { id: 'change-management', label: 'Change Management',     course: 'Strategic Management',       accuracy: 0.71, resources: [{ type: 'video', title: 'Leading Change', url: '#' }] },
    { id: 'balanced-scorecard',label: 'Balanced Scorecard',    course: 'Strategic Management',       accuracy: 0.45, resources: [{ type: 'article', title: 'BSC Framework', url: '#' }] },
    { id: 'corporate-culture', label: 'Corporate Culture',     course: 'Strategic Management',       accuracy: 0.83, resources: [{ type: 'video', title: 'Culture & Strategy', url: '#' }] },
    { id: 'mergers-acquisitions', label: 'M&A Strategy',       course: 'Strategic Management',       accuracy: 0.39, resources: [{ type: 'article', title: 'M&A Fundamentals', url: '#' }] },
    { id: 'global-strategy',   label: 'Global Strategy',       course: 'Strategic Management',       accuracy: 0.60, resources: [{ type: 'podcast', title: 'Global Business Pod', url: '#' }] },

    // Entrepreneurship
    { id: 'startup-basics',    label: 'Startup Fundamentals',  course: 'Entrepreneurship',            accuracy: 0.88, resources: [{ type: 'video', title: 'Starting a Business', url: '#' }] },
    { id: 'lean-startup',      label: 'Lean Startup Method',   course: 'Entrepreneurship',            accuracy: 0.76, resources: [{ type: 'article', title: 'Lean Methodology', url: '#' }, { type: 'video', title: 'Build-Measure-Learn', url: '#' }] },
    { id: 'risk-assessment-ent', label: 'Risk Assessment',     course: 'Entrepreneurship',            accuracy: 0.54, resources: [{ type: 'article', title: 'Startup Risk', url: '#' }] },
    { id: 'data-driven-ent',   label: 'Data-Driven Strategy',  course: 'Entrepreneurship',            accuracy: 0.49, resources: [{ type: 'video', title: 'Data in Startups', url: '#' }] },
    { id: 'mvp',               label: 'MVP Development',       course: 'Entrepreneurship',            accuracy: 0.82, resources: [{ type: 'video', title: 'Building an MVP', url: '#' }] },
    { id: 'fundraising',       label: 'Fundraising & VC',      course: 'Entrepreneurship',            accuracy: 0.63, resources: [{ type: 'podcast', title: 'VC Podcast', url: '#' }] },
    { id: 'product-market-fit', label: 'Product-Market Fit',  course: 'Entrepreneurship',            accuracy: 0.71, resources: [{ type: 'article', title: 'Finding PMF', url: '#' }] },
    { id: 'growth-hacking',    label: 'Growth Hacking',        course: 'Entrepreneurship',            accuracy: 0.58, resources: [{ type: 'video', title: 'Growth Strategies', url: '#' }] },
    { id: 'business-model',    label: 'Business Model Design', course: 'Entrepreneurship',            accuracy: 0.74, resources: [{ type: 'video', title: 'BMC Workshop', url: '#' }] },
    { id: 'pivot-strategy',    label: 'Pivot Strategy',        course: 'Entrepreneurship',            accuracy: 0.46, resources: [{ type: 'article', title: 'When to Pivot', url: '#' }] },
  ],
  links: [
    // AI for Business
    { source: 'ai-intro',           target: 'ml-basics' },
    { source: 'ml-basics',          target: 'decision-frameworks' },
    { source: 'decision-frameworks',target: 'data-driven-strategy' },
    { source: 'data-driven-strategy', target: 'predictive-analytics' },
    { source: 'ml-basics',          target: 'nlp-business' },
    { source: 'ai-intro',           target: 'ai-ethics' },
    { source: 'ai-intro',           target: 'automation' },
    { source: 'automation',         target: 'ai-roi' },
    { source: 'ai-roi',             target: 'ai-implementation' },

    // Strategic Management
    { source: 'strategy-basics',    target: 'competitive-advantage' },
    { source: 'competitive-advantage', target: 'decision-frameworks-sm' },
    { source: 'decision-frameworks-sm', target: 'risk-assessment' },
    { source: 'strategy-basics',    target: 'stakeholder-mgmt' },
    { source: 'stakeholder-mgmt',   target: 'change-management' },
    { source: 'strategy-basics',    target: 'balanced-scorecard' },
    { source: 'corporate-culture',  target: 'change-management' },
    { source: 'competitive-advantage', target: 'mergers-acquisitions' },
    { source: 'strategy-basics',    target: 'global-strategy' },

    // Entrepreneurship
    { source: 'startup-basics',     target: 'lean-startup' },
    { source: 'lean-startup',       target: 'mvp' },
    { source: 'mvp',                target: 'product-market-fit' },
    { source: 'startup-basics',     target: 'risk-assessment-ent' },
    { source: 'startup-basics',     target: 'business-model' },
    { source: 'business-model',     target: 'fundraising' },
    { source: 'product-market-fit', target: 'growth-hacking' },
    { source: 'lean-startup',       target: 'pivot-strategy' },
    { source: 'data-driven-ent',    target: 'growth-hacking' },

    // Cross-course edges (gold)
    { source: 'decision-frameworks',    target: 'decision-frameworks-sm', crossCourse: true },
    { source: 'risk-assessment',        target: 'risk-assessment-ent',     crossCourse: true },
    { source: 'data-driven-strategy',   target: 'data-driven-ent',         crossCourse: true },
  ]
}

export function studentAccuracyColor(acc) {
  if (acc >= 0.7) return '#9EE4D4'
  if (acc >= 0.5) return '#FFD6A8'
  return '#FFB8C8'
}
