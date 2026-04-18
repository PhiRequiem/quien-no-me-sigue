import JSZip from 'jszip'

const FOLLOWERS_PATH_RE = /followers_and_following\/followers(?:_\d+)?\.json$/i
const FOLLOWING_PATH_RE = /followers_and_following\/following\.json$/i
const PENDING_PATH_RE = /followers_and_following\/pending_follow_requests\.json$/i
const FILENAME_USER_RE = /^instagram-(.+?)-\d{4}-\d{2}-\d{2}-[a-z0-9]+\.zip$/i

export function extractUsernameFromFilename(name) {
  if (!name) return ''
  const match = FILENAME_USER_RE.exec(name)
  return match ? match[1] : ''
}

function normalizeUrl(href) {
  if (!href) return ''
  return href.replace('/_u/', '/')
}

function profileUrl(username, href) {
  const normalized = normalizeUrl(href)
  if (normalized) return normalized
  return `https://www.instagram.com/${username}`
}

function readEntry(entry) {
  const username = entry?.string_list_data?.[0]?.value || entry?.title || ''
  const href = entry?.string_list_data?.[0]?.href || ''
  const timestamp = entry?.string_list_data?.[0]?.timestamp || 0
  if (!username) return null
  return {
    username,
    url: profileUrl(username, href),
    timestamp,
  }
}

function extractFollowers(json) {
  const arr = Array.isArray(json) ? json : json?.relationships_followers
  if (!Array.isArray(arr)) return []
  return arr.map(readEntry).filter(Boolean)
}

function extractFollowing(json) {
  const arr = Array.isArray(json)
    ? json
    : json?.relationships_following || json?.relationships_following_hashtags
  if (!Array.isArray(arr)) return []
  return arr.map(readEntry).filter(Boolean)
}

function extractPending(json) {
  const arr = Array.isArray(json)
    ? json
    : json?.relationships_follow_requests_sent
  if (!Array.isArray(arr)) return []
  return arr.map(readEntry).filter(Boolean)
}

async function parseZip(file) {
  const zip = await JSZip.loadAsync(file)
  const followers = []
  const followingPromises = []
  const pendingPromises = []
  const followerPromises = []

  zip.forEach((path, entry) => {
    if (entry.dir) return
    if (FOLLOWERS_PATH_RE.test(path)) {
      followerPromises.push(entry.async('string').then(JSON.parse).then(extractFollowers))
    } else if (FOLLOWING_PATH_RE.test(path)) {
      followingPromises.push(entry.async('string').then(JSON.parse).then(extractFollowing))
    } else if (PENDING_PATH_RE.test(path)) {
      pendingPromises.push(entry.async('string').then(JSON.parse).then(extractPending))
    }
  })

  if (followerPromises.length === 0 && followingPromises.length === 0) {
    throw new Error(
      'El archivo no contiene connections/followers_and_following. Asegurate de exportar tu informacion en formato JSON desde Instagram.'
    )
  }

  const followerResults = await Promise.all(followerPromises)
  followerResults.forEach((batch) => followers.push(...batch))

  const followingResults = await Promise.all(followingPromises)
  const following = followingResults.flat()

  const pendingResults = await Promise.all(pendingPromises)
  const pending = pendingResults.flat()

  return { followers, following, pending }
}

async function parseJson(file) {
  const text = await file.text()
  const json = JSON.parse(text)

  if (Array.isArray(json)) {
    return { followers: extractFollowers(json), following: [], pending: [] }
  }
  if (json?.relationships_following) {
    return { followers: [], following: extractFollowing(json), pending: [] }
  }
  if (json?.relationships_followers) {
    return { followers: extractFollowers(json), following: [], pending: [] }
  }
  if (json?.relationships_follow_requests_sent) {
    return { followers: [], following: [], pending: extractPending(json) }
  }
  throw new Error('JSON no reconocido. Subi el ZIP completo de Instagram.')
}

export async function parseInstagramFile(file) {
  const name = file.name.toLowerCase()
  const username = extractUsernameFromFilename(file.name)
  let result
  if (name.endsWith('.zip')) result = await parseZip(file)
  else if (name.endsWith('.json')) result = await parseJson(file)
  else throw new Error('Formato no soportado. Subi el .zip descargado de Instagram.')
  return { ...result, username }
}

const ONE_YEAR_S = 365 * 24 * 3600
const TWO_YEARS_S = 2 * ONE_YEAR_S

export function ageCategory(timestamp) {
  if (!timestamp) return null
  const age = Date.now() / 1000 - timestamp
  if (age > TWO_YEARS_S) return '2y'
  if (age > ONE_YEAR_S) return '1y'
  return null
}

export function diffExports(dataA, dataB) {
  const aFollowerSet = new Set(dataA.followers.map((f) => f.username.toLowerCase()))
  const bFollowerSet = new Set(dataB.followers.map((f) => f.username.toLowerCase()))
  const aFollowingSet = new Set(dataA.following.map((f) => f.username.toLowerCase()))
  const bFollowingSet = new Set(dataB.following.map((f) => f.username.toLowerCase()))

  return {
    lostFollowers: dataA.followers.filter((f) => !bFollowerSet.has(f.username.toLowerCase())),
    gainedFollowers: dataB.followers.filter((f) => !aFollowerSet.has(f.username.toLowerCase())),
    unfollowed: dataA.following.filter((f) => !bFollowingSet.has(f.username.toLowerCase())),
    newFollowing: dataB.following.filter((f) => !aFollowingSet.has(f.username.toLowerCase())),
  }
}

export function diffNotFollowingBack({ followers, following }) {
  const followerSet = new Set(followers.map((f) => f.username.toLowerCase()))
  return following
    .filter((f) => !followerSet.has(f.username.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp)
}

export function diffFansNotFollowedBack({ followers, following }) {
  const followingSet = new Set(following.map((f) => f.username.toLowerCase()))
  return followers
    .filter((f) => !followingSet.has(f.username.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp)
}

export function toCsv(rows) {
  const header = ['username', 'url', 'seguido_desde']
  const lines = [header.join(',')]
  for (const row of rows) {
    const date = row.timestamp
      ? new Date(row.timestamp * 1000).toISOString().slice(0, 10)
      : ''
    const safe = (v) => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    lines.push([safe(row.username), safe(row.url), safe(date)].join(','))
  }
  return lines.join('\n')
}

export function downloadCsv(rows, filename) {
  const csv = toCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
