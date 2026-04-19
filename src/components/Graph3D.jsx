import {
  useRef, useCallback, useMemo, useEffect, memo
} from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import * as THREE from 'three'
import { useTheme } from '../context/ThemeContext.jsx'
import { SPACE_BACKGROUND_INT } from '../theme/spaceTheme.js'
import { resolveNodeColor, getLinkColor } from '../utils/graphHelpers.js'
import { nodeRadius } from '../utils/clusterUtils.js'

// ─── Label sprite factory ─────────────────────────────────────────────────────
// Canvas-texture sprite that always faces the camera (billboards).
const labelCache = new Map()
function makeLabelSprite(text, hexColor, opacity = 0.92, isDark = false) {
  const key = `${text}_${hexColor}_${opacity}_${isDark}`
  if (labelCache.has(key)) return labelCache.get(key).clone()

  const canvas = document.createElement('canvas')
  canvas.width  = 256
  canvas.height = 44
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 256, 44)

  // Subtle pill background
  ctx.fillStyle = 'rgba(0,0,0,0.38)'
  ctx.beginPath()
  ctx.roundRect(0, 2, 256, 38, 8)
  ctx.fill()

  // Text
  ctx.font = '500 15px "Brandon Grotesque", system-ui, sans-serif'
  ctx.fillStyle = isDark ? '#e8f0eb' : (hexColor || '#1B4332')
  ctx.globalAlpha = opacity
  ctx.fillText(text, 8, 26)

  const tex = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    sizeAttenuation: true,
  })
  // Cache base sprite (we clone per node so positions are independent)
  const sprite = new THREE.Sprite(mat)
  labelCache.set(key, sprite)
  return sprite.clone()
}

