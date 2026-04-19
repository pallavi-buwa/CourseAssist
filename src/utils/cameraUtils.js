// ─────────────────────────────────────────────────────────────────────────────
// Camera utilities – custom easing on top of react-force-graph-3d camera API
// ─────────────────────────────────────────────────────────────────────────────

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4)
}

export function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2
}

export function lerp(a, b, t) { return a + (b - a) * t }

export function lerpVec(a, b, t) {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) }
}

// Smooth camera fly to a node position with custom cubic easing.
// Returns a cancel function.
export function flyToNode(fgRef, targetNode, level = 1, onComplete = null) {
  if (!fgRef?.current) return () => {}

  const camera = fgRef.current.camera()
  if (!camera) return () => {}

  // Orbit distances per exploration level
  const distances = { 0: 520, 1: 260, 2: 160, 3: 100 }
  const dist = distances[level] ?? 160

  const nx = targetNode.x ?? 0
  const ny = targetNode.y ?? 0
  const nz = targetNode.z ?? 0

  // Approach from a slightly elevated, offset angle
  const angle = Math.atan2(camera.position.z - nz, camera.position.x - nx)
  const targetPos = {
    x: nx + dist * Math.cos(angle) * 0.8,
    y: ny + dist * 0.4,
    z: nz + dist * Math.sin(angle) * 0.8,
  }
  const targetLookAt = { x: nx, y: ny, z: nz }

  const startPos    = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
  const curLookAt   = fgRef.current.cameraPosition()
  const startLookAt = { x: curLookAt.x ?? 0, y: curLookAt.y ?? 0, z: curLookAt.z ?? 0 }

  const duration = level === 0 ? 2000 : 1100 + level * 100
  let startTime = null
  let rafId = null
  let cancelled = false

  function tick(now) {
    if (cancelled) return
    if (!startTime) startTime = now
    const raw = Math.min(1, (now - startTime) / duration)
    const t   = easeInOutCubic(raw)

    const pos    = lerpVec(startPos, targetPos, t)
    const lookAt = lerpVec(startLookAt, targetLookAt, t)

    fgRef.current.cameraPosition(pos, lookAt, 0)

    if (raw < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      onComplete?.()
    }
  }

  rafId = requestAnimationFrame(tick)
  return () => { cancelled = true; cancelAnimationFrame(rafId) }
}

// Panoramic intro animation – fly in from far away
export function playIntro(fgRef, onComplete) {
  if (!fgRef?.current) return () => {}

  const startPos = { x: 0, y: 400, z: 1600 }
  const endPos   = { x: 80, y: 120, z: 680 }
  const lookAt   = { x: 0, y: 0, z: 0 }

  fgRef.current.cameraPosition(startPos, lookAt, 0)

  return flyToNode(
    fgRef,
    { x: 0, y: 0, z: 0 },
    0,
    onComplete
  )
}
