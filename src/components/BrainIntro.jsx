import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { ClaroLogoMark } from './brand/ClaroLogoMark.jsx'
import { SPACE_BACKGROUND_INT } from '../theme/spaceTheme.js'

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
  ctx.font = `300 ${size}px "Brandon Grotesque", system-ui, sans-serif`
  ctx.fillStyle = color
  ctx.globalAlpha = alpha
  ctx.fillText(text, 4, size + 8)
  return new THREE.CanvasTexture(canvas)
}

// ─── BrainIntro component ─────────────────────────────────────────────────────

export default function BrainIntro({ onEnter }) {
  const mountRef = useRef(null)
  const stateRef = useRef({})      // mutable render state
  const [ready, setReady] = useState(false)
  const [exiting, setExiting] = useState(false)

  // Fallback: if rAF is throttled (background tab / headless), enable button after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2500)
    return () => clearTimeout(t)
  }, [])

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
    renderer.setClearColor(SPACE_BACKGROUND_INT, 1)
    el.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(SPACE_BACKGROUND_INT, 0.00125)
    const camera = new THREE.PerspectiveCamera(55, W / H, 1, 3000)
    camera.position.set(0, 30, 480)
    camera.lookAt(0, 0, 0)

    // ── Lights ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.38))
    const pt1 = new THREE.PointLight(0x22c55e, 5.2, 600); pt1.position.set(200, 150, 100); scene.add(pt1)
    const pt2 = new THREE.PointLight(0xeab308, 3.8, 500); pt2.position.set(-180, -100, -80); scene.add(pt2)
    const pt3 = new THREE.PointLight(0xef4444, 2.6, 400); pt3.position.set(0, -200, 200); scene.add(pt3)

    // ── Neuron points ─────────────────────────────────────────────────────
    const NEURON_COUNT = 1200
    const neurons = generateNeurons(NEURON_COUNT)
    const nPositions = new Float32Array(NEURON_COUNT * 3)
    const nSizes = new Float32Array(NEURON_COUNT)
    const nColors = new Float32Array(NEURON_COUNT * 3)

    neurons.forEach((p, i) => {
      nPositions[i * 3] = p.x
      nPositions[i * 3 + 1] = p.y
      nPositions[i * 3 + 2] = p.z
      nSizes[i] = 2.5 + Math.random() * 3.5

      // Color by hemisphere — brand green spectrum on black
      const t = (p.x + 140) / 280
      const r = THREE.MathUtils.lerp(0.05, 0.18, t)
      const g = THREE.MathUtils.lerp(0.55, 0.85, Math.random())
      const b = THREE.MathUtils.lerp(0.2, 0.45, Math.random())
      nColors[i * 3] = r; nColors[i * 3 + 1] = g; nColors[i * 3 + 2] = b
    })

    const nGeo = new THREE.BufferGeometry()
    nGeo.setAttribute('position', new THREE.BufferAttribute(nPositions, 3))
    nGeo.setAttribute('color', new THREE.BufferAttribute(nColors, 3))
    nGeo.setAttribute('size', new THREE.BufferAttribute(nSizes, 1))

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
      synPositions[i * 6] = neurons[a].x; synPositions[i * 6 + 1] = neurons[a].y; synPositions[i * 6 + 2] = neurons[a].z
      synPositions[i * 6 + 3] = neurons[b].x; synPositions[i * 6 + 4] = neurons[b].y; synPositions[i * 6 + 5] = neurons[b].z
    })
    synLineGeo.setAttribute('position', new THREE.BufferAttribute(synPositions, 3))
    const synLines = new THREE.LineSegments(
      synLineGeo,
      new THREE.LineBasicMaterial({ color: 0x40916c, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
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
    const brainOutlineGeo = new THREE.SphereGeometry(148, 32, 24)
    const brainOutlineMat = new THREE.MeshBasicMaterial({
      color: 0x2d6a4f,
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
    const bgPos = new Float32Array(bgCount * 3)
    for (let i = 0; i < bgCount; i++) {
      bgPos[i * 3] = (Math.random() - 0.5) * 1800
      bgPos[i * 3 + 1] = (Math.random() - 0.5) * 1200
      bgPos[i * 3 + 2] = (Math.random() - 0.5) * 800 - 200
    }
    const bgGeo = new THREE.BufferGeometry()
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3))
    const bgMat = new THREE.PointsMaterial({ color: 0x95d5b2, size: 1.1, sizeAttenuation: true, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false })
    scene.add(new THREE.Points(bgGeo, bgMat))

    // ── State ─────────────────────────────────────────────────────────────
    const s = stateRef.current
    s.renderer = renderer
    s.scene = scene
    s.camera = camera
    s.neurons = neurons
    s.neuronMat = nMat
    s.synMat = synLines.material
    s.brainOutMat = brainOutlineMat
    s.pulses = pulses
    s.synapses = synapses
    s.phase = 'materialise'  // materialise → idle → exit
    s.phaseT = 0
    s.lastPulse = 0
    s.exitT = 0
    s.disposed = false
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
      idle.t = 0
      idle.speed = 0.012 + Math.random() * 0.018
      idle.active = true
      idle.mesh.visible = true

      // Color: random mix of cyan / magenta / yellow
      const palette = [0x52b788, 0x2d6a4f, 0x40916c, 0xd4a574, 0x95d5b2]
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
        nMat.opacity = s.phaseT * 0.85
        synLines.material.opacity = s.phaseT * 0.18
        brainOutlineMat.opacity = s.phaseT * 0.06
        if (s.phaseT >= 1) { s.phase = 'idle'; setReady(true) }
      }

      // Phase: exit
      if (s.phase === 'exit') {
        s.exitT = Math.min(s.exitT + dt / 1.2, 1)
        const eased = 1 - Math.pow(1 - s.exitT, 3)
        nMat.opacity = (1 - eased) * 0.85
        synLines.material.opacity = (1 - eased) * 0.18
        brainOutlineMat.opacity = (1 - eased) * 0.06

        // Scatter neurons
        nBasePositions.forEach((base, i) => {
          const vel = s.exitVelocities[i]
          nPositions[i * 3] = base.x + vel.x * eased * 180
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
          nPositions[i * 3] = base.x + Math.sin(t * 0.28 + i) * 1.2
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
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement)
      }
    }
  }, [])

  const handleEnter = useCallback(() => {
    if (!ready || exiting) return
    const s = stateRef.current
    s.phase = 'exit'
    setExiting(true)
    setTimeout(() => onEnter?.(), 250)
  }, [exiting, onEnter, ready])

  return (
    <div
      className={`absolute inset-0 z-50 bg-claro-canvas transition-opacity duration-700 ${exiting ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="absolute inset-0 pointer-events-none" />

      {/* Darken center so title reads over the globe */}
      <div
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(10, 16, 40, 0.88) 0%, rgba(10, 16, 40, 0.45) 45%, transparent 72%)',
        }}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-4">

        {/* Brain label — high-contrast panel so “Claro” stays readable */}
        <div
          className={`pointer-events-none max-w-xl transition-all duration-1000 ${ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          style={{ textAlign: 'center' }}
        >
          <div
            className="rounded-3xl border border-claro-indigo/25 bg-claro-panel/95 px-8 py-8 shadow-[0_16px_56px_rgba(0,0,0,0.65)] backdrop-blur-md sm:px-10"
          >
            <h1 className="sr-only">Claro</h1>
            <div className="mb-6 flex justify-center px-2">
              <ClaroLogoMark size={56} />
            </div>

            <div className="mb-5 text-[11px] uppercase tracking-[0.35em] text-claro-muted">
              Comprehension intelligence
            </div>

            <p className="mb-3 max-w-md px-1 text-center text-sm leading-relaxed text-claro-muted">
              Turn scores into a diagnosis. Know what to focus on next.
            </p>
            <p className="mb-8 max-w-lg px-1 text-center text-sm font-medium text-claro-text/95">
              Canvas gives you the grade. We give you the why.
            </p>

            {/* Subject previews */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {[
                { color: '#22c55e', label: 'Python Programming', count: 70 },
                { color: '#16a34a', label: 'DS & Algorithms', count: 75 },
                { color: '#15803d', label: 'Computer Networks', count: 65 },
              ].map(({ color, label, count }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-claro-muted">
                  <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
                  <span>{label}</span>
                  <span className="text-claro-muted/70">·{count}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={(event) => {
                event.stopPropagation()
                handleEnter()
              }}
              disabled={!ready}
              className={`pointer-events-auto rounded-full border px-10 py-4 text-sm font-medium transition-all duration-300 ${ready
                  ? 'cursor-pointer border-claro-indigo/40 text-claro-text hover:border-claro-indigo/60 hover:bg-claro-slate/90'
                  : 'cursor-not-allowed border-claro-indigo/15 text-claro-muted/50'
                }`}
              style={{
                background: ready ? 'rgb(26 36 31 / 0.92)' : 'transparent',
                boxShadow: ready ? '0 4px 24px rgba(0,0,0,0.35)' : 'none',
              }}
            >
              {ready ? 'Enter the Knowledge Network' : 'Initializing neurons…'}
            </button>
          </div>
        </div>
      </div>

      {/* Soft edge vignette (behind panel, over globe) */}
      <div
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{ background: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.45) 100%)' }}
      />

      {/* Corner micro-stats */}
      {ready && (
        <div className="pointer-events-none absolute bottom-6 left-6 z-[30] space-y-1 text-[10px] text-claro-muted/90">
          <div>neurons: 1,200</div>
          <div>synapses: active</div>
          <div>webgl: enabled</div>
        </div>
      )}
    </div>
  )
}
