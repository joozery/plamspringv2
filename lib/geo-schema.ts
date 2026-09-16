// Server-side llm-data fetch for non-JS bots (schema itself is now handled by lib/page-schema.tsx).

const SITE = "https://www.palmsprings.co.th"
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour
const entityCache = new Map<string, { data: Record<string, unknown> | null; expires: number }>()

export async function fetchEntityData(pagePath: string): Promise<Record<string, unknown> | null> {
  const key = process.env.NEXT_PUBLIC_AEO_GEO_KEY
  if (!key) return null

  const pageUrl = `${SITE}${pagePath}`
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
