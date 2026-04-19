import { useRef, useEffect, useCallback, useState, memo } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import { studentAccuracyColor } from '../data/mockStudentGraph.js'

const KnowledgeGraph3D = memo(({ graphData, onNodeClick, highlightCourse, height = 500, interactive = true }) => {
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
    const col = studentAccuracyColor(node.accuracy ?? 0.5)
    if (hovered?.id === node.id) return '#ffffff'
    return col
  }, [highlightCourse, hovered])

  const nodeVal = useCallback((node) => {
    if (hovered?.id === node.id) return 10
    return 6
  }, [hovered])

  const nodeThreeObject = useCallback((node) => {
    const isHighlighted = highlightCourse && node.course !== highlightCourse
    const r = hovered?.id === node.id ? 8 : 5.5
    const color = studentAccuracyColor(node.accuracy ?? 0.5)

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
  }, [hovered, highlightCourse])

  const linkColor = useCallback((link) => {
    return link.crossCourse ? '#FFD6A8' : 'rgba(180,171,201,0.2)'
  }, [])

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
        <div className="absolute bottom-4 left-4 bg-claro-slate/95 border border-white/10 rounded-lg px-3 py-2 text-xs pointer-events-none">
          <div className="text-claro-text font-medium">{hovered.label}</div>
          <div className="text-claro-muted">{hovered.course}</div>
          <div style={{ color: studentAccuracyColor(hovered.accuracy) }}>
            Accuracy: {Math.round((hovered.accuracy || 0) * 100)}%
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {[['#9EE4D4','>70%'],['#FFD6A8','50–70%'],['#FFB8C8','<50%']].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-[10px] text-claro-muted">
            <span className="w-2 h-2 rounded-full" style={{ background: c }} />
            {l}
          </div>
        ))}
      </div>
    </div>
  )
})

KnowledgeGraph3D.displayName = 'KnowledgeGraph3D'
export default KnowledgeGraph3D
