import { redirect } from "next/navigation"
import type { Metadata } from "next"
import Footer from "../components/Footer"
import BlogCard from "../components/BlogCard"
import Pagination from "../components/Pagination"
import { BlogListingJsonLd } from "../components/BlogJsonLd"
import { getBlogCache } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"
import { tagToSlug } from "@/lib/utils"

const POSTS_PER_PAGE = 12

export const metadata: Metadata = {
  title: `Blog`,
  description: `${siteConfig.brand.description} Browse the latest guides and articles.`,
  alternates: {
    canonical: `${getBaseUrl()}/blog`,
  },
  openGraph: {
    title: `${siteConfig.brand.name} Blog | ${siteConfig.brand.tagline}`,
    description: `${siteConfig.brand.description} Browse the latest guides and articles.`,
    url: `${getBaseUrl()}/blog`,
    siteName: siteConfig.brand.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.brand.name} Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} Blog | ${siteConfig.brand.tagline}`,
    description: `${siteConfig.brand.description} Browse the latest guides and articles.`,
    images: [siteConfig.seo.ogImage],
  },
}

interface BlogIndexProps {
  searchParams?: {
    tag?: string
  }
}

export default function BlogIndex({ searchParams }: BlogIndexProps) {
  const selectedTag = searchParams?.tag ? decodeURIComponent(searchParams.tag) : null
  if (selectedTag) {
    redirect(`/tag/${tagToSlug(selectedTag)}`)
  }
  const allPosts = getBlogCache()
  const filteredPosts = selectedTag
    ? allPosts.filter((post) => post.tags.includes(selectedTag))
    : allPosts
  const posts = selectedTag ? filteredPosts : filteredPosts.slice(0, POSTS_PER_PAGE)
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)

  return (
    <div className="min-h-screen flex flex-col">
      <BlogListingJsonLd posts={posts} baseUrl={getBaseUrl()} />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">{siteConfig.brand.name} Blog</h1>
        {selectedTag ? (
          <div className="mb-8">
            <p className="text-lg text-gray-700">
              Showing posts tagged with: <span className="font-semibold">{selectedTag}</span>
            </p>
          </div>
        ) : null}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {selectedTag ? null : <Pagination currentPage={1} totalPages={totalPages} />}
      </main>
      <Footer />
    </div>
  )
}
