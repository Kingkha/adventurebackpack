import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getHomepageCollections } from '@/lib/homepageCollections'

export default function Hero() {
  const { heroQuickLinks } = getHomepageCollections()
  const quickLinks = heroQuickLinks.length
    ? heroQuickLinks
    : [
        { label: 'Hanoi', href: '/hanoi-adventures' },
        { label: 'Bangkok', href: '/bangkok-adventures' },
        { label: 'Chiang Mai', href: '/chiang-mai-adventures' },
        { label: 'La Paz', href: '/la-paz-adventures' },
      ]

  return (
    <section
      className="relative min-h-[680px] overflow-hidden bg-slate-900"
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Image
          src="/og-image.webp"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
        {/* Base scrim ensures ≥4.5:1 contrast for text even over bright photo regions */}
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,23,39,0.90)_5%,rgba(10,23,39,0.75)_60%,rgba(10,23,39,0.55)_100%)]" />
      </div>

      <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-center">

          {/* Left — editorial statement */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.22em] uppercase text-sky-300 mb-5">
              Adventure Backpacking Travel Guides
            </p>
            <h1
              id="hero-heading"
              className="font-editorial text-4xl sm:text-5xl md:text-[3.5rem] leading-[1.06] text-white"
            >
              The world&apos;s best backpacking routes, guided by travelers who actually went.
            </h1>
            <p className="mt-6 text-lg text-slate-200 leading-relaxed max-w-xl">
              Practical route guides, hostel picks, hiking tips, and budget itineraries — organized by destination so you can plan faster.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-md bg-sky-700 px-7 py-3.5 text-base font-semibold text-white hover:bg-sky-800 transition-colors"
                aria-label="Browse adventure backpacking travel guides"
              >
                Browse Destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hanoi-adventures"
                className="inline-flex items-center gap-2 rounded-md border border-white/40 bg-white/10 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Hanoi Guides
              </Link>
            </div>
          </div>

          {/* Right — editor picks card */}
          <aside className="rounded-2xl border border-white/20 bg-white/[0.10] p-6 backdrop-blur-md">
            <p className="text-xs font-bold tracking-[0.18em] uppercase text-sky-300 mb-4">
              On Our Radar
            </p>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.06] px-4 py-3 text-white hover:bg-white/15 transition-colors"
                >
                  <p className="text-sm font-semibold">{link.label}</p>
                  <ArrowRight className="h-3.5 w-3.5 text-sky-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-5 inline-flex items-center text-xs font-semibold tracking-wide text-sky-200 hover:text-white transition-colors"
            >
              All destinations <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </aside>

        </div>
      </div>
    </section>
  )
}
