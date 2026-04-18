const KEY = 'unfollow.local:last-export'
const VERSION = 1

export function saveExport(data) {
  try {
    const payload = {
      v: VERSION,
      savedAt: Date.now(),
      username: data.username || '',
      followers: data.followers || [],
      following: data.following || [],
      pending: data.pending || [],
    }
    localStorage.setItem(KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function loadExport() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.v !== VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function clearExport() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

// ---- visited profiles ----
const VISITED_KEY = 'unfollow.local:visited-profiles'

export function loadVisited() {
  try {
    const raw = localStorage.getItem(VISITED_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function saveVisited(visited) {
  try {
    const arr = Array.from(visited)
    localStorage.setItem(VISITED_KEY, JSON.stringify(arr))
  } catch {
    /* ignore */
  }
}

export function clearVisited() {
  try {
    localStorage.removeItem(VISITED_KEY)
  } catch {
    /* ignore */
  }
}
