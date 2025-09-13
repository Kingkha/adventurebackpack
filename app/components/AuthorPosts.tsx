import Link from "next/link"
import type { BlogPostMeta } from "@/lib/getBlogPosts"

interface AuthorPostsProps {
  posts: BlogPostMeta[]
}

export default function AuthorPosts({ posts }: AuthorPostsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

