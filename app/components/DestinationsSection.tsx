import Link from 'next/link'

const destinations = [
  {
    city: 'Hanoi',
    description: 'SE Asia gateway — Old Quarter alleys, Ha Long Bay day trips, and the cheapest pho on Earth.',
    href: '/hanoi-adventures',
    articles: '9+',
    emoji: '🍜',
  },
  {
    city: 'Bangkok',
    description: 'Hostel hub of Khao San Road, night markets, and overland launchpad into the rest of Thailand.',
    href: '/bangkok-adventures',
    articles: '10+',
    emoji: '🛺',
  },
  {
    city: 'Chiang Mai',
    description: 'Northern Thailand base — elephant sanctuaries, jungle treks, and digital-nomad cafes.',
    href: '/chiang-mai-adventures',
    articles: '12+',
    emoji: '🐘',
  },
  {
    city: 'Kathmandu',
    description: 'Himalayan gateway — Thamel hostels, trek permits, and the start of every Nepal adventure.',
    href: '/kathmandu-adventures',
    articles: '9+',
    emoji: '🏔️',
  },
  {
    city: 'La Paz',
    description: 'Highest capital in the world — Death Road, salt flats, and Andean backpacker culture.',
    href: '/la-paz-adventures',
    articles: '9+',
    emoji: '🚴',
  },
  {
    city: 'Cape Town',
    description: 'Table Mountain, Cape Peninsula safaris, and the cheapest jaw-dropping coastline in Africa.',
    href: '/cape-town-adventures',
    articles: '9+',
    emoji: '🦓',
  },
  {
    city: 'Queenstown',
    description: 'Adrenaline capital of New Zealand — bungy, paragliding, Routeburn track, and lakeside hostels.',
    href: '/queenstown-adventures',
    articles: '9+',
    emoji: '🪂',
  },
  {
    city: 'Reykjavik',
    description: 'Ring Road launchpad — glacier hikes, geothermal pools, and Iceland\'s wildest landscapes.',
    href: '/reykjavik-adventures',
    articles: '9+',
    emoji: '🌋',
  },
]

export default function DestinationsSection() {
  return (
    <section aria-labelledby="destinations-heading" className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 id="destinations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Backpacking Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            In-depth guides for every region — routes, hostels, hikes, transport, and budget tips.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest.city}
              href={dest.href}
              className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col gap-2"
            >
              <span className="text-3xl" role="img" aria-hidden="true">{dest.emoji}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {dest.city}
                </h3>
                <p className="text-sm text-gray-500 mt-1 leading-snug">{dest.description}</p>
              </div>
              <span className="text-xs text-blue-700 font-medium mt-auto">{dest.articles} guides →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
