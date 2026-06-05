import { getBlogCache, getBlogPostBySlug, getHubTagSlugs } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { processAffiliateLinks } from "@/lib/affiliateLinks"
import Breadcrumb from "./Breadcrumb"
import Footer from "./Footer"
import { BlogPostJsonLd, BreadcrumbJsonLd } from "./BlogJsonLd"
import { encodePathSegments, toAbsoluteUrl, toISODate } from "@/lib/seoUtils"
import { tagToSlug, GENERIC_TAGS } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import ReactMarkdown from "react-markdown"
import { notFound } from "next/navigation"

import ReadingProgressBar from "./ReadingProgressBar"
import ShareButtons from "./ShareButtons"
import AffiliateScripts from "./AffiliateScripts"
import AffiliateTracker from "./AffiliateTracker"

function formatDate(date: string): string {
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return date
    return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function stripText(content: string): string {
    if (!content) return ""
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\s*/m, "")
    const withoutHtml = withoutFrontmatter.replace(/<[^>]*>/g, " ")
    const withoutMarkdown = withoutHtml
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`[^`]*`/g, " ")
        .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/\[[^\]]*]\([^)]*\)/g, " ")
        .replace(/[#>*_-]+/g, " ")
    return withoutMarkdown.replace(/\s+/g, " ").trim()
}

function estimateReadingMinutes(content: string): number {
    const words = stripText(content).split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.round(words / 220))
}

function extractH2Headings(content: string): { id: string; text: string }[] {
    if (!content) return []

    if (/^\s*</.test(content)) {
        const regex = /<h2(?:\s[^>]*)?>(.*?)<\/h2>/g
        const headings: { id: string; text: string }[] = []
        let match

        while ((match = regex.exec(content)) !== null) {
            const text = match[1].replace(/<.*?>/g, "")
            const decodedText = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            const id =
                "heading-" +
                decodedText.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")

            headings.push({ id, text: decodedText })
        }

        return headings
    }

    const lines = content.split("\n")
    return lines
        .filter((line) => line.startsWith("## "))
        .map((line) => {
            const text = line.replace("## ", "")
            const decodedText = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            const id =
                "heading-" + decodedText.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
            return { id, text: decodedText }
        })
}

function stripLeadingMarkdownH1(content: string): string {
    const lines = content.split("\n")
    const firstNonEmpty = lines.findIndex((l) => l.trim().length > 0)
    if (firstNonEmpty === -1) return content
    if (!/^#\s+/.test(lines[firstNonEmpty])) return content

    const without = [...lines.slice(0, firstNonEmpty), ...lines.slice(firstNonEmpty + 1)]
    if (without[firstNonEmpty]?.trim() === "") without.splice(firstNonEmpty, 1)
    return without.join("\n")
}

function normalizeHtmlHeadings(content: string): string {
    let normalized = content
    normalized = normalized.replace(/^\s*<h1\b[^>]*>[\s\S]*?<\/h1>\s*/i, "")
    normalized = normalized.replace(/<h1\b/gi, "<h2").replace(/<\/h1>/gi, "</h2>")
    return normalized
}

function addIdsToH2Tags(content: string, headings: { id: string; text: string }[]): string {
    if (!content.startsWith("<") || headings.length === 0) return content

    const headingMap = new Map(headings.map((h) => [h.text, h.id]))
    return content.replace(/<h2(?:\s[^>]*)?>(.*?)<\/h2>/g, (match, captureGroup) => {
        const text = captureGroup.replace(/<.*?>/g, "")
        const decodedText = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        const id = headingMap.get(decodedText)
        if (id) return `<h2 id="${id}">${captureGroup}</h2>`
        return match
    })
}

function getRelatedSlugs(currentSlug: string, tags: string[]): string[] {
    try {
        const all = getBlogCache() as any[]
        const current = all.find((p) => p.slug === currentSlug)
        const currentTags = new Set(tags || current?.tags || [])

        const scored = all
            .filter((p) => p.slug !== currentSlug)
            .map((p) => {
                const score = (p.tags || []).reduce((acc: any, tag: any) => acc + (currentTags.has(tag) ? 1 : 0), 0)
                return { slug: p.slug, score, date: new Date(p.date).getTime() }
            })
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score || b.date - a.date)

        return scored.slice(0, 6).map((x) => x.slug)
    } catch (error) {
        // console.error("Error getting related slugs", error)
        return []
    }
}

function getPrevNext(currentSlug: string): { prev?: string; next?: string } {
    try {
        const all = [...getBlogCache()].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        const idx = all.findIndex((p: any) => p.slug === currentSlug)
        if (idx === -1) return {}
        return { next: all[idx - 1]?.slug, prev: all[idx + 1]?.slug }
    } catch (e) {
        return {}
    }
}

export default async function BlogPostPage({ slug }: { slug: string }) {
    const post = await getBlogPostBySlug(slug)
    if (!post || !post.content) notFound()

    const baseUrl = getBaseUrl()
    const encodedSlugPath = encodePathSegments(slug)
    const canonicalUrl = `${baseUrl}/${encodedSlugPath}`
    const authorUrl = `${baseUrl}/author/${encodeURIComponent(post.author || "Editor")}`
    const imageUrl = post.featuredImage || "/placeholder.svg?height=400&width=800"

    // Detect HTML-source articles by the first non-whitespace char — affiliate
    // processing can leave leading newlines after stripping prior widgets, and
    // a raw `.startsWith("<")` then misroutes HTML content into the
    // ReactMarkdown branch, which escapes it on render.
    const isHtmlSource = /^\s*</.test(post.content)
    const normalizedSourceContent = isHtmlSource
        ? normalizeHtmlHeadings(post.content)
        : stripLeadingMarkdownH1(post.content)

    const contentWithAffiliateLinks = processAffiliateLinks(normalizedSourceContent, post.tags, slug)
    const headings = extractH2Headings(contentWithAffiliateLinks)
    const processedContent = isHtmlSource
        ? addIdsToH2Tags(contentWithAffiliateLinks.replace(/^\s+/, ""), headings)
        : contentWithAffiliateLinks

    const readingMinutes = estimateReadingMinutes(processedContent)
    const effectiveLastUpdate = post.lastUpdate || post.date
    // Fix breadcrumb structure to match BreadcrumbJsonLd
    const breadcrumbItems = [
        { name: "Home", item: baseUrl },
        { name: "Blog", item: `${baseUrl}/blog` },
        { name: post.title, item: canonicalUrl },
    ]

    const hubTagSlugs = getHubTagSlugs()
    const relatedSlugs = getRelatedSlugs(slug, post.tags)
    // Ensure we handle casting if necessary since getBlogCache return type might need assertion
    const related = (getBlogCache() as any[]).filter((p) => relatedSlugs.includes(p.slug)).slice(0, 3)
    const { prev, next } = getPrevNext(slug)
    const prevPost = prev ? (getBlogCache() as any[]).find((p) => p.slug === prev) : undefined
    const nextPost = next ? (getBlogCache() as any[]).find((p) => p.slug === next) : undefined

    const breadcrumbUiItems = [
        { label: "Blog", href: "/blog" },
        { label: post.title, href: `/${encodedSlugPath}` },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <ReadingProgressBar />
            <BlogPostJsonLd
                title={post.title}
                description={post.metaDescription || post.excerpt}
                images={[toAbsoluteUrl(baseUrl, imageUrl)]}
                datePublished={toISODate(post.date)}
                dateModified={toISODate(effectiveLastUpdate)}
                authorName={post.author || "Editor"}
                authorUrl={authorUrl}
                url={canonicalUrl}
            />
            <BreadcrumbJsonLd items={breadcrumbItems} />
            <Script
                src="https://widget.getyourguide.com/dist/pa.umd.production.min.js"
                data-gyg-partner-id={siteConfig.affiliate.getyourguidePartnerId}
                strategy="lazyOnload"
            />
            <AffiliateScripts />
            <AffiliateTracker />

            <main className="flex-grow">
                <div className="container mx-auto px-4 pt-24 pb-12 affiliate-safe-area">
                    <article className="max-w-6xl mx-auto">
                        <Breadcrumb items={breadcrumbUiItems} />

                        <header className="relative overflow-hidden rounded-3xl border bg-white/70 backdrop-blur p-6 shadow-sm md:p-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-amber-50" />
                            <div className="relative">
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">{post.title}</h1>
                                {post.metaDescription && (
                                    <p className="mt-4 text-lg text-gray-700 max-w-2xl">{post.metaDescription}</p>
                                )}
                                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500">
                                    <time dateTime={toISODate(post.date)}>{formatDate(post.date)}</time>
                                    <span aria-hidden="true">•</span>
                                    <time dateTime={toISODate(effectiveLastUpdate)}>Updated {formatDate(effectiveLastUpdate)}</time>
                                    <span aria-hidden="true">•</span>
                                    <span>{readingMinutes} min read</span>
                                    <span aria-hidden="true">•</span>
                                    <Link
                                        href={`/author/${encodeURIComponent(post.author || "Editor")}`}
                                        className="hover:text-green-800 hover:underline"
                                    >
                                        By {post.author || "Editor"}
                                    </Link>
                                </div>
                                <div className="mt-5">
                                    <ShareButtons url={canonicalUrl} title={post.title} />
                                </div>
                            </div>
                        </header>

                        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-6 items-start">
                            <div>
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

                                {headings.length > 0 && (
                                    <details className="lg:hidden mb-8 rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm max-w-4xl mx-auto">
                                        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
                                            On this page
                                        </summary>
                                        <div className="mt-4">
                                            <nav aria-label="Table of contents">
                                                <ul className="space-y-2 text-sm">
                                                    {headings.map((heading) => (
                                                        <li key={heading.id}>
                                                            <a
                                                                href={`#${heading.id}`}
                                                                className="text-green-700 hover:text-green-900 hover:underline"
                                                            >
                                                                {heading.text}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    </details>
                                )}

                                <div className="max-w-5xl mx-auto lg:mx-0">
                                    <div className="prose max-w-none prose-lg md:prose-xl prose-green">
                                        {processedContent.startsWith("<") ? (
                                            <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                                        ) : (
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({ children, ...props }) => (
                                                        <h2 className="scroll-mt-24" {...props}>
                                                            {children}
                                                        </h2>
                                                    ),
                                                    h2: ({ children, ...props }) => {
                                                        const text = String(children)
                                                            .replace(/&amp;/g, "&")
                                                            .replace(/&lt;/g, "<")
                                                            .replace(/&gt;/g, ">")
                                                        const id =
                                                            "heading-" +
                                                            text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
                                                        return (
                                                            <h2 id={id} className="scroll-mt-24" {...props}>
                                                                {children}
                                                            </h2>
                                                        )
                                                    },
                                                    img: ({ src, alt }) => (
                                                        <span className="block my-8">
                                                            <Image
                                                                src={toAbsoluteUrl(baseUrl, src || "")}
                                                                alt={alt || ""}
                                                                width={800}
                                                                height={500}
                                                                className="rounded-lg shadow-md w-full"
                                                            />
                                                        </span>
                                                    ),
                                                }}
                                            >
                                                {processedContent}
                                            </ReactMarkdown>
                                        )}
                                    </div>

                                    {post.tags.filter((t: string) => !GENERIC_TAGS.has(t) && t.length <= 30 && hubTagSlugs.has(tagToSlug(t))).length > 0 && (
                                        <div className="mt-12 rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-sm">
                                            <div className="text-sm font-semibold tracking-wide text-gray-900 mb-3">Tags</div>
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.filter((t: string) => !GENERIC_TAGS.has(t) && t.length <= 30 && hubTagSlugs.has(tagToSlug(t))).map((tag: string) => (
                                                    <Link
                                                        key={tag}
                                                        href={`/tag/${tagToSlug(tag)}`}
                                                        className="inline-flex items-center min-h-[36px] rounded-full border bg-white/70 px-3 py-1.5 text-sm text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 touch-manipulation"
                                                    >
                                                        {tag}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {related.length > 0 && (
                                        <div className="mt-12 lg:hidden rounded-2xl border bg-white/70 backdrop-blur p-6 shadow-sm">
                                            <div className="text-sm font-semibold tracking-wide text-gray-900 mb-4">More articles like this</div>
                                            <ul className="space-y-4 text-sm">
                                                {related.map((p: any) => (
                                                    <li key={p.slug} className="flex gap-3 items-start">
                                                        <Image
                                                            src={p.featuredImage || "/placeholder.svg"}
                                                            alt={p.title}
                                                            width={72}
                                                            height={48}
                                                            className="rounded object-cover flex-shrink-0 w-18 h-12"
                                                        />
                                                        <div>
                                                            <Link href={`/${encodePathSegments(p.slug)}`} className="font-medium hover:text-green-700 leading-snug">
                                                                {p.title}
                                                            </Link>
                                                            <div className="text-xs text-gray-500 mt-0.5">{formatDate(p.date)}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-10">
                                        <Link href="/blog" className="text-green-800 hover:underline">
                                            Browse all articles →
                                        </Link>
                                    </div>

                                    <nav className="mt-10 grid gap-4 md:grid-cols-2" aria-label="Post navigation">
                                        {prevPost ? (
                                            <Link
                                                href={`/${encodePathSegments(prevPost.slug)}`}
                                                className="rounded-lg border bg-white p-4 hover:shadow-sm"
                                                rel="prev"
                                            >
                                                <div className="text-xs text-gray-500">Previous</div>
                                                <div className="font-semibold">{prevPost.title}</div>
                                            </Link>
                                        ) : (
                                            <div />
                                        )}
                                        {nextPost ? (
                                            <Link
                                                href={`/${encodePathSegments(nextPost.slug)}`}
                                                className="rounded-lg border bg-white p-4 hover:shadow-sm md:text-right"
                                                rel="next"
                                            >
                                                <div className="text-xs text-gray-500">Next</div>
                                                <div className="font-semibold">{nextPost.title}</div>
                                            </Link>
                                        ) : (
                                            <div />
                                        )}
                                    </nav>
                                </div>
                            </div>

                            <aside className="hidden lg:block">
                                <div className="sticky top-24 space-y-6">
                                    {headings.length > 0 && (
                                        <div className="rounded-2xl border bg-white/70 backdrop-blur p-4 shadow-sm">
                                            <div className="text-sm font-semibold mb-3 text-gray-900">On this page</div>
                                            <nav aria-label="Table of contents">
                                                <ul className="space-y-2 text-sm">
                                                    {headings.map((heading) => (
                                                        <li key={heading.id}>
                                                            <a
                                                                href={`#${heading.id}`}
                                                                className="text-green-700 hover:text-green-900 hover:underline"
                                                            >
                                                                {heading.text}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </nav>
                                        </div>
                                    )}
                                    {related.length > 0 && (
                                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                                            <div className="text-sm font-semibold mb-3">Related articles</div>
                                            <ul className="space-y-3 text-sm">
                                                {related.map((p: any) => (
                                                    <li key={p.slug}>
                                                        <Link href={`/${encodePathSegments(p.slug)}`} className="hover:text-green-700">
                                                            {p.title}
                                                        </Link>
                                                        <div className="text-xs text-gray-500 mt-1">{formatDate(p.date)}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="rounded-lg border bg-white p-4 shadow-sm">
                                        <div className="text-sm font-semibold mb-2 text-gray-900">More</div>
                                        <Link href="/blog" className="text-green-700 hover:underline">
                                            Browse all articles →
                                        </Link>
                                    </div>
                                    <div className="affiliate-sidebar-slot" />
                                </div>
                            </aside>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    )
}
