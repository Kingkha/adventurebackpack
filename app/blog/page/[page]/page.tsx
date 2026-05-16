import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getTotalPages, getBlogCache } from "@/lib/getBlogPosts"
import Footer from "../../../components/Footer"
import Pagination from "../../../components/Pagination"
import { BlogListingJsonLd } from "../../../components/BlogJsonLd"
import { notFound, redirect } from "next/navigation"
import { siteConfig, getBaseUrl } from "@/lib/siteConfig"

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

  const baseUrl = getBaseUrl()
  const pageTitle = `Blog — Page ${page} of ${totalPages}`
  const ogTitle = `${pageTitle} | ${siteConfig.brand.name}`
  const description = `${siteConfig.brand.description} Page ${page} of ${totalPages}.`
  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: page === 1 ? `${baseUrl}/blog` : `${baseUrl}/blog/page/${page}`,
      ...(page > 2 ? { prev: `${baseUrl}/blog/page/${page - 1}` } : {}),
      ...(page === 2 ? { prev: `${baseUrl}/blog` } : {}),
      ...(page < totalPages ? { next: `${baseUrl}/blog/page/${page + 1}` } : {}),
    },
    openGraph: {
      title: ogTitle,
      description,
      url: page === 1 ? `${baseUrl}/blog` : `${baseUrl}/blog/page/${page}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
    robots: { index: false, follow: true },
  }
}

// Use dynamic rendering for paginated pages since this approach is not compatible with static generation
export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() { return [] }

// Helper function to determine the correct URL for a post
function getPostUrl(post: any): string {
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
  
  // Default blog path
  return `/blog/${post.slug}`
}

export default function BlogPage({ params }: PageProps) {
  const page = Number.parseInt(params.page)
  const POSTS_PER_PAGE = 12;

  if (page === 1) {
    redirect("/blog")
  }
  
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
      <BlogListingJsonLd posts={paginatedPosts} baseUrl={getBaseUrl()} />
      <main className="flex-grow container mx-auto px-4 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-8">{getBaseUrl().replace('https://', '').replace('http://', '')} Blog</h1>
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
