const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4.1-mini'
const BASE = 'https://api.openai.com/v1/responses'

async function callAI(instructions, input) {
  if (!API_KEY || API_KEY === 'your_key_here') {
    throw new Error('VITE_OPENAI_API_KEY not set')
  }

  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input,
      max_output_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`OpenAI API error ${res.status}: ${err?.error?.message || res.statusText}`)
  }

  const data = await res.json()
  return extractText(data)
}

function extractText(response) {
  if (response.output_text) return response.output_text

  const text = response.output
    ?.flatMap(item => item.content || [])
    ?.filter(content => content.type === 'output_text')
    ?.map(content => content.text)
    ?.join('')

  if (!text) throw new Error('OpenAI response did not include text output')
  return text
}

function parseJSON(raw) {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  return JSON.parse(cleaned)
}

export async function analyzeForInclusivity(text) {
  const instructions = `You are an expert in educational equity and inclusive course design. Analyze the provided text for comprehension barriers. Return ONLY a JSON array (no markdown, no preamble) where each item is: { "phrase": string, "category": string, "affected": string, "suggestion": string, "severity": "high"|"medium"|"low" }. Categories must be one of: Jargon, Cultural assumption, Readability, Implicit knowledge, Biased framing.`
  const raw = await callAI(instructions, text)
  return parseJSON(raw)
}

export async function generateMicroChecks(passage) {
  const instructions = `You are an expert instructional designer. Generate comprehension micro-checks for the provided course content. Return ONLY a JSON array where each item is: { "question": string, "options": string[], "correct": number, "conceptTag": string, "misconceptions": { [optionIndex: string]: string } }. Generate exactly 3 questions. Each wrong answer must have a specific misconception mapped to it.`
  const raw = await callAI(instructions, typeof passage === 'string' ? passage : JSON.stringify(passage))
  return parseJSON(raw)
}

export async function generateKnowledgeGraph(syllabusText) {
  const instructions = `You are a knowledge graph architect. Parse the provided course syllabus or topic list and extract a concept dependency graph. Return ONLY a JSON object (no markdown): { "nodes": [{ "id": string, "label": string, "week": number }], "links": [{ "source": string, "target": string, "reason": string }] }. The id must be kebab-case. Nodes should represent atomic concepts, not weeks or sessions. Links should point from prerequisite to dependent concept.`
  const raw = await callAI(instructions, syllabusText)
  return parseJSON(raw)
}

function normalizeResource(resource) {
  const type = resource?.type === 'article' ? 'text' : resource?.type
  return {
    type: ['video', 'text', 'pdf', 'podcast', 'interactive'].includes(type) ? type : 'text',
    title: String(resource?.title || '').trim(),
    description: String(resource?.description || '').trim(),
    url: String(resource?.url || '').trim(),
    language: String(resource?.language || 'English').trim(),
    source: String(resource?.source || '').trim(),
    why: String(resource?.why || '').trim(),
  }
}

function hasUsableDirectUrl(resource) {
  try {
    const url = new URL(resource.url)
    const host = url.hostname.toLowerCase()
    const path = url.pathname.toLowerCase()
    const search = url.search.toLowerCase()
    const blockedSearchPages = [
      'google.com/search',
      'www.google.com/search',
      'youtube.com/results',
      'www.youtube.com/results',
      'open.spotify.com/search',
    ]

    if (!['http:', 'https:'].includes(url.protocol)) return false
    if (blockedSearchPages.some(blocked => `${host}${path}`.includes(blocked))) return false
    if (search.includes('search_query=') || search.includes('?q=')) return false
    return Boolean(resource.title && resource.description)
  } catch {
    return false
  }
}

