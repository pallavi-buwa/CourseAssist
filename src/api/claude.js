const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL   = 'claude-sonnet-4-6'
const BASE    = 'https://api.anthropic.com/v1/messages'

async function callAI(systemPrompt, userMessage) {
  if (!API_KEY || API_KEY === 'your_key_here') {
    throw new Error('VITE_ANTHROPIC_API_KEY not set')
  }
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Anthropic API error ${res.status}: ${err?.error?.message || res.statusText}`)
  }
  const data = await res.json()
  return data.content[0].text
}

// Strip markdown code fences if the model wraps JSON in ```json ... ```
function parseJSON(raw) {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(cleaned)
}

export async function analyzeForInclusivity(text) {
  const system = `You are an expert in educational equity and inclusive course design. Analyze the provided text for comprehension barriers. Return ONLY a JSON array (no markdown, no preamble) where each item is: { "phrase": string, "category": string, "affected": string, "suggestion": string, "severity": "high"|"medium"|"low" }. Categories must be one of: Jargon, Cultural assumption, Readability, Implicit knowledge, Biased framing.`
  const raw = await callAI(system, text)
  return parseJSON(raw)
}

export async function generateMicroChecks(passage) {
  const system = `You are an expert instructional designer. Generate comprehension micro-checks for the provided course content. Return ONLY a JSON array where each item is: { "question": string, "options": string[], "correct": number, "conceptTag": string, "misconceptions": { [optionIndex: string]: string } }. Generate exactly 3 questions. Each wrong answer must have a specific misconception mapped to it.`
  const raw = await callAI(system, typeof passage === 'string' ? passage : JSON.stringify(passage))
  return parseJSON(raw)
}

export async function generateKnowledgeGraph(syllabusText) {
  const system = `You are a knowledge graph architect. Parse the provided course syllabus or topic list and extract a concept dependency graph. Return ONLY a JSON object (no markdown): { "nodes": [{ "id": string, "label": string, "week": number }], "links": [{ "source": string, "target": string, "reason": string }] }. The id must be kebab-case. Nodes should represent atomic concepts, not weeks or sessions. Links should point from prerequisite to dependent concept.`
  const raw = await callAI(system, syllabusText)
  return parseJSON(raw)
}

export async function getResourceRecommendations(conceptLabel, preferences) {
  const system = `You are a learning resource advisor. Given a concept and a student's learning preferences, suggest 3 learning resources. Return ONLY a JSON array: [{ "type": "video"|"article"|"podcast", "title": string, "description": string, "url": string, "language": string }]. Make the resources realistic and specific. The url can be a plausible YouTube, Spotify, or article URL.`
  const raw = await callAI(system, `Concept: ${conceptLabel}. Preferences: ${JSON.stringify(preferences)}`)
  return parseJSON(raw)
}

export async function generateStudyGuide(content) {
  const system = `You are an expert learning coach. Analyze the provided course content and generate a comprehensive study guide. Return ONLY a JSON object (no markdown, no preamble):
{
  "summary": "2-3 sentence plain-English summary",
  "bullets": ["key point 1", "key point 2"],
  "mindmap": {
    "center": "main topic label",
    "branches": [
      { "label": "branch label", "color": "#hex", "children": ["child1", "child2", "child3"] }
    ]
  },
  "memoryAids": [
    { "type": "acronym",  "title": "short title", "content": "..." },
    { "type": "analogy",  "title": "short title", "content": "..." },
    { "type": "story",    "title": "short title", "content": "..." },
    { "type": "chunking", "title": "short title", "content": "..." }
  ]
}
Generate 5-8 bullet points. Generate 3-5 branches with 2-4 children each. Use vivid, memorable language for memory aids. Use distinct hex colors for branches (e.g. #818cf8, #67e8f9, #fbbf24, #34d399, #f87171).`
  const raw = await callAI(system, content)
  return parseJSON(raw)
}
