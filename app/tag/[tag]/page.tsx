import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import Footer from "../../components/Footer"
import BlogCard from "../../components/BlogCard"
import Pagination from "../../components/Pagination"
import { getBlogCache } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { tagToSlug, getTagsForSlug, GENERIC_TAGS, MIN_POSTS_PER_HUB, MAX_TAG_LENGTH, TAG_DESCRIPTIONS } from "@/lib/utils"

const MIN_POSTS = MIN_POSTS_PER_HUB
const POSTS_PER_PAGE = 12

export const revalidate = 86400

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

function getAllTagSlugs(): { slug: string }[] {
  const cache = getBlogCache()
  const tagCounts: Record<string, number> = {}
  cache.forEach((p) => p.tags.forEach((t) => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))

  const seen = new Set<string>()
  const slugs: { slug: string }[] = []
  Object.entries(tagCounts)
    .filter(([tag, count]) => count >= MIN_POSTS && !GENERIC_TAGS.has(tag) && tag.length <= MAX_TAG_LENGTH)
    .forEach(([tag]) => {
      const slug = tagToSlug(tag)
      if (!seen.has(slug)) {
        seen.add(slug)
        slugs.push({ slug })
      }
    })
  return slugs
}

export async function generateStaticParams() {
  return getAllTagSlugs()
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const resolved = resolveTag(params.tag)
  if (!resolved) return { title: "Not Found" }

  const { displayTag, posts } = resolved
  const canonicalUrl = `${getBaseUrl()}/tag/${params.tag}`
  const description = TAG_DESCRIPTIONS[params.tag]
    || `Browse ${posts.length} ${displayTag} travel guides on ${siteConfig.brand.name}. Find practical tips, itineraries, and local recommendations for Japan travel.`

  return {
    title: `${displayTag} Travel Guides — ${posts.length} Articles`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${displayTag} Travel Guides | ${siteConfig.brand.name}`,
      description,
      url: canonicalUrl,
      siteName: siteConfig.brand.name,
      locale: "en_US",
      type: "website",
      images: [{ url: siteConfig.seo.ogImage, width: 1200, height: 630, alt: `${displayTag} – ${siteConfig.brand.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayTag} Travel Guides | ${siteConfig.brand.name}`,
      description,
      images: [siteConfig.seo.ogImage],
    },
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const resolved = resolveTag(params.tag)
  if (!resolved) notFound()

  const { displayTag, posts } = resolved
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const pagePosts = posts.slice(0, POSTS_PER_PAGE)
  const description = TAG_DESCRIPTIONS[params.tag]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <div className="mb-8 max-w-3xl">
          <Link href="/blog" className="text-sm text-green-700 hover:underline">
            ← All guides
          </Link>
          <h1 className="text-4xl font-bold mt-2">{displayTag} Travel Guides</h1>
          <p className="text-gray-500 mt-1 text-sm">{posts.length} articles</p>
          {description && (
            <p className="mt-4 text-gray-700 leading-relaxed">{description}</p>
          )}
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {pagePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            currentPage={1}
            totalPages={totalPages}
            basePath={`/tag/${params.tag}/page`}
            page1Href={`/tag/${params.tag}`}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