export async function getResourceRecommendations(concept, preferences, candidateResources = []) {
  const instructions = `You are CourseAssist's AI learning-resource curator.

Your job is to generate direct, clickable learning links for a student based on a knowledge-graph node, course context, and learning preferences.

Rules:
- Return ONLY a JSON array. No markdown, no preamble.
- Each item must be: { "type": "video"|"text"|"pdf"|"podcast"|"interactive", "title": string, "description": string, "url": string, "language": string, "source": string, "why": string }.
- Generate 4-6 resources.
- Use direct URLs to real pages, videos, PDFs, course pages, podcasts, or interactive resources.
- Do not return Google searches, YouTube search pages, Spotify search pages, placeholder URLs, homepages with no learning target, or "#".
- Prefer reputable sources: universities, documentation, open textbooks, major education platforms, official publications, well-known business/technology publishers.
- If candidate resources are supplied, use them as verified examples and select/adapt the most relevant ones before adding any outside resources.
- If the student asks for a non-English language and you know a reliable resource in that language, include it. Otherwise use English and explain the fit in "why".
- The links must match the node topic, not just the broad course.`

  const node = typeof concept === 'string' ? { label: concept } : concept
  const raw = await callAI(instructions, JSON.stringify({
    node,
    preferences,
    candidateResources,
  }))
  const parsed = parseJSON(raw)
  const resources = Array.isArray(parsed) ? parsed : parsed.resources

  if (!Array.isArray(resources)) return []

  return resources
    .map(normalizeResource)
    .filter(hasUsableDirectUrl)
    .slice(0, 6)
}

export function isOpenAIConfigured() {
  return Boolean(API_KEY && API_KEY !== 'your_key_here')
}

export async function generatePersonaStudentKnowledgeGraph(persona, displayName) {
  const instructions = `You are a learning-science assistant building a personal knowledge graph for one MBA student.

Return ONLY valid JSON (no markdown): { "nodes": [...], "links": [...] }.

Each node must be:
{ "id": string (kebab-case unique), "label": string, "course": string (a subject or module name; use 2–4 distinct course names repeated across nodes, e.g. department titles or module clusters), "accuracy": number between 0.35 and 0.9, "resources": [ { "type": "video"|"article"|"podcast", "title": string, "url": "#" } ] }.

Each link: { "source": node id, "target": node id, "crossCourse": optional true when linking different courses }.

Rules:
- 14–20 nodes, 16–24 links.
- Include at least 2 links with "crossCourse": true.
- Reflect this learner focus in topic choices and accuracies: ${persona.graphFocus || 'balanced MBA learner'}.
- Student name hint (for tone only): ${displayName || 'Student'}.

Do not repeat generic labels; make the graph clearly tailored to the persona.`

  const raw = await callAI(instructions, 'Generate the personalized student knowledge graph JSON now.')
  const { normalizeStudentGraphFromAI } = await import('../utils/normalizeKnowledgeGraph.js')
  return normalizeStudentGraphFromAI(parseJSON(raw))
}

export async function generatePersonaProfessorCohortGraph(persona, courseTitle) {
  const instructions = `You are modeling class-wide comprehension on a single course knowledge graph.

Return ONLY valid JSON (no markdown): { "nodes": [...], "links": [...] }.

Each node: { "id": kebab-case unique, "label": string, "comprehension": number 0.25-0.92 (class average), "week": integer 1-8 }.
Each link: { "source": id, "target": id }.

Rules:
- 18–22 nodes, 18–26 prerequisite-style directed links (foundational → applied).
- Topic domain: ${courseTitle}.
- Cohort characterization (vary strengths/weaknesses accordingly): ${persona.graphFocus || 'Typical MBA section'}.

Make the pattern of high/low comprehension visibly reflect the cohort description.`

  const raw = await callAI(instructions, 'Generate the professor cohort graph JSON now.')
  const { normalizeProfessorGraphFromAI } = await import('../utils/normalizeKnowledgeGraph.js')
  return normalizeProfessorGraphFromAI(parseJSON(raw))
}

export async function generateStudyGuide(content) {
  const instructions = `You are an expert learning coach. Analyze the provided course content and generate a comprehensive study guide. Return ONLY a JSON object (no markdown, no preamble):
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
  const raw = await callAI(instructions, content)
  return parseJSON(raw)
}
