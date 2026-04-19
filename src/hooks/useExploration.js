import { useState, useCallback, useMemo, useRef } from 'react'
import { getInitialVisibleIds, getDirectNeighborIds, filterLinks } from '../utils/clusterUtils.js'

/**
 * Manages the progressive-reveal exploration system.
 *
 * Level 0 – Overview: top ~30 hub nodes across all subjects
 * Level 1 – Focus:    clicked node + its direct neighbors
 * Level 2+ – Deep:    further neighbors of each successive click
 *
 * Rule: nodes are only ever *added*, never removed, so the force
 * simulation preserves positions of existing nodes.
 */
export function useExploration(allNodes, allLinks) {
  // Stack entries: { nodeId, label, visibleSnapshot (Set copy for back-nav) }
  const [stack, setStack]                   = useState([])
  // Set of node IDs currently visible
  const [visibleIds, setVisibleIds]         = useState(() => getInitialVisibleIds(allNodes))
  // Which node is the current "anchor" (last clicked)
  const [anchorId, setAnchorId]             = useState(null)
  // Highlight set – neighbors of the anchor
  const [focusNeighborIds, setFocusNeighborIds] = useState(new Set())
  // Intro done flag
  const [introComplete, setIntroComplete]   = useState(false)

  const level = stack.length  // 0 = overview, 1 = focus, 2 = deep, ...

  // ── Filtered graph data ───────────────────────────────────────────────────
  const visibleNodes = useMemo(
    () => allNodes.filter(n => visibleIds.has(n.id)),
    [allNodes, visibleIds]
  )
  const visibleLinks = useMemo(
    () => filterLinks(allLinks, visibleIds),
    [allLinks, visibleIds]
  )

  // ── Expand a node ─────────────────────────────────────────────────────────
  const expandNode = useCallback((node) => {
    const neighbors = getDirectNeighborIds(node.id, allLinks)

    setStack(prev => [...prev, {
      nodeId: node.id,
      label:  node.label,
      visibleSnapshot: new Set(visibleIds),
    }])

    setVisibleIds(prev => {
      const next = new Set(prev)
      next.add(node.id)
      neighbors.forEach(id => next.add(id))
      return next
    })

    setAnchorId(node.id)
    setFocusNeighborIds(neighbors)
  }, [allLinks, visibleIds])

  // ── Go back one step ──────────────────────────────────────────────────────
  const goBack = useCallback(() => {
    setStack(prev => {
      if (!prev.length) return prev

      // The top entry holds the snapshot captured *before* it was expanded
      const leaving  = prev[prev.length - 1]
      const newStack = prev.slice(0, -1)

      // Restore to the snapshot from the entry we're leaving
      setVisibleIds(leaving.visibleSnapshot ?? getInitialVisibleIds(allNodes))

      const newAnchor = newStack.length > 0 ? newStack[newStack.length - 1].nodeId : null
      setAnchorId(newAnchor)
      if (newAnchor) {
        setFocusNeighborIds(getDirectNeighborIds(newAnchor, allLinks))
      } else {
        setFocusNeighborIds(new Set())
      }

      return newStack
    })
  }, [allNodes, allLinks])

  // ── Reset to overview ─────────────────────────────────────────────────────
  const resetExploration = useCallback(() => {
    setStack([])
    setVisibleIds(getInitialVisibleIds(allNodes))
    setAnchorId(null)
    setFocusNeighborIds(new Set())
  }, [allNodes])

  const markIntroComplete = useCallback(() => setIntroComplete(true), [])

  // Breadcrumbs for UI
  const breadcrumbs = useMemo(() =>
    stack.map(s => ({ id: s.nodeId, label: s.label })),
    [stack]
  )

  return {
    visibleNodes,
    visibleLinks,
    visibleIds,
    level,
    anchorId,
    focusNeighborIds,
    breadcrumbs,
    introComplete,
    expandNode,
    goBack,
    resetExploration,
    markIntroComplete,
  }
}
