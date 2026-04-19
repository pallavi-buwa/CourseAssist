import { useRef, useEffect, useCallback, useState, useMemo, memo } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import { studentAccuracyColor } from '../data/mockStudentGraph.js'
import { SCORE_BANDS } from '../utils/nodeColorScale.js'
import { useTheme } from '../context/ThemeContext.jsx'

const KnowledgeGraph3D = memo(({ graphData, onNodeClick, highlightCourse, height = 500, interactive = true }) => {
  const { canvasHex, isDark } = useTheme()
  const fgRef = useRef()
  const wrapRef = useRef(null)
  const [dims, setDims] = useState({
    width: typeof window !== 'undefined' ? Math.min(1200, Math.max(320, window.innerWidth - 48)) : 800,
    height,
  })
  const [hovered, setHovered] = useState(null)
  const hasInteracted = useRef(false)

  // Auto-rotate on load, stop on interaction
  useEffect(() => {
    if (!fgRef.current) return
    fgRef.current.cameraPosition({ x: 0, y: 0, z: 280 })
    let angle = 0
    const timer = setInterval(() => {
      if (hasInteracted.current) { clearInterval(timer); return }
      angle += 0.005
      fgRef.current?.cameraPosition({
        x: 280 * Math.sin(angle),
        y: 40,
        z: 280 * Math.cos(angle),
      })
    }, 16)
    return () => clearInterval(timer)
  }, [])

  // ForceGraph defaults width to container — in flex layouts that can be 0 until measured.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const { width, height: h } = entries[0].contentRect
      const w = Math.floor(width)
      const hPx = Math.floor(h)
      const nextH = Math.max(320, hPx > 80 ? hPx : height)
      if (w >= 120) setDims({ width: w, height: nextH })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [height])

  const stopRotate = useCallback(() => { hasInteracted.current = true }, [])

  const degreeById = useMemo(() => {
    const m = {}
    graphData?.links?.forEach(l => {
      const s = typeof l.source === 'object' ? l.source.id : l.source
      const t = typeof l.target === 'object' ? l.target.id : l.target
      if (s) m[s] = (m[s] || 0) + 1
      if (t) m[t] = (m[t] || 0) + 1
    })
    return m
  }, [graphData])

  // Pull linked nodes closer (safe-guarded — bad d3 calls can break the canvas).
  const graphSig = `${graphData?.nodes?.length ?? 0}-${graphData?.links?.length ?? 0}`
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        const fg = fgRef.current
        if (!fg) return
        const link = fg.d3Force('link')
        if (link) {
          link.distance(l => (l.crossCourse ? 120 : 48))
          link.strength(l => (l.crossCourse ? 0.45 : 0.75))
        }
        const charge = fg.d3Force('charge')
        if (charge) charge.strength(-85)
        fg.d3ReheatSimulation?.()
      } catch {
        /* keep default simulation */
      }
    })
    return () => cancelAnimationFrame(id)
  }, [graphSig])

  const nodeColor = useCallback((node) => {
    if (highlightCourse && node.course !== highlightCourse) return 'rgba(100,100,100,0.15)'
    const col = studentAccuracyColor(node, { degree: degreeById[node.id] })
    if (hovered?.id === node.id) return canvasHex
    return col
  }, [highlightCourse, hovered, degreeById, canvasHex])

  const nodeVal = useCallback((node) => {
    if (hovered?.id === node.id) return 10
    return 6
  }, [hovered])

  const nodeThreeObject = useCallback((node) => {
    const isHighlighted = highlightCourse && node.course !== highlightCourse
    const r = hovered?.id === node.id ? 8 : 5.5
    const color = studentAccuracyColor(node, { degree: degreeById[node.id] })

    const group = new THREE.Group()

    // Core
    const geo = new THREE.SphereGeometry(r, 14, 10)
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: hovered?.id === node.id ? 0.9 : 0.25,
      transparent: isHighlighted,
      opacity: isHighlighted ? 0.12 : 1,
    })
    group.add(new THREE.Mesh(geo, mat))

    // Glow halo for hovered
    if (hovered?.id === node.id) {
      const hGeo = new THREE.SphereGeometry(r * 2, 10, 8)
      const hMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
      group.add(new THREE.Mesh(hGeo, hMat))
    }

    return group
  }, [hovered, highlightCourse, degreeById])

  const linkColor = useCallback((link) => {
    if (link.crossCourse) return isDark ? '#eab308' : '#ca8a04'
    return isDark ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.25)'
  }, [isDark])

  const linkWidth = useCallback((link) => {
    return link.crossCourse ? 2 : 0.5
  }, [])

  const linkOpacity = useCallback((link) => {
    return link.crossCourse ? 0.8 : 0.4
  }, [])

  const handleNodeClick = useCallback((node) => {
    stopRotate()
    onNodeClick?.(node)
  }, [onNodeClick, stopRotate])

  return (
    <div
      ref={wrapRef}
      onMouseDown={stopRotate}
      onWheel={stopRotate}
      className="w-full h-full min-h-[480px] flex-1 min-w-0"
      style={{ position: 'relative' }}
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={dims.width}
        height={dims.height}
        backgroundColor="rgba(0,0,0,0)"
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={() => ''}
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.4}
        onNodeHover={setHovered}
        onNodeClick={handleNodeClick}
        enableNodeDrag={interactive}
        enableNavigationControls={interactive}
        showNavInfo={false}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        cooldownTime={3000}
      />
      {hovered && (
        <div className="absolute bottom-4 left-4 max-w-[min(calc(100vw-2rem),20rem)] bg-claro-panel border border-claro-indigo/20 rounded-lg px-4 py-3 text-sm pointer-events-none shadow-sm">
          <div className="text-claro-text font-medium text-base leading-snug">{hovered.label}</div>
          <div className="text-claro-muted text-sm mt-0.5">{hovered.course}</div>
          <div className="text-sm font-medium mt-1" style={{ color: studentAccuracyColor(hovered, { degree: degreeById[hovered.id] }) }}>
            Accuracy: {Math.round((hovered.accuracy || 0) * 100)}%
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="pointer-events-none absolute top-3 right-3 flex max-w-[13rem] flex-col gap-1 rounded-lg border border-claro-indigo/15 bg-claro-panel p-3 shadow-sm">
        <div className="text-xs font-medium text-claro-text">Accuracy</div>
        {SCORE_BANDS.map(b => (
          <div key={b.range} className="flex items-center gap-2 text-xs text-claro-muted">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-1 ring-black/10" style={{ background: b.color }} />
            <span>{b.range}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

KnowledgeGraph3D.displayName = 'KnowledgeGraph3D'
export default KnowledgeGraph3D
