import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getHomepageCollections } from '@/lib/homepageCollections'

export default function EditorialFeed() {
  const { latestGuides, popularGuides } = getHomepageCollections()
  const latest = latestGuides.slice(0, 5)
  const popular = popularGuides.slice(0, 5)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f7f3]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">

          {/* Left — Latest stories */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <div className="border-l-2 border-sky-600 pl-4">
                <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Latest stories</p>
                <h2 className="font-editorial mt-1 text-2xl md:text-3xl text-slate-900">On Our Radar</h2>
              </div>
              <Link
                href="/blog"
                className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {latest.map((post, index) => (
                <Link
                  key={post.slug}
                  href={post.url}
                  className="group flex gap-5 py-4 border-b border-slate-100 last:border-0 transition-all duration-200"
                >
                  <div
                    className="relative flex-shrink-0 overflow-hidden rounded-lg"
                    style={{ width: index === 0 ? 112 : 88, height: index === 0 ? 96 : 80 }}
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="text-xs font-bold tracking-[0.14em] uppercase text-sky-700 mb-1.5">
                      {post.cityLabel}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/blog"
              className="mt-6 sm:hidden inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800"
            >
              View all guides <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Right — Most read */}
          <div>
            <div className="mb-8 border-l-2 border-sky-600 pl-4">
              <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Trending now</p>
              <h2 className="font-editorial mt-1 text-2xl md:text-3xl text-slate-900">Most Read</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {popular.map((post, index) => (
                <Link
                  key={post.slug}
                  href={post.url}
                  className="group flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center group-hover:bg-sky-100 group-hover:text-sky-700 transition-colors">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-sky-700 tracking-wide">{post.cityLabel}</p>
                  </div>
                  <ArrowRight className="flex-shrink-0 h-4 w-4 text-slate-300 group-hover:text-sky-500 transition-colors mt-0.5" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
