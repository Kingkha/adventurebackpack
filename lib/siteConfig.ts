/**
 * Site Configuration
 *
 * Central configuration file for all branding, domain, and site information.
 * Update this file to rebrand the entire site.
 */

export const siteConfig = {
  // Brand Information
  brand: {
    name: "Adventure Backpack",
    shortName: "Adventure Backpack",
    tagline: "Adventure Backpacking Travel Guides",
    description: "Adventure Backpack is a travel publication focused on adventure backpacking and outdoor experiences worldwide, with budget-conscious itineraries, hostel picks, gear notes, and decision-ready route planning for independent travelers.",
  },

  // Domain & URLs
  domain: {
    baseUrl: "https://adventurebackpack.com",
    www: false, // Set to true if you use www subdomain
  },

  // Contact Information
  contact: {
    email: "contact@adventurebackpack.com",
    phone: "+1-555-123-4567",
    location: "Adventure Backpack Editorial Desk",
  },

  // Social Media
  // Populate ONLY when real accounts exist with content/followers.
  // Handles here feed display (footer icons) AND structured-data sameAs claims,
  // but sameAs is additionally gated by NEXT_PUBLIC_VERIFIED_SOCIALS (see
  // getVerifiedSameAs() below) so empty/broken profiles don't harm the
  // knowledge graph. Clones should reset these to null until real accounts exist.
  social: {
    twitter: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    youtube: null as string | null,
    linkedin: null as string | null,
  },

  // SEO & Meta
  seo: {
    primaryKeyword: "adventure backpacking travel",
    defaultTitle: "Adventure Backpack Guides: Backpacking Itineraries, Routes & Outdoor Tips",
    defaultDescription: "Adventure backpacking travel guides for every region — budget itineraries, hostel picks, hiking routes, gear lists, and decision-ready planning tips for independent travelers.",
    defaultKeywords: "adventurebackpack, adventure backpacking, backpacking travel, budget travel, hostel guides, hiking routes, outdoor travel, travel itineraries, adventurebackpack.com",
    ogImage: "/og-image.webp",
    favicon: "/favicon.ico",
    appleIcon: "/apple-icon.png",
  },

  // Content Focus
  content: {
    focus: "Adventure backpacking and outdoor travel experiences worldwide",
    themes: [
  "Backpacking itineraries",
  "Budget travel routes",
  "Hostel and accommodation guides",
  "Hiking and outdoor activities",
  "Off-the-beaten-path destinations",
  "Gear and packing essentials",
],
    industry: "Travel Media",
    audience: "Independent travelers and backpackers planning multi-day routes on a budget with outdoor and cultural depth.",
  },

  // Organization Info (for Schema.org)
  organization: {
    name: "Adventure Backpack",
    foundingDate: "2026",
    numberOfEmployees: "3-8",
    industry: "Travel Media",
    knowsAbout: [
  "Backpacking itineraries",
  "Budget travel routes",
  "Hostel and accommodation guides",
  "Hiking and outdoor activities",
  "Off-the-beaten-path destinations",
  "Gear and packing essentials",
],
    awards: [
  "Recognized by readers for practical adventure backpacking guidance",
  "Consistent editorial updates driven by traveler needs",
],
  },

  // Author/Editor Info
  author: {
    defaultName: "Alex Carter",
    jobTitle: "Travel Editor",
    description: "Travel editor with extensive backpacking experience across multiple continents — covering budget routes, hostels and homestays, multi-day treks, and practical transport planning for independent travelers.",
    credentials: [
  "Multi-year backpacking experience across SE Asia, Latin America, Europe, and East Africa",
  "Specialist in budget routes, hostel networks, and overland transit planning",
  "Editorial fact-check and source-verification process for all published guides",
  "Regular on-site updates to keep pricing, hours, and route logistics accurate",
],
    alumniOf: "Adventure Backpack Editorial Desk",
  },

  // Affiliate Configuration
  affiliate: {
    domainName: "adventurebackpack",
    viatorPartnerId: "P00271059",
    getyourguidePartnerId: "26CH4CT",
    viatorWidgetRef: "W-d5dc59c4-3a04-417e-8a46-7be440461eba",
  },

  // FAQ Questions
  faq: {
    title: "Adventure Backpack FAQ",
    description: "Answers about our adventure backpacking coverage, editorial standards, and how we keep guides useful for travelers building practical multi-day routes.",
    questions: [
  { question: "How does Adventure Backpack choose what to publish?", answer: "Our editors prioritize backpacking routes, budget logistics, hostels, and outdoor activities, and select topics using search demand, seasonality, and on-the-ground relevance for independent travelers." },
  { question: "How current are your adventure backpacking guides?", answer: "We review key pages on a regular cycle and refresh critical planning details like timing windows, transit changes, hostel availability, and price-sensitive notes when conditions change." },
  { question: "Do your guides include practical planning details?", answer: "Yes. We focus on what affects decisions: best time blocks, route order, realistic pacing, hostel and transport context, and common mistakes that waste time or budget." },
  { question: "Are recommendations sponsored or pay-to-rank?", answer: "No. Editorial recommendations are ranked by usefulness and fit for travelers, not by placement fees. Any commercial relationships are disclosed separately." },
  { question: "Can I suggest a destination or topic for coverage?", answer: "Yes. Send your request through our contact page and the editorial team will review it for upcoming adventure backpacking coverage." },
],
  },

  // Testimonials
  // Rendered conditionally via NEXT_PUBLIC_TESTIMONIALS_MODE=off|placeholder|real (default: off).
  // - off: Testimonials section hidden entirely. Safest for new/zero-authority domains.
  // - placeholder: shows an editorial-standards callout instead of review cards.
  // - real: renders items[] below. ONLY enable when you have real, verifiable reader quotes.
  //   stats is OPTIONAL — only render when you can cite a real, verifiable number.
  testimonials: {
    title: "What Readers Say",
    description: "Reader feedback on how our travel content supports better trip decisions.",
    // Set to a real, verifiable number before enabling. Leave undefined to hide the stats row.
    stats: undefined as undefined | { label: string; number: string; subtext: string; description: string },
    items: [] as Array<{ name: string; location: string; quote: string; avatar: string }>,
  },

  // How It Works
  howItWorks: {
    title: "How to Use Adventure Backpack",
    description: "Plan faster with our adventure backpacking workflow.",
    steps: [
  { number: "1", title: "Choose Your Route", description: "Browse Adventure Backpack coverage and shortlist destinations based on your trip goals and budget." },
  { number: "2", title: "Compare Practical Options", description: "Use route order, timing, and budget context to decide what is worth your time on the trail." },
  { number: "3", title: "Finalize and Go", description: "Build a confident plan with the most relevant adventure backpacking guides for your trip." },
],
  },

  // CTA (Call to Action)
  cta: {
    title: "Start Planning with Adventure Backpack",
    description: "Browse our latest adventure backpacking routes and destination coverage to build your next trip with confidence.",
    primaryButton: {
      text: "Read Travel Guides",
      href: "/blog",
    },
    secondaryButton: {
      text: "About Our Editorial Team",
      href: "/about",
    },
  },

  // Hero Section
  hero: {
    badge: "Adventure backpacking guides — updated for 2026",
    title: "Adventure Backpack Guides:",
    titleHighlight: "Routes, Hostels &",
    titleSuffix: "Outdoor Planning Tips",
    subtitle: "Backpacking routes, budget itineraries, hostel picks, hiking guides, and practical planning tips for every adventure destination.",
    buttonText: "Explore Guides",
    buttonHref: "/blog",
    highlights: [
  "Routes by region",
  "Budget itineraries & day plans",
  "Hostels, trails & gear tips",
],
  },

  // About Page Content
  aboutPage: {
    intro: "is an editorial travel project focused on backpacking routes, budget logistics, and outdoor activities worldwide, with practical guidance for independent travelers planning multi-day trips.",
    story: "was built to replace vague travel content with decision-ready guidance that helps backpackers plan faster and avoid common route mistakes.",
    teamIntro: "Our team combines editorial research, local context, and QA workflows to keep adventure backpacking coverage useful and current.",
    teamRoles: [
  { title: "Editorial Researchers", description: "Writers and researchers focused on backpacking routes, hostels, and outdoor activities with practical planning depth." },
  { title: "Local Contributors", description: "Region-aware contributors who add context, constraints, and real-world route nuance." },
  { title: "Fact-Check Editors", description: "Editors who validate claims, remove stale details, and enforce clarity standards before publication." },
  { title: "Update Leads", description: "Owners of refresh cycles for high-traffic pages and season-sensitive destination guides." },
],
    researchProcess: [
  { title: "Topic Prioritization", description: "We prioritize topics where backpackers need concrete decisions, not generic inspiration." },
  { title: "Source Collection", description: "Each draft is built from primary references, local context, and practical traveler constraints." },
  { title: "Editorial Review", description: "Pages pass structure, usefulness, and accuracy checks before they are published." },
  { title: "Maintenance Cycle", description: "Important pages are revisited and refreshed when assumptions, access, timing, or logistics shift." },
],
    whatWeDo: "publishes and maintains adventure backpacking guides that emphasize tradeoffs, realistic pacing, and the details that change outcomes.",
    commitments: [
  { title: "Decision-First Guidance", description: "We optimize for decisions travelers actually need to make, with clear tradeoffs." },
  { title: "Accuracy Over Hype", description: "We avoid inflated claims and keep recommendations grounded in verifiable details." },
  { title: "Transparent Editorial Process", description: "We separate editorial judgment from commercial considerations and disclose conflicts." },
  { title: "Continuous Improvement", description: "We use feedback and performance signals to improve weak or outdated pages quickly." },
],
    credentials: [
  "Adventure backpacking editorial coverage with practical planning focus",
  "Structured update and review workflow for high-impact pages",
  "Source-based drafting and fact-check process",
  "Reader feedback loop used to refine recommendations",
  "Clear separation of editorial and commercial decisions",
  "Coverage built for travelers planning multi-day backpacking trips",
],
  },

  // Trust Page Content
  trustPage: {
    intro: "How Adventure Backpack maintains trustworthy adventure backpacking coverage.",
    expertContent: "Our content is produced by editors and researchers working on backpacking routes, hostels, and outdoor activities with clear usefulness and accuracy standards.",
    verificationProcess: "Before publication, pages are reviewed for factual support, route logic, and practical constraints. High-impact pages are revalidated on a recurring schedule.",
    localExpertise: "We incorporate local context to improve recommendations around timing, transport, area differences, and on-the-ground feasibility.",
    transparency: "We keep editorial criteria explicit, separate editorial decisions from commercial influence, and correct verified issues quickly.",
    expertTeam: [
  { title: "Section Editors", description: "Set quality standards, approve final recommendations, and enforce consistency." },
  { title: "Research Writers", description: "Develop detailed drafts around backpacking routes, hostels, and outdoor activities and practical traveler decision points." },
  { title: "Local Reviewers", description: "Stress-test recommendations against local realities, routing constraints, and seasonality." },
  { title: "Quality Assurance Editors", description: "Run link, logic, and freshness checks to keep content reliable over time." },
],
    qualityAssurance: [
  { title: "Claim Verification", description: "Factual claims are checked against primary or direct sources before publication." },
  { title: "Freshness Reviews", description: "Key pages are revisited on a schedule and updated when assumptions change." },
  { title: "Editorial Traceability", description: "We keep change history and ownership so updates are accountable and auditable." },
  { title: "Feedback Triage", description: "User-reported issues are triaged quickly and corrected when validated." },
],
  },

  // Editorial Policy Page Content (E-E-A-T signal — top-5 for cold-launch travel domains)
  editorialPolicy: {
    intro: "Our editorial process is designed to keep every guide useful, honest, and up-to-date. This page explains how we research, write, review, and correct our content.",
    contentReview: {
      title: "Content Review Workflow",
      description: "Every guide passes through a multi-stage review before publication.",
      steps: [
        { title: "Topic Selection", description: "We select topics based on traveler demand, seasonal relevance, and coverage gaps rather than affiliate revenue potential." },
        { title: "Research & Drafting", description: "Drafts are built from primary sources, on-the-ground notes, and cross-referenced with official tourism data and local operator information." },
        { title: "Editorial Review", description: "A section editor reviews the draft for factual accuracy, structure, clarity, and alignment with our style guide." },
        { title: "Fact-Check Pass", description: "Claims that affect traveler decisions (prices, opening hours, transport times) are verified against at least one authoritative source." },
        { title: "Publication & Monitoring", description: "After publishing, we monitor reader feedback and ranking signals to identify pages that need revision." },
      ],
    },
    sourceVerification: {
      title: "Source Verification",
      description: "We distinguish between primary sources (official tourism boards, direct operator websites, on-site visits), secondary sources (reputable publications with their own editorial standards), and tertiary sources (aggregators and user-generated content). Recommendations should be grounded in the first two tiers.",
      sourceTypes: [
        { tier: "Primary", examples: "Tourism boards, direct operator pricing pages, official event calendars, on-site photography and receipts" },
        { tier: "Secondary", examples: "Established travel publications with named authors and editorial standards, peer-reviewed academic work on the destination" },
        { tier: "Tertiary", examples: "User review aggregators, community forums, unverified social media — used only for qualitative context, never for factual claims" },
      ],
    },
    updateCadence: {
      title: "Update Cadence",
      description: "Travel information decays quickly. We refresh content on a tiered schedule based on how time-sensitive the details are.",
      tiers: [
        { tier: "High-volatility", frequency: "Every 2–3 months", examples: "Pricing, schedules, transit routes, opening hours, seasonal events" },
        { tier: "Medium-volatility", frequency: "Every 6 months", examples: "Top attractions, neighborhood guides, restaurant picks, nightlife" },
        { tier: "Low-volatility", frequency: "Annually", examples: "Cultural context, historical background, geographic overviews, packing advice" },
      ],
    },
    corrections: {
      title: "Corrections & Feedback",
      description: "If you find an error, email our editorial team. We verify, correct, and — when the correction affects a traveler decision — update the article's lastUpdated timestamp and add a brief note at the bottom of the page. We do not silently rewrite content.",
    },
    aiDisclosure: {
      title: "AI Tool Disclosure",
      description: "We use AI tools for drafting assistance, research synthesis, and grammar checking. Every published guide is reviewed and edited by a human editor who is responsible for its factual accuracy, tone, and recommendations. No article is published without human review.",
    },
    affiliateDisclosure: {
      title: "Affiliate Disclosure",
      description: "Some of our guides contain affiliate links to tour operators and booking platforms. When you book through these links, we may receive a small commission at no additional cost to you. Affiliate relationships never influence which providers we recommend — our rankings are based on usefulness, reliability, and traveler fit. Affiliate links are disclosed inline where they appear.",
    },
  },

  // Methodology Page Content (E-E-A-T signal — explains HOW recommendations are ranked)
  methodology: {
    intro: "How we decide what to recommend, how we rank options, and how we keep recommendations honest.",
    philosophy: "Our guides are built for travelers who need to make decisions, not for readers who want inspiration. We optimize for clarity, accuracy, and actionable detail — timing windows, realistic pacing, what to avoid, and what's genuinely worth the detour.",
    rankingCriteria: {
      title: "How We Rank Options",
      description: "When we rank experiences, neighborhoods, or operators within a guide, we use the following criteria — in this order of priority:",
      criteria: [
        { title: "Usefulness for the Reader's Decision", description: "Does this option help the traveler decide? Vague 'nice to visit' picks are cut." },
        { title: "Reliability & Accuracy", description: "Does the provider operate consistently? Are the details we've documented verifiable?" },
        { title: "On-the-Ground Verification", description: "Has our team or a trusted local contributor verified this personally or via recent traveler reports?" },
        { title: "Value for Traveler Budget", description: "Does the experience match its price point? We flag both overpriced tourist traps and underpriced hidden wins." },
        { title: "Authenticity vs. Polish Tradeoff", description: "We explain the tradeoff explicitly — some travelers want polished, some want raw. Neither is wrong." },
      ],
    },
    excludedCriteria: {
      title: "What We Don't Rank By",
      description: "Understanding what we explicitly exclude matters for trust.",
      items: [
        "Affiliate commission rates — high-commission providers get no ranking boost",
        "PR pitches and media requests from operators",
        "Social media popularity or influencer endorsements",
        "Paid placement of any kind",
      ],
    },
    dataSources: {
      title: "Where Our Data Comes From",
      description: "Our recommendations synthesize multiple signal types. We prioritize signals in this order:",
      sources: [
        { title: "Direct experience", description: "Our team's personal visits, notes, and photos" },
        { title: "Local contributors", description: "Region-based writers with lived experience in the destination" },
        { title: "Primary operator data", description: "Official schedules, menus, pricing, and capacity information" },
        { title: "Government tourism boards", description: "Official travel advisories, visa rules, and event calendars" },
        { title: "Reputable published journalism", description: "Named authors at established publications with editorial standards" },
      ],
    },
    uncertainty: {
      title: "Handling Uncertainty",
      description: "When we can't verify a detail, we say so. Phrases like 'reportedly', 'according to [source]', or 'unverified as of [date]' appear in our guides deliberately. We'd rather be honest about uncertainty than pretend to know what we don't.",
    },
  },

  // Author Page Content
  authorPage: {
    editorDescription: "is an adventure travel writer with multi-year backpacking experience across continents — from SE Asian overland routes and Andean treks to European hut-to-hut hiking and East African safari trails. Alex writes practical guides grounded in real trips, not research alone, focusing on the decisions backpackers actually face: where to base out of, how to move cheaply, and what's worth the detour.",
    contributorDescription: "is a contributor who provides local context, planning constraints, and practical insights for travelers.",
    editorCredentials: [
  "Backpacked extensively across SE Asia, Latin America, Europe, and East Africa",
  "Specialist coverage of multi-day routes, hostel networks, and overland transit",
  "First-hand research for pricing, transport routes, and route logistics",
  "Fact-check and source-verification process before publication",
  "Regular on-site updates when logistics, prices, or access conditions change",
],
    contributorCredentials: [
  "Local destination context",
  "Practical planning input",
  "Field-informed recommendations",
],
    editorExpertise: [
  "Multi-day backpacking routes",
  "Budget travel and overland transit",
  "Hostels, homestays, and guesthouse networks",
  "Hiking and trekking trails",
  "Off-the-beaten-path destinations",
  "SE Asia backpacking (Vietnam, Thailand, Indonesia, Philippines)",
  "Latin America backpacking (Peru, Bolivia, Mexico, Colombia)",
  "European long-distance hiking and rail-based itineraries",
],
    contributorExpertise: [
  "Backpacking activities",
  "Seasonal planning",
  "Local logistics",
],
    // Populate with absolute URLs ONLY when the editor has real, populated profiles.
    // These feed Person.sameAs in schema and drive Google's entity resolution.
    // Broken or empty profiles here actively HARM knowledge-graph signals.
    // Clones should reset this to [] until real editor profiles exist.
    editorSameAs: [] as string[],
  },

  // Schema.org Topics (for BlogJsonLd)
  schemaTopics: [
  "Adventure travel",
  "Backpacking",
  "Outdoor activities",
],

  // Blog
  blog: {
    name: "Blog", // Used in schema.org and footer
  },

  // Footer
  footer: {
    tagline: "Adventure backpacking travel guides and editorial insights",
    blogLinkText: "Blog",
  },

  // Header
  header: {
    exploreButtonText: "Explore Guides",
    exploreButtonTextMobile: "Explore",
    startHereText: "Start Here Guide",
    // Routes that should have opaque header (content folder names)
    // Add your content folder routes here, e.g.: '/guides/', '/destinations/'
    opaqueRoutes: [] as string[],
  },

  // Contact Page
  contactPage: {
    metaDescription: "Get in touch with our team for questions, media/partner inquiries, or to share a tip.",
    intro: "Have a question or tip to share? We'd love to hear from you. Drop us a note about guides you need, partnerships, or feedback, and we'll reply soon.",
  },

  // About Section (Homepage)
  aboutSection: {
    imageAlt: "A vibrant collage showcasing our content focus and experiences",
    paragraph1: "We're passionate about uncovering authentic experiences. Our editors and local experts explore destinations worldwide, uncovering hidden gems and local favorites that showcase the beauty and diversity of our subject matter.",
    paragraph2: "Whether you're planning a journey, exploring new destinations, seeking authentic experiences, or looking for local activities, our guides help you discover the perfect activities with confidence and expert local insight.",
    buttonText: "Learn More About Us",
  },

  // Policy Pages Content (Privacy, Terms, Cookies)
  policies: {
    privacy: {
      dataCollected: [
  "Basic contact details you submit (for example, email).",
  "On-site behavior signals (pages viewed, navigation flow).",
  "Device and browser information used for performance and security.",
  "Content preferences inferred from interactions.",
  "Messages or feedback you send through forms.",
],
      dataUsage: [
  "Operate and improve site functionality and content quality.",
  "Respond to inquiries and support requests.",
  "Analyze usage trends to improve clarity and usefulness.",
  "Maintain site security and abuse prevention measures.",
  "Send optional updates when you explicitly opt in.",
],
    },
    terms: {
      serviceDescription: "Adventure Backpack provides informational travel content to support planning decisions. The service includes:",
      services: [
  "Editorial adventure backpacking guides and destination explainers.",
  "Planning-oriented recommendations and comparison content.",
  "Informational resources intended to support travel decisions.",
  "General updates and educational travel content.",
],
      adviceDisclaimer: "Please read this before relying on our content:",
      disclaimerItems: [
  "Information may change after publication and should be re-verified before travel.",
  "Availability, pricing, schedules, and access rules can vary by provider and season.",
  "Local regulations, safety conditions, and entry requirements can change without notice.",
  "Final travel decisions remain your responsibility.",
],
      userResponsibilities: [
  "Verify critical details with official or primary sources before travel.",
  "Follow local laws, customs, and safety guidance.",
  "Review cancellation and booking policies before purchasing services.",
  "Use personal judgment for health, safety, and suitability.",
],
      liabilityExclusions: [
  "Provider-side changes, cancellations, delays, or restrictions.",
  "Third-party content accuracy outside our direct control.",
  "Losses related to decisions made using informational content.",
  "Service interruptions caused by external systems or force majeure events.",
],
    },
    cookies: {
      intro: "Adventure Backpack uses cookies to",
      usage: [
  "Keep sessions functional and improve navigation reliability.",
  "Remember preferences where applicable.",
  "Measure site usage to improve content quality.",
  "Support security, diagnostics, and abuse prevention.",
],
      functionalCookies: [
  "Session continuity",
  "Preference retention",
  "Basic UI state",
],
      analyticsCookies: [
  "Traffic and engagement measurement",
  "Page performance analysis",
  "Content quality diagnostics",
],
      limitationNote: "Adventure Backpack's core site functionality and analytics.",
    },
  },
} as const

