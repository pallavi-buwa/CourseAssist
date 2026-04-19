import { useRef, useCallback, useEffect, useState, memo } from 'react'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

// Lazy-load ForceGraph2D to avoid the AFRAME global requirement at module evaluation time
let ForceGraph2DModule = null

const KnowledgeGraph2D = memo(({ graphData, onNodeClick, liveUpdates }) => {
  const fgRef = useRef()
  const containerRef = useRef()
  const [FG, setFG] = useState(null)
  const [dims, setDims] = useState({ width: 800, height: 600 })

  // Lazy-load the library
  useEffect(() => {
    if (ForceGraph2DModule) { setFG(() => ForceGraph2DModule); return }
    import('react-force-graph').then(m => {
      ForceGraph2DModule = m.ForceGraph2D
      setFG(() => m.ForceGraph2D)
    }).catch(() => {
      // Fallback: use canvas-based simple render
      setFG('fallback')
    })
  }, [])

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ width: Math.floor(width), height: Math.floor(height) })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Refresh graph on live updates
  useEffect(() => {
    fgRef.current?.refresh?.()
  }, [liveUpdates])

  const nodeColor = useCallback((node) => comprehensionColor(node), [liveUpdates])
  const nodeVal   = useCallback(() => 6, [])
  const nodeLabel = useCallback((node) => `${node.label} — ${Math.round((node.comprehension ?? 0.5) * 100)}%`, [liveUpdates])
  const linkColor = useCallback(() => 'rgba(45,106,79,0.28)', [])
  const linkWidth = useCallback(() => 1, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', background: '#FDF6ED' }}>
      {!FG && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-sm">Loading graph…</div>
        </div>
      )}

      {FG && FG !== 'fallback' && (
        <FG
          ref={fgRef}
          graphData={graphData}
          width={dims.width}
          height={dims.height}
          backgroundColor="#FDF6ED"
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
      )}

      {FG === 'fallback' && <FallbackGraph graphData={graphData} onNodeClick={onNodeClick} dims={dims} />}

      {/* Legend */}
      <div className="pointer-events-none absolute top-3 right-3 flex max-h-[min(70vh,320px)] max-w-[11rem] flex-col gap-0.5 overflow-y-auto rounded-lg border border-[#2D6A4F]/18 bg-[#FFFCF7]/95 p-2 shadow-sm">
        <div className="text-[10px] font-medium uppercase tracking-wider text-claro-muted">Score</div>
        <p className="text-[9px] leading-tight text-claro-muted/90">Green/teal = strong · gold–rust = risk</p>
        {SCORE_BANDS.map(b => (
          <div key={b.range} className="flex items-center gap-1.5 text-[9px] text-claro-text/90">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/5" style={{ background: b.color }} />
            <span>{b.range} · {b.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

// Simple canvas fallback that doesn't require react-force-graph
function FallbackGraph({ graphData, onNodeClick, dims }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = dims
    canvas.width = width
    canvas.height = height

    // Simple static layout: place nodes in a circle
    const nodes = graphData.nodes.map((n, i) => {
      const angle = (i / graphData.nodes.length) * Math.PI * 2
      const r = Math.min(width, height) * 0.35
      return { ...n, x: width / 2 + Math.cos(angle) * r, y: height / 2 + Math.sin(angle) * r }
    })
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

    ctx.clearRect(0, 0, width, height)

    // Draw links
    ctx.strokeStyle = 'rgba(45,106,79,0.28)'
    ctx.lineWidth = 1
    graphData.links.forEach(l => {
      const s = nodeMap[l.source?.id ?? l.source]
      const t = nodeMap[l.target?.id ?? l.target]
      if (!s || !t) return
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(t.x, t.y); ctx.stroke()
    })

    // Draw nodes
    nodes.forEach(n => {
      const color = comprehensionColor(n)
      ctx.beginPath()
      ctx.arc(n.x, n.y, 7, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
      ctx.fillStyle = 'rgba(27,67,50,0.85)'
      ctx.font = '9px Lato, sans-serif'
      ctx.fillText(n.label?.split(' ')[0] ?? '', n.x + 9, n.y + 3)
    })

    // Click handler
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left, my = e.clientY - rect.top
      const hit = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 10)
      if (hit) onNodeClick?.(hit)
    }
    canvas.addEventListener('click', handleClick)
    return () => canvas.removeEventListener('click', handleClick)
  }, [graphData, dims, onNodeClick])

  return <canvas ref={canvasRef} style={{ display: 'block', cursor: 'crosshair' }} />
}

KnowledgeGraph2D.displayName = 'KnowledgeGraph2D'
export default KnowledgeGraph2D
