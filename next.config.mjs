let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization is critical for Core Web Vitals (LCP/CLS). Next.js emits
  // AVIF/WebP, responsive srcsets, and lazy loading automatically.
  // If you host off-Vercel and want to disable this, set DISABLE_IMAGE_OPT=1.
  images: {
    unoptimized: process.env.DISABLE_IMAGE_OPT === "1",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // Vercel Blob (for images uploaded via scripts/upload-images-to-blob.ts)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Flickr Creative Commons (used by the t-featured-image Flickr mode)
      { protocol: "https", hostname: "live.staticflickr.com" },
      { protocol: "https", hostname: "*.staticflickr.com" },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days — featured images rarely change
  },
  compress: true,
  poweredByHeader: false,
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  async redirects() {
    return [
      // Amsterdam cluster MERGE consolidation
      {
        source: '/amsterdam-adventures',
        destination: '/amsterdam-activities',
        permanent: true,
      },
      {
        source: '/amsterdam-experiences',
        destination: '/amsterdam-activities',
        permanent: true,
      },
      {
        source: '/amsterdam-highlights',
        destination: '/amsterdam-activities',
        permanent: true,
      },

      // Kanazawa cluster MERGE consolidation — 2026-05-11
      { source: "/kanazawa-2-day-itinerary", destination: "/2-day-kanazawa-itinerary-for-authentic-cultural-experiences", permanent: true },
      { source: "/kanazawa-activities", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-adventures", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-culture", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-events", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-experiences", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-highlights", destination: "/kanazawa-attractions", permanent: true },
      { source: "/kanazawa-itinerary-2-days", destination: "/2-day-kanazawa-itinerary-for-authentic-cultural-experiences", permanent: true },
      { source: "/kanazawa-landmarks", destination: "/kanazawa-attractions", permanent: true },
      { source: "/things-to-do-in-kanazawa", destination: "/kanazawa-attractions", permanent: true },
      // Kagoshima cluster MERGE consolidation 2026-05-10 — 5 hub-synonyms → kagoshima-attractions
      { source: '/kagoshima-activities', destination: '/kagoshima-attractions', permanent: true },
      { source: '/kagoshima-experiences', destination: '/kagoshima-attractions', permanent: true },
      { source: '/kagoshima-highlights', destination: '/kagoshima-attractions', permanent: true },
      { source: '/kagoshima-landmarks', destination: '/kagoshima-attractions', permanent: true },
      { source: '/things-to-do-in-kagoshima', destination: '/kagoshima-attractions', permanent: true },
      // beppu cluster MERGE plan — 23 cannibalization variants → 8 canonicals
      // Source: cluster-blueprint/beppu-attractions/merge-plan.md (2026-05-02)
      // → beppu-attractions (pillar; absorbs 10 hub-synonym + things-list variants)
      { source: '/adventurous-things-to-do-in-beppu', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-activities', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-adventures', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-culture', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-events', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-experiences', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-highlights', destination: '/beppu-attractions', permanent: true },
      { source: '/beppu-landmarks', destination: '/beppu-attractions', permanent: true },
      { source: '/things-to-do-in-beppu', destination: '/beppu-attractions', permanent: true },
      // → beppu-jigoku-meguri-ticket-costs (defending winner; pos 4.0, 677 imp/28d)
      { source: '/beppu-hell-tour-ticket-prices', destination: '/beppu-jigoku-meguri-ticket-costs', permanent: true },
      { source: '/beppu-hells-entrance-fee-and-discounts', destination: '/beppu-jigoku-meguri-ticket-costs', permanent: true },
      { source: '/beppu-hells-ticket-prices-and-discounts', destination: '/beppu-jigoku-meguri-ticket-costs', permanent: true },
      { source: '/beppu-jigoku-meguri-ticket-prices', destination: '/beppu-jigoku-meguri-ticket-costs', permanent: true },
      // → beppu-hells-walking-route-itinerary
      { source: '/beppu-hells-walking-tour-route', destination: '/beppu-hells-walking-route-itinerary', permanent: true },
      { source: '/walking-route-for-beppu-jigoku-meguri', destination: '/beppu-hells-walking-route-itinerary', permanent: true },
      // → best-time-to-visit-beppu-japan
      { source: '/best-season-for-beppu-adventures', destination: '/best-time-to-visit-beppu-japan', permanent: true },
      { source: '/best-season-for-beppu-sightseeing', destination: '/best-time-to-visit-beppu-japan', permanent: true },
      // → best-time-to-visit-beppu-ropeway
      { source: '/best-season-for-beppu-ropeway', destination: '/best-time-to-visit-beppu-ropeway', permanent: true },
      // → best-time-for-beppu-hot-springs
      { source: '/best-time-to-visit-beppu-onsens', destination: '/best-time-for-beppu-hot-springs', permanent: true },
      // → how-to-experience-a-sand-bath
      { source: '/how-to-book-beppu-sand-baths', destination: '/how-to-experience-a-sand-bath', permanent: true },
      { source: '/how-to-use-beppu-sand-baths', destination: '/how-to-experience-a-sand-bath', permanent: true },
      // → unique-hells-of-beppu-tour
      { source: '/must-see-beppu-hells-tour-highlights', destination: '/unique-hells-of-beppu-tour', permanent: true },
      // beppu cluster REWRITE — year-stale slug → year-agnostic canonical (2026 refresh)
      { source: '/beppu-hatto-onsen-festival-2024-dates', destination: '/beppu-hatto-onsen-festival', permanent: true },
      // naha cluster MERGE plan — 8 hub-synonym variants → naha-attractions pillar
      // Source: cluster-blueprint/naha-attractions/merge-plan.md (2026-05-09)
      // Pillar EXPAND landed in same release; absorbed structural sections (Day trips,
      // Where to stay, Getting around, Food essentials) before redirects.
      { source: '/naha-activities', destination: '/naha-attractions', permanent: true },
      { source: '/naha-adventures', destination: '/naha-attractions', permanent: true },
      { source: '/naha-culture', destination: '/naha-attractions', permanent: true },
      { source: '/naha-events', destination: '/naha-attractions', permanent: true },
      { source: '/naha-experiences', destination: '/naha-attractions', permanent: true },
      { source: '/naha-highlights', destination: '/naha-attractions', permanent: true },
      { source: '/naha-landmarks', destination: '/naha-attractions', permanent: true },
      { source: '/things-to-do-in-naha', destination: '/naha-attractions', permanent: true },
      // fukuoka cluster MERGE backfill — broken inbound links discovered 2026-05-09
      // 10 deleted synonym/itinerary slugs → fukuoka-attractions pillar
      { source: '/fukuoka-activities', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-culture', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-events', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-experiences', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-highlights', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-itinerary', destination: '/fukuoka-attractions', permanent: true },
      { source: '/fukuoka-landmarks', destination: '/fukuoka-attractions', permanent: true },
      { source: '/things-to-do-in-fukuoka', destination: '/fukuoka-attractions', permanent: true },
      { source: '/10-must-see-fukuoka-cultural-attractions', destination: '/fukuoka-attractions', permanent: true },
      { source: '/how-to-spend-a-day-in-fukuoka', destination: '/fukuoka-attractions', permanent: true },
      // nikko cluster MERGE plan — 8 hub-synonym variants → nikko-attractions pillar
      // Source: cluster-blueprint/nikko-attractions/merge-plan.md (2026-05-02)
      // → nikko-attractions (pillar; absorbs 7 HUB_SUFFIX + 1 THINGS-LIST variants)
      { source: '/nikko-activities', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-adventures', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-culture', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-events', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-experiences', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-highlights', destination: '/nikko-attractions', permanent: true },
      { source: '/nikko-landmarks', destination: '/nikko-attractions', permanent: true },
      { source: '/things-to-do-in-nikko', destination: '/nikko-attractions', permanent: true },
      // nagasaki cluster MERGE plan — 8 hub-synonym variants → nagasaki-attractions pillar
      // Source: cluster-blueprint/nagasaki-attractions/merge-plan.md (2026-05-09)
      // Pillar REWRITE absorbed Historic Landmarks, Cultural Heart, Year-Round Events
      // sections from losers before redirects landed.
      { source: '/nagasaki-activities', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-adventures', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-culture', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-events', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-experiences', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-highlights', destination: '/nagasaki-attractions', permanent: true },
      { source: '/nagasaki-landmarks', destination: '/nagasaki-attractions', permanent: true },
      { source: '/things-to-do-in-nagasaki', destination: '/nagasaki-attractions', permanent: true },
    
      // Nagoya cluster MERGE consolidation (2026-05-10) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/nagoya-activities',       destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-adventures',       destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-culture',          destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-events',           destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-experiences',      destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-highlights',       destination: '/nagoya-attractions', permanent: true },
      { source: '/nagoya-landmarks',        destination: '/nagoya-attractions', permanent: true },
      { source: '/things-to-do-in-nagoya',  destination: '/nagoya-attractions', permanent: true },
    
      // Yokohama cluster MERGE consolidation (2026-05-11) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/things-to-do-in-yokohama',  destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-activities',       destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-adventures',       destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-culture',          destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-events',           destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-experiences',      destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-highlights',       destination: '/yokohama-attractions', permanent: true },
      { source: '/yokohama-landmarks',        destination: '/yokohama-attractions', permanent: true },
    
      // Matsumoto cluster MERGE consolidation (2026-05-11) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/matsumoto-activities',       destination: '/matsumoto-attractions', permanent: true },
      { source: '/matsumoto-adventures',       destination: '/matsumoto-attractions', permanent: true },
      { source: '/matsumoto-culture',          destination: '/matsumoto-attractions', permanent: true },
      { source: '/matsumoto-experiences',      destination: '/matsumoto-attractions', permanent: true },
      { source: '/matsumoto-highlights',       destination: '/matsumoto-attractions', permanent: true },
      { source: '/matsumoto-landmarks',        destination: '/matsumoto-attractions', permanent: true },
      { source: '/things-to-do-in-matsumoto',  destination: '/matsumoto-attractions', permanent: true },
    
      // Kumamoto cluster MERGE consolidation (2026-05-15) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/kumamoto-activities',       destination: '/kumamoto-attractions', permanent: true },
      { source: '/kumamoto-adventures',       destination: '/kumamoto-attractions', permanent: true },
      { source: '/kumamoto-culture',          destination: '/kumamoto-attractions', permanent: true },
      { source: '/kumamoto-experiences',      destination: '/kumamoto-attractions', permanent: true },
      { source: '/kumamoto-highlights',       destination: '/kumamoto-attractions', permanent: true },
      { source: '/kumamoto-itinerary',        destination: '/kumamoto-day-trip-itinerary', permanent: true },
      { source: '/kumamoto-landmarks',        destination: '/kumamoto-attractions', permanent: true },
      { source: '/things-to-do-in-kumamoto',  destination: '/kumamoto-attractions', permanent: true },
    
      // Nara cluster MERGE consolidation (2026-05-15) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/nara-activities',   destination: '/nara-attractions', permanent: true },
      { source: '/nara-adventures',   destination: '/nara-attractions', permanent: true },
      { source: '/nara-culture',      destination: '/nara-attractions', permanent: true },
      { source: '/nara-events',       destination: '/nara-attractions', permanent: true },
      { source: '/nara-experiences',  destination: '/nara-attractions', permanent: true },
      { source: '/nara-highlights',   destination: '/nara-attractions', permanent: true },
      { source: '/nara-landmarks',    destination: '/nara-attractions', permanent: true },
    
      // Niseko cluster MERGE consolidation (2026-05-15) — synonym-pillar cannibalization
      // Source: cluster-blueprint/niseko-attractions/merge-plan.md
      // 8 hub-synonym losers → niseko-attractions pillar (all redundant generic filler, no content absorption)
      { source: '/niseko-activities',       destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-adventures',       destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-culture',          destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-events',           destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-experiences',      destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-highlights',       destination: '/niseko-attractions', permanent: true },
      { source: '/niseko-landmarks',        destination: '/niseko-attractions', permanent: true },
      { source: '/things-to-do-in-niseko',  destination: '/niseko-attractions', permanent: true },

      // Takayama cluster MERGE consolidation (2026-05-15) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/takayama-activities',       destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-adventures',       destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-culture',          destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-events',           destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-experiences',      destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-highlights',       destination: '/takayama-attractions', permanent: true },
      { source: '/takayama-landmarks',        destination: '/takayama-attractions', permanent: true },
      { source: '/things-to-do-in-takayama',  destination: '/takayama-attractions', permanent: true },
    
      // Nottingham cluster MERGE consolidation (2026-05-16) — synonym-pillar cannibalization
      // Synonym hubs targeting the same SERP intent consolidated into canonical destinations.
      { source: '/nottingham-adventures',    destination: '/nottingham-activities', permanent: true },
      { source: '/nottingham-culture',       destination: '/nottingham-activities', permanent: true },
      { source: '/nottingham-events',        destination: '/nottingham-events-this-weekend', permanent: true },
      { source: '/nottingham-experiences',   destination: '/nottingham-activities', permanent: true },
      { source: '/nottingham-highlights',    destination: '/nottingham-activities', permanent: true },
      { source: '/nottingham-itinerary',     destination: '/nottingham-2-day-itinerary', permanent: true },
      { source: '/nottingham-landmarks',     destination: '/nottingham-attractions-complete-guide', permanent: true },
      { source: '/nottingham-nightlife',     destination: '/nottingham-things-to-do-at-night', permanent: true },
    ]
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
