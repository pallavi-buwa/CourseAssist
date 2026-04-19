import { resolveSubjectTitleForReading, slugifySubject } from '../utils/studentGraphSnapshot.js'

function section(slug, idx, content, question, options, correct, conceptId) {
  return {
    id: `${slug}-s${idx}`,
    content,
    microCheck: { question, options, correct, conceptId: `${slug}-${conceptId}`, misconception: '' },
  }
}

/** @param {string} slug kebab-case key */
function passage(slug, title, week, triples) {
  const sections = triples.map((t, i) =>
    section(slug, i + 1, t[0], t[1], t[2], t[3], t[4]),
  )
  return { title, week, sections }
}

const TRIPLE_DEFAULT = [
  [
    'This module introduces core ideas for the subject shown in your header. Skim once for structure, then read again to connect each idea to examples you already know from work or school.',
    'What is the best first pass through new material?',
    ['Memorize every term before moving on', 'Get a map of main ideas, then deepen', 'Skip to the assignment only'],
    1,
    'overview',
  ],
  [
    'Apply one concept to a concrete situation: pick a decision, product, or team you know. Write one sentence linking the reading to that situation. This “elaboration” step is what makes transfer to exams and projects much easier.',
    'Which practice most improves retention?',
    ['Re-read passively many times', 'Connect ideas to a specific real example', 'Highlight only bold words'],
    1,
    'elaboration',
  ],
  [
    'Self-check: explain the module goal aloud in under thirty seconds. If you cannot, revisit the section that felt fastest to read. Often that is where subtle definitions hide.',
    'A quick self-test is useful when:',
    ['You want speed only', 'You are unsure you can summarize the goal', 'The font is small'],
    1,
    'metacognition',
  ],
]

