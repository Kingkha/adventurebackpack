import { NextResponse, type NextRequest } from 'next/server'
import { getBaseUrl } from '@/lib/siteConfig'

const DUPLICATE_SUFFIX_RE = /^(.*)-(\d{1,2})$/
const SITEMAP_TTL_MS = 60 * 60 * 1000

// Canonical host derived from siteConfig.baseUrl + siteConfig.domain.www flag.
// This is computed once at module load — Next.js middleware modules run in the
// edge runtime and we want this to be a constant, not a per-request lookup.
const CANONICAL_HOST = (() => {
  try {
    const base = new URL(getBaseUrl())
    return base.host
  } catch {
    return null
  }
})()

let sitemapPathCache: Set<string> | null = null
let sitemapCacheExpiresAt = 0

function normalizePath(pathname: string): string {
  let normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }
  return normalized
}

function safeDecode(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}

async function getSitemapPaths(origin: string): Promise<Set<string> | null> {
  const now = Date.now()
  if (sitemapPathCache && now < sitemapCacheExpiresAt) {
    return sitemapPathCache
  }

  try {
    const sitemapUrl = new URL('/sitemap.xml', origin)
    const response = await fetch(sitemapUrl.toString(), { cache: 'force-cache' })
    if (!response.ok) return null

    const xml = await response.text()
    const paths = new Set<string>()
    const locRegex = /<loc>(.*?)<\/loc>/gi
    let match: RegExpExecArray | null

    while ((match = locRegex.exec(xml)) !== null) {
      const loc = match[1]?.trim()
      if (!loc) continue

      try {
        const url = new URL(loc)
        const normalized = normalizePath(url.pathname)
        paths.add(normalized)
        const decoded = safeDecode(normalized)
        if (decoded !== normalized) paths.add(decoded)
      } catch {
        const normalized = normalizePath(loc)
        paths.add(normalized)
        const decoded = safeDecode(normalized)
        if (decoded !== normalized) paths.add(decoded)
      }
    }

    if (paths.size > 0) {
      sitemapPathCache = paths
      sitemapCacheExpiresAt = now + SITEMAP_TTL_MS
      return sitemapPathCache
    }
  } catch {
    return null
  }

  return null
}

async function handleDuplicateSuffix(pathname: string, request: NextRequest): Promise<NextResponse | null> {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return null

  const lastSegment = segments[segments.length - 1]
  const match = lastSegment.match(DUPLICATE_SUFFIX_RE)
  if (!match) return null

  const baseSegment = match[1]
  if (!baseSegment) return null

  const basePath = normalizePath(`/${[...segments.slice(0, -1), baseSegment].join('/')}`)
  if (basePath === pathname) return null

  const paths = await getSitemapPaths(new URL(request.url).origin)
  if (!paths) return null

  if (paths.has(basePath) || paths.has(safeDecode(basePath))) {
    const url = new URL(request.url)
    url.pathname = basePath
    return NextResponse.redirect(url, 301)
  }

  return new NextResponse('Gone', { status: 410 })
}

