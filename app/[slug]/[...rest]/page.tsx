import { notFound, redirect } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Metadata } from "next"
import Footer from "../../components/Footer"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "../../components/BlogJsonLd"
import ReadingProgressBar from "../../components/ReadingProgressBar"
import ShareButtons from "../../components/ShareButtons"
import Image from "next/image"
import Link from "next/link"
import Script from "next/script"
import AffiliateScripts from "../../components/AffiliateScripts"
import { processAffiliateLinks } from "@/lib/affiliateLinks"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { toAbsoluteUrl, toISODate, buildCanonicalUrl } from "@/lib/seoUtils"
import { tagToSlug, GENERIC_TAGS } from "@/lib/utils"
import { getBlogPostsMeta, getPostUrl, type BlogPostMeta } from "@/lib/getBlogPosts"

export const dynamicParams = true
export const revalidate = 86400 // 1 day

export async function generateStaticParams(): Promise<{ slug: string; rest: string[] }[]> {
  const contentDir = path.join(process.cwd(), "content")
  const params: { slug: string; rest: string[] }[] = []

  function walk(dir: string, segments: string[]) {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // Skip the blog folder — blog posts are served at root by app/[slug]/page.tsx
        if (segments.length === 0 && entry.name === "blog") continue
        walk(path.join(dir, entry.name), [...segments, entry.name])
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        const slug = entry.name.replace(/\.html$/, "")
        if (segments.length === 0) return // handled by [slug]/page.tsx
        params.push({ slug: segments[0], rest: [...segments.slice(1), slug] })
      }
    }
  }

  walk(contentDir, [])
  return params
}

// Helper function to build the path for nested content
function buildContentPath(pathSegments: string[]): string {
  return path.join(process.cwd(), "content", ...pathSegments)
}

// Function to check if a file exists in the specified nested path
// Works for any depth of nesting (e.g., hidden-gem-towns/italy/rome/colosseum.html)
function fileExists(pathSegments: string[]): boolean {
  const fileName = pathSegments[pathSegments.length - 1]
  const filePath = path.join(buildContentPath(pathSegments.slice(0, -1)), `${fileName}.html`)
  return fs.existsSync(filePath)
}

// Function to check if a nested index file exists (for multi-level nesting)
// This supports any depth of nesting (e.g., hidden-gem-towns/italy/rome/rome.html)
function nestedIndexFileExists(pathSegments: string[]): boolean {
  if (!pathSegments || pathSegments.length === 0) return false
  
  const lastSegment = pathSegments[pathSegments.length - 1]
  const filePath = path.join(process.cwd(), "content", ...pathSegments, `${lastSegment}.html`)
  return fs.existsSync(filePath)
}

// Function to get the post content from a nested path
function getPost(pathSegments: string[], isNestedIndex = false) {
  let filePath;
  const fileName = pathSegments[pathSegments.length - 1]
  
  if (isNestedIndex) {
    // Handle a nested index file (e.g., section/subsection/subsection.html)
    filePath = path.join(process.cwd(), "content", ...pathSegments, `${fileName}.html`)
  } else {
    // Normal case for a post file
    filePath = path.join(buildContentPath(pathSegments.slice(0, -1)), `${fileName}.html`)
  }
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, "utf8")
  let data: any = {}
  let content = fileContents
  try {
    const parsed = matter(fileContents)
    data = parsed.data
    content = parsed.content
  } catch (_e) {
    // Fallback: strip frontmatter block if present
    const fm = fileContents.match(/^---\n([\s\S]*?)\n---\n?/)
    if (fm) {
      content = fileContents.slice(fm[0].length)
    }
  }
  
  return {
    slug: fileName,
    pathSegments: pathSegments,
    title: data.title,
    date: data.date,
    lastUpdate: data.lastUpdate || data.date,
    excerpt: data.excerpt,
    content,
    featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
    author: data.author || "Editor",
    tags: data.tags || [],
    metaDescription: data.metaDescription || data.excerpt,
  }
}
type TocHeading = { id: string; text: string }
type ContentPost = NonNullable<ReturnType<typeof getPost>>

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