const PASSAGES_BY_SLUG = {
  default: passage('default', 'Guided reading', 1, TRIPLE_DEFAULT),

  'ai-for-business-decisions': passage(
    'ai-for-business-decisions',
    'Module: From Data Signals to Decisions',
    3,
    [
      [
        'Organizations collect far more data than they can act on. The useful question is not “what data do we have?” but “what decision does this data inform, and what would change our mind?” Framing metrics around decisions prevents dashboards that look impressive but change nothing.',
        'A healthy analytics question starts with:',
        ['The largest database table', 'The decision and what would change it', 'The newest visualization tool'],
        1,
        'decision-framing',
      ],
      [
        'Machine learning in business is best treated as a forecast or ranking aid, not an oracle. Teams should document data lineage, baseline performance, and ethical constraints before scaling a model. Small pilots beat big launches when consequences are asymmetric.',
        'Before scaling an ML model, teams should prioritize:',
        ['Marketing buzzwords', 'Baselines, lineage, and pilot risk', 'Maximum model complexity'],
        1,
        'ml-governance',
      ],
      [
        'Human judgment still sets objectives, accepts trade-offs, and handles exceptions. AI compresses search over options; it does not remove accountability for who benefits when the model is wrong.',
        'When predictions fail, accountability should sit with:',
        ['The algorithm vendor only', 'Leaders who approved objectives and trade-offs', 'IT only'],
        1,
        'accountability',
      ],
    ],
  ),

  'strategic-management': passage(
    'strategic-management',
    'Module: Strategy as Integrated Choices',
    4,
    [
      [
        'Strategy is the pattern of choices that positions a firm in its environment. Generic goals like “grow revenue” are not strategy until they imply what you will not do, because trade-offs are what make a position defensible.',
        'A strategy is weakest when it:',
        ['Says yes to every attractive opportunity', 'Names a few coherent trade-offs', 'Aligns with capabilities'],
        0,
        'tradeoffs',
      ],
      [
        'Industry analysis helps you see pressure on profitability, not to copy competitors. The point is to anticipate where value migrates and whether your firm can occupy a differentiated or cost-advantaged position sustainably.',
        'Industry frameworks are primarily for:',
        ['Copying rivals’ tactics', 'Understanding profit pressure and value migration', 'Writing longer decks'],
        1,
        'industry-analysis',
      ],
      [
        'Implementation beats elegant planning. Strategy connects to budgets, incentives, and operating rhythms. Otherwise “strategy” is only a slide title.',
        'Strategy connects to execution through:',
        ['Only vision statements', 'Budgets, incentives, and operating cadence', 'Avoiding finance'],
        1,
        'execution',
      ],
    ],
  ),

  entrepreneurship: passage(
    'entrepreneurship',
    'Module: Discovery, De-risking, and Narrative',
    5,
    [
      [
        'Early-stage work is about cheap tests: interviews, smoke tests, and pre-sales that falsify risky assumptions. Progress is measured in evidence, not opinions.',
        'A lean test should primarily:',
        ['Prove the founder is busy', 'Reduce uncertainty on a critical assumption', 'Avoid talking to users'],
        1,
        'discovery',
      ],
      [
        'Investors read traction as proof of demand and execution, not vanity metrics. Consistent cohort behavior beats one-off spikes when you tell a credible story.',
        'Strong traction evidence usually includes:',
        ['Only logo slides', 'Repeatable customer behavior over time', 'A long feature list'],
        1,
        'traction',
      ],
      [
        'Fundraising is a matching problem: the right partners align on risk horizon, help you hire and sell, and strengthen governance. The pitch is the start of a relationship, not a closing argument.',
        'A pitch deck’s main job is to:',
        ['Hide risks', 'Start a relationship with aligned partners', 'Replace the product'],
        1,
        'fundraising',
      ],
    ],
  ),

  // ── Analyst persona tracks ───────────────────────────────────────────────
  'forecasting-kpi-lab': passage(
    'forecasting-kpi-lab',
    'Lab: Forecasts, KPIs, and Experiments',
    2,
    [
      [
        'Forecasts should specify the horizon, granularity, and error you can tolerate. A weekly SKU forecast for replenishment needs different methods than a quarterly revenue outlook for investors.',
        'Choosing a forecasting method should start with:',
        ['The software brand', 'Horizon, granularity, and acceptable error', 'The color of charts'],
        1,
        'forecast-spec',
      ],
      [
        'KPIs fail when they optimize local numbers that harm the system, like pushing sales without margin discipline. Good KPI trees connect leading indicators to lagging outcomes the leadership team actually owns.',
        'A KPI set is healthier when:',
        ['Each team maximizes its own metric blindly', 'Leading indicators tie to shared outcomes', 'There are hundreds of KPIs'],
        1,
        'kpi-tree',
      ],
      [
        'Experiments need power, ethics, and a pre-registered success rule. Otherwise “we tested it” becomes storytelling after the fact.',
        'A credible experiment includes:',
        ['Changing success criteria after results', 'A pre-defined decision rule and ethics review', 'Only post-hoc anecdotes'],
        1,
        'experiments',
      ],
    ],
  ),

  'decision-analytics-core': passage(
    'decision-analytics-core',
    'Core: Models, Competition, and Scorecards',
    4,
    [
      [
        'Quantitative risk combines scenarios, sensitivities, and distributions, not only single-point estimates. The goal is to describe how bad “bad” can get under plausible futures.',
        'Quant risk is most useful for:',
        ['Eliminating judgment', 'Mapping plausible downside and upside', 'Replacing meetings'],
        1,
        'quant-risk',
      ],
      [
        'Competitive analysis links customer value, relative cost, and switching barriers. Numbers without a story about why customers stay are easy to misread.',
        'Competitive insight should explain:',
        ['Only competitor headcount', 'Why customers stay or switch', 'Stock tickers only'],
        1,
        'competition',
      ],
      [
        'Balanced scorecards translate strategy into metrics across financial, customer, process, and learning perspectives, so short-term wins do not cannibalize long-term capability.',
        'Scorecards help teams:',
        ['Track only quarterly profit', 'Balance short-term and long-term drivers', 'Avoid customer metrics'],
        1,
        'scorecard',
      ],
    ],
  ),

  'venture-metrics-studio': passage(
    'venture-metrics-studio',
    'Studio: Unit Economics and Growth Math',
    6,
    [
      [
        'Unit economics asks whether one more customer pays back acquisition and service costs in an acceptable time. Without that, growth can destroy value.',
        'Healthy growth usually requires:',
        ['CAC payback that fits cash runway', 'Ignoring variable costs', 'Maximizing signups only'],
        0,
        'unit-econ',
      ],
      [
        'PMF metrics blend retention, depth of usage, and organic pull, not a single vanity spike. Look for cohorts that stabilize rather than decay to zero.',
        'A PMF signal is stronger when:',
        ['Cohorts stabilize or improve over time', 'Only top-of-funnel grows', 'Churn is ignored'],
        0,
        'pmf',
      ],
      [
        'Funnels and cohorts diagnose where value leaks between acquisition, activation, and retention. Fixing the biggest drop-off often beats adding new features upstream.',
        'Cohort analysis is best for:',
        ['Decorating slides', 'Finding the biggest drop-off to fix', 'Avoiding product work'],
        1,
        'cohorts',
      ],
    ],
  ),

  // ── Creative persona tracks ──────────────────────────────────────────────
  'brand-ai-signals': passage(
    'brand-ai-signals',
    'Studio: Voice, Language, and Responsible AI',
    3,
    [
      [
        'Brand voice is a constraint system: diction, rhythm, and taboos that keep communications recognizable. AI tools amplify voice only when humans supply examples and boundaries.',
        'Brand voice guidelines help teams:',
        ['Sound random each week', 'Stay recognizable across channels', 'Avoid all editing'],
        1,
        'voice',
      ],
      [
        'Customer language from reviews, interviews, and support logs grounds positioning in reality. NLP can cluster themes, but humans decide which themes matter strategically.',
        'NLP is most valuable when:',
        ['It replaces strategy', 'It surfaces themes humans prioritize', 'It deletes qualitative data'],
        1,
        'nlp',
      ],
      [
        'Responsible storytelling with AI means disclosure where needed, consent for personal data, and escalation paths when outputs could harm marginalized groups.',
        'Ethical AI comms should include:',
        ['Hidden data use', 'Disclosure and escalation paths', 'Only speed metrics'],
        1,
        'ethics',
      ],
    ],
  ),

  'culture-positioning-studio': passage(
    'culture-positioning-studio',
    'Studio: Positioning, Culture, and Change Comms',
    4,
    [
      [
        'Positioning is the promise kept consistently. Product, pricing, service, and narrative must line up. Drift between promise and experience erodes trust faster than weak ads.',
        'Positioning breaks down when:',
        ['Promise and experience drift apart', 'Ads are colorful', 'Competitors exist'],
        0,
        'positioning',
      ],
      [
        'Culture is “how we do things here” under pressure. Strategy asks for new behaviors; culture determines whether they stick.',
        'Culture change succeeds when:',
        ['Only posters change', 'Incentives and rituals reinforce new behaviors', 'Leaders skip modeling'],
        1,
        'culture',
      ],
      [
        'Change communications translate uncertainty into clarity: what changes, what does not, and what employees should do next week. Ambiguity fuels rumor mills.',
        'Strong change comms prioritize:',
        ['Vague inspiration', 'Concrete next steps and boundaries', 'Jargon density'],
        1,
        'change-comms',
      ],
    ],
  ),

  'venture-narrative-lab': passage(
    'venture-narrative-lab',
    'Lab: Pitch, PMF Story, and Pivot Logic',
    5,
    [
      [
        'A pitch is a compressed narrative: problem, insight, product, proof, and ask. Investors pattern-match for clarity and evidence more than adjectives.',
        'Investors reward pitches that:',
        ['Hide the risk', 'Show problem, insight, proof, and ask', 'Use only buzzwords'],
        1,
        'pitch',
      ],
      [
        'PMF as a story ties user pain, behavior change, and repeatable acquisition, so each slide answers “why you?” not only “what it is.”',
        'A PMF story should show:',
        ['Only screenshots', 'Pain, behavior change, and repeatable acquisition', 'Office photos'],
        1,
        'pmf-story',
      ],
      [
        'Pivots follow evidence: a segment loves the product, a channel works, or a use case emerges. Narrate the pivot as learning, not failure.',
        'A healthy pivot narrative:',
        ['Hides all prior work', 'Frames learning and new focus', 'Blames users'],
        1,
        'pivot',
      ],
    ],
  ),

  // ── Operator persona tracks ────────────────────────────────────────────
  'systems-responsible-ai': passage(
    'systems-responsible-ai',
    'Systems: Automation, Deployment, ROI, Ethics',
    3,
    [
      [
        'Automation should target high-volume, rules-heavy tasks with clear exceptions. Otherwise teams inherit brittle workflows that fail silently at edge cases.',
        'Good automation candidates are:',
        ['Novel strategy workshops', 'High-volume rule-heavy tasks with clear exceptions', 'One-off judgments'],
        1,
        'automation',
      ],
      [
        'AI implementation needs owners for data, model monitoring, and rollback. Technology without operating ownership becomes shelf-ware.',
        'Implementations stick when:',
        ['Only vendors own monitoring', 'Internal owners run data, monitoring, rollback', 'There is no pilot'],
        1,
        'implementation',
      ],
      [
        'ROI ties benefits, costs, and risk over an explicit horizon. Otherwise “success” cannot be debated honestly.',
        'A business case should quantify:',
        ['Only benefits', 'Benefits, costs, and risk over time', 'Only costs'],
        1,
        'roi',
      ],
    ],
  ),

  'change-execution': passage(
    'change-execution',
    'Execution: Change, Stakeholders, and Programs',
    4,
    [
      [
        'Change management sequences wins, trains coaches, and measures adoption, not only announcements. Resistance is information about missing incentives or skills.',
        'Change programs improve when:',
        ['Only emails are sent', 'Wins, coaches, and adoption metrics exist', 'Deadlines are secret'],
        1,
        'change-mgmt',
      ],
      [
        'Stakeholder rollouts map influence and interest: who must champion, who must comply, and who needs protection from disruption.',
        'Stakeholder maps help you:',
        ['Ignore critics', 'Target engagement by influence and interest', 'Avoid PMO'],
        1,
        'stakeholders',
      ],
      [
        'M&A integration succeeds when Day-1 decisions on customers, products, and people are rehearsed, not improvised at signing.',
        'Integration planning should rehearse:',
        ['Only press releases', 'Day-1 customer, product, and people decisions', 'Only finance models'],
        1,
        'integration',
      ],
    ],
  ),

  'build-scale-practice': passage(
    'build-scale-practice',
    'Practice: Lean Ops, MVP, Fundraising, Scale',
    6,
    [
      [
        'Lean operations reduce batch sizes and wait times so quality problems surface early. Inventory and work-in-process often hide defects.',
        'Lean favors:',
        ['Bigger batches to “be efficient”', 'Smaller batches to surface defects early', 'Ignoring frontline signals'],
        1,
        'lean',
      ],
      [
        'MVP delivery scopes the smallest thing that tests the riskiest assumption, not the smallest thing that is easy to build.',
        'An MVP should test:',
        ['Every feature at once', 'The riskiest assumption cheaply', 'Only UI polish'],
        1,
        'mvp',
      ],
      [
        'Scaling playbooks standardize hiring, onboarding, and support so growth does not collapse service quality.',
        'Scaling health is signaled by:',
        ['Rising tickets per user and slipping SLAs', 'Stable quality metrics as volume grows', 'More meetings only'],
        1,
        'scale',
      ],
    ],
  ),

  // Legacy marketing passage (module tied to old marketing path)
  'marketing-segmentation': passage(
    'marketing-segmentation',
    'Chapter 3: Market Segmentation and Targeting',
    3,
    [
      [
        'Market segmentation divides a broad market into subsets with common needs so strategies can target them effectively. Segments may use demographics, psychographics, geography, or behavior.',
        'What is the primary purpose of market segmentation?',
        ['To reduce products offered', 'To divide a broad market into groups with common needs', 'To raise premium prices only'],
        1,
        'segmentation',
      ],
      [
        'Targeting evaluates segment attractiveness and selects where the firm can sustain superior value. Fit between capabilities and segment needs matters more than size alone.',
        'Which factor is MOST important when evaluating a target segment?',
        ["The segment's size and growth potential", 'Only competitor count', 'Only geography'],
        0,
        'targeting',
      ],
      [
        'Positioning designs offering and image to occupy a distinctive place in customers’ minds, anchored by a clear value proposition.',
        'Positioning is primarily concerned with:',
        ['Lowest price only', 'How a brand is perceived relative to competitors', 'Channels only'],
        1,
        'positioning',
      ],
    ],
  ),
}

/**
 * Resolve URL :moduleId to a canonical slug, then return passage + display title.
 */
export function getReadingPassageForRoute(moduleId, email) {
  const raw = String(moduleId || '').trim()

  const legacySlug = {
    'module-ai-1': 'ai-for-business-decisions',
    'module-strat-1': 'strategic-management',
    'module-ent-1': 'entrepreneurship',
  }[raw]

  let slug = legacySlug
  if (!slug) {
    const title = resolveSubjectTitleForReading(email, raw)
    slug = title ? slugifySubject(title) : raw
  }

  const passageObj = PASSAGES_BY_SLUG[slug] || PASSAGES_BY_SLUG.default

  const LEGACY_LABEL = {
    'ai-for-business-decisions': 'AI for Business Decisions',
    'strategic-management': 'Strategic Management',
    entrepreneurship: 'Entrepreneurship',
  }

  const displayTitle =
    resolveSubjectTitleForReading(email, raw) ||
    (legacySlug ? LEGACY_LABEL[legacySlug] : null) ||
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return { passage: passageObj, slug, displayTitle }
}