// Cluster MERGE redirects (fukuoka, 2026-04-30) — 28 cannibalization variants
// fold into 11 canonical merge targets per cluster blueprint AUDIT.
const FUKUOKA_MERGE_REDIRECTS: Record<string, string> = {
  '/best-time-for-fukuoka-cherry-blossoms': '/best-time-to-visit-fukuoka',
  '/best-time-to-visit-fukuoka-castle-ruins-for-cherry-blossoms-2026': '/best-time-to-visit-fukuoka',
  '/best-time-to-visit-fukuoka-seasonal-guide-and-festivals': '/best-time-to-visit-fukuoka',
  '/best-time-to-visit-fukuoka-seasonal-guide-cherry-blossoms-festivals-typhoon': '/best-time-to-visit-fukuoka',
  '/cheap-and-free-things-to-do-in-fukuoka': '/free-things-to-do-in-fukuoka',
  '/free-and-budget-friendly-fukuoka-cultural-experiences': '/free-things-to-do-in-fukuoka',
  '/free-things-to-do-in-fukuoka-on-a-budget': '/free-things-to-do-in-fukuoka',
  '/fukuoka-on-a-budget-free-and-cheap-attractions-2026': '/free-things-to-do-in-fukuoka',
  '/budget-travel-fukuoka-free-things-to-do': '/free-things-to-do-in-fukuoka',
  '/budget-nightlife-fukuoka-cheap-drinks-and-late-night-ramen': '/fukuoka-travel-budget-and-daily-costs-2026',
  '/fukuoka-yatai-etiquette-a-guide-to-street-food-stalls': '/how-to-visit-fukuoka-yatai-street-food-stalls',
  '/how-to-eat-at-fukuoka-yatai-etiquette-guide': '/how-to-visit-fukuoka-yatai-street-food-stalls',
  '/how-to-visit-fukuoka-yatai-stalls-etiquette-and-rules': '/how-to-visit-fukuoka-yatai-street-food-stalls',
  '/how-to-visit-nanzoin-temple-fukuoka-dress-code-and-logistics': '/how-to-visit-nanzoin-temple-reclining-buddha-from-fukuoka',
  '/how-to-visit-nanzoin-temple-reclining-buddha-from-hakata': '/how-to-visit-nanzoin-temple-reclining-buddha-from-fukuoka',
  '/how-to-get-to-nanzoin-temple-reclining-buddha-from-hakata': '/how-to-visit-nanzoin-temple-reclining-buddha-from-fukuoka',
  '/how-to-visit-fukuoka-castle-ruins-and-tamon-turret': '/how-to-visit-fukuoka-castle-ruins',
  '/attending-hakata-gion-yamakasa-fukuoka-summer-festival-guide': '/hakata-gion-yamakasa-festival-2026-dates-and-viewing-guide',
  '/hakata-gion-yamakasa-festival-best-viewing-spots-at-kushida-shrine': '/hakata-gion-yamakasa-festival-2026-dates-and-viewing-guide',
  '/how-to-visit-hakata-gion-yamakasa': '/hakata-gion-yamakasa-festival-2026-dates-and-viewing-guide',
  '/1-day-fukuoka-landmarks-itinerary-from-samurai-history-to-modern-towers': '/fukuoka-1-day-itinerary-for-short-stay-travelers',
  '/one-day-fukuoka-itinerary-for-first-timers': '/fukuoka-1-day-itinerary-for-short-stay-travelers',
  '/one-day-fukuoka-itinerary-for-sightseeing': '/fukuoka-1-day-itinerary-for-short-stay-travelers',
  '/one-day-fukuoka-festival-walking-route': '/fukuoka-1-day-itinerary-for-short-stay-travelers',
  '/10-must-see-fukuoka-landmarks-and-cultural-sites': '/10-must-see-fukuoka-cultural-attractions',
  '/top-7-fukuoka-cultural-landmarks-and-historic-sites': '/10-must-see-fukuoka-cultural-attractions',
  '/top-outdoor-activities-and-nature-spots-in-fukuoka': '/outdoor-activities-in-fukuoka',
  '/how-to-get-around-fukuoka-subway-day-pass-vs-nimoca-ic-card': '/fukuoka-city-subway-pass-vs-tourist-city-pass-budget-travel-guide',
  // Round 2 (2026-04-30) — synonym-pillar consolidation per Phase 6.5c blueprint:
  // 11 hub-synonyms competing for "things to do in fukuoka" SERP fold into the canonical pillar
  '/fukuoka-activities': '/fukuoka-attractions',
  '/fukuoka-adventures': '/fukuoka-attractions',
  '/fukuoka-culture': '/fukuoka-attractions',
  '/fukuoka-events': '/fukuoka-attractions',
  '/fukuoka-experiences': '/fukuoka-attractions',
  '/fukuoka-highlights': '/fukuoka-attractions',
  '/fukuoka-landmarks': '/fukuoka-attractions',
  '/things-to-do-in-fukuoka': '/fukuoka-attractions',
  '/12-best-things-to-do-in-fukuoka-japan': '/fukuoka-attractions',
  '/10-must-see-fukuoka-cultural-attractions': '/fukuoka-attractions',
  '/cultural-activities-in-fukuoka': '/fukuoka-attractions',
  // 2 itinerary-overlap merges
  '/how-to-spend-a-day-in-fukuoka': '/fukuoka-1-day-itinerary-for-short-stay-travelers',
  '/fukuoka-itinerary': '/fukuoka-itinerary-5-days-historic-landmarks-food-and-nature',
}

