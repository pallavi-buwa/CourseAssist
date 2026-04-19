import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// ─── Brain geometry helpers ───────────────────────────────────────────────────

function sampleBrainPoint() {
  // Hemisphere choice (left / right)
  const side = Math.random() > 0.5 ? 1 : -1

  // Random direction on unit sphere (Box-Muller)
  const u = Math.random(), v = Math.random(), w = Math.random()
  const norm = Math.sqrt(u * u + v * v + w * w) || 1
  const sx = u / norm, sy = v / norm, sz = w / norm

  // Scale to brain-lobe ellipsoid
  const rx = 105 + side * 28
  const ry = 82
  const rz = 68

  let x = sx * rx
  let y = sy * ry - 8   // shift down slightly
  let z = sz * rz

  // Fold-like surface perturbation (gyri / sulci)
  const fold = 1 + 0.13 * Math.sin(x * 0.072) * Math.cos(y * 0.088) * Math.sin(z * 0.055)
  x *= fold; y *= fold; z *= fold

  return new THREE.Vector3(x, y, z)
}

function generateNeurons(count) {
  const positions = []
  for (let i = 0; i < count; i++) positions.push(sampleBrainPoint())
  return positions
}

function buildSynapses(neurons, maxDist = 55, maxPer = 4) {
  const pairs = []
  for (let i = 0; i < neurons.length; i++) {
    let connected = 0
    for (let j = i + 1; j < neurons.length; j++) {
      if (connected >= maxPer) break
      const d = neurons[i].distanceTo(neurons[j])
      if (d < maxDist) { pairs.push([i, j]); connected++ }
    }
  }
  return pairs
}

// ─── Text canvas helper ───────────────────────────────────────────────────────

function makeTextTexture(text, opts = {}) {
  const { size = 22, color = '#ffffff', alpha = 0.9 } = opts
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 64
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 64)
  ctx.font = `300 ${size}px Inter, sans-serif`
  ctx.fillStyle = color
  ctx.globalAlpha = alpha
  ctx.fillText(text, 4, size + 8)
  return new THREE.CanvasTexture(canvas)
}

// ─── BrainIntro component ─────────────────────────────────────────────────────

