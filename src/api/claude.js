const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL   = 'claude-sonnet-4-20250514'
const BASE    = 'https://api.anthropic.com/v1/messages'

async function callClaude(system, userMessage) {
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
      max_tokens: 1000,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) throw new Error(`Claude API error: ${res.status}`)
  const data = await res.json()
  return data.content[0].text
}

export async function analyzeForInclusivity(text) {
  const system = `You are an expert in educational equity and inclusive course design. Analyze the provided text for comprehension barriers. Return ONLY a JSON array (no markdown, no preamble) where each item is: { phrase: string, category: string, affected: string, suggestion: string }. Categories must be one of: Jargon, Cultural assumption, Readability, Implicit knowledge, Biased framing.`
  const raw = await callClaude(system, text)
  return JSON.parse(raw)
}

export async function generateMicroChecks(passage) {
  const system = `You are an expert instructional designer. Generate comprehension micro-checks for the provided course content. Return ONLY a JSON array where each item is: { question: string, options: string[], correct: number, conceptTag: string, misconceptions: { [optionIndex]: string } }. Generate 3 questions. Each wrong answer must have a specific misconception mapped to it.`
  const raw = await callClaude(system, typeof passage === 'string' ? passage : JSON.stringify(passage))
  return JSON.parse(raw)
}

export async function generateKnowledgeGraph(syllabusText) {
  const system = `You are a knowledge graph architect. Parse the provided course syllabus or topic list and extract a concept dependency graph. Return ONLY a JSON object (no markdown): { nodes: [{ id: string, label: string, week: number }], links: [{ source: string, target: string, reason: string }] }. The id must be kebab-case. Nodes should represent atomic concepts, not weeks or sessions. Links should point from prerequisite to dependent concept.`
  const raw = await callClaude(system, syllabusText)
  return JSON.parse(raw)
}

export async function getResourceRecommendations(conceptLabel, preferences) {
  const system = `You are a learning resource advisor. Given a concept and a student's learning preferences, suggest 3 learning resources. Return ONLY a JSON array: [{ type: 'video'|'article'|'podcast', title: string, description: string, url: string, language: string }]. Make the resources realistic and specific. The url can be a plausible YouTube, Spotify, or article URL.`
  const raw = await callClaude(system, `Concept: ${conceptLabel}. Preferences: ${JSON.stringify(preferences)}`)
  return JSON.parse(raw)
}
