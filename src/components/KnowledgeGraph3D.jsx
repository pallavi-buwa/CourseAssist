import { useRef, useEffect, useCallback, useState, memo } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import { studentAccuracyColor } from '../data/mockStudentGraph.js'

const KnowledgeGraph3D = memo(({ graphData, onNodeClick, highlightCourse, height = 500, interactive = true }) => {
  const fgRef = useRef()
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

  const stopRotate = useCallback(() => { hasInteracted.current = true }, [])

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
    return link.crossCourse ? '#f59e0b' : 'rgba(148,163,184,0.25)'
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
    <div onMouseDown={stopRotate} onWheel={stopRotate} style={{ position: 'relative' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        width={undefined}
        height={height}
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
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-700 rounded-lg px-3 py-2 text-xs pointer-events-none">
          <div className="text-white font-medium">{hovered.label}</div>
          <div className="text-gray-400">{hovered.course}</div>
          <div style={{ color: studentAccuracyColor(hovered.accuracy) }}>
            Accuracy: {Math.round((hovered.accuracy || 0) * 100)}%
          </div>
        </div>
      )}
      {/* Legend */}
      <div className="absolute top-2 right-2 flex flex-col gap-1">
        {[['#22c55e','>70%'],['#f59e0b','50–70%'],['#ef4444','<50%']].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-[10px] text-gray-400">
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
