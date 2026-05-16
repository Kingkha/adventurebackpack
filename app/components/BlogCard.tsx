import Link from "next/link"
import Image from "next/image"
import { decodeHtmlEntities, tagToSlug, GENERIC_TAGS } from "@/lib/utils"
import { getHubTagSlugs } from "@/lib/getBlogPosts"

interface BlogPostProps {
  slug: string
  title: string
  date: string
  excerpt: string
  featuredImage: string
  author: string
  tags?: string[]
  isFromBlogFolder?: boolean
  folder?: string
  subfolders?: string[]
}

// Helper function to determine the correct URL for a post
export function getPostUrl(post: BlogPostProps): string {
  // New cache format: slug already contains the full path (e.g. "portugal/braga/...")
  if (post.slug.includes('/')) {
    const parts = post.slug.split('/')
    // Check if last two segments are the same (duplicate city case)
    // e.g., "finland/rovaniemi/rovaniemi" -> "finland/rovaniemi"
    if (parts.length >= 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
      return `/${parts.slice(0, -1).join('/')}`
    }
    return `/${post.slug}`
  }

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
  
  // Check if slug already contains folder prefix (new cache format)
  if (post.folder && post.slug.startsWith(`${post.folder}/`)) {
    return `/${post.slug}`
  }
  
  // If in a subfolder and has same name as folder
  if (post.folder && post.slug === post.folder) {
    return `/${post.folder}`
  }
  
  // If in a subfolder with different name (legacy format)
  if (post.folder) {
    return `/${post.folder}/${post.slug}`
  }
  
  // Default: expose posts at root
  return `/${post.slug}`
}

export default function BlogCard({ post }: { post: BlogPostProps }) {
  const hubSlugs = getHubTagSlugs()
  const visibleTags = (post.tags || [])
    .filter((t) => !GENERIC_TAGS.has(t) && t.length <= 30 && hubSlugs.has(tagToSlug(t)))
    .slice(0, 3)

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link
        href={getPostUrl(post)}
        className="block"
        aria-hidden="true"
        tabIndex={-1}
      >
        <Image
          src={post.featuredImage || "/placeholder.svg"}
          alt=""
          width={800}
          height={400}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <Link href={getPostUrl(post)} className="block">
          <h2 className="text-xl font-semibold mb-2 hover:text-green-700 transition-colors">{decodeHtmlEntities(post.title)}</h2>
        </Link>
        <p className="text-gray-600 mb-4 flex-grow">{decodeHtmlEntities(post.excerpt)}</p>
        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {visibleTags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tagToSlug(tag)}`}
                className="inline-flex items-center min-h-[32px] text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors touch-manipulation"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">{post.author}</p>
        </div>
      </div>
    </div>
  )
} 