// ─── Singleton float animation store ─────────────────────────────────────────
// Avoids re-creating RAF loops on re-renders
const floatStore = {
  nodes: [],     // live node objects (mutable, from force simulation)
  active: false,
  rafId: null,
  physicsSettled: false,

  start(nodes) {
    this.nodes = nodes
    if (!this.physicsSettled) return
    if (this.active) return
    this.active = true
    const tick = (t) => {
      const time = t * 0.001
      this.nodes.forEach(n => {
        if (n.__bx === undefined) return
        const s = n.__fs || 0
        n.x = n.__bx + Math.sin(time * 0.35 + s)        * 1.8
        n.y = n.__by + Math.cos(time * 0.28 + s * 1.7)  * 1.8
        n.z = n.__bz + Math.sin(time * 0.22 + s * 0.9)  * 1.8
      })
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  },

  settle(nodes) {
    // Pin base positions after physics stops
    nodes.forEach(n => {
      if (n.__bx === undefined) {
        n.__bx = n.x ?? 0
        n.__by = n.y ?? 0
        n.__bz = n.z ?? 0
        n.__fs = Math.random() * Math.PI * 2
      }
    })
    this.physicsSettled = true
    this.start(nodes)
  },

  addNode(n) {
    // New nodes need their base position set once they settle
    n.__bx = undefined
  },

  stop() {
    this.active = false
    cancelAnimationFrame(this.rafId)
  },

  destroy() {
    this.stop()
    this.nodes = []
    this.physicsSettled = false
  }
}

// ─── Node material factory (no caching – fresh per render call for correct state) ──
function makeNodeMaterial(color, emissiveIntensity, opacity, isGlow = false) {
  return new THREE.MeshStandardMaterial({
    color:            new THREE.Color(color),
    emissive:         new THREE.Color(color),
    emissiveIntensity,
    roughness:        isGlow ? 1   : 0.35,
    metalness:        isGlow ? 0   : 0.3,
    transparent:      true,
    opacity,
    blending:         isGlow ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite:       !isGlow,
  })
}

// ─── Particle field (ambient background) ─────────────────────────────────────
function createParticleField() {
  const count = 600
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = 900 + Math.random() * 400
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: 0xa5c8ff,
    size:  2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  return new THREE.Points(geo, mat)
}

// ─── Status colors ────────────────────────────────────────────────────────────
const STATUS_EMISSIVE = {
  active:     '#eab308',
  mastered:   '#22c55e',
  struggling: '#ef4444',
  default:    null,
}

const Graph3D = memo(({
  graphData,
  hoveredNode,
  selectedNode,
  neighborIds,
  onNodeHover,
  onNodeClick,
  onMouseMove,
  activeFilter,
  level,
  anchorId,
  focusNeighborIds,
  fgRef,
  width,
  height,
  introComplete,
}) => {
  const { canvasHex, isDark } = useTheme()
  const sceneInitRef   = useRef(false)
  const fogRef         = useRef(null)

  // ── Scene setup: fog, particles, lights ──────────────────────────────────
  const initScene = useCallback(() => {
    if (sceneInitRef.current || !fgRef?.current) return
    const scene    = fgRef.current.scene()
    const renderer = fgRef.current.renderer()
    if (!scene || !renderer) return

    sceneInitRef.current = true

    const fog = new THREE.FogExp2(SPACE_BACKGROUND_INT, 0.0012)
    scene.fog = fog
    fogRef.current = fog
    fog.color.setHex(SPACE_BACKGROUND_INT)
    renderer.setClearColor(fog.color, 1)

    // Ambient + colored point lights
    if (!scene.getObjectByName('_ca_ambient')) {
      const ambient = new THREE.AmbientLight(0xffffff, 0.5)
      ambient.name = '_ca_ambient'
      scene.add(ambient)

      const pt1 = new THREE.PointLight(0x22c55e, 2.4, 900)
      pt1.name = '_ca_pt1'; pt1.position.set(300, 250, 200)
      scene.add(pt1)

      const pt2 = new THREE.PointLight(0xeab308, 1.8, 700)
      pt2.name = '_ca_pt2'; pt2.position.set(-250, -150, -300)
      scene.add(pt2)

      const pt3 = new THREE.PointLight(0xef4444, 1.2, 600)
      pt3.name = '_ca_pt3'; pt3.position.set(0, -300, 300)
      scene.add(pt3)

      // Particle field
      const particles = createParticleField()
      particles.name = '_ca_particles'
      scene.add(particles)
    }

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.1
  }, [fgRef])

  // Fog color + density (runs after initScene sets fogRef)
  useEffect(() => {
    if (!fogRef.current || !fgRef?.current) return
    fogRef.current.color.setHex(SPACE_BACKGROUND_INT)
    fgRef.current.renderer()?.setClearColor(SPACE_BACKGROUND_INT, 1)
    const densities = { 0: 0.0022, 1: 0.0012, 2: 0.0008, 3: 0.0005 }
    fogRef.current.density = densities[level] ?? 0.001
  }, [level, fgRef])

  // ── Physics settle → start float loop ────────────────────────────────────
  const onEngineStop = useCallback(() => {
    initScene()
    floatStore.settle(graphData.nodes)
  }, [graphData.nodes, initScene])

  // Sync float store when graphData changes (new nodes added)
  useEffect(() => {
    floatStore.nodes = graphData.nodes
    graphData.nodes.forEach(n => {
      if (n.__bx === undefined) floatStore.addNode(n)
    })
  }, [graphData.nodes])

  // Cleanup on unmount
  useEffect(() => () => floatStore.destroy(), [])

  // ── Node opacity logic ────────────────────────────────────────────────────
  const nodeOpacity = useCallback((node) => {
    if (hoveredNode) {
      if (node.id === hoveredNode.id) return 1
      if (neighborIds.has(node.id))    return 0.85
      return 0.15
    }
    // In focus/deep mode: dim non-anchor, non-neighbor nodes subtly
    if (anchorId && level > 0) {
      if (node.id === anchorId)              return 1
      if (focusNeighborIds.has(node.id))     return 0.9
      return 0.35
    }
    return 1
  }, [hoveredNode, neighborIds, anchorId, level, focusNeighborIds])

  // ── Node 3D object factory ────────────────────────────────────────────────
  const nodeThreeObject = useCallback((node) => {
    const isHovered  = hoveredNode?.id === node.id
    const isSelected = selectedNode?.id === node.id
    const isAnchor   = node.id === anchorId
    const isNeighbor = neighborIds.has(node.id) || focusNeighborIds.has(node.id)

    const opacity   = nodeOpacity(node)
    const baseColor = resolveNodeColor(node)
    const emColor   = STATUS_EMISSIVE[node.status] || baseColor

    const r = nodeRadius(node, level)
    const group = new THREE.Group()

    // ── Core sphere ───────────────────────────────────────────────────────
    const coreGeo = new THREE.SphereGeometry(r, 20, 14)
    const coreMat = makeNodeMaterial(
      baseColor,
      isHovered || isSelected ? 0.95 : isAnchor ? 0.65 : 0.3,
      opacity
    )
    if (node.status !== 'default' && STATUS_EMISSIVE[node.status]) {
      coreMat.emissive.set(emColor)
      coreMat.emissiveIntensity = isHovered ? 1.1 : 0.55
    }
    group.add(new THREE.Mesh(coreGeo, coreMat))

    // ── Inner glow shell ──────────────────────────────────────────────────
    const glowR = r * 1.55
    const glowGeo = new THREE.SphereGeometry(glowR, 14, 10)
    const glowMat = makeNodeMaterial(baseColor, 0.45, isHovered ? 0.22 : 0.09, true)
    group.add(new THREE.Mesh(glowGeo, glowMat))

    // ── Outer halo (hovered / selected / anchor only) ─────────────────────
    if (isHovered || isSelected || isAnchor) {
      const haloR   = r * (isHovered ? 2.4 : 2.0)
      const haloGeo = new THREE.SphereGeometry(haloR, 12, 8)
      const haloMat = makeNodeMaterial(baseColor, 0.25, isHovered ? 0.12 : 0.07, true)
      group.add(new THREE.Mesh(haloGeo, haloMat))
    }

    // ── Ring for anchor node ──────────────────────────────────────────────
    if (isAnchor || isSelected) {
      const ringGeo = new THREE.TorusGeometry(r * 1.9, r * 0.12, 8, 48)
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(baseColor),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      group.add(ring)
    }

    // ── Text label ────────────────────────────────────────────────────────
    // Always show labels for hovered/selected/anchor/neighbor nodes.
    // Show dimmer labels for all nodes in overview (level 0).
    const showLabel = isHovered || isSelected || isAnchor || isNeighbor || (level === 0 && node.weight >= 2.0)
    if (showLabel && opacity > 0.25) {
      const labelOpacity = isHovered || isAnchor ? 1.0 : isNeighbor ? 0.8 : 0.55
      const sprite = makeLabelSprite(node.label, baseColor, labelOpacity, isDark)
      // Position label to the right of the sphere
      const offset = r * 1.3 + 8
      sprite.position.set(offset, r * 0.4, 0)
      // Scale: width proportional to text, height fixed
      const charW = Math.min(node.label.length * 8 + 16, 200)
      sprite.scale.set(charW * 0.55, 12, 1)
      group.add(sprite)
    }

    return group
  }, [hoveredNode, selectedNode, anchorId, neighborIds, focusNeighborIds, level, nodeOpacity, isDark])

  // ── Link visuals ──────────────────────────────────────────────────────────
  const linkColor = useCallback((link) => {
    return getLinkColor(link, hoveredNode?.id, neighborIds, isDark)
  }, [hoveredNode, neighborIds, isDark])

  const linkWidth = useCallback((link) => {
    if (!hoveredNode && !anchorId) return 0.4
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    if (hoveredNode && (s === hoveredNode.id || t === hoveredNode.id)) return 2.8
    if (anchorId && (s === anchorId || t === anchorId)) return 1.8
    return 0.3
  }, [hoveredNode, anchorId])

  const linkDirectionalParticles = useCallback((link) => {
    if (!anchorId) return 0
    const s = typeof link.source === 'object' ? link.source.id : link.source
    const t = typeof link.target === 'object' ? link.target.id : link.target
    return (s === anchorId || t === anchorId) ? 3 : 0
  }, [anchorId])

  // ── Filtered data ─────────────────────────────────────────────────────────
  // (graphData already pre-filtered by useExploration, but also apply subject filter)
  const filteredData = useMemo(() => {
    if (!activeFilter) return graphData
    const ids = new Set(graphData.nodes.filter(n => n.subject === activeFilter).map(n => n.id))
    return {
      nodes: graphData.nodes.filter(n => ids.has(n.id)),
      links: graphData.links.filter(l => {
        const s = typeof l.source === 'object' ? l.source.id : l.source
        const t = typeof l.target === 'object' ? l.target.id : l.target
        return ids.has(s) && ids.has(t)
      }),
    }
  }, [graphData, activeFilter])

  return (
    <div
      style={{ width, height, cursor: hoveredNode ? 'pointer' : 'default' }}
      onMouseMove={onMouseMove}
    >
      <ForceGraph3D
        ref={fgRef}
        graphData={filteredData}
        width={width}
        height={height}
        backgroundColor={canvasHex}
        // Node
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={() => ''}
        onNodeHover={onNodeHover}
        onNodeClick={onNodeClick}
        // Link
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={0.45}
        linkDirectionalParticles={linkDirectionalParticles}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleColor={linkColor}
        linkDirectionalParticleSpeed={0.006}
        // Force tuning
        d3AlphaDecay={0.016}
        d3VelocityDecay={0.3}
        cooldownTime={5000}
        onEngineStop={onEngineStop}
        // Controls
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
      />
    </div>
  )
})

Graph3D.displayName = 'Graph3D'
export default Graph3D
