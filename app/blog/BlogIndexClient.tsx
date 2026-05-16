"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import TagSearch from "../components/TagSearch"
import { BlogListingJsonLd } from "../components/BlogJsonLd"
import BlogCard from "../components/BlogCard"
import type { BlogPostMeta } from "@/lib/getBlogPosts"
import { getBaseUrl, siteConfig } from "@/lib/siteConfig"

// Extended interface to include the isFromBlogFolder flag and folder name
interface BlogPostWithSource extends BlogPostMeta {
  isFromBlogFolder?: boolean
  folder?: string
  subfolders?: string[] // Add subfolders for deeper nesting
}

function decodeCategory(category: string): string {
  return decodeURIComponent(category).replace(/-/g, " ")
}

function BlogIndexInner() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const tagFromUrl = searchParams.get("tag")
  const baseUrl = getBaseUrl()

  const [posts, setPosts] = useState<BlogPostWithSource[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(tagFromUrl)
  const [topTags, setTopTags] = useState<{ tag: string; count: number }[]>([])

  const fetchPosts = async (
    cursor: string | null = null,
    tag: string | null = selectedTag,
    cat: string | null = category,
  ) => {
    setIsLoading(true)
    try {
      // Fetch blog cache directly from public folder
      const cacheRes = await fetch('/blog-cache.json')
      const allPosts: BlogPostWithSource[] = await cacheRes.json()
      
      // Filter posts by tag and category
      let filteredPosts = allPosts
      if (tag) {
        filteredPosts = filteredPosts.filter(post => post.tags.includes(tag))
      }
      if (cat) {
        filteredPosts = filteredPosts.filter(post => 
          post.slug.replace(/_/g, "-") === cat
        )
      }
      
      // Calculate pagination
      const POSTS_PER_PAGE = 12
      let startIndex = 0
      if (cursor) {
        startIndex = filteredPosts.findIndex(post => post.slug === cursor) + 1
      }
      
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)
      const nextCursor = filteredPosts[startIndex + POSTS_PER_PAGE]?.slug || null
      
      setPosts((prevPosts) => (cursor ? [...prevPosts, ...paginatedPosts] : paginatedPosts))
      setNextCursor(nextCursor)
      
      // Calculate top tags from all posts
      const tagCounts: Record<string, number> = {}
      allPosts.forEach(post => {
        post.tags.forEach(t => {
          tagCounts[t] = (tagCounts[t] || 0) + 1
        })
      })
      const topTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
      setTopTags(topTags)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(null, tagFromUrl, category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, tagFromUrl])

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    setPosts([])
    setNextCursor(null)
    fetchPosts(null, tag, category)
  }

  return (
    <>
      <BlogListingJsonLd posts={posts} baseUrl={baseUrl} />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">{siteConfig.brand.name} Blog</h1>
        {category && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Category: {decodeCategory(category)}</h2>
            <Link href="/blog" className="text-green-600 hover:underline">
              ← Back to all categories
            </Link>
          </div>
        )}
        <TagSearch tags={topTags} selectedTag={selectedTag} onTagSelect={handleTagSelect} />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        {nextCursor && (
          <button
            onClick={() => fetchPosts(nextCursor, selectedTag, category)}
            disabled={isLoading}
            className="mt-8 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:bg-gray-400"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </main>
    </>
  )
}

export default function BlogIndexClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BlogIndexInner />
    </Suspense>
  )
}