function stripText(content: string): string {
  if (!content) return ""
  return content
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function estimateReadingMinutes(html: string): number {
  const words = stripText(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

function formatDate(dateValue: any): string {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return String(dateValue || "")
  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function toRelativeHref(absoluteOrRelative: string, baseUrl: string): string {
  if (!absoluteOrRelative) return "/"
  if (absoluteOrRelative.startsWith(baseUrl)) {
    const rel = absoluteOrRelative.slice(baseUrl.length)
    return rel.startsWith("/") ? rel : `/${rel}`
  }
  return absoluteOrRelative
}

function formatBreadcrumbLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/(^|\s)([a-z])/g, (_match, prefix, char) => `${prefix}${char.toUpperCase()}`)
}

function TableOfContents({ items }: { items: TocHeading[] }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Table of contents" className="mb-8 rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
      <div className="text-sm font-semibold tracking-wide text-gray-900 mb-2">On this page</div>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-green-700 hover:text-green-900 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function RelatedArticles({ currentSlug, tags }: { currentSlug: string; tags: string[] }) {
  if (!tags.length) return null
  const { posts: allPosts } = getBlogPostsMeta(null, 200)
  const skipTags = new Set(['Hub', 'Hub Page', 'Pillar', 'Pillar Page', 'Guide', 'Travel', 'Japan'])
  const queryTags = tags.filter(t => !skipTags.has(t))
  if (!queryTags.length) return null

  const related = allPosts
    .filter(p => p.slug !== currentSlug && !p.tags.includes('Hub') && !p.tags.includes('Hub Page'))
    .map(p => ({ post: p, score: p.tags.filter((t: string) => queryTags.includes(t)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .slice(0, 3)
    .map(({ post }) => post)

  if (!related.length) return null

  return (
    <div className="mt-12 rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Related Guides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {related.map((p: BlogPostMeta) => {
          const href = getPostUrl(p.slug, '', p.folder, p.subfolders)
          return (
            <Link key={p.slug} href={href} className="group block">
              <Image
                src={p.featuredImage || '/placeholder.svg'}
                alt={p.title}
                width={400}
                height={220}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 line-clamp-2 leading-snug">
                {p.title}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function BreadcrumbNav({ items, baseUrl }: { items: Array<{ name: string; item: string }>; baseUrl: string }) {
  if (!items || items.length === 0) return null
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((crumb, idx) => {
          const isLast = idx === items.length - 1
          const href = toRelativeHref(crumb.item, baseUrl)
          return (
            <li key={`${crumb.item}-${idx}`} className="flex items-center gap-x-2">
              {idx > 0 && <span className="text-gray-400">/</span>}
              {isLast ? (
                <span className="font-medium text-gray-800">{crumb.name}</span>
              ) : (
                <Link href={href} className="hover:text-green-800 hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function renderContentPostPage({
  post,
  baseUrl,
  url,
  breadcrumbItems,
  contentHtml,
  toc,
}: {
  post: ContentPost
  baseUrl: string
  url: string
  breadcrumbItems: Array<{ name: string; item: string }>
  contentHtml: string
  toc: TocHeading[]
}) {
  const authorName = post.author || "Editor"
  const imageUrl = post.featuredImage || "/placeholder.svg?height=400&width=800"
  const readingMinutes = estimateReadingMinutes(contentHtml)
  const effectiveLastUpdate = post.lastUpdate || post.date
  const wordCount = stripText(contentHtml).split(/\s+/).filter(Boolean).length
  const articleSection = post.tags.find((t: string) => !['Guide', 'Travel', 'Japan', 'Hub', 'Hub Page', 'Pillar'].includes(t))
  // Detect travel-article intent: any tag pointing at a geo entity is a strong
  // signal. This switches the schema @type to TravelArticle for richer AI surfaces.
  const TRAVEL_MARKER_TAGS = ['Hub Page', 'Country Hub', 'Pillar Page']
  const isTravelArticle = post.tags.some((t: string) => !TRAVEL_MARKER_TAGS.includes(t))

  return (
    <div className="min-h-screen flex flex-col">
      <ReadingProgressBar />
      <BlogPostJsonLd
        title={post.title}
        description={post.metaDescription}
        images={[toAbsoluteUrl(baseUrl, imageUrl)]}
        datePublished={post.date}
        dateModified={effectiveLastUpdate}
        authorName={authorName}
        authorUrl={`${baseUrl}/author/${encodeURIComponent(authorName)}`}
        url={url}
        wordCount={wordCount}
        articleSection={articleSection}
        tags={post.tags}
        isTravelArticle={isTravelArticle}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <Script
        src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
        data-gyg-partner-id={siteConfig.affiliate.getyourguidePartnerId}
        strategy="lazyOnload"
      />
      <AffiliateScripts />

      <main className="flex-grow">
        <div className="container mx-auto px-4 pt-24 pb-12 affiliate-safe-area">
          <BreadcrumbNav items={breadcrumbItems} baseUrl={baseUrl} />

          <header className="relative overflow-hidden rounded-3xl border bg-white/70 backdrop-blur p-6 shadow-sm md:p-10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50" />
            <div className="relative">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">{post.title}</h1>
              {post.metaDescription && (
                <p
                  data-speakable-intro
                  className="mt-4 text-lg text-gray-700 max-w-2xl"
                >
                  {post.metaDescription}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
                <time dateTime={toISODate(post.date)}>{formatDate(post.date)}</time>
                <span aria-hidden="true">•</span>
                <time dateTime={toISODate(effectiveLastUpdate)}>Updated {formatDate(effectiveLastUpdate)}</time>
                <span aria-hidden="true">•</span>
                <span>{readingMinutes} min read</span>
                <span aria-hidden="true">•</span>
                <Link href={`/author/${encodeURIComponent(authorName)}`} className="hover:text-green-800 hover:underline">
                  By {authorName}
                </Link>
              </div>
              <div className="mt-5">
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-6 items-start">
            <div>
              {post.featuredImage && (
                <div className="mb-8 max-w-5xl mx-auto lg:mx-0">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    width={1200}
                    height={628}
                    sizes="(min-width: 1024px) 896px, 100vw"
                    className="w-full aspect-[1200/628] object-cover rounded-2xl shadow-sm"
                    priority
                  />
                </div>
              )}

              {toc.length > 0 && (
                <details className="lg:hidden mb-8 rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm max-w-4xl mx-auto">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-900">On this page</summary>
                  <div className="mt-4">
                    <TableOfContents items={toc} />
                  </div>
                </details>
              )}

              <div className="max-w-5xl mx-auto lg:mx-0">
                <div
                  className="prose max-w-none prose-lg md:prose-xl prose-green"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />

                {post.tags.filter((t: string) => !GENERIC_TAGS.has(t)).length > 0 && (
                  <div className="mt-12 rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-sm">
                    <div className="text-sm font-semibold tracking-wide text-gray-900 mb-3">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.filter((t: string) => !GENERIC_TAGS.has(t)).map((tag: string) => (
                        <Link
                          key={tag}
                          href={`/tag/${tagToSlug(tag)}`}
                          className="rounded-full border bg-white/70 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <RelatedArticles currentSlug={post.slug} tags={post.tags} />

                <div className="mt-10">
                  <Link href="/blog" className="text-green-800 hover:underline">
                    Browse all articles →
                  </Link>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {toc.length > 0 && (
                  <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                    <div className="text-sm font-semibold mb-3 text-gray-900">On this page</div>
                    <nav aria-label="Table of contents">
                      <ul className="space-y-2 text-sm">
                        {toc.map((item) => (
                          <li key={item.id}>
                            <a href={`#${item.id}`} className="text-green-700 hover:text-green-900 hover:underline">
                              {item.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
                <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                  <div className="text-sm font-semibold mb-2 text-gray-900">Quick links</div>
                  <Link href="/blog" className="text-green-700 hover:underline">
                    All articles
                  </Link>
                </div>
                <div className="affiliate-sidebar-slot" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: { params: { slug: string, rest: string[] } }): Promise<Metadata> {
  // Decode URL parameters to handle special characters like á, ñ, etc.
  const slug = decodeURIComponent(params.slug)
  const rest = params.rest?.map(segment => decodeURIComponent(segment)) || []
  const baseUrl = getBaseUrl()

  // /blog/{slug} redirects to /{slug} — return noindex metadata
  if (slug === "blog" && rest.length > 0) {
    return { robots: { index: false, follow: false } }
  }

  const notFoundMetadata: Metadata = {
    title: `Page Not Found | ${siteConfig.brand.name}`,
    description: "The page you are looking for could not be found.",
    robots: {
      index: false,
      follow: false,
    },
  }
  
  // Build the complete path segments array
  const pathSegments = [slug, ...(rest || [])]
  
  // Handle the index case (file with same name as its directory)
  if (rest.length === 0) {
    // This is a "folder index" case - e.g., /hidden-gem-towns
    const post = getPost([slug, slug])
    
    if (!post) {
      // Try checking if this is a nested folder index
      // For example, section/subsection/subsection.html
      const nestedIndexPath = [slug, ...rest, slug]
      if (nestedIndexFileExists([slug, ...rest])) {
        const nestedPost = getPost([...nestedIndexPath], true)
        if (nestedPost) {
          const canonical = buildCanonicalUrl(baseUrl, [slug])
          const ogImage = toAbsoluteUrl(baseUrl, nestedPost.featuredImage)
          return {
            title: nestedPost.title,
            description: nestedPost.metaDescription,
            alternates: { canonical },
            keywords: nestedPost.tags?.length ? nestedPost.tags : undefined,
            openGraph: {
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              url: canonical,
              type: "article",
              publishedTime: toISODate(nestedPost.date),
              modifiedTime: toISODate(nestedPost.lastUpdate || nestedPost.date),
              authors: [nestedPost.author],
              images: [
                {
                  url: ogImage,
                  width: 1200,
                  height: 628,
                  alt: nestedPost.title,
                },
              ],
            },
            twitter: {
              card: "summary_large_image",
              title: nestedPost.title,
              description: nestedPost.metaDescription,
              images: [ogImage],
            },
          }
        }
      }
      return notFoundMetadata
    }
    
    const canonical = buildCanonicalUrl(baseUrl, [slug])
    const ogImage = toAbsoluteUrl(baseUrl, post.featuredImage)
    return {
      title: post.title,
      description: post.metaDescription,
      alternates: { canonical },
      keywords: post.tags?.length ? post.tags : undefined,
      openGraph: {
        title: post.title,
        description: post.metaDescription,
        url: canonical,
        type: "article",
        publishedTime: toISODate(post.date),
        modifiedTime: toISODate(post.lastUpdate || post.date),
        authors: [post.author],
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 628,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.metaDescription,
        images: [ogImage],
      },
    }
  }
  
  // Handle nested index files that live inside their own folder
  // For example: /section/subsection -> content/section/subsection/subsection.html
  if (rest.length > 0 && nestedIndexFileExists(pathSegments)) {
    const post = getPost(pathSegments, true)
    if (post) {
      const canonical = buildCanonicalUrl(baseUrl, pathSegments)
      const ogImage = toAbsoluteUrl(baseUrl, post.featuredImage)
      return {
        title: post.title,
        description: post.metaDescription,
        alternates: { canonical },
        keywords: post.tags?.length ? post.tags : undefined,
        openGraph: {
          title: post.title,
          description: post.metaDescription,
          url: canonical,
          type: "article",
          publishedTime: toISODate(post.date),
          modifiedTime: toISODate(post.lastUpdate || post.date),
            authors: [post.author],
          images: [
            {
              url: ogImage,
              width: 1200,
              height: 628,
              alt: post.title,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: post.title,
          description: post.metaDescription,
          images: [ogImage],
        },
      }
    }
  }

  // Check if the last segment is a duplicate folder name (nested index file)
  // For example: /section/subsection/subsection -> content/section/subsection/subsection.html
  if (rest.length > 0 && rest[rest.length - 1] === pathSegments[pathSegments.length - 2]) {
    const nestedPath = [...pathSegments.slice(0, -1)]
    if (nestedIndexFileExists(nestedPath)) {
      const post = getPost([...nestedPath, rest[rest.length - 1]], true)
      if (post) {
        const canonical = buildCanonicalUrl(baseUrl, nestedPath)
        const ogImage = toAbsoluteUrl(baseUrl, post.featuredImage)
        return {
          title: post.title,
          description: post.metaDescription,
          alternates: { canonical },
          keywords: post.tags?.length ? post.tags : undefined,
          openGraph: {
            title: post.title,
            description: post.metaDescription,
            url: canonical,
            type: "article",
              publishedTime: toISODate(post.date),
              modifiedTime: toISODate(post.lastUpdate || post.date),
            authors: [post.author],
            images: [
              {
                url: ogImage,
                width: 1200,
                height: 628,
                alt: post.title,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.metaDescription,
            images: [ogImage],
          },
        }
      }
    }
  }
  
  // This is a nested post case - e.g., /hidden-gem-towns/italy or /hidden-gem-towns/italy/rome
  if (!fileExists(pathSegments)) {
    return notFoundMetadata
  }
  
  const post = getPost(pathSegments)
  
  if (!post) {
    return notFoundMetadata
  }
  
  const canonical = buildCanonicalUrl(baseUrl, pathSegments)
  const ogImage = toAbsoluteUrl(baseUrl, post.featuredImage)
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical },
    keywords: post.tags?.length ? post.tags : undefined,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url: canonical,
      type: "article",
        publishedTime: toISODate(post.date),
        modifiedTime: toISODate(post.lastUpdate || post.date),
      authors: [post.author],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 628,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [ogImage],
    },
  }
}

export default async function Post({ params }: { params: { slug: string, rest: string[] } }) {
  // Decode URL parameters to handle special characters like á, ñ, etc.
  const slug = decodeURIComponent(params.slug)
  const rest = params.rest?.map(segment => decodeURIComponent(segment)) || []

  // Blog posts live at /{slug} — redirect /blog/{slug} to canonical URL
  if (slug === "blog" && rest.length > 0) {
    redirect(`/${rest.join("/")}`)
  }

  // Handle nested path index case
  // For URLs like /regions/north-america where we need to find north-america.html in the content/regions/north-america/ folder
  if (rest.length > 0) {
    const lastSegment = rest[rest.length - 1];
    const folderPath = [slug, ...rest];
    const indexFilePath = path.join(process.cwd(), "content", ...folderPath, `${lastSegment}.html`);
    
    if (fs.existsSync(indexFilePath)) {
      const fileContents = fs.readFileSync(indexFilePath, "utf8");
      const { data, content } = matter(fileContents);
      
      const post = {
        slug: lastSegment,
        pathSegments: folderPath,
        title: data.title,
        date: data.date,
        lastUpdate: data.lastUpdate || data.date,
        excerpt: data.excerpt,
        content,
        featuredImage: data.featuredImage || "/placeholder.svg?height=400&width=800",
        author: data.author || "Editor",
        tags: data.tags || [],
        metaDescription: data.metaDescription || data.excerpt,
      };
      
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/${folderPath.join('/')}`;
      
      // Replace relative image URLs with absolute URLs
      const contentWithAbsoluteUrls = post.content
        .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
        .replace(/src="images\//g, `src="${baseUrl}/images/`);
	      
	      // Process affiliate links
	      const contentWithAffiliateLinks = processAffiliateLinks(contentWithAbsoluteUrls, post.tags, folderPath.join('/'));
	      const toc = buildTocFromHtml(contentWithAffiliateLinks)

      // Generate breadcrumb items
      const breadcrumbItems = [
        { name: "Home", item: baseUrl },
      ];
      
      // Add each path segment to breadcrumbs
      let currentPath = "";
      for (let i = 0; i < folderPath.length; i++) {
        const segment = folderPath[i];
        currentPath = currentPath ? `${currentPath}/${segment}` : segment;
        breadcrumbItems.push({
          name: formatBreadcrumbLabel(segment),
          item: `${baseUrl}/${currentPath}`
        });
      }
      

      
      return renderContentPostPage({
        post,
        baseUrl,
        url,
        breadcrumbItems,
        contentHtml: toc.processedHtml,
        toc: toc.headings,
      });
    }
  }
  
  // Handle the "folder index" case - e.g., /hidden-gem-towns
  if (!rest || rest.length === 0) {
    let post = getPost([slug, slug])
    
    if (!post) {
      // Check if this is a deeply nested index file
      // Get all potential nested paths
      let found = false
      
      // Function to get a list of path segments for a nested folder
      // This function discovers all nested paths at any depth
      function getNestedPathSegments(baseFolder: string): string[][] {
        const results: string[][] = []
        
        // Start with the base folder
        const basePath = path.join(process.cwd(), "content", baseFolder)
        if (!fs.existsSync(basePath)) return results
        
        // Function to recursively check subfolders
        // This will find paths at any depth level (2nd, 3rd, 4th levels, etc)
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
      
      const nestedPaths = getNestedPathSegments(slug)
      for (const pathSegments of nestedPaths) {
        // Check if this path has an index file with the same name as the last folder segment
        const lastSegment = pathSegments[pathSegments.length - 1]
        if (nestedIndexFileExists(pathSegments)) {
          const nestedPost = getPost([...pathSegments, lastSegment], true)
          if (nestedPost) {
            post = nestedPost
            found = true
            break
          }
        }
      }
      
      if (!found || !post) {
        notFound()
      }
    }
    
    // At this point post is guaranteed to be non-null due to the notFound() call above
    const baseUrl = getBaseUrl()
    let url = `${baseUrl}/${slug}`
    
    // If this is a nested index file, build the correct URL
    if (post.pathSegments && post.pathSegments.length > 2) {
      // Remove the duplicate last segment
      const urlSegments = [...post.pathSegments]
      if (urlSegments[urlSegments.length - 1] === urlSegments[urlSegments.length - 2]) {
        urlSegments.pop() // Remove the last duplicate segment
      }
      url = `${baseUrl}/${urlSegments.join('/')}`
    }
    
    // Replace relative image URLs with absolute URLs
    const contentWithAbsoluteUrls = post.content
      .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
      .replace(/src="images\//g, `src="${baseUrl}/images/`)
    
	        // Process affiliate links
	        const contentWithAffiliateLinks = processAffiliateLinks(contentWithAbsoluteUrls, post.tags, post.pathSegments?.join('/') || slug);
	        const toc = buildTocFromHtml(contentWithAffiliateLinks)

    // Generate breadcrumb items
    const breadcrumbItems = [
      { name: "Home", item: baseUrl },
      { name: post.title || formatBreadcrumbLabel(slug), item: url }
    ]
    
    // If this is a nested index, add extra breadcrumb items
    if (post.pathSegments && post.pathSegments.length > 2) {
      // Reset breadcrumbs
      breadcrumbItems.length = 1; // Keep just Home
      
      // Build breadcrumbs for all segments
      let currentPath = ""
      for (let i = 0; i < post.pathSegments.length - 1; i++) {
        // Skip the duplicate last segment
        if (i === post.pathSegments.length - 2 && 
            post.pathSegments[i] === post.pathSegments[post.pathSegments.length - 1]) {
          continue;
        }
        
        const segment = post.pathSegments[i]
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        breadcrumbItems.push({
          name: formatBreadcrumbLabel(segment),
          item: `${baseUrl}/${currentPath}`
        })
      }
    }
    
    return renderContentPostPage({
      post,
      baseUrl,
      url,
      breadcrumbItems,
      contentHtml: toc.processedHtml,
      toc: toc.headings,
    })
  }
  
  // Check if this is a nested index file where last segment matches its parent folder
  if (rest.length > 0 && rest[rest.length - 1] === rest[rest.length - 2]) {
    const nestedPath = [slug, ...rest.slice(0, -1)]
    if (nestedIndexFileExists(nestedPath)) {
      const post = getPost([...nestedPath, rest[rest.length - 1]], true)
      if (post) {
        const baseUrl = getBaseUrl()
        const url = `${baseUrl}/${nestedPath.join('/')}`
        
        // Replace relative image URLs with absolute URLs
        const contentWithAbsoluteUrls = post.content
          .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
          .replace(/src="images\//g, `src="${baseUrl}/images/`)
        
	        // Process affiliate links
	        const contentWithAffiliateLinks = processAffiliateLinks(contentWithAbsoluteUrls, post.tags, nestedPath.join('/'));
	        const toc = buildTocFromHtml(contentWithAffiliateLinks)

	        // Generate breadcrumb items with all path segments
	        const breadcrumbItems = [
	          { name: "Home", item: baseUrl },
	        ]
        
        // Add each path segment to breadcrumbs
        let currentPath = ""
        for (let i = 0; i < nestedPath.length; i++) {
        const segment = nestedPath[i]
        currentPath = currentPath ? `${currentPath}/${segment}` : segment
        breadcrumbItems.push({
            name: formatBreadcrumbLabel(segment),
            item: `${baseUrl}/${currentPath}`
          })
        }
        
        return renderContentPostPage({
          post,
          baseUrl,
          url,
          breadcrumbItems,
          contentHtml: toc.processedHtml,
          toc: toc.headings,
        })
      }
    }
  }
  
  // Build the complete path segments array for the nested content
  const pathSegments = [slug, ...rest]
  
  // Check if the file exists in the nested structure
  if (!fileExists(pathSegments)) {
    notFound()
  }
  
  const post = getPost(pathSegments)
  
  if (!post) {
    notFound()
  }
  
  const baseUrl = getBaseUrl();
  
  // Construct the full URL path from all segments
  const url = `${baseUrl}/${pathSegments.join('/')}`
  
  // Replace relative image URLs with absolute URLs
  const contentWithAbsoluteUrls = post.content
    .replace(/src="\/images\//g, `src="${baseUrl}/images/`)
    .replace(/src="images\//g, `src="${baseUrl}/images/`)
  
  // Process affiliate links
  const contentWithAffiliateLinks = processAffiliateLinks(contentWithAbsoluteUrls, post.tags, pathSegments.join('/'));
  const toc = buildTocFromHtml(contentWithAffiliateLinks)

  // Generate breadcrumb items with all path segments
  // This supports any depth of nesting (1, 2, 3+ levels)
  const breadcrumbItems = [
    { name: "Home", item: baseUrl },
  ]
  
  // Add each path segment to breadcrumbs
  let currentPath = ""
  for (let i = 0; i < pathSegments.length - 1; i++) {
    const segment = pathSegments[i]
    currentPath = currentPath ? `${currentPath}/${segment}` : segment
    breadcrumbItems.push({
      name: formatBreadcrumbLabel(segment),
      item: `${baseUrl}/${currentPath}`
    })
  }
  
  // Add the current page as the final breadcrumb
  breadcrumbItems.push({
    name: post.title,
    item: url
  })


  
  return renderContentPostPage({
    post,
    baseUrl,
    url,
    breadcrumbItems,
    contentHtml: toc.processedHtml,
    toc: toc.headings,
  })
} 
