import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/lib/siteConfig'

type TestimonialsMode = 'off' | 'placeholder' | 'real'

function getMode(): TestimonialsMode {
  const raw = (process.env.NEXT_PUBLIC_TESTIMONIALS_MODE || 'off').toLowerCase()
  if (raw === 'real' || raw === 'placeholder') return raw
  return 'off'
}

export default function Testimonials() {
  const mode = getMode()

  if (mode === 'off') return null

  if (mode === 'placeholder') {
    return (
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white"
        aria-labelledby="editorial-standards-heading"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            id="editorial-standards-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Editorial Standards Over Social Proof
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            We're a newer publication and we'd rather earn your trust with transparent methodology
            than with stock quotes. Read how we research, verify, and update our guides.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/trust"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              How We Research
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const items = siteConfig.testimonials.items
  const stats = siteConfig.testimonials.stats
  if (items.length === 0 && !stats) return null

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white"
      aria-labelledby="testimonials-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold mt-4 text-gray-900"
          >
            {siteConfig.testimonials.title}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {siteConfig.testimonials.description}
          </p>
        </div>

        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {items.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        )}

        {stats && (
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-800 text-lg font-medium mb-2">{stats.label}</p>
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {stats.number}{' '}
              <span className="text-gray-500 text-lg">{stats.subtext}</span>
            </p>
            <p className="text-gray-600">{stats.description}</p>
          </div>
        )}
      </div>
    </section>
  )
}
