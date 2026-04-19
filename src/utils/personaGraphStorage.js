const PREFIX_STUDENT = 'eg_ai_student_graph_v1_'
const PREFIX_PROFESSOR = 'eg_ai_professor_graph_v1_'

function norm(email) {
  return String(email || '').trim().toLowerCase()
}

export function readCachedStudentAIGraph(email) {
  try {
    const raw = localStorage.getItem(PREFIX_STUDENT + norm(email))
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.nodes?.length) return null
    return data
  } catch {
    return null
  }
}

export function writeCachedStudentAIGraph(email, graph) {
  localStorage.setItem(PREFIX_STUDENT + norm(email), JSON.stringify(graph))
}

export function readCachedProfessorAIGraph(email, courseId) {
  try {
    const raw = localStorage.getItem(PREFIX_PROFESSOR + norm(email) + '_' + courseId)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.nodes?.length) return null
    return data
  } catch {
    return null
  }
}

export function writeCachedProfessorAIGraph(email, courseId, graph) {
  localStorage.setItem(PREFIX_PROFESSOR + norm(email) + '_' + courseId, JSON.stringify(graph))
}
