"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"
import TagSearch from "../components/TagSearch"
import { BlogListingJsonLd } from "../components/BlogJsonLd"
import BlogCard from "../components/BlogCard"
import type { BlogPostMeta } from "@/lib/getBlogPosts"

// Extended interface to include the isFromBlogFolder flag and folder name
interface BlogPostWithSource extends BlogPostMeta {
  isFromBlogFolder?: boolean;
  folder?: string;
  subfolders?: string[]; // Add subfolders for deeper nesting
}

function decodeCategory(category: string): string {
  return decodeURIComponent(category).replace(/-/g, " ")
}

export default function BlogIndex() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const tagFromUrl = searchParams.get("tag")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://secretlocale.com"

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
    const queryParams = new URLSearchParams()
    if (cursor) queryParams.append("cursor", cursor)
    if (tag) queryParams.append("tag", tag)
    if (cat) queryParams.append("category", cat)

    try {
      const res = await fetch(`/api/blog-posts?${queryParams.toString()}`)
      const data = await res.json()
      setPosts((prevPosts) => (cursor ? [...prevPosts, ...data.posts] : data.posts))
      setNextCursor(data.nextCursor)
      if (data.topTags && Array.isArray(data.topTags)) {
        setTopTags(data.topTags)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(null, tagFromUrl, category)
  }, [category, tagFromUrl])

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    setPosts([])
    setNextCursor(null)
    fetchPosts(null, tag, category)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BlogListingJsonLd posts={posts} baseUrl={baseUrl} />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">secretlocale.com Blog</h1>
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
            className="mt-8 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        )}
      </main>
      <Footer />
    </div>
  )
}

