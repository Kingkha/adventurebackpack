import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Footer from "../../../../components/Footer"
import BlogCard from "../../../../components/BlogCard"
import Pagination from "../../../../components/Pagination"
import { getBlogCache } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { tagToSlug, getTagsForSlug, GENERIC_TAGS } from "@/lib/utils"

const MIN_POSTS = 5
const POSTS_PER_PAGE = 12

export const revalidate = 86400
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

function resolveTag(tagSlug: string) {
  const cache = getBlogCache()
  const allTags = [...new Set(cache.flatMap((p) => p.tags))]
  const matchedTags = getTagsForSlug(tagSlug, allTags)
  if (!matchedTags.length) return null

  const posts = cache.filter((p) => matchedTags.some((t) => p.tags.includes(t)))
  if (posts.length < MIN_POSTS) return null

  const tagCountMap: Record<string, number> = {}
  posts.forEach((p) => p.tags.forEach((t) => { if (matchedTags.includes(t)) tagCountMap[t] = (tagCountMap[t] || 0) + 1 }))
  const displayTag = matchedTags.sort((a, b) => (tagCountMap[b] || 0) - (tagCountMap[a] || 0))[0]

  return { matchedTags, displayTag, posts }
}

export async function generateMetadata({ params }: { params: { tag: string; page: string } }): Promise<Metadata> {
  const page = parseInt(params.page, 10)
  const resolved = resolveTag(params.tag)
  if (!resolved || isNaN(page) || page < 2) return { title: "Not Found" }

  const { displayTag, posts } = resolved
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (page > totalPages) return { title: "Not Found" }

  const tagPageUrl = `${getBaseUrl()}/tag/${params.tag}`
  const canonicalUrl = `${tagPageUrl}/page/${page}`

  return {
    title: `${displayTag} Travel Guides — Page ${page} of ${totalPages}`,
    description: `${displayTag} travel guides, page ${page} of ${totalPages}. Find practical tips, itineraries, and local recommendations for Japan travel.`,
    alternates: {
      canonical: canonicalUrl,
      ...(page > 2 ? { prev: `${tagPageUrl}/page/${page - 1}` } : { prev: tagPageUrl }),
      ...(page < totalPages ? { next: `${tagPageUrl}/page/${page + 1}` } : {}),
    },
    robots: { index: false, follow: true },
  }
}

export default function TagPaginatedPage({ params }: { params: { tag: string; page: string } }) {
  const page = parseInt(params.page, 10)
  if (isNaN(page) || page < 2) notFound()

  const resolved = resolveTag(params.tag)
  if (!resolved) notFound()

  const { displayTag, posts } = resolved
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  if (page > totalPages) notFound()

  const start = (page - 1) * POSTS_PER_PAGE
  const pagePosts = posts.slice(start, start + POSTS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="mb-8">
          <Link href={`/tag/${params.tag}`} className="text-sm text-green-700 hover:underline">
            ← {displayTag} guides
          </Link>
          <h1 className="text-4xl font-bold mt-2">{displayTag} Travel Guides</h1>
          <p className="text-gray-500 mt-1 text-sm">Page {page} of {totalPages} — {posts.length} total articles</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/tag/${params.tag}/page`}
          page1Href={`/tag/${params.tag}`}
        />
      </main>
      <Footer />
    </div>
  )
}
