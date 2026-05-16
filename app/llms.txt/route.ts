import { siteConfig, getBaseUrl } from "@/lib/siteConfig"
import { getBlogCache } from "@/lib/blogCache"
import { tagToSlug, GENERIC_TAGS, MIN_POSTS_PER_HUB, MAX_TAG_LENGTH } from "@/lib/utils"

/**
 * /llms.txt — brief site identity summary for AI crawlers and LLM indexes.
 *
 * This is the Markdown-formatted short version read by ChatGPT, Claude,
 * Perplexity, and other AI search surfaces when deciding how to cite or
 * describe this site. Keep it under ~50 lines. See llms-full.txt for the
 * exhaustive post inventory.
 *
 * Format reference: https://llmstxt.org/
 */

export const revalidate = 86400 // Rebuild daily

export async function GET(): Promise<Response> {
  const baseUrl = getBaseUrl()
  const brand = siteConfig.brand.name
  const description = siteConfig.brand.description

  // Top tag hubs (by post count, excluding generic tags)
  const cache = getBlogCache()
  const tagCounts: Record<string, number> = {}
  cache.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))

  const topHubs = Object.entries(tagCounts)
    .filter(([tag, count]) => count >= MIN_POSTS_PER_HUB && !GENERIC_TAGS.has(tag) && tag.length <= MAX_TAG_LENGTH)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({
      name: tag,
      count,
      url: `${baseUrl}/tag/${tagToSlug(tag)}`,
    }))

  const body = `# ${brand}

> ${description}

${siteConfig.content.focus}. Edited by ${siteConfig.author.defaultName}, ${siteConfig.author.jobTitle}.

## About

- **Site:** ${baseUrl}
- **Focus:** ${siteConfig.content.focus}
- **Audience:** ${siteConfig.content.audience}
- **Editorial policy:** ${baseUrl}/trust
- **Contact:** ${siteConfig.contact.email}

## Key sections

- [Home](${baseUrl}/) — Featured guides, hub directory, editorial picks
- [Blog](${baseUrl}/blog) — Full post index with pagination
- [About](${baseUrl}/about) — Editorial team, research process, credentials
- [Trust](${baseUrl}/trust) — Fact-checking, verification, update cadence
- [Contact](${baseUrl}/contact) — Editorial inquiries, partnerships

## Content clusters (top hubs)

${topHubs.map((h) => `- [${h.name}](${h.url}) — ${h.count} guides`).join("\n")}

## Full inventory

See [llms-full.txt](${baseUrl}/llms-full.txt) for the complete post index.
`

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
