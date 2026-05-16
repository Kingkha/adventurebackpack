import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getBlogCache } from '@/lib/getBlogPosts'

const BACKPACKING_CITY_TAGS = [
  'Hanoi', 'Bangkok', 'Chiang Mai', 'Manila', 'Bali',
  'Kathmandu', 'La Paz', 'Cusco', 'Medellin', 'Oaxaca',
  'Cape Town', 'Marrakech', 'Cairns', 'Queenstown',
  'Reykjavik', 'Lofoten', 'Tbilisi', 'Sarajevo',
]

function getCityStats() {
  const posts = getBlogCache()
  const map = new Map<string, { count: number; image: string }>()

  for (const post of posts) {
    const cityTag = post.tags.find((t) => BACKPACKING_CITY_TAGS.includes(t))
    if (!cityTag) continue
    const existing = map.get(cityTag)
    const validImage =
      post.featuredImage && !post.featuredImage.includes('placeholder')
        ? post.featuredImage
        : ''
    if (!existing) {
      map.set(cityTag, { count: 1, image: validImage })
    } else {
      existing.count++
      if (!existing.image && validImage) existing.image = validImage
    }
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 16)
    .map(([cityTag, data]) => ({
      key: cityTag.toLowerCase(),
      label: cityTag,
      count: data.count,
      href: `/tag/${cityTag.toLowerCase()}`,
      image: data.image,
    }))
}

export default function CitiesGrid() {
  const cities = getCityStats()
  const totalGuides = getBlogCache().length
  const totalCities = cities.length

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="border-l-2 border-sky-600 pl-4">
            <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">
              Where do you want to go?
            </p>
            <h2 className="font-editorial mt-1 text-3xl md:text-4xl text-slate-900">
              Explore by City
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {totalGuides.toLocaleString()} guides · {totalCities} cities
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            All cities <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cities.map((city) => (
            <Link
              key={city.key}
              href={city.href}
              className="group relative overflow-hidden rounded-xl block aspect-[3/2]"
            >
              {city.image ? (
                <Image
                  src={city.image}
                  alt={city.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-sm font-bold text-white leading-tight">
                  {city.label}
                </p>
                <p className="text-xs text-sky-300 mt-0.5 font-medium">
                  {city.count.toLocaleString()} guides
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition-all duration-150"
          >
            Browse all {totalCities} cities
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
