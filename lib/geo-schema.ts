// Fetches Ansio's llm-data + schema server-side so bots that don't run JS can
// see them (aeo.js only injects both client-side, after page load). aeo.js
// skips re-injecting if #llm-data / a ld+json tag already exists, so it's
// safe to keep both.

const SITE = "https://www.palmsprings.co.th"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const entityCache = new Map<string, { data: Record<string, unknown> | null; expires: number }>()
const schemaCache = new Map<string, { data: object | null; expires: number }>()

export async function fetchEntityData(pageUrl: string, key: string): Promise<Record<string, unknown> | null> {
  const cached = entityCache.get(pageUrl)
  if (cached && cached.expires > Date.now()) return cached.data

  try {
    const res = await fetch(
      `https://api.ansio.dev/v1/llm/data?key=${encodeURIComponent(key)}&url=${encodeURIComponent(pageUrl)}`,
      { headers: { Origin: SITE }, signal: AbortSignal.timeout(3000) }
    )
    const { entity_data } = (await res.json()) as { entity_data: Record<string, unknown> | null }
    entityCache.set(pageUrl, { data: entity_data, expires: Date.now() + CACHE_TTL_MS })
    return entity_data
  } catch (err) {
    console.error("[geo-schema] llm-data fetch failed:", err)
    return entityCache.get(pageUrl)?.data ?? null // use stale cache instead of nothing
  }
}

// Ansio re-fetches the page itself and generates the real schema from that —
// `content` here only seeds its cache key and is a fallback if that fetch
// fails, so a short constant string is enough. It must stay constant per
// page though, since a changed hash busts Ansio's own 7-day cache and forces
// a slow regeneration.
export async function fetchSchema(pageUrl: string, title: string, key: string): Promise<object | null> {
  const cached = schemaCache.get(pageUrl)
  if (cached && cached.expires > Date.now()) return cached.data

  try {
    const res = await fetch("https://api.ansio.dev/v1/schema", {
      method:  "POST",
      headers: { "Content-Type": "application/json", "X-Client-Key": key, Origin: SITE },
      body:    JSON.stringify({ url: pageUrl, title, content: `${title} — palmsprings.co.th`, lang: "th" }),
      signal:  AbortSignal.timeout(8000), // first generation per page can be slow; cached after
    })
    const { schema } = (await res.json()) as { schema: object }
    schemaCache.set(pageUrl, { data: schema, expires: Date.now() + CACHE_TTL_MS })
    return schema
  } catch (err) {
    console.error("[geo-schema] schema fetch failed:", err)
    return schemaCache.get(pageUrl)?.data ?? null
  }
}

export async function fetchGeoData(pagePath: string, title: string) {
  const key = process.env.NEXT_PUBLIC_AEO_GEO_KEY
  if (!key) return { entityData: null, schema: null }

  const pageUrl = `${SITE}${pagePath}`
  const [entityData, schema] = await Promise.all([
    fetchEntityData(pageUrl, key),
    fetchSchema(pageUrl, title, key),
  ])
  return { entityData, schema }
}
