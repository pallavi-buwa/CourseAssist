export const courseInfo = {
  name: 'MKT 201 — Introduction to Marketing',
  semester: 'Fall 2026',
  professor: 'Prof. David Chen',
  students: 52,
}

export const courseNodes = [
  { id: 'n01', label: 'Customer analysis', week: 1, accuracy: 0.88, status: 'green' },
  { id: 'n02', label: 'Consumer behavior', week: 1, accuracy: 0.82, status: 'green' },
  { id: 'n03', label: 'Market research', week: 2, accuracy: 0.79, status: 'green' },
  { id: 'n04', label: 'Market segmentation', week: 3, accuracy: 0.61, status: 'yellow',
    detail: {
      studentsStruggling: 15,
      misconception: 'Students understand demographic segmentation but struggle with psychographic and behavioral. They default to age/gender/income when asked to segment.',
      prerequisiteTrace: 'This is a root node — no upstream prerequisites. The gap starts here.',
      intervention: 'Revisit with a concrete example. Show how Nike segments by athletic identity (runner vs basketball vs yoga), not demographics.',
    }
  },
  { id: 'n05', label: 'Target market selection', week: 3, accuracy: 0.72, status: 'green' },
  { id: 'n06', label: 'Value proposition', week: 4, accuracy: 0.75, status: 'green' },
  { id: 'n07', label: 'Brand positioning', week: 4, accuracy: 0.58, status: 'yellow',
    detail: {
      studentsStruggling: 19,
      misconception: 'Students conflate brand positioning (customer perception) with competitive advantage (firm capabilities).',
      prerequisiteTrace: 'Depends on Market segmentation (Week 3, 61%). Weak upstream node is compounding confusion.',
      intervention: 'Two columns on the board: "What the customer thinks" vs "What the company does." Positioning lives in column 1.',
    }
  },
  { id: 'n08', label: 'Competitive advantage', week: 5, accuracy: 0.70, status: 'green' },
  { id: 'n09', label: 'Competitive strategy', week: 5, accuracy: 0.54, status: 'red',
    detail: {
      studentsStruggling: 18,
      misconception: "Students can name Porter's strategies but can't apply them. They default to 'differentiation' for everything.",
      prerequisiteTrace: 'Depends on Brand positioning (58%). Weak upstream node compounding.',
      intervention: "2-minute exercise: give students Southwest Airlines. Ask which Porter strategy and WHY.",
    }
  },
  { id: 'n10', label: 'Pricing strategy', week: 6, accuracy: 0.68, status: 'yellow' },
  { id: 'n11', label: 'Distribution channels', week: 6, accuracy: 0.80, status: 'green' },
  { id: 'n12', label: 'Promotion mix', week: 6, accuracy: 0.77, status: 'green' },
  { id: 'n13', label: 'Digital marketing', week: 7, accuracy: 0.73, status: 'green' },
  { id: 'n14', label: 'Positioning strategy', week: 7, accuracy: 0.45, status: 'red',
    detail: {
      studentsStruggling: 23,
      misconception: '42% confused positioning strategy with competitive advantage. Positioning is about customer perception, competitive advantage is about firm capabilities.',
      languageFilter: {
        detected: true,
        detail: "Quiz Q3: 'critically evaluate the positioning strategy' (avg 45%). Quiz Q7: 'compare and explain the positioning approach' (avg 81%). Same concept. 36-point gap.",
        affectedGroup: 'Non-native English speakers scored 38% lower on Q3. No gap on Q7.',
      },
      prerequisiteTrace: 'Root cause is Week 3 Market segmentation (61%) — the earliest weak node in the chain.',
      intervention: 'Define positioning vs competitive advantage with one concrete example each. Show a strong vs weak response to Q3.',
      prediction: {
        questionRef: 'Midterm Q4',
        predictedFailRate: 0.55,
        failBreakdown: '60% due to prerequisite gap, 15% due to phrasing, 25% genuine concept gap.',
        suggestedFix: "Rephrase Q4: replace 'critically evaluate' with 'take a clear position on whether...and argue using evidence.' Add 10-min review of segmentation.",
      },
    }
  },
  { id: 'n15', label: 'Marketing plan', week: 7, accuracy: 0.52, status: 'red',
    detail: {
      studentsStruggling: 20,
      misconception: "Students treat the marketing plan as a list of tactics rather than a strategic document. They jump to 'run Instagram ads' without connecting to positioning.",
      prerequisiteTrace: 'Depends on Positioning strategy (45%). The positioning gap is cascading into the capstone.',
      intervention: 'Show a bad marketing plan (list of tactics) vs a good one (strategy → tactics flow).',
    }
  },
]

