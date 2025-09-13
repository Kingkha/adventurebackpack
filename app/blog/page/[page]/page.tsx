import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getBlogPostsMeta, getTotalPages, getBlogCache } from "@/lib/getBlogPosts"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import Pagination from "../../../components/Pagination"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    page: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = Number.parseInt(params.page)
  const totalPages = getTotalPages()

  if (isNaN(page) || page < 1 || page > totalPages) {
    return {}
  }

  return {
    title: `Page ${page} - adventurebackpack.com Blog`,
    description: `Explore travel tips, destination guides, and insights on adventurebackpack.com. Page ${page} of ${totalPages}.`,
    openGraph: {
      title: `Page ${page} - adventurebackpack.com Blog`,
      description: `Explore travel tips, destination guides, and insights on adventurebackpack.com. Page ${page} of ${totalPages}.`,
      type: "website",
      images: [
        {
          url: "/placeholder.svg?height=400&width=800",
          width: 800,
          height: 400,
          alt: "adventurebackpack.com Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Page ${page} - adventurebackpack.com Blog`,
      description: `Explore travel tips, destination guides, and insights on adventurebackpack.com. Page ${page} of ${totalPages}.`,
      images: ["/placeholder.svg?height=400&width=800"],
    },
  }
}

// Use dynamic rendering for paginated pages since this approach is not compatible with static generation
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const totalPages = getTotalPages()
  // Generate a reasonable number of pages (adjust as needed)
  const pagesToGenerate = Math.min(totalPages, 5); 
  return Array.from({ length: pagesToGenerate }, (_, i) => ({ 
    page: (i + 1).toString() 
  }))
}

// Helper function to determine the correct URL for a post
function getPostUrl(post: any): string {
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

export default function BlogPage({ params }: PageProps) {
  const page = Number.parseInt(params.page)
  const POSTS_PER_PAGE = 12;
  
  // Calculate the correct slice of posts for the current page
  const allPosts = getBlogCache();
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  
  // Apply pagination manually to get the correct posts for this page
  const paginatedPosts = allPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  
  if (isNaN(page) || page < 1 || page > totalPages || paginatedPosts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">adventurebackpack.com Blog</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post) => (
            <Link
              key={post.slug}
              href={getPostUrl(post)}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <Image
                src={post.featuredImage || "/placeholder.svg"}
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{post.author}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} />
      </main>
      <Footer />
    </div>
  )
}

