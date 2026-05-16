import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

// Hand-picked recently-blueprinted clusters. Image-led cards because the
// homepage's primary job is to *look* like a travel publication on first
// scroll — and because Google rewards visual destination intent. Each card
// surfaces the pillar plus 3 sibling spokes so Googlebot picks up the
// hub-and-spoke structure in a single homepage fetch.
const featuredClusters = [
  {
    title: 'Nottingham',
    country: 'United Kingdom',
    image: '/images/nottingham-activities.webp',
    pillarHref: '/nottingham-activities',
    pillarLabel: 'Nottingham Activities',
    blurb: 'Robin Hood country — caves under the city, the medieval castle, Sherwood day trips, and one of the cheapest UK city breaks for backpackers.',
    spokes: [
      { label: 'City of Caves Guide', href: '/city-of-caves-nottingham-guide' },
      { label: 'Nottingham Castle Visit', href: '/nottingham-castle-visiting-guide' },
      { label: '2-Day Nottingham Itinerary', href: '/nottingham-2-day-itinerary' },
    ],
  },
  {
    title: 'Albuquerque',
    country: 'United States',
    image: '/images/things-to-do-in-albuquerque.webp',
    pillarHref: '/things-to-do-in-albuquerque',
    pillarLabel: 'Things to Do in Albuquerque',
    blurb: 'High-desert basecamp — hot-air balloons over the Rio Grande, Old Town adobe streets, Sandia Peak tram, and a Route 66 backpacker classic.',
    spokes: [
      { label: 'Old Town Albuquerque', href: '/old-town-albuquerque' },
      { label: 'Hidden Gems in Albuquerque', href: '/albuquerque-hidden-gems' },
      { label: 'Free Things to Do', href: '/free-things-to-do-in-albuquerque' },
    ],
  },
  {
    title: 'Amsterdam',
    country: 'Netherlands',
    image: '/images/amsterdam-activities.webp',
    pillarHref: '/amsterdam-activities',
    pillarLabel: 'Amsterdam Activities',
    blurb: 'Canal city for the curious — bike-friendly streets, the Anne Frank House, Jordaan’s independent cafés, and Europe’s most walkable backpacker hub.',
    spokes: [
      { label: 'Amsterdam Bike Tour', href: '/amsterdam-bike-tour' },
      { label: '3-Day Amsterdam Itinerary', href: '/amsterdam-3-day-itinerary' },
      { label: 'Jordaan District Guide', href: '/jordaan-district-amsterdam' },
    ],
  },
]

export default function FeaturedClusterGuides() {
  return (
    <section
      aria-labelledby="featured-clusters-heading"
      className="bg-gradient-to-b from-sky-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-b border-sky-100"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <p className="text-xs tracking-[0.2em] uppercase text-sky-700 font-semibold">
            Now in Editorial
          </p>
        </div>
        <h2
          id="featured-clusters-heading"
          className="font-editorial text-3xl md:text-4xl text-slate-900 max-w-2xl mb-3"
        >
          New destination guides, freshly published.
        </h2>
        <p className="text-base text-slate-600 max-w-2xl mb-10">
          The latest cities our editorial desk planned end-to-end — pillar guides,
          route ideas, hostel picks, and the spokes that go with them.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClusters.map((cluster) => (
            <article
              key={cluster.pillarHref}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <Link href={cluster.pillarHref} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={cluster.image}
                  alt={`${cluster.title}, ${cluster.country} — backpacker travel guide`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-sky-600 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 shadow">
                  NEW
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-white/85 font-semibold">
                    {cluster.country}
                  </p>
                  <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-sm">
                    {cluster.title}
                  </h3>
                </div>
              </Link>

              {/* Body */}
              <div className="flex flex-col flex-grow p-5">
                <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-grow">
                  {cluster.blurb}
                </p>

                <Link
                  href={cluster.pillarHref}
                  className="inline-flex items-center justify-between rounded-lg bg-slate-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-700 transition-colors mb-4"
                >
                  <span>Read the {cluster.pillarLabel}</span>
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Link>

                <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                  {cluster.spokes.map((spoke) => (
                    <li key={spoke.href}>
                      <Link
                        href={spoke.href}
                        className="group/spoke flex items-center justify-between text-sm text-slate-700 hover:text-sky-700 transition-colors"
                      >
                        <span>· {spoke.label}</span>
                        <ArrowRight
                          className="h-3 w-3 opacity-0 group-hover/spoke:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
