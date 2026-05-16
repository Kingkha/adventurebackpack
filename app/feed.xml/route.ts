import { getBlogCache, getPostUrl } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"

export const revalidate = 86400

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const baseUrl = getBaseUrl()
  const posts = getBlogCache().slice(0, 50)

  const items = posts
    .map((post) => {
      const url = `${baseUrl}${getPostUrl(post.slug, "", post.folder, post.subfolders)}`
      const pubDate = new Date(post.date).toUTCString()
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.metaDescription || post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(siteConfig.contact.email)} (${escapeXml(post.author)})</author>
    </item>`
    })
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.brand.name)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(siteConfig.brand.description)}</description>
    <language>en-us</language>
    <atom:link href="${escapeXml(baseUrl)}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
