import { getBlogPostBySlug, fileExistsInNestedPath, getBlogPostFromPath } from "@/lib/getBlogPosts"
import { redirect, notFound } from "next/navigation"
import type { Metadata } from "next"
import path from "path"
import fs from "fs"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { encodePathSegments, toAbsoluteUrl } from "@/lib/seoUtils"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "../components/BlogJsonLd"
import Image from "next/image"
import Link from "next/link"
import { processAffiliateLinks } from "@/lib/affiliateLinks"
import BlogPostPage from "../components/BlogPostPage"

// Set this page to be dynamic to ensure it always checks for the existence of the slug
export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const contentRoot = path.join(process.cwd(), "content")
  const params: { slug: string }[] = []

  if (fs.existsSync(contentRoot)) {
    const entries = fs.readdirSync(contentRoot, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Skip the blog folder here to avoid generating /blog as a slug
        if (entry.name === "blog") continue
        params.push({ slug: entry.name })
      }
    }

    // Also expose blog posts at root ("/post-slug")
    const blogDir = path.join(contentRoot, "blog")
    if (fs.existsSync(blogDir)) {
      const blogFiles = fs.readdirSync(blogDir, { withFileTypes: true })
      for (const file of blogFiles) {
        if (file.isFile() && file.name.endsWith(".html")) {
          const slug = file.name.replace(/\.html$/, "")
          params.push({ slug })
        }
      }
    }
  }

  // De-duplicate slugs
  const seen = new Set<string>()
  const unique = params.filter(({ slug }) => {
    if (seen.has(slug)) return false
    seen.add(slug)
    return true
  })

  return unique
}

// Function to check if a folder exists in the content directory
function folderExists(folder: string): boolean {
  const folderPath = path.join(process.cwd(), "content", folder)
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()
}

// Function to check if index file exists (named same as folder)
function indexFileExists(folder: string): boolean {
  const filePath = path.join(process.cwd(), "content", folder, `${folder}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a nested index file exists (for multi-level nesting)
function nestedIndexFileExists(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) return false

  const lastSegment = pathSegments[pathSegments.length - 1]
  const filePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a folder is a subfolder of another folder
function isSubfolderContent(folder: string, subfolder: string): boolean {
  const folderPath = path.join(process.cwd(), "content", folder, subfolder)
  return fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()
}

// Function to get a list of path segments for a nested folder
function getNestedPathSegments(baseFolder: string): string[][] {
  const results: string[][] = []

  // Start with the base folder
  const basePath = path.join(process.cwd(), "content", baseFolder)
  if (!fs.existsSync(basePath)) return results

  // Function to recursively check subfolders
  function checkSubfolders(currentPath: string, segments: string[]) {
    if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory()) {
      // Add current segments list if it contains more than just the base folder
      if (segments.length > 1) {
        results.push([...segments])
      }

      // Get subfolders
      const items = fs.readdirSync(currentPath, { withFileTypes: true })
      for (const item of items) {
        if (item.isDirectory()) {
          const newPath = path.join(currentPath, item.name)
          const newSegments = [...segments, item.name]
          checkSubfolders(newPath, newSegments)
        }
      }
    }
  }

  // Start the recursive search
  checkSubfolders(basePath, [baseFolder])

  return results
}

// Function to get post data from HTML file
function getPostFromHtml(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContents = fs.readFileSync(filePath, "utf8")

  // Extract frontmatter using simple regex (since we don't want to add gray-matter dependency here)
  const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/)
  if (!frontmatterMatch) {
    return null
  }

  const frontmatter = frontmatterMatch[1]

  // Extract title from frontmatter
  const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/)
  const title = titleMatch ? titleMatch[1] : null

  // Extract other metadata
  const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/)
  const date = dateMatch ? dateMatch[1] : null

  const lastUpdateMatch = frontmatter.match(/lastUpdate:\s*"([^"]+)"/)
  const lastUpdate = lastUpdateMatch ? lastUpdateMatch[1] : date

  const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/)
  const excerpt = excerptMatch ? excerptMatch[1] : null

  const featuredImageMatch = frontmatter.match(/featuredImage:\s*"([^"]+)"/)
  const featuredImage = featuredImageMatch ? featuredImageMatch[1] : null

  const authorMatch = frontmatter.match(/author:\s*"([^"]+)"/)
  const author = authorMatch ? authorMatch[1] : null

  const metaDescriptionMatch = frontmatter.match(/metaDescription:\s*"([^"]+)"/)
  const metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1] : null

  return {
    title,
    date,
    lastUpdate,
    excerpt,
    featuredImage,
    author,
    metaDescription
  }
}

type TocHeading = { id: string; text: string }

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
}

function slugifyHeading(text: string): string {
  return (
    "heading-" +
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
  )
}

function buildTocFromHtml(html: string): { headings: TocHeading[]; processedHtml: string } {
  const trimmed = html?.trimStart() ?? ""
  if (!trimmed.startsWith("<")) {
    return { headings: [], processedHtml: html }
  }

  const headings: TocHeading[] = []
  const usedIds = new Map<string, number>()
  const idAttrRegex = /\bid\s*=\s*["']([^"']+)["']/i

  const processedHtml = html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const rawText = String(inner).replace(/<[^>]*>/g, "")
    const text = decodeHtmlEntities(rawText).trim()
    if (!text) return match

    const existingIdMatch = String(attrs).match(idAttrRegex)
    const baseId = existingIdMatch?.[1] || slugifyHeading(text)
    if (!baseId) return match

    const seen = usedIds.get(baseId) ?? 0
    usedIds.set(baseId, seen + 1)
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`

    headings.push({ id, text })

    if (existingIdMatch) {
      if (existingIdMatch[1] === id) return match
      const updatedAttrs = String(attrs).replace(idAttrRegex, `id="${id}"`)
      return `<h2${updatedAttrs}>${inner}</h2>`
    }

    return `<h2${attrs} id="${id}">${inner}</h2>`
  })

  return { headings, processedHtml }
}

