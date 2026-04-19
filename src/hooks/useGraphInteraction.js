import { useState, useCallback, useRef } from 'react'
import { getNeighborIds } from '../utils/graphHelpers.js'

export function useGraphInteraction(links) {
  const [hoveredNode, setHoveredNode]   = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [tooltipPos, setTooltipPos]     = useState({ x: 0, y: 0 })
  const [neighborIds, setNeighborIds]   = useState(new Set())
  const frameRef = useRef(null)

  const onNodeHover = useCallback((node, prevNode) => {
    setHoveredNode(node || null)
    if (node) {
      setNeighborIds(getNeighborIds(node.id, links))
    } else {
      setNeighborIds(new Set())
    }
  }, [links])

  const onNodeClick = useCallback((node) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }, [])

  const onMouseMove = useCallback((e) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      setTooltipPos({ x: e.clientX, y: e.clientY })
    })
  }, [])

  const closePanel = useCallback(() => setSelectedNode(null), [])

  return {
    hoveredNode,
    selectedNode,
    tooltipPos,
    neighborIds,
    onNodeHover,
    onNodeClick,
    onMouseMove,
    closePanel,
  }
}