export const courseEdges = [
  { source: 'n01', target: 'n04' },
  { source: 'n02', target: 'n04' },
  { source: 'n03', target: 'n04' },
  { source: 'n04', target: 'n05' },
  { source: 'n04', target: 'n07' },
  { source: 'n05', target: 'n06' },
  { source: 'n06', target: 'n07' },
  { source: 'n07', target: 'n08' },
  { source: 'n07', target: 'n09' },
  { source: 'n08', target: 'n09' },
  { source: 'n07', target: 'n10' },
  { source: 'n09', target: 'n14' },
  { source: 'n07', target: 'n14' },
  { source: 'n10', target: 'n15' },
  { source: 'n11', target: 'n15' },
  { source: 'n12', target: 'n13' },
  { source: 'n14', target: 'n15' },
]

export const atRiskStudents = [
  { id: 's001', name: 'Priya Sharma', background: 'International', riskLevel: 'yellow', reason: 'Language filter detected. Scores 35% lower on "critically evaluate" phrasing. Concept understanding intact.' },
  { id: 's002', name: 'Marcus Williams', background: 'First-gen', riskLevel: 'red', reason: 'Week 3 prerequisite gap cascading. Weeks 1-3 avg 78%, Weeks 5-7 avg 34%.' },
  { id: 's003', name: 'Yuki Tanaka', background: 'International', riskLevel: 'yellow', reason: 'Language filter on "critically evaluate" phrasing. Concept understanding intact.' },
  { id: 's004', name: 'Diego Ramirez', background: 'First-gen', riskLevel: 'red', reason: 'Declining trajectory. Weeks 1-3: 71%. Weeks 5-7: 33%. Same Week 3 root cause.' },
  { id: 's005', name: 'Fatima Al-Rashid', background: 'International', riskLevel: 'red', reason: 'Format confusion. Writes descriptive responses when argumentative expected.' },
]

export const cohortInsights = [
  {
    severity: 'critical',
    title: 'Midterm Q4 predicted to be a bloodbath',
    detail: '55% of students predicted to fail Q4. 60% due to prerequisite gap, 15% due to phrasing, 25% genuine concept gap.',
    action: 'Rephrase Q4 + add 10-min segmentation review before exam. Predicted to reduce failure from 55% to ~20%.',
  },
  {
    severity: 'high',
    title: 'Language is filtering, not knowledge',
    detail: "Q3 and Q7 test identical concepts. Q3: 'Critically evaluate' (avg 52%). Q7: 'Compare and explain' (avg 83%). 31-point gap.",
    action: 'Rephrase Q3 to match Q7 structure.',
  },
  {
    severity: 'high',
    title: 'Week 3 gap cascading downstream',
    detail: 'Market segmentation (Week 3, 61%) is the root cause. Every downstream concept is yellow or red.',
    action: '10-minute Nike segmentation example unblocks everything downstream.',
  },
]

export const sampleAssignment = `Assignment 3: Brand Positioning Analysis

Critically evaluate the positioning strategy of a brand of your choice, with reference to at least two theoretical frameworks discussed in class. Your analysis should demonstrate mastery of core positioning concepts and provide a nuanced assessment of the brand's market position.

Requirements:
- Select a brand and justify your choice
- Apply at least two frameworks from the course to analyze the brand's positioning
- Discuss the competitive landscape and how the brand differentiates itself
- Provide recommendations for how the brand could strengthen its positioning
- Paper should be 1500-2000 words, double-spaced, with proper citations

Evaluation criteria: depth of analysis, appropriate application of theory, critical thinking, and quality of writing.`
