import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getBlogCache, getPostUrl } from '@/lib/getBlogPosts'
import { getRecentlyUpdatedGuides } from '@/lib/homepageCollections'

function formatRelativeDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function extractCity(post: { tags: string[] }): string {
  const BACKPACKING_CITY_TAGS = [
    'Hanoi', 'Bangkok', 'Chiang Mai', 'Manila', 'Bali',
    'Kathmandu', 'La Paz', 'Cusco', 'Medellin', 'Oaxaca',
    'Cape Town', 'Marrakech', 'Cairns', 'Queenstown',
    'Reykjavik', 'Lofoten', 'Tbilisi', 'Sarajevo',
  ]
  return post.tags.find((t) => BACKPACKING_CITY_TAGS.includes(t)) || 'Adventure'
}

interface FeedItem {
  title: string
  url: string
  city: string
  date: string
  image: string
}

function LargeCard({ item }: { item: FeedItem }) {
  return (
    <Link href={item.url} className="group relative overflow-hidden rounded-xl block col-span-2 aspect-[16/9]">
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-sky-300 mb-1.5">
          {item.city}
        </p>
        <h3 className="font-editorial text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-sky-100 transition-colors">
          {item.title}
        </h3>
        <p className="mt-2 text-xs text-slate-400 tabular-nums">{item.date}</p>
      </div>
    </Link>
  )
}

function SmallCard({ item }: { item: FeedItem }) {
  return (
    <Link href={item.url} className="group relative overflow-hidden rounded-xl block aspect-[3/2]">
      {item.image && (
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-sky-300 mb-1">
          {item.city}
        </p>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-sky-100 transition-colors">
          {item.title}
        </h3>
        <p className="mt-1.5 text-[11px] text-slate-400 tabular-nums">{item.date}</p>
      </div>
    </Link>
  )
}

export default function FreshnessSection() {
  const allPosts = getBlogCache()

  const latestPool = [...allPosts]
    .filter((p) => p.featuredImage && !p.featuredImage.includes('placeholder'))
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .map((p) => ({
      title: p.title,
      url: getPostUrl(p.slug, '', p.folder, p.subfolders),
      city: extractCity(p),
      date: formatRelativeDate(p.date),
      image: p.featuredImage,
    }))

  const latest: FeedItem[] = latestPool.slice(0, 5)

  const latestUrls = new Set(latest.map((p) => p.url))
  const updated: FeedItem[] = getRecentlyUpdatedGuides(12)
    .map((p) => ({
      title: p.title,
      url: p.url,
      city: p.cityLabel,
      date: formatRelativeDate(p.lastUpdate || p.date),
      image: p.featuredImage,
      _lastUpdate: p.lastUpdate || p.date,
      _publishedDate: p.date,
    }))
    .filter((p) => !latestUrls.has(p.url) && p._lastUpdate !== p._publishedDate)
    .slice(0, 5)
    .map(({ title, url, city, date, image }) => ({ title, url, city, date, image }))

  const rightItems = updated.length >= 3 ? updated : latestPool.slice(5, 10)
  const rightLabel = updated.length >= 3
    ? { eyebrow: 'Content refreshed', heading: 'Recently Updated' }
    : { eyebrow: 'More fresh content', heading: 'Also Published' }

  if (latest.length < 2) return null

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f8f7f3]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Just Published */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div className="border-l-2 border-sky-600 pl-4">
                <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">Updated daily</p>
                <h2 className="font-editorial mt-1 text-2xl text-slate-900">Just Published</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors">
                All guides <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {latest[0] && <LargeCard item={latest[0]} />}
              {latest.slice(1, 5).map((item, i) => (
                <SmallCard key={i} item={item} />
              ))}
            </div>
          </div>

          {/* Right — Recently Updated */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div className="border-l-2 border-sky-600 pl-4">
                <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">{rightLabel.eyebrow}</p>
                <h2 className="font-editorial mt-1 text-2xl text-slate-900">{rightLabel.heading}</h2>
              </div>
              <Link href="/blog" className="hidden sm:inline-flex items-center text-sm font-semibold text-sky-700 hover:text-sky-800 transition-colors">
                All guides <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {rightItems[0] && <LargeCard item={rightItems[0]} />}
              {rightItems.slice(1, 5).map((item, i) => (
                <SmallCard key={i} item={item} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
