import Link from 'next/link'
import Image from 'next/image'
import { getPostUrl } from './BlogCard'

interface Post {
  slug: string
  title: string
  excerpt: string
  featuredImage: string
  author: string
  date: string
  tags?: string[]
  isFromBlogFolder?: boolean
  folder?: string
  subfolders?: string[]
}

interface ThemeRowProps {
  heading: string
  subheading: string
  posts: Post[]
  viewAllHref: string
  viewAllLabel: string
}

function ThemeRow({ heading, subheading, posts, viewAllHref, viewAllLabel }: ThemeRowProps) {
  if (posts.length === 0) return null
  return (
    <div className="mb-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{heading}</h3>
          <p className="text-gray-500 text-sm mt-1">{subheading}</p>
        </div>
        <Link href={viewAllHref} className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap ml-4">
          {viewAllLabel} →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {posts.slice(0, 4).map((post) => (
          <Link
            key={post.slug}
            href={getPostUrl(post)}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
          >
            <Image
              src={post.featuredImage || '/placeholder.svg'}
              alt={post.title}
              width={400}
              height={220}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

interface Props {
  posts: Post[]
}

export default function FeaturedThemesSection({ posts }: Props) {
  const nightlifePosts = posts
    .filter((p) => {
      const tags = (p.tags || []).map((t) => t.toLowerCase())
      return (
        tags.includes('nightlife') ||
        p.slug.includes('nightlife') ||
        p.slug.includes('night-') ||
        p.slug.includes('bars') ||
        p.slug.includes('bar-')
      )
    })
    .slice(0, 4)

  const festivalPosts = posts
    .filter((p) => {
      const tags = (p.tags || []).map((t) => t.toLowerCase())
      return (
        tags.includes('festivals') ||
        tags.includes('festival') ||
        p.slug.includes('festival') ||
        p.slug.includes('sakura') ||
        p.slug.includes('cherry-blossom') ||
        p.slug.includes('events')
      )
    })
    .slice(0, 4)

  const budgetPosts = posts
    .filter((p) => {
      const tags = (p.tags || []).map((t) => t.toLowerCase())
      return (
        tags.includes('budget') ||
        p.slug.includes('budget') ||
        p.slug.includes('free-') ||
        p.slug.includes('cheap') ||
        p.slug.includes('itinerary')
      )
    })
    .slice(0, 4)

  const hasContent = nightlifePosts.length > 0 || festivalPosts.length > 0 || budgetPosts.length > 0
  if (!hasContent) return null

  return (
    <section aria-labelledby="themes-heading" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 id="themes-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Theme
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find guides organised around how you actually plan a trip.
          </p>
        </div>

        <ThemeRow
          heading="Nightlife Guides"
          subheading="Bars, districts, and after-dark activities across Japan"
          posts={nightlifePosts}
          viewAllHref="/blog?tag=Nightlife"
          viewAllLabel="All nightlife guides"
        />
        <ThemeRow
          heading="Festivals & Seasonal Events"
          subheading="Cherry blossoms, summer fireworks, and local matsuri"
          posts={festivalPosts}
          viewAllHref="/blog?tag=Festivals"
          viewAllLabel="All festival guides"
        />
        <ThemeRow
          heading="Itineraries & Budget Travel"
          subheading="Day-by-day plans and free things to do across Japan"
          posts={budgetPosts}
          viewAllHref="/blog?tag=Travel"
          viewAllLabel="All itineraries"
        />
      </div>
    </section>
  )
}
