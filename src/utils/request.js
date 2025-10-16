// Simple in-memory caches for de-dupe and TTL caching
const inflight = new Map()
const cache = new Map()

export async function deDupeFetch(url, options = {}, { ttlMs = 15000, dedupeKey, parseJson = true } = {}) {
  const key = dedupeKey || `${options.method || "GET"} ${url} ${JSON.stringify(options.headers || {})}`

  // Return cached response if valid
  const cached = cache.get(key)
  const now = Date.now()
  if (cached && cached.expiresAt > now) {
    return parseJson ? cached.data : cached.response
  }

  // Share in-flight request
  if (inflight.has(key)) {
    return inflight.get(key)
  }

  const p = (async () => {
    const res = await fetch(url, options)
    const data = parseJson ? await res.json() : res
    // Store in cache regardless of ok; calling code can handle error fields
    cache.set(key, {
      data,
      response: res,
      expiresAt: now + ttlMs,
    })
    inflight.delete(key)
    return data
  })().catch((e) => {
    inflight.delete(key)
    throw e
  })

  inflight.set(key, p)
  return p
}
