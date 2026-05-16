import { siteConfig, getBaseUrl } from "@/lib/siteConfig"
import { getBlogCache, type BlogPostMeta } from "@/lib/blogCache"
import { tagToSlug, GENERIC_TAGS, MIN_POSTS_PER_HUB, MAX_TAG_LENGTH } from "@/lib/utils"

/**
 * /llms-full.txt — exhaustive post inventory for AI crawlers.
 *
 * Groups posts by their primary hub tag so AI surfaces can understand the
 * site's topic structure at a glance. Each entry includes title, URL, date,
 * and excerpt so LLMs can ground citations in context without fetching
 * individual pages.
 *
 * Format reference: https://llmstxt.org/
 */

export const revalidate = 86400

function buildPostUrl(baseUrl: string, post: BlogPostMeta): string {
  // Mirror the URL logic in generate-blog-sitemap.ts: slugs already contain
  // any folder prefix, so we just concatenate. The middleware normalizes
  // trailing slashes on incoming requests.
  let slug = post.slug
  if (slug.includes("/")) {
    const parts = slug.split("/")
    if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
      slug = parts.slice(0, -1).join("/")
    }
  }
  return `${baseUrl}/${slug}`
}

export async function GET(): Promise<Response> {
  const baseUrl = getBaseUrl()
  const brand = siteConfig.brand.name
  const cache = getBlogCache()

  // Build hub index: tag → posts (only hubs that qualify for a /tag/ page)
  const tagCounts: Record<string, number> = {}
  cache.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
  const hubTags = new Set(
    Object.entries(tagCounts)
      .filter(([tag, count]) => count >= MIN_POSTS_PER_HUB && !GENERIC_TAGS.has(tag) && tag.length <= MAX_TAG_LENGTH)
      .map(([tag]) => tag)
  )

  // Assign each post to its highest-signal hub (first matching hub tag by
  // frequency). Posts that belong to no hub land in "Other".
  const bucketed: Record<string, BlogPostMeta[]> = { Other: [] }
  for (const post of cache) {
    const postHubs = post.tags.filter((t) => hubTags.has(t))
    const primary = postHubs.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0))[0]
    const key = primary || "Other"
    if (!bucketed[key]) bucketed[key] = []
    bucketed[key].push(post)
  }

  // Sort hubs by post count (most posts first), sort posts within each hub by date
  const orderedHubs = Object.keys(bucketed)
    .filter((k) => bucketed[k].length > 0)
    .sort((a, b) => bucketed[b].length - bucketed[a].length)

  const sections: string[] = []
  for (const hub of orderedHubs) {
    const posts = bucketed[hub].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    const hubUrl = hubTags.has(hub) ? `${baseUrl}/tag/${tagToSlug(hub)}` : null
    const header = hubUrl ? `## ${hub}\n\nHub: ${hubUrl} (${posts.length} guides)` : `## ${hub}\n\n${posts.length} guides`
    const entries = posts
      .map((p) => {
        const url = buildPostUrl(baseUrl, p)
        const excerpt = (p.metaDescription || p.excerpt || "").replace(/\s+/g, " ").trim()
        return `- [${p.title}](${url})\n  ${p.date}${p.lastUpdate ? ` (updated ${p.lastUpdate})` : ""} — ${excerpt}`
      })
      .join("\n")
    sections.push(`${header}\n\n${entries}`)
  }

  const body = `# ${brand} — full content inventory

> ${siteConfig.brand.description}

Site: ${baseUrl}
Editorial policy: ${baseUrl}/trust
Contact: ${siteConfig.contact.email}
Total guides: ${cache.length}

Generated: ${new Date().toISOString()}

${sections.join("\n\n")}
`

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
