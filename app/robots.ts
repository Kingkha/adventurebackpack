import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/siteConfig"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "CCBot",
    "Applebot-Extended",
    "Bytespider",
    "Amazonbot",
    "cohere-ai",
    "Diffbot",
    "FacebookBot",
    "Meta-ExternalAgent",
  ]

  const disallowedPaths = [
    "/api/",
    "/auth/",
    "/admin/",
    "/private/",
    "/settings/",
    "/_next/data/",
    "/*?_rsc=",
    "/*?*preview=",
  ]

  return {
    rules: [
      {
        userAgent: aiCrawlers,
        allow: "/",
      },
      {
        userAgent: "*",
        allow: ["/", "/_next/static/"],
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
