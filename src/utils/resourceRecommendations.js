const FORMAT_LABELS = {
  video: 'Video',
  text: 'Text',
  article: 'Text',
  pdf: 'PDF',
  podcast: 'Audio',
  interactive: 'Practice',
}

const FORMAT_ALIASES = {
  article: 'text',
  pdf: 'text',
}

const DEFAULT_RESOURCES = [
  {
    type: 'text',
    title: 'MIT Sloan Management Review',
    description: 'Research-backed articles on business, technology, and leadership.',
    source: 'MIT Sloan Management Review',
    language: 'English',
    url: 'https://sloanreview.mit.edu/',
  },
  {
    type: 'video',
    title: 'Stanford eCorner',
    description: 'Video lessons from founders, operators, and business researchers.',
    source: 'Stanford eCorner',
    language: 'English',
    url: 'https://ecorner.stanford.edu/videos/',
  },
  {
    type: 'podcast',
    title: 'HBR IdeaCast',
    description: 'Audio conversations on management, strategy, and innovation.',
    source: 'Harvard Business Review',
    language: 'English',
    url: 'https://hbr.org/podcasts/ideacast',
  },
]

const RESOURCE_CATALOG = {
  'ai-intro': [
    resource('text', 'What is artificial intelligence?', 'IBM overview of AI concepts, capabilities, and examples.', 'IBM', 'English', 'https://www.ibm.com/topics/artificial-intelligence'),
    resource('video', 'Elements of AI', 'A free online course introducing AI concepts for non-specialists.', 'University of Helsinki', 'English', 'https://www.elementsofai.com/'),
    resource('interactive', 'Google AI experiments', 'Hands-on demos that make AI behavior easier to explore.', 'Google', 'English', 'https://experiments.withgoogle.com/collection/ai'),
    resource('text', 'Inteligencia artificial', 'Spanish-language overview of artificial intelligence.', 'Wikipedia', 'Spanish', 'https://es.wikipedia.org/wiki/Inteligencia_artificial'),
    resource('text', 'Artificial intelligence', 'Mandarin-language overview of artificial intelligence.', 'Wikipedia', 'Mandarin', 'https://zh.wikipedia.org/wiki/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD'),
    resource('text', 'Artificial intelligence', 'Hindi-language overview of artificial intelligence.', 'Wikipedia', 'Hindi', 'https://hi.wikipedia.org/wiki/%E0%A4%95%E0%A5%83%E0%A4%A4%E0%A5%8D%E0%A4%B0%E0%A4%BF%E0%A4%AE_%E0%A4%AC%E0%A5%81%E0%A4%A6%E0%A5%8D%E0%A4%A7%E0%A4%BF'),
  ],
  'ml-basics': [
    resource('interactive', 'Machine Learning Crash Course', 'Hands-on lessons and exercises for core ML ideas.', 'Google Developers', 'English', 'https://developers.google.com/machine-learning/crash-course'),
    resource('text', 'What is machine learning?', 'Readable overview of ML types, uses, and limitations.', 'IBM', 'English', 'https://www.ibm.com/topics/machine-learning'),
    resource('video', 'Machine Learning Specialization', 'Course videos and exercises for supervised and unsupervised learning.', 'DeepLearning.AI', 'English', 'https://www.coursera.org/specializations/machine-learning-introduction'),
    resource('pdf', 'CS229 Machine Learning Notes', 'Lecture notes on supervised learning foundations.', 'Stanford University', 'English', 'https://cs229.stanford.edu/main_notes.pdf'),
  ],
  'decision-frameworks': decisionFrameworkResources(),
  'decision-frameworks-sm': decisionFrameworkResources(),
  'data-driven-strategy': [
    resource('text', 'What is data-driven decision making?', 'Practical overview of using data to guide business choices.', 'Tableau', 'English', 'https://www.tableau.com/learn/articles/data-driven-decision-making'),
    resource('text', 'Competing on analytics', 'Classic management article on analytics as strategic capability.', 'Harvard Business Review', 'English', 'https://hbr.org/2006/01/competing-on-analytics'),
    resource('video', 'Data Science for Business', 'Course page with video-based business analytics lessons.', 'Coursera', 'English', 'https://www.coursera.org/learn/data-science-for-business-innovation'),
  ],
  'data-driven-ent': [
    resource('text', 'Lean analytics stages', 'Startup-focused framework for choosing useful metrics.', 'Lean Analytics', 'English', 'https://leananalyticsbook.com/the-one-metric-that-matters/'),
    resource('text', 'Startup metrics for pirates', 'Founder-friendly explanation of acquisition, activation, retention, referral, and revenue.', '500 Global', 'English', 'https://500.co/content/startup-metrics-for-pirates-aarrr'),
    resource('video', 'Startup School Library', 'Video library covering metrics, growth, product, and fundraising.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
  ],
  'predictive-analytics': [
    resource('text', 'What is predictive analytics?', 'Overview of models, use cases, and predictive workflows.', 'IBM', 'English', 'https://www.ibm.com/topics/predictive-analytics'),
    resource('text', 'Forecasting: Principles and Practice', 'Open textbook chapters on forecasting methods.', 'OTexts', 'English', 'https://otexts.com/fpp3/'),
    resource('video', 'Business Analytics Specialization', 'Video courses on analytics and forecasting in business contexts.', 'Wharton Online', 'English', 'https://www.coursera.org/specializations/business-analytics'),
  ],
  'nlp-business': [
    resource('text', 'What is natural language processing?', 'Business-friendly explanation of NLP techniques and use cases.', 'IBM', 'English', 'https://www.ibm.com/topics/natural-language-processing'),
    resource('interactive', 'Hugging Face NLP course', 'Interactive lessons on transformers and NLP workflows.', 'Hugging Face', 'English', 'https://huggingface.co/learn/nlp-course/chapter1/1'),
    resource('video', 'Natural Language Processing Specialization', 'Course page with video lessons on NLP methods.', 'DeepLearning.AI', 'English', 'https://www.coursera.org/specializations/natural-language-processing'),
  ],
  'ai-ethics': [
    resource('text', 'Responsible AI practices', 'Guidance for fairness, safety, privacy, and accountability.', 'Google AI', 'English', 'https://ai.google/responsibility/responsible-ai-practices/'),
    resource('text', 'AI Risk Management Framework', 'Official framework for trustworthy AI risk management.', 'NIST', 'English', 'https://www.nist.gov/itl/ai-risk-management-framework'),
    resource('pdf', 'Blueprint for an AI Bill of Rights', 'PDF guidance on automated systems and public protections.', 'White House OSTP', 'English', 'https://www.whitehouse.gov/wp-content/uploads/2022/10/Blueprint-for-an-AI-Bill-of-Rights.pdf'),
  ],
  automation: [
    resource('text', 'What is business process automation?', 'Overview of automation, workflows, and business value.', 'IBM', 'English', 'https://www.ibm.com/topics/business-process-automation'),
    resource('text', 'Robotic process automation', 'Plain-language explanation of RPA and common uses.', 'UiPath', 'English', 'https://www.uipath.com/rpa/robotic-process-automation'),
    resource('video', 'Automation Anywhere University', 'Video-based training for automation concepts and tools.', 'Automation Anywhere', 'English', 'https://university.automationanywhere.com/'),
  ],
  'ai-roi': [
    resource('text', 'The economics of artificial intelligence', 'Management article on value creation from AI.', 'McKinsey', 'English', 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai'),
    resource('text', 'Measuring the value of AI', 'Business guidance on evaluating AI initiatives.', 'MIT Sloan Management Review', 'English', 'https://sloanreview.mit.edu/article/building-the-ai-powered-organization/'),
    resource('podcast', 'The McKinsey Podcast', 'Audio episodes on AI adoption, value, and organizational change.', 'McKinsey', 'English', 'https://www.mckinsey.com/featured-insights/mckinsey-podcast'),
  ],
  'ai-implementation': [
    resource('text', 'Building the AI-powered organization', 'Management guidance for deploying AI beyond pilots.', 'Harvard Business Review', 'English', 'https://hbr.org/2019/07/building-the-ai-powered-organization'),
    resource('text', 'MLOps: continuous delivery for machine learning', 'Practical implementation guidance for ML systems.', 'Google Cloud', 'English', 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning'),
    resource('pdf', 'Machine Learning Yearning', 'PDF-style online book about structuring ML projects.', 'Andrew Ng', 'English', 'https://www.deeplearning.ai/machine-learning-yearning/'),
  ],
  'strategy-basics': [
    resource('text', 'What is strategy?', 'Classic article on strategic positioning and tradeoffs.', 'Harvard Business Review', 'English', 'https://hbr.org/1996/11/what-is-strategy'),
    resource('video', 'Business Strategy Specialization', 'Course videos on competitive strategy and business models.', 'University of Virginia', 'English', 'https://www.coursera.org/specializations/business-strategy'),
    resource('podcast', 'HBR IdeaCast', 'Audio conversations with strategy researchers and business leaders.', 'Harvard Business Review', 'English', 'https://hbr.org/podcasts/ideacast'),
  ],
  'competitive-advantage': [
    resource('text', 'Competitive advantage', 'Readable definition, examples, and business context.', 'Investopedia', 'English', 'https://www.investopedia.com/terms/c/competitive_advantage.asp'),
    resource('text', 'The Five Forces', 'Official explanation of Porter’s Five Forces framework.', 'Harvard Business School', 'English', 'https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx'),
    resource('video', 'Competitive Strategy', 'Video course page for competitive analysis and advantage.', 'Coursera', 'English', 'https://www.coursera.org/learn/competitive-strategy'),
  ],
  'risk-assessment': riskResources(),
  'risk-assessment-ent': riskResources(),
  'stakeholder-mgmt': [
    resource('text', 'Stakeholder management', 'Project management guide to identifying and engaging stakeholders.', 'PMI', 'English', 'https://www.pmi.org/learning/library/stakeholder-management-task-project-success-7736'),
    resource('text', 'Stakeholder analysis', 'Practical steps for mapping stakeholder interests and influence.', 'MindTools', 'English', 'https://www.mindtools.com/aol0rms/stakeholder-analysis'),
    resource('podcast', 'HBR IdeaCast', 'Audio conversations on communication, leadership, and influence.', 'Harvard Business Review', 'English', 'https://hbr.org/podcasts/ideacast'),
  ],
  'change-management': [
    resource('text', 'What is change management?', 'Practical explanation of change management processes.', 'Prosci', 'English', 'https://www.prosci.com/resources/articles/change-management'),
    resource('text', 'Leading change: why transformation efforts fail', 'Classic article on organizational change pitfalls.', 'Harvard Business Review', 'English', 'https://hbr.org/1995/05/leading-change-why-transformation-efforts-fail-2'),
    resource('video', 'Organizational Change and Culture', 'Video course page on change leadership and culture.', 'Coursera', 'English', 'https://www.coursera.org/learn/organizational-change-and-culture-for-adopting-google-cloud'),
  ],
  'balanced-scorecard': [
    resource('text', 'Balanced scorecard basics', 'Overview of scorecard perspectives and implementation.', 'Balanced Scorecard Institute', 'English', 'https://balancedscorecard.org/bsc-basics-overview/'),
    resource('text', 'The Balanced Scorecard', 'Foundational article on translating strategy into measures.', 'Harvard Business Review', 'English', 'https://hbr.org/1992/01/the-balanced-scorecard-measures-that-drive-performance-2'),
    resource('pdf', 'Balanced scorecard guide', 'PDF guide introducing balanced scorecard concepts.', 'Balanced Scorecard Institute', 'English', 'https://balancedscorecard.org/wp-content/uploads/pdfs/Balanced-Scorecard-Basics.pdf'),
  ],
  'corporate-culture': [
    resource('text', 'Corporate culture', 'Definition and examples of organizational culture.', 'Investopedia', 'English', 'https://www.investopedia.com/terms/c/corporate-culture.asp'),
    resource('text', 'The Leader’s Guide to Corporate Culture', 'Framework for understanding and shaping culture.', 'Harvard Business Review', 'English', 'https://hbr.org/2018/01/the-leaders-guide-to-corporate-culture'),
    resource('podcast', 'WorkLife with Adam Grant', 'Audio episodes on workplace behavior and culture.', 'TED', 'English', 'https://www.ted.com/podcasts/worklife'),
  ],
  'mergers-acquisitions': [
    resource('text', 'Mergers and acquisitions', 'Business overview of M&A types, process, and valuation.', 'CFI', 'English', 'https://corporatefinanceinstitute.com/resources/valuation/mergers-acquisitions-ma/'),
    resource('text', 'Mergers and acquisitions', 'Definition and examples for M&A strategy.', 'Investopedia', 'English', 'https://www.investopedia.com/terms/m/mergersandacquisitions.asp'),
    resource('video', 'Mergers and Acquisitions course', 'Course page with video lessons on M&A strategy and finance.', 'Coursera', 'English', 'https://www.coursera.org/learn/mergers-acquisitions'),
  ],
  'global-strategy': [
    resource('text', 'GlobalEDGE reference desk', 'Country and global business reference materials.', 'Michigan State University', 'English', 'https://globaledge.msu.edu/reference-desk'),
    resource('text', 'International business strategy', 'Open textbook chapter on global business strategy.', 'OpenStax', 'English', 'https://openstax.org/books/principles-management/pages/8-5-global-market-opportunities'),
    resource('podcast', 'McKinsey Global Institute Podcast', 'Audio insights on global business and economics.', 'McKinsey', 'English', 'https://www.mckinsey.com/mgi/our-research/mckinsey-global-institute-podcast'),
  ],
  'startup-basics': [
    resource('video', 'Startup School Library', 'Founder videos on product, growth, fundraising, and company building.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
    resource('text', 'How to start a startup', 'Lecture materials from Stanford’s startup course.', 'Stanford University', 'English', 'https://startupclass.samaltman.com/'),
    resource('podcast', 'Stanford eCorner podcast', 'Founder and investor conversations for entrepreneurs.', 'Stanford eCorner', 'English', 'https://ecorner.stanford.edu/podcasts/'),
  ],
  'lean-startup': [
    resource('text', 'Lean Startup principles', 'Core principles behind build-measure-learn and validated learning.', 'The Lean Startup', 'English', 'https://theleanstartup.com/principles'),
    resource('video', 'How to start a startup', 'Video lectures on early-stage startup building.', 'Stanford University', 'English', 'https://startupclass.samaltman.com/'),
    resource('text', 'Lean Startup', 'Background and overview of the Lean Startup method.', 'Wikipedia', 'English', 'https://en.wikipedia.org/wiki/Lean_startup'),
  ],
  mvp: [
    resource('text', 'How to build an MVP', 'Founder-focused guide to scoping a minimum viable product.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library/6f-how-to-build-an-mvp'),
    resource('text', 'Minimum viable product', 'Overview of MVP definition, uses, and critiques.', 'Wikipedia', 'English', 'https://en.wikipedia.org/wiki/Minimum_viable_product'),
    resource('video', 'Startup School Library', 'Video library with practical lessons on MVPs and product discovery.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
  ],
  fundraising: [
    resource('text', 'A guide to seed fundraising', 'Step-by-step fundraising guidance for startup founders.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising'),
    resource('text', 'Venture capital', 'Readable explanation of venture capital terms and structure.', 'Investopedia', 'English', 'https://www.investopedia.com/terms/v/venturecapital.asp'),
    resource('podcast', 'The Twenty Minute VC', 'Audio interviews with venture capital investors and founders.', '20VC', 'English', 'https://www.thetwentyminutevc.com/'),
  ],
  'product-market-fit': [
    resource('text', 'The real product-market fit', 'Founder guide to recognizing and measuring product-market fit.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library/5z-the-real-product-market-fit'),
    resource('text', 'Product-market fit', 'Overview and history of the concept.', 'Wikipedia', 'English', 'https://en.wikipedia.org/wiki/Product/market_fit'),
    resource('video', 'Startup School Library', 'Video lessons on finding and validating product-market fit.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
  ],
  'growth-hacking': [
    resource('text', 'What is growth hacking?', 'Overview of growth hacking concepts and examples.', 'Optimizely', 'English', 'https://www.optimizely.com/optimization-glossary/growth-hacking/'),
    resource('text', 'Startup metrics for pirates', 'Growth framework for acquisition, activation, and retention.', '500 Global', 'English', 'https://500.co/content/startup-metrics-for-pirates-aarrr'),
    resource('video', 'Startup School Library', 'Founder videos on growth loops, channels, and retention.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
  ],
  'business-model': [
    resource('text', 'Business Model Canvas', 'Overview of the nine building blocks of a business model.', 'Strategyzer', 'English', 'https://www.strategyzer.com/library/the-business-model-canvas'),
    resource('pdf', 'Business Model Canvas PDF', 'Printable business model canvas template.', 'Strategyzer', 'English', 'https://assets.strategyzer.com/assets/resources/the-business-model-canvas.pdf'),
    resource('video', 'Business Models for Innovative Care', 'Video course page on business model design.', 'Coursera', 'English', 'https://www.coursera.org/learn/business-models-innovative-care'),
  ],
  'pivot-strategy': [
    resource('text', 'How to pivot', 'Founder guide for deciding when and how to pivot.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library/5d-how-to-pivot'),
    resource('text', 'The Pivot', 'Management article on changing business direction.', 'Harvard Business Review', 'English', 'https://hbr.org/2011/07/the-pivot'),
    resource('video', 'Startup School Library', 'Video library for startup strategy and iteration.', 'Y Combinator', 'English', 'https://www.ycombinator.com/library'),
  ],
}

function resource(type, title, description, source, language, url) {
  return { type, title, description, source, language, url }
}

function decisionFrameworkResources() {
  return [
    resource('text', 'Decision tree', 'Clear explanation of decision trees for structured choices.', 'MindTools', 'English', 'https://www.mindtools.com/a5y6cfl/decision-tree-analysis'),
    resource('text', 'Decision matrix analysis', 'Practical framework for comparing multiple options.', 'MindTools', 'English', 'https://www.mindtools.com/a4h9v9i/decision-matrix-analysis'),
    resource('pdf', 'Decision quality framework', 'PDF guide to making high-quality decisions.', 'Strategic Decisions Group', 'English', 'https://sdg.com/wp-content/uploads/2018/02/Decision_Quality_Overview.pdf'),
  ]
}

function riskResources() {
  return [
    resource('text', 'Risk analysis', 'Definition, methods, and examples for assessing risk.', 'Investopedia', 'English', 'https://www.investopedia.com/terms/r/risk-analysis.asp'),
    resource('text', 'Risk management process', 'Practical overview of identifying and responding to risk.', 'PMI', 'English', 'https://www.pmi.org/learning/library/risk-analysis-project-management-7070'),
    resource('pdf', 'Risk management guide', 'PDF guide for risk management concepts and workflow.', 'NIST', 'English', 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-30r1.pdf'),
  ]
}

function cleanList(values, fallback) {
  if (!Array.isArray(values)) return fallback
  const cleaned = values.map(value => String(value).trim()).filter(Boolean)
  return cleaned.length ? cleaned : fallback
}

function formatMatches(resourceType, preferredFormats) {
  const normalizedType = FORMAT_ALIASES[resourceType] || resourceType
  return preferredFormats.some(format => {
    const normalizedFormat = FORMAT_ALIASES[format] || format
    return normalizedFormat === normalizedType
  })
}

function scoreResource(resourceItem, languages, formats) {
  const languageScore = languages.includes(resourceItem.language) ? 20 : resourceItem.language === 'English' ? 8 : 0
  const formatScore = formatMatches(resourceItem.type, formats) ? 30 : 0
  return languageScore + formatScore
}

export function buildLearningResources(node, preferences) {
  const languages = ['English', ...cleanList(preferences?.languages, [])]
  const formats = cleanList(preferences?.formats, ['video'])
  const catalogResources = RESOURCE_CATALOG[node?.id] || []
  const resources = catalogResources.length ? catalogResources : DEFAULT_RESOURCES

  return [...resources]
    .sort((a, b) => scoreResource(b, languages, formats) - scoreResource(a, languages, formats))
    .slice(0, 6)
}

export function preferenceSummary(preferences) {
  const languages = ['English', ...cleanList(preferences?.languages, [])]
  const formats = cleanList(preferences?.formats, ['video'])
    .map(format => FORMAT_LABELS[format] || format)

  return `${languages.join(', ')} - ${Array.from(new Set(formats)).join(', ')}`
}
