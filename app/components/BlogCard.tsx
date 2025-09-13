import Link from "next/link"
import Image from "next/image"
import { decodeHtmlEntities } from "@/lib/utils"

interface BlogPostProps {
  slug: string
  title: string
  date: string
  excerpt: string
  featuredImage: string
  author: string
  isFromBlogFolder?: boolean
  folder?: string
  subfolders?: string[]
}

// Helper function to determine the correct URL for a post
export function getPostUrl(post: BlogPostProps): string {
  // If we have a nested structure with subfolders, build the path from all segments
  if (post.subfolders && post.subfolders.length > 0) {
    // If the file has the same name as its parent folder (index file)
    if (post.slug === post.subfolders[post.subfolders.length - 1]) {
      // Remove the duplicate last segment for index files
      return `/${post.subfolders.join('/')}`;
    }
    
    // Regular nested file
    return `/${[...post.subfolders, post.slug].join('/')}`;
  }
  
  // If from blog folder
  if (post.isFromBlogFolder) {
    return `/${post.slug}`
  }
  
  // If in a subfolder and has same name as folder
  if (post.folder && post.slug === post.folder) {
    return `/${post.folder}`
  }
  
  // If in a subfolder with different name
  if (post.folder) {
    return `/${post.folder}/${post.slug}`
  }
  
  // Default blog path
  return `/blog/${post.slug}`
}

export default function BlogCard({ post }: { post: BlogPostProps }) {
  return (
    <Link
      href={getPostUrl(post)}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <Image
        src={post.featuredImage || "/placeholder.svg"}
        alt={decodeHtmlEntities(post.title)}
        width={800}
        height={400}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{decodeHtmlEntities(post.title)}</h2>
        <p className="text-gray-600 mb-4">{decodeHtmlEntities(post.excerpt)}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">{post.author}</p>
        </div>
      </div>
    </Link>
  )
} 