import { BlogPostMeta, getBlogCache, getPostUrl } from "./getBlogPosts"

export interface HomepageGuide extends BlogPostMeta {
  url: string
  countryLabel: string
  cityLabel: string
  cityKey: string
  score: number
  isHub: boolean
  isPillar: boolean
}

export interface HomepageCollections {
  topDestinations: HomepageGuide[]
  popularGuides: HomepageGuide[]
  featuredGuides: HomepageGuide[]
  latestGuides: HomepageGuide[]
  heroQuickLinks: { label: string; href: string }[]
  editorPicks: HomepageGuide[]
}

interface RankedGuide extends HomepageGuide {
  dateValue: number
}

const BACKPACKING_CITY_TAGS = [
  "Hanoi", "Bangkok", "Chiang Mai", "Manila", "Bali",
  "Kathmandu", "La Paz", "Cusco", "Medellin", "Oaxaca",
  "Cape Town", "Marrakech", "Cairns", "Queenstown",
  "Reykjavik", "Lofoten", "Tbilisi", "Sarajevo",
]

const PRIORITY_CITY_KEYS = [
  "hanoi", "bangkok", "chiang-mai", "kathmandu", "la-paz",
  "cape-town", "queenstown", "reykjavik", "cairns", "medellin", "manila",
]

let cachedCollections: HomepageCollections | null = null
let cachedRankedGuides: RankedGuide[] | null = null

function formatLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function parseDateValue(date: string): number {
  const parsed = Date.parse(date)
  return Number.isNaN(parsed) ? 0 : parsed
}

