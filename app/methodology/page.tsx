import type { Metadata } from "next"
import Footer from "../components/Footer"
import { siteConfig, getBaseUrl } from "@/lib/siteConfig"

const canonicalUrl = `${getBaseUrl()}/methodology`
const pageTitle = `Methodology`
const ogTitle = `Methodology | ${siteConfig.brand.name}`
const description = `How ${siteConfig.brand.name} decides what to recommend, ranks options, and keeps recommendations honest. Our philosophy, ranking criteria, and data sources.`

export const metadata: Metadata = {
  title: pageTitle,
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: ogTitle,
    description,
    url: canonicalUrl,
    type: "article",
  },
}

export default function MethodologyPage() {
  const m = siteConfig.methodology

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16 mt-16">
          <article className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Methodology</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{m.intro}</p>
            </header>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Editorial Philosophy</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{m.philosophy}</p>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{m.rankingCriteria.title}</h2>
              <p className="text-gray-700 mb-6">{m.rankingCriteria.description}</p>
              <ol className="space-y-4">
                {m.rankingCriteria.criteria.map((c, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{c.title}</h3>
                      <p className="text-gray-700 mt-1">{c.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{m.excludedCriteria.title}</h2>
              <p className="text-gray-700 mb-6">{m.excludedCriteria.description}</p>
              <ul className="space-y-2">
                {m.excludedCriteria.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-500 font-bold mt-0.5">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{m.dataSources.title}</h2>
              <p className="text-gray-700 mb-6">{m.dataSources.description}</p>
              <ol className="space-y-4">
                {m.dataSources.sources.map((s, i) => (
                  <li key={i} className="border-l-4 border-green-500 pl-4 py-1">
                    <h3 className="font-semibold text-gray-900">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="text-gray-700 text-sm mt-1">{s.description}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{m.uncertainty.title}</h2>
              <p className="text-gray-700">{m.uncertainty.description}</p>
            </section>

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Read our{" "}
                <a href="/editorial-policy" className="text-blue-600 hover:underline">
                  editorial policy
                </a>{" "}
                for how this process is executed on every guide.
              </p>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  )
}
