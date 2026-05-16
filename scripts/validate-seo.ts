import fs from "fs"
import path from "path"
import { siteConfig } from "../lib/siteConfig"

type CachedPost = {
  slug: string
  url?: string
}

const CACHE_PATH = path.join(process.cwd(), "public", "blog-cache.json")
const SITEMAP_PATH = path.join(process.cwd(), "public", "sitemap.xml")         // index
const SITEMAP_POSTS_PATH = path.join(process.cwd(), "public", "sitemap-posts.xml") // post URLs
const ROBOTS_ROUTE_PATH = path.join(process.cwd(), "app", "robots.ts")
const CONTENT_DIR = path.join(process.cwd(), "content")
const BLOG_DIR = path.join(CONTENT_DIR, "blog")

function existsAny(filePaths: string[]): boolean {
  return filePaths.some((p) => fs.existsSync(p))
}

function fileExistsForSlug(slug: string): boolean {
  const clean = slug.replace(/^\/+/, "")
  const last = clean.split("/").filter(Boolean).pop() || clean

  const candidates = [
    path.join(BLOG_DIR, `${clean}.html`),
    path.join(BLOG_DIR, `${clean}.md`),
    path.join(CONTENT_DIR, `${clean}.html`),
    path.join(CONTENT_DIR, `${clean}.md`),
    path.join(CONTENT_DIR, clean, `${last}.html`),
    path.join(CONTENT_DIR, clean, `${last}.md`),
  ]

  return existsAny(candidates)
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
}

function parseSitemapPaths(xml: string): string[] {
  const locRegex = /<loc>(.*?)<\/loc>/g
  const paths: string[] = []
  let match: RegExpExecArray | null

  while ((match = locRegex.exec(xml)) !== null) {
    const loc = match[1]?.trim()
    if (!loc) continue

    try {
      const url = new URL(loc)
      paths.push(url.pathname.replace(/\/+$/, "") || "/")
    } catch {
      // Ignore malformed URLs and let checks fail below.
      paths.push(loc)
    }
  }

  return paths
}

function main() {
  const errors: string[] = []

  if (!fs.existsSync(CACHE_PATH)) {
    errors.push(`Missing cache file: ${CACHE_PATH}`)
  }
  if (!fs.existsSync(SITEMAP_PATH)) {
    errors.push(`Missing sitemap file: ${SITEMAP_PATH}`)
  }
  if (!fs.existsSync(ROBOTS_ROUTE_PATH)) {
    errors.push(`Missing dynamic robots route: ${ROBOTS_ROUTE_PATH}`)
  }
  if (errors.length > 0) {
    throw new Error(errors.join("\n"))
  }

  const posts = readJson<CachedPost[]>(CACHE_PATH)
  const sitemapXml = fs.readFileSync(SITEMAP_PATH, "utf8")       // index
  // Parse post URLs from sitemap-posts.xml (not the index)
  const postsXml = fs.existsSync(SITEMAP_POSTS_PATH) ? fs.readFileSync(SITEMAP_POSTS_PATH, "utf8") : ""
  const sitemapPaths = parseSitemapPaths(postsXml)

  const staticPaths = new Set([
    "/", "/blog", "/about", "/trust", "/editorial-policy", "/methodology",
    "/contact", "/privacy", "/terms", "/cookies",
  ])
  const cachePaths = new Set(posts.map((post) => `/${post.slug.replace(/^\/+/, "")}`))

  for (const post of posts) {
    if (!post.slug || !fileExistsForSlug(post.slug)) {
      errors.push(`Cache entry has no source file: ${post.slug}`)
    }
  }

  for (const sitemapPath of sitemapPaths) {
    if (!staticPaths.has(sitemapPath) && !cachePaths.has(sitemapPath) && !sitemapPath.startsWith("/tag/")) {
      errors.push(`Sitemap URL not found in cache/static allowlist: ${sitemapPath}`)
    }
  }

  // robots.txt is now served dynamically from app/robots.ts (reads siteConfig.baseUrl at request time)
  // so we only validate the route file exists (checked above). No static content validation.

  // sitemap.xml is always the index — validate its structure
  if (!sitemapXml.includes("sitemapindex")) {
    errors.push("sitemap.xml should be a sitemapindex, not a urlset")
  }
  if (!sitemapXml.includes("sitemap-posts.xml") && !sitemapXml.includes("sitemap-posts-0.xml")) {
    errors.push("sitemap.xml index missing reference to sitemap-posts.xml")
  }
  if (!sitemapXml.includes("sitemap-tags.xml")) {
    errors.push("sitemap.xml index missing reference to sitemap-tags.xml")
  }

  if (errors.length > 0) {
    throw new Error(`SEO validation failed:\n${errors.join("\n")}`)
  }

  console.log("SEO validation passed")
}

main()