function getDaysSince(date: string): number {
  const dateValue = parseDateValue(date)
  if (!dateValue) return 9999
  const ms = Date.now() - dateValue
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function extractPrimaryCityTag(post: BlogPostMeta): string | null {
  for (const cityTag of BACKPACKING_CITY_TAGS) {
    if (post.tags.some((t) => t === cityTag)) return cityTag
  }
  return null
}

function isHubGuide(post: BlogPostMeta): boolean {
  return post.tags.some((t) => t === "Hub Page")
}

function isPillarGuide(post: BlogPostMeta): boolean {
  return (
    post.tags.some((t) => t === "Pillar Content" || t === "Pillar") ||
    post.slug.endsWith("-nightlife") ||
    post.slug.endsWith("-activities") ||
    post.slug.endsWith("-hidden-gems")
  )
}

function scoreGuide(post: BlogPostMeta): number {
  const slug = post.slug
  const excerptLength = post.excerpt.trim().length
  const daysSince = getDaysSince(post.date)
  const hub = isHubGuide(post)
  const pillar = isPillarGuide(post)

  let score = 0

  if (hub) score += 40
  if (pillar) score += 30
  if (slug.endsWith("-nightlife")) score += 20
  if (slug.endsWith("-activities")) score += 15
  if (slug.endsWith("-hidden-gems")) score += 15
  if (excerptLength >= 90 && excerptLength <= 220) score += 5
  if (post.featuredImage.includes("placeholder")) score -= 30
  if (post.title.length < 26) score -= 3

  if (daysSince <= 30) score += 14
  else if (daysSince <= 90) score += 10
  else if (daysSince <= 180) score += 7
  else if (daysSince <= 365) score += 4
  else if (daysSince <= 540) score += 1

  return score
}

function toRankedGuide(post: BlogPostMeta): RankedGuide {
  const cityTag = extractPrimaryCityTag(post)
  const cityKey = cityTag ? cityTag.toLowerCase().replace(/\s+/g, "-") : "adventure"
  const cityLabel = cityTag || "Adventure"

  return {
    ...post,
    url: getPostUrl(post.slug, "", post.folder, post.subfolders),
    countryLabel: cityLabel,
    cityLabel,
    cityKey,
    score: scoreGuide(post),
    isHub: isHubGuide(post),
    isPillar: isPillarGuide(post),
    dateValue: parseDateValue(post.date),
  }
}

function compareRankedGuides(a: RankedGuide, b: RankedGuide): number {
  if (a.score !== b.score) return b.score - a.score
  return b.dateValue - a.dateValue
}

function getRankedGuides(): RankedGuide[] {
  if (cachedRankedGuides) return cachedRankedGuides

  cachedRankedGuides = getBlogCache()
    .map(toRankedGuide)
    .filter((guide) => !!guide.featuredImage && !guide.featuredImage.includes("placeholder"))

  return cachedRankedGuides
}

function pickGuides(
  candidates: RankedGuide[],
  usedSlugs: Set<string>,
  count: number,
  options?: {
    maxPerCity?: number
    uniqueCity?: boolean
    maxAgeDays?: number
  },
): RankedGuide[] {
  const selected: RankedGuide[] = []
  const cityCounts = new Map<string, number>()
  const seenCityKeys = new Set<string>()

  for (const guide of candidates) {
    if (selected.length >= count) break
    if (usedSlugs.has(guide.slug)) continue
    if (options?.maxAgeDays && getDaysSince(guide.date) > options.maxAgeDays) continue

    const cityCount = cityCounts.get(guide.cityKey) || 0
    if (options?.maxPerCity && cityCount >= options.maxPerCity) continue
    if (options?.uniqueCity && seenCityKeys.has(guide.cityKey)) continue

    selected.push(guide)
    cityCounts.set(guide.cityKey, cityCount + 1)
    seenCityKeys.add(guide.cityKey)
    usedSlugs.add(guide.slug)
  }

  return selected
}

function buildTopDestinations(ranked: RankedGuide[], usedSlugs: Set<string>): RankedGuide[] {
  const candidatePool = ranked.filter((guide) => guide.isHub || guide.isPillar)
  const bestByCity = new Map<string, RankedGuide>()

  for (const guide of candidatePool) {
    const existing = bestByCity.get(guide.cityKey)
    if (!existing) {
      bestByCity.set(guide.cityKey, guide)
      continue
    }
    const existingScore = existing.score + (existing.isHub ? 10 : 0)
    const guideScore = guide.score + (guide.isHub ? 10 : 0)
    if (guideScore > existingScore || (guideScore === existingScore && guide.dateValue > existing.dateValue)) {
      bestByCity.set(guide.cityKey, guide)
    }
  }

  const selected: RankedGuide[] = []
  const seenCities = new Set<string>()

  for (const cityKey of PRIORITY_CITY_KEYS) {
    if (selected.length >= 6) break
    const guide = bestByCity.get(cityKey)
    if (!guide || usedSlugs.has(guide.slug)) continue
    if (seenCities.has(guide.cityKey)) continue
    selected.push(guide)
    usedSlugs.add(guide.slug)
    seenCities.add(guide.cityKey)
  }

  if (selected.length < 6) {
    const fallback = Array.from(bestByCity.values()).sort(compareRankedGuides)
    for (const guide of fallback) {
      if (selected.length >= 6) break
      if (usedSlugs.has(guide.slug)) continue
      if (seenCities.has(guide.cityKey)) continue
      selected.push(guide)
      usedSlugs.add(guide.slug)
      seenCities.add(guide.cityKey)
    }
  }

  return selected
}

function buildPopularGuides(ranked: RankedGuide[], usedSlugs: Set<string>): RankedGuide[] {
  const candidates = ranked
    .filter((guide) => !guide.isHub && (guide.isPillar || guide.score >= 28))
    .sort(compareRankedGuides)

  const selected = pickGuides(candidates, usedSlugs, 6, {
    maxPerCity: 2,
    uniqueCity: true,
    maxAgeDays: 540,
  })

  if (selected.length < 6) {
    selected.push(...pickGuides(candidates, usedSlugs, 6 - selected.length, {
      maxPerCity: 3,
      uniqueCity: false,
    }))
  }

  return selected
}

function buildFeaturedGuides(ranked: RankedGuide[], usedSlugs: Set<string>): RankedGuide[] {
  const primary = ranked
    .filter((guide) => guide.isPillar || guide.isHub || guide.score >= 30)
    .sort(compareRankedGuides)
  const selected = pickGuides(primary, usedSlugs, 9, {
    maxPerCity: 3,
    uniqueCity: true,
    maxAgeDays: 720,
  })

  if (selected.length < 9) {
    const fallback = [...ranked].sort(compareRankedGuides)
    selected.push(...pickGuides(fallback, usedSlugs, 9 - selected.length, {
      maxPerCity: 3,
      uniqueCity: true,
    }))
  }

  return selected
}

function buildLatestGuides(ranked: RankedGuide[], usedSlugs: Set<string>): RankedGuide[] {
  const latest = [...ranked].sort((a, b) => b.dateValue - a.dateValue || compareRankedGuides(a, b))
  const selected = pickGuides(latest, usedSlugs, 6, {
    maxPerCity: 2,
    uniqueCity: false,
    maxAgeDays: 365,
  })

  if (selected.length < 6) {
    selected.push(...pickGuides(latest, usedSlugs, 6 - selected.length, {
      maxPerCity: 3,
      uniqueCity: false,
    }))
  }

  return selected
}

export function getHomepageCollections(): HomepageCollections {
  if (cachedCollections) return cachedCollections

  const ranked = getRankedGuides()
  const usedSlugs = new Set<string>()
  const topDestinations = buildTopDestinations(ranked, usedSlugs)
  const popularGuides = buildPopularGuides(ranked, usedSlugs)
  const featuredGuides = buildFeaturedGuides(ranked, usedSlugs)
  const latestGuides = buildLatestGuides(ranked, usedSlugs)
  const editorPicks = [...topDestinations, ...popularGuides, ...featuredGuides].slice(0, 4)
  const heroQuickLinks = topDestinations.slice(0, 4).map((guide) => ({
    label: guide.cityLabel,
    href: guide.url,
  }))

  cachedCollections = {
    topDestinations,
    popularGuides,
    featuredGuides,
    latestGuides,
    heroQuickLinks,
    editorPicks,
  }

  return cachedCollections
}

export function getRecentlyUpdatedGuides(count: number = 8): HomepageGuide[] {
  const ranked = getRankedGuides()
  const now = Date.now()
  const maxAgeMs = 60 * 24 * 60 * 60 * 1000 // 60 days

  const candidates = ranked
    .filter((guide) => {
      const updated = guide.lastUpdate
      if (!updated) return false
      const updatedTime = Date.parse(updated)
      if (!updatedTime) return false
      if (now - updatedTime > maxAgeMs) return false
      return true
    })
    .sort((a, b) => Date.parse(b.lastUpdate!) - Date.parse(a.lastUpdate!))

  const selected: HomepageGuide[] = []
  const cityCounts = new Map<string, number>()
  const dateCounts = new Map<string, number>()
  const usedSlugs = new Set<string>()

  for (const guide of candidates) {
    if (selected.length >= count) break
    if (usedSlugs.has(guide.slug)) continue
    const cityCount = cityCounts.get(guide.cityKey) || 0
    if (cityCount >= 2) continue
    const dateKey = guide.lastUpdate!.slice(0, 10)
    const dateCount = dateCounts.get(dateKey) || 0
    if (dateCount >= 2) continue
    selected.push(guide)
    cityCounts.set(guide.cityKey, cityCount + 1)
    dateCounts.set(dateKey, dateCount + 1)
    usedSlugs.add(guide.slug)
  }

  return selected
}
