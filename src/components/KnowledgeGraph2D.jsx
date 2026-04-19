import { useRef, useCallback, useEffect, useState, memo } from 'react'
import { comprehensionColor } from '../data/mockGraphMarketing.js'
import { useTheme } from '../context/ThemeContext.jsx'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'

// Lazy-load ForceGraph2D to avoid the AFRAME global requirement at module evaluation time
let ForceGraph2DModule = null

const KnowledgeGraph2D = memo(({ graphData, onNodeClick, liveUpdates }) => {
  const { canvasHex, isDark } = useTheme()
  const fgRef = useRef()
  const shellRef = useRef(null)
  const containerRef = useRef()
  const [FG, setFG] = useState(null)
  const [dims, setDims] = useState({ width: 800, height: 600 })
  const [isFs, setIsFs] = useState(false)

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

  useEffect(() => {
    const onFs = () => setIsFs(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => { })
    else document.exitFullscreen?.().catch(() => { })
  }, [])

  const zoomBy2d = useCallback((factor) => {
    const fg = fgRef.current
    if (!fg?.zoom) return
    const cur = fg.zoom()
    const next = factor > 1
      ? Math.min(cur * factor, typeof fg.maxZoom === 'function' ? fg.maxZoom() : 16)
      : Math.max(cur * factor, typeof fg.minZoom === 'function' ? fg.minZoom() : 0.02)
    fg.zoom(next, 220)
  }, [])

  const handleFit = useCallback(() => {
    fgRef.current?.zoomToFit?.(450, 24)
  }, [])

  const handleDownloadPng = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return
    try {
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `class-graph-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
      a.click()
    } catch {
      /* ignore */
    }
  }, [])

  const nodeColor = useCallback((node) => comprehensionColor(node), [liveUpdates])
  const nodeVal = useCallback(() => 6, [])
  const nodeLabel = useCallback((node) => `${node.label}: ${Math.round((node.comprehension ?? 0.5) * 100)}%`, [liveUpdates])
  const linkColor = useCallback(
    () => (isDark ? 'rgba(34,197,94,0.24)' : 'rgba(34,197,94,0.22)'),
    [isDark]
  )
  const linkWidth = useCallback(() => 1, [])

  const zoomControlsReady = FG != null && FG !== 'fallback'

  return (
    <div
      ref={shellRef}
      className="relative flex h-full min-h-[320px] w-full flex-col bg-claro-canvas"
    >
      <div
        className="pointer-events-auto absolute left-2 top-2 z-[60] flex flex-wrap items-center gap-1 rounded-lg border border-claro-indigo/20 bg-claro-panel/95 p-1 shadow-sm"
        onMouseDown={e => e.stopPropagation()}
        onWheel={e => e.stopPropagation()}
      >
        <button
          type="button"
          title="Zoom in"
          disabled={!zoomControlsReady}
          onClick={() => zoomBy2d(1.22)}
          className="rounded-md px-2 py-1 text-xs font-medium text-claro-text hover:bg-claro-indigo/15 disabled:opacity-35"
        >
          +
        </button>
        <button
          type="button"
          title="Zoom out"
          disabled={!zoomControlsReady}
          onClick={() => zoomBy2d(1 / 1.22)}
          className="rounded-md px-2 py-1 text-xs font-medium text-claro-text hover:bg-claro-indigo/15 disabled:opacity-35"
        >
          −
        </button>
        <button
          type="button"
          title="Fit graph in view"
          disabled={!zoomControlsReady}
          onClick={handleFit}
          className="rounded-md px-2 py-1 text-xs text-claro-muted hover:bg-claro-indigo/15 hover:text-claro-text disabled:opacity-35"
        >
          Fit
        </button>
        <span className="mx-0.5 h-4 w-px bg-claro-indigo/20" aria-hidden />
        <button
          type="button"
          title={isFs ? 'Exit full screen' : 'Full screen'}
          onClick={toggleFullscreen}
          className="rounded-md px-2 py-1 text-xs text-claro-muted hover:bg-claro-indigo/15 hover:text-claro-text"
        >
          {isFs ? 'Exit' : 'Full'}
        </button>
        <button
          type="button"
          title="Download snapshot (PNG)"
          onClick={handleDownloadPng}
          className="rounded-md px-2 py-1 text-xs text-claro-muted hover:bg-claro-indigo/15 hover:text-claro-text"
        >
          PNG
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 bg-claro-canvas"
        style={{ width: '100%', height: '100%' }}
      >
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
            backgroundColor={canvasHex}
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

        {FG === 'fallback' && (
          <FallbackGraph
            graphData={graphData}
            onNodeClick={onNodeClick}
            dims={dims}
            isDark={isDark}
            canvasHex={canvasHex}
          />
        )}

        {/* Legend */}
        <div className="pointer-events-none absolute top-3 right-3 flex max-h-[min(70vh,320px)] max-w-[11rem] flex-col gap-0.5 overflow-y-auto rounded-lg border border-claro-indigo/18 bg-claro-panel/95 p-2 shadow-sm">
          <div className="text-[10px] font-medium uppercase tracking-wider text-claro-muted">Score</div>
          <p className="text-[9px] leading-tight text-claro-muted/90">Green = strong · yellow to red = risk</p>
          {SCORE_BANDS.map(b => (
            <div key={b.range} className="flex items-center gap-1.5 text-[9px] text-claro-text/90">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-white/10" style={{ background: b.color }} />
              <span>{b.range} · {b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

// Simple canvas fallback that doesn't require react-force-graph
function FallbackGraph({ graphData, onNodeClick, dims, isDark, canvasHex }) {
  const canvasRef = useRef()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = dims
    canvas.width = width
    canvas.height = height

    ctx.fillStyle = canvasHex
    ctx.fillRect(0, 0, width, height)

    // Simple static layout: place nodes in a circle
    const nodes = graphData.nodes.map((n, i) => {
      const angle = (i / graphData.nodes.length) * Math.PI * 2
      const r = Math.min(width, height) * 0.35
      return { ...n, x: width / 2 + Math.cos(angle) * r, y: height / 2 + Math.sin(angle) * r }
    })
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

    // Draw links
    ctx.strokeStyle = isDark ? 'rgba(34,197,94,0.24)' : 'rgba(34,197,94,0.22)'
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
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.9)' : 'rgba(27,67,50,0.85)'
      ctx.font = '9px "Brandon Grotesque", system-ui, sans-serif'
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
  }, [graphData, dims, onNodeClick, isDark, canvasHex])

  return <canvas ref={canvasRef} style={{ display: 'block', cursor: 'crosshair' }} />
}

KnowledgeGraph2D.displayName = 'KnowledgeGraph2D'
export default KnowledgeGraph2D
