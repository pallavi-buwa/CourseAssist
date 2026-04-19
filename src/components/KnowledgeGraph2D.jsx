import { useRef, useCallback, useEffect, memo } from 'react'
import { ForceGraph2D as ForceGraph } from 'react-force-graph'
import { comprehensionColor } from '../data/mockGraphMarketing.js'

const KnowledgeGraph2D = memo(({ graphData, onNodeClick, liveUpdates, width, height = 500 }) => {
  const fgRef = useRef()
  const prevScores = useRef({})

  // Animate color changes when liveUpdates changes
  useEffect(() => {
    if (!liveUpdates || !fgRef.current) return
    // Update node comprehension in place
    graphData.nodes.forEach(node => {
      if (liveUpdates[node.id] !== undefined) {
        node.comprehension = liveUpdates[node.id]
      }
    })
    fgRef.current.refresh?.()
  }, [liveUpdates, graphData.nodes])

  const nodeColor = useCallback((node) => {
    const score = liveUpdates?.[node.id] ?? node.comprehension
    return comprehensionColor(score)
  }, [liveUpdates])

  const nodeVal = useCallback(() => 6, [])

  const nodeLabel = useCallback((node) => {
    const score = liveUpdates?.[node.id] ?? node.comprehension
    return `${node.label} — ${Math.round(score * 100)}%`
  }, [liveUpdates])

  const linkColor = useCallback(() => 'rgba(100,116,139,0.4)', [])
  const linkWidth = useCallback(() => 1, [])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <ForceGraph
        ref={fgRef}
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="#111827"
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        nodeLabel={nodeLabel}
        linkColor={linkColor}
        linkWidth={linkWidth}
        onNodeClick={onNodeClick}
        cooldownTime={3000}
        d3AlphaDecay={0.025}
        enableNodeDrag={true}
      />

      {/* Legend */}
      <div className="absolute top-3 right-3 bg-gray-900/80 border border-gray-700 rounded-lg p-2 flex flex-col gap-1">
        <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">Comprehension</div>
        {[['#22c55e','>70%'],['#f59e0b','50–70%'],['#ef4444','<50%']].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-[10px] text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
          </div>
        ))}
      </div>
    </div>
  )
})

KnowledgeGraph2D.displayName = 'KnowledgeGraph2D'
export default KnowledgeGraph2D
