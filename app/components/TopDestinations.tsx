import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getHomepageCollections } from '@/lib/homepageCollections'

export default function TopDestinations() {
  const { topDestinations: posts } = getHomepageCollections()
  const [hero, ...rest] = posts

  if (!hero) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="border-l-2 border-sky-600 pl-4">
            <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Editor&rsquo;s selection</p>
            <h2 className="font-editorial mt-1 text-3xl md:text-4xl text-slate-900">
              Top Destinations
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            All destinations <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Hero + stacked row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          {/* Hero card — spans 2 columns */}
          <Link
            href={hero.url}
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl block"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3]">
              <Image
                src={hero.featuredImage}
                alt={hero.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10">
                <span className="text-xs font-bold tracking-[0.18em] uppercase text-sky-300">
                  {hero.cityLabel}
                </span>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-white leading-tight">
                  {hero.title}
                </h3>
                <p className="mt-3 text-slate-200 text-sm line-clamp-2 max-w-lg leading-relaxed">
                  {hero.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center text-sm font-semibold text-sky-300 group-hover:text-sky-100 transition-colors">
                  Explore guide <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          {/* Two stacked support cards */}
          <div className="flex flex-col gap-3">
            {rest.slice(0, 2).map((post) => (
              <Link
                key={post.slug}
                href={post.url}
                className="group relative overflow-hidden rounded-2xl block flex-1"
              >
                <div className="relative h-48 lg:h-full lg:min-h-[180px]">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-bold tracking-[0.16em] uppercase text-sky-300">
                      {post.cityLabel}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row — remaining cards */}
        {rest.length > 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rest.slice(2, 5).map((post) => (
              <Link
                key={post.slug}
                href={post.url}
                className="group relative overflow-hidden rounded-2xl block"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-bold tracking-[0.16em] uppercase text-sky-300">
                      {post.cityLabel}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-white leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-4 sm:hidden text-center">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            All destinations <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
