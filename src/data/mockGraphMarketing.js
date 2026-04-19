export function comprehensionColor(score) {
  if (score >= 0.7) return '#22c55e'
  if (score >= 0.5) return '#f59e0b'
  return '#ef4444'
}

export const marketingGraph = {
  nodes: [
    { id: 'market-segmentation',  label: 'Market Segmentation',     comprehension: 0.82, week: 1 },
    { id: 'target-market',        label: 'Target Market',            comprehension: 0.74, week: 1 },
    { id: 'positioning',          label: 'Positioning',              comprehension: 0.45, week: 2 },
    { id: 'brand-equity',         label: 'Brand Equity',             comprehension: 0.61, week: 2 },
    { id: 'consumer-behavior',    label: 'Consumer Behavior',        comprehension: 0.38, week: 3 },
    { id: 'marketing-mix',        label: 'Marketing Mix (4Ps)',      comprehension: 0.79, week: 3 },
    { id: 'product-lifecycle',    label: 'Product Lifecycle',        comprehension: 0.55, week: 4 },
    { id: 'pricing-strategy',     label: 'Pricing Strategy',         comprehension: 0.41, week: 4 },
    { id: 'distribution-channels',label: 'Distribution Channels',   comprehension: 0.67, week: 4 },
    { id: 'integrated-marketing', label: 'Integrated Marketing Comms', comprehension: 0.33, week: 5 },
    { id: 'digital-marketing',    label: 'Digital Marketing',        comprehension: 0.72, week: 5 },
    { id: 'social-media-strategy',label: 'Social Media Strategy',   comprehension: 0.58, week: 6 },
    { id: 'customer-journey',     label: 'Customer Journey',         comprehension: 0.49, week: 7 },
    { id: 'brand-loyalty',        label: 'Brand Loyalty',            comprehension: 0.71, week: 7 },
    { id: 'market-research',      label: 'Market Research',          comprehension: 0.66, week: 1 },
    { id: 'swot-analysis',        label: 'SWOT Analysis',            comprehension: 0.88, week: 2 },
    { id: 'competitive-analysis', label: 'Competitive Analysis',     comprehension: 0.53, week: 2 },
    { id: 'value-proposition',    label: 'Value Proposition',        comprehension: 0.44, week: 3 },
    { id: 'customer-retention',   label: 'Customer Retention',       comprehension: 0.60, week: 7 },
    { id: 'marketing-analytics',  label: 'Marketing Analytics',      comprehension: 0.35, week: 6 },
  ],
  links: [
    { source: 'market-segmentation',  target: 'target-market' },
    { source: 'target-market',        target: 'positioning' },
    { source: 'positioning',          target: 'brand-equity' },
    { source: 'marketing-mix',        target: 'pricing-strategy' },
    { source: 'marketing-mix',        target: 'distribution-channels' },
    { source: 'consumer-behavior',    target: 'customer-journey' },
    { source: 'digital-marketing',    target: 'social-media-strategy' },
    { source: 'brand-equity',         target: 'brand-loyalty' },
    { source: 'customer-journey',     target: 'customer-retention' },
    { source: 'marketing-analytics',  target: 'digital-marketing' },
    { source: 'swot-analysis',        target: 'competitive-analysis' },
    { source: 'value-proposition',    target: 'positioning' },
    { source: 'market-research',      target: 'market-segmentation' },
    { source: 'marketing-mix',        target: 'integrated-marketing' },
    { source: 'product-lifecycle',    target: 'pricing-strategy' },
    { source: 'brand-loyalty',        target: 'customer-retention' },
    { source: 'competitive-analysis', target: 'value-proposition' },
    { source: 'social-media-strategy',target: 'marketing-analytics' },
  ]
}
