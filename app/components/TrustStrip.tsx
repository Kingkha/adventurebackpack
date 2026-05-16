import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const pillars = [
  {
    icon: '✎',
    heading: 'Human-edited, every guide',
    body: 'AI tools assist drafting. A human editor reviews, fact-checks, and signs off before anything publishes.',
  },
  {
    icon: '⟳',
    heading: 'Updated when things change',
    body: 'Prices, hours, and transport details are re-verified regularly. The lastUpdated date on each guide reflects real edits.',
  },
  {
    icon: '⊘',
    heading: 'No pay-to-rank',
    body: 'Commercial relationships (affiliate links) are disclosed and never influence editorial recommendations.',
  },
  {
    icon: '◎',
    heading: 'Source-grounded claims',
    body: 'Factual claims cite official tourism boards, operator sites, or named publications — never unverified forums.',
  },
]

export default function TrustStrip() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900">
      <div className="container mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div className="border-l-2 border-sky-500 pl-4">
            <p className="text-xs tracking-[0.2em] uppercase text-sky-400 font-semibold">Why trust us</p>
            <h2 className="font-editorial mt-1 text-3xl md:text-4xl text-white">
              Editorial Standards
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/editorial-policy"
              className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              How we research <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/trust"
              className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              Trust &amp; transparency <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.heading} className="border border-slate-700 rounded-xl p-6 bg-slate-800/50">
              <span className="text-2xl text-sky-400 leading-none">{pillar.icon}</span>
              <h3 className="mt-3 text-sm font-bold text-white leading-snug">
                {pillar.heading}
              </h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 sm:hidden">
          <Link
            href="/editorial-policy"
            className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            How we research <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <Link
            href="/trust"
            className="inline-flex items-center text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            Trust &amp; transparency <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  )
}