// Helper functions for common use cases
export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || siteConfig.domain.baseUrl
  return baseUrl.replace(/\/+$/, "")
}

export function getFullUrl(path: string = ""): string {
  const baseUrl = getBaseUrl()
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${baseUrl}${cleanPath}`
}

export function getSocialUrl(platform: keyof typeof siteConfig.social): string | null {
  const handle = siteConfig.social[platform]
  if (!handle) return null

  const urls: Record<string, string | null> = {
    twitter: `https://twitter.com/${handle.replace("@", "")}`,
    facebook: `https://facebook.com/${handle}`,
    instagram: `https://instagram.com/${handle}`,
    tiktok: `https://tiktok.com/${handle}`,
    youtube: handle ? `https://youtube.com/${handle}` : null,
    linkedin: handle ? `https://linkedin.com/company/${handle}` : null,
  }

  return urls[platform] || null
}

export function getSocialLinks() {
  return {
    twitter: getSocialUrl("twitter"),
    facebook: getSocialUrl("facebook"),
    instagram: getSocialUrl("instagram"),
    tiktok: getSocialUrl("tiktok"),
    youtube: getSocialUrl("youtube"),
    linkedin: getSocialUrl("linkedin"),
  }
}

/**
 * Returns only verified social profile URLs for use in structured-data `sameAs`.
 * A platform must be listed in NEXT_PUBLIC_VERIFIED_SOCIALS (comma-separated, e.g.
 * "twitter,instagram") AND have a non-null handle in siteConfig.social for its URL
 * to be emitted. Default: empty array → no `sameAs` claims → safer than broken claims
 * on a new domain with no real social presence.
 */
export function getVerifiedSameAs(): string[] {
  const raw = process.env.NEXT_PUBLIC_VERIFIED_SOCIALS || ""
  const verified = new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  )
  if (verified.size === 0) return []

  const all = getSocialLinks()
  return (Object.entries(all) as [keyof typeof all, string | null][])
    .filter(([platform, url]) => url && verified.has(platform))
    .map(([, url]) => url as string)
}
