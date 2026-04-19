export const studentCourses = [
  {
    id: 'ai-for-business',
    title: 'AI for Business Decisions',
    code: 'MBA 601',
    progress: 72,
    modules: 8,
    nextModule: 'Module 5 — Predictive Analytics',
    color: 'from-[#C4B5FF]/24 to-[#D4B8FF]/18',
    border: 'border-[#3A3550]',
    accent: 'text-claro-indigo',
    progressGradient: 'linear-gradient(90deg, #C4B5FF 0%, #D4B8FF 100%)',
    moduleId: 'module-ai-1',
    currentWeek: 'Week 3',
  },
  {
    id: 'strategic-management',
    title: 'Strategic Management',
    code: 'MBA 602',
    progress: 58,
    modules: 10,
    nextModule: 'Module 7 — Competitive Strategy',
    color: 'from-claro-sage/20 to-claro-indigo/15',
    border: 'border-[#3A3550]',
    accent: 'text-claro-sage',
    progressGradient: 'linear-gradient(90deg, #9EE4D4 0%, #C4B5FF 100%)',
    moduleId: 'module-strat-1',
    currentWeek: 'Week 7',
  },
  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship',
    code: 'MBA 603',
    progress: 41,
    modules: 9,
    nextModule: 'Module 4 — Pitching & Fundraising',
    color: 'from-claro-amber/22 to-orange-600/15',
    border: 'border-[#3A3550]',
    accent: 'text-claro-amber',
    progressGradient: 'linear-gradient(90deg, #FFD6A8 0%, #EA580C 100%)',
    moduleId: 'module-ent-1',
    currentWeek: 'Week 4',
  },
]

