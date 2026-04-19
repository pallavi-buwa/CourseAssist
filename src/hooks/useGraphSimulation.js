import { useState, useEffect, useCallback, useRef } from 'react'

const STATUSES = ['default', 'active', 'mastered', 'struggling']

export function useGraphSimulation(nodes) {
  const [nodeStates, setNodeStates] = useState({})
  const [isLive, setIsLive]         = useState(false)
  const [activeFilter, setActiveFilter] = useState(null) // null = all
  const intervalRef = useRef(null)

  // Pulse random nodes when live
  useEffect(() => {
    if (!isLive || !nodes.length) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      const count  = Math.floor(Math.random() * 5) + 2
      const picked = []
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * nodes.length)
        picked.push(nodes[idx].id)
      }
      setNodeStates(prev => {
        const next = { ...prev }
        picked.forEach(id => {
          const rand = Math.random()
          next[id] = rand < 0.3 ? 'struggling' : rand < 0.65 ? 'active' : 'mastered'
        })
        return next
      })
    }, 1400)
    return () => clearInterval(intervalRef.current)
  }, [isLive, nodes])

  const toggleLive = useCallback(() => setIsLive(v => !v), [])

  const resetStates = useCallback(() => {
    setNodeStates({})
    setIsLive(false)
  }, [])

  const setSubjectFilter = useCallback((subjectId) => {
    setActiveFilter(prev => prev === subjectId ? null : subjectId)
  }, [])

  // Merge runtime states into node objects (immutable original preserved)
  const enrichedNodes = nodes.map(node => ({
    ...node,
    status: nodeStates[node.id] || node.status || 'default',
  }))

  return {
    enrichedNodes,
    nodeStates,
    isLive,
    activeFilter,
    toggleLive,
    resetStates,
    setSubjectFilter,
  }
}