export async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  const { pathname } = url

  // Skip middleware for Next.js internals and API routes.
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Cluster MERGE redirects — check before any other normalization
  const fukuokaTarget = FUKUOKA_MERGE_REDIRECTS[pathname.replace(/\/$/, '')]
  if (fukuokaTarget) {
    url.pathname = fukuokaTarget
    return NextResponse.redirect(url, 301)
  }

  // Canonical host enforcement — redirect www ↔ apex based on siteConfig.domain.www.
  // Prevents authority split when both hosts point at the app. Skips preview/local.
  if (
    CANONICAL_HOST &&
    url.host !== CANONICAL_HOST &&
    !url.hostname.endsWith('.vercel.app') &&
    url.hostname !== 'localhost' &&
    !url.hostname.startsWith('127.') &&
    !url.hostname.startsWith('0.0.0.0')
  ) {
    // Only redirect when the incoming host is a variant of the canonical apex.
    // i.e. www.example.com ↔ example.com. Don't catch arbitrary hostnames.
    const stripWww = (h: string) => h.replace(/^www\./, '')
    if (stripWww(url.host) === stripWww(CANONICAL_HOST)) {
      url.host = CANONICAL_HOST
      return NextResponse.redirect(url, 301)
    }
  }

  let updatedPathname = pathname

  // Canonicalize /blog/<slug> → /<slug> with a PERMANENT 301, here in middleware.
  // Posts are served at the root (/<slug>); /blog/<slug> is a legacy/alternate
  // path for the same content. Without this, the request falls through to the
  // catch-all route (app/[slug]/[...rest]), which issues an in-component
  // redirect() — a 307 *temporary* redirect after fully rendering the page.
  // Googlebot keeps re-crawling temporary-redirect sources, so /blog/<slug> AND
  // /<slug> both stay in the crawl rotation = double crawl budget. A 301 here
  // drops the /blog/* copy, consolidates signals to the root URL, and short-
  // circuits before any rendering. Excludes the real /blog listing (caught by
  // startsWith('/blog/') being false for "/blog") and /blog/page/N pagination.
  if (
    updatedPathname.startsWith('/blog/') &&
    updatedPathname !== '/blog/page' &&
    !updatedPathname.startsWith('/blog/page/')
  ) {
    // Also fold underscores → hyphens (was the prior normalization step) so the
    // single 301 lands directly on the canonical root slug — no extra hop.
    const stripped = updatedPathname.replace(/_/g, '-').replace(/^\/blog/, '')
    if (stripped.length > 1) {
      // Skip bare "/blog/" (stripped === "/"), which is the listing, not a post.
      url.pathname = stripped
      return NextResponse.redirect(url, 301)
    }
  }

  // Normalize underscores for the remaining /blog/* paths (e.g. /blog/page/2).
  if (updatedPathname.startsWith('/blog/')) {
    updatedPathname = updatedPathname.replace(/_/g, '-')
  }

  const normalizedPathname = normalizePath(updatedPathname)
  const duplicateResponse = await handleDuplicateSuffix(normalizedPathname, request)
  if (duplicateResponse) return duplicateResponse

  if (updatedPathname !== pathname) {
    url.pathname = updatedPathname
    return NextResponse.redirect(url, 301)
  }

  // Otherwise, allow the request to continue
  return NextResponse.next()
}

// Tell Next.js which paths should use this middleware
export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)']
}
