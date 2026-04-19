const PREFIX = 'eg_node_mastery_v1_'

function norm(email) {
  return String(email || '').trim().toLowerCase()
}

export function readNodeMasteryMap(email) {
  try {
    const raw = localStorage.getItem(PREFIX + norm(email))
    if (!raw) return {}
    const data = JSON.parse(raw)
    return data && typeof data === 'object' ? data : {}
  } catch {
    return {}
  }
}

/** @param {number|null|undefined} accuracy01 - null/undefined removes override */
export function writeNodeMastery(email, nodeId, accuracy01) {
  const key = PREFIX + norm(email)
  const map = { ...readNodeMasteryMap(email) }
  const id = String(nodeId || '')
  if (!id) return map

  if (accuracy01 == null || Number.isNaN(accuracy01)) {
    delete map[id]
  } else {
    const v = Math.max(0.05, Math.min(0.98, Number(accuracy01)))
    map[id] = v
  }

  localStorage.setItem(key, JSON.stringify(map))
  return map
}
