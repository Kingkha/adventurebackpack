import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const regions = [
  {
    name: 'Southeast Asia',
    description: 'Vietnam, Thailand, Indonesia & more',
    href: '/tag/Vietnam',
    image: '/images/hanoi-adventures.webp',
  },
  {
    name: 'South Asia',
    description: 'Nepal, India, Sri Lanka & more',
    href: '/tag/Nepal',
    image: '/images/kathmandu-adventures.webp',
  },
  {
    name: 'Latin America',
    description: 'Bolivia, Peru, Colombia & more',
    href: '/tag/Bolivia',
    image: '/images/la-paz-adventures.webp',
  },
  {
    name: 'Africa',
    description: 'South Africa, Morocco, Tanzania & more',
    href: '/tag/South%20Africa',
    image: '/images/cape-town-adventures.webp',
  },
  {
    name: 'Oceania',
    description: 'New Zealand, Australia, Fiji & more',
    href: '/tag/New%20Zealand',
    image: '/images/queenstown-adventures.webp',
  },
  {
    name: 'Nordic & Iceland',
    description: 'Iceland, Norway, Greenland & more',
    href: '/tag/Iceland',
    image: '/images/reykjavik-adventures.webp',
  },
]

export default function RegionNavigator() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div className="border-l-2 border-sky-600 pl-4">
            <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Explore the World</p>
            <h2 className="font-editorial mt-1 text-3xl md:text-4xl text-slate-900">
              Browse by Region
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors"
          >
            All destinations
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {regions.map((region) => (
            <Link
              key={region.name}
              href={region.href}
              className="group relative overflow-hidden rounded-xl aspect-[3/4] sm:aspect-[2/3] lg:aspect-[3/5] block"
            >
              <Image
                src={region.image}
                alt={region.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-base font-bold text-white leading-tight">{region.name}</p>
                <p className="mt-1 text-xs text-slate-300 leading-snug line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {region.description}
                </p>
                <span className="mt-2 inline-flex items-center text-xs font-semibold text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Explore <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

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