export default function BrainIntro({ onEnter }) {
  const mountRef   = useRef(null)
  const stateRef   = useRef({})      // mutable render state
  const [ready, setReady]         = useState(false)
  const [exiting, setExiting]     = useState(false)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Renderer ──────────────────────────────────────────────────────────
    const W = el.clientWidth, H = el.clientHeight
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.setClearColor(0x050508, 1)
    el.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    scene.fog    = new THREE.FogExp2(0x050508, 0.0018)
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 3000)
    camera.position.set(0, 30, 480)
    camera.lookAt(0, 0, 0)

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const pt1 = new THREE.PointLight(0x4f6ef7, 6, 600); pt1.position.set(200, 150, 100); scene.add(pt1)
    const pt2 = new THREE.PointLight(0xe879f9, 5, 500); pt2.position.set(-180, -100, -80); scene.add(pt2)
    const pt3 = new THREE.PointLight(0x06b6d4, 4, 400); pt3.position.set(0, -200, 200); scene.add(pt3)

    // ── Neuron points ─────────────────────────────────────────────────────
    const NEURON_COUNT = 1200
    const neurons = generateNeurons(NEURON_COUNT)
    const nPositions = new Float32Array(NEURON_COUNT * 3)
    const nSizes     = new Float32Array(NEURON_COUNT)
    const nColors    = new Float32Array(NEURON_COUNT * 3)

    neurons.forEach((p, i) => {
      nPositions[i * 3]     = p.x
      nPositions[i * 3 + 1] = p.y
      nPositions[i * 3 + 2] = p.z
      nSizes[i] = 2.5 + Math.random() * 3.5

      // Color by hemisphere
      const t = (p.x + 140) / 280   // 0..1 left..right
      const r = THREE.MathUtils.lerp(0.22, 0.55, t)
      const g = THREE.MathUtils.lerp(0.18, 0.35, Math.random())
      const b = THREE.MathUtils.lerp(0.65, 0.90, Math.random())
      nColors[i * 3] = r; nColors[i * 3 + 1] = g; nColors[i * 3 + 2] = b
    })

    const nGeo = new THREE.BufferGeometry()
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPositions, 3))
    nGeo.setAttribute('color',    new THREE.BufferAttribute(nColors, 3))
    nGeo.setAttribute('size',     new THREE.BufferAttribute(nSizes, 1))

    const nMat = new THREE.PointsMaterial({
      size: 3.2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const neuronPoints = new THREE.Points(nGeo, nMat)
    scene.add(neuronPoints)

    // ── Synapse lines ─────────────────────────────────────────────────────
    const synapses = buildSynapses(neurons, 52, 4)
    const synLineGeo = new THREE.BufferGeometry()
    const synPositions = new Float32Array(synapses.length * 6)
    synapses.forEach(([a, b], i) => {
      synPositions[i * 6]     = neurons[a].x; synPositions[i * 6 + 1] = neurons[a].y; synPositions[i * 6 + 2] = neurons[a].z
      synPositions[i * 6 + 3] = neurons[b].x; synPositions[i * 6 + 4] = neurons[b].y; synPositions[i * 6 + 5] = neurons[b].z
    })
    synLineGeo.setAttribute('position', new THREE.BufferAttribute(synPositions, 3))
    const synLines = new THREE.LineSegments(
      synLineGeo,
      new THREE.LineBasicMaterial({ color: 0x2244aa, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    scene.add(synLines)

    // ── Pulse pool ────────────────────────────────────────────────────────
    const PULSE_COUNT = 28
    const pulseGeo = new THREE.SphereGeometry(3.5, 8, 6)
    const pulses = Array.from({ length: PULSE_COUNT }, () => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(pulseGeo, mat)
      mesh.visible = false
      scene.add(mesh)
      return {
        mesh,
        t: 0,
        speed: 0,
        from: new THREE.Vector3(),
        to: new THREE.Vector3(),
        active: false,
        color: new THREE.Color(),
      }
    })

    // ── Brain outline sphere (faint) ──────────────────────────────────────
    const brainOutlineGeo  = new THREE.SphereGeometry(148, 32, 24)
    const brainOutlineMat  = new THREE.MeshBasicMaterial({
      color: 0x1a2a6c,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const brainOutline = new THREE.Mesh(brainOutlineGeo, brainOutlineMat)
    brainOutline.scale.set(1, 0.78, 0.68)
    scene.add(brainOutline)

    // ── Background particle haze ──────────────────────────────────────────
    const bgCount = 500
    const bgPos   = new Float32Array(bgCount * 3)
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3]     = (Math.random() - 0.5) * 1800
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 1200
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 800 - 200
    }
    const bgGeo = new THREE.BufferGeometry()
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    const bgMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
    scene.add(new THREE.Points(bgGeo, bgMat))

    // ── State ─────────────────────────────────────────────────────────────
    const s = stateRef.current
    s.renderer    = renderer
    s.scene       = scene
    s.camera      = camera
    s.neurons     = neurons
    s.neuronMat   = nMat
    s.synMat      = synLines.material
    s.brainOutMat = brainOutlineMat
    s.pulses      = pulses
    s.synapses    = synapses
    s.phase       = 'materialise'  // materialise → idle → exit
    s.phaseT      = 0
    s.lastPulse   = 0
    s.exitT       = 0
    s.disposed    = false
    s.exitVelocities = neurons.map(() => new THREE.Vector3(
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 3.5,
      (Math.random() - 0.5) * 3.5
    ))

    // ── Pulse firing ──────────────────────────────────────────────────────
    function firePulse() {
      if (!synapses.length) return
      const idle = pulses.find(p => !p.active)
      if (!idle) return
      const [ai, bi] = synapses[Math.floor(Math.random() * synapses.length)]
      idle.from.copy(neurons[ai])
      idle.to.copy(neurons[bi])
      idle.t     = 0
      idle.speed = 0.012 + Math.random() * 0.018
      idle.active = true
      idle.mesh.visible = true

      // Color: random mix of cyan / magenta / yellow
      const palette = [0x00eeff, 0xff44cc, 0xffee00, 0x88ffcc, 0xff8844]
      idle.color.setHex(palette[Math.floor(Math.random() * palette.length)])
      idle.mesh.material.color.copy(idle.color)
      idle.mesh.material.opacity = 1
    }

    // ── Animate ───────────────────────────────────────────────────────────
    let lastTime = 0
    const nBasePositions = neurons.map(p => p.clone())

    function animate(time) {
      if (s.disposed) return
      const dt = Math.min((time - lastTime) * 0.001, 0.05)
      lastTime = time

      // Camera slow orbit
      const angle = time * 0.00012
      camera.position.x = Math.sin(angle) * 480
      camera.position.z = Math.cos(angle) * 480
      camera.position.y = 30 + Math.sin(angle * 0.7) * 40
      camera.lookAt(0, 10, 0)

      // Phase: materialise (0 → 1 opacity over 1.8s)
      if (s.phase === 'materialise') {
        s.phaseT = Math.min(s.phaseT + dt / 1.8, 1)
        nMat.opacity         = s.phaseT * 0.85
        synLines.material.opacity = s.phaseT * 0.18
        brainOutlineMat.opacity   = s.phaseT * 0.06
        if (s.phaseT >= 1) { s.phase = 'idle'; setReady(true) }
      }

      // Phase: exit
      if (s.phase === 'exit') {
        s.exitT = Math.min(s.exitT + dt / 1.2, 1)
        const eased = 1 - Math.pow(1 - s.exitT, 3)
        nMat.opacity              = (1 - eased) * 0.85
        synLines.material.opacity = (1 - eased) * 0.18
        brainOutlineMat.opacity   = (1 - eased) * 0.06

        // Scatter neurons
        nBasePositions.forEach((base, i) => {
          const vel = s.exitVelocities[i]
          nPositions[i * 3]     = base.x + vel.x * eased * 180
          nPositions[i * 3 + 1] = base.y + vel.y * eased * 180
          nPositions[i * 3 + 2] = base.z + vel.z * eased * 180
        })
        nGeo.attributes.position.needsUpdate = true
      }

      // Advance pulses
      if (s.phase !== 'exit') {
        if (time - s.lastPulse > 140) {
          firePulse()
          s.lastPulse = time
        }
      }

      pulses.forEach(p => {
        if (!p.active) return
        p.t += p.speed
        if (p.t >= 1) {
          p.active = false
          p.mesh.visible = false
          return
        }
        p.mesh.position.lerpVectors(p.from, p.to, p.t)
        p.mesh.material.opacity = Math.sin(p.t * Math.PI) * 0.9
      })

      // Neuron twinkle
      if (s.phase === 'idle') {
        const t = time * 0.001
        for (let i = 0; i < NEURON_COUNT; i += 4) {
          const base = nBasePositions[i]
          nPositions[i * 3]     = base.x + Math.sin(t * 0.28 + i) * 1.2
          nPositions[i * 3 + 1] = base.y + Math.cos(t * 0.22 + i * 1.3) * 1.2
          nPositions[i * 3 + 2] = base.z + Math.sin(t * 0.18 + i * 0.9) * 1.2
        }
        nGeo.attributes.position.needsUpdate = true
      }

      renderer.render(scene, camera)
      s.rafId = requestAnimationFrame(animate)
    }
    s.rafId = requestAnimationFrame(animate)

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      s.disposed = true
      cancelAnimationFrame(s.rafId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  const handleEnter = useCallback(() => {
    const s = stateRef.current
    s.phase = 'exit'
    setExiting(true)
    setTimeout(() => onEnter?.(), 1100)
  }, [onEnter])

  return (
    <div
      className={`absolute inset-0 z-50 transition-opacity duration-700 ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: '#050508' }}
    >
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Overlay UI */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">

        {/* Brain label */}
        <div className={`transition-all duration-1000 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
             style={{ textAlign: 'center' }}>

          <div className="text-[11px] tracking-[0.35em] text-slate-500 uppercase mb-4">
            Cognitive Knowledge System
          </div>

          <h1 className="text-5xl font-light text-white mb-3 tracking-tight"
              style={{ textShadow: '0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(99,102,241,0.2)' }}>
            CourseAssist
          </h1>

          <p className="text-slate-400 text-sm max-w-xs text-center leading-relaxed mb-12">
            Explore 210 concepts across 3 subjects —<br />
            mapped as a living neural network
          </p>

          {/* Subject previews */}
          <div className="flex items-center gap-6 mb-12 justify-center">
            {[
              { color: '#3b82f6', label: 'Python Programming', count: 70 },
              { color: '#8b5cf6', label: 'DS & Algorithms',    count: 75 },
              { color: '#10b981', label: 'Computer Networks',  count: 65 },
            ].map(({ color, label, count }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                <span>{label}</span>
                <span className="text-slate-600">·{count}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleEnter}
            disabled={!ready}
            className={`pointer-events-auto px-10 py-4 rounded-full text-sm font-medium
              transition-all duration-300 border
              ${ready
                ? 'border-white/20 text-white hover:border-white/50 hover:bg-white/8 cursor-pointer'
                : 'border-white/5 text-slate-600 cursor-not-allowed'
              }`}
            style={{
              background: ready ? 'rgba(255,255,255,0.04)' : 'transparent',
              boxShadow: ready ? '0 0 40px rgba(99,102,241,0.15), inset 0 0 20px rgba(99,102,241,0.05)' : 'none',
            }}
          >
            {ready ? 'Enter the Knowledge Network →' : 'Initializing neurons…'}
          </button>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.75) 100%)' }} />

      {/* Corner micro-stats */}
      {ready && (
        <div className="absolute bottom-6 left-6 text-[10px] text-slate-600 pointer-events-none space-y-1">
          <div>neurons: 1,200</div>
          <div>synapses: active</div>
          <div>webgl: enabled</div>
        </div>
      )}
    </div>
  )
}
