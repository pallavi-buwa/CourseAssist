const FORMAT_CONFIG = {
  video: {
    label: 'Video',
    source: 'YouTube',
    description: 'Watch lessons, walkthroughs, and visual explainers.',
    buildUrl: query => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    querySuffix: 'tutorial lesson explained',
  },
  text: {
    label: 'Text',
    source: 'Web guides',
    description: 'Read articles, notes, and step-by-step guides.',
    buildUrl: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    querySuffix: 'guide article explained',
  },
  article: {
    label: 'Text',
    source: 'Web guides',
    description: 'Read articles, notes, and step-by-step guides.',
    buildUrl: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    querySuffix: 'guide article explained',
  },
  podcast: {
    label: 'Audio',
    source: 'Spotify',
    description: 'Listen to conversations and audio-first lessons.',
    buildUrl: query => `https://open.spotify.com/search/${encodeURIComponent(query)}`,
    querySuffix: 'podcast discussion lesson',
  },
  interactive: {
    label: 'Interactive',
    source: 'Practice search',
    description: 'Find practice, simulations, and guided exercises.',
    buildUrl: query => `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    querySuffix: 'interactive lesson practice simulation',
  },
}

function cleanList(values, fallback) {
  if (!Array.isArray(values)) return fallback
  const cleaned = values.map(value => String(value).trim()).filter(Boolean)
  return cleaned.length ? cleaned : fallback
}

export function buildLearningResources(node, preferences) {
  const topic = node?.label || node?.id || 'course topic'
  const course = node?.course ? ` ${node.course}` : ''
  const languages = cleanList(preferences?.languages, ['English'])
  const formats = cleanList(preferences?.formats, ['video'])
  const resources = []

  languages.forEach(language => {
    formats.forEach(format => {
      const config = FORMAT_CONFIG[format] || FORMAT_CONFIG.text
      const query = `${topic}${course} ${language} ${config.querySuffix}`
      resources.push({
        type: format,
        title: `${config.label} resources for ${topic}`,
        description: config.description,
        source: config.source,
        language,
        url: config.buildUrl(query),
      })
    })
  })

  return resources.slice(0, 6)
}

export function preferenceSummary(preferences) {
  const languages = cleanList(preferences?.languages, ['English'])
  const formats = cleanList(preferences?.formats, ['video'])
    .map(format => FORMAT_CONFIG[format]?.label || format)

  return `${languages.join(', ')} - ${Array.from(new Set(formats)).join(', ')}`
}
