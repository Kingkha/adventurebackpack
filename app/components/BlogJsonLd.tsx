import { siteConfig, getBaseUrl } from "@/lib/siteConfig"

interface BlogPostJsonLdProps {
  title: string
  description: string
  images: string[]
  datePublished: string
  dateModified?: string
  authorName: string
  authorUrl: string
  url: string
  wordCount?: number
  articleSection?: string
  /** Tag list — used to surface topic entities in the `about` array. */
  tags?: string[]
  /** When true, emits TravelArticle type instead of BlogPosting (destination guides). */
  isTravelArticle?: boolean
}

export function BlogPostJsonLd({
  title,
  description,
  images,
  datePublished,
  dateModified,
  authorName,
  authorUrl,
  url,
  wordCount,
  articleSection,
  tags,
  isTravelArticle,
}: BlogPostJsonLdProps) {
  // Build `about` entity list: site-wide topics + any tags that match canonical
  // topic vocabulary. Tags become Thing entities so crawlers can link the
  // article to the knowledge graph.
  const aboutEntities: Array<Record<string, unknown>> = [
    ...siteConfig.schemaTopics.map((topic) => ({
      "@type": "Thing",
      name: topic,
    })),
  ]
  if (tags && tags.length > 0) {
    for (const tag of tags.slice(0, 5)) {
      aboutEntities.push({ "@type": "Thing", name: tag })
    }
  }

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    // TravelArticle is a more specific subtype that AI surfaces and rich
    // results prefer for destination guides. BlogPosting remains the fallback.
    "@type": isTravelArticle ? "TravelArticle" : "BlogPosting",
    headline: title,
    description: description,
    image: images,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "en-US",
    ...(wordCount ? { wordCount } : {}),
    ...(articleSection ? { articleSection } : {}),
    // Speakable specification — tells voice assistants and AI surfaces which
    // parts of the page are suitable to read aloud. Targets H1 + intro paragraph.
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "[data-speakable-intro]"],
    },
    author: [
      {
        "@type": "Person",
        name: authorName,
        url: authorUrl,
        jobTitle: siteConfig.author.jobTitle,
        worksFor: {
          "@type": "Organization",
          name: siteConfig.brand.name,
        },
        description: siteConfig.author.description,
        knowsAbout: siteConfig.content.themes.slice(0, 5),
        hasCredential: siteConfig.author.credentials,
        alumniOf: {
          "@type": "Organization",
          name: siteConfig.author.alumniOf,
        },
      },
    ],
    // reviewedBy — asserts that this article passed our editorial review.
    // The reviewer is the same Person as the editor when there's only one team
    // member; clones with multiple editors should override per-post.
    reviewedBy: {
      "@type": "Person",
      name: siteConfig.author.defaultName,
      jobTitle: siteConfig.author.jobTitle,
      worksFor: {
        "@type": "Organization",
        name: siteConfig.brand.name,
      },
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.name,
      logo: {
        "@type": "ImageObject",
        url: `${getBaseUrl()}${siteConfig.seo.appleIcon}`,
        width: 180,
        height: 180,
      },
      foundingDate: siteConfig.organization.foundingDate,
      numberOfEmployees: siteConfig.organization.numberOfEmployees,
      industry: siteConfig.organization.industry,
      knowsAbout: siteConfig.organization.knowsAbout,
      award: siteConfig.organization.awards,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    isPartOf: {
      "@type": "Blog",
      name: `${siteConfig.brand.name} ${siteConfig.blog.name}`,
      description: siteConfig.brand.description,
    },
    about: aboutEntities,
    audience: {
      "@type": "Audience",
      audienceType: siteConfig.content.audience,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

interface BlogListingJsonLdProps {
  posts: Array<{
    title: string
    excerpt: string
    slug: string
    date: string
    lastUpdate?: string
    author: string
    featuredImage: string
    isFromBlogFolder?: boolean
    folder?: string
    subfolders?: string[]
  }>
  baseUrl: string
}

export function BlogListingJsonLd({ posts, baseUrl }: BlogListingJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        url: getPostUrl(post, baseUrl),
        datePublished: post.date,
        dateModified: post.lastUpdate || post.date,
        author: [
          {
            "@type": "Person",
            name: post.author,
          },
        ],
        image: [post.featuredImage],
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

// Helper function to determine the correct URL
function getPostUrl(post: { slug: string; isFromBlogFolder?: boolean; folder?: string; subfolders?: string[] }, baseUrl: string): string {
  // New cache format: slug already contains the full path (e.g. "portugal/braga/...")
  if (post.slug.includes('/')) {
    const parts = post.slug.split('/')
    // Check if last two segments are the same (duplicate city case)
    // e.g., "finland/rovaniemi/rovaniemi" -> "finland/rovaniemi"
    if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
      return `${baseUrl}/${parts.slice(0, -1).join('/')}`
    }
    return `${baseUrl}/${post.slug}`
  }

  // If we have a nested structure with subfolders, build the path from all segments
  // This handles any depth of nesting (1, 2, 3+ levels)
  if (post.subfolders && post.subfolders.length > 0) {
    // Index files: avoid duplicate last segment
    if (post.slug === post.subfolders[post.subfolders.length - 1]) {
      return `${baseUrl}/${post.subfolders.join('/')}`
    }
    return `${baseUrl}/${[...post.subfolders, post.slug].join('/')}`
  }
  
  // If from blog folder, don't include the /blog prefix
  if (post.isFromBlogFolder) {
    return `${baseUrl}/${post.slug}`
  }
  
  // Check if slug already contains folder prefix (new cache format)
  if (post.folder && post.slug.startsWith(`${post.folder}/`)) {
    return `${baseUrl}/${post.slug}`
  }
  
  // If in a subfolder and has the same name as the folder
  if (post.folder && post.slug === post.folder) {
    return `${baseUrl}/${post.folder}`
  }
  
  // If in a subfolder but has a different name (legacy format)
  if (post.folder) {
    return `${baseUrl}/${post.folder}/${post.slug}`
  }
  
  // Default: expose posts at root
  return `${baseUrl}/${post.slug}`
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    item: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
