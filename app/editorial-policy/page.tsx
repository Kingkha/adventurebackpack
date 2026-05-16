import type { Metadata } from "next"
import Footer from "../components/Footer"
import { siteConfig, getBaseUrl } from "@/lib/siteConfig"

const canonicalUrl = `${getBaseUrl()}/editorial-policy`
const pageTitle = `Editorial Policy`
const ogTitle = `Editorial Policy | ${siteConfig.brand.name}`
const description = `How ${siteConfig.brand.name} researches, reviews, fact-checks, and updates its travel guides. Our process, sources, and commitment to accuracy.`

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

export default function EditorialPolicyPage() {
  const policy = siteConfig.editorialPolicy

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-16 mt-16">
          <article className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Editorial Policy</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {policy.intro}
              </p>
            </header>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.contentReview.title}</h2>
              <p className="text-gray-700 mb-6">{policy.contentReview.description}</p>
              <ol className="space-y-5">
                {policy.contentReview.steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-gray-700 mt-1">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.sourceVerification.title}</h2>
              <p className="text-gray-700 mb-6">{policy.sourceVerification.description}</p>
              <div className="space-y-4">
                {policy.sourceVerification.sourceTypes.map((src) => (
                  <div key={src.tier} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="font-semibold text-gray-900">{src.tier} sources</p>
                    <p className="text-gray-700 text-sm">{src.examples}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.updateCadence.title}</h2>
              <p className="text-gray-700 mb-6">{policy.updateCadence.description}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-900">Volatility Tier</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Review Frequency</th>
                      <th className="text-left py-2 font-semibold text-gray-900">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {policy.updateCadence.tiers.map((t) => (
                      <tr key={t.tier}>
                        <td className="py-3 text-gray-900 font-medium">{t.tier}</td>
                        <td className="py-3 text-gray-700">{t.frequency}</td>
                        <td className="py-3 text-gray-700 text-sm">{t.examples}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.corrections.title}</h2>
              <p className="text-gray-700">{policy.corrections.description}</p>
              <p className="mt-4">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </p>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.aiDisclosure.title}</h2>
              <p className="text-gray-700">{policy.aiDisclosure.description}</p>
            </section>

            <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{policy.affiliateDisclosure.title}</h2>
              <p className="text-gray-700">{policy.affiliateDisclosure.description}</p>
            </section>

            <div className="text-center mt-12">
              <p className="text-gray-600">
                Questions about our editorial process?{" "}
                <a href="/contact" className="text-blue-600 hover:underline">
                  Contact our team
                </a>
                .
              </p>
            </div>
          </article>
        </div>
      </div>
      <Footer />
    </>
  )
}