// Reuse the same metadata generation logic from the blog post page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Decode URL parameters to handle special characters like á, ñ, etc.
  const slug = decodeURIComponent(params.slug)
  const encodedSlug = encodePathSegments(slug)
  const post = getBlogPostBySlug(slug)
  if (post) {
    const canonical = `${getBaseUrl()}/${encodedSlug}`
    return {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      keywords: post.tags?.join(', ') || '',
      alternates: {
        canonical,
      },
      openGraph: {
        title: post.title,
        description: post.metaDescription || post.excerpt,
        url: canonical,
        siteName: siteConfig.brand.name,
        locale: 'en_US',
        type: 'article',
        modifiedTime: post.lastUpdate || post.date,
        images: [
          {
            url: toAbsoluteUrl(getBaseUrl(), post.featuredImage),
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.metaDescription || post.excerpt,
        images: [toAbsoluteUrl(getBaseUrl(), post.featuredImage)],
      },
    }
  }

  // If not a blog post, check if it's a content folder with an index file
  if (folderExists(params.slug) && indexFileExists(params.slug)) {
    // Read the HTML file and extract frontmatter
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'content', params.slug, `${params.slug}.html`)
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const frontmatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/)
      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1]
        const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/)
        const title = titleMatch ? titleMatch[1] : params.slug
        const metaDescriptionMatch = frontmatter.match(/metaDescription:\s*\|?\s*([\s\S]*)/)
        let metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1].trim() : ''
        // If metaDescription is multiline, only take until next --- or end
        if (metaDescription.includes('---')) {
          metaDescription = metaDescription.split('---')[0].trim()
        }
        const excerptMatch = frontmatter.match(/excerpt:\s*"([^"]+)"/)
        const excerpt = excerptMatch ? excerptMatch[1] : ''
        const dateMatch = frontmatter.match(/date:\s*"([^"]+)"/)
        const date = dateMatch ? dateMatch[1] : ''
        const lastUpdateMatch = frontmatter.match(/lastUpdate:\s*"([^"]+)"/)
        const lastUpdate = lastUpdateMatch ? lastUpdateMatch[1] : date
        const featuredImageMatch = frontmatter.match(/featuredImage:\s*"([^"]+)"/)
        const featuredImage = featuredImageMatch ? featuredImageMatch[1] : ''
        return {
          title: title,
          description: metaDescription || excerpt,
          alternates: {
            canonical: `${getBaseUrl()}/${encodedSlug}`,
          },
          openGraph: {
            title: title,
            description: metaDescription || excerpt,
            url: `${getBaseUrl()}/${encodedSlug}`,
            siteName: siteConfig.brand.name,
            locale: 'en_US',
            type: 'article',
            modifiedTime: lastUpdate || date,
            images: featuredImage ? [
              {
                url: toAbsoluteUrl(getBaseUrl(), featuredImage),
                width: 1200,
                height: 630,
                alt: title,
              }
            ] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: title,
            description: metaDescription || excerpt,
            images: featuredImage ? [toAbsoluteUrl(getBaseUrl(), featuredImage)] : [],
          },
        }
      }
    }
  }

  // If neither, return not found metadata
  return {
    title: `Page Not Found | ${siteConfig.brand.name}`,
    description: 'The page you are looking for could not be found.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function SlugPage({ params }: { params: { slug: string } }) {
  // Decode URL parameters to handle special characters like á, ñ, etc.
  const slug = decodeURIComponent(params.slug);

  // Check if this slug exists in the blog folder
  const blogPost = getBlogPostBySlug(slug)
  if (blogPost) {
    return <BlogPostPage slug={slug} />
  }

  // Check if this is a content subfolder 
  if (folderExists(slug)) {
    // See if there's an index file for this folder
    if (indexFileExists(slug)) {
      // Import the catch-all route handler for the index file
      const ContentPage = (await import("./[...rest]/page")).default;
      return <ContentPage params={{ slug, rest: [] }} />;
    }

    // Check for any nested index files (e.g., section/subsection/subsection.html)
    const nestedPaths = getNestedPathSegments(slug)

    // Check each nested path for an index file
    for (const pathSegments of nestedPaths) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      const indexFilePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)

      if (fs.existsSync(indexFilePath)) {
        // We found a nested index file, so build the path to render via catch-all route
        const restSegments = pathSegments.slice(1) // Skip the first segment which is the base folder

        const ContentPage = (await import("./[...rest]/page")).default;
        return <ContentPage params={{
          slug,
          rest: [...restSegments]  // We don't need to add the last segment again
        }} />;
      }
    }

    // If no index file, we'll render a directory listing or some other appropriate page
    // This will be handled by the [...rest] catch-all route
    const ContentPage = (await import("./[...rest]/page")).default;
    return <ContentPage params={{ slug, rest: [] }} />;
  }

  // If it's not a blog post or a content folder, return a 404 page
  notFound();
} 