export const studentReadingModules = {
  'module-ai-1': {
    title: 'Chapter 3: Market Segmentation and Targeting',
    courseCode: 'MBA 601',
    courseTitle: 'AI for Business Decisions',
    currentWeek: 'Week 3',
    sections: [
      {
        id: 'ai-s1',
        content: 'Market segmentation is the process of dividing a broad target market into subsets of consumers who have common needs, interests, and priorities. By identifying these segments, companies can design and implement strategies to target them more effectively. Segmentation can be based on demographics, psychographics, geographic regions, or behavioral patterns such as purchase history.',
        microCheck: {
          question: 'What is the primary purpose of market segmentation?',
          options: [
            'To reduce the number of products a company offers',
            'To divide a broad market into groups with common needs',
            'To increase the price of premium products',
          ],
          correct: 1,
          conceptId: 'market-segmentation',
          misconception: 'Confusing segmentation scope with product reduction strategy',
        },
      },
      {
        id: 'ai-s2',
        content: "Targeting involves evaluating each market segment's attractiveness and selecting one or more segments to enter. A company should target segments where it can generate the greatest customer value and sustain it over time. Effective targeting means matching the company's competitive advantages with the needs and expectations of the chosen segment.",
        microCheck: {
          question: 'Which factor is MOST important when evaluating a target segment?',
          options: [
            "The segment's size and growth potential",
            'The number of competitors already in the segment',
            'The geographic location of the segment',
          ],
          correct: 0,
          conceptId: 'target-market',
          misconception: 'Prioritizing competitive presence over segment viability',
        },
      },
      {
        id: 'ai-s3',
        content: "Positioning is the act of designing the company's offering and image to occupy a distinctive place in the mind of the target market. Effective positioning creates a customer-focused value proposition and helps the firm stand out in crowded markets.",
        microCheck: {
          question: 'Positioning is primarily concerned with:',
          options: [
            'Setting the lowest possible price',
            'How a brand is perceived relative to competitors in customers’ minds',
            'Choosing the right distribution channel',
          ],
          correct: 1,
          conceptId: 'positioning',
          misconception: 'Conflating positioning with pricing or distribution decisions',
        },
      },
    ],
  },
  'module-strat-1': {
    title: 'Module 7: Competitive Strategy and Strategic Trade-offs',
    courseCode: 'MBA 602',
    courseTitle: 'Strategic Management',
    currentWeek: 'Week 7',
    sections: [
      {
        id: 'strat-s1',
        content: 'Competitive strategy begins with choosing how the organization will create value differently from rivals. Leaders define the arenas where the company will play and determine what capabilities must be protected or strengthened to keep that advantage durable.',
        microCheck: {
          question: 'Competitive strategy is mostly about deciding:',
          options: [
            'Where to create distinct value versus competitors',
            'How to copy the market leader faster',
            'Whether to remove all operational risk',
          ],
          correct: 0,
          conceptId: 'competitive-advantage',
          misconception: 'Mistaking imitation for strategic advantage',
        },
      },
      {
        id: 'strat-s2',
        content: 'Trade-offs are central to strategy. A firm cannot pursue every customer, every feature, and every cost position at the same time without losing clarity. Strong strategic choices often involve saying no to attractive but distracting opportunities.',
        microCheck: {
          question: 'Why are trade-offs important in strategy?',
          options: [
            'They help firms avoid making any difficult choices',
            'They keep a strategy focused and coherent',
            'They guarantee higher short-term revenue',
          ],
          correct: 1,
          conceptId: 'strategic-tradeoffs',
          misconception: 'Assuming strategy can succeed without choosing what not to do',
        },
      },
      {
        id: 'strat-s3',
        content: 'Strategic fit happens when activities reinforce one another. A company with aligned pricing, operations, customer experience, and talent systems can defend its position more effectively because competitors must copy an interconnected system rather than a single feature.',
        microCheck: {
          question: 'Strategic fit means:',
          options: [
            'All company activities reinforce the chosen position',
            'Every department runs independently',
            'The company changes direction every quarter',
          ],
          correct: 0,
          conceptId: 'strategic-fit',
          misconception: 'Viewing strategy as isolated initiatives instead of an integrated system',
        },
      },
    ],
  },
  'module-ent-1': {
    title: 'Module 4: Pitching, Fundraising, and Investor Readiness',
    courseCode: 'MBA 603',
    courseTitle: 'Entrepreneurship',
    currentWeek: 'Week 4',
    sections: [
      {
        id: 'ent-s1',
        content: 'A strong startup pitch tells a crisp story about the problem, the customer, and why the team is uniquely equipped to solve it. Investors want clarity on pain point, market timing, and the credibility of the founding team.',
        microCheck: {
          question: 'A strong startup pitch should first make clear:',
          options: [
            'The office location of the company',
            'The problem, customer, and team credibility',
            'Every possible future product idea',
          ],
          correct: 1,
          conceptId: 'startup-pitch',
          misconception: 'Overloading the pitch before establishing the core opportunity',
        },
      },
      {
        id: 'ent-s2',
        content: 'Fundraising is not just about storytelling. Founders also need evidence that customers care, such as pilot traction, retention, revenue growth, or strong user engagement. That proof lowers perceived risk for investors.',
        microCheck: {
          question: 'What lowers investor risk the most during fundraising?',
          options: [
            'A longer slide deck',
            'Signals of traction and customer validation',
            'A complex technical architecture diagram',
          ],
          correct: 1,
          conceptId: 'fundraising-traction',
          misconception: 'Assuming polish matters more than traction',
        },
      },
      {
        id: 'ent-s3',
        content: 'Investor readiness also means understanding the use of funds, expected milestones, and what progress the round should unlock. Founders who connect capital to concrete outcomes appear more disciplined and trustworthy.',
        microCheck: {
          question: 'Being investor-ready means founders can explain:',
          options: [
            'How funds connect to milestones and growth',
            'Why planning is less important than passion',
            'That profitability is never relevant',
          ],
          correct: 0,
          conceptId: 'investor-readiness',
          misconception: 'Treating fundraising as detached from execution planning',
        },
      },
    ],
  },
}
