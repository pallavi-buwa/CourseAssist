const NAMES = ['Alice Chen','Bob Martinez','Carol White','David Kim','Emma Johnson','Frank Lee','Grace Park','Henry Brown','Iris Davis','James Wilson','Karen Moore','Liam Taylor','Maya Anderson','Noah Thomas','Olivia Jackson','Peter Harris','Quinn Robinson','Rachel Lewis','Sam Clark','Tina Young','Uma Hall','Victor Allen','Wendy Scott','Xavier Green','Yara Adams','Zach Baker','Anna Nelson','Brian Carter','Chloe Mitchell','Derek Perez','Elena Roberts','Felix Turner','Gloria Phillips','Hugo Campbell','Iris Parker','Joel Evans','Kira Edwards','Lucas Collins','Mia Stewart','Nathan Sanchez','Olivia Morris','Patrick Rogers','Quinn Reed','Rachel Cook','Samuel Morgan','Tara Bell','Ulric Murphy','Vera Bailey','Walter Rivera','Xena Cooper']

// ~30% struggle on these red concepts
const STRUGGLE_CONCEPTS = ['positioning','consumer-behavior','integrated-marketing','marketing-analytics','value-proposition']

export const mockStudents = NAMES.map((name, i) => {
  const checks = {}
  const concepts = [
    'market-segmentation','target-market','positioning','brand-equity',
    'consumer-behavior','marketing-mix','product-lifecycle','pricing-strategy',
    'distribution-channels','integrated-marketing','digital-marketing',
    'social-media-strategy','customer-journey','brand-loyalty','market-research',
    'swot-analysis','competitive-analysis','value-proposition',
    'customer-retention','marketing-analytics'
  ]
  concepts.forEach(cid => {
    if (STRUGGLE_CONCEPTS.includes(cid)) {
      checks[cid] = Math.random() > 0.3  // 30% chance wrong
    } else {
      checks[cid] = Math.random() > 0.15 // 15% chance wrong
    }
  })
  return { id: `student-${i + 1}`, name, answeredChecks: checks }
})
