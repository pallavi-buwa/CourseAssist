import { db } from './config.js'

// In-memory fallback store when Firebase is unavailable
const memStore = {}
const listeners = {}

// Called when a student answers a micro-check
export async function writeStudentAnswer({ studentId, conceptId, correct }) {
  if (!db) {
    // Fallback: store in memory
    if (!memStore[conceptId]) memStore[conceptId] = {}
    memStore[conceptId][studentId] = { correct, timestamp: Date.now() }
    // Notify any subscribed listeners
    Object.values(listeners[conceptId] || {}).forEach(cb => {
      const answers = Object.values(memStore[conceptId])
      const correctCount = answers.filter(a => a.correct).length
      cb({ correct: correctCount, total: answers.length, score: correctCount / answers.length })
    })
    return
  }

  try {
    const { ref, set } = await import('firebase/database')
    await set(ref(db, `answers/${conceptId}/${studentId}`), {
      correct, timestamp: Date.now()
    })
  } catch (e) {
    console.warn('Firebase write failed, using memory store', e)
  }
}

// Called in professor dashboard to listen for changes
export function subscribeToConceptScores(conceptId, callback) {
  if (!db) {
    // Fallback: register in-memory listener
    if (!listeners[conceptId]) listeners[conceptId] = {}
    const id = Math.random().toString(36).slice(2)
    listeners[conceptId][id] = callback
    // Return existing data immediately if any
    if (memStore[conceptId]) {
      const answers = Object.values(memStore[conceptId])
      const correctCount = answers.filter(a => a.correct).length
      callback({ correct: correctCount, total: answers.length, score: correctCount / answers.length })
    }
    return () => { delete listeners[conceptId]?.[id] }
  }

  let unsubscribe = () => {}
  import('firebase/database').then(({ ref, onValue }) => {
    const conceptRef = ref(db, `answers/${conceptId}`)
    unsubscribe = onValue(conceptRef, (snapshot) => {
      const data = snapshot.val() || {}
      const answers = Object.values(data)
      const correctCount = answers.filter(a => a.correct).length
      const total = answers.length
      callback({ correct: correctCount, total, score: total > 0 ? correctCount / total : 0 })
    })
  })
  return () => unsubscribe()
}
